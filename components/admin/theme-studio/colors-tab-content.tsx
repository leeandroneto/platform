// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/colors-tab-content.tsx
// ADAPT:
//   1. Imports relative: ./color-picker, ./control-section (Chunk 3)
//   2. FocusColorId → string (Zustand store-bound; DEFER Fase 6 per NOTICE.md)
//   3. TooltipWrapper → inlined Tooltip from @/components/ui/tooltip (no platform equivalent)
//   4. 'use client' directive added (Next 16 App Router)
//   5. i18n strings → namespace theme-studio.colorsTabContent
//   6. ThemeStyleProps from @/lib/design/contract/theme (platform SSOT)
// See NOTICE.md.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-colors-tab-content",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Colors tab content for the theme studio control panel — 28-token color pickers grouped by category with search and sidebar sync",
 *   "examples": [],
 *   "when_to_use": ["theme studio Colors tab"],
 *   "anti_patterns": ["generic color management outside theme studio"],
 *   "related": ["theme-studio-color-picker", "theme-studio-control-section"],
 *   "vertical": null
 * }
 */
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { RefreshCw, Search, X } from 'lucide-react'

import { type ThemeStyleProps } from '@/lib/design/contract/theme'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import ColorPicker, { type FocusColorId } from './color-picker'
import ControlSection from './control-section'

// ─── Types ───────────────────────────────────────────────────────────────────
type ColorEntry = {
  key: keyof ThemeStyleProps
  /** name typed as string; FocusColorId deferred Fase 6 */
  name: string
  label: string
}

type ColorGroup = {
  title: string
  expanded?: boolean
  colors: ColorEntry[]
}

// ─── Color groups (TweakCN Apache-2.0 — preserved 100%) ─────────────────────
const COLOR_GROUPS: ColorGroup[] = [
  {
    title: 'Primary',
    expanded: true,
    colors: [
      { key: 'primary', name: 'primary', label: 'Background' },
      { key: 'primary-foreground', name: 'primary-foreground', label: 'Foreground' },
    ],
  },
  {
    title: 'Secondary',
    expanded: true,
    colors: [
      { key: 'secondary', name: 'secondary', label: 'Background' },
      { key: 'secondary-foreground', name: 'secondary-foreground', label: 'Foreground' },
    ],
  },
  {
    title: 'Accent',
    colors: [
      { key: 'accent', name: 'accent', label: 'Background' },
      { key: 'accent-foreground', name: 'accent-foreground', label: 'Foreground' },
    ],
  },
  {
    title: 'Base',
    colors: [
      { key: 'background', name: 'background', label: 'Background' },
      { key: 'foreground', name: 'foreground', label: 'Foreground' },
    ],
  },
  {
    title: 'Card',
    colors: [
      { key: 'card', name: 'card', label: 'Background' },
      { key: 'card-foreground', name: 'card-foreground', label: 'Foreground' },
    ],
  },
  {
    title: 'Popover',
    colors: [
      { key: 'popover', name: 'popover', label: 'Background' },
      { key: 'popover-foreground', name: 'popover-foreground', label: 'Foreground' },
    ],
  },
  {
    title: 'Muted',
    colors: [
      { key: 'muted', name: 'muted', label: 'Background' },
      { key: 'muted-foreground', name: 'muted-foreground', label: 'Foreground' },
    ],
  },
  {
    title: 'Destructive',
    colors: [
      { key: 'destructive', name: 'destructive', label: 'Background' },
      { key: 'destructive-foreground', name: 'destructive-foreground', label: 'Foreground' },
    ],
  },
  {
    title: 'Border & Input',
    colors: [
      { key: 'border', name: 'border', label: 'Border' },
      { key: 'input', name: 'input', label: 'Input' },
      { key: 'ring', name: 'ring', label: 'Ring' },
    ],
  },
  {
    title: 'Chart',
    colors: [
      { key: 'chart-1', name: 'chart-1', label: 'Chart 1' },
      { key: 'chart-2', name: 'chart-2', label: 'Chart 2' },
      { key: 'chart-3', name: 'chart-3', label: 'Chart 3' },
      { key: 'chart-4', name: 'chart-4', label: 'Chart 4' },
      { key: 'chart-5', name: 'chart-5', label: 'Chart 5' },
    ],
  },
  {
    title: 'Sidebar',
    colors: [
      { key: 'sidebar', name: 'sidebar', label: 'Background' },
      { key: 'sidebar-foreground', name: 'sidebar-foreground', label: 'Foreground' },
      { key: 'sidebar-primary', name: 'sidebar-primary', label: 'Primary' },
      {
        key: 'sidebar-primary-foreground',
        name: 'sidebar-primary-foreground',
        label: 'Primary FG',
      },
      { key: 'sidebar-accent', name: 'sidebar-accent', label: 'Accent' },
      {
        key: 'sidebar-accent-foreground',
        name: 'sidebar-accent-foreground',
        label: 'Accent FG',
      },
      { key: 'sidebar-border', name: 'sidebar-border', label: 'Border' },
      { key: 'sidebar-ring', name: 'sidebar-ring', label: 'Ring' },
    ],
  },
]

// Maps sidebar color keys to their base counterparts
const SIDEBAR_SYNC_MAP: Partial<Record<keyof ThemeStyleProps, keyof ThemeStyleProps>> = {
  sidebar: 'background',
  'sidebar-foreground': 'foreground',
  'sidebar-primary': 'primary',
  'sidebar-primary-foreground': 'primary-foreground',
  'sidebar-accent': 'accent',
  'sidebar-accent-foreground': 'accent-foreground',
  'sidebar-border': 'border',
  'sidebar-ring': 'ring',
}

// Reverse map: base key → sidebar key
const BASE_TO_SIDEBAR_MAP = Object.fromEntries(
  Object.entries(SIDEBAR_SYNC_MAP).map(([sidebar, base]) => [base, sidebar]),
) as Partial<Record<keyof ThemeStyleProps, keyof ThemeStyleProps>>

// ─── Props ───────────────────────────────────────────────────────────────────
interface ColorsTabContentProps {
  currentStyles: ThemeStyleProps
  updateStyle: <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => void
  updateStyles: (updates: Partial<ThemeStyleProps>) => void
}

// ─── Hook — sidebar sync logic (extracted for max-lines compliance) ───────────
function useSidebarSync(
  currentStyles: ThemeStyleProps,
  updateStyle: ColorsTabContentProps['updateStyle'],
  updateStyles: ColorsTabContentProps['updateStyles'],
) {
  const [sidebarSyncEnabled, setSidebarSyncEnabled] = useState(false)

  const syncSidebarToBase = useCallback(() => {
    const updates: Partial<ThemeStyleProps> = {}
    for (const [sidebarKey, baseKey] of Object.entries(SIDEBAR_SYNC_MAP)) {
      const baseValue = currentStyles[baseKey as keyof ThemeStyleProps]
      if (baseValue !== undefined) {
        ;(updates as Record<string, unknown>)[sidebarKey] = baseValue
      }
    }
    updateStyles(updates)
  }, [currentStyles, updateStyles])

  const toggleSidebarSync = useCallback(() => {
    setSidebarSyncEnabled((prev) => !prev)
  }, [])

  useEffect(() => {
    if (sidebarSyncEnabled) syncSidebarToBase()
  }, [sidebarSyncEnabled, syncSidebarToBase])

  const wrappedUpdateStyle = useCallback(
    <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => {
      if (sidebarSyncEnabled && key in BASE_TO_SIDEBAR_MAP) {
        const sidebarKey = BASE_TO_SIDEBAR_MAP[key]!
        updateStyles({ [key]: value, [sidebarKey]: value } as Partial<ThemeStyleProps>)
      } else {
        updateStyle(key, value)
      }
    },
    [updateStyle, updateStyles, sidebarSyncEnabled],
  )

  return { sidebarSyncEnabled, toggleSidebarSync, wrappedUpdateStyle }
}

// ─── SidebarSyncButton (extracted for max-lines compliance) ──────────────────
function SidebarSyncButton({
  enabled,
  onToggle,
  syncLabel,
  syncOnLabel,
  tooltipLabel,
}: {
  enabled: boolean
  onToggle: () => void
  syncLabel: string
  syncOnLabel: string
  tooltipLabel: string
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              'group h-auto px-1.5 py-0.5 text-[11px]',
              enabled ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
            )}
          >
            <RefreshCw
              className={cn(
                'size-3 transition-all group-hover:scale-110',
                enabled && 'animate-none',
              )}
              aria-hidden="true"
            />
            <span className="uppercase tracking-wider">{enabled ? syncOnLabel : syncLabel}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{tooltipLabel}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// ─── ColorsGroupList (extracted for max-lines compliance) ────────────────────
type ColorsGroupListProps = {
  groups: ColorGroup[]
  currentStyles: ThemeStyleProps
  sidebarSyncEnabled: boolean
  onToggleSidebarSync: () => void
  onUpdateStyle: <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => void
  noResultsLabel: string
  syncLabel: string
  syncOnLabel: string
  syncTooltipLabel: string
}

function ColorsGroupList({
  groups,
  currentStyles,
  sidebarSyncEnabled,
  onToggleSidebarSync,
  onUpdateStyle,
  noResultsLabel,
  syncLabel,
  syncOnLabel,
  syncTooltipLabel,
}: ColorsGroupListProps) {
  return (
    <ScrollArea className="min-h-0 flex-1 px-4">
      {groups.length === 0 && (
        <p className="text-muted-foreground py-8 text-center text-xs">{noResultsLabel}</p>
      )}
      {groups.map((group) => (
        <ControlSection
          key={group.title}
          title={group.title}
          expanded={group.expanded}
          headerAction={
            group.title === 'Sidebar' ? (
              <SidebarSyncButton
                enabled={sidebarSyncEnabled}
                onToggle={onToggleSidebarSync}
                syncLabel={syncLabel}
                syncOnLabel={syncOnLabel}
                tooltipLabel={syncTooltipLabel}
              />
            ) : undefined
          }
        >
          {group.colors.map((color) => (
            <ColorPicker
              key={color.name}
              name={color.name as FocusColorId}
              color={currentStyles[color.key] as string}
              onChange={(value) =>
                onUpdateStyle(color.key, value as ThemeStyleProps[typeof color.key])
              }
              label={color.label}
            />
          ))}
        </ControlSection>
      ))}
    </ScrollArea>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ColorsTabContent({
  currentStyles,
  updateStyle,
  updateStyles,
}: ColorsTabContentProps) {
  const t = useTranslations('theme-studio.colorsTabContent')
  const [search, setSearch] = useState('')
  const { sidebarSyncEnabled, toggleSidebarSync, wrappedUpdateStyle } = useSidebarSync(
    currentStyles,
    updateStyle,
    updateStyles,
  )

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return COLOR_GROUPS
    const query = search.toLowerCase()
    return COLOR_GROUPS.map((group) => ({
      ...group,
      expanded: true,
      colors: group.colors.filter(
        (c) =>
          c.label.toLowerCase().includes(query) ||
          c.name.toLowerCase().includes(query) ||
          group.title.toLowerCase().includes(query),
      ),
    })).filter((group) => group.colors.length > 0)
  }, [search])

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="px-4 pb-3">
        <div className="bg-muted/50 flex items-center gap-2.5 rounded-lg border px-3">
          <Search className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label={t('searchAriaLabel')}
            className="text-foreground placeholder:text-muted-foreground h-9 min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label={t('clearSearchAriaLabel')}
              className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
      <ColorsGroupList
        groups={filteredGroups}
        currentStyles={currentStyles}
        sidebarSyncEnabled={sidebarSyncEnabled}
        onToggleSidebarSync={toggleSidebarSync}
        onUpdateStyle={wrappedUpdateStyle}
        noResultsLabel={t('noColorsFound')}
        syncLabel={t('sync')}
        syncOnLabel={t('syncOn')}
        syncTooltipLabel={t('syncTooltip')}
      />
    </div>
  )
}
