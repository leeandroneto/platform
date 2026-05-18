# 12 — Sprint Plan (16 sprints / 4 meses)

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Granularidade semanal pra cumprir cronograma `11-roadmap.md` (M0 → M4 = 16 semanas).
> Absorve pesquisa 07 (planejamento-ordem-execucao) e princípio §39 verbatim.
> **Regra:** sprint só fecha quando _Gate de avanço_ passa — sem "85% done". Pesquisa 07 §11.

---

## 0. Convenções desta planilha

| Campo            | O que é                                                         |
| ---------------- | --------------------------------------------------------------- |
| **Goal**         | 1 frase. Outcome (não output). Sem feature laundry list         |
| **Deliverables** | 1-3 entregas concretas, demonstráveis end-to-end                |
| **Dependências** | Sprint X que precisa estar fechado antes                        |
| **DoD**          | Definition of Done — checklist binário, sem cinza               |
| **Quem domina**  | `fundador manual` / `Claude Code vibe coding` / `híbrido`       |
| **Gate**         | Critério único pra liberar próximo sprint. Sem isso, não avança |

**Ordem entre camadas (master plan §16.2 + §17.10 + §29.4):**

1. **Schema** antes de Server Action — sem tabela+RLS, action não tem onde escrever
2. **Server Action** antes de UI — sem `{ ok, data }`, componente não tem o que renderizar
3. **Edge Function rodada local** antes de prompt em produção — pesquisa 07 §6: nunca aceitar 1ª saída da IA, esperar 3 iterações
4. **Pipeline UI dia 0 (~70h)** antes de qualquer feature — \_CONFLITOS #16
5. **Funil agência (M1)** antes de PWA aluno (M2+) — \_CONFLITOS #6 + pesquisa 07 §1

**Princípio §39 explícito (memória `project_desafit_principio_39_revisto.md`):**

- Ferramenta entra **junto com 1º cliente** que precisar dela
- Manual só pro 1º se cronograma apertar — sprint imediato pós-1º cliente entrega ferramenta antes do 2º
- Adiamentos pra 3º+ cliente registram ADR

**Mobile-first 100% INCLUINDO painel prof (00-PROJETO §7):** todo sprint testa em iPhone 14 portrait (375px) antes de fechar.

---

## M0 — Bootstrap (Sprints 1-2)

### Sprint 1 — Repo + Schema baseline

- **Goal:** repo `desafit/` cria, builda, deploya em Vercel. Schema baseline ~22 tabelas aplicado em Supabase NOVO com RLS funcional.
- **Deliverables:**
  1. `create-next-app` Next 16 + TS strict++ + Tailwind v4 + pnpm + Husky + commitlint (decisão D-G1 — repo separado em pasta fora `onboarding-bio/`)
  2. Migration `0001_initial.sql` via `mcp__supabase__apply_migration` — todas tabelas `06-data-model.md §3` + `custom_access_token_hook` + trigger `handle_new_user`
  3. CI pipeline (typecheck → lint → knip → grep-disables → vitest → size-limit) verde no 1º push
- **Dependências:** nenhuma — sprint zero absoluto
- **DoD:**
  - [ ] `pnpm build` passa em CI
  - [ ] `pnpm typecheck` 0 erros
  - [ ] `pnpm lint --max-warnings 0` 0/0
  - [ ] Migration aplicada — `mcp__supabase__list_tables` retorna ~22 tabelas
  - [ ] Smoke RLS: insert direto em `public.programs` sem JWT → bloqueado
- **Quem domina:** **fundador manual** (decisões one-way door — pesquisa 07 §12). Claude Code só revisa migration final.
- **Gate:** signup smoke — criar conta nova via form → trigger cria `profiles + tenants + memberships` atomicamente → JWT carrega `tenant_id + active_membership_role`. Sem isso, Sprint 2 não começa.

### Sprint 2 — Pipeline UI dia 0 (~70h)

- **Goal:** design system tokenizado completo + primitives custom + 13 paletas OKLCH + APCA dual-gate enforcado + Motion 12 presets.
- **Deliverables:**
  1. 13 paletas OKLCH migradas verbatim de `app/preview/paletas/page.tsx` → `lib/design/palettes.ts` (D-G76)
  2. Primitives custom dia 1 (`05-design-system.md §10`): `<Heading>` `<Text>` `<Eyebrow>` `<Metric>` `<DataCell>` `<Code>` `<Section>` `<Stack>` `<Container>` `<EmptyState>` + Motion presets + tab bar mobile + safe-area handling iOS
  3. shadcn 100% instalado + 3 hooks Claude Code dia 0 + 3 grep scripts CI (`i18n:audit`, `vocab:audit`, `token:audit`)
- **Dependências:** Sprint 1
- **DoD:**
  - [ ] Storybook-livre (Ladle) sobe com 12 primitives renderizadas
  - [ ] Lighthouse `/login` ≥ 90 perf / A11y 100
  - [ ] CSS do tenant carrega via `/api/tenants/[id]/theme.css` sem FOUC (D-G59)
  - [ ] Teste APCA reprova combo `oklch(0.5 ...) on oklch(0.45 ...)` (dual-gate body ≥75)
  - [ ] Build em viewport 375px funcional (Chrome devtools touch real, não simulator)
- **Quem domina:** **Claude Code vibe coding** com fundador revisando 2× ao dia. Paletas e tokens APCA decididos pelo fundador (one-way door).
- **Gate:** pipeline UI dia 0 fechada — qualquer feature subsequente reusa primitives. Sem isso, M0 não fecha e M1 não começa (master plan §33.0).

---

## M1 — Funil agência (Sprints 3-4)

### Sprint 3 — Schema captação + landing institucional

- **Goal:** landing `desafit.app` no ar + form captação multi-step funcionando + schema `leads/capture_forms/capture_submissions` com Server Actions.
- **Deliverables:**
  1. Landing institucional desafit + página `/agencia` (proposta comercial) — copy via `messages/pt-BR.json` (zero hardcoded — `03-naming-vocab.md §6`)
  2. Schema `public.leads + capture_forms + capture_submissions` + Server Action `submitCaptureForm` retornando `{ ok, data: { lead_id } }`
  3. Form multi-step RHF + Zod 4 (standard-schema resolver), mobile-first absoluto 375px
- **Dependências:** Sprint 2 (precisa do pipeline UI dia 0 — \_CONFLITOS #16)
- **DoD:**
  - [ ] Form preenchido cria `lead` row + `capture_submission` row
  - [ ] Server Action retorna `{ ok, data }` ou `{ ok: false, error }` (pattern `lib/contracts/result.ts`)
  - [ ] 1º teste Playwright: form → submit → assert `lead` em DB
  - [ ] Mobile painel-prof ainda não existe; landing testada em 375px touch real
- **Quem domina:** **híbrido** — schema+RLS fundador, UI form Claude Code vibe coding, copy fundador.
- **Gate:** 1 lead-de-teste do fundador cria row no Supabase via UI (não SQL direto). Schema → Server Action → UI conectados.

### Sprint 4 — Edge Function `generate-assessment` + WhatsApp handoff

- **Goal:** form submission dispara IA → relatório enviado por email → CTA WhatsApp pra fundador fechar venda.
- **Deliverables:**
  1. Edge Function `supabase/functions/generate-assessment/` (Deno) com Sonnet 4.6 via Vercel AI Gateway — pipeline mínima identidade→estrutura (extended thinking medium) → output JSON via 2-schema pattern (`07-ai-prompts.md §4`)
  2. Resend domain verified + React Email template `<AssessmentReport>` enviado pós-Edge Function
  3. WhatsApp handoff (`wa.me/<phone>?text=<msg pré-formatada>`) + tracking Meta Pixel/CAPI + GA4
- **Dependências:** Sprint 3 + **prompt rodado local 3× antes de subir produção** (pesquisa 07 §6 — "first attempt 95% garbage")
- **DoD:**
  - [ ] Edge Function deploy + invoca via curl com payload real
  - [ ] Email chega na inbox do fundador com relatório IA
  - [ ] `ai_invocations` row criado com SHA256 hashes (não plaintext — LGPD `07-ai-prompts.md §8.2`)
  - [ ] Latência P95 < 12s (extended thinking medium)
  - [ ] Promptfoo CI passa 5 cenários golden
- **Quem domina:** **híbrido** — prompt texto fundador (one-way door), Edge Function infra Claude Code, guardrails (PII mask + XML wrap) Claude Code.
- **Gate (M1 fecha quando):** 1 lead real (não fundador, não teste) preenche form → recebe relatório → fundador fecha venda WhatsApp = ≥ R$ 1.500 (Pacote A) em conta. Sem isso, M2 não começa.

---

## M2 — 1º tenant (Sprints 5-8)

### Sprint 5 — Admin tenant create + branding via vibe coding interno

- **Goal:** fundador cria 1º tenant via `/admin/tenants/new` em <30min. Subdomain + theme.css route + landing institucional do prof publicada.
- **Deliverables:**
  1. `/admin/tenants/new` — Server Action `createTenant` + subdomain `<slug>.desafit.app` provisionado
  2. `lib/design/deriveTokens.ts` (input cor primária OKLCH → tokens completos via 13 paletas) + `/api/tenants/[id]/theme.css?v=N` route ativa
  3. Landing institucional do prof (tier 1 editor form-based em vaul bottom sheet — pesquisa 11 editor strategy)
- **Dependências:** Sprint 4 (M1 fechado) + Sprint 2 (pipeline UI dia 0)
- **DoD:**
  - [ ] Tenant criado com 1 cor → CSS injetado sem FOUC
  - [ ] Editor form-based publica landing em < 5min de uso real
  - [ ] APCA dual-gate validado em deploy (`assertWcagWithApca` falha build se violado)
  - [ ] Editor renderiza e funciona em iPhone 14 portrait (touch real)
- **Quem domina:** **híbrido** — admin UI Claude Code, decisões de tier 1 (campos do form) fundador.
- **Gate:** prof real (1º cliente) acessa `/dashboard/site/edit` em mobile e edita landing sem ticket pro fundador.

### Sprint 6 — Capture form configurável + email transacional + checkout link

- **Goal:** prof configura form captação por modalidade + cupons + checkout link gateway externo (Asaas/Stripe BR).
- **Deliverables:**
  1. `/dashboard/capture-forms` — CrudManager pra `capture_forms.fields jsonb` (campos schema-driven)
  2. Email transacional Resend domain do prof verified + templates (assessment, welcome, payment confirmation)
  3. Tabela `public.coupons` + UI CRUD + checkout link copy-paste do gateway externo do prof
- **Dependências:** Sprint 5 (tenant criado pra ter onde configurar)
- **DoD:**
  - [ ] Prof cria form modalidade musculação em <10min
  - [ ] Email transacional sai do domínio do prof (`@<dominio-prof>`)
  - [ ] Checkout link gera pagamento real R$ 100 em conta-teste do prof
  - [ ] Cupom 10% off aplica antes do checkout
- **Quem domina:** **Claude Code vibe coding** com fundador revisando integração gateway (one-way door per modalidade — pode bloquear venda se errado).
- **Gate:** smoke E2E completo — aluno-de-teste do prof preenche form → recebe assessment → CTA WhatsApp → checkout → email confirmação.

### Sprint 7 — Leads dashboard prof + treinamento Zoom

- **Goal:** prof vê leads + assessments + status checkout em painel mobile-first. Treinamento 60min Zoom executado.
- **Deliverables:**
  1. `/dashboard/leads` — DataCell list + filters (não DataTable — pesquisa 16 priorizou DataCell mobile)
  2. `/dashboard/leads/[id]` — detail view com assessment IA preview + WhatsApp CTA + status pagamento
  3. Treinamento Zoom executado (60min gravado, Loom referência pra próximos profs — pesquisa 07 §13)
- **Dependências:** Sprint 6
- **DoD:**
  - [ ] Prof acessa `/dashboard/leads` em iPhone 14 portrait e navega sem zoom
  - [ ] Detail view abre em <800ms (RSC + lazy detail)
  - [ ] Treinamento 60min Zoom rodou — prof saiu sabendo: criar form, ver lead, fechar via WhatsApp
- **Quem domina:** **Claude Code vibe coding** (dashboard) + **fundador manual** (treinamento).
- **Gate:** prof responde ≥ 3 leads via WhatsApp sem ajuda do fundador em 7 dias.

### Sprint 8 — Sprint imediato pós-1º cliente (princípio §39)

- **Goal:** automatizar TUDO que foi manual no setup do 1º tenant — antes do 2º entrar.
- **Deliverables:** (varia conforme o que ficou manual no Sprint 5-7)
  1. Se config tema exigiu SQL admin → liberar `/dashboard/appearance` UI completo
  2. Se gateway exigiu copy-paste manual → Server Action `connectGateway` com OAuth/API key
  3. Se vibe coding rodou em terminal local → Edge Function dedicada
- **Dependências:** Sprint 7 + 1º tenant funcionando há ≥ 7 dias
- **DoD:**
  - [ ] Setup do "2º tenant simulado" via UI puro (fundador faz dry-run sem usar SQL ou terminal)
  - [ ] Tempo total setup < 50% do tempo real do 1º cliente
  - [ ] Doc operacional `docs/runbooks/pacote-a-onboarding.md` atualizado
- **Quem domina:** **híbrido** — Claude Code vibe coding pra UI/Edge Function, fundador pra decidir tier (1 form-based vs 2 drag-drop vs 3 setup vibe coding) por feature.
- **Gate (M2 fecha quando):** 1 humano real (não prof, não fundador) completa fluxo end-to-end sem intervenção do fundador. Pesquisa 07 §11 — "1 cliente pagou R$ 3.500 e 1 aluno dele fez login e marcou 1 treino como concluído".

---

## M3 — 2º-5º tenant (Sprints 9-12)

### Sprint 9 — 2º tenant via tier 1 editor + templates capture form

- **Goal:** 2º prof onboarded em <2h via UI puro. Templates capture form por modalidade clonáveis.
- **Deliverables:**
  1. 2º tenant criado e operando
  2. 3 templates capture form (musculação, nutri, yoga) clonáveis no admin
  3. Sprint imediato §39 pós-2º cliente — automatizar o que ainda foi manual
- **Dependências:** Sprint 8 (princípio §39 cumprido)
- **DoD:**
  - [ ] 2º tenant publica landing + form em < 2h
  - [ ] Templates aplicados em 1 click → form pronto
  - [ ] Painel admin platform vê 2 tenants ativos
- **Quem domina:** **fundador manual** (acompanhamento humano), **Claude Code vibe coding** (UI/Edge).
- **Gate:** 2º tenant fecha 1ª venda em ≤ 14 dias do setup.

### Sprint 10 — 3º tenant + painel admin escalado + impersonation

- **Goal:** 3º prof onboarded + admin platform com lista tenants + health check + impersonation com audit log.
- **Deliverables:**
  1. 3º tenant criado e operando
  2. `/admin/tenants` — lista completa com MRR per tenant + health (last lead, last enrollment)
  3. Impersonation feature com audit log em `public.admin_impersonations`
- **Dependências:** Sprint 9
- **DoD:**
  - [ ] Fundador imitar prof em <5 cliques + audit log persistido
  - [ ] Lista tenants ordena por MRR e churn risk
  - [ ] 3 tenants pagantes simultâneos
- **Quem domina:** **Claude Code vibe coding** (UI admin) + **fundador manual** (audit log decisões one-way).
- **Gate:** fundador consegue debugar issue de tenant via impersonation em <10min.

### Sprint 11 — 4º tenant + feature flags PostHog + iteração CTA WhatsApp

- **Goal:** 4º prof onboarded + experimentos copy CTA WhatsApp via feature flags PostHog.
- **Deliverables:**
  1. 4º tenant criado e operando
  2. PostHog feature flags integrado — A/B test copy CTA pós-assessment
  3. Métrica `lead → conversa WhatsApp → checkout` tracking PostHog dashboard
- **Dependências:** Sprint 10
- **DoD:**
  - [ ] A/B test rodando com ≥ 50 amostras
  - [ ] PostHog dashboard mostra funnel conversion
  - [ ] 4 tenants pagantes simultâneos
- **Quem domida:** **Claude Code vibe coding**.
- **Gate:** decisão data-driven sobre copy CTA pós ≥ 50 leads.

### Sprint 12 — 5º tenant + runbook operacional + retro M3

- **Goal:** 5º prof onboarded. Runbook completo `como entregar Pacote A` + `como debugar gateway`. Retro M3.
- **Deliverables:**
  1. 5º tenant criado e operando
  2. `docs/runbooks/pacote-a.md` + `docs/runbooks/gateway-debug.md` + Loom 5min cada
  3. Retro escrita: o que travou, débito assumido, próximos sprints M4
- **Dependências:** Sprint 11
- **DoD:**
  - [ ] 5 tenants pagantes há ≥ 1 mês (mensalidade R$ 100 ativa em ≥ 3 dos 5)
  - [ ] TTFV prof < 15min measured via PostHog
  - [ ] 2 dos 5 profs operam 100% sozinhos (zero ticket fundador por 14 dias)
- **Quem domina:** **fundador manual** (retro + runbook + decisões M4).
- **Gate (M3 fecha quando):** 1 cliente do M2 pagou 3 mensalidades consecutivas (engajado, não tecnicamente autônomo — pesquisa 07 §1 reframing). Se demorou > 12 semanas → investigar gargalo antes de aceitar 6º.

---

## M4 — 6º-10º tenant (Sprints 13-16)

### Sprint 13 — 6º + 7º tenant + dashboard MRR consolidado

- **Goal:** 2 tenants entram simultâneos (paralelização — pesquisa 07 §1 "primeiros 100 são human-touched"). Dashboard MRR consolidado funcional.
- **Deliverables:**
  1. 6º + 7º tenant criados e operando
  2. `/admin/metrics` — MRR consolidado + funil agregado (impressões → leads → assessments → conversões)
  3. Sprint imediato §39 — automatização final do que ainda for manual no setup
- **Dependências:** Sprint 12
- **DoD:**
  - [ ] 7 tenants pagantes simultâneos
  - [ ] Dashboard MRR atualiza em real time
  - [ ] Setup do 7º levou ≤ 50% do tempo do 1º
- **Quem domina:** **híbrido**.
- **Gate:** dashboard MRR responde "qual tenant está em churn risk?" em <5s.

### Sprint 14 — 8º tenant + 1º upgrade A→B (start Pacote B)

- **Goal:** 8º prof onboarded + 1º cliente do M2/M3 pede upgrade A→B (PWA branded). Início Pacote B real.
- **Deliverables:**
  1. 8º tenant criado e operando
  2. Cliente upgrade A→B fecha — PWA Serwist branded começa (M4 começa Pacote B por demanda real, não preventivo — princípio §39)
  3. Schema `public.programs + components` ativo + 1º programa estruturado criado por aquele prof
- **Dependências:** Sprint 13 + cliente real pedindo PWA (sem demanda, não constrói)
- **DoD:**
  - [ ] 8 tenants pagantes simultâneos
  - [ ] PWA do upgrade A→B instala em iPhone via "Add to Home Screen"
  - [ ] 1º aluno faz login no PWA e marca 1 treino como concluído
- **Quem domina:** **híbrido** — schema fundador, PWA implementação Claude Code.
- **Gate:** PWA do 1º upgrade A→B passa Lighthouse PWA 100 + funciona offline (Sprint 14 obrigatório fechar antes de 9º tenant porque PWA é mudança de eixo arquitetural).

### Sprint 15 — 9º tenant + push notifications + check-in PWA

- **Goal:** 9º prof onboarded + push notifications operacionais + check-in PWA do aluno.
- **Deliverables:**
  1. 9º tenant criado e operando
  2. Push notifications Web Push API + Vapid keys 1 par por tenant (RFC 8292) + templates 3 (lembrete check-in, próximo módulo, mensagem do prof — TODOS via push+email, não chat in-app — D-G37)
  3. Check-in PWA mobile-first 375px com idb-keyval queue offline
- **Dependências:** Sprint 14 (PWA base funcional)
- **DoD:**
  - [ ] 9 tenants pagantes simultâneos
  - [ ] Push delivery rate ≥ 90% em iOS + Android testes
  - [ ] Check-in offline → reconecta → sync sem duplicata (idempotency key)
- **Quem domina:** **Claude Code vibe coding** com fundador revisando idempotency (one-way door).
- **Gate:** aluno do upgrade A→B faz check-in offline em metrô (avião mode) e dado sincroniza ao voltar online.

### Sprint 16 — 10º tenant + retro M4 + backlog M5+

- **Goal:** 10º prof onboarded = R$ 20k entrada cumulativa atingida. Retro M4. Backlog M5+ refinado.
- **Deliverables:**
  1. 10º tenant criado e operando
  2. Retro escrita + memorial técnico (`docs/changelog/`) com decisões revertidas/adotadas no agência
  3. Backlog refinado pra M5+ (próximos pacotes B/C, features que tenants pediram, gatilhos quantitativos `enable_public_signup` — `11-roadmap.md §7.1`)
- **Dependências:** Sprint 15
- **DoD:**
  - [ ] 10 tenants pagantes simultâneos
  - [ ] R$ 15-20k entrada cumulativa (mix Pacote A + alguns A→B upgrades)
  - [ ] MRR R$ 1.000-3.000
  - [ ] Setup-to-active rate ≥ 80% / churn 30d ≤ 10% / tickets/tenant/semana ≤ 0.3
- **Quem domina:** **fundador manual** (retro + decisões M5+).
- **Gate (M4 fecha quando):** 3 tenants onboarded em ≤ 50% do tempo do 1º + painel admin permite fundador operar 10 tenants sem perder bug critical. Bloqueia M5: MRR < R$ 1.500 ou setup > 4h fundador ou NPS < 40 — investigar antes de abrir self-service.

---

## 13. Riscos por sprint (pesquisa 07 §5 — pitfalls)

| Sprint | Risco principal                        | Mitigação                                                                                          |
| ------ | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1-2    | Gold-plating schema (54 tabelas dia 1) | Sprint 1 limita ~22 core dia 0; expansão JIT (§39)                                                 |
| 3-4    | "Estou achando lindo" sem cliente real | 1 ligação/semana com prospect mesmo sem demo (pesquisa 07 §7)                                      |
| 5-8    | Frankenstein customization 1º cliente  | Antes de aceitar customização: "vira feature do produto?" Sem resposta clara → recusa + sobe preço |
| 9-12   | Permanência modo agência               | Gatilhos escritos `11-roadmap.md §7.1` — sem critério, default é ficar                             |
| 13-16  | Burnout silencioso solo (54% rate)     | Cap 45h/sem + peer group MicroConf/Indie Hackers + 1 dia off-screen                                |

---

## 14. Checkpoint visual único — fim do Sprint 16

Sem visual checkpoints intermediários durante refatoração — memória `feedback_skip_visual_checkpoints.md`. **Checkpoint visual único** rodado no fim do Sprint 16 (ou antes se M5+ atrasar):

- Lighthouse 5 rotas (`/login`, `/dashboard/leads`, `/dashboard/capture-forms`, `/<slug>.desafit.app/`, `/<slug>.desafit.app/<programa-slug>`)
- iPhone 14 portrait teste real (não simulator) — todos 16 sprints validados visualmente uma vez

---

## 15. Cadência semanal por sprint (pesquisa 07 §7)

| Dia     | Manhã (3-4h foco)                           | Tarde (3-4h baixo foco)                          |
| ------- | ------------------------------------------- | ------------------------------------------------ |
| Seg     | Planning sprint (30min) → 1 outcome         | Outreach: 10 mensagens cold/morna                |
| Ter     | Build Claude Code                           | Build + auto-review 1h sem IA antes commit       |
| Qua     | Build                                       | **Ligação com 1 cliente/prospect** (mesmo 20min) |
| Qui     | Build                                       | Conteúdo: 1 post LinkedIn ou comunidade BR       |
| Sex     | Retro sprint (30min) + **Demo E2E própria** | Admin: financeiro, contratos, NF, suporte        |
| Sáb-Dom | Off                                         | Off (30min preview semana só dom à noite)        |

Cap 40-45h úteis/semana. Burnout = preditor #1 de failure solo.

---

## 16. Referências cruzadas

- `00-PROJETO.md` §7 (mobile-first) · §10 (restrições temporais 16 semanas)
- `_CONFLITOS.md` #5 (10 tenants 4 meses) · #6 (build vs sell) · #16 (pipeline UI dia 0)
- `01-arquitetura.md` (camadas + Sheriff)
- `06-data-model.md` §3 (schema baseline) · §6 (RLS)
- `07-ai-prompts.md` §4 (2-schema pattern) · §8 (ai_invocations LGPD)
- `08-pwa-offline.md` (Serwist + idb-keyval Sprint 14-15)
- `09-pacote-a.md` (referência Sprint 5-12)
- `11-roadmap.md` (alinhamento M0-M4 macro)
- Pesquisa 07 (validação crítica do plano solo+AI BR) — origem de §1, §5, §7, §11, §12
- Memórias: `project_desafit_principio_39_revisto.md`, `feedback_skip_visual_checkpoints.md`, `feedback_no_legacy_vocabulary.md`

## Histórico

| Data       | Mudança                                                                                                    | Aprovador |
| ---------- | ---------------------------------------------------------------------------------------------------------- | --------- |
| 2026-05-17 | Versão inicial — 16 sprints absorvendo pesquisa 07 + princípio §39 + dependências entre camadas explícitas | Leandro   |
