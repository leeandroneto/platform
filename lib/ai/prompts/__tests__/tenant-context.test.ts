// lib/ai/prompts/__tests__/tenant-context.test.ts
// Sprint 1.4.B — cobertura TENANT CONTEXT segment do system prompt v2.

import { describe, expect, it } from 'vitest'

import type { Database } from '@/lib/contracts/database'

import { buildTenantContextPrompt } from '../tenant-context'

type TenantRow = Database['public']['Tables']['tenants']['Row']

function makeTenant(overrides: Partial<TenantRow> & { business_profile?: unknown }): TenantRow {
  return {
    active_theme_version_id: null,
    brand_id: '00000000-0000-0000-0000-000000000000',
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
    name: 'João Silva — Personal',
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

describe('buildTenantContextPrompt — branches', () => {
  it('inclui header TENANT CONTEXT canonical', () => {
    const result = buildTenantContextPrompt({ tenant: makeTenant({}) })
    expect(result).toContain('═══ TENANT CONTEXT ═══')
  })

  it('interpola tenant.name', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ name: 'Acme Fitness' }),
    })
    expect(result).toContain('Acme Fitness')
  })

  it('mapa profession → label PT-BR (personal)', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ business_profile: { profession: 'personal' } }),
    })
    expect(result).toMatch(/personal/i)
    expect(result).toMatch(/educação física/i)
  })

  it('mapa profession → label PT-BR (nutritionist)', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ business_profile: { profession: 'nutritionist' } }),
    })
    expect(result).toMatch(/nutricionista/i)
  })

  it('fallback "profissional" quando profession ausente', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ business_profile: {} }),
    })
    expect(result).toMatch(/profissional/i)
  })
})

describe('buildTenantContextPrompt — completed_at PRESENTE', () => {
  it('renderiza modalidade quando presente', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({
        business_profile: {
          profession: 'personal',
          modality: 'online',
          completed_at: '2026-05-27T10:00:00Z',
        },
      }),
    })
    expect(result).toMatch(/Modalidade:.*online/i)
  })

  it('renderiza todas 5 chaves quando completas', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({
        business_profile: {
          profession: 'coach',
          modality: 'hybrid',
          format: 'both',
          delivery: 'mixed',
          program_status: 'structured',
          has_pages: 'some',
          completed_at: '2026-05-27T10:00:00Z',
        },
      }),
    })
    expect(result).toMatch(/Modalidade/i)
    expect(result).toMatch(/Formato/i)
    expect(result).toMatch(/Entrega/i)
    expect(result).toMatch(/Programas/i)
    expect(result).toMatch(/Páginas/i)
  })

  it('NÃO sugere completar setup quando completed_at presente', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({
        business_profile: {
          profession: 'personal',
          completed_at: '2026-05-27T10:00:00Z',
        },
      }),
    })
    expect(result).not.toMatch(/perfil-negocio/i)
  })
})

describe('buildTenantContextPrompt — completed_at NULL', () => {
  it('sugere completar setup UMA vez quando vazio', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ business_profile: {} }),
    })
    expect(result).toMatch(/\/configuracoes\/perfil-negocio/)
    expect(result).toMatch(/UMA VEZ/i)
  })

  it('orienta NÃO insistir', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ business_profile: {} }),
    })
    expect(result).toMatch(/NÃO insista/i)
  })

  it('NÃO lista chaves quando vazio', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ business_profile: { profession: 'personal' } }),
    })
    expect(result).not.toMatch(/Modalidade:/)
  })
})

describe('buildTenantContextPrompt — determinismo', () => {
  it('mesma input = mesma output (cacheable per-tenant)', () => {
    const tenant = makeTenant({
      business_profile: { profession: 'personal', completed_at: '2026-05-27T10:00:00Z' },
    })
    const a = buildTenantContextPrompt({ tenant })
    const b = buildTenantContextPrompt({ tenant })
    expect(a).toBe(b)
  })

  it('NÃO contém timestamp/random — string estável', () => {
    const tenant = makeTenant({ business_profile: { profession: 'personal' } })
    const result = buildTenantContextPrompt({ tenant })
    // Sem ISO timestamp gerado em runtime (apenas se vier do tenant data)
    expect(result).not.toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
  })
})

describe('buildTenantContextPrompt — vocab', () => {
  it('NÃO contém vocab banido', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ business_profile: { profession: 'personal' } }),
    })
    // split-string sentinels pra evitar audit false-positive
    const banned = ['w' + 'izard', 'i' + 'ntake', 't' + 'rainer ', 'work' + 'space']
    for (const term of banned) {
      expect(result.toLowerCase()).not.toContain(term.toLowerCase())
    }
  })

  it('usa "setup" e "perfil-negocio" (vocab canonical)', () => {
    const result = buildTenantContextPrompt({
      tenant: makeTenant({ business_profile: {} }),
    })
    expect(result).toMatch(/setup/i)
    expect(result).toMatch(/perfil-negocio/)
  })
})
