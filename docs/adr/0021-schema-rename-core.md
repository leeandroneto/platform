# 0021. Schema rename `desafit.*` → `core.*` (multi-marca)

Date: 2026-05-17
Status: superseded by 0025 (schema `platform.*` posteriormente consolidado em `public.*` via ADR-0033)

## Why superseded

Decisão original (2026-05-17 manhã) renomeou schema produto pra `core.*`. Mesma tarde,
fundador esclareceu arquitetura: 1 código + 1 deploy + N marcas filhas via hostname
(não 1 deploy por marca via env). Nome `core` ficou ambíguo com "lib/core/" e
"núcleo arquitetural". ADR-0025 renomeia pra `platform.*` (neutro, descreve a plataforma
multi-tenant). Decisão substância idêntica — só nome muda.

## Context

Master plan §16 nomeia schema produto principal de `desafit.*`. Mesmo codebase + mesmo Supabase vai servir múltiplas marcas (desafit.app fitness, yoga.app futuro, ingles.app futuro). Nome atrelado a marca específica fica errado. Fonte: `_CONFLITOS.md #21` + memória `project_desafit_multi_brand_strategy`.

## Decision

Renomear schema base de `desafit` → `core`:

```
public.*       — compartilhado (auth, system)
core.*         — multi-marca multi-vertical
onboarding.*   — legado pausado (mantém intacto no Supabase do onboarding-bio, NÃO migra)
```

**Multi-vertical via coluna, não schema separado.** Padrão D-G28 mantido: `tenants.vertical` + `component.kind` polimórfico + JSONB internal keys.

**Why.** Schema separado por vertical duplicaria 70% das tabelas, triplicaria RLS/migrations/edge functions, quebraria lookups cruzados (prof com aluno fit + yoga compartilhando perfil).

## Consequences

**Positivo:**

- Marca pai não atrelada a tech (separation of concerns)
- 1 schema serve 3+ marcas sem fork
- Lookups cross-vertical triviais (mesmo `core.users`)

**Negativo:**

- Refator semantic em qualquer code/doc que mencionasse `desafit.*` (este blueprint inteiro usa `core.*`)
- Marca desafit não aparece em nome técnico — pode confundir devs no início

**Neutro:**

- Toda referência a schema produto = `core.*` em blueprints, ADRs, código
- `.claude/rules/schema-separation.md` reforça
- ADR-0022 (marca pai comercial) é dependência conceitual
