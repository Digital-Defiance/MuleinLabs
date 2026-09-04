import { z } from 'zod';

/**
 * Background music bed.
 *
 * Prefer a Remotion `public/`-relative path:
 * - `soundtrack/ambient.mp3` — shared beds
 * - `audio/<episode-id>/intro-bed.mp3` — episode-local
 * - `episode:intro.mp3` → `audio/<episode-id>/intro.mp3`
 *
 * Bare filenames resolve under `soundtrack/`.
 * Consecutive scenes with the same span `key` share one continuous Audio mount.
 */
export const BgmObjectSchema = z.object({
  src: z.string().min(1),
  volume: z.number().min(0).max(1).optional(),
  duck: z.number().min(0).max(1).optional(),
  loop: z.boolean().optional(),
  key: z.string().min(1).optional(),
});

export const BgmSpecSchema = z.union([z.string().min(1), BgmObjectSchema]);
export const BgmFieldSchema = z.union([BgmSpecSchema, z.null()]);

const atmosphereFields = {
  backgroundAsset: z.string().min(1).optional(),
  bgm: BgmFieldSchema.optional(),
  /**
   * ElevenLabs speech-rate multiplier for this scene only. 1.0 is the default;
   * below 1.0 should slow delivery.
   *
   * MEASURED CAVEAT: `eleven_flash_v2` appears to ignore this. Setting 0.92 on
   * a clip moved it from 15.43 to 15.33 chars/s — a 0.6% change where 8.7% was
   * expected, inside normal generation variance. Verify with a measurement
   * before relying on it; on flash_v2 the effective lever for pacing is
   * sentence structure, not this field.
   *
   * Setting it changes only that scene's fingerprint, so one clip regenerates.
   */
  speed: z.number().min(0.7).max(1.2).optional(),
};

export const SceneSchema = z.discriminatedUnion('kind', [
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
  /** Concept card — headline + claim/pillar kicker over art or gradient. */
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

export const EpisodeScriptSchema = z.object({
  id: z.string(),
  compositionId: z.string(),
  title: z.string(),
  youtubeTitle: z.string(),
  description: z.string(),
  /**
   * Must match HELUT `textbook/preamble.tex` `\livingepoch` (sheet wins).
   * Agents: `.cursor/rules/helut-videos-sync.mdc` in the HELUT repo.
   */
  claimEpoch: z.string().min(1),
  fps: z.number().int().positive().default(30),
  width: z.number().int().positive().default(1920),
  height: z.number().int().positive().default(1080),
  bgm: BgmSpecSchema.optional(),
  scenes: z.array(SceneSchema).min(1),
});

export type BgmSpec = z.infer<typeof BgmSpecSchema>;
export type BgmObject = z.infer<typeof BgmObjectSchema>;
export type Scene = z.infer<typeof SceneSchema>;
export type EpisodeScript = z.infer<typeof EpisodeScriptSchema>;

const PUBLIC_ROOTS = ['soundtrack/', 'audio/', 'story/', 'sfx/'] as const;

export function bgmStaticPath(src: string, episodeId?: string): string {
  const trimmed = src.trim().replace(/^\/+/, '');
  if (!trimmed) return trimmed;

  if (trimmed.startsWith('episode:')) {
    const rest = trimmed.slice('episode:'.length).replace(/^\/+/, '');
    if (!episodeId) {
      throw new Error(
        `bgm src "${src}" uses episode: prefix but no episode id is available`,
      );
    }
    return `audio/${episodeId}/${rest}`;
  }

  for (const root of PUBLIC_ROOTS) {
    if (trimmed.startsWith(root)) return trimmed;
  }

  if (!trimmed.includes('/')) {
    return `soundtrack/${trimmed}`;
  }

  return trimmed;
}

export function normalizeBgmSpec(spec: BgmSpec): BgmObject {
  if (typeof spec === 'string') return { src: spec };
  return spec;
}

export function resolveSceneBgm(
  scene: Scene,
  episode: EpisodeScript,
): BgmObject | null {
  if (scene.bgm === null) return null;
  if (scene.bgm != null) return normalizeBgmSpec(scene.bgm);
  if (episode.bgm != null) return normalizeBgmSpec(episode.bgm);
  return null;
}

export function storyBackgroundStaticPath(
  episodeId: string,
  backgroundAsset: string,
): string {
  const trimmed = backgroundAsset.trim().replace(/^\/+/, '');
  if (trimmed.startsWith('story/')) return trimmed;
  if (trimmed.includes('/')) return `story/${trimmed}`;
  return `story/${episodeId}/${trimmed}`;
}
