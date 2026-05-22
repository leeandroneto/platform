// RESEARCH: tweakcn (Apache-2.0) — adapted from components/editor/code-panel-dialog.tsx
// See NOTICE.md.
//
// Adapts:
//   - ResponsiveDialog (revola) → Dialog shadcn canonical (revola não existe nesta stack)
//   - ThemeEditorState prop eliminada — CodePanel consome useThemeFormContext() diretamente
//   - i18n → namespace theme-studio.codePanel (title, description)

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-code-panel-dialog",
 *   "category": "primitive",
 *   "version": "1.0.0",
 *   "description": "Wrapper Dialog para o CodePanel do theme studio — abre em modal responsivo",
 *   "examples": ["admin/theme-studio"],
 *   "when_to_use": ["abrir code-panel em overlay modal a partir de botão na action bar"],
 *   "anti_patterns": ["uso fora do ThemeFormProvider"],
 *   "related": ["theme-studio-code-panel"],
 *   "vertical": null
 * }
 */

'use client'

import { useTranslations } from 'next-intl'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import CodePanel from './code-panel'

interface CodePanelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Opcional — quando passado, habilita registry command real no CodePanel */
  themeId?: string
}

export function CodePanelDialog({ open, onOpenChange, themeId }: CodePanelDialogProps) {
  const t = useTranslations('theme-studio.codePanel')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90dvh] max-h-[90dvh] overflow-hidden shadow-lg sm:h-[80dvh] sm:max-h-[min(700px,90dvh)] sm:w-[calc(100%-2rem)] sm:max-w-4xl">
        <div className="h-full space-y-6 overflow-auto px-6 pb-6 sm:py-6">
          <DialogHeader className="sr-only">
            <DialogTitle>{t('title')}</DialogTitle>
            <DialogDescription>{t('dialogDescription')}</DialogDescription>
          </DialogHeader>
          <CodePanel themeId={themeId} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
