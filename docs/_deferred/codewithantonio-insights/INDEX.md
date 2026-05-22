---
type: index
source: codewithantonio.com workshops
captured: 2026-05-22
purpose: insights destilados (não transcripts) para consulta JIT quando AI Builders entrar (item 5 ADR-0046)
---

# Code With Antonio — Insights destilados

## Por que existe

Os workshops dele cobrem padrões diretos pro item 5 ADR-0046 (AI Builders).
Em vez de re-ler transcripts de 60+min cada, este folder consolida só os
**insights acionáveis** — patterns, decisões arquiteturais, armadilhas
confessadas pelo autor, mapeamentos cirúrgicos pro nosso stack.

**Não tem aqui:** transcript bruto, código copy-paste literal, recap UI,
demos passo-a-passo, narração de bug fixes.

## Princípio cravado

Nunca consumir esses workshops "do começo ao fim". Cada arquivo desta pasta
tem TL;DR no topo. Se decisão precisar profundidade, voltar ao transcript
fonte (link no frontmatter) ou ao repo `nextjs-vibe` (já analisado).

## Index das lições destiladas

### Curso #3 — SaaS AI Website Builder (Lovable clone, ≅ nextjs-vibe repo)

| Lição                | Densidade real                   | Arquivo                                            |
| -------------------- | -------------------------------- | -------------------------------------------------- |
| 06 — AI Jobs         | Baixa (~20%)                     | [`03-06-ai-jobs.md`](./03-06-ai-jobs.md)           |
| **08 — Agent Tools** | **Alta (~90%) — ouro absoluto**  | [`03-08-agent-tools.md`](./03-08-agent-tools.md)   |
| 19 — Agent Memory    | Média (~60%) com caveat do autor | [`03-19-agent-memory.md`](./03-19-agent-memory.md) |

### Curso #3 — Pendentes de capturar (TIER 1)

- 05 — Background Jobs (fundamento Inngest — vale só se 1ª vez com Inngest)
- 07 — E2B Sandboxes (adaptar pra Vercel Sandbox)
- 13 — Fragment View (UI pattern Artifacts — relevante AI Report)

### Curso #2 — Cursor Clone (Convex + CodeMirror) — pendentes (TIER 2)

- 04 — Background Jobs (comparar approach com #3)
- 05 — Firecrawl AI (scraping context — útil pra "import from URL" no Page Engine)
- 11 — AI Features (inline suggestions, quick edit Cmd+K)
- 12 — Conversation System (chat multi-turn)
- 13 — AI Agent Tools (multi-tool agent, Part 2)
- 14 — WebContainers Terminal Preview (alternativa browser-based)

### Curso #4 — AI Automation SaaS (Nodebase) — pendentes (TIER 2)

- 07 — Background Jobs (provavelmente mais denso — workflow-heavy)
- 08 — AI Providers (multi-provider — input pra AI Gateway)
- 12 — Workflows CRUD (pattern aplicável a Form Engine)
- 16/17/18 — Editor / Node Selector / Editor State (Page Engine analogue)

### Curso #6 — SaaS AI Agent Platform — pendentes (TIER 3)

- 10 — Agents Setup (tenant-scoped agents schema)
- 24 — Connecting Agents (dispatch pattern)
- 27 — Transcript & Chat (pipeline submission → IA → chat)

## Cross-refs

- ADR-0046 — Dogfooding-first execution order
- ADR-0045 — Registry Strategy + Novel adopt
- `docs/_deferred/oss-references-by-feature.md` — markmap OSS (entrada nextjs-vibe + Inngest agent-kit)
- `docs/research/44-real-players-integration-patterns.md` — validação players reais
- Repo `nextjs-vibe` (analisado 2026-05-22) — implementação fonte do curso #3

## Gatilho de consumo

**Quando abrir esta pasta:** ao iniciar item 5 ADR-0046 (AI Builders),
depois do funil agência rodar. Ler INDEX.md → identificar lições
prioritárias → ler insights destilados → só voltar ao transcript bruto
se decisão concreta exigir.

**Quando expandir esta pasta:** quando user colar transcripts adicionais,
destilar com mesmo formato (TL;DR + insights cravados + mapeamento +
caveat + cross-refs) — nunca salvar literal.
