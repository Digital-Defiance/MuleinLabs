import { lazy, Suspense } from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

const TextbookPage = lazy(() =>
  import('./pages/TextbookPage').then((m) => ({ default: m.TextbookPage })),
)

function Nav() {
  return (
    <header className="topnav">
      <div className="shell topnav-inner">
        <NavLink to="/" className="brand" end>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" width={36} height={36} />
          <span>MuleinLabs</span>
        </NavLink>
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/textbook">Living textbook</NavLink>
            </li>
            <li>
              <a
                href="https://github.com/JessicaMulein/MuleinLabs"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>© 2026 MuleinLabs · teaching surface beside the science repos</div>
        <div className="mono">Science claims live in HELUT</div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <Suspense fallback={<div className="shell loading">Loading…</div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/textbook" element={<TextbookPage />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}
