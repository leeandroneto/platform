---
name: APCA Silver dual-gate (contrast)
description: Antes de criar paleta nova ou alterar cor de role, validar APCA Silver via lib/design/contrast.ts
paths:
  - 'lib/design/**/*.ts'
  - 'app/api/{tenants,brands}/[id]/theme.css/route.ts'
  - 'scripts/validate-palettes.ts'
  - 'app/(admin)/**/*.{ts,tsx}'
  - 'features/branding/**/*.{ts,tsx}'
---

## Princípio

APCA Silver dual-gate (75/60/45). Substitui Bronze (75/30) — alinha blueprint 05 §5 + ADR-0040 §H.

Quebrar contraste = quebrar deploy. Gate em `prebuild` script.

## Thresholds Silver

| Role       | Lc mínimo | Aplicação                                          |
| ---------- | --------- | -------------------------------------------------- |
| `body`     | 75        | Texto corpo (parágrafos, labels, headings menores) |
| `large`    | 60        | Texto grande (≥24px bold ou ≥36px regular)         |
| `non-text` | 45        | Borders, ícones, focus rings, filled blocks        |

## Helpers em `lib/design/contrast.ts`

```ts
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { converter, type Oklch, type Rgb } from 'culori'

const SILVER = { body: 75, large: 60, 'non-text': 45 } as const
type ApcaRole = keyof typeof SILVER

export function apca(fgOklch: string, bgOklch: string): number {
  // converte OKLCH → sRGB → APCA Lc signed
}

export function meetsApca(fg: string, bg: string, role: ApcaRole): boolean {
  return Math.abs(apca(fg, bg)) >= SILVER[role]
}

export function ensureAccessible(fg: string, bg: string, minLc: number): string {
  // bisection L até atingir minLc (preserva H, C)
}

export function pickReadableForeground(bg: string): string {
  // retorna black ou white por |Lc| máximo
}
```

## Validação build-time

Script `scripts/validate-palettes.ts` itera matrix completa:

- 13 paletas seed × roles × {primary, danger, surface, chart-1..5} × {on-surface, on-primary}
- Quebra se qualquer par < threshold Silver
- Roda via `pnpm validate:apca` (prebuild script)

Failure mode: `process.exit(1)` → `pnpm build` falha → deploy falha.

## Validação runtime (tenant salva theme custom)

Server action ao receber paleta custom:

```ts
import { ensureAccessible, meetsApca } from '@/lib/design/contrast'

async function saveTenantTheme(palette) {
  // rejeita se primary não atinge non-text vs surface
  if (!meetsApca(palette.primary, palette.surfaces_dark[0], 'non-text')) {
    throw AppError.invalidInput({
      key: 'theme.contrast_too_low',
      fallback: 'Primary color contrast below APCA Silver threshold',
      metadata: { lc: apca(palette.primary, palette.surfaces_dark[0]) },
    })
  }
  // ou: ajusta automaticamente pra atingir Lc mínimo
  const adjusted = ensureAccessible(palette.primary, palette.surfaces_dark[0], 45)
}
```

## Anti-patterns

- Hardcoded color em `.tsx` (`#ff0000`, `rgba(0,0,0,0.5)`) — ESLint `design-tokens/no-tailwind-bypass` bloqueia
- Threshold customizado por componente — mantém Silver universal
- Skip validate:apca no build — Pre-build script obrigatório
- Aceitar Bronze (75/30) — Silver é decisão fechada (ADR-0040 §H)
- WCAG 2.x AA fallback como gate principal — APCA é fonte de verdade

## Condição de revisitar

| Gatilho                                         | Ação                                                                 |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| **14ª paleta adicionada**                       | Re-rodar `pnpm validate:apca`. Adicionar tabela de aprovação em seed |
| **Tenant salva theme custom via UI**            | Server action chama `ensureAccessible()` antes de persistir          |
| **Mudança na seed `palettes.seed.ts`**          | Pre-commit hook executa `validate:apca`                              |
| **Adicionar role novo** (ex: `--color-paywall`) | Adicionar à matrix em `validate-palettes.ts`                         |
| **APCA-W4 release** (futuro)                    | Avaliar migração de Bronze→Silver→Gold thresholds                    |

## Referências

- ADR-0040 §H + §I
- ADR-0032 (validator paletas escopo X — Bronze original)
- `docs/blueprint/05-design-system.md §5` — APCA dual-gate
- `lib/design/contrast.ts` — helpers
- `scripts/validate-palettes.ts` — gate build-time
- `apca-w3` npm package — https://www.npmjs.com/package/apca-w3
- APCA-W3 documentation — https://git.apcacontrast.com/documentation/README
