// RESEARCH: tweakcn (Apache-2.0) — copied from utils/theme-styles.ts
// See NOTICE.md.
//
// ADAPT: import paths → @/lib/design/contract/theme + @/lib/design/theme-defaults.
// defaultThemeState.styles → DEFAULT_THEME (our equiv).

import type { ThemeStyleProps } from '@/lib/design/contract/theme'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

type ThemeStyles = { light: ThemeStyleProps; dark: ThemeStyleProps }

export function mergeThemeStylesWithDefaults(themeStyles: ThemeStyles): ThemeStyles {
  const mergedStyles = {
    ...DEFAULT_THEME,
    light: { ...DEFAULT_THEME.light, ...themeStyles.light },
    dark: { ...DEFAULT_THEME.dark, ...themeStyles.dark },
  }
  return mergedStyles
}
