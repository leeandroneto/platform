# Status — `platform`

> Gerado por `pnpm docs:status` em **2026-05-18** + seção **Phase A** anotada manualmente.
> NOTA: Próxima execução de `pnpm docs:status` SOBRESCREVE a seção Phase A.
> Migrar essa info pra script generator quando consolidar.

---

## Phase A — **CLOSED** ✅

| Item           | Status                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Commits        | 5 (bootstrap → consolidate → vertical slice → revert C cirúrgico → knip fix)                                   |
| Hash final     | a ser commitado — chore: knip config + adr-0034 §4 entitlements distinction                                    |
| Batch 1        | **10/10 verde** (typecheck + lint + 4 audits + docs:validate + knip + test + build + size + validate:palettes) |
| ADRs           | 35 (0001-0035) — 0 inconsistências (`pnpm docs:validate`)                                                      |
| Schema DB      | 38 tabelas em `public.*` (37 base + `plans`) — schema único pós ADR-0033                                       |
| Lint overrides | 10 (ADR-0031 §1-§10) — §11 reverted no fix                                                                     |

### Histórico Phase A

| Commit    | O quê                                                                             | Quando     |
| --------- | --------------------------------------------------------------------------------- | ---------- |
| `95a092d` | bootstrap dia 0 + Phase A inicial — fundação                                      | 2026-05-17 |
| `f66e91f` | consolidação `platform.*` → `public.*` (ADR-0033)                                 | 2026-05-18 |
| `a94a8bf` | vertical slice + Sheriff + ESLint (ADR-0034)                                      | 2026-05-18 |
| `7818df1` | entitlements + plans + UX components (ADR-0034/0035) — **parcialmente revertido** | 2026-05-18 |
| `4be49e3` | revert cirúrgico Commit C (componentes UX) + Zod boundary + Provider wired        | 2026-05-18 |
| (este)    | knip config (features/\*\* + entitlements entries + lint-staged) + ADR-0034 §4    | 2026-05-18 |

---

## Próxima sessão — backlog leve

1. **§9 seeds** — confirmar se as 13 paletas estão em arquivo único (`palettes.seed.ts`) ou separadas por paleta. Se separadas em arquivos pequenos, `max-lines off` em `lib/design/seeds/**` é over-permissivo → remover override §9 de ADR-0031.

2. **§10 RouteProvider** — confirmar se `throw new Error('useBrand() fora de <RouteProvider>')` pode usar factory `AppError.providerMissing('RouteProvider')` em `lib/contracts/errors.ts` (precisa criar a factory). Se sim, override §10 vira desnecessário.

3. **ADR-0036 — Component creation discipline + hooks** — pendente. Aguardando pesquisa que está rodando em paralelo (Claude Desktop). Vai definir sistêmica de prevenção pra evitar repetir o incidente `7818df1`:
   - Hierarquia obrigatória de busca antes de criar (shadcn blocks → comunidade → custom)
   - Hooks PreToolUse Write pra `lib/**/components/**` perguntar "pesquisou?"
   - Lint rule pra detectar UI components sem props pra copy

4. **Tarefa 14 — Motion presets** — aguarda fechamento da pesquisa + ADR-0036.

---

## Git

| Campo                               | Valor                                      |
| ----------------------------------- | ------------------------------------------ |
| Branch                              | `master`                                   |
| Commits                             | 6 (auto-snapshot pode estar desatualizado) |
| Última mudança em `CLAUDE.md`       | 2026-05-18                                 |
| Última mudança em `docs/adr/`       | 2026-05-18                                 |
| Última mudança em `docs/blueprint/` | 2026-05-18                                 |

## Package

- **Versão:** `0.1.0`

## ADRs

- **Total:** 35
- **accepted:** 30 (com nota Status pra 0033 em 4 deles)
- **superseded:** 4 (0021 → 0025; 0025 → 0033; 0027 → 0028; 0028 → 0029)
- **Último:** ADR-0035 — UX de feature gating: visible + badge PRO + paywall (2026-05-18)

## Blueprints

- **Total:** 19 arquivos em `docs/blueprint/`

## Migrations

- **Total documentado:** 2 (0001_initial.md + 0005_consolidate_to_public.md)
- **Aplicadas no Supabase:** 0001-0008 (8 migrations)
  - 0001 baseline (platform.\*)
  - 0002 grants
  - 0003 security hardening
  - 0004 restore rls grants
  - 0005 consolidate platform → public
  - 0006 drop platform schema (cleanup PostgREST cache)
  - 0007 add plans table (+ seed 3 planos)
  - 0008 drop platform schema again (cleanup recorrente PGRST)
- ℹ️ Para estado real aplicado, rode `mcp__supabase__list_migrations` via Claude Code.

## Pendências (TODO / FIXME / PENDING em `docs/`)

_Nenhum TODO/FIXME/PENDING encontrado em `docs/`._

---

_Próxima geração: rodar `pnpm docs:status` após qualquer mudança significativa em ADRs/blueprints/migrations. Seção Phase A será sobrescrita — migrar pra script generator quando consolidar._
