// Adapted from tweakcn-ref/utils/color-converter.ts (Apache-2.0). See NOTICE.md.
//
// Conversor entre formatos de cor (hex / hsl / oklch / rgb) usado em:
//   - Builder UI (Fase 5+) — code panel multi-formato (preview/export)
//   - Shadow algorithm (`build-theme-css.ts`) — gera `hsl(... / opacity)` a partir de
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

/** Formata número: 0 → "0", inteiro → string, decimal → toFixed(4). */
export function formatNumber(num?: number): string {
  if (!num) return '0'
  return num % 1 === 0 ? String(num) : num.toFixed(4)
}

/** Formata Hsl culori → "hsl(H S% L%)" (Tailwind v4 / CSS modern syntax). */
export function formatHsl(hsl: Hsl): string {
  return `hsl(${formatNumber(hsl.h)} ${formatNumber((hsl.s ?? 0) * 100)}% ${formatNumber(
    (hsl.l ?? 0) * 100,
  )}%)`
}

/**
 * Converte string de cor entre formatos. Lança AppError se input inválido (parser
 * hard-fail — diferente do TweakCN original que retornava input cru em catch).
 *
 * - `hex` → hex string (#rrggbb)
 * - `hsl` → "hsl" CSS string (Tailwind v4 modern syntax — sem branch v3 legacy)
 * - `oklch` → "oklch" CSS string (kebab numérico, sem unidades)
 * - `rgb` → "rgb" CSS string (via culori formatRgb)
 */
export function colorFormatter(colorValue: string, format: ColorFormat = 'oklch'): string {
  const color = culori.parse(colorValue)
  if (!color) {
    throw AppError.invalidInput(`Invalid color input: ${colorValue}`)
  }

  switch (format) {
    case 'hsl': {
      const hsl = culori.converter('hsl')(color)
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
