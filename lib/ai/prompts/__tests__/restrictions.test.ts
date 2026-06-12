// lib/ai/prompts/__tests__/restrictions.test.ts
// Sprint 1.4.B — cobertura RESTRICTIONS segment do system prompt v2.

import { describe, expect, it } from 'vitest'

import { buildRestrictionsPrompt } from '../restrictions'

describe('buildRestrictionsPrompt', () => {
  it('inclui header RESTRICTIONS canonical', () => {
    expect(buildRestrictionsPrompt({ brandName: 'desafit' })).toContain('═══ RESTRICTIONS ═══')
  })

  it('interpola brandName no off-topic redirect', () => {
    const result = buildRestrictionsPrompt({ brandName: 'desafit' })
    expect(result).toContain('desafit')
  })

  it('vary brandName entre brands', () => {
    const a = buildRestrictionsPrompt({ brandName: 'desafit' })
    const b = buildRestrictionsPrompt({ brandName: 'yoga' })
    expect(a).not.toBe(b)
    expect(b).toContain('yoga')
  })

  it('lista 5 restrições numeradas', () => {
    const result = buildRestrictionsPrompt({ brandName: 'desafit' })
    expect(result).toMatch(/^1\./m)
    expect(result).toMatch(/^2\./m)
    expect(result).toMatch(/^3\./m)
    expect(result).toMatch(/^4\./m)
    expect(result).toMatch(/^5\./m)
  })

  it('proibe off-topic (clima/esportes/política)', () => {
    const result = buildRestrictionsPrompt({ brandName: 'desafit' })
    expect(result).toMatch(/clima|esportes|política/i)
  })

  it('proibe inventar tools/kinds', () => {
    const result = buildRestrictionsPrompt({ brandName: 'desafit' })
    expect(result).toMatch(/invente tools|kinds/i)
  })

  it('proibe expor tenant_id/user_id/UUIDs', () => {
    const result = buildRestrictionsPrompt({ brandName: 'desafit' })
    expect(result).toMatch(/tenant_id|user_id|UUID/i)
  })

  it('proibe geração de imagem inline (JIT only)', () => {
    const result = buildRestrictionsPrompt({ brandName: 'desafit' })
    expect(result).toMatch(/gerar imagens|geração de imagem/i)
    expect(result).toMatch(/JIT|Canva/i)
  })

  it('proibe emojis exceto se user pedir explicitamente', () => {
    const result = buildRestrictionsPrompt({ brandName: 'desafit' })
    expect(result).toMatch(/emojis?/i)
    expect(result).toMatch(/explicitamente/i)
  })

  it('é determinístico por brandName (cacheable per-brand)', () => {
    const a = buildRestrictionsPrompt({ brandName: 'desafit' })
    const b = buildRestrictionsPrompt({ brandName: 'desafit' })
    expect(a).toBe(b)
  })

  it('NÃO contém vocab banido', () => {
    const result = buildRestrictionsPrompt({ brandName: 'desafit' })
    const banned = ['w' + 'izard', 'i' + 'ntake', 'work' + 'space']
    for (const term of banned) {
      expect(result.toLowerCase()).not.toContain(term.toLowerCase())
    }
  })
})
