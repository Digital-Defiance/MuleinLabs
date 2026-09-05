import React, { useMemo } from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SmartBgm } from '../components/SmartBgm';
import {
  CaptureCard,
  ConceptCard,
  NarrationCard,
  OutroCard,
  TitleCard,
} from '../components/Scenes';
import { sceneAudioStaticPath } from '../lib/audio-paths';
import { buildBgmSpans } from '../lib/bgm';
import type { EpisodeScript } from '../lib/schema';
import type { AudioSeconds } from '../lib/timing';
import { FPS, sceneDurationFrames, sceneStarts } from '../lib/timing';

export type EpisodeProps = {
  script: EpisodeScript;
  /** Measured TTS lengths from calculateMetadata; omit → durationHintSec. */
  audioSeconds?: AudioSeconds;
};

export const Episode: React.FC<EpisodeProps> = ({ script, audioSeconds }) => {
  const fps = script.fps ?? FPS;
  const starts = sceneStarts(script, fps, audioSeconds);
  const bgmSpans = useMemo(
    () => buildBgmSpans(script, fps, audioSeconds),
    [script, fps, audioSeconds],
  );

  return (
    <AbsoluteFill>
      {bgmSpans.map((span) => (
        <Sequence
          key={`bgm-${span.key}-${span.contentFrom}`}
          from={span.sequenceFrom}
          durationInFrames={span.sequenceDurationInFrames}
          name={`bgm:${span.key}`}
          layout="none"
        >
          <SmartBgm span={span} />
        </Sequence>
      ))}

      {script.scenes.map((scene, i) => {
        const from = starts[i]!;
        const durationInFrames = sceneDurationFrames(
          scene,
          fps,
          audioSeconds,
        );
        const mainAudio = audioSeconds?.[scene.id];

        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={durationInFrames}
            name={scene.id}
          >
            {scene.kind === 'title' && (
              <TitleCard
                episodeId={script.id}
                sceneId={scene.id}
                backgroundAsset={scene.backgroundAsset}
                eyebrow={scene.eyebrow}
                headline={scene.headline}
                subhead={scene.subhead}
                caption={scene.voiceover}
              />
            )}
            {scene.kind === 'narration' && (
              <NarrationCard
                episodeId={script.id}
                sceneId={scene.id}
                backgroundAsset={scene.backgroundAsset}
                headline={scene.headline}
                bullets={scene.bullets}
                caption={scene.voiceover}
              />
            )}
            {scene.kind === 'concept' && (
              <ConceptCard
                episodeId={script.id}
                sceneId={scene.id}
                backgroundAsset={scene.backgroundAsset}
                headline={scene.headline}
                subhead={scene.subhead}
                kicker={scene.kicker}
                caption={scene.voiceover}
              />
            )}
            {scene.kind === 'capture' && (
              <CaptureCard
                episodeId={script.id}
                sceneId={scene.id}
                videoAsset={scene.videoAsset}
                videoDurationSec={scene.durationHintSec}
                sceneDurationInFrames={durationInFrames}
                fps={fps}
                label={scene.label}
                caption={scene.voiceover}
              />
            )}
            {scene.kind === 'outro' && (
              <OutroCard
                episodeId={script.id}
                sceneId={scene.id}
                backgroundAsset={scene.backgroundAsset}
                headline={scene.headline}
                subhead={scene.subhead}
                nextEpisode={scene.nextEpisode}
                caption={scene.voiceover}
              />
            )}

            {mainAudio != null && (
              <Audio
                src={staticFile(sceneAudioStaticPath(script.id, scene.id))}
              />
            )}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
