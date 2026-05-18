---
name: Schemas separados public/platform/onboarding
description: platform = multi-marca multi-vertical (era core — ADR-0025). onboarding = legado pausado (NÃO usar).
paths:
  - 'lib/data/**/*.ts'
  - 'supabase/**/*.sql'
  - 'supabase/functions/**/*.ts'
---

## 3 schemas no Postgres

| Schema         | Conteúdo                                     | Status                        |
| -------------- | -------------------------------------------- | ----------------------------- |
| `public.*`     | auth, system, knowledge bases compartilhadas | ativo                         |
| `platform.*`   | produto principal multi-marca multi-vertical | ativo (dia 1)                 |
| `onboarding.*` | legado pausado                               | **NÃO usar neste greenfield** |

## Como acessar em data layer

```ts
// ✅ correto — schema explícito
import type { SupabaseClient } from '@supabase/supabase-js'

export async function listPrograms(client: SupabaseClient, tenantId: string) {
  const { data, error } = await client
    .schema('platform')
    .from('programs')
    .select('*')
    .eq('tenant_id', tenantId)

  if (error) throw error
  return data
}
```

```ts
// ❌ errado — sem schema, vai pra public (que não tem `programs`)
const { data } = await client.from('programs').select('*')

// ❌ errado — sintaxe legada
const { data } = await client.from('platform.programs').select('*')

// ❌ errado — onboarding pausado, NÃO usar
const { data } = await client.schema('onboarding').from('intakes').select('*')
```

## Multi-marca / multi-vertical

Schema `platform.*` é polimórfico (D-G28):

- `platform.tenants.vertical` indica `fitness` / `nutrition` / `yoga` / `english` / etc
- `platform.components.kind` enum + `payload jsonb` por vertical
- JSONB internal keys SEMPRE em EN (`reflection`, `pillars`, `next_step`)

**Adicionar nova vertical** = `INSERT` em `public.verticals` + preencher
`messages/<locale>/kinds.<vertical>.json`. Zero migration de schema.

**Adicionar nova marca filha** (`yoga.app`, `ingles.app`) = repo separado +
Supabase separado, MAS schema `platform.*` idêntico. Brand via hostname (ADR-0024), não via schema nem env.

## Migrations

SEMPRE via `mcp__supabase__apply_migration` (memória
`feedback_use_apply_migration`). Nunca .sql manual em `supabase/migrations/`.
