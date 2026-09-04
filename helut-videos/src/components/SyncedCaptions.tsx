import { useEffect, useState } from 'react';
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  sceneAlignmentStaticPath,
  type CaptionSentence,
  type SceneAlignmentFile,
} from '../lib/audio-paths';
import { FONT_BODY } from '../lib/fonts';

function splitSentences(text: string): string[] {
  const out: string[] = [];
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const isEnd =
      (ch === '.' || ch === '!' || ch === '?') &&
      (i === text.length - 1 || /\s/.test(text[i + 1] ?? ''));
    if (!isEnd) continue;
    let end = i + 1;
    while (end < text.length && /\s/.test(text[end])) end++;
    const slice = text.slice(start, end).trim();
    if (slice) out.push(slice);
    start = end;
  }
  if (start < text.length) {
    const slice = text.slice(start).trim();
    if (slice) out.push(slice);
  }
  return out;
}

function sentenceWeight(text: string): number {
  return Math.max(1, text.match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)*/gu)?.length ?? 1);
}

function evenPace(text: string, durationSec: number): CaptionSentence[] {
  const parts = splitSentences(text);
  if (parts.length === 0) return [];
  const weights = parts.map(sentenceWeight);
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  const usableDuration = Math.max(0.01, durationSec);
  let cursor = 0;
  return parts.map((sentence, i) => {
    const startSec = cursor;
    cursor += (usableDuration * weights[i]!) / totalWeight;
    return {
      text: sentence,
      startSec,
      endSec: i === parts.length - 1 ? usableDuration : cursor,
    };
  });
}

function activeIndex(sentences: CaptionSentence[], t: number): number {
  if (sentences.length === 0) return -1;
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i]!;
    if (t >= s.startSec && t < s.endSec) return i;
  }
  if (t < sentences[0]!.startSec) return 0;
  return sentences.length - 1;
}

/**
 * Time-synced voice-over captions. Only the active sentence is shown so a
 * second sentence cannot obscure the lower portion of technical diagrams.
 * ElevenLabs alignment is preferred; silent previews use word-weighted pacing.
 */
export const SyncedCaptions: React.FC<{
  episodeId: string;
  sceneId: string;
  fallbackText: string;
}> = ({ episodeId, sceneId, fallbackText }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const [sentences, setSentences] = useState<CaptionSentence[] | null>(null);

  useEffect(() => {
    const handle = delayRender(`captions-${episodeId}-${sceneId}`);
    let cancelled = false;
    const src = staticFile(sceneAlignmentStaticPath(episodeId, sceneId));
    void fetch(src)
      .then(async (res) => {
        if (!res.ok) return null;
        return (await res.json()) as SceneAlignmentFile;
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.sentences?.length) {
          setSentences(data.sentences);
        } else {
          setSentences(
            evenPace(fallbackText, Math.max(0.5, durationInFrames / fps)),
          );
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSentences(
            evenPace(fallbackText, Math.max(0.5, durationInFrames / fps)),
          );
        }
      })
      .finally(() => {
        continueRender(handle);
      });
    return () => {
      cancelled = true;
    };
  }, [episodeId, sceneId, fallbackText, durationInFrames, fps]);

  if (!sentences || sentences.length === 0) return null;

  const displayParts = splitSentences(fallbackText);
  const idx = activeIndex(sentences, t);
  if (idx < 0) return null;
  const activeText = displayParts[idx] ?? sentences[idx]!.text;

  const fade = interpolate(
    frame,
    [0, 8, Math.max(9, durationInFrames - 10), durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        padding: '0 100px 56px',
        pointerEvents: 'none',
        opacity: fade,
      }}
    >
      <div
        style={{
          width: 'fit-content',
          maxWidth: 1500,
          padding: '14px 20px 16px',
          borderRadius: 14,
          border: '1px solid rgba(148,163,184,0.22)',
          background: 'rgba(6,10,18,0.76)',
          fontFamily: FONT_BODY,
          fontSize: 34,
          fontWeight: 650,
          lineHeight: 1.35,
          color: '#f8fafc',
          textShadow: '0 2px 4px rgba(0,0,0,0.85)',
        }}
      >
        {activeText}
      </div>
    </AbsoluteFill>
  );
};
