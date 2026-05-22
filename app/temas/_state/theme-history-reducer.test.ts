// Tests para theme-history-reducer.ts
// Cobre todos os 7 action types + edge cases (debounce protection, FIFO cap,
// branch rewrite após UNDO+PUSH, checkpoint isolation).

import { describe, expect, it } from 'vitest'

import type { Theme } from '@/lib/design/contract/theme'
import { DEFAULT_DARK_COLORS, DEFAULT_LIGHT_COLORS } from '@/lib/design/theme-defaults'

import {
  canRedo,
  canUndo,
  createInitialThemeHistory,
  MAX_HISTORY_COUNT,
  themeHistoryReducer,
} from './theme-history-reducer'

// ─── Fixtures ────────────────────────────────────────────────────────────────
const baseTheme: Theme = { light: DEFAULT_LIGHT_COLORS, dark: DEFAULT_DARK_COLORS }

function mutate(theme: Theme, primary: string): Theme {
  return {
    ...theme,
    light: { ...theme.light, primary },
  }
}

const themeA: Theme = baseTheme
const themeB: Theme = mutate(baseTheme, 'oklch(0.5 0.2 270)')
const themeC: Theme = mutate(baseTheme, 'oklch(0.7 0.15 100)')

// ─── PUSH ────────────────────────────────────────────────────────────────────
describe('themeHistoryReducer — PUSH', () => {
  it('moves present to past and sets new present', () => {
    const initial = createInitialThemeHistory(themeA)
    const next = themeHistoryReducer(initial, { type: 'PUSH', next: themeB })
    expect(next.past).toHaveLength(1)
    expect(next.past[0]).toEqual(themeA)
    expect(next.present).toEqual(themeB)
    expect(next.future).toHaveLength(0)
  })

  it('ignores duplicate state (debounce protection)', () => {
    const initial = createInitialThemeHistory(themeA)
    const next = themeHistoryReducer(initial, { type: 'PUSH', next: themeA })
    expect(next).toBe(initial) // identity preserved — no re-render
  })

  it('clears future when PUSH happens after UNDO (branch rewrite)', () => {
    let state = createInitialThemeHistory(themeA)
    state = themeHistoryReducer(state, { type: 'PUSH', next: themeB })
    state = themeHistoryReducer(state, { type: 'UNDO' })
    expect(state.future).toHaveLength(1)
    state = themeHistoryReducer(state, { type: 'PUSH', next: themeC })
    expect(state.future).toHaveLength(0)
    expect(state.present).toEqual(themeC)
  })

  it('caps past at MAX_HISTORY_COUNT (FIFO)', () => {
    let state = createInitialThemeHistory(themeA)
    for (let i = 0; i < MAX_HISTORY_COUNT + 5; i++) {
      const next = mutate(themeA, `oklch(0.5 0.${(i + 1) % 10} 270)`)
      // Need each next to be distinct (chroma varies)
      const variant: Theme = {
        ...next,
        light: { ...next.light, ring: `oklch(0.6 0.1 ${i})` },
      }
      state = themeHistoryReducer(state, { type: 'PUSH', next: variant })
    }
    expect(state.past.length).toBeLessThanOrEqual(MAX_HISTORY_COUNT)
    expect(state.past.length).toBe(MAX_HISTORY_COUNT)
  })
})

// ─── UNDO ────────────────────────────────────────────────────────────────────
describe('themeHistoryReducer — UNDO', () => {
  it('moves past last to present and current present to future', () => {
    let state = createInitialThemeHistory(themeA)
    state = themeHistoryReducer(state, { type: 'PUSH', next: themeB })
    state = themeHistoryReducer(state, { type: 'UNDO' })
    expect(state.present).toEqual(themeA)
    expect(state.future).toHaveLength(1)
    expect(state.future[0]).toEqual(themeB)
    expect(state.past).toHaveLength(0)
  })

  it('is a no-op when past is empty', () => {
    const initial = createInitialThemeHistory(themeA)
    const next = themeHistoryReducer(initial, { type: 'UNDO' })
    expect(next).toBe(initial)
  })
})

// ─── REDO ────────────────────────────────────────────────────────────────────
describe('themeHistoryReducer — REDO', () => {
  it('restores undone state', () => {
    let state = createInitialThemeHistory(themeA)
    state = themeHistoryReducer(state, { type: 'PUSH', next: themeB })
    state = themeHistoryReducer(state, { type: 'UNDO' })
    state = themeHistoryReducer(state, { type: 'REDO' })
    expect(state.present).toEqual(themeB)
    expect(state.future).toHaveLength(0)
    expect(state.past).toHaveLength(1)
  })

  it('is a no-op when future is empty', () => {
    const initial = createInitialThemeHistory(themeA)
    const next = themeHistoryReducer(initial, { type: 'REDO' })
    expect(next).toBe(initial)
  })
})

// ─── CHECKPOINT ──────────────────────────────────────────────────────────────
describe('themeHistoryReducer — CHECKPOINT', () => {
  it('CHECKPOINT_SET captures current present', () => {
    const initial = createInitialThemeHistory(themeA)
    const next = themeHistoryReducer(initial, { type: 'CHECKPOINT_SET' })
    expect(next.checkpoint).toEqual(themeA)
  })

  it('CHECKPOINT_CLEAR removes snapshot', () => {
    let state = createInitialThemeHistory(themeA)
    state = themeHistoryReducer(state, { type: 'CHECKPOINT_SET' })
    state = themeHistoryReducer(state, { type: 'CHECKPOINT_CLEAR' })
    expect(state.checkpoint).toBeNull()
  })

  it('CHECKPOINT_CLEAR is no-op when checkpoint is null', () => {
    const initial = createInitialThemeHistory(themeA)
    const next = themeHistoryReducer(initial, { type: 'CHECKPOINT_CLEAR' })
    expect(next).toBe(initial)
  })

  it('CHECKPOINT_RESTORE applies snapshot to present', () => {
    let state = createInitialThemeHistory(themeA)
    state = themeHistoryReducer(state, { type: 'CHECKPOINT_SET' })
    state = themeHistoryReducer(state, { type: 'PUSH', next: themeB })
    state = themeHistoryReducer(state, { type: 'CHECKPOINT_RESTORE' })
    expect(state.present).toEqual(themeA)
    // History NOT erased — checkpoint is orthogonal to undo/redo stack
    expect(state.past).toHaveLength(1)
  })

  it('CHECKPOINT_RESTORE is no-op when checkpoint is null', () => {
    const initial = createInitialThemeHistory(themeA)
    const next = themeHistoryReducer(initial, { type: 'CHECKPOINT_RESTORE' })
    expect(next).toBe(initial)
  })

  it('CHECKPOINT_RESTORE is no-op when present already equals checkpoint', () => {
    let state = createInitialThemeHistory(themeA)
    state = themeHistoryReducer(state, { type: 'CHECKPOINT_SET' })
    const next = themeHistoryReducer(state, { type: 'CHECKPOINT_RESTORE' })
    expect(next).toBe(state) // identity preserved
  })
})

// ─── RESET ───────────────────────────────────────────────────────────────────
describe('themeHistoryReducer — RESET', () => {
  it('wipes past, future, checkpoint and applies new preset', () => {
    let state = createInitialThemeHistory(themeA)
    state = themeHistoryReducer(state, { type: 'PUSH', next: themeB })
    state = themeHistoryReducer(state, { type: 'CHECKPOINT_SET' })
    state = themeHistoryReducer(state, { type: 'RESET', preset: themeC })
    expect(state.past).toHaveLength(0)
    expect(state.future).toHaveLength(0)
    expect(state.checkpoint).toBeNull()
    expect(state.present).toEqual(themeC)
  })
})

// ─── Selectors ───────────────────────────────────────────────────────────────
describe('selectors — canUndo / canRedo', () => {
  it('canUndo reflects past length', () => {
    const initial = createInitialThemeHistory(themeA)
    expect(canUndo(initial)).toBe(false)
    const pushed = themeHistoryReducer(initial, { type: 'PUSH', next: themeB })
    expect(canUndo(pushed)).toBe(true)
  })

  it('canRedo reflects future length', () => {
    let state = createInitialThemeHistory(themeA)
    expect(canRedo(state)).toBe(false)
    state = themeHistoryReducer(state, { type: 'PUSH', next: themeB })
    state = themeHistoryReducer(state, { type: 'UNDO' })
    expect(canRedo(state)).toBe(true)
  })
})
