// Função pura `buildThemeCSS(theme) → string` que monta CSS pronto pra
// `<style precedence="theme">` (React 19 auto-hoist pro <head>).
//
// Fluxo:
//   1. Para cada modo (light, dark): emite cada par `--key: value;` direto
//      do ThemeStyleProps flat (45 keys cada modo).
//   2. Deriva 8 níveis de shadow via `generateShadowLevels()` (lib/design/shadows.ts).
//      Per-mode pois `shadow-color` varia entre light e dark.
//   3. Wrap em `@layer base { :root { ... } .dark { ... } }`
//
// Alinhamento 2026-05-21: schema flat { light, dark } — eliminado merge com
// `theme.common`. Cada modo já contém as 45 keys completas (TweakCN-way).
// `theme.light` é a fonte canonical pras keys "shared" (font-*, radius,
// shadow primitives, letter-spacing, spacing) no bloco :root — idêntico ao
// que TweakCN faz (light keys pro :root, dark keys pro .dark).
//
// Per-tenant: Fase 4 injeta `tenant_theme_versions.snapshot` Zod-validado
// aqui. Fase 1: layout.tsx chama com DEFAULT_THEME (foundation reset).

import 'server-only'

import type { Theme } from './contract/theme'
import { generateShadowLevels } from './shadows'

// ─── Emit CSS lines `--key: value;` ─────────────────────────────────────────
function emitVars(entries: Record<string, string | undefined>, indent: string): string {
  return Object.entries(entries)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${indent}--${key}: ${value};`)
    .join('\n')
}

// ─── buildThemeCSS: entry point ─────────────────────────────────────────────
export function buildThemeCSS(theme: Theme): string {
  // Schema flat: cada modo já tem 45 keys completas (cores + shadow-color +
  // font-* + radius + shadow primitives + letter-spacing + spacing).
  // Derivar 8 níveis de shadow para cada modo (shadow-color é per-mode).
  const lightShadows = generateShadowLevels(theme.light['shadow-color'], theme.light)
  const darkShadows = generateShadowLevels(theme.dark['shadow-color'], theme.dark)

  const lightVarsCss = emitVars(theme.light as Record<string, string | undefined>, '    ')
  const darkVarsCss = emitVars(theme.dark as Record<string, string | undefined>, '    ')
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

// Re-exports pra callers que importam tipos direto daqui.
export type { Theme, ThemeStyleProps } from './contract/theme'

// Export interno pra testes JIT (Fase 5+ pode testar shadow algorithm
// isolado contra fixtures TweakCN).
export { generateShadowLevels as __test_generateShadowLevels }
