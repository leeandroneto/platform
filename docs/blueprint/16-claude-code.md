# 16 — Claude Code Setup

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Template `CLAUDE.md` root + `.claude/rules/*` carregadas por `paths:` + 3 hooks dia 0 + memory pattern.
> Origem: pesquisa 04 (regras/contratos Claude Code) + Research C (memória D-G60) + decisão `_CONFLITOS #18`.

---

## 1. Princípio: 3 camadas de contexto

Claude Code carrega contexto em ordem:

1. **`CLAUDE.md` root** (<200 linhas) — visão geral, sempre carregado em toda sessão
2. **`.claude/rules/<topic>.md`** — frontmatter `paths:` carrega só quando editor abre file que casa
3. **`docs/adr/*.md`** — buscado via grep on-demand pela decisão

Memórias (`~/.claude/projects/<hash>/memory/`) complementam mas não são fonte arquitetural (ver `14-docs-lifecycle.md §1`).

---

## 2. `CLAUDE.md` root (template <200 linhas)

````markdown
# Claude — contexto do projeto desafit.app

> Carregado no início de toda sessão. **Mantenha curto e atualizado.**
> Última atualização: YYYY-MM-DD

---

## Projeto

**desafit.app** — SaaS B2B white-label PWA para profissionais de saúde/fitness
criarem, venderem e operarem programas e desafios online com suporte de IA.
Mercado inicial: Brasil, musculação. **Fase atual:** agência (done-for-you);
SaaS self-service M5+ (ano 2).

**Marca pai:** identidade comercial (footer/about/legal). Zero tech dia 1.
Schema base é multi-marca: `desafit.app` + `yoga.app` futuro + `ingles.app`
futuro compartilham o mesmo schema `public.*`.

Identidade completa, decisões, modelo multi-tenant: `docs/blueprint/00-PROJETO.md`.

---

## Onde fica cada coisa

| Info                            | Arquivo canônico                  |
| ------------------------------- | --------------------------------- |
| Regras code carregadas por path | `.claude/rules/*.md`              |
| Constituição imutável           | `docs/blueprint/00-PROJETO.md`    |
| Decisões fechadas (ADRs)        | `docs/adr/NNNN-*.md`              |
| Blueprints técnicos             | `docs/blueprint/NN-*.md`          |
| Schema banco                    | `docs/blueprint/06-data-model.md` |
| Histórico arquivado             | `docs/_archive/` (referência JIT) |

Conflito entre docs → ADR > Blueprint > Master Plan (arquivado) > Memória.

---

## Stack travado (não bumpar major sem ADR)

Next 16 (App Router, Turbopack, `proxy.ts`) · React 19 · Tailwind v4
(`@theme` OKLCH) · shadcn new-york dark-first · Motion 12 (`motion/react`,
NUNCA `framer-motion`) · Supabase `@supabase/ssr` 0.10 · Zod 4 + RHF 7 ·
next-intl 4 · pnpm 10 · Geist · Vitest · Playwright · Ladle.

---

## Schemas separados (regra crítica)

- `public.*` — compartilhado (auth, system)
- `public.*` — multi-marca multi-vertical (produto principal)
- `onboarding.*` — legado pausado (NÃO usado no desafit greenfield)

Em data layer: `client.schema('platform').from('programs')`. `public` é default.
Detalhes: `.claude/rules/schema-separation.md`.

---

## Camadas (resumo)

`lib/contracts/` SSOT Zod + Result + AppError · `lib/domain/` lógica pura ·
`lib/data/` IO Supabase, lança erro · `lib/hooks/` estado React ·
`lib/services/` **vazio por design** · `supabase/functions/` Deno ·
`app/<route>/actions.ts` `{ok,data}|{ok,error}` · `app/`+`components/` UI
(RSC default).

Dependência desce, nunca sobe. Detalhes: `.claude/rules/layers.md`.

---

## Regras críticas (toda sessão)

- **JWT claims:** RLS usa `auth.jwt() ->> 'tenant_id'` (nunca recriar helper)
- **Migrations:** via `mcp__supabase__apply_migration`. Nunca .sql manual.
- **Erros:** `lib/data/` e `lib/domain/` lançam · server actions retornam `{ok}`
- **Env:** `import { env } from '@/lib/env'` (exceto `NEXT_PUBLIC_*` em client)
- **Componentes:** <300 linhas, RSC default, nunca `createClient()` direto
- **Nomenclatura:** DB+code+folders EN; URL+UI PT-BR (via `t()` next-intl)
- **Vocab banido:** ver `.claude/rules/naming.md` antes de qualquer code

---

## Test e build

```bash
pnpm typecheck          # 0 erros
pnpm vitest run         # 100%
pnpm lint --max-warnings 0   # 0/0
pnpm build              # verde
```
````

Antes de PR: rodar os 4 acima.

---

## Abstrações disponíveis (use antes de criar)

`useServerAction(action)` · `CopyButton`/`useCopy` · `ok()`/`fail()` ·
`renderEmail(el)`. Lista completa: `.claude/rules/abstractions.md`.

Criar abstração nova: 3+ usos + ADR (pesquisa 04 + `_CONFLITOS #18`).

````

Total target: <200 linhas. Updates após cada ADR-significativo. PR muda contexto pra TODA sessão futura — diff explícito no PR description.

---

## 3. `.claude/rules/*.md` (lista mínima dia 0)

8 arquivos, cada um com frontmatter `paths:` que ativa carregamento quando Claude edita ficheiro que casa.

### 3.1 `.claude/rules/naming.md`

```yaml
---
name: Naming + vocab banido
description: Convenções de naming + vocab proibido (16 termos)
paths:
  - "app/**/*.{ts,tsx}"
  - "components/**/*.{ts,tsx}"
  - "lib/**/*.ts"
  - "supabase/**/*.{ts,sql}"
  - "messages/**/*.json"
---
````

Conteúdo: tabela language-per-layer + tabela 16 termos banidos com substituto canônico. Mesma fonte de `03-naming-vocab.md`.

### 3.2 `.claude/rules/layers.md`

```yaml
---
name: Camadas + Sheriff boundaries
description: Domain→Data→Hooks→UI, dependência desce nunca sobe
paths:
  - 'lib/**/*.ts'
  - 'app/**/*.{ts,tsx}'
  - 'components/**/*.{ts,tsx}'
---
```

Conteúdo: tabela de camadas + regras de import (referência `04-camadas-imports.md`).

### 3.3 `.claude/rules/abstractions.md`

```yaml
---
name: Abstrações disponíveis + quando criar nova
description: Use existente antes de criar. 3+ usos + ADR antes de abstrair.
paths:
  - 'lib/**/*.ts'
  - 'components/**/*.tsx'
---
```

Conteúdo: lista abstrações + regra "3+ usos similares + ADR".

### 3.4 `.claude/rules/domain-logic.md`

```yaml
---
name: Domain layer rules
description: Lógica pura, zero IO, .test.ts obrigatório
paths:
  - 'lib/domain/**/*.ts'
---
```

Conteúdo: zero `import 'react'`, zero `supabase`, `.test.ts` obrigatório, ≤200 linhas por arquivo.

### 3.5 `.claude/rules/schema-separation.md`

```yaml
---
name: Schemas separados public/platform/onboarding
description: core = multi-marca; onboarding = legado pausado
paths:
  - 'lib/data/**/*.ts'
  - 'supabase/**/*.sql'
---
```

Conteúdo: `client.schema('platform').from('programs')`. Nunca `client.from('platform.programs')`. `onboarding.*` intacto pausado — NÃO importar no desafit greenfield.

### 3.6 `.claude/rules/jwt-claims.md`

```yaml
---
name: JWT claims + RLS pattern
description: auth.jwt() ->> 'tenant_id' + RLS wrap (select ...) 100× speedup
paths:
  - 'supabase/migrations/**/*.sql'
  - 'lib/data/**/*.ts'
---
```

Conteúdo: nunca recriar `current_professional_id()`; role do aluno é `client` (NUNCA `student`); pattern `(select public.current_tenant_id())` wrap.

### 3.7 `.claude/rules/data-layer.md`

```yaml
---
name: Data layer rules
description: function(client, ...args), lança erro, sem React
paths:
  - 'lib/data/**/*.ts'
  - 'app/**/actions.ts'
---
```

Conteúdo:

- Assinatura: `export async function fnName(client: SupabaseClient, ...args)`
- Lança `AppError` em vez de retornar `{ ok }` (Result type é em Server Action)
- Zero JSX, zero hooks, zero `'use client'`
- Funções unitárias ≤60 linhas

### 3.8 `.claude/rules/server-actions.md`

```yaml
---
name: Server Actions
description: { ok, data } | { ok: false, error }, chama lib/data/
paths:
  - "app/**/actions.ts"
---
```

Conteúdo: `'use server'` no topo, return `Result<T, AppError>`, chama `lib/data/` passando client, captura erro em `try/catch` retornando `fail(err)`.

---

## 4. 6 Hooks Claude Code dia 0 (atualizado 2026-05-18)

Configurados em `.claude/hooks/*` + `settings.json` referenciando triggers. Lista atual reflete evolução pós ADR-0036 (JSON output stdout) + Phase A Final F1/F2 + ADR-0040.

**PreToolUse (gate determinístico — bloqueia se violação):**

- `protect-eslint.sh` — Edit/Write em `eslint.config.*` exige marker `ADR-NNNN` no diff + arquivo ADR existir em `docs/adr/`. Evolução 2026-05-18 (incidente `7818df1` motivou).
- `block-token-bypass.sh` — bloqueia `#hex`, `rgba(`, classes Tailwind arbitrary `[#...]` em `.ts/.tsx` (allowlist: `globals.css`, `app/api/.../theme.css/route.ts`, JSX em ImageResponse Satori build-time).
- `component-research-gate.sh` — bloqueia Write/Edit em `components/ui/**`, `features/<f>/components/**`, `lib/<area>/components/**` sem marker `// RESEARCH:` linha 1. Reforça zona quarentenada (ADR-0040 §A/§C).

**PostToolUse (efeito colateral — não bloqueia):**

- `post-shadcn-add.sh` — após Bash `shadcn add`, injeta checklist 6 passos via stderr (ADR-0040 §D).
- `format-on-write.sh` — após Write/Edit, roda `pnpm prettier --write <file>`.

**SessionStart:**

- `load-context.sh` — imprime resumo curto (vocab banido, schema único `public.*`, ADR-0040 fechamento dia 0, plano ativo, hierarquia conflito).

**UserPromptSubmit:** (descontinuado dia 0 — `load-context.sh` cobre via session reminder + vocab vai capturado por ESLint pré-commit; reintroduzir se vocab violations recorrentes em prompt)

### 4.1 `SessionStart` — carrega contexto crítico

**Trigger:** abertura de cada sessão Claude Code.

**Ação:** lê CLAUDE.md root + injeta na conversa breve resumo: "vocab banido = 16 termos (ver `.claude/rules/naming.md`). schema = platform.\* (ADR-0025). decisões = docs/adr/."

**Implementação:** script bash echoing texto curto pro stdout do hook.

### 4.2 `UserPromptSubmit` — warn vocab banido em prompts

**Trigger:** toda mensagem do user.

**Ação:** grep do prompt contra lista de 16 termos banidos. Se hit: imprime warning "Termo banido detectado: '<termo>'. Substituto: '<canônico>'. Confirma uso ou reformula?". Não bloqueia (warning soft).

**Implementação:** script bash com grep + lookup table termo→substituto.

### 4.3 `PreToolUse Write/Edit` — bloquear hex/rgba/strings inline

**Trigger:** antes de Write ou Edit em files de `app/`, `components/`, `lib/`.

**Ação:** grep do conteúdo proposto contra:

- `#[0-9a-f]{3,8}` (hex literal)
- `rgba?\(` (rgb literal)
- JSX text node literal sem `t()` wrapper

Se hit: aborta tool call com mensagem "token bypass detectado / i18n hardcoded detectado em <line N>". Força Claude a corrigir antes de gravar.

**Implementação:** script Python ou Bash + regex. Output JSON `{"continue": false, "stopReason": "<msg>"}` faz Claude abortar.

---

## 5. Memory pattern (`~/.claude/projects/<repo-hash>/memory/`)

(Reforço `14-docs-lifecycle.md §10`)

**Estrutura:**

- `MEMORY.md` — índice (1 linha por memória)
- `user_*.md` — perfil fundador
- `feedback_*.md` — guidance preferences
- `project_*.md` — contexto evolutivo do projeto
- `reference_*.md` — pointers external (Linear, dashboards)
- `audit_*.md` — reusable prompts

**Lifecycle:**

- Auto-update por Claude Code conforme conversação
- Revisão semestral pelo fundador (limpar memórias obsoletas)
- Repo desafit greenfield NASCE com memória virgem (decisão CHUNK 7 transferência) — memória do `onboarding-bio` NÃO migra
- Vocab banido + decisões + padrões vivem em CLAUDE.md + .claude/rules/\* + ADRs, **NÃO** em memória (memória é volátil, fonte de verdade não pode ser)

---

## 6. Custom agents (opcional, dia 0+30d)

Não criar dia 0. Adicionar conforme dor real (princípio §39).

Candidatos avaliados pós-bootstrap:

- **`code-reviewer`** — Sonnet 4.6, prompt focado em "audit boundary violations + token bypass + vocab + APCA"
- **`audit-vocab`** — Haiku 4.5, prompt focado em scan rápido vocab banido pre-commit
- **`audit-tokens`** — Haiku 4.5, scan hex/rgba/var inline
- **`adr-drafter`** — Sonnet 4.6, helper pra estruturar ADR Michael Nygard a partir de descrição informal

Criar cada um exige: justificativa em ADR + ≥3 usos por semana medidos antes de promover de experimental a permanente.

---

## 7. Custom skills (opcional)

Não criar dia 0. Avaliar quando workflow repetir 5+ vezes:

- `bootstrap-edge-function` — scaffold de Edge Function Deno + AI Gateway + Zod schema + Promptfoo CI
- `bootstrap-server-action` — scaffold de Server Action + Zod input + Result return + Vitest
- `migrate-table` — wizard pra criar migration `mcp__supabase__apply_migration` com RLS pattern + indexes

---

## 8. MCPs configurados dia 0 (estado atual `.mcp.json`)

- **shadcn MCP** — `mcp__shadcn__*` pra add components, audit, listar registries (stdio)
- **Context7 MCP** — `mcp__context7__*` pra fetch docs atuais (stdio)
- **Storybook MCP** — HTTP `localhost:6006/mcp` quando Storybook dev rodando (ADR-0038). Expõe stories como catálogo Claude/Cursor.

**MCPs disponíveis via plugin (não em `.mcp.json` local, vêm do ambiente):**

- **Supabase MCP** — `mcp__plugin_supabase_supabase__*` pra `apply_migration`, `list_tables`, `get_logs`, `execute_sql`, `generate_typescript_types`
- **Vercel MCP** — `mcp__plugin_vercel_vercel__*` pra deploy, logs, env vars

Configuração em `.mcp.json` (root do repo, versionado).

## 8.1 `.claude/rules/*.md` (estado atual 2026-05-18)

15 rules path-loaded via frontmatter `paths:`. Lista canônica (substitui §3 quando contradição):

**Padrões de código (path-loaded):**

- `naming` · `abstractions` · `layers` · `data-layer` · `domain-logic` · `server-actions` · `features` · `jwt-claims` · `components`

**ADR-0040 §L (fechamento dia 0 — cada uma tem "Condição de revisitar"):**

- `i18n` · `contrast` · `shadcn-zone` · `design-tokens` · `brand` · `entitlements`

**Adições pós ADR-0040:**

- `tenant-content` — hierarquia 4 níveis copy/landing (decisão: template+slots dia 0; block builder JIT)
- `design-references` — 71 DESIGN.md em `docs/references/design-systems/` (mood/density APENAS — NUNCA tokens literais)

## 8.2 ADRs relevantes dia 0

- ADR-0033 — schema único `public.*`
- ADR-0034 — vertical slice + entitlements model (arquitetura supersedida por ADR-0039 mas tipos mantidos)
- ADR-0036 — hooks JSON output stdout (bug anthropics/claude-code#13744 contornado)
- ADR-0037 — wrapper pattern + hierarquia registries
- ADR-0038 — Storybook 10 supersede Ladle
- ADR-0039 — Makerkit RPCs entitlements
- ADR-0040 — fechamento dia 0 (shadcn-zone + i18n + APCA Silver — 12 §A-§L)
- ADR-0042 — elevation tokens 3 níveis

---

## 9. Settings essenciais (`.claude/settings.json`)

```jsonc
{
  "permissions": {
    "allow": [
      "Bash(pnpm:*)",
      "Bash(git:*)",
      "Bash(gh:*)",
      "Edit(*)",
      "Write(*)",
      "mcp__supabase__*",
      "mcp__shadcn__*",
      "mcp__context7__*",
    ],
    "deny": ["Bash(rm -rf:*)", "Bash(git push --force:*)", "Edit(.env*)"],
  },
  "hooks": {
    "SessionStart": ".claude/hooks/load-context.sh",
    "UserPromptSubmit": ".claude/hooks/vocab-warn.sh",
    "PreToolUse": {
      "Write": ".claude/hooks/block-token-bypass.sh",
      "Edit": ".claude/hooks/block-token-bypass.sh",
    },
  },
}
```

---

## 10. Anti-patterns a evitar

- **Inflar CLAUDE.md** com regra de detalhe — vai pra `.claude/rules/<topic>.md` específica
- **Memória como source of truth** — memória é contexto, não regra. Regra vai em ADR ou `.claude/rules/*`
- **Hook que bloqueia silenciosamente** — sempre output `stopReason` claro
- **Hook caro (>500ms)** — não rodar lint completo em PreToolUse; só grep barato
- **MCPs auth-required sem credenciais env** — falha do init = ruído de sessão
- **Custom agents/skills criados antes de dor real** — princípio §39 mesmo pra ferramenta interna
- **CLAUDE.md desatualizado** — quando ADR muda decisão, atualizar CLAUDE.md no mesmo PR

---

## 11. Referências cruzadas

- `00-PROJETO.md` §6 (regras code) · §8 (princípio universal busca)
- `_CONFLITOS.md` #12 (lint enforcement) · #17 (ADR) · #18 (hierarquia verdade) · #21 (schema core)
- `13-lint-enforcement.md` (hook block-token-bypass alinha com ESLint dia 0; renomeado em ADR-0036)
- `14-docs-lifecycle.md` §6 (`.claude/rules/*` via paths) · §7 (CLAUDE.md <200) · §10 (memória)
- `15-bootstrap-checklist.md` tarefas 27, 28 (criação CLAUDE.md + hooks)
- `17-repo-bootstrap.md` (setup hooks no repo novo)
- `18-transferencia.md` (memória NÃO migra)
- Pesquisa 04 (regras/contratos Claude Code)
- Memórias: D-G60 (CLAUDE.md <200 + paths + 3 hooks)

## Histórico

| Data       | Mudança                                                                  | Aprovador |
| ---------- | ------------------------------------------------------------------------ | --------- |
| 2026-05-17 | Versão inicial — CLAUDE.md template + 8 rules + 3 hooks + memory pattern | Leandro   |
