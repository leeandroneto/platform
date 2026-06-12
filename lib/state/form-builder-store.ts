// RESEARCH: ADR-0049 + .claude/rules/state-management.md — editor state container (Form Engine builder)
// Pattern espelha lib/state/theme-editor-store.ts (Zustand persist) + tweakcn-ref/store/editor-store.ts.
//
// Sprint 2.C cravado (2026-05-27): Zustand store pro Form Engine BUILDER (vibe chat
// + plan card + preview + suggestions). Editor state container — fronteira ADR-0049:
//   - RHF + Zod = pro Form Engine RENDERER público (Sprint 4.A separada).
//   - Zustand   = pro Form Engine BUILDER (este arquivo).
//
// I3 cravado: PROIBIDO sincronizar Zustand para RHF bidirectional (anti-pattern
// Zustand discussion 1922). Builder UI lê deste store, NUNCA escreve nele a
// partir de RHF callbacks.
//
// Persist scope (skipHydration):
//   - activeView — UX preferência (persistem entre sessions)
//   - planSpec/planId/formVersionId/suggestions — NÃO persistem (transient,
//     resolvidos pelos server actions a cada turn).
//
// State machine:
//   activeView in { 'chat', 'plan', 'preview', 'suggestions' }
//   - 'chat'        → user digita no chat composer · default
//   - 'plan'        → createFormPlan retornou planSpec · plan card renderiza
//   - 'preview'     → generateForm completou · preview do form renderiza
//   - 'suggestions' → requestFormSuggestions retornou · cards de sugestão
//
// Selectors granulares (não shallow comparator) — re-render só onde dado mudou
// (espelha pattern tweakcn upstream).
//
// @see ADR-0049 — State management split RHF/Zustand
// @see ADR-0048 — Theme application architecture (persist pattern)
// @see lib/state/theme-editor-store.ts — primeira aplicação concreta
// @see .claude/rules/state-management.md — I1-I5 invariantes

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { PlanSpec, Suggestion } from '@/lib/contracts/form-engine'

// ─── State machine ──────────────────────────────────────────────────────────

export type FormBuilderView = 'chat' | 'plan' | 'preview' | 'suggestions'

export interface FormBuilderTransientState {
  /** Plan retornado pelo Stage 1 PLAN (Sonnet). null antes do 1o plan. */
  readonly activePlanSpec: PlanSpec | null
  /** ID do plan persistido em engine_plans (pra aprovar/rejeitar via server action). */
  readonly activePlanId: string | null
  /** ID do form_version recém-gerado (Stage 3 GENERATE completou). */
  readonly activeFormVersionId: string | null
  /** Form ID novo persistido (pode redirect pro editor). */
  readonly activeFormId: string | null
  /** Suggestions Haiku Stage 4 (pode estar vazio). */
  readonly suggestions: readonly Suggestion[]
}

export interface FormBuilderPersistedState {
  /** Aba ativa no split-pane. Persistido pra restaurar contexto entre reloads. */
  readonly activeView: FormBuilderView
}

export interface FormBuilderActions {
  /** Stage 1 result handler — UI dispara depois de createFormPlan tool retornar. */
  setActivePlan: (params: { planId: string; planSpec: PlanSpec }) => void
  /** Stage 2 reject — limpa plan + volta pra chat. */
  clearActivePlan: () => void
  /** Stage 3 result handler — generate retornou formVersionId. */
  setActiveForm: (params: { formId: string; formVersionId: string }) => void
  /** Stage 4 result handler — suggestions inseridas/append. */
  setSuggestions: (suggestions: readonly Suggestion[]) => void
  /** Remove 1 suggestion (após aplicar OR dismiss). */
  removeSuggestion: (blockId: string, type: Suggestion['type']) => void
  /** Switch de aba (UX manual). */
  setActiveView: (view: FormBuilderView) => void
  /** Reset completo — usado quando user clica "Novo formulário" depois de fechar um. */
  reset: () => void
}

export type FormBuilderStore = FormBuilderTransientState &
  FormBuilderPersistedState &
  FormBuilderActions

const initialTransient: FormBuilderTransientState = {
  activePlanSpec: null,
  activePlanId: null,
  activeFormVersionId: null,
  activeFormId: null,
  suggestions: [],
}

const initialPersisted: FormBuilderPersistedState = {
  activeView: 'chat',
}

// ─── Store factory ──────────────────────────────────────────────────────────

/**
 * Zustand store pro Form Engine builder.
 *
 * `skipHydration: true` (ADR-0048) — previne hydration mismatch SSR/CSR.
 * Caller mount component dispara `useFormBuilderStore.persist.rehydrate()`
 * em useEffect post-mount.
 *
 * `partialize` exclui campos transient — só `activeView` persiste (UX
 * preferência). Plan/form/suggestions resolvem a cada session via server
 * actions.
 */
export const useFormBuilderStore = create<FormBuilderStore>()(
  persist(
    (set) => ({
      ...initialTransient,
      ...initialPersisted,

      setActivePlan: ({ planId, planSpec }) =>
        set({
          activePlanId: planId,
          activePlanSpec: planSpec,
          activeView: 'plan',
        }),

      clearActivePlan: () =>
        set({
          activePlanId: null,
          activePlanSpec: null,
          activeView: 'chat',
        }),

      setActiveForm: ({ formId, formVersionId }) =>
        set({
          activeFormId: formId,
          activeFormVersionId: formVersionId,
          activeView: 'preview',
        }),

      setSuggestions: (suggestions) =>
        set({
          suggestions: [...suggestions],
          activeView: 'suggestions',
        }),

      removeSuggestion: (blockId, type) =>
        set((s) => ({
          suggestions: s.suggestions.filter((sg) => !(sg.blockId === blockId && sg.type === type)),
        })),

      setActiveView: (view) => set({ activeView: view }),

      reset: () =>
        set({
          ...initialTransient,
          activeView: 'chat',
        }),
    }),
    {
      name: 'form-builder-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ activeView: s.activeView }) as FormBuilderPersistedState,
    },
  ),
)

// ─── Selectors (granular, re-render minimum) ────────────────────────────────

export const selectActivePlan = (s: FormBuilderStore) => s.activePlanSpec
export const selectActivePlanId = (s: FormBuilderStore) => s.activePlanId
export const selectActiveView = (s: FormBuilderStore) => s.activeView
export const selectActiveFormId = (s: FormBuilderStore) => s.activeFormId
export const selectSuggestions = (s: FormBuilderStore) => s.suggestions
