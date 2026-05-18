# Migration 0001 — Schema baseline `platform.*` + RLS + JWT hook + Templates

> Aplicar via `mcp__supabase__apply_migration` (memória `feedback_use_apply_migration`).
> NUNCA criar `.sql` manual em `supabase/migrations/`.
> **Pré-requisito:** Supabase project NOVO e VAZIO (ADR-0023). Não rodar em project com migrations legadas.

---

## O que entra (dia 0)

### Schema `public` adicional

- **Function** `public.set_updated_at()` — trigger reusável bump `updated_at` em qualquer tabela
- **Function** `public.current_tenant_id()` — wrap `auth.jwt() ->> 'tenant_id'`
- **Hook** `public.custom_access_token_hook` — popula JWT com `tenant_id` + `active_membership_role`
- **Trigger** `public.handle_new_user` — cria profile + tenant + membership atomicamente em signup
- **Trigger** `public.on_tenant_soft_delete` — cascade soft delete em tabelas filhas quando tenant é soft-deleted

### Schema `public` tabelas catálogo (6)

| Tabela                            | Propósito                                                                                                                                                                                       |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `public.verticals`                | Catálogo. `fitness_strength` ativo dia 1; resto `active=false`                                                                                                                                  |
| `public.vertical_component_kinds` | Mapping `(vertical_id, kind)` — filtra UI na origem                                                                                                                                             |
| `public.currencies`               | ISO 4217 catálogo (BRL/USD/EUR/GBP/CAD/AUD/MXN)                                                                                                                                                 |
| `public.exchange_rates`           | `(base, quote, rate, captured_at)` — cron Edge Function diário                                                                                                                                  |
| `public.slug_blocklist`           | Subdomínios reservados (admin/api/app/dashboard/etc)                                                                                                                                            |
| `public.page_templates`           | **Template oficial** pages (ADR-0029) — `(slug, version int, is_official, is_active, brand_id null, created_by_tenant_id null, blocks jsonb, schema_version int)`                               |
| `public.form_templates`           | **Template oficial** forms (ADR-0029) — mesma estrutura, `fields jsonb` em vez de `blocks`                                                                                                      |
| `public.program_templates`        | **Template oficial** programs (ADR-0029, renomeado de specialty_templates) — `(slug, version, is_official, is_active, brand_id null, created_by_tenant_id null, vertical_id FK, modules jsonb)` |
| `public.ai_prompts`               | Prompts versionados (07-ai-prompts.md) — `(slug, latest_version_id, model_pinned)`                                                                                                              |
| `public.ai_prompt_versions`       | Versões individuais — `(prompt_id, version, system_text, user_template, output_schema_jsonb, draft_schema_jsonb)`                                                                               |
| `public.ai_invocations`           | Audit calls IA com hashes SHA256 (LGPD) — `(tenant_id, prompt_version_id, input_hash, output_hash, tokens_in, tokens_out, latency_ms, model, cached)`                                           |
| `public.ai_usage_monthly`         | Agregação mensal pra budget cap                                                                                                                                                                 |

### Schema `platform.*` brand + tenant (ADR-0024/0026/0028/0029)

| Tabela                                | Propósito                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform.palettes`                   | Pool paletas (13 seed) + clones tenant — `(slug unique nullable, brand_id null, source_palette_id null FK self, created_by_tenant_id null FK tenants, name, OKLCH cols + surfaces_dark[5] + surfaces_light[5] + hue, is_official, is_active, sort_order)` (ADR-0028 + 0029 clone pattern)                                                                                                                                       |
| `platform.fonts`                      | Pool 7 fontes — `(slug unique, brand_id null, display_name, family_name, provider, weights[], is_official, is_active)`                                                                                                                                                                                                                                                                                                          |
| `platform.shape_presets`              | Pool 3 shapes — `(slug unique, brand_id null, display_name, radius_base/sm/md/lg/xl, is_official, is_active)`                                                                                                                                                                                                                                                                                                                   |
| `platform.brands`                     | Brand filha — `(name, host, default_palette_id NOT NULL FK platform.palettes, logo_url, default_vertical, parent_label, theme_version)`                                                                                                                                                                                                                                                                                         |
| `platform.tenants`                    | Tenant root — `(brand_id FK, slug, vertical, palette_id NOT NULL FK platform.palettes [DEFAULT subquery 'default'], font_id NOT NULL FK platform.fonts [DEFAULT subquery 'geist'], shape_preset_id NOT NULL FK platform.shape_presets [DEFAULT subquery 'rounded'], logo_url, theme_version, default_locale, default_currency, default_tz, pixels jsonb)`. **`custom_primary_oklch` REMOVIDO** (ADR-0029 clone pattern resolve) |
| `platform.domains`                    | 1:N tenant — `(host, kind enum('subdomain'/'custom'), is_primary, verified_at, ssl_status)` (ADR-0026)                                                                                                                                                                                                                                                                                                                          |
| `platform.profiles`                   | 1:1 com `auth.users`                                                                                                                                                                                                                                                                                                                                                                                                            |
| `platform.memberships`                | `(tenant_id, user_id, role enum 5 valores: platform_admin/professional/client/influencer/service_account)` UNIQUE                                                                                                                                                                                                                                                                                                               |
| `platform.subscriptions`              | Mensalidade plataforma EFI Bank — `(package enum A/B/C, money pair setup + monthly, grace_period_until)`                                                                                                                                                                                                                                                                                                                        |
| `platform.tenant_gateway_credentials` | Asaas/Stripe/MP keys do prof (Supabase Vault encrypted)                                                                                                                                                                                                                                                                                                                                                                         |

### Schema `platform.*` produto

| Tabela                         | Propósito                                                                                                                                                                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `platform.programs`            | Programa root — `(brand_id, tenant_id, vertical_id, source_template_id FK public.program_templates, source_template_version, title, slug, cover_image_url, money pair price, cohort_type enum, enrollment_window jsonb, status, tags[])` |
| `platform.modules`             | `(program_id, title, position)`                                                                                                                                                                                                          |
| `platform.components`          | `(tenant_id, module_id, kind enum 11 kinds, schema_version, payload jsonb CHECK ? 'schema_version', status)`                                                                                                                             |
| `platform.component_schedules` | `(component_id, day_offset OR unlock_at, unlock_rule jsonb)` 4 release modes                                                                                                                                                             |
| `platform.enrollments`         | `(tenant_id, program_id, client_user_id, cohort_start_date, started_at, completed_at, paused_at, status, payment_id)`                                                                                                                    |
| `platform.payments`            | `(tenant_id, enrollment_id, gateway enum, gateway_ref, kind enum, money pair, status, captured_at, external_payment_url)`                                                                                                                |
| `platform.capture_forms`       | Instância — `(tenant_id, source_template_id FK public.form_templates, fields jsonb, redirect_url)`                                                                                                                                       |
| `platform.capture_submissions` | `(capture_form_id, answers jsonb)`                                                                                                                                                                                                       |
| `platform.leads`               | `(tenant_id, email, name, phone, source, status, submitted_at)`                                                                                                                                                                          |
| `platform.assessments`         | Relatório IA — `(tenant_id, lead_id, payload jsonb, model, created_at)`                                                                                                                                                                  |
| `platform.push_subscriptions`  | Web Push subs — 1 par Vapid **por tenant** (RFC 8292) em `tenants.vapid_*`                                                                                                                                                               |
| `platform.pages`               | **Instância** landing pública — `(tenant_id, source_template_id FK public.page_templates, source_template_version, slug, blocks jsonb CHECK ? 'schema_version', published_at, status)`                                                   |
| `platform.page_versions`       | Snapshot por publish — `(page_id, version int, blocks_snapshot jsonb, published_at, published_by_user_id)`                                                                                                                               |

### Templates editáveis pelo prof (Pacote B/C)

| Tabela                     | Propósito                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `platform.push_templates`  | `(tenant_id null=global, template_key, lang, title, body, frequency_cap_minutes, enabled)`. Seed: 5 globais |
| `platform.email_templates` | `(tenant_id null=global, template_key, lang, subject, body_html, body_text, enabled)`. Seed: 4 globais      |

**Total dia 0:** 33 tabelas em `platform.*` + 12 tabelas em `public.*`

### Audit cols universais (TODA tabela)

```sql
created_at timestamptz NOT NULL DEFAULT now()
updated_at timestamptz NOT NULL DEFAULT now()
deleted_at timestamptz NULL
```

Trigger `set_updated_at` atachado em todas tabelas com `updated_at`.

### CHECK constraints baseline

```sql
-- platform.domains
host TEXT CHECK (host ~ '^[a-z0-9.-]+\.[a-z]{2,}$')

-- platform.palettes
primary_oklch TEXT CHECK (primary_oklch ~ '^oklch\(')
secondary_oklch TEXT CHECK (secondary_oklch ~ '^oklch\(')
tertiary_oklch TEXT CHECK (tertiary_oklch ~ '^oklch\(')

-- platform.leads + platform.profiles
email TEXT CHECK (email ~ '^[^@]+@[^@]+\.[^@]+$')

-- Money pair
amount_minor INT CHECK (amount_minor >= 0)
currency TEXT REFERENCES public.currencies(code)

-- JSONB payload com schema_version
payload JSONB NOT NULL CHECK (jsonb_typeof(payload) = 'object' AND payload ? 'schema_version')
```

### Indexes baseline

```sql
-- Cada tabela tenant-scoped
INDEX (tenant_id)
INDEX (tenant_id, created_at DESC)

-- Cada FK
INDEX em cada FK declarada

-- Unique slugs por tenant
UNIQUE (tenant_id, slug) em platform.{pages, programs, capture_forms}
UNIQUE (slug) em public.{page_templates, form_templates, program_templates, ai_prompts}
UNIQUE (slug) em platform.{fonts, shape_presets}
UNIQUE (slug) WHERE is_official=true em platform.palettes (clones não têm slug unique)
```

### Storage buckets (5)

- `avatars` (público read, autenticado write)
- `programs-covers`
- `components-media`
- `tenant-logos`
- `brand-assets`

---

## Prompt pra Claude Code executar

```
Aplique migration baseline via mcp__supabase__apply_migration:

PRÉ-REQUISITO: confirma com mcp__supabase__list_tables que projeto está VAZIO
(0 tabelas em platform.*). Se NÃO estiver vazio, ABORTA — projeto não é
greenfield e precisa criar um novo (ADR-0023). NÃO aplicar em project com legado.

Nome: 0001_initial

Conteúdo: schema platform.* + RLS + JWT hook + triggers + 5 buckets +
templates conforme docs/migrations/0001_initial.md.

Ordem (CRÍTICA — dependências):
1. CREATE SCHEMA IF NOT EXISTS platform
2. CREATE FUNCTION public.set_updated_at()
3. CREATE FUNCTION public.current_tenant_id()
4. CREATE public.{verticals, vertical_component_kinds, currencies, exchange_rates, slug_blocklist}
5. SEED public.verticals (fitness_strength active=true; outros active=false)
6. SEED public.currencies (BRL, USD, EUR, GBP, CAD, AUD, MXN)
7. CREATE platform.palettes / fonts / shape_presets com audit cols + CHECK constraints
8. SEED idempotente (ON CONFLICT (slug) DO NOTHING):
   - 13 paletas: dados de lib/design/seeds/palettes.seed.ts
   - 7 fontes: dados de lib/design/seeds/fonts.seed.ts
   - 3 shape_presets: dados de lib/design/seeds/shapes.seed.ts
9. CREATE platform.brands (default_palette_id NOT NULL FK platform.palettes)
10. SEED brand 'desafit' com default_palette_id via subquery scalar
11. CREATE platform.tenants SEM defaults nas FKs (apenas NOT NULL)
12. ALTER TABLE platform.tenants:
    - ALTER COLUMN palette_id SET DEFAULT (SELECT id FROM platform.palettes WHERE slug='default' AND is_official=true LIMIT 1)
    - ALTER COLUMN font_id SET DEFAULT (SELECT id FROM platform.fonts WHERE slug='geist' LIMIT 1)
    - ALTER COLUMN shape_preset_id SET DEFAULT (SELECT id FROM platform.shape_presets WHERE slug='rounded' LIMIT 1)
13. CREATE TRIGGER public.handle_new_user (cria profile+tenant+membership atomicamente)
14. CREATE platform.{domains, profiles, memberships, subscriptions, tenant_gateway_credentials}
15. CREATE public.{page_templates, form_templates, program_templates, ai_prompts, ai_prompt_versions, ai_invocations, ai_usage_monthly}
16. CREATE platform.{programs, modules, components, component_schedules, enrollments, payments, capture_forms, capture_submissions, leads, assessments, push_subscriptions, pages, page_versions, push_templates, email_templates}
17. SEED templates globais:
    - 5 platform.push_templates (tenant_id=null, template_keys: morning_workout, message_received, inactivity_3d, streak_milestone, weekly_checkin)
    - 4 platform.email_templates (tenant_id=null, template_keys: enrollment_welcome, checkin_reminder, program_completed, dunning_attempt_1)
18. Aplicar audit cols + CHECK constraints + INDEXES baseline em TODAS tabelas
19. CREATE trigger public.on_tenant_soft_delete em platform.tenants
20. RLS habilitada em TODAS tabelas tenant-scoped com policy padrão:
    USING (tenant_id = (SELECT public.current_tenant_id()))
    Triggers updated_at via public.set_updated_at()
21. Money fields: pair (<x>_amount_minor int CHECK >= 0 + <x>_currency text FK public.currencies)
22. JSONB internal keys SEMPRE EN (reflection, pillars, next_step)
23. Storage buckets via storage.create_bucket() + policies por bucket
24. NO bcrypt/argon2 manual (Supabase Auth handles)
25. NO onboarding.* schema (ADR-0023)

Smoke test pós-migration:
- SET ROLE anon; INSERT em platform.programs sem JWT → bloqueado ✅
- Signup novo email → trigger cria profile + tenant (com FKs default resolvidas) + membership atomicamente ✅
- SELECT current_tenant_id() autenticado → retorna UUID válido ✅
- mcp__supabase__list_tables → 33 em platform + 12 em public ✅
```

---

## Notas críticas

- `platform.tenant_branding` **não existe** — branding inline em `platform.tenants` (ADR-0028 + 0029)
- `platform.brands.primary_color_oklch` **não existe** — sempre via `default_palette_id` FK (ADR-0028)
- `platform.tenants.custom_primary_oklch` **não existe** — paleta clonada via `platform.palettes.source_palette_id` (ADR-0029)
- `public.specialty_templates` **não existe** — renomeado `public.program_templates` (ADR-0029)

## Migrations futuras (incrementais via apply_migration)

- `0002_add_chatbot_threads` (Pacote C chatbot — Sprint 14)
- `0003_add_automations` (jornadas retention — Sprint 12+)
- `0004_add_audit_log_generic` (JIT — quando 1º audit real precisar)
- `0005_add_outbox` (webhooks — Sprint 6 quando 1º pagamento)
- `0006_add_slug_history` (JIT — quando 1º prof trocar slug)

Princípio §39: tabela entra com 1º consumer, não preventivamente (ADR-0001).
