# 11 — Roadmap M0-M5+

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Timeline 4 meses até 10 tenants pagantes (R$ 20k entrada). Self-service ano 2.
> Causa raiz: falsa velocidade por paralelismo foi a maior dor do onboarding-bio.
> **Regra de ouro:** marco só fecha quando humano real completa fluxo end-to-end (master plan §33.13).

---

## 1. Princípios do roadmap

1. **Build first, sell later** (_CONFLITOS #6) — construir funil comercial antes de cold outreach; outreach via funil pronto, não Figma + planilha
2. **10 tenants em 4 meses** (_CONFLITOS #5) — ritmo definido pelo fundador; sem conversa de burnout
3. **Marco só fecha com humano real end-to-end** (master plan §33.13) — não conta "85% done"
4. **Princípio §39** — ferramenta entra junto com 1º cliente que precisar (preferencialmente automatizada; manual só pro 1º se cronograma apertar)
5. **F0 bootstrap bloqueia tudo** — pipeline UI dia 0 (~70h) + CI dia 0 + design system antes de qualquer feature
6. **Mobile-first 100% INCLUSIVE painel prof** (00-PROJETO §7) — testar em iPhone 14 portrait a cada feature

---

## 2. M0 — Bootstrap repo (semanas 1-2)

### 2.1 Goal
Esqueleto operacional + CI dia 0 + design system tokenizado + signup smoke funcional.

### 2.2 Entregáveis

**Semana 1 (dias 1-7):**
- Repo `desafit/` criado **FORA do working dir** `onboarding-bio/` (decisão D-G1 — repos separados; memória `project_desafit_separation.md`)
- `create-next-app` Next 16 + TS strict + Tailwind v4 + pnpm
- Supabase project NOVO (D-G2 — 2 Supabase independentes)
- Vercel project NOVO
- `tsconfig.json` strict++ (6 flags Research C — blueprint/02-stack.md §7)
- `eslint.config.ts` flat com 24 padrões custom + Sheriff + `@eslint-community/eslint-comments/no-use` + `id-denylist` vocab banido
- Husky pre-commit + commitlint + pre-push (tsc + vitest + lint)
- CI GitHub Actions (typecheck → lint → knip → grep-disables → vitest → size-limit)
- 3 hooks Claude Code dia 0: `block-disables.sh` + `format-on-write.sh` + `vocab-reminder.sh`
- 3 grep scripts CI: `pnpm i18n:audit`, `vocab:audit`, `token:audit`
- 3 MCPs configurados: shadcn + Supabase + Context7

**Semana 2 (dias 8-14):**
- Pipeline UI dia 0 (~70h conforme _CONFLITOS #16) — paletas + APCA + Motion + skeleton premium + tab bar + safe areas + etc
- 13 paletas OKLCH oficiais migradas verbatim de `app/preview/paletas/page.tsx` → `lib/design/palettes.ts` (D-G76)
- 2 blocos ESLint transferidos: file-size 300/60/12/4/4 + i18n hardcoded 14 padrões
- Logo wordmark "desafit.app" em Geist Sans (componente `<Logo>` único — 00-PROJETO §9)
- Migration baseline `0001_initial.sql` via `mcp__supabase__apply_migration` — ~22 core tabelas (blueprint/06-data-model.md §3)
- Trigger `handle_new_user` + `custom_access_token_hook`
- RLS pattern `(select public.current_tenant_id())` em todas tabelas tenant-scoped
- 5 storage buckets com policies
- Primitives custom: `<Heading>`, `<Text>`, `<Eyebrow>`, `<Metric>`, `<DataCell>`, `<Code>`, `<Section>`, `<Stack>`, `<Container>`, `<VisuallyHidden>`, `<EmptyState>`, `<Divider>`
- `lib/domain/roles.ts`, `lib/contracts/{result.ts,errors.ts,action.ts}`, `lib/env.ts`
- `lib/design/{contrast.ts,tokens.ts,palettes.ts}`
- shadcn 100% instalado (componentes + blocks relevantes)
- PWA manifest base + Serwist SW skeleton (`@serwist/next` + `@serwist/turbopack`)

### 2.3 Gate de saída (M0 fecha quando)
- `pnpm build` passa em CI
- `pnpm typecheck` 0 erros
- `pnpm lint --max-warnings 0 --no-inline-config` 0/0
- Smoke signup: novo email cria `auth.users` → trigger cria `profiles` + `tenants` + `memberships` atomicamente → JWT carrega `tenant_id` + `active_membership_role`
- Lighthouse `/login` ≥ 90 Perf / A11y 100
- CSS do tenant carrega via `/api/tenants/[id]/theme.css` sem FOUC

**Sem M0 fechado, M1 não começa.** Master plan §33.0 — sem bootstrap = repetir sofrimento do onboarding-bio.

### 2.4 Não fazer no M0 (entra em M1+)
- Editor visual de páginas (entra M1 tier 1)
- Pipeline vibe coding UI (adiado §39 — entra junto com 1º cliente)
- Features de produto (programas, alunos, captação)
- E2E completo 12 golden paths (entra incremental conforme feature)
- next-intl 4 locales (en-US/pt-PT/es-ES) ativos — só pt-BR dia 1, espelhos prontos

Referências: master plan §33.0 + §33.1 (F0) + blueprint/02-stack.md.

---

## 3. M1 — Funil agência (semanas 3-4)

### 3.1 Goal
Site institucional `desafit.app` + funil agência pronto pra capturar 1º lead real e fechar 1º venda via WhatsApp.

### 3.2 Entregáveis

- Landing institucional desafit + página `/agencia` (proposta comercial pública)
- Form captação multi-step (mobile-first, schema-driven — blueprint/09-pacote-a.md §3.1)
- Edge Function `generate-assessment` (IA Sonnet 4.6 via Vercel AI Gateway — blueprint/07-ai-prompts.md)
- WhatsApp lead handoff (`wa.me/<phone>?text=<msg pré-formatada>`)
- Schema `platform.leads` + `capture_forms` + `capture_submissions` ativos
- Webhook Meta CAPI configurado
- Pixel Meta + GA4 instrumentados
- Dashboard básico de leads (`/admin/leads` — fundador vê, ainda sem painel prof)
- Site institucional respondendo ao 1º interessado real

### 3.3 Gate de saída (M1 fecha quando)
- 1 lead real (não teste) preenche form
- Recebe relatório IA por email
- Fundador fecha venda via WhatsApp = R$ 1.500 (Pacote A) ou superior em conta
- Smoke E2E: lead → form → assessment IA → CTA WhatsApp → reply prof → checkout link → payment confirmado

### 3.4 Paraleliza com M2 (rotas independentes)

Referências: master plan §33.3 (F2) + §33.13 M1 + blueprint/09-pacote-a.md.

---

## 4. M2 — 1º tenant (semanas 5-8)

### 4.1 Goal
Configurar 1º tenant Pacote A via **vibe coding interno do fundador** (não self-service do prof). Entregar todas features da proposta automatizadas.

### 4.2 Entregáveis

**Semana 5-6:**
- Tenant criado em `/admin/tenants/new`
- Branding configurado via `deriveTokens(primary)` (13 paletas OKLCH)
- Subdomínio `<slug>.desafit.app` ativo + theme.css route ativa
- Landing institucional do prof publicada (tier 1 editor form-based em vaul bottom sheet)
- Página de vendas do programa publicada

**Semana 7-8:**
- Form captação configurado por modalidade (campos via `capture_forms.fields jsonb`)
- Email transacional Resend domain verified
- Checkout integrado com gateway escolhido pelo prof (Asaas/Stripe BR)
- Cupons CRUD básico
- Treinamento por videoconferência (60min Zoom)
- Smoke test E2E: aluno-de-teste preenche form → recebe assessment → CTA WhatsApp → checkout → email confirmação

### 4.3 Gate de saída (M2 fecha quando)
- 1 humano real (não prof, não fundador) completa fluxo end-to-end sem intervenção do fundador
- 1 lead real do prof entrando no painel
- 1 prof completou setup em <2h via tier 1 editor + admin SQL
- Prof autônomo em 80% das mudanças (texto, imagem, vídeo) sem ticket pro fundador

### 4.4 Sprint imediato pós-M2 (princípio §39)
Antes do 2º cliente entrar, fundador codifica ferramenta do que foi manual:
- Se editor tier 1 ainda exigiu JSON manual em alguma página → completar form-based editor
- Se configuração tema exigiu admin SQL → liberar `/dashboard/appearance` UI
- Se algum vibe coding rodou em terminal local → entregar Edge Function

**Bloqueia M3:** sem M2 fechado, 2º tenant não pode entrar (vira ticket-hell).

Referências: master plan §33.5 (F4) + §33.6 (F5) + §33.13 M2 + blueprint/09-pacote-a.md §7.

---

## 5. M3 — 2º-5º tenant (semanas 9-12)

### 5.1 Goal
Refinar playbook agência via iteração com 4 tenants reais. Automatizar manualidades remanescentes do M2.

### 5.2 Entregáveis

- Onboarding 2º-5º profissional via tier 1 editor (sem ticket pro fundador em 80% das tarefas)
- Refinamento UX baseado em uso real (mobile painel prof testado por gente que não é o fundador)
- Sprint imediato pós cada cliente novo: automação do que foi manual (princípio §39)
- Painel admin platform expandido pra fundador escalar (lista tenants, health check, impersonation com audit log)
- Documentação operacional: runbook "como entregar Pacote A" + "como debugar gateway"
- Capture form templates por modalidade (musculação, nutri, yoga) — clonáveis por novos tenants
- Lead → conversão WhatsApp tracking + iteração no copy do CTA via PostHog feature flags

### 5.3 Gate de saída (M3 fecha quando)
- 5 tenants Pacote A pagando há ≥ 1 mês (mensalidade R$ 100 ativa em pelo menos 3 dos 5)
- TTFV prof < 15min (signup → 1ª publicação) — measured via PostHog
- 2 dos 5 profs operam 100% sozinhos (zero ticket fundador por 14 dias consecutivos)
- 1 prof do M2 pagou 3 mensalidades consecutivas (cliente engajado, não tecnicamente autônomo)

### 5.4 Trigger pra M4
- Se 5º tenant entrou em <12 semanas → segue M4 (objetivo 10 em 16 semanas no pace)
- Se demorou >12 semanas → investigar gargalo (gateway? onboarding manual? marketing fraco?) antes de aceitar 6º cliente

Referências: master plan §33.13 M3 + memória `project_desafit_principio_39_revisto.md`.

---

## 6. M4 — 6º-10º tenant (semanas 13-16)

### 6.1 Goal
Estabilização operacional. Painel admin escalado. 10 tenants pagantes ativos = R$ 20k entrada cumulativa.

### 6.2 Entregáveis

- 10º tenant Pacote A entra no final do mês 4
- Painel admin platform com lista tenants, MRR consolidado, churn risk per-tenant
- Métricas dashboard (impressões funil → leads → assessments → conversões → MRR)
- Possível 1º upgrade A → B (cliente do M2 ou M3 pedindo PWA)
- Documentação operacional madura (Loom 5min por feature complexa)
- Backlog refinado pra M5+ (próximos pacotes B/C, features que tenants pediram)
- Memorial técnico (`docs/changelog/`) com decisões revertidas/adotadas no agência

### 6.3 Métricas-alvo M4

| Métrica | Target |
|---|---|
| Tenants ativos pagantes | 10 |
| Entrada cumulativa | R$ 15-20k (mix Pacote A puro + alguns A→B upgrade) |
| MRR | R$ 1.000-3.000 (10 tenants × R$ 100-300 médio) |
| Setup-to-active rate | ≥ 80% |
| Churn 30d | ≤ 10% |
| Tickets/tenant/semana | ≤ 0.3 |
| TTFV prof (P50) | < 15min |

### 6.4 Gate de saída (M4 fecha quando)
- 10 tenants pagantes simultâneos
- 3 deles onboarded em ≤ 50% do tempo do 1º cliente (M2)
- Painel admin permite fundador operar 10 tenants sem perder bug critical
- 1 tenant ativo no Pacote B (PWA branded) — opcional pra forçar build do B na prática

### 6.5 Bloqueia M5
- Se MRR < R$ 1.500/mês (10 tenants × R$ 150 médio) — investigar pricing antes de abrir self-service
- Se setup ainda exige > 4h fundador → playbook não codificável → adiar M5
- Se NPS < 40 → resolver UX antes de abrir torneira pública

Referências: master plan §33.13 M4 + `_CONFLITOS.md #5` (4 meses 10 tenants).

---

## 7. M5+ — SaaS self-service público (ano 2)

### 7.1 Pré-requisitos cumulativos pra ativar `enable_public_signup`

(master plan §0.5.10 — gatilhos quantitativos cumulativos)

- ≥ 15 tenants ativos pagando há ≥ 3 meses (consistente Gymdesk, Campaign Monitor)
- Setup manual caiu para ≤ 25% do tempo original sem perda de conversão
- ≥ 2 tenants pedindo self-service ou pagando alguém pra operar a ferramenta
- MRR ≥ 2× receita média mensal de setup (quando aluguel passa serviço, jogo virou)
- CAC orgânico ≤ 1 mês de LTV em ao menos 1 canal

### 7.2 Goal
Setup self-service público sem intervenção do fundador. Profissional configura tudo via vibe coding (master plan §13) — prompts + IA + tier 3 editor.

### 7.3 Entregáveis (master plan §17.1)

**Setup 4 telas** (vocab CANÔNICO: `setup`, **NUNCA** `wizard` — vocab banido `_CONFLITOS.md #19` + `.claude/rules/naming.md`):

| Tela | Tempo target | Conteúdo |
|---|---|---|
| **1. Bem-vindo** | 60s | Escolher vertical/template (`fitness_strength`, `nutrition`, `english_lang`, `yoga_meditation`, `career_mentoring`, etc) |
| **2. Brand básico** | 60s | Logo upload + cor primária picker (1 das 13 paletas OKLCH; APCA-validated) |
| **3. Gerar primeiro programa com IA** | 3-5min | **AHA MOMENT.** Pipeline vibe coding 4 estágios (identidade → estrutura → componentes → coerência). Stepper visual + streaming Vercel AI SDK + cards incrementais |
| **4. Convidar primeiros alunos** | 60s | Email único OU skip pra mais tarde |

### 7.4 Dashboard pós-setup (checklist persistente sidebar)
- [ ] Programa criado
- [ ] Página pública publicada
- [ ] Primeiro aluno
- [ ] Primeiro check-in recebido
- [ ] App instalado em device de teste

### 7.5 Métricas TTFV (PostHog)
- **TTFV prof:** `signup → 1º programa publicado` — target P50 < 15min, P90 < 1h
- **Activation:** `signup prof → 1º aluno completou 1º componente` — target P50 < 72h

### 7.6 Pricing fase 2 SaaS (master plan §0.5.8 — preliminar)
- **Sem setup** (profissional se configura sozinho)
- Mensalidade maior: R$ 297-497/mês (validar com volume)
- **Take rate 5-10%** sobre vendas (via Pagar.me split nativo — §24.4)
- **Clientes fundadores da fase agência mantêm mensalidade menor pra sempre** (grandfathered)

### 7.7 Não-objetivo M5+
- Multi-vertical hard-coded em UI — schema já agnóstico (D-G21 + blueprint/06-data-model.md §3); vertical nova ativada = `verticals.active=true` + preencher `messages/<locale>/kinds.<vertical>.json`
- Multi-moeda — já suportada dia 1 (D-G33 + blueprint/06-data-model.md §7 Money)
- Custom domain Pacote C — já entregue no M4

Referências: master plan §0.5.8 (SaaS self-service) + §17.1 (setup 4 telas) + §33.13 M5 + `_CONFLITOS.md #19` (setup vocab canônico).

---

## 8. Matriz de paralelização (master plan §33.11)

| Marco | M0 | M1 | M2 | M3 | M4 | M5 |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| M0 | — | ❌ | ❌ | ❌ | ❌ | ❌ |
| M1 | ❌ | — | ✅ | ✅ | ✅ | ✅ |
| M2 | ❌ | ✅ | — | ❌ | ✅ | ✅ |
| M3 | ❌ | ✅ | ❌ | — | ❌ | ✅ |
| M4 | ❌ | ✅ | ✅ | ❌ | — | ❌ |
| M5 | ❌ | ✅ | ✅ | ✅ | ❌ | — |

**M0 bloqueia tudo.** M2→M3→M4 sequencial (cada marco precisa do anterior fechado). M1 paraleliza com M2 (rotas independentes).

---

## 9. Decisões reversíveis vs irreversíveis (Bezos framing — pesquisa 07 §12)

| Tipo | Exemplos | Quem decide |
|---|---|---|
| **One-way door (irreversíveis)** | Schema core multi-tenant; modelo billing; contrato LGPD/operador; nome do produto; arquitetura tenant_id+RLS vs schema-per-tenant; vocabulário banido | **Fundador, escrito em ADR.** IA só revisa |
| **Two-way door (reversíveis)** | Cor da landing; copy; preço (até deal fechado); tooling secundário; nomes de componentes; pricing tier; CSS; copy email | **IA pode propor e implementar.** Decisão em horas, ajuste depois |

**Regra prática:** auditar últimas 10 decisões grandes. Se >7 foram one-way → movendo lento demais. Se <2 foram one-way → evitando o que importa.

---

## 10. Cronograma realista (sanity check — pesquisa 07 §14)

| Marco | Plano | Realista solo+AI BR | Por quê |
|---|---|---|---|
| M0 | 5-7 dias | 10-14 dias com bootstrap completo + pipeline UI ~70h | Escopo enxuto + Claude Code experiente |
| M1 | 2 sem | 2-6 semanas | Funil sem produto é rápido; tempo real é construir lista warm BR |
| M2 | 4 sem | 4-10 sem pós-outreach iniciar | Forum Ventures: 30-90 dias é faixa típica B2B R$ 3,5k com warm network |
| M3 | 4 sem | 8-16 sem após M2 | "Cliente engajado pagando 3×" é métrica real |
| M4 | 4 sem | 6-12 meses do início | Gymdesk/Galperin ~24 meses solo; 6 meses é otimista mas factível com warm network forte |
| M5 | ano 2 | 12-24 meses do início | Self-service real é projeto próprio (segundo zero-to-one) |

**Cronograma do fundador (4 meses 10 tenants):** agressivo mas viável se M0 bem feito + warm network ativo. Pesquisa 07 sinaliza risco de "estou achando lindo" se M2 demorar >60 dias do M0.

---

## 11. Mobile-first 100% INCLUSIVE painel prof (00-PROJETO §7)

Reforço em todo marco: **90% dos profs operam APENAS via mobile.**

- M0: pipeline UI dia 0 testado em viewport 375px touch real (não simulator desktop)
- M1: form captação multi-step mobile-first absoluto (375px, schema-driven)
- M2: painel admin/tier 1 editor funcionando em iPhone 14 portrait
- M3: tier 2 editor drag-drop com gestos touch reais (`@dnd-kit/sortable` + `TouchSensor`)
- M4: dashboard admin platform mobile-friendly (não só desktop)
- M5: setup 4 telas público otimizado pra mobile (signup AHA <8min em viewport 375px)

Desktop sempre como progressive enhancement, nunca premissa. Pesquisa 15 §3-§4 cobre os patterns mobile touch.

---

## 12. Referências cruzadas

- `00-PROJETO.md` §2 (modelo agência → SaaS) · §7 (mobile-first) · §10 (restrições temporais)
- `_CONFLITOS.md` #5 (cronograma 4 meses) · #6 (build vs sell) · #16 (pipeline UI dia 0) · #19 (setup vocab)
- `02-stack.md` (stack travado)
- `09-pacote-a.md` (Pacote A — referência M1/M2/M3)
- `10-pacote-b-c.md` (Pacote B/C — referência upgrade pós-M4)
- `12-sprint-plan.md` (granular semana a semana)
- Master plan §0.5 (estratégia agência → SaaS completa) · §17.1 (setup 4 telas fase 2) · §33 (cronograma F0-F9 + M0-M5)
- Pesquisa 07 (planejamento ordem execução — validação crítica plano solo+AI BR)
- Memórias: `project_desafit_principio_39_revisto.md`, `project_desafit_implementation_order_2026_05_17.md`

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — M0-M5+ alinhado decisão #5 (10 tenants 4 meses) + #6 (build first) + §39 + setup vocab canônico | Leandro |
