// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/hsl-preset-button.tsx
// See NOTICE.md.
//
// ADAPT: none — component is purely prop-driven; no store dependencies.
//        Stack: React 19, shadcn new-york, Tailwind v4, OKLCH-primary tokens.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-hsl-preset-button",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Preset button showing HSL-adjusted color preview swatches for the theme studio palette panel",
 *   "examples": [],
 *   "when_to_use": ["theme studio HSL preset palette row"],
 *   "anti_patterns": ["generic color pickers outside theme studio"],
 *   "related": ["theme-studio-control-section", "theme-studio-section-context"],
 *   "vertical": null,
 *   "propsSchema": "lib/contracts/components/hsl-preset-button.ts"
 * }
 */
'use client'

import type React from 'react'

// SSOT: lib/contracts/components/hsl-preset-button.ts (Zod schema + z.infer).
import type { HslPresetButtonProps } from '@/lib/contracts/components/hsl-preset-button'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

export const HslPresetButton: React.FC<HslPresetButtonProps> = ({
  label,
  hueShift,
  saturationScale,
  lightnessScale,
  baseBg,
  basePrimary,
  baseSecondary = 'oklch(0.535 0 0)',
  onClick,
  selected,
  adjustColorByHsl,
}) => {
  const previewBg = adjustColorByHsl(baseBg, hueShift, saturationScale, lightnessScale)
  const previewPrimary = adjustColorByHsl(basePrimary, hueShift, saturationScale, lightnessScale)
  const previewSecondary = adjustColorByHsl(
    baseSecondary,
    hueShift,
    saturationScale,
    lightnessScale,
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            onClick={onClick}
            size="sm"
            variant="outline"
            className={cn(
              'relative h-8 w-full overflow-hidden rounded-md p-0 shadow-sm transition-all duration-200',
              'hover:scale-105 hover:shadow-md',
              selected ? 'ring-primary ring-1 ring-offset-1' : 'border-border border',
            )}
            style={{ background: previewBg }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-full ">
                <div className="h-full w-1/2 rounded-l-md" style={{ background: previewPrimary }} />
                <div
                  className="h-full w-1/2 rounded-r-md"
                  style={{ background: previewSecondary }}
                />
              </div>
            </div>
            {selected && (
              <div className="bg-primary absolute right-0.5 bottom-0.5 size-2  rounded-full" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
