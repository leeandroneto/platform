# ADRs — Architecture Decision Records

> Decisões fechadas do projeto `desafit.app` greenfield.
> Template: Michael Nygard (ADR-0017). Imutáveis após `accepted` — superseded via novo ADR.
> Índice manual dia 0; `pnpm adr:index` automatiza pós-bootstrap.

---

## Índice

| # | Título | Status | Data |
|---|---|---|---|
| 0001 | Schema sizing dia 1 | accepted | 2026-05-17 |
| 0002 | Sem tabela TACO/TBCA dia 1 | accepted | 2026-05-17 |
| 0003 | Priorização de automações por dor real | accepted | 2026-05-17 |
| 0004 | Gamificação dia 1 via prompt-as-product | accepted | 2026-05-17 |
| 0005 | Cronograma agressivo: 10 tenants em 4 meses | accepted | 2026-05-17 |
| 0006 | Construir funil comercial antes de outreach | accepted | 2026-05-17 |
| 0007 | Mobile-first 100% incluindo painel profissional | accepted | 2026-05-17 |
| 0008 | shadcn 100% + hierarquia universal de busca de soluções | accepted | 2026-05-17 |
| 0009 | Critério premium: subset mais rico consistente | accepted | 2026-05-17 |
| 0010 | Personalização unificada (não por tier de pacote) | accepted | 2026-05-17 |
| 0011 | Editor híbrido assimétrico 80/20 | accepted | 2026-05-17 |
| 0012 | Lint enforcement multi-camada dia 0 | accepted | 2026-05-17 |
| 0013 | Ladle como catálogo visual (não Storybook) | accepted | 2026-05-17 |
| 0014 | Serwist + Turbopack para PWA service worker | accepted | 2026-05-17 |
| 0015 | PWA offline: idb-keyval + autosave 800ms + visualViewport | accepted | 2026-05-17 |
| 0016 | Pipeline UI dia 0 expandido (~70h) | accepted | 2026-05-17 |
| 0017 | ADR Michael Nygard per-arquivo | accepted | 2026-05-17 |
| 0018 | Hierarquia da fonte da verdade documental | accepted | 2026-05-17 |
| 0019 | Setup 4 telas é fase 2 SaaS (M5+), não MVP | accepted | 2026-05-17 |
| 0020 | Bundle budgets per-rota enforced no CI | accepted | 2026-05-17 |
| 0021 | Schema rename `desafit.*` → `core.*` (multi-marca) | superseded by 0025 | 2026-05-17 |
| 0022 | Marca pai (holding) é identidade comercial, zero tech dia 1 | accepted | 2026-05-17 |
| 0023 | Onboarding.bio retomada futura: Supabase + repo separados | accepted | 2026-05-17 |
| 0024 | Multi-brand via hostname, não env | accepted | 2026-05-17 |
| 0025 | Schema rename `core.*` → `platform.*` | accepted | 2026-05-17 |
| 0026 | Multi-domain por tenant (subdomain grátis + custom domain) | accepted | 2026-05-17 |

---

## Como criar novo ADR

1. Próximo número sequencial (consultar último deste índice)
2. Criar `docs/adr/NNNN-titulo-curto.md` seguindo template Michael Nygard:

```markdown
# NNNN. Título curto

Date: YYYY-MM-DD
Status: proposed | accepted | superseded by NNNN | deprecated

## Context
2-4 linhas — por que essa decisão veio à tona.

## Decision
O que decidimos (transcrever literal).

## Consequences
- Positivo: bullets
- Negativo: bullets (riscos aceitos)
- Neutro: bullets (mudanças em outros lugares)
```

3. Adicionar linha neste README com Status (`proposed` até fundador aprovar)
4. Rodar `pnpm adr:index` (quando script existir)

## Como superseder ADR

1. Criar novo ADR com mesmo tema + número novo
2. Editar topo do ADR antigo: `Status: superseded by NNNN`
3. Adicionar bloco `## Why superseded` no ADR antigo (1 parágrafo)
4. Atualizar este README — Status do antigo vira `superseded by NNNN`
5. Bumping CHANGELOG.md

## Status válidos

- `proposed` — em discussão; não execute ainda
- `accepted` — decisão fechada; código deve seguir
- `superseded by NNNN` — substituído; consultar novo ADR
- `deprecated` — não vale mais, sem substituto; explicar em "Why deprecated"

Status nunca volta — `accepted` não vira `proposed` de novo.

---

## Referências

- Template Michael Nygard: https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions
- ADR-0017 (este padrão)
- ADR-0018 (hierarquia fonte verdade)
- `14-docs-lifecycle.md §3, §4` (template canônico + auto-gen)
