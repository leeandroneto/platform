import './globals.css'

import { Suspense } from 'react'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { headers } from 'next/headers'

import { Toaster } from 'sonner'

import { getRouteByHost } from '@/lib/route/getRouteByHost'
import { RouteProvider } from '@/lib/route/RouteProvider'

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

// ─── Metadata dinâmico por brand + tenant (ADR-0024 + 0026) ───────────────
export async function generateMetadata(): Promise<Metadata> {
  const h = await headers()
  const tenantSlug = h.get('x-tenant-slug')
  const brandName = h.get('x-brand-name') ?? 'platform'
  const title = tenantSlug ? `${tenantSlug} · ${brandName}` : brandName
  return {
    title: { default: title, template: `%s · ${title}` },
    description: 'Plataforma white-label multi-vertical',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: 'oklch(0.13 0.01 275)' },
    { media: '(prefers-color-scheme: light)', color: 'oklch(0.98 0.01 275)' },
  ],
}

// Resolve href do theme CSS pro tenant/brand atual.
function buildThemeHref(route: Awaited<ReturnType<typeof getRouteByHost>>): string | null {
  if (!route) return null
  const tenant = route.tenant
  const id = tenant?.id ?? route.brand.id
  const version = tenant?.theme_version ?? route.brand.theme_version ?? 1
  const path = tenant ? 'tenants' : 'brands'
  return `/api/${path}/${id}/theme.css?v=${version}`
}

// ─── Dynamic shell: lê host + faz lookup brand/tenant + emite theme CSS ──
// Encapsulado em Suspense pra Next 16 cacheComponents — body shell static,
// dynamic content streamed (PPR-style). Theme `<link>` hoisted pra <head>
// via precedence prop do React.
async function DynamicShell({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const host = h.get('host')
  const route = host ? await getRouteByHost(host) : null

  if (!route) return children

  const themeHref = buildThemeHref(route)

  return (
    <>
      {themeHref && <link rel="stylesheet" href={themeHref} precedence="default" />}
      <RouteProvider brand={route.brand} tenant={route.tenant}>
        {children}
        <Toaster richColors closeButton position="top-center" />
      </RouteProvider>
    </>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${geistSans.variable} ${geistMono.variable}`
  return (
    <html lang="pt-BR" className={fontVars} suppressHydrationWarning>
      <body>
        <Suspense fallback={children}>
          <DynamicShell>{children}</DynamicShell>
        </Suspense>
      </body>
    </html>
  )
}
