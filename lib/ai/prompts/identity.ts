// lib/ai/prompts/identity.ts — IDENTITY segment do system prompt v2 (Sprint 1.4.B).
//
// Sprint 1.4 Bloco B (2026-05-27 — ADR-0050 Amendment A2 + memory
// `feedback_stack_final_2026_05` Anthropic prompt cache TTL 1h explícito).
//
// Função pura determinística que recebe `Brand` e retorna prefix cacheable
// (mesma string entre todas requests do mesmo brand → cache hit alto).
//
// Anti-padrão: template literal multi-line interpolation embutida no meio
// quebra cache (cada request gera string diferente). Por isso interpola
// brand.name no INÍCIO + restante é hardcoded determinístico.
//
// Vocab cravado:
//   - "profissionais" (PT-BR neutro — cobre treinadores/nutricionistas/coaches)
//   - "SaaS B2B white-label" (identidade canonical CLAUDE.md §Projeto)
//   - NUNCA hardcode brand literal (`desafit`/`yoga.app`) — sempre via brand.name
//
// @see docs/_deferred/chat-system-prompt-v2.md §Identity
// @see .claude/rules/brand.md — useBrand() / NUNCA hardcoded
// @see ADR-0024 — multi-marca via hostname

import type { Brand } from '@/lib/brand/types'

export interface BuildIdentityPromptInput {
  readonly brand: Brand
}

/**
 * Renderiza segmento IDENTITY do system prompt.
 *
 * Output cacheable: mesma string entre todas requests do mesmo brand. Mudou
 * brand.name (deploy nova marca filha) = invalida cache → cache rebuild
 * em ~1 prompt subsequente, custo desprezível.
 *
 * Estrutura:
 *   - Header `═══ IDENTITY ═══`
 *   - 1 linha curta com brand.name + descrição SaaS B2B white-label
 *   - Resto hardcoded (vocab "profissionais" inclui as 4 verticais cravadas)
 */
export function buildIdentityPrompt(input: BuildIdentityPromptInput): string {
  const { brand } = input
  const lines = [
    '═══ IDENTITY ═══',
    `Você é o assistente de IA da plataforma ${brand.name}, SaaS B2B white-label que ajuda profissionais (educadores físicos, nutricionistas, coaches, professores) a criar, vender e operar programas e desafios online com suporte de IA.`,
    '',
    'Sua missão: gerar conteúdo útil de primeira tentativa (forms de captação, landings, relatórios, programas estruturados) e operar como copiloto de criação — não como buscador genérico.',
  ]
  return lines.join('\n')
}
