// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/editor.tsx
// ADAPT:
//   1. Zustand useEditorStore / setThemeState → ThemeFormProvider (ADR-0040 §C)
//   2. DialogActionsProvider → removed (deferred Chunk 6 — dialog actions not wired yet)
//   3. use(themePromise) pattern → prop initialTheme: Theme (Chunk 7 creates page.tsx)
//   4. ActionBar → removed (deferred Chunk 7 — action-bar.tsx)
//   5. ThemeControlPanel / ThemePreviewPanel → ControlPanel / PreviewPanel (relative imports)
//   6. ResizablePanelGroup from @/components/ui/resizable (already installed Step 1.1)
//   7. useIsMobile → lib/hooks/use-mobile (already adapted)
//   8. Mobile layout: Tabs (controls/preview) preserved
//   9. Desktop layout: ResizablePanelGroup 30/70 split preserved
//   10. ThemeFormProvider wraps layout (this component IS the root of the form tree)
//   11. 'use client' preserved (Client Component — ThemeFormProvider + RHF state)
//   12. i18n: namespace theme-studio.view
// See NOTICE.md.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-view",
 *   "category": "smart",
 *   "version": "1.0.0",
 *   "description": "Root view for the theme studio — wraps ThemeFormProvider, renders responsive layout with ControlPanel (left) and PreviewPanel (right) via ResizablePanelGroup on desktop and Tabs on mobile.",
 *   "examples": [],
 *   "when_to_use": ["app/admin/theme-studio/page.tsx — pass initialTheme from server"],
 *   "anti_patterns": ["nesting inside another ThemeFormProvider", "using without initialTheme prop"],
 *   "related": ["theme-studio-control-panel", "theme-studio-preview-panel", "theme-studio-form-provider"],
 *   "vertical": null
 * }
 */
'use client'

import { useTranslations } from 'next-intl'

import { Sliders } from 'lucide-react'

import { type Theme } from '@/lib/design/contract/theme'

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useIsMobile } from '@/hooks/use-mobile'

import ControlPanel from '../../../components/admin/theme-studio/control-panel'
import PreviewPanel from '../../../components/admin/theme-studio/preview-panel'
import { ThemeFormProvider } from './_state/theme-form-provider'

// ─── Props ───────────────────────────────────────────────────────────────────
interface ThemeStudioViewProps {
  /** Initial theme loaded server-side by page.tsx (Chunk 7). */
  initialTheme: Theme
  /**
   * Optional persist callback — called after each debounced history push.
   * page.tsx wires this to a server action (Chunk 7).
   */
  onPersistChange?: (theme: Theme) => void
}

// ─── Helper: isThemeStyles guard ─────────────────────────────────────────────
// Mirrors tweakcn-ref/components/editor/editor.tsx isThemeStyles (Apache-2.0).
function isValidTheme(value: unknown): value is Theme {
  return (
    !!value && typeof value === 'object' && value !== null && 'light' in value && 'dark' in value
  )
}

// ─── Component ───────────────────────────────────────────────────────────────
export function ThemeStudioView({ initialTheme, onPersistChange }: ThemeStudioViewProps) {
  const t = useTranslations('theme-studio.view')
  const isMobile = useIsMobile()

  if (!isValidTheme(initialTheme)) {
    return (
      <div className="text-destructive flex h-full items-center justify-center">
        {t('invalidThemeData')}
      </div>
    )
  }

  // Mobile layout: Tabs (controls / preview) stacked
  if (isMobile) {
    return (
      <ThemeFormProvider initialTheme={initialTheme} onPersistChange={onPersistChange}>
        <div className="relative isolate flex flex-1 overflow-hidden">
          <div className="size-full flex-1 overflow-hidden">
            <Tabs defaultValue="controls" className="h-full">
              <TabsList className="w-full rounded-none">
                <TabsTrigger value="controls" className="flex-1">
                  <Sliders className="mr-2 size-4 " aria-hidden="true" />
                  {t('controlsTab')}
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex-1">
                  {t('previewTab')}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="controls" className="mt-0 h-[calc(100%-2.5rem)]">
                <div className="flex h-full flex-col">
                  <ControlPanel />
                </div>
              </TabsContent>
              <TabsContent value="preview" className="mt-0 h-[calc(100%-2.5rem)]">
                <div className="flex h-full flex-col">
                  {/* ActionBar deferred Chunk 7 */}
                  <PreviewPanel />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </ThemeFormProvider>
    )
  }

  // Desktop layout: ResizablePanelGroup 30/70
  return (
    <ThemeFormProvider initialTheme={initialTheme} onPersistChange={onPersistChange}>
      <div className="relative isolate flex flex-1 overflow-hidden">
        <div className="size-full">
          <ResizablePanelGroup orientation="horizontal" className="isolate">
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40} className="z-1">
              <div className="relative isolate flex h-full flex-1 flex-col overflow-hidden">
                <ControlPanel />
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={70}>
              <div className="flex h-full flex-col">
                <div className="flex min-h-0 flex-1 flex-col">
                  {/* ActionBar deferred Chunk 7 */}
                  <PreviewPanel />
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </ThemeFormProvider>
  )
}
