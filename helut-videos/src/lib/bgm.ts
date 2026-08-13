import type { BgmObject, EpisodeScript, Scene } from './schema';
import { bgmStaticPath, resolveSceneBgm } from './schema';
import {
  AUDIO_TAIL_PAD_SEC,
  type AudioSeconds,
  FPS,
  sceneDurationFrames,
  sceneStarts,
} from './timing';

export const BGM_CROSSFADE_FRAMES = 30;
export const BGM_FADE_SEC = 1.5;
export const BGM_END_FADE_SEC = 4;
export const BGM_FULL_VOLUME = 0.4;
export const BGM_DUCKED_VOLUME = 0.08;

export type VoiceWindow = {
  start: number;
  end: number;
};

export type ResolvedBgm = {
  key: string;
  staticFilePath: string;
  volume: number;
  duck: number;
  loop: boolean;
};

export type BgmSpan = {
  key: string;
  staticFilePath: string;
  volume: number;
  duck: number;
  loop: boolean;
  contentFrom: number;
  contentDurationInFrames: number;
  sequenceFrom: number;
  sequenceDurationInFrames: number;
  voiceWindows: VoiceWindow[];
  leadInFrames: number;
  trailOutFrames: number;
  isEpisodeEnd: boolean;
};

export function resolveBgm(spec: BgmObject, episodeId: string): ResolvedBgm {
  const staticFilePath = bgmStaticPath(spec.src, episodeId);
  return {
    key: spec.key?.trim() || staticFilePath,
    staticFilePath,
    volume: spec.volume ?? BGM_FULL_VOLUME,
    duck: spec.duck ?? BGM_DUCKED_VOLUME,
    loop: spec.loop ?? true,
  };
}

function sceneVoiceWindows(
  scene: Scene,
  contentOffset: number,
  fps: number,
  audioSeconds: AudioSeconds | undefined,
  sceneFrames: number,
): VoiceWindow[] {
  const clipSec = audioSeconds?.[scene.id];
  if (clipSec != null) {
    const voFrames = Math.max(1, Math.round(clipSec * fps));
    return [{ start: contentOffset, end: contentOffset + voFrames }];
  }
  const pad = Math.round(AUDIO_TAIL_PAD_SEC * fps);
  const duckEnd = Math.max(1, sceneFrames - pad);
  return [{ start: contentOffset, end: contentOffset + duckEnd }];
}

export function buildBgmSpans(
  episode: EpisodeScript,
  fps = episode.fps ?? FPS,
  audioSeconds?: AudioSeconds,
): BgmSpan[] {
  const starts = sceneStarts(episode, fps, audioSeconds);
  const durations = episode.scenes.map((scene) =>
    sceneDurationFrames(scene, fps, audioSeconds),
  );

  type Raw = {
    resolved: ResolvedBgm;
    sceneIndexes: number[];
  };
  const groups: Raw[] = [];

  for (let i = 0; i < episode.scenes.length; i++) {
    const scene = episode.scenes[i];
    if (!scene) continue;
    const spec = resolveSceneBgm(scene, episode);
    if (!spec) continue;
    const resolved = resolveBgm(spec, episode.id);
    const prev = groups[groups.length - 1];
    if (prev && prev.resolved.key === resolved.key) {
      prev.sceneIndexes.push(i);
    } else {
      groups.push({ resolved, sceneIndexes: [i] });
    }
  }

  const lastStart = starts[starts.length - 1] ?? 0;
  const lastDur = durations[durations.length - 1] ?? 0;
  const totalFrames = lastStart + lastDur;

  return groups.map((group, groupIndex) => {
    const firstIdx = group.sceneIndexes[0] ?? 0;
    const contentFrom = starts[firstIdx] ?? 0;
    let contentDurationInFrames = 0;
    const voiceWindowsContent: VoiceWindow[] = [];

    let offset = 0;
    for (const idx of group.sceneIndexes) {
      const scene = episode.scenes[idx];
      const frames = durations[idx] ?? 0;
      if (!scene) continue;
      voiceWindowsContent.push(
        ...sceneVoiceWindows(scene, offset, fps, audioSeconds, frames),
      );
      offset += frames;
      contentDurationInFrames += frames;
    }

    const prevGroup = groups[groupIndex - 1];
    const nextGroup = groups[groupIndex + 1];
    const leadInFrames =
      prevGroup && contentFrom > 0
        ? Math.min(BGM_CROSSFADE_FRAMES, contentFrom)
        : 0;
    const contentEnd = contentFrom + contentDurationInFrames;
    const isEpisodeEnd = !nextGroup;
    const trailOutFrames = nextGroup
      ? Math.min(BGM_CROSSFADE_FRAMES, Math.max(0, totalFrames - contentEnd))
      : 0;

    const sequenceFrom = contentFrom - leadInFrames;
    const sequenceDurationInFrames =
      leadInFrames + contentDurationInFrames + trailOutFrames;

    const voiceWindows = voiceWindowsContent.map((w) => ({
      start: w.start + leadInFrames,
      end: w.end + leadInFrames,
    }));

    return {
      key: group.resolved.key,
      staticFilePath: group.resolved.staticFilePath,
      volume: group.resolved.volume,
      duck: group.resolved.duck,
      loop: group.resolved.loop,
      contentFrom,
      contentDurationInFrames,
      sequenceFrom,
      sequenceDurationInFrames,
      voiceWindows,
      leadInFrames,
      trailOutFrames,
      isEpisodeEnd,
    };
  });
}
