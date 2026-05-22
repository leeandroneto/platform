// app/temas/actions.test.ts — Vitest companheiro (Fase 4 ADR-0044).
//
// Cobre os 4 testes mínimos do escopo:
//   1. Bootstrap from null → cria 1 theme + 1 version
//   2. Save snapshot inválido → fail(invalidInput)
//   3. Cap 50 → trigger lança erro, action retorna fail
//   4. Restore com versionId de outro tenant → fail(forbidden)
//
// Mocking strategy: stub @/lib/supabase/{admin,server}. Tests não tocam DB
// real — validam que o caminho de erro/sucesso da action é correto.

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

// ─── Mocks de Supabase clients ──────────────────────────────────────────────

// Estado mutável dos stubs entre testes
type MaybeSingleResult = { data: unknown; error: unknown }
type ChainQuery = {
  select: (q?: string) => ChainQuery
  insert: (row: unknown) => ChainQuery
  update: (patch: unknown) => ChainQuery
  delete: () => ChainQuery
  eq: (col: string, val: unknown) => ChainQuery
  order: (col: string, opts?: unknown) => ChainQuery
  limit: (n: number) => ChainQuery
  maybeSingle: () => Promise<MaybeSingleResult>
  single: () => Promise<MaybeSingleResult>
}

interface MockState {
  currentTenantId: string | null
  // Resposta da próxima chamada `.maybeSingle()` ou `.single()` por tabela
  // (FIFO queue per "operation" registrada via setTableResponse)
  responses: Map<string, MaybeSingleResult[]>
  // Captura de operações pra asserções
  ops: Array<{ table: string; op: string; payload?: unknown }>
}

const mockState: MockState = {
  currentTenantId: 'tenant-aaa',
  responses: new Map(),
  ops: [],
}

function pushResponse(key: string, response: MaybeSingleResult) {
  const arr = mockState.responses.get(key) ?? []
  arr.push(response)
  mockState.responses.set(key, arr)
}

function popResponse(key: string): MaybeSingleResult {
  const arr = mockState.responses.get(key) ?? []
  const r = arr.shift()
  if (!r) {
    return { data: null, error: { message: `no mock response queued for ${key}` } }
  }
  return r
}

function makeChain(table: string, currentOp = ''): ChainQuery {
  const chain: ChainQuery = {
    select: (q?: string) => {
      mockState.ops.push({ table, op: 'select', payload: q })
      return chain
    },
    insert: (row: unknown) => {
      mockState.ops.push({ table, op: 'insert', payload: row })
      return makeChain(table, 'insert')
    },
    update: (patch: unknown) => {
      mockState.ops.push({ table, op: 'update', payload: patch })
      return makeChain(table, 'update')
    },
    delete: () => {
      mockState.ops.push({ table, op: 'delete' })
      return makeChain(table, 'delete')
    },
    eq: (col: string, val: unknown) => {
      mockState.ops.push({ table, op: 'eq', payload: { col, val } })
      return chain
    },
    order: () => chain,
    limit: () => chain,
    maybeSingle: () => {
      const key = `${table}:${currentOp || 'select'}:maybeSingle`
      return Promise.resolve(popResponse(key))
    },
    single: () => {
      const key = `${table}:${currentOp || 'select'}:single`
      return Promise.resolve(popResponse(key))
    },
  }
  return chain
}

const adminClient = {
  from: (table: string) => makeChain(table),
}

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: () => adminClient,
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    rpc: async (name: string) => {
      if (name === 'current_tenant_id') {
        return { data: mockState.currentTenantId, error: null }
      }
      return { data: null, error: { message: `unmocked rpc ${name}` } }
    },
  }),
}))

vi.mock('server-only', () => ({}))

// Após mocks, importa actions
const actions = await import('./actions')

beforeEach(() => {
  mockState.currentTenantId = 'tenant-aaa'
  mockState.responses.clear()
  mockState.ops = []
})

// ─── 1. bootstrapTenantTheme: cria theme + version quando NULL ──────────────

describe('bootstrapTenantTheme', () => {
  it('cria theme + version v1 quando active_theme_version_id IS NULL', async () => {
    // Tenant existe, sem active_theme_version_id
    pushResponse('tenants:select:maybeSingle', {
      data: { id: 'tenant-aaa', active_theme_version_id: null },
      error: null,
    })
    // INSERT tenant_themes retorna { id }
    pushResponse('tenant_themes:insert:single', {
      data: { id: 'theme-1' },
      error: null,
    })
    // INSERT tenant_theme_versions retorna { id, version_number }
    pushResponse('tenant_theme_versions:insert:single', {
      data: { id: 'version-1', version_number: 1 },
      error: null,
    })

    const result = await actions.bootstrapTenantTheme('tenant-aaa')

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.themeId).toBe('theme-1')
      expect(result.data.versionId).toBe('version-1')
      expect(result.data.versionNumber).toBe(1)
      expect(result.data.bootstrapped).toBe(true)
    }
  })

  it('rejeita quando JWT tenant_id não bate', async () => {
    mockState.currentTenantId = 'tenant-bbb' // diferente do arg

    const result = await actions.bootstrapTenantTheme('tenant-aaa')

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('forbidden')
    }
  })
})

// ─── 2. saveThemeVersion: snapshot inválido → fail(invalidInput) ────────────

describe('saveThemeVersion', () => {
  it('retorna fail(invalidInput) quando snapshot não passa Zod', async () => {
    const result = await actions.saveThemeVersion({
      themeId: 'theme-1',
      snapshot: { foo: 'bar' }, // shape inválida
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_input')
      expect(result.error.metadata).toHaveProperty('i18nKey', 'themes.snapshot_invalid')
    }
  })

  it('cap 50 trigger → fail(invalidInput) com key version_limit_reached', async () => {
    // Theme existe e pertence ao tenant atual
    pushResponse('tenant_themes:select:maybeSingle', {
      data: { id: 'theme-1', tenant_id: 'tenant-aaa' },
      error: null,
    })
    // max(version_number) = 50
    pushResponse('tenant_theme_versions:select:maybeSingle', {
      data: { version_number: 50 },
      error: null,
    })
    // INSERT falha por trigger cap
    pushResponse('tenant_theme_versions:insert:single', {
      data: null,
      error: { message: 'theme version cap reached (50). delete antigas ou crie novo theme' },
    })

    const result = await actions.saveThemeVersion({
      themeId: 'theme-1',
      snapshot: DEFAULT_THEME,
      ignoreApcaWarning: true, // cap test is about version limit, not APCA
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_input')
      expect(result.error.metadata).toHaveProperty('i18nKey', 'themes.version_limit_reached')
    }
  })

  it('cria nova version quando snapshot válido + sem cap atingido', async () => {
    pushResponse('tenant_themes:select:maybeSingle', {
      data: { id: 'theme-1', tenant_id: 'tenant-aaa' },
      error: null,
    })
    pushResponse('tenant_theme_versions:select:maybeSingle', {
      data: { version_number: 3 },
      error: null,
    })
    pushResponse('tenant_theme_versions:insert:single', {
      data: { id: 'version-4', version_number: 4 },
      error: null,
    })

    const result = await actions.saveThemeVersion({
      themeId: 'theme-1',
      snapshot: DEFAULT_THEME,
      ignoreApcaWarning: true, // save mechanics test, not APCA
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.versionNumber).toBe(4)
      expect(result.data.versionId).toBe('version-4')
    }
  })
})

// ─── 3. restoreThemeVersion: cross-tenant version → fail(forbidden) ─────────

describe('restoreThemeVersion', () => {
  it('rejeita restore quando version pertence a outro tenant', async () => {
    // Version existe mas pertence ao tenant-bbb
    pushResponse('tenant_theme_versions:select:maybeSingle', {
      data: {
        id: 'version-x',
        version_number: 2,
        theme_id: 'theme-other',
        tenant_themes: { tenant_id: 'tenant-bbb' },
      },
      error: null,
    })

    const result = await actions.restoreThemeVersion({
      tenantId: 'tenant-aaa',
      versionId: 'version-x',
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('forbidden')
    }
  })

  it('aplica restore como swap de FK quando ownership confere', async () => {
    pushResponse('tenant_theme_versions:select:maybeSingle', {
      data: {
        id: 'version-1',
        version_number: 1,
        theme_id: 'theme-1',
        tenant_themes: { tenant_id: 'tenant-aaa' },
      },
      error: null,
    })
    // UPDATE tenants retorna sem erro
    pushResponse('tenants:update:maybeSingle', { data: null, error: null })

    const result = await actions.restoreThemeVersion({
      tenantId: 'tenant-aaa',
      versionId: 'version-1',
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.activeVersionId).toBe('version-1')
      expect(result.data.activeVersionNumber).toBe(1)
    }
  })
})

// ─── 4. saveThemeVersion: APCA dual-gate ────────────────────────────────────

// Low-contrast theme: foreground == background (Lc ~0) — guaranteed APCA fail
const LOW_CONTRAST_THEME = {
  ...DEFAULT_THEME,
  light: {
    ...DEFAULT_THEME.light,
    foreground: 'oklch(1 0 0)', // same as background
    background: 'oklch(1 0 0)',
    'card-foreground': 'oklch(1 0 0)',
    card: 'oklch(1 0 0)',
    'popover-foreground': 'oklch(1 0 0)',
    popover: 'oklch(1 0 0)',
  },
  dark: {
    ...DEFAULT_THEME.dark,
    foreground: 'oklch(0.145 0 0)',
    background: 'oklch(0.145 0 0)', // same — low contrast dark
  },
}

describe('saveThemeVersion — APCA dual-gate', () => {
  it('retorna fail(invalidInput) com key theme.apca.failed quando APCA falha e ignoreApcaWarning ausente', async () => {
    // Ownership check passes; APCA gate runs after and fails (no version needed)
    pushResponse('tenant_themes:select:maybeSingle', {
      data: { id: 'theme-1', tenant_id: 'tenant-aaa' },
      error: null,
    })

    const result = await actions.saveThemeVersion({
      themeId: 'theme-1',
      snapshot: LOW_CONTRAST_THEME,
    })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_input')
      expect(result.error.metadata).toHaveProperty('i18nKey', 'theme.apca.failed')
      expect(result.error.metadata?.failures).toBeDefined()
    }
  })

  it('ignora APCA fail e salva quando ignoreApcaWarning=true', async () => {
    pushResponse('tenant_themes:select:maybeSingle', {
      data: { id: 'theme-1', tenant_id: 'tenant-aaa' },
      error: null,
    })
    pushResponse('tenant_theme_versions:select:maybeSingle', {
      data: { version_number: 2 },
      error: null,
    })
    pushResponse('tenant_theme_versions:insert:single', {
      data: { id: 'version-3', version_number: 3 },
      error: null,
    })

    const result = await actions.saveThemeVersion({
      themeId: 'theme-1',
      snapshot: LOW_CONTRAST_THEME,
      ignoreApcaWarning: true,
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.versionNumber).toBe(3)
    }
  })

  it('ok quando snapshot passa APCA (high-contrast black-on-white)', async () => {
    // Pure black-on-white with high-contrast border — guaranteed APCA Silver pass
    const HIGH_CONTRAST_THEME = {
      ...DEFAULT_THEME,
      light: {
        ...DEFAULT_THEME.light,
        background: 'oklch(1 0 0)', // white
        foreground: 'oklch(0 0 0)', // black — Lc ≈ 108 (body ≥75 ✓)
        card: 'oklch(1 0 0)',
        'card-foreground': 'oklch(0 0 0)',
        popover: 'oklch(1 0 0)',
        'popover-foreground': 'oklch(0 0 0)',
        primary: 'oklch(0.2 0 0)',
        'primary-foreground': 'oklch(0.98 0 0)',
        secondary: 'oklch(0.2 0 0)',
        'secondary-foreground': 'oklch(0.98 0 0)',
        border: 'oklch(0 0 0)', // pure black border vs white bg — Lc ≈ 108 (non-text ≥45 ✓)
        input: 'oklch(0 0 0)',
        ring: 'oklch(0 0 0)',
      },
      dark: {
        ...DEFAULT_THEME.dark,
        background: 'oklch(0 0 0)', // black
        foreground: 'oklch(1 0 0)', // white — Lc ≈ 108 ✓
        card: 'oklch(0 0 0)',
        'card-foreground': 'oklch(1 0 0)',
        popover: 'oklch(0 0 0)',
        'popover-foreground': 'oklch(1 0 0)',
        primary: 'oklch(0.9 0 0)',
        'primary-foreground': 'oklch(0.1 0 0)',
        secondary: 'oklch(0.9 0 0)',
        'secondary-foreground': 'oklch(0.1 0 0)',
        border: 'oklch(1 0 0)', // white border vs black bg — Lc ≈ 108 (non-text ≥45 ✓)
        input: 'oklch(1 0 0)',
        ring: 'oklch(1 0 0)',
      },
    }

    pushResponse('tenant_themes:select:maybeSingle', {
      data: { id: 'theme-1', tenant_id: 'tenant-aaa' },
      error: null,
    })
    pushResponse('tenant_theme_versions:select:maybeSingle', {
      data: { version_number: 5 },
      error: null,
    })
    pushResponse('tenant_theme_versions:insert:single', {
      data: { id: 'version-6', version_number: 6 },
      error: null,
    })

    const result = await actions.saveThemeVersion({
      themeId: 'theme-1',
      snapshot: HIGH_CONTRAST_THEME,
    })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.versionNumber).toBe(6)
    }
  })
})

// ─── 5. forkTheme ────────────────────────────────────────────────────────────

vi.mock('@/lib/entitlements/server', () => ({
  requireEntitlement: vi.fn().mockResolvedValue(undefined),
}))

// Valid RFC-4122 UUIDs for forkTheme tests (Zod 4 uuid validates version nibble [1-8])
const VALID_UUID_1 = 'a1b2c3d4-e5f6-4a7b-8c9d-e0f1a2b3c4d5'
const VALID_UUID_2 = 'f1e2d3c4-b5a6-4978-bced-f0a1b2c3d4e5'

describe('forkTheme', () => {
  it('retorna fail(invalidInput) com UUID inválido', async () => {
    const result = await actions.forkTheme({ themeId: 'not-a-uuid' })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('invalid_input')
    }
  })

  it('retorna fail(not_found) quando tema não existe', async () => {
    pushResponse('tenant_themes:select:maybeSingle', {
      data: null,
      error: null,
    })

    const result = await actions.forkTheme({ themeId: VALID_UUID_1 })

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.code).toBe('not_found')
    }
  })

  it('retorna ok({ id }) com nome gerado quando fork sucesso', async () => {
    pushResponse('tenant_themes:select:maybeSingle', {
      data: {
        id: VALID_UUID_1,
        tenant_id: 'tenant-aaa',
        name: 'Default',
      },
      error: null,
    })
    pushResponse('tenant_theme_versions:select:maybeSingle', {
      data: { snapshot: DEFAULT_THEME },
      error: null,
    })
    pushResponse('tenant_themes:insert:single', {
      data: { id: VALID_UUID_2 },
      error: null,
    })
    // INSERT tenant_theme_versions uses .insert() without .single() —
    // no mock response needed; chain returns undefined error (falsy → success)

    const result = await actions.forkTheme({ themeId: VALID_UUID_1 })

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.id).toBe(VALID_UUID_2)
    }
  })
})
