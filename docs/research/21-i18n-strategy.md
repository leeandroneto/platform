# 21 — i18n strategy completa pro platform/

> **Data:** 2026-05-18 · **Autor:** Claude Code (sessão dedicada i18n) · **Status:** proposta — aguarda aprovação fundador
> **Escopo:** decisão definitiva de i18n para `platform/` (greenfield). Define setup next-intl 4, estrutura `messages/`, AppError factory, multi-tenant copy override (JIT), locale switcher (JIT), SEO/SSR, PWA offline, multi-vertical terminologia.
> **Pré-requisito:** decisões 3-5 do SESSION-DUMP-2026-05-18 ("🟢 DECISÕES APROVADAS") já confirmadas. Este doc consolida + responde 10 questões + entrega ADR + plano + rule file + impact list.
> **Saída esperada:** ADR-0040 §G (i18n section) + Etapa 4 do PLANO-FECHAMENTO-DIA-0 + `.claude/rules/i18n.md` + lista de mudanças.
> **NÃO contém código pronto pra rodar** — só especificação. Implementação fica para sessão seguinte com plano aprovado.

---

## 0. TL;DR (1 página)

**Conclusão geral:** o platform/ tem stack de i18n correto (next-intl 4 instalado, lint i18n parcial, EN no DB, PT-BR na UI) mas **não está configurado**. Esta proposta fecha esse gap dia 0 com setup mínimo + memória JIT executável.

**10 decisões finais (mapeadas para as 10 questões pedidas):**

| #   | Questão                      | Decisão                                                                                                                                                                                                                                                                                                                                               |
| --- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Rota `[locale]` dia 0 vs JIT | **JIT.** Dia 0 sem rota `[locale]`. Locale resolvido server-side fixo `pt-BR` em `i18n/request.ts`. Estrutura `messages/<locale>/<namespace>/` já permite irmãos. Migrar pra `[locale]` é refator de ~2-4h (movimentar rotas, não criar abstração nova).                                                                                              |
| 2   | Messages flat vs namespace   | **Namespace por feature** (não flat). `messages/<locale>/<namespace>.json` desde dia 0. Dia 0: só `common.json`. Outros JIT quando feature pedir.                                                                                                                                                                                                     |
| 3   | Multi-vertical terminologia  | **Chaves descritivas neutras na key, copy específica no valor**. Ex.: `programs.title` no namespace `programs`. Vocab banido (`student`, `aluno`, `trainer`) já enforce ESLint — não pode aparecer nem nas chaves nem no código. Strings PT-BR fitness-shaped no valor.                                                                               |
| 4   | Tenant copy override         | **NÃO dia 0.** Custo de retrofit confirmado 2-4h (call sites continuam `t('key')` igual). Gatilho: cliente 2 com vertical diferente pede explicitamente. Schema NÃO criar.                                                                                                                                                                            |
| 5   | Multi-brand + locale default | **Locale fixo `pt-BR` dia 0**, independente da brand. Brand é dimensão ortogonal (já resolvida em `proxy.ts`). Mapeamento `brand → defaultLocale` futuro (`yoga.app → pt-BR`, `ingles.app → en-US`) entra junto com cliente real internacional. Schema `public.brands.default_locale` ADIA — adicionável via migration single-column quando precisar. |
| 6   | next-intl v4 setup           | **`i18n/request.ts` + `NextIntlClientProvider` no layout + plugin `next-intl/plugin` em `next.config.ts`**. Padrão App Router canônico do next-intl 4. Lazy-load namespaces via dynamic import dentro de `getRequestConfig` (rota tem hint via `getRequestConfig({ requestLocale })`).                                                                |
| 7   | AppError factory i18n        | **Estender pra aceitar `string \| { key, fallback, metadata? }`**. Server loga fallback EN (Sentry-friendly), client traduz key via `t()`. Não muda callsites existentes (overload).                                                                                                                                                                  |
| 8   | Locale switcher UI           | **JIT.** Sem switcher dia 0. Brand define locale default; M3+ permite override per-user (`public.users.preferred_locale`). UI component (DropdownMenu shadcn) JIT.                                                                                                                                                                                    |
| 9   | SEO/SSR multi-locale         | **`generateMetadata` lê `getTranslations({ locale })`**. Day 0 hardcoded `pt-BR`. `<html lang>` dinâmico via `useLocale()`. `hreflang` tags JIT (entra com 2º locale real).                                                                                                                                                                           |
| 10  | PWA offline messages         | **Pre-cache via Serwist** (`@serwist/next` já instalado mas defer ADR-0014). Quando PWA ativar (Sprint 14 Pacote B/C), incluir `messages/**` no precache manifest. ~30KB dia 0 cabe folgado no bundle budget.                                                                                                                                         |

**Princípio mestre:** `t('key')` desde a primeira string PT-BR. Estrutura permite expansão sem refator (mais locales = adicionar pasta irmã; namespace novo = adicionar arquivo; tenant override = adicionar resolver). Memória externa em `.claude/rules/i18n.md` para Claude executar JIT corretamente sem re-decidir.

**Custo dia 0:** ~1h (Etapa 4 do PLANO-FECHAMENTO-DIA-0). **ROI:** evita refator quando feature 1 chegar com 15 strings PT-BR.

---

## 1. Reading list executada

| Categoria       | Arquivos lidos                                                                                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Constituição    | `docs/blueprint/00-PROJETO.md` (§4 verticais agnósticas, §5 5 roles, §8 disciplina de código EN/PT, §9 brand assets zero inline)                                                                                                                                                                                                                                                                                                    |
| ADRs principais | 0008 (shadcn), 0012 (lint), 0017 (Nygard), 0021/0025/0033 (schema), 0022 (marca pai), 0023 (onboarding bio retake), 0024 (multi-brand hostname), 0026 (multi-domain), 0027/0028/0029 (tenant customization), 0031 (lint overrides), 0034 (vertical slice + entitlements), 0035 (feature gating UX), 0036 (hooks JSON), 0037 (wrapper pattern)                                                                                       |
| Blueprints      | 03 (naming + vocab + URL rewrites), 04 (camadas), 06 (data-model), 13 (lint enforcement 24 regras §2.2 i18n 14 padrões)                                                                                                                                                                                                                                                                                                             |
| Research        | 17 (guardrails IA), 18 (shadcn zone), 19 (JIT wrapper strategy — i18n decisões 3-5), 20 (JIT founder solo)                                                                                                                                                                                                                                                                                                                          |
| Plans           | `SESSION-DUMP-2026-05-18-shadcn-zone-quarantine.md` (decisões aprovadas seções 🟢), `PHASE-A-FINAL.md` (F1-F5), `PLANO-FECHAMENTO-DIA-0.md` (Etapa 4 i18n setup detalhada)                                                                                                                                                                                                                                                          |
| Rules           | `.claude/rules/naming.md` (vocab + idioma por camada), `.claude/rules/abstractions.md`, `.claude/rules/layers.md`, `.claude/rules/components.md` (wrapper pattern)                                                                                                                                                                                                                                                                  |
| Código atual    | `proxy.ts` (brand resolution headers), `app/layout.tsx` (RouteProvider + EntitlementProvider — sem NextIntlClientProvider), `lib/contracts/errors.ts` (AppError tagged variant — só aceita string), `next.config.ts` (sem plugin next-intl), `package.json` (next-intl@4.12.0 instalado, eslint-plugin-i18next@6.1.4 instalado mas NÃO ativado), `eslint.config.mjs` linhas 280-391 (8 rules `no-restricted-syntax` i18n já ativas) |
| Memória         | `MEMORY.md` (auto-memory user-level: feedback pnpm parallel add)                                                                                                                                                                                                                                                                                                                                                                    |

---

## 2. Estado atual auditado (com arquivo:linha)

### 2.1 Já implementado

- `next-intl@4.12.0` instalado (`package.json:55`) ✅
- `eslint-plugin-i18next@6.1.4` instalado (`package.json:96`) MAS NÃO ativado no `eslint.config.mjs` ⚠️
- 8 selectors `no-restricted-syntax` cobrem 8/14 padrões hardcoded (`eslint.config.mjs:354-389`)
  - `aria-label`, `placeholder`, `title`, `alt`, `toast.*`, `new Error()`, `fail()`, Zod `.message()` ✅
- `react/jsx-no-literals` ativo com allowlist técnica (`eslint.config.mjs:296-353`) ✅
- 13 termos banidos no vocab (`.claude/rules/naming.md`) cobrem `student`, `aluno`, `trainer`, etc — enforce ESLint ✅
- URL rewrites PT-BR planejados (`blueprint/03 §8`) — fitness-only (`/treinos`, `/alunos`); rotas vertical-neutral em EN puro (`/portal`, `/program`) ✅
- `scripts/i18n-audit.sh` cross-file grep documentado em `.gitignore` removido ⚠️ (arquivo deletado — `git status` mostra `D .idea/scripts/i18n-audit.sh`; o `package.json` script aponta `bash scripts/i18n-audit.sh` mas arquivo não existe em `scripts/`)
- 6 padrões i18n cobertos por `react/jsx-no-literals` + 8 selectors `no-restricted-syntax` = ~10/14 padrões do blueprint 13 §2.2 já cobertos
- `<html lang="pt-BR">` hardcoded em `app/layout.tsx:92` ✅ (válido dia 0)
- `app/(client)/portal/page.tsx` comentário literal: "Sem strings hardcoded (next-intl ainda não configurado dia 0)" — feature waiter respeita

### 2.2 Pendente (este doc fecha)

- `i18n.ts` ou `i18n/request.ts` — **não existe** ❌
- `messages/pt-BR/common.json` — **não existe** ❌
- `NextIntlClientProvider` em `app/layout.tsx` — **não wired** ❌
- Plugin `next-intl/plugin` em `next.config.ts` — **não wired** ❌
- `AppError.invalidInput()` aceita só string (`lib/contracts/errors.ts:43`) — precisa overload `{ key, fallback }` ❌
- `eslint-plugin-i18next` config flat — instalado mas **não ativado** ❌
- 4 padrões i18n restantes do blueprint 13 §2.2:
  - VariableDeclarator UI string const Literal (parcial via jsx-no-literals)
  - Metadata `export const metadata.title` Literal — não coberto
  - React Email body Literal text — não coberto
  - Web Push payload `body` Literal — não coberto
  - Error map object Literal value — não coberto

### 2.3 Estrutura `messages/` decidida (não criada)

```
messages/
└── pt-BR/
    ├── common.json    # dia 0 — actions, errors, validation comuns
    # JIT (não criar agora):
    # ├── auth.json
    # ├── billing.json
    # ├── programs.json
    # ├── push.json     # ← cobre padrão 11 (push templates)
    # └── email.json    # ← cobre padrão 12 (react-email)
```

Estrutura aceita irmãos `messages/en-US/<namespace>.json` sem refator.

---

## 3. Resposta às 10 questões

### Q1 — Rota `[locale]` dia 0 vs JIT

**Decisão:** **JIT.** Dia 0 sem rota `[locale]`.

**Razão:**

1. Dia 0 só pt-BR (constituição §2: "Mercado inicial: Brasil. Outros locales suportados no schema dia 1, ativados sob demanda real").
2. `[locale]` segmento em URL adiciona complexidade pra zero ganho funcional (1 locale só).
3. next-intl v4 suporta `getRequestConfig({ requestLocale })` server-side determinístico sem segment — locale resolvido por:
   - Dia 0: hardcoded `'pt-BR'`
   - Futuro com 2+ locales: header `Accept-Language` + cookie `NEXT_LOCALE` + (eventualmente) `[locale]` segment quando SEO exigir
4. Migração pra `[locale]` quando vier = movimentar pastas `app/` (não criar abstração nova). Custo estimado 2-4h.

**Anti-pattern evitado:** criar `app/[locale]/...` agora pra "estar pronto" = clutter de pasta sem ganho, e na hora de ativar 2º locale você descobre que precisa `localePrefix: 'as-needed'` ou `'always'` que depende de SEO strategy não decidida.

**Gatilho pra migrar:** cliente internacional confirmado + SEO multi-locale obrigatório.

### Q2 — Messages: flat vs namespace por feature

**Decisão:** **Namespace por feature** (`messages/<locale>/<namespace>.json`).

**Razão (Pesquisa 19 §Decisão 3 confirma):**

1. `next-intl` Discussion #357 e SimpleLocalize convergem: namespace escala melhor que flat pra multi-vertical/multi-feature.
2. Lazy-load por rota possível: `getTranslations('billing')` carrega só `billing.json`.
3. Translators humanos preferem arquivos menores (1 por feature) — menos merge conflict.
4. Vertical slice (ADR-0034) alinha 1:1: `features/billing/` → `messages/<locale>/billing.json`.

**Estrutura dia 0:**

```
messages/pt-BR/common.json   # actions, errors generic, validation
```

**Conteúdo `common.json` (fixture inicial):**

```json
{
  "actions": { "save": "Salvar", "cancel": "Cancelar", "confirm": "Confirmar", "close": "Fechar" },
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
```

**JIT por feature:** primeira feature que precisa de strings específicas (login → cria `auth.json`; billing → `billing.json`; programs → `programs.json`).

**Anti-pattern evitado:** flat `messages/pt-BR.json` único que cresce 50KB+ e vira merge hell.

### Q3 — Multi-vertical terminologia

**Decisão:** **Chaves descritivas e neutras na key, copy fitness-shaped no valor (dia 0).**

**Razão:**

1. Vocab banido (`student`, `aluno`, `trainer`) já enforce ESLint nos identifiers. **Não pode aparecer nem nas chaves dos messages**, nem no código. Aplicar regex i18n-audit pegando chaves com vocab banido.
2. Chaves devem refletir **conceito** (ex.: `programs.list.empty`), não vertical (ex.: NÃO usar `workouts.list.empty`).
3. Copy PT-BR no valor pode usar vocabulário fitness (ex.: "Nenhum treino criado ainda") porque dia 0 só atende `fitness_strength`. Quando segundo vertical chegar (yoga/inglês), tenant override (Q4) ou novo namespace por vertical resolve.

**Estratégia para multi-vertical futura:**

- **Opção A (preferida):** chaves neutras + tenant override (`tenant_copy_overrides` JIT). Mesmo call site `t('programs.list.empty')` retorna texto diferente por tenant.
- **Opção B:** namespace por vertical (`messages/pt-BR/programs.fitness.json` vs `programs.yoga.json`). Mais explícito, mais arquivos. Vira complexidade quando cross-vertical features aparecem.

**Decisão dia 0:** Opção A. Schema `tenant_copy_overrides` JIT (Q4).

**Exemplo concreto:**

```json
// messages/pt-BR/programs.json (dia 0 — fitness)
{
  "list": { "empty": "Nenhum treino criado ainda" },
  "create": { "title": "Novo treino" }
}
```

```sql
-- tenant_copy_overrides JIT (cliente yoga pediu)
-- tenant yoga.app override:
INSERT INTO tenant_copy_overrides (tenant_id, locale, key, value)
VALUES ('<tenant-yoga>', 'pt-BR', 'programs.list.empty', 'Nenhuma sequência criada ainda');
```

**Anti-pattern evitado:** key `workouts.title` ou `programs.title.fitness` (vertical no nome da chave) — impede reutilização e força namespacing artificial.

### Q4 — Tenant copy override timing

**Decisão:** **NÃO dia 0.** M3+ JIT.

**Razão (Pesquisa 19 §Decisão 4 confirma):**

1. Locize/SimpleLocalize/WorkOS convergem: padrão "base + tenant override" é canônico **mas adiar até cliente real pedir**.
2. Custo de retrofit confirmado: **2-4h** (não 15-20h como temia inicialmente). Call sites continuam `t('key')` idênticos — só o resolver muda.
3. Gatilho concreto: **cliente 2 com vertical diferente** pede explicitamente. Antes disso = abstração sem demanda (YAGNI Fowler).

**Esqueleto JIT (NÃO IMPLEMENTAR dia 0):**

```sql
-- Migration JIT
CREATE TABLE public.tenant_copy_overrides (
  tenant_id uuid REFERENCES public.tenants(id),
  locale text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  PRIMARY KEY (tenant_id, locale, key)
);
```

```ts
// i18n/request.ts — resolver JIT
const baseMessages = await import(`../messages/${locale}/common.json`)
const tenantOverrides = await getTenantOverrides(tenantId, locale) // null dia 0
const messages = mergeMessages(baseMessages, tenantOverrides)
```

**Não criar dia 0:** tabela, RPC, UI admin pra editar.

### Q5 — Multi-brand + locale default

**Decisão:** **Locale fixo `pt-BR` dia 0, independente da brand.** Schema `public.brands.default_locale` ADIA.

**Razão:**

1. Brand é dimensão ortogonal (resolvida em `proxy.ts` → `getRouteByHost`). Locale é outra dimensão.
2. Dia 0 só `desafit.app` existe e é PT-BR. Yoga.app e ingles.app são planejadas (constituição §2) mas **não criadas no banco** ainda.
3. Quando `ingles.app` chegar → cliente internacional → resolver locale via:
   - **Brand-default:** `public.brands.default_locale = 'en-US'` (migration single-column quando precisar)
   - **User-preferred:** `public.users.preferred_locale` (override por user logado, JIT M3+)
4. Resolver final em `getRequestConfig`:
   ```ts
   // FUTURO — não dia 0
   const userLocale = await getUserPreferredLocale()
   const brandDefault = await getBrandDefaultLocale(brandId)
   const headerHint = parseAcceptLanguage(headers)
   const locale = userLocale ?? brandDefault ?? headerHint ?? 'pt-BR'
   ```

**Dia 0:** `getRequestConfig(async () => ({ locale: 'pt-BR', messages }))`.

**Gatilho:** segunda brand operacional com locale diferente.

**Anti-pattern evitado:** criar `default_locale` column agora em todas as 25 tabelas tenant-scoped "pra estar pronto" — column nula em 100% dos casos = ruído.

### Q6 — next-intl v4 setup canônico

**Decisão:** **Padrão App Router oficial do next-intl 4** (validado contra `next-intl@4.12.0`).

**Componentes obrigatórios:**

1. **`next.config.ts` plugin** (lazy-load otimizado):

   ```ts
   import createNextIntlPlugin from 'next-intl/plugin'
   const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
   export default withNextIntl(baseConfig)
   ```

2. **`i18n/request.ts`** (server-side resolver):

   ```ts
   import { getRequestConfig } from 'next-intl/server'

   export default getRequestConfig(async () => {
     const locale = 'pt-BR' // dia 0 hardcoded
     const messages = (await import(`../messages/${locale}/common.json`)).default
     return { locale, messages }
   })
   ```

3. **`app/layout.tsx`** (wrap em `NextIntlClientProvider`):

   ```tsx
   import { NextIntlClientProvider } from 'next-intl'
   import { getLocale, getMessages } from 'next-intl/server'

   async function DynamicShell({ children }) {
     const locale = await getLocale()
     const messages = await getMessages()
     return (
       <NextIntlClientProvider locale={locale} messages={messages}>
         <RouteProvider ...>
           <EntitlementProvider ...>
             {children}
           </EntitlementProvider>
         </RouteProvider>
       </NextIntlClientProvider>
     )
   }
   ```

   `<html lang={locale}>` em vez de hardcoded `'pt-BR'`.

4. **Server components:** `import { getTranslations } from 'next-intl/server'` → `const t = await getTranslations('common')` → `t('actions.save')`.

5. **Client components:** `import { useTranslations } from 'next-intl'` → `const t = useTranslations('common')` → `t('actions.save')`.

6. **Lazy-load namespace por rota (JIT):**
   ```ts
   // i18n/request.ts — JIT quando precisar
   const namespaces = ['common'] // dia 0
   // Futuro: array dinâmico baseado em route
   const allMessages = await loadNamespaces(locale, namespaces)
   ```

**Decisão de path:** `i18n/request.ts` (não `i18n.ts` root) — convenção next-intl 4 oficial para deixar espaço pra `i18n/routing.ts` e `i18n/navigation.ts` quando rota `[locale]` chegar.

### Q7 — AppError factory i18n strategy

**Decisão:** **Estender `AppError` para aceitar `string | { key, fallback, metadata? }`** sem quebrar callsites existentes.

**Razão:**

1. `lib/contracts/errors.ts:43-82` define 11 factories (`invalidInput`, `notFound`, etc) que recebem `message: string`. ESLint regra 7 já bloqueia `throw new Error('msg')` literal — substituto canônico é `AppError.factory(...)`.
2. Sem i18n na factory, o callsite fica:
   ```ts
   // ANTI-PATTERN (atual):
   throw AppError.invalidInput('Email inválido') // PT-BR hardcoded
   ```
3. Solução: overload aceita objeto:
   ```ts
   // NOVO:
   throw AppError.invalidInput({ key: 'errors.invalid_email', fallback: 'Invalid email' })
   ```
4. **Server-side:** log usa `fallback` (EN, Sentry-friendly grouping). **Client-side:** lê `error.metadata.i18nKey`, traduz via `t(key)` no Toaster/error boundary.

**Implementação (especificação):**

```ts
export type I18nMessage =
  | string
  | { key: string; fallback: string; metadata?: Record<string, unknown> }

function normalize(msg: I18nMessage): { message: string; i18nKey?: string } {
  if (typeof msg === 'string') return { message: msg }
  return { message: msg.fallback, i18nKey: msg.key }
}

export const AppError = {
  invalidInput(msg: I18nMessage, metadata?: Record<string, unknown>): AppError {
    const { message, i18nKey } = normalize(msg)
    return new AppErrorImpl('invalid_input', message, {
      metadata: { ...metadata, i18nKey },
    })
  },
  // ... idem nos 11 factories
}
```

**Backward-compatible:** callsites antigos com string continuam funcionando. Migração para `{ key, fallback }` é gradual JIT.

**Padrão recomendado nos novos callsites:**

```ts
throw AppError.invalidInput({
  key: 'errors.invalid_email',
  fallback: 'Invalid email',
  metadata: { field: 'email' },
})
```

**Anti-pattern:** misturar i18n direto no factory chamando `t()`:

- Server-only files (`lib/data/`, `lib/domain/`) não têm acesso a `t()` (escopo client/server-RSC, não server-pure).
- Factory deve ser sync e pura.

### Q8 — Locale switcher UI

**Decisão:** **JIT.** Sem switcher dia 0.

**Razão:**

1. Dia 0 só `pt-BR` existe. Switcher de 1 locale = botão inútil.
2. Quando 2º locale ativar:
   - **Brand-driven:** `ingles.app` → default `en-US`. Sem switcher (locale segue domain).
   - **User-driven (cross-brand):** `desafit.app` com cliente que prefere `en-US`. UI switcher no header/perfil.
3. Implementação JIT (quando vier):
   - Componente `<LocaleSwitcher>` em `components/app-locale-switcher.tsx`
   - shadcn `DropdownMenu` + `Select` primitive
   - Setting via cookie `NEXT_LOCALE` (next-intl reads from cookie by default)
   - Hook `useLocale()` + `useRouter()` pra redirect com novo locale

**Gatilho:** 2º locale ativo no banco (`brands.default_locale` distinto OU `users.preferred_locale` populated).

**Onde vive:** `components/app-locale-switcher.tsx` (wrapper com valor agregado = i18n integration).

### Q9 — SEO / SSR multi-locale

**Decisão dia 0:** **`<html lang>` dinâmico via `useLocale()` + `generateMetadata` lê translations.**

**Razão:**

1. `app/layout.tsx:92` atualmente `<html lang="pt-BR">` hardcoded. Trocar pra:
   ```tsx
   const locale = await getLocale()
   return <html lang={locale}>...</html>
   ```
2. `generateMetadata` deve usar translations:
   ```tsx
   export async function generateMetadata({ params }) {
     const t = await getTranslations('seo')
     return {
       title: t('home.title'),
       description: t('home.description'),
     }
   }
   ```
3. **`hreflang` tags JIT:** entram quando 2º locale ativar. Sem isso, Google indexa só PT-BR (correto dia 0).
4. **OpenGraph locale tags:** `og:locale = 'pt_BR'` derivado do locale.

**Estrutura JIT pra 2º locale:**

```tsx
// FUTURO — alternateLanguages no metadata
return {
  alternates: {
    languages: {
      'pt-BR': 'https://desafit.app/',
      'en-US': 'https://desafit.app/en/',
    },
  },
}
```

**Anti-pattern evitado:** criar `app/[locale]/sitemap.ts` agora "pra SEO multi-locale futuro" — sitemap dia 0 é PT-BR único.

### Q10 — PWA offline messages

**Decisão:** **Pre-cache `messages/**` via Serwist quando PWA ativar (Sprint 14 Pacote B/C, ADR-0014).\*\*

**Razão:**

1. `@serwist/next` instalado mas `next.config.ts` mantém `withSerwist` comentado (defer JIT — `next.config.ts:36-49`).
2. Quando ativar Serwist:
   - Adicionar `messages/**/*.json` ao precache manifest do `app/sw.ts`
   - Dia 0 ~30KB (1 namespace `common.json`); crescimento estimado: ~5KB por namespace; 10 namespaces × 1 locale ≈ 50KB total
   - Bundle budget PWA shell = 240KB total JS — messages são static JSON fora do JS bundle, fora dessa medida
3. Lazy-load namespace por rota (Q6) **NÃO conflita** com pre-cache — Serwist serve JSON do cache, `dynamic import` pega de lá.
4. Offline gap: se cliente abre PWA offline antes de primeira sync, `messages` não estão cacheadas — fallback é mostrar keys raw (ex.: `programs.list.empty`). Aceitável pra primeira-abertura-offline (caso degenerado raro).

**Gatilho:** Sprint 14 — primeiro upgrade A→B precisa PWA real.

**Especificação Serwist runtime caching:**

```ts
// app/sw.ts — quando ativar PWA
import { defaultCache } from '@serwist/next/worker'
import { Serwist } from 'serwist'

const serwist = new Serwist({
  precacheEntries: [
    ...self.__SW_MANIFEST,
    // messages/** entram automaticamente via @serwist/next include glob
  ],
  runtimeCaching: defaultCache,
})
```

`@serwist/next` por padrão inclui static assets — `messages/**/*.json` se importados via `import()` viram chunks do Next build e entram no precache automático.

---

## 4. ADR-0040 §G — Seção i18n (Michael Nygard)

> **Esta é a seção §G de uma ADR maior (ADR-0040) que consolida fechamento dia 0 — shadcn zone quarantine + i18n + APCA + wrappers + typography.** Documentada aqui em formato completo Nygard para extração.

### Context

Day 0 do platform/ tem `next-intl@4.12.0` instalado mas zero config. ESLint cobre 10/14 padrões i18n hardcoded. Convenção decidida (`blueprint/03 §1`): EN no DB/code, PT-BR na URL pública via rewrites, PT-BR na UI via `t()`. Pesquisa 19 confirmou estratégia `t('key')` desde primeira string mesmo com 1 locale só. Decisões 3-5 do SESSION-DUMP-2026-05-18 aprovaram:

- Namespace por feature (não flat)
- Locales adicionais JIT (não dia 0)
- Tenant copy override JIT (não dia 0)

Falta operacionalizar: setup next-intl + estrutura `messages/` + extension `AppError` + lint completude (4 padrões restantes) + memória executável JIT (`.claude/rules/i18n.md`).

### Decision

**Adotar setup next-intl 4 canônico server-driven (sem rota `[locale]` dia 0):**

1. **Setup files dia 0:**
   - `i18n/request.ts` — `getRequestConfig` retorna `{ locale: 'pt-BR', messages }`
   - `messages/pt-BR/common.json` — actions/errors/validation comuns
   - Plugin `createNextIntlPlugin('./i18n/request.ts')` em `next.config.ts`
   - `NextIntlClientProvider` em `app/layout.tsx` (dentro `<RouteProvider>`)

2. **Namespace por feature** (`messages/<locale>/<namespace>.json`):
   - Dia 0: `common.json`
   - JIT: `auth.json`, `billing.json`, `programs.json`, `push.json`, `email.json`

3. **Chaves descritivas neutras** — vocab banido aplica também nas chaves. Multi-vertical resolvido via tenant override JIT (não namespace-per-vertical).

4. **AppError factory estendido** — aceita `string | { key, fallback, metadata? }`. Server loga fallback EN; client traduz key via `t()`.

5. **Locale resolution dia 0** — hardcoded `'pt-BR'` em `i18n/request.ts`. Futuro: header `Accept-Language` + cookie `NEXT_LOCALE` + `brands.default_locale` + `users.preferred_locale`.

6. **`<html lang>` dinâmico** — `await getLocale()` em vez de literal.

7. **`generateMetadata` usa translations** — `getTranslations('seo')`.

8. **ESLint i18n completude:** ativar `eslint-plugin-i18next` flat recommended + 4 selectors `no-restricted-syntax` faltantes (metadata.title, react-email Text, push body, error map values). Total: 14/14 padrões cobertos.

9. **`.claude/rules/i18n.md`** — playbook executável JIT com 6 gatilhos (primeira string, novo namespace, AppError com i18n, locale switcher, segundo locale, tenant override).

10. **Defer JIT explícito:** rota `[locale]`, locale switcher UI, tenant_copy_overrides table, locales adicionais (en-US/pt-PT/es-ES), hreflang tags, sitemap multi-locale, PWA precache messages.

### Consequences

**Positivo:**

- `t('key')` enforce zero hardcoded — lint trava merge.
- Estrutura `messages/<locale>/<namespace>.json` aceita expansão de locales (irmãos) e features (novos arquivos) sem refator.
- AppError i18n-aware backward-compatible — callsites antigos seguem; novos usam `{ key, fallback }`.
- Memória externa em `.claude/rules/i18n.md` evita Claude re-decidir estrutura em cada feature.
- Custo dia 0 ~1h (PLANO-FECHAMENTO Etapa 4 já especifica).

**Negativo:**

- Dia 0 já carrega `next-intl` overhead mesmo com 1 locale (mitigação: bundle ~3KB gzipped, negligenciável).
- Lazy-load namespace exige convenção disciplinada (Claude pode esquecer e importar tudo — `.claude/rules/i18n.md` mitiga).
- AppError overload adiciona type complexity (`I18nMessage` union) — TypeScript guarda.

**Neutro:**

- 4 namespaces JIT (`auth`, `billing`, `programs`, `push`/`email`) criam expectativa de pasta `messages/pt-BR/` poluída — convenção é OK porque cada arquivo cresce 1-3KB.
- Tenant override JIT obriga manter migration template no backlog (`.claude/rules/i18n.md` aponta).
- Locale switcher JIT: `<LocaleSwitcher>` virá quando 2º locale ativar. Sem dívida técnica.

### References

- Constituição §2 (mercado inicial Brasil, outros locales sob demanda)
- Blueprint 03 §1 (idioma por camada) e §9 (14 padrões i18n hardcoded — D-G66)
- Blueprint 13 §2.2 (14 padrões i18n ESLint)
- ADR-0034 (vertical slice — alinha 1:1 com namespace per feature)
- Research 19 §Decisões 3-5 (i18n namespace + locales JIT + tenant override JIT)
- next-intl v4 docs: App Router setup
- SESSION-DUMP-2026-05-18 itens 3-5 aprovados

---

## 5. Plano de execução (4 fases)

Reaproveita Etapa 4 do `PLANO-FECHAMENTO-DIA-0.md` e detalha sub-passos.

### Fase A — Setup files (criar)

Tempo: ~30min · Sequência: 1 → 2 → 3 → 4 → 5

1. **Criar `messages/pt-BR/common.json`** com fixture (§3 Q2 acima).
2. **Criar `i18n/request.ts`:**

   ```ts
   import { getRequestConfig } from 'next-intl/server'

   export default getRequestConfig(async () => {
     const locale = 'pt-BR'
     const messages = {
       ...(await import(`../messages/${locale}/common.json`)).default,
     }
     return { locale, messages }
   })
   ```

3. **Atualizar `next.config.ts`:** envolver `baseConfig` em `withNextIntl(baseConfig)`:
   ```ts
   import createNextIntlPlugin from 'next-intl/plugin'
   const withNextIntl = createNextIntlPlugin('./i18n/request.ts')
   // ... baseConfig
   export default withNextIntl(baseConfig)
   ```
4. **Atualizar `app/layout.tsx`:**
   - Importar `NextIntlClientProvider` + `getLocale` + `getMessages`
   - `<html lang={locale}>` dinâmico (locale via `await getLocale()` em layout async — Next 16 RSC permite)
   - Wrap `<RouteProvider>` em `<NextIntlClientProvider locale messages>`
   - `generateMetadata` continua sem translations dia 0 (defer pra primeira feature com SEO real)
5. **Smoke test:** rodar `pnpm dev`, abrir `localhost:3000`, verificar console sem warnings `NextIntlClientProvider`.

### Fase B — Estender `AppError` factory

Tempo: ~20min · Sequência: 1 → 2 → 3

1. **Atualizar `lib/contracts/errors.ts`:**
   - Adicionar `export type I18nMessage = string | { key: string; fallback: string; metadata?: Record<string, unknown> }`
   - Helper privado `normalize(msg: I18nMessage)` retorna `{ message, i18nKey }`
   - Refactor 11 factories pra aceitar `I18nMessage` no parâmetro de mensagem (não muda assinatura — string ainda funciona)
   - `metadata.i18nKey` populated quando key fornecida
2. **Smoke test:** Vitest existente em `tests/smoke.test.ts` continua passando (back-compat).
3. **Adicionar 1 teste novo:**
   ```ts
   test('AppError.invalidInput aceita { key, fallback }', () => {
     const err = AppError.invalidInput({ key: 'errors.invalid_email', fallback: 'Invalid email' })
     expect(err.message).toBe('Invalid email')
     expect(err.metadata?.i18nKey).toBe('errors.invalid_email')
   })
   ```

### Fase C — Completude ESLint i18n (4 padrões faltantes)

Tempo: ~30min · Sequência: 1 → 2 → 3

1. **Ativar `eslint-plugin-i18next` flat recommended** em `eslint.config.mjs`:

   ```js
   import i18next from 'eslint-plugin-i18next'
   // ...
   i18next.configs['flat/recommended'],
   ```

   - Override em `components/ui/**` desliga (zona quarentenada shadcn — já planejado em SESSION-DUMP item 1)

2. **Adicionar 4 selectors `no-restricted-syntax`:**
   - Metadata `export const metadata = { title: 'literal' }` (padrão 5 do blueprint 13 §2.2)
   - React Email body `<Text>Olá</Text>` (padrão 10)
   - Web Push `body: 'literal'` (padrão 13)
   - Error map object values `{ not_found: 'Não achei' }` (padrão 14)
3. **Smoke test:** `pnpm lint` em `app/page.tsx` (vazio dia 0) deve passar; criar fixture `tests/lint-i18n-fixtures.tsx` com 4 violações intencionais (gitignored) só pra validar regras.

### Fase D — Memória executável + docs

Tempo: ~30min · Sequência: 1 → 2 → 3 → 4

1. **Criar `.claude/rules/i18n.md`** (conteúdo completo na §6 abaixo).
2. **Atualizar `CLAUDE.md`** — adicionar linha em "Onde fica cada coisa":
   ```
   | i18n playbook | `.claude/rules/i18n.md` |
   ```
3. **Atualizar `CHANGELOG.md`** entry `[Unreleased]` → `Added`:
   - `i18n setup dia 0 — next-intl 4 + namespace por feature + AppError.factory i18n-aware (ADR-0040 §G)`
4. **Atualizar `docs/blueprint/13-lint-enforcement.md §2.2`** marcando 14/14 padrões i18n implementados.

**Total Fase A+B+C+D:** ~2h. Cabe na Etapa 4 do PLANO-FECHAMENTO-DIA-0 (~1h originalmente estimado, com folga).

---

## 6. `.claude/rules/i18n.md` — conteúdo completo

```markdown
---
name: i18n — next-intl namespace por feature
description: Antes de escrever string PT-BR, criar namespace, ou usar AppError com mensagem, consultar setup + estrutura messages/ + AppError pattern.
paths:
  - 'app/**/*.{ts,tsx}'
  - 'components/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
  - 'lib/contracts/errors.ts'
  - 'lib/data/**/*.ts'
  - 'lib/domain/**/*.ts'
  - 'messages/**/*.json'
  - 'next.config.ts'
  - 'i18n/**/*.ts'
---

## Setup canônico (já wired dia 0 — ADR-0040 §G)

- `i18n/request.ts` — `getRequestConfig(() => ({ locale: 'pt-BR', messages }))`
- `messages/<locale>/<namespace>.json` — namespace por feature
- `NextIntlClientProvider` em `app/layout.tsx` envolvendo `<RouteProvider>`
- Plugin `next-intl/plugin` em `next.config.ts`

**Locale dia 0:** hardcoded `pt-BR`. Multi-locale JIT (gatilho: cliente internacional).

---

## Estrutura `messages/`
```

messages/
└── pt-BR/
├── common.json # actions/errors/validation comuns
└── <namespace>.json # JIT por feature (auth, billing, programs, push, email, ...)

````

**Convenção de chaves:**

- Hierárquica: `<namespace>.<category>.<key>` (ex.: `common.actions.save`, `auth.signup.title`)
- Chaves **neutras** sobre vertical — vocab banido aplica nas chaves também
- Copy PT-BR no valor (vertical-shaped OK; tenant override JIT cobre cross-vertical)

---

## Quando criar namespace novo

**Gatilho:** primeira string em feature que não cabe em `common.json`.

**Passos:**

1. Identificar feature: `features/<name>/` ou rota `app/<group>/<route>/`
2. Criar `messages/pt-BR/<name>.json` (mesmo nome da feature folder)
3. Importar no callsite:
   ```ts
   // Server Component:
   import { getTranslations } from 'next-intl/server'
   const t = await getTranslations('<name>')

   // Client Component:
   'use client'
   import { useTranslations } from 'next-intl'
   const t = useTranslations('<name>')
````

4. Se for namespace lazy-loadable: estender `i18n/request.ts` pra incluir baseado em route (otimização — JIT quando bundle grow virar problema).

**Anti-pattern:** criar namespace genérico (`misc.json`, `ui.json`) — quebra organização por feature.

---

## Strings em JSX e atributos

ESLint enforce: zero hardcoded em produção.

| Caso                   | ❌ Anti-pattern                            | ✅ Correto                                                    |
| ---------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| JSX text               | `<h1>Início</h1>`                          | `<h1>{t('home.title')}</h1>`                                  |
| `aria-label`           | `<button aria-label="Fechar">`             | `<button aria-label={t('common.actions.close')}>`             |
| `placeholder`          | `<input placeholder="Email">`              | `<input placeholder={t('auth.email')}>`                       |
| `title` / `alt`        | `<img alt="Logo">`                         | `<img alt={t('common.brand.logo')}>`                          |
| `toast.*`              | `toast.success('Salvo')`                   | `toast.success(t('common.actions.saved'))`                    |
| Metadata SEO           | `export const metadata = { title: 'foo' }` | `generateMetadata(): { title: await t('seo.<route>.title') }` |
| Push payload           | `{ body: 'Hora do treino' }`               | `{ body: t('push.<event>') }`                                 |
| React Email text       | `<Text>Olá</Text>`                         | `<Text>{t('email.greeting')}</Text>`                          |
| Error map object value | `{ not_found: 'Não achei' }`               | `{ not_found: t('common.errors.not_found') }`                 |
| Wrapper i18nKey prop   | `<AppButton>Salvar</AppButton>`            | `<AppButton i18nKey="common.actions.save" />`                 |

---

## AppError com i18n

ESLint regra 7 bloqueia `throw new Error('msg')`. Use factory:

```ts
// ❌ ANTI-PATTERN
throw new Error('Email inválido')

// ❌ ANTI-PATTERN (mensagem hardcoded PT-BR)
throw AppError.invalidInput('Email inválido')

// ✅ CORRETO (i18n key + fallback)
throw AppError.invalidInput({
  key: 'common.errors.invalid_email',
  fallback: 'Invalid email',
  metadata: { field: 'email' },
})
```

**Onde o fallback aparece:**

- Server logs (Sentry, console.error) — fallback EN é Sentry-friendly grouping
- Client error boundary / Toaster lê `error.metadata.i18nKey` e traduz com `t(key)`

**Migrando callsite legacy:**

```ts
// ANTES
throw AppError.invalidInput('Email inválido')

// DEPOIS
throw AppError.invalidInput({ key: 'common.errors.invalid_email', fallback: 'Invalid email' })
```

Server-only files (`lib/data/`, `lib/domain/`) **NUNCA** importam `getTranslations` — factories são síncronas e puras.

---

## Zod validation messages

ESLint regra 11 bloqueia `.message('texto')`. Use factory pattern no callsite:

```ts
// ✅ CORRETO — factory recebe t() do call site, schema fica i18n-aware
import { z } from 'zod'
import { useTranslations } from 'next-intl'

export function emailSchema(t: ReturnType<typeof useTranslations>) {
  return z.string().email(t('common.validation.invalid_email'))
}

// Componente:
const t = useTranslations()
const schema = emailSchema(t)
```

**Alternativa global (z.setErrorMap):** definir no `app/layout.tsx` ou `i18n/zod-error-map.ts`. Decidir JIT quando segunda validação repetida aparecer.

---

## Wrapper `<AppButton>` com i18nKey

Pattern já documentado em `.claude/rules/shadcn-zone.md` + ADR-0040:

```tsx
<AppButton i18nKey="common.actions.save" />
<AppButton i18nKey="programs.create.cta" loading={isSaving} />
```

Wrapper internamente chama `useTranslations()` → `t(i18nKey, i18nValues)`. Children continuam funcionando pra casos `<AppButton><Icon /> Custom</AppButton>` (composição inline).

---

## Multi-vertical terminologia

- **Chaves:** neutras (`programs.list.empty`, NÃO `workouts.list.empty`)
- **Valores:** PT-BR fitness-shaped dia 0 (vertical_strength único ativo)
- **Cross-vertical:** tenant copy override JIT (gatilho: cliente 2 com vertical diferente)

---

## Locales adicionais (en-US, pt-PT, es-ES)

**Status:** NÃO dia 0. Gatilho: cliente internacional confirmado.

**Passos JIT (memória pra quando vier):**

1. Criar `messages/<locale>/<namespace>.json` espelhando estrutura pt-BR
2. Tradução via tool (não Google Translate inline — usar pro tradutor ou Translation Memory)
3. Adicionar à lista no `i18n/request.ts` (resolver determinístico)
4. Adicionar `brands.default_locale` column (migration single-column)
5. Adicionar `<LocaleSwitcher>` quando cross-brand user override necessário
6. Adicionar `hreflang` tags em `generateMetadata`

**Resolver order (futuro):**

```
user.preferred_locale → brand.default_locale → Accept-Language → 'pt-BR'
```

---

## Tenant copy override

**Status:** NÃO dia 0. Gatilho: cliente 2 com vertical diferente.

**Custo retrofit confirmado:** 2-4h. Call sites continuam `t('key')` idênticos.

**Esqueleto migration (NÃO criar dia 0):**

```sql
CREATE TABLE public.tenant_copy_overrides (
  tenant_id uuid REFERENCES public.tenants(id),
  locale text NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  PRIMARY KEY (tenant_id, locale, key)
);
```

**Resolver futuro em `i18n/request.ts`:**

```ts
const baseMessages = await loadBase(locale)
const tenantOverrides = await getTenantOverrides(tenantId, locale)
const messages = deepMerge(baseMessages, tenantOverrides)
```

---

## Rota `[locale]`

**Status:** NÃO dia 0. Gatilho: SEO multi-locale obrigatório OU 2+ locales ativos com user-driven switching.

**Custo retrofit:** 2-4h (movimentar pastas `app/<group>/` → `app/[locale]/<group>/`). Sem abstração nova.

---

## PWA offline messages

**Status:** vinculado a Serwist (ADR-0014, defer Sprint 14 Pacote B/C).

**Quando ativar:** `messages/**/*.json` entram no precache automaticamente via `@serwist/next` default cache strategy. ~30KB dia 0 cabe folgado.

---

## SEO multi-locale

**Day 0:** `generateMetadata` usa translations (`getTranslations('seo')`). `<html lang={locale}>` dinâmico.

**Hreflang tags JIT:** quando 2º locale ativar.

```tsx
// FUTURO
return {
  alternates: {
    languages: {
      'pt-BR': 'https://desafit.app/',
      'en-US': 'https://desafit.app/en/',
    },
  },
}
```

---

## Anti-patterns explícitos

1. **String hardcoded em JSX** → ESLint trava merge
2. **String passada por prop em wrapper** (`<AppButton>Salvar</AppButton>`) → use `i18nKey`
3. **Chave com vertical** (`workouts.title`, `programs.title.fitness`) → use neutra (`programs.title`)
4. **Namespace genérico** (`misc.json`, `ui.json`) → use namespace por feature
5. **`getTranslations` em `lib/data/` ou `lib/domain/`** → factories são puras; passe `t` como dependência do callsite
6. **`tenant_copy_overrides` table dia 0** → JIT M3+
7. **Rota `[locale]` dia 0** → JIT
8. **Locale switcher dia 0** → JIT
9. **Mock translations em tests** → testes usam keys raw (vitest sem provider — keys aparecem; OK)

---

## Referências

- ADR-0040 §G — i18n strategy
- Research 21 — i18n strategy completa
- Research 19 — JIT vs upfront (decisões 3-5)
- Blueprint 03 §1, §9 — idioma por camada + 14 padrões hardcoded
- Blueprint 13 §2.2 — 14 padrões ESLint
- next-intl v4 docs — App Router setup
- `lib/contracts/errors.ts` — AppError factory (overload `I18nMessage`)

```

---

## 7. Lista de mudanças impactadas em arquivos existentes

### Criar (não existem)

| Path                              | Conteúdo                                                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `i18n/request.ts`                 | `getRequestConfig` retorna `{ locale: 'pt-BR', messages }`                                                     |
| `messages/pt-BR/common.json`      | Fixture: `actions`, `errors`, `validation` namespaces                                                          |
| `.claude/rules/i18n.md`           | Playbook completo (conteúdo da §6 acima)                                                                       |
| `docs/adr/0040-fechamento-dia-0-shadcn-zone-quarantine.md` | ADR consolidada (§G é a seção i18n; §A-F/H-L cobrem shadcn zone + APCA + wrappers + typography) |

### Atualizar (existem, mudança incremental)

| Path                             | Mudança                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `next.config.ts`                 | Envolver `baseConfig` em `withNextIntl(baseConfig)` (import `createNextIntlPlugin`)                                                                    |
| `app/layout.tsx`                 | Import `NextIntlClientProvider` + `getLocale` + `getMessages`; `<html lang={locale}>` dinâmico; wrap `RouteProvider` em `NextIntlClientProvider`        |
| `lib/contracts/errors.ts`        | Tipo `I18nMessage` + helper `normalize`; refactor 11 factories pra aceitar `I18nMessage` (back-compat com string); `metadata.i18nKey` populated        |
| `eslint.config.mjs`              | Ativar `i18next.configs['flat/recommended']`; adicionar 4 selectors `no-restricted-syntax` faltantes (metadata.title, react-email Text, push.body, error-map value); override em `components/ui/**` desliga (alinha com SESSION-DUMP item 1 — zona quarentenada) |
| `CLAUDE.md`                      | Linha "Onde fica cada coisa" → adicionar `.claude/rules/i18n.md`                                                                                       |
| `CHANGELOG.md`                   | Entry `[Unreleased] / Added`: "i18n setup dia 0 — next-intl 4 + namespace por feature + AppError.factory i18n-aware (ADR-0040 §G)"                     |
| `docs/blueprint/13-lint-enforcement.md` | §2.2: marcar 14/14 padrões implementados (era ~10/14)                                                                                          |
| `docs/blueprint/03-naming-vocab.md` | §9 (strings UI): atualizar referência de `.claude/rules/i18n.md` (já cita, validar)                                                                |
| `docs/plans/SESSION-DUMP-2026-05-18-shadcn-zone-quarantine.md` | Seção "🟢 DECISÕES APROVADAS" → adicionar itens 13-22 (10 decisões i18n)                                                |
| `package.json`                   | Script `i18n:audit` — verificar se arquivo `scripts/i18n-audit.sh` existe (git status mostra deletado em `.idea/scripts/` — criar em `scripts/` se faltar) |
| `tests/smoke.test.ts`            | Adicionar 1 teste novo: `AppError.invalidInput` com `{ key, fallback }` popula `metadata.i18nKey`                                                      |

### NÃO criar (defer JIT)

| Item                                          | Gatilho JIT                                            |
| --------------------------------------------- | ------------------------------------------------------ |
| `messages/en-US/`, `messages/pt-PT/`, `messages/es-ES/` | Cliente internacional confirmado                |
| `messages/pt-BR/auth.json`, `billing.json`, `programs.json`, `push.json`, `email.json` | Primeira feature que precisar |
| `i18n/routing.ts`, `i18n/navigation.ts`       | Migração pra rota `[locale]`                           |
| `app/[locale]/...`                            | SEO multi-locale obrigatório OU 2+ locales user-switch |
| `components/app-locale-switcher.tsx`          | 2º locale ativo com cross-brand user override          |
| `public.tenant_copy_overrides` table          | Cliente 2 com vertical diferente pede                  |
| `public.brands.default_locale` column         | 2ª brand operacional com locale diferente              |
| `public.users.preferred_locale` column        | Cross-brand user pede override                         |
| `app/sw.ts` (Serwist) — messages precache     | Sprint 14 Pacote B/C (ADR-0014)                        |
| `hreflang` tags + `alternates.languages`      | 2º locale ativo                                        |
| `app/sitemap.ts` multi-locale                 | 2º locale ativo + SEO importa                          |

---

## 8. JIT playbooks (resumo dos gatilhos)

Memória externa para Claude executar quando gatilho disparar:

| Trigger                                              | Ação                                                                                                                                                                  | Tempo  |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Primeira string PT-BR em feature                     | Criar `messages/pt-BR/<feature>.json`; usar `useTranslations('<feature>')` ou `getTranslations('<feature>')`                                                          | 5min   |
| AppError com mensagem traduzível                     | Usar `AppError.factory({ key, fallback, metadata })`; passar `fallback` EN para Sentry                                                                                | 2min   |
| Cliente internacional confirmado                     | Criar `messages/<locale>/common.json` espelho; estender `i18n/request.ts`; (opcional) `brands.default_locale` migration                                               | 1-2h   |
| 2º locale ativo cross-brand                          | Criar `components/app-locale-switcher.tsx` (DropdownMenu + cookie `NEXT_LOCALE`); `users.preferred_locale` column                                                     | 1h     |
| Cliente 2 com vertical diferente                     | Migration `tenant_copy_overrides`; resolver merge em `i18n/request.ts`; UI admin pra editar copy (M3 feature)                                                         | 2-4h   |
| SEO multi-locale obrigatório                         | Migrar `app/<group>/` → `app/[locale]/<group>/`; `i18n/routing.ts` + `i18n/navigation.ts`; `hreflang` tags em `generateMetadata`                                      | 2-4h   |
| PWA ativar (Sprint 14 Pacote B/C)                    | Confirmar Serwist precache inclui `messages/**/*.json` (default cache strategy já cobre); smoke offline em iPhone 14                                                  | 30min  |

---

## 9. Riscos e questões abertas

### Risco 1: next-intl 4 lazy-load com Turbopack

Next 16 usa Turbopack default. `dynamic import` de `messages/<locale>/<namespace>.json` precisa estar compatível. **Mitigação:** spec já usa `await import(...)` que Turbopack suporta nativamente. Smoke test em `pnpm dev` valida.

### Risco 2: `getRequestConfig` execution context

Em rotas com `cacheComponents: true` (`next.config.ts:8`), `getRequestConfig` roda em request scope. **Validação:** Next 16 + next-intl 4 docs confirmam compat. Smoke test obrigatório.

### Risco 3: Vitest sem `NextIntlClientProvider`

Tests existentes (`tests/smoke.test.ts`) podem precisar wrap em provider quando começar a testar componentes que usam `useTranslations`. **Mitigação:** dia 0 sem componentes assim (5 wrappers + 5 typography são spec, não impl). JIT quando primeira feature com `t()` for testada.

### Risco 4: ESLint `i18next/no-literal-string` muito agressivo

Plugin pode pegar strings técnicas legítimas (símbolos, units, IDs). **Mitigação:** `allowedStrings` em `react/jsx-no-literals` já tem 30+ entries (§eslint.config.mjs:302-351). Configurar plugin `i18next` com mesma allowlist.

### Questão aberta 1: AppError factory + Zod messages

Spec sugere passar `t` como dependency injection no callsite (factory pattern). Pesquisa 19 §Decisão 3 menciona `z.setErrorMap` global. **Pergunta:** decidir agora ou JIT quando primeira validação repetida aparecer?

**Recomendação:** decidir agora pra evitar mix de padrões. **Opção A:** factory pattern por schema (`emailSchema(t)`). **Opção B:** `z.setErrorMap` global no `app/layout.tsx`. Opção B é menos código mas global; Opção A é local mas exige passar `t` em cada validation. **Default sugerido: Opção A** (alinhada com princípio "sem global hidden state").

### Questão aberta 2: `<html lang>` em layout async

Next 16 + RSC permite layout async mas `<html>` é static-shape. **Recomendação:** locale via `await getLocale()` no async DynamicShell e passar via prop pra layout sync ou render `<html lang>` no DynamicShell async (Next 16 permite — confirmar com docs antes de implementar).

### Questão aberta 3: Scripts `i18n-audit.sh` deletado

`git status` mostra `D .idea/scripts/i18n-audit.sh`. `package.json:18` script aponta `bash scripts/i18n-audit.sh` — arquivo não existe em `scripts/`. **Decisão:** recriar em `scripts/` como parte da Fase D (ou marcar como removido até Fase C ESLint cobrir tudo + remover script grep como camada redundante).

---

## 10. Status / próximos passos

1. **Fundador revisa este doc** — 1-página chat summary entregue separado
2. **Aprovação ou ajustes** — questões abertas (§9) e decisões 1-10 (§3)
3. **Sessão seguinte executa Fases A-D** — ~2h total, conforme §5
4. **Commit local sem push** — alinha com estado atual (build vermelho intencional até Research 18 fallout pousar)
5. **Atualizar SESSION-DUMP** — itens 13-22 (10 decisões i18n) na seção "🟢 DECISÕES APROVADAS"

---

## Histórico

| Data       | Mudança                                                                                                                       | Aprovador |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------- | --------- |
| 2026-05-18 | Versão inicial — 10 questões respondidas, ADR-0040 §G especificada, `.claude/rules/i18n.md` desenhado, impact list consolidado | (pending) |
```
