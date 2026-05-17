# INSTALL MANIFEST — tudo num lugar só

> Lista consolidada pra Claude Code instalar tudo em sequência otimizada.
> Gerado a partir de `docs/blueprint/02-stack.md`, `17-repo-bootstrap.md`, `_boilerplate/`.

---

## 0. Pré-requisitos sistema (você confirma antes de começar)

```bash
node -v        # ≥ 24.0.0 LTS
pnpm -v        # ≥ 10.0.0
git --version  # ≥ 2.40
gh --version   # GitHub CLI
```

---

## 1. Scaffold Next.js (você roda 1×)

```powershell
pnpm create next-app@latest . --typescript --app --turbo --tailwind --eslint --no-src-dir --import-alias "@/*"
```

Aceitar defaults. Após scaffold rodar `pnpm dev` em :3000 → matar.

---

## 2. Dependências runtime (Claude instala em paralelo após scaffold)

### Chunk A — Core stack (paralelo OK)
```powershell
pnpm add @supabase/ssr @supabase/supabase-js zod react-hook-form @hookform/resolvers next-intl motion lucide-react vaul sonner date-fns
```

### Chunk B — AI
```powershell
pnpm add ai @ai-sdk/anthropic
```

### Chunk C — Email
```powershell
pnpm add resend react-email @react-email/components
```

### Chunk D — PWA
```powershell
pnpm add @serwist/next @serwist/turbopack idb-keyval
```

### Chunk E — Observability
```powershell
pnpm add @sentry/nextjs posthog-js
```

### Chunk F — Validation / utilities
```powershell
pnpm add apca-w3 server-only
```

---

## 3. Dependências dev (Claude instala em paralelo)

### Chunk G — Test + linting
```powershell
pnpm add -D vitest @vitest/ui happy-dom @playwright/test @ladle/react knip size-limit @size-limit/preset-app
```

### Chunk H — Git hooks + commits
```powershell
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

### Chunk I — ESLint + TypeScript
```powershell
pnpm add -D @softarc/eslint-plugin-sheriff eslint-plugin-jsx-a11y eslint-plugin-i18next eslint-plugin-simple-import-sort eslint-plugin-unused-imports @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier prettier-plugin-tailwindcss
```

### Chunk J — Vercel
```powershell
pnpm add -D @vercel/config
```

### Chunk K — Types
```powershell
pnpm add -D @types/node tsx blurhash
```

---

## 4. MCPs Claude Code (você verifica que estão configurados)

Já devem estar disponíveis nesta sessão. Conferir em `.claude/settings.json`:

| MCP | Pra que |
|---|---|
| `mcp__supabase__*` | apply_migration, list_tables, get_logs, execute_sql |
| `mcp__shadcn__*` | add components, audit, listar registries |
| `mcp__context7__*` | fetch docs atuais (Next 16, React 19, Tailwind v4, Motion 12) |
| `mcp__plugin_vercel_vercel__*` | deploy, logs, env vars |

Se faltar algum: configurar via Claude Code settings (não bloqueia install).

---

## 5. shadcn 100% — primeiros 15 componentes

```powershell
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add button input label textarea card dialog sheet drawer dropdown-menu select checkbox switch tabs tooltip skeleton
```

Aceita: TypeScript · style **new-york** · base color **neutral** · CSS variables yes · `@/components`/`@/lib` · server components yes.

---

## 6. Husky (após git init)

```powershell
pnpm exec husky init
# Sobrescreve .husky/pre-commit, commit-msg, pre-push com versões do boilerplate
```

---

## 7. Validação dia 0 (Claude roda no final)

```powershell
pnpm typecheck                            # 0 erros
pnpm vocab:audit                          # 0 hits
pnpm i18n:audit                           # 0 hits
pnpm token:audit                          # 0 hits
pnpm audit:disables                       # apenas allowlist
pnpm lint --max-warnings 0                # 0/0
pnpm knip                                 # 0 dead exports
pnpm test                                 # 100%
pnpm build                                # verde
pnpm size                                 # budgets verdes
```

---

## 8. Migration baseline (Claude aplica via MCP)

Após deps instaladas + `.env.local` validado:

```
mcp__supabase__apply_migration({
  project_id: "iwratzqavdvpimsljjmq",
  name: "0001_initial",
  query: <gerar SQL conforme docs/blueprint/_boilerplate/supabase/migrations/0001_initial.md>
})
```

Validar:
```
mcp__supabase__list_tables({ schemas: ["platform", "public"] })
# Esperado: ~24 tabelas em platform + tabelas auth do public
```

---

## 9. VSCode extensions (você instala 1×)

Recomendadas:
- **ESLint** (Microsoft)
- **Prettier — Code formatter** (Esbenp)
- **Tailwind CSS IntelliSense** (Tailwind Labs)
- **Error Lens** (Alexander)
- **GitLens** (GitKraken)
- **MDX** (unifiedjs) — pra blueprints/ADRs
- **Even Better TOML** — configs
- **vscode-icons** — visual

Opcional:
- **Pretty TypeScript Errors** (yoavbls) — erros TS legíveis
- **Markdown All in One** (Yu Zhang)

---

## 10. Ordem de execução otimizada

```
PARALELO (3 terminais ao mesmo tempo):

T1 (auto via Claude):                   T2 (você):           T3 (você):
─────────────────────                   ───────────────       ───────────────
Chunks A-F runtime deps                 Dashboard Vercel:     Browser:
   ↓                                    - import GitHub      verifica DNS
Chunks G-K dev deps                     - link Supabase ENV   desafit.app
   ↓                                    - copia tokens
shadcn init + add 15
   ↓
Husky init + overwrite hooks
   ↓
typecheck + lint + test + build
   ↓
Migration via MCP
   ↓
mcp__supabase__list_tables (validação)
```

Estimativa total: ~20 min (vs ~60 min sequencial).

---

## 11. Quando algo der errado

- **Dep não encontrada / 404 pnpm:** rodar `pnpm store prune` + retry
- **TypeScript erros após install:** `pnpm dedupe` + restart TS server VSCode
- **ESLint trava:** `pnpm exec eslint --debug app/ | head -50` pra ver primeiros conflicts
- **Migration falhou:** ler `mcp__supabase__get_logs({ service: "postgres" })` antes de retry
- **Build trava em Serwist:** fallback Webpack (ADR-0014 §Fallback) → criar ADR-0027 documentando se acionar
