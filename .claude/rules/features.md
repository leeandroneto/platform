---
name: Vertical slice features (ADR-0034 + ADR-0035)
description: Cada feature em features/<name>/ self-contained. plan-gates.ts obrigatório. Cross-feature só via index.ts.
paths:
  - 'features/**/*.ts'
  - 'features/**/*.tsx'
---

## Estrutura canônica

Toda feature vive em `features/<name>/` com:

```
features/<name>/
  plan-gates.ts        ← OBRIGATÓRIO (ESLint plan-gates-required)
  contracts.ts         ← Zod schemas + types da feature
  data.ts              ← IO Supabase (server-only)
  handlers.ts          ← Route handlers + server actions
  hooks.ts             ← React hooks client-side ('use client')
  components/          ← UI da feature (RSC default)
    *.tsx
  __tests__/           ← Vitest
    *.test.ts
  index.ts             ← Public API (única coisa que outras features importam)
```

Referência completa: `features/_template/`.

## Regra plan-gates (ADR-0034 §5 + §6)

`features/<name>/plan-gates.ts` exporta um `*Gate` tipado como `FeatureGate`:

```ts
import type { FeatureGate } from '@/lib/entitlements/types'

export const chatbotGate: FeatureGate = {
  feature: 'chatbot', // chave em public.plans.features
  requiredPlans: ['C'],
  upgradeFrom: ['A', 'B'],
  upgradeUrl: '/upgrade?feature=chatbot',
  quotaKey: null,
  uxPattern: 'A', // ADR-0035: A | B | C
  paywallCopy: { title, bullets, previewImage },
}
```

`features/<name>/index.ts` **deve** re-exportar `./plan-gates` (ESLint enforce).

## UX patterns (ADR-0035)

3 tipos canônicos:

| Tipo | Quando usar                                   | Componente principal                 |
| ---- | --------------------------------------------- | ------------------------------------ |
| A    | Feature niche (chatbot, automations, WL full) | `<PaywallModal>` no clique do botão  |
| B    | Feature core (custom_domain, branded_pwa)     | `<EntitlementBadge>` + tooltip hover |
| C    | Quota numérica (max_programs, max_clients)    | `<QuotaBanner>` topo da tela         |

5 componentes shared em `lib/entitlements/components/`:
`<EntitlementBadge>`, `<EntitlementGate>`, `<PaywallModal>`, `<QuotaBanner>`, `<UpgradeCTA>`.

## Sheriff boundary — cross-feature só via index.ts

```
features/A/data.ts → features/B/data.ts  ❌ BLOQUEADO
features/A/data.ts → features/B/index.ts ✅ OK (public API)
```

Sheriff tag `feature:<feature>` dinâmica + depRule cross-feature limitada a
`kind:public-api`.

## Defesa em 3 camadas

1. **Server-side (autoridade):** `requireEntitlement('chatbot')` em handler → 403 se plano não permite
2. **Sheriff:** import inter-feature só via index → não vaza internals
3. **ESLint:** plan-gates.ts obrigatório por feature

## Adicionar feature nova

1. Copiar `features/_template/` → `features/<nome>/`
2. Substituir `_template` por nome real em todos arquivos
3. Editar `plan-gates.ts` com requiredPlans + uxPattern correto
4. Implementar contracts + data + handlers + UI
5. Re-exportar tudo em `index.ts`
6. Wire em `app/` (route handler/page reexporta da feature)

## Remover feature

`rm -rf features/<nome>/` + remover do `app/` wiring. Não tem caça em N pastas.
