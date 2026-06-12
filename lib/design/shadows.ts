// adapted from tweakcn-ref/utils/shadows.ts (Apache-2.0). See NOTICE.md.
//
// `generateShadowLevels(shadowColor, styleProps) → Record<string, string>`
//
// Deriva 8 níveis de shadow a partir de 6 primitivas:
//   shadow-color · shadow-opacity · shadow-blur · shadow-spread ·
//   shadow-offset-x · shadow-offset-y
//
// Algoritmo idêntico ao TweakCN `getShadowMap()`, adaptado para:
//   - Nossa assinatura `(shadowColor: string, styleProps: ShadowPrimitives)` —
//     sem dependência de `ThemeEditorState` / Zustand (server-side safe)
//   - `colorFormatter` importado de `./color-format` (nossa versão culori)
//   - `formatNumber` para precisão consistente na formatação opacity
//
// Alinhamento 2026-05-21: parâmetro `common: ThemeCommon` renomeado para
// `styleProps: ShadowPrimitives` — reflete que o schema agora é flat
// (não há mais ThemeCommon separado; shadow primitives vivem em ThemeStyleProps).
//
// Usado por:
//   - `lib/design/apply-theme.ts` — emite CSS vars per-tenant runtime via
//     applyThemeShadows + documentElement.style.setProperty
//   - `lib/design/registry/generate-registry-item.ts` — payload shadcn registry
//   - Fase 5 preview live (theme-studio builder)

import * as culori from 'culori'

import { colorFormatter, formatNumber } from './color-format'

/** Subconjunto de ThemeStyleProps necessário para derivar shadow levels. */
export interface ShadowPrimitives {
  'shadow-opacity': string
  'shadow-blur': string
  'shadow-spread': string
  'shadow-offset-x': string
  'shadow-offset-y': string
}

/**
 * Gera 8 níveis de shadow CSS a partir das 6 primitivas do ThemeStyleProps.
 *
 * @param shadowColor - Valor `--shadow-color` do modo (light ou dark). Qualquer
 *   formato culori-parseable (OKLCH, HEX, HSL, RGB).
 * @param styleProps - Objeto com as 5 shadow primitives (subset de ThemeStyleProps).
 * @returns Record com as 8 keys: shadow-2xs, shadow-xs, shadow-sm, shadow,
 *   shadow-md, shadow-lg, shadow-xl, shadow-2xl.
 */
export function generateShadowLevels(
  shadowColor: string,
  styleProps: ShadowPrimitives,
): Record<string, string> {
  // Espelha upstream tweakcn-ref/utils/shadows.ts:14 — tailwindVersion '3' emite
  // chunk raw "H S% L%" (sem wrapper) usado direto dentro de `hsl(${chunk} / ${alpha})`.
  // Mais robusto que o regex strip anterior que rodava em cima do output v4.
  const hslChunk = colorFormatter(shadowColor, 'hsl', '3')

  // PATCH-tb14-shadows: extrai alpha base do shadow-color (ex: hsl(... / 0.5)).
  // tailwindVersion '3' strip alpha intencionalmente (chunk pra inline no hsl()),
  // então parseamos separado via culori pra recuperar o canal alpha original.
  // Para presets sem alpha (ex: DEFAULT oklch(0 0 0)), parsed.alpha === undefined → base = 1.
  // Multiplicamos: finalOpacity = alphaBase * shadowOpacity * multiplier.
  // Paridade com intent do preset: Bubblegum shadow-color tem alpha 0.5 como "teto"
  // de opacidade — todos shadow-* derivados respeitam esse teto.
  const parsedShadowColor = culori.parse(shadowColor)
  const alphaBase =
    parsedShadowColor?.alpha !== undefined && parsedShadowColor.alpha < 1
      ? parsedShadowColor.alpha
      : 1

  const offsetX = styleProps['shadow-offset-x']
  const offsetY = styleProps['shadow-offset-y']
  const blur = styleProps['shadow-blur']
  const spread = styleProps['shadow-spread']
  const opacity = parseFloat(styleProps['shadow-opacity'])

  const color = (opacityMultiplier: number): string =>
    `hsl(${hslChunk} / ${formatNumber(alphaBase * opacity * opacityMultiplier)})`

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
