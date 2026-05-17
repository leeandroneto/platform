# 01 — Arquitetura

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Referência canônica para camadas, contratos e direção de dependência.
> Conflito com qualquer outra fonte → este doc + `00-PROJETO.md` ganham.

---

## 1. Camadas (separação dura, dependência desce)

```
app/ (rotas)                  ← UI orquestra, ZERO regra de negócio
components/ (UI puro)         ← visual + composição, nunca toca Supabase
lib/hooks/                    ← estado React (useTransition, useOptimistic)
lib/data/ (IO Supabase)       ← (client, args) => Result | throw
lib/contracts/ (SSOT)         ← Zod + Result + AppError + adapters
lib/domain/ (pura)            ← cálculo determinístico, zero IO, zero React
lib/api/                      ← helpers Server Action (requireAuth, mapError)
lib/supabase/                 ← {client, server, admin} + types.gen
supabase/functions/ (Deno)    ← Edge Functions com _shared/ + _engine/ + _ai/
supabase/migrations/          ← schema canônico (via apply_migration)
```

**Regra absoluta:** UI → Server Action → `lib/data/` → RPC. **Nunca subir.**

Decisão fechada em: _CONFLITOS.md #8 (hierarquia de busca) · master plan §3.1.

---

## 2. `lib/contracts/` é fonte da verdade (SSOT)

Decisão D-G54 (renomeação `lib/domain/schemas/` → `lib/contracts/`):

| Sub-pasta | Conteúdo |
|---|---|
| `result.ts` | `Result<T, E>` discriminated union |
| `errors.ts` | `AppError = z.discriminatedUnion('kind', [...])` |
| `action.ts` | `type ServerAction<I, O> = (i: I) => Promise<Result<O, AppError>>` |
| `<feature>/<feature>.schema.ts` | Zod schemas + types via `z.infer` |
| `<feature>/<feature>.contracts.ts` | Input/output de Server Actions |
| `<feature>/<feature>.adapter.ts` | `fromRow(row): Domain` / `toRow(d): Row` |
| `components/<kind>/<kind>.draft.schema.ts` | Magro pro LLM (sem `.min/.max/.url/.regex`) |
| `components/<kind>/<kind>.strict.schema.ts` | Rico pro banco/UI (com constraints) |

**Razão:** tipos gerados do banco (`lib/supabase/types.gen.ts`) descrevem
**persistência**; `lib/contracts/` descreve **domínio**. Adapter explícito
isola — componente nunca consome `Database['desafit']['Tables']['x']['Row']`
direto. Acoplamento persistence↔UI causou refator de 150h no onboarding-bio.

---

## 3. `Result<T, AppError>` discriminated union (D-G55)

Toda Server Action retorna `Promise<Result<T, AppError>>`. Nunca lança.

```
Result = { ok: true; data: T } | { ok: false; error: AppError }
AppError.kind = 'validation' | 'not_found' | 'forbidden' | 'conflict'
              | 'budget_exceeded' | 'unknown'
```

**UI consome com switch exhaustive** (ESLint `switch-exhaustiveness-check`
força — sem `default` branch, TS reclama se kind novo for adicionado).

Adicionar novo `kind` = ADR + atualizar discriminated union em
`lib/contracts/errors.ts`. Mudança coordenada.

---

## 4. Sheriff boundaries (D-G57)

`sheriff.config.ts` com tags `type:feature | type:shared | type:data` +
`side:server`. Regras:

- `type:feature` pode importar `feature | shared | data`
- `type:data` só importa `shared`
- `type:shared` só importa `shared`
- `side:server` (Server Actions, admin client) **não importável** de Client Component
- `enableBarrelLess: true` — proíbe re-export via `index.ts` que esconde acoplamento

**Defesa real:** `lib/data/programs.ts` tentar importar `app/...` = erro lint.

Decisão fechada em: master plan §1.6 · pesquisa 04 §2.3.

---

## 5. Server Actions — convenção

- Arquivo: `app/<route>/_actions/<action-name>.action.ts`
- Naming enforced via `unicorn/filename-case` kebab + glob específico
- Primeira linha: `'use server'`
- Retorno explícito: `Promise<Result<T, AppError>>` (ESLint
  `explicit-function-return-type` em `**/_actions/*`)
- Max 100 linhas (override `max-lines` em glob `*.action.ts`)
- 1 action por arquivo · `_actions/index.ts` re-exporta named
- Sem `try/catch` engolindo erro — sempre via `mapToAppError(e)`
- Chamadas SEMPRE via `lib/data/` (nunca Supabase direto)

Detalhes em: master plan §6.3 · pesquisa 04 §3.2 · `.claude/rules/server-actions.md`.

---

## 6. Data layer — `lib/data/`

- Assinatura padrão: `function(client: SupabaseClient, ...args): Promise<T>`
- Mutações multi-tabela ou cross-RLS: chama RPC `SECURITY DEFINER`
- Mutações simples: 1 chamada Supabase parametrizada com Zod
- Lança erro (não retorna Result) — Server Action wrap em `mapToAppError`
- Adapter `fromRow()` na borda (banco → domínio)

**Razão `function(client, ...)` em vez de classe:** se um dia migrar app
aluno pra Flutter/nativo, `supabase.rpc('x', {...})` funciona idêntico.
Server Action é só adapter Next.

---

## 7. RPC vs Server Action vs Trigger

| Caso | Use |
|---|---|
| Validação + lógica + 1 query DB | Server Action (TS + Zod) |
| Multi-row atômico, cross-table com RLS recursivo, hot-path | RPC `SECURITY DEFINER` |
| Invariantes (`updated_at`, counters denormalizados) | Trigger |

RPC template: `REVOKE ALL FROM public, anon` + `GRANT EXECUTE TO authenticated`
+ `SET search_path = ''` + `RAISE EXCEPTION 'x' USING ERRCODE = '42501'`.

Detalhes em: master plan §16.7.

---

## 8. Edge Functions Deno (`supabase/functions/`)

Estrutura mirror em `_shared/` (helpers) + `_engine/` (lógica determinística IA)
+ `_ai/` (prompts + wrappers Vercel AI Gateway).

Funções dia 1:
- `switch-tenant` (JWT re-issue Notion-style)
- `send-email` (Resend wrapper)
- `send-push` (Web Push + Vapid per-tenant)
- `send-whatsapp` (Meta Cloud API — fase 2 OBA)
- `generate-assessment` (IA relatório capture form)
- `generate-program` (pipeline vibe coding — adiado §39)

Validação Zod no payload. Logs estruturados via pino. Sentry @edge.

---

## 9. Multi-tenant — RLS + JWT claims

- Toda tabela tenant-scoped: `tenant_id uuid NOT NULL REFERENCES public.tenants(id)` + btree index
- RLS pattern: `(select public.current_tenant_id())` (wrap obrigatório — 100× speedup vs `auth.jwt()->>'tenant_id'` direto)
- `TO authenticated` explícito em toda policy
- JWT carrega `tenant_id` + `active_membership_role` via `custom_access_token_hook`
- Admin global bypass via `role = 'admin'` em `public.profiles`

Detalhes completos em `.claude/rules/jwt-claims-rls.md` + master plan §4 + §16.5.

---

## 10. White-label runtime

CSS via API route `/api/tenants/[id]/theme.css?v=N` (D-G59):

- Layout root referencia `<link rel="stylesheet">` em `<head>` (render-blocking, zero FOUC)
- Route handler emite CSS texto puro com whitelist + regex OKLCH
- Cache: `public, max-age=31536000, immutable` + cache-bust por `?v=theme_version`
- **Zero `dangerouslySetInnerHTML`** — preserva política zero-disable
- Mutação theme → `revalidateTag(\`tenant-theme:${id}\`)` + bump `theme_version`

Detalhes em pesquisa 05 §5 + master plan §7.7.

---

## 11. Anti-patterns proibidos

| Anti-pattern | Razão |
|---|---|
| Component chama `createClient()` Supabase direto | Vaza camada — sempre via hook → action → `lib/data/` |
| RLS com `auth.jwt()->>'tenant_id'` direto | 100× mais lento; sempre `(select fn())` wrap |
| Service layer wrapper sobre Server Action | Indireção sem fronteira (Server Action JÁ é serviço) |
| Tipos gerados (`types.gen.ts`) consumidos em componente | Acoplamento persistence↔UI; sempre via adapter `fromRow()` |
| Re-export via barrel `index.ts` | Esconde acoplamento; Sheriff `enableBarrelLess` bloqueia |
| Schema-per-tenant Supabase | Não escala >100 tenants; single-DB + RLS é padrão |
| Service role key em client component | Bypass RLS = vulnerabilidade crítica |

---

## 12. Tamanhos máximos (lint enforce — D-G56)

| Item | Limite | Regra ESLint |
|---|---|---|
| Linhas por arquivo | **error 300** | `max-lines` |
| Linhas por função | **error 60** | `max-lines-per-function` |
| Cyclomatic complexity | **error 12** | `complexity` |
| Nesting depth | **error 4** | `max-depth` |
| Parâmetros | **error 4** | `max-params` |
| `'use client'` file | **error 200** | override em glob |
| Server Action `*.action.ts` | **error 100** | override em glob |

**Estourou:** quebrar arquivo/função. Nunca `eslint-disable` (CI bloqueia
via `--no-inline-config` + hook PreToolUse + grep CI).

---

## Referências

- `00-PROJETO.md` §8 (hierarquia de busca de soluções)
- `_CONFLITOS.md` #8 (shadcn 100% + hierarquia universal)
- Master plan §1.6 (Sheriff) · §3.1 (camadas) · §6 (contratos) · §16 (banco/RLS)
- Pesquisa 04 §3 (contratos), §5 (anti-refactor)
- Pesquisa 05 §5 (white-label runtime CSS via API route)

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — layers + Sheriff + Result + Edge Deno mirror | Leandro |
