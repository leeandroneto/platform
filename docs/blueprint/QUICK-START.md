# QUICK-START — o que fazer agora

> 1 página ponte entre alto-nível e tarefa diária. Atualizada toda sexta na retro.
> Última atualização: 2026-05-17 · Estado: pré-bootstrap (blueprint pronto).

---

## Onde estou hoje

✅ **Pré-bootstrap concluído** (esta sessão): 18 blueprints + 26 ADRs + 62 arquivos boilerplate gerados.
🟡 **Próximo:** Sprint 1 do `12-sprint-plan.md` — criar repo `platform/` e copiar boilerplate.

---

## Esta semana (Sprint 1 — Repo + Schema baseline)

Goal: repo `platform/` cria, builda, deploya em Vercel. Schema baseline ~24 tabelas aplicado.

1. [ ] Criar pasta `C:/Users/leean/Desktop/platform/` (FORA do working dir atual)
2. [ ] `pnpm create next-app@latest . --typescript --app --turbo --tailwind --eslint --no-src-dir --import-alias "@/*"`
3. [ ] `git init` + GitHub repo `<marca-pai>/platform` (private)
4. [ ] Supabase project NOVO + Vercel project NOVO
5. [ ] **Copiar boilerplate** seguindo `_boilerplate/README.md §Como usar`
6. [ ] Migration `0001_initial` via `mcp__supabase__apply_migration` (guia em `_boilerplate/supabase/migrations/0001_initial.md`)
7. [ ] Smoke signup: novo email cria `profiles+tenants+memberships` atomicamente
8. [ ] Configurar domínio dia 1: `desafit.app` apontando pro Vercel deploy + INSERT `platform.brands`

**Gate Sprint 1:** `pnpm build` + signup smoke + DNS resolvendo. Sem isso, Sprint 2 não começa.

Detalhes: `15-bootstrap-checklist.md` tarefas 1-5 + `17-repo-bootstrap.md` §1-9.

---

## Próxima semana (Sprint 2 — Pipeline UI dia 0)

Goal: 13 paletas OKLCH + APCA dual-gate + Motion 12 presets + ~12 primitives custom + shadcn 100% + Ladle.

Estimativa: ~70h. Detalhes: `15-bootstrap-checklist.md` tarefas 6-30.

---

## Mês 1 (M0 + M1)

| Semana | Marco            | Outcome                                                                               |
| ------ | ---------------- | ------------------------------------------------------------------------------------- |
| 1      | M0 — Bootstrap   | repo+schema+pipeline UI                                                               |
| 2      | M0 — Pipeline UI | primitives + tokens prontos                                                           |
| 3      | M1 — Funil       | landing + form captação + schema leads                                                |
| 4      | M1 — Funil       | Edge Function `generate-assessment` + WhatsApp handoff → **1ª venda real ≥ R$ 1.500** |

**Gate M1:** 1 lead real (não fundador) preenche form → recebe relatório IA → fundador fecha venda WhatsApp. Sem isso, M2 não começa.

---

## Meses 2-4 (M2 → M4 = 10 tenants pagantes)

| Mês | Sprints | Marco                                                        | Tenants ativos |
| --- | ------- | ------------------------------------------------------------ | -------------- |
| 2   | 5-8     | M2 — 1º tenant via vibe coding interno + sprint imediato §39 | 1              |
| 3   | 9-12    | M3 — 2º-5º tenant + automatização do que ficou manual        | 5              |
| 4   | 13-16   | M4 — 6º-10º tenant + dashboard MRR + 1º upgrade A→B          | **10**         |

**Gate M4 = goal final fase agência:** 10 tenants pagantes simultâneos + R$ 15-20k entrada cumulativa.

---

## Cadência semanal solo (`12-sprint-plan.md §15`)

| Dia     | Manhã (3-4h foco)                           | Tarde (3-4h baixo foco)                      |
| ------- | ------------------------------------------- | -------------------------------------------- |
| Seg     | Sprint planning (30min) → 1 outcome         | Outreach: 10 mensagens cold                  |
| Ter     | Build Claude Code                           | Build + auto-review 1h sem IA antes commit   |
| Qua     | Build                                       | **Ligação 1 cliente/prospect** (mesmo 20min) |
| Qui     | Build                                       | Conteúdo: 1 post LinkedIn                    |
| Sex     | Sprint retro (30min) + **Demo E2E própria** | Admin: financeiro, NFs, suporte              |
| Sáb-Dom | Off                                         | Off                                          |

Cap 40-45h. Burnout = preditor #1 de failure solo (`ADR-0005`).

---

## Decisões one-way door (só fundador — não delegar Claude Code)

(`ADR-0017` Bezos framing + `11-roadmap.md §9`)

- Schema novo (`platform.*`) — antes de migration final
- Modelo de billing (split EFI/Stripe)
- Contratos LGPD/operador
- Vocab banido (lint enforce)
- Arquitetura multi-tenant + RLS
- Brand identity (logo, cor primária 13 paletas)

**Reversíveis (Claude Code propõe + implementa):** copy, pricing tier, CSS, nome de componente, tooling secundário.

---

## Quando perguntar pra Claude Code

| Tarefa                          | Quem domina                                          | Por quê                            |
| ------------------------------- | ---------------------------------------------------- | ---------------------------------- |
| Migration SQL baseline          | **Fundador revisa** + Claude executa via MCP         | Schema one-way door                |
| Edge Function Deno (Sonnet 4.6) | **Híbrido** — texto do prompt fundador, infra Claude | Prompt = produto                   |
| UI mobile-first 375px           | **Claude Code vibe coding**                          | Mecânico, alto volume              |
| ESLint rule nova                | **Fundador decide** + Claude implementa              | Decisão arquitetural               |
| Componente shadcn customizado   | **Claude Code** + revisão visual fundador            | Reversível                         |
| ADR draft                       | **Claude propõe** + fundador edita decisão           | Texto reversível, conteúdo one-way |

---

## Onde está cada doc

| Quero                          | Vai em                                                 |
| ------------------------------ | ------------------------------------------------------ |
| Visão geral 4 meses            | `11-roadmap.md`                                        |
| O que fazer esta semana        | `12-sprint-plan.md` (sprint atual)                     |
| Tarefas dia 0 (~70h)           | `15-bootstrap-checklist.md`                            |
| Comandos pra criar repo        | `17-repo-bootstrap.md`                                 |
| O que copiar do onboarding-bio | `18-transferencia.md`                                  |
| Arquivos prontos pra copiar    | `_boilerplate/`                                        |
| Decisões fechadas (imutáveis)  | `docs/adr/0001-0026.md`                                |
| Regras de código               | `.claude/rules/*.md` (carrega por path no Claude Code) |
| Esta página                    | `QUICK-START.md`                                       |

---

## Update protocol

Atualizar este arquivo toda **sexta após retro** (5 min):

- Marcar tasks da semana atual como `[x]`
- Mover "esta semana" → "próxima semana"
- Bumpar contador de tenants ativos em "Meses 2-4"
- Linhas que envelhecerem (>4 semanas sem updates) → revisar ou apagar
