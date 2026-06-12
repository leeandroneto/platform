## Princípio

Plan gating é **server-side (truth)** + **client-side (UX)**. Toda feature em `features/<name>/` exige `plan-gates.ts` re-exportado em `index.ts` (ESLint enforce).

## Server-side

```ts
import "server-only";
import {
  requireEntitlement,
  requireQuota,
  getEntitlements,
} from "@/lib/entitlements/server";

export async function applyThemePersonalization() {
  await requireEntitlement("theme_builder_full"); // throw AppError.forbidden se Grátis
  // ... lógica
}

export async function createEvent() {
  await requireQuota("events_per_month", currentCount); // throw se excedeu
  // ...
}
```

## Client-side (UX)

```tsx
"use client";
import { useEntitlement, useQuota } from "@/lib/entitlements/client";

const { allowed, plan, upgradeUrl } = useEntitlement("theme_builder_full");
const { used, limit, nearLimit } = useQuota("events_per_month");
```

## AppError.forbidden com i18n

```ts
throw AppError.forbidden({
  key: "entitlements.feature_blocked",
  fallback: "Plan upgrade required",
  metadata: {
    feature: "theme_builder_full",
    current_plan: "free",
    required_plan: "apoiador",
  },
});
```

## Plan-gates por feature

`features/<name>/plan-gates.ts`:

```ts
export const themeBuilderFullGate = defineGate({
  feature: "theme_builder_full",
  description: "Theme builder completo (Apoiador+)",
  requiredPlan: "apoiador",
});
```

## 3 audiences cravadas

`public.plans.audience enum (tenant | sponsor | supplier)`.

**Tenants:** free · apoiador · membro
**Sponsors:** sponsor_estadual · sponsor_nacional · sponsor_oficial
**Suppliers:** b2b_vitrine

## Webhook gateway invalida cache

```ts
// supabase edge function — webhook gateway
await invalidateEntitlementCache(tenantId);
```

## Preços NO BANCO

Editar preço = update SQL, zero deploy. Render `<PricingCard>` lê `public.plans` + `public.prices`.
