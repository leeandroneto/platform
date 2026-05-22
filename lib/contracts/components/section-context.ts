// RESEARCH: tweakcn (Apache-2.0) — value-type schema extracted from components/admin/theme-studio/section-context.tsx.
// SSOT Zod schema pro valor exposto pelo SectionContext (§15.1 B).
// Nota: NÃO é Props schema — é o tipo do valor de React Context consumido
// por descendentes via `useContext(SectionContext)`. See NOTICE.md.

import { z } from 'zod'

export const SectionContextValueSchema = z.object({
  /** Whether the parent ControlSection is currently expanded. */
  isExpanded: z.boolean(),
  /** Set the expanded state explicitly. */
  setIsExpanded: z.custom<(expanded: boolean) => void>((v) => typeof v === 'function'),
  /** Helper to toggle the expanded state. */
  toggleExpanded: z.custom<() => void>((v) => typeof v === 'function'),
})

export type SectionContextValue = z.infer<typeof SectionContextValueSchema>
