# 09 — Pacote A · Vendas e Captação

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> Pacote de entrada. Estrutura COMPLETA de captação, SEM aplicativo PWA do aluno.
> Promessa: prof já está captando lead, qualificando via IA e fechando venda no WhatsApp em 30 dias.

---

## 1. Investimento e cobrança

| Item                   | Valor                                                                                                          |
| ---------------------- | -------------------------------------------------------------------------------------------------------------- |
| Setup (entrada)        | **R$ 1.500**                                                                                                   |
| Mensalidade plataforma | **R$ 100/mês**                                                                                                 |
| Início mensalidade     | **31º dia após entrega** (30 dias de cortesia)                                                                 |
| Prazo de entrega       | **30 dias** (máximo)                                                                                           |
| Pagamento setup        | Pix à vista (10% off → R$ 1.350) · 2× Pix (R$ 750 cada — assinatura + entrega) · 10× cartão sem juros (R$ 150) |

**Cobrança plataforma → prof:** EFI Bank (Pix Automático + cartão). Mensalidade entra em loop recorrente após `current_date + 30d` da entrega.

**Cobrança aluno → prof:** plataforma **NÃO intermedia**. Prof escolhe gateway próprio (§5).

Referências: `00-PROJETO.md §3` · proposta_desafit.html · master plan §0.5.5.

---

## 2. Promessa (proposta — verbatim)

> _"Toda a estrutura para captar leads, vender o programa e processar pagamentos. Para quem ainda não precisa de aplicativo, mas precisa profissionalizar a aquisição."_

**Inclui (proposta):**

- Subdomínio `seunome.desafit.app`
- Página de vendas do programa
- Página de captação com formulário
- Formulário de onboarding personalizado
- Cálculo automático TDEE / calorias / macros
- Checkout integrado (Pix + cartão)
- Cupons de desconto configuráveis
- Pixel Meta + Google Analytics
- E-mail transacional com domínio do prof
- Painel de leads

**NÃO inclui:**

- PWA branded do aluno (Pacote B/C)
- Programa estruturado entregue (Pacote B/C)
- Aluno cadastrado dentro da plataforma (Pacote B/C)
- Treinamento por videoconferência (Pacote B/C)

---

## 3. Componentes técnicos dia 1

### 3.1 Captação branded (`platform.capture_forms` + `capture_submissions` + `leads`)

- Form multi-step, **mobile-first absoluto** (375px viewport touch real)
- Schema-driven via `capture_forms.fields jsonb` — Zod 4 `discriminatedUnion` por field type
- Campos por modalidade configuráveis (text, phone BR `libphonenumber-js`, enum, number, scale)
- Stepper visual horizontal (4-7 perguntas, 1 por tela mobile)
- Autosave debounced 800ms (parcial em refresh — `pagehide`+`visibilitychange`)
- Submit → cria `leads` row + dispara webhook Meta CAPI

Padrão: pesquisa 02 §3.4 (vibe coding pipeline UX) + blueprint/08-pwa-offline.md §7.

### 3.2 Relatório IA personalizado (`assessment`)

- Edge Function `generate-assessment` (Deno, `supabase/functions/`)
- Modelo: **Sonnet 4.6** via Vercel AI Gateway (zero markup)
- Output: relatório HTML/PDF (`@react-pdf/renderer`) com diagnóstico + recomendação + CTA
- Schema 2-tier (draft + strict) conforme blueprint/07-ai-prompts.md §4
- Guardrails dia 1: XML wrap + LLM judge (sem promessa médica/cura)
- PII placeholder antes do prompt (`maskAluno` em `lib/ai/pii.ts`)
- Cache `ephemeral` 5min no system (uso pontual, não session)
- Log em `public.ai_invocations` com hashes SHA256 (LGPD)
- Disponível via `/<slug>/assessment/<id>` (rota pública via rewrite PT)

### 3.3 Landing institucional do prof

- Schema `platform.pages` com `draft_blocks` + `published_blocks jsonb`
- Renderer SSR de blocos (11 tipos base — pesquisa 02 §4.4)
- **Tier 1 editor dia 1** (D-G69 — \_CONFLITOS #11): form-based em vaul bottom sheet (sem drag-drop)
- Tier 2 drag-drop entra no Pacote B
- White-label runtime via CSS via API route (D-G59 — blueprint/05-design-system.md §4)
- 13 paletas OKLCH oficiais (D-G76) — prof escolhe 1 no setup

### 3.4 CTA WhatsApp 1:1 (handoff venda)

- Botão sticky no relatório IA: `wa.me/<phone>?text=<msg pré-formatada>`
- Mensagem pré-formatada gerada pela IA com base no perfil do lead
- Template: `"Oi [Prof], vim do relatório do desafit. Meu objetivo é [X], comecei [Y]. Quero saber mais sobre o programa."`
- Sem chatbot in-app — venda fechada por humano (00-PROJETO §8 + D-G37)
- Tracking via `posthog.capture('whatsapp_handoff_clicked', { lead_id, assessment_id })`

### 3.5 Dashboard básico de leads (`/dashboard/capture`)

- Lista de leads (cards stack vertical em mobile, tabela em desktop)
- Status: `new` / `contacted` / `qualified` / `closed_won` / `closed_lost`
- Filtros via `nuqs` (URL state) — funcional em mobile 375px
- Export CSV ([I] quando 1º prof pedir)
- **Painel prof 100% mobile-first** (00-PROJETO §7) — testado em iPhone 14 portrait

### 3.6 Cálculo TDEE / calorias / macros

- Função pura em `lib/domain/nutrition.ts` (sem IO, sem React)
- Fórmula Mifflin-St Jeor (BMR) + multiplicador atividade
- Output: `{ bmr_kcal, tdee_kcal, protein_g, carb_g, fat_g }`
- Reutilizada em capture_form + relatório IA + onboarding aluno (futuro Pacote B/C)

### 3.7 Checkout integrado (link externo)

- Plataforma cria link via API do gateway escolhido pelo prof (Asaas/Pagar.me/MP/Stripe BR)
- Redirect ou iframe pro link — aluno paga lá (UX nativa do gateway, cuida do PCI)
- Webhook chega → atualiza `platform.payments.status = 'paid'`
- Sem enrollment automático no Pacote A (não há PWA pra liberar acesso)
- Sucesso → redirect `/<slug>/sucesso` com confirmação + próximos passos via WhatsApp

Detalhes: master plan §24.3 (adapter PaymentLinkProvider).

### 3.8 Cupons configuráveis

- Schema `platform.coupons (tenant_id, code, discount_type enum('percent'/'fixed'), discount_amount_minor, currency, max_uses, max_uses_per_client, expires_at, applicable_to enum)`
- CRUD admin via painel prof (`/dashboard/sales/coupons`)
- Validação no checkout (server action)

### 3.9 Pixel Meta + GA4 (per-tenant)

- Storage em `tenants.pixels jsonb`: `{ meta_pixel_id, ga4_measurement_id, meta_access_token (encrypted) }`
- UI settings em `/dashboard/settings/integrations` — prof cola IDs próprios
- Eventos canônicos (snake_case): `page_view`, `form_start`, `form_submit`, `lead_qualified` (após assessment), `checkout_initiated`, `purchase`
- Meta CAPI server-side via Edge Function `/api/webhooks/pixel-event` com deduplicação `event_id`
- Cookie consent banner com opt-in granular (analytics/marketing/essencial) — LGPD

### 3.10 E-mail transacional (domínio próprio)

- Resend + `react-email` templates
- 5 templates dia 1: `welcome-lead`, `assessment-ready`, `checkout-confirmation`, `whatsapp-followup-1`, `whatsapp-followup-2`
- Domínio do prof verified via Resend domain auth (DNS records)
- `from: noreply@<subdomain>.desafit.app` no Pacote A; full custom em B/C

---

## 4. Restrições explícitas

- **Sem PWA branded do aluno** — entra no Pacote B
- **Sem programa estruturado entregue** (`programs/modules/components`) — entra no Pacote B
- **Sem cadastro de aluno dentro da plataforma** — aluno só vira `lead`; conversão pra `client` é Pacote B
- **Sem chatbot IA** — só relatório IA pontual (assessment, não conversação)
- **Sem treinamento por videoconferência** — entra Pacote B/C
- **Sem custom domain externo** (`seudominio.com.br`) — subdomínio `<slug>.desafit.app` só. Custom domain Pacote B/C (Cloudflare for SaaS)

---

## 5. Gateway pagamento prof → aluno (não-intermediação)

Prof escolhe e configura próprio gateway no painel. Plataforma **NÃO intermedia** valores no Pacote A.

Ordem de implementação (master plan §24.3):

| Ordem | Gateway                    | Moeda               | Quando                                                          |
| ----- | -------------------------- | ------------------- | --------------------------------------------------------------- |
| 1     | **Asaas**                  | BRL                 | Dia 1 (link externo, API simples, doc PT-BR, Pix R$0,49)        |
| 2     | **Stripe**                 | USD/EUR/GBP/CAD/AUD | **Dia 1 também** (D-G33) — prof brasileiro vendendo no exterior |
| 3     | Pagar.me                   | BRL                 | Quando 1º tenant pedir                                          |
| 4     | Mercado Pago               | BRL                 | Quando 1º tenant pedir                                          |
| 5     | Stripe BR (BRL via Stripe) | BRL                 | Quando demanda aparecer                                         |

Tenant cola credenciais em `/dashboard/settings/payment` (encrypted em `platform.payment_methods.gateway_config jsonb` via pgcrypto).

Detalhes: master plan §24.3 + pesquisa 01 §2.1.

---

## 6. SLA e suporte

- Suporte direto com fundador (WhatsApp + email)
- Resposta em até 24h úteis
- Tickets de DNS/SSL/configuração: prioridade alta
- Bug crítico (form não submete, IA não responde): resposta < 4h úteis
- Upgrade pra B/C disponível qualquer momento — diferença de valor mantida

---

## 7. Roadmap interno de entrega (30 dias)

**Semana 1 (dias 1-7):**

- Materiais recebidos do prof (logo, cor primária, bio, conteúdo programa)
- Tenant criado em `/admin/tenants/new` (vertical, slug, default_currency, default_locale)
- Branding configurado (`deriveTokens(primary)` gera 21 tokens)
- Subdomínio `<slug>.desafit.app` ativo

**Semana 2 (dias 8-14):**

- Landing institucional publicada (fundador monta JSON via admin OU tier 1 editor)
- Página de vendas do programa publicada
- Pixel + GA4 configurados
- Resend domain verified

**Semana 3 (dias 15-21):**

- Form de captação configurado (campos por modalidade)
- Edge Function `generate-assessment` testada com perfil real
- CTA WhatsApp com mensagem template
- Email templates customizados com domínio do prof

**Semana 4 (dias 22-30):**

- Checkout integrado com gateway escolhido
- Cupons configurados (se prof tem campanha)
- Dashboard de leads ativo (CRUD via admin)
- Treinamento por videoconferência (60min Zoom/Meet)
- Smoke test E2E: lead entra → form → assessment IA → CTA WhatsApp → checkout → email confirmação

**Critério "entregue":** humano real (não o prof) completa o fluxo end-to-end sem intervenção do fundador. Master plan §33.13 (regra de ouro).

---

## 8. Princípio §39 aplicado

Schema dia 0 cobre 100% da promessa do Pacote A. Toda feature é **entregue automatizada** sempre que possível.

**Manual aceito pro 1º cliente** (cronograma apertar):

- Editor visual de páginas (`pages.draft_blocks`) — fundador monta JSON; tier 1 editor entra sprint imediato pós-1º cliente
- Configuração tema (palette + tokens) — fundador faz via admin; UI self-service em sprint pós-1º

**Não pode adiar (entra junto com 1º cliente):**

- Form captação (`capture_forms` CRUD admin)
- Edge Function `generate-assessment`
- Checkout link externo (Asaas/Stripe)
- Dashboard leads CRUD
- Pixel + GA4 settings

Memória: `project_desafit_principio_39_revisto.md`.

---

## 9. Métricas TTFV (PostHog)

| Métrica                       | Definição                                                     | Target                        |
| ----------------------------- | ------------------------------------------------------------- | ----------------------------- |
| **Tempo até 1ª venda paga**   | `prof.created_at → 1º payment.status = 'paid'`                | P50 < 45 dias (Pacote A puro) |
| **Setup-to-active rate**      | % de tenants Pacote A com lead chegando em 14 dias da entrega | ≥ 70%                         |
| **Lead → conversão WhatsApp** | % de assessments com CTA WhatsApp clicado                     | ≥ 30%                         |
| **Lead → fechamento venda**   | % de leads que viram `payment.status = 'paid'`                | ≥ 5% (baseline cold)          |

Eventos canônicos: `professional_signed_up`, `program_published`, `lead_captured`, `assessment_generated`, `whatsapp_handoff_clicked`, `purchase`.

---

## 10. Mobile-first 100% (00-PROJETO §7)

- **Painel prof** funciona em viewport 375px touch real — 90% dos profs operam APENAS via mobile
- Touch targets ≥ 44px em TODO lugar (não só PWA aluno futuro)
- Input `font-size: 16px` SEMPRE (anti auto-zoom iOS)
- Modais via vaul bottom-sheet em mobile (não Dialog desktop)
- Tabelas viram cards stack vertical em mobile (`md:hidden` / `hidden md:table`)
- Form-based primeiro (touch-friendly); sem drag-drop fino no tier 1 editor
- Desktop é progressive enhancement, nunca premissa

Detalhes: blueprint/05-design-system.md §14 (sheet decision tree) + pesquisa 15.

---

## Referências

- `00-PROJETO.md` §3 (pacote A) · §7 (mobile-first) · §8 (sem chat 1:1)
- `_CONFLITOS.md` #11 (editor tier 1) · #16 (pipeline UI dia 0)
- `05-design-system.md` (white-label + 13 paletas)
- `06-data-model.md` §3 (core tabelas) · §4.1 (JIT entram com 1º cliente A)
- `07-ai-prompts.md` §1-§5 (stack IA + JSON Outputs + caching) · §7 (guardrails)
- Master plan §3 (pacote A detalhado) · §13.2 (questions form) · §24.3 (gateway adapter) · §33.13 (M2 Pacote A entregável)
- Pesquisa 01 (white-label-strategies) · pesquisa 03 (engenharia de prompt) · pesquisa 07 (planejamento ordem)
- proposta_desafit.html (canon comercial)

## Histórico

| Data       | Mudança                                                                                             | Aprovador |
| ---------- | --------------------------------------------------------------------------------------------------- | --------- |
| 2026-05-17 | Versão inicial — Pacote A R$1.500 + R$100/mês, 30d entrega, 9 componentes técnicos, gateway externo | Leandro   |
