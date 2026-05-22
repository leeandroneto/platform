// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/contrast-checker.tsx (WCAG → APCA Silver)
/**
 * @registry-meta
 * @kind theme-studio-contrast-checker
 * @namespace @desafit
 * @level L2
 * @category smart-block
 * @composition []
 * @vertical null
 * @ai-hints []
 */

'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useTheme } from 'next-themes'

import { AlertTriangle, Check, Contrast, Moon, Sun } from 'lucide-react'

import type { ThemeStyleProps } from '@/lib/design/contract/theme'
import {
  APCA_BODY_THRESHOLD,
  APCA_LARGE_THRESHOLD,
  APCA_NON_TEXT_THRESHOLD,
  useContrastChecker,
} from '@/lib/hooks/use-contrast-checker'
import { cn } from '@/lib/utils'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

import { useThemeFormContext } from '@/app/admin/theme-studio/_state/theme-form-provider'

import { type ColorCategory, PAIR_SEEDS } from './contrast-checker-pairs'

// ─── Types ───────────────────────────────────────────────────────────────────

type ColorPair = {
  id: string
  foregroundId: keyof ThemeStyleProps
  backgroundId: keyof ThemeStyleProps
  foreground: string | undefined
  background: string | undefined
  label: string
  category: ColorCategory
}

type T = ReturnType<typeof useTranslations<'theme-studio.contrastChecker'>>

function hydrateColorPairs(styles: ThemeStyleProps): ColorPair[] {
  return PAIR_SEEDS.map((s) => ({
    id: s.id,
    foregroundId: s.fgKey,
    backgroundId: s.bgKey,
    foreground: styles[s.fgKey],
    background: styles[s.bgKey],
    label: s.label,
    category: s.category,
  }))
}

// ─── ApcaThresholdBadge — compact pass/fail for a single tier ────────────────

function ApcaThresholdBadge({
  lc,
  threshold,
  label,
  thresholdDisplay,
}: {
  lc: number
  threshold: number
  label: string
  thresholdDisplay: string
}) {
  const passes = lc >= threshold
  return (
    <span
      className={cn(
        'inline-flex items-center gap-0.5 rounded-sm px-1.5 py-0.5 text-[10px] font-medium',
        passes
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      )}
      aria-label={`${label} ${passes ? 'pass' : 'fail'} (${thresholdDisplay})`}
    >
      {passes ? <Check className="size-2.5" /> : <AlertTriangle className="size-2.5" />}
      {label}
    </span>
  )
}

// ─── ColorSwatchColumn — background + foreground color swatches ──────────────

function ColorSwatchColumn({ pair, t }: { pair: ColorPair; t: T }) {
  return (
    <div className="flex flex-1 flex-col items-center gap-3">
      <div className="flex w-full items-center gap-3">
        <div
          style={{ backgroundColor: pair.background ?? '#000000' }}
          className="size-12 shrink-0 rounded-md border shadow-sm"
          aria-hidden="true"
        />
        <div className="flex flex-col">
          <span className="text-xs font-medium">{t('backgroundLabel')}</span>
          <span className="text-muted-foreground font-mono text-xs">{pair.background}</span>
        </div>
      </div>
      <div className="flex w-full items-center gap-3">
        <div
          style={{ backgroundColor: pair.foreground ?? '#ffffff' }}
          className="size-12 shrink-0 rounded-md border shadow-sm"
          aria-hidden="true"
        />
        <div className="flex flex-col">
          <span className="text-xs font-medium">{t('foregroundLabel')}</span>
          <span className="text-muted-foreground font-mono text-xs">{pair.foreground}</span>
        </div>
      </div>
    </div>
  )
}

// ─── ColorPreviewBox — text sample on actual bg color ────────────────────────

function ColorPreviewBox({ pair, t }: { pair: ColorPair; t: T }) {
  return (
    <div
      style={{ backgroundColor: pair.background ?? 'transparent' }}
      className="flex h-full min-h-[120px] flex-1 items-center justify-center overflow-hidden rounded-lg border shadow-sm"
    >
      {pair.foreground && pair.background ? (
        <div className="p-4 text-center">
          <p style={{ color: pair.foreground }} className="mb-2 text-4xl font-bold tracking-wider">
            {t('sampleGlyph')}
          </p>
          <p style={{ color: pair.foreground }} className="text-sm font-medium">
            {t('sampleText')}
          </p>
        </div>
      ) : (
        <p className="text-muted-foreground text-xs">{t('previewLabel')}</p>
      )}
    </div>
  )
}

// ─── ColorPairCard — single color pair result card ───────────────────────────

function ColorPairCard({ pair, lc, t }: { pair: ColorPair; lc: number | undefined; t: T }) {
  const absLc = lc ?? 0
  const isValid = lc !== undefined && absLc >= APCA_NON_TEXT_THRESHOLD

  const badge =
    lc !== undefined ? (
      <Badge
        variant={isValid ? 'default' : 'destructive'}
        className={cn(
          'flex items-center gap-1 text-xs',
          isValid ? 'bg-muted text-muted-foreground' : 'bg-destructive text-destructive-foreground',
        )}
      >
        {isValid ? <Check className="size-3" /> : <AlertTriangle className="size-3" />}
        <span>
          {t('lcUnit')} {absLc.toFixed(0)}
        </span>
      </Badge>
    ) : (
      <Badge variant="outline" className="text-xs">
        {t('noData')}
      </Badge>
    )

  return (
    <Card className={cn('transition-all duration-200', !isValid && 'border-dashed')}>
      <CardContent className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className={cn('flex items-center font-medium', !isValid && 'text-destructive')}>
            {pair.label}
            {!isValid && <AlertTriangle className="ml-1 size-3.5" />}
          </h3>
          {badge}
        </div>
        {lc !== undefined && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            <ApcaThresholdBadge
              lc={absLc}
              threshold={APCA_BODY_THRESHOLD}
              label={t('passBody')}
              thresholdDisplay={t('thresholdBody')}
            />
            <ApcaThresholdBadge
              lc={absLc}
              threshold={APCA_LARGE_THRESHOLD}
              label={t('passLarge')}
              thresholdDisplay={t('thresholdLarge')}
            />
            <ApcaThresholdBadge
              lc={absLc}
              threshold={APCA_NON_TEXT_THRESHOLD}
              label={t('passNonText')}
              thresholdDisplay={t('thresholdNonText')}
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          <ColorSwatchColumn pair={pair} t={t} />
          <ColorPreviewBox pair={pair} t={t} />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── CategorySection — one category group ────────────────────────────────────

function CategorySection({
  label,
  pairs,
  getContrastLc,
  t,
}: {
  label: string
  pairs: ColorPair[]
  getContrastLc: (id: string) => number | undefined
  t: T
}) {
  return (
    <div>
      <div className="bg-background sticky -top-px z-10 flex items-center gap-2 pb-4 sm:rounded-b-xl">
        <h2 className="text-base font-semibold">{label}</h2>
        <Separator className="flex-1" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {pairs.map((pair) => (
          <ColorPairCard key={pair.id} pair={pair} lc={getContrastLc(pair.id)} t={t} />
        ))}
      </div>
    </div>
  )
}

// ─── ThemeToggleButton ────────────────────────────────────────────────────────

function ThemeToggleButton({
  currentTheme,
  onToggle,
  t,
}: {
  currentTheme: string | undefined
  onToggle: () => void
  t: T
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm" onClick={onToggle} aria-label={t('toggleTheme')}>
          {currentTheme === 'light' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-xs">{t('toggleTheme')}</p>
      </TooltipContent>
    </Tooltip>
  )
}

// ─── CheckerToolbar — header + filter controls inside the dialog ─────────────

function CheckerToolbar({
  filter,
  totalIssues,
  onFilterAll,
  onFilterIssues,
  theme,
  onToggleTheme,
  t,
}: {
  filter: 'all' | 'issues'
  totalIssues: number
  onFilterAll: () => void
  onFilterIssues: () => void
  theme: string | undefined
  onToggleTheme: () => void
  t: T
}) {
  return (
    <div className="flex flex-col items-end justify-between gap-4 px-6 sm:flex-row">
      <DialogHeader className="text-left">
        <DialogTitle>{t('title')}</DialogTitle>
        <DialogDescription>
          {t('description')}
          {' • '}
          <a
            href="https://git.apcacontrast.com/documentation/README"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 underline transition-colors"
          >
            {t('learnMore')}
          </a>
        </DialogDescription>
      </DialogHeader>
      <div className="hidden items-center gap-2 md:flex">
        <ThemeToggleButton currentTheme={theme} onToggle={onToggleTheme} t={t} />
        <Button variant={filter === 'all' ? 'default' : 'outline'} size="sm" onClick={onFilterAll}>
          {t('filterAll')}
        </Button>
        <Button
          size="sm"
          disabled={totalIssues === 0}
          variant={filter === 'issues' ? 'default' : 'outline'}
          onClick={onFilterIssues}
        >
          <AlertTriangle className="mr-1 size-3" />
          {t('filterIssues', { count: totalIssues })}
        </Button>
      </div>
    </div>
  )
}

// ─── CheckerBody — grouped category sections in a scroll area ────────────────

function CheckerBody({
  filteredPairs,
  getContrastLc,
  t,
}: {
  filteredPairs: ColorPair[]
  getContrastLc: (id: string) => number | undefined
  t: T
}) {
  const categoryLabels: Record<ColorCategory, string> = {
    content: t('categoryContent'),
    interactive: t('categoryInteractive'),
    functional: t('categoryFunctional'),
  }
  const groups = (['content', 'interactive', 'functional'] as ColorCategory[])
    .map((cat) => ({
      cat,
      label: categoryLabels[cat],
      pairs: filteredPairs.filter((p) => p.category === cat),
    }))
    .filter((g) => g.pairs.length > 0)

  return (
    <ScrollArea className="relative flex flex-1 flex-col">
      <div className="space-y-6 px-6">
        {groups.map((g) => (
          <CategorySection
            key={g.cat}
            label={g.label}
            pairs={g.pairs}
            getContrastLc={getContrastLc}
            t={t}
          />
        ))}
      </div>
    </ScrollArea>
  )
}

// ─── ContrastChecker (main export) ───────────────────────────────────────────

export function ContrastChecker() {
  const t = useTranslations('theme-studio.contrastChecker')
  const [filter, setFilter] = useState<'all' | 'issues'>('all')
  const { theme, setTheme } = useTheme()
  const { themeState } = useThemeFormContext()

  const currentMode = theme === 'dark' ? 'dark' : 'light'
  const colorPairs = hydrateColorPairs(themeState[currentMode])
  const validPairs = colorPairs.filter(
    (p): p is ColorPair & { foreground: string; background: string } =>
      !!p.foreground && !!p.background,
  )
  const contrastResults = useContrastChecker(validPairs)
  const getContrastLc = (id: string) => contrastResults.find((r) => r.id === id)?.contrastRatio
  const totalIssues = contrastResults.filter(
    (r) => r.contrastRatio < APCA_NON_TEXT_THRESHOLD,
  ).length
  const filteredPairs =
    filter === 'all'
      ? colorPairs
      : colorPairs.filter((p) => {
          const lc = getContrastLc(p.id)
          return lc !== undefined && lc < APCA_NON_TEXT_THRESHOLD
        })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start px-2">
          <Contrast className="size-4" />
          <span className="text-sm">{t('trigger')}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[95dvh] flex-col gap-0 space-y-6 overflow-hidden shadow-lg sm:max-h-[min(700px,85dvh)] sm:w-[calc(100%-2rem)] sm:max-w-4xl sm:pt-6">
        <CheckerToolbar
          filter={filter}
          totalIssues={totalIssues}
          onFilterAll={() => setFilter('all')}
          onFilterIssues={() => setFilter('issues')}
          theme={theme}
          onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          t={t}
        />
        <CheckerBody filteredPairs={filteredPairs} getContrastLc={getContrastLc} t={t} />
      </DialogContent>
    </Dialog>
  )
}

export default ContrastChecker
