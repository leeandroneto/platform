# 06 — Data Model

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Schema dia 0: núcleo interconectado (~22 tabelas) + JIT pra audit/configs.
> Causa raiz: schema rígido pra tudo no onboarding-bio gerou 4 system_* tabelas 0-row + 1 tabela monstro 51 cols.

---

## 1. Schemas separados (2, não 3)

Greenfield desafit usa **apenas 2 schemas Postgres**:

| Schema | Conteúdo | Origem |
|---|---|---|
| `public.*` | Cross-cutting (auth, tenants, memberships, billing plataforma, IA, KB, currencies) | Padrão Supabase |
| `desafit.*` | Produto (programs, modules, components, enrollments, capture_forms, leads, pages, payments, etc) | Domínio desafit |

**Sem `onboarding.*`** — legado pausado vive só no histórico do outro repo (master plan §16.1). Schema "3 schemas" do briefing referencia o padrão antigo (public + desafit + onboarding) — desafit greenfield descarta o terceiro.

Data layer usa:
- `client.from('tenants')` → schema `public` (default)
- `client.schema('desafit').from('programs')` → schema `desafit`

---

## 2. Princípio governante (§39 master plan + _CONFLITOS #1)

**Híbrido:**
- **Núcleo interconectado dia 0** (~18-25 tabelas core) — Programa → Módulo → Componente → Enrollment → Progress → Payment. FK + RLS + migrations nascem juntos (refator depois é caro).
- **JIT (Just-In-Time) pós-1º consumer real** — audit/metrics/configs entram quando UI ou caso real existir.
- **Schema completo dia 1** cobre 100% das features da proposta comercial. UI/ferramenta entra com 1º cliente (preferencialmente automatizada; manual aceito SÓ pro 1º cliente se cronograma apertar).

Anti-pattern proibido (master plan §32.4 lição #12): tabela `system_*` config (BMI, lead status, plan features, pricing) vira **TS constant em `lib/constants/*.ts`**, nunca tabela com 0 rows.

---

## 3. Core tabelas dia 0 (~22 tabelas — migration baseline `0001_initial.sql`)

### 3.1 `public.*` (cross-cutting — ~11)

| Tabela | Propósito |
|---|---|
| `public.profiles` | 1:1 com `auth.users`. enum `user_role` (5 valores: admin/professional/client/staff/influencer) |
| `public.tenants` | Empresa do profissional. `vertical_id`, `default_locale/currency/tz`, `theme_tokens jsonb`, `theme_version int`, `subdomain`, `pixels jsonb` (Meta/GA4), `gateway_config jsonb` encrypted (link externo gateway aluno) |
| `public.memberships` | `(tenant_id, user_id, role enum)`. UNIQUE pair. enum `membership_role` (3 valores: professional/client/staff) |
| `public.subscriptions` | Mensalidade plataforma EFI Bank cobrada do prof. `package enum('A'/'B'/'C'/addons)`, `setup_amount_minor`, `monthly_grace_period_until` |
| `public.slug_blocklist` | Subdomínios reservados (admin/api/app/dashboard/etc) |
| `public.domains` | Custom domains (verified, ssl_status, primary) 1:N de tenant (Pacote B/C) |
| `public.verticals` | Catálogo. `fitness_strength` ativo dia 1; resto declarado mas `active=false` |
| `public.vertical_component_kinds` | Mapping `(vertical_id, kind)` — filtra UI na origem |
| `public.currencies` | ISO 4217 catálogo (BRL/USD/EUR/GBP/CAD/AUD/MXN) |
| `public.exchange_rates` | `(base, quote, rate, captured_at)`. Cron Edge Function diário |
| `public.push_subscriptions` | Web Push subscriptions. 1 par Vapid **por tenant** (RFC 8292) em `tenants.vapid_*` |

### 3.2 `desafit.*` (produto — ~11)

| Tabela | Propósito |
|---|---|
| `platform.programs` | `(tenant_id, vertical_id, title, cover_image_url, currency, price_amount_minor, cohort_type enum('evergreen'/'live'/'individual'), enrollment_window jsonb, source_template_id, status enum, tags text[])` |
| `platform.modules` | `(program_id, title, position)` |
| `platform.components` | `(tenant_id, module_id, kind enum, schema_version int, payload jsonb, status)`. **11 kinds dia 1** (workout/meal_plan/lesson/video_lesson/material/check_in/scheduled_live/individual_call/in_person_class/message/task) + reservados pra outras verticais |
| `platform.component_schedules` | `(component_id, day_offset OR unlock_at, unlock_rule jsonb)` — 4 release modes |
| `platform.component_progress` | `(tenant_id, enrollment_id, component_id, completed_at, status, payload jsonb)` |
| `platform.enrollments` | `(tenant_id, program_id, client_user_id, cohort_start_date, started_at, completed_at, paused_at, status, payment_id)` |
| `platform.cohorts` | `(program_id, name, starts_at, ends_at, capacity)` — pra `cohort_type='live'` |
| `platform.capture_forms` | `(tenant_id, fields jsonb, redirect_url)` — substitui `intake` (vocab banido) |
| `platform.capture_submissions` | `(capture_form_id, answers jsonb)` |
| `platform.leads` | `(tenant_id, email, name, phone, source, status, submitted_at)` |
| `platform.payments` | `(tenant_id, enrollment_id, gateway enum, gateway_ref, kind enum('platform_to_prof'/'client_to_prof'), amount_minor, currency, status, captured_at, external_payment_url)` |

**Total core dia 0:** ~22 tabelas (dentro da faixa 18-25 do _CONFLITOS #1).

---

## 4. JIT (entra quando consumer real existir)

Tabelas decididas em schema mas materialização adiada:

### 4.1 Entram com 1º cliente Pacote A (~6)
| Tabela | Quando |
|---|---|
| `platform.pages` | Landing pública branded — schema dia 0; fundador monta JSON via admin |
| `platform.page_versions` | Histórico publicações pra rollback |
| `platform.coupons` | Cupons aluno — Pacote A inclui |
| `platform.payment_methods` | Credenciais gateway prof (encrypted) |
| `public.page_templates` | Templates oficiais clonáveis |
| `public.platform_coupons` | Cupons plataforma (vs `platform.coupons` prof→aluno) |

### 4.2 Entram com 1º cliente Pacote B/C (~8)
| Tabela | Quando |
|---|---|
| `platform.progress_metrics` | `(tenant_id, enrollment_id, metric_kind, value, unit, captured_at)` — linha por métrica (não 18 cols rígidas) |
| `platform.progress_photos` | `(tenant_id, enrollment_id, file_url, captured_at, kind enum('front'/'side'/'back'))` |
| `platform.check_ins` | Agregado de respostas de componentes `check_in` |
| `platform.workout_logs` | `(tenant_id, enrollment_id, component_id, set_idx, weight_kg, reps, completed_at)` |
| `platform.achievements` | Catálogo conquistas por tenant (gamificação Pacote B/C bônus mês 3) |
| `platform.badges` | `(tenant_id, enrollment_id, achievement_id, awarded_at)` |
| `platform.push_messages` | Audit log push (template_key, recipient, sent_at, status) |
| `platform.email_messages` | Audit log email Resend (subject, resend_id, opened_at) |

### 4.3 Entram com Pacote C bônus IA chatbot (~3)
| Tabela | Quando |
|---|---|
| `platform.chatbot_threads` | `(tenant_id, enrollment_id, kind enum('nutrition'/'program_q'))` |
| `platform.chatbot_messages` | `(thread_id, role enum('user'/'assistant'), content, tokens, model)` |
| `public.ai_prompts` + versions + `ai_invocations` + `ai_usage_monthly` | IA versionada (cobertos em 07-ai-prompts.md) |

### 4.4 Entram quando IA pipeline vibe coding ativar (§39, fase 2)
| Tabela | Quando |
|---|---|
| `platform.import_jobs` | `(tenant_id, kind enum('clients_csv'), status, errors jsonb)` — migração alunos |
| `public.specialty_templates` | Templates programa por vertical (clonáveis) |
| `public.kb_exercises` (~870 free-exercise-db) | Picker biblioteca exercícios |
| `public.kb_foods` (~2500 TBCA + TACO) | Chatbot nutricional system prompt cacheado |

`pgvector` **NÃO** instalado dia 1 — chatbot Pacote C funciona sem RAG. Gatilho: ≥100 conv/dia OU custo > R$200/mês (master plan §16.17).

### 4.5 Entram JIT quando demanda real (≥3 ocorrências OU dor explícita)
| Tabela | Trigger pra criar |
|---|---|
| `public.subscription_events` | UI "histórico eventos billing" pedir |
| `public.cancellation_feedback` | 5+ cancelamentos/mês |
| `public.referrals` + `public.commissions` + `public.payout_requests` | Programa afiliado lançar |
| `public.notification_preferences` (flexível por evento, não 13 booleans) | UI settings push pedir |
| `platform.scheduled_jobs` | Cron jobs internos (drip emails, push agendados) |
| `desafit.whatsapp_messages` | OBA WhatsApp ativada (mês 4-6) |
| `desafit.client_profiles` | Dados tenant-scoped do client |
| `desafit.tenant_capture_forms` | Tenant ativa template + customiza |
| `desafit.system_seeds` | Idempotência de seeds |
| `public.lgpd.consent_logs` | Incidente real exigir |
| `public.lgpd.data_subject_requests` | 5+ DSRs/mês |

---

## 5. Princípio JSONB internal keys EN (D-G6)

**Keys sempre EN. Valores podem ser PT-BR (output LLM).**

Exemplo `components.payload` pra `kind='workout'`:
```
{
  "schema_version": 1,
  "type": "workout",
  "title": "Peito + Tríceps",
  "estimated_minutes": 45,
  "blocks": [
    {
      "name": "Aquecimento",
      "type": "warmup",
      "sets": [...]
    }
  ]
}
```

Keys `schema_version`, `type`, `title`, `blocks`, `sets` = EN. Valores `"Peito + Tríceps"`, `"Aquecimento"` = PT-BR.

**Banido em JSONB keys:** `pilares`, `reflexao`, `ato_*`, `proximo_passo` (legado). Usar `pillars`, `reflection`, `act_*`, `next_step`.

**Versionamento via `schema_version int` no payload:**
1. Migration adiciona suporte ao novo version (Zod aceita ambos draft schemas)
2. Backfill assíncrono em batches (1000/run via cron)
3. Quando 100% migrado, Zod deprecia v1

`normalizeComponent(raw)` em `lib/contracts/components/normalize.ts` faz upgrade transparente.

---

## 6. RLS via JWT claims

### 6.1 Custom Access Token Hook
`public.custom_access_token_hook(event jsonb)` injeta `tenant_id` + `active_membership_role` nas claims do JWT. Setup obrigatório pós-migration: Supabase Dashboard → Auth → Hooks → Custom Access Token = `public.custom_access_token_hook`.

### 6.2 Helpers SQL (STABLE, security definer)
- `public.current_tenant_id() RETURNS uuid` — `NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')::uuid`
- `public.current_user_role() RETURNS text` — extrai `active_membership_role` do JWT

`STABLE` → initPlan Postgres cacheia 1 vez por query.

### 6.3 RLS pattern canônico
Toda tabela tenant-scoped:
- `ALTER TABLE x ENABLE ROW LEVEL SECURITY`
- Policy `FOR SELECT TO authenticated USING (tenant_id = (select public.current_tenant_id()))`
- Policy `FOR ALL TO authenticated USING (tenant + role check) WITH CHECK (...)`
- Btree index obrigatório em `tenant_id`

**Wrap `(select fn())` é não-negociável** — 100× speedup vs `auth.jwt()->>'tenant_id'` direto em tabelas grandes (master plan §16.5 + Supabase docs).

**`TO authenticated` explícito** em toda policy — evita rodar pra `anon`.

### 6.4 Admin global bypass
```sql
CREATE POLICY x_admin_full_access ON platform.programs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p
                 WHERE p.id = auth.uid() AND p.role = 'admin'));
```

### 6.5 CI gates (master plan §16.2)
- `pnpm rls:audit` falha se tabela sem RLS enabled
- `pnpm schema:audit` falha se coluna preço sem par `<x>_amount_minor int + <x>_currency text`

---

## 7. Money value object (D-G33)

Sem `decimal price` solto. Toda coluna preço é par:
- `<x>_amount_minor int` (centavos pra BRL/USD/EUR)
- `<x>_currency text REFERENCES public.currencies(code)`

`lib/domain/money.ts`:
- `type Money = { amount_minor: number; currency: Currency }`
- `Money.format(m, locale)` via `Intl.NumberFormat`
- `Money.add(a, b)` — lança `currency_mismatch` se moedas diferentes
- `Money.convert(m, target, rate)` — via `exchange_rates`

Multi-moeda nativa dia 1. Tenant escolhe `default_currency` + `accepted_currencies text[]` por programa.

Detalhes: master plan §15.4 + blueprint/02-stack.md.

---

## 8. Índices JSONB + generated columns

Hot queries em `payload jsonb`:

```sql
-- GIN com jsonb_path_ops (mais leve, indexa @> @? operadores comuns)
CREATE INDEX components_payload_gin ON platform.components
  USING gin (payload jsonb_path_ops);

CREATE INDEX components_kind_idx ON platform.components (kind);

-- Generated column pra hot query "todos workouts com peso > 100kg"
ALTER TABLE platform.components ADD COLUMN max_weight_kg numeric
  GENERATED ALWAYS AS (
    (jsonb_path_query_first(payload, '$.blocks[*].sets[*].weight_kg ? (@ != null)')::text)::numeric
  ) STORED;

CREATE INDEX components_max_weight_idx ON platform.components (max_weight_kg)
  WHERE kind = 'workout';
```

---

## 9. RPC pattern (mutação multi-tabela)

**Quando usar RPC vs Server Action vs Trigger:**

| Caso | Use |
|---|---|
| Validação + lógica + 1 query DB simples | Server Action TS+Zod |
| Multi-row atômico, cross-table com RLS recursivo, hot-path | RPC `SECURITY DEFINER` |
| Invariantes (`updated_at`, counters denormalizados) | Trigger |

**Template RPC obrigatório:**
- `SECURITY DEFINER SET search_path = ''`
- `REVOKE ALL ON FUNCTION x FROM public, anon`
- `GRANT EXECUTE ON FUNCTION x TO authenticated`
- Validação `v_tenant := (select public.current_tenant_id())` no início
- `RAISE EXCEPTION 'name' USING ERRCODE = '28000|42501'` em violações

Detalhes: master plan §16.7.

---

## 10. Storage buckets (6 dia 1)

| Bucket | Acesso | Conteúdo |
|---|---|---|
| `tenant-logos` | público | Logo do tenant (white-label) |
| `tenant-assets` | público | Capas programa, mockups |
| `program-media` | authenticated | Vídeos, imagens exercícios |
| `client-uploads` | authenticated | Fotos antes/depois, check-in |
| `email-attachments` | authenticated | PDFs anexos |
| `import-uploads` | authenticated | CSV de alunos pra migração |

Path: `<tenant_id>/<subfolder>/<filename>`. Policies filtram por `(select public.current_tenant_id())`.

Vídeos do programa hospedados em **Bunny Stream** (não Supabase) — PoP São Paulo sub-29ms. Storage usa só pra mídia tipo PDF, fotos check-in, etc.

---

## 11. Migrations (D-G22)

- **Exclusivamente via `mcp__supabase__apply_migration`** — nunca criar `.sql` manual em `supabase/migrations/`
- Nome: `YYYYMMDDHHMMSS_<verb_en>.sql`
- Toda migration idempotente (`IF NOT EXISTS`, `CREATE OR REPLACE`)
- Baseline `0001_initial.sql` único dia 1 com tabelas §3 + helpers §6.2 + RLS pattern §6.3 + índices §8

Memória relacionada: `feedback_use_apply_migration.md`.

---

## 12. Comunicação prof ↔ aluno (D-G37, 00-PROJETO §8)

**Sem tabela `messages`.** Comunicação assíncrona one-way (prof→aluno):
- **Push:** prof dispara via `/dashboard/clients/[id]/notify` ou automação. Tabela `platform.push_messages` (audit log) + `public.push_subscriptions` (endpoints)
- **Email:** prof dispara via `/dashboard/clients/[id]/email`. Templates Resend + react-email. Log em `platform.email_messages`
- **Conteúdo de programa = `component.kind='message'`:** mensagem motivacional pré-escrita no roteiro do dia X. Aluno abre, lê, marca como lido. **Não é conversa.**
- **Chat com IA:** tab Chatbot do PWA (Pacote C) é com IA nutricional, não com prof

Razão: prof não tem tempo de moderar caixa de N alunos. Suporte real do prof acontece fora do app (WhatsApp pessoal, IG DM). Plataforma só notifica em massa.

---

## 13. Soft delete cascade

Trigger `on_tenant_soft_delete`: marca `deleted_at` em todas tabelas filhas quando tenant é soft-deleted. Job semanal purga registros com `deleted_at < now() - 30 days`.

Toda tabela-chave tem `deleted_at timestamptz NULL`.

---

## 14. Anti-patterns proibidos (master plan §32.4)

| Anti-pattern | Substituto |
|---|---|
| Tabela monstro (51 cols como `professionals` legado) | Desmembrar em 5 destinos (identidade pessoal → `auth.users`, branding → `theme_tokens jsonb`, white-label → `app_name/logo_url`, landing → `pages.blocks jsonb`) |
| Dual system normalizado + JSONB (`client_transformations` + `intake_calculation_archive`) | Escolher 1 modelo. Para conteúdo flexível → JSONB. Para query estruturada → tabela normalizada. Nunca os 2 |
| 4 `system_*` config tables (BMI/lead status/plan features/pricing) com 0 rows | TS constants em `lib/constants/*.ts` + função pura em `lib/domain/` |
| Audit table generic 0-rows (`professional_customization_history`) | Sentry + log pino estruturado cobre. Tabela JIT quando UI "histórico" pedir |
| 5 tabelas Branding/Content rígidas (`testimonials`, `locations`, `methodology_pillars`, `credentials`, `faq_items`) | JSONB `blocks` em `platform.pages.published_blocks` (pattern §12 master plan) |
| `auth.jwt()->>'tenant_id'` direto em RLS | `(select public.current_tenant_id())` wrap (100× speedup) |
| Schema-per-tenant | Single-DB + RLS + `tenant_id` (não escala >100 tenants schema-per-tenant) |
| `decimal price` solto | Par `<x>_amount_minor int + <x>_currency text` |
| RLS DESABILITADA em qualquer tabela | CI `pnpm rls:audit` bloqueia |
| Tabela órfã sem consumer | JIT — só cria quando rota/tela que escreva nela existir na mesma semana |

---

## Referências

- `00-PROJETO.md` §5 (5 roles) · §8 (comunicação push+email)
- `_CONFLITOS.md` #1 (schema sizing dia 1) · #2 (sem TACO/TBCA dia 1 — IA gera) · #6 (construir vs vender)
- `01-arquitetura.md` (lib/data + RPC pattern)
- `03-naming-vocab.md` (vocab DB + JSONB keys EN)
- Master plan §0.5 (estratégia agência) · §5 (vertical-aware) · §15.4 (Money) · §16 (banco completo)
- Pesquisa 01 (gateway/billing/infra) · `.claude/rules/jwt-claims-rls.md`
- Memórias: `feedback_use_apply_migration.md`, `reference_normalized_vs_jsonb.md`

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — 2 schemas (public+desafit), ~22 core dia 0, JIT explícito, RLS pattern, anti-patterns | Leandro |
