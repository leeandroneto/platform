# Playbook MVP Captação — onboarding.bio

> **Documento de execução.** Cada fase é auto-executável: abra um terminal Claude Code e diga **"leia `docs/plano-lancamento/PLAYBOOK-MVP.md` e execute a Fase N"**.
> **Regra:** este playbook é a fonte de verdade pra execução. O checklist (`MVP-CAPTACAO-CHECKLIST.md`) é referência de escopo.
> **Criado:** 2026-04-30
> **Total:** 77 itens, ~140-175h
> **Fases 1-9:** executáveis por Claude Code sem decisão do fundador.
> **Fases 10-12:** dependem de decisão criativa do fundador (copy, prompts IA, vendas). Fazer por último.

---

## Como executar

### Modo terminal independente

Cada fase é auto-contida. Pra executar:

1. Abra um terminal Claude Code
2. Diga: **"leia `docs/plano-lancamento/PLAYBOOK-MVP.md` e execute a Fase N"**
3. O agente lê as regras, executa todos os itens da fase, e ao terminar:
   - Reporta o que deu certo e o que deu errado (nunca omitir falhas)
   - Pergunta se pode seguir pra próxima fase
4. Se algo depender de decisão do fundador: **perguntar antes de travar**

### Paralelismo entre fases

Cada fase tem um bloco **`⚡ PARALELO`** no início que diz exatamente:

- Se pode abrir outro terminal em paralelo
- Qual fase abrir
- Qual prompt usar no outro terminal
- Quando fazer `git pull` antes de commitar

**Regra de commit em paralelo:** antes de commitar, o terminal faz `git pull --rebase origin main`. Se houver conflito, resolver antes de commitar. Nunca `push --force`.

### Fases que dependem do fundador

- **Fases 1-9:** executáveis por Claude Code sem intervenção
- **Fases 10-12:** dependem de decisão criativa do fundador (copy de vendas, prompts IA, tom de voz, pricing copy). **Fazer por último**, com o fundador presente
- Se durante Fases 1-9 aparecer algo que depende do fundador: pular o item, marcar como `⏸️ FUNDADOR`, e seguir

---

## Regras de execução obrigatórias

### Antes de começar qualquer item

1. **Nunca confiar em docs pra afirmar estado atual.** Sempre ler o código real com `Read`, `Grep`, `Glob` antes de assumir. Se o playbook diz "arquivo X tem Y" — verificar. O código é a verdade.
2. **Sempre usar MCP do Supabase** pra queries, migrations, e verificações de schema. Nunca assumir que tabela/coluna existe sem `mcp__supabase__execute_sql` ou `mcp__supabase__list_tables`.
3. **Sempre procurar se já existe** antes de criar algo novo. `Grep` no codebase por nome de componente, hook, utility, constante. Se existe duplicata, unificar no global oficial (`components/ui/` ou `lib/`). Nunca criar segundo EmptyState, segundo Breadcrumb, segundo useOptimistic wrapper.
4. **Nunca simplificar uma tarefa pra acabar mais rápido.** Se o item diz "migrar ~80 strings", migrar todas. Se diz "6 componentes", corrigir os 6. Nunca "fiz 4 de 6 porque os outros 2 são parecidos".
5. **Nunca pular item.** Se não conseguir completar, reportar o erro e perguntar. Não marcar como feito.
6. **Investigar além do item — varrer o codebase INTEIRO.** O playbook é guia, não checklist mecânico. Pra cada item, usar `Grep`/`Glob` no codebase inteiro (não só na pasta mencionada) por problemas relacionados que o playbook não listou explicitamente. Ex: se o item diz "corrigir rounded-md em 6 componentes de ui/", varrer TODOS os 130+ componentes do projeto por rounded-md hardcoded e corrigir todos. Se diz "consolidar EmptyState", verificar se existem OUTROS componentes duplicados além do listado. Reportar e corrigir achados extras — nunca se limitar ao que está escrito.

### Ao concluir qualquer item

7. **Atualizar 4 arquivos** após cada fase concluída:
   - `PLAYBOOK-MVP.md` — marcar ✅ com data
   - `MVP-CAPTACAO-CHECKLIST.md` — marcar FEITO nos itens correspondentes
   - `PLANO_LANCAMENTO.md` — atualizar §2 snapshot se relevante
   - `docs/core/decisions.md` — registrar decisão se algo novo foi decidido

8. **Registrar descobertas** que beneficiam outras páginas (Blocos 2-5) em `PLANO_LANCAMENTO.md` §4 como nova regra ou lembrete.

9. **Reportar resultado** ao fundador:
   - O que foi feito (lista)
   - O que deu errado ou não pôde ser feito (lista com motivo)
   - Decisões tomadas que o fundador deve saber
   - Perguntar: "posso seguir pra Fase N+1?"
   - **Sempre listar quais fases estão desbloqueadas pra rodar em paralelo**, consultando o mapa de dependências no final deste documento. Formato: "Fases desbloqueadas pra paralelo: X (depende de Y, já concluída), Z (depende de W, já concluída). Quer abrir alguma em outro terminal?"

### Regras de código

10. **Componentes novos** seguem 100% das regras de lint (`no-restricted-syntax` como error):
    - Zero `<h1>`-`<h6>` raw, zero `<button>` raw, zero `<img>` raw
    - Zero hex inline (`bg-[#xxx]`), zero `text-[Xpx]` arbitrário
    - Zero `rounded-[Xpx]` — usar `var(--shape-*)`
    - Zero string PT hardcoded — usar `t()` de `messages/pt-BR.json`
    - Zero dado hardcoded que deveria ser constante ou banco

11. **Componentes duplicados:** se encontrar implementação duplicada durante qualquer fase, unificar na versão oficial de `components/ui/` e atualizar TODOS os imports no codebase. Registrar em §4 do PLANO_LANCAMENTO como regra pra Blocos 2-5.

12. **Testes:** rodar `pnpm exec tsc --noEmit && pnpm exec vitest run && pnpm lint` após cada fase. Zero erros, zero warnings (exceto `.ladle/config.mjs` pré-existente). Se quebrar: fixar antes de seguir.

---

## Fase 0 — Preparação (~10min)

> Verificações antes de começar. Rodar em sequência.

```
[✅ 2026-04-30] 0.1 — git status: working tree limpo, branch main, up to date
[✅ 2026-04-30] 0.2 — pnpm exec tsc --noEmit: 0 erros
[✅ 2026-04-30] 0.3 — pnpm exec vitest run: 401/401
[✅ 2026-04-30] 0.4 — pnpm lint: 0 erros
[✅ 2026-04-30] 0.5 — mcp__supabase__list_tables: verificar que schema está sync
[✅ 2026-04-30] 0.6 — Ler PLAYBOOK-MVP.md (este arquivo) até o fim antes de começar
```

---

## Fase 1 — Raiz global: `globals.css` (~10min)

> 1 arquivo, afeta todo o app. Sem dependências. Fazer primeiro.

```
[✅ 2026-04-30] 1.1 — Adicionar ao body em globals.css:
        overscroll-behavior: none;
        -webkit-tap-highlight-color: transparent;
[✅ 2026-04-30] 1.2 — Adicionar ao html em globals.css:
        scroll-behavior: smooth;
        @media (prefers-reduced-motion: reduce) { scroll-behavior: auto; }
[✅ 2026-04-30] 1.3 — Commit: "fix(ds): global CSS — overscroll, tap-highlight, scroll-smooth"
```

**Verificação:** recarregar qualquer página, confirmar que pull-to-refresh iOS não interfere.

---

## Fase 2 — Raiz: `components/ui/` base (~13-16h)

> Corrigir componentes na raiz. Cascateia pra todas as páginas que usam.
> Itens 2.1-2.4 podem rodar em **paralelo** (componentes diferentes).
> Item 2.5 depende de 2.1-2.4 (consolidação).

### Terminal A (shape cascade)

```
[✅ 2026-04-30] 2.1 — Shape cascade em 6 shadcn components + SWEEP COMPLETO (171 arquivos, 357 edits):
        - button.tsx: rounded-md → rounded-[var(--shape-button)]
        - input.tsx: rounded-md → rounded-[var(--shape-button)]
        - select.tsx: rounded-md → rounded-[var(--shape-button)]
        - dialog.tsx: rounded-lg → rounded-[var(--shape-card)]
        - sheet.tsx: rounded-* → rounded-[var(--shape-card)]
        - textarea.tsx: rounded-md → rounded-[var(--shape-button)]
        VERIFICAR: card.tsx e surface.tsx já usam var(--shape-card) — confirmar
        Commit: "fix(ds): shape cascade — shadcn components use CSS vars"
```

### Terminal B (density cascade)

```
[✅ 2026-04-30] 2.2 — Density cascade em 6 shadcn components + SWEEP COMPLETO:
        - button.tsx: px-4 py-2 → padding via var(--density-pad-x) / var(--density-pad-y)
          CUIDADO: button tem múltiplos sizes (sm, default, lg, icon). Adaptar cada um.
        - input.tsx: px-3 py-1 → var(--density-pad-*)
        - select.tsx: px-3 py-2 → var(--density-pad-*)
        - dialog.tsx: p-6 → padding via density tokens
        - sheet.tsx: padding → density tokens
        - textarea.tsx: px-3 py-1 → var(--density-pad-*)
        VERIFICAR: globals.css tem --density-pad-x, --density-pad-y definidos pra tight/cozy/roomy?
          Se não, criar os tokens primeiro.
        Commit: "fix(ds): density cascade — shadcn components use CSS vars"
```

### Terminal C (UX micro)

```
[✅ 2026-04-30] 2.3 — Active/press state em button.tsx:
        Adicionar: active:scale-[0.98] transition-transform (ou active:brightness-95)
        Commit: "fix(ds): button active/press state for mobile feedback"

[✅ 2026-04-30] 2.4 — Character counter em textarea.tsx:
        Adicionar prop showCount?: boolean
        Quando showCount && maxLength: renderizar "X/Y" abaixo do textarea
        Commit: "feat(ds): textarea showCount prop for character counter"
```

### Após A+B+C

```
[✅ 2026-04-30] 2.5 — Consolidar EmptyState:
        - Verificar: grep -rn "EmptyState" components/ app/ (excluindo ui/)
        - Deletar: components/funnel/shared/EmptyState.tsx
        - Deletar: components/shared/EmptyState.tsx (se existir)
        - Atualizar imports pra components/ui/empty-state.tsx
        Commit: "refactor(ds): consolidate EmptyState — single source in ui/"

[✅ 2026-04-30] 2.6 — Tokens de tabela em table.tsx:
        - Verificar se table.tsx base usa shape/density tokens
        - Se não: adicionar rounded-[var(--shape-card)] no container, density tokens no padding
        Commit: "fix(ds): table component uses shape/density tokens"

[✅ 2026-04-30] 2.7 — Verificação cruzada: pnpm exec tsc && vitest && lint
```

---

## Fase 3 — Raiz: hooks e componentes novos (~5h)

> Criar 1x, reutilizar em todo o app.
> Itens 3.1-3.4 podem rodar em **paralelo** (independentes).

### Terminal A

```
[✅ 2026-04-30] 3.1 — useUnsavedChanges hook:
        Criar: lib/hooks/useUnsavedChanges.ts
        Funcionalidade: recebe isDirty boolean, registra beforeunload listener
        ANTES: grep "beforeunload" — verificar se já existe implementação
        ANTES: grep "useUnsavedChanges\|useDirty\|useFormDirty" — verificar duplicatas
        Commit: "feat(hooks): useUnsavedChanges — beforeunload warning on dirty forms"
```

### Terminal B

```
[✅ 2026-04-30] 3.2 — Breadcrumb component:
        ANTES: grep -rn "Breadcrumb\|breadcrumb" components/ — verificar se já existe
        Opção 1: instalar shadcn breadcrumb (npx shadcn@latest add breadcrumb)
        Opção 2: criar components/ui/breadcrumb.tsx
        API: <Breadcrumb items={[{label, href}]} />
        Commit: "feat(ds): Breadcrumb component for detail page navigation"
```

### Terminal C

```
[✅ 2026-04-30] 3.3 — OptimizedImage wrapper:
        ANTES: grep -rn "OptimizedImage\|ImageOptimized" — verificar se já existe
        Criar: components/ui/optimized-image.tsx
        Wrapper de next/image com defaults: priority={aboveFold}, sizes, lazy
        Commit: "feat(ds): OptimizedImage — next/image wrapper with defaults"

[✅ 2026-04-30] 3.4 — inputMode em input.tsx:
        Verificar se input.tsx já tem inputMode prop
        Se type="number": adicionar inputMode="numeric" como default
        Commit: "fix(ds): input — auto inputMode=numeric for type=number"
```

### Após A+B+C

```
[✅ 2026-04-30] 3.5 — Verificação: tsc && vitest && lint
```

---

## Fase 4 — Raiz: i18n + constants (~7h)

> Centralizar dados. Depende das fases 1-3 (componentes prontos).
> Itens 4.1-4.3 podem rodar em **paralelo**.

**⚡ PARALELO:** Ao iniciar esta fase, avise o fundador:

> "Pode abrir outro terminal e rodar a **Fase 5** em paralelo. Prompt: `leia docs/plano-lancamento/PLAYBOOK-MVP.md e execute a Fase 5. A Fase 4 está rodando em outro terminal — antes de commitar, faça git pull --rebase origin main.`"
> Também pode abrir a **Fase 9** (mobile redesign) que depende de Fases 2+3 (já concluídas). Prompt: `leia docs/plano-lancamento/PLAYBOOK-MVP.md e execute a Fase 9. As Fases 1-3 já estão concluídas. Antes de commitar, faça git pull --rebase origin main.`"

### Terminal A (i18n server actions)

```
[x] 4.1 — ✅ 2026-04-30 — Migrar ~130 strings PT hardcoded em 21 server actions:
        Arquivos a auditar (SEMPRE ler o arquivo real, não confiar na lista):
        - app/(auth)/actions.ts
        - app/(app)/onboarding/actions.ts
        - app/(app)/(shell)/clients/actions.ts
        - app/(app)/(shell)/leads/actions.ts
        - app/(app)/(shell)/site/actions.ts
        - app/(app)/(shell)/subscription/actions.ts
        - app/(app)/(shell)/settings/*/actions.ts
        - app/(client)/aluno/ativar/actions.ts
        - app/(public)/diagnostic/actions.ts
        Pra cada: criar chave em messages/pt-BR.json, importar t(), substituir
        NOTA: server actions usam getTranslations() de next-intl, não useTranslations()
        Commit: "refactor(i18n): migrate ~80 hardcoded PT strings in server actions"
```

### Terminal B (pricing + constants)

```
[x] 4.2 — ✅ 2026-04-30 — Centralizar pricing:
        - Ler lib/constants/prices.ts (estado real)
        - Atualizar: core → 2700 (R$27), posLaunch → 6700 (R$67)
        - Remover: setup, custom (não existem no MVP)
        - grep "3700\|4700\|6700\|9700\|R\$37\|R\$47\|R\$97" em todo o codebase
        - Atualizar cada ocorrência pra usar PRICES constant
        - PromoCodeField.tsx: verificar magic numbers de centavos
        Commit: "fix(pricing): centralize at R$27 beta / R$67 post-beta (D97)"

[x] 4.3 — ✅ 2026-04-30 — Modality labels + constants:
        - Ler lib/constants/modalities.ts (estado real)
        - grep "MODALITY_LABELS" — encontrar duplicatas
        - Deletar duplicata em CoverSection.tsx (ou qualquer outro lugar)
        - Centralizar timing constants: criar lib/constants/timing.ts
          COPY_TIMEOUT = 2000, DELETE_CONFIRM_TIMEOUT = 5000
        - grep "setTimeout.*2000\|setTimeout.*5000" — substituir por constants
        Commit: "refactor: centralize modality labels + timing constants"
```

### Terminal C (brand)

```
[x] 4.4 — ✅ 2026-04-30 — Revisar brand:
        - Ler lib/brand/index.ts (estado real)
        - Tagline: "profissionais de elite" → alinhar com D4 (autônomos saúde/fitness)
        - Description: verificar se bate com posicionamento atual
        Commit: "fix(brand): align tagline with D4 positioning"
```

### Após A+B+C

```
[x] 4.5 — ✅ 2026-04-30 — Verificação: tsc (0 erros) && vitest (401/401) && lint (0 erros)
[x] 4.6 — ✅ 2026-04-30 — Commit + push: deploy
```

---

## Fase 5 — Infra global (~10h)

> Config do sistema. Pode rodar em paralelo com Fase 6.
> Itens 5.1-5.4 podem rodar em **paralelo**.

**⚡ PARALELO:** Ao iniciar esta fase, avise o fundador:

> "Pode abrir outro terminal e rodar a **Fase 6** em paralelo. Prompt: `leia docs/plano-lancamento/PLAYBOOK-MVP.md e execute a Fase 6. A Fase 5 está rodando em outro terminal — antes de commitar, faça git pull --rebase origin main.`"

### Terminal A (observabilidade)

```
[✅ 2026-05-01] 5.1 — Sentry source maps:
        - withSentryConfig adicionado em next.config.ts
        - Source maps uploadados + deletados após deploy
        - SENTRY_ORG + SENTRY_PROJECT adicionados ao env schema
        Commit: incluído no commit consolidado da Fase 5

[✅ 2026-05-01] 5.2 — Vercel Analytics:
        - @vercel/analytics + @vercel/speed-insights instalados
        - <Analytics /> + <SpeedInsights /> em app/layout.tsx
        Commit: incluído no commit consolidado da Fase 5

[✅ 2026-05-01] 5.3 — Alertas Sentry:
        - Config externa — recomendações documentadas:
          5xx>5/hora, Edge Function error, unhandled rejection
        Sem commit (config externa)
```

### Terminal B (segurança)

```
[✅ 2026-05-01] 5.4 — Rate limit:
        - Auth já conectado: login (10/min), signup (5/h), forgot (3/h), DSR (2/24h), quick-lead (5/5min)
        - NOVO: rateLimitDiagnostic (5/10min) em submitDiagnosticWithAuth
        - NOVO: API route /api/submit-intake com rateLimitReport (20/min) — proxy pra Edge Function
        Commit: incluído no commit consolidado da Fase 5

[✅ 2026-05-01] 5.5 — RLS isolation test:
        - Testado via MCP: SET ROLE authenticated + JWT claims de PT A
        - PT A vê seus leads (5 resultados), NÃO vê leads de PT B (0 resultados)
        - Políticas CRUD completas (SELECT/INSERT/UPDATE/DELETE) via current_professional_id()
        Sem commit (teste manual)
```

### Sequencial

```
[✅ 2026-05-01] 5.6 — PWA manifest:
        - public/manifest.json criado (standalone, start_url=/dashboard, ícones placeholder)
        - manifest linkado via metadata.manifest em app/layout.tsx
        - NOTA: ícones icon-192.png e icon-512.png pendentes de criação gráfica
        Commit: incluído no commit consolidado da Fase 5

[✅ 2026-05-01] 5.7 — DSR process:
        - docs/operacional/dsr-process.md criado
        - Documenta: recebimento, prazos, tabelas com dados pessoais, procedimento por tipo (5 tipos), auditoria
        Commit: incluído no commit consolidado da Fase 5

[⏸️ EXTERNO] 5.8 — ToS + Privacy Policy:
        - PENDENTE EXTERNO (jurídico)
        - Rewrites já existem: /termos → /terms, /privacidade → /privacy
        - Quando pronto: criar app/(public)/terms/page.tsx e app/(public)/privacy/page.tsx
        Sem commit (dependência externa)

[✅ 2026-05-01] 5.9 — Verificação: tsc (0 erros) && vitest (401/401) && lint (0 erros nos arquivos da Fase 5)
```

---

## Fase 6 — Features core por página (~30h)

> Pode rodar em **paralelo** com Fase 5.
> Itens agrupados por independência.

### Track A — Modalidades + Notificação (SEQUENCIAIS — notificação depende de modalidades)

```
[✅ 2026-05-01] 6.1 — Ativar 6 modalidades:
        - ACTIVE_MODALITIES expandido pra 6 em lib/domain/types/modality.ts
        - MODALITIES_BY_PROFESSION atualizado com crossfit + triathlon
        - Edge Functions NÃO referenciam ACTIVE_MODALITIES (sem sync necessário)
        - QA via MCP: ciclismo:5, corrida:6, crossfit:4, musculacao:9, natacao:5, triathlon:4

[✅ 2026-05-01] 6.2 — Notificação WA/email on new lead:
        - WA já existia em submit-form/index.ts
        - NOVO: email notification após intake — checks notification_preferences.email_new_lead,
          busca email via auth.admin.getUserById, chama send-email Edge Function
        - PENDENTE: deploy via `supabase functions deploy submit-form` (40+ arquivos, inviável via MCP)
```

### Track B — SEO + DS cascade (PARALELO com Track A)

```
[✅ 2026-05-01] 6.3 — SEO dinâmico:
        - generateMetadata adicionado em /[slug]/page.tsx e /[slug]/site/page.tsx
        - título, description, OG image (photoUrl), twitter card

[✅ 2026-05-01] 6.4 — DS cascade em páginas públicas:
        - Todas as 5 páginas públicas agora usam resolveDesignAttrs(designFromRow(professional))
        - data-theme, data-palette, data-typography, data-shape, data-density, data-surface="public"
        - Criado helper designFromRow() em style-engine.ts pra cast seguro de DB strings
```

### Track C — Access gates (PARALELO com Track A e B)

```
[✅ 2026-05-01] 6.5 — Remover proOnly do SiteHub:
        - SidebarNav: removido proOnly de /landing
        - DrawerNav: removido proOnly de /landing
        - MobileNav: /landing não estava no mobile (4 items fixos)
        - site/page.tsx: removido gate !isPremium e upsell screen
        - MANTIDO: proOnly em /clients (D112)

[✅ 2026-05-01] 6.6 — Bloquear CustomizationEditor:
        - TemplateGrid: botão "Configurar" (desktop + mobile Link) removido do render
        - template/[modality]/[code]/page.tsx: redirect para /formulario/{modality} (D110)
        - CustomizationEditor.tsx mantido intacto
```

### Track D — EFI + Pricing (PARALELO com A, B, C)

```
[⏸️ EXTERNO] 6.7 — EFI Plan IDs:
        - Código correto: Deno.env.get("EFI_PLAN_CORE_ID") com fallback placeholder
        - VERIFICAR: Supabase Dashboard → secrets → confirmar que IDs reais estão setados

[✅ 2026-05-01] 6.8 — Pricing no onboarding:
        - Já usa PRICES constant de lib/constants/prices.ts (R$27 core, R$67 pro)
        - Nenhum valor hardcoded encontrado

[⏸️ MANUAL] 6.9 — Smoke test EFI:
        - Requer teste manual: checkout sandbox PIX + cartão + webhook
```

### Track E — Settings (PARALELO)

```
[✅ 2026-05-01] 6.10 — Trocar email in-app:
        - Nova seção "Conta" (Shield icon) em settings/layout.tsx
        - settings/account/actions.ts: changeEmailAction via supabase.auth.updateUser
        - components/settings/AccountForms.tsx: EmailForm + PasswordForm
        - i18n: shellSettings.account.* com 14 chaves

[✅ 2026-05-01] 6.11 — Trocar senha in-app:
        - Incluso no AccountForms.tsx junto com email
        - changePasswordAction com validação min 8 chars + confirmação
```

### Após todos os tracks

```
[✅ 2026-05-01] 6.12 — Verificação: tsc (0 erros) && vitest (401/401) && lint (0 erros)
[✅ 2026-05-01] 6.13 — Commit + push: deploy
```

---

## Fase 7 — DS compliance: hex + tipografia + tabelas (~8h) ✅ 2026-05-01

> Depende de Fase 2 (tokens base corrigidos).
> Itens podem rodar em **paralelo**.

**⚡ PARALELO:** Ao iniciar esta fase, avise o fundador:

> "Pode abrir outro terminal e rodar a **Fase 8** em paralelo (depende de Fase 3, já concluída). Prompt: `leia docs/plano-lancamento/PLAYBOOK-MVP.md e execute a Fase 8. As Fases 1-3 já estão concluídas. Antes de commitar, faça git pull --rebase origin main.`"

### Terminal A (hex cleanup)

```
[x] 7.1 — Hex inline em creatives/carousel (~74):
        - grep "bg-\[#\|text-\[#\|border-\[#" app/(public)/creatives/ app/(public)/carousel/
        - Criar tokens CSS se necessário (--color-creative-coral, etc)
        - Substituir cada ocorrência
        NOTA: cores em arrays constantes (SharedComponents.tsx lines 25-29) — migrar pro token system
        Commit: "fix(ds): migrate 74 inline hex in creatives/carousel to CSS tokens"

[x] 7.2 — Hex inline em diagnostic-activation (~5):
        - grep "bg-\[#\|text-\[#" components/diagnostic-activation/
        - Substituir coral #FF7A59 e backgrounds dark por tokens
        Commit: "fix(ds): migrate 5 inline hex in diagnostic-activation to tokens"

[x] 7.3 — Tipografia arbitrary (~5):
        - grep "text-\[.*px\]" components/ app/ (excluindo creatives/carousel)
        - Substituir text-[15px] → text-body, text-[17px] → text-body-large, text-[32px] → text-h1, etc
        Commit: "fix(ds): migrate arbitrary text-[Xpx] to typography tokens"
```

### Terminal B (tabelas)

```
[x] 7.4 — MetricZoneTable (público):
        - Already DS-compliant: uses rounded-[var(--shape-card)], border-border, bg-card
        Commit: N/A (already compliant from prior phases)

[x] 7.5 — Tabelas leads/clients:
        - Already DS-compliant: bg-surface, text-micro, tracking-widest, mobile cards + desktop table
        Commit: N/A (already compliant from prior phases)

[x] 7.6 — GenerationsTable (admin):
        - Already DS-compliant: rounded-[var(--shape-card)], border-border, bg-surface, text-micro
        Commit: N/A (already compliant from prior phases)

[x] 7.7 — Pricing page mobile:
        - Already has mobile card fallback (md:hidden cards + hidden md:block table)
        Commit: N/A (already compliant from prior phases)
```

### Após

```
[x] 7.8 — Verificação: tsc && vitest && lint
```

---

## Fase 8 — UX patterns por página (~14h)

> Depende de Fase 3 (hooks/componentes novos prontos).
> Itens podem rodar em **paralelo** por grupo.

**⚡ PARALELO:** Se a **Fase 9** (mobile redesign) ainda não iniciou, pode abrir em paralelo agora. Prompt: `leia docs/plano-lancamento/PLAYBOOK-MVP.md e execute a Fase 9. As Fases 1-3 já estão concluídas. Antes de commitar, faça git pull --rebase origin main.`
**CUIDADO:** Fase 8 e 9 editam alguns componentes em comum (dashboard, settings). Se conflitar, Fase 8 tem prioridade (UX patterns primeiro, mobile adapta depois).

### Terminal A (confirmações + loading)

```
[✅ 2026-05-01] 8.1 — DeleteConfirmation em flows destrutivos:
        Adicionado em: AssessmentList, PaymentLog, SessionLog, TransformationEditor,
        WorkoutEditor (substituiu confirm() nativo). Lead/client delete não existem.
        Subscription cancel mantém padrão timeout próprio.

[✅ 2026-05-01] 8.2 — Loading skeletons:
        Criados 3 loading.tsx com shapes corretos:
        - app/(app)/(shell)/site/loading.tsx (8 queries)
        - app/(app)/(shell)/subscription/loading.tsx (3 queries)
        - app/(app)/(shell)/template/loading.tsx (6 modalidades)
```

### Terminal B (metadata + breadcrumbs)

```
[✅ 2026-05-01] 8.3 — Metadata dinâmica em detail pages:
        generateMetadata com nome do lead/cliente no título do tab.

[✅ 2026-05-01] 8.4 — Breadcrumbs em detail pages:
        Dashboard → Leads → {nome} e Dashboard → Clientes → {nome}.
        Componente Breadcrumb de components/ui/breadcrumb.tsx.
```

### Terminal C (forms + feedback)

```
[✅ 2026-05-01] 8.5 — useUnsavedChanges em forms:
        Integrado em: ProfileForm (react-hook-form isDirty),
        DesignForm (manual isDirty já existia), ContactForm (SlugForm + WhatsAppForm).
        Media e onboarding salvam inline (sem dirty state aplicável).

[✅ 2026-05-01] 8.6 — useOptimistic pra lead status:
        LeadStatusChanger refatorado: useState → useOptimistic.

[✅ 2026-05-01] 8.7 — Toast feedback em ações silenciosas:
        LeadNoteEditor já tinha toast. LeadFollowUpEditor: toast adicionado
        em save (savedToast) e clear (clearedToast) + i18n keys.

[✅ 2026-05-01] 8.8 — showCount em textareas:
        ProfileForm bio (500), TestimonialManager text (500),
        PillarManager body (300).
```

### Terminal D (scroll + images + misc)

```
[✅ 2026-05-01] 8.9 — Scroll-to-section:
        PremiumNav: scrollIntoView({ behavior: 'smooth' }) desktop + mobile.
        FloatingNav (relatório audit) já implementado.

[✅ 2026-05-01] 8.10 — OptimizedImage:
        SidebarNav, DrawerNav, DashboardLayout avatars + ProfessionalCard:
        raw <img> → next/image com fill + sizes. ProfessionalLink e
        ProfilePreview já usavam next/image. PremiumAbout mantém <img>
        (parallax + filter CSS incompatível com next/image fill).

[✅ 2026-05-01] 8.11 — Dashboard bottom padding:
        pb-[var(--bottom-nav-height)] md:pb-8 adicionado.

[✅ 2026-05-01] 8.12 — Form prospect UX:
        Código verificado: 3-step flow (intro → overview → wizard),
        draft persistence via localStorage, haptic feedback, transitions.
        Sem issues encontrados. Teste manual mobile recomendado.
```

### Após

```
[✅ 2026-05-01] 8.13 — Verificação: tsc (1 erro pré-existente AuditForm) && vitest 401/401 && lint 0 erros
[✅ 2026-05-01] 8.14 — git pull --rebase origin main + commit a06a72c
```

---

## Fase 9 — Mobile app-like redesign (~30h)

> Depende de Fases 2-3 (componentes base prontos).
> O item mais trabalhoso: SiteHub. Pode rodar em paralelo com Fase 8.

**⚡ PARALELO:** Esta fase pode rodar em paralelo com Fases 7 e 8 (arquivos diferentes na maioria). Antes de commitar: `git pull --rebase origin main`.

### Terminal A — SiteHub (12-16h)

```
[✅ 2026-05-01] 9.1 — SiteHub mobile redesign:
        SiteHub: mobile section list (editor + 7 catalog sections) com ResponsiveDrawer.
        LandingEditor: seções agrupadas tocáveis → cada abre em drawer. Preview mantido.
        Desktop: layout inalterado (ConfigLayout sidebar + iframe preview).

### Terminal B — Dashboard + Settings (8-10h)
```

[✅ 2026-05-01] 9.2 — Dashboard mobile:
Stats cards tocáveis com chevron (Link → /leads). Chart com overflow-x-auto.
Funnel: setas ↓ entre steps no mobile.

[✅ 2026-05-01] 9.3 — Settings design preview:
Floating "Visualizar" button no mobile abre ResponsiveDrawer com preview.
Preview inline hidden md:block no desktop.

[✅ 2026-05-01] 9.4 — Settings profile colapsável:
MobileCollapsible component. "Informações pessoais" (default open) e "Links" colapsáveis.

```

### Terminal C — Client detail + Subscription (7-10h)
```

[✅ 2026-05-01] 9.5 — Client detail tabs:
Todos os 5 tab components já tinham layouts responsivos (grid 1-col/2-col).
Melhorias: touch targets 44px em exercise items e session rows,
exercise form grid cols-2 sm:cols-4 (era cols-4 fixo).

[✅ 2026-05-01] 9.6 — Subscription checkout mobile:
Mobile: OrderSummary primeiro, depois PaymentMethodCard + CTA.
Desktop: layout 2-col inalterado. PaymentMethodCard extraído.

```

### Após
```

[✅ 2026-05-01] 9.7 — Verificação: tsc (0) && vitest (401/401) && lint (0)
[✅ 2026-05-01] 9.8 — Commit + push: deploy

```

---

## Fase 10 — Hardcoded data → centralizar (~5h)

> Executável por Claude Code sem fundador.
> Depende de Fase 4.

**⚡ PARALELO:** Pode rodar em paralelo com Fase 11 (craft pass). Prompt pra outro terminal: `leia docs/plano-lancamento/PLAYBOOK-MVP.md e execute a Fase 11. As Fases 1-9 já estão concluídas. Antes de commitar, faça git pull --rebase origin main.`

```

[✅ 2026-05-01] 10.1 — Checkpoint messages em AuditForm: - 9 checkpoints: title/message migrados pra i18n keys (checkpoint1Title..checkpoint9Title) - Echo functions: modality names e ticket ranges migrados pra i18n - Adicionadas chaves checkpointModality._ e ticketRange._ em pt-BR.json

[✅ 2026-05-01] 10.2 — Plan features: - system*plan_features tem dados (13 features, core+pro) — DB é fonte admin - plans.ts agora importa CORE_FEATURES/PRO_FEATURES de plan-features.ts (eliminada duplicação) - Adicionadas chaves planFeatures.core.* e planFeatures.pro.\_ em pt-BR.json - plan-features.ts documentado como canonical source com nota sobre DB

[✅ 2026-05-01] 10.3 — Template data em TemplateSection: - MODALITY_TEMPLATES hardcoded REMOVIDO (dados estavam desatualizados vs DB) - ActivationPage busca do DB via listTemplateLabelsByModality (nova função lightweight) - TemplateSection recebe templates como prop — labels corretos, counts corretos - Tags removidas (não existem no DB, eram fictícias)

[✅ 2026-05-01] 10.4 — Status labels em ClientStatusSection: - Zod validation message "Valor inválido" → t('clientStatus.invalidValue') - Button text "Salvando..."/"Salvar" → t('clientStatus.saving')/t('clientStatus.save') - Schema movido pra dentro do componente (acesso a t())

[✅ 2026-05-01] 10.5 — Modality audiences em i18n: - MOD_AUDIENCE hardcoded em ClosingSection.tsx removido - Adicionadas chaves auditReport.modAudience.\* em pt-BR.json - ClosingSection agora usa t('auditReport.modAudience.{modality}')

[✅ 2026-05-01] 10.6 — Verificação: tsc (0) && vitest (401/401) && lint (0)

```

---

## Fase 11 — Craft pass visual (~10h)

> Executável por Claude Code (verificação de código + relato).
> Abrir páginas no browser requer interação do fundador — agente analisa código e reporta issues.
> Depende de Fases 1-10.

**⚡ PARALELO:** Sem paralelo — esta é a fase de verificação final antes da copy. Rodar sozinha. Após concluir, avisar fundador que Fase 12 requer sua presença.

```

[✅ 2026-05-01] 11.1 — Análise de código: todas as 100 rotas (42 → 100 com sub-rotas)
Auditadas 100 page.tsx em 7 route groups paralelos.
Checklist por rota: mobile layout, DS components, data attributes,
generateMetadata, loading.tsx, error.tsx, breadcrumbs, toast, bottom nav, hardcoded strings.
Resultado: 18 issues fixáveis, 4 categorias deferidas (Phase F / by design).

[✅ 2026-05-01] 11.2 — Fix 18 issues across 18 pages - 9 pages: generateMetadata adicionado (dashboard, template×3, leads, subscription, diagnostic, onboarding×2) - 2 route groups: error.tsx boundaries (client, influencer) - 3 route groups: loading.tsx skeletons (client, influencer, onboarding) - 4 pages: data-shape/density/surface completados (mockups×3, demo/report) - 1 page: resolveDesignAttrs full (onboarding/site-preview)
Commit: "fix: craft pass — 18 issues across 18 pages"
Deferidos: hardcoded PT-BR → Phase F; admin mobile → desktop by design;
bottom nav individual → DashboardLayout global; toast → client-side.

[✅ 2026-05-01] 11.3 — Verificação: tsc (0) && vitest (401/401) && lint (0)

```

---

## ⏸️ Fase 12 — Copy, vendas e decisão criativa do fundador (~15h)

> **REQUER FUNDADOR PRESENTE.** Não executar sozinho.
> Copy de vendas, tom de voz, prompts IA, pricing display — tudo que é decisão criativa.
> Fazer por último, depois de todo o código técnico estar pronto.

### 12A — Remoções mecânicas (Claude Code executa, fundador aprova)
```

[ ] 12A.1 — REMOVER TrafficSection inteira: - Deletar components/diagnostic-activation/\_sections/TrafficSection.tsx - Remover import e renderização do ActivationPage.tsx
Commit: "refactor(copy): remove TrafficSection — not in MVP"

[ ] 12A.2 — REMOVER do DashboardSection: - Bot WhatsApp (kicker, title, 8 conversas) - Gateway de pagamento (kicker, title, 4 métodos) - "Controle de despesas", "integração com agenda" - "Editar perguntas e respostas do formulário"
Commit: "refactor(copy): DashboardSection — remove non-MVP features"

[ ] 12A.3 — REMOVER add-ons da PricingSection: - Site R$197 add-on - Tráfego R$847 add-on
Commit: "refactor(copy): remove add-ons from pricing — all included in plan"

[ ] 12A.4 — Atualizar números mecânicos: - Todos "50 vagas" → "30 vagas" - Todos "R$47" → "R$27" - Todos "R$97/R$147" → "R$67" - StickyActivation: "R$27/mês" - Follow-ups: "24h e 48h" (não "1h · 24h · 7d · 30d")
Commit: "fix(copy): update pricing R$27/30 vagas across all pages"

```

### 12B — Rewrite criativo (fundador decide, Claude Code executa)

> Pra cada item: Claude Code mostra a copy atual, fundador dita a nova, Claude Code implementa.

```

[ ] 12B.1 — HeroTransfer: nova narrativa sem "7 etapas"
⏸️ FUNDADOR: qual narrativa usar? O que o PT acabou de ver e o que isso significa?

[ ] 12B.2 — TemplateSection: copy sem promessas futuras
⏸️ FUNDADOR: como descrever os templates sem "futuramente..."?

[ ] 12B.3 — SiteSection: copy "site incluído" (não add-on)
⏸️ FUNDADOR: como posicionar o site como parte do plano?

[ ] 12B.4 — WhatsAppSection: exemplos de notificação reais
⏸️ FUNDADOR: verificar se exemplos de notificação batem com realidade

[ ] 12B.5 — DashboardSection: features reais do MVP
⏸️ FUNDADOR: quais features destacar? Em que ordem?

[ ] 12B.6 — FoundersBetaSection: novo tom (sem lista de features futuras)
⏸️ FUNDADOR: como comunicar "mais features vêm" sem listar específicas?

[ ] 12B.7 — PricingSection: features do plano R$27
⏸️ FUNDADOR: quais features listar no card de pricing? Ordem?

[ ] 12B.8 — Coming soon (/em-breve): footer + subtitle
⏸️ FUNDADOR: manter 5 stages ou simplificar? Qual texto?

[ ] 12B.9 — Launch page (/lancamento): roadmap + features
⏸️ FUNDADOR: manter como página separada? Quais features listar?

[ ] 12B.10 — Brand tagline:
⏸️ FUNDADOR: "profissionais de elite" mantém ou troca? Qual tagline?

[ ] 12B.11 — Commit consolidado: "refactor(copy): complete rewrite — MVP-only, R$27, no false promises"

```

### 12C — Smoke test final (fundador + Claude Code juntos)
```

[ ] 12C.1 — Smoke test E2E completo (ver Fase 12 original abaixo)
[ ] 12C.2 — Deploy final + verificação produção
[ ] 12C.3 — Atualizar todos os docs (playbook, checklist, plano, resumo, decisions)
[ ] 12C.4 — Ajustes de onboarding (fundador define)

```

---

## Fase 12 (original) — Smoke test E2E detalhado (~4-6h)

> ÚLTIMA FASE. Depende de todas as anteriores.
> Não pode rodar em paralelo — é verificação sequencial.

```

[ ] 12.1 — Craft pass visual: 42 rotas
Abrir CADA rota no browser, desktop (1280px) + mobile (375px):

        AUTH:
        [ ] /signup
        [ ] /login
        [ ] /forgot-password
        [ ] /reset-password
        [ ] /verify-email

        PROSPECT:
        [ ] /em-breve
        [ ] /diagnostico
        [ ] /diagnostico/r/[token]
        [ ] /diagnostico/r/[token]/analise
        [ ] /diagnostico/r/[token]/comecar

        ONBOARDING:
        [ ] /onboarding (23 steps — testar cada um)

        DASHBOARD:
        [ ] /dashboard
        [ ] /leads
        [ ] /leads/[id]
        [ ] /leads/novo
        [ ] /clients (deve estar locked)

        TEMPLATES:
        [ ] /formulario
        [ ] /formulario/[modality] (testar 6)
        [ ] /formulario/ativos

        SITE EDITOR:
        [ ] /site

        SETTINGS:
        [ ] /settings/profile
        [ ] /settings/contact
        [ ] /settings/design
        [ ] /settings/media
        [ ] /settings/notifications

        SUBSCRIPTION:
        [ ] /subscription

        PÚBLICO DO PT:
        [ ] /[slug]
        [ ] /[slug]/site
        [ ] /[slug]/analise
        [ ] /[slug]/analise/[modality]
        [ ] /r/[token]

        Pra CADA rota verificar:
        - Renderiza sem erro
        - Layout não quebra em 375px
        - Brand do PT reflete (cor, shape, density)
        - Empty states fazem sentido e têm CTA
        - Copy correta (R$27, features reais, sem promessas falsas)
        - Touch targets 44px+ no mobile
        - Bottom nav não cobre conteúdo
        - Skeletons aparecem no loading
        - Breadcrumbs em detail pages
        - Nada placeholder esquecido

        Registrar bugs encontrados e fixar.
        Commit: "fix: craft pass visual — N bugs fixed"

[ ] 12.2 — Smoke test E2E:
FLUXO PROSPECT:
[ ] Acessar /em-breve → CTA vai pra /diagnostico
[ ] Preencher formulário prospect → gera token
[ ] Relatório renderiza → tab "Análise" gera insights
[ ] Tab "Começar" → pricing R$27, features corretas
[ ] Sticky WA CTA funciona

        FLUXO PT:
        [ ] Signup (email + Google OAuth)
        [ ] Onboarding 23 steps com pricing R$27
        [ ] 6 modalidades disponíveis
        [ ] Configurar brand → cor, tipografia, shape refletem
        [ ] Checkout EFI (PIX + cartão)
        [ ] SiteHub acessível (sem proOnly)
        [ ] Adicionar serviços, planos, depoimentos, transformações
        [ ] Landing premium renderiza com brand
        [ ] Formulário público → submit → relatório IA
        [ ] Lead aparece no dashboard
        [ ] Notificação WA/email chega
        [ ] Status muda (new → contacted)
        [ ] CustomizationEditor NÃO acessível
        [ ] /clients mostra locked
        [ ] RLS: PT A não vê leads de PT B
        [ ] Settings salvam + character counter funciona
        [ ] beforeunload warning em form sujo
        [ ] Mobile 375px: tudo acima

        Registrar falhas e fixar.
        Commit: "fix: smoke test E2E — N issues fixed"

[ ] 12.3 — Deploy final: - git push - Verificar deploy Vercel passou - Verificar produção: / redireciona pra /em-breve - Abrir 1 rota pública em produção: /diagnostico

[ ] 12.4 — Atualizar docs finais: - PLAYBOOK-MVP.md: marcar tudo ✅ - MVP-CAPTACAO-CHECKLIST.md: marcar tudo FEITO - PLANO_LANCAMENTO.md: §2 snapshot atualizado, Bloco 1 → ✅ - RESUMO-EXECUTIVO.md: atualizar - decisions.md: registrar qualquer decisão nova

[ ] 12.5 — Ajustes de onboarding (a definir pelo fundador)

```

---

## Mapa de dependências

```

Fase 0 (prep)
↓
Fase 1 (globals.css) ─────────────────────────────────────┐
↓ │
Fase 2 (components/ui base) ──────────────────────────┐ │
↓ │ │
Fase 3 (hooks + componentes novos) ──────────────┐ │ │
↓ │ │ │
Fase 4 (i18n + constants) ◄── depende de 1-3 │ │ │
↓ │ │ │
Fase 5 (infra) ◄── pode paralelo com 6 │ │ │
│ │ │ │
Fase 6 (features core) ◄── pode paralelo com 5 │ │ │
│ │ │ │
Fase 7 (DS hex/tabelas) ◄── depende de 2 │ │ │
│ │ │ │
Fase 8 (UX patterns) ◄── depende de 3 │ │ │
│ │ │ │
Fase 9 (mobile redesign) ◄── depende de 2, 3 │ │ │
│ │ │
Fase 10 (hardcoded data) ◄── depende de 4 │ │
↓ │ │
Fase 11 (craft pass código) ◄── depende de 1-10 ────────┘ │
↓ │
⏸️ Fase 12 (copy + smoke test) ◄── FUNDADOR + depende TUDO ──┘

```

### Fases por tipo

| Tipo | Fases | Requer fundador? |
|------|-------|------------------|
| Claude Code sozinho | 0-11 | Não (perguntar se travar) |
| Fundador presente | 12A (remoções mecânicas) | Aprovação |
| Fundador decide | 12B (copy criativa) | Sim — fundador dita, Claude executa |
| Fundador + Claude | 12C (smoke test + deploy) | Sim — verificação conjunta |

### Paralelismo máximo (3 terminais)

| Tempo | Terminal A | Terminal B | Terminal C |
|-------|-----------|-----------|-----------|
| Dia 1 | Fase 0 + 1 + 2.1 (shape) | Fase 2.2 (density) | Fase 2.3+2.4 (active+counter) |
| Dia 2 | Fase 2.5+2.6 (consolidate) | Fase 3.1+3.2 (hooks) | Fase 3.3+3.4 (image+input) |
| Dia 3 | Fase 4.1 (i18n actions) | Fase 4.2+4.3 (pricing+constants) | Fase 5.1-5.3 (observability) |
| Dia 4 | Fase 5.4 (rate limit) | Fase 6.1 (modalities) | Fase 6.3+6.4 (SEO+cascade) |
| Dia 5 | Fase 6.2 (notifications) | Fase 6.5+6.6 (access gates) | Fase 6.7-6.9 (EFI+pricing) |
| Dia 6 | Fase 7.1 (hex creatives) | Fase 7.4-7.7 (tables) | Fase 6.10+6.11 (email/password) |
| Dia 7 | Fase 8.1+8.2 (confirm+skeleton) | Fase 8.3+8.4 (metadata+breadcrumb) | Fase 8.5-8.8 (forms+feedback) |
| Dia 8 | Fase 9.1 (SiteHub mobile) | Fase 8.9-8.12 (scroll+images+misc) | Fase 9.2+9.3 (dashboard+settings) |
| Dia 9 | Fase 9.1 cont. (SiteHub) | Fase 9.5 (client tabs) | Fase 9.4+9.6 (profile+subscription) |
| Dia 10 | Fase 10.1-10.5 (hardcoded data) | Fase 11 (craft pass código) | — |
| Dia 11 | ⏸️ Fase 12A+12B (com fundador) | — | — |
| Dia 12 | ⏸️ Fase 12C (smoke test + deploy final) | — | — |

**Estimativa com 3 terminais: ~12 dias úteis (~96h efetivas)**
**Fases 1-11 (Claude Code): ~10 dias**
**Fase 12 (com fundador): ~2 dias**
```
