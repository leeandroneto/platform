# Migration 0014 — Constraint Cleanup

> Aplicada em 2026-05-19 via `mcp__supabase__apply_migration`.
> Sequencial após `0013_security_hardening_v2`. Cleanup de duplicados estritos + 1 índice faltante + 2 FK ON DELETE actions mais defensivas.
> Origem: auditoria geral de FK/PK/Indexes/Constraints (2026-05-19, mesma sessão de 0013).

---

## Motivação

Auditoria PK/FK/Indexes/Constraints rodada após 0013 revelou:

- **40 tabelas, 40 PKs** — todas presentes, tipos coerentes (uuid, slug, natural composta).
- **75 FKs** — padrão `tenant_id → tenants(id) ON DELETE CASCADE` consistente.
- **48 CHECK** + **16 UNIQUE** — cobertura excelente, sem gaps significativos.

4 achados acionáveis (nenhum crítico):

1. `idx_feature_usage_tenant_feature` é literalmente igual a `feature_usage_tenant_id_feature_key` (UNIQUE) — mesmo conjunto de colunas `(tenant_id, feature)`, mesmo método btree.
2. `brands_host_idx` (partial WHERE deleted_at IS NULL) é subconjunto estrito de `brands_host_key` (UNIQUE em host). O UNIQUE já cobre todas as queries por `host`.
3. `page_versions_page_idx` (só `page_id`) é subconjunto de `page_versions_page_id_version_key` (UNIQUE `page_id, version`) — leading column do UNIQUE já serve as queries por `page_id`.
4. `page_versions.tenant_id` sem index leading — RLS filtra por `tenant_id` em toda query, sem índice é seq scan.
5. `brands.default_palette_id` FK `NO_ACTION` — quebra se palette default for deletada.
6. `programs.brand_id` FK `NO_ACTION` — inconsistente com `tenants.brand_id` (RESTRICT); permitiria deletar brand com programs vivos.

---

## O que rodou (atômico, transacional)

### 1. DROP 3 indexes duplicados estritos

```sql
DROP INDEX IF EXISTS public.idx_feature_usage_tenant_feature;
DROP INDEX IF EXISTS public.brands_host_idx;
DROP INDEX IF EXISTS public.page_versions_page_idx;
```

### 2. CREATE index leading `tenant_id` em `page_versions`

```sql
CREATE INDEX IF NOT EXISTS page_versions_tenant_idx
  ON public.page_versions (tenant_id);
```

Splinter pós-migration: `page_versions_tenant_id_fkey` saiu da lista de unindexed FKs.

### 3. `brands.default_palette_id` → palettes: NO_ACTION → SET NULL

```sql
ALTER TABLE public.brands DROP CONSTRAINT brands_default_palette_id_fkey;
ALTER TABLE public.brands ADD CONSTRAINT brands_default_palette_id_fkey
  FOREIGN KEY (default_palette_id) REFERENCES public.palettes(id) ON DELETE SET NULL;
```

Motivação: se palette default for deletada, brand cai no fallback global via helper `default_palette_id()` em vez de quebrar a FK.

### 4. `programs.brand_id` → brands: NO_ACTION → RESTRICT

```sql
ALTER TABLE public.programs DROP CONSTRAINT programs_brand_id_fkey;
ALTER TABLE public.programs ADD CONSTRAINT programs_brand_id_fkey
  FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE RESTRICT;
```

Motivação: consistência com `tenants.brand_id` (também RESTRICT). Impede deletar brand com programs ainda apontando para ela.

---

## O que NÃO foi tocado (decisões adiadas)

- `tenants.font_id` / `palette_id` / `shape_preset_id` ON DELETE `NO_ACTION`. Recomendação seria `SET DEFAULT` apontando para helpers `default_*_id()`, mas exige verificar `column_default` atual antes. JIT quando aparecer caso real de delete de catálogo visual.
- `enrollments.client_user_id → auth.users` ON DELETE `CASCADE`. Discutível — talvez `SET NULL` preservaria auditoria/histórico de payments. **Decisão de produto, não bug.**
- `*_tenant_active_idx` partial indexes (10 tabelas) — não são estritamente duplicados dos UNIQUEs `(tenant_id, slug)` porque o partial WHERE deleted_at IS NULL fica menor quando há soft-deletes. Pré-launch zero soft-deletes, parecem code-smell mas têm valor futuro. Manter.
- 30+ FKs unindexed (lint 0001 INFO) — quase todas para catálogos low-cardinality (`currencies` × 8, `verticals` × 4, `brands` × 6). Não vale indexar — ninguém faz "list onde currency='USD'".

---

## Antes / Depois (Splinter)

| Lint                          | Antes    | Depois   | Comentário                                                                                                         |
| ----------------------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| 0001 `unindexed_foreign_keys` | 37 INFO  | 36 INFO  | `page_versions_tenant_id_fkey` saiu da lista após criação do `page_versions_tenant_idx`                            |
| 0005 `unused_index`           | 36 INFO  | 36 INFO  | `page_versions_tenant_idx` recém-criado entra como unused (esperado pré-launch); outros 3 que eram duplicados saem |
| 0008–0029 (security)          | mantidos | mantidos | 0013 já fechou; nenhum re-aberto                                                                                   |

---

## Aplicação

```
mcp__supabase__apply_migration(name="0014_constraint_cleanup", query=<SQL acima>)
```

Sem regen de `lib/contracts/database.ts` — não muda schema de colunas, apenas índices e ações de FK.
