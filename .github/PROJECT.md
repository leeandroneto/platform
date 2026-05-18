# GitHub Project — template Kanban

> Como configurar o GitHub Project board pra acompanhar M0-M5+.
> Baseado em blueprint `12-sprint-plan.md` (16 sprints semanais).

---

## Setup inicial (1×)

1. GitHub → Projects → New project → **Board** view
2. Nome: `platform — roadmap`
3. Adicionar repo: `<org>/platform`
4. Visibility: Private

## Colunas (5)

| Coluna              | O que entra                                | WIP limit  |
| ------------------- | ------------------------------------------ | ---------- |
| 📋 **Backlog**      | Ideias trianguladas, sem sprint atribuído  | sem limite |
| 🎯 **Sprint atual** | Issues com `sprint:N` label, comprometidas | 5-8        |
| 🚧 **Em progresso** | PR aberto OU em desenvolvimento ativo      | 3          |
| 🔍 **Review**       | PR aberto aguardando review                | 2          |
| ✅ **Done**         | Merged + deployed em prod                  | sem limite |

## Labels (10)

### Tipo (vermelho)

- `bug` — algo quebrado
- `feature` — nova feature
- `refactor` — refator
- `docs` — documentação
- `infra` — DevOps / CI / config

### Prioridade (laranja)

- `P0` — produção parada
- `P1` — crítico
- `P2` — normal
- `P3` — cosmético

### Camada (azul)

- `layer:schema` — migration
- `layer:server-action` — actions.ts
- `layer:edge-fn` — supabase/functions/
- `layer:ui` — components/app
- `layer:domain` — lógica pura

### Pacote (verde)

- `package:A` — Pacote A R$ 1.500
- `package:B` — Pacote B R$ 3.000
- `package:C` — Pacote C R$ 4.000
- `package:platform` — admin interno

### Sprint (cinza)

- `sprint:1` ... `sprint:16` — alinhado com 12-sprint-plan.md
- `milestone:M0` ... `milestone:M5`

## Milestones (6)

| Milestone                   | Due date  | Conteúdo                                             |
| --------------------------- | --------- | ---------------------------------------------------- |
| **M0 — Bootstrap**          | semana 2  | Repo + schema + pipeline UI dia 0 (~70h)             |
| **M1 — Funil agência**      | semana 4  | Landing + form captação + assessment IA + WhatsApp   |
| **M2 — 1º tenant**          | semana 8  | Tenant configurado via vibe coding interno           |
| **M3 — 2º-5º tenant**       | semana 12 | Playbook refinement + automações sprint imediato §39 |
| **M4 — 6º-10º tenant**      | semana 16 | 10 tenants pagantes = R$ 20k entrada                 |
| **M5+ — SaaS self-service** | ano 2     | Setup 4 telas público (M5+)                          |

## Automation (Project settings)

- Issue criada → adiciona em **Backlog**
- Issue com `sprint:N` → move pra **Sprint atual** (filter por sprint ativo)
- PR aberta linkando issue → move issue pra **Review**
- PR merged + branch deletada → move issue pra **Done**
- Issue fechada sem PR → move pra **Done**

## Views customizadas

1. **Sprint atual** — filter `label:sprint:<N>` (N = sprint ativo)
2. **Por pacote** — group by `package:*`
3. **Por camada** — group by `layer:*`
4. **Bug triage** — filter `label:bug,label:triage`
5. **ADR pending** — issues que mencionam "ADR" no body sem PR

## Cadência

- **Segunda 9h:** sprint planning solo (30min) — escolher outcome do sprint
- **Sexta 17h:** sprint retro solo (30min) — fechar issues + atualizar `milestone`

Detalhes da cadência: blueprint/12-sprint-plan.md §15.

## Não usar

- **Múltiplos boards** — só 1 (`roadmap`). Cemitério de board = backlog cemitério (pesquisa 07 §13)
- **Velocity points** — solo founder não precisa. Use horas reais measured.
- **Daily standup** — solo. Substitui por retro semanal.
