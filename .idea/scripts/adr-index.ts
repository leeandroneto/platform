#!/usr/bin/env tsx
// ─── pnpm adr:index ──────────────────────────────────────────────────────────
// Regenera docs/adr/README.md a partir do frontmatter de cada ADR.
// Fonte: 14-docs-lifecycle.md §4 + ADR-0017.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ADR_DIR = 'docs/adr'

interface AdrMeta {
  number: string
  title: string
  date: string
  status: string
}

function parse(content: string, filename: string): AdrMeta | null {
  const numberMatch = filename.match(/^(\d{4})-/)
  if (!numberMatch) return null
  const number = numberMatch[1]

  const titleMatch = content.match(/^#\s+\d+\.\s+(.+)$/m)
  const dateMatch = content.match(/^Date:\s*(.+)$/m)
  const statusMatch = content.match(/^Status:\s*(.+)$/m)

  if (!titleMatch || !dateMatch || !statusMatch) return null

  return {
    number,
    title: titleMatch[1].trim(),
    date: dateMatch[1].trim(),
    status: statusMatch[1].trim(),
  }
}

function main() {
  const files = readdirSync(ADR_DIR)
    .filter((f) => /^\d{4}-.*\.md$/.test(f))
    .sort()

  const adrs: AdrMeta[] = []
  for (const file of files) {
    const content = readFileSync(join(ADR_DIR, file), 'utf-8')
    const meta = parse(content, file)
    if (meta) adrs.push(meta)
  }

  const readme = [
    '# ADRs — Architecture Decision Records',
    '',
    '> Decisões fechadas. Template: Michael Nygard (ADR-0017).',
    '> Imutáveis após `accepted` — superseded via novo ADR.',
    '> Gerado por `pnpm adr:index`. **Não edite manualmente.**',
    '',
    '## Índice',
    '',
    '| # | Título | Status | Data |',
    '|---|---|---|---|',
    ...adrs.map(
      (a) => `| ${a.number} | ${a.title} | ${a.status} | ${a.date} |`,
    ),
    '',
  ].join('\n')

  writeFileSync(join(ADR_DIR, 'README.md'), readme)
  console.log(`✅ ${ADR_DIR}/README.md regenerado (${adrs.length} ADRs)`)
}

main()
