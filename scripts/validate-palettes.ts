#!/usr/bin/env tsx
// ─── pnpm validate:palettes ──────────────────────────────────────────────────
// APCA dual-gate validator — escopo definido em ADR-0032.
//
// Cenários testados (alinhados com USO real do design system):
//
//   1. body text on surface → APCA(foreground, surface-1) ≥ 75
//      foreground é derivada (L=0.95 em dark, L=0.15 em light) garantindo body
//      contrast por construção. Validamos pra confirmar que surfaces estão na
//      faixa esperada.
//
//   2. primary como filled action block → APCA(primary, surface-1) ≥ 30
//      Threshold APCA-W3 silver pra blocos preenchidos (filled buttons/badges
//      vs page bg). NÃO 45 (Bronze non-text é pra thin borders 1-2px). NÃO
//      testamos primary como texto — esse não é seu papel (vide ADR-0032).
//
// Threshold ref: APCA Bronze (D-G12) — body ≥75, large ≥60, non-text ≥45.
// Fonte: ADR-0009 (premium) + 05-design-system.md §5 + ADR-0032 (escopo X).
//
// "Text on primary button" (cenário 3) NÃO é validado dia 0 — primary_foreground
// será adicionado Sprint 2 (campo `primary_foreground_oklch` no seed).

import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { converter, type Oklch, type Rgb } from 'culori'

import { OFFICIAL_PALETTES } from '../lib/design/seeds/palettes.seed'

const toRgb = converter('rgb')

function oklchStrToSrgb(oklchStr: string): [number, number, number] {
  const match = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/.exec(oklchStr)
  if (!match) throw new Error(`Invalid OKLCH: ${oklchStr}`)
  const [, lStr, cStr, hStr] = match
  const oklch: Oklch = {
    mode: 'oklch',
    l: Number(lStr),
    c: Number(cStr),
    h: Number(hStr),
  }
  const rgb = toRgb(oklch) as Rgb
  return [
    Math.max(0, Math.min(255, Math.round((rgb.r ?? 0) * 255))),
    Math.max(0, Math.min(255, Math.round((rgb.g ?? 0) * 255))),
    Math.max(0, Math.min(255, Math.round((rgb.b ?? 0) * 255))),
  ]
}

function apca(fgOklch: string, bgOklch: string): number {
  const fgRgb = oklchStrToSrgb(fgOklch)
  const bgRgb = oklchStrToSrgb(bgOklch)
  return Math.abs(Number(APCAcontrast(sRGBtoY(fgRgb), sRGBtoY(bgRgb))))
}

// Foreground derivado (mesmo cálculo do design system runtime).
// Dark mode: L alto (~0.95) com mesma hue do surface.
function foregroundForDarkSurface(surfaceOklch: string): string {
  const m = /oklch\(\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s*\)/.exec(surfaceOklch)
  const h = m ? Number(m[1]) : 0
  return `oklch(0.95 0.01 ${h})`
}

const TH = { body: 75, filledBlock: 30 } as const

let failures = 0

console.log('Validating ', OFFICIAL_PALETTES.length, 'paletas (ADR-0032 scope):')
console.log('  Cenário 1: APCA(foreground, surface-1-dark) ≥ 75 (body text)')
console.log('  Cenário 2: APCA(primary, surface-1-dark)    ≥ 30 (filled block, silver)')
console.log()

for (const p of OFFICIAL_PALETTES) {
  const surface1 = p.surfaces_dark[0]
  const fg = foregroundForDarkSurface(surface1)

  const lcBody = apca(fg, surface1)
  const lcBlock = apca(p.primary_oklch, surface1)

  const passBody = lcBody >= TH.body
  const passBlock = lcBlock >= TH.filledBlock

  const status = passBody && passBlock ? 'OK' : 'FAIL'
  console.log(
    `${status.padEnd(4)} ${p.slug.padEnd(15)} body=${lcBody.toFixed(1).padStart(5)} ` +
      `block=${lcBlock.toFixed(1).padStart(5)}`,
  )

  if (!passBody || !passBlock) failures++
}

if (failures > 0) {
  console.error(`\n${failures} paletas reprovaram APCA dual-gate (ADR-0032 cenários 1+2).`)
  process.exit(1)
}

console.log('\nTodas as paletas passam dual-gate.')
