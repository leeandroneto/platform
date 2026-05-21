# Migration 0021 — Reserve `tenant_theme_presets`

> Aplicada em 2026-05-20 via `mcp__supabase__apply_migration`.
> Schema reserve — feature ativa em Fase 2+ (editor visual / vibe coding).
> NÃO usada por código atualmente.

---

## Motivação

Pergunta levantada na consolidação do design system: tenant que customiza paleta + archetype (futuramente via vibe coding ou editor visual) deve poder "guardar" combos pra reusar — como "Tema Black Friday" + "Tema Padrão" alternáveis.

Pattern atual de `palettes` (clone via `source_palette_id`, ADR-0028) cobre clone simples mas sobrescreve in-place. Não tem o conceito de "preset nomeado alternável".

Adicionar a tabela agora (vazia, RLS configurada) evita migration retrofit quando feature ativar.

## Decisão arquitetural

| Item                                                 | Resposta                                          |
| ---------------------------------------------------- | ------------------------------------------------- |
| Versionar archetype/palette com snapshots imutáveis? | ❌ Tema é estado atual, não artifact histórico    |
| Versionar via tabela `*_versions` Hotmart-like?      | ❌ Audit log resolve rollback                     |
| Criar tabela de presets nomeados alternáveis?        | ✅ Esta migration — schema reserve agora          |
| Implementar UI/server actions agora?                 | ❌ Vira código em Fase 2+ junto com editor visual |

## O que essa migration faz

### A. Tabela `tenant_theme_presets`

```sql
CREATE TABLE public.tenant_theme_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,

  name text NOT NULL,                          -- "Black Friday", "Outono", "Padrão"
  description text NULL,

  -- Combo (mesmos 4 eixos do generateThemeCSS combo key)
  archetype_id text NOT NULL,                  -- pointer pra lib/design/archetypes/<id>/
  palette_id uuid NOT NULL REFERENCES public.palettes(id),
  typography_id uuid NOT NULL REFERENCES public.fonts(id),
  theme_mode text NOT NULL DEFAULT 'auto'
    CHECK (theme_mode IN ('light','dark','auto')),

  -- Overrides Fase 2 (D-17 — radius/shadow/spacing JSONB)
  role_overrides jsonb NOT NULL DEFAULT '{}'::jsonb,

  is_active boolean NOT NULL DEFAULT false,
  created_by_user_id uuid NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz NULL
);
```

### B. Indexes

- `tenant_theme_presets_one_active_per_tenant` — partial unique: garante 1 preset ativo por tenant
- `tenant_theme_presets_name_unique_per_tenant` — partial unique (case-insensitive): nome único por tenant
- `tenant_theme_presets_tenant_id_idx` — lookup rápido

### C. RLS (pattern `programs`)

4 policies:

- `tenant_theme_presets_read` — SELECT autenticado, `tenant_id = current_tenant_id()` + `deleted_at IS NULL`
- `tenant_theme_presets_insert` — INSERT autenticado, with check `tenant_id = current_tenant_id()`
- `tenant_theme_presets_update` — UPDATE autenticado, mesmo predicado
- `tenant_theme_presets_delete` — DELETE autenticado

### D. Trigger

- `tenant_theme_presets_set_updated_at` — BEFORE UPDATE → `set_updated_at()`

## Estado pré → pós

| Antes                                                             | Depois                                                         |
| ----------------------------------------------------------------- | -------------------------------------------------------------- |
| Tenant que customiza tema sobrescreve in-place (`palettes` clone) | Tabela disponível pra criar presets nomeados (não usada ainda) |
| Sem conceito de "voltar pro tema anterior" via UI                 | Schema permite implementação JIT                               |
| Rollback só via audit log + SQL manual                            | Path arquitetural pra Fase 2+                                  |

## Quando essa tabela vai ser usada

**Não é Fase 1.** Implementação concreta entra quando:

1. **Editor visual avançado (Fase 2-3):** UI pra criar preset + alternar entre eles
2. **Vibe coding (Fase 2-3):** IA gera tema → user salva como preset
3. **A/B testing visual (Fase 5+):** comparar 2 presets em produção
4. **Campanhas sazonais (Fase 2+):** "Black Friday", "Aniversário do app"

Até lá, tabela fica vazia. Custo de runtime = zero.

## Server action futura (referência)

```ts
// app/(admin)/tenants/[id]/theme/actions.ts (Fase 2+)
export async function activatePreset(tenantId: string, presetId: string) {
  // 1. validateCombo(preset.archetype_id, preset.palette_id, preset.theme_mode)
  // 2. UPDATE tenant_theme_presets SET is_active=false WHERE tenant_id=X AND is_active=true
  // 3. UPDATE tenant_theme_presets SET is_active=true WHERE id=presetId
  // 4. UPDATE tenants SET archetype_id=..., palette_id=..., typography_id=..., theme_mode=... WHERE id=tenantId
  // 5. revalidateTag(oldCombo) + revalidateTag(newCombo)
  // 6. log audit_log
}
```

## Validações executadas pós-migration

- ✅ Table existe (`information_schema.tables`)
- ✅ 4 policies RLS ativas (`pg_policies`)
- ✅ 4 indexes (PRIMARY KEY + 2 partial unique + 1 lookup)
- ✅ RLS enabled (`pg_class.relrowsecurity`)
- ✅ `mcp__supabase__get_advisors security`: 0 warnings novos (5 pré-existentes)
- ✅ Types regenerados — `tenant_theme_presets` aparece com Row/Insert/Update
- ✅ `pnpm typecheck` 0 erros

## Próximos passos

Voltar pro Passo 1.4 do plano `docs/plans/design-system.md` (22 esqueletos archetypes). Esta migration é **side-step** — não bloqueia nenhum outro passo da Foundation.

## Referências

- ARCHITECTURE.md §12.4 (pendências JIT)
- ADR-0028/0029 (paletas template→instance — pattern relacionado)
- Pattern `programs` (tenant-scoped RLS)
- Pattern `tenant_webhooks` (RLS — schema reserve similar)
- Hotmart-like snapshots: NÃO aplicado aqui (presets ≠ versions)
