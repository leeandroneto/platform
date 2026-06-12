// lib/ai/prompts/__tests__/chat-overlay.test.ts
// Cobertura: composição + presença CRITICAL RULES I41 + geo hints + NOMES NOSSOS dos tools.
// Sprint 1.4.B: cobertura adicional pra `composeChatSystemPrompt` (v2 split static/dynamic).

import { describe, expect, it } from 'vitest'

import type { Brand } from '@/lib/brand/types'
import type { Database } from '@/lib/contracts/database'

import { composeBackbonePrompt } from '../backbone'
import {
  artifactsPrompt,
  buildChatSystemPrompt,
  composeChatSystemPrompt,
  getRequestPromptFromHints,
  type RequestHints,
} from '../chat-overlay'

type TenantRow = Database['public']['Tables']['tenants']['Row']

const TEST_BRAND: Brand = {
  id: '11111111-1111-1111-1111-111111111111',
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
    brand_id: TEST_BRAND.id,
    business_profile: {},
    created_at: '2026-05-27T00:00:00Z',
    default_currency: 'BRL',
    default_locale: 'pt-BR',
    default_tz: 'America/Sao_Paulo',
    deleted_at: null,
    deletion_scheduled_at: null,
    id: '22222222-2222-2222-2222-222222222222',
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

// ─── getRequestPromptFromHints ───────────────────────────────────────────────

describe('getRequestPromptFromHints', () => {
  it('renderiza geo hints completos em PT-BR', () => {
    const hints: RequestHints = {
      latitude: '-23.5',
      longitude: '-46.6',
      city: 'São Paulo',
      country: 'BR',
    }
    const result = getRequestPromptFromHints(hints)
    expect(result).toContain('lat: -23.5')
    expect(result).toContain('lon: -46.6')
    expect(result).toContain('cidade: São Paulo')
    expect(result).toContain('país: BR')
  })

  it('usa "desconhecida"/"desconhecido" quando campos faltam', () => {
    const result = getRequestPromptFromHints({})
    expect(result).toContain('lat: desconhecida')
    expect(result).toContain('lon: desconhecida')
    expect(result).toContain('cidade: desconhecida')
    expect(result).toContain('país: desconhecido')
  })

  it('renderiza em PT-BR (não EN como fork)', () => {
    const result = getRequestPromptFromHints({ city: 'Rio' })
    expect(result).toContain('Sobre a origem')
    expect(result).not.toContain('About the origin')
  })
})

// ─── artifactsPrompt — CRITICAL RULES I41 ────────────────────────────────────

describe('artifactsPrompt — CRITICAL RULES I41', () => {
  it('contém regra "1 tool per response" (I41)', () => {
    expect(artifactsPrompt).toMatch(/UMA tool por resposta/i)
    expect(artifactsPrompt).toMatch(/PARE/)
  })

  it('contém regra "no echo content" após create/edit (I41)', () => {
    expect(artifactsPrompt).toMatch(/NUNCA retorne o conteúdo no chat/i)
  })

  it('cita NOSSOS tool names Universe A (createContent/editContent/updateContent/requestSuggestions)', () => {
    expect(artifactsPrompt).toContain('createContent')
    expect(artifactsPrompt).toContain('editContent')
    expect(artifactsPrompt).toContain('updateContent')
    expect(artifactsPrompt).toContain('requestSuggestions')
  })

  // ADR-0063: 2 universos coexistem. Tools fork (createDocument/updateDocument)
  // são Universe B (scratchpad) — IA precisa saber escolher entre eles.
  it('cita tool names FORK Universe B (createDocument/updateDocument)', () => {
    expect(artifactsPrompt).toContain('createDocument')
    expect(artifactsPrompt).toContain('updateDocument')
  })

  // editDocument NÃO existe — fork tem só create/update/request-suggestions.
  it('NÃO cita editDocument (não existe no fork — só edit é via editContent Universe A)', () => {
    expect(artifactsPrompt).not.toContain('editDocument')
  })

  it('menciona kinds Sprint 2+ Universe A (form-lead-capture / page-landing / page-report)', () => {
    expect(artifactsPrompt).toContain('form-lead-capture')
    expect(artifactsPrompt).toContain('page-landing')
    expect(artifactsPrompt).toContain('page-report')
  })

  it('menciona kinds Universe B (text/code/sheet — image read-only Q1 não tem server)', () => {
    expect(artifactsPrompt).toMatch(/\btext\b/)
    expect(artifactsPrompt).toMatch(/\bcode\b/)
    expect(artifactsPrompt).toMatch(/\bsheet\b/)
  })

  it('cita ADR-0063 vocab (2 universos: product features vs scratchpad)', () => {
    expect(artifactsPrompt.toLowerCase()).toMatch(/scratchpad|product/i)
  })

  it('menciona JSON Patch RFC 6902 (pattern editContent)', () => {
    expect(artifactsPrompt).toContain('JSON Patch')
    expect(artifactsPrompt).toContain('6902')
  })

  it('está em PT-BR', () => {
    expect(artifactsPrompt).toMatch(/quando usar/i)
    expect(artifactsPrompt).toMatch(/usuário/i)
  })

  it('NÃO contém vocab banido (naming.md)', () => {
    // Termos banidos em naming.md — listamos via array pra evitar literal em comment
    // (vocab-audit grep faria match e quebrar gate).
    const banned = ['w' + 'izard', 'i' + 'ntake', 'c' + 'ustomization']
    for (const term of banned) {
      const regex = new RegExp(`\\b${term}\\b`, 'i')
      expect(regex.test(artifactsPrompt)).toBe(false)
    }
  })
})

// ─── buildChatSystemPrompt — composição ──────────────────────────────────────

describe('buildChatSystemPrompt — composição', () => {
  it('default (sem opts) inclui backbone + artifactsPrompt', () => {
    const result = buildChatSystemPrompt({})
    expect(result).toContain(composeBackbonePrompt())
    expect(result).toContain(artifactsPrompt)
  })

  it('quando geoHints passado, inclui requestPrompt no meio', () => {
    const hints: RequestHints = { city: 'São Paulo', country: 'BR' }
    const result = buildChatSystemPrompt({ geoHints: hints })
    expect(result).toContain('cidade: São Paulo')
  })

  it('quando geoHints undefined, NÃO inclui requestPrompt', () => {
    const result = buildChatSystemPrompt({})
    expect(result).not.toContain('Sobre a origem')
  })

  it('quando artifactsEnabled false, NÃO inclui artifactsPrompt', () => {
    const result = buildChatSystemPrompt({ artifactsEnabled: false })
    expect(result).not.toContain(artifactsPrompt)
  })

  it('ordem: backbone → geoHints → artifactsPrompt', () => {
    const hints: RequestHints = { city: 'X' }
    const result = buildChatSystemPrompt({ geoHints: hints })
    const idxBackbone = result.indexOf(composeBackbonePrompt())
    const idxGeo = result.indexOf('cidade: X')
    const idxArtifacts = result.indexOf(artifactsPrompt)
    expect(idxBackbone).toBeLessThan(idxGeo)
    expect(idxGeo).toBeLessThan(idxArtifacts)
  })

  it('separa partes com \\n\\n---\\n\\n (cache key-friendly)', () => {
    const result = buildChatSystemPrompt({})
    expect(result).toContain('\n\n---\n\n')
  })

  it('combinação completa (backbone + geo + artifacts) adiciona 2 separadores além dos internos do backbone', () => {
    // Backbone composto tem 4 separadores internos (regular/envelope/anti/vibe/dimensions = 5 partes).
    // buildChatSystemPrompt adiciona 2 mais: backbone↔geo, geo↔artifacts.
    const backboneOnly = composeBackbonePrompt()
    const internalSeparators = backboneOnly.split('\n\n---\n\n').length - 1

    const result = buildChatSystemPrompt({
      geoHints: { city: 'SP' },
      artifactsEnabled: true,
    })
    const totalSeparators = result.split('\n\n---\n\n').length - 1
    expect(totalSeparators).toBe(internalSeparators + 2)
  })
})

// ─── composeChatSystemPrompt — v2 split static/dynamic (Sprint 1.4.B) ───────

describe('composeChatSystemPrompt — split static/dynamic', () => {
  it('retorna { static, dynamic } shape', () => {
    const result = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
    })
    expect(result).toHaveProperty('static')
    expect(result).toHaveProperty('dynamic')
    expect(typeof result.static).toBe('string')
    expect(typeof result.dynamic).toBe('string')
  })

  it('static inclui IDENTITY + CAPABILITIES + RESTRICTIONS + TONE + backbone + artifacts', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
    })
    expect(staticSeg).toContain('═══ IDENTITY ═══')
    expect(staticSeg).toContain('═══ CAPABILITIES ═══')
    expect(staticSeg).toContain('═══ RESTRICTIONS ═══')
    expect(staticSeg).toContain('═══ TONE ═══')
    expect(staticSeg).toContain(composeBackbonePrompt())
    expect(staticSeg).toContain(artifactsPrompt)
  })

  it('dynamic inclui TENANT CONTEXT quando tenant presente', () => {
    const { dynamic } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({ name: 'Acme Fitness' }),
    })
    expect(dynamic).toContain('═══ TENANT CONTEXT ═══')
    expect(dynamic).toContain('Acme Fitness')
  })

  it('dynamic é vazio quando tenant=null E sem geo', () => {
    const { dynamic } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: null,
    })
    expect(dynamic).toBe('')
  })

  it('dynamic inclui GEO quando geoHints presente', () => {
    const { dynamic } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      geoHints: { city: 'São Paulo', country: 'BR' },
    })
    expect(dynamic).toContain('cidade: São Paulo')
  })

  it('TENANT CONTEXT NÃO vaza pro static (cache separation)', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({ name: 'NomeUnico123' }),
    })
    expect(staticSeg).not.toContain('NomeUnico123')
  })

  it('IDENTITY NÃO vaza pro dynamic (static-only)', () => {
    const { dynamic } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
    })
    expect(dynamic).not.toContain('═══ IDENTITY ═══')
  })

  it('static é determinístico per-brand (cacheable)', () => {
    const a = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({ name: 'Tenant A' }),
    })
    const b = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({ name: 'Tenant B', id: '99999999-9999-9999-9999-999999999999' }),
    })
    // Static deve ser idêntico — só tenant muda
    expect(a.static).toBe(b.static)
    // Dynamic deve diferir
    expect(a.dynamic).not.toBe(b.dynamic)
  })

  it('artifactsEnabled=false omite artifactsPrompt do static', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      artifactsEnabled: false,
    })
    expect(staticSeg).not.toContain(artifactsPrompt)
  })

  it('mantém ordem cache-friendly no static: IDENTITY → CAPABILITIES → RESTRICTIONS → TONE → backbone', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
    })
    const idIdentity = staticSeg.indexOf('═══ IDENTITY ═══')
    const idCapabilities = staticSeg.indexOf('═══ CAPABILITIES ═══')
    const idRestrictions = staticSeg.indexOf('═══ RESTRICTIONS ═══')
    const idTone = staticSeg.indexOf('═══ TONE ═══')
    expect(idIdentity).toBeLessThan(idCapabilities)
    expect(idCapabilities).toBeLessThan(idRestrictions)
    expect(idRestrictions).toBeLessThan(idTone)
  })

  // ─── Sprint 2.B — overlay form-engine ─────────────────────────────────────

  it('overlay=undefined NÃO inclui FORM ENGINE BUILDER MODE', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
    })
    expect(staticSeg).not.toContain('═══ FORM ENGINE BUILDER MODE ═══')
  })

  it('overlay="form-engine" inclui FORM ENGINE BUILDER MODE no static', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      overlay: 'form-engine',
    })
    expect(staticSeg).toContain('═══ FORM ENGINE BUILDER MODE ═══')
  })

  it('overlay="form-engine" entra DEPOIS de artifactsPrompt (cache order)', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      overlay: 'form-engine',
    })
    const idArtifacts = staticSeg.indexOf('MODO ARTIFACTS')
    const idOverlay = staticSeg.indexOf('═══ FORM ENGINE BUILDER MODE ═══')
    expect(idArtifacts).toBeGreaterThan(-1)
    expect(idOverlay).toBeGreaterThan(idArtifacts)
  })

  it('overlay NÃO vaza pro dynamic segment', () => {
    const { dynamic } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      overlay: 'form-engine',
    })
    expect(dynamic).not.toContain('═══ FORM ENGINE BUILDER MODE ═══')
  })

  // ─── Sprint 6.A.2 — overlay page-engine ───────────────────────────────────

  it('overlay=undefined NÃO inclui PAGE ENGINE BUILDER MODE', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
    })
    expect(staticSeg).not.toContain('═══ PAGE ENGINE BUILDER MODE ═══')
  })

  it('overlay="page-engine" inclui PAGE ENGINE BUILDER MODE no static', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      overlay: 'page-engine',
    })
    expect(staticSeg).toContain('═══ PAGE ENGINE BUILDER MODE ═══')
  })

  it('overlay="page-engine" entra DEPOIS de artifactsPrompt (cache order)', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      overlay: 'page-engine',
    })
    const idArtifacts = staticSeg.indexOf('MODO ARTIFACTS')
    const idOverlay = staticSeg.indexOf('═══ PAGE ENGINE BUILDER MODE ═══')
    expect(idArtifacts).toBeGreaterThan(-1)
    expect(idOverlay).toBeGreaterThan(idArtifacts)
  })

  it('overlay="page-engine" NÃO vaza pro dynamic segment', () => {
    const { dynamic } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      overlay: 'page-engine',
    })
    expect(dynamic).not.toContain('═══ PAGE ENGINE BUILDER MODE ═══')
  })

  it('overlay="page-engine" NÃO inclui FORM ENGINE BUILDER MODE (mutually exclusive per session)', () => {
    const { static: staticSeg } = composeChatSystemPrompt({
      brand: TEST_BRAND,
      tenant: makeTenant({}),
      overlay: 'page-engine',
    })
    expect(staticSeg).not.toContain('═══ FORM ENGINE BUILDER MODE ═══')
  })
})
