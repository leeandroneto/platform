---
name: Abstrações disponíveis + quando criar nova
description: Use existente antes de criar. 3+ usos + ADR antes de abstrair.
paths:
  - 'lib/**/*.ts'
  - 'components/**/*.tsx'
  - 'app/**/*.{ts,tsx}'
---

## Abstrações disponíveis (use antes de criar do zero)

| Abstração                  | Onde                           | Pra que                                                    |
| -------------------------- | ------------------------------ | ---------------------------------------------------------- |
| `Result<T, AppError>`      | `lib/contracts/result.ts`      | Server action return type discriminated union              |
| `ok(data)` / `fail(error)` | `lib/contracts/result.ts`      | Helper construtores                                        |
| `AppError`                 | `lib/contracts/errors.ts`      | Tagged variants pra erro tipado                            |
| `useServerAction(action)`  | `lib/hooks/useServerAction.ts` | useTransition + tratamento de erro                         |
| `CopyButton` / `useCopy`   | `components/ui/CopyButton.tsx` | Clipboard com feedback                                     |
| `withErrorHandler()`       | `lib/api/error.ts`             | Wrapper API route helpers                                  |
| `renderEmail(el)`          | `lib/email/render.ts`          | Renderiza React Email → `{ html, text }`                   |
| `Money`                    | `lib/contracts/money.ts`       | Value object `(amount_minor int + currency)` — multi-moeda |

## Quando criar abstração nova

- 3+ usos similares no codebase (grep antes)
- Aprovação explícita do fundador (premature abstraction é armadilha)
- Decisão registrada em `docs/adr/NNNN-*.md`

## Quando NÃO criar

- 1-2 usos: copy-paste inline é melhor
- "Pode ser útil no futuro": YAGNI, criar quando precisar
- Wrapper que só renomeia: sem valor

Antes de criar: grep no codebase pra confirmar que nada similar existe.
Princípio universal de busca (ADR-0008): padrão oficial → lib madura → pattern
comunidade → custom (último recurso, com ADR).
