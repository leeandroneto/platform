# Claude — contexto do projeto retake.run

> Última atualização: 2026-06-11 (foundation gerada).
> Status: foundation criada. S0 (cleanup + estrutura) feito. Próximo: S1 (tokens + fonts + shadcn vestido + layouts) — ver `docs/plans/foundation.md`.

---

## Projeto

**retake.run** — plataforma vertical de **corrida** (endurance) no Brasil. Serve assessorias, run clubs e coaches autônomos (mesma entidade `tenant`, plano define o que pode).

**Arquitetura:** 1 marca retake, 1 código, 1 deploy. Tenants vivem em `retake.run/{slug}` por path default. Subdomínio + CNAME = upsell Apoiador/Membro.

**5 públicos:**

1. Tenants pagantes (assessoria/run club/coach autônomo)
2. Atletas (consumer, app nativo único retake — sem PWA web)
3. Sponsors (marcas com escopo geográfico — estadual/nacional/oficial)
4. Suppliers (fornecedores B2B vitrine)
5. Event organizers

**Fosso:** núcleo de treino de corrida (periodização → segmentado → prescrito×executado → integração wearables).

Detalhes completos em `docs/_handoff/` (4 docs + Design System completo).

---

## Onde fica cada coisa

| Info                                  | Arquivo canônico                                                    | Audience                                          |
| ------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| **Visão geral pro fundador** (humano) | `FOUNDER.md` raiz                                                   | **Humano — não autocarregar.** Read JIT se pedido |
| Handoff (SSOT produto)                | `docs/_handoff/README.md` + 3 docs + DS folder (intocável)          | Claude + Humano                                   |
| ADR fundadora                         | `docs/adr/0001-foundation.md`                                       | Claude + Humano                                   |
| Blueprint produto                     | `docs/blueprint/00-projeto.md`                                      | Claude + Humano                                   |
| Schema completo previsto              | `docs/blueprint/01-schema-completo.md`                              | Claude + Humano                                   |
| DBML formal (visualize dbdiagram.io)  | `schema.dbml` raiz                                                  | Humano                                            |
| Plano execução                        | `docs/plans/foundation.md`                                          | Claude                                            |
| Memória cravada                       | `~/.claude/projects/.../memory/project_retake_decisoes_cravadas.md` | Claude (auto)                                     |
| Migrations docs                       | `docs/migrations/NNNN_*.md`                                         | Claude                                            |

**Hierarquia de conflito:** Handoff > ADR-0001 > CLAUDE.md > Plano ativo > Memory > Session.

**FOUNDER.md é doc humano** — NÃO autocarregar (consome contexto + risco de staleness). Só Read quando o owner pedir visão geral. Hook `enforce-founder-md-update.sh` avisa quando ADR-0001/foundation.md/schema mudam pra atualizar FOUNDER.md junto.

**Rules path-loaded** (`.claude/rules/*.md`):

- `layers` — camadas arquitetura (UI→Server Action→Data→Domain→Contracts, desce nunca sobe)
- `data-layer` — `lib/data/*` patterns com `'server-only'`
- `state-management` — RHF pra forms, Zustand pra editors, nunca sincronizar
- `naming` — vocab retake corrida + camada staff/equipe
- `design-tokens` — shadcn-canonical + extensões opt-in retake
- `jsonb-vs-normalized` — **framework cravado pra TODA decisão de tabela/coluna nova**
- `i18n` — 3 locales dia 0 (pt-BR/en/es)
- `contrast` — APCA Lc ≥ 60
- `shadcn-zone` — `components/ui/*` quarentenada, canal único `npx shadcn add`
- `entitlements` — `requireEntitlement` + `requireQuota` server-side
- `agent-safeguards` — anti-hallucination + anti-simplification

---

## Stack travado

Next 16 (App Router + Turbopack + `proxy.ts`) · React 19 · Tailwind v4 (`@theme` OKLCH) · shadcn new-york (light-first vestido retake) · Motion 12 (`motion/react`) · Supabase `@supabase/ssr` 0.10 · Zod 4 + RHF 7 + Zustand 5 · next-intl 4 (3 locales: pt-BR + en + es) · pnpm 10 · **Oswald + Hanken Grotesk + Space Mono** via `next/font/google` · Vitest + Playwright · AI SDK v6 + AI Gateway + Sonnet 4.6 + Haiku 4.5 + cache TTL 1h · TanStack Query · date-fns · Recharts · Lucide · DOMPurify · BotID · Resend.

**JIT:** Storybook · Plate.js v53 · Tremor · react-pdf/docx/xlsx/pptxgenjs · Pagar.me/Asaas/Stone · Mux · Cal.com · Garmin/Strava/Polar/Coros · Anthropic Files API · Fal.ai Nano Banana 2.

**Apagado pós-pivot:** Serwist + sw.ts + manifest routes (PWA) · Geist · v0-1.5-md · @ai-sdk/anthropic direto · Mermaid/Markmap/dotlottie (sobrevivem como artefato de chat só JIT).

---

## Schema único `public.*`

RLS = fronteira de segurança. Schema separado SÓ JIT (PCI scope, secrets vault). `auth.*`/`storage.*`/`realtime.*` Supabase managed.

---

## Identidade — Party Model + 5 camadas auth

- `public.parties` (pessoa OR organização, liga `auth.users`)
- `public.party_roles` (role_type + scope_kind + status)
- `public.party_relationships` (vínculos com `terms jsonb` + `platform_fee_cents`)
- `public.tenants` materializado de `party_role(tenant)` pra perf RLS
- `public.memberships` (role enum 7 valores: owner/coach/finance/reception/marketing/athlete/lead + position_label + permissions jsonb + group_id)
- `public.groups` + `group_assignments` (data scope)
- JWT injeta: tenant_id + active_membership_role + party_id

---

## Camadas

`lib/contracts/` SSOT Zod · `lib/domain/` lógica pura · `lib/data/` IO Supabase (`'server-only'`, lança erro) · `lib/hooks/` estado React · `lib/services/` **vazio por design** · `app/<route>/actions.ts` `{ok,data}|{ok,error}` · UI RSC default. Dependência desce, nunca sobe.

---

## Princípio universal cravado — Zero exposição client-side

- Service role nunca client. Só Edge + Server Actions
- Sensitive data (CPF/CNPJ, dados financeiros, tokens wearable, secrets, chaves API) nunca chega ao browser
- Mutações sempre via Server Actions com `import 'server-only'` no top
- Reads sensíveis via RSC, não query browser direto
- Realtime channels: auth strict + RLS row-level + scope por tenant
- JWT minimal: `tenant_id` + `role` + `party_id`
- `lib/data/*`: `'server-only'` no topo, lança erro
- ESLint custom + Splinter zero warnings

---

## Regras críticas (toda sessão)

**Infraestrutura:**

- **JWT/RLS:** `auth.jwt() ->> 'tenant_id'` — helper único, não recriar
- **Migrations:** `mcp__plugin_supabase_supabase__apply_migration` — NUNCA `.sql` manual
- **Erros:** `lib/data/` + `lib/domain/` lançam · server actions retornam `{ok,data}|{ok:false,error}`
- **Env:** `import { env } from '@/lib/env'` (exceto `NEXT_PUBLIC_*` client)

**Vocab cravado (retake corrida):**

- `tenant`/"assessoria/run club/coach autônomo" · `staff`/"equipe" · `member`/"membro" · `owner`/"responsável" · `coach`/"treinador" · `athlete`/"atleta" · `lead`/"lead"
- Corrida-vertical: `pace` · `threshold`/limiar · `compliance`/aderência · `macrocycle`/temporada · `mesocycle`/bloco · `microcycle`/semana · `session`/sessão · `wearable`/relógio · `event`/prova · `lap`/volta · `split`/parcial · `PR` · `assessment`/avaliação · `anamnese`
- **Banidos:** `professional`/`client` (genéricos antigos) · `student`/`trainer` · `archetype`/`brand_parent`/multi-vertical anything · `framer-motion` · qualquer nome de projeto antigo

**UI/Tom retake:**

- Cadence: `RUN. EAT. RECOVERY. REPEAT.` staccato
- Casing: HEADLINES UPPERCASE (Oswald display) + sentence case body + UPPERCASE eyebrows wide tracking
- Métricas: mono tabular vírgula decimal (`48,7 km`), `R$` BR
- Imperativo curto (`Iniciar treino` / `Registrar` / `Ajustar`)
- Zero emoji

**Design system (DS retake fixo):**

- 2 universos visuais:
  - **DS retake fixo (intocável)** — painel + admin + landings + app — grafite/creme/terracota + Oswald + Hanken + Space Mono em `app/globals.css @theme inline`
  - **Tema editável** — só site público do tenant via `public.tenant_themes` versionado + `deriveTokens(primary)` Edge + APCA Lc ≥ 60 single gate
- 3 níveis tenant: Grátis (6 paletas curadas) · Apoiador (theme builder completo + IA cor de foto) · Membro (bespoke retake + builder pós-edição)
- Componentes: `components/ui/*` shadcn token-agnostic · `components/retake/*` atléticos (StatCard mono, ComplianceTag) · `components/site/*` blocos do site
- **Vocab CSS var shadcn-canonical** (`--background`, `--foreground`, `--primary`, etc) com valores apontando pros tokens retake. Extensões opt-in pra display/pill/tracking só consumidas por `components/retake/*`.

**i18n (3 locales dia 0):**

- next-intl 4 com pt-BR + en + es
- `t('key')` desde primeira string PT-BR em chrome
- Conteúdo tenant inline JSONB (sem `t()`)

**Componentes:**

- shadcn `components/ui/*` quarentenada · canal único `npx shadcn add` · light-first vestido tokens retake
- Mobile-first 13 itens (relevante pra site público + futuro app nativo)
- Cada componente novo passa pelo A-J governance

**Produto cravado:**

- **Sites públicos tenant**: 1 template fixo dia 1 + galeria de estilos JIT (Apoiador) + Membro bespoke. Toggle visibility de seções. Dados em tabelas template-agnostic. Composição em `page_versions.content jsonb` (vibe-coding-ready).
- **Onboarding tenant**: chat-as-form (IA-first) com uploads (prints Insta + PDFs) → IA extrai paleta/copy/dados/voz, cria cadastros automaticamente.
- **Form Engine**: 3 categorias — captação híbrida fixo+jsonb (site público) · anamnese fixa corrida (JIT app atleta) · ops RHF (dashboard). Sem builder genérico.
- **IA**: arquitetura multi-agent (`chats.agent_kind enum`) + tools registry SSOT (`public.ai_tools`) + approval gate opt-in (`engine_plans`). UX Opção C: chat com preview embarcado + chat geral balão flutuante + inline ✨/`/ai`.
- **Recursos físicos + Parcerias + Comissões**: `public.resources` + `party_relationships.kind` estende (external_partner/internal_partner/space_rental) + `services` curado corrida + `service_providers` + `commission_rules`.
- **Planos**: 3 audiences (tenants/sponsors/suppliers) + Grátis perpétuo (sem trial) · Apoiador R$29/mês anual ou R$19/mês bienal · Membro R$59/mês anual ou R$39/mês bienal · sponsors estadual R$100/UF ou nacional R$500/mês · supplier Vitrine B2B R$99/mês · tráfego pago Setup R$1.500 (Membro R$1.050). Preços NO BANCO.

**Rotas PT-BR (retake):**

- `retake.run/` · `/entrar` · `/cadastrar` · `/sair`
- `/dashboard/inicio` · `/dashboard/meu-site` · `/dashboard/leads` · `/dashboard/atletas` · `/dashboard/equipe` · `/dashboard/recursos` · `/dashboard/parceiros` · `/dashboard/servicos` · `/dashboard/comissoes` · `/dashboard/eventos` · `/dashboard/configuracoes`
- `retake.run/{slug}` — site público do tenant
- `admin.retake.run/*` — admin platform (staff retake)
- `/patrocinio` · `/empresas` · `/corredores` · `/eventos` · `/plataforma` · `/novidades` — landings retake

---

## Test e build

```bash
pnpm typecheck                            # 0 erros
pnpm vocab:audit && pnpm i18n:audit       # vocab retake + 3 locales
pnpm lint --max-warnings 0                # 0/0
pnpm test                                 # vitest 100%
pnpm build                                # verde
```

Antes de PR: rodar os 5 acima + visual check browser real.
