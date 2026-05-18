# ⚠️ ARQUIVADO — Substituído em 2026-05-14

> **Este plano foi substituído por [`docs/planos/PLANO-UNICO.md`](../../planos/PLANO-UNICO.md).**
>
> Mantido como histórico das fases 1-141 que foram executadas. Fases pendentes (F80, F127-F131, F142-F153, F157-F161, M1-M20) foram repriorizadas no PLANO-UNICO com escopo reduzido pelo pivot pro desafit.app (ver §5 do novo plano).
>
> Não usar este plano como referência ativa. Decisões deste plano podem conflitar com o pivot pós-2026-05-04.

---

# Plano Final — Opção D Beck-compliant — 154 fases (29-161 + 45H-45U)

> **Master único pra refatoração horizontal 100%.** Substitui qualquer plano anterior (`fase-28-consistencia-a11y.md`, `fase-23-fechamento-real.md` follow-ups).
> **Fase 28 já está concluída** (baseline em `AUDITORIA-CONSISTENCIA-A11Y.md`).
> **Protocolo de execução:** `PROTOCOLO-TERMINAL.md` — leitura obrigatória pra qualquer agente.
> **Snapshot inicial:** tsc 0, vitest 442/442, lint 0/0, knip 0, build 93/93.
> **Esforço:** ~330h serial OU ~148h com paralelismo + 15-30h fundador.
> **Auditoria shadcn completa:** `docs/core/SHADCN-AUDIT.md` + `docs/core/SHADCN-CATALOG.md`.

---

## Por que existe esta wave

Em 7 dias o projeto teve 4 tentativas de refatoração horizontal. Cada uma declarada concluída e o problema persistiu. Auditoria de hoje (Fase 28) revelou:

- 1.760 violações de tipografia (`text-{size}` solto)
- 591 violações de shape (`rounded-{size}` solto)
- 994 violações de cor inline
- 0 skip links (falha WCAG 2.4.1 Level A)
- 3 aria-current (deveria ter 30+)
- Multi-tenant funciona em **32%** da UI

**Diagnóstico:** 4 falhas anteriores foram de MÉTODO, não de TOPOLOGIA. Lint não cobria bypass; sem CI; atalhos invisíveis; fundador fora do loop.

**Esta wave é Beck-compliant ("Don't Cross the Beams"):** 1 vertical de prova → doc do padrão validado → sweeps horizontais mecânicos seguindo o doc. Ver `PROTOCOLO-TERMINAL.md`.

---

## Ordem (quick wins precoces)

| Etapa                                                     | Fases     | Quando você vê resultado                         | Tempo paralelo |
| --------------------------------------------------------- | --------- | ------------------------------------------------ | -------------- |
| 1 Estabilização                                           | 29-33     | Lint mostra 2400+ warnings                       | ~6h            |
| 2 ui/ + 3 primitives                                      | 34-45     | Eyebrow + SkipLink existem                       | ~5h            |
| **2.6 shadcn 100% adoption**                              | **45A-G** | **Shell, Auth, Nav, forms 100% shadcn**          | **~13.5h**     |
| **2.5 VRT baseline mini**                                 | **46**    | **5 rotas baseline capturadas**                  | **~1h**        |
| **2.7 Vertical de prova /r/[token] + PADRAO-VALIDADO.md** | **47**    | **/r/[token] 100% multi-tenant + doc do padrão** | **~5h**        |
| **3 A11y básico (skip link 7 layouts)**                   | **48-50** | **Skip link funciona em todas as 7 áreas**       | **~3h**        |
| 4 Shapes ⛓ após 47                                        | 51-56     | Multi-tenant SHAPES 100%                         | ~4h            |
| 5 Tipografia ⛓ após 4                                     | 57-66     | Multi-tenant TYPOGRAPHY 100%                     | ~6h            |
| 6 Casing + cores ⛓ após 5                                 | 67-75     | UI consistente                                   | ~10h           |
| 7 A11y completo ⛓ após 6                                  | 76-83     | Screen reader funciona                           | ~6h            |
| 8 WCAG AA (consolidado)                                   | 84-86     | Compliance legal                                 | ~3h            |
| 9 Decompose components (topológico)                       | 87-126    | 40 componentes <300l                             | ~30h           |
| 10 Decompose pages                                        | 127-131   | 5 pages decompostas                              | ~3h            |
| 11 WCAG AAA                                               | 132-141   | A11y premium                                     | ~6h            |
| 12 Visual QA 100% (119 rotas)                             | 142-153   | Validado                                         | ~16h           |
| 13 Edge/email/PDF (paralelo desde Etapa 4)                | 154-156   | Backend confere                                  | sobreposto     |
| 14 Hardening final (warn → error)                         | 157-161   | CI bloqueia regressão                            | ~4h            |
| **2.8 shadcn deep UX**                                    | **45H-U** | **Data table, command palette, charts tokens**   | **~23h**       |
| **Total**                                                 | **154**   |                                                  | **~148h**      |

---

## Hard dependencies cross-etapa (CRÍTICO — quem ignora gera conflito de merge)

| #       | Dependência                                                    | Razão                                                                      |
| ------- | -------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **H1**  | Fases 37-45 ⛓ depende de **34-36 mergeadas em main**           | API dos primitives novos batida em pedra antes dos consumidores            |
| **H2**  | Fase 47 ⛓ depende de Fase 46                                   | Vertical compara contra VRT baseline                                       |
| **H3**  | Fase 48+ ⛓ depende de Fase 47 + `PADRAO-VALIDADO.md` publicado | Sweeps seguem mapeamento documentado                                       |
| **H4**  | **Etapa 5 ⛓ depende de Etapa 4 100% mergeada**                 | Mesmas subpastas — paralelo cross-etapa = conflito                         |
| **H5**  | **Etapa 6 ⛓ depende de Etapa 5 100% mergeada**                 | Idem                                                                       |
| **H6**  | **Etapa 7 ⛓ depende de Etapa 6 100% mergeada**                 | Idem                                                                       |
| **H7**  | Etapa 9 ordem **topológica** (folha→root) interna              | Componente importável depois importadores                                  |
| **H8**  | **Etapa 13 (154-156) pode iniciar a partir de Etapa 4**        | Codebase Deno separado — paralelo cross-etapa OK                           |
| **H9**  | Fases 45A-45G ⛓ depende de **Fase 45 mergeada**                | shadcn install (45A) deve preceder migrations de consumers                 |
| **H10** | Fases 45B-45G ⛓ depende de **45A mergeada**                    | componentes não podem ser consumidos antes de instalados                   |
| **H11** | Fase 45I ⛓ depende de **45H mergeada**                         | InputGroup só pode ser consumido após instalação (45H)                     |
| **H12** | Fase 45K ⛓ depende de **45J mergeada**                         | ChartContainer wrapping pressupõe tokens `--color-score-*` OK              |
| **H13** | Fase 45M ⛓ depende de **45A mergeada** (Data Table install)    | TanStack Table já instalado (knip.json), mas shadcn `table` precisa de 45A |
| **H14** | Fase 45N ⛓ depende de **45A mergeada** (Command instalado)     | Command Palette consome componente shadcn `command`                        |
| **H15** | Fases 45H-45U ⛓ depende de **45A mergeada**                    | toda ETAPA 2.8 pressupõe registry up-to-date de 45A                        |
| **H16** | Fase 45L ⛓ depende de **45K mergeada**                         | ProfileRadar novo usa ChartContainer, validado após wrap pass              |

**Checkpoints visuais 30min** (não-fases) entre Etapas 4↔5, 5↔6, 6↔7. Ritual obrigatório no `PROTOCOLO-TERMINAL.md`:

1. Subir `pnpm dev`
2. Abrir 5 rotas em 3 paletas × 3 shapes (45 combos)
3. Comparar contra /r/[token] (rota de referência da Fase 47)
4. ✅ libera próxima etapa | ❌ reabre fase anterior

---

## ETAPA 1 — Estabilização (29-33)

| Fase | Descrição                                                                                         | Modelo | Tempo |
| ---- | ------------------------------------------------------------------------------------------------- | ------ | ----- |
| 29   | Lint coverage: 5 regras como **warn** (não error ainda — promove na 157) + allowlist override     | Sonnet | 2h    |
| 30   | Allowlist refinada (eslint-disable com motivo)                                                    | Sonnet | 1h    |
| 31   | Script `pnpm metrics:audit` + `metrics.baseline.json`                                             | Sonnet | 2h    |
| 32   | CI hard gates (pre-push hook + GitHub Action)                                                     | Sonnet | 3h    |
| 33   | Confirmar `PROTOCOLO-TERMINAL.md` atualizado (incluindo Checkpoints 30min) e linkado em CLAUDE.md | Sonnet | 2h    |

**Paralelismo:** 29 → (30 🔀 31 🔀 33) → 32

---

## ETAPA 2 — Componentes ui/ + 3 primitives novos (34-45)

| Fase | Descrição                                                          | Modelo | Tempo |
| ---- | ------------------------------------------------------------------ | ------ | ----- |
| 34   | Criar `components/ui/eyebrow.tsx`                                  | Sonnet | 1.5h  |
| 35   | Criar `components/ui/skip-link.tsx` + i18n + scroll-padding-bottom | Sonnet | 1.5h  |
| 36   | Criar `components/ui/section-title.tsx`                            | Sonnet | 1h    |
| 37   | Migrar `alert.tsx` ⛓ H1                                            | Sonnet | 1h    |
| 38   | Migrar `calendar.tsx` ⛓ H1                                         | Sonnet | 1h    |
| 39   | Migrar `chart.tsx` ⛓ H1                                            | Opus   | 1.5h  |
| 40   | Migrar `command.tsx` ⛓ H1                                          | Sonnet | 1h    |
| 41   | Migrar `empty.tsx` + `field.tsx` ⛓ H1                              | Sonnet | 1h    |
| 42   | Migrar `item.tsx` + `kbd.tsx` ⛓ H1                                 | Sonnet | 1h    |
| 43   | Migrar `skeleton.tsx` + `tabs.tsx` ⛓ H1                            | Sonnet | 1h    |
| 44   | Migrar `toggle.tsx` + `toggle-group.tsx` + `tooltip.tsx` ⛓ H1      | Sonnet | 1.5h  |
| 45   | Auditar `dropdown-menu.tsx` + `select.tsx` (mistos) ⛓ H1           | Opus   | 2h    |

**Paralelismo:** (34+35+36) 🔀 → merge → (37-44 paralelo, até 4 terminais) → 45.

---

## ETAPA 2.6 — shadcn 100% adoption (45A-45G)

⛓ H9: depende de Fase 45 mergeada. ⛓ H10: Fases 45B-45G dependem de 45A mergeada.

| Fase | Descrição                                                                                                                                                                                                                                                      | Modelo | Tempo |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| 45A  | Instalar componentes shadcn faltantes: `sidebar navigation-menu input-otp context-menu hover-card aspect-ratio resizable combobox slider` + instalar `button-group` e `input-group` via registry shadcn-blocks + verificar divergências com versões instaladas | Sonnet | 0.5h  |
| 45B  | DashboardShell → shadcn `Sidebar`: migrar `SidebarNav.tsx` (481l) + `DrawerNav.tsx` (224l) + `DashboardLayout.tsx` (90l) usando `sidebar-07` como base. `SidebarProvider` no layout root. `useSidebar()` para estado mobile                                    | Opus   | 3h    |
| 45C  | Auth pages → shadcn blocks: `login-01` e `signup-01` como referência visual. `Card+Form+Button` shadcn em `/login`, `/signup`, `/forgot-password`, `/reset-password`                                                                                           | Opus   | 2h    |
| 45D  | `NavigationMenu`: migrar `onboarding/Nav.tsx` (438l) + `PremiumNav.tsx` (169l) para shadcn `NavigationMenu` + `NavigationMenuItem` + `NavigationMenuLink` + `NavigationMenuTrigger`                                                                            | Opus   | 3h    |
| 45E  | Componentes ignorando shadcn instalado: `FAQ.tsx`→`Accordion`, `BottomSheet`→`Drawer`, `Divider`→`Separator`, `EmailConfirmBanner`→`Alert`, `LeadStatusChanger`→`Select`, `DeleteConfirmation`→`AlertDialog`                                                   | Opus   | 2h    |
| 45F  | Forms: `FormModal`→`Dialog+Form`, `ExitSurveyModal`→`Dialog`, `MultiSelect`→`Command+combobox`, `PlanSelector`→`Card+RadioGroup`, `PaymentHistorySection`→`Table`                                                                                              | Opus   | 2h    |
| 45G  | `MobileNav` cleanup: garantir apenas primitivos shadcn internamente (`Sheet`, `Button`, `Separator`). Validar que `useSidebar()` coordena com DashboardShell (45B)                                                                                             | Sonnet | 1h    |

**Paralelismo:** 45A sozinha → (45B 🔀 45C 🔀 45D) → (45E 🔀 45F) → 45G.

---

## ETAPA 2.8 — shadcn deep UX (45H-45U)

⛓ H15: todas dependem de **45A mergeada**. Ver H11-H16 para deps internas.

| Fase | Descrição                                                                                                                                                                                                                                                                                                                                                                                     | Modelo | Tempo |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| 45H  | Instalar `slider` (via 45A), `button-group`, `input-group` via registry shadcn-blocks. **Deletar duplicatas:** `funnel/shared/Field.tsx` → substituído por `components/ui/field.tsx` shadcn; `dashboard/CopyLinkButton.tsx` → substituído por `components/ui/CopyButton.tsx`. Ajustar callers.                                                                                                | Sonnet | 1.5h  |
| 45I  | **InputGroup** em formulários: `LoginForm`, `SignupForm`, `ResetPasswordForm` (ícone Mail + senha toggle); campos de unidade em steps de formulário de lead (kg, cm, anos) com `<InputGroup suffix="kg">`. ⛓ H11                                                                                                                                                                              | Sonnet | 2h    |
| 45J  | **CRÍTICO — fix light mode:** todos os gauges (`BmiArc`, `FfmiGauge`, `HrZoneArc`, `MacroDonut`, `WaterDrop`) — hex hardcoded (`#4ade80`, `#fbbf24`, `#f87171`, `#38bdf8`, etc.) → `var(--color-score-low)`, `var(--color-score-mid)`, `var(--color-score-high)`, `var(--color-score-danger)` em `app/globals.css`. Tokens definidos 1× como OKLCH em globals, consumidos em todos os gauges. | Opus   | 2h    |
| 45K  | **ChartContainer wrap:** `LeadsChart.tsx`, `MacroDonut.tsx`, `BarComparison.tsx` → envolver com `ChartContainer` do shadcn `chart.tsx`. Aproveitar `useChart()` para tooltip styling consistente. Manter Motion SVG interno intacto. ⛓ H12                                                                                                                                                    | Opus   | 2h    |
| 45L  | **Novo `ProfileRadar.tsx`:** componente `report/metrics/ProfileRadar` com `recharts RadarChart` + `ChartContainer` + shadcn `ChartTooltip`. Visualiza 5-6 dimensões do lead (força, resistência, mobilidade, etc.) via OKLCH tokens. ⛓ H16                                                                                                                                                    | Opus   | 2.5h  |
| 45M  | **Data Table (maior impacto):** migrar lista de leads (`app/(shell)/leads/page.tsx`) e lista de clientes (`app/(shell)/clients/page.tsx`) para `tanstack/react-table` + shadcn `Table` + `DataTable` pattern (sorting, filtering, pagination, row selection). ⛓ H13                                                                                                                           | Opus   | 4h    |
| 45N  | **Command Palette ⌘K global:** `CommandPalette.tsx` com `cmdk`/shadcn `Command` + `useHotkeys` (`⌘K`/`Ctrl+K`). Ações: navegar rotas shell, buscar leads, buscar clientes, ações rápidas (nova lead, copiar link). Provider no `(shell)/layout.tsx`. ⛓ H14                                                                                                                                    | Opus   | 3h    |
| 45O  | **Date Range Picker** em dashboard: substituir inputs de data manual em filtros de leads/clientes pelo shadcn `Calendar` + `Popover` pattern (date range). Integrar com filtros da Data Table (45M).                                                                                                                                                                                          | Sonnet | 2h    |
| 45P  | **HoverCard + ContextMenu:** `HoverCard` em preview de lead card (foto, nome, status, data). `ContextMenu` em linhas da Data Table (45M): ações Editar, Copiar link, Arquivar, Deletar.                                                                                                                                                                                                       | Sonnet | 2h    |
| 45Q  | **Resizable panels** no `LandingEditor`: painel lateral de configuração + preview central usando shadcn `ResizablePanelGroup` + `ResizablePanel` + `ResizableHandle`. Handle com grip visual.                                                                                                                                                                                                 | Opus   | 2.5h  |
| 45R  | **Sonner action buttons + InputOTP + Tooltip audit:** Sonner toasts com botão Desfazer em ações destrutivas (arquivar lead, deletar). `InputOTP` shadcn em fluxo de verificação de email/código. Audit de `Tooltip` em 15+ botões icon-only sem aria-label.                                                                                                                                   | Sonnet | 2h    |
| 45S  | **Auth layout blocks:** adotar visual de `login-04`/`signup-04` (split-screen com imagem/ilustração à esquerda, form à direita). Adaptar para design tokens do projeto.                                                                                                                                                                                                                       | Opus   | 1.5h  |
| 45T  | **shadcnblocks.com research + integração:** revisar blocos disponíveis em shadcnblocks.com (hero, features, testimonials, pricing, CTA, stats, FAQ, gallery). Selecionar 3-5 blocos de maior impacto para landing pública + integrar adaptados aos tokens do projeto.                                                                                                                         | Opus   | 4h    |
| 45U  | **Misc migrations:** `InfluencerNav` → `Tabs`; `OptionBrowser` → `Command` combobox; `DesignForm` color swatch → `field-choice-card` pattern; `PlansPage` billing toggle → `RadioGroup`; `SubscriptionCard` tier info → `HoverCard`.                                                                                                                                                          | Sonnet | 2h    |

**Paralelismo:** 45H sozinha → (45I 🔀 45J) → (45K 🔀 45M 🔀 45N 🔀 45O 🔀 45P 🔀 45Q 🔀 45R 🔀 45S 🔀 45T 🔀 45U) → 45L (depende de 45K).

> **Nota sobre gauges (45J):** Os gauges SVG com `motion/react` (`BmiArc`, `FfmiGauge`, `HrZoneArc`, `WaterDrop`) são tecnicamente impossíveis de replicar fielmente com recharts (`whileInView pathLength`, animação sequencial por segmento, morfologia orgânica). **Decisão:** manter SVG custom, corrigir apenas os tokens de cor (45J). O `MacroDonut` pode receber ChartContainer como contexto (45K) sem mudar o SVG interno.

---

## ETAPA 2.5 — VRT baseline mini (46)

| Fase | Descrição                                                                                                                                                                         | Modelo         | Tempo |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----- |
| 46   | Setup Playwright básico + capturar 5 rotas chave (/login, /[slug], /dashboard, /r/[token], /diagnostic) em 375+1280, dark+light. Salvar em `e2e/snapshots/baseline-pre-vertical/` | Opus + browser | 1h    |

---

## ETAPA 2.7 — Vertical de prova /r/[token] + PADRAO-VALIDADO.md (47)

| Fase | Descrição                                                                                                                                                                                                                                                                                                                         | Modelo         | Tempo |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ----- |
| 47   | Refatorar /r/[token] end-to-end (typography + shapes + cores + casing + a11y + WCAG AA + decompose se >300l + 3 screenshots multi-tenant) + escrever `docs/refatoracao-2026-05/execucao/PADRAO-VALIDADO.md` (mapeamento literal por categoria + decisões de preservação + edge cases + exemplos antes/depois + padrão pra gauges) | Opus + browser | 5h    |

⛓ H2: depende de 46. ⛓ H3: desbloqueia Etapa 3 em diante.

**PADRAO-VALIDADO.md = contrato vinculante de TODOS os sweeps subsequentes.**

---

## ETAPA 3 — A11y básico CONSOLIDADO (48-50) — 7 layouts em 1 fase

| Fase | Descrição                                                                                                                                                                 | Modelo | Tempo |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| 48   | `<SkipLink>` + `<main>` em **7 layouts** (1 fase, 7 sub-itens A-G com commits separados): (auth), (shell), onboarding, (public)/diagnostic, (client), admin, (influencer) | Sonnet | 3h    |
| 49   | `aria-label` em todos os 26 `<nav>` distintos                                                                                                                             | Sonnet | 2h    |
| 50   | `aria-current="page"` em SidebarNav + MobileNav + DrawerNav + admin nav + influencer nav + tabs custom                                                                    | Sonnet | 3h    |

**Paralelismo:** sub-itens de 48 podem rodar em até 7 terminais simultâneos. 49 🔀 50.

---

## ETAPA 4 — Sweep SHAPES (51-56)

⛓ H3: depende de 47.

| Fase | Subpastas                                                                                                                                                                                                              | Modelo | Tempo |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| 51   | `dashboard/` + `leads/` + `clients/`                                                                                                                                                                                   | Opus   | 3h    |
| 52   | `settings/` + `auth/` + `account/` + `credentials/`                                                                                                                                                                    | Opus   | 2.5h  |
| 53   | `landing/` + `launch/` + `site/`                                                                                                                                                                                       | Opus   | 3h    |
| 54   | `report/` + `diagnostic-activation/` + `funnel/`                                                                                                                                                                       | Opus   | 3h    |
| 55   | `form/` + `template-picker/` + `influencer/` + `admin/` + `legal/` + `lgpd/` + `locations/` + `methodology/` + `motion/` + `plans/` + `public/` + `services/` + `shared/` + `subscription/` + `testimonials/` + `faq/` | Opus   | 3h    |
| 56   | `app/` (155 ocorrências)                                                                                                                                                                                               | Opus   | 3h    |

**Paralelismo:** até 6 terminais (subpastas distintas). **Checkpoint 30min antes de Etapa 5** ⛓ H4.

---

## ETAPA 5 — Sweep TIPOGRAFIA (57-66)

⛓ H4: depende de Etapa 4 100% mergeada.

| Fase | Subpastas                                                                                                                                                               | Modelo | Tempo |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ----- |
| 57   | `dashboard/` + `leads/` + `clients/`                                                                                                                                    | Opus   | 3h    |
| 58   | `settings/` + `auth/` + `account/` + `credentials/`                                                                                                                     | Opus   | 2.5h  |
| 59   | `landing/onboarding/` parte 1 (storyboard + sections)                                                                                                                   | Opus   | 2.5h  |
| 60   | `landing/onboarding/` parte 2 (editor + premium)                                                                                                                        | Opus   | 2.5h  |
| 61   | `landing/institucional/` + `launch/` + `site/`                                                                                                                          | Opus   | 2.5h  |
| 62   | `report/` (lead + audit)                                                                                                                                                | Opus   | 3h    |
| 63   | `diagnostic-activation/` + `funnel/`                                                                                                                                    | Opus   | 3h    |
| 64   | `form/` + `template-picker/` + `influencer/`                                                                                                                            | Opus   | 2.5h  |
| 65   | `admin/` + `legal/` + `lgpd/` + `plans/` + `methodology/` + `locations/` + `services/` + `faq/` + `testimonials/` + `subscription/` + `shared/` + `motion/` + `public/` | Opus   | 2.5h  |
| 66   | `app/` (510 ocorrências)                                                                                                                                                | Opus   | 3.5h  |

**Paralelismo:** até 6 terminais. **Checkpoint 30min antes de Etapa 6** ⛓ H5.

---

## ETAPA 6 — Sweep CASING + CORES (67-75)

⛓ H5: depende de Etapa 5 100% mergeada.

| Fase | Descrição                                                                                     | Modelo | Tempo |
| ---- | --------------------------------------------------------------------------------------------- | ------ | ----- |
| 67   | Eyebrow pattern → `<Eyebrow>` (~150)                                                          | Sonnet | 2.5h  |
| 68   | Status indicators → `<Badge variant>` (~80)                                                   | Sonnet | 2h    |
| 69   | Heading uppercase em title longo → sentence case + i18n caps → lowercase                      | Sonnet | 2h    |
| 70   | Sobras casing com eslint-disable + motivo                                                     | Sonnet | 1.5h  |
| 71   | `report/metrics/gauges/*` — hex → `var(--color-score-*)` (já validado pelo PADRAO da Fase 47) | Opus   | 2h    |
| 72   | `launch/_sections/*` + `diagnostic-activation/_sections/` — CSS vars locais                   | Opus   | 2.5h  |
| 73   | `landing/mockups/Mock*.tsx` — confirmar allowlist + comentário motivo                         | Sonnet | 1h    |
| 74   | Inline dynamic (item.color, props runtime) — auditar e manter                                 | Sonnet | 1.5h  |
| 75   | Sobras cores: estáticos com hex → className com tokens                                        | Opus   | 3h    |

**Paralelismo:** (67-70 casing) 🔀; (71-75 cores) 🔀. **Checkpoint 30min antes de Etapa 7** ⛓ H6.

---

## ETAPA 7 — A11y completo (76-83)

⛓ H6: depende de Etapa 6 100% mergeada.

| Fase | Descrição                                                                              | Modelo      | Tempo |
| ---- | -------------------------------------------------------------------------------------- | ----------- | ----- |
| 76   | `aria-describedby={errorId}` em forms críticos sem FormField + audit FormField runtime | Opus        | 3h    |
| 77   | `role="status" aria-live="polite"` + `role="alert"` em erros                           | Opus        | 2.5h  |
| 78   | `aria-expanded` + `aria-controls` em FAQ + disclosure custom                           | Opus        | 2.5h  |
| 79   | `aria-busy` em containers de listas durante loading                                    | Sonnet      | 2h    |
| 80   | Smoke SR test (VoiceOver) — 3 vídeos: /login, /onboarding, /dashboard                  | Opus + você | 2h    |
| 81   | Validar 1 h1 por page (page-by-page audit)                                             | Opus        | 3h    |
| 82   | `validateFocusRing(palette, theme)` em `lib/design/contrast.ts` + token `--focus-ring` | Opus        | 3h    |
| 83   | shadcn primitives `focus-visible:ring` com `var(--focus-ring)` + 10 combos validados   | Opus        | 3h    |

**Paralelismo:** (76-79) 🔀; 80 sozinha; (81+82) 🔀; 83 depende de 82.

---

## ETAPA 8 — WCAG 2.2 AA CONSOLIDADO (84-86) — 7 critérios em 3 fases

| Fase | Descrição                                                                                          | Modelo | Tempo |
| ---- | -------------------------------------------------------------------------------------------------- | ------ | ----- |
| 84   | **Forms WCAG AA:** 2.5.7 Dragging Movements + 2.5.8 Target Size + 1.3.5 Identify Input Purpose     | Opus   | 4h    |
| 85   | **Auth + help WCAG AA:** 3.2.6 Consistent Help + 3.3.7 Redundant Entry + 3.3.8 Accessible Auth Min | Sonnet | 4h    |
| 86   | **Focus WCAG AA:** 2.4.11 Focus Not Obscured Min                                                   | Opus   | 4h    |

**Paralelismo:** 3 fases 🔀.

---

## ETAPA 9 — Decompose components TOPOLÓGICO (87-126)

⛓ H7: ordem topológica (folha → root).

| Fase   | Descrição                                                                                                                                 |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 87     | **Análise topológica + escrever `DECOMPOSE-ORDER.md`** (1h, prerequisito do bloco)                                                        |
| 88-126 | 39 componentes decompostos na ordem topológica (lista provisória worst-first em `~/.claude/plans/refa-a-o-plano-de-sequential-breeze.md`) |

**Paralelismo:** até 3 terminais respeitando ordem topológica.

---

## ETAPA 10 — Decompose pages >300l (127-131)

| Fase | Arquivo                                | Linhas                           |
| ---- | -------------------------------------- | -------------------------------- |
| 127  | `app/(public)/coming-soon/page.tsx`    | 503                              |
| 128  | `app/(app)/(shell)/dashboard/page.tsx` | 454                              |
| 129  | `app/(app)/(shell)/clients/page.tsx`   | 352                              |
| 130  | `app/(app)/(shell)/leads/page.tsx`     | 326                              |
| 131  | `app/(public)/mockups/charts/page.tsx` | 395 (confirmar SKIP ou decompor) |

**Paralelismo:** até 5 terminais.

---

## ETAPA 11 — WCAG 2.2 AAA (132-141)

| Fase | Critério                                   | Modelo | Tempo |
| ---- | ------------------------------------------ | ------ | ----- |
| 132  | 1.4.6 Contrast Enhanced (Lc≥90)            | Opus   | 2h    |
| 133  | 1.4.8 Visual Presentation                  | Opus   | 2h    |
| 134  | 2.1.3 Keyboard No Exception                | Opus   | 2.5h  |
| 135  | 2.2.3 No Timing                            | Opus   | 1.5h  |
| 136  | 2.3.2 Three Flashes                        | Sonnet | 1h    |
| 137  | 2.4.12 Focus Not Obscured (Enhanced)       | Opus   | 2h    |
| 138  | 2.5.6 Concurrent Input Mechanisms          | Opus   | 1.5h  |
| 139  | 3.2.5 Change on Request                    | Opus   | 2h    |
| 140  | 3.3.6 Error Prevention All                 | Opus   | 3h    |
| 141  | 3.3.9 Accessible Authentication (Enhanced) | Sonnet | 1.5h  |

**Paralelismo:** até 4 terminais.

---

## ETAPA 12 — Visual QA 100% (142-153)

| Fase | Descrição                                                                               | Modelo         | Tempo |
| ---- | --------------------------------------------------------------------------------------- | -------------- | ----- |
| 142  | Setup Playwright VRT baseline expandido: 119 rotas em 375+1280, dark+light              | Opus + browser | 4h    |
| 143  | `@axe-core/playwright` em CI: TODAS 119 rotas, 0 violations WCAG 2.2 AA+AAA             | Opus           | 3h    |
| 144  | `@axe-core/react` em dev (console runtime)                                              | Sonnet         | 1h    |
| 145  | Manual sweep parte 1 — shell (30 rotas)                                                 | Opus + você    | 3h    |
| 146  | Manual sweep parte 2 — public (30 rotas)                                                | Opus + você    | 3h    |
| 147  | Manual sweep parte 3 — auth+onboarding+client+influencer (30 rotas)                     | Opus + você    | 3h    |
| 148  | Manual sweep parte 4 — admin+marketing+legal+restantes (29 rotas)                       | Opus + você    | 3h    |
| 149  | Lighthouse a11y 119 rotas via script — meta ≥95                                         | Opus           | 2h    |
| 150  | Smoke SR (VoiceOver) — 8 fluxos completos                                               | Opus + você    | 2h    |
| 151  | Multi-tenant manual: 5 paletas × 3 shapes × 4 typographies em 5 rotas (300 screenshots) | Opus + você    | 3h    |
| 152  | Touch targets em 119 rotas (375px) — ≥44×44                                             | Opus           | 2h    |
| 153  | Reduced-motion verificação em 30 rotas                                                  | Opus           | 1.5h  |

**Paralelismo:** 142 sozinha → (143+144) 🔀 → você em 4 navegadores (145-148) 🔀 → (149-152) 🔀 → 153.

---

## ETAPA 13 — Edge functions + email + PDF (154-156)

⛓ H8: **PODE INICIAR A PARTIR DE ETAPA 4** (paralelo cross-etapa OK).

| Fase | Descrição                                        | Modelo | Tempo |
| ---- | ------------------------------------------------ | ------ | ----- |
| 154  | Auditar 14 edge functions deployadas no Supabase | Sonnet | 3h    |
| 155  | Auditar email templates renderizados em produção | Sonnet | 2.5h  |
| 156  | Auditar PDF (`lib/pdf/ReportDocument.tsx`)       | Sonnet | 2h    |

**Paralelismo:** 3 terminais simultâneos. Pode rodar em paralelo com Etapas 4-12.

---

## ETAPA 14 — Hardening final (157-161)

| Fase | Descrição                                                                      | Modelo | Tempo |
| ---- | ------------------------------------------------------------------------------ | ------ | ----- |
| 157  | **Promover lint warn → error** (#1 das 8 melhorias fecha aqui)                 | Sonnet | 1h    |
| 158  | `pnpm metrics:audit` com 0 violações em CADA categoria. Update baseline        | Sonnet | 1h    |
| 159  | Atualizar CLAUDE.md (5 seções) + criar `accessibility.md` + `design-system.md` | Sonnet | 1.5h  |
| 160  | Sentry alarms + monitoramento pós-launch                                       | Sonnet | 1h    |
| 161  | Tag git `pos-refatoracao-completa-2026-05c` + commit final                     | Sonnet | 0.5h  |

**Paralelismo:** 157 → 158 → (159+160 🔀) → 161.

---

## Verificação final (critério de "completo")

```
[ ] tsc 0 erros
[ ] vitest ≥ 470 passando
[ ] pnpm lint --max-warnings 0 → 0/0 (após Fase 157)
[ ] pnpm metrics:audit → 0 violações em TODAS as 9 categorias
[ ] axe-playwright em 119 rotas → 0 violations
[ ] multi-tenant playwright → diff visual em 3 shapes em ≥3 rotas
[ ] knip 0 findings
[ ] build 93/93 páginas
[ ] Lighthouse a11y ≥ 95 em 119 rotas
[ ] Manual SR test gravado em 8 fluxos
[ ] CHECKLIST.md: 154/154 fases [x]
[ ] CLAUDE.md: 5 seções atualizadas
[ ] Tag git: pos-refatoracao-completa-2026-05c criada
[ ] CI ativo bloqueando regressão
```

---

## Comandos pra cada terminal

```
"Leia docs/refatoracao-2026-05/execucao/PLANO-FINAL.md
 e docs/refatoracao-2026-05/execucao/PROTOCOLO-TERMINAL.md.
 Você é o Terminal A, executando a Fase NN."
```

Cada terminal:

1. Lê PLANO-FINAL.md (este doc) pra saber sua fase + paralelismo + hard deps
2. Lê PROTOCOLO-TERMINAL.md pra saber comportamento (git, mini-card, aprovações, commit)
3. Verifica branches ativas no remote pra confirmar paralelos
4. **Verifica hard deps (H1-H8)** antes de começar
5. Avisa fundador qual outros terminais podem abrir agora
6. Após 47, **lê PADRAO-VALIDADO.md como contrato** dos sweeps
