# Auditoria e Melhores Práticas de Schema Postgres/Supabase para SaaS B2B Multi-tenant White-label — 2026

## TL;DR

- **Mantenha o shared-schema com RLS, mas endureça os três achados imediatamente:** (1) `REVOKE EXECUTE ... FROM anon, authenticated` em toda SECURITY DEFINER + `SET search_path=''`, (2) padrão "public download SEM listing" (sem policy SELECT ampla em `storage.objects`), (3) política "trust the JWT, not the args" em RPCs com `p_tenant_id`. Esses são exatamente os lints 0011, 0025, 0028, 0029 do Splinter, todos `WARN` de segurança.
- **JWT claim `tenant_id` via Custom Access Token Hook é o padrão canônico 2026** para até ~10k tenants no mesmo Postgres — schema-per-tenant só vale para isolamento regulatório (HIPAA, dados residency); database-per-tenant somente para enterprise tier individualizado. Sempre `(SELECT current_tenant_id())` envolvido em SELECT para forçar initPlan caching.
- **Stack alvo para Feature-1:** Declarative Schemas (`supabase/schemas/`) como source of truth + pgTAP + Basejump test helpers para contratos RLS + Playwright projects-per-tenant para E2E + Database Advisor + `auto-explain` no CI. Migre já para `sb_publishable_*` / `sb_secret_*` — conforme o Supabase Security Retro 2025 (supabase.com/blog/supabase-security-2025-retro): "Legacy keys remain available during migration but will be removed in late 2026", e desde 1 de novembro de 2025 projetos novos/restaurados já não recebem as legacy keys.

---

## BLOCO A — Multi-tenant Postgres/Supabase 2026

### A1. Pattern canônico: shared schema + RLS vs schema-per-tenant vs DB-per-tenant

**Resposta:** O padrão dominante em 2026, recomendado pela PlanetScale e pelo ecossistema Makerkit, é **shared-schema com RLS e coluna `tenant_id`** — é o único modelo que escala horizontalmente com baixa fricção operacional. Schema-per-tenant é um anti-pattern para SaaS B2B genérico porque migrations precisam ser aplicadas N vezes (gargalo a partir de algumas centenas de schemas), e perde-se a capacidade de queries analíticas cross-tenant. DB-per-tenant só faz sentido como "enterprise tier" para clientes regulados (saúde, financeiro, governo) que pagam pelo isolamento físico.

| Modelo                  | <100 tenants                       | 100–1k                 | 1k–10k                              | >10k                         |
| ----------------------- | ---------------------------------- | ---------------------- | ----------------------------------- | ---------------------------- |
| **Shared schema + RLS** | ✅ Recomendado                     | ✅ Recomendado         | ✅ Com partitioning por `tenant_id` | ⚠️ Hash-partitioning + Citus |
| **Schema-per-tenant**   | ⚠️ Aceitável                       | ❌ Migration nightmare | ❌                                  | ❌                           |
| **DB-per-tenant**       | 💰 Caro, justifica só p/ regulação | 💰                     | 💰 só enterprise tier               | 💰 só enterprise tier        |

> Simeon Griggs (PlanetScale, 21 de abril de 2026, planetscale.com/blog/approaches-to-tenancy-in-postgres): _"Of the three approaches, shared-schema is the most common and is our recommended approach. Shared-schema is also the only true method of 'multi-tenancy' in a relational database."_ Caveat material do mesmo artigo, que vale registrar: _"We generally don't recommend relying on RLS. It shifts security logic into the database, where policy misconfiguration, silent failures, and connection pooling interactions are difficult to debug."_ — PlanetScale recomenda shared-schema mas é cética quanto a delegar isolamento exclusivamente à RLS; o Supabase faz o caminho oposto, pondo a RLS no centro. Sua arquitetura deve adotar shared-schema **e** RLS, mas tratar a RLS como defesa em profundidade, sempre combinada com filtro explícito de `tenant_id` na query do client.

> Debugg.ai (2025, debugg.ai/resources/postgres-multitenancy-rls-vs-schemas-vs-separate-dbs): _"Most SaaS teams should start with RLS on shared, hash-partitioned tables and add Citus or native partitioning as they scale."_

**Recomendação para o stack (fitness/yoga/idiomas, white-label):** mantenha shared-schema + RLS. Para evitar dor a partir de ~5k tenants, planeje desde já: (i) coluna `tenant_id uuid not null` em **todas** as 38 tabelas, (ii) índices compostos `(tenant_id, <chave_de_query>)`, (iii) `(SELECT current_tenant_id())` em todas as policies (initPlan caching), (iv) PgBouncer/Supavisor em transaction mode.

### A2. JWT claim `tenant_id` vs lookup via `memberships`

**Resposta:** Para **single-active-tenant** (95% do tempo de um usuário), claim no JWT é dramaticamente mais rápido — é uma leitura constante de `request.jwt.claims`, não requer JOIN. Para **usuário com múltiplos tenants** (staff de agência, platform_admin), a tabela `memberships` é inevitável, mas deve ser consultada via **SECURITY DEFINER function** wrapping cached em `(SELECT ...)` para evitar re-execução por linha.

Importante: o guia oficial Supabase RLS Performance (supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv) deixa claro que **só wrappar a função em `(SELECT ...)` "is a big improvement but can still take seconds. Adding an index to team_id is the big win"** — o salto para milissegundos exige o **índice composto sobre `tenant_id` (ou `team_id`)**, não só o initPlan wrapping. Trate wrapping + índice como inseparáveis.

**Quando trocar de um para outro:**

| Cenário                                           | Padrão                                                       |
| ------------------------------------------------- | ------------------------------------------------------------ |
| Usuário tem **um** tenant ativo por sessão        | Claim `tenant_id` no JWT                                     |
| Usuário pode trocar de tenant em runtime          | Claim de **active_tenant** + array `tenant_ids` no JWT       |
| Hierarquia complexa (org → workspaces → projects) | Memberships table + `has_role_on_account()` SECURITY DEFINER |
| Platform_admin que vê tudo                        | Claim `app_role = 'platform_admin'` + policy OR adicional    |

### A3. Usuário com múltiplos tenants — switch sem re-login

**Padrão produção 2026 (Makerkit + Clerk + WorkOS):** o JWT carrega `tenant_ids: uuid[]` (todos os tenants do usuário) **e** `active_tenant_id: uuid` (o ativo). Trocar de tenant chama um endpoint server-side (Route Handler do Next.js 16) que: (a) valida via tabela `memberships` que o user pertence ao novo tenant, (b) regenera o access token via Custom Access Token Hook com `active_tenant_id` atualizado, (c) `setSession()` no client. Isso evita full re-login.

Snippet do Custom Access Token Hook (Supabase docs, supabase.com/docs/guides/auth/auth-hooks/custom-access-token-hook):

```sql
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
set search_path = ''
as $$
declare
  claims jsonb;
  uid uuid := (event->>'user_id')::uuid;
  v_active_tenant uuid;
  v_tenant_ids uuid[];
  v_app_role text;
begin
  claims := event->'claims';

  select active_tenant_id into v_active_tenant
  from public.user_state where user_id = uid;

  select array_agg(tenant_id) into v_tenant_ids
  from public.memberships where user_id = uid and revoked_at is null;

  select role into v_app_role
  from public.user_roles where user_id = uid;

  claims := jsonb_set(claims, '{tenant_id}', to_jsonb(v_active_tenant));
  claims := jsonb_set(claims, '{tenant_ids}', to_jsonb(coalesce(v_tenant_ids, '{}'::uuid[])));
  claims := jsonb_set(claims, '{app_role}', to_jsonb(coalesce(v_app_role, 'client')));

  return jsonb_set(event, '{claims}', claims);
end;
$$;

revoke execute on function public.custom_access_token_hook(jsonb) from public, anon, authenticated;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
```

### A4. RLS performance em escala — `(SELECT current_tenant_id())` wrap

**Resposta:** **Sempre envolva chamadas a funções/JWT claims em `(SELECT ...)`** dentro de policies. Isso força o planner a tratar como InitPlan (executa uma vez por query, não por linha). Combine com índice — o efeito isolado do wrapping é ordens de grandeza melhor que sem wrapping, mas só atinge milissegundos com índice apropriado.

```sql
-- ❌ Lento: chama current_tenant_id() por linha
create policy "lessons_tenant" on lessons for select using (
  tenant_id = current_tenant_id()
);

-- ✅ Rápido: InitPlan caching + índice
create policy "lessons_tenant" on lessons for select using (
  tenant_id = (select current_tenant_id())
);
create index on lessons (tenant_id, created_at desc);
```

Combinar com **filtro explícito no client** (`.eq('tenant_id', tenantId)`) é recomendação oficial do Supabase ("Add a filter in addition to the RLS") — mesmo com RLS, o filtro redundante ajuda o planner a usar índices.

### A5. Bypass RLS legítimo — quando usar cada um

| Mecanismo                                       | Use quando                                                                                                                   | Pitfall conhecido 2025-2026                                                       |
| ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `service_role` / `sb_secret_*` em Edge Function | Admin tasks server-side, jobs cron, webhook handlers                                                                         | NUNCA no browser; auto-revoke do GitHub Secret Scanning quando vaza               |
| `SECURITY DEFINER` function                     | Cross-tenant aggregate (catálogo global, billing analytics)                                                                  | Sem `SET search_path = ''` é CVE-2018-1058; sem REVOKE FROM anon é lint 0028/0029 |
| Materialized view                               | Dashboards cross-tenant pre-computados                                                                                       | Não respeita RLS por default; precisa estar em schema NÃO exposto                 |
| `FORCE ROW LEVEL SECURITY`                      | Quando você quer que o **owner** da tabela (postgres role) também respeite a policy — testes locais e defesa em profundidade | Quebra `pg_dump` se `row_security=on`; útil para sensitive_data tables            |

Citação Postgres 17 docs (postgresql.org/docs/17/ddl-rowsecurity.html): _"Table owners normally bypass row security as well, though a table owner can choose to be subject to row security with ALTER TABLE ... FORCE ROW LEVEL SECURITY."_

---

## BLOCO B — Catálogos globais vs tenant data

### B6. Catálogos globais (ISO currencies, slug blocklist, taxonomias)

**Pattern recomendado:** tabela em schema separado (`reference.*` ou `catalog.*`) **NÃO exposto** via PostgREST, acessada por **SECURITY DEFINER functions** com `SET search_path = ''`. Evita o anti-pattern `USING (true)` em RLS, que é detectado pelo lint **0024 permissive_rls_policy**.

```sql
create schema if not exists catalog;
revoke all on schema catalog from public, anon, authenticated;

create table catalog.currencies (
  code char(3) primary key,    -- ISO 4217
  name text not null,
  decimals smallint not null
);

create or replace function public.list_currencies()
returns setof catalog.currencies
language sql
stable
security definer
set search_path = ''
as $$
  select * from catalog.currencies order by code;
$$;

revoke execute on function public.list_currencies() from public;
grant execute on function public.list_currencies() to anon, authenticated;
```

**Anti-pattern real:** `create policy "all_can_read" on public.currencies using (true);` — em projeto multi-tenant, qualquer policy `USING (true)` em tabela pública é red flag, sinalizada como `permissive_rls_policy` (lint 0024) pelo Splinter.

### B7. Hierarquia "global seed → brand override → tenant override"

**Pattern template→instance** (Linear, Shopify, Stripe Connect): tabela `templates.email_templates` (read-only, populada por seed) + tabela `public.email_templates` (per-tenant, FK opcional para `templates.id`). Resolução de configuração via função:

```sql
create or replace function public.resolve_email_template(p_key text)
returns templates.email_templates
language sql stable security invoker
set search_path = ''
as $$
  select coalesce(
    (select t from public.email_templates t
       where tenant_id = (select public.current_tenant_id()) and key = p_key),
    (select t from templates.email_templates t where key = p_key)
  );
$$;
```

A documentação Stripe (docs.stripe.com/use-stripe-apps/salesforce-commerce-cloud) é explícita sobre suportar exatamente este pattern para configurações por connected account: _"Each storefront can operate with its own distinct Stripe app configuration (separate API keys, payment methods, account, and so on), or all storefronts can share a unified Stripe configuration."_

### B8. Versionamento de prompts AI compartilhados

**Padrão 2026 (Anthropic + OpenAI multi-tenant SaaS):** prompts como **cross-tenant by design**, com `ai_prompts` (chave + descrição) + `ai_prompt_versions` (versão + body + model). Per-tenant override é a exceção, modelada como `tenant_ai_prompt_overrides (tenant_id, prompt_key, version_id, custom_body)`. Resolução: `coalesce(tenant_override, latest_published_version)`.

Use `templates` schema (não exposto) para os prompts globais; só `public.tenant_ai_prompt_overrides` é RLS-protegido.

---

## BLOCO C — Segredos e dados sensíveis em Postgres

### C9. Onde armazenar VAPID, OAuth refresh tokens, Stripe keys per-tenant

| Local                                                   | Use quando                                                                                                                        | Trade-off                                                                                                                                                   |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supabase Vault** (`vault.secrets`)                    | Per-tenant secrets que precisam ser legíveis em runtime via SQL (refresh tokens, Stripe Connect access tokens, VAPID private key) | TCE com pgsodium; encrypted-at-rest; rotação manual; `vault.decrypted_secrets` view; **disable statement logging** (senão secrets vão para logs em INSERTs) |
| **Edge Function secrets** (`SUPABASE_SECRET_KEYS` etc.) | App-wide secrets, não per-tenant (Stripe platform key, AWS SES)                                                                   | Visible no dashboard; rotação via CLI                                                                                                                       |
| **KMS externo** (AWS KMS / GCP KMS)                     | Compliance HIPAA, dados de saúde, key rotation auditável                                                                          | Latência extra; complexidade operacional                                                                                                                    |
| **Coluna `encrypted_*` com `pgcrypto`**                 | Casos legados                                                                                                                     | NÃO recomendado pelo Supabase em 2026 (pgcrypto está deprecated em favor de Vault/pgsodium)                                                                 |

Citação Supabase (supabase.com/blog/supabase-vault): _"Until now, the industry-standard for PostgreSQL encryption is a built-in extension called pgcrypto ... pgcrypto has been around for a long time, and while it supports some basic encryption and decryption abilities, it lacks features like public key signing, key derivation APIs, streaming encryption, and other modern features required by security-first applications."_

⚠️ **Pitfall crítico** (Supabase Vault GitHub README, github.com/supabase/vault): _"When you insert secrets into the vault table with an INSERT statement, those statements get logged by default into the Supabase logs. ... you should turn off statement logging while using the Vault."_

### C10. Field-level encryption em coluna sensível

**Padrão Postgres 17 + Supabase 2026:**

- Triggers `BEFORE INSERT/UPDATE` com `pgsodium.crypto_aead_det_encrypt` (deterministic) se você precisa querying por valor exato (hash de email para deduplicação).
- Vault wrapper (`vault.decrypted_secrets` view) para tokens opacos onde você só lê o valor decifrado uma vez (refresh token, API key).
- pgcrypto `pgp_sym_encrypt` ainda funciona mas é considerado legacy; use apenas se Vault não atende.

Performance: AEAD com pgsodium em coluna acessada por linha custa ~5–20µs por row; aceitável para read-heavy se a coluna não está em WHERE clauses.

### C11. Omitir coluna sensível do SELECT sem boilerplate

**Padrão canônico Postgres 17 + Supabase 2026 — três opções em ordem de preferência:**

**(a) Column-Level GRANT** (a mais limpa, recomendada pelo lint 0023):

```sql
revoke select (password_hash, api_token, stripe_secret) on public.users from anon, authenticated;
grant  select (id, email, display_name, avatar_url)    on public.users to authenticated;
```

**(b) View `security_invoker = true`** com subset de colunas (Postgres 15+):

```sql
create view public.users_public with (security_invoker = true) as
  select id, display_name, avatar_url from public.users;
```

**(c) Sub-tabela `tenant_secrets`** com policy mais restrita (recomendado para credenciais que só backend toca):

```sql
create table public.tenant_secrets (
  tenant_id uuid primary key references public.tenants(id),
  stripe_secret_key text,
  vapid_private_key text
);
alter table public.tenant_secrets enable row level security;
alter table public.tenant_secrets force row level security;
-- Sem nenhuma policy: só service_role acessa
```

---

## BLOCO D — JSONB vs normalizado

### D12. Checklist 2026

**Use coluna normalizada quando:**

- Você filtra ou ordena pelo campo regularmente (`WHERE`, `ORDER BY`)
- Constraints relacionais (`NOT NULL`, `CHECK`, FK)
- O campo tem nome estável que outros devs precisam descobrir via schema introspection
- Você gera tipos TypeScript via `supabase gen types` e quer autocomplete

**Use JSONB quando:**

- Schema é variável por tenant (custom fields no white-label)
- Payload externo opaco (webhook body, API response cache)
- Evolução rápida sem migration
- Document-shaped data com leituras agregadas

SitePoint ("PostgreSQL JSONB Performance Guide: Indexing & Query Optimization", sitepoint.com/postgresql-jsonb-query-performance-indexing/): _"Promote frequently updated or filtered JSONB keys to typed columns when access patterns stabilize."_ — regra prática: se você fez 3 expression indexes no mesmo path JSONB, é hora de normalizar essa coluna.

### D13. GIN index strategies Postgres 17

| Estratégia                      | Tamanho do índice          | Operadores suportados              | Use quando                                               |
| ------------------------------- | -------------------------- | ---------------------------------- | -------------------------------------------------------- |
| `gin (col jsonb_ops)` (default) | Maior                      | `?`, `?\|`, `?&`, `@>`, `@?`, `@@` | Queries com key existence (`data ? 'status'`)            |
| `gin (col jsonb_path_ops)`      | ~30–50% menor; mais rápido | Apenas `@>`, `@?`, `@@`            | Containment queries (`data @> '{"role":"admin"}'`)       |
| Expression B-tree               | Mínimo                     | `=`, `<`, `>`                      | Filtra sempre pelo mesmo path: `gin ((data->>'status'))` |
| Partial index                   | Mínimo                     | Qualquer                           | Quando 90% das queries têm o mesmo filtro estático       |

**Gotcha mais comum** (DEV.to 2025, dev.to/polliog/postgresql-jsonb-gin-indexes): criar `jsonb_path_ops` e depois query com `?` (key existence) — o índice é silenciosamente ignorado e a query vai a seq scan. Sempre `EXPLAIN ANALYZE` na PR.

### D14. Migração JSONB → tabela normalizada — zero-downtime

Estratégia em 4 fases:

1. **ADD** coluna nova normalizada (e.g., `status text`), default NULL.
2. **Dual-write**: trigger `BEFORE INSERT/UPDATE` que copia `(data->>'status')::text` para a nova coluna. Backfill em batches via `update ... where data ? 'status' and status is null limit 10000`.
3. **Swap**: app code passa a ler da coluna nova; mantém escrita dupla por mais 1–2 semanas.
4. **DROP**: remove a chave do JSONB e o trigger.

Esse pattern é o canônico do ecossistema Postgres; nenhum dos passos requer `LOCK TABLE` exclusivo prolongado.

### D15. "JSONB hybrid" — coluna normalizada + jsonb para extras

**Funciona** quando: o JSONB carrega apenas opcionais "vendor-extensions" que o app não filtra; ex.: `metadata jsonb` em Stripe-like objects, `custom_fields jsonb` em forms white-label.

**Vira anti-pattern** quando: você começa a indexar 3+ paths no JSONB, ou quando queries fazem `WHERE metadata->>'X' = 'Y'` em hot paths. Migrar para colunas (D14).

Convenção amplamente adotada (vista em Stripe, GitHub API, e a maioria dos schemas Supabase analisados): manter `metadata jsonb` apenas para extensões opacas e promover qualquer key consultada para coluna real. Nota: anteriormente afirmamos um exemplo específico do schema do Linear; não foi possível confirmar essa atribuição em fonte primária e o exemplo foi removido — trate este pattern como convenção de comunidade, não citação de blog específico.

---

## BLOCO E — Performance e operação

### E16. Auditoria recorrente

| Ferramenta                                            | Frequência                         | O que pega                                                                                                          |
| ----------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Supabase Database Advisor (Splinter)**              | Diário (auto) + manual antes de PR | RLS desabilitado, search_path mutable, FK sem índice, SECURITY DEFINER exposto a anon, public_bucket_allows_listing |
| **`pg_stat_statements`**                              | Semanal review                     | Top 20 queries por tempo total, p95 latency                                                                         |
| **`auto_explain`**                                    | Sempre on em staging               | Captura plans de queries lentas (>200ms)                                                                            |
| **`vacuumdb --analyze-only` + `pg_stat_user_tables`** | Quinzenal                          | Table bloat, dead tuples, autovacuum starvation                                                                     |

Comando CLI: `supabase db lint --linked --level=warning --fail-on=error`.

### E17. FKs sem índice — quando é problema real

**Regra prática:** lint 0001 dispara para todas as FKs. Mas o problema real surge quando:

- A tabela pai recebe `DELETE`/`UPDATE` da PK (CASCADE precisa do índice na child).
- A FK é usada em JOIN frequente.
- A tabela child tem >10k rows.

Para tabelas <10k rows e FK só para integridade referencial (sem JOIN/DELETE), o lint é INFO ignorável.

### E18. Triggers vs RPCs vs `generated always as`

| Mecanismo                 | Use quando                                                                                                        | Auditabilidade                           |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Trigger BEFORE/AFTER**  | Invariante de negócio que precisa rodar em qualquer write (audit log, computed column derivada de várias colunas) | Difícil debugar; teste com pgTAP         |
| **RPC explícita**         | Operação de domínio com semântica clara (`book_class`, `cancel_subscription`)                                     | Fácil testar; aparece como function call |
| **`generated always as`** | Coluna pura/determinística de uma expressão simples                                                               | Visível no schema; sem trigger overhead  |

Recomendação: prefira `generated always as` para colunas computadas; RPCs para operações de domínio; triggers apenas para audit/observability transversal.

### E19. Soft-delete `deleted_at IS NULL` — pattern canônico Supabase 2026

⚠️ **Pitfall real:** se a policy SELECT inclui `deleted_at IS NULL`, então um `UPDATE ... SET deleted_at = now()` falha — porque RLS UPDATE precisa que o row continue visível **antes E depois** do update (Issue #2799 do Supabase, discussão #32985, Bug #1941 do supabase-js). Padrões:

**Opção A (recomendada):** soft-delete via RPC SECURITY DEFINER com `SET search_path = ''`, que internamente faz `UPDATE` ignorando RLS:

```sql
create or replace function public.soft_delete_lesson(p_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.lessons
  set deleted_at = now()
  where id = p_id
    and tenant_id = (select public.current_tenant_id());
end;
$$;
revoke execute on function public.soft_delete_lesson(uuid) from public, anon;
grant   execute on function public.soft_delete_lesson(uuid) to authenticated;
```

**Opção B:** view `active_lessons` com `where deleted_at is null` e RLS na tabela base sem filtro `deleted_at` — o app sempre lê da view.

**Index parcial:** `create index on lessons (tenant_id, created_at desc) where deleted_at is null;` — economia de 30–60% no índice em tabelas com alta taxa de soft-delete.

### E20. RLS USING + WITH CHECK

**Regra:**

- `SELECT`/`DELETE` → apenas `USING`.
- `INSERT` → apenas `WITH CHECK`.
- `UPDATE` → **ambos**: `USING` (row visível antes) + `WITH CHECK` (row visível depois). Sem `WITH CHECK`, o user pode mudar `tenant_id` para outro tenant em um UPDATE, abrindo IDOR cross-tenant.

```sql
create policy "lessons_update_own_tenant" on lessons
for update to authenticated
using      (tenant_id = (select current_tenant_id()))
with check (tenant_id = (select current_tenant_id()));
```

Bytebase ("Postgres Row-Level Security Footguns", bytebase.com/blog/postgres-row-level-security-footguns) é explícito: _"USING filters existing rows for SELECT/UPDATE/DELETE, but WITH CHECK validates new/modified rows for INSERT/UPDATE. Users can INSERT data they can't see!"_ — sem WITH CHECK, o vetor IDOR é real.

---

## BLOCO F — Migração e refactor seguro

### F21. Dropar tabela em Supabase com FK + RLS + triggers + index

Ordem segura:

```sql
begin;
-- 1. Drop publications de Realtime
alter publication supabase_realtime drop table public.old_table;
-- 2. Drop FKs em outras tabelas que referenciam old_table
alter table public.child drop constraint child_old_fk;
-- 3. Drop triggers
drop trigger if exists tg_audit on public.old_table;
-- 4. Drop policies
drop policy if exists "p_select" on public.old_table;
-- 5. Drop indexes (se quiser ser explícito; senão cascade)
-- 6. Drop table (cascade resolve o resto)
drop table public.old_table cascade;
-- 7. Drop type/sequence órfãos
commit;
```

### F22. Renomear coluna zero-downtime + types regen

Pattern `add → dual-write → swap → drop`:

1. `ALTER TABLE x ADD COLUMN new_name type;` (NULL allowed)
2. Trigger BEFORE INSERT/UPDATE copia `old_name → new_name`. Backfill batches.
3. Deploy app que **lê de new_name, escreve nas duas**. Regen types: `supabase gen types typescript --linked`.
4. Deploy app que ignora `old_name`.
5. `ALTER TABLE x DROP COLUMN old_name;` + drop trigger.

PostgREST refresh schema cache: `NOTIFY pgrst, 'reload schema';`

### F23. Declarative schema vs migration files — source of truth

**Pattern oficial Supabase 2026** (anunciado em 3 de abril de 2025, supabase.com/blog/declarative-schemas): **`supabase/schemas/*.sql` é o source of truth**; `supabase/migrations/*.sql` é **gerado** por `supabase db diff -f <name>` comparando schemas contra DB local. Drift detection: `supabase db diff --linked` mostra divergência entre prod e schemas.

> Supabase Engineering: _"Declarative schemas store the final desired state of the database in .sql files... We added the same set of tools that we used internally for the last 2 years to Supabase CLI."_

**Caveats conhecidos** (supabase.com/docs/guides/local-development/declarative-database-schemas): DML statements, cron jobs, storage buckets, vault secrets NÃO são capturados; mantenha-os em versioned migrations manuais.

---

## BLOCO G — SECURITY DEFINER vs INVOKER (CRÍTICO)

### G24. Decision tree por categoria

```
Função vai ser chamada via PostgREST RPC (HTTP /rpc/fn)?
│
├── NÃO (só trigger / outra function / job interno)
│   └── (A) Internal-only:
│       SECURITY INVOKER + SET search_path = ''
│       REVOKE EXECUTE FROM PUBLIC, anon, authenticated
│       GRANT EXECUTE TO postgres (ou service_role para Edge Functions)
│
└── SIM
    │
    ├── Precisa bypass legítimo (lê plano de outro tenant, billing aggregate)?
    │   └── (B) Public API com bypass:
    │       SECURITY DEFINER + SET search_path = ''
    │       Caller checks: if input != current_tenant_id() then raise
    │       REVOKE FROM public; GRANT EXECUTE TO authenticated (NUNCA anon)
    │
    └── Não precisa bypass (current_tenant_id, has_role, etc.)?
        └── (C) Public API sem bypass:
            SECURITY INVOKER + SET search_path = ''
            GRANT EXECUTE TO authenticated (anon só se realmente público)
```

**Decisão Makerkit** (Janeiro 2026, makerkit.dev/blog/tutorials/supabase-rls-best-practices): _"Security-definer functions should never be created in a schema in the 'Exposed schemas' inside your API settings."_ — recomenda manter SECURITY DEFINER em `private`/`app_private` schema, com wrappers SECURITY INVOKER em `public` quando precisa expor.

### G25. `current_tenant_id()` callable por anon — retorna NULL ou enumeration?

**Análise:** `current_tenant_id()` lendo `request.jwt.claims->>'tenant_id'` retorna NULL para JWT anônimo. **Não é enumeration vector** (não revela informação) — mas é desnecessariamente exposto.

**Pattern 2026 recomendado:** REVOKE para anon, GRANT só para authenticated:

```sql
create or replace function public.current_tenant_id()
returns uuid
language sql stable
security invoker
set search_path = ''
as $$
  select nullif(
    current_setting('request.jwt.claims', true)::jsonb->>'tenant_id',
    ''
  )::uuid;
$$;

revoke execute on function public.current_tenant_id() from public, anon;
grant   execute on function public.current_tenant_id() to authenticated;
```

### G26. `SET search_path = ''` — quando obrigatório

**Sempre obrigatório em SECURITY DEFINER**, motivado por CVE-2018-1058 (wiki.postgresql.org/wiki/A_Guide_to_CVE-2018-1058): a melhor mitigação documentada pelo PostgreSQL Global Development Group. Sem isso, um usuário com `CREATE` em `public` cria função `lower(varchar)` malicioso que sobrescreve `pg_catalog.lower()` para queries não-qualificadas, executando arbitrário com privilégios do dono da função.

O lint **0011 `function_search_path_mutable`** (level WARN, supabase.com/docs/guides/database/database-advisors?lint=0011_function_search_path_mutable) detecta exatamente isso. Remediação canônica recomendada pelo Supabase:

```sql
alter function public.my_fn() set search_path = '';
-- E dentro do body, qualifique TUDO: public.users, pg_catalog.now()
```

Divergência entre fontes: a documentação Postgres `CREATE FUNCTION` permite `SET search_path TO schema1, pg_temp;` como variante segura para SECURITY DEFINER. Supabase Splinter prefere `''` (string vazia, força full-qualification). **Use `''`** — é estritamente mais restritivo e elimina ambiguidades.

Para SECURITY INVOKER não é estritamente obrigatório, mas é boa prática (consistência + futuro-proof).

### G27. RPC com `p_tenant_id` — validar ou ignorar?

**Veredito 2026: "Trust the JWT, not the args."** Sempre **valide ou ignore**. Nunca confie em arg de tenant_id do client.

**Pattern A — validar (preferred, mantém ergonomia para admin):**

```sql
create or replace function public.can_use_feature(
  p_tenant_id uuid,
  p_feature text
) returns boolean
language plpgsql stable security definer
set search_path = ''
as $$
declare
  v_caller_tenant uuid := (select public.current_tenant_id());
  v_app_role text := current_setting('request.jwt.claims', true)::jsonb->>'app_role';
begin
  -- Só platform_admin pode consultar feature de outro tenant
  if p_tenant_id <> v_caller_tenant and v_app_role <> 'platform_admin' then
    raise exception 'forbidden: caller tenant % cannot query tenant %',
      v_caller_tenant, p_tenant_id using errcode = '42501';
  end if;

  return exists (
    select 1 from public.tenant_features
    where tenant_id = p_tenant_id and feature_key = p_feature
  );
end;
$$;
revoke execute on function public.can_use_feature(uuid, text) from public, anon;
grant   execute on function public.can_use_feature(uuid, text) to authenticated;
```

**Pattern B — ignorar arg (mais defensivo, perde admin ergonomics):**

```sql
create or replace function public.get_entitlement(p_feature text)
returns jsonb
language sql stable security invoker
set search_path = ''
as $$
  select features from public.tenant_features
  where tenant_id = (select public.current_tenant_id())
    and feature_key = p_feature;
$$;
```

Use B para queries do tenant ativo (95% dos casos). Use A apenas para RPCs admin (com guardrail explícito).

---

## BLOCO H — Storage RLS (CRÍTICO)

### H28. Bucket público — download direto SEM listing

**Padrão oficial Supabase 2026** (supabase.com/docs/guides/troubleshooting/why-cant-i-uploadlistetc-my-public-bucket-Z6CmGt): _"A public bucket in the storage API only means there is a public URL available you can use to download the file. All other bucket or file operations require you to meet storage policies on that bucket."_

E supabase.com/docs/guides/storage/buckets/fundamentals: _"When a bucket is designated as 'Public,' it effectively bypasses access controls for both retrieving and serving files within the bucket. This means that anyone who possesses the asset URL can readily access the file. Access control is still enforced for other types of operations including uploading, deleting, moving, and copying."_

**Conjunto mínimo de policies — NÃO crie SELECT ampla:**

```sql
-- Bucket criado como public = true (download via /object/public/<bucket>/<path> sem JWT)
-- NÃO crie policy SELECT em storage.objects para este bucket. Pronto.

-- Se precisar de SELECT seletivo (ex: getPublicUrl owner-side), use helper:
create policy "public_bucket_no_list" on storage.objects
for select to anon, authenticated
using (
  bucket_id = 'tenant-logos'
  and storage.allow_only_operation() <> 'list'
);

-- INSERT só pelo tenant dono:
create policy "tenant_logo_insert" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'tenant-logos'
  and (storage.foldername(name))[1] = (select public.current_tenant_id())::text
);

create policy "tenant_logo_update" on storage.objects
for update to authenticated
using      (bucket_id = 'tenant-logos' and (storage.foldername(name))[1] = (select public.current_tenant_id())::text)
with check (bucket_id = 'tenant-logos' and (storage.foldername(name))[1] = (select public.current_tenant_id())::text);

create policy "tenant_logo_delete" on storage.objects
for delete to authenticated
using (bucket_id = 'tenant-logos' and (storage.foldername(name))[1] = (select public.current_tenant_id())::text);
```

O lint **0025 `public_bucket_allows_listing`** detecta exatamente o erro de combinar bucket público com policy SELECT ampla.

### H29. Buckets per-tenant — folder convention vs bucket_id prefix

**Recomendação:** **folder convention `{tenant_id}/path/file.jpg`** com helper `storage.foldername(name)`. Razões:

- Limite operacional de buckets por projeto (Supabase recomenda agrupar por classe de acesso, não por tenant).
- Bucket é unidade de configuração (public/private, MIME types, size limit) — você não quer N+1 configs.
- Policy com `(storage.foldername(name))[1] = current_tenant_id()::text` é o padrão canônico (já mostrado em H28).

Use **bucket_id prefix** apenas quando há diferenças de configuração reais (ex: `tenant-public-assets` vs `tenant-private-pdfs`).

### H30. Signed URLs vs RLS policies

| Caso                                   | Recomendado                           | Por quê                                       |
| -------------------------------------- | ------------------------------------- | --------------------------------------------- |
| Avatar upload pelo user                | RLS + bucket público                  | Cacheable em CDN; lookup direto               |
| Brand asset (logo, favicon) tenant     | RLS + bucket público                  | Mesmo motivo; high cache hit ratio            |
| Tenant-private PDF (invoice, contrato) | `createSignedUrl({ expiresIn: 300 })` | Não cacheable em CDN público; auditável       |
| Avatar upload com pre-flight check     | `createSignedUploadUrl`               | Server valida quota antes; client sobe direto |

### H31. Storage + Realtime — policy separada?

**Sim.** Realtime em `storage.objects` é um sub-caso de Postgres Changes Realtime. Você precisa: (a) adicionar `storage.objects` à publication `supabase_realtime`, (b) garantir que o role authenticated tem SELECT policy que cubra os objetos relevantes, porque o WALRUS aplica a policy do user que está subscrito (supabase.com/blog/realtime-row-level-security-in-postgresql).

Bug histórico: em 2024-2025 vários issues (e.g. supabase/supabase#35195) reportaram que Realtime "para" quando RLS é ligada — root cause é sempre policy SELECT ausente para o role authenticated, não bug do WALRUS.

---

## BLOCO I — RPC API surface design (CRÍTICO)

### I32. "Trust caller's JWT, not their args"

Já coberto em G27. Resumo: **valide `p_tenant_id = current_tenant_id()` no body para RPCs que recebem `p_tenant_id`**, exceto quando o caller é provadamente platform_admin (verificado por `app_role` claim, não por arg).

### I33. Versioning de RPCs zero-downtime

**Padrão**:

- **CREATE OR REPLACE com mudança backward-compatible** (adicionar parâmetro com default): ok, types regen sem breaking change.
- **Mudança breaking** (mudar tipo de retorno, remover param): crie função paralela `fn_v2`, deploy clients para usar v2, depois drop v1. Nunca `OR REPLACE` quebrando.

```sql
-- Antes:
create function public.can_use_feature(p_feature text) returns boolean ...

-- Mudança breaking: adicionar quota retornada
create function public.can_use_feature_v2(p_feature text)
returns table(allowed boolean, quota int, used int) ...

-- Após N semanas:
drop function public.can_use_feature(text);
```

### I34. Rate limiting para RPCs anon-callable

**Stack 2026 recomendada (em camadas):**

1. **Cloudflare WAF** (rate limit por IP, por endpoint): primeira linha; barato.
2. **Edge Function wrapper** para RPCs sensíveis (signup, password reset): controla rate por email/IP em KV/Redis (Upstash).
3. **pg_cron + counter table** para quota per-tenant (ex.: limites de chamadas de IA por tenant): contador incrementado por trigger ou pela própria RPC.
4. **PgBouncer / Supavisor** limita conexões agregadas (não rate de queries individuais).

Para RPCs **anon-callable** (signup, public lookups), Cloudflare + Edge Function wrapper é mandatory; expor RPC diretamente ao anon sem rate limit é vetor de DoS conhecido (Discussion #22484 Supabase).

---

## BLOCO J — Multi-tenant test automation (CRÍTICO)

### J35. Playwright + Supabase: 2 sessões autenticadas em tenants diferentes

**Pattern oficial recomendado** (supabase-community/e2e + Playwright projects, github.com/supabase-community/e2e):

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  projects: [
    { name: 'setup-tenant-a', testMatch: /global\.setup\.ts/ },
    {
      name: 'tenant-a',
      use: { storageState: 'playwright/.auth/tenant-a.json' },
      dependencies: ['setup-tenant-a'],
    },
    {
      name: 'tenant-b',
      use: { storageState: 'playwright/.auth/tenant-b.json' },
      dependencies: ['setup-tenant-a'],
    },
  ],
})

// playwright/global.setup.ts
import { test as setup } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs/promises'

const url = process.env.SUPABASE_URL!
const anon = process.env.SUPABASE_PUBLISHABLE_KEY!
const adminKey = process.env.SUPABASE_SECRET_KEY!
const PROJECT_REF = process.env.SUPABASE_PROJECT_REF!

setup('seed + authenticate both tenants', async ({}) => {
  const admin = createClient(url, adminKey, { auth: { persistSession: false } })

  // Seed tenant A + user
  await admin.auth.admin.createUser({
    email: 'a@test.local',
    password: 'tA-pw-123',
    email_confirm: true,
    app_metadata: { tenant_id: 'aaaa-aaaa-aaaa', app_role: 'professional' },
  })

  // Seed tenant B + user
  await admin.auth.admin.createUser({
    email: 'b@test.local',
    password: 'tB-pw-123',
    email_confirm: true,
    app_metadata: { tenant_id: 'bbbb-bbbb-bbbb', app_role: 'professional' },
  })

  for (const [email, pw, file] of [
    ['a@test.local', 'tA-pw-123', 'tenant-a.json'],
    ['b@test.local', 'tB-pw-123', 'tenant-b.json'],
  ] as const) {
    const client = createClient(url, anon)
    const { data } = await client.auth.signInWithPassword({ email, password: pw })
    const session = data.session!
    await fs.writeFile(
      `playwright/.auth/${file}`,
      JSON.stringify({
        origins: [
          {
            origin: 'http://localhost:3000',
            localStorage: [
              {
                name: `sb-${PROJECT_REF}-auth-token`,
                value: JSON.stringify(session),
              },
            ],
          },
        ],
      }),
    )
  }
})
```

Pattern análogo descrito por HillelSP (CyberArk Engineering, medium.com/cyberark-engineering/scaling-e2e-tests-for-multi-tenant-saas-with-playwright): _"Use Playwright projects to model each tenant as an isolated test run. Keep shared tests, but inject tenant-specific base URLs, credentials, storage states, and metadata per project."_

### J36. pgTAP para RLS contracts

**pgTAP** (com `basejump-supabase_test_helpers`) é a ferramenta canônica recomendada pelo próprio Supabase docs (supabase.com/docs/guides/local-development/testing/pgtap-extended). Vale a pena vs E2E Playwright quando você quer:

- Prova determinística que "tenant A não pode ler tenant B" em todas as policies, sem subir browser.
- CI rápido (segundos vs minutos).
- Cobertura de paths que E2E não atinge (operações batch, RLS em UPDATE/DELETE).

```sql
-- supabase/tests/rls_tenant_isolation.sql
begin;
select plan(3);

insert into public.tenants (id, name) values
  ('11111111-1111-1111-1111-111111111111','A'),
  ('22222222-2222-2222-2222-222222222222','B');

select tests.create_supabase_user('user_a', 'a@test.local');
select tests.create_supabase_user('user_b', 'b@test.local');

update auth.users
  set raw_app_meta_data = raw_app_meta_data || '{"tenant_id":"11111111-1111-1111-1111-111111111111"}'::jsonb
  where email='a@test.local';
update auth.users
  set raw_app_meta_data = raw_app_meta_data || '{"tenant_id":"22222222-2222-2222-2222-222222222222"}'::jsonb
  where email='b@test.local';

insert into public.lessons (tenant_id, title) values
  ('11111111-1111-1111-1111-111111111111','lesson_A'),
  ('22222222-2222-2222-2222-222222222222','lesson_B');

select tests.authenticate_as('user_a');
select results_eq(
  $$ select title from public.lessons order by title $$,
  $$ values ('lesson_A'::text) $$,
  'user_a sees only tenant A lessons'
);

select tests.authenticate_as('user_b');
select results_eq(
  $$ select title from public.lessons order by title $$,
  $$ values ('lesson_B'::text) $$,
  'user_b sees only tenant B lessons'
);

select tests.authenticate_as('user_a');
select throws_ok(
  $$ insert into public.lessons (tenant_id, title) values ('22222222-2222-2222-2222-222222222222','hack') $$,
  'new row violates row-level security policy for table "lessons"'
);

select * from finish();
rollback;
```

Run: `supabase test db`.

### J37. Test fixtures multi-tenant — factory pattern

```typescript
// tests/factories/tenant-factory.ts
import { faker } from '@faker-js/faker'
import { z } from 'zod'
import type { SupabaseClient } from '@supabase/supabase-js'

const TenantSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  vertical: z.enum(['fitness', 'yoga', 'languages']),
  brand_palette: z.object({ primary: z.string(), accent: z.string() }),
})

export async function createTenantWithUsers(
  admin: SupabaseClient,
  opts: { vertical?: 'fitness' | 'yoga' | 'languages'; userCount?: number } = {},
) {
  const tenant = TenantSchema.parse({
    id: faker.string.uuid(),
    name: faker.company.name(),
    vertical: opts.vertical ?? 'fitness',
    brand_palette: {
      primary: faker.color.rgb(),
      accent: faker.color.rgb(),
    },
  })

  await admin.from('tenants').insert(tenant)

  const users = await Promise.all(
    Array.from({ length: opts.userCount ?? 2 }, async () => {
      const {
        data: { user },
      } = await admin.auth.admin.createUser({
        email: faker.internet.email(),
        password: faker.internet.password({ length: 16 }),
        email_confirm: true,
        app_metadata: { tenant_id: tenant.id, app_role: 'client' },
      })
      return user!
    }),
  )

  return { tenant, users }
}
```

### J38. CI que detecta RLS regression

**Setup canônico 2026** — combinar pgTAP + snapshot test em CI:

```yaml
# .github/workflows/db-tests.yml
name: Database Tests
on:
  pull_request:
    paths: ['supabase/**']
jobs:
  rls-contracts:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v1
        with: { version: latest }
      - name: Start Supabase
        run: supabase start
      - name: Run pgTAP RLS tests
        run: supabase test db
      - name: Splinter security advisor
        run: supabase db lint --linked --level=warning --fail-on=warning
      - name: Cross-tenant leak snapshot
        run: |
          psql "$DB_URL" -f tests/cross_tenant_snapshot.sql > snapshot.out
          diff snapshot.out tests/cross_tenant_snapshot.expected.out
```

`tests/cross_tenant_snapshot.sql`:

```sql
-- Para cada par (tenant, tabela), conta linhas visíveis ao OUTRO tenant.
-- Esperado: tudo 0.
set local role authenticated;
set local request.jwt.claims = '{"sub":"<user_a>","tenant_id":"<tenant_A>","app_role":"client"}';
select 'lessons cross-leak' as test, count(*) from public.lessons where tenant_id <> '<tenant_A>';
select 'classes cross-leak', count(*) from public.classes where tenant_id <> '<tenant_A>';
-- ... uma linha por tabela
```

Falha o build se qualquer count >0.

---

## BLOCO K — Realtime RLS audit (CRÍTICO)

### K39. `realtime.subscription` table com `rls_enabled: false`

A tabela `realtime.subscription` é interna ao serviço Realtime; seu campo `rls_enabled` reflete se a entidade subscrita tem RLS na origem, **não** controla por si só. Em 2026 o padrão é: **toda tabela em schema exposto deve ter RLS ativada**. O serviço Realtime conecta como `supabase_admin` (high privilege) e aplica a policy do usuário via WALRUS — você não configura `rls_enabled` manualmente; é derivado.

### K40. `postgres_changes` respeita RLS automaticamente?

**Sim, via WALRUS** (supabase.com/blog/realtime-row-level-security-in-postgresql). O WAL é decodificado, e para cada change a função `realtime.apply_rls(jsonb)` valida visibilidade contra a policy do subscriber. Bug histórico: se a publication está sem a tabela, ou se SELECT policy ausente, o evento simplesmente não chega (silent failure).

**Audit SQL para canais subscribed em produção:**

```sql
-- Tabelas atualmente na publication supabase_realtime
select schemaname, tablename
from pg_publication_tables
where pubname = 'supabase_realtime'
order by 1, 2;

-- Subscriptions ativas
select entity, filters, claims_role, created_at
from realtime.subscription
order by created_at desc
limit 100;

-- Verifica que toda tabela publicada tem RLS habilitada
select c.relname, c.relrowsecurity, c.relforcerowsecurity
from pg_publication_tables pt
join pg_class c on c.relname = pt.tablename
join pg_namespace n on n.oid = c.relnamespace and n.nspname = pt.schemaname
where pt.pubname = 'supabase_realtime'
  and c.relrowsecurity = false;  -- esperado: 0 linhas
```

### K41. Broadcast channel custom — quem valida tenant?

**Pattern 2026** (supabase.com/docs/guides/realtime/authorization): **gate na policy RLS em `realtime.messages`**, com a flag `private: true` no client. Realtime injeta o JWT do user e aplica policies.

```sql
-- Permite SELECT em topic específico para users do mesmo tenant
create policy "tenant_can_read_topic" on realtime.messages
for select to authenticated
using (
  exists (
    select 1 from public.tenant_topics tt
    where tt.tenant_id = (select public.current_tenant_id())
      and tt.topic = (select realtime.topic())
  )
);

-- INSERT (broadcast send) com mesmo gate
create policy "tenant_can_send_topic" on realtime.messages
for insert to authenticated
with check (
  exists (
    select 1 from public.tenant_topics tt
    where tt.tenant_id = (select public.current_tenant_id())
      and tt.topic = (select realtime.topic())
      and realtime.messages.extension in ('broadcast','presence')
  )
);
```

Client TypeScript:

```typescript
const channel = supabase.channel(`tenant:${tenantId}:notifications`, {
  config: { private: true }, // mandatory para que RLS rode
})
channel.on('broadcast', { event: 'lesson_booked' }, (payload) => console.log(payload)).subscribe()
```

⚠️ Em 2026 o Supabase recomenda fortemente **desabilitar "Allow public access"** em Realtime Settings — sem isso, qualquer cliente com publishable key spamma broadcasts e inflaciona egress (Discussion #22484 sinalizou isso como DoS risk).

### K42. RLS em `realtime.messages` — quando

**Sempre** se você usa Broadcast/Presence com `private: true`. Sem policy, subscribers não conseguem se conectar. Para `postgres_changes`, a RLS é aplicada na tabela source (não em `realtime.messages`).

Overhead: a primeira verificação por canal é uma query SELECT roll-back-ada na tabela; resultado é cacheado pela duração da conexão. Policies complexas (JOINs, function calls) inflam o tempo de subscription — keep it indexed.

---

## Recomendações executáveis (priorizadas)

### Fase 1 — Pré-Feature-1 (essa semana)

1. **Migre para sb_publishable / sb_secret** — legacy `anon`/`service_role` JWT keys são removidas late 2026 (Supabase Security Retro 2025).
2. **Rode `supabase db lint --linked --level=warning`** e zere `0011`, `0025`, `0028`, `0029`.
3. **Aplique `SET search_path = ''` + REVOKE EXECUTE FROM anon, authenticated** em todas as SECURITY DEFINER (achado #1 da auditoria).
4. **Remova policies SELECT amplas em `storage.objects`** para buckets públicos; mantenha `public=true` no bucket, drope a policy SELECT (achado #2).
5. **Refatore RPCs `p_tenant_id`** para validar contra `current_tenant_id()` no body (achado #3); use snippet G27 Pattern A.

### Fase 2 — Antes do go-live

6. Adote **Declarative Schemas** (`supabase/schemas/`) como source of truth; rode `supabase db diff` em cada PR.
7. Configure **pgTAP RLS contracts** (J36) cobrindo isolamento cross-tenant para cada uma das 38 tabelas.
8. Configure **Playwright projects-per-tenant** (J35) com 2 tenants seed (fitness + yoga, para já testar white-label multi-vertical).
9. **Custom Access Token Hook** (A3) injetando `tenant_id`, `tenant_ids[]`, `app_role` no JWT.
10. **`(SELECT current_tenant_id())`** em **todas** as policies (A4) + índice composto `(tenant_id, ...)` em todas as 38 tabelas.

### Fase 3 — Hardening em produção

11. **Vault** para Stripe Connect tokens / VAPID per-tenant + desabilitar statement logging.
12. **Cloudflare WAF + Edge Function wrappers** para RPCs anon-callable (I34).
13. **Cross-tenant snapshot CI** (J38) bloqueia merge se >0 linhas vazam.
14. **Disable "Allow public access" em Realtime Settings** (K41) — força `private: true`.
15. **`FORCE ROW LEVEL SECURITY`** em tabelas com dados regulados (PII médico/financeiro) — defesa em profundidade contra erro humano com role postgres.

### Benchmarks que mudam recomendações

- Se algum tenant ultrapassar **2k transações/min** ou tabela ultrapassar **50M rows**: avalie partitioning por `tenant_id` (hash) + Citus.
- Se compliance HIPAA/PCI surgir para um cliente específico: migrar **esse tenant específico** para DB-per-tenant (enterprise tier separado), mantendo shared-schema para os demais.
- Se latência de RLS em policy complexa passar de **50ms p95**: mover JOIN para SECURITY DEFINER function (G27) e wrappar em `(SELECT ...)`.

---

## Caveats e divergências entre fontes

- **Shared-schema + RLS é universal?** PlanetScale (Simeon Griggs, 21 abr 2026) recomenda shared-schema mas é cética quanto a RLS: _"We generally don't recommend relying on RLS. It shifts security logic into the database, where policy misconfiguration, silent failures, and connection pooling interactions are difficult to debug."_ O Supabase faz o caminho oposto. **Veredito para este projeto:** RLS é o core de segurança, mas trate como defesa em profundidade combinada com filtro explícito `.eq('tenant_id', ...)` na query do client; cubra com pgTAP contracts e snapshot CI.
- **Schema-per-tenant**: PlanetScale chama explicitamente de inferior; Stacksync defende para B2B regulado. **Veredito:** PlanetScale tem razão para SaaS B2B genérico; Stacksync mistura "schema-per-tenant" com "DB-per-tenant" de forma confusa.
- **`SET search_path`**: documentação Postgres recomenda `schema1, pg_temp` em SECURITY DEFINER; Supabase Splinter prefere `''` (string vazia, força full-qualification). **Veredito:** `''` é estritamente mais seguro; use isso, qualifique tudo.
- **Wrapping de função em policy basta para performance?** Não — o guia oficial Supabase RLS Performance afirma que wrapping isolado _"is a big improvement but can still take seconds"_; é o **índice em `tenant_id`** que leva ao tempo de milissegundos. Considere wrapping + índice composto inseparáveis.
- **Soft-delete com `deleted_at IS NULL` em policy SELECT**: causa bug em UPDATE (Issue #2799 Supabase, Bug #1941 supabase-js). Gary Austin sugere "5-second window" temporal — eu **rejeito**; use Pattern A (RPC SECURITY DEFINER) em E19.
- **pgcrypto vs Vault/pgsodium**: Supabase oficialmente desencoraja pgcrypto em 2026; ainda há devs usando para compatibilidade. **Veredito:** novo código deve usar Vault.
- **Splinter lint detail extraction**: as páginas individuais `?lint=NNNN` do Supabase docs renderizam client-side via JavaScript, então `web_fetch` retorna o lint 0001 padrão para qualquer URL. O conteúdo verbatim de cada lint (level WARN/ERROR, regex de detecção) reside em `splinter.sql` no github.com/supabase/splinter. Os lints **0025, 0028, 0029** ainda não têm markdown próprio em `splinter/docs/` (listagem vai até 0024 em maio 2026) — seus detalhes neste relatório derivam da enumeração oficial + páginas adjacentes Supabase docs. A lista exata de "sensitive column names" do lint 0023 precisa ser confirmada lendo `splinter/docs/0023_sensitive_columns_exposed.md` antes de usar como referência legal.
- **"Exemplo Linear" para JSONB hybrid**: a versão anterior deste relatório citava um blog do Linear de 2024 descrevendo a estratégia de `metadata jsonb` na tabela `Issue`. Essa atribuição **não foi confirmável em fonte primária** e foi removida — trate o pattern como convenção de comunidade Postgres, não citação de blog específico.
