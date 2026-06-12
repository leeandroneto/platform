// RESEARCH: ADR-0049 + .claude/rules/state-management.md — editor state container (Page Engine builder)
// Pattern espelha lib/state/form-builder-store.ts (Zustand persist) + tweakcn-ref/store/editor-store.ts.
//
// Sprint 6.B cravado (2026-05-27): Zustand store pro Page Engine BUILDER (vibe chat
// + plan card + preview + suggestions + visual canvas selection). Editor state
// container — fronteira ADR-0049:
//   - RHF + Zod = pro Page Engine RENDERER público (Sprint 7 separada).
//   - Zustand   = pro Page Engine BUILDER (este arquivo).
//
// I3 cravado: PROIBIDO sincronizar Zustand para RHF bidirectional (anti-pattern
// Zustand discussion 1922). Builder UI lê deste store, NUNCA escreve nele a
// partir de RHF callbacks.
//
// Persist scope (skipHydration):
//   - activeView — UX preferência (persiste entre sessions)
//   - planSpec/planId/pageId/versionId/definition/suggestions/selectedInstanceId
//     — NÃO persistem (transient, resolvidos pelos server actions/RSC a cada turn).
//
// State machine:
//   activeView in { 'chat', 'plan', 'preview', 'suggestions' }
//   - 'chat'        → user digita no chat composer · default
//   - 'plan'        → createPagePlan retornou planSpec · plan card renderiza
//   - 'preview'     → generatePage completou · preview do PageContent renderiza
//   - 'suggestions' → requestPageSuggestions retornou · cards de sugestão
//
// Selectors granulares (não shallow comparator) — re-render só onde dado mudou
// (espelha pattern tweakcn upstream + form-builder-store).
//
// @see ADR-0049 — State management split RHF/Zustand
// @see ADR-0048 — Theme application architecture (persist pattern)
// @see lib/state/form-builder-store.ts — pattern source (Sprint 2.C)
// @see .claude/rules/state-management.md — I1-I5 invariantes

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import type { Suggestion } from '@/lib/contracts/form-engine'
import type { PageContent, PagePlanSpec } from '@/lib/contracts/page-engine'

// ─── State machine ──────────────────────────────────────────────────────────

export type PageBuilderView = 'chat' | 'plan' | 'preview' | 'suggestions'

export interface PageBuilderTransientState {
  /** Plan retornado pelo Stage 1 PLAN (Sonnet). null antes do 1o plan. */
  readonly activePlanSpec: PagePlanSpec | null
  /** ID do plan persistido em engine_plans (pra aprovar/rejeitar via server action). */
  readonly activePlanId: string | null
  /** Page ID novo persistido. */
  readonly activePageId: string | null
  /** ID do page_version recém-gerado (Stage 3 GENERATE completou). */
  readonly activePageVersionId: string | null
  /** Definition (PageContent flat Map) carregado em memory pro editor. */
  readonly activeDefinition: PageContent | null
  /** Suggestions Haiku Stage 4 (pode estar vazio). */
  readonly suggestions: readonly Suggestion[]
  /** Instance selecionada no canvas (props panel renderiza). */
  readonly selectedInstanceId: string | null
}

export interface PageBuilderPersistedState {
  /** Aba ativa no split-pane. Persistida pra restaurar contexto entre reloads. */
  readonly activeView: PageBuilderView
}

export interface PageBuilderActions {
  /** Stage 1 result handler — UI dispara depois de createPagePlan tool retornar. */
  setActivePlan: (params: { planId: string; planSpec: PagePlanSpec }) => void
  /** Stage 2 reject — limpa plan + volta pra chat. */
  clearActivePlan: () => void
  /** Stage 3 result handler — generate retornou pageId+versionId. */
  setActivePage: (params: {
    pageId: string
    versionId: string
    definition?: PageContent | null
  }) => void
  /** Carrega definition (PageContent) no editor — usado pelo editor RSC mount. */
  setActiveDefinition: (definition: PageContent | null) => void
  /** Stage 4 result handler — suggestions inseridas/append. */
  setSuggestions: (suggestions: readonly Suggestion[]) => void
  /** Remove 1 suggestion (após aplicar OR dismiss). */
  removeSuggestion: (blockId: string, type: Suggestion['type']) => void
  /** Switch de aba (UX manual). */
  setActiveView: (view: PageBuilderView) => void
  /** Seleciona instance no canvas pra editar props (props-panel renderiza). */
  setSelectedInstance: (instanceId: string | null) => void
  /** Optimistic update local de props de uma Instance (sync ao server action via patchPageBlockAction). */
  updateInstanceProps: (instanceId: string, propsPatch: Record<string, unknown>) => void
  /** Reset completo — usado quando user clica "Nova página" depois de fechar uma. */
  reset: () => void
}

export type PageBuilderStore = PageBuilderTransientState &
  PageBuilderPersistedState &
  PageBuilderActions

const initialTransient: PageBuilderTransientState = {
  activePlanSpec: null,
  activePlanId: null,
  activePageId: null,
  activePageVersionId: null,
  activeDefinition: null,
  suggestions: [],
  selectedInstanceId: null,
}

const initialPersisted: PageBuilderPersistedState = {
  activeView: 'chat',
}

// ─── Store factory ──────────────────────────────────────────────────────────

/**
 * Zustand store pro Page Engine builder.
 *
 * `skipHydration: true` (ADR-0048) — previne hydration mismatch SSR/CSR.
 * Caller mount component dispara `usePageBuilderStore.persist.rehydrate()`
 * em useEffect post-mount.
 *
 * `partialize` exclui campos transient — só `activeView` persiste (UX
 * preferência). Plan/page/definition/suggestions resolvem a cada session via
 * server actions OR RSC props.
 */
export const usePageBuilderStore = create<PageBuilderStore>()(
  persist(
    (set, get) => ({
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

      setActivePage: ({ pageId, versionId, definition }) =>
        set({
          activePageId: pageId,
          activePageVersionId: versionId,
          activeDefinition: definition ?? null,
          activeView: 'preview',
        }),

      setActiveDefinition: (definition) => set({ activeDefinition: definition }),

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

      setSelectedInstance: (instanceId) => set({ selectedInstanceId: instanceId }),

      updateInstanceProps: (instanceId, propsPatch) => {
        const def = get().activeDefinition
        if (!def) return
        const instance = def.content[instanceId]
        if (!instance) return
        set({
          activeDefinition: {
            ...def,
            content: {
              ...def.content,
              [instanceId]: {
                ...instance,
                props: { ...instance.props, ...propsPatch },
              },
            },
          },
        })
      },

      reset: () =>
        set({
          ...initialTransient,
          activeView: 'chat',
        }),
    }),
    {
      name: 'page-builder-storage',
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (s) => ({ activeView: s.activeView }) as PageBuilderPersistedState,
    },
  ),
)

// ─── Selectors (granular, re-render minimum) ────────────────────────────────

export const selectActivePlan = (s: PageBuilderStore) => s.activePlanSpec
export const selectActivePlanId = (s: PageBuilderStore) => s.activePlanId
export const selectActiveView = (s: PageBuilderStore) => s.activeView
export const selectActivePageId = (s: PageBuilderStore) => s.activePageId
export const selectActivePageVersionId = (s: PageBuilderStore) => s.activePageVersionId
export const selectActiveDefinition = (s: PageBuilderStore) => s.activeDefinition
export const selectSuggestions = (s: PageBuilderStore) => s.suggestions
export const selectSelectedInstanceId = (s: PageBuilderStore) => s.selectedInstanceId
