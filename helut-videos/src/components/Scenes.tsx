import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import { FONT_BODY, FONT_DISPLAY } from '../lib/fonts';
import { storyBackgroundStaticPath } from '../lib/schema';
import { SyncedCaptions } from './SyncedCaptions';

/** HELUT site palette — dark panel with copper + teal signal. */
const COLORS = {
  bg: '#0d1322',
  accent: '#d4833f',
  signal: '#22a89c',
  text: '#f4f6f8',
  muted: '#9aa8b8',
};

export const HelutChrome: React.FC<{
  children: React.ReactNode;
  episodeId?: string;
  backgroundAsset?: string;
}> = ({ children, episodeId, backgroundAsset }) => {
  const artSrc =
    episodeId && backgroundAsset
      ? staticFile(storyBackgroundStaticPath(episodeId, backgroundAsset))
      : null;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        color: COLORS.text,
        fontFamily: FONT_BODY,
      }}
    >
      {artSrc ? (
        <>
          <Img
            src={artSrc}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'linear-gradient(180deg, rgba(13,19,34,0.64) 0%, rgba(13,19,34,0.24) 44%, rgba(13,19,34,0.86) 100%)',
            }}
          />
        </>
      ) : (
        <AbsoluteFill
          style={{
            background:
              'radial-gradient(ellipse at 18% 0%, rgba(212,131,63,0.18), transparent 42%), radial-gradient(ellipse at 88% 12%, rgba(34,168,156,0.16), transparent 38%), #0d1322',
          }}
        />
      )}
      {children}
    </AbsoluteFill>
  );
};

const SceneCaptions: React.FC<{
  episodeId: string;
  sceneId: string;
  text: string;
}> = ({ episodeId, sceneId, text }) => (
  <SyncedCaptions
    episodeId={episodeId}
    sceneId={sceneId}
    fallbackText={text}
  />
);

export const TitleCard: React.FC<{
  eyebrow?: string;
  headline: string;
  subhead?: string;
  caption: string;
  episodeId: string;
  sceneId: string;
  backgroundAsset?: string;
}> = ({
  eyebrow,
  headline,
  subhead,
  caption,
  episodeId,
  sceneId,
  backgroundAsset,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const copyWidth = backgroundAsset ? 980 : 1500;

  return (
    <HelutChrome episodeId={episodeId} backgroundAsset={backgroundAsset}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          padding: '0 120px 180px',
          opacity,
        }}
      >
        <div style={{ maxWidth: copyWidth }}>
          {eyebrow && (
            <div
              style={{
                color: COLORS.signal,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontFamily: FONT_BODY,
                fontSize: 28,
                fontWeight: 600,
                marginBottom: 24,
                textShadow: '0 2px 18px rgba(0,0,0,0.65)',
              }}
            >
              {eyebrow}
            </div>
          )}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              textShadow: '0 4px 28px rgba(0,0,0,0.75)',
            }}
          >
            {headline}
          </div>
          {subhead && (
            <div
              style={{
                marginTop: 28,
                fontFamily: FONT_BODY,
                fontSize: 36,
                fontWeight: 400,
                color: COLORS.muted,
                lineHeight: 1.35,
                textShadow: '0 2px 16px rgba(0,0,0,0.65)',
              }}
            >
              {subhead}
            </div>
          )}
        </div>
      </AbsoluteFill>
      <SceneCaptions episodeId={episodeId} sceneId={sceneId} text={caption} />
    </HelutChrome>
  );
};

export const NarrationCard: React.FC<{
  headline?: string;
  bullets?: string[];
  caption: string;
  episodeId: string;
  sceneId: string;
  backgroundAsset?: string;
}> = ({
  headline,
  bullets,
  caption,
  episodeId,
  sceneId,
  backgroundAsset,
}) => {
  const copyWidth = backgroundAsset ? 940 : 1600;

  return (
    <HelutChrome episodeId={episodeId} backgroundAsset={backgroundAsset}>
      <AbsoluteFill style={{ padding: '92px 120px 280px' }}>
        <div style={{ maxWidth: copyWidth }}>
          {headline && (
            <div
              style={{
                fontFamily: FONT_DISPLAY,
                fontSize: 56,
                fontWeight: 700,
                marginBottom: 36,
                lineHeight: 1.08,
                textShadow: '0 3px 22px rgba(0,0,0,0.6)',
              }}
            >
              {headline}
            </div>
          )}
          {bullets && (
            <ul
              style={{
                fontFamily: FONT_BODY,
                fontSize: 31,
                fontWeight: 400,
                lineHeight: 1.45,
                margin: 0,
                paddingLeft: 40,
                textShadow: '0 2px 14px rgba(0,0,0,0.55)',
              }}
            >
              {bullets.map((bullet) => (
                <li key={bullet} style={{ marginBottom: 16 }}>
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      </AbsoluteFill>
      <SceneCaptions episodeId={episodeId} sceneId={sceneId} text={caption} />
    </HelutChrome>
  );
};

export const ConceptCard: React.FC<{
  headline: string;
  subhead?: string;
  kicker?: string;
  caption: string;
  episodeId: string;
  sceneId: string;
  backgroundAsset?: string;
}> = ({
  headline,
  subhead,
  kicker,
  caption,
  episodeId,
  sceneId,
  backgroundAsset,
}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const copyWidth = backgroundAsset ? 980 : 1400;

  return (
    <HelutChrome episodeId={episodeId} backgroundAsset={backgroundAsset}>
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          padding: '112px 100px 260px',
          opacity,
        }}
      >
        <div style={{ maxWidth: copyWidth }}>
          {kicker && (
            <div
              style={{
                color: COLORS.accent,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontFamily: FONT_BODY,
                fontSize: 24,
                fontWeight: 600,
                marginBottom: 20,
                textShadow: '0 2px 14px rgba(0,0,0,0.65)',
              }}
            >
              {kicker}
            </div>
          )}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.08,
              textShadow: '0 4px 28px rgba(0,0,0,0.8)',
            }}
          >
            {headline}
          </div>
          {subhead && (
            <div
              style={{
                marginTop: 22,
                fontFamily: FONT_BODY,
                fontSize: 32,
                fontWeight: 400,
                color: COLORS.muted,
                lineHeight: 1.38,
                textShadow: '0 2px 16px rgba(0,0,0,0.7)',
              }}
            >
              {subhead}
            </div>
          )}
        </div>
      </AbsoluteFill>
      <SceneCaptions episodeId={episodeId} sceneId={sceneId} text={caption} />
    </HelutChrome>
  );
};

export const OutroCard: React.FC<{
  headline: string;
  subhead?: string;
  nextEpisode?: string;
  caption: string;
  episodeId: string;
  sceneId: string;
  backgroundAsset?: string;
}> = ({
  headline,
  subhead,
  nextEpisode,
  caption,
  episodeId,
  sceneId,
  backgroundAsset,
}) => {
  const copyWidth = backgroundAsset ? 980 : 1400;

  return (
    <HelutChrome episodeId={episodeId} backgroundAsset={backgroundAsset}>
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          padding: '0 120px 180px',
        }}
      >
        <div style={{ maxWidth: copyWidth }}>
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 64,
              fontWeight: 700,
              lineHeight: 1.1,
              textShadow: '0 4px 28px rgba(0,0,0,0.75)',
            }}
          >
            {headline}
          </div>
          {subhead && (
            <div
              style={{
                marginTop: 24,
                fontFamily: FONT_BODY,
                fontSize: 34,
                fontWeight: 400,
                color: COLORS.muted,
                lineHeight: 1.4,
              }}
            >
              {subhead}
            </div>
          )}
          {nextEpisode && (
            <div
              style={{
                marginTop: 40,
                color: COLORS.signal,
                fontFamily: FONT_BODY,
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Next · {nextEpisode}
            </div>
          )}
        </div>
      </AbsoluteFill>
      <SceneCaptions episodeId={episodeId} sceneId={sceneId} text={caption} />
    </HelutChrome>
  );
};
