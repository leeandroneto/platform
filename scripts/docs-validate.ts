#!/usr/bin/env tsx
// ─── pnpm docs:validate ──────────────────────────────────────────────────────
// CI guard de consistência docs. Falha se:
//   1. ADR em docs/adr/NNNN-*.md não aparece em docs/adr/README.md
//   2. `superseded by NNNN` aponta pra ADR inexistente
//   3. ADR sem `Date:` ou `Status:` no frontmatter
//   4. Blueprint cita `ADR-NNNN` que não existe
//   5. ADR README desatualizado (count diverge de arquivos no disco)
//
// Uso: pnpm docs:validate (exit 1 se algum erro)
// Fonte: 14-docs-lifecycle.md §4 + decisão auto-update dia 0.

import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const ADR_DIR = 'docs/adr'
const BLUEPRINT_DIR = 'docs/blueprint'
const VALID_STATUS = /^(proposed|accepted|deprecated|superseded by \d{4})/

interface AdrFile {
  number: string
  filename: string
  title: string | null
  date: string | null
  status: string | null
  supersedes: string | null
}

const errors: string[] = []

function parseAdr(filename: string): AdrFile | null {
  const numberMatch = filename.match(/^(\d{4})-/)
  const number = numberMatch?.[1]
  if (!number) return null
  const content = readFileSync(join(ADR_DIR, filename), 'utf-8')
  const titleMatch = content.match(/^#\s+\d+\.\s+(.+)$/m)
  const dateMatch = content.match(/^Date:\s*(.+)$/m)
  const statusMatch = content.match(/^Status:\s*(.+)$/m)
  const supersedesMatch = content.match(/Status:\s*superseded by (\d{4})/i)
  return {
    number,
    filename,
    title: titleMatch?.[1]?.trim() ?? null,
    date: dateMatch?.[1]?.trim() ?? null,
    status: statusMatch?.[1]?.trim() ?? null,
    supersedes: supersedesMatch?.[1] ?? null,
  }
}

function listAdrs(): AdrFile[] {
  return readdirSync(ADR_DIR)
    .filter((f) => /^\d{4}-.*\.md$/.test(f))
    .sort()
    .map(parseAdr)
    .filter((a): a is AdrFile => a !== null)
}

function listBlueprints(): string[] {
  return readdirSync(BLUEPRINT_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => join(BLUEPRINT_DIR, f))
}

function check1_adrInReadme(adrs: AdrFile[]) {
  const readmePath = join(ADR_DIR, 'README.md')
  try {
    statSync(readmePath)
  } catch {
    errors.push(`[1] ${readmePath} não existe. Rode \`pnpm adr:index\`.`)
    return
  }
  const readme = readFileSync(readmePath, 'utf-8')
  for (const adr of adrs) {
    if (!readme.includes(`| ${adr.number} |`)) {
      errors.push(
        `[1] ADR-${adr.number} (${adr.filename}) não está em ${readmePath}. Rode \`pnpm adr:index\`.`,
      )
    }
  }
}

function check2_supersedesValid(adrs: AdrFile[]) {
  const numbers = new Set(adrs.map((a) => a.number))
  for (const adr of adrs) {
    if (adr.supersedes && !numbers.has(adr.supersedes)) {
      errors.push(
        `[2] ADR-${adr.number} declara "superseded by ${adr.supersedes}" mas ADR-${adr.supersedes} não existe.`,
      )
    }
  }
}

function check3_frontmatter(adrs: AdrFile[]) {
  for (const adr of adrs) {
    if (!adr.title) errors.push(`[3] ADR-${adr.number} (${adr.filename}) sem título "# NNNN. ...".`)
    if (!adr.date) errors.push(`[3] ADR-${adr.number} (${adr.filename}) sem campo "Date:".`)
    if (!adr.status) {
      errors.push(`[3] ADR-${adr.number} (${adr.filename}) sem campo "Status:".`)
    } else if (!VALID_STATUS.test(adr.status)) {
      errors.push(
        `[3] ADR-${adr.number} (${adr.filename}) com Status inválido: "${adr.status}". Use proposed|accepted|deprecated|superseded by NNNN.`,
      )
    }
  }
}

function stripCodeBlocks(content: string): string {
  // Remove fenced code blocks (```...```) — citações lá são exemplos, não refs reais.
  return content.replace(/```[\s\S]*?```/g, '')
}

function check4_blueprintRefs(adrs: AdrFile[]) {
  const numbers = new Set(adrs.map((a) => a.number))
  const blueprintPaths = listBlueprints()
  const refPattern = /ADR-(\d{4})/g
  for (const path of blueprintPaths) {
    const content = stripCodeBlocks(readFileSync(path, 'utf-8'))
    const seen = new Set<string>()
    let match
    while ((match = refPattern.exec(content)) !== null) {
      const ref = match[1]
      if (!ref || seen.has(ref)) continue
      seen.add(ref)
      if (!numbers.has(ref)) {
        errors.push(`[4] ${path} cita ADR-${ref} mas o arquivo docs/adr/${ref}-*.md não existe.`)
      }
    }
  }
}

function check5_readmeCountMatches(adrs: AdrFile[]) {
  const readmePath = join(ADR_DIR, 'README.md')
  try {
    const readme = readFileSync(readmePath, 'utf-8')
    const rowMatches = readme.match(/^\|\s*\d{4}\s*\|/gm)
    const readmeCount = rowMatches?.length ?? 0
    if (readmeCount !== adrs.length) {
      errors.push(
        `[5] ${readmePath} lista ${readmeCount} ADRs mas há ${adrs.length} arquivos em ${ADR_DIR}/. Rode \`pnpm adr:index\`.`,
      )
    }
  } catch {
    /* check1 já reportou */
  }
}

function main() {
  const adrs = listAdrs()
  check1_adrInReadme(adrs)
  check2_supersedesValid(adrs)
  check3_frontmatter(adrs)
  check4_blueprintRefs(adrs)
  check5_readmeCountMatches(adrs)

  if (errors.length === 0) {
    console.log(`✅ docs:validate OK — ${adrs.length} ADRs, 0 inconsistências`)
    process.exit(0)
  }
  console.error(`❌ docs:validate falhou — ${errors.length} inconsistência(s):\n`)
  for (const e of errors) console.error(`  ${e}`)
  console.error('')
  process.exit(1)
}

main()
