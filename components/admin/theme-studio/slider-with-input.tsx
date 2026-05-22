// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/slider-with-input.tsx
// See NOTICE.md.
//
// Adapts vs tweakcn-ref:
//   1. Imports rewritten: @/components/ui/{slider,input,label} (monorepo paths).
//   2. JSDoc @registry-meta added (ADR-0045 D.13 + component-creation-governance §J).
//   3. 'use client' added (uses useState/useEffect — cannot be RSC).
//   No logic changes. Algorithm 100% preserved.

'use client'

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-slider-with-input",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Controlled slider paired with a numeric text input and unit label — used in theme-studio shadow/radius controls.",
 *   "examples": ["shadow-control"],
 *   "when_to_use": ["numeric CSS token editors that benefit from both drag and keyboard precision"],
 *   "anti_patterns": ["general-purpose forms outside theme-studio — use RHF <FormField> + <Input> instead"],
 *   "related": ["theme-studio-shadow-control"],
 *   "vertical": null
 * }
 */

import { useState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export const SliderWithInput = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  label,
  unit = 'px',
}: {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step?: number
  label: string
  unit?: string
}) => {
  // isEditing guards against slider-driven updates overwriting in-progress typing.
  // When user is not actively editing, displayValue mirrors the canonical `value` prop.
  // Using useState (not useRef) avoids react-hooks/refs: cannot access ref during render.
  const [localValue, setLocalValue] = useState<string>(() => value.toString())
  const [isEditing, setIsEditing] = useState(false)

  // Derived display value: during active text editing show localValue (allows
  // partial input like "1." mid-type); otherwise reflect the controlled prop.
  // No useEffect needed — derivation is pure from already-tracked state.
  const displayValue = isEditing ? localValue : value.toString()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setLocalValue(raw)
    const num = parseFloat(raw.replace(',', '.'))
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(max, num)))
    }
  }

  const handleFocus = () => {
    setIsEditing(true)
    setLocalValue(value.toString())
  }

  const handleBlur = () => {
    setIsEditing(false)
    setLocalValue(value.toString())
  }

  return (
    <div className="flex items-center gap-2 py-0.5">
      <Label
        htmlFor={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
        className="text-muted-foreground w-16 shrink-0 text-[11px] font-medium"
      >
        {label}
      </Label>
      <Slider
        id={`slider-${label.replace(/\s+/g, '-').toLowerCase()}`}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(values) => {
          const newValue = values[0]
          if (newValue === undefined) return
          setLocalValue(newValue.toString())
          onChange(newValue)
        }}
        className="min-w-0 flex-1"
      />
      <div className="flex shrink-0 items-center gap-1">
        <Input
          id={`input-${label.replace(/\s+/g, '-').toLowerCase()}`}
          type="number"
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          className="h-6 w-14 px-1.5 text-xs"
        />
        <span className="text-muted-foreground w-5 text-[11px]">{unit}</span>
      </div>
    </div>
  )
}
