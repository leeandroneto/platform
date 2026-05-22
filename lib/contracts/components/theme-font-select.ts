// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/theme-font-select.tsx.
// SSOT Zod schema pra ThemeFontSelect props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

export const ThemeFontSelectPropsSchema = z.object({
  /** Map of font name → CSS font-family value. */
  fonts: z.record(z.string(), z.string()),
  /** Default CSS font-family value when no currentFont matches. */
  defaultValue: z.string(),
  /** Currently selected font name (null = no selection). */
  currentFont: z.string().nullable(),
  /** Called when the user picks a new font (CSS font-family value). */
  onFontChange: z.custom<(font: string) => void>((v) => typeof v === 'function'),
})

export type ThemeFontSelectProps = z.infer<typeof ThemeFontSelectPropsSchema>
