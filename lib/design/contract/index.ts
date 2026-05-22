// RESEARCH: tweakcn (Apache-2.0) — copied from types/index.ts
// See NOTICE.md.
//
// ADAPT: Removed `FocusColorId` import (Zustand store-bound, DEFER Fase 6).
// `ControlSectionProps`, `ColorPickerProps`, `SliderInputProps`,
// `ToggleOptionProps`, `ReadOnlyColorDisplayProps`, `ColorFormat`,
// `ValidTailwindShade` ported as-is (pure React props, no deps).
// `ColorPickerProps.name` typed as `string` in place of `FocusColorId`.

export type ControlSectionProps = {
  title: string
  children: React.ReactNode
  expanded?: boolean
  className?: string
  headerAction?: React.ReactNode
}

export type ColorPickerProps = {
  /**
   * The current color value.
   */
  color: string
  /**
   * Callback invoked whenever the color value changes.
   */
  onChange: (color: string) => void
  /**
   * Human-readable label for the control.
   */
  label: string
  /**
   * (Optional) Identifier that maps this color picker to a theme style key.
   * When provided, it enables programmatic focusing via `focusColorControl()`.
   * ADAPT: typed as string (FocusColorId is Zustand-bound — DEFER Fase 6).
   */
  name?: string
}

export type SliderInputProps = {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  label: string
  unit?: string
}

export type ToggleOptionProps<T> = {
  value: T
  options: { label: string; value: T }[]
  onChange: (value: T) => void
  label: string
}

export type ReadOnlyColorDisplayProps = {
  color: string
  label: string
  linkTo: string
}

export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'oklch'

export type ValidTailwindShade =
  | '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950'
