#!/usr/bin/env node
/**
 * Deterministically derive the ep00 delivery track from preserved ElevenLabs
 * sources. Canonical TTS files and plan fingerprints are never modified.
 *
 * Usage:
 *   npm run pace:ep00
 *   npm run pace:ep00 -- --force
 *   npm run pace:ep00:check
 */
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import {
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  writeFile,
} from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { sentenceRanges } from './lib/alignment.mjs';
import { speakable } from './lib/speakable.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EPISODE_ID = 'ep00-what-is-helut';
const EPISODE_PATH = path.join(ROOT, 'scripts', 'episodes', `${EPISODE_ID}.json`);
const RAW_DIR = path.join(ROOT, 'scripts', 'tts', 'raw', EPISODE_ID);
const SOURCE_DIR = path.join(ROOT, 'public', 'audio', EPISODE_ID);
const OUTPUT_DIR = path.join(SOURCE_DIR, 'paced-v1');
const MANIFEST_PATH = path.join(OUTPUT_DIR, 'derivation.json');
const CHECK_ONLY = process.argv.includes('--check');
const FORCE = process.argv.includes('--force');
const VALID_ARGS = new Set(['--check', '--force']);

const SAMPLE_RATE = 44_100;
const PAUSE_SAMPLES = 19_845; // Exactly 0.45 seconds at 44.1 kHz.
const TARGET_CHARS_PER_SEC = 15.3;
const MIN_TEMPO = 0.85;
const MAX_TEMPO = 1.15;
const LOUDNESS_TARGET = 'I=-16:TP=-3.0:LRA=11';
const ALIGNMENT_PRECISION = 9;
const ALGORITHM_ID = 'sentence-paced-v1';

for (const arg of process.argv.slice(2)) {
  if (!VALID_ARGS.has(arg)) throw new Error(`Unknown argument: ${arg}`);
}
if (CHECK_ONLY && FORCE) throw new Error('--check and --force cannot be combined');

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', (chunk) => {
      stdout += String(chunk);
    });
    child.stderr?.on('data', (chunk) => {
      stderr += String(chunk);
    });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else {
        reject(
          new Error(
            `${command} failed (${code}): ${(stderr || stdout).trim()}`,
          ),
        );
      }
    });
  });
}

async function runFfmpeg(args) {
  return run('ffmpeg', ['-nostdin', '-hide_banner', ...args]);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function sha256(filePath) {
  const bytes = await readFile(filePath);
  return createHash('sha256').update(bytes).digest('hex');
}

function sha256Text(text) {
  return createHash('sha256').update(text).digest('hex');
}

function relative(filePath) {
  return path.relative(ROOT, filePath).split(path.sep).join('/');
}

function rounded(value, digits = 6) {
  return Number(value.toFixed(digits));
}

function seconds(sample) {
  return Number((sample / SAMPLE_RATE).toFixed(ALIGNMENT_PRECISION));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function coefficientOfVariation(values) {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  if (mean === 0) return 0;
  const variance =
    values.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
    values.length;
  return Math.sqrt(variance) / mean;
}

function sameJson(left, right) {
  return JSON.stringify(left) === JSON.stringify(right);
}

async function fileRecord(filePath) {
  if (!existsSync(filePath)) throw new Error(`Missing source: ${relative(filePath)}`);
  return { path: relative(filePath), sha256: await sha256(filePath) };
}

async function ffmpegVersion() {
  const { stdout } = await run('ffmpeg', ['-version']);
  const firstLine = stdout.trim().split(/\r?\n/, 1)[0];
  if (!firstLine) throw new Error('Could not determine ffmpeg version');
  return firstLine;
}

async function probeDuration(filePath) {
  const { stdout } = await run('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    filePath,
  ]);
  const duration = Number(stdout.trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Invalid media duration for ${relative(filePath)}: ${stdout.trim()}`);
  }
  return duration;
}

async function normalizeFrom(sourcePath, outputPath) {
  const { stderr } = await runFfmpeg([
    '-i',
    sourcePath,
    '-af',
    `loudnorm=${LOUDNESS_TARGET}:print_format=json`,
    '-f',
    'null',
    '-',
  ]);
  const parsed = stderr.match(/\{[^{}]*"input_i"[\s\S]*?\}/);
  if (!parsed) throw new Error(`loudnorm produced no analysis for ${relative(sourcePath)}`);
  const measured = JSON.parse(parsed[0]);
  if (!Number.isFinite(Number(measured.input_i))) {
    throw new Error(`Refusing to normalize silent paced audio: ${relative(sourcePath)}`);
  }

  const measuredArgs = [
    `measured_I=${measured.input_i}`,
    `measured_LRA=${measured.input_lra}`,
    `measured_TP=${measured.input_tp}`,
    `measured_thresh=${measured.input_thresh}`,
    `offset=${measured.target_offset}`,
    'linear=true',
  ].join(':');

  await runFfmpeg([
    '-y',
    '-loglevel',
    'error',
    '-i',
    sourcePath,
    '-af',
    `loudnorm=${LOUDNESS_TARGET}:${measuredArgs}`,
    '-ar',
    String(SAMPLE_RATE),
    '-ac',
    '1',
    '-c:a',
    'libmp3lame',
    '-b:a',
    '192k',
    '-map_metadata',
    '-1',
    outputPath,
  ]);
}

function validateSourceAlignment(scene, sidecar) {
  const expectedSpoken = speakable(scene.voiceover);
  if (sidecar?.spoken !== expectedSpoken) {
    throw new Error(`${scene.id}: source alignment is stale for the current voiceover`);
  }

  const alignment = sidecar.alignment;
  const characters = alignment?.characters;
  const starts = alignment?.character_start_times_seconds;
  const ends = alignment?.character_end_times_seconds;
  if (!Array.isArray(characters) || characters.length === 0) {
    throw new Error(`${scene.id}: source alignment has no characters`);
  }
  if (!Array.isArray(starts) || !Array.isArray(ends)) {
    throw new Error(`${scene.id}: source alignment has no character timestamps`);
  }
  if (characters.length !== starts.length || characters.length !== ends.length) {
    throw new Error(`${scene.id}: source alignment arrays have different lengths`);
  }
  if (characters.join('') !== sidecar.spoken) {
    throw new Error(`${scene.id}: aligned characters do not reproduce spoken text`);
  }

  let previousStart = -Infinity;
  let previousEnd = -Infinity;
  for (let index = 0; index < characters.length; index++) {
    const start = starts[index];
    const end = ends[index];
    if (typeof characters[index] !== 'string') {
      throw new Error(`${scene.id}: invalid character at index ${index}`);
    }
    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start) {
      throw new Error(`${scene.id}: invalid timestamp at character ${index}`);
    }
    if (start < previousStart || end < previousEnd) {
      throw new Error(`${scene.id}: non-monotonic timestamp at character ${index}`);
    }
    previousStart = start;
    previousEnd = end;
  }

  const ranges = sentenceRanges(sidecar.spoken);
  if (ranges.length === 0) throw new Error(`${scene.id}: no sentence ranges`);
  if (!Array.isArray(sidecar.sentences) || sidecar.sentences.length !== ranges.length) {
    throw new Error(`${scene.id}: source sentence cues do not match spoken text`);
  }
  for (let index = 0; index < ranges.length; index++) {
    if (sidecar.sentences[index]?.text !== ranges[index].text) {
      throw new Error(`${scene.id}: source sentence ${index + 1} text differs`);
    }
  }

  return { alignment, ranges };
}

function buildSentencePlan(sceneId, spoken, alignment, ranges) {
  const starts = alignment.character_start_times_seconds;
  const ends = alignment.character_end_times_seconds;
  const planned = [];
  let outputCursor = 0;

  for (let index = 0; index < ranges.length; index++) {
    const range = ranges[index];
    let firstChar = range.start;
    let lastChar = range.end - 1;
    while (firstChar < range.end && /\s/.test(spoken[firstChar] ?? '')) firstChar++;
    while (lastChar >= firstChar && /\s/.test(spoken[lastChar] ?? '')) lastChar--;
    if (lastChar < firstChar) throw new Error(`${sceneId}: empty sentence ${index + 1}`);

    const sourceStartSample = Math.round(starts[firstChar] * SAMPLE_RATE);
    const sourceEndSample = Math.round(ends[lastChar] * SAMPLE_RATE);
    const sourceSamples = sourceEndSample - sourceStartSample;
    if (sourceSamples <= 0) {
      throw new Error(`${sceneId}: sentence ${index + 1} has no source duration`);
    }

    const spokenChars = lastChar - firstChar + 1;
    const sourceRate = (spokenChars * SAMPLE_RATE) / sourceSamples;
    const requestedTempo = TARGET_CHARS_PER_SEC / sourceRate;
    const boundedTempo = clamp(requestedTempo, MIN_TEMPO, MAX_TEMPO);
    const outputSamples = Math.max(1, Math.round(sourceSamples / boundedTempo));
    const appliedTempo = sourceSamples / outputSamples;
    const outputStartSample = outputCursor;
    const outputEndSample = outputStartSample + outputSamples;

    planned.push({
      index,
      text: range.text,
      rangeStart: range.start,
      rangeEnd: range.end,
      firstChar,
      lastChar,
      spokenChars,
      sourceStartSample,
      sourceEndSample,
      sourceRate: rounded(sourceRate),
      requestedTempo: rounded(requestedTempo),
      appliedTempo: rounded(appliedTempo, 9),
      outputStartSample,
      outputEndSample,
      outputRate: rounded((spokenChars * SAMPLE_RATE) / outputSamples),
    });
    outputCursor = outputEndSample;
    if (index < ranges.length - 1) outputCursor += PAUSE_SAMPLES;
  }

  return { sentences: planned, outputSamples: outputCursor };
}

function transformAlignment(sidecar, sentencePlan) {
  const source = sidecar.alignment;
  const characters = [...source.characters];
  const transformedStarts = new Array(characters.length);
  const transformedEnds = new Array(characters.length);

  for (const sentence of sentencePlan.sentences) {
    const {
      rangeStart,
      rangeEnd,
      firstChar,
      lastChar,
      sourceStartSample,
      outputStartSample,
      outputEndSample,
      appliedTempo,
      index,
    } = sentence;

    for (let charIndex = firstChar; charIndex <= lastChar; charIndex++) {
      const oldStart = Math.round(
        source.character_start_times_seconds[charIndex] * SAMPLE_RATE,
      );
      const oldEnd = Math.round(
        source.character_end_times_seconds[charIndex] * SAMPLE_RATE,
      );
      const mappedStart =
        outputStartSample + Math.round((oldStart - sourceStartSample) / appliedTempo);
      const mappedEnd =
        outputStartSample + Math.round((oldEnd - sourceStartSample) / appliedTempo);
      transformedStarts[charIndex] = clamp(
        mappedStart,
        outputStartSample,
        outputEndSample,
      );
      transformedEnds[charIndex] = clamp(
        Math.max(mappedEnd, transformedStarts[charIndex]),
        outputStartSample,
        outputEndSample,
      );
    }

    for (let charIndex = rangeStart; charIndex < firstChar; charIndex++) {
      transformedStarts[charIndex] = outputStartSample;
      transformedEnds[charIndex] = outputStartSample;
    }

    const trailingCount = rangeEnd - lastChar - 1;
    const pauseStart = outputEndSample;
    const pauseEnd =
      index < sentencePlan.sentences.length - 1
        ? sentencePlan.sentences[index + 1].outputStartSample
        : outputEndSample;
    for (let offset = 0; offset < trailingCount; offset++) {
      const charIndex = lastChar + 1 + offset;
      transformedStarts[charIndex] =
        pauseStart + Math.floor(((pauseEnd - pauseStart) * offset) / trailingCount);
      transformedEnds[charIndex] =
        pauseStart + Math.floor(((pauseEnd - pauseStart) * (offset + 1)) / trailingCount);
    }
  }

  for (let index = 0; index < characters.length; index++) {
    if (!Number.isInteger(transformedStarts[index]) || !Number.isInteger(transformedEnds[index])) {
      throw new Error(`Failed to transform alignment character ${index}`);
    }
    if (index > 0 && transformedStarts[index] < transformedStarts[index - 1]) {
      throw new Error(`Transformed alignment is non-monotonic at character ${index}`);
    }
  }

  const sentences = sentencePlan.sentences.map((sentence, index) => ({
    text: sentence.text,
    startSec: seconds(sentence.outputStartSample),
    endSec: seconds(
      index < sentencePlan.sentences.length - 1
        ? sentencePlan.sentences[index + 1].outputStartSample
        : sentence.outputEndSample,
    ),
  }));

  return {
    spoken: sidecar.spoken,
    sentences,
    alignment: {
      characters,
      character_start_times_seconds: transformedStarts.map(seconds),
      character_end_times_seconds: transformedEnds.map(seconds),
    },
  };
}

function buildFilterGraph(sentencePlan) {
  const count = sentencePlan.sentences.length;
  const graph = [];
  const inputs = sentencePlan.sentences.map((_, index) => `[source${index}]`).join('');
  if (count === 1) {
    graph.push(
      `[0:a]aformat=sample_fmts=fltp:sample_rates=${SAMPLE_RATE}:channel_layouts=mono[source0]`,
    );
  } else {
    graph.push(
      `[0:a]aformat=sample_fmts=fltp:sample_rates=${SAMPLE_RATE}:channel_layouts=mono,asplit=${count}${inputs}`,
    );
  }

  for (const sentence of sentencePlan.sentences) {
    graph.push(
      `[source${sentence.index}]` +
        `atrim=start_sample=${sentence.sourceStartSample}:end_sample=${sentence.sourceEndSample},` +
        'asetpts=PTS-STARTPTS,' +
        `atempo=${sentence.appliedTempo.toFixed(9)},` +
        `apad=whole_len=${sentence.outputEndSample - sentence.outputStartSample},` +
        `atrim=end_sample=${sentence.outputEndSample - sentence.outputStartSample},` +
        'asetpts=N/SR/TB' +
        `[sentence${sentence.index}]`,
    );
    if (sentence.index < count - 1) {
      graph.push(
        `anullsrc=r=${SAMPLE_RATE}:cl=mono,` +
          `atrim=end_sample=${PAUSE_SAMPLES},asetpts=N/SR/TB[pause${sentence.index}]`,
      );
    }
  }

  const concatInputs = sentencePlan.sentences
    .map((sentence) =>
      sentence.index < count - 1
        ? `[sentence${sentence.index}][pause${sentence.index}]`
        : `[sentence${sentence.index}]`,
    )
    .join('');
  graph.push(`${concatInputs}concat=n=${count * 2 - 1}:v=0:a=1[paced]`);
  return graph.join(';');
}

async function renderPacedAudio(rawPath, sentencePlan, wavPath, mp3Path) {
  const graph = buildFilterGraph(sentencePlan);
  await runFfmpeg([
    '-y',
    '-loglevel',
    'error',
    '-i',
    rawPath,
    '-filter_complex',
    graph,
    '-map',
    '[paced]',
    '-ar',
    String(SAMPLE_RATE),
    '-ac',
    '1',
    '-c:a',
    'pcm_s16le',
    '-map_metadata',
    '-1',
    wavPath,
  ]);
  await normalizeFrom(wavPath, mp3Path);
}

function sceneSummary(sentencePlan) {
  const sourceRates = sentencePlan.sentences.map((sentence) => sentence.sourceRate);
  const outputRates = sentencePlan.sentences.map((sentence) => sentence.outputRate);
  const totalChars = sentencePlan.sentences.reduce(
    (sum, sentence) => sum + sentence.spokenChars,
    0,
  );
  const sourceSamples = sentencePlan.sentences.reduce(
    (sum, sentence) =>
      sum + sentence.sourceEndSample - sentence.sourceStartSample,
    0,
  );
  const outputLexicalSamples = sentencePlan.sentences.reduce(
    (sum, sentence) =>
      sum + sentence.outputEndSample - sentence.outputStartSample,
    0,
  );
  return {
    sentenceCount: sentencePlan.sentences.length,
    sourceLexicalCharsPerSec: rounded((totalChars * SAMPLE_RATE) / sourceSamples),
    outputLexicalCharsPerSec: rounded(
      (totalChars * SAMPLE_RATE) / outputLexicalSamples,
    ),
    sourceSentenceRateCv: rounded(coefficientOfVariation(sourceRates), 4),
    outputSentenceRateCv: rounded(coefficientOfVariation(outputRates), 4),
    sentencePauseSec:
      sentencePlan.sentences.length > 1 ? PAUSE_SAMPLES / SAMPLE_RATE : null,
    scheduledDurationSec: seconds(sentencePlan.outputSamples),
  };
}

async function prepareScene(scene) {
  const rawPath = path.join(RAW_DIR, `${scene.id}.mp3`);
  const canonicalPath = path.join(SOURCE_DIR, `${scene.id}.mp3`);
  const alignmentPath = path.join(SOURCE_DIR, `${scene.id}.alignment.json`);
  const sidecar = await readJson(alignmentPath);
  const { alignment, ranges } = validateSourceAlignment(scene, sidecar);
  const sentencePlan = buildSentencePlan(scene.id, sidecar.spoken, alignment, ranges);
  const transformed = transformAlignment(sidecar, sentencePlan);
  const transformedText = `${JSON.stringify(transformed, null, 2)}\n`;
  const rawDurationSec = await probeDuration(rawPath);
  const finalAlignedSec = alignment.character_end_times_seconds.at(-1);
  if (finalAlignedSec > rawDurationSec + 0.1) {
    throw new Error(
      `${scene.id}: alignment ends at ${finalAlignedSec}s after ${rawDurationSec}s source`,
    );
  }

  return {
    scene,
    rawPath,
    sentencePlan,
    transformedText,
    source: {
      rawMp3: await fileRecord(rawPath),
      canonicalMp3: await fileRecord(canonicalPath),
      alignment: await fileRecord(alignmentPath),
      rawDurationSec: rounded(rawDurationSec, 9),
      spokenSha256: sha256Text(sidecar.spoken),
    },
    outputPaths: {
      mp3: path.join(OUTPUT_DIR, `${scene.id}.mp3`),
      alignment: path.join(OUTPUT_DIR, `${scene.id}.alignment.json`),
    },
    outputAlignmentSha256: sha256Text(transformedText),
    summary: sceneSummary(sentencePlan),
  };
}

async function outputIsReusable(prepared, previousScene, algorithm) {
  if (FORCE || !previousScene) return false;
  if (!sameJson(previousScene.source, prepared.source)) return false;
  if (!sameJson(previousScene.algorithm, algorithm)) return false;
  if (!existsSync(prepared.outputPaths.mp3) || !existsSync(prepared.outputPaths.alignment)) {
    return false;
  }
  if ((await sha256(prepared.outputPaths.alignment)) !== prepared.outputAlignmentSha256) {
    return false;
  }
  return (await sha256(prepared.outputPaths.mp3)) === previousScene.output?.mp3?.sha256;
}

async function verifySourcesUnchanged(preparedScenes, planRecord) {
  if ((await sha256(path.join(SOURCE_DIR, 'plan.json'))) !== planRecord.sha256) {
    throw new Error('Source TTS plan changed during pacing derivation');
  }
  for (const prepared of preparedScenes) {
    for (const source of [
      prepared.source.rawMp3,
      prepared.source.canonicalMp3,
      prepared.source.alignment,
    ]) {
      if ((await sha256(path.join(ROOT, source.path))) !== source.sha256) {
        throw new Error(`Source changed during pacing derivation: ${source.path}`);
      }
    }
  }
}

async function verifyManifest({ episode, algorithm, planRecord, preparedScenes }) {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error('Missing paced-v1/derivation.json; run npm run pace:ep00');
  }
  const manifest = await readJson(MANIFEST_PATH);
  if (manifest.version !== 1 || manifest.episode !== EPISODE_ID) {
    throw new Error('Unsupported ep00 pacing manifest');
  }
  if (!sameJson(manifest.algorithm, algorithm)) {
    throw new Error('Pacing algorithm or ffmpeg version changed; rederive ep00');
  }
  if (!sameJson(manifest.sourcePlan, planRecord)) {
    throw new Error('Source TTS plan changed; rederive ep00');
  }

  const expectedIds = episode.scenes.map((scene) => scene.id);
  const actualIds = manifest.scenes?.map((scene) => scene.scene) ?? [];
  if (!sameJson(actualIds, expectedIds)) {
    throw new Error('Pacing manifest does not contain exactly the live ep00 scenes');
  }

  for (const prepared of preparedScenes) {
    const recorded = manifest.scenes.find((scene) => scene.scene === prepared.scene.id);
    if (!sameJson(recorded?.source, prepared.source)) {
      throw new Error(`${prepared.scene.id}: source hashes changed; rederive ep00`);
    }
    if (!sameJson(recorded?.algorithm, algorithm)) {
      throw new Error(`${prepared.scene.id}: pacing settings changed; rederive ep00`);
    }
    if (!sameJson(recorded?.summary, prepared.summary)) {
      throw new Error(`${prepared.scene.id}: pacing schedule changed; rederive ep00`);
    }
    if (!sameJson(recorded?.sentences, prepared.sentencePlan.sentences)) {
      throw new Error(`${prepared.scene.id}: sentence schedule changed; rederive ep00`);
    }
    if (!existsSync(prepared.outputPaths.mp3) || !existsSync(prepared.outputPaths.alignment)) {
      throw new Error(`${prepared.scene.id}: paced output pair is incomplete`);
    }
    if ((await sha256(prepared.outputPaths.alignment)) !== prepared.outputAlignmentSha256) {
      throw new Error(`${prepared.scene.id}: transformed alignment differs from schedule`);
    }
    if ((await sha256(prepared.outputPaths.mp3)) !== recorded.output?.mp3?.sha256) {
      throw new Error(`${prepared.scene.id}: paced MP3 hash differs from manifest`);
    }
    if ((await sha256(prepared.outputPaths.alignment)) !== recorded.output?.alignment?.sha256) {
      throw new Error(`${prepared.scene.id}: paced alignment hash differs from manifest`);
    }
    const duration = await probeDuration(prepared.outputPaths.mp3);
    if (Math.abs(duration - recorded.output.durationSec) > 0.001) {
      throw new Error(`${prepared.scene.id}: paced MP3 duration differs from manifest`);
    }
    if (duration + 0.1 < prepared.summary.scheduledDurationSec) {
      throw new Error(`${prepared.scene.id}: paced MP3 is shorter than its alignment`);
    }
  }

  const expectedFiles = new Set([
    'derivation.json',
    ...expectedIds.flatMap((id) => [`${id}.alignment.json`, `${id}.mp3`]),
  ]);
  const actualFiles = (await readdir(OUTPUT_DIR)).filter((name) => !name.startsWith('.'));
  const extras = actualFiles.filter((name) => !expectedFiles.has(name));
  const missing = [...expectedFiles].filter((name) => !actualFiles.includes(name));
  if (extras.length || missing.length) {
    throw new Error(
      `paced-v1 file set differs (extra: ${extras.join(', ') || 'none'}; missing: ${missing.join(', ') || 'none'})`,
    );
  }

  await verifySourcesUnchanged(preparedScenes, planRecord);
  const medianCv = [...manifest.scenes]
    .map((scene) => scene.summary.outputSentenceRateCv)
    .sort((a, b) => a - b)[Math.floor(manifest.scenes.length / 2)];
  console.log(
    `✓ ${EPISODE_ID} paced-v1: ${manifest.scenes.length} scenes, ` +
      `median sentence-rate CV ${medianCv.toFixed(3)}, 0.450 s pauses`,
  );
}

async function main() {
  const episode = await readJson(EPISODE_PATH);
  if (episode.id !== EPISODE_ID || !Array.isArray(episode.scenes)) {
    throw new Error(`Expected ${EPISODE_ID} episode script`);
  }

  const toolVersion = await ffmpegVersion();
  const algorithm = {
    id: ALGORITHM_ID,
    targetCharsPerSec: TARGET_CHARS_PER_SEC,
    minTempo: MIN_TEMPO,
    maxTempo: MAX_TEMPO,
    sentencePauseSamples: PAUSE_SAMPLES,
    sentencePauseSec: PAUSE_SAMPLES / SAMPLE_RATE,
    sampleRate: SAMPLE_RATE,
    channels: 1,
    codec: 'libmp3lame',
    bitrate: '192k',
    loudnessTarget: LOUDNESS_TARGET,
    alignmentPrecision: ALIGNMENT_PRECISION,
    ffmpegVersion: toolVersion,
  };
  const planRecord = await fileRecord(path.join(SOURCE_DIR, 'plan.json'));
  const preparedScenes = [];
  for (const scene of episode.scenes) preparedScenes.push(await prepareScene(scene));

  if (CHECK_ONLY) {
    await verifyManifest({ episode, algorithm, planRecord, preparedScenes });
    return;
  }

  let previous = null;
  if (existsSync(MANIFEST_PATH)) {
    try {
      previous = await readJson(MANIFEST_PATH);
    } catch {
      // A malformed manifest is never reused; complete outputs are rebuilt.
    }
  }
  const previousByScene = new Map(
    (previous?.scenes ?? []).map((scene) => [scene.scene, scene]),
  );

  await mkdir(OUTPUT_DIR, { recursive: true });
  const stageDir = path.join(OUTPUT_DIR, `.derive-${process.pid}`);
  await mkdir(stageDir, { recursive: true });
  const records = [];
  const staged = [];

  try {
    for (const prepared of preparedScenes) {
      const previousScene = previousByScene.get(prepared.scene.id);
      const reusable = await outputIsReusable(prepared, previousScene, algorithm);
      if (reusable) {
        records.push(previousScene);
        console.log(`  reuse ${prepared.scene.id}`);
        continue;
      }

      const stageWav = path.join(stageDir, `${prepared.scene.id}.wav`);
      const stageMp3 = path.join(stageDir, `${prepared.scene.id}.mp3`);
      const stageAlignment = path.join(
        stageDir,
        `${prepared.scene.id}.alignment.json`,
      );
      console.log(`  pace ${prepared.scene.id}`);
      await renderPacedAudio(
        prepared.rawPath,
        prepared.sentencePlan,
        stageWav,
        stageMp3,
      );
      await writeFile(stageAlignment, prepared.transformedText);
      const durationSec = rounded(await probeDuration(stageMp3), 9);
      const record = {
        scene: prepared.scene.id,
        algorithm,
        source: prepared.source,
        output: {
          mp3: {
            path: relative(prepared.outputPaths.mp3),
            sha256: await sha256(stageMp3),
          },
          alignment: {
            path: relative(prepared.outputPaths.alignment),
            sha256: await sha256(stageAlignment),
          },
          durationSec,
        },
        summary: prepared.summary,
        sentences: prepared.sentencePlan.sentences,
      };
      records.push(record);
      staged.push({ prepared, stageMp3, stageAlignment });
    }

    await verifySourcesUnchanged(preparedScenes, planRecord);
    for (const entry of staged) {
      await rename(entry.stageMp3, entry.prepared.outputPaths.mp3);
      await rename(entry.stageAlignment, entry.prepared.outputPaths.alignment);
    }

    const manifest = {
      version: 1,
      episode: EPISODE_ID,
      sourcePlan: planRecord,
      algorithm,
      scenes: records,
    };
    const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;
    const previousText = existsSync(MANIFEST_PATH)
      ? await readFile(MANIFEST_PATH, 'utf8')
      : null;
    if (manifestText !== previousText) {
      const temporaryManifest = path.join(
        OUTPUT_DIR,
        `.derivation-${process.pid}.json`,
      );
      await writeFile(temporaryManifest, manifestText);
      await rename(temporaryManifest, MANIFEST_PATH);
    }
  } finally {
    await rm(stageDir, { recursive: true, force: true });
  }

  console.log(
    `✓ derived ${staged.length}, reused ${preparedScenes.length - staged.length}; ` +
      'canonical TTS untouched',
  );
  await verifyManifest({ episode, algorithm, planRecord, preparedScenes });
}

main().catch((error) => {
  console.error(`ep00 pacing failed: ${error.message}`);
  process.exitCode = 1;
});
