import generatedEpisodes from '../../content/episodes.json'

export type EpisodeSceneKind =
  | 'title'
  | 'narration'
  | 'concept'
  | 'outro'
  | 'capture'

export interface EpisodeScene {
  kind: EpisodeSceneKind
  id: string
  voiceover: string
  durationHintSec: number
  eyebrow?: string
  headline?: string
  subhead?: string
  kicker?: string
  bullets?: string[]
  /** `capture` scenes only: on-screen provenance label and footage filename. */
  label?: string
  videoAsset?: string
}

export interface EpisodeCaptureReproduce {
  workingDirectory?: string
  prerequisites?: string[]
  commands?: string[]
}

/** Projected from the durable capture manifests in helut-videos/captures. */
export interface EpisodeCapture {
  captureId: string
  role: string | null
  capturedAt: string | null
  video: {
    file: string
    sha256: string | null
    codec: string | null
    width: number | null
    height: number | null
    durationSeconds: number | null
    sizeBytes: number | null
  }
  tape: { file: string; sha256: string | null } | null
  manifestFile: string
  transcriptFile: string | null
  reproduce: EpisodeCaptureReproduce | null
  timingNote: string | null
  claimBoundaries: string[]
}

export interface Episode {
  episodeNumber: number
  sourceFile: string
  id: string
  compositionId: string
  title: string
  youtubeTitle: string
  description: string
  claimEpoch: string
  scenes: EpisodeScene[]
  captures: EpisodeCapture[]
}

interface EpisodeRegistry {
  schemaVersion: number
  generatedFrom: string
  episodes: Episode[]
}

const registry = generatedEpisodes as EpisodeRegistry

export const episodes: readonly Episode[] = registry.episodes
export const episodeById = new Map(episodes.map((episode) => [episode.id, episode]))

export function episodeLabel(episode: Episode): string {
  return `Episode ${String(episode.episodeNumber).padStart(2, '0')}`
}

export function episodePath(episode: Episode): string {
  return `/episodes/${episode.id}`
}

export function sceneHeading(scene: EpisodeScene): string {
  if (scene.headline) return scene.headline
  return scene.id
    .split('-')
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(' ')
}

export function formatSeconds(seconds: number | null): string {
  if (seconds == null) return '—'
  const whole = Math.floor(seconds)
  const minutes = Math.floor(whole / 60)
  const rest = (seconds - minutes * 60).toFixed(2)
  return minutes > 0 ? `${minutes}m ${rest}s` : `${rest}s`
}

export function formatBytes(bytes: number | null): string {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB']
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(1)} ${units[unit]}`
}
