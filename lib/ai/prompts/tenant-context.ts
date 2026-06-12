// lib/ai/prompts/tenant-context.ts — TENANT CONTEXT segment do system prompt v2.
//
// Sprint 1.4 Bloco B (2026-05-27).
//
// Renderiza contexto per-tenant cacheable. Cache hit pattern: mesma string
// entre requests do mesmo tenant DURANTE A SESSÃO — invalida quando tenant
// atualiza `business_profile` (recompute no próximo turn). Anthropic ttl 1h
// amortiza prefix cache mesmo com mudança per-tenant em prefix segment.
//
// Branches:
//   - `business_profile.completed_at` PRESENTE → renderiza 5 chaves enum
//     com labels human-readable em PT-BR
//   - `business_profile.completed_at` NULL → sugere UMA VEZ completar setup
//     em `/configuracoes/perfil-negocio`, NÃO insistir (degrade gracefully)
//
// Vocab cravado (`.claude/rules/naming.md` + memory `feedback_onboarding_bio_extracted_done`):
// usar `professional` / `tenant` / `setup` / `lead-capture` — substitutos
// canônicos pra termos banidos (ver tabela completa em naming.md).
//
// @see docs/_deferred/chat-system-prompt-v2.md §Tenant context
// @see ADR-0062 §Etapa 3 — business_profile shape
// @see lib/contracts/onboarding/business-profile.ts — Zod SSOT

import type { Database } from '@/lib/contracts/database'
import type {
  BusinessDelivery,
  BusinessFormat,
  BusinessHasPages,
  BusinessModality,
  BusinessProgramStatus,
  VerticalChip,
} from '@/lib/contracts/onboarding/business-profile'

type TenantRow = Database['public']['Tables']['tenants']['Row']

/**
 * Shape parcial do business_profile como armazenado no JSONB (`tenants.business_profile`).
 * Local pra não acoplar prompt segment ao Zod schema — schema valida no insert,
 * aqui consumimos read-only com fallback gracioso pra chaves ausentes.
 */
interface BusinessProfileSnapshot {
  profession?: VerticalChip
  modality?: BusinessModality
  format?: BusinessFormat
  delivery?: BusinessDelivery
  program_status?: BusinessProgramStatus
  has_pages?: BusinessHasPages
  completed_at?: string | null
}

// Labels human-readable PT-BR — IA renderiza estes ao raciocinar sobre o tenant.
// Determinístico per build → cache hit cross-tenant.

const PROFESSION_LABEL: Record<VerticalChip, string> = {
  personal: 'personal (profissional de educação física)',
  nutritionist: 'nutricionista',
  coach: 'coach',
  other: 'outro tipo de profissional',
}

const MODALITY_LABEL: Record<BusinessModality, string> = {
  'in-person': 'presencial',
  online: 'online',
  hybrid: 'híbrido (presencial + online)',
}

const FORMAT_LABEL: Record<BusinessFormat, string> = {
  individual: 'atendimento individual (1 pra 1)',
  group: 'turmas em grupo',
  both: 'individual + grupo',
}

const DELIVERY_LABEL: Record<BusinessDelivery, string> = {
  live: 'ao vivo (síncrono)',
  recorded: 'gravado (assíncrono)',
  mixed: 'misto (ao vivo + gravado)',
}

const PROGRAM_STATUS_LABEL: Record<BusinessProgramStatus, string> = {
  structured: 'programa estruturado',
  'protocol-only': 'só protocolos, sem programa fechado',
  none: 'sem programa definido ainda',
}

const HAS_PAGES_LABEL: Record<BusinessHasPages, string> = {
  'yes-complete': 'tem páginas de vendas/captura prontas',
  some: 'tem algumas páginas, mas incompletas',
  'none-needed': 'não tem páginas (gostaria de criar)',
}

export interface BuildTenantContextPromptInput {
  readonly tenant: TenantRow
}

/**
 * Renderiza segmento TENANT CONTEXT do system prompt.
 *
 * Cache hit pattern: determinístico per-tenant. Mesma string até business_profile
 * atualizar. SEM `new Date()`/`Math.random()` — só leitura do snapshot.
 */
export function buildTenantContextPrompt(input: BuildTenantContextPromptInput): string {
  const { tenant } = input
  const profile = (tenant.business_profile ?? {}) as BusinessProfileSnapshot
  const professionLabel = profile.profession ? PROFESSION_LABEL[profile.profession] : 'profissional'

  const lines: string[] = [
    '═══ TENANT CONTEXT ═══',
    `Você está trabalhando para ${tenant.name}, ${professionLabel}.`,
  ]

  if (profile.completed_at) {
    lines.push('', 'Perfil de negócio preenchido:')
    if (profile.modality) {
      lines.push(`- Modalidade: ${MODALITY_LABEL[profile.modality]}`)
    }
    if (profile.format) {
      lines.push(`- Formato: ${FORMAT_LABEL[profile.format]}`)
    }
    if (profile.delivery) {
      lines.push(`- Entrega: ${DELIVERY_LABEL[profile.delivery]}`)
    }
    if (profile.program_status) {
      lines.push(`- Programas: ${PROGRAM_STATUS_LABEL[profile.program_status]}`)
    }
    if (profile.has_pages) {
      lines.push(`- Páginas: ${HAS_PAGES_LABEL[profile.has_pages]}`)
    }
    lines.push(
      '',
      'Use esse contexto pra ajustar tom, vocabulário e estrutura de conteúdo. Não pergunte novamente o que já está aqui.',
    )
  } else {
    lines.push(
      '',
      'Perfil de negócio ainda NÃO foi preenchido. Quando for útil pra adequar conteúdo, sugira UMA VEZ ao profissional completar setup em `/configuracoes/perfil-negocio` (leva ~60s). NÃO insista — se ele recusar ou ignorar, siga com suposições razoáveis baseadas no contexto da conversa.',
    )
  }

  return lines.join('\n')
}
