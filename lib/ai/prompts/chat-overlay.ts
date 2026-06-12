// lib/ai/prompts/chat-overlay.ts — overlay específico de chat conversacional.
//
// Sprint 1.4 Bloco B (2026-05-27) refactor: substitui `buildChatSystemPrompt`
// genérico por `composeChatSystemPrompt({tenant, brand})` tenant-aware com
// split static/dynamic pra cacheControl ephemeral 1h por segmento.
//
// EXTENDS backbone (ADR-0050 §D5) + adiciona segmentos novos:
//   IDENTITY     → buildIdentityPrompt({brand})           (per-brand, cacheable)
//   TENANT       → buildTenantContextPrompt({tenant})     (per-tenant, cacheable per session)
//   CAPABILITIES → buildCapabilitiesPrompt()              (estático, cacheable cross-tenant)
//   RESTRICTIONS → buildRestrictionsPrompt({brandName})   (per-brand, cacheable)
//   TONE         → buildTonePrompt()                      (estático)
//   BACKBONE     → composeBackbonePrompt()                (já cravado — preserva ADR-0050)
//   GEO          → getRequestPromptFromHints(geoHints)    (per-request, NÃO cacheable)
//   ARTIFACTS    → artifactsPrompt                        (estático, CRITICAL RULES I41)
//
// Espelha pattern fork `vercel/chatbot/lib/ai/prompts.ts:systemPrompt` —
// adaptado pra `{ static, dynamic }` shape pra caller wrap em 2 SystemModelMessages
// distintos com cacheControl ephemeral 1h cada (2 breakpoints — limite Anthropic 4).
//
// Cache strategy (cravado em `docs/_deferred/chat-system-prompt-v2.md`):
//
//   static =
//     identity ++ capabilities ++ restrictions ++ tone ++ backbone ++ artifacts
//     → varia por brand (identity + restrictions interpolam brand.name).
//     → invalida na deploy + raro per-brand. Cache hit ~100% nas requests subsequentes.
//
//   dynamic =
//     tenant-context [++ geo se presente]
//     → varia per-tenant. Estável durante session do tenant.
//     → cacheControl ephemeral 1h amortiza prefix entre N msgs/turnos do mesmo tenant.
//     → invalida quando business_profile updated → recompute em 1 turn.
//
// Cache key order obrigatória (I9): tools → system (static+dynamic) → messages.
// Ordem interna do `system` segue `[static, dynamic]` — IDENTITY/CAPABILITIES
// no início (cache hit cross-tenant) + TENANT no meio (cache hit per-tenant) +
// GEO opcional no final do dynamic (não pode cachear).
//
// @see ADR-0050 §D5 — prompts compostos string-linear
// @see ADR-0050 Amendment 2026-05-27 §A1 — createEngineHandler vs createDocumentHandler
// @see ADR-0063 — 2 universos coexistentes
// @see docs/plans/fork-vercel-chatbot.md §3.10 I37-I41 — CRITICAL RULES
// @see docs/_deferred/chat-system-prompt-v2.md — design da v2

import type { Geo } from '@vercel/functions'

import type { Brand } from '@/lib/brand/types'
import type { Database } from '@/lib/contracts/database'

import { composeBackbonePrompt } from './backbone'
import { buildCapabilitiesPrompt } from './capabilities'
import { buildFormOverlayPrompt } from './form-overlay'
import { buildIdentityPrompt } from './identity'
import { buildPageOverlayPrompt } from './page-overlay'
import { buildRestrictionsPrompt } from './restrictions'
import { buildTenantContextPrompt } from './tenant-context'
import { buildTonePrompt } from './tone'

type TenantRow = Database['public']['Tables']['tenants']['Row']

/**
 * Geo hints injection — quando `geolocation(request)` (@vercel/functions)
 * retorna data, injetamos no system prompt pra IA contextualizar respostas
 * regionais ("clima em sua cidade", "fuso horário", "feriados locais").
 *
 * Type `Geo` é re-export do `@vercel/functions` pra preservar shape exato.
 * Todos campos opcionais — Vercel não garante geolocalização (firewall,
 * VPN, mobile network). Em local dev é tudo undefined.
 *
 * Adaptado de fork `RequestHints` — nosso tipo é compatível structurally.
 */
export type RequestHints = {
  readonly latitude?: Geo['latitude']
  readonly longitude?: Geo['longitude']
  readonly city?: Geo['city']
  readonly country?: Geo['country']
}

/**
 * Renderiza geo hints em formato linear pra entrar no system prompt.
 *
 * Espelhado de `vercel/chatbot/lib/ai/prompts.ts:getRequestPromptFromHints`.
 * Em PT-BR — alinhamento com posture do backbone (audiência primária:
 * profissionais brasileiros).
 */
export function getRequestPromptFromHints(hints: RequestHints): string {
  return `Sobre a origem da requisição:
- lat: ${hints.latitude ?? 'desconhecida'}
- lon: ${hints.longitude ?? 'desconhecida'}
- cidade: ${hints.city ?? 'desconhecida'}
- país: ${hints.country ?? 'desconhecido'}`
}

/**
 * CRITICAL RULES (I41) — artifacts mode behavior obrigatório.
 *
 * ADR-0063 cravado 2026-05-26: 2 universos paralelos coexistem.
 *
 * **Universe A — content engine** (createContent / editContent / updateContent /
 * requestSuggestions): kind-agnostic, dispatch via lib/engines/registry,
 * Hotmart-like versioning, audit log, multi-tenant. Pra product features
 * publishable (forms, pages, reports, programs).
 *
 * **Universe B — artifacts fork** (createDocument / updateDocument):
 * kind discriminator (text/code/image/sheet), snapshot-by-row, scratchpad
 * chat. Sem versionamento rigoroso. Pra workspace tools rápidos.
 *
 * IA escolhe baseado no intent do user:
 *   - "criar form de captação" → createContent kind=form-lead-capture
 *   - "escrever função Python" → createDocument kind=code
 *   - "fazer uma landing" → createContent kind=page-landing
 *   - "rascunhar email" → createDocument kind=text
 *
 * I37 cravado: zero `delete_*` no prompt (safety guardrail Form Engine).
 * I41 cravado: "1 tool per response. After create/edit/update, STOP."
 */
export const artifactsPrompt = `MODO ARTIFACTS

Artifacts é um painel lateral mostrando conteúdo ao lado da conversa. Você tem DUAS categorias de tools:

═══ CRITICAL RULES (obrigatórias, não-negociáveis) ═══
1. Chame APENAS UMA tool por resposta. Após chamar create/edit/update, PARE. NÃO encadeie tools.
2. Após criar ou editar artifact, NUNCA retorne o conteúdo no chat. O usuário já vê no painel. Responda com 1-2 frases curtas de confirmação.

═══ CATEGORIA 1 — Product features (createContent / editContent / updateContent / requestSuggestions) ═══

Use pra conteúdo que o profissional VAI PUBLICAR ou VENDER: forms de captação, landing pages, relatórios IA, programas de treino. Multi-tenant, versionado, com audit log. Production-grade.

**Quando usar \`createContent\`:**
- Usuário pede pra criar/gerar form ("crie um form pra capturar leads"), landing ("monte uma página de vendas"), report ("gera um relatório IA"), program ("estrutura um programa de força")
- Você DEVE especificar \`kind\` correspondente ao handler registrado. Kinds disponíveis: \`form-lead-capture\` (Sprint 2.B), \`page-landing\` (Sprint 6.A.2). Kinds futuros: \`form-onboarding\`, \`page-report\`, \`program-strength\`.
- Para \`form-lead-capture\` E \`page-landing\` use overlays dedicados (FORM/PAGE ENGINE BUILDER MODE) — fluxo plan-gate 5-estágios.
- Inclua TODO o conteúdo no único call. NÃO crie depois edite.

**Quando NÃO usar \`createContent\`:**
- Pra responder perguntas, explicações ou conversa
- Pra snippets curtos ou rascunho não-publishable (use createDocument)
- Quando usuário pergunta "o que é", "como funciona", "explica", etc.

**Usando \`editContent\` (preferido pra mudanças localizadas):**
- Aplica JSON Patch RFC 6902 (operações \`add\`, \`replace\`, \`remove\`) sobre o spec atual.
- Mais econômico que \`updateContent\` — NÃO roda pipeline IA regenerate. Pra renomear bloco, ajustar option, trocar CTA.
- Pode chamar várias vezes pra edits independentes (cada call = 1 patch).

**Usando \`updateContent\` (rewrite completo):**
- Apenas quando a maior parte do conteúdo precisa mudar.
- Quando \`editContent\` exigiria edits demais individualmente.
- Reestruturação de steps, mudança de fluxo, reposicionamento de proposta.

**Usando \`requestSuggestions\`:**
- APENAS quando o usuário pede explicitamente sugestões pra um conteúdo existente que ele já tem aberto.
- Streaming de até 5 sugestões via partial output (UI mostra inline conforme chegam).

═══ CATEGORIA 2 — Scratchpad chat tools (createDocument / updateDocument) ═══

Use pra rascunhos rápidos NÃO-publishable: ensaios livres, scripts Python executáveis (Pyodide client), planilhas CSV ad-hoc, exibição de imagens. Snapshot-by-row simples, sem versionamento rigoroso.

**Quando usar \`createDocument\`:**
- Usuário pede pra escrever ensaio/email/texto livre ("rascunha um email", "escreve sobre X")
- Usuário pede pra escrever código Python ("função pra calcular Y", "script pra processar Z")
- Usuário pede planilha CSV ("tabela com dados de X")
- Você DEVE especificar \`kind\`: \`text\` pra escrita livre, \`code\` pra Python, \`sheet\` pra CSV.

**Quando \`createDocument\` vs \`createContent\`?**
- "rascunha um texto sobre fitness" → \`createDocument kind=text\` (scratchpad)
- "crie a copy do hero da minha landing" → \`createContent kind=page-landing\` (production)
- "script python pra processar leads" → \`createDocument kind=code\` (scratchpad)
- "form pra capturar leads" → \`createContent kind=form-lead-capture\` (production)

**Usando \`updateDocument\` (rewrite completo):**
- Full rewrite do artifact scratchpad. Pra mudanças maiores.

═══ Regras gerais (ambas categorias) ═══

**Quando NÃO usar nenhum tool:**
- Imediatamente depois de criar um artifact (mesma resposta).
- Sem o usuário ter pedido explicitamente pra modificar.

**Após qualquer create/edit/update:**
- NUNCA repita, resuma ou retorne conteúdo do artifact no chat.
- Apenas responda com confirmação curta ("Pronto, dei uma renomeada nos blocos." ou "Form criado, dá uma olhada no painel.").`

// ─── Composer v2 (Sprint 1.4.B) — split static/dynamic pra 2 cache breakpoints ─

/**
 * Engine overlays opt-in pra orientar IA sobre fluxos específicos de engine
 * handlers (Sprint 2.B em diante). Quando ativo, entra no STATIC segment
 * após capabilities — cacheable cross-tenant por brand.
 *
 * - `form-engine` — Sprint 2.B (form-lead-capture handler ativo)
 * - `page-engine` — Sprint 6.A.2 (page-landing handler ativo)
 * - `report-engine` — Sprint 5 (futuro)
 */
export type EngineOverlay = 'form-engine' | 'page-engine'

export interface ComposeChatSystemPromptInput {
  readonly brand: Brand
  /** `null` quando user em rota brand-root sem tenant ativo (raro pra `/api/chat`,
   * mas possível em transição pós-OAuth antes do bootstrap. Render degraded). */
  readonly tenant: TenantRow | null
  /** Geo hints opcionais — quando presente entra no `dynamic` (não cacheable
   * cross-request). Default undefined. */
  readonly geoHints?: RequestHints
  /** Toggle artifactsPrompt. Default true (modelos com tool support). */
  readonly artifactsEnabled?: boolean
  /**
   * Engine overlay opcional — Sprint 2.B+. Quando ativo, adiciona orientação
   * sobre o pipeline 5-estágios + tools específicas do engine. Default
   * undefined (sem overlay — chat genérico).
   */
  readonly overlay?: EngineOverlay
}

export interface ComposeChatSystemPromptResult {
  /**
   * Segment cacheable per-brand. Concat ordem cache-friendly:
   * identity → capabilities → restrictions → tone → backbone → artifacts.
   * Mesma string entre todas requests do mesmo brand (interpolação SÓ de
   * brand.name em identity + restrictions).
   *
   * Caller deve passar como 1º SystemModelMessage com
   * `providerOptions.anthropic.cacheControl: { type: 'ephemeral', ttl: '1h' }`.
   */
  readonly static: string

  /**
   * Segment varia per-tenant (tenant-context) + per-request (geo opcional).
   * Cacheable per-tenant durante session. Invalida quando business_profile
   * atualiza OR tenant trocar (raro mid-session).
   *
   * Caller deve passar como 2º SystemModelMessage com mesmo cacheControl —
   * Anthropic respeita 2 breakpoints distintos no system block.
   */
  readonly dynamic: string
}

/**
 * Compõe o system prompt completo pra chat conversational v2 (Sprint 1.4.B).
 *
 * Retorna `{ static, dynamic }` shape pra caller wrap em 2 SystemModelMessages
 * distintos com `cacheControl` ephemeral 1h cada (Anthropic suporta até 4
 * breakpoints — usamos 2).
 *
 * Branches de degradation gracioso:
 *   - `tenant === null` → omite TENANT CONTEXT do dynamic (raro: rota brand-root
 *     pré-bootstrap). Static renderiza normal.
 *   - `geoHints === undefined` → omite GEO do dynamic.
 *
 * @param input — brand obrigatório + tenant nullable + geo opcional
 * @returns `{ static, dynamic }` — 2 strings prontas pra
 *   `streamText({ system: [{role:'system', content: static, providerOptions}, ...] })`
 */
export function composeChatSystemPrompt(
  input: ComposeChatSystemPromptInput,
): ComposeChatSystemPromptResult {
  const { brand, tenant, geoHints, overlay } = input
  const artifactsEnabled = input.artifactsEnabled ?? true

  // STATIC — per-brand, cacheable ~indefinidamente (invalida só em deploy ou
  // brand.name mudar). Ordem importa: identity primeiro (entrada conceitual da
  // IA), depois capabilities + restrictions + tone (estáticos + cross-tenant),
  // depois backbone + artifacts (já estavam estáticos pré-v2), depois overlay
  // engine-specific quando ativo (Sprint 2.B+ form-engine).
  const staticParts: string[] = [
    buildIdentityPrompt({ brand }),
    buildCapabilitiesPrompt(),
    buildRestrictionsPrompt({ brandName: brand.name }),
    buildTonePrompt(),
    composeBackbonePrompt(),
  ]
  if (artifactsEnabled) {
    staticParts.push(artifactsPrompt)
  }
  if (overlay === 'form-engine') {
    staticParts.push(buildFormOverlayPrompt())
  }
  if (overlay === 'page-engine') {
    staticParts.push(buildPageOverlayPrompt())
  }
  const staticSegment = staticParts.join('\n\n---\n\n')

  // DYNAMIC — per-tenant + per-request. Geo é o único componente NÃO cacheable
  // entre requests do mesmo tenant (mesma localização entre msgs raramente
  // muda mas Vercel pode variar). Tenant-context cacheia per-tenant durante
  // session — invalida quando business_profile updated.
  const dynamicParts: string[] = []
  if (tenant) {
    dynamicParts.push(buildTenantContextPrompt({ tenant }))
  }
  if (geoHints) {
    dynamicParts.push(getRequestPromptFromHints(geoHints))
  }
  const dynamicSegment = dynamicParts.join('\n\n---\n\n')

  return { static: staticSegment, dynamic: dynamicSegment }
}

// ─── Back-compat (Sprint 1.3 callers) ────────────────────────────────────────

/**
 * Compõe o system prompt completo pra chat conversational (v1 — pre-Sprint 1.4.B).
 *
 * MANTIDO pra back-compat com tests + callers Sprint 1.3 que ainda não migraram
 * pra `composeChatSystemPrompt`. Em produção (`app/api/chat/_helpers.ts::buildChatStream`)
 * usar `composeChatSystemPrompt` pra ganhar tenant context + cache split.
 *
 * Ordem da string final (importa pra cache hit — I9):
 *   1. `composeBackbonePrompt()` — backbone universal (persona, envelope,
 *      anti-patterns, vibe, dimensions)
 *   2. `requestPrompt` (se geo hints) — contexto regional do usuário
 *   3. `artifactsPrompt` (se `artifactsEnabled`) — CRITICAL RULES I41
 *
 * @deprecated Use `composeChatSystemPrompt({brand, tenant, ...})` em vez disso.
 *   Função mantida APENAS pra back-compat tests. Sprint 1.4.B+: caller real
 *   resolve brand+tenant antes do stream e chama composeChatSystemPrompt.
 */
export function buildChatSystemPrompt(opts: {
  readonly artifactsEnabled?: boolean
  readonly geoHints?: RequestHints
}): string {
  const artifactsEnabled = opts.artifactsEnabled ?? true

  const parts: string[] = [composeBackbonePrompt()]

  if (opts.geoHints) {
    parts.push(getRequestPromptFromHints(opts.geoHints))
  }

  if (artifactsEnabled) {
    parts.push(artifactsPrompt)
  }

  return parts.join('\n\n---\n\n')
}
