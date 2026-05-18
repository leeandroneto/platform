#!/usr/bin/env tsx
// scripts/validate-palettes.ts — pnpm validate:apca (prebuild gate).
//
// APCA Silver dual-gate (ADR-0040 §H supersede ADR-0032 Bronze):
//   body       Lc >= 75  (texto corpo)
//   large      Lc >= 60  (texto grande)
//   non-text   Lc >= 45  (filled blocks, borders, focus rings)
//
// Scope dia 0 — split error vs warn:
//   ERROR  body-text vs surface-1 (≥75) — acessibilidade real, texto sempre legivel
//   WARN   primary/secondary/tertiary/primary-light vs surface-1 (≥45) — gosto
//          visual de "filled block adjacent to surface". APCA Silver 45 oficial e
//          pra THIN BORDERS, nao filled blocks (filled tradicional = Bronze 30,
//          ADR-0032 original). primary_foreground vs primary (texto on button) e
//          o gate de acessibilidade real — sera ativado em ERROR quando seed
//          ganhar campo `primary_foreground_oklch` (JIT — Sprint 2 conforme nota
//          original do validate). Charts vs surface tem regras proprias data viz.

import { apca, APCA_SILVER } from '../lib/design/contrast'
import { OFFICIAL_PALETTES, type PaletteSeed } from '../lib/design/palettes'

type Severity = 'error' | 'warn'

interface Check {
  palette: string
  mode: 'dark' | 'light'
  role: string
  lc: number
  threshold: number
  pass: boolean
  severity: Severity
}

// Foreground derivada — espelha calculo runtime do design system.
function foregroundFor(surfaceOklch: string, mode: 'dark' | 'light'): string {
  const m = /oklch\(\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s*\)/.exec(surfaceOklch)
  const h = m ? Number(m[1]) : 0
  const l = mode === 'dark' ? 0.95 : 0.15
  return `oklch(${l} 0.01 ${h})`
}

interface CheckParams {
  palette: PaletteSeed
  mode: 'dark' | 'light'
  role: string
  fg: string
  bg: string
  thresholdKey: keyof typeof APCA_SILVER
  severity: Severity
}

function mk(p: CheckParams): Check {
  const lc = apca(p.fg, p.bg)
  const threshold = APCA_SILVER[p.thresholdKey]
  return {
    palette: p.palette.slug,
    mode: p.mode,
    role: p.role,
    lc,
    threshold,
    pass: lc >= threshold,
    severity: p.severity,
  }
}

function checksForPalette(p: PaletteSeed): Check[] {
  const out: Check[] = []

  for (const mode of ['dark', 'light'] as const) {
    const surface1 = mode === 'dark' ? p.surfaces_dark[0] : p.surfaces_light[0]
    const fg = foregroundFor(surface1, mode)

    // ERROR — acessibilidade real (body text legivel sempre)
    out.push(
      mk({
        palette: p,
        mode,
        role: 'body-text',
        fg,
        bg: surface1,
        thresholdKey: 'body',
        severity: 'error',
      }),
    )

    // WARN — filled block vs surface (gosto visual, nao acessibilidade)
    out.push(
      mk({
        palette: p,
        mode,
        role: 'primary-fill',
        fg: p.primary_oklch,
        bg: surface1,
        thresholdKey: 'non-text',
        severity: 'warn',
      }),
    )
    if (p.primary_light_oklch) {
      out.push(
        mk({
          palette: p,
          mode,
          role: 'primary-light',
          fg: p.primary_light_oklch,
          bg: surface1,
          thresholdKey: 'non-text',
          severity: 'warn',
        }),
      )
    }
    out.push(
      mk({
        palette: p,
        mode,
        role: 'secondary',
        fg: p.secondary_oklch,
        bg: surface1,
        thresholdKey: 'non-text',
        severity: 'warn',
      }),
    )
    out.push(
      mk({
        palette: p,
        mode,
        role: 'tertiary',
        fg: p.tertiary_oklch,
        bg: surface1,
        thresholdKey: 'non-text',
        severity: 'warn',
      }),
    )

    for (let i = 0; i < p.extras_oklch.length; i++) {
      const chartColor = p.extras_oklch[i]
      if (chartColor) {
        out.push(
          mk({
            palette: p,
            mode,
            role: `chart-${i + 1}`,
            fg: chartColor,
            bg: surface1,
            thresholdKey: 'non-text',
            severity: 'warn',
          }),
        )
      }
    }
  }

  return out
}

console.log(
  `\nAPCA Silver (body=${APCA_SILVER.body}, non-text=${APCA_SILVER['non-text']}) — ${OFFICIAL_PALETTES.length} paletas:\n`,
)

const all: Check[] = []
for (const palette of OFFICIAL_PALETTES) {
  all.push(...checksForPalette(palette))
}

const errors = all.filter((c) => !c.pass && c.severity === 'error')
const warnings = all.filter((c) => !c.pass && c.severity === 'warn')

if (errors.length > 0) {
  console.error('ERROR — cenarios obrigatorios reprovados (body + primary):\n')
  for (const e of errors) {
    console.error(
      `  ${e.palette.padEnd(15)} ${e.mode.padEnd(5)} ${e.role.padEnd(13)} ` +
        `Lc=${e.lc.toFixed(1).padStart(5)} < ${e.threshold}`,
    )
  }
  console.error(`\n${errors.length} cenarios obrigatorios reprovaram. Build BLOQUEADO.`)
  process.exit(1)
}

if (warnings.length > 0) {
  console.warn(
    `\nWARN  ${warnings.length} cenarios secundarios abaixo de Silver ` +
      `(secondary/tertiary/primary-light/charts). Re-tunar JIT — nao bloqueia build.\n`,
  )
}

// Summary
const byPalette = new Map<string, Check[]>()
for (const c of all) {
  const list = byPalette.get(c.palette) ?? []
  list.push(c)
  byPalette.set(c.palette, list)
}

for (const [slug, results] of byPalette) {
  const errs = results.filter((r) => !r.pass && r.severity === 'error').length
  const warns = results.filter((r) => !r.pass && r.severity === 'warn').length
  const status = errs === 0 ? 'OK  ' : 'FAIL'
  const note = warns > 0 ? ` (${warns} warns secundarios)` : ''
  console.log(`${status} ${slug.padEnd(15)}${note}`)
}

console.log(
  `\nTotal: ${all.length - errors.length - warnings.length}/${all.length} passaram, ` +
    `${errors.length} errors, ${warnings.length} warns.`,
)
