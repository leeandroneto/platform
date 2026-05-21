# Auditoria Revert — cutoff + preservar + remover

> **Tipo:** análise pré-execução (não-decidida — output para user revisar antes de executar).
> **Filosofia:** decisões > arquivos. Pode perder código bom misturado, contanto que decisões + research + ADRs + planos estejam salvos em diretório vizinho.
> **Estratégia macro:** Option A — git hard reset agressivo até PRÉ-design-system + preservar decisões em `C:\Users\leean\Desktop\platform-preserved-2026-05-21\` filesystem (fora do git/workspace) + cherry-pick verbal (anotações JIT) do "trabalho bom" a refazer.
> **Última atualização:** 2026-05-21.

---

## 1. Resumo executivo

O design system work começou em **2026-05-19 20:56** (commit `6529936` — primeiro commit com prefixo `design-system:`, ainda só docs WIP em `docs/design-system/`). O primeiro commit que **escreveu código** de archetypes foi `b3d9e32` (2026-05-20 21:22 — migration 0020 + types).

Da inspeção `git diff --stat 12d582a..fe10231`:

- **843 arquivos** mudaram (entre cutoff candidato A e HEAD)
- **+80.366 / -84.400 LOC** (net negativo porque docs antigos foram arquivados, mas filesystem ganhou ~31 milhões de tokens em archetypes + research + DESIGN.md refs)
- **~73 brand folders** em `docs/references/design-systems/`
- **22 voice JSONs** em `messages/pt-BR/voice/`
- **41 wrappers + 40 stories + 9 lazy archetypes** em `components/ds/`
- **20 wrappers** consomem `var(--role-*)` invented (confirmado via grep)

**Cutoff recomendado: `12d582a` (Mon May 18 20:33:41 2026 — "dia 0 fechado — adr-0040 + storybook + makerkit rpcs + pwa per-tenant").**

Justificativa: é o último commit ANTES de qualquer trabalho de design system, mas COM:

- Multi-tenant runtime completo (`getRouteByHost`, `RouteProvider`, `proxy.ts`, hostname resolver, ADR-0024+0026)
- 4 wrappers app-\* (form, toast, entitlement-gate) + 3 typography (heading/text/muted) + logo wordmark
- Storybook 10 + Geist + ADR-0040 fechamento dia 0 + APCA Silver validator + MotionProvider + PWA per-tenant
- 53 shadcn primitives + 4 typography custom em `components/ui/`
- `lib/design/`: 4 arquivos clean (contrast, motion, palettes, tokens) + seeds (fonts, palettes, shapes) — ZERO archetypes, ZERO `--role-*`, ZERO contract invented
- 15 rules path-loaded (vs 17 atual — diferença é só `docs-writing.md` + `forms-engine.md` — re-add JIT)
- Schema `public.*` consolidado (ADR-0033), entitlements wired, Stripe-ready

**O que se ganha** (que pós-cutoff perdeu sentido):

- Zero archetypes invented
- Zero `--role-*` tokens
- Zero 22 voice JSONs (archetype-bound)
- Zero `docs/references/design-systems/` (73 brand folders × ~5-10 MD each)
- Zero `docs/design-system/` (15+ docs WIP)
- Zero 5 ESLint rules ds-governance custom
- Zero `lib/design/archetypes/` (já-gone no HEAD, mas tree história sai junto)
- Zero `lib/design/contract/{strategy,roles,voice,typography,illustrations,visual}.ts`
- Zero 9 lazy archetype components
- Zero 32 wrappers DS archetype-bound

**O que se perde temporariamente (anotação JIT pra refazer em 2-4h após reset):**

- Migration 0020/0021/0022/0023 (DB já tem — independente do git)
- PPR Suspense fix `app/layout.tsx` ThemeStyle pattern (`fe10231`+`e35677f`)
- `getRouteByHost` JOIN palette+font slugs (`4ce11a4`)
- AdaptiveShell pattern (`7b94af8`)
- useBrand white-label vendor blocks (`ede0d49`)
- shadcn blocks instalados em `components/`: app-sidebar, data-table, chart-area-interactive, login-form, signup-form (vendor)
- Kibo UI 5 primitives instalados em `components/kibo-ui/`
- Pesquisas válidas pós-cutoff: 23 forms, 24 pages, 25 reports, 21 i18n, 22 supabase audit, 28 tweakcn-eval, 29/30/31 token-partition/color-format/zod

**Counts (executive):**

- **Preservar:** ~140 arquivos (29 ADRs em `docs/adr/`, 3 plans, 14 research, 8 sessions, 9 migrations docs, 17 rules atuais, CLAUDE.md, CHANGELOG.md, \_status.md, blueprints 19-21) + anotação JIT
- **Sair com o reset:** ~700+ arquivos (calculado net via 843 diff — incluindo 73 brand folders × N files cada)

---

## 2. Git log completo categorizado

KEEP = sobrevive ao reset (pré-cutoff). PARTIAL = mistura útil/útil — perdemos no reset, anotação JIT. REVERT = 100% design system invented. DOCS = só doc updates.

### 2.1 Commits PRÉ-design-system (KEEP — sobrevivem ao reset em `12d582a`)

| Hash      | Data                 | Msg                                                                       | Categoria       |
| --------- | -------------------- | ------------------------------------------------------------------------- | --------------- |
| `900c6c1` | 2026-05-17 18:16     | Initial commit                                                            | KEEP            |
| `95a092d` | 2026-05-18 05:54     | bootstrap dia 0 + phase a — fundação completa                             | KEEP            |
| `f66e91f` | 2026-05-18 06:52     | consolidate platform schema into public (adr-0033)                        | KEEP            |
| `a94a8bf` | 2026-05-18 07:02     | vertical slice + sheriff + lint enforcement (adr-0034)                    | KEEP            |
| `7818df1` | 2026-05-18 07:16     | entitlements runtime + plans table + ux components (adr-0034/0035)        | KEEP            |
| `4be49e3` | 2026-05-18 07:59     | defer entitlements ux components (incidente 7818df1)                      | KEEP            |
| `27be5ee` | 2026-05-18 08:30     | knip config + adr-0034 §4 entitlements layer distinction                  | KEEP            |
| `b789bc9` | 2026-05-18 08:53     | phase a final f1 — hooks json output + eslint comments (adr-0036)         | KEEP            |
| `2692c99` | 2026-05-18 09:09     | rename block-disables.sh -> block-token-bypass.sh (clareza f1)            | KEEP            |
| `49dcc37` | 2026-05-18 09:16     | phase a final f2 — shadcn mcp + wrapper pattern (adr-0037)                | KEEP            |
| `3d38fc6` | 2026-05-18 09:38     | motion 12 presets (tarefa 14 checklist 15)                                | KEEP            |
| `a6e54da` | 2026-05-18 10:05     | adr-0037 hierarquia ordenada por pesquisa (reui sobe, aceternity sai)     | KEEP            |
| `12d582a` | **2026-05-18 20:33** | **dia 0 fechado — adr-0040 + storybook + makerkit rpcs + pwa per-tenant** | **CUTOFF AQUI** |

**TODO o resto será apagado pelo `git reset --hard 12d582a`.**

### 2.2 Commits "úteis misturados" (PARTIAL — perdidos no reset, anotar JIT)

Esses commits têm trabalho legítimo + decisões importantes misturados com design system invented. Cherry-pick é complicado (Option B do `reversion-analysis.md` mostrou conflitos esperados). Estratégia: preservar como anotação textual, re-implementar JIT em 2-4h após reset.

| Hash      | Data             | Msg                                                                     | Útil a refazer JIT                                                            |
| --------- | ---------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `f3202be` | 2026-05-18 21:56 | db security hardening (migrations 0011 + 0012) + regen types            | Migrations já aplicadas no DB — só re-aplicar types regenerados se necessário |
| `c90ce52` | 2026-05-19 07:41 | migration 0013 security hardening v2 + plano dia 1                      | Migration aplicada — Plano dia 1 = funil agência (preservar)                  |
| `7f8290d` | 2026-05-19 09:02 | migration 0014 constraint cleanup                                       | DB only                                                                       |
| `17d1da8` | 2026-05-19 09:09 | plano dia 1 consolidado pos-pesquisa 23 + 5 decisoes fechadas           | Preservar plano + research 23                                                 |
| `f2d513b` | 2026-05-19 09:46 | migrations 0015-0017 — forms align + reservas estruturais + cross-table | DB applied — re-aplicar contracts/database.ts JIT                             |
| `df0cded` | 2026-05-19 10:55 | remove crons from vercel.ts (hobby plan limit)                          | Re-aplicar quando re-instalar vercel.ts                                       |
| `337766b` | 2026-05-19 13:06 | design system rethink pause + pesquisas 24+25 + session reflection      | Preservar research 24+25, plano dia 1 update                                  |
| `888953f` | 2026-05-19 13:18 | rule docs-writing + claude.md atualizada com discovery completo         | Preservar `.claude/rules/docs-writing.md` — re-add JIT                        |

### 2.3 Commits 100% design system invented (REVERT — saem todos com reset)

#### 2.3.1 — Loops de pesquisa (chore-only docs, mas em vão pós-pivot)

| Hash      | Data             | Msg                                                                                        |
| --------- | ---------------- | ------------------------------------------------------------------------------------------ |
| `6529936` | 2026-05-19 20:56 | **adr-0041 + blueprint 21 + folder + pesquisas 26 e 27** ← primeiro commit "design-system" |
| `7cb9e5a` | 2026-05-19 20:57 | loop 1 — iconography canon                                                                 |
| `6509085` | 2026-05-19 20:58 | loop 2 — typography canon                                                                  |
| `4d26469` | 2026-05-19 20:59 | loop 3 — content strategy canon                                                            |
| `64e236e` | 2026-05-19 21:01 | loop 4 — ibm carbon spacing dual-scale                                                     |
| `0360b36` | 2026-05-19 21:02 | loop 5 — atlassian foundations                                                             |
| `3990dc9` | 2026-05-19 21:04 | loop 6 — material 3 + ios hig mobile                                                       |
| `9607516` | 2026-05-19 21:05 | loop 7 — shopify polaris motion canon                                                      |
| `413752b` | 2026-05-19 21:06 | loop 8 — ant design layout spec                                                            |
| `f600985` | 2026-05-19 21:08 | loop 9 final — wake-up summary                                                             |

**Observação:** essa cadeia é 10 commits em 12 minutos. É consolidação de pesquisas externas. ADR-0041 (engine catalog) + blueprint 21 (engine catalog 2 motores) são VÁLIDOS — preservar.

#### 2.3.2 — Decisões D-21 a D-43 + arquitetura

| Hash      | Data             | Msg                                                       | Veredito             |
| --------- | ---------------- | --------------------------------------------------------- | -------------------- |
| `ba3f02d` | 2026-05-20 06:49 | 12 decisoes novas + plano transformacao isolado           | REVERT               |
| `0376258` | 2026-05-20 07:01 | decisoes d-33 a d-42 + plano cross-cutting                | REVERT               |
| `cea6841` | 2026-05-20 07:22 | d-43 semantic color roles + arquitetura 3-layer           | REVERT               |
| `2e0c239` | 2026-05-20 08:36 | fase 0a audit 79 marcas + objetivo macro multi-tenant     | REVERT (docs em vão) |
| `ea247b6` | 2026-05-20 08:47 | plano reescrito — 10 passos simples + 1.5 dias            | REVERT               |
| `919db6c` | 2026-05-20 08:58 | plano + passo 0 audit + 6 antecipacoes + pre-leitura      | REVERT               |
| `182be62` | 2026-05-20 09:25 | passo 0 audit + lente correta aplicada ao plano           | REVERT               |
| `5172c2c` | 2026-05-20 10:04 | passos 1+2 — 18 archetypes auditados (3 agents paralelos) | REVERT               |
| `091e07a` | 2026-05-20 10:59 | passos 1.5+1.6 — mobile audit + pesquisa externa native   | REVERT               |
| `a31985c` | 2026-05-20 11:58 | organizacao consolidada — 10 perguntas decididas          | REVERT (docs em vão) |
| `bdb79d4` | 2026-05-20 19:32 | passos 3-5 + seeds brand-\* + correcoes incoerencias      | REVERT               |
| `1d09a87` | 2026-05-20 20:40 | consolidar 35 docs em arquitetura mestre + plano 2 fases  | REVERT               |
| `dae5df8` | 2026-05-20 20:46 | adicionar mapa mental markmap (20-concept-map.md)         | REVERT (DOCS-only)   |
| `25ac586` | 2026-05-20 21:13 | formalizar 6 estrategias de mapping per archetype         | REVERT               |

#### 2.3.3 — Implementação archetypes (código + DB)

| Hash      | Data             | Msg                                                         | Veredito                                                  |
| --------- | ---------------- | ----------------------------------------------------------- | --------------------------------------------------------- |
| `b3d9e32` | 2026-05-20 21:22 | passos 1.1+1.2 — **migration 0020** + types regenerados     | **PARTIAL** — Migration 0020 DB-resident, types regen JIT |
| `56a1dab` | 2026-05-20 21:35 | passo 1.3 — contract + roles + template + auto-index        | REVERT                                                    |
| `e26a4a0` | 2026-05-20 22:01 | **migration 0021** — reserve tenant_theme_presets           | PARTIAL — DB-resident                                     |
| `22cae36` | 2026-05-20 22:06 | passo 1.4 — 22 esqueletos archetypes                        | REVERT                                                    |
| `0918458` | 2026-05-20 22:48 | passo 1.4 schema 19 dominios + conventions.md               | REVERT                                                    |
| `9576e54` | 2026-05-20 23:14 | passo 1.4 completo — 22 archetypes 19 dominios via 4 agents | REVERT (9.580 LOC)                                        |

#### 2.3.4 — Foundation + 8 pesquisas Opus + wrappers + showcase

| Hash      | Data             | Msg                                                                     | Veredito                                                                                     |
| --------- | ---------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `e718cc2` | 2026-05-21 00:14 | 8 pesquisas opus paralelas — specs implementation-ready                 | REVERT (docs) — **preservar** porque 2-3 são úteis (pesquisa A-H subset)                     |
| `f21fe2e` | 2026-05-21 00:58 | consolidacao 4 agents opus — 8 pesquisas aplicadas em codigo            | REVERT                                                                                       |
| `b328d28` | 2026-05-21 01:28 | foundation 1.5+1.7+1.8+1.9 fechada                                      | REVERT                                                                                       |
| `a370d80` | 2026-05-21 02:27 | bloco 1 — storybook decorator + fix 3 apca fails                        | REVERT                                                                                       |
| `886c0d8` | 2026-05-21 02:59 | bloco 2 — 23 wrappers ds-layer (tier 2/3/4 mobile)                      | REVERT                                                                                       |
| `a56a7d9` | 2026-05-21 03:15 | bloco 3+4 — **9 lazy archetypes + 5 shadcn blocks + 5 kibo primitives** | **PARTIAL** — shadcn blocks + kibo são vendor instals (re-instalar JIT via `npx shadcn add`) |
| `e35677f` | 2026-05-21 03:42 | 7 stories ds-mobile + **fix build prerender suspense**                  | **PARTIAL** — PPR Suspense fix em `app/layout.tsx` é crítico (anotar JIT)                    |
| `ddf8b5c` | 2026-05-21 03:54 | stories kibo-ui                                                         | REVERT (stories)                                                                             |
| `022231a` | 2026-05-21 03:55 | changelog bloco 2/3/4 + stories + build fix                             | DOCS                                                                                         |
| `4ce11a4` | 2026-05-21 06:41 | **join palette + font slugs em route lookup (fase a)**                  | **PARTIAL** — multi-tenant resolver enhancement (anotar JIT, re-aplicar em 30min)            |
| `cae1f41` | 2026-05-21 07:03 | native aliases mistral + stripe + emitnative layer 2 (a.3)              | REVERT (100% invented)                                                                       |
| `7b94af8` | 2026-05-21 07:03 | **adaptiveshell + breakpoint-mobile token + worktree ignore** (c)       | **PARTIAL** — AdaptiveShell pattern útil (re-aplicar JIT)                                    |
| `ede0d49` | 2026-05-21 07:04 | **white-label vendor blocks consomem usebrand + i18n** (b)              | **PARTIAL** — useBrand wiring em login/signup/dashboard (re-aplicar JIT)                     |
| `fe10231` | 2026-05-21 07:13 | **split server-page + client-view + static intl messages** (PPR)        | **PARTIAL** — PPR fix decisivo (re-aplicar JIT crítico)                                      |

---

## 3. Cutoff recomendado

### 3.1 Recomendação: `12d582a` (Cutoff A — "dia 0 fechado")

**Hash completo:** `12d582a308ef64fb8f0a1cdf34d58fdcf9480c59`
**Data:** 2026-05-18 20:33:41 -0300
**Msg:** `chore: dia 0 fechado — adr-0040 + storybook + makerkit rpcs + pwa per-tenant`

**O que está presente:**

| Componente                                                       | Status em `12d582a`                                                                  |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Multi-tenant runtime (`getRouteByHost`, RouteProvider, proxy)    | ✅ presente (sem JOIN palette+font — re-add JIT)                                     |
| App layout PPR-aware                                             | ✅ Suspense já existe (sem ThemeStyle pattern do `fe10231` — re-add JIT)             |
| Wrappers app-\*: form, toast, entitlement-gate                   | ✅ presentes                                                                         |
| Typography ui/: heading, text, muted, logo wordmark              | ✅ presentes                                                                         |
| MotionProvider + Motion 12 presets                               | ✅ presente                                                                          |
| Storybook 10 (`@storybook/nextjs-vite`)                          | ✅ presente                                                                          |
| PWA per-tenant (manifest, icons, splash, theme-color, safe-area) | ✅ presente                                                                          |
| Schema único `public.*` (ADR-0033, ~37 tabelas)                  | ✅ presente                                                                          |
| Entitlements RPCs (ADR-0039) + plans table                       | ✅ presente                                                                          |
| APCA Silver validator (`lib/design/contrast.ts`)                 | ✅ presente                                                                          |
| 53 shadcn primitives + 4 typography custom                       | ✅ presentes                                                                         |
| 15 rules path-loaded                                             | ✅ presentes (sem `docs-writing.md`, sem `forms-engine.md`, sem `tenant-content.md`) |
| `lib/design/`: contrast, motion, palettes, tokens + seeds        | ✅ CLEAN (4 arquivos só)                                                             |
| `components/ds/`                                                 | ❌ NÃO EXISTE (vazio) — perfeito                                                     |
| `lib/design/archetypes/`                                         | ❌ NÃO EXISTE (vazio) — perfeito                                                     |
| `lib/design/contract/`                                           | ❌ NÃO EXISTE — perfeito                                                             |
| `messages/pt-BR/voice/`                                          | ❌ NÃO EXISTE — perfeito                                                             |
| `docs/references/design-systems/`                                | ❌ NÃO EXISTE — perfeito                                                             |
| `docs/design-system/`                                            | ❌ NÃO EXISTE — perfeito                                                             |
| 5 ESLint rules ds-governance                                     | ❌ NÃO EXISTEM — perfeito                                                            |

**Trade-off aceito:** perde 71 commits após `12d582a` mas como o user filosofou "decisões > arquivos", as decisões boas (ADR-0041 engine catalog, blueprint 21, research 23/24/25 forms/pages/reports, pesquisa 28 tweakcn-eval, plano funil-agencia, ADR-0044 pivot, etc) estão preservadas via cópia filesystem para `platform-preserved-*`.

### 3.2 Alternativa B: `6529936` (Cutoff B — "primeiro commit design-system, mas só docs")

**Hash completo:** `6529936d25254579fd4a30fd4e6c74cd89baf709`
**Data:** 2026-05-19 20:56:12 -0300

**O que ganha vs A:**

- 5 migrations adicionais aplicadas (0013/0014/0015/0016/0017 — DB já tem mas types regen + docs ficam)
- `.claude/rules/docs-writing.md`, `forms-engine.md` (próximo `888953f`)
- Research 24 + 25 (pages, reports)
- ADR-0041 engine catalog + blueprint 21
- 5 pesquisas extras consolidadas (`6529936` traz pesquisa 26 + 27)

**O que perde vs A:**

- Mantém pasta `docs/design-system/` exploratoria (15 docs WIP — não fazem mal por enquanto, mas vão sumir em pivot)
- Pesquisa 26 + 27 (design-system-vibes + tokens-per-archetype) que são invented e devem morrer
- Plano dia 1 já está consolidado pós-pesquisa 23

**Veredito:** B perde menos trabalho útil que A, mas requer cleanup adicional (deletar `docs/design-system/` + research 26/27 + voice/\* + ...). Trade-off baixo: ~30min extras de cleanup pra ganhar 8h de trabalho de migrations + ADR-0041 + research 24/25.

### 3.3 Alternativa C: `888953f` (Cutoff C — "pré-loops mas pós-rule docs-writing")

**Hash completo:** `888953f2991d379fde20c50011a5e58a8d916934`
**Data:** 2026-05-19 13:18:55 -0300

**O que ganha vs A:**

- Migrations 0013-0017 aplicadas (DB-resident — só docs/contracts)
- `.claude/rules/docs-writing.md` (nova rule path-loaded)
- Research 23 (forms) + 24 (pages) + 25 (reports) — todas válidas pós-pivot
- ADR-0041 NÃO existe ainda (vem em `6529936`)
- `docs/design-system/` NÃO existe ainda
- `docs/references/design-systems/` NÃO existe ainda

**Veredito:** **C é o cutoff IDEAL se o user quer "pré-design-system zero" + ganhar pesquisas válidas + rule docs-writing**. Diferença ABSOLUTA vs A: ganha ~6h trabalho útil sem nenhum design system invented.

### 3.4 Decisão final recomendada: **Cutoff C = `888953f`**

Motivos:

1. **Zero design system invented** (commits design-system começam só em `6529936` que é o próximo).
2. **Ganha migrations 0013-0017** já documentadas (DB já tem).
3. **Ganha research 23/24/25** (forms/pages/reports — válidos pós-pivot, parte do plano funil-agencia).
4. **Ganha `docs-writing.md` rule** (útil pra Claude futuro).
5. **Status no momento:** plano dia 1 consolidado em PLANO-DIA-1-AGENCY-FUNNEL.md, pré-rumo errado.
6. **CLAUDE.md ainda não tem entradas de design system pra remover.**

Cutoffs alternativos só se user prefere:

- **A (`12d582a`)** se quiser "zero risco, dia 0 puro" (perde 6h útil de migrations + research)
- **B (`6529936`)** se quiser "incluir ADR-0041 engine catalog + blueprint 21 + research 26/27" (paga preço de docs invented circulando — fácil deletar)

---

## 4. Preservar em diretório vizinho — lista completa

Diretório destino: `C:\Users\leean\Desktop\platform-preserved-2026-05-21\`

Estrutura proposta:

```
platform-preserved-2026-05-21/
├── README.md                          (orientação do que tem aqui)
├── ANOTACOES-JIT.md                   (trabalho a refazer 2-4h após reset)
├── adrs/                              (28 ADRs — exclui 0042/0043 superseded)
├── plans/                             (3 planos: pivot-tweakcn, funil-agencia, design-system superseded)
├── research/                          (14 research válidos pós-pivot)
├── sessions/                          (8 sessions com valor histórico)
├── migrations-docs/                   (9 migrations docs)
├── blueprints/                        (blueprints 19/20/21 novos pós-dia-0)
├── rules-snapshot/                    (17 rules atuais — referência)
├── claude-md-snapshot/                (CLAUDE.md atual + CHANGELOG.md + _status.md)
└── tweakcn-eval/                      (research 28 + pesquisas 29/30/31 com caveat)
```

### 4.1 ADRs (preservar todos exceto superseded)

Origem: `docs/adr/*.md`. Total atual: 44 ADRs + README.

**Preservar (todas as ADR válidas pós-pivot):**

| ADR       | Status                  | Motivo                                                                                                                                                   |
| --------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0001-0040 | aceitas (29 ADRs)       | Constituição/decisões cravadas que sobrevivem ao reset (já estavam no commit pré-cutoff exceto: alguns como 0040 = `12d582a`, mas estão na história git) |
| 0041      | aceita                  | engine catalog 2 motores (kind/scope) — válido pós-pivot                                                                                                 |
| 0042      | **superseded por 0043** | Preservar como referência histórica em `adrs/_superseded/`                                                                                               |
| 0043      | **superseded por 0044** | Preservar como referência histórica em `adrs/_superseded/` (histórico do que falhou)                                                                     |
| 0044      | aceita                  | **pivot tweakcn — ADR principal pós-reset**                                                                                                              |

**Comando preservação (pseudo):**

```powershell
Copy-Item -Recurse "docs\adr\*" "$preserveDir\adrs\"
# 0042 e 0043 são movidas pra _superseded/ pra deixar claro
New-Item -ItemType Directory "$preserveDir\adrs\_superseded"
Move-Item "$preserveDir\adrs\0042-*.md" "$preserveDir\adrs\_superseded\"
Move-Item "$preserveDir\adrs\0043-*.md" "$preserveDir\adrs\_superseded\"
```

**Count: ~31 arquivos** (44 ADRs - alguns serão usados quando o cutoff aplicar).

Nota: pós-reset em `888953f`, ADRs 0042 (elevation tokens) e 0043 (consolidated 22 archetypes) não estarão no git. Restaurá-las só se valor histórico for julgado relevante (provavelmente arquivar em `docs/_archive/adrs/`).

### 4.2 Planos

| Plano                         | Status           | Preservar onde                                                       |
| ----------------------------- | ---------------- | -------------------------------------------------------------------- |
| `docs/plans/pivot-tweakcn.md` | ativo pós-pivot  | `plans/pivot-tweakcn.md` (vai voltar pro repo)                       |
| `docs/plans/design-system.md` | superseded       | `plans/_archived/design-system-superseded.md` (referência histórica) |
| `docs/plans/funil-agencia.md` | pausado (válido) | `plans/funil-agencia.md` (vai voltar pro repo após pivot Fase 4)     |
| `docs/plans/README.md`        | index            | `plans/README.md`                                                    |

**Count: 4 arquivos.**

### 4.3 Research (válidos pós-pivot)

Origem: `docs/research/`. Total atual: 31 docs (01 a 31, sem 19/20).

**Preservar:**

| Research                               | Tópico                  | Valor pós-pivot                  |
| -------------------------------------- | ----------------------- | -------------------------------- |
| 01-white-label-strategies              | strategy macro          | KEEP — base do projeto           |
| 02-design-frontend-arquitetura         | DS arch geral           | KEEP — referência                |
| 03-engenharia-de-prompt                | AI prompt               | KEEP                             |
| 04-regras-contratos-claude-code        | regras claude-code      | KEEP                             |
| 05-design-system-tokens-paletas        | tokens & palettes       | KEEP (com caveat — pre-tweakcn)  |
| 06-design-system-primitives-icons      | primitives              | KEEP                             |
| 07-planejamento-ordem-execucao         | planning                | KEEP                             |
| 08-design-system-motion-apca           | motion + APCA           | KEEP — APCA mantém               |
| 09-lint-enforcement-token-bypass       | lint                    | KEEP                             |
| 10-perf-multi-vertical                 | perf                    | KEEP                             |
| 11-editor-strategy                     | editor                  | KEEP                             |
| 12-pwa-offline-first                   | PWA                     | KEEP                             |
| 13-doc-lifecycle                       | docs                    | KEEP                             |
| 14-design-system-doc-pattern           | DS docs                 | KEEP (com caveat)                |
| 15-editor-mobile-first                 | editor mobile           | KEEP                             |
| 16-visual-premium                      | visual                  | KEEP                             |
| 17-guardrails-ia-shadcn-governanca     | governance              | KEEP                             |
| 18-shadcn-zone-quarantine              | shadcn-zone             | KEEP                             |
| 19-jit-vs-upfront-wrapper-strategy     | wrappers                | KEEP                             |
| 20-jit-vs-upfront-saas-founder-solo    | solo strategy           | KEEP                             |
| 21-i18n-strategy                       | i18n                    | KEEP                             |
| 22-supabase-multitenant-schema-audit   | schema                  | KEEP                             |
| 23-form-system-architecture            | forms                   | KEEP (parte de funil-agencia)    |
| 24-page-engine-architecture            | pages                   | KEEP (parte de funil-agencia)    |
| 25-ai-reports-architecture             | reports                 | KEEP (parte de funil-agencia)    |
| 28-tweakcn-evaluation                  | TweakCN anatomy         | **KEEP CRÍTICO** — base do pivot |
| 29-token-partition-universal-vs-tenant | partition (com caveat)  | KEEP — anotação caveat           |
| 30-color-format-culori-integration     | color (com caveat)      | KEEP — anotação caveat           |
| 31-zod-schema-shadcn-canonical         | zod schema (com caveat) | KEEP — anotação caveat           |

**Descartar:**

| Research                                                                         | Tópico               | Motivo                 |
| -------------------------------------------------------------------------------- | -------------------- | ---------------------- |
| 26-design-system-vibes (não existe agora — já-gone via grep `ls docs/research/`) | vibes                | Design system invented |
| 27-design-tokens-per-archetype (não existe agora — já-gone)                      | tokens per archetype | Design system invented |

**Confirmado por `ls docs/research/`:** research 26 e 27 SÃO presentes hoje. **Descartar ambos** ao preservar.

**Count preservar: 28 research docs (de 31, exclui 26+27 + sem 19/20 numéricos lacuna histórica).**

### 4.4 Sessions (com valor histórico)

Origem: `docs/_sessions/`.

| Session                                          | Preservar?       | Motivo                                                                                                    |
| ------------------------------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------- |
| `2026-05-19-design-rethink-mcp-scaffold.md`      | KEEP             | Inflexão histórica + research 26 dispatching                                                              |
| `2026-05-19-resumo-completo.md`                  | KEEP             | Sumário sessão 12h                                                                                        |
| `2026-05-20-audit-docs-completo.md`              | KEEP             | Auditoria docs                                                                                            |
| `2026-05-20-conversation-history.md`             | KEEP             | History                                                                                                   |
| `2026-05-20-design-system-decisions.md`          | KEEP             | Decisões D-21 a D-43 (referência histórica — invent layer mas valioso pra entender por que pivot ocorreu) |
| `2026-05-21-auditoria-pivot-tweakcn.md`          | **KEEP CRÍTICO** | Auditoria HIGH-confidence base do pivot                                                                   |
| `2026-05-21-reversion-analysis.md`               | **KEEP CRÍTICO** | Análise A/B/C (Option C escolhida mas com novo pivot vira Option A)                                       |
| `2026-05-21-tweakcn-canonical-vs-invented.md`    | **KEEP CRÍTICO** | Inflexão estratégica                                                                                      |
| `2026-05-21-revert-audit-completo.md` (este doc) | **KEEP CRÍTICO** | Auditoria revert atual                                                                                    |

**Count: 9 sessions.**

### 4.5 Migrations docs

Origem: `docs/migrations/`.

| Migration                                      | Preservar?                                                                                                                |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `0001_initial.md`                              | KEEP                                                                                                                      |
| `0005_consolidate_to_public.md`                | KEEP                                                                                                                      |
| `0013_security_hardening_v2.md`                | KEEP                                                                                                                      |
| `0014_constraint_cleanup.md`                   | KEEP                                                                                                                      |
| `0015_forms_align_research_23.md`              | KEEP                                                                                                                      |
| `0016_structural_reserves.md`                  | KEEP                                                                                                                      |
| `0017_cross_table_tenant_consistency.md`       | KEEP                                                                                                                      |
| `0020_design_system_foundation.md`             | **KEEP com nota** — DB já tem; arquivar como "applied independently of code"                                              |
| `0021_tenant_theme_presets_reserve.md`         | **KEEP com nota** — DB já tem; reserva                                                                                    |
| `INDEX.md`                                     | KEEP                                                                                                                      |
| Migrations 0022/0023 (showcase tenant + GRANT) | **CRIAR docs** — não existem em `docs/migrations/` no HEAD; documentar JIT antes do reset (eles já estão aplicados no DB) |

**Count: 10-12 migrations docs.**

### 4.6 Blueprints (pós-dia-0)

Origem: `docs/blueprint/`. Os blueprints 00-18 já existem em `12d582a`. Os 19-21 surgiram pós-cutoff e devem ser preservados.

| Blueprint              | Preservar?                                                |
| ---------------------- | --------------------------------------------------------- |
| 19-wrapper-strategy.md | KEEP — pós-`12d582a`, conteúdo válido                     |
| 20-i18n-strategy.md    | KEEP — pós-`12d582a`, conteúdo válido                     |
| 21-engine-catalog.md   | KEEP — pós-`12d582a`, conteúdo válido (parte do ADR-0041) |

**Count: 3 blueprints.**

### 4.7 Sessions reflections com valor histórico (já listada em 4.4)

### 4.8 CHANGELOG + \_status + CLAUDE.md (referência)

| Arquivo             | Preservar?                                               |
| ------------------- | -------------------------------------------------------- |
| `CHANGELOG.md`      | KEEP — referência histórica completa                     |
| `docs/_status.md`   | KEEP — status corrente                                   |
| `CLAUDE.md` (atual) | KEEP — snapshot referência (vai ser reescrita pós-reset) |

**Count: 3 arquivos.**

### 4.9 `.claude/rules/*` rules atuais (17 rules)

Origem: `.claude/rules/`. 17 rules atuais.

**Pós-cutoff (`888953f`) terão 15 rules.** Diferença (que sai com reset):

| Rule                                                                | Origem (pós-cutoff)               | Preservar?                                                            |
| ------------------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------- |
| docs-writing.md                                                     | `888953f`                         | **JÁ no cutoff C** (se for C; senão preservar)                        |
| forms-engine.md                                                     | depois de 888953f                 | KEEP — pertence ao plano funil-agencia                                |
| tenant-content.md                                                   | depois de cutoff                  | KEEP — válida pós-pivot                                               |
| design-references.md                                                | pre-cutoff (existe em `12d582a`!) | **DESCARTAR** — vai ser apagada pós-reset (regra invertida deprecada) |
| design-tokens.md                                                    | pre-cutoff (existe em `12d582a`)  | KEEP — reescrever pós-reset com shadcn-canonical 41                   |
| shadcn-zone.md                                                      | pre-cutoff                        | KEEP                                                                  |
| brand.md, components.md, contrast.md, i18n.md, entitlements.md, etc | pre-cutoff                        | KEEP                                                                  |

**Preservar todas as 17 rules atuais como snapshot:**

```
rules-snapshot/
├── abstractions.md
├── brand.md
├── components.md
├── contrast.md
├── data-layer.md
├── design-references.md       (REFERENCE — não restaurar)
├── design-tokens.md
├── docs-writing.md
├── domain-logic.md
├── entitlements.md
├── features.md
├── forms-engine.md
├── i18n.md
├── jwt-claims.md
├── layers.md
├── naming.md
├── server-actions.md
├── shadcn-zone.md
└── tenant-content.md
```

**Count: 19 rules.**

### 4.10 Anotações "trabalho bom a refazer JIT"

Criar `platform-preserved-2026-05-21/ANOTACOES-JIT.md` com lista:

````markdown
# Trabalho bom a refazer JIT após reset

> Após `git reset --hard 888953f` (ou 12d582a ou 6529936), os itens abaixo
> precisam ser re-implementados. Estimativa total: 2-4h.

## 1. PPR Suspense fix em `app/layout.tsx` (commits `e35677f` + `fe10231`)

Pattern:

- `resolveTheme()` movido pra `<ThemeStyle>` component dentro de `<Suspense>`
- Next 16 cacheComponents exige uncached data (headers + DB lookup) isolada
- React 19 hoists `<style precedence="theme">` pro <head>
- html data-\* recebe fallback static + script runtime atualiza dataset
- `useBrandOptional()` helper em RouteProvider pra prerender opt-in

Pages afetadas:

- `app/{login,signup,dashboard}/page.tsx` → server wrapper com Suspense + `connection()` opt-out prerender
- corresponding `view.tsx` (client) consome `useBrand` strict + `useTranslations`
- `app/layout.tsx` → `NextIntlClientProvider` hoists out of Suspense com static messages bundle (common + auth + navigation)
- `i18n/request.ts` → namespaces auth + navigation pra getTranslations server-side

Tempo estimado: 1-1.5h.

## 2. `getRouteByHost` JOIN palette + font slugs (commit `4ce11a4`)

Antes: hardcoded palette=default + typography=inter
Depois: nested select `palette:palette_id(slug) + font:font_id(slug)` em Supabase query.
Tenant type ganha: archetype_id, theme_mode, palette_id, font_id, palette nested, font nested.

Tempo estimado: 30min.

## 3. AdaptiveShell pattern (commit `7b94af8`)

- `components/ds/adaptive-shell.tsx` orquestra slots `mobileNav` (NavigationBottom) + `desktopNav` (Sidebar) + `mobileFab`
- `--breakpoint-mobile` token Tailwind v4
- `useIsMobile()` hook (já existe parcial)
- Worktree ignore em ESLint

Tempo estimado: 1h (mas só JIT quando feature pedir).

## 4. White-label vendor blocks consomem useBrand (commit `ede0d49`)

- site-header + app-sidebar + team-switcher: substituir 'acme inc.' por `useBrand().name`
- login-form + signup-form: `useTranslations('auth')` — chaves t() em `messages/pt-BR/auth.json`
- brand heading dinâmico via useBrand
- `app/{dashboard,login,signup}` ganham `data-vertical` no wrapper top-level

Tempo estimado: 30-45min.

## 5. Vendor blocks shadcn + Kibo UI (commit `a56a7d9`)

Re-instalar via `npx shadcn add` (canal único — `.claude/rules/shadcn-zone.md`):

- shadcn blocks: sidebar-07, sidebar-16, dashboard-01, login-02, signup-02
- kibo-ui primitives: announcement, banner, dropzone, marquee, spinner

```bash
pnpm dlx shadcn@latest add sidebar-07 sidebar-16 dashboard-01 login-02 signup-02
pnpm dlx shadcn@canary add @kibo/announcement @kibo/banner @kibo/dropzone @kibo/marquee @kibo/spinner
```
````

Tempo estimado: 15-30min (mecânico).

## 6. Migrations 0020-0023 (DB-resident, código não afetado)

DB já tem migrations 0020 (tenants.archetype_id+palette_id+font_id), 0021 (tenant_theme_presets reserve), 0022 (showcase tenant fixture), 0023 (GRANT service_role routing tables).

Pós-reset, regen types via `mcp__supabase__generate_typescript_types`:

```bash
# Via MCP no Claude
mcp__plugin_supabase_supabase__generate_typescript_types({ project_id: '<id>' })
# Salva em lib/contracts/database.ts
```

Migration docs 0020-0023 podem ser re-criadas em `docs/migrations/` JIT.

Tempo estimado: 15min.

## 7. ADR-0044 (pivot tweakcn) + Plano pivot-tweakcn.md + Research 28-31

Restaurar do diretório preservado pós-reset:

```powershell
Copy-Item "$preserveDir/adrs/0044-pivot-tweakcn-shadcn-canonical.md" "docs/adr/" -Force
Copy-Item "$preserveDir/plans/pivot-tweakcn.md" "docs/plans/" -Force
Copy-Item "$preserveDir/research/28-tweakcn-evaluation.md" "docs/research/" -Force
Copy-Item "$preserveDir/research/29-token-partition-universal-vs-tenant.md" "docs/research/" -Force
Copy-Item "$preserveDir/research/30-color-format-culori-integration.md" "docs/research/" -Force
Copy-Item "$preserveDir/research/31-zod-schema-shadcn-canonical.md" "docs/research/" -Force
Copy-Item "$preserveDir/sessions/2026-05-21-*.md" "docs/_sessions/" -Force
```

Tempo: 5min.

## 8. CLAUDE.md (reescrever bullets pós-pivot)

CLAUDE.md em `888953f` ainda tem `design-references.md` rule listada + 15 rules + mentção a `Pacote A` no projeto.

Pós-restauração ADR-0044, atualizar:

- Remover `design-references` da lista de rules path-loaded
- Adicionar bullet "Design system (ADR-0044 pivot): shadcn-canonical 41 tokens TweakCN-vocab + multi-tenant runtime mantido"
- Atualizar tabela "Onde fica cada coisa" pra apontar pivot-tweakcn.md
- Adicionar TweakCN clone path como SSOT

Tempo estimado: 30min.

**TOTAL TEMPO REFAZER JIT pós-reset: 3-5h.**

```

**Count: 1 arquivo `ANOTACOES-JIT.md`** (este conteúdo).

### 4.11 Sumário totalização da preservação

| Categoria | Arquivos |
|-----------|----------|
| README.md (do preserve dir) | 1 |
| ANOTACOES-JIT.md | 1 |
| ADRs (28 + 2 superseded) | ~31 |
| Planos (3) + README | 4 |
| Research (28) | 28 |
| Sessions (9) | 9 |
| Migrations docs (10-12) | ~11 |
| Blueprints (3 novos) | 3 |
| Rules snapshot (17 rules) | 17 |
| CLAUDE.md, CHANGELOG.md, _status.md | 3 |
| **TOTAL** | **~108 arquivos** |

---

## 5. Vai sair com o reset — lista completa

Reset target: `888953f` (Cutoff C). Tudo deste hash em diante (71 commits) será apagado do filesystem (mas git history preserva pra revert JIT).

### 5.1 Folders inteiros que somem

| Path | Conteúdo | Status |
|------|----------|--------|
| `docs/design-system/` | 15+ docs WIP (00-state, 01-hypotheses, ... 19-mobile-first-additions) | SOMEM (já vazio no HEAD — pasta presente porém docs deletados) |
| `docs/references/design-systems/` | 73 brand folders (airbnb, apple, claude, ... zapier) — cada um com `DESIGN.md` + assets | SOMEM (todos) |
| `docs/references/mobile-native-patterns/` | research mobile patterns | SOMEM (criado pós-cutoff) |
| `lib/design/archetypes/` | 22 archetype folders (231 arquivos, 9.580 LOC) | SOMEM (já não existe no HEAD do tree mas existe na history pós-cutoff) |
| `lib/design/contract/` | 8 sub-schemas Zod (strategy, roles, voice, typography, illustrations, visual, tokens, mobile, index) | SOMEM (parcialmente — index, tokens, mobile resistem; outros 5 somem) |
| `components/ds/` | 41 wrappers + 40 stories + 9 lazy archetype components + tudo | SOMEM TODOS |
| `components/_showcase/` | motion.stories.tsx, palettes.stories.tsx (não existe? checar) | parcial — já existe em 12d582a |
| `messages/pt-BR/voice/` | 22 voice JSONs (airbnb, apple, claude, figma, linear, mastercard, meta, mistral, nike, notion, opencode, pinterest, sanity, spacex, spotify, starbucks, stripe, theverge, vodafone, wired, wise, zapier) | SOMEM TODAS |
| `.claude/worktrees/` | 2 worktrees obsoletos (agent-a346e91b13e285d70, agent-a60ee799e6d5abc0d) | SOMEM (criados pós-cutoff) |
| `app/showcase/` | Já-gone no tree atual | Sumiram (criados + deletados pós-cutoff) |
| `docs/design-system-rethink/` | Não existe — confundi com `docs/_archive/design-system-rethink/` | n/a |
| `docs/_archive/design-system-rethink/` | 19 docs históricos archive | KEEP (já em archive) |

### 5.2 Arquivos individuais que somem

#### 5.2.1 — em `.claude/rules/`

| Rule | Pós-reset status |
|------|------------------|
| `.claude/rules/forms-engine.md` | SAI (criada pós-cutoff) — anotar JIT |
| `.claude/rules/tenant-content.md` | SAI (criada pós-cutoff) — anotar JIT |
| `.claude/rules/design-references.md` | **NÃO SAI** se cutoff for `12d582a` ou `888953f` (existe pre-cutoff) — deletar manualmente após reset OU já-deletar em commit Fase 0 |

#### 5.2.2 — em `lib/design/`

| Arquivo | Pós-reset status (em `888953f`/`12d582a`) |
|---------|-------------------------------------------|
| `lib/design/contrast.ts` | KEEP (existe pre-cutoff) |
| `lib/design/motion.ts` | KEEP (existe pre-cutoff) |
| `lib/design/palettes.ts` | KEEP (existe pre-cutoff) |
| `lib/design/tokens.ts` | KEEP (existe pre-cutoff) |
| `lib/design/seeds/{fonts,palettes,shapes}.seed.ts` | KEEP (existem pre-cutoff) |
| `lib/design/build-theme-css.ts` | SAI (criado pós-cutoff) |
| `lib/design/generate-theme-css.ts` | SAI (criado pós-cutoff) |
| `lib/design/validate-combo.ts` | SAI (criado pós-cutoff) |
| `lib/design/role-resolver.ts` | SAI |
| `lib/design/roles.ts` | SAI |
| `lib/design/__tests__/*` | SAI |
| `lib/design/contract/index.ts` | SAI |
| `lib/design/contract/mobile.ts` | SAI |
| `lib/design/contract/tokens.ts` | SAI |

#### 5.2.3 — em outros lugares

| Arquivo | Pós-reset status |
|---------|------------------|
| `app/globals.css` | KEEP (existe pre-cutoff) — versão muito mais simples sem `--role-*` |
| `app/layout.tsx` | KEEP (existe pre-cutoff) — sem PPR Suspense pattern do `fe10231` (anotar JIT) |
| `app/showcase/*` | SAI / não existe no HEAD |
| Scripts em `scripts/`: `archetype-index.ts`, `scaffold-archetypes.ts`, `validate-archetypes.ts`, `validate-combo.ts` | SAEM (criados pós-cutoff) |
| `scripts/validate-palettes.ts` | KEEP (existe pre-cutoff) |
| `tests/setup.ts` | KEEP (existe pre-cutoff?) |
| `vitest.shims.d.ts` | SAI (criado pós-cutoff) |
| `hooks/use-mobile.ts` | SAI provavelmente (criado pós-cutoff) |

#### 5.2.4 — em `components/` (não-ds)

| Arquivo | Status |
|---------|--------|
| `components/app-form.tsx` + stories | KEEP (existe pre-cutoff) |
| `components/app-toast.tsx` + stories | KEEP |
| `components/app-entitlement-gate.tsx` + stories | KEEP |
| `components/motion-provider.tsx` | KEEP |
| `components/ui/heading.tsx`, `text.tsx`, `muted.tsx`, `logo.tsx` | KEEP |
| `components/_showcase/motion.stories.tsx`, `palettes.stories.tsx` | KEEP |
| `components/app-sidebar.tsx` | SAI (instalado em `a56a7d9`) — re-instalar JIT |
| `components/data-table.tsx` | SAI — re-instalar JIT |
| `components/chart-area-interactive.tsx` | SAI — re-instalar JIT |
| `components/login-form.tsx` | SAI — re-instalar JIT |
| `components/signup-form.tsx` | SAI — re-instalar JIT |
| `components/nav-*.tsx`, `search-form.tsx`, `section-cards.tsx`, `site-header.tsx`, `team-switcher.tsx`, `version-switcher.tsx` | SAEM (instalados em `a56a7d9`) — re-instalar JIT |
| `components/kibo-ui/{announcement,banner,dropzone,marquee,spinner}` | SAEM — re-instalar JIT |
| `components/ui/*` (53 primitives originais) | KEEP — todos pre-cutoff |

### 5.3 CLAUDE.md sections que vão sair com o reset

CLAUDE.md em `888953f` é **bem menor** que o HEAD atual. Vai voltar pra:

- Tabela "Onde fica cada coisa" sem entradas de design-system
- `.claude/rules/*.md` lista de 15-16 rules (sem `forms-engine`, `tenant-content`)
- Sem bullet "Design system (ADR-0043 consolidado)"
- Sem bullet "5 ESLint rules ADR-0043"
- Sem bullet "Mobile vs Desktop AdaptiveShell"
- Sem bullet "Engines (ADR-0041)" — espera, ADR-0041 nasce em `6529936` (POST-`888953f`)

**Pós-restaurar ADR-0044 + plano pivot-tweakcn.md, CLAUDE.md precisa update manual (anotação JIT §8).**

### 5.4 ESLint rules custom — quais sobrevivem

Origem: `eslint.config.mjs` linhas 21-207 + outras custom espalhadas.

**No HEAD (atual):** 9 custom rules total:
- 5 ds-governance: `no-raw-tokens-in-components`, `no-raw-fontfamily`, `no-icon-bypass`, `no-vh-in-mobile-aware`, `no-elevation-legacy`
- 4 outras: `design-tokens/no-tailwind-bypass`, `vocab/no-banned-vocab`, `brand/no-brand-hardcode`, `plan-gates`, `css-var-in-style`, `server-only-guard` (algumas dessas)

**Pós-reset (`888953f`):**

| Rule | Sobrevive? | Origem |
|------|-----------|--------|
| `no-raw-tokens-in-components` (ds-governance) | NÃO — sai com reset | invented pós-cutoff |
| `no-raw-fontfamily` (ds-governance) | NÃO — sai com reset | invented pós-cutoff |
| `no-icon-bypass` (ds-governance) | NÃO — sai com reset | invented pós-cutoff |
| `no-vh-in-mobile-aware` (ds-governance) | NÃO — sai com reset | invented pós-cutoff |
| `no-elevation-legacy` (ds-governance) | NÃO — sai com reset | invented pós-cutoff |
| `design-tokens/no-tailwind-bypass` | KEEP — existe pre-cutoff (`b789bc9`) |
| `vocab/no-banned-vocab` | KEEP — existe pre-cutoff |
| `brand/no-brand-hardcode` | KEEP — existe pre-cutoff |
| `plan-gates` | check — provável pre-cutoff |
| `css-var-in-style` | KEEP — existe pre-cutoff (`b789bc9`) |
| `server-only-guard` | check — provável pre-cutoff |

**Veredito:** 5 ds-governance saem (perfeito — eram premature). 4-6 rules infra ficam (vocab/brand/css-var/tailwind-bypass — todas válidas pós-pivot).

### 5.5 Migrations DB (independente do git)

**TODAS as migrations aplicadas continuam aplicadas no Supabase.** O git não controla DB.

| Migration | Status DB |
|-----------|-----------|
| 0001-0019 | APLICADAS — KEEP |
| 0020 (archetype_id/palette_id/font_id em tenants) | APLICADA — KEEP (schema fica até Fase 4 do pivot migrar) |
| 0021 (reserve tenant_theme_presets) | APLICADA — KEEP |
| 0022 (showcase tenant fixture) | APLICADA — KEEP (útil) |
| 0023 (GRANT service_role routing tables) | APLICADA — KEEP (bug real consertado) |

**Pós-reset:** types regen via `mcp__supabase__generate_typescript_types` necessário porque `lib/contracts/database.ts` em `888953f` reflete apenas até migration 0017.

---

## 6. Estado pós-reset esperado (cutoff `888953f`)

### 6.1 Repo structure

```

platform/
├── .claude/
│ ├── hooks/
│ ├── rules/ (16 rules — sem forms-engine, sem tenant-content)
│ │ ├── abstractions.md
│ │ ├── brand.md
│ │ ├── components.md
│ │ ├── contrast.md
│ │ ├── data-layer.md
│ │ ├── design-references.md (vai sair logo após reset via 1 commit cleanup)
│ │ ├── design-tokens.md
│ │ ├── docs-writing.md
│ │ ├── domain-logic.md
│ │ ├── entitlements.md
│ │ ├── features.md
│ │ ├── i18n.md
│ │ ├── jwt-claims.md
│ │ ├── layers.md
│ │ ├── naming.md
│ │ ├── server-actions.md
│ │ └── shadcn-zone.md
│ └── (sem worktrees)
├── app/
│ ├── (client)/
│ ├── api/
│ ├── dashboard/page.tsx (versão sem split server/view do fe10231)
│ ├── globals.css (sem --role-_)
│ ├── layout.tsx (sem PPR Suspense pattern do fe10231)
│ ├── login/page.tsx (versão sem useBrand wiring de ede0d49)
│ ├── offline/page.tsx
│ ├── page.tsx
│ ├── serwist/
│ ├── signup/page.tsx
│ ├── styles/
│ └── sw.ts
├── components/
│ ├── ui/ (53 primitives + heading, text, muted, logo)
│ ├── app-form.tsx
│ ├── app-toast.tsx
│ ├── app-entitlement-gate.tsx
│ ├── motion-provider.tsx
│ ├── \_showcase/ (motion.stories, palettes.stories)
│ (SEM ds/, sem kibo-ui/, sem app-sidebar/data-table/chart-area/login-form/signup-form/nav-_/site-header/team-switcher)
├── docs/
│ ├── adr/ (~40 ADRs, sem 0041-0044 — restaurar 0044 do preserve dir)
│ ├── blueprint/ (00-18 + 19/20/21 SE cutoff for pós-`888953f`)
│ ├── plans/
│ │ ├── PLANO-DIA-1-AGENCY-FUNNEL.md (versão pré-renomeação)
│ │ └── (sem pivot-tweakcn.md — restaurar do preserve dir)
│ ├── research/ (~25 docs, sem 26/27, sem 28-31 — restaurar 28-31 do preserve dir)
│ ├── \_sessions/ (2026-05-19-design-rethink-mcp-scaffold)
│ ├── migrations/ (0001-0017)
│ └── \_archive/
├── hooks/
├── i18n/
├── lib/
│ ├── brand/
│ ├── contracts/ (database.ts até migration 0017 — regen JIT)
│ ├── design/
│ │ ├── contrast.ts (APCA Silver — KEEP)
│ │ ├── motion.ts
│ │ ├── palettes.ts
│ │ ├── tokens.ts
│ │ └── seeds/ (fonts, palettes, shapes)
│ ├── domain/
│ ├── entitlements/
│ ├── env.ts
│ ├── route/ (getRouteByHost, RouteProvider, types — sem JOIN palette+font do 4ce11a4)
│ ├── supabase/
│ └── utils.ts
├── messages/
│ └── pt-BR/
│ ├── common.json
│ └── (sem voice/, sem showcase.json, sem auth.json, sem navigation.json, sem entitlements.json — alguns existem pre-cutoff)
├── scripts/
│ ├── token-audit.sh
│ ├── vocab-audit.sh
│ ├── i18n-audit.sh
│ └── validate-palettes.ts (versão pré-256-LOC update)
├── CHANGELOG.md
├── CLAUDE.md (~150 linhas vs 162 atual — sem bullets DS)
├── eslint.config.mjs (sem 5 ds-governance rules)
├── package.json (versão pré-design-system — culori, satori, etc estão? checar)
└── ...

````

### 6.2 Build status pós-reset

Esperado: **VERDE**. O commit `888953f` (e mais ainda `12d582a`) tem build verde quando criado.

Comando para verificar:

```bash
pnpm install        # algumas deps podem ter sumido — re-install
pnpm typecheck      # 0 erros esperado
pnpm lint --max-warnings 0
pnpm build
pnpm test
````

**Riscos:**

- `lib/contracts/database.ts` reflete schema até migration 0017, mas DB tem até 0023 — types out-of-sync. Solução: regen JIT via MCP.
- Algumas deps podem ter sido instaladas pós-cutoff (culori, satori-html, etc) — `pnpm install` resolve.
- ESLint pode reclamar de regras inexistentes — limpar referências às 5 ds-governance.

### 6.3 DB independente do git

**TODAS as 23 migrations continuam aplicadas no Supabase.** O git reset só afeta filesystem.

Schema:

- 45 tabelas em `public.*`
- Showcase tenant fixture (migration 0022) existe
- GRANT service_role (migration 0023) aplicado

Pós-reset, **NÃO re-aplicar migrations**. Apenas `mcp__supabase__generate_typescript_types` pra regenerar `lib/contracts/database.ts`.

### 6.4 TweakCN clone

`C:\Users\leean\Desktop\tweakcn-ref\` é **FORA do platform repo** e continua intocado pelo reset. SSOT pra adaptação direta na Fase 0 pós-restauração.

---

## 7. Plano de execução (script PowerShell)

> **CRÍTICO:** este script NÃO é executado por este agent (auditoria-only). É a especificação para o user revisar + executar em sessão dedicada com novo agent.

```powershell
# =====================================================================
# PIVOT EXECUTION SCRIPT — Hard reset agressivo + preservar decisões
# Cutoff recomendado: 888953f (Mon May 19 13:18:55 2026 -0300)
# =====================================================================

# 0. Pré-flight: verificar repo limpo
cd C:\Users\leean\Desktop\platform
git status
# Se output != "nothing to commit, working tree clean", ABORTAR. Resolver primeiro.

# 1. Criar diretório vizinho de preservação
$preserveDir = "C:\Users\leean\Desktop\platform-preserved-2026-05-21"
$ts = (Get-Date -Format "yyyy-MM-dd-HHmm")
New-Item -ItemType Directory -Force -Path $preserveDir
New-Item -ItemType Directory -Force -Path "$preserveDir\adrs"
New-Item -ItemType Directory -Force -Path "$preserveDir\adrs\_superseded"
New-Item -ItemType Directory -Force -Path "$preserveDir\plans"
New-Item -ItemType Directory -Force -Path "$preserveDir\plans\_archived"
New-Item -ItemType Directory -Force -Path "$preserveDir\research"
New-Item -ItemType Directory -Force -Path "$preserveDir\sessions"
New-Item -ItemType Directory -Force -Path "$preserveDir\migrations-docs"
New-Item -ItemType Directory -Force -Path "$preserveDir\blueprints"
New-Item -ItemType Directory -Force -Path "$preserveDir\rules-snapshot"
New-Item -ItemType Directory -Force -Path "$preserveDir\claude-md-snapshot"
New-Item -ItemType Directory -Force -Path "$preserveDir\tweakcn-eval"

# 2. Copiar TUDO que será preservado
# 2.1 ADRs
Copy-Item -Recurse "docs\adr\*.md" "$preserveDir\adrs\"
# Mover ADR-0042 e 0043 (superseded) pra subpasta
Move-Item "$preserveDir\adrs\0042-elevation-tokens-3-niveis.md" "$preserveDir\adrs\_superseded\"
Move-Item "$preserveDir\adrs\0043-design-system-architecture-consolidated.md" "$preserveDir\adrs\_superseded\"
Copy-Item "docs\adr\README.md" "$preserveDir\adrs\"

# 2.2 Planos
Copy-Item "docs\plans\pivot-tweakcn.md" "$preserveDir\plans\"
Copy-Item "docs\plans\funil-agencia.md" "$preserveDir\plans\"
Copy-Item "docs\plans\design-system.md" "$preserveDir\plans\_archived\"
Copy-Item "docs\plans\README.md" "$preserveDir\plans\"

# 2.3 Research (28 docs válidos pós-pivot)
Get-ChildItem "docs\research\*.md" | Where-Object {
    $_.Name -notmatch '^(26|27)-'  # exclui design-system-vibes + tokens-per-archetype
} | Copy-Item -Destination "$preserveDir\research\"

# 2.4 Sessions
Copy-Item "docs\_sessions\*.md" "$preserveDir\sessions\"

# 2.5 Migrations docs
Copy-Item "docs\migrations\*.md" "$preserveDir\migrations-docs\"

# 2.6 Blueprints pós-dia-0 (19, 20, 21)
Copy-Item "docs\blueprint\19-wrapper-strategy.md" "$preserveDir\blueprints\"
Copy-Item "docs\blueprint\20-i18n-strategy.md" "$preserveDir\blueprints\"
Copy-Item "docs\blueprint\21-engine-catalog.md" "$preserveDir\blueprints\"

# 2.7 Rules snapshot (17 rules)
Copy-Item ".claude\rules\*.md" "$preserveDir\rules-snapshot\"

# 2.8 CLAUDE.md, CHANGELOG.md, _status.md
Copy-Item "CLAUDE.md" "$preserveDir\claude-md-snapshot\"
Copy-Item "CHANGELOG.md" "$preserveDir\claude-md-snapshot\"
Copy-Item "docs\_status.md" "$preserveDir\claude-md-snapshot\"

# 2.9 README.md + ANOTACOES-JIT.md no preserveDir
# (criar manualmente após copy — content vem do §4.10 deste doc)

# 3. Tag de safety
git tag legacy-pre-pivot-2026-05-21 HEAD
git tag --list  # confirmar criada

# 4. Hard reset (DESTRUTIVO — confirmar antes!)
# Cutoff: 888953f
git reset --hard 888953f
# Working tree agora reflete estado em 2026-05-19 13:18

# 5. Verificar reset ok
git log --oneline -5
# deve mostrar 888953f no HEAD

# 6. Cleanup adicional pós-reset
# 6.1 — remover design-references.md (pre-cutoff mas deprecada)
git rm .claude/rules/design-references.md

# 6.2 — clean untracked (worktrees, etc)
git clean -fd
# CUIDADO: confirma com `git clean -fdn` antes (dry run)

# 7. Restaurar decisões preservadas
Copy-Item "$preserveDir\adrs\0044-pivot-tweakcn-shadcn-canonical.md" "docs\adr\" -Force
Copy-Item "$preserveDir\plans\pivot-tweakcn.md" "docs\plans\" -Force
Copy-Item "$preserveDir\plans\funil-agencia.md" "docs\plans\" -Force
Copy-Item "$preserveDir\research\28-tweakcn-evaluation.md" "docs\research\" -Force
Copy-Item "$preserveDir\research\29-token-partition-universal-vs-tenant.md" "docs\research\" -Force
Copy-Item "$preserveDir\research\30-color-format-culori-integration.md" "docs\research\" -Force
Copy-Item "$preserveDir\research\31-zod-schema-shadcn-canonical.md" "docs\research\" -Force
Copy-Item "$preserveDir\sessions\2026-05-21-auditoria-pivot-tweakcn.md" "docs\_sessions\" -Force
Copy-Item "$preserveDir\sessions\2026-05-21-reversion-analysis.md" "docs\_sessions\" -Force
Copy-Item "$preserveDir\sessions\2026-05-21-tweakcn-canonical-vs-invented.md" "docs\_sessions\" -Force
Copy-Item "$preserveDir\sessions\2026-05-21-revert-audit-completo.md" "docs\_sessions\" -Force

# 7.1 — ADRs 0042 e 0043 (referência histórica do que falhou)
New-Item -ItemType Directory -Force "docs\_archive\adrs"
Copy-Item "$preserveDir\adrs\_superseded\0042-elevation-tokens-3-niveis.md" "docs\_archive\adrs\" -Force
Copy-Item "$preserveDir\adrs\_superseded\0043-design-system-architecture-consolidated.md" "docs\_archive\adrs\" -Force

# 7.2 — Plano superseded
New-Item -ItemType Directory -Force "docs\_archive\plans"
Copy-Item "$preserveDir\plans\_archived\design-system.md" "docs\_archive\plans\design-system-superseded-2026-05-21.md" -Force

# 8. Atualizar CLAUDE.md (manualmente — anotação JIT §8)
# Não automático aqui — abrir editor e ajustar bullets

# 9. Regen types (DB-resident migrations 0020-0023)
# Via MCP no Claude (não shell):
# mcp__plugin_supabase_supabase__generate_typescript_types({ project_id: '<id>' })
# Output salva manualmente em lib/contracts/database.ts

# 10. Verificar build
pnpm install
pnpm typecheck
pnpm lint --max-warnings 0
pnpm build
pnpm test

# 11. Commit final do reset + restauração
git add -A
git status  # confirmar escopo
git commit -m "chore(pivot): hard reset pra 888953f + preservadas decisões (ADR-0044 supersedes 0043)

- Hard reset --hard 888953f (Mon May 19 13:18:55 2026 — 'rule docs-writing + claude.md atualizada')
- 71 commits pós-cutoff descartados (todo design system invented work)
- Tag legacy-pre-pivot-2026-05-21 preserva HEAD anterior (revert JIT se necessário)
- Restauradas decisões importantes: ADR-0044 pivot, plano pivot-tweakcn, research 28-31 (tweakcn + S1.1/2/3 com caveats), 4 sessions de pivot
- ADRs 0042/0043 movidas pra docs/_archive/adrs/ (referência histórica)
- Plano design-system.md → docs/_archive/plans/design-system-superseded-2026-05-21.md
- design-references.md rule deletada (vocabulário inverso deprecado)
- Migrations DB 0020-0023 continuam aplicadas (independente do git)
- TweakCN clone read-only em C:\Users\leean\Desktop\tweakcn-ref\ permanece SSOT
- Preserve dir: C:\Users\leean\Desktop\platform-preserved-2026-05-21\

Next: Fase -1 pivot-tweakcn.md (clone TweakCN já feito) → Fase 0 setup limpo

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## 8. Riscos + mitigations

| Risco                                                                 | Probabilidade | Impacto | Mitigation                                                                                                                                                                                                                                         |
| --------------------------------------------------------------------- | ------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `git reset --hard` perde trabalho não-preservado                      | Alta          | Alto    | Tag `legacy-pre-pivot-2026-05-21` antes do reset. `git show <tag>:<path>` recupera qualquer arquivo individual.                                                                                                                                    |
| Diretório preservado fica obsoleto/abandonado                         | Média         | Médio   | README.md no preserveDir explica o que é + janela de utilidade (~30 dias). Após pivot estabilizar, mover pra archive externo (Google Drive, etc).                                                                                                  |
| Types `lib/contracts/database.ts` out-of-sync com DB pós-reset        | Alta          | Médio   | Regen JIT via MCP antes do primeiro typecheck.                                                                                                                                                                                                     |
| ESLint quebra por referência a regra inexistente                      | Média         | Baixo   | Cleanup eslint.config.mjs no commit final do reset.                                                                                                                                                                                                |
| Vendor blocks (kibo-ui, app-sidebar, data-table) precisam re-instalar | Alta          | Baixo   | Re-instalar via `npx shadcn add` (15-30min — anotação JIT).                                                                                                                                                                                        |
| PPR Suspense fix re-aplicado errado                                   | Média         | Médio   | Referência git: `git show fe10231 -- app/layout.tsx app/login/page.tsx app/login/view.tsx app/signup/page.tsx app/signup/view.tsx app/dashboard/page.tsx app/dashboard/view.tsx i18n/request.ts lib/route/RouteProvider.tsx`. Aplicar diff manual. |
| `getRouteByHost` JOIN palette+font esquecido                          | Baixa         | Médio   | Anotação JIT §2 + referência git `git show 4ce11a4`.                                                                                                                                                                                               |
| Migration 0020-0023 types não regenerados                             | Alta          | Médio   | Anotação JIT §6 + MCP call obrigatória pré-Fase 0.                                                                                                                                                                                                 |
| Preserve dir é deletado acidentalmente                                | Baixa         | Alto    | Backup adicional (Google Drive, OneDrive, etc) recomendado.                                                                                                                                                                                        |
| User troca de máquina / sync com OneDrive perde preserve dir          | Baixa         | Alto    | preserveDir fora do platform repo é boa prática, mas zip + backup externo recomendado.                                                                                                                                                             |
| Cutoff escolhido perde algo que parecia design-system mas era infra   | Média         | Médio   | Esta auditoria categoriza commit-a-commit. User valida tabela §2 antes de aprovar cutoff.                                                                                                                                                          |

---

## 9. Próximos passos pós-reset

### 9.1 — Pós-commit final reset

1. **Validate build verde:** `pnpm typecheck && pnpm lint --max-warnings 0 && pnpm build && pnpm test`
2. **Regen types:** MCP call `generate_typescript_types`
3. **Re-aplicar trabalho JIT (3-5h):**
   - PPR Suspense fix (1-1.5h)
   - getRouteByHost JOIN palette+font (30min)
   - Vendor blocks (kibo-ui + shadcn blocks + ds-mobile patterns) (1h)
   - useBrand white-label wiring login/signup/dashboard (30-45min)
   - AdaptiveShell pattern (1h)
   - CLAUDE.md update bullets (30min)
4. **Push (após user aprovar):** `git push -u origin main --force-with-lease` (force porque history reescrito após `888953f`)

### 9.2 — Pivot Fase -1 (já feita)

TweakCN clone em `C:\Users\leean\Desktop\tweakcn-ref\` permanece. Já lido em `pivot-tweakcn.md` §0.5.

### 9.3 — Pivot Fase 0 (próxima ação executável)

Após reset + JIT work + build verde, executar **Fase 0 do `pivot-tweakcn.md`** (foundation marcadores):

1. ADR-0044 já restaurado (do preserve dir) ✓
2. Plano pivot-tweakcn.md já restaurado ✓
3. CLAUDE.md atualizada com pivot bullets ✓ (manual JIT)
4. Estudar TweakCN clone (já feito em §0.5 do plano)
5. Implementar shadcn-canonical 41 tokens em `app/globals.css` + `lib/design/contract/theme.ts` (Zod monolítico)
6. Validar APCA Silver dual-gate
7. **Visual check** em rota `/` (landing) + `/dashboard` (auth) + `/login`/`/signup` (vendor blocks tematizados)

### 9.4 — Pivot Fases 1-8

Como spec'd em `docs/plans/pivot-tweakcn.md` (preservado).

---

## 10. Apêndice — paths absolutos auditados

Arquivos lidos integralmente nesta auditoria:

- `C:\Users\leean\Desktop\platform\docs\adr\0044-pivot-tweakcn-shadcn-canonical.md`
- `C:\Users\leean\Desktop\platform\docs\_sessions\2026-05-21-auditoria-pivot-tweakcn.md`
- `C:\Users\leean\Desktop\platform\docs\_sessions\2026-05-21-reversion-analysis.md`
- `C:\Users\leean\Desktop\platform\docs\_sessions\2026-05-21-tweakcn-canonical-vs-invented.md`
- `C:\Users\leean\Desktop\platform\CLAUDE.md` (atual)

Listagens estruturais:

- `docs/adr/` (44 ADRs + README)
- `docs/plans/` (3 plans + README)
- `docs/research/` (31 docs)
- `docs/_sessions/` (8 sessions atual + este = 9)
- `docs/migrations/` (10 docs)
- `docs/blueprint/` (22 blueprints + QUICK-START + VALIDACAO)
- `docs/design-system/` (vazio no HEAD)
- `docs/references/design-systems/` (73 brand folders)
- `docs/references/mobile-native-patterns/` (existe)
- `docs/_archive/` (4 entries: conversation-evolution, design-system-rethink, plans, README)
- `.claude/rules/` (17 rules — design-references presente)
- `.claude/worktrees/` (2 worktrees obsoletos)
- `lib/design/` (4 .ts arquivos + contract/ + seeds/ + **tests**/)
- `lib/design/contract/` (3 .ts: index, mobile, tokens)
- `components/` (DS folder + ui/ + kibo-ui/ + vendor blocks instalados)
- `components/ds/` (41 wrappers + 40 stories + 9 lazy folders)
- `components/ds/lazy/` (apple, figma, mastercard, mistral, nike, opencode, pinterest, stripe, theverge)
- `components/ui/` (63 .tsx)
- `components/kibo-ui/` (announcement, banner, dropzone, marquee, spinner)
- `messages/pt-BR/` (5 namespaces + voice/ folder)
- `messages/pt-BR/voice/` (22 voice JSONs)
- `app/` (sem showcase folder)
- 20 wrappers em `components/ds/` confirmados consumindo `var(--role-*)` via grep

Commits inspecionados:

- `git log --all --oneline -100` (todo histórico)
- `git show --stat`: `fe10231`, `ede0d49`, `7b94af8`, `cae1f41`, `4ce11a4`, `022231a`, `ddf8b5c`, `e35677f`, `a56a7d9`, `886c0d8`, `a370d80`, `b328d28`, `f21fe2e`, `e718cc2`, `6529936`, `12d582a`, `337766b`, `888953f`, `ba3f02d`, `7818df1`, `49dcc37`, `df0cded`
- `git diff --stat 12d582a..fe10231` → 843 arquivos / +80366 / -84400
- `git diff --stat 6529936..fe10231` → 823 arquivos
- `git ls-tree -r 12d582a lib/design/` → 4 .ts + seeds
- `git ls-tree -r 12d582a components/ds/` → vazio (perfeito)
- `git show 12d582a:app/layout.tsx`, `git show 12d582a:lib/route/getRouteByHost.ts` → confirmou multi-tenant runtime

**Tempo total auditoria:** ~45min.

---

**Cravado** quando user aprovar cutoff + lista preservação. Vira spec executável.
