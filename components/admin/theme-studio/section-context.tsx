// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/section-context.tsx
// See NOTICE.md.
//
// ADAPT: none — pure React context wrapper, no external dependencies.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-section-context",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "React context exposing ControlSection expand/collapse state to descendants",
 *   "examples": [],
 *   "when_to_use": ["descendants of theme-studio-control-section that need to query or toggle expanded state"],
 *   "anti_patterns": ["standalone use outside a ControlSection tree"],
 *   "related": ["theme-studio-control-section"],
 *   "vertical": null,
 *   "propsSchema": "lib/contracts/components/section-context.ts"
 * }
 */
import { createContext } from 'react'

// SSOT: lib/contracts/components/section-context.ts (Zod schema + z.infer).
// `SectionContextValue` é o tipo do valor exposto pelo React Context — tratado
// como interface pública porque descendentes consomem via useContext.
import type { SectionContextValue } from '@/lib/contracts/components/section-context'

/**
 * Context that allows descendants of a ControlSection to query or mutate
 * the expanded / collapsed state of their parent section.
 */
export const SectionContext = createContext<SectionContextValue | undefined>(undefined)
