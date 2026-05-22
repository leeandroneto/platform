// RESEARCH: tweakcn (Apache-2.0) — copied from utils/theme-presets.ts
// See NOTICE.md.
// ADAPT: split into 8 chunk files to satisfy max-lines ESLint rule (600).
// This index merges all chunks into the canonical `defaultPresets` export.

import type { ThemePreset } from '@/lib/design/contract/theme'

import { presetsChunkA } from './theme-presets-a'
import { presetsChunkB } from './theme-presets-b'
import { presetsChunkC } from './theme-presets-c'
import { presetsChunkD } from './theme-presets-d'
import { presetsChunkE } from './theme-presets-e'
import { presetsChunkF } from './theme-presets-f'
import { presetsChunkG } from './theme-presets-g'
import { presetsChunkH } from './theme-presets-h'

export const defaultPresets: Record<string, ThemePreset> = {
  ...presetsChunkA,
  ...presetsChunkB,
  ...presetsChunkC,
  ...presetsChunkD,
  ...presetsChunkE,
  ...presetsChunkF,
  ...presetsChunkG,
  ...presetsChunkH,
}
