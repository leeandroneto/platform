# 0008. shadcn 100% + hierarquia universal de busca de soluções

Date: 2026-05-17
Status: accepted

## Context

Pesquisas mencionam componentes custom em vários pontos. Master plan diz shadcn-first mas sem regra explícita pra outros recursos (lib, padrão arquitetural, abstração). Fonte: `_CONFLITOS.md #8` + 00-PROJETO §8.

## Decision

Princípio universal aplicado a TUDO (visual, lib, padrão, arquitetura):

1. **Padrão oficial estabelecido** (W3C, Material 3, iOS HIG, WCAG, etc)
2. **Lib/registry maduro** (shadcn, Radix, Motion 12, dnd-kit, vaul, etc)
3. **Pattern comunidade documentado** (Credenza, Origin UI, Magic UI, etc)
4. **Custom novo** — só com ADR registrando por que os 3 acima não servem

Antes de criar qualquer componente/lib/abstração: grep no codebase + buscar nas 3 camadas acima. Custom é último recurso.

## Consequences

**Positivo:**
- Menos bug acidental (lib madura é testada por milhares)
- Updates de A11y/perf vêm de graça via upgrade
- Onboarding novo dev rápido (padrões da indústria)

**Negativo:**
- Lib externa = breaking change risk em major bumps
- Mitigação: Renovate restritivo (D-G62) só PRs minor/patch

**Neutro:**
- Catálogo shadcn ~15 componentes dia 0 (`15-bootstrap-checklist.md §B3`)
- Custom registrado em ADR (ex: APCA validator não existe pronto = ADR-0009)
