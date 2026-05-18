---
name: Camadas + Sheriff boundaries
description: Domain→Data→Hooks→UI. Dependência desce, nunca sobe.
paths:
  - 'lib/**/*.ts'
  - 'app/**/*.{ts,tsx}'
  - 'components/**/*.{ts,tsx}'
  - 'supabase/functions/**/*.ts'
---

## Camadas da arquitetura

| Camada         | Pasta                    | Regra                                                           |
| -------------- | ------------------------ | --------------------------------------------------------------- |
| Contracts      | `lib/contracts/`         | SSOT: Zod schemas + Result + AppError + adapters                |
| Domain         | `lib/domain/`            | Lógica pura, zero IO, testável isolada                          |
| Data           | `lib/data/`              | IO Supabase. `function(client, ...args)`. Lança erro. Sem React |
| Hooks          | `lib/hooks/`             | Estado React. Nunca wrapper de query                            |
| Services       | `lib/services/`          | **Vazio por design — não criar arquivos**                       |
| API helpers    | `lib/api/`               | `ok()` / `fail()` / `withErrorHandler()`                        |
| Edge Functions | `supabase/functions/`    | Deno. Mirror em `_engine/` e `_ai/`                             |
| Server Actions | `app/<route>/actions.ts` | `{ ok, data }\|{ ok: false, error }`                            |
| UI             | `app/`, `components/`    | RSC default, `'use client'` só quando obrigatório               |

## Regra geral

Dependência desce: UI → Server Action → Data → Domain → Contracts.

Nunca sobe:

- Data NÃO importa de `app/` ou `components/`
- Domain NÃO importa React, Supabase, IO (zero efeito colateral)
- Contracts NÃO importa de nada além de Zod + shared

## Sheriff boundaries (auto-enforce no CI)

Tags em `sheriff.config.ts`:

```
app/         → type:feature, side:server
components/  → type:shared
lib/domain/  → type:shared (núcleo)
lib/data/    → type:data, side:server
lib/hooks/   → type:shared (client)
lib/api/     → type:shared, side:server
lib/contracts/ → type:shared (SSOT)
supabase/    → type:data, side:server
```

Detalhes: blueprint/04-camadas-imports.md.
