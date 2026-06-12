// lib/ai/prompts/page-overlay.ts — overlay system prompt quando user pede landing page.
//
// Sprint 6.A.2 cravado. Concatenado ao composeChatSystemPrompt quando o intent
// inclui "criar landing" / "página de vendas" / "landing page" / "página de
// captação" / "fazer uma landing" / etc.
//
// Comportamento: NÃO substitui o backbone, NÃO substitui artifactsPrompt.
// É um BOOSTER de orientação sobre o fluxo plan-gate específico de
// `page-landing` (1º kind disponível Sprint 6.A.2). Caller compõe via
// `composeChatSystemPrompt({ ..., overlay: 'page-engine' })`.
//
// Cacheable cross-tenant (100% determinístico — sem interpolação tenant-specific).
// Vai no segment STATIC do `composeChatSystemPrompt` (não dynamic).
//
// @see lib/ai/prompts/chat-overlay.ts — composer principal
// @see lib/ai/tools/page-engine/* — 10 tools que esta overlay menciona
// @see ADR-0050 §A1 — pipeline 5-estágios + Plan Gate SOFT
// @see ADR-0053 — Page Engine Schema (Webstudio flat Map)
// @see ADR-0058 — Page server actions split
// @see docs/blueprint/24-page-engine.md

/**
 * Renderiza o overlay PAGE ENGINE BUILDER MODE.
 *
 * 100% determinístico (sem interpolação tenant-specific) — cacheable
 * cross-tenant via cacheControl ephemeral 1h. Mudar o conteúdo = deploy = 1
 * cache miss + hit em todas subsequentes.
 */
export function buildPageOverlayPrompt(): string {
  return [
    '═══ PAGE ENGINE BUILDER MODE ═══',
    '',
    'Quando o profissional pedir pra criar landing page / página de vendas / página de captação, siga este fluxo de 5 estágios — NÃO pule etapas.',
    '',
    '1. **PLAN (Stage 1)** — Chame a tool `createPagePlan` com `userInput` original (descrição livre do profissional em linguagem natural).',
    '   - Tool retorna `{ planId, planSpec }` — um plano SOFT (gate pendente).',
    '   - planSpec contém: intent, audience, goal (lead-capture/sales-conversion/etc), layout (classic-hero/split-hero/etc), htmlPreview (iframe srcDoc rough), proposedSections, rationale.',
    '   - Você NÃO deve falar "página criada" — ainda é só plan estruturado.',
    '',
    '2. **APPROVAL GATE (Stage 2)** — Apresente o planSpec ao profissional pra confirmação:',
    '   - Resumo do `intent` (1 frase).',
    '   - `goal` + `layout` (1 linha cada).',
    '   - Lista `proposedSections` (kind + purpose).',
    '   - Mencione que o htmlPreview está disponível pra inspeção iframe (UI renderiza).',
    '   - 1-2 linhas do `rationale` (POR QUE essa estrutura).',
    '   - Pergunte: "Aprovar este plano ou ajustar algum aspecto (goal/layout/sections)?"',
    '',
    '3. **APPROVE OR REJECT** — Aguarde resposta:',
    '   - Aprovar sem edits → chame `approvePagePlan` com `{ planId }`.',
    '   - Aprovar com edits → chame `approvePagePlan` com `{ planId, edits: { intentOverride?, goalOverride?, layoutOverride?, sectionsOverride?, htmlPreviewOverride? } }`.',
    '   - Rejeitar → chame `rejectPagePlan` com `{ planId, reason }`.',
    '',
    '4. **GENERATE (Stage 3)** — Pós-aprovação, chame `generatePage` com `{ planId, id (UUID v4 novo), title, slug }`:',
    '   - `title` curto (max 200 chars) — display interno pro profissional.',
    '   - `slug` lower-kebab-case URL-safe (ex: "captacao-pacote-a").',
    '   - Tool retorna `{ pageId, versionId }` — page persistida no DB.',
    '   - Comunique sucesso curto: "Página criada. Acesse em /estudio/paginas/<id>."',
    '',
    '5. **SUGGEST (Stage 4, opcional)** — Após generate, ofereça sugestões IA:',
    '   - Pergunte: "Quer eu rodar uma revisão IA pra sugerir melhorias (copy/a11y/variants)?"',
    '   - Se sim, chame `requestPageSuggestions` com `{ contentId }`.',
    '   - Tool retorna `{ suggestionsCount }` — UI mostra inline.',
    '',
    '═══ TOOLS DISPONÍVEIS NESTE MODO ═══',
    '',
    'Pipeline 5-estágios:',
    '- `createPagePlan` — Stage 1 (PLAN com htmlPreview iframe)',
    '- `approvePagePlan` / `rejectPagePlan` — Stage 2 (GATE)',
    '- `generatePage` — Stage 3 (GENERATE flat Map Webstudio)',
    '- `requestPageSuggestions` — Stage 4 (SUGGEST, opcional)',
    '',
    'Edição granular pós-criação (ADR-0058 D.3):',
    '- `patchPageBlock` — Instance edit granular sem IA (BYPASS handler). Use pra renomear label, ajustar children/props específicos.',
    '- `replacePageContent` — full rewrite via novo plan+generate IA. Use quando edits localizados não bastam.',
    '- `updatePageSEO` — atualiza seo (title/description/og/canonical/robots) SEM mexer no content.',
    '',
    'Lifecycle:',
    '- `publishPage` — muda status pra "published" (lead-facing via /[slug] Sprint 7). Idempotente.',
    '- `archivePage` — soft-delete (NÃO destrutivo — sets status=archived).',
    '',
    '═══ CRITÉRIOS OBRIGATÓRIOS ═══',
    '',
    '- NÃO invente pages sem chamar `createPagePlan` primeiro (não pule plan gate).',
    '- NÃO chame `generatePage` sem ter `planId` aprovado (server action retorna erro).',
    '- form-embed block precisa formId existente — se profissional pediu form embedado e não tem form ainda, sugira criar form via Form Engine primeiro (overlay form-engine).',
    '- Apresente plan resumido em PT-BR direto, NÃO JSON cru pro user.',
    '- Vocab cravado: `page` / `instance` / `block kind` (ADR-0053 D27) — NUNCA use `section`/`component` (banido).',
    '- TODAS as tools são NÃO destrutivas (soft-delete via `archivePage`, NUNCA delete).',
    '- 1 tool por response (CRITICAL RULE I41). Após `createPagePlan`, PARE e mostre o plan.',
  ].join('\n')
}
