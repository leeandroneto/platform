// Função pura `buildThemeCSS(theme) → string` que monta CSS pronto pra
// `<style precedence="theme">` (React 19 auto-hoist pro <head>).
//
// Fluxo:
//   1. Para cada modo (light, dark): merge `theme.common` + `theme[mode]`
//      e emite cada par `--key: value;`
//   2. Deriva 8 níveis de shadow via `generateShadowLevels()` (lib/design/shadows.ts).
//      Per-mode pois `shadow-color` varia entre light e dark.
//   3. Wrap em `@layer base { :root { ... } .dark { ... } }`
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

// Re-exports pra callers que importam tipos direto daqui.
export type { Theme, ThemeColors, ThemeCommon } from './contract/theme'

// Export interno pra testes JIT (Fase 5+ pode testar shadow algorithm
// isolado contra fixtures TweakCN).
export { generateShadowLevels as __test_generateShadowLevels }
