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
import ep04 from '../scripts/episodes/ep04-p1030680-bombe.json';
import ep05 from '../scripts/episodes/ep05-enigma256-architecture.json';
import ep06 from '../scripts/episodes/ep06-e256-evolution-audit.json';
import ep07 from '../scripts/episodes/ep07-almost-near-misses.json';
import ep08 from '../scripts/episodes/ep08-encrypted-picorv32.json';
import ep09 from '../scripts/episodes/ep09-application-gallery.json';
import ep10 from '../scripts/episodes/ep10-why-it-holds.json';
import ep11 from '../scripts/episodes/ep11-the-frontier.json';
import ep12 from '../scripts/episodes/ep12-private-majority.json';
import ep13 from '../scripts/episodes/ep13-ab0cde.json';

// Block Studio/render until Fraunces + Outfit are registered.
void ensureHelutFonts();

function load(raw: unknown): EpisodeScript {
  return EpisodeScriptSchema.parse(raw);
}

const episodes = [
  load(ep00),
  load(ep01),
  load(ep02),
  load(ep03),
  load(ep04),
  load(ep05),
  load(ep06),
  load(ep07),
  load(ep08),
  load(ep09),
  load(ep10),
  load(ep11),
  load(ep12),
  load(ep13),
];

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
