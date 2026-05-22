// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/theme-preview/color-preview.tsx
// See NOTICE.md.
// ADAPT:
//   1. CopyButton → shadcn-compatible inline copy button (component not ported to platform)
//   2. TooltipWrapper → shadcn Tooltip inline
//   3. useColorControlFocus → REMOVED (store not ported; edit button deferred Chunk 7)
//   4. FocusColorId → REMOVED (store-bound type)
//   5. ThemeEditorPreviewProps → imported from lib/design/contract/theme
//   6. i18n strings → namespace theme-studio.colorPreview
//   7. 'use client' added (uses hooks)

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-color-preview",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Grid display of all theme color tokens with labels and hex values. Shows all shadcn-canonical color groups. Adapted from TweakCN color-preview.",
 *   "examples": [],
 *   "when_to_use": ["theme studio preview panel — color palette tab"],
 *   "anti_patterns": ["standalone usage without a Theme object"],
 *   "related": ["theme-studio-preview-panel", "theme-studio-components-showcase"],
 *   "vertical": null
 * }
 */
'use client'

import { useCallback } from 'react'
import { useTranslations } from 'next-intl'

import { Copy, SquarePen } from 'lucide-react'

import type { ThemeEditorPreviewProps } from '@/lib/design/contract/theme'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

// ── ColorPreviewItem ──────────────────────────────────────────────────────────

function ColorPreviewItem({ label, color, name }: { label: string; color: string; name: string }) {
  const t = useTranslations('theme-studio.colorPreview')

  const copyColor = useCallback(() => {
    void navigator.clipboard.writeText(color)
  }, [color])

  return (
    <div className="group/color-preview hover:bg-muted/60 relative flex items-center gap-2 rounded-md p-1 transition-colors">
      <div
        className="size-14 shrink-0 rounded-md border @max-3xl:size-12"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 space-y-1 overflow-hidden">
        <p className="line-clamp-2 text-sm/tight  font-medium @max-3xl:text-xs">{label}</p>
        <p className="text-muted-foreground truncate font-mono text-xs">{color}</p>
      </div>

      <div className="hidden flex-col opacity-0 transition-opacity group-hover/color-preview:opacity-100 md:flex">
        {/* Edit color: deferred Chunk 7 — requires useColorControlFocus store */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 @max-3xl:size-6 [&>svg]:size-3.5"
              disabled
              aria-label={t('editColor', { name })}
            >
              <SquarePen />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('editColor', { name })}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 @max-3xl:size-6 [&>svg]:size-3.5"
              onClick={copyColor}
              aria-label={t('copyColor')}
            >
              <Copy />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{t('copyColor')}</TooltipContent>
        </Tooltip>
      </div>
    </div>
  )
}

// ── ColorPreview ──────────────────────────────────────────────────────────────

interface ColorPreviewProps {
  styles: ThemeEditorPreviewProps['styles']
  currentMode: ThemeEditorPreviewProps['currentMode']
}

const ColorPreview = ({ styles, currentMode }: ColorPreviewProps) => {
  const t = useTranslations('theme-studio.colorPreview')

  if (!styles || !styles[currentMode]) {
    return null
  }

  return (
    <div className="@container grid grid-cols-1 gap-4 md:gap-8">
      {/* Primary Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">{t('groupPrimary')}</h3>
        <div className="@6xl grid grid-cols-1 gap-2 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label={t('background')}
            color={styles[currentMode].background}
            name="background"
          />
          <ColorPreviewItem
            label={t('foreground')}
            color={styles[currentMode].foreground}
            name="foreground"
          />
          <ColorPreviewItem
            label={t('primary')}
            color={styles[currentMode].primary}
            name="primary"
          />
          <ColorPreviewItem
            label={t('primaryForeground')}
            color={styles[currentMode]['primary-foreground']}
            name="primary-foreground"
          />
        </div>
      </div>

      {/* Secondary & Accent Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">{t('groupSecondaryAccent')}</h3>
        <div className="@6xl grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label={t('secondary')}
            color={styles[currentMode].secondary}
            name="secondary"
          />
          <ColorPreviewItem
            label={t('secondaryForeground')}
            color={styles[currentMode]['secondary-foreground']}
            name="secondary-foreground"
          />
          <ColorPreviewItem label={t('accent')} color={styles[currentMode].accent} name="accent" />
          <ColorPreviewItem
            label={t('accentForeground')}
            color={styles[currentMode]['accent-foreground']}
            name="accent-foreground"
          />
        </div>
      </div>

      {/* UI Component Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">{t('groupUI')}</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label={t('card')} color={styles[currentMode].card} name="card" />
          <ColorPreviewItem
            label={t('cardForeground')}
            color={styles[currentMode]['card-foreground']}
            name="card-foreground"
          />
          <ColorPreviewItem
            label={t('popover')}
            color={styles[currentMode].popover}
            name="popover"
          />
          <ColorPreviewItem
            label={t('popoverForeground')}
            color={styles[currentMode]['popover-foreground']}
            name="popover-foreground"
          />
          <ColorPreviewItem label={t('muted')} color={styles[currentMode].muted} name="muted" />
          <ColorPreviewItem
            label={t('mutedForeground')}
            color={styles[currentMode]['muted-foreground']}
            name="muted-foreground"
          />
        </div>
      </div>

      {/* Utility & Form Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">{t('groupUtility')}</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem label={t('border')} color={styles[currentMode].border} name="border" />
          <ColorPreviewItem label={t('input')} color={styles[currentMode].input} name="input" />
          <ColorPreviewItem label={t('ring')} color={styles[currentMode].ring} name="ring" />
        </div>
      </div>

      {/* Status & Feedback Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">{t('groupStatus')}</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label={t('destructive')}
            color={styles[currentMode].destructive}
            name="destructive"
          />
          <ColorPreviewItem
            label={t('destructiveForeground')}
            color={styles[currentMode]['destructive-foreground']}
            name="destructive-foreground"
          />
        </div>
      </div>

      {/* Chart & Data Visualization Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">{t('groupChart')}</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label={t('chart1')}
            color={styles[currentMode]['chart-1']}
            name="chart-1"
          />
          <ColorPreviewItem
            label={t('chart2')}
            color={styles[currentMode]['chart-2']}
            name="chart-2"
          />
          <ColorPreviewItem
            label={t('chart3')}
            color={styles[currentMode]['chart-3']}
            name="chart-3"
          />
          <ColorPreviewItem
            label={t('chart4')}
            color={styles[currentMode]['chart-4']}
            name="chart-4"
          />
          <ColorPreviewItem
            label={t('chart5')}
            color={styles[currentMode]['chart-5']}
            name="chart-5"
          />
        </div>
      </div>

      {/* Sidebar Colors */}
      <div className="space-y-4 @max-3xl:space-y-2">
        <h3 className="text-muted-foreground text-sm font-semibold">{t('groupSidebar')}</h3>
        <div className="grid grid-cols-1 gap-4 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
          <ColorPreviewItem
            label={t('sidebar')}
            color={styles[currentMode].sidebar}
            name="sidebar"
          />
          <ColorPreviewItem
            label={t('sidebarForeground')}
            color={styles[currentMode]['sidebar-foreground']}
            name="sidebar-foreground"
          />
          <ColorPreviewItem
            label={t('sidebarPrimary')}
            color={styles[currentMode]['sidebar-primary']}
            name="sidebar-primary"
          />
          <ColorPreviewItem
            label={t('sidebarPrimaryForeground')}
            color={styles[currentMode]['sidebar-primary-foreground']}
            name="sidebar-primary-foreground"
          />
          <ColorPreviewItem
            label={t('sidebarAccent')}
            color={styles[currentMode]['sidebar-accent']}
            name="sidebar-accent"
          />
          <ColorPreviewItem
            label={t('sidebarAccentForeground')}
            color={styles[currentMode]['sidebar-accent-foreground']}
            name="sidebar-accent-foreground"
          />
          <ColorPreviewItem
            label={t('sidebarBorder')}
            color={styles[currentMode]['sidebar-border']}
            name="sidebar-border"
          />
          <ColorPreviewItem
            label={t('sidebarRing')}
            color={styles[currentMode]['sidebar-ring']}
            name="sidebar-ring"
          />
        </div>
      </div>
    </div>
  )
}

export default ColorPreview
