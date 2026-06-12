// RESEARCH: tweakcn (Apache-2.0) — copy literal from store/editor-store.ts
// ADAPT (post-refactor 2026-05-23 — voltar ao pattern upstream simples):
//   1. `ThemeEditorState` upstream → nosso `EditorThemeState` (currentMode + styles
//      onde `styles` é o Zod `Theme` = `{ light, dark }` flat de 45 keys).
//   2. `presetThemeStyles` lookup do projeto (`getPresetThemeStyles` em
//      `lib/design/presets/theme-preset-helper.ts`).
//   3. `isDeepEqual` do projeto (`@ngard/tiny-isequal`).
//   4. Persist config = SÓ `{ name: 'theme-editor-storage' }` espelhando upstream
//      tweakcn-ref/store/editor-store.ts:227-229. SEM `skipHydration`, SEM
//      `partialize`, SEM `onRehydrateStorage`, SEM `createJSONStorage`. Zustand
//      hidrata síncrono no 1º render (default). Race fix: o React 19 já trata
//      hydration mismatch quando persist vence inicial — não há SSR <html class>
//      conflict porque editorStore não escreve em <html> direto, ThemeProvider
//      escreve.
//   5. Field novo `loggedInThemeId: string | null` — quando logged-in, DB snapshot
//      sobre persist no mount via `loadFromServer`. Anonimo: persist vence.
//   6. Field novo `tenantSnapshot: Theme | null` — fonte de verdade do server pra
//      hydration. Permite reset-pra-tenant-snapshot futuro.
//   7. `hslAdjustments` mantido inline no themeState (espelha upstream exato).
//   8. `presetName` lifted pro state (espelha upstream `preset` field).
//
// MULTI-TENANT MITIGATION (Decisão Opção 2 do brief — simpler):
//   `name` global fixo (`theme-editor-storage`). `loadFromServer` chamado no
//   mount do view.tsx sempre que `themeId !== null` sobrescreve qualquer dado
//   anônimo no localStorage. Logged-in: DB sempre vence. Anônimo: localStorage
//   serve como backup. Tenant A → tenant B não vaza porque ao logar, loadFromServer
//   overrides com DB snapshot do tenant correto.
//
// ADR-0048 §1 — primeira aplicação concreta de ADR-0049 (RHF/Zustand split).
//
// See NOTICE.md.

import { isEqual as isDeepEqual } from '@ngard/tiny-isequal'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { type FocusColorId, type Theme } from '@/lib/design/contract/theme'
import { getPresetThemeStyles } from '@/lib/design/presets/theme-preset-helper'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

// ─── Constantes (espelham upstream tweakcn-ref/store/editor-store.ts:8-9) ───
const MAX_HISTORY_COUNT = 30
const HISTORY_OVERRIDE_THRESHOLD_MS = 500

// ─── Tipos ───────────────────────────────────────────────────────────────────

/**
 * HSL adjustments aplicados em cima do checkpoint (preserva base do preset
 * pra evitar compound shift entre slider drags).
 */
export interface HslAdjustments {
  hueShift: number
  saturationScale: number
  lightnessScale: number
}

const DEFAULT_HSL_ADJUSTMENTS: HslAdjustments = {
  hueShift: 0,
  saturationScale: 1,
  lightnessScale: 1,
}

/**
 * State container do editor de tema. Espelha `ThemeEditorState` upstream
 * (`tweakcn-ref/types/editor.ts`) com o tipo `Theme` Zod do projeto no slot
 * `styles`.
 */
export interface EditorThemeState {
  /** Modo atual de edição. Persistido junto com o resto do estado. */
  currentMode: 'light' | 'dark'
  /** 45 keys flat per-mode (light + dark). */
  styles: Theme
  /** HSL adjustments aplicados em cima do checkpoint. */
  hslAdjustments: HslAdjustments
  /** Nome do preset atual (`null` quando custom / edição livre). */
  preset: string | null
}

interface ThemeHistoryEntry {
  state: EditorThemeState
  timestamp: number
}

export interface ThemeEditorStore {
  /** Estado canonical do editor (vive em React state via Zustand). */
  themeState: EditorThemeState
  /**
   * Snapshot antes de batch op (HSL adjust, reset etc) pra revert. Distinto
   * do undo stack — não consome slot de history.
   */
  themeCheckpoint: EditorThemeState | null
  /** Past states (FIFO cap em `MAX_HISTORY_COUNT`). */
  history: ThemeHistoryEntry[]
  /** Future states (cleared on new push). */
  future: ThemeHistoryEntry[]
  /**
   * Tenant theme row id quando logged-in. `null` quando anônimo OU bootstrap
   * ainda não rodou. Decide UI Save habilitado/desabilitado.
   */
  loggedInThemeId: string | null
  /**
   * Snapshot do tenant vindo do server (RSC page → loadFromServer). Quando
   * presente + `loggedInThemeId !== null`, é a fonte de verdade que sobrescreve
   * persist do localStorage no mount. Permite "Reset pra tenant snapshot"
   * futuro.
   */
  tenantSnapshot: Theme | null
  /**
   * Currently focused color in the sidebar (S10 — sidebar ↔ preview sync).
   * `null` means no highlight. Substitui Zustand isolated store upstream
   * (`tweakcn-ref/store/color-control-focus-store.ts`).
   */
  focusedColor: FocusColorId | null

  // ── Mutations ─────────────────────────────────────────────────────────────
  setThemeState: (state: EditorThemeState) => void
  applyThemePreset: (preset: string) => void
  resetToCurrentPreset: () => void
  setCurrentMode: (mode: 'light' | 'dark') => void
  setHslAdjustments: (next: HslAdjustments | ((prev: HslAdjustments) => HslAdjustments)) => void
  /**
   * Hidratação server-driven: quando page.tsx resolve tenant + DB snapshot,
   * chama esta action pra forçar o store a usar o DB como source-of-truth,
   * sobrescrevendo o persist do localStorage. Limpa history (DB snapshot é
   * o novo baseline).
   */
  loadFromServer: (snapshot: Theme, themeId: string) => void

  // ── Checkpoint ────────────────────────────────────────────────────────────
  saveThemeCheckpoint: () => void
  restoreThemeCheckpoint: () => void
  clearThemeCheckpoint: () => void
  hasThemeChangedFromCheckpoint: () => boolean
  hasUnsavedChanges: () => boolean

  // ── History ───────────────────────────────────────────────────────────────
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // ── Focus color (sidebar ↔ preview sync — S10) ────────────────────────────
  setFocusedColor: (id: FocusColorId | null) => void
  clearFocusedColor: () => void
}

// ─── Default state ───────────────────────────────────────────────────────────
const defaultThemeState: EditorThemeState = {
  currentMode: 'light',
  styles: DEFAULT_THEME,
  hslAdjustments: DEFAULT_HSL_ADJUSTMENTS,
  preset: null,
}

// ─── Helpers internos ────────────────────────────────────────────────────────
function trimHistory(history: ThemeHistoryEntry[]): ThemeHistoryEntry[] {
  if (history.length <= MAX_HISTORY_COUNT) return history
  return history.slice(-MAX_HISTORY_COUNT)
}

// ─── Store ───────────────────────────────────────────────────────────────────
export const useThemeEditorStore = create<ThemeEditorStore>()(
  persist(
    (set, get) => ({
      themeState: defaultThemeState,
      themeCheckpoint: null,
      history: [],
      future: [],
      loggedInThemeId: null,
      tenantSnapshot: null,
      focusedColor: null,

      // ── setThemeState ───────────────────────────────────────────────────
      setThemeState: (newState: EditorThemeState) => {
        const oldThemeState = get().themeState
        let currentHistory = get().history
        let currentFuture = get().future

        // Espelha upstream tweakcn-ref/store/editor-store.ts:47-58.
        // Se SO `currentMode` mudou (toggle dark/light), não toca history —
        // mode flip não é "edit", é viewport change.
        const oldWithoutMode = { ...oldThemeState, currentMode: undefined as unknown }
        const newWithoutMode = { ...newState, currentMode: undefined as unknown }

        if (
          isDeepEqual(oldWithoutMode, newWithoutMode) &&
          oldThemeState.currentMode !== newState.currentMode
        ) {
          set({ themeState: newState })
          return
        }

        const currentTime = Date.now()
        const lastEntry = currentHistory[currentHistory.length - 1] ?? null

        // Debounce: novas entries só agrupam se passou o threshold.
        if (!lastEntry || currentTime - lastEntry.timestamp >= HISTORY_OVERRIDE_THRESHOLD_MS) {
          currentHistory = trimHistory([
            ...currentHistory,
            { state: oldThemeState, timestamp: currentTime },
          ])
          currentFuture = []
        }

        set({ themeState: newState, history: currentHistory, future: currentFuture })
      },

      // ── applyThemePreset ────────────────────────────────────────────────
      applyThemePreset: (preset: string) => {
        const currentThemeState = get().themeState
        const oldHistory = get().history
        const currentTime = Date.now()

        const newStyles = getPresetThemeStyles(preset)
        const newThemeState: EditorThemeState = {
          ...currentThemeState,
          preset,
          styles: newStyles,
          hslAdjustments: DEFAULT_HSL_ADJUSTMENTS,
        }

        const updatedHistory = trimHistory([
          ...oldHistory,
          { state: currentThemeState, timestamp: currentTime },
        ])

        set({
          themeState: newThemeState,
          themeCheckpoint: newThemeState,
          history: updatedHistory,
          future: [],
        })
      },

      // ── resetToCurrentPreset ─────────────────────────────────────────────
      resetToCurrentPreset: () => {
        const currentThemeState = get().themeState
        const presetName = currentThemeState.preset ?? 'default'
        const presetStyles = getPresetThemeStyles(presetName)
        const newThemeState: EditorThemeState = {
          ...currentThemeState,
          styles: presetStyles,
          hslAdjustments: DEFAULT_HSL_ADJUSTMENTS,
        }
        set({
          themeState: newThemeState,
          themeCheckpoint: newThemeState,
          history: [],
          future: [],
        })
      },

      // ── setCurrentMode ───────────────────────────────────────────────────
      setCurrentMode: (mode: 'light' | 'dark') => {
        const current = get().themeState
        if (current.currentMode === mode) return
        // Reusa setThemeState pra que a regra "só mode mudou → não toca history"
        // se aplique automático.
        get().setThemeState({ ...current, currentMode: mode })
      },

      // ── setHslAdjustments ────────────────────────────────────────────────
      setHslAdjustments: (next) => {
        const current = get().themeState
        const nextAdjustments = typeof next === 'function' ? next(current.hslAdjustments) : next
        set({
          themeState: { ...current, hslAdjustments: nextAdjustments },
        })
      },

      // ── loadFromServer ───────────────────────────────────────────────────
      loadFromServer: (snapshot: Theme, themeId: string) => {
        const current = get().themeState
        set({
          themeState: {
            currentMode: current.currentMode,
            styles: snapshot,
            hslAdjustments: DEFAULT_HSL_ADJUSTMENTS,
            preset: null,
          },
          themeCheckpoint: null,
          history: [],
          future: [],
          loggedInThemeId: themeId,
          tenantSnapshot: snapshot,
        })
      },

      // ── Checkpoint ───────────────────────────────────────────────────────
      saveThemeCheckpoint: () => {
        set({ themeCheckpoint: get().themeState })
      },
      restoreThemeCheckpoint: () => {
        const checkpoint = get().themeCheckpoint
        if (!checkpoint) return
        const oldThemeState = get().themeState
        const oldHistory = get().history
        const currentTime = Date.now()

        const updatedHistory = trimHistory([
          ...oldHistory,
          { state: oldThemeState, timestamp: currentTime },
        ])

        set({
          themeState: { ...checkpoint, currentMode: oldThemeState.currentMode },
          history: updatedHistory,
          future: [],
        })
      },
      clearThemeCheckpoint: () => {
        if (get().themeCheckpoint === null) return
        set({ themeCheckpoint: null })
      },
      hasThemeChangedFromCheckpoint: () => {
        const checkpoint = get().themeCheckpoint
        if (!checkpoint) return false
        return !isDeepEqual(get().themeState, checkpoint)
      },
      hasUnsavedChanges: () => {
        const themeState = get().themeState
        const presetName = themeState.preset ?? 'default'
        const presetStyles = getPresetThemeStyles(presetName)
        const stylesChanged = !isDeepEqual(themeState.styles, presetStyles)
        const hslChanged = !isDeepEqual(themeState.hslAdjustments, DEFAULT_HSL_ADJUSTMENTS)
        return stylesChanged || hslChanged
      },

      // ── Undo / Redo ──────────────────────────────────────────────────────
      undo: () => {
        const history = get().history
        if (history.length === 0) return

        const currentThemeState = get().themeState
        const future = get().future

        const lastEntry = history[history.length - 1]
        if (!lastEntry) return
        const newHistory = history.slice(0, -1)
        const newFuture = [{ state: currentThemeState, timestamp: Date.now() }, ...future]

        set({
          themeState: { ...lastEntry.state, currentMode: currentThemeState.currentMode },
          themeCheckpoint: lastEntry.state,
          history: newHistory,
          future: newFuture,
        })
      },
      redo: () => {
        const future = get().future
        if (future.length === 0) return

        const history = get().history
        const firstFuture = future[0]
        if (!firstFuture) return
        const newFuture = future.slice(1)
        const currentThemeState = get().themeState

        const updatedHistory = trimHistory([
          ...history,
          { state: currentThemeState, timestamp: Date.now() },
        ])

        set({
          themeState: { ...firstFuture.state, currentMode: currentThemeState.currentMode },
          themeCheckpoint: firstFuture.state,
          history: updatedHistory,
          future: newFuture,
        })
      },
      canUndo: () => get().history.length > 0,
      canRedo: () => get().future.length > 0,

      // ── Focus color (S10) ────────────────────────────────────────────────
      setFocusedColor: (id: FocusColorId | null) => {
        set({ focusedColor: id })
      },
      clearFocusedColor: () => {
        if (get().focusedColor === null) return
        set({ focusedColor: null })
      },
    }),
    {
      // ADAPT: espelha upstream tweakcn-ref/store/editor-store.ts:227-229 — só `name`.
      // skipHydration: true OBRIGATÓRIO porque nosso /temas tem Client Component
      // (view.tsx) renderizado dentro de RSC. Server SSR-renderiza com store
      // initial (sem localStorage) → `disabled={!canUndo()}` vira true →
      // HTML `disabled=""`. Client hidrata e (sem skipHydration) já leu
      // localStorage → store tem history → `disabled={false}` → SEM atributo.
      // Mismatch garantido, React 19 não patcha, handlers ficam órfãos.
      // Solução: server e client renderizam com store initial (mesmo markup),
      // ThemeProvider chama rehydrate() em useEffect post-mount, re-render
      // natural carrega state real.
      // (Upstream tweakcn não precisa porque editor é client-only — nada
      // SSR-renderizado depende do store.)
      name: 'theme-editor-storage',
      skipHydration: true,
    },
  ),
)

// ─── Helpers exportados pra testes + bootstrap ──────────────────────────────
export { DEFAULT_HSL_ADJUSTMENTS, defaultThemeState }
