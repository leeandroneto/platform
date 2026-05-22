// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/color-picker.tsx.
// SSOT Zod schema pra ColorPicker props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

/**
 * Identifier que mapeia este color picker a uma chave do theme style.
 * Quando provido, habilita focus programático via `focusColorControl()`.
 * Espelha as 32 chaves de cor canônicas do `ThemeStyleProps` (TweakCN-vocab).
 */
export const FocusColorIdSchema = z.enum([
  'background',
  'foreground',
  'card',
  'card-foreground',
  'popover',
  'popover-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'accent',
  'accent-foreground',
  'muted',
  'muted-foreground',
  'destructive',
  'destructive-foreground',
  'border',
  'input',
  'ring',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'sidebar',
  'sidebar-foreground',
  'sidebar-primary',
  'sidebar-primary-foreground',
  'sidebar-accent',
  'sidebar-accent-foreground',
  'sidebar-border',
  'sidebar-ring',
])
export type FocusColorId = z.infer<typeof FocusColorIdSchema>

export const ColorPickerPropsSchema = z.object({
  /** The current color value. */
  color: z.string(),
  /** Callback invoked whenever the color value changes. */
  onChange: z.custom<(color: string) => void>((v) => typeof v === 'function'),
  /** Human-readable label for the control. */
  label: z.string(),
  /** Identifier mapping this picker to a theme style key (enables focus). */
  name: FocusColorIdSchema.optional(),
})

export type ColorPickerProps = z.infer<typeof ColorPickerPropsSchema>
