# 0020. Bundle budgets per-rota enforced no CI

Date: 2026-05-17
Status: accepted

## Context

Master plan e pesquisa 10 (perf-multi-vertical) propõem budgets diferentes. Pesquisa 16 confirma >200KB First Load trava mid-tier Android em <3s (target ICP fitness BR usa smartphone mid-tier). Fonte: `_CONFLITOS.md #20` + memória D-G63 (size-limit).

## Decision

Budgets enforced no CI dia 0 via `size-limit`:

| Rota | First Load | Total JS |
|---|---|---|
| Landing pública (`/`, `/[slug]`) | 100KB | 150KB |
| Login / signup | 80KB | 120KB |
| PWA shell (após login) | 170KB | 240KB |
| PWA aba (Início/Programa/Agenda/Chatbot/Perfil) | 50KB incremental | 50KB |
| Editor form-based | 50KB incremental | 80KB |
| Editor inline texto landing | 30KB incremental | 40KB |
| Admin / billing | 60KB incremental | 100KB |
| Influencer dashboard | 40KB incremental | 60KB |

Build CI falha se rota ultrapassar. PR bloqueada até reduzir ou justificar via novo ADR superseding budget específico (aprovação fundador).

**Estratégias automáticas dia 0:** Route-level code splitting Next 16, `next/dynamic` em componentes pesados, tree-shaking Tailwind + shadcn, Server Components default, font subsetting Geist latin, Motion import seletivo `motion/react`.

## Consequences

**Positivo:**
- Performance ICP (Android mid-tier 4G) garantida
- Custo de bundle inflado pego no CI, não em produção
- Diferencial vs concorrentes BR (bundles 500KB+)

**Negativo:**
- Pressão constante pra reduzir bundle (custo cognitivo dev)
- Lib externa pesada exige avaliação prévia

**Neutro:**
- Configurado em `.size-limit.ts` (`15-bootstrap-checklist.md tarefa 12`)
- Reforço em `13-lint-enforcement.md §6`
