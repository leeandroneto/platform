// .storybook/preview.tsx — Storybook 10 preview config (ADR-0038).
// Providers globais:
//   - NuqsAdapter (nuqs/adapters/react) — `useQueryState` em PreviewPanel etc. (bug #4)
//   - NextIntlClientProvider (common + theme-studio namespaces) — `useTranslations`
//   - TooltipProvider (Radix) — `<Tooltip>` used in preset-select, control-panel etc.
//   - RouteProvider (brand+tenant mock) — `useBrand`/`useTenant` no Logo, gates
//   - EntitlementProvider (plan B mock) — `useEntitlement` no AppEntitlementGate
//   - Toaster sonner — pro AppToast renderizar
// Tokens: globals.css (universal) + DEFAULT_THEME_CSS inject via decorator (bug #6).
// Dark mode toggle: globalTypes `theme` light|dark + decorator `.dark` class (bonus).

import '../app/globals.css'

import { useEffect } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'

import type { Preview } from '@storybook/nextjs-vite'
import { NuqsAdapter } from 'nuqs/adapters/react'
import { Toaster } from 'sonner'

import { TooltipProvider } from '../components/ui/tooltip'
import type { Brand } from '../lib/brand/types'
import { EntitlementProvider } from '../lib/entitlements/EntitlementProvider'
import type { PlanFeatures, PlanSlug } from '../lib/entitlements/types'
import { RouteProvider } from '../lib/route/RouteProvider'
import type { Tenant } from '../lib/route/types'
import commonMessages from '../messages/pt-BR/common.json'
import themeStudioMessages from '../messages/pt-BR/theme-studio.json'
import { DEFAULT_THEME_CSS } from './default-theme.css'

// next/font Geist (espelha app/layout.tsx) — injeta CSS vars no decorator
const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

// bug #5 fix: removido `default_palette_id: 'palette-mock'` — campo dropado
// em migration 0024. Brand type em lib/brand/types.ts não tem este campo.
const mockBrand: Brand = {
  id: 'brand-storybook',
  name: 'storybook',
  host: 'localhost:6006',
  logo_url: null,
  default_vertical: 'fitness',
  parent_label: null,
  theme_version: 1,
}

const mockTenant: Tenant = {
  id: 'tenant-storybook',
  slug: 'demo',
  brand_id: mockBrand.id,
  name: 'Demo Tenant',
  vertical: 'fitness',
  theme_version: 1,
}

// Plan B (intermediário) — features booleanas habilitam paywall toggle visual.
const mockFeatures: PlanFeatures = {
  schema_version: 1,
  chatbot: false,
  custom_domain: false,
  ai_assessment: true,
  branded_pwa: true,
  white_label_full: false,
  automations: false,
  max_programs: 10,
  max_clients: 50,
  max_storage_gb: 5,
}

const mockPlan: PlanSlug = 'B'

const preview: Preview = {
  // bonus: dark mode toggle via Storybook toolbar
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'dark',
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: 'oklch(0.13 0.01 275)' },
        { name: 'light', value: 'oklch(0.98 0.01 275)' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'todo' dia 0 — mostra violações no painel sem falhar build.
      // Promover 'error' quando Sprint 1 estabilizar stories (gate CI APCA + axe).
      test: 'todo',
    },
  },
  decorators: [
    // bug #6 fix: emite tokens DEFAULT_THEME como <style> antes do Story.
    // buildThemeCSS é server-only — usamos string literal pré-gerada em
    // .storybook/default-theme.css.ts (sem dep server-only). Regenerar se
    // DEFAULT_THEME mudar (ver comentário no arquivo).
    (Story) => (
      <>
        <style dangerouslySetInnerHTML={{ __html: DEFAULT_THEME_CSS }} />
        <Story />
      </>
    ),
    // bonus: aplica .dark class no documentElement via globalTypes theme toggle
    (Story, context) => {
      const isDark = context.globals['theme'] === 'dark'
      useEffect(() => {
        document.documentElement.classList.toggle('dark', isDark)
      }, [isDark])
      return <Story />
    },
    // bug #4 fix: NuqsAdapter wraps todos os stories — resolve
    // "[nuqs] nuqs requires an adapter" em PreviewPanel + outros
    // que usam useQueryState. Adapter react (não next/app) pois
    // Storybook é Vite/browser sem App Router context.
    (Story) => (
      <NuqsAdapter>
        <NextIntlClientProvider
          locale="pt-BR"
          messages={{ common: commonMessages, 'theme-studio': themeStudioMessages }}
        >
          <TooltipProvider>
            <RouteProvider brand={mockBrand} tenant={mockTenant}>
              <EntitlementProvider features={mockFeatures} plan={mockPlan}>
                <div
                  className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background p-8 font-sans text-foreground`}
                >
                  <Story />
                  <Toaster richColors closeButton position="top-center" />
                </div>
              </EntitlementProvider>
            </RouteProvider>
          </TooltipProvider>
        </NextIntlClientProvider>
      </NuqsAdapter>
    ),
  ],
}

export default preview
