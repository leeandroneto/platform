# 0033. Consolidação `platform.*` → `public.*` (1 schema)

Date: 2026-05-18
Status: accepted
Supersedes: 0025 (parcial — mantém o naming "platform" só como nome do projeto/repo, não como schema Postgres)

## Context

ADR-0021 → 0025 estabeleceu schema separado `platform.*` pra produto multi-marca,
deixando `public.*` só pra catálogos compartilhados (verticals, currencies,
templates oficiais, ai_prompts). Dia 0 do greenfield expôs fricção operacional
real:

1. **MCP Supabase é limitado em non-public.** `generate_typescript_types` e
   `list_tables` defaultam pra `public`. Tivemos que cair pro CLI
   `pnpm dlx supabase gen types --schema public --schema platform` na fase 3.
2. **PostgREST exige expose manual** do schema no dashboard — etapa extra fácil
   de esquecer.
3. **Toda query** precisa `.schema('platform')` — fricção em onboarding e
   silent failure quando esquece (`from('programs')` cai em `public.programs`
   inexistente sem erro óbvio).
4. **Tooling assume `public`** — tutoriais, exemplos da comunidade, AI Supabase,
   Templates Vercel.

Conversa com Supabase AI (2026-05-18) confirmou: nosso cenário (multi-tenant
via `tenant_id` + RLS canônica, verticais como catálogo, componentes
polimórficos) **se beneficia mais de 1 schema só** que da separação atual.
Schema não é segurança — RLS é. Separação trazia ganho conceitual sem ganho
operacional.

Auditoria pré-migração (banco vivo) encontrou:
- 25 tabelas em `platform.*` (todas tenant-scoped via `tenant_id`)
- 12 tabelas em `public.*` (catálogos compartilhados, zero `tenant_id`)
- 0 colisões de nome entre os schemas
- 8 functions com `platform.*` hardcoded no body (precisam rewrite)
- 3 RLS policies (`fonts_read`, `palettes_read`, `shape_presets_read`) com
  `FROM platform.tenants` no body
- 3 column defaults chamando `platform.default_*_id()`
- ~80 policies + 30 triggers + FKs auto-migram com `ALTER TABLE SET SCHEMA`

## Decision

Consolidar `platform.*` → `public.*` em **1 migration atômica transacional**
antes de M0 entrar em produção.

Mapeamento:
- 25 tabelas `platform.x` → `public.x` (via `ALTER TABLE SET SCHEMA`)
- 3 functions `platform.default_*_id()` → `public.default_*_id()` (CREATE OR
  REPLACE com body atualizado pra `FROM public.{fonts,palettes,shape_presets}`)
- 5 functions já em `public.*` (`check_host_unique_*`, `custom_access_token_hook`,
  `handle_new_user`, `on_tenant_soft_delete`): CREATE OR REPLACE com body
  atualizado pra `FROM public.x` em vez de `FROM platform.x`
- 3 policies (`fonts_read`, `palettes_read`, `shape_presets_read`): DROP + CREATE
  com `FROM public.tenants`
- 3 column defaults em `public.tenants.{font_id, palette_id, shape_preset_id}`:
  ALTER COLUMN SET DEFAULT → `public.default_*_id()`
- `DROP SCHEMA platform` (vazio após migration)

Schema final:
```
public.*  — TUDO (catálogos + tenant-scoped data + functions + hooks)
auth.*    — Supabase managed (não tocado)
storage.* — Supabase managed (não tocado)
```

**O nome "platform" não morre.** Continua sendo o nome do repo, do Vercel
project, do Supabase project, da empresa (holding) e da pasta no disco. Só
deixa de ser nome de schema Postgres.

## Consequences

**Positivo:**

- MCP funciona 100% (generate_types, list_tables, sem fallback CLI)
- PostgREST auto-expõe (default)
- `client.from('programs')` just works — sem `.schema('platform')` em todo lugar
- Onboarding instantâneo: padrão Supabase canônico
- Toda doc/tutorial/exemplo da comunidade aplica direto
- ESLint rule `no-restricted-syntax` perde 1 vetor de erro (schema esquecido)
- Backup/restore simplificado (1 schema, não 2)

**Negativo:**

- Perde separação conceitual "produto vs sistema"
- Tabelas `programs`/`tenants`/`memberships` ficam no mesmo namespace que catálogos
  `currencies`/`verticals` — mitigação: convenções de nome bem aplicadas + RLS
  cobre segurança real
- Bulk GRANT/REVOKE por schema não existe mais — mitigação: já fazemos por
  role+RLS, não por schema
- 1 migration de 100+ linhas (mecânica, transacional, com smoke test)
- ADR-0025 vira histórico parcial (naming sobrevive, schema não)
- `.claude/rules/schema-separation.md` removido

**Neutro:**

- Aplicação cobre 25 ALTER TABLE + 8 CREATE OR REPLACE + 3 DROP/CREATE POLICY +
  3 ALTER COLUMN DEFAULT + 1 DROP SCHEMA — transacional via
  `mcp__supabase__apply_migration` (rollback automático se algo falhar)
- Sem usuário em produção, sem dado real → risco operacional baixo
- Janela ótima é AGORA — cada dia de código adicionado encarece a refator

## Migration spec

Documento separado: `docs/migrations/0005_consolidate_to_public.md`.

Smoke test pós-migration:
1. Signup novo email → `handle_new_user` cria profile+tenant+membership ✅
2. JWT inclui `tenant_id` via `custom_access_token_hook` ✅
3. `SET ROLE anon; SELECT * FROM public.programs` → bloqueado por RLS ✅
4. `SELECT * FROM public.palettes WHERE is_official=true` → 13 paletas ✅
5. `list_tables(public)` → 37 tabelas (12 catálogos + 25 ex-platform) ✅
6. `pg_namespace WHERE nspname='platform'` → 0 rows ✅
