// RESEARCH: tweakcn (Apache-2.0) — espelha conceitualmente
// `tweakcn-ref/utils/apply-theme.ts` (DOM mutation) mas server-safe e
// emitindo CSS string em vez de chamar `documentElement.style.setProperty`.
//
// Por que existir:
// ADR-0048 §2 — SSR emite `<style precedence="theme">` com os 32 tokens HSL
// (gerados via colorFormatter server-side) do snapshot resolvido por hostname
// (tenant ou DEFAULT). Cobre rotas externas (login, dashboard, landing) com
// ZERO JS pra tema. CSS funciona imediatamente, sem flash.
//
// Por que server-safe:
// - Zero deps de client (sem React, sem DOM)
// - Output é string CSS pura, embed em `<style dangerouslySetInnerHTML>`
// - Anônimo SSR: snapshot=DEFAULT_THEME → CSS dos defaults
// - Tenant logged-in SSR: snapshot=tenant_theme_versions.snapshot → CSS do tenant
//
// O que NÃO faz:
// - Não toca `documentElement.style` (runtime client cobre via ThemeProvider
//   subscribe ao store)
// - Não carrega Google Fonts (DynamicFontLoader cobre dentro de /temas)
// - Não aplica classe `.dark` (ThemeProvider faz no useEffect; default light)
//
// Comparação:
//   tweakcn-ref/utils/apply-theme.ts        → DOM mutation (client)
//   lib/design/apply-theme.ts (existente)   → DOM mutation (client, igual upstream)
//   lib/design/build-theme-style.ts (NOVO)  → CSS string (server)

import { colorFormatter } from '@/lib/design/color-format'
import { type Theme, type ThemeStyleProps } from '@/lib/design/contract/theme'
import { generateShadowLevels } from '@/lib/design/shadows'
import { COMMON_STYLES } from '@/lib/design/theme-defaults'

const COMMON_NON_COLOR_KEYS = COMMON_STYLES

/**
 * Emite block `:root { --token: value; ... }` pra um modo do snapshot.
 *
 * - Common styles (font-*, radius, shadow primitives, etc) saem como-estao
 *   (string CSS válida — `0.625rem`, `0`, `'ui-sans-serif, ...'`).
 * - Cores são convertidas pra HSL via `colorFormatter(_, 'hsl', '4')` — wrapper
 *   completo `hsl(H S% L%)` espelha upstream apply-theme.ts.
 * - Shadows derivados via `generateShadowLevels` (8 níveis a partir das 6
 *   primitives + shadow-color).
 */
function emitTokens(styleProps: ThemeStyleProps): string {
  const decls: string[] = []

  for (const [key, value] of Object.entries(styleProps)) {
    if (typeof value !== 'string') continue
    const isCommon = COMMON_NON_COLOR_KEYS.includes(key as (typeof COMMON_NON_COLOR_KEYS)[number])
    if (isCommon) {
      decls.push(`  --${key}: ${value};`)
    } else {
      // 32 cores + shadow-color → converte pra HSL espelhando upstream.
      const hslValue = colorFormatter(value, 'hsl', '4')
      decls.push(`  --${key}: ${hslValue};`)
    }
  }

  // Shadow primitives derivados (8 níveis).
  const shadowColor = styleProps['shadow-color']
  if (shadowColor) {
    const shadowMap = generateShadowLevels(shadowColor, styleProps)
    for (const [key, value] of Object.entries(shadowMap)) {
      decls.push(`  --${key}: ${value};`)
    }
  }

  return decls.join('\n')
}

/**
 * Gera CSS string com:
 *   - `:root { ...32 tokens light HSL + shadow primitives derivados + commons }`
 *   - `.dark { ...32 tokens dark HSL + shadow primitives dark + commons }`
 *
 * Use no `<head>` do `app/layout.tsx`:
 * ```tsx
 * <style
 *   precedence="theme"
 *   dangerouslySetInnerHTML={{ __html: buildThemeStyleCSS(snapshot) }}
 * />
 * ```
 *
 * Specificity: `documentElement.style.setProperty(...)` (inline) sempre vence
 * `<style precedence="theme">` (sheet), garantindo que o editor sobreponha
 * em `/temas` enquanto o user edita.
 */
export function buildThemeStyleCSS(snapshot: Theme): string {
  const lightBlock = emitTokens(snapshot.light)
  const darkBlock = emitTokens(snapshot.dark)
  return `:root {\n${lightBlock}\n}\n.dark {\n${darkBlock}\n}\n`
}
