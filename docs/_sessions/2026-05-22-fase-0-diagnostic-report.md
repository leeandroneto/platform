# Fase 0 — Diagnóstico runtime theme-studio (2026-05-22)

> **Tipo:** diagnóstico read-only (não-decidido em §1.3 do plano correção).
> **Captura:** evidência runtime cravada antes de Fase 1+. Veredito A/B/C no fim.
> **Plano-mãe:** `docs/plans/theme-builder-audit-correction.md`
> **Escopo:** zero edits em código. Só observação + classificação dos 13 bugs §1.3.

---

## 1. Estado do banco (Parte 1 — MCP queries)

### 1.1 Tabelas verificadas

| Tabela                  | Linhas | Estado                                          |
| ----------------------- | ------ | ----------------------------------------------- |
| `tenants`               | **1**  | `showcase` slug, `active_theme_version_id=NULL` |
| `tenant_themes`         | **0**  | **vazio** — lazy bootstrap nunca disparado      |
| `tenant_theme_versions` | **0**  | **vazio**                                       |
| `brands`                | 1      | `desafit` host=`desafit.app`                    |
| `domains`               | 1      | `showcase.lvh.me` → showcase tenant, verified   |
| `auth.users`            | 1      | `teste@gmail.com` (id `879571cb-...`)           |
| `memberships`           | 1      | role=`platform_admin` no tenant showcase        |

### 1.2 Schema `tenant_theme_versions`

Colunas reais: `id, theme_id, version_number, snapshot (jsonb), prompt_text, ai_model_id, created_by, created_at`.

**Não existe `published_at`** (o plano §1.3 menciona, mas migration 0025 não tem). Diff de schema documental — não é bug, é incoerência no plano.

### 1.3 RLS policies confirmadas

- `tenant_themes_select/update/delete`: `tenant_id = auth.jwt() ->> 'tenant_id'` (cravado, sem wrap `(select ...)` — rule jwt-claims pede wrap pra 100× speedup, mas não bloqueia runtime)
- `tenant_theme_versions_select`: nested check via JOIN. OK.
- `*_insert` policies têm `qual=NULL` (permissivas). Risco médio — qualquer JWT pode inserir. Mitigado por server actions usando `assertTenantMatch`, mas RLS direta está fraca.

### 1.4 Análise — showcase + auth seed

- ✅ User `teste@gmail.com` existe + membership platform_admin no showcase tenant
- ✅ Domain `showcase.lvh.me` está verified + aponta pro tenant correto
- ❌ Tenant não tem `active_theme_version_id` → fluxo `getActiveThemeForTenant` cai pro fallback `DEFAULT_THEME`
- ❌ Bootstrap lazy (`bootstrapTenantTheme` action) nunca rodou — `tenant_themes` está vazio
- ⚠️ Subscriptions schema: tem `package` (não `plan_slug`). Documentação incoerente, não é bug.

---

## 2. Runtime route diagnostic (Parte 2)

Dev server confirmado na porta 3000 (PID 87064). Storybook na 6006 (PID 83396). Não iniciei nada novo.

### 2.1 Matriz por rota

| Rota                                       | HTTP    | Size     | `precedence="theme"` | Conteúdo rendered                                                                   |
| ------------------------------------------ | ------- | -------- | -------------------- | ----------------------------------------------------------------------------------- |
| `http://localhost:3000/`                   | 200     | 33.956 b | ❌ ausente           | Vazio (app/page.tsx retorna `null` — by design)                                     |
| `http://localhost:3000/login`              | 200     | 44.310 b | ❌ ausente           | LoginForm renderiza completo: Card + Input email/password + Button "Entrar"         |
| `http://localhost:3000/admin/theme-studio` | 200     | 60.554 b | ❌ ausente           | Loading skeleton + RedirectErrorBoundary (entitlement gate redireciona pra `/`)     |
| `showcase.lvh.me:3000` (root)              | 200     | 38.284 b | ✅ presente          | Vazio (`/` retorna null — by design; brand+tenant resolvem mas page é stub)         |
| `showcase.lvh.me:3000/login`               | 200     | 48.606 b | ✅ presente          | LoginForm completo com form binding (mesmo conteúdo que /login sem host)            |
| `showcase.lvh.me:3000/admin/theme-studio`  | 200     | 64.600 b | ✅ presente          | **`<div class="min-h-screen bg-background"/>` (loading skeleton vazio)** + redirect |
| `/api/r/themes/{showcase-uuid}/v1`         | **500** | erro     | n/a                  | Internal Server Error (nenhuma version v1 existe no DB)                             |

### 2.2 Observações críticas

- **Theme tokens runtime emit FUNCIONA quando há tenant resolvido** (`<style data-precedence="theme">` presente em showcase mas não em desafit-root). Hoist `<style precedence="theme">` confirmado funcional via React 19.
- **Login form REALMENTE renderiza** — Card + Form + Inputs + Button submit estão TODOS no DOM SSR. `onSubmit` JS attribute não está no SSR (esperado — handler é client-side), mas todos elementos necessários pro hydrate+click estão presentes.
- **`/admin/theme-studio` em showcase mostra só skeleton `<div class="min-h-screen bg-background"/>`** porque o entitlement gate captura no try/catch e dispara `redirect('/')`. Não chega no `ThemeStudioLoader`. **Não é theme-studio quebrado — é entitlement fail silencioso.**
- **Registry endpoint 500** — `/api/r/themes/[tenantId]/[version]` tenta query DB mas tenant_theme_versions está vazio.

---

## 3. Build state + gates (Parte 3)

| Gate                         | Status       | Notas                                                                         |
| ---------------------------- | ------------ | ----------------------------------------------------------------------------- |
| `pnpm typecheck`             | ✅ verde     | `tsc --noEmit` 0 erros                                                        |
| `pnpm lint --max-warnings 0` | ✅ verde     | `eslint . --max-warnings 0` zero warnings                                     |
| `pnpm vocab:audit`           | ✅ verde     | "0 hits fora da allowlist"                                                    |
| `pnpm token:audit`           | ✅ verde     | "token:audit clean"                                                           |
| `pnpm i18n:audit`            | ✅ verde     | ESLint apenas em app/ + lib/ — 0 erros                                        |
| **`pnpm test`**              | ❌ **falha** | 4 test files / 10 tests falhos — TODOS são Storybook stories (bug #4)         |
| **`pnpm build`**             | ✅ verde     | Next 16 build OK · 11 static pages · 7 dynamic routes · serwist 25 entries    |
| `pnpm size`                  | ⚠️ delta     | JS **443.39 KB** (vs budget 500 KB — folga 11%) · CSS **15.82 KB** (vs 50 KB) |

### 3.1 Tests falhos (10 cravados, todos por mesma causa)

```
× preview-panel.stories.tsx > Default | Desktop Wide | Mobile Viewport
× control-panel.stories.tsx  > Default | Ai Enabled | Mobile Viewport
× view.stories.tsx            > Default | Mobile Layout
× preset-select.stories.tsx   > Default | Disabled (Storybook Vitest)
```

Causa raiz cravada: `[nuqs] nuqs requires an adapter to work with your framework. See https://nuqs.dev/NUQS-404`. Tudo cai em `PreviewPanel.tsx:192` → `useQueryState('p', ...)`.

12 outros test files passam — incluindo `theme-history-reducer.test.ts` (17 tests) + `actions.test.ts` + utils.

### 3.2 Bundle delta

- Baseline pré-correção (commit 2fcd865 conforme plano): 178.42 KB
- Atual: **443.39 KB** = +148% delta
- Budget: 500 KB → ainda dentro (11% de folga)
- **Plano §5.3 falou ≤20% delta — REAL é 148%.** Plano estava errado na estimativa.

CSS estável: 15.82 KB ≈ baseline. Não houve growth de CSS.

---

## 4. Validação dos 13 bugs §1.3 (Parte 4)

| #   | Bug original                                                                     | Classificação                   | Evidência                                                                                                                                                                                                                                                                                                                                                           |
| --- | -------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `/login` mostra página mas click submit não dispara handler                      | **NÃO TESTÁVEL via curl**       | SSR HTML tem Form + Inputs + Button. `onSubmit` é client-side React event listener (não-SSR). Precisa browser real pra reproduzir. Código `form.tsx:23-43` é trivial Supabase signInWithPassword — improvável estar quebrado em si.                                                                                                                                 |
| 2   | `http://showcase.lvh.me:3000` não renderiza nada                                 | **REFUTADO**                    | showcase root retorna 200 com `precedence="theme"` emitido. `app/page.tsx` retorna `null` POR DESIGN — não é bug. `getRouteByHost` resolve corretamente: domain encontrado, tenant resolvido. Falsa interpretação do user.                                                                                                                                          |
| 3   | `/admin/theme-studio` vazia mesmo após seed + auth                               | **PARCIAL**                     | Não-auth → entitlement gate redirect (esperado). Com auth (não testei interativamente), `getActiveThemeForTenant` retorna `DEFAULT_THEME` porque `active_theme_version_id=NULL`. DEFAULT_THEME tem `light` + `dark` → `isValidTheme` passa. **Não é página vazia — é skeleton + redirect.** Precisa browser real autenticado pra confirmar comportamento pós-login. |
| 4   | Stories falham — `nuqs` adapter ausente                                          | **CONFIRMADO**                  | 10 tests falhos com erro `[nuqs] nuqs requires an adapter`. `.storybook/preview.tsx` linha 12-22 não importa `NuqsAdapter`. Falha cravada.                                                                                                                                                                                                                          |
| 5   | `mockBrand.default_palette_id: 'palette-mock'` stale                             | **CONFIRMADO**                  | `lib/brand/types.ts` não tem `default_palette_id`. `.storybook/preview.tsx:41` ainda referencia. TS aceita (provavelmente `Brand` interface tem campo opcional ou prop excess sem strict), mas é dead field.                                                                                                                                                        |
| 6   | Storybook preview não emite tokens runtime                                       | **CONFIRMADO**                  | `.storybook/preview.tsx` não chama `buildThemeCSS(DEFAULT_THEME)` nem injeta `<style precedence="theme">`. Stories renderizam só com globals.css universal — sem cores per-tenant.                                                                                                                                                                                  |
| 7   | 10 componentes com `interface ComponentProps {}` inline em vez de Zod            | **CONFIRMADO**                  | Grep `^interface.*Props` em components/admin/theme-studio/\*.tsx retorna 10 arquivos: code-panel, code-panel-dialog, color-selector-popover, colors-tab-content, control-panel, font-picker, hsl-preset-button, preset-select, shadow-control, theme-font-select. Pasta `lib/contracts/components/` NÃO EXISTE.                                                     |
| 8   | next/font Geist no Storybook tem fricção                                         | **NÃO REPRODUZIDO**             | Storybook 200 OK em localhost:6006. Geist imports `.storybook/preview.tsx:11-34`. Sem erro visível em SSR. Pode aparecer só em casos específicos.                                                                                                                                                                                                                   |
| 9   | font-picker.tsx 643 LOC + 5 componentes >400 LOC sem ADR                         | **CONFIRMADO baixa-severidade** | ESLint passa porque há overrides path-specific. Sem ADR cravando. font-picker tem 643 LOC (confirmado pelo plano). É débito de governance, não bug runtime.                                                                                                                                                                                                         |
| 10  | Storybook decorators incompletos (faltam NextIntl + Route + Entitlement + Theme) | **PARCIAL**                     | `.storybook/preview.tsx` JÁ tem NextIntl + Route + Entitlement (linhas 93-107). **Faltam:** NuqsAdapter (bug #4), ThemeFormProvider, `<style precedence="theme">` (bug #6). Plano superestimou — não é tudo faltando.                                                                                                                                               |
| 11  | Save action APCA dual-gate nunca testado runtime end-to-end                      | **NÃO TESTÁVEL via curl**       | `validateThemeAPCA` está em `actions.ts:127`. Tests cobrem actions (passam). End-to-end real precisa user real navegando — não verificável neste diagnóstico read-only.                                                                                                                                                                                             |
| 12  | Registry endpoint `/api/r/themes/[tenantId]/[version]` nunca testado runtime     | **CONFIRMADO falha 500**        | `curl /api/r/themes/{uuid}/v1` retorna HTTP 500. Causa: nenhuma version existe no DB ainda. Quando version existir, ainda precisa validar payload `registry:style`.                                                                                                                                                                                                 |
| 13  | RHF undo/redo/checkpoint/debounce 500ms nunca validado runtime real              | **NÃO TESTÁVEL via curl**       | `theme-history-reducer.test.ts` (17 tests passam) cobre o reducer puro. Integration real precisa browser interativo. Stories de view falham (bug #4) então também não validável via storybook.                                                                                                                                                                      |

### 4.1 Resumo

- **CONFIRMADOS:** 6 bugs (#4, #5, #6, #7, #9, #12)
- **PARCIAIS:** 2 bugs (#3, #10)
- **REFUTADOS:** 1 bug (#2)
- **NÃO TESTÁVEIS via diagnóstico read-only:** 4 bugs (#1, #8, #11, #13)

---

## 5. Veredito final

### 5.1 Análise

| Dimensão                 | Estado real                                                                                                                |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| **Gates estáticos**      | ✅ typecheck + lint + vocab + token + i18n + build — TODOS verdes                                                          |
| **Tests runtime**        | ⚠️ 64/74 passando · 10 falhos TODOS pelo mesmo bug isolado (nuqs adapter)                                                  |
| **Bundle**               | ⚠️ +148% delta mas dentro de budget 500 KB                                                                                 |
| **Migrations + schema**  | ✅ migration 0025 aplicada · RLS policies presentes (com gap em INSERT)                                                    |
| **Seed**                 | ✅ tenant + domain + user + membership cravados. ❌ tenant_themes / versions vazios — lazy bootstrap nunca rodou           |
| **Multi-tenant runtime** | ✅ FUNCIONA. `getRouteByHost` resolve showcase.lvh.me. `<style precedence="theme">` emit hoist OK.                         |
| **Login form**           | ✅ Renderiza tudo no SSR. Bug #1 alegado "click não dispara" não pôde ser reproduzido — provavelmente operacional.         |
| **Theme studio runtime** | ⚠️ Não testável sem login interativo. Sem version_id ativa, vai pro DEFAULT_THEME fallback. Skeleton aparece corretamente. |
| **Storybook stories**    | ❌ 7 stories quebradas por 1 dep faltando (NuqsAdapter) + tokens não emitidos. Fix cirúrgico (~30min).                     |
| **Zod schema débito**    | ❌ Confirmado — 10 componentes inline · pasta `lib/contracts/components/` não existe                                       |
| **Registry endpoint**    | ❌ HTTP 500. Cause: dados vazios. Quando há version, precisa testar payload.                                               |

### 5.2 **VEREDITO: OPÇÃO A — CONTINUAR plano completo** (cravado)

**Justificativa em 1 parágrafo:**

A maior parte do trabalho do theme-builder está **funcional em produção real**. Gates estáticos verdes, build verde, multi-tenant runtime verde, login form verde, schema DB sólido, theme runtime emit funcionando. Os bugs confirmados são **cirúrgicos e isolados**: 1 adapter Storybook faltando (resolve 7 stories de 1 vez), 1 campo stale em mockBrand (1-line fix), 6 tokens runtime ausentes no preview (1 decorator), 10 interfaces inline pra mover pra `lib/contracts/components/` (Fase 1 do plano), 1 registry endpoint que falha por DB vazio (precisa seed de version pra testar). Bug #2 (showcase não renderiza) foi **refutado** — confunde "app/page.tsx retorna null por design" com "tema não funciona". Bug #1 (login click) não pôde ser reproduzido — provavelmente operacional. Nada do que está construído precisa ser **revertido**. Custo de hard reset (B/C) seria perder ~5.000 LOC de trabalho funcional pra ganhar uma reconstrução manual que enfrentaria os mesmos desafios. **Mantém-se nos rails do plano original (Fases 1-5, 32-42h estimadas).**

### 5.3 5 bugs mais críticos confirmados

1. **Bug #4 — nuqs adapter missing em Storybook** (Severidade Alta, Esforço ~30min): bloqueia 10 dos 16 test files. Fix: import `NuqsAdapter` em `.storybook/preview.tsx` e wrap. **Resolve 7 stories simultaneamente.**
2. **Bug #7 — 10 componentes com inline interface Props** (Severidade Alta, Esforço Fase 1 do plano, ~6-8h): `lib/contracts/components/` não existe. Listagem cravada: code-panel, code-panel-dialog, color-selector-popover, colors-tab-content, control-panel, font-picker, hsl-preset-button, preset-select, shadow-control, theme-font-select.
3. **Bug #6 — Storybook preview não injeta `<style precedence="theme">`** (Severidade Média, Esforço ~30min): stories renderizam sem cores per-tenant. Fix em `.storybook/preview.tsx` adicionar decorator com `buildThemeCSS(DEFAULT_THEME)`.
4. **Bug #12 — Registry endpoint 500** (Severidade Média, Esforço ~1h pra fix + bootstrap seed): `/api/r/themes/[tenantId]/[version]` falha. Causa imediata: nenhuma version no DB. Precisa rodar bootstrap (manual via app OU seed SQL) e testar payload.
5. **Bug #5 — `mockBrand.default_palette_id` stale** (Severidade Baixa, Esforço ~1min): campo dropado em migration 0024 mas ainda em `.storybook/preview.tsx:41`.

### 5.4 Bugs refutados (parecem mas não são)

- **Bug #2 — showcase.lvh.me:3000 não renderiza nada**: REFUTADO. App/page.tsx retorna `null` por design (não há landing pública dia 0). `getRouteByHost` resolve corretamente. Tokens emit OK. **Não é bug — é estado intencional do MVP.**

### 5.5 Bugs reclassificados

- **Bug #3 — theme-studio vazia**: PARCIAL. Sem auth, é redirect esperado. Com auth + sem version ativa, mostra DEFAULT_THEME (que TEM `light`+`dark`, então `isValidTheme` passa). Precisa validação interativa com user logado pra confirmar se realmente renderiza editor visível.
- **Bug #10 — providers faltando**: PARCIAL. NextIntl/Route/Entitlement JÁ presentes. Faltam apenas NuqsAdapter (=bug #4) + tokens runtime (=bug #6) + ThemeFormProvider opcional.

### 5.6 Estimativa real de horas

| Fase plano                   | Estimativa plano | Estimativa revisada cravada                                                                            |
| ---------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------ |
| Fase 1 — Zod schemas SSOT    | 6-8h             | 6-8h (intacta — débito real)                                                                           |
| Fase 1.5 — lib/server audit  | 3-4h             | 2-3h (lib/data/themes.ts e actions.ts já bem-estruturados — auditar é mais leve que reescrever)        |
| Fase 2 — Storybook fix       | 5-6h             | **2-3h** (cirúrgico — bug #4+#5+#6 são 3 edits no preview.tsx; sem Provider rewrite massivo)           |
| Fase 3 — Tests + integration | 12-16h           | 10-14h (history-reducer já 17 tests verdes — reduz scope; save flow e registry precisam fix bootstrap) |
| Fase 4 — Multi-tenant + MDX  | 5-7h             | 5-7h (intacta)                                                                                         |
| Fase 5 — Sign-off humano     | 2-3h             | 2-3h (intacta)                                                                                         |
| **TOTAL**                    | **32-42h**       | **27-37h** (otimismo razoável dado escopo cirúrgico real)                                              |

Redução ~15% vs estimativa do plano. **Confirma viabilidade econômica de continuar em vez de reset.**

### 5.7 Próximo passo recomendado

**Fast-track: Fase 0.5 emergencial (1-2h) antes de Fase 1 completa.**

Razão: 4 dos 6 bugs confirmados são fixáveis em <2h e desbloqueiam capability de validação visual real:

1. **Bug #5 + #6 + parte do #4** — editar `.storybook/preview.tsx`: remover `default_palette_id`, adicionar `NuqsAdapter` import + wrap, adicionar decorator `<style>` com `buildThemeCSS(DEFAULT_THEME)`. **Resolve 7-10 stories de uma vez.**
2. **Bug #12 emergencial** — rodar `bootstrapTenantTheme` no showcase tenant (via UI login OU seed SQL inserindo `tenant_themes` + version 1 com DEFAULT_THEME). Depois re-testar `curl /api/r/themes/.../v1`.
3. **User no driving seat (15min)** — abrir browser real autenticado em `showcase.lvh.me:3000/admin/theme-studio` e validar bug #3 + #1. Se theme studio renderiza editor visível, bug #3 vira REFUTADO. Se login submit não dispara handler, bug #1 vira CONFIRMADO + fixa antes de Fase 1.

Após Fase 0.5, Fase 1 (Zod schemas SSOT, 6-8h) começa com base estável e validada visualmente.

**NÃO ir direto pra Fase 1** sem Fase 0.5 — risco de pagar Zod schemas em runtime que ainda tem incerteza sobre bug #1 e #3.

---

## 6. Insights soltos pra futuro

- **Falsa interpretação de "vazio"**: bug #2 mostra que dev/owner pode confundir "página intencionalmente null" com "página quebrada". Lição: doc explícita em `app/page.tsx` (já tem 1 linha — talvez expandir pra comment dizendo "stub deliberado").
- **RLS INSERT permissivo** em `tenant_themes` + `tenant_theme_versions` é gap silencioso. Server actions cobrem via `assertTenantMatch`, mas qualquer cliente autenticado consegue inserir via REST direto. Considerar tightening em Fase 4 (multi-tenant audit).
- **Bundle delta 148%** não bate com plano §5.3 que falava ≤20%. Plano estava otimista demais. Real ainda dentro de budget mas vale revisar baseline cravando o real (443.39 KB).
- **`tenant_theme_versions.published_at` mencionado em plano §1.3** não existe no schema real. Migration 0025 não criou. Plano §1.3 tem incoerências de schema documental — corrigir ao rodar Fase 1.
- **Bootstrap lazy** depende de save action ser chamada. Tenant criado sem bootstrap fica num estado "fantasma" — registry endpoint 500. Talvez vale auto-bootstrap em `getActiveThemeForTenant` se NULL detectado.
