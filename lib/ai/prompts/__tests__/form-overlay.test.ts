// lib/ai/prompts/__tests__/form-overlay.test.ts
// Sprint 2.B — cobertura FORM ENGINE BUILDER MODE overlay.

import { describe, expect, it } from 'vitest'

import { buildFormOverlayPrompt } from '../form-overlay'

describe('buildFormOverlayPrompt', () => {
  it('inclui header FORM ENGINE BUILDER MODE', () => {
    expect(buildFormOverlayPrompt()).toContain('═══ FORM ENGINE BUILDER MODE ═══')
  })

  it('descreve as 4 stages do pipeline (PLAN/APPROVE/GENERATE/SUGGEST)', () => {
    const result = buildFormOverlayPrompt()
    expect(result).toMatch(/Stage 1/)
    expect(result).toMatch(/Stage 2/)
    expect(result).toMatch(/Stage 3/)
    expect(result).toMatch(/Stage 4/)
  })

  it('lista as 14 tools do form-engine (todos camelCase)', () => {
    const result = buildFormOverlayPrompt()
    const tools = [
      'createFormPlan',
      'approveFormPlan',
      'rejectFormPlan',
      'generateForm',
      'listForms',
      'getForm',
      'publishForm',
      'archiveForm',
      'forkForm',
      'updateFormTheming',
      'toggleLgpdFlag',
      'setFormConversionWebhook',
      'requestFormSuggestions',
      'applyFormSuggestion',
    ]
    for (const t of tools) {
      expect(result).toMatch(new RegExp(`\`${t}\``))
    }
  })

  it('cita NÃO destrutivas + soft-delete (I37)', () => {
    const result = buildFormOverlayPrompt()
    expect(result).toMatch(/NÃO destrutivas|soft-delete/i)
    expect(result).toContain('archiveForm')
  })

  it('cita 1 tool per response (I41)', () => {
    expect(buildFormOverlayPrompt()).toMatch(/1 tool por response|CRITICAL RULE I41/i)
  })

  it('cita vocab canonical cravado', () => {
    const result = buildFormOverlayPrompt()
    expect(result).toContain('`form`')
    expect(result).toContain('`block`')
    expect(result).toContain('`step`')
    expect(result).toContain('`lead-capture`')
  })

  it('é determinístico (cacheable cross-tenant)', () => {
    expect(buildFormOverlayPrompt()).toBe(buildFormOverlayPrompt())
  })

  it('NÃO contém vocab banido', () => {
    const result = buildFormOverlayPrompt()
    const banned = ['w' + 'izard', 'i' + 'ntake', 'cust' + 'omization', 'wo' + 'rkspace']
    for (const term of banned) {
      expect(result.toLowerCase()).not.toContain(term.toLowerCase())
    }
  })

  it('está em PT-BR', () => {
    const result = buildFormOverlayPrompt()
    expect(result).toMatch(/profissional/i)
    expect(result).toMatch(/aprovação/i)
  })
})
