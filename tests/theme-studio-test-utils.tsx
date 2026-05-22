// RESEARCH: custom — vitest test helper (não componente UX; só wrapper utility)
// Helper centralizando wrappers React mínimos pros tests do theme-studio:
//   - TooltipProvider (radix-ui requirement em color-picker / contrast-checker etc.)
//   - ThemeFormProvider (opcional via withForm flag — usado em code-panel/control-panel/contrast-checker/preset-select)
//
// Pragmatismo: NÃO inclui NextIntlClientProvider/RouteProvider/ThemeProvider
// porque tests/setup.ts já mockou next-intl / next-themes / @/lib/route/RouteProvider
// pra retornar pass-through. Mantemos test surface mínima.

import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { TooltipProvider } from '@/components/ui/tooltip'

import { ThemeFormProvider } from '@/app/temas/_state/theme-form-provider'

type RenderWithProvidersOptions = RenderOptions & {
  /** Wrap em ThemeFormProvider (default false — só ative pra components que chamam useThemeFormContext). */
  withForm?: boolean
}

function Wrappers({ children, withForm }: { children: ReactNode; withForm: boolean }) {
  const inner = withForm ? (
    <ThemeFormProvider initialTheme={DEFAULT_THEME}>{children}</ThemeFormProvider>
  ) : (
    children
  )
  return <TooltipProvider>{inner}</TooltipProvider>
}

export function renderWithProviders(
  ui: ReactElement,
  options: RenderWithProvidersOptions = {},
): RenderResult {
  const { withForm = false, ...rest } = options
  return render(ui, {
    wrapper: ({ children }) => <Wrappers withForm={withForm}>{children}</Wrappers>,
    ...rest,
  })
}

export { DEFAULT_THEME }
