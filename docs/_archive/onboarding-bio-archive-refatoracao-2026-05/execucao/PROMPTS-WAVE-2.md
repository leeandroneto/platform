# Prompts Wave 2 — 8 fases focadas

> **Contexto:** segunda rodada autônoma após overnight de ontem (29/33 mergeadas, 17 sólidas, 11 com dívida menor, 1 ❌ falso-AAA).
> **Esta wave fecha:** 4 fases que não mergearam ontem (F97, F100, F113, F141) + 4 re-fases WCAG identificadas pela auditoria (F133-redux, F136-redux, F139-redux, F140-redux).
> **Objetivo:** Etapa 9 L0 100% mergeada + Etapa 11 WCAG AAA com audit scripts preventivos (sem regressão silenciosa).

---

## Como usar

1. Reinicia o computador (estado limpo, sem processos zumbis).
2. Abre **8 janelas Claude Code** (cada uma um terminal separado).
3. Em cada terminal, cole **uma única mensagem**:
   > `leia docs/refatoracao-2026-05/execucao/PROMPTS-WAVE-2.md — você é T<N>`
   > (substitui `<N>` por 1..8)
4. **Espera ~30s entre abrir um terminal e o próximo** (evita pnpm install collision).
5. O terminal **vai conferir o model atual** primeiro. Se bater com o exigido pra essa fase, executa autônomo. Se não bater, ele pede `/model <nome>` e PARA até você confirmar.
6. Você fica presente mas **não autoriza nada** — fases rodam autônomas, mergeiam PR sozinhas, terminam.

---

## Protocolo de ativação (todo terminal segue)

Quando receber `você é T<N>`:

1. **Verifica o model atual** lendo o próprio system prompt — a linha `You are powered by the model named ...` indica `Opus 4.7` ou `Sonnet 4.6`.
2. Compara com o **Modelo necessário** declarado na seção `## T<N>` correspondente.
3. **Se bater:** segue direto pro bloco de instruções de T<N> e executa em modo autônomo total (sem pedir autorização — fundador presente mas inerte).
4. **Se NÃO bater:** responde apenas:
   > `⚠️ Estou em <model atual>. T<N> precisa de <model necessário>. Roda /model <nome> e me dá um "ok" pra eu seguir.`
   > E PARA. Não executa nada até receber "ok".
5. Pré-flight comum (todos os terminais, depois do match de model):
   - `cd C:\Users\leean\Desktop\onboarding-bio`
   - `git fetch origin && git pull origin main`
   - Lê `docs/refatoracao-2026-05/execucao/SUBAGENT-TEMPLATE-OVERNIGHT.md`
   - Lê `docs/refatoracao-2026-05/execucao/PADRAO-VALIDADO.md`
   - Confirma `git log -1 --oneline` antes de criar worktree
6. **NÃO TOCAR em nenhum terminal:** `CHECKLIST.md`, `CLAUDE.md`, `docs/historico-fases.md`.
7. Reporte final único por terminal:
   - `✅ Fase <NN> OK — sha <sha>, PR #<n> mergeada`
   - `❌ Fase <NN> FALHOU — <motivo>`
   - `⚠️ Fase <NN> PARCIAL — PR #<n> aberta, <motivo>`
     E STOP.

---

## Distribuição de modelos

| Terminal | Fase       | Modelo   | Tipo                                             | Tempo estimado |
| -------- | ---------- | -------- | ------------------------------------------------ | -------------- |
| T1       | F97        | **Opus** | Decompose 909l                                   | 1.5-2h         |
| T2       | F100       | Sonnet   | Decompose 431l (recovery)                        | 30-45min       |
| T3       | F113       | **Opus** | Decompose par agrupado 879l                      | 1.5-2h         |
| T4       | F141       | Sonnet   | WCAG sweep (recovery)                            | 45-60min       |
| T5       | F133-redux | **Opus** | WCAG Visual Presentation completo + audit script | 1-1.5h         |
| T6       | F136-redux | Sonnet   | WCAG Motion completeness + audit script          | 30-45min       |
| T7       | F139-redux | Sonnet   | WCAG Auto-advance onboarding + audit script      | 45-60min       |
| T8       | F140-redux | Sonnet   | WCAG Destructive dialogs + audit script          | 30-45min       |

**Total:** 5 Sonnet + 3 Opus. Wall-clock se rodando paralelo: ~2h.

---

## Padrões-ouro identificados na auditoria (referenciados nos prompts)

- **PR #109 (F134 keyboard)** — padrão de WCAG: audit script com regex robusto + allowlist tipada + CI integration. Base obrigatória pras re-fases WCAG.
- **PR #114 (F108 CoverSection)** — padrão de decompose: sub-componentes nomeados por região visual + extração de constants.
- **PR #102 (F102 PremiumTestimonials)** — padrão de decompose por responsabilidade: types compartilhados re-exportados, lógica encapsulada por sub-componente.

---

## T1 — Fase 97

**Modelo necessário:** Opus 4.7
**Tipo:** Decompose 909l
**Tempo estimado:** 1.5-2h

Executa fase 97 seguindo `SUBAGENT-TEMPLATE-OVERNIGHT.md` com:

- NN = 97
- FILE = `components/report/audit/AuditAnalysis.tsx`
- LINES = 909
- SLUG = `audit-analysis`
- KIND = `decompose`

**Atenção especial — maior arquivo da wave (909l):**

- Lê o arquivo INTEIRO antes de planejar.
- Padrão referência: `components/report/audit/_sections/CoverSection.tsx` (PR #114) — decompose regional com sub-componentes nomeados por região visual.
- Espera-se 5-6 sub-componentes em `components/report/audit/_analysis/`.
- Sugestão de splits: `AnalysisCover`, `AnalysisPillars`, `AnalysisRecommendations`, `AnalysisInsights`, `AnalysisCTA` (semântico, não mecânico).
- **Types compartilhados:** se múltiplos sub-arquivos usam o mesmo type, cria `components/report/audit/_analysis/types.ts` (não duplica — ver auditoria F101).
- Commit incrementalmente (a cada 2-3 sub-componentes extraídos).

---

## T2 — Fase 100 (recovery)

**Modelo necessário:** Sonnet 4.6
**Tipo:** Decompose 431l com worktree pré-existente
**Tempo estimado:** 30-45min

**Recovery de trabalho parcial:**
Existe worktree em `../onboarding-bio-fase-100` com commit local `caf4fbaf` `"feat(100): decompose TemplateSection 431l → 80l"`. Tua tarefa:

1. `cd ../onboarding-bio-fase-100`
2. `git status` (verifica se está limpo no worktree)
3. `git fetch origin && git rebase origin/main` (resolve conflitos se houver)
4. `cp ../onboarding-bio/.env.local .env.local`
5. `pnpm install`
6. Roda **verificação binária** do template (tsc, vitest, lint, build).
7. Se TUDO verde: prossegue pra push + PR + merge (passos 4-6 do template).
8. Se algo falhar: investiga, ajusta, repete verificação. Máximo 3x. Se ainda falhar: descarta worktree, refaz do zero seguindo template normal com:
   - FILE = `components/diagnostic-activation/_sections/TemplateSection.tsx`
   - LINES = 431
   - SLUG = `template-section`
   - KIND = `decompose`

**Padrão referência:** PR #114 (CoverSection decompose) — sub-componentes nomeados por região + `types.ts` se houver shared types.

---

## T3 — Fase 113 (par agrupado)

**Modelo necessário:** Opus 4.7
**Tipo:** Decompose par fortemente acoplado (879l)
**Tempo estimado:** 1.5-2h

**Leitura adicional obrigatória:** `docs/refatoracao-2026-05/execucao/DECOMPOSE-ORDER.md` §5.4 (par agrupado, justificativa).

Executa fase 113 — par fortemente acoplado:

- FILE A: `components/funnel/tabs/_components/report-shared.tsx` (319l)
- FILE B: `components/funnel/tabs/_components/report-panels.tsx` (560l)
- TOTAL: 879l → cada arquivo final < 300l
- NN = 113
- SLUG = `report-shared-panels`
- KIND = `decompose`

**Estratégia obrigatória (vide §5.4):**

1. Lê AMBOS os arquivos INTEIROS antes de planejar.
2. `report-panels.tsx` importa de `report-shared.tsx` 11+ símbolos: `BaseRef`, `metricHasEdits`, `PANEL_CLASS`, `PANEL_FOOTER_CLASS`, `PanelHeader`, `PanelState`, `reportHasEdits`, `SLOT_LABEL_KEY`, `VIZ_LABEL_KEY`, `VIZ_VALUES`, e mais.
3. Refator em 2 etapas:
   - **Etapa A:** extrai shared helpers para `components/funnel/tabs/_components/_helpers/` (cria `_helpers/types.ts`, `_helpers/constants.ts`, `_helpers/PanelHeader.tsx` etc — agrupando semanticamente).
   - **Etapa B:** decompõe `report-panels.tsx` em arquivos individuais por panel (`IntroPanel`, etc.) em `_panels/`.
4. Sem ping-pong de imports — `_helpers/` não importa de `_panels/`, `_panels/` importa de `_helpers/`.
5. `report-shared.tsx` vira fino (re-export de `_helpers/`) ou some inteiro (consumers passam a importar direto de `_helpers/`).
6. `report-panels.tsx` vira fino (orchestrator que importa `_panels/`).

**Verifica consumers (grep crítico):**

- `grep -rn "from.*report-shared" components/ app/`
- `grep -rn "from.*report-panels" components/ app/`

Mantém API pública dos DOIS arquivos.

**Padrão referência:** PR #102 (PremiumTestimonials) — types compartilhados re-exportados, encapsulamento por responsabilidade.

**Commit incrementalmente:**

- Commit 1: helpers extraídos
- Commit 2: panels decompostos

---

## T4 — Fase 141 (recovery)

**Modelo necessário:** Sonnet 4.6
**Tipo:** WCAG 3.3.9 Accessible Auth Enhanced — worktree com suspeita de contaminação
**Tempo estimado:** 45-60min

**Investigação primeiro:**
Existe worktree em `../onboarding-bio-fase-141` com:

- Commit local `0f54a634` `"feat(141): wcag 3.3.9 accessible auth enhanced"`
- 1 arquivo uncommitted: `components/landing/editor/_components/PlansTab.tsx` (suspeita de contaminação — esse arquivo é da F93 mergeada, nada a ver com F141).

**Procedimento:**

1. `cd ../onboarding-bio-fase-141`
2. `git diff` (verifica o que está uncommitted).
3. Se o uncommitted for só re-ordenação de imports do hook autofix (zero mudança funcional): `git checkout -- components/landing/editor/_components/PlansTab.tsx` (descarta).
4. Se for mudança real: investiga e decide (provavelmente descartar mesmo).
5. `git fetch origin && git rebase origin/main`
6. `cp ../onboarding-bio/.env.local .env.local`
7. `pnpm install`
8. Verificação binária (tsc, vitest, lint, build).
9. Se verde: push + PR + merge.
10. Se falhar 3x: descarta worktree, refaz do zero com KIND=wcag, foco em **3.3.9 Accessible Auth Enhanced** (zero cognitive function tests em qualquer auth flow).

**Padrão referência:** PR #88 (F85 mergeada) — base WCAG 3.3.7/3.3.8 já feita; F141 é o nível Enhanced (AAA). Reusa estrutura do `audit:wcag-auth` se aplicável.

---

## T5 — Fase 133-redux (WCAG Visual Presentation completo)

**Modelo necessário:** Opus 4.7
**Tipo:** WCAG sweep ~70 containers + audit script
**Tempo estimado:** 1-1.5h

**Contexto:**

- F133 original (PR #113) foi falso-AAA — só cobriu 7/78 arquivos. Mergeou utility `.reading-prose` em `globals.css` mas com 0 callers reais. Containers principais (HeroSection, JourneySection, PillarsSection, ObservationsSection, PremiumPlans, etc) continuam sem `max-w-[80ch]`. Sem audit script.
- Esta fase cobre TODOS os ~70 containers de prosa + cria audit script preventivo.

**Setup worktree:**

1. `git worktree add ../onboarding-bio-fase-133-redux -b feat/fase-133-redux-visual-presentation`
2. `cd ../onboarding-bio-fase-133-redux`
3. `cp ../onboarding-bio/.env.local .env.local`
4. `pnpm install`

**Trabalho:**

1. Sweep no codebase — identifica containers que renderizam prosa longa (parágrafos contínuos > 1-2 linhas em viewport médio). Foco:
   - `components/landing/onboarding/sections/*` (Hero, Journey, Pillars, Observations, etc)
   - `components/landing/premium/sections/*`
   - `components/launch/_sections/*`
   - `components/report/lead/_sections/*`
   - `components/report/audit/_sections/*`
   - `components/diagnostic-activation/_sections/*`
   - `app/(public)/lgpd/`, `/legal/`, `/privacy/`, `/cookies/`, `/terms/`
2. Adiciona `max-w-[80ch]` OU classe `.reading-prose` nos containers de prosa identificados.
3. Aplica `leading-relaxed` (1.625) onde estiver `leading-normal/snug` em prosa.
4. Confirma paragraph spacing 1.5x line-height (margem entre `<p>` ou `space-y` consistente).
5. NÃO aplica em headings, labels, buttons, badges — só prosa de leitura.

**Criar audit script `scripts/audit-wcag-visual-prose.ts`:**

- Padrão: PR #109 (F134 `audit-wcag-keyboard.ts`) — base obrigatória.
- Lê 734 files do codebase.
- Detecta `<p>` ou `<Text variant=body*>` com >1 linha de texto sem ancestor `max-w-[80ch]` OU class `reading-prose`.
- Allowlist tipada com justificativa per-entry (ex: prosa em modal pequeno onde 80ch não cabe).
- Modo `--json` pra CI.
- Exit 1 em violação.
- Adiciona npm script `audit:wcag-visual-prose`.
- Adiciona ao `.husky/pre-push`.

**Verificação binária + nova:**

- tsc 0
- vitest pass
- lint 0 errors
- build 94/94
- `pnpm audit:wcag-visual-prose` (novo) — espera 0 violations OU allowlist documentada.

**Reporte final:** inclui no `✅` quantos containers foram cobertos.

---

## T6 — Fase 136-redux (Motion completeness)

**Modelo necessário:** Sonnet 4.6
**Tipo:** WCAG Motion guard JS-side + audit script
**Tempo estimado:** 30-45min

**Contexto:**

- F136 original (PR #96) aplicou `useReducedMotion()` na maioria mas deixou 4 arquivos sem guard:
  - `components/launch/_sections/Ticker.tsx` (ou similar)
  - `components/landing/premium/sections/PremiumTicker.tsx`
  - `components/landing/onboarding/storyboard/WizardMock.tsx`
  - `components/landing/onboarding/Marquee.tsx` (ou similar)
- CSS-only `@media (prefers-reduced-motion)` NÃO cobre Motion 12 runtime — precisa `import { useReducedMotion } from 'motion/react'`.
- Esta fase cobre os 4 + cria audit script preventivo.

**Setup worktree:**

1. `git worktree add ../onboarding-bio-fase-136-redux -b feat/fase-136-redux-motion-complete`
2. `cd ../onboarding-bio-fase-136-redux`
3. `cp ../onboarding-bio/.env.local .env.local`
4. `pnpm install`

**Trabalho:**

1. Localiza via grep os 4 arquivos exatos (Ticker, PremiumTicker, WizardMock, Marquee).
2. Em cada um: identifica `repeat:Infinity` ou `animate({ x:[0,-1000] })` ou similar; adiciona guard:
   ```ts
   const shouldReduceMotion = useReducedMotion()
   // ... { animate: shouldReduceMotion ? {} : { x: [0, -1000] } }
   ```
3. Verifica se tem outros arquivos com `repeat:Infinity` sem guard (audit do codebase). Se sim, cobre também.

**Criar audit script `scripts/audit-wcag-motion.ts`:**

- Padrão: PR #109 (F134 audit script) — base obrigatória.
- Detecta `repeat:\s*Infinity\b` OU `@keyframes infinite` OU `animation-iteration-count:\s*infinite` em arquivos `.tsx/.ts/.css`.
- Para cada hit, verifica se o mesmo arquivo tem `useReducedMotion()` OU ancestor lógico tem (heurística simples: import de `useReducedMotion` no file).
- Allowlist tipada (ex: ambient meshes que são intencionais sempre).
- Exit 1 em violação.
- Adiciona npm script `audit:wcag-motion` + `.husky/pre-push`.

**Verificação binária:**

- tsc, vitest, lint, build padrão.
- `pnpm audit:wcag-motion` — 0 violations.

**Reporte final:** inclui no `✅` quantos arquivos foram cobertos.

---

## T7 — Fase 139-redux (Auto-advance no onboarding)

**Modelo necessário:** Sonnet 4.6
**Tipo:** WCAG 3.2.5 Change on Request + audit script
**Tempo estimado:** 45-60min

**Contexto:**

- F139 original (PR #112): forms ok (LeadForm, AuditForm, QuestionScreen, QuestionStep), mas onboarding wizard ainda tem:
  - `app/(app)/onboarding/_steps/Checkpoint.tsx:42` — `setTimeout(() => onNext(), reduce ? 400 : 5500)` — AUTO-AVANÇA STEP em 5.5s sem input. Pior caso.
  - `app/(app)/onboarding/_steps/Celebration.tsx:52` — `setTimeout(() => setPhase('slug'), 3000)`
  - `app/(app)/onboarding/_steps/ReportPreview.tsx:38` — `setTimeout(() => setPhase('report'), NARRATIVE_DURATION_MS)`
- Critério WCAG 3.2.5: Change on Request — usuário deve solicitar mudança de contexto explicitamente.

**Setup worktree:**

1. `git worktree add ../onboarding-bio-fase-139-redux -b feat/fase-139-redux-onboarding-no-autoadvance`
2. `cd ../onboarding-bio-fase-139-redux`
3. `cp ../onboarding-bio/.env.local .env.local`
4. `pnpm install`

**Trabalho:**

1. `Checkpoint.tsx:42`:
   - Remove setTimeout auto-advance.
   - Adiciona botão "Continuar" explícito que dispara `onNext()`.
   - Mantém animação de 400ms se reduce, mas exige clique humano.
2. `Celebration.tsx:52`:
   - Substitui `setTimeout(setPhase)` por botão "Próximo" / "Ver meu site".
   - Animação de celebração pode rodar, mas transição de phase é por click.
3. `ReportPreview.tsx:38`:
   - Igual: setTimeout vira botão "Ver relatório completo".
4. Em todos os 3: respeita `prefers-reduced-motion` (sem celebração animada se reduzida).

**Criar audit script `scripts/audit-wcag-no-auto-advance.ts`:**

- Padrão: PR #109 (F134) — base obrigatória.
- Detecta `setTimeout|setInterval` que chama `setPhase|onNext|router.push|router.replace` dentro de `useEffect|onClick` (sem input do usuário).
- Heurística: `setTimeout(() => fn(), ms)` onde `fn` é navegação ou state-machine transition, e não há eventListener/onClick wrapper.
- Allowlist: tela de loading com timeout máximo (ex: spinner que muda mensagem após 5s mas não navega), countdown que pergunta antes de navegar.
- Exit 1 em violação.
- Adiciona npm script + `.husky/pre-push`.

**Verificação binária:**

- tsc, vitest, lint, build.
- `pnpm audit:wcag-no-auto-advance` — 0 violations.

**Reporte final:** inclui no `✅` "3 auto-advance removidos, audit script criado".

---

## T8 — Fase 140-redux (Destructive dialogs)

**Modelo necessário:** Sonnet 4.6
**Tipo:** WCAG 3.3.6 Error Prevention All + audit script
**Tempo estimado:** 30-45min

**Contexto:**

- F140 original (PR #115): confirm dialogs em delete client, delete plan, etc. Faltou:
  - `components/clients/LeadFollowUpEditor.tsx` — `handleClear` (atualmente click-twice legado, sem `AlertDialog`).
  - `components/clients/AssessmentList.tsx` — `handleDelete` (sem confirm).
- Critério WCAG 3.3.6: Error Prevention All — toda ação destrutiva tem prevenção (confirm dialog ou undo).

**Setup worktree:**

1. `git worktree add ../onboarding-bio-fase-140-redux -b feat/fase-140-redux-destructive-dialogs`
2. `cd ../onboarding-bio-fase-140-redux`
3. `cp ../onboarding-bio/.env.local .env.local`
4. `pnpm install`

**Trabalho:**

1. `LeadFollowUpEditor.tsx` `handleClear`:
   - Migra de click-twice/double-confirm legado pra shadcn `AlertDialog`.
   - Padrão: `AlertDialog` com title "Limpar histórico de follow-ups?" + description + Cancel/Confirm buttons.
2. `AssessmentList.tsx` `handleDelete`:
   - Wrappa com `AlertDialog` igual.
3. Procura (grep) outras ações destrutivas que possam ter sido perdidas: `window.confirm(`, "delete", "remove", "limpar" — audita.
4. Deleta dead constants (ex: `DELETE_CONFIRM_TIMEOUT` que sobrou do padrão antigo).

**Criar audit script `scripts/audit-wcag-destructive-confirm.ts`:**

- Padrão: PR #109 (F134) — base obrigatória.
- Detecta funções com nomes `handleDelete|handleRemove|handleClear|onDelete|onRemove|onClear` (regex em `export const` ou `function`).
- Para cada hit, verifica se o mesmo arquivo importa `AlertDialog` OU `window.confirm` OU tem state `useState<{open: boolean}>`.
- Allowlist: deletes não-destrutivos (ex: clear filter, clear search), undo-friendly (toast com undo), modal interno.
- Exit 1 em violação.
- Adiciona npm script + `.husky/pre-push`.

**Verificação binária:**

- tsc, vitest, lint, build.
- `pnpm audit:wcag-destructive-confirm` — 0 violations.

**Reporte final:** inclui no `✅` quantos dialogs foram adicionados.

---

## Pós-execução (você de manhã ou após terminarem)

Quando todos 8 reportarem (sucesso ou falha), execute:

```bash
cd C:\Users\leean\Desktop\onboarding-bio
git fetch origin --prune
git pull origin main
git log --oneline -10                    # ver os novos PRs em main
gh pr list --state merged --limit 10     # confirmar 8 mergearam
git worktree list                        # confirmar limpos
```

**Próximos passos sugeridos:**

1. **Trivial fixes** (5 min cada, manual):
   - PR #101 fix: `cd worktree && pnpm prettier --write components/subscription/_checkout/EfiCreditCardForm.tsx` → commit + push
   - PR #122 doc fix: editar `CLAUDE.md` linha "Estado atual" mudando "Lc≥90" pra "Lc≥75 AAA normal/large"

2. **PR consolidado de docs:**
   - Atualizar `docs/refatoracao-2026-05/execucao/CHECKLIST.md` marcando todas fases [x] com sha
   - Atualizar `docs/historico-fases.md` com entradas das 8 novas fases
   - Atualizar `CLAUDE.md` "Estado atual" — Etapa 9 L0 100% + Etapa 11 100% + audit scripts criados

3. **Wave 3 (próxima noite):**
   - Etapa 9 L1+L2 (fases 114-126, 13 fases) — agora desbloqueado pois L0 fechou
   - Distribuição similar: 4-5 paralelos máximo, single-fase per terminal pra reduzir bug surface
