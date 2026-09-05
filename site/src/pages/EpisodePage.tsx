import { Link, useParams } from 'react-router-dom'
import {
  episodeById,
  episodeLabel,
  episodePath,
  episodes,
  formatBytes,
  formatSeconds,
  sceneHeading,
} from '../data/episodes'

const repoRoot = 'https://github.com/JessicaMulein/MuleinLabs/blob/main'
const sourceRoot = `${repoRoot}/helut-videos/scripts/episodes`

export function EpisodePage() {
  const { episodeId } = useParams<{ episodeId: string }>()
  const episode = episodeId ? episodeById.get(episodeId) : undefined

  if (!episode) {
    return (
      <main className="episode-page">
        <div className="shell episode-not-found">
          <span className="eyebrow">Episode companion</span>
          <h1>Episode not found</h1>
          <p>That companion is not part of the current canonical episode series.</p>
          <Link className="btn btn-ghost" to="/episodes">
            Browse all episodes
          </Link>
        </div>
      </main>
    )
  }

  const currentIndex = episodes.findIndex(({ id }) => id === episode.id)
  const previousEpisode = currentIndex > 0 ? episodes[currentIndex - 1] : undefined
  const nextEpisode = currentIndex < episodes.length - 1 ? episodes[currentIndex + 1] : undefined

  return (
    <main className="episode-page">
      <header className="episode-detail-hero">
        <div className="shell episode-detail-intro">
          <Link className="episode-back" to="/episodes">
            ← All episode companions
          </Link>
          <span className="eyebrow">{episodeLabel(episode)} · HELUT concept series</span>
          <h1>{episode.title}</h1>
          <p className="episode-release-title">{episode.youtubeTitle}</p>
          <p className="episode-summary">{episode.description}</p>

          <dl className="episode-facts">
            <div>
              <dt>Claim epoch</dt>
              <dd>{episode.claimEpoch}</dd>
            </div>
            <div>
              <dt>Scenes</dt>
              <dd>{episode.scenes.length}</dd>
            </div>
            <div>
              <dt>Composition</dt>
              <dd>{episode.compositionId}</dd>
            </div>
          </dl>

          <a
            className="episode-source-link"
            href={`${sourceRoot}/${episode.sourceFile}`}
            target="_blank"
            rel="noreferrer"
          >
            Read the canonical script ↗
          </a>
        </div>
      </header>

      <div className="shell episode-detail-layout">
        <aside className="episode-toc" aria-label="Episode scenes">
          <span className="eyebrow">In this episode</span>
          <ol>
            {episode.scenes.map((scene, index) => (
              <li key={scene.id}>
                <a href={`#scene-${scene.id}`}>
                  <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                  {sceneHeading(scene)}
                </a>
              </li>
            ))}
            {episode.captures.length > 0 && (
              <li className="episode-toc-extra">
                <a href="#captures">
                  <span className="mono">··</span>
                  Literal terminal captures
                </a>
              </li>
            )}
          </ol>
        </aside>

        <article className="episode-transcript">
          <header className="episode-transcript-header">
            <span className="eyebrow">Written companion</span>
            <h2>Scene by scene</h2>
            <p>
              The narration and on-screen teaching points below come directly from the
              production script for this episode.
            </p>
          </header>

          {episode.scenes.map((scene, index) => (
            <section
              className={`episode-scene episode-scene-${scene.kind}`}
              id={`scene-${scene.id}`}
              key={scene.id}
            >
              <div className="episode-scene-meta mono">
                <span>Scene {String(index + 1).padStart(2, '0')}</span>
                <span>{scene.kind}</span>
                {scene.kind === 'capture' && <span>recorded terminal</span>}
              </div>
              {(scene.eyebrow || scene.kicker || scene.label) && (
                <p className="episode-scene-kicker">
                  {scene.eyebrow ?? scene.kicker ?? scene.label}
                </p>
              )}
              <h2>{sceneHeading(scene)}</h2>
              {scene.subhead && <p className="episode-scene-subhead">{scene.subhead}</p>}
              {scene.bullets && scene.bullets.length > 0 && (
                <div className="episode-screen-points">
                  <h3>On screen</h3>
                  <ul>
                    {scene.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="episode-narration">
                <h3>Narration</h3>
                <p>{scene.voiceover}</p>
              </div>
            </section>
          ))}

          {episode.captures.length > 0 && (
            <section className="episode-captures" id="captures">
              <header className="episode-captures-header">
                <span className="eyebrow">Receipts</span>
                <h2>Literal terminal captures</h2>
                <p>
                  The capture scenes above are unedited recordings of a real shell at
                  normal speed. Each one has a tracked tape that regenerates it, a
                  transcript of every command, and a manifest carrying tool versions,
                  measured results, and checksums.
                </p>
              </header>

              {episode.captures.map((capture) => {
                const artifactBase = `${repoRoot}/helut-videos/captures/${episode.id}`
                const videoHref = `${repoRoot}/helut-videos/public/captures/${episode.id}/${capture.video.file}`

                return (
                  <article className="episode-capture" key={capture.captureId}>
                    <h3 className="mono">{capture.video.file}</h3>
                    {capture.role && <p className="episode-capture-role">{capture.role}</p>}

                    <dl className="episode-capture-facts mono">
                      <div>
                        <dt>Captured</dt>
                        <dd>{capture.capturedAt ?? '—'}</dd>
                      </div>
                      <div>
                        <dt>Duration</dt>
                        <dd>{formatSeconds(capture.video.durationSeconds)}</dd>
                      </div>
                      <div>
                        <dt>Format</dt>
                        <dd>
                          {capture.video.codec ?? '—'}
                          {capture.video.width && capture.video.height
                            ? ` · ${capture.video.width}×${capture.video.height}`
                            : ''}
                        </dd>
                      </div>
                      <div>
                        <dt>Size</dt>
                        <dd>{formatBytes(capture.video.sizeBytes)}</dd>
                      </div>
                    </dl>

                    {capture.video.sha256 && (
                      <p className="episode-capture-hash mono">
                        <span>MP4 SHA-256</span>
                        <code>{capture.video.sha256}</code>
                      </p>
                    )}

                    {capture.reproduce?.commands && capture.reproduce.commands.length > 0 && (
                      <div className="episode-capture-repro">
                        <h4>Reproduce</h4>
                        {capture.reproduce.workingDirectory && (
                          <p className="episode-capture-cwd">
                            Run from the {capture.reproduce.workingDirectory}.
                          </p>
                        )}
                        {capture.reproduce.prerequisites &&
                          capture.reproduce.prerequisites.length > 0 && (
                            <ul className="episode-capture-prereqs">
                              {capture.reproduce.prerequisites.map((item) => (
                                <li key={item}>{item}</li>
                              ))}
                            </ul>
                          )}
                        <ol className="episode-capture-commands">
                          {capture.reproduce.commands.map((command) => (
                            <li key={command}>
                              <code>{command}</code>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {capture.timingNote && (
                      <p className="episode-capture-note">{capture.timingNote}</p>
                    )}

                    {capture.claimBoundaries.length > 0 && (
                      <div className="episode-capture-bounds">
                        <h4>What this capture does not claim</h4>
                        <ul>
                          {capture.claimBoundaries.map((bound) => (
                            <li key={bound}>{bound}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <ul className="episode-capture-links">
                      <li>
                        <a href={videoHref} target="_blank" rel="noreferrer">
                          Recording ↗
                        </a>
                      </li>
                      {capture.tape && (
                        <li>
                          <a
                            href={`${artifactBase}/${capture.tape.file}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Tape ↗
                          </a>
                        </li>
                      )}
                      {capture.transcriptFile && (
                        <li>
                          <a
                            href={`${artifactBase}/${capture.transcriptFile}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Transcript ↗
                          </a>
                        </li>
                      )}
                      <li>
                        <a
                          href={`${artifactBase}/${capture.manifestFile}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Manifest ↗
                        </a>
                      </li>
                    </ul>
                  </article>
                )
              })}
            </section>
          )}

          <p className="episode-source-note">
            Companion content is synchronized from <code>{episode.sourceFile}</code>. HELUT's
            dated claim ledger remains authoritative for research claims.
          </p>

          <nav className="episode-pagination" aria-label="Previous and next episodes">
            {previousEpisode ? (
              <Link to={episodePath(previousEpisode)}>
                <span className="mono">← Previous</span>
                <strong>{previousEpisode.title}</strong>
              </Link>
            ) : (
              <span aria-hidden="true" />
            )}
            {nextEpisode ? (
              <Link to={episodePath(nextEpisode)}>
                <span className="mono">Next →</span>
                <strong>{nextEpisode.title}</strong>
              </Link>
            ) : (
              <Link to="/episodes">
                <span className="mono">Series index</span>
                <strong>All episode companions</strong>
              </Link>
            )}
          </nav>
        </article>
      </div>
    </main>
  )
}
