# Estrutura de Documentos — onboarding.bio

> Qual documento faz o que, o que criar, o que manter, hierarquia de autoridade.
> **Criado:** 2026-05-01

---

## 1. Hierarquia de autoridade

```
CLAUDE.md (raiz)              ← Contrato supremo. Carregado automaticamente.
  ↓
.claude/rules/*.md            ← Regras por camada. Carregadas por path.
  ↓
docs/core/REGRAS-PADRONIZACAO.md  ← Lei completa. Referencia humana e IA.
  ↓
docs/refatoracao-2026-05/*.md ← Pesquisas e planos. Referencia de execucao.
  ↓
docs/core/*.md                ← Arquitetura, decisoes, schema, copy.
  ↓
docs/produto/design/*.md      ← Design system, guia fundacao, mapeamento.
```

**Se dois docs divergem:** o de cima vence. Se CLAUDE.md diz X e guia fundacao diz Y, CLAUDE.md vence.

---

## 2. Documentos que existem

### Nivel 1 — Carregados automaticamente pelo Claude Code

| Documento            | Onde           | Carregamento             | Funcao                                                                 |
| -------------------- | -------------- | ------------------------ | ---------------------------------------------------------------------- |
| `CLAUDE.md`          | Raiz           | Automatico (toda sessao) | Contrato supremo: stack, camadas, padroes, route groups, where-to-look |
| `.claude/rules/*.md` | .claude/rules/ | Automatico (por path)    | Regras especificas por tipo de arquivo                                 |

### Nivel 2 — Referencia core (ler antes de qualquer task)

| Documento                          | Onde       | Funcao                                                |
| ---------------------------------- | ---------- | ----------------------------------------------------- |
| `docs/core/architecture.md`        | docs/core/ | Estrutura de pastas, camadas, decisoes arquiteturais  |
| `docs/core/schema.md`              | docs/core/ | Tabelas, RPCs, Edge Functions, seguranca              |
| `docs/core/decisions.md`           | docs/core/ | Decisoes fechadas (D1-D112). Nao revisitar.           |
| `docs/core/copy-positioning.md`    | docs/core/ | Tom de voz, palavras proibidas                        |
| `docs/core/design-reference.md`    | docs/core/ | Principios UI/UX, Nielsen, breakpoints, touch targets |
| `docs/core/REGRAS-PADRONIZACAO.md` | docs/core/ | **NOVO.** Lei completa de padronizacao                |

### Nivel 3 — Design system

| Documento                                                         | Onde                 | Funcao                                                                 |
| ----------------------------------------------------------------- | -------------------- | ---------------------------------------------------------------------- |
| `docs/produto/design/guia_fundacao_design.md`                     | docs/produto/design/ | Design system: tokens, componentes, tipografia, shape, density, motion |
| `docs/produto/design/SHADCN-MAPEAMENTO.md`                        | docs/produto/design/ | Inventario shadcn: instalar, deletar, manter                           |
| `docs/produto/design/onboarding_bio_design_system_prototype.html` | docs/produto/design/ | Prototipo de referencia visual                                         |

### Nivel 4 — Planos e execucao

| Documento                                         | Onde                   | Funcao                    |
| ------------------------------------------------- | ---------------------- | ------------------------- |
| `docs/plano-lancamento/MVP-CAPTACAO-CHECKLIST.md` | docs/plano-lancamento/ | Checklist MVP completo    |
| `docs/plano-lancamento/PLAYBOOK-MVP.md`           | docs/plano-lancamento/ | Execucao fase por fase    |
| `docs/plano-lancamento/PLANO_LANCAMENTO.md`       | docs/plano-lancamento/ | Plano geral de lancamento |
| `docs/plano/AUDITORIA-2026-04-28.md`              | docs/plano/            | Debitos tecnicos abertos  |
| `docs/plano/REPLAN-DESAFIOS.md`                   | docs/plano/            | Direcao atual             |

### Nivel 5 — Refatoracao (NOVA pasta)

| Documento                                                     | Onde         | Funcao                            |
| ------------------------------------------------------------- | ------------ | --------------------------------- |
| `docs/refatoracao-2026-05/README.md`                          | refatoracao/ | Indice da refatoracao             |
| `docs/refatoracao-2026-05/01-shadcn-mapeamento.md`            | refatoracao/ | Copia do mapeamento shadcn        |
| `docs/refatoracao-2026-05/02-regras-padronizacao.md`          | refatoracao/ | Copia das regras                  |
| `docs/refatoracao-2026-05/03-estrategias-lint.md`             | refatoracao/ | Plugins, regras, pipeline         |
| `docs/refatoracao-2026-05/04-claude-code-automation.md`       | refatoracao/ | Hooks, skills, agents, rules      |
| `docs/refatoracao-2026-05/05-mcps-extensions-clitools.md`     | refatoracao/ | MCPs, VS Code, CLI tools          |
| `docs/refatoracao-2026-05/06-estrutura-documentos.md`         | refatoracao/ | Este documento                    |
| `docs/refatoracao-2026-05/07-guia-fundacao-design.md`         | refatoracao/ | **PENDENTE** — guia reescrito     |
| `docs/refatoracao-2026-05/08-plano-refatoracao-horizontal.md` | refatoracao/ | **PENDENTE** — plano de execucao  |
| `docs/refatoracao-2026-05/09-mobile-app-design.md`            | refatoracao/ | **PENDENTE** — UI mobile app-like |

---

## 3. O que NAO precisa de documento separado

| Tentacao               | Por que nao                 | Onde fica                                   |
| ---------------------- | --------------------------- | ------------------------------------------- |
| `PATTERNS.md` separado | Cria drift com CLAUDE.md    | Patterns ficam no CLAUDE.md e guia fundacao |
| `CONTRIBUTING.md`      | Pre-lancamento, solo dev    | Criar so quando onboardar outros devs       |
| ADR por arquivo        | Overkill pra equipe pequena | decisions.md com numeracao D{N}             |
| `CHANGELOG.md`         | Git log e a verdade         | `git log --oneline`                         |
| `TODO.md`              | Fica desatualizado          | MVP checklist + tasks no Claude Code        |
| Doc de API separado    | Schema.md ja cobre          | schema.md + types TypeScript                |

---

## 4. Regra de manutencao

### Quando atualizar cada doc

| Evento                           | Docs a atualizar                                                     |
| -------------------------------- | -------------------------------------------------------------------- |
| Nova decisao arquitetural        | `decisions.md` (novo D{N})                                           |
| Novo componente shadcn instalado | `SHADCN-MAPEAMENTO.md` + `guia_fundacao_design.md`                   |
| Nova regra de lint               | `03-estrategias-lint.md` + `eslint.config.mjs`                       |
| Nova camada/pasta                | `CLAUDE.md` (camadas) + `architecture.md`                            |
| Novo MCP/tool                    | `05-mcps-extensions-clitools.md`                                     |
| Refatoracao concluida            | `CLAUDE.md` + `REGRAS-PADRONIZACAO.md` + `MVP-CAPTACAO-CHECKLIST.md` |
| Feature nova                     | `MVP-CAPTACAO-CHECKLIST.md` se MVP, `PLANO_LANCAMENTO.md` se pos-MVP |

### Revisao trimestral

- Deletar docs obsoletos (planos concluidos, pesquisas implementadas)
- Verificar que CLAUDE.md reflete estado real
- Verificar que decisions.md tem todas as decisoes
- Verificar que regras de lint estao no eslint.config.mjs real

---

## 5. Fluxo de uso dos docs

### Ao comecar uma sessao Claude Code

```
1. CLAUDE.md carrega automaticamente (contexto do projeto)
2. .claude/rules/*.md carregam por path (regras da camada)
3. Se precisar: "leia docs/core/REGRAS-PADRONIZACAO.md"
4. Se precisar de DS: "leia docs/produto/design/guia_fundacao_design.md"
5. Se for refatoracao: "leia docs/refatoracao-2026-05/README.md"
```

### Ao criar algo novo

```
1. Consultar REGRAS-PADRONIZACAO.md (hierarquia de componentes, limites)
2. Consultar SHADCN-MAPEAMENTO.md (shadcn tem?)
3. Consultar guia_fundacao_design.md (tokens, patterns)
4. Seguir checklist de tela nova (§13 das regras)
5. Rodar lint + tsc + vitest antes de commitar
```

### Ao refatorar

```
1. Ler plano-refatoracao-horizontal.md (fase correta)
2. Seguir estrategias-lint.md (regras a aplicar)
3. Atualizar CLAUDE.md + decisions.md se algo mudar
```
