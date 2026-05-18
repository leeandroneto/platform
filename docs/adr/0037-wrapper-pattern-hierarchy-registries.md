# 0037. Wrapper pattern + hierarquia registries granular

Date: 2026-05-18
Status: accepted

## Context

ADR-0008 instituiu princípio universal "shadcn 100% + hierarquia de busca" com
3 camadas (oficial → lib madura → comunidade → custom). Funciona como princípio,
mas falha na operacionalização:

1. **Hierarquia abstrata.** Sem slugs canônicos, Claude (ou humano) pesquisa
   no Google e cai em registry aleatório.
2. **Sem regra de wrapper.** Incidente `7818df1` (revertido em `4be49e3`) mostrou
   Claude criando 5 componentes UX do zero E violando "wrapper, não fork" —
   editaria primitives shadcn direto se a oportunidade aparecesse.
3. **MCP existia mas não estava conectado.** Pesquisa via grep manual ≠ via
   `mcp__shadcn__list-components`.

Pesquisa `docs/research/17-guardrails-ia-shadcn-governanca.md` (2026-05-18)
documentou registries maduros disponíveis hoje:

- **@origin-ui** — variações ricas (avatar-stack, multi-select, command palette)
- **@kibo-ui** — padrões SaaS (announcement-bar, color-picker, kbd)
- **@billingsdk** — billing-specific (price-table, plan-card, usage-meter)
- **@aceternity** — marketing/landing animado
- **@reui** — charts/data-viz
- **@tremor** — dashboard analytics (continua mantido pós-merge shadcn)

Cada um com naming convention própria, registry endpoint próprio, mas todos
compatíveis com shadcn CLI (`npx shadcn add <slug>`).

## Decision

### A. Hierarquia granular com slugs canônicos (atualiza ADR-0008)

Ordem de busca para qualquer componente UX, alta → baixa prioridade:

1. **shadcn blocks** — `mcp__shadcn__search` com filtro block
2. **shadcn primitives** — `mcp__shadcn__list-components`
3. **`@origin-ui/<name>`** — `npx shadcn add @origin-ui/<name>`
4. **`@kibo-ui/<name>`** — `npx shadcn add @kibo-ui/<name>`
5. **`@billingsdk/<name>`** — `npx shadcn add @billingsdk/<name>`
6. **`@aceternity/<name>`** — `npx shadcn add @aceternity/<name>`
7. **`@reui/<name>`** — `npx shadcn add @reui/<name>`
8. **`@tremor/<name>`** — `npx shadcn add @tremor/<name>`
9. **custom** — só após 1-8 falharem, com justificativa no marker

Regra de fechamento: parar na primeira camada que atende.

ADR-0008 permanece `accepted` — princípio universal sobrevive. Esta ADR
operacionaliza o ponto 3 ("pattern comunidade documentado") com slugs.

### B. Wrapper pattern obrigatório

Customização SEMPRE em `components/app-<nome>.tsx` no root de `components/`,
**nunca** editar `components/ui/*` direto.

```tsx
// RESEARCH: shadcn/ui card primitive + brand badge interno
import { Card, CardContent } from '@/components/ui/card'
import { useBrand } from '@/lib/brand/BrandProvider'

export function AppPlanCard(props) {
  const brand = useBrand()
  return <Card data-brand={brand.id}>{props.children}</Card>
}
```

Razão:

- `components/ui/*` é vendor surface — `npx shadcn add --overwrite` sobrescreve.
- Wrapper isola customização brand/feature/i18n da primitive.
- Auditoria de update shadcn = `git status components/ui/` + sem surpresas.

### C. shadcn MCP server obrigatório

`.mcp.json` no root com:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

Habilita `mcp__shadcn__list-components`, `mcp__shadcn__search`,
`mcp__shadcn__view`. Gerado via `pnpm shadcn mcp init --client claude`.

### D. Gate determinístico via hook

Hook `component-research-gate.sh` (ADR-0036 §B.4) bloqueia Write em
`components/**`, `features/*/components/**`, `lib/**/components/**` sem marker
`// RESEARCH: <fonte>` linha 1. Esta ADR é o playbook; o hook é o enforce.

### E. Princípio §39 mantido

Mesmo com MCP + hierarquia explícita, **defer JIT continua valendo.** Pesquisa
trivial ≠ criação obrigatória. Promover de inline → wrapper só com 3+ usos
reais.

### F. Skill shadcn/ui

Skill `vercel:shadcn` já disponível no harness (system reminder dia 0). MCP
cobre ~80% do uso (list, search, view, add). Skill instalável customizada
pendente até dor real — defer JIT.

## Consequences

**Positivo:**

- Hierarquia executável (slugs canônicos pesquisáveis via MCP)
- Wrapper pattern impossível de violar acidentalmente (vendor surface
  protegida por auditoria pós-add + audit manual)
- `npx shadcn add <slug>` torna instalação de qualquer camada idêntica —
  zero atrito entre origin-ui vs shadcn vs aceternity
- Marker `// RESEARCH:` força documentação de origem (leitor futuro sabe de
  onde veio cada peça)

**Negativo:**

- 6 registries pra varrer pode causar fadiga de decisão — mitigação: parar na
  primeira camada que atende, hierarquia é guia não exigência
- MCP shadcn adiciona startup overhead (`npx shadcn@latest mcp` cold start
  ~2s) — aceitável, roda só quando MCP tool é invocada

**Neutro:**

- ADR-0008 mantida `accepted` — esta operacionaliza, não supersede
- Skill custom shadcn deferida JIT (MCP cobre 80%)
- Lista de registries pode crescer; novo registry = atualização desta ADR
  (`.claude/rules/components.md` lista operacional sincronizada)
