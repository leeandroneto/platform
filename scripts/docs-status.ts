#!/usr/bin/env tsx
// ─── pnpm docs:status ────────────────────────────────────────────────────────
// Gera docs/_status.md com snapshot atual do projeto (sem consulta a banco).
// Útil pra abrir o repo daqui 2 semanas e saber onde parou.
//
// Lê: filesystem (docs/adr/, docs/blueprint/, docs/migrations/, CLAUDE.md, package.json).
// NÃO consulta Supabase nem GitHub (rodar manual via mcp__supabase__list_migrations
// quando quiser estado real do banco — esse script é só estático).

import { execSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const ADR_DIR = 'docs/adr'
const BLUEPRINT_DIR = 'docs/blueprint'
const MIGRATIONS_DIR = 'docs/migrations'

interface AdrSummary {
  total: number
  byStatus: Record<string, number>
  latest: { number: string; title: string; date: string } | null
}

function gitLastCommit(path: string): string {
  try {
    return (
      execSync(`git log -1 --format="%ad" --date=short -- "${path}"`, {
        cwd: ROOT,
        encoding: 'utf-8',
      }).trim() || 'n/a'
    )
  } catch {
    return 'n/a'
  }
}

function gitBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim()
  } catch {
    return 'n/a'
  }
}

function gitCommitCount(): number {
  try {
    return parseInt(
      execSync('git rev-list --count HEAD', { cwd: ROOT, encoding: 'utf-8' }).trim() || '0',
      10,
    )
  } catch {
    return 0
  }
}

function summarizeAdrs(): AdrSummary {
  const files = readdirSync(ADR_DIR)
    .filter((f) => /^\d{4}-.*\.md$/.test(f))
    .sort()
  const byStatus: Record<string, number> = {}
  let latest: AdrSummary['latest'] = null
  for (const file of files) {
    const content = readFileSync(join(ADR_DIR, file), 'utf-8')
    const status = content.match(/^Status:\s*(.+)$/m)?.[1]?.trim() ?? 'unknown'
    const date = content.match(/^Date:\s*(.+)$/m)?.[1]?.trim() ?? 'n/a'
    const title = content.match(/^#\s+\d+\.\s+(.+)$/m)?.[1]?.trim() ?? file
    const number = file.match(/^(\d{4})-/)?.[1] ?? '0000'
    const key = status.startsWith('superseded by') ? 'superseded' : status
    byStatus[key] = (byStatus[key] ?? 0) + 1
    latest = { number, title, date }
  }
  return { total: files.length, byStatus, latest }
}

function countMigrations(): number {
  try {
    return readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.md')).length
  } catch {
    return 0
  }
}

function countBlueprints(): number {
  try {
    return readdirSync(BLUEPRINT_DIR).filter((f) => /^\d{2}-.*\.md$/.test(f)).length
  } catch {
    return 0
  }
}

function findPending(): string[] {
  const hits: string[] = []
  function walk(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (['_archive', '_boilerplate', 'node_modules', '.next'].includes(entry.name)) continue
        walk(join(dir, entry.name))
      } else if (entry.name.endsWith('.md')) {
        const path = join(dir, entry.name)
        const content = readFileSync(path, 'utf-8')
        // Case-sensitive + delimitador (colon, bold, list marker) — evita matches
        // tipo "todo" em PT-BR ou "TODO lugar" (português coloquial maiúsculo).
        const matches = content.match(
          /^.*(\b(?:TODO|FIXME|XXX):|^\s*-\s+(?:TODO|FIXME|XXX)\b|\*\*(?:TODO|FIXME|XXX|PENDING|PENDENTE)\*\*).*$/gm,
        )
        if (matches) {
          for (const m of matches.slice(0, 3)) {
            hits.push(`- ${path}: ${m.trim().slice(0, 100)}`)
          }
        }
      }
    }
  }
  walk('docs')
  return hits
}

function getPackageVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync('package.json', 'utf-8'))
    return pkg.version ?? 'n/a'
  } catch {
    return 'n/a'
  }
}

function render(): string {
  const adrs = summarizeAdrs()
  const migrations = countMigrations()
  const blueprints = countBlueprints()
  const pending = findPending()
  const today = new Date().toISOString().split('T')[0]

  const statusLines = Object.entries(adrs.byStatus)
    .sort()
    .map(([k, v]) => `- **${k}**: ${v}`)
    .join('\n')

  const pendingBlock =
    pending.length === 0
      ? '_Nenhum TODO/FIXME/PENDING encontrado em `docs/`._'
      : pending.slice(0, 20).join('\n')

  return `# Status — \`platform\`

> Gerado por \`pnpm docs:status\` em **${today}**.
> NÃO edite manualmente — re-gere com \`pnpm docs:status\`.
> Estado do banco Supabase: consulte via \`mcp__supabase__list_migrations\` (este script é estático).

---

## Git

| Campo | Valor |
|---|---|
| Branch | \`${gitBranch()}\` |
| Commits | ${gitCommitCount()} |
| Última mudança em \`CLAUDE.md\` | ${gitLastCommit('CLAUDE.md')} |
| Última mudança em \`docs/adr/\` | ${gitLastCommit('docs/adr')} |
| Última mudança em \`docs/blueprint/\` | ${gitLastCommit('docs/blueprint')} |

## Package

- **Versão:** \`${getPackageVersion()}\`

## ADRs

- **Total:** ${adrs.total}
${statusLines}
${adrs.latest ? `- **Último:** ADR-${adrs.latest.number} — ${adrs.latest.title} (${adrs.latest.date})` : ''}

## Blueprints

- **Total:** ${blueprints} arquivos em \`docs/blueprint/\`

## Migrations

- **Total documentado:** ${migrations} arquivo(s) em \`docs/migrations/\`
- ℹ️ Para estado real aplicado no Supabase, rode \`mcp__supabase__list_migrations\` via Claude Code.

## Pendências (TODO / FIXME / PENDING em \`docs/\`)

${pendingBlock}

---

_Próxima geração: rodar \`pnpm docs:status\` após qualquer mudança significativa em ADRs/blueprints/migrations._
`
}

function main() {
  const md = render()
  writeFileSync('docs/_status.md', md)
  console.log(`✅ docs/_status.md gerado (${md.split('\n').length} linhas)`)
}

main()
