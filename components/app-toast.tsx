// RESEARCH: shadcn/ui sonner + next-intl t() — hook semantic com i18n key obrigatorio (ADR-0040 §E).
// Valor agregado: forca i18n no callsite (so passa key), centraliza traducao,
// type-safe values. Substitui chamadas espalhadas `toast.success(t('...'))`.

'use client'

import { useTranslations } from 'next-intl'

import { toast } from 'sonner'

type ToastValues = Record<string, string | number | Date>

interface AppToastApi {
  success: (i18nKey: string, values?: ToastValues) => void
  error: (i18nKey: string, values?: ToastValues) => void
  info: (i18nKey: string, values?: ToastValues) => void
  warning: (i18nKey: string, values?: ToastValues) => void
}

export function useAppToast(): AppToastApi {
  const t = useTranslations()
  return {
    success: (key, values) => {
      toast.success(t(key, values))
    },
    error: (key, values) => {
      toast.error(t(key, values))
    },
    info: (key, values) => {
      toast.info(t(key, values))
    },
    warning: (key, values) => {
      toast.warning(t(key, values))
    },
  }
}
