# 0042. Elevation tokens — 3 níveis canônicos (flat / raised / overlay)

Date: 2026-05-18
Status: accepted

## Context

Pesquisa Etapa 7 (referência: section 6 do DESIGN.md no `awesome-design-md`) revelou gap: nenhuma decisão registrada sobre profundidade visual no design system. Cada feature usava `shadow-sm`/`shadow-md`/`shadow-lg` Tailwind ad hoc — divergência cross-feature garantida.

Pesquisa em sistemas maduros (Linear, Notion, Stripe, Atlassian Polaris, Material 3):

- **3 níveis** é sweet spot (Linear, Notion)
- **5+ níveis** vira ruído (Material 3 original — depreciado em favor de tonal elevation)
- Mais elevação ≠ melhor hierarquia; pesquisa Linear mostra que **flat-ish profissional** vence Apple cinematográfico em B2B SaaS

## Decision

Adotar **3 níveis de elevation** em `app/globals.css @theme`, todas overridable runtime por tenant (futuro JIT — quando feature pedir):

| Token                 | Uso                                                                     | Implementação                                |
| --------------------- | ----------------------------------------------------------------------- | -------------------------------------------- |
| `--elevation-flat`    | Cards inline em listings, items secundários. Sem shadow — só border 1px | `box-shadow: 0 0 0 1px var(--color-border)`  |
| `--elevation-raised`  | Cards destacados, dropdowns, popover discretos, hover states            | shadow sutil (Tailwind shadow-sm equivalent) |
| `--elevation-overlay` | Dialog, Sheet, Drawer, popover sobre conteúdo                           | shadow forte (Tailwind shadow-lg equivalent) |

**Filosofia:** "flat-ish profissional" — Linear-leaning. Default = `flat` ou `raised`. `overlay` reservado pra surfaces que **flutuam acima** do conteúdo (modais).

## Consequences

**Positivas:**

- Decisão registrada — wrappers (`AppForm`, `AppEntitlementGate` paywall) usam `--elevation-overlay` automático
- Cross-feature consistência
- Cheaper que 5+ níveis (Material 3 deprecated path)
- Per-tenant override possível via theme.css endpoint (JIT)

**Negativas:**

- Tenant que pedir "design Apple cinematográfico" não cabe nos 3 níveis — exige expansão futura (ADR-superseding)
- Shadows usam `rgb()` com alpha (convenção industry pra box-shadow), não OKLCH — coexistência com nossas paletas OKLCH é OK (shadows são neutras black-based)

## Implementation

`app/globals.css @theme`:

```css
--elevation-flat: 0 0 0 1px var(--color-border);
--elevation-raised: 0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.06);
--elevation-overlay: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
```

Uso em wrappers/features:

```tsx
<div style={{ boxShadow: 'var(--elevation-raised)' }}>...</div>
// ou className arbitrary value:
<div className="shadow-[var(--elevation-overlay)]">...</div>
```

Allowlist hook: `globals.css` já está no `block-token-bypass.sh` allowlist — `rgb()` em shadows OK.

## Referências

- Linear design (referência primária — flat-ish profissional)
- `docs/references/design-systems/linear.app/DESIGN.md` §6 (Depth & Elevation)
- ADR-0040 §H (APCA Silver — elevations respeitam contrast)
- Material 3 tonal elevation deprecation discussion (m3.material.io)
