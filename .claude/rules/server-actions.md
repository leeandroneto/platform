---
name: Server Actions
description: { ok, data } | { ok: false, error }, chama lib/data/
paths:
  - "app/**/actions.ts"
---

## Regras Server Actions

### Estrutura canônica

```ts
'use server'

import { ok, fail } from '@/lib/contracts/result'
import { AppError } from '@/lib/contracts/errors'
import { createServerClient } from '@/lib/supabase/server'
import { listPrograms } from '@/lib/data/programs/listPrograms'
import { listProgramsInput } from '@/lib/contracts/zod/programs'

export async function listProgramsAction(rawInput: unknown) {
  const parsed = listProgramsInput.safeParse(rawInput)
  if (!parsed.success) return fail(AppError.invalidInput(parsed.error.message))

  try {
    const client = await createServerClient()
    const data = await listPrograms(client, parsed.data.tenantId)
    return ok(data)
  } catch (err) {
    return fail(AppError.from(err))
  }
}
```

### Regras

- `'use server'` no topo
- Return type: `Result<T, AppError>` (= `{ ok: true, data: T } | { ok: false, error: AppError }`)
- Input validation via Zod (`lib/contracts/zod/<entity>.ts`)
- Chama `lib/data/` passando client
- Captura erro em try/catch → `fail(err)`
- **Nunca lança** (UI espera `Result`)

### Não fazer

- ❌ Não criar Supabase client dentro com `createClient()` raw
- ❌ Não chamar Supabase direto sem passar por `lib/data/`
- ❌ Não retornar `null` em caso de erro
- ❌ Não usar `revalidatePath` sem necessidade explícita (cache invalidation pesado)

### Tamanho

- 1 action por arquivo (idealmente)
- Função ≤ 60 linhas (incluindo parse + dispatch + return)

### Naming

- Sufixo `Action` no nome (`listProgramsAction`, `createTenantAction`)
- File: `app/<route-group>/<route>/actions.ts`

Detalhes: blueprint/01-arquitetura.md + blueprint/04-camadas-imports.md.
