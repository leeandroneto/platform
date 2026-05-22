# Changelog

Todas as mudanças notáveis do projeto `platform` (multi-brand white-label SaaS).
Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versionamento: [SemVer](https://semver.org/spec/v2.0.0.html).

Categorias: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
Cita ADR-NNNN ou issue-NN quando aplicável. 1 entrada por mudança user-facing (não por commit).

---

## [Unreleased]

### Refactor (2026-05-21 — Theme schema flat alinhado TweakCN)

- `lib/design/contract/theme.ts`: `ThemeCommonSchema` removido, `ThemeColorsSchema` renomeado `ThemeStylePropsSchema` (45 keys flat). `ThemeSchema` vira `{ light, dark }` puro — sem `common`. `ThemePartialSchema` atualizado. Alinha 100% com `tweakcn-ref/types/theme.ts` upstream. Menos atrito pra importar presets TweakCN oficiais (Fase 6) e zero conversão pro shadcn registry (Fase 7).
- `lib/design/theme-defaults.ts`: `DEFAULT_COMMON` eliminado. `DEFAULT_THEME` flat com 11 keys duplicadas em `DEFAULT_LIGHT_COLORS` e `DEFAULT_DARK_COLORS` (mesmos valores, TweakCN-way). `ThemeColors` type substituído por `ThemeStyleProps`.
- `lib/design/build-theme-css.ts`: usa `theme.light` e `theme.dark` diretamente (sem merge com common). `generateShadowLevels()` recebe modo flat.
- `lib/design/shadows.ts`: parâmetro `common: ThemeCommon` substituído por `styleProps: ShadowPrimitives` (interface local com as 5 shadow primitives). Server-side safe, sem quebra de API.
- `lib/design/registry/generate-registry-item.ts`: simplificado — sem achatamento de common. `cssVars.theme` emite fontes + radius via `snapshot.light` (canonical pra COMMON_STYLES). Dark exclui explicitamente `spacing` e `letter-spacing` (padrão TweakCN registry).
- DB `snapshot jsonb` inalterado — `tenant_theme_versions` tinha 0 rows, sem migration de dados.
- Docs: `research-33`, `20-concept-map`, `0025 migration doc`, `_status` atualizados.

### Features (2026-05-21 — i18n wireup completo)

- `i18n`: next-intl 4.12.0 instalado e agora wired up — `i18n/request.ts` (locale `pt-BR` fixo ADR-0040 §G decisão 13) + `next.config.ts` plugin `createNextIntlPlugin` + `messages/pt-BR/common.json` (namespaces `actions/errors/validation/feedback/entitlements`) + `app/layout.tsx` wrap `NextIntlClientProvider` preservando `ThemeProviderClient` (next-themes Fase 4). ESLint rules `react/jsx-no-literals` + `i18next/no-literal-string` agora funcionam corretamente (pesquisa-39 follow-up).
- `Scripts`: `pnpm i18n:audit` adicionado — ESLint `app/**` + `lib/**` com `--max-warnings 0`.

### Database (2026-05-21 — Pivot ADR-0044 Fase 4)

- Migration `0025_theme_storage_versioning` — `ALTER tenants ADD active_theme_version_id` (FK nullable) · `CREATE tenant_themes` (catalogo per-tenant, `source` check IN preset/custom/ai-generated/imported-tweakcn, `parent_theme_id` self-FK pra fork Fase 5) · `CREATE tenant_theme_versions` (snapshot jsonb Hotmart-like, UNIQUE theme_id+version_number) · Triggers `prevent_theme_version_mutation` (G.1 imutável-on-insert) + `enforce_theme_version_cap` (G.2 cap 50) · RLS via `auth.jwt() ->> 'tenant_id'` em ambas tables (sem UPDATE/DELETE em versions). Migration `0025b_pin_theme_version_function_search_path` — pin `search_path` nas 2 funções (fecha advisor WARN).

### Features (2026-05-21 — Pivot ADR-0044 Fase 4)

- Server actions `app/admin/theme-studio/actions.ts` (+ `_helpers.ts`): `bootstrapTenantTheme` (lazy G.5), `saveThemeVersion` (Zod-validate + immutable insert), `listThemeVersions` (paginated 50, marca isActive), `restoreThemeVersion` (swap FK G.1, valida cross-tenant). 4 testes minimos vitest. `forkTheme` deferido pra Fase 5 (G.3).
- `next-themes` wired up em `app/layout.tsx` via novo `app/_components/theme-provider-client.tsx` (client wrapper). `defaultTheme = tenant.theme_mode` (G.4 — 'auto' → 'system').
- `app/layout.tsx` `<ThemeStyle>` consome `route.tenant?.active_theme_version?.snapshot ?? DEFAULT_THEME`. Brand-root e tenants sem bootstrap continuam DEFAULT_THEME.
- `lib/route/getRouteByHost.ts` query enriquecida com nested join `active_theme_version:active_theme_version_id (id, version_number, snapshot)` + `theme_mode`. `lib/route/types.ts` interface `Tenant` ganhou as 3 colunas. `lib/contracts/database.ts` regenerado via MCP.
- 3 PWA tenant routes (`manifest.webmanifest`, `icon/[size]`, `splash/[size]`) — select inclui `active_theme_version` + consome snapshot quando disponível, fallback DEFAULT_THEME. **Brand routes não mexidas** (brands não têm theme storage nesta fase).

### Database (2026-05-21 — Pivot ADR-0044 Fase 1.5)

- Migration `0024_drop_design_system_orphans` — drop tenants.{archetype_id, previous_archetype_id, archetype_changed_at, palette_id, font_id}, brands.default_palette_id, functions default_palette_id()/default_font_id(), tables palettes/fonts/tenant_theme_presets (CASCADE). Pré-fix 6 PWA routes consumindo palette_id/default_palette_id via FK trocadas por DEFAULT_THEME constantes (lib/design/theme-defaults) até Fase 4 entregar tenant_themes/\_versions.

### Added (2026-05-19 — Infra externa Fase 1 + design rethink)

- Migration `0015_forms_align_research_23` — rename `capture_forms`→`forms`, `capture_submissions`→`form_submissions`, `assessments`→`form_reports` (zero consumers no código, grep confirmou). +25 colunas (kind enum 8 valores, vertical, status, logic_rules jsonb, bot_score, ip_address_hashed, idempotency_key, share_token, content_md, blob_url, etc). Nova tabela `form_versions` espelhando `page_versions` (snapshot Hotmart-like). Vocab canônico pesquisa 23 §18 aplicado no banco.
- Migration `0016_structural_reserves` — `tenants.lifecycle_state` enum (provisioning/active/suspended/pending_deletion/deleted) + `suspended_at/reason` + `deletion_scheduled_at`. Novas tabelas: `audit_log` (append-only via RLS), `notifications` (in-app, schema reserve Fase 2), `tenant_webhooks` + `webhook_deliveries` (outgoing com retry, schema reserve Fase 2). Todas seguem 3-layer defense.
- Migration `0017_cross_table_tenant_consistency` — função `assert_tenant_match()` (SECURITY INVOKER, dynamic SQL via TG_ARGV) + 11 triggers BEFORE INSERT/UPDATE em form_submissions, form_versions, form_reports, leads, page_versions, enrollments, modules, components, component_schedules, webhook_deliveries. Defesa em profundidade pro achado 4 da auditoria RLS.
- Pesquisa 24 (`docs/research/24-page-engine-architecture.md`) — Page Engine architecture (67 KB, 25 perguntas respondidas). Highlights: Zod 4 bug discriminatedUnion+lazy, JSON Patch RFC 6902 + EASE (-31% tokens), Next 16.2 cacheTag estável, 7 blocks MVP, ISR via `'use cache' + cacheTag('page:{tenant_id}:{slug}')`, og:image dinâmica Satori. Integração ADIADA até design system resolver.
- Pesquisa 25 (`docs/research/25-ai-reports-architecture.md`) — AI Reports architecture (64 KB, 24 perguntas respondidas). Highlights: AI SDK v6 `generateObject` deprecated → `generateText({ output: Output.object({ schema }) })`, ReportContent modular discriminated union por section_kind, disclaimers determinísticos (não pelo LLM) obrigatório LGPD+CFM/CFN, Vercel Workflow GA 16-abr-2026, budget $0,02/submission viável só com caching agressivo. Integração antes Etapa 4 do plano.
- Infra externa Fase 1 fechada: GitHub `leeandroneto/platform` (Hobby), Vercel project `platform` em gru1 com auto-deploy on push, Resend domain verified + API key, Upstash Redis sa-east-1, Vercel CLI 54.1.0 local. Domain `desafit.app` apex canonical (www redirect). Vercel AI Gateway key gerada.
- Plano §0.2 (PAUSA design system rethink) — captura inflexão estratégica: template (estilo) × palette × content separation. 13 paletas isoladas não bastam pra white-label premium. Pesquisa 26 dispatching (~1500 linhas alvo) cobrindo archetypes das 78 marcas em `docs/references/design-systems/`, photo handling, mobile/desktop philosophy, PWA-specific, shadcn variants per template, vibe matching from photo, antifragility validation.
- `docs/_sessions/2026-05-19-design-rethink-mcp-scaffold.md` — formato novo de session reflection notes (não-decidido, pra sobreviver compactação contexto). Captura insights soltos antes de virarem ADR.
- Skill Impeccable instalado (`npx skills add pbakaus/impeccable`) — `/audit` + `/polish` combat AI generic patterns (29+ anti-patterns).
- Plano §3.7 ganhou estratégia MCP scaffold: cada operation Fase 1 auto-registra como tool MCP via convenção. Endpoint `/api/mcp/[transport]/route.ts` existe mas retorna 503 em produção até Fase 2.

### Changed

- `vercel.ts` — 3 crons removidos (Hobby permite 1x/dia, `*/5 * * * *` bloqueava deploy). Rotas `/api/cron/*` não existem ainda. JIT re-adicionar quando rotas forem criadas. Comentário no arquivo lista os 5 crons previstos.
- `.storybook/preview.tsx` — Geist + Geist_Mono via next/font carregados como CSS vars no decorator. mockBrand.name continua `'storybook'` (placeholder neutro — brand real vem de DB lookup por hostname em produção, ADR-0024).
- `CLAUDE.md` — 16 rules listadas (adicionada `forms-engine`), plano ativo aponta pra `PLANO-DIA-1-AGENCY-FUNNEL.md`, adicionada referência a `docs/research/23-form-system-architecture.md`.
- `.claude/rules/naming.md` — `intake` → `lead-capture` (substitui `capture_form`). Adicionados termos canônicos: `block`, `step`, `submission`, `response`, `report`, `version`, `logic rule`. Exceções: `field` em libs externas (RHF), `branch` em git, `question` em UI/copy PT-BR OK.
- `.claude/rules/i18n.md` — seção "Conteúdo gerado por tenant — NÃO usa `t()`" + paths-exception ESLint pra renderers (`components/app-form-renderer*`, `components/app-page-renderer*`, etc).
- `.claude/rules/forms-engine.md` (criada) — path-loaded em `lib/contracts/form*`, `lib/forms/**`, `lib/engines/**`, `components/app-form-*`, `app/api/forms/**`. Cobre vocabulário, shape canônica FormDefinition, JSON Logic, pipeline pós-submit, trava de custo IA, anti-patterns, gatilhos de revisão.
- ~~`components/_showcase/shapes.stories.tsx`~~ — tentei criar mas hook bloqueou (CSS vars em `style` viola ADR-0012/0036). JIT quando `@theme inline` em globals.css ganhar utilities mapeando `--shape-*` e `--elevation-*` pra classes Tailwind, OU pesquisa 26 redefinir abordagem.

### Security (2026-05-19)

- Storage policies audit confirmado: zero gap (INSERT policies em avatars/tenant-logos/components-media/programs-covers TÊM path validation via `with_check` — falso alarme da minha auditoria inicial que olhou só `qual`).
- HaveIBeenPwned password protection: skipped (Pro-only). Mitigado por password strength existente (lower/upper/digit/symbol).
- Branch protection GitHub: skipped (Pro-only). Mitigado por pre-push hook que roda lint+typecheck+test+audit antes de cada push.

### Added

- ADR-0040 — Fechamento dia 0 (shadcn zone quarantine + i18n + APCA Silver + 3 wrappers + 3 typography + 6 rules JIT). Consolida Pesquisas 17/18/19/20/21. Substitui ADR-0031 §1+§7. Atualiza ADR-0037 §B operacionalmente. Plano executável: `docs/plans/PLANO-MESTRE-DIA-0.md` (11 etapas ~11h30)
- 6 novos `.claude/rules/*.md` (granular, carregados por path glob): `i18n.md` (next-intl + AppError factory + Zod factory + tenant override architecture), `contrast.md` (APCA Silver + 4 helpers + matrix), `shadcn-zone.md` (zona quarentenada + 3 wrappers OBRIGATÓRIOS + checklist pós-add), `design-tokens.md` (usos canônicos + anti-patterns), `brand.md` (env vars + useBrand + multi-vertical keys), `entitlements.md` (requireEntitlement + AppError i18n + plan-gates). Cada um com seção "Condição de revisitar" obrigatória (regra Pesquisa 20)
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
- ADR-0037 §A hierarquia reordenada por pesquisa web direta 2026-05-18 dos 6 catálogos. 3 categorias explícitas: vendor canônico (shadcn blocks → primitives) → catálogos copy-paste (Origin UI → Kibo UI → Reui → Tremor → billingsdk) → custom. Mudanças vs ordering inicial: Reui sobe de 7 → 5 (1003+ comp + data-grid TanStack v8); billingsdk desce de 5 → 7 (especialista nicho, frequência baixa); Aceternity sai do produto (Framer Motion incompat + paywall + A11y vaga); Motion/Vaul/Sonner reclassificadas como libs primitivas infra (não catálogos). `.claude/rules/components.md` espelha; deny message do `component-research-gate.sh` atualizada.
- Tarefa 14 (Checklist 15) — `lib/design/motion.ts` com 6 durations Material 3 (50/100/200/300/500/700ms), 5 easings (`standard`, `standardDecelerate`, `standardAccelerate`, `emphasized`, `emphasizedDecelerate`) e 4 springs (`snappy`, `gentle`, `bouncy`, `slow`). Smoke test em `tests/smoke.test.ts` valida shape + valores canônicos. `'use client'`.
- ADR-0037 — Wrapper pattern + hierarquia registries granular (slugs canônicos `@origin-ui` → `@kibo-ui` → `@billingsdk` → `@aceternity` → `@reui` → `@tremor` → custom). Atualiza ADR-0008. shadcn MCP server registrado em `.mcp.json` (gerado por `pnpm shadcn mcp init --client claude`). `.claude/rules/components.md` lista operacional carregada em pastas de componentes (`components/**`, `features/**/components/**`, `lib/**/components/**`). Wrapper pattern obrigatório: customização em `components/app-<nome>.tsx`, nunca editar `components/ui/*` direto. Audit em `components/ui/`: 47 primitives pristine (zero edits desde bootstrap `95a092d`).
- ADR-0036 — Hooks PreToolUse JSON output (stdout `permissionDecision:"deny"` + exit 0, contorna bug `anthropics/claude-code#13744`) + `@eslint-community/eslint-plugin-eslint-comments@4` com `no-use:error` + `linterOptions.noInlineConfig:true` + `linterOptions.reportUnusedDisableDirectives:'error'`. Allowlist 2-padrões de ADR-0012 retirada (zero uso histórico). 4 hooks `.claude/hooks/`: `block-token-bypass.sh` (hex/rgba, migrado pra JSON e renomeado de `block-disables.sh` por clareza de escopo), `protect-eslint.sh` (eslint.config-dot-star read-only), `block-disable-content.sh` (disable comment + `noInlineConfig` + `reportUnusedDisableDirectives` literais com skip pra eslint.config), `component-research-gate.sh` (Write em pastas de componentes — `components`, `features/<name>/components`, `lib/<name>/components` — exige marker `// RESEARCH: <fonte>` linha 1)

### Changed

- ADR-0031 §1 (overrides `components/ui/**` + blocks shadcn) e §7 (`hooks/use-mobile.ts`) REMOVIDOS — `eslint.config.mjs` + `knip.config.ts` (`components/ui/**` entry + `version-switcher.tsx` ignore + `@base-ui/react` ignoreDependencies) + `sheriff.config.ts` (`kind:primitive` tag + rule) limpos. Estado honesto: ~200 erros lint + knip "unused" visíveis nos 47 primitives até Research 18 desenhar zona quarentenada definitiva. Push bloqueado intencionalmente. Decision A 2026-05-18 — patch ADR-0031 (status partially-superseded) + ADR-0037 update (edit-primitives policy aberta + blocks-first reforçado)
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
