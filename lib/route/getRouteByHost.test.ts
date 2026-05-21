// lib/route/getRouteByHost.test.ts — smoke test do resolver multi-host (ADR-0026).
//
// Pós-Fase-4 (ADR-0044): além do shape de Brand+Tenant, garante que o select
// inclui active_theme_version (join nested) sem quebrar a compilação.

import { afterEach, describe, expect, it, vi } from 'vitest'

// Mock `server-only` — getRouteByHost importa via 'server-only' guard.
vi.mock('server-only', () => ({}))

// Mock do admin client (BYPASS RLS via service role)
interface MockQuery {
  selectArg?: string
  eqCalls: Array<{ col: string; val: unknown }>
  isCalls: Array<{ col: string; val: unknown }>
  notCalls: Array<{ col: string; mode: string; val: unknown }>
  result: { data: unknown; error: unknown }
}

const lastQueries: MockQuery[] = []

function makeMockBuilder(result: { data: unknown; error: unknown }): MockQuery {
  const query: MockQuery = {
    eqCalls: [],
    isCalls: [],
    notCalls: [],
    result,
  }
  return query
}

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => ({
    from: () => {
      const builder: MockQuery & {
        select: (s: string) => typeof builder
        eq: (col: string, val: unknown) => typeof builder
        not: (col: string, mode: string, val: unknown) => typeof builder
        maybeSingle: () => Promise<{ data: unknown; error: unknown }>
      } = Object.assign(makeMockBuilder({ data: null, error: null }), {
        select(this: MockQuery, s: string) {
          this.selectArg = s
          return builder
        },
        eq(this: MockQuery, col: string, val: unknown) {
          this.eqCalls.push({ col, val })
          return builder
        },
        not(this: MockQuery, col: string, mode: string, val: unknown) {
          this.notCalls.push({ col, mode, val })
          return builder
        },
        maybeSingle: async () => ({ data: null, error: null }),
      })
      lastQueries.push(builder)
      return builder
    },
  }),
}))

afterEach(() => {
  lastQueries.length = 0
})

describe('getRouteByHost', () => {
  it('compila e roda sem throw, retornando null pra host não cadastrado', async () => {
    // Import dinâmico DEPOIS do mock
    const mod = await import('./getRouteByHost')
    // Limpa cache pra isolar caso (cache key é hostname normalizado)
    mod.invalidateRouteCache()
    const route = await mod.getRouteByHost('unknown-host-test-abc-123.example.com')
    expect(route).toBeNull()
  })

  it('select da query domains inclui active_theme_version (Fase 4 ADR-0044)', async () => {
    const mod = await import('./getRouteByHost')
    mod.invalidateRouteCache()
    await mod.getRouteByHost('unknown-host-for-shape-check.example.com')

    // primeira query = lookup em `domains` table
    const domainsQuery = lastQueries[0]
    expect(domainsQuery?.selectArg).toBeDefined()
    expect(domainsQuery?.selectArg).toContain('active_theme_version_id')
    expect(domainsQuery?.selectArg).toContain('active_theme_version')
    expect(domainsQuery?.selectArg).toContain('snapshot')
    expect(domainsQuery?.selectArg).toContain('theme_mode')
  })
})
