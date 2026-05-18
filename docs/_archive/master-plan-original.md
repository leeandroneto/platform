# desafit.app — Master Plan (greenfield)

> **Versão:** 2026-05-16 · **Único doc de verdade pra construir desafit.app do zero**
> Consolida blueprint dia 1 + lições refatorações + roadmap fases + decisões arquiteturais.
> Tudo decidido aqui ANTES de qualquer linha de código.

---

## 0. Contexto e princípios

### 0.1 Por que este doc existe

Leandro vai criar repo greenfield `desafit/` (Next 16 + Supabase + shadcn + Tailwind v4 + PWA branded multi-tenant). O repo `onboarding-bio/` continua só como histórico — **zero código compartilhado, zero nomenclatura herdada**.

**Causa raiz do método "decidir tudo antes":** auditoria do onboarding.bio revelou ~150-170h de refatoração horizontal por decisões tomadas tarde demais (design system depois das telas, lint rules como warning antes de error, 830 `eslint-disable` silenciando 1 regra única, 8 tabelas 0-row, sistemas dual normalizado+JSONB, etc). Padrão repetido: avançar rápido, virar bagunça, refatoração massiva, abandono, recomeço.

**Solução:** este doc fecha TODAS as decisões arquiteturais antes do commit 1. Cada fase tem entregáveis exatos + critério "done" + carry-over documentado. Sem improviso, sem "depois a gente vê".

### 0.2 12 princípios inegociáveis (lint/CI enforced)

1. **Zero código herdado do onboarding.bio.** Repo novo, banco novo, vocabulário novo. Aproveitar = só padrões e decisões, nunca código com vocabulário/abstrações legadas.
2. **Zero `eslint-disable`** exceto allowlist curtíssima (`block oficial shadcn`, `third-party-component`). CI bloqueia. Quando regra falha → cria primitive, nunca silencia.
3. **Decidir tudo antes de codar.** Cada feature tem schema Zod, contrato server action, RLS policy, primitive UI **decididos antes** do primeiro commit.
4. **Stack travada dia 1.** Não bumpar major mid-project. Lista pinada em §1.
5. **Multi-tenant white-label desde a primeira tabela.** Toda tabela tem `tenant_id`, toda RLS filtra por JWT direto, todo branding sai de `tenants.theme_tokens`.
6. **Modular pra qualquer profissão.** Hoje musculação, amanhã inglês/nutrição/idiomas/mentoria. Polimorfismo via `component.kind` + JSONB `payload` validado por Zod.
7. **Mobile-first pesado, cara de app nativo.** PWA é produto principal (app cliente). UI mobile ≠ desktop esticado.
8. **shadcn 100% — blocks → componentes → primitives.** Custom só último recurso, com decision registrada em `docs/components/decisions.md`.
9. **Separação dura: front (Next) ↔ back (server actions + Edge) ↔ banco (Supabase).** Components nunca chamam Supabase direto. Server actions são thin adapters chamando `lib/data/` que chama RPCs.
10. **SOLID aplicado sem virar burocracia.** Single responsibility por arquivo. Components < 300 linhas hard. Functions < 100 linhas hard.
11. **Vibe coding como produto.** Profissional preenche perguntas → IA monta estrutura → profissional só adiciona conteúdo. IA monta páginas, formulários, emails, programas.
12. **1 tarefa → 1 worktree → 1 PR → 1 verificação completa** (tsc + lint + vitest + build + lighthouse). Nada vai pra main quebrando.

### 0.3 Vocabulário canônico (palavras BANIDAS vs corretas)

**BANIDAS** (lint enforce):

| Banido                                          | Origem (legado)                 | Use                                           |
| ----------------------------------------------- | ------------------------------- | --------------------------------------------- |
| `intake`                                        | onboarding.bio formulário       | `capture_form` ou simplesmente `form`         |
| `wizard`                                        | onboarding wizard antigo        | `setup` ou `getting-started`                  |
| `onboarding.bio` ou `onboarding-bio`            | referências ao produto antigo   | nada — não citar histórico                    |
| `student`                                       | nomenclatura antiga             | `client`                                      |
| `trainer`                                       | nomenclatura antiga             | `professional`                                |
| `prospect`                                      | usado em forms antigos          | `lead`                                        |
| `diagnostic` ou `diagnostico`                   | gerador IA antigo               | `assessment`                                  |
| `customization`                                 | tabela de tema antiga           | `theme` ou `branding`                         |
| `framer-motion`                                 | lib antiga                      | `motion/react` (Motion 12)                    |
| `workspace`                                     | confusão com tenant             | `tenant`                                      |
| `aluno` em folder                               | em URL pública via rewrite ok   | `client` em código/folder                     |
| `reflexao`, `pilares`, `ato_*`, `proximo_passo` | JSONB keys PT do legado         | `reflection`, `pillars`, `act_*`, `next_step` |
| `legacy-*`, `_legacy/`                          | route group antigo              | não existe no greenfield                      |
| `prof-*` (abreviação)                           | usado em alguns lugares antigos | `professional-*` completo                     |
| `_archive/`                                     | pasta de arquivamento           | não criar — `git history` é suficiente        |

**Canônicos do produto:**

| Termo          | Definição                                                                                                                                                                                                                                                                     |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tenant`       | espaço isolado de 1 profissional (UUID em `public.tenants`)                                                                                                                                                                                                                   |
| `professional` | dono do tenant (role primário)                                                                                                                                                                                                                                                |
| `client`       | aluno final (role; nunca `student`)                                                                                                                                                                                                                                           |
| `staff`        | colaborador do profissional (futuro)                                                                                                                                                                                                                                          |
| `admin`        | Leandro/equipe plataforma (role global)                                                                                                                                                                                                                                       |
| `influencer`   | afiliado (role global)                                                                                                                                                                                                                                                        |
| `program`      | produto vendido (curso, desafio, mentoria)                                                                                                                                                                                                                                    |
| `module`       | subdivisão flexível dentro de programa (nome configurável: "Semana 1", "Fase 1", etc)                                                                                                                                                                                         |
| `component`    | unidade atômica de conteúdo (`kind`: workout, video_lesson, meal_plan, check_in, scheduled_live, individual_call, in_person_class, material, message, task, lesson — 11 kinds ativos em `fitness_strength` dia 1, enum estendido com reservados pra outras verticals em §5.3) |
| `enrollment`   | client matriculado em program                                                                                                                                                                                                                                                 |
| `cohort`       | turma com início/fim fixo                                                                                                                                                                                                                                                     |
| `capture_form` | formulário de captação branded (substitui `intake`)                                                                                                                                                                                                                           |
| `lead`         | inscrito no capture_form (substitui `prospect`)                                                                                                                                                                                                                               |
| `setup`        | fluxo pós-signup (substitui `wizard`)                                                                                                                                                                                                                                         |
| `theme_tokens` | branding do tenant (substitui `customization`)                                                                                                                                                                                                                                |
| `assessment`   | relatório gerado por IA (substitui `diagnostic`)                                                                                                                                                                                                                              |

### 0.4 Decisões fechadas (D-G1 a D-G25)

| #     | Decisão                                               | Valor                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-G1  | Repos separados                                       | desafit greenfield novo · onboarding.bio só histórico                                                                                                                                                                                                                                                                                                                                                                                                |
| D-G2  | 2 Supabase independentes                              | Nada compartilhado                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| D-G3  | Stack travada                                         | Next 16, React 19, Tailwind v4, shadcn new-york dark-first, Motion 12, next-intl 4, vaul, Zod 4, pnpm                                                                                                                                                                                                                                                                                                                                                |
| D-G4  | Hierarquia produto                                    | Programa → Módulo → Componente (11 kinds)                                                                                                                                                                                                                                                                                                                                                                                                            |
| D-G5  | Roles canônicos                                       | 5 valores: professional, client, staff, admin, influencer                                                                                                                                                                                                                                                                                                                                                                                            |
| D-G6  | JSONB AI keys                                         | EN sempre (`pillars`, `reflection`); valores em PT-BR (output LLM)                                                                                                                                                                                                                                                                                                                                                                                   |
| D-G7  | Tenant switching                                      | Notion-style dropdown + JWT re-issue via edge function                                                                                                                                                                                                                                                                                                                                                                                               |
| D-G8  | Card variants                                         | 4: default, outlined, interactive, featured                                                                                                                                                                                                                                                                                                                                                                                                          |
| D-G9  | Alert variants                                        | 4: default(info), success, warning, destructive                                                                                                                                                                                                                                                                                                                                                                                                      |
| D-G10 | shadcn 100%                                           | Todos blocks + componentes dia 1. Custom só com decision registrada                                                                                                                                                                                                                                                                                                                                                                                  |
| D-G11 | Zero `eslint-disable`                                 | CI bloqueia, allowlist curtíssima                                                                                                                                                                                                                                                                                                                                                                                                                    |
| D-G12 | A11y baseline                                         | WCAG 2.2 AA + APCA Lc ≥ 60 + axe-core E2E dia 1                                                                                                                                                                                                                                                                                                                                                                                                      |
| D-G13 | i18n                                                  | next-intl 4, pt-BR único MVP, `messages/en-US.json` espelho dia 1                                                                                                                                                                                                                                                                                                                                                                                    |
| D-G14 | Zero vocabulário legado                               | Lista §0.3, lint enforce                                                                                                                                                                                                                                                                                                                                                                                                                             |
| D-G15 | Vibe coding pipeline                                  | 4 estágios (identidade → estrutura → componentes → coerência), via Vercel AI Gateway                                                                                                                                                                                                                                                                                                                                                                 |
| D-G16 | Banco core dia 1 + JIT depois                         | 10-12 tabelas core na migration 1, expansão por feature                                                                                                                                                                                                                                                                                                                                                                                              |
| D-G17 | RPC source of truth                                   | Server actions são thin adapters. Toda mutação via RPC `SECURITY DEFINER`                                                                                                                                                                                                                                                                                                                                                                            |
| D-G18 | Theme runtime via CSS vars                            | `tenants.theme_tokens` JSONB inline em `<html style>`                                                                                                                                                                                                                                                                                                                                                                                                |
| D-G19 | Service Worker                                        | Serwist (sucessor Workbox, Next 16 ready)                                                                                                                                                                                                                                                                                                                                                                                                            |
| D-G20 | App Router                                            | Route groups: `(auth)`, `(setup)`, `(shell)`, `(client)`, `(admin)`, `(public)`, `(legal)`                                                                                                                                                                                                                                                                                                                                                           |
| D-G21 | Modalidade abstraída                                  | Plugin content library + `component.kind` polimórfico                                                                                                                                                                                                                                                                                                                                                                                                |
| D-G22 | Migrations                                            | Exclusivamente via `mcp__supabase__apply_migration`, nunca `.sql` manual                                                                                                                                                                                                                                                                                                                                                                             |
| D-G23 | Modelo de cobrança em 3 fases                         | **Fase agência (hoje):** plataforma cobra prof via EFI Bank — setup (R$1.5k/3k/4k) + mensalidade (R$100/200). Sem taxa sobre vendas. **Fase SaaS self-service:** mesma cobrança setup+mensalidade. Aluno paga prof via gateway que o prof configurar (Asaas/Pagar.me/MP/Stripe BR — escolha do prof, plataforma não intermedia). **Fase SaaS marketplace (futuro):** Pagar.me split nativo, plataforma cobra taxa sobre vendas (comissão a definir). |
| D-G24 | Editor visual                                         | dnd-kit, side panel (não inline), salvamento atômico por bloco, mobile read-only                                                                                                                                                                                                                                                                                                                                                                     |
| D-G25 | Padrão "1 tarefa → 1 worktree → 1 PR → 1 verificação" | Sem exceção                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| D-G26 | Identidade visual = a partir do que o prof já tem     | NÃO criamos do zero. Setup pede logo vetorial + cor primária + paleta/referências. `deriveTokens(primary)` gera resto                                                                                                                                                                                                                                                                                                                                |
| D-G27 | Materiais offline                                     | PDFs salvos no PWA pra acesso offline (D-G19 SW estende cache pra material kind)                                                                                                                                                                                                                                                                                                                                                                     |

---

## 0.5 Estratégia: Agência → SaaS (modelo híbrido em fases)

### 0.5.1 Diagnóstico inicial (o que gerou a decisão)

Tinha 6 dimensões abertas em paralelo sem decisão fechada:

- **Modelo:** SaaS, agência ou híbrido
- **Produto:** captação e programas são coisas diferentes — separar ou unir?
- **Posicionamento:** A (vertical fitness profundo) vs B (horizontal genérico) vs C (vertical fitness com arquitetura horizontal)
- **Preço:** 5 números diferentes em circulação, nenhum validado
- **Tecnologia:** PWA vs Flutter, white-label, WhatsApp, schema do banco
- **Mercado:** fitness, saúde, qualquer profissional

**Conclusão:** decisão 1 (modelo) desbloqueia todas as outras. **Decidido: híbrido em fases (Agência → SaaS).**

### 0.5.2 Comparação financeira dos 3 modelos

|                              | SaaS puro                              | Agência pura                  | **Híbrido (escolhido)**      |
| ---------------------------- | -------------------------------------- | ----------------------------- | ---------------------------- |
| Margem bruta                 | 70-85%                                 | 30-50% (custo de tempo)       | 30% início → sobe com escala |
| Escala com tempo do founder? | Não — escala sozinho                   | Sim — teto pelo seu tempo     | Inicialmente sim, depois não |
| Pra R$ 10k/mês MRR           | ~100 clientes a R$ 97                  | 2-3 setups/mês                | 3-5 clientes fundadores      |
| Velocidade de receita        | Lenta inicialmente, exponencial depois | Rápida imediata, para no teto | Rápida agora, boa depois     |
| Valuation                    | 6-10x ARR                              | 1-2x receita anual            | Médio, cresce com % SaaS     |

Dado de mercado (Sebrae 2024): modelo SaaS recuou 10% em adoção, vendas diretas cresceram 39% — reforça começar com agência.

### 0.5.3 Posicionamento: C (vertical fitness com arquitetura horizontal)

Começa em fitness (musculação, nutrição), mas **schema agnóstico desde dia 1**. Um `component` pode ser treino, aula de inglês ou sessão de coaching. Fitness é o primeiro vertical, não o único.

Arquitetura plugin-based (D-G21 + §5) suporta expansão pra novos verticais sem refatorar core.

### 0.5.4 Cliente ideal (fase agência hoje)

- Personal trainer ou nutricionista com **30k+ seguidores**
- Faturando **R$ 15k+/mês** consistentemente
- Já vendeu **pelo menos 1 programa** pelo Hotmart/Kiwify
- Sente dor de operar tudo no WhatsApp + planilha + improviso
- Quer **marca própria**, não quer aparecer dentro de marketplace tipo Mydose

### 0.5.5 Precificação fase agência (proposta atual — fonte da verdade)

3 pacotes setup + mensalidade plataforma via EFI Bank:

| Pacote                                  | Setup    | Entrega | Mensalidade | Quando começa cobrança                                   |
| --------------------------------------- | -------- | ------- | ----------- | -------------------------------------------------------- |
| **A — Vendas e captação**               | R$ 1.500 | 30 dias | R$ 100/mês  | A partir do 31º dia (30d cortesia)                       |
| **B — Aplicativo com sua marca**        | R$ 3.000 | 60 dias | R$ 200/mês  | A partir do 11º mês (10 meses alinhados ao parcelamento) |
| **C — Conjunto completo (recomendado)** | R$ 4.000 | 90 dias | R$ 200/mês  | A partir do 11º mês                                      |

Pagamento setup: Pix à vista (10% off), 2× Pix (assinatura + entrega), 10× cartão sem juros.

Adicionais (cobrados separadamente):

- Programa adicional configurado: R$ 800 (+10d)
- Setup tráfego pago (Meta Ads): R$ 1.200 (+7d)
- Site institucional: R$ 500 (+7d)
- Página adicional customizada: R$ 300 (+5d)

**Grupo de construção: descartado.** Coordenar decisões com múltiplas pessoas atrasa. Caminho certo é **multi-tenant com perfis complementares** (emagrecimento feminino, hipertrofia masculino, corrida, etc) — constrói uma vez, configura N vezes, fatura N vezes.

### 0.5.6 Projeção realista fase agência

Ticket médio assumido: Pacote C (R$ 4.000). Mix real ajusta.

| Mês | Novos setups       | MRR acumulado                      | Caixa do mês |
| --- | ------------------ | ---------------------------------- | ------------ |
| 1   | 2 × R$ 4k = R$ 8k  | R$ 200 (1 cliente sai da cortesia) | R$ 8,2k      |
| 3   | 3 × R$ 4k = R$ 12k | R$ 1k                              | R$ 13k       |
| 6   | 3 × R$ 4k = R$ 12k | R$ 2,4k                            | R$ 14,4k     |
| 12  | 3 × R$ 4k = R$ 12k | R$ 4,5k                            | R$ 16,5k     |

**Acumulado 6 meses:** ~R$ 65-80k caixa + ~15 clientes recorrentes (dependendo do mix Pacote A/B/C).

### 0.5.7 Fase 2 — Híbrido (3-6 meses depois)

Setup começa **parcialmente automatizado:**

- Primeiros 5 clientes feitos manualmente geram **templates reutilizáveis**
- Próximo cliente aproveita o que o anterior validou
- Tempo de setup cai de ~20h → 4-6h
- Mensalidade começa a pesar mais no faturamento total
- Para de depender só de novos setups pra crescer

### 0.5.8 Fase 3 — SaaS self-service (caixa estabilizado)

Profissional configura tudo sozinho via **vibe coding** (§13) — sem intervenção do founder. Formulários, onboarding, estrutura de programas, módulos e componentes criados por prompts dentro da plataforma.

**Precificação SaaS (modelo a refinar — números preliminares):**

- **Sem setup** (profissional se configura sozinho)
- Mensalidade maior: R$ 297-497/mês (validar)
- **Take rate: 5-10%** sobre vendas dos programas (via Pagar.me split — §24.4)
- **Clientes fundadores da fase agência mantêm mensalidade menor pra sempre**

**Como tratar fundadores quando SaaS for self-service (argumento validado):**

> "Você entrou como fundador. Pagou o setup porque fizemos tudo pra você. Os novos se configuram sozinhos — por isso não pagam setup. Mas sua mensalidade de fundador é menor pra sempre e nunca aumenta."

Quem entra cedo paga setup + mensalidade menor vitalícia. Quem entra depois paga mensalidade maior sem setup. Cada um leva vantagem diferente — sem ofensa.

### 0.5.9 Multi-profissionais / multi-vertical

**Ordem de expansão decidida:**

1. **Brasil → fitness** (musculação, nutrição) — agora
2. **Portugal/Europa** — mesmo idioma, cliente paga em euro
3. **Inglês** — escala global

**Como entram novos verticais (yoga, inglês, terapia, mentoria, coach carreira):**

- Arquitetura já suporta (D-G21 plugin content library + `component.kind` polimórfico)
- Um `component` é agnóstico — pode ser treino, aula gramática, sessão coaching
- Biblioteca exercícios fitness é **plugin do vertical fitness**, não o coração do sistema
- Novo vertical = novo plugin registrado em `ContentLibraryRegistry`, sem refatorar core (ver §5)

### 0.5.10 Transição agência → SaaS (gatilhos de virada)

Decisão em aberto (§31.2 novo item). Critérios candidatos:

- **X tenants atingidos** (sugestão preliminar: 15-20)
- **Y MRR atingido** (sugestão preliminar: R$ 15-20k recorrente)
- **Z templates de programa validados** com casos reais (sugestão preliminar: 5+)
- **Maturidade do vibe coding** (caso de uso self-service rodando em prod com 2+ tenants)

Quando atinge esses gatilhos: para de cobrar setup novo, aumenta mensalidade padrão, libera onboarding self-service via vibe coding. Fundadores mantêm condições vitalícias.

### 0.5.11 Por que NÃO ser SaaS puro desde dia 1

- Margem alta de SaaS só vem com escala (~100 clientes)
- Sem cashflow inicial pra financiar construção
- Sem validação real do produto (vibe coding maduro precisa de templates testados)
- Tempo até R$ 10k/mês MRR é muito maior

### 0.5.12 Por que NÃO ser agência pura pra sempre

- Teto financeiro = horas do founder
- Não escala sem contratar (dilui margem)
- Valuation baixo (1-2x receita vs 6-10x ARR SaaS)
- Mantém founder no operacional, longe do estratégico

---

## 1. Stack travado (não bumpar major)

### 1.1 Runtime

```
Next.js 16.x (App Router, Turbopack)
React 19.x (Server Components default)
TypeScript 5.x strict
Tailwind CSS v4.x (tokens em globals.css @theme, zero JS config)
shadcn/ui new-york dark-first
Motion 12.x (motion/react, NUNCA framer-motion)
Geist + Geist Mono (next/font)
lucide-react (ícones)
vaul (bottom sheets mobile)
@supabase/ssr 0.10.x + @supabase/supabase-js 2.x
Zod 4.x + React Hook Form 7.x + @hookform/resolvers 5.x
next-intl 4.x
nuqs (URL state)
class-variance-authority + tailwind-merge + clsx
date-fns 4.x
sonner (toast)
cmdk (command palette)
embla-carousel-react
react-day-picker 9.x
react-easy-crop
react-resizable-panels
recharts 3.x (charts)
input-otp
libphonenumber-js (validação telefone BR)
radix-ui (primitivos via shadcn)
@dnd-kit/core + sortable + utilities (drag-drop editor)
@tanstack/react-table 8.x (data tables)
```

### 1.2 Backend / infra

```
Supabase (auth + Postgres + storage + edge functions + realtime)
Resend + react-email (transacional)
EFI Bank (mensalidade plataforma — Pix + cartão)
Bunny Stream (vídeo + CDN PoP SP)
Vercel AI Gateway (zero markup Anthropic + failover)
Asaas (link externo dia 1 — gateway pagamento aluno)
Pagar.me (marketplace fase futura, split nativo)
Meta Cloud API (WhatsApp Business)
Vercel (hosting + Analytics + Speed Insights)
Vercel AI Gateway + Anthropic Claude (IA — Haiku volume, Sonnet qualidade)
Serwist (Service Worker, Next 16 compatível)
Sentry (@sentry/nextjs)
@upstash/ratelimit + @upstash/redis (rate limit)
apca-w3 + culori (color contrast + manipulação OKLCH)
```

### 1.3 Dev/build

```
pnpm 10.x (nunca npm/yarn) — packageManager pinado no package.json
ESLint 9.x flat config (eslint.config.ts — TS nativo desde v9.18+)
typescript-eslint strict-type-checked + stylistic-type-checked
@softarc/sheriff-core + @softarc/eslint-plugin-sheriff (boundary rules — D-G57)
@eslint-community/eslint-plugin-eslint-comments (bane eslint-disable — D-G11)
eslint-plugin-better-tailwindcss (Tailwind v4 nativo — legacy NÃO suporta v4)
eslint-plugin-unicorn / jsx-a11y / react-hooks / promise / import
Prettier 3.x + prettier-plugin-tailwindcss (tailwindFunctions: ['cn','cva','tv'])
Husky 9.x + lint-staged (--no-inline-config + --max-warnings 0)
@commitlint/cli + config-conventional (conventional commits)
Vitest 4.x + @vitest/ui
Playwright 1.x + @axe-core/playwright
Ladle 5.x (Storybook leve, primitives + blocks)
knip (dead code detection — superset depcheck, [E] dia 1)
size-limit + size-limit-action GHA (Next 16 removeu per-route bundle stats)
Renovate (config restritivo — major bloqueado, automerge só devDeps minor/patch)
react-email (preview templates)
tsx (scripts)
Node 24 LTS (.nvmrc) + engines pinados em package.json
```

### 1.4 Next 16 features ON dia 1 (decididas)

| Feature                               | Status             | Como                                                                                                                  |
| ------------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `cacheComponents: true`               | ✅ ON dia 1        | `next.config.ts`. Inverte default: tudo é dynamic, cachear é opt-in via `'use cache'` + `cacheLife()` + `cacheTag()`. |
| PPR (Partial Pre-Rendering)           | ✅ Automático      | Ativa sob `cacheComponents`. `experimental.ppr` deixa de existir.                                                     |
| Turbopack dev + prod                  | ✅ Default Next 16 | Sem flag.                                                                                                             |
| React Compiler 1.0                    | ✅ ON dia 1        | Estável em React 19. Sem `useMemo`/`useCallback` manual em 90% dos casos.                                             |
| `proxy.ts` (ex-middleware.ts)         | ✅ ON dia 1        | Único arquivo edge: resolve `tenant_id` por `host` e rewrites. Resto Node.                                            |
| `unstable_after`                      | ⚠️ uso cauteloso   | Só pra fire-and-forget pós-response (logs, analytics não-bloqueantes). Nunca em worker efêmero.                       |
| `revalidateTag(tag, profile)`         | ✅ Sempre 2 args   | `revalidateTag('tenant:x', 'max')` — single-arg deprecado Next 16.                                                    |
| Turbopack filesystem cache dev (beta) | ⏳ Aguardar Q2     | Beta. Avaliar quando estável.                                                                                         |

```ts
// next.config.ts
import type { NextConfig } from 'next'

const config: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: {
    /* sem ppr — automático */
  },
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.b-cdn.net' /* Bunny */ }] },
}

export default config
```

```ts
// proxy.ts (edge — único arquivo edge do projeto)
export const config = { matcher: ['/((?!_next|api|favicon).*)'], runtime: 'edge' }

export default function proxy(req: Request) {
  const url = new URL(req.url)
  const tenantId = resolveTenantFromHost(url.hostname) // edge KV lookup
  url.searchParams.set('__tenant', tenantId)
  return Response.rewrite(url)
}
```

### 1.5 `tsconfig.json` strict++ (D-G58)

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true, // arr[0] vira T | undefined — pega 80% null-bugs runtime
    "exactOptionalPropertyTypes": true, // {x?: string} NÃO aceita {x: undefined} — força clareza
    "noImplicitOverride": true, // exige `override` keyword
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true,
    "verbatimModuleSyntax": true, // ESM/CJS sem ambiguidade
    "isolatedModules": true, // Next.js exige
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "ES2022",
    "lib": ["DOM", "DOM.Iterable", "ES2023"],
    "jsx": "preserve",
    "incremental": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true,
    "noEmit": true,
    "paths": { "@/*": ["./*"] },
    "plugins": [{ "name": "next" }],
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"],
}
```

**NÃO adicionar** `noPropertyAccessFromIndexSignature: true` — Research C: "o mais ruidoso, fica [I]". Adicionar quando refator natural tornar útil.

**Trade-offs aceitos:**

- `noUncheckedIndexedAccess`: pequenos refactors (acessar `arr[0]` precisa `?.` ou check explícito). Ganho catastrófico em runtime — pega maior parte dos "Cannot read properties of undefined".
- `exactOptionalPropertyTypes`: quebra libs que passam `undefined` explicitamente. Em greenfield com Zod controlando shapes, vale a dor.

### 1.6 Sheriff boundaries (D-G57)

```ts
// sheriff.config.ts
import type { SheriffConfig } from '@softarc/sheriff-core'

export const config: SheriffConfig = {
  modules: {
    'app/(*)': ['type:feature', 'scope:web'],
    'app/(*)/(*)': ['type:feature', 'scope:web'],
    'lib/contracts': 'type:shared',
    'lib/contracts/(*)': 'type:shared',
    'lib/data': ['type:data', 'side:server'],
    'lib/data/(*)': ['type:data', 'side:server'],
    'lib/domain': 'type:shared',
    'lib/supabase': ['type:data', 'side:server'],
    'lib/api': ['type:shared', 'side:server'],
    'lib/design': 'type:shared',
    'lib/hooks': 'type:shared',
    'lib/auth': 'type:shared',
    'lib/email': ['type:shared', 'side:server'],
    'lib/i18n': 'type:shared',
    'lib/utils': 'type:shared',
    'components/ui': 'type:shared',
    'components/(*)': ['type:feature', 'scope:web'],
  },
  depRules: {
    'type:feature': ['type:feature', 'type:shared', 'type:data'],
    'type:data': ['type:shared'],
    'type:shared': ['type:shared'],
    'side:server': 'noTag', // server-only não importável de client component
    root: ['type:feature', 'type:shared'], // app root pode importar tudo
  },
  enableBarrelLess: true, // proíbe re-export que esconde acoplamento
}
```

**Por que Sheriff (vs eslint-plugin-boundaries / dependency-cruiser):**

- Tag-based (mais expressivo que path-based)
- Encapsulamento `internal/` (Research C menciona)
- `enableBarrelLess: true` força importar nominal direto (sem `index.ts` re-exportando tudo)
- Custo psicológico alto pra criar camada nova (precisa tag + dep rule) = anti 30+ camadas

**Defesa real:** `lib/data/programs.ts` tentar importar `app/(shell)/programs/page.tsx` = erro lint. Acabou o pattern "dados depende de UI" que vazou no onboarding-bio.

**`dependency-cruiser` [I] no CI** complementar quando Sheriff não bastar (detecção de circular dependency cross-package, orphan files).
**Regra:** **edge runtime SÓ no `proxy.ts`.** Server actions, RPCs Supabase, Stripe SDK, Anthropic SDK, image upload com Sharp — tudo Node (default).

---

## 2. Naming convention completa

### 2.1 Idioma por camada

| Camada                                                    | Idioma                                       | Exemplo                                                     |
| --------------------------------------------------------- | -------------------------------------------- | ----------------------------------------------------------- |
| DB (tabelas, colunas, enums, RPCs, triggers, buckets)     | **EN 100%**                                  | `tenants`, `created_at`, `tenant_role`                      |
| Code identifiers (arquivos, pastas, types, funções, vars) | **EN 100%**                                  | `lib/data/programs.ts`, `ProgramRow`, `getActiveTenant()`   |
| Pastas em `app/`                                          | **EN kebab-case**                            | `/app/client/` (em URL pública vira `/aluno/*` via rewrite) |
| URL pública                                               | **PT-BR via rewrites** em `next.config.ts`   | `desafit.app/treinos` → `/workouts`                         |
| UI strings                                                | **PT-BR via `t()`** em `messages/pt-BR.json` | `t('workouts.title')`                                       |
| Documentação interna                                      | PT-BR livre                                  | `docs/`                                                     |
| JSONB AI payload keys                                     | **EN sempre**                                | `{ pillars, reflection, instructions }`                     |
| JSONB AI payload values                                   | **PT-BR (LLM output)**                       | `pillars: ["Hipertrofia", "Resistência"]`                   |

### 2.2 Convenções específicas

| Item                | Padrão                                                | Exemplo                                                                  |
| ------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| Arquivos componente | `kebab-case.tsx`                                      | `workout-editor.tsx`                                                     |
| Pastas componente   | `kebab-case/`                                         | `components/workout-editor/`                                             |
| Hooks               | `use-*.ts`                                            | `lib/hooks/use-responsive.ts`                                            |
| Helpers/utils       | `kebab-case.ts`                                       | `lib/utils/calculate-tdee.ts`                                            |
| Schemas Zod         | `<entity>.schema.ts` em `lib/contracts/<entity>/`     | `programs.schema.ts` exporta `ProgramSchema` + `type Program`            |
| Server actions      | `*.action.ts` em `app/<route>/_actions/` (Research C) | `app/programs/_actions/create-program.action.ts`                         |
| Data layer          | `<entity>.ts` em `lib/data/`                          | `lib/data/programs.ts` exporta `createProgram(client, input)`            |
| Component principal | nome do componente, não `index.tsx`                   | `components/workout-editor/workout-editor.tsx`                           |
| Variants TypeScript | enum union                                            | `variant: 'default' \| 'outlined' \| 'interactive' \| 'featured'`        |
| Tokens CSS          | `--<category>-<name>`                                 | `--color-primary`, `--surface-card`, `--shape-button`, `--density-pad-x` |
| Eventos analytics   | snake_case                                            | `signup_completed`, `enrollment_created`, `check_in_submitted`           |
| RPCs Supabase       | `<verb>_<entity>` snake                               | `enroll_client`, `create_program`, `generate_assessment`                 |
| Edge Functions      | kebab-case                                            | `send-email`, `switch-tenant`, `generate-assessment`                     |
| Booleans            | prefixo `is_*`                                        | `is_active`, `is_published`, `is_validated`                              |
| Timestamps          | `created_at`, `updated_at`, `deleted_at`              | soft delete em todas tabelas chave                                       |
| FK                  | `<entity>_id` snake_case                              | `tenant_id`, `program_id`, `client_id`                                   |
| Migrations          | `YYYYMMDDHHMMSS_<verb_en>.sql`                        | `20260601120000_add_programs_table.sql`                                  |

### 2.3 ESLint flat config completo (`eslint.config.ts`) — Research C 2026-05

ESLint v9.18+ suporta `.ts` config nativo. Stack: `typescript-eslint strict-type-checked + stylistic-type-checked` (preset oficial, recomendado pra devs proficient) + plugins-chave.

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
  {
    ignores: ['.next/**', 'node_modules/**', '**/*.gen.ts', 'public/**', 'supabase/migrations/**'],
  },
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
      // ───── A. Banir vocabulário legado + stack errado (D-G14, D-G3) ─────
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'framer-motion', message: "BANNED. Use 'motion/react' (Motion 12)." }],
          patterns: [
            { group: ['**/legacy/**'], message: 'legacy/ frozen. Migrate file before importing.' },
            {
              group: ['@supabase/supabase-js'],
              message: 'Use lib/supabase/{client,server}. NEVER createClient() directly.',
            },
            {
              group: ['@/lib/supabase/admin'],
              message: 'Admin client only in supabase/functions/** and migrations (server-only).',
            },
          ],
        },
      ],
      'id-denylist': [
        'error',
        // §0.3 lista canônica (palavras banidas)
        'student',
        'trainer',
        'intake',
        'wizard',
        'prospect',
        'diagnostic',
        'diagnostico',
        'customization',
        'workspace',
        'reflexao',
        'pilares',
        'aluno',
        'prof',
      ],
      'no-restricted-syntax': [
        'error',
        { selector: "Literal[value='student']", message: "Use 'client' (D-G5)" },
        { selector: "Literal[value='trainer']", message: "Use 'professional' (D-G5)" },
        { selector: "Literal[value='intake']", message: "Use 'capture_form' (§0.3)" },
        { selector: "Literal[value='wizard']", message: "Use 'setup' (§0.3)" },
        { selector: "Literal[value='prospect']", message: "Use 'lead' (§0.3)" },
        { selector: "Literal[value='diagnostic']", message: "Use 'assessment' (§0.3)" },
      ],

      // ───── B. Tamanhos/complexidade (§3.3 — D-G56) ─────
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 60, IIFEs: true }],
      complexity: ['error', 12],
      'max-depth': ['error', 4],
      'max-params': ['error', 4],
      'no-nested-ternary': 'error',

      // ───── C. Banir eslint-disable inline (D-G11 + memory feedback_zero_eslint_disable) ─────
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': true,
          'ts-expect-error': 'allow-with-description',
          'ts-nocheck': true,
        },
      ],
      'unicorn/no-abusive-eslint-disable': 'error',
      '@eslint-community/eslint-comments/no-use': ['error', { allow: [] }],
      // Allowlist hard-coded SÓ pra essas 2 strings exatas (validar via inspect, não regex):
      //   "block oficial shadcn" (1-2 ocorrências esperadas — shadcn add às vezes vem com disable)
      //   "third-party-component" (lib externa que não respeita lint)
      // Toda exception OUTRA = ADR obrigatório

      // ───── D. Type safety extra (Research C §2.2) ─────
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      eqeqeq: ['error', 'always'],

      // ───── E. React/Next ─────
      'react-hooks/exhaustive-deps': 'error',
      'react/jsx-no-leaked-render': 'error', // pega `{count && <X/>}` renderizando "0"
      'react/jsx-no-literals': 'error', // string literal em JSX = error (i18n §15)

      // ───── F. Tailwind v4 (Research C §8.1 — eslint-plugin-tailwindcss legacy NÃO suporta v4) ─────
      'better-tailwindcss/no-unregistered-classes': 'error', // bloqueia bg-[#hex]
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/sort-classes': 'warn',

      // ───── G. Outros ─────
      'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },

  // ───── H. Override: server-only files (sem 'use client') ─────
  {
    files: ['**/_actions/**/*.{ts,tsx}', 'lib/supabase/server.ts', 'lib/supabase/admin.ts'],
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

  // ───── I. Override: Server Actions (return type explícito Result<T, AppError>) ─────
  {
    files: ['**/_actions/*.action.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      'max-lines': ['error', { max: 100, skipBlankLines: true, skipComments: true }],
    },
  },

  // ───── J. Override: 'use client' files (limite 200 linhas) ─────
  {
    files: ['**/*.tsx'],
    rules: {
      // custom rule TODO: detect 'use client' directive + apply max-lines 200
      // (até criar custom rule, manter como WIP — Research C aceita override via glob específico)
    },
  },

  // ───── K. Tokens custom — anti token-bypass (cobertura dos 10 padrões — research DS) ─────
  // Adicionar aqui regras custom no-restricted-syntax pra pegar:
  // style={{ color: '#hex' }}, SVG fill="#hex", const COLOR = '#hex', etc.
  // Ver pesquisa DS (entregável "ESLint rules custom em código TS pronto + fixture de teste")
)
```

**Plugins adicionais:**

- `eslint-plugin-functional` — **[O]** (imutabilidade rigorosa, custo alto solo)
- `eslint-plugin-unicorn` extra rules (no-array-reduce, prefer-node-protocol) — **[I]**
- `eslint-plugin-tailwindcss` (legacy) — **NÃO usar** (não suporta v4, issue aberta jun 2025)
- Custom ESLint plugin caseiro — **[O]** (no-restricted-\* cobre 95%)

**Rodar:**

```bash
pnpm lint                           # eslint . --max-warnings 0 --no-inline-config
pnpm lint --fix                     # apenas auto-fix óbvio
```

Lint-staged usa `--no-inline-config` que **ignora `eslint-disable` em comentários** = mesmo se Claude escapar e adicionar disable, o lint local roda como se não existisse.

---

## 3. Arquitetura (camadas + SOLID + tamanhos)

### 3.1 Camadas (separação dura)

```
┌─────────────────────────────────────────┐
│ app/ (rotas)                            │ ← UI orquestra, ZERO lógica de negócio
│   └ <route>/page.tsx                    │
│   └ <route>/actions.ts (server actions) │ ← thin adapter, valida Zod, chama lib/data
├─────────────────────────────────────────┤
│ components/ (UI puro)                   │ ← visual + forma. Nunca chama Supabase.
│   └ ui/ (shadcn + primitives custom)    │
│   └ <feature>/                          │
├─────────────────────────────────────────┤
│ lib/hooks/ (estado React)               │ ← useState/useTransition/etc
├─────────────────────────────────────────┤
│ lib/data/ (IO Supabase)                 │ ← funções `(client, args) => Promise<T>`
│   └ <entity>.ts                         │ ← chama RPCs via client.rpc()
├─────────────────────────────────────────┤
│ lib/contracts/ (FONTE DA VERDADE §6)    │ ← Zod schemas + Result + AppError + adapters
│   └ result.ts, errors.ts, action.ts     │
│   └ <feature>/<feature>.schema.ts       │
│   └ <feature>/<feature>.contracts.ts    │
│   └ <feature>/<feature>.adapter.ts      │ ← fromRow/toRow (persistence ↔ domain)
├─────────────────────────────────────────┤
│ lib/domain/ (lógica pura, sem IO)       │ ← cálculos, regras de negócio
│   └ roles.ts, money.ts, nutrition.ts    │
│   └ <feature>/                          │
├─────────────────────────────────────────┤
│ lib/api/ (helpers Server Action)        │ ← requireAuth, requireRole, mapToAppError
├─────────────────────────────────────────┤
│ supabase/migrations/ (schema)           │
│ supabase/functions/ (Edge Functions Deno) │
└─────────────────────────────────────────┘
```

**Regra absoluta:** dependência desce. UI → server action → lib/data → RPC. Nunca subir.

### 3.2 SOLID aplicado

| Princípio                 | Aplicação concreta                                                                                                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Single Responsibility** | 1 arquivo = 1 propósito. `programs.ts` em `lib/data/` só faz IO de programas. Component `WorkoutEditor` só renderiza editor de workout.                                                                 |
| **Open/Closed**           | Extensível via composition. Adicionar `component.kind` novo (ex: `meditation`) = registrar plugin no `ContentLibraryRegistry`, sem mexer em `<ComponentRenderer>`.                                      |
| **Liskov Substitution**   | Todo `ContentLibraryPlugin` implementa interface comum. Plugin `exercise` substitui `food` substitui `vocabulary` sem quebrar consumidor.                                                               |
| **Interface Segregation** | Tipos pequenos e focados. `Program` ≠ `CreateProgram` (sem `id/created_at`) ≠ `UpdateProgram` (campos parciais).                                                                                        |
| **Dependency Inversion**  | UI depende de hook abstrato (`useProgram(id)`), hook depende de server action (`getProgramAction`), action depende de `lib/data/programs.ts`, que depende de RPC. Cada camada substituível sem cascata. |

### 3.3 Tamanhos máximos (lint enforce — Research C 2026-05, D-G56)

**Error único, sem warn intermediário** — Research C: "Software Engineering at Google" mostra funções >100 linhas como preditor forte de bug-density. Onboarding-bio teve 30+ camadas porque thresholds eram lenientes (warn 400/error 600). Greenfield é o único momento pra apertar.

| Item                                  | Threshold                                    | Regra ESLint                                                          |
| ------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------- |
| Linhas por arquivo                    | **error 300** (skipBlankLines, skipComments) | `max-lines`                                                           |
| Linhas por função                     | **error 60** (IIFEs incluídas)               | `max-lines-per-function`                                              |
| Cyclomatic complexity                 | **error 12**                                 | `complexity`                                                          |
| Nesting depth                         | **error 4**                                  | `max-depth`                                                           |
| Parâmetros por função                 | **error 4**                                  | `max-params`                                                          |
| `'use client'` file                   | **error 200 linhas**                         | `max-lines` override em files glob `'use client'` (regra customizada) |
| Server Action arquivo (`*.action.ts`) | **error 100 linhas**                         | `max-lines` override em glob `**/_actions/*.action.ts`                |

**Quando estourar:** quebrar arquivo/função, NÃO adicionar `eslint-disable` (CI bloqueia via `--no-inline-config` + PreToolUse hook + grep CI).

### 3.4 Estrutura completa de pastas

```
desafit/
├── app/
│   ├── layout.tsx                            # skip link + main + MotionConfig + theme-color
│   ├── globals.css                           # @theme tokens
│   ├── (auth)/                               # login, signup, forgot-password, reset, verify-email
│   ├── (setup)/                              # /setup — pós-signup, primeiro programa via vibe coding
│   ├── (shell)/                              # painel profissional (dashboard, programs, clients, etc)
│   │   ├── layout.tsx                        # sidebar + bottom nav responsive
│   │   ├── dashboard/
│   │   ├── programs/
│   │   ├── clients/
│   │   ├── capture/                          # captação (substitui "leads/intakes")
│   │   ├── pages/                            # editor visual de páginas públicas
│   │   ├── sales/
│   │   ├── emails/
│   │   ├── automations/
│   │   ├── appearance/                       # tema/branding tenant
│   │   └── settings/
│   ├── (client)/                             # PWA app do cliente final
│   │   └── aluno/                            # rota PT pública via rewrite
│   │       ├── layout.tsx                    # PWA shell (bottom nav fixa)
│   │       ├── dashboard/
│   │       ├── programs/[id]/
│   │       ├── check-in/
│   │       └── profile/
│   ├── (admin)/                              # painel admin plataforma
│   │   └── admin/
│   ├── (public)/                             # landing/vendas/captação de cada tenant
│   │   └── [slug]/
│   │       ├── page.tsx                      # landing
│   │       ├── programs/[id]/                # página de vendas
│   │       ├── capture/                      # página captação
│   │       ├── assessment/[id]/              # relatório IA
│   │       └── manifest.webmanifest/route.ts # manifest dinâmico por tenant
│   ├── (legal)/                              # lgpd, privacy, terms, cookies
│   ├── offline/                              # PWA offline page branded
│   └── api/
│       └── webhooks/                         # EFI, Pagar.me, WhatsApp, Pixel CAPI
├── components/
│   ├── ui/                                   # shadcn + primitives custom (Heading, Text, Eyebrow, Metric, etc)
│   ├── responsive/                           # ResponsiveModal, ResponsiveFilter
│   ├── editor/                               # editor visual blocos
│   └── <feature>/                            # features específicas (programs, capture, etc)
├── lib/
│   ├── contracts/                            # ★ FONTE DA VERDADE — Zod schemas + types + adapters (§6)
│   │   ├── index.ts                          # re-exporta o que é público
│   │   ├── result.ts                         # Result<T, E> discriminated union
│   │   ├── errors.ts                         # AppError z.discriminatedUnion('kind')
│   │   ├── action.ts                         # type ServerAction<I, O>
│   │   ├── auth/
│   │   ├── tenants/
│   │   ├── programs/
│   │   │   ├── programs.schema.ts            # ProgramSchema + types
│   │   │   ├── programs.contracts.ts         # input/output Server Actions
│   │   │   └── programs.adapter.ts           # fromProgramRow / toProgramRow
│   │   ├── components/<kind>/
│   │   │   ├── <kind>.draft.schema.ts        # magro pro LLM (§13.9)
│   │   │   ├── <kind>.strict.schema.ts       # rico pro banco/UI
│   │   │   └── <kind>.contracts.ts
│   │   └── ...
│   ├── api/
│   │   ├── auth.ts                           # requireAuth, requireRole
│   │   └── error.ts                          # mapToAppError(unknown): AppError
│   ├── data/                                 # IO Supabase (chama RPCs), função por entidade
│   ├── domain/                               # lógica pura, sem IO
│   │   ├── roles.ts                          # fonte única (USER_ROLES, MEMBERSHIP_ROLES)
│   │   ├── money.ts                          # Money value object (§15.4)
│   │   ├── nutrition.ts                      # cálculo TDEE/macros Mifflin-St Jeor
│   │   ├── ai/                               # engine determinístico IA (não prompts — §13.7)
│   │   └── <feature>/                        # outras lógicas puras por feature
│   ├── design/
│   │   ├── contrast.ts                       # APCA + ensureAccessible + pickReadableForeground
│   │   ├── tokens.ts                         # deriveTokens runtime (white-label)
│   │   └── plugins.ts                        # ContentLibraryRegistry
│   ├── hooks/
│   ├── auth/                                 # guards client-side
│   ├── email/                                # react-email templates
│   ├── env.ts                                # Zod env validation
│   ├── i18n/
│   │   └── request.ts                        # next-intl config
│   └── utils/
├── messages/
│   ├── pt-BR.json
│   └── en-US.json                            # espelho dia 1
├── supabase/
│   ├── migrations/
│   │   └── 0001_initial.sql                  # baseline único core (§16)
│   └── functions/
│       ├── _shared/                          # helpers Deno
│       ├── switch-tenant/                    # JWT re-issue
│       ├── send-email/                       # Resend wrapper
│       ├── send-push/                        # Web Push wrapper
│       ├── send-whatsapp/                    # Meta Cloud API wrapper
│       ├── generate-assessment/              # IA relatório
│       └── generate-program/                 # IA pipeline programa
├── public/
│   ├── icons/                                # default icons (fallback)
│   └── sw.js                                 # gerado por Serwist
├── tests/
│   ├── unit/                                 # vitest
│   └── e2e/                                  # playwright + axe-core
├── scripts/                                  # audit scripts (color, i18n, metrics)
├── .claude/
│   ├── rules/                                # 17 arquivos (§27)
│   └── skills/
├── docs/
│   ├── core/                                 # arquitetura, decisions, schema
│   ├── components/                           # decisions.md + CLAUDE.md
│   └── operacional/                          # runbooks, secrets management
├── .github/workflows/
│   └── ci.yml
├── CLAUDE.md                                 # raiz, enxuto, paths pra detalhes
├── README.md
├── eslint.config.mjs
├── next.config.ts
├── tsconfig.json
├── playwright.config.ts
├── vitest.config.ts
├── components.json                           # shadcn config
├── commitlint.config.ts
├── prettier.config.js
├── postcss.config.mjs
├── instrumentation.ts                        # Sentry
├── instrumentation-client.ts                 # Sentry client
├── sentry.{client,server,edge}.config.ts
├── package.json
├── pnpm-lock.yaml
├── .nvmrc                                    # 24
├── .npmrc
├── .gitignore
├── .env.example
├── .husky/
│   ├── pre-commit                            # lint-staged
│   ├── commit-msg                            # commitlint
│   └── pre-push                              # tsc + lint + vitest
└── .vscode/
    ├── settings.json
    └── extensions.json
```

---

## 4. Multi-tenant + roles + memberships

### 4.1 Modelo de tenancy

```
auth.users (Supabase Auth)
   │ 1:N
   ▼
public.memberships
   - user_id, tenant_id, role, status, created_at
   - UNIQUE(user_id, tenant_id)
   │ N:1
   ▼
public.tenants
   - id, name, slug, plan, theme_tokens (jsonb), deleted_at
```

**Signup automático** via trigger `handle_new_user`:

1. INSERT `auth.users` (Supabase signup)
2. Trigger cria `profiles(id=auth.users.id, role='professional')`
3. Trigger cria `tenants(id=gen_uuid, name=email_local, slug=derived)`
4. Trigger cria `memberships(user_id, tenant_id, role='professional', status='active')`

### 4.2 Roles canônicos (5 valores)

```sql
CREATE TYPE public.user_role AS ENUM (
  'professional', 'client', 'staff', 'admin', 'influencer'
);

CREATE TYPE public.membership_role AS ENUM (
  'professional', 'client', 'staff'
);
-- admin e influencer NÃO entram em memberships (são global user_role)
```

**`lib/domain/roles.ts` (fonte única):**

```ts
export const USER_ROLES = {
  professional: 'professional',
  client: 'client',
  staff: 'staff',
  admin: 'admin',
  influencer: 'influencer',
} as const
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export const MEMBERSHIP_ROLES = {
  professional: 'professional',
  client: 'client',
  staff: 'staff',
} as const
export type MembershipRole = (typeof MEMBERSHIP_ROLES)[keyof typeof MEMBERSHIP_ROLES]

export const isPlatformAdmin = (role: UserRole) => role === USER_ROLES.admin
export const canManagePrograms = (role: MembershipRole) =>
  [MEMBERSHIP_ROLES.professional, MEMBERSHIP_ROLES.staff].includes(role)
```

### 4.3 JWT claims (`custom_access_token_hook`)

```sql
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE
  claims jsonb; active_tenant uuid; active_role text;
BEGIN
  claims := event->'claims';
  SELECT m.tenant_id, m.role::text
  INTO active_tenant, active_role
  FROM public.memberships m
  WHERE m.user_id = (event->>'user_id')::uuid
    AND m.status = 'active'
    AND (m.tenant_id = (claims->'app_metadata'->>'active_tenant_id')::uuid
         OR claims->'app_metadata'->>'active_tenant_id' IS NULL)
  ORDER BY m.created_at ASC
  LIMIT 1;
  IF active_tenant IS NOT NULL THEN
    claims := jsonb_set(claims, '{app_metadata,tenant_id}', to_jsonb(active_tenant));
    claims := jsonb_set(claims, '{app_metadata,active_membership_role}', to_jsonb(active_role));
  END IF;
  RETURN jsonb_build_object('claims', claims);
END $$;
```

### 4.4 Tenant switching (Notion-style)

**UI:** dropdown no header com lista de tenants ativos do user.

**Edge function `switch-tenant`:** valida membership → `supabase.auth.admin.updateUserById(user.id, { app_metadata: { active_tenant_id: tenant_id } })` → client chama `supabase.auth.refreshSession()` → JWT re-emitido com novo `tenant_id` → `router.refresh()` mantém deep link.

**Multi-tab sync:** Supabase Realtime channel `user:{user_id}` notifica outras abas.

### 4.5 White-label runtime (theme tokens por tenant)

```ts
// tenants.theme_tokens jsonb
{
  "primary": "oklch(0.58 0.18 280)",   // 1 cor escolhida pelo prof
  "mode": "dark",                       // dark | light | auto
  "shape": "rounded",                   // sharp | rounded | pill
  "density": "cozy",                    // tight | cozy | roomy
  "logo_url": "...",
  "favicon_url": "...",
  "app_name": "Studio Exemplo",
  "theme_color": "#e83e8c",
  "background_color": "#0f0f0f"
}
```

**`deriveTokens(primary)`** em `lib/design/tokens.ts`:

- Gera secondary (+30° hue), tertiary (-30° hue)
- Gera 5 cores extras (Material 3 tonal scale)
- Gera 5 surfaces (dark L 0.10-0.26, light L 0.99-0.92)
- Valida cada par fg/bg via APCA `pickReadableForeground()`
- Retorna objeto pronto pra `style={...}` inline no `<html>`

### 4.6 Custom domain (decisão em §31)

3 modos URL pra rotas públicas:

1. `desafit.app/<slug>` (path)
2. `<slug>.desafit.app` (subdomínio, wildcard DNS)
3. `app.<custom>.com.br` (CNAME, Fase 2 via Cloudflare for SaaS)

### 4.7 RLS pattern (todas tabelas tenant-scoped)

```sql
-- isolamento (padrão pra TODA tabela desafit.*)
CREATE POLICY "tenant_isolation_select" ON desafit.programs
  FOR SELECT TO authenticated
  USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid);

-- role-based mutation
CREATE POLICY "professional_can_insert" ON desafit.programs
  FOR INSERT TO authenticated
  WITH CHECK (
    tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid
    AND (auth.jwt() -> 'app_metadata' ->> 'active_membership_role') IN ('professional', 'staff')
  );

-- admin global bypass
CREATE POLICY "admin_full_access" ON desafit.programs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
```

**Constraint dia 1:** CI script falha se alguma tabela sem RLS.

---

## 5. Vertical-aware + multi-modalidade (musculação → qualquer profissão)

### 5.1 Princípio

**Mesmo código serve professor de musculação, professor de inglês, nutricionista, mentor de carreira, coach mindfulness, terapeuta, yoga.** Diferença é **vertical** (configuração + vocabulário + content library + prompts IA), não código.

**Vertical é cidadão de primeira classe no schema dia 1.** Sem retrofit depois — impossível mostrar "workout" pra prof de inglês porque o mapping `vertical_component_kinds` filtra na origem.

### 5.2 Schema vertical-aware (dia 1)

```sql
-- catálogo de verticals (pré-populado dia 1; ativas vs inativas)
CREATE TABLE public.verticals (
  id text PRIMARY KEY,                 -- 'fitness_strength' | 'nutrition' | 'english_lang' | ...
  name_key text NOT NULL,              -- 'verticals.fitness_strength.name' (resolvido via next-intl)
  icon text NOT NULL,                  -- lucide icon name
  active boolean DEFAULT true,         -- false = declarado mas não lançado
  sort_order int NOT NULL
);

-- seed dia 1 (musculação ativa; resto declarado, ativar quando construir)
INSERT INTO public.verticals (id, name_key, icon, active, sort_order) VALUES
  ('fitness_strength',  'verticals.fitness_strength.name',  'Dumbbell',     true,  1),
  ('nutrition',         'verticals.nutrition.name',         'Apple',        false, 2),
  ('english_lang',      'verticals.english_lang.name',      'Languages',    false, 3),
  ('career_mentoring',  'verticals.career_mentoring.name',  'Briefcase',    false, 4),
  ('therapy',           'verticals.therapy.name',           'HeartPulse',   false, 5),
  ('yoga_meditation',   'verticals.yoga_meditation.name',   'Sparkles',     false, 6),
  ('business_coaching', 'verticals.business_coaching.name', 'TrendingUp',   false, 7);

-- tenant escolhe vertical no onboarding (1 por enquanto; expansível pra N:N via tabela)
ALTER TABLE desafit.tenants ADD COLUMN vertical_id text NOT NULL REFERENCES public.verticals(id);

-- mapping: quais component_kinds são válidos pra qual vertical
CREATE TABLE public.vertical_component_kinds (
  vertical_id text NOT NULL REFERENCES public.verticals(id),
  kind text NOT NULL,                  -- bate com enum component_kind
  default_position int,                -- ordem padrão no menu "adicionar componente" do painel
  PRIMARY KEY (vertical_id, kind)
);
```

**Multi-vertical num tenant futuro:** quando vier (raro), extrai `vertical_id` pra `tenant_verticals (tenant_id, vertical_id)` N:N. Schema acima já preparado.

### 5.3 `component_kind` enum estendido (declarado dia 1, ativado por vertical)

```sql
CREATE TYPE desafit.component_kind AS ENUM (
  -- Universais (cross-vertical)
  'video_lesson', 'lesson', 'material', 'message', 'task',
  'scheduled_live', 'individual_call', 'in_person_class', 'check_in',
  -- Fitness/strength specific
  'workout', 'meal_plan',
  -- Reservados pra outras verticals (declarados dia 1, implementados quando vertical for ativada)
  'vocab_drill', 'reading_comprehension', 'speaking_practice',  -- english_lang
  'recipe', 'food_log',                                          -- nutrition
  'journal_entry', 'thought_record',                             -- therapy
  'yoga_sequence', 'breathing_practice',                         -- yoga_meditation
  'goal_milestone', 'okr_review'                                 -- career_mentoring / business_coaching
);
```

**Por que declarar todos agora:** `ALTER TYPE ADD VALUE` é fácil mas exige reabrir schema em CI e roda em transação separada. Pré-declarar evita migrations futuras inteiras. Render no UI filtra por `vertical_component_kinds` — impossível um prof de musculação ver `vocab_drill` no dropdown.

**Seed dia 1 (fitness_strength):**

```sql
INSERT INTO public.vertical_component_kinds (vertical_id, kind, default_position) VALUES
  ('fitness_strength', 'workout',          1),
  ('fitness_strength', 'video_lesson',     2),
  ('fitness_strength', 'meal_plan',        3),
  ('fitness_strength', 'check_in',         4),
  ('fitness_strength', 'scheduled_live',   5),
  ('fitness_strength', 'individual_call',  6),
  ('fitness_strength', 'in_person_class',  7),
  ('fitness_strength', 'material',         8),
  ('fitness_strength', 'message',          9),
  ('fitness_strength', 'task',            10),
  ('fitness_strength', 'lesson',          11);
```

### 5.4 Vocabulário UI por vertical (next-intl)

Mesmo `kind` (`lesson`) vira label diferente por vertical (`Aula gravada` musculação · `Aula` inglês · `Sessão` nutrição). Resolução via next-intl messages namespaced por vertical:

```
messages/pt-BR/common.json                       # cross-vertical
messages/pt-BR/kinds.fitness_strength.json       # labels específicos da vertical
messages/pt-BR/kinds.english_lang.json
messages/pt-BR/kinds.nutrition.json
```

```json
// messages/pt-BR/kinds.fitness_strength.json
{
  "kinds": {
    "workout": { "label": "Treino", "label_plural": "Treinos", "verb_action": "Treinar" },
    "meal_plan": {
      "label": "Plano alimentar",
      "label_plural": "Planos alimentares",
      "verb_action": "Seguir"
    },
    "lesson": {
      "label": "Aula gravada",
      "label_plural": "Aulas gravadas",
      "verb_action": "Assistir"
    },
    "scheduled_live": {
      "label": "Live agendada",
      "label_plural": "Lives agendadas",
      "verb_action": "Entrar"
    },
    "individual_call": {
      "label": "Call 1:1",
      "label_plural": "Calls 1:1",
      "verb_action": "Entrar"
    },
    "in_person_class": {
      "label": "Aula presencial",
      "label_plural": "Aulas presenciais",
      "verb_action": "Comparecer"
    },
    "check_in": { "label": "Check-in", "label_plural": "Check-ins", "verb_action": "Responder" },
    "material": { "label": "Material", "label_plural": "Materiais", "verb_action": "Baixar" },
    "task": { "label": "Tarefa", "label_plural": "Tarefas", "verb_action": "Fazer" },
    "message": { "label": "Mensagem", "label_plural": "Mensagens", "verb_action": "Ler" },
    "video_lesson": {
      "label": "Vídeo-aula",
      "label_plural": "Vídeo-aulas",
      "verb_action": "Assistir"
    }
  }
}
```

Helper de UI:

```ts
// lib/i18n/kind-label.ts
import { useTranslations } from 'next-intl'
export function useKindLabel(verticalId: string) {
  const t = useTranslations(`kinds.${verticalId}`)
  return (kind: string, form: 'label' | 'label_plural' | 'verb_action' = 'label') =>
    t(`${kind}.${form}`)
}
```

### 5.5 Vibe coding `vertical_id` obrigatório

Pipeline de geração (estágios identidade/estrutura/componentes/coerência — §13) **sempre recebe `vertical_id`** como input. Prompts vivem no banco com chave composta `vibe.<stage>.<vertical_id>`:

```sql
-- exemplos de chaves
'vibe.identity.fitness_strength'
'vibe.structure.fitness_strength'
'vibe.component.workout.fitness_strength'
'vibe.coherence.fitness_strength'
```

Sem `vertical_id` → server action rejeita com `400 vertical_required`. Impossível gerar conteúdo "agnóstico" — sempre vertical-bound.

### 5.6 Plugin Content Library (registrado por vertical)

```ts
// lib/design/plugins.ts
export interface ContentLibraryPlugin<T = unknown> {
  id: string // 'exercise' | 'food' | 'vocabulary' | ...
  vertical_ids: string[] // quais verticals usam
  search: (query: string, filters?: object) => Promise<T[]>
  getById: (id: string) => Promise<T | null>
  renderPickerItem: (item: T) => ReactNode
  schema: z.ZodSchema<T>
}

export const ContentLibraryRegistry = new Map<string, ContentLibraryPlugin>()

// MVP plugins dia 1
import { exerciseLibrary } from './plugins/exercise' // free-exercise-db, verticals: ['fitness_strength']
import { foodLibrary } from './plugins/food' // TACO/USDA, verticals: ['fitness_strength', 'nutrition']
ContentLibraryRegistry.set('exercise', exerciseLibrary)
ContentLibraryRegistry.set('food', foodLibrary)

// Futuro: vocabulary (english_lang), yoga_pose, meditation_track — adicionar sem tocar código existente
```

### 5.7 Templates por vertical (`specialty_templates`)

```sql
CREATE TABLE public.specialty_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vertical_id text NOT NULL REFERENCES public.verticals(id),
  template_key text NOT NULL,          -- '21-day-cut' | 'beginner-conversation' | ...
  template_data jsonb NOT NULL,        -- estrutura programa + módulos + componentes
  ai_context jsonb NOT NULL,           -- prompts/perguntas pra vibe coding
  is_official boolean DEFAULT true,    -- true = criado pela plataforma, clonável por qualquer tenant
  is_public boolean DEFAULT true,
  UNIQUE (vertical_id, template_key)
);
```

**Catálogo inicial fitness_strength (6 templates):**

1. "21 Dias Mais Leve" (emagrecimento — MVP, validar primeiro)
2. "Hipertrofia 12 Semanas"
3. "Iniciante Musculação 8 Semanas"
4. "Crossfit Funcional 30 dias"
5. "Corrida 5K em 8 semanas"
6. "Mobilidade 21 dias"

**Catálogo futuro (quando ativar outras verticals):**

- `english_lang`: "Conversação 60 dias", "Business English 90 dias"
- `nutrition`: "Reeducação Alimentar 21 dias", "Plano Vegano 30 dias"
- `yoga_meditation`: "Meditação Diária 30 dias"
- `career_mentoring`: "Transição de Carreira 12 semanas"

**Clone:** prof escolhe template oficial → backend cria `program` independente com `source_template_id` setado. Atualizar template não toca clones (clones são autônomos pós-clone).

### 5.8 Generalização — checklist de cada feature nova

Ao criar feature, perguntar:

1. Funciona pra prof de inglês? Pra nutricionista? Pra coach?
2. Tem campos "específicos de fitness" hardcoded? → mover pra `payload jsonb` modular
3. Texto da UI menciona "treino", "exercício"? → usar `useKindLabel(tenant.vertical_id)('workout', 'label')`
4. Nova feature lê `kind` direto? → filtrar via `vertical_component_kinds`
5. Vibe coding nova? → criar prompt key `vibe.<stage>.<vertical_id>`, nunca prompt único

---

## 6. Contratos (Zod 4 + RHF + Server Actions + RPC) — `lib/contracts/` único fonte da verdade

> **D-G54:** renomeação `lib/domain/schemas/` → `lib/contracts/`. Nome semântico melhor — contratos = fonte da verdade entre camadas (UI ↔ Server Action ↔ data ↔ RPC). "Schemas" sugeria só Zod validation; "contracts" inclui Result + AppError + adapters.

### 6.1 Estrutura canônica

```
lib/contracts/                            # ÚNICA fonte da verdade — tipos vivem aqui
├── index.ts                              # re-exporta o que vale ser público
├── result.ts                             # Result<T, E> discriminated union (§6.4)
├── errors.ts                             # AppError = z.discriminatedUnion('kind', [...])
├── action.ts                             # type ServerAction<I, O>
├── auth/
│   ├── auth.schema.ts                    # zod schemas + types exportados (z.infer)
│   └── auth.contracts.ts                 # input/output de cada Server Action
├── tenants/
│   ├── tenants.schema.ts                 # tenantSchema, themeTokensSchema
│   └── tenants.contracts.ts
├── programs/
│   ├── programs.schema.ts                # programSchema, moduleSchema
│   └── programs.contracts.ts
├── components/
│   ├── workout/
│   │   ├── workout.draft.schema.ts       # schema MAGRO pro LLM (sem .min/.max/.url/.regex — §13.9)
│   │   ├── workout.strict.schema.ts      # schema RICO pro banco/UI (com constraints)
│   │   └── workout.contracts.ts
│   ├── meal-plan/ ...
│   └── ...
├── enrollments/
└── ...

lib/data/                                 # IO Supabase (chama RPCs)
lib/supabase/
├── client.ts                             # browser; @supabase/ssr
├── server.ts                             # 'server-only'; cookies request
├── admin.ts                              # 'server-only'; service-role (Edge/migrations only)
├── types.gen.ts                          # gerado pelo `supabase gen types` (CI drift check §3.3 Research C)
└── index.ts                              # re-exporta SOMENTE client + server (admin nunca)

lib/api/                                  # adapters Server Action helpers
├── auth.ts                               # requireAuth, requireRole
└── error.ts                              # mapToAppError(unknown): AppError
```

**Por que separar `lib/contracts/` de `lib/supabase/types.gen.ts`:** o gerado descreve **o banco**; o contracts descreve **a API/domínio**. Convergem em adapters explícitos (`fromRow(row): Workout`). Tentar usar tipos gerados como domínio causa acoplamento persistence↔UI — pegada clássica do refator anterior.

### 6.2 Padrão schema (Zod 4)

```ts
// lib/contracts/programs/programs.schema.ts
import { z } from 'zod'

export const ProgramSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  name: z.string().min(3).max(120),
  status: z.enum(['draft', 'active', 'archived']),
  created_at: z.iso.datetime(),
})
export type Program = z.infer<typeof ProgramSchema>

// Create (sem id/created_at):
export const CreateProgramSchema = ProgramSchema.omit({ id: true, created_at: true })
export type CreateProgram = z.infer<typeof CreateProgramSchema>
```

### 6.3 Server Actions (thin adapters, naming `*.action.ts`)

```ts
// app/(shell)/programs/_actions/create-program.action.ts
'use server'
import { revalidatePath } from 'next/cache'
import { CreateProgramSchema, type Program } from '@/lib/contracts/programs/programs.schema'
import { ok, fail, type Result } from '@/lib/contracts/result'
import type { AppError } from '@/lib/contracts/errors'
import { createProgram } from '@/lib/data/programs'
import { createClient } from '@/lib/supabase/server'
import { mapToAppError } from '@/lib/api/error'

export async function createProgramAction(input: unknown): Promise<Result<Program, AppError>> {
  const parsed = CreateProgramSchema.safeParse(input)
  if (!parsed.success) {
    return fail({
      kind: 'validation',
      fields: parsed.error.flatten().fieldErrors as Record<string, string>,
    })
  }

  try {
    const supabase = await createClient()
    const program = await createProgram(supabase, parsed.data)
    revalidatePath('/dashboard/programs')
    return ok(program)
  } catch (e) {
    return fail(mapToAppError(e))
  }
}
```

**Convenções inegociáveis (lint enforce):**

- Arquivo de Server Action termina em `*.action.ts` (regra `unicorn/filename-case` + glob específico)
- 1 action por arquivo. `_actions/index.ts` re-exporta named.
- Retorno sempre `Promise<Result<T, AppError>>` (regra `@typescript-eslint/explicit-function-return-type` em `**/_actions/*`)
- `'use server'` directive primeira linha
- Sem `try/catch` engolindo erro — sempre via `mapToAppError(e)` que vira `AppError.kind === 'unknown'`

### 6.4 `lib/contracts/result.ts` — Result discriminated union (D-G55)

```ts
// lib/contracts/result.ts
import type { AppError } from './errors'

export type Result<T, E = AppError> = { ok: true; data: T } | { ok: false; error: E }

export const ok = <T>(data: T): Result<T, never> => ({ ok: true, data })
export const fail = <E>(error: E): Result<never, E> => ({ ok: false, error })

// Type guards (uso em UI):
export const isOk = <T, E>(r: Result<T, E>): r is { ok: true; data: T } => r.ok
export const isErr = <T, E>(r: Result<T, E>): r is { ok: false; error: E } => !r.ok
```

### 6.4b `lib/contracts/errors.ts` — AppError discriminated union (D-G55)

```ts
// lib/contracts/errors.ts
import { z } from 'zod'

export const AppErrorSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('validation'),
    fields: z.record(z.string(), z.string()),
  }),
  z.object({
    kind: z.literal('not_found'),
    resource: z.string(),
  }),
  z.object({
    kind: z.literal('forbidden'),
    reason: z.string(),
  }),
  z.object({
    kind: z.literal('conflict'),
    reason: z.string(),
  }),
  z.object({
    kind: z.literal('budget_exceeded'),
    used_cents: z.number(),
    cap_cents: z.number(),
  }),
  z.object({
    kind: z.literal('unknown'),
    cause: z.string(),
  }),
])
export type AppError = z.infer<typeof AppErrorSchema>

// Adicionar novos kinds = decision em ADR + atualizar discriminated union.
```

**Uso em UI (switch exhaustiveness check ESLint força):**

```tsx
const r = await createProgramAction(input)
if (r.ok) {
  toast.success(`Programa "${r.data.name}" criado`)
  return
}
switch (r.error.kind) {
  case 'validation':
    return setFieldErrors(r.error.fields)
  case 'not_found':
    return toast.error(`${r.error.resource} não existe`)
  case 'forbidden':
    return toast.error(r.error.reason)
  case 'conflict':
    return toast.error(r.error.reason)
  case 'budget_exceeded':
    return router.push('/dashboard/billing')
  case 'unknown':
    return toast.error('Erro inesperado')
    Sentry.captureException(r.error.cause)
}
// TS força exhaustive — sem default branch + switch-exhaustiveness-check ESLint
```

### 6.5 RPC source of truth (preparação migração stack)

```ts
// lib/data/programs.ts
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  CreateProgramSchema,
  type CreateProgram,
  type Program,
} from '@/lib/contracts/programs/programs.schema'
import { fromProgramRow } from '@/lib/contracts/programs/programs.adapter'

export async function createProgram(
  client: SupabaseClient,
  input: CreateProgram,
): Promise<Program> {
  const parsed = CreateProgramSchema.parse(input)
  const { data, error } = await client.rpc('create_program', parsed)
  if (error) throw error
  return fromProgramRow(data)
}
```

**Razão:** se um dia migrar app aluno pra Flutter/iOS nativo, `supabase.rpc('create_program', {...})` funciona idêntico. Server action é só adapter Next.

### 6.5b Adapter `fromRow()` — persistence ↔ domain (D-G54)

```ts
// lib/contracts/programs/programs.adapter.ts
import type { Database } from '@/lib/supabase/types.gen'
import { ProgramSchema, type Program } from './programs.schema'

type ProgramRow = Database['desafit']['Tables']['programs']['Row']

export function fromProgramRow(row: ProgramRow): Program {
  return ProgramSchema.parse({
    id: row.id,
    tenant_id: row.tenant_id,
    name: row.name,
    status: row.status,
    created_at: row.created_at,
  })
}

export function toProgramRow(p: Program): ProgramRow {
  // explicit pra evitar passar campos transitórios da UI
  return {
    id: p.id,
    tenant_id: p.tenant_id,
    name: p.name,
    status: p.status,
    created_at: p.created_at,
  }
}
```

**Regra:** componente nunca consome `Database['desafit']['Tables']['programs']['Row']` direto. Sempre consome `Program` do `lib/contracts/`. Tipos do banco vazando pra UI = acoplamento que cria refator depois.

### 6.6 RHF + `@hookform/resolvers/standard-schema` (D-G65 — NÃO zodResolver)

```ts
// app/(shell)/programs/_components/new-program-form.tsx
'use client'
import { useForm } from 'react-hook-form'
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'
import { CreateProgramSchema, type CreateProgram } from '@/lib/contracts/programs/programs.schema'

export function NewProgramForm() {
  const form = useForm<CreateProgram>({
    resolver: standardSchemaResolver(CreateProgramSchema),
    defaultValues: { name: '', status: 'draft', tenant_id: '' },
  })
  // ...
}
```

**Por que não `zodResolver`:** Zod 4 + `discriminatedUnion` + `zodResolver` tem bugs conhecidos (issues react-hook-form/resolvers #788, #793, #817 — errors mascarando outros campos, refine em ramo da união não propagando). `@hookform/resolvers/standard-schema` é o workaround oficial pela maintainer.

### 6.7 AI structured output (Vercel AI SDK) — 2-schema pattern (§13.9)

```ts
import { generateObject } from 'ai'
import { WorkoutDraftSchema } from '@/lib/contracts/components/workout/workout.draft.schema'
import { WorkoutStrictSchema } from '@/lib/contracts/components/workout/workout.strict.schema'

const { object } = await generateObject({
  model: 'anthropic/claude-haiku-4.5',
  schema: WorkoutDraftSchema, // magro — Anthropic JSON Outputs aceita
  prompt: 'Gere um treino em português brasileiro...',
  providerOptions: { anthropic: { structuredOutputMode: 'outputFormat' } },
})

const workout = WorkoutStrictSchema.parse(object) // constraints de negócio
// keys EN garantidas via schema, valores PT via prompt
```

Ver §13.9 pra detalhes do pattern draft+strict.

---

## 7. Design system — cores OKLCH

### 7.1 Estrutura de cada paleta

```css
--palette-primary:
  oklch(...) --palette-secondary: oklch(...) --palette-tertiary: oklch(...)
    --palette-extra-1: oklch(...) /* 5 cores extras pra multicolor */ --palette-extra-2: oklch(...)
    --palette-extra-3: oklch(...) --palette-extra-4: oklch(...) --palette-extra-5: oklch(...)
    --surface-base: oklch(...) /* 5 tons de superfície */ --surface-subtle: oklch(...)
    --surface-elevated: oklch(...) --surface-strong: oklch(...) --surface-deep: oklch(...)
    --on-primary,
  --on-secondary, --on-tertiary, --on-surface /* APCA-derived */;
```

### 7.2 Tokens semânticos (fixos, nunca por tenant)

```css
--color-info: oklch(0.62 0.16 235) --color-success: oklch(0.65 0.16 145)
  --color-warning: oklch(0.78 0.16 75) --color-destructive: oklch(0.62 0.22 25)
  /* + -bg, -border, -fg pra cada */;
```

### 7.3 Paletas oficiais — 13 presets (migra do onboarding-bio verbatim — D-G76)

Origem: `app/preview/paletas/page.tsx` (alias `app/paletas/page.tsx`). Todas em OKLCH, com `primary` (dark) + `primaryLight` (override pra contraste em light mode), 5 `extras` curados, surfaces dark/light derivadas do hue. 13 prontas dia 1 — não esperar 3+ tenants pra "expandir".

| #   | id             | Nome                | Hue | Identidade                | Default pra modalidade     |
| --- | -------------- | ------------------- | --- | ------------------------- | -------------------------- |
| 1   | `default`      | Padrão              | 275 | Indigo Stripe equilibrado | Default SaaS               |
| 2   | `indigo`       | Indigo Profissional | 264 | Sóbrio corporativo        | Coaching, mentoria         |
| 3   | `rose`         | Rosé Wellness       | 15  | Feminino wellness         | Pilates, dança, estética   |
| 4   | `terracotta`   | Terracota Earthy    | 40  | Quente terroso            | Yoga, terapia, holístico   |
| 5   | `sage`         | Sálvia Calmo        | 145 | Verde calmo               | Mindfulness, nutri         |
| 6   | `navy`         | Navy Performance    | 260 | Azul profundo atleta      | Treinamento profissional   |
| 7   | `mustard`      | Mostarda Vibrante   | 80  | Amarelo retrô             | Branding ousado            |
| 8   | `coral`        | Coral Vibrante      | 25  | Vermelho-laranja energia  | Functional, HIIT           |
| 9   | `pure`         | Puro                | 0   | Grayscale puro            | Minimalista premium        |
| 10  | `minimal-warm` | Mínima Quente       | 50  | Off-white wabi-sabi       | Japandi, premium quiet     |
| 11  | `performance`  | Performance Neon    | 25  | Vermelho saturado intenso | Crossfit, calistenia       |
| 12  | `carbon`       | Carbon Athletic     | 250 | Gunmetal mono + signal    | Whoop-style, hardcore      |
| 13  | `neon`         | Neon Rave           | 320 | Magenta neon cyberpunk    | Underground fitness, jovem |

**Estrutura por paleta:** primary + primaryLight (light mode override) + secondary + tertiary + 5 extras (multicolor charts/badges/illustrations) + 5 surfaces dark + 5 surfaces light + on-\* APCA-derived = **~21 tokens efetivos** (não 4).

**Surfaces padronizadas:** Material You "branded dark surfaces" + AdminLTE/Tenet — cinza-escuro/off-white com hint sutil do hue da paleta, nunca dominante. Dark L 0.13→0.37 (chroma 0.015); Light L 0.98→0.85 (chroma ramp 0.01→0.015). Exceções customizadas pra `default/minimal-warm/performance/carbon/neon` (cada um com surface curada — ver `darkSurfaces()` no arquivo origem).

**`primaryForMode(palette, mode)`:** retorna `primary` em dark; em light retorna `primaryLight` se definido, senão aplica heurística `LIGHT_ADJUST_IDS` (desce L em 0.2, sobe C em 0.05). Garante contraste APCA em ambos modos sem duplicar entries.

**Adicionar paleta 14+:** decision registrada + dados de uso (3+ tenants pediram). 13 já cobrem espectro amplo de identidades.

**Arquivos a migrar verbatim pro repo desafit:**

- `app/preview/paletas/page.tsx` → `desafit/app/(marketing)/paletas/page.tsx` (showcase visual)
- Constantes `PALETTES[]` + `darkSurfaces()` + `lightSurfaces()` + `primaryForMode()` → extrair pra `desafit/lib/design/palettes.ts` (consumível por `deriveTokens()` e route handler `theme.css`)
- Atualizar comment `// 8 paletas oficiais` (linha 44) pra `// 13 paletas oficiais`

### 7.4 Dark/light + APCA dual-gate

- Tema via `<html data-theme="dark" data-palette="default">`
- Default = dark (D-G3)
- **APCA Lc thresholds:** body ≥ 60, small text ≥ 75, UI elements ≥ 45
- **WCAG 2.x AA fallback:** ratio ≥ 4.5 body, ≥ 3 large
- CI gate: script `pnpm color:audit` falha se algum par falha

### 7.5 Algoritmo de contraste

```ts
// lib/design/contrast.ts
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { oklch, formatRgb, parse } from 'culori'

export function checkAPCA(
  fg: OklchColor,
  bg: OklchColor,
): {
  lc: number
  passesBody: boolean
  passesSmall: boolean
  passesUI: boolean
}

export function ensureAccessible(fg: OklchColor, bg: OklchColor, minLc: 45 | 60 | 75): OklchColor {
  // bisection em L até atingir minLc, com chroma reduction se sair de gamut sRGB
}

export function pickReadableForeground(bg: OklchColor): OklchColor {
  // black ou white por máximo Lc absoluto
}
```

### 7.6 White-label runtime — `deriveTokens(primary)`

```ts
// lib/design/tokens.ts
export function deriveTokens(primary: OklchColor): ThemeTokens {
  const secondary = shiftHue(primary, +30)
  const tertiary = shiftHue(primary, -30)
  const extras = generateTonalScale(primary, 5) // Material 3
  const surfaces = generateSurfaces(primary.h, 'dark')
  return { primary, secondary, tertiary, extras, surfaces /* + on-* APCA-validated */ }
}
```

### 7.7 Injeção runtime de tokens do tenant via API route (D-G59 — RESOLVE §31.3 #8)

> **Decisão:** CSS estático servido por API route Next 16 com cache HTTP forte (CDN + browser). **Zero `eslint-disable`**, **zero `dangerouslySetInnerHTML`**. Alternativa (a) `<style dangerouslySetInnerHTML>` foi rejeitada pra preservar política zero-disable (D-G11 + memory `feedback_zero_eslint_disable`).

**Layout root referencia o stylesheet do tenant:**

```tsx
// app/layout.tsx
import { headers } from 'next/headers'
import { getTenantByHost } from '@/lib/data/tenants'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const tenant = await getTenantByHost(h.get('host')!)
  return (
    <html lang={tenant.default_locale} suppressHydrationWarning>
      <head>
        {/* CSS do tenant servido por API route, cacheado CDN+browser */}
        <link
          rel="stylesheet"
          href={`/api/tenants/${tenant.id}/theme.css?v=${tenant.theme_version}`}
          precedence="high"
        />
      </head>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}
```

**Route handler que renderiza CSS texto puro:**

```ts
// app/api/tenants/[id]/theme.css/route.ts
import { NextResponse } from 'next/server'
import { getTenantTheme } from '@/lib/data/tenants'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const t = await getTenantTheme(id) // 'use cache' + cacheTag(`tenant-theme:${id}`)

  const css = `:root{
  --palette-primary:${t.primary};
  --palette-secondary:${t.secondary};
  --palette-tertiary:${t.tertiary};
  --palette-extra-1:${t.extras[0]};
  --palette-extra-2:${t.extras[1]};
  --palette-extra-3:${t.extras[2]};
  --palette-extra-4:${t.extras[3]};
  --palette-extra-5:${t.extras[4]};
  --surface-base:${t.surfaces.base};
  --surface-subtle:${t.surfaces.subtle};
  --surface-elevated:${t.surfaces.elevated};
  --surface-strong:${t.surfaces.strong};
  --surface-deep:${t.surfaces.deep};
  --on-primary:${t.onPrimary};
  --on-secondary:${t.onSecondary};
  --on-tertiary:${t.onTertiary};
  --on-surface:${t.onSurface};
  --brand-radius:${t.radius}rem;
  --density-pad-x:${t.densityPadX}px;
  --density-pad-y:${t.densityPadY}px;
}`

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      // Cache forte — tenant raramente muda theme. Invalidação via revalidateTag.
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
      // Não immutable — quando tenant muda theme, route URL muda via ?v=theme_version
    },
  })
}
```

**Mutação do theme (prof customiza cor):**

```ts
// app/(shell)/appearance/_actions/update-theme.action.ts
'use server'
import { revalidateTag } from 'next/cache'
import { UpdateThemeSchema } from '@/lib/contracts/tenants/tenants.schema'
import { ok, fail } from '@/lib/contracts/result'

export async function updateThemeAction(input: unknown) {
  const parsed = UpdateThemeSchema.safeParse(input)
  if (!parsed.success)
    return fail({ kind: 'validation', fields: parsed.error.flatten().fieldErrors })

  // ... update DB com theme_tokens + incrementa theme_version
  revalidateTag(`tenant-theme:${parsed.data.tenant_id}`, 'max')

  // Browser dos alunos pega CSS novo no próximo full reload OU quando ?v=N+1 quebrar cache
  // PWA aluno: SW intercepta /api/tenants/*/theme.css com NetworkFirst — pega update sem espera reload
  return ok({ theme_version: parsed.data.theme_version + 1 })
}
```

```css
/* app/globals.css — Tailwind v4 lê CSS vars runtime via @theme inline */
@import 'tailwindcss';

@theme inline {
  --color-primary: var(--palette-primary);
  --color-secondary: var(--palette-secondary);
  --color-tertiary: var(--palette-tertiary);
  --color-on-primary: var(--on-primary);
  --radius: var(--brand-radius);
}
```

**Por que CSS via API route ganha vs `dangerouslySetInnerHTML`:**

| Aspecto                     | API route (escolhido)                                    | dangerouslySetInnerHTML              |
| --------------------------- | -------------------------------------------------------- | ------------------------------------ |
| `eslint-disable` necessário | **0**                                                    | 1 exception                          |
| Cacheável CDN               | ✅ HTTP Cache-Control respeitado                         | ❌ inline no HTML, sempre re-baixado |
| Browser cache               | ✅ subsequente loads = 0 cost                            | ❌ embute no HTML SSR                |
| Invalidação granular        | ✅ `revalidateTag` ou bump `?v=N`                        | precisa re-render layout root        |
| FOUC                        | Mínimo (mesma latência de qualquer `<link>` no `<head>`) | Zero (inline)                        |
| Trade-off                   | +1 request HTTP cacheado (custo desprezível)             | Zero requests extras                 |

Custo do trade-off: 1 round-trip HTTP cacheado no primeiro load. Browser cacheia 1h + CDN cacheia 24h. Custo real ≈ 0 após primeiro acesso. Vale a pena pra manter política zero-disable intocada.

**Cache:** `getTenantTheme(id)` com `'use cache'` + `cacheTag(\`tenant-theme:${id}\`)`. Mutação → `revalidateTag(\`tenant-theme:${id}\`, 'max')`.

```ts
// lib/data/tenants.ts
import { cacheLife, cacheTag } from 'next/cache'

export async function getTenantByHost(host: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`tenant:${host}`)
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .or(`subdomain.eq.${parseSubdomain(host)},custom_domain.eq.${host}`)
    .single()
  if (error) throw error
  return data
}
```

### 7.8 Branding scope por pacote (D-G34)

| Item                        | Pacote A (Free `<slug>.desafit.app`) | Pacote B (App)                           | Pacote C (Full + custom domain)      |
| --------------------------- | ------------------------------------ | ---------------------------------------- | ------------------------------------ |
| Cor primária                | ✅                                   | ✅                                       | ✅                                   |
| Cor secundária + tertiária  | ❌ (auto-derived)                    | ✅                                       | ✅                                   |
| Logo + favicon + nome       | ✅                                   | ✅                                       | ✅                                   |
| Fonte custom Google Fonts   | ❌                                   | ✅                                       | ✅                                   |
| Custom CSS arbitrário       | ❌                                   | ❌                                       | ✅ limitado (allowlist)              |
| Email transacional `from`   | `noreply@desafit.app`                | `noreply@<tenant-subdomain>.desafit.app` | full custom (Resend domain verified) |
| Email template              | default                              | editável                                 | full                                 |
| Push ícone + badge branded  | ❌                                   | ✅                                       | ✅                                   |
| PWA manifest branded        | ❌ (desafit base)                    | ✅                                       | ✅                                   |
| Custom domain               | ❌                                   | ❌                                       | ✅ (via Vercel SDK)                  |
| Footer "Powered by desafit" | obrigatório                          | discreto                                 | removível                            |

### 7.9 Custom domain (provisioning Vercel)

Para Pacote C. Fluxo:

1. Painel: tenant input `dominio.com.br` → POST `/api/domains`
2. Backend chama `vercel.projects.addProjectDomain({ name })` (Vercel SDK)
3. Tela mostra instruções DNS (CNAME `app` → `cname.vercel-dns.com`)
4. Polling `GET /api/domains/[domain]/verify` cada 30s até 24h
5. Badges: `Pendente DNS → Verificado → SSL emitido → Ao vivo`
6. Tabela `desafit.domains (tenant_id, domain, is_primary, status, verified_at)` 1:N

```ts
// app/api/domains/route.ts
import { Vercel } from '@vercel/sdk'

export async function POST(req: Request) {
  const { domain } = await req.json()
  const vercel = new Vercel({ bearerToken: env.VERCEL_TOKEN })
  await vercel.projects.addProjectDomain({
    idOrName: env.VERCEL_PROJECT_ID,
    teamId: env.VERCEL_TEAM_ID,
    requestBody: { name: domain },
  })
  // persistir em desafit.domains
  return Response.json({ ok: true })
}
```

Wildcard `*.desafit.app` cobre Pacote A/B com Vercel nameservers (ns1/ns2.vercel-dns.com).

---

## 8. UI primitives

### 8.1 Cards (4 variants canônicos genéricos)

| Variant       | Quando usar              | Visual                                                                  |
| ------------- | ------------------------ | ----------------------------------------------------------------------- |
| `default`     | 80% dos casos            | `border bg-card shadow-sm`                                              |
| `outlined`    | Lists, secondary content | `border-2 border-muted bg-transparent shadow-none`                      |
| `interactive` | Whole-card clickable     | `cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99]` |
| `featured`    | 1 por seção, destaque    | `border-2 border-primary bg-primary/5`                                  |

**Composition:** `<Card><CardHeader><CardTitle/></CardHeader><CardContent/><CardFooter/></Card>`

**Whole-card link:**

```tsx
<Link href={`/programs/${id}`} className="block">
  <Card variant="interactive">...</Card>
</Link>
```

### 8.1b Card variants específicos do PWA aluno (composições)

| Variant  | Caso                                         | Composição                                                                                  |
| -------- | -------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `hero`   | Card grande "Hoje" no Início (~45% viewport) | `CardImage 16/9` + `CardEyebrow` + `CardTitle` + `CardMeta` + `CardCTA` botão `h-14 w-full` |
| `media`  | Exercício / vídeo-aula curta em listas       | `CardThumb 1/1` + `CardTitle size="sm"` + `CardMeta`                                        |
| `metric` | Métricas no Perfil/Progresso                 | `Metric value unit delta` + `CardLabel`                                                     |
| `entity` | Aluno na lista do prof (whole-card link)     | `Avatar` + `CardTitle` + `Badge` + `CardActions` (com `stopPropagation`)                    |

```tsx
// 1) Hero — "Hoje"
<Card variant="hero" interactive>
  <CardImage src={thumb} aspect="16/9" />
  <CardEyebrow>Hoje · Treino A</CardEyebrow>
  <CardTitle>Peito + Tríceps</CardTitle>
  <CardMeta>6 exercícios · ~45min</CardMeta>
  <CardCTA className="h-14 w-full">Começar</CardCTA>
</Card>

// 4) Entity — aluno (whole-card click + action interna sem propagar)
<Card variant="entity" asChild>
  <Link href={`/dashboard/alunos/${id}`}>
    <Avatar src={photo} />
    <CardTitle>João Silva</CardTitle>
    <Badge variant="success">Ativo</Badge>
    <CardActions onClick={(e) => e.preventDefault()}>
      <DropdownMenu>...</DropdownMenu>
    </CardActions>
  </Link>
</Card>
```

### 8.2 Alerts (4 variants semânticos)

| Variant       | Cor       | Quando                   | Ícone               |
| ------------- | --------- | ------------------------ | ------------------- |
| `default`     | info blue | Informação neutra        | `<Info />`          |
| `success`     | green     | Confirmação positiva     | `<CheckCircle />`   |
| `warning`     | amber     | Atenção, ação reversível | `<AlertTriangle />` |
| `destructive` | red       | Erro, irreversível       | `<AlertCircle />`   |

**Layout:** grid 3-col (ícone + content + action), left-border 3px na cor.

**Toast (sonner):** mesmas 4 variants via `toast.success()`, `toast.error()`, etc.

### 8.3 Tipografia primitives obrigatórios (dia 1)

Razão histórica: ausência destes primitives custou 186 violações de heading raw + 144 warnings tipografia no onboarding.bio.

```tsx
<Heading level={1|2|3|4|5|6} variant="page|section|admin|hero|metric">
<Text variant="body|compact|data|code|eyebrow|label|caption|lead">
<Eyebrow>             // label uppercase pequeno
<Metric value label format delta?>  // número grande + delta colored opcional
<DataCell label value> // par label/value
<Code inline|block>   // blocos de código (admin debug)
<Section title? description? tone="clear|soft|emphasized|deep">  // wrapper de seção
<Stack direction="v|h" gap="sm|md|lg">       // flex helper
```

### 8.4 Form patterns por tamanho

| Campos                    | Pattern                                                          | Validation                  |
| ------------------------- | ---------------------------------------------------------------- | --------------------------- |
| ≤6                        | Single page (1 tela mobile + desktop)                            | `onBlur` + `onSubmit` final |
| 7-12                      | Accordion sections desktop / wizard 1-question-per-screen mobile | `onBlur`                    |
| >12 ou onboarding crítico | Wizard 1-question-per-screen mobile + accordion desktop          | `onBlur`                    |

- Resolver: `react-hook-form` + `@hookform/resolvers/zod`
- Erros: inline abaixo do input + sumário `aria-live` no submit
- Field types fitness: peso `<Input inputMode="decimal" />` + stepper; reps `inputMode="numeric"`; foto `<input type="file" accept="image/*" capture="environment" />`
- Layout peso+reps mesma linha: `grid grid-cols-[1fr_1fr_auto]`

### 8.5 Sheet vs Dialog vs Drawer — decision tree

| Caso                                                                    | Componente                    |
| ----------------------------------------------------------------------- | ----------------------------- |
| Filtros mobile, edit rápido, timer descanso, confirm destructive mobile | **vaul Drawer** (snap points) |
| Forms críticos desktop, alertas, modais bloqueantes desktop             | shadcn `<Dialog>`             |
| Nav drawer desktop, cart lateral                                        | shadcn `<Sheet>`              |
| Modal que precisa ser mobile-sheet + desktop-dialog                     | `<ResponsiveModal>` (wrapper) |

```tsx
<Drawer.Root snapPoints={[0.3, 0.7, 1]}>  {/* peek / half / full */}
```

### 8.6 Abstrações maduras (copiar verbatim com naming limpo)

- `CrudManager<TRow, TForm>` (lista + CRUD modal)
- `FormModal` (dialog + form + submit pattern)
- `CopyButton` / `useCopy`
- `useServerAction(action)` (useTransition + tratamento erro)
- `ResponsiveModal` (Sheet mobile + Dialog desktop via `useResponsive()`)

### 8.7 Registries shadcn extras (mix-and-match dia 1)

| Registry                              | Quando                                                                                        |
| ------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Origin UI** (originui.com)          | Primeira parada antes de criar variant nova. 400+ blocks free.                                |
| **Magic UI** (magicui.design)         | Só `NumberTicker` (métricas), `Confetti` (streak milestones), `Marquee` (testemunhos landing) |
| **Aceternity UI** (ui.aceternity.com) | Só nas landing pages dos profs (spotlight, gradients). NÃO no app aluno (peso de animação)    |
| **Kibo UI** (kibo-ui.com)             | Fase 2 (kanban planejamento programa)                                                         |

---

## 9. shadcn cobertura (100% dia 1)

### 9.1 Estratégia

**Instalar TODOS componentes shadcn + blocks relevantes no dia 1.** Não picking on-demand.

```bash
# bootstrap shadcn (rodar 1x no F0)
pnpm dlx shadcn@latest add accordion alert alert-dialog aspect-ratio avatar badge \
  breadcrumb button button-group calendar card carousel chart checkbox collapsible \
  combobox command context-menu dialog drawer dropdown-menu empty field form \
  hover-card input input-group input-otp item kbd label menubar native-select \
  navigation-menu pagination popover progress radio-group resizable scroll-area \
  select separator sheet sidebar skeleton slider sonner spinner switch table \
  tabs textarea toggle toggle-group tooltip
```

### 9.2 Blocks (dia 1)

```bash
pnpm dlx shadcn@latest add dashboard-01 sidebar-07 login-04 signup-01 \
  chart-area-default chart-bar-default chart-line-default chart-pie-default \
  empty-04
```

### 9.3 Telas montadas (ordem inviolável)

1. **Blocks** instalados (todos relevantes)
2. **Composição com blocks** (telas reais MVP usam blocks adaptados)
3. **Componentes** (compõe primitives shadcn)
4. **Primitives custom** (só quando block + componente shadcn não bastam, decision registrada)

### 9.4 Wrapper responsivo padrão

```ts
// lib/hooks/use-responsive.ts
export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return { isMobile, isDesktop: !isMobile }
}

// components/ui/responsive-modal.tsx
export function ResponsiveModal({ children, ...props }) {
  const { isMobile } = useResponsive()
  return isMobile
    ? <Drawer {...props}>{children}</Drawer>  // vaul
    : <Dialog {...props}>{children}</Dialog>
}
```

---

## 10. Mobile-first + breakpoints + PWA native-feel

### 10.1 Breakpoints (Tailwind v4 default)

- `sm`: 640px
- `md`: 768px ← **hard boundary mobile/desktop**
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 10.2 Safe areas iOS

```css
.safe-pb {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
.safe-pt {
  padding-top: max(1rem, env(safe-area-inset-top));
}
```

Layout root: `viewportFit: 'cover'` no metadata.

### 10.3 Touch targets

- Mínimo 44×44px (iOS HIG).
- Botão default: `min-h-[44px] md:min-h-0`.

### 10.4 Tokens layout

```css
--bottom-nav-height: 96px;
--header-height: 3.5rem;
--scroll-padding-top: var(--header-height);
```

### 10.4b Web Push — Vapid keys (1 par por tenant)

Decisão técnica importante (§31.2 #5): cada tenant tem próprio par Vapid (P-256), armazenado encrypted em `tenant_secrets` via pgcrypto.

**Por que 1 par por tenant (não 1 global):**

- RFC 8292 alignment (key identifica server)
- Comprometimento de 1 tenant não vaza os outros
- Tenant pode "portar" subscriptions se migrar plataforma (anti-lock-in)
- Custo $0 (par P-256 = 2 strings 88 chars)

**Implementação:** no Service Worker do PWA branded, `applicationServerKey` é fetch ao backend no momento do `pushManager.subscribe()` — nunca hardcode no manifest.

**Cuidado:** rotacionar Vapid keys invalida TODAS subscriptions desse tenant (alunos perdem push até reaceitar). Rotação só quando absolutamente necessário.

### 10.4c Vídeo player (Bunny Stream)

Decisão técnica (§31.2 #1): vídeos hospedados em **Bunny Stream**, player customizado por tenant via tokens CSS.

- PoP em São Paulo (latência sub-29ms — diferencial pra PWA BR)
- Player aceita cor/branding do tenant (zero "Bunny" visível)
- DRM opcional (proteção contra cópia)
- ~$10-15/mês pra 10 tenants × 30 vídeos × 720p

**Embed pattern:**

```tsx
<BunnyPlayer
  libraryId={env.BUNNY_STREAM_LIBRARY_ID}
  videoId={component.payload.video_id}
  theme={tenant.theme_tokens}
/>
```

QoE analytics opcional via Mux Data SDK (funciona com qualquer HLS) — adicionar só se algum tenant reclamar de buffering.

### 10.5 PWA setup (dia 1)

| Item                   | Implementação                                                                                                     |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Manifest dinâmico      | `app/(public)/[slug]/manifest.webmanifest/route.ts` retorna JSON com tenant branding                              |
| Service Worker         | **Serwist** (`@serwist/next`, Next 16 ready)                                                                      |
| Cache strategy         | Shell precache + content stale-while-revalidate. POST/mutations: network-only                                     |
| Install banner         | `beforeinstallprompt` capturado. Triggar após 2ª visita OU primeiro check-in completo                             |
| Splash                 | Manifest `background_color` + ícone 512x512 (iOS gera auto)                                                       |
| `theme-color` dinâmico | `<meta name="theme-color">` do tenant (script no `<head>`)                                                        |
| iOS specific           | `apple-touch-icon`, `apple-mobile-web-app-capable=yes`, `apple-mobile-web-app-status-bar-style=black-translucent` |
| Standalone detection   | Hook `useIsStandalone()` (`matchMedia('(display-mode: standalone)')`)                                             |
| Offline page           | `app/offline/page.tsx` branded                                                                                    |
| Web Push               | Web Push API + Vapid keys (env). Tabela `desafit.push_subscriptions(tenant_id, user_id, endpoint, keys)`          |
| Badging API            | `navigator.setAppBadge(count)` (Android only; iOS fallback emoji no título)                                       |
| Update flow            | SW detecta nova versão → toast "Atualizar agora?" → `skipWaiting() + clients.claim() + reload()`                  |

### 10.6 Native-feel patterns

| Pattern                     | Implementação                                                                                        |
| --------------------------- | ---------------------------------------------------------------------------------------------------- |
| Skeleton loading            | Sempre. Spinner só ações < 1s                                                                        |
| Tap feedback                | `active:scale-[0.98] transition-transform` em todo clickable                                         |
| Haptic                      | `navigator.vibrate(10)` no tap (Android only; iOS Safari NÃO suporta nem em PWA — graceful fallback) |
| Page transitions            | View Transitions API + Motion fade/slide                                                             |
| Pull-to-refresh             | Em listas do app cliente (motion drag custom, ~30 linhas)                                            |
| Long-press menu             | `pointerdown` + `setTimeout(500)`                                                                    |
| Bottom sheet > modal mobile | `<ResponsiveModal>`                                                                                  |
| Sticky header com blur      | `sticky top-0 backdrop-blur-md bg-background/80`                                                     |
| Tab bar bottom nav          | `<BottomNav>` fixo em rotas `(client)/aluno/*`                                                       |
| Reduced motion              | Toda animação consulta `useReducedMotion()` (§14)                                                    |
| View Transitions            | Habilitar entre rotas do PWA cliente                                                                 |
| Edge swipe back             | Nativo iOS Safari standalone + Android Chrome (nenhuma lib)                                          |

### 10.7 Bottom-tab — 5 tabs do desafit (decisão fechada D-G29)

Escolhidos pela **necessidade do desafit** (proposta comercial), não por copiar outros apps.

| Tab          | Conteúdo                                                                                                       | Por que                                                                                                                 |
| ------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Início**   | Hoje + streak + próximo evento agendado                                                                        | Engajamento diário, primeira tela após login                                                                            |
| **Programa** | Estrutura completa: módulos, componentes destravados/bloqueados, navegação dia a dia                           | Aluno entende onde tá no programa                                                                                       |
| **Agenda**   | Calendário com tudo agendado: live, call individual, encontro presencial, deadline de tarefa, check-in semanal | Acomoda formatos presencial/híbrido naturalmente; sem ela, eventos ficam escondidos                                     |
| **Chatbot**  | Chatbot nutricional IA (Pacote C) + dúvidas sobre o programa via IA                                            | Schema dia 1; UI ativa conforme tier do tenant; tab presente mesmo no Pacote A/B mostrando estado bloqueado/upgrade CTA |
| **Perfil**   | Settings, pagamento, **progresso** (peso, fotos antes/depois, métricas, gamificação), suporte, sair            | Progresso fica no Perfil pra liberar slot pra Chatbot — métricas são mais "info pessoal" que ação diária                |

**Sem chat 1:1 com profissional (D-G37 revisto):** comunicação prof→aluno é one-way assíncrona via push + email. Top-bar do PWA tem só logo do tenant + avatar do aluno (sem ícone chat). Notificações sistema (ex: "componente X destravado", "live em 1h") usam toast/sonner + badge no avatar pra histórico de notificações in-app (opcional fase 2).

**Comunidade/grupos (cohort):** quando cliente cohort confirmar, vira aba contextual DENTRO de "Programa" (só aparece se `program.cohort_type = 'live'`). Não tab fixa.

**Implementação:**

```tsx
// components/client/BottomNav.tsx
'use client'
import { Home, ListTree, Calendar, MessageSquare, User } from 'lucide-react'

const tabs = [
  { href: '/aluno/inicio', icon: Home, labelKey: 'tabs.home' },
  { href: '/aluno/programa', icon: ListTree, labelKey: 'tabs.program' },
  { href: '/aluno/agenda', icon: Calendar, labelKey: 'tabs.schedule' },
  { href: '/aluno/chatbot', icon: MessageSquare, labelKey: 'tabs.assistant' },
  { href: '/aluno/perfil', icon: User, labelKey: 'tabs.profile' },
] as const

// h-14 altura tab + safe-pb. ícone size-6, label text-[10px]
```

### 10.8 Home screen — patterns concretos

| Bloco                   | Dimensão                                                                       | Notas                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Header                  | `h-14` sticky com blur, logo do tenant + avatar aluno (sem ícone chat — D-G37) |                                                                                                                  |
| Hero card "Hoje"        | ~45% da viewport                                                               | thumbnail + eyebrow `Hoje · [tipo do componente]` + título + meta + CTA `Button size="lg" h-14 w-full` "Começar" |
| Streak                  | `h-20` compacto                                                                | Dot calendar 7-day OU donut % completo da semana                                                                 |
| Próximo evento agendado | Card `h-24` se houver live/call/presencial nos próximos 7 dias                 |                                                                                                                  |
| Próximos 3 componentes  | Carrossel horizontal cards `h-24`                                              | scroll-snap                                                                                                      |

Sem FAB. Density: **sparse-premium** (coaching, não data-dense).

### 10.9 Execução de componente `workout`

```tsx
// app/(client)/aluno/(mobile)/workout/[id]/page.tsx
<div className="flex flex-col h-dvh">
  <header className="sticky top-0 z-10 h-14 bg-background/80 backdrop-blur-md">
    <BackButton /> <Title /> <ProgressBar value={completedSets / totalSets} />
  </header>
  <div className="sticky top-14 z-10 aspect-video bg-black">
    <BunnyPlayer videoId={component.payload.video_id} />
  </div>
  <Accordion type="multiple" defaultValue={['main']}>
    {component.payload.blocks.map((block) => (
      <AccordionItem key={block.id} value={block.id}>
        <AccordionTrigger>{block.name}</AccordionTrigger>
        <AccordionContent>
          {block.sets.map((set, i) => (
            <SetRow key={i} set={set} onComplete={() => markSetComplete(set.id)} />
          ))}
        </AccordionContent>
      </AccordionItem>
    ))}
  </Accordion>
  <RestTimerDrawer /> {/* vaul snap full, text-7xl tabular-nums, vibrate(200) no fim */}
</div>
```

**Set row:** `[Set N] [Peso input decimal +/− stepper 2.5kg] [Reps input] [✓ tap row inteiro marca]`.

**Input carga:**

```tsx
<Input
  inputMode="decimal"
  value={weight}
  onChange={...}
  className="h-12 text-center text-2xl tabular-nums"
/>
<Stepper step={2.5} longPress /> {/* +/- com repeat em long-press */}
```

**Rest timer (vaul Drawer snap full):**

```tsx
<Drawer.Root snapPoints={[1]} open={timerActive}>
  <Drawer.Content>
    <div className="text-7xl tabular-nums text-center">
      {mm}:{ss}
    </div>
    {/* navigator.vibrate(200) ao chegar em 00:00 */}
  </Drawer.Content>
</Drawer.Root>
```

### 10.10 Check-in (decisão research: 3 campos só)

3 campos no check-in diário: **energia** (slider 1-10), **sono** (slider 1-10), **mood** (emoji 5-step). Foto pesagem semanal é separada (campo opcional, não diário).

Schemas check-in customizados (mais campos) **existem dia 1** via `payload jsonb` do component `check_in` — mas default é 3 campos pra engajamento. Prof pode customizar livremente.

### 10.11 Loading states — matriz por timing

| Duração   | Pattern                                        | Quando                                      |
| --------- | ---------------------------------------------- | ------------------------------------------- |
| <200ms    | Nada (optimistic)                              | Tap, input, marcar set, salvar check-in     |
| 200-800ms | Skeleton casado com layout                     | Listas, cards do dashboard                  |
| 800ms-2s  | Skeleton + spinner pequeno em zonas            | Detail pages                                |
| >2s       | Skeleton + progress bar topo + texto streaming | Geração IA (vibe coding fase 2), import CSV |

**Optimistic UI obrigatório (React 19 `useOptimistic`)** pra:

- Marcar set completo
- Salvar check-in
- Enviar mensagem
- Marcar componente completo

```tsx
'use client'
import { useOptimistic, startTransition } from 'react'

export function CheckInForm({
  saved,
  onSave,
}: {
  saved: CheckIn[]
  onSave: (c: CheckIn) => Promise<void>
}) {
  const [optimistic, addOptimistic] = useOptimistic(saved, (state, next: CheckIn) => [
    ...state,
    { ...next, _pending: true },
  ])
  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const c = parseFormToCheckIn(fd)
          addOptimistic(c)
          await onSave(c)
        })
      }
    >
      {/* ... */}
    </form>
  )
}
```

### 10.12 Install prompt — UX flow (custom bottom-sheet vaul)

**Quando triggar:** 2ª sessão E após primeira ação significativa (check-in completo ou componente completo). Não no primeiro load.

**iOS (sem `beforeinstallprompt`):** detectar `/iPhone|iPad/.test(ua) && !navigator.standalone` → mostrar guia visual "Compartilhar → Adicionar à Tela Inicial".

**Dismiss:** localStorage timestamp; reaparece após 7 dias.

```tsx
'use client'
import { Drawer } from 'vaul'
import { useEffect, useState } from 'react'

type BIP = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt({ canShow }: { canShow: boolean }) {
  const [deferred, setDeferred] = useState<BIP | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const standalone =
      matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
    setIsIOS(/iPhone|iPad/.test(navigator.userAgent) && !standalone)
    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIP)
    }
    window.addEventListener('beforeinstallprompt', onBIP)
    return () => window.removeEventListener('beforeinstallprompt', onBIP)
  }, [])

  useEffect(() => {
    if (!canShow) return
    const last = Number(localStorage.getItem('install-dismissed') || 0)
    if (Date.now() - last > 7 * 864e5 && (deferred || isIOS)) setOpen(true)
  }, [canShow, deferred, isIOS])

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'dismissed') localStorage.setItem('install-dismissed', String(Date.now()))
    setOpen(false)
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-background p-6 safe-pb">
          <Drawer.Title className="text-xl font-semibold">Instalar app</Drawer.Title>
          {isIOS ? (
            <IOSShareGuide />
          ) : (
            <button
              onClick={install}
              className="mt-4 h-12 w-full rounded-lg bg-primary text-primary-foreground"
            >
              Instalar
            </button>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

### 10.13 Web Push — opt-in flow + 5 templates

**Pre-prompt custom (antes de chamar `Notification.requestPermission()`):**

Trigger: **3ª sessão E após primeiro check-in completo**. Eleva opt-in iOS de ~40% pra ~60-70% (OneSignal benchmarks).

Copy: _"Receba lembretes do seu treino e mensagens do [Prof]. Sem spam."_ `[Receber lembretes]` (primary) `[Agora não]` (ghost).

**Frequency cap:** **1 push/dia útil**, máximo 2 em casos especiais. Quiet hours 22h-6h no timezone do aluno.

**5 templates dia 1:**

| #   | Template                                               | Trigger          |
| --- | ------------------------------------------------------ | ---------------- |
| 1   | "Bom dia 💪 Seu treino de [grupo] está pronto. Vamos?" | Cron 7h tz aluno |
| 2   | "[Prof] te mandou uma mensagem: «[preview 60c]…»"      | Mensagem nova    |
| 3   | "3 dias sem treinar. Bora retomar leve hoje?"          | Inatividade 3d   |
| 4   | "🔥 Sequência de 7 dias! Não quebre hoje."             | Streak milestone |
| 5   | "Check-in de domingo: como foi a semana?"              | Cron dom 19h     |

**SW handler:**

```ts
// public/sw.js — Web Push handler (Serwist injeta isso)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon, // ícone branded do tenant
      badge: '/badge-72.png',
      tag: data.tag, // dedup
      data: { url: data.url },
      requireInteraction: false,
    }),
  )
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(clients.openWindow(e.notification.data.url))
})
```

### 10.14 Boundaries do PWA cliente

**Dentro do PWA (`/aluno/*` cacheável + offline):**

- Início (próximo treino, streak, lembretes)
- Programa (timeline, dias liberados/bloqueados)
- Executar componente (treino, vídeo, refeição, tarefa)
- Check-in diário (queue local offline → background sync)
- Histórico/progresso (cache local)
- Galeria antes/depois
- Materiais (PDFs cacheados quando baixados — D-G27)
- Notificações push
- Chatbot (online apenas; offline mostra placeholder)
- Perfil (visualização + edição básica)
- Agenda (cache stale-while-revalidate)
- Lives/calls são executadas em plataforma externa (Zoom/Meet/IG/YT) — app envia push + link

**Fora do PWA (browser normal):**

- Pagamento de programa (segurança + compliance gateways)
- Mudança de plano de assinatura
- Suporte (chat com profissional via mensagem)

### 10.15 Performance

- `next/font` (Geist + Geist Mono) — display swap
- `next/image` obrigatório (lint: proibir `<img>` exceto data: URI)
- Lazy load: `loading="lazy"` em imagens below fold
- Bundle budget: chunk > 200kb falha CI
- Lighthouse CI: PWA = 100 em `/aluno/*`, Performance ≥ 90, A11y = 100

---

## 11. Telas mobile vs tablet vs desktop

### 11.1 Matriz quando diferenciar

| Aspecto         | Mobile (<768px)                           | Tablet (768-1279px) | Desktop (≥1280px)              |
| --------------- | ----------------------------------------- | ------------------- | ------------------------------ |
| Nav primária    | Bottom nav fixo                           | Sidebar collapse    | Sidebar persistente            |
| Modal/Editor    | Drawer bottom (vaul)                      | Dialog centered     | Dialog centered                |
| Lista densa     | Card stack                                | 2-col grid          | Tabela densa                   |
| Header          | Sticky + blur                             | Sticky simples      | Sticky simples                 |
| Form            | 1 coluna                                  | 2 colunas           | 2 colunas + side panel         |
| Filtros         | Bottom sheet                              | Popover             | Sidebar lateral                |
| Editor visual   | **Read-only ou link "Editar no desktop"** | Side panel          | Split 50/50 (blocks + preview) |
| Touch targets   | 44px+                                     | 44px+               | Hover habilitado               |
| Typography body | 16px min (iOS no-zoom)                    | 16px                | 14-16px                        |
| Spacing         | Tight                                     | Médio               | Roomy                          |

### 11.2 App cliente (PWA) — mobile-first puro

- Mobile (360-430px): bottom nav, stack vertical, 100% mobile-first
- Tablet (768-1024px): master-detail (lista esq, detalhe dir)
- Desktop (1280+): browser fallback (mesma UX tablet mas com sidebar)

### 11.3 Painel profissional — 3 layouts distintos

- Mobile: bottom nav 5 itens + hamburger pra secundário
- Tablet: 2-col (nav esq fixed + main scrollable)
- Desktop: 3-col (sidebar fixa + main + inspector dir com state global)

### 11.4 Editor visual — desktop primário

- Mobile: read-only ou versão simplificada
- Desktop: split 50/50 (drag-drop blocks esq + preview ao vivo dir)

---

## 12. Editor visual de páginas (drag-drop) — UI ADIADA, SCHEMA DIA 1

> **Decisão D-G35 (princípio §39):** Schema `desafit.pages` com `draft_blocks` + `published_blocks` está dia 1 (§16.8). UI drag-drop entra **fase 2** — só quando 3+ tenants pedirem editar landing diretamente.
>
> **Dia 1:** fundador (você) monta cada página manualmente em código (commit de JSON no schema `pages` via admin painel simples ou direto via SQL). Cada cliente pode ter página totalmente diferente da outra (schema `blocks jsonb` é flexível). Quando padrões emergirem (3+ páginas parecidas), extrai como `public.page_templates`.

### 12.1 Schema dia 1 (já em §16.8)

```sql
desafit.pages           -- (tenant_id, slug, draft_blocks jsonb, published_blocks jsonb, ...)
public.page_templates   -- catálogo de templates oficiais clonáveis
```

### 12.2 Blocks library (spec — vai entrar quando UI for construída)

11 blocks dia 1 da UI quando entrar:

| Block          | Props (Zod)                                                       |
| -------------- | ----------------------------------------------------------------- |
| `hero`         | title, subtitle, cta_label, cta_href, bg_image                    |
| `rich_text`    | html                                                              |
| `image`        | src, alt, aspect (16/9 \| 1/1 \| 4/5)                             |
| `video`        | src (Bunny), poster                                               |
| `features`     | items: {icon, title, body}[] max 6                                |
| `testimonials` | items: {name, quote, avatar}[] max 8                              |
| `pricing`      | tiers: {name, price_amount_minor, currency, period, features[]}[] |
| `faq`          | items: {q, a}[]                                                   |
| `lead_form`    | fields: enum[], success_message                                   |
| `cta_banner`   | title, button_label, button_href                                  |
| `spacer`       | size: sm \| md \| lg \| xl                                        |

```ts
// lib/contracts/page-blocks/page-blocks.schema.ts (existe dia 1, consumido pelo renderer público)
import { z } from 'zod'

const BlockBase = z.object({ id: z.string().uuid(), visible: z.boolean().default(true) })

export const Block = z.discriminatedUnion('kind', [
  BlockBase.extend({
    kind: z.literal('hero'),
    props: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      cta_label: z.string(),
      cta_href: z.string().url(),
      bg_image: z.string().url().optional(),
    }),
  }),
  BlockBase.extend({ kind: z.literal('rich_text'), props: z.object({ html: z.string() }) }),
  // ... 9 outros
])
export type Block = z.infer<typeof Block>
```

### 12.3 Renderer público dia 1 (consome `published_blocks`)

```tsx
// app/(public)/[tenant]/page.tsx
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'
import { PageRenderer } from '@/components/pages/PageRenderer'

async function getTenantPage(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`tenant-page:${slug}`)
  return supabaseAdmin.from('pages').select('*').eq('slug', slug).single()
}

export default async function TenantLanding({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params
  const { data: page } = await getTenantPage(tenant)
  return (
    <>
      <PageRenderer blocks={page.published_blocks} />
      <Suspense fallback={null}>
        <LeadFormDynamic tenant={tenant} />
      </Suspense>
    </>
  )
}
```

Mutação publish → `revalidateTag(\`tenant-page:${slug}\`, 'max')`.

### 12.4 UX patterns (spec pra quando UI for construída — fase 2)

Quando UI entrar, vai seguir os patterns da pesquisa #2:

- Side-panel direito pra props complexas; text inline com click direto; slash `/` no canvas
- Drop zone = linha azul 2px + elevation no card destino
- Keyboard reorder (Tab → Space → ↑/↓ → Space) com `aria-live`
- Cmd+Z global, history depth 50
- Auto-save debounced 800ms; indicador discreto canto inferior direito
- Editor desktop-only (≥768px); mobile = preview read-only com toggle viewport
- Library: sidebar categorizada + slash `/`
- Drafts vs published explícito (botão "Publicar")
- Preview em nova aba `/preview/[id]?token=…`

Stack: `@dnd-kit/core` + `@dnd-kit/sortable` (já no §1 stack).

### 12.5 Tiers de editor (D-G69 + D-G70) — slice por pacote

**Princípio meta (D-G67):** editor não é fase pós-SaaS, é **mecanismo de produção desde 1º tenant**. Sem painel editável, fundador vira escravo de tickets ("trocar texto X" → ticket → deploy). Com tier 1, prof autônomo em 80% das mudanças → entrega cai de 90d pra 10d. Mesmo em modelo agência permanente, painel é rentabilidade — não luxo SaaS.

**3 tiers explícitos:**

| Tier                | Funcionalidade                                                                                      | Entra junto de                        | Stack sugerida                                         |
| ------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------ |
| **Tier 1 (must)**   | Editar texto/imagem em blocos · upload vídeo (Bunny) · editar workout/módulo · publicar/despublicar | **Pacote A — gate 1º tenant** (D-G68) | Form-based + select blocks (sem drag-drop ainda)       |
| **Tier 2 (nice)**   | Drag-drop reorder · A/B básico · variantes landing · agendamento publicação · histórico versões     | Pacote B                              | Block editor full (Tiptap/Lexical — pesquisa P7 D-G75) |
| **Tier 3 (futuro)** | Vibe coding chat · IA sugere conteúdo · WYSIWYG completo · custom blocks user-defined               | Pacote C / SaaS público               | Pipeline AI §13 + multi-step canvas                    |

**Slice por pacote completo (D-G70) — não feature-by-feature:**

Fecha **Pacote A inteiro** (landing template + form template + programa básico + tier 1 editor + checkout aluno) → vende → próximo. Evita "5 features 80% prontas" (dor onboarding-bio).

Por que **não feature-by-feature**:

- Vender "landing tier 1 + form tier 2" = incoerência de oferta
- Cada pacote tem promessa específica (A=básico, B=multi+automation, C=marketplace+vibe coding)
- Cliente compra pacote, não feature

Por que **não tudo de uma**:

- Schema dia 1 sim (interconectado §39), mas UI/editor por pacote (não inflar escopo)
- A é menor → fecha rápido → vende → financia B
- B reusa 80% do A (mesmo block editor, mais blocks)

**Estimativa horas tier 1 MVP** (5 blocks editáveis: hero, text, image, video, faq): 40-60h se Tiptap/Lexical; 60-80h se hand-rolled. Decisão final em pesquisa P7.

---

## 13. Vibe coding (pipeline IA) — SCHEMA + PROMPTS DIA 1, UI POR CLIENTE (§39)

> **Decisão D-G35 (revisto):** Tabelas `public.ai_prompts`, `public.ai_prompt_versions`, `public.ai_invocations` estão dia 1 (§16.3). Pipeline UI (stepper visual + streaming + cards incrementais): **ideal** entra junto com 1º cliente; **adiamento aceito** se cronograma apertar (vira sprint imediato antes do 2º cliente — §39).
>
> **Dia 1 (fallback se atrasar):** fundador monta cada programa manualmente no painel do prof (`programs` → `modules` → `components`). Conforme padrões emergirem por vertical, extrai prompts pra `ai_prompts`.
>
> **Chatbot nutricional (Pacote C, runtime):** usa IA dia 1 — único uso runtime IA dia 1 (não tem versão manual viável). Usa `output_config.format` JSON Outputs GA + prompt caching 1h + guardrails.

### 13.0 Stack canônico (dia 1)

| Camada                  | Decisão                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider                | **Vercel AI Gateway** (zero markup, failover Anthropic→Bedrock→Vertex, observability dashboard)                                                             |
| SDK                     | `@ai-sdk/anthropic` + `ai` (Vercel AI SDK) com `structuredOutputMode: "outputFormat"`                                                                       |
| Modelos                 | **Sonnet 4.6** (`anthropic/claude-sonnet-4.6`) + **Haiku 4.5** (`anthropic/claude-haiku-4.5`) — pinados, não trocar sem ADR                                 |
| Saída estruturada       | `output_config.format` (JSON Outputs Anthropic GA) — 0 retries por JSON inválido, schema é constrained no decode                                            |
| Prompt caching          | `cacheControl: { type: "ephemeral", ttl: "1h" }` em chatbot e pipeline COMPONENTES (sessão prof gera vários em 30-50min); `ttl: "5min"` nos outros estágios |
| Batch (futuro pipeline) | Batches API -50% pra "gerar programa completo" (1-2min async)                                                                                               |
| Extended thinking       | Só na ESTRUTURA (Sonnet 4.6 com `thinking: { type: "adaptive" }`, effort medium). Outros estágios zero-shot.                                                |
| Eval                    | Promptfoo CI + Vercel AI Gateway dashboard + Sentry — Promptfoo entra quando 1º prompt customizado for criado no banco                                      |

### 13.1 Pipeline 4 estágios (spec — futuro)

```
Estágio 1: Identidade
  Input: respostas do prof (modalidade, target, tom, duração, preço)
  Output: { brand: { primary_color, app_name, tagline }, target_audience, tone_of_voice }

Estágio 2: Estrutura
  Input: identidade
  Output: { program: { name, duration, modules: [{ name, day_range }] } }

Estágio 3: Componentes
  Input: estrutura + identidade
  Output: { components: [{ module_id, day, kind, payload }] }

Estágio 4: Coerência
  Input: tudo gerado
  Output: { sales_page_blocks, capture_form_questions, email_sequence, push_templates }
```

### 13.2 Inputs do profissional (form de perguntas)

| Pergunta                    | Tipo    | Exemplo                                    |
| --------------------------- | ------- | ------------------------------------------ |
| Qual sua modalidade?        | enum    | musculação, corrida, nutrição, inglês, etc |
| Pra quem é o programa?      | text    | "mulheres 30-45 sedentárias"               |
| Quanto tempo dura?          | enum    | 7/14/21/30/60/90d ou contínuo              |
| Qual tom da comunicação?    | enum    | formal, casual, motivacional, científico   |
| Quanto custa?               | number  | preço em R$                                |
| Qual o resultado prometido? | text    | "perder 5kg em 30 dias"                    |
| Modelo de turma             | enum    | individual, grupo cohort, híbrido          |
| Você grava vídeo?           | boolean | sim/não — afeta se inclui video_lesson     |

### 13.3 Prompt keys (banco `public.ai_prompts` com versionamento)

```
desafit.identity.generate
desafit.program.generate_structure
desafit.program.generate_workout_component
desafit.program.generate_meal_plan_component
desafit.program.generate_video_lesson_component
desafit.program.generate_check_in_component
desafit.page.generate_landing_blocks
desafit.page.generate_sales_blocks
desafit.form.generate_capture_questions
desafit.email.generate_welcome_sequence
desafit.email.generate_drip_retention
desafit.push.generate_notification_templates
desafit.nutrition.chat_response  # bônus Pacote C
```

### 13.4 Modelos LLM por estágio (Research B 2026-05)

| Estágio                         | Modelo         | Modo           | Thinking                                  | Custo médio                              |
| ------------------------------- | -------------- | -------------- | ----------------------------------------- | ---------------------------------------- |
| Identidade                      | **Sonnet 4.6** | sync           | zero-shot                                 | $0.045/programa                          |
| Estrutura                       | **Sonnet 4.6** | sync           | **adaptive (effort medium)** budget ~4-8k | $0.10/programa                           |
| Componentes (10×)               | **Haiku 4.5**  | **batch -50%** | zero-shot                                 | $0.05/programa (com 90% cache hit)       |
| Coerência                       | **Haiku 4.5**  | batch -50%     | manual budget 2-4k (opcional)             | $0.007/programa                          |
| Chatbot nutricional (runtime)   | **Haiku 4.5**  | sync           | zero-shot                                 | $0.005/msg (com cache TACO+TBCA 90% hit) |
| Pre-screen (input sanitization) | **Haiku 4.5**  | sync           | zero-shot                                 | $0.0002/req                              |
| LLM judge (coerência)           | **Haiku 4.5**  | sync           | zero-shot                                 | $0.001/caso                              |

**Custo total estimado:** programa completo (pipeline) ~$0.21 · chatbot Pacote C 30 conv/mês ~$0.15 (cached). 10 tenants ano 1 = ~$5/mês IA total.

**Provider único:** Vercel AI Gateway (zero markup confirmado em doc oficial). Failover automático Anthropic→Bedrock→Vertex. Anthropic direto como fallback de emergência (`ANTHROPIC_API_KEY` env opcional).

### 13.5 Validação

- Input: Zod schema valida antes de chamar modelo
- Output: Zod schema valida estrutura
- Falha: retry 1x com prompt de correção, depois fail-fast com log

### 13.6 Logging (`public.ai_generations`)

```sql
CREATE TABLE public.ai_generations (
  id uuid PRIMARY KEY,
  tenant_id uuid NOT NULL,
  prompt_key text NOT NULL,
  prompt_version int NOT NULL,
  model text NOT NULL,
  input jsonb,
  output jsonb,
  tokens_in int, tokens_out int,
  cost_cents int,
  latency_ms int,
  status text,  -- success | failed | retried
  created_at timestamptz
);
```

### 13.7 Engine vs Prompt

- **Engine** (lógica determinística): código em `lib/domain/ai/`, testável, versionado em git
- **Prompt** (criativo): no banco em `ai_prompts` + `ai_prompt_versions`, editável pelo admin

### 13.8 Custo estimado por geração

- Programa completo (4 estágios, com batch + caching): ~$0.21
- Sequência de 7 emails (batch + caching): ~$0.03
- Página de vendas (sync + caching): ~$0.02
- Chatbot nutricional Pacote C (30 conv/mês, com TACO+TBCA cached 1h): ~$0.15/cliente/mês

### 13.9 2-schema pattern obrigatório (Zod 4 draft + strict)

Anthropic JSON Outputs rejeita keywords Zod `minimum`, `maximum`, `minLength`, `exclusiveMinimum`, `not`, `oneOf`, `format` (exceto datas básicas), `regex`. Solução: 2 schemas paralelos.

```ts
// lib/contracts/components/workout/workout.draft.schema.ts (sem .min/.max/.regex/.url)
import { z } from 'zod'

export const WorkoutDraftSchema = z.object({
  type: z.literal('workout'),
  title: z.string(),
  estimated_minutes: z.number(),
  blocks: z.array(
    z.object({
      name: z.string(),
      sets: z.array(
        z.object({
          reps: z.union([z.number().int(), z.string()]),
          weight_kg: z.number().nullable(),
          rest_sec: z.number().nullable(),
        }),
      ),
    }),
  ),
})

// lib/contracts/components/workout/workout.strict.schema.ts (mesmo shape + constraints de negócio)
export const WorkoutStrictSchema = WorkoutDraftSchema.extend({
  title: z.string().min(3).max(120),
  estimated_minutes: z.number().int().min(1).max(300),
  blocks: z
    .array(
      z.object({
        name: z.string().min(1).max(80),
        sets: z
          .array(
            z.object({
              reps: z.union([z.number().int().min(1).max(100), z.string().max(20)]),
              weight_kg: z.number().nonnegative().nullable(),
              rest_sec: z.number().int().min(0).max(600).nullable(),
            }),
          )
          .min(1)
          .max(50),
      }),
    )
    .min(1)
    .max(20),
})

// lib/ai/parse-component.ts (borda LLM → banco)
import type { z } from 'zod'
export function parseGenerated<TStrict extends z.ZodTypeAny>(
  raw: unknown,
  draft: z.ZodTypeAny,
  strict: TStrict,
): z.infer<TStrict> {
  const a = draft.parse(raw) // shape ok (já garantido pelo constrained decoding)
  return strict.parse(a) // constraints de negócio
}
```

**Regra:** todo `payload jsonb` gerado por IA tem par draft+strict. Schema strict é a fonte de verdade pra UI/banco; draft só existe pra contrato LLM.

### 13.10 Prompt caching (TTL strategy)

```ts
import { generateObject } from 'ai'
import { WorkoutDraftSchema } from '@/lib/contracts/components/workout/workout.draft.schema'

const { object } = await generateObject({
  model: 'anthropic/claude-haiku-4.5',
  system: [
    {
      type: 'text',
      text: systemPrompt, // identidade tenant renderizada + few-shots + voz
      cache_control: { type: 'ephemeral', ttl: '1h' }, // 1h pra sessão prof gerar vários componentes
    },
  ],
  prompt: userPrompt, // varia (só o slot atual)
  schema: WorkoutDraftSchema,
  providerOptions: {
    anthropic: { structuredOutputMode: 'outputFormat' },
  },
  maxRetries: 1,
})
```

**TTL por uso:**

- Pipeline COMPONENTES: 1h (prof gera 10+ em sequência)
- Chatbot Pacote C: 1h (cliente conversa 5-15 msgs em uma sessão)
- IDENTIDADE/ESTRUTURA/COERÊNCIA: 5min (uso pontual)

**Hierarquia de invalidação:** mudar `tools` invalida tudo; mudar `system` invalida messages; mudar `thinking.budget_tokens` invalida só messages.

### 13.11 Batches API (-50% — só pipeline futuro)

Quando pipeline UI entrar, ofereça 2 modos no editor:

- _"Gerar agora"_ (sync, 100% custo) — componente isolado
- _"Gerar programa completo (1-2min)"_ (batch -50%) — fluxo principal

Async typicamente <1h, até 24h SLA. Empilha com prompt caching 1h. **Não é ZDR-eligible** — não usar pra dados com PII direta (usar `maskAluno()` antes).

### 13.12 Guardrails de segurança (dia 1 do chatbot)

**1. Input sanitization (`lib/ai/sanitize.ts`):**

```ts
const SUSPICIOUS = [
  /ignore (all |the )?(previous|above) instructions?/i,
  /system\s*:/i,
  /<\/?(system|tenant_input|assistant)>/i,
  /reveal (your |the )?(system )?prompt/i,
]

export function preScreen(input: string): { ok: boolean; reason?: string } {
  if (input.length > 2000) return { ok: false, reason: 'too_long' }
  for (const p of SUSPICIOUS) if (p.test(input)) return { ok: false, reason: 'pattern' }
  return { ok: true }
}

export function safeWrap(input: string, tag: string): string {
  const stripped = input.replace(new RegExp(`</?${tag}>`, 'gi'), '')
  return `<${tag}>\n${stripped}\n</${tag}>`
}
```

**Camada extra (chatbot only):** pre-screen Haiku $0.0002/req classifica `{ok|suspicious|reject}` — defesa pra prompts ambíguos que regex não pega.

**2. System prompt explícito (todo prompt chatbot/IA):**

```
Você é assistente nutricional do programa do prof [nome].
NUNCA diagnostica. NUNCA prescreve medicamento. NUNCA promete cura.
Sempre encaminha sintomas pra profissional habilitado (médico, nutri registrado).
Não responde sobre tratamento de doenças. Foco: educação alimentar + dicas de adesão.
```

**3. LLM judge na COERÊNCIA do pipeline:** Haiku 4.5 avalia output com rubric "este texto contém conselho médico/prescrição/promessa de cura?". Bloqueia se sim.

**4. PII placeholder antes do prompt:**

```ts
// lib/ai/pii.ts
export function maskAluno(name: string) {
  const placeholder = `__ALUNO_${crypto.randomUUID().slice(0, 8)}__`
  return { masked: placeholder, originalToPlaceholder: { [name]: placeholder } }
}

export function rehydrate(text: string, map: Record<string, string>): string {
  return Object.entries(map).reduce((acc, [k, v]) => acc.replaceAll(v, k), text)
}
```

Nome do aluno NUNCA vai bruto pro prompt. Primeiro nome ok com placeholder; rehidrata no frontend após response.

**5. Multi-tenant safety:** prompts SEMPRE construídos com cliente Supabase do usuário (RLS-enforced), NUNCA com `service_role`. Embeddings/KB consultam só tabelas globais (`public.kb_exercises`, `public.kb_foods`).

### 13.13 Budget per-tenant (`lib/ai/budget.ts`)

```ts
const BUDGET_CENTS_BY_TIER = {
  A: 0, // sem chatbot, sem pipeline runtime
  B: 0, // sem chatbot
  C: 200, // $2/mês cap chatbot Pacote C (conservador com cache hit 90%)
} as const

export async function assertBudget(tenantId: string, estCents: number) {
  const sb = await createClient()
  const { data: tenant } = await sb.from('tenants').select('plan').eq('id', tenantId).single()
  const cap = BUDGET_CENTS_BY_TIER[tenant.plan] ?? 0
  const { data: usage } = await sb
    .from('ai_usage_monthly')
    .select('total_cents')
    .eq('tenant_id', tenantId)
    .single()
  const used = usage?.total_cents ?? 0
  if (used + estCents > cap) throw new BudgetExceededError(tenantId, used, cap)
}
```

Vercel AI Gateway não tem budget granular por tenant — implementar na app. Tabela `public.ai_usage_monthly` agregada (1 row por tenant/mês) atualizada via trigger ou no callback do `ai_invocations` insert.

### 13.14 Helpers AI client dia 1 (chatbot only)

Lista mínima de helpers necessários pro chatbot Pacote C funcionar:

- `assertBudget(tenantId, estCents)` — §13.13
- `preScreen(input)` — §13.12.1
- `safeWrap(input, tag)` — §13.12.1
- `maskAluno(name)` / `rehydrate(text, map)` — §13.12.4
- `loadPrompt(key)` — Next 16 `'use cache'` lookup em `public.ai_prompts` com `cacheLife('minutes')` (60s)
- `logInvocation({...})` — insert em `public.ai_invocations` com hashes (não texto)
- `generateChatResponse(args)` — orquestrador final

`generateComponent` (pipeline) só entra quando UI pipeline for construída (§39).

### 13.15 Por que NÃO usar `Supabase.ai.Session` built-in

Supabase Edge Functions têm API built-in `Supabase.ai.Session('model-name')` com modelo embedding `gte-small` (384d) e LLM via Ollama/Llamafile. **Não serve pra desafit:**

- `gte-small` é **EN-only** — inútil pra chatbot/conteúdo PT-BR
- Ollama em Edge Function tem cold start alto + modelos pequenos (qualidade ruim vs Sonnet/Haiku)
- Vercel AI Gateway + Claude é estado-da-arte pro nosso caso (latência baixa, qualidade alta, caching, failover)

Se um dia precisarmos embeddings PT-BR, rodaremos `multilingual-e5-small` 384d em Supabase Edge Function com Transformers.js (padrão oficial Supabase). **Não dia 1** — chatbot Pacote C funciona sem RAG (KB inteiro cabe no system prompt cacheado).

---

## 14. A11y baseline (WCAG 2.2 AA + APCA)

### 14.1 Obrigatório dia 1

| Item                          | Implementação                                                                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Skip link em layout root      | `<a href="#main" className="sr-only focus:not-sr-only">Pular pro conteúdo</a>` (também em mobile PWA, mesmo single-page)      |
| `<main id="main">` em layouts | Lint custom: 1 main por página                                                                                                |
| Labels obrigatórias           | `label-has-associated-control` = error                                                                                        |
| `aria-label` em IconButtons   | Lint custom: button com só ícone exige aria-label                                                                             |
| Reduced motion                | `<MotionConfig reducedMotion="user">` no root + CSS fallback (§14.5)                                                          |
| Touch 44px+                   | Default `<Button className="h-11 min-w-11">`. Exceção: ícones inline em texto (24×24 ok se espaçados ≥8px do próximo target). |
| Focus visible                 | `:focus-visible` ring sempre, nunca `outline: none`                                                                           |
| `prefers-contrast: more`      | Layer alternativo de tokens semânticos (§14.6)                                                                                |
| Workout aria-live             | Anunciar série atual + countdown em momentos críticos (§14.7)                                                                 |

### 14.2 Lint stack

```js
import jsxA11y from 'eslint-plugin-jsx-a11y'

{
  plugins: { 'jsx-a11y': jsxA11y },
  rules: {
    ...jsxA11y.flatConfigs.strict.rules,
    'jsx-a11y/no-noninteractive-tabindex': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/label-has-associated-control': ['error', { depth: 3 }],
  }
}
```

### 14.3 E2E + automação

- `@axe-core/playwright` em toda página crítica (auth, dashboard, programa, módulo, componente, settings, PWA aluno)
- **Bloqueia PR** em qualquer violation `serious`/`critical`. Warn em `moderate`.
- Lighthouse CI: thresholds Perf ≥ 90 (mobile) / ≥ 95 (desktop), A11y = 100, PWA = 100 em `/aluno/*`, Best Practices ≥ 95, SEO = 100 (landing) / ≥ 90 (painel)
- Pre-push hook: axe rápido em changed files

```ts
// tests/a11y/aluno-home.spec.ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('home aluno passa a11y', async ({ page }) => {
  await page.goto('/aluno/inicio')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze()
  expect(
    results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical'),
  ).toEqual([])
})
```

### 14.4 Color contrast APCA dual-gate

- **APCA Lc targets:** Lc 75 body small, Lc 60 UI grande, Lc 90 texto pequeno crítico, Lc 45 UI elements grandes (gate principal)
- **WCAG 2.x AA fallback:** ratio ≥ 4.5 body, ≥ 3 large (gate compatibilidade)
- Script `pnpm color:audit` valida todas paletas × dark/light × pares semânticos
- Branding do tenant: ao salvar `theme_tokens`, server action chama `ensureAccessible()` (§7.5) — rejeita se não atinge Lc 60

### 14.5 `prefers-reduced-motion` — fallback por animação

```css
/* app/globals.css */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

| Animação                     | Reduced fallback                  |
| ---------------------------- | --------------------------------- |
| Vaul drawer slide-up         | Instant snap (sem slide)          |
| Card hover scale             | Nenhuma                           |
| Tab switch slide             | Crossfade <100ms                  |
| Streak ring fill             | Static state (valor final direto) |
| Confetti milestone           | Static badge (sem animação)       |
| Number ticker                | Valor final direto                |
| Skeleton pulse               | Shimmer desativado (cor sólida)   |
| View transitions entre rotas | Crossfade simples                 |

### 14.6 `prefers-contrast: more` — layer extra

```css
@media (prefers-contrast: more) {
  :root {
    --foreground: 0 0% 0%;
    --background: 0 0% 100%;
    --border: 0 0% 20%;
  }
  [data-theme='dark'] {
    --foreground: 0 0% 100%;
    --background: 0 0% 0%;
    --border: 0 0% 80%;
  }
}
```

### 14.7 Screen reader patterns por contexto

**Workout — anunciar set atual:**

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {currentSet
    ? `Série ${currentSet.index} de ${totalSets}, ${currentSet.reps} repetições com ${currentSet.weight_kg} quilos`
    : null}
</div>
```

**Timer de descanso — countdown:** anunciar a cada 30s e nos últimos 5s.

**Sliders de check-in:** `aria-valuetext` semântico ("7 de 10, alta energia"), não só número.

### 14.8 Checklist a11y por tela

| Tela                 | Checklist                                                                                                                                                                               |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**             | `aria-label` em inputs, autocomplete tokens (`email`, `current-password`), erros em `aria-live`, focus no primeiro field, "esqueci senha" como `<a>` real (nunca `<button>` estilizado) |
| **Dashboard (prof)** | Landmarks (`<main>`, `<nav aria-label="Principal">`), `<th scope>` em tabelas, sortable `aria-sort`, sidebar collapse anuncia estado                                                    |
| **Workout (aluno)**  | `aria-live` anuncia set atual (§14.7), countdown anunciado a cada 30s ou no fim, botão complete `aria-label="Marcar série N completa, X kg, Y reps"`, vídeo com captions ou transcript  |
| **Check-in**         | Sliders com `aria-valuetext` semântico, labels visíveis, foto upload com alternativa textual ("Tirar foto de pesagem")                                                                  |
| **Settings**         | Toggles `role="switch"` + `aria-checked`, agrupados em fieldset, mudanças via toast com `aria-live`, destructive em `<AlertDialog>` (não Drawer)                                        |
| **Agenda**           | Dia atual destacado + `aria-current="date"`, eventos com `<time dateTime>`, navegação por teclado entre dias (←/→)                                                                      |
| **Chatbot**          | `aria-live="polite"` no novo message, role conversation, focus retorna pro input após resposta, scroll automático announce-only                                                         |

### 14.9 Focus management — bottom sheets

Vaul + Radix Dialog: focus trap nativo. `aria-labelledby` no `<Drawer.Title>` + `autoFocus` no primeiro field. Esc fecha. Focus retorna ao trigger ao fechar.

### 14.10 VoiceOver iOS / TalkBack Android — quirks conhecidos

- **VoiceOver iOS PWA:** hierarquia de headings importa (rotor navega por h1-h6). `aria-live="polite"` funciona; `assertive` só pra erros críticos. Standalone PWA = menos foco perdido entre navegações.
- **TalkBack Android:** custom actions via swipe → expor com `role="button"` claro. Evitar `aria-hidden` em focáveis (Chrome Android falha silently).

---

## 15. i18n + multi-moeda (next-intl 4 + Money value object)

> **Decisão D-G33:** 4 locales suportados dia 1 + multi-moeda nativa via `Money`. Stripe internacional acessível pra qualquer tenant que pedir USD/EUR/GBP dia 1 (não esperar fase SaaS).

### 15.1 Locales suportados dia 1

| Locale  | Status dia 1 | Notas                                       |
| ------- | ------------ | ------------------------------------------- |
| `pt-BR` | ✅ Default   | Primário (mercado inicial)                  |
| `en-US` | ✅ Suportado | Prof brasileiro vendendo alunos no exterior |
| `pt-PT` | ✅ Suportado | Expansão Portugal (decisões D-G da §0.5)    |
| `es-ES` | ✅ Suportado | Prep LATAM ex-BR                            |

Mais locales adicionam novas pastas em `messages/` — sem mudança de código. Resolver:

```
locale_preference (auth.users.user_metadata)
  > tenant.default_locale
  > Accept-Language do browser
  > 'pt-BR'
```

### 15.2 Estrutura messages — namespace por vertical

```
messages/
├── pt-BR/
│   ├── common.json                   # cross-vertical (botões, validation, errors)
│   ├── auth.json
│   ├── kinds.fitness_strength.json   # labels específicos por vertical (§5.4)
│   ├── kinds.english_lang.json
│   ├── kinds.nutrition.json
│   ├── programs.json
│   ├── billing.json
│   └── ...
├── en-US/  (mesma estrutura)
├── pt-PT/
└── es-ES/
```

**Convenção de chaves:** `feature.context.element` (3 níveis max). Plurais via ICU MessageFormat obrigatório (CI bloqueia interpolação manual `${count} treinos`).

```json
// messages/pt-BR/programs.json
{
  "programs": {
    "list": {
      "title": "Programas",
      "empty": "Nenhum programa criado",
      "count": "{count, plural, =0 {Nenhum programa} =1 {1 programa} other {# programas}}"
    }
  }
}
```

### 15.3 Lint enforcement

- `react/jsx-no-literals`: `error` (zero string hardcoded em JSX)
- Script `pnpm i18n:audit` em CI: detecta keys órfãs (em messages mas não usadas) e faltantes (usadas mas não definidas) — falha se > 0
- Custom rule (futuro): detectar template literal com variável em string que deveria ser ICU

### 15.4 `Money` value object — multi-moeda canônica

```ts
// lib/domain/money.ts
export type Currency = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'CAD' | 'AUD' | 'MXN' // ISO 4217

export type Money = {
  amount_minor: number // sempre em unidade mínima (centavos pra BRL/USD/EUR)
  currency: Currency
}

export const Money = {
  zero: (currency: Currency): Money => ({ amount_minor: 0, currency }),

  format: (m: Money, locale: string): string =>
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: m.currency,
    }).format(m.amount_minor / 100),

  add: (a: Money, b: Money): Money => {
    if (a.currency !== b.currency)
      throw new Error(`currency_mismatch: ${a.currency} vs ${b.currency}`)
    return { amount_minor: a.amount_minor + b.amount_minor, currency: a.currency }
  },

  // converte usando rate da tabela exchange_rates
  convert: (m: Money, target: Currency, rate: number): Money => ({
    amount_minor: Math.round(m.amount_minor * rate),
    currency: target,
  }),
}
```

**Regras de schema (CI bloqueia):**

- Toda coluna de preço é **par** `<x>_amount_minor int + <x>_currency text REFERENCES currencies(code)`
- NUNCA `decimal price` solto
- Comparação de Money sempre via helper (mismatch lança)

**Pagamento por moeda:**
| Moeda | Gateway dia 1 | Como |
|---|---|---|
| BRL | Asaas (link externo) | Default, já decidido §24 |
| USD, EUR, GBP, CAD, AUD | Stripe | Dia 1 — tenant cola publishable+secret em `payment_methods.gateway_config jsonb` (encrypted) |
| MXN, outros LATAM | Stripe ou Mercado Pago | Avaliar quando tenant pedir |

Tenant escolhe `default_currency` + `accepted_currencies text[]` por programa. Aluno vê preço na moeda do programa; tooltip mostra conversão via `exchange_rates` (§16.10).

### 15.5 Formatação

- Datas, números, moeda: `useFormatter()` do next-intl OU `Money.format()` pra preço
- Backend retorna ISO timestamps + Money (`{amount_minor, currency}`) raw, client formata
- Plurais: ICU MessageFormat (obrigatório)
- Timezone: aluno tem `tz_preference`; default `tenant.default_tz` (default `America/Sao_Paulo`)

### 15.7 Zero hardcoded — detecção completa de strings (D-G66)

> **Contexto (caso real onboarding-bio):** `react/jsx-no-literals` pegou só **JSX text**. Centenas de strings hardcoded em outros padrões passaram batido — mesmo problema do token bypass (700+ inline colors silenciadas por 830 disables).

**14 padrões equivalentes ao token bypass que precisam ser cobertos:**

| #   | Padrão                                                                 | jsx-no-literals pega? | Regra que cobre                                                                                                                             |
| --- | ---------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `<div>Texto</div>` JSX text                                            | ✅                    | `react/jsx-no-literals`                                                                                                                     |
| 2   | `aria-label="Botão"` JSX attribute                                     | ❌                    | `no-restricted-syntax` AST `JSXAttribute[name.name=/^aria-/]`                                                                               |
| 3   | `placeholder="Email"` JSX attribute                                    | ❌                    | `no-restricted-syntax` AST `JSXAttribute[name.name='placeholder']`                                                                          |
| 4   | `alt="Foto"` JSX attribute                                             | ❌                    | `no-restricted-syntax` AST `JSXAttribute[name.name='alt']`                                                                                  |
| 5   | `title="Dica"` JSX attribute                                           | ❌                    | `no-restricted-syntax` AST `JSXAttribute[name.name='title']`                                                                                |
| 6   | `toast.success('Salvo!')` call                                         | ❌                    | `no-restricted-syntax` AST `CallExpression[callee.object.name='toast']`                                                                     |
| 7   | `throw new Error('Validação falhou')`                                  | ❌                    | `no-restricted-syntax` AST `NewExpression[callee.name='Error']`                                                                             |
| 8   | `const TITLE = 'Programas'` const string PT/EN                         | ❌                    | grep pre-commit + CI (regex strings ≥3 chars com palavra dicionário PT/EN fora de allowlist)                                                |
| 9   | `export const metadata = { title: 'desafit' }` page metadata           | ❌                    | `no-restricted-syntax` AST `Property[key.name='title']` em `metadata` export                                                                |
| 10  | `fail({ kind: 'unknown', cause: 'Erro inesperado' })` em Server Action | ❌                    | `no-restricted-syntax` AST detectando `cause` em `fail()` arg + obriga `t()`                                                                |
| 11  | `z.string().min(3, 'Mín 3 caracteres')` Zod validation message         | ❌                    | `no-restricted-syntax` AST `CallExpression` em `z.*` com 2º arg Literal — força usar `setErrorMap` global                                   |
| 12  | Email templates react-email com strings literais                       | ❌                    | Regra custom em `lib/email/templates/**/*.tsx` (mesma `react/jsx-no-literals` aplicada lá com config strict)                                |
| 13  | Push notification body (`{ title: 'Bom dia 💪', body: '...' }`)        | ❌                    | Templates em `messages/<locale>/push.json` — never inline em código. ESLint detecta literal em prop `title`/`body` de chamadas `sendPush()` |
| 14  | `mapToAppError(e, 'Erro X')` em `lib/api/error.ts`                     | ❌                    | Mesmo pattern do (10) — força `t()` no message                                                                                              |

**Implementação completa (`eslint.config.ts` override pra i18n):**

```ts
// eslint.config.ts — adicionar bloco K (i18n hardcoded detection)
{
  files: ['**/*.{ts,tsx}'],
  ignores: [
    'messages/**/*.json',              // único lugar que tem strings PT/EN legítimas
    'lib/i18n/**/*',                   // config next-intl
    '**/*.test.ts',                    // testes podem ter fixtures
    'scripts/**/*',                    // scripts CLI
    'tools/**/*',                      // dev tools
  ],
  rules: {
    'react/jsx-no-literals': ['error', {
      noStrings: true,
      ignoreProps: false,              // pega aria-label, placeholder, alt, title TAMBÉM
      allowedStrings: [' ', ' ', '·', '—', '→', '←'],  // separadores tipográficos
    }],

    'no-restricted-syntax': ['error',
      // (2-5) JSX attributes com Literal
      { selector: "JSXAttribute[name.name=/^(aria-label|aria-description|aria-roledescription|placeholder|alt|title|aria-valuetext)$/] > Literal[value!='']",
        message: "String hardcoded em JSX attribute. Use t('namespace.key')." },
      { selector: "JSXAttribute[name.name=/^(aria-label|aria-description|aria-roledescription|placeholder|alt|title|aria-valuetext)$/] > JSXExpressionContainer > Literal[value!='']",
        message: "String hardcoded em JSX attribute. Use t('namespace.key')." },

      // (6) toast.* / sonner com Literal
      { selector: "CallExpression[callee.object.name='toast'] > Literal",
        message: "toast.* não pode receber Literal. Use t() ou key do messages/." },

      // (7) throw new Error('...')
      { selector: "NewExpression[callee.name='Error'] > Literal",
        message: "Mensagens de erro precisam vir de errors.ts ou t() — não Literal direto em new Error()." },

      // (9) metadata: { title: 'literal' }
      { selector: "Property[key.name=/^(title|description)$/] > Literal[value!='']",
        message: "Metadata title/description hardcoded. Use getTranslations() no generateMetadata()." },

      // (10) fail({ cause: 'literal' }) ou outras keys de AppError
      { selector: "CallExpression[callee.name='fail'] Property[key.name='cause'] > Literal",
        message: "AppError cause hardcoded. Use código de erro tipado, mensagem na UI via t()." },
      { selector: "CallExpression[callee.name='fail'] Property[key.name=/^(reason|resource)$/] > Literal",
        message: "AppError fields hardcoded. Use enum + t() na UI." },

      // (11) Zod 2º arg de validation methods
      { selector: "CallExpression[callee.object.name='z'] CallExpression[callee.property.name=/^(min|max|email|url|regex|length|gte|lte|nonempty)$/] > Literal:nth-child(2)",
        message: "Zod validation message hardcoded. Use z.setErrorMap() global em lib/contracts/zod-errors.ts." },

      // (13) sendPush({ title|body: 'literal' }) / Resend send({ subject: 'literal' })
      { selector: "CallExpression[callee.name=/^(sendPush|sendEmail|sendWhatsapp)$/] Property[key.name=/^(title|body|subject)$/] > Literal",
        message: "Push/Email/WhatsApp body hardcoded. Use template key de messages/<locale>/push.json." },
    ],
  },
},

// Override email templates — strings literais nunca
{
  files: ['lib/email/templates/**/*.tsx'],
  rules: {
    'react/jsx-no-literals': ['error', { noStrings: true, ignoreProps: false }],
    // forçar usar t() do next-intl no server (getTranslations)
  },
},
```

**Pre-commit grep safety net (`pnpm i18n:audit`):**

```ts
// scripts/i18n-audit.ts
import { globby } from 'globby'
import { readFile } from 'node:fs/promises'

const FILES = await globby([
  '**/*.{ts,tsx}',
  '!messages/**',
  '!lib/i18n/**',
  '!**/*.test.ts',
  '!scripts/**',
  '!tools/**',
  '!node_modules/**',
  '!.next/**',
  '!**/*.gen.ts',
])

// Regex pra detectar strings ≥4 chars com palavras de dicionário PT/EN
// fora de Literal ignorados (comentários, regex literals, etc)
const SUSPICIOUS = /(?<!\/\/.*?)["'`][A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]{3,}["'`]/g
const ALLOWLIST = /(\.test\.|^console\.|sentry\.|posthog\.|new URL\(|process\.env)/

const violations: string[] = []
for (const file of FILES) {
  const text = await readFile(file, 'utf-8')
  const matches = text.match(SUSPICIOUS) ?? []
  for (const m of matches) {
    if (!ALLOWLIST.test(m) && !text.includes(`t('`) && !text.includes(`getTranslations`)) {
      violations.push(`${file}: ${m}`)
    }
  }
}

if (violations.length) {
  console.error(`❌ ${violations.length} strings hardcoded detectadas:`)
  violations.slice(0, 20).forEach((v) => console.error(`  ${v}`))
  process.exit(1)
}
```

**`package.json`:**

```jsonc
"scripts": {
  "i18n:audit": "tsx scripts/i18n-audit.ts"
}
```

**CI bloqueia em §29.1:** `pnpm i18n:audit` corre antes de tests — falha PR se ≥ 1 hardcoded detectado.

**Allowlist explícita (zero ambiguidade):**

| Lugar                                            | Por quê pode ter literal                      |
| ------------------------------------------------ | --------------------------------------------- |
| `messages/<locale>/*.json`                       | Único lugar com strings traduzíveis legítimas |
| `lib/i18n/**/*`                                  | Config next-intl                              |
| `**/*.test.ts`                                   | Fixtures de teste                             |
| `scripts/**`, `tools/**`                         | CLI dev, não vai pra usuário                  |
| `console.warn/error` / `Sentry.captureException` | Log dev, não vai pra UI                       |
| `process.env.XXX`                                | Env vars                                      |
| `new URL('https://...')`                         | URL constants                                 |
| `posthog.capture('event_snake_case')`            | Event names snake_case                        |

**Tudo fora desta lista = ADR obrigatório.** Default: NUNCA aceitar literal — sempre vira chave em `messages/<locale>/`.

**Fixture de teste cobertura (`tests/lint/i18n-hardcoded.test.ts`):**

```ts
// Cada um dos 14 padrões num arquivo. Lint roda. Todos falham.
import { ESLint } from 'eslint'
import { test, expect } from 'vitest'

const eslint = new ESLint({ overrideConfigFile: '../eslint.config.ts' })

test.each([
  ['<div>Texto hardcoded</div>', 'react/jsx-no-literals'],
  ['<button aria-label="Salvar">x</button>', 'no-restricted-syntax'],
  ['<input placeholder="Email" />', 'no-restricted-syntax'],
  ['<img alt="Foto" />', 'no-restricted-syntax'],
  ['<a title="Dica">x</a>', 'no-restricted-syntax'],
  ['toast.success("Salvo!")', 'no-restricted-syntax'],
  ['throw new Error("Validação falhou")', 'no-restricted-syntax'],
  ['const TITLE = "Programas"; export default function() {}', 'i18n-audit-grep'], // pre-commit grep
  ['export const metadata = { title: "desafit" }', 'no-restricted-syntax'],
  ['fail({ kind: "unknown", cause: "Erro inesperado" })', 'no-restricted-syntax'],
  ['z.string().min(3, "Mín 3 caracteres")', 'no-restricted-syntax'],
  ['sendPush({ title: "Bom dia", body: "..." })', 'no-restricted-syntax'],
])('detecta hardcoded %s', async (code, ruleId) => {
  const results = await eslint.lintText(code, { filePath: 'app/page.tsx' })
  expect(results[0].messages.some((m) => m.ruleId === ruleId)).toBe(true)
})
```

**Resolve diretamente:** centenas de hardcoded estimados no onboarding-bio. Defesa em **6 camadas** (jsx-no-literals + no-restricted-syntax + eslint-plugin-i18next + grep pre-commit + i18n:audit CI + decisão cultural "tudo em messages/").

### 15.6 URL rewrites PT→EN

Rotas internas em EN (folders), URL pública em PT-BR via rewrites em `next.config.ts`.

```ts
// next.config.ts
async rewrites() {
  return [
    { source: '/treinos', destination: '/workouts' },
    { source: '/treinos/:slug', destination: '/workouts/:slug' },
    { source: '/alunos', destination: '/clients' },
    { source: '/perfil', destination: '/profile' },
    { source: '/configuracoes', destination: '/settings' },
    { source: '/aparencia', destination: '/appearance' },
    { source: '/captacao', destination: '/capture' },
    { source: '/vendas', destination: '/sales' },
    { source: '/agenda', destination: '/schedule' },
    { source: '/programa/:path*', destination: '/program/:path*' },
    { source: '/inicio', destination: '/home' },
    { source: '/chatbot', destination: '/assistant' },
    { source: '/aluno/:path*', destination: '/client/:path*' },
  ]
}
```

Pra locales não-PT (en-US, pt-PT, es-ES) as URLs ficam em EN nativo (sem rewrite). Resolução por `Accept-Language` ou prefixo `/[locale]/`.

---

## 16. Banco — schemas + RLS + RPCs + migrations

> **Princípio governante (§39):** schema **completo** dia 1 (suporta 100% da proposta comercial). UI de criação é incremental — fundador faz manual o que ainda não tem ferramenta.

### 16.1 Schemas separados

- `public.*` — cross-cutting (profiles, tenants, memberships, subscriptions, slug_blocklist, domains, verticals, vertical_component_kinds, specialty_templates, page_templates, ai_prompts, ai_prompt_versions, ai_invocations, ai_usage_monthly, kb_exercises, kb_foods, push_subscriptions, currencies, exchange_rates, system_seeds)
- `desafit.*` — produto (programs, modules, components, component_schedules, component_progress, enrollments, cohorts, capture_forms, capture_submissions, leads, pages, page_versions, coupons, payments, payment_methods, exercises_library_overrides, food_library_overrides, progress_metrics, progress_photos, check_ins, chatbot_threads, chatbot_messages, push_messages, email_messages, achievements, badges, workout_logs, import_jobs)

**Sem `onboarding.*`** (legado fica só no histórico do outro repo).

### 16.2 Convenções obrigatórias (CI gate)

- Toda tabela: `id uuid PK default gen_random_uuid()`, `created_at`, `updated_at` (trigger auto), `deleted_at` (soft delete onde aplicável)
- Toda tabela tenant-scoped: `tenant_id uuid not null references public.tenants(id)` + btree index obrigatório
- RLS `enable` em **todas** tabelas (CI: script falha se alguma sem RLS)
- Policies sempre via `(select public.current_tenant_id())` — NUNCA `auth.jwt()->>'tenant_id'` direto (initPlan cacheia, 100× speedup em tabelas grandes — confirmado em supabase.com/docs/guides/troubleshooting/rls-performance)
- Toda policy `TO authenticated` explícito (evita rodar pra `anon`)
- Toda coluna de preço é **par** `<x>_amount_minor int + <x>_currency text` (nunca `decimal` solto — §15 Money value object)

### 16.3 Core tabelas dia 1 (migration baseline `0001_initial.sql`)

**public (cross-cutting):**

```
public.profiles              -- 1:1 com auth.users
public.tenants               -- empresa do profissional (multi-tenant raiz)
public.memberships           -- (tenant_id, user_id, role) — 5 roles enum
public.subscriptions         -- assinatura da plataforma cobrada DO PROFISSIONAL (EFI Bank)
public.slug_blocklist        -- slugs reservados pra subdomínio
public.domains               -- custom domains (verified, ssl_status, primary)
public.verticals             -- catálogo (musculacao/nutricao/ingles/etc — pré-seedado)
public.vertical_component_kinds   -- mapping vertical → kinds válidos
public.specialty_templates   -- templates oficiais de programa, clonáveis por tenant
public.page_templates        -- templates oficiais de página, clonáveis por tenant
public.ai_prompts            -- (key, vertical_id) — UNIQUE INDEX active único por key (§13)
public.ai_prompt_versions    -- (prompt_id, version, system_message, user_template, examples jsonb[], model, params jsonb, schema_ref, active boolean, rollout_pct int, notes, created_by)
public.ai_invocations        -- log com HASHES (não texto, LGPD): tenant_id, user_id, prompt_key, prompt_version, model, stage, input_hash, output_hash, tokens_in/out/cache_r/cache_w, cost_usd_cents, latency_ms, status, error jsonb
public.ai_usage_monthly      -- agregado: tenant_id, month, total_cents (pra assertBudget §13.13)
public.kb_exercises          -- ~870 exercícios free-exercise-db (sem coluna embedding dia 1 — RAG adiado §13.15)
public.kb_foods              -- ~2500 alimentos TBCA (1900) + TACO (597) sem dedup (sem embedding)
public.push_subscriptions    -- 1 por (user_id, endpoint) — Vapid keys por tenant em tenant_secrets
public.currencies            -- ISO 4217 catálogo
public.exchange_rates        -- (base, quote, rate, captured_at) — cron diário
public.system_seeds          -- flags pra controlar idempotência de seeds
```

**desafit (produto):**

```
desafit.programs             -- (tenant_id, vertical_id, title, cover_image_url, currency, price_amount_minor, cohort_type enum('evergreen','live'), enrollment_window jsonb, source_template_id, status)
desafit.modules              -- (program_id, title, position)
desafit.components           -- (tenant_id, module_id, kind desafit.component_kind, schema_version, payload jsonb, status) — enum em §5.3, mapping vertical → kind em public.vertical_component_kinds
desafit.component_schedules  -- (component_id, day_offset OR unlock_at, unlock_rule jsonb)
desafit.component_progress   -- (tenant_id, enrollment_id, component_id, completed_at, status, payload jsonb)
desafit.enrollments          -- (tenant_id, program_id, client_user_id, cohort_start_date, started_at, status)
desafit.cohorts              -- (program_id, name, starts_at, ends_at, capacity)  -- pra cohort_type='live'
desafit.capture_forms        -- (tenant_id, fields jsonb, redirect_url)
desafit.capture_submissions  -- payload livre
desafit.leads                -- (tenant_id, email, name, phone, source, status, submitted_at)
desafit.pages                -- (tenant_id, slug, draft_blocks jsonb, published_blocks jsonb, published_at, schema_version)
desafit.page_versions        -- histórico de publicações pra rollback
desafit.coupons              -- (tenant_id, code, discount_type enum, discount_amount_minor, currency, max_uses, expires_at)
desafit.payments             -- (tenant_id, enrollment_id, gateway enum, gateway_ref, amount_minor, currency, status, captured_at)
desafit.payment_methods      -- (tenant_id, gateway, gateway_config jsonb encrypted) — credenciais do gateway do prof
desafit.progress_metrics     -- (tenant_id, enrollment_id, metric_kind, value numeric, unit, captured_at)
desafit.progress_photos      -- (tenant_id, enrollment_id, file_url, captured_at, kind enum('front','side','back'))
desafit.check_ins            -- agregado de respostas de componentes check_in
desafit.chatbot_threads      -- (tenant_id, enrollment_id, kind enum('nutrition','program_q'))
desafit.chatbot_messages     -- (thread_id, role enum('user','assistant'), content, tokens, model)
desafit.push_messages        -- audit log push (recipient, title, body, deep_link, status) — §16.18
desafit.email_messages       -- audit log email Resend (recipient, subject, resend_id, opened_at) — §16.18
desafit.achievements         -- catálogo de conquistas por tenant (gamificação)
desafit.badges               -- (tenant_id, enrollment_id, achievement_id, awarded_at)
desafit.workout_logs         -- (tenant_id, enrollment_id, component_id, set_idx, weight_kg, reps, completed_at)
desafit.import_jobs          -- (tenant_id, kind enum('clients_csv', ...), status, errors jsonb)
```

**Por que tudo dia 1 (mesmo sem UI):**

- Promessa da proposta é entregue: prof pode mandar você cadastrar tudo manual.
- Schema preparado evita migration breaking quando UI for construída.
- Multi-vertical funciona dia 1 (mesmo só com `fitness_strength` ativa).

### 16.4 Helpers SQL (security definer, stable)

```sql
-- Tenant ID do JWT atual. STABLE → initPlan cacheia 1 vez por query.
CREATE OR REPLACE FUNCTION public.current_tenant_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')::uuid
$$;

-- Role ativa do membership corrente.
CREATE OR REPLACE FUNCTION public.current_user_role() RETURNS text
LANGUAGE sql STABLE AS $$
  SELECT current_setting('request.jwt.claims', true)::jsonb->>'active_membership_role'
$$;

-- Custom Access Token Hook (Supabase Auth) — injeta tenant_id + role no JWT
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql STABLE AS $$
DECLARE
  claims jsonb;
  m record;
BEGIN
  SELECT tenant_id, role INTO m
  FROM public.memberships
  WHERE user_id = (event->>'user_id')::uuid
    AND deleted_at IS NULL
  ORDER BY (role = 'professional') DESC, created_at ASC
  LIMIT 1;

  claims := event->'claims';
  IF m.tenant_id IS NOT NULL THEN
    claims := jsonb_set(claims, '{tenant_id}',              to_jsonb(m.tenant_id::text));
    claims := jsonb_set(claims, '{active_membership_role}', to_jsonb(m.role));
  END IF;
  RETURN jsonb_set(event, '{claims}', claims);
END $$;
```

**Passo obrigatório pós-migration:** Supabase Dashboard → Auth → Hooks → Custom Access Token = `public.custom_access_token_hook`. Sem isso JWT não tem `tenant_id` e RLS nega tudo.

### 16.5 RLS pattern canônico (todas tabelas tenant-scoped)

```sql
-- Pattern obrigatório pra qualquer tabela com tenant_id
ALTER TABLE desafit.programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY programs_tenant_select ON desafit.programs
  FOR SELECT TO authenticated
  USING ( tenant_id = (select public.current_tenant_id()) );

CREATE POLICY programs_tenant_mutate ON desafit.programs
  FOR ALL TO authenticated
  USING      ( tenant_id = (select public.current_tenant_id())
               AND (select public.current_user_role()) IN ('professional','staff','admin') )
  WITH CHECK ( tenant_id = (select public.current_tenant_id())
               AND (select public.current_user_role()) IN ('professional','staff','admin') );

CREATE INDEX programs_tenant_idx ON desafit.programs (tenant_id);
```

**Regras:**

- Sempre `(select fn())` — wrap escala 100× em tabelas grandes
- Sempre `TO authenticated` explícito
- Btree em `tenant_id` em **toda** tabela tenant-scoped (CI bloqueia se faltar)
- Joins recursivos cross-table que cruzariam RLS → mover pra RPC `SECURITY DEFINER`

### 16.6 Índices JSONB + generated columns pra hot queries

```sql
-- GIN com jsonb_path_ops (mais leve que jsonb_ops, indexa só @> @? operadores comuns)
CREATE INDEX components_payload_gin ON desafit.components
  USING gin (payload jsonb_path_ops);

CREATE INDEX components_kind_idx ON desafit.components (kind);

-- Generated column pra hot query (ex: "todos workouts com peso > 100kg")
ALTER TABLE desafit.components
  ADD COLUMN max_weight_kg numeric GENERATED ALWAYS AS (
    (jsonb_path_query_first(payload, '$.blocks[*].sets[*].weight_kg ? (@ != null)')::text)::numeric
  ) STORED;

CREATE INDEX components_max_weight_idx
  ON desafit.components (max_weight_kg)
  WHERE kind = 'workout';
```

**Query exemplo:**

```sql
SELECT id, payload
FROM desafit.components
WHERE kind = 'workout'
  AND payload @? '$.blocks[*].sets[*].weight_kg ? (@ > 100)';
```

### 16.7 RPC pattern (mutação multi-tabela + cross-RLS)

**Quando usar RPC vs server action vs trigger:**

| Caso                                                                   | Use                      |
| ---------------------------------------------------------------------- | ------------------------ |
| Validation + business logic + 1 chamada DB simples                     | Server action (TS + Zod) |
| Multi-row atômico, cross-table com RLS recursivo, hot-path performance | RPC `SECURITY DEFINER`   |
| Invariantes do dado (`updated_at`, counters denormalizados)            | Trigger                  |

**Template canônico (RPC `complete_set` — exemplo):**

```sql
CREATE OR REPLACE FUNCTION desafit.complete_set(
  p_set_id uuid, p_weight_kg numeric, p_reps int
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_tenant uuid := (select public.current_tenant_id());
  v_log_id uuid;
BEGIN
  IF v_tenant IS NULL THEN
    RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000';
  END IF;

  INSERT INTO desafit.workout_logs (tenant_id, set_id, weight_kg, reps, completed_at)
  SELECT v_tenant, p_set_id, p_weight_kg, p_reps, now()
  WHERE EXISTS (
    SELECT 1 FROM desafit.components c
    WHERE c.id = (SELECT component_id FROM desafit.workout_sets WHERE id = p_set_id)
      AND c.tenant_id = v_tenant
  )
  RETURNING id INTO v_log_id;

  IF v_log_id IS NULL THEN
    RAISE EXCEPTION 'set_not_found_or_forbidden' USING ERRCODE = '42501';
  END IF;
  RETURN v_log_id;
END $$;

REVOKE ALL ON FUNCTION desafit.complete_set(uuid, numeric, int) FROM public, anon;
GRANT EXECUTE ON FUNCTION desafit.complete_set(uuid, numeric, int) TO authenticated;
```

**Server action consumindo:**

```ts
'use server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

const Input = z.object({
  setId: z.string().uuid(),
  weightKg: z.number().nonnegative(),
  reps: z.number().int().positive(),
})

export async function completeSet(input: z.infer<typeof Input>) {
  const i = Input.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('complete_set', {
    p_set_id: i.setId,
    p_weight_kg: i.weightKg,
    p_reps: i.reps,
  })
  if (error) {
    if (error.code === '28000') return { ok: false, error: 'Sessão expirada' } as const
    if (error.code === '42501') return { ok: false, error: 'Sem permissão' } as const
    throw error
  }
  revalidateTag(`set:${i.setId}`, 'max')
  return { ok: true, data } as const
}
```

**Princípio:** mutação multi-tabela **sempre via RPC**. Server actions são adapters thin (parse Zod + chamar RPC + revalidate).

### 16.8 Schema `pages` (suporta editor visual futuro)

```sql
CREATE TABLE desafit.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  slug text NOT NULL,                              -- '/', 'sobre', 'programa/[program_id]'
  draft_blocks jsonb NOT NULL DEFAULT '[]'::jsonb, -- editor edita aqui
  published_blocks jsonb,                          -- live
  published_at timestamptz,
  schema_version int NOT NULL DEFAULT 1,
  source_template_id uuid REFERENCES public.page_templates(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (tenant_id, slug)
);

CREATE INDEX pages_tenant_idx ON desafit.pages (tenant_id);
CREATE INDEX pages_published_gin ON desafit.pages USING gin (published_blocks jsonb_path_ops);

-- Templates oficiais clonáveis (criados pela plataforma)
CREATE TABLE public.page_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,           -- 'sales' | 'capture' | 'thank_you' | ...
  vertical_ids text[] NOT NULL,     -- aplicável a quais verticals
  preview_image_url text,
  blocks jsonb NOT NULL,
  is_active boolean DEFAULT true
);
```

**Dia 1:** fundador monta páginas direto via `INSERT` ou painel admin simples (JSON editor). Quando 3+ tenants pedirem editar landing, constrói editor visual (§12) sobre esse schema sem migration.

### 16.9 Comunicação prof↔aluno (D-G37 — só push + email)

**Não tem tabela `messages`.** Comunicação é assíncrona one-way (prof→aluno) via push (Web Push branded) + email (Resend).

- **Push:** prof dispara via `/dashboard/clients/[id]/notify` ou automação. Tabela `desafit.push_messages` (audit log) + `public.push_subscriptions` (endpoints).
- **Email:** prof dispara via `/dashboard/clients/[id]/email` ou automação. Templates Resend + react-email. Log em `desafit.email_messages`.
- **Conteúdo de programa = `component_kind='message'`:** mensagem motivacional pré-escrita no roteiro do dia X. Aluno abre, lê, marca como lido. Não é conversa.
- **Chat com IA:** tab Chatbot do PWA (Pacote C) é com IA nutricional, não com prof. Schema `desafit.chatbot_threads` + `chatbot_messages` em §16.3.

**Por quê não chat 1:1:** prof não tem tempo de moderar caixa de mensagens de N alunos. Suporte real do prof acontece fora do app (WhatsApp pessoal, IG DM). Plataforma só notifica em massa.

### 16.10 Schema `currencies` + `exchange_rates`

```sql
CREATE TABLE public.currencies (
  code text PRIMARY KEY,            -- ISO 4217: 'BRL', 'USD', 'EUR', 'GBP', ...
  name text NOT NULL,
  symbol text NOT NULL,
  decimal_digits int DEFAULT 2,
  active boolean DEFAULT true
);

CREATE TABLE public.exchange_rates (
  base_currency text NOT NULL REFERENCES public.currencies(code),
  quote_currency text NOT NULL REFERENCES public.currencies(code),
  rate numeric NOT NULL,
  captured_at timestamptz DEFAULT now(),
  PRIMARY KEY (base_currency, quote_currency, captured_at)
);

CREATE INDEX exchange_rates_latest_idx
  ON public.exchange_rates (base_currency, quote_currency, captured_at DESC);
```

**Cron Edge Function diário:** fetch Open Exchange Rates ou ECB → upsert na tabela. Lê última rate via:

```sql
SELECT rate FROM public.exchange_rates
WHERE base_currency = 'BRL' AND quote_currency = 'USD'
ORDER BY captured_at DESC LIMIT 1;
```

### 16.11 Storage buckets (6 dia 1)

- `tenant-logos` (público)
- `tenant-assets` (público — capas de programa, mockups)
- `program-media` (autenticado — vídeos, imagens exercícios)
- `client-uploads` (autenticado — fotos antes/depois, check-in)
- `email-attachments` (autenticado — PDFs)
- `import-uploads` (autenticado — CSV de alunos)

Path: `<tenant_id>/<subfolder>/<filename>`. Policies filtram por `(select public.current_tenant_id())`.

### 16.12 Migrations

- **Exclusivamente via `mcp__supabase__apply_migration`**
- Nome: `YYYYMMDDHHMMSS_<verb_en>.sql`
- Toda migration idempotente (`IF NOT EXISTS`, `CREATE OR REPLACE`)
- Baseline `0001_initial.sql` único dia 1 (todas as tabelas §16.3 + helpers §16.4 + RLS pattern §16.5 + índices §16.6)

### 16.13 Soft delete cascade

Trigger `on_tenant_soft_delete`: marca `deleted_at` em todas tabelas filhas. Job semanal purga registros com `deleted_at < now() - 30 days`.

### 16.14 `schema_version` em `payload jsonb` (versionamento de schema interno)

Toda `payload jsonb` carrega `schema_version int`. Migrations de payload (ex: v1 → v2 de `workout`) rodam:

1. Migration adiciona suporte ao novo version (Zod aceita ambos)
2. Backfill assíncrono em batches (1000/run via cron)
3. Quando 100% migrado, Zod deprecia v1

```ts
export function normalizeComponent(raw: unknown): ComponentPayload {
  const v = (raw as any)?.schema_version ?? 1
  let m: unknown = raw
  if (v < 2) m = migrateV1toV2(raw)
  return ComponentPayload.parse(m)
}
```

### 16.15 Schemas IA (Research B 2026-05)

**`public.ai_prompts` + versions (versionado, active único por key):**

```sql
CREATE TABLE public.ai_prompts (
  id text PRIMARY KEY,                           -- key: 'chatbot.nutrition' | 'vibe.identity.fitness_strength' | ...
  vertical_id text REFERENCES public.verticals(id),  -- nullable se cross-vertical
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.ai_prompt_versions (
  prompt_id text NOT NULL REFERENCES public.ai_prompts(id),
  version int NOT NULL,
  system_message text NOT NULL,
  user_template text NOT NULL,                   -- mustache/handlebars
  examples jsonb NOT NULL DEFAULT '[]'::jsonb,   -- few-shots [{user, assistant}, ...]
  model text NOT NULL,                           -- 'anthropic/claude-haiku-4.5'
  params jsonb NOT NULL DEFAULT '{}'::jsonb,     -- temperature, thinking budget, etc
  schema_ref text,                               -- 'WorkoutDraftSchema' (auditoria; schema fica no código)
  active boolean NOT NULL DEFAULT false,
  rollout_pct int NOT NULL DEFAULT 100 CHECK (rollout_pct BETWEEN 0 AND 100),
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (prompt_id, version)
);

-- 0 ou 1 active por prompt_id (atomicidade no rollback)
CREATE UNIQUE INDEX ai_prompt_active_unique ON public.ai_prompt_versions (prompt_id)
  WHERE active = true;

ALTER TABLE public.ai_prompts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_prompt_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_prompts_read_all       ON public.ai_prompts        FOR SELECT USING (true);
CREATE POLICY ai_prompts_write_admin    ON public.ai_prompts        FOR ALL
  USING ((select public.current_user_role()) = 'admin');
CREATE POLICY ai_prompt_versions_read_all   ON public.ai_prompt_versions FOR SELECT USING (true);
CREATE POLICY ai_prompt_versions_write_admin ON public.ai_prompt_versions FOR ALL
  USING ((select public.current_user_role()) = 'admin');
```

**`public.ai_invocations` (audit log com HASHES, LGPD-friendly):**

```sql
CREATE TABLE public.ai_invocations (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  user_id uuid REFERENCES auth.users(id),
  prompt_key text NOT NULL,
  prompt_version int NOT NULL,
  model text NOT NULL,                           -- 'anthropic/claude-haiku-4.5'
  stage text NOT NULL,                           -- 'chatbot' | 'identity' | 'structure' | 'components' | 'coherence'
  input_hash text NOT NULL,                      -- sha256 (NÃO texto bruto — LGPD)
  output_hash text NOT NULL,
  input_tokens int NOT NULL,
  output_tokens int NOT NULL,
  cache_read_tokens int NOT NULL DEFAULT 0,
  cache_write_tokens int NOT NULL DEFAULT 0,
  cost_usd_cents numeric(10,4) NOT NULL,
  latency_ms int NOT NULL,
  status text NOT NULL,                          -- 'ok' | 'schema_fail' | 'refusal' | 'error'
  error jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ai_invocations_tenant_idx  ON public.ai_invocations (tenant_id, created_at DESC);
CREATE INDEX ai_invocations_prompt_idx  ON public.ai_invocations (prompt_key, prompt_version);

ALTER TABLE public.ai_invocations ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_invocations_tenant_select ON public.ai_invocations
  FOR SELECT TO authenticated
  USING (tenant_id = (select public.current_tenant_id()));
```

**Por que hashes, não texto:** LGPD. Textos brutos (prompts + responses) podem conter PII via aluno. Hashes permitem dedupe + observability ("este prompt já gerou esta saída antes") sem reter PII. Vercel AI Gateway dashboard tem o texto temporário (1h cache) pra debug imediato.

**`public.ai_usage_monthly` (agregado pra `assertBudget`):**

```sql
CREATE TABLE public.ai_usage_monthly (
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  month date NOT NULL,                           -- YYYY-MM-01
  total_cents int NOT NULL DEFAULT 0,
  invocations int NOT NULL DEFAULT 0,
  PRIMARY KEY (tenant_id, month)
);

ALTER TABLE public.ai_usage_monthly ENABLE ROW LEVEL SECURITY;
CREATE POLICY ai_usage_tenant_select ON public.ai_usage_monthly
  FOR SELECT TO authenticated
  USING (tenant_id = (select public.current_tenant_id()));
```

Trigger `on_ai_invocation_insert` incrementa `ai_usage_monthly.total_cents` atomicamente.

**Volume baixo MVP:** persistir 100% dos invocations. Acima de 1M/mês, vai pra sampling 10% + materialized view diária.

### 16.16 `public.kb_exercises` + `public.kb_foods` (sem embeddings dia 1)

**`public.kb_exercises` (free-exercise-db ~870 exercícios, Unlicense):**

```sql
CREATE TABLE public.kb_exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,                          -- 'free-exercise-db' | 'wger' (futuro)
  external_id text NOT NULL,
  name_pt text NOT NULL,                         -- traduzido via batch Haiku no seed
  name_en text NOT NULL,
  body_md text NOT NULL,                         -- instructions
  muscles_primary text[] NOT NULL,
  muscles_secondary text[],
  equipment text,
  level text,                                    -- 'beginner' | 'intermediate' | 'expert'
  category text,
  image_urls text[],
  created_at timestamptz DEFAULT now(),
  UNIQUE(source, external_id)
);

CREATE INDEX kb_exercises_muscles_gin  ON public.kb_exercises USING gin (muscles_primary);
CREATE INDEX kb_exercises_equipment_idx ON public.kb_exercises (equipment);
CREATE INDEX kb_exercises_level_idx     ON public.kb_exercises (level);
```

**Sem coluna `embedding vector(384)`** dia 1. Picker no painel filtra via SQL puro (muscle/equipment/level + ILIKE no nome). Performance suficiente até 10k exercícios.

**Seed:** Edge Function `seed-kb-exercises` baixa `dist/exercises.json` do GitHub free-exercise-db → batch Haiku traduz `instructions` EN→PT-BR → `COPY` direto. Job idempotente via `system_seeds`.

**`public.kb_foods` (TBCA 1900 + TACO 597 = ~2500 alimentos):**

```sql
CREATE TABLE public.kb_foods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,                          -- 'tbca' | 'taco'
  external_id text NOT NULL,
  name_pt text NOT NULL,
  per_100g jsonb NOT NULL,                       -- {kcal, protein_g, carb_g, fat_g, fiber_g, sodium_mg, ...}
  category text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(source, external_id)
);

CREATE INDEX kb_foods_name_trgm  ON public.kb_foods USING gin (name_pt gin_trgm_ops);
CREATE INDEX kb_foods_category_idx ON public.kb_foods (category);
```

**Sem coluna `embedding` dia 1.** Search via `pg_trgm` (similaridade de texto) cobre busca por nome. RAG semântico só entra se chatbot Pacote C atingir volume gargalo (≥100 conv/dia OU custo > R$200/mês).

**Uso pelo chatbot nutricional Pacote C:** TBCA+TACO inteiro no `system` prompt cacheado 1h (~80k tokens, cabe em 200k contexto Haiku 4.5). Cache hit 90%+ na sessão = $0.005/conversa.

**Crédito legal obrigatório** no rodapé do chatbot: _"Dados nutricionais: TBCA (USP/FORC) e TACO (NEPA/UNICAMP)."_

### 16.17 `pgvector` NÃO ativado dia 1 (decisão Research B integrada)

Extensão `vector` **não é instalada** dia 1. Razão: chatbot Pacote C funciona sem RAG (TBCA+TACO no system cacheado). Pipeline vibe coding tb não precisa (componentes gerados zero-shot com schema constrained).

**Gatilho pra instalar `pgvector` + adicionar coluna `embedding vector(384)`:**

- Chatbot Pacote C com ≥100 conversas/dia agregadas, OU
- Custo IA total > R$200/mês, OU
- 1º tenant pedir "busca semântica" em algum lugar (improvável)

Quando entrar: `multilingual-e5-small` 384d em Edge Function Transformers.js (caminho oficial Supabase pra embeddings PT-BR). `Supabase.ai.Session` built-in NÃO serve — `gte-small` é EN-only (§13.15).

### 16.17b `lib/supabase/` estrutura canônica (D-G63 — Research C §8.3)

```
lib/supabase/
├── client.ts         # browser; cookies via @supabase/ssr; usado em 'use client' components
├── server.ts         # 'server-only'; cookies do request; usado em Server Components/Actions
├── admin.ts          # 'server-only'; service-role; SOMENTE Edge Functions + migrations + jobs admin
├── types.gen.ts      # gerado por `supabase gen types`; CI drift check (§29.1)
└── index.ts          # re-exporta SOMENTE client + server (admin NUNCA exportado daqui)
```

**`lib/supabase/admin.ts`** — força server-only:

```ts
import 'server-only' // CONVENÇÃO NEXT.JS: quebra build se importado de Client Component
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types.gen'

export function createAdminClient() {
  return createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false },
  })
}
```

**`lib/supabase/index.ts`** — re-export controlado:

```ts
// NUNCA exporta admin daqui — admin só importa direto via path '@/lib/supabase/admin' nos lugares permitidos
export { createBrowserClient } from './client'
export { createServerClient } from './server'
export type { Database } from './types.gen'
```

**ESLint enforce** (já no §2.3):

```ts
'no-restricted-imports': ['error', {
  patterns: [
    { group: ['@supabase/supabase-js'], message: 'Use lib/supabase/{client,server}. NEVER createClient() directly.' },
    { group: ['@/lib/supabase/admin'],  message: 'Admin client only in supabase/functions/** and supabase/migrations.' },
  ],
}]
```

**Resolve:** parte do refator onboarding-bio (camadas vazadas data ↔ UI). Combina com Sheriff (`side:server` tag).

### 16.18 `desafit.push_messages` + `desafit.email_messages` (audit log de comunicação)

```sql
CREATE TABLE desafit.push_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  recipient_user_id uuid NOT NULL REFERENCES auth.users(id),
  template_key text,                             -- '1_morning_workout' | 'streak_at_risk' | ...
  title text NOT NULL,
  body text NOT NULL,
  deep_link text,
  sent_at timestamptz DEFAULT now(),
  delivery_status text DEFAULT 'pending',        -- 'pending' | 'delivered' | 'failed'
  failure_reason text
);

CREATE INDEX push_messages_tenant_idx     ON desafit.push_messages (tenant_id);
CREATE INDEX push_messages_recipient_idx  ON desafit.push_messages (recipient_user_id, sent_at DESC);

CREATE TABLE desafit.email_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  recipient_email text NOT NULL,
  recipient_user_id uuid REFERENCES auth.users(id),
  template_key text,
  subject text NOT NULL,
  resend_id text,                                -- referência Resend pra tracking
  sent_at timestamptz DEFAULT now(),
  delivery_status text DEFAULT 'pending',
  opened_at timestamptz
);

CREATE INDEX email_messages_tenant_idx ON desafit.email_messages (tenant_id);
```

**RLS:** tenant_id scoped padrão (§16.5). Auditoria pro prof ver histórico de comunicação em `/dashboard/clients/[id]/history`.

```

### 16.19 Migração `onboarding-bio` → `desafit` (análise completa 57 tabelas — 2026-05-17)

Análise tabela por tabela cruzando schema atual do onboarding-bio com schema desafit dia 1. Princípio: **aproveita o que tem consumer real, descarta anti-patterns §32.4, JIT quando consumer existir, arquiva o que tem valor analítico mas não operacional.**

**Resumo global:**

| Veredito | Qtd | % | Significado |
|---|---|---|---|
| ✅ **Verbatim/quase** | 7 | 12% | Migra com mudanças mínimas (rename col, adicionar timestamps soft delete) |
| 🔄 **Adaptada** | 18 | 32% | Estrutura útil, precisa reshape/rename/quebrar/consolidar |
| ⏳ **JIT** | 3 | 5% | Não dia 1; criar quando primeiro consumer existir |
| 🌱 **Arquiva** | 3 | 5% | Não migra; export CSV/JSON pra `docs/_archive/` (valor analítico) |
| ❌ **Descarta** | 26 | 46% | Substituída por JSONB blocks / função pura / TS constant / anti-pattern §32.4 |

**Veredito por tabela (57 itens, agrupados por categoria):**

| # | Tabela | Rows | Veredito | Destino / Razão |
|---|---|---|---|---|
| **AUTH + TENANT (5)** |||||
| 1 | `public.profiles` | 1 | ✅ Verbatim | Confirmar enum `role` tem 5 valores D-G5 |
| 2 | `public.tenants` | 1 | 🔄 Adapta | + `vertical_id`, `default_locale/currency/tz`, `theme_version`, `pixels jsonb`, `gateway_config jsonb`. Move `domain/custom_domain` pra `public.domains` 1:N. Fix NOT NULL sem default |
| 3 | `public.memberships` | 1 | ✅ Quase verbatim | + `updated_at`, `deleted_at`, `invited_at`, `invited_by`, UNIQUE(tenant_id, user_id) |
| 4 | `public.slug_blocklist` | 0 | ✅ Verbatim | Seed inicial: admin/api/app/dashboard/etc |
| 5 | `public.influencers` | 0 | ✅ Quase verbatim | `pix_key text → payout_method jsonb` (Pix BR + Wise/Stripe futuro) |
| **BILLING PLATAFORMA (5)** |||||
| 6 | `onboarding.subscriptions` | 1 | 🔄 Adapta → `public.subscriptions` | cents → minor + currency; gateway enum tipado; + `package enum('A'/'B'/'C'/addons)`, `setup_paid_amount_minor`, `monthly_grace_period_until` |
| 7 | `onboarding.subscription_events` | 0 | ⏳ JIT | Log pino + Edge Function webhook cobre 80%. Criar quando UI "histórico eventos" pedir |
| 8 | `onboarding.cancellation_feedback` | 0 | ❌ Descarta | Form externo + email. Tabela JIT quando 5+ cancelamentos/mês |
| 9 | `onboarding.payment_transactions` | 0 | 🔄 Consolida → `desafit.payments` | Unifica com `client_payments`; `kind enum('platform_to_prof'/'client_to_prof')`; cents → minor; `bank_slip_url → external_payment_url` |
| 10 | `onboarding.webhook_logs` | 0 | ❌ Descarta | Log pino estruturado em Edge Function cobre. JIT se virar gargalo debug |
| **PLANS + CONFIG SYSTEM_* (5)** |||||
| 11 | `onboarding.plan_packages` | 0 | ❌ Descarta | Modelo antigo (PT vende sessões avulsas). Caso 1:1 → `programs.cohort_type='individual'` |
| 12 | `public.system_plan_features` | 0 | ❌ TS constant | `lib/constants/plans.ts` (features dos pacotes A/B/C) |
| 13 | `public.system_plan_pricing` | 0 | ❌ TS constant | `lib/constants/pricing.ts` (Money values) |
| 14 | `public.system_lead_statuses` | 0 | ❌ TS constant + enum SQL | `lib/constants/lead-statuses.ts` |
| 15 | `public.system_bmi_classifications` | 0 | ❌ Função pura | `lib/domain/nutrition.ts.classifyBMI()` |
| **PROMO + AFFILIATE (5)** |||||
| 16 | `public.promotional_codes` | 3 | 🔄 Renomeia → `public.platform_coupons` | Não confundir com `desafit.coupons` (prof→aluno). `discount_value int → discount_type enum + amount_minor` |
| 17 | `onboarding.promotional_code_redemptions` | 0 | ⏳ JIT | Audit de uso. Criar quando 1º cupom redimido OU tela admin pedir |
| 18 | `onboarding.referrals` | 0 | 🔄 Adapta | Rename `tenant_id → tenant_invited_id`. Remove ip/UA (overeng — log pino) |
| 19 | `onboarding.commissions` | 0 | ✅ Quase verbatim | cents → minor |
| 20 | `public.payout_requests` | 0 | ✅ Quase verbatim | `pix_key → payout_method jsonb`, cents → minor |
| **CAPTAÇÃO + FORMS (5)** |||||
| 21 | `onboarding.leads` | 8 | 🔄 Separa em 2 entidades | Lead = prospect. + `email` (falta hoje!). Remove `client_status/since/monthly_value/plan_name` (viram propriedades de enrollment+payments) e `ip_hash/user_agent`. **Export 8 rows pra `_archive/leads.csv`** |
| 22 | `onboarding.intakes` | 0 | ❌ Descarta (vocab `intake` banido) | Substituído por `desafit.capture_forms` + `desafit.capture_submissions` com `answers jsonb` flexível |
| 23 | `onboarding.intake_calculation_archive` | 0 | ❌ Descarta (denormalização premature §32.4) | Função pura `lib/domain/nutrition.ts` calcula sob demanda |
| 24 | `onboarding.prospect_professionals` | 11 | 🌱 Arquiva | Pré-launch diagnostic (pré-pivot). **Export `_archive/prospect_professionals.csv`** |
| 25 | `onboarding.prospect_questions` | 121 | 🌱 Arquiva | Catálogo form pré-launch. **Export `_archive/prospect_questions.json`** |
| **SPECIALTIES + TEMPLATES (4)** |||||
| 26 | `public.specialties` | 33 | 🔄 Adapta — vira tags em `desafit.programs.tags text[]` | 33 rows = seed de tags (categorização). Não tabela. Vertical é abstração superior (D-G28) |
| 27 | `public.specialty_templates` | 33 | 🔄 Renomeia → `public.capture_form_templates` | 33 rows seed valioso. + adicionar `public.program_templates` SEPARADA (nova, ~6 rows seed inicial) |
| 28 | `onboarding.professional_specialties` | 0 | ❌ Descarta | `tenants.vertical_id` single dia 1 (D-G28). N:N JIT futuro |
| 29 | `onboarding.professional_templates` | 2 | 🔄 Adapta → `desafit.tenant_capture_forms` | Conceito tenant ativa template + customiza. Rename vocab. 2 rows aproveitar |
| **PROGRAMS + WORKOUTS (5)** |||||
| 30 | `public.programs` | 0 | 🔄 Adapta + MOVE pra `desafit.programs` | + `vertical_id`, `currency+price_amount_minor`, `enrollment_window jsonb`, `source_template_id`. Rename `cohort_mode→cohort_type`, `sale_model→sale_mode`, `delivery_format→delivery_modality` |
| 31 | `public.enrollments` | 0 | ✅ Quase verbatim + MOVE pra `desafit.enrollments` | + `payment_id`, `completed_at`, `paused_at` |
| 32 | `onboarding.services` | 0 | ❌ Descarta | Modelo antigo. `programs.cohort_type='individual'` + componentes `individual_call` |
| 33 | `onboarding.workout_plans` | 0 | ❌ Descarta | Vira `desafit.components.kind='workout'` |
| 34 | `onboarding.workout_exercises` | 0 | ❌ Descarta — vira JSONB | `desafit.components.payload jsonb` polimórfico (`blocks[].sets[]`). 1 SELECT vs N+1 hoje |
| **CLIENTS + SESSIONS + PAYMENTS (5)** |||||
| 35 | `onboarding.clients` | 0 | ❌ Descarta tabela, aproveita conceito convite | Cliente = `auth.users` + `profiles.role='client'` + `memberships`. Dados tenant-scoped → `desafit.client_profiles`. Convite → cols em `memberships` |
| 36 | `onboarding.client_plans` | 0 | ❌ Descarta | Substituído por `desafit.enrollments` |
| 37 | `onboarding.client_assessments` | 0 | 🔄 Quebra em 2 tabelas + linha-por-métrica | `desafit.progress_metrics(metric_kind, value, unit, captured_at)` (8 medidas viram rows) + `desafit.progress_photos(kind enum)` (3 fotos viram rows). Adicionar medida = INSERT, não ALTER |
| 38 | `onboarding.client_sessions` | 0 | ❌ Substituído por `desafit.component_progress` | `payload jsonb` guarda duration/notas |
| 39 | `onboarding.client_payments` | 0 | 🔄 Consolida → `desafit.payments` | `kind='client_to_prof'` + `enrollment_id` |
| **TRACKING (2)** |||||
| 40 | `onboarding.client_transformations` | 0 | ❌ Descarta — dual system §32.4 | 25 cols pra 1 conceito. Vira bloco `testimonial` em `pages.published_blocks` |
| 41 | `onboarding.professional_customization_history` | 0 | ❌ Descarta — audit generic §32.4 | 0 rows = ninguém precisou. Sentry + log pino cobre |
| **AI (3)** |||||
| 42 | `public.ai_prompts` | 5 | 🔄 Quebra em 2 (versão Research B D-G48) | `ai_prompts` (metadata) + `ai_prompt_versions` (versionamento completo). Rename `system_prompt→system_message`, `output_schema_zod→schema_ref`. + `vertical_id`. 5 rows seed aproveitar |
| 43 | `public.ai_prompt_versions` | 8 | 🔄 Reestrutura | `snapshot jsonb` → cols próprias (queryable). 8 rows audit → `_archive/ai_prompt_versions.jsonl` |
| 44 | `onboarding.ai_generations` | 0 | 🔄 CRÍTICO — substitui → `public.ai_invocations` (LGPD fix D-G48) | Hoje viola LGPD (`input/output jsonb` bruto com PII). Research B: `input_hash + output_hash sha256`. + `stage`, `cache_read/write_tokens`, `status`, PK `bigint generated identity` |
| **COMMS (4)** |||||
| 45 | `onboarding.wa_messages` | 0 | ❌ Descarta (D-G37 sem chat 1:1 + OBA adiado §31.2 #7) | Comunicação SÓ push+email dia 1. `desafit.whatsapp_messages` JIT quando ativar OBA |
| 46 | `public.notification_preferences` | 0 | 🔄 Simplifica — flexível por evento | 13 booleans rígidos → `(user_id, channel enum, event_type text, enabled boolean)`. Novo evento = INSERT, não ALTER |
| 47 | `public.notification_requests` | 0 | 🔄 Aproveita → `desafit.scheduled_jobs` | + `tenant_id`, `scheduled_at`, `retry_count`, `attempts jsonb` |
| 48 | `public.email_drip_schedule` | 0 | ❌ Descarta | `scheduled_jobs` + `email_messages` cobrem |
| **LGPD (2)** |||||
| 49 | `onboarding.consent_logs` | 0 | ❌ Descarta dia 1 — JIT | Cookie consent local + DPA tenant. Tabela quando incidente real exigir |
| 50 | `onboarding.data_subject_requests` | 0 | ❌ Descarta dia 1 — JIT | Email `lgpd@` + processo manual. Tabela quando 5+ DSRs/mês justificar |
| **BRANDING/CONTENT site (5) — todas viram JSONB blocks em `desafit.pages`** |||||
| 51 | `onboarding.testimonials` | 0 | ❌ Bloco `testimonials` em pages | items: {author, role, text, photo_url, rating, source}[] |
| 52 | `onboarding.locations` | 0 | ❌ Propriedade de componente | `components.kind='in_person_class'.payload.address`. Múltiplas locations → bloco `locations` em pages |
| 53 | `onboarding.methodology_pillars` | 0 | ❌ Descarta (vocab banido `pilares`) | Bloco `features` em pages |
| 54 | `onboarding.credentials` | 0 | ❌ Bloco `credentials` em pages | items: {title, issuer, year, description, url}[] |
| 55 | `onboarding.faq_items` | 0 | ❌ Bloco `faq` em pages | items: {q, a}[] (§12.2) |
| **MISC (2)** |||||
| 56 | `onboarding.professionals` | 1 | ❌ TABELA MONSTRO 51 cols — DESMEMBRA em 5 destinos | (a) Identidade pessoal → `auth.users.user_metadata` + `tenants.bio_md`. (b) Branding → `tenants.theme_tokens jsonb` único + `deriveTokens()` (descartar color/font/shape/density_override). (c) White-label → `tenants.app_name/logo_url` + `public.domains`. (d) Landing → `desafit.pages.published_blocks jsonb`. (e) Onboarding state → `tenants.onboarding_state jsonb` (opcional). **Export 1 row pra `_archive/professionals_first.json`** |
| 57 | `public.market_benchmarks` | 6 | 🌱 Arquiva — 27 cols PT viola §2.1 | Dataset analítico pré-pivot. **Export `_archive/market_benchmarks.csv`**. Se IA precisar, embute no `ai_prompt_versions.system_message` |

**8 arquivos `docs/_archive/` a exportar ANTES do drop:**

| Arquivo | Origem | Rows | Por quê |
|---|---|---|---|
| `leads.csv` | `onboarding.leads` | 8 | Migrar ou reanalisar |
| `professionals_first.json` | `onboarding.professionals` | 1 | Você mesmo — auditar antes |
| `prospect_professionals.csv` | pré-launch | 11 | Insight mercado |
| `prospect_questions.json` | pré-launch | 121 | Catálogo perguntas |
| `ai_prompt_versions.jsonl` | audit | 8 | History prompts |
| `market_benchmarks.csv` | dataset PT | 6 | Conteúdo prompt IA |
| `specialty_templates.json` | form templates | 33 | Seed `capture_form_templates` |
| `specialties.csv` | categorias | 33 | Seed `tags` programas |

**Total desafit baseline `0001_initial.sql`: ~54 tabelas**

| Schema | Tabelas |
|---|---|
| `public.*` (cross-cutting, ~22) | profiles, tenants, memberships, slug_blocklist, influencers, subscriptions, domains, verticals, vertical_component_kinds, capture_form_templates, program_templates, page_templates, ai_prompts, ai_prompt_versions, ai_invocations, ai_usage_monthly, kb_exercises, kb_foods, push_subscriptions, currencies, exchange_rates, system_seeds, platform_coupons |
| `desafit.*` (produto, ~32) | programs, modules, components, component_schedules, component_progress, enrollments, cohorts, capture_forms, capture_submissions, leads, pages, page_versions, coupons, payments, payment_methods, progress_metrics, progress_photos, check_ins, chatbot_threads, chatbot_messages, push_messages, email_messages, scheduled_jobs, achievements, badges, workout_logs, import_jobs, client_profiles, tenant_capture_forms, referrals, commissions, notification_preferences |
| + JIT ao longo F1-F9 | subscription_events, promo_redemptions, lgpd_consent_logs, lgpd_data_subject_requests, whatsapp_messages, tenant_theme_changes, program_publish_history, custom_domain_audit (5-10 esperadas) |

**Top 7 ganhos da análise:**

1. **`professionals` 51 cols → desmembrada em 5 destinos** = corte de tabela monstro com 6 conceitos misturados
2. **5 tabelas Branding/Content → JSONB blocks em `pages`** = 5 tabelas rígidas viram 0 (pattern §12)
3. **`workout_plans + workout_exercises` (relacional 24 cols) → 1 `components.payload jsonb` polimórfico** = 1 SELECT vs N+1
4. **`clients` standalone → eliminada** (cliente = `auth.users` + role membership) = remove duplicação
5. **`client_assessments` 18 cols rígidas → 2 tabelas leves linha-por-métrica** = add medida = INSERT (não ALTER)
6. **4 `system_*` tabelas → TS constants + função pura** = §32.4 lição #12 viva (~30h evitadas)
7. **Dual systems `client_transformations + intake_calculation_archive`** → eliminados (anti-pattern §32.4)

**Próximos análises pendentes** (sessão futura):
- Componentes React (`components/**/*.tsx`)
- Hooks (`lib/hooks/**`)
- Data layer (`lib/data/**`)
- Edge Functions (`supabase/functions/**`)
- Server actions (`app/<route>/actions.ts`)
- Páginas e rotas (`app/**/page.tsx`)
- Helpers/utils (`lib/utils/**`)
- Email templates (`lib/email/templates/**`)
- Scripts (`scripts/**`)
- Configs (`*.config.{ts,mjs,json}`)

---

## 17. Onboarding profissional

> **Dois fluxos suportados dia 1** (decisão D-G):
> - **Agência (dia 1):** fundador cria tenant no admin → configura branding/programa/conteúdo → convida prof por email com link de criação de senha → prof cria senha → acessa já configurado
> - **SaaS self-service (fase 2):** signup público (feature flag) com email+senha → wizard 4 telas → AHA <8min
>
> Profissional e aluno ambos usam **login email+senha** dia 1 (D-G36 revisto). Schema suporta ambos os fluxos sem mudança.

### 17.0 Fluxo agência (dia 1)

```

1. Você cria tenant via /admin/tenants/new
   ↓ nome, vertical, slug, default_currency, default_locale
2. Você configura branding em /admin/tenants/[id]/branding
   ↓ logo upload, cor primária picker (APCA-validated)
   ↓ deriveTokens roda → theme_tokens salvos
3. Você cria programa em /dashboard/programs/new (atuando como prof via impersonation)
   ↓ template do catálogo OU programa do zero
   ↓ monta módulos + componentes (manual, livre)
   ↓ sobe vídeos/PDFs
4. Você cria página de vendas custom no schema pages (commit JSON via admin)
5. Você convida prof: /admin/tenants/[id]/invite → email com link `/dashboard/criar-senha?token=X` (válido 7 dias)
6. Prof cria senha → /dashboard (tudo já configurado)
   ↓ first-time tour (5 highlights, dismissable)
7. Prof: edita conteúdo, sobe vídeos próprios, importa alunos via CSV

```

### 17.1 Fluxo SaaS self-service (fase 2 — wizard 4 telas)

Quando feature flag `enable_public_signup` for ON:

```

1. /signup → email + password (signup público)
   ↓ trigger handle_new_user (cria profiles + tenants + memberships atomicamente)
2. /verify-email (Supabase Auth)
3. /setup → 4 telas (AHA <8min):
   Tela 1 — Identidade (60s): nome do app + subdomínio <slug>.desafit.app + cor primária + logo opcional + vertical
   Tela 2 — Modelo de negócio (60s): aluno paga direto ou via plataforma? plano fixo / mensal / único?
   Tela 3 — Gerar primeiro programa com IA (3-5min): wizard vibe coding (§13). AHA MOMENT.
   Tela 4 — Convidar primeiro aluno (60s): email único OU skip
4. /dashboard com checklist persistente sidebar:
   [ ] Programa criado
   [ ] Página pública publicada
   [ ] Primeiro aluno
   [ ] Primeiro check-in recebido
   [ ] App instalado em device de teste

```

**Métricas TTFV (§17.7):**
- TTFV prof: `signup → primeiro programa publicado` — target P50 < 15min, P90 < 1h
- Activation: `signup prof → primeiro aluno completou primeiro componente` — target P50 < 72h

### 17.2 Vibe coding integrado (fase 2 wizard)

- Estágio 1 (identidade) e Estágio 2 (estrutura) rodam em background após signup
- Quando profissional chega no preview, conteúdo já existe
- Profissional revisa, edita, aprova

### 17.3 Materiais necessários (5 dias úteis após assinatura)

Conforme proposta, prof envia:
- Logo em alta resolução (vetorial preferencial — SVG/EPS)
- Paleta de cores ou referências visuais (1 cor primária mínima)
- Textos: bio, descrição do programa, depoimentos
- Conteúdo do programa: vídeos, PDFs, materiais
- Lista de alunos existentes em planilha (se houver — pra migração)
- Credenciais do gateway de pagamento à sua escolha (Pacotes A/C — Asaas/Pagar.me/MP/Stripe BR)

UI em `/setup/materials` com upload + chat com Leandro pra envios assíncronos.

### 17.4 NÃO incluso (proposta — alinhar expectativa)

- Criação do método ou conteúdo do programa
- Criação de identidade visual do zero (logo, paleta) — trabalhamos a partir do que prof já tem
- Produção de conteúdo (gravação de vídeos, sessão de fotos)
- Gestão mensal de tráfego pago (setup é adicional separado)
- Transmissão ao vivo dentro do app (lives via Zoom/Meet/IG/YT, app só notifica)
- Compra e renovação anual de domínio próprio externo (DNS configuramos, compra fica com prof)

### 17.5 Treinamento por videoconferência (Pacotes B/C)

Após entrega do app: 1 sessão 60-90min de treinamento ao vivo (Meet/Zoom) cobrindo:
- Painel administrativo
- Criar/editar programa, módulos, componentes
- Configurar gateway de pagamento
- Push notifications + automações
- Analytics + Pixel

Gravação fica no painel do prof.

### 17.6 Tela "primeiro tour"

Overlay com 5 highlights:
1. "Aqui você gerencia programas"
2. "Aqui você vê os alunos"
3. "Aqui você edita as páginas públicas"
4. "Aqui você customiza o tema"
5. "Botão flutuante: criar novo programa"

Dismiss "Não mostrar mais" + skip.

---

## 18. Onboarding cliente (primeiros 5min no PWA) — login + senha

> **Decisão D-G36 (REVISTO 2026-05-17):** aluno acessa via **login email + senha** dia 1 (Supabase Auth). PWA fitness abre 3-5×/dia — magic link cria fricção inaceitável (esperar email, clicar). Senha é definida no checkout (pós-pagamento) ou no primeiro acesso via convite. Recovery por email padrão.

### 18.1 Fluxo completo (6 passos, AHA <3min)

```

1. Cliente acessa /<slug>/<programa> (link do prof)
2. Preenche capture_form (lead)
3. Vê página de venda → CTA "Quero entrar" → /<slug>/checkout/<programa>
4. Paga (Asaas link externo BR / Stripe internacional)
5. Pós-pagamento: define senha (mesma tela do checkout success) + recebe email "boas-vindas, seu login é X"
   - Alternativa: link `/aluno/criar-senha?token=X` enviado por email (válido 7 dias)
6. Login email+senha → /aluno/inicio (PWA branded do tenant)
   ↓ Onboarding interno:
   a. Boas-vindas: vídeo 30s do prof (gravado uma vez no setup) + CTA "Vamos começar"
   b. Primeiro check-in simbólico (3 sliders — Duolingo first-lesson style)
   c. Tour invisível: 1 tooltip contextual no primeiro componente. Dismissable.
   d. Push pre-prompt SÓ após primeiro check-in + 24h depois (§10.13)
   e. Install custom bottom-sheet após 2ª sessão (§10.12)

````

**Recovery:** fluxo padrão Supabase Auth (`/aluno/esqueci-senha` → email com link `/aluno/reset-senha?token=X` válido 1h).

**Re-login:** "Lembrar de mim" 30 dias via cookie httpOnly (padrão `@supabase/ssr`). Aluno raramente vai re-logar no PWA standalone (sessão persiste).

### 18.2 Primeira tela PWA (`/aluno/inicio`)

Conforme §10.7 e §10.8:
- Header sticky h-14 com logo do tenant + avatar + ícone chat (badge)
- Hero card "Hoje" (45% viewport): thumbnail + eyebrow + título + CTA `h-14 w-full` "Começar"
- Streak h-20: dot calendar 7-day OU donut %
- Próximo evento agendado (live/call/presencial) se houver nos próximos 7d
- Carrossel horizontal cards h-24 com próximos 3 componentes

### 18.3 AHA moment

- **Prof:** ver programa gerado pela IA com seu branding em <8min (fase 2 wizard) OU receber tenant pronto e ver dashboard funcional em primeiro login (fase agência dia 1)
- **Aluno:** completar primeiro check-in OU primeiro componente em <3min do primeiro login

### 18.4 Install banner timing

Conforme §10.12. Disparo: 2ª sessão + primeira ação significativa (check-in completo OU componente completo). Dismiss → 7 dias silenciado.

### 18.5 Push permission timing

Conforme §10.13. Disparo: 3ª sessão + primeiro check-in completo. Pre-prompt custom antes de `Notification.requestPermission()`.

---

## 18b. Métricas TTFV (PostHog)

3 métricas pra trackear desde dia 1:

| Métrica | Definição | Target |
|---|---|---|
| **TTFV prof** | `signup_prof → programa publicado` | P50 <15min, P90 <1h |
| **TTFV aluno** | `convite_recebido → primeiro check-in completo` | P50 <24h |
| **Activation** | `signup_prof → primeiro aluno completou primeiro componente` | P50 <72h |

```ts
import posthog from 'posthog-js'

posthog.capture('professional_signed_up')
posthog.capture('program_published',          { program_id, modules_count })
posthog.capture('student_invited',            { tenant_id, channel })
posthog.capture('first_check_in',             { tenant_id, student_id, fields_filled })
posthog.capture('first_component_completed',  { tenant_id, student_id, component_kind })
````

A/B test em onboarding → fase 2 com PostHog feature flags (precisa volume >100 signups).

---

## 19. Páginas necessárias por tenant

### 19.1 Rotas públicas branded (`/[slug]/*`)

| Rota                            | Tipo             | Blocos JSONB                                   |
| ------------------------------- | ---------------- | ---------------------------------------------- |
| `/[slug]/`                      | landing          | hero, benefits, testimonials, faq, cta, footer |
| `/[slug]/programs/[id]`         | sales            | hero, features, pricing, guarantee, cta        |
| `/[slug]/capture`               | capture form     | form, benefits                                 |
| `/[slug]/assessment/[id]`       | thanks/relatório | relatório IA + CTA checkout                    |
| `/[slug]/checkout/[program_id]` | checkout         | resumo, payment, terms                         |
| `/[slug]/sucesso`               | success          | confirmação, próximos passos, install banner   |
| `/[slug]/sobre`                 | bio              | foto, bio, credenciais                         |
| `/[slug]/faq`                   | faq              | accordion Q&A                                  |
| `/[slug]/depoimentos`           | testimonials     | cards                                          |
| `/[slug]/contato`               | contact          | form email + WhatsApp                          |
| `/[slug]/privacidade`           | policy           | gerado IA com dados tenant                     |
| `/[slug]/termos`                | terms            | gerado IA com dados tenant                     |
| `/[slug]/manifest.webmanifest`  | PWA manifest     | dinâmico                                       |

### 19.2 Rotas cliente (PWA, `/aluno/*`)

| Rota                                   | Função                                  |
| -------------------------------------- | --------------------------------------- |
| `/aluno/dashboard`                     | hero + próximo componente + streak      |
| `/aluno/programs/[id]`                 | timeline de módulos/componentes         |
| `/aluno/programs/[id]/components/[id]` | executar componente                     |
| `/aluno/check-in`                      | form rápido (humor, intensidade, notas) |
| `/aluno/evolution`                     | gráfico peso, fotos antes/depois        |
| `/aluno/materials`                     | PDFs baixáveis                          |
| `/aluno/chat`                          | chat IA nutricional (Pacote C)          |
| `/aluno/profile`                       | dados + edição básica                   |

### 19.3 Rotas profissional (painel `/dashboard/*`)

| Rota                            | Função                                                 |
| ------------------------------- | ------------------------------------------------------ |
| `/dashboard`                    | resumo (MRR, alunos, próximos eventos)                 |
| `/dashboard/programs`           | lista programas (cards)                                |
| `/dashboard/programs/[id]/edit` | editor programa (módulos + componentes drag-drop)      |
| `/dashboard/clients`            | lista alunos (status, programa, ações)                 |
| `/dashboard/clients/[id]`       | ficha individual (histórico, progresso, notas)         |
| `/dashboard/capture`            | analytics (leads, conversão) + responses               |
| `/dashboard/pages`              | editor visual landing/vendas/captação                  |
| `/dashboard/sales`              | transações, reembolsos, cupons                         |
| `/dashboard/emails`             | templates + histórico                                  |
| `/dashboard/automations`        | drips (triggers → ações)                               |
| `/dashboard/appearance`         | tema/branding (paleta, tipografia, shape, density)     |
| `/dashboard/settings`           | conta, domínio, integrações (Meta Pixel, GA4), billing |

### 19.4 Rotas admin plataforma (`/admin/*`)

| Rota                  | Função                                           |
| --------------------- | ------------------------------------------------ |
| `/admin`              | dashboard plataforma (MRR total, signups, churn) |
| `/admin/tenants`      | lista tenants, health check                      |
| `/admin/tenants/[id]` | detalhe tenant (impersonation)                   |
| `/admin/prompts`      | CRUD prompts IA + versionamento                  |
| `/admin/billing`      | logs EFI + Pagar.me, chargebacks                 |
| `/admin/broadcast`    | mensagem in-app pra todos profissionais          |
| `/admin/audit`        | logs de impersonation + ações sensíveis          |

### 19.5 Rotas legais (compartilhadas plataforma)

- `/lgpd` — política LGPD desafit.app
- `/privacy` — privacy plataforma
- `/terms` — termos plataforma
- `/cookies` — política cookies

---

## 20. Painel profissional (UX, navs, layout)

### 20.1 App shell

| Layout    | Desktop                                         | Mobile                                   |
| --------- | ----------------------------------------------- | ---------------------------------------- |
| Sidebar   | Fixa esquerda (240px collapse pra 64px)         | Bottom nav fixo (5 itens)                |
| Header    | Sticky top (search Cmd+K, notificações, avatar) | Sticky com hamburger pra menu secundário |
| Main      | Centro com max-width                            | Full width                               |
| Inspector | Direito opcional (filtros, contexto)            | Não existe                               |

### 20.2 Seções principais (sidebar level 1)

1. Dashboard (resumo)
2. Programas
3. Alunos
4. Captação
5. Páginas
6. Vendas
7. Emails
8. Automações
9. Aparência
10. Configurações

### 20.3 Quick actions globais

- FAB "+ Novo programa" (desktop sticky, mobile fixed bottom-right)
- Search global (Cmd+K / Ctrl+K) — cmdk lib
- Notificações in-app (badge no header → dropdown com lista)

### 20.4 Notificações in-app

- Toast (sonner): feedback de ação
- Bell dropdown: histórico (nova venda, novo aluno, mensagem)
- Push: nova venda, aluno completou programa, cobrança falhou

---

## 21. Controle interno (admin plataforma)

### 21.1 Tenants overview

- Lista paginada com filtros (status, plan, MRR, signup date)
- Health check (último login, último programa publicado, churn risk)
- Bulk actions (suspender, ativar, broadcast)

### 21.2 Prompts IA CRUD

- Lista de prompt_keys com versão ativa
- Editor de prompt com preview antes/depois
- Versionamento automático (trigger snapshot ao update)
- Rollback pra versão anterior
- Dashboard de uso (top 10 mais chamados, custo médio)

### 21.3 Suporte (impersonation)

- Botão "Ver como este profissional" → edge function gera token temporário
- Audit log obrigatório (admin_id, target_tenant_id, action, timestamp, ip_hash)
- Banner "Você está impersonando" durante sessão

### 21.4 Broadcast

- Mensagem in-app pra todos profissionais ou subset filtrado
- Tipos: announcement (banner), notification (push), email

### 21.5 Logs billing

- Transações EFI (mensalidade plataforma)
- Transações Pagar.me (marketplace split)
- Webhooks recebidos
- Disputas / chargebacks
- Dunning (cobranças falhadas)

---

## 22. Captação + Pixel + analytics

### 22.1 Página captação branded

- URL: `/<slug>/capture`
- Branding: cores, fontes, logo, tom (de `tenants.theme_tokens`)
- Form customizável por modalidade (campos definidos por IA conforme `specialty.modality`)

### 22.2 Form customizável por modalidade

Renderização dinâmica baseada em schema Zod em `capture_forms.fields_schema`:

```ts
// musculação
[
  { id: 'name', type: 'text', label: 'Nome' },
  { id: 'whatsapp', type: 'phone', label: 'WhatsApp' },
  { id: 'goal', type: 'enum', label: 'Objetivo', options: ['Emagrecer', 'Hipertrofia', 'Condicionamento'] },
  { id: 'current_weight', type: 'number', label: 'Peso atual (kg)' },
  { id: 'training_experience', type: 'enum', label: 'Experiência', options: ['Iniciante', 'Intermediário', 'Avançado'] },
]

// inglês
[
  { id: 'name', type: 'text', label: 'Nome' },
  { id: 'level', type: 'enum', label: 'Nível atual', options: ['Básico', 'Intermediário', 'Avançado'] },
  { id: 'goal', type: 'text', label: 'Pra que você quer aprender?' },
  { id: 'study_hours_week', type: 'number', label: 'Horas/semana disponíveis' },
]
```

### 22.3 Pixel Meta + GA4 por tenant

Storage em `tenants.pixels jsonb`:

```json
{
  "meta_pixel_id": "...",
  "ga4_measurement_id": "...",
  "meta_access_token": "..." // encrypted, pra CAPI server-side
}
```

UI em `/dashboard/settings/integrations` — tenant cola próprios IDs.

### 22.4 Eventos canônicos (snake_case)

- `page_view`
- `form_start`
- `form_submit`
- `lead_qualified` (após assessment)
- `checkout_initiated`
- `purchase` (com `value` e `currency`)

### 22.5 Meta Conversions API webhook

Edge function `/api/webhooks/pixel-event`:

1. Recebe evento client-side
2. Valida tenant origin
3. Envia pra Meta Graph API com `pixel_id` + `access_token` do tenant
4. Deduplicação via `event_id` único

### 22.6 Cookie consent + LGPD

- Banner consent (banner lib leve) com opt-in granular (analytics, marketing, essencial)
- Storage em cookie `consent_v1`
- Pixel/GA só ativam após consent

---

## 23. Automações (email + push + WhatsApp)

### 23.1 Email drips (Resend + react-email)

| Trigger                     | Template               | Delay                  |
| --------------------------- | ---------------------- | ---------------------- |
| Signup profissional         | welcome-professional   | imediato               |
| Setup completo              | setup-complete         | imediato               |
| Primeira venda              | first-sale-celebration | imediato               |
| 7 dias sem login            | login-reminder         | +7d                    |
| Cliente matriculou          | enrollment-welcome     | imediato (pro cliente) |
| Cliente 3 dias sem check-in | checkin-reminder       | +3d sem activity       |
| Programa concluído          | program-completed      | imediato               |
| Cobrança falhou             | dunning-attempt-1      | +1d                    |

### 23.2 Push notifications (Web Push)

| Evento                   | Destinatário | Mensagem                    |
| ------------------------ | ------------ | --------------------------- |
| Componente liberado      | Cliente      | "Novo treino disponível!"   |
| Streak em risco          | Cliente      | "Faltam 2h pro deadline"    |
| Lembrete check-in        | Cliente      | "Como foi seu treino?"      |
| Nova venda               | Profissional | "🎉 Novo aluno: João"       |
| Cliente completou módulo | Profissional | "João completou o Módulo 1" |

### 23.3 WhatsApp (Meta Cloud API)

- Confirmação de matrícula
- Lembretes de aula/live
- Follow-up pré-lançamento (Hotmart-style)
- Suporte (responder via business inbox)

### 23.4 Follow-ups pré-lançamento (lançamento Hotmart-style)

Timing relativo à data de abertura:

- -14d: aquecimento (conteúdo gratuito)
- -7d: chamada pra lista VIP
- -3d: warmup forte
- -1d: contagem regressiva
- D-0 abertura: notificação principal
- -24h fechamento: scarcity
- -1h fechamento: última hora

### 23.5 Orquestração

- Scheduler: Supabase `pg_cron` + edge function `process-scheduled-jobs`
- Queue: tabela `desafit.scheduled_jobs` (append + consume)
- Retries: exponential backoff (3 tries)
- Deduplicação: event_id único pra evitar duplicate sends

---

## 24. Pagamentos

### 24.1 Modelo em 3 fases (D-G23)

| Fase                                   | Cobrança plataforma → prof                               | Cobrança aluno → prof                                    | Comissão plataforma                           |
| -------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------- |
| **Agência (hoje)**                     | EFI Bank: setup (R$1.5k/3k/4k) + mensalidade (R$100/200) | Cliente paga direto na conta do prof (gateway escolhido) | **Sem taxa** sobre vendas                     |
| **SaaS self-service (futuro próximo)** | EFI Bank: setup + mensalidade (modelo a definir)         | Mesmo (prof configura gateway)                           | Sem taxa ainda OU taxa fixa pequena (decisão) |
| **SaaS marketplace (futuro)**          | Pode reduzir ou zerar mensalidade                        | Pagar.me com split nativo (plataforma intermedia)        | Comissão sobre vendas (% a definir)           |

**Multi-moeda (D-G33):** independente da fase, Stripe internacional disponível dia 1 pra qualquer tenant aceitar USD/EUR/GBP/CAD/AUD. Asaas continua default pra BRL.

### 24.2 EFI Bank — mensalidade da plataforma

- Pix Automático recorrente (Pagamento Recorrente Pix do BC)
- Cartão crédito (parcelamento 10× sem juros)
- Mensalidades conforme proposta:
  - Pacote A: R$ 100/mês a partir do 31º dia
  - Pacotes B/C: R$ 200/mês a partir do 11º mês (10 meses isenção alinhada ao parcelamento)
- Webhook → atualiza `public.subscriptions.status`
- Dunning: retry 3× + email + bloqueio temporário após 30d
- Valores de setup cobrados via EFI:
  - Pacote A: R$ 1.500 (10× R$ 150 sem juros)
  - Pacote B: R$ 3.000 (10× R$ 300)
  - Pacote C: R$ 4.000 (10× R$ 400)
  - Adicionais: R$ 800 / R$ 1.200 / R$ 500 / R$ 300

### 24.3 Gateway do aluno (fase agência + SaaS self-service)

Prof configura próprio gateway. Plataforma **não intermedia**. Valores vão direto pra conta do prof.

**Estratégia MVP — link externo (não adapter completo):**

Cada gateway BR (Asaas, Pagar.me, Mercado Pago) tem **"link de pagamento" pronto** via API. Plataforma cria o link e redireciona — sem implementar checkout próprio (validação cartão, Pix QR, PCI etc).

```
Aluno clica "Comprar" no app
  → Plataforma cria link via API do gateway configurado pelo prof
  → Redirect (ou iframe) pro link
  → Aluno paga lá (UX do próprio gateway, cuida do PCI)
  → Webhook chega na plataforma confirmando
  → Enrollment liberado automaticamente
```

**Por que link externo (não adapter completo):**

- Adicionar gateway novo = ~1 dia (criar link + receber webhook), não meses
- Gateway cuida de compliance/PCI/Pix QR/parcelamento
- Pacote A/C da proposta fala "checkout integrado" — link externo é funcionalmente o mesmo pro aluno
- Adapter completo (checkout 100% embedado) só quando 1º tenant pedir

**Implementação:**

```ts
interface PaymentLinkProvider {
  id: 'asaas' | 'pagar_me' | 'mercado_pago' | 'stripe_br'
  createPaymentLink(input): Promise<{ url: string; gatewayRef: string }>
  handleWebhook(payload): Promise<EnrollmentEvent>
}
```

Tenant cola credenciais em `/dashboard/settings/payment` (encrypted em `tenants.gateway_config jsonb`).

**Ordem de implementação:**

1. **Asaas (BRL)** — dia 1 (API simples, doc PT-BR, Pix R$0,49, onboarding prof <2h, cliente alvo já reconhece marca)
2. **Stripe (USD/EUR/GBP/CAD/AUD)** — **dia 1 também** (D-G33 §15.4). Tenant cola credenciais → habilita aceitar moeda internacional. Necessário pra prof brasileiro vendendo no exterior (caso comum no coaching).
3. **Pagar.me** — quando 1º tenant pedir (split nativo se virar marketplace)
4. **Mercado Pago** — quando 1º tenant pedir
5. **Stripe BR (BRL via Stripe)** — quando aparecer demanda

**Tabela de cobertura:**

| Moeda                   | Gateway default | Outros suportados                       |
| ----------------------- | --------------- | --------------------------------------- |
| BRL                     | Asaas           | Pagar.me, MP, Stripe BR (quando pedido) |
| USD, EUR, GBP, CAD, AUD | Stripe          | —                                       |
| MXN, ARS, CLP           | Stripe ou MP    | avaliar quando pedido                   |

### 24.4 Pagar.me marketplace split (fase SaaS marketplace — futuro)

Quando virar SaaS self-service com taxa: integração Pagar.me split nativo.

- Split nativo profissional/plataforma
- Comissão plataforma (% a definir baseado em volume validado)
- Profissional decide forma de pagamento (PIX, cartão, parcelamento)
- KYC do profissional: API onboarding Pagar.me
- Webhook → `desafit.payment_transactions` log com `gateway = 'pagar_me_marketplace'`

### 24.5 Modelos de venda (proposta)

- **Lançamento** (janela fechada) — `programs.sale_mode = 'launch'` + datas abertura/fechamento
- **Perpétuo** (sempre aberto) — `programs.sale_mode = 'evergreen'`
- **Mensalidade recorrente** — `programs.billing_interval = 'monthly'`
- **Programa gratuito** (isca digital) — `programs.price_cents = 0` + ainda gera enrollment

### 24.6 Cupons (`desafit.coupons`)

- Código, % desconto ou valor fixo
- Limite uso total, limite uso por cliente
- Data expiração
- Aplicável a: programa específico, todos do tenant, todos do programa+tenant
- Aplicado no checkout (qualquer gateway)

### 24.7 Recorrência

- Mensal (default Pix EFI)
- Trimestral (-10%)
- Anual (-20%)
- `programs.billing_interval` enum

### 24.8 Dunning

Plataforma (mensalidade prof): retry 3× + email + bloqueio temporário após 30d.
Cliente: responsabilidade do gateway escolhido pelo prof (Asaas/Pagar.me/MP têm dunning nativo). Plataforma só recebe webhook de status e suspende `enrollment` quando vier "failed_final".

### 24.9 Reembolso (CDC 7 dias digital)

- Auto-aprovado se < 7d (lei CDC). Plataforma chama refund() do gateway adapter
- Após 7d: aprovação manual do prof (UI em `/dashboard/sales/refunds`)

### 24.5 Dunning

```
Pagamento falhou
  ↓ +1d: email "Atualize cartão" + retry automático
  ↓ +3d: email + WhatsApp
  ↓ +7d: bloqueio acesso programa
  ↓ +30d: cancela enrollment
```

### 24.6 Reembolso (CDC 7 dias digital)

- Auto-aprovado se solicitação < 7 dias da compra (lei CDC)
- Manual após: profissional + admin aprovam
- Refund via gateway (EFI ou Pagar.me)

---

## 25. Envs canônicas (`.env.example`)

```bash
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUPABASE_JWT_SECRET=...

# === Auth ===
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...apps.googleusercontent.com
NEXT_PUBLIC_SITE_URL=https://desafit.app

# === Email ===
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@desafit.app

# === Pagamentos da plataforma (EFI cobra prof — env global) ===
EFI_CLIENT_ID=...
EFI_CLIENT_SECRET=...
EFI_WEBHOOK_TOKEN=...
EFI_CERT_PEM=...        # mTLS pra Pix Automático (base64)
EFI_KEY_PEM=...

# === Pagar.me marketplace (fase SaaS marketplace — futuro) ===
NEXT_PUBLIC_PAGAR_ME_PUBLIC_KEY=pk_...
PAGAR_ME_SECRET_KEY=sk_...
PAGAR_ME_RECIPIENT_ID=...

# === Gateways do aluno (fase agência + SaaS self-service) ===
# Cada tenant cola credenciais via UI /dashboard/settings/payment
# Salvos em tenants.gateway_config jsonb (encrypted)
# Plataforma NÃO intermedia nessa fase
# Dia 1: Asaas via link externo (não adapter completo — ver §24.3)
# Sem env global — apenas chaves de teste pra dev local:
# ASAAS_SANDBOX_API_KEY=...

# === Vídeo (Bunny Stream — dia 1) ===
BUNNY_STREAM_API_KEY=...
BUNNY_STREAM_LIBRARY_ID=...
BUNNY_STREAM_CDN_HOSTNAME=...     # cobranded por tenant via player config

# === Custom domain (Cloudflare for SaaS — ADIADO) ===
# Subdomínio wildcard `*.desafit.app` cobre dia 1
# Ativar Cloudflare for SaaS quando 1º tenant pedir custom domain:
# CF_ZONE_ID=...
# CF_API_TOKEN=...

# === WhatsApp Meta Cloud API ===
META_WA_PHONE_NUMBER_ID=...
META_WA_ACCESS_TOKEN=...
META_WA_BUSINESS_ACCOUNT_ID=...
META_WA_VERIFY_TOKEN=...

# === IA (Vercel AI Gateway) ===
AI_GATEWAY_API_KEY=...
ANTHROPIC_API_KEY=...   # fallback direto

# === Web Push ===
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:suporte@desafit.app

# === Vídeo: ver bloco abaixo (Bunny Stream definido) ===

# === Rate limiting ===
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# === Observabilidade ===
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
SENTRY_ORG=...
SENTRY_PROJECT=desafit-app
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# === Cron ===
CRON_SECRET=...

# (Custom domain envs movidos pro bloco "Gateways do aluno" acima — ADIADO)

# === Dev only ===
NODE_ENV=production|development
DEV_AUTH_BYPASS=  # vazio em prod
```

`lib/env.ts` valida via Zod (client vs server separados).

---

## 26. Configs canônicos

| Arquivo                                            | Essencial                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `tsconfig.json`                                    | `strict: true` + 6 flags Research C (D-G58): `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noImplicitReturns`, `verbatimModuleSyntax`. Paths `@/*`, target ES2022, `moduleResolution: bundler`, `isolatedModules`, `skipLibCheck`, `incremental`. **NÃO adicionar** `noPropertyAccessFromIndexSignature` (ruidoso demais — [I]) |
| `eslint.config.mjs`                                | flat config, jsx-a11y strict, token-bypass error, jsx-no-literals error, consistent-type-imports, no-explicit-any error, unicorn/filename-case kebab, no-restricted-syntax (palavras banidas §0.3)                                                                                                                                                                                               |
| `prettier.config.js`                               | + `prettier-plugin-tailwindcss`                                                                                                                                                                                                                                                                                                                                                                  |
| `next.config.ts`                                   | `withNextIntl()` + `withSentryConfig()`, rewrites PT→EN, image remotes Supabase, headers de segurança                                                                                                                                                                                                                                                                                            |
| `vitest.config.ts`                                 | node env, alias `@/`, mock `server-only`                                                                                                                                                                                                                                                                                                                                                         |
| `playwright.config.ts`                             | chromium + iPhone 14 + iPad Mini, baseURL, trace on-first-retry, axe-core integration                                                                                                                                                                                                                                                                                                            |
| `components.json`                                  | shadcn new-york, iconLibrary lucide                                                                                                                                                                                                                                                                                                                                                              |
| `commitlint.config.ts`                             | conventional commits                                                                                                                                                                                                                                                                                                                                                                             |
| `.husky/pre-commit`                                | `lint-staged` (eslint + prettier nos changed)                                                                                                                                                                                                                                                                                                                                                    |
| `.husky/commit-msg`                                | commitlint                                                                                                                                                                                                                                                                                                                                                                                       |
| `.husky/pre-push`                                  | `pnpm tsc --noEmit && pnpm vitest run && pnpm lint --max-warnings 0`                                                                                                                                                                                                                                                                                                                             |
| `.github/workflows/ci.yml`                         | lint + type + test + axe + lighthouse + bundle-budget + build + vrt + deploy preview                                                                                                                                                                                                                                                                                                             |
| `.nvmrc`                                           | `24`                                                                                                                                                                                                                                                                                                                                                                                             |
| `sentry.{client,server,edge}.config.ts`            | DSN, env, sourcemaps                                                                                                                                                                                                                                                                                                                                                                             |
| `instrumentation.ts` + `instrumentation-client.ts` | Sentry hooks                                                                                                                                                                                                                                                                                                                                                                                     |

---

## 27. CLAUDE.md + `.claude/rules/` + hooks + skills + subagents (Research C)

### 27.1 CLAUDE.md raiz — **< 200 linhas** (D-G60)

Research C confirma com 3 fontes oficiais que arquivos inflados fazem o Claude **ignorar** instruções reais (LLMs frontier seguem com confiabilidade ~150-200 instruções, e o system prompt do Claude Code já consome ~50 dessas). Alvo: **≤ 200 linhas**.

Estrutura canônica (WHAT → HOW → conventions → references):

```md
# desafit.app — Project Context for Claude Code

## Stack (canonical, do NOT swap without ADR — see docs/adr/0001-stack.md)

Next 16 (App Router, Turbopack, cacheComponents:true, proxy.ts) · React 19
TypeScript 5.x strict · Tailwind v4 (CSS-first @theme) · shadcn new-york dark-first
Motion 12 (NOT framer-motion) · vaul · @supabase/ssr · Zod 4 + RHF 7 (standard-schema)
next-intl 4 · pnpm 10 (NOT npm/yarn) · Vitest · Playwright

## Vocabulary (single source — ESLint id-denylist enforces)

APPROVED: workout, plan, exercise, client, professional, staff, admin, influencer,
program, module, component, enrollment, capture_form, lead, setup, assessment
BANNED: student, trainer, intake, wizard, prospect, diagnostic, customization,
workspace, reflexao, pilares, aluno, prof, framer-motion

## Commands

pnpm dev / build / typecheck / lint / test / e2e
pnpm db:types — regenerates lib/supabase/types.gen.ts (CI checks drift)
pnpm color:audit / i18n:audit / rls:audit / schema:audit

## Architecture rules (ESLint + Sheriff enforce — see eslint.config.ts)

- Server Component default. 'use client' requires justification.
- All mutations: Server Actions in \*_/\_actions/_.action.ts returning Result<T, AppError>.
- Contracts live in lib/contracts/ (Zod schemas + Result + AppError + adapters).
- NEVER createClient() outside lib/supabase/{client,server,admin}.
- NEVER arbitrary Tailwind values (bg-[#hex]). Add tokens to globals.css @theme.
- NEVER eslint-disable inline. If rule wrong → ADR.
- Multi-tenant: every tenant-scoped table has RLS via (select public.current_tenant_id()).

## Workflow

- Plan Mode (Shift+Tab) MANDATORY for changes > 1 file.
- TaskCreate for any plan with ≥ 3 steps.
- After series of edits: pnpm typecheck && pnpm lint before claiming done.
- Rule of three: do NOT extract util/hook/component before 3rd usage.
- Service layer FORBIDDEN unless owns ≥2 collaborators AND ≥2 callers AND
  encapsulates transaction/policy not fitting single Server Action.

## References (load on demand)

- @docs/core/master-plan.md — full plan (39 sections — read for architecture)
- @docs/adr/INDEX.md — architecture decisions (read before changing patterns)
- @.claude/rules/ — contextual rules (auto-loaded by paths)
- @docs/components/decisions.md — component-level decisions
```

### 27.2 `.claude/rules/*.md` com frontmatter `paths:` (D-G60)

Sem `paths:`, carrega global (gasta contexto). **Com `paths:`, só carrega quando Claude toca arquivo casado** — economia drástica.

| Arquivo                  | `paths:` frontmatter                                                                                                         |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| `abstractions.md`        | `["components/**/*.tsx", "lib/hooks/**/*.ts"]` — primitives custom Heading/Text/Eyebrow/Metric, regras "extrair na 3ª"       |
| `architecture-layers.md` | `["app/**/*", "lib/**/*"]` — §3.1 camadas + Sheriff tags                                                                     |
| `naming.md`              | `["**/*.{ts,tsx,sql}"]` — §2 inteiro (EN code, PT URL via rewrite, kebab-case files)                                         |
| `vocabulary-banido.md`   | `["**/*.{ts,tsx,sql,md}"]` — §0.3 lista 15+ termos                                                                           |
| `schema-separation.md`   | `["supabase/migrations/**/*.sql", "lib/data/**/*.ts", "lib/supabase/**/*.ts"]`                                               |
| `jwt-claims-rls.md`      | `["supabase/migrations/**/*.sql", "lib/supabase/**/*.ts", "lib/data/**/*.ts"]` — §4.3+§16.5 RLS pattern `(select fn())` wrap |
| `migrations.md`          | `["supabase/migrations/**/*.sql"]` — `mcp__supabase__apply_migration` exclusivo                                              |
| `server-actions.md`      | `["**/_actions/**/*.ts"]` — thin adapter pattern §6.3, Result return, naming `*.action.ts`, max-lines 100                    |
| `contracts.md`           | `["lib/contracts/**/*.ts"]` — Zod schemas, Result/AppError, fromRow adapter, standard-schema resolver                        |
| `react-components.md`    | `["components/**/*.tsx", "app/**/*.tsx"]` — RSC default, <300 linhas, tamanhos §3.3                                          |
| `domain-logic.md`        | `["lib/domain/**/*.ts"]` — pura, zero IO, sem React                                                                          |
| `edge-functions.md`      | `["supabase/functions/**/*.ts"]` — Deno, `_shared/`, validação Zod                                                           |
| `design-system.md`       | `["components/ui/**/*.tsx", "app/globals.css"]` — tokens OKLCH §7, primitives §8, shadcn §9                                  |
| `roles.md`               | `["lib/domain/roles.ts", "app/(admin)/**/*", "lib/api/auth.ts"]` — §4.2 (5 valores)                                          |
| `i18n.md`                | `["**/*.tsx", "messages/**/*.json"]` — §15 + zero hardcoded §15.7                                                            |
| `a11y.md`                | `["app/**/*.tsx", "components/**/*.tsx"]` — §14 WCAG 2.2 AA + APCA dual-gate                                                 |
| `pwa.md`                 | `["app/(client)/**/*", "public/sw.js", "app/**/manifest.webmanifest/**"]` — §10                                              |
| `multi-tenant.md`        | `["lib/data/**/*.ts", "lib/supabase/**/*.ts", "supabase/migrations/**/*.sql"]` — §4 + §5 vertical-aware                      |
| `lint-discipline.md`     | `["**/*.{ts,tsx}"]` — zero `eslint-disable` policy + allowlist 2 strings exatas                                              |
| `ai-prompts.md`          | `["app/api/ai/**/*", "lib/ai/**/*"]` — §13 + guardrails §13.12                                                               |

**Total: 20 arquivos** (`.claude/rules/`). Cada um curto (≤ 50 linhas) e específico. Carregamento lazy = zero overhead quando Claude não tá tocando aquele caminho.

### 27.3 Hooks `.claude/hooks/` dia 1 (D-G60 — 3 hooks essenciais)

Hooks rodam por evento lifecycle do Claude Code, controlam via exit code ou JSON output. Endereçam direto as dores do onboarding-bio.

**3 hooks dia 1** (single entry script `hook-router.sh` pra evitar cold-start múltiplo):

```bash
# .claude/settings.json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [{ "type": "command", "command": ".claude/hooks/block-disables.sh" }]
    }],
    "PostToolUse": [{
      "matcher": "Edit|Write|MultiEdit",
      "hooks": [
        { "type": "command", "command": "pnpm exec prettier --write \"$CLAUDE_TOOL_INPUT_FILE_PATH\"" },
        { "type": "command", "command": "pnpm exec eslint --max-warnings 0 \"$CLAUDE_TOOL_INPUT_FILE_PATH\"" }
      ]
    }],
    "UserPromptSubmit": [{
      "hooks": [{ "type": "command", "command": ".claude/hooks/vocab-reminder.sh" }]
    }]
  }
}
```

**`.claude/hooks/block-disables.sh`** (PreToolUse — bloqueia Claude de adicionar `eslint-disable`):

```bash
#!/bin/bash
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')
CONTENT=$(echo "$INPUT" | jq -r '.tool_input.content // .tool_input.new_string // empty')

# Bloqueia novos eslint-disable / ts-ignore / ts-nocheck
if echo "$CONTENT" | grep -qE 'eslint-disable(-next-line)?|@ts-ignore|@ts-nocheck'; then
  echo '{
    "hookSpecificOutput": {
      "hookEventName": "PreToolUse",
      "permissionDecision": "deny",
      "permissionDecisionReason": "eslint-disable / @ts-ignore / @ts-nocheck PROIBIDOS. Se a regra está errada, abra ADR via /adr. Se é caso legítimo (block oficial shadcn / third-party), use allowlist do @eslint-community/eslint-comments/no-use."
    }
  }'
  exit 0
fi
exit 0
```

**`.claude/hooks/vocab-reminder.sh`** (UserPromptSubmit — injeta lembrete a cada prompt):

```bash
#!/bin/bash
echo '{
  "hookSpecificOutput": {
    "additionalContext": "Vocabulary: APPROVED workout/plan/exercise/client/professional/staff/admin/influencer/program/module/component/enrollment/capture_form/lead/setup/assessment. BANNED student/trainer/intake/wizard/prospect/diagnostic/customization/workspace/reflexao/pilares/aluno-em-folder/prof-abrev/framer-motion. Stack: Next 16 + React 19 + Tailwind v4 + shadcn + Motion 12 + Supabase + Zod 4 + pnpm."
  }
}'
```

**Precedência** (Research C): `deny > defer > ask > allow`. PostToolUse rodam paralelo.

**Hooks [I] (incremental, adicionar quando tiver dor real):**

- **`PreToolUse` bloqueia edição em pasta legacy/** — N/A em greenfield
- **`Stop` hook bloqueia conclusão se typecheck quebrar** — adicionar quando feature crítica em curso (`pnpm typecheck --pretty false || block`)
- **`PostToolUse lint-claude-md`** — valida `wc -l CLAUDE.md` < 200 + imports válidos

### 27.4 Slash commands `.claude/commands/*.md` (incremental)

Status oficial: `.claude/commands/` marcado "legacy format"; `.claude/skills/` preferido. Ambos funcionam via `/name`. Pra solo founder, **começar com commands** (auto-invoke de skills é inconsistente — Producttalk.org 2025).

**Dia 1: 2 commands.**

- `/adr "title"` — gera `docs/adr/NNNN-title.md` com template Michael Nygard, numera automaticamente
- `/release-check` — roda typecheck + lint + test + size-limit em paralelo

**[I] depois (cresce orgânico quando ≥ 3 usos do mesmo padrão):**

- `/new-server-action <name>` — scaffold \_actions/<name>.action.ts + schema + teste
- `/audit-disables` — busca novos eslint-disable no diff, exige justificativa
- `/diff-since-plan` — diff em relação ao plano aprovado no início da sessão

### 27.5 Skills `.claude/skills/*` — começar SEM (Research C)

Skills (auto-invocáveis pelo Claude quando description casa com contexto) **não invocam confiavelmente** em todos os casos (consensus batsov.com, producttalk.org). Pra solo founder: **dia 1 zero skills**, observar repetição, mover slash command → skill **só quando ≥ 3 usos** medidos via PreToolUse counter.

Skills candidatas futuras (NÃO criar dia 1):

- `vitest-style` — quando padrão de teste se repetir 3+ vezes
- `tailwind-tokens-only` — quando ESLint não pegar todos casos
- `rhf-zod-form` — quando 3+ forms repetirem padrão idêntico

### 27.6 Subagents `.claude/agents/*` — 1 reviewer só, [I]

Subagents rodam em contexto isolado. Boris Cherny (criador Claude Code, InfoQ Jan 2026) **NÃO customiza** subagents — roda múltiplas sessões paralelas em vez disso. Pra solo founder, custom subagents são opcionais.

**Dia 1: zero subagents custom.** Usar `general-purpose` + `Explore` pra one-off.

**[I] adicionar 1 subagent depois (stack firmar, ~semana 4):**

```yaml
---
name: code-reviewer
description: Reviews diffs for desafit code style, vocabulary, architecture rules, and zero-eslint-disable policy.
tools: Read, Grep, Glob, Bash(pnpm test:*)
model: inherit
permissionMode: plan
maxTurns: 8
---

Review the diff against:
1. CLAUDE.md vocabulary (banned terms)
2. Sheriff boundaries (lib/data não importa app/)
3. lib/contracts/ usage (Result<T, AppError>, not raw throw)
4. Zero eslint-disable inline
5. max-lines 300 / function 60 / complexity 12
6. Server Action pattern (*.action.ts + Result return)
7. RLS pattern (select fn() wrap)

Report issues; do not edit code.
```

**Padrão "builder + reviewer"** (HumanLayer): builder implementa, reviewer roda em contexto fresco antes do merge. Pra solo = "trust but verify" automático.

### 27.7 MCPs dia 1 (D-G60)

3 essenciais (já decididos § anteriores, Research C confirma):

| MCP                                           | Por que                                                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **shadcn** (CLI shadcn expõe MCP 2026)        | Instala/atualiza componentes via prompt, sem comando manual                                 |
| **Supabase** (`supabase/mcp-server-supabase`) | Schema consulta, RLS gen, migrations remoto via `apply_migration`                           |
| **Context7** (Upstash)                        | Resolve docs atualizadas (Next 16, Zod 4, Tailwind v4 — mudanças recentes onde Claude erra) |

**[I] depois:**

- **Playwright MCP** — quando começar e2e
- **Vercel MCP** — após primeiro deploy

**Princípio Research C (Ran the Builder):** "MCPs que só wrappam CLI = preferir skill/script local (mais transparente)."

### 27.8 Plan Mode + TaskCreate — heurísticas (Research C §7.3)

| Situação                                | Ferramenta                                                                                |
| --------------------------------------- | ----------------------------------------------------------------------------------------- |
| 1 arquivo, < 30 linhas                  | Direct edit, sem plan mode                                                                |
| Nova feature, > 2 arquivos              | **Plan Mode (Shift+Tab) obrigatório** + plano salvo em `docs/plans/YYYY-MM-DD-feature.md` |
| Investigar antes de mudar               | Subagent `Explore` (mantém contexto principal limpo)                                      |
| Refactor cross-cutting                  | Plan Mode + worktree separado                                                             |
| Sequência longa repetitiva (≥ 3 passos) | Plan Mode → **TaskCreate** com N subtarefas explícitas                                    |

**`/compact <foco>`** quando contexto encher. **Plan files em `docs/plans/`** versionados em git sobrevivem qualquer compactação.

### 27.9 Worktrees vs checkouts vs direct (Research C §7.4)

- **Mudança trivial (1 arquivo):** direct edit no main checkout
- **Frontend isolado (puro UI):** `claude --worktree feature-x`
- **Backend + DB (Supabase local 1 instância):** **checkouts separados** (Boris Cherny preference) — cada um aponta pra `.env.local` próprio
- **Worktree pra task dependente / trivial:** anti-padrão, overhead > benefício
- `.claude/worktrees/` no `.gitignore` (evita pollution)

### 27.10 Trust but verify (Research C §7.5)

5 camadas combinadas:

1. **Reviewer subagent automático** (depois — quando criado §27.6)
2. **`/diff` antes de cada commit** — leitura humana do diff
3. **PostToolUse hooks rodando typecheck + lint** — feedback determinístico imediato
4. **CI gate full** — última rede (§29.1)
5. **`/compact <foco>` ou nova sessão** quando contexto > 50% — context-rot é real

---

## 28. Skills Claude Code reduzidas (Research C: começar sem, mover incremental)

> **Decisão revista (Research C 2026-05):** dia 1 = ZERO skills custom em `.claude/skills/`. Auto-invoke é inconsistente. Começar com slash commands explícitos + MCPs. Mover slash command → skill apenas quando ≥ 3 usos repetidos medidos via PreToolUse counter.

**Skills disponíveis no harness (não criadas — usar quando útil):**

- `find-skills` — descobrir skills disponíveis no marketplace
- `fewer-permission-prompts` — auto-allowlist comandos seguros
- `init` — bootstrap CLAUDE.md (rodar 1× no F0)
- `ds-check`, `ux-audit`, `security-review`, `simplify` — auditorias sob demanda (não rotina)
- `vercel:deploy`, `vercel:env`, `vercel:status`, `vercel:bootstrap` — deploys quando fluxo Vercel for útil

**Skills custom desafit (CRIAR depois quando padrão repetir 3+):**

- `vitest-style` — quando padrão de teste se repetir
- `tailwind-tokens-only` — quando ESLint não pegar caso novo
- `rhf-zod-form` — quando 3+ forms repetirem padrão

**Em rotina (poucos):**

- `vercel:status` antes de pushes críticos (quando produção)
- `security-review` antes de release (quando 1ª beta)

---

## 29. CI/CD + observabilidade

### 29.1 GitHub Actions `ci.yml` — fail-fast (Research C §4.3)

Ordem **fail-fast** obrigatória: typecheck (segundos) → lint → knip → grep-disables → vitest → size-limit. Cada etapa mais cara que anterior. Falha cedo economiza CI minutes.

```yaml
# .github/workflows/ci.yml
name: ci
on:
  pull_request:
  push: { branches: [main] }

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true                          # cancela PRs antigos no push novo

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile

      # 1. Fast checks first (fail-fast Research C)
      - run: pnpm typecheck                          # tsc --noEmit (~10s)
      - run: pnpm lint                               # eslint . --max-warnings 0 --no-inline-config
      - run: pnpm exec knip --production             # dead code / unused deps (superset depcheck — D-G)

      # 2. Anti eslint-disable safety net (mesmo com hooks + lint --no-inline-config + ESLint rules)
      - name: No new eslint-disable
        run: |
          BASE=${{ github.event.pull_request.base.sha || 'origin/main' }}
          if git diff $BASE...HEAD -- '*.ts' '*.tsx' | grep -E '^\+.*eslint-disable'; then
            echo "❌ Novos eslint-disable detectados. Use ADR via /adr ou allowlist."
            exit 1
          fi

      # 3. Custom audits (já existiam — mantidos)
      - run: pnpm i18n:audit                         # chaves órfãs/faltantes + hardcoded 14 padrões §15.7
      - run: pnpm color:audit                        # APCA dual-gate (§14.4)
      - run: pnpm rls:audit                          # toda tabela com RLS (§16.2)
      - run: pnpm schema:audit                       # toda coluna preço é par amount_minor+currency (§15.4)

      # 4. Unit + contract tests
      - run: pnpm test -- --coverage                 # vitest

  db:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: supabase/setup-cli@v2
        with: { version: latest }
      - run: supabase db start
      - run: supabase db lint --level warning
      - run: supabase test db
      # Drift check tipos gerados (D-G63)
      - name: Generate types from local DB + fail if drifted
        run: |
          supabase gen types typescript --local > lib/supabase/types.gen.ts
          if ! git diff --ignore-space-at-eol --exit-code --quiet lib/supabase/types.gen.ts; then
            echo "❌ types.gen.ts out of date. Run: pnpm db:types && commit."
            git diff lib/supabase/types.gen.ts
            exit 1
          fi

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: pw-${{ hashFiles('pnpm-lock.yaml') }}
      - run: pnpm exec playwright install --with-deps chromium
      - uses: actions/cache@v4                       # cache .next/cache (acelera build subsequente)
        with:
          path: |
            ~/.cache/pnpm
            ${{ github.workspace }}/.next/cache
          key: ${{ runner.os }}-next-${{ hashFiles('pnpm-lock.yaml') }}-${{ hashFiles('**/*.ts','**/*.tsx') }}
          restore-keys: |
            ${{ runner.os }}-next-${{ hashFiles('pnpm-lock.yaml') }}-
      - run: pnpm build
      - run: pnpm e2e                                # playwright test (12 golden paths §29.9)
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: playwright-report, path: playwright-report }

  size:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 10 }
      - uses: actions/setup-node@v4
        with: { node-version: 24, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      # Next 16 removeu per-route bundle stats (catchmetrics.io Jan 2026)
      # size-limit é o substituto com budgets explícitos (D-G64)
      - uses: andresz1/size-limit-action@v2
        with: { github_token: ${{ secrets.GITHUB_TOKEN }}, package_manager: pnpm }

  # JOBS [I] — habilitar via label PR `perf` ou `a11y` (não rodar em todo commit, queima CI minutes)
  perf:
    if: contains(github.event.pull_request.labels.*.name, 'perf')
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm lighthouse-ci                      # thresholds Perf ≥90 / A11y 100 / PWA 100 (§29.5)

  a11y:
    if: contains(github.event.pull_request.labels.*.name, 'a11y')
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - run: pnpm axe:e2e                            # axe-core serious/critical bloqueia

  vrt:
    if: contains(github.event.pull_request.labels.*.name, 'vrt')
    needs: e2e
    runs-on: ubuntu-latest
    steps:
      - run: pnpm playwright test --project=visual-regression
      - uses: actions/upload-artifact@v4
        with: { name: vrt-diff, path: test-results, retention-days: 7 }

  deploy-preview:
    needs: [quality, db, e2e, size]
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --prebuilt
```

**`.size-limit.json` (D-G64 — substitui @next/bundle-analyzer):**

```json
[
  { "name": "First Load JS (root)", "path": ".next/static/chunks/main-*.js", "limit": "90 kB" },
  { "name": "App shell", "path": ".next/static/chunks/app/**/*.js", "limit": "150 kB" },
  { "name": "Vendor", "path": ".next/static/chunks/framework-*.js", "limit": "120 kB" }
]
```

**Por que size-limit substitui `@next/bundle-analyzer`:** Next 16 removeu estatísticas per-route do `next build` (Vercel removeu por imprecisão — catchmetrics.io Jan 2026). Bundle-analyzer ainda existe mas não confiável. size-limit aponta pra `.next/static/chunks/*.js` com budgets explícitos = gate determinístico CI.

### 29.1b Dia 1 mínimo (3 testes — não esperar suíte completa)

Antes de qualquer feature de produto, esses 3 testes existem e CI exige:

1. **Unit Vitest** `lib/contracts/components/**/*.test.ts` — golden parse cases pros 11 component kinds (válidos + inválidos, ambos draft+strict)
2. **E2E Playwright** `e2e/prof/signup-publish.spec.ts` — signup prof + criar programa + publicar
3. **A11y axe** `tests/a11y/aluno-inicio.spec.ts` — zero violations serious/critical em `/aluno/inicio`

### 29.2 Husky hooks + lint-staged (Research C §4.1)

**Setup:**

```bash
pnpm add -D husky lint-staged prettier
pnpm exec husky init
```

**`.husky/pre-commit`:**

```bash
pnpm exec lint-staged
```

**`.husky/commit-msg`:**

```bash
pnpm exec commitlint --edit "$1"
```

**`.husky/pre-push`:**

```bash
pnpm typecheck && pnpm vitest run && pnpm lint --max-warnings 0 --no-inline-config
```

**`package.json`:**

```jsonc
{
  "scripts": {
    "prepare": "husky",
    "typecheck": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0 --no-inline-config",
    "test": "vitest run",
    "e2e": "playwright test",
    "db:types": "supabase gen types typescript --local > lib/supabase/types.gen.ts",
    "db:lint": "supabase db lint --level warning",
    "db:test": "supabase test db",
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

**Pontos importantes (Research C):**

- `--no-inline-config` em `lint-staged` ignora `eslint-disable` em comentários — mesmo se Claude escapar todos hooks/regras anteriores, lint local roda como se não existisse
- `--max-warnings 0` força zero warnings (treat warn as error)
- `bash -c 'pnpm typecheck'` workaround issue lint-staged #825 (lint-staged passa caminhos como args e TS ignora `tsconfig.json` com files explícitos). Custo: ~3-6s extra; aceitável.
- **NÃO meter** no pre-commit: full test suite, e2e, build (vai pra CI)
- **NÃO usar Lefthook** — Husky basta solo (Research C: tempo bruto não é o gargalo)

### 29.3 Sentry (Free dia 1)

**Plan:** Free (5k errors/mês, 30d retention). Sobe pra Team ($26/mês) quando estourar limite OU primeiro bug iPhone difícil de reproduzir sem Session Replay.

3 configs (client/server/edge), sourcemaps upload, `tunnel: '/monitoring'` pra bypass adblockers.

**Gate dia 1:** configurar `before_send` + Spike Protection no SDK pra evitar bug em loop queimando quota em horas.

### 29.4 PostHog

`NEXT_PUBLIC_POSTHOG_KEY` dia 1. Events: `signup_completed`, `setup_completed`, `enrollment_created`, `payment_succeeded`, `program_published`, `check_in_submitted`.

### 29.5 Lighthouse CI

**Thresholds (Next 16 PWA branded com fontes custom + analytics):**

| Categoria      | Mobile                        | Desktop |
| -------------- | ----------------------------- | ------- |
| Performance    | ≥ 90                          | ≥ 95    |
| Accessibility  | **100**                       | **100** |
| Best Practices | ≥ 95                          | ≥ 95    |
| SEO            | 100 (landing) / ≥ 90 (painel) | mesmo   |
| PWA            | **100** em `/aluno/*`         | n/a     |

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/aluno/inicio", "http://localhost:3000/dashboard"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "categories:pwa": ["error", { "minScore": 1 }]
      }
    }
  }
}
```

### 29.6 Logging estruturado (pino)

JSON log em server actions + edge functions com `tenant_id`, `user_id`, `route`, `latency_ms`.

### 29.7 Backup drill

1x/trimestre testa restore Supabase em projeto de staging.

### 29.9 12 golden paths Playwright (E2E críticos)

Organização: `tests/e2e/prof/`, `tests/e2e/aluno/`, `tests/e2e/admin/`. Fixtures auth via `storageState` per role. Paralelo exceto testes que mutam estado global.

| #   | Path                                                                | Cobre                                                             |
| --- | ------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | Prof signup → onboarding → publica programa                         | Wizard 4 telas + AHA                                              |
| 2   | Prof convida aluno → aluno aceita → completa check-in               | Magic link + check-in 3 campos                                    |
| 3   | Aluno login → home → completa workout (3 séries marcadas)           | Execução workout + useOptimistic                                  |
| 4   | Prof envia mensagem → aluno recebe (push mocked)                    | Chat assíncrono + push                                            |
| 5   | Prof edita componente → aluno vê após reload                        | Cache invalidation revalidateTag                                  |
| 6   | Prof customiza tema → app aluno reflete cor nova                    | /api/tenants/[id]/theme.css + revalidateTag + cache bust via ?v=N |
| 7   | Prof adiciona custom domain → DNS verify → live (Vercel SDK mocked) | Domain provisioning                                               |
| 8   | Aluno faz check-in 7 dias → streak badge                            | Cron streak + gamificação                                         |
| 9   | PWA install flow + push subscribe                                   | Install bottom-sheet + push opt-in                                |
| 10  | **RLS isolation**: prof A não vê dados do prof B (auth swap)        | Multi-tenant RLS gate                                             |
| 11  | Stripe webhook → upgrade tier → branding unlock                     | Pagamento + tier features                                         |
| 12  | Editor visual (fase 2): drag bloco → reorder → publish → preview    | Pages draft/published — quando UI entrar                          |

**Visual regression rotas + viewports:**

- `/aluno/inicio` mobile 390×844 (iPhone 15)
- `/aluno/workout/[id]` mobile 390×844
- `/dashboard` desktop 1440×900
- `/dashboard/programa/[id]/edit` desktop 1440×900
- `/[tenant]` landing pública mobile 390×844 + desktop 1440×900

**Tolerância:** 0.1% pixel diff. Ignorar: animações (mask region), datas dinâmicas (freeze tz), avatares user-uploaded (mock).

### 29.7b ADRs leves (`docs/adr/`) — D-G61 (Research C §6.2)

Combate direto às **10 decisões arquiteturais revertidas** do onboarding-bio. Estilo Michael Nygard (mais citado).

**`docs/adr/0000-template.md`:**

```md
# NNNN — <decisão em 1 linha>

- Data: YYYY-MM-DD
- Status: proposed | accepted | superseded by NNNN
- Decisor: Leandro (+ Claude se aplicável)

## Contexto

Por que precisamos decidir agora.

## Decisão

O que faremos. Snippets se útil.

## Consequências

- Bom: ...
- Ruim: ...
- Neutro: ...
- O que fica difícil depois: ...

## Alternativas consideradas

- A: ... — rejeitado porque ...
- B: ... — rejeitado porque ...
```

**`docs/adr/INDEX.md`** — listado por número + status. Referenciado em CLAUDE.md via `@docs/adr/INDEX.md`.

**Slash command `/adr "title"`** gera novo arquivo numerado automaticamente:

```md
---
argument-hint: 'title in quotes'
description: Create new ADR file with template
---

Create docs/adr/NNNN-{kebab-case(title)}.md where NNNN is max(existing NNNN)+1
Fill: Date today, Status proposed, Decisor Leandro.
Stub Contexto/Decisão/Consequências/Alternativas with prompts to fill.
Add line to docs/adr/INDEX.md: "- NNNN — title — proposed"
```

**Política `superseded by`:** quando reverter decisão, **NÃO deletar** ADR antiga — marcar `Status: superseded by NNNN` e criar nova ADR. Custo psicológico de reverter sobe = menos reversões frívolas. Histórico de "por que pensávamos X antes" fica visível.

**ADRs dia 1 obrigatórios (rodar como parte do bootstrap F0):**

- `0001-stack.md` — todas decisões D-G1..D-Gxx em 1 ADR consolidada
- `0002-multi-tenant-rls-pattern.md` — D-G41 `(select fn())` wrap
- `0003-vibe-coding-pipeline-adiado.md` — D-G35 + §39
- `0004-zero-eslint-disable.md` — D-G11 + allowlist 2 strings

### 29.7c Hierarquia fonte da verdade (Research C §6.3)

```
1. Código (testes + tipos)          ← verdade última
2. lib/contracts/*.ts                ← contratos vivos
3. docs/adr/*.md                     ← decisões (imutáveis exceto superseded)
4. .claude/rules/*.md com paths:     ← regras contextuais carregamento lazy
5. CLAUDE.md raiz (< 200 linhas)     ← onboarding + ponteiros, não detalhes
6. README.md                         ← humanos
```

Quanto mais próximo do código, mais autoritativo. Tudo o que duplica nessa lista = candidato a drift. Quando achar duplicação, prefira o nível mais baixo (código) e remova o de cima.

### 29.7d Detectar doc drift (CI) — [I]

```yaml
- name: docs reference real files
  run: |
    grep -roE '@[a-zA-Z0-9_./-]+\.(md|ts|tsx)' CLAUDE.md docs/ .claude/ | \
      awk -F: '{ print $2 }' | sed 's/^@//' | sort -u | \
      while read f; do test -e "$f" || { echo "MISSING ref: $f"; exit 1; }; done
```

### 29.7e Auto-gerador `docs/auto/INDEX.md` — [I]

Script `tools/sync-docs.ts` lista rotas + Server Actions + schemas em `docs/auto/INDEX.md` referenciado por CLAUDE.md via `@docs/auto/INDEX.md`. Rodar em pre-push + CI:

```ts
// tools/sync-docs.ts
import { globby } from 'globby'
import { writeFile } from 'node:fs/promises'

const routes = await globby('app/**/page.tsx')
const actions = await globby('app/**/_actions/*.action.ts')
const schemas = await globby('lib/contracts/**/*.schema.ts')

await writeFile(
  'docs/auto/INDEX.md',
  `# Auto-generated index (do NOT edit by hand)
## Routes\n${routes.map((r) => `- ${r}`).join('\n')}
## Server Actions\n${actions.map((a) => `- ${a}`).join('\n')}
## Contracts (Zod schemas)\n${schemas.map((s) => `- ${s}`).join('\n')}
`,
)
```

CI gate: `pnpm sync-docs && git diff --exit-code docs/auto/`

### 29.7f Renovate restritivo (D-G62 — Research C §5.4)

Combate parte das **10 decisões revertidas**: cada major bump acidental é uma decisão escondida.

**`renovate.json`:**

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["config:recommended", ":dependencyDashboard", ":pinAllExceptPeerDependencies"],
  "rangeStrategy": "pin",
  "packageRules": [
    {
      "matchUpdateTypes": ["major"],
      "enabled": false,
      "addLabels": ["major-blocked"],
      "description": "Major bumps require ADR — see /adr 'bump <pkg> to vN'"
    },
    {
      "matchPackagePatterns": [
        "^next",
        "^react",
        "^@types/react",
        "^tailwindcss",
        "^@supabase",
        "^@ai-sdk"
      ],
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
  "lockFileMaintenance": {
    "enabled": true,
    "schedule": ["before 5am on monday"]
  }
}
```

**`package.json` pin reforço:**

```jsonc
{
  "engines": { "node": ">=24", "pnpm": ">=10" },
  "packageManager": "pnpm@10.x.x",
  "pnpm": {
    "peerDependencyRules": { "allowedVersions": {} },
    "overrides": { "framer-motion": "npm:motion@^12" },
  },
}
```

(Validar `pnpm why framer-motion` antes de aplicar override.)

### 29.7g Doc lifecycle completo (D-G72) — tamanhos + ownership + markers

Onboarding-bio sofreu drift entre CLAUDE.md ↔ decisions.md ↔ schema.md ↔ architecture.md. Causas: hierarquia implícita + sem tamanhos máximos + sem markers de fonte + sem CI audit. Resposta dia 1:

**Tamanhos máximos por tipo de doc:**

| Doc                         | Max linhas | Source of truth                      | Auto-gen?                |
| --------------------------- | ---------- | ------------------------------------ | ------------------------ |
| `CLAUDE.md` raiz            | 200        | Onboarding + ponteiros, não detalhes | Não                      |
| `.claude/rules/*.md`        | 100 cada   | Regra de camada específica           | Não                      |
| `docs/core/architecture.md` | 500        | Decisões de tipo + `lib/contracts/`  | Não                      |
| `docs/core/schema.md`       | —          | `supabase/migrations/`               | **Sim** (de SQL)         |
| `docs/core/api.md`          | —          | `app/**/*.action.ts` + Zod schemas   | **Sim**                  |
| `docs/core/routes.md`       | —          | `app/**/page.tsx`                    | **Sim** (glob)           |
| `docs/adr/NNNN-*.md`        | 1 página   | Append-only Nygard                   | Template                 |
| `docs/roadmap.md`           | 200        | Marco atual + próximo (§33.13)       | Parcial                  |
| `docs/CHANGELOG.md`         | —          | Commits since last release           | **Sim** (release-please) |
| `README.md`                 | 150        | Humanos primeira vez                 | Não                      |

**Auto-gen markers obrigatórios** no topo de todo doc gerado:

```md
<!--
GENERATED FILE — do not edit by hand.
Source: supabase/migrations/*
Regenerate: pnpm docs:gen
-->
```

**CI audit (`pnpm docs:audit`):**

1. Refs em docs apontam pra arquivos existentes (regex `@[path/file.ext]`)
2. Tamanhos batem (CLAUDE.md ≤ 200, rules ≤ 100, architecture ≤ 500, etc)
3. Docs auto-gen sincronizados: `pnpm docs:gen && git diff --exit-code docs/auto/`
4. ADRs seguem template (frontmatter `status`/`date`/`supersedes`)
5. Links markdown internos válidos (`markdown-link-check`)

**ADR append-only com supersedes:**

- Nunca editar ADR existente exceto mudar `status: accepted → superseded by ADR-NNNN`
- Histórico fica legível em ordem cronológica
- `docs/adr/INDEX.md` auto-gerado lista ADRs ativas (status=accepted) separadas das supersedidas

**Hierarquia oficial (refina §29.7c):**

```
1. Código (testes + tipos)                   ← verdade última
2. lib/contracts/*.ts (Zod schemas)          ← runtime + compile
3. supabase/migrations/*.sql                 ← schema canônico
4. docs/adr/*.md                             ← decisões imutáveis (exceto supersedes)
5. .claude/rules/*.md com paths:             ← regras contextuais lazy
6. CLAUDE.md raiz (< 200 linhas)             ← ponteiros + onboarding
7. README.md                                 ← humanos primeira vez
```

Drift = duplicação entre níveis. Achou duplicação? Prefere nível mais baixo (código), remove de cima.

**Memória Claude zerada no repo novo (D-G73):** working dir novo = pasta `~/.claude/projects/<encoded>/memory/` nova automática. Migra SOMENTE `docs/core/decisions.md` consolidado (sem dizer "antes era X"). Memory files individuais (logs de sessão) ficam pra trás. Projeto fresco, sem herança "onboarding-bio".

### 29.8 Tiers Free dia 1 + gatilhos de upgrade

Estratégia: rodar tudo no Free tier dos providers, subir só quando estourar limite quantificado.

| Provider                | Plano dia 1   | Limite Free                                            | Gatilho upgrade                                                         | Custo upgrade     |
| ----------------------- | ------------- | ------------------------------------------------------ | ----------------------------------------------------------------------- | ----------------- |
| **Sentry**              | Free          | 5k errors/mês, 30d retention                           | Estourou 5k OU precisa Session Replay útil                              | Team $26/mês      |
| **Vercel**              | Hobby         | 100GB bandwidth/mês, sem features comerciais avançadas | Estourou bandwidth OU precisa Edge Config/Image Optim/proteção de senha | Pro $20/mês       |
| **Supabase**            | Free          | 500MB DB, 1GB storage, 2GB bw, 50k MAU                 | Estourou DB/storage/MAU OU precisa PITR                                 | Pro $25/mês       |
| **Resend**              | Free          | 3k emails/mês                                          | Estourou 3k                                                             | Pro $20/mês (50k) |
| **Bunny Stream**        | Pay-as-you-go | —                                                      | sempre PAYG (~$10-15/mês 10 tenants)                                    | —                 |
| **Vercel AI Gateway**   | Free wrapper  | $5 crédito/30d                                         | sempre PAYG (zero markup vs Anthropic direto)                           | —                 |
| **Cloudflare for SaaS** | Não ativar    | —                                                      | 1º tenant pedindo custom domain                                         | $0 (100 grátis)   |

**Custo total mensal MVP 10 tenants:** ~$25-60 USD (~R$ 125-300/mês). Receita 10 tenants × R$100-200 mensalidade = R$ 1.500-2.000/mês. Cobre infra com folga.

**Princípio:** roda no Free até estourar limite quantificado, não antes.

---

## 30. Bibliotecas/deps aproveitáveis vs do zero

### 30.1 Dependências NPM — copiar lista pinada do onboarding atual

**Aproveitáveis verbatim** (testadas em produção, sem vocabulário legado):

```json
{
  "@dnd-kit/core": "^6.3.1",
  "@dnd-kit/sortable": "^10.0.0",
  "@dnd-kit/utilities": "^3.2.2",
  "@hookform/resolvers": "^5.2.2",
  "@react-email/components": "^1.0.12",
  "@react-email/render": "^2.0.7",
  "@react-pdf/renderer": "^4.5.1",
  "@sentry/nextjs": "^10.48.0",
  "@supabase/ssr": "^0.10.2",
  "@supabase/supabase-js": "^2.103.0",
  "@tanstack/react-table": "^8.21.3",
  "@upstash/ratelimit": "^2.0.8",
  "@upstash/redis": "^1.37.0",
  "@vercel/analytics": "^2.0.1",
  "@vercel/speed-insights": "^2.0.0",
  "apca-w3": "^0.1.9",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "cmdk": "^1.1.1",
  "culori": "^4.0.2",
  "date-fns": "^4.1.0",
  "embla-carousel-react": "^8.6.0",
  "geist": "^1.7.0",
  "input-otp": "^1.4.2",
  "libphonenumber-js": "^1.12.41",
  "lucide-react": "^1.8.0",
  "motion": "^12.38.0",
  "next": "16.2.3",
  "next-intl": "^4.9.1",
  "nuqs": "^2.8.9",
  "radix-ui": "^1.4.3",
  "react": "19.2.5",
  "react-day-picker": "^9.14.0",
  "react-dom": "19.2.5",
  "react-easy-crop": "^5.5.7",
  "react-hook-form": "^7.72.1",
  "react-resizable-panels": "^4",
  "recharts": "3.8.0",
  "resend": "^6.11.0",
  "sonner": "^2.0.7",
  "tailwind-merge": "^3.5.0",
  "use-debounce": "^10.1.1",
  "vaul": "^1.1.2",
  "zod": "^4.3.6"
}
```

**Dev deps aproveitáveis:**

```json
{
  "@commitlint/cli": "^20.5.2",
  "@commitlint/config-conventional": "^20.5.0",
  "@ladle/react": "^5.1.1",
  "@next/bundle-analyzer": "^16.2.4",
  "@playwright/test": "^1.59.1",
  "@tailwindcss/postcss": "^4.2.2",
  "@types/culori": "^4.0.1",
  "@vitest/ui": "^4.1.4",
  "eslint": "^9",
  "eslint-config-next": "16.2.3",
  "eslint-plugin-jsx-a11y": "^6.10.2",
  "eslint-plugin-simple-import-sort": "^13.0.0",
  "eslint-plugin-unused-imports": "^4.4.1",
  "husky": "^9.1.7",
  "knip": "^6.10.0",
  "lint-staged": "^16.4.0",
  "prettier": "^3.8.3",
  "prettier-plugin-tailwindcss": "^0.8.0",
  "react-email": "^4.0.9",
  "supabase": "^2.90.0",
  "tailwindcss": "^4.2.2",
  "tsx": "^4.21.0",
  "typescript": "^5",
  "vitest": "^4.1.4"
}
```

**Adicionar pro desafit (não estão no atual):**

```json
{
  "@axe-core/playwright": "^4.x", // a11y E2E
  "@bjornlu/colorblind": "^x", // CVD test paletas
  "@serwist/next": "^9.x", // PWA service worker
  "@serwist/precaching": "^9.x",
  "ai": "^x", // Vercel AI SDK
  "@ai-sdk/anthropic": "^x", // fallback direto
  "pino": "^9.x", // structured logs
  "pino-pretty": "^11.x"
}
```

### 30.2 Helpers/código aproveitável (copiar SEM sujeira legada)

**Verbatim (puro):**

| Onde no atual                                                                   | Pra onde no desafit                                                        | Por quê                                                                                     |
| ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `lib/api/result.ts` (se existir) ou pattern                                     | `lib/contracts/result.ts` + `lib/contracts/errors.ts`                      | `Result<T, AppError>` discriminated union (Research C — substitui `ActionResult<T>` antigo) |
| `lib/hooks/useServerAction.ts`                                                  | `lib/hooks/use-server-action.ts`                                           | `useTransition` + tratamento erro                                                           |
| `lib/hooks/useDebounce.ts`                                                      | `lib/hooks/use-debounce.ts`                                                | Wrapper de use-debounce                                                                     |
| `lib/hooks/useUnsavedChanges.ts`                                                | `lib/hooks/use-unsaved-changes.ts`                                         | Form state tracking                                                                         |
| `lib/hooks/useFocusNotObscured.ts`                                              | `lib/hooks/use-focus-not-obscured.ts`                                      | A11y utility                                                                                |
| Padrão de `CopyButton` + `useCopy`                                              | `components/ui/copy-button.tsx`                                            | Clipboard com feedback                                                                      |
| Padrão de `FormModal`                                                           | `components/ui/form-modal.tsx`                                             | Dialog + form + submit                                                                      |
| Padrão de `CrudManager`                                                         | `components/ui/crud-manager.tsx`                                           | Lista + CRUD modal                                                                          |
| Padrão Edge Function WhatsApp Cloud API                                         | `supabase/functions/send-whatsapp/`                                        | Migração 2026-04-29, código limpo                                                           |
| Padrão Edge Function Resend wrapper                                             | `supabase/functions/send-email/`                                           | Funciona                                                                                    |
| Padrão RPC `SECURITY DEFINER` + `REVOKE/GRANT` + `SET search_path`              | template em `docs/core/rpc-template.sql`                                   | Template ouro                                                                               |
| Padrão RLS via JWT direto                                                       | template em `docs/core/rls-template.sql`                                   | D114s pattern                                                                               |
| `app/globals.css @theme` tokens + `app/(preview/)paletas/page.tsx` (13 paletas) | **migrar verbatim** — sistema OKLCH excelente + 13 presets curados (D-G76) | Trabalho já validado visualmente                                                            |
| `lib/design/contrast.ts` (APCA helpers)                                         | `lib/design/contrast.ts`                                                   | APCA validation pronta                                                                      |
| Scripts audit (`scripts/audit-*`)                                               | `scripts/audit-*.ts`                                                       | Lighthouse, WCAG, metrics                                                                   |

**Adaptar (renomear + limpar vocabulário):**

| Atual (com vocabulário legado)                             | Desafit (limpo)                                    |
| ---------------------------------------------------------- | -------------------------------------------------- |
| `components/wizard/*`                                      | `components/setup/*`                               |
| `lib/data/intake.ts`                                       | `lib/data/capture-forms.ts`                        |
| `lib/data/lead.ts`                                         | `lib/data/leads.ts` (manter "lead", já é canônico) |
| `lib/data/professional-design.ts`                          | `lib/data/tenant-theme.ts`                         |
| `lib/data/prospect.ts`                                     | `lib/data/leads.ts` (consolidar)                   |
| `lib/data/client-assessment.ts` (parte com vocabulário ok) | `lib/data/assessments.ts` (sem "intake")           |
| Componentes `<IntakeForm>` etc                             | `<CaptureForm>`                                    |
| Routes `/diagnostico/*`                                    | `/assessment/*` (PT na URL via rewrite)            |

**NÃO levar (sujeira legada):**

- Tudo de `lib/data/specialty-template.ts` (595 LOC monstro)
- `lib/data/intake-calculation.ts` (acoplado a `intake`)
- `lib/data/bmi-classification.ts` (config = TS constants, não DB)
- `lib/data/cancellation-feedback.ts`, `dsr.ts`, `consent.ts` (overengineering)
- Components `_wizard/*`, `_intake/*`
- Schema `onboarding.*` inteiro
- 4 tabelas `system_*` (BMI, lead status, plan features, pricing) — virar TS constants
- Tabela `professional_customization_history` (audit log sem consumidor)
- Tabelas `analise_*` (dual system normalizado vs JSONB)

### 30.3 Scripts úteis (copiar + adaptar)

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "ladle": "ladle serve",
    "ladle:build": "ladle build",
    "prepare": "husky",
    "email:preview": "email dev --dir lib/email/templates",
    "metrics:audit": "tsx scripts/metrics-audit.ts",
    "metrics:check": "tsx scripts/metrics-audit.ts --check",
    "i18n:audit": "tsx scripts/i18n-audit.ts",
    "color:audit": "tsx scripts/color-audit.ts",
    "rls:audit": "tsx scripts/rls-audit.ts",
    "axe:e2e": "playwright test e2e/a11y/",
    "lighthouse-ci": "lhci autorun",
    "bundle-budget": "tsx scripts/bundle-budget.ts",
    "playwright:baseline": "playwright test e2e/baseline.spec.ts --project=chromium",
    "type-check": "tsc --noEmit"
  }
}
```

### 30.4 Princípio: copiar SEMPRE com checklist anti-sujeira

Antes de copiar qualquer arquivo do onboarding:

1. Tem identificador na lista banida §0.3? → renomeia ou rejeita
2. Importa de `onboarding.*` schema? → rejeita
3. Depende de tabela legada? → reescrever
4. Tem `eslint-disable`? → resolver (criar primitive) antes de copiar
5. > 300 linhas? → quebrar antes de copiar
6. Sem teste? → adicionar teste antes de copiar

---

## 31. Gaps Day 1 + decisões abertas

### 31.1 Gaps que o atual NÃO tem e o desafit precisa

| #   | Gap                                              | Solução dia 1                                                                                              |
| --- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| 1   | Zero E2E tests                                   | Playwright golden paths: signup → setup → criar programa → enroll cliente → executar componente → check-in |
| 2   | Zero axe-core E2E                                | `@axe-core/playwright` em todas páginas chave                                                              |
| 3   | Zero Lighthouse CI gate                          | `treosh/lighthouse-ci-action`, PWA=100, Perf≥90                                                            |
| 4   | Zero bundle budget                               | `@next/bundle-analyzer` + CI falha se chunk > 200kb                                                        |
| 5   | Storybook/Ladle cobertura 50% no atual           | Meta dia 1: 100% primitives + 50% blocks                                                                   |
| 6   | Sem rate limiting em /api e edge functions       | Upstash Redis sliding window em todas routes públicas                                                      |
| 7   | Sem WAF/DDoS                                     | Cloudflare proxy (orange cloud) na frente da Vercel                                                        |
| 8   | Sem LGPD audit script                            | Script lista tabelas com PII + verifica `deleted_at` policy                                                |
| 9   | Sem Dependabot                                   | Ativar GitHub Dependabot Free dia 1                                                                        |
| 10  | Sem admin impersonation                          | Edge function `impersonate-tenant` + audit log                                                             |
| 11  | Sem `<main>` em layouts                          | Layout root tem `<main id="main">` obrigatório                                                             |
| 12  | Sem skip link                                    | Layout root tem `<a className="sr-only focus:not-sr-only">`                                                |
| 13  | Sem ICU MessageFormat                            | next-intl ICU configurado, exemplo em messages                                                             |
| 14  | Sem `lib/domain/roles.ts` (espalhados)           | Fonte única dia 1                                                                                          |
| 15  | Sem helper `ok()/fail()` + sem `AppError` tipado | `lib/contracts/result.ts` + `lib/contracts/errors.ts` dia 1 (Result<T, AppError>)                          |
| 16  | Sem custom domain por tenant                     | Cloudflare for SaaS (Fase 2 — decisão pendente)                                                            |
| 17  | Sem hospedagem vídeo                             | Mux ou Bunny (decisão pendente)                                                                            |
| 18  | Service Worker zero                              | Serwist dia 1                                                                                              |
| 19  | Web Push zero                                    | Vapid keys + endpoint subscribe dia 1                                                                      |
| 20  | Vercel AI Gateway zero                           | Configurar dia 1 (failover + observabilidade IA)                                                           |
| 21  | Sem CVD test paletas                             | `@bjornlu/colorblind` + ΔE ≥ 12 em CI                                                                      |
| 22  | Sem `prefers-contrast: more` layer               | Tokens alternativos pra cores semânticas                                                                   |

### 31.2 Decisões resolvidas (pesquisas 2026-05-16 + sessão integração)

| #         | Decisão                                                                    | Resolução                                                                                                                                                                                                                                                                                                                                                                                                                             | Referência           |
| --------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| 1         | Hospedagem vídeo                                                           | **Bunny Stream** (PoP SP, ~$10-15/mês 10 tenants, 50% mais barato que Cloudflare, 3× mais barato que Mux, branding customizável)                                                                                                                                                                                                                                                                                                      | §10.4c, §25, §29.8   |
| 2         | AI Gateway                                                                 | **Vercel AI Gateway** (zero markup confirmado, failover Anthropic→Bedrock→Vertex automático, dashboard observability)                                                                                                                                                                                                                                                                                                                 | §13, §25             |
| 3         | Custom domain MVP                                                          | **Adiado** — subdomínio wildcard `*.desafit.app` dia 1. Ativar Cloudflare for SaaS quando 1º tenant pedir (upsell Pacote B/C)                                                                                                                                                                                                                                                                                                         | §10, §25             |
| 4         | Cloudflare for SaaS                                                        | Adiado junto com #3. 100 hostnames grátis + $0.10/extra, 50k limit (2025), WAF/DDoS grátis no PAYG                                                                                                                                                                                                                                                                                                                                    | §25                  |
| 5         | Vapid keys Web Push                                                        | **1 par por tenant** dia 1 (RFC 8292 alignment, evita migration painful, custo $0)                                                                                                                                                                                                                                                                                                                                                    | §10.4b               |
| 6         | Gateway aluno dia 1                                                        | **Asaas (BRL) via link externo + Stripe (USD/EUR/GBP/CAD/AUD)** ambos dia 1. Pagar.me/MP entram conforme demanda                                                                                                                                                                                                                                                                                                                      | §24.3                |
| 7         | OBA WhatsApp                                                               | **Adiado** — esperar +5 tenants. WhatsApp só pra profissional (aluno = push notification PWA cobre 100%)                                                                                                                                                                                                                                                                                                                              | §23                  |
| 8         | Sentry plan                                                                | **Free dia 1**. Upgrade Team ($26) só quando estourar 5k errors OU precisar Session Replay                                                                                                                                                                                                                                                                                                                                            | §29.3, §29.8         |
| 9         | VRT                                                                        | **Adiado** — implementa em produção depois. Sem Docker no MVP                                                                                                                                                                                                                                                                                                                                                                         | §29.8                |
| 10        | Locale switcher EN                                                         | **Adiado** — espelho mantido. Ativar quando 3+ leads EN qualificados em 30d OU 1º cliente pagante EN. ES antes de PT-PT                                                                                                                                                                                                                                                                                                               | §15                  |
| **D-G28** | Vertical-aware schema                                                      | **Dia 1**. Tabelas `verticals` + `vertical_component_kinds` + enum `component_kind` estendido (universais + fitness-specific + reservados outras verticals). UI filtra por mapping. Impossível mostrar `workout` pra prof de inglês.                                                                                                                                                                                                  | §5, §16.3            |
| **D-G29** | 5 tabs do PWA aluno                                                        | **Início / Programa / Agenda / Chatbot / Perfil**. Chat 1:1 = top-bar ícone com badge unread. Comunidade/grupos cohort = aba contextual em Programa quando `cohort_type='live'`.                                                                                                                                                                                                                                                      | §10.7                |
| **D-G30** | Cache Components Next 16                                                   | **ON dia 1**. `cacheComponents: true` + `'use cache'` + `cacheLife()` + `cacheTag()`. PPR automático sob isso.                                                                                                                                                                                                                                                                                                                        | §1.4                 |
| **D-G31** | proxy.ts (não middleware.ts)                                               | **Dia 1**. Único arquivo edge. Resolve tenant_id por hostname e rewrite. Resto Node.                                                                                                                                                                                                                                                                                                                                                  | §1.4                 |
| **D-G32** | React Compiler 1.0 ON                                                      | **Dia 1**. Estável React 19.                                                                                                                                                                                                                                                                                                                                                                                                          | §1.4                 |
| **D-G33** | i18n 4 locales + multi-moeda + Stripe internacional                        | **Dia 1**. `pt-BR/en-US/pt-PT/es-ES`. `Money` value object (amount_minor + currency ISO 4217). Stripe pra USD/EUR/GBP/CAD/AUD via `payment_methods.gateway_config jsonb`. Asaas continua default BRL.                                                                                                                                                                                                                                 | §15, §24.3           |
| **D-G34** | Branding scope por pacote                                                  | Tabela A/B/C explícita (cor, fonte, custom domain, email from, push branded, footer).                                                                                                                                                                                                                                                                                                                                                 | §7.8                 |
| **D-G35** | Princípio operacional schema-completo-UI-por-cliente (REVISTO 2026-05-17)  | **Schema completo dia 1**. **Ideal:** cada feature entra com sua UI/ferramenta junto. **Exceção:** se cronograma apertar, fundador opera manual pro 1º cliente — UI vira sprint imediato antes do 2º cliente entrar. Adiamentos pra 3º+ cliente registram em ADR.                                                                                                                                                                     | §39                  |
| **D-G36** | Login + senha pra aluno (REVISTO 2026-05-17)                               | **Dia 1**. Aluno acessa PWA 3-5×/dia — magic link cria fricção inaceitável (esperar email, abrir, clicar). Login email+senha tradicional. Senha definida no checkout ou primeiro acesso. Recovery por email. Profissional tb tem login+senha.                                                                                                                                                                                         | §18                  |
| **D-G37** | Comunicação prof↔aluno só push + email (REVISTO 2026-05-17)                | **Dia 1**. Sem chat 1:1 in-app. Prof se comunica com aluno via push (Web Push branded) + email (Resend domain custom Pacote B/C). `component_kind='message'` continua existindo mas é CONTEÚDO DE PROGRAMA (mensagem motivacional no roteiro do dia X), não conversa. Chatbot do PWA é com IA (Pacote C), não com prof. Tabela `desafit.messages` REMOVIDA. Ícone chat top-bar PWA REMOVIDO.                                          | §10.7, §16, §23      |
| **D-G38** | Cohorts evergreen + live                                                   | **Ambos dia 1**. `programs.cohort_type enum('evergreen','live')`. Destravamento por `day_offset` ou `unlock_at` baseado nisso.                                                                                                                                                                                                                                                                                                        | §16.3                |
| **D-G39** | Templates oficiais via clone independente                                  | **Dia 1**. `public.specialty_templates` + `programs.source_template_id`. Clone é cópia autônoma — atualizar template não toca clones. Mesmo padrão pra `page_templates`.                                                                                                                                                                                                                                                              | §5.7, §16.8          |
| **D-G40** | Tenant criado pelo admin (agência) + signup público feature-flagged        | **Ambos schemas suportam dia 1**. Fluxo agência: fundador cria → convida prof por magic link. Fluxo SaaS: signup público abre por flag `enable_public_signup`.                                                                                                                                                                                                                                                                        | §17.0, §17.1         |
| **D-G41** | RLS pattern canônico `(select fn())` wrap                                  | **Dia 1**. `current_tenant_id()` + `current_user_role()` STABLE. Wrap escala 100× em tabelas grandes. CI bloqueia uso de `auth.jwt()->>'tenant_id'` direto.                                                                                                                                                                                                                                                                           | §16.4, §16.5         |
| **D-G42** | Promovidos pra dia 1 (research)                                            | Geração IA capa programa, multi-modal input vibe coding (PDF→estrutura), pull-to-refresh, long-press menu — **NÃO**, todos esses ficam **adiados** sob D-G35 (fundador faz manual; UI vem quando tenant pedir)                                                                                                                                                                                                                        | §31.3                |
| **D-G43** | Modelos IA pinados                                                         | **Sonnet 4.6** (identidade/estrutura) + **Haiku 4.5** (componentes/coerência/chatbot/pre-screen). Não trocar sem ADR. Provider único Vercel AI Gateway (zero markup, failover Anthropic→Bedrock→Vertex).                                                                                                                                                                                                                              | §13.0, §13.4         |
| **D-G44** | JSON Outputs Anthropic GA + 2-schema pattern                               | **Dia 1.** `output_config.format` via `structuredOutputMode: 'outputFormat'`. Todo `payload jsonb` gerado por IA tem par draft (sem `.min/.max/.regex` pro LLM) + strict (com constraints pro banco/UI).                                                                                                                                                                                                                              | §13.9                |
| **D-G45** | Prompt caching ephemeral                                                   | **Dia 1.** TTL 1h em chatbot Pacote C e pipeline COMPONENTES (sessão prof 30-50min). 5min nos outros. Reduz custo ~90% em cache hit.                                                                                                                                                                                                                                                                                                  | §13.10               |
| **D-G46** | Extended thinking só na ESTRUTURA                                          | **Dia 1.** Sonnet 4.6 com `thinking: adaptive` effort medium budget ~4-8k. Outros estágios zero-shot. Latência +3-15s aceita só onde ganho de coerência é alto.                                                                                                                                                                                                                                                                       | §13.0, §13.4         |
| **D-G47** | Guardrails IA dia 1                                                        | **Dia 1 chatbot Pacote C.** XML wrap `<tenant_input>`, pre-screen Haiku $0.0002/req, LLM judge na coerência (pipeline), system explícito "nunca diagnostica/prescreve", PII placeholder `maskAluno()` antes do prompt + `rehydrate()` no front.                                                                                                                                                                                       | §13.12               |
| **D-G48** | `ai_invocations` com HASHES (não texto)                                    | **Dia 1.** LGPD: hash sha256 de input/output, nunca texto bruto. Vercel AI Gateway tem texto cacheado 1h pra debug. Tabela `ai_usage_monthly` agregada pra `assertBudget`.                                                                                                                                                                                                                                                            | §13.13, §16.15       |
| **D-G49** | Budget per-tenant `assertBudget()`                                         | **Dia 1 Pacote C.** Cap $2/mês cap chatbot Pacote C; Pacote A/B sem budget IA. Implementado na app (AI Gateway não tem nativo).                                                                                                                                                                                                                                                                                                       | §13.13               |
| **D-G50** | KB exercises + foods sem embeddings dia 1                                  | **Dia 1.** `public.kb_exercises` (free-exercise-db ~870, Unlicense) + `public.kb_foods` (TBCA 1900 + TACO 597, com crédito no chatbot). SEM coluna `embedding`. Search SQL puro (filtros + ILIKE/trgm). Chatbot consome KB inteiro no system prompt cacheado 1h.                                                                                                                                                                      | §16.16               |
| **D-G51** | `pgvector` NÃO instalado dia 1                                             | **Adiado.** Gatilho: chatbot Pacote C ≥100 conv/dia OU custo IA > R$200/mês OU 1º tenant pedir busca semântica. Quando entrar: `multilingual-e5-small` 384d em Edge Function Transformers.js (NÃO `Supabase.ai.Session` built-in — `gte-small` é EN-only).                                                                                                                                                                            | §13.15, §16.17       |
| **D-G52** | Comunicação prof↔aluno = só push + email (D-G37 revisto)                   | **Dia 1.** Sem chat 1:1 in-app. `desafit.push_messages` + `desafit.email_messages` (audit log). `component_kind='message'` = conteúdo de programa, não conversa. Tab Chatbot do PWA = IA, não prof.                                                                                                                                                                                                                                   | §10.7, §16.9, §16.18 |
| **D-G53** | Aluno + Prof login + senha (D-G36 revisto)                                 | **Dia 1.** Aluno acessa PWA 3-5×/dia — magic link cria fricção. Email+senha tradicional. Senha definida no checkout/primeiro acesso. Recovery por email.                                                                                                                                                                                                                                                                              | §17, §18             |
| **D-G54** | `lib/contracts/` como SSOT (renomeação de `lib/domain/schemas/`)           | **Dia 1.** Contratos = fonte da verdade entre camadas. Estrutura `lib/contracts/<feature>/<feature>.{schema,contracts,adapter}.ts`. Adapter `fromRow()` explícito persistence↔domain.                                                                                                                                                                                                                                                 | §6                   |
| **D-G55** | `Result<T, AppError>` discriminated union (substitui `ActionResult<T>`)    | **Dia 1.** `lib/contracts/result.ts` + `lib/contracts/errors.ts` com `AppError = z.discriminatedUnion('kind', [...])`. UI faz switch exaustivo (ESLint força). Substitui `ActionResult<T>` simples.                                                                                                                                                                                                                                   | §6.4, §6.4b          |
| **D-G56** | Thresholds ESLint agressivos (error único)                                 | **Dia 1.** `max-lines: 300` / `max-lines-per-function: 60` / `complexity: 12` / `max-depth: 4` / `max-params: 4`. Substitui warn/error split anterior. Greenfield é único momento de apertar.                                                                                                                                                                                                                                         | §3.3                 |
| **D-G57** | Sheriff boundaries                                                         | **Dia 1.** `@softarc/sheriff-core` + `@softarc/eslint-plugin-sheriff` com tags `type:feature/shared/data` + `side:server` + `enableBarrelLess`. Defesa em lint contra `lib/data` importar `app/`.                                                                                                                                                                                                                                     | §1.6                 |
| **D-G58** | TS config strict++ (6 flags)                                               | **Dia 1.** `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noImplicitReturns`, `verbatimModuleSyntax`. NÃO incluir `noPropertyAccessFromIndexSignature` ([I] depois).                                                                                                                                                                                                  | §1.5                 |
| **D-G59** | CSS via API route (white-label runtime) — RESOLVE §31.3 #8                 | **Dia 1.** `/api/tenants/[id]/theme.css?v=N` route handler com `Cache-Control` forte. Zero `dangerouslySetInnerHTML`, zero `eslint-disable`. Trade-off: 1 request HTTP cacheado. Substitui pattern `<style dangerouslySetInnerHTML>` da §7.7 antiga.                                                                                                                                                                                  | §7.7                 |
| **D-G60** | Setup Claude Code completo (CLAUDE.md <200 + paths + 3 hooks)              | **Dia 1.** CLAUDE.md raiz <200 linhas + `@imports` lazy. 20 `.claude/rules/*.md` com frontmatter `paths:`. 3 hooks `.claude/hooks/` (block-disables, format-on-write, vocab-reminder). 3 MCPs (shadcn + Supabase + Context7). Plan Mode obrigatório >1 arquivo. Skills/subagents reduzidos (começar sem).                                                                                                                             | §27                  |
| **D-G61** | ADRs leves Michael Nygard + `/adr` slash                                   | **Dia 1.** `docs/adr/0000-template.md` + INDEX + slash `/adr "title"`. Política `superseded by` (não deletar ADR antiga). 4 ADRs obrigatórias no bootstrap (0001-stack, 0002-rls-pattern, 0003-vibe-coding-adiado, 0004-zero-eslint-disable).                                                                                                                                                                                         | §29.7b               |
| **D-G62** | Renovate restritivo (major bloqueado)                                      | **Dia 1.** `renovate.json` com `matchUpdateTypes: ["major"], enabled: false`. Stack-core sem automerge. devDeps minor/patch automerge. `engines` + `packageManager` pinados em `package.json`.                                                                                                                                                                                                                                        | §29.7f               |
| **D-G63** | `lib/supabase/{client,server,admin}` + `'server-only'` em admin            | **Dia 1.** `import 'server-only'` em `admin.ts` (quebra build se importado de Client Component). `lib/supabase/index.ts` re-exporta SOMENTE client+server (admin nunca). ESLint `no-restricted-imports` bloqueia `@supabase/supabase-js` direto e `@/lib/supabase/admin` fora de `supabase/functions/**`.                                                                                                                             | §16.17b              |
| **D-G64** | `size-limit` substitui `@next/bundle-analyzer`                             | **Dia 1.** Next 16 removeu per-route bundle stats (Vercel removeu por imprecisão). `.size-limit.json` com budgets explícitos por chunk + `size-limit-action` GHA.                                                                                                                                                                                                                                                                     | §29.1                |
| **D-G65** | `@hookform/resolvers/standard-schema` (não zodResolver)                    | **Dia 1.** Workaround pros bugs documentados Zod 4 + discriminatedUnion + `zodResolver` (issues #788, #793, #817).                                                                                                                                                                                                                                                                                                                    | §6.6                 |
| **D-G66** | Zero hardcoded i18n — 14 padrões cobertos                                  | **Dia 1.** `react/jsx-no-literals` (1 padrão) + 13 `no-restricted-syntax` custom + `eslint-plugin-i18next` + `pnpm i18n:audit` grep CI + fixture de teste. Cobre aria/placeholder/alt/title/toast/Error/const/metadata/fail()/Zod msgs/email/push/error map. Allowlist 8 lugares legítimos (messages/, lib/i18n/, tests, scripts, console, env, URL, posthog event names).                                                            | §15.7                |
| **D-G67** | Self-service como mecanismo de produção (não fase pós-SaaS)                | **Princípio meta.** Editor de blocos + upload + edição de programa = TIER 1, entra junto do Pacote A. Mesmo em modelo agência permanente, painel editável reduz entrega de 90d→10d (prof corrige texto, sobe vídeo, sem ticket). Não é "luxo SaaS futuro" — é mecanismo de produção desde 1º tenant.                                                                                                                                  | §33.13, §10.16       |
| **D-G68** | F2.5 painel tier 1 antes de 1º tenant (gate explícito)                     | **Dia 1 da fase 1º tenant.** Bloqueia entrar em F3 (1º tenant real) sem template Pacote A + editor tier 1 prontos. Sem isso, fundador vira escravo de tickets.                                                                                                                                                                                                                                                                        | §33.13               |
| **D-G69** | Tiers de editor (3 níveis explícitos)                                      | **Tier 1 must-have c/ Pacote A:** editar texto/imagem em blocos, upload vídeo, editar workout/módulo, publicar. **Tier 2 nice c/ Pacote B:** drag-drop reorder, A/B básico, variantes landing. **Tier 3 futuro (Pacote C/SaaS):** vibe coding chat, IA sugere conteúdo, WYSIWYG completo.                                                                                                                                             | §10.16               |
| **D-G70** | Slice por pacote completo (não feature-by-feature)                         | **Dia 1.** Fecha Pacote A inteiro (todas features + editor tier 1) → vende → próximo pacote. Schema interconectado suporta A+B+C dia 1 (§39); UI/editor fecha por pacote. Evita "5 features 80% prontas" do onboarding-bio.                                                                                                                                                                                                           | §10.16, §33.13       |
| **D-G71** | Checkout agência fora MVP, checkout aluno crítico                          | **Dia 1.** Primeiras vendas agência = WhatsApp + PIX manual + negociação consultiva (não compra de impulso). Checkout próprio só quando 3+ pedidos/semana esperando. **Mas** checkout do aluno (Asaas/Stripe) é crítico desde 1º tenant — sem ele tenant não fatura.                                                                                                                                                                  | §24.3, §33.13        |
| **D-G72** | Doc lifecycle completo (tamanhos + ownership + markers)                    | **Dia 1.** Cada doc tem tamanho máximo, source-of-truth declarada, auto-gen marker quando aplicável. CLAUDE.md <200; rules <100 cada; architecture.md <500; ADRs 1 página; schema.md auto-gerado; CHANGELOG auto-gerado de commits. CI valida `pnpm docs:audit` (refs existem, sizes OK).                                                                                                                                             | §29.7g               |
| **D-G73** | Memória Claude Code zerada no repo desafit/                                | **Repo novo = working dir novo = memory fresca automática.** Migra SOMENTE decisões consolidadas pra `docs/core/decisions.md` (sem dizer "antes era X"). NÃO migra memory files individuais (são logs de sessão). Sem "herança onboarding-bio", sem "foi migrado de" — projeto fresco.                                                                                                                                                | §27.1                |
| **D-G74** | Acompanhamento em 3 camadas: GitHub Projects + roadmap.md + CHANGELOG auto | **Dia 1.** **Macro:** GitHub Projects Kanban (fases F0-F5, sprints, burndown visual). **Estado:** `docs/roadmap.md` <200 linhas (fase atual + próximo objetivo). **Histórico:** `docs/CHANGELOG.md` auto-gerado via release-please ou changesets (de commits). Plus TaskCreate granular efêmero por sessão.                                                                                                                           | §33.14               |
| **D-G75** | 3 pesquisas blockers antes do bootstrap/F1/F2.5                            | **Editor strategy** (Tiptap/Lexical/Plate/Editor.js/hand-rolled — bundle, plugins, RSC compat, multi-tenant) blocker pra F2.5. **PWA offline-first patterns** (SW cache strategy, IndexedDB, sync queue, push iOS) blocker pra F1. **Doc lifecycle/Diátaxis vs C4 vs ARC42 vs ADR-only** blocker pra F0 (define estrutura `docs/`). Cada uma 1-2 dias.                                                                                | §33.0                |
| **D-G76** | 13 paletas oficiais migradas verbatim (não 4)                              | **Dia 1.** Aproveita trabalho já feito em `app/preview/paletas/page.tsx`. 13 presets curados (default/indigo/rose/terracotta/sage/navy/mustard/coral/pure/minimal-warm/performance/carbon/neon) com primary + primaryLight + 5 extras + surfaces dark/light derivadas. Cobertura: minimalista→neon, sóbrio→vibrante, wellness→performance. Pesquisa P1 (DS Bloco 1+2) vira "VALIDAR APCA das 13 existentes", não "definir 4 do zero". | §7.3                 |

### 31.3 Decisões em aberto (resolver depois)

| #      | Decisão                                                                          | Quando resolver                                                                                                                                                                                                                                                                               |
| ------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1      | Pagar.me KYC fase marketplace                                                    | Antes da virada SaaS marketplace                                                                                                                                                                                                                                                              |
| 2      | Gatilhos exatos virada agência → SaaS self-service                               | Após 10 primeiros tenants validados (sugestão §0.5.10: 15 tenants ativos 3+ meses, TTFV <60min, tickets <2/tenant, NPS ≥40)                                                                                                                                                                   |
| 3      | Pricing fase SaaS self-service                                                   | Após custos reais validados (sugestão: 3 tiers R$197/R$397/R$697 — registrada, não travada)                                                                                                                                                                                                   |
| 4      | Take rate fase SaaS marketplace                                                  | Quando virar marketplace (sugestão: 8/6/4% escalonado + Enterprise R$1.997 com 0% TR)                                                                                                                                                                                                         |
| 5      | Ajuste pricing pacotes A/B/C                                                     | Após 10 primeiros tenants — sugestão pesquisada de subir B→R$3.500/C→R$4.500 fica registrada                                                                                                                                                                                                  |
| 6      | Bônus "10 meses sem mensalidade" no C                                            | Avaliar fluxo de caixa real depois dos 10 primeiros (sugestão: trocar por 50% × 12 meses)                                                                                                                                                                                                     |
| 7      | Mensalidade Pacote A                                                             | Avaliar margem real depois (sugestão: subir R$ 100 → R$ 147-197 pra cobrir custo unitário)                                                                                                                                                                                                    |
| ~~8~~  | ~~eslint exception `<TenantThemeStyle>`~~                                        | **RESOLVIDO 2026-05-17 (D-G59)** → Opção (b): CSS estático via API route `/api/tenants/[id]/theme.css?v=N` com `Cache-Control` forte. Zero `eslint-disable`, zero `dangerouslySetInnerHTML`. Trade-off de 1 request HTTP cacheado vale pra preservar política zero-disable. Detalhes em §7.7. |
| **9**  | **Quando ativar UI editor visual** (§12)                                         | **Default §39:** entre 1º e 2º cliente (sprint imediato). Adiamento aceito (ADR) pra 3º cliente se cronograma estourar. Schema já suporta dia 1.                                                                                                                                              |
| **10** | **Quando ativar UI vibe coding pipeline** (§13)                                  | **Default §39:** entre 1º e 2º cliente. Adiamento aceito (ADR) pra 3º cliente. Tabelas + prompts (sem UI) entram dia 1.                                                                                                                                                                       |
| **11** | **Quando ativar geração IA de capa de programa**                                 | Adia pra 5º cliente ou ≥5 programas/mês — Replicate Flux Schnell ($0.003/img). Dia 1 upload Figma/Canva.                                                                                                                                                                                      |
| **12** | **Quando ativar multi-modal input vibe coding (PDF→estrutura)**                  | Quando 3+ tenants com programa legado pedirem — dia 1 fundador digita no painel                                                                                                                                                                                                               |
| **13** | Quando ativar pull-to-refresh e long-press menu                                  | Polish — entra quando não houver feature crítica pendente                                                                                                                                                                                                                                     |
| **14** | Quando ativar swipe-to-complete set, realtime collab, custom blocks user-defined | Fase 2+ — não bloqueiam entrega da proposta                                                                                                                                                                                                                                                   |
| **15** | **Promptfoo CI ativo**                                                           | Quando 1º prompt customizado for criado em `public.ai_prompts` (não dia 1 — sem prompts não há o que avaliar). Cases YAML versionados em `evals/<prompt_key>/cases.yaml`                                                                                                                      |
| **16** | **`pgvector` instalado + embedding column**                                      | Gatilho: chatbot Pacote C ≥100 conv/dia agregadas OU custo IA > R$200/mês OU 1º tenant pedir busca semântica. Quando entrar: `multilingual-e5-small` 384d em Edge Function (D-G51)                                                                                                            |
| **17** | **Subir Sentry pra Team ($26/mês)**                                              | Quando estourar 5k errors/mês OU primeiro bug iPhone difícil de reproduzir sem Session Replay                                                                                                                                                                                                 |
| **18** | **Migrar pra Braintrust/Helicone observability IA**                              | Quando AI Gateway dashboard não bastar (>50 tenants ativos OU multi-time) — fase SaaS                                                                                                                                                                                                         |
| **19** | **Habilitar embeddings multimodais (Gemini Embedding 2)**                        | Fase SaaS quando precisar busca por imagem/áudio (improvável MVP)                                                                                                                                                                                                                             |

---

## 32. Lições refatorações onboarding (~150-170h evitadas)

### 32.1 Top 15 lições críticas (regras dia 1)

| #      | Lição                                                  | Custo no onboarding                                                                                            | Regra desafit                                                                                                       |
| ------ | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 1      | Naming bilingue dia 1                                  | D23 `student`→`client` tarde, `aiContext` JSONB PT rename adiado                                               | §2 — JSONB AI keys EN                                                                                               |
| 2      | Design system **antes** das telas                      | 186 violations heading + 127 inline color + 22 buttons raw                                                     | §7-§9 dia 1                                                                                                         |
| 3      | shadcn-first absoluto                                  | `<SelectionCard>` criado tarde, `<UploadDropzone>` duplicado                                                   | §9.1 — todos shadcn dia 1                                                                                           |
| 4      | RLS em toda tabela na migration que cria               | Tabelas sem RLS depois adicionadas                                                                             | §16.2 — CI gate                                                                                                     |
| 5      | JSONB vs tabela checklist D26 dia 1                    | 8 tabelas 0-row + 4 candidatas a JSONB                                                                         | Decisão antes de criar tabela                                                                                       |
| 6      | Roles enum bloqueado dia 1                             | `student` quebrou, virou `client`                                                                              | §4.2 — 5 valores fixos                                                                                              |
| 7      | Lint rules error dia 1                                 | D74 bug: regra desligada 6 commits silenciosamente                                                             | §2.3 — testar em fixture                                                                                            |
| 8      | Migrations via `apply_migration` MCP                   | 7 migrations remotas sem arquivo local (débito permanente)                                                     | §16.7                                                                                                               |
| 9      | Pricing só validados com cohort real                   | D7/D8 Core/Pro revisado em D97                                                                                 | Beta = 1 tier único                                                                                                 |
| 10     | Provider = decisão locked                              | Stripe→EFI (2 sem), Z-API→Meta (1 sem + 5-15d)                                                                 | Estudar SLA antes                                                                                                   |
| 11     | Audit log só com consumidor real                       | `professional_customization_history` 0 rows                                                                    | Só quando feature pede                                                                                              |
| 12     | Config estática = TS constants                         | 4 tabelas `system_*` 6-13 rows estáticas                                                                       | `lib/constants.ts`                                                                                                  |
| 13     | Denormalização só com query real                       | `intake_calculation_archive` 12 rows duplicadas                                                                | Materialized view quando precisar                                                                                   |
| 14     | Refatoração = consolidação, não adição paralela        | `client_transformations` colunas + JSONB simultâneos                                                           | Migration remove redundância no mesmo PR                                                                            |
| 15     | Padrão recorrente → primitive na 2ª vez                | 11+ duplicações pra criar `<SelectionCard>`                                                                    | 2x → primitive                                                                                                      |
| **16** | **Decisões = arquivos versionados, não conversas**     | 10 decisões revertidas (Stripe→EFI, Z-API→Meta, etc) silenciosamente                                           | **ADRs leves dia 1** (§29.7b) + slash `/adr` + política `superseded by`                                             |
| **17** | **Service layer só com 3 critérios** (Research C §5.3) | "Service vazio" pattern: `XService.create()` que só chama `supabase.from('x').insert()` — overengineering puro | Server Action JÁ é a camada de serviço. Service só se: ≥2 collaborators + ≥2 callers + encapsula transaction/policy |
| **18** | **Rule of three antes de extrair** (Sandi Metz)        | Premature abstraction = `<SelectionCard>` criado tarde DEPOIS de criar 11 versões                              | Duplique até 2 vezes. Abstrai SÓ na 3ª ocorrência                                                                   |

### 32.2 Decisões revertidas (custo real)

| D#          | Original                       | Reversão                           | Custo                   |
| ----------- | ------------------------------ | ---------------------------------- | ----------------------- |
| D7/D8 → D97 | Pricing Core/Pro pré-validação | Tier único                         | Replanejamento          |
| D19         | Stripe pra mensalidade         | EFI Bank                           | ~2 semanas              |
| D21         | Z-API WhatsApp                 | Meta Cloud API                     | ~1 semana + 5-15d Meta  |
| D48 → D101  | WhatsApp groups manual         | Auto via Cloud API                 | Refator fluxo           |
| D74         | `no-raw-button` rule ativa     | Bug silencioso 6 commits           | Auditoria pra descobrir |
| D85         | `design_*_override` 6 colunas  | Considerar JSONB `theme_overrides` | Migration futura        |

### 32.3 Refatorações em massa (números)

| Fase        | O quê                                      | Custo                                                 |
| ----------- | ------------------------------------------ | ----------------------------------------------------- |
| 20          | Headings raw → `<Heading>`                 | 186 violações, ~80 arquivos, 30-40h                   |
| 21          | Inline colors → tokens                     | 127 violações, 33 arquivos, 20-25h                    |
| 22          | Buttons raw → `<Button>`/`<SelectionCard>` | 22 ocorrências, 8-10h + D76/D77                       |
| 23          | Lint rules promoção warning→error          | Fix bug D74, ~4h                                      |
| 25          | Motion presets centralizados               | Refator Drawer/Toast/Dialog, 15-20h                   |
| 26-27       | Shape + density token sweep                | 357 edits em 171 arquivos, 25-30h                     |
| A-D 2026-05 | Token bypass sweep                         | 528 warnings → 0 via 830 disables (débito disfarçado) |
| **Total**   |                                            | **~150-170h**                                         |

### 32.4 Anti-patterns que parecem certos (não repetir)

| Tentação                                           | Por que parece certa     | Por que voltou atrás                            |
| -------------------------------------------------- | ------------------------ | ----------------------------------------------- |
| "Audit trail automático em tudo"                   | "Vamos querer histórico" | Tabelas 0-row, triggers em todo UPDATE          |
| "Sistema dual normalizado + JSONB"                 | "Suporta ambos"          | 8 tabelas `analise_*` vivem paralelo a JSONB    |
| "Denormalizar agora pro futuro"                    | "Evita JOIN"             | `intake_calculation_archive` 12 rows duplicadas |
| "Tabelas `system_*` pra admin editar"              | "Vai ter painel"         | 4 tabelas estáticas, painel nunca veio          |
| "Lint rule warning agora, error depois"            | "Primeiro adapta"        | D74 bug 6 commits cego                          |
| "Pricing tiers pré-validação"                      | "Cria escalabilidade"    | Reformulado pré-beta                            |
| "Múltiplas colunas tipadas + JSONB pro mesmo dado" | "Tipos + flex"           | `client_transformations` inconsistência         |
| "ESLint rule sem teste em fixture"                 | "Adiciona rápido"        | D74 selector não cobriu member expressions      |

### 32.5 Overengineering removido (30 itens — não fazer dia 1)

❌ Mutation testing · ❌ SAST automatizado · ❌ License check · ❌ CODEOWNERS · ❌ RUM custom · ❌ Distributed tracing · ❌ Branded types em todo ID · ❌ Bundle budget separado de Lighthouse · ❌ Audit log automático · ❌ LGPD em SQL comment · ❌ Pentest pré-beta · ❌ A11y audit externo pré-beta · ❌ Perf audit externo · ❌ ADR formal por decisão · ❌ Runbook por alerta · ❌ On-call rotation · ❌ Coverage 80% · ❌ Métricas custom · ❌ Web Vitals blocker · ❌ Dependency scanning semanal · ❌ Secret scanning CI · ❌ Schema diff visual · ❌ Pre-commit secret block · ❌ SLO/error budget · ❌ Blog SEO · ❌ Treino IA self-service · ❌ Agenda interna · ❌ App nativo (PWA cobre) · ❌ Backup restore mensal · ❌ axe-core CI obrigatório (✅ pro desafit inverte)

### 32.7 Mapeamento dor↔guardrail (Research C — tabela canônica)

Cada dor do onboarding-bio mapeada explicitamente pros guardrails que previnem. Cobertura ≥ 3 camadas em cada dor (defense-in-depth).

| Dor onboarding-bio                                            | Guardrails desafit (multi-camada)                                                                                                                                                                                                                     |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **~150-170h refator desnecessário**                           | TS strict++ (§1.5) + Sheriff boundaries (§1.6) + `max-lines 300` / `complexity 12` (§3.3) + `lib/contracts/` Result/AppError (§6) + Supabase types.gen drift check (§29.1) + Plan Mode obrigatório (§27.8) + ADRs (§29.7b)                            |
| **~830 `eslint-disable` inline**                              | `@eslint-community/eslint-comments/no-use` (§2.3) + `unicorn/no-abusive-eslint-disable` + PreToolUse hook block-disables (§27.3) + CI grep-disables job (§29.1) + lint `--no-inline-config --max-warnings 0` (§29.2) — **5 camadas**                  |
| **30+ camadas overengineering**                               | `max-lines 300` + `complexity 12` + `max-depth 4` + `max-params 4` (§3.3) + Rule of three doc no CLAUDE.md (§27.1) + Regra "service só com 3 critérios" (§27.1) + Sheriff (cada camada vira tag explícita §1.6) — **4 camadas**                       |
| **10 decisões arquiteturais revertidas**                      | ADRs leves + `/adr` (§29.7b) + Renovate restritivo (§29.7f) + stack pinned em CLAUDE.md + `packageManager` lock (§29.7f) + Plan Mode obrigatório >1 arquivo (§27.8) + UserPromptSubmit vocab hook (§27.3) — **5 camadas**                             |
| **Vocabulário inconsistente** (intake/wizard/student/trainer) | `id-denylist` ESLint (§2.3) + `no-restricted-syntax` 6 selectors (§2.3) + UserPromptSubmit hook (§27.3) + seção Vocabulary no CLAUDE.md (§27.1) + `unicorn/filename-case` (§2.3) — **5 camadas**                                                      |
| **Drift CLAUDE.md ↔ código**                                  | CLAUDE.md < 200 linhas (§27.1) + `@imports` lazy + `.claude/rules/` com `paths:` (§27.2) + auto-gerador `docs/auto/INDEX.md` [I] (§29.7e) + drift-check CI [I] (§29.7d) + ADRs no lugar de prosa (§29.7b) + hierarquia fonte (§29.7c) — **6 camadas** |
| **700+ inline colors silenciados** (token bypass)             | `better-tailwindcss/no-unregistered-classes` (§2.3) + ESLint rules custom 10 padrões (pesquisa DS Bloco 8) + pre-commit grep safety net + CI gate adicional + fixture de teste cobertura 100% — **5 camadas** (detalhe em pesquisa DS)                |
| **Texto hardcoded i18n** (estimado centenas)                  | `react/jsx-no-literals` (§2.3) + ESLint rules custom 14 padrões (§15.7) + `eslint-plugin-i18next` + pre-commit grep + `pnpm i18n:audit` CI + decisão "nada hardcoded fora allowlist" — **6 camadas**                                                  |

**Princípio (Research C):** o onboarding-bio virou pântano porque decisões eram conversas e não arquivos versionados. Cada guardrail acima troca uma conversa por um arquivo (ADR, rule, schema, hook). Claude Code é poderoso o suficiente pra construir muito rápido — por isso os **freios** (não os aceleradores) determinam se desafit chega a produção com 0 disables, vocabulário único, e zero refator não planejado.

### 32.6 Checklist pré-commit "evitei os erros"

Aplicar a cada feature nova:

- [ ] Naming: zero PT em schema/código/JSONB keys
- [ ] Tabela nova: precisa mesmo ou cabe em JSONB do parent?
- [ ] Tabela nova: RLS na mesma migration?
- [ ] Tabela nova: tem consumidor real ou "pra futuro"?
- [ ] Padrão visual recorrente: já apareceu 2x → cria primitive antes da 3ª
- [ ] String literal em JSX: bate `t()`?
- [ ] Inline style com cor: bate token?
- [ ] Heading raw: bate `<Heading>`?
- [ ] Button raw: bate `<Button>` shadcn?
- [ ] Lint rule nova: testou em fixture com regression?
- [ ] Server action: retorna `{ ok, data } | { ok, error }`?
- [ ] Provider integration: estudou SLA + exit cost?
- [ ] Audit log: tem consumer real?
- [ ] Vocabulário banido: nenhum `intake/wizard/student/trainer/etc`?
- [ ] Component novo: tem decision em `docs/components/decisions.md`?
- [ ] Decisão arquitetural: tem ADR em `docs/adr/` antes de codar?
- [ ] Função > 60 linhas: quebrar (max-lines-per-function CI bloqueia)?
- [ ] Padrão visual 3+ usos: extrair primitive (rule of three)?
- [ ] Service wrapper de 1-2 linhas: deletar (Server Action é a camada)?
- [ ] Hardcoded string em aria-label/placeholder/toast/throw: virar `t()` chave?
- [ ] Service-role Supabase em Client Component: explode build (`'server-only'`)?

---

## 33. Roadmap de fases (F0 → F9)

### 33.0 Bootstrap semana 1 (ANTES de F0 features) — Research C

Setup defensivo mínimo dia 1 — depois disso, F0 pode começar. Sem este bootstrap, F0 vira pântano (= onboarding-bio).

> **⚠️ Pré-bootstrap — 3 pesquisas blockers (D-G75):**
>
> - **Doc lifecycle** (Diátaxis vs C4 vs ARC42 vs ADR-only) — bloqueia início do bootstrap. Define estrutura `docs/` antes de criar qualquer doc. Sem isso, repete drift do onboarding-bio.
> - **PWA offline-first patterns** (SW lib, cache strategy, IndexedDB, sync queue, push iOS 2026) — bloqueia F1. Afeta `lib/data/` desde o início; retrofitar é refator pesado.
> - **Editor strategy** (Tiptap/Lexical/Plate/Editor.js/hand-rolled) — bloqueia F2.5/M2. Decisão cara de errar (bundle, RSC compat, multi-tenant).
>
> Cada pesquisa: 1-2 dias. Rodar em paralelo em Claude Desktop. Não começar bootstrap até as 3 voltarem (ou aceitar débito explícito em ADR).

**Dia 1 — Setup defensivo mínimo:**

1. `pnpm create next-app desafit-app` (TS + ESLint + Tailwind v4 + App Router)
2. `tsconfig.json` com 6 flags strict++ (§1.5)
3. `eslint.config.ts` flat com `strict-type-checked` + 20+ regras (§2.3) — copy paste pronto
4. `CLAUDE.md` raiz < 200 linhas + estrutura WHAT→HOW→conv→refs (§27.1)
5. `.claude/rules/` — 3 arquivos críticos primeiro (server-actions, supabase, tailwind-tokens) com `paths:` (§27.2) — outros 17 entram conforme features
6. Husky + lint-staged + `.husky/{pre-commit,commit-msg,pre-push}` (§29.2)
7. 3 hooks Claude Code `.claude/hooks/`: `block-disables.sh` (PreToolUse), prettier+eslint --fix (PostToolUse), `vocab-reminder.sh` (UserPromptSubmit) (§27.3)
8. `docs/adr/0001-stack.md` registrando todas D-G1..D-G65 consolidadas (§29.7b)
9. `renovate.json` restritivo + `engines` + `packageManager` pinados (§29.7f)

**Dia 2-3 — Contratos + Supabase:**

10. `lib/contracts/` com `result.ts` (Result<T, AppError>) + `errors.ts` (AppError discriminated union) + primeiro schema example (§6)
11. `lib/supabase/{client,server,admin,types.gen,index}.ts` com `'server-only'` em admin (§16.17b)
12. Supabase project criado + JWT secret salvo
13. `pnpm db:types` script + GHA `db-types.yml` drift check (§29.1)
14. Migration `0001_initial.sql` baseline com core tabelas (§16.3) via `mcp__supabase__apply_migration`
15. Triggers `handle_new_user` + `custom_access_token_hook` (§16.4)
16. Helpers SQL `current_tenant_id()` + `current_user_role()` STABLE (§16.4)
17. RLS pattern canônico aplicado em toda tabela tenant-scoped (§16.5)
18. 6 storage buckets com policies (§16.11)
19. `sheriff.config.ts` inicial com 3 tags primárias: `type:feature/shared/data` (§1.6)

**Dia 4-5 — CI completo + MCPs + design tokens:**

20. GHA `ci.yml` ordem fail-fast: typecheck → lint → knip → grep-disables → audits → vitest → size-limit → db drift → e2e → deploy-preview (§29.1)
21. `.size-limit.json` budgets explícitos (§29.1) — substitui `@next/bundle-analyzer`
22. MCPs configurados: shadcn + Supabase + Context7 (§27.7)
23. `app/globals.css @theme` com tokens OKLCH base + `lib/design/palettes.ts` migrado verbatim do onboarding-bio (13 paletas — D-G76, §7.3). Pesquisa P1 (DS Bloco 1+2) VALIDA APCA, não define do zero
24. `lib/design/contrast.ts` (APCA helpers) + `lib/design/tokens.ts` (`deriveTokens`)
25. Primitives obrigatórios em `components/ui/`: `<Heading>`, `<Text>`, `<Eyebrow>`, `<Metric>`, `<DataCell>`, `<Code>`, `<Section>`, `<Stack>` (§8.3)
26. `/api/tenants/[id]/theme.css/route.ts` route handler (§7.7 — white-label runtime D-G59)
27. Layout root com skip link + `<main id="main">` + `<MotionConfig reducedMotion="user">` + `<link rel="stylesheet">` tenant theme (§14.1 + §7.7)
28. shadcn 100% instalado (todos componentes + blocks relevantes — §9)
29. Primeiro vertical slice exemplo (`app/(shell)/example/` com page + \_actions + \_components) pra Claude usar como template

**Critério "Bootstrap pronto":**

- `pnpm typecheck` 0 erros
- `pnpm lint` 0 warnings
- `pnpm test` passing (1 unit + 1 e2e mínimo)
- `pnpm build` ok
- Lighthouse `/login` ≥ 90 Perf / A11y 100
- Signup smoke: cria user → trigger cria tenant + membership → JWT carrega `tenant_id` + `active_membership_role`
- CSS do tenant carrega via `/api/tenants/[id]/theme.css` sem FOUC

**Só DEPOIS de bootstrap pronto, F1 (Auth + setup profissional) começa.** Sem bootstrap = repete sofrimento.

**Não fazer no bootstrap (entra em F0+):**

- Editor visual de páginas (§12)
- Pipeline vibe coding UI (§13)
- Features de produto (programas, alunos, captação)
- E2E completo (12 golden paths — entra incremental conforme feature pronta)
- Playwright/Lighthouse jobs CI (entram quando 1ª tela crítica no ar — labels `perf`/`a11y`)
- Reviewer subagent (entra quando > 5 PRs/semana)
- next-intl 4 locales (en-US/pt-PT/es-ES) ativos — só `pt-BR` ativo dia 1, espelhos em messages/

### 33.1 F0 — Fundação (não paraleliza)

**Entregáveis:**

- Repo criado, configs todos (§26), Husky hooks, GitHub Actions
- Supabase project + JWT secret
- Migration `0001_initial.sql` com core tabelas (§16.3)
- Triggers `handle_new_user` + `custom_access_token_hook`
- 5 storage buckets + policies
- Design system tokens (`globals.css @theme`)
- Primitives `<Heading>/<Text>/<Eyebrow>/<Metric>/<Code>/<Stack>/<Section>`
- `lib/domain/roles.ts`, `lib/contracts/result.ts`, `lib/contracts/errors.ts`, `lib/env.ts`
- `lib/design/contrast.ts` + `lib/design/tokens.ts`
- `lib/hooks/use-responsive.ts`, MotionConfig root
- PWA manifest base + Serwist SW skeleton
- shadcn 100% instalado (componentes + blocks)
- Smoke test: signup cria tenant + JWT carrega tenant_id

**Critério:** `pnpm build` passa, lint 0/0, tsc 0, vitest mínimo, Lighthouse `/login` ≥ 90.

**Não escopo:** features específicas (programs, captação, etc).

### 33.2 F1 — Auth + setup profissional

**Entregáveis:**

- Login/signup/forgot/reset/verify completos
- Wizard setup 5 passos (§17.1)
- Redirect pós-login role-based
- Settings inicial (perfil, slug, branding básico)

**Critério:** novo signup completa setup em < 5min, tenant publicado em estado "rascunho".

**Paraleliza com:** F2 (rotas independentes).

### 33.3 F2 — Captação + landing branded

**Entregáveis:**

- Tabela `desafit.public_pages` + `desafit.page_blocks`
- Renderer SSR de blocos (11 tipos base)
- `desafit.capture_forms` + `desafit.capture_submissions` + `desafit.leads`
- Página landing + página captação branded por tenant
- Pixel Meta + GA4 (UI settings + script render)
- Painel `/dashboard/capture` com analytics + responses

**Critério:** primeiro tenant tem URL pública branded + form ao vivo + lead chega no painel.

**Paraleliza com:** F1.

### 33.4 F3 — Editor visual + formulários customizáveis

**Entregáveis:**

- Block editor drag-drop (dnd-kit + side panel)
- 11 blocos editáveis
- Live preview split desktop, read-only mobile
- Editor de capture form (perguntas via IA + manual)
- TDEE/macros calculator (lib pura)

**Critério:** profissional edita landing sem suporte, cria form via "Gerar com IA" + revisão, aluno responde e vê resultado.

**Paraleliza com:** F4 (depois de F2).

### 33.5 F4 — Core: programas + vibe coding

**Entregáveis:**

- 1 template MVP "21 Dias Mais Leve"
- Catálogo de templates público
- Editor módulos/componentes drag-drop
- 6 component kinds (workout, video_lesson, material, check_in, message, task)
- Exercise library plugin (free-exercise-db 800+ exercícios)
- Schedule engine (4 release modes: immediate, relative, fixed_date, after_completion)
- Vibe coding orchestrator (4 estágios §13.1)
- Biblioteca pessoal vídeos (Mux ou Bunny)

**Critério:** profissional gera programa completo via IA + revisa + publica. Cliente fictício consegue executar.

**Bloqueia:** F5, F6.

### 33.6 F5 — PWA cliente shell + tela dia

**Entregáveis:**

- App shell (header + bottom nav)
- Dashboard com próximo componente
- Renderização de 6 kinds
- Check-in form + submit
- Push notifications opt-in flow
- Offline check-in (IndexedDB + background sync)
- Share de resultado

**Critério:** aluno abre PWA, completa dia 1, vê confirmação + progresso. Funciona offline pra check-in.

**Bloqueado por:** F4.

### 33.7 F6 — PWA cliente completo

**Entregáveis:**

- Dashboard com resumo semana
- Progresso por componente
- Perfil (dados + edição básica)
- Chat com profissional (Realtime)
- Material download (presigned URLs)
- Badge notificações não-lidas
- Galeria antes/depois

**Critério:** PWA instalável em iOS + Android, fluxo completo end-to-end.

**Bloqueado por:** F4.

### 33.8 F7 — Pagamentos (split em a/b/c)

**F7a — EFI Bank: mensalidade plataforma → profissional (dia 1)**

Entregáveis:

- Integração EFI (Pix Automático + cartão)
- Cobrança setup Pacote A/B/C (10× sem juros)
- Mensalidade R$100/R$200 com grace period
- Webhook → atualiza `public.subscriptions.status`
- UI billing em `/dashboard/settings/billing`

Critério: prof contrata pacote, paga setup via Pix/cartão, webhook processa em <5min, mensalidade dispara no dia certo.

**F7b — Adapter gateway do aluno (fase agência/SaaS self-service)**

Entregáveis:

- Adapter `lib/data/gateways/` com interface comum
- Implementação 1 gateway dia 1 (decisão #6)
- UI em `/dashboard/settings/payment` pra prof colar credenciais
- Tabela `desafit.payment_transactions` com `gateway` column
- Webhook adapter por gateway → enrollment automático

Critério: prof configura próprio gateway, cliente paga programa, prof recebe direto na conta dele, enrollment criado.

**F7c — Pagar.me marketplace split (fase SaaS marketplace — futuro)**

Entregáveis (quando virar SaaS marketplace com cobrança de taxa):

- Integração Pagar.me split nativo
- Onboarding KYC do prof (decisão #6b)
- Lógica de comissão plataforma sobre vendas
- Webhook → split automático

Critério: prof onboard direto pela plataforma, vende programa, split executa, plataforma recebe comissão.

**Paraleliza com:** F5/F6 (F7a/F7b). F7c só após decisão de virar SaaS marketplace.

### 33.9 F8 — Site institucional desafit (agência)

**Entregáveis:**

- Landing desafit.app (3 páginas: home, proposta, contato)
- WhatsApp CTA pra Leandro
- Campanha Meta Ads (pixel + audience)
- Formulário lead gen (responsáveis caem no admin)

**Critério:** desafit.app vendendo agência publicamente, Pixel rastreando.

**Paraleliza com:** outras fases.

### 33.10 F9 — Smoke test beta com primeiro tenant real

**Entregáveis:**

- Checklist smoke test (signup → setup → criar programa → captação → primeira venda → primeiro check-in → primeiro assessment)
- Relatório de bugs + priorização

**Critério:** primeiro tenant beta enrola, completa dia 1, gera assessment. Zero crash fim-a-fim.

### 33.11 Matriz paralelização

| Fase  | F0  | F1  | F2  | F3  | F4  | F5  | F6  | F7  | F8  | F9  |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| F0    | —   | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  | ❌  |
| F1    | ❌  | —   | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |
| F2    | ❌  | ✅  | —   | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  |
| F3    | ❌  | ✅  | ✅  | —   | ❌  | ✅  | ✅  | ✅  | ✅  | ✅  |
| F4    | ❌  | ✅  | ✅  | ❌  | —   | ❌  | ❌  | ✅  | ✅  | ✅  |
| F5    | ❌  | ✅  | ✅  | ✅  | ❌  | —   | ❌  | ✅  | ✅  | ✅  |
| F6    | ❌  | ✅  | ✅  | ✅  | ❌  | ❌  | —   | ✅  | ✅  | ✅  |
| F7-F9 | ❌  | ✅  | ✅  | ✅  | ✅  | ✅  | ✅  | —   | ✅  | ✅  |

F0 bloqueia tudo. F4 bloqueia F5/F6. Resto paralelo.

### 33.12 Quick wins por fase

| Fase | Quick win (< 4h)                  | Valor                            |
| ---- | --------------------------------- | -------------------------------- |
| F0   | Registrar plugins exercise + food | Library funciona em F4           |
| F1   | Wizard form esqueleto             | Bloqueia signup útil             |
| F2   | Seed página captura de exemplo    | Validação visual com tenant real |
| F3   | Live preview iframe básico        | UX editor melhor                 |
| F4   | Template "21 Dias" rendering      | Demo pra validação visual        |
| F5   | Shell renderizando                | Aluno tem onde acessar           |
| F6   | Component renderer 1 kind         | Validar pipeline E2E             |

### 33.13 Marcos de negócio M0-M5 (overlay sobre F0-F9) — D-G67 + D-G68 + D-G70 + D-G71

Fases técnicas F0-F9 são dependências; **ordem de ativação é business-driven**. Onboarding-bio sofreu por entregar tudo paralelo e "ligar no fim" — falsa velocidade. Aqui: cada marco só fecha quando **humano real consegue ir do começo ao fim**.

| Marco                                       | Critério (humano consegue)                                                                                                  | Fases técnicas                                            | Tempo estimado        |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------- |
| **M0 Bootstrap pronto**                     | `pnpm build` + signup smoke + Lighthouse ≥ 90                                                                               | §33.0 + F0                                                | 5 dias (hard timebox) |
| **M1 Seu funil rodando**                    | Lead entra na landing desafit.app → preenche form → recebe AI report → você fecha venda via WhatsApp (sem checkout próprio) | F1 + F2 + F8 (sem checkout — D-G71)                       | 2-3 sem pós-M0        |
| **M2 Pacote A entregável (gate 1º tenant)** | Você cria tenant em <2h via template Pacote A + tier 1 editor + checkout aluno funcionando                                  | F3 tier 1 + F4 Pacote A + F7a checkout aluno (D-G68 gate) | 2-3 sem pós-M1        |
| **M3 1º tenant autônomo**                   | 1º tenant tem alunos pagando + prof opera 80% edições sem ticket                                                            | F5 + F6 + F9 smoke                                        | 4 sem operando        |
| **M4 Multi-tenant + Pacote B**              | 5 tenants ativos + Pacote B fechado (multi-landing + automation + tier 2 editor)                                            | Backlog refinado + tier 2                                 | 2-3 meses pós-M3      |
| **M5 SaaS self-service (Pacote C)**         | 10+ tenants + vibe coding self-service + signup público on                                                                  | F7c marketplace + tier 3 + pipeline AI completo §13       | 6+ meses pós-M3       |

**Checkout próprio agência (D-G71): FORA de M1-M3.** Primeiras vendas = WhatsApp + PIX + negociação consultiva. Só entra como sub-marco quando 3+ pedidos/semana esperando pagar. Checkout do **aluno** é parte do M2 (sem ele tenant não fatura).

**Regra de ouro:** marco só conta como fechado quando **1 humano completa o fluxo end-to-end**. M1 não fecha com "landing pronta mas form ainda não". M2 não fecha com "template Pacote A pronto mas editor em homologação".

### 33.14 Acompanhamento em 3 camadas (D-G74)

Separar **macro** (estado do projeto) de **micro** (estado da sessão):

| Camada        | Ferramenta                      | Pra quê                                           | Manutenção                          |
| ------------- | ------------------------------- | ------------------------------------------------- | ----------------------------------- |
| **Macro**     | GitHub Projects (Kanban)        | Fases F0-F9 + Marcos M0-M5 + sprints + burndown   | Cards movem com PRs (labels auto)   |
| **Estado**    | `docs/roadmap.md` (≤200 linhas) | Marco atual + próximo objetivo + bloqueios ativos | Atualiza ao virar de marco          |
| **Histórico** | `docs/CHANGELOG.md` (auto)      | Cada PR vira entry, agrupado por release          | `release-please` ou `changesets` CI |

Plus **TaskCreate** dentro de cada sessão Claude Code (efêmero, granular, só intra-sessão).

**Burndown = saúde:** cards open caindo = progresso real. Cards open subindo = scope creep — pausa e revisa.

**Setup dia 1 (entra no bootstrap §33.0 passo 30):**

- Criar GitHub Project com colunas: Backlog / This Sprint / In Progress / Review / Done
- Criar issues pra F0 + Marco M0 como GH milestone
- Configurar `release-please` via `.github/release-please-config.json`
- Adicionar `docs/roadmap.md` esqueleto com Marco M0 ativo

---

## 34. Worktrees + subagentes + paralelização

### 34.1 Quando usar worktree

- **1 sessão, 1 terminal:** não use worktree (main directory)
- **2+ sessões simultâneas:** obrigatório 1 worktree por sessão
- **Spike de pesquisa enquanto fase roda:** worktree separado

### 34.2 Setup worktree

```bash
git worktree add ../desafit-fase-F4 -b fase-F4 main
cd ../desafit-fase-F4
cp ../desafit/.env.local .env.local    # ⚠️ copiar manualmente
pnpm install                            # node_modules por worktree
```

### 34.3 Naming branches

- Fase: `fase-FX` (ex: `fase-F4-programs`)
- Spike: `spike-<nome>` (ex: `spike-pwa-offline`)
- Feature paralela: `feat/<agent-name>/<feature>` (ex: `feat/agentA/workout-editor`)

### 34.4 NÃO usar worktree (sequencial)

- Mudanças em `supabase/migrations/` (conflito de IDs)
- Refatoração > 50 arquivos
- Schema incompatível entre fases

### 34.5 Subagentes Claude

| Tarefa                                                                        | Tipo agente                        |
| ----------------------------------------------------------------------------- | ---------------------------------- |
| Varredura código (grep 50+ arquivos)                                          | `Explore`                          |
| Implementação isolada (1 component)                                           | `general-purpose` com tarefa clara |
| Plano detalhado (pesquisa múltiplos arquivos)                                 | `Explore`                          |
| Review (a11y, performance, DS)                                                | `component-audit` skill            |
| **NÃO usar pra:** merge coordenado, decisões arquiteturais, PRs com conflitos | —                                  |

### 34.6 Padrão "1 tarefa → 1 worktree → 1 PR → 1 verificação"

1. Claude abre worktree pra fase FX
2. Trabalha em `feat/agentX/component`
3. **Antes de push:** `pnpm tsc && pnpm vitest run && pnpm lint --max-warnings 0 && pnpm build`
4. Abre PR contra `main`
5. Aprovação = merge
6. Remove worktree: `git worktree remove ../desafit-fase-FX`

---

## 35. Preparação migração stack futura

### 35.1 RPC source of truth (já em §6.5)

Server actions são thin adapters. RPC é a interface.

### 35.2 Separação dura

- `components/` = visual + forma. Nunca chama Supabase
- `lib/domain/` = lógica pura
- `lib/data/` = IO Supabase via RPC
- **Rule:** componente nunca importa `supabase`. Sempre via hook → action → `lib/data`

### 35.3 Data layer agnóstico

```ts
// lib/data/programs.ts
export interface ProgramRepository {
  create(tenant: TenantId, input: CreateProgram): Promise<Program>
  getById(tenant: TenantId, id: ProgramId): Promise<Program | null>
}

// implementação Supabase pode ser trocada por outra impl mantendo interface
```

### 35.4 Tokens design portáveis (style-dictionary)

Preparar agora pra ser source único:

- `tokens.json` source
- `globals.css @theme` gerado
- Outputs futuros: Figma tokens, Flutter ThemeData, iOS UIKit, Android Compose

### 35.5 I18n standard (ICU)

next-intl 4 já usa ICU MessageFormat. Compatível com qualquer i18n provider (Crowdin, Phrase, etc).

### 35.6 Trade-off

- **Ganho:** poder trocar Flutter / outro DB sem reescrever 40% código
- **Custo:** 20-30% mais tempo em abstrações
- **Recomendação:** manter separação (RPC + domain + data) **sem** exagerar. Repository pattern só na camada de dados. Components falam direto com hooks.

---

## 36. Verificação dia 1 completo (checklist F0)

### Stack & configs

- [ ] `package.json` com versões pinadas (§1)
- [ ] `tsconfig.json` strict + 6 flags Research C (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `noImplicitReturns`, `verbatimModuleSyntax`) + paths + ES2022
- [ ] `eslint.config.mjs` flat + jsx-a11y strict + custom rules (§2.3)
- [ ] `.husky/` pre-commit + commit-msg + pre-push instalados
- [ ] `.github/workflows/ci.yml` com 7 jobs
- [ ] `next.config.ts` com withNextIntl + Sentry + rewrites PT→EN
- [ ] `playwright.config.ts` chromium + iPhone 14 + iPad Mini

### Banco

- [ ] Supabase project criado, JWT secret salvo
- [ ] Migration `0001_initial.sql` via `apply_migration` com core tabelas (§16.3)
- [ ] Enums `user_role` (5 vals), `membership_role` (3 vals)
- [ ] Trigger `handle_new_user`
- [ ] Trigger `custom_access_token_hook`
- [ ] RLS enable em todas tabelas (CI valida)
- [ ] 5 storage buckets com policies

### Code primitives

- [ ] `lib/domain/roles.ts`
- [ ] `lib/contracts/result.ts` + `lib/contracts/errors.ts` (Result<T, AppError> discriminated union)
- [ ] `lib/env.ts`
- [ ] `lib/hooks/use-responsive.ts`, MotionConfig root
- [ ] `lib/design/contrast.ts`
- [ ] `lib/design/tokens.ts` (deriveTokens)
- [ ] `lib/design/plugins.ts` (ContentLibraryRegistry)

### UI primitives

- [ ] Todos shadcn components instalados
- [ ] Blocks shadcn instalados
- [ ] Custom: Heading, Text, Eyebrow, Metric, DataCell, Code, Section, Stack, ResponsiveModal, CrudManager, FormModal, CopyButton
- [ ] `<Card>` 4 variants
- [ ] `<Alert>` 4 variants

### A11y + i18n

- [ ] Skip link no layout root
- [ ] `<main id="main">` no layout root
- [ ] `<MotionConfig reducedMotion="user">` no root
- [ ] `messages/pt-BR.json` + `messages/en-US.json` espelho
- [ ] Script `pnpm i18n:audit` em CI
- [ ] Script `pnpm color:audit` em CI
- [ ] `@axe-core/playwright` em 1 página de teste

### PWA

- [ ] `app/(public)/[slug]/manifest.webmanifest/route.ts`
- [ ] Serwist configurado, SW registrado
- [ ] Vapid keys geradas, env salvo
- [ ] `<meta name="theme-color">` dinâmico
- [ ] `apple-touch-icon`, `apple-mobile-web-app-*`
- [ ] `app/offline/page.tsx` branded
- [ ] Lighthouse PWA = 100 em smoke

### Regras `.claude/`

- [ ] `CLAUDE.md` raiz enxuto
- [ ] 17 arquivos `.claude/rules/*.md` (§27)
- [ ] `docs/components/decisions.md` inicializado
- [ ] `docs/components/CLAUDE.md` com regra "novo componente exige decision"

### Test bare minimum

- [ ] 1 unit test (`lib/domain/roles.test.ts`)
- [ ] 1 E2E test (`/login` carrega + axe limpo)
- [ ] Lighthouse CI rodando

### Vocabulário limpo

- [ ] Lint custom rules de palavras banidas funcionando (§0.3)
- [ ] Zero importação de `onboarding-bio`
- [ ] Zero pasta/arquivo com nome legado

---

## 38. Anti-patterns e oportunidades de diferenciação

### 38.1 Top 10 anti-patterns observados (NÃO replicar)

| #   | Anti-pattern                                                        | Origem              | Por que evitar                                                                                |
| --- | ------------------------------------------------------------------- | ------------------- | --------------------------------------------------------------------------------------------- |
| 1   | Feed social-first na home (estilo Strava)                           | Strava              | Irrelevante pra coaching personal — distrai do componente do dia                              |
| 2   | Density utility extrema (MyFitnessPal-style)                        | MFP                 | Péssimo pra programa premium; coaching pede sparse-premium                                    |
| 3   | FAB flutuante "Start workout"                                       | Vários              | Colide com gestures iOS PWA standalone; hero card já é CTA forte                              |
| 4   | Push permission no primeiro load                                    | Comum               | Kills opt-in rate (mata <20% em iOS). Sempre pre-prompt + após 3ª sessão + check-in (§10.13)  |
| 5   | Mini-infobar Chrome default exposta                                 | Default Chrome      | Esconda via `e.preventDefault()` e faça custom bottom-sheet (§10.12)                          |
| 6   | RLS com `auth.jwt()->>'tenant_id'` direto                           | Default             | 100× mais lento em tabelas grandes. Sempre `(select public.current_tenant_id())` wrap (§16.5) |
| 7   | JSON schema só no app sem CHECK constraint pra `kind`               | Tentação            | Drift em produção; sempre enum SQL + Zod consumindo                                           |
| 8   | Schema-per-tenant Supabase                                          | Tentação enterprise | Não escala >100 tenants; single-DB + RLS é o padrão (§16.1)                                   |
| 9   | Service role key client-side                                        | Erro comum          | Bypass RLS = vulnerabilidade crítica; lint custom bloqueia                                    |
| 10  | Editor visual misturando edição inline + side-panel sem regra clara | UX confuso          | Escolha: mobile read-only, desktop híbrido com text inline + props no painel (§12.4)          |

### 38.2 Top 5 oportunidades de diferenciação (gaps nos líderes do mercado)

| #   | Diferencial                                      | Gap dos concorrentes                                        | Como desafit captura                                                                                                        |
| --- | ------------------------------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1   | **White-label real completo**                    | Trainerize/TrueCoach são pseudo (só logo)                   | PWA + custom domain + push branded + email branded — tudo runtime (§7.7-§7.9)                                               |
| 2   | **IA gera programa+landing+email+push em <5min** | Concorrentes BR (PerformanceCoach et al) ainda são planilha | Vibe coding pipeline 4 estágios (§13) — UI fase 2, fundação dia 1                                                           |
| 3   | **Componente polimórfico cross-vertical**        | Concorrentes têm silos rígidos por modalidade               | `kind enum + payload jsonb + vertical_component_kinds` permite "templates mistos" e troca de vertical sem refator (§5, §16) |
| 4   | **Native-feel PWA pt-BR real**                   | Centr/Future são EUA-first                                  | Push pt-BR, Real/parcelado nativo, copy local, install custom bottom-sheet (§10.12-§10.13)                                  |
| 5   | **Editor visual de landing por prof**            | Concorrentes obrigam template fechado                       | Drag-drop com 11 blocks = posicionamento Webflow-junior pra fitness (§12) — fase 2, schema dia 1                            |

---

## 39. Princípio operacional: schema completo, UI incremental por cliente

> **D-G35 (REVISTO 2026-05-17):** o erro #2 do onboarding.bio (depois do loop de refatoração) foi construir UI de tudo antes de ter cliente que justificasse. Resultado: 6 painéis adminzão pra features que ninguém usava + débito de manutenção.
>
> **Regra desafit (refinada pelo fundador):**
>
> - Schema do banco suporta **100% da proposta comercial dia 1**.
> - **Ideal:** cada feature é construída JUNTO com sua UI/ferramenta. Manual é exceção, não regra.
> - **Exceção aceita:** quando cronograma do fundador apertar entre 1º cliente e prazo de entrega, fundador opera manual (admin/SQL/Figma) pra entregar a feature ao **1º cliente**.
> - **Catch-up obrigatório:** UI/ferramenta da feature é construída **antes do 2º cliente** entrar. Não esperar demanda de 3+ tenants — a própria existência do 2º cliente é o gatilho.
> - **Exceção da exceção:** se cronograma estourar entre 1º e 2º cliente também, ferramenta pode esperar mais 1 cliente. Mas é exceção registrada em ADR, não default.

### 39.1 Como aplicar

1. Toda feature da proposta tem **schema dia 1** (tabelas, relations, RLS, índices).
2. Toda feature da proposta é **entregue ao primeiro cliente** — funcionando (preferencialmente automatizada; manual se cronograma apertar).
3. Cada feature tem 2 fases:
   - **Fase A (ideal):** schema + ferramenta entram juntos. 1º cliente já recebe self-service.
   - **Fase B (fallback):** schema entra; fundador opera manual pro 1º cliente; ferramenta vira sprint imediato pós-1º cliente.
4. Antes do 2º cliente entrar: **toda feature usada por ele tem ferramenta pronta**. Sem exceções salvo cronograma documentado em ADR.
5. **Nunca quebrar promessa da proposta** — features são entregues. Jeito de criar pode ser manual fundador SÓ pro 1º cliente, NUNCA pro 2º+.

### 39.2 Tabela features da proposta vs 1º cliente vs 2º cliente

| Feature da proposta                             | Schema dia 1                                                       | 1º cliente (fallback aceito)                               | 2º cliente (ferramenta obrigatória)                                         |
| ----------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| Página de vendas custom por tenant              | ✅ `pages` draft/published                                         | Fundador monta JSON via admin/SQL                          | Editor visual drag-drop §12 pronto                                          |
| Banner de capa de programa                      | ✅ `cover_image_url`                                               | Fundador faz Figma/Canva + upload                          | Gerador IA (Replicate Flux Schnell $0.003/img) OU upload self-service       |
| Vibe coding (gerar programa com IA)             | ✅ `ai_prompts/versions/invocations`                               | Fundador monta programa direto no painel do prof           | Pipeline stepper UI §13 pronto                                              |
| Editor visual drag-drop páginas                 | ✅ `pages.draft_blocks/published_blocks`                           | Páginas montadas via JSON (admin)                          | Editor dnd-kit §12 pronto                                                   |
| Checkout (Pix + cartão)                         | ✅ `payments`, `payment_methods`                                   | Botão "comprar" → link externo Asaas/Stripe (já funcional) | Mesma coisa (não tem manual aqui)                                           |
| Cupons configuráveis                            | ✅ `coupons`                                                       | ✅ CRUD básico painel admin                                | Funcional                                                                   |
| Pixel Meta + GA4 por tenant                     | ✅ `tenants.pixel_meta_id`, `ga4_id`                               | ✅ campo no settings                                       | Script tag injetada via tenant config                                       |
| Cálculo TDEE/macros                             | ✅ função pura `lib/domain/nutrition.ts`                           | ✅ formulário                                              | Sem IA, fórmulas Mifflin-St Jeor                                            |
| Biblioteca 800+ exercícios                      | ✅ seed do free-exercise-db                                        | ✅ picker no painel                                        | Funcional                                                                   |
| App PWA com marca (Android+iPhone)              | ✅ `tenants.theme_tokens` + manifest dinâmico                      | ✅ runtime                                                 | Funcional dia 1                                                             |
| Check-in diário                                 | ✅ `component_progress`, `check_ins`                               | ✅ form 3 campos                                           | Funcional                                                                   |
| Galeria antes/depois                            | ✅ `progress_photos`                                               | ✅ upload + compare slider                                 | Funcional                                                                   |
| Notificações push configuráveis                 | ✅ `push_subscriptions`, `push_messages`                           | ✅ subscribe flow + admin templates                        | Funcional                                                                   |
| Streak de dias consecutivos                     | ✅ função pura + cron daily                                        | ✅ pill no header                                          | Funcional                                                                   |
| Marcação séries/reps/cargas                     | ✅ `workout_logs`                                                  | ✅ form inline no workout + RPC `complete_set`             | Funcional                                                                   |
| Painel administrativo completo (prof)           | —                                                                  | ✅ CRUD tudo                                               | Funcional                                                                   |
| Migração de alunos via planilha                 | ✅ `import_jobs`                                                   | ✅ CSV upload + parsing                                    | Funcional                                                                   |
| Treinamento por videoconferência                | —                                                                  | —                                                          | Fundador marca Zoom manual                                                  |
| Email transacional domínio custom               | ✅ `tenants.email_domain`                                          | ✅ Resend domain verify flow                               | Funcional (Pacote B/C)                                                      |
| Painel de leads                                 | ✅ `leads`                                                         | ✅ CRUD + export                                           | Funcional                                                                   |
| Gamificação personalizada (bônus mês 3)         | ✅ `achievements`, `badges`                                        | ❌ admin UI custom                                         | Fundador cria badges direto no SQL/admin                                    |
| Chatbot nutricional IA (bônus pós-Pacote C)     | ✅ `chatbot_threads`, `chatbot_messages`                           | ✅ UI chat (Vercel AI SDK + Haiku)                         | Funcional pós entrega mês 1 Pacote C                                        |
| Live agendada                                   | ✅ `kind='scheduled_live'`                                         | ✅ form: URL + data + duração                              | Funcional                                                                   |
| Call individual                                 | ✅ `kind='individual_call'`                                        | ✅ form: URL booking + provider                            | Funcional                                                                   |
| Encontro presencial                             | ✅ `kind='in_person_class'`                                        | ✅ form: endereço + data + capacidade                      | Funcional                                                                   |
| Cohort (turma fechada)                          | ✅ `programs.cohort_type='live'` + `enrollments.cohort_start_date` | ✅ admin escolhe ao criar                                  | Funcional                                                                   |
| Perpétuo vs lançamento                          | ✅ `programs.enrollment_window`                                    | ✅ admin escolhe                                           | Funcional                                                                   |
| Multi-vertical (musculação→inglês→nutrição→etc) | ✅ `verticals` + `vertical_component_kinds` (§5)                   | ✅ enum estendido dia 1                                    | Vertical nova ativada = preencher messages + ativar `verticals.active=true` |
| Multi-moeda (BRL→USD/EUR/GBP)                   | ✅ `currencies`, `exchange_rates`, `Money` value object            | ✅ Stripe internacional via `payment_methods`              | Funcional dia 1                                                             |

### 39.3 Gatilhos pra promover de manual → ferramenta

**Default:** ferramenta entra entre 1º e 2º cliente (sprint imediato pós-entrega 1º).

**Adiamento aceito (registra em ADR):**

| Ferramenta                             | Pode adiar pra X cliente se               | Justificativa pra adiar                                                                                                                                     |
| -------------------------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Editor visual de páginas (§12)         | 3º cliente                                | Volume baixo de páginas por tenant (1-3); JSON manual leva 30min/página, ferramenta leva 2 semanas. Só vale se 2º cliente entrar com pedido de auto-edição. |
| Pipeline vibe coding UI (§13)          | 3º cliente                                | Idem — programa montado manual leva 2-4h, pipeline leva 3+ semanas. Adia se 2º cliente vier de modalidade muito específica (one-off).                       |
| Gerador IA capa de programa            | 5º cliente                                | Figma+upload leva 15min/capa. Replicate Flux só vale com volume ≥5 programas/mês.                                                                           |
| Multi-modal input vibe (PDF→estrutura) | Quando 3+ tenants chegarem com PDF legado | Não é proposta core; vira upsell                                                                                                                            |
| Email templates editáveis              | Pacote C scale (≥10 clientes Pacote C)    | Templates editados via repo cobrem 1-10 clientes sem problema                                                                                               |

**Não pode adiar (entra junto com 1º cliente):**

- Checkout funcional (link externo gateway)
- Login + senha aluno e prof
- Push + email (Resend + Web Push)
- Painel admin CRUD básico (tenants, programas, módulos, componentes, alunos, leads)
- Chatbot IA Pacote C (não tem versão manual viável)

### 39.4 O que NÃO entra mesmo com pedido (anti-scope-creep)

- Editor de cor de cada bloco da landing individualmente (theme global é suficiente)
- Custom blocks user-defined com SDK (mantém 11 blocks core)
- Colaboração realtime no editor (fora do modelo agência)
- A/B test de páginas (precisa volume >100 visitas/dia)
- Comunidade pública entre alunos de tenants diferentes (escopo SaaS marketplace)

---

## 40. Próximos passos (ordem inviolável)

1. ~~Disparar Research B (AI engineering) e Research C (DX + Claude Code + anti-refactor)~~ — **CONCLUÍDO 2026-05-17** (D-G43..D-G65 integradas)
2. ~~Integrar resultados B + C neste master plan~~ — **CONCLUÍDO 2026-05-17**
3. **Disparar Pesquisa Design System** (prompt em conversa atual — DS tokens + white-label runtime + 14 padrões token-bypass + acessibilidade + animation system). Integrar quando voltar.
4. **Criar repo `desafit/`** (novo, fora do dir `onboarding-bio/`)
5. **Copiar este doc** pra `desafit/docs/core/master-plan.md`
6. **CLAUDE.md raiz** apontando pra este doc + 4-5 regras críticas inline (§27.1 template)
7. **Bootstrap semana 1** (§33.0) — defensivo mínimo antes de qualquer feature
8. **Bootstrap F0** (§33.1) — fundação completa antes de qualquer feature, governada por §39 (schema completo, UI por cliente)
9. **Smoke test F0:** signup → tenant criado → JWT carrega → primeira página renderiza
10. ~~Resolver §31.3 #8 (eslint exception TenantThemeStyle) antes de codar §7.7~~ — **RESOLVIDO** (D-G59, CSS via API route)
11. **F1-F9 em paralelo** seguindo matriz §33.11 + princípio §39 (ferramenta vem com 1º cliente OU sprint imediato pós)
12. **Smoke test beta com primeiro tenant real** (F9)

---

## 41. Tabela canônica Research C — referência pinada

Ferramenta × propósito × decisão × motivo. Consultar como checklist único pra revisar bootstrap.

| Ferramenta / config                                                                        | Propósito                     | Decisão                           | Motivo                                                     |
| ------------------------------------------------------------------------------------------ | ----------------------------- | --------------------------------- | ---------------------------------------------------------- |
| **Claude Code core**                                                                       |                               |                                   |                                                            |
| `CLAUDE.md` < 200 linhas + `@imports`                                                      | Memória entre sessões         | **[E]** D-G60 §27.1               | Arquivos longos são ignorados pelo Claude                  |
| `.claude/rules/*.md` com `paths:`                                                          | Regras contextuais lazy       | **[E]** D-G60 §27.2 — 20 arquivos | Economia drástica de contexto                              |
| 3 hooks dia 1 (block-disables / format-on-write / vocab-reminder)                          | Anti drift Claude             | **[E]** D-G60 §27.3               | Única defesa determinística contra Claude escapar regras   |
| Slash commands `/adr` + `/release-check`                                                   | Workflows determinísticos     | **[E]** §27.4                     | Começa com 2, cresce orgânico                              |
| Skills custom                                                                              | Auto-invoke                   | **[O]** dia 1 §27.5               | Auto-invoke inconsistente; mover slash → skill com 3+ usos |
| Subagents custom (reviewer)                                                                | Trust but verify              | **[I]** §27.6                     | Cherny não customiza; só após stack firmar                 |
| MCPs: shadcn + Supabase + Context7                                                         | Stack-specific helpers        | **[E]** §27.7                     | Alto ROI Next 16 / Zod 4 / Tailwind v4                     |
| Plan Mode obrigatório > 1 arquivo                                                          | Anti improviso                | **[E]** §27.8                     | Plano antes do disco                                       |
| Worktrees vs checkouts                                                                     | Paralelização                 | Heurística §27.9                  | Backend = checkouts; frontend isolado = worktree           |
| **TypeScript / ESLint**                                                                    |                               |                                   |                                                            |
| TS strict + 6 flags extras                                                                 | Type safety                   | **[E]** D-G58 §1.5                | Custo nulo greenfield, ROI alto                            |
| `typescript-eslint strict-type-checked + stylistic-type-checked`                           | Lint pesado                   | **[E]** §2.3                      | Preset oficial                                             |
| `@eslint-community/eslint-comments/no-use` + allowlist 2 strings                           | Bane disable                  | **[E]** D-G11 §2.3                | Resolve 830 disables                                       |
| `unicorn/no-abusive-eslint-disable`                                                        | Cinto+suspensório             | **[E]** §2.3                      | Defesa adicional                                           |
| `no-restricted-imports` (framer-motion / legacy / supabase admin)                          | Travar stack                  | **[E]** §2.3                      | Resolve drift de stack                                     |
| `id-denylist` (15 termos)                                                                  | Travar vocabulário            | **[E]** D-G14 §2.3                | Resolve drift de vocabulário                               |
| `max-lines: 300 / function 60 / complexity 12 / depth 4 / params 4`                        | Anti overengineering          | **[E]** D-G56 §3.3                | Resolve 30+ camadas                                        |
| `eslint-plugin-better-tailwindcss`                                                         | Tailwind v4 nativo            | **[E]** §2.3                      | Único que suporta v4                                       |
| `react-hooks/exhaustive-deps` + `react/jsx-no-leaked-render` + `react/jsx-no-literals`     | React/Next                    | **[E]** §2.3                      | Defaults sanos                                             |
| `@softarc/sheriff` (boundaries)                                                            | Anti cross-import             | **[E]** D-G57 §1.6                | Resolve `lib/data` → `app/`                                |
| `dependency-cruiser` CLI                                                                   | Detectar circular             | **[I]**                           | Complemento Sheriff quando necessário                      |
| `eslint-plugin-functional`                                                                 | Imutabilidade rigorosa        | **[O]**                           | Custo alto solo                                            |
| Custom ESLint plugin caseiro                                                               | Regras domínio                | **[O]**                           | `no-restricted-*` cobre 95%                                |
| `eslint-plugin-i18next` + 14 regras `no-restricted-syntax`                                 | i18n hardcoded                | **[E]** D-G66 §15.7               | Resolve hardcoded onboarding-bio                           |
| **Contratos**                                                                              |                               |                                   |                                                            |
| Zod 4 em `lib/contracts/` (renomeada)                                                      | SSOT                          | **[E]** D-G54 §6                  | Substitui `lib/domain/schemas/`                            |
| `Result<T, AppError>` discriminated union                                                  | Server Actions                | **[E]** D-G55 §6.4                | Sobrevive refactor + exhaustive check                      |
| `@hookform/resolvers/standard-schema`                                                      | RHF + Zod 4                   | **[E]** D-G65 §6.6                | Workaround bugs discriminatedUnion                         |
| Supabase `types.gen.ts` + CI drift check                                                   | Schema↔código sync            | **[E]** §29.1                     | Doc oficial supabase/setup-cli                             |
| Adapter `fromRow()`                                                                        | Persistence ↔ domain          | **[E]** D-G54 §6.5b               | Resolve acoplamento direto                                 |
| OpenAPI generation                                                                         | Multi-cliente                 | **[O]**                           | YAGNI mono-app                                             |
| tRPC                                                                                       | Type-safe API                 | **[O]**                           | Server Actions ganham mono-app                             |
| **Pre-commit / CI**                                                                        |                               |                                   |                                                            |
| Husky + lint-staged `--no-inline-config`                                                   | Pre-commit pequeno            | **[E]** §29.2                     | < 5s típicos                                               |
| pnpm caching no GHA                                                                        | Velocidade CI                 | **[E]** §29.1                     | actions/setup-node cache:pnpm                              |
| `pnpm typecheck` no CI                                                                     | Type safety full              | **[E]** §29.1                     | Não-negociável                                             |
| `pnpm lint --max-warnings 0 --no-inline-config`                                            | Zero warnings + zero disables | **[E]** §29.1+§29.2               | Anti drift                                                 |
| **knip** dead code                                                                         | Dead code/deps                | **[E]** §29.1                     | Plugin Next/size-limit built-in                            |
| **size-limit** bundle budget                                                               | Bundle gate                   | **[E]** D-G64 §29.1               | Next 16 removeu per-route stats                            |
| Playwright CI com cache `~/.cache/ms-playwright`                                           | E2E                           | **[E]** §29.1                     | Cache                                                      |
| Vitest + coverage                                                                          | Unit/contract                 | **[E]** §29.1                     | Default stack                                              |
| Lighthouse + axe-core CI (label `perf`/`a11y`)                                             | Perf/A11y                     | **[I]** §29.1                     | Não queimar minutes                                        |
| commitlint                                                                                 | Conventional commits          | **[I]**                           | Útil pra changelog                                         |
| Lefthook                                                                                   | Substituto Husky              | **[O]**                           | Husky basta solo                                           |
| Turborepo                                                                                  | Cache tasks                   | **[O]**                           | Sem ROI mono-app                                           |
| **Anti-refactor**                                                                          |                               |                                   |                                                            |
| ADRs em `docs/adr/*.md` + `/adr` slash                                                     | Decisões rastreáveis          | **[E]** D-G61 §29.7b              | Resolve 10 reversões                                       |
| Estrutura `app/ + lib/` (master plan §3.4) — vertical slices em `features/` quando 3+ usos | Estrutura                     | **[E]** §3.4                      | Greenfield solo otimizado                                  |
| FSD puro 5 camadas                                                                         | Idem                          | **[O]**                           | Overhead cognitivo                                         |
| `renovate.json` restritivo (major bloqueado)                                               | Pinagem                       | **[E]** D-G62 §29.7f              | Resolve majors acidentais                                  |
| Rule-of-three no CLAUDE.md                                                                 | Anti premature abstraction    | **[E]** §27.1                     | Resolve 30+ camadas                                        |
| Regra "service layer 3 critérios"                                                          | Anti service vazio            | **[E]** §27.1                     | Resolve overeng específico                                 |
| **Living docs**                                                                            |                               |                                   |                                                            |
| Hierarquia fonte da verdade                                                                | Anti drift                    | **[E]** §29.7c                    | Código > contracts > ADR > rules > CLAUDE.md               |
| Auto-injection `docs/auto/INDEX.md`                                                        | Drift detection               | **[I]** §29.7e                    | Quando rotas > 20                                          |
| Doc drift check CI                                                                         | Refs válidas                  | **[I]** §29.7d                    | Quando docs crescer                                        |
| Hook lint-claude-md (size, imports)                                                        | Defesa crescimento            | **[I]** §27.3                     | [I]                                                        |
| **Stack-specific**                                                                         |                               |                                   |                                                            |
| Tailwind v4 `@theme` tokens                                                                | Design tokens                 | **[E]** §7                        | Doc oficial                                                |
| `eslint-plugin-better-tailwindcss`                                                         | Bloqueia `bg-[#hex]`          | **[E]** §2.3                      | Resolve hex sprawl                                         |
| Bane `framer-motion` import                                                                | Stack canônico                | **[E]** §2.3                      | Resolve vocab stack                                        |
| `lib/supabase/{client,server,admin}` + `'server-only'` em admin                            | Isolation                     | **[E]** D-G63 §16.17b             | Resolve admin em client                                    |
| Restringir `@supabase/supabase-js` direto                                                  | Forçar wrapper                | **[E]** §2.3                      | Resolve `createClient()` espalhado                         |
| Server Actions naming `*.action.ts` + `Result` retorno                                     | Convenção                     | **[E]** §6.3                      | Resolve mutações erráticas                                 |
| CSS via API route `/api/tenants/[id]/theme.css`                                            | White-label runtime           | **[E]** D-G59 §7.7                | Zero `dangerouslySetInnerHTML`                             |
| next-intl 4 + 14 regras hardcoded                                                          | Strings traduzidas            | **[E]** D-G66 §15.7               | Defesa multi-camada                                        |

---

## Lembrete final

**O erro #1 do onboarding.bio foi tentar fazer tudo rápido e ficar em loop de refatoração até abandono.**

Solução desafit:

- Decidir tudo **aqui neste doc** antes de qualquer commit
- Cada feature tem schema + RLS + RPC + Zod + primitive UI **antes** do código
- 1 tarefa → 1 worktree → 1 PR → 1 verificação completa
- Zero `eslint-disable` (cria primitive)
- Zero vocabulário herdado (`intake`, `wizard`, `student`, `trainer`, etc)
- SOLID sem virar burocracia (Single Responsibility é a única regra inegociável)
- Aproveitar bibliotecas testadas (sem trazer código com vocabulário/abstrações legadas)

**Quando dúvida arquitetural surgir:** voltar pra este doc. Se não cobre, registra decision nova aqui antes de codar.
