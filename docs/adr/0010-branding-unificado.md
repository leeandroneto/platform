# 0010. Personalização unificada (não por tier de pacote)

Date: 2026-05-17
Status: accepted

## Context

Master plan §31.3 propôs CSS via API route com restrições por tier (Pacote A/B/C teria níveis diferentes de personalização). Fundador prefere modelo único pra todos. Fonte: `_CONFLITOS.md #10` + memória D-G59.

## Decision

Personalização unificada — todos os tenants têm o mesmo poder de customização visual (cor primária, secundária, logo, fonte). Não há restrição por pacote. Todos têm footer "Powered by desafit" visível.

## Consequences

**Positivo:**

- Engine simples (1 caminho de código vs 3)
- Conversão melhor (prof não fica preso em "tier baixo limita meu branding")
- Fácil migrar tenant entre pacotes (só muda feature flags do produto, não tema)

**Negativo:**

- Pacote A pode parecer "tão completo quanto C" no visual
- Mitigação: diferenciação Pacote vai em features (PWA, integrações, automações), não em customização visual

**Neutro:**

- CSS via API route (`/api/tenants/[id]/theme.css?v=N`) — D-G59
- Footer "Powered by desafit" igual pra todos (futura ADR pode adicionar tier que oculta)
