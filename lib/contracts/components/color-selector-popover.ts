// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/color-selector-popover.tsx.
// SSOT Zod schema pra ColorSelectorPopover props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

export const ColorSelectorPopoverPropsSchema = z.object({
  /** Cor atual selecionada (HEX/OKLCH string). */
  currentColor: z.string(),
  /** Callback chamado quando o usuário seleciona uma cor da paleta Tailwind. */
  onChange: z.custom<(color: string) => void>((v) => typeof v === 'function'),
})

export type ColorSelectorPopoverProps = z.infer<typeof ColorSelectorPopoverPropsSchema>
