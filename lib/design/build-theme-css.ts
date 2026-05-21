// Adapted shadow algorithm from tweakcn-ref/utils/shadows.ts (Apache-2.0).
// See NOTICE.md.
//
// Função pura `buildThemeCSS(theme) → string` que monta CSS pronto pra
// `<style precedence="theme">` (React 19 auto-hoist pro <head>).
//
// Fluxo:
//   1. Para cada modo (light, dark): merge `theme.common` + `theme[mode]`
//      e emite cada par `--key: value;`
//   2. Deriva 8 níveis de shadow algoritmicamente via `generateShadowLevels()`
//      (replicado de tweakcn-ref/utils/shadows.ts:6-65). Per-mode pois
//      `shadow-color` varia.
//   3. Wrap em `@layer base { :root { ... } .dark { ... } }`
//
// Per-tenant: Fase 4 injeta `tenant_theme_versions.snapshot` Zod-validado
// aqui. Fase 1: layout.tsx chama com DEFAULT_THEME (foundation reset).

import 'server-only'

import { colorFormatter, formatNumber } from './color-format'
import type { Theme, ThemeColors, ThemeCommon } from './contract/theme'

// ─── Shadow algorithm (replicado tweakcn-ref/utils/shadows.ts) ──────────────
//
// 8 níveis derivados de 6 primitives (`shadow-color`, `shadow-opacity`,
// `shadow-blur`, `shadow-spread`, `shadow-offset-x`, `shadow-offset-y`):
//   - shadow-2xs / shadow-xs / shadow-2xl: single layer, opacity multipliers
//     0.5 / 0.5 / 2.5
//   - shadow-sm / shadow / shadow-md / shadow-lg / shadow-xl: dual layer,
//     base + second layer com fixedOffsetY/fixedBlur escalonados
function generateShadowLevels(shadowColor: string, common: ThemeCommon): Record<string, string> {
  // Converte qualquer formato source de `--shadow-color` pra HSL chunk
  // (Tailwind v4 modern syntax) — usado em `hsl(... / opacity)` composto.
  // Strip prefix "hsl(" e suffix ")" pra obter "H S% L%".
  const hslFormatted = colorFormatter(shadowColor, 'hsl')
  const hslChunk = hslFormatted.replace(/^hsl\(/, '').replace(/\)$/, '')

  const offsetX = common['shadow-offset-x']
  const offsetY = common['shadow-offset-y']
  const blur = common['shadow-blur']
  const spread = common['shadow-spread']
  const opacity = parseFloat(common['shadow-opacity'])

  const color = (opacityMultiplier: number): string =>
    `hsl(${hslChunk} / ${formatNumber(opacity * opacityMultiplier)})`

  // Layer 2: usa mesmo offsetX da layer 1, fixedOffsetY/fixedBlur
  // específicos por nível, spread = layer1.spread - 1px.
  const secondLayer = (fixedOffsetY: string, fixedBlur: string): string => {
    const offsetX2 = offsetX
    const offsetY2 = fixedOffsetY
    const blur2 = fixedBlur
    const spread2 = (parseFloat(spread?.replace('px', '') ?? '0') - 1).toString() + 'px'
    const color2 = color(1.0)
    return `${offsetX2} ${offsetY2} ${blur2} ${spread2} ${color2}`
  }

  return {
    'shadow-2xs': `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`,
    'shadow-xs': `${offsetX} ${offsetY} ${blur} ${spread} ${color(0.5)}`,
    'shadow-sm': `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('1px', '2px')}`,
    // alias `shadow` (sem suffix) — alinha com Tailwind utility `shadow`
    shadow: `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('1px', '2px')}`,
    'shadow-md': `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('2px', '4px')}`,
    'shadow-lg': `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('4px', '6px')}`,
    'shadow-xl': `${offsetX} ${offsetY} ${blur} ${spread} ${color(1.0)}, ${secondLayer('8px', '10px')}`,
    'shadow-2xl': `${offsetX} ${offsetY} ${blur} ${spread} ${color(2.5)}`,
  }
}

// ─── Emit CSS lines `--key: value;` ─────────────────────────────────────────
function emitVars(entries: Record<string, string | undefined>, indent: string): string {
  return Object.entries(entries)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${indent}--${key}: ${value};`)
    .join('\n')
}

// ─── buildThemeCSS: entry point ─────────────────────────────────────────────
export function buildThemeCSS(theme: Theme): string {
  // Common vars vivem fora dos seletores :root/.dark? Decisão: emitir em
  // ambos (light em :root, repete em .dark) pra evitar specificity surprises
  // e bater 1:1 com modelo TweakCN (cada modo declara TODAS as 45 keys flat).
  const lightShadows = generateShadowLevels(theme.light['shadow-color'], theme.common)
  const darkShadows = generateShadowLevels(theme.dark['shadow-color'], theme.common)

  // Merge per-mode: cores + common (common é igual em light e dark)
  const lightAll: Record<string, string | undefined> = {
    ...(theme.light as Record<string, string>),
    ...(theme.common as Record<string, string | undefined>),
  }
  const darkAll: Record<string, string | undefined> = {
    ...(theme.dark as Record<string, string>),
    ...(theme.common as Record<string, string | undefined>),
  }

  const lightVarsCss = emitVars(lightAll, '    ')
  const darkVarsCss = emitVars(darkAll, '    ')
  const lightShadowsCss = emitVars(lightShadows, '    ')
  const darkShadowsCss = emitVars(darkShadows, '    ')

  return `@layer base {
  :root {
${lightVarsCss}
${lightShadowsCss}
  }
  .dark {
${darkVarsCss}
${darkShadowsCss}
  }
}`
}

// Re-export tipo principal pra callers usarem `import type { Theme }`
// direto de `@/lib/design/build-theme-css` se preferirem co-locar.
export type { Theme } from './contract/theme'

// Export interno pra testes JIT (Fase 5+ pode testar shadow algorithm
// isolado contra fixtures TweakCN).
export { generateShadowLevels as __test_generateShadowLevels }

// Helper exported only for the colors+common types (avoids unused import lint
// noise if a downstream module wants both).
export type { ThemeColors, ThemeCommon }
