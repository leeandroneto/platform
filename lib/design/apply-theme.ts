// RESEARCH: tweakcn (Apache-2.0) — copied from utils/apply-theme.ts
// See NOTICE.md.
//
// ADAPT: TweakCN aplicava CSS vars via document.documentElement.style.setProperty (DOM mutation).
// Nosso projeto multi-tenant usa <style precedence="theme"> hoisted React 19 em
// app/admin/theme-studio/view.tsx (Chunk 5 §4.7). Esta função fica disponível como
// fallback dev/inspector ou pra aplicar tema temporário sem persist.

import { applyStyleToElement } from '@/lib/design/apply-style'
import { colorFormatter } from '@/lib/design/color-format'
import type { ThemeStyleProps } from '@/lib/design/contract/theme'
import { generateShadowLevels } from '@/lib/design/shadows'
import { COMMON_STYLES } from '@/lib/design/theme-defaults'

type Theme = 'dark' | 'light'

// ThemeStyles shape: { light: ThemeStyleProps, dark: ThemeStyleProps }
type ThemeStyles = { light: ThemeStyleProps; dark: ThemeStyleProps }
// ThemeEditorState shape used by TweakCN: { currentMode, styles }
type ThemeEditorState = { currentMode: Theme; styles: ThemeStyles }

const COMMON_NON_COLOR_KEYS = COMMON_STYLES

// Helper functions (not exported, used internally by applyThemeToElement)
const updateThemeClass = (root: HTMLElement, mode: Theme) => {
  if (mode === 'light') {
    root.classList.remove('dark')
  } else {
    root.classList.add('dark')
  }
}

const applyCommonStyles = (root: HTMLElement, themeStyles: ThemeStyleProps) => {
  Object.entries(themeStyles)
    .filter(([key]) =>
      COMMON_NON_COLOR_KEYS.includes(key as (typeof COMMON_NON_COLOR_KEYS)[number]),
    )
    .forEach(([key, value]) => {
      if (typeof value === 'string') {
        applyStyleToElement(root, key, value)
      }
    })
}

const applyThemeColors = (root: HTMLElement, themeStyles: ThemeStyles, mode: Theme) => {
  Object.entries(themeStyles[mode]).forEach(([key, value]) => {
    if (
      typeof value === 'string' &&
      !COMMON_NON_COLOR_KEYS.includes(key as (typeof COMMON_NON_COLOR_KEYS)[number])
    ) {
      const hslValue = colorFormatter(value, 'hsl')
      applyStyleToElement(root, key, hslValue)
    }
  })
}

const applyThemeShadows = (root: HTMLElement, themeState: ThemeEditorState) => {
  const { currentMode: mode, styles } = themeState
  const shadowColor = styles[mode]['shadow-color']
  const shadowMap = generateShadowLevels(shadowColor, styles[mode])
  Object.entries(shadowMap).forEach(([key, value]) => {
    applyStyleToElement(root, key, value)
  })
}

// Exported function to apply theme styles to an element
export const applyThemeToElement = (themeState: ThemeEditorState, rootElement: HTMLElement) => {
  const { currentMode: mode, styles: themeStyles } = themeState

  if (!rootElement) return

  updateThemeClass(rootElement, mode)
  // Apply common styles (like border-radius) based on the 'light' mode definition
  applyCommonStyles(rootElement, themeStyles.light)
  // Apply mode-specific colors
  applyThemeColors(rootElement, themeStyles, mode)
  // Apply shadow variables
  applyThemeShadows(rootElement, themeState)
}
