# 10 — Pacotes B e C · Aplicativo + Conjunto Completo

> **Status:** accepted · **Versão:** 2026-05-17 (rev. preço) · **Supersede:** —
> Pacotes premium: PWA branded + programa estruturado (B), + integrações e automações (C).
> Preços alinhados com `00-PROJETO §3` + `proposta_desafit.html` (fonte canônica).

---

## 1. Pacote B — Aplicativo com a sua marca

### 1.1 Investimento e cobrança

| Item                   | Valor                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Setup (entrada)        | **R$ 3.000**                                                                                  |
| Mensalidade plataforma | **R$ 200/mês**                                                                                |
| Início mensalidade     | **11º mês após assinatura** (10 meses isenção alinhada ao parcelamento)                       |
| Prazo de entrega       | **60 dias** (máximo)                                                                          |
| Pagamento setup        | Pix à vista (10% off → R$ 2.700) · 2× Pix (R$ 1.500 cada) · **10× cartão sem juros (R$ 300)** |

**Cobrança plataforma → prof:** EFI Bank (Pix Automático + cartão 10×). Mensalidade dispara no dia 1 do 11º mês após `subscription.created_at`.

### 1.2 Promessa

Tudo do Pacote A **+** o aplicativo do aluno com a sua marca **+** 1 programa estruturado entregue pronto.

### 1.3 Componentes técnicos adicionais (vs A)

**PWA branded white-label** (blueprint/08-pwa-offline.md):

- 5 abas fixas: **Início / Programa / Agenda / Chatbot\* / Perfil** (D-G29 + 00-PROJETO §6)
- \*Chatbot fica visível mas bloqueado/upgrade CTA até C (schema dia 1)
- Instalável Android + iPhone (PWA standalone via A2HS)
- `manifest.webmanifest` dinâmico por tenant em `app/(public)/[slug]/manifest.webmanifest/route.ts`
- Tema branded runtime via CSS via API route (D-G59)
- Sem chat 1:1 com prof — comunicação só push + email (D-G37 + 00-PROJETO §8)

**1 programa estruturado entregue pronto** (`programs/modules/components`):

- Hierarquia `Programa → Módulo → Componente`
- 11 component kinds dia 1: `workout, meal_plan, video_lesson, lesson, scheduled_live, individual_call, in_person_class, check_in, material, message, task`
- Schedule engine 4 release modes: `immediate / relative (day_offset) / fixed_date / after_completion`
- Migração de alunos via planilha CSV (`platform.import_jobs`)
- Player vídeo Bunny Stream embedded (PoP São Paulo sub-29ms)
- Biblioteca 800+ exercícios (`public.kb_exercises` — free-exercise-db)
- Biblioteca pessoal de vídeos do prof (Bunny Stream upload)

**Dashboard prof completo** (`/dashboard/*`):

- 10 seções: Dashboard / Programas / Alunos / Captação / Páginas / Vendas / Emails / Automações / Aparência / Configurações
- **Mobile-first 100%** — 90% dos profs operam APENAS via mobile (00-PROJETO §7). Painel funciona em viewport 375px touch real
- FAB "+ Novo programa" sticky bottom-right em mobile
- Search global Cmd+K (`cmdk`)
- Notificações in-app (bell dropdown — nova venda / aluno completou módulo / cobrança falhou)
- **Tier 2 editor** drag-drop (`@dnd-kit/sortable`) + 11 blocks (D-G69 — \_CONFLITOS #11)

**Check-in diário e gamificação**:

- Form 3 campos default (energia 1-10 / sono 1-10 / mood emoji 5-step)
- Customizável via `component_kind='check_in'` `payload.fields`
- Foto pesagem semanal (opcional, não diário)
- Streak de dias consecutivos (`platform.workout_logs` agregado)
- Gamificação personalizada (bônus mês 3) — `platform.achievements` + `platform.badges`
- Galeria antes/depois (`platform.progress_photos` com `kind enum('front'/'side'/'back')`)
- Histórico completo de progresso (line chart Recharts)

**Push notifications branded** (5 templates dia 1 — blueprint/08-pwa-offline.md §9.5):

- "Bom dia 💪 Seu treino de [grupo] está pronto" (cron 7h tz aluno)
- "[Prof] te mandou uma mensagem: «...»" (mensagem nova)
- "3 dias sem treinar. Bora retomar leve hoje?" (inatividade)
- "🔥 Sequência de 7 dias! Não quebre hoje." (streak milestone)
- "Check-in de domingo: como foi a semana?" (cron dom 19h)
- Vapid keys **1 par por tenant** (RFC 8292 — \_CONFLITOS #4)
- Frequency cap 1 push/dia útil, quiet hours 22h-7h server-side

**Email transacional customizado**:

- Domínio do prof full custom (Resend domain verified)
- Templates editáveis pelo prof ([I] via UI — fundador edita repo no MVP)
- Drips automatizados: enrollment-welcome, checkin-reminder (3d sem atividade), program-completed, dunning-attempt-1

**Treinamento por videoconferência**:

- 1 sessão 60-90min ao vivo (Zoom/Meet) após entrega
- Cobre: painel admin, criar/editar programa, configurar gateway, push + automações, analytics + Pixel
- Gravação fica no painel do prof

**Custom domain** (opcional, Cloudflare for SaaS — pesquisa 01 §1.3/§1.4):

- `app.<domínio-do-prof>.com.br` via CNAME
- Vercel SDK `projectsAddProjectDomain` ou Cloudflare for SaaS
- Setup R$ 0 incluído no Pacote B (compra/renovação do domínio fica com prof)

### 1.4 NÃO inclui no B (entra no C)

- Integrações Hotmart/Kiwify (import alunos existentes)
- Automações de retenção avançadas (jornada email/push triggered)
- Módulos extras do programa (até 3 adicionais)
- Chatbot nutricional IA (bônus pós-Pacote C)
- Suporte priorizado

---

## 2. Pacote C — Conjunto completo (recomendado)

### 2.1 Investimento e cobrança

| Item                   | Valor                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------- |
| Setup (entrada)        | **R$ 4.000**                                                                                  |
| Mensalidade plataforma | **R$ 200/mês**                                                                                |
| Início mensalidade     | **11º mês após assinatura**                                                                   |
| Prazo de entrega total | **90 dias** (máximo)                                                                          |
| Pagamento setup        | Pix à vista (10% off → R$ 3.600) · 2× Pix (R$ 2.000 cada) · **10× cartão sem juros (R$ 400)** |

### 2.2 Promessa

Tudo do Pacote A + B **+** integrações + automações + módulos extras + suporte priorizado.

### 2.3 Componentes técnicos adicionais (vs B)

**Integrações de import (alunos existentes)**:

- Hotmart: API REST + webhook de venda → cria `client_user_id` + `enrollment` automaticamente
- Kiwify: API REST + webhook similar
- Eduzz / Monetizze: webhook via `/api/webhooks/external-purchase` (genérico)
- Schema **vertical-aware** (`public.vertical_component_kinds`) — import respeita kinds válidos do vertical
- Edge Function `import-external-students` (Deno, idempotent via `external_purchase_id`)

**Automações de retenção** (jornadas email/push triggered):

- Editor visual de automações em `/dashboard/automations` (tier 3 editor — vibe coding pipeline)
- Triggers: signup, enrollment, X dias sem atividade, completou módulo, completou programa, cobrança falhou, antes do término do plano
- Ações: enviar email (template), enviar push, marcar tag, mudar status, criar tarefa pro prof
- Scheduler via Supabase `pg_cron` + Edge Function `process-scheduled-jobs` + tabela `platform.scheduled_jobs`
- Retries exponential backoff (3 tries) + deduplicação `event_id`

**Módulos extras do programa** (até 3 adicionais):

- Fundador configura via vibe coding (`public.ai_prompts` chave `vibe.component.<kind>.<vertical>`)
- Ou import de template oficial (`public.program_templates` clonável)
- Cada módulo = `platform.modules` row com N `components` filhos
- Limite 3 dentro do pacote; programas adicionais cobrados separadamente (R$ 800 cada — proposta_desafit.html)

**Chatbot nutricional IA** (bônus, entrega ~1 mês após Pacote C):

- Modelo: **Haiku 4.5** via Vercel AI Gateway
- TBCA (1900) + TACO (597) no system prompt cacheado 1h (~80k tokens, cabe em 200k contexto Haiku)
- Cache hit 90%+ na sessão = $0.005/conversa
- Aluno informa o que tem disponível → bot calcula porções exatas pra bater meta calórica/macros
- Guardrails: XML wrap input + pre-screen Haiku + LLM judge ("contém conselho médico?") + PII mask
- Schema: `platform.chatbot_threads` + `platform.chatbot_messages`
- Budget cap $2/mês por tenant Pacote C (`lib/ai/budget.ts`)
- Crédito legal obrigatório no rodapé: _"Dados nutricionais: TBCA (USP/FORC) e TACO (NEPA/UNICAMP)."_

Detalhes: blueprint/07-ai-prompts.md §13.

**Suporte priorizado fase agência**:

- Resposta em até 4h úteis (vs 24h no A/B)
- Canal direto WhatsApp prioritário
- Bug crítico: resposta < 1h útil
- 1 sessão consultiva extra 60min/mês (estratégia, otimização funil, etc)

**Economia direta vs A + B**:

- A (R$ 1.500) + B (R$ 3.000) = R$ 4.500
- C (R$ 4.000) — economia R$ 500 + entrega integrações + automações + módulos extras + IA + suporte priorizado de bônus
- Posicionamento: C é o pacote recomendado (preço menor que A+B combinados)

### 2.4 Bônus exclusivos do C

- ✦ Gamificação personalizada (entregue no mês 3)
- ✦ Chatbot nutricional IA (entregue ~1 mês após pacote)
- ✦ 10 meses sem mensalidade (alinhada com parcelamento 10×)
- ✦ Suporte priorizado vitalício

---

## 3. Cobrança aluno → prof (Pacote B/C)

Mesma regra do Pacote A: prof escolhe gateway, plataforma **NÃO intermedia** na fase agência.

**Diferença vs A:** PWA do aluno tem `enrollment` automatizado pós-webhook do gateway. Aluno cria senha no checkout success → login email+senha (D-G36 + D-G52) → libera acesso ao programa.

Gateways suportados dia 1 (blueprint/09-pacote-a.md §5): Asaas (BRL) + Stripe (USD/EUR/GBP/CAD/AUD). Pagar.me/MP entram quando 1º tenant pedir.

---

## 4. Bottom-nav 5 abas do PWA (00-PROJETO §6)

| Tab          | Conteúdo                                                                           | Tier do pacote            |
| ------------ | ---------------------------------------------------------------------------------- | ------------------------- |
| **Início**   | Hoje + streak + próximo evento agendado                                            | B, C                      |
| **Programa** | Módulos, componentes destravados/bloqueados, navegação dia a dia                   | B, C                      |
| **Agenda**   | Live, call 1:1, encontro presencial, deadline tarefa, check-in semanal             | B, C                      |
| **Chatbot**  | Bloqueado no B (upgrade CTA); IA nutricional ativa no C                            | B (bloqueado) / C (ativo) |
| **Perfil**   | Settings, pagamento, progresso (peso, fotos, métricas, gamificação), suporte, sair | B, C                      |

**Sem chat 1:1 com profissional** (D-G37) — top-bar tem só logo do tenant + avatar do aluno. Notificações via push + email + toast in-app.

---

## 5. Roadmap interno de entrega

### 5.1 Pacote B — 60 dias

**Mês 1 (dias 1-30):**

- Tudo do Pacote A (semanas 1-4)
- Setup do PWA branded (manifest, SW, ícones, splash)
- Tier 2 editor drag-drop habilitado

**Mês 2 (dias 31-60):**

- 1 programa estruturado configurado (vibe coding interno do fundador OU template oficial)
- Migração de alunos existentes via CSV
- Push notifications configuradas (5 templates default + custom do prof)
- Gamificação inicial (streak + achievements baseline)
- Treinamento por videoconferência (60-90min)
- Smoke test E2E: prof publica → aluno instala PWA (A2HS) → primeiro check-in completo → push recebido → streak +1

### 5.2 Pacote C — 90 dias

**Mês 1-2:** Tudo do Pacote B (compressed em 60 dias)

**Mês 3 (dias 61-90):**

- Integrações Hotmart/Kiwify configuradas (se prof tem alunos legados)
- 3 módulos extras do programa configurados via vibe coding
- Automações de retenção (5+ jornadas triggered)
- Gamificação personalizada finalizada
- Suporte priorizado ativo
- Smoke test E2E: aluno completa 7 dias → recebe push streak milestone → automation dispara email "parabéns" → prof recebe notificação in-app

**~30 dias pós-entrega (mês 4):** Chatbot nutricional IA liberado.

---

## 6. Princípio §39 aplicado

**Ferramenta entra junto com 1º cliente do pacote** sempre que possível.

| Feature                    | 1º cliente B aceito manual                         | Sprint imediato pós-1º                                   |
| -------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| Tier 2 editor drag-drop    | Fundador monta via tier 1 + admin SQL              | Tier 2 entregue antes do 2º cliente B                    |
| Push templates custom      | Fundador configura via admin direto                | UI editor templates push entra antes do 2º               |
| Vibe coding pipeline UI    | Fundador roda prompts manualmente em Edge Function | Pipeline UI (stepper visual) entra antes do 2º cliente B |
| Custom domain (Pacote B/C) | Cloudflare SDK call manual no terminal             | UI provisionamento custom domain antes do 2º             |

**Não pode adiar (entra junto com 1º cliente B):**

- PWA shell branded funcional (5 abas)
- Programa → Módulo → Componente CRUD
- Push opt-in flow + Vapid per-tenant
- Bunny Stream player embedded
- Import alunos via CSV
- Login email+senha aluno (D-G52)
- Migrations completas tabelas Pacote B (blueprint/06-data-model.md §4.2)

**Não pode adiar (entra junto com 1º cliente C):**

- Webhook Hotmart/Kiwify
- Schema `platform.scheduled_jobs` + Edge Function processor
- Chatbot IA Pacote C (não tem versão manual viável)

Memória: `project_desafit_principio_39_revisto.md`.

---

## 7. Mobile-first 100% (00-PROJETO §7)

Tanto **painel prof** quanto **PWA aluno** funcionam em viewport 375px touch real:

- 90% dos profs operam APENAS via mobile (estão sempre na rua entre clientes e academias)
- 100% dos alunos no PWA são mobile
- Touch targets ≥ 44px em TODO lugar
- Input `font-size: 16px` SEMPRE (anti auto-zoom iOS)
- Modais via vaul bottom-sheet em mobile (snap points `[0.5, 0.92]` + `repositionInputs`)
- Tabelas viram cards stack vertical em mobile
- **Editor tier 2 drag-drop fino** precisa funcionar com gestos touch reais (`@dnd-kit/sortable` + `TouchSensor {delay:200, tolerance:5}` + drag handle dedicado 44×44 — pesquisa 15)
- NumberStepper custom com long-press repeat (sets/reps/cargas — pesquisa 15)
- react-easy-crop pra recorte de imagem (avatares, capas programa)
- Proibido `whileHover` em touch (Motion #1179 stuck) — só `whileTap` + `whileFocus`

Desktop = progressive enhancement, nunca premissa.

---

## 8. Métricas TTFV (PostHog)

| Métrica              | Definição                                                 | Target                                                                    |
| -------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------- |
| **TTFV prof**        | `prof.created_at → programa publicado`                    | P50 < 15min, P90 < 1h (Pacote B/C self-service futuro); manual no agência |
| **Activation**       | `prof contratou → 1º aluno completou 1º componente`       | P50 < 72h pós-entrega PWA                                                 |
| **PWA install rate** | % de alunos convidados que instalam PWA (A2HS)            | ≥ 60% (target premium)                                                    |
| **Push opt-in rate** | % de alunos PWA-installed que aceitam push                | ≥ 50% (com pre-prompt custom)                                             |
| **Retention 7d**     | % de alunos enrolled que completam ≥ 1 check-in em 7 dias | ≥ 70%                                                                     |
| **Retention 30d**    | % de alunos enrolled que ativos no dia 30                 | ≥ 50%                                                                     |

---

## 9. Referências

- `00-PROJETO.md` §3 (pacotes — preço canônico) · §6 (5 tabs) · §7 (mobile-first) · §8 (sem chat 1:1)
- `_CONFLITOS.md` #4 (Vapid per-tenant) · #11 (editor tiers 1/2/3) · #14 (Serwist) · #15 (IDB queue)
- `05-design-system.md` (white-label + 13 paletas + Motion presets)
- `06-data-model.md` §3 (core dia 0) · §4.2 (JIT Pacote B) · §4.3 (JIT Pacote C IA)
- `07-ai-prompts.md` (chatbot Pacote C completo)
- `08-pwa-offline.md` §8 (5 abas) · §9 (push opt-in) · §10 (install prompt)
- `09-pacote-a.md` (referência herdada — tudo do A entra em B/C)
- Master plan §0.5 (estratégia agência) · §10 (PWA setup) · §13 (vibe coding) · §24 (pagamentos)
- Pesquisa 01 §1.3 (custom domain) · §1.4 (Cloudflare for SaaS) · §6.1 (precificação)
- Pesquisa 15 (editor mobile-first)
- proposta_desafit.html (canon comercial — alinhado)

## Histórico

| Data       | Mudança                                                                                                                                | Aprovador |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 2026-05-17 | Versão inicial — preços B R$5k/R$300, C R$10k/R$500 (briefing CHUNK 3) com §7 divergência sinalizada                                   | Leandro   |
| 2026-05-17 | Rev. preço — alinhamento com proposta + 00-PROJETO: B R$ 3.000 + R$ 200/mês 60d, C R$ 4.000 + R$ 200/mês 90d. §7 divergência removida. | Leandro   |
