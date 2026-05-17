# 0017. ADR Michael Nygard per-arquivo

Date: 2026-05-17
Status: accepted

## Context

Onboarding-bio velho usa `docs/core/decisions.md` monolítico (107+ decisões em 1 arquivo). Pesquisa 13 (doc-lifecycle) recomenda ADR Michael Nygard per-arquivo. Fonte: `_CONFLITOS.md #17`.

## Decision

ADR per-arquivo em `docs/adr/NNNN-titulo.md`. Template Michael Nygard canônico.

Numeração sequencial 4 dígitos (`0001`, `0002`, …, `9999`) — nunca reuse mesmo se ADR deprecated. Status apenas: `proposed` → `accepted` → `superseded by NNNN`. Superseded cria novo ADR; antigo recebe linha `Status: superseded by NNNN` no topo.

Índice automatizado via `pnpm adr:index` regenerando `docs/adr/README.md`.

**Migração D-G1..D-G76 do master plan.** NÃO migrar. Master plan vira histórico arquivado pós-bootstrap (ADR-0018). ADRs começam do zero numerado 0001.

## Consequences

**Positivo:**
- Decisão superseded sem perder histórico
- Git blame trivial (1 commit por ADR)
- Claude Code lê 1 ADR sem carregar 107 não-relacionadas
- Padrão indústria consolidado (Spotify, Microsoft, AWS Builders' Library)

**Negativo:**
- Mais arquivos no repo (23 ADRs dia 0)
- Mitigação: índice auto-gerado + grep ágil

**Neutro:**
- Template completo em `14-docs-lifecycle.md §3`
- Mudança vs `_CONFLITOS.md` monolítico: ADRs imutáveis após `accepted` (este doc original vira referência arquivada)
