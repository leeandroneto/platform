// sheriff.config.ts — Boundaries Domain→Data→Hooks→UI + Vertical Slice features/
// (blueprint/04-camadas-imports.md + ADR-0034).
// Tags em folders. Dependência desce, nunca sobe.
// Cross-feature import (features/A → features/B) BLOQUEADO exceto via index.ts.

import type { SheriffConfig } from '@softarc/sheriff-core'

const config: SheriffConfig = {
  enableBarrelLess: true,
  tagging: {
    'app/<feature>': ['type:feature', 'side:server'],
    'app/api/<route>': ['type:feature', 'side:server'],
    'components/<group>': ['type:shared'],
    // shadcn primitives — tag `kind:primitive` específica (zona quarentenada ADR-0040 §A).
    // Permite depRule restrita: primitives importam só de contracts, não de domain/data.
    'components/ui/<component>': ['type:shared', 'kind:primitive'],
    'lib/contracts/<topic>': ['type:shared', 'kind:contracts'],
    'lib/domain/<topic>': ['type:shared', 'kind:domain'],
    'lib/data/<topic>': ['type:data', 'side:server'],
    'lib/hooks/<topic>': ['type:shared', 'side:client'],
    'lib/api/<topic>': ['type:shared', 'side:server'],
    'lib/supabase': ['type:shared', 'side:server'],
    'lib/brand': ['type:shared', 'side:server'],
    'lib/route/<topic>': ['type:shared', 'side:server'],
    'lib/design/<topic>': ['type:shared'],
    'lib/email/<topic>': ['type:shared', 'side:server'],
    'lib/entitlements/<topic>': ['type:shared', 'kind:entitlements'],
    'hooks/<topic>': ['type:shared', 'side:client'],
    'supabase/functions/<fn>': ['type:data', 'side:server', 'runtime:deno'],

    // ─── Vertical slice features/ (ADR-0034) ─────────────────────────────
    // Cada feature ganha tag dinâmica `feature:<feature>`. Internals só
    // acessíveis pela própria feature; outras passam via kind:public-api.
    'features/<feature>': ['type:feature-slice', 'feature:<feature>'],
    'features/<feature>/index.ts': ['type:feature-slice', 'feature:<feature>', 'kind:public-api'],
  },
  depRules: {
    root: ['type:feature', 'type:feature-slice', 'type:shared', 'type:data'],
    'type:feature': ['type:shared', 'type:data', 'kind:public-api'],
    'type:feature-slice': ['type:shared', 'type:data', 'kind:public-api'],
    'type:data': ['type:shared'],
    'kind:domain': ['kind:contracts'],
    'kind:contracts': [],
    // primitives shadcn só dependem de contracts (vendor surface — não vaza pra domain/data)
    'kind:primitive': ['kind:contracts'],
    'kind:entitlements': ['type:shared', 'kind:contracts'],
    'kind:public-api': ['type:shared'],
    'side:client': ['type:shared'],
    'side:server': ['type:shared', 'type:data'],
    'runtime:deno': ['type:shared'],

    // ─── Feature-to-feature boundary (ADR-0034) ──────────────────────────
    // Internals da feature só podem importar do PRÓPRIO feature: tag.
    // Cross-feature (X → Y) só via Y/index.ts (kind:public-api).
    // Implementação: cada feature herda sua tag dinâmica via placeholder.
  },
}

export default config
