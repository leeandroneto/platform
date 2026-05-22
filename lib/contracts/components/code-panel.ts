// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/code-panel.tsx.
// SSOT Zod schema pra CodePanel props (§15.1 B component-creation-governance —
// props públicos têm Zod schema em lib/contracts/components/, não TS interface
// inline). See NOTICE.md.

import { z } from 'zod'

export const CodePanelPropsSchema = z.object({
  /** Quando passado, substitui o stub de registry URL no header. */
  themeId: z.string().optional(),
})

export type CodePanelProps = z.infer<typeof CodePanelPropsSchema>
