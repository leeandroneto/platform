// Adapted from tweakcn-ref/utils/color-converter.ts (Apache-2.0). See NOTICE.md.
//
// Conversor entre formatos de cor (hex / hsl / oklch / rgb) usado em:
//   - Builder UI (Fase 5+) — code panel multi-formato (preview/export)
//   - Shadow algorithm (`shadows.ts`) — gera `hsl(... / opacity)` a partir de
//     `--shadow-color` em qualquer formato source
//   - Fallback HEX JIT pra surfaces que exigem hex (PWA manifest, email, OG image)
//     via `oklchToHex` re-exportado de `./contrast.ts`
//
// Diferenças vs original TweakCN:
//   - branch Tailwind v3 `oklch-to-hsl` removida (somos Tailwind v4 only)
//   - `console.error` substituído por throw `AppError.invalidInput` (parser hard-fail)
//   - `oklchToHex` re-exportado de `./contrast.ts` (não duplicar)
//   - Top-level `formatNumber` / `formatHsl` exportados pra reuso em shadow algorithm

import type { Hsl } from 'culori'
import * as culori from 'culori'

import { AppError } from '@/lib/contracts/errors'

export type ColorFormat = 'hex' | 'hsl' | 'oklch' | 'rgb'
export type TailwindVersion = '3' | '4'

/** Formata número: 0 → "0", inteiro → string, decimal → toFixed(4). */
export function formatNumber(num?: number): string {
  if (!num) return '0'
  return num % 1 === 0 ? String(num) : num.toFixed(4)
}

/**
 * Formata Hsl culori → CSS modern syntax.
 * Preserva canal alpha quando presente e < 1:
 *   hsl(H S% L% / alpha) — ex: "hsl(325.78 58.18% 56.86% / 0.5)"
 * Sem alpha: hsl(H S% L%) — sem a cláusula / alpha.
 */
export function formatHsl(hsl: Hsl): string {
  const h = formatNumber(hsl.h)
  const s = formatNumber((hsl.s ?? 0) * 100)
  const l = formatNumber((hsl.l ?? 0) * 100)
  const base = `hsl(${h} ${s}% ${l}%)`
  return hsl.alpha !== undefined && hsl.alpha < 1
    ? `hsl(${h} ${s}% ${l}% / ${formatNumber(hsl.alpha)})`
    : base
}

/**
 * Converte string de cor entre formatos. Espelha upstream tweakcn-ref/utils/
 * color-converter.ts:colorFormatter(value, format='hsl', tailwindVersion='3').
 *
 * - `hex` → hex string (#rrggbb)
 * - `hsl` → Tailwind v3 ("H S% L%" chunk sem wrapper) ou v4 ("hsl(H S% L%)" wrapped)
 * - `oklch` → "oklch(L C H)" CSS string
 * - `rgb` → "rgb" CSS string (via culori formatRgb)
 *
 * Lança AppError se input inválido (parser hard-fail — divergente do upstream
 * que retornava input cru em catch; gap defensivo deliberado nosso).
 */
export function colorFormatter(
  colorValue: string,
  format: ColorFormat = 'hsl',
  tailwindVersion: TailwindVersion = '3',
): string {
  const color = culori.parse(colorValue)
  if (!color) {
    throw AppError.invalidInput(`Invalid color input: ${colorValue}`)
  }

  switch (format) {
    case 'hsl': {
      const hsl = culori.converter('hsl')(color)
      // Tailwind v3 emite chunk "H S% L%" usado dentro de hsl(... / alpha) por
      // callers (ex: shadows.ts). v4 emite wrapper completo "hsl(H S% L%)".
      if (tailwindVersion === '3') {
        const h = formatNumber(hsl.h)
        const s = formatNumber((hsl.s ?? 0) * 100)
        const l = formatNumber((hsl.l ?? 0) * 100)
        return `${h} ${s}% ${l}%`
      }
      return formatHsl(hsl)
    }
    case 'rgb':
      return culori.formatRgb(color) ?? colorValue
    case 'oklch': {
      const oklch = culori.converter('oklch')(color)
      return `oklch(${formatNumber(oklch.l)} ${formatNumber(oklch.c)} ${formatNumber(oklch.h)})`
    }
    case 'hex':
      return culori.formatHex(color) ?? colorValue
    default:
      return colorValue
  }
}

// Re-export oklchToHex de contrast.ts (SSOT — não duplicar).
export { oklchToHex } from './contrast'
