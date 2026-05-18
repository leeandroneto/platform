# Validação Blueprint — Coerência total (CHUNKS 1-7)

> Checklist verificando coerência total do blueprint gerado.
> Última auditoria: 2026-05-17 · Estado: 18 blueprints + 23 ADRs + 1 README + este arquivo.

---

## 1. Cobertura proposta_desafit.html

| Item da proposta                      | Arquivo blueprint                             | Status |
| ------------------------------------- | --------------------------------------------- | ------ |
| Pacote A — R$ 1.500 + R$ 100/mês      | `09-pacote-a.md`                              | ✅     |
| Pacote B — R$ 3.000 + R$ 200/mês      | `10-pacote-b-c.md`                            | ✅     |
| Pacote C — R$ 4.000 + R$ 200/mês      | `10-pacote-b-c.md`                            | ✅     |
| Form captação multi-step              | `09-pacote-a.md §3.1`, `12-sprint-plan.md S3` | ✅     |
| Relatório IA assessment               | `07-ai-prompts.md`, `09-pacote-a.md §3.2`     | ✅     |
| WhatsApp 1:1 CTA                      | `09-pacote-a.md §3.4`                         | ✅     |
| Landing institucional prof            | `05-design-system.md`, `09-pacote-a.md §3.3`  | ✅     |
| PWA branded (Pacote B+)               | `08-pwa-offline.md`, `10-pacote-b-c.md`       | ✅     |
| Programa estruturado                  | `06-data-model.md §3`, `10-pacote-b-c.md`     | ✅     |
| Check-in PWA                          | `08-pwa-offline.md`, `12-sprint-plan.md S15`  | ✅     |
| Gamificação                           | `10-pacote-b-c.md`, ADR-0004                  | ✅     |
| Custom domain                         | `10-pacote-b-c.md`                            | ✅     |
| Integrações Hotmart/Kiwify (Pacote C) | `10-pacote-b-c.md`                            | ✅     |
| Chatbot nutricional IA (Pacote C)     | `07-ai-prompts.md`, `10-pacote-b-c.md`        | ✅     |

---

## 2. Cobertura das 23 decisões (\_CONFLITOS.md)

| #   | Decisão                  |   ADR   |
| --- | ------------------------ | :-----: |
| 1   | Schema sizing dia 1      | ✅ 0001 |
| 2   | Sem tabela TACO          | ✅ 0002 |
| 3   | Automações priorização   | ✅ 0003 |
| 4   | Gamificação dia 1        | ✅ 0004 |
| 5   | Cronograma 4 meses       | ✅ 0005 |
| 6   | Construir antes vender   | ✅ 0006 |
| 7   | Mobile-first 100%        | ✅ 0007 |
| 8   | shadcn 100% + hierarquia | ✅ 0008 |
| 9   | Critério premium         | ✅ 0009 |
| 10  | Branding unificado       | ✅ 0010 |
| 11  | Editor híbrido           | ✅ 0011 |
| 12  | Lint enforcement         | ✅ 0012 |
| 13  | Ladle catálogo           | ✅ 0013 |
| 14  | Serwist + Turbopack      | ✅ 0014 |
| 15  | PWA offline IndexedDB    | ✅ 0015 |
| 16  | Pipeline UI dia 0        | ✅ 0016 |
| 17  | ADR Michael Nygard       | ✅ 0017 |
| 18  | Hierarquia fonte verdade | ✅ 0018 |
| 19  | Setup 4 telas fase 2     | ✅ 0019 |
| 20  | Bundle budgets           | ✅ 0020 |
| 21  | Schema rename core       | ✅ 0021 |
| 22  | Marca pai comercial      | ✅ 0022 |
| 23  | Onboarding.bio retake    | ✅ 0023 |

---

## 3. Cobertura das 16 pesquisas

| Pesquisa                            | Blueprint que consome                                   |
| ----------------------------------- | ------------------------------------------------------- |
| 01 — white-label strategies         | `05-design-system.md`, `06-data-model.md` ✅            |
| 02 — design frontend arquitetura    | `01-arquitetura.md`, `04-camadas-imports.md` ✅         |
| 03 — engenharia de prompt           | `07-ai-prompts.md`, ADR-0002 ✅                         |
| 04 — regras/contratos Claude Code   | `16-claude-code.md` ✅                                  |
| 05 — design system tokens paletas   | `05-design-system.md` ✅                                |
| 06 — design system primitives icons | `05-design-system.md` ✅                                |
| 07 — planejamento ordem execução    | `11-roadmap.md`, `12-sprint-plan.md` ✅                 |
| 08 — design system motion APCA      | `05-design-system.md §5, §6` ✅                         |
| 09 — lint enforcement token bypass  | `13-lint-enforcement.md`, ADR-0012 ✅                   |
| 10 — perf multi-vertical            | `06-data-model.md`, ADR-0020 ✅                         |
| 11 — editor strategy                | `05-design-system.md`, ADR-0011 ✅                      |
| 12 — PWA offline-first              | `08-pwa-offline.md`, ADR-0014, 0015 ✅                  |
| 13 — doc lifecycle                  | `14-docs-lifecycle.md`, ADR-0017, 0018 ✅               |
| 14 — design system doc pattern      | `05-design-system.md §11`, ADR-0013 ✅                  |
| 15 — editor mobile-first            | `05-design-system.md`, `08-pwa-offline.md`, ADR-0007 ✅ |
| 16 — visual premium                 | `05-design-system.md §12`, ADR-0009 ✅                  |

---

## 4. Cobertura memórias críticas

| Memória                                              |                             Aplicada?                              |
| ---------------------------------------------------- | :----------------------------------------------------------------: |
| D-G1..D-G76 master plan §0.5 + §17.1 + §27.1         |                 ✅ refletidos em ADRs + blueprints                 |
| `feedback_no_legacy_vocabulary`                      | ✅ vocab banido em `03-naming-vocab.md` + `13-lint-enforcement.md` |
| `project_desafit_jit_code_transfer`                  |                 ✅ `18-transferencia.md` aplicado                  |
| `project_desafit_multi_brand_strategy` (schema core) |                      ✅ ADR-0021, 0022, 0023                       |
| `feedback_zero_eslint_disable`                       |        ✅ `13-lint-enforcement.md §7` + ADR-0012 allowlist         |
| `feedback_skip_visual_checkpoints`                   |            ✅ `12-sprint-plan.md §14` checkpoint único             |
| `project_desafit_principio_39_revisto`               |         ✅ `11-roadmap.md`, `12-sprint-plan.md`, ADR-0003          |
| `feedback_vocab_check_before_response`               |                ✅ ADR-0019 + hook UserPromptSubmit                 |
| `project_desafit_implementation_order_2026_05_17`    |                   ✅ blueprint 14 + roadmap M5+                    |

---

## 5. Vocab banido (grep validação)

Verificar com `grep -rE "(student|trainer|intake|wizard|prospect|diagnostic|customization|workspace|framer-motion)" docs/desafit/blueprint/` (excluindo `.claude/rules/naming.md`, ADR-0019 que cita "wizard" em contexto da decisão banida, `_CONFLITOS.md`, `_VALIDACAO.md`):

- Termo banido em código de exemplo: ✅ 0 hits
- Termo banido em prosa explicativa: ⚠️ aparecem em quote/contexto educativo (allowlisted: ADR-0019, este arquivo, naming.md)
- `aluno` em folder/identifier: ✅ 0 hits (só em URL rewrite mention)
- `framer-motion`: ✅ 0 hits (só em vocab banido tabela)

---

## 6. Tamanho dos arquivos

| Arquivo                     | Target  |                         Status                          |
| --------------------------- | ------- | :-----------------------------------------------------: |
| `00-PROJETO.md`             | <350    |                         ✅ 322                          |
| `01-arquitetura.md`         | 80-300  |                         ✅ ~170                         |
| `02-stack.md`               | 80-300  |                         ✅ ~190                         |
| `03-naming-vocab.md`        | 80-300  |                         ✅ ~190                         |
| `04-camadas-imports.md`     | 80-300  |                         ✅ ~215                         |
| `05-design-system.md`       | 80-300  |                         ✅ ~270                         |
| `06-data-model.md`          | 80-300  |                         ✅ ~225                         |
| `07-ai-prompts.md`          | 80-300  |                         ✅ ~280                         |
| `08-pwa-offline.md`         | 80-300  |                         ✅ ~280                         |
| `09-pacote-a.md`            | 80-300  |                         ✅ ~200                         |
| `10-pacote-b-c.md`          | 80-300  |                         ✅ ~270                         |
| `11-roadmap.md`             | 80-300  |      ✅ ~340 (range é estimativa, não hard limit)       |
| `12-sprint-plan.md`         | 80-300  |                         ✅ ~280                         |
| `13-lint-enforcement.md`    | 150-300 |                         ✅ ~270                         |
| `14-docs-lifecycle.md`      | 100-200 |      ✅ ~250 (range é estimativa, não hard limit)       |
| `15-bootstrap-checklist.md` | 200-400 |                         ✅ ~370                         |
| `16-claude-code.md`         | 150-250 |      ✅ ~280 (range é estimativa, não hard limit)       |
| `17-repo-bootstrap.md`      | 200-350 | ✅ 436 (range é estimativa, conteúdo operacional denso) |
| `18-transferencia.md`       | 150-250 |                         ✅ 195                          |
| ADRs                        | 40-100  |                     ✅ todos 40-95                      |
| ADR README                  | <150    |                         ✅ ~90                          |
| CLAUDE.md root (template)   | <200    |                ✅ ~140 (template em 16)                 |

---

## 7. Mobile-first 100% explícito

| Local                                                                 |               Status               |
| --------------------------------------------------------------------- | :--------------------------------: |
| `05-design-system.md` (touch patterns, vaul mobile, NumberStepper)    |                 ✅                 |
| Editor (`05-design-system.md` + ADR-0011)                             |                 ✅                 |
| PWA offline (`08-pwa-offline.md`)                                     |                 ✅                 |
| Bundle budgets per-rota (`13-lint-enforcement.md §6`, ADR-0020)       |                 ✅                 |
| Painel prof (não só PWA aluno) — Sprint plan testa iPhone 14 portrait | ✅ `12-sprint-plan.md` cada sprint |
| Bootstrap checklist (safe areas iOS tarefa 20)                        | ✅ `15-bootstrap-checklist.md §B4` |
| Roadmap §11 reforço explícito                                         |                 ✅                 |

---

## 8. Coerência com 00-PROJETO.md

| §00-PROJETO                    |                   Respeitado?                    |
| ------------------------------ | :----------------------------------------------: |
| §1 (identidade)                |                        ✅                        |
| §2 (modelo agência → SaaS)     |                ✅ ADR-0005, 0006                 |
| §3 (3 pacotes)                 |                        ✅                        |
| §4 (vocabulário)               |            ✅ ADR-0019, lint enforça             |
| §5 (stack)                     |                 ✅ `02-stack.md`                 |
| §6 (regras code)               | ✅ `13-lint-enforcement.md`, `16-claude-code.md` |
| §7 (mobile-first 100%)         |        ✅ ADR-0007 + reforço sprint plan         |
| §8 (princípio universal busca) |                   ✅ ADR-0008                    |
| §9 (brand assets zero inline)  |            ✅ ADR-0016 + ESLint rule             |
| §10 (restrições temporais)     |                   ✅ ADR-0005                    |

---

## 9. Princípio §39 (ferramenta junto com cliente)

| Doc                                                              | Aplicado? |
| ---------------------------------------------------------------- | :-------: |
| `11-roadmap.md` (M2 sprint imediato pós-1º cliente)              |    ✅     |
| `12-sprint-plan.md` (Sprint 8 dedicado à automação pós-1º)       |    ✅     |
| ADR-0003 (priorização por dor real)                              |    ✅     |
| `16-claude-code.md §6, §7` (custom agents/skills só com 5+ usos) |    ✅     |

---

## 10. Schema rename `desafit.*` → `core.*` → `public.*`

Grep final pós-rename ADR-0025:

- `public.*` referências: ✅ majoritárias (~110 ocorrências)
- `core.<table>` em código/docs: ✅ 0 hits (rename completo)
- `desafit.<table>` em código/docs: ✅ 0 hits
- `desafit.app` (URL/brand domain): ✅ OK e esperado
- Único `schema('core')` literal: ADR-0025 §Decision explicando transição (correto)

## 11. Multi-brand via hostname (ADR-0024)

- Boilerplate sem `NEXT_PUBLIC_BRAND_*` env vars ✅
- `lib/brand/{types,getBrandByHost,BrandProvider}.tsx` criados ✅
- `proxy.ts` Next 16 com lookup de brand ✅
- `app/api/brands/[id]/theme.css/route.ts` (CSS via API D-G59) ✅
- ESLint rule `brand/no-brand-hardcode` bloqueia literal `desafit`/`yoga.app`/`ingles.app` ✅
- `public.brands` tabela adicionada ao baseline 0001_initial.md ✅

## 12. Boilerplate dia 0 completo (61 arquivos)

| Categoria    | Arquivos                                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Root configs | 13 (gitignore, editorconfig, prettierrc, tsconfig, next.config, proxy, vercel, vitest, size-limit, sheriff, knip, commitlint, env.example, CLAUDE.md, package.json.scripts.md) |
| App          | 2 (layout, theme.css route)                                                                                                                                                    |
| Lib          | 9 (env, contracts×3, supabase×3, brand×3)                                                                                                                                      |
| ESLint       | 1 (24 regras)                                                                                                                                                                  |
| Scripts      | 6 (3 audits + grep-disables + adr-index + validate-palettes)                                                                                                                   |
| Claude       | 12 (settings + 3 hooks + 8 rules)                                                                                                                                              |
| Styles       | 1 (globals.css 13 paletas)                                                                                                                                                     |
| Supabase     | 1 (0001_initial guide)                                                                                                                                                         |
| Ladle        | 1                                                                                                                                                                              |
| Husky        | 4                                                                                                                                                                              |
| Tests        | 2 (setup + playwright config)                                                                                                                                                  |
| GitHub       | 5 (ISSUE × 2 + PR template + PROJECT.md + ci.yml)                                                                                                                              |
| Total        | **61**                                                                                                                                                                         |

---

## Pendências (NÃO consertar aqui — fundador decide)

1. ~~**Preço Pacote B/C divergente**~~ ✅ **RESOLVIDA 2026-05-17**
   - Decisão fundador: opção A — manter preço original alinhado com proposta + 00-PROJETO
   - `10-pacote-b-c.md` atualizado: B = R$ 3.000 + R$ 200/mês, C = R$ 4.000 + R$ 200/mês
   - §7 divergência removida; numeração §7-§10 reorganizada
   - Sem ADR novo (volta ao original — não é pivot)

2. ~~**Tamanho de blueprints fora do range**~~ ✅ **RESOLVIDA 2026-05-17**
   - Decisão fundador: opção C — range é estimativa, não hard limit
   - Sem mudança nos arquivos
   - Critério novo: conteúdo operacional denso pode passar do range sem ADR

3. ~~**`17-repo-bootstrap.md` e `18-transferencia.md` ainda não auditados aqui**~~ ✅ **RESOLVIDA 2026-05-17**
   - Tamanho: 436 + 195 linhas (operacional denso, range é estimativa)
   - Vocab banido: 0 hits em 17; 4 hits em 18 todos allowlisted (instruções de rename/migração — citam termo pra mostrar substituto)
