# 14 — Docs Lifecycle

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Como cada tipo de documento nasce, vive, é editado, é superseded. Ownership explícito.
> Origem: pesquisa 13 (doc lifecycle) + decisão `_CONFLITOS #17` (ADR Michael Nygard per-arquivo) + #18 (hierarquia fonte da verdade).

---

## 1. Hierarquia fonte da verdade (autoridade decrescente)

(Reforço da decisão `_CONFLITOS #18`)

1. **`00-PROJETO.md`** — constituição append-only. Conflito com qualquer doc, ganha sempre. Só fundador edita.
2. **`docs/adr/NNNN-*.md`** — decisões fechadas pós-bootstrap. Imutáveis após `accepted`. Superseded via novo ADR.
3. **Blueprints `docs/blueprint/*.md`** — referência técnica viva. Editável via PR. Cita ADRs.
4. **`.claude/rules/*.md`** — regras carregadas por Claude Code via `paths:` frontmatter. Editável via PR.
5. **`docs/_archive/*`** — master plan original + 16 pesquisas + proposta HTML + mockup. Referência JIT, não fonte ativa.
6. **`~/.claude/projects/<hash>/memory/`** — contexto de sessão. Não é fonte arquitetural. ADR ganha sempre.

**Regra prática.** Decisão nova → ADR cita master plan §N + pesquisa NN + memória relevante. Se master plan parece errado → criar ADR que sobrescreve. Não editar master plan (arquivado).

---

## 2. Tipos de doc + ownership + tamanho

| Tipo | Path | Tamanho | Owner | Edição |
|---|---|---|---|---|
| Constituição | `docs/blueprint/00-PROJETO.md` | <350 linhas | Fundador | Append-only (nunca mutate, só anexa "pivot YYYY-MM-DD") |
| ADR | `docs/adr/NNNN-titulo.md` | 40-100 linhas | Fundador (decisão) + Claude Code (rascunho) | Imutável após `accepted`. Mudar = novo ADR `superseded by NNNN` |
| Blueprint | `docs/blueprint/NN-tema.md` | 80-350 linhas | Híbrido | PR + review fundador |
| Regra Claude | `.claude/rules/*.md` | 30-150 linhas | Híbrido | PR + review fundador |
| CLAUDE.md root | `CLAUDE.md` | <200 linhas | Fundador (estrutura) + Claude Code (atualização) | PR (qualquer mudança rebobina contexto sessão) |
| README arquivos | `README.md` per-folder | 50-150 linhas | Híbrido | PR |
| Runbook | `docs/runbooks/<topic>.md` | 80-250 linhas | Híbrido | PR |
| CHANGELOG | `CHANGELOG.md` root | append (sem limite) | Híbrido | PR (formato keepachangelog) |
| Memória Claude | `~/.claude/projects/<hash>/memory/<topic>.md` | <100 linhas cada | Claude Code | Auto-update; revisão semestral pelo fundador |
| _archive | `docs/_archive/*` | (qualquer) | — | Read-only. Nunca editar |

---

## 3. ADR Michael Nygard (template canônico)

```markdown
# NNNN. Título curto

Date: YYYY-MM-DD
Status: proposed | accepted | superseded by NNNN | deprecated
Context:
  Por que essa decisão veio à tona (2-4 linhas).
  Cita master plan §N + pesquisa NN + memória.
Decision:
  O que decidimos (transcrever literal, sem ambiguidade).
Consequences:
  - Positivo: bullets curtos
  - Negativo: bullets (riscos aceitos)
  - Neutro: bullets (mudanças necessárias em outros lugares)
```

**Regras:**
- Numeração sequencial 4 dígitos (`0001`, `0002`, …, `9999`) — nunca reuse, mesmo se ADR for deprecated
- Status apenas: `proposed` → `accepted` → `superseded by NNNN` (não voltar pra `proposed`)
- `superseded` cria novo ADR; ADR antigo recebe linha `Status: superseded by NNNN` no topo + bloco "Why superseded:" 1 parágrafo
- Git blame mostra origem da decisão — não reescrever histórico

---

## 4. `pnpm adr:index` (índice automatizado)

Script `scripts/adr-index.ts` regenera `docs/adr/README.md` a partir do frontmatter de cada ADR:

```markdown
# ADRs

| # | Título | Status | Data |
|---|---|---|---|
| 0001 | Schema sizing dia 1 | accepted | 2026-05-17 |
| 0002 | Sem tabela TACO | accepted | 2026-05-17 |
| … |
```

Rodar `pnpm adr:index` após cada ADR criado. CI valida que README.md está sincronizado (falha se desatualizado). Bootstrap inicial (CHUNK 5) cria README manual; depois disso é auto-gerado.

---

## 5. Blueprints — geração 1× + atualização via PR

**Origem.** Blueprints (`docs/blueprint/01-18.md`) nasceram desta sessão pré-código (CHUNK 1-7 da conversa). Cada um cobre 1 tema de fundação.

**Lifecycle pós-bootstrap.**
1. Blueprint é referência ativa enquanto fundador + Claude Code escrevem código novo
2. Mudança = PR com diff explicado no PR description
3. Mudança grande = primeiro abrir ADR documentando *por que* mudar, depois PR atualizando blueprint
4. Blueprints **não morrem** — viram doc operacional do produto. Se um tema fica obsoleto (ex: PWA muda totalmente em ano 3), criar `08-pwa-offline-v2.md` e marcar v1 com `Status: superseded by 08-pwa-offline-v2`.

**Não fazer:**
- Deletar blueprint (perde contexto histórico)
- Editar blueprint sem PR (Claude Code não confia em mudanças não-revisadas)
- Misturar 2 temas em 1 blueprint (cada arquivo = 1 tema)

---

## 6. `.claude/rules/*` — carregamento via `paths:`

Pesquisa 13 + memória D-G60: CLAUDE.md root <200 linhas + delega via frontmatter `paths:` para arquivos `.claude/rules/<topic>.md` carregarem só quando relevante (não inflar contexto da sessão).

Exemplo `.claude/rules/data-layer.md`:

```yaml
---
name: Data layer rules
description: Rules para arquivos em lib/data/
paths:
  - "lib/data/**/*.ts"
  - "app/**/actions.ts"
---

## Regras

- `function(client, ...args)` assinatura
- Lança erro, não retorna `{ ok }`
- Sem React, sem hooks, sem JSX
- ...
```

Claude Code carrega esse arquivo **só** quando edita ficheiro que casa com `paths:`. Sessão fica leve.

**Lista mínima dia 0** (criada em CHUNK 4 file `16-claude-code.md`):
- `naming.md` — vocab + EN code / PT URL+UI
- `layers.md` — Domain→Data→Hooks→UI
- `abstractions.md` — 3+ usos + ADR antes
- `domain-logic.md` — zero IO, test obrigatório
- `schema-separation.md` — `public`/`platform`/`onboarding` (legacy intacto)
- `jwt-claims.md` — `auth.jwt() ->> 'tenant_id'`
- `data-layer.md` — `function(client, ...args)`, lança erro
- `server-actions.md` — `{ok,data}|{ok,error}`, chama `lib/data/`

---

## 7. CLAUDE.md root — <200 linhas

Estrutura canônica (memória D-G60):

```markdown
# CLAUDE.md
> Carregado em toda sessão. **Mantenha curto e atualizado.**

## Projeto
[1 parágrafo: o que é desafit + fase atual]

## Onde fica cada coisa
[tabela: tipo de info → arquivo canonical]

## Stack travado
[1 parágrafo: versions pinadas]

## Camadas (resumo)
[1 parágrafo + link pra .claude/rules/layers.md]

## Regras críticas
[5-8 bullets sintéticos + link pra rule completa]

## Route groups
[tabela compacta]

## Test e build
[4 comandos]

## Abstrações disponíveis
[1 linha + link pra .claude/rules/abstractions.md]
```

Sem multi-paragrafo. Sem código blob (link pra rule file). Updates após cada ADR-G big change.

---

## 8. CHANGELOG.md (keepachangelog)

Formato canônico:

```markdown
# Changelog

## [Unreleased]

### Added
- Novo editor inline para landing pages

### Changed
- Bundle budget PWA shell: 170KB → 180KB (ADR-0042)

### Deprecated
- Endpoint `/api/legacy-leads` (ADR-0045)

### Removed
- Tabela `platform.unused_audit` (não tinha consumer há 90 dias)

### Fixed
- Race condition no autosave offline (#issue-71)

### Security
- Rotação Vapid keys (ADR-0048)

## [0.3.0] - 2026-08-12
…
```

**Regras:**
- 1 entrada por mudança user-facing (não cada commit)
- Cita ADR-NNNN ou issue-NN quando aplicável
- Bump version conforme SemVer
- Rodar `pnpm changeset add` antes de PR mergeable

---

## 9. Runbooks — manuais operacionais

`docs/runbooks/<topic>.md`. Owner: fundador (decisão) + Claude Code (transcrição estruturada).

Tópicos dia 0 e M2 (referências em blueprint/12-sprint-plan.md):
- `pacote-a-onboarding.md` — como configurar 1º tenant Pacote A passo-a-passo
- `gateway-debug.md` — como debugar erro de gateway de pagamento (Asaas/Stripe)
- `incident-rls-leak.md` — como responder a leak multi-tenant (test query + audit + rollback)

Cada runbook tem:
- Sintoma
- Diagnóstico (commands)
- Resolução (commands)
- Validação (smoke test)
- Postmortem template

---

## 10. Memória Claude (`~/.claude/projects/.../memory/`)

Owner: Claude Code (auto-update). Revisão: fundador a cada 6 meses.

Tipos (do system memory pattern já vigente neste working dir):
- **user_*.md** — perfil fundador
- **feedback_*.md** — guidance preferences
- **project_*.md** — contexto evolutivo (D-Gs, decisões em formação)
- **reference_*.md** — pointers external (Linear, dashboards, etc)
- **audit_*.md** — reusable prompts

**Decisão pós-bootstrap (CHUNK 7 transferência):** memória do onboarding-bio NÃO migra pro repo desafit. Repo novo terá `~/.claude/projects/<novo-hash>/memory/` virgem. Vocab banido, decisões e padrões vivem em `CLAUDE.md` + `.claude/rules/*` + ADRs, **não** em memória (memória é volátil).

---

## 11. _archive — read-only

`docs/_archive/` recebe (CHUNK 7 transferência):
- `_archive/master-plan-original.md` — master plan 6.631 linhas (referência histórica)
- `_archive/pesquisas/01-16.md` — 16 pesquisas (consulta JIT)
- `_archive/proposta-desafit.html` + `mockup-desafit.png` — canon visual/comercial
- `_archive/memory/` — memórias do onboarding-bio (read-only, não migra ativa)

**Regra:** Claude Code NÃO lê `_archive/*` por padrão. Só lê se fundador apontar explicitamente ("consulte pesquisa 03 pra padrão de prompt"). Resto do tempo ignora.

---

## 12. Auto-gen vs manual

| Doc | Manual | Auto-gen |
|---|---|---|
| `00-PROJETO.md` | ✅ | — |
| ADRs | ✅ rascunho | — |
| `adr/README.md` índice | — | ✅ `pnpm adr:index` |
| Blueprints | ✅ | — |
| `.claude/rules/*` | ✅ | — |
| CLAUDE.md | ✅ | — |
| CHANGELOG.md | ✅ entrada | — |
| `tsconfig.json` doc | — | gerado por config |
| Schema reference | — | `mcp__supabase__generate_typescript_types` |
| Storybook (Ladle) | ✅ stories | catálogo auto-renderizado |
| Component docs | — | TSDoc inline + Ladle MDX |

---

## 13. Hierarquia de leitura — quando Claude Code precisa decidir

Pergunta: "qual padrão usar pra X?". Ordem de busca:

1. `CLAUDE.md` (sempre carregado) — visão geral aponta arquivos canônicos
2. `.claude/rules/<topic>.md` (carrega via `paths:` se editou file que casa)
3. `docs/adr/*` — grep pela decisão (`grep -i "schema" docs/adr/`)
4. `docs/blueprint/*` — referência técnica
5. `docs/_archive/*` — só se fundador apontar

Se 2 fontes conflitarem: ADR > Blueprint > Master Plan (arquivado) > Memória.

---

## 14. Referências cruzadas

- `00-PROJETO.md` §6 (regras de doc) · §8 (princípio universal busca)
- `_CONFLITOS.md` #17 (ADR Michael Nygard) · #18 (hierarquia fonte verdade)
- `13-lint-enforcement.md` (allowlist registrada em ADR)
- `15-bootstrap-checklist.md` (geração inicial dos docs)
- `16-claude-code.md` (CLAUDE.md root + .claude/rules/*)
- `18-transferencia.md` (memória NÃO migra; archive read-only)
- Pesquisa 13 (doc lifecycle)
- Memórias: `project_desafit_implementation_order_2026_05_17` (doc lifecycle entries)

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — ADR per-arquivo + ownership + tamanhos + auto-gen | Leandro |
