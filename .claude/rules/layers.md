## Camadas da arquitetura

| Camada         | Pasta                    | Regra                                                                                           |
| -------------- | ------------------------ | ----------------------------------------------------------------------------------------------- |
| Contracts      | `lib/contracts/`         | SSOT: Zod schemas + Result + AppError + Money                                                   |
| Domain         | `lib/domain/`            | Lógica pura, zero IO, testável isolada                                                          |
| Data           | `lib/data/`              | IO Supabase. `function(client, ...args)`. Lança erro. `import 'server-only'` no topo. Sem React |
| Hooks          | `lib/hooks/`             | Estado React. Nunca wrapper de query                                                            |
| Services       | `lib/services/`          | **Vazio por design — não criar arquivos**                                                       |
| API helpers    | `lib/api/`               | `ok()` / `fail()` / `withErrorHandler()`                                                        |
| Edge Functions | `supabase/functions/`    | Deno                                                                                            |
| Server Actions | `app/<route>/actions.ts` | `{ ok, data } \| { ok: false, error }`                                                          |
| UI             | `app/`, `components/`    | RSC default, `'use client'` só quando obrigatório                                               |

## Regra geral

Dependência **desce**: UI → Server Action → Data → Domain → Contracts.

**Nunca sobe:**

- Data NÃO importa de `app/` ou `components/`
- Domain NÃO importa React, Supabase, IO (zero efeito colateral)
- Contracts NÃO importa de nada além de Zod + shared

## Zero exposição client-side (princípio universal)

- `lib/data/**` precisa `import 'server-only'` no topo
- Service role nunca no client
- Mutações sempre via Server Actions
- Reads sensíveis via RSC
- Sensitive data (CPF/CNPJ/secrets) nunca chega ao browser
