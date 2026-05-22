// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/theme-preview-panel.tsx
// ADAPT:
//   1. Zustand useEditorStore → useThemeFormContext() (ADR-0040 §C)
//   2. useDialogActions / useFullscreen / useThemeInspector → STUB local state (deferred Chunk 6)
//   3. Sub-components (InspectorOverlay, ColorPreview, ExamplesPreviewContainer,
//      DemoCards, DemoMail, DemoDashboard, DemoPricing, TypographyDemo, CustomDemo)
//      → STUB inline placeholder per briefing §4.4 (Chunk 6 creates real sub-components)
//   4. HorizontalScrollArea + TabsTriggerPill → relative imports (theme-studio primitives)
//   5. V0Logo + "Open in v0" → removed (v0 demoted ADR-0045 D.1)
//   6. ShadcnBlocksLogo → removed (external branding not applicable to platform)
//   7. useQueryState (nuqs) for active preview tab preserved
//   8. Fullscreen toggle → stub with local useState (useFullscreen deferred Chunk 6)
//   9. Inspector toggle → stub (useThemeInspector deferred Chunk 6)
//   10. i18n strings → namespace theme-studio.previewPanel
//   11. 'use client' directive preserved (Next 16 App Router)
// See NOTICE.md.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-preview-panel",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Right-side preview panel for the theme studio — tabs for cards/dashboard/mail/pricing/colors/typography with fullscreen and inspector toggles. Sub-component previews are stubs until Chunk 6.",
 *   "examples": [],
 *   "when_to_use": ["theme studio view — right panel"],
 *   "anti_patterns": ["standalone usage outside ThemeFormProvider tree"],
 *   "related": ["theme-studio-control-panel", "theme-studio-view"],
 *   "vertical": null
 * }
 */
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { Inspect, Maximize, Minimize, MoreVertical } from 'lucide-react'
import { useQueryState } from 'nuqs'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'

import { HorizontalScrollArea } from './horizontal-scroll-area'
import TabsTriggerPill from './tabs-trigger-pill'

// ─── Preview sub-component stubs (Chunk 6 creates real implementations) ───────
// Source: tweakcn-ref/components/editor/theme-preview/
// Full implementations deferred to Chunk 6 per briefing §4.4

function PreviewStub({ label }: { label: string }) {
  return (
    <div className="text-muted-foreground flex size-full items-center justify-center p-8 text-center text-sm">
      {label}
    </div>
  )
}

// ─── PreviewTabsContent — tab body (extracted for max-lines compliance) ───────
function PreviewTabsContent({ deferredLabel }: { deferredLabel: string }) {
  return (
    <>
      <TabsContent value="cards" className="m-0 size-full">
        <ScrollArea className="size-full">
          <PreviewStub label={deferredLabel} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="custom" className="@container m-0 size-full">
        <PreviewStub label={deferredLabel} />
      </TabsContent>
      <TabsContent value="dashboard" className="@container m-0 size-full">
        <ScrollArea className="size-full">
          <div className="size-full min-w-[1400px]">
            <PreviewStub label={deferredLabel} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="pricing" className="@container mt-0 h-full space-y-6">
        <ScrollArea className="size-full">
          <PreviewStub label={deferredLabel} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="mail" className="@container m-0 size-full">
        <ScrollArea className="size-full">
          <div className="size-full min-w-[1300px] rounded-lg border">
            <PreviewStub label={deferredLabel} />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="typography" className="m-0 size-full">
        <ScrollArea className="size-full">
          <PreviewStub label={deferredLabel} />
        </ScrollArea>
      </TabsContent>
      <TabsContent value="colors" className="m-0 size-full">
        <ScrollArea className="size-full">
          <div className="p-4">
            <PreviewStub label={deferredLabel} />
          </div>
        </ScrollArea>
      </TabsContent>
    </>
  )
}

// ─── PreviewToolbar (extracted for max-lines compliance) ─────────────────────
function PreviewToolbar({
  onTabChange,
  inspectorEnabled,
  onToggleInspector,
  isFullscreen,
  onToggleFullscreen,
}: {
  onTabChange: (value: string) => void
  inspectorEnabled: boolean
  onToggleInspector: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}) {
  const t = useTranslations('theme-studio.previewPanel')
  return (
    <HorizontalScrollArea className="mt-2 mb-1 flex w-full items-center justify-between px-4">
      <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
        <TabsTriggerPill value="custom">{t('tabs.custom')}</TabsTriggerPill>
        <TabsTriggerPill value="cards">{t('tabs.cards')}</TabsTriggerPill>
        <div className="hidden md:flex">
          <TabsTriggerPill value="dashboard">{t('tabs.dashboard')}</TabsTriggerPill>
          <TabsTriggerPill value="mail">{t('tabs.mail')}</TabsTriggerPill>
        </div>
        <TabsTriggerPill value="pricing">{t('tabs.pricing')}</TabsTriggerPill>
        <TabsTriggerPill value="colors">{t('tabs.colorPalette')}</TabsTriggerPill>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('morePreviews')}>
              <MoreVertical aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onTabChange('typography')}>
              {t('tabs.typography')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TabsList>
      <div className="flex items-center gap-0.5">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleInspector}
          aria-label={t('toggleInspector')}
          className={cn(
            'group size-8',
            inspectorEnabled && 'bg-accent text-accent-foreground w-auto',
          )}
        >
          <Inspect className="transition-all group-hover:scale-110" aria-hidden="true" />
          {inspectorEnabled && (
            <span className="text-xs uppercase tracking-wide">{t('inspectorOn')}</span>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          aria-label={isFullscreen ? t('exitFullscreen') : t('enterFullscreen')}
          className="group hidden size-8 md:inline-flex"
        >
          {isFullscreen ? (
            <Minimize className="transition-all group-hover:scale-110" aria-hidden="true" />
          ) : (
            <Maximize className="transition-all group-hover:scale-110" aria-hidden="true" />
          )}
        </Button>
      </div>
    </HorizontalScrollArea>
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
const PreviewPanel = () => {
  const t = useTranslations('theme-studio.previewPanel')
  const [activeTab, setActiveTab] = useQueryState('p', { defaultValue: 'cards' })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [inspectorEnabled, setInspectorEnabled] = useState(false)

  return (
    <>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col',
          isFullscreen && 'bg-background fixed inset-0 z-50',
        )}
      >
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <PreviewToolbar
            onTabChange={(v) => {
              void setActiveTab(v)
            }}
            inspectorEnabled={inspectorEnabled}
            onToggleInspector={() => setInspectorEnabled((p) => !p)}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen((p) => !p)}
          />
          <section
            className={cn(
              'relative size-full overflow-hidden',
              activeTab === 'cards' ? 'pb-4' : 'p-4 pt-1',
            )}
          >
            <div
              className={cn(
                'relative isolate size-full overflow-hidden',
                activeTab !== 'cards' && 'rounded-lg',
              )}
            >
              <PreviewTabsContent deferredLabel={t('previewSubComponentsDeferred')} />
            </div>
          </section>
        </Tabs>
      </div>
      {/* InspectorOverlay stub — deferred Chunk 6 */}
      {/* Full: tweakcn-ref/components/editor/inspector-overlay.tsx */}
    </>
  )
}

export default PreviewPanel
