// lib/ai/prompts/__tests__/page-overlay.test.ts
// Sprint 6.A.2 — overlay PAGE ENGINE BUILDER MODE.
//
// Determinístico: sem interpolação tenant-specific.
// Verifica: mentions das 10 tools page-engine + vocab canonical + restrições.

import { describe, expect, it } from 'vitest'

import { buildPageOverlayPrompt } from '../page-overlay'

describe('buildPageOverlayPrompt', () => {
  const prompt = buildPageOverlayPrompt()

  it('contém marcador de modo cravado', () => {
    expect(prompt).toContain('PAGE ENGINE BUILDER MODE')
  })

  it('orienta sobre 5 estágios do pipeline', () => {
    expect(prompt).toContain('PLAN (Stage 1)')
    expect(prompt).toContain('APPROVAL GATE (Stage 2)')
    expect(prompt).toContain('GENERATE (Stage 3)')
    expect(prompt).toContain('SUGGEST (Stage 4')
  })

  it('menciona as 10 tools page-engine canonicalmente', () => {
    // Pipeline 5-estágios (4 tools)
    expect(prompt).toContain('createPagePlan')
    expect(prompt).toContain('approvePagePlan')
    expect(prompt).toContain('rejectPagePlan')
    expect(prompt).toContain('generatePage')
    expect(prompt).toContain('requestPageSuggestions')

    // Edição granular (3 tools)
    expect(prompt).toContain('patchPageBlock')
    expect(prompt).toContain('replacePageContent')
    expect(prompt).toContain('updatePageSEO')

    // Lifecycle (2 tools)
    expect(prompt).toContain('publishPage')
    expect(prompt).toContain('archivePage')
  })

  it('vocab canonical: page / instance / block kind (ADR-0053 D27)', () => {
    expect(prompt).toContain('page')
    expect(prompt).toContain('instance')
    expect(prompt).toContain('block kind')
  })

  it('bane vocab errado (section/component como discriminator)', () => {
    expect(prompt).toContain('NUNCA use `section`/`component`')
  })

  it('reforça CRITICAL RULES I41', () => {
    expect(prompt).toMatch(/1 tool por response/i)
    expect(prompt).toContain('I41')
  })

  it('reforça plan gate obrigatório (SOFT)', () => {
    expect(prompt).toContain('NÃO invente pages sem chamar `createPagePlan`')
    expect(prompt).toContain('NÃO chame `generatePage` sem ter `planId` aprovado')
  })

  it('menciona htmlPreview iframe (ADR-0053 D.4)', () => {
    expect(prompt).toContain('htmlPreview')
    expect(prompt).toContain('iframe')
  })

  it('reforça NÃO destrutivo (archivePage soft-delete)', () => {
    expect(prompt).toContain('NÃO destrutivas')
    expect(prompt).toContain('soft-delete')
  })

  it('é determinístico (chamadas múltiplas retornam mesma string)', () => {
    expect(buildPageOverlayPrompt()).toBe(prompt)
  })

  it('cita ADR-0058 D.3 BYPASS pattern', () => {
    expect(prompt).toContain('BYPASS handler')
    expect(prompt).toContain('ADR-0058 D.3')
  })
})
