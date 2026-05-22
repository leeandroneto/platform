// RESEARCH: tweakcn (Apache-2.0) — adapted from hooks/use-contrast-checker.ts
// See NOTICE.md.
// ADAPT: WCAG luminance → APCA Silver dual-gate (ADR-0040 §H + research-32; one-way door)
import { useEffect, useState } from 'react'

import { apca } from '@/lib/design/contrast' // ADAPT: WCAG luminance → APCA Silver dual-gate (ADR-0040 §H + research-32; one-way door)
import { useDebouncedCallback } from '@/lib/hooks/use-debounced-callback'

// APCA Silver thresholds (ADR-0040 §H + research-32):
// body Lc ≥75, large Lc ≥60, non-text Lc ≥45
const APCA_BODY_THRESHOLD = 75
const APCA_LARGE_THRESHOLD = 60
const APCA_NON_TEXT_THRESHOLD = 45

export { APCA_BODY_THRESHOLD, APCA_LARGE_THRESHOLD, APCA_NON_TEXT_THRESHOLD }

type ColorPair = {
  id: string
  foreground: string
  background: string
}

type ContrastResult = {
  id: string
  contrastRatio: number // ADAPT: value is now APCA Lc (absolute), not WCAG ratio
}

/**
 * Hook that calculates the APCA contrast (Lc) between foreground and background
 * colors for a list of pairs.
 *
 * ADAPT: TweakCN used WCAG contrast ratio (getContrastRatio from culori wcagLuminance).
 * We use APCA Lc via apca() from lib/design/contrast (ADR-0040 §H, one-way door).
 * contrastRatio field now holds absolute Lc value (body ≥75, large ≥60, non-text ≥45).
 *
 * @param colorPairs - An array of color pairs, each with an id, foreground color, and background color.
 * @returns An array of objects, each containing the id and calculated Lc for a pair.
 */
export function useContrastChecker(colorPairs: ColorPair[]) {
  const [contrastResults, setContrastResults] = useState<ContrastResult[]>([])

  const debouncedCalculation = useDebouncedCallback((pairs: ColorPair[]) => {
    if (!pairs.length) {
      setContrastResults([])
      return
    }

    try {
      const results = pairs.map((pair) => {
        const lc = apca(pair.foreground, pair.background)
        return {
          id: pair.id,
          contrastRatio: lc, // APCA Lc (absolute); body ≥75, large ≥60, non-text ≥45
        }
      })

      setContrastResults(results)
    } catch (error) {
      console.error('Error checking contrast:', error)
      setContrastResults([])
    }
  }, 750)

  useEffect(() => {
    debouncedCalculation(colorPairs)
  }, [colorPairs, debouncedCalculation])

  return contrastResults
}
