import React from 'react';
import { Audio, interpolate, staticFile, useVideoConfig } from 'remotion';
import {
  BGM_END_FADE_SEC,
  BGM_FADE_SEC,
  type BgmSpan,
  type VoiceWindow,
} from '../lib/bgm';

function duckLevel(
  frame: number,
  windows: readonly VoiceWindow[],
  fade: number,
  full: number,
  ducked: number,
): number {
  let duck = 0;
  for (const w of windows) {
    const ramp = Math.max(1, Math.round(fade * 0.5));
    const amount = interpolate(
      frame,
      [w.start - ramp, w.start, w.end, w.end + ramp],
      [0, 1, 1, 0],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
    duck = Math.max(duck, amount);
  }
  return interpolate(duck, [0, 1], [full, ducked]);
}

export type SmartBgmProps = {
  span: BgmSpan;
};

export const SmartBgm: React.FC<SmartBgmProps> = ({ span }) => {
  const { fps } = useVideoConfig();
  const fadeIn = Math.max(1, Math.round(BGM_FADE_SEC * fps));
  const fadeOut = Math.max(
    1,
    Math.round((span.isEpisodeEnd ? BGM_END_FADE_SEC : BGM_FADE_SEC) * fps),
  );
  const duration = span.sequenceDurationInFrames;
  const fadeOutStart = Math.max(fadeIn + 1, duration - fadeOut);

  return (
    <Audio
      src={staticFile(span.staticFilePath)}
      loop={span.loop}
      volume={(frame) => {
        const edgeLinear = interpolate(
          frame,
          [0, fadeIn, fadeOutStart, duration],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        );
        const edge = span.isEpisodeEnd
          ? Math.pow(edgeLinear, frame >= fadeOutStart ? 1.35 : 1)
          : edgeLinear;
        return (
          edge *
          duckLevel(frame, span.voiceWindows, fadeIn, span.volume, span.duck)
        );
      }}
    />
  );
};
