# Waves de execução

Ordem sequencial — não paralelizar. Decisão semântica acumulada.

| Wave | Área                      | Arquivos | Violações | Status |
| ---- | ------------------------- | -------- | --------- | ------ |
| 01   | Marketing & public static | ~30      | ~76       |        |
| 02   | Internal / Dashboard      | ~50      | ~82       |        |
| 03   | Public flows & funnel     | ~16      | ~21       |        |
| 04   | Reusable UI components    | ~2       | ~2        |        |

## Regras de execução

1. Cada heading é avaliado caso a caso (Heading vs Text)
2. `className` preservado para manter visual idêntico
3. Após cada wave: `pnpm exec tsc --noEmit` + `pnpm lint`
4. Wave só fecha com zero violações na área
