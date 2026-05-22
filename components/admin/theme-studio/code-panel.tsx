// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/code-panel.tsx
// See NOTICE.md.
//
// Adapts:
//   - usePreferencesStore (Zustand) → useState + localStorage (pattern color-selector-popover)
//   - useEditorStore → useThemeFormContext()
//   - PostHog analytics → REMOVIDO (memory feedback_frescura_filter: zero analytics MVP solo)
//   - v0 tab → REMOVIDO (ADR-0045 D.1 v0 DEMOTED)
//   - generateThemeCode/TailwindConfigCode/LayoutCode → @/lib/design/theme-style-generator
//   - CodeBlock (ai-elements) → inline <pre>/<code> (componente não existe nesta stack)
//   - base-ui-tabs → @/components/ui/tabs (shadcn canonical, sem TabsIndicator)
//   - Registry URL → stub TENANT_THEME_ID_PLACEHOLDER (Chunk 7 implementa endpoint)
//   - Tabs: CSS / shadcn registry (2 tabs em vez de 3 — v0 DEMOTED)
//   - i18n → namespace theme-studio.codePanel

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-code-panel",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Painel de código do theme studio — exibe CSS Tailwind v4 e shadcn registry command para exportação do tema",
 *   "examples": ["admin/theme-studio"],
 *   "when_to_use": ["dentro do theme studio para exportar código do tema customizado"],
 *   "anti_patterns": ["uso standalone fora do ThemeFormProvider", "v0 registry tab (DEMOTED ADR-0045)"],
 *   "related": ["theme-studio-code-panel-dialog"],
 *   "vertical": null,
 *   "propsSchema": "lib/contracts/components/code-panel.ts"
 * }
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'

import { Check, Copy } from 'lucide-react'

import {
  generateLayoutCode,
  generateTailwindConfigCode,
  generateThemeCode,
} from '@/lib/design/theme-style-generator'

import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useThemeFormContext } from '@/app/temas/_state/theme-form-provider'

// ---------------------------------------------------------------------------
// Local preferences — sem Zustand global (pattern color-selector-popover)
// ---------------------------------------------------------------------------

type TailwindVersion = '3' | '4'
type ColorFormat = 'oklch' | 'hsl' | 'hex'
type PackageManager = 'pnpm' | 'npm' | 'yarn' | 'bun'

const STORAGE_KEYS = {
  colorFormat: 'theme-studio:colorFormat',
  tailwindVersion: 'theme-studio:tailwindVersion',
  packageManager: 'theme-studio:packageManager',
} as const

function useLocalPref<T extends string>(key: string, defaultValue: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue
    return (localStorage.getItem(key) as T | null) ?? defaultValue
  })

  const set = (v: T) => {
    setValue(v)
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, v)
    }
  }

  return [value, set]
}

// ---------------------------------------------------------------------------
// Registry URL stub — Chunk 7 implementa /api/r/themes/[tenantId]/[version]
// ---------------------------------------------------------------------------
const REGISTRY_URL_STUB = 'TENANT_THEME_ID_PLACEHOLDER'

// ---------------------------------------------------------------------------
// CodeBlock inline — ai-elements/code-block não existe nesta stack
// ---------------------------------------------------------------------------
interface CodeBlockProps {
  code: string
  language: string
  className?: string
}

function CodeBlock({ code, language, className }: CodeBlockProps) {
  return (
    <pre
      data-language={language}
      className={`font-mono text-sm/relaxed  p-4 overflow-auto ${className ?? ''}`}
    >
      <code>{code}</code>
    </pre>
  )
}

// ---------------------------------------------------------------------------
// Available color formats — OKLCH-primary (ADR-0044). HSL disponível pra v3.
// ---------------------------------------------------------------------------
function getAvailableColorFormats(tailwindVersion: TailwindVersion): ColorFormat[] {
  if (tailwindVersion === '4') return ['oklch', 'hex']
  return ['oklch', 'hsl', 'hex']
}

// ---------------------------------------------------------------------------
// PackageManagerHeader — extracted outside CodePanel (react-hooks/static-components)
// ---------------------------------------------------------------------------
interface PackageManagerHeaderProps {
  packageManager: PackageManager
  onPackageManagerChange: (pm: PackageManager) => void
  actionButton: React.ReactNode
}

function PackageManagerHeader({
  packageManager,
  onPackageManagerChange,
  actionButton,
}: PackageManagerHeaderProps) {
  return (
    <div className="flex border-b">
      {(['pnpm', 'npm', 'yarn', 'bun'] as const).map((pm) => (
        <button
          key={pm}
          onClick={() => onPackageManagerChange(pm)}
          className={`px-3 py-1.5 text-sm font-medium ${
            packageManager === pm
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {pm}
        </button>
      ))}
      {actionButton}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CodePanel — SSOT: lib/contracts/components/code-panel.ts (Zod schema + z.infer).
// ---------------------------------------------------------------------------
import type { CodePanelProps } from '@/lib/contracts/components/code-panel'

export default function CodePanel({ themeId }: CodePanelProps) {
  const t = useTranslations('theme-studio.codePanel')
  const { themeState } = useThemeFormContext()

  const [registryCopied, setRegistryCopied] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('index.css')

  // Local preferences (localStorage) — sem Zustand
  const [colorFormat, setColorFormat] = useLocalPref<ColorFormat>(STORAGE_KEYS.colorFormat, 'oklch')
  const [tailwindVersion, setTailwindVersion] = useLocalPref<TailwindVersion>(
    STORAGE_KEYS.tailwindVersion,
    '4',
  )
  const [packageManager, setPackageManager] = useLocalPref<PackageManager>(
    STORAGE_KEYS.packageManager,
    'pnpm',
  )

  // Quando muda pra v4, força oklch se estava em hsl
  useEffect(() => {
    if (tailwindVersion === '4' && colorFormat === 'hsl') {
      setColorFormat('oklch')
    }
    if (activeTab === 'tailwind.config.ts') {
      setActiveTab('index.css')
    }
    // ADR-0031 §12 — intentional sync-once effect; deps override in eslint.config.mjs
  }, [tailwindVersion])

  // Gera código via utils já presentes (Step 1.4b).
  // themeState: Theme = { light, dark } — adaptar para ThemeEditorState = { currentMode, styles }
  // que generateThemeCode espera internamente (type local do gerador).
  const themeEditorState = { currentMode: 'light' as const, styles: themeState }
  const code = generateThemeCode(themeEditorState, colorFormat, tailwindVersion)
  const configCode = generateTailwindConfigCode(themeEditorState, colorFormat, tailwindVersion)
  const layoutCode = generateLayoutCode(themeEditorState)

  // Registry command
  const getRegistryCommand = (id: string) => {
    const url = `/api/r/themes/${id}`
    switch (packageManager) {
      case 'pnpm':
        return `pnpm dlx shadcn@latest add ${url}`
      case 'npm':
        return `npx shadcn@latest add ${url}`
      case 'yarn':
        return `yarn dlx shadcn@latest add ${url}`
      case 'bun':
        return `bunx shadcn@latest add ${url}`
    }
  }

  const registryId = themeId ?? REGISTRY_URL_STUB

  const showRegistryCommand = useMemo(() => {
    return !!themeId
  }, [themeId])

  // Clipboard helpers — sem PostHog (feedback_frescura_filter: zero analytics MVP solo)
  const copyRegistryCommand = async () => {
    try {
      await navigator.clipboard.writeText(getRegistryCommand(registryId))
      setRegistryCopied(true)
      setTimeout(() => setRegistryCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy registry command:', err)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const activeCode =
    activeTab === 'index.css' ? code : activeTab === 'layout.tsx' ? layoutCode : configCode

  return (
    <div className="flex h-full flex-col">
      {/* Header — registry command section */}
      <div className="mb-4 flex-none">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">{t('title')}</h2>
        </div>

        <div className="mt-4 overflow-hidden rounded-md border">
          <PackageManagerHeader
            packageManager={packageManager}
            onPackageManagerChange={setPackageManager}
            actionButton={
              showRegistryCommand ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyRegistryCommand}
                  className="ml-auto h-8"
                  aria-label={registryCopied ? t('copied') : t('copy')}
                >
                  {registryCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </Button>
              ) : null
            }
          />

          <div className="bg-muted/50 flex items-center justify-between p-2">
            {showRegistryCommand ? (
              <ScrollArea className="w-full">
                <div className="overflow-y-hidden pb-2 whitespace-nowrap">
                  <code className="font-mono text-sm">{getRegistryCommand(registryId)}</code>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            ) : (
              <div className="text-muted-foreground text-sm">
                {t('registryUrlHint')}{' '}
                <span className="font-mono">{t('registryShadcnCommand')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Format / version selectors */}
      <div className="mb-4 flex items-center gap-2">
        <Select
          value={tailwindVersion}
          onValueChange={(value: TailwindVersion) => setTailwindVersion(value)}
        >
          <SelectTrigger className="bg-muted/50 w-fit gap-1 border-none outline-hidden focus:border-none focus:ring-transparent">
            <SelectValue className="focus:ring-transparent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">Tailwind v3</SelectItem>
            <SelectItem value="4">Tailwind v4</SelectItem>
          </SelectContent>
        </Select>

        <Select value={colorFormat} onValueChange={(value: ColorFormat) => setColorFormat(value)}>
          <SelectTrigger className="bg-muted/50 w-fit gap-1 border-none outline-hidden focus:border-none focus:ring-transparent">
            <SelectValue className="focus:ring-transparent" />
          </SelectTrigger>
          <SelectContent>
            {getAvailableColorFormats(tailwindVersion).map((fmt) => (
              <SelectItem key={fmt} value={fmt}>
                {fmt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Code tabs — CSS / tailwind.config.ts (v3 only) / layout.tsx */}
      {/* shadcn registry tab: REMOVIDO (v0 DEMOTED ADR-0045 D.1) */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="index.css"
        className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border"
      >
        <div className="bg-muted/50 flex flex-none items-center justify-between border-b px-4 py-2">
          <TabsList className="h-8 bg-transparent p-0">
            <TabsTrigger value="index.css" className="h-7 px-3 text-sm font-medium">
              {t('tabs.css')}
            </TabsTrigger>

            {tailwindVersion === '3' && (
              <TabsTrigger value="tailwind.config.ts" className="h-7 px-3 text-sm font-medium">
                tailwind.config.ts
              </TabsTrigger>
            )}

            <TabsTrigger value="layout.tsx" className="h-7 px-3 text-sm font-medium">
              layout.tsx (Next.js)
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(activeCode)}
              className="h-8"
              aria-label={copied ? t('copied') : t('copy')}
            >
              {copied ? (
                <>
                  <Check className="size-4" />
                  <span className="sr-only md:not-sr-only">{t('copied')}</span>
                </>
              ) : (
                <>
                  <Copy className="size-4" />
                  <span className="sr-only md:not-sr-only">{t('copy')}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* CSS tab */}
        <TabsContent value="index.css" className="overflow-hidden">
          <ScrollArea className="relative h-full">
            <CodeBlock code={code} language="css" className="h-full rounded-none border-0" />
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </TabsContent>

        {/* Tailwind config tab — só em v3 */}
        {tailwindVersion === '3' && (
          <TabsContent value="tailwind.config.ts" className="overflow-hidden">
            <ScrollArea className="relative h-full">
              <CodeBlock
                code={configCode}
                language="typescript"
                className="h-full rounded-none border-0"
              />
              <ScrollBar orientation="horizontal" />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </TabsContent>
        )}

        {/* Layout tab */}
        <TabsContent value="layout.tsx" className="overflow-hidden">
          <ScrollArea className="relative h-full">
            <CodeBlock code={layoutCode} language="tsx" className="h-full rounded-none border-0" />
            <ScrollBar orientation="horizontal" />
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
