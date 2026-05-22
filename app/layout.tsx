// app/layout.tsx — shell pós-pivot ADR-0044 (TweakCN canonical) Fase 4.
// Theming runtime via <style precedence="theme"> + buildThemeCSS() (React 19
// auto-hoist pro <head> — sem FOUC porque SSR já gerou).
//
// Fase 4 (ADR-0044): consume `tenant.active_theme_version.snapshot` quando
// disponível, fallback DEFAULT_THEME. next-themes wired pra theme_mode UX
// preference (G.4 — 'auto' | 'light' | 'dark').
//
// O que SAIU:
//   - <MotionProvider> (componente deletado, re-add JIT quando feature precisar)
//   - <link rel="stylesheet" href="/api/.../theme.css"> (modelo OLD palettes+fonts+shape_presets)
//   - buildThemeHref() helper (referenciava route deletada)
//
// O que FICOU:
//   - NextIntlClientProvider, RouteProvider, EntitlementProvider
//   - Toaster sonner (não depende de components/)
//   - manifest.webmanifest + apple-touch-icon + splash (PWA infra)
//   - Geist fonts (next/font padrão Next 16)

import './globals.css'

import { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

import { Toaster } from 'sonner'

import { buildThemeCSS } from '@/lib/design/build-theme-css'
import type { Theme } from '@/lib/design/contract/theme'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'
import { EntitlementProvider } from '@/lib/entitlements/EntitlementProvider'
import { getEntitlementSnapshot } from '@/lib/entitlements/server'
import { getRouteByHost } from '@/lib/route/getRouteByHost'
import { RouteProvider } from '@/lib/route/RouteProvider'

import { ThemeProviderClient } from '@/app/_components/theme-provider-client'

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

// ─── Metadata dinâmico por brand + tenant (ADR-0024 + 0026 + Etapa 10 PWA) ─
export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const tenantSlug = h.get('x-tenant-slug')
  const brandName = h.get('x-brand-name') ?? 'platform'
  const title = tenantSlug ? `${tenantSlug} · ${brandName}` : brandName
  const appTitle = tenantSlug ?? brandName
  return {
    title: { default: title, template: `%s · ${title}` },
    description: 'Plataforma white-label multi-vertical',
    // PWA: iOS apple-mobile-web-app-* metas (ADR-0040 + blueprint 08 §15).
    appleWebApp: {
      capable: true,
      statusBarStyle: 'black-translucent',
      title: appTitle,
    },
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // viewportFit:cover habilita env(safe-area-inset-*) em iOS PWA standalone (blueprint 08 §5).
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.13 0.01 275)' },
    { media: '(prefers-color-scheme: light)', color: 'oklch(0.98 0.01 275)' },
  ],
}

// Resolve href do manifest.webmanifest pro tenant/brand atual (Etapa 10 PWA).
function buildManifestHref(route: Awaited<ReturnType<typeof getRouteByHost>>): string | null {
  if (!route) return null
  const tenant = route.tenant
  const id = tenant?.id ?? route.brand.id
  const version = tenant?.theme_version ?? route.brand.theme_version ?? 1
  const path = tenant ? 'tenants' : 'brands'
  return `/api/${path}/${id}/manifest.webmanifest?v=${version}`
}

// apple-touch-icon 180x180 — iOS Safari ignora manifest icons + le essa tag
// preferencialmente (Lighthouse audit obrigatorio + iOS PWA install).
function buildAppleTouchIconHref(route: Awaited<ReturnType<typeof getRouteByHost>>): string | null {
  if (!route) return null
  const tenant = route.tenant
  const id = tenant?.id ?? route.brand.id
  const version = tenant?.theme_version ?? route.brand.theme_version ?? 1
  const path = tenant ? 'tenants' : 'brands'
  return `/api/${path}/${id}/icon/180?v=${version}`
}

// iOS splash screens 3 sizes (Etapa 10B) — cobertura ~80% devices ativos 2026.
const SPLASH_ENTRIES: readonly { size: string; media: string }[] = [
  {
    size: '1290x2796',
    media:
      '(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    size: '1179x2556',
    media:
      '(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)',
  },
  {
    size: '2048x2732',
    media:
      '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
  },
] as const

function buildSplashHrefs(
  route: Awaited<ReturnType<typeof getRouteByHost>>,
): Array<{ href: string; media: string }> | null {
  if (!route) return null
  const tenant = route.tenant
  const id = tenant?.id ?? route.brand.id
  const version = tenant?.theme_version ?? route.brand.theme_version ?? 1
  const path = tenant ? 'tenants' : 'brands'
  return SPLASH_ENTRIES.map(({ size, media }) => ({
    href: `/api/${path}/${id}/splash/${size}?v=${version}`,
    media,
  }))
}

// ─── ThemeStyle: emite <style precedence="theme"> com tokens canonical ───
// Fase 4 (ADR-0044): consume `tenant.active_theme_version.snapshot` Zod-validado
// (foi feito o parse em getRouteByHost). Fallback DEFAULT_THEME quando ausente
// (brand-root, tenant sem theme bootstrap, ou erro de hidratação).
// React 19 hoist o <style> automaticamente pro <head> via `precedence` attr.
function ThemeStyle({ snapshot }: { snapshot: Theme }) {
  const css = buildThemeCSS(snapshot)
  return <style precedence="theme" dangerouslySetInnerHTML={{ __html: css }} />
}

type Route = NonNullable<Awaited<ReturnType<typeof getRouteByHost>>>

// ─── RoutedShell: branch quando getRouteByHost retorna route (tenant ou brand-root) ──
async function RoutedShell({
  route,
  snapshot,
  defaultMode,
  locale,
  messages,
  children,
}: {
  route: Route
  snapshot: Theme
  defaultMode: string
  locale: string
  messages: Awaited<ReturnType<typeof getMessages>>
  children: React.ReactNode
}) {
  // Hidrata EntitlementProvider com snapshot do tenant (null se sem subscription)
  // — ADR-0034 §4. Sem isso useEntitlement client retorna sempre 'no allowed'.
  const entitlements = await getEntitlementSnapshot()
  const manifestHref = buildManifestHref(route)
  const appleTouchIconHref = buildAppleTouchIconHref(route)
  const splashHrefs = buildSplashHrefs(route)

  return (
    <>
      {/* Theme tokens canonical (ADR-0044 Fase 4) — React 19 hoist pro <head>. */}
      <Suspense fallback={null}>
        <ThemeStyle snapshot={snapshot} />
      </Suspense>
      {manifestHref && <link rel="manifest" href={manifestHref} />}
      {appleTouchIconHref && <link rel="apple-touch-icon" href={appleTouchIconHref} />}
      {splashHrefs?.map((s) => (
        <link key={s.href} rel="apple-touch-startup-image" href={s.href} media={s.media} />
      ))}
      <NextIntlClientProvider locale={locale} messages={messages}>
        <ThemeProviderClient defaultTheme={defaultMode}>
          <RouteProvider brand={route.brand} tenant={route.tenant}>
            <EntitlementProvider features={entitlements.features} plan={entitlements.plan}>
              {children}
              <Toaster richColors closeButton position="top-center" />
            </EntitlementProvider>
          </RouteProvider>
        </ThemeProviderClient>
      </NextIntlClientProvider>
    </>
  )
}

// ─── Dynamic shell: lê host + faz lookup brand/tenant. Theme CSS via <style
// precedence="theme"> + buildThemeCSS() (ADR-0044 Fase 4). ─────────────────
async function DynamicShell({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const host = h.get('host')
  const route = host ? await getRouteByHost(host) : null

  // NextIntlClientProvider envelopa SEMPRE (mesmo sem route) — client components
  // chamam useTranslations independente de ter brand resolvida. ADR-0040 §G.
  const messages = await getMessages()
  const locale = await getLocale()

  // Fase 4 ADR-0044: snapshot per-tenant via active_theme_version. Fallback
  // DEFAULT_THEME quando brand-root, tenant sem bootstrap ou erro de hidratação.
  const snapshot = route?.tenant?.active_theme_version?.snapshot ?? DEFAULT_THEME
  // theme_mode UX preference (G.4): 'auto' (system) | 'light' | 'dark'.
  const defaultMode = route?.tenant?.theme_mode ?? 'auto'

  if (!route) {
    return (
      <>
        <Suspense fallback={null}>
          <ThemeStyle snapshot={snapshot} />
        </Suspense>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProviderClient defaultTheme={defaultMode}>{children}</ThemeProviderClient>
        </NextIntlClientProvider>
      </>
    )
  }

  return (
    <RoutedShell
      route={route}
      snapshot={snapshot}
      defaultMode={defaultMode}
      locale={locale}
      messages={messages}
    >
      {children}
    </RoutedShell>
  )
}

// <html lang> dinâmico via getLocale() — RootLayout async (Next 16 OK).
// Fallback 'pt-BR' fica embutido no i18n/request.ts (locale fixo dia 0).
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${geistSans.variable} ${geistMono.variable}`
  const locale = await getLocale()
  return (
    <html lang={locale} className={fontVars} suppressHydrationWarning>
      <body>
        {/* React 19 hoista <script async> pro <head> no SSR — necessário pro
            tweakcn detectar a tag no momento que o iframe é inspecionado. */}
        <script async crossOrigin="anonymous" src="https://tweakcn.com/live-preview.min.js" />
        <Suspense fallback={children}>
          <DynamicShell>{children}</DynamicShell>
        </Suspense>
      </body>
    </html>
  )
}
