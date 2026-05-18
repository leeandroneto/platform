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

- pesquisa web direta 2026-05-18 (WebSearch dos 6 catálogos) documentaram o
  estado atual:

* **Origin UI** — Tailwind v4 nativo, A11y forte (Radix + **React Aria**),
  centenas de variações de primitives shadcn-compatible
* **Kibo UI** — adquirida pela **Shadcnblocks** (governance umbrella), 1000+
  variants compostas, wraps headless libs complexas
* **Reui** — **1003+ componentes**, data-grid TanStack v8 production-ready
  (sort/filter/pagination/virtualization/infinite-scroll/row-pinning)
* **Tremor** — 35+ componentes dashboard analytics, alegado Vercel-backed;
  trade-off real: design tokens divergentes exigem unificação manual
* **billingsdk** — especialista billing (price-table, plan-card,
  customer-portal, billing-settings), WCAG-optimized
* **Aceternity** — marketing/landing animado, **Framer Motion-heavy**
  (incompatível com regra "NUNCA framer-motion" em CLAUDE.md), paywall
  $199 lifetime pros blocks principais, A11y vaga (sem audit reference)

Todos shadcn-registry-compatible — instaláveis via `npx shadcn add <url>` ou
copy-paste manual pra `components/app-*.tsx`. **Não são `pnpm add` npm
namespace packages** (correção do entendimento original desta ADR).

## Decision

### A. Hierarquia em 3 categorias (atualiza ADR-0008)

Ordem de busca para qualquer componente UX, alta → baixa prioridade.
**Ordering pesquisado 2026-05-18** (web direct survey dos catálogos).

**Categoria 1 — Vendor canônico (instalado em `components/ui/`):**

1. **shadcn blocks** — `mcp__shadcn__search` filtro block. Composição
   pronta (dashboard, auth, sidebar). Blocks-first quando cobrem 80%+ do
   caso de uso
2. **shadcn primitives** — `mcp__shadcn__list-components`. Building
   blocks (button, input, dialog, sheet, card, drawer, sonner, ...)

**Categoria 2 — Catálogos copy-paste shadcn-compatible:**

Não são `pnpm add` (não existem como npm dependency); são copiados para
`components/app-<nome>.tsx` ou `features/<X>/components/` via
`npx shadcn add <url-do-registry>` ou copy manual.

3. **Origin UI** (origin-ui.com) — primeira parada pra variações ricas
   de primitives (multi-select, time picker, avatar-stack, command
   palette). A11y forte (Radix + React Aria). Tailwind v4 nativo
4. **Kibo UI** (kibo-ui.com) — Shadcnblocks-backed. Padrões SaaS-shaped
   (kbd shortcuts, announcement-bar, color-picker, code blocks, dropzone).
   1000+ variants
5. **Reui** (reui.io) — **data-grid TanStack v8** production-ready é o
   destaque (29 comp data-grid alone). Cobre o gap mais doloroso de
   shadcn (tables ricas). 1003+ componentes totais
6. **Tremor** (tremor.so) — especialista dashboards/charts (35+ comp KPI,
   sparkline, area, gauge). Trade-off: design tokens próprios — unificar
   com OKLCH do projeto exige trabalho manual
7. **billingsdk** (billingsdk.com) — especialista billing UI. Útil pra
   ADR-0034 entitlements (price-table, plan-card, customer-portal).
   Frequência baixa (2-3 telas no projeto inteiro) → posição final dos
   catálogos

**Categoria 3 — Custom:**

8. **custom** — última opção, com justificativa no marker. ADR
   registrando se for abstração reusável (3+ usos)

**Regra de fechamento:** parar na primeira camada que atende. Não pular
pra custom só porque "parece mais rápido". Pesquisa < 3min via MCP é
regra, não opcional.

### A.1. Excluídos do produto

**Aceternity UI** está **fora da hierarquia do PWA produto**:

- **Incompatível com stack** — Framer Motion-heavy; CLAUDE.md "Stack
  travado" enforça `motion/react` ("NUNCA `framer-motion`"; vocab banido
  ESLint enforce)
- **Paywall $199 lifetime** pros blocks/templates principais — quebra
  princípio de stack open-source
- **Mobile-first violation** — animations 3D/sparkles/beam pesadas
  matam Core Web Vitals em PWA mobile (ADR-0020 bundle budgets per-rota)
- **A11y vaga** — claims genéricos sem audit reference. Origin UI declara
  React Aria explicitamente; Aceternity não
- **Marketing-only por design** — sem landing/marketing site separado no
  escopo do PWA produto, nunca cabe

Reservar Aceternity como exceção restrita apenas para site marketing
externo se algum dia houver — nunca para componente dentro do produto.

### A.2. Libs primitivas — infra ortogonal

NÃO entram na hierarquia (não são catálogos de componente):

- **`motion@12`** — animação custom. Presets em `lib/design/motion.ts`
  (tarefa 14 Checklist 15)
- **`vaul@1`** — drawer primitive. Wrappeado por `components/ui/drawer.tsx`
- **`sonner@2`** — toast primitive. Wrappeado por `components/ui/sonner.tsx`
- **Radix** — wrappeado por shadcn primitives
- **React Aria** — usado internamente por Origin UI / Kibo UI

Stack travado em CLAUDE.md. Quando precisar de animação/drawer/toast,
usar diretamente esses (não procurar em catálogo).

ADR-0008 permanece `accepted` — princípio universal sobrevive. Esta ADR
operacionaliza o ponto 3 ("pattern comunidade documentado") com
categorias + ordering pesquisado.

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

- 5 catálogos pra varrer pode causar fadiga de decisão — mitigação: parar na
  primeira camada que atende, hierarquia é guia não exigência
- MCP shadcn adiciona startup overhead (`npx shadcn@latest mcp` cold start
  ~2s) — aceitável, roda só quando MCP tool é invocada
- Cada catálogo tem registry endpoint próprio e formato JSON levemente
  diferente — `npx shadcn add` lida bem mas debugging registry-specific
  exige conhecer convenção do catálogo (ex: Origin UI vs Kibo UI)

**Neutro:**

- ADR-0008 mantida `accepted` — esta operacionaliza, não supersede
- Skill custom shadcn deferida JIT (MCP cobre 80%)
- Lista de registries pode crescer; novo registry = atualização desta ADR
  (`.claude/rules/components.md` lista operacional sincronizada)

## Update 2026-05-18 (Decision A, pendente Research 18)

§B (wrapper pattern obrigatório) está **em revisão** pelo Founder:

1. **Edit-primitives policy aberta.** A premissa "nunca editar `components/ui/*`
   direto" da Pesquisa 17 pode ser insuficiente para multi-tenant white-label
   (displayName/aria-labels/copy default em EN dentro do próprio primitive
   conflitam com regra "zero hardcoded EN"). Research 18 deve responder se
   editar primitives diretamente é aceitável (com mecanismo de re-merge upstream
   via comentários `// shadcn-original:` por linha) ou se wrapper-only é mandatório.

2. **Blocks-first reforçado.** A ordem da Decisão A item 1 (`shadcn blocks` antes
   de `shadcn primitives`) é prioritária — quando um block resolve 80%+ do caso
   de uso, instalar primitives soltos é anti-pattern. Hook gate deve evoluir
   pra detectar isso.

3. **Quarentena de lint removida temporariamente.** ADR-0031 §1 (overrides path-aware
   pra `components/ui/**` + blocks copiados) e §7 (`hooks/use-mobile.ts`) foram
   removidos. Estado honesto: ~200 erros lint visíveis nos 47 primitives até
   Research 18 desenhar zona quarentenada definitiva (narrowest rules off +
   no-restricted-imports patterns + hook MCP-only).

4. **Princípio §39 + MCP shadcn ativo** continuam valendo. Defer JIT mantido —
   Sprint 2+ vai trazer primeira feature consumer, e nesse momento aplicamos
   a solução final da Research 18.

Solução definitiva entrará em ADR-0040 (ou patch desta) quando Research 18 voltar.
