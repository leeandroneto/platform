# Session Dump — Shadcn Zone Quarantine + Fechamento Dia 0

> **Status:** APROVADO 2026-05-18 noite (pós Pesquisa 19) · **Owner:** Leandro
> Documento de continuação — se contexto Claude estourar, sessão nova lê isto e continua sem perder trabalho feito.
> Plano executável formalizado em `docs/plans/PLANO-FECHAMENTO-DIA-0.md` (criado nesta sessão).

---

## 🟢 DECISÕES APROVADAS FINAIS (martelo batido 2026-05-18 noite-2)

Fonte: Pesquisas 17 + 18 + 19 + 20 + 21 (i18n) + aprovação do fundador "bata o martelo".

1. **3 wrappers compostos OBRIGATÓRIOS dia 0** (REVISADO pós Pesquisa 20):
   - `AppForm` — RHF + Zod resolver + AppError i18n + submit handler tipado (encapsula ~30 linhas)
   - `AppToast` — sonner Toaster + helpers semantic `toast.success(i18nKey)`
   - `AppEntitlementGate` — `useEntitlement()` + paywall modal + upgrade CTA (white-label SEMPRE precisa)
   - **JIT na feature 1 conforme demanda real:** AppButton (se loading state aparecer), AppInput (se error display integrado pedir), AppDialog (primeiro modal). NÃO criar preventivo.
   - Wrapper passthrough (só re-exporta) é PROIBIDO — Vercel Academy.

2. **3 typography essenciais dia 0** (REVISADO pós Pesquisa 20):
   - `Heading` (level prop 1-4) — shadcn não entrega (issue #1527 oficial)
   - `Text` (variants body, body-sm, lead)
   - `Muted` (text-sm text-muted-foreground)
   - **JIT por feature:** `Code` (primeira admin), `Stack`/`Container`/`EmptyState` (regra de 3), `Metric`/`DataCell` (dashboard real), `Eyebrow`/`Section`/`Divider`/`VisuallyHidden` (uso real), `<Logo>` (landing agência).

3. **i18n namespace por feature desde dia 0** (não flat). Estrutura: `messages/<locale>/<namespace>.json` (next-intl Discussion #357 + SimpleLocalize). Dia 0: só `messages/pt-BR/common.json` (actions/errors/validation).

4. **Locales adicionais (en-US, pt-PT, es-ES):** NÃO dia 0. Estrutura já aceita irmãos sem refactor. Gatilho: 2º locale ativo cross-brand.

5. **Tenant copy override:** NÃO dia 0. Schema NÃO criar. Custo de retrofit confirmado **2-4h**. Gatilho JIT: cliente 2 com vertical diferente pede explicitamente.

6. **Abstrair shadcn pra trocar futuramente:** NÃO fazer. Vercel Academy + Martin Fowler YAGNI convergem.

7. **APCA Silver dual-gate (75/60/45)** — substitui Bronze (75/30) atual. Alinha com blueprint 05 §5.

8. **`no-restricted-imports` bloqueando `@/components/ui/*`:** REMOVIDO (REVISADO pós Pesquisa 20). Hook `component-research-gate.sh` já bloqueia Edit direto em `components/ui/*` (zona quarentenada). Regra de import preventiva força wrapper passthrough (anti-pattern). Wrapper criado apenas quando agrega valor (regra de 3 + Vercel Academy).

9. **Hook `component-research-gate.sh` reforçado** pra bloquear Edit (não só Write) em `components/ui/*`. Canal legítimo único: Bash rodando `npx shadcn add`.

10. **6 novos `.claude/rules/*.md`** (granular): `i18n.md`, `contrast.md`, `shadcn-zone.md`, `design-tokens.md`, `brand.md`, `entitlements.md`. CADA UM com "Gatilho + Passo-a-passo + Anti-pattern + **Condição de revisitar** + Referência cruzada" (regra Pesquisa 20).

11. **ADR-0040** consolida tudo (uma fonte). NÃO fragmentar.

12. **Wire APCA via `package.json prebuild`** (não `vercel.ts buildCommand`).

### Decisões i18n (13-22) — Research 21

13. **Rota `[locale]` dia 0:** NÃO criar. Locale resolvido server-side fixo `pt-BR` em `i18n/request.ts`. Migrar pra `app/[locale]/` é refator de 2-4h JIT.

14. **Messages estrutura:** namespace por feature. Dia 0: `messages/pt-BR/common.json`. JIT por feature (`auth.json`, `billing.json`, etc).

15. **Multi-vertical terminologia:** chaves descritivas neutras (`programs.title`, NÃO `workouts.title`). Copy fitness-shaped no VALOR dia 0. Cross-vertical via tenant_copy_overrides JIT.

16. **Tenant copy override:** confirma item 5.

17. **Multi-brand + locale:** locale fixo `pt-BR` dia 0, brand ortogonal. Schema `public.brands.default_locale` ADIA — migration single-column quando 2ª brand internacional.

18. **next-intl v4 setup canônico:** `i18n/request.ts` + `createNextIntlPlugin` em `next.config.ts` + `NextIntlClientProvider` em `app/layout.tsx` (envolvendo `RouteProvider`). Lazy-load namespace via `dynamic import`.

19. **AppError factory i18n:** estender pra aceitar `string | { key, fallback, metadata? }`. Back-compat. Server loga `fallback` EN (Sentry-friendly); client traduz `key` via `t()`. Helper privado `normalize(msg)`. Type `I18nMessage` em `lib/contracts/errors.ts`.

20. **Locale switcher UI:** JIT. Sem switcher dia 0. Gatilho: 2º locale ativo cross-brand. Componente `components/app-locale-switcher.tsx` futuro.

21. **SEO/SSR multi-locale:** `<html lang={locale}>` dinâmico via `await getLocale()`. `generateMetadata` usa `getTranslations('seo')`. `hreflang` + `alternates.languages` JIT (2º locale).

22. **PWA offline messages:** pre-cache JIT (Sprint 14 ADR-0014). `@serwist/next` default cobre static JSON. ~30KB cabe folgado.

### Completude ESLint (gate da proposta i18n)

23. **Ativar `eslint-plugin-i18next` flat recommended** + 4 selectors `no-restricted-syntax` faltantes (metadata.title, react-email Text, push.body, error-map value) → 14/14 padrões blueprint 13 §2.2 cobertos.

### Respostas às 3 questões abertas i18n

24. **Zod messages:** factory pattern por callsite (Opção A) — `emailSchema(t)`. Sem `z.setErrorMap` global (hidden state).

25. **`<html lang>` em layout async Next 16:** validar com docs next-intl 4 na implementação. Fallback `'pt-BR'` hardcoded se docs forçar sync.

26. **`scripts/i18n-audit.sh`:** REMOVER (camada redundante quando ESLint cobre 14/14). Atualizar `docs/blueprint/13-lint-enforcement.md §4.2` removendo referência.

---

## 🟢 PROPOSTA i18n strategy — Research 21 (APROVADA — promovida acima nos itens 13-26)

Fonte: `docs/research/21-i18n-strategy.md` (sessão dedicada 2026-05-18 noite, NO CODE). 10 decisões consolidadas. Aprovação via chat com sumário 1-página antes de executar Fases A-D (~2h).

13. **Rota `[locale]` dia 0:** NÃO criar. Locale resolvido server-side fixo `pt-BR` em `i18n/request.ts`. Migrar pra `app/[locale]/` é refator de 2-4h JIT quando SEO multi-locale obrigatório OU 2+ locales com user-switch.

14. **Messages estrutura:** namespace por feature (`messages/<locale>/<namespace>.json`). Dia 0: só `messages/pt-BR/common.json` (actions/errors/validation). JIT por feature (`auth.json`, `billing.json`, `programs.json`, `push.json`, `email.json`).

15. **Multi-vertical terminologia:** chaves descritivas neutras (`programs.title`, NÃO `workouts.title`). Copy PT-BR fitness-shaped no valor (dia 0). Cross-vertical via tenant_copy_overrides JIT (decisão 16).

16. **Tenant copy override:** confirma item 5 acima — NÃO dia 0. Schema NÃO criar. Custo retrofit 2-4h. Gatilho: cliente 2 com vertical diferente.

17. **Multi-brand + locale default:** locale fixo `pt-BR` dia 0, independente da brand. Schema `public.brands.default_locale` ADIA — adicionar via migration single-column quando 2ª brand operacional com locale diferente.

18. **next-intl v4 setup canônico:** `i18n/request.ts` + `createNextIntlPlugin` em `next.config.ts` + `NextIntlClientProvider` em `app/layout.tsx` (envolvendo `RouteProvider`). Lazy-load namespace via `dynamic import` (Turbopack-compat).

19. **AppError factory i18n:** estender pra aceitar `string | { key, fallback, metadata? }`. Back-compat com callsites atuais. Server loga `fallback` EN (Sentry grouping); client traduz `key` via `t()`. Helper privado `normalize(msg)` retorna `{ message, i18nKey }`. Adiciona type `I18nMessage` em `lib/contracts/errors.ts`.

20. **Locale switcher UI:** JIT. Sem switcher dia 0. Gatilho: 2º locale ativo cross-brand. Componente `components/app-locale-switcher.tsx` (DropdownMenu + cookie `NEXT_LOCALE`).

21. **SEO/SSR multi-locale:** `<html lang={locale}>` dinâmico via `await getLocale()` no async DynamicShell. `generateMetadata` usa `getTranslations('seo')` (defer copy real pra primeira feature SEO). `hreflang` tags + `alternates.languages` JIT (2º locale).

22. **PWA offline messages:** pre-cache `messages/**/*.json` via Serwist quando PWA ativar (Sprint 14 Pacote B/C, ADR-0014 deferred). `@serwist/next` default cache strategy cobre static JSON automaticamente. ~30KB dia 0 cabe folgado.

**Completude ESLint i18n (gate da proposta):** ativar `eslint-plugin-i18next` flat recommended + 4 selectors `no-restricted-syntax` faltantes (metadata.title, react-email Text, push.body, error-map value) → 14/14 padrões blueprint 13 §2.2 cobertos.

**Memória executável (gate da proposta):** criar `.claude/rules/i18n.md` com 6 gatilhos JIT documentados (primeira string, novo namespace, AppError com i18n, locale switcher, segundo locale, tenant override).

**Questões abertas (§9 do Research 21):**

- Zod messages: factory `emailSchema(t)` por callsite vs `z.setErrorMap` global. Recomendação: factory pattern (Opção A).
- `<html lang>` em layout async com Next 16: confirmar com docs antes de implementar.
- Script `scripts/i18n-audit.sh` deletado: recriar ou remover camada redundante (ESLint 14/14 cobre).

**Custo total i18n (Fases A-D):** ~2h. **Bloqueante de:** primeira feature M1 (qualquer string PT-BR).

---

## 🔴 ITENS ABAIXO SÃO HISTÓRICO PRE-APROVAÇÃO

(Mantidos pra contexto histórico. Decisões aprovadas acima sobrescrevem.)

---

---

## 0. Contexto pra sessão nova

Você (Claude) está continuando trabalho do fundador (Leandro) sobre **fechamento do dia 0 do greenfield `platform/`** antes de começar feature 1 (M1 funil agência). O trabalho envolve:

1. **Pesquisa 17** (já integrada em ADR-0036 + ADR-0037) — guardrails IA + governança shadcn
2. **Pesquisa 18** (recém-chegada, ainda não virou ADR) — zona quarentenada shadcn, lint overrides, wrapper pattern com tenant theming, APCA build-time
3. **Decisão A do fundador** (2026-05-18): remover overrides ESLint §1+§7 do ADR-0031, deixar build vermelho, esperar Pesquisa 18 desenhar solução definitiva
4. **Pivot de abordagem (2026-05-18 — esta sessão):** fundador quer item-por-item decisão crítica antes de execução, sem exagero
5. **Pivot 2 (final desta sessão):** fundador parou de decidir item-por-item e pediu dump completo pra outra sessão continuar

**O fundador é solo + ocupado.** Linguagem MUITO simples. Sem jargão. Sem decisões precipitadas. Sem listas de 30 itens sem hierarquia.

---

## 1. Estado real do código (auditado, com arquivo:linha)

### 1.1 Multi-tenant theming — JÁ FUNCIONA, NÃO MEXER

- `app/globals.css:140-141` comentário literal: **"ZERO componente precisa ser editado individualmente"**
- Fluxo: `proxy.ts` → `getRouteByHost(host)` → headers `x-brand-*`/`x-tenant-*` → `app/layout.tsx:78` injeta `<link rel="stylesheet" href="/api/tenants/{id}/theme.css?v={n}">` → `app/api/tenants/[id]/theme.css/route.ts:67-100` gera CSS do banco → `@theme inline` mapeia pras vars shadcn (`--color-primary` → `--primary`)
- `<Button>` shadcn puro **automaticamente** vira cor do tenant. Sem prop, sem wrapper, sem nada.
- 13 paletas + 7 fontes + 3 shapes seedados no banco Supabase `iwratzqavdvpimsljjmq`
- 1 brand (desafit) + 2 tenants populados
- 3 plans (Pacote A, B, C) populados

**Implicação:** pesquisa 18 propõe `<AppButton tenantVariant="primary">` — **isso é redundante.** O `<Button>` puro já vira a cor do tenant via CSS var. Não adotar essa parte da pesquisa.

### 1.2 i18n — NÃO IMPLEMENTADO mas pacote instalado

- `next-intl@4.12.0` em `package.json:55` ✅ instalado
- `eslint-plugin-i18next@6.1.4` em `package.json:96` ✅ instalado MAS **não ativado** no eslint.config.mjs
- Não há `i18n.ts`, `i18n/request.ts`, `messages/pt-BR.json`, `NextIntlClientProvider` no layout
- `app/(client)/portal/page.tsx` comentário: "Sem strings hardcoded (next-intl ainda não configurado dia 0)"
- Regras ESLint que já bloqueiam hardcoded:
  - `react/jsx-no-literals` com allowlist técnica (símbolos, unidades, currency)
  - `no-restricted-syntax` × 8 (aria-label, placeholder, title, alt, toast, Error, fail, Zod .message)
- Script grep cross-file `scripts/i18n-audit.sh` existe e exclui `components/ui/**` + 10 vendor blocks
- Convenção (`.claude/rules/naming.md`): DB + code + folders EN 100% · URL pública PT-BR via rewrite · UI strings PT-BR via `t()`

### 1.3 APCA (contraste) — ESQUELETO EXISTE, NÃO É FULL

- `apca-w3@0.1.9` instalado
- `scripts/validate-palettes.ts` (96 linhas) com helpers INLINE: `oklchStrToSrgb`, `apca`, `foregroundForDarkSurface`
- Threshold atual: body Lc ≥75, filledBlock Lc ≥30 (Bronze + Silver ADR-0032)
- Testa 13 paletas × 2 cenários = **26 pares**
- **Pesquisa 18 propõe:** Silver dual-gate completo (75/60/45) × matrix tenant × role × {primary, danger, surface, chart-1..5} × {on-surface, on-primary} = **~104 pares**
- `lib/design/contrast.ts` previsto em blueprint 05 §5 com 4 helpers (`apca`, `meetsApca`, `ensureAccessible`, `pickReadableForeground`) — **NÃO EXISTE**
- Wire em `vercel.ts` ou `package.json prebuild` — **NÃO FEITO**
- `pnpm color:audit` mencionado no blueprint — **script não existe** no package.json

### 1.4 Wrapper pattern — DEFINIDO, ZERO IMPLEMENTAÇÃO

- `.claude/rules/components.md` define wrapper pattern obrigatório
- `components/app-*.tsx` no root — **nenhum arquivo existe ainda**
- Hook `component-research-gate.sh` exige marker `// RESEARCH: <fonte>` linha 1
- Hook bloqueia só **Write** em `components/**`, NÃO Edit (linha 24-26 do hook explica)
- ADR-0037 documenta hierarquia: shadcn blocks → primitives → @origin-ui → @kibo-ui → @reui → @tremor → @billingsdk → custom (Aceternity excluído)

### 1.5 ESLint config — 8 OVERRIDES LEGÍTIMOS + 2 REMOVIDOS

ADR-0031 documentava 10 overrides path-aware. Status atual (após Decision A 2026-05-18):

| §   | Path                                         | Status                                                  |
| --- | -------------------------------------------- | ------------------------------------------------------- |
| §1  | `components/ui/**` + 10 vendor blocks        | **REMOVIDO** Decision A pendente Pesquisa 18            |
| §2  | `scripts/**`                                 | Mantido (CLI one-shot)                                  |
| §3  | `eslint.config.mjs`                          | Mantido (arquivo lista vocab banido)                    |
| §4  | `lib/supabase/admin.ts`                      | Mantido (wrapper canônico admin)                        |
| §5  | `lib/route/getRouteByHost.ts`                | Mantido (lookup pré-RLS edge)                           |
| §6  | `.ladle/**`                                  | Mantido (até Storybook substituir Fase 3 Phase A Final) |
| §7  | `hooks/use-mobile.ts`                        | **REMOVIDO** Decision A (era dep block shadcn sidebar)  |
| §8  | `lib/contracts/database.ts`                  | Mantido (gerado supabase CLI)                           |
| §9  | `lib/design/seeds/**`                        | Mantido (long data files)                               |
| §10 | `lib/env.ts` + `lib/route/RouteProvider.tsx` | Mantido (boot-time pre-i18n)                            |

### 1.6 Custom plugins ESLint (4)

- `design-tokens/no-tailwind-bypass` — bloqueia text-{xs..9xl}, rounded-{sm..3xl}, uppercase, [#hex], [rgb()]
- `vocab/no-banned-vocab` — 13 termos banidos (student, trainer, intake, wizard, prospect, diagnostic, customization, workspace, reflexao, pilares, proximo_passo, aluno, diagnostico)
- `brand/no-brand-hardcode` — bloqueia 'desafit'/'yoga.app'/'ingles.app'
- `plan-gates/plan-gates-required` — features/<name>/index.ts deve re-exportar plan-gates

### 1.7 6 hooks PreToolUse (Claude Code)

- `block-token-bypass.sh` — hex/rgba literal block (renomeado de block-disables.sh)
- `protect-eslint.sh` — eslint.config.\* read-only
- `block-disable-content.sh` — eslint-disable + noInlineConfig + reportUnusedDisableDirectives literais
- `component-research-gate.sh` — Write em components/\* exige marker `// RESEARCH:` linha 1
- `load-context.sh` — SessionStart injeta contexto vocab + schema + brand
- `vocab-warn.sh` — UserPromptSubmit warn soft (não bloqueia)

**Faltam (mencionados em blueprints/pesquisas):**

- `post-shadcn-add.sh` — PostToolUse Bash matching `shadcn add` → injeta checklist
- `format-on-write.sh` — PostToolUse Write/Edit → `prettier --write`

### 1.8 9 .claude/rules/\*.md

abstractions, components, data-layer, domain-logic, features, jwt-claims, layers, naming, server-actions

**Faltam (identificados na matriz de ancoragem do outro terminal):**

- `i18n.md` — playbook next-intl JIT
- `design-tokens.md` — usos + anti-patterns
- `brand.md` — env vars + useBrand pattern
- `entitlements.md` — requireEntitlement + i18n msgs
- `contrast.md` — APCA Silver + matriz
- `shadcn-zone.md` — zona quarentenada + post-add checklist

### 1.9 Knip + Sheriff

**Estado Decision A:**

- `knip.config.ts`: removidos `components/ui/**` de entry + `version-switcher.tsx` de ignore + `@base-ui/react` de ignoreDependencies
- `sheriff.config.ts`: removida tag `components/ui/<component>` + rule `kind:primitive`
- `enableBarrelLess: true` documentado mas NÃO ativado no sheriff.config.ts (gap)

### 1.10 24 regras ESLint blueprint vs ~10 implementadas

Blueprint 13 promete 24 regras. Implementadas ~10. Gaps conhecidos:

- Regra 17: `MemberExpression` CSS var em JS (`style={{ color: 'var(--accent)' }}` deveria block)
- Regra 24: `'use client'` guard em server-only files (`lib/data/`, `app/**/actions.ts`, `lib/api/`)
- 12 padrões i18n da tabela §2.2 do blueprint 13

### 1.11 Outros gaps técnicos

- `size-limit` instalado SEM `.size-limit.ts` config — bundle budgets ADR-0020 não enforçados
- `vercel.ts` `buildCommand: 'pnpm build'` — sem APCA gate wire
- 12 typography primitives custom previstos (Heading, Text, Eyebrow, Metric, etc) — **nenhum existe**
- `<Logo>` componente previsto — **não existe**
- `lib/api/`, `lib/email/`, `lib/i18n/`, `lib/auth/`, `lib/hooks/`, `lib/utils/`, `components/motion/client.tsx` documentados mas inexistentes — JIT corretos
- `features/_template/` ✅ JÁ existe (não recriar)
- Migration seed banco aplicada ✅ confirmado via SQL: 13 palettes + 7 fonts + 3 shapes + 1 brand + 2 tenants + 3 plans
- Tarefa 14 Motion presets ✅ feito (commit anterior)
- Phase A Final Fases 1-2 ✅ feito; F3 Storybook substitui Ladle pendente; F4 Makerkit entitlements pendente; F5 cleanup pendente

---

## 2. Pesquisa 17 (já adotada, ADR-0036 + ADR-0037)

Arquivo: `docs/research/17-guardrails-ia-shadcn-governanca.md`

**Conclusões aplicadas:**

- Hooks PreToolUse JSON output (`permissionDecision: "deny"`) — bug `anthropics/claude-code#13744` contornado
- `@eslint-community/eslint-plugin-eslint-comments` ativo (`no-use`, `require-description`, `no-unused-disable`)
- shadcn MCP server registrado em `.mcp.json`
- Wrapper pattern `components/app-*` (documentado, sem implementação)
- Hierarquia registries granular (ADR-0037)

**Conclusões NÃO aplicadas (Pesquisa 17 disse pra fazer mas adiamos):**

- Storybook 10 substituir Ladle — Phase A Final F3 pendente
- Makerkit subscription-entitlements recipe — Phase A Final F4 pendente (vs impl atual ADR-0034)
- Não construir 5 componentes UX (EntitlementBadge, etc) — ✅ revert cirúrgico `4be49e3` removeu

---

## 3. Pesquisa 18 (recém-chegada, NÃO virou ADR ainda)

Arquivo: `docs/research/18-shadcn-zone-quarantine.md` (372 linhas, 8 decisões)

### 3.1 Q1 — Path-aware ESLint overrides `components/ui/**`

**OFF (lista narrowest):**

- `i18next/no-literal-string`
- `react/jsx-no-literals`
- `jsx-a11y/no-autofocus`
- `react/display-name`
- `@typescript-eslint/no-explicit-any`
- `@typescript-eslint/no-empty-object-type`
- `react/no-unknown-property`
- `no-restricted-syntax`
- `react/forbid-component-props`
- `tailwindcss/no-custom-classname`

**MANTER ON (pegam BUG, não estilo):**

- `@typescript-eslint/no-unused-vars` (com argsIgnorePattern: `^_`)
- `@typescript-eslint/no-floating-promises`
- `react-hooks/rules-of-hooks`
- `react-hooks/exhaustive-deps`
- `import/no-cycle`
- `no-undef`
- `@typescript-eslint/consistent-type-imports`

**Hard floor:** zero `eslint-disable` em `app/**`, `features/**`, `components/app-*/**`

### 3.2 Q2 — `no-restricted-imports` bloqueando `@/components/ui/*`

Usa **`@typescript-eslint/no-restricted-imports`** (não base ESLint), porque suporta `allowTypeImports: true` — permite `type { ButtonProps }` mesmo bloqueado.

**Bloqueia:** todo TS/TSX
**Exceções (2 objetos `files`-scoped no flat config):**

1. `components/app-*/**/*.{ts,tsx}` + `components/app-*/**/index.ts` (wrappers podem importar)
2. `**/*.{test,spec}.{ts,tsx}` + `**/*.stories.{ts,tsx}` + `**/__tests__/**` + `**/__stories__/**` (testes/stories renderizam primitive)

### 3.3 Q3 — Hook MCP-only em `components/ui/`

**Descoberta crítica:** shadcn MCP NÃO escreve arquivos. Retorna comando string `npx shadcn add @x/y` que Claude executa via Bash. Bash + CLI escreve no disco — não passa por Write/Edit.

**Conclusão:** hook em Write|Edit bloqueando `components/ui/*` é suficiente. Bash com `shadcn add` é canal legítimo.

Script proposto: `.claude/hooks/guard-ui-zone.sh` (similar ao existente `component-research-gate.sh` mas bloqueia 100%, não exige marker).

### 3.4 Q4 — Wrapper pattern com tenant theming

**REJEITAR essa parte da pesquisa.** Vocês já resolveram via CSS vars do banco (item 1.1 deste dump). `tenantVariant` prop é redundante.

**Aproveitar:** i18n via `i18nKey` prop no wrapper que chama `t()` internamente. Pesquisa propõe API:

```tsx
<AppButton i18nKey="checkout.confirm" i18nValues={{ price: 100 }} />
```

Wrapper internamente faz `t(i18nKey, i18nValues)`.

**Composição:**

```tsx
<AppPaywallModal i18nNamespace="billing.paywall.proPlan" onUpgrade={...} />
```

Wrapper recebe namespace, chama `useTranslations(namespace)`, renderiza Dialog do shadcn.

### 3.5 Q5 — Blocks JIT pipeline pós-add

3 layers em sinergia:

- (a) `mcp__shadcn__get_audit_checklist` (já existe no MCP — chama via prompt)
- (b) Hook `post-shadcn-add.sh` PostToolUse Bash → injeta checklist via stderr
- (c) `pnpm validate:apca` é gate final que falha build

**NÃO criar Skill custom** — duplica capability do `get_audit_checklist`.

Checklist obrigatório pós-add:

1. Chamar `mcp__shadcn__get_audit_checklist` e seguir todos passos
2. Grep strings literais → mover pra `messages/pt-BR.json`
3. Grep `oklch(|#hex|rgb(` → trocar por `var(--tenant-*)`
4. Deletar variants cva não usados pelo wrapper
5. Criar wrapper em `components/app-*/`
6. `pnpm validate:apca && pnpm lint --max-warnings 0`

### 3.6 Q6 — Charts Recharts tokenização

`--chart-1..5` em `@theme inline` referenciando vars tenant-scoped. **JÁ EXISTE** em `globals.css:71-75` e `@theme inline` linhas 112-116. Não tocar.

i18n entra via `ChartConfig.label` (objeto JS, não JSX) populado por `t()`.

### 3.7 Q7 — APCA gate build-time

**Build-time, NÃO runtime.** Runtime falha silenciosa em prod.

Script `pnpm validate:apca` em `vercel-build` antes do `next build`. Falha = deploy falha.

Lib: `apca-w3` (instalado). Pesquisa sugere adicionar `colorparsley` — **mas não é necessário**, `culori` já cobre.

Thresholds APCA Silver:

- Body: Lc ≥75
- Large: Lc ≥60
- Non-text (borders, icons): Lc ≥45
- WCAG fallback: 4.5/3.0

Matrix: cada par `tenant × { primary, danger, surface, chart-1..5 } × { on-surface, on-primary }` = ~104 pares por tenant.

### 3.8 Q8 — Storybook stories co-localizadas

`components/ui/button/button.stories.tsx` (não `components/ui/button.tsx` flat + stories separadas).

**Problema:** shadcn CLI escreve flat (`components/ui/button.tsx`). Sub-pasta quebra `npx shadcn add`.

**Solução não definida.** Decidir entre: (a) override do shadcn pra escrever em sub-pasta, (b) aceitar stories soltas no mesmo nível, (c) deferir até F3 Storybook decidir.

ESLint override `**/*.stories.*` desliga `no-restricted-imports` e `i18next` (stories tem strings de demo).

---

## 4. Defaults conservadores propostos pelo outro terminal (decisões 25-29)

**Fundador NÃO confirmou.** Vão entrar nos docs como "Decisão preliminar — confirma na revisão".

- **25. Primeiras features:** M1 funil agência → login, signup, capture-form, assessment-display, admin-leads
- **26+27. Strings por vertical/role:** flat `messages/pt-BR.json` único + chaves descritivas (ex: `programs.title`, `programs.title.empty`). Migra pra namespace JIT se feature pedir
- **28. Tenant copy override:** NÃO dia 0. M3+. Schema preparado mas inativo
- **29. PWA offline messages:** sim precache `messages/pt-BR.json` (~30KB cabe no budget)

---

## 5. Plano original (8-9 etapas) — versão antes do pivot

Ordem: docs primeiro, depois execução.

| Etapa                  | Itens                                                                                                                                                                           | Tempo estimado |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 1 — Docs               | ADR-0040 + 6 .claude/rules/\*.md + atualizar 3 blueprints + atualizar CLAUDE.md + mensagens dos hooks                                                                           | ~2h            |
| 2 — Travas ESLint      | Voltar §1 (lista narrowest) + voltar §7 + `@typescript-eslint/no-restricted-imports` + override stories/tests + ativar `eslint-plugin-i18next`                                  | ~45min         |
| 3 — Knip/Sheriff/Hooks | Voltar entries shadcn + reativar `kind:primitive` + ativar `enableBarrelLess` + reforçar `component-research-gate.sh` + criar `post-shadcn-add.sh` + criar `format-on-write.sh` | ~30min         |
| 4 — i18n setup         | `i18n.ts` + `i18n/request.ts` + `messages/pt-BR.json` + `NextIntlClientProvider` + estender `AppError` factory pra aceitar `{ key, fallback }`                                  | ~45min         |
| 5 — APCA               | Refatorar helpers inline pra `lib/design/contrast.ts` + estender pra matrix completa + adotar Silver (75/60/45) + criar `validate:apca` + wire em `vercel.ts`                   | ~1h            |
| 6 — Bundle budgets     | Criar `.size-limit.ts` com budgets do ADR-0020                                                                                                                                  | ~30min         |
| 7 — Validação          | `pnpm typecheck` + `pnpm lint` (~100-150 erros esperados nos primitives) + `pnpm validate:palettes` + `pnpm validate:apca` + smoke `curl /api/tenants/{id}/theme.css`           | ~20min         |
| 8 — Teste memória      | Sessão simulada nova lê CLAUDE.md → .claude/rules/\* → ADR-0040 e tenta executar 5 cenários JIT                                                                                 | ~20min         |
| 9 — Commit             | Local main sem push (lint vermelho proposital, doc explicando)                                                                                                                  | ~5min          |

**Total:** ~6h

---

## 6. Decisões item-por-item — onde paramos

### Item 1 — Wrappers de primitive ✅ DECIDIDO (B)

**B = 5 wrappers críticos:**

1. `AppButton` (variants, loading, i18nKey opcional)
2. `AppInput` (error display integrado react-hook-form)
3. `AppForm` (wrapper shadcn Form + submit handler tipado + i18n Zod validation)
4. `AppDialog` (modal padrão com close confirmation opcional)
5. `AppToast` (sonner com tokens semantic já wired)

**Razão:** `no-restricted-imports` precisa de alternativa pro dev usar (senão lint trava feature 1). 5 wrappers cobrem login + dashboard + feedback. Custo ~2-3h. Outros 42 ficam JIT.

### Item 2 — Typography primitives + Logo ⏸️ NÃO DECIDIDO

**3 opções na mesa:**

- A — Zero agora (0h, risco: lint design-tokens trava primeira feature com qualquer título)
- B — 5 essenciais (Heading, Text, Stack, Container, EmptyState) ~3-4h
- C — Todos 12 + Logo ~12-15h

**Recomendação:** B. Mas fundador parou de decidir item-por-item.

### Itens 3-5 — NÃO chegamos a discutir

- **3. Locales adicionais (pt-PT, en-US, es-ES):** clara recomendação "não dia 0" (bootstrap-checklist explícito)
- **4. Tenant copy override:** clara recomendação "M3+" (princípio §39)
- **5. Abstrair shadcn pra trocar futuramente:** clara recomendação "não fazer" (pesquisa 17 alerta "doubles the design system")

---

## 7. Conflitos identificados que precisam decisão

| #   | Conflito                                                                                                                                  | Decisão preliminar                                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 1   | APCA Bronze (75/30 atual) vs Silver (75/60/45 pesquisa 18 + blueprint 05 §5)                                                              | Silver — alinha blueprint                             |
| 2   | `lib/design/contrast.ts` criar do zero OU refatorar helpers inline do `validate-palettes.ts`                                              | Refatorar (não duplicar)                              |
| 3   | `scripts/validate-apca.ts` novo OU estender `validate-palettes.ts`                                                                        | Estender                                              |
| 4   | Wire APCA: `vercel.ts buildCommand` OU `package.json prebuild`                                                                            | prebuild (funciona local + Vercel + CI sem duplicar)  |
| 5   | `AppError.factory(message: string)` aceita só string. Como i18n?                                                                          | Estender pra aceitar `{ key, fallback }`              |
| 6   | Storybook stories: `components/ui/button/button.stories.tsx` (sub-pasta quebra `shadcn add`) OU `components/ui/button.stories.tsx` (flat) | Deferir até Phase A Final F3                          |
| 7   | `colorparsley` instalar (pesquisa 18 sugere)?                                                                                             | Não — culori cobre                                    |
| 8   | 14 regras ESLint pendentes do blueprint 13 entram junto OU ADR separada?                                                                  | Junto (escopo é "fechamento dia 0")                   |
| 9   | ADR-0040 consolida tudo OU 3-4 ADRs separadas (travas, i18n, APCA, wrapper)?                                                              | Consolida (uma fonte)                                 |
| 10  | `.claude/rules/*.md` granular (6 novos) OU monolítico (1 único)                                                                           | Granular — frontmatter `paths:` carrega só relevantes |

---

## 8. Mudanças concretas previstas (consolidado dos 2 audits)

### 8.1 Arquivos a criar

```
docs/adr/0040-fechamento-dia-0-shadcn-zone-quarantine.md
.claude/rules/i18n.md
.claude/rules/contrast.md
.claude/rules/shadcn-zone.md
.claude/rules/design-tokens.md
.claude/rules/brand.md
.claude/rules/entitlements.md
.claude/hooks/post-shadcn-add.sh
.claude/hooks/format-on-write.sh
lib/design/contrast.ts
i18n.ts (ou i18n/request.ts — confirmar com next-intl v4 App Router docs)
messages/pt-BR.json
.size-limit.ts
components/app-button.tsx (com __tests__ se padrão pedir)
components/app-input.tsx
components/app-form.tsx
components/app-dialog.tsx
components/app-toast.tsx
```

### 8.2 Arquivos a atualizar

```
docs/adr/0031-lint-overrides-intentional.md          (status: voltar §1 reescrita + §7)
docs/adr/0037-wrapper-pattern-hierarchy-registries.md (refletir 5 wrappers + zona quarentenada)
docs/blueprint/05-design-system.md                   (Silver dual-gate confirmado)
docs/blueprint/13-lint-enforcement.md                (regras 17, 24 + 12 i18n marcar implementadas)
docs/blueprint/15-bootstrap-checklist.md             (Tarefa 15 → ADR-0040)
CLAUDE.md                                            (ponteiros pros 6 novos rules)
CHANGELOG.md                                         (entry Added + Changed)
eslint.config.mjs                                    (voltar §1 narrowest + §7 + no-restricted-imports + storybook override + i18next plugin + 12 i18n rules + regra 17 + regra 24)
knip.config.ts                                       (voltar 3 entries shadcn)
sheriff.config.ts                                    (voltar tag kind:primitive + ativar enableBarrelLess)
package.json                                         (add scripts validate:apca + prebuild)
.claude/hooks/component-research-gate.sh             (reforçar pra bloquear Edit 100%, não só Write)
.claude/hooks/load-context.sh                        (apontar pros novos rules)
.claude/hooks/*.sh                                   (mensagens deny apontam pros .claude/rules/*.md específicos)
app/layout.tsx                                       (wrap em NextIntlClientProvider)
lib/contracts/errors.ts                              (AppError factory aceita { key, fallback })
scripts/validate-palettes.ts                         (extrair helpers pra lib/design/contrast.ts + estender pra Silver matrix)
```

### 8.3 NÃO fazer agora (JIT documentado)

- 12 typography primitives (`Heading`, `Text`, etc) — JIT com primeira feature renderizando texto
- `<Logo>` — JIT com landing agência (depende design final marca)
- 42 wrappers `components/app-*` não-críticos — JIT por feature consumer
- `lib/api/`, `lib/email/`, `lib/i18n/`, `lib/auth/`, `lib/hooks/`, `lib/utils/`, `components/motion/client.tsx`
- `tenant_copy_overrides` schema — M3+
- Locales adicionais — só pt-BR dia 0
- `colorparsley` — culori cobre
- Storybook 10 setup — Phase A Final F3
- Makerkit entitlements recipe — Phase A Final F4
- `context7` MCP install — WebFetch cobre

---

## 9. Tasks list ao final desta sessão

```
#1. [completed] Audit estado atual: primitives + overrides shadcn no platform/
#3. [completed] Remover overrides/allowlists do eslint.config.mjs (Decision A)
#4. [completed] Limpar ignore patterns: knip, sheriff, demais configs (Decision A)
#5. [completed] Patch ADR-0031 + ADR-0037 + CHANGELOG refletindo Decision A
#8. [completed] Audit real: como tenant theming + i18n + wrapper existem hoje
#9. [completed] Audit completo pré-Etapa 1 (29 itens)
```

Tasks deletadas: #2 (deletar primitives — fundador mudou de ideia), #6 (validar lint vermelho — fundador cancelou), #7 (commit local — não chegou)

---

## 10. Contexto crítico que sessão nova deve saber

### Sobre o fundador (Leandro)

- Solo founder, ocupado
- Quer **linguagem simples**, sem jargão
- Detesta listas de 30 itens sem hierarquia
- Decide item-por-item OU pede dump (não decide em bloco)
- Já viveu refatorações de ~150-170h no onboarding-bio por decisões esquecidas — quer **memória externa em doc**, não memória no Claude
- "Nunca pular itens do plano" — entrega 100% antes de marcar fase como completa
- "Investigar além do playbook" — playbook é guia, não checklist mecânico
- "Skip visual checkpoints refatoração" — checkpoint único no fim

### Sobre o estado do plano

- Phase A Final F3+F4+F5 pendentes (Storybook, Makerkit, cleanup)
- Tarefa 14 Motion presets ✅ feita
- Tarefa 25.5 vertical slice ✅ feita
- Feature 1 (M1 funil agência) NÃO começou
- Build hoje **VERMELHO** intencionalmente (Decision A) — ~200 erros lint esperados nos 47 primitives até zona quarentenada ser desenhada

### Sobre o que NÃO confundir

- **NÃO** propor `tenantVariant` prop nos wrappers — vocês já resolveram via CSS vars do banco
- **NÃO** propor reorganizar primitives em sub-pastas — quebra `npx shadcn add` que é flat
- **NÃO** propor deletar `version-switcher.tsx` ou `use-mobile.ts` — entram na zona quarentenada
- **NÃO** criar wrapper que só re-exporta primitive — `.claude/rules/abstractions.md` proíbe
- **NÃO** instalar `colorparsley` — culori cobre
- **NÃO** criar Skill custom shadcn — MCP já tem `get_audit_checklist`

### Sobre como continuar

1. Ler este dump
2. Ler `docs/research/18-shadcn-zone-quarantine.md` (8 decisões da Pesquisa 18 na íntegra)
3. Ler `docs/research/17-guardrails-ia-shadcn-governanca.md` (contexto histórico)
4. Ler `docs/blueprint/05-design-system.md` §5 (APCA Silver decisão)
5. Ler `docs/blueprint/13-lint-enforcement.md` (24 regras, ~10 implementadas)
6. Ler `docs/blueprint/15-bootstrap-checklist.md` (Tarefa 15 APCA pendente)
7. Ler `app/globals.css` (theming via CSS vars já funcional)
8. Confirmar com fundador as decisões pendentes (10 conflitos da seção 7 + decisões 25-29 da seção 4 + itens 2-5 da seção 6)
9. Executar plano da seção 5 quando aprovado

### Memórias relevantes

- `feedback_never_skip_plan_items`
- `feedback_zero_eslint_disable`
- `feedback_vocab_check_before_response`
- `feedback_no_legacy_vocabulary`
- `project_desafit_research_b_2026_05_17` (Sonnet 4.6/Haiku 4.5, JSON Outputs GA, guardrails)
- `project_desafit_research_c_2026_05_17` (lib/contracts SSOT, Result, ESLint thresholds, CSS via API route)
- `project_desafit_i18n_hardcoded_2026_05_17` (D-G66 14 padrões i18n)
- `project_desafit_implementation_order_2026_05_17` (D-G67..D-G76 doc lifecycle + 13 paletas)
- `project_platform_phase_a_done` (commit 95a092d bootstrap)

---

## 11. Próximas perguntas pro fundador

Se continuar item-por-item:

1. **Item 2:** Typography primitives + Logo — A/B/C?
2. **Item 3:** Locales adicionais (pt-PT, en-US, es-ES) dia 0?
3. **Item 4:** Tenant copy override dia 0?
4. **Item 5:** Abstrair shadcn pra trocar futuramente?

Se aprovar plano em bloco:

- Confirmar 10 conflitos da seção 7 (defaults sugeridos OK?)
- Confirmar defaults 25-29 (seção 4)
- Aprovar arquitetura `.claude/rules/*.md` granular (6 novos)
- Aprovar ADR-0040 consolida tudo

---

## 12. Status final desta sessão (2026-05-18)

- **Decision A aplicada** parcialmente: §1 + §7 ESLint removidos, knip/sheriff limpos, ADR-0031 + ADR-0037 + CHANGELOG patcheados
- **Pesquisa 18 chegou** e foi lida: `docs/research/18-shadcn-zone-quarantine.md`
- **Audit completo** dos 29 itens feito (esta sessão) + complementar do outro terminal
- **Item 1 decidido:** B — 5 wrappers críticos
- **Plano de 9 etapas montado** (~6h) mas NÃO aprovado
- **Item 2 não decidido** — fundador pediu este dump pra continuar
- **Nada foi commitado nesta sessão** (mudanças nos arquivos podem estar working tree dirty)
- **Build atual: VERMELHO intencional** (decisão A) — não fazer push

---

**FIM DO DUMP. Sessão nova continua daqui.**
