// app/temas/layout.tsx — Shell tenant-facing pra rota /temas (theme studio).
//
// Decisão 2026-05-22: theme-studio é feature TENANT-FACING (profissional
// customiza tema do app dele), não admin SaaS interno. Por isso vive em
// /temas (URL PT-BR via convenção rules/naming.md) e providers ficam
// scoped neste layout — global em app/layout.tsx pagaria bundle em rotas
// que não usam (mobile/landing/auth).
//
// Providers scoped (audit components/admin/theme-studio/*.tsx):
//
// - TooltipProvider (radix-ui)
//   Consumido por: contrast-checker.tsx, colors-tab-content.tsx,
//   hsl-preset-button.tsx, color-selector-popover.tsx, font-picker.tsx,
//   preset-select.tsx, theme-preview/color-preview.tsx. Sem o provider
//   ancestral, <Tooltip> radix lança "must be used within Provider".
//
// - NuqsAdapter (nuqs/adapters/next/app)
//   Consumido por: preview-panel.tsx (useQueryState pra activeTab URL state),
//   font-picker.tsx (useQueryState ?). NuqsAdapter habilita useQueryState
//   no Next App Router.
//
// FormProvider (react-hook-form) NÃO entra aqui — é montado dentro do
// ThemeFormProvider (app/temas/_state/theme-form-provider.tsx), via api.form
// retornado por useThemeForm(). Scope correto: subárvore que precisa do form,
// não layout inteiro.

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'

import { TooltipProvider } from '@/components/ui/tooltip'

export default function TemasLayout({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </TooltipProvider>
  )
}
