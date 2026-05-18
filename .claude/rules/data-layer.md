---
name: Data layer rules
description: function(client, ...args), lança erro, sem React
paths:
  - 'lib/data/**/*.ts'
---

## Regras Data layer

### Assinatura canônica

```ts
export async function fnName(client: SupabaseClient, ...args: TArgs): Promise<TResult>
```

- Primeiro argumento SEMPRE é `client` (injetado pelo caller)
- Não criar client dentro — `createClient()` é proibido
- Retorna `TResult` direto (não `Result<T>`) — lança erro em vez

### Erros

- Lança `AppError` ou erro nativo do Supabase
- Server Action que chama esta função captura via try/catch e retorna `{ ok }`
- Logging fica em camada acima

### Boundaries

- ❌ Zero `import 'react'`
- ❌ Zero `import { useState }`
- ❌ Zero JSX
- ❌ Zero `'use client'` directive
- ❌ Zero import de `app/` ou `components/`
- ❌ Zero import de `@/lib/supabase/admin` (admin client é só em Server Action específico)
- ✅ Pode importar de `lib/contracts/`, `lib/domain/`, `lib/api/`

### Tamanho

- Função ≤ 60 linhas
- Arquivo ≤ 300 linhas

### Schema explícito

Sempre `client.schema('platform').from('tabela')`. Nunca string `'platform.tabela'`.

## Exemplo

```ts
// lib/data/programs/listPrograms.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import { AppError } from '@/lib/contracts/errors'

export async function listPrograms(client: SupabaseClient, tenantId: string) {
  const { data, error } = await client
    .schema('platform')
    .from('programs')
    .select('id, title, slug, published_at')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (error) throw AppError.from(error)
  return data
}
```
