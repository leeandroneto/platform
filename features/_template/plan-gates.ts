// features/_template/plan-gates.ts
// Declarativo: quais planos liberam essa feature + UX pattern (ADR-0035).
// Convenção: cada feature exporta `*Gate` (regex em ESLint custom rule).
//
// Substitua "_template" pelo nome da feature ao copiar.

import type { FeatureGate } from '@/lib/entitlements/types'

export const templateGate: FeatureGate = {
  feature: '_template', // chave em public.plans.features
  requiredPlans: ['A', 'B', 'C'], // todos planos (placeholder)
  upgradeFrom: [], // origem permitidas pra CTA upgrade
  upgradeUrl: '/upgrade?feature=_template',
  quotaKey: null, // null = booleana; string = quota numérica
  uxPattern: 'A', // ADR-0035: A (paywall modal) | B (tooltip) | C (quota banner)
  paywallCopy: {
    title: 'Feature placeholder',
    bullets: [
      'Substitua estes bullets pelo benefício real',
      'Tom direto, ação específica',
      'Quantifique impacto quando possível',
    ],
    previewImage: null, // path/url pro screenshot/preview
  },
}
