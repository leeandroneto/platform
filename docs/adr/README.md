# ADRs — Architecture Decision Records

> Decisões fechadas. Template: Michael Nygard (ADR-0017).
> Imutáveis após `accepted` — superseded via novo ADR.
> Gerado por `pnpm adr:index`. **Não edite manualmente.**

## Índice

| # | Título | Status | Data |
|---|---|---|---|
| 0001 | Schema sizing dia 1 | accepted | 2026-05-17 |
| 0002 | Sem tabela TACO/TBCA dia 1 | accepted | 2026-05-17 |
| 0003 | Priorização de automações por dor real | accepted | 2026-05-17 |
| 0004 | Gamificação dia 1 via prompt-as-product | accepted | 2026-05-17 |
| 0005 | Cronograma agressivo: 10 tenants em 4 meses | accepted | 2026-05-17 |
| 0006 | Construir funil comercial antes de outreach | accepted | 2026-05-17 |
| 0007 | Mobile-first 100% incluindo painel profissional | accepted | 2026-05-17 |
| 0008 | shadcn 100% + hierarquia universal de busca de soluções | accepted | 2026-05-17 |
| 0009 | Critério premium: subset mais rico consistente | accepted | 2026-05-17 |
| 0010 | Personalização unificada (não por tier de pacote) | accepted | 2026-05-17 |
| 0011 | Editor híbrido assimétrico 80/20 | accepted | 2026-05-17 |
| 0012 | Lint enforcement multi-camada dia 0 | accepted | 2026-05-17 |
| 0013 | Ladle como catálogo visual (não Storybook) | accepted | 2026-05-17 |
| 0014 | Serwist + Turbopack para PWA service worker | accepted | 2026-05-17 |
| 0015 | PWA offline: idb-keyval + autosave 800ms + visualViewport | accepted | 2026-05-17 |
| 0016 | Pipeline UI dia 0 expandido (~70h) | accepted | 2026-05-17 |
| 0017 | ADR Michael Nygard per-arquivo | accepted | 2026-05-17 |
| 0018 | Hierarquia da fonte da verdade documental | accepted | 2026-05-17 |
| 0019 | Setup 4 telas é fase 2 SaaS (M5+), não MVP | accepted | 2026-05-17 |
| 0020 | Bundle budgets per-rota enforced no CI | accepted | 2026-05-17 |
| 0021 | Schema rename `desafit.*` → `core.*` (multi-marca) | superseded by 0025 (schema `platform.*` posteriormente consolidado em `public.*` via ADR-0033) | 2026-05-17 |
| 0022 | Marca pai (holding) é identidade comercial, zero tech dia 1 | accepted | 2026-05-17 |
| 0023 | Onboarding.bio retomada futura: Supabase + repo separados | accepted | 2026-05-17 |
| 0024 | Multi-brand via hostname, não env | accepted (schema `platform.*` consolidado em `public.*` via ADR-0033 — `public.brands` agora) | 2026-05-17 |
| 0025 | Schema rename `core.*` → `platform.*` | superseded by 0033 (schema `platform.*` consolidado em `public.*` em 2026-05-18 — naming "platform" sobrevive como nome do repo/projeto, não schema) | 2026-05-17 |
| 0026 | Multi-domain por tenant (subdomain grátis + custom domain) | accepted (schema `platform.*` consolidado em `public.*` via ADR-0033 — `public.domains` agora) | 2026-05-17 |
| 0027 | Tenant customization scope (cor, tipografia, shape) | superseded by 0028 (schema parcial — princípio "3 eixos dia 1" mantido) + schema `platform.*` consolidado em `public.*` via ADR-0033 | 2026-05-17 |
| 0028 | Pools de customização (paletas, fontes, shapes) no banco | superseded by 0029 (paletas: clone pattern em vez de `custom_primary_oklch`) + schema `platform.*` consolidado em `public.*` via ADR-0033 | 2026-05-17 |
| 0029 | Template→Instance pattern unificado (pages, programs, forms, paletas) | accepted (schema `platform.*` consolidado em `public.*` via ADR-0033 — templates oficiais em `public.*_templates`, instâncias em `public.{pages,programs,capture_forms,palettes}`) | 2026-05-17 |
| 0030 | Relax `exactOptionalPropertyTypes` (shadcn upstream incompat) | accepted | 2026-05-17 |
| 0031 | Lint overrides intencionais (escopos pre-positioned) | accepted (schema `platform.*` consolidado em `public.*` via ADR-0033 — `lib/contracts/database.ts` regenerado só `public`, sem mudança nas regras de override) | 2026-05-17 |
| 0032 | Validator paletas — escopo X (primary ≠ texto) | accepted | 2026-05-17 |
| 0033 | Consolidação `platform.*` → `public.*` (1 schema) | accepted | 2026-05-18 |
| 0034 | Vertical slice `features/` + entitlements model | accepted | 2026-05-18 |
| 0035 | UX de feature gating: visible + badge PRO + paywall | accepted | 2026-05-18 |
