# Plano: Theme Builder (admin-only, copy literal TweakCN)

> **Tipo:** plano executável (próximo plano após `docs/plans/pivot-tweakcn.md` finalizar)
> **Status:** 🟡 **PLANEJADO** — não iniciado. Aguarda finalização do pivot-tweakcn.
> **Data início estimada:** 2026-05-22+
> **Estimativa total:** ~34h (Fase 5 do pivot — copy literal TweakCN editor + adapt multi-tenant)
> **Princípio meta:** dogfooding-first (ADR-0046 accepted 2026-05-22) — theme builder = passo 1 da ordem cravada. Sem ele, qualquer landing/page seria refactor visual depois.
> **Owner:** Leandro

---

## 0. Por que esse plano existe

ADR-0046 (dogfooding-first execution order) cravou ordem de execução:

1. **Theme builder** (~34h, este plano)
2. Form de captação agência (bare-bones Forms Engine, dogfooding)
3. Report IA do form agência (research-25 ready-to-consume)
4. Página de vendas agência (bare-bones Pages Engine, dogfooding)
5. AI builders (pages + forms engines)
6. Restante: manual primeiro, sistematização depois

Theme builder vem **antes** porque é fundação visual de tudo — qualquer
landing/page construída sem theme system cravado vira refactor depois.

> **NÃO duplicar detalhe técnico aqui.** O detalhe técnico (estudos S5.\*,
> arquitetura editor TweakCN, componentes a copiar, lista de items
> executáveis) vive em **`docs/plans/pivot-tweakcn.md` §6 Fase 5**. Este
> plano é o "envelope executor" desta sessão concreta, não a especificação.

---

## 1. Escopo desta sessão (cravado pelo user 2026-05-22)

### Inclui (G1 confirmado)

- **Theme builder UI** — copy literal de `tweakcn-ref/components/editor/`
  adaptado pro nosso `<style precedence="theme">` runtime multi-tenant
- **Admin-only inicial** — rota `/admin/theme-studio` gated atrás de
  entitlement `theme_studio` (sem self-service profissional ainda)
- **CRUD de versões de tema** — usa migration 0025 (`tenant_themes` +
  `tenant_theme_versions`) já aplicada (Fase 4 ✅)
- **Color picker stack** — HSL adjustments, contrast checker adaptado pra
  APCA Silver, code panel multi-formato
- **Font picker dinâmico Google Fonts** — copy literal TweakCN approach
- **Shadow control** — 6 primitives TweakCN + 8 níveis derivados
  algoritmicamente
- **Save / restore / fork de versões** — `forkTheme` action (G.3 deferred
  da Fase 4 entra aqui)
- **Storybook 10 re-install** — stories pros componentes do editor
  (decisão cravada na §5.0 do pivot-tweakcn)

### NÃO inclui (G1 confirmado — DEFERRED)

- **AI generation de themes** (era Fase 6 do pivot — IA gera theme via
  Gemini Flash + image-to-theme + chat UI). Registrado em
  `docs/_deferred/post-funil-agencia.md`
- **v0 integration** (era Fase 7 — registry endpoint pra v0 consumir,
  ideação dev-only per ADR-0045 D.1). Registrado em
  `docs/_deferred/post-funil-agencia.md`
- **Self-service do profissional** — admin-only por ora. Profissional
  recebe theme aplicado pela agência via mecânica `theme_studio`
  entitlement gate
- **AI patterns copy TweakCN** (theme generation IA model + v0 integration
  internal — research-44 cravou `createDocumentHandler<T>()` factory
  pattern + tool layer pattern + `resumable-stream` package — copy JIT
  quando AI builders chegarem)

---

## 2. Princípios que regem este plano

### 2.1 Dogfooding-first (ADR-0046)

Theme builder é **primeira instância da infra de theme system**. Bare-bones
(CRUD básico + editor visual TweakCN-style) é suficiente pro funil agência;
crescer (AI gen, v0) só depois que funil estiver capturando leads.

### 2.2 Registry-ready desde dia 1 (ADR-0045)

Cada theme salvo em `tenant_theme_versions` deve ser **exportável** via
`/api/r/themes/[tenantId]` no formato `registry:style` (ADR-0045 D.15).
Isso garante que `pnpm dlx shadcn add <our-theme-url>` funciona out-of-box
quando precisarmos compartilhar themes.

### 2.3 Copy literal TweakCN + adapt multi-tenant (ADR-0044 princípio 8)

NUNCA copy literal cego. Adaptamos a **lógica** (algoritmo
`getShadowMap()`, schema 32-cores, OKLCH-primary, editor UX,
`<style precedence="theme">` hoist) pro **nosso cenário**:

- Multi-tenant via `tenants.id` + RLS
- White-label via `brands` lookup + `useBrand()`
- PWA via manifest/icon dinâmico por tenant (já wired Fase 4)
- Safe-area iOS via `--inset-safe-*` universal

Linha "adaptado de tweakcn-ref/..." em cada arquivo originário.

### 2.4 G2 mesma sessão de trabalho

20 primitives shadcn + componentes TweakCN editor instalados juntos no
**início da Fase 5** (decisão G2 cravada user 2026-05-22). Sem fragmentar
em sub-sessões — install + smoke tests + ajustes num bloco coerente.

### 2.5 G6 tenant seed JIT

Tenant seed **JIT** no início da execução (decisão G6 cravada user
2026-05-22) — não criar agora antes do plano executar. Quando código do
editor pedir tenant pra testar, seed nesse momento.

---

## 3. Pré-requisitos (todos satisfeitos pós pivot-tweakcn)

- ✅ **Fase -1** clone TweakCN read-only em `C:\Users\leean\Desktop\tweakcn-ref\`
- ✅ **Fase 0** surgical delete invented layer
- ✅ **Fase 1** foundation reset (theme.ts Zod + build-theme-css.ts +
  globals.css universal-only)
- ✅ **Fase 1.5** migration 0024 drop design system orphans
- ✅ **Fase 2** Batch Theming F.1-F.5+Q9 resolvido
- ✅ **Fase 4 theme storage** — migration 0025 (`tenant_themes` +
  `tenant_theme_versions` + triggers G.1/G.2 + RLS) + 4 server actions
  (bootstrap/save/list/restore) + next-themes wireup
- ✅ **Fase 5 dia 0 prep** — `lib/design/shadows.ts` + color-format +
  generate-registry-item.ts (commit `975ade6` 2026-05-21)
- ✅ **ADR-0044** pivot accepted
- ✅ **ADR-0045** Registry Strategy accepted (17 decisões + validation
  research-44/45)
- ✅ **ADR-0046** dogfooding-first cravado (este plano nasce dele)

---

## 4. Como executar (cross-link)

> Detalhe operacional **vive em `docs/plans/pivot-tweakcn.md` §6 Fase 5**.
> Quando sessão de execução desse plano abrir, ler:
>
> - `docs/plans/pivot-tweakcn.md` §6 (Fase 5 inteira)
> - `docs/plans/pivot-tweakcn.md` §15 (governance por componente,
>   aplicável a TODO componente novo do editor)
> - `docs/research/41-audit-tweakcn-fases-5-6-7.md` (audit das ~34h)
> - `docs/research/45-component-strategy-best-practices.md` (arsenal 20
>   primitives + folder structure)
> - **TweakCN clone SSOT** em `C:\Users\leean\Desktop\tweakcn-ref\`
>   (commit `9adabcf9`, Apache-2.0) — read-only

### 4.1 Sequência de alto nível

1. **Dia 0 Fase 5** (G2 mesma sessão):
   - Install 20 essential primitives (§6.0 do pivot)
   - Setup AI catalog discoverability placeholder (§6.0.5 do pivot)
   - G6 tenant seed criado JIT
   - Storybook 10 re-install + smoke story button
2. **Editor TweakCN copy literal** (~28h pós dia 0):
   - `components/editor/*` adaptados pra `<style precedence="theme">`
   - Server actions ligando ao migration 0025
   - `forkTheme` action (G.3 deferred Fase 4)
   - Validation APCA dual-gate em todas save actions
3. **Showcase mínimo** — rota `/admin/theme-studio` consumindo o editor;
   validação visual via `pnpm dev`

### 4.2 Itens DEFERRED desta execução

Ver `docs/_deferred/post-funil-agencia.md` pra lista completa. Resumo:

- AI generation theme (Fase 6 antiga)
- v0 integration (Fase 7 antiga)
- AI patterns copy TweakCN (createDocumentHandler factory, tool layer,
  resumable-stream)
- block_kinds_catalog table promotion (JIT 3 consumers)
- Tiptap collab, Novel mídia, Novel theme override PoC
- `registry-blocks.md` rule + `block-catalog.json` build script

---

## 5. Checklist verificação (alto-nível)

Detalhe técnico em `docs/plans/pivot-tweakcn.md` §6.4 (Checklist verificação
Fase 5). Aqui só o macro:

- [ ] Dia 0 Fase 5 completo (20 primitives + AI catalog + tenant seed + Storybook)
- [ ] Editor TweakCN copy literal + adapt multi-tenant funcional
- [ ] Rota `/admin/theme-studio` acessível gated atrás de entitlement
- [ ] CRUD versões (save / restore / fork / list) funcional
- [ ] APCA dual-gate validando antes de save
- [ ] Endpoint `/api/r/themes/[tenantId]` retorna `registry:style` válido
- [ ] `pnpm typecheck` 0 erros
- [ ] `pnpm lint --max-warnings 0`
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit`
- [ ] `pnpm build` verde
- [ ] `pnpm size` budgets verdes
- [ ] `pnpm dev` mobile + desktop visual confirmado
- [ ] Storybook stories pros componentes do editor

---

## 6. Next plan (depois deste)

**`docs/plans/funil-agencia.md` retoma.**

Header desse plano atualizado em 2026-05-22 com:

- Condição de desbloqueio corrigida ("aguardando Passo 8 do plano
  design-system" → "aguardando theme-builder finalizar")
- Nota research-25 ready-to-consume (30+ decisões IA reports
  pré-resolvidas, item 3 da ordem ADR-0046 usa direto)

Sequência cravada (ADR-0046):

2. Form de captação agência (bare-bones Forms Engine, primeira instância)
3. Report IA do form agência (research-25 direto)
4. Página de vendas agência (bare-bones Pages Engine, primeira instância)
5. AI builders (pages + forms engines) — construir enquanto funil agência
   capta leads
6. Restante: programa manual → automação

---

**Fim do plano.**
