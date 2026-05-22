// Adapted from tweakcn-ref/config/theme.ts (Apache-2.0). See NOTICE.md.
//
// Defaults light + dark usados como theme inicial (Fase 1 SSR) e fallback
// caso tenant snapshot esteja indisponível.
//
// Valores copy-literal de `tweakcn-ref/config/theme.ts:28-120` (commit
// `9adabcf9`). NÃO ajustar arbitrário — esses são os neutros canonical
// shadcn/ui v4 (zinc-leaning). Override por tenant vem em Fase 4 via
// `tenant_theme_versions.snapshot`.
//
// Alinhamento 2026-05-21: eliminado DEFAULT_COMMON. Schema agora flat
// { light: {45 keys}, dark: {45 keys} } — 11 keys "shared" duplicadas
// em ambos os modos com mesmos valores (TweakCN-way).

import type { Theme, ThemeStyleProps } from './contract/theme'

// ─── Font stacks (TweakCN-vocab, ui-* stack defaults) ───────────────────────
const DEFAULT_FONT_SANS =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'"

const DEFAULT_FONT_SERIF = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'

const DEFAULT_FONT_MONO =
  'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

// ─── 11 keys shared (TweakCN COMMON_STYLES — duplicadas em light + dark) ────
// Valores idênticos nos dois modos; UI garante sync via 1 picker.
const SHARED_PROPS = {
  'font-sans': DEFAULT_FONT_SANS,
  'font-serif': DEFAULT_FONT_SERIF,
  'font-mono': DEFAULT_FONT_MONO,
  radius: '0.625rem',
  'shadow-opacity': '0.1',
  'shadow-blur': '3px',
  'shadow-spread': '0px',
  'shadow-offset-x': '0',
  'shadow-offset-y': '1px',
  'letter-spacing': '0em',
  spacing: '0.25rem',
} as const

// ─── 45 keys light (32 cores + shadow-color + 11 shared) ────────────────────
export const DEFAULT_LIGHT_COLORS: ThemeStyleProps = {
  background: 'oklch(1 0 0)',
  foreground: 'oklch(0.145 0 0)',
  card: 'oklch(1 0 0)',
  'card-foreground': 'oklch(0.145 0 0)',
  popover: 'oklch(1 0 0)',
  'popover-foreground': 'oklch(0.145 0 0)',
  primary: 'oklch(0.205 0 0)',
  'primary-foreground': 'oklch(0.985 0 0)',
  secondary: 'oklch(0.97 0 0)',
  'secondary-foreground': 'oklch(0.205 0 0)',
  muted: 'oklch(0.97 0 0)',
  'muted-foreground': 'oklch(0.556 0 0)',
  accent: 'oklch(0.97 0 0)',
  'accent-foreground': 'oklch(0.205 0 0)',
  destructive: 'oklch(0.577 0.245 27.325)',
  'destructive-foreground': 'oklch(1 0 0)',
  border: 'oklch(0.922 0 0)',
  input: 'oklch(0.922 0 0)',
  ring: 'oklch(0.708 0 0)',
  'chart-1': 'oklch(0.81 0.10 252)',
  'chart-2': 'oklch(0.62 0.19 260)',
  'chart-3': 'oklch(0.55 0.22 263)',
  'chart-4': 'oklch(0.49 0.22 264)',
  'chart-5': 'oklch(0.42 0.18 266)',
  sidebar: 'oklch(0.985 0 0)',
  'sidebar-foreground': 'oklch(0.145 0 0)',
  'sidebar-primary': 'oklch(0.205 0 0)',
  'sidebar-primary-foreground': 'oklch(0.985 0 0)',
  'sidebar-accent': 'oklch(0.97 0 0)',
  'sidebar-accent-foreground': 'oklch(0.205 0 0)',
  'sidebar-border': 'oklch(0.922 0 0)',
  'sidebar-ring': 'oklch(0.708 0 0)',
  'shadow-color': 'oklch(0 0 0)',
  ...SHARED_PROPS,
}

// ─── 45 keys dark (32 cores + shadow-color + 11 shared) ─────────────────────
export const DEFAULT_DARK_COLORS: ThemeStyleProps = {
  background: 'oklch(0.145 0 0)',
  foreground: 'oklch(0.985 0 0)',
  card: 'oklch(0.205 0 0)',
  'card-foreground': 'oklch(0.985 0 0)',
  popover: 'oklch(0.269 0 0)',
  'popover-foreground': 'oklch(0.985 0 0)',
  primary: 'oklch(0.922 0 0)',
  'primary-foreground': 'oklch(0.205 0 0)',
  secondary: 'oklch(0.269 0 0)',
  'secondary-foreground': 'oklch(0.985 0 0)',
  muted: 'oklch(0.269 0 0)',
  'muted-foreground': 'oklch(0.708 0 0)',
  accent: 'oklch(0.371 0 0)',
  'accent-foreground': 'oklch(0.985 0 0)',
  destructive: 'oklch(0.704 0.191 22.216)',
  'destructive-foreground': 'oklch(0.985 0 0)',
  border: 'oklch(0.275 0 0)',
  input: 'oklch(0.325 0 0)',
  ring: 'oklch(0.556 0 0)',
  'chart-1': 'oklch(0.81 0.10 252)',
  'chart-2': 'oklch(0.62 0.19 260)',
  'chart-3': 'oklch(0.55 0.22 263)',
  'chart-4': 'oklch(0.49 0.22 264)',
  'chart-5': 'oklch(0.42 0.18 266)',
  sidebar: 'oklch(0.205 0 0)',
  'sidebar-foreground': 'oklch(0.985 0 0)',
  'sidebar-primary': 'oklch(0.488 0.243 264.376)',
  'sidebar-primary-foreground': 'oklch(0.985 0 0)',
  'sidebar-accent': 'oklch(0.269 0 0)',
  'sidebar-accent-foreground': 'oklch(0.985 0 0)',
  'sidebar-border': 'oklch(0.275 0 0)',
  'sidebar-ring': 'oklch(0.439 0 0)',
  'shadow-color': 'oklch(0 0 0)',
  ...SHARED_PROPS,
}

// ─── Theme root ─────────────────────────────────────────────────────────────
export const DEFAULT_THEME: Theme = {
  light: DEFAULT_LIGHT_COLORS,
  dark: DEFAULT_DARK_COLORS,
}
