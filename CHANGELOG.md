# Changelog

Todas as mudanças notáveis do projeto `platform` (multi-brand white-label SaaS).
Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versionamento: [SemVer](https://semver.org/spec/v2.0.0.html).

Categorias: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
Cita ADR-NNNN ou issue-NN quando aplicável. 1 entrada por mudança user-facing (não por commit).

---

## [Unreleased]

### Added

- Bootstrap completo do greenfield `platform` — Next.js 16, React 19, Tailwind v4, Supabase `@supabase/ssr` 0.10, Motion 12 (ADR-0008, ADR-0014)
- 29 ADRs Michael Nygard (ADR-0017) cobrindo decisões fundacionais — schema sizing, multi-brand, multi-domain, template→instance, RLS performance
- 18 blueprints técnicos em `docs/blueprint/` cobrindo arquitetura, stack, design system, data model, AI prompts, PWA, packages A/B/C, roadmap, lint, docs lifecycle
- 24 regras ESLint custom — token bypass, vocab banido, brand hardcode, i18n hardcoded, boundaries domain→data→hooks→UI via Sheriff (ADR-0012)
- Migration `0001_initial` — 25 tabelas `platform.*` + 12 `public.*` + RLS 5 categorias + 8 functions + triggers handle_new_user + custom_access_token_hook
- Seed dia 0 — 13 paletas OKLCH oficiais + 7 fontes + 3 shape presets + 5 push templates + 4 email templates + brand `desafit`
- Migration `0002_table_grants` — GRANTs Supabase-canonical (anon read, authenticated CRUD)
- Migration `0003_security_hardening` — pg_trgm em extensions schema + REVOKE RPC exposure de 7 trigger-only functions
- Migration `0004_restore_rls_helper_grants` — restaurado GRANT EXECUTE em `current_tenant_id()` e `current_user_role()` (necessário pra RLS USING clauses)
- 5 storage buckets — avatars, programs-covers, components-media, tenant-logos, brand-assets
- Scripts auto-update docs — `pnpm adr:index` + `pnpm docs:validate` + `pnpm docs:status`
- ADR-0031 — 10 lint overrides intencionais por path (shadcn vendor + scripts CLI + configs + boundary exceptions + generated types + seed data + boot-time throws)
- ADR-0032 — escopo do validator APCA de paletas; primary é bg de action (não fg de texto), validamos cenários reais (body+filled-block, threshold APCA-W3 Silver 30)
- ADR-0033 — consolidação `platform.*` → `public.*` (1 schema único). Migration 0005 movimentou 25 tabelas + reescreveu 8 functions + 3 policies + 3 defaults; schema platform dropado em 0006. MCP/PostgREST/tooling agora canonicamente
- Rota `/portal` (`app/(client)/portal/`) — área do cliente final EN puro, multi-vertical compatible (substitui `/aluno/*` rewrite, que era fitness-only)
- Blueprint 05 §3 ganhou tabela "Design tokens — uso" com onde-usar/não-usar de cada token
- ADR-0034 — Vertical slice (`features/<name>/` self-contained) + entitlements model (`public.plans.features jsonb` + `lib/entitlements/` server+client helpers + Sheriff feature-to-feature boundaries + ESLint rule `plan-gates-required`). Adicionar feature = criar 1 pasta; remover = deletar 1 pasta
- ADR-0035 — UX de feature gating em 3 tipos: A (visible + paywall modal pra niche), B (visible + tooltip pra core), C (quota banner pra limites numéricos). **Componentes shared `lib/entitlements/components/` — DEFERIDOS JIT** (tentativa inicial em 7818df1 criou do zero com strings hardcoded; revertida)
- `lib/contracts/entitlements.ts` — Zod schemas (`PlanFeaturesSchema`, `PlanSlugSchema`) usados como boundary DB → runtime em `lib/entitlements/server.ts` (substitui casts `as unknown as` perigosos)
- `EntitlementProvider` wired em `app/layout.tsx` — DynamicShell fetcha snapshot via `getEntitlementSnapshot()` e hidrata client context (sem isso `useEntitlement` retornava sempre permissive)
- Tarefa 25.5 inserida no Checklist 15 — vertical slice setup + entitlements + migration 0006 plans table
- ADR-0037 — Wrapper pattern + hierarquia registries granular (slugs canônicos `@origin-ui` → `@kibo-ui` → `@billingsdk` → `@aceternity` → `@reui` → `@tremor` → custom). Atualiza ADR-0008. shadcn MCP server registrado em `.mcp.json` (gerado por `pnpm shadcn mcp init --client claude`). `.claude/rules/components.md` lista operacional carregada em pastas de componentes (`components/**`, `features/**/components/**`, `lib/**/components/**`). Wrapper pattern obrigatório: customização em `components/app-<nome>.tsx`, nunca editar `components/ui/*` direto. Audit em `components/ui/`: 47 primitives pristine (zero edits desde bootstrap `95a092d`).
- ADR-0036 — Hooks PreToolUse JSON output (stdout `permissionDecision:"deny"` + exit 0, contorna bug `anthropics/claude-code#13744`) + `@eslint-community/eslint-plugin-eslint-comments@4` com `no-use:error` + `linterOptions.noInlineConfig:true` + `linterOptions.reportUnusedDisableDirectives:'error'`. Allowlist 2-padrões de ADR-0012 retirada (zero uso histórico). 4 hooks `.claude/hooks/`: `block-token-bypass.sh` (hex/rgba, migrado pra JSON e renomeado de `block-disables.sh` por clareza de escopo), `protect-eslint.sh` (eslint.config-dot-star read-only), `block-disable-content.sh` (disable comment + `noInlineConfig` + `reportUnusedDisableDirectives` literais com skip pra eslint.config), `component-research-gate.sh` (Write em pastas de componentes — `components`, `features/<name>/components`, `lib/<name>/components` — exige marker `// RESEARCH: <fonte>` linha 1)

### Changed

- Schema rename `desafit.*` → `core.*` → `platform.*` (ADR-0021 superseded by ADR-0025) — multi-marca real, não 1 marca por schema
- Pools de customização movidos de hardcoded para banco (ADR-0028) — admin adiciona paleta/fonte sem deploy
- Template→Instance pattern unificado (ADR-0029) — pages, programs, forms E paletas via mesmo padrão `source_template_id` + `created_by_tenant_id`
- `scripts/validate-palettes.ts` — testa 2 cenários reais (body text + non-text delimiter) em vez de `APCA(primary, surface-1)` que era inútil (ADR-0032)
- `proxy.ts` — requer host header (responde 400 se ausente); removido fallback hardcoded `'desafit.app'` (regra naming.md — brand sempre via env/route)
- `lib/env.ts:NEXT_PUBLIC_DEFAULT_BRAND_HOST` — agora `min(1)` sem default; env obrigatória no boot

### Removed

- `platform.tenant_branding` tabela — branding inline em `public.tenants` (ADR-0028)
- `platform.tenants.custom_primary_oklch` coluna — substituído por clone pattern via `public.palettes.source_palette_id` (ADR-0029)
- `platform.brands.primary_color_oklch` coluna — sempre via `default_palette_id` FK (ADR-0028)
- Schema `platform` — consolidado em `public` (ADR-0033)
- Rewrite `/aluno/:path* → /client/:path*` em `vercel.ts` — `aluno` é fitness-only; rota EN `/portal` cobre todas verticais
- Fallback hardcoded `'desafit.app'` em `proxy.ts`, `app/layout.tsx`, `lib/env.ts` — brand resolution puramente via host + DB lookup

### Fixed

- `knip.config.ts` faltava `features/**` path em `project` + entitlements `{server,client}.ts` em `entry` + `lint-staged` em `ignoreDependencies` (tech debt do Commit B detectado em Phase A close — knip reportava falsos positivos `requireEntitlement`/`FeatureGate` unused porque consumers em `features/_template/` estavam fora do scope)
- Reverted commit `7818df1` parcial — deletado `lib/entitlements/components/` + ESLint override §11 (criação de componentes UX violou ADR-0008 hierarquia e multi-tenant white-label). Mantido stack canônica (server/client/types/Provider). Componentes deferidos JIT (ADR-0034 §4 + ADR-0035 atualizados)
- `app/layout.tsx` agora wire `<EntitlementProvider>` com snapshot do server (sem isso `useEntitlement` retornava sempre permissive)
- `lib/entitlements/server.ts` agora valida boundary DB → runtime via `PlanFeaturesSchema`/`PlanSlugSchema` Zod (substitui 2 casts `as unknown as` perigosos)
- `lib/contracts/entitlements.ts` novo — SSOT Zod schemas dos entitlements

### Security

- RLS habilitada em 100% das tabelas tenant-scoped com policies separadas por operação (SELECT/INSERT/UPDATE/DELETE)
- `(SELECT fn())` wrap em todas as policies — initPlan caching (benchmark Supabase docs: 94-99% improvement)
- `current_tenant_id()` declarada `STABLE` para garantir caching do planner Postgres
- `handle_new_user` trigger com `SECURITY DEFINER SET search_path = ''` — mitigação CVE-2018-1058
- REVOKE EXECUTE de hook functions de roles públicas (anon, authenticated, public)

---

## Como adicionar entrada

1. Antes de PR mergeable, adicione bullet em `[Unreleased]` na categoria certa
2. Cite ADR-NNNN ou blueprint que motivou a mudança
3. Foque em "o que muda pro usuário/dev externo", não diff técnico
4. Em release: mover bullets de `[Unreleased]` pra nova versão `[X.Y.Z] - YYYY-MM-DD`, bump SemVer
