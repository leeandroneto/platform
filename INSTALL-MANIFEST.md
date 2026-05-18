# INSTALL MANIFEST — Guia executável end-to-end

> Tudo que Claude Code do platform/ precisa pra bootstrapar do zero ao primeiro deploy.
> Organizado em **8 fases**. Cada fase tem: pré-requisito, ação, validação, troubleshooting.
> Aprendizados aplicados (memória): `pnpm add` deve ser **SERIAL** (paralelo causa race em package.json).

---

## ⚠️ Convenções

- 🟢 **Você roda** — interativo (browser, decisão, copy-paste de keys)
- 🤖 **Claude roda** — automatizado via Bash/MCP
- 🟡 **Híbrido** — Claude prepara, você confirma
- **SERIAL** — comando bloqueante, esperar terminar antes do próximo
- **PARALELO OK** — pode rodar em terminais simultâneos

---

## FASE 0 — Pré-requisitos (status: ✅ feito)

### 0.1 Versões sistema 🟢

```bash
node -v        # ≥ 24.0.0 LTS
pnpm -v        # ≥ 10.0.0
git --version  # ≥ 2.40
gh --version   # GitHub CLI
```

Falta algum? `corepack enable pnpm` ou install via winget.

### 0.2 CLI logins 🟢

```powershell
gh auth login            # GitHub CLI (HTTPS + browser)
# Supabase CLI opcional — usaremos MCP em vez do CLI
# pnpm i -g supabase
# supabase login

# Vercel — fase 4 (após repo no GitHub)
```

### 0.3 VSCode extensions 🟢

- **ESLint** (Microsoft)
- **Prettier** (Esbenp)
- **Tailwind CSS IntelliSense** (Tailwind Labs)
- **Error Lens** (Alexander)
- **GitLens** (GitKraken)
- **MDX** (unifiedjs)
- **Even Better TOML**
- **Pretty TypeScript Errors** (yoavbls)
- **Markdown All in One** (Yu Zhang)

### 0.4 Scaffold Next.js ✅ feito

```powershell
pnpm create next-app@latest . --typescript --app --turbo --tailwind --eslint --no-src-dir --import-alias "@/*"
```

### 0.5 Boilerplate copy ✅ feito (52 arquivos)

- 21 blueprints + 27 ADRs em `docs/`
- 8 rules + 3 hooks + settings.json em `.claude/`
- lib/, app/, scripts/, .github/, .ladle/, .husky/, tests/, root configs

---

## FASE 1 — Dependências (status: ✅ feito + 🟡 correções pendentes)

### 1.1 Aprendizado crítico

**`pnpm add` em paralelo causa race condition em `package.json`.** SEMPRE serial:

```powershell
# ❌ ERRADO (paralelo em 2 terminais)
# T1: pnpm add ...
# T2: pnpm add -D ...

# ✅ CORRETO (sequencial, 1 terminal)
pnpm add @supabase/ssr @supabase/supabase-js zod ...
pnpm add ai @ai-sdk/anthropic
pnpm add -D vitest @vitest/ui ...
```

### 1.2 Correções pós-install 🟡 (executar AGORA)

**#1 react-email duplicado** — `react-email` já reexporta `@react-email/components`:

```powershell
pnpm remove @react-email/components
```

**#3 lucide-react versão suspeita** — 1.16.0 não existe oficialmente:

```powershell
pnpm view lucide-react dist-tags
# Se 'latest' < 1.0.0 → reinstalar limpo:
pnpm remove lucide-react
pnpm add lucide-react@latest
```

**#4 Aprovar build scripts** — necessário pra Sentry sourcemaps, esbuild, MSW mocks:

```powershell
pnpm approve-builds
# Aprovar interativo: @sentry/cli, esbuild, msw, @swc/core, @parcel/watcher, core-js, protobufjs
```

**#2 @ladle/react peer dep React 19** — não bloqueia dia 0. Issue upstream, aguardar 5.2+. Funciona mas pode warning.

**#5 @vercel/config@0.5.0** — pacote oficial novo (2025+). Correto. Confirmação:

```powershell
pnpm view @vercel/config description
```

### 1.3 Limpeza

```powershell
pnpm dedupe    # remove duplicates de transitive deps
pnpm install   # rebuild lockfile clean
```

---

## FASE 2 — Shadcn 100% + Husky (status: pendente) 🤖

### 2.1 Shadcn init

```powershell
pnpm dlx shadcn@latest init
```

Aceita: **new-york** · base **neutral** · CSS variables **yes** · `@/components`/`@/lib` · RSC **yes**.

### 2.2 Componentes — 47 oficiais (SERIAL — 1 comando único)

```powershell
pnpm dlx shadcn@latest add accordion alert alert-dialog aspect-ratio avatar badge breadcrumb button calendar card carousel chart checkbox collapsible command context-menu dialog drawer dropdown-menu form hover-card input input-otp label menubar navigation-menu pagination popover progress radio-group resizable scroll-area select separator sheet sidebar skeleton slider sonner switch table tabs textarea toggle toggle-group tooltip
```

### 2.3 Blocks essenciais (D-G69 + ADR-0008 — 11 blocks dia 0)

```powershell
# Authentication (3 padrões, escolher melhor pro signup Sprint 3)
pnpm dlx shadcn@latest add login-01 login-02 login-04

# Dashboard shell + Sidebar (shell painel prof)
pnpm dlx shadcn@latest add dashboard-01 sidebar-01 sidebar-07

# Charts (painel métricas prof)
pnpm dlx shadcn@latest add chart-area-default chart-bar-default chart-line-default

# Calendar (agenda aluno PWA)
pnpm dlx shadcn@latest add calendar-01
```

### 2.4 Husky setup (IMPORTANTE — não usa `husky init`)

`husky init` cria stub. Já temos os arquivos reais no boilerplate. Só ativar:

```powershell
pnpm exec husky        # ativa Husky (lê .husky/* existentes)
# Confirmar permissões executáveis:
chmod +x .husky/pre-commit .husky/commit-msg .husky/pre-push
```

### 2.5 Princípio shadcn (CLAUDE segue)

Antes de criar componente novo:

1. Grep `components/ui/` — já tem instalado?
2. `pnpm dlx shadcn@latest view <name>` — existe no registry?
3. Pattern comunidade (Origin UI, Magic UI, Credenza, Aceternity)?
4. Custom — **só com ADR justificando**

---

## FASE 3 — Supabase setup completo (status: pendente) 🤖 via MCP

### 3.1 Habilitar extensions

Dashboard Supabase → Database → Extensions, OU via MCP:

```
mcp__supabase__execute_sql({
  project_id: "iwratzqavdvpimsljjmq",
  query: `
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
    CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
  `
})
```

### 3.2 Auth Providers (validar)

Dashboard → Authentication → Providers:

- ✅ Email — enabled, "Enable email signups" on
- ✅ Google — already configured (Client ID + Secret colados)
- Redirect URLs (Settings → Auth → URL Configuration):
  - `http://localhost:3000/auth/callback`
  - `https://desafit.app/auth/callback`
  - `https://*.desafit.app/auth/callback` (wildcard pra subdomain tenant)
  - `https://platform.vercel.app/auth/callback` (preview Vercel)

### 3.3 Storage buckets (5 com policies)

Via MCP:

```
mcp__supabase__execute_sql({
  project_id: "iwratzqavdvpimsljjmq",
  query: `
    INSERT INTO storage.buckets (id, name, public) VALUES
      ('avatars', 'avatars', true),
      ('programs-covers', 'programs-covers', true),
      ('components-media', 'components-media', false),
      ('tenant-logos', 'tenant-logos', true),
      ('brand-assets', 'brand-assets', true)
    ON CONFLICT DO NOTHING;
  `
})
# RLS policies por bucket — Claude gera conforme blueprint/06-data-model.md §8
```

### 3.4 Migration baseline `0001_initial`

```
mcp__supabase__apply_migration({
  project_id: "iwratzqavdvpimsljjmq",
  name: "0001_initial",
  query: <gerar SQL conforme docs/blueprint/_boilerplate/supabase/migrations/0001_initial.md
          + docs/blueprint/06-data-model.md §3
          + adicionar tabelas platform.brands (ADR-0024) + platform.domains (ADR-0026)>
})
```

Inclui:

- 24 tabelas `platform.*` (brands, domains, tenants, profiles, memberships, programs, modules, components, enrollments, progress, payments, subscriptions, coupons, leads, capture_forms, capture_submissions, assessments, workout_logs, achievements, badges, push_subscriptions, tenant_gateway_credentials, import_jobs, progress_photos)
- Trigger `public.handle_new_user`
- Function `public.custom_access_token_hook`
- Function `public.current_tenant_id()`
- RLS pattern `(select public.current_tenant_id())` em todas tabelas tenant-scoped
- Triggers `set_updated_at`

### 3.5 Configurar JWT custom hook

Dashboard → Authentication → Hooks → Custom Access Token Hook:

- Hook type: **Postgres function**
- Schema: `public`
- Function: `custom_access_token_hook`
- Save

### 3.6 Brand seed dia 1

```
mcp__supabase__execute_sql({
  query: `
    INSERT INTO platform.brands (name, host, primary_color_oklch, default_vertical, parent_label, theme_version)
    VALUES ('desafit', 'desafit.app', 'oklch(0.58 0.18 275)', 'fitness', NULL, 1);
  `
})
```

### 3.7 Validação

```
mcp__supabase__list_tables({ schemas: ["platform", "public"] })
# Esperado: ~24 tabelas em platform + auth.users + storage tables
```

Smoke RLS:

```
mcp__supabase__execute_sql({
  query: `
    SET ROLE anon;
    INSERT INTO platform.programs (tenant_id, title) VALUES (gen_random_uuid(), 'test');
    -- Esperado: ERROR (RLS bloqueia)
  `
})
```

---

## FASE 4 — Vercel (status: pendente) 🟡 híbrido

### 4.1 Install CLI 🟢

```powershell
pnpm i -g vercel
vercel login    # browser
```

### 4.2 Criar project + link

```powershell
vercel link
# Selecionar: New Project · Name: platform · Framework: Next.js · Root: .
```

### 4.3 Env vars bulk (via dashboard recommended)

Dashboard Vercel → Project → Settings → Environment Variables → "Import from .env file":

- Upload `.env.local`
- Marca todas como `Production`, `Preview`, `Development`
- ATENÇÃO: TROCAR antes de produção real:
  - `SESSION_SECRET` (gerar: `openssl rand -base64 32`)
  - `SUPABASE_SERVICE_ROLE_KEY` (rotacionar quando sair de dev)

### 4.4 Adicionar domain

Dashboard Vercel → Project → Settings → Domains:

- Add `desafit.app` (já é Vercel-managed → DNS automático)
- Add `*.desafit.app` (wildcard subdomain — pra `joao.desafit.app`, `maria.desafit.app`)
- SSL auto-issued via Let's Encrypt

### 4.5 First deploy

```powershell
git add .
git commit -m "chore: bootstrap dia 0"
git push origin main
# Vercel auto-deploys preview
vercel ls
# Promote pra production quando smoke OK:
vercel --prod
```

---

## FASE 5 — GitHub (status: pendente) 🟢

### 5.1 Secrets pra CI

Obter de Vercel dashboard → Account → Tokens (criar token novo "platform-ci"):

```powershell
gh secret set VERCEL_TOKEN -b "<token>"
gh secret set VERCEL_ORG_ID -b "<obter de .vercel/project.json>"
gh secret set VERCEL_PROJECT_ID -b "<obter de .vercel/project.json>"
gh secret set SUPABASE_PROJECT_REF -b "iwratzqavdvpimsljjmq"
```

### 5.2 GitHub Project board

Seguir `.github/PROJECT.md` (template Kanban completo). Resumo:

```powershell
# Criar project (Board view)
gh project create --owner desafit-app --title "platform — roadmap"

# Linkar com repo
gh project link <project-number> --owner desafit-app --repo platform

# Criar 16 sprint labels + 10 type/priority labels (via dashboard GitHub)
# Detalhes completos em .github/PROJECT.md
```

### 5.3 Branch protection

Dashboard GitHub → Settings → Branches → Add rule pra `main`:

- Require PR before merging
- Require status checks: CI workflow
- Require signed commits (opcional dia 1)

---

## FASE 6 — Web Push Vapid keys (status: pendente) 🤖

```powershell
pnpm add -D web-push
pnpm exec web-push generate-vapid-keys --json
```

Output: `{ publicKey, privateKey }`

Colar no `.env.local`:

```
VAPID_PUBLIC_KEY=<publicKey>
VAPID_PRIVATE_KEY=<privateKey>
```

E adicionar em Vercel env vars (production + preview + development).

---

## FASE 7 — Validação completa (status: pendente) 🤖

```powershell
pnpm typecheck                            # 0 erros
pnpm vocab:audit                          # 0 hits
pnpm i18n:audit                           # 0 hits
pnpm token:audit                          # 0 hits
pnpm audit:disables                       # apenas allowlist
pnpm lint --max-warnings 0                # 0/0
pnpm knip                                 # 0 dead exports
pnpm test                                 # 100% (1 smoke test passa)
pnpm build                                # verde
pnpm size                                 # budgets verdes
```

Se algum falhar → ler `docs/blueprint/13-lint-enforcement.md` pra contexto.

---

## FASE 8 — Ladle smoke + first commit final (status: pendente) 🤖

### 8.1 Story smoke pra validar Ladle setup

Criar `components/ui/button.stories.tsx`:

```tsx
import { Button } from './button'
export const Default = () => <Button>Click me</Button>
```

```powershell
pnpm ladle serve
# Abrir http://localhost:61000 → confirmar story renderiza
```

### 8.2 Commit final + push

```powershell
git add .
git commit -m "chore: bootstrap dia 0 ~70h pipeline UI + schema baseline + ci"
git push origin main
```

Validar:

- CI verde no GitHub Actions
- Vercel preview deploy verde
- `desafit.app` resolve
- Lighthouse `/login` ≥ 90 perf / 100 A11y

---

## DIFERIDO (Sprint 3+)

Configurar quando precisar:

| Item                              | Quando                                  | Como                                         |
| --------------------------------- | --------------------------------------- | -------------------------------------------- |
| Resend domain verify              | Sprint 4 (email transacional Pacote A)  | Dashboard Resend → Add domain → DNS records  |
| Sentry init                       | Sprint 1 final (post-deploy)            | `pnpm dlx @sentry/wizard@latest -i nextjs`   |
| PostHog init                      | Sprint 1 final                          | snippet em `app/layout.tsx` server component |
| Meta Pixel + GA4                  | Sprint 4 (funil agência)                | Components dedicados + env vars              |
| Apple OAuth                       | Quando submeter PWA pra App Store (M5+) | Provider Supabase + Apple Developer setup    |
| Cloudflare for SaaS custom domain | Sprint 14 (1º upgrade A→B Pacote)       | Vercel SDK `projectsAddProjectDomain`        |

---

## CHECKPOINT — Como saber se tá tudo bem

✅ Tudo verde quando:

1. `pnpm build` passa em local + Vercel
2. `mcp__supabase__list_tables` retorna ~24 tabelas em `platform`
3. Signup smoke: signup novo via UI → cria `profiles + tenants + memberships` atomicamente → JWT carrega `tenant_id`
4. Lighthouse local `/login` ≥ 90/100/100/100
5. CI GitHub Actions verde no push
6. `desafit.app` resolve pra Vercel deploy
7. `joao.desafit.app` (subdomain inventado) → 404 graceful (sem tenant cadastrado ainda)
8. Ladle sobe com 1+ stories

---

## TROUBLESHOOTING

| Sintoma                       | Causa                            | Fix                                                    |
| ----------------------------- | -------------------------------- | ------------------------------------------------------ |
| `pnpm add` race conditions    | Paralelo em 2 terminais          | SEMPRE serial em 1 terminal                            |
| Deprecated warnings massivos  | react-email/components duplicado | `pnpm remove @react-email/components`                  |
| lucide-react versão estranha  | Typosquat ou cache pnpm          | `pnpm view lucide-react dist-tags` + reinstalar        |
| Sentry sem sourcemaps em prod | Build script não aprovado        | `pnpm approve-builds`                                  |
| ESLint trava                  | Conflitos custom rules           | `pnpm exec eslint --debug app/ \| head -50`            |
| TypeScript erros pós-install  | Cache TS                         | `pnpm dedupe` + restart TS server VSCode               |
| Migration falhou              | RLS recursivo ou sintaxe         | `mcp__supabase__get_logs({ service: "postgres" })`     |
| Build trava Serwist           | Turbopack incompat edge          | Fallback Webpack (ADR-0014 §Fallback) → criar ADR-0027 |
| Vercel deploy falha           | Env var faltando                 | `vercel env ls`                                        |
| Domain DNS não resolve        | Propagação                       | Aguardar 5-30min, `nslookup desafit.app`               |
| Husky hooks não rodam         | Permissão Windows                | `git config core.hooksPath .husky`                     |
| Ladle React 19 warning        | Peer dep upstream                | Ignorar até @ladle/react 5.2+                          |

---

## REGRA DE OURO

- **Não invente comando.** Tudo aqui foi validado em blueprints/ADRs.
- **Se algo divergir de ADR/blueprint → STOP** e criar ADR novo antes de prosseguir.
- **`pnpm add` SERIAL.** Sempre.
- **Migration SQL one-way door.** Fundador revisa antes de aplicar via MCP.
- **Brand hardcoded é bug.** Use `useBrand()` ou env `NEXT_PUBLIC_DEFAULT_BRAND_HOST`.
