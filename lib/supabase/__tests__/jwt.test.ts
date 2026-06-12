import { describe, expect, it } from 'vitest'

import { getTenantIdFromJwt, requireTenantId, type SupabaseJwt } from '../jwt'

const TENANT_A = '00000000-0000-4000-8000-000000000001'
const TENANT_B = '00000000-0000-4000-8000-000000000002'

describe('getTenantIdFromJwt', () => {
  it('lê app_metadata.tenant_id (hook custom_access_token_hook 0029)', () => {
    const jwt: SupabaseJwt = {
      sub: 'user-1',
      app_metadata: { tenant_id: TENANT_A },
    }
    expect(getTenantIdFromJwt(jwt)).toBe(TENANT_A)
  })

  it('cai pro raiz tenant_id legacy quando app_metadata ausente (dual-read I21)', () => {
    const jwt: SupabaseJwt = {
      sub: 'user-1',
      tenant_id: TENANT_B,
    }
    expect(getTenantIdFromJwt(jwt)).toBe(TENANT_B)
  })

  it('preferência: app_metadata vence raiz quando ambos presentes', () => {
    const jwt: SupabaseJwt = {
      sub: 'user-1',
      app_metadata: { tenant_id: TENANT_A },
      tenant_id: TENANT_B,
    }
    expect(getTenantIdFromJwt(jwt)).toBe(TENANT_A)
  })

  it('retorna null quando JWT sem tenant_id em nenhum lugar', () => {
    const jwt: SupabaseJwt = { sub: 'user-novo-sem-membership' }
    expect(getTenantIdFromJwt(jwt)).toBeNull()
  })

  it('retorna null quando jwt é null ou undefined', () => {
    expect(getTenantIdFromJwt(null)).toBeNull()
    expect(getTenantIdFromJwt(undefined)).toBeNull()
  })

  it('retorna null quando app_metadata.tenant_id é string vazia', () => {
    const jwt: SupabaseJwt = {
      sub: 'user-1',
      app_metadata: { tenant_id: '' },
    }
    expect(getTenantIdFromJwt(jwt)).toBeNull()
  })

  it('retorna null quando app_metadata.tenant_id não é string (defensive)', () => {
    const jwt: SupabaseJwt = {
      sub: 'user-1',
      app_metadata: { tenant_id: 123 as unknown as string },
    }
    expect(getTenantIdFromJwt(jwt)).toBeNull()
  })
})

describe('requireTenantId', () => {
  it('retorna tenant_id quando presente em app_metadata', () => {
    const jwt: SupabaseJwt = {
      sub: 'user-1',
      app_metadata: { tenant_id: TENANT_A },
    }
    expect(requireTenantId(jwt)).toBe(TENANT_A)
  })

  it('throws AppError unauthorized com i18n key quando ausente', () => {
    expect(() => requireTenantId({ sub: 'user-sem-tenant' })).toThrow()
    try {
      requireTenantId({ sub: 'user-sem-tenant' })
    } catch (err) {
      const error = err as { code: string; metadata?: { i18nKey?: string } }
      expect(error.code).toBe('unauthorized')
      expect(error.metadata?.i18nKey).toBe('auth.tenantRequired')
    }
  })

  it('throws quando jwt é null/undefined', () => {
    expect(() => requireTenantId(null)).toThrow()
    expect(() => requireTenantId(undefined)).toThrow()
  })
})
