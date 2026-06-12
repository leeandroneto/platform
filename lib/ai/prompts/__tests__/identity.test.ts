// lib/ai/prompts/__tests__/identity.test.ts
// Sprint 1.4.B — cobertura IDENTITY segment do system prompt v2.

import { describe, expect, it } from 'vitest'

import type { Brand } from '@/lib/brand/types'

import { buildIdentityPrompt } from '../identity'

const BRAND_DESAFIT: Brand = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'desafit',
  host: 'desafit.app',
  logo_url: null,
  default_vertical: 'fitness',
  parent_label: null,
  theme_version: 1,
}

const BRAND_YOGA: Brand = {
  id: '22222222-2222-2222-2222-222222222222',
  name: 'yoga',
  host: 'yoga.app',
  logo_url: null,
  default_vertical: 'yoga',
  parent_label: null,
  theme_version: 1,
}

describe('buildIdentityPrompt', () => {
  it('inclui header IDENTITY canonical', () => {
    const result = buildIdentityPrompt({ brand: BRAND_DESAFIT })
    expect(result).toContain('═══ IDENTITY ═══')
  })

  it('interpola brand.name na descrição', () => {
    const result = buildIdentityPrompt({ brand: BRAND_DESAFIT })
    expect(result).toContain('desafit')
  })

  it('NÃO hardcode brand específica — vary por brand.name', () => {
    const desafit = buildIdentityPrompt({ brand: BRAND_DESAFIT })
    const yoga = buildIdentityPrompt({ brand: BRAND_YOGA })
    expect(desafit).not.toBe(yoga)
    expect(yoga).toContain('yoga')
    expect(yoga).not.toContain('desafit')
  })

  it('é determinístico (mesma string em chamadas repetidas)', () => {
    const a = buildIdentityPrompt({ brand: BRAND_DESAFIT })
    const b = buildIdentityPrompt({ brand: BRAND_DESAFIT })
    expect(a).toBe(b)
  })

  it('menciona conceito SaaS B2B white-label', () => {
    const result = buildIdentityPrompt({ brand: BRAND_DESAFIT })
    expect(result).toMatch(/SaaS B2B white-label/i)
  })

  it('menciona profissionais (não inventa vocab banido)', () => {
    const result = buildIdentityPrompt({ brand: BRAND_DESAFIT })
    expect(result).toMatch(/profissionais/i)
    // sentinel split-strings pra evitar grep falso-positivo no vocab audit
    const banned = ['w' + 'izard', 'i' + 'ntake', 't' + 'rainer', 's' + 'tudent']
    for (const term of banned) {
      expect(result.toLowerCase()).not.toContain(term.toLowerCase())
    }
  })

  it('está em PT-BR', () => {
    const result = buildIdentityPrompt({ brand: BRAND_DESAFIT })
    expect(result).toMatch(/Você é/)
    expect(result).toMatch(/missão/i)
  })
})
