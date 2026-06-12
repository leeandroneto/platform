## APCA Lc ≥ 60 (single gate cravado)

Toda combinação texto/superfície valida APCA contrast Lc ≥ 60 antes de salvar tema.

## Quando aplica

- Tenant edita tema do site público (Apoiador via theme builder ou IA cor de foto)
- `deriveTokens(primary)` Edge Function calcula derivados E valida APCA
- Se falha: bloqueia save + retorna sugestão de ajuste

## Library

- `apca-w3` + `culori` (já cravado no stack)
- `lib/design/contrast.ts` expõe `validateApca(snapshot)`

## Tokens APCA cravados

- Body text: Lc ≥ 60 vs surface
- Large text: Lc ≥ 60 vs surface
- Non-text (borders, ring): Lc ≥ 45 vs surface

## Mobile/touch (não confundir com APCA)

Tokens mobile separados em `app/globals.css`:

- `--touch-min: 44px` (iOS HIG + WCAG 2.5.5)
- `--mobile-full-height: 100dvh`
- `--inset-safe-*: env(safe-area-inset-*)`
- `--press-scale: 0.97`
