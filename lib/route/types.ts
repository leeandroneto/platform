// lib/route/types.ts — Tipo Tenant + ResolvedRoute (ADR-0026).

export interface Tenant {
  readonly id: string
  readonly slug: string // 'joao' (subdomain-safe)
  readonly brand_id: string // FK platform.brands
  readonly name: string // 'João Silva — Personal'
  readonly vertical: string // 'fitness' | 'yoga' | 'english' | ...
  readonly theme_version: number // pra cache busting de tenant theme override
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
