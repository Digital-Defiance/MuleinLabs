import type { EpisodeScript, Scene } from './schema';

export const FPS = 30;

/** Silence after a voice clip ends, before the next scene. */
export const AUDIO_TAIL_PAD_SEC = 0.9;

export type AudioSeconds = Readonly<Record<string, number>>;

function hintSec(scene: Scene): number {
  return 'durationHintSec' in scene && scene.durationHintSec
    ? scene.durationHintSec
    : 5;
}

/** Wall-clock seconds for one scene (TTS length when present, else JSON hint). */
export function sceneDurationSec(
  scene: Scene,
  audioSeconds?: AudioSeconds,
): number {
  const clip = audioSeconds?.[scene.id];
  if (clip == null) return hintSec(scene);

  const narratedSeconds = clip + AUDIO_TAIL_PAD_SEC;
  if (scene.kind === 'capture') {
    return Math.max(hintSec(scene), narratedSeconds);
  }
  return narratedSeconds;
}

export function sceneDurationFrames(
  scene: Scene,
  fps = FPS,
  audioSeconds?: AudioSeconds,
): number {
  const exactFrames = sceneDurationSec(scene, audioSeconds) * fps;
  const roundedFrames =
    scene.kind === 'capture' ? Math.ceil(exactFrames) : Math.round(exactFrames);
  return Math.max(1, roundedFrames);
}

export function episodeDurationFrames(
  episode: EpisodeScript,
  fps = episode.fps ?? FPS,
  audioSeconds?: AudioSeconds,
): number {
  return episode.scenes.reduce(
    (sum, scene) => sum + sceneDurationFrames(scene, fps, audioSeconds),
    0,
  );
}

export function sceneStarts(
  episode: EpisodeScript,
  fps = episode.fps ?? FPS,
  audioSeconds?: AudioSeconds,
): number[] {
  const starts: number[] = [];
  let t = 0;
  for (const scene of episode.scenes) {
    starts.push(t);
    t += sceneDurationFrames(scene, fps, audioSeconds);
  }
  return starts;
}
