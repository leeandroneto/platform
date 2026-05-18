# DECOMPOSE-ORDER.md — ordem topológica das fases 88-126 (Etapa 9)

> **Produzido pela Fase 87.** Contrato vinculante das fases 88-126 (decompose components).
> Snapshot do estado: pós Fase 83 (sha `ba8bd4f`).
> **Hard dep H7:** ordem topológica (folha → raiz). Ignorar = conflito de merge mecânico inevitável.

---

## 1 · Objetivo desta etapa

Reduzir todos os componentes >300 linhas em `components/` a arquivos <300l, decompondo em **orchestrator + `_components/`** (ou `_sections/` ou `_steps/`, conforme convenção do projeto) sem alterar a API exportada.

A ordem não é pelas **linhas** (worst-first) e sim pela **topologia de imports**. Se A importa B, decompor B primeiro. Assim B muda em isolamento; quando A vai mudar, ele importa B já decomposto sem rebase doloroso.

---

## 2 · Universo do problema

42 componentes >300 linhas (snapshot pós-Fase 83):

```bash
find components -name "*.tsx" -not -path "*/node_modules/*" \
  | xargs wc -l 2>/dev/null \
  | awk '$1 > 300 && $2 != "total"' \
  | sort -nr
```

Saída sumarizada (linhas | path):

```
909 components/report/audit/AuditAnalysis.tsx
697 components/ui/sidebar.tsx                                   ← SKIP (shadcn primitive)
676 components/settings/DesignForm.tsx
638 components/form/lead/LeadForm.tsx
620 components/form/audit/AuditForm.tsx
586 components/site/SiteHub.tsx
579 components/ui/CrudManager.tsx
576 components/clients/TransformationEditor.tsx
574 components/clients/AssessmentList.tsx
560 components/funnel/tabs/_components/report-panels.tsx
560 components/clients/WorkoutEditor.tsx
534 components/plans/PlanManager.tsx
531 components/landing/editor/_components/ResultsTab.tsx
517 components/funnel/tabs/ConfigTab.tsx
497 components/landing/editor/LandingEditor.tsx
431 components/diagnostic-activation/_sections/TemplateSection.tsx
428 components/dashboard/SidebarNav.tsx
417 components/landing/onboarding/ProductShowcase.tsx
411 components/form/audit/QuestionScreen.tsx
410 components/landing/editor/_components/TestimonialsTab.tsx
402 components/landing/premium/sections/PremiumTestimonials.tsx
400 components/landing/onboarding/Nav.tsx
398 components/landing/onboarding/storyboard/Ato2Jornada.tsx
394 components/testimonials/TestimonialManager.tsx
394 components/landing/editor/_components/PlansTab.tsx
385 components/clients/ClientPlanSection.tsx
375 components/landing/onboarding/FeaturesGrid.tsx
373 components/landing/onboarding/storyboard/Ato1Site.tsx
368 components/ui/chart.tsx                                     ← SKIP (shadcn primitive)
356 components/report/audit/_sections/CoverSection.tsx
338 components/form/lead/_steps/QuestionStep.tsx
335 components/form/lead/_steps/primitives.tsx
331 components/subscription/CheckoutFlow.tsx
326 components/landing/onboarding/storyboard/_components/Ato4ScreensB.tsx
323 components/landing/onboarding/storyboard/Ato3Encontro.tsx
321 components/landing/editor/_components/MethodologyTab.tsx
319 components/funnel/tabs/_components/report-shared.tsx
312 components/landing/premium/sections/PremiumHero.tsx
309 components/funnel/tabs/_respostas/OptionPanel.tsx
305 components/subscription/_checkout/EfiCreditCardForm.tsx
304 components/funnel/CustomizationEditor.tsx
302 components/landing/editor/_components/FaqTab.tsx
```

42 itens. Após 2 SKIPs justificados (item 3) → **40 a decompor**. Com 1 agrupamento (item 5.4) cabe nas **39 fases 88-126**.

> **Pages >300l** (`coming-soon`, `dashboard`, `clients/page`, `leads/page`, `mockups/charts`) ficam fora desta etapa — pertencem à **Etapa 10** (fases 127-131). Não confundir.

---

## 3 · SKIPs justificados

Dois componentes não devem ser decompostos:

| Arquivo                     | Linhas | Motivo                                                                                                                                                                                                                                                                                  |
| --------------------------- | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/ui/sidebar.tsx` | 697    | Primitive shadcn instalado em **Fase 45A** (registry `sidebar-07` como base do `sidebar-07` shell). É código gerado pelo shadcn CLI; mexer rompe contrato com o registry e quebra atualizações futuras. Continua coberto pelo allowlist de `components/ui/**` no lint da Fase 29 / 157. |
| `components/ui/chart.tsx`   | 368    | Primitive shadcn (`ChartContainer`, `ChartTooltip`, `useChart`) wrapped em **Fase 45K**. Mesmo raciocínio do `sidebar.tsx`. Mantido como dependência transparente para `LeadsChart`, `MacroDonut`, `BarComparison` (que continuam <300l).                                               |

Ambos já estão no allowlist `components/ui/**` desde Fase 29 (regras como warn). Confirmar que sobrevivem ao gate da **Fase 157** (warn → error) — adicionar override explícito se necessário.

`components/ui/CrudManager.tsx` (579l) **não é SKIP**. Apesar de morar em `ui/`, é abstração interna do projeto (não vem do shadcn registry); CLAUDE.md a lista como "Abstração disponível" — viável e desejável decompor mantendo a API pública (`CrudManager`, `useCrudList`).

---

## 4 · Análise topológica (folha → raiz)

Cada componente foi inspecionado pelos seus `import` no topo do arquivo para mapear as arestas internas ao set. Imports para `@/components/ui/*` (Button, Heading, Text, Eyebrow, etc.), `@/components/motion/*`, `@/components/shared/*` e helpers `_components/_helpers` foram ignorados — só contam **arestas para outros dos 42 alvos**.

### 4.1 Arestas detectadas (componente → importa)

```
LeadForm                  → primitives, QuestionStep
AuditForm                 → primitives, QuestionScreen
QuestionScreen            → primitives
QuestionStep              → primitives

SiteHub                   → LandingEditor, PlanManager, TestimonialManager
LandingEditor             → FaqTab, MethodologyTab, PlansTab, ResultsTab, TestimonialsTab

TransformationEditor      → CrudManager (useCrudList)
WorkoutEditor             → CrudManager (useCrudList)
PlanManager               → CrudManager
TestimonialManager        → CrudManager

SidebarNav                → ui/sidebar          (ui/sidebar é SKIP, aresta benigna)
CheckoutFlow              → EfiCreditCardForm
CustomizationEditor       → ConfigTab
report-panels             → report-shared
```

Demais componentes (28 dos 42) não têm dependências internas ao set — cada um é "folha".

### 4.2 Camadas

| Camada | Critério       | Itens                     |
| ------ | -------------- | ------------------------- |
| **L0** | sem dep no set | 26 (após excluir 2 SKIPs) |
| **L1** | só dep de L0   | 11                        |
| **L2** | dep de L1      | 3                         |

**L0 (26 itens):** AuditAnalysis · DesignForm · CrudManager · AssessmentList · ResultsTab · ConfigTab · TemplateSection · ProductShowcase · TestimonialsTab · PremiumTestimonials · Nav · Ato2Jornada · PlansTab · ClientPlanSection · FeaturesGrid · Ato1Site · CoverSection · primitives · Ato4ScreensB · Ato3Encontro · MethodologyTab · report-shared · PremiumHero · OptionPanel · EfiCreditCardForm · FaqTab.

**L1 (11 itens):** TransformationEditor · WorkoutEditor · PlanManager · TestimonialManager · QuestionScreen · QuestionStep · SidebarNav · report-panels · CheckoutFlow · CustomizationEditor · LandingEditor.

**L2 (3 itens):** AuditForm · LeadForm · SiteHub.

Total a decompor: 26 + 11 + 3 = **40**. Plano-mãe pediu 39 fases (88-126). Resolvido por 1 agrupamento natural (§5.4).

### 4.3 Diagrama de dependências (alto nível)

```mermaid
graph BL
  classDef l0 fill:#1e1e2e,stroke:#7aa2f7,color:#cdd6f4
  classDef l1 fill:#1e1e2e,stroke:#a6e3a1,color:#cdd6f4
  classDef l2 fill:#1e1e2e,stroke:#f38ba8,color:#cdd6f4
  classDef skip fill:#1e1e2e,stroke:#6c7086,color:#9399b2,stroke-dasharray: 4 2

  CrudManager:::l0
  primitives:::l0
  ConfigTab:::l0
  EfiCreditCardForm:::l0
  ResultsTab:::l0
  TestimonialsTab:::l0
  PlansTab:::l0
  MethodologyTab:::l0
  FaqTab:::l0
  reportShared["report-shared"]:::l0
  sidebar["ui/sidebar (SKIP)"]:::skip

  TransformationEditor:::l1
  WorkoutEditor:::l1
  PlanManager:::l1
  TestimonialManager:::l1
  QuestionScreen:::l1
  QuestionStep:::l1
  CustomizationEditor:::l1
  CheckoutFlow:::l1
  reportPanels["report-panels"]:::l1
  SidebarNav:::l1
  LandingEditor:::l1

  LeadForm:::l2
  AuditForm:::l2
  SiteHub:::l2

  CrudManager --> TransformationEditor
  CrudManager --> WorkoutEditor
  CrudManager --> PlanManager
  CrudManager --> TestimonialManager

  primitives --> QuestionScreen
  primitives --> QuestionStep
  primitives --> AuditForm
  primitives --> LeadForm

  ConfigTab --> CustomizationEditor
  EfiCreditCardForm --> CheckoutFlow
  reportShared --> reportPanels
  sidebar -.-> SidebarNav

  ResultsTab --> LandingEditor
  TestimonialsTab --> LandingEditor
  PlansTab --> LandingEditor
  MethodologyTab --> LandingEditor
  FaqTab --> LandingEditor

  QuestionScreen --> AuditForm
  QuestionStep --> LeadForm

  LandingEditor --> SiteHub
  PlanManager --> SiteHub
  TestimonialManager --> SiteHub
```

---

## 5 · Atribuição de fases 88-126

### 5.1 Princípios de ordenação (por que NÃO é só worst-first)

1. **Topologia primeiro:** L0 inteira antes de L1, L1 inteira antes de L2.
2. **Dentro da camada, "folha crítica" antes de "folha isolada":** componentes que destravam mais consumidores rodam antes — quem pegar L1 logo depois evita rebase.
3. **Worst-first como tie-breaker dentro do mesmo grupo de criticidade.**
4. **Agrupamento aceito apenas para par fortemente acoplado** (§5.4).

### 5.2 Bloco L0 — Folhas críticas primeiro (Fases 88-96, 9 fases)

> Decompor estes 9 antes de qualquer L1 evita 11 conflitos potenciais de import.

| Fase | Arquivo                                                     | Linhas | Bloqueia                                                             |
| ---- | ----------------------------------------------------------- | ------ | -------------------------------------------------------------------- |
| 88   | `components/ui/CrudManager.tsx`                             | 579    | TransformationEditor, WorkoutEditor, PlanManager, TestimonialManager |
| 89   | `components/form/lead/_steps/primitives.tsx`                | 335    | QuestionScreen, QuestionStep, AuditForm, LeadForm                    |
| 90   | `components/landing/editor/_components/ResultsTab.tsx`      | 531    | LandingEditor                                                        |
| 91   | `components/funnel/tabs/ConfigTab.tsx`                      | 517    | CustomizationEditor                                                  |
| 92   | `components/landing/editor/_components/TestimonialsTab.tsx` | 410    | LandingEditor                                                        |
| 93   | `components/landing/editor/_components/PlansTab.tsx`        | 394    | LandingEditor                                                        |
| 94   | `components/landing/editor/_components/MethodologyTab.tsx`  | 321    | LandingEditor                                                        |
| 95   | `components/subscription/_checkout/EfiCreditCardForm.tsx`   | 305    | CheckoutFlow                                                         |
| 96   | `components/landing/editor/_components/FaqTab.tsx`          | 302    | LandingEditor                                                        |

### 5.3 Bloco L0 — Folhas isoladas (Fases 97-112, 16 fases)

Worst-first dentro do grupo:

| Fase | Arquivo                                                                 | Linhas |
| ---- | ----------------------------------------------------------------------- | ------ |
| 97   | `components/report/audit/AuditAnalysis.tsx`                             | 909    |
| 98   | `components/settings/DesignForm.tsx`                                    | 676    |
| 99   | `components/clients/AssessmentList.tsx`                                 | 574    |
| 100  | `components/diagnostic-activation/_sections/TemplateSection.tsx`        | 431    |
| 101  | `components/landing/onboarding/ProductShowcase.tsx`                     | 417    |
| 102  | `components/landing/premium/sections/PremiumTestimonials.tsx`           | 402    |
| 103  | `components/landing/onboarding/Nav.tsx`                                 | 400    |
| 104  | `components/landing/onboarding/storyboard/Ato2Jornada.tsx`              | 398    |
| 105  | `components/clients/ClientPlanSection.tsx`                              | 385    |
| 106  | `components/landing/onboarding/FeaturesGrid.tsx`                        | 375    |
| 107  | `components/landing/onboarding/storyboard/Ato1Site.tsx`                 | 373    |
| 108  | `components/report/audit/_sections/CoverSection.tsx`                    | 356    |
| 109  | `components/landing/onboarding/storyboard/_components/Ato4ScreensB.tsx` | 326    |
| 110  | `components/landing/onboarding/storyboard/Ato3Encontro.tsx`             | 323    |
| 111  | `components/landing/premium/sections/PremiumHero.tsx`                   | 312    |
| 112  | `components/funnel/tabs/_respostas/OptionPanel.tsx`                     | 309    |

### 5.4 Fase agrupada — par fortemente acoplado (Fase 113, 1 fase)

| Fase | Arquivos agrupados                                                                                                              | Linhas | Justificativa                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 113  | `components/funnel/tabs/_components/report-shared.tsx` (319) **+** `components/funnel/tabs/_components/report-panels.tsx` (560) | 879    | `report-panels` consome diretamente de `report-shared` (linha 38: `import { BaseRef, metricHasEdits, PANEL_CLASS, PANEL_FOOTER_CLASS, PanelHeader, type PanelState, reportHasEdits, SLOT_LABEL_KEY, VIZ_LABEL_KEY, VIZ_VALUES } from './report-shared'`). Decompor separadamente forçaria 2 PRs com rebase mútuo. Fase única extrai shared helpers para `_helpers/` e parte panels em panels individuais (`IntroPanel`, etc.) sem ping-pong de imports. |

Esta é a **única** concessão de agrupamento. Permite fechar em 39 fases (88-126) conforme plano-mãe.

### 5.5 Bloco L1 — Críticas primeiro (Fases 114-118, 5 fases)

| Fase | Arquivo                                          | Linhas | Bloqueia  |
| ---- | ------------------------------------------------ | ------ | --------- |
| 114  | `components/landing/editor/LandingEditor.tsx`    | 497    | SiteHub   |
| 115  | `components/plans/PlanManager.tsx`               | 534    | SiteHub   |
| 116  | `components/testimonials/TestimonialManager.tsx` | 394    | SiteHub   |
| 117  | `components/form/audit/QuestionScreen.tsx`       | 411    | AuditForm |
| 118  | `components/form/lead/_steps/QuestionStep.tsx`   | 338    | LeadForm  |

### 5.6 Bloco L1 — Isoladas (Fases 119-123, 5 fases)

| Fase | Arquivo                                       | Linhas |
| ---- | --------------------------------------------- | ------ |
| 119  | `components/clients/TransformationEditor.tsx` | 576    |
| 120  | `components/clients/WorkoutEditor.tsx`        | 560    |
| 121  | `components/dashboard/SidebarNav.tsx`         | 428    |
| 122  | `components/subscription/CheckoutFlow.tsx`    | 331    |
| 123  | `components/funnel/CustomizationEditor.tsx`   | 304    |

### 5.7 Bloco L2 — Roots (Fases 124-126, 3 fases)

| Fase | Arquivo                               | Linhas | Depende de                                                                      |
| ---- | ------------------------------------- | ------ | ------------------------------------------------------------------------------- |
| 124  | `components/form/audit/AuditForm.tsx` | 620    | primitives (Fase 89), QuestionScreen (Fase 117)                                 |
| 125  | `components/form/lead/LeadForm.tsx`   | 638    | primitives (Fase 89), QuestionStep (Fase 118)                                   |
| 126  | `components/site/SiteHub.tsx`         | 586    | LandingEditor (Fase 114), PlanManager (Fase 115), TestimonialManager (Fase 116) |

---

## 6 · Padrão de decomposição (por fase)

Toda fase 88-126 segue o mesmo template, derivado de `PADRAO-VALIDADO.md` (Fase 47) e da convenção do projeto:

1. **Não mudar a API exportada.** O componente continua exportando o mesmo nome (`LeadForm`, `CrudManager`, etc.) com a mesma signature; consumidores não são tocados.
2. **Decompor para `_components/` ou `_sections/` ou `_steps/`** ao lado do orchestrator (mesmo nível de pasta), conforme convenção já existente do componente. Se o componente já tem `_components/`, novos arquivos vão lá.
3. **Orchestrator < 300 linhas** após decompose. Cada arquivo extraído também < 300 linhas (alvo: 100-200l).
4. **Separar:** types/constantes em `_types.ts` ou no topo do orchestrator, hooks complexos em `_hooks/use*.ts`, sub-renders em `_components/<Nome>.tsx` ou `_sections/<Nome>.tsx`.
5. **Imports absolutos via `@/components/...`** quando o sub-arquivo é referenciado de outro lugar; relativos `./` quando interno ao bloco.
6. **Zero mudança de comportamento** — testes unitários e snapshot precisam continuar passando idênticos. Se um teste tinha que mudar, é refator escondido — parar e levantar bandeira ao fundador.
7. **Sweep tokens não é desta etapa.** Tipografia, shapes, cores e a11y já foram cobertos pelas Etapas 4-7 antes da Fase 87 começar. Se passar por algum bypass deixado escapar, abrir débito — não consertar nesta fase.

Cada fase 88-126 deve gerar 1 PR com:

- 1 commit principal de decompose (orchestrator + novos arquivos)
- Comando de medida: `wc -l <arquivo-original>` antes/depois — todos < 300l
- Verificação: `tsc 0`, `vitest passa`, `lint 0 errors`, `build 93/93`

---

## 7 · Paralelismo (até 3 terminais)

Cada onda só começa após **100% da onda anterior estar mergeada em main**:

| Onda                 | Fases             | Fases simultâneas (3 terminais) | Tempo estimado serial | Tempo paralelo (3 terms) |
| -------------------- | ----------------- | ------------------------------- | --------------------- | ------------------------ |
| **A** — L0 críticas  | 88-96 (9 fases)   | qualquer combinação de 3        | ~13h                  | ~5h                      |
| **B** — L0 isoladas  | 97-112 (16 fases) | qualquer combinação de 3        | ~22h                  | ~8h                      |
| **C** — par agrupado | 113 (1 fase)      | sozinha (par acoplado, 1 PR)    | ~3h                   | ~3h                      |
| **D** — L1 críticas  | 114-118 (5 fases) | qualquer combinação de 3        | ~9h                   | ~3h                      |
| **E** — L1 isoladas  | 119-123 (5 fases) | qualquer combinação de 3        | ~7h                   | ~3h                      |
| **F** — L2 roots     | 124-126 (3 fases) | as 3 simultâneas                | ~5h                   | ~2h                      |
| **Total**            | **39**            |                                 | **~59h serial**       | **~24h paralelo**        |

> Estimativas de tempo são aproximadas (~1.5h/fase média; AuditAnalysis 909l e DesignForm 676l demandam 2-3h).

### 7.1 Regras de paralelismo (vinculantes)

- **Onda A → B → C → D → E → F.** Não cruzar ondas: terminal não pode pegar L1 antes de L0 fechar (H7).
- Dentro da mesma onda, qualquer combinação simultânea é segura (não há aresta entre componentes da mesma camada).
- Antes de iniciar cada fase, terminal roda `git worktree list` e verifica que nenhuma fase ativa pertence a uma onda incompatível com a sua.
- Após merge de todas as fases da onda, **checkpoint visual 30min** no diretório principal validando build + lint + smoke `pnpm dev` em 3 rotas (não exigido pelo PROTOCOLO entre 9.A e 9.F mas recomendado entre B↔C e E↔F dado o volume).

### 7.2 Coordenação entre terminais

- Cada terminal abre 1 worktree por fase (`onboarding-bio-fase-NN/`) seguindo PROTOCOLO-TERMINAL.md.
- Branch: `feat/fase-NN-decompose-<slug-curto>` (ex: `feat/fase-88-decompose-crudmanager`).
- Slug = nome do arquivo principal em kebab-case sem extensão.
- Mensagem ao fundador antes de começar lista as 2 fases compatíveis que poderiam abrir como Terminal B e C.

---

## 8 · Critérios de aceitação (por fase 88-126)

Cada fase fecha quando **todas as 5 condições** abaixo passam:

1. ✅ Arquivo orchestrator original `< 300 linhas`.
2. ✅ Cada arquivo novo gerado por decompose `< 300 linhas`.
3. ✅ `pnpm exec tsc --noEmit` → 0 erros.
4. ✅ `pnpm exec vitest run` → suíte verde, mesmos testes passando que antes (nada removido).
5. ✅ `pnpm lint` → 0 erros (warnings podem aparecer pré-Fase 157).
6. ✅ `pnpm build` → 93/93 páginas compilando.
7. ✅ Diff de comportamento = zero. Se a fase precisar mexer em comportamento, **parar** e abrir débito separado.

E mais:

8. ✅ CHECKLIST.md atualizado com `[x]` + sha do commit.
9. ✅ Pulos justificados (motivo de uma frase por arquivo não decomposto dentro do escopo da fase).

---

## 9 · Cenário de falha (descobrir nova dependência durante decompose)

Se durante uma fase o terminal descobrir que o componente importa **outro do set 42** que não está mapeado na §4.1 (ex: import via barrel file `index.ts`, dynamic import, lazy import), seguir:

1. **Parar imediatamente.** Não mexer.
2. Mensagem ao fundador no formato BLOQUEIO do PROTOCOLO-TERMINAL.md §"Quando travar".
3. Fundador decide:
   - **A:** Atualizar este DECOMPOSE-ORDER.md (re-rodar análise) — fase pausa até nova ordem.
   - **B:** Mover a fase para depois da nova dep — terminal swap pra outra fase compatível.
   - **C:** Tratar como "edge case isolado" — incluir no escopo da fase atual com nota no CHECKLIST.

A decisão é do fundador. Terminal não cisma sozinho.

---

## 10 · Referências cruzadas

- `docs/refatoracao-2026-05/execucao/PLANO-FINAL.md` — plano-mãe (esta fase é §"ETAPA 9", linha 286-296).
- `docs/refatoracao-2026-05/execucao/PROTOCOLO-TERMINAL.md` — fluxo de cada fase.
- `docs/refatoracao-2026-05/execucao/PADRAO-VALIDADO.md` — padrão de decompose validado pela Fase 47 (orchestrator + `_components/`).
- `CLAUDE.md` §"Componentes" — convenção `< 300 linhas`.
- `CLAUDE.md` §"Abstrações disponíveis" — `CrudManager`, `useCrudList` (consumers a preservar).

---

## 11 · Histórico de revisões

| Data       | Sha                 | Mudança                                                                    |
| ---------- | ------------------- | -------------------------------------------------------------------------- |
| 2026-05-05 | (commit da Fase 87) | Versão inicial — 39 fases atribuídas, 2 SKIPs justificados, 1 agrupamento. |
