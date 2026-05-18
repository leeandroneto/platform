# 17 — Repo Bootstrap (passo-a-passo executável)

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Como criar o repo `desafit/` greenfield do zero. Operacional, comandos exatos.
> Complemento executável do `15-bootstrap-checklist.md` (este foca em comandos shell + ENVs + integração externa).

---

## 1. Pré-requisitos

| Requisito         | Versão mínima                         | Verificar                                         |
| ----------------- | ------------------------------------- | ------------------------------------------------- |
| Node.js           | 24.0.0 LTS                            | `node -v`                                         |
| pnpm              | 10.0.0                                | `pnpm -v` (install: `corepack enable pnpm`)       |
| Git               | 2.40+                                 | `git --version`                                   |
| Conta Vercel      | —                                     | `vercel --version` (instalar: `pnpm i -g vercel`) |
| Conta Supabase    | —                                     | acessar dashboard supabase.com                    |
| Conta GitHub      | —                                     | `gh --version` (instalar `gh` CLI)                |
| Claude Code       | última estável                        | `claude --version`                                |
| MCPs configurados | shadcn + Supabase + Context7 + Vercel | ver `.claude/mcp.json`                            |

---

## 2. Criar pasta repo (FORA do working dir atual)

```powershell
New-Item -ItemType Directory -Path "C:/Users/leean/Desktop/desafit"
Set-Location "C:/Users/leean/Desktop/desafit"
```

**Importante.** Pasta DEVE ficar fora de `C:/Users/leean/Desktop/onboarding-bio/`. Confusion-proof = separação física. Decisão ADR-0023 (separação repos).

---

## 3. Scaffold Next.js 16 + TS strict + Tailwind v4 + pnpm

```powershell
pnpm create next-app@latest . `
  --typescript `
  --app `
  --turbo `
  --tailwind `
  --eslint `
  --no-src-dir `
  --import-alias "@/*"
```

Aceitar defaults restantes. `pnpm dev` deve subir em `http://localhost:3000`.

---

## 4. Git init + primeiro commit

```powershell
git init -b main
git commit --allow-empty -m "chore: initial empty commit"
git add .
git commit -m "chore: scaffold next-app via create-next-app"
```

---

## 5. Setup ENVs (matriz muda vs reusa)

Criar `.env.local` (gitignored por default Next 16).

### 5.1 Vars que MUDAM (gerar novas no setup)

| Var                                      | Origem                                                        | Comando obter                              |
| ---------------------------------------- | ------------------------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`               | Supabase novo projeto                                         | dashboard → Project Settings → API → URL   |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`   | Supabase novo                                                 | dashboard → API → publishable key          |
| `SUPABASE_SERVICE_ROLE_KEY`              | Supabase novo                                                 | dashboard → API → service_role (⚠️ secret) |
| `SUPABASE_PROJECT_REF`                   | Supabase novo                                                 | URL contém `<ref>.supabase.co`             |
| `NEXT_PUBLIC_APP_URL`                    | `https://desafit.app` (prod) ou `http://localhost:3000` (dev) | manual                                     |
| `SESSION_SECRET`                         | gerado                                                        | `openssl rand -base64 32`                  |
| `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` | Web Push                                                      | `pnpm web-push generate-vapid-keys`        |

### 5.2 Vars que MUDAM domínio dentro da mesma conta

| Var              | Origem                                                 |
| ---------------- | ------------------------------------------------------ |
| `RESEND_API_KEY` | mesma conta Resend, novo domain `desafit.app` verified |
| `SENTRY_DSN`     | mesma org Sentry, novo projeto `desafit-app`           |
| `POSTHOG_KEY`    | mesma org PostHog, novo projeto `desafit-app`          |

### 5.3 Vars que REUSAM (compartilhadas entre projetos)

| Var                                   | Origem                                         |
| ------------------------------------- | ---------------------------------------------- |
| `ANTHROPIC_API_KEY`                   | via Vercel AI Gateway (preferido) — não direto |
| `VERCEL_AI_GATEWAY_API_KEY`           | Vercel dashboard → AI Gateway                  |
| `OPENAI_API_KEY`                      | (se aplicável — eval LLM judge)                |
| `WHATSAPP_CLOUD_TOKEN`                | se mesma conta Meta Business                   |
| `EFI_CLIENT_ID` + `EFI_CLIENT_SECRET` | EFI Bank (cobrança plataforma→prof)            |
| `META_PIXEL_ID` + `META_CAPI_TOKEN`   | Meta Business                                  |
| `GA4_MEASUREMENT_ID`                  | Google Analytics                               |

### 5.4 Vars do profissional (NÃO ficam no env do projeto)

Cada prof traz a dele (Asaas/Pagar.me/MP keys) — armazenadas em `platform.tenant_gateway_credentials` (Supabase Vault) por tenant. Zero hardcoded em `.env`.

---

## 6. Setup Supabase project novo

```
1. Dashboard supabase.com → New Project
2. Org: <fundador> · Name: desafit · Region: sa-east-1 (São Paulo)
3. Password DB: gerar 32-char (gravar em 1Password)
4. Wait ~2min provisionamento
5. Copiar 4 vars pra .env.local (§5.1)
```

Habilitar:

- Database → Extensions: `pgcrypto`, `pg_stat_statements`, `pg_trgm`
- Auth → Providers → Email habilitado
- Auth → Redirect URLs: `http://localhost:3000/auth/callback` + `https://desafit.app/auth/callback`

---

## 7. Setup Vercel project novo + GitHub

```powershell
# 1. Criar repo GitHub
gh repo create desafit/desafit --private --source=. --remote=origin --push

# 2. Vercel link
vercel link
# Selecionar: New Project · Framework: Next.js · Build: pnpm build · Output: .next

# 3. Vercel ENVs (pull do .env.local pro dashboard)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
# ... (todos do .env.local § 5)
```

---

## 8. Setup Vercel AI Gateway

```
1. Vercel dashboard → AI Gateway → Create
2. Configure providers: Anthropic + OpenAI (fallback)
3. Copiar `VERCEL_AI_GATEWAY_API_KEY` pro .env + Vercel env vars
4. Models pinados: claude-sonnet-4-6, claude-haiku-4-5
```

Detalhes pipeline em `07-ai-prompts.md`.

---

## 9. Setup GitHub repo + secrets

```powershell
# Secrets pro CI
gh secret set VERCEL_TOKEN -b "<token>"
gh secret set VERCEL_ORG_ID -b "<org>"
gh secret set VERCEL_PROJECT_ID -b "<project>"
gh secret set SUPABASE_PROJECT_REF -b "<ref>"
gh secret set SUPABASE_DB_PASSWORD -b "<password>"
```

---

## 10. Instalar deps base

```powershell
# Core stack
pnpm add @supabase/ssr @supabase/supabase-js
pnpm add zod react-hook-form @hookform/resolvers
pnpm add next-intl
pnpm add motion
pnpm add lucide-react
pnpm add vaul sonner
pnpm add date-fns

# AI
pnpm add ai @ai-sdk/anthropic

# Email
pnpm add resend react-email @react-email/components

# PWA
pnpm add @serwist/next @serwist/turbopack idb-keyval

# Observability
pnpm add @sentry/nextjs posthog-js

# Validation
pnpm add apca-w3

# Dev deps
pnpm add -D @types/node
pnpm add -D @ladle/react
pnpm add -D vitest @vitest/ui happy-dom
pnpm add -D @playwright/test
pnpm add -D knip
pnpm add -D size-limit @size-limit/preset-app
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
pnpm add -D @softarc/eslint-plugin-sheriff
pnpm add -D eslint-plugin-jsx-a11y eslint-plugin-i18next
pnpm add -D @vercel/config
pnpm add -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
pnpm add -D prettier eslint-config-prettier
```

---

## 11. Setup CI (`.github/workflows/ci.yml`)

Workflow conforme `13-lint-enforcement.md §8`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with: { node-version: '24', cache: 'pnpm' }
      - run: corepack enable pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck
      - run: pnpm vocab:audit
      - run: pnpm i18n:audit
      - run: pnpm token:audit
      - run: pnpm lint --max-warnings 0 --no-inline-config
      - run: pnpm knip
      - run: ./scripts/grep-disables.sh # allowlist check
      - run: pnpm test
      - run: pnpm build
      - run: pnpm size
```

---

## 12. Primeiro deploy preview

```powershell
git add .
git commit -m "chore: dia-0 base config + envs"
git push -u origin main
# Aguardar Vercel auto-deploy preview
vercel ls
# Smoke: abrir <preview-url> deve mostrar Next.js default page
```

---

## 13. Setup `mcp__supabase__apply_migration`

Validar MCP Supabase já configurado no Claude Code:

```powershell
# Em sessão Claude Code:
# > use mcp__supabase__list_projects
# Deve listar projeto desafit novo
```

Se não funcionar: configurar `.claude/mcp.json` apontando pra Supabase token.

---

## 14. Primeira migration (schema baseline `platform.*`)

Executar `mcp__supabase__apply_migration` com schema baseline conforme `06-data-model.md §3` + `15-bootstrap-checklist.md tarefa 25`:

- 2 schemas: `public` (default) + `core` (multi-marca multi-vertical)
- ~22 tabelas baseline (platform.tenants, platform.programs, platform.modules, platform.components, platform.enrollments, platform.progress, platform.payments, etc)
- Trigger `handle_new_user` (cria profile + tenant + membership atomicamente)
- `custom_access_token_hook` (JWT carrega `tenant_id + active_membership_role`)
- RLS pattern `(select public.current_tenant_id())` wrap em todas tabelas tenant-scoped
- 5 storage buckets (avatars, programs-covers, components-media, tenant-logos, brand-assets)

**`onboarding.*` NÃO migra** — fica intacto no Supabase do onboarding-bio (ADR-0023).

---

## 15. Setup Ladle (catálogo componentes)

```powershell
# Já instalado em §10
mkdir .ladle
```

Criar `.ladle/config.mjs`:

```js
export default {
  port: 61000,
  stories: 'components/**/*.stories.tsx',
}
```

Adicionar scripts `package.json`:

```json
{
  "scripts": {
    "ladle:serve": "ladle serve",
    "ladle:build": "ladle build"
  }
}
```

---

## 16. Setup Vitest

Criar `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
})
```

Smoke test em `tests/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
describe('bootstrap', () => {
  it('roda', () => {
    expect(true).toBe(true)
  })
})
```

---

## 17. Validar lint dia 0 (`--max-warnings 0`)

```powershell
pnpm typecheck    # 0 erros
pnpm lint --max-warnings 0 --no-inline-config   # 0/0
pnpm vitest run    # 1 test pass
pnpm build         # build verde
pnpm size          # budgets verdes
```

Se qualquer step falhar → corrigir antes de seguir.

---

## 18. Setup `.claude/hooks/*`

Criar 3 hooks conforme `16-claude-code.md §4`:

```powershell
New-Item -ItemType Directory -Path ".claude/hooks"
# Criar scripts: load-context.sh, vocab-warn.sh, block-disables.sh
# Conteúdo: ver 16-claude-code.md
```

Atualizar `.claude/settings.json` conforme `16-claude-code.md §9`.

---

## 19. Setup `.claude/rules/*.md` (8 arquivos)

Copiar do CHUNK 7 transferência (`18-transferencia.md §2`):

```powershell
New-Item -ItemType Directory -Path ".claude/rules"
# 8 arquivos: naming, layers, abstractions, domain-logic,
# schema-separation, jwt-claims, data-layer, server-actions
# Conteúdo: ver 16-claude-code.md §3
```

---

## 20. Commit + push primeiro estado

```powershell
pnpm typecheck && pnpm lint --max-warnings 0 && pnpm test && pnpm build && pnpm size
git add .
git commit -m "chore: bootstrap dia 0 ~70h — pipeline UI + schema baseline + ci + claude code"
git push origin main
```

Validar:

- CI verde no GitHub Actions
- Vercel preview deploy verde
- Lighthouse `/login` ≥ 90 perf / 100 A11y
- PWA install funciona em iPhone 14 portrait
- Ladle sobe com 15 stories

---

## 21. Gate dia 0 fechado (M0 → M1)

Checklist completo em `15-bootstrap-checklist.md §Gates`. Se todos ✅ → começar Sprint 3 (M1 funil agência).

---

## 22. Próximo

- Sprint 3 (M1): landing institucional + form captação + schema leads
- Sprint 4 (M1): Edge Function `generate-assessment` + WhatsApp handoff
- Sprint 5+ (M2): 1º tenant via vibe coding interno

Detalhes em `12-sprint-plan.md`.

---

## Referências cruzadas

- `00-PROJETO.md` (constituição)
- `15-bootstrap-checklist.md` (30 tarefas detalhadas)
- `16-claude-code.md` (CLAUDE.md + hooks + rules)
- `18-transferencia.md` (o que copia/arquiva/JIT)
- ADR-0021/0025 (schema platform — multi-marca multi-vertical) · 0022 (marca pai) · 0023 (repos separados pra produtos diferentes) · 0024 (multi-brand via hostname)
- Memórias: `project_desafit_separation`, `project_worktree_env_setup`, `feedback_use_apply_migration`

## Histórico

| Data       | Mudança                                                  | Aprovador |
| ---------- | -------------------------------------------------------- | --------- |
| 2026-05-17 | Versão inicial — bootstrap repo passo-a-passo executável | Leandro   |
