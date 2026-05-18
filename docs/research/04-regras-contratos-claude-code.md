# Pesquisa Profunda — Developer Experience & Workflow com Claude Code para `desafit.app`

> **Stack alvo:** Next.js 15/16 + React 19 + TypeScript 5.x strict + Tailwind v4 + shadcn/ui (new-york) + Supabase (Postgres + RLS + Edge Functions) + Zod 4 + react-hook-form + next-intl 4 + Motion 12 + Vitest + Playwright + pnpm + Vercel.
> **Persona:** solo founder, 100% trabalhando via Claude Code.
> **Princípio guia:** cada guardrail abaixo é classificado **[E] essencial dia 1**, **[I] incremental**, ou **[O] over para greenfield solo**. As 6 dores listadas no contexto (refator de 150-170h, ~830 `eslint-disable`, 30+ camadas, 10 decisões revertidas, vocabulário inconsistente, drift CLAUDE.md ↔ código) são endereçadas explicitamente em cada seção e consolidadas na tabela final.

---

## SEÇÃO 1 — Claude Code: best practices oficiais (2025/2026)

### 1.1 Estrutura do `CLAUDE.md` raiz

A doc oficial (`code.claude.com/docs/en/best-practices`) e o post oficial "How Claude Code works in large codebases" (`claude.com/blog/how-claude-code-works-in-large-codebases-best-practices-and-where-to-start`) convergem em três regras:

1. **Curto e humano**: para cada linha, pergunte "removendo isto, o Claude erra?". Se não, corte. Posts oficiais e da comunidade citam que **arquivos inflados fazem o Claude ignorar instruções reais**, porque LLMs frontier seguem com confiabilidade ~150-200 instruções, e o system prompt do Claude Code já consome ~50 dessas (HumanLayer, "Writing a good CLAUDE.md", Nov 25 2025 — `humanlayer.dev/blog/writing-a-good-claude-md`). Alvo prático: **< 200 linhas** (Ran the Builder, 2026 — `ranthebuilder.cloud/blog/claude-code-best-practices-lessons-from-real-projects`).
2. **Estrutura WHAT → HOW → conventions → references**: TurboDocx (`turbodocx.com/blog/how-to-write-claude-md-best-practices`) recomenda: contexto curto → comandos essenciais → mapa de pastas → convenções não-defaults → links `@docs/...` com "Read when: ..." (progressive disclosure oficial).
3. **`@imports` para descarregar contexto sob demanda**: a sintaxe `@path/to/file.md` é nativa e suporta `@~/.claude/my-project-instructions.md` para overrides pessoais (`code.claude.com/docs/en/best-practices`).

**Estrutura canônica recomendada para `desafit.app`** (arquivo de ~120 linhas):

```md
# desafit.app — Project Context for Claude Code

## Stack (canonical, do NOT swap without ADR)

- Runtime: Next.js 15/16 App Router · React 19 · TypeScript 5.x strict
- UI: Tailwind v4 (CSS-first @theme) · shadcn/ui new-york · Motion 12 (NOT framer-motion)
- Data: Supabase (Postgres + RLS) · Zod 4 schemas · react-hook-form
- Tooling: pnpm · Vitest · Playwright · next-intl 4

## Vocabulary (single source of truth)

- Use English-only identifiers. Approved domain terms:
  workout, plan, exercise, athlete, coach, session, set, rep
- BANNED (legacy from previous project): intake, wizard, student, trainer
- BANNED tooling: framer-motion (use motion), npm/yarn (use pnpm)

## Commands

- pnpm dev / pnpm build / pnpm typecheck / pnpm lint / pnpm test / pnpm e2e
- pnpm db:types — regenerates lib/supabase/types.gen.ts

## Architecture rules (enforced by ESLint + Sheriff)

- Server Component is the default. `'use client'` requires justification.
- All mutations go through Server Actions returning `Result<T, E>`.
- No `createClient()` outside `lib/supabase/*`.
- No arbitrary Tailwind values (`bg-[#abc]`). Add tokens to `app/globals.css @theme`.

## Workflow

- Plan first (Shift+Tab) for any change > 1 file.
- Run `pnpm typecheck && pnpm lint` after series of edits, before claiming done.
- NEVER add `eslint-disable` inline. If a rule is wrong, open ADR.

## References (load on demand)

- @docs/adr/INDEX.md — Architecture decisions (read when: changing patterns)
- @docs/supabase.md — RLS + types (read when: touching lib/supabase or db)
- @.claude/rules/ — contextual rules (auto-loaded by paths)
```

**O que NÃO incluir** (consenso oficial + comunidade): tutoriais longos sobre features, código duplicado do `package.json`, prompt persona/role-play, valores secretos. Migrar instruções de domínio específico para `.claude/rules/*.md` ou `.claude/skills/`.

**Quando virar arquivos auxiliares**: assim que uma instrução só se aplica a um diretório/arquivo, mova para um `CLAUDE.md` aninhado ou `.claude/rules/<topic>.md` com frontmatter `paths:` (Anthropic, "How Claude Code works in large codebases" — root file fica como "pointers and critical gotchas only").

**Resolve diretamente**: drift CLAUDE.md ↔ código (regra curta e revisável), vocabulário inconsistente (lista explícita de termos banidos).

**Classificação:** [E].

### 1.2 `.claude/rules/*.md` com frontmatter `paths:` — carregamento contextual

A convenção comunitária dominante (shanraisshan/claude-code-best-practice GitHub, 2025) é:

```md
---
description: Server Actions conventions
paths:
  - 'app/**/_actions/*.ts'
  - 'lib/actions/**/*.ts'
---

- Every Server Action returns Result<T, AppError> from lib/contracts/result.
- First line must be 'use server' followed by schema parse.
- No try/catch swallowing — let errors bubble to the Result mapping helper.
```

Sem `paths:`, o arquivo carrega como CLAUDE.md global. **Com `paths:`, só carrega quando o Claude toca um arquivo casado** — economia drástica de contexto. Use para:

- Convenções de Server Actions (`app/**/_actions/*.ts`)
- Convenções de schemas Zod (`lib/contracts/**/*.ts`)
- Convenções de componentes shadcn (`components/ui/**/*.tsx`)
- Regras de RLS/migrations (`supabase/migrations/**/*.sql`)

**Alternativas**: `CLAUDE.md` aninhado em subdiretórios carrega quando Claude trabalha lá (equivalente, menos granular). Para greenfield solo, prefira `.claude/rules/` por explicitude e versionamento.

**Classificação:** [E] (apenas 3-5 arquivos no dia 1; expandir incremental).

### 1.3 Slash commands (`.claude/commands/*.md`)

Status: **a doc oficial agora marca `.claude/commands/` como "legacy format" e recomenda `.claude/skills/<name>/SKILL.md`** (`code.claude.com/docs/en/agent-sdk/slash-commands`). Os dois ainda funcionam e usam o mesmo gatilho `/name`.

Casos úteis para solo dev + Claude Code (consenso batsov.com 2026-03, alexop.dev, youngleaders.tech):

- `/adr "title"` — gera `docs/adr/NNNN-title.md` com template enxuto (data, contexto, decisão, consequências).
- `/new-server-action <name>` — scaffold idempotente com schema Zod + action + teste Vitest.
- `/audit-disables` — busca `eslint-disable` adicionados e exige justificativa antes de commit.
- `/release-check` — corre typecheck + lint + test + bundle budget em paralelo.
- `/diff-since-plan` — mostra diff em relação ao plano aprovado no início da sessão.

Frontmatter com argumentos posicionais (`argument-hint`, `$1`, `$2`):

```md
---
argument-hint: [feature-name]
description: Scaffold a new vertical slice (route + action + schema + test)
---

Create a vertical slice under app/(app)/$1/ with:

- page.tsx (Server Component, no 'use client')
- \_actions/$1.action.ts (Server Action, Result return)
- \_schemas/$1.schema.ts (Zod 4)
- $1.test.ts (Vitest, behavior-driven)
```

**Classificação:** [I] — comece com 2 (adr, release-check); cresça orgânico.

### 1.4 Subagents (`.claude/agents/*.md`)

Doc oficial: subagents rodam em **contexto isolado** com toolset configurável, model, `maxTurns`, hooks próprios e `memory: project|user|local`. Frontmatter:

```yaml
---
name: code-reviewer
description: Reviews diffs for the desafit code style, vocabulary, and architecture rules.
tools: Read, Grep, Glob, Bash(pnpm test:*)
model: inherit
permissionMode: plan
maxTurns: 8
---
```

**Quando vale criar custom vs general-purpose**:

- **Custom**: tarefa repetível com prompt longo e estável (code review, plan-writing, migration-author). Boris Cherny, criador do Claude Code (InfoQ Jan 2026 — `infoq.com/news/2026/01/claude-code-creator-workflow/`), **não customiza** e roda múltiplas sessões em paralelo — sinal de que para solo, custom subagents são opcionais.
- **General-purpose**: tarefas one-off de exploração.

Padrão observado em produção (HumanLayer + Anthropic blog "Building companies with Claude Code"): **builder + reviewer pair** — um agente implementa, outro revisa em contexto fresco antes do merge. Para solo founder o ganho é principalmente "trust but verify" automático.

**Heurística de isolamento de contexto**: subagent é sempre janela nova. Use quando (a) a tarefa polui muito contexto com leituras (exploração de code base grande), (b) você quer um julgamento independente (review), (c) a tarefa termina em um único artefato (e.g., um diff, um relatório). Não use para "continuar codando" — para isso, mantenha-se na sessão principal ou abra worktree.

**Padrão de prompt** (consistente nas fontes — shanraisshan repo, Anthropic blog): inclua nas instruções do subagent (i) o objetivo de saída único, (ii) toolset restrito (Read+Grep+Glob para reviewers, mais Edit para builders), (iii) `maxTurns` baixo (5-10) para forçar foco.

**Classificação:** [I] — 1 agente "reviewer" só (após o stack estar firme). [O] criar agentes para tudo.

### 1.5 Skills (`.claude/skills/*.md`) vs slash commands

Diferença real (consenso batsov.com Mar 2026, alexop.dev, producttalk.org):

- **Slash command**: explícito, você digita `/name`. Single file. Ótimo para terminal/autocomplete.
- **Skill**: diretório (`SKILL.md` + scripts/templates). **Pode ser auto-invocada** pelo Claude quando a `description` casa com o contexto. Funciona também em Claude.ai/Desktop, não só Code.

Regra de bolso: workflow disparado por você → command. Capacidade que o Claude deve aplicar quando perceber relevância (ex.: "siga este estilo de testes sempre que escrever Vitest") → skill.

Producttalk.org (2025) relata um problema real: skills **não-invocam confiavelmente** em todos os casos — autores acabaram convertendo em slash command para garantir disparo. Para solo founder, isso reforça **começar por commands** e converter para skill só quando o autoinvoke for medido (PreToolUse hook para contar invocations — shanraisshan repo).

**Para `desafit`**: skills candidatas seriam `vitest-style`, `tailwind-tokens-only`, `rhf-zod-form`. Em greenfield solo, **comece sem skills**, observe o que repete, então mova.

**Classificação:** [I].

### 1.6 Hooks (PreToolUse, PostToolUse, UserPromptSubmit, SessionStart, Stop, …)

Referência canônica: `code.claude.com/docs/en/hooks`. 21 eventos lifecycle. Hooks recebem JSON via stdin, controlam por exit code (2 = bloqueia em PreToolUse; em Stop = força Claude a continuar) ou por `hookSpecificOutput.permissionDecision` (`allow|deny|ask|defer`).

Hooks que blindam diretamente as dores do projeto anterior:

1. **PreToolUse bloqueia `eslint-disable` novo** — ataca os ~830 disables inline:
   ```bash
   # .claude/hooks/block-disables.sh — referenced in .claude/settings.json PreToolUse on Edit|Write
   #!/bin/bash
   INPUT=$(cat)
   FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
   CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')
   if echo "$CONTENT" | grep -qE 'eslint-disable(-next-line)?'; then
     echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"eslint-disable proibido. Abra ADR ou ajuste a regra global."}}'
     exit 0
   fi
   exit 0
   ```
2. **PreToolUse impede edição em pastas legacy** (durante migrações, evita "drift" de pântano):
   ```bash
   if echo "$FILE" | grep -qE '^legacy/'; then
     echo '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"Pasta legacy/ é read-only. Migre arquivo para src/ primeiro."}}'
   fi
   ```
3. **PostToolUse roda format+lint no arquivo escrito** (padrão Pixelmojo, `pixelmojo.io/blogs/claude-code-hooks-production-quality-ci-cd-patterns`):
   ```json
   {
     "hooks": {
       "PostToolUse": [
         {
           "matcher": "Write|Edit|MultiEdit",
           "hooks": [
             {
               "type": "command",
               "command": "pnpm exec prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
             },
             {
               "type": "command",
               "command": "pnpm exec eslint --max-warnings 0 \"$CLAUDE_TOOL_INPUT_FILE_PATH\""
             }
           ]
         }
       ]
     }
   }
   ```
4. **UserPromptSubmit injeta lembretes de vocabulário** — previne reintrodução de "intake/wizard/student/trainer":
   ```bash
   echo '{"hookSpecificOutput":{"additionalContext":"Reminder: domain vocabulary is workout/plan/exercise/athlete/coach. Reject intake|wizard|student|trainer."}}'
   ```
5. **Stop hook bloqueia conclusão se houver `git diff` não-typechecked**:
   ```bash
   pnpm typecheck --pretty false || { echo '{"decision":"block","reason":"typecheck failing"}'; exit 0; }
   ```

**Armadilhas observadas** (`claudefa.st/blog/tools/hooks/hooks-guide`, `claudelog.com/mechanics/hooks`):

- Multiple PreToolUse hooks: precedência é `deny > defer > ask > allow`.
- Stop hook em loop: cheque `stop_hook_active` no JSON para não disparar infinitamente (`smartscope.blog/en/generative-ai/claude/claude-code-hooks-guide/`).
- Performance: hooks rodam em paralelo no mesmo evento; tenha **um único entry script** que faz routing por matcher para evitar overhead de cold-start de muitos processos (Claudelog).

**Classificação:** [E] — hooks 1, 2, 3 dia 1. Hook 4 e 5 são [I].

### 1.7 MCP servers — quais valem o overhead

| MCP                                               | Valor real para desafit                                                 | Recomendação                                                           |
| ------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **shadcn MCP** (o CLI shadcn expõe MCP em 2026)   | Instala/atualiza componentes via prompt, sem você lembrar do comando    | [E]                                                                    |
| **Supabase MCP** (`supabase/mcp-server-supabase`) | Consulta schema, gera políticas RLS, roda migrations remoto             | [E]                                                                    |
| **Context7** (Upstash)                            | Resolve docs atualizadas de bibliotecas, evita Claude usar APIs antigas | [E] — alto ROI para Next 15/16, Zod 4, Tailwind v4 (mudanças recentes) |
| **Playwright MCP**                                | Dirige browser para auto-validar fluxos UI; o Claude pode "ver" tela    | [I] — útil quando começar e2e                                          |
| **Vercel MCP**                                    | Lista deploys, logs, env vars                                           | [I] — só depois do primeiro deploy                                     |
| Browser DevTools / Chrome MCP                     | Inspeciona console em runtime                                           | [I]                                                                    |

Observação importante de Ran the Builder (`ranthebuilder.cloud`, 2026): "many MCP servers I initially relied on can be replaced by well-written skills. The advantage is transparency: I can read the skill text, while MCPs are black boxes." Para solo founder, **prefira skill/script local quando o MCP só faz wrapping de CLI**.

### 1.8 Memória contextual que sobrevive compactação

Padrões oficiais + comunidade (claude.com large-codebases blog, batsov.com 2026):

- **CLAUDE.md curto + `@imports` lazy** é a memória de longo prazo.
- **`/compact <foco>`** preserva uma direção quando o contexto enche.
- **Plan files em `docs/plans/YYYY-MM-DD-feature.md`** versionados em git — sobrevivem qualquer compaction. Armin Ronacher (`lucumr.pocoo.org/2025/12/17/what-is-plan-mode/`) detalha que Plan Mode salva o plano como Markdown em disco antes do `ExitPlanMode`.
- **ADRs leves em `docs/adr/`** ancoram "decisões que não devem ser revertidas". Atacam diretamente "10 decisões arquiteturais revertidas".
- **`docs/changelog/agent-log.md`**: nota o que Claude fez por sessão. Boris Cherny (InfoQ Jan 2026): "each team at Anthropic maintains a CLAUDE.md in git to document mistakes, so Claude can improve over time".

---

## SEÇÃO 2 — TypeScript + ESLint que travam drift na raiz

### 2.1 `tsconfig.json` strict para greenfield 2026

A doc oficial TypeScript Handbook + o guia "TypeScript strictly typed" (`dev.to/cyrilletuzi/typescript-strictly-typed-part-1-configuring-a-project-9ca`, atualizado 2025) recomendam, além de `strict: true`:

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true, // arr[0] vira T | undefined — pega 80% dos null-bugs reais
    "exactOptionalPropertyTypes": true, // { x?: string } NÃO aceita { x: undefined } — força clareza
    "noImplicitOverride": true, // exige `override` keyword
    "noPropertyAccessFromIndexSignature": true, // obriga obj["dyn"] vs obj.dyn quando index signature
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "verbatimModuleSyntax": true, // ESM/CJS sem ambiguidade
    "isolatedModules": true, // Next.js exige
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "ES2022",
    "skipLibCheck": true,
    "incremental": true,
  },
}
```

**Trade-offs reais observados**:

- `noUncheckedIndexedAccess` causa muitos pequenos refactors no início; o ganho é catastrófico em runtime (resolve maior parte dos "Cannot read properties of undefined"). **Adote dia 1 em greenfield**.
- `exactOptionalPropertyTypes` quebra muitos libs de form/state que passam `undefined` explicitamente; em greenfield com Zod controlando shapes, vale a dor.
- `noPropertyAccessFromIndexSignature` é o mais "ruidoso"; pode ficar [I].

**Resolve**: parte das 150-170h de refator (tipos largos viraram bugs depois).

### 2.2 ESLint flat config (`eslint.config.ts`) com type-aware

`eslint.config.ts` é oficialmente suportado desde ESLint v9.18 (`eslint.org/blog/2025/01/eslint-v9.18.0-released`). Para Next.js 15/16 com `strict-type-checked` (doc oficial typescript-eslint: "recomendado se nontrivial percentage of devs proficient in TypeScript" — `typescript-eslint.io/users/configs/`):

```ts
// eslint.config.ts
import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import next from 'eslint-config-next/flat'
import importPlugin from 'eslint-plugin-import'
import unicorn from 'eslint-plugin-unicorn'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'
import promisePlugin from 'eslint-plugin-promise'
import betterTailwind from 'eslint-plugin-better-tailwindcss'
import sheriff from '@softarc/eslint-plugin-sheriff'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'

export default defineConfig(
  { ignores: ['.next/**', 'node_modules/**', '**/*.gen.ts', 'public/**'] },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...next,
  comments.recommended,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
    plugins: {
      import: importPlugin,
      unicorn,
      'jsx-a11y': jsxA11y,
      'react-hooks': reactHooks,
      promise: promisePlugin,
      'better-tailwindcss': betterTailwind,
      '@softarc/sheriff': sheriff,
    },
    rules: {
      // ——— A — banir vocabulário/stack errado (resolve dor de vocabulário + framer-motion) ———
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'framer-motion', message: 'Use motion (Motion 12). framer-motion is BANNED.' },
          ],
          patterns: [
            {
              group: ['**/legacy/**'],
              message: 'legacy/ is frozen. Migrate file before importing.',
            },
            {
              group: ['@/lib/supabase/admin'],
              importNames: ['createAdminClient'],
              message: 'Admin client only in server-only files under lib/supabase/server/*.',
            },
          ],
        },
      ],
      'id-denylist': ['error', 'intake', 'wizard', 'student', 'trainer'],

      // ——— B — limites de tamanho/complexidade (resolve overengineering) ———
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, IIFEs: true }],
      complexity: ['error', 12],
      'max-depth': ['error', 4],
      'max-params': ['error', 4],

      // ——— C — proibir disables inline (resolve 830 eslint-disable) ———
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': true, 'ts-expect-error': 'allow-with-description', 'ts-nocheck': true },
      ],
      'unicorn/no-abusive-eslint-disable': 'error',
      '@eslint-community/eslint-comments/no-use': ['error', { allow: [] }], // bane TODOS os disables inline

      // ——— D — type safety extra ———
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',

      // ——— E — React/Next ———
      'react-hooks/exhaustive-deps': 'error',
      'react/jsx-no-leaked-render': 'error',

      // ——— F — Tailwind v4 ———
      'better-tailwindcss/no-unregistered-classes': 'error', // pega bg-[#hex] sem token
      'better-tailwindcss/sort-classes': 'warn',
    },
  },
  // Files Server (lib/**/server.ts, **/_actions/**) — proíbe 'use client'
  {
    files: ['**/_actions/**/*.{ts,tsx}', 'lib/supabase/server/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "ExpressionStatement[expression.value='use client']",
          message: "Server-only file. 'use client' forbidden.",
        },
      ],
    },
  },
)
```

Plugins adicionais que valem mencionar (consenso comunidade):

- **eslint-plugin-functional** — opt-in para imutabilidade rigorosa. **[O]** para solo (custo alto, benefício marginal).
- **eslint-plugin-tailwindcss (legacy)** — não compatível com Tailwind v4 (issue aberta desde jun 2025; confirmado em `infinum.com/handbook/frontend/react/tailwind/best-practices`). **Use `eslint-plugin-better-tailwindcss`** — explicitamente projetado para v4 (`agentskills.so/skills/paulrberg-agent-skills/tailwind-css`).
- **eslint-plugin-unicorn** — pegadas práticas (no-array-reduce, prefer-node-protocol). **[I]**.
- **`@antfu/eslint-config`, `t3-oss` configs** — atalhos. Para solo founder com clareza do que quer, escrever o config próprio dá controle; para quem prioriza velocidade, presets ajudam.

### 2.3 Boundary rules — Sheriff vs eslint-plugin-boundaries vs dependency-cruiser

Comparativo (Stefanos Lignos, `stefanos-lignos.dev/posts/nx-module-boundaries`, 2025; doc Sheriff `sheriff.softarc.io`):

| Ferramenta                                                               | Pontos fortes                                                                                                                                | Para desafit             |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **Sheriff** (`@softarc/sheriff-core` + `@softarc/eslint-plugin-sheriff`) | Tag-based, barrel-less ou barrel, encapsulamento `internal/`, framework-agnostic, integra ESLint                                             | **Adote** [E]            |
| **dependency-cruiser**                                                   | Mais poderoso (detecta circular, orphan, "shared enough") mas mais lento; pode rodar como CLI no CI e via `eslint-plugin-dependency-cruiser` | [I] no CI, não no editor |
| **eslint-plugin-boundaries**                                             | Mais simples, menos expressivo que Sheriff                                                                                                   | Pular                    |
| **`@nx/enforce-module-boundaries`**                                      | Requer Nx                                                                                                                                    | N/A                      |

`sheriff.config.ts` típico para desafit:

```ts
import type { SheriffConfig } from '@softarc/sheriff-core'

export const config: SheriffConfig = {
  modules: {
    'app/<feature>': ['type:feature', 'scope:web'],
    'lib/contracts': 'type:shared',
    'lib/supabase': ['type:data', 'side:server'],
    'lib/ui': 'type:shared',
  },
  depRules: {
    'type:feature': ['type:feature', 'type:shared', 'type:data'],
    'type:data': ['type:shared'],
    'type:shared': ['type:shared'],
    'side:server': 'noTag',
  },
  enableBarrelLess: true,
}
```

**Resolve**: 30+ camadas de overengineering (cada nova camada precisa virar tag explícita, alto custo psicológico para criar), e parte do refator (impede que `lib/data` importe `app/`).

### 2.4 Banir `eslint-disable` inline sem virar grito no PR

Combinação de três regras + um hook (já listado em 1.6):

1. ESLint config (já incluído acima):

```ts
'unicorn/no-abusive-eslint-disable': 'error',
'@eslint-community/eslint-comments/no-use': ['error', { allow: [] }],
```

2. `lint-staged` roda com `--max-warnings 0 --no-inline-config` (`--no-inline-config` ignora `eslint-disable` em comentários).

3. PreToolUse hook (Seção 1.6) impede o Claude de **introduzir** disables.

4. CI grep job como safety net:

```yaml
- name: No new eslint-disable
  run: |
    if git diff origin/main...HEAD | grep -E '^\+.*eslint-disable'; then
      echo "❌ Novos eslint-disable detectados. Use ADR para suprimir regra global."
      exit 1
    fi
```

**Resolve diretamente os ~830 disables.**

### 2.5 Custom ESLint rule (quando vale)

Em greenfield solo: **só uma**, caseira em `tools/eslint/no-legacy-vocab.ts`, se você quiser mensagem custom por termo (com sugestão de substituição). Acima disso, é [O]. `no-restricted-imports` + `id-denylist` + `no-restricted-syntax` cobrem 95% sem virar manutenção de plugin.

---

## SEÇÃO 3 — Contratos como fonte da verdade

### 3.1 Schema-first com Zod 4 (única fonte)

Zod 4 (`zod.dev`) + react-hook-form via `@hookform/resolvers/zod` é o padrão consolidado (DEV "Dynamic forms with discriminatedUnion and React Hook Form", 2025). Estrutura recomendada:

```
lib/contracts/                     # única fonte da verdade — tipos vivem aqui
├── result.ts                      # Result<T, E> discriminated union
├── errors.ts                      # AppError = z.discriminatedUnion('kind', [...])
├── workout/
│   ├── workout.schema.ts          # z schemas + z.infer<> types exportados
│   └── workout.contracts.ts       # input/output das Server Actions
└── athlete/...
lib/supabase/types.gen.ts          # SOMENTE row types do Postgres (gerado, read-only)
```

**Por que separar `lib/contracts/` de `lib/supabase/types.gen.ts`**: o gerado descreve **o banco**; o `contracts/` descreve **a API/domínio**. Eles convergem em adapters explícitos (`fromRow(row): Workout`). Tentar usar tipos gerados como domínio causa acoplamento entre persistence e UI — uma das pegadas clássicas do refator anterior.

`Result<T, E>` (discriminated union) — sobrevive refactor:

```ts
// lib/contracts/result.ts
export type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E }

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data })
export const fail = <E>(error: E): Result<never, E> => ({ ok: false, error })
```

```ts
// lib/contracts/errors.ts
import { z } from 'zod/v4'
export const AppErrorSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('validation'), fields: z.record(z.string(), z.string()) }),
  z.object({ kind: z.literal('not_found'), resource: z.string() }),
  z.object({ kind: z.literal('forbidden'), reason: z.string() }),
  z.object({ kind: z.literal('conflict'), reason: z.string() }),
  z.object({ kind: z.literal('unknown'), cause: z.string() }),
])
export type AppError = z.infer<typeof AppErrorSchema>
```

### 3.2 Server Actions como única forma de mutation

Padrão (Next.js docs App Router; "Common workflows" + DEV community 2025):

```ts
// app/(app)/workouts/_actions/create-workout.action.ts
'use server'
import { z } from 'zod/v4'
import { revalidatePath } from 'next/cache'
import { CreateWorkoutSchema } from '@/lib/contracts/workout/workout.schema'
import { ok, fail, type Result } from '@/lib/contracts/result'
import type { Workout, AppError } from '@/lib/contracts'

export async function createWorkout(
  input: z.input<typeof CreateWorkoutSchema>,
): Promise<Result<Workout, AppError>> {
  const parsed = CreateWorkoutSchema.safeParse(input)
  if (!parsed.success) {
    return fail({
      kind: 'validation',
      fields: parsed.error.flatten().fieldErrors as Record<string, string>,
    })
  }
  // … chamadas RLS-aware ao Supabase, retornar ok(workout)
  revalidatePath('/workouts')
  return ok(workout)
}
```

Gancho importante a observar (`react-hook-form/resolvers` issues #788, #793, #817): **Zod 4 + `discriminatedUnion` + `zodResolver` tem bugs conhecidos** em formulários (errors mascarando outros campos, refine em ramo da união não propagando). **Workaround atual oficial**: usar `@hookform/resolvers/standard-schema` em vez de `zodResolver` para discriminated unions — referenciado pela própria maintainer no issue #793 (`github.com/react-hook-form/resolvers/issues/793`).

### 3.3 Gerar tipos do banco em CI e bloquear PR drift

Padrão oficial em `supabase/setup-cli` (`github.com/supabase/setup-cli`) — diff-and-fail:

```yaml
# .github/workflows/db-types.yml
name: db-types
on: [pull_request]
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v2
        with: { version: latest }
      - run: supabase db start
      - name: Generate types from local DB
        run: supabase gen types typescript --local > lib/supabase/types.gen.ts
      - name: Fail if types drifted
        run: |
          if ! git diff --ignore-space-at-eol --exit-code --quiet lib/supabase/types.gen.ts; then
            echo "❌ types.gen.ts out of date. Run: pnpm db:types && commit."
            git diff lib/supabase/types.gen.ts
            exit 1
          fi
```

E `package.json`:

```jsonc
"scripts": {
  "db:types": "supabase gen types typescript --local > lib/supabase/types.gen.ts",
  "db:lint": "supabase db lint --level warning",
  "db:test": "supabase test db"
}
```

**Resolve**: drift schema↔código (parte do refator).

### 3.4 "API as Zod schemas, not OpenAPI" — quando vale

- **Quando vale (seu caso)**: cliente único, mesmo monorepo, sem terceiros consumindo, App Router + Server Actions já é tipo-seguro fim-a-fim. Zod schemas como contrato evita a sobrecarga OpenAPI/codegen.
- **Quando vira bagunça**: múltiplos clientes (mobile separado, terceiros), versionamento de API. Aí OpenAPI ou tRPC fazem sentido.

Para `desafit.app` greenfield solo: **Zod schemas + Server Actions ganham**. Se um dia houver mobile nativo, exporte os schemas via npm interno ou converta para OpenAPI com `zod-openapi`. Debate tRPC vs Server Actions (2025): consenso é que para Next.js App Router mono-app, Server Actions ganharam — menos infra, mesma type-safety. tRPC ainda ganha para múltiplos clientes/cross-package.

**Classificação:** [E] (3.1, 3.2, 3.3). [I] (zod-openapi export quando necessário).

---

## SEÇÃO 4 — Pre-commit / CI gates que pegam erro antes de virar debt

### 4.1 Husky + lint-staged (setup mínimo viável 2026)

Consenso (eastondev.com Jan 2026, getnerdify.com, github.com/lint-staged/lint-staged): **só processe arquivos staged; deixe checks "full" para CI**. Tempo médio de pre-commit com lint-staged em repo >10k LOC: ~1.2s vs >5s no full scan (Built-In via getnerdify.com).

Setup:

```bash
pnpm add -D husky lint-staged prettier
pnpm exec husky init
```

`package.json`:

```jsonc
{
  "scripts": {
    "prepare": "husky",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0 --no-inline-config",
    "test": "vitest run",
    "e2e": "playwright test",
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --max-warnings 0 --no-inline-config --fix",
      "prettier --write",
      "bash -c 'pnpm typecheck'",
    ],
    "*.{json,md,css,yml}": ["prettier --write"],
    "supabase/migrations/*.sql": ["supabase db lint --level warning"],
  },
}
```

`.husky/pre-commit`:

```bash
pnpm exec lint-staged
```

**Atenção (issue lint-staged #825)**: lint-staged passa caminhos como args, e TS pode ignorar `tsconfig.json` quando recebe arquivos explícitos. Solução: encapsular tsc num script (`bash -c`) que ignora args, garantindo que rode `tsc --noEmit` contra o projeto inteiro mas só quando algo TS foi staged. Custo: ~3-6s extra; aceitável.

**Não meta no pre-commit**: full test suite, e2e, build. Vai para CI.

**Alternativa**: Lefthook (Go, paralelo, ~10x mais rápido — `pkgpulse.com/guides/husky-vs-lefthook-vs-lint-staged-git-hooks-nodejs-2026`). Para solo, Husky é o padrão e o tempo bruto não é o gargalo.

### 4.2 Detectar abuso de `--no-verify`

Hook server-side é o único caminho seguro — em Vercel/GitHub, o pre-receive não é seu. Detecção possível em CI:

```yaml
- name: Detect skipped pre-commit
  run: |
    pnpm exec lint-staged --diff="origin/main...HEAD" || exit 1
```

(lint-staged 16+ suporta `--diff` para rodar contra um range, replicando o que pre-commit teria feito.)

Para solo founder honesto: `--no-verify` é só auto-sabotagem. Mantenha o hook leve para não criar incentivo.

### 4.3 CI gates não-negociáveis e ordem (fail-fast)

```yaml
# .github/workflows/ci.yml
name: ci
on:
  pull_request:
  push: { branches: [main] }
concurrency: { group: ci-${{ github.ref }}, cancel-in-progress: true }

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile

      # 1. fast checks first — fail fast
      - run: pnpm typecheck
      - run: pnpm lint
      - run: pnpm exec knip --production       # dead code / unused deps
      - name: No new eslint-disable
        run: |
          BASE=${{ github.event.pull_request.base.sha || 'origin/main' }}
          git diff $BASE...HEAD -- '*.ts' '*.tsx' | grep -E '^\+.*eslint-disable' && exit 1 || true

      # 2. unit + contract tests
      - run: pnpm test -- --coverage

  db:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v2
      - run: supabase db start && supabase db lint && supabase test db
      - run: |
          supabase gen types typescript --local > lib/supabase/types.gen.ts
          git diff --exit-code lib/supabase/types.gen.ts

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - uses: actions/cache@v4
        with: { path: ~/.cache/ms-playwright, key: pw-${{ hashFiles('pnpm-lock.yaml') }} }
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm build
      - run: pnpm e2e
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: playwright-report, path: playwright-report }

  size:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: andresz1/size-limit-action@v2
        with: { github_token: ${{ secrets.GITHUB_TOKEN }}, package_manager: pnpm }
```

Ordem da seção `quality` segue **fail-fast**: typecheck (segundos) → lint → knip → grep disables → tests. Cada etapa é mais cara que a anterior.

**Importante (Catch Metrics, Jan 2026 — `catchmetrics.io/blog/nextjs-developers-lost-bundle-size-visibility`)**: o `next build` em **Next.js 16 removeu as estatísticas per-route**. Vercel removeu por imprecisão. Solução: use `size-limit` apontando para `.next/static/chunks/*.js` com budgets explícitos. `bundlewatch` também serve (`pronextjs.dev`).

`.size-limit.json`:

```json
[
  { "name": "First Load JS (root)", "path": ".next/static/chunks/main-*.js", "limit": "90 kB" },
  { "name": "App shell", "path": ".next/static/chunks/app/**/*.js", "limit": "150 kB" }
]
```

**axe-core / Lighthouse CI**: rodam em job separado em PRs com label `perf`/`a11y` para não burnar CI minutes em cada commit. **[I]** depois das primeiras telas estarem firmes.

**knip + depcheck**: oficial knip docs (`knip.dev/reference/plugins/next`, `knip.dev/reference/plugins/size-limit`) já tem plugins prontos. Knip é superset de depcheck. **Use só knip, [E]**.

### 4.4 GitHub Actions: cache pnpm + Next + Playwright sem dor

Padrões consolidados:

- `pnpm/action-setup@v4` + `actions/setup-node@v4` com `cache: pnpm`.
- Cache `.next/cache`:
  ```yaml
  - uses: actions/cache@v4
    with:
      path: |
        ~/.cache/pnpm
        ${{ github.workspace }}/.next/cache
      key: ${{ runner.os }}-next-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts','**/*.tsx') }}
      restore-keys: |
        ${{ runner.os }}-next-${{ hashFiles('pnpm-lock.yaml') }}-
  ```
- Cache Playwright (mostrado no `e2e` job acima).

### 4.5 Turborepo num app único?

**Não.** Para `desafit.app` mono-app, Turborepo adiciona conceito sem ROI: você ganha cache de tasks que já são rápidas (pnpm) e perde simplicidade de scripts. Adote **só quando**: extrair pacote compartilhado (ex.: SDK para mobile/Edge Functions com tipos do contracts). Atualmente: **[O]**.

---

## SEÇÃO 5 — Anti-refactor patterns: arquitetura que não pede pra ser reescrita

### 5.1 File-size guardrails (com evidência)

`max-lines: 300` e `max-lines-per-function: 60` é o consenso prático (ESLint docs + bulletproof-react). Evidência: "Software Engineering at Google" (livro O'Reilly 2020) cita que funções > 100 linhas são preditores significativos de bug-density. No projeto anterior os sintomas (30+ camadas, refator de 150h) são marcas clássicas de **funções e arquivos que cresceram sem feedback** — `max-lines` é o feedback.

`complexity: 12` (cyclomatic) e `max-depth: 4` pegam o sub-padrão "if-aninhado virou estado de máquina implícito".

### 5.2 Feature folders vs layer folders — multi-tenant App Router 2026

Consenso de Feature-Sliced Design ("The Ultimate Next.js App Router Architecture", `feature-sliced.design/blog/nextjs-app-router-guide`, 2025) + Next.js multi-tenant guide oficial (`nextjs.org/docs/app/guides/multi-tenant`):

**Para `desafit.app` (B2B SaaS, multi-tenant por subdomain ou path)**, a estrutura ganha:

```
app/
  (marketing)/           # rota grupo para landing/pricing
  (auth)/login/, signup/
  (app)/                 # area autenticada — middleware injeta tenant
    [tenant]/            # ou via subdomain
      workouts/
        page.tsx
        _components/     # locais à rota — private folder (Next.js convention)
        _actions/
        _schemas/
src/
  lib/
    contracts/           # SEÇÃO 3
    supabase/
      client.ts          # browser client
      server.ts          # server client (cookies)
      admin.ts           # service-role — server-only
      types.gen.ts
    ui/                  # design tokens + componentes shadcn
    tenant/              # resolução de tenant, RLS helpers
  features/              # vertical slices compartilhadas entre rotas
    workouts/
      api.ts
      hooks.ts
      types.ts
```

**Vertical slices > horizontal layers** para SaaS multi-tenant: cada feature contém schema/action/UI/test juntos. Cross-cutting (auth, tenant, ui) fica em `lib/`. Premature abstraction é o inimigo principal.

FSD puro (`shared/entities/features/widgets/pages`) é **[O]** para solo founder: o custo cognitivo de ranquear cada coisa em 5 camadas não compensa. Use a versão "lite": `app/` + `lib/` + `features/` (3 camadas).

**Resolve**: 30+ camadas removidas (greenfield só tem 3 desde o dia 1), 10 decisões revertidas (estrutura fixa).

### 5.3 Rule of three / premature abstraction / "service layer vazio"

Princípio canônico (Sandi Metz: _"duplication is far cheaper than the wrong abstraction"_; Kent C. Dodds, "AHA Programming"): **só extraia hook/componente/util quando aparecer 3 vezes**. Antes disso, duplique.

Para Claude Code especificamente: o agente tem viés a generalizar prematuramente. Inclua no CLAUDE.md:

```md
## Abstraction rules

- Do NOT extract a util/hook/component before the 3rd usage. Duplicate up to 2 times.
- Service/repository layer is forbidden unless ALL three apply:
  1. It owns ≥2 collaborators (e.g., supabase + cache + queue).
  2. It has ≥2 callers (different Server Actions or routes).
  3. It encapsulates a transaction/policy that does NOT fit in a single Server Action.
- Otherwise: Server Action calls Supabase directly. No "service" wrapper.
```

A regra acima ataca "service layer vazio" — o pattern em que dev cria `WorkoutService.create()` que só chama `supabase.from('workouts').insert()`. Adiciona indireção sem fronteira semântica. Em greenfield com Server Actions, **a Server Action JÁ é a camada de serviço**.

ESLint reforça com `max-lines` (services vazios costumam ser arquivos curtos com 1-2 funções pass-through) — porém o policy primário é cultural/CLAUDE.md, não tooling.

### 5.4 Pinagem de versão (não bumpar major sem querer)

`renovate.json` (Mend Renovate) restritivo:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":dependencyDashboard", ":pinAllExceptPeerDependencies"],
  "rangeStrategy": "pin",
  "packageRules": [
    { "matchUpdateTypes": ["major"], "enabled": false, "addLabels": ["major-blocked"] },
    {
      "matchPackagePatterns": ["^next", "^react", "^@types/react", "^tailwindcss", "^@supabase"],
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": false,
      "addLabels": ["stack-core"]
    },
    {
      "matchDepTypes": ["devDependencies"],
      "matchUpdateTypes": ["minor", "patch"],
      "automerge": true
    }
  ],
  "lockFileMaintenance": { "enabled": true, "schedule": ["before 5am on monday"] }
}
```

`pnpm` complementa via `package.json`:

```json
"engines": { "node": ">=20.11", "pnpm": ">=9" },
"packageManager": "pnpm@9.x.x",
"pnpm": { "peerDependencyRules": { "allowedVersions": {} } }
```

**Resolve**: parte das 10 decisões revertidas (cada major bump é uma decisão escondida).

---

## SEÇÃO 6 — Living documentation que não fica outdated

### 6.1 Manter CLAUDE.md fresco

Combinação de três técnicas:

1. **PostToolUse hook lint-claude-md** (`MuhammadUsmanGM/claude-code-best-practices` repo v1.5): valida tamanho < 200 linhas, imports válidos, sem stack/comando obsoleto:

   ```bash
   wc -l CLAUDE.md | awk '{ if ($1 > 200) { print "CLAUDE.md > 200 lines"; exit 2 } }'
   ```

2. **Script gerador injeta listas** (rotas, server actions, schemas) em `docs/auto/INDEX.md` que CLAUDE.md referencia via `@`:

   ```ts
   // tools/sync-docs.ts — rodado em pre-push e CI
   import { globby } from 'globby'
   const routes = await globby('app/**/page.tsx')
   const actions = await globby('app/**/_actions/*.action.ts')
   // escreve docs/auto/INDEX.md com listas atualizadas
   ```

   CI grep:

   ```yaml
   - run: pnpm sync-docs && git diff --exit-code docs/auto/
   ```

3. **`paths:` em `.claude/rules/`** — quando arquivo bate, a regra aparece. Não precisa estar no CLAUDE.md raiz. Estoque de drift cai a zero.

### 6.2 ADRs leves

Estilo Michael Nygard (mais citado). Template enxuto em `docs/adr/0000-template.md`:

```md
# NNNN — <decisão em 1 linha>

- Data: YYYY-MM-DD
- Status: proposed | accepted | superseded by NNNN

## Contexto

Por que precisamos decidir.

## Decisão

O que faremos.

## Consequências

Bom, ruim, neutro. O que fica difícil depois.
```

Integração com Claude Code: slash command `/adr "title"` cria o arquivo. `CLAUDE.md` referencia `@docs/adr/INDEX.md`. Sempre que reverter, **não delete** — marque `superseded by`.

**Resolve diretamente**: 10 decisões arquiteturais revertidas (ficam visíveis e rastreáveis; o custo psicológico de revertem sobe).

### 6.3 Fonte da verdade — hierarquia

```
1. Código (testes + tipos)           ← verdade última
2. lib/contracts/*.ts                ← contratos vivos
3. docs/adr/*.md                     ← decisões (imutáveis exceto superseded)
4. .claude/rules/*.md com paths:     ← regras contextuais
5. CLAUDE.md                         ← onboarding + ponteiros (não detalhes)
6. README.md                         ← humanos
```

Quanto mais próximo do código, mais autoritativo. Tudo o que se duplica nessa lista é candidato a drift.

### 6.4 Detectar doc drift em CI

```yaml
- name: docs reference real files
  run: |
    grep -roE '@[a-zA-Z0-9_./-]+\.(md|ts|tsx)' CLAUDE.md docs/ .claude/ | \
      awk -F: '{ print $2 }' | sed 's/^@//' | sort -u | \
      while read f; do test -e "$f" || { echo "MISSING ref: $f"; exit 1; }; done
```

**Classificação:** ADRs e hierarquia [E]; auto-injection script [I]; drift-check [I].

---

## SEÇÃO 7 — Dev workflow solo + Claude Code: padrões de produção

### 7.1 Como solo founders rodam em produção (2025/2026)

Fontes primárias:

- **Anthropic blog, "How three YC startups built their companies with Claude Code"** (`claude.com/blog/building-companies-with-claude-code`): HumanLayer pivotou inteiro com Claude Code, criou "12-Factor Agents" (abr 2025). Vulcan (founders sem background técnico) construiu plataforma reguladora.
- **InfoQ, Jan 2026, "Inside the Development Workflow of Claude Code's Creator"** (`infoq.com/news/2026/01/claude-code-creator-workflow/`): Boris Cherny roda 5 sessões locais paralelas + 5-10 remotas, **um git checkout por sessão (não worktrees nem branches)**, usa Opus 4.5 com thinking para tudo, 10-20% das sessões são abandonadas.
- **DEV, "Claude Code in Production: 40% Productivity Increase on a Large Project"** (`dev.to/dzianiskarviha/integrating-claude-code-into-production-workflows-lbn`, 350k LOC solo, ~80% código escrito por Claude desde ago 2025): subagents auto-disparados como reviewer, plan + skills para padrões repetidos, reviewer roda também no commit-stage CI.

Padrões repetidos:

- **Plan mode (Shift+Tab) é não-negociável** antes de qualquer mudança não-trivial.
- **CLAUDE.md curto + skills**; ninguém recomenda CLAUDE.md grande.
- **Multiple sessions concurrent** (worktrees ou checkouts) para paralelizar.
- **Reviewer subagent independente** roda antes do commit (contexto não-contaminado).

### 7.2 Não deixar o agente escolher arquitetura

Decisões a travar antes de delegar (no CLAUDE.md, ADR, ou `.claude/rules/`):

1. Stack exato (versões pinned).
2. Vocabulário do domínio.
3. Forma das mutações (Server Action + Result).
4. Estrutura de pastas (vertical slices).
5. Onde mora cada coisa (`lib/contracts`, `lib/supabase`, `features/`...).
6. Tokens visuais (Tailwind v4 `@theme`).
7. Política de testes (behavior > implementation; Vitest + Playwright).

**Resolve diretamente**: 10 decisões revertidas. Se a decisão não está num ADR, ela vira "negociável" toda sessão.

### 7.3 Plan mode / TodoWrite (TaskCreate) / subagent — heurísticas

| Situação                     | Ferramenta                                                       | Por quê                                                            |
| ---------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ |
| Mudar 1 arquivo, < 30 linhas | Direct edit, sem plan mode                                       | Overhead > ganho                                                   |
| Nova feature, > 2 arquivos   | **Plan mode** + plano salvo em `docs/plans/`                     | Permite revisar antes do disco                                     |
| Investigar antes de mudar    | **Subagent Explore**                                             | Mantém contexto principal limpo (oficial: "Common workflows")      |
| Refactor cross-cutting       | **Plan mode + worktree separado**                                | Não contamina branch atual                                         |
| Sequência longa repetitiva   | **Plan mode → TodoWrite/TaskCreate** com N subtarefas explícitas | Cada subtarefa tem checkbox e contexto; reduz "esqueci de fazer X" |

**Sobre TodoWrite/TaskCreate** (a ferramenta interna do Claude Code que mantém a lista de tarefas visível ao usuário): use em qualquer plano com ≥3 passos. O Claude marca tarefas como `in_progress`, `completed`, ou `cancelled` em tempo real — funciona como contrato visível entre você e o agente. Combine com Plan Mode: o plano gera a TodoWrite list; você aprova; o agente segue executando-as. Se a sessão for compactada, a TodoWrite list é reconstruída do plano em disco.

Armin Ronacher (`lucumr.pocoo.org/2025/12/17/what-is-plan-mode/`, dez 2025): Plan Mode internamente salva um Markdown e `ExitPlanMode` é só o sinal — você pode editar o plano em disco antes de aprovar.

### 7.4 Worktrees vs múltiplos checkouts

Doc oficial (`code.claude.com/docs/en/common-workflows`): `claude --worktree feature-x` cria branch + dir + sessão isolada. Cherny prefere **checkouts separados** porque integração tests de backend não rodam em paralelo num mesmo Postgres local (InfoQ Jan 2026).

Para `desafit`: como você usa Supabase local com 1 instância, **checkouts separados** simplificam (cada um aponta para `.env.local` próprio com schema diferente, se necessário). Para mudanças puramente frontend, worktree ganha.

**Anti-padrão observado** (MindStudio article `mindstudio.ai/blog/what-is-claude-code-git-worktree-pattern-parallel-feature-branches`): worktrees para tarefas dependentes ou mudanças triviais. Overhead > benefício.

Tip operacional: adicione `.claude/worktrees/` ao `.gitignore` para evitar pollution (SAP Community guide).

### 7.5 Trust but verify

Estratégias compostas (DEV "Claude Code in Production" + Anthropic blog):

1. **Reviewer subagent automático** após implementação.
2. **`/diff` antes de cada commit** — você lê o diff antes da Claude pedir aprovação.
3. **Hooks PostToolUse rodando typecheck + lint** — feedback determinístico.
4. **CI gate full** — última rede.
5. **"prove to me this works"** — challenge prompt antes do PR (`shanraisshan/claude-code-best-practice` repo).
6. **Sessões curtas + `/compact` ou nova sessão** — context-rot é real.

### 7.6 Anti-padrões observados

- **Sessões muito longas**: context rot (alex.op/dev e batsov.com mencionam explicitamente). Use `/compact <foco>` ou reinicie com plano em disco.
- **CLAUDE.md inflado**: ironicamente, o Claude ignora as regras. Mantenha < 200 linhas.
- **Skills sobrepondo regras conflitantes**: shanraisshan repo nota o problema. Para solo, mantenha skills mínimas.
- **Confiar no agente para decisões arquiteturais**: o "pântano" do projeto anterior é a face mais comum dessa anti-pattern.
- **Não revisar plan**: o plan é o checkpoint barato. Pular = caro depois.
- **Dependência excessiva em modo "agentic"**: founders YC que ficaram bem (Anthropic blog) ainda revisam diffs. "80% generated, 100% reviewed" é o padrão.

---

## SEÇÃO 8 — Stack-specific guardrails

### 8.1 Tailwind v4 + shadcn new-york — travar arbitrary classes

A doc oficial Tailwind v4 (`tailwindcss.com/docs/theme` e blog v4.0) deixa claro: tokens vivem em `@theme` dentro de `app/globals.css`; cada `--color-*` gera utilities automaticamente; `bg-[#hex]` ainda é permitido mas é "fuga".

`app/globals.css`:

```css
@import 'tailwindcss';
@theme {
  --color-brand-50: oklch(98% 0.01 250);
  --color-brand-500: oklch(60% 0.16 250);
  --color-brand-900: oklch(20% 0.08 250);
  --radius-card: 0.75rem;
  --font-display: 'Inter', sans-serif;
}
```

ESLint plugin: **`eslint-plugin-better-tailwindcss`** (o legacy `eslint-plugin-tailwindcss` ainda não suporta v4 — issue aberta desde jun 2025, confirmado em `infinum.com/handbook/frontend/react/tailwind/best-practices` e `agentskills.so/skills/paulrberg-agent-skills/tailwind-css`):

```ts
'better-tailwindcss/no-unregistered-classes': 'error',  // bloqueia bg-[#abc] / bg-[rgb(...)]
'better-tailwindcss/no-conflicting-classes': 'error',
'better-tailwindcss/sort-classes': 'warn',
```

Para casos legítimos (hero com hex específico), force a adição como token:

```
ERRO better-tailwindcss/no-unregistered-classes:
  Class "bg-[#FF5733]" usa arbitrary value.
  Adicione "--color-accent: #FF5733;" em @theme e use "bg-accent".
```

Prettier: `prettier-plugin-tailwindcss` ordena classes; configure para reconhecer `cn`, `cva`, `tv`:

```js
// .prettierrc.mjs
export default { plugins: ['prettier-plugin-tailwindcss'], tailwindFunctions: ['cn', 'cva', 'tv'] }
```

shadcn new-york: o `components.json` mantém o style + paths. Não há nada extra a travar pelo shadcn — o `@theme` é a única fonte de tokens.

**Classificação:** [E].

### 8.2 Motion 12 vs framer-motion — bane import

framer-motion foi renomeado para `motion` (org Framer mantém ambos, mas `motion` é o canônico em 2026 e Motion 12 só vive sob `motion`/`motion/react`).

```ts
// eslint.config.ts (já incluído acima)
'no-restricted-imports': ['error', { paths: [
  { name: 'framer-motion', message: 'Use motion (Motion 12): import { motion } from "motion/react".' }
]}]
```

`package.json` reforço (caso alguma transitive dependa do nome antigo):

```jsonc
"pnpm": { "overrides": { "framer-motion": "npm:motion@^12" } }
```

(Atenção: validar com `pnpm why framer-motion` antes de aplicar o override.)

**Resolve**: parte do vocabulário inconsistente + dependência morta.

### 8.3 Supabase — travar `createClient()` e admin client

Padrão server-only (Supabase docs + comunidade Next.js):

```
lib/supabase/
├── client.ts         # browser; cookies via @supabase/ssr
├── server.ts         # 'server-only'; cookies do request
├── admin.ts          # 'server-only'; service-role; SOMENTE para Edge/migrations
├── types.gen.ts      # gerado
└── index.ts          # re-exporta SOMENTE client e server (admin nunca)
```

`lib/supabase/admin.ts`:

```ts
import 'server-only' // explode no build se importado de Client Component
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types.gen'

export function createAdminClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
}
```

ESLint:

```ts
'no-restricted-imports': ['error', {
  patterns: [
    { group: ['@supabase/supabase-js'], message: 'Use lib/supabase/{client,server} — never createClient() directly.' },
    { group: ['@/lib/supabase/admin'], message: 'Admin client only allowed in supabase/functions/** and migrations.' }
  ]
}]
```

Camada extra para impedir admin em `'use client'`: regra customizada (`no-restricted-syntax`) que detecta a directive + import suspeito; ou simplesmente confiar em `server-only` (`server-only` é uma convenção Next.js oficial — quebra build se importado fora de server context).

**Resolve**: parte do refator (camadas vazadas data ↔ UI).

### 8.4 next-intl 4 — detectar string hardcoded

next-intl 4 doc oficial: `useTranslations()` em components, `getTranslations()` em Server Components. Detecção:

1. **ESLint via plugin `eslint-plugin-i18next`** (suporta jsx text e atributos):

   ```ts
   'i18next/no-literal-string': ['error', {
     mode: 'jsx-text-only',
     ignoreCallee: ['cn', 'cva', 'console', 'log'],
   }]
   ```

   Captura `<div>Hello world</div>` mas não `cn('p-4')`.

2. **Pre-commit grep como rede secundária**:

   ```bash
   grep -nE '>[A-Z][a-z]{3,}.*<' src/**/*.tsx | grep -v 'data-' | head
   ```

3. **Convenção**: chaves de tradução vão em `messages/<locale>.json` versionado. Lint que checa **chaves não usadas** (knip + plugin custom) e **chaves usadas mas ausentes**: `i18next-parser` em CI gera diff.

**Classificação:** [I] — depende de quando i18n entra. Greenfield com pt-BR + en é candidato [E].

### 8.5 Server Action — detectar uso indevido

Padrões anti:

- Server Action chamada de fora do form/action handler (ex.: dentro de `useEffect`).
- Server Action retornando dado não-Result.
- `'use server'` em arquivo que exporta também tipos (Next.js só permite async functions exportadas em arquivos `'use server'`).

Detecção:

```ts
// eslint regra customizada simples (no-restricted-syntax)
{
  selector: "ExportNamedDeclaration > VariableDeclaration:has(Literal[value='use server'])",
  message: "'use server' files may only export async functions, not variables/types."
}
```

Convenção forte: tipo `ServerAction<I, O> = (input: I) => Promise<Result<O, AppError>>` declarado em `lib/contracts/`, e ESLint `@typescript-eslint/explicit-function-return-type` ligado em `**/_actions/*` força você a anotar o retorno (que então é validado contra o tipo).

Estrutura recomendada:

```ts
// app/(app)/workouts/_actions/index.ts
'use server'
export { createWorkout } from './create-workout.action'
export { updateWorkout } from './update-workout.action'
```

Cada action em arquivo próprio (`_actions/*.action.ts`), naming-enforced via ESLint `unicorn/filename-case` + glob específico em CI.

---

## TABELA CANÔNICA — Greenfield 2026 Solo + Claude Code (desafit.app)

| Ferramenta / config                                                                   | Propósito                            | Decisão                     | Motivo                                              |
| ------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------- | --------------------------------------------------- |
| **Claude Code core**                                                                  |                                      |                             |                                                     |
| `CLAUDE.md` < 200 linhas + `@imports`                                                 | Memória entre sessões                | **Adotar [E]**              | Doc oficial; arquivos longos são ignorados          |
| `.claude/rules/*.md` com `paths:`                                                     | Regras contextuais sob demanda       | **Adotar [E]**              | Carregamento lazy = economia de tokens              |
| Slash commands (`/adr`, `/release-check`)                                             | Workflows determinísticos            | Adotar 2-3 [I]              | Comece pequeno; agora preferido é `.claude/skills/` |
| `.claude/skills/*`                                                                    | Capacidades auto-invocáveis          | [I] após observar repetição | Auto-invoke é inconsistente — comece com commands   |
| Subagents custom (reviewer)                                                           | "Trust but verify"                   | [I] após stack firmar       | Cherny não customiza; só depois                     |
| **Hook PreToolUse bloqueia `eslint-disable`**                                         | Mata 830 disables na raiz            | **Adotar [E]**              | Único caminho determinístico                        |
| Hook PreToolUse bloqueia edição de `legacy/`                                          | Migrações controladas                | [I] se houver legacy        | N/A em greenfield                                   |
| Hook PostToolUse: prettier + eslint --fix                                             | Format-on-write                      | **Adotar [E]**              | Padrão Pixelmojo; ROI imediato                      |
| Hook UserPromptSubmit: vocabulário                                                    | Lembrete a cada prompt               | **Adotar [E]**              | Combate direto à dor de vocabulário                 |
| **MCP**                                                                               |                                      |                             |                                                     |
| shadcn MCP                                                                            | Adicionar componentes via prompt     | **Adotar [E]**              | Stack-specific                                      |
| Supabase MCP                                                                          | Schema/RLS/migrations                | **Adotar [E]**              | Stack-specific                                      |
| Context7 MCP                                                                          | Docs atuais de libs                  | **Adotar [E]**              | Evita API velha (Next 16, Zod 4, Tailwind v4)       |
| Playwright MCP                                                                        | E2E driven by agent                  | [I]                         | Quando começar e2e                                  |
| Vercel MCP                                                                            | Logs/deploys                         | [I]                         | Após go-live                                        |
| **TypeScript / ESLint**                                                               |                                      |                             |                                                     |
| `strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes + noImplicitOverride` | Type safety                          | **Adotar [E]**              | Custo nulo em greenfield, ROI alto                  |
| `typescript-eslint strict-type-checked + stylistic-type-checked`                      | Lint pesado                          | **Adotar [E]**              | Doc oficial recomenda para devs proficientes        |
| `@eslint-community/eslint-comments/no-use`                                            | Bane `eslint-disable` total          | **Adotar [E]**              | Resolve dor das 830 supressões                      |
| `unicorn/no-abusive-eslint-disable`                                                   | Reforço                              | **Adotar [E]**              | Cinto + suspensório                                 |
| `no-restricted-imports` (framer-motion, legacy, supabase admin)                       | Travar stack                         | **Adotar [E]**              | Resolve drift de stack                              |
| `id-denylist` (intake, wizard, student, trainer)                                      | Travar vocabulário                   | **Adotar [E]**              | Resolve drift de vocabulário                        |
| `max-lines: 300`, `max-lines-per-function: 60`, `complexity: 12`                      | Anti-overengineering                 | **Adotar [E]**              | Resolve overengineering das 30+ camadas             |
| `eslint-plugin-better-tailwindcss`                                                    | Tailwind v4 nativo                   | **Adotar [E]**              | Único que suporta v4                                |
| `eslint-plugin-react-hooks`, `jsx-a11y`, `promise`, `import`, `unicorn`               | Plugins core                         | **Adotar [E]**              | Defaults sanos                                      |
| `@softarc/sheriff` (boundaries)                                                       | Limites de módulo                    | **Adotar [E]**              | Resolve cross-import `lib/data` → `app/`            |
| `dependency-cruiser` (CLI)                                                            | Detectar circular/orphan             | [I] no CI                   | Complementar quando sheriff não basta               |
| `eslint-plugin-functional`                                                            | Imutabilidade rigorosa               | **Passar [O]**              | Custo alto, ganho marginal solo                     |
| Custom ESLint plugin caseiro                                                          | Regras de domínio                    | **Passar [O]**              | Cobertura via no-restricted-\* basta                |
| `eslint-plugin-i18next`                                                               | Hardcoded strings                    | [I]                         | Quando i18n entrar                                  |
| **Contratos**                                                                         |                                      |                             |                                                     |
| Zod 4 em `lib/contracts/`                                                             | Single source of truth               | **Adotar [E]**              | Fundação de tudo                                    |
| `Result<T, E>` discriminated union                                                    | Server Actions                       | **Adotar [E]**              | Sobrevive refactor                                  |
| `@hookform/resolvers/standard-schema`                                                 | RHF + Zod 4                          | **Adotar [E]**              | Workaround dos bugs de discriminatedUnion           |
| Supabase types gen + CI drift check                                                   | Schema↔código sync                   | **Adotar [E]**              | Doc oficial supabase/setup-cli                      |
| Adapter `fromRow()`                                                                   | Persistence ↔ domain                 | **Adotar [E]**              | Resolve acoplamento direto                          |
| OpenAPI generation                                                                    | Multi-cliente                        | **Passar [O]**              | YAGNI para mono-app                                 |
| tRPC                                                                                  | Type-safe API                        | **Passar [O]**              | Server Actions ganham para mono-app                 |
| **Pre-commit / CI**                                                                   |                                      |                             |                                                     |
| Husky + lint-staged                                                                   | Pre-commit pequeno                   | **Adotar [E]**              | < 5s típicos                                        |
| pnpm caching no GHA                                                                   | Velocidade CI                        | **Adotar [E]**              | actions/setup-node cache:pnpm                       |
| `pnpm typecheck` no CI                                                                | Type safety full                     | **Adotar [E]**              | Não-negociável                                      |
| `pnpm lint --max-warnings 0 --no-inline-config`                                       | Zero warnings + zero disables locais | **Adotar [E]**              | Anti drift                                          |
| Knip                                                                                  | Dead code / unused deps              | **Adotar [E]**              | Plugin Next/size-limit built-in                     |
| size-limit + GitHub action                                                            | Bundle budget                        | **Adotar [E]**              | Next 16 removeu per-route stats                     |
| Playwright CI com cache                                                               | E2E                                  | **Adotar [E]**              | Cache `~/.cache/ms-playwright`                      |
| Vitest + coverage                                                                     | Unit/contract tests                  | **Adotar [E]**              | Vitest é default da stack                           |
| Lighthouse CI                                                                         | Perf regressions                     | [I]                         | Após primeiros fluxos                               |
| axe-core em e2e                                                                       | A11y                                 | [I]                         | Após UI shell estável                               |
| commitlint                                                                            | Conventional commits                 | [I]                         | Útil para changelog automático                      |
| Lefthook                                                                              | Substituto Husky paralelo            | [I]                         | Husky basta para solo                               |
| Turborepo                                                                             | Cache de tasks                       | **Passar [O]**              | Single app, sem ROI                                 |
| **Anti-refactor**                                                                     |                                      |                             |                                                     |
| ADRs em `docs/adr/*.md`                                                               | Decisões rastreáveis                 | **Adotar [E]**              | Resolve 10 reversões                                |
| Vertical slices + `lib/contracts` + `lib/supabase` + `features/` (3 camadas)          | Estrutura                            | **Adotar [E]**              | Vence FSD puro para solo                            |
| FSD puro 5 camadas                                                                    | Idem                                 | **Passar [O]**              | Overhead cognitivo                                  |
| `renovate.json` restritivo (major desabilitado)                                       | Pinagem                              | **Adotar [E]**              | Resolve majors acidentais                           |
| Rule-of-three docs no CLAUDE.md                                                       | Anti premature abstraction           | **Adotar [E]**              | Resolve 30+ camadas                                 |
| Regra "service layer só com 3 critérios"                                              | Anti service-vazio                   | **Adotar [E]**              | Resolve overengineering específico                  |
| **Living docs**                                                                       |                                      |                             |                                                     |
| `docs/adr/` + slash command `/adr`                                                    | Decision log                         | **Adotar [E]**              | Combate reversões                                   |
| Auto-injection routes/actions index                                                   | Drift detection                      | [I]                         | Quando rotas passarem ~20                           |
| Hook lint-claude-md                                                                   | Tamanho/imports válidos              | [I]                         | Defesa contra crescimento                           |
| **Stack-specific**                                                                    |                                      |                             |                                                     |
| Tailwind v4 `@theme` tokens em `globals.css`                                          | Design tokens                        | **Adotar [E]**              | Doc oficial                                         |
| `eslint-plugin-better-tailwindcss`                                                    | Bloqueia `bg-[#hex]`                 | **Adotar [E]**              | Resolve sprawl de hex                               |
| Bane `framer-motion` import                                                           | Stack canônico                       | **Adotar [E]**              | Resolve vocabulário stack                           |
| `lib/supabase/{client,server,admin}` + `server-only`                                  | Isolation                            | **Adotar [E]**              | Resolve admin em client                             |
| Restrição import `@supabase/supabase-js` direto                                       | Forçar wrapper                       | **Adotar [E]**              | Resolve `createClient()` espalhado                  |
| Server Actions com Result + naming `*.action.ts`                                      | Convenção                            | **Adotar [E]**              | Resolve mutações erráticas                          |
| next-intl 4 + `i18next/no-literal-string`                                             | Strings traduzidas                   | [I]                         | Quando i18n entrar                                  |

---

## MAPEAMENTO EXPLÍCITO — Cada dor do projeto anterior ↔ Guardrail

| Dor anterior                                                              | Guardrails que previnem                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **~150-170h de refatoração desnecessária**                                | TS strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` (2.1); Sheriff boundaries (2.3); `max-lines/complexity` (2.1/5.1); contratos Zod 4 + Result em `lib/contracts/` (3.1/3.2); types.gen do Supabase com drift check (3.3); Plan mode + ADRs (1.6/7.2).          |
| **~830 `eslint-disable` inline**                                          | `@eslint-community/eslint-comments/no-use` (2.2); `unicorn/no-abusive-eslint-disable` (2.2); PreToolUse hook bloqueando edição com disable (1.6); CI grep-disables job (4.3); `lint --no-inline-config --max-warnings 0` (4.1/4.3).                                                |
| **30+ camadas de overengineering**                                        | `max-lines: 300` + `complexity: 12` + `max-depth: 4` (2.2/5.1); Rule-of-three doc no CLAUDE.md (5.3); regra de "service layer só com 3 critérios" (5.3); estrutura fixa em 3 camadas (5.2); Sheriff (cada nova camada vira tag explícita).                                         |
| **10 decisões arquiteturais revertidas**                                  | ADRs leves + slash command `/adr` (1.3/6.2); renovate restritivo bane majors automáticos (5.4); stack pinned no CLAUDE.md + lock no `package.json` (1.1); Plan mode obrigatório > 1 arquivo (7.3); UserPromptSubmit hook lembrando convenções (1.6).                               |
| **Vocabulário inconsistente (intake/wizard/student/trainer + traduções)** | `id-denylist` ESLint (2.2); `no-restricted-imports` para módulos legacy (2.2); UserPromptSubmit hook (1.6); seção "Vocabulary" no CLAUDE.md (1.1); naming-cased filenames via `unicorn/filename-case`.                                                                             |
| **Drift CLAUDE.md ↔ código**                                              | CLAUDE.md curto < 200 linhas + `@imports` (1.1); `.claude/rules/` com `paths:` carregamento contextual (1.2); auto-injection script de rotas/actions (6.1); doc-ref check em CI (6.4); ADRs no lugar de prosa em CLAUDE.md (6.2/6.3); fonte da verdade = código + contratos (6.3). |

---

## Roadmap de implementação (semana 1 do greenfield)

**Dia 1** — Bootstrap mínimo defensivo:

1. `pnpm create next-app` com TS + ESLint + Tailwind v4.
2. `tsconfig.json` com as 4 flags strict extras (Seção 2.1).
3. `eslint.config.ts` flat com `strict-type-checked` + plugins essenciais (2.2).
4. CLAUDE.md curto + 3 `.claude/rules/` (server-actions, supabase, tailwind) (1.1, 1.2).
5. Husky + lint-staged com `--max-warnings 0 --no-inline-config` (4.1).
6. 3 hooks Claude Code: block-disables (PreToolUse), format-on-write (PostToolUse), vocab-reminder (UserPromptSubmit) (1.6).
7. `docs/adr/0001-stack.md` registrando todas as decisões iniciais.

**Dia 2-3** — Contratos e Supabase: 8. `lib/contracts/` com Result, AppError, primeiro schema. 9. `lib/supabase/{client,server,admin}` com `server-only` (8.3). 10. `pnpm db:types` + GHA `db-types.yml` drift check (3.3). 11. Sheriff config inicial com 3 tags (feature, shared, data) (2.3).

**Dia 4-5** — CI completo + MCP: 12. GHA `ci.yml`: typecheck → lint → knip → grep-disables → vitest → size-limit (4.3). 13. MCPs: shadcn, Supabase, Context7 (1.7). 14. Primeiro vertical slice de exemplo (`features/example/`) para Claude usar como template (5.2).

**Semana 2+** — Incrementos guiados por dor real:

- Playwright + CI quando primeiro fluxo crítico estiver pronto.
- Reviewer subagent quando volume de mudanças passar de ~5 PRs/semana.
- Lighthouse CI quando primeira tela pública for ao ar.
- next-intl quando segundo idioma entrar no roadmap.

---

**Princípio final.** O projeto anterior virou pântano porque as decisões eram **conversas** e não **arquivos versionados**. Cada guardrail dia-1 acima troca uma conversa por um arquivo (ADR, rule, schema, hook). O Claude Code é poderoso o suficiente para construir muito rápido — e por isso mesmo, são os **freios** (não os aceleradores) que determinam se o `desafit.app` chega a produção com 0 disables, vocabulário único, e zero refator não planejado.
