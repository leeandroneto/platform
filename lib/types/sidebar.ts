// Tipos compartilhados pela sidebar painel (oficial sidebar-07 customizado).
// Antes em `components/sidebar/types.ts` (deletado quando descartamos atomics from-scratch).
// Movido pra `lib/types/` pra desacoplar dos componentes que usam.

import type { LucideIcon } from 'lucide-react'

/** Item de navegação (nav-main + sub-itens collapsible) */
export interface NavItem {
  readonly title: string
  readonly url: string
  readonly icon?: LucideIcon
  readonly isActive?: boolean
  readonly items?: ReadonlyArray<{ readonly title: string; readonly url: string }>
}

/** Chat recente (lista date-grouped) */
export interface Recent {
  readonly id: string
  readonly title: string
  readonly url: string
  /** ISO 8601 timestamp da última atividade do chat (criação OR mensagem recente) */
  readonly createdAt: string
}

/** Perfil do user mostrado no nav-user footer */
export interface UserProfile {
  readonly name: string
  readonly email: string
  readonly avatar?: string
}

/** Info derivada do trial (tenants.plan_status + trial_expires_at) */
export interface TrialInfo {
  readonly daysRemaining: number
  readonly status: 'trialing' | 'expired' | 'canceled'
}
