// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/theme-preset-select.tsx
// See NOTICE.md.
// ADAPT:
//   1. useThemePresetStore Zustand → defaultPresets from lib/design/presets/theme-presets
//   2. useEditorStore → useThemeFormContext() (ADR-0040 §C)
//   3. authClient.useSession / savedPresets (SAVED source) → DEFERRED Chunk 7
//      (no server action for user saved presets yet; only BUILT_IN presets shown)
//   4. PostHog analytics → REMOVED (memory frescura_filter)
//   5. Link href="/community" → REMOVED (not applicable to platform)
//   6. Link href="/settings/themes" → REMOVED (deferred Chunk 7)
//   7. ThemeToggle → REMOVED (not ported yet; JIT Chunk 7)
//   8. TooltipWrapper → shadcn Tooltip inline
//   9. i18n strings → namespace theme-studio.presetSelect
//   10. 'use client' preserved (Next 16 App Router)

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-preset-select",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Popover dropdown to select, search and cycle through built-in theme presets in the theme studio. Adapted from TweakCN theme-preset-select.",
 *   "examples": [],
 *   "when_to_use": ["theme studio control panel header — preset picker"],
 *   "anti_patterns": ["standalone usage outside ThemeFormProvider tree"],
 *   "related": ["theme-studio-control-panel", "theme-studio-preview-panel"],
 *   "vertical": null,
 *   "propsSchema": "lib/contracts/components/preset-select.ts"
 * }
 */
'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { ArrowLeft, ArrowRight, Check, ChevronDown, Search, Shuffle } from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────
// ThemePresetSelectProps: SSOT lib/contracts/components/preset-select.ts
// (Zod schema for own props + TS intersection com React.ComponentProps<typeof Button>).
import type { ThemePresetSelectProps } from '@/lib/contracts/components/preset-select'
import type { ThemePreset } from '@/lib/design/contract/theme'
import { getPresetThemeStyles } from '@/lib/design/presets/theme-preset-helper'
import { defaultPresets } from '@/lib/design/presets/theme-presets'
import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { useThemeFormContext } from '@/app/temas/_state/theme-form-provider'

interface ColorBoxProps {
  color: string
}

// ── Sub-components ────────────────────────────────────────────────────────────

const ColorBox: React.FC<ColorBoxProps> = ({ color }) => (
  <div className="border-muted size-3  rounded-sm border" style={{ backgroundColor: color }} />
)

interface ThemeColorsProps {
  presetName: string
  mode: 'light' | 'dark'
}

const ThemeColors: React.FC<ThemeColorsProps> = ({ presetName, mode }) => {
  const styles = getPresetThemeStyles(presetName)
  return (
    <div className="flex gap-0.5">
      <ColorBox color={styles[mode].primary} />
      <ColorBox color={styles[mode].accent} />
      <ColorBox color={styles[mode].secondary} />
      <ColorBox color={styles[mode].border} />
    </div>
  )
}

const isThemeNew = (preset: ThemePreset) => {
  if (!preset.createdAt) return false
  const createdAt = new Date(preset.createdAt)
  const timePeriod = new Date()
  timePeriod.setDate(timePeriod.getDate() - 5)
  return createdAt > timePeriod
}

// ── ThemeControls ─────────────────────────────────────────────────────────────

const ThemeControls = ({
  presetNames,
  onApply,
}: {
  presetNames: string[]
  onApply: (name: string) => void
}) => {
  const t = useTranslations('theme-studio.presetSelect')

  const randomize = useCallback(() => {
    const random = Math.floor(Math.random() * presetNames.length)
    const randomName = presetNames[random]
    if (!randomName) return
    onApply(randomName)
  }, [presetNames, onApply])

  return (
    <div className="flex gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm" className="size-6 p-1" onClick={randomize}>
            <Shuffle className="size-3.5 " />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{t('randomTheme')}</TooltipContent>
      </Tooltip>
    </div>
  )
}

// ── ThemeCycleButton ──────────────────────────────────────────────────────────

interface ThemeCycleButtonProps extends React.ComponentProps<typeof Button> {
  direction: 'prev' | 'next'
  label: string
}

const ThemeCycleButton: React.FC<ThemeCycleButtonProps> = ({
  direction,
  onClick,
  className,
  label,
  ...props
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn('aspect-square h-full shrink-0', className)}
        onClick={onClick}
        {...props}
      >
        {direction === 'prev' ? (
          <ArrowLeft className="size-4 " />
        ) : (
          <ArrowRight className="size-4 " />
        )}
      </Button>
    </TooltipTrigger>
    <TooltipContent>{label}</TooltipContent>
  </Tooltip>
)

// ── ThemePresetCycleControls ──────────────────────────────────────────────────

interface ThemePresetCycleControlsProps extends React.ComponentProps<typeof Button> {
  filteredPresets: string[]
  currentPresetName: string
  onApply: (name: string) => void
  className?: string
}

const ThemePresetCycleControls: React.FC<ThemePresetCycleControlsProps> = ({
  filteredPresets,
  currentPresetName,
  onApply,
  className,
  ...props
}) => {
  const t = useTranslations('theme-studio.presetSelect')

  const foundIndex = useMemo(
    () => filteredPresets.indexOf(currentPresetName || 'default'),
    [filteredPresets, currentPresetName],
  )
  const currentIndex = foundIndex === -1 ? 0 : foundIndex

  const cycleTheme = useCallback(
    (direction: 'prev' | 'next') => {
      const newIndex =
        direction === 'next'
          ? (currentIndex + 1) % filteredPresets.length
          : (currentIndex - 1 + filteredPresets.length) % filteredPresets.length
      const nextName = filteredPresets[newIndex]
      if (!nextName) return
      onApply(nextName)
    },
    [currentIndex, filteredPresets, onApply],
  )

  return (
    <>
      <Separator orientation="vertical" className="min-h-8" />

      <ThemeCycleButton
        direction="prev"
        size="icon"
        className={cn('aspect-square min-h-8 w-auto', className)}
        onClick={() => cycleTheme('prev')}
        label={t('prevTheme')}
        {...props}
      />

      <Separator orientation="vertical" className="min-h-8" />

      <ThemeCycleButton
        direction="next"
        size="icon"
        className={cn('aspect-square min-h-8 w-auto', className)}
        onClick={() => cycleTheme('next')}
        label={t('nextTheme')}
        {...props}
      />
    </>
  )
}

// ── PresetPopoverContent ──────────────────────────────────────────────────────

interface PresetPopoverContentProps {
  search: string
  onSearchChange: (value: string) => void
  filteredPresets: string[]
  presetNames: string[]
  currentPresetName: string
  mode: 'light' | 'dark'
  onApply: (name: string) => void
}

const PresetPopoverContent: React.FC<PresetPopoverContentProps> = ({
  search,
  onSearchChange,
  filteredPresets,
  presetNames,
  currentPresetName,
  mode,
  onApply,
}) => {
  const t = useTranslations('theme-studio.presetSelect')
  const presets = defaultPresets

  return (
    <Command className="w-full">
      <div className="flex w-full items-center">
        <div className="flex w-full items-center border-b px-3 py-1">
          <Search className="size-4 shrink-0 opacity-50" />
          <Input
            placeholder={t('search')}
            className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <div className="text-muted-foreground text-sm">
          {filteredPresets.length} {filteredPresets.length !== 1 ? t('themes') : t('theme')}
        </div>
        <ThemeControls presetNames={presetNames} onApply={onApply} />
      </div>
      <Separator />
      <CommandList className="max-h-[500px]">
        <CommandEmpty>{t('noThemesFound')}</CommandEmpty>

        {/* Built-in Themes Group */}
        {filteredPresets.length > 0 && (
          <CommandGroup heading={t('builtInThemes')}>
            {filteredPresets.map((presetName, index) => (
              <CommandItem
                key={`${presetName}-${index}`}
                value={`${presetName}-${index}`}
                onSelect={() => {
                  onApply(presetName)
                  onSearchChange('')
                }}
                className="data-highlighted:bg-secondary/50 flex items-center gap-2 py-2"
              >
                <ThemeColors presetName={presetName} mode={mode} />
                <div className="flex flex-1 items-center gap-2">
                  <span className="text-sm font-medium capitalize">
                    {presets[presetName]?.label || presetName}
                  </span>
                  {presets[presetName] && isThemeNew(presets[presetName]) && (
                    <Badge variant="secondary" className="rounded-full text-xs">
                      {t('new')}
                    </Badge>
                  )}
                </div>
                {presetName === currentPresetName && (
                  <Check className="size-4 shrink-0 opacity-70" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type PresetsMap = typeof defaultPresets

function filterAndSortPresets(
  presetNames: string[],
  search: string,
  presets: PresetsMap,
): string[] {
  const q = search.toLowerCase()
  const filteredList =
    search.trim() === ''
      ? presetNames
      : presetNames.filter((name) => {
          if (name === 'default') return 'default'.includes(q)
          return (presets[name as keyof PresetsMap]?.label ?? '').toLowerCase().includes(q)
        })

  // Only BUILT_IN — no saved themes separation needed until Chunk 7
  const defaultTheme = filteredList.filter((name) => name === 'default')
  const otherThemes = filteredList
    .filter((name) => name !== 'default')
    .sort((a, b) => {
      const labelA = presets[a as keyof PresetsMap]?.label || a
      const labelB = presets[b as keyof PresetsMap]?.label || b
      return labelA.localeCompare(labelB)
    })
  return [...defaultTheme, ...otherThemes]
}

// ── ThemePresetSelect (main export) ──────────────────────────────────────────

const ThemePresetSelect: React.FC<ThemePresetSelectProps> = ({
  withCycleThemes = true,
  className,
  ...props
}) => {
  const { themeState, reset } = useThemeFormContext()

  // Only BUILT_IN presets for now — SAVED presets deferred Chunk 7
  const presets = defaultPresets
  // currentPreset not tracked here — reset() drives state; label derived from currentPresetName
  const mode: 'light' | 'dark' = 'light' // TODO: bind to active mode from themeState when mode toggle is ported Chunk 7

  const [search, setSearch] = useState('')

  // presetNames: "default" + all BUILT_IN keys
  const presetNames = useMemo(() => ['default', ...Object.keys(presets)], [presets])

  // current preset name — derive by matching themeState primary against presets
  // Simplified: track via local state updated on onSelect (no persistent preset label in ThemeFormApi)
  const [currentPresetName, setCurrentPresetName] = useState<string>('default')

  const applyThemePreset = useCallback(
    (name: string) => {
      const styles = getPresetThemeStyles(name)
      reset(styles)
      setCurrentPresetName(name)
    },
    [reset],
  )

  const filteredPresets = useMemo(
    () => filterAndSortPresets(presetNames, search, presets),
    [presetNames, search, presets],
  )

  return (
    <div className="flex w-full items-center">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn('group relative w-full justify-between md:min-w-56', className)}
            {...props}
          >
            <div className="flex w-full items-center gap-3 overflow-hidden">
              <div className="flex gap-0.5">
                <ColorBox color={themeState[mode].primary} />
                <ColorBox color={themeState[mode].accent} />
                <ColorBox color={themeState[mode].secondary} />
                <ColorBox color={themeState[mode].border} />
              </div>
              <span className="truncate text-left font-medium capitalize">
                {presets[currentPresetName]?.label || currentPresetName || 'default'}
              </span>
            </div>
            <ChevronDown className="size-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0" align="center">
          <PresetPopoverContent
            search={search}
            onSearchChange={setSearch}
            filteredPresets={filteredPresets}
            presetNames={presetNames}
            currentPresetName={currentPresetName}
            mode={mode}
            onApply={applyThemePreset}
          />
        </PopoverContent>
      </Popover>

      {withCycleThemes && (
        <ThemePresetCycleControls
          filteredPresets={filteredPresets}
          currentPresetName={currentPresetName}
          onApply={applyThemePreset}
          className={className}
          disabled={props.disabled}
        />
      )}
    </div>
  )
}

export default ThemePresetSelect
