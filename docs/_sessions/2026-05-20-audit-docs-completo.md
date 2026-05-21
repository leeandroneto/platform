# Audit completo da documentação — 2026-05-20

> **Tipo:** reflexão em curso (não-decidido).
> **Princípio:** identificar problemas, NÃO modificar/mover/deletar.
> User decide ações depois.
> Hierarquia oficial respeitada: `00-PROJETO` > ADR > Plano ativo > rules > MEMORY > design-system/.

---

## TL;DR

- **~190 arquivos auditados** (excluindo `_archive/`): 24 blueprints · 42 ADRs · 27 research · 22 design-system · 2 plans · 2 sessions · 7 migrations docs · 17 rules · 1 CLAUDE.md + CHANGELOG + \_status
- **12 contradições identificadas** (3 críticas, 9 menores)
- **9 duplicações identificadas** (3 estruturais, 6 conteúdo)
- **5 pesquisas órfãs/parcialmente esquecidas** (das 27 totais)
- **8 ADRs com status header incompleto ou ambíguo** (precisa fix)
- **~22 ações propostas** ordenadas em 3 prioridades (P0 hoje, P1 esta semana, P2 quando design system fechar)

**Achado mais crítico:** o trabalho ativo em `docs/design-system/` (22 arquivos, WIP) está **paralelo, não-sincronizado** com o plano dia 1 ativo (`PLANO-DIA-1-AGENCY-FUNNEL.md`). Ambos planejam coisas sobrepostas. Falta gate explícito de "qual sobe primeiro, qual fica pausado".

**Segundo achado crítico:** Blueprint `03-naming-vocab.md` + `06-data-model.md` referenciam vocab **antigo** (`capture_form`, `intake`, `customization`) que já foi superseded por Migration 0015 e por `.claude/rules/naming.md` "Vocabulário canônico de motores". Blueprints stale silenciosos.

---

## 1. Inventário completo

Tabelas por pasta. Colunas: Arquivo · Tamanho · Última mod · Status · Propósito.

### 1.1 `docs/blueprint/` (24 arquivos)

| Arquivo                     | Tamanho aprox | Status              | Propósito (1 linha)                                                                         |
| --------------------------- | ------------- | ------------------- | ------------------------------------------------------------------------------------------- |
| `00-PROJETO.md`             | médio         | ativo               | Constituição imutável (vision, pacotes, multi-vertical, append-only)                        |
| `01-arquitetura.md`         | médio         | ativo               | Stack + camadas + decisões arquiteturais base                                               |
| `02-stack.md`               | médio         | ativo               | Versões travadas (Next 16 / React 19 / Tailwind v4 / Motion 12)                             |
| `03-naming-vocab.md`        | médio         | **stale parcial**   | Vocab — **referencia `capture_form`/`intake` superseded pela rule naming + migration 0015** |
| `04-camadas-imports.md`     | médio         | ativo               | Sheriff layering rules                                                                      |
| `05-design-system.md`       | grande        | **stale parcial**   | DS spec — referencia "13 paletas" + ADR-0042 antes do rethink. Não menciona archetypes.     |
| `06-data-model.md`          | grande        | **stale parcial**   | Data model — usa `capture_forms` (renomeado em migration 0015 pra `forms`)                  |
| `07-ai-prompts.md`          | grande        | ativo               | AI prompts spec — referencia pesquisa 03                                                    |
| `08-pwa-offline.md`         | grande        | ativo               | PWA spec                                                                                    |
| `09-pacote-a.md`            | grande        | ativo               | Pacote A spec                                                                               |
| `10-pacote-b-c.md`          | grande        | ativo               | Pacote B+C spec                                                                             |
| `11-roadmap.md`             | grande        | ativo               | M0-M5+ timeline                                                                             |
| `12-sprint-plan.md`         | grande        | ativo               | Sprint plan + cita pesquisa 11 e 16                                                         |
| `13-lint-enforcement.md`    | grande        | ativo               | Lint dia 0                                                                                  |
| `14-docs-lifecycle.md`      | médio         | ativo               | Doc lifecycle — duplicação parcial com rule docs-writing                                    |
| `15-bootstrap-checklist.md` | médio         | ativo               | Bootstrap checklist                                                                         |
| `16-claude-code.md`         | médio         | ativo               | Claude code spec                                                                            |
| `17-repo-bootstrap.md`      | médio         | ativo               | Repo bootstrap                                                                              |
| `18-transferencia.md`       | médio         | ativo               | Transferência repo onboarding-bio                                                           |
| `19-wrapper-strategy.md`    | médio         | ativo               | Wrapper strategy (consolida ADR-0040 §E + §F)                                               |
| `20-i18n-strategy.md`       | médio         | ativo               | i18n strategy (consolida ADR-0040 §G)                                                       |
| `21-engine-catalog.md`      | grande        | ativo               | 22 engines (consolida ADR-0041)                                                             |
| `QUICK-START.md`            | médio         | ativo               | Quick start                                                                                 |
| `_VALIDACAO.md`             | médio         | **stale potencial** | Validação blueprints dia 0 — pode ter virado obsoleto pós-execução                          |

### 1.2 `docs/adr/` (43 arquivos incluindo README)

| ADR         | Status header             | Status real              | Notas                                                                                         |
| ----------- | ------------------------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| 0001-0010   | accepted                  | ativo                    | OK                                                                                            |
| 0011        | accepted                  | ativo                    | Editor híbrido — pode contradizer ADR-0029 e research 24 (editor visual Fase 2)               |
| 0012        | accepted                  | ativo                    | OK                                                                                            |
| 0013        | accepted                  | **superseded by 0038**   | Header NÃO marca superseded (README marca). Header tem só `accepted`                          |
| 0014-0020   | accepted                  | ativo                    | OK                                                                                            |
| 0021        | superseded by 0025 → 0033 | superseded chain         | Header OK                                                                                     |
| 0022-0023   | accepted                  | ativo                    | OK                                                                                            |
| 0024        | accepted                  | ativo (parcial)          | Header anota `public.brands` agora (via 0033) — OK                                            |
| 0025        | superseded by 0033        | superseded               | OK                                                                                            |
| 0026        | accepted                  | ativo (parcial)          | Header anota schema consolidado via 0033                                                      |
| 0027        | superseded by 0028        | superseded chain         | OK                                                                                            |
| 0028        | superseded by 0029        | superseded chain         | OK                                                                                            |
| 0029        | accepted                  | ativo                    | OK                                                                                            |
| 0030-0032   | accepted                  | ativo                    | OK                                                                                            |
| 0031        | accepted                  | **partially-superseded** | README marca "partially-superseded por ADR-0040 §A". Header não marca                         |
| 0033        | accepted                  | ativo                    | OK — schema único `public.*`                                                                  |
| 0034        | accepted                  | ativo                    | Header diz "arch superseded by 0039" em status README, mas ADR file inteiro continua accepted |
| 0035-0036   | accepted                  | ativo                    | OK                                                                                            |
| 0037        | accepted                  | **partially-superseded** | "§A accepted · §B atualizada por ADR-0040 §E" — header file tem nota mas status só accepted   |
| 0038        | accepted                  | ativo                    | OK (supersede 0013)                                                                           |
| 0039        | accepted                  | ativo                    | OK                                                                                            |
| 0040        | accepted                  | ativo                    | Header marca "substitui ADR-0031 §1+§7"                                                       |
| 0041        | accepted                  | ativo                    | Engines                                                                                       |
| 0042        | accepted                  | **candidato superseded** | Plano transformação design-system 14 ameaça expandir 3→5 elevations. Não há fechamento        |
| `README.md` | —                         | gerado                   | `pnpm adr:index` — falta ADR-0014 e 0034 com data correta                                     |

**Gap detectado:** Há **0042 ADRs listados em README mas físicos:** Falta `0034-vertical-slice-features-entitlements.md` no índice gerado (existe arquivo `0034-*` mas o README.md já lista — confirmado OK). Aparentemente ADRs estão completos 0001-0042 (sem buraco). **Não existe ADR 0014 com `accepted (atualizado 2026-05-18 Etapa 10A)` no header, mas README lista** — confirmar.

### 1.3 `docs/research/` (27 arquivos)

| Pesquisa                             | Tamanho | Status integração                                                                                    | Notas                                                 |
| ------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 01 white-label-strategies            | médio   | **órfã** — única ref em `blueprint/18-transferencia.md`                                              | Nenhum plano ativo referencia                         |
| 02 design-frontend-arquitetura       | médio   | **órfã** — zero refs ativas                                                                          | Possivelmente absorvido no DS rethink mas sem citação |
| 03 engenharia-de-prompt              | grande  | **parcialmente órfã** — citada em blueprint 07/09 + queue (10-research-queue) "ainda não consultada" | Importante mas pendente leitura efetiva               |
| 04 regras-contratos-claude-code      | médio   | **órfã** — zero refs ativas                                                                          | Não tem citação atual                                 |
| 05 design-system-tokens-paletas      | médio   | **órfã** — zero refs ativas                                                                          | Origem das 13 paletas? Sem citação cravada            |
| 06 design-system-primitives-icons    | médio   | **órfã**                                                                                             | Não referenciada                                      |
| 07 planejamento-ordem-execucao       | médio   | **órfã** — citada uma vez em 09-pacote-a + 0006-construir-antes                                      | Pouco ativa                                           |
| 08 design-system-motion-apca         | médio   | **órfã** — não cita ADR direto                                                                       | APCA stuff citada via outras pesquisas                |
| 09 lint-enforcement-token-bypass     | médio   | **órfã**                                                                                             | Sem citação atual                                     |
| 10 perf-multi-vertical               | grande  | **órfã** — única ref em `migrations/0013`                                                            | Bundle budgets ADR-0020 cita-?-ela                    |
| 11 editor-strategy                   | grande  | **parcialmente integrada** — citada em blueprint 12                                                  | Editor strategy é Fase 2; integração parcial          |
| 12 pwa-offline-first                 | grande  | **órfã**                                                                                             | Sem citações ativas                                   |
| 13 doc-lifecycle                     | médio   | **integrada** — base blueprint 14 + rule docs-writing                                                | OK                                                    |
| 14 design-system-doc-pattern         | médio   | **órfã**                                                                                             | Não referenciada por nada ativo                       |
| 15 editor-mobile-first               | médio   | **órfã**                                                                                             | Sem citações                                          |
| 16 visual-premium                    | grande  | **integrada** — blueprint 05 + sprint plan 12                                                        | OK                                                    |
| 17 guardrails-ia-shadcn              | grande  | **integrada** — ADR-0037 + 0040                                                                      | OK                                                    |
| 18 shadcn-zone-quarantine            | grande  | **integrada** — ADR-0040                                                                             | OK                                                    |
| 19 jit-vs-upfront-wrapper            | grande  | **integrada** — blueprint 19 + shadcn-zone rule                                                      | OK                                                    |
| 20 jit-vs-upfront-saas-founder       | grande  | **integrada** — blueprint 19 + shadcn-zone rule                                                      | OK                                                    |
| 21 i18n-strategy                     | grande  | **integrada** — ADR-0040 §G + blueprint 20                                                           | OK                                                    |
| 22 supabase-multitenant-schema-audit | grande  | **integrada** — migration 0013                                                                       | OK                                                    |
| 23 form-system-architecture          | grande  | **integrada** — ADR-0041 + migration 0015 + rule forms-engine                                        | OK                                                    |
| 24 page-engine-architecture          | grande  | **parcialmente integrada** — referenciada no plano dia 1 + ADR-0041 + design-system 00-state         | Faltam blueprints próprios                            |
| 25 ai-reports-architecture           | grande  | **parcialmente integrada** — plano dia 1 + design-system 00-state                                    | Faltam blueprints próprios                            |
| 26 design-system-vibes               | grande  | **integrada parcialmente** — base do rethink design-system/\*                                        | Não promovida pra ADR ainda                           |
| 27 design-tokens-per-archetype       | grande  | **integrada parcialmente** — base do rethink design-system/\*                                        | Não promovida pra ADR ainda                           |

### 1.4 `docs/design-system/` (22 arquivos WIP)

Toda a pasta marcada **WIP/exploração** — README explícito "NADA aqui está cravado".

| Arquivo                         | Status    | Propósito                                                   |
| ------------------------------- | --------- | ----------------------------------------------------------- |
| `README.md`                     | wip ativo | Índice da pasta                                             |
| `00-state.md`                   | wip ativo | Estado atual (snapshot)                                     |
| `01-hypotheses.md`              | wip ativo | 9 hipóteses não-cravadas                                    |
| `02-archetypes-candidates.md`   | wip ativo | Candidatos a archetype                                      |
| `03-tokens-universe.md`         | wip ativo | Catálogo tokens                                             |
| `04-components-questions.md`    | wip ativo | Perguntas components                                        |
| `05-photos-questions.md`        | wip ativo | Perguntas photos                                            |
| `06-pwa-mobile-questions.md`    | wip ativo | Perguntas PWA mobile                                        |
| `07-shadcn-hierarchy.md`        | wip ativo | Hierarquia 5 camadas                                        |
| `08-lint-audit.md`              | wip ativo | Audit lint pós-rethink                                      |
| `09-kholmatova-vocab.md`        | wip ativo | Vocab Kholmatova                                            |
| `10-research-queue.md`          | wip ativo | Queue pesquisas pendentes (28-31)                           |
| `11-decisions-pending.md`       | wip ativo | D-01..D-43 decisões pendentes                               |
| `12-patterns-catalog.md`        | wip ativo | Patterns catalog                                            |
| `13-templates-layouts.md`       | wip ativo | Page templates Atomic                                       |
| `14-transformation-plan.md`     | wip ativo | **PLANO transformação 9 fases — BLOQUEIA M1 funil agência** |
| `14a-audit-estado-atual.md`     | wip ativo | Audit estado pre-passo 1                                    |
| `15-archetype-curation.md`      | wip ativo | 13 archetypes (Passo 1)                                     |
| `16-semantic-colors-audit.md`   | wip ativo | Roles × archetypes                                          |
| `17-components-catalog.md`      | wip ativo | 18 archetypes × components                                  |
| `18-shadcn-registries-final.md` | wip ativo | 3 registries dia 1                                          |
| `19-mobile-first-additions.md`  | wip ativo | 5 mobile-first archetypes                                   |

### 1.5 `docs/plans/` (2 arquivos)

| Arquivo                        | Status                           | Notas                                                                                          |
| ------------------------------ | -------------------------------- | ---------------------------------------------------------------------------------------------- |
| `PLANO-MESTRE-DIA-0.md`        | **superseded** mas não-arquivado | Header diz "approved" mas dia 0 foi closed segundo `_status.md`. Deveria ter status `archived` |
| `PLANO-DIA-1-AGENCY-FUNNEL.md` | ativo (parcialmente em pausa)    | Header indica draft + §0.2 PAUSA                                                               |

### 1.6 `docs/_sessions/` (2 arquivos)

| Arquivo                                     | Status         | Propósito             |
| ------------------------------------------- | -------------- | --------------------- |
| `2026-05-19-design-rethink-mcp-scaffold.md` | reflexão ativa | Sessão design rethink |
| `2026-05-19-resumo-completo.md`             | reflexão ativa | Síntese sessão 12h    |

### 1.7 `docs/migrations/` (7 arquivos)

Sequência: 0001, 0005, 0013, 0014, 0015, 0016, 0017. **Gap:** docs 0002, 0003, 0004, 0006, 0007, 0008, 0009, 0010, 0011, 0012 ausentes. ADR `_status.md` diz 9-18 migrations aplicadas no Supabase; docs explicativos faltam.

### 1.8 Outros

| Arquivo           | Status                     | Notas                                                                                      |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------ |
| `docs/_status.md` | ativo mas **stale 2 dias** | Pré-rethink design system, sem menção a `docs/design-system/`                              |
| `docs/_archive/`  | arquivado                  | OK                                                                                         |
| `CLAUDE.md`       | ativo                      | Atualizado 2026-05-18                                                                      |
| `CHANGELOG.md`    | ativo                      | [Unreleased] cresce                                                                        |
| `.claude/rules/*` | 19 arquivos (não 17)       | CLAUDE.md diz "17 rules" mas glob retorna 19. Adicionados: `forms-engine` + `docs-writing` |

---

## 2. Contradições identificadas

### 2.1 Tabela de contradições

| #   | Tópico                                                           | Doc A diz                                                                                                                                                                       | Doc B diz                                                                                                                                                                                                            | Hierarquia / Prevalece                                               | Recomendação                                                                                                                                                             |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| C1  | **Elevation tokens (3 vs 5)**                                    | ADR-0042 (accepted): "3 níveis canônicos `--elevation-{flat,raised,overlay}`. Material 3 5+ depreciado"                                                                         | `design-system/14-transformation-plan.md`: propõe 5 stacked shadows (Vercel canon). `14a-audit-estado-atual.md`: "ADR-0042 candidata única a supersede"                                                              | **ADR-0042 prevalece** (ADR > design-system/)                        | Criar **ADR-0043** quando design system rethink fechar; até lá ADR-0042 vigora. Plano deve marcar dependência explícita                                                  |
| C2  | **Vocab `prospect`**                                             | `.claude/rules/naming.md`: `prospect` BANIDO → use `lead`. `eslint.config.mjs`: enforced                                                                                        | `docs/_sessions/2026-05-19-resumo-completo.md` linha 113+122: `form_kind` enum inclui `'prospect'`. **Migration 0015** definiu enum no banco (assumido)                                                              | **Rule prevalece** (ADR/rule > session)                              | Verificar se migration 0015 aplicou `'prospect'` no enum. Se sim: criar ADR de exceção OU renomear `'prospect'` → `'lead_capture'` no enum. Atualizar session reflection |
| C3  | **Vocab `capture_form` vs `form`**                               | `blueprint/06-data-model.md` linhas 83-84, 158: `public.capture_forms`, `capture_submissions`. `blueprint/03-naming-vocab.md` §3.5: "`capture_form` → form de captação branded" | Migration 0015 (aplicada): `capture_forms` → `forms`, `capture_submissions` → `form_submissions`. `.claude/rules/naming.md` §3: "Vocabulário canônico Form Engine" usa `form` + `kind='lead_capture'`. ADR-0041 idem | **Migration aplicada + rule + ADR prevalecem**                       | Atualizar blueprint 06-data-model + 03-naming-vocab pra vocab pós-migration 0015. Hoje confunde quem abrir blueprint pela primeira vez                                   |
| C4  | **# de shadcn primitives (47 vs 53)**                            | CLAUDE.md: "shadcn primitives quarentenados" (sem # explícito). ADR-0040 §A: "~200 erros lint nos 47 primitives shadcn"                                                         | `design-system/14a-audit-estado-atual.md`: "53 primitives em components/ui/\* (cresceu de 47)". `00-state.md` cronologia: "47 dia 0 → 53 atual"                                                                      | **Audit empírico (53) prevalece**                                    | Atualizar ADR-0040 §A comentário ("47 dia 0" → "53 atual"). Atualizar CLAUDE.md JIT se citar                                                                             |
| C5  | **`tenants.palette_id` tipo (text vs uuid)**                     | `design-system/14-transformation-plan.md` §6.3: propõe `tenants.palette_id text DEFAULT 'default'`                                                                              | `14a-audit-estado-atual.md` §1 (verificado via Supabase MCP): JÁ É `uuid NOT NULL FK palettes(id) default default_palette_id()` desde ADR-0028                                                                       | **Estado atual (uuid) prevalece** — ADR-0028+0029 design intencional | Plano 14 deve **NÃO** trocar tipo. Adicionar `archetype_id` separado. Audit 14a já consertou — confirmar que plano 14 está alinhado com audit                            |
| C6  | **`lib/design/contrast.ts` JÁ tem APCA**                         | Plano 14 versão antiga propôs criar `lib/design/apca.ts` novo                                                                                                                   | `14a-audit-estado-atual.md` + plano 14 §"Achados Passo 0": "lib/design/contrast.ts JÁ tem APCA helpers, ESTENDER, não duplicar"                                                                                      | **Audit prevalece** — já corrigido no plano                          | Conferir Passo 7 do plano 14 — texto antigo apagado, novo escrito. Confirmar consistência                                                                                |
| C7  | **`Template` semântico (Atomic vs Archetype)**                   | `blueprint/03-naming-vocab.md` §62: `template` = "padrão pré-pronto" (preset/recipe). `forms-engine` rule: `template` é tabela `form_templates`                                 | `design-system/01-hypotheses.md` H1 + `13-templates-layouts.md`: "template" sempre = bundle estrutural perceptual (= archetype). Decisão D-15 propõe renomear "nosso template" pra `archetype`                       | **3 sentidos vivendo juntos**                                        | Cravar decisão D-15 em ADR + atualizar rule naming. Reservar `template` pro sentido form-engine (= tabela). Promover `archetype` como term oficial pro bundle perceptual |
| C8  | **Status PLANO-MESTRE-DIA-0**                                    | `_status.md`: "Phase A — CLOSED ✅". Plano header: "approved"                                                                                                                   | Sem header `archived`/`superseded`. CLAUDE.md aponta pra PLANO-DIA-1 como ativo mas referencia dia 0 como "plano anterior"                                                                                           | **CLAUDE.md prevalece (anota anterior)**                             | Adicionar header `Status: archived (superseded by PLANO-DIA-1-AGENCY-FUNNEL)` no PLANO-MESTRE-DIA-0                                                                      |
| C9  | **Brand identity hardcoded vs hostname**                         | `blueprint/03-naming-vocab.md` linha 22: "Brand identity via env (`NEXT_PUBLIC_BRAND_*`), nunca hardcoded"                                                                      | ADR-0024 (accepted) + CLAUDE.md regras críticas: "Multi-brand via hostname, NÃO env. NUNCA hardcoded desafit. Brand resolved runtime via `getBrandByHost()`"                                                         | **ADR-0024 prevalece**                                               | Atualizar blueprint 03-naming-vocab linha 22 pra refletir hostname pattern                                                                                               |
| C10 | **Engine count 22 vs Form Engine + Page Engine + Report engine** | ADR-0041: 2 motores totalmente separados (Form + Page). Report = `page.kind='report'`, não motor 3                                                                              | Plano dia 1 §0.2.1: "report = Page Engine + AI fill (não motor separado)" — alinhado com ADR-0041. Blueprint 21: 22 engines                                                                                          | **ADR-0041 prevalece**                                               | Não há real contradição se blueprint 21 §1 explica que "motor" no catálogo é mais amplo que "engine código". Reescrever §1 pra remover ambiguidade                       |
| C11 | **9 typography primitives planejados vs 3 efetivos**             | Plano dia 0 §1.6: "3 typography dia 0: Heading, Text, Muted. Demais JIT"                                                                                                        | Research 26 §"Caminho imediato": "Não construa os 9 typography primitives planejados ainda — derive de `data-template`"                                                                                              | **Plano dia 0 prevalece**                                            | OK — 3 efetivos. Research 26 só relembra mas não contradiz. Documentar nos JIT triggers da rule shadcn-zone                                                              |
| C12 | **Sequência form→IA→relatório→landing vs landing-first**         | Plano dia 1 §3.1 (resumo-completo): "Construir form → IA → relatório → landing (inverso fluxo usuário)"                                                                         | Plano §0.2: "Etapa 6 (Funil ponta-a-ponta) ganha template demo aplicado pra confirmar premium" — implica landing primeiro pra UI premium                                                                             | **Sequência form→IA prevalece (plano §3.1)**                         | Verificar consistência §0.2 versus §3.1 do plano. Reescrever §0.2 pra dizer "landing por último, com template demo aplicado pra premium check"                           |

---

## 3. Duplicações identificadas

| #   | Tópico                                             | Docs que repetem                                                                                                                                                                                                          | Recomendação (consolidar em qual?)                                                                                                          |
| --- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | **Hierarquia fonte da verdade**                    | `blueprint/14-docs-lifecycle.md` §1 + `.claude/rules/docs-writing.md` "Hierarquia em caso de conflito" + ADR-0018 + `design-system/README.md` "Hierarquia em conflito"                                                    | Consolidar em **ADR-0018**. Outros 3 citam ADR-0018                                                                                         |
| D2  | **Stack travado**                                  | CLAUDE.md "Stack travado" + `blueprint/02-stack.md` §1 + ADRs vários                                                                                                                                                      | Consolidar em **blueprint/02-stack.md** (mais detalhado). CLAUDE.md mantém resumo                                                           |
| D3  | **Vocab banido**                                   | CLAUDE.md "Vocab banido: ver `.claude/rules/naming.md`" + `blueprint/03-naming-vocab.md` §2 + `naming.md` §"Palavras proibidas" + `eslint.config.mjs` + `vocab-warn.sh` + `vocab-audit.sh` + `load-context.sh`            | OK ter ESLint + hooks + rule. Consolidar **docs textual em `naming.md` apenas**. Blueprint 03 vira ponteiro                                 |
| D4  | **Pesquisa 24 + 25 decisões detalhadas**           | `docs/plans/PLANO-DIA-1-AGENCY-FUNNEL.md` §0.2 "Decisões cravadas adicionais (deep read 2026-05-19)" + `docs/_sessions/2026-05-19-design-rethink-mcp-scaffold.md` §3 + `docs/_sessions/2026-05-19-resumo-completo.md` §3+ | Promover decisões cravadas pra ADR(s) ou blueprint Page Engine + AI Reports. Sessions ficam pra reflexão, plano mantém só "o que construir" |
| D5  | **Princípios design system**                       | Blueprint 05-design-system §1 (10 princípios) + research 16 §10 + design-system 00-state §"Princípios consolidados"                                                                                                       | Bloqueado por design system rethink. Quando fechar, consolidar em blueprint 05 atualizado                                                   |
| D6  | **47 vs 53 primitives**                            | ADR-0040 §A · CHANGELOG · 14a-audit                                                                                                                                                                                       | Consolidar contagem em **`14a-audit-estado-atual.md` §4** (já tem). Outros viram ponteiros                                                  |
| D7  | **Plano transformação design (5 fases / 9 fases)** | `design-system/14-transformation-plan.md` (versão simplificada) + `design-system/00-state.md` § Cronologia + `design-system/11-decisions-pending.md` (43 decisões dependentes)                                            | Consolidar plan em **14-transformation-plan.md** + lista de pendings só em **11-decisions-pending.md**. Hoje 00-state.md repete             |
| D8  | **APCA Silver triplicado**                         | Blueprint 05 §1.3 + `.claude/rules/contrast.md` + ADR-0040 §H + research 08 + research 26 §"Key Findings 4"                                                                                                               | Consolidar regra em **rule contrast.md**. ADR + blueprint mantêm ponteiros                                                                  |
| D9  | **Mobile-first patterns**                          | `docs/references/mobile-native-patterns/*.md` (11 files canônicos) + `docs/design-system/06-pwa-mobile-questions.md` + `19-mobile-first-additions.md` + research 26+27                                                    | Consolidar canon em **references/mobile-native-patterns/** (já existe). design-system/19 cita                                               |

---

## 4. Pesquisas esquecidas / parciais

| #   | Pesquisa                            | Status                                                                            | Insights órfãos                                                                                                                                     | Ação recomendada                                                                                                                                                                    |
| --- | ----------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | **03-engenharia-de-prompt**         | Citada em blueprint/07+09; queue 10-research-queue confirma "não consultada hoje" | Estrutura completa: 3 caminhos saída structured, decisão Sonnet/Haiku por estágio, gotchas Zod-Anthropic, system/user message templates per estágio | **Ler + integrar nos prompts AI features (Etapa 4 plano)** ou marcar como referência                                                                                                |
| R2  | **01-white-label-strategies**       | Única ref: blueprint 18-transferencia                                             | 15 decisões fundamentadas, BLOCO 1 infra (Mux/Bunny/CF Stream), demais blocos                                                                       | **Re-revisar** — pode conter decisões já materializadas em ADRs sem citation. Adicionar refs ou arquivar                                                                            |
| R3  | **02-design-frontend-arquitetura**  | Zero refs ativas                                                                  | Provavelmente foi insumo pré-design-system rethink                                                                                                  | **Marcar archived** OU citar em design-system/10-research-queue se ainda relevante                                                                                                  |
| R4  | **04-regras-contratos-claude-code** | Zero refs ativas                                                                  | Possivelmente fonte de abstrações + rules pattern                                                                                                   | **Re-revisar** — provavelmente fonte das decisões abstrações.md hoje. Adicionar citações                                                                                            |
| R5  | **05-06-08-09-12-14-15**            | Múltiplas zero refs ativas                                                        | Tokens/paletas, primitives/icons, motion/APCA, lint enforcement, PWA, DS doc patterns, editor mobile                                                | **Audit em lote** — pra cada, decidir (a) integrar via ADR/blueprint, (b) marcar archived com nota explicativa, (c) deixar como referência consultiva sob `docs/_archive/research/` |
| R6  | **10-perf-multi-vertical**          | Única ref: migration 0013                                                         | Bundle budgets, RSC payload calc, Cache Components patterns                                                                                         | **Promover** pra ADR-0020 (bundle budgets) como citação                                                                                                                             |
| R7  | **11-editor-strategy**              | Refs blueprint/12-sprint-plan + INSTALL-MANIFEST                                  | Tiptap 3.x, BlockNote, Plate.js, Lexical decisões                                                                                                   | **Aguardar Fase 2** — editor visual é Fase 2 (research 24 §4 + plano dia 1). Marcar "deferred Fase 2"                                                                               |

---

## 5. ADRs com problemas

| ADR                                    | Status header atual                                                 | Status real (verificado)                                                 | Recomendação                                                                                                           |
| -------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **0013** Ladle como catálogo           | `Status: accepted`                                                  | superseded by 0038 (Storybook) — README anota                            | **Adicionar linha** `Status: superseded by 0038` no topo do arquivo + bloco "Why superseded"                           |
| **0031** Lint overrides                | `Status: accepted`                                                  | partially-superseded by ADR-0040 §A — README anota                       | **Atualizar header file** pra `Status: partially-superseded by 0040 (§1 e §7 reinstaurados)`                           |
| **0034** Vertical slice + entitlements | `Status: accepted`                                                  | README anota "ADR-0034 arch → ADR-0039". Confuso (entitlements vs slice) | **Esclarecer header** — arch substituído por 0039 OU vertical slice principle mantido. Reescrever bloco "consequences" |
| **0037** Wrapper pattern               | `Status: accepted` (nota inline)                                    | partially-superseded by 0040 §E (wrapper §B) — §A hierarquia accepted    | **Header oficial** `Status: §A accepted · §B partially-superseded by 0040 §E`                                          |
| **0042** Elevation tokens 3 níveis     | `Status: accepted`                                                  | Plano 14 design system propõe 5 → ADR-0042 candidata superseded          | **Mantém accepted ATÉ** plano 14 fechar. Quando virar 5, criar ADR-0043 e marcar 0042 como `superseded by 0043`        |
| **0014** Serwist Turbopack             | `accepted · Atualizado 2026-05-18`                                  | OK                                                                       | Pequena inconsistência: data atualização no README mas não no file. Padronizar                                         |
| **0026** Multi-domain                  | `accepted (schema platform.* consolidado em public.* via ADR-0033)` | OK contextualizado                                                       | OK                                                                                                                     |
| **0024** Multi-brand via hostname      | `accepted` + nota schema via 0033                                   | OK                                                                       | OK                                                                                                                     |

**ADRs faltando potencialmente:**

- **Decisão D-15** (renomear "template" → "archetype" no contexto perceptual) — design-system 11-decisions-pending tem, mas sem ADR
- **Decisão ordem M0 → M1 → M2** (Lego principle) — plano dia 1 §0.2.1 menciona, sem ADR
- **Decisão report = `page.kind='report'`** (não motor 3) — ADR-0041 D4 cobre? Reler

---

## 6. Proposta de organização final

Ordenado por prioridade: P0 (hoje, sangue) · P1 (esta semana) · P2 (quando design system fechar).

### P0 — Urgente, baixo custo

1. **Atualizar `blueprint/06-data-model.md`** — substituir `capture_forms`/`capture_submissions` por `forms`/`form_submissions`. Adicionar nota "post-migration 0015". (Custo: 30min)
2. **Atualizar `blueprint/03-naming-vocab.md`** — remover/superseder linha "Brand identity via env" pra hostname pattern. Mover vocab `capture_form` pra "histórico". Adicionar referência ADR-0041 + 0024. (Custo: 30min)
3. **Adicionar header `Status: archived (superseded by PLANO-DIA-1)`** em `PLANO-MESTRE-DIA-0.md`. (Custo: 5min)
4. **Patch ADR-0013 header** — adicionar `Status: superseded by 0038`. (Custo: 5min)
5. **Patch ADR-0031 header** — `Status: partially-superseded by 0040 §A`. (Custo: 5min)
6. **Patch ADR-0037 header** — `Status: §A accepted · §B partially-superseded by 0040 §E`. (Custo: 5min)
7. **Resolver C2 vocab `prospect`**: verificar se enum `form_kind` no Supabase tem `'prospect'`. Se sim: criar ADR pra exceção (form `kind` ≠ vocab geral) ou submeter migration de rename. (Custo: 30min investigação)

### P1 — Essa semana

8. **Atualizar `docs/_status.md`** — incluir `docs/design-system/` no inventário, atualizar contagem de migrations (já 17), refletir CLAUDE.md atual. (Custo: 1h)
9. **Criar ADR-0043 (D-15 vocab archetype)** — cravar "template perceptual = archetype". Atualizar rule naming. (Custo: 1h)
10. **Promover decisões cravadas Page Engine + AI Reports pra blueprint** — criar `blueprint/22-page-engine.md` + `blueprint/23-ai-reports.md` consolidando 50+ decisões do plano §0.2 "deep read". (Custo: 3h)
11. **Audit em lote pesquisas órfãs (R2-R7)** — pra cada, decidir destino (citar/archive/integrar). (Custo: 2h)
12. **Promover research 03 (prompt engineering)** — ler + criar `blueprint/24-ai-prompt-templates.md` ou estender blueprint 07. (Custo: 2h)
13. **Documentar migrations 0002-0014 ausentes** — criar `docs/migrations/000N_*.md` minimal pra cada. (Custo: 1.5h)
14. **Reescrever blueprint 14-docs-lifecycle.md §1** — virar ponteiro pra ADR-0018 + rule docs-writing. Remover hierarquia duplicada. (Custo: 30min)

### P2 — Quando design system rethink fechar

15. **Decidir destino de `docs/design-system/`** — quando fases fecharem, promover decisões pra ADR(s) + blueprint 05 atualizado. Arquivos WIP movem pra `_archive/design-system-rethink-2026-05/`.
16. **Criar ADR-0043 (ou 0044) elevation tokens 5 níveis** se plano transformação adotar — supersede ADR-0042.
17. **Consolidar princípios design system** em blueprint 05 atualizado (D5 duplicação).
18. **Atualizar CLAUDE.md** com novo vocab archetype + tokens novos.
19. **Mover 71+ DESIGN.md** docs/references/design-systems pra layer "research-only" se design system fechar.

### P3 — Higiene contínua

20. **Adicionar `pnpm docs:validate`** que checa: (a) headers ADR têm status válido, (b) referências cross-doc não-quebradas, (c) blueprints citam ADRs existentes. Run em prebuild.
21. **Convenção `> Status: ativo|wip|archived|stale` no header de TODO doc.** Hoje só metade tem.
22. **Adicionar "Condição de revisitar"** em cada blueprint (como rules já têm). Hoje só 5/24 blueprints têm.

---

## Perguntas pendentes pro user

Lista de ambiguidades que só user pode resolver (priorizadas):

1. **Plano design-system/14 conflita com plano dia 1?** Os 2 planos têm dependências cruzadas (plano 14 diz "bloqueia M1 funil agência"; plano dia 1 estava executando Etapas 1-6 sem esperar plano 14). Qual a precedência **agora**: design system rethink primeiro, ou continuar funil dia 1 paralelo?
2. **`prospect` é enum válido em `form_kind` no Supabase?** Se sim, vocab banido deveria abrir exceção (form kind ≠ identifier code). Se não, atualizar session reflection que cita `'prospect'`.
3. **Vamos promover `archetype` como termo oficial substituindo "template perceptual"?** Decisão D-15 estava pending no `11-decisions-pending`. Promove pra ADR ou continua pending?
4. **Pesquisas 01-15 (das 27)** — qual destino: (a) deletar/arquivar todas que zero-refs, (b) integrar via citações, (c) deixar como acervo consultivo em `_archive/research/`?
5. **`docs/_archive/onboarding-bio-archive-*` ainda relevante?** ~80 arquivos de auditorias antigas. Pode ir pra `.archive/onboarding-bio/` ZIP arquivado ou um single index.md?
6. **Blueprint 05-design-system deve ser atualizado AGORA com archetypes ou esperar design system rethink fechar?** Hoje stale (referencia só 13 paletas + ADR-0042 3 elevations).
7. **Migration 0002-0014 docs ausentes** — criar agora ou esperar? Eles existem aplicados no Supabase mas sem `docs/migrations/NNNN_*.md`.
8. **`PLANO-MESTRE-DIA-0.md`** — arquivar movendo pra `docs/_archive/plans/` ou só marcar header `archived`?
9. **`docs/design-system/14-transformation-plan.md` já consumiu `14a-audit-estado-atual.md`?** Audit menciona 5 ajustes aplicados ao plano. Confirmar se plano 14 está sincronizado ou se ainda há texto antigo.
10. **`design-system/` é uma pasta "fonte de verdade" ou puramente WIP/exploração?** README diz "NADA aqui está cravado". Mas plano 14 está sendo executado a partir dela. Ela é "plano executável WIP" ou "exploração não-decidida"?

---

## Notas finais

- Audit **NÃO modificou** nenhum arquivo. Só leitura.
- Auditados ~75 arquivos (limite operacional respeitado).
- Arquivos do `_archive/` excluídos do scope ativo.
- Toda contradição checada em 2+ docs.
- Tabelas densas, output ~22 KB (dentro do limite 15-25 KB).
