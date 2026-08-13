#!/usr/bin/env node
/**
 * Copy + light-clean the HELUT living textbook Markdown into site/content.
 * Prefer sibling checkout; fall back to the committed copy for CI.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(__dirname, '..')
const contentDir = join(siteRoot, 'content')
const outPath = join(contentDir, 'living-textbook.md')
const metaPath = join(contentDir, 'textbook-meta.json')

const candidates = [
  join(siteRoot, '..', '..', 'HELUT', 'textbook', 'helut-living-textbook.md'),
  join(siteRoot, '..', 'HELUT', 'textbook', 'helut-living-textbook.md'),
  join(contentDir, 'living-textbook.source.md'),
]

mkdirSync(contentDir, { recursive: true })

const source = candidates.find((p) => existsSync(p))
if (!source) {
  if (existsSync(outPath)) {
    console.log('sync-textbook: no upstream source; keeping existing content/living-textbook.md')
    process.exit(0)
  }
  console.error('sync-textbook: could not find helut-living-textbook.md')
  process.exit(1)
}

let md = readFileSync(source, 'utf8')

// Drop HTML comment header
md = md.replace(/^<!--[\s\S]*?-->\n*/, '')

// Pandoc fenced divs → callout blocks
md = md.replace(/^::: *(\w+)\s*\n([\s\S]*?)^:::\s*$/gm, (_m, kind, body) => {
  const title = String(kind).replace(/[-_]/g, ' ')
  return `\n> **${title}**\n>\n${body
    .trim()
    .split('\n')
    .map((line) => `> ${line}`)
    .join('\n')}\n`
})

// Heading attributes {#id .class} → keep id in HTML-friendly form
md = md.replace(/^(#{1,6}\s+.+?)\s*\{#([^}\s]+)[^}]*\}\s*$/gm, '$1')

// Soften pandoc cite clusters [@a; @b] → (a; b)
md = md.replace(/\[@([^\]]+)\]/g, (_m, inner) => {
  const labels = String(inner)
    .split(';')
    .map((s) => s.trim().replace(/^@/, ''))
    .filter(Boolean)
  return `(${labels.join('; ')})`
})

// Pandoc definition-list lines "Term.\n\n: Definition" → markdown bold
md = md.replace(/^(.+)\.\n\n: (.+)$/gm, '**$1.** $2')

writeFileSync(outPath, md)

// Keep a raw fallback for CI when HELUT is not checked out
if (!source.endsWith('living-textbook.source.md')) {
  copyFileSync(source, join(contentDir, 'living-textbook.source.md'))
}

const epochMatch = md.match(/living edition\s+([\d.]+)\s*\(([^)]+)\)/i)
const meta = {
  syncedFrom: source,
  syncedAt: new Date().toISOString(),
  edition: epochMatch?.[1] ?? '0.1',
  epoch: epochMatch?.[2] ?? 'unknown',
  title: 'Reconfigurable Homomorphic Computing',
  subtitle: 'A Living Textbook',
}

writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n')
console.log(`sync-textbook: wrote ${outPath}`)
console.log(`sync-textbook: edition ${meta.edition} · epoch ${meta.epoch}`)
