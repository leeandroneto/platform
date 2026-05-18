---
name: Entitlements — requireEntitlement + AppError i18n + plan-gates
description: Plan gating server-side via requireEntitlement(). UI via useEntitlement(). Mensagens via AppError com i18n key.
paths:
  - 'features/**/*.{ts,tsx}'
  - 'app/(admin)/**/*.{ts,tsx}'
  - 'app/api/**/*.ts'
  - 'lib/entitlements/**/*.ts'
---

## Princípio

Plan gating é server-side (truth) + client-side (UX). Toda feature em `features/<name>/` exige `plan-gates.ts` re-exportado em `index.ts` (ESLint `plan-gates/plan-gates-required` enforce).

Mensagens via `AppError` com i18n key (não string hardcoded — ADR-0040 §G).

## Server-side (RSC + Server Actions + API routes)

```ts
import 'server-only'
import { requireEntitlement, getEntitlements, requireQuota } from '@/lib/entitlements/server'

// Em Server Action ou API route — bloqueia antes da lógica
export async function generateAssessment() {
  await requireEntitlement('ai_assessments') // throw AppError.forbidden se não permitido
  // ... lógica
}

// Quota numérica
export async function createProgram() {
  await requireQuota('programs_per_month', currentCount)
  // ... lógica
}

// Features completas (snapshot)
const features = await getEntitlements() // PlanFeatures | null
```

`AppError.forbidden` agora aceita i18n key (ADR-0040 §G decisão 19):

```ts
throw AppError.forbidden({
  key: 'entitlements.feature_blocked',
  fallback: 'Feature requires plan upgrade',
  metadata: { feature: 'ai_assessments', current_plan: 'A', required_plan: 'B' },
})
```

## Client-side (UI gating)

```tsx
'use client'
import { useEntitlement, useQuota } from '@/lib/entitlements/client'

// Verifica permissão
const { allowed, plan, upgradeUrl } = useEntitlement('ai_assessments')

// Quota
const { used, limit, nearLimit } = useQuota('programs_per_month')
```

**Wrapper preferido (dia 0):** `AppEntitlementGate` (ADR-0040 §E)

```tsx
<AppEntitlementGate feature="ai_assessments">
  {/* renderiza se allowed */}
  <AssessmentEditor />
</AppEntitlementGate>
// Se not allowed: paywall modal + upgrade CTA traduzido automático
```

## Plan-gates por feature (ESLint enforce)

`features/<name>/plan-gates.ts`:

```ts
import { defineGate } from '@/lib/entitlements/types'

export const aiAssessmentsGate = defineGate({
  feature: 'ai_assessments',
  description: 'Generate AI assessment from intake',
  requiredPlan: 'B',
})

export const programsCreateGate = defineGate({
  feature: 'programs',
  description: 'Create new training program',
  quota: 'programs_per_month',
})
```

`features/<name>/index.ts` (ESLint regra `plan-gates-required` enforce):

```ts
export * from './plan-gates'
export * from './components'
export * from './hooks'
```

Sem `plan-gates.ts` re-exportado → lint error → CI falha.

## Anti-patterns

| Anti-pattern                              | Por que                                  | Substituto                                            |
| ----------------------------------------- | ---------------------------------------- | ----------------------------------------------------- |
| `if (plan === 'A') { ... }` no JSX        | Hardcoded plan = quebra white-label      | `useEntitlement('feature')` ou `<AppEntitlementGate>` |
| `if (plan === 'FREE') return <Paywall />` | Idem                                     | `AppEntitlementGate`                                  |
| Hardcoded plan name na UI (`"Plano Pro"`) | Vem do banco via `useEntitlement().plan` | `t('billing.plans.' + plan.slug)`                     |
| Skip `requireEntitlement` no server       | Frontend é hint, server é truth          | SEMPRE chama server-side antes da lógica              |
| `AppError.forbidden('msg crua')`          | String hardcoded vai pra UI EN           | `AppError.forbidden({ key, fallback })`               |
| Feature sem `plan-gates.ts`               | ESLint bloqueia                          | Criar gate antes de feature codar                     |
| Paywall modal sem `<AppEntitlementGate>`  | Duplica lógica de upgrade URL            | Use wrapper composto                                  |

## Condição de revisitar

| Gatilho                                                  | Ação                                                                                                                                                                        |
| -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **F4 Phase A Final (Makerkit RPCs)**                     | Refactor `lib/entitlements/server.ts` chamando RPCs PostgreSQL (`can_use_feature`, `get_entitlement`, `update_feature_quota_usage`). API client (`useEntitlement`) NÃO muda |
| **Feature 1 (M1 funil agência) começa**                  | Criar `features/agency-funnel/plan-gates.ts` antes de qualquer código de feature                                                                                            |
| **Plan novo no banco** (ex: tier Influencer)             | Atualizar seed `public.plans` + adicionar slug em `PlanSlugSchema` Zod                                                                                                      |
| **Feature paga validada por cliente real**               | Promover `<AppEntitlementGate>` pra UI específica + criar paywall modal i18n                                                                                                |
| **Quota numérica nova** (ex: `chatbot_messages_per_day`) | Adicionar coluna em `feature_usage` (após F4) + uso em `requireQuota`                                                                                                       |
| **Webhook Stripe `customer.subscription.updated`**       | Edge Function invalida cache via `invalidateEntitlementCache(tenantId)`                                                                                                     |

## Referências

- ADR-0040 §G (AppError factory i18n)
- ADR-0034 (vertical slice + entitlements model)
- ADR-0035 (feature gating UX patterns A/B/C)
- `lib/entitlements/server.ts` — `requireEntitlement`, `getEntitlements`, `requireQuota`, `getQuotaSnapshot`, `invalidateEntitlementCache`
- `lib/entitlements/client.ts` — `useEntitlement`, `useQuota`
- `lib/entitlements/EntitlementProvider.tsx` — hidrata snapshot server → client
- `lib/entitlements/types.ts` — `FeatureGate`, `PlanFeatures`, `PlanSlug`
- `lib/contracts/entitlements.ts` — Zod schemas boundary DB → runtime
- `eslint.config.mjs` plugin `plan-gates/plan-gates-required` — enforce
- Phase A Final F4 — refactor Makerkit RPCs (pendente)
