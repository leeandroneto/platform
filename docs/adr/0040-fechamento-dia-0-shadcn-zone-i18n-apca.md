# 0040. Fechamento dia 0 — shadcn zone + i18n + APCA + wrappers JIT

Date: 2026-05-18
Status: accepted (substitui ADR-0031 §1 + §7; complementa ADR-0036, ADR-0037)

**Atualizado 2026-05-21 após ADR-0044 (pivot TweakCN-way).** Decisões sobre
§A shadcn-zone quarentenada + §E 3 wrappers obrigatórios (`<AppForm>`,
`useAppToast`, `<AppEntitlementGate>`) + §F 3 typography primitives
(`<Heading>`/`<Text>`/`<Muted>`) + §G i18n strategy + §H APCA Silver
dual-gate (75/60/45) + §L 6 rules path-loaded JIT continuam **integralmente
válidas**.

Decisões sobre design system (§§ relacionadas a tokens canon, archetype
strategy, 28 roles invented D-43, 5 font slots, voice tokens) foram
**superseded por ADR-0044 §11**. Vocabulário oficial pós-pivot:
shadcn-canonical 41 tokens TweakCN-vocab (ver `.claude/rules/design-tokens.md`).
Pointer canônico pra design system: ADR-0044 + `docs/plans/pivot-tweakcn.md`.

## Context

Dia 0 do `platform/` (multi-tenant white-label B2B) tem 3 gaps que vão estourar na cara em ~5h de feature 1:

1. **Build vermelho.** Decision A (2026-05-18) removeu ADR-0031 §1 (`components/ui/**`) + §7 (`hooks/use-mobile.ts`) esperando solução definitiva. ~200 erros lint nos 47 primitives shadcn.
2. **i18n não wireado.** `next-intl@4.12.0` + `eslint-plugin-i18next@6.1.4` instalados mas sem config. Regra `react/jsx-no-literals` ativa — primeira string PT-BR trava.
3. **APCA não é gate de build.** `scripts/validate-palettes.ts` existe (testa 2 cenários × 13 paletas seed = 26 pares) mas roda manual. Paleta tenant ruim vai pra produção.

Pesquisas que sustentam decisões:

- 17 (guardrails IA + shadcn governance) — adotada
- 18 (zona quarentenada shadcn) — adotada
- 19 (JIT vs upfront — minha) — adotada
- 20 (JIT vs upfront — Desktop) — adotada (revisa wrappers/typography/no-restricted-imports)
- 21 (i18n strategy) — adotada

Audit completo do código confirmou:

- Theming via CSS vars do banco JÁ resolve cor/fonte/shape automático (`globals.css:140-141`: "ZERO componente precisa ser editado individualmente")
- Wrapper pattern proxy "doubles design system size" (Vercel Academy)
- shadcn não entrega typography primitives (issue #1527 oficial)
- `messages/<locale>/<namespace>.json` escala melhor que flat (next-intl Discussion #357)
- Migração shadcn → outra lib custa 3-5× implementação inicial (SaaSIndie 2026)

Lição do onboarding-bio: ~150-170h refatorações por decisões esquecidas + ~830 `eslint-disable` silenciando 1 regra. Memória externa em doc + travas determinísticas evita repetir.

## Decision

### §A — Zona quarentenada `components/ui/**`

Path overrides ESLint **narrowest possible** (Pesquisa 18 Q1). Lista de regras OFF (vendor surface shadcn viola por design) e ON (mantém regras de BUG):

```js
{
  files: ['components/ui/**/*.{ts,tsx}'],
  rules: {
    // OFF (estilo)
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
    // ON (bugs reais)
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

Override §7 `hooks/use-mobile.ts` (dep block shadcn sidebar) também volta.

### §B — `no-restricted-imports` bloqueando `@/components/ui/*` REMOVIDO + `eslint-plugin-better-tailwindcss` customizado

**B.1.** Pesquisa 20 + Vercel Academy: regra preventiva força wrapper passthrough (anti-pattern). Hook §C já bloqueia Edit em `components/ui/*` (zona quarentenada). Wrapper criado apenas quando agrega valor real (regra de 3 + comportamento composto).

**B.2.** `eslint-plugin-better-tailwindcss@4.5.0` instalado com **preset `recommended` + customização cirúrgica** (revisado pós pesquisa 2026-05-18 — não `recommended-error` puro):

- **9 regras ERROR (correctness + valor real):** `no-conflicting-classes`, `no-duplicate-classes`, `no-restricted-classes`, `no-deprecated-classes`, `enforce-shorthand-classes`, `enforce-consistent-important-position`, `enforce-consistent-variable-syntax`, `enforce-canonical-classes`
- **1 regra WARN dia 0 (com gatilho de promoção):** `no-unknown-classes` com `detectComponentClasses: true`. Promove pra ERROR quando `app/globals.css` cobrir 100% tokens semantic + classes vendor (cmdk/vaul/embla/tw-animate-css). Gatilho JIT documentado em `.claude/rules/design-tokens.md` "Condição de revisitar"
- **4 regras OFF (conflito com prettier-plugin-tailwindcss):** `enforce-consistent-class-order` (issue tailwindlabs/prettier-plugin-tailwindcss#278), `enforce-consistent-line-wrapping`, `no-unnecessary-whitespace`, `enforce-consistent-variant-order` (RTL é JIT). Prettier sorta no save.
- **`settings.entryPoint: 'app/globals.css'`** — Tailwind v4 lê tokens via `@theme` directive (não há `tailwind.config.js`)
- **`components/ui/**`override desliga as 9 regras** (vendor surface; prettier +`design-tokens/no-tailwind-bypass` cobrem)

Razão de não usar `recommended-error` flat: conflito documentado com prettier-plugin-tailwindcss + falso positivo garantido em `no-unknown-classes` por classes vendor não registradas via `@theme`. Customização entrega ~100% do valor (catches typos, duplicates, conflicts, shorthand opportunities, deprecated) sem fricção desnecessária.

**B.3. Evolução hook `protect-eslint.sh` (2026-05-18):** hook agora aceita Edit/Write em `eslint.config.*` quando o diff contém marker `ADR-NNNN` E o arquivo `docs/adr/NNNN-*.md` existe. Princípio: trigger aponta pra resposta (memory `feedback_jit_anchoring`). Antes: hook negava categoricamente, forçando founder a editar manualmente. Defesa em camadas: Claude futuro precisaria forjar marker E criar ADR fake pra burlar — caminho de baixo benefício e alto custo de rastreio.

### §C — Hook `component-research-gate.sh` reforçado

Bloqueia Edit (não só Write) em `components/ui/*`. Canal legítimo único: Bash rodando `npx shadcn add <slug>`.

### §D — Hook `post-shadcn-add.sh` novo

PostToolUse Bash matching regex `shadcn(@[^[:space:]]+)?[[:space:]]+add` → injeta checklist via stderr (6 passos: get_audit_checklist, grep literais, grep cores, deletar variants, criar wrapper se necessário, validar).

### §E — 3 wrappers compostos OBRIGATÓRIOS dia 0

`components/app-*.tsx` com valor agregado concreto. Demais JIT por consumer real (regra de 3).

| Wrapper              | Valor agregado                                             | Razão dia 0                                                               |
| -------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------- |
| `AppForm`            | RHF + Zod resolver + AppError i18n + submit handler tipado | Encapsula ~30 linhas. Feature 1 (login + signup + capture-form) usa todos |
| `AppToast`           | sonner + helpers `toast.success(i18nKey)` semantic         | Centraliza tradução, evita N callsites                                    |
| `AppEntitlementGate` | `useEntitlement()` + paywall modal + upgrade CTA           | White-label SEMPRE precisa de plan gating UI                              |

JIT (não criar preventivo):

- `AppButton` — quando loading state aparecer em feature
- `AppInput` — quando error display integrado pedir
- `AppDialog` — primeiro modal real
- Demais 42 — regra de 3

Wrapper passthrough (só re-exporta) é **PROIBIDO** (Vercel Academy: "doubles design system size").

### §F — 3 typography custom dia 0

shadcn não entrega (issue #1527). Custom em `components/ui/`:

- `Heading` (level prop 1-4) — replica Nathan Curtis 4-6 levels
- `Text` (variants body, body-sm, lead)
- `Muted` (text-sm text-muted-foreground) — substitui `Eyebrow` na lista dia 0; uso textual mais frequente em UIs SaaS (caption/helper); `Eyebrow` (uppercase smallcap) JIT quando primeira tela de marketing/landing pedir.

**Done dia 0 (Etapa 9 do plano):** `<Logo>` wordmark Geist Sans bold + tracking-tight (00-PROJETO §9 constitucional) — lê `brand.name` via `useBrand()`. Variants `icon` + `horizontal` JIT (exigem asset SVG do designer).

JIT typography (uso real): `Code`, `Stack`, `Container`, `EmptyState`, `Metric`, `DataCell`, `Eyebrow`, `Section`, `Divider`, `VisuallyHidden`.

### §G — i18n strategy (Research 21)

Decisões pormenorizadas:

- **Rota `[locale]` JIT** (não dia 0) — locale fixo `pt-BR` em `i18n/request.ts`
- **Messages estrutura** `messages/<locale>/<namespace>.json`. Dia 0: `messages/pt-BR/common.json` (actions/errors/validation)
- **Chaves descritivas neutras** (`programs.title`, não `workouts.title`). Copy fitness-shaped no VALOR (multi-vertical via tenant override JIT)
- **Brand ortogonal a locale.** Schema `brands.default_locale` adia (migration single-column quando 2ª brand internacional)
- **next-intl 4 canônico:** `i18n/request.ts` + `createNextIntlPlugin` em `next.config.ts` + `NextIntlClientProvider` em `app/layout.tsx` (envolve `RouteProvider`)
- **AppError factory overload** `string | { key, fallback, metadata? }`. Helper privado `normalize(msg)` retorna `{ message, i18nKey }`. Server loga `fallback` EN (Sentry-friendly); client traduz `key` via `t()`. Type `I18nMessage` em `lib/contracts/errors.ts`
- **Zod messages:** factory por callsite (`emailSchema(t)`). NÃO `z.setErrorMap` global (hidden state)
- **Locale switcher JIT.** Sem componente dia 0
- **`<html lang={locale}>` dinâmico** via `await getLocale()` em layout async (valida docs next-intl 4 na implementação; fallback `'pt-BR'` hardcoded se forçar sync)
- **PWA pre-cache messages JIT** (Sprint 14, ADR-0014). Serwist default cobre static JSON

### §H — APCA Silver dual-gate

Thresholds: body Lc ≥75, large ≥60, non-text ≥45 (substitui Bronze 75/30 atual). Alinha blueprint 05 §5.

Helpers em `lib/design/contrast.ts` (extraídos de `scripts/validate-palettes.ts`):

- `apca(fg, bg): number`
- `meetsApca(fg, bg, role): boolean`
- `ensureAccessible(fg, bg, minLc): string` (bisection L)
- `pickReadableForeground(bg): string`

**Aplicação prática (revisão Etapa 6 — 2026-05-18):** matrix Silver dividida em error vs warn por contexto de uso (gate prebuild só falha em error):

- **ERROR (acessibilidade real):** body text (foreground derivada) vs surface-1 em dark+light ≥ 75. Texto sempre legível em toda paleta.
- **WARN (gosto visual):** primary/secondary/tertiary/primary-light/chart-1..5 vs surface-1 ≥ 45. APCA Silver 45 oficial é pra thin borders 1-2px, não filled blocks. Filled block tradicional usa Bronze 30 (ADR-0032). Mantém visual de "filled action distinguível do bg" mas não bloqueia build se paleta seed prioriza identidade sobre Lc.
- **JIT futuro (será ERROR quando ativar):** `primary_foreground vs primary` ≥ 75 (texto on filled button). Aguardando campo `primary_foreground_oklch` no seed (Sprint 2).

Razão: 13 paletas seed foram desenhadas com Bronze. Subir pra Silver non-text 45 em todos os filled blocks reprovaria 12/13 paletas — re-tunar todas via `ensureAccessible()` perderia identidade visual seed. Pragmaticamente: gate body é acessibilidade, gate non-text é gosto. Etapa 14 cleanup pode re-tunar JIT se algum tenant reclamar.

Matrix completa: 13 paletas × 2 modes × N roles = 258 cenários. Dia 0: 0 errors, 106 warns informativos.

### §I — Wire APCA via `package.json prebuild`

```json
{
  "scripts": {
    "validate:apca": "tsx scripts/validate-palettes.ts",
    "prebuild": "pnpm validate:apca"
  }
}
```

Funciona local + Vercel + CI sem duplicar. Não usa `vercel.ts buildCommand`.

### §J — Completude ESLint i18n (14/14 padrões)

Ativar `eslint-plugin-i18next` flat recommended + 4 selectors `no-restricted-syntax` faltantes (metadata.title, react-email Text, push.body, error-map value). Cobre 14/14 padrões blueprint 13 §2.2.

Implementar regras 17 (MemberExpression CSS var em JS) e 24 (`'use client'` guard em server-only files) — plugins custom novos.

### §K — Remover `scripts/i18n-audit.sh`

Camada redundante quando ESLint cobre 14/14. Atualizar `docs/blueprint/13-lint-enforcement.md §4.2` removendo referência.

### §L — 6 `.claude/rules/*.md` novos (memória executável JIT)

Granular, frontmatter `paths:` carregamento sob demanda:

- `i18n.md` — playbook next-intl + AppError + Zod factory + tenant override architecture
- `contrast.md` — APCA Silver + helpers + matrix
- `shadcn-zone.md` — zona quarentenada + 3 wrappers + checklist pós-add + 42 JIT
- `design-tokens.md` — usos canônicos + anti-patterns
- `brand.md` — env vars + useBrand + multi-vertical keys
- `entitlements.md` — requireEntitlement + AppError i18n + plan-gates

**Regra obrigatória (Pesquisa 20):** cada rule tem seção "Condição de revisitar" com gatilho explícito. Sem isso, vira documento morto.

## Consequences

**Positivo:**

- Build verde dia 0 (zona quarentenada + i18n setup destravam lint)
- 4 gates M0 destravados (lint, audit, size budgets, APCA build-time)
- Memória externa em doc + condição de revisitar → Claude futuro JIT sem refator
- Wrapper guard real (passthrough proibido + 3 obrigatórios com valor concreto)
- APCA falha deploy em paleta quebrada
- shadcn primitives pristine + canal único Bash `shadcn add`
- i18n estrutura preparada pra expansão (Stripe internacional dia 1 confirmado)
- AppError back-compat preserved (`string | { key, fallback }`)

**Negativo:**

- 14 arquivos novos + 8 atualizações em ~11h30 de trabalho
- Demanda disciplina pra wrapper "valor agregado obrigatório" (Vercel Academy bate quando passa)
- Locale switcher e tenant copy override são gaps explícitos até feature pedir
- `<html lang>` async pode precisar fallback se docs next-intl 4 forçar sync

**Neutro:**

- ADR-0031 §2-§10 mantidos (escopo não-shadcn)
- ADR-0037 §B atualizada operacionalmente (3 wrappers + passthrough proibido)
- Phase A Final F3 (Storybook), F4 (Makerkit RPCs), F5 (cleanup) ficam **DEPOIS** deste plano
- Feature 1 (M1 funil agência) destrava após este plano + F4 (entitlements rewrite)

## References

- `docs/plans/PLANO-MESTRE-DIA-0.md` — plano executável das 11 etapas
- `docs/research/17-guardrails-ia-shadcn-governanca.md`
- `docs/research/18-shadcn-zone-quarantine.md`
- `docs/research/19-jit-vs-upfront-wrapper-strategy.md`
- `docs/research/20-jit-vs-upfront-saas-founder-solo.md`
- `docs/research/21-i18n-strategy.md`
- ADR-0008 (shadcn 100% canon)
- ADR-0017 (Michael Nygard format)
- ADR-0031 (lint overrides — §1 + §7 supersedidos por este §A)
- ADR-0036 (hooks PreToolUse JSON output)
- ADR-0037 (wrapper pattern + hierarquia — §B atualizada operacionalmente por este §E)
- Vercel Academy "Updating and Maintaining Components"
- Nathan Curtis EightShapes "Typography in Design Systems"
- Martin Fowler "Yagni"
- shadcn-ui/ui Discussion #1527 (typography not shipped)
- next-intl Discussion #357 (multiple namespaces per locale)
