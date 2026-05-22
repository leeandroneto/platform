// RESEARCH: tweakcn (Apache-2.0) — props schema extracted from components/admin/theme-studio/control-panel.tsx.
// SSOT Zod schema pra ControlPanel props (§15.1 B). See NOTICE.md.

import { z } from 'zod'

export const ControlPanelPropsSchema = z.object({
  /** Enable AI tab (deferred Fase 6). Default false. */
  aiEnabled: z.boolean().optional(),
})

export type ControlPanelProps = z.infer<typeof ControlPanelPropsSchema>
