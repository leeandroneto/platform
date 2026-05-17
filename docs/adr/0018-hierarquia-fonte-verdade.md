# 0018. Hierarquia da fonte da verdade documental

Date: 2026-05-17
Status: accepted

## Context

5 fontes potencialmente conflitantes: master plan (6.631 linhas), 16 pesquisas, MEMORY.md, 00-PROJETO.md, decisions.md futuro. Sem hierarquia explícita, Claude Code e fundador adivinham qual ganha. Fonte: `_CONFLITOS.md #18` + pesquisa 13.

## Decision

Ordem decrescente de autoridade:

1. **`00-PROJETO.md`** — constituição append-only. Inegociável. Conflito com qualquer outro doc, ganha sempre
2. **`docs/adr/NNNN-*.md`** — decisões fechadas pós-bootstrap. Imutáveis após `accepted`. Superseded via novo ADR
3. **Master plan** — referência viva durante bootstrap. **Pós-dia 0 = histórico arquivado** em `docs/_archive/master-plan-original.md`. Não é fonte de verdade no longo prazo
4. **Pesquisas 01-16** — referência técnica pinada. Citadas dentro de ADRs. Viram histórico não-consultado pós-bootstrap
5. **MEMORY.md + memórias Claude** — contexto de sessão. Não é fonte arquitetural. Conflito com ADR → ADR ganha

Regra prática: decisão nova → ADR citando master plan (linha) + pesquisa (arquivo) + memória relevante. Se algo no master plan parece errado → não corrigir, criar ADR que sobrescreve.

## Consequences

**Positivo:**
- Decisão de "quem ganha?" trivial
- Master plan vira arquivo histórico (não vivo) — não pressão de manter atualizado
- ADRs imutáveis = histórico preservado

**Negativo:**
- Onboarding novo (humano ou Claude) precisa aprender hierarquia
- Mitigação: 1 parágrafo em CLAUDE.md root

**Neutro:**
- Detalhes em `14-docs-lifecycle.md §1, §13`
- ADR-0017 (Michael Nygard per-arquivo) é dependência direta
