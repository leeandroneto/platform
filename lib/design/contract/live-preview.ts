// RESEARCH: tweakcn (Apache-2.0) — copied from types/live-preview-embed.ts
// See NOTICE.md.
//
// ADAPT: Removed import of `ThemeEditorState` from `types/editor.ts`
// (Zustand-bound ThemeEditorState replaced by our `Theme` type).
// `ThemeUpdatePayload.themeState` typed as `Theme` (our canonical schema).
// MESSAGE constants kept identical (cross-origin postMessage protocol must match).
// `IframeStatus` union copied literal.

import type { Theme } from '@/lib/design/contract/theme'

// Keep in sync with public/live-preview-embed-script.js TWEAKCN_MESSAGE
export const MESSAGE = {
  PING: 'TWEAKCN_PING',
  PONG: 'TWEAKCN_PONG',
  CHECK_SHADCN: 'TWEAKCN_CHECK_SHADCN',
  SHADCN_STATUS: 'TWEAKCN_SHADCN_STATUS',
  THEME_UPDATE: 'TWEAKCN_THEME_UPDATE',
  THEME_APPLIED: 'TWEAKCN_THEME_APPLIED',
  EMBED_LOADED: 'TWEAKCN_EMBED_LOADED',
  EMBED_ERROR: 'TWEAKCN_EMBED_ERROR',
} as const

export type MessageType = (typeof MESSAGE)[keyof typeof MESSAGE]

export interface ShadcnStatusPayload {
  supported: boolean
}

export interface ThemeUpdatePayload {
  // ADAPT: TweakCN uses `ThemeEditorState` (Zustand store shape).
  // Our canonical type is `Theme` ({ light, dark } flat schema).
  themeState: Theme
}

export type EmbedMessage =
  | { type: typeof MESSAGE.PING }
  | { type: typeof MESSAGE.PONG }
  | { type: typeof MESSAGE.CHECK_SHADCN }
  | { type: typeof MESSAGE.SHADCN_STATUS; payload: ShadcnStatusPayload }
  | { type: typeof MESSAGE.THEME_UPDATE; payload: ThemeUpdatePayload }
  | { type: typeof MESSAGE.THEME_APPLIED }
  | { type: typeof MESSAGE.EMBED_LOADED }
  | { type: typeof MESSAGE.EMBED_ERROR; payload: { error: string } }

export type IframeStatus =
  | 'unknown'
  | 'checking'
  | 'connected'
  | 'supported'
  | 'unsupported'
  | 'missing'
  | 'error'
