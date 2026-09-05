#!/usr/bin/env node
/**
 * Build the site episode registry from every canonical helut-videos script.
 * The checked-in output is also a fallback when the site is built standalone.
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(__dirname, '..')
const videosRoot = join(siteRoot, '..', 'helut-videos')
const episodeDir = join(videosRoot, 'scripts', 'episodes')
const captureRoot = join(videosRoot, 'captures')
const outPath = join(siteRoot, 'content', 'episodes.json')
const sceneKinds = new Set(['title', 'narration', 'concept', 'outro', 'capture'])
const sceneFields = [
  'kind',
  'id',
  'voiceover',
  'durationHintSec',
  'eyebrow',
  'headline',
  'subhead',
  'kicker',
  'bullets',
  // `capture` scenes carry literal terminal footage instead of story art.
  'label',
  'videoAsset',
]

function requireText(value, field, where) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${where}: ${field} must be a non-empty string`)
  }
}

function companionScene(scene, where) {
  if (!scene || typeof scene !== 'object' || Array.isArray(scene)) {
    throw new Error(`${where}: scene must be an object`)
  }

  requireText(scene.kind, 'kind', where)
  requireText(scene.id, 'id', where)
  requireText(scene.voiceover, 'voiceover', where)
  if (!sceneKinds.has(scene.kind)) {
    throw new Error(`${where}: unsupported scene kind ${scene.kind}`)
  }
  if (!Number.isFinite(scene.durationHintSec) || scene.durationHintSec <= 0) {
    throw new Error(`${where}: durationHintSec must be a positive number`)
  }
  if (scene.bullets !== undefined && !Array.isArray(scene.bullets)) {
    throw new Error(`${where}: bullets must be an array when present`)
  }

  return Object.fromEntries(
    sceneFields
      .filter((field) => scene[field] !== undefined)
      .map((field) => [field, scene[field]]),
  )
}

/**
 * Project the durable capture manifests for one episode into the compact shape
 * the companion page renders. The manifests in helut-videos remain the single
 * source of truth for hashes, metrics, and claim boundaries; nothing is retyped
 * here. Episodes without captures simply get an empty list.
 */
function companionCaptures(episodeId) {
  const dir = join(captureRoot, episodeId)
  if (!existsSync(dir)) return []

  return readdirSync(dir)
    .filter((file) => file.endsWith('manifest.json'))
    .sort()
    .map((file) => {
      const where = `helut-videos/captures/${episodeId}/${file}`
      const m = JSON.parse(readFileSync(join(dir, file), 'utf8'))

      if (!m.video?.path || !m.captureId) {
        throw new Error(`${where}: manifest needs captureId and video.path`)
      }

      return {
        captureId: m.captureId,
        role: m.role ?? null,
        capturedAt: m.capturedAt ?? null,
        video: {
          file: basename(m.video.path),
          sha256: m.video.sha256 ?? null,
          codec: m.video.codec ?? null,
          width: m.video.width ?? null,
          height: m.video.height ?? null,
          durationSeconds: m.video.durationSeconds ?? null,
          sizeBytes: m.video.sizeBytes ?? null,
        },
        tape: m.captureMethod?.tape?.path
          ? {
              file: basename(m.captureMethod.tape.path),
              sha256: m.captureMethod.tape.sha256 ?? null,
            }
          : null,
        manifestFile: file,
        transcriptFile: m.transcript ?? null,
        reproduce: m.reproduce ?? null,
        timingNote: m.timingContext?.interpretation ?? null,
        claimBoundaries: Array.isArray(m.claimBoundaries) ? m.claimBoundaries : [],
      }
    })
}

function main() {
  if (!existsSync(episodeDir)) {
    if (existsSync(outPath)) {
      console.log('sync-episodes: no canonical source; keeping content/episodes.json')
      return
    }
    throw new Error(`sync-episodes: could not find ${episodeDir}`)
  }

  const files = readdirSync(episodeDir)
    .filter((file) => file.endsWith('.json'))
    .sort()
  if (files.length === 0) {
    throw new Error(`sync-episodes: no episode JSON found in ${episodeDir}`)
  }

  const ids = new Set()
  const episodeNumbers = new Set()
  const episodes = files.map((file) => {
    const where = `helut-videos/scripts/episodes/${file}`
    const raw = JSON.parse(readFileSync(join(episodeDir, file), 'utf8'))
    const idFromFile = basename(file, '.json')
    const numberMatch = idFromFile.match(/^ep(\d+)-[a-z0-9-]+$/)

    if (!numberMatch) {
      throw new Error(`${where}: filename must follow epNN-lower-kebab-case.json`)
    }
    for (const field of [
      'id',
      'compositionId',
      'title',
      'youtubeTitle',
      'description',
      'claimEpoch',
    ]) {
      requireText(raw[field], field, where)
    }
    if (raw.id !== idFromFile) {
      throw new Error(`${where}: id ${raw.id} must match its filename`)
    }
    if (ids.has(raw.id)) {
      throw new Error(`${where}: duplicate episode id ${raw.id}`)
    }

    const episodeNumber = Number(numberMatch[1])
    if (episodeNumbers.has(episodeNumber)) {
      throw new Error(`${where}: duplicate episode number ${episodeNumber}`)
    }
    if (!Array.isArray(raw.scenes) || raw.scenes.length === 0) {
      throw new Error(`${where}: scenes must be a non-empty array`)
    }

    const sceneIds = new Set()
    const scenes = raw.scenes.map((scene, index) => {
      const compact = companionScene(scene, `${where} scene ${index + 1}`)
      if (sceneIds.has(compact.id)) {
        throw new Error(`${where}: duplicate scene id ${compact.id}`)
      }
      sceneIds.add(compact.id)
      return compact
    })

    ids.add(raw.id)
    episodeNumbers.add(episodeNumber)
    return {
      episodeNumber,
      sourceFile: file,
      id: raw.id,
      compositionId: raw.compositionId,
      title: raw.title,
      youtubeTitle: raw.youtubeTitle,
      description: raw.description,
      claimEpoch: raw.claimEpoch,
      scenes,
      captures: companionCaptures(raw.id),
    }
  })

  episodes.sort((a, b) => a.episodeNumber - b.episodeNumber || a.id.localeCompare(b.id))

  const output = {
    schemaVersion: 1,
    generatedFrom: 'helut-videos/scripts/episodes',
    episodes,
  }
  writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`)
  const captureCount = episodes.reduce((sum, ep) => sum + ep.captures.length, 0)
  console.log(`sync-episodes: wrote ${outPath}`)
  console.log(`sync-episodes: ${episodes.length} companion pages ready`)
  console.log(`sync-episodes: ${captureCount} literal capture(s) linked`)
}

try {
  main()
} catch (error) {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
}
