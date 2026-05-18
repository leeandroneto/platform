# Claude — contexto do projeto

> Carregado no início de toda sessão. **Mantenha curto e atualizado.**
> Última atualização: 2026-05-18 (ADR-0038 Storybook + ADR-0039 Makerkit RPCs — fechamento dia 0)

---

## Projeto

SaaS B2B white-label PWA **multi-marca multi-vertical**. Profissionais de
diferentes verticais (fitness, yoga, idiomas) criam, vendem e operam
programas e desafios online com suporte de IA.

**Arquitetura:** 1 código + 1 deploy + N marcas filhas via hostname
(ADR-0024). Brand resolvida em runtime via `platform.brands` lookup,
não env. Adicionar marca filha = INSERT + DNS, zero refactor.

**Marca filha dia 1:** `desafit.app` (fitness).
**Marcas planejadas:** `yoga.app`, `ingles.app`.
**Marca pai (holding):** identidade comercial só (footer, legal); zero tech (ADR-0022).

Identidade completa, decisões, modelo: `docs/blueprint/00-PROJETO.md`.

---

## Onde fica cada coisa

| Info                            | Arquivo canônico                   |
| ------------------------------- | ---------------------------------- |
| Regras code carregadas por path | `.claude/rules/*.md` (15 rules)    |
| Constituição imutável           | `docs/blueprint/00-PROJETO.md`     |
| Decisões fechadas (ADRs)        | `docs/adr/NNNN-*.md`               |
| Blueprints técnicos             | `docs/blueprint/NN-*.md`           |
| Plano ativo                     | `docs/plans/PLANO-MESTRE-DIA-0.md` |
| Histórico arquivado             | `docs/_archive/` (referência JIT)  |

`.claude/rules/*.md` (carregamento por path glob):

- `naming` · `abstractions` · `layers` · `data-layer` · `domain-logic` · `server-actions` · `features` · `jwt-claims` · `components`
- **i18n** · **contrast** · **shadcn-zone** · **design-tokens** · **brand** · **entitlements** (ADR-0040 §L — cada um tem "Condição de revisitar")
- **tenant-content** (hierarquia 4 níveis copy/landing — decisão dia 0: template+slots, não block builder)
- **design-references** (71 DESIGN.md em `docs/references/design-systems/` — APENAS mood/hierarquia/density, NUNCA tokens literais)

Conflito entre docs: ADR > Blueprint > Master Plan (arquivado) > Memória.

---

## Stack travado (não bumpar major sem ADR)

Next 16 (App Router, Turbopack, `proxy.ts`) · React 19 · Tailwind v4
(`@theme` OKLCH) · shadcn new-york dark-first · Motion 12 (`motion/react`,
NUNCA `framer-motion`) · Supabase `@supabase/ssr` 0.10 · Zod 4 + RHF 7 ·
next-intl 4 · pnpm 10 · Geist · Vitest · Playwright · Storybook 10
(`@storybook/nextjs-vite`, ADR-0038 supersede Ladle) · Serwist (`@serwist/turbopack`, ADR-0014).

---

## Schema único (ADR-0033 — superseded ADR-0025)

- `public.*` — tudo do produto (37 tabelas dia 0). RLS é a fronteira de segurança, não schema
- `auth.*`, `storage.*`, `realtime.*` — Supabase managed (não tocar)

Em data layer: `client.from('programs')`. Sem `.schema()` qualifier.
Detalhes: ADR-0033.

---

## Multi-marca via hostname (ADR-0024)

NUNCA hardcoded `desafit`/`yoga.app`/`ingles.app` no código. Brand vem do hostname:

```ts
// proxy.ts (Next 16)
import { getBrandByHost } from '@/lib/brand/getBrandByHost'
const brand = await getBrandByHost(req.headers.get('host'))
// brand: { id, name, host, primary_color_oklch, logo_url, default_vertical }
```

Em componentes RSC + Client:

```tsx
import { useBrand } from '@/lib/route/RouteProvider'
const brand = useBrand()
return <h1>{brand.name}</h1> // ou <Logo /> wordmark dinâmico
```

Verticalização via `public.tenants.vertical` + `component.kind` polimórfico

- JSONB internal keys. Mesmo schema serve todas marcas filhas.

---

## Camadas (resumo)

`lib/contracts/` SSOT Zod + Result + AppError · `lib/domain/` lógica pura ·
`lib/data/` IO Supabase, lança erro · `lib/hooks/` estado React ·
`lib/services/` **vazio por design** · `supabase/functions/` Deno ·
`app/<route>/actions.ts` `{ok,data}|{ok,error}` · `app/`+`components/` UI
(RSC default).

Dependência desce, nunca sobe. Detalhes: `.claude/rules/layers.md`.

---

## Regras críticas (toda sessão)

- **JWT claims:** RLS usa `auth.jwt() ->> 'tenant_id'` (nunca recriar helper)
- **Migrations:** via `mcp__supabase__apply_migration`. Nunca .sql manual
- **Erros:** `lib/data/` e `lib/domain/` lançam · server actions retornam `{ok}`
- **Env:** `import { env } from '@/lib/env'` (exceto `NEXT_PUBLIC_*` em client)
- **Componentes:** <300 linhas, RSC default, nunca `createClient()` direto
- **Nomenclatura:** DB+code+folders EN; URL+UI PT-BR via `t()` next-intl
- **Brand:** SEMPRE via `useBrand()` / hostname lookup. NUNCA hardcoded
- **Vocab banido:** ver `.claude/rules/naming.md` antes de qualquer code
- **shadcn primitives:** zona quarentenada, Edit bloqueado em `components/ui/*`. Canal único: `npx shadcn add` via Bash. Wrapper composto em `components/app-*.tsx` SÓ com valor agregado (passthrough proibido). Ver `.claude/rules/shadcn-zone.md`
- **i18n:** `t('chave')` desde primeira string. Estrutura `messages/<locale>/<namespace>.json`. AppError aceita `string | { key, fallback }`. Ver `.claude/rules/i18n.md`
- **APCA Silver:** body Lc ≥75, large ≥60, non-text ≥45. Gate em `prebuild` script. Ver `.claude/rules/contrast.md`
- **Entitlements server:** `requireEntitlement(feature)` + `requireQuota(key)` + `incrementQuotaUsage(key, delta)` chamam RPCs (ADR-0039). API client (`useEntitlement`, `useQuota`) + `AppEntitlementGate` inalterados. Ver `.claude/rules/entitlements.md`
- **Storybook 10:** `.storybook/main.ts` + stories co-localizadas `components/**/*.stories.tsx`. MCP endpoint `localhost:6006/mcp` em `.mcp.json`. Ver ADR-0038
- **Blueprints novos:** `19-wrapper-strategy.md` (consolida ADR-0040 §E + §F) + `20-i18n-strategy.md` (consolida ADR-0040 §G) — Etapa 15 do plano

---

## Test e build

```bash
pnpm typecheck                            # 0 erros
pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit
pnpm lint --max-warnings 0                # 0/0
pnpm test                                 # vitest 100%
pnpm build                                # verde
pnpm size                                 # budgets verdes
```

Antes de PR: rodar os 6 acima.

---

## Abstrações disponíveis (use antes de criar)

`useServerAction(action)` · `CopyButton`/`useCopy` · `ok()`/`fail()` ·
`renderEmail(el)` · `useBrand()` · `getBrandByHost()` · `<Logo>` wordmark ·
`useAppToast()` · `<AppForm>` · `<AppEntitlementGate>` · `<Heading>`/`<Text>`/`<Muted>`.
Lista completa: `.claude/rules/abstractions.md`.

Criar abstração nova: 3+ usos + ADR (pesquisa 04).
