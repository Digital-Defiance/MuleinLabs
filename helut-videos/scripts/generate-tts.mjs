#!/usr/bin/env node
/**
 * Optional ElevenLabs TTS pass.
 *
 * Reads episode JSON, writes public/audio/<episode-id>/<scene-id>.mp3
 * plus <scene-id>.alignment.json (sentence cues from ElevenLabs timestamps).
 *
 * Requires ELEVENLABS_API_KEY. Without it, prints the dry-run plan and exits 0
 * so local preview stays TTS-free (durationHintSec drives timing).
 *
 * Usage:
 *   npm run tts
 *   npm run tts -- --episode ep00-what-is-helut
 *   npm run tts -- --episode ep00-what-is-helut --scene outro
 *   npm run tts -- --stale
 *   npm run tts -- --sync-dictionary
 *   npm run tts -- --normalize --episode ep01-metal-compiler
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { copyFile, mkdir, readFile, rename, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { speakable } from './lib/speakable.mjs';
import { sentencesFromAlignment } from './lib/alignment.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EP_DIR = path.join(ROOT, 'scripts', 'episodes');
const OUT_DIR = path.join(ROOT, 'public', 'audio');
const PLS_PATH = path.join(ROOT, 'scripts', 'tts', 'helut-academy.pls');
const DICT_CACHE_PATH = path.join(ROOT, 'scripts', 'tts', '.dictionary-ids.json');

/**
 * Untouched ElevenLabs audio, kept so normalization is idempotent.
 *
 * Normalizing a clip in place re-encodes lossy audio, and every re-run
 * compounds that loss and the codec's peak overshoot. Normalizing *from* a
 * preserved original instead keeps the generation count constant no matter how
 * often `--normalize` runs. Lives outside `public/` so it is never bundled into
 * a render, and is gitignored like the delivery clips.
 */
const RAW_DIR = path.join(ROOT, 'scripts', 'tts', 'raw');

/** public/audio/<ep>/<scene>.mp3 → scripts/tts/raw/<ep>/<scene>.mp3 */
function rawPathFor(deliveryPath) {
  return path.join(RAW_DIR, path.relative(OUT_DIR, deliveryPath));
}

const apiKey = process.env.ELEVENLABS_API_KEY;
// Same default as Subspace Lattice academy-videos (`NtS6nEHDYMQC9QczMQuq`).
// Only override if you deliberately want a different narrator.
const voiceId = process.env.ELEVENLABS_VOICE_ID ?? 'NtS6nEHDYMQC9QczMQuq';
const modelIdDefault = process.env.ELEVENLABS_MODEL_ID ?? null;
const episodeFilter = process.argv.includes('--episode')
  ? process.argv[process.argv.indexOf('--episode') + 1]
  : null;
const sceneFilter = process.argv.includes('--scene')
  ? process.argv[process.argv.indexOf('--scene') + 1]
  : null;
const staleOnly = process.argv.includes('--stale');
const syncDictionary = process.argv.includes('--sync-dictionary');
const normalizeOnly = process.argv.includes('--normalize');

// TP is targeted at -3.0 rather than the -1.5 dBTP delivery ceiling on purpose:
// the MP3 encode after loudnorm adds its own peak overshoot, so aiming straight
// at -1.5 lands hot. The -1.5 dB of pre-compensation leaves measured true peak
// under the ceiling with margin for YouTube's re-encode.
const LOUDNESS_TARGET = 'I=-16:TP=-3.0:LRA=11';

function runFfmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn('ffmpeg', ['-nostdin', '-hide_banner', ...args], {
      stdio: ['ignore', 'ignore', 'pipe'],
    });
    let err = '';
    child.stderr?.on('data', (chunk) => {
      err += String(chunk);
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve(err);
      else reject(new Error(`ffmpeg failed (${code}): ${err}`));
    });
  });
}

/**
 * Two-pass EBU R128 normalization.
 *
 * Single-pass `loudnorm` streams its estimate, so it lands roughly 0.75 dB shy
 * of target and cannot honour the true-peak ceiling — measured across this
 * series it left an 11-clip peak overshoot and a 1.7 dB spread. Measuring
 * first, then applying the measured values with `linear=true`, converges to
 * about 0.1 dB and respects TP. Gain-only: durations and alignments are
 * unaffected.
 */
async function normalizeFrom(sourcePath, deliveryPath) {
  const analysis = await runFfmpeg([
    '-i', sourcePath,
    '-af', `loudnorm=${LOUDNESS_TARGET}:print_format=json`,
    '-f', 'null', '-',
  ]);
  const parsed = analysis.match(/\{[^{}]*"input_i"[\s\S]*?\}/);
  if (!parsed) throw new Error(`loudnorm analysis produced no JSON for ${sourcePath}`);
  const m = JSON.parse(parsed[0]);

  // Digital silence measures as -inf and cannot be normalized.
  if (!Number.isFinite(Number(m.input_i))) {
    if (sourcePath !== deliveryPath) await copyFile(sourcePath, deliveryPath);
    return;
  }

  const measured = [
    `measured_I=${m.input_i}`,
    `measured_LRA=${m.input_lra}`,
    `measured_TP=${m.input_tp}`,
    `measured_thresh=${m.input_thresh}`,
    `offset=${m.target_offset}`,
    'linear=true',
  ].join(':');

  // Deliberately no limiter here. `alimiter` defaults to level=enabled, which
  // normalizes the signal *up* to its ceiling — that produced +1.33 dBTP and a
  // 1.6 dB loudness jump. Peak control belongs in the loudnorm TP target above.
  const tmp = `${deliveryPath}.loudnorm-tmp.mp3`;
  await mkdir(path.dirname(deliveryPath), { recursive: true });
  // Encode well above the ElevenLabs source rate so this gain-only pass is close
  // to transparent. Without an explicit -b:a, libmp3lame defaults to 64 kbps at
  // -ac 1, which silently halved the 128 kbps API output on every clip.
  await runFfmpeg([
    '-y', '-loglevel', 'error',
    '-i', sourcePath,
    '-af', `loudnorm=${LOUDNESS_TARGET}:${measured}`,
    '-ar', '44100',
    '-ac', '1',
    '-b:a', '192k',
    tmp,
  ]);
  await rename(tmp, deliveryPath);
}

/**
 * Ensure a preserved original exists, then normalize from it.
 *
 * Clips generated before originals were kept have no pristine source, so the
 * current delivery file is adopted as the baseline. That baseline is already
 * normalized, which is not ideal, but it freezes the generation count instead
 * of adding one on every future run.
 */
async function normalizeClip(deliveryPath, label) {
  const sourcePath = rawPathFor(deliveryPath);
  if (!existsSync(sourcePath)) {
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await copyFile(deliveryPath, sourcePath);
    console.log(`  adopted current clip as source baseline (${label})`);
  }
  await normalizeFrom(sourcePath, deliveryPath);
}

async function plsSha256() {
  const buf = await readFile(PLS_PATH);
  return createHash('sha256').update(buf).digest('hex');
}

function rulesFromPls(plsXml) {
  const alphabetMatch = plsXml.match(/\balphabet\s*=\s*["']([^"']+)["']/i);
  const alphabet = alphabetMatch?.[1]?.trim() || 'ipa';
  const rules = [];
  for (const lexemeMatch of plsXml.matchAll(
    /<lexeme\b[^>]*>([\s\S]*?)<\/lexeme>/gi,
  )) {
    const body = lexemeMatch[1] ?? '';
    const grapheme = body
      .match(/<grapheme\b[^>]*>([\s\S]*?)<\/grapheme>/i)?.[1]
      ?.replace(/<[^>]+>/g, '')
      .trim();
    if (!grapheme) continue;
    const alias = body
      .match(/<alias\b[^>]*>([\s\S]*?)<\/alias>/i)?.[1]
      ?.replace(/<[^>]+>/g, '')
      .trim();
    if (alias) {
      rules.push({
        type: 'alias',
        string_to_replace: grapheme,
        alias,
        case_sensitive: true,
        word_boundaries: true,
      });
      continue;
    }
    const phonemeMatch = body.match(/<phoneme\b([^>]*)>([\s\S]*?)<\/phoneme>/i);
    if (phonemeMatch) {
      const attrs = phonemeMatch[1] ?? '';
      const phoneme = phonemeMatch[2]?.replace(/<[^>]+>/g, '').trim();
      const ruleAlphabet =
        attrs.match(/\balphabet\s*=\s*["']([^"']+)["']/i)?.[1]?.trim() ||
        alphabet;
      if (phoneme) {
        rules.push({
          type: 'phoneme',
          string_to_replace: grapheme,
          phoneme,
          alphabet: ruleAlphabet,
          case_sensitive: true,
          word_boundaries: true,
        });
      }
    }
  }
  return rules;
}

async function ensurePronunciationDictionary() {
  if (!apiKey || !existsSync(PLS_PATH)) return null;

  const sha = await plsSha256();
  const fromEnvId = process.env.ELEVENLABS_PRONUNCIATION_DICTIONARY_ID?.trim();
  const fromEnvVersion =
    process.env.ELEVENLABS_PRONUNCIATION_DICTIONARY_VERSION_ID?.trim();

  if (fromEnvId && fromEnvVersion && !syncDictionary) {
    if (existsSync(DICT_CACHE_PATH)) {
      try {
        const cached = JSON.parse(await readFile(DICT_CACHE_PATH, 'utf8'));
        if (cached?.plsSha256 === sha) {
          return {
            id: fromEnvId,
            versionId: fromEnvVersion,
            plsSha256: sha,
          };
        }
      } catch {
        // Fall through.
      }
    } else {
      return { id: fromEnvId, versionId: fromEnvVersion, plsSha256: sha };
    }
  }

  if (!syncDictionary && existsSync(DICT_CACHE_PATH)) {
    try {
      const cached = JSON.parse(await readFile(DICT_CACHE_PATH, 'utf8'));
      if (cached?.id && cached?.versionId && cached?.plsSha256 === sha) {
        return cached;
      }
    } catch {
      // Fall through.
    }
  }

  const plsXml = await readFile(PLS_PATH, 'utf8');
  const rules = rulesFromPls(plsXml);
  if (rules.length === 0) {
    throw new Error(`No lexeme rules found in ${PLS_PATH}`);
  }

  const res = await fetch(
    'https://api.elevenlabs.io/v1/pronunciation-dictionaries/add-from-rules',
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: 'helut-academy',
        description: 'HELUT concept-series TTS (HELUT, Yosys, TensorLUT, …)',
        rules,
      }),
    },
  );
  if (!res.ok) {
    throw new Error(
      `ElevenLabs dictionary upload ${res.status}: ${await res.text()}`,
    );
  }
  const body = await res.json();
  const locator = {
    id: body.id,
    versionId: body.version_id,
    plsSha256: sha,
  };
  await mkdir(path.dirname(DICT_CACHE_PATH), { recursive: true });
  await writeFile(DICT_CACHE_PATH, JSON.stringify(locator, null, 2) + '\n');
  console.log(
    `pronunciation dictionary ${locator.id} (version ${locator.versionId})`,
  );
  return locator;
}

async function synthesize(text, outPath, dictionary, speed) {
  const modelId =
    modelIdDefault ??
    (dictionary ? 'eleven_flash_v2' : 'eleven_multilingual_v2');

  const payload = {
    text,
    model_id: modelId,
  };
  // Only send voice_settings when a scene asks for a non-default rate, so
  // untouched clips keep byte-identical request shape.
  if (speed != null) {
    payload.voice_settings = { speed };
  }
  if (dictionary) {
    payload.pronunciation_dictionary_locators = [
      {
        pronunciation_dictionary_id: dictionary.id,
        version_id: dictionary.versionId,
      },
    ];
  }

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/with-timestamps?output_format=mp3_44100_128`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  }
  const body = await res.json();
  if (!body?.audio_base64) {
    throw new Error('ElevenLabs response missing audio_base64');
  }
  // Preserve the untouched ElevenLabs audio, then normalize from it. This is
  // the only point where a pristine original exists, so it must be kept before
  // any filtering happens.
  const buf = Buffer.from(body.audio_base64, 'base64');
  const sourcePath = rawPathFor(outPath);
  await mkdir(path.dirname(sourcePath), { recursive: true });
  await writeFile(sourcePath, buf);
  await normalizeFrom(sourcePath, outPath);

  const alignment = body.alignment ?? body.normalized_alignment ?? null;
  const sentences = sentencesFromAlignment(text, alignment);
  const alignPath = outPath.replace(/\.mp3$/i, '.alignment.json');
  await writeFile(
    alignPath,
    JSON.stringify({ spoken: text, sentences, alignment }, null, 2) + '\n',
  );
  return modelId;
}

async function main() {
  if (normalizeOnly) {
    const files = (await readdir(EP_DIR))
    .filter((f) => f.endsWith('.json'))
    .sort();
    let n = 0;
    for (const file of files) {
      const raw = JSON.parse(await readFile(path.join(EP_DIR, file), 'utf8'));
      if (episodeFilter && raw.id !== episodeFilter) continue;
      const dir = path.join(OUT_DIR, raw.id);
      if (!existsSync(dir)) continue;
      for (const scene of raw.scenes) {
        if (sceneFilter && scene.id !== sceneFilter) continue;
        const out = path.join(dir, `${scene.id}.mp3`);
        if (!existsSync(out)) continue;
        console.log(`loudnorm ${raw.id}/${scene.id}…`);
        await normalizeClip(out, `${raw.id}/${scene.id}`);
        n++;
      }
    }
    console.log(`normalized ${n} clip${n === 1 ? '' : 's'} → −16 LUFS`);
    return;
  }

  const dictionary = apiKey ? await ensurePronunciationDictionary() : null;
  const resolvedModel =
    modelIdDefault ??
    (dictionary ? 'eleven_flash_v2' : 'eleven_multilingual_v2');
  // `#speed:` is appended only when a scene overrides the rate. Clips without
  // an override keep their existing fingerprint, so adding this field does not
  // invalidate the rest of the series.
  const spokenKey = (spoken, speed) =>
    [
      spoken,
      `#voice:${voiceId}`,
      `#model:${resolvedModel}`,
      `#dict:${dictionary?.versionId ?? 'none'}`,
      '#align:v1',
      ...(speed != null ? [`#speed:${speed}`] : []),
    ].join('\n');

  const files = (await readdir(EP_DIR))
    .filter((f) => f.endsWith('.json'))
    .sort();
  for (const file of files) {
    const raw = JSON.parse(await readFile(path.join(EP_DIR, file), 'utf8'));
    if (episodeFilter && raw.id !== episodeFilter) continue;
    const dir = path.join(OUT_DIR, raw.id);
    await mkdir(dir, { recursive: true });
    const planPathEarly = path.join(dir, 'plan.json');
    let prevSpoken = new Map();
    if (staleOnly) {
      try {
        const prev = JSON.parse(await readFile(planPathEarly, 'utf8'));
        prevSpoken = new Map(
          (prev.plan ?? []).map((entry) => [entry.scene, entry.spoken]),
        );
      } catch {
        // No prior plan.
      }
    }
    const plan = [];
    let synthesized = 0;
    let skippedFresh = 0;
    for (const scene of raw.scenes) {
      if (sceneFilter && scene.id !== sceneFilter) continue;
      const out = path.join(dir, `${scene.id}.mp3`);
      const alignOut = out.replace(/\.mp3$/i, '.alignment.json');
      const spoken = speakable(scene.voiceover);
      const planSpoken = spokenKey(spoken, scene.speed);
      const fresh =
        staleOnly &&
        prevSpoken.get(scene.id) === planSpoken &&
        existsSync(out) &&
        existsSync(alignOut);
      plan.push({
        scene: scene.id,
        chars: spoken.length,
        spoken: planSpoken,
        out,
      });
      if (fresh) {
        skippedFresh++;
        continue;
      }
      if (!apiKey) {
        if (staleOnly) console.log(`stale ${raw.id}/${scene.id}`);
        continue;
      }
      console.log(
        `tts ${raw.id}/${scene.id}…${scene.speed != null ? ` (speed ${scene.speed})` : ''}`,
      );
      await synthesize(spoken, out, dictionary, scene.speed);
      synthesized++;
    }
    if (sceneFilter && plan.length === 0) {
      console.error(
        `No scene "${sceneFilter}" in ${raw.id}. Available: ${raw.scenes
          .map((s) => s.id)
          .join(', ')}`,
      );
      process.exit(1);
    }
    if (apiKey) {
      const planPath = path.join(dir, 'plan.json');
      let fullPlan = plan;
      if (sceneFilter) {
        try {
          const prev = JSON.parse(await readFile(planPath, 'utf8'));
          const byScene = new Map(
            (prev.plan ?? []).map((entry) => [entry.scene, entry]),
          );
          for (const entry of plan) byScene.set(entry.scene, entry);
          fullPlan = [...byScene.values()];
        } catch {
          // No prior plan.
        }
      }
      await writeFile(
        planPath,
        JSON.stringify({ episode: raw.id, plan: fullPlan }, null, 2),
      );
    }
    if (!apiKey) {
      const staleNote = staleOnly
        ? ` (${plan.length - skippedFresh} stale, ${skippedFresh} fresh)`
        : '';
      console.log(
        `dry-run ${raw.id}: ${plan.length} clips${staleNote} (set ELEVENLABS_API_KEY to generate)`,
      );
    } else {
      const skipNote = staleOnly ? `, ${skippedFresh} already fresh` : '';
      console.log(
        `wrote ${synthesized} clip${synthesized === 1 ? '' : 's'}${skipNote} → ${dir}`,
      );
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
