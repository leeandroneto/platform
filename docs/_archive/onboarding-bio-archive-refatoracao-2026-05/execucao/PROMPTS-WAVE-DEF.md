# Prompts Wave DEF — Etapa 9 Ondas D + E + F (13 fases pra fechar Etapa 9)

> **Set-and-forget.** Founder abre 3 terminais, cola 1 linha em cada, vai dormir/passear. Cada terminal mantém **2 subagentes rodando em paralelo o tempo todo**, drenando a fila própria de fases até esvaziar. Total: 13 fases mergeadas em ~3-4h wall-clock.

---

## Estado base (verificado 2026-05-05)

13 fases pendentes da Etapa 9, todas confirmadas >300l:

| Onda | Fase | Arquivo                                          | Linhas |
| ---- | ---- | ------------------------------------------------ | ------ |
| D    | 114  | `components/landing/editor/LandingEditor.tsx`    | 497    |
| D    | 115  | `components/plans/PlanManager.tsx`               | 534    |
| D    | 116  | `components/testimonials/TestimonialManager.tsx` | 394    |
| D    | 117  | `components/form/audit/QuestionScreen.tsx`       | 412    |
| D    | 118  | `components/form/lead/_steps/QuestionStep.tsx`   | 312    |
| E    | 119  | `components/clients/TransformationEditor.tsx`    | 576    |
| E    | 120  | `components/clients/WorkoutEditor.tsx`           | 560    |
| E    | 121  | `components/dashboard/SidebarNav.tsx`            | 462    |
| E    | 122  | `components/subscription/CheckoutFlow.tsx`       | 350    |
| E    | 123  | `components/funnel/CustomizationEditor.tsx`      | 304    |
| F    | 124  | `components/form/audit/AuditForm.tsx`            | 613    |
| F    | 125  | `components/form/lead/LeadForm.tsx`              | 631    |
| F    | 126  | `components/site/SiteHub.tsx`                    | 586    |

---

## Distribuição em 3 filas (respeita topologia)

Cada terminal tem uma fila própria. Dentro da fila, as fases L2 só rodam depois das L1 dependentes terem mergeado.

### Fila T1 — chain "SiteHub" (4 fases)

```
F114 (LandingEditor) ─┐
F115 (PlanManager)   ─┼─→ F126 (SiteHub) [precisa de F114+F115+F116]
F116 (TestimonialManager) ─┘
```

Ordem de execução: `F114 + F115` em paralelo → `F116` (assim que slot livrar) → `F126` (quando 114+115+116 mergeados).

### Fila T2 — chains "Forms" (4 fases)

```
F117 (QuestionScreen) ──→ F124 (AuditForm) [precisa de F117]
F118 (QuestionStep)   ──→ F125 (LeadForm)  [precisa de F118]
```

Ordem: `F117 + F118` em paralelo → `F124` quando F117 mergeada, `F125` quando F118 mergeada (paralelos entre si).

### Fila T3 — L1 isoladas (5 fases)

```
F119 (TransformationEditor)
F120 (WorkoutEditor)
F121 (SidebarNav)
F122 (CheckoutFlow)
F123 (CustomizationEditor)
```

Ordem: `F119 + F120` em paralelo → `F121` quando primeira livrar → `F122` quando segunda livrar → `F123` quando próxima livrar. Sempre 2 em paralelo até a fila esvaziar.

---

## Como o founder usa

**Antes de começar (1 vez):**

```bash
cd C:/Users/leean/Desktop/onboarding-bio
git stash                  # tem 2 arquivos modificados, salva
git pull origin main       # estado limpo
```

**Abre 3 janelas Claude Code, espera 30s entre cada, e cola UMA LINHA em cada uma:**

| Janela | Cola isto                           |
| ------ | ----------------------------------- |
| 1ª     | `execute T1 do PROMPTS-WAVE-DEF.md` |
| 2ª     | `execute T2 do PROMPTS-WAVE-DEF.md` |
| 3ª     | `execute T3 do PROMPTS-WAVE-DEF.md` |

**Depois:** vai dormir/passear. Cada terminal vai drenar sua fila sozinho. Quando todos os 3 terminais reportarem `🏁 Fila concluída`, todas as 13 fases estarão mergeadas em main.

---

## Protocolo de cada terminal (quando recebe `execute T<N>`)

1. **Verifica model.** Lê o próprio system prompt (linha "You are powered by the model named ..."). T1 e T2 precisam de **Opus 4.7** (têm fases >500l). T3 pode ser Sonnet 4.6 ou Opus. Se model errado, pede `/model` e PARA até receber "ok".

2. **Pre-flight:**

   ```bash
   cd C:/Users/leean/Desktop/onboarding-bio
   git fetch origin
   git pull origin main
   ```

   Lê estes arquivos uma vez:
   - `docs/refatoracao-2026-05/execucao/SUBAGENT-TEMPLATE-OVERNIGHT.md`
   - `docs/refatoracao-2026-05/execucao/PADRAO-VALIDADO.md`
   - `docs/refatoracao-2026-05/execucao/DECOMPOSE-ORDER.md` §6 (padrão de decompose)

3. **Inicia o orchestrator loop** (descrito abaixo).

4. **Modo autônomo total** — sem perguntar nada ao founder. Spawn de subagentes, commits, force-with-lease push, gh auto-merge, tudo na corrida.

5. **NUNCA toque** em `CHECKLIST.md`, `CLAUDE.md`, `docs/historico-fases.md`. Founder consolida depois.

---

## Orchestrator loop (cada terminal segue)

**Estado mantido pelo terminal:**

- `queue` — lista de fases pendentes da própria fila
- `running` — set de fases atualmente em flight (max 2)
- `merged` — set de fases mergeadas em main
- `failed` — set de fases que falharam

**Loop principal:**

```
enquanto queue NÃO vazia OU running NÃO vazio:
  preencha slots livres:
    enquanto |running| < 2 E existe fase elegível em queue:
      pegue próxima fase elegível da queue (dep satisfeita = todas em merged)
      remova da queue, adicione em running
      spawn subagente em background pra essa fase (ver template abaixo)

  espere notificação de fim de algum subagente:
    se ✅ sucesso → mova de running pra merged
    se ❌ falha → mova de running pra failed; reporta no fim mas continua drenando o resto
    se ⚠️ parcial (PR aberta sem merge) → mova de running pra failed (founder resolve manual)

ao final:
  reporte: 🏁 Fila T<N> concluída — merged: [lista], failed: [lista]
  STOP.
```

**Como spawn em background:** use a tool `Agent` com `run_in_background: true`. O harness avisa quando o subagente termina, sem polling/sleep.

**Como saber dep satisfeita:**

- F124 elegível ⇔ F117 ∈ merged
- F125 elegível ⇔ F118 ∈ merged
- F126 elegível ⇔ {F114, F115, F116} ⊆ merged
- todas as outras (F114-F123) são elegíveis sempre

**Resumo prático por terminal:**

- **T1** (queue: 114, 115, 116, 126): spawn F114+F115 logo de cara. Quando uma terminar, spawn F116. F126 só entra quando 114, 115, 116 todos em `merged`.
- **T2** (queue: 117, 118, 124, 125): spawn F117+F118 logo de cara. Quando F117 terminar, spawn F124. Quando F118 terminar, spawn F125.
- **T3** (queue: 119, 120, 121, 122, 123): spawn F119+F120 logo de cara. Cada vez que um slot livrar, pegue a próxima da fila (121, 122, 123 nessa ordem).

---

## Template do subagente (orchestrator usa esse prompt pra cada fase)

Quando o orchestrator decide spawn da fase NN, lança `Agent` com este prompt (substituindo as variáveis):

```
Execute Fase {NN} — decompose autônomo.

VARIÁVEIS:
- NN = {NN}
- FILE = {FILE}
- LINES = {LINES}
- SLUG = {SLUG}
- KIND = decompose
- DEPS_MERGED = {DEPS}
- ATENÇÃO_ESPECIAL = {NOTES}

INSTRUÇÕES:
1. Modo autônomo total — fundador ausente. Sem perguntas. Execute → commit → push → MERGE → STOP.
2. Siga LITERAL `docs/refatoracao-2026-05/execucao/SUBAGENT-TEMPLATE-OVERNIGHT.md` (pré-flight, decompose, verificação binária, commit, push, PR, auto-merge, cleanup).
3. Tokens visuais: `docs/refatoracao-2026-05/execucao/PADRAO-VALIDADO.md` é contrato vinculante.
4. Etapa 9 §6.7: NÃO faça sweep de tokens. Bypasses pré-existentes ficam verbatim.
5. NÃO toque CHECKLIST.md, CLAUDE.md, docs/historico-fases.md, ou consumers fora do FILE/sub-componentes.
6. Trabalho dentro de:
   a) Lê o FILE inteiro ({LINES} linhas).
   b) `grep -rn "from.*<basename(FILE)>" components/ app/` pra mapear API pública. Anote tudo — esses exports NÃO podem mudar.
   c) Plana splits semânticos por responsabilidade (sub-renders → `_components/<Nome>.tsx` ou `_sections/` ou `_steps/` conforme convenção do diretório). Hooks complexos → `_hooks/`. Types compartilhados → `_types.ts`.
   d) Cada arquivo final < 300l (alvo 100-200l).
   e) Aplica decompose. Sem mudança de comportamento.
   f) Verifica binária NESTA ORDEM:
      - `pnpm exec tsc --noEmit` → 0 erros
      - `pnpm exec vitest run` → ≥513 passing
      - `pnpm lint` → 0 errors
      - `pnpm build` → 94/94
   g) Se algo falhar: investiga, ajusta, repete (max 3x). Ainda falhar → reporta ❌ e PARA.
7. Verde → segue commit + push + PR + `sleep 30 && gh pr merge --squash --delete-branch` + cleanup do worktree.
8. Reporte único final (uma linha):
   - ✅ Fase {NN} OK — sha <sha>, PR #<n> mergeada
   - ❌ Fase {NN} FALHOU — <motivo>
   - ⚠️ Fase {NN} PARCIAL — PR #<n> aberta, <motivo>
```

---

## Variáveis por fase (orchestrator preenche o template)

### Onda D

**F114** — `<NN>=114`, `<FILE>=components/landing/editor/LandingEditor.tsx`, `<LINES>=497`, `<SLUG>=landing-editor`, `<DEPS>=F90 ResultsTab ✅, F92 TestimonialsTab ✅, F93 PlansTab ✅, F94 MethodologyTab ✅, F96 FaqTab ✅`. **Notas:** orchestrator das 5 tabs já decompostas. Diretório já tem `_components/`. Decompose tipicamente extrai toolbar/header/preview pane.

**F115** — `<NN>=115`, `<FILE>=components/plans/PlanManager.tsx`, `<LINES>=534`, `<SLUG>=plan-manager`, `<DEPS>=F88 CrudManager ✅`. **Notas:** consumer de `CrudManager`. Form de plano (price/billing/features) provavelmente vira sub-componente. Mantém API `useCrudList`/`CrudManager`.

**F116** — `<NN>=116`, `<FILE>=components/testimonials/TestimonialManager.tsx`, `<LINES>=394`, `<SLUG>=testimonial-manager`, `<DEPS>=F88 CrudManager ✅`. **Notas:** consumer de `CrudManager`. Form tem photo upload — provável sub `_components/PhotoUploadField.tsx`. Padrão: `CasePhotoUpload` da F90.

**F117** — `<NN>=117`, `<FILE>=components/form/audit/QuestionScreen.tsx`, `<LINES>=412`, `<SLUG>=question-screen`, `<DEPS>=F89 primitives ✅`. **Notas:** consome `Section`, `OptionList`, `FieldStack`, `NumInput`, `BigCard`, `PillGroup`. Sub-renders por question type (single/multi/numeric) provavelmente viram componentes em `_components/`.

**F118** — `<NN>=118`, `<FILE>=components/form/lead/_steps/QuestionStep.tsx`, `<LINES>=312`, `<SLUG>=question-step`, `<DEPS>=F89 primitives ✅`. **Notas:** menor da onda. 1-2 sub-componentes resolvem (renderizadores por tipo). Convenção: já há `_steps/` com primitives barrel.

### Onda E

**F119** — `<NN>=119`, `<FILE>=components/clients/TransformationEditor.tsx`, `<LINES>=576`, `<SLUG>=transformation-editor`, `<DEPS>=F88 CrudManager ✅`. **Notas:** maior da Onda E. Before/after photos + medidas. Subs prováveis: `_components/BeforeAfterUpload.tsx`, `MeasurementsForm.tsx`, `TransformationListItem.tsx`. Padrão: F90 ResultsTab.

**F120** — `<NN>=120`, `<FILE>=components/clients/WorkoutEditor.tsx`, `<LINES>=560`, `<SLUG>=workout-editor`, `<DEPS>=F88 CrudManager ✅`. **Notas:** lista exercícios com sets/reps/load/rest. Subs prováveis: `_components/ExerciseRow.tsx`, `WorkoutPlanForm.tsx`, `ExpandedPlanPanel.tsx`. **Preserve** ARIA disclosure de F78 (`aria-expanded`/`aria-controls="workout-plan-panel-${id}"`).

**F121** — `<NN>=121`, `<FILE>=components/dashboard/SidebarNav.tsx`, `<LINES>=462`, `<SLUG>=sidebar-nav`, `<DEPS>=ui/sidebar SKIP (mantém)`. **Notas:** **MANTÉM** os exports `NAV_ITEMS` e `NAV_MOBILE_ITEMS` (consumed por `MobileNav.tsx`). Mantém `SidebarHelp` sub-componente da F85. Tokens `--sidebar-*` multi-tenant. ARIA disclosure F78.

**F122** — `<NN>=122`, `<FILE>=components/subscription/CheckoutFlow.tsx`, `<LINES>=350`, `<SLUG>=checkout-flow`, `<DEPS>=F95 EfiCreditCardForm ✅`. **Notas:** orchestrator EFI (credit card + PIX + bypass free). Subs prováveis: `_components/CheckoutSummary.tsx`, `PaymentMethodTabs.tsx`, `PixQrPanel.tsx`. **CRÍTICO:** preserve o bypass `manual_bypass` da PT Beta (`finalCents === 0` → `handleBypass()` direto sem PIX, entregue 2026-05-04).

**F123** — `<NN>=123`, `<FILE>=components/funnel/CustomizationEditor.tsx`, `<LINES>=304`, `<SLUG>=customization-editor`, `<DEPS>=F91 ConfigTab ✅`. **Notas:** menor da onda, 4l acima do gate. 1 extração resolve. `components/funnel/` já tem `_respostas/` e `tabs/_components/`.

### Onda F

**F124** — `<NN>=124`, `<FILE>=components/form/audit/AuditForm.tsx`, `<LINES>=613`, `<SLUG>=audit-form`, `<DEPS>=F89 primitives ✅, F117 QuestionScreen (esperar merge na própria fila T2)`. **Notas:** orchestrator do form de diagnóstico do prospect (`/diagnostico`). State multi-step persistente, navegação back/forward. Subs prováveis: `_components/AuditFormStepper.tsx`, `AuditFormHeader.tsx`, `AuditFormFooter.tsx`. Hook estado em `_hooks/useAuditFormState.ts`. Mantém handler de submit (chama Edge Function `generate-diagnostic`).

**F125** — `<NN>=125`, `<FILE>=components/form/lead/LeadForm.tsx`, `<LINES>=631`, `<SLUG>=lead-form`, `<DEPS>=F89 primitives ✅, F118 QuestionStep (esperar merge na própria fila T2)`. **Notas:** maior arquivo da wave. Orchestrator do form de lead (`/[slug]/analise`). Já tem `_steps/` populado. Decompose foca em hook de estado + header/footer.

**F126** — `<NN>=126`, `<FILE>=components/site/SiteHub.tsx`, `<LINES>=586`, `<SLUG>=site-hub`, `<DEPS>=F114 + F115 + F116 (esperar todas merge na própria fila T1)`. **Notas:** orchestrator do dashboard `/site` (editor do site público do profissional). Já consome shadcn `ResizablePanelGroup` (F45Q). Subs prováveis: `_components/SiteHubSidebar.tsx`, `SiteHubPreview.tsx`, `SiteHubToolbar.tsx`. **PRESERVE** persistência localStorage (`landing-editor-preview-layout`).

---

## Modelo recomendado por terminal

| Terminal | Fila                    | Modelo                     | Motivo                                                              |
| -------- | ----------------------- | -------------------------- | ------------------------------------------------------------------- |
| T1       | 114, 115, 116, 126      | **Opus 4.7**               | F126 SiteHub 586l + F115 PlanManager 534l                           |
| T2       | 117, 118, 124, 125      | **Opus 4.7**               | F124 AuditForm 613l + F125 LeadForm 631l                            |
| T3       | 119, 120, 121, 122, 123 | **Opus 4.7** ou Sonnet 4.6 | F119 + F120 são >500l mas decompose simples (CrudManager consumers) |

Se quiser misturar modelos, T3 pode ser Sonnet — economiza Opus pros forms grandes.

---

## Wall-clock estimado

- T1: paralelo F114+F115 (~1.5h) → F116 sozinho (~1h) → F126 sozinho (~2h) = **~4.5h**
- T2: paralelo F117+F118 (~1.5h) → paralelo F124+F125 (~2.5h) = **~4h**
- T3: paralelo F119+F120 (~2h) → paralelo F121+F122 (~1.5h) → F123 sozinho (~45min) = **~4.5h**

Wall-clock total (3 terminais rodando em paralelo): **max(T1, T2, T3) ≈ 4.5h**.

---

## Reporte final do founder

Quando os 3 terminais reportarem `🏁 Fila concluída`:

```bash
cd C:/Users/leean/Desktop/onboarding-bio
git fetch origin && git pull origin main
find components -name "*.tsx" | xargs wc -l | awk '$1 > 300 && $2 != "total"' | sort -rn
```

Esperado: apenas `components/ui/sidebar.tsx` (697l) + `components/ui/chart.tsx` (368l) — ambos SKIPs.

Verificações finais:

- `pnpm exec tsc --noEmit` → 0
- `pnpm exec vitest run` → ≥513 passing
- `pnpm lint` → 0 errors
- `pnpm build` → 94/94
- `pnpm metrics:check` → sem regressão

Tudo verde: abre PR consolidado de docs (`CHECKLIST.md` Etapa 9 100% ✅ + `CLAUDE.md` atualizado + `docs/historico-fases.md` com 13 entradas das fases 114-126). **Etapa 9 fechada — destrava Etapa 10** (decompose pages 127-131).
