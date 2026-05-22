// RESEARCH: tweakcn (Apache-2.0) — adapted from utils/theme-preset-helper.ts
// See NOTICE.md.
// ADAPT: removed `useThemePresetStore` Zustand dependency.
//   - `getBuiltInThemeStyles()` copy literal (already server-safe).
//   - `getPresetThemeStyles()` rewritten to accept `savedPresets` as argument
//     (pure function, no Zustand store access). Callers pass saved presets
//     from RHF form state or DB query result.

import type { Theme, ThemePreset, ThemeStyleProps } from '@/lib/design/contract/theme'
import { defaultPresets } from '@/lib/design/presets/theme-presets'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

function mergePresetWithDefaults(presetStyles: {
  light?: Partial<ThemeStyleProps>
  dark?: Partial<ThemeStyleProps>
}): Theme {
  return {
    light: {
      ...DEFAULT_THEME.light,
      ...(presetStyles.light || {}),
    },
    dark: {
      ...DEFAULT_THEME.dark,
      ...(presetStyles.light || {}),
      ...(presetStyles.dark || {}),
    },
  }
}

/**
 * Get built-in theme styles by name (without using store).
 * Use this for server-side code where store access is not available.
 * Returns null if the preset doesn't exist.
 */
export function getBuiltInThemeStyles(name: string): { name: string; styles: Theme } | null {
  const preset = defaultPresets[name]
  if (!preset) {
    return null
  }

  const styles = mergePresetWithDefaults(preset.styles)
  return {
    name: preset.label || name,
    styles,
  }
}

/**
 * Get merged preset theme styles by name.
 * ADAPT: accepts `savedPresets` as argument instead of reading from Zustand store.
 * Pass tenant-saved presets from DB query or RHF form state.
 */
export function getPresetThemeStyles(
  name: string,
  savedPresets: Record<string, ThemePreset> = {},
): Theme {
  if (name === 'default') {
    return DEFAULT_THEME
  }

  // Check built-in presets first
  const builtIn = defaultPresets[name]
  if (builtIn) {
    return mergePresetWithDefaults(builtIn.styles)
  }

  // Fall back to saved presets (tenant-specific)
  const saved = savedPresets[name]
  if (!saved) {
    return DEFAULT_THEME
  }

  return mergePresetWithDefaults(saved.styles)
}
