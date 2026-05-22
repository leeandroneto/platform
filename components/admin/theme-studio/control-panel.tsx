// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/theme-control-panel.tsx
// ADAPT:
//   1. Zustand useEditorStore → useThemeFormContext() (ADR-0040 §C)
//   2. useAIThemeGenerationCore (Zustand-bound boolean) → prop aiEnabled?: boolean default false
//   3. FontPicker → STUB inline (font picker deferred Chunk 6 — complex Google Fonts API dependency)
//   4. ThemePresetSelect → STUB inline (preset select deferred Chunk 6 — requires preset registry)
//   5. HorizontalScrollArea + TabsTriggerPill → relative imports ./horizontal-scroll-area ./tabs-trigger-pill
//   6. ColorsTabContent → relative import ./colors-tab-content
//   7. AiTabContent → relative import ./ai-tab-content
//   8. HslControls → relative import ./hsl-controls (was HslAdjustmentControls)
//   9. ShadowControl → relative import ./shadow-control
//   10. SliderWithInput → relative import ./slider-with-input
//   11. ControlSection → relative import ./control-section
//   12. COMMON_STYLES + DEFAULT_THEME from @/lib/design/theme-defaults
//   13. updateStyle / updateStyles derived from useThemeFormContext().setThemeStyle
//   14. i18n strings → namespace theme-studio.controlPanel
//   15. 'use client' directive preserved (Next 16 App Router)
//   16. buildFontFamily + getAppliedThemeFont → STUB (deferred with FontPicker)
// See NOTICE.md.

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-control-panel",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Left-side control panel for the theme studio — tabs for colors, typography, other (HSL/radius/shadow/spacing) and AI (stub). Consumes ThemeFormContext.",
 *   "examples": [],
 *   "when_to_use": ["theme studio view — left panel"],
 *   "anti_patterns": ["standalone usage outside ThemeFormProvider tree"],
 *   "related": ["theme-studio-colors-tab-content", "theme-studio-hsl-controls", "theme-studio-shadow-control", "theme-studio-preview-panel"],
 *   "vertical": null
 * }
 */
'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

import { AlertCircle, Sparkle } from 'lucide-react'

import { type ThemeStyleProps } from '@/lib/design/contract/theme'
import { COMMON_STYLES, DEFAULT_THEME } from '@/lib/design/theme-defaults'
import { type ControlTab, useControlsTabFromUrl } from '@/lib/hooks/use-controls-tab-from-url'
import { cn } from '@/lib/utils'

import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'

import { useThemeFormContext } from '@/app/admin/theme-studio/_state/theme-form-provider'

import { AiTabContent } from './ai-tab-content'
import { ColorsTabContent } from './colors-tab-content'
import ControlSection from './control-section'
import { HorizontalScrollArea } from './horizontal-scroll-area'
import HslControls from './hsl-controls'
import ShadowControl from './shadow-control'
import { SliderWithInput } from './slider-with-input'
import TabsTriggerPill from './tabs-trigger-pill'

// ─── FontPicker stub (deferred Chunk 6 — Google Fonts API + useFontSearch hook) ─
// Full implementation: tweakcn-ref/components/editor/font-picker.tsx
// Activation trigger: Chunk 6 typography sub-components + font registry
function FontPickerStub({
  value,
  placeholder,
  category: _category,
  onSelect: _onSelect,
}: {
  value?: string
  placeholder: string
  category: 'sans-serif' | 'serif' | 'monospace'
  onSelect: (font: { family: string; category: string }) => void
}) {
  return (
    <div
      className="border-input bg-background text-muted-foreground flex h-9 w-full items-center rounded-md border px-3 text-sm opacity-60"
      title={placeholder}
    >
      <span className="truncate">{value ?? placeholder}</span>
    </div>
  )
}

// ─── ThemePresetSelect stub (deferred Chunk 6 — preset registry + URL state) ──
// Full implementation: tweakcn-ref/components/editor/theme-preset-select.tsx
function ThemePresetSelectStub({
  className,
  disabled: _disabled,
}: {
  className?: string
  disabled?: boolean
}) {
  return (
    <div
      className={cn(
        'border-b flex h-14 items-center px-4 text-sm text-muted-foreground',
        className,
      )}
    >
      {/* Preset selector deferred Chunk 6 */}
    </div>
  )
}

// ─── Shared update-style types (used by tab sub-components) ─────────────────
type UpdateStyleFn = <K extends keyof ThemeStyleProps>(key: K, value: ThemeStyleProps[K]) => void
type UpdateStylesFn = (updates: Partial<ThemeStyleProps>) => void

// ─── Hook — state extraction ─────────────────────────────────────────────────
function useControlPanelState() {
  const { themeState, setThemeStyle } = useThemeFormContext()
  const currentMode = 'light' as const

  const currentStyles = React.useMemo(
    () => ({ ...DEFAULT_THEME[currentMode], ...themeState[currentMode] }),
    [currentMode, themeState],
  )

  const updateStyle: UpdateStyleFn = React.useCallback(
    (key, value) => {
      if (COMMON_STYLES.includes(key as (typeof COMMON_STYLES)[number])) {
        setThemeStyle(`light.${key}` as Parameters<typeof setThemeStyle>[0], value as never)
        setThemeStyle(`dark.${key}` as Parameters<typeof setThemeStyle>[0], value as never)
        return
      }
      setThemeStyle(`${currentMode}.${key}` as Parameters<typeof setThemeStyle>[0], value as never)
    },
    [setThemeStyle, currentMode],
  )

  const updateStyles: UpdateStylesFn = React.useCallback(
    (updates) => {
      for (const [key, value] of Object.entries(updates)) {
        setThemeStyle(
          `${currentMode}.${key}` as Parameters<typeof setThemeStyle>[0],
          value as never,
        )
      }
    },
    [setThemeStyle, currentMode],
  )

  return { currentStyles, updateStyle, updateStyles }
}

// ─── Typography tab sub-component ────────────────────────────────────────────
function TypographyTab({
  currentStyles,
  updateStyle,
}: {
  currentStyles: ThemeStyleProps
  updateStyle: UpdateStyleFn
}) {
  const t = useTranslations('theme-studio.controlPanel')
  return (
    <ScrollArea className="h-full px-4">
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-[11px]">
        <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
        <p>
          {t('typography.customFontsNote')}{' '}
          <a
            href="https://tailwindcss.com/docs/font-family"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors"
          >
            {t('typography.learnMore')}
          </a>
        </p>
      </div>
      <ControlSection title={t('typography.fontFamilyTitle')} expanded>
        <div className="space-y-1.5">
          {(['sans', 'serif', 'mono'] as const).map((variant) => {
            const key = `font-${variant}` as 'font-sans' | 'font-serif' | 'font-mono'
            const cat =
              variant === 'sans' ? 'sans-serif' : variant === 'serif' ? 'serif' : 'monospace'
            return (
              <div key={variant} className="flex items-center gap-2">
                <Label
                  htmlFor={key}
                  className="text-muted-foreground w-16 shrink-0 text-[11px] font-medium"
                >
                  {t(`typography.${variant}Label` as Parameters<typeof t>[0])}
                </Label>
                <div className="min-w-0 flex-1">
                  <FontPickerStub
                    value={currentStyles[key]}
                    category={cat}
                    placeholder={t(
                      `typography.${variant}FontPlaceholder` as Parameters<typeof t>[0],
                    )}
                    onSelect={(font) => updateStyle(key, `${font.family}, ${font.category}`)}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </ControlSection>
      <ControlSection title={t('typography.letterSpacingTitle')} expanded>
        <SliderWithInput
          value={parseFloat(currentStyles['letter-spacing']?.replace('em', '') ?? '0')}
          onChange={(value) => updateStyle('letter-spacing', `${value}em`)}
          min={-0.5}
          max={0.5}
          step={0.025}
          unit="em"
          label={t('typography.trackingLabel')}
        />
      </ControlSection>
    </ScrollArea>
  )
}

// ─── Other tab sub-component ─────────────────────────────────────────────────
function OtherTab({
  currentStyles,
  updateStyle,
}: {
  currentStyles: ThemeStyleProps
  updateStyle: UpdateStyleFn
}) {
  const t = useTranslations('theme-studio.controlPanel')
  const radius = parseFloat(currentStyles.radius.replace('rem', ''))
  return (
    <ScrollArea className="h-full px-4">
      <ControlSection title={t('other.hslTitle')} expanded>
        <HslControls />
      </ControlSection>
      <ControlSection title={t('other.radiusTitle')} expanded>
        <SliderWithInput
          value={radius}
          onChange={(value) => updateStyle('radius', `${value}rem`)}
          min={0}
          max={5}
          step={0.025}
          unit="rem"
          label={t('other.radiusLabel')}
        />
      </ControlSection>
      <ControlSection title={t('other.spacingTitle')}>
        <SliderWithInput
          value={parseFloat(currentStyles?.spacing?.replace('rem', '') ?? '0')}
          onChange={(value) => updateStyle('spacing', `${value}rem`)}
          min={0.15}
          max={0.35}
          step={0.01}
          unit="rem"
          label={t('other.spacingLabel')}
        />
      </ControlSection>
      <ControlSection title={t('other.shadowTitle')}>
        <ShadowControl
          shadowColor={currentStyles['shadow-color']}
          shadowOpacity={parseFloat(currentStyles['shadow-opacity'])}
          shadowBlur={parseFloat(currentStyles['shadow-blur']?.replace('px', '') ?? '0')}
          shadowSpread={parseFloat(currentStyles['shadow-spread']?.replace('px', '') ?? '0')}
          shadowOffsetX={parseFloat(currentStyles['shadow-offset-x']?.replace('px', '') ?? '0')}
          shadowOffsetY={parseFloat(currentStyles['shadow-offset-y']?.replace('px', '') ?? '0')}
          onChange={(key, value) => {
            if (key === 'shadow-color') updateStyle(key, value as string)
            else if (key === 'shadow-opacity') updateStyle(key, value.toString())
            else updateStyle(key as keyof ThemeStyleProps, `${value}px`)
          }}
        />
      </ControlSection>
    </ScrollArea>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface ControlPanelProps {
  /** Enable AI tab (deferred Fase 6). Default false. */
  aiEnabled?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────
const ControlPanel = ({ aiEnabled: _aiEnabled = false }: ControlPanelProps) => {
  const t = useTranslations('theme-studio.controlPanel')
  const { tab, handleSetTab } = useControlsTabFromUrl()
  const { currentStyles, updateStyle, updateStyles } = useControlPanelState()

  if (!currentStyles) return null

  return (
    <>
      <div className="border-b">
        <ThemePresetSelectStub className="h-14 rounded-none" disabled={false} />
      </div>
      <div className="flex min-h-0 flex-1 flex-col space-y-4">
        <Tabs
          value={tab}
          onValueChange={(v) => handleSetTab(v as ControlTab)}
          className="flex min-h-0 w-full flex-1 flex-col"
        >
          <HorizontalScrollArea className="mt-2 mb-1 px-4">
            <TabsList className="bg-background text-muted-foreground inline-flex w-fit items-center justify-center rounded-full px-0">
              <TabsTriggerPill value="colors">{t('tabs.colors')}</TabsTriggerPill>
              <TabsTriggerPill value="typography">{t('tabs.typography')}</TabsTriggerPill>
              <TabsTriggerPill value="other">{t('tabs.other')}</TabsTriggerPill>
              <TabsTriggerPill
                value="ai"
                className="data-[state=active]:[--effect:var(--secondary-foreground)] data-[state=active]:[--foreground:var(--muted-foreground)] data-[state=active]:[--muted-foreground:var(--effect)]"
              >
                <Sparkle className="mr-1 size-3.5 text-current" aria-hidden="true" />
                <span className="via-foreground from-muted-foreground to-muted-foreground flex items-center gap-1 bg-linear-to-r from-50% via-60% to-100% bg-size-[200%_auto] bg-clip-text text-sm text-transparent">
                  {t('tabs.ai')}
                </span>
              </TabsTriggerPill>
            </TabsList>
          </HorizontalScrollArea>
          <TabsContent value="colors" className="mt-1 size-full overflow-hidden">
            <ColorsTabContent
              currentStyles={currentStyles}
              updateStyle={updateStyle}
              updateStyles={updateStyles}
            />
          </TabsContent>
          <TabsContent value="typography" className="mt-1 size-full overflow-hidden">
            <TypographyTab currentStyles={currentStyles} updateStyle={updateStyle} />
          </TabsContent>
          <TabsContent value="other" className="mt-1 size-full overflow-hidden">
            <OtherTab currentStyles={currentStyles} updateStyle={updateStyle} />
          </TabsContent>
          <TabsContent value="ai" className="mt-1 size-full overflow-hidden">
            <AiTabContent />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default ControlPanel
