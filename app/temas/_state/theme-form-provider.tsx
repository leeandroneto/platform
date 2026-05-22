'use client'
// RESEARCH: custom — provider pattern pra distribuir ThemeFormApi sem prop drilling.
// Pattern interno (não TweakCN — Zustand global SSOT lá não precisa de provider).
//
// Decisões cravadas:
//   - ThemeFormContext fornece API a todos os children (control-panel,
//     action-bar, preview-panel).
//   - useImperativeHandle(apiRef) expõe API a pais opcionais — pattern do
//     briefing pra action-bar consumir undo/redo sem coupling com control-panel.
//   - FormProvider RHF é montado dentro do ThemeFormContext.Provider — assim
//     useFormContext() funciona em children que registram fields.

import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useImperativeHandle,
} from 'react'

import { FormProvider } from 'react-hook-form'

import { AppError } from '@/lib/contracts/errors'

import { type ThemeFormApi, useThemeForm, type UseThemeFormProps } from './use-theme-form'

const ThemeFormContext = createContext<ThemeFormApi | null>(null)

export interface ThemeFormProviderProps extends UseThemeFormProps {
  /**
   * Ref imperative pra acessar ThemeFormApi de fora do tree (e.g. parent
   * <ActionBar /> co-localizado com <ControlPanel /> ambos descendentes
   * deste provider, mas ActionBar quer chamar undo/redo direto).
   */
  apiRef?: RefObject<ThemeFormApi | null>
  children: ReactNode
}

export function ThemeFormProvider({
  initialTheme,
  onPersistChange,
  apiRef,
  children,
}: ThemeFormProviderProps) {
  const api = useThemeForm({ initialTheme, onPersistChange })

  // Expose API to imperative ref (action-bar consumption pattern).
  useImperativeHandle(apiRef, () => api, [api])

  return (
    <ThemeFormContext.Provider value={api}>
      <FormProvider {...api.form}>{children}</FormProvider>
    </ThemeFormContext.Provider>
  )
}

/**
 * Hook pra consumir ThemeFormApi em qualquer Client Component descendente
 * de <ThemeFormProvider />. Throws se chamado fora do provider — fail fast.
 */
export function useThemeFormContext(): ThemeFormApi {
  const ctx = useContext(ThemeFormContext)
  if (ctx === null) {
    throw AppError.internal({
      key: 'theme_studio.provider_missing',
      fallback: 'useThemeFormContext must be used within a <ThemeFormProvider> ancestor.',
    })
  }
  return ctx
}
