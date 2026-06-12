// RESEARCH: tweakcn (Apache-2.0) — adapted from hooks/use-theme-preset-from-url.ts
// See NOTICE.md.
// ADAPT: Zustand setter → callback do argumento (stack travada RHF + RSC)
import React from 'react'

import { useQueryState } from 'nuqs'

export interface UseThemePresetFromUrlProps {
  applyThemePreset: (preset: string) => void // ADAPT: was read from Zustand store; now explicit callback arg
}

export const useThemePresetFromUrl = ({
  applyThemePreset, // ADAPT: Zustand setter → callback do argumento (stack travada RHF + RSC)
}: UseThemePresetFromUrlProps) => {
  const [preset, setPreset] = useQueryState('theme')

  // Apply theme preset if it exists in URL and remove it
  React.useEffect(() => {
    if (preset) {
      applyThemePreset(preset)
      setPreset(null) // Remove the preset from URL
    }
  }, [preset, setPreset, applyThemePreset])
}
