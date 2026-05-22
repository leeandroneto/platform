// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/shadow-control.tsx
// See NOTICE.md.
//
// Adapts vs tweakcn-ref:
//   1. import SliderWithInput → './slider-with-input' (relative, same dir).
//   2. import ColorPicker → './color-picker' (relative, same dir — Bundle A).
//   3. JSDoc @registry-meta added (ADR-0045 D.13 + component-creation-governance §J).
//   4. 'use client' added (renders interactive controls — cannot be RSC).
//   No logic changes. 6 shadow primitives algorithm 100% preserved.
//
// Store dependency: NONE. Component is fully controlled via props + onChange.
// Parent (e.g. control-panel) reads themeState.light['shadow-*'] via
// useThemeFormContext() and calls setThemeStyle() — this component is pure UI.

'use client'

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-shadow-control",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "6-primitive shadow editor (color, opacity, blur, spread, offset-x, offset-y) for the theme-studio control panel.",
 *   "examples": ["theme-studio-control-panel"],
 *   "when_to_use": ["theme-studio shadow section only"],
 *   "anti_patterns": ["general design forms outside theme-studio"],
 *   "related": ["theme-studio-slider-with-input", "theme-studio-color-picker"],
 *   "vertical": null,
 *   "propsSchema": "lib/contracts/components/shadow-control.ts"
 * }
 */

import React from 'react'

// SSOT: lib/contracts/components/shadow-control.ts (Zod schema + z.infer).
import type { ShadowControlProps } from '@/lib/contracts/components/shadow-control'

import ColorPicker from './color-picker'
import { SliderWithInput } from './slider-with-input'

const ShadowControl: React.FC<ShadowControlProps> = ({
  shadowColor,
  shadowOpacity,
  shadowBlur,
  shadowSpread,
  shadowOffsetX,
  shadowOffsetY,
  onChange,
}) => {
  return (
    <div>
      <ColorPicker
        color={shadowColor}
        onChange={(color) => onChange('shadow-color', color)}
        label="Color"
      />

      <SliderWithInput
        value={shadowOpacity}
        onChange={(value) => onChange('shadow-opacity', value)}
        min={0}
        max={1}
        step={0.01}
        unit=""
        label="Opacity"
      />

      <SliderWithInput
        value={shadowBlur}
        onChange={(value) => onChange('shadow-blur', value)}
        min={0}
        max={50}
        step={0.5}
        unit="px"
        label="Blur"
      />

      <SliderWithInput
        value={shadowSpread}
        onChange={(value) => onChange('shadow-spread', value)}
        min={-50}
        max={50}
        step={0.5}
        unit="px"
        label="Spread"
      />

      <SliderWithInput
        value={shadowOffsetX}
        onChange={(value) => onChange('shadow-offset-x', value)}
        min={-50}
        max={50}
        step={0.5}
        unit="px"
        label="Offset X"
      />

      <SliderWithInput
        value={shadowOffsetY}
        onChange={(value) => onChange('shadow-offset-y', value)}
        min={-50}
        max={50}
        step={0.5}
        unit="px"
        label="Offset Y"
      />
    </div>
  )
}

export default ShadowControl
