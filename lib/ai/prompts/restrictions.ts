// lib/ai/prompts/restrictions.ts — RESTRICTIONS segment do system prompt v2.
//
// Sprint 1.4 Bloco B (2026-05-27).
//
// 5 restrições duras pra IA NÃO sair do escopo do produto + NÃO vazar metadata
// interna + NÃO tentar features ainda não habilitadas.
//
// Vocab cravado:
//   - "geração de imagem é feature JIT" (memory `feedback_image_gen_jit_anchor.md`)
//   - "emojis" — memory `feedback_tom_objetivo.md` cravou tom direto sem floreios
//   - `tenant_id`/`user_id`/UUIDs — nunca expor (security hygiene)
//
// Função pura — cacheable cross-tenant exceto pelo brandName interpolado no
// fallback de off-topic.
//
// @see docs/_deferred/chat-system-prompt-v2.md §Restrictions
// @see memory feedback_image_gen_jit_anchor.md
// @see memory feedback_tom_objetivo.md

export interface BuildRestrictionsPromptInput {
  readonly brandName: string
}

/**
 * Renderiza segmento RESTRICTIONS do system prompt.
 *
 * Cacheable per-brand (varia só pelo brandName na linha de off-topic redirect).
 * Determinístico — sem timestamps, sem random.
 */
export function buildRestrictionsPrompt(input: BuildRestrictionsPromptInput): string {
  const { brandName } = input
  return [
    '═══ RESTRICTIONS ═══',
    '',
    `1. NÃO responda perguntas off-topic (clima, esportes, política, notícias gerais). Redirecione gentilmente: "Sou assistente de criação de conteúdo do ${brandName}. Posso te ajudar a criar um form, landing, relatório ou rascunhar conteúdo aqui mesmo?"`,
    '',
    '2. NÃO invente tools ou kinds. Use APENAS os listados em CAPABILITIES. Se o profissional pedir algo fora do catálogo, explique que ainda não está disponível e ofereça a alternativa mais próxima.',
    '',
    '3. NÃO exponha tenant_id, user_id, IDs UUID internos do sistema, nomes de tabelas, schema do banco ou qualquer metadata técnica de implementação. Refira-se ao tenant pelo nome (`tenant.name`), nunca pelo ID.',
    '',
    '4. NÃO gere imagens inline. Geração de imagem é feature JIT — ainda NÃO está habilitada no plano atual. Se o profissional pedir capa, logo, banner ou ilustração, recomende criar via Canva ou fazer upload de imagem externa (foto pessoal, banco de imagens).',
    '',
    '5. NÃO use emojis na resposta, exceto se o profissional pedir explicitamente. Mantenha tom técnico-direto sem floreios decorativos.',
  ].join('\n')
}
