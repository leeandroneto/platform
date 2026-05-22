// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/font-picker.tsx
// ADAPT: useEditorStore → useThemeFormContext (not used in this component — FontPicker
//        is prop-driven; parent passes value/onSelect).
//        Endpoint /api/google-fonts → /api/admin/theme-studio/google-fonts.
//        TooltipWrapper inlined (not in platform — uses components/ui/tooltip).
//        useFontSearch → @/lib/hooks/use-font-search (native React, no react-query).
//        Imports realigned to platform paths.
//        i18n strings → namespace theme-studio.fontPicker via useTranslations.
//        Fase 4 decompose: POPULAR_FONTS → font-picker-data.ts, FontItem → font-picker-item.tsx.
// See NOTICE.md.
'use client'

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-font-picker",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Google Fonts picker with infinite scroll, category filter and debounced search. Used in theme-studio typography tab.",
 *   "examples": ["<FontPicker value={font} onSelect={handleSelect} />"],
 *   "when_to_use": ["Typography tab of theme-studio control panel"],
 *   "anti_patterns": ["Do not use outside theme-studio — font loading side-effects couple to Google Fonts CDN"],
 *   "related": ["theme-font-select", "control-panel"],
 *   "vertical": null,
 *   "propsSchema": "lib/contracts/components/font-picker.ts"
 * }
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { ChevronDown, FunnelX, Loader2 } from 'lucide-react'

import type { FontPickerProps } from '@/lib/contracts/components/font-picker'
import type { FontInfo } from '@/lib/design/contract/fonts'
import { loadGoogleFont } from '@/lib/design/fonts/google-fonts'
import { buildFontFamily, getDefaultWeights, waitForFont } from '@/lib/design/fonts/index'
import { useDebouncedCallback } from '@/lib/hooks/use-debounced-callback'
import { type FilterFontCategory, useFontSearch } from '@/lib/hooks/use-font-search'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { POPULAR_FONTS } from './font-picker-data'
import { FontItem } from './font-picker-item'

export function FontPicker({ value, category, onSelect, placeholder, className }: FontPickerProps) {
  const t = useTranslations('theme-studio.fontPicker')

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<FilterFontCategory>(category ?? 'all')
  const [loadingFont, setLoadingFont] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const selectedFontRef = useRef<HTMLDivElement>(null)
  const hasScrolledToSelectedFont = useRef(false)

  const debouncedSetSearchQuery = useDebouncedCallback(setSearchQuery, 300)

  useEffect(() => {
    debouncedSetSearchQuery(inputValue)
  }, [inputValue, debouncedSetSearchQuery])

  const fontQuery = useFontSearch({
    query: searchQuery,
    category: selectedCategory,
    limit: 15,
    enabled: open,
  })

  useEffect(() => {
    if (!open) return
    scrollRef.current?.scrollTo({ top: 0 })
  }, [selectedCategory, searchQuery, open])

  useEffect(() => {
    if (open && fontQuery.data && !hasScrolledToSelectedFont.current) {
      requestAnimationFrame(() => {
        selectedFontRef.current?.scrollIntoView({ block: 'center', inline: 'nearest' })
      })
      hasScrolledToSelectedFont.current = true
    } else if (!open) {
      hasScrolledToSelectedFont.current = false
    }
  }, [open, fontQuery.data])

  const allFonts = useMemo(() => {
    if (!fontQuery.data) return []
    return fontQuery.data.pages.flatMap((page) => page.fonts)
  }, [fontQuery.data])

  const popularFonts = useMemo(() => {
    if (searchQuery) return []
    if (selectedCategory === 'all') {
      return [
        ...(POPULAR_FONTS['sans-serif'] ?? []).slice(0, 2),
        ...(POPULAR_FONTS['serif'] ?? []).slice(0, 1),
        ...(POPULAR_FONTS['monospace'] ?? []).slice(0, 1),
      ]
    }
    return POPULAR_FONTS[selectedCategory] ?? []
  }, [searchQuery, selectedCategory])

  const remainingFonts = useMemo(() => {
    if (popularFonts.length === 0) return allFonts
    const popularFamilies = new Set(popularFonts.map((f) => f.family))
    return allFonts.filter((font) => !popularFamilies.has(font.family))
  }, [allFonts, popularFonts])

  const loadMoreRefCallback = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return
      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0]
          if (entry?.isIntersecting && fontQuery.hasNextPage && !fontQuery.isFetchingNextPage) {
            fontQuery.fetchNextPage()
          }
        },
        { root: scrollRef.current, rootMargin: '100px', threshold: 0 },
      )
      observer.observe(node)
      return () => observer.unobserve(node)
    },
    [fontQuery.hasNextPage, fontQuery.isFetchingNextPage, fontQuery.fetchNextPage],
  )

  const handleFontSelect = useCallback(
    async (font: FontInfo) => {
      setLoadingFont(font.family)
      try {
        const weights = getDefaultWeights(font.variants)
        loadGoogleFont(font.family, weights)
        await waitForFont(font.family, weights[0])
      } catch (error) {
        console.warn(`Failed to load font ${font.family}:`, error)
      }
      setLoadingFont(null)
      onSelect(font)
    },
    [onSelect],
  )

  const currentFont = useMemo(() => {
    if (!value) return null
    const foundFont = allFonts.find((font: FontInfo) => font.family === value)
    if (foundFont) return foundFont
    const extractedFontName = value.split(',')[0]?.trim().replace(/['"]/g, '') ?? value
    return {
      family: extractedFontName,
      category: category ?? 'sans-serif',
      variants: ['400'],
      variable: false,
    } as FontInfo
  }, [value, allFonts, category])

  const resolvedPlaceholder = placeholder ?? t('search')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn('bg-input/25 w-full justify-between', className)}
        >
          <div className="flex items-center gap-2">
            {currentFont ? (
              <span className="inline-flex items-center gap-2">
                <span
                  style={{ fontFamily: buildFontFamily(currentFont.family, currentFont.category) }}
                >
                  {currentFont.family}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{resolvedPlaceholder}</span>
            )}
          </div>
          <ChevronDown className="ms-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[300px] p-0" align="start">
        <Command shouldFilter={false} className="h-96 w-full overflow-hidden">
          <div className="flex flex-col">
            <div className="relative">
              <CommandInput
                className="h-10 w-full border-none p-0 pe-10"
                placeholder={t('search')}
                value={inputValue}
                onValueChange={setInputValue}
              />
              {inputValue && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInputValue('')}
                        className="absolute top-2 inset-e-2 size-6"
                        aria-label={t('search')}
                      >
                        <FunnelX className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>{t('search')}</span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <div className="px-2 py-1">
              <Select
                value={selectedCategory}
                onValueChange={(val) => setSelectedCategory(val as FilterFontCategory)}
              >
                <SelectTrigger
                  size="sm"
                  className="bg-input/25 px-2 text-xs outline-none focus:ring-0"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('categoryAll')}</SelectItem>
                  <SelectItem value="sans-serif">{t('categorySansSerif')}</SelectItem>
                  <SelectItem value="serif">{t('categorySerif')}</SelectItem>
                  <SelectItem value="monospace">{t('categoryMonospace')}</SelectItem>
                  <SelectItem value="display">{t('categoryDisplay')}</SelectItem>
                  <SelectItem value="handwriting">{t('categoryHandwriting')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="relative isolate size-full">
            {fontQuery.isLoading ? (
              <div className="absolute inset-0 flex size-full items-center justify-center gap-2 text-center">
                <Loader2 className="size-4 animate-spin" />
                <span className="text-muted-foreground text-sm">{t('loading')}</span>
              </div>
            ) : allFonts.length === 0 ? (
              <CommandEmpty>{t('noResults')}</CommandEmpty>
            ) : (
              <CommandList className="scrollbar-thin size-full p-1" ref={scrollRef}>
                {popularFonts.length > 0 && (
                  <CommandGroup heading={t('groupPopular')}>
                    {popularFonts.map((font) => (
                      <FontItem
                        key={font.family}
                        font={font}
                        isSelected={font.family === value}
                        isLoading={loadingFont === font.family}
                        onSelect={handleFontSelect}
                        selectedRef={font.family === value ? selectedFontRef : null}
                      />
                    ))}
                  </CommandGroup>
                )}

                <CommandGroup heading={popularFonts.length > 0 ? t('groupAllFonts') : undefined}>
                  {remainingFonts.map((font: FontInfo) => (
                    <FontItem
                      key={font.family}
                      font={font}
                      isSelected={font.family === value}
                      isLoading={loadingFont === font.family}
                      onSelect={handleFontSelect}
                      selectedRef={font.family === value ? selectedFontRef : null}
                    />
                  ))}
                </CommandGroup>

                {fontQuery.hasNextPage && <div ref={loadMoreRefCallback} className="h-2 w-full" />}

                {fontQuery.isFetchingNextPage && (
                  <div className="flex items-center justify-center gap-2 p-2">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-muted-foreground text-sm">{t('loadMore')}</span>
                  </div>
                )}
              </CommandList>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
