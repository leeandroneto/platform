# Plano — Funil CREF /analise-gratuita (Fases A1–E4)

> **Objetivo:** substituir o fluxo /diagnostico por um funil completo de captação para profissionais do CREF — landing `/analise-gratuita` → formulário 23 perguntas → relatório 8 seções → `/fundadores` → onboarding com dados pré-preenchidos.
> **Fonte de verdade:** `docs/prospects-cref/prospects.md` (funil master), `docs/prospects-cref/relatorio_autonomo_cref.html` (referência visual do relatório).
> **Protocolo de execução:** `docs/refatoracao-2026-05/execucao/PROTOCOLO-TERMINAL.md` — leitura obrigatória pra qualquer agente.
> **Snapshot:** tsc 0, vitest 525/525, lint 0 erros.

---

## Status da Etapa A (CONCLUÍDA — não executar novamente)

| Fase | Status | O que foi feito                                                                                                               |
| ---- | ------ | ----------------------------------------------------------------------------------------------------------------------------- |
| A3   | ✅     | 6 colunas novas em `prospect_professionals` (whatsapp, state, instagram_handle, opted_in_comms, cref_registered, cref_number) |
| A1   | ✅     | Tabela `market_benchmarks` criada com 6 linhas de dados reais                                                                 |
| A2   | ✅     | 38 perguntas antigas soft-deletadas + 32 novas inseridas (Q1-Q23 + QP1-QP9)                                                   |
| A4   | ✅     | Prompt `prospect-analysis.system` v1 no `ai_prompts`                                                                          |

---

## Por que existe este plano

O sistema `/diagnostico` atual tem 38 perguntas em 7 camadas, relatório narrativo em texto corrido e nenhum funil de conversão atrelado. O novo modelo é:

- 23 perguntas + dados pessoais + Google OAuth (5 min)
- Relatório 8 seções visuais com cards (HTML de referência: `relatorio_autonomo_cref.html`)
- CTA condicional → `/fundadores` (landing 10 seções)
- CTA final → onboarding existente pré-preenchido com dados do prospect

**O que muda radicalmente:** rota, perguntas, schema da IA, componente de relatório, landing pós-relatório, handoff para onboarding.
**O que é aproveitado:** skeleton do AuditForm (orchestrator + componentes de pergunta), tabela `prospect_professionals`, infra da Edge Function, `ai_prompts` table, auto-save localStorage.
**O que morre completamente:** AuditReport, AuditAnalysis, ActivationPage (~17 sections), DiagnosticIntro, DiagnosticOverview, DiagnosticoShell, PageNav (3 abas), rota `/diagnostico`.

---

## Decisões fechadas (não revisitar)

| #   | Decisão                                                                             |
| --- | ----------------------------------------------------------------------------------- |
| D1  | URL pública `/analise-gratuita` → pasta `app/(public)/free-analysis/`               |
| D2  | URL pública `/relatorio/[token]` → pasta `app/(public)/report/[token]/`             |
| D3  | URL pública `/fundadores` → pasta `app/(public)/founders/`                          |
| D4  | 23 perguntas fixas em `prospect_questions` DB (soft-delete 38 antigas)              |
| D5  | `market_benchmarks` sem coluna `regiao` — Brasil geral, 6 linhas (1 por modalidade) |
| D6  | Relatórios v2 antigos: fallback graceful "relatório não disponível neste formato"   |
| D7  | Google OAuth obrigatório para submeter o formulário (popup antes do submit)         |
| D8  | Handoff prospect→onboarding via match `email` ou `google_id`                        |

---

## Sequência de execução

```
Etapa A — CONCLUÍDA ✅

Agora — 4 terminais em paralelo:

  T-B1: B1 → B2 → B6
  T-C1: C1 → C2 → C3
  T-C2: C4 → C5 → C6 → C7
  T-D1: D1 → D2 → D3

Após T-B1 mergeado:
  T-B2: B3 → B4 → B5

Após T-C1 + T-C2 mergeados:
  T-C3: C8 → C9

Após B+C+D todos mergeados:
  T-E: E1 → E2 → E3 → E4
```

---

## Hard dependencies

| #      | Dependência                                    | Razão                                                                     |
| ------ | ---------------------------------------------- | ------------------------------------------------------------------------- |
| **H2** | B2-B6 ⛓ dependem de **B1 mergeada**            | next.config.ts define as rotas que as pages usam                          |
| **H3** | C4-C7 ⛓ podem rodar em paralelo entre si       | ProspectReport sections são independentes umas das outras                 |
| **H4** | C8+C9 ⛓ dependem de **C4-C7 mergeadas**        | Page de relatório renderiza o componente; cleanup só após novo estar live |
| **H5** | Etapa E ⛓ depende de **B+C+D todas mergeadas** | Handoff e cleanup exigem todas as novas rotas e componentes em main       |
| **H6** | C3 ⛓ depende de **C1+C2 mergeadas**            | index.ts usa buildUserMessage + callAnthropic reescritos                  |

---

## ETAPA B — Form + Rotas (2 terminais, paralelo após A)

> **T-B1:** rotas, i18n, landing page, processing page.
> **T-B2:** componentes do formulário, hooks, actions.
> Merge ordem: T-B1 antes de T-B2 (T-B2 depende da estrutura de pasta criada por B1).

### T-B1

| Fase | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Modelo | Tempo |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| B1   | ✅ **next.config.ts:** ADD rewrites `/analise-gratuita` → `/free-analysis`, `/analise-gratuita/processando` → `/free-analysis/processing`, `/relatorio/:token` → `/report/:token`, `/fundadores` → `/founders`. ADD redirects 301: `/diagnostico` → `/analise-gratuita`, `/diagnostico/r/:token` → `/relatorio/:token`, `/diagnostico/processar` → `/analise-gratuita/processando`, `/diagnostico/r/:token/analise` → `/relatorio/:token`, `/diagnostico/r/:token/comecar` → `/fundadores`. REMOVE rewrites antigos de `/diagnostico`. Criar pastas vazias `app/(public)/free-analysis/`, `app/(public)/report/[token]/`, `app/(public)/founders/` com arquivos `page.tsx` stub. **i18n:** em `messages/pt-BR.json` renomear `diagnostic.*` para `prospect.*`, atualizar textos para o novo modelo, remover keys de `analysis.*` e `start.*`. sha: 66eb71bd | Sonnet | 1.5h  |
| B2   | ✅ **Landing/capture page** `app/(public)/free-analysis/page.tsx`: renderiza `ProspectShell` (intro → overview → form, mesmo padrão do DiagnosticoShell). Tela Intro: headline "Análise gratuita do seu negócio para profissionais do CREF", subheadline, 4 bullets do que o relatório entrega, "5 minutos", CTA "Começar minha análise", aceite LGPD. Tela Overview: "5 min" em tipografia hero, 7 blocos numerados com nome e descrição. `layout.tsx` com metadata. Mobile-first, sem menu, sem footer. sha: 66eb71bd                                                                                                                                                                                                                                                                                                                                     | Sonnet | 2h    |
| B6   | ✅ **Processing page** `app/(public)/free-analysis/processing/page.tsx`: adapta da atual `/diagnostic/processing`. Spinner "Preparando sua análise...", polling do report_token, redirect para `/relatorio/[token]` quando pronto. sha: 66eb71bd                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Sonnet | 45min |

### T-B2

| Fase | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Modelo | Tempo |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| B3   | **Formulário 23 perguntas:** adaptar `components/form/audit/` para novo modelo. Renomear pasta para `components/form/prospect/`. Manter skeleton: `ProspectForm.tsx` (orchestrator), `QuestionScreen.tsx`, componentes de pergunta reutilizados. Reescrever `_helpers/logic.ts`: novos IDs Q1-Q23, novos CHECKPOINTS entre blocos (3 checkpoints: após Q7, Q14, Q21). Remover lógica JSONLogic da v2 (nova versão tem poucas condicionais). `_types.ts`: atualizar `ProspectQuestion` type para novos campos. `useProspectFormState.ts` (renomear hook): adaptar para novos IDs. | Sonnet | 3h    |
| B4   | **Bloco de dados pessoais + auth** (após Q23): tela de nome/email pré-preenchível do Google, WhatsApp com DDD, estado dropdown, cidade autocomplete IBGE (`servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=`), CREF registrado, número CREF opcional, LGPD checkbox, opt-in marcado por padrão. Trigger Google OAuth ao clicar "Gerar minha análise". Adaptar `ContactQuestion.tsx` e `ConsentQuestion.tsx`.                                                                                                                                                         | Sonnet | 2h    |
| B5   | **`app/(public)/free-analysis/actions.ts`:** reescrever `submitProspectWithAuth()` (adaptar de `submitDiagnosticWithAuth`). Novo payload para Edge Function `generate-diagnostic` com Q1-Q23 + dados pessoais. Salvar whatsapp, state, instagram_handle, opted_in_comms nos novos campos de `prospect_professionals`. Rate-limit mantido.                                                                                                                                                                                                                                        | Sonnet | 1h    |

**Verificação Etapa B:**

```bash
pnpm exec tsc --noEmit           # 0 erros
pnpm exec vitest run             # ≥525 passando
pnpm lint                        # 0 erros
pnpm dev                         # HTTP 200 em /analise-gratuita, /relatorio/test-token
# Smoke test manual: acessar /analise-gratuita, completar intro+overview, Q1 renderiza
# Testar redirect: /diagnostico → /analise-gratuita (301)
```

---

## ETAPA C — Edge Function + Relatório (3 terminais, paralelo após A)

> **T-C1:** reescrever Edge Function (buildUserMessage + callAnthropic + index).
> **T-C2:** construir ProspectReport sections 1-8.
> **T-C3:** page.tsx do relatório + cleanup final dos componentes antigos.
> T-C3 deve aguardar T-C1 e T-C2 mergeadas.

### T-C1 — Edge Function

| Fase | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Modelo | Tempo                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------- | ---------- | ----------- | -------- | ---------- | ------------- | ------ | --- |
| C1   | **`buildUserMessage.ts` rewrite:** novo mapeamento Q1-Q23 (modality, location, years, students, ticket, fixed_costs, retention_months, market_comparison, student_profile, lead_source, main_difficulty, has_site, lead_contact, conversion_process, data_storage, lost_students, admin_hours, programs, billing_method, content_channel, followers, differentiator, improvement_goal) + dados pessoais. Injeta `market_benchmarks` (passado como parâmetro via index.ts). Output: string XML estruturado com seções `<profissional>`, `<numeros>`, `<mercado>`, `<digital>`, `<benchmarks>`.                                                                                                                                                                                                                                                           | Sonnet | 1.5h                                                    |
| C2   | **`callAnthropic.ts` rewrite:** novo `TOOL_INPUT_SCHEMA` para 8 seções: `header_data` (object: nome, modalidade, anos_atuacao, cidade, estado, cref), `financial_indicators` (object: receita_mensal, ticket_medio, custos_fixos, margem_pct, margem_valor — calculados pela IA com os dados), `swot` (object: forcas[], fraquezas[], oportunidades[], ameacas[] — cada um array de 3 strings), `ideal_student_persona` (object: nome_ficticio, idade_range, profissao, descricao, tags[]), `pricing_analysis` (object: mercado_basico, mercado_medio, mercado_premium, profissional_cobra, posicionamento, recomendacao), `break_even` (object: alunos_minimos, alunos_atuais, margem_seguranca, pct_atual), `competition_differentials` (object: concorrentes_regiao[], diferenciais[], fraqueza_principal), `top3_actions` (array of 3: {priority: 1 | 2      | 3, label: string, titulo, descricao, hook_type?: 'site' | 'captacao' | 'conversao' | 'gestao' | 'retencao' | 'cobranca'}). | Sonnet | 2h  |
| C3   | **`index.ts` rewrite:** Step 0: query `market_benchmarks` WHERE modalidade = answers.Q1. Injeta resultado no buildUserMessage. Step 1: upsert prospect_professionals com novos campos (whatsapp, state, instagram_handle). Step 2: chamar Anthropic com novo prompt key `prospect-analysis.system`. Step 3: salvar `report_result` com novo schema. Manter retry logic.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Sonnet | 1.5h                                                    |

### T-C2 — ProspectReport Component

> Visual reference: `docs/prospects-cref/relatorio_autonomo_cref.html`.
> Regras: DM Serif Display para headings editoriais, DM Sans para body. Tokens do DS sempre. ZERO inline styles. Mobile-first. Cards com `rounded-[var(--shape-card)]`, superfícies `bg-[var(--color-background-secondary)]`. Cores semânticas para status (green/amber/red via tokens).

| Fase | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Modelo | Tempo |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| C4   | **`components/report/prospect/ProspectReport.tsx`** skeleton: orquestra 8 seções. Header fixo com logo + botões compartilhar (WhatsApp) e PDF (futuro). Seção 1: `ReportHeader.tsx` — nome em DM Serif Display 26px, modalidade + anos, cidade/estado, badge CREF se preenchido, data geração. Seção 2: `FinancialIndicators.tsx` — 4 metric cards em grid 2×2 mobile / 4×1 desktop: receita mensal (green se > break-even), ticket médio, custos fixos (amber), margem líquida. Cores condicionais via tokens score.                                                               | Sonnet | 2h    |
| C5   | **Seção 3:** `SwotGrid.tsx` — 2×2 grid, cores semânticas (forças=green #E1F5EE, fraquezas=red #FAECE7, oportunidades=blue #E6F1FB, ameaças=amber #FAEEDA), ícones tabler-icons. **Seção 4:** `IdealPersonaCard.tsx` — avatar com iniciais colorido, nome fictício, descrição, tags como pills.                                                                                                                                                                                                                                                                                      | Sonnet | 2h    |
| C6   | **Seção 5:** `PricingAnalysis.tsx` — 3 cards (mercado básico / você cobra / potencial premium), card do meio com highlight border verde se bem posicionado. **Seção 6:** `BreakevenBar.tsx` — bar-track com fill proporcional, label de alunos mínimos vs atuais, margem de segurança. Ambas via dados calculados pela IA.                                                                                                                                                                                                                                                          | Sonnet | 2h    |
| C7   | **Seção 7:** `CompetitionSection.tsx` — 2 cards: concorrentes da região (lista preço min/medio/premium + comparação) + diferenciais do profissional (lista + fraqueza destacada). **Seção 8:** `TopActionsSection.tsx` — 3 acao-cards com border-left colorido por prioridade (p1=#D85A30, p2=#BA7517, p3=#1D9E75), label de prioridade, título, descrição. Hook condicional após as 3 ações: se `hook_type` presente → CTA específico para `/fundadores` com parâmetro `?gancho=site` etc. Se não → CTA padrão Tom A ou Tom B. Footer com "Gerado automaticamente · Confidencial". | Sonnet | 2.5h  |

### T-C3 — Report Page + Cleanup

> Deve aguardar T-C1 (C1-C3) e T-C2 (C4-C7) mergeadas antes de iniciar.

| Fase | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Modelo | Tempo |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| C8   | **`app/(public)/report/[token]/page.tsx`:** RSC. `getProspectByToken()` → if not found → `notFound()`. Detect schema: if `report_result?.top3_actions` → render `<ProspectReport>`. Else → render fallback card "Este relatório foi gerado num formato anterior e não está mais disponível. [Fazer nova análise]". `generateMetadata` com nome do prospect. `not-found.tsx`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Sonnet | 1h    |
| C9   | **Cleanup completo de componentes legados:** DELETE `components/report/audit/AuditReport.tsx`, `_sections/` (CoverSection, MethodIntroSection, LayerSection, ClosingSection e todos em `_cover/`). DELETE `components/report/audit/AuditAnalysis.tsx` + `_analysis/`. DELETE `components/report/audit/_shared/PageNav.tsx` (3 abas), `FloatingNav.tsx`, `ScrollProgress.tsx`, `NarrativeBlock.tsx`. DELETE `components/diagnostic-activation/ActivationPage.tsx` + todos os `_sections/` (17 arquivos). DELETE `components/form/audit/DiagnosticIntro.tsx`, `DiagnosticOverview.tsx`. DELETE `components/diagnostic-activation/` (pasta inteira). DELETE `components/report/assessment/` (untracked, nunca commitada). Verificar zero callers antes de deletar cada arquivo (grep). UPDATE `components/report/audit/types.ts` → mover para `components/report/prospect/types.ts` com novos types. | Sonnet | 2h    |

**Verificação Etapa C:**

```bash
pnpm exec tsc --noEmit           # 0 erros
pnpm exec vitest run             # ≥525 passando
pnpm lint                        # 0 erros
pnpm build                       # build passa, confirmar nova rota /report/[token] na lista
```

---

## ETAPA D — /fundadores landing (1 terminal, paralelo após A)

> Referência: `docs/prospects-cref/prospects.md` seção 10 (10 seções da landing).
> Tom A (profissional com dores) vs Tom B (bem estruturado) via query param `?tom=a|b&gancho=site|captacao|...`.
> Visual: mobile-first, sem sidebar, máx 720px, espaçamentos generosos, cards com shape tokens.

| Fase | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Modelo | Tempo |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| D1   | **Setup:** `app/(public)/founders/layout.tsx` (metadata, sem shell). `app/(public)/founders/page.tsx` lê query params `tom` e `gancho` (server component). Renderiza `FoundersPage` client component com as 10 seções. Estrutura de pastas `_sections/` em `components/founders/`.                                                                                                                                                                                    | Sonnet | 1h    |
| D2   | **Seções 1-5:** `HeroSection.tsx` (headline condicional Tom A/B, subheadline, CTA "Quero ver como ficará meu site", badge "Restam X de 30 vagas"). `WeaknessesSection.tsx` (tabela mostrando apenas fraquezas detectadas via `gancho` param + solução correspondente). `HowItWorksSection.tsx` (3 passos). `IncludedSection.tsx` (4 categorias: captação, site, gestão, comercial — em cards agrupados). `RoadmapSection.tsx` (timeline 3 fases: verde/amarelo/azul). | Sonnet | 2.5h  |
| D3   | **Seções 6-10:** `ChangelogSection.tsx` (lista com ✅ e 🔧 e 🎯). `WhyFounderSection.tsx` (6 benefícios em cards). `ComparisonTableSection.tsx` (tabela fragmentado vs onboarding.bio). `FaqSection.tsx` (5 itens accordion shadcn). `FinalCtaSection.tsx` (headline escassez, botão grande, microcopy Pix recorrente). CTA de todas as seções → `/onboarding` com query param `?ref=founder&prospect_email=...`.                                                     | Sonnet | 2h    |

**Verificação Etapa D:**

```bash
pnpm exec tsc --noEmit
pnpm lint
pnpm dev  # HTTP 200 em /fundadores, /fundadores?tom=a&gancho=site, /fundadores?tom=b
```

---

## ETAPA E — Handoff + Cleanup Final (1 terminal, após B+C+D mergeadas)

| Fase | Descrição                                                                                                                                                                                                                                                                                                                                                                                                                                                         | Modelo | Tempo |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| E1   | **`lib/data/prospect.ts`:** ADD função `getProspectByEmail(client, email)` e `getProspectByGoogleId(client, googleId)`. Retornam campos relevantes: name, email, photo_url, modality, form_answers (Q1, Q3 para years_experience), whatsapp. UPDATE `ProspectRow` type com novos campos adicionados em A3.                                                                                                                                                        | Sonnet | 45min |
| E2   | **Onboarding pre-fill:** `app/(app)/onboarding/page.tsx`: após `getOrCreateDraftProfessional()`, buscar prospect via `getProspectByEmail(user.email)` OU `getProspectByGoogleId(user_metadata.sub)`. Se encontrado, chamar `prefillFromProspect()` (nova server action em `actions.ts`) que salva: full_name, photo_url (se vazia), whatsapp_number, e avança `onboarding_step` para o passo seguinte ao nome. **NÃO** auto-avançar passos de design ou checkout. | Sonnet | 1.5h  |
| E3   | **Cleanup de rotas antigas:** DELETE `app/(public)/diagnostic/` pasta inteira. Remover imports de `DiagnosticoShell`, `AuditForm`, `AuditReport`, `AuditAnalysis`, `ActivationPage` em qualquer arquivo restante. DELETE `components/form/audit/` se `components/form/prospect/` já está completa.                                                                                                                                                                | Sonnet | 1h    |
| E4   | **Verificação end-to-end completa:** tsc, vitest, lint, build. Atualizar `historico-fases.md` e `CLAUDE.md`.                                                                                                                                                                                                                                                                                                                                                      | Sonnet | 1.5h  |

**Verificação Etapa E:**

```bash
pnpm exec tsc --noEmit           # 0 erros
pnpm exec vitest run             # ≥525 passando
pnpm lint                        # 0 erros
pnpm build                       # build passa
```

---

## Arquivos críticos

### Criar (novos)

- `app/(public)/free-analysis/page.tsx` + `layout.tsx` + `actions.ts`
- `app/(public)/free-analysis/processing/page.tsx`
- `app/(public)/report/[token]/page.tsx` + `not-found.tsx`
- `app/(public)/founders/page.tsx` + `layout.tsx`
- `components/report/prospect/ProspectReport.tsx` + 8 section files + `types.ts`
- `components/form/prospect/` (adaptar de `components/form/audit/`)
- `components/founders/_sections/` (10 seções)

### Modificar

- `next.config.ts` (B1)
- `messages/pt-BR.json` (B1)
- `supabase/functions/generate-diagnostic/_ai/buildUserMessage.ts` (C1)
- `supabase/functions/generate-diagnostic/_ai/callAnthropic.ts` (C2)
- `supabase/functions/generate-diagnostic/index.ts` (C3)
- `lib/data/prospect.ts` (E1)
- `app/(app)/onboarding/page.tsx` + `actions.ts` (E2)

### Deletar

- `app/(public)/diagnostic/` (pasta inteira — E3)
- `components/report/audit/AuditReport.tsx` + `_sections/` + `_cover/` (C9)
- `components/report/audit/AuditAnalysis.tsx` + `_analysis/` (C9)
- `components/report/audit/_shared/PageNav.tsx`, `FloatingNav.tsx`, `ScrollProgress.tsx`, `NarrativeBlock.tsx` (C9)
- `components/diagnostic-activation/` (pasta inteira — C9)
- `components/report/assessment/` (untracked — C9)

### Utilities reutilizáveis (não recriar)

- `supabase/functions/_shared/ai-prompt.ts` — `getPrompt()`, `logGeneration()` inalterados
- `lib/api/{response,error,auth}.ts` — helpers de API inalterados
- `components/form/audit/QuestionScreen.tsx`, `SingleQuestion.tsx`, `MultiQuestion.tsx`, `NumberQuestion.tsx`, `TextareaQuestion.tsx`, `ConsentQuestion.tsx` — reutilizar em `components/form/prospect/`
- `lib/data/prospect.ts` — `getProspectByToken()` reutilizar, adicionar novas funções
