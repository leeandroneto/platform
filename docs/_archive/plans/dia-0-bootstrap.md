# Plano Mestre — Fechamento Dia 0 (ARQUIVADO)

> 📦 **STATUS: ARCHIVED** (2026-05-20)
> Renomeado de `PLANO-MESTRE-DIA-0.md` → `_archive/plans/dia-0-bootstrap.md`.
> Dia 0 fechou em 2026-05-18 (ADR-0040 cravou fechamento).
> Conteúdo decisional foi promovido pra ADRs (0024, 0033, 0038, 0039, 0040, 0042).
> Mantido como histórico — não usar pra decisões novas.
>
> **Histórico:** Status anterior — `approved · 2026-05-18 noite-6 (correção PWA per-tenant)`
> Plano executável de 18 etapas pra fechar dia 0 do `platform/` antes de feature 1.
> Substitui: `PHASE-A-FINAL.md` (F1+F2 done, F3-F5 absorvidas abaixo), `SESSION-DUMP-2026-05-18-shadcn-zone-quarantine.md` (working notes — fica como referência histórica), `PLANO-FECHAMENTO-DIA-0.md` (versão anterior).

---

## 0. Objetivo

**Este plano fecha 4/11 gates pendentes M0** (lint, audit i18n/vocab/token, size budgets, APCA build-time) + Logo wordmark dia 0 (constituição 00-PROJETO §9) + travas zona quarentenada shadcn + memória executável JIT em 6 rules.

**Restante do pipeline UI dia 0 já feito** em commits anteriores (`95a092d` bootstrap, ADRs 0001-0039, 18 blueprints, Migration 0001-0008, seed 13 paletas, features/\_template/, Motion presets, vertical slice). Pipeline UI completo (\_CONFLITOS.md #16 estima ~70h) — este plano são as ~22h finais.

**Itens deferidos JIT (não dia 0)** — registrados em `.claude/rules/*.md` com gatilho explícito (regra Pesquisa 20): 9 typography restantes, 4 entitlement components (Badge, PaywallModal, QuotaBanner, UpgradeCTA), 42+ wrappers shadcn, locales adicionais, tenant copy override, app/[locale]/, Dexie (Sprint 5+).

**Lição do onboarding-bio:** ~150-170h queimadas em refatorações por decisões esquecidas + ~830 `eslint-disable` silenciando 1 regra única. Memória externa em doc + travas determinísticas = evita repetir.

---

## 1. Decisões finais (26 itens — martelo batido)

Fonte autoritativa: `SESSION-DUMP-2026-05-18-shadcn-zone-quarantine.md` seção "🟢 DECISÕES APROVADAS FINAIS". Lista consolidada:

**Wrappers + Typography (revisados pós Pesquisa 20):**

1. 3 wrappers compostos dia 0: AppForm, AppToast, AppEntitlementGate. Demais JIT.
2. 3 typography dia 0: Heading, Text, Muted. Demais JIT.

**i18n (Research 21):** 3. namespace `messages/<locale>/<namespace>.json` desde dia 0 13. Rota `[locale]` JIT (locale fixo `pt-BR` em `i18n/request.ts`) 14. Dia 0: só `messages/pt-BR/common.json` 15. Chaves neutras (`programs.title`, não `workouts.title`) + copy fitness no valor 17. Brand é ortogonal a locale (schema `brands.default_locale` adia) 18. Setup canônico next-intl 4: `i18n/request.ts` + plugin `next.config.ts` + Provider em `layout.tsx` dentro do `RouteProvider` 19. `AppError.factory` overload `string | { key, fallback, metadata? }` + tipo `I18nMessage` 24. Zod messages: factory por callsite (`emailSchema(t)`)

**JIT documentado (não dia 0):** 4. Locales adicionais 5. Tenant copy override 6. Abstrair shadcn 20. Locale switcher UI 22. PWA pre-cache messages (Sprint 14)

**Travas + APCA:** 7. APCA Silver dual-gate (75/60/45) 8. `no-restricted-imports` bloqueando `@/components/ui/*` → **REMOVIDO** 9. Hook `component-research-gate.sh` reforçado (bloqueia Edit em `components/ui/*`) 12. Wire APCA via `package.json prebuild` 23. `eslint-plugin-i18next` flat recommended + 4 selectors faltantes (14/14 padrões blueprint 13)

**Memória executável:** 10. 6 novos `.claude/rules/*.md` (i18n, contrast, shadcn-zone, design-tokens, brand, entitlements) — cada um com "Gatilho + Passo + Anti-pattern + **Condição de revisitar** + Referência" 11. ADR-0040 consolida tudo

**Misc:** 21. `<html lang={locale}>` dinâmico (valida implementação Next 16) 25. `<html lang>` async fallback `'pt-BR'` se docs forçar sync 26. Remover `scripts/i18n-audit.sh` (redundante quando ESLint 14/14) + atualizar blueprint 13 §4.2

---

## 2. Alinhamento com planos antigos (todos absorvidos aqui)

Tudo que estava espalhado em PHASE-A-FINAL.md, SESSION-DUMP.md, PLANO-FECHAMENTO-DIA-0.md está agora neste documento. Não existe outro plano ativo.

**Itens absorvidos:**

- Hooks JSON output + ESLint comments plugin (ADR-0036) — ✅ done
- shadcn MCP + wrapper pattern doc (ADR-0037) — ✅ done
- Storybook 10 substitui Ladle (ADR-0038) — Etapa 11
- Makerkit entitlements RPCs (ADR-0039) — Etapa 12
- Cleanup geral (husky v9 deprecation + `_status.md` stale + ressalvas backlog) — Etapa 13
- APCA validator (`lib/design/contrast.ts`) — Etapa 6
- Motion presets — ✅ done
- Vertical slice features/ + entitlements model — ✅ done
- CLAUDE.md + 15 `.claude/rules/*.md` — ✅ done (Etapa 1)
- 4 stubs faltantes (action.ts, roles.ts, tokens.ts, palettes.ts) — Etapa 3
- PWA manifest + Serwist SW skeleton — Etapa 9

**JIT explícito (não dia 0, playbook documentado em `.claude/rules/*.md`):**

- Lucide ~80 ícones — JIT por feature
- `<Logo>` componente único — JIT (depende design marca final)
- 9 typography primitives restantes (Code, Stack, Container, EmptyState, Metric, DataCell, Eyebrow, Section, Divider, VisuallyHidden) — JIT por feature
- 42+ wrappers shadcn não-críticos — JIT por consumer real
- 4 composições Card PWA aluno (`hero`, `media`, `metric`, `entity`) — JIT junto com primeira tela PWA aluno
- Locales adicionais (en-US, pt-PT, es-ES) — JIT quando cliente internacional
- Tenant copy override schema — JIT M3+ (cliente 2 vertical diferente)
- Rota `app/[locale]/` — JIT quando 2º locale OU SEO multi-locale obrigatório

**MCPs — estado atual + JIT triggers:**

Instalados (`.mcp.json` project-scope + plugins):

- `shadcn` ✓ (ADR-0037 — hierarquia de busca componentes)
- `supabase` ✓ (plugin HTTP — migrations, queries, advisors)
- `vercel` ✓ (plugin HTTP — deploy, logs, projects)
- `context7` ✓ (instalado 2026-05-18 — docs lookup atualizado pra Next/next-intl/Supabase/etc; **reverte decisão original "WebFetch cobre"** — context7 traz melhor latência e versão pinada vs WebFetch genérico)

JIT (instalar quando):

- `@playwright/mcp` (Microsoft oficial) — Sprint 3+ (primeiro smoke E2E). Claude dirige browser, screenshot, valida multi-tenant theming visualmente, testa PWA mobile viewport
- Storybook MCP — Phase A Final F3 (ADR-0038 — substitui Ladle). Lista components, gera stories
- Sentry MCP — Feature 1 em prod gerando erros. Match com `AppError.metadata.i18nKey` da estratégia i18n (ADR-0040 §G)
- Stripe MCP — Sprint Stripe (decidido "internacional dia 1"). Catálogo products, prices, webhooks

NÃO instalar (skip permanente):

- GitHub MCP — `gh` CLI cobre 100%
- Postgres direto — Supabase MCP cobre
- Sequential Thinking / Memory MCPs — built-in (`auto memory` + `TaskCreate`)
- Filesystem / Search MCPs — Read/Glob/Grep + WebSearch built-in cobrem
- Linear/Jira — solo founder, tasks em `docs/plans/` + memory
- i18n-specific MCP — não existe maduro; context7 + WebFetch cobrem docs `next-intl`

### Roadmap M0 gate

Este plano fecha **4 de 11 checks pendentes** de M0:

- ✅ typecheck
- ⚠️ `lint --max-warnings 0` → este plano fecha
- ✅ vocab/i18n/token audit (i18n setup destrava)
- ⚠️ size budgets → este plano Etapa 8
- ❌ Smoke E2E, Lighthouse, PWA install — fora deste plano (Feature 1)

---

## 3. 18 etapas em ordem

| #   | Etapa                                                                                                                                                                                                                                  | Tempo  | Status                                                                                                                                                                                                                                                                                                                                                                                                                             |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Docs (ADR-0040 + 6 rules + atualizações)                                                                                                                                                                                               | ~2h    | ✅ done                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 2   | ESLint travas (path overrides + i18next + 4 selectors + regras 17/24 + **`eslint-plugin-better-tailwindcss`**)                                                                                                                         | ~1h15  | ✅ done (2026-05-18: better-tailwindcss `recommended` customizado, não `recommended-error` — ADR-0040 §B.2; hook `protect-eslint.sh` evoluído pra ler marker ADR §B.3)                                                                                                                                                                                                                                                             |
| 3   | Audit Husky/CI/commitlint + criar 4 stubs (`lib/contracts/action.ts`, `lib/domain/roles.ts`, `lib/design/tokens.ts`, `lib/design/palettes.ts`)                                                                                         | ~1h    | ✅ done (2026-05-18: husky v9 legacy linha removida nos 3 hooks; CI fail-fast confirmado; commitlint ok; 4 stubs + 1 test companheiro `roles.test.ts` 7/7 passa; lint + typecheck verdes)                                                                                                                                                                                                                                          |
| 4   | Knip + Sheriff + Hooks (voltar entries + reforçar gate + criar post-shadcn-add + format-on-write)                                                                                                                                      | ~30min | ✅ done (2026-05-18: knip voltou entries shadcn ui/version-switcher/@base-ui; sheriff voltou kind:primitive + enableBarrelLess; component-research-gate.sh bloqueia Edit em components/ui/\*\*; 2 hooks novos post-shadcn-add + format-on-write registrados em settings.json PostToolUse; 6/6 smokes verdes; knip+typecheck+lint verdes)                                                                                           |
| 5   | i18n setup (next-intl + messages + AppError extend + html lang + `kinds.<vertical>.json` referência)                                                                                                                                   | ~2h    | ✅ done (2026-05-18: i18n/request.ts pt-BR fixo; messages/pt-BR/common.json; NextIntlClientProvider envelopa RouteProvider em layout.tsx async; `<html lang={locale}>` dinâmico; AppError factories aceitam I18nMessage overload com back-compat string; scripts/i18n-audit.sh removido; bug ESLint 9 plugin scope resolvido via `files:` filter no bloco jsx-a11y; typecheck+lint+vitest 15/15+knip verdes)                       |
| 6   | APCA (lib/design/contrast.ts + Silver matrix + prebuild)                                                                                                                                                                               | ~1h    | ✅ done (2026-05-18: lib/design/contrast.ts com 4 helpers + APCA_SILVER const; validate-palettes.ts reescrito com matrix 13 paletas × 2 modes × N roles = 258 cenários; gate dividido error vs warn — body=error (acessibilidade real), filled blocks=warn (gosto visual, ADR-0040 §H atualizado); package.json prebuild=validate:apca; CI atualizado; 0 errors / 106 warns informativos; typecheck+lint+vitest 15/15+knip verdes) |
| 7   | 3 wrappers compostos (AppForm, AppToast, AppEntitlementGate)                                                                                                                                                                           | ~2h    | ✅ done (2026-05-18: AppToast hook semantic i18n; AppForm RHF+Zod+FormProvider+AppError→toast i18n; AppEntitlementGate modal/inline com useEntitlement+Dialog+upgrade CTA; messages/pt-BR/common.json ganhou seção entitlements; elevation tokens ADR-0042 prontos pra wrappers consumirem; cast `as never` no zodResolver pela incompat Zod 4 + RHF 7; typecheck+lint+knip+apca+vitest 15/15 verdes)                              |
| 8   | 3 typography (Heading, Text, Muted)                                                                                                                                                                                                    | ~2h    | ✅ done (2026-05-18: Heading com cva levels 1-4 + asChild Slot.Root + as prop pra hierarquia semantica; Text variants body/body-sm/lead; Muted span text-muted-foreground + asChild; todos com data-slot + path override `components/ui/**` aplica ESLint vendor surface; knip entries adicionados; typecheck+lint+knip+apca+vitest 15/15 verdes)                                                                                  |
| 9   | **`<Logo>` wordmark Geist Sans (00-PROJETO §9 — constitucional)**                                                                                                                                                                      | ~2h    | ✅ done (2026-05-18: components/ui/logo.tsx com useBrand() runtime + cva sizes sm/md/lg + asChild Slot.Root + variant=wordmark dia 0 (icon/horizontal JIT); brand.name renderiza Geist Sans bold tracking-tight + text-foreground; ESLint brand/no-brand-hardcode protege literais; knip entry; typecheck+lint+knip+apca+vitest 15/15 verdes)                                                                                      |
| 10  | PWA white-label per-tenant (manifest + ícones + splash dinâmicos via Satori) + Serwist SW + **`MotionConfig reducedMotion="user"`** + **`<meta name="theme-color">` dinâmico** + **`safe-area-inset-*`** + **Skeleton shimmer custom** | ~4h    | ✅ done (2026-05-18: 10A manifest+ícones+SW Serwist Turbopack+offline page+apple-touch-icon+manifest id+oklchToHex hardening; 10B MotionProvider client+shimmer @theme Tailwind v4+3 splash sizes iOS dinâmicos via Satori; theme-color static dia 0 (per-tenant JIT quando admin branding); safe-area 100% coberto; build verde Serwist+Turbopack via @serwist/turbopack route handler `/serwist/sw.js`; ADR-0014 atualizado)     |
| 11  | `.size-limit.ts` bundle budgets                                                                                                                                                                                                        | ~30min | pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 12  | Storybook 10 substitui Ladle (stories co-localizadas)                                                                                                                                                                                  | ~3h    | pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 13  | Makerkit entitlements RPCs (refactor `lib/entitlements/server.ts`)                                                                                                                                                                     | ~3-4h  | pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 14  | Cleanup geral (atualizar CLAUDE.md + blueprints 02/05/11/14/15/16 + regenerar `_status.md` + husky v9 + ressalvas backlog + APCA Bronze→Silver naming + **arquivar resíduos `package.json.scripts.md` + `docs/proposta/`**)            | ~3h    | pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 15  | **Criar blueprints novos:** `19-wrapper-strategy.md` (consolida ADR-0040 §E + Pesquisa 19/20 + `.claude/rules/shadcn-zone.md`) + `20-i18n-strategy.md` (consolida ADR-0040 §G + Pesquisa 21 + `.claude/rules/i18n.md`)                 | ~1h30  | pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 16  | Validação completa (typecheck + lint + knip + validate:apca + test + size + smoke theme.css + smoke hooks)                                                                                                                             | ~45min | pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 17  | Teste de memória JIT (sessão simulada lê docs cego e executa 6 cenários)                                                                                                                                                               | ~30min | pending                                                                                                                                                                                                                                                                                                                                                                                                                            |
| 18  | Commit local main (sem push)                                                                                                                                                                                                           | ~15min | pending                                                                                                                                                                                                                                                                                                                                                                                                                            |

**Total:** ~26h30. **Sequenciamento crítico:** 1 → 2 → 3 → 5 → 7/8/9 → 10 (Etapa 10 depende de Etapa 9 `<Logo>` pro Satori fallback). Etapas 4, 6, 11 paralelizáveis após 3. Etapas 12, 13, 14, 15 paralelizáveis após 10.

---

## 4. Etapa 1 — Docs

### 4.1 ADR-0040

`docs/adr/0040-fechamento-dia-0-shadcn-zone-quarantine.md` (formato Michael Nygard).

Seções:

- **Context:** Pesquisas 17 + 18 + 19 + 20 + 21 fechadas. Decisão A removeu §1+§7 ADR-0031. Audit revelou theming via CSS vars já resolve cor/fonte/shape.
- **Decision §A:** Zona quarentenada `components/ui/**` — lista narrowest (Pesquisa 18 Q1)
- **Decision §B:** `no-restricted-imports` bloqueando `@/components/ui/*` REMOVIDO (Pesquisa 20)
- **Decision §C:** Hook `component-research-gate.sh` reforçado pra bloquear Edit em `components/ui/*`
- **Decision §D:** Hook `post-shadcn-add.sh` novo (PostToolUse Bash matching `shadcn add`)
- **Decision §E:** 3 wrappers compostos OBRIGATÓRIOS + demais JIT (regra de 3 + valor agregado)
- **Decision §F:** 3 typography dia 0 (Heading, Text, Muted) — demais JIT
- **Decision §G:** i18n namespace por feature, locale fixo pt-BR, rota `[locale]` JIT, `AppError` factory overload, Zod factory por callsite
- **Decision §H:** APCA Silver dual-gate (75/60/45)
- **Decision §I:** Wire APCA via `prebuild`
- **Decision §J:** 6 novos `.claude/rules/*.md` com "Condição de revisitar" obrigatória
- **Decision §K:** Remover `scripts/i18n-audit.sh` (ESLint 14/14 cobre)
- **Consequences:** Build verde dia 0, memória externa pra JIT, wrapper guard real, APCA falha deploy paleta quebrada

### 4.2 6 `.claude/rules/*.md` novos (granular)

Cada arquivo tem frontmatter `paths:` + checklist + anti-pattern + **"Condição de revisitar"** + referência cruzada.

Padrão da seção "Condição de revisitar" (Pesquisa 20):

```markdown
## Condição de revisitar

- [gatilho 1] → ação X
- [gatilho 2] → ação Y
```

**A. `.claude/rules/i18n.md`**

- paths: `app/**`, `components/**`, `features/**`, `lib/contracts/errors.ts`, `messages/**`
- Setup obrigatório, estrutura namespace, t() server/client, AppError pattern, Zod messages factory
- Condição de revisitar: cliente internacional confirmado → adicionar locale; cliente 2 vertical diferente → tenant copy override; SEO multi-locale → rota `[locale]`

**B. `.claude/rules/contrast.md`**

- paths: `lib/design/**`, `app/api/{tenants,brands}/[id]/theme.css/route.ts`, `scripts/validate-palettes.ts`, `app/(admin)/**`
- APCA Silver thresholds, helpers `lib/design/contrast.ts`, validação build-time + runtime, matrix
- Condição de revisitar: 14ª paleta adicionada → re-rodar validate-apca; tenant salva theme custom → server action chama ensureAccessible

**C. `.claude/rules/shadcn-zone.md`**

- paths: `components/ui/**`, `components/app-*.tsx`, `features/**/components/**`
- Zona quarentenada (Edit bloqueado), canal único Bash, checklist pós-add, wrapper pattern com valor agregado
- 3 wrappers obrigatórios dia 0 + demais JIT por consumer real
- Condição de revisitar: 3+ usos do mesmo className → criar wrapper; primeiro modal real → AppDialog; loading state aparece → AppButton

**D. `.claude/rules/design-tokens.md`**

- paths: `app/**`, `components/**`, `features/**`
- Tabela de tokens (replica blueprint 05 §3), CSS vars do banco, anti-patterns ESLint bloqueia
- Condição de revisitar: novo token semantic precisar (ex: --color-paywall) → adicionar em globals.css @theme

**E. `.claude/rules/brand.md`**

- paths: `app/**`, `components/**`, `features/**`, `lib/route/**`
- env vars + useBrand pattern, multi-vertical keys descritivas
- Condição de revisitar: 2ª brand operacional → schema `brands.default_locale`

**F. `.claude/rules/entitlements.md`**

- paths: `features/**`, `app/(admin)/**`, `lib/entitlements/**`
- requireEntitlement server, useEntitlement client, AppError msg i18n, plan-gates obrigatório
- Condição de revisitar: Makerkit RPCs (F4 Phase A Final) → refactor lib/entitlements/server.ts

### 4.3 Atualizar arquivos existentes

| Arquivo                                                 | Mudança                                                                                           |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `CLAUDE.md`                                             | Adicionar 6 novos rules em "Onde fica cada coisa"                                                 |
| `docs/adr/0031-lint-overrides-intentional.md`           | Status: ADR-0040 §A supersede §1+§7                                                               |
| `docs/adr/0037-wrapper-pattern-hierarchy-registries.md` | §B refletindo 3 wrappers críticos + passthrough proibido                                          |
| `docs/blueprint/05-design-system.md`                    | §5 confirma Silver. Tarefa 15 ✅                                                                  |
| `docs/blueprint/13-lint-enforcement.md`                 | Marcar regras 17 + 24 + 12 i18n + 4 selectors novos. §4.2 remover referência ao script i18n-audit |
| `docs/blueprint/15-bootstrap-checklist.md`              | Tarefa 15 → ADR-0040                                                                              |
| `CHANGELOG.md`                                          | Entry [Unreleased] Added + Changed + Removed (scripts/i18n-audit.sh)                              |
| `.claude/hooks/load-context.sh`                         | Ponteiros pros 6 novos rules                                                                      |
| Hooks mensagens deny                                    | Apontam pros `.claude/rules/*.md` específicos                                                     |

---

## 5. Etapa 2 — ESLint travas

### 5.1 Voltar §1 ADR-0031 com lista narrowest (Pesquisa 18 Q1)

```js
{
  files: ['components/ui/**/*.{ts,tsx}'],
  rules: {
    // OFF
    'i18next/no-literal-string': 'off',
    'react/jsx-no-literals': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'react/no-unknown-property': 'off',
    'no-restricted-syntax': 'off',
    'design-tokens/no-tailwind-bypass': 'off',
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'complexity': 'off',
    'react-hooks/set-state-in-effect': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/anchor-has-content': 'off',

    // MANTER ON (bugs)
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'import/no-cycle': 'error',
    'no-undef': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
  },
}
```

### 5.2 Voltar §7 `hooks/use-mobile.ts`

Idêntico ao original.

### 5.3 NÃO criar `no-restricted-imports` bloqueando `@/components/ui/*`

(Decisão 8 revisada — Pesquisa 20 + Vercel Academy: força wrapper passthrough)

### 5.4 Ativar `eslint-plugin-i18next` flat recommended

```js
import i18next from 'eslint-plugin-i18next'
// ...
i18next.configs['flat/recommended'],
```

(`components/ui/**` override já desliga acima.)

### 5.5 4 selectors `no-restricted-syntax` faltantes (14/14 blueprint 13)

Adicionar:

- `metadata.title` literal
- React Email `<Text>` literal
- `push.body` literal
- Error map object Literal value

### 5.6 Implementar regras 17, 24 (blueprint 13 promised)

- Regra 17: `MemberExpression` CSS var em JS — plugin custom novo
- Regra 24: `'use client'` guard em server-only files — plugin custom novo

### 5.7 Instalar `eslint-plugin-better-tailwindcss` (blueprint 02 §5)

Blueprint 02 §5 explícito: "único plugin v4-native — substitui `eslint-plugin-tailwindcss` (legacy banido)". Cobre Tailwind v4 arbitrary-values (`text-[#fff]`, `rounded-[8px]`) que `design-tokens/no-tailwind-bypass` custom cobre só parcial.

```bash
pnpm add -D eslint-plugin-better-tailwindcss
```

```js
// eslint.config.mjs
import betterTailwind from 'eslint-plugin-better-tailwindcss'

betterTailwind.configs['flat/recommended-error'],
```

`components/ui/**` override desliga (já no path overrides) — vendor surface.

---

## 6. Etapa 4 — Knip + Sheriff + Hooks

### 6.1 Voltar knip entries shadcn

```ts
entry: [
  // ...
  'components/ui/**/*.tsx', // VOLTA
  // ...
],
ignore: [
  // ...
  'components/version-switcher.tsx', // VOLTA
  // ...
],
ignoreDependencies: [
  '@base-ui/react', // VOLTA
  // ...
],
```

### 6.2 Voltar sheriff `kind:primitive` + ativar `enableBarrelLess`

```ts
'components/ui/<component>': ['type:shared', 'kind:primitive'], // VOLTA
'kind:primitive': ['kind:contracts'], // VOLTA
enableBarrelLess: true, // NOVO
```

### 6.3 Reforçar `component-research-gate.sh`

Bloquear Edit (não só Write) em `components/ui/*`:

```bash
if echo "$NORMALIZED" | grep -qE '(^|/)components/ui/.+\.(ts|tsx)$' && [ "$TOOL_NAME" = "Edit" ]; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"components/ui/* é zona quarentenada — proibido Edit. Use 'npx shadcn add <slug>' via Bash. Customização vai em components/app-*. Detalhes: .claude/rules/shadcn-zone.md + ADR-0040."}}
EOF
  exit 0
fi
```

### 6.4 Criar `.claude/hooks/post-shadcn-add.sh`

PostToolUse Bash matching `shadcn add` → injeta checklist via stderr.

### 6.5 Criar `.claude/hooks/format-on-write.sh`

PostToolUse Write|Edit → `prettier --write` no arquivo modificado.

### 6.6 Atualizar `.claude/settings.json`

Adicionar matchers PostToolUse.

---

## 7. Etapa 5 — i18n setup (decisões 13-26)

### 7.1 `i18n/request.ts`

```ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'pt-BR' // hardcoded dia 0 (decisão 13)
  return {
    locale,
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
      // outros namespaces JIT via dynamic import por feature
    },
  }
})
```

### 7.2 `next.config.ts` — adicionar plugin

```ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
export default withNextIntl(nextConfig)
```

### 7.3 `messages/pt-BR/common.json`

```json
{
  "common": {
    "actions": {
      "save": "Salvar",
      "cancel": "Cancelar",
      "confirm": "Confirmar",
      "close": "Fechar"
    },
    "errors": {
      "generic": "Algo deu errado. Tente novamente.",
      "network": "Sem conexão.",
      "not_found": "Não encontrado.",
      "forbidden": "Acesso negado."
    },
    "validation": {
      "required": "Campo obrigatório",
      "invalid_email": "Email inválido"
    }
  }
}
```

### 7.4 Wire `NextIntlClientProvider` em `app/layout.tsx`

Envolve `RouteProvider`. Adiciona `<html lang={locale}>` dinâmico via `await getLocale()`.

### 7.5 Estender `lib/contracts/errors.ts`

```ts
export type I18nMessage =
  | string
  | { key: string; fallback: string; metadata?: Record<string, unknown> }

function normalize(msg: I18nMessage): { message: string; i18nKey?: string } {
  if (typeof msg === 'string') return { message: msg }
  return { message: msg.fallback, i18nKey: msg.key }
}

// Cada factory aceita I18nMessage e armazena i18nKey em metadata
export const AppError = {
  invalidInput(msg: I18nMessage, metadata?: Record<string, unknown>): AppError {
    const { message, i18nKey } = normalize(msg)
    return new AppErrorImpl('invalid_input', message, { metadata: { ...metadata, i18nKey } })
  },
  // idem pros outros 11 factories
}
```

### 7.6 Remover `scripts/i18n-audit.sh`

Atualizar `docs/blueprint/13-lint-enforcement.md §4.2` removendo referência. ESLint 14/14 cobre.

---

## 8. Etapa 6 — APCA

### 8.1 Criar `lib/design/contrast.ts`

Extrair helpers inline de `scripts/validate-palettes.ts`:

- `apca(fgOklch, bgOklch): number`
- `meetsApca(fg, bg, role: 'body' | 'large' | 'non-text'): boolean`
- `ensureAccessible(fg, bg, minLc): string` (bisection L)
- `pickReadableForeground(bg): string` (black|white por |Lc| máximo)

Silver thresholds: body 75, large 60, non-text 45.

### 8.2 Estender `scripts/validate-palettes.ts` pra Silver matrix

Iterar 13 paletas × roles × {primary, danger, surface, chart-1..5} × {on-surface, on-primary}. Imports do `lib/design/contrast.ts`.

### 8.3 Adicionar scripts em `package.json`

```json
{
  "scripts": {
    "validate:apca": "tsx scripts/validate-palettes.ts",
    "prebuild": "pnpm validate:apca"
  }
}
```

---

## 9. Etapa 7 — 3 wrappers compostos

### 9.1 `components/app-form.tsx`

```tsx
// RESEARCH: shadcn/ui form + react-hook-form + Zod + AppError i18n
'use client'
import { useForm, type DefaultValues, type FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { type ZodSchema } from 'zod'
import { useTranslations } from 'next-intl'
import { Form } from '@/components/ui/form'
// ... handler tipado + AppError → toast.error i18n
```

### 9.2 `components/app-toast.tsx`

```tsx
// RESEARCH: sonner + i18n semantic helpers
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

export function useAppToast() {
  const t = useTranslations()
  return {
    success: (i18nKey: string, values?: Record<string, string | number>) =>
      toast.success(t(i18nKey, values)),
    error: (i18nKey: string, values?: Record<string, string | number>) =>
      toast.error(t(i18nKey, values)),
    info: (i18nKey: string, values?: Record<string, string | number>) =>
      toast.info(t(i18nKey, values)),
    warning: (i18nKey: string, values?: Record<string, string | number>) =>
      toast.warning(t(i18nKey, values)),
  }
}
```

### 9.3 `components/app-entitlement-gate.tsx`

```tsx
// RESEARCH: lib/entitlements client + paywall modal + upgrade CTA + i18n
'use client'
import { useEntitlement } from '@/lib/entitlements/client'
// renderiza children se allowed, paywall modal + upgrade button se not
```

---

## 10. Etapa 8 — 3 typography

### 10.1 `components/ui/heading.tsx`

```tsx
// RESEARCH: custom typography primitive — shadcn não entrega (issue #1527). EightShapes pattern.
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const headingVariants = cva('font-sans tracking-tight', {
  variants: {
    level: {
      1: 'text-4xl font-bold',
      2: 'text-3xl font-semibold',
      3: 'text-2xl font-semibold',
      4: 'text-xl font-medium',
    },
  },
  defaultVariants: { level: 2 },
})

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4'
  asChild?: boolean
  className?: string
  children: React.ReactNode
}

export function Heading({ level = 2, as, asChild, className, children }: HeadingProps) {
  const Comp = asChild ? Slot : (as ?? (`h${level}` as React.ElementType))
  return <Comp className={cn(headingVariants({ level }), className)}>{children}</Comp>
}
```

### 10.2 `components/ui/text.tsx`

Variants: body (default), body-sm, lead.

### 10.3 `components/ui/muted.tsx`

`<span className="text-sm text-muted-foreground">{children}</span>` + asChild.

**Decisão arquitetural:** typography custom fica em `components/ui/` (são primitives próprios). Path overrides ESLint §1 aplicam.

---

## 11. Etapa 11 — `.size-limit.ts`

Budgets blueprint 13 §6:

```ts
import type { SizeLimitConfig } from 'size-limit'

export default [
  { name: 'Landing pública', path: '.next/static/chunks/app/page-*.js', limit: '150 KB' },
  { name: 'Login', path: '.next/static/chunks/app/login/**/*.js', limit: '120 KB' },
  {
    name: 'PWA shell',
    path: '.next/static/chunks/app/(client)/portal/layout-*.js',
    limit: '240 KB',
  },
  { name: 'Admin', path: '.next/static/chunks/app/(admin)/**/*.js', limit: '100 KB' },
] as SizeLimitConfig
```

---

## 12. Etapa 16 — Validação completa

```bash
pnpm typecheck                          # 0 erros esperado
pnpm lint --max-warnings 0              # VERDE (zona quarentenada desligou regras certas)
pnpm knip                               # VERDE (entries shadcn voltaram)
pnpm validate:apca                      # VERDE (13/13 paletas Silver)
pnpm test                               # vitest existentes
curl http://localhost:3000/api/tenants/<id>/theme.css | head  # smoke 200 + CSS válido
pnpm build                              # VERDE (prebuild roda validate:apca)
pnpm size                               # VERDE (budgets respeitados)
```

---

## 13. Etapa 17 — Teste de memória JIT

Sessão simulada lê apenas `CLAUDE.md` → `.claude/rules/*.md` → `ADR-0040`. Executa 6 cenários:

1. Primeira string PT-BR em JSX
2. Primeiro wrapper `components/app-card.tsx` (não previsto)
3. Primeira paleta nova adicionada
4. Primeiro `npx shadcn add @origin-ui/timeline`
5. Primeiro `AppError.invalidInput` com tradução
6. Cliente 2 pede "WOD" vs "Treino"

Se falhar → ajustar doc até passar.

---

## 14. Etapa 18 — Commit local sem push

```bash
git add <arquivos>
git commit -m "chore: dia 0 fechado — adr-0040 (zona quarentenada + i18n + APCA + 3 wrappers + 3 typography + 6 rules JIT)"
# SEM PUSH — remote protegido até Feature 1 destravar gates restantes M0
```

---

## 15. Playbooks JIT (memória executável — vive nos `.claude/rules/*.md`)

Cada playbook tem: Gatilho + Passo + Anti-pattern + **Condição de revisitar** + Referência.

### 15.1 Wrappers shadcn não-críticos (42+)

- **Gatilho:** feature precisa primitive que não tem wrapper E ganha comportamento extra (loading/error/i18n)
- **Passo:** `npx shadcn add` → checklist post-add → cria `components/app-<nome>.tsx` com marker → valor agregado obrigatório
- **Anti-pattern:** passthrough (Vercel Academy)
- **Condição de revisitar:** regra de 3 (3+ usos do mesmo className inline)
- **Ref:** `.claude/rules/shadcn-zone.md`

### 15.2 Typography restantes (Code, Stack, Container, EmptyState, Metric, DataCell, Eyebrow, Section, Divider, VisuallyHidden, Logo)

- **Gatilho:** uso real 3+ vezes OU feature explicitamente precisar (ex: dashboard → Metric)
- **Passo:** criar em `components/ui/<nome>.tsx` com marker, variants pequenas (cva max 5)
- **Anti-pattern:** criar cego sem feature consumer
- **Condição de revisitar:** próxima feature após criar

### 15.3 Locales adicionais

- **Gatilho:** cliente internacional confirmado pagante
- **Passo:** `messages/<locale>/<namespace>.json` espelho pt-BR + locale switcher + hreflang
- **Anti-pattern:** Google Translate inline
- **Condição de revisitar:** Stripe internacional ativa cliente real

### 15.4 Tenant copy override

- **Gatilho:** cliente 2 com vertical diferente pede explicitamente (ex: BoxClub "WOD" vs "Treino")
- **Passo:** migration `tenant_copy_overrides` + resolver merge em `i18n/request.ts`
- **Anti-pattern:** criar schema vazio dia 0
- **Condição de revisitar:** M3+ ou cliente pagante exige

### 15.5 Rota `[locale]`

- **Gatilho:** SEO multi-locale obrigatório OU 2+ locales com user-switch
- **Passo:** mover `app/*` pra `app/[locale]/*` + atualizar `getLocale()` resolver
- **Anti-pattern:** criar dia 0 com 1 locale só
- **Condição de revisitar:** decisão 13 do ADR-0040 — 2-4h refator

### 15.6 Plan-gates por feature

- **Gatilho:** nova feature em `features/<name>/`
- **Passo:** criar `plan-gates.ts` exportando `*Gate` + re-export em `index.ts`
- **Anti-pattern:** feature sem gate declarativo
- **Condição de revisitar:** sempre (ESLint enforce)

---

## 16. Detalhamento Etapas 3, 9, 10, 12, 13, 14

### Etapa 3 — Audit Husky/CI + 4 stubs (~1h)

**Audit:**

- `.husky/pre-commit` + `commit-msg` + `pre-push` (já existem 3 arquivos) — confirmar conteúdo + atualizar pra Husky v9 sem linhas legacy deprecated
- `.github/workflows/ci.yml` (já existe, 2827 bytes) — confirmar ordem fail-fast (typecheck → audit → lint → knip → test → build → size)
- `commitlint.config.ts` (existe) — confirmar config conventional

**Criar 4 stubs (mínimos, sem implementação completa — JIT depois):**

- `lib/contracts/action.ts` — Server Action return type discriminated union `{ ok, data } | { ok: false, error }` + helpers
- `lib/domain/roles.ts` — 5 roles canônicas tipadas (admin, professional, client, influencer, super-admin)
- `lib/design/tokens.ts` — `deriveTokens(palette, mode)` runtime helper (referência blueprint 05 §4) — stub mínimo, completar JIT quando admin precisar trocar paleta via UI
- `lib/design/palettes.ts` — re-export `OFFICIAL_PALETTES` de `seeds/palettes.seed.ts` como public API + helpers de lookup

### Etapa 9 — `<Logo>` wordmark Geist Sans (~2h, constitucional 00-PROJETO §9)

**Por que dia 0:** constituição 00-PROJETO §9 (append-only) explícita — "Logo: trocar = editar 1 SVG, propaga 100% via componente `<Logo>` único. ESLint bloqueia string literal `desafit`/`desafit.app` fora de allowlist". Decisão constitucional não muda sem ADR superseding.

**Long-term decision:** wordmark "desafit.app" em Geist Sans é a identidade visual pra prazo longo. SVG vetorial / icon custom só vira JIT se designer entregar algo novo no futuro (não previsto).

- `components/logo.tsx` — componente único com 3 variants × 3 temas × 3 sizes:
  - `variant="wordmark" | "icon" | "horizontal"` (wordmark dia 0; icon + horizontal stubs JIT)
  - `theme="light" | "dark" | "auto"` (auto via prefers-color-scheme + tenant theming)
  - `size="sm" | "md" | "lg"` (sm 24px, md 32px, lg 48px)
- Wordmark renderiza `env.NEXT_PUBLIC_BRAND_NAME` em Geist Sans bold com kerning -2%
- Brand name via `useBrand()` runtime (multi-marca) — fallback env apenas em RSC
- Apple Touch Icon 180×180 + PWA icons 192/512/maskable: **gerados dinâmicos per-tenant via Satori na Etapa 10** (não placeholder estático — cada profissional tem ícone próprio). `<Logo>` aqui cobre só wordmark visível em UI (header, splash conteúdo, OG).
- Open Graph 1200×630 placeholder via `next/og` `ImageResponse` (JIT detalhar quando landing real)
- ESLint rule `brand/no-brand-hardcode` (já ativa) bloqueia literal `desafit`/`yoga.app`/`ingles.app` fora de allowlist
- Lint allowlist permite literal só em: `lib/env.ts`, `messages/**/*.json`, `tests/fixtures/**`, ADRs, CHANGELOG

### Etapa 10 — PWA manifest + ícones dinâmicos por tenant + Serwist SW + MotionConfig + theme-color + safe-area + Skeleton shimmer + splash iOS (~4h)

**Por que dia 0:** roadmap M0 exige + blueprint 05 §11 lista 12 patterns visual premium Sprint 1 Foundation — 5 desses são UX foundation que afetam percepção premium imediato (Skeleton shimmer, theme-color, safe-area, MotionConfig, splash iOS). Outros 7 patterns JIT documentado.

**Multi-tenant white-label CORE:** PWA é por tenant — cada profissional tem manifest + ícones + theme próprios. Aluno do BoxClub instala "BoxClub", aluno do Acme instala "Acme". Mesmo padrão de `/api/{tenants,brands}/[id]/theme.css/route.ts` (já existente).

**Sub-itens:**

1. **`/api/{tenants,brands}/[id]/manifest.webmanifest/route.ts`** — JSON dinâmico por tenant/brand:
   - `name` + `short_name` = nome do tenant ou brand (não hardcoded)
   - `icons` apontando pros 4 endpoints abaixo (URLs absolutas com `?v={theme_version}` cache-bust)
   - `theme_color` + `background_color` via paleta do tenant (do banco)
   - `display: standalone`, `start_url: /portal`, `scope: /portal/`
   - `Content-Type: application/manifest+json`
   - `Cache-Control: public, max-age=86400, immutable` + `?v=N` versionado
   - Fallback brand-root: usa nome+cor do brand parent (desafit)

2. **`/api/{tenants,brands}/[id]/icon-{192,512,maskable,apple-touch}.png/route.ts`** — 4 endpoints PNG dinâmico:
   - Lê `tenant.logo_url` do banco (storage bucket `tenant-logos` já seedado)
   - Se tenant tem logo SVG/PNG configurado: redimensiona via `sharp` (ou cache em Supabase Storage)
   - Se NÃO tem logo: gera via `@vercel/og` (Satori) renderizando nome do tenant em Geist Sans com fundo `--color-primary` do tenant — **placeholder dinâmico automático**
   - Maskable: aplica safe zone 80% (padding 10% nas 4 bordas)
   - Apple Touch: sem rounding (iOS aplica máscara nativa)
   - Cache-Control: `public, max-age=86400, immutable`

3. **Storage bucket `tenant-logos`** (já existe nos 5 seedados — confirmar policies):
   - Upload via `/dashboard/configuracoes/branding` (UI JIT junto com primeiro tenant — não dia 0)
   - Dia 0: bucket existe, mas sem upload UI. Tenants seedados (`desafit` + 2 tenants test) usam Satori fallback.

4. **`app/sw.ts`** — Serwist skeleton com `defaultCache` runtime presets (8 estratégias blueprint 08 §2):
   - HTML routes `/portal/*` NetworkFirst 3s → `/~offline`
   - Static JS CacheFirst 30d (content-hashed)
   - CSS + `theme.css` StaleWhileRevalidate 7d
   - Supabase Storage images CacheFirst 30d max 200 entries
   - Bunny Stream HLS `.m3u8` NetworkOnly
   - API GET SWR 1h, mutations NetworkOnly
   - `manifest.webmanifest` + icons dinâmicos por tenant — StaleWhileRevalidate 7d (não CacheFirst — tenant pode trocar logo)
   - `/~offline` precached

5. **`next.config.ts`** — wire `withSerwist({ swSrc: 'app/sw.ts', swDest: 'public/sw.js' })`. Usar `@serwist/turbopack` (Next 16 Turbopack default). Fallback documentado: `next build --webpack` se Serwist quebrar em Turbopack.

6. **`app/layout.tsx`** (resolução tenant via proxy.ts headers já injetados):
   - `<link rel="manifest" href={`/api/${routeKind}/${routeId}/manifest.webmanifest?v=${theme_version}`}>` (dinâmico — `routeKind` = `tenants` ou `brands`)
   - `<meta name="theme-color" content={brand.theme_color_dark}>` (dinâmico via `useBrand()` — para light/dark via media query: 2 meta tags com `media="(prefers-color-scheme: ...)"`)
   - `<meta name="apple-mobile-web-app-capable" content="yes">`
   - `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">`
   - `<meta name="apple-mobile-web-app-title" content={tenantName}>` (nome do tenant na home screen iOS)
   - `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` (viewport-fit=cover habilita safe-area)
   - **`<MotionConfig reducedMotion="user" transition={{ duration: 0.26, ease: [0.2, 0, 0, 1] }}>`** envolvendo children (Pesquisa 08 A4)

7. **Safe-area iOS** — adicionar em `app/globals.css`:

   ```css
   @layer base {
     :root {
       --inset-safe-top: env(safe-area-inset-top);
       --inset-safe-bottom: env(safe-area-inset-bottom);
       --inset-safe-left: env(safe-area-inset-left);
       --inset-safe-right: env(safe-area-inset-right);
     }
   }
   ```

   (Pesquisa 08 + Blueprint 05 §1 já cobre — confirmar e expandir se faltar.)

8. **Skeleton shimmer custom** — substitui shadcn Skeleton `animate-pulse` default por shimmer gradient OKLCH:

   ```css
   @keyframes shimmer {
     0% {
       background-position: -200% 0;
     }
     100% {
       background-position: 200% 0;
     }
   }
   .skeleton-shimmer {
     background: linear-gradient(
       90deg,
       var(--muted) 0%,
       var(--muted-foreground) / 10 50%,
       var(--muted) 100%
     );
     background-size: 200% 100%;
     background-attachment: fixed; /* unifica shimmer através múltiplos elementos */
     animation: shimmer 1.5s ease-in-out infinite;
   }
   ```

   Override em `components/ui/skeleton.tsx` via path override ESLint vendor (não edita primitive, adiciona class via Tailwind v4 `@utility`).

9. **Splash screens iOS dinâmicas por tenant** — endpoint `/api/{tenants,brands}/[id]/splash/[size].png/route.ts`:
   - 6 sizes: iPhone 14/15/16 (1170×2532, 1290×2796, 1320×2868) + iPad (1620×2160, 1668×2388, 2048×2732)
   - Gerado via Satori — logo/wordmark do tenant centralizado em fundo `--color-surface-1` do tenant
   - `<link rel="apple-touch-startup-image" href={tenantSplashUrl} media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)">` × 6
   - Splash assets dinâmicos = aluno do BoxClub vê splash com logo BoxClub na cor BoxClub

10. **`/~offline` página fallback** — `app/(client)/~offline/page.tsx` (Next 16). Server Component, sem deps externas, copy via `t('common.errors.offline')`. Logo do tenant via `useBrand()` quando online retornar.

**NÃO incluir dia 0 (JIT documentado em `.claude/rules/*.md`):**

- `messages/<locale>/*.json` precache (Sprint 14 — playbook em `i18n.md`)
- IndexedDB queue + Dexie (Sprint 5+ — `idb-keyval` instalado mas Dexie é decisão Pesquisa 12 quando feature mutations offline real)
- Install banner custom iOS (junto com `<Logo>` icon variant JIT)
- Vaul bottom-sheet customizado (JIT quando primeira tela mobile com bottom sheet — `shadcn-zone.md` playbook)
- Tab bar com `layoutId` Motion indicator (JIT junto com primeira tela PWA aluno)
- Header sticky com blur condicional (JIT)
- 4 Card composições PWA aluno (`hero`, `media`, `metric`, `entity`) — JIT
- Sonner customizado tokens próprios — `AppToast` wrapper já cobre uso semântico, customização visual JIT

### Etapa 12 — Storybook 10 substitui Ladle (~3h)

**Substitui ADR-0013 (Ladle) → ADR-0038 (Storybook 10).** Razão: MCP server oficial Storybook (Claude/Cursor leem stories como catálogo), Chromatic visual regression, addon-a11y (axe-core), addon-interactions (testing-library).

- `pnpm dlx storybook@latest init` (escolher react-vite framework)
- Stories **co-localizadas** com primitive: `components/<nome>/<nome>.stories.tsx` (Pesquisa 18 Q8 + ADR-0040 §L)
- ESLint override `**/*.stories.*` (já criado em Etapa 2 — i18next + jsx-no-literals off)
- Storybook MCP server: configurar no `.mcp.json`
- Addons: `@storybook/addon-a11y` (axe-core), `@storybook/addon-interactions`
- Stories iniciais: 3 wrappers (AppForm, AppToast, AppEntitlementGate) + 3 typography (Heading, Text, Muted) + 13 paletas showcase + Motion presets
- Remover `@ladle/react` do `package.json` + `.ladle/` folder
- ESLint override `.ladle/**` (ADR-0031 §6) removido também

### Etapa 13 — Makerkit entitlements RPCs (~3-4h)

**Refactor `lib/entitlements/server.ts` chamando RPCs PostgreSQL em vez de queries diretas.** Razão: source of truth no banco, performance (1 RPC vs 2-3 queries), atomicidade quota tracking.

- Migration SQL via `mcp__supabase__apply_migration`:
  - Tabela `subscription_entitlements` (variant_id, entitlement JSONB, type, usage JSONB)
  - Tabela `feature_usage` (account_id, feature_key, count, period_start, period_end)
  - RPCs PostgreSQL: `can_use_feature(account_id, feature)`, `get_entitlement(account_id, feature)`, `update_feature_quota_usage(account_id, feature, delta)`, `reset_feature_quota_monthly()`
  - Trigger `handle_new_subscription` cria `feature_usage` rows iniciais
- Rewrite `lib/entitlements/server.ts`:
  - `requireEntitlement` → chama `can_use_feature` RPC
  - `getEntitlements` → chama `get_entitlement` RPC
  - `requireQuota` → chama `can_use_feature` + read `feature_usage`
- API client (`lib/entitlements/client.ts`, `useEntitlement`, `useQuota`) NÃO muda — backwards compatible
- `AppEntitlementGate` (Etapa 7) usa interface inalterada
- ADR-0039 supersede ADR-0034 arquitetura (vertical slice estrutura mantém)

### Etapa 14 — Cleanup geral (~3h)

**Resolve dívidas técnicas pendentes + atualiza docs + arquiva resíduos.**

**Atualizações docs principais:**

- Atualizar `CLAUDE.md` (já parcialmente feito Etapa 1) — adicionar Storybook 10 + Makerkit RPCs + `<Logo>` referência + ponteiros pros blueprints 19/20 novos (Etapa 15)
- Atualizar `docs/blueprint/02-stack.md §5` — confirmar `eslint-plugin-better-tailwindcss` instalado com `recommended-error`
- Atualizar `docs/blueprint/05-design-system.md`:
  - §5 patch APCA naming "Bronze" → "Silver" (mesmos números 75/60/45, naming oficial APCA-W3) + reference ADR-0040 §H
  - §7 patch typography 12 → 3 dia 0 + 9 JIT (ADR-0040 §F supersede) + nota "Muted substitui Eyebrow na lista dia 0; Eyebrow JIT"
  - §11 patch Visual premium 12 patterns → 5 dia 0 (Skeleton shimmer + theme-color + safe-area + MotionConfig + splash iOS na Etapa 10) + 7 JIT documentados em `.claude/rules/shadcn-zone.md`
- Atualizar `docs/blueprint/11-roadmap.md §2.2` — refletir que F3/F4/F5 viraram Etapas 12/13/14 deste plano (não "depois") + scope visual premium ajustado
- Atualizar `docs/blueprint/14-docs-lifecycle.md` — adicionar referências aos blueprints 19/20 novos (Etapa 15) + ADR-0036/37/40
- Atualizar `docs/blueprint/15-bootstrap-checklist.md`:
  - Tarefa 17 (Skeleton premium): ✅ done (Etapa 10 sub-item 6)
  - Tarefa 20 (safe-area iOS + theme-color + splash + tab bar): parcial ✅ (safe-area + theme-color + splash done Etapa 10; tab bar JIT)
  - Tarefa 24 (Logo system completo): scope reduzido ✅ wordmark Geist Sans long-term done Etapa 9
  - Tarefa 25 (typography 12): ✅ 3 done (ADR-0040 §F)
  - Tarefa 29 (Ladle stories): migrada pra Storybook (Etapa 12)
- Atualizar `docs/blueprint/16-claude-code.md` — adicionar 6 hooks PreToolUse atuais + 15 rules atuais + ADR-0036/0037/0040 + estado `.mcp.json`
- Regenerar `docs/_status.md` (stale — não reflete F1/F2/T14/ADR-0040 + ADRs 0038-0039)
- Corrigir typo neste plano `@vercel/idb-keyval` → `idb-keyval` (verificar todas ocorrências)
- Atualizar ADR-0040:
  - §F nota "Muted substitui Eyebrow na lista dia 0; Eyebrow JIT"
  - §K nota "Logo wordmark Geist Sans dia 0 (00-PROJETO §9 constitucional) — variants icon + horizontal JIT"
  - §B confirmar `eslint-plugin-better-tailwindcss` `recommended-error`

**Arquivar resíduos (audit 2026-05-18 noite-4):**

- `docs/package.json.scripts.md` → `docs/_archive/` (resíduo bootstrap — `package.json` real existe)
- `docs/proposta/` (mockup-desafit.png + proposta_desafit.html) → confirmar se é bandeira tenant 1 desafit OU arquivar pra `docs/_archive/proposta-original/`. Se for material vivo, mover pra `app/(legacy-public)/proposta/` ou similar

**Atualizações `.claude/rules/`:**

- `i18n.md` — adicionar 1 linha mencionando `kinds.<vertical>.json` como namespace especial pra vertical-specific content kinds (00-PROJETO §4)
- `i18n.md` — substituir exemplo `<AppButton i18nKey="...">` (herdado Research 21) por `<AppForm>` ou padrão genérico "qualquer wrapper composto que aceita `i18nKey`" — AppButton NÃO é wrapper dia 0 (decisão 1 deste plano)
- `shadcn-zone.md` — adicionar bullet "4 entitlement components JIT (Badge, PaywallModal, QuotaBanner, UpgradeCTA — só `AppEntitlementGate` dia 0)"
- `shadcn-zone.md` — adicionar bullet "4 Card composições PWA aluno JIT (`hero`, `media`, `metric`, `entity`) — gatilho: primeira tela PWA aluno"
- `shadcn-zone.md` — adicionar bullet "Vaul bottom-sheet customizado JIT — gatilho: primeira tela mobile com bottom sheet (snap points + handle + safe-area-inset-bottom)"
- `shadcn-zone.md` — adicionar bullet "Tab bar com `layoutId` Motion indicator JIT — gatilho: PWA aluno tab bar"
- `shadcn-zone.md` — adicionar bullet "Sonner customizado tokens JIT — `AppToast` já cobre semântica; customização visual quando feature pedir"

**Dívidas técnicas:**

- Resolver ressalva ADR-0031 §9 seeds: `lib/design/seeds/**` lint override pode ser estreitado
- Resolver ressalva ADR-0031 §10 RouteProvider: AppError factory i18n (Etapa 5) já cobre
- Husky v9 deprecation: remover linhas legacy de `.husky/{pre-commit,commit-msg}` (warning a cada commit hoje)
- `docs/research/compass_artifact_*.md` untracked se ainda existir → mover pra `docs/research/NN-*.md`
- Memória nova `feedback_jit_anchoring.md` confirma princípio âncora — registrar
- Update `docs/_archive/` se necessário

### Etapa 15 — Criar blueprints novos (~1h30)

**Por que dia 0:** ADRs registram decisão, `.claude/rules/*.md` é playbook executável JIT, mas falta documentação canônica operacional pra Claude/humano abrir e entender "como fazer X" sem precisar caçar em 3 lugares. Blueprint é a fonte única operacional (igual blueprints 01-18 atuais).

**Criar `docs/blueprint/19-wrapper-strategy.md`** (~45min):

- Consolida ADR-0040 §E + §F + Pesquisa 19 + Pesquisa 20 + `.claude/rules/shadcn-zone.md`
- Conteúdo:
  - Princípio: zona quarentenada `components/ui/**` (vendor surface) + wrapper SÓ com valor agregado
  - 3 wrappers obrigatórios dia 0: AppForm, AppToast, AppEntitlementGate
  - 3 typography essenciais dia 0: Heading, Text, Muted
  - 42+ wrappers JIT (tabela com gatilho)
  - 9 typography JIT (tabela com gatilho)
  - 4 Card composições PWA aluno JIT
  - Vercel Academy: "wrapper passthrough doubles design system size" (citação verbatim)
  - Regra de 3 (Martin Fowler)
  - Hierarquia ADR-0037: shadcn blocks → primitives → @origin-ui → @kibo-ui → @reui → @tremor → @billingsdk → custom
  - Aceternity excluído (Framer Motion incompat)
- Referências cruzadas: ADR-0008, ADR-0037, ADR-0040 §A-§F, `.claude/rules/shadcn-zone.md`, Pesquisas 17/18/19/20

**Criar `docs/blueprint/20-i18n-strategy.md`** (~45min):

- Consolida ADR-0040 §G + Pesquisa 21 + `.claude/rules/i18n.md`
- Conteúdo:
  - Stack: next-intl 4 + estrutura `messages/<locale>/<namespace>.json`
  - Dia 0: só pt-BR (locale fixo em `i18n/request.ts`)
  - Setup canônico: `i18n/request.ts` + `createNextIntlPlugin` em `next.config.ts` + `NextIntlClientProvider` em `app/layout.tsx`
  - Padrão `t('key')` server vs client
  - `AppError.factory` overload `string | { key, fallback, metadata? }`
  - Zod messages: factory por callsite (Opção A)
  - Multi-vertical: chaves descritivas neutras + tenant_copy_overrides JIT
  - Multi-brand + locale: brand ortogonal (schema `brands.default_locale` adia)
  - `kinds.<vertical>.json` (00-PROJETO §4 — namespace especial pra vertical-specific content kinds)
  - JIT documentado: locales adicionais, rota `[locale]`, locale switcher UI, PWA pre-cache messages
- Referências cruzadas: ADR-0040 §G, `.claude/rules/i18n.md`, Pesquisa 21, blueprint 13 §2.2 (14 padrões ESLint)

---

## 16.6. Ressalvas execução (resolver na hora — não bloqueador de plano)

Lista curta pra Claude futuro lembrar de decisões pendentes que aparecem só na implementação:

**R1. Etapa 10 — `MotionConfig` precisa wrapper client**

- `MotionConfig` vem de `motion/react` (client). `app/layout.tsx` é RSC.
- Solução: criar `components/motion-provider.tsx` com `'use client'` envolvendo children (padrão blueprint 05 §6 `components/motion/client.tsx`).
- Decidir na hora: nome final do arquivo + se vai junto com `NextIntlClientProvider` na mesma camada ou separado.

**R2. Etapa 10 — `theme-color` dinâmico: derivação não especificada**

- Sub-item 6 usa `content={brand.theme_color_dark}` mas:
  - `brands` table NÃO tem `theme_color_dark`/`theme_color_light` columns
  - Brand resolver (`proxy.ts` headers) não retorna theme color
- 3 opções (decidir na execução Etapa 10):
  - **(a) Derivar runtime** da palette via helper em `lib/design/contrast.ts` (`pickReadableForeground(brand.surface)`)
  - **(b)** Adicionar 2 columns em `brands` (`theme_color_light`, `theme_color_dark`) via migration
  - **(c)** 2 `<meta>` com `media="(prefers-color-scheme: light|dark)"` cada uma com cor derivada de (a)
- Recomendação preliminar: (c) usando (a) — zero migration, dark/light nativo, sem nova column
- Documentar escolha em ADR-0040 §H ou nova ADR-0041 na hora

**R3. Etapa 8 — Typography Edit bloqueado pelo hook §C**

- `components/ui/heading.tsx` etc são criados via `Write` (passa marker `// RESEARCH:` linha 1)
- `Edit` subsequente é bloqueado pelo `component-research-gate.sh` (zona quarentenada)
- Não é bug — é fricção operacional aceita. Atualizações exigem `git mv` + recriar OU adicionar override no hook pra typography custom
- Documentar em `.claude/rules/shadcn-zone.md` que typography custom em `components/ui/` é exceção (criada por nós, não vendor)

**R4. Etapa 14 — Patch `.claude/rules/i18n.md`: remover refs a `<AppButton>`**

- Research 21 §6 (fonte do `i18n.md`) cita `<AppButton i18nKey="...">` como exemplo
- Decisão 1 do plano: AppButton JIT (não é wrapper dia 0)
- Substituir exemplo `<AppButton>` por `<AppForm>` ou padrão genérico "qualquer wrapper composto que aceitar `i18nKey` prop"
- Adicionar como bullet explícito na Etapa 14 patches

---

## 17. Critério de saída ("dia 0 fechado")

Todas verdadeiras:

- [ ] `pnpm typecheck && pnpm lint --max-warnings 0 && pnpm knip && pnpm validate:apca && pnpm test && pnpm build && pnpm size` passa local
- [ ] Hook bloqueia Edit em `components/ui/*` (smoke manual)
- [ ] Hook `post-shadcn-add.sh` injeta checklist (smoke `npx shadcn add badge`)
- [ ] `messages/pt-BR/common.json` carregado via `NextIntlClientProvider`
- [ ] `AppError.invalidInput({ key, fallback })` aceita ambos
- [ ] APCA Silver quebra build se paleta seed corrompida (smoke)
- [ ] 3 wrappers + 3 typography rendem em rota smoke
- [ ] `<Logo>` componente único renderiza wordmark Geist Sans + multi-marca via `useBrand()`
- [ ] `eslint-plugin-better-tailwindcss` ativo + bloqueia `text-[#fff]` em features
- [ ] `MotionConfig reducedMotion="user"` no root layout (smoke OS Reduce Motion ON → animações respeitam)
- [ ] `<meta name="theme-color">` dinâmico por brand + safe-area-inset funcional em iPhone 14 portrait
- [ ] Skeleton shimmer custom (não `animate-pulse` default) em rota smoke
- [ ] PWA manifest válido **per-tenant** (smoke: `curl /api/tenants/<id>/manifest.webmanifest` retorna nome+cor do tenant, não desafit hardcoded) + Service Worker registra `/sw.js` + `/~offline` fallback funciona + splash iOS 6 sizes **per-tenant** (smoke: 2 tenants test = 2 splashes diferentes) + ícones PWA dinâmicos (Satori fallback se tenant sem logo upload)
- [ ] Storybook 10 sobe com stories pros 3 wrappers + 3 typography + 13 paletas + Motion presets + Logo
- [ ] Makerkit RPCs em produção: `requireEntitlement` chama `can_use_feature` no DB
- [ ] Husky v9 sem warnings deprecated
- [ ] 4 stubs criados (action.ts, roles.ts, tokens.ts, palettes.ts)
- [ ] Blueprint 05 §5 (APCA Silver) + §7 (typography 3 dia 0) + §11 (visual premium 5/12 dia 0) atualizados
- [ ] Blueprint 02 §5 + 11 §2.2 + 14 + 15 (Tarefas 17/20/24/25/29) + 16 (claude-code) atualizados
- [ ] Blueprints novos criados: `19-wrapper-strategy.md` + `20-i18n-strategy.md`
- [ ] Resíduos arquivados: `package.json.scripts.md` + `docs/proposta/` (ou movido pra rota apropriada)
- [ ] `_status.md` regenerado refletindo estado real (39+ ADRs, ADR-0040, etc)
- [ ] Teste memória JIT 6/6 cenários passa
- [ ] Commit local feito, sem push
- [ ] 4 gates M0 destravados (lint, audit, size, APCA) + Logo constitucional + Visual Premium 5/12 dia 0

---

## 18. Próximo passo após este plano

**Único próximo passo:** Feature 1 (funil agência) — login + signup + capture-form + assessment-display + admin-leads.

Cada JIT durante feature 1 segue playbook em `.claude/rules/*.md` (i18n.md, shadcn-zone.md, contrast.md, etc).

---

## 19. Histórico

| Data               | Mudança                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Aprovador |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 2026-05-18 noite-2 | Plano mestre consolidado — martelo batido pós Pesquisas 17/18/19/20/21 + audit completo + decisão item-por-item + delegação fundador "bata o martelo"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Leandro   |
| 2026-05-18 noite-3 | Plano expandido pra 16 etapas (era 11). Absorveu Phase A Final F3/F4/F5 que estavam marcados como "depois" — roadmap M0 exige antes do gate. Adicionada Etapa 3 (4 stubs + audit Husky/CI) e Etapa 9 (PWA manifest + SW skeleton). Tempo total ~20h (era 11h30). Tasks granulares pendentes — recriar quando autorizar execução                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Leandro   |
| 2026-05-18 noite-4 | Plano expandido pra 17 etapas. 4 críticos absorvidos: Etapa 9 nova `<Logo>` wordmark Geist Sans (constitucional 00-PROJETO §9); Etapa 2 cresce com `eslint-plugin-better-tailwindcss` (blueprint 02 §5); Etapa 10 cresce com MotionConfig + theme-color dinâmico + safe-area-inset + Skeleton shimmer + splash iOS 6 sizes (blueprint 05 §11 visual premium); Etapa 14 cleanup expandida pra patchar blueprints 02/05/11/15 + ADR-0040 §F (Muted vs Eyebrow) + corrigir typo idb-keyval + adicionar 5 bullets em `.claude/rules/shadcn-zone.md` (4 entitlement components + 4 Card composições PWA + Vaul bottom-sheet + Tab bar + Sonner tokens — todos JIT). Tempo total ~24h (era ~20h)                                                                                                                                                                       | Leandro   |
| 2026-05-18 noite-5 | Audit `docs/` completo. Plano expandido pra 18 etapas. Etapa 14 cresce: arquivar resíduos (`package.json.scripts.md` + `docs/proposta/`) + patch blueprint 14 (docs-lifecycle) + blueprint 16 (claude-code). **Etapa 15 nova:** criar 2 blueprints consolidados — `19-wrapper-strategy.md` (ADR-0040 §E + Pesquisas 19/20) + `20-i18n-strategy.md` (ADR-0040 §G + Pesquisa 21). Decisões fechadas: better-tailwindcss `recommended-error`, ícones PWA placeholders dia 0, Logo wordmark Geist Sans long-term, Geist confirmado (sem trocar Inter), locale strategy fechada via i18n (ADR-0040 §G). Tempo total ~25h30 (era ~24h)                                                                                                                                                                                                                                 | Leandro   |
| 2026-05-18 noite-7 | Cross-check pré-execução. 7 micro-issues identificados — 4 absorvidos no plano (R1-R4 em §16.6 "Ressalvas execução" + R4 adicionado como patch Etapa 14), 2 corrigidos in-place (numeração §11 "Etapa 10" → "Etapa 11", §16 título "Etapas 3,9,11,12,13" → "Etapas 3,9,10,12,13,14"), 1 já resolvido noite-6 (Etapa 9 icons placeholder vs Etapa 10 dinâmico). Tempo total mantido ~26h30 — ressalvas resolvem na execução, não adicionam etapa                                                                                                                                                                                                                                                                                                                                                                                                                  | Leandro   |
| 2026-05-18 noite-6 | **Correção crítica multi-tenant white-label:** ícones PWA NÃO são placeholders genéricos dia 0 — são per-tenant (cada profissional tem PWA próprio com nome+logo+cor próprios, exatamente como `/api/{tenants,brands}/[id]/theme.css/route.ts` já faz). Etapa 10 expandida (~3h → ~4h) com 4 sub-itens novos: (1) `manifest.webmanifest/route.ts` dinâmico por tenant/brand; (2) 4 endpoints `icon-{192,512,maskable,apple-touch}.png/route.ts` (Satori fallback se sem logo upload); (3) splash iOS 6 sizes dinâmicas via Satori per-tenant; (4) `<meta apple-mobile-web-app-title>` + `<link rel="manifest">` dinâmicos no `layout.tsx`. Etapa 9 (Logo) ajustada — ícones PWA agora gerados pela Etapa 10, não placeholders. Critério de saída §17 reforçado com smokes per-tenant. Termos corretos: `/portal/*` (não `/aluno/*`). Tempo total ~25h30 → ~26h30 | Leandro   |
