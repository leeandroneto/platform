// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/font-picker.tsx.
// SSOT Zod schema pra FontPicker props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

import type { FontInfo } from '@/lib/design/contract/fonts'
import type { FilterFontCategory } from '@/lib/hooks/use-font-search'

export const FontPickerPropsSchema = z.object({
  /** Selected font family string (CSS font-family value). */
  value: z.string().optional(),
  /** Limit results to a font category (sans-serif, serif, monospace, etc). */
  category: z.custom<FilterFontCategory>((v) => typeof v === 'string').optional(),
  /** Callback invoked when the user selects a font from the picker. */
  onSelect: z.custom<(font: FontInfo) => void>((v) => typeof v === 'function'),
  /** Placeholder shown in the trigger button when no font is selected. */
  placeholder: z.string().optional(),
  /** Extra className forwarded to the popover trigger button. */
  className: z.string().optional(),
})

export type FontPickerProps = z.infer<typeof FontPickerPropsSchema>
