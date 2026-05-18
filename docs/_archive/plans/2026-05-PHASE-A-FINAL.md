# Phase A Final — 5 fases pós-pesquisa

> **Status:** planned (não executado ainda)
> **Origem:** pesquisa `docs/research/17-guardrails-ia-shadcn-governanca.md` (2026-05-18)
> **Pré-requisito:** Phase A pré-pesquisa fechada (commits `f66e91f` + `a94a8bf` + `4be49e3` + knip fix)
> **Estimativa total:** 2-3 dias úteis
> **Bloqueia:** Tarefa 14 do Checklist 15 (Motion presets) — só começa após Fase 5 verde

---

## Contexto

Incidente Commit `7818df1` (revertido em `4be49e3`) expôs gap sistêmico: Claude
Code criou 5 componentes UX violando ADR-0008 (hierarquia shadcn), ADR-0012
(zero eslint-disable) e D-G66 (i18n hardcoded). Pesquisa publicada em
`docs/research/17-guardrails-ia-shadcn-governanca.md` confirmou:

1. **Causa raiz não é Claude — é ausência de guardrails determinísticos.** CLAUDE.md
   e ADRs em prosa são "pedidos", não garantias. Hooks `PreToolUse` com JSON output
   `{"decision":"block",...}` são a única trava confiável.
2. **Bug `anthropics/claude-code#13744`:** `exit 2` em PreToolUse não bloqueia
   confiavelmente Write/Edit. JSON output obrigatório.
3. **Caso público idêntico:** Alex Brohshtut documentou em 22-jan-2026 Sonnet
   adicionando `eslint-disable-next-line` e Opus editando `eslint.config.mjs`
   direto. Mesma anatomia do nosso incidente.

Pesquisa validou 80% das decisões existentes + propôs 3 mudanças grandes + várias
melhorias. Fundador aprovou "vamos de ideal — fazer tudo".

---

## Fase 1 — Hooks JSON output + ESLint comments plugin

**Estimativa:** ~1 dia · **Crítico, primeiro.**

### Entregáveis

- Auditar `.claude/hooks/` reais — bug `#13744` afeta APENAS hooks `PreToolUse` usando `exit 2` pra bloquear Write/Edit. Hooks `UserPromptSubmit` e `SessionStart` não bloqueiam tool calls → não precisam migrar.
- Migrar `block-disables.sh` (único PreToolUse atual) de `exit 2` → JSON output:
  ```json
  {
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "deny",
      "permissionDecisionReason": "..."
    }
  }
  ```
- Deixar `vocab-warn.sh` (UserPromptSubmit) e `load-context.sh` (SessionStart) como estão — bug não aplica
- 3 hooks PreToolUse novos em `.claude/hooks/`:
  - `protect-eslint.sh` — bloqueia Write/Edit em `eslint.config.*`
  - `block-disable-content.sh` — bloqueia conteúdo com regex `eslint-disable|noInlineConfig|"off"|overrides:`
  - `component-research-gate.sh` — bloqueia Write em `components/**`, `features/**/components/**`, `lib/**/components/**` sem marker `// RESEARCH: <fonte>` no topo
- Registrar hooks em `.claude/settings.json` array `hooks.PreToolUse`
- Instalar `@eslint-community/eslint-plugin-eslint-comments`:
  - `linterOptions: { reportUnusedDisableDirectives: 'error', noInlineConfig: true }`
  - `require-description: error`
  - `no-unused-disable: error`
  - `no-use: error`
- **ADR-0036** "Hooks PreToolUse JSON output + ESLint comments plugin"

### Validação Fase 1

- Smoke `protect-eslint.sh`: tentar editar `eslint.config.mjs` → bloqueado
- Smoke `block-disable-content.sh`: tentar criar arquivo com `// eslint-disable-next-line` → bloqueado
- Smoke `component-research-gate.sh`: tentar criar `components/test.tsx` sem marker → bloqueado
- Batch 1 paralelo (10 comandos) → 10/10 verde

### Commit

```
chore: phase a final f1 — hooks json output + eslint comments (adr-0036)
```

---

## Fase 2 — shadcn MCP + wrapper pattern

**Estimativa:** ~half-day

### Entregáveis

- `claude mcp add shadcn` — habilitar `mcp__shadcn__list-components`, `mcp__shadcn__search`
- Skill `shadcn/ui` instalada (se disponível formato canônico)
- Wrapper pattern obrigatório: customização vai em `components/app-*.tsx`, **nunca** editar `components/ui/*.tsx` direto
- Auditar `components/ui/` — reverter via `npx shadcn add <component>` se alguém editou primitive direto; migrar customização pra wrapper
- `.claude/rules/components.md` atualizada (carregamento via `paths:` em `components/**`, `features/**/components/**`, `lib/**/components/**`) com:
  - Checklist obrigatório antes de Write
  - Hierarquia granular: blocks shadcn → primitives shadcn → `@origin-ui/*` → `@kibo-ui/*` → `@billingsdk/*` → `@aceternity/*` → `@reui/*` → `@tremor/*` → custom
  - Marker obrigatório linha 1: `// RESEARCH: <fonte> [link/justificativa]`
  - Wrapper pattern explicado
- **ADR-0037** "Wrapper pattern + hierarquia registries granular" (atualiza ADR-0008)

### Validação Fase 2

- `mcp__shadcn__list-components` retorna lista
- `.claude/rules/components.md` carrega quando edita `components/**`
- Batch 1 verde

### Commit

```
chore: phase a final f2 — shadcn mcp + wrapper pattern (adr-0037)
```

---

## Fase 3 — Storybook 10 substitui Ladle

**Estimativa:** ~3h

### Entregáveis

- Uninstall `@ladle/react` + remover `.ladle/` + remover scripts `ladle:*` do `package.json`
- Install Storybook 10:
  - `pnpm dlx storybook@latest init --type nextjs --features docs`
  - `pnpm add -D @storybook/addon-a11y @storybook/addon-interactions`
- `claude mcp add storybook` — habilitar `mcp__storybook__list-components`
- Migrar stories triviais existentes (poucas, foi setup minimal)
- Chromatic config placeholder:
  - `pnpm add -D chromatic`
  - `.github/workflows/chromatic.yml` placeholder (token via GitHub secret depois)
- **ADR-0038** "Storybook 10 substitui Ladle" (supersede ADR-0013)

### Razão (resumo)

Storybook tem **MCP server oficial** — Claude descobre componentes via MCP em vez
de grep manual. Ladle ganha em cold start (1.2s vs 8s) mas perde ecossistema:
sem MCP, sem Chromatic, sem addons. Pra solo + IA, MCP > velocidade.

### Validação Fase 3

- `pnpm storybook` sobe sem erro
- `mcp__storybook__list-components` retorna stories existentes
- Batch 1 verde (sem comandos `ladle:*` em `package.json`)

### Commit

```
chore: phase a final f3 — storybook 10 substitui ladle (adr-0038)
```

---

## Fase 4 — Makerkit entitlements recipe

**Estimativa:** ~3-4h

### Entregáveis

- Migration `0009_makerkit_entitlements`:
  - Tabelas: `public.feature_usage (tenant_id fk, feature_key, used int, period_start, period_end)`
  - Decisão: manter `public.plans` com `features jsonb` OU adotar `public.plan_features (plan_id fk, feature_key, limit jsonb)` (definir durante execução)
  - RPCs: `public.can_use_feature(tenant_id, feature text) returns boolean`, `public.get_entitlement(tenant_id, feature) returns jsonb`, `public.increment_feature_usage(tenant_id, feature, amount int)`
  - Trigger autocria `feature_usage` row no tenant create
  - RLS: `feature_usage` policy tenant-scoped
- Reescrever `lib/entitlements/server.ts`:
  - Substituir lookup direto + cache TTL por chamadas RPC
  - Funções: `canUseFeature`, `requireEntitlement`, `getEntitlement`, `incrementFeatureUsage`
- Adaptar `EntitlementProvider` + `lib/contracts/entitlements.ts`:
  - Provider recebe snapshot via RPC `get_all_entitlements(tenant_id)` no layout server
- **ADR-0039** "Makerkit entitlements recipe" (supersede arquitetura de ADR-0034 — mantém vertical slice + plan-gates.ts pattern)

### Razão (resumo)

Lógica em **RPC PostgreSQL** = atomic, não bypass-able pelo client. `feature_usage`
table pra tracking de quotas (vamos precisar quando 1ª quota chegar:
`max_programs`, `max_clients`). Padrão validado por dezenas de clientes Makerkit.

### Validação Fase 4

- Smoke: tenant sem subscription → `canUseFeature('chatbot')` retorna false
- Smoke: tenant Pacote C → `canUseFeature('chatbot')` retorna true
- Smoke: `incrementFeatureUsage('programs_created', 1)` incrementa `feature_usage`
- Batch 1 verde

### Commit

```
chore: phase a final f4 — makerkit entitlements recipe (adr-0039)
```

---

## Fase 5 — Cleanup docs + ressalvas backlog

**Estimativa:** ~2h (paralelo)

### Entregáveis

- Atualizar `CLAUDE.md` com seções: hooks JSON output, wrapper pattern, hierarquia registries granular, Storybook em vez de Ladle, RPCs entitlements
- Atualizar `docs/blueprint/15-bootstrap-checklist.md` Tarefa 25.5 com novo escopo (Makerkit RPCs em vez de impl custom)
- Atualizar `docs/blueprint/13-lint-enforcement.md` se necessário (eslint-comments plugin + noInlineConfig)
- Resolve 2 ressalvas backlog anotadas em Phase A pré-pesquisa:
  - **Ressalva 1 (§9 seeds):** auditar se `lib/design/seeds/*.ts` está em arquivo único gigante. Se separados, remover override §9 de `eslint.config.mjs`
  - **Ressalva 2 (§10 RouteProvider):** trocar `throw new Error()` por `throw AppError.providerMissing('RouteProvider')` factory de `lib/contracts/errors.ts`. Se passar, remover override §10
- Atualizar `CHANGELOG.md [Unreleased]` com 5 entries consolidando Fases 1-5
- Regenerar índices:
  - `pnpm adr:index` → ~39 ADRs
  - `pnpm docs:validate` → 0 inconsistências
  - `pnpm docs:status` → snapshot atualizado
- Atualizar `docs/_status.md` final marcando Phase A 100% closed

### Validação Fase 5

- 4 commits Phase A pré-pesquisa + 5 commits Phase A Final no histórico
- Batch 1 verde
- Phase A status no `_status.md`: closed definitivo

### Commit

```
chore: phase a final f5 — cleanup docs + backlog ressalvas resolvidas
```

---

## Regras globais de execução

1. **Cada fase termina com Batch 1 verde** (10 comandos). Se quebrar, PARA e reporta.
2. **Commits semânticos lowercase** (commitlint enforce).
3. **Não pular fase.** Ordem importa:
   - Fase 1 trava futuras (hooks bloqueando incidente repetir)
   - Fase 2 habilita pesquisa via MCP
   - Fase 3 substitui catálogo
   - Fase 4 reescreve entitlements
   - Fase 5 limpa + documenta
4. **Princípio §39 mantido**: NÃO criar componentes UX, mesmo agora que tem MCP. Defer JIT continua valendo.
5. **ADRs novos (0036/0037/0038/0039) seguem Michael Nygard** (ADR-0017 template).
6. **Reporta progresso por fase** — não espera todas pra reportar.
7. **Conflito com decisão anterior** = PARA e pergunta — não decide unilateral.

---

## Decisões antecipadas (vão virar ADRs durante execução)

### ADR-0036 — Hooks PreToolUse JSON output + ESLint comments plugin

Razão: bug `anthropics/claude-code#13744` (exit 2 não bloqueia confiavelmente).
Adiciona @eslint-community/eslint-plugin-eslint-comments pra reforçar zero
disable.

### ADR-0037 — Wrapper pattern + hierarquia registries granular

Atualiza ADR-0008. Estabelece `components/app-*.tsx` como obrigatório pra
customização (nunca editar `components/ui/*` direto). Hierarquia explícita:
shadcn blocks → primitives → @origin-ui → @kibo-ui → @billingsdk → @aceternity →
@reui → @tremor → custom.

### ADR-0038 — Storybook 10 substitui Ladle

Supersede ADR-0013. Razão: MCP server oficial Storybook (Ladle não tem) habilita
catalog discovery via Claude Code. Trade-off de cold start (8s vs 1.2s)
aceitável.

### ADR-0039 — Makerkit entitlements recipe

Supersede arquitetura de ADR-0034 (mantém vertical slice + plan-gates.ts pattern,
substitui apenas implementação `lib/entitlements/server.ts`). Razão: lógica RPC
atomic em PostgreSQL, padrão validado, tracking quota via `feature_usage` table.

---

## Decisões mantidas (não mudam)

- **Schema único `public.*`** (ADR-0033) — pesquisa não toca
- **Vertical slice `features/<name>/`** (ADR-0034) — pesquisa confirma
- **ADRs Michael Nygard** (ADR-0017) — 35 ADRs já escritos, MADR não justifica troca
- **Tailwind v4 `@theme inline` + CSS vars via API route** (D-G59) — pesquisa confirma
- **Princípio §39 (defer JIT)** — pesquisa confirma via Fowler/Yagni
- **Componentes UX deferidos JIT** — pesquisa confirma textualmente

---

## Referências

- `docs/research/17-guardrails-ia-shadcn-governanca.md` — pesquisa completa
- `docs/adr/0033-consolidate-platform-to-public.md`
- `docs/adr/0034-vertical-slice-features-entitlements.md`
- `docs/adr/0035-feature-gating-ux-pattern.md`
- `docs/blueprint/15-bootstrap-checklist.md` §25.5 (será atualizado na Fase 5)
- `docs/blueprint/13-lint-enforcement.md` (será atualizado na Fase 1 — eslint-comments plugin)
- `docs/blueprint/11-roadmap.md` §2 M0 (será atualizado pra incluir Phase A Final como pré-requisito)
- `INSTALL-MANIFEST.md` (será atualizado pra incluir Phase A Final entre Fase 7 e 8)
- Issue `anthropics/claude-code#13744` (bug exit 2)
- Caso público: Alex Brohshtut (Medium 22-jan-2026)

## Continuação pós-Fase 5 — conexão com Caminho 1

Após Phase A Final 100% closed, **próxima sessão** retoma Caminho 1 (Checklist 15 do `docs/blueprint/15-bootstrap-checklist.md`) começando pela **Tarefa 14 (Motion presets)**.

### Tarefas do Checklist 15 que MUDAM por causa da Phase A Final

| Tarefa                                                                        | Mudança causada                                                                                                                                                                                                                                     |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **14** Motion presets `lib/design/motion.ts`                                  | Sem mudança — segue ADR-0014                                                                                                                                                                                                                        |
| **15** APCA helper runtime `lib/design/contrast.ts`                           | Sem mudança                                                                                                                                                                                                                                         |
| **17-20** Primitives premium (Skeleton/Surface/Lucide/Sonner/vaul/safe areas) | **Aplica wrapper pattern** (ADR-0037 F2) — customização em `components/app-*.tsx`, nunca editar `components/ui/*` direto. Adiciona marker `// RESEARCH:` linha 1.                                                                                   |
| **22** NumberTicker + InnerGlow + HeaderBlur                                  | Idem 17-20                                                                                                                                                                                                                                          |
| **23** Avatar + blurhash                                                      | Idem                                                                                                                                                                                                                                                |
| **24** Install banner + Logo system                                           | Idem                                                                                                                                                                                                                                                |
| **25.5** Vertical slice + entitlements                                        | **Já parcialmente feita** em Phase A pré-pesquisa (commits `a94a8bf`/`4be49e3`/`27be5ee`). Phase A Final F4 reescreve `lib/entitlements/*` pra Makerkit RPCs — Tarefa 25.5 vira "criar `features/<name>/` real usando MCP shadcn + plan-gates JIT". |
| **26** `lib/contracts/` SSOT                                                  | Sem mudança — segue D-G55                                                                                                                                                                                                                           |
| **27** CLAUDE.md root + `.claude/rules/*`                                     | **Atualizada em Phase A Final F5** — verificar diff antes de tocar                                                                                                                                                                                  |
| **28** 3 hooks Claude Code dia 0                                              | **Substituída por Phase A Final F1** (6 hooks no total, JSON output) — marcar done                                                                                                                                                                  |
| **29** Ladle setup + stories                                                  | **Substituída por Phase A Final F3** — Storybook 10 + MCP. Renomear pra "Storybook setup + 15 stories"                                                                                                                                              |
| **30** Primeiro commit `bootstrap dia 0 ~70h`                                 | Mantém — vira commit final de Bloco 6                                                                                                                                                                                                               |

### Sequência pós-Phase-A-Final

```
Sessão atual:  Phase A Final F1 → F2 → F3 → F4 → F5 (~2-3 dias)
Sessão N+1:    Tarefa 14 (Motion presets) — ~2h
Sessão N+2:    Tarefa 15 (APCA helper runtime) — ~6h
Sessão N+3:    Bloco 4 (Tarefas 17-20) — ~17h
Sessão N+4:    Bloco 5 (Tarefas 22-24) — ~13h
Sessão N+5:    Bloco 6 (Tarefas 26-30 ajustadas) — ~7h
Sessão N+6:    INSTALL-MANIFEST Fases 4-8 (Vercel + GitHub + VAPID + Validação + Commit final)
               → M0 fecha → começa M1 (funil agência)
```

### O que NÃO precisa re-executar (já feito ou substituído)

- ~~Tarefa 25 (Schema baseline `0001_initial`)~~ — feita em commits `95a092d` + `f66e91f` (consolidação)
- ~~Tarefa 25.5 base estrutural~~ — feita em commits `a94a8bf` + `4be49e3` + `27be5ee`
- ~~Tarefa 28 (3 hooks Claude Code dia 0)~~ — substituída por Phase A Final F1 (6 hooks)
- ~~Tarefa 29 base (Ladle setup)~~ — substituída por Phase A Final F3 (Storybook)

### Sinal de "Phase A Final realmente fechou"

`docs/_status.md` mostra:

```
Phase A status: closed definitivo (9 commits no total: 6 Phase A pré-pesquisa + 5 Phase A Final, minus 2 que viram parte do mesmo histórico)
ADRs: 39 (0036/0037/0038/0039 criados)
Migrations: 9 aplicadas (0001-0008 + 0009 Makerkit)
Próxima tarefa: Tarefa 14 — Motion presets
```

Quando você (fundador) ver isso no `_status.md`, abre nova sessão no platform/ e cola:

```
Phase A Final CLOSED. Próxima tarefa: 14 — Motion presets em lib/design/motion.ts.
Specs em docs/blueprint/15-bootstrap-checklist.md §14.
Stack: motion 12 (motion/react). 6 durations + 5 easings + 4 springs.
```

---

## Histórico

| Data       | Mudança                                                                                                                                                                                           | Aprovador |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 2026-05-18 | Plano inicial pós-pesquisa, 5 fases consolidadas                                                                                                                                                  | Leandro   |
| 2026-05-18 | Fase 1 corrigida: só `block-disables.sh` migra (único PreToolUse), UserPromptSubmit/SessionStart não sofrem do bug. Seção "Continuação pós-Fase 5" adicionada conectando ao Caminho 1 + Tarefa 14 | Leandro   |
