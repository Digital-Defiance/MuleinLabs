import React from 'react';
import { Composition } from 'remotion';
import { Episode, type EpisodeProps } from './compositions/Episode';
import { ensureHelutFonts } from './lib/fonts';
import { resolveAudioSeconds } from './lib/resolve-audio';
import { EpisodeScriptSchema, type EpisodeScript } from './lib/schema';
import { episodeDurationFrames, FPS } from './lib/timing';
import ep00 from '../scripts/episodes/ep00-what-is-helut.json';
import ep01 from '../scripts/episodes/ep01-metal-compiler.json';
import ep02 from '../scripts/episodes/ep02-torus-fhe.json';
import ep03 from '../scripts/episodes/ep03-tensorlut.json';

// Block Studio/render until Fraunces + Outfit are registered.
void ensureHelutFonts();

function load(raw: unknown): EpisodeScript {
  return EpisodeScriptSchema.parse(raw);
}

const episodes = [load(ep00), load(ep01), load(ep02), load(ep03)];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {episodes.map((script) => (
        <Composition
          key={script.compositionId}
          id={script.compositionId}
          component={Episode}
          durationInFrames={episodeDurationFrames(script)}
          fps={script.fps ?? FPS}
          width={script.width ?? 1920}
          height={script.height ?? 1080}
          defaultProps={{ script } satisfies EpisodeProps}
          calculateMetadata={async ({ props }) => {
            await ensureHelutFonts();
            const s = EpisodeScriptSchema.parse(props.script);
            const audioSeconds = await resolveAudioSeconds(s.id, s.scenes);
            const fps = s.fps ?? FPS;
            return {
              durationInFrames: episodeDurationFrames(s, fps, audioSeconds),
              fps,
              width: s.width ?? 1920,
              height: s.height ?? 1080,
              props: { script: s, audioSeconds } satisfies EpisodeProps,
            };
          }}
        />
      ))}
    </>
  );
};
