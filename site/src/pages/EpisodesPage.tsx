import { Link } from 'react-router-dom'
import { episodeLabel, episodePath, episodes } from '../data/episodes'

export function EpisodesPage() {
  return (
    <main className="episodes-page">
      <header className="episode-index-hero">
        <div className="shell episode-index-intro">
          <span className="eyebrow">HELUT · Concept series</span>
          <h1>Episode companions</h1>
          <p>
            The complete teaching series in written form: episode context, claim epoch,
            on-screen points, and scene-by-scene narration.
          </p>
          <div className="episode-index-meta mono">
            <span>{episodes.length} episodes</span>
            <span>Generated from the canonical production scripts</span>
          </div>
        </div>
      </header>

      <section className="shell episode-index" aria-labelledby="episode-list-heading">
        <div className="episode-section-heading">
          <div>
            <span className="eyebrow">Browse the series</span>
            <h2 id="episode-list-heading">Every episode, one companion</h2>
          </div>
          <a
            href="https://github.com/JessicaMulein/MuleinLabs/tree/main/helut-videos"
            target="_blank"
            rel="noreferrer"
          >
            Production source ↗
          </a>
        </div>

        <ol className="episode-grid">
          {episodes.map((episode) => (
            <li key={episode.id}>
              <Link className="episode-card" to={episodePath(episode)}>
                <div className="episode-card-meta mono">
                  <span>{episodeLabel(episode)}</span>
                  <span>{episode.scenes.length} scenes</span>
                </div>
                <h2>{episode.title}</h2>
                <p>{episode.description}</p>
                <div className="episode-card-footer">
                  <span className="mono">{episode.claimEpoch}</span>
                  <strong>Open companion →</strong>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
