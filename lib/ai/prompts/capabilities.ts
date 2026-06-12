// lib/ai/prompts/capabilities.ts — CAPABILITIES segment do system prompt v2.
//
// Sprint 1.4 Bloco B (2026-05-27).
//
// Renderiza as 2 categorias de tools que IA tem disponíveis (ADR-0063 — 2
// universos coexistentes). Output 100% determinístico — cacheable cross-tenant
// (cache hit alto entre todos brands+tenants).
//
// Universe A — content engine (`createEngineHandler` per ADR-0050 Amendment A1):
//   - Sprint 2.B cravado: `form-lead-capture` DISPONÍVEL (1ª instância
//     real da infra Engine). Fluxo plan-gate pelo overlay form-engine
//     (lib/ai/prompts/form-overlay.ts) — invocado via composer overlay='form-engine'.
//   - Sprint 6.A.2 cravado: `page-landing` DISPONÍVEL (1ª instância Page Engine,
//     Webstudio flat Map ADR-0053). Fluxo plan-gate pelo overlay page-engine
//     (lib/ai/prompts/page-overlay.ts) — invocado via composer overlay='page-engine'.
//   - Kinds futuros: `page-report` (Sprint 5) · `page-sales` (Sprint 6+).
//
// Universe B — artifacts fork (`createDocumentHandler`):
//   - 12 kinds dia 1 (validados em `lib/types/chat.ts::ArtifactKind`):
//     text · code · sheet · image · mermaid · chart · mindmap · html ·
//     pdf · docx · xlsx · pptx.
//
// Vocab cravado:
//   - `createEngineHandler` distinto de `createDocumentHandler` (ADR-0050 A1)
//   - `lead-capture` é o kind canônico do form de captação (`.claude/rules/naming.md`)
//   - `professional` é o termo canônico (ver substitutos em naming.md)
//
// @see ADR-0050 Amendment 2026-05-27 §A1 — rename createContentHandler → createEngineHandler
// @see ADR-0063 — 2 universos coexistentes
// @see lib/types/chat.ts::ArtifactKind — 12 kinds Universe B

/**
 * Renderiza segmento CAPABILITIES do system prompt.
 *
 * 100% determinístico per build → cache hit cross-tenant. Mudar lista de kinds
 * = deploy = cache miss em 1ª request, hit em todas subsequentes.
 */
export function buildCapabilitiesPrompt(): string {
  return [
    '═══ CAPABILITIES ═══',
    '',
    'Você opera em 2 universos paralelos de tools (ADR-0063):',
    '',
    '┌─ Universe A — Content engine (`createEngineHandler` kinds) ─┐',
    '',
    'Pra conteúdo PUBLISHABLE multi-tenant (versionado Hotmart-like, audit log, RLS). Kinds disponíveis HOJE + previstos:',
    '- `form-lead-capture` — forms de captação de leads (Sprint 2.B DISPONÍVEL). Pipeline 5-estágios via tools `createFormPlan` → `approveFormPlan` → `generateForm` → `requestFormSuggestions`.',
    '- `page-landing` — landing pages de vendas (Sprint 6.A.2 DISPONÍVEL). Pipeline 5-estágios via tools `createPagePlan` → `approvePagePlan` → `generatePage` → `requestPageSuggestions`. Webstudio flat Map pattern (ADR-0053).',
    '- `page-report` — relatórios IA renderizados em página (Sprint 5, futuro)',
    '',
    'IMPORTANTE: pra `form-lead-capture` use overlay FORM ENGINE BUILDER MODE; pra `page-landing` use overlay PAGE ENGINE BUILDER MODE — quando ativos NÃO chame `createContent` direto. Pros kinds não implementados (`page-report`), explique que está em implementação e ofereça rascunhar via Universe B (`createDocument kind=text` ou `kind=html`) enquanto isso.',
    '',
    '┌─ Universe B — Artifacts scratchpad (`createDocumentHandler` kinds) ─┐',
    '',
    'Pra rascunhos e visualizações DENTRO do chat (snapshot simples, sem versionamento rigoroso). 12 kinds disponíveis HOJE:',
    '',
    '- `text` — documentos em prosa editáveis (ensaios, copy, roteiros)',
    '- `code` — código com syntax highlight (Python executável via Pyodide client)',
    '- `sheet` — planilhas CSV editáveis',
    '- `image` — visualização de imagens (read-only — não gera, exibe upload)',
    '- `mermaid` — diagramas (fluxograma, sequence, gantt, mindmap, journey, ~10 tipos)',
    '- `chart` — gráficos via JSON spec (line / bar / pie / area / radar)',
    '- `mindmap` — mapa mental hierárquico em markdown (markmap)',
    '- `html` — HTML semântico renderizado em iframe sandboxed',
    '- `pdf` — documentos PDF exportáveis',
    '- `docx` — documentos Word exportáveis',
    '- `xlsx` — planilhas Excel exportáveis',
    '- `pptx` — apresentações PowerPoint exportáveis',
    '',
    'Use `createDocument` pra criar artifact novo. Use `updateDocument` pra rewrite completo. Edição localizada NÃO é suportada em Universe B — pra reescrever, chame `updateDocument`.',
  ].join('\n')
}
