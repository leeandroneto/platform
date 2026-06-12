// lib/ai/prompts/__tests__/backbone.test.ts
// Cobertura de lib/ai/prompts/backbone.ts — pure functions, sem mocks.

import { describe, expect, it } from 'vitest'

import {
  antiPatternsPrompt,
  composeBackbonePrompt,
  dimensionsHeuristicPrompt,
  regularPrompt,
  structuredEnvelopeSpec,
  vibePrompt,
} from '../backbone'

// ---------------------------------------------------------------------------
// composeBackbonePrompt() — shape e composição
// ---------------------------------------------------------------------------
describe('composeBackbonePrompt() — shape', () => {
  const SEPARATOR = '\n\n---\n\n'

  it('sem opts retorna string com todos os 5 blocos separados por \\n\\n---\\n\\n', () => {
    const result = composeBackbonePrompt()
    expect(result).toContain(regularPrompt)
    expect(result).toContain(structuredEnvelopeSpec)
    expect(result).toContain(antiPatternsPrompt)
    expect(result).toContain(vibePrompt)
    expect(result).toContain(dimensionsHeuristicPrompt)
    // 4 separadores para 5 partes
    const separatorCount = result.split(SEPARATOR).length - 1
    expect(separatorCount).toBe(4)
  })

  it('blocos estão na ordem correta: regular → envelope → antiPatterns → vibe → dimensions', () => {
    const result = composeBackbonePrompt()
    const idxRegular = result.indexOf(regularPrompt)
    const idxEnvelope = result.indexOf(structuredEnvelopeSpec)
    const idxAnti = result.indexOf(antiPatternsPrompt)
    const idxVibe = result.indexOf(vibePrompt)
    const idxDimensions = result.indexOf(dimensionsHeuristicPrompt)
    expect(idxRegular).toBeLessThan(idxEnvelope)
    expect(idxEnvelope).toBeLessThan(idxAnti)
    expect(idxAnti).toBeLessThan(idxVibe)
    expect(idxVibe).toBeLessThan(idxDimensions)
  })

  it('{ includeVibe: false } — NÃO contém marker MODO VIBE CODING', () => {
    const result = composeBackbonePrompt({ includeVibe: false })
    expect(result).not.toContain('MODO VIBE CODING')
  })

  it('{ includeVibe: false } — ainda contém regular + envelope + antiPatterns', () => {
    const result = composeBackbonePrompt({ includeVibe: false })
    expect(result).toContain(regularPrompt)
    expect(result).toContain(structuredEnvelopeSpec)
    expect(result).toContain(antiPatternsPrompt)
  })

  it('{ includeDimensions: false } — NÃO contém marker HEURÍSTICA DE DESCOBERTA DE DIMENSIONS', () => {
    const result = composeBackbonePrompt({ includeDimensions: false })
    expect(result).not.toContain('HEURÍSTICA DE DESCOBERTA DE DIMENSIONS')
  })

  it('{ includeDimensions: false } — ainda contém regular + envelope + antiPatterns', () => {
    const result = composeBackbonePrompt({ includeDimensions: false })
    expect(result).toContain(regularPrompt)
    expect(result).toContain(structuredEnvelopeSpec)
    expect(result).toContain(antiPatternsPrompt)
  })

  it('{ includeVibe: false, includeDimensions: false } — 3 partes, 2 separadores', () => {
    const result = composeBackbonePrompt({ includeVibe: false, includeDimensions: false })
    expect(result).toContain(regularPrompt)
    expect(result).toContain(structuredEnvelopeSpec)
    expect(result).toContain(antiPatternsPrompt)
    expect(result).not.toContain('MODO VIBE CODING')
    expect(result).not.toContain('HEURÍSTICA DE DESCOBERTA DE DIMENSIONS')
    const separatorCount = result.split(SEPARATOR).length - 1
    expect(separatorCount).toBe(2)
  })
})

// ---------------------------------------------------------------------------
// structuredEnvelopeSpec — integridade das tags e regras
// ---------------------------------------------------------------------------
describe('structuredEnvelopeSpec — integridade', () => {
  it('contém tags de abertura e fechamento obrigatórias', () => {
    expect(structuredEnvelopeSpec).toContain('<Thinking>')
    expect(structuredEnvelopeSpec).toContain('</Thinking>')
    expect(structuredEnvelopeSpec).toContain('<ContentDraft>')
    expect(structuredEnvelopeSpec).toContain('</ContentDraft>')
    expect(structuredEnvelopeSpec).toContain('<Suggestions>')
    expect(structuredEnvelopeSpec).toContain('</Suggestions>')
  })

  it('menciona "JSON estrito"', () => {
    expect(structuredEnvelopeSpec).toContain('JSON estrito')
  })

  it('menciona "case-sensitive"', () => {
    expect(structuredEnvelopeSpec).toContain('case-sensitive')
  })
})

// ---------------------------------------------------------------------------
// antiPatternsPrompt — vocabulário canônico presente
// ---------------------------------------------------------------------------
describe('antiPatternsPrompt — vocab canônico obrigatório', () => {
  const canonicalTerms = [
    'block',
    'step',
    'version',
    'submission',
    'response',
    'report',
    'template',
    'dimension',
    'client',
    'professional',
    'lead-capture',
    'assessment',
    'tenant',
    'setup',
  ]

  for (const term of canonicalTerms) {
    it(`contém termo canônico "${term}"`, () => {
      expect(antiPatternsPrompt).toContain(term)
    })
  }
})

// ---------------------------------------------------------------------------
// Vocab banido — NÃO deve aparecer como termo recomendado fora de antiPatterns
// ---------------------------------------------------------------------------
describe('vocab banido — ausente nos blocos não-antiPattern', () => {
  // Blocos que NÃO devem conter os termos banidos como recomendação
  const nonAntiBlocks: Record<string, string> = {
    regularPrompt,
    vibePrompt,
    dimensionsHeuristicPrompt,
    structuredEnvelopeSpec,
  }

  // Termos banidos (naming.md)
  const bannedTerms = [
    'student',
    'trainer',
    'intake',
    'wizard',
    'prospect',
    'diagnostic',
    'customization',
    'workspace',
    'framer-motion',
    'aluno',
    'reflexao',
    'pilares',
    'proximo_passo',
  ]

  for (const [blockName, blockContent] of Object.entries(nonAntiBlocks)) {
    for (const term of bannedTerms) {
      it(`"${term}" NÃO aparece em ${blockName}`, () => {
        const regex = new RegExp(`\\b${term.replace(/-/g, '[-]?')}\\b`, 'i')
        expect(regex.test(blockContent)).toBe(false)
      })
    }
  }

  it('"motor" / "motores" NÃO aparece em regularPrompt como recomendado', () => {
    expect(/\bmotor(es)?\b/i.test(regularPrompt)).toBe(false)
  })

  it('"motor" / "motores" NÃO aparece em vibePrompt como recomendado', () => {
    expect(/\bmotor(es)?\b/i.test(vibePrompt)).toBe(false)
  })

  it('"motor" / "motores" NÃO aparece em dimensionsHeuristicPrompt como recomendado', () => {
    expect(/\bmotor(es)?\b/i.test(dimensionsHeuristicPrompt)).toBe(false)
  })

  it('"dimension" APARECE em antiPatternsPrompt (é vocab canônico)', () => {
    expect(antiPatternsPrompt).toContain('dimension')
  })
})

// ---------------------------------------------------------------------------
// dimensionsHeuristicPrompt — meta-método, não receita fixa
// ---------------------------------------------------------------------------
describe('dimensionsHeuristicPrompt — meta-método', () => {
  it('contém "NÃO" indicando que não é receita obrigatória', () => {
    expect(dimensionsHeuristicPrompt).toContain('NÃO')
  })

  // "fitness" aparece em regularPrompt ("consultoria fitness") — aqui
  // validamos os exemplos de variação de contexto presentes na string do prompt.
  it('menciona "quiz BuzzFeed" como exemplo de variação por contexto', () => {
    expect(dimensionsHeuristicPrompt).toContain('quiz BuzzFeed')
  })

  it('menciona "B2B SaaS" como exemplo de variação por contexto', () => {
    expect(dimensionsHeuristicPrompt).toContain('B2B SaaS')
  })

  it('menciona "assessment clínico" como exemplo de variação por contexto', () => {
    expect(dimensionsHeuristicPrompt).toContain('assessment')
  })

  it('regularPrompt menciona "fitness" como exemplo de nicho', () => {
    expect(regularPrompt).toContain('fitness')
  })
})

// ---------------------------------------------------------------------------
// PT-BR — idioma esperado em cada bloco
// ---------------------------------------------------------------------------
describe('PT-BR — idioma dos prompts', () => {
  // Usa alternativa simples sem \b em torno de chars acentuados (JS \b é ASCII-only).
  // "(?:^|\\s)" / "(?=\\s|$)" garante que as palavras são standalone.
  const containsPtBrWord = (text: string): boolean =>
    /(^|\s)(você|para|que|é|não|pra|seu|com|por)(\s|$)/i.test(text)

  const blocks: Record<string, string> = {
    regularPrompt,
    structuredEnvelopeSpec,
    vibePrompt,
    dimensionsHeuristicPrompt,
    antiPatternsPrompt,
  }

  for (const [blockName, blockContent] of Object.entries(blocks)) {
    it(`${blockName} contém pelo menos 1 palavra PT-BR`, () => {
      expect(containsPtBrWord(blockContent)).toBe(true)
    })
  }
})
