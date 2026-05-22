# Changelog

Todas as mudanças notáveis do projeto `platform` (multi-brand white-label SaaS).
Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · Versionamento: [SemVer](https://semver.org/spec/v2.0.0.html).

Categorias: `Added`, `Changed`, `Deprecated`, `Removed`, `Fixed`, `Security`.
Cita ADR-NNNN ou issue-NN quando aplicável. 1 entrada por mudança user-facing (não por commit).

---

## [Unreleased]

### Docs (2026-05-21 — research-44/45 + ADR-0045 accepted + plan consolidation)

- **research-44 real players integration patterns** (`docs/research/44-real-players-integration-patterns.md`) — auditoria de 20 players (10 course/community + 11 AI-native). GoHighLevel valida modelo white-label agency multi-tenant em escala bilhão hits/dia. Tiptap em produção massiva (LinkedIn, GitLab, Anthropic, Substack, NYT). shadcn registry production validado via MakerKit + Supastarter. AI orchestration híbrida confirmada pelo state-of-the-art (Lovable hydration, Replit Agent 3 multi-agent, Vercel Artifacts). Stack canônica course platforms = subdomain + custom domain + tenant_id (ADR-0024). 80% cobertura via precedents proven; 20% novel mas com base sólida. D.8 refinement: ai-chatbot Artifacts é pattern primo (polymorphic kind dispatch + Suggestion text diff), não espelhado — inspira `createDocumentHandler<T>()` factory pattern + tool layer pra Fase 6/7.
- **research-45 component strategy best practices** (`docs/research/45-component-strategy-best-practices.md`) — cravou arsenal de **20 essential primitives upfront** (não JIT puro nem arsenal completo) dia 0 Fase 5. Bundle impact zero (shadcn copia código local + Next.js 16 tree-shaking). Folder structure `components/blocks/*` substitui `components/sections/*` — espelha invariante ADR-0045 D.13 `pages.kind === registry-item.name === components/blocks/{kind}.tsx`. AI catalog discoverability via JSDoc `@registry-meta` em `lib/contracts/page-blocks/*` → build script `scripts/build-block-catalog.ts` → `lib/generated/block-catalog.json` (gitignored, prebuild). 3 JIT exceptions confirmadas por bundle impact real: `chart` (recharts ~250 KB), `calendar` (react-day-picker ~45 KB), `carousel` (embla ~25 KB). Validado contra 5 boilerplates auditados (next-forge 52, ai-chatbot 22, tweakcn 46, vercel-saas 6, vercel-platforms 7).
- **ADR-0045 status draft → accepted** — 17 decisões cravadas + Validation 2026-05-21 cruzando research-44/45 sem mudanças estruturais. D.8 ganhou refinamento opcional sobre createDocumentHandler factory pattern de ai-chatbot.
- **Plano `docs/plans/pivot-tweakcn.md` consolidado:**
  - §STATUS ATUAL: background workstreams ✅ (research-44/45 + consolidação), Decisões cravadas (ADR-0045 + component strategy research-45), Decisões pendentes (Batch AI/Registry resolvido — só Batch Theming + ESLint resta + 3 gaps execução), Próxima execução cravada (3 gaps → 20 primitives → Fase 5 → Fase 6+7 paralelo).
  - §17 Batch AI/Registry (H.1-H.11 + G.1-G.8 + research-41 4 novos) ✅ marcados resolvidos via ADR-0045 accepted.
  - §15.1 C "Localização correta": `components/blocks/*` (em vez de `sections/`) + `components/vendor/*` adicionados.
  - §15.3 rules path-loaded: `registry-blocks.md` planejada com invariante D.13 + JSDoc `@registry-meta` format obrigatório.
  - Fase 5: §6.0 install 20 primitives + §6.0.5 AI catalog discoverability setup adicionados após §5.0 Storybook re-install.
- **Concept-map `docs/design-system/20-concept-map.md`** atualizado pós research-44/45 + ADR-0045 accepted: bloco "Status atualizado", lista 20 primitives essential, folder structure final (`blocks/` em vez de `sections/`), patterns copy JIT pra Fase 6/7.
- **`docs/_status.md`** sincronizado: ADR-0045 status accepted (não draft), research-44/45 ✅, próxima execução cravada (3 gaps → 20 primitives → Fase 5), counts ADRs/Research atualizados.
- **Padrões copy JIT cravados pra Fase 6/7** (research-44): `createDocumentHandler<T>()` factory pattern de ai-chatbot (`lib/artifacts/server.ts`) → `createBlockHandler<T>()` JIT quando 3+ kinds. Tool layer pattern (`lib/ai/tools/create-document.ts`) → `createPage`/`updatePage`/`applyPagePatch`. `resumable-stream` pacote — quando theme generation ficar lenta (5-30s).

### Docs (2026-05-21 — Architecture research dispatched)

- Research-43 master architecture + stack comparative analysis (Opus background) — dispatch 2026-05-21. Clona 5 repos de referência (Novel, Tiptap, Makerkit, Vercel SaaS, shadcn) + cria mapa mestre 7 layers + análise comparativa peça-por-peça (auth, billing, multi-tenant, theme, prose editor, block system, AI, forms, DB, PWA). Output: `docs/architecture/01-master-system-map.md` + `docs/research/43-stack-comparative-analysis.md`.

### Added (2026-05-21 — ADR-0045 Registry Strategy DRAFT)

- ADR-0045 (`docs/adr/0045-registry-strategy.md`) — 17 decisões cravadas em status `draft` aguardando review user. Cobre: v0 DEMOTED, `block_kinds_catalog` JIT, trigger "3 consumers" formalizado, Novel ADOPT NOW + install JIT, AI orchestration HÍBRIDO (`generateObject` Zod + tool calling), model policy (Haiku router / Sonnet gen / Gemini Flash theme), vertical extension A+B híbrido, smart blocks composição declarada (sem tabela), 7 L2 page blocks MVP, registry hosting plataforma única, 3 namespaces (`@shadcn`/`@platform`/`@desafit`), composition rules L1↘npm/L2↘L1/L3↘L2, invariante `pages.kind === registry-item.name`, versionamento JIT, registry type `registry:style`, fallback Gemini 2.5 Flash, APCA soft warn UX. 4 open questions remanescentes (Tiptap collab, Novel+precedence theme PoC, mídia Novel, contador JSDoc→table).

### Changed (2026-05-21 — Pivot ADR-0044 Fase 2 + ESLint config refactor)

- Pivot Fase 2 (Batch Theming) resolvido — 5 decisões cravadas em `docs/research/37-mobile-pwa-extras-opt-in.md`:
  - **F.1** (commit `3b66024`) — `--sticky-cta-height` e `--mini-player-height` deletados de `app/globals.css` (TweakCN não tem token mobile algum; sem feature consumer hoje; re-add JIT quando feature real existir)
  - **F.2 + F.3** — 18 tokens órfãos confirmados NÃO retornam (Tailwind utilities cobrem `disabled:opacity-50`, `hover:opacity-80`, `aspect-video`, etc)
  - **F.4** (commit `256faae`) — Opção C: sem campo `extensions` no Zod schema hoje; tokens opt-in viram universal com fallback chain `var(--token, default)`. Migrar pra Opção A (`common.extensions` JSONB) quando regra-de-3 cumprir (ADR-0046 futura).
  - **F.5** (commit `7615d2f`) — APCA gate regex automático `/color|border|ring/` + allowlist explícita (`shadow-color`, `glow-color`, `outline-color`). Safe-by-default; preset author não precisa lembrar de declarar.
  - **Q9** (commit `c0da78c`) — `eslint.config.mjs` ganhou exception `react/jsx-no-literals` + `i18next/no-literal-string` em 6 paths de renderers/seeds (pre-empt evita PR bloqueado quando Fase 5/7 entregarem renderers reais).
- `.claude/rules/design-tokens.md` atualizada (commit `9e4ae3f`) — removidos `--sticky-cta-height` e `--mini-player-height` da tabela universal; exemplos de extension opt-in trocados pra `--touch-min`/`--frosted-blur` (que existem); fallback chain instrução generalizada.

### Changed (2026-05-21 — ESLint config refactor research-39+42)

- ESLint config (commit `7b5affa`) — bump limites estruturais: `max-lines` 300→400 (600 em `actions/lib/design/lib/contracts/lib/ai`), `max-lines-per-function` 60→80, `complexity` 12→16 (razão: refactor Fase 4 forçou particionamento por regra, não necessidade).
- Loose temporário `text-*`/`rounded-*` Tailwind bypass (mantém `[#hex]`, `[rgb(`, `uppercase` strict) — até wrappers `<Heading>`/`<Eyebrow>` re-introduzidos pós-pivot.
- `plan-gates-required` ERROR→WARN — `features/` vazio dia 0; phantom enforcement com ERROR. Promover de volta ERROR quando primeira feature paga em produção.
- 7 novas regras propostas em `docs/research/39-eslint-conventions-multi-tenant-stack.md` (JIT — quando stack consumer real chegar): novel/persist-prosemirror-json, novel/no-tailwind-class-inline-attrs, origin-ui|magicui/no-bulk-import, registry/no-block-kind-without-whitelist, next-themes/attribute-must-be-class, tenant-context-in-theme-mutation, no-raw-fontfamily (prometida ADR-0044 §12), no-vh-in-mobile-aware (prometida ADR-0044 §12).
- Validação research-42 (ESLint best practices 2026): research-39 90% alinhado. Q5 REFUTADO (Magic UI já migrou pra `motion` v12 — bloqueio framer-motion seria redundante). 3 achados novos: React Compiler hooks v7 bump, Magic UI conflito mitigado, Next.js issue #80741 (`'use client'` rule oficial JIT esperar). `eslint-plugin-react-hooks@7.1.1` adicionado como devDependency explícita.

### Added (2026-05-21 — Pivot ADR-0044 Fase 5 dia 0 prep)

- `lib/design/shadows.ts` (commit `975ade6`) — `generateShadowLevels()` extraído de `build-theme-css.ts` (adapted from `tweakcn-ref/utils/shadows.ts`). Servir 2-3 fases per research-41 sequencing.
- `lib/design/color-format.ts` confirmado completo (`hex/hsl/oklch/rgb` via culori + `oklchToHex` re-export).
- `lib/design/registry/generate-registry-item.ts` criado (~110 LOC) — gera payload `registry-item.json` shadcn-compatible com `type: 'registry:style'` (research-41 bloqueador 4 confirmado), OKLCH literal, `cssVars.theme` + `cssVars.light` + `cssVars.dark`. 3 testes Vitest passando.
- Storybook 10 confirmado instalado/configurado (já entrega da Etapa 12 do plano dia 0).
- `tests/setup.ts` ganhou `vi.mock('server-only', () => ({}))` pra unit tests poderem importar módulos server-only.

### Research docs (2026-05-21 — Pivot ADR-0044 batch parallelization)

- `docs/research/37-mobile-pwa-extras-opt-in.md` — F.1-F.5 cravadas (Batch Theming resolvido)
- `docs/research/38-registry-novel-ai-integration.md` — H.1-H.11 + bonus, alimenta ADR-0045
- `docs/research/39-eslint-conventions-multi-tenant-stack.md` — Q1-Q10 + 8 regras novas propostas
- `docs/research/40-shadcn-registry-deep-dive.md` — G.1-G.8 MCP `shadcn@canary registry:mcp` + private registries + composition
- `docs/research/41-audit-tweakcn-fases-5-6-7.md` — 55 arquivos auditados, esforço revisado 71h, 5 bloqueadores críticos
- `docs/research/42-eslint-best-practices-validation.md` — validação research-39 (90% alinhado)
- `docs/_sessions/2026-05-21-ai-stack-registry-novel-reflection.md` — reflexão estratégica usuário (Registry vs v0 vs Templates + Novel position)

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
