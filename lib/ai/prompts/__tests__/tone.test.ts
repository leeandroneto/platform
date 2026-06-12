// lib/ai/prompts/__tests__/tone.test.ts
// Sprint 1.4.B — cobertura TONE segment do system prompt v2.

import { describe, expect, it } from 'vitest'

import { buildTonePrompt } from '../tone'

describe('buildTonePrompt', () => {
  it('inclui header TONE canonical', () => {
    expect(buildTonePrompt()).toContain('═══ TONE ═══')
  })

  it('crava PT-BR direto sem regionalismos', () => {
    const result = buildTonePrompt()
    expect(result).toMatch(/PT-BR direto/i)
    expect(result).toMatch(/regionalismos|gírias/i)
  })

  it('crava recomendação cravada (não opções neutras)', () => {
    const result = buildTonePrompt()
    expect(result).toMatch(/recomendação|cravada|justifique/i)
  })

  it('proibe floreios marketing ("que ótimo!" / "incrível!")', () => {
    const result = buildTonePrompt()
    expect(result).toMatch(/floreios/i)
    expect(result).toMatch(/ótimo|incrível|perfeito/i)
  })

  it('crava respostas curtas (2-5 linhas)', () => {
    const result = buildTonePrompt()
    expect(result).toMatch(/2-5 linhas|curtas/i)
  })

  it('é determinístico (cacheable cross-tenant)', () => {
    expect(buildTonePrompt()).toBe(buildTonePrompt())
  })
})
