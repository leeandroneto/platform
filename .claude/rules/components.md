---
name: Componentes UX — hierarquia + wrapper pattern
description: Antes de qualquer Write em pasta de componentes, consultar hierarquia + inserir marker. Defer JIT continua valendo.
paths:
  - 'components/**/*.{ts,tsx}'
  - 'features/**/components/**/*.{ts,tsx}'
  - 'lib/**/components/**/*.{ts,tsx}'
---

## Princípio §39 — defer JIT (REVISADO 2026-05-21 pós research-45)

**Arsenal upfront, NÃO JIT puro pra primitives.** Research-45 cravou: 20 primitives
essenciais instalados dia 0 Fase 5 (bundle impact zero — Next.js 16 tree-shaking +
código copiado local). Lista canônica:

```
button input label form card dialog select textarea badge separator
skeleton tabs dropdown-menu tooltip popover scroll-area sheet sonner switch command
```

**JIT continua valendo pra:**

- **Wrappers compostos** (`components/app-*.tsx`) — só após 3+ usos
- **Blocks L2/L3** (`components/blocks/*`) — só quando feature concreta usar
- **JIT exceptions com deps pesadas:** `chart` (recharts ~250 KB), `calendar`
  (react-day-picker ~45 KB), `carousel` (embla ~25 KB)
- **Vendor catalogs** (Origin UI, Kibo UI, Magic UI) — copy-paste quando feature pedir

Hook `component-research-gate.sh` bloqueia Write em pastas listadas acima sem
marker `// RESEARCH: <fonte>` linha 1. Hook é gate determinístico (ADR-0036);
esta regra é o playbook.

## Folder structure (ADR-0045 D.13 invariante)

```
components/ui/              # L1 — shadcn primitives (quarentena ADR-0040)
components/app-*.tsx        # L1.5 — wrappers compostos com valor agregado
components/blocks/          # L2/L3 — Page Engine blocks (RSC + @registry-meta JSDoc)
components/vendor/          # Third-party copy-paste JIT (Origin/Kibo/Magic)
features/*/components/      # Feature-scoped (não-promovido)
```

**Invariante D.13 (ADR-0045):** `pages.kind === registry-item.name === components/blocks/{kind}.tsx`. Quem cria block novo respeita o nome canônico nas 3 surfaces.

Hook `component-research-gate.sh` bloqueia Write em pastas listadas acima sem
marker `// RESEARCH: <fonte>` linha 1. Hook é gate determinístico (ADR-0036);
esta regra é o playbook.

---

## Checklist obrigatório antes de Write

1. **Buscar via MCP** — `mcp__shadcn__list-components` + `mcp__shadcn__search`.
   Storybook MCP (após Fase 3): `mcp__storybook__list-components`.
2. **Escolher fonte mais alta** na hierarquia (próxima seção). Se primitive
   shadcn cobre, para por aí. Custom só se nada acima atende.
3. **Inserir marker linha 1** `// RESEARCH: <fonte> [link/justificativa]`.
   Exemplos:
   - `// RESEARCH: shadcn/ui card primitive — composição inline (3+ usos)`
   - `// RESEARCH: @origin-ui/avatar-stack — não existe equivalente shadcn`
   - `// RESEARCH: custom — primitive Tabs + lógica de scroll horizontal específica do feature`
4. **Wrapper, não fork.** Customização vai em `components/app-<nome>.tsx`
   chamando primitive. NUNCA editar `components/ui/<primitive>.tsx` direto.

---

## Hierarquia em 3 categorias (ADR-0008 + ADR-0037)

Ordem pesquisada 2026-05-18 (web survey direto dos catálogos).

### Categoria 1 — Vendor canônico (instalado em `components/ui/`)

| #   | Fonte             | Como adicionar                     | Quando                                                                  |
| --- | ----------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| 1   | shadcn blocks     | `mcp__shadcn__search` filtro block | Composição pronta (dashboard, auth, sidebar). Blocks-first se cobre 80% |
| 2   | shadcn primitives | `mcp__shadcn__list-components`     | Building blocks: button, input, dialog, sheet, card, drawer, sonner     |

### Categoria 2 — Catálogos copy-paste shadcn-compatible

**Não são `pnpm add`** (não existem como npm dependency). Copiados via
`npx shadcn add <url-do-registry>` ou manual pra `components/app-<nome>.tsx`
ou `features/<X>/components/`.

| #   | Catálogo       | Site           | Forte em                                                                | A11y                                |
| --- | -------------- | -------------- | ----------------------------------------------------------------------- | ----------------------------------- |
| 3   | **Origin UI**  | origin-ui.com  | Variações ricas de primitives (multi-select, time picker, avatar-stack) | Radix + React Aria                  |
| 4   | **Kibo UI**    | kibo-ui.com    | Padrões SaaS (kbd, announcement-bar, color-picker, dropzone)            | Shadcnblocks-backed                 |
| 5   | **Reui**       | reui.io        | **Data-grid TanStack v8** (29 comp), 1003+ componentes totais           | Boa                                 |
| 6   | **Tremor**     | tremor.so      | Dashboard analytics (KPI, sparkline, area, gauge) — 35+ comp            | Boa (mas design tokens divergentes) |
| 7   | **billingsdk** | billingsdk.com | Billing UI (price-table, plan-card, customer-portal)                    | WCAG-optimized                      |

### Categoria 3 — Custom

| #   | Fonte  | Quando                                                           |
| --- | ------ | ---------------------------------------------------------------- |
| 8   | custom | Última opção. Justifica no marker. ADR se for reusável (3+ usos) |

**Regra de fechamento:** parar na primeira camada que atende. Não pular pra
custom pulando catálogos só porque "parece mais rápido". Pesquisa < 3min via
MCP é regra, não opcional.

---

## Aceternity — fora do produto

**NÃO usar Aceternity UI dentro do PWA produto.**

- **Incompatível com stack** — Framer Motion-heavy; CLAUDE.md enforça
  `motion/react` (`framer-motion` em vocab banido ESLint)
- **Paywall** — $199 lifetime pros blocks principais
- **Mobile-first violation** — animações 3D/sparkles/beam matam Core Web
  Vitals (ADR-0020 bundle budgets per-rota)
- **A11y vaga** — sem audit reference (Origin UI declara React Aria
  explicitamente; Aceternity faz claim genérico)

Reservado pra marketing/landing externo se algum dia houver — nunca dentro
do produto.

---

## Libs primitivas — infra ortogonal à hierarquia

NÃO entram na busca por componente. Stack travado em CLAUDE.md:

- `motion@12` — animação custom. Presets em `lib/design/motion.ts` (tarefa 14)
- `vaul@1` — drawer primitive. Usar via `components/ui/drawer.tsx` (shadcn wrapper)
- `sonner@2` — toast primitive. Usar via `components/ui/sonner.tsx` (shadcn wrapper)
- Radix — internamente em shadcn primitives
- React Aria — internamente em Origin UI / Kibo UI

---

## Wrapper pattern obrigatório

**Onde customizar:** `components/app-<nome>.tsx` no root de `components/`.

```tsx
// RESEARCH: shadcn/ui card primitive + brand badge interno
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useBrand } from '@/lib/brand/BrandProvider'

export function AppPlanCard({ children }: { children: React.ReactNode }) {
  const brand = useBrand()
  return (
    <Card data-brand={brand.id}>
      <CardHeader>{brand.name}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
```

**Por quê:**

- `components/ui/*` é vendor surface — `npx shadcn add <component>` sobrescreve.
  Editar direto = customização perdida em qualquer update.
- Wrapper isola customização brand/feature/i18n da primitive.
- Permite atualizar shadcn sem auditoria diff por diff.

**Anti-pattern (ADR-0008 + incidente `7818df1`):**

```tsx
// ERRADO: editar components/ui/card.tsx pra adicionar logic brand
// Hook protect-eslint.sh + audit manual previne, mas regra de cabeça é:
// "ui/* = vendor, app-*/feature/* = customização"
```

---

## Feature-specific components

`features/<name>/components/` para componentes que SÓ aquela feature usa.
Promove pra `components/app-*.tsx` quando 3+ features compartilham.

`lib/<area>/components/` (raro) — só quando componente faz parte de stack
canônica de uma area `lib/*`. Ex: `lib/entitlements/components/` deferido JIT
(ADR-0034 §4).

---

## Referências

- ADR-0008 — shadcn 100% + hierarquia universal
- ADR-0037 — wrapper pattern + hierarquia granular (este doc é operacional)
- ADR-0036 — hooks PreToolUse JSON (gate determinístico)
- `.claude/hooks/component-research-gate.sh` — bloqueia Write sem marker
- `components/ui/*` — 47 primitives shadcn dia 0 (`pnpm shadcn add` pra novos)
