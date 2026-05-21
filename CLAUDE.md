# Claude — contexto do projeto

> Carregado no início de toda sessão. **Mantenha curto e atualizado.**
> Última atualização: 2026-05-21 (Fase B organização pós-reset · pivot
> TweakCN ADR-0044 supersedes ADR-0043)

---

## Projeto

SaaS B2B white-label PWA **multi-marca multi-vertical**. Profissionais de
diferentes verticais (fitness, yoga, idiomas) criam, vendem e operam
programas e desafios online com suporte de IA.

**Arquitetura:** 1 código + 1 deploy + N marcas filhas via hostname
(ADR-0024). Brand resolvida em runtime via `public.brands` lookup,
não env. Adicionar marca filha = INSERT + DNS, zero refactor.

**Marca filha dia 1:** `desafit.app` (fitness).
**Marcas planejadas:** `yoga.app`, `ingles.app`.
**Marca pai (holding):** identidade comercial só (footer, legal); zero tech (ADR-0022).

Identidade completa, decisões, modelo: `docs/blueprint/00-PROJETO.md`.

---

## Onde fica cada coisa

| Info                              | Arquivo canônico                                                                                   |
| --------------------------------- | -------------------------------------------------------------------------------------------------- |
| Regras code carregadas por path   | `.claude/rules/*.md` (19 rules)                                                                    |
| Constituição imutável             | `docs/blueprint/00-PROJETO.md`                                                                     |
| Decisões fechadas (ADRs)          | `docs/adr/NNNN-*.md`                                                                               |
| Blueprints técnicos               | `docs/blueprint/NN-*.md`                                                                           |
| Plano ativo (agora)               | `docs/plans/pivot-tweakcn.md` (Fase -1 ✅ clone TweakCN · Fase 0 surgical delete · Fase 1-8)       |
| Plano pausado                     | `docs/plans/funil-agencia.md` (retoma após pivot Fase 4 theme storage)                             |
| TweakCN clone read-only (SSOT)    | `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, Apache-2.0)                              |
| Pesquisas autoritativas           | `docs/research/NN-*.md` (23 forms · 24 pages · 25 reports · 28 tweakcn-eval · 29-31 estudos pivot) |
| Reflexões em curso (não-decidido) | `docs/_sessions/YYYY-MM-DD-{topic}.md`                                                             |
| Log cronológico de mudanças       | `CHANGELOG.md`                                                                                     |
| Status corrente do projeto        | `docs/_status.md`                                                                                  |
| Histórico arquivado               | `docs/_archive/` (referência JIT)                                                                  |
| Migrations docs                   | `docs/migrations/NNNN_*.md` (espelha MCP apply)                                                    |

`.claude/rules/*.md` (carregamento por path glob — 19 rules):

- `naming` · `abstractions` · `layers` · `data-layer` · `domain-logic` · `server-actions` · `features` · `jwt-claims` · `components`
- **i18n** · **contrast** · **shadcn-zone** · **design-tokens** · **brand** · **entitlements** (ADR-0040 §L — cada um tem "Condição de revisitar")
- **tenant-content** (hierarquia 4 níveis copy/landing — decisão dia 0: template+slots, não block builder)
- **forms-engine** (Form Engine + Page Engine, vocab, catálogo blocks, IA pipeline, versionamento Hotmart-like)
- **docs-writing** (gatilho: ao criar/atualizar doc; mapa de "qual tipo de info vai em qual arquivo")

Conflito entre docs: ADR > Blueprint > Plano ativo > Memória > Session reflection.

---

## Stack travado (não bumpar major sem ADR)

Next 16 (App Router, Turbopack, `proxy.ts`) · React 19 · Tailwind v4
(`@theme` OKLCH) · shadcn new-york dark-first · Motion 12 (`motion/react`,
NUNCA `framer-motion`) · Supabase `@supabase/ssr` 0.10 · Zod 4 + RHF 7 ·
next-intl 4 · pnpm 10 · Geist · Vitest · Playwright · Storybook 10
(`@storybook/nextjs-vite`, ADR-0038 supersede Ladle) · Serwist (`@serwist/turbopack`, ADR-0014).

---

## Schema único (ADR-0033 — superseded ADR-0025)

- `public.*` — tudo do produto. RLS é a fronteira de segurança, não schema
- `auth.*`, `storage.*`, `realtime.*` — Supabase managed (não tocar)

Em data layer: `client.from('programs')`. Sem `.schema()` qualifier.
Detalhes: ADR-0033.

---

## Multi-marca via hostname (ADR-0024)

NUNCA hardcoded `desafit`/`yoga.app`/`ingles.app` no código. Brand vem do hostname:

```ts
// proxy.ts (Next 16)
import { getRouteByHost } from '@/lib/route/getRouteByHost'
const route = await getRouteByHost(req.headers.get('host'))
// route: { brand, tenant?, palette?, font? }
```

Em componentes RSC + Client:

```tsx
import { useBrand, useTenantOptional } from '@/lib/route/RouteProvider'
const brand = useBrand()
return <h1>{brand.name}</h1> // ou <Logo /> wordmark dinâmico
```

Verticalização via `public.tenants.vertical` + `component.kind` polimórfico
JSONB internal keys. Mesmo schema serve todas marcas filhas.

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
- **Migrations:** via `mcp__plugin_supabase_supabase__apply_migration`. Nunca .sql manual
- **Erros:** `lib/data/` e `lib/domain/` lançam · server actions retornam `{ok}`
- **Env:** `import { env } from '@/lib/env'` (exceto `NEXT_PUBLIC_*` em client)
- **Componentes:** <300 linhas, RSC default, nunca `createClient()` direto
- **Nomenclatura:** DB+code+folders EN; URL+UI PT-BR via `t()` next-intl
- **Brand:** SEMPRE via `useBrand()` / hostname lookup. NUNCA hardcoded
- **Vocab banido:** ver `.claude/rules/naming.md` antes de qualquer code
- **shadcn primitives:** zona quarentenada, Edit bloqueado em `components/ui/*`. Canal único: `npx shadcn add` via Bash. Wrapper composto em `components/app-*.tsx` SÓ com valor agregado (passthrough proibido). Ver `.claude/rules/shadcn-zone.md`
- **i18n:** `t('chave')` desde primeira string. Estrutura `messages/<locale>/<namespace>.json`. AppError aceita `string | { key, fallback }`. Ver `.claude/rules/i18n.md`
- **APCA Silver:** body Lc ≥75, large ≥60, non-text ≥45. Gate em `prebuild` script. Ver `.claude/rules/contrast.md`
- **Entitlements server:** `requireEntitlement(feature)` + `requireQuota(key)` + `incrementQuotaUsage(key, delta)` chamam RPCs (ADR-0039). API client (`useEntitlement`, `useQuota`) inalterada. `AppEntitlementGate` wrapper foi deletado no pivot ADR-0044 (re-add JIT). Ver `.claude/rules/entitlements.md`
- **Storybook 10:** `.storybook/main.ts` + stories co-localizadas `components/**/*.stories.tsx` (sem stories no working tree atual pós-pivot ADR-0044; reinstalação JIT). MCP endpoint `localhost:6006/mcp` em `.mcp.json`. Ver ADR-0038
- **Engines (ADR-0041):** 2 motores separados — Form Engine (linear `steps[]+blocks[]+logic[]`) + Page Engine (árvore recursiva). Polimórficos via `forms.kind`/`pages.kind`. Reuso interno/externo via `scope` flag (tenant/internal/platform) + RLS condicional. Report = `pages.kind='report'` opcional (não regra). Catálogo dos engines: `docs/blueprint/21-engine-catalog.md`
- **Design system (ADR-0044 pivot · supersedes ADR-0043):**
  shadcn-canonical **~45 keys TweakCN-vocab** como interface pública obrigatória
  (32 cores + 3 fontes + 1 radius + 6 shadow primitives + shadow-color + letter-spacing + spacing-opt).
  Color format OKLCH-primary (HEX fallback JIT). Universal (mobile primitives,
  z-index, motion, spacing Carbon, APCA thresholds, breakpoint 768px) vive em
  `globals.css`; per-tenant (cores, fontes, radius, shadow) via
  `<style precedence="theme">` runtime. APCA Silver dual-gate mantido.
  TweakCN clone read-only em `C:\Users\leean\Desktop\tweakcn-ref\` como SSOT
  pra adaptação direta. **Adaptamos AO shadcn, não criamos vocabulário paralelo.**
  Extras opt-in só após estudo prévio + ADR.
- **Fase 1/2/3 (vocabulário oficial — supersedes H1/H2/H3):** Fase 1 = agência opera · Fase 2 = self-service profissional · Fase 3 = Pacote A cliente final. Não confundir com roadmap M0→M3 (sprints temporais)
- **Blueprints novos:** `19-wrapper-strategy.md` (ADR-0040 §E+§F) · `20-i18n-strategy.md` (ADR-0040 §G) · `21-engine-catalog.md` (ADR-0041)

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

Pós-pivot ADR-0044 (surgical delete `components/**`): só sobreviveram
abstrações de `lib/`. Wrappers + typography + Logo voltam JIT em Fase 1-3
quando feature consumer real existir.

`useServerAction(action)` · `ok()`/`fail()` · `renderEmail(el)` ·
`useBrand()` · `getRouteByHost()`. Lista completa: `.claude/rules/abstractions.md`.

Criar abstração nova: 3+ usos + ADR (pesquisa 04).
