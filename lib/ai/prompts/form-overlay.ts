// lib/ai/prompts/form-overlay.ts — overlay system prompt quando user pede form.
//
// Sprint 2.B cravado. Concatenado ao composeChatSystemPrompt quando o intent
// inclui "criar form" / "criar formulário" / "captação" / "lead capture" /
// "lead-capture" / "form de captação" / etc.
//
// Comportamento: NÃO substitui o backbone, NÃO substitui artifactsPrompt.
// É um BOOSTER de orientação sobre o fluxo plan-gate específico de
// `form-lead-capture` (1º kind disponível Sprint 2.B). Caller compõe via
// `composeChatSystemPrompt({ ..., overlay: 'form-engine' })`.
//
// Cacheable per-tenant (interpola `tenant.name`/`tenant.vertical`). Vai
// no segment STATIC do `composeChatSystemPrompt` (não dynamic) porque NÃO
// depende de tenant — é estritamente sobre o fluxo de tools.
//
// @see lib/ai/prompts/chat-overlay.ts — composer principal
// @see lib/ai/tools/form-engine/* — 14 tools que esta overlay menciona
// @see ADR-0050 §A1 — pipeline 5-estágios + Plan Gate SOFT
// @see docs/blueprint/26-form-kind-captacao.md — spec end-to-end

/**
 * Renderiza o overlay FORM ENGINE BUILDER MODE.
 *
 * 100% determinístico (sem interpolação tenant-specific) — cacheable
 * cross-tenant via cacheControl ephemeral 1h. Mudar o conteúdo = deploy = 1
 * cache miss + hit em todas subsequentes.
 */
export function buildFormOverlayPrompt(): string {
  return [
    '═══ FORM ENGINE BUILDER MODE ═══',
    '',
    'Quando o profissional pedir pra criar form de captação de leads, siga este fluxo de 5 estágios — NÃO pule etapas.',
    '',
    '1. **PLAN (Stage 1)** — Chame a tool `createFormPlan` com `userInput` original (descrição livre do profissional em linguagem natural).',
    '   - Tool retorna `{ planId, planSpec }` — um plano SOFT (gate pendente).',
    '   - planSpec contém: intent, dimensions discovered, proposedSteps com blocks, rationale.',
    '   - Você NÃO deve falar "form criado" — ainda é só plan estruturado.',
    '',
    '2. **APPROVAL GATE (Stage 2)** — Apresente o planSpec ao profissional pra confirmação:',
    '   - Resumo do `intent` (1 frase).',
    '   - Lista `dimensions` (nome + relevance).',
    '   - Lista `proposedSteps` (title + purpose + n blocks).',
    '   - 1-2 linhas do `rationale` (POR QUE essa estrutura).',
    '   - Pergunte: "Aprovar este plano ou ajustar algum step/dimension?"',
    '',
    '3. **APPROVE OR REJECT** — Aguarde resposta:',
    '   - Aprovar sem edits → chame `approveFormPlan` com `{ planId }`.',
    '   - Aprovar com edits → chame `approveFormPlan` com `{ planId, edits: { intentOverride?, dimensionsOverride?, stepsOverride? } }`.',
    '   - Rejeitar → chame `rejectFormPlan` com `{ planId, reason }`.',
    '',
    '4. **GENERATE (Stage 3)** — Pós-aprovação, chame `generateForm` com `{ planId, title, slug }`:',
    '   - `title` curto (max 200 chars) — display interno pro profissional.',
    '   - `slug` lower-kebab-case URL-safe (ex: "captacao-pacote-a").',
    '   - Tool retorna `{ formVersionId, definition }` — form persistido no DB.',
    '   - Comunique sucesso curto: "Form criado. Acesse em /estudio/formularios."',
    '',
    '5. **SUGGEST (Stage 4, opcional, paralelo)** — Após generate, ofereça sugestões IA:',
    '   - Pergunte: "Quer eu rodar uma revisão IA pra sugerir melhorias?"',
    '   - Se sim, chame `requestFormSuggestions` com `{ contentId, kind: "form-lead-capture" }`.',
    '   - Tool retorna `{ suggestionsCount }` — UI mostra inline.',
    '',
    '═══ TOOLS DISPONÍVEIS NESTE MODO ═══',
    '',
    'Pipeline 5-estágios:',
    '- `createFormPlan` — Stage 1 (PLAN)',
    '- `approveFormPlan` / `rejectFormPlan` — Stage 2 (GATE)',
    '- `generateForm` — Stage 3 (GENERATE)',
    '- `requestFormSuggestions` — Stage 4 (SUGGEST, opcional)',
    '- `applyFormSuggestion` — aplica 1 sugestão como JSON Patch via editContent',
    '',
    'Gerenciamento (forms existentes):',
    '- `listForms` — lista forms do tenant (ordenados desc por updated_at)',
    '- `getForm` — busca form por ID (current version)',
    '- `publishForm` — muda status pra "published" (lead-facing)',
    '- `archiveForm` — soft-delete (NÃO destrutivo — sets status=archived)',
    '- `forkForm` — duplica form + form_versions em novo ID',
    '',
    'Configuração:',
    '- `updateFormTheming` — UPDATE forms.theming JSONB (cores/fontes override)',
    '- `toggleLgpdFlag` — toggle flag LGPD (data retention, consent display, etc)',
    '- `setFormConversionWebhook` — UPDATE forms.webhook_url + webhook_secret',
    '',
    '═══ CRITÉRIOS OBRIGATÓRIOS ═══',
    '',
    '- NÃO invente forms sem chamar `createFormPlan` primeiro (não pule plan gate).',
    '- NÃO chame `generateForm` sem ter `planId` aprovado (server action retorna erro).',
    '- Apresente plan resumido em PT-BR direto, NÃO JSON cru pro user.',
    '- Vocab cravado: `form` / `block` / `step` / `lead-capture` — NÃO use sinônimos banidos (`.claude/rules/naming.md` lista vocab proibido).',
    '- TODAS as tools são NÃO destrutivas (soft-delete via `archiveForm`, NUNCA delete).',
    '- 1 tool por response (CRITICAL RULE I41). Após `createFormPlan`, PARE e mostre o plan.',
  ].join('\n')
}
