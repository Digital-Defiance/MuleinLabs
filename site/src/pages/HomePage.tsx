import { Link } from 'react-router-dom'
import meta from '../../content/textbook-meta.json'

const heroBg = `${import.meta.env.BASE_URL}hero-bg.jpg`

export function HomePage() {
  return (
    <main>
      <section
        className="hero"
        style={{
          ['--hero-image' as string]: `url(${heroBg})`,
        }}
      >
        <div className="hero-glow" aria-hidden="true" />
        <div className="shell hero-inner">
          <img
            className="hero-mark"
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt="MuleinLabs"
            width={160}
            height={160}
          />
          <h1 className="hero-brand">MuleinLabs</h1>
          <p className="hero-lead">
            Teaching materials and lab media for reconfigurable homomorphic computing.
          </p>
          <div className="hero-lead-quote">"Where there's a wall, [there's a way]."</div>
          <div className="hero-lead-quote-source">— Joy Kogawa</div>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/textbook">
              Open the living textbook
            </Link>
            <a
              className="btn btn-ghost"
              href="https://helut.digitaldefiance.org"
              target="_blank"
              rel="noreferrer"
            >
              HELUT science site
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <h2>What lives here</h2>
          <p className="section-lead">
            MuleinLabs is the teaching and media umbrella. Research receipts stay in HELUT;
            this site is where the course surface and studio packages ship.
          </p>
          <ul className="offer-list">
            <li>
              <Link to="/textbook">
                <span className="offer-kicker">Course</span>
                <strong>Living textbook</strong>
                <span>
                  Edition {meta.edition} · epoch {meta.epoch} — foundations, three pillars,
                  labs, and frontier chapters.
                </span>
              </Link>
            </li>
            <li>
              <a href="https://github.com/JessicaMulein/MuleinLabs/tree/main/helut-videos">
                <span className="offer-kicker">Studio</span>
                <strong>helut-videos</strong>
                <span>Remotion + ElevenLabs concept series for the HELUT stack.</span>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
