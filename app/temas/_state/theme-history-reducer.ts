// RESEARCH: tweakcn (Apache-2.0) — adapted from store/editor-store.ts
// ADAPT: Zustand global state → useReducer pure pattern (stack travada ADR-0040 §C).
// See NOTICE.md.
//
// Lógica preservada 100% do TweakCN:
//   - MAX_HISTORY_COUNT=30 (FIFO cap em past[])
//   - PUSH ignora estado igual (debounce protection)
//   - UNDO/REDO movem entre past/future
//   - PUSH after UNDO clears future (branch rewrite)
//   - CHECKPOINT preserva snapshot pra revert antes de HSL adjust
//   - RESET wipe history quando aplicar preset novo
//
// Mecanismo adaptado:
//   - Zustand store + persist → useReducer pure (testável isolado, sem global)
//   - timestamp + HISTORY_OVERRIDE_THRESHOLD_MS no original substituído por
//     debounce externo no hook composto (use-theme-form.ts) — semântica
//     equivalente, mas testável separadamente.

import { isEqual } from '@ngard/tiny-isequal'

import type { Theme } from '@/lib/design/contract/theme'

export const MAX_HISTORY_COUNT = 30 // espelha tweakcn-ref/store/editor-store.ts:8

export interface ThemeHistoryState {
  /** Older states (FIFO cap em MAX_HISTORY_COUNT). */
  past: Theme[]
  /** Current canonical state. */
  present: Theme
  /** Redoable states (cleared on new PUSH). */
  future: Theme[]
  /**
   * Snapshot pra revert antes de HSL adjust (ou outro batch op).
   * Distinct de history past/future — não consome slot de undo.
   */
  checkpoint: Theme | null
}

export type ThemeHistoryAction =
  /** Novo state pushado pelo user: present→past, clear future. Ignora se igual. */
  | { type: 'PUSH'; next: Theme }
  /** past→present, current present→future. No-op se past vazio. */
  | { type: 'UNDO' }
  /** future→present, current present→past. No-op se future vazio. */
  | { type: 'REDO' }
  /** Snapshot present pra revert futuro. */
  | { type: 'CHECKPOINT_SET' }
  /** Limpa snapshot (após confirmar batch op). */
  | { type: 'CHECKPOINT_CLEAR' }
  /** Restaura present a partir do checkpoint (no-op se null). */
  | { type: 'CHECKPOINT_RESTORE' }
  /** Reset total: past/future/checkpoint vazios, present = preset. */
  | { type: 'RESET'; preset: Theme }

export function themeHistoryReducer(
  state: ThemeHistoryState,
  action: ThemeHistoryAction,
): ThemeHistoryState {
  switch (action.type) {
    case 'PUSH': {
      // Debounce protection: ignora se state didn't actually change
      if (isEqual(state.present, action.next)) return state
      // FIFO cap (espelha tweakcn-ref/store/editor-store.ts:76-78)
      const appended = [...state.past, state.present]
      const newPast =
        appended.length > MAX_HISTORY_COUNT ? appended.slice(-MAX_HISTORY_COUNT) : appended
      return { ...state, past: newPast, present: action.next, future: [] }
    }
    case 'UNDO': {
      const newPresent = state.past[state.past.length - 1]
      if (newPresent === undefined) return state // past was empty
      const newPast = state.past.slice(0, -1)
      return {
        ...state,
        past: newPast,
        present: newPresent,
        future: [state.present, ...state.future],
      }
    }
    case 'REDO': {
      const newPresent = state.future[0]
      if (newPresent === undefined) return state // future was empty
      const rest = state.future.slice(1)
      return {
        ...state,
        past: [...state.past, state.present],
        present: newPresent,
        future: rest,
      }
    }
    case 'CHECKPOINT_SET':
      return { ...state, checkpoint: state.present }
    case 'CHECKPOINT_CLEAR':
      if (state.checkpoint === null) return state
      return { ...state, checkpoint: null }
    case 'CHECKPOINT_RESTORE':
      if (state.checkpoint === null) return state
      if (isEqual(state.present, state.checkpoint)) return state
      return { ...state, present: state.checkpoint }
    case 'RESET':
      return { past: [], present: action.preset, future: [], checkpoint: null }
  }
}

export function createInitialThemeHistory(preset: Theme): ThemeHistoryState {
  return { past: [], present: preset, future: [], checkpoint: null }
}

export function canUndo(state: ThemeHistoryState): boolean {
  return state.past.length > 0
}

export function canRedo(state: ThemeHistoryState): boolean {
  return state.future.length > 0
}
