# 39 — ESLint Conventions + Code Rules para Stack Multi-Tenant Pós-Pivot

> **Status:** research (não-decidido) · **Data:** 2026-05-21
> **Autor:** Opus despachado · **Inputs:** ADR-0044, blueprint 13, 19 rules path-loaded, eslint.config.mjs (813 LOC), package.json, refator Fase 4 (`app/admin/theme-studio/`)
> **Decisão:** pendente. Este doc propõe — user decide via ADR.

## Resumo executivo

O sistema atual tem **24 regras ESLint custom + 19 rules path-loaded + 3 grep scripts CI** desenhadas em 2026-05-17 (ADR-0012/blueprint 13) pra mitigar o histórico de 830 disables do onboarding-bio. A premissa era razoável **em 2026-05-17**, mas três mudanças semânticas tornaram parte do enforcement caro demais pro valor:

1. **ADR-0044 (pivot TweakCN 2026-05-21)** trocou "67 roles invented + 5 ESLint rules ds-governance" por "~45 keys shadcn-canonical + 2 rules sobreviventes". **6/24 regras** ficaram contra um vocabulário morto.
2. **Stack candidata forward** (Novel/Tiptap rich-text, Origin UI, Magic UI, Vercel AI SDK v6, Registry catalog) traz convenções que colidem com 4 das regras de estrutura (`max-lines 300`, `max-lines-per-function 60`, `complexity 12`, `max-params 4`). Refactor Fase 4 em `app/admin/theme-studio/actions.ts` (269 LOC + helpers 187 LOC) já mostrou o custo: 1 arquivo virou 3 por **regra**, não por **necessidade**.
3. **Princípio "JIT > preventivo"** consagrado em rules `abstractions.md`, `shadcn-zone.md`, `components.md` choca com `plan-gates-required` por feature (ADR-0034) e com a expectativa do enforcement "i18n desde primeira string" (i18n não está configurado dia 0; regra dispara em código que precisa existir antes do i18n wire).

A recomendação central: **separar regras por motivação** (segurança/multi-tenant/branding = sempre; estrutura/limite = ajustar caso a caso; vocab = manter, mas re-enxugar pós-pivot). Total: **-6 regras existentes** · **+5 regras novas pra stack forward** · **6 ajustes em limites quantitativos**.

---

## A — Inventário atual

### A.1 Regras ESLint (eslint.config.mjs 813 LOC)

Numeração espelha a do blueprint 13 quando aplicável. "Vale manter pós-pivot?" considera ADR-0044 + stack forward.

| #   | Regra (slug)                                          | O que faz                                                  | Justificativa documentada               | Veredito pós-pivot                                                                                                                                                                                                                                                                                                         |
| --- | ----------------------------------------------------- | ---------------------------------------------------------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `vocab/no-banned-vocab` (16 termos)                   | Bloqueia `student`/`trainer`/`intake`/etc                  | ADR-0019, naming.md                     | **MANTER** — multi-tenant correctness                                                                                                                                                                                                                                                                                      |
| 2   | `react/jsx-no-literals`                               | String hardcoded em JSX                                    | Blueprint 13 §2.2 #1, ADR-0040 §G       | **AJUSTAR** — `i18nKey` continua válido, mas `i18n` ainda não wired (decisão 6 i18n.md). Hoje vira ruído em paths que ainda não migraram. **Adicionar paths exception explícita já documentada** em i18n.md §"Conteúdo gerado por tenant"                                                                                  |
| 3   | `no-restricted-syntax/aria-label-literal`             | Bloqueia `aria-label="Fechar"`                             | Blueprint 13 §2.2 #2                    | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 4   | `no-restricted-syntax/placeholder-literal`            | Bloqueia `placeholder="Email"`                             | Blueprint 13 §2.2 #3                    | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 5   | `no-restricted-syntax/title-literal`                  | Bloqueia `title="..."`                                     | Blueprint 13 §2.2 #4                    | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 6   | `no-restricted-syntax/alt-literal`                    | Bloqueia `alt="..."` (não-vazio)                           | Blueprint 13 §2.2 #5                    | **MANTER** — a11y crítico                                                                                                                                                                                                                                                                                                  |
| 7   | `no-restricted-syntax/toast-literal`                  | `toast.success('texto')`                                   | Blueprint 13 §2.2 #6                    | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 8   | `no-restricted-syntax/new-Error-literal`              | `new Error('texto')`                                       | Blueprint 13 §2.2 #7                    | **MANTER** — força AppError factory                                                                                                                                                                                                                                                                                        |
| 9   | `no-restricted-syntax/fail-literal`                   | `fail('texto')`                                            | Blueprint 13 §2.2 #10                   | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 10  | `no-restricted-syntax/zod-message-literal`            | `.message('texto')`                                        | Blueprint 13 §2.2 #11                   | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 11  | `no-restricted-syntax/metadata-literal`               | `title: 'desafit'` em export metadata                      | Blueprint 13 §2.2 #9 (ADR-0040 §J)      | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 12  | `no-restricted-syntax/react-email-literal`            | `<Text>Olá</Text>` template email                          | Blueprint 13 §2.2 #12                   | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 13  | `no-restricted-syntax/push-body-literal`              | `body: 'Hora do treino'` em payload push                   | Blueprint 13 §2.2 #13                   | **MANTER** — Edge Function precisa t() resolver locale                                                                                                                                                                                                                                                                     |
| 14  | `no-restricted-syntax/error-map-literal`              | `ERROR_MAP = { not_found: 'Não achei' }`                   | Blueprint 13 §2.2 #14                   | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 15  | `design-tokens/no-tailwind-bypass` (5 sub-detectors)  | `text-xl`/`rounded-2xl`/`uppercase`/`[#hex]`/`[rgb(]`      | Blueprint 13 §2.3, ADR-0044             | **AJUSTAR** — `text-*`/`rounded-*` bypass tem sentido **antes** do ADR-0044 (queriamos `<Heading level>`). Pós-pivot, `<Heading>` é wrapper JIT (deletado em surgical delete). **Loose** `text-*` e `rounded-*` até wrapper renascer. **Manter** `[#hex]`, `[rgb(`, `uppercase` (não dependem de wrapper, são bypass real) |
| 16  | `no-restricted-syntax/JSXAttribute style var(--`      | `style={{ color: 'var(--accent)' }}`                       | Blueprint 13 §2.3 #17 (ADR-0040 §J)     | **MANTER** — Tailwind alias é canal único                                                                                                                                                                                                                                                                                  |
| 17  | `max-lines: 300`                                      | Arquivo > 300 LOC                                          | Blueprint 13 §2.4 #19                   | **AJUSTAR pra 400** — refactor Fase 4 (`actions.ts:269` + `_helpers.ts:187`) é exemplo de partição por **regra**, não **necessidade**. Novel/Tiptap configs típicas 350-450 LOC. Storybook stories ricas ultrapassam. Dual-budget: 400 default, 600 em paths `app/**/actions.ts` + `lib/design/**` + `lib/contracts/**`    |
| 18  | `max-lines-per-function: 60`                          | Função > 60 linhas                                         | Blueprint 13 §2.4 #20                   | **AJUSTAR pra 80** — RSC com fetch + parse + render hits 60 fácil. Reducer pattern de form/page engine (rules-engine.md catalog dispatch) também bate. **80** com path exception em `lib/engines/**` (off — engines têm reducers grandes por design)                                                                       |
| 19  | `complexity: 12`                                      | Branches em função                                         | Blueprint 13 §2.4 #21                   | **AJUSTAR pra 16** — JSON Logic dispatch (forms-engine) e Zod refine chain ultrapassam. **16** é threshold pragmático Airbnb/Vercel internos                                                                                                                                                                               |
| 20  | `max-params: 4`                                       | Função com > 4 params                                      | Blueprint 13 §2.4 #22                   | **MANTER** — objeto agrupa. Hard cap útil contra "primitive obsession"                                                                                                                                                                                                                                                     |
| 21  | `no-restricted-imports/framer-motion`                 | Bloqueia `framer-motion`                                   | Blueprint 13 §2.5 #23, CLAUDE.md naming | **MANTER** — vocab banido                                                                                                                                                                                                                                                                                                  |
| 22  | `no-restricted-imports/next/router/document/head`     | Force App Router APIs                                      | Blueprint 13 §2.5                       | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 23  | `no-restricted-imports/createClient supabase-js`      | Force `@/lib/supabase/{client,server}`                     | Blueprint 13 §2.5                       | **MANTER** — segurança RLS                                                                                                                                                                                                                                                                                                 |
| 24  | `server-only-guard/no-use-client-in-server`           | `'use client'` em `lib/data/` ou `actions.ts`              | Blueprint 13 §2.5 #24                   | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 25  | `brand/no-brand-hardcode`                             | `'desafit'`/`'yoga.app'`/`'ingles.app'` literais           | ADR-0024, brand.md                      | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 26  | `plan-gates/plan-gates-required`                      | `features/<name>/index.ts` re-exporta `./plan-gates`       | ADR-0034 §5+§6                          | **AJUSTAR** — semantics MUDOU pós-ADR-0044 surgical delete: `features/**` está vazio. Manter regra mas com **WARN**, não ERROR, até primeira feature paga real existir (Fase 1 pivot). Senão impede `features/_template/` evolução                                                                                         |
| 27  | `i18next/no-literal-string` (flat/recommended)        | Complementa #2 (jsx-no-literals) com outras heurísticas    | ADR-0040 §J                             | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 28  | `jsx-a11y` strict (~25 rules)                         | WCAG 2.2 AA                                                | ADR-0031 §1                             | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 29  | `better-tailwindcss/*` (9 rules)                      | Correctness Tailwind v4 (conflicts, duplicates, canonical) | ADR-0040 §B                             | **MANTER** — únicos v4-native                                                                                                                                                                                                                                                                                              |
| 30  | `simple-import-sort/imports`+`exports`                | Ordem imports/exports                                      | Auditado de onboarding-bio              | **MANTER** — qualidade barata                                                                                                                                                                                                                                                                                              |
| 31  | `unused-imports/no-unused-imports`                    | Limpa imports                                              | Auditado de onboarding-bio              | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 32  | `@typescript-eslint/no-unused-vars`                   | Args `_*` ignorados                                        | Strict TS hygiene                       | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 33  | `linterOptions: noInlineConfig + reportUnused`        | Bloqueia `/* eslint-disable */` inline                     | ADR-0036                                | **MANTER** — anti-830-disables                                                                                                                                                                                                                                                                                             |
| 34  | `@eslint-community/eslint-comments/*` (3 rules)       | no-use + require-description + no-unused-disable           | ADR-0036                                | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 35  | `architectural boundary lib/**` (no `@/app/*` import) | Layers (ADR layers.md)                                     | Blueprint 04, layers.md                 | **MANTER**                                                                                                                                                                                                                                                                                                                 |
| 36  | `admin client BYPASS RLS forbidden in client/hooks`   | Path-scoped restricted-imports                             | ADR-0031 §4                             | **MANTER** — segurança crítica                                                                                                                                                                                                                                                                                             |
| 37  | `storybook/flat/recommended`                          | Convenções Storybook 10                                    | ADR-0038                                | **MANTER**                                                                                                                                                                                                                                                                                                                 |

### A.2 Rules path-loaded `.claude/rules/*.md` (19 rules)

Não são ESLint; são instruções pra Claude quando edita match path. Mesmo sistema de governança.

| Rule                                                      | Veredito pós-pivot                                                                                                                                                                                  |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `naming.md`                                               | **MANTER** — atualizada pra ADR-0044 vocab pivot                                                                                                                                                    |
| `abstractions.md`                                         | **MANTER** — princípio JIT cravado                                                                                                                                                                  |
| `layers.md`                                               | **MANTER**                                                                                                                                                                                          |
| `data-layer.md` / `domain-logic.md` / `server-actions.md` | **MANTER** — mas atualizar `max-lines-per-function 60` se #18 acima for ajustado                                                                                                                    |
| `features.md`                                             | **AJUSTAR** — semantics quebrada pós-surgical delete (`features/**` vazio). Atualizar status section: "vertical slice rule aplica-se a partir da Fase 1 pivot. Hoje, `features/_template/` é único" |
| `jwt-claims.md`                                           | **MANTER** — segurança crítica                                                                                                                                                                      |
| `components.md`                                           | **AJUSTAR** — checklist obrigatório hierarquia + RESEARCH marker. Pós-surgical delete, hierarquia continua válida; **mas Aceternity exception está vaga** — clarificar "fora do PWA produto"        |
| `i18n.md`                                                 | **MANTER** — playbook completo                                                                                                                                                                      |
| `contrast.md`                                             | **MANTER**                                                                                                                                                                                          |
| `shadcn-zone.md`                                          | **MANTER** — atualizada pós-pivot                                                                                                                                                                   |
| `design-tokens.md`                                        | **MANTER** — fonte autoritativa tokens canonical                                                                                                                                                    |
| `brand.md`                                                | **MANTER**                                                                                                                                                                                          |
| `entitlements.md`                                         | **MANTER** — server-side truth                                                                                                                                                                      |
| `tenant-content.md`                                       | **MANTER** — hierarquia 4 níveis bem desenhada                                                                                                                                                      |
| `forms-engine.md`                                         | **MANTER** — catálogo completo                                                                                                                                                                      |
| `docs-writing.md`                                         | **MANTER**                                                                                                                                                                                          |

### A.3 Grep scripts CI

| Script                | Veredito                                                                     |
| --------------------- | ---------------------------------------------------------------------------- | ----------------- |
| `pnpm vocab:audit`    | **MANTER** — defesa em profundidade vs comments/JSONB                        |
| ~~`pnpm i18n:audit`~~ | **JÁ REMOVIDO** (ADR-0040 §K) — ESLint cobre 14/14 padrões. Manter removido. |
| `pnpm token:audit`    | **MANTER** — `#hex                                                           | rgba(` cross-file |
| `pnpm audit:disables` | **MANTER** — `noInlineConfig` é defesa primária, este é secundária           |
| `pnpm validate:apca`  | **MANTER** — gate `prebuild`                                                 |

---

## B — Princípios atemporais (universais — valem independente de stack)

Esses **NUNCA** se afrouxam, independente da lib que entrar. Forman a coluna vertebral do enforcement.

### B.1 Strings dev (chrome do app) NUNCA hardcoded em código

**Razão:** multi-locale futuro + locale switcher + tenant_copy_overrides exigem que TODA string dev passe por `t('key')`. Strings hardcoded são bloqueio futuro irreversível sem refactor manual.

**ESLint enforce:** regras #2, #3-#14 (jsx-no-literals + 12 no-restricted-syntax + i18next plugin).

**Exceções aceitas (path overrides):**

- `messages/**/*.json` (definição das strings)
- `**/*.test.*` (fixtures)
- `**/*.stories.*` (Storybook — strings demo)
- `app/admin/**` JIT durante refactor — relax temporário documentado em ADR
- `components/ui/**` (shadcn primitives — vendor surface)
- `components/app-form-renderer*`, `components/app-page-renderer*`, `lib/forms/seed-templates/**`, `lib/pages/seed-templates/**`, `supabase/seed/**` (conteúdo do tenant, não dev)
- `eslint.config.mjs`, `scripts/**`, `lib/env.ts`, `lib/route/RouteProvider.tsx` (boot-time)

### B.2 Strings tenant content NUNCA passam por `t()`

**Razão:** form label, page copy, FAQ — tudo escrito pelo profissional/IA — é **dado**, não chrome. Forçar `t()` gera chaves dummy + impede profissional criar form sem deploy.

**ESLint enforce:** path exception em `react/jsx-no-literals` pra renderers (i18n.md §"Conteúdo gerado por tenant").

**Exceções aceitas:** os mesmos paths de renderer listados na rule i18n.md já cobertos.

### B.3 Brand identity NUNCA hardcoded em código

**Razão:** ADR-0024 — 1 código + N marcas. Adicionar marca filha = INSERT + DNS, zero refactor. Hardcode `'desafit'` em código quebra essa promessa.

**ESLint enforce:** `brand/no-brand-hardcode` (regra #25).

**Exceções aceitas:** 8 paths listados em `naming.md` (definição, ADRs, docs/\_archive, etc).

### B.4 Cores nunca hex literal em JSX/TS

**Razão:** ADR-0044 — `--background`, `--card`, etc são interface pública. Hex literal em código quebra theming runtime + APCA dual-gate.

**ESLint enforce:** `design-tokens/no-tailwind-bypass` (hexArbitrary + rgbArbitrary) — regra #15 sub-detectores.

**Exceções aceitas:** `app/globals.css @theme`, `lib/design/build-theme-css.ts`, `lib/design/contrast.ts` (`oklchToHex`), `app/api/**/og` SVG inline, blurhash hashes.

### B.5 Fontes nunca `font-family` literal

**Razão:** 3 fontes canonical (`--font-sans`/`--font-serif`/`--font-mono`) são per-tenant via tenant_theme_versions.snapshot.

**ESLint enforce:** **REGRA NOVA proposta** `no-raw-fontfamily` (ADR-0044 §12). Hoje não enforced (regra prometida não-implementada).

**Exceções aceitas:** `app/globals.css @theme`, `next/font/google` imports em layout.

### B.6 Tenant data NUNCA em código

**Razão:** ADR-0033 + RLS. Conteúdo do tenant (programas, leads, formulários) vem só do DB com `tenant_id` filtrado por JWT.

**ESLint enforce:** indireto via `no-restricted-imports/admin client` (regra #36) e architectural boundary (#35).

### B.7 RLS é a fronteira de segurança (não schema, não env, não código)

**Razão:** ADR-0033 — schema único `public.*`. Toda tabela tenant-scoped TEM RLS policy com `(select public.current_tenant_id())`.

**ESLint enforce:** indireto via `jwt-claims.md` rule path-loaded + smoke tests obrigatórios.

### B.8 Admin client (BYPASS RLS) só em server (Server Actions, Edge Functions)

**Razão:** SECDEF que aceita `p_tenant_id` sempre valida (memória `feedback_secdef_validates_tenant_id`).

**ESLint enforce:** regra #36 path-scoped.

### B.9 Server actions retornam `Result<T, AppError>` (nunca throw)

**Razão:** UI espera discriminated union; throw quebra contrato.

**ESLint enforce:** indireto via rule path-loaded `server-actions.md`. **REGRA NOVA proposta** que detecte `throw` no top-level de função marcada `'use server'`.

### B.10 lib/domain/ ZERO IO (zero React, zero Supabase, zero fetch, zero Date.now)

**Razão:** testabilidade + determinismo (domain-logic.md).

**ESLint enforce:** Sheriff boundary (não-implementado dia 0) + lint cheap path-restricted import.

---

## C — Princípios pragmáticos (stack-dependent)

Cada item: contexto + recomendação **MANTER / AJUSTAR / REMOVER** + razão.

### C.1 `max-lines: 300` — **AJUSTAR pra 400**

**Contexto:** Atual 300 forçou refactor Fase 4: `app/admin/theme-studio/actions.ts` ficou 269 LOC (quase no limite, mas resolvido com partição **forçada** em `_helpers.ts` 187 LOC). Total 749 LOC pra mover 4 server actions + helpers + tests. Esse refactor foi **por regra**, não por necessidade — os helpers existem só pra cumprir limite.

**Stack candidata:**

- Novel/Tiptap configs típicos: 350-450 LOC (extensions config + custom commands)
- Storybook stories ricas: 400-500 LOC (multi-variant + decorators + interactions)
- Editor pages (theme-studio builder UI): 500-700 LOC (UX complexa centralizada)
- Vercel AI SDK orchestration: 400-600 LOC (router + classifier + generator + fallback)

**Recomendação:**

- Default: **400** (+33% — captura casos comuns sem permitir bloat real)
- Path exception **600**:
  - `app/**/actions.ts` (server actions com helpers inline preferíveis)
  - `lib/design/**` (theme algorithms + builders)
  - `lib/contracts/**` (Zod schemas + types co-localizados)
  - `lib/forms/seed-templates/**` + `lib/pages/seed-templates/**` (já off via ADR-0031 §9)
  - `lib/ai/**` (orchestration + prompts)
- Path exception **off**:
  - `scripts/**` (já off)
  - `lib/contracts/database.ts` (gerado, já off)
  - `components/ui/**` (vendor, já off)

### C.2 `max-lines-per-function: 60` — **AJUSTAR pra 80**

**Contexto:** RSC com fetch + parse + render bate 60 fácil. Reducer pattern (form/page engine catalog dispatch) também. Refactor Fase 4 quebrou `bootstrapTenantTheme` em 2 funções **só pra caber em 60**, sem ganho de clareza.

**Recomendação:**

- Default: **80** (+33%)
- Path off:
  - `lib/engines/**` (reducers grandes por design)
  - `app/admin/theme-studio/**` (builder UX flows centralizados)
  - `supabase/functions/**` (Edge function handlers tendem a ser maiores)

### C.3 `complexity: 12` — **AJUSTAR pra 16**

**Contexto:** JSON Logic dispatch em forms-engine (logic-rule evaluator) e Zod refine chains ultrapassam. Vercel/Airbnb internos usam 16 como threshold.

**Recomendação:** **16** universal.

### C.4 `max-params: 4` — **MANTER**

**Contexto:** Objeto sempre agrupa. Hard cap útil contra "primitive obsession". Refactor Fase 4 manteve `insertVersion(admin, params: InsertVersionParams)` — correto.

**Recomendação:** Mantém.

### C.5 RSC default vs Client opt-in — **MANTER + adicionar guard pra Novel/Tiptap**

**Contexto:** Regras path-loaded (`components.md`, `data-layer.md`) já enforçam RSC default. Mas Novel/Tiptap são **Client-only** (precisam DOM + state). Quando entrar, criar exceção explícita.

**Recomendação:** Adicionar override path `**/novel-editor*.tsx` + `**/tiptap*.tsx` loose pra `server-only-guard` (regra #24 não dispara em paths client) — não precisa código novo, é só documentação onde editor vai morar.

### C.6 Inline `style={{}}` proibido (regra #16) — **MANTER**

**Contexto:** Tailwind alias resolve 99% dos casos. Magic UI usa `style` pra props dinâmicas de animação (rotate, translate), mas isso vai via Motion library, não inline. Origin UI puro Tailwind.

**Recomendação:** Mantém. Se Magic UI quebrar, add path exception `components/ui/magicui/**` (zona quarentenada).

### C.7 `text-*` e `rounded-*` Tailwind bypass — **AJUSTAR (loose temporário)**

**Contexto:** Regra #15 originalmente exigia `<Heading level>` e `var(--shape-*)`. Wrappers Heading + Text + Eyebrow foram deletados em surgical delete (ADR-0044). Sem wrapper, regra dispara em `<h1 className="text-2xl">` que é uso legítimo hoje.

**Recomendação:**

- **Loose `text-*` e `rounded-*`** até wrappers re-introduzidos (Fase 1-3 pivot)
- **Manter `[#hex]`, `[rgb(`, `uppercase`** — bypass real, independem de wrapper
- Re-apertar quando `<Heading>` voltar (path exception única: wrapper file)

### C.8 Hardcoded values numéricos quando — **TABELA SEÇÃO E**

Ver Seção E pra resposta definitiva tipo-por-tipo.

### C.9 `plan-gates-required` por feature — **AJUSTAR pra WARN**

**Contexto:** `features/**` está vazio pós-surgical delete. Regra ERROR dispara só em `features/_template/index.ts`, que é referência. Em Fase 1 do pivot (primeira feature paga real) reverte pra ERROR.

**Recomendação:** WARN até primeira feature paga real existir. Anotar gatilho em ADR.

### C.10 `react/jsx-no-literals` paths exception — **DOCUMENTAR no eslint.config.mjs**

**Contexto:** i18n.md §"Paths onde literal de string PT-BR/EN é PERMITIDO" lista 6 paths (renderers + seeds), mas exceção não foi adicionada ao `eslint.config.mjs`. Hoje os renderers vão quebrar quando criados.

**Recomendação:** Adicionar bloco override no eslint.config.mjs:

```js
{
  files: [
    'components/app-form-renderer*.tsx',
    'components/app-form-block-*.tsx',
    'components/app-page-renderer*.tsx',
    'components/app-page-block-*.tsx',
    'lib/forms/seed-templates/**/*.ts',
    'lib/pages/seed-templates/**/*.ts',
  ],
  rules: { 'react/jsx-no-literals': 'off', 'i18next/no-literal-string': 'off' },
}
```

---

## D — Regras NOVAS necessárias (stack forward)

Cada regra: glob path, message, severity, motivação concreta.

### D.1 `no-raw-fontfamily` — **NOVA (ADR-0044 §12 prometeu, nunca implementado)**

```js
{
  files: ['**/*.{ts,tsx}'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "TemplateLiteral, Literal[value=/font-family\\s*:/i]",
        message: "font-family literal — use var(--font-sans/serif/mono).",
      },
      {
        selector: "JSXAttribute[name.name='className'] > Literal[value=/font-\\[/]",
        message: "font-[Inter] arbitrary Tailwind — use var(--font-sans/serif/mono) ou Tailwind alias.",
      },
    ],
  },
}
```

Severity: ERROR (universal — princípio B.5).

### D.2 `no-vh-in-mobile-aware` — **NOVA (ADR-0044 §12 prometeu)**

```js
{
  files: ['app/**/*.{ts,tsx,css}', 'components/**/*.{ts,tsx,css}'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "Literal[value=/[\\d.]+vh\\b/]",
        message: "100vh em mobile-aware — use 100dvh ou var(--mobile-full-height).",
      },
    ],
  },
}
```

Severity: ERROR. Exception JIT: paths Storybook + email templates (a11y diferente).

### D.3 `novel/persist-prosemirror-json` — **NOVA (forward planning)**

Quando Novel entrar (vibe coding rich-text editor pra programa/lesson/protocol):

```js
{
  files: ['lib/data/programs/**', 'lib/data/protocols/**', 'lib/data/lessons/**'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "MemberExpression[object.name='editor'][property.name='getHTML']",
        message: 'Novel/Tiptap: persistir como ProseMirrorJSON via editor.getJSON(), não getHTML(). HTML string perde structured data + APCA + i18n overlay.',
      },
    ],
  },
}
```

Severity: ERROR. Razão: HTML string em DB quebra structured query + multi-locale overlay + recompose. ProseMirrorJSON é canonical.

### D.4 `novel/no-tailwind-class-inline-attrs` — **NOVA (forward planning)**

Quando Novel/Tiptap entrarem, extensions custom podem tentar embutir Tailwind class em `attrs`. Isso quebra theming runtime (classe não muda com tema).

```js
{
  files: ['lib/forms/**', 'lib/pages/**', 'components/**/novel*', 'components/**/tiptap*'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "Property[key.name='HTMLAttributes'] Property[key.name='class'] > Literal",
        message: "Tiptap node HTMLAttributes.class hardcoded — usar var(--canonical) ou Tailwind alias dinâmico via theme.",
      },
    ],
  },
}
```

Severity: ERROR JIT (só dispara quando paths existirem).

### D.5 `origin-ui/no-bulk-import` — **NOVA (forward planning)**

Quando Origin UI for adotado pra blocks selecionados (multi-select, time picker, avatar-stack):

```js
{
  files: ['**/*.{ts,tsx}'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: ['@origin-ui/*'], message: 'Origin UI: copiar componente individual via `npx shadcn add <url>` em components/app-*.tsx, não import npm package.' },
          { group: ['@magicui/*'], message: 'Magic UI: copiar componente individual via `npx shadcn add @magicui/<slug>` em components/app-*.tsx, não import npm package.' },
        ],
      },
    ],
  },
}
```

Severity: ERROR. Razão: catálogos copy-paste shadcn-compatible **não** são npm packages — copiar pra wrapper isolado mantém shadcn-zone quarantine.

### D.6 `registry/no-block-kind-without-whitelist` — **NOVA (forward planning Registry catalog)**

Quando Registry catalog (forms/pages blocks polymorphic) entrar, spec parser tem que validar `kind` contra whitelist (engine catalog forms-engine.md):

```js
{
  files: ['lib/forms/parse/**', 'lib/pages/parse/**', 'app/api/forms/**', 'app/api/pages/**'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "CallExpression[callee.name=/parse|safeParse/][arguments.0.type='ObjectExpression'] Property[key.name='kind'][value.type='Literal']",
        message: 'Registry: validar `kind` contra ENGINE_CATALOG_FORM/PAGE allowlist antes de discriminatedUnion. Spec inválido = trust-the-client.',
      },
    ],
  },
}
```

Severity: ERROR JIT.

### D.7 `next-themes/attribute-must-be-class` — **NOVA (já wired, regra defensiva)**

```js
{
  files: ['app/_components/theme-provider*.tsx', 'app/**/theme-provider*.tsx'],
  rules: {
    'no-restricted-syntax': [
      'error',
      {
        selector: "JSXAttribute[name.name='attribute'][value.value!='class']",
        message: "next-themes ThemeProvider attribute deve ser 'class' (compat shadcn dark variant). Outras values quebram shadcn .dark selector.",
      },
    ],
  },
}
```

Severity: ERROR. Defesa em profundidade — hoje hardcoded em `theme-provider-client.tsx`, mas regra impede regressão.

### D.8 ESLint rule custom — `tenant-context-in-theme-mutation`

```js
{
  files: ['app/**/actions.ts', 'lib/data/tenant_themes/**', 'lib/data/tenant_theme_versions/**'],
  rules: {
    // Detecta mutations em tenant_themes/tenant_theme_versions SEM assertTenantMatch
    // ou requireEntitlement na função. Custom AST rule.
  },
}
```

Severity: ERROR JIT. Razão: theme storage é cross-tenant write controlled (memória `feedback_secdef_validates_tenant_id`). Toda mutation tem que validar JWT match. Hoje cumprido manualmente em `assertTenantMatch` — regra previne esquecimento futuro.

---

## E — Tabela definitiva: pode/não pode inline/hardcoded

| Tipo de valor                                           | Pode inline?            | Pode hardcoded?  | Quando extrair?                                                                                     |
| ------------------------------------------------------- | ----------------------- | ---------------- | --------------------------------------------------------------------------------------------------- |
| String PT-BR/EN copy app (chrome dev)                   | ❌                      | ❌               | Sempre `t('key')` next-intl                                                                         |
| String tenant content (form labels, page copy, FAQ)     | ✅ paths renderer       | ✅ DB JSONB      | Nunca via `t()` — é dado                                                                            |
| Cor hex `#fff`, `rgb()`, `rgba()` em JSX/TS             | ❌                      | ✅ allowlist     | Sempre `var(--canonical)` ou tailwind alias. Allowlist: globals.css `@theme`, `oklchToHex` fallback |
| Cor OKLCH literal `oklch(...)` em JSX/TS                | ❌                      | ✅ allowlist     | Sempre `var(--canonical)`. Allowlist: `lib/design/seeds/**`, `lib/design/theme-defaults.ts`         |
| Tailwind class `bg-primary`, `text-foreground`          | ✅                      | ✅               | Sempre — interface pública shadcn                                                                   |
| Tailwind arbitrary `text-[#hex]`, `bg-[rgb()]`          | ❌                      | ❌               | Substituir por `bg-{canonical}` ou `var(--canonical)`                                               |
| Tailwind size `text-xl`, `rounded-2xl`                  | ✅ (até wrapper voltar) | ✅               | Quando `<Heading>` / `<Eyebrow>` voltar (Fase 1-3 pivot)                                            |
| Spacing `px-4`, `gap-6`, etc (Tailwind v4)              | ✅                      | ✅               | Sempre — base `--spacing` overrideable per-tenant                                                   |
| Spacing arbitrary `px-[24px]`                           | ❌                      | ❌               | Use Tailwind scale ou `var(--spacing-N)` Carbon                                                     |
| Font-family literal `'Inter, sans-serif'`               | ❌                      | ✅ allowlist     | `var(--font-sans/serif/mono)`. Allowlist: `app/layout.tsx` next/font imports, `globals.css @theme`  |
| Font-size literal `16px`, `font-[Inter]`                | ❌                      | ❌               | Tailwind alias                                                                                      |
| Brand name `'desafit'`/`'yoga.app'`                     | ❌                      | ❌               | `useBrand()` / `useTenant()`. Allowlist: 8 paths em naming.md                                       |
| Logo asset path                                         | ❌                      | ❌               | `<Logo>` componente único (JIT — re-add Fase 1-3) com 3 variants × 3 temas × 3 sizes                |
| Boolean feature flag                                    | ✅ default              | ✅ default       | `useEntitlement('feature')` server-side; client `useEntitlement` consulta snapshot                  |
| Plan slug `'PRO'`, `'FREE'`                             | ❌                      | ❌ no JSX        | `useEntitlement().plan` ou capability flag                                                          |
| Numeric constant (z-index, breakpoint)                  | ❌                      | ✅ allowlist     | `var(--z-X)`, `var(--breakpoint-mobile)`. Allowlist: `app/globals.css @theme`                       |
| Numeric constant lógica negócio (max-blocks=25, cap=50) | ❌                      | ❌               | Constant nomeada em `lib/contracts/<entity>.ts` (`MAX_FORM_BLOCKS`, `THEME_VERSION_CAP`)            |
| API endpoint URL                                        | ❌                      | ❌               | `import { env } from '@/lib/env'`                                                                   |
| Magic number lógica de negócio                          | ❌                      | ❌               | Constant nomeada                                                                                    |
| Date/time format string                                 | ❌                      | ✅ constants     | `lib/contracts/format.ts` constants ou `Intl.DateTimeFormat`                                        |
| Regex literal `/^[a-z_]+$/`                             | ✅ se usado 1x          | ✅ co-localizado | Extrair pra `lib/contracts/regex.ts` se 3+ usos                                                     |
| SQL string em data layer                                | ✅ via Supabase client  | ❌ raw SQL       | Sempre Supabase query builder. RPCs nomeadas em migration                                           |
| Postgres function name `'current_tenant_id'`            | ✅ string lookup        | ✅               | OK — RPC name é contract                                                                            |
| HTTP header name `'X-Tenant-Slug'`                      | ✅ const                | ✅               | Const nomeada em `lib/contracts/headers.ts` se 3+ usos                                              |
| Error message EN dev fallback                           | ✅ `fallback` field     | ✅               | `AppError.X({ key, fallback })` factory                                                             |
| Toast key i18n                                          | ✅ via wrapper          | —                | `useAppToast` wrapper JIT consume i18nKey                                                           |
| Block kind enum string `'short-text'`                   | ✅ Zod literal          | ✅               | Zod `z.discriminatedUnion('type', [ShortText, ...])` em `lib/contracts/form-blocks/<kind>.ts`       |
| Plan kind enum string `'A'`, `'B'`, `'C'`               | ✅ Zod literal          | ✅               | Zod `PlanSlugSchema` em `lib/contracts/entitlements.ts`                                             |
| Vertical kind string `'fitness'`, `'yoga'`              | ✅ Zod literal          | ✅               | Zod enum + DB enum                                                                                  |
| Test fixture data                                       | ✅                      | ✅               | Mantém em test file                                                                                 |
| Storybook story arg                                     | ✅                      | ✅               | Mantém em story file (path override)                                                                |
| Markdown literal em React Email template                | ❌                      | ❌               | `<Text>{t('email.welcome.body')}</Text>` ou `messages/email.json`                                   |
| Mobile breakpoint `768`, `64px FAB`                     | ❌                      | ✅ globals.css   | `var(--touch-min)`, `var(--breakpoint-mobile)`. Allowlist: `globals.css @theme`                     |
| iOS safe-area `env(safe-area-inset-*)`                  | ✅                      | —                | `var(--inset-safe-{top,bottom,left,right})` derived em globals.css                                  |

---

## F — Critério "abstrair quando 3+ usos"

Validar regra existente (`abstractions.md`). Casos border da Fase 4:

### F.1 Cases que justificaram abstração (3+ usos)

| Caso                                                                | 3+ usos?                                                                         | Veredito                                                                                                                   |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `bootstrap/save/list/restore` actions (Result+AppError+RLS check)   | 4 actions, mesmo pattern (assertTenantMatch + ok/fail)                           | ✅ OK                                                                                                                      |
| `insertThemeFailedError()` / `insertVersionFailedError()` factories | 2 usos cada                                                                      | ❌ Border — não justifica extração; **deveria estar inline**                                                               |
| 6 PWA routes com `buildThemeCSS` + fetch snapshot                   | 6 routes (manifest brand + tenant + icon brand + tenant + splash brand + tenant) | ✅ OK — mas helper hoje é `extractManifestColors` co-localizado, não shared. **Sinal pra promoção** quando 7º route entrar |
| `ThemeProviderClient` (next-themes 'use client' boundary)           | 1 uso só                                                                         | ❌ Mas **OK violar regra de 3** — boundary client necessária, sem alternativa                                              |
| `useServerAction(action)` hook                                      | Hoje 0 callsites (todas server actions chamadas inline)                          | ❌ Premature — mas existente, manter pra primeira feature paga                                                             |

### F.2 Regra refinada (proposta)

A regra "3+ usos" tem exceções legítimas. Codificar em `abstractions.md`:

**OK criar abstração com < 3 usos quando:**

1. **Boundary obrigatório** (Server↔Client, RSC↔Client, Node↔Edge) — não existe alternativa
2. **Type-level contract** (Zod schema, AppError factory) — abstração **é** o contrato
3. **Vendor adapter** (next-themes wrapper, sonner toast wrapper quando i18nKey vier) — interfaceia lib externa que não controlamos
4. **Public API surface** (`features/<name>/index.ts` re-export) — sheriff boundary requirement

**Os casos da Fase 4:**

- `ThemeProviderClient`: regra 1 (boundary client) — **OK violar**
- `assertTenantMatch`: 4 chamadas — **regra 3 cumprida**
- `insertVersionFailedError()` / `insertThemeFailedError()`: 1 chamada cada — **violação regra**, mas aceitável porque AppError factory **é** o contract type-level (regra 2). Caveat: hoje é factory anônima em scope local — promover pra `lib/contracts/errors.ts` se 2º callsite aparecer

---

## G — Open questions (5-10 itens pra user decidir)

### Q1. Limites estruturais — bump pra (400, 80, 16, 4)?

Os 4 limites (max-lines, max-lines-per-function, complexity, max-params) foram cravados em ADR-0012/blueprint 13 baseado em onboarding-bio (precedente caro). Pós-pivot + stack forward, recomendação:

- max-lines: 300 → **400** (path override 600 pra `actions.ts`, `lib/design/**`, `lib/contracts/**`, `lib/ai/**`)
- max-lines-per-function: 60 → **80** (path off em `lib/engines/**`)
- complexity: 12 → **16**
- max-params: 4 → **mantém**

User decide: aceita bump? OU mantém estrito e refactor é OK?

### Q2. `text-*` e `rounded-*` Tailwind bypass — loose temporário ou manter ON?

Wrappers `<Heading>`, `<Eyebrow>`, `<Text>` foram deletados em surgical delete. Hoje regra dispara em código legítimo. Opções:

- **A.** Loose `text-*`/`rounded-*` até wrappers re-introduzidos (Fase 1-3 pivot). Manter `[#hex]`, `[rgb(`, `uppercase`
- **B.** Manter strict — desenvolver inline `<h1 className="text-2xl">` falha, força criar wrapper imediato
- **C.** Loose tudo até Fase 3 (Pacote A cliente final) onde produto consolida design system

Recomendação: **A**. User decide qual.

### Q3. `plan-gates-required` por feature — WARN ou ERROR?

`features/**` está vazio. ERROR dispara em `features/_template/index.ts` (referência). Opções:

- **A.** WARN até primeira feature paga real (Fase 1 pivot). Ergue pra ERROR quando primeira gate concreta nascer.
- **B.** Manter ERROR, aceitar que `_template` precisa cumprir.

Recomendação: **A**. User decide.

### Q4. Novel/Tiptap content storage — JSON canonical ou negotiable?

Quando Novel/Tiptap entrarem (rich-text editor pra programa/lesson/protocol), regra proposta D.3 força ProseMirrorJSON. Mas certas integrações (export pra Markdown, share, email) precisam HTML.

Opções:

- **A.** JSON canonical em DB. HTML é derived view via `editor.getHTML()` em render-time.
- **B.** HTML em DB. JSON derived via `generateJSON()` quando edit.
- **C.** Ambos colunados (`content_json jsonb`, `content_html text`) com trigger sync.

Recomendação: **A** (canonical pattern Tiptap). User decide.

### Q5. Origin UI / Magic UI — npm package OU copy-paste via shadcn CLI?

Verifiquei via WebFetch: Origin UI e Magic UI são **copy-paste via `npx shadcn add <url>`**, **não** npm packages. Regra proposta D.5 bloqueia `import '@origin-ui/*'` e `@magicui/*` (que não existem como npm).

Mas: alguma equipe pode tentar criar wrapper local que **finja** ser npm path (`@origin-ui/avatar-stack` apontando pra `components/origin-ui/avatar-stack.tsx` via tsconfig paths). Isso quebra o quarantine.

Opções:

- **A.** Bloquear `@origin-ui/*` e `@magicui/*` paths Vibração (regra D.5). Componentes copy-pasted vivem em `components/app-*.tsx` ou `components/origin-ui/**` separados.
- **B.** Permitir `@/components/origin-ui/*` (paths config) — mas então fica zona dupla de quarantine.

Recomendação: **A**. User decide.

### Q6. Block builder vs template+slots — re-confirmar pós-pivot?

`tenant-content.md` cravou em ADR (4 níveis hierarquia): "Primeira landing page por tenant = nível 3 (template+slots). NÃO pular direto pra nível 4". Mas Novel/Tiptap entrando pode tentar **se** pivot pra block builder cedo.

Opções:

- **A.** Manter — Novel é pra programa/lesson/protocol (conteúdo curatório longo), não landing
- **B.** Pivot — Novel também serve landing block-by-block, deprecia template+slots

Recomendação: **A** — domínios diferentes. User decide.

### Q7. Registry catalog timing — aguardar Fase 1 pivot ou começar paralelo?

Form/Page engines têm catalog open-set (forms-engine.md). Registry catalog (forward planning) generaliza isso pra "qualquer kind". Regra D.6 enforce whitelist quando parser existir.

User decide: começar catálogo paralelo agora OU defer pra Fase 1?

### Q8. CSS var em JSX style — manter strict ou afrouxar pra Motion presets?

Regra #16 bloqueia `style={{ color: 'var(--accent)' }}`. Mas Motion presets (animação) usam `style={{ transform: ... }}` legitimamente. E Magic UI animação dinâmica pode precisar.

Opções:

- **A.** Manter strict. Motion presets vivem em arquivos `lib/design/motion.ts` (não JSX inline)
- **B.** Allowlist propriedades de animação (`transform`, `opacity`, `filter`) no detector

Recomendação: **A**. User decide.

### Q9. `i18next/no-literal-string` paths exception — adicionar ao eslint.config agora?

`i18n.md` documenta 6 paths exceção (renderers + seeds), mas eslint.config.mjs não tem o override. Hoje os renderers ainda não existem; quando criados, vão quebrar build.

Opções:

- **A.** Adicionar override agora (preventivo)
- **B.** Adicionar JIT (quando primeiro renderer for criado)

Recomendação: **A** (cheap + previne lint paralisia futura). User decide.

### Q10. Sheriff boundaries — implementar agora ou Fase 1?

Blueprint 13 §3 menciona `@softarc/eslint-plugin-sheriff` instalado (package.json confirma 0.19.6) — mas `sheriff.config.ts` não existe ainda. Hoje só `no-restricted-imports` path-based cobre boundary.

Opções:

- **A.** Implementar sheriff.config.ts agora (Fase paralela)
- **B.** Defer pra Fase 1 quando features reais existirem

Recomendação: **B** — boundaries são over-engineered sem features pra proteger. User decide.

---

## H — Roadmap proposto (se user aprovar)

Em ordem de menor → maior risco:

1. **Ajuste limites estruturais (Q1)** — 30min — edit eslint.config.mjs + revisar 1 arquivo top-LOC
2. **Adicionar paths exception jsx-no-literals/i18next renderers (Q9)** — 15min — edit eslint.config.mjs
3. **Loose `text-*`/`rounded-*` (Q2)** — 30min — edit `tokenBypassPlugin` regex
4. **`plan-gates-required` WARN (Q3)** — 5min — severity flip
5. **Atualizar features.md rule** (status quebrado pós-surgical delete) — 20min
6. **Adicionar `no-raw-fontfamily` (D.1) + `no-vh-in-mobile-aware` (D.2)** — 30min — 2 regras prometidas ADR-0044 §12
7. **Defer D.3-D.8 pra Fase 1 pivot** (forward planning)

**Total estimado pra cravar em ESLint config + ADR documentando decisões:** 3-5h.

Inclui: edits eslint.config.mjs (1.5-2h), update rule files path-loaded afetados (1h), ADR escrevendo (0.5-1h), validate build verde + grep audit (0.5h).

---

## I — Conclusão executiva

O sistema ESLint atual é **superdimensionado pra fase atual** (pós-pivot, sem features pagas reais) em **6 dimensões** (max-lines, max-lines-per-function, complexity, text-_/rounded-_ bypass strictness, plan-gates ERROR, paths exception não-cravados) e **subdimensionado em 5** (no-raw-fontfamily, no-vh-in-mobile-aware, regras forward stack Novel/Origin/Magic/Registry/next-themes).

**O custo de não ajustar:** refactor forçado em código já produtivo (Fase 4 mostrou — `actions.ts` partido em 2 sem ganho), Claude/devs futuras criando workarounds em vez de seguir convenção, code review consumido em "essa função tem 61 linhas" em vez de bugs reais.

**O custo de ajustar:** ~5h trabalho + 1 ADR documentando + risco baixo (regras estruturais são tuning quantitativo, segurança/multi-tenant/branding ficam estritas).

Recomendação: **ajustar agora**, antes da Fase 1 do pivot (primeira feature paga) começar. Pós-Fase 1, refactor de eslint config requer migration de código já estruturado — caro.

---

## Referências

- ADR-0012 — lint enforcement dia 0 (24 regras)
- ADR-0024 — multi-marca via hostname
- ADR-0033 — schema único `public.*`
- ADR-0034 + ADR-0035 — vertical slice + entitlements UX
- ADR-0036 — hooks PreToolUse + linterOptions
- ADR-0040 §A-L — wrapper strategy + lint enforcement complementar
- ADR-0044 — pivot TweakCN shadcn-canonical
- `docs/blueprint/13-lint-enforcement.md` — blueprint 24 regras + Sheriff + grep
- `.claude/rules/*.md` (19 rules path-loaded)
- `eslint.config.mjs` (813 LOC)
- `app/admin/theme-studio/{actions,_helpers,actions.test}.ts` — caso real refactor forçado Fase 4
- `package.json` — stack instalado + libs candidatas
- Memórias relevantes: `feedback_secdef_validates_tenant_id`, `feedback_zero_eslint_disable`, `feedback_jit_anchoring`, `feedback_frescura_filter`
- Novel docs — https://novel.sh + https://github.com/steven-tey/novel
- Tiptap docs — https://tiptap.dev/docs/editor
- Origin UI — https://originui.com (Radix + shadcn copy-paste)
- Magic UI — https://magicui.design (motion + shadcn copy-paste)
- Vercel AI SDK v6 — https://ai-sdk.dev

## Histórico

| Data       | Mudança                                                                              | Aprovador       |
| ---------- | ------------------------------------------------------------------------------------ | --------------- |
| 2026-05-21 | Versão inicial — research pós-pivot ADR-0044 + stack forward (Novel/Origin/Magic/AI) | Opus despachado |
