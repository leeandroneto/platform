# 0012. Lint enforcement multi-camada dia 0

Date: 2026-05-17
Status: accepted

## Context

Master plan e pesquisa 09 (lint-enforcement-token-bypass) + memória D-G66 (i18n 14 padrões) propõem regimes diferentes de lint. Onboarding-bio velho acumulou 830 `eslint-disable` silenciando 1 regra única (token bypass). Defesa multi-camada evita repetição. Fonte: `_CONFLITOS.md #12` + memória `feedback_zero_eslint_disable`.

## Decision

3 camadas de defesa dia 0:

1. **ESLint custom rules — 24 padrões:** vocab banido (1), i18n hardcoded (14), token bypass (4), file/function size (4), guards arquiteturais (2)
2. **Sheriff boundaries** — Domain→Data→Hooks→UI (sem pular, sem subir)
3. **CI grep scripts** — `pnpm vocab:audit`, `pnpm i18n:audit`, `pnpm token:audit`

`--max-warnings 0`. Zero `eslint-disable` exceto allowlist registrada neste ADR.

**Allowlist (2 únicos comentários aceitos):**

- `// eslint-disable-next-line jsx-a11y/heading-has-content — block oficial shadcn`
- `// eslint-disable-next-line react/jsx-no-literals — third-party-component`

Adicionar novo padrão exige novo ADR superseding este.

## Consequences

**Positivo:**

- 830 disables do onboarding-bio impossíveis de repetir
- Defesa em profundidade — falha de regra AST pega no grep
- CI fail-fast (grep ~3s antes de build pesado)

**Negativo:**

- Custo dia 0: ~12-16h
- Atrito ocasional pro Claude Code (deve aprender regra ou perguntar)

**Neutro:**

- Detalhado em `13-lint-enforcement.md`
- ADR-0020 (bundle budgets) é defesa similar pra perf
