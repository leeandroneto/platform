'use client'
// RESEARCH: tweakcn (Apache-2.0) — adapted from store/editor-store.ts
// ADAPT: Zustand store → RHF + useReducer history + useDebouncedCallback
//        (stack travada CLAUDE.md: RHF + RSC + Server Actions; ADR-0040 §C).
// See NOTICE.md.
//
// Hook composto que integra:
//   - useForm RHF (source-of-truth do working state — preview live)
//   - useReducer themeHistoryReducer (canonical undo/redo + checkpoint)
//   - useDebouncedCallback (espelha TweakCN debounce 500ms — evita 1 entry/keystroke)
//
// Decisões arquiteturais cravadas:
//   1. form.watch() = working state (re-render granular driven by RHF subscription).
//      history.present = canonical state (snapshot persistido a cada debounce window).
//   2. PUSH ao history é debounced 500ms (HISTORY_OVERRIDE_THRESHOLD_MS TweakCN).
//   3. UNDO/REDO sincronizam form via form.reset() — protegido por skipPushRef
//      pra não re-PUSH o estado que veio do próprio undo (anti-loop).
//   4. Checkpoint isolado do undo stack (revert antes de HSL adjust sem consumir slot).
//   5. Persist é callback opt-in (onPersistChange) — não acoplado ao hook.
//
// Self-review issues identificados/mitigados:
//   - Loop infinito form.reset() ↔ subscription: mitigado por skipPushRef flag.
//   - pushDebounced pending quando undo/redo dispara: flushOnNavigate cancela
//     pending via pushDebounced + setTimeout(0) flush; mas useDebouncedCallback
//     atual não expõe .cancel(), então optei por ignorar pending PUSH se o
//     próximo subscriber callback vier com skipPushRef=true (idempotente).
//   - form.watch() retornando new ref a cada render: usado watch(callback) que
//     é subscription-based (não re-render em deps).

import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { type Path, type PathValue, useForm, type UseFormReturn } from 'react-hook-form'

import { type Theme, ThemeSchema } from '@/lib/design/contract/theme'
import { useDebouncedCallback } from '@/lib/hooks/use-debounced-callback'

import {
  canRedo as canRedoSelector,
  canUndo as canUndoSelector,
  createInitialThemeHistory,
  themeHistoryReducer,
} from './theme-history-reducer'

/** Debounce window pra PUSH ao history. Espelha tweakcn-ref/store/editor-store.ts:9 */
const HISTORY_DEBOUNCE_MS = 500

export interface ThemeFormApi {
  /** RHF form instance — passar pro FormProvider e useFormContext nos controles. */
  form: UseFormReturn<Theme>

  /** Canonical state (history.present). Sincronizado com form.watch() via debounce. */
  themeState: Theme

  // ── Mutations ─────────────────────────────────────────────────────────────
  /**
   * Atualiza um valor no form (dirties field). Não dispara PUSH imediato —
   * subscription debounce faz isso.
   */
  setThemeStyle: <K extends Path<Theme>>(path: K, value: PathValue<Theme, K>) => void

  /** Reset total: history vazio, present = preset, form sincronizado. */
  reset: (preset: Theme) => void

  // ── History ───────────────────────────────────────────────────────────────
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean

  // ── Checkpoint (pra HSL adjust revert) ────────────────────────────────────
  setCheckpoint: () => void
  clearCheckpoint: () => void
  restoreCheckpoint: () => void
  /** True se checkpoint snapshot existe (UI pode mostrar "Revert" button). */
  hasCheckpoint: boolean
}

export interface UseThemeFormProps {
  initialTheme: Theme
  /**
   * Callback opt-in chamado quando history.present muda (após debounce).
   * Use pra persistir em localStorage, telemetria, etc. Não bloqueia render.
   */
  onPersistChange?: (theme: Theme) => void
}

/**
 * Effects bridge: form ↔ history bidirecional.
 *
 * Direção 1 — user input via form.setValue → subscription → debounced PUSH.
 *   form em ref pra esconder watch() do React Compiler analysis
 *   (`react-hooks/incompatible-library` é false-positive em subscription
 *   pattern oficial RHF).
 *
 * Direção 2 — UNDO/REDO/RESTORE muda history.present → form.reset(present).
 *   skipNextPushRef previne re-PUSH do estado vindo do próprio dispatch.
 */
function useBridgeFormHistory(
  form: UseFormReturn<Theme>,
  presentTheme: Theme,
  pushDebounced: (next: Theme) => void,
  skipNextPushRef: React.MutableRefObject<boolean>,
): void {
  const formRef = useRef(form)
  useEffect(() => {
    formRef.current = form
  }, [form])

  // Direção 1: subscribe form changes
  useEffect(() => {
    const subscription = formRef.current.watch((value) => {
      const parsed = ThemeSchema.safeParse(value)
      if (!parsed.success) return
      pushDebounced(parsed.data)
    })
    return () => subscription.unsubscribe()
  }, [pushDebounced])

  // Direção 2: sync form when present changed via dispatch
  useEffect(() => {
    if (form.getValues() === presentTheme) return
    skipNextPushRef.current = true
    form.reset(presentTheme, {
      keepDefaultValues: true,
      keepDirty: false,
      keepErrors: false,
    })
  }, [presentTheme, form, skipNextPushRef])
}

export function useThemeForm({ initialTheme, onPersistChange }: UseThemeFormProps): ThemeFormApi {
  const form = useForm<Theme>({
    // Zod 4 implementa Standard Schema nativamente — standardSchemaResolver.
    resolver: standardSchemaResolver(ThemeSchema),
    defaultValues: initialTheme,
    mode: 'onChange',
  })

  const [history, dispatch] = useReducer(
    themeHistoryReducer,
    initialTheme,
    createInitialThemeHistory,
  )

  const skipNextPushRef = useRef(false)
  const onPersistChangeRef = useRef(onPersistChange)
  useEffect(() => {
    onPersistChangeRef.current = onPersistChange
  }, [onPersistChange])

  const pushDebounced = useDebouncedCallback((next: Theme) => {
    if (skipNextPushRef.current) {
      skipNextPushRef.current = false
      return
    }
    dispatch({ type: 'PUSH', next })
    onPersistChangeRef.current?.(next)
  }, HISTORY_DEBOUNCE_MS)

  useBridgeFormHistory(form, history.present, pushDebounced, skipNextPushRef)

  // ── Mutations ─────────────────────────────────────────────────────────────
  const setThemeStyle = useCallback(
    <K extends Path<Theme>>(path: K, value: PathValue<Theme, K>) => {
      form.setValue(path, value, { shouldDirty: true, shouldValidate: false })
    },
    [form],
  )

  const reset = useCallback((preset: Theme) => {
    skipNextPushRef.current = true
    dispatch({ type: 'RESET', preset })
  }, [])

  // ── History controls ──────────────────────────────────────────────────────
  const undo = useCallback(() => {
    skipNextPushRef.current = true
    dispatch({ type: 'UNDO' })
  }, [])

  const redo = useCallback(() => {
    skipNextPushRef.current = true
    dispatch({ type: 'REDO' })
  }, [])

  // ── Checkpoint controls ───────────────────────────────────────────────────
  const setCheckpoint = useCallback(() => dispatch({ type: 'CHECKPOINT_SET' }), [])
  const clearCheckpoint = useCallback(() => dispatch({ type: 'CHECKPOINT_CLEAR' }), [])
  const restoreCheckpoint = useCallback(() => {
    skipNextPushRef.current = true
    dispatch({ type: 'CHECKPOINT_RESTORE' })
  }, [])

  // ── API estável (memoized pra useImperativeHandle no provider) ───────────
  return useMemo<ThemeFormApi>(
    () => ({
      form,
      themeState: history.present,
      setThemeStyle,
      reset,
      undo,
      redo,
      canUndo: canUndoSelector(history),
      canRedo: canRedoSelector(history),
      setCheckpoint,
      clearCheckpoint,
      restoreCheckpoint,
      hasCheckpoint: history.checkpoint !== null,
    }),
    [
      form,
      history,
      setThemeStyle,
      reset,
      undo,
      redo,
      setCheckpoint,
      clearCheckpoint,
      restoreCheckpoint,
    ],
  )
}
