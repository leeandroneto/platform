# 0001. Schema sizing dia 1

Date: 2026-05-17
Status: accepted

## Context

Master plan §16.19 propõe ~54 tabelas baseline. Pesquisa 10 (perf-multi-vertical) sugere começar enxuto (~12-18 tabelas). Conflito entre cobertura completa vs YAGNI. Memória `project_desafit_db_migration_2026_05_17` analisou 57 tabelas do onboarding-bio: 7 verbatim + 18 adaptadas + 26 descartadas (46%). Fonte: `_CONFLITOS.md #1`.

## Decision

Híbrido: núcleo arquitetural dia 0 (~18-25 tabelas core interconectadas — Programa → Módulo → Componente → Enrollment → Progress → Payment) + crescimento orgânico por etapa (§39 master plan). Tabelas de audit/metrics/configs entram JIT quando consumer real existir.

Princípio: schema interconectado nasce junto (FK + RLS + migrations custam refator pesado depois). Tabelas isoladas internas entram quando há caso real.

## Consequences

**Positivo:**

- Menos tabela órfã = menos ruído semântico pro Claude Code
- FK + RLS desde dia 0 evita refator caro
- Migrations curtas dia 0 (~22 tabelas) vs ~54

**Negativo:**

- Risco de descobrir gap só quando feature precisar (custo migration menor)
- Cada tabela JIT exige redecisão (sem playbook permanente)

**Neutro:**

- Blueprint `06-data-model.md §3` lista exatas ~22 tabelas baseline
- ADR-0002 (sem TACO) reforça princípio JIT pra KB nutricional
