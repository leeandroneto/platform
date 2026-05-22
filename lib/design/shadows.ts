// adapted from tweakcn-ref/utils/shadows.ts (Apache-2.0). See NOTICE.md.
//
// `generateShadowLevels(shadowColor, common) → Record<string, string>`
//
// Deriva 8 níveis de shadow a partir de 6 primitivas:
//   shadow-color · shadow-opacity · shadow-blur · shadow-spread ·
//   shadow-offset-x · shadow-offset-y
//
// Algoritmo idêntico ao TweakCN `getShadowMap()`, adaptado para:
//   - Nossa assinatura `(shadowColor: string, common: ThemeCommon)` — sem
//     dependência de `ThemeEditorState` / Zustand (server-side safe)
//   - `colorFormatter` importado de `./color-format` (nossa versão culori)
//   - `formatNumber` para precisão consistente na formatação opacity
//
// Usado por:
//   - `lib/design/build-theme-css.ts` — emite CSS vars per-tenant runtime
//   - `lib/design/registry/generate-registry-item.ts` — payload shadcn registry
//   - Fase 5 preview live (theme-studio builder)

import { colorFormatter, formatNumber } from './color-format'
import type { ThemeCommon } from './contract/theme'

/**
 * Gera 8 níveis de shadow CSS a partir das 6 primitivas do ThemeCommon.
 *
 * @param shadowColor - Valor `--shadow-color` do modo (light ou dark). Qualquer
 *   formato culori-parseable (OKLCH, HEX, HSL, RGB).
 * @param common - ThemeCommon com as 5 shadow primitives + restante do common.
 * @returns Record com as 8 keys: shadow-2xs, shadow-xs, shadow-sm, shadow,
 *   shadow-md, shadow-lg, shadow-xl, shadow-2xl.
 */
export function generateShadowLevels(
  shadowColor: string,
  common: ThemeCommon,
): Record<string, string> {
  // Converte shadow-color para HSL chunk "H S% L%" (sem parênteses externos)
  // — Tailwind v4 modern syntax: `hsl(H S% L% / opacity)`.
  const hslFormatted = colorFormatter(shadowColor, 'hsl')
  const hslChunk = hslFormatted.replace(/^hsl\(/, '').replace(/\)$/, '')

  const offsetX = common['shadow-offset-x']
  const offsetY = common['shadow-offset-y']
  const blur = common['shadow-blur']
  const spread = common['shadow-spread']
  const opacity = parseFloat(common['shadow-opacity'])

  const color = (opacityMultiplier: number): string =>
    `hsl(${hslChunk} / ${formatNumber(opacity * opacityMultiplier)})`

  // Layer 2: usa mesmo offsetX da layer 1, fixedOffsetY/fixedBlur escalonados
  // por nível. spread2 = layer1.spread − 1px (mesmo pattern TweakCN).
  const secondLayer = (fixedOffsetY: string, fixedBlur: string): string => {
    const spread2 = (parseFloat(spread?.replace('px', '') ?? '0') - 1).toString() + 'px'
    return `${offsetX} ${fixedOffsetY} ${fixedBlur} ${spread2} ${color(1.0)}`
  }

  return {
    // Single-layer: opacity multipliers 0.5 / 0.5 / 2.5
    'shadow-2xs': `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`,
    'shadow-xs': `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`,
    'shadow-2xl': `${offsetX} ${offsetY} ${blur} ${spread} ${color(2.5)}`,
    // Dual-layer: base + second layer com fixedOffsetY/fixedBlur escalonados
    'shadow-sm': `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('1px', '2px')}`,
    shadow: `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('1px', '2px')}`,
    'shadow-md': `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('2px', '4px')}`,
    'shadow-lg': `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('4px', '6px')}`,
    'shadow-xl': `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('8px', '10px')}`,
  }
}
