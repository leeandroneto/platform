// lib/route/types.ts — Tipo Tenant + ResolvedRoute (ADR-0026).

import type { Theme } from '@/lib/design/contract/theme'

export interface ActiveThemeVersion {
  readonly id: string
  readonly version_number: number
  readonly snapshot: Theme
}

export interface Tenant {
  readonly id: string
  readonly slug: string // 'joao' (subdomain-safe)
  readonly brand_id: string // FK platform.brands
  readonly name: string // 'João Silva — Personal'
  readonly vertical: string // 'fitness' | 'yoga' | 'english' | ...
  readonly theme_version: number // pra cache busting de tenant theme override (legado pré-Fase-4)
  readonly theme_mode?: string // 'auto' | 'light' | 'dark' — input de next-themes (G.4)
  readonly active_theme_version_id?: string | null // Fase 4 ADR-0044 — FK pra tenant_theme_versions
  readonly active_theme_version?: ActiveThemeVersion | null // hydrated via join em getRouteByHost
}

export type DomainKind = 'subdomain' | 'custom'
export type SslStatus = 'pending' | 'issued' | 'failed' | 'revoked'

export interface TenantDomain {
  readonly id: string
  readonly tenant_id: string
  readonly host: string
  readonly kind: DomainKind
  readonly is_primary: boolean
  readonly verified_at: string | null
  readonly ssl_status: SslStatus
}
