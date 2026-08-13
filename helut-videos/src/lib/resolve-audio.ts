import { getAudioDurationInSeconds } from '@remotion/media-utils';
import { staticFile } from 'remotion';
import type { Scene } from './schema';
import { sceneAudioStaticPath } from './audio-paths';

/**
 * Measure every available TTS clip for an episode.
 * Missing clips are skipped (scene falls back to durationHintSec).
 */
export async function resolveAudioSeconds(
  episodeId: string,
  scenes: readonly Scene[],
): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const scene of scenes) {
    const src = staticFile(sceneAudioStaticPath(episodeId, scene.id));
    try {
      out[scene.id] = await getAudioDurationInSeconds(src);
    } catch {
      // Clip not generated yet — keep durationHintSec.
    }
  }
  return out;
}
