#!/usr/bin/env node
/**
 * Local, no-network preflight for episode JSON before TTS or render.
 * Enforces the complete runtime shape consumed by Remotion, then checks IDs,
 * story assets, publication labels, and conservative fallback pacing.
 */
import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { speakable } from './lib/speakable.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const EP_DIR = path.join(ROOT, 'scripts', 'episodes');
const PUBLIC_DIR = path.join(ROOT, 'public');
const PREVIEW_WPM = 165;
const TAIL_SECONDS = 1.5;

// Runtime-equivalent mirror of src/lib/schema.ts. Keep this complete: TTS reads
// raw JSON and must reject everything the Remotion root would reject.
const BgmObjectSchema = z.object({
  src: z.string().min(1),
  volume: z.number().min(0).max(1).optional(),
  duck: z.number().min(0).max(1).optional(),
  loop: z.boolean().optional(),
  key: z.string().min(1).optional(),
});
const BgmSpecSchema = z.union([z.string().min(1), BgmObjectSchema]);
const BgmFieldSchema = z.union([BgmSpecSchema, z.null()]);
const atmosphereFields = {
  backgroundAsset: z.string().min(1).optional(),
  bgm: BgmFieldSchema.optional(),
  // Per-scene ElevenLabs speech-rate multiplier; see src/lib/schema.ts.
  speed: z.number().min(0.7).max(1.2).optional(),
};
const SceneSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('title'),
    id: z.string(),
    voiceover: z.string(),
    durationHintSec: z.number().positive().default(4),
    eyebrow: z.string().optional(),
    headline: z.string(),
    subhead: z.string().optional(),
    ...atmosphereFields,
  }),
  z.object({
    kind: z.literal('narration'),
    id: z.string(),
    voiceover: z.string(),
    durationHintSec: z.number().positive().default(6),
    headline: z.string().optional(),
    bullets: z.array(z.string()).optional(),
    ...atmosphereFields,
  }),
  z.object({
    kind: z.literal('concept'),
    id: z.string(),
    voiceover: z.string(),
    durationHintSec: z.number().positive().default(8),
    headline: z.string(),
    subhead: z.string().optional(),
    kicker: z.string().optional(),
    ...atmosphereFields,
  }),
  z.object({
    kind: z.literal('outro'),
    id: z.string(),
    voiceover: z.string(),
    durationHintSec: z.number().positive().default(5),
    headline: z.string(),
    subhead: z.string().optional(),
    nextEpisode: z.string().optional(),
    ...atmosphereFields,
  }),
]);
const EpisodeScriptSchema = z.object({
  id: z.string(),
  compositionId: z.string(),
  title: z.string(),
  youtubeTitle: z.string(),
  description: z.string(),
  claimEpoch: z.string().min(1),
  fps: z.number().int().positive().default(30),
  width: z.number().int().positive().default(1920),
  height: z.number().int().positive().default(1080),
  bgm: BgmSpecSchema.optional(),
  scenes: z.array(SceneSchema).min(1),
});

function words(text) {
  return String(text).match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu) ?? [];
}

function estimatedSeconds(text) {
  return (words(speakable(text)).length / PREVIEW_WPM) * 60 + TAIL_SECONDS;
}

function storyAssetPath(episodeId, asset) {
  const trimmed = String(asset).trim().replace(/^\/+/, '');
  if (trimmed.startsWith('story/')) return path.join(PUBLIC_DIR, trimmed);
  if (trimmed.includes('/')) return path.join(PUBLIC_DIR, 'story', trimmed);
  return path.join(PUBLIC_DIR, 'story', episodeId, trimmed);
}

function fail(errors, where, message) {
  errors.push(`${where}: ${message}`);
}

async function main() {
  const files = (await readdir(EP_DIR))
    .filter((file) => file.endsWith('.json'))
    .sort();
  if (files.length === 0) throw new Error(`No episode JSON found in ${EP_DIR}`);

  const errors = [];
  const episodeIds = new Set();
  const compositionIds = new Set();
  let grandSeconds = 0;
  let grandScenes = 0;

  for (const file of files) {
    const where = file;
    let raw;
    try {
      raw = JSON.parse(await readFile(path.join(EP_DIR, file), 'utf8'));
    } catch (error) {
      fail(errors, where, `invalid JSON (${error.message})`);
      continue;
    }

    const parsed = EpisodeScriptSchema.safeParse(raw);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const issuePath = issue.path.length ? issue.path.join('.') : '(root)';
        fail(errors, where, `schema ${issuePath}: ${issue.message}`);
      }
      continue;
    }
    const episode = parsed.data;

    for (const field of [
      'id',
      'compositionId',
      'title',
      'youtubeTitle',
      'description',
      'claimEpoch',
    ]) {
      if (typeof episode[field] !== 'string' || !episode[field].trim()) {
        fail(errors, where, `missing non-empty ${field}`);
      }
    }
    if (episodeIds.has(episode.id)) fail(errors, where, `duplicate id ${episode.id}`);
    if (compositionIds.has(episode.compositionId)) {
      fail(errors, where, `duplicate compositionId ${episode.compositionId}`);
    }
    episodeIds.add(episode.id);
    compositionIds.add(episode.compositionId);

    if (episode.youtubeTitle.length > 100) {
      fail(errors, where, 'youtubeTitle exceeds 100 characters');
    }
    const pin = episode.claimEpoch.match(/C(\d+)$/)?.[1];
    const labels = [...episode.description.matchAll(/\bEpoch\s+C(\d+)\b/gi)].map(
      (match) => match[1],
    );
    if (!pin) fail(errors, where, 'claimEpoch must end in C<number>');
    if (labels.length !== 1) {
      fail(errors, where, 'description must carry exactly one "Epoch C<number>" label');
    } else if (pin && labels[0] !== pin) {
      fail(errors, where, `description says C${labels[0]} but claimEpoch ends in C${pin}`);
    }

    const sceneIds = new Set();
    let episodeSeconds = 0;
    for (const scene of episode.scenes) {
      const sceneWhere = `${episode.id}/${scene.id || '(missing id)'}`;
      if (!/^[a-z0-9][a-z0-9-]*$/.test(scene.id)) {
        fail(errors, sceneWhere, 'scene id must be lower-kebab-case');
      }
      if (sceneIds.has(scene.id)) fail(errors, sceneWhere, 'duplicate scene id');
      sceneIds.add(scene.id);
      if (!scene.voiceover.trim()) {
        fail(errors, sceneWhere, 'missing voiceover');
        continue;
      }

      const estimated = estimatedSeconds(scene.voiceover);
      if (scene.durationHintSec + 0.05 < estimated) {
        fail(
          errors,
          sceneWhere,
          `durationHintSec ${scene.durationHintSec}s is below ${estimated.toFixed(1)}s preview estimate (${PREVIEW_WPM} wpm + tail)`,
        );
      }
      episodeSeconds += scene.durationHintSec;
      grandScenes++;

      if (scene.backgroundAsset) {
        const assetPath = storyAssetPath(episode.id, scene.backgroundAsset);
        if (!existsSync(assetPath)) {
          fail(errors, sceneWhere, `missing background asset ${path.relative(ROOT, assetPath)}`);
        }
      }
    }

    grandSeconds += episodeSeconds;
    console.log(
      `ok ${episode.compositionId.padEnd(9)} ${String(episode.scenes.length).padStart(2)} scenes · ${episodeSeconds.toFixed(0)}s fallback · ${episode.id}`,
    );
  }

  if (errors.length > 0) {
    console.error(`\n${errors.length} episode preflight error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(
    `\n${files.length} episodes · ${grandScenes} scenes · ${(grandSeconds / 60).toFixed(1)} fallback minutes · schema, assets, and pacing ready`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
