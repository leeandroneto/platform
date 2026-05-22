// lib/design/contrast.ts — APCA Silver dual-gate helpers (ADR-0040 §H).
//
// Single source of truth pra:
//   - calculo APCA Lc (OKLCH -> bytes -> APCA-W3)
//   - validacao Silver thresholds (body 75 / large 60 / non-text 45)
//   - ajuste automatico de cor pra atingir threshold (bisection L)
//   - escolha de foreground readable (black|white) por |Lc| maximo
//   - validateThemeAPCA wrapper (ADR-0045 D.17 — soft warn gate pra save actions)
//
// Consumers:
//   - scripts/validate-palettes.ts (gate build-time, prebuild)
//   - app/api/{tenants,brands}/[id]/theme.css/route.ts (runtime tenant theme)
//   - server actions ao salvar paleta tenant custom (validateThemeAPCA)

import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { converter, formatHex, type Oklch, parse, type Rgb } from 'culori'

import { AppError } from '@/lib/contracts/errors'
import { ok, type Result } from '@/lib/contracts/result'
import type { Theme } from '@/lib/design/contract/theme'

// ─── Silver thresholds (APCA-W3 official naming) ────────────────────────────
export const APCA_SILVER = {
  body: 75, // texto corpo (paragrafos, labels, headings menores)
  large: 60, // texto grande (>=24px bold ou >=36px regular)
  'non-text': 45, // borders, icones, focus rings, filled blocks
} as const

export type ApcaRole = keyof typeof APCA_SILVER

// ─── OKLCH -> bytes (0-255 triple) ──────────────────────────────────────────
const toRgb = converter('rgb')

function oklchToBytes(oklchStr: string): readonly [number, number, number] {
  const match = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/.exec(oklchStr)
  if (!match) {
    throw new Error(`Invalid OKLCH string: ${oklchStr}`)
  }
  const [, lStr, cStr, hStr] = match
  const oklch: Oklch = {
    mode: 'oklch',
    l: Number(lStr),
    c: Number(cStr),
    h: Number(hStr),
  }
  const sample = toRgb(oklch) as Rgb
  return [
    Math.max(0, Math.min(255, Math.round((sample.r ?? 0) * 255))),
    Math.max(0, Math.min(255, Math.round((sample.g ?? 0) * 255))),
    Math.max(0, Math.min(255, Math.round((sample.b ?? 0) * 255))),
  ] as const
}

// ─── Helpers publicos ───────────────────────────────────────────────────────

/** APCA Lc absoluto entre fg/bg em OKLCH. Sempre positivo. */
export function apca(fgOklch: string, bgOklch: string): number {
  const fgBytes = oklchToBytes(fgOklch) as unknown as [number, number, number]
  const bgBytes = oklchToBytes(bgOklch) as unknown as [number, number, number]
  return Math.abs(Number(APCAcontrast(sRGBtoY(fgBytes), sRGBtoY(bgBytes))))
}

/** Atende threshold Silver pra role (body / large / non-text)? */
export function meetsApca(fg: string, bg: string, role: ApcaRole): boolean {
  return apca(fg, bg) >= APCA_SILVER[role]
}

/** Black ou white — o que da maior |Lc| contra o bg. Util pra foreground rapido. */
export function pickReadableForeground(bgOklch: string): 'oklch(0 0 0)' | 'oklch(1 0 0)' {
  const black = apca('oklch(0 0 0)', bgOklch)
  const white = apca('oklch(1 0 0)', bgOklch)
  return white >= black ? 'oklch(1 0 0)' : 'oklch(0 0 0)'
}

// Fallback hex calculado UMA VEZ no module load (preto puro). Garante que oklchToHex
// SEMPRE retorne hex valido — nunca devolve string OKLCH crua que quebraria spec PWA.
const HEX_FALLBACK: string = formatHex(parse('oklch(0 0 0)')) ?? ''

/**
 * Converte OKLCH string pra hex. Usado em manifest.webmanifest, PWA theme-color,
 * email templates — surfaces que exigem hex pela spec (PWA W3C, MIME image/png Satori, etc).
 * SEMPRE retorna hex valido (fallback preto). Nunca OKLCH crua — quebraria spec.
 */
export function oklchToHex(oklchStr: string): string {
  return formatHex(parse(oklchStr)) ?? HEX_FALLBACK
}

/**
 * Ajusta L do fg ate atingir minLc contra bg (bisection). Preserva H, C.
 * Retorna string OKLCH ajustada. Lanca se nao conseguir em 20 iteracoes.
 */
export function ensureAccessible(fgOklch: string, bgOklch: string, minLc: number): string {
  const match = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/.exec(fgOklch)
  if (!match) throw new Error(`Invalid OKLCH: ${fgOklch}`)
  const [, , cStr, hStr] = match
  const c = Number(cStr)
  const h = Number(hStr)

  if (apca(fgOklch, bgOklch) >= minLc) {
    return fgOklch
  }

  const tryL = (l: number) => {
    const candidate = `oklch(${l.toFixed(3)} ${c} ${h})`
    return { candidate, lc: apca(candidate, bgOklch) }
  }

  let bestCandidate = fgOklch
  let bestLc = apca(fgOklch, bgOklch)

  for (let i = 0; i < 20; i++) {
    const lDark = i / 20
    const lLight = 1 - i / 40
    const dark = tryL(lDark)
    const light = tryL(lLight)
    const pick = dark.lc > light.lc ? dark : light
    if (pick.lc > bestLc) {
      bestLc = pick.lc
      bestCandidate = pick.candidate
    }
    if (bestLc >= minLc) return bestCandidate
  }

  throw new Error(
    `ensureAccessible: nao foi possivel atingir Lc=${minLc} (melhor=${bestLc.toFixed(1)})`,
  )
}

// ─── APCA theme validation (ADR-0045 D.17) ──────────────────────────────────

export interface ApcaValidationFailure {
  /** Pair identifier, e.g. "light:background-foreground" */
  pair: string
  fg: string
  bg: string
  lc: number
  threshold: number
  tier: 'body' | 'large' | 'non-text'
}

export interface ApcaValidationResult {
  passed: boolean
  failures: ApcaValidationFailure[]
}

type ApcaCheckSpec = {
  pair: string
  fgKey: keyof Theme['light']
  bgKey: keyof Theme['light']
  tier: 'body' | 'large' | 'non-text'
}

/**
 * Critical pairs tested in validateThemeAPCA (applied to both light and dark modes).
 * Thresholds: body Lc≥75, large Lc≥60, non-text Lc≥45 (ADR-0040 §H APCA Silver).
 */
export const APCA_CHECK_PAIRS: readonly ApcaCheckSpec[] = [
  // body Lc ≥75 — text content surfaces
  { pair: 'background-foreground', fgKey: 'foreground', bgKey: 'background', tier: 'body' },
  { pair: 'card-card-foreground', fgKey: 'card-foreground', bgKey: 'card', tier: 'body' },
  {
    pair: 'popover-popover-foreground',
    fgKey: 'popover-foreground',
    bgKey: 'popover',
    tier: 'body',
  },
  // large Lc ≥60 — action surfaces (buttons, badges)
  {
    pair: 'primary-primary-foreground',
    fgKey: 'primary-foreground',
    bgKey: 'primary',
    tier: 'large',
  },
  {
    pair: 'secondary-secondary-foreground',
    fgKey: 'secondary-foreground',
    bgKey: 'secondary',
    tier: 'large',
  },
  // non-text Lc ≥45 — decorative borders/rings vs page background
  { pair: 'border-vs-background', fgKey: 'border', bgKey: 'background', tier: 'non-text' },
  { pair: 'input-vs-background', fgKey: 'input', bgKey: 'background', tier: 'non-text' },
  { pair: 'ring-vs-background', fgKey: 'ring', bgKey: 'background', tier: 'non-text' },
] as const

/**
 * Validates a Theme snapshot against APCA Silver thresholds.
 *
 * ADR-0045 D.17: soft warn UX — does NOT hard-block by itself.
 * The calling server action decides: hard reject OR soft warn
 * based on `ignoreApcaWarning` flag passed by the UI.
 *
 * Tests both light and dark mode for each critical pair.
 * Pairs with missing or non-OKLCH tokens are skipped (HEX fallback tolerance).
 */
export function validateThemeAPCA(theme: Theme): Result<ApcaValidationResult, AppError> {
  const failures: ApcaValidationFailure[] = []
  const modes: Array<'light' | 'dark'> = ['light', 'dark']

  for (const mode of modes) {
    const styles = theme[mode]
    for (const spec of APCA_CHECK_PAIRS) {
      const fg = styles[spec.fgKey] as string | undefined
      const bg = styles[spec.bgKey] as string | undefined

      // Skip pair if either token is missing or not OKLCH (HEX fallback — tolerate)
      if (!fg || !bg) continue
      if (!fg.startsWith('oklch(') || !bg.startsWith('oklch(')) continue

      let lc: number
      try {
        lc = apca(fg, bg)
      } catch {
        // Skip pair on parse error (malformed OKLCH string)
        continue
      }

      const threshold = APCA_SILVER[spec.tier]
      if (lc < threshold) {
        failures.push({
          pair: `${mode}:${spec.pair}`,
          fg,
          bg,
          lc,
          threshold,
          tier: spec.tier,
        })
      }
    }
  }

  return ok({ passed: failures.length === 0, failures })
}
