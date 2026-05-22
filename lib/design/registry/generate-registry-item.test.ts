// Tests para generate-registry-item.ts
// Mínimo: 2 testes conforme research-41 sequencing

import { describe, expect, it } from 'vitest'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { generateRegistryItem } from './generate-registry-item'

describe('generateRegistryItem', () => {
  it('gera payload válido para DEFAULT_THEME', () => {
    const payload = generateRegistryItem({
      name: 'default-theme',
      title: 'Default Theme',
      snapshot: DEFAULT_THEME,
    })

    // Schema obrigatório
    expect(payload.$schema).toBe('https://ui.shadcn.com/schema/registry-item.json')
    expect(payload.name).toBe('default-theme')
    expect(payload.title).toBe('Default Theme')

    // cssVars completo
    expect(payload.cssVars.theme).toBeDefined()
    expect(payload.cssVars.light).toBeDefined()
    expect(payload.cssVars.dark).toBeDefined()

    // Cores light presentes
    expect(payload.cssVars.light['background']).toBeTruthy()
    expect(payload.cssVars.light['foreground']).toBeTruthy()

    // Shadows derivados (8 níveis)
    expect(payload.cssVars.light['shadow-2xs']).toBeTruthy()
    expect(payload.cssVars.light['shadow-xs']).toBeTruthy()
    expect(payload.cssVars.light['shadow-sm']).toBeTruthy()
    expect(payload.cssVars.light['shadow']).toBeTruthy()
    expect(payload.cssVars.light['shadow-md']).toBeTruthy()
    expect(payload.cssVars.light['shadow-lg']).toBeTruthy()
    expect(payload.cssVars.light['shadow-xl']).toBeTruthy()
    expect(payload.cssVars.light['shadow-2xl']).toBeTruthy()

    // tracking-normal + spacing só em light
    expect(payload.cssVars.light['tracking-normal']).toBeDefined()
    expect(payload.cssVars.light['spacing']).toBeDefined()
    expect(payload.cssVars.dark['tracking-normal']).toBeUndefined()
    expect(payload.cssVars.dark['spacing']).toBeUndefined()

    // Fontes em theme
    expect(payload.cssVars.theme['font-sans']).toBeTruthy()
    expect(payload.cssVars.theme['font-serif']).toBeTruthy()
    expect(payload.cssVars.theme['font-mono']).toBeTruthy()
    expect(payload.cssVars.theme['radius']).toBeTruthy()

    // tracking scale derivado
    expect(payload.cssVars.theme['tracking-tighter']).toBe('calc(var(--tracking-normal) - 0.05em)')
    expect(payload.cssVars.theme['tracking-widest']).toBe('calc(var(--tracking-normal) + 0.1em)')

    // css block com letter-spacing
    expect(payload.css['@layer base'].body['letter-spacing']).toBe('var(--tracking-normal)')
  })

  it('type deve ser registry:style (não registry:theme) — research-41 bloqueador 4', () => {
    const payload = generateRegistryItem({
      name: 'test-style-type',
      title: 'Test',
      snapshot: DEFAULT_THEME,
    })

    expect(payload.type).toBe('registry:style')
    expect(payload.type).not.toBe('registry:theme')
  })

  it('description é opcional — omitido quando não fornecido', () => {
    const withoutDesc = generateRegistryItem({
      name: 'no-desc',
      title: 'No Description',
      snapshot: DEFAULT_THEME,
    })
    expect(withoutDesc.description).toBeUndefined()

    const withDesc = generateRegistryItem({
      name: 'with-desc',
      title: 'With Description',
      description: 'Custom fitness theme',
      snapshot: DEFAULT_THEME,
    })
    expect(withDesc.description).toBe('Custom fitness theme')
  })
})
