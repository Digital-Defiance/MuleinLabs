const PACED_EPISODE_ID = 'ep00-what-is-helut';
const PACED_VARIANT = 'paced-v1';

function sceneAudioDirectory(episodeId: string): string {
  return episodeId === PACED_EPISODE_ID
    ? `audio/${episodeId}/${PACED_VARIANT}`
    : `audio/${episodeId}`;
}

/** Remotion `staticFile` path for a scene voice clip (no Node imports). */
export function sceneAudioStaticPath(
  episodeId: string,
  sceneId: string,
): string {
  return `${sceneAudioDirectory(episodeId)}/${sceneId}.mp3`;
}

/** Character-alignment sidecar matching the selected delivery clip. */
export function sceneAlignmentStaticPath(
  episodeId: string,
  sceneId: string,
): string {
  return `${sceneAudioDirectory(episodeId)}/${sceneId}.alignment.json`;
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
