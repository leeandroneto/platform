// RESEARCH: pattern lib/state/__tests__/theme-editor-store.test.ts — Zustand state machine smoke + transitions.
// Sprint 2.C (2026-05-27): testes pra form-builder-store — state machine
// activeView transitions + setActivePlan/setActiveForm/setSuggestions/removeSuggestion.

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import type { PlanSpec, Suggestion } from '@/lib/contracts/form-engine'
import { useFormBuilderStore } from '@/lib/state/form-builder-store'

function resetStore() {
  useFormBuilderStore.setState({
    activePlanSpec: null,
    activePlanId: null,
    activeFormVersionId: null,
    activeFormId: null,
    suggestions: [],
    activeView: 'chat',
  })
}

const planSpecFixture: PlanSpec = {
  intent: 'capture-leads-pre-treino',
  dimensions: [
    {
      name: 'identity',
      description: 'nome e email do lead',
      relevance: 'critical',
    },
  ],
  proposedSteps: [
    {
      title: 'Boas-vindas',
      purpose: 'apresentar o profissional',
      proposedBlocks: [{ type: 'welcome-screen', label: 'Olá!', required: false }],
    },
  ],
  rationale: 'Estrutura mínima viável pra captação WhatsApp.',
}

const suggestionFixture: Suggestion = {
  blockId: 'block-1',
  type: 'copy_improvement',
  current: 'Qual seu nome?',
  suggested: 'Como podemos te chamar?',
  reason: 'Tom mais conversacional aumenta completion rate.',
  confidence: 'high',
}

describe('useFormBuilderStore', () => {
  beforeEach(() => {
    resetStore()
  })

  afterEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear()
  })

  it('default state has activeView=chat and empty refs', () => {
    const s = useFormBuilderStore.getState()
    expect(s.activeView).toBe('chat')
    expect(s.activePlanSpec).toBeNull()
    expect(s.activePlanId).toBeNull()
    expect(s.activeFormId).toBeNull()
    expect(s.activeFormVersionId).toBeNull()
    expect(s.suggestions).toEqual([])
  })

  it('setActivePlan transitions to plan view + stores planSpec/planId', () => {
    useFormBuilderStore.getState().setActivePlan({ planId: 'plan-1', planSpec: planSpecFixture })
    const s = useFormBuilderStore.getState()
    expect(s.activeView).toBe('plan')
    expect(s.activePlanId).toBe('plan-1')
    expect(s.activePlanSpec).toEqual(planSpecFixture)
  })

  it('clearActivePlan resets plan refs + back to chat', () => {
    useFormBuilderStore.getState().setActivePlan({ planId: 'plan-2', planSpec: planSpecFixture })
    useFormBuilderStore.getState().clearActivePlan()
    const s = useFormBuilderStore.getState()
    expect(s.activePlanSpec).toBeNull()
    expect(s.activePlanId).toBeNull()
    expect(s.activeView).toBe('chat')
  })

  it('setActiveForm transitions to preview view + stores formId/formVersionId', () => {
    useFormBuilderStore.getState().setActiveForm({ formId: 'form-1', formVersionId: 'v-1' })
    const s = useFormBuilderStore.getState()
    expect(s.activeFormId).toBe('form-1')
    expect(s.activeFormVersionId).toBe('v-1')
    expect(s.activeView).toBe('preview')
  })

  it('setSuggestions transitions to suggestions view + stores array', () => {
    useFormBuilderStore.getState().setSuggestions([suggestionFixture])
    const s = useFormBuilderStore.getState()
    expect(s.activeView).toBe('suggestions')
    expect(s.suggestions).toHaveLength(1)
    expect(s.suggestions[0]).toEqual(suggestionFixture)
  })

  it('removeSuggestion filters by blockId + type', () => {
    const other: Suggestion = { ...suggestionFixture, blockId: 'block-2' }
    useFormBuilderStore.getState().setSuggestions([suggestionFixture, other])
    useFormBuilderStore.getState().removeSuggestion('block-1', 'copy_improvement')
    const s = useFormBuilderStore.getState()
    expect(s.suggestions).toHaveLength(1)
    expect(s.suggestions[0]?.blockId).toBe('block-2')
  })

  it('setActiveView only changes view (no other state)', () => {
    useFormBuilderStore.getState().setActivePlan({ planId: 'plan-3', planSpec: planSpecFixture })
    useFormBuilderStore.getState().setActiveView('chat')
    const s = useFormBuilderStore.getState()
    expect(s.activeView).toBe('chat')
    // Plan refs preserved
    expect(s.activePlanId).toBe('plan-3')
    expect(s.activePlanSpec).toEqual(planSpecFixture)
  })

  it('reset clears transient state + view back to chat', () => {
    useFormBuilderStore.getState().setActivePlan({ planId: 'plan-4', planSpec: planSpecFixture })
    useFormBuilderStore.getState().setSuggestions([suggestionFixture])
    useFormBuilderStore.getState().reset()
    const s = useFormBuilderStore.getState()
    expect(s.activePlanSpec).toBeNull()
    expect(s.activePlanId).toBeNull()
    expect(s.activeFormId).toBeNull()
    expect(s.activeFormVersionId).toBeNull()
    expect(s.suggestions).toEqual([])
    expect(s.activeView).toBe('chat')
  })
})
