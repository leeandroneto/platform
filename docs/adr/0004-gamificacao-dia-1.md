# 0004. Gamificação dia 1 via prompt-as-product

Date: 2026-05-17
Status: accepted

## Context

Master plan e pesquisa 07 sugerem gamificação como feature complexa adiada (engine de pontos + badges + leaderboard custa semanas). Fundador prefere gamificação cedo via formulário + vibe coding. Fonte: `_CONFLITOS.md #4`.

## Decision

Gamificação entra automatizada via formulário + vibe coding (prompt do fundador → Claude Code monta config → tenant tem feature ativa). Não requer engine de gamificação pesada dia 1. Padrão prompt-as-product (memória `reference_ai_engineering`).

## Consequences

**Positivo:**
- Time-to-feature: dia 1 vs ~6 semanas de engine pesada
- Cada tenant pode ter gamificação diferente sem fork de código
- Pattern reusável pra outras features ("vibe coding internal")

**Negativo:**
- Falta de padrão visual entre tenants (cada um vira fork)
- Mitigação: 3 templates oficiais (streak / progress bar / badges) como base

**Neutro:**
- Schema `platform.gamification_configs jsonb` em vez de tabelas dedicadas
- Quando 5+ tenants usarem padrão similar → consolidar em engine via ADR
