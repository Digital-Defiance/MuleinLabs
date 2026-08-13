export type TocEntry = {
  depth: number
  text: string
  id: string
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function uniqueId(text: string, seen: Map<string, number>): string {
  let id = slugify(text)
  const count = seen.get(id) ?? 0
  seen.set(id, count + 1)
  if (count > 0) id = `${id}-${count}`
  return id
}

/** Assign stable ids to every ATX heading in document order. */
export function assignHeadingIds(md: string): TocEntry[] {
  const seen = new Map<string, number>()
  const entries: TocEntry[] = []

  for (const line of md.split('\n')) {
    const match = /^(#{1,6})\s+(.+)$/.exec(line)
    if (!match) continue
    const depth = match[1].length
    const text = match[2].trim()
    entries.push({ depth, text, id: uniqueId(text, seen) })
  }

  return entries
}

/** Drop the leading title block so the page chrome owns the brand header. */
export function stripLeadingTitle(md: string): string {
  return md.replace(/^#\s+.+\n+(?:\*[^\n]+\*\n+)?/, '')
}
