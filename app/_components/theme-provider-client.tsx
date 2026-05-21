// app/_components/theme-provider-client.tsx — Client wrapper pra next-themes.
//
// next-themes é client-only (lê localStorage + system prefers-color-scheme).
// Server passa `defaultTheme` (tenant.theme_mode) como prop server → client.
//
// Decisão G.4 (ADR-0044 Fase 4): theme_mode é UX preference, ortogonal ao
// snapshot de cores. Ler `tenants.theme_mode` ('auto' | 'light' | 'dark')
// e mapear pra next-themes input.

'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'

import type { ReactNode } from 'react'

export interface ThemeProviderClientProps {
  readonly defaultTheme: string
  readonly children: ReactNode
}

// Mapeia `tenants.theme_mode` ('auto' | 'light' | 'dark') pra next-themes
// (`system` | `light` | `dark`). Default: 'system' (segue OS).
function mapThemeMode(mode: string): string {
  if (mode === 'auto') return 'system'
  if (mode === 'light' || mode === 'dark') return mode
  return 'system'
}

export function ThemeProviderClient({ defaultTheme, children }: ThemeProviderClientProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={mapThemeMode(defaultTheme)}
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
