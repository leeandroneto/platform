// RESEARCH: extract pattern — sidebar usa 4 useMemo labels (recents/user/cmd/projects).
// Hook puro pra reduzir LOC do TenantSidebar (composition wire fica mais limpa).
// Sprint Bloco B 2026-05-27.

'use client'

import { useMemo } from 'react'
import { useTranslations } from 'next-intl'

export interface SidebarLabels {
  readonly recents: {
    readonly today: string
    readonly yesterday: string
    readonly last7Days: string
    readonly last30Days: string
    readonly older: string
    readonly empty: string
    readonly delete: string
    readonly deleteError: string
  }
  readonly user: {
    readonly perfil: string
    readonly tema: string
    readonly temaLight: string
    readonly temaDark: string
    readonly temaSystem: string
    readonly sair: string
    readonly trialBadge: (days: number) => string
    readonly trialExpired: string
    readonly trialLastDay: string
  }
  readonly cmd: {
    readonly title: string
    readonly description: string
    readonly placeholder: string
    readonly empty: string
    readonly groupRecents: string
    readonly groupActions: string
    readonly groupNav: string
    readonly actionNovoChat: string
    readonly actionCriarForm: string
    readonly actionCriarPage: string
    readonly navInicio: string
    readonly navConversas: string
    readonly navEstudio: string
    readonly navConfiguracoes: string
  }
  readonly projects: {
    readonly sectionTitle: string
    readonly createTooltip: string
    readonly empty: string
  }
}

export function useSidebarLabels(): SidebarLabels {
  const t = useTranslations('painel')

  return useMemo(
    () => ({
      recents: {
        today: t('recents.today'),
        yesterday: t('recents.yesterday'),
        last7Days: t('recents.last7Days'),
        last30Days: t('recents.last30Days'),
        older: t('recents.older'),
        empty: t('recents.empty'),
        delete: t('recents.delete'),
        deleteError: t('recents.deleteError'),
      },
      user: {
        perfil: t('user.perfil'),
        tema: t('user.tema'),
        temaLight: t('user.temaLight'),
        temaDark: t('user.temaDark'),
        temaSystem: t('user.temaSystem'),
        sair: t('user.sair'),
        trialBadge: (days: number) => t('user.trialDaysRemaining', { days }),
        trialExpired: t('user.trialExpired'),
        trialLastDay: t('user.trialLastDay'),
      },
      cmd: {
        title: t('cmd.title'),
        description: t('cmd.description'),
        placeholder: t('cmd.placeholder'),
        empty: t('cmd.empty'),
        groupRecents: t('cmd.groupRecents'),
        groupActions: t('cmd.groupActions'),
        groupNav: t('cmd.groupNav'),
        actionNovoChat: t('cmd.actionNovoChat'),
        actionCriarForm: t('cmd.actionCriarForm'),
        actionCriarPage: t('cmd.actionCriarPage'),
        navInicio: t('nav.inicio'),
        navConversas: t('nav.conversas'),
        navEstudio: t('nav.estudio'),
        navConfiguracoes: t('nav.configuracoes'),
      },
      projects: {
        sectionTitle: t('projects.sectionTitle'),
        createTooltip: t('projects.createTooltip'),
        empty: t('projects.empty'),
      },
    }),
    [t],
  )
}
