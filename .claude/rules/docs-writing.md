---
name: Docs writing — qual tipo de info vai em qual arquivo
description: Mapa de discovery + escrita pra docs do projeto. Ativa quando Claude pra criar/atualizar arquivo .md em docs/, CLAUDE.md, CHANGELOG.md. Sem isso Claude futuro espalha info em lugar errado e perde insights.
paths:
  - 'docs/**/*.md'
  - 'CLAUDE.md'
  - 'CHANGELOG.md'
  - '.claude/rules/*.md'
---

## Princípio

Cada tipo de info tem **um lugar canônico**. Misturar = info perdida + Claude futuro não acha.

**Regra de ouro:** antes de escrever doc, decidir o TIPO. Tipo errado = info órfã.

## Mapa de tipo → arquivo

| Tipo de info                                       | Arquivo canônico                                   | Quando usar                                                                |
| -------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| **Constituição do projeto** (regra imutável)       | `docs/blueprint/00-PROJETO.md`                     | Decisão fundadora (brand strategy, multi-vertical, etc). Raramente muda    |
| **Decisão arquitetural cravada**                   | `docs/adr/NNNN-{topic}.md` (Michael Nygard format) | One-way door (schema, vocab banido, stack travado, RLS strategy)           |
| **Spec técnica detalhada**                         | `docs/blueprint/NN-{topic}.md`                     | Data model, design system tabelas, AI prompts, PWA, roadmap                |
| **Plano executável atual**                         | `docs/plans/{NOME-DO-PLANO}.md`                    | "O que estamos construindo + decisões consolidadas dessa fase"             |
| **Plano arquivado (referência)**                   | `docs/plans/{NOME-DO-PLANO-ANTERIOR}.md`           | Mantém pra cross-reference, marca status no header                         |
| **Pesquisa externa autoritativa**                  | `docs/research/NN-{topic}.md`                      | Resultado de pesquisa profunda (Claude Desktop / web research)             |
| **Reflexão em curso, não-decidido ainda**          | `docs/_sessions/YYYY-MM-DD-{topic}.md`             | Insights soltos, "thinking out loud", contexto pra sobreviver compactação  |
| **Log cronológico de mudanças**                    | `CHANGELOG.md`                                     | Keep a Changelog format. 1 entrada por mudança user-facing                 |
| **Status corrente do projeto**                     | `docs/_status.md`                                  | "Em que ponto está agora" — atualizado em milestones                       |
| **Discovery cross-cutting (loaded sempre)**        | `CLAUDE.md`                                        | Stack travado, regras críticas, ponteiros pros outros arquivos             |
| **Memória cross-sessão (insight persistente)**     | `~/.claude/.../memory/*.md`                        | Feedback do user, preferências, projeto state-of-mind                      |
| **Regra path-loaded (carrega quando edita match)** | `.claude/rules/{slug}.md`                          | Convenção que só importa em certos paths (forms-engine em lib/forms/, etc) |
| **Histórico arquivado (não-ativo)**                | `docs/_archive/`                                   | Onboarding-bio + master plans antigos. Referência JIT, não-discovery       |
| **Migrations doc**                                 | `docs/migrations/NNNN_{nome}.md`                   | Cada migration aplicada via MCP ganha doc explicativa                      |

## Fluxograma de decisão

```
Estou pra escrever doc — que tipo?

1. É decisão arquitetural one-way door (schema, vocab, stack)?
   → ADR (docs/adr/NNNN-*.md). Cita em CLAUDE.md + plano.

2. É spec técnica detalhada (data model, design tokens, AI prompts)?
   → Blueprint (docs/blueprint/NN-*.md).

3. É "o que vamos construir + decisões consolidadas dessa fase"?
   → Plano ativo (docs/plans/{NOME}.md).

4. É resultado de pesquisa profunda (Claude Desktop, web)?
   → Research (docs/research/NN-{topic}.md). Numerar sequencial.

5. É reflexão em curso, "thinking out loud", insight não-cravado?
   → Session reflection (docs/_sessions/YYYY-MM-DD-{topic}.md).
   PORQUE existe: pra Claude futuro abrir sessão e recuperar contexto
   que ainda não virou decisão. Sobrevive compactação de contexto.

6. É evento cronológico ("aplicamos migration X em Y", "feature Z shipou")?
   → CHANGELOG.md, seção [Unreleased] ou [vN.N.N].

7. É "em que ponto o projeto está agora"?
   → docs/_status.md (atualizar em milestones).

8. É convenção de código que SÓ importa em certos paths?
   → .claude/rules/{slug}.md (com path-loading via frontmatter).

9. É feedback do user / preferência cross-sessão?
   → Memory file ~/.claude/.../memory/*.md (via auto-memory system).

10. É info de migration aplicada?
    → docs/migrations/NNNN_{nome}.md (espelha migration via MCP).
```

## Quando atualizar CLAUDE.md

CLAUDE.md auto-carrega TODA sessão. Atualizar quando:

- Nova `.claude/rules/*.md` criada → adicionar bullet na lista path-loaded
- Stack version bump major → atualizar lista travada
- Plano ativo mudou (`docs/plans/X.md` → `docs/plans/Y.md`) → atualizar tabela
- Nova pesquisa autoritativa entrou → adicionar à tabela
- Pasta nova relevante (ex: `docs/_sessions/` ganhou ativos) → adicionar à tabela
- Decisão crítica que afeta toda sessão → bullet em "Regras críticas (toda sessão)"

**NÃO atualizar CLAUDE.md** pra:

- Mudança de plano interno de uma feature (vai no plano)
- Decisão técnica isolada (vai em ADR)
- Insight em-curso (vai em session)
- Mudança incremental (vai em CHANGELOG)

## Hierarquia em caso de conflito

`docs/blueprint/00-PROJETO.md` (constituição) > ADR > Plano ativo > Memória > Session reflection.

Conflito entre research e decisão: research é INSUMO; decisão é OUTPUT.
Quando decidir contra a research, registrar no plano ("apesar de research X
sugerir Y, optamos por Z porque ...").

## Gatilhos pra criar session reflection

Criar `docs/_sessions/YYYY-MM-DD-{topic}.md` quando:

1. **Inflexão estratégica em discussão** mas ainda não-decidida (ex: "talvez mudar template×palette architecture")
2. **Insight cross-cutting** que não cabe em rule/ADR específica
3. **Mudança de rumo no plano** sendo considerada
4. **Contexto rico que vai virar decisão futura** mas hoje é só reflexão
5. **Antes de pesquisa externa profunda** — captura o "estado mental" antes do resultado voltar
6. **Sessão longa com muitos micro-decisões** que valem agregar

Formato sugerido (não obrigatório):

```markdown
# Sessão YYYY-MM-DD — {topic curto}

> **Tipo:** reflexão em curso (não-decidido). Não é ADR.
> **Captura:** insights estratégicos da sessão pra sobreviver compactação.
> Quando virar decisão cravada, promover pra ADR ou seção do plano.

## 1. {tópico de reflexão}

...

## N. Insights soltos pra futuro

- ...
- ...
```

## Anti-patterns

| Anti-pattern                                       | Por que ruim                                 | Substituto                                      |
| -------------------------------------------------- | -------------------------------------------- | ----------------------------------------------- |
| Inflar CLAUDE.md com decisão específica de feature | CLAUDE.md vira massa, perde "always loaded"  | Decisão específica vai em rule ou ADR           |
| Decisão arquitetural só no commit message          | Some no `git log -p` quando alguém atualizar | ADR + cita commit hash                          |
| Session reflection virando plano                   | Plano ativo precisa estar limpo              | Promover insights cravados pra §0.X do plano    |
| Research escondida em pasta sem index              | Claude futuro não acha                       | Numerar sequencial (NN-\*) + citar em CLAUDE.md |
| Plano arquivado deletado                           | Histórico perdido                            | Marcar `Status: archived` no header             |
| Inventar nova pasta sem registrar em CLAUDE.md     | Discovery quebra                             | Adicionar à tabela "Onde fica cada coisa"       |
| Memory file fora do MEMORY.md index                | Claude futuro não vê                         | Adicionar ponteiro em `memory/MEMORY.md`        |

## Condição de revisitar esta rule

| Gatilho                                              | Ação                                                      |
| ---------------------------------------------------- | --------------------------------------------------------- |
| **Novo tipo de doc surge** (ex: post-mortems, RFCs)  | Adicionar linha na tabela + fluxograma                    |
| **Hierarquia de conflito muda**                      | Atualizar seção "Hierarquia em caso de conflito"          |
| **Convenção de naming muda** (ex: ADRs em formato Y) | Atualizar formato canônico + propagar pra docs existentes |
| **`docs/_sessions/` cresce sem usar** (3+ meses sem) | Considerar deprecar formato ou promover pattern           |

## Referências

- `CLAUDE.md` — discovery cross-cutting
- `docs/_sessions/2026-05-19-design-rethink-mcp-scaffold.md` — primeiro exemplo de session reflection (este projeto)
- ADR-0017 — Michael Nygard format pros ADRs
- Keep a Changelog — https://keepachangelog.com/en/1.1.0/
