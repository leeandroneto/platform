# Deferred — Validation Suite Contínua (Fase 8 antiga, detail técnico portado)

> **Tipo:** deferred plan detail (não-bloqueante, **trabalho contínuo**).
> **Origem:** `docs/plans/pivot-tweakcn.md` §9 Fase 8 (arquivado em
> `docs/_archive/plans/2026-05-pivot-tweakcn.md` em 2026-05-22).
> **Data porta:** 2026-05-22 (última ação da sessão antes de iniciar
> `docs/plans/theme-builder.md` em nova conversa).
> **Estimativa:** trabalho **contínuo** — não tem "data fim". Começa
> JIT quando 1º componente theme builder entra sob §15.1 governance.
> **Gatilho retorno:** primeiro componente do theme builder existir
> (`docs/plans/theme-builder.md` §4.11 Storybook stories ativando).

---

## 0. Sobre este arquivo

Detail técnico do que era **Fase 8** do `pivot-tweakcn.md` arquivado.
**Não é fase final** — é **trabalho contínuo** que começa quando 1º
componente vira sob §15.1 governance e cresce até registry maduro.

**Princípio meta:** pivot original tratava Fase 8 como "última fase" que
cyclava 5-7 presets e validava visual. Pós ADR-0046 (dogfooding-first),
Validation Suite virou workstream **contínuo** — começa em theme-builder
(`§4.11`) e cresce conforme registry maduro.

---

## 1. Goal (trabalho contínuo, não-final)

Garantir que componentes do theme builder + presets seed + futuras
páginas/forms renderizam corretamente em **multi-preset matrix** e que
**métricas de saúde** crescem conforme codebase cresce.

**Diferença chave do pivot original:** Fase 8 NÃO é "feature do produto"
— é **infraestrutura de QA** que acompanha as features. Showcase route é
admin-internal QA tool, não public landing.

---

## 2. Estudos prévios (porta §9 do pivot)

### S8.1 — Presets seed (quais 5-7 escolher)

**Critérios cravados:**

- Cobertura de mood (clean minimal, vibrant bold, dark cinematic, soft
  warm, sharp tech)
- Validação visual (themes TweakCN já validados em produção)
- Copy-paste viável (importar via `pnpm dlx shadcn add https://tweakcn.com/r/themes/<id>`)

**Hipótese cravada (revisão JIT quando promover):**

- `modern-minimal` — clean baseline
- `violet-bloom` — vibrant brand
- `mocha-mousse` — soft warm
- `cosmic-night` — dark cinematic
- `bold-tech` — sharp tech
- (opcional 6º) `pastel-dreams` — soft pop
- (opcional 7º) `neo-brutalism` — distinctive

**Output esperado:** `docs/research/4X-presets-selection.md`.

### S8.2 — Testing strategy presets cycling

**Como:** Playwright multi-preset matrix:

- Setup: tenant fixture com `active_theme_version_id` parametrizado
- For each preset: navigate `/admin/showcase?preset=<slug>` → snapshot
  screenshot
- Compare screenshots cross-preset (must differ in cores) e same-preset
  (must not regress)

**Output:** `e2e/preset-cycling.spec.ts`.

---

## 3. Workstreams (porta §9 do pivot)

> **Origem:** porta direta §9 do pivot. Cada workstream tem gatilho de
> início independente — não fazer tudo em batch.

### 3.1 — Playwright matrix wire-up (gatilho: 1º componente entrega sob §15.1)

**Faz:**

- Config `playwright.config.ts` + snapshot baseline
- Multi-preset (5-7 presets seed importados de TweakCN — workstream 3.2)
- Roda em CI a cada PR — não merge se snapshot diff > tolerância

**Tempo:** ~4h setup + ~2h por componente adicional.

**Gatilho ativação:** quando `docs/plans/theme-builder.md` §4.11 entregar
primeiro componente com story Storybook. Aí Playwright matrix começa a
acompanhar.

### 3.2 — Presets seed (gatilho: Fase 5 + Fase 6 maduras)

**Faz:** importar 5-7 themes oficiais TweakCN como `tenant_themes`
source='imported-tweakcn'.

- Via `pnpm dlx shadcn add https://tweakcn.com/r/themes/<id>` OU
  script `scripts/import-tweakcn-presets.ts` HTTP GET em cada URL +
  mapeia pra nosso `ThemeSchema` + INSERT em DB
- Cada preset valida APCA Silver dual-gate antes de seed
- Sequencial: 1 preset/PR, não batch (visual review manual cada um)
- Atribuição: UI mostra "imported from tweakcn community" badge

**Tempo:** ~4-6h por preset (incluindo copy + APCA validate + visual review).

**Gatilho ativação:** theme builder funcional (admin pode salvar/
restaurar themes) + AI generation operacional (Fase 6 antiga, hoje em
`docs/_deferred/ai-theme-generation-detail.md`). Sem ambos, presets seed
não tem onde validar contra "tema custom".

### 3.3 — Showcase route `/admin/showcase` (gatilho: Fase 7 ADR-0045 cravado)

**Faz:** ~400 LOC (vs 1.259 do showcase original pré-pivot):

- `page.tsx` (RSC) — busca tenants + presets disponíveis
- `view.tsx` (Client) — selector preset + grid 12-15 componentes
  representativos:
  - Button variants
  - Card
  - Form (input + textarea + select)
  - Dialog
  - Sheet
  - Sidebar
  - Table
  - Tabs
  - NavigationBottom mobile
  - Hero section (futuro, quando Page Engine entregar L2 block)
- 2 viewports (desktop + mobile)
- Gated atrás de entitlement `theme_studio` (admin-only QA tool, NÃO public)

**Tempo:** ~10h.

**Gatilho ativação:** quando ADR-0045 cravar registry strategy +
`tenant_pages`/`tenant_blocks` migrations aplicadas (porta de
`docs/_deferred/v0-registry-integration-detail.md` §3.1).

### 3.4 — Métricas saúde §15.7 (gatilho: 10+ componentes existem)

**Faz:** coletar trimestralmente, frequência aumenta com escala.

**Tabela métricas (porta §15.7 do pivot):**

| Métrica                                              | Target           | Como medir                                               |
| ---------------------------------------------------- | ---------------- | -------------------------------------------------------- |
| % componentes com Zod schema                         | 100%             | grep `z.object` em `lib/contracts/components/`           |
| % componentes com Storybook story                    | 100%             | `find components -name "*.tsx" -not -name "*.stories.*"` |
| % componentes com test (coverage ≥70%)               | 100%             | Vitest report                                            |
| % stories que rendem em 5+ presets sem regressão     | 100%             | Playwright matrix (workstream 3.1)                       |
| Tokens consumidos fora de shadcn-canonical (sem ADR) | 0                | `pnpm token:audit`                                       |
| APCA fails em qualquer componente                    | 0                | `pnpm contrast:check`                                    |
| Componentes flagged "smart" sem estudo dedicado      | 0                | grep `category: 'smart'` vs sessions `*-component-*.md`  |
| Time-to-add novo bloco oficial                       | <2h (skeleton)   | manual stopwatch                                         |
| Time-to-onboard shadcn block from registry           | <30min (incl QA) | manual                                                   |

**Gatilho ativação:** quando codebase atingir 10+ componentes (gatilho
de massa crítica — antes disso, métricas distorcem).

---

## 4. Ordem operacional (porta §9 "Ordem operacional")

- **theme-builder.md §4.11** entrega 1º componente → **workstream 3.1**
  Playwright wire-up começa
- **theme-builder.md** + `ai-theme-generation-detail.md` promovidos →
  **workstream 3.2** 1º preset seed
- **v0-registry-integration-detail.md** promovido (ADR-0045 migrations
  aplicadas) → **workstream 3.3** showcase route
- **10+ componentes existem** → **workstream 3.4** dashboard métricas
  (pode virar feature interna em plano hipotético "QA tooling")

---

## 5. Governance §15.7 referência cruzada

> **Origem:** porta `docs/_archive/plans/2026-05-pivot-tweakcn.md` §15
> Governance & Documentação obrigatória (cross-fase, vale pra TODO
> componente novo).

Princípios cravados que esta validation suite mede:

- **§15.1** Checklist aprovação por componente (A identidade, B contrato
  Zod, C multi-tenant, D acessibilidade, E i18n, F performance, G
  Storybook, H testes, I docs, J registry-ready)
- **§15.4** CI gates (automação que falha PR) — faseada conforme
  workstream 3.1/3.2 ativarem
- **§15.7** Métricas saúde (workstream 3.4 desta detail file)
- **§15.9** "Por que isso parece burocracia mas não é" — cada item
  previne incidente passado ou risco conhecido

Quando este detail file for promovido, ler §15 inteiro do pivot
arquivado antes de executar — governance crava critérios que esta suite
mede.

---

## 6. Cross-links

### Plano executor

- **`docs/plans/theme-builder.md` §4.11** — Storybook stories obrigatórias
  acionam workstream 3.1 Playwright matrix
- **`docs/_deferred/ai-theme-generation-detail.md`** — Fase 6 antiga,
  aciona workstream 3.2 presets seed (com AI gen, presets podem ser
  testados contra "tema custom AI" como sanity check)
- **`docs/_deferred/v0-registry-integration-detail.md`** — Fase 7 antiga,
  aciona workstream 3.3 showcase route

### ADRs/Pesquisas

- ADR-0046 — dogfooding-first (gatilho retorno: 1º componente entra)
- ADR-0044 — pivot TweakCN (princípio §10 audit-per-phase)
- ADR-0045 — Registry Strategy (D.13 invariante pages.kind === block name)
- research-41 — Audit TweakCN (não relevante diretamente — Fase 8 não
  tem código TweakCN equivalente)
- `docs/_archive/plans/2026-05-pivot-tweakcn.md` §9 — origem desta porta
- `docs/_archive/plans/2026-05-pivot-tweakcn.md` §15 — governance que
  esta suite mede (incluindo §15.7 métricas tabela copiada acima)

---

## 7. Checklist verificação (porta §9 do pivot — quando workstreams ativarem)

### Workstream 3.1 Playwright matrix wire-up

- [ ] `playwright.config.ts` configurado
- [ ] Snapshot baseline criado pra 1º componente
- [ ] CI roda Playwright matrix a cada PR
- [ ] Tolerância de diff definida (típico 0.1% pixels)

### Workstream 3.2 Presets seed

- [ ] 5-7 presets TweakCN importados como `tenant_themes`
      source='imported-tweakcn'
- [ ] APCA Silver validate ✅ em todos presets (light + dark)
- [ ] UI mostra "imported from tweakcn community" badge atribuição
- [ ] Script `scripts/import-tweakcn-presets.ts` documentado
      (idempotente, JIT re-run sem dupe)

### Workstream 3.3 Showcase route

- [ ] `app/admin/showcase/page.tsx` (RSC) + `view.tsx` (Client)
- [ ] Selector preset funcional (URL param ou DB UPDATE)
- [ ] 12-15 componentes representativos renderizam
- [ ] 2 viewports (desktop + mobile) confirmados
- [ ] Cycling 5-7 presets visualmente distintos no showcase
- [ ] Gated atrás de entitlement `theme_studio` (admin-only)

### Workstream 3.4 Métricas saúde

- [ ] 10+ componentes existem (gatilho ativação)
- [ ] Script `pnpm metrics:design-system` agrega métricas §15.7
- [ ] Dashboard manual (Notion ou similar) primeira coleta trimestral
- [ ] Métricas com target 100% — review JIT quando target falha 2x
      consecutivo

### Validação cross-workstreams

- [ ] `pnpm typecheck` ✅
- [ ] `pnpm lint --max-warnings 0` ✅
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit` ✅
- [ ] `pnpm test` 100% ✅
- [ ] `pnpm build` ✅
- [ ] `pnpm size` budgets verdes (esperado: bundle CSS -30% vs baseline
      pre-pivot, archetypes/ folder gone — meta-medida pivot success)
- [ ] `pnpm dev` mobile + desktop visual confirmado em 5-7 presets

---

**Fim do detail file.**
