---
name: Brand identity — env + useBrand + multi-vertical
description: Brand via env vars + RouteProvider hooks. Multi-vertical via keys descritivas neutras. Nunca hardcoded.
paths:
  - 'app/**/*.{ts,tsx}'
  - 'components/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
  - 'lib/route/**/*.ts'
  - 'lib/brand/**/*.ts'
---

## Princípio

Brand identity (nome, domínio, default vertical) vem de env vars + hooks `useBrand()` / `useTenant()`. NUNCA hardcoded — ESLint `brand/no-brand-hardcode` bloqueia literais (`desafit`, `yoga.app`, `ingles.app`).

## Env vars canônicas

```
NEXT_PUBLIC_BRAND_NAME        # "desafit" | "yoga.app" | "ingles.app"
NEXT_PUBLIC_BRAND_DOMAIN      # "desafit.app"
NEXT_PUBLIC_BRAND_PARENT      # "desafit" (marca pai)
NEXT_PUBLIC_DEFAULT_BRAND_HOST # fallback dev/emergency
```

## Hooks (`lib/route/RouteProvider.tsx`)

```tsx
import { useBrand, useTenant, useTenantOptional } from '@/lib/route/RouteProvider'

// Em Client Component
const brand = useBrand() // { id, name, default_vertical, theme_version, ... }
const tenant = useTenant() // throw se rota brand-root sem tenant
const t = useTenantOptional() // null se rota brand-root
```

## Multi-vertical — terminologia (ADR-0040 §G decisão 15)

**Chaves descritivas neutras + copy fitness-shaped no VALOR.**

✅ Certo:

```json
{ "programs": { "title": "Programas", "create": "Criar programa" } }
```

❌ Errado:

```json
{ "workouts": { "title": "Treinos" } }   // vocab vertical-specific na chave
{ "fitness.programs.title": "..." }       // vertical no namespace
```

Razão: chaves estáveis cross-vertical. Override por tenant vem JIT via `tenant_copy_overrides` (Acme pede "WOD", FitLab pede "Programa", BoxClub pede "Treino" — todos via mesma chave).

## Multi-brand + locale (decisão 17)

Locale **ortogonal** a brand. Dia 0: `pt-BR` fixo independente da brand.

Schema `public.brands.default_locale` **adia** — migration single-column quando 2ª brand operacional com locale diferente.

## Anti-patterns (ESLint enforce)

| Anti-pattern                                                 | Bloqueio                                              |
| ------------------------------------------------------------ | ----------------------------------------------------- |
| `'desafit'`, `'yoga.app'`, `'ingles.app'` literais em código | `brand/no-brand-hardcode`                             |
| `if (brand === 'desafit')` lógica de negócio                 | Use `brand.default_vertical` ou capability flag       |
| Hardcoded `<Title>desafit</Title>`                           | `<Title>{brand.name}</Title>` via `useBrand()`        |
| Logo hardcoded SVG inline                                    | `<Logo>` componente único (JIT — Tarefa 24 checklist) |
| Fallback `process.env.NEXT_PUBLIC_BRAND_NAME ?? 'desafit'`   | `lib/env.ts` valida obrigatório                       |

## Allowlist

`.claude/rules/naming.md` lista 8 lugares legítimos pra menção de `desafit`/`yoga.app`/`ingles.app`:

1. `.claude/rules/naming.md` (definição)
2. `docs/adr/*.md` (decisões registradas)
3. `docs/_archive/*` (histórico)
4. `messages/pt-BR.json` chave `meta.banned_vocab.*` (UI educativa, futuro)
5. `tests/fixtures/banned-vocab.test.ts` (testar regra)
6. Block comment `// ADR-NNNN mention OK:` em test files
7. README ADR (índice)
8. `CHANGELOG.md` referenciando vocab superseded

## Condição de revisitar

| Gatilho                                                                  | Ação                                                                                            |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| **2ª brand operacional** (ex: `yoga.app` lança)                          | Adicionar env vars novo brand + tenants migrados pra brand correta                              |
| **2ª brand com locale diferente**                                        | Migration single-column `public.brands.default_locale` + resolver lê brand em `i18n/request.ts` |
| **Cliente pede "WOD" em vez de "Treino"** (cliente 2 vertical diferente) | Migration `tenant_copy_overrides` (ver `.claude/rules/i18n.md`)                                 |
| **Marca pai precisa landing externa** (não dentro PWA)                   | Aceternity exception (ADR-0037 §A.1) — só pra marketing site                                    |
| **Brand identity precisa logo final**                                    | Criar `<Logo>` componente único (Tarefa 24 checklist) com 3 variants × 3 temas × 3 sizes        |

## Referências

- ADR-0040 §G
- ADR-0021 + ADR-0022 + ADR-0025 (multi-brand strategy)
- ADR-0024 + ADR-0026 (multi-domain, RouteProvider)
- `lib/route/RouteProvider.tsx` — hooks implementation
- `lib/route/getRouteByHost.ts` — host → brand+tenant resolution
- `proxy.ts` — headers propagation
- `docs/blueprint/05-design-system.md §12` — brand assets zero inline
- `.claude/rules/naming.md` — allowlist 8 lugares
