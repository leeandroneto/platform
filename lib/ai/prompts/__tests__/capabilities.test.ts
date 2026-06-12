// lib/ai/prompts/__tests__/capabilities.test.ts
// Sprint 1.4.B — cobertura CAPABILITIES segment do system prompt v2.

import { describe, expect, it } from 'vitest'

import { buildCapabilitiesPrompt } from '../capabilities'

describe('buildCapabilitiesPrompt', () => {
  it('inclui header CAPABILITIES canonical', () => {
    expect(buildCapabilitiesPrompt()).toContain('═══ CAPABILITIES ═══')
  })

  it('descreve 2 universos paralelos (ADR-0063)', () => {
    const result = buildCapabilitiesPrompt()
    expect(result).toContain('Universe A')
    expect(result).toContain('Universe B')
  })

  it('Universe A cita createEngineHandler (ADR-0050 Amendment A1)', () => {
    expect(buildCapabilitiesPrompt()).toContain('createEngineHandler')
  })

  it('Universe A lista 3 kinds previstos: form-lead-capture / page-landing / page-report', () => {
    const result = buildCapabilitiesPrompt()
    expect(result).toContain('form-lead-capture')
    expect(result).toContain('page-landing')
    expect(result).toContain('page-report')
  })

  it('Universe A sinaliza form-lead-capture como DISPONÍVEL Sprint 2.B', () => {
    const result = buildCapabilitiesPrompt()
    // Sprint 2.B cravado: form-lead-capture é o 1º handler real registrado.
    // Capabilities orienta IA a usar overlay form-engine pra esse kind +
    // flag handlers futuros (page-landing/page-report) que ainda não estão.
    expect(result).toMatch(/Sprint 2\.B DISPONÍVEL|fluxo plan-gate dedicado/i)
  })

  it('Universe B cita createDocumentHandler', () => {
    expect(buildCapabilitiesPrompt()).toContain('createDocumentHandler')
  })

  it('Universe B lista TODOS 12 kinds da ArtifactKind enum', () => {
    const result = buildCapabilitiesPrompt()
    const kinds = [
      'text',
      'code',
      'sheet',
      'image',
      'mermaid',
      'chart',
      'mindmap',
      'html',
      'pdf',
      'docx',
      'xlsx',
      'pptx',
    ]
    for (const k of kinds) {
      expect(result).toMatch(new RegExp(`\`${k}\``))
    }
  })

  it('é determinístico (cacheable cross-tenant)', () => {
    expect(buildCapabilitiesPrompt()).toBe(buildCapabilitiesPrompt())
  })

  it('NÃO contém vocab banido', () => {
    const result = buildCapabilitiesPrompt()
    const banned = ['w' + 'izard', 'i' + 'ntake', 'work' + 'space']
    for (const term of banned) {
      expect(result.toLowerCase()).not.toContain(term.toLowerCase())
    }
  })

  it('cita ADR-0063 no header (link conceitual)', () => {
    expect(buildCapabilitiesPrompt()).toContain('ADR-0063')
  })
})
