// RESEARCH: tweakcn (Apache-2.0) — testando store espelho de
// `tweakcn-ref/store/editor-store.ts`. Cobre history (push/undo/redo + cap),
// checkpoint, preset apply, mode toggle preserva história, loadFromServer,
// hasUnsavedChanges.

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { defaultPresets } from '@/lib/design/presets/theme-presets'
import { DEFAULT_THEME } from '@/lib/design/theme-defaults'
import {
  DEFAULT_HSL_ADJUSTMENTS,
  defaultThemeState,
  type EditorThemeState,
  useThemeEditorStore,
} from '@/lib/state/theme-editor-store'

// Helper pra reset do store entre testes (Zustand persiste módulo-level)
function resetStore() {
  useThemeEditorStore.setState({
    themeState: defaultThemeState,
    themeCheckpoint: null,
    history: [],
    future: [],
    loggedInThemeId: null,
    tenantSnapshot: null,
  })
}

describe('useThemeEditorStore', () => {
  beforeEach(() => {
    resetStore()
  })

  afterEach(() => {
    if (typeof localStorage !== 'undefined') localStorage.clear()
  })

  describe('initial state', () => {
    it('renders DEFAULT_THEME as initial styles', () => {
      const state = useThemeEditorStore.getState()
      expect(state.themeState.styles).toEqual(DEFAULT_THEME)
      expect(state.themeState.currentMode).toBe('light')
      expect(state.themeState.preset).toBeNull()
      expect(state.history).toEqual([])
      expect(state.future).toEqual([])
      expect(state.themeCheckpoint).toBeNull()
    })

    it('returns canUndo=false / canRedo=false initially', () => {
      const state = useThemeEditorStore.getState()
      expect(state.canUndo()).toBe(false)
      expect(state.canRedo()).toBe(false)
    })
  })

  describe('setThemeState', () => {
    it('pushes old state to history when content changes', async () => {
      const initial = useThemeEditorStore.getState().themeState

      // Espera passar o threshold pra que o segundo push gere entry
      const modified: EditorThemeState = {
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.5 0.2 30)' },
        },
      }
      useThemeEditorStore.getState().setThemeState(modified)

      const after = useThemeEditorStore.getState()
      expect(after.history.length).toBe(1)
      expect(after.history[0]!.state).toEqual(initial)
      expect(after.themeState).toEqual(modified)
    })

    it('does NOT push to history when only currentMode changes', () => {
      const initial = useThemeEditorStore.getState().themeState
      useThemeEditorStore.getState().setThemeState({ ...initial, currentMode: 'dark' })

      const after = useThemeEditorStore.getState()
      expect(after.history.length).toBe(0)
      expect(after.themeState.currentMode).toBe('dark')
    })

    it('caps history at MAX_HISTORY_COUNT (30)', async () => {
      const initial = useThemeEditorStore.getState().themeState
      // Empurra 35 entries com gap forçado pra cair fora do debounce
      for (let i = 0; i < 35; i++) {
        // Não dá pra confiar em Date.now em testes; vamos manipular state direto
        useThemeEditorStore.setState((s) => ({
          ...s,
          history: [...s.history, { state: initial, timestamp: i * 1000 }],
        }))
      }
      // Agora trigger trim via setThemeState push
      const modified: EditorThemeState = {
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.6 0.2 30)' },
        },
      }
      useThemeEditorStore.getState().setThemeState(modified)

      const after = useThemeEditorStore.getState()
      // 35 antigas + 1 nova com push, mas trim retornaria os ultimos 30
      // Lembrando: trim só roda no push novo. Os 35 ja existentes ficam
      // até push trigger trim. Aqui o push gera 35+1=36, slice(-30)=30.
      expect(after.history.length).toBeLessThanOrEqual(30)
    })
  })

  describe('undo / redo', () => {
    it('undo restores previous state', () => {
      const initial = useThemeEditorStore.getState().themeState
      const modified: EditorThemeState = {
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.7 0.2 30)' },
        },
      }
      useThemeEditorStore.getState().setThemeState(modified)
      expect(useThemeEditorStore.getState().canUndo()).toBe(true)

      useThemeEditorStore.getState().undo()
      const after = useThemeEditorStore.getState()
      expect(after.themeState.styles).toEqual(initial.styles)
      expect(after.canUndo()).toBe(false)
      expect(after.canRedo()).toBe(true)
    })

    it('redo restores next state', () => {
      const initial = useThemeEditorStore.getState().themeState
      const modified: EditorThemeState = {
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.7 0.2 30)' },
        },
      }
      useThemeEditorStore.getState().setThemeState(modified)
      useThemeEditorStore.getState().undo()
      expect(useThemeEditorStore.getState().canRedo()).toBe(true)

      useThemeEditorStore.getState().redo()
      const after = useThemeEditorStore.getState()
      expect(after.themeState.styles).toEqual(modified.styles)
    })

    it('undo preserves currentMode of present', () => {
      const initial = useThemeEditorStore.getState().themeState
      const modified: EditorThemeState = {
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.7 0.2 30)' },
        },
      }
      useThemeEditorStore.getState().setThemeState(modified)
      // Troca pra dark (não toca history)
      useThemeEditorStore.getState().setCurrentMode('dark')
      // Undo deve voltar styles mas manter currentMode='dark'
      useThemeEditorStore.getState().undo()
      const after = useThemeEditorStore.getState()
      expect(after.themeState.styles).toEqual(initial.styles)
      expect(after.themeState.currentMode).toBe('dark')
    })

    it('undo no-op when history empty', () => {
      const initial = useThemeEditorStore.getState()
      useThemeEditorStore.getState().undo()
      const after = useThemeEditorStore.getState()
      expect(after.themeState).toEqual(initial.themeState)
    })

    it('redo no-op when future empty', () => {
      const initial = useThemeEditorStore.getState()
      useThemeEditorStore.getState().redo()
      const after = useThemeEditorStore.getState()
      expect(after.themeState).toEqual(initial.themeState)
    })
  })

  describe('checkpoint', () => {
    it('saveThemeCheckpoint stores current state', () => {
      const initial = useThemeEditorStore.getState().themeState
      useThemeEditorStore.getState().saveThemeCheckpoint()
      expect(useThemeEditorStore.getState().themeCheckpoint).toEqual(initial)
    })

    it('restoreThemeCheckpoint reverts to saved snapshot', () => {
      const initial = useThemeEditorStore.getState().themeState
      useThemeEditorStore.getState().saveThemeCheckpoint()

      const modified: EditorThemeState = {
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.7 0.2 30)' },
        },
      }
      useThemeEditorStore.getState().setThemeState(modified)
      useThemeEditorStore.getState().restoreThemeCheckpoint()

      const after = useThemeEditorStore.getState()
      expect(after.themeState.styles).toEqual(initial.styles)
    })

    it('hasThemeChangedFromCheckpoint returns false when identical', () => {
      useThemeEditorStore.getState().saveThemeCheckpoint()
      expect(useThemeEditorStore.getState().hasThemeChangedFromCheckpoint()).toBe(false)
    })

    it('hasThemeChangedFromCheckpoint returns true after edit', () => {
      const initial = useThemeEditorStore.getState().themeState
      useThemeEditorStore.getState().saveThemeCheckpoint()
      const modified: EditorThemeState = {
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.7 0.2 30)' },
        },
      }
      useThemeEditorStore.getState().setThemeState(modified)
      expect(useThemeEditorStore.getState().hasThemeChangedFromCheckpoint()).toBe(true)
    })

    it('clearThemeCheckpoint nulls out', () => {
      useThemeEditorStore.getState().saveThemeCheckpoint()
      expect(useThemeEditorStore.getState().themeCheckpoint).not.toBeNull()
      useThemeEditorStore.getState().clearThemeCheckpoint()
      expect(useThemeEditorStore.getState().themeCheckpoint).toBeNull()
    })
  })

  describe('applyThemePreset', () => {
    it('switches to preset and clears HSL adjustments', () => {
      const presetKey = Object.keys(defaultPresets)[0]
      if (!presetKey) return // safety guard
      useThemeEditorStore.getState().applyThemePreset(presetKey)
      const after = useThemeEditorStore.getState().themeState
      expect(after.preset).toBe(presetKey)
      expect(after.hslAdjustments).toEqual(DEFAULT_HSL_ADJUSTMENTS)
    })

    it('updates checkpoint to the new preset state', () => {
      const presetKey = Object.keys(defaultPresets)[0]
      if (!presetKey) return
      useThemeEditorStore.getState().applyThemePreset(presetKey)
      const cp = useThemeEditorStore.getState().themeCheckpoint
      expect(cp).not.toBeNull()
      expect(cp?.preset).toBe(presetKey)
    })

    it('pushes prior state to history (preserva undo)', () => {
      const presetKey = Object.keys(defaultPresets)[0]
      if (!presetKey) return
      useThemeEditorStore.getState().applyThemePreset(presetKey)
      expect(useThemeEditorStore.getState().history.length).toBe(1)
      expect(useThemeEditorStore.getState().canUndo()).toBe(true)
    })
  })

  describe('resetToCurrentPreset', () => {
    it('resets styles to current preset and wipes history', () => {
      const presetKey = Object.keys(defaultPresets)[0]
      if (!presetKey) return
      useThemeEditorStore.getState().applyThemePreset(presetKey)
      // Modifica algo após aplicar preset
      const modState = useThemeEditorStore.getState().themeState
      useThemeEditorStore.getState().setThemeState({
        ...modState,
        styles: {
          ...modState.styles,
          light: { ...modState.styles.light, primary: 'oklch(0.9 0.1 50)' },
        },
      })

      useThemeEditorStore.getState().resetToCurrentPreset()
      const after = useThemeEditorStore.getState()
      expect(after.history).toEqual([])
      expect(after.future).toEqual([])
    })
  })

  describe('setCurrentMode', () => {
    it('toggles between light and dark', () => {
      useThemeEditorStore.getState().setCurrentMode('dark')
      expect(useThemeEditorStore.getState().themeState.currentMode).toBe('dark')
      useThemeEditorStore.getState().setCurrentMode('light')
      expect(useThemeEditorStore.getState().themeState.currentMode).toBe('light')
    })

    it('no-op when already in target mode', () => {
      const initial = useThemeEditorStore.getState().themeState
      useThemeEditorStore.getState().setCurrentMode('light')
      expect(useThemeEditorStore.getState().themeState).toBe(initial)
    })
  })

  describe('setHslAdjustments', () => {
    it('accepts object', () => {
      useThemeEditorStore.getState().setHslAdjustments({
        hueShift: 30,
        saturationScale: 1.2,
        lightnessScale: 0.95,
      })
      const adj = useThemeEditorStore.getState().themeState.hslAdjustments
      expect(adj.hueShift).toBe(30)
      expect(adj.saturationScale).toBe(1.2)
      expect(adj.lightnessScale).toBe(0.95)
    })

    it('accepts updater function', () => {
      useThemeEditorStore.getState().setHslAdjustments((prev) => ({
        ...prev,
        hueShift: prev.hueShift + 10,
      }))
      expect(useThemeEditorStore.getState().themeState.hslAdjustments.hueShift).toBe(10)
    })
  })

  describe('loadFromServer', () => {
    it('sets tenantSnapshot + loggedInThemeId and clears history', () => {
      // Cria edits anônimos primeiro
      const initial = useThemeEditorStore.getState().themeState
      useThemeEditorStore.getState().setThemeState({
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.4 0.3 200)' },
        },
      })
      expect(useThemeEditorStore.getState().history.length).toBe(1)

      // Server hidrata com DB snapshot — vence persist
      useThemeEditorStore.getState().loadFromServer(DEFAULT_THEME, 'theme-id-123')
      const after = useThemeEditorStore.getState()
      expect(after.loggedInThemeId).toBe('theme-id-123')
      expect(after.tenantSnapshot).toEqual(DEFAULT_THEME)
      expect(after.themeState.styles).toEqual(DEFAULT_THEME)
      expect(after.history).toEqual([])
      expect(after.future).toEqual([])
      expect(after.themeCheckpoint).toBeNull()
    })

    it('preserves currentMode across loadFromServer', () => {
      useThemeEditorStore.getState().setCurrentMode('dark')
      useThemeEditorStore.getState().loadFromServer(DEFAULT_THEME, 'theme-id-456')
      expect(useThemeEditorStore.getState().themeState.currentMode).toBe('dark')
    })
  })

  describe('hasUnsavedChanges', () => {
    it('returns false at default state (no edits)', () => {
      expect(useThemeEditorStore.getState().hasUnsavedChanges()).toBe(false)
    })

    it('returns true after style change', () => {
      const initial = useThemeEditorStore.getState().themeState
      useThemeEditorStore.getState().setThemeState({
        ...initial,
        styles: {
          ...initial.styles,
          light: { ...initial.styles.light, primary: 'oklch(0.4 0.3 200)' },
        },
      })
      expect(useThemeEditorStore.getState().hasUnsavedChanges()).toBe(true)
    })

    it('returns true after HSL adjustment', () => {
      useThemeEditorStore.getState().setHslAdjustments({
        hueShift: 30,
        saturationScale: 1.2,
        lightnessScale: 0.95,
      })
      expect(useThemeEditorStore.getState().hasUnsavedChanges()).toBe(true)
    })
  })
})
