# 0034. Vertical slice `features/` + entitlements model

Date: 2026-05-18
Status: accepted

## Context

Estrutura atual organiza código por **camada técnica** (Next.js padrão):

```
app/api/programs/route.ts          ← rota
app/(admin)/programs/page.tsx      ← UI admin
app/(client)/portal/programs/...   ← UI aluno
lib/data/programs.ts                ← data layer
lib/hooks/usePrograms.ts            ← hooks
tests/programs.test.ts              ← test
```

Pra adicionar feature "programs" → toca 6 arquivos espalhados. Pra remover → grep
em 6 lugares. Onboarding novo dev = ler 6 arquivos pra entender 1 feature.

Sheriff hoje impede `lib/data/` importar `app/` (camadas), mas **não impede**
`lib/data/payments.ts` importar `lib/data/programs.ts` (cross-feature). Features
podem se contaminar mutuamente.

Plus: pacotes A/B/C precisam gate por feature (chatbot só plano C, custom domain
B+C, etc). Sem modelo formal de entitlements, gate vira if/else espalhado e
inevitavelmente vaza (devloop esquece check server-side → cliente paga plano A e
consegue criar chatbot).

Pesquisas SaaS B2B (Stripe Billing, Linear, Notion, Memberstack, Whop, Vercel
2023-2024) convergem: **vertical slice + entitlements declarativos** é o padrão.
Feature flags genéricos (LaunchDarkly, GrowthBook) são pra A/B test, NÃO pra
plano-gate — entram JIT quando A/B for útil.

Lição onboarding-bio: features foram criadas em camadas técnicas, refator pra
unificar custou ~40h. Greenfield permite começar certo.

## Decision

### 1. Vertical Slice — `features/<name>/` self-contained

Cada feature vira pasta única co-locando contracts + data + hooks + components +
tests + plan-gates:

```
features/
  programs/
    plan-gates.ts        ← quais planos acessam (declarativo)
    contracts.ts         ← Zod schemas + types
    data.ts              ← Supabase queries (server-only)
    handlers.ts          ← lógica route handlers (com requireEntitlement)
    hooks.ts             ← React hooks client-side
    components/
      ProgramCard.tsx
      ProgramForm.tsx
    components/__stories__/
      ProgramCard.stories.tsx
    __tests__/
      data.test.ts
      entitlement.test.ts
    index.ts             ← public API (única coisa que outras features importam)
```

`app/` fica fininho — só wiring Next:

```ts
// app/api/programs/route.ts
import { getProgramsHandler } from '@/features/programs'
export const GET = getProgramsHandler
```

```tsx
// app/(admin)/programs/page.tsx
import { ProgramList } from '@/features/programs'
export default function Page() {
  return <ProgramList />
}
```

### 2. Sheriff feature-to-feature boundaries

```ts
tagging: {
  'features/<feature>': ['type:feature', 'feature:<feature>'],
  'features/<feature>/index.ts': ['type:feature', 'feature:<feature>', 'kind:public-api'],
}
depRules: {
  'feature:programs': ['feature:programs', 'type:shared'],
  'feature:payments': ['feature:payments', 'type:shared'],
  // outras features só podem importar via kind:public-api
  'type:feature': ['type:shared', 'kind:public-api'],
}
```

Cross-feature import = lint error. Forçar via `features/X/index.ts` mantém
acoplamento explícito + auditável.

### 3. Entitlements model — fonte única de verdade

**Tabela `public.plans`** (criada via migration `0007_add_plans_table`):

```sql
CREATE TABLE public.plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug in ('A','B','C')),
  name text not null,
  monthly_amount_minor int not null check (monthly_amount_minor >= 0),
  setup_amount_minor int not null check (setup_amount_minor >= 0),
  currency text not null default 'BRL' references public.currencies(code),
  features jsonb not null check (features ? 'schema_version'),
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)
```

**Setup vs mensalidade:** plataforma cobra setup one-time da agência (entrega
pacote inicial: domínio, captação, programa-piloto, treinamento) + mensalidade
recorrente. `monthly_amount_minor` + `setup_amount_minor` separados pra
fatura/UI distinguir.

`features` jsonb shape canônico (versão schema = 1):

```json
{
  "schema_version": 1,
  "chatbot": false,
  "custom_domain": false,
  "ai_assessment": true,
  "branded_pwa": true,
  "white_label_full": false,
  "automations": false,
  "max_programs": 5,
  "max_clients": 50,
  "max_storage_gb": 2
}
```

Seed dia 1 (3 planos, preços finais agência 2026):

| Slug | Nome     | Mensalidade    | Setup (one-time)  | Entitlements destacados                                                                                              |
| ---- | -------- | -------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| A    | Pacote A | R$ 100 (10000) | R$ 1.500 (150000) | `ai_assessment`, `max_programs=5`, `max_clients=50`, `max_storage_gb=2`                                              |
| B    | Pacote B | R$ 200 (20000) | R$ 3.000 (300000) | + `branded_pwa`, `custom_domain`, `max_programs=20`, `max_clients=200`, `max_storage_gb=10`                          |
| C    | Pacote C | R$ 200 (20000) | R$ 4.000 (400000) | + `chatbot`, `white_label_full`, `automations`, `max_programs=-1` (ilimitado), `max_clients=-1`, `max_storage_gb=50` |

`-1` = ilimitado convencionalmente. UI mostra "∞" / "Ilimitado" quando ler `-1`.

### 4. `lib/entitlements/` — runtime helpers

```ts
// lib/entitlements/server.ts
import 'server-only'
export async function requireEntitlement(feature: string): Promise<void>
export async function getEntitlements(): Promise<PlanFeatures>
export async function requireQuota(
  key: string,
  currentCount: number,
): Promise<void>

// lib/entitlements/client.ts
;('use client')
export function useEntitlement(feature: string): {
  allowed: boolean
  plan: PlanSlug
  upgradeUrl: string
}
export function useQuota(key: string): { used: number; limit: number | null; nearLimit: boolean }
```

Helpers leem do JWT (`tenant.subscription.plan_id` → `plans.features`). Cache
in-memory TTL 60s (paga raras vezes, lê milhares). Validação Zod no boundary
DB → runtime via `PlanFeaturesSchema` + `PlanSlugSchema` em
`lib/contracts/entitlements.ts` (substitui casts `as unknown as` perigosos).

**Componentes UX (`lib/entitlements/components/`) — DEFERIDOS JIT.** Tentativa
inicial 2026-05-18 (commit `7818df1`) criou 5 componentes do zero com strings
PT-BR hardcoded, sem usar shadcn `<Progress>`, `<Card>`, `<AspectRatio>`, etc.
Revertido. **Próxima tentativa**: pesquisar primeiro registry shadcn blocks +
comunidade (Cadenza, origin-ui, aceternity, kibo-ui) — só compor o que sobrar
após pesquisa. **Toda copy via props** (nada inline — viola multi-tenant
white-label). Entra com 1ª feature gated real, não preventivamente.

### 5. `plan-gates.ts` obrigatório em toda feature

```ts
// features/chatbot/plan-gates.ts
import type { FeatureGate } from '@/lib/entitlements/types'

export const chatbotGate: FeatureGate = {
  feature: 'chatbot', // chave em plans.features
  requiredPlans: ['C'],
  upgradeFrom: ['A', 'B'],
  upgradeUrl: '/upgrade?feature=chatbot',
  quotaKey: null,
}
```

### 6. ESLint rule custom: `plan-gates-required`

Toda pasta em `features/<name>/` deve ter `plan-gates.ts` exportando `*Gate`.
Sem isso = lint error. PR não passa CI.

### 7. Defesa em 3 camadas (impossível esquecer)

1. **Server-side** (autoridade): `requireEntitlement('chatbot')` no handler — 403 se plano não permite
2. **Sheriff**: import de feature só via `kind:public-api` (não vaza internals)
3. **ESLint**: `plan-gates.ts` obrigatório por feature + CI grep PR sem entry

## Consequences

**Positivo:**

- Adicionar feature = criar 1 pasta `features/<name>/` com estrutura inteira self-contained
- Remover feature = deletar 1 pasta (não caça em 6 lugares)
- Plan gating impossível de esquecer (server + sheriff + lint)
- Admin futuro consegue trocar feature de plano sem deploy (UPDATE em `plans.features`)
- Migração pra microserviço (se um dia precisar) = mover 1 pasta pra outro repo
- Onboarding dev: "feature X vive em `features/X/`. Pronto."

**Negativo:**

- Estrutura diverge de "Next.js padrão" — devs novos vão estranhar até ler ADR
- 1 layer de indirection: `app/api/programs/route.ts` reexporta de `features/programs/handlers.ts`
- Stories Ladle ficam dentro de features/ — precisa configurar Ladle pra ler `features/**/__stories__/`
- `lib/data/` e `lib/hooks/` ficam reservados pra utilities cross-feature (não pra lógica de domínio)
- `lib/entitlements/` adiciona 1 helper a mais (mas é único, não espalha)

**Neutro:**

- Sheriff config cresce ~10 linhas (1 tag por feature)
- ESLint custom rule `plan-gates-required` ~30 linhas
- Toda feature ganha `plan-gates.ts` mesmo se gate for "todos planos" (declarativo > implícito)
- Tabela `public.plans` entra via migration `0007_add_plans_table` (Tarefa 25.5) — 0006 ficou usado por cleanup do schema platform (ADR-0033)
- Vai pra Checklist 15 como tarefa 25.5 (depois de schema baseline, antes de lib/contracts)

## Referências

- ADR-0008 (shadcn 100%) — composição UI continua via shadcn primitives
- ADR-0029 (Template→Instance) — features que têm templates seguem mesmo padrão dentro de `features/<name>/`
- ADR-0033 (consolidação public) — todo data em `public.*`, não muda pattern de feature
- ADR-0035 (próximo) — UX de feature gating
- Pesquisas: Stripe Billing entitlements (2024), Linear plan-gates, Notion feature flags
- Memória: `feedback_never_skip_plan_items`, `reference_master_spec_templates`

## Histórico

| Data       | Mudança        | Aprovador |
| ---------- | -------------- | --------- |
| 2026-05-18 | Versão inicial | Leandro   |
