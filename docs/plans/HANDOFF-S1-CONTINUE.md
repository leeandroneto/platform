# Handoff S0 → S1 — pro próximo Claude

> Última atualização: 2026-06-11. Status: S0 ✅ feito. S1 ready to start.
> Este doc é a entrada do próximo Claude no projeto retake.run quando abrir `C:\Users\leean\Documents\retake\`.

## O que foi feito (S0 completo)

### Setup pasta nova `C:\Users\leean\Documents\retake\`

✅ Backup: `C:\Users\leean\Desktop\platform\` intocado (descartar quando confirmado projeto OK)

✅ Estrutura completa criada:

```
retake/
├── .claude/
│   ├── settings.json           # MCPs + permissions + hooks ativos
│   ├── rules/                  # 9 rules retake (naming, design-tokens, layers, etc)
│   └── hooks/                  # 9 hooks executáveis (vocab/handoff/tokens/server-only/etc)
├── .editorconfig, .env.example, .gitignore, .lintstagedrc.json,
│   .mcp.json, .prettierrc      # configs raiz
├── .husky/                     # gerado pelo pnpm install
├── app/                        # vazio — popular em S1
├── components/                 # vazio — popular em S1
├── lib/
│   ├── ai/{providers,prompts}
│   ├── auth/, contracts/, design/, entitlements/, errors/
│   ├── hooks/, i18n/, state/, supabase/, types/, utils/
│   ├── env.ts, ratelimit.ts, utils.ts
├── memory/
│   ├── MEMORY.md               # index
│   ├── project_retake_overview.md
│   ├── project_retake_decisoes_cravadas.md
│   ├── feedback_zero_client_exposure.md
│   ├── feedback_tokens_shadcn_canonical.md
│   └── feedback_composition_in_db.md
├── messages/{pt-BR,en,es}/     # vazios — popular em S1
├── docs/
│   ├── _handoff/               # SSOT do produto (INTOCÁVEL — hook bloqueia)
│   ├── adr/0001-foundation.md
│   ├── blueprint/00-projeto.md
│   ├── plans/
│   │   ├── foundation.md       # sprints S0-S7
│   │   └── HANDOFF-S1-CONTINUE.md  (este arquivo)
│   └── migrations/
│       ├── 0001_purge_pre_retake.sql
│       └── 0002_identity_foundation.sql
├── public/                     # vazio
├── scripts/                    # vazio
├── node_modules/               # ✅ pnpm install rodou
├── CLAUDE.md                   # auto-carrega toda sessão
├── README.md
├── commitlint.config.ts, components.json, next.config.ts, next-env.d.ts,
├── package.json, playwright.config.ts, postcss.config.mjs, proxy.ts,
├── sheriff.config.ts, tsconfig.json, vitest.config.ts, vitest.shims.d.ts
```

### GitHub

✅ Mesmo repo `github.com/leeandroneto/platform.git`

✅ Branch `main` force-pushed com 1 commit fresh: `20f5341 feat(retake): foundation`

✅ Histórico anterior (50+ commits desafit) substituído sem reset (backup local em `Desktop/platform/`)

### Supabase

✅ Project `iwratzqavdvpimsljjmq` (sa-east-1, Postgres 17.6, ACTIVE_HEALTHY)

✅ Migrations aplicadas via MCP:

- `0001_purge_pre_retake` — drop cascade tudo public/platform/run schemas
- `0002_identity_foundation` — party model + 5 tabelas auth + JWT hook + RLS dual-read
- `0002b_fix_touch_updated_at_search_path` — hardening search_path
- `0002c_revoke_touch_updated_at_from_public` — revoke EXECUTE

✅ Tabelas criadas: `parties`, `party_roles`, `party_relationships`, `tenants`, `profiles`, `groups`, `memberships`, `domains`, `audit_log`, `slug_blocklist`

✅ Splinter security advisor: 1 warning restante = `auth_leaked_password_protection` (config Supabase Auth dashboard — não migration)

**AÇÃO PENDENTE manual (não SQL):**

1. Habilitar Leaked Password Protection no [Supabase Auth dashboard](https://supabase.com/dashboard/project/iwratzqavdvpimsljjmq/auth/policies) — Auth → Policies → Password Strength → enable HaveIBeenPwned check

2. Configurar `custom_access_token_hook` no Supabase Auth dashboard — [Auth Hooks](https://supabase.com/dashboard/project/iwratzqavdvpimsljjmq/auth/hooks) → Custom Access Token → enable + apontar pra `public.custom_access_token_hook`

### Dependências

✅ `pnpm install` rodado — 852MB node_modules

⚠️ Warning ignorado: `sharp@0.34.5` e `unrs-resolver@1.12.2` precisam `pnpm approve-builds` se forem necessárias (provavelmente sim — sharp pra image optimization). Rodar quando precisar.

---

## S1 — próximas tarefas (em ordem)

### 1. Tokens + Fonts + globals.css

- [ ] `app/globals.css` com `@theme inline` cravando tokens retake:
  - Vocab shadcn-canonical (--background/--foreground/--primary/--secondary/--muted/--accent/--destructive/--border/--input/--ring/--chart-1..5/--sidebar-\* etc)
  - Valores apontando pros tokens retake (oklch values referenciando handoff DS folder)
  - Extensões opt-in retake: --font-display, --radius-pill, --shadow-warm-100/200/300, --tracking-eyebrow
  - Mobile primitives: --touch-min (44px), --mobile-full-height (100dvh), --inset-safe-\*, --press-scale (0.97)
  - light + dark
- [ ] `app/layout.tsx` raiz importa Oswald + Hanken Grotesk + Space Mono via `next/font/google` e define vars `--font-oswald`/`--font-hanken`/`--font-space-mono`
- [ ] Validar APCA Lc ≥ 60 em todas combinações texto/superfície usando `lib/design/contrast.ts`

### 2. shadcn primitives essenciais

```bash
npx shadcn add button card input label form sheet dialog drawer dropdown-menu sidebar separator badge avatar tabs sonner select textarea checkbox radio-group switch tooltip popover command
```

### 3. Supabase UI auth

```bash
npx shadcn add https://supabase.com/ui/r/password-based-auth.json
npx shadcn add https://supabase.com/ui/r/social-auth.json
```

### 4. i18n config

- [ ] `i18n/request.ts` carregando 3 locales (pt-BR/en/es)
- [ ] `lib/i18n/routing.ts` define locales + defaultLocale
- [ ] `messages/pt-BR/common.json` populated com básicos (actions, errors, validation)
- [ ] Espelho `messages/en/common.json` + `messages/es/common.json`

### 5. Layouts dos 3 mundos

```
app/
├── (painel)/                  # dashboard tenant
│   └── layout.tsx
├── (publico)/                 # site público do tenant + landings retake
│   └── layout.tsx
├── (auth)/                    # entrar/cadastrar/sair
│   └── layout.tsx
├── (admin)/                   # admin platform (staff retake)
│   └── layout.tsx
├── layout.tsx                 # root com fonts + NextIntlClientProvider
└── page.tsx                   # landing retake.run
```

### 6. Validação S1

- [ ] `pnpm typecheck` 0 erros
- [ ] `pnpm lint --max-warnings 0`
- [ ] `pnpm build` verde
- [ ] Visual check em browser: paleta retake aplicada (grafite/creme/terracota), fontes Oswald + Hanken + Space Mono visíveis, layouts dos 4 mundos navegáveis

---

## Como continuar

1. **Não execute decisões sem consultar `docs/_handoff/`** — SSOT do produto (intocável)
2. **Validação ponto-a-ponto** = `memory/project_retake_decisoes_cravadas.md` — 14 pontos cravados
3. **Plano executável** = `docs/plans/foundation.md` — sprints S0-S7
4. **ADR fundadora** = `docs/adr/0001-foundation.md` — supersede consolidação
5. **Migrations novas via MCP** apenas — nunca `.sql` manual em `supabase/migrations/`
6. **Splinter advisor security** zero novos warnings pós cada migration

## Princípios cravados (não violar)

- Zero exposição client-side (service role nunca client, sensitive data nunca browser, `'server-only'` em lib/data)
- Vocab retake corrida em PT-BR/EN (sem `student`/`trainer`/`professional`/`client`-como-aluno/`framer-motion`/etc)
- Shadcn-canonical CSS vars + extensões opt-in retake
- Composição em banco (`page_versions.content jsonb`) — vibe-coding-ready
- Mobile-first 13 itens checklist (site público + futuro app nativo)
- Cadence verbal: `RUN. EAT. RECOVERY. REPEAT.` UPPERCASE display + sentence case body + métricas mono tabular vírgula decimal `R$`
- Zero emoji em UI retake

## Quando encontrar dúvida

Hierarquia de fontes: `docs/_handoff/` > `docs/adr/0001-foundation.md` > `CLAUDE.md` > `docs/plans/foundation.md` > `memory/` > sessão atual.
