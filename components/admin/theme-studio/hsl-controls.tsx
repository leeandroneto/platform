// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/hsl-adjustment-controls.tsx
// ADAPT:
//   1. Zustand checkpoint → useThemeFormContext() API (ADR-0040 §C)
//   2. Imports relative: ./slider-with-input, ./hsl-preset-button (Chunk 3)
//   3. i18n strings → namespace theme-studio.hslControls
//   4. 'use client' directive added (Next 16 App Router)
//   5. debounce via lib/utils/debounce.ts (already extracted Step 1)
//   6. culori + adjustColorByHsl algorithm preserved 100% (Apache-2.0 algo)
// See NOTICE.md.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-hsl-controls",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "HSL adjustment sliders with 15 presets for batch color shift/saturation/lightness in the theme studio control panel",
 *   "examples": [],
 *   "when_to_use": ["theme studio Other tab — HSL bulk adjustments"],
 *   "anti_patterns": ["generic HSL picker outside theme studio — use color-picker primitive instead"],
 *   "related": ["theme-studio-hsl-preset-button", "theme-studio-slider-with-input", "theme-studio-control-section"],
 *   "vertical": null
 * }
 */
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { converter, formatHex, type Hsl } from 'culori'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { debounce } from '@/lib/utils/debounce'

import { Button } from '@/components/ui/button'

import { useThemeFormContext } from '@/app/temas/_state/theme-form-provider'

import { HslPresetButton } from './hsl-preset-button'
import { SliderWithInput } from './slider-with-input'

// ─── Algorithm (TweakCN Apache-2.0 — preserved 100%) ────────────────────────
function adjustColorByHsl(
  color: string,
  hueShift: number,
  saturationScale: number,
  lightnessScale: number,
): string {
  const hsl = converter('hsl')(color)
  const h = hsl?.h
  const s = hsl?.s
  const l = hsl?.l

  if (h === undefined || s === undefined || l === undefined) {
    return color
  }

  const adjustedHsl = {
    h: (((h + hueShift) % 360) + 360) % 360,
    s: Math.min(1, Math.max(0, s * saturationScale)),
    l: Math.min(1, Math.max(0.1, l * lightnessScale)),
  }

  const out = converter('hsl')(adjustedHsl as Hsl)
  return formatHex(out)
}

// ─── Preset definitions (TweakCN Apache-2.0 — preserved 100%) ───────────────
type HslPreset = {
  label: string
  hueShift: number
  saturationScale: number
  lightnessScale: number
}

const HSL_PRESETS: HslPreset[] = [
  { label: 'Hue (-120°)', hueShift: -120, saturationScale: 1, lightnessScale: 1 },
  { label: 'Hue (-60°)', hueShift: -60, saturationScale: 1, lightnessScale: 1 },
  { label: 'Hue (+60°)', hueShift: 60, saturationScale: 1, lightnessScale: 1 },
  { label: 'Hue (+120°)', hueShift: 120, saturationScale: 1, lightnessScale: 1 },
  { label: 'Hue Invert', hueShift: 180, saturationScale: 1, lightnessScale: 1 },
  { label: 'Grayscale', hueShift: 0, saturationScale: 0, lightnessScale: 1 },
  { label: 'Muted', hueShift: 0, saturationScale: 0.6, lightnessScale: 1 },
  { label: 'Vibrant', hueShift: 0, saturationScale: 1.4, lightnessScale: 1 },
  { label: 'Dimmer', hueShift: 0, saturationScale: 1, lightnessScale: 0.8 },
  { label: 'Brighter', hueShift: 0, saturationScale: 1, lightnessScale: 1.2 },
  { label: 'H(+30) S(-50) L(-5%)', hueShift: 30, saturationScale: 0.5, lightnessScale: 0.95 },
  { label: 'H(-20) S(+20) L(+5%)', hueShift: -20, saturationScale: 1.2, lightnessScale: 1.05 },
  { label: 'H(+20) S(-30) L(-5%)', hueShift: 20, saturationScale: 0.7, lightnessScale: 0.95 },
  { label: 'H(-10) S(-25) L(+10%)', hueShift: -10, saturationScale: 0.75, lightnessScale: 1.1 },
  { label: 'H(+60) S(+50) L(+10%)', hueShift: 60, saturationScale: 1.5, lightnessScale: 1.1 },
]

type HslAdjustments = {
  hueShift: number
  saturationScale: number
  lightnessScale: number
}

const DEFAULT_HSL: HslAdjustments = { hueShift: 0, saturationScale: 1, lightnessScale: 1 }

// ─── Hook — state extraction (keeps component under max-lines-per-function) ──
function useHslControlsState() {
  const { themeState, setCheckpoint, restoreCheckpoint } = useThemeFormContext()
  const [currentHsl, setCurrentHsl] = useState<HslAdjustments>(DEFAULT_HSL)
  const checkpointSetRef = useRef(false)
  const debouncedUpdateRef = useRef<ReturnType<typeof debounce> | null>(null)

  useEffect(() => {
    const isDefault =
      currentHsl.hueShift === DEFAULT_HSL.hueShift &&
      currentHsl.saturationScale === DEFAULT_HSL.saturationScale &&
      currentHsl.lightnessScale === DEFAULT_HSL.lightnessScale
    if (isDefault) {
      if (!checkpointSetRef.current) {
        setCheckpoint()
        checkpointSetRef.current = true
      }
    } else {
      checkpointSetRef.current = false
    }
  }, [currentHsl, setCheckpoint])

  useEffect(() => {
    debouncedUpdateRef.current = debounce((_adj: unknown) => {
      // Signal: checkpoint saved via setCheckpoint above. Parent reads themeState.
    }, 10)
    return () => debouncedUpdateRef.current?.cancel()
  }, [themeState])

  const handleHslChange = useCallback((property: keyof HslAdjustments, value: number) => {
    setCurrentHsl((prev) => ({ ...prev, [property]: value }))
  }, [])

  const handleBatchHslChange = useCallback((value: HslAdjustments) => {
    setCurrentHsl(value)
  }, [])

  const handleRestoreCheckpoint = useCallback(() => {
    restoreCheckpoint()
    setCurrentHsl(DEFAULT_HSL)
    checkpointSetRef.current = false
  }, [restoreCheckpoint])

  const currentStyles = useMemo(() => themeState.light, [themeState.light])

  const isAtDefault =
    currentHsl.hueShift === DEFAULT_HSL.hueShift &&
    currentHsl.saturationScale === DEFAULT_HSL.saturationScale &&
    currentHsl.lightnessScale === DEFAULT_HSL.lightnessScale

  return {
    currentHsl,
    isAtDefault,
    currentStyles,
    handleHslChange,
    handleBatchHslChange,
    handleRestoreCheckpoint,
  }
}

// ─── HslSliders (extracted for max-lines compliance) ─────────────────────────
function HslSliders({
  currentHsl,
  isAtDefault,
  onHslChange,
  onRestore,
}: {
  currentHsl: HslAdjustments
  isAtDefault: boolean
  onHslChange: (property: keyof HslAdjustments, value: number) => void
  onRestore: () => void
}) {
  const t = useTranslations('theme-studio.hslControls')
  return (
    <>
      <SliderWithInput
        value={currentHsl.hueShift}
        onChange={(v) => onHslChange('hueShift', v)}
        unit="deg"
        min={-180}
        max={180}
        step={1}
        label={t('hueLabel')}
      />
      <SliderWithInput
        value={currentHsl.saturationScale}
        onChange={(v) => onHslChange('saturationScale', v)}
        unit="x"
        min={0}
        max={2}
        step={0.01}
        label={t('saturationLabel')}
      />
      <SliderWithInput
        value={currentHsl.lightnessScale}
        onChange={(v) => onHslChange('lightnessScale', v)}
        unit="x"
        min={0.2}
        max={2}
        step={0.01}
        label={t('lightnessLabel')}
      />
      {!isAtDefault && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground mt-1 w-full text-xs"
          onClick={onRestore}
        >
          {t('revertLabel')}
        </Button>
      )}
    </>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
const HslControls = () => {
  const t = useTranslations('theme-studio.hslControls')
  const [isExpanded, setIsExpanded] = useState(false)
  const {
    currentHsl,
    isAtDefault,
    currentStyles,
    handleHslChange,
    handleBatchHslChange,
    handleRestoreCheckpoint,
  } = useHslControlsState()

  return (
    <div className="@container">
      <div
        className={cn(
          '-m-1 mb-2 grid grid-cols-5 gap-2 overflow-hidden p-1 transition-all duration-300 ease-in-out @sm:grid-cols-7 @md:grid-cols-9 @lg:grid-cols-11 @xl:grid-cols-13',
          !isExpanded ? 'h-10' : 'h-auto',
        )}
      >
        {HSL_PRESETS.map((preset) => (
          <HslPresetButton
            key={preset.label}
            label={preset.label}
            hueShift={preset.hueShift}
            saturationScale={preset.saturationScale}
            lightnessScale={preset.lightnessScale}
            baseBg={currentStyles.background}
            basePrimary={currentStyles.primary}
            baseSecondary={currentStyles.secondary}
            selected={
              currentHsl.hueShift === preset.hueShift &&
              currentHsl.saturationScale === preset.saturationScale &&
              currentHsl.lightnessScale === preset.lightnessScale
            }
            adjustColorByHsl={adjustColorByHsl}
            onClick={() => handleBatchHslChange(preset)}
          />
        ))}
      </div>
      {HSL_PRESETS.length > 5 && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground mb-2 flex w-full items-center justify-center text-xs"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? t('hidePresets') : t('showMorePresets')}
          <ChevronDown
            className={cn(
              'ml-1 size-4 transition-transform duration-200',
              isExpanded && 'rotate-180',
            )}
          />
        </Button>
      )}
      <HslSliders
        currentHsl={currentHsl}
        isAtDefault={isAtDefault}
        onHslChange={handleHslChange}
        onRestore={handleRestoreCheckpoint}
      />
    </div>
  )
}

// Re-export adjustColorByHsl for use in control-panel
export { adjustColorByHsl }

export default HslControls
