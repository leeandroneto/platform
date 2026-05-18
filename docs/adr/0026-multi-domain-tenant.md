# 0026. Multi-domain por tenant (subdomain grátis + custom domain)

Date: 2026-05-17
Status: accepted (schema `platform.*` consolidado em `public.*` via ADR-0033 — `public.domains` agora)

## Context

ADR-0024 estabelece multi-brand via hostname (`desafit.app`, `yoga.app`...). Mas cada profissional dentro de uma marca filha também tem domínio próprio:

1. **Subdomain grátis (todos os pacotes):** `<slug>.desafit.app` provisionado automático no signup
2. **Custom domain (Pacote B/C):** `<prof>.com.br` apontando via CNAME pra plataforma (Cloudflare for SaaS)

Faltava modelar a tabela + ajustar o resolver `getBrandByHost` pra retornar `{ brand, tenant }` em vez de só `brand`. Referência: `10-pacote-b-c.md §1.3` + pesquisa 01 §1.3/§1.4.

## Decision

**Tabela `platform.domains`** (1:N de tenant):

```
domains (
  id, tenant_id, host, kind enum('subdomain'|'custom'),
  is_primary bool, verified_at, ssl_status enum, created_at
)
```

**Resolver `getRouteByHost(host)`** retorna `{ brand, tenant }`:

1. Lookup em `platform.domains.host` → tenant_id direto (subdomain ou custom)
2. Se não casar, lookup em `platform.brands.host` → brand-root (landing institucional, sem tenant)
3. Se ambos falharem → 404

**Subdomain provisioning:** signup do prof cria `INSERT platform.domains (kind='subdomain', host='<slug>.desafit.app')` atomicamente.

**Custom domain (Pacote B/C):** prof aponta CNAME → Vercel SDK `projectsAddProjectDomain` provisiona SSL + INSERT `platform.domains (kind='custom')`. Verified async via webhook.

**Canonização:** prof escolhe primary (`is_primary=true`). Acessos não-primary fazem 301 redirect pro primary.

## Consequences

**Positivo:**

- 1 lookup resolve brand + tenant juntos (zero round-trip extra)
- Subdomain grátis dia 1 = friction zero pra primeiro tenant
- Custom domain Pacote B/C é upsell concreto (não vapor)
- Schema permite N domains por tenant (vanity URLs futuras, locale-per-domain, etc)

**Negativo:**

- Custom domain SSL provisioning Cloudflare/Vercel pode demorar 5-30min (UX precisa "verificando..." state)
- DNS misconfig do prof = ticket de suporte (mitigação: validação CNAME no UI antes de aceitar)

**Neutro:**

- `lib/brand/getBrandByHost.ts` renomeada pra `lib/route/getRouteByHost.ts` (retorna `{ brand, tenant }`)
- `proxy.ts` propaga `x-brand-id` + `x-tenant-id` + `x-tenant-slug` headers
- `BrandProvider` vira `RouteProvider` (expõe `useBrand()` + `useTenant()`)
- `_boilerplate/0001_initial.md` ganha tabela `platform.domains` (~24 tabelas baseline)
- Cache TTL 60s no edge mantém perf
