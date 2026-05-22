// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/font-picker.tsx
// ADAPT: useEditorStore → useThemeFormContext (not used in this component — FontPicker
//        is prop-driven; parent passes value/onSelect).
//        Endpoint /api/google-fonts → /api/admin/theme-studio/google-fonts.
//        TooltipWrapper inlined (not in platform — uses components/ui/tooltip).
//        useFontSearch → @/lib/hooks/use-font-search (native React, no react-query).
//        Imports realigned to platform paths.
//        i18n strings → namespace theme-studio.fontPicker via useTranslations.
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

import { Check, ChevronDown, FunnelX, Loader2 } from 'lucide-react'

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
  CommandItem,
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

const POPULAR_FONTS: Record<string, FontInfo[]> = {
  'sans-serif': [
    {
      family: 'Inter',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Roboto',
      category: 'sans-serif',
      variants: ['100', '300', '400', '500', '700', '900'],
      variable: false,
    },
    {
      family: 'Open Sans',
      category: 'sans-serif',
      variants: ['300', '400', '500', '600', '700', '800'],
      variable: true,
    },
    {
      family: 'Poppins',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: false,
    },
    {
      family: 'Montserrat',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Lato',
      category: 'sans-serif',
      variants: ['100', '300', '400', '700', '900'],
      variable: false,
    },
    {
      family: 'Nunito',
      category: 'sans-serif',
      variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Raleway',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'DM Sans',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Plus Jakarta Sans',
      category: 'sans-serif',
      variants: ['200', '300', '400', '500', '600', '700', '800'],
      variable: true,
    },
    {
      family: 'Geist',
      category: 'sans-serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
  ],
  serif: [
    {
      family: 'Playfair Display',
      category: 'serif',
      variants: ['400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Merriweather',
      category: 'serif',
      variants: ['300', '400', '700', '900'],
      variable: false,
    },
    {
      family: 'Lora',
      category: 'serif',
      variants: ['400', '500', '600', '700'],
      variable: true,
    },
    {
      family: 'PT Serif',
      category: 'serif',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'Noto Serif',
      category: 'serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Source Serif 4',
      category: 'serif',
      variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Libre Baskerville',
      category: 'serif',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'EB Garamond',
      category: 'serif',
      variants: ['400', '500', '600', '700', '800'],
      variable: true,
    },
    {
      family: 'Crimson Text',
      category: 'serif',
      variants: ['400', '600', '700'],
      variable: false,
    },
    {
      family: 'Bitter',
      category: 'serif',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
  ],
  monospace: [
    {
      family: 'JetBrains Mono',
      category: 'monospace',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800'],
      variable: true,
    },
    {
      family: 'Fira Code',
      category: 'monospace',
      variants: ['300', '400', '500', '600', '700'],
      variable: true,
    },
    {
      family: 'Source Code Pro',
      category: 'monospace',
      variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Roboto Mono',
      category: 'monospace',
      variants: ['100', '200', '300', '400', '500', '600', '700'],
      variable: true,
    },
    {
      family: 'IBM Plex Mono',
      category: 'monospace',
      variants: ['100', '200', '300', '400', '500', '600', '700'],
      variable: false,
    },
    {
      family: 'Space Mono',
      category: 'monospace',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'Ubuntu Mono',
      category: 'monospace',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'Inconsolata',
      category: 'monospace',
      variants: ['200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Geist Mono',
      category: 'monospace',
      variants: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
      variable: true,
    },
    {
      family: 'Anonymous Pro',
      category: 'monospace',
      variants: ['400', '700'],
      variable: false,
    },
    {
      family: 'Red Hat Mono',
      category: 'monospace',
      variants: ['300', '400', '500', '600', '700'],
      variable: true,
    },
  ],
  display: [
    { family: 'Bebas Neue', category: 'display', variants: ['400'], variable: false },
    { family: 'Abril Fatface', category: 'display', variants: ['400'], variable: false },
    { family: 'Righteous', category: 'display', variants: ['400'], variable: false },
    {
      family: 'Fredoka',
      category: 'display',
      variants: ['300', '400', '500', '600', '700'],
      variable: true,
    },
    { family: 'Lobster', category: 'display', variants: ['400'], variable: false },
    {
      family: 'Comfortaa',
      category: 'display',
      variants: ['300', '400', '500', '600', '700'],
      variable: true,
    },
    { family: 'Alfa Slab One', category: 'display', variants: ['400'], variable: false },
    { family: 'Bungee', category: 'display', variants: ['400'], variable: false },
    { family: 'Lilita One', category: 'display', variants: ['400'], variable: false },
    { family: 'Permanent Marker', category: 'display', variants: ['400'], variable: false },
  ],
  handwriting: [
    {
      family: 'Dancing Script',
      category: 'handwriting',
      variants: ['400', '500', '600', '700'],
      variable: true,
    },
    { family: 'Pacifico', category: 'handwriting', variants: ['400'], variable: false },
    {
      family: 'Caveat',
      category: 'handwriting',
      variants: ['400', '500', '600', '700'],
      variable: true,
    },
    { family: 'Satisfy', category: 'handwriting', variants: ['400'], variable: false },
    { family: 'Great Vibes', category: 'handwriting', variants: ['400'], variable: false },
    { family: 'Sacramento', category: 'handwriting', variants: ['400'], variable: false },
    {
      family: 'Kalam',
      category: 'handwriting',
      variants: ['300', '400', '700'],
      variable: false,
    },
    { family: 'Patrick Hand', category: 'handwriting', variants: ['400'], variable: false },
    { family: 'Indie Flower', category: 'handwriting', variants: ['400'], variable: false },
    {
      family: 'Shadows Into Light',
      category: 'handwriting',
      variants: ['400'],
      variable: false,
    },
  ],
}

// FontPickerProps: SSOT em lib/contracts/components/font-picker.ts (Zod + z.infer).
import type { FontPickerProps } from '@/lib/contracts/components/font-picker'

function FontItem({
  font,
  isSelected,
  isLoading,
  onSelect,
  selectedRef,
}: {
  font: FontInfo
  isSelected: boolean
  isLoading: boolean
  onSelect: (font: FontInfo) => void
  selectedRef: React.Ref<HTMLDivElement> | null
}) {
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
        selectedFontRef.current?.scrollIntoView({
          block: 'center',
          inline: 'nearest',
        })
      })
      hasScrolledToSelectedFont.current = true
    } else if (!open) {
      hasScrolledToSelectedFont.current = false
    }
  }, [open, fontQuery.data])

  // Flatten all pages into a single array
  const allFonts = useMemo(() => {
    if (!fontQuery.data) return []
    return fontQuery.data.pages.flatMap((page) => page.fonts)
  }, [fontQuery.data])

  // Popular fonts for the current category (only shown when not searching)
  const popularFonts = useMemo(() => {
    if (searchQuery) return []
    if (selectedCategory === 'all') {
      // Show a mix from sans-serif, serif, monospace
      return [
        ...(POPULAR_FONTS['sans-serif'] ?? []).slice(0, 2),
        ...(POPULAR_FONTS['serif'] ?? []).slice(0, 1),
        ...(POPULAR_FONTS['monospace'] ?? []).slice(0, 1),
      ]
    }
    return POPULAR_FONTS[selectedCategory] ?? []
  }, [searchQuery, selectedCategory])

  // Filter out popular fonts from the main list to avoid duplicates
  const remainingFonts = useMemo(() => {
    if (popularFonts.length === 0) return allFonts
    const popularFamilies = new Set(popularFonts.map((f) => f.family))
    return allFonts.filter((font) => !popularFamilies.has(font.family))
  }, [allFonts, popularFonts])

  // Intersection Observer ref callback for infinite scroll
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
        {
          root: scrollRef.current,
          rootMargin: '100px',
          threshold: 0,
        },
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

  // Get current font info for display
  const currentFont = useMemo(() => {
    if (!value) return null

    // First try to find the font in the search results
    const foundFont = allFonts.find((font: FontInfo) => font.family === value)
    if (foundFont) return foundFont

    // If not found in search results, create a fallback FontInfo object
    // This happens when a font is selected and then the search changes
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
                  style={{
                    fontFamily: buildFontFamily(currentFont.family, currentFont.category),
                  }}
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

                {/* Load more trigger element for infinite scroll */}
                {fontQuery.hasNextPage && <div ref={loadMoreRefCallback} className="h-2 w-full" />}

                {/* Loading indicator for infinite scroll */}
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
