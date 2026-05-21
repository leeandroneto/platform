// Adapted from tweakcn-ref/types/theme.ts (Apache-2.0). See NOTICE.md.
//
// Schema canonical TweakCN-vocab. Validado contra `tweakcn-ref/types/theme.ts`
// (commit `9adabcf9`, branch `main`).
//
// **45 keys total** distribuídas em 3 sub-schemas:
//   - ThemeColorsSchema (33 keys per-mode): 32 cores + `shadow-color` (varia light↔dark)
//   - ThemeCommonSchema (11 keys shared): 3 fontes + radius + 5 shadow primitives +
//     letter-spacing + spacing-opt
//   - ThemeSchema root: `{ light, dark, common }`
//
// Divergência intencional vs TweakCN upstream:
//   TweakCN tem schema flat puro (light + dark cada com 45 keys, inclusive
//   `font-sans`/`radius` que se assumem iguais por convenção runtime via
//   `COMMON_STYLES` array em config/theme.ts). Aqui promovemos `common` pra
//   schema separado — força invariante no nível de tipo (impossível "esquecer"
//   de manter shadow-blur idêntico em light↔dark). Custo: ~10 LOC; benefício:
//   bug class eliminada.
//
// `ThemePartialSchema` é variante pro builder UI (Fase 5+) — todos campos
// opcionais durante edição incremental.

import { z } from 'zod'

// ─── ThemeColorsSchema: 33 keys per-mode (32 cores + shadow-color) ──────────
//
// Mantemos `.describe()` em chaves que TweakCN documenta (~25 keys) — útil
// pra builder UI tooltip + introspection (z.infer + JSON Schema export).
export const ThemeColorsSchema = z.object({
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
  'sidebar-primary': z.string(),
  'sidebar-primary-foreground': z.string(),
  'sidebar-accent': z.string(),
  'sidebar-accent-foreground': z.string(),
  'sidebar-border': z.string().describe('The color for borders within the sidebar.'),
  'sidebar-ring': z.string().describe('The color for focus rings within the sidebar.'),
  // shadow-color per-mode (TweakCN tem em ambos light + dark) — sombras
  // mudam tonalidade entre modos. Não vive em ThemeCommonSchema.
  'shadow-color': z.string().describe('Shadow base color. Varies per light/dark mode.'),
})
export type ThemeColors = z.infer<typeof ThemeColorsSchema>

// ─── ThemeCommonSchema: 11 keys shared light↔dark ───────────────────────────
//
// TweakCN dedupa estas 11 keys via array `COMMON_STYLES` runtime em
// `config/theme.ts:5-17`. Nós promovemos pra schema separado (refinamento
// próprio multi-tenant) — invariante força nível de tipo.
export const ThemeCommonSchema = z.object({
  'font-sans': z.string(),
  'font-serif': z.string(),
  'font-mono': z.string(),
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
export type ThemeCommon = z.infer<typeof ThemeCommonSchema>

// ─── ThemeSchema: root `{ light, dark, common }` ────────────────────────────
export const ThemeSchema = z.object({
  light: ThemeColorsSchema,
  dark: ThemeColorsSchema,
  common: ThemeCommonSchema,
})
export type Theme = z.infer<typeof ThemeSchema>

// ─── ThemePartialSchema: builder UI overrides incrementais ──────────────────
//
// Espelha TweakCN `ThemePreset.styles` (`Partial<ThemeStyleProps>`) — útil
// durante edição: profissional toca em 2 cores via picker, salva como diff.
export const ThemePartialSchema = z
  .object({
    light: ThemeColorsSchema.partial(),
    dark: ThemeColorsSchema.partial(),
    common: ThemeCommonSchema.partial(),
  })
  .partial()
export type ThemePartial = z.infer<typeof ThemePartialSchema>
