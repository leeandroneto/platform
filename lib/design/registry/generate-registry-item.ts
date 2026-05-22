// adapted from tweakcn-ref/utils/registry/{themes,v0}.ts (Apache-2.0).
// See NOTICE.md.
//
// `generateRegistryItem(args) → RegistryItemPayload`
//
// Gera payload `registry-item.json` shadcn-compatible pra um theme de tenant.
// Consumido por:
//   - `app/api/r/themes/[tenantId]/[version]/route.ts` (Fase 7)
//   - `components/admin/theme-studio/code-panel.tsx` export tab (Fase 5)
//
// Tipo `registry:style` (não `registry:theme`) — idêntico ao TweakCN.
// Diferença: `registry:style` aplica `@layer base` block + cssVars completo;
// `registry:theme` aplica só cssVars sem o layer block. TweakCN usa :style
// pra compatibilidade máxima com `shadcn add <URL>`.
//
// Shadows: derivados via `generateShadowLevels()` — 6 primitivas → 8 níveis.
// Cores: emitidas como OKLCH literal (ecosystem suporta OKLCH; sem conversão
// runtime desnecessária). `colorFormatter` disponível se caller quiser HEX.
//
// Alinhamento 2026-05-21: schema flat { light, dark } — não precisa mais
// "achatar common". Payload `cssVars.light` e `cssVars.dark` vêm direto do
// snapshot. `cssVars.theme` ainda emite as 3 fontes + radius pra shadcn
// registry compat (padrão TweakCN — vê tweakcn-ref/utils/registry/themes.ts).
//
// tracking-normal: renomeado de `letter-spacing` (alinha shadcn registry vocab).
// spacing: só vai em `light` (não em `dark`) — mesmo pattern TweakCN.

import 'server-only'

import type { Theme } from '@/lib/design/contract/theme'
import { generateShadowLevels } from '@/lib/design/shadows'

// ─── Tipos públicos ──────────────────────────────────────────────────────────

/** `registry:style` (não `:theme`) — research-41 bloqueador 4. */
export type RegistryItemType = 'registry:style'

export interface RegistryItemPayload {
  $schema: 'https://ui.shadcn.com/schema/registry-item.json'
  name: string
  type: RegistryItemType
  title: string
  description?: string
  /** CSS block adicional injetado por `shadcn add` em `globals.css`. */
  css: {
    '@layer base': {
      body: { 'letter-spacing': string }
    }
  }
  cssVars: {
    /** @theme vars: fonts + radius + tracking scale derivado. */
    theme: {
      'font-sans': string
      'font-serif': string
      'font-mono': string
      radius: string
      'tracking-tighter': string
      'tracking-tight': string
      'tracking-wide': string
      'tracking-wider': string
      'tracking-widest': string
    }
    /** :root vars — cores light + shadows expandidos + tracking-normal + spacing. */
    light: Record<string, string>
    /** .dark vars — cores dark + shadows expandidos. */
    dark: Record<string, string>
  }
}

// ─── Entry point ─────────────────────────────────────────────────────────────

/**
 * Gera um `RegistryItemPayload` shadcn-compatible a partir de um snapshot
 * `tenant_theme_versions.snapshot` validado pelo Zod `ThemeSchema`.
 *
 * @example
 * ```ts
 * const payload = generateRegistryItem({
 *   name: 'desafit-tenant-acme-v3',
 *   title: 'Acme Fitness Theme',
 *   snapshot: tenantThemeVersion.snapshot,
 * })
 * return Response.json(payload)
 * ```
 */
export function generateRegistryItem(args: {
  /** Nome machine-readable (kebab-case). Ex: "desafit-tenant-acme-v3". */
  name: string
  /** Título human-readable. Ex: "Acme Fitness Theme". */
  title: string
  description?: string
  /** Snapshot `Theme` Zod-validado de `tenant_theme_versions.snapshot`. */
  snapshot: Theme
}): RegistryItemPayload {
  const { name, title, description, snapshot } = args

  // Schema flat: light e dark já têm 45 keys cada — sem achatamento necessário.
  // Derivar 8 níveis de shadow para cada modo (shadow-color é per-mode).
  const lightShadows = generateShadowLevels(snapshot.light['shadow-color'], snapshot.light)
  const darkShadows = generateShadowLevels(snapshot.dark['shadow-color'], snapshot.dark)

  // tracking-normal = letter-spacing (renaming alinha shadcn registry vocab).
  // Usa light como fonte canonical (COMMON_STYLES — mesmo valor em dark).
  const trackingNormal = snapshot.light['letter-spacing'] ?? '0em'
  const spacing = snapshot.light.spacing ?? '0.25rem'

  return {
    $schema: 'https://ui.shadcn.com/schema/registry-item.json',
    name,
    type: 'registry:style',
    title,
    ...(description ? { description } : {}),
    css: {
      '@layer base': {
        body: { 'letter-spacing': 'var(--tracking-normal)' },
      },
    },
    cssVars: {
      // cssVars.theme: fontes + radius + tracking scale derivado.
      // Usa light como fonte canonical pra keys "shared" (COMMON_STYLES).
      theme: {
        'font-sans': snapshot.light['font-sans'],
        'font-serif': snapshot.light['font-serif'],
        'font-mono': snapshot.light['font-mono'],
        radius: snapshot.light.radius,
        // tracking scale derivado de tracking-normal (shadcn registry pattern)
        'tracking-tighter': 'calc(var(--tracking-normal) - 0.05em)',
        'tracking-tight': 'calc(var(--tracking-normal) - 0.025em)',
        'tracking-wide': 'calc(var(--tracking-normal) + 0.025em)',
        'tracking-wider': 'calc(var(--tracking-normal) + 0.05em)',
        'tracking-widest': 'calc(var(--tracking-normal) + 0.1em)',
      },
      light: {
        ...(snapshot.light as Record<string, string>),
        ...lightShadows,
        'tracking-normal': trackingNormal,
        spacing,
      },
      dark: (() => {
        // tracking-normal e spacing NÃO vão em dark (pattern TweakCN).
        // Com schema flat, dark contém spacing + letter-spacing — removemos
        // explicitamente pra manter compat com shadcn registry
        // (só cssVars.light carrega spacing + tracking-normal).
        const { spacing: _spacing, 'letter-spacing': _letterSpacing, ...darkRest } = snapshot.dark
        void _spacing
        void _letterSpacing
        return { ...darkRest, ...darkShadows }
      })(),
    },
  }
}
