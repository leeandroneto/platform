# 0025. Schema rename `core.*` → `platform.*`

Date: 2026-05-17
Status: superseded by 0033 (schema `platform.*` consolidado em `public.*` em 2026-05-18 — naming "platform" sobrevive como nome do repo/projeto, não schema)
Supersedes: 0021

## Context

ADR-0021 renomeou schema produto de `desafit.*` pra `core.*` (multi-marca). Mesma tarde, fundador esclareceu arquitetura multi-brand via hostname (ADR-0024) e decidiu nome do repositório/pasta/projects = `platform`. Manter `core` como schema cria ambiguidade com:

- `lib/core/` (paths sistema operacional)
- "núcleo arquitetural" (uso textual em docs)
- "core team" (uso genérico)

`platform` é neutro, descreve "plataforma multi-tenant white-label multi-brand multi-vertical", alinha com nome do repo/Supabase/Vercel project.

## Decision

Renomear schema base de `core` → `platform`:

```
public.*       — compartilhado (auth, system)
platform.*     — produto multi-marca multi-vertical (era core.*)
onboarding.*   — legado pausado (Supabase de outro repo)
```

Substância idêntica à ADR-0021 — só o identificador muda. Multi-vertical via coluna (D-G28), polimorfismo via `component.kind`, JSONB internal keys EN.

Aplicação:

- Todo `client.schema('core')` → `client.schema('platform')`
- Toda referência textual `core.*` → `platform.*` em blueprints/ADRs/CLAUDE/rules
- Migration `0001_initial.md` cria `platform` schema (não `core`)
- ESLint rule continua proibindo schema raw sem `.schema()` explícito

## Consequences

**Positivo:**

- Nome alinhado com pasta/repo/projects (`platform`)
- Zero ambiguidade com `lib/`, "core team", "núcleo arquitetural"
- Marca-agnóstico — futuras marcas filhas (yoga.app, ingles.app) usam mesmo schema

**Negativo:**

- Mudança lexical em ~109 ocorrências em blueprints/ADRs (já aplicada nesta sessão)
- ADR-0021 vira histórico

**Neutro:**

- Aplicado em todos os arquivos antes do primeiro código rodar (zero refactor real)
- `_boilerplate/` inteiro reflete `platform.*`
- 5 rules `.claude/` atualizadas
