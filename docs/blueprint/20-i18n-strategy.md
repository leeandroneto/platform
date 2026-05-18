# 20. i18n strategy (next-intl 4)

> Consolida ADR-0040 §G + Pesquisa 21 + `.claude/rules/i18n.md` + `docs/blueprint/13-lint-enforcement.md §2.2`.
> Fonte única operacional: "como traduzir, onde colocar string, como tenant override, como erro tipado vira UI traduzida".
> Última atualização: 2026-05-18 (PLANO-MESTRE-DIA-0 Etapa 15).

---

## 1. Princípio

`t('key')` desde a primeira string PT-BR. Memória em playbook executável (`.claude/rules/i18n.md` + este blueprint) pra Claude não re-decidir em cada feature.

Decisão fechada dia 0:

- **Locale dia 0:** `pt-BR` fixo em `i18n/request.ts` (decisão ADR-0040 §G #13)
- **Multi-vertical:** chaves descritivas neutras + copy fitness-shaped no VALOR (decisão #15)
- **Multi-brand + locale:** ortogonal (brand não decide locale; `brands.default_locale` adia até 2ª brand operacional)
- **Tenant copy overrides:** JIT (migration `tenant_copy_overrides(tenant_id, key, value, locale)` quando cliente 2 pede terminologia diferente)
- **Locale switcher UI:** JIT (primeiro cliente internacional)
- **Rota `app/[locale]/`:** JIT (SEO multi-locale obrigatório OU 2+ locales user-switch)

---

## 2. Stack

- `next-intl` 4.12+ — único oficial Next 15+ App Router
- Estrutura `messages/<locale>/<namespace>.json`
- `getRequestConfig()` em `i18n/request.ts`
- `createNextIntlPlugin('./i18n/request.ts')` em `next.config.ts`
- `<NextIntlClientProvider>` em `app/layout.tsx` (envolvendo todos os outros providers)
- Server: `getTranslations(namespace)` de `next-intl/server`
- Client: `useTranslations(namespace)` de `next-intl`

---

## 3. Setup canônico (estado atual)

### `i18n/request.ts`

```ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'pt-BR' // fixo dia 0 (ADR-0040 §G decisão 13)
  return {
    locale,
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
      // namespaces JIT via dynamic import por feature
    },
  }
})
```

### `next.config.ts`

```ts
import createNextIntlPlugin from 'next-intl/plugin'
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
export default withNextIntl(nextConfig)
```

### `app/layout.tsx` (DynamicShell)

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'

async function DynamicShell({ children }) {
  const locale = await getLocale()
  const messages = await getMessages()
  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <RouteProvider {...routeProps}>
        <EntitlementProvider {...entProps}>
          {children}
          <Toaster richColors closeButton position="top-center" />
        </EntitlementProvider>
      </RouteProvider>
    </NextIntlClientProvider>
  )
}

export default async function RootLayout({ children }) {
  const locale = await getLocale()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Suspense fallback={children}>
          <DynamicShell>{children}</DynamicShell>
        </Suspense>
      </body>
    </html>
  )
}
```

---

## 4. Estrutura `messages/`

Dia 0:

```
messages/
  pt-BR/
    common.json      ← actions, errors, validation, feedback, entitlements
```

JIT por feature (criar quando feature precisar):

```
    auth.json              ← login, signup, reset-password
    billing.json           ← paywall, upgrade, plans
    programs.json          ← criar/editar/listar
    push.json              ← notifications PWA
    email.json             ← react-email templates
    kinds.<vertical>.json  ← vertical-specific content kinds (00-PROJETO §4)
                            Ex: kinds.fitness.json, kinds.yoga.json.
                            Override por tenant via tenant_copy_overrides JIT.
```

**Não criar wrapper `common:` extra no JSON** (bug Etapa 10 do plano — keys do tipo `common.feedback.saved` ficaram quebradas silenciosamente porque arquivo tinha `{ "common": {...} }` em vez de `{ "feedback": {...} }`).

---

## 5. Padrões `t()` (server vs client vs wrapper)

### Server Components / Server Actions

```ts
import { getTranslations } from 'next-intl/server'

export async function MyServerComponent() {
  const t = await getTranslations('common.actions')
  return <button>{t('save')}</button>
}
```

### Client Components

```tsx
'use client'
import { useTranslations } from 'next-intl'

export function MyClient() {
  const t = useTranslations('common.actions')
  return <button>{t('save')}</button>
}
```

### Via wrapper (preferido em forms/toasts)

Wrappers compostos dia 0 usam `useTranslations` internamente:

```tsx
const toast = useAppToast()
toast.success('feedback.saved') // wrapper resolve `t(key)` automaticamente
```

`AppButton` NÃO é wrapper dia 0 (passthrough proibido — Vercel Academy). Use `<Button>` shadcn direto com `t('save')` inline.

---

## 6. `AppError` factory overload com i18n (ADR-0040 §G decisão 19)

`lib/contracts/errors.ts` aceita `string | I18nMessage`:

```ts
export type I18nMessage =
  | string
  | { readonly key: string; readonly fallback: string; readonly metadata?: Record<string, unknown> }

// Uso server-side
throw AppError.forbidden({
  key: 'entitlements.feature_blocked',
  fallback: 'Plan upgrade required',
  metadata: { feature: 'chatbot' },
})
```

Boundary:

- Server loga `fallback` (EN, Sentry-friendly)
- Client lê `error.metadata.i18nKey` (armazenado em metadata pelo factory) e chama `t(key)`
- Back-compat: `AppError.forbidden('msg crua')` continua aceitando string (não quebra callsites antigos)

i18n keys padronizadas em `messages/pt-BR/common.json`:

- `errors.generic` · `errors.network` · `errors.not_found` · `errors.forbidden` · `errors.unauthorized` · `errors.offline` · `errors.rate_limited`
- `entitlements.locked` · `entitlements.feature_blocked` · `entitlements.quota_exceeded` · `entitlements.upgrade_description` · `entitlements.upgrade_cta`

---

## 7. Zod messages — factory por callsite (Opção A — ADR-0040 §G decisão 24)

Pattern correto:

```ts
import { z } from 'zod'
import { useTranslations } from 'next-intl'

export function useEmailSchema() {
  const t = useTranslations('common.validation')
  return z.object({
    email: z.string().email({ message: t('invalid_email') }),
  })
}
```

**NÃO USAR:**

- `z.setErrorMap(...)` global em layout — hidden state, impossível debugar locale
- `.message('string crua')` — ESLint regra 11 bloqueia

---

## 8. Multi-vertical — chaves descritivas neutras (decisão 15)

Chaves NEUTRAS, copy fitness-shaped no VALOR:

✅ Certo:

```json
{ "programs": { "title": "Programas", "create": "Criar programa" } }
```

❌ Errado:

```json
{ "workouts": { "title": "Treinos" } }   // vocab vertical-specific na chave
{ "fitness.programs.title": "..." }       // vertical no namespace
```

Razão: chaves estáveis cross-vertical. Override por tenant vem JIT via `tenant_copy_overrides` (Acme pede "WOD", FitLab pede "Programa", BoxClub pede "Treino" — todos via mesma chave).

---

## 9. Multi-brand + locale (decisão 17)

Locale **ortogonal** a brand. Dia 0: `pt-BR` fixo independente da brand resolvida.

Schema `public.brands.default_locale` **adia** até 2ª brand operacional com locale diferente. Custo migration single-column: ~2-4h.

---

## 10. `tenant_copy_overrides` (decisão JIT)

Resolver order quando renderizar página de tenant:

```
1. tenant_copy_overrides[locale][key]   ← se existe, vence
2. messages/<locale>/<ns>.json[key]     ← fallback
3. messages/<default-locale>/<ns>.json  ← último recurso
```

Implementação JIT: gatilho "cliente 2 com vertical diferente pede terminologia diferente". Migration:

```sql
CREATE TABLE public.tenant_copy_overrides (
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  key VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, key, locale)
);
```

Resolver merge em `i18n/request.ts` lê do banco quando tenant resolvido. ADR antes de implementar (ainda não há ADR cobrindo).

---

## 11. ESLint enforcement (14/14 padrões — blueprint 13 §2.2)

Regras ativas em `eslint.config.mjs`:

- `react/jsx-no-literals` — bloqueia string hardcoded em JSX
- `i18next/no-literal-string` — bloqueia string crua em arg de função (sonner, toast, Error, etc)
- `no-restricted-syntax` — bloqueia `toast.error('msg crua')`, `throw new Error('msg crua')`, `.message('texto')` em Zod
- `jsx-a11y/anchor-has-content` + variantes — `aria-label="Fechar"` literal bloqueado (use `aria-label={t('common.actions.close')}`)

Path overrides aceitos:

- `**/*.stories.{ts,tsx,mjs}` — strings demo OK
- `messages/**/*.json` — i18n payload
- `components/ui/**` — vendor surface (override §A)

---

## 12. Anti-patterns

- String hardcoded em JSX → use `{t('key')}`
- String passada por prop → use `i18nKey` no wrapper se wrapper expõe (regra de 3)
- `aria-label="Fechar"` literal → `aria-label={t('common.actions.close')}`
- `toast.success('Salvo')` literal → `useAppToast().success('feedback.saved')`
- `new Error('msg')` literal → `throw AppError.invalidInput({ key, fallback })`
- `.message('texto')` em Zod → factory `useXSchema()`
- Schema `tenant_copy_overrides` dia 0 → NÃO criar (JIT cliente 2)
- Locale switcher UI dia 0 → NÃO criar (JIT cliente internacional)
- Rota `app/[locale]/` dia 0 → NÃO criar (JIT SEO multi-locale)
- Wrapper `common:` duplicado em JSON → silently quebra `useTranslations('common')`
- `AppButton i18nKey="..."` → AppButton não existe dia 0 (passthrough proibido)

---

## 13. Condição de revisitar (regra Pesquisa 20 — sem isso vira documento morto)

| Gatilho                                                      | Ação                                                                                        | Custo      |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | ---------- |
| Primeiro cliente internacional confirmado (paying customer)  | Adicionar `messages/<locale>/<namespace>.json` espelho pt-BR + locale switcher + hreflang   | ~2-4h      |
| Cliente 2 com vertical diferente pede terminologia diferente | Migration `tenant_copy_overrides` + resolver merge em `i18n/request.ts`                     | ~2-4h      |
| SEO multi-locale obrigatório OU 2+ locales user-switch       | Migrar `app/*` pra `app/[locale]/*` + atualizar `getLocale()` + hreflang + sitemap          | ~2-4h      |
| 2ª brand operacional com locale diferente                    | Migration single-column `brands.default_locale` + resolver lê brand                         | ~1h        |
| PWA offline messages preciso (Sprint 14, ADR-0014)           | Pre-cache `messages/**/*.json` via Serwist (`@serwist/turbopack` default cobre static JSON) | trivial    |
| Stripe internacional ativa cliente real com moeda ≠ BRL      | Junto com locale: revisar formatadores (`Intl.NumberFormat` por locale)                     | ~1h        |
| Profissional pede MDX/HTML custom em landing                 | ADR — avaliar XSS, a11y, sanitização. Default: rejeitar a favor de block builder            | bloqueante |

---

## 14. Referências

- ADR-0040 §G — fonte autoritativa fechamento i18n
- `docs/research/21-i18n-strategy.md` — pesquisa que sustenta
- `docs/blueprint/13-lint-enforcement.md §2.2` — 14 padrões ESLint
- `.claude/rules/i18n.md` — playbook executável JIT
- `.claude/rules/brand.md` — brand env vars + useBrand
- `.claude/rules/tenant-content.md` — hierarquia 4 níveis copy (este blueprint cobre níveis 1+2; tenant-content cobre 3+4)
- `lib/contracts/errors.ts` — `AppError` factory I18nMessage
- next-intl 4 App Router docs — https://next-intl.dev/docs/getting-started/app-router
- `messages/pt-BR/common.json` — keys baseline dia 0
