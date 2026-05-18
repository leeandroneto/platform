---
name: Design tokens — usos canônicos OKLCH
description: --color-*, --radius-*, --font-* vêm do banco runtime. Onde usar, onde NÃO usar.
paths:
  - 'app/**/*.{ts,tsx,css}'
  - 'components/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
---

## Princípio

CSS vars vêm do banco runtime via `/api/{tenants,brands}/[id]/theme.css?v=N`. shadcn primitives herdam automático — ZERO componente editado individualmente (`app/globals.css:140-141`).

## Tabela canônica (replica blueprint 05 §3)

| Token                                      | Onde usar                                                        | Onde NÃO usar                   | APCA                         |
| ------------------------------------------ | ---------------------------------------------------------------- | ------------------------------- | ---------------------------- |
| `--color-primary`                          | bg de action (`<Button>`, ring focus, badge fill, progress fill) | body text, ícones no corpo      | Lc ≥45 vs surface (non-text) |
| `--color-primary-foreground`               | text/ícone dentro de `<Button variant=default>`                  | bg                              | Lc ≥75 vs primary            |
| `--color-foreground`                       | body text (parágrafos, labels, headings)                         | bg                              | Lc ≥75 vs surface-1          |
| `--color-muted-foreground`                 | text secundário, captions, helpers                               | body principal                  | Lc ≥60 large                 |
| `--color-background` (=surface-1)          | bg página `<body>`                                               | bg cards                        | base body                    |
| `--color-card` (=surface-2)                | bg cards, sections, containers elevados                          | bg página                       | —                            |
| `--color-popover` (=surface-3)             | bg dropdowns, popovers, tooltips                                 | cards inline                    | —                            |
| `--color-muted` (=surface-4)               | bg skeleton, disabled, ghost hover                               | text bg                         | —                            |
| `--color-border`                           | borders 1px de cards/inputs/separators                           | preencher área (use surface-\*) | —                            |
| `--color-input`                            | bg `<input>`, `<textarea>`, `<select>`                           | bg container externo            | —                            |
| `--color-chart-1..5`                       | barras/linhas em `<Chart>` (Recharts)                            | UI fora de chart                | Lc ≥45 vs surface            |
| `--color-info/success/warning/destructive` | bg toast/alert/badge semântico + `*-foreground` pro text         | tema marca (use primary)        | Lc ≥75 fg/bg                 |
| `--radius` (+sm/md/lg/xl)                  | border-radius em cards, buttons, inputs, badges, dialogs         | tipografia ou spacing           | Tailwind `rounded-*` lê      |
| `--font-sans/mono/brand`                   | `<body>` default, code blocks, headings hero                     | inline override                 | next/font em layout          |
| `--shape-*`                                | tokens custom de shape (radius por tipo de componente)           | hardcoded `rounded-2xl`         | configurável por tenant      |
| `--elevation-flat`                         | cards inline em listings (sem shadow, só border)                 | flutuação acima de conteúdo     | — (filosofia Linear-leaning) |
| `--elevation-raised`                       | cards destacados, dropdowns, popover discretos                   | dialog/modal (use overlay)      | —                            |
| `--elevation-overlay`                      | dialog, sheet, drawer, popover acima de conteúdo                 | hover sutil (use raised)        | —                            |

## Como funciona o theming automático

1. `proxy.ts` resolve `host → brand+tenant`
2. `app/layout.tsx` injeta `<link rel="stylesheet" href="/api/tenants/{id}/theme.css?v=N">`
3. `app/api/tenants/[id]/theme.css/route.ts` busca paleta/fonte/shape do banco → emite CSS
4. `@theme inline` em `globals.css` mapeia `--color-*` → vars shadcn (`--primary`, `--card`, etc)
5. `<Button>` shadcn puro renderiza com cor do tenant — sem prop, sem wrapper

**Conclusão:** não passar cor via prop. Tenant theming já funciona automático.

## Anti-patterns (ESLint enforce)

| Anti-pattern                                | Por que                                     | Substituto                                       |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------------ |
| `text-xl`, `text-2xl` em código             | `design-tokens/no-tailwind-bypass` bloqueia | `<Heading level={3}>` ou `<Text variant="lead">` |
| `rounded-md`, `rounded-2xl`                 | Idem                                        | `var(--radius)` via Tailwind `rounded`           |
| `uppercase` className                       | Idem                                        | `<Eyebrow>` (JIT) ou `<Badge>`                   |
| `[#hex]` arbitrary Tailwind                 | Idem                                        | `var(--color-*)` token                           |
| `[rgba(...)]` arbitrary                     | Idem                                        | `var(--color-*)` token                           |
| `#hex` literal em .ts/.tsx                  | Hook `block-token-bypass.sh` bloqueia       | CSS var                                          |
| `style={{ color: 'var(--accent)' }}` em JSX | Regra 17 (blueprint 13) bloqueia            | className token shadcn                           |

## Exceções aceitas (allowlist)

- `app/globals.css @theme` — declaração dos tokens
- `next/og` ImageResponse — `#hex` em SVG inline (build-time)
- `blurhash` — hex hash de placeholder

## Quando criar token novo

Gatilho: precisa de cor semântica que nenhum dos existentes cobre.

Passo:

1. Adicionar em `app/globals.css @theme` (`--color-novotoken: oklch(...)`)
2. Mapear em `@theme inline` se shadcn precisar (`--novotoken: var(--color-novotoken)`)
3. Adicionar à tabela canônica acima
4. Validar APCA Silver vs surface relevantes
5. Documentar em ADR se for usado em 3+ componentes

## Condição de revisitar

| Gatilho                                                                                      | Ação                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Token semantic novo necessário** (ex: `--color-paywall`, `--color-streak`)                 | Adicionar em globals.css @theme + @theme inline + validar APCA Silver                                                                                                                                                                    |
| **shadcn upstream adiciona variant que precisa de novo token**                               | Adicionar token + atualizar mapping `@theme inline`                                                                                                                                                                                      |
| **Tenant pede cor custom fora das 13 paletas seed**                                          | Criar paleta clone via `palettes.source_palette_id` (ADR-0029 template→instance) + validar APCA antes de persistir                                                                                                                       |
| **APCA quebra em paleta tenant**                                                             | `ensureAccessible()` ajusta automático OU rejeita salvamento                                                                                                                                                                             |
| **globals.css cobre 100% tokens semantic + vendor classes (cmdk/vaul/embla/tw-animate-css)** | Promover `better-tailwindcss/no-unknown-classes` de `warn` pra `error` em `eslint.config.mjs` (citar `// ADR-0040 §B.2` no diff). Mede progresso: rodar `pnpm lint` e contar warnings dessa regra — quando chegar a 0, é seguro promover |

## Referências

- ADR-0040 §H
- ADR-0028 (pools customização movidos pro banco)
- ADR-0029 (template→instance pattern unificado)
- `docs/blueprint/05-design-system.md §3` — tabela tokens completa
- `app/globals.css` — definição @theme + @theme inline
- `app/api/{tenants,brands}/[id]/theme.css/route.ts` — geração runtime
- `.claude/rules/contrast.md` — APCA Silver
