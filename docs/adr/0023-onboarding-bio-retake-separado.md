# 0023. Onboarding.bio retomada futura: Supabase + repo separados

Date: 2026-05-17
Status: accepted

## Context

Fundador planeja retomar onboarding.bio futuramente em formato mais simples e internacional. Decisão de como produto futuro se relaciona com desafit greenfield. Fonte: `_CONFLITOS.md #23` + memória `project_desafit_multi_brand_strategy`.

## Decision

Quando onboarding.bio retomar:

- **Supabase separado** (projeto novo no dashboard Supabase)
- **Repo separado** (default — não monorepo com desafit)
- Schema `onboarding.*` legado fica intacto no Supabase atual (do `C:/Users/leean/Desktop/onboarding-bio/`), **NÃO migra** pro novo Supabase desafit
- Conexão com desafit/yoga/etc é **apenas comercial via marca pai**. Zero tech compartilhado

**Onboarding-bio atual** (`C:/Users/leean/Desktop/onboarding-bio/`) fica intacto como referência viva (princípio JIT code transfer — memória `project_desafit_jit_code_transfer`).

## Consequences

**Positivo:**
- Cada produto evolui no próprio ritmo sem coupling
- Refator/rewrite de um não afeta outro
- LGPD/billing/auth separados (cada produto tem operador legal próprio)

**Negativo:**
- Duplicação de tooling base (CI, ESLint config, design system base)
- Mitigação aceita: duplicação tolerada por simplicidade

**Neutro:**
- Onboarding-bio retomada NÃO é prioridade dia 1 (foco desafit M0-M4)
- `18-transferencia.md` documenta o que migra/não migra
- ADR-0022 (marca pai) é dependência conceitual
