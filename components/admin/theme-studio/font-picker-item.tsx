// RESEARCH: tweakcn (Apache-2.0) — extracted from components/editor/font-picker.tsx
// FontItem sub-component extracted to own file (Fase 4 decompose — LOC compliance).
// Internal to font-picker.tsx — not exported from theme-studio barrel.
// See NOTICE.md.
'use client'

import { useTranslations } from 'next-intl'

import { Check, Loader2 } from 'lucide-react'

import type { FontInfo } from '@/lib/design/contract/fonts'
import { loadGoogleFont } from '@/lib/design/fonts/google-fonts'
import { buildFontFamily } from '@/lib/design/fonts/index'

import { CommandItem } from '@/components/ui/command'

// ── FontItemProps ────────────────────────────────────────────────────────────
// Internal props — not exported via lib/contracts (helper internal to font-picker).
// §15.1 B exception: sub-components de helpers internos não-exportados podem
// usar TS inline (sem Zod schema separado).
type FontItemProps = {
  font: FontInfo
  isSelected: boolean
  isLoading: boolean
  onSelect: (font: FontInfo) => void
  selectedRef: React.Ref<HTMLDivElement> | null
}

/**
 * Renders a single font entry in the FontPicker command list.
 * Displays font name in its own typeface, category label, and variable badge.
 * Preloads the font at weight 400 on hover via loadGoogleFont().
 */
export function FontItem({ font, isSelected, isLoading, onSelect, selectedRef }: FontItemProps) {
  const t = useTranslations('theme-studio.fontPicker')
  const fontFamily = buildFontFamily(font.family, font.category)

  return (
    <CommandItem
      className="flex cursor-pointer items-center justify-between gap-2 p-2"
      onSelect={() => onSelect(font)}
      disabled={isLoading}
      onMouseEnter={() => loadGoogleFont(font.family, ['400'])}
      ref={selectedRef}
    >
      <div className="line-clamp-1 inline-flex w-full flex-1 flex-col justify-between">
        <span className="inline-flex items-center gap-2 truncate" style={{ fontFamily }}>
          {font.family}
          {isLoading && <Loader2 className="size-3 animate-spin" />}
        </span>
        <div className="flex items-center gap-1 text-xs font-normal opacity-70">
          <span>{font.category}</span>
          {font.variable && (
            <span className="inline-flex items-center gap-1">
              <span>{'•'}</span>
              <span>{t('variableLabel')}</span>
            </span>
          )}
        </div>
      </div>
      {isSelected && <Check className="size-4 shrink-0 opacity-70" />}
    </CommandItem>
  )
}
