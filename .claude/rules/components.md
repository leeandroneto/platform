---
name: Componentes UX — hierarquia + wrapper pattern
description: Antes de qualquer Write em pasta de componentes, consultar hierarquia + inserir marker. Defer JIT continua valendo.
paths:
  - 'components/**/*.{ts,tsx}'
  - 'features/**/components/**/*.{ts,tsx}'
  - 'lib/**/components/**/*.{ts,tsx}'
---

## Princípio §39 — defer JIT

**NÃO criar componente UX antes de dor real.** Mesmo com shadcn MCP + registries
catalogados, a regra continua: usar shadcn primitive direto ou composição inline
em página até feature precisar 3+ vezes. Aí promove pra wrapper. Lista canônica
do que JÁ existe: `mcp__shadcn__list-components` (47 primitives shadcn dia 0).

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

## Hierarquia granular (ADR-0008 + ADR-0037)

Ordem de busca (alta → baixa prioridade):

| #   | Fonte                 | Slug pra MCP / npm   | Quando                                                          |
| --- | --------------------- | -------------------- | --------------------------------------------------------------- |
| 1   | shadcn **blocks**     | `shadcn` blocks      | Padrão composto pronto (dashboard, auth, sidebar)               |
| 2   | shadcn **primitives** | `shadcn` ui          | Building blocks: button, input, dialog, sheet, card...          |
| 3   | `@origin-ui/*`        | `@origin-ui/<name>`  | Variações ricas de primitives (avatar-stack, multi-select)      |
| 4   | `@kibo-ui/*`          | `@kibo-ui/<name>`    | Padrões SaaS (announcement-bar, color-picker, kbd)              |
| 5   | `@billingsdk/*`       | `@billingsdk/<name>` | Billing-specific (price-table, plan-card, usage-meter)          |
| 6   | `@aceternity/*`       | `@aceternity/<name>` | Marketing/landing (hero animado, sparkles, beam)                |
| 7   | `@reui/*`             | `@reui/<name>`       | Charts + data-viz extensions                                    |
| 8   | `@tremor/*`           | `@tremor/<name>`     | Dashboard analytics (ainda mantido pós-shadcn merge)            |
| 9   | **custom**            | —                    | Última opção. Justifica no marker (`// RESEARCH: custom — ...`) |

**Regra de fechamento:** parar na primeira camada que atende. Não pular pra
custom pulando @origin-ui/etc só porque "parece mais rápido". Pesquisa < 3min
via MCP é regra, não opcional.

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
