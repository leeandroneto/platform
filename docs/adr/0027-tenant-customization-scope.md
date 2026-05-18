# 0027. Tenant customization scope (cor, tipografia, shape)

Date: 2026-05-17
Status: superseded by 0028 (schema parcial — princípio "3 eixos dia 1" mantido) + schema `platform.*` consolidado em `public.*` via ADR-0033

## Why superseded

Schema original colocava pools (13 paletas + 7 fontes + 3 shapes) hardcoded em
`lib/design/` com `platform.tenants.palette_id text`. ADR-0028 move pools pra
tabelas `platform.{palettes,fonts,shape_presets}` no banco (UI admin gerencia,
marca pai pode restringir subset, sem deploy pra adicionar 14ª). Princípio
"arquitetura suporta 3 eixos dia 1" continua válido — só o lugar dos pools muda.

## Context

ADR-0010 estabeleceu "personalização unificada" (todos tenants têm o mesmo poder), mas ficou ambíguo sobre escopo exato: 1 das 13 paletas só ou cor livre? Tipografia? Shape? Decisão precisa ser fechada antes do shadcn merge pra evitar limitar a arquitetura.

## Decision

**Arquitetura dia 1 suporta todos os 3 eixos** via mesma pipeline (CSS via API route — D-G59). Disponibilização da UI é separada (decisão de produto).

### Eixo 1 — Cor primária

- **13 paletas oficiais** (D-G76) como pool default no código (`lib/design/palettes.ts`)
- **Custom OKLCH livre** permitido via `platform.tenants.custom_primary_oklch` (text, nullable)
- Validação server-side APCA dual-gate Lc ≥75/60/45 antes de salvar (rejeita combo ilegível)
- 5 chart colors derivadas automaticamente do hue primário (split-complementary)

### Eixo 2 — Tipografia

- **Pool oficial** declarado em `lib/design/fonts.ts`: Geist Sans (default), Inter, Outfit, Lora, Manrope, Plus Jakarta Sans, Space Grotesk
- `platform.tenants.font_id` text (FK lógico ao pool, default `'geist'`)
- Carregamento via `next/font` no `app/layout.tsx` com `--font-brand` CSS var override
- Custom Google Fonts arbitrário **NÃO** suportado dia 1 (overhead de validação + perf)

### Eixo 3 — Shape

- **3 presets** em `lib/design/shapes.ts`: `sharp` (radius 4px), `rounded` (8px), `pill` (16px)
- `platform.tenants.shape_preset` enum (`'sharp'|'rounded'|'pill'`, default `'rounded'`)
- Override do `--radius` no mesmo `/api/tenants/[id]/theme.css?v=N` route

### Implementação dia 1

| Coluna em `platform.tenants`           | Default     | UI dia 1?                             |
| -------------------------------------- | ----------- | ------------------------------------- |
| `palette_id` (FK 13 paletas)           | `'default'` | ✅ tela "Aparência" — escolher das 13 |
| `custom_primary_oklch` (text nullable) | `null`      | ❌ entra Sprint X quando demanda real |
| `font_id` (FK pool)                    | `'geist'`   | ❌ entra quando demanda real          |
| `shape_preset` (enum)                  | `'rounded'` | ❌ entra quando demanda real          |
| `theme_version` (int)                  | `1`         | (auto)                                |

**Princípio §39 reforçado:** schema dia 1 cobre 100%. UI tier-by-tier conforme demanda.

## Consequences

**Positivo:**

- Arquitetura nunca vira blocker — qualquer feature de white-label futura é flag/UI, não refactor
- Mesma `/api/tenants/[id]/theme.css?v=N` resolve tudo (cor + fonte + shape)
- shadcn vars mapeadas pros nossos tokens herdam customização automática (zero código por componente)

**Negativo:**

- 3 colunas extras em `platform.tenants` dia 1 que ficam `null`/default até feature ativar
- Pool de fontes (~7) ocupa ~150-200KB bundle (mitigação: lazy load via `next/font` subset)

**Neutro:**

- ADR-0010 (personalização unificada) permanece válido — este ADR refina escopo
- `globals.css` precisa ter mapping shadcn vars → nossos tokens (próximo passo)
- Migration `0001_initial` baseline adiciona as 3 colunas (24 → 24 tabelas, sem nova)
