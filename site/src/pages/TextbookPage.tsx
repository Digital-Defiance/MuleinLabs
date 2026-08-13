import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import rawTextbook from '../../content/living-textbook.md?raw'
import meta from '../../content/textbook-meta.json'
import { assignHeadingIds, stripLeadingTitle, type TocEntry } from '../lib/toc'

export function TextbookPage() {
  const body = useMemo(() => stripLeadingTitle(rawTextbook), [])
  const headings = useMemo(() => assignHeadingIds(body), [body])
  const toc = useMemo(() => headings.filter((h) => h.depth <= 3), [headings])
  const [activeId, setActiveId] = useState(toc[0]?.id ?? '')

  useEffect(() => {
    const els = toc
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (els.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]?.target.id) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: [0, 1] },
    )

    for (const el of els) observer.observe(el)
    return () => observer.disconnect()
  }, [toc])

  let headingIndex = 0
  const takeId = () => headings[headingIndex++]?.id

  return (
    <main className="textbook-page">
      <div className="shell textbook-layout">
        <aside className="toc" aria-label="Table of contents">
          <div className="toc-meta">
            <span className="mono">edition {meta.edition}</span>
            <span className="mono">{meta.epoch}</span>
          </div>
          <nav>
            <ul>
              {toc.map((entry) => (
                <TocLink key={entry.id} entry={entry} activeId={activeId} />
              ))}
            </ul>
          </nav>
        </aside>

        <article className="prose">
          <header className="prose-header">
            <p className="eyebrow">Living textbook</p>
            <h1>{meta.title}</h1>
            <p>
              {meta.subtitle} · edition {meta.edition} · epoch {meta.epoch}
            </p>
          </header>

          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ children }) => <h1 id={takeId()}>{children}</h1>,
              h2: ({ children }) => <h2 id={takeId()}>{children}</h2>,
              h3: ({ children }) => <h3 id={takeId()}>{children}</h3>,
              h4: ({ children }) => <h4 id={takeId()}>{children}</h4>,
              h5: ({ children }) => <h5 id={takeId()}>{children}</h5>,
              h6: ({ children }) => <h6 id={takeId()}>{children}</h6>,
              a: ({ href, children }) => {
                if (href?.startsWith('#')) {
                  return <a href={href}>{children}</a>
                }
                return (
                  <a href={href} target="_blank" rel="noreferrer">
                    {children}
                  </a>
                )
              },
            }}
          >
            {body}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  )
}

function TocLink({ entry, activeId }: { entry: TocEntry; activeId: string }) {
  return (
    <li data-depth={entry.depth} className={entry.id === activeId ? 'is-active' : undefined}>
      <a href={`#${entry.id}`}>{entry.text}</a>
    </li>
  )
}
