# Wave 01 — Checks automatizados

**Status:** CONCLUIDO

## Resultados

| Check      | Comando                                  | Esperado            | Resultado                                 | Status              |
| ---------- | ---------------------------------------- | ------------------- | ----------------------------------------- | ------------------- |
| Lint       | `pnpm lint`                              | 0 erros, 0 warnings | 0 erros, 1 warning (pre-existente .ladle) | PASSA               |
| TypeScript | `pnpm exec tsc --noEmit`                 | 0 erros             | 0 erros                                   | PASSA               |
| Vitest     | `pnpm exec vitest run`                   | 371/371             | 371/371 (44 files, 2.37s)                 | PASSA               |
| Build      | `pnpm build`                             | passa               | passa                                     | PASSA               |
| APCA       | `pnpm exec tsx scripts/validate-apca.ts` | 18/18 >= threshold  | 16/18 (2 falhas nao-bloqueantes)          | PASSA COM RESSALVAS |
| VRT        | `tests/visual/`                          | baseline + 0 diff   | N/A (nao existe)                          | N/A                 |

## Detalhes

### APCA falhas

1. `ob-danger-400` on gray-950: Lc=40.9, precisa >=45. Issue rastreado.
2. `gray-950` on brand-400: Lc=59.4, precisa >=60. Combo nao usado.

### VRT

Infraestrutura nao criada. Nao bloqueia conforme Dec-24-1.

## Veredicto: PASSA
