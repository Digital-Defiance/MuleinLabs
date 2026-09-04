#!/usr/bin/env node
/**
 * What still needs ElevenLabs synthesis — computed, never remembered.
 *
 * Local and free. Makes no network call and needs no API key. Safe to run after
 * an arbitrarily long gap: the answer is derived from the repo, not from notes.
 *
 * Classification per scene:
 *   NEW         no MP3 or no alignment on disk
 *   CHANGED     spoken text differs from the saved plan.json fingerprint
 *   DICTIONARY  text unchanged, but the lexicon changed since the last sync and
 *               this clip speaks at least one lexicon term
 *   OK          reusable as-is
 *
 * Usage:
 *   npm run tts:pending
 *   npm run tts:pending -- --terms HELUT,TensorLUT,JSON   # narrow the lexicon tier
 *   npm run tts:pending -- --commands                     # print only the commands
 */
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { speakable } from './lib/speakable.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EP_DIR = path.join(ROOT, 'scripts', 'episodes');
const AUDIO_DIR = path.join(ROOT, 'public', 'audio');
const PLS_PATH = path.join(ROOT, 'scripts', 'tts', 'helut-academy.pls');
const DICT_CACHE = path.join(ROOT, 'scripts', 'tts', '.dictionary-ids.json');

const argv = process.argv.slice(2);
const commandsOnly = argv.includes('--commands');
const termsArg = argv.includes('--terms')
  ? argv[argv.indexOf('--terms') + 1]
  : null;

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

function lexiconGraphemes() {
  if (!existsSync(PLS_PATH)) return [];
  const xml = readFileSync(PLS_PATH, 'utf8');
  const out = [];
  for (const lexeme of xml.matchAll(/<lexeme\b[^>]*>([\s\S]*?)<\/lexeme>/gi)) {
    const g = lexeme[1]
      .match(/<grapheme\b[^>]*>([\s\S]*?)<\/grapheme>/i)?.[1]
      ?.replace(/<[^>]+>/g, '')
      .trim();
    if (g) out.push(g);
  }
  return out;
}

/** Did the lexicon change since the dictionary was last uploaded? */
function dictionaryState() {
  if (!existsSync(PLS_PATH)) return { stale: false, reason: 'no lexicon file' };
  const sha = createHash('sha256')
    .update(readFileSync(PLS_PATH))
    .digest('hex');
  const cached = readJson(DICT_CACHE);
  if (!cached?.plsSha256) {
    return { stale: true, reason: 'lexicon has never been synced to ElevenLabs' };
  }
  if (cached.plsSha256 !== sha) {
    return {
      stale: true,
      reason:
        'lexicon edited since the last dictionary sync ' +
        `(synced from ${cached.plsSha256.slice(0, 12)}…, now ${sha.slice(0, 12)}…)`,
      note:
        'The synced .pls is not the current file. If it is also not in git, the ' +
        'pronunciations behind existing clips cannot be reconstructed — treat the ' +
        'whole series as needing one consistent dictionary version.',
    };
  }
  return { stale: false, reason: 'lexicon matches the synced dictionary' };
}

/**
 * Rebuild the exact fingerprint `generate-tts.mjs` stamps into plan.json, so a
 * clip is judged current by the same test `--stale` uses — not by a heuristic.
 * Mirrors spokenKey() in the generator.
 */
function expectedFingerprint(spoken, speed) {
  const cached = readJson(DICT_CACHE);
  const hasDict = Boolean(cached?.id && cached?.versionId && existsSync(PLS_PATH));
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? 'NtS6nEHDYMQC9QczMQuq';
  const model =
    process.env.ELEVENLABS_MODEL_ID ??
    (hasDict ? 'eleven_flash_v2' : 'eleven_multilingual_v2');
  return [
    spoken,
    `#voice:${voiceId}`,
    `#model:${model}`,
    `#dict:${hasDict ? cached.versionId : 'none'}`,
    '#align:v1',
    ...(speed != null ? [`#speed:${speed}`] : []),
  ].join('\n');
}

const terms = termsArg
  ? termsArg.split(',').map((t) => t.trim()).filter(Boolean)
  : lexiconGraphemes();

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const termRe = terms.length
  ? new RegExp(`(?<![\\p{L}\\p{N}])(?:${terms.map(escapeRe).join('|')})(?![\\p{L}\\p{N}])`, 'gu')
  : null;

const dict = dictionaryState();
const rows = [];
const orphans = [];

for (const file of readdirSync(EP_DIR).filter((f) => f.endsWith('.json')).sort()) {
  const ep = readJson(path.join(EP_DIR, file));
  if (!ep?.scenes) continue;

  const dir = path.join(AUDIO_DIR, ep.id);
  const plan = readJson(path.join(dir, 'plan.json'))?.plan ?? [];
  const planned = new Map(plan.map((e) => [e.scene, e]));
  const liveIds = new Set(ep.scenes.map((s) => s.id));

  if (existsSync(dir)) {
    for (const name of readdirSync(dir)) {
      const m = name.match(/^(.+)\.mp3$/);
      if (m && !liveIds.has(m[1])) orphans.push({ episode: ep.id, scene: m[1] });
    }
  }

  for (const scene of ep.scenes) {
    const spoken = speakable(scene.voiceover);
    const mp3 = path.join(dir, `${scene.id}.mp3`);
    const align = path.join(dir, `${scene.id}.alignment.json`);
    const recorded = planned.get(scene.id)?.spoken;
    const priorText = recorded?.split('\n#voice:')[0];
    const hits = termRe ? [...new Set(spoken.match(termRe) ?? [])] : [];
    const recordedDict = recorded?.match(/^#dict:(.*)$/m)?.[1];

    const expected = expectedFingerprint(spoken, scene.speed);
    let status;
    let drift = [];
    if (!existsSync(mp3) || !existsSync(align)) status = 'NEW';
    else if (priorText !== spoken) status = 'CHANGED';
    else if (recorded !== expected) {
      status = 'SETTINGS';
      // Name the tags that actually differ, so nobody chases a phantom cause.
      const tags = (s) =>
        new Map(
          (s ?? '')
            .split('\n')
            .filter((l) => l.startsWith('#'))
            .map((l) => [l.slice(0, l.indexOf(':')), l.slice(l.indexOf(':') + 1)]),
        );
      const was = tags(recorded);
      const now = tags(expected);
      for (const key of new Set([...was.keys(), ...now.keys()])) {
        if (was.get(key) !== now.get(key)) {
          drift.push(`${key.slice(1)} ${was.get(key) ?? 'unset'} → ${now.get(key) ?? 'unset'}`);
        }
      }
    } else status = 'OK';

    rows.push({
      episode: ep.id,
      scene: scene.id,
      status,
      hits,
      recordedDict,
      drift,
      chars: spoken.length,
    });
  }
}

const byStatus = (s) => rows.filter((r) => r.status === s);
const pending = rows.filter((r) => r.status !== 'OK');

if (!commandsOnly) {
  console.log(`lexicon: ${dict.reason}`);
  if (dict.note) console.log(`         ${dict.note}`);
  console.log(
    `scenes: ${rows.length} · pending ${pending.length} · reusable ${byStatus('OK').length}`,
  );
  if (dict.stale && byStatus('OK').length > 0) {
    console.log(
      `         "reusable" is nominal: a dictionary re-sync restamps all ${rows.length}.`,
    );
  }
  console.log();

  for (const status of ['NEW', 'CHANGED', 'SETTINGS']) {
    const group = byStatus(status);
    if (group.length === 0) continue;
    const note =
      status === 'NEW'
        ? 'no audio on disk yet'
        : status === 'CHANGED'
          ? 'spoken text differs from the generated clip'
          : 'text matches, but a synthesis setting moved under it';
    console.log(`${status} (${group.length}) — ${note}`);
    for (const r of group) {
      const why = status === 'SETTINGS' && r.drift.length ? `  [${r.drift.join('; ')}]` : '';
      console.log(`  ${r.episode}/${r.scene}${why}`);
    }
    console.log();
  }

  if (orphans.length) {
    console.log(`ORPHANED (${orphans.length}) — clips whose scene id no longer exists`);
    for (const o of orphans) console.log(`  ${o.episode}/${o.scene}`);
    console.log('  (no command below touches these; removal commands are printed at the end)\n');
  }
}

if (pending.length === 0) {
  if (!commandsOnly) console.log('Nothing to synthesize. Every clip is current.');
  process.exit(0);
}

/**
 * Choose a small audition set that between them speak every tracked term, so a
 * listen-through actually exercises each pronunciation before the bulk spend.
 * Greedy set cover, capped so the audition stays cheap.
 */
function auditionSet(limit = 3) {
  const uncovered = new Set(pending.flatMap((r) => r.hits));
  const picked = [];
  const remaining = [...pending];
  while (uncovered.size > 0 && picked.length < limit) {
    remaining.sort(
      (a, b) =>
        b.hits.filter((h) => uncovered.has(h)).length -
        a.hits.filter((h) => uncovered.has(h)).length,
    );
    const best = remaining.shift();
    if (!best || best.hits.filter((h) => uncovered.has(h)).length === 0) break;
    for (const h of best.hits) uncovered.delete(h);
    picked.push(best);
  }
  if (picked.length === 0) picked.push(pending[0]);
  return { picked, uncovered: [...uncovered] };
}

const { picked: auditions, uncovered } = auditionSet();
const audition = auditions[0];

console.log('# Billable from here.');
console.log('export ELEVENLABS_API_KEY=…');

// An audition only earns its cost when the dictionary is about to change. If the
// synced dictionary is unchanged it has already been signed off by ear, so
// auditioning again just pays to re-hear a known-good pronunciation.
if (dict.stale) {
  console.log('npm run check');
  console.log('');
  console.log(
    `# Audition ${auditions.length} clip(s) covering: ` +
      `${[...new Set(auditions.flatMap((a) => a.hits))].join(', ') || 'no tracked terms'}`,
  );
  auditions.forEach((a, i) => {
    const sync = i === 0 ? ' --sync-dictionary' : '';
    console.log(
      `node scripts/generate-tts.mjs${sync} --episode ${a.episode} --scene ${a.scene}`,
    );
    console.log(`afplay public/audio/${a.episode}/${a.scene}.mp3`);
  });
  if (uncovered.length) {
    console.log(`# Not covered by the audition set: ${uncovered.join(', ')}`);
  }
  console.log('# Listen before continuing. A wrong pronunciation here costs a full re-run.');
} else {
  console.log('# Dictionary is unchanged and already signed off, so no audition is needed.');
}

// --stale regenerates exactly the clips whose stored fingerprint differs from
// the one the generator would compute now. That is the same test used to build
// the pending list above, so it is always the correct bulk command: it cannot
// touch a clip this report calls OK, and it cannot skip one it calls pending.
const pendingChars = pending.reduce((n, r) => n + (r.chars ?? 0), 0);
console.log('\n# Regenerate every pending clip in one pass:');
console.log('npm run tts -- --stale');
console.log(`#   ^ regenerates the ${pending.length} pending clip(s), skips the ${
  rows.length - pending.length
} already current.`);
if (pendingChars) {
  console.log(`#     ≈${pendingChars.toLocaleString()} spoken characters.`);
}
console.log('#     Uses npm so the preflight check runs first.');
if (termsArg) {
  console.log('#');
  console.log('#   NOTE: --terms only chose the audition set above. It does not');
  console.log('#   change what --stale regenerates, and it cannot reduce the spend.');
}

if (orphans.length) {
  console.log(`\n# ${orphans.length} orphaned clip(s) no command above touches. To remove:`);
  for (const o of orphans) {
    console.log(
      `rm -f public/audio/${o.episode}/${o.scene}.mp3` +
        ` public/audio/${o.episode}/${o.scene}.alignment.json`,
    );
  }
}

console.log('\n# Verify afterwards — this should report nothing pending:');
console.log('npm run tts:pending');

function rowsTotalChars() {
  let n = 0;
  for (const file of readdirSync(EP_DIR).filter((f) => f.endsWith('.json'))) {
    const ep = readJson(path.join(EP_DIR, file));
    for (const s of ep?.scenes ?? []) n += speakable(s.voiceover).length;
  }
  return n;
}
