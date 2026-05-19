// .storybook/preview.tsx — Storybook 10 preview config (ADR-0038).
// Providers globais:
//   - NextIntlClientProvider (messages/pt-BR/common.json) — `useTranslations` em wrappers
//   - RouteProvider (brand+tenant mock) — `useBrand`/`useTenant` no Logo, gates
//   - EntitlementProvider (plan B mock) — `useEntitlement` no AppEntitlementGate
//   - Toaster sonner — pro AppToast renderizar
// Tokens via import globals.css (Tailwind v4 @theme + tokens OKLCH).

import '../app/globals.css'

import { Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'

import type { Preview } from '@storybook/nextjs-vite'
import { Toaster } from 'sonner'

import type { Brand } from '../lib/brand/types'
import { EntitlementProvider } from '../lib/entitlements/EntitlementProvider'
import type { PlanFeatures, PlanSlug } from '../lib/entitlements/types'
import { RouteProvider } from '../lib/route/RouteProvider'
import type { Tenant } from '../lib/route/types'
import commonMessages from '../messages/pt-BR/common.json'

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

const mockBrand: Brand = {
  id: 'brand-storybook',
  name: 'storybook',
  host: 'localhost:6006',
  default_palette_id: 'palette-mock',
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
    (Story) => (
      <NextIntlClientProvider locale="pt-BR" messages={{ common: commonMessages }}>
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
      </NextIntlClientProvider>
    ),
  ],
}

export default preview
