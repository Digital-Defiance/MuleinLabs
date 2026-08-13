/** Remotion `staticFile` path for a scene voice clip (no Node imports). */
export function sceneAudioStaticPath(
  episodeId: string,
  sceneId: string,
): string {
  return `audio/${episodeId}/${sceneId}.mp3`;
}

/** ElevenLabs character-alignment sidecar (sentence cues for captions). */
export function sceneAlignmentStaticPath(
  episodeId: string,
  sceneId: string,
): string {
  return `audio/${episodeId}/${sceneId}.alignment.json`;
}

export type CaptionSentence = {
  text: string;
  startSec: number;
  endSec: number;
};

export type SceneAlignmentFile = {
  spoken: string;
  sentences: CaptionSentence[];
};
