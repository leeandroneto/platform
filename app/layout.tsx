import './globals.css'

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

// Resolve link href + version pro CSS de tema do tenant/brand.
function buildThemeLink(route: Awaited<ReturnType<typeof getRouteByHost>>) {
  if (!route) return null
  const isTenant = Boolean(route.tenant)
  const id = route.tenant?.id ?? route.brand.id
  const version = route.tenant?.theme_version ?? route.brand.theme_version ?? 1
  const path = isTenant ? 'tenants' : 'brands'
  return { href: `/api/${path}/${id}/theme.css?v=${version}`, version }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const host = h.get('host')
  const route = host ? await getRouteByHost(host) : null
  const themeLink = buildThemeLink(route)
  const fontVars = `${geistSans.variable} ${geistMono.variable}`

  return (
    <html lang="pt-BR" className={fontVars} suppressHydrationWarning>
      <head>
        {themeLink && <link rel="stylesheet" href={themeLink.href} precedence="default" />}
      </head>
      <body>
        {route ? (
          <RouteProvider brand={route.brand} tenant={route.tenant}>
            {children}
            <Toaster richColors closeButton position="top-center" />
          </RouteProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}
