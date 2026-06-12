// lib/ai/prompts/__tests__/smoke-composer.test.ts
// Sprint 1.4.B — smoke test composer output end-to-end (não substitui TB22
// browser real, mas garante shape válido pra streamText sem rodar AI Gateway).

import { describe, expect, it } from 'vitest'

import type { Brand } from '@/lib/brand/types'
import type { Database } from '@/lib/contracts/database'

import { composeChatSystemPrompt } from '../chat-overlay'

type TenantRow = Database['public']['Tables']['tenants']['Row']

const BRAND: Brand = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'desafit',
  host: 'desafit.app',
  logo_url: null,
  default_vertical: 'fitness',
  parent_label: null,
  theme_version: 1,
}

function makeTenant(overrides: Partial<TenantRow> & { business_profile?: unknown }): TenantRow {
  return {
    active_theme_version_id: null,
    brand_id: BRAND.id,
    business_profile: {},
    created_at: '2026-05-27T00:00:00Z',
    default_currency: 'BRL',
    default_locale: 'pt-BR',
    default_tz: 'America/Sao_Paulo',
    deleted_at: null,
    deletion_scheduled_at: null,
    id: '11111111-1111-1111-1111-111111111111',
    lifecycle_state: 'active',
    logo_url: null,
    name: 'João Silva',
    owner_user_id: null,
    pixels: {},
    plan_status: 'trialing',
    skip_plan_gate: false,
    slug: 'joao',
    suspended_at: null,
    suspended_reason: null,
    theme_mode: 'auto',
    theme_version: 1,
    tour_completed_at: null,
    trial_expires_at: null,
    trial_started_at: null,
    updated_at: '2026-05-27T00:00:00Z',
    vapid_public_key: null,
    vertical: 'fitness',
    ...overrides,
  }
}

describe('smoke — composer real shape', () => {
  it('end-to-end happy path (brand + tenant completo + geo)', () => {
    const result = composeChatSystemPrompt({
      brand: BRAND,
      tenant: makeTenant({
        business_profile: {
          profession: 'personal',
          modality: 'online',
          format: 'individual',
          delivery: 'mixed',
          program_status: 'structured',
          has_pages: 'some',
          completed_at: '2026-05-27T00:00:00Z',
        },
      }),
      geoHints: { city: 'São Paulo', country: 'BR' },
    })

    // Static: 5 segments (identity/capabilities/restrictions/tone/backbone) + artifactsPrompt
    expect(result.static).toContain('═══ IDENTITY ═══')
    expect(result.static).toContain('desafit')
    expect(result.static).toContain('═══ CAPABILITIES ═══')
    expect(result.static).toContain('═══ RESTRICTIONS ═══')
    expect(result.static).toContain('═══ TONE ═══')
    expect(result.static).toContain('MODO ARTIFACTS')
    // Universe B 12 kinds
    expect(result.static).toMatch(/`text`/)
    expect(result.static).toMatch(/`mermaid`/)
    expect(result.static).toMatch(/`pptx`/)
    // Static é grande mas razoável (5-8k chars típico)
    expect(result.static.length).toBeGreaterThan(3000)
    expect(result.static.length).toBeLessThan(15000)

    // Dynamic: TENANT CONTEXT + GEO
    expect(result.dynamic).toContain('═══ TENANT CONTEXT ═══')
    expect(result.dynamic).toContain('João Silva')
    expect(result.dynamic).toContain('Perfil de negócio preenchido')
    expect(result.dynamic).toContain('São Paulo')
    // Dynamic é menor (1-2k chars típico)
    expect(result.dynamic.length).toBeGreaterThan(200)
    expect(result.dynamic.length).toBeLessThan(5000)
  })

  it('end-to-end edge case (business_profile vazio)', () => {
    const result = composeChatSystemPrompt({
      brand: BRAND,
      tenant: makeTenant({ business_profile: { profession: 'personal' } }),
    })

    expect(result.dynamic).toContain('Perfil de negócio ainda NÃO foi preenchido')
    expect(result.dynamic).toMatch(/perfil-negocio/)
    expect(result.dynamic).toMatch(/UMA VEZ/i)
    expect(result.dynamic).not.toContain('Modalidade:')
  })

  it('end-to-end degraded (tenant=null)', () => {
    const result = composeChatSystemPrompt({
      brand: BRAND,
      tenant: null,
    })

    // Static deve renderizar normal
    expect(result.static).toContain('═══ IDENTITY ═══')
    // Dynamic vazio
    expect(result.dynamic).toBe('')
  })

  it('cache hit cross-tenant: 2 tenants do mesmo brand têm static IDÊNTICO', () => {
    const a = composeChatSystemPrompt({
      brand: BRAND,
      tenant: makeTenant({ name: 'Tenant A', id: '11111111-1111-1111-1111-111111111111' }),
    })
    const b = composeChatSystemPrompt({
      brand: BRAND,
      tenant: makeTenant({ name: 'Tenant B', id: '22222222-2222-2222-2222-222222222222' }),
    })
    expect(a.static).toBe(b.static)
    expect(a.dynamic).not.toBe(b.dynamic)
  })

  it('cache invalidation per-brand: brands diferentes têm static DIFERENTE', () => {
    const yogaBrand: Brand = { ...BRAND, name: 'yoga', host: 'yoga.app' }
    const a = composeChatSystemPrompt({
      brand: BRAND,
      tenant: makeTenant({}),
    })
    const b = composeChatSystemPrompt({
      brand: yogaBrand,
      tenant: makeTenant({}),
    })
    expect(a.static).not.toBe(b.static)
    expect(b.static).toContain('yoga')
  })
})
