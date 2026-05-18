// sheriff.config.ts — Boundaries Domain→Data→Hooks→UI (blueprint/04-camadas-imports.md).
// Tags em folders. Dependência desce, nunca sobe.

import type { SheriffConfig } from '@softarc/sheriff-core'

const config: SheriffConfig = {
  tagging: {
    'app/<feature>': ['type:feature', 'side:server'],
    'app/api/<route>': ['type:feature', 'side:server'],
    'components/<group>': ['type:shared'],
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
    'hooks/<topic>': ['type:shared', 'side:client'],
    'supabase/functions/<fn>': ['type:data', 'side:server', 'runtime:deno'],
  },
  depRules: {
    root: ['type:feature', 'type:shared', 'type:data'],
    'type:feature': ['type:shared', 'type:data'],
    'type:data': ['type:shared'],
    'kind:domain': ['kind:contracts'],
    'kind:contracts': [],
    'kind:primitive': ['kind:contracts'],
    'side:client': ['type:shared'],
    'side:server': ['type:shared', 'type:data'],
    'runtime:deno': ['type:shared'],
  },
}

export default config
