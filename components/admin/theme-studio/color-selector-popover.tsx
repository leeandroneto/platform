// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/color-selector-popover.tsx
/**
 * @registry-meta
 * @kind theme-studio-color-selector-popover
 * @namespace @desafit
 * @level L2
 * @category smart-block
 * @composition []
 * @vertical null
 * @ai-hints []
 */

'use client'

import { useCallback, useState } from 'react'
import { useTranslations } from 'next-intl'

import { formatHex, parse } from 'culori'
import { Check, LayoutGrid, List } from 'lucide-react'
// ── TailwindCSS icon ─────────────────────────────────────────────────────────
// Adapted from tweakcn-ref/components/icons/tailwind-css.tsx (Apache-2.0).
// Inlined: projeto não tem components/icons/* (surgical delete ADR-0044).
// NÃO criar components/icons/tailwind-css.tsx fora do escopo Bundle A.
import type { ComponentProps, SVGProps } from 'react'

import { TAILWIND_PALETTE } from '@/lib/design/tailwind-colors'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function TailwindCSS({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 54 33"
      className={cn('text-[#38bdf8]', className)}
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h54v32.4H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}

// ── TooltipWrapper ───────────────────────────────────────────────────────────
// Adapted from tweakcn-ref/components/tooltip-wrapper.tsx (Apache-2.0).
// Inlined: projeto não tem components/tooltip-wrapper.tsx (surgical delete ADR-0044).
// NÃO criar fora do escopo Bundle A.

function TooltipWrapper({
  label,
  command,
  className,
  children,
  ...props
}: ComponentProps<typeof TooltipTrigger> & {
  label: string
  command?: React.ReactNode
}) {
  return (
    <Tooltip key={label}>
      <TooltipTrigger className={cn(className)} {...props}>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <span className="flex items-center gap-[1ch]">
          {label}
          {command && (
            <kbd className="bg-muted text-muted-foreground flex items-center gap-[0.5ch] rounded-sm px-1.5 py-0.5 font-mono text-xs [&>svg]:size-3">
              {command}
            </kbd>
          )}
        </span>
      </TooltipContent>
    </Tooltip>
  )
}

// ── ColorSelectorTab / usePreferencesStore ───────────────────────────────────
// Adapted from tweakcn-ref/store/preferences-store.ts (Apache-2.0).
// Original usa Zustand persist; aqui usamos useState + localStorage
// (stack travada CLAUDE.md: sem Zustand). Comportamento 100% preservado.
export type ColorSelectorTab = 'list' | 'palette'

const PREFS_KEY = 'theme-studio-color-selector-tab'

function getStoredTab(): ColorSelectorTab {
  if (typeof window === 'undefined') return 'list'
  try {
    const stored = localStorage.getItem(PREFS_KEY)
    if (stored === 'list' || stored === 'palette') return stored
  } catch {
    // localStorage not available (SSR or private mode)
  }
  return 'list'
}

function useColorSelectorTab() {
  // Lazy initializer reads localStorage on first render (client-only, avoids
  // SSR mismatch). This replaces a useEffect+setState pattern that would
  // trigger a cascading render (react-hooks/set-state-in-effect).
  const [tab, setTabState] = useState<ColorSelectorTab>(getStoredTab)

  const setTab = useCallback((value: ColorSelectorTab) => {
    setTabState(value)
    try {
      localStorage.setItem(PREFS_KEY, value)
    } catch {
      // ignore
    }
  }, [])

  return { tab, setTab }
}

// ── ColorSelectorPopover ─────────────────────────────────────────────────────

type ColorSelectorPopoverProps = {
  currentColor: string
  onChange: (color: string) => void
}

// ── Sub-helpers extracted to keep ColorSelectorPopover under 80 LOC ──────────

function useColorCompare(currentColor: string) {
  const toHex = (c: string) => formatHex(parse(c))
  return useCallback(
    (color: string) => {
      try {
        return toHex(currentColor) === toHex(color)
      } catch {
        return currentColor === color
      }
    },
    [currentColor],
  )
}

type ColorListTabProps = {
  isColorSelected: (color: string) => boolean
  onSelect: (color: string) => void
  searchPlaceholder: string
  emptyText: string
}

function ColorListTab({
  isColorSelected,
  onSelect,
  searchPlaceholder,
  emptyText,
}: ColorListTabProps) {
  return (
    <TabsContent value="list" className="my-0 min-w-[300px]">
      <Command className="flex h-84 flex-col">
        <CommandInput className="h-10" placeholder={searchPlaceholder} />
        <ScrollArea className="flex-1 overflow-hidden">
          <CommandEmpty className="text-muted-foreground p-4 text-center">{emptyText}</CommandEmpty>

          {Object.entries(TAILWIND_PALETTE).map(([key, colors]) => {
            const colorName = key.charAt(0).toUpperCase() + key.slice(1)
            return (
              <CommandGroup heading={colorName} key={key}>
                {Object.entries(colors).map(([shade, color]) => {
                  const isSelected = isColorSelected(color)
                  return (
                    <CommandItem
                      key={color}
                      onSelect={() => onSelect(color)}
                      className="flex items-center gap-2"
                    >
                      <ColorSwatch
                        color={color}
                        name={shade === 'DEFAULT' ? key : `${key}-${shade}`}
                        isSelected={isSelected}
                        size="md"
                      />
                      <span>{shade === 'DEFAULT' ? key : `${key}-${shade}`}</span>
                      {isSelected && <Check className="ml-auto size-4 opacity-70" />}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </ScrollArea>
      </Command>
    </TabsContent>
  )
}

function ColorPaletteTab({
  isColorSelected,
  onSelect,
}: {
  isColorSelected: (color: string) => boolean
  onSelect: (color: string) => void
}) {
  return (
    <TabsContent value="palette" className="my-0 w-full">
      <ScrollArea className="h-84 w-full">
        <div className="flex flex-col gap-0.5 p-1">
          {Object.entries(TAILWIND_PALETTE).map(([key, colors]) => {
            return (
              <div key={key} className="flex gap-0.5">
                {Object.entries(colors).map(([shade, color]) => {
                  return (
                    <ColorSwatch
                      key={`${key}-${shade}`}
                      name={shade === 'DEFAULT' ? key : `${key}-${shade}`}
                      color={color}
                      isSelected={isColorSelected(color)}
                      onClick={() => onSelect(color)}
                      className="rounded-none"
                      size="md"
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </TabsContent>
  )
}

export function ColorSelectorPopover({ currentColor, onChange }: ColorSelectorPopoverProps) {
  const t = useTranslations('theme-studio.colorPicker')

  const handleColorSelect = useCallback(
    (color: string) => {
      onChange(color)
    },
    [onChange],
  )

  const { tab: colorSelectorTab, setTab: setColorSelectorTab } = useColorSelectorTab()

  const handleTabChange = useCallback(
    (value: string) => {
      setColorSelectorTab(value as ColorSelectorTab)
    },
    [setColorSelectorTab],
  )

  const isColorSelected = useColorCompare(currentColor)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <TooltipWrapper asChild label="Tailwind Colors">
          <Button
            variant="ghost"
            size="sm"
            className="group bg-input/25 size-7 rounded-sm border shadow-none"
          >
            <TailwindCSS className="text-foreground group-hover:text-accent-foreground size-4 transition-colors" />
          </Button>
        </TooltipWrapper>
      </PopoverTrigger>

      <PopoverContent className="size-auto gap-0 overflow-hidden p-0" align="end">
        <Tabs defaultValue={colorSelectorTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between gap-4">
            <div className="ml-2 flex items-center gap-1.5">
              <TailwindCSS className="size-4" />
              <span className="text-muted-foreground text-sm tabular-nums">
                {t('tailwindVersion')}
              </span>
            </div>

            <TabsList className="bg-transparent">
              <TabsTrigger
                value="list"
                className="data-[state=active]:bg-input/25 size-8 p-0 data-[state=active]:shadow-none"
              >
                <List className="size-4" />
              </TabsTrigger>
              <TabsTrigger
                value="palette"
                className="data-[state=active]:bg-input/25 size-8 p-0 data-[state=active]:shadow-none"
              >
                <LayoutGrid className="size-4" />
              </TabsTrigger>
            </TabsList>
          </div>
          <Separator />

          <ColorListTab
            isColorSelected={isColorSelected}
            onSelect={handleColorSelect}
            searchPlaceholder={t('tailwindSearch')}
            emptyText={t('tailwindNotFound')}
          />
          <ColorPaletteTab isColorSelected={isColorSelected} onSelect={handleColorSelect} />
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

interface ColorSwatchProps extends React.HTMLAttributes<HTMLButtonElement> {
  isSelected: boolean
  color: string
  name: string
  size?: 'sm' | 'md' | 'lg'
}

function ColorSwatch({
  color,
  name,
  className,
  isSelected,
  size = 'sm',
  ...props
}: ColorSwatchProps) {
  const sizeClasses = {
    sm: 'size-5',
    md: 'size-6',
    lg: 'size-8',
  }

  const isTransparent = color === 'transparent'

  return (
    <button
      aria-label={`Select color ${name}`}
      title={name}
      className={cn(
        'group relative cursor-pointer rounded-md border transition-all hover:z-10 hover:scale-110 hover:shadow-lg',
        isTransparent
          ? 'bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-size-[8px_8px] bg-position-[0_0,0_4px,4px_-4px,-4px_0px]'
          : 'bg-(--color)',
        sizeClasses[size],
        isSelected && (isTransparent ? 'ring-2 ring-border' : 'ring-2 ring-(--color)'),
        className,
      )}
      style={!isTransparent ? ({ '--color': color } as React.CSSProperties) : undefined}
      {...props}
    >
      <div className="group-hover:ring-foreground/50 absolute inset-0 rounded-[inherit] ring-2 ring-transparent transition-all duration-200" />
    </button>
  )
}
