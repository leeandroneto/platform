# 0024. Multi-brand via hostname, não env

Date: 2026-05-17
Status: accepted (schema `platform.*` consolidado em `public.*` via ADR-0033 — `public.brands` agora)

## Context

Boilerplate inicial assumiu 1 deploy por marca filha (`NEXT_PUBLIC_BRAND_NAME=desafit` no env). Fundador esclareceu: é **1 código + 1 deploy + N marcas filhas** via hostname. desafit.app, yoga.app, ingles.app apontam pro mesmo Vercel project. Brand identidade resolvida em runtime por host do request.

## Decision

Brand identity vive em tabela `platform.brands` (não em env). Resolução:

1. **Domínios múltiplos** apontam pro mesmo Vercel project (`platform`)
2. **`proxy.ts` Next 16** lê `Host` header, faz lookup `getBrandByHost(host)`
3. Brand injetada em request context via cookie ou header propagado
4. **`<BrandProvider>`** RSC injeta no React tree (logo, primary_color, default_vertical)
5. Tenants pertencem a 1 brand (`platform.tenants.brand_id`)
6. CSS via API route (D-G59) deriva tokens da brand + tenant override

Schema `platform.brands` (dia 1 — atualizado pós-ADR-0028):

```
brands (id, name, host, default_palette_id uuid NOT NULL FK platform.palettes,
        logo_url, default_vertical, parent_label, theme_version int default 1,
        created_at)
```

Removido `primary_color_oklch` (era drift). Brand sempre aponta pra paleta no banco (ADR-0028).

Adicionar nova marca filha (yoga, ingles) = `INSERT platform.brands` + comprar domínio + apontar pro mesmo Vercel deploy. **Zero refactor de código.**

## Consequences

**Positivo:**

- 1 deploy serve N marcas (não fragmenta operação)
- Zero env per brand (deploy é único)
- Adicionar marca = INSERT + DNS, não rebuild
- Tenants compartilham infra (cache, edge regions)

**Negativo:**

- 1 lookup DB por request inicial (mitigação: cache em-memória com TTL 60s no edge)
- Falha de DB = falha de todos os domínios (mitigação: fallback default brand hardcoded em ENV pra emergência)

**Neutro:**

- ESLint rule `brand/no-brand-hardcode` mantém: literal `desafit`/`yoga.app`/`ingles.app` bloqueado em código
- `_boilerplate/lib/brand/` (`getBrandByHost.ts` + `BrandProvider.tsx`) implementa helper
- `_boilerplate/root/env.example` remove `NEXT_PUBLIC_BRAND_*`
- ADR-0022 (marca pai comercial zero tech) permanece válido — marca pai vive em footer, não em código
