# 04 — Camadas e Import Boundaries

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Direção de dependência + guards de import.
> Causa raiz: `lib/data/` importando `app/` foi 1 dos sintomas de refator 150h.

---

## 1. Direção de dependência (inviolável)

```
        ┌──────────────────────────────────────┐
        │  app/ (rotas + Server Actions)       │
        └──────────────┬───────────────────────┘
                       │ pode importar ↓
        ┌──────────────▼───────────────────────┐
        │  components/ (UI puro)               │
        │  lib/hooks/ (estado React)           │
        └──────────────┬───────────────────────┘
                       │ pode importar ↓
        ┌──────────────▼───────────────────────┐
        │  lib/api/ (helpers Server Action)    │
        │  lib/data/ (IO Supabase)             │
        └──────────────┬───────────────────────┘
                       │ pode importar ↓
        ┌──────────────▼───────────────────────┐
        │  lib/contracts/ (SSOT — Zod schemas) │
        │  lib/domain/ (lógica pura)           │
        │  lib/supabase/ (clients)             │
        │  lib/design/ (tokens, contrast)      │
        │  lib/i18n/, lib/email/, lib/utils/   │
        └──────────────────────────────────────┘
```

**Regra absoluta:** dependência **só desce**. Subir = erro Sheriff lint.

Sub-pasta nunca importa irmã horizontal exceto via tag explícita
(`type:shared` pode importar `type:shared`).

---

## 2. Sheriff tags (D-G57)

`sheriff.config.ts`:

| Pasta | Tags |
|---|---|
| `app/(*)` | `type:feature`, `scope:web` |
| `app/(*)/(*)` | `type:feature`, `scope:web` |
| `components/ui` | `type:shared` |
| `components/(*)` | `type:feature`, `scope:web` |
| `lib/contracts` | `type:shared` |
| `lib/contracts/(*)` | `type:shared` |
| `lib/domain` | `type:shared` |
| `lib/data` | `type:data`, `side:server` |
| `lib/data/(*)` | `type:data`, `side:server` |
| `lib/supabase` | `type:data`, `side:server` |
| `lib/api` | `type:shared`, `side:server` |
| `lib/design` | `type:shared` |
| `lib/hooks` | `type:shared` |
| `lib/auth` | `type:shared` |
| `lib/email` | `type:shared`, `side:server` |
| `lib/i18n` | `type:shared` |
| `lib/utils` | `type:shared` |

`depRules`:
- `type:feature` → `[type:feature, type:shared, type:data]`
- `type:data` → `[type:shared]`
- `type:shared` → `[type:shared]`
- `side:server` → `noTag` (não importável de Client Component)
- root → `[type:feature, type:shared]`

`enableBarrelLess: true` — proíbe re-export que esconde acoplamento.

---

## 3. `'use client'` guard

Server-only files (lista exaustiva ESLint override):

- `**/_actions/**/*.{ts,tsx}` (Server Actions)
- `lib/supabase/server.ts`
- `lib/supabase/admin.ts`
- `lib/email/**/*` (Resend wrappers + templates server-rendered)
- `app/api/**/route.ts` (route handlers)

Override em `eslint.config.ts`:

```
no-restricted-syntax: error em
  ExpressionStatement[expression.value='use client']
  message: "Server-only file. 'use client' forbidden."
```

**Razão:** `'use client'` em Server Action vira bug silencioso — directive
fica sem efeito mas componente pode ser bundled errado.

---

## 4. Admin client guard

`lib/supabase/admin.ts` força `import 'server-only'` (convenção Next.js — quebra build se importado de Client Component).

ESLint `no-restricted-imports`:

| Pattern | Mensagem |
|---|---|
| `@supabase/supabase-js` direto | `Use lib/supabase/{client,server}. NEVER createClient() directly.` |
| `@/lib/supabase/admin` em client | `Admin client only in supabase/functions/** and supabase/migrations.` |

`lib/supabase/index.ts` re-exporta **somente** `client` + `server`. **Admin nunca é exportado daqui** — quem precisa importa via path absoluto `@/lib/supabase/admin` e essa pasta tem allowlist hardcoded (Edge Functions + jobs admin).

Detalhes: master plan §16.17b · pesquisa 04 §8.3.

---

## 5. Import bans (lint enforce)

`no-restricted-imports` paths + patterns:

| Banido | Substituto |
|---|---|
| `framer-motion` | `motion` / `motion/react` (Motion 12) |
| `**/legacy/**` | Não existe no greenfield |
| `@supabase/supabase-js` direto | Wrapper em `lib/supabase/{client,server}` |
| `@/lib/supabase/admin` em client | Server-only (Edge Functions + migrations) |
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` (deprecado) |
| `lucide-react` namespace (`import * as Icons`) | Named imports (`import { Dumbbell } from 'lucide-react'`) — preserva tree-shake |

Detalhes: master plan §2.3 · pesquisa 04 §2.2.

---

## 6. Barrel files proibidos (D-G — Research C)

`enableBarrelLess: true` no Sheriff bloqueia:

- `components/ui/index.ts` re-exportando tudo
- `lib/icons.ts` re-exportando Lucide
- `lib/motion.ts` re-exportando Motion

**Razão:** mesmo com `sideEffects: false`, Turbopack/Webpack às vezes
falham em tree-shake através de re-exports profundos, especialmente quando
módulos intermediários tocam globals (pesquisa 10 §B antipattern #5).

Importar cada coisa direto do caminho dela:
- `import { Button } from '@/components/ui/button'`
- `import { Dumbbell } from 'lucide-react'`
- `import { motion } from 'motion/react'`

---

## 7. Componentes — RSC default

Padrão:

- **Server Component** é o default. `'use client'` exige justificativa em PR.
- Components em `components/ui/` (shadcn) já vêm marcados pelo registry — não alterar.
- Custom components que rodam só visual + composição (Heading, Text, Eyebrow, Metric, Section, Stack, etc) **ficam Server Components** (sem `'use client'`).
- `'use client'` obrigatório só pra: hooks React (useState/useEffect/useTransition), event handlers (onClick), Motion 12, vaul Drawer, AnimatePresence, useRouter, dnd-kit.

Tamanho max `'use client'` file: **200 linhas** (override `max-lines` em glob).

`components/motion/client.tsx` re-exporta `{ motion, AnimatePresence, MotionConfig, LayoutGroup, useReducedMotion }` de `motion/react` — esse wrapper é o único `'use client'` que toca Motion. Outros componentes importam dali (não direto de `motion/react`), permitindo Server Components renderizarem children passados como JSX.

Detalhes: pesquisa 08 §A7 (ClientMotion wrapper) · master plan §10.

---

## 8. Hooks — `lib/hooks/`

- Estado React puro (`useState`, `useEffect`, `useTransition`, `useOptimistic`)
- Nunca wrapper de query Supabase (Server Components fazem isso direto)
- `use-*.ts` naming kebab
- 1 hook por arquivo · sem barrel `lib/hooks/index.ts`
- Importa de `lib/contracts/`, `lib/domain/`, `lib/design/` — nunca de `lib/data/`

Hooks essenciais dia 1:
- `use-responsive` (matchMedia mobile/desktop)
- `use-server-action` (wrap `useTransition` + Result handling)
- `use-debounce`
- `use-unsaved-changes`
- `use-focus-not-obscured` (A11y)
- `use-keyboard-inset` (visualViewport iOS — pesquisa 15)
- `use-copy` (clipboard com feedback)
- `use-auto-persist` (pagehide + visibilitychange pra iOS PWA state)

---

## 9. Domain — `lib/domain/`

- **Pura** — zero IO, zero React, zero `'use client'`
- Importa só `lib/contracts/` (tipos + schemas)
- Testável isolada (Vitest sem mocks)
- Exemplos: `roles.ts`, `money.ts` (Money value object), `nutrition.ts` (Mifflin-St Jeor TDEE/macros), `ai/*` (engine determinístico — não prompts)

**Prompts vivem em `public.ai_prompts` (banco)** com versionamento, **não em `lib/domain/`**. Decisão `reference_ai_engineering` na memória.

---

## 10. Data — `lib/data/`

- IO Supabase (`(client, ...args) => Promise<T>`)
- Lança erro (não retorna Result) — Server Action wrap
- Adapter `fromRow()` na borda
- Sem React, sem `'use client'`, sem `useState`
- Importa de `lib/contracts/`, `lib/supabase/`, `lib/domain/`
- **NUNCA** importa de `app/` ou `components/` (Sheriff bloqueia)

1 arquivo por entidade (ex: `lib/data/programs.ts`, `lib/data/tenants.ts`). Sem barrel.

---

## 11. UI orchestration — `app/`

- `page.tsx` Server Component default — fetch via `lib/data/`, passa props pra components
- `actions.ts` ou `_actions/<name>.action.ts` — Server Action `'use server'`
- `loading.tsx` / `error.tsx` / `not-found.tsx` per route
- Layout (`layout.tsx`) Server Component sempre — passa children
- **NUNCA chama Supabase direto em `page.tsx`** — usa `lib/data/`

Route groups (sem entrar em URL):
- `(auth)` — login/signup/forgot-password/reset/verify-email
- `(setup)` — setup pós-signup (fase 2 SaaS público)
- `(shell)` — painel profissional
- `(client)` — PWA aluno
- `(admin)` — painel admin plataforma
- `(public)` — landing/vendas/captação por tenant `[slug]`
- `(legal)` — lgpd/privacy/terms/cookies

---

## 12. CI safety net (dependency-cruiser opcional)

Sheriff cobre 95%. Para detecção de circular dependencies cross-package
ou orphan files, `dependency-cruiser` roda no CI como complemento [I]:

```
pnpm exec depcruise lib app components
  --include-only "^(lib|app|components)"
  --output-type err
```

Falha PR se circular detectado.

Detalhes: pesquisa 04 §2.3 · master plan §1.6.

---

## 13. Anti-patterns proibidos

| Anti-pattern | Detecção |
|---|---|
| `lib/data/foo.ts` import de `app/...` | Sheriff `type:data` não pode importar `type:feature` |
| `lib/data/foo.ts` import de `components/...` | Idem |
| Component `'use client'` import de `lib/email/...` (Resend server) | Sheriff `side:server` não importável de noTag |
| Component import direto de `lib/supabase/admin` | `no-restricted-imports` + `server-only` quebra build |
| Barrel `lib/icons.ts` re-exportando Lucide | Sheriff `enableBarrelLess` |
| Componente `'use client'` em arquivo `*.action.ts` | `no-restricted-syntax` override em glob `_actions/**` |
| `useState` em Server Component | TS reclama (hook fora de Client Component) |
| Server Action sem retorno tipado `Result<T, AppError>` | `explicit-function-return-type` em glob `_actions/**` |
| Circular dependency cross-module | dependency-cruiser CI |

---

## 14. Hooks Claude Code complementares (defesa dia 0)

`.claude/hooks/block-disables.sh` (PreToolUse Edit|Write|MultiEdit):
- Bloqueia `eslint-disable`, `@ts-ignore`, `@ts-nocheck` em arquivos editados (deny + reason)

`.claude/hooks/format-on-write.sh` (PostToolUse):
- Roda Prettier + ESLint --fix no arquivo escrito

`.claude/hooks/vocab-reminder.sh` (UserPromptSubmit):
- Injeta `additionalContext` com vocabulário banido + canônico

Detalhes: pesquisa 04 §1.6 · master plan §27.3.

---

## Referências

- `00-PROJETO.md` §8 (hierarquia de busca)
- `01-arquitetura.md` (camadas detalhadas)
- `_CONFLITOS.md` #8 (shadcn 100%) · #12 (lint enforcement)
- Master plan §1.6 (Sheriff) · §2.3 (ESLint flat config) · §3 (camadas) · §16.17b (Supabase client structure)
- Pesquisa 04 §2.3 (boundaries) · §8.3 (Supabase client) · §1.6 (hooks)
- Pesquisa 08 §A7 (ClientMotion pattern)
- `.claude/rules/architecture-layers.md` (path-scoped reinforcement)

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — Sheriff tags + 'use client' guard + admin guard + barrel ban | Leandro |
