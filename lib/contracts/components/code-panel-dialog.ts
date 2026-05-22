// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/code-panel-dialog.tsx.
// SSOT Zod schema pra CodePanelDialog props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

export const CodePanelDialogPropsSchema = z.object({
  /** Whether the dialog is open. */
  open: z.boolean(),
  /** Called when the dialog open state should change. */
  onOpenChange: z.custom<(open: boolean) => void>((v) => typeof v === 'function'),
  /** Opcional — quando passado, habilita registry command real no CodePanel. */
  themeId: z.string().optional(),
})

export type CodePanelDialogProps = z.infer<typeof CodePanelDialogPropsSchema>
