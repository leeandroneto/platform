// lib/domain/roles.ts — 5 roles canonicas (autoridade: .claude/rules/jwt-claims.md).
//
// Decisao: NUNCA usar 'student' / 'trainer' / 'super-admin' (vocab banido +
// alinhamento JWT claims). `platform_admin` e `service_account` sao os corretos.

import { z } from 'zod'

export const ROLES = [
  'platform_admin', // fundador
  'professional', // dono do tenant
  'client', // aluno do profissional
  'influencer', // afiliado
  'service_account', // webhooks / Edge Functions / system
] as const

export const RoleSchema = z.enum(ROLES)
export type Role = z.infer<typeof RoleSchema>

export function isRole(value: unknown): value is Role {
  return typeof value === 'string' && (ROLES as readonly string[]).includes(value)
}

/** Subset roles que sao humanos (exclui service_account). */
export const HUMAN_ROLES = ['platform_admin', 'professional', 'client', 'influencer'] as const
export type HumanRole = (typeof HUMAN_ROLES)[number]

export function isHumanRole(role: Role): role is HumanRole {
  return role !== 'service_account'
}
