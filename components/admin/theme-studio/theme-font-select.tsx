// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/theme-font-select.tsx
// ADAPT: no useEditorStore usage in this component — it is fully prop-driven.
//        Imports realigned to platform paths.
// See NOTICE.md.
'use client'

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-theme-font-select",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Simple select for built-in theme fonts (sans/serif/mono presets). Companion to FontPicker for the typography tab.",
 *   "examples": ["<ThemeFontSelect fonts={sansSerifFonts} defaultValue='Inter, sans-serif' currentFont={currentSans} onFontChange={handleChange} />"],
 *   "when_to_use": ["Typography tab of theme-studio when offering preset font list"],
 *   "anti_patterns": ["Do not use for Google Fonts dynamic search — use FontPicker instead"],
 *   "related": ["font-picker", "control-panel"],
 *   "vertical": null,
 *   "propsSchema": "lib/contracts/components/theme-font-select.ts"
 * }
 */

import React, { useMemo } from 'react'
import { useTranslations } from 'next-intl'

// SSOT: lib/contracts/components/theme-font-select.ts (Zod schema + z.infer).
import type { ThemeFontSelectProps } from '@/lib/contracts/components/theme-font-select'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ThemeFontSelect: React.FC<ThemeFontSelectProps> = ({
  fonts,
  defaultValue,
  currentFont,
  onFontChange,
}) => {
  const t = useTranslations('theme-studio.controlPanel.typography')
  const fontNames = useMemo(() => ['System', ...Object.keys(fonts)], [fonts])
  const value = currentFont ? (fonts[currentFont] ?? defaultValue) : defaultValue

  return (
    <Select value={value || ''} onValueChange={onFontChange}>
      <div className="flex w-full items-center gap-1">
        <SelectTrigger className="bg-secondary text-secondary-foreground w-full">
          <SelectValue placeholder={t('selectFontPlaceholder')} />
        </SelectTrigger>
      </div>
      <SelectContent className="max-h-[400px]">
        <SelectGroup>
          {fontNames.map((fontName) => (
            <SelectItem key={fontName} value={fonts[fontName] ?? defaultValue}>
              <span
                style={{
                  fontFamily: fonts[fontName] ?? defaultValue,
                }}
              >
                {fontName}
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default ThemeFontSelect
