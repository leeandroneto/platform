// features/_template/__tests__/plan-gates.test.ts
// Smoke test garantindo que o gate da feature tem shape canônico.

import { describe, expect, it } from 'vitest'

import { templateGate } from '../plan-gates'

describe('templateGate', () => {
  it('exporta feature key', () => {
    expect(templateGate.feature).toBe('_template')
  })

  it('declara requiredPlans não-vazio', () => {
    expect(templateGate.requiredPlans.length).toBeGreaterThan(0)
  })

  it('uxPattern é A | B | C', () => {
    expect(['A', 'B', 'C']).toContain(templateGate.uxPattern)
  })
})
