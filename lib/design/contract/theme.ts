// Adapted from tweakcn-ref/types/theme.ts (Apache-2.0). See NOTICE.md.
//
// Schema canonical TweakCN-vocab. Validado contra `tweakcn-ref/types/theme.ts`
// (commit `9adabcf9`, branch `main`).
//
// **45 keys flat** — mesmo formato TweakCN upstream:
//   - 32 cores per-mode
//   - shadow-color (per-mode)
//   - 11 keys antes "common" — agora duplicadas em light + dark (TweakCN-way)
//     (3 fontes + radius + 5 shadow primitives + letter-spacing + spacing-opt)
//
// Alinhamento 2026-05-21: eliminado `ThemeCommonSchema` separado. Schema flat
// puro `{ light: {45 keys}, dark: {45 keys} }` — proteção contra "esquecer
// de manter light/dark sync" é responsabilidade da UI (1 picker só pra
// fonte/radius), não do schema. TweakCN tem milhares de usuários sem reportar
// essa bug class. `COMMON_STYLES` array em `tweakcn-ref/config/theme.ts`
// documenta quais keys a UI trata como compartilhadas.
//
// `ThemePartialSchema` é variante pro builder UI (Fase 5+) — todos campos
// opcionais durante edição incremental.

import { z } from 'zod'

// ─── ThemeStylePropsSchema: 45 keys flat per-mode ───────────────────────────
//
// Mantemos `.describe()` nas chaves que TweakCN documenta upstream
// (~20 keys — copiado literal de tweakcn-ref/types/theme.ts).
export const ThemeStylePropsSchema = z.object({
  // ── 32 cores ──────────────────────────────────────────────────────────────
  background: z.string().describe('The default background color, paired with `foreground`.'),
  foreground: z.string().describe('Paired with `background`.'),
  card: z.string().describe('The background color for cards, paired with `card-foreground`.'),
  'card-foreground': z.string().describe('Paired with `card`.'),
  popover: z
    .string()
    .describe('The background color for popovers, paired with `popover-foreground`.'),
  'popover-foreground': z.string().describe('Paired with `popover`.'),
  primary: z.string().describe('The main color, paired with `primary-foreground`.'),
  'primary-foreground': z.string().describe('Paired with `primary`.'),
  secondary: z.string().describe('A secondary color, paired with `secondary-foreground`.'),
  'secondary-foreground': z.string().describe('Paired with `secondary`.'),
  muted: z.string().describe('A muted background color, paired with `muted-foreground`.'),
  'muted-foreground': z.string().describe('Paired with `muted`.'),
  accent: z
    .string()
    .describe('Subtle color for hover or highlight, paired with `accent-foreground`.'),
  'accent-foreground': z.string().describe('Paired with `accent`.'),
  destructive: z
    .string()
    .describe('Color for destructive actions, paired with `destructive-foreground`.'),
  'destructive-foreground': z.string().describe('Paired with `destructive`.'),
  border: z.string().describe('The color for borders.'),
  input: z.string().describe('The background color for input fields.'),
  ring: z.string().describe('The color for focus rings.'),
  'chart-1': z.string(),
  'chart-2': z.string(),
  'chart-3': z.string(),
  'chart-4': z.string(),
  'chart-5': z.string(),
  sidebar: z
    .string()
    .describe('The background color for the sidebar, paired with `sidebar-foreground`.'),
  'sidebar-foreground': z.string().describe('Paired with `sidebar`.'),
  'sidebar-primary': z
    .string()
    .describe('The primary color for sidebar elements, paired with `sidebar-primary-foreground`.'),
  'sidebar-primary-foreground': z.string().describe('Paired with `sidebar-primary`.'),
  'sidebar-accent': z
    .string()
    .describe('An accent color for the sidebar, paired with `sidebar-accent-foreground`.'),
  'sidebar-accent-foreground': z.string().describe('Paired with `sidebar-accent`.'),
  'sidebar-border': z.string().describe('The color for borders within the sidebar.'),
  'sidebar-ring': z.string().describe('The color for focus rings within the sidebar.'),

  // ── shadow-color (per-mode — sombras mudam tonalidade entre light e dark) ─
  'shadow-color': z.string().describe('Shadow base color. Varies per light/dark mode.'),

  // ── 11 keys antes "common" — duplicadas em light + dark (TweakCN-way) ────
  // UI trata como shared via COMMON_STYLES array (tweakcn-ref/config/theme.ts:5-17).
  // Proteção de sync = responsabilidade da UI (1 picker só), não do schema.
  'font-sans': z
    .string()
    .describe(
      'Primary UI font. May be serif, sans, monospace, or display depending on the theme vibe.',
    ),
  'font-serif': z.string().describe('The preferred serif font family.'),
  'font-mono': z.string().describe('The preferred monospace font family. Used for code blocks.'),
  radius: z
    .string()
    .describe('The global border-radius for components. Use 0rem for sharp corners.'),
  'shadow-opacity': z.string(),
  'shadow-blur': z.string(),
  'shadow-spread': z.string(),
  'shadow-offset-x': z.string(),
  'shadow-offset-y': z.string(),
  'letter-spacing': z.string().describe('The global letter spacing for text.'),
  spacing: z.string().optional(),
})
export type ThemeStyleProps = z.infer<typeof ThemeStylePropsSchema>

// ─── ThemeSchema: root `{ light, dark }` flat — TweakCN upstream ────────────
export const ThemeSchema = z.object({
  light: ThemeStylePropsSchema,
  dark: ThemeStylePropsSchema,
})
export type Theme = z.infer<typeof ThemeSchema>

// ─── ThemePartialSchema: builder UI overrides incrementais ──────────────────
//
// Espelha TweakCN `ThemePreset.styles` (`Partial<ThemeStyleProps>`) — útil
// durante edição: profissional toca em 2 cores via picker, salva como diff.
export const ThemePartialSchema = z
  .object({
    light: ThemeStylePropsSchema.partial(),
    dark: ThemeStylePropsSchema.partial(),
  })
  .partial()
export type ThemePartial = z.infer<typeof ThemePartialSchema>
