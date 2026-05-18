# Checklist MVP Captação — onboarding.bio

> **Criado:** 2026-04-30
> **Atualizado:** 2026-04-30 (auditoria UI/UX + mapa de rotas + decisões de acesso)
> **Objetivo:** tudo que precisa estar 100% antes de abrir as 30 vagas beta.
> **Pricing beta:** R$27/mês vitalício, 30 vagas (5 por modalidade × 6 modalidades).
> **Decisões de referência:** D97-D112 em `docs/core/decisions.md`

---

## Decisões de acesso MVP (D108-D112)

| #    | Decisão                                                                                                                                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| D108 | **Plano único.** Sem distinção Core/Pro no MVP. Todos pagam R$27/mês e têm acesso total. O que muda pós-MVP é a taxa sobre produtos vendáveis, não o plano mensal.                                                 |
| D109 | **SiteHub liberado pra todos.** Remover `proOnly` de `/landing` (site editor). Todos os PTs gerenciam site, serviços, planos, depoimentos, credenciais, FAQ, locais, metodologia.                                  |
| D110 | **Edição de formulários bloqueada no MVP.** CustomizationEditor desabilitado — PT usa templates fixos. Reabilitar quando padrões emergirem dos 30 betas.                                                           |
| D111 | **Landing de venda dos betas = página 3 do prospect.** Rota `/diagnostico/r/[token]/comecar` (ActivationPage) é a landing de conversão. `/lancamento` e `/landing-completa` ficam preservadas mas inativas.        |
| D112 | **Lógica proOnly mantida pra bloqueio futuro.** Usaremos o gate `proOnly`/`landing_tier` pra bloquear features de produtos vendáveis (Programa em Grupo, etc) quando chegarem. No MVP, todo beta tem acesso total. |

---

## Mapa de rotas — todas as páginas que o PT vê no MVP

### A. Jornada do prospect (captar os 30 betas)

| #   | Rota pública (PT-BR)             | Rota interna (EN)               | Componente                               | Estado visual | Ação MVP                                  |
| --- | -------------------------------- | ------------------------------- | ---------------------------------------- | ------------- | ----------------------------------------- |
| A1  | `/em-breve`                      | `coming-soon`                   | Coming soon + CTA diagnóstico            | POLISHED      | Manter como home (`/` redireciona pra cá) |
| A2  | `/diagnostico`                   | `diagnostic`                    | DiagnosticoShell (form prospect)         | DRAFT         | Verificar renderização e UX               |
| A3  | `/diagnostico/r/[token]`         | `diagnostic/r/[token]`          | AuditReport (relatório "Método")         | POLISHED      | —                                         |
| A4  | `/diagnostico/r/[token]/analise` | `diagnostic/r/[token]/analysis` | AuditAnalysis (insights IA)              | POLISHED      | —                                         |
| A5  | `/diagnostico/r/[token]/comecar` | `diagnostic/r/[token]/start`    | ActivationPage (7 seções + pricing + WA) | DRAFT         | **Revisar pricing R$27, features, CTA**   |

**Fluxo:** onboarding.bio → `/em-breve` → `/diagnostico` → relatório → `/comecar` → WhatsApp com fundador → onboarding manual

### B. Auth

| #   | Rota               | Componente                        | Estado visual | Ação MVP |
| --- | ------------------ | --------------------------------- | ------------- | -------- |
| B1  | `/signup`          | SignupForm + Google OAuth         | POLISHED      | —        |
| B2  | `/login`           | LoginForm + Google OAuth + OneTap | POLISHED      | —        |
| B3  | `/forgot-password` | ForgotPasswordForm                | POLISHED      | —        |
| B4  | `/reset-password`  | ResetPasswordForm                 | POLISHED      | —        |
| B5  | `/verify-email`    | ResendVerificationButton          | POLISHED      | —        |

### C. Onboarding (23 steps)

| #   | Rota          | Componente                 | Estado visual | Ação MVP                                                                  |
| --- | ------------- | -------------------------- | ------------- | ------------------------------------------------------------------------- |
| C1  | `/onboarding` | OnboardingShell (23 steps) | DRAFT         | Smoke test completo. Verificar checkout steps. Pricing deve refletir R$27 |

**Steps:** welcome → name → photo → background → bio → credentials → WhatsApp → preview → checkpoint1 → modality → focus → nutrition → service mode → checkpoint2 → personality → audience → checkpoint3 → transition → site-loading → simulation → pricing-bridge → pricing → checkout → celebration

### D. Dashboard (uso diário)

| #   | Rota pública     | Rota interna   | Componente                                                                     | Estado visual | Ação MVP                                                |
| --- | ---------------- | -------------- | ------------------------------------------------------------------------------ | ------------- | ------------------------------------------------------- |
| D1  | `/dashboard`     | `dashboard`    | Stats, leads chart, funnel, capture link                                       | POLISHED      | **Fix: padding bottom nav mobile**                      |
| D2  | `/leads`         | `leads`        | Lista com cards mobile + tabela desktop                                        | POLISHED      | —                                                       |
| D3  | `/leads/[id]`    | `leads/[id]`   | Detail: status, notas, follow-up, report                                       | POLISHED      | —                                                       |
| D4  | `/leads/novo`    | `leads/new`    | ManualLeadForm                                                                 | POLISHED      | —                                                       |
| D5  | `/clientes`      | `clients`      | Lista com stats, MRR                                                           | POLISHED      | **Manter locked — gestão de clientes é pós-MVP (D112)** |
| D6  | `/clientes/[id]` | `clients/[id]` | Detail: 6 tabs (perfil, avaliações, treinos, plano, pagamentos, transformação) | POLISHED      | Idem                                                    |
| D7  | `/clientes/novo` | `clients/new`  | NewClientForm                                                                  | POLISHED      | Idem                                                    |

### E. Templates / Formulários

| #   | Rota pública             | Rota interna          | Componente                              | Estado visual | Ação MVP |
| --- | ------------------------ | --------------------- | --------------------------------------- | ------------- | -------- |
| E1  | `/formulario`            | `template`            | TemplateGrid — picker de especialidades | POLISHED      | —        |
| E2  | `/formulario/[modality]` | `template/[modality]` | Grid de templates por modalidade        | POLISHED      | —        |
| E3  | `/formulario/ativos`     | `template/active`     | Lista de templates ativados             | POLISHED      | —        |
| E4  | —                        | `forms`               | REDIRECT → `/formulario`                | REDIRECT      | —        |

**Nota:** CustomizationEditor (edição de perguntas/IA) **bloqueado no MVP** (D110). PT só ativa/desativa templates.

### F. Site editor + conteúdo

| #   | Rota pública   | Rota interna   | Componente                          | Estado visual | Ação MVP                                       |
| --- | -------------- | -------------- | ----------------------------------- | ------------- | ---------------------------------------------- |
| F1  | `/site`        | `site`         | SiteHub (editor + tabs de conteúdo) | POLISHED      | **Liberar pra todos — remover proOnly (D109)** |
| F2  | `/servicos`    | `services`     | REDIRECT → `/site?tab=servicos`     | REDIRECT      | Funciona se F1 liberado                        |
| F3  | `/planos`      | `plans`        | REDIRECT → `/site?tab=planos`       | REDIRECT      | Idem                                           |
| F4  | `/depoimentos` | `testimonials` | REDIRECT → `/site?tab=depoimentos`  | REDIRECT      | Idem                                           |
| F5  | `/credenciais` | `credentials`  | REDIRECT → `/site?tab=credenciais`  | REDIRECT      | Idem                                           |
| F6  | `/faq`         | `faq`          | REDIRECT → `/site?tab=faq`          | REDIRECT      | Idem                                           |
| F7  | `/locais`      | `locations`    | REDIRECT → `/site?tab=locais`       | REDIRECT      | Idem                                           |
| F8  | `/metodologia` | `methodology`  | REDIRECT → `/site?tab=metodologia`  | REDIRECT      | Idem                                           |

### G. Settings

| #   | Rota pública              | Rota interna             | Componente                                   | Estado visual | Ação MVP                |
| --- | ------------------------- | ------------------------ | -------------------------------------------- | ------------- | ----------------------- |
| G1  | `/settings/profile`       | `settings/profile`       | ProfileForm (nome, bio, foto, links)         | POLISHED      | —                       |
| G2  | `/settings/contact`       | `settings/contact`       | ContactForm (slug, WhatsApp)                 | POLISHED      | —                       |
| G3  | `/settings/design`        | `settings/design`        | DesignForm (cor, tipografia, shape, density) | POLISHED      | —                       |
| G4  | `/settings/media`         | `settings/media`         | HeroMediaUpload + GalleryUpload              | POLISHED      | —                       |
| G5  | `/settings/notifications` | `settings/notifications` | 9 toggles + histórico                        | POLISHED      | —                       |
| G6  | `/settings/packages`      | `settings/packages`      | REDIRECT → `/planos`                         | REDIRECT      | Funciona se F1 liberado |
| G7  | `/settings/subscription`  | `settings/subscription`  | REDIRECT → `/subscription`                   | REDIRECT      | —                       |

### H. Subscription

| #   | Rota            | Componente                               | Estado visual | Ação MVP |
| --- | --------------- | ---------------------------------------- | ------------- | -------- |
| H1  | `/subscription` | CheckoutFlow + status + history + cancel | POLISHED      | —        |

### I. Páginas públicas do PT (compartilháveis)

| #   | Rota                         | Componente                              | Estado visual | Ação MVP                                          |
| --- | ---------------------------- | --------------------------------------- | ------------- | ------------------------------------------------- |
| I1  | `/[slug]`                    | ProfessionalLink (link-in-bio)          | POLISHED      | **Falta: SEO dinâmico**                           |
| I2  | `/[slug]/site`               | PremiumLanding (13 seções)              | POLISHED      | **Falta: SEO dinâmico. Liberar pra todos (D109)** |
| I3  | `/[slug]/analise`            | Modality picker (auto-redirect se 1 só) | POLISHED      | —                                                 |
| I4  | `/[slug]/analise/[modality]` | LeadForm (formulário público)           | POLISHED      | —                                                 |
| I5  | `/r/[token]`                 | LeadReport (relatório do lead)          | POLISHED      | —                                                 |

### J. Páginas preservadas (não ativas no MVP)

| #   | Rota                | Estado     | Nota                                                     |
| --- | ------------------- | ---------- | -------------------------------------------------------- |
| J1  | `/lancamento`       | PRESERVADA | Landing de lançamento alternativa. Não é o caminho ativo |
| J2  | `/landing-completa` | PRESERVADA | Landing SaaS oficial futura. `robots: noindex`           |
| J3  | `/pricing`          | PRESERVADA | Tabela de pricing institucional                          |

### K. Admin (interno)

| #   | Rota                               | Estado   | Nota                |
| --- | ---------------------------------- | -------- | ------------------- |
| K1  | `/admin/prompts`                   | POLISHED | CRUD de prompts IA  |
| K2  | `/admin/prompts/[key]`             | POLISHED | Editor + histórico  |
| K3  | `/admin/prompts/[key]/generations` | POLISHED | Logs de gerações IA |

---

## Itens de polish visual por página

### Prioridade alta (bloqueantes pro MVP)

| #   | Página           | Problema                                                                      | Esforço |
| --- | ---------------- | ----------------------------------------------------------------------------- | ------- |
| 1   | D1 `/dashboard`  | Padding bottom nav mobile — conteúdo fica atrás da nav                        | 5min    |
| 2   | A5 `/comecar`    | Pricing mostra valor antigo. Revisar pra R$27, features atualizadas, roadmap  | 3-4h    |
| 3   | C1 `/onboarding` | Smoke test 23 steps. Pricing step deve refletir R$27. Checkout deve funcionar | 4-6h    |
| 4   | I1-I2 `/[slug]`  | `generateMetadata` + OG image pra share no WhatsApp                           | 4h      |
| 5   | F1 `/site`       | Remover `proOnly` de SidebarNav, DrawerNav (`/landing` item)                  | 30min   |
| 6   | E1 `/formulario` | Bloquear acesso ao CustomizationEditor (gate ou remover botão "Configurar")   | 1-2h    |
| 7   | Global           | `overscroll-behavior: none` + `-webkit-tap-highlight-color: transparent`      | 5min    |
| 8   | Global           | `inputMode="numeric"` em inputs numéricos (BasicsStep, etc)                   | 15min   |

### Prioridade média (v1.1)

| #   | Página                                      | Problema                                       | Esforço |
| --- | ------------------------------------------- | ---------------------------------------------- | ------- |
| 9   | A2 `/diagnostico`                           | Verificar UX do form prospect — wrapper mínimo | 1h      |
| 10  | Creatives (~74 hex inline)                  | Migrar cores hardcoded pra tokens              | 3-4h    |
| 11  | Diagnostic-activation (~5 hex inline)       | Migrar coral e dark backgrounds                | 30min   |
| 12  | Tipografia arbitrary fora de creatives (~5) | text-[15px] etc → tokens                       | 15min   |

---

## 1. Formulários: 6 modalidades + 33 templates

| Item                                                                                                | Estado           | Ação                                                                          |
| --------------------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------- |
| 33 specialty templates no banco (musc 9, corrida 6, ciclismo 5, crossfit 4, natação 5, triathlon 4) | PRONTO           | —                                                                             |
| `ACTIVE_MODALITIES` ativa as 6                                                                      | FEITO 2026-05-01 | Fase 6.1 — 6 modalidades + `MODALITIES_BY_PROFESSION` atualizado              |
| Form renderiza todas as 6                                                                           | FALTA VERIFICAR  | QA: submit de pelo menos 1 template por modalidade                            |
| Branch logic funciona nas 6                                                                         | FALTA VERIFICAR  | QA por modalidade                                                             |
| Cálculos específicos (VDOT, FTP, CSS, SWOLF, pace, etc.)                                            | PRONTO           | Verificar que cada modalidade usa os cálculos corretos                        |
| Engine Deno (Edge Function) espelha client                                                          | PRONTO           | —                                                                             |
| Inputs numéricos com `inputMode="numeric"`                                                          | FEITO 2026-04-30 | Adicionar em `BasicsStep.tsx` (age, weight, height) e demais inputs numéricos |
| CustomizationEditor bloqueado (D110)                                                                | FEITO 2026-05-01 | Fase 6.6 — botão removido + rota mobile redireciona                           |

---

## 2. Relatório IA (Haiku)

| Item                                                            | Estado | Ação |
| --------------------------------------------------------------- | ------ | ---- |
| Edge Function `submit-form` (orquestração)                      | PRONTO | —    |
| Prompt `submit-form.system` no banco (claude-haiku-4-5)         | PRONTO | —    |
| Report renderiza (`components/report/lead/`, 8 seções + gauges) | PRONTO | —    |
| Rota pública `/r/[token]`                                       | PRONTO | —    |
| Brand customization no relatório                                | PRONTO | —    |
| Logging em `ai_generations`                                     | PRONTO | —    |

---

## 3. Página premium do profissional

| Item                                                  | Estado           | Ação                                                                 |
| ----------------------------------------------------- | ---------------- | -------------------------------------------------------------------- |
| PremiumLanding com 13 seções modulares                | PRONTO           | —                                                                    |
| Brand customization (cor, tipografia, shape, density) | PRONTO           | —                                                                    |
| Mobile-first + sticky CTA mobile                      | PRONTO           | —                                                                    |
| Editor no dashboard (LandingEditor, 12 tabs)          | PRONTO           | —                                                                    |
| SEO dinâmico (`generateMetadata` + OG image)          | FEITO 2026-05-01 | Fase 6.3 — `generateMetadata` + OG em ambas rotas                    |
| Revalidação ISR 60s                                   | PRONTO           | —                                                                    |
| Acesso liberado pra todos (D109)                      | FEITO 2026-05-01 | Fase 6.5 — proOnly removido de SidebarNav + DrawerNav + gate de page |

---

## 4. Gestão de leads

| Item                                                    | Estado           | Ação                                                                                                                            |
| ------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| List view + detail view + paginação                     | PRONTO           | —                                                                                                                               |
| Status workflow (new/contacted/converted/lost/archived) | PRONTO           | —                                                                                                                               |
| Notas, follow-up, external links                        | PRONTO           | —                                                                                                                               |
| Filtros (status, modalidade, busca)                     | PRONTO           | —                                                                                                                               |
| Conversão lead → cliente                                | PRONTO           | —                                                                                                                               |
| Stats no dashboard                                      | PRONTO           | —                                                                                                                               |
| Notificação WA/email on new lead                        | FEITO 2026-05-01 | Fase 6.2 — WA já existia; email adicionado (check prefs + auth.admin). Deploy pendente: `supabase functions deploy submit-form` |

---

## 5. Gestão de serviços, preços e planos

| Item                                             | Estado           | Ação                        |
| ------------------------------------------------ | ---------------- | --------------------------- |
| ServiceManager CRUD                              | PRONTO           | —                           |
| PlanManager / PackageManager CRUD                | PRONTO           | —                           |
| Planos aparecem na landing premium (seção Plans) | PRONTO           | —                           |
| Acesso liberado pra todos (D109)                 | FEITO 2026-05-01 | Fase 6.5 — SiteHub liberado |

---

## 6. Gestão de depoimentos e fotos antes/depois

| Item                                                | Estado           | Ação                        |
| --------------------------------------------------- | ---------------- | --------------------------- |
| TestimonialManager CRUD (foto, rating, publish)     | PRONTO           | —                           |
| Auto-generate from clients                          | PRONTO           | —                           |
| Acesso liberado pra todos (D109)                    | FEITO 2026-05-01 | Fase 6.5 — SiteHub liberado |
| TransformationEditor (antes/depois, `is_published`) | PRONTO           | —                           |
| Transformations sem cliente (marketing)             | PRONTO           | `client_id` nullable        |
| Transformations na landing pública                  | PRONTO           | —                           |

---

## 7. Onboarding completo

| Item                                           | Estado          | Ação                                                |
| ---------------------------------------------- | --------------- | --------------------------------------------------- |
| 23 steps wizard                                | PRONTO          | —                                                   |
| Persistência de step no banco                  | PRONTO          | —                                                   |
| Google OAuth + email/senha                     | PRONTO          | —                                                   |
| Checkout integrado (EFI) no step de pricing    | PRONTO          | —                                                   |
| Simulation Explorer (preview site/form/report) | PRONTO          | —                                                   |
| Pricing reflete R$27/mês                       | FALTA VERIFICAR | Verificar step de pricing/checkout                  |
| Ajustes necessários                            | A DEFINIR       | Definir quais ajustes de onboarding o fundador quer |

---

## 8. EFI Bank funcionando

| Item                                               | Estado          | Ação                                                            |
| -------------------------------------------------- | --------------- | --------------------------------------------------------------- |
| Checkout (credit card + PIX Automático)            | PRONTO          | —                                                               |
| Webhook handler (idempotente, dunning, chargeback) | PRONTO          | —                                                               |
| Cancelamento self-service + exit survey            | PRONTO          | —                                                               |
| Histórico de pagamentos                            | PRONTO          | —                                                               |
| Promo codes                                        | PRONTO          | 1 código ativo                                                  |
| Plan IDs em produção                               | FALTA VERIFICAR | Configurar `EFI_PLAN_CORE_ID` e `EFI_PLAN_PRO_ID` com IDs reais |
| Smoke test com pagamento real                      | FALTA           | Testar sandbox + produção                                       |

---

## 9. Formulário de prospect (captar os 30)

| Item                                               | Estado | Ação |
| -------------------------------------------------- | ------ | ---- |
| AuditForm + DiagnosticIntro + QuestionScreen       | PRONTO | —    |
| 60 perguntas no banco (`prospect_questions`)       | PRONTO | —    |
| Edge Function `generate-diagnostic` (deployed v16) | PRONTO | —    |
| Rota pública `/diagnostico`                        | PRONTO | —    |

---

## 10. Relatório do prospect

| Item                                                         | Estado | Ação |
| ------------------------------------------------------------ | ------ | ---- |
| AuditReport + AuditAnalysis + 4 seções                       | PRONTO | —    |
| Rota `/diagnostico/r/[token]`                                | PRONTO | —    |
| Prompt `generate-diagnostic.system` no banco (claude-sonnet) | PRONTO | —    |

---

## 11. Landing de venda dos 30 betas (D111)

| Item                                                                                    | Estado             | Ação                                                                      |
| --------------------------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------- |
| ActivationPage com 7 seções (template, site, WA, dashboard, traffic, founders, pricing) | PRONTO (estrutura) | —                                                                         |
| Pricing atualizado R$27/mês                                                             | FALTA              | Revisar `PricingSection` em `components/diagnostic-activation/_sections/` |
| Features listadas atualizadas                                                           | FALTA              | Conferir com lista de features reais do MVP                               |
| Sticky WhatsApp CTA                                                                     | PRONTO             | —                                                                         |
| Rota ativa via fluxo prospect                                                           | PRONTO             | `/diagnostico/r/[token]/comecar` — acesso natural via tab "Começar"       |

---

## 12. Painel do profissional: nav e bloqueios

### Nav atualizada (D109 + D110 + D112)

| Rota            | Sidebar | Mobile | Drawer | Gate MVP   | Ação                                    |
| --------------- | ------- | ------ | ------ | ---------- | --------------------------------------- |
| `/dashboard`    | Sim     | Sim    | Sim    | Aberto     | —                                       |
| `/leads`        | Sim     | Sim    | Sim    | Aberto     | —                                       |
| `/formulario`   | Sim     | Sim    | Sim    | Aberto     | CustomizationEditor bloqueado (D110) ✅ |
| `/clients`      | Sim     | Sim    | Sim    | **Locked** | Manter locked pra MVP (D112)            |
| `/site`         | Sim     | —      | Sim    | **Aberto** | ✅ proOnly removido (D109, Fase 6.5)    |
| `/servicos`     | —       | —      | Sim    | Aberto     | —                                       |
| `/settings`     | Sim     | —      | Sim    | Aberto     | —                                       |
| `/subscription` | —       | —      | Sim    | Aberto     | —                                       |

---

## 13. Configurações disponíveis no MVP

| Sub-página                                           | Estado           | MVP                                                |
| ---------------------------------------------------- | ---------------- | -------------------------------------------------- |
| `/settings/profile` (nome, bio, foto, links)         | PRONTO           | Sim                                                |
| `/settings/contact` (slug, WhatsApp)                 | PRONTO           | Sim                                                |
| `/settings/design` (cor, tipografia, shape, density) | PRONTO           | Sim                                                |
| `/settings/media` (hero, gallery)                    | PRONTO           | Sim                                                |
| `/settings/notifications` (9 toggles + histórico)    | PRONTO           | Sim                                                |
| `/settings/packages` → `/planos`                     | PRONTO           | Sim (SiteHub liberado)                             |
| `/settings/subscription` → `/subscription`           | PRONTO           | Sim                                                |
| Trocar email in-app                                  | FEITO 2026-05-01 | Fase 6.10 — `/settings/account` com `AccountForms` |
| Trocar senha in-app                                  | FEITO 2026-05-01 | Fase 6.11 — incluso no `AccountForms`              |

---

## 14. Infra e deploys

| Item                              | Estado   | Ação                                                        |
| --------------------------------- | -------- | ----------------------------------------------------------- |
| ~~2 migrations pendentes~~        | ✅ FEITO | Aplicadas + registradas (2026-04-30)                        |
| ~~31 arquivos uncommitted~~       | ✅ FEITO | 4 commits pushed (2026-04-30): fases 26-27, 30, 31-33, docs |
| tsc 0 erros                       | PRONTO   | —                                                           |
| vitest 401/401                    | PRONTO   | —                                                           |
| lint 0 erros                      | PRONTO   | —                                                           |
| build passa                       | PRONTO   | —                                                           |
| 11 Edge Functions deployed ACTIVE | PRONTO   | —                                                           |
| 136 RLS policies ativas           | PRONTO   | —                                                           |

---

## 15. Mobile-first e UX

| Item                                       | Estado           | Ação                                                                  |
| ------------------------------------------ | ---------------- | --------------------------------------------------------------------- |
| Dashboard: padding bottom nav mobile       | FEITO 2026-05-01 | Stats tocáveis, chart scrollável, funnel vertical                     |
| `overscroll-behavior: none` no body        | FEITO 2026-04-30 | `globals.css`                                                         |
| `-webkit-tap-highlight-color: transparent` | FEITO 2026-04-30 | `globals.css`                                                         |
| Inputs numéricos com `inputMode`           | FEITO 2026-04-30 | `BasicsStep.tsx`, `TransformationEditor.tsx`, `ClientPlanSection.tsx` |
| Leads: card mobile + table desktop         | PRONTO           | —                                                                     |
| Clients: card mobile + table desktop       | PRONTO           | —                                                                     |
| Safe-area insets (notch)                   | PRONTO           | —                                                                     |
| Bottom nav flutuante (pill, badges)        | PRONTO           | —                                                                     |
| Touch targets 44px+                        | PRONTO           | —                                                                     |
| Viewport `dvh` + `viewportFit: cover`      | PRONTO           | —                                                                     |
| Modals/sheets responsivos                  | PRONTO           | —                                                                     |
| Haptic feedback em forms                   | PRONTO           | —                                                                     |

---

## 16. Segurança e compliance

| Item                                                          | Estado     | Ação                                                                      |
| ------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------- |
| Rate limit em endpoints públicos (login, signup, form submit) | FEITO      | Auth+diagnostic+intake rate limited via Upstash (Fase 5)                  |
| ToS (Termos de Serviço)                                       | ⏸️ EXTERNO | Pendente jurídico — rewrites prontos                                      |
| Privacy Policy                                                | ⏸️ EXTERNO | Pendente jurídico — rewrites prontos                                      |
| `consent_logs` funcionando                                    | PRONTO     | —                                                                         |
| `data_subject_requests` (DSR)                                 | FEITO      | Tabela + processo documentado em docs/operacional/dsr-process.md (Fase 5) |
| RLS isolation (PT A não vê dados de PT B)                     | FEITO      | Testado via MCP — PT A não vê leads de PT B (Fase 5)                      |

---

## 17. Observabilidade

| Item                           | Estado | Ação                                                           |
| ------------------------------ | ------ | -------------------------------------------------------------- |
| Sentry instalado               | PRONTO | —                                                              |
| Sentry source maps em produção | FEITO  | withSentryConfig em next.config.ts (Fase 5)                    |
| Vercel Analytics               | FEITO  | @vercel/analytics + @vercel/speed-insights instalados (Fase 5) |
| Alertas Sentry calibrados      | FEITO  | Recomendações documentadas — configurar no dashboard (Fase 5)  |
| `ai_generations` logging       | PRONTO | —                                                              |

---

## 18. Design system — token cascade pro tema do PT

O PT muda cor, tipografia, shape e density nas settings. Hoje só **cor** cascateia corretamente pros componentes. Os demais precisam de ajuste.

### 18.1 Cascade: o que funciona vs não funciona

| Dimensão                                | Funciona?     | Problema                                                                                                                                             | Ação                                                                                                           |
| --------------------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Cor (palette)**                       | ✅ Sim        | `data-palette` → `--palette-primary` → `--color-primary` → `bg-primary`                                                                              | —                                                                                                              |
| **Modo claro/escuro**                   | ✅ Sim        | `theme_mode` funciona                                                                                                                                | —                                                                                                              |
| **Shape (border-radius)**               | ❌ Não        | shadcn usa `rounded-md` hardcoded. Só `card.tsx` e `surface.tsx` usam `var(--shape-*)`                                                               | Trocar `rounded-md` → `rounded-[var(--shape-button)]` em button, input, select, dialog, sheet (~6 componentes) |
| **Density (padding)**                   | ❌ Não        | shadcn usa `px-4 py-2` hardcoded. Nenhum usa `var(--density-pad-*)`                                                                                  | Postergar pro MVP — "cozy" fixo funciona pra 30 betas                                                          |
| **Font (typography)**                   | ⚠️ Parcial    | `data-typography` muda `--font-display-active` mas shadcn usa `font-sans` fixo. Headings custom pegam, body text não                                 | Aceitar: display/headings mudam, body text fica sans. Comportamento esperado                                   |
| **Data attributes em páginas públicas** | ❌ Incompleto | `/[slug]`, `/[slug]/site`, `/[slug]/analise` setam `data-palette` e `data-typography` mas **NÃO setam** `data-shape`, `data-density`, `data-surface` | Adicionar os 3 atributos faltantes em 3 páginas                                                                |
| **Shape (border-radius)**               | ✅ Sim        | shadcn usa `var(--shape-*)` em todos os componentes                                                                                                  | —                                                                                                              |
| **Density (padding)**                   | ✅ Sim        | shadcn usa `var(--density-pad-*)` em todos os componentes                                                                                            | —                                                                                                              |
| **Font (typography)**                   | ✅ Sim        | Headings custom e body text sans conforme design                                                                                                     | —                                                                                                              |
| **Data attributes em páginas públicas** | ✅ Sim        | Todas as 5 páginas públicas usam resolveDesignAttrs                                                                                                  | —                                                                                                              |

### 18.2 Ações bloqueantes

| #    | Item                                                                                                                                                              | Esforço |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| DS-1 | Páginas públicas: adicionar `data-shape`, `data-density`, `data-surface="public"` em `/[slug]`, `/[slug]/site`, `/[slug]/analise`                                 | 30min   |
| DS-2 | shadcn shape cascade: trocar `rounded-md` → `rounded-[var(--shape-button)]` em `button.tsx`, `input.tsx`, `select.tsx`, `dialog.tsx`, `sheet.tsx`, `textarea.tsx` | 2-3h    |
| DS-3 | shadcn card/surface: verificar que `var(--shape-card)` está sendo usado (já parcial)                                                                              | 30min   |
| DS-1 | ✅ FEITO 2026-05-01 — Adicionado data-shape, data-density, data-surface em todas páginas públicas                                                                 | 30min   |
| DS-2 | ✅ FEITO 2026-04-30 — Shape cascade em button, input, select, dialog, sheet, textarea                                                                             | 2-3h    |
| DS-3 | ✅ FEITO 2026-04-30 — Card e surface usam var(--shape-card)                                                                                                       | 30min   |

### 18.3 Componentes DS compliance

95%+ dos componentes usam o DS corretamente. Violações encontradas:

| Arquivo                                             | Problema                               | Ação                                                  |
| --------------------------------------------------- | -------------------------------------- | ----------------------------------------------------- |
| `leads/page.tsx` (linhas 152-205)                   | `<table>` raw desktop                  | Migrar pra `<DataTable>` ou manter raw com classes DS |
| `clients/ClientsListClient.tsx` (linhas 114+)       | `<table>` raw desktop                  | Idem                                                  |
| `report/metrics/MetricZoneTable.tsx` (linhas 24-70) | `<table>` raw em relatório **público** | Migrar pra `<DataTable>` — superfície pública         |
| `admin/GenerationsTable.tsx` (linhas 54-80)         | `<table>` raw admin                    | Baixa prioridade (admin only)                         |
| `pricing/page.tsx`                                  | `<table>` raw comparação de planos     | Redesenhar como cards mobile + tabela desktop         |

**Nota:** as tabelas de leads e clients já têm card mobile alternativo. O `<table>` raw é só pro desktop. Podem manter raw com classes do DS (são tabelas simples, `<DataTable>` seria overkill), mas devem usar os tokens de border-radius e spacing do shape/density.

### 18.4 Hex inline (não-bloqueante)

| Item                                           | Estado    | Ação                                                       |
| ---------------------------------------------- | --------- | ---------------------------------------------------------- |
| Hex inline em creatives/carousel (~74)         | PRONTO    | Migrado pra --color-creative-\* tokens (Phase 7)           |
| Hex inline em diagnostic-activation (~5)       | PRONTO    | Migrado pra creative-coral + chrome-\* tokens (Phase 7)    |
| Hex em iPhone/macOS mockup (~14)               | ACEITAVEL | Exceção — cores de sistema                                 |
| Hex em WhatsApp green (~2)                     | ACEITAVEL | Exceção — brand externa                                    |
| Tipografia arbitrary em creatives (~100 vw)    | ACEITAVEL | Fluid typography intencional                               |
| Tipografia arbitrary fora de creatives (~5 px) | PRONTO    | Migrado pra text-micro-xs/body/body-large tokens (Phase 7) |
| Raw `<h1>`/`<button>`                          | PRONTO    | Zero violações                                             |
| Paleta de cores do PT                          | PRONTO    | 5 paletas + custom hex APCA + 6 estilos                    |

---

## 19. UX patterns — senior-level polish

### 19.1 Crítico (UX safety)

| Item                                                                             | Estado           | Ação                                                                                                         |
| -------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------ |
| Confirmação em ações destrutivas (deletar lead/cliente, cancelar assinatura)     | FEITO 2026-05-01 | Fase 8.1 — DeleteConfirmation em AssessmentList, PaymentLog, SessionLog, TransformationEditor, WorkoutEditor |
| Loading skeletons: `/site` (8 queries), `/subscription` (3 queries), `/template` | FEITO 2026-05-01 | Fase 8.2 — 3 loading.tsx criados com shapes corretos                                                         |
| Metadata dinâmica em `/leads/[id]` e `/clients/[id]`                             | FEITO 2026-05-01 | Fase 8.3 — generateMetadata com nome no título do tab                                                        |

### 19.2 Alto (polish profissional)

| Item                                                          | Estado           | Ação                                                                                           |
| ------------------------------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| Breadcrumbs em detail pages (Dashboard → Leads → Nome)        | FEITO 2026-05-01 | Fase 8.4 — Breadcrumb integrado em leads/[id] e clients/[id]                                   |
| Character counter em textareas (bio, descrições)              | FEITO 2026-05-01 | Fase 8.8 — showCount em bio (500), testimonial (500), pillar (300)                             |
| `next/image` com `priority` e `sizes` em fotos above-the-fold | FEITO 2026-05-01 | Fase 8.10 — next/image em SidebarNav/DrawerNav/DashboardLayout avatars                         |
| Scroll-to-section smooth na landing e relatório               | FEITO 2026-05-01 | Fase 8.9 — scrollIntoView em PremiumNav. FloatingNav já implementado                           |
| Consolidar EmptyState duplicado                               | FEITO 2026-04-30 | Remover `funnel/shared/EmptyState.tsx` e `shared/EmptyState.tsx`, usar só `ui/empty-state.tsx` |

### 19.3 Médio (detalhes que importam)

| Item                                                         | Estado           | Ação                                                                    |
| ------------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------- |
| Active/press state em botões (`active:scale-[0.98]`)         | FEITO 2026-04-30 | Adicionar em `button.tsx` base                                          |
| `beforeunload` warning em forms sujos (settings, onboarding) | FEITO 2026-05-01 | Fase 8.5 — useUnsavedChanges em ProfileForm, DesignForm, ContactForm    |
| Feedback em todas as ações (lead note save, follow-up date)  | FEITO 2026-05-01 | Fase 8.7 — LeadNoteEditor já tinha toast; LeadFollowUpEditor adicionado |
| `useOptimistic` pra lead status change                       | FEITO 2026-05-01 | Fase 8.6 — LeadStatusChanger refatorado com useOptimistic               |

### 19.4 Já implementado (não precisa mexer)

- ✅ Focus management: autoFocus, focus-visible ring, dialog focus trap (Radix)
- ✅ Command palette (Cmd+K) com grupos e shortcuts
- ✅ Keyboard shortcuts: `/` busca, `n` novo
- ✅ Toast feedback: 40+ arquivos, success/error consistentes
- ✅ Copy button: acessível, aria-live, "Copiado!"
- ✅ Truncation: `truncate` e `line-clamp`
- ✅ Error boundaries: global + shell + public + section-level
- ✅ 404 handling: global + diagnostic
- ✅ Dirty check em drawers: `DrawerWithDirtyCheck`
- ✅ 31 pages com metadata estática definida

---

## 20. Smoke test E2E

### Fluxo prospect (captura dos 30)

- [ ] `/em-breve` renderiza, CTA vai pra `/diagnostico`
- [ ] Formulário prospect completa e gera token
- [ ] Relatório prospect renderiza corretamente
- [ ] Tab "Análise" gera insights IA
- [ ] Tab "Começar" (ActivationPage) mostra pricing R$27 e features corretas
- [ ] Sticky WhatsApp CTA funciona

### Fluxo PT (uso diário)

- [ ] Signup (email/senha + Google OAuth)
- [ ] Onboarding completo (23 steps) com pricing R$27
- [ ] Escolher modalidade (todas as 6)
- [ ] Configurar brand (cor, tipografia)
- [ ] Checkout EFI (PIX + cartão)
- [ ] SiteHub acessível (sem gate proOnly)
- [ ] Adicionar serviços e planos
- [ ] Adicionar depoimentos
- [ ] Adicionar transformação (antes/depois)
- [ ] Landing premium renderiza com brand do PT
- [ ] Formulário público funciona (submit com cada modalidade)
- [ ] Relatório IA gera corretamente
- [ ] Lead aparece no dashboard
- [ ] Notificação WA/email chega ao PT
- [ ] Status do lead muda (new → contacted)
- [ ] Follow-up funciona
- [ ] Settings salvam corretamente
- [ ] CustomizationEditor NÃO acessível (D110)
- [ ] `/clients` mostra locked
- [ ] RLS: criar 2 PTs, verificar que A não vê leads de B
- [ ] Mobile 375px: tudo acima funciona
- [ ] Mobile: bottom nav não cobre conteúdo

---

## Resumo: 47 itens obrigatórios antes do MVP

> **Regra: corrigir na raiz primeiro.** Itens globais cascateiam pra todas as páginas automaticamente.
> Depois, itens por página/feature. Ordem de execução: Wave A → B → C → D → E.

---

### Wave A — Raiz: `globals.css` + constants (arquivos globais)

| #   | Item                                                                                                                                                    | Esforço |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | `overscroll-behavior: none` no body                                                                                                                     | 2min    |
| 2   | `-webkit-tap-highlight-color: transparent` no body                                                                                                      | 2min    |
| 3   | `scroll-behavior: smooth` no html                                                                                                                       | 2min    |
| 4   | ~~Remover `MODALITY_LABELS` duplicado de `CoverSection.tsx`~~ FEITO 2026-04-30 — consolidado em `MODALITY_PROFESSIONAL_TITLES` em `modalities.ts`       | 10min   |
| 5   | ~~Centralizar magic numbers de timeout~~ FEITO 2026-04-30 — `lib/constants/timing.ts` (COPY_TIMEOUT, DELETE_CONFIRM_TIMEOUT), 6 componentes atualizados | 30min   |

---

### Wave B — Raiz: `components/ui/` (corrigir componente base → cascateia pra todas as páginas)

| #   | Item                                                                                                                   | Onde corrigir                                                                      | Esforço |
| --- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------- |
| 4   | Shape cascade: `rounded-md` → `rounded-[var(--shape-button)]`                                                          | `button.tsx`, `input.tsx`, `select.tsx`, `dialog.tsx`, `sheet.tsx`, `textarea.tsx` | 2-3h    |
| 5   | Density cascade: `px-4 py-2` → `var(--density-pad-*)`                                                                  | `button.tsx`, `input.tsx`, `select.tsx`, `dialog.tsx`, `sheet.tsx`, `textarea.tsx` | 6-8h    |
| 6   | Active/press state: `active:scale-[0.98]` ou similar                                                                   | `button.tsx`                                                                       | 15min   |
| 7   | Character counter como prop `showCount` + `maxLength`                                                                  | `textarea.tsx`                                                                     | 1h      |
| 8   | Tabelas raw → aplicar tokens DS (shape, spacing)                                                                       | `table.tsx` base                                                                   | 1h      |
| 9   | Consolidar EmptyState: deletar `funnel/shared/EmptyState.tsx` e `shared/EmptyState.tsx`, tudo usa `ui/empty-state.tsx` | 3 arquivos                                                                         | 30min   |

---

### Wave C — Raiz: hooks, componentes novos, i18n de erros (criar 1x, reutilizar)

| #   | Item                                                                                                                                                                            | Onde criar                                                     | Esforço |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------- |
| 12  | `useUnsavedChanges` hook — `beforeunload` + dirty state                                                                                                                         | `lib/hooks/useUnsavedChanges.ts`                               | 2h      |
| 13  | `<Breadcrumb>` component                                                                                                                                                        | `components/ui/breadcrumb.tsx` (ou instalar shadcn breadcrumb) | 1h      |
| 14  | `<OptimizedImage>` wrapper de `next/image` com defaults (`priority`, `sizes`, lazy)                                                                                             | `components/ui/optimized-image.tsx`                            | 1h      |
| 15  | `inputMode="numeric"` como default em inputs type="number"                                                                                                                      | `input.tsx` ou `NumInput` wrapper                              | 15min   |
| 16  | ~~i18n: migrar strings PT hardcoded em server actions~~ FEITO 2026-04-30 — ~130 strings em 21 action files → `getTranslations('actions')` + namespace `actions` em `pt-BR.json` | 4-6h                                                           |
| 17  | ~~Pricing: mover preços hardcoded~~ FEITO 2026-04-30 — `prices.ts` core=2700/pro=6700, removidos setup/custom, PromoCodeField+edge fns atualizados                              | 1h                                                             |
| 18  | ~~Modality labels: source of truth~~ FEITO 2026-04-30 — `MODALITY_PROFESSIONAL_TITLES` em `modalities.ts`, CoverSection importa de lá                                           | 30min                                                          |

---

### Wave D — Raiz: infra e config global

| #   | Item                                                            | Onde                                           | Esforço |
| --- | --------------------------------------------------------------- | ---------------------------------------------- | ------- |
| 19  | PWA manifest.json (display standalone, icons, start_url)        | `public/manifest.json` + `app/layout.tsx` link | 20min   |
| 20  | Vercel Analytics ativar                                         | Dashboard Vercel                               | 10min   |
| 21  | Sentry source maps verificar                                    | Deploy config                                  | 30min   |
| 22  | Alertas Sentry calibrados (5xx, Edge Function failure, timeout) | Sentry dashboard                               | 1h      |
| 23  | Rate limit em login/signup/form-submit                          | Middleware ou Edge Function                    | 4-6h    |
| 24  | RLS isolation test (2 PTs reais)                                | SQL + teste manual                             | 1-2h    |
| 25  | ToS + Privacy Policy (mínimo legal)                             | Externo (jurídico)                             | Externo |
| 26  | DSR process documentado                                         | `docs/operacional/dsr-process.md`              | 1h      |

---

### Wave E — Por página/feature (com as waves A-D feitas, muitas coisas já cascatearam)

#### Features core

| #   | Item                                                                               | Esforço |
| --- | ---------------------------------------------------------------------------------- | ------- |
| 27  | Ativar 5 modalidades em `ACTIVE_MODALITIES` + QA por modalidade                    | 4-6h    |
| 28  | Notificação WA/email on new lead (submit-form → send-whatsapp + send-email)        | 6-8h    |
| 29  | SEO dinâmico: `generateMetadata` + OG image em `/[slug]` e `/[slug]/site`          | 4h      |
| 30  | Configurar EFI Plan IDs reais em env vars produção                                 | 1h      |
| 31  | Smoke test EFI (pagamento real sandbox + prod)                                     | 2-3h    |
| 32  | Revisar pricing na ActivationPage (`/comecar`) pra R$27                            | 2-3h    |
| 33  | Verificar pricing no onboarding step (R$27)                                        | 30min   |
| 34  | Remover `proOnly` de `/landing` (SiteHub) em `SidebarNav.tsx`, `DrawerNav.tsx`     | 30min   |
| 35  | Bloquear CustomizationEditor (remover/esconder botão "Configurar" no TemplateGrid) | 1-2h    |
| 36  | Trocar email in-app (settings, sem workaround forgot-password)                     | 3h      |
| 37  | Trocar senha in-app (settings)                                                     | 2h      |

#### DS cascade em páginas públicas

| #   | Item                                                                                                    | Esforço |
| --- | ------------------------------------------------------------------------------------------------------- | ------- |
| 38  | `data-shape` + `data-density` + `data-surface="public"` em `/[slug]`, `/[slug]/site`, `/[slug]/analise` | 30min   |

#### DS compliance — hex e tipografia

| #   | Item                                                                                        | Esforço |
| --- | ------------------------------------------------------------------------------------------- | ------- |
| 39  | ~~Hex inline em creatives/carousel (~74) → migrar pra tokens CSS~~ ✅ Phase 7               | —       |
| 40  | ~~Hex inline em diagnostic-activation (~5) → migrar pra tokens~~ ✅ Phase 7                 | —       |
| 41  | ~~Tipografia arbitrary `text-[Xpx]` fora de creatives (~5) → migrar pra tokens~~ ✅ Phase 7 | —       |

#### DS compliance — tabelas

| #   | Item                                                                            | Esforço |
| --- | ------------------------------------------------------------------------------- | ------- |
| 42  | `MetricZoneTable.tsx` (público) → migrar pra `<DataTable>` ou aplicar tokens DS | 1h      |
| 43  | Tabelas raw leads/clients → aplicar tokens DS do `table.tsx` corrigido          | 1h      |
| 44  | `GenerationsTable.tsx` (admin) → migrar pra `<DataTable>`                       | 1h      |
| 45  | Pricing page → card fallback mobile                                             | 30min   |

#### UX patterns por página

| #   | Item                                                                                   | Esforço          |
| --- | -------------------------------------------------------------------------------------- | ---------------- |
| 46  | `DeleteConfirmation` em flows de delete (lead, client, subscription cancel)            | FEITO 2026-05-01 |
| 47  | Loading skeletons: `loading.tsx` em `/site`, `/subscription`, `/template`              | FEITO 2026-05-01 |
| 48  | Metadata dinâmica em `/leads/[id]` e `/clients/[id]` (título do tab)                   | FEITO 2026-05-01 |
| 49  | Breadcrumbs em detail pages (usando componente da Wave C)                              | FEITO 2026-05-01 |
| 50  | `next/image` com `priority`/`sizes` em fotos above-the-fold (usando wrapper da Wave C) | FEITO 2026-05-01 |
| 51  | Scroll-to-section smooth na landing premium e relatório                                | FEITO 2026-05-01 |
| 52  | `useUnsavedChanges` em forms de settings e onboarding (usando hook da Wave C)          | FEITO 2026-05-01 |
| 53  | `useOptimistic` pra lead status change                                                 | FEITO 2026-05-01 |
| 54  | Feedback (toast) em todas as ações: LeadNoteEditor, LeadFollowUpEditor                 | FEITO 2026-05-01 |
| 55  | `showCount` em textareas de bio, descrição, notas (usando prop da Wave B)              | FEITO 2026-05-01 |
| 56  | Dashboard: `pb-[var(--bottom-nav-height)] md:pb-0`                                     | FEITO 2026-05-01 |
| 57  | Verificar UX form prospect `/diagnostico`                                              | FEITO 2026-05-01 |

#### Hardcoded data → centralizar

| #   | Item                                                                                                                                 | Esforço          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| 58  | Checkpoint messages hardcoded em `AuditForm.tsx` (9 checkpoints) → `messages/pt-BR.json`                                             | FEITO 2026-05-01 |
| 59  | Plan features hardcoded em `lib/constants/plan-features.ts` e `lib/content/plans.ts` → mover pra `system_plan_features` (DB) ou i18n | FEITO 2026-05-01 |
| 60  | Template data hardcoded em `TemplateSection.tsx` (MODALITY_TEMPLATES) → ler do banco                                                 | FEITO 2026-05-01 |
| 61  | Status/option labels hardcoded em `ClientStatusSection.tsx` → i18n                                                                   | FEITO 2026-05-01 |

#### Mobile app-like redesign

| #   | Item                                                                                               | Esforço          |
| --- | -------------------------------------------------------------------------------------------------- | ---------------- |
| 62  | **SiteHub mobile redesign:** lista de seções tocáveis + ResponsiveDrawer pra editor e catálogos    | FEITO 2026-05-01 |
| 63  | Dashboard mobile: stats → cards tocáveis com chevron; chart → overflow-x-auto; funnel → ↓ vertical | FEITO 2026-05-01 |
| 64  | Client detail tabs: touch targets 44px, exercise grid responsivo (cols-2 sm:cols-4)                | FEITO 2026-05-01 |
| 65  | Settings design mobile: floating preview button → ResponsiveDrawer                                 | FEITO 2026-05-01 |
| 66  | Subscription checkout mobile: OrderSummary first, PaymentMethodCard extraído                       | FEITO 2026-05-01 |
| 67  | Settings profile: MobileCollapsible sections (pessoal + links)                                     | FEITO 2026-05-01 |

#### Rewrite de copy completo

| #   | Item                                                                                                                                                                                                                                                                                                                                                              | Esforço |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| 68  | **ActivationPage (`/comecar`):** reescrever pricing R$27/30 vagas, remover 7 etapas, remover features inexistentes (bot WA, treino IA, gateway, agenda, despesas, Garmin, editar formulário), remover add-ons (site R$197, tráfego R$847). Copy só do que existe no MVP                                                                                           | 4-6h    |
| 69  | **ActivationPage seções:** remover `TrafficSection` inteira. Reescrever `DashboardSection` (só gestão de leads, stats, serviços/planos/depoimentos — sem bot, sem gateway, sem agenda, sem despesas). Reescrever `SiteSection` (site incluído no plano, não add-on). Reescrever `FoundersBetaSection` (30 vagas, R$27, sem lista de features futuras específicas) | 3-4h    |
| 70  | **ActivationPage pricing:** `PricingSection` → R$27/mês, 30 vagas, sem add-ons. `StickyActivation` → "R$27/mês". Follow-ups → "24h e 48h" (não "1h · 24h · 7d · 30d")                                                                                                                                                                                             | 1h      |
| 71  | **Coming soon (`/em-breve`):** footer 5 stages → remover ou simplificar pra "Captação" apenas. Subtitle → remover menção a "retenção e gestão" como promessa                                                                                                                                                                                                      | 30min   |
| 72  | **Launch page (`/lancamento`):** reescrever pricing R$27/30 vagas, remover roadmap items 6-10 (treino IA, painel aluno, Garmin, financeiro), remover setup add-on, ProductDetails → só etapas 1-4 (captação, conteúdo, autoridade, conversão)                                                                                                                     | 3-4h    |
| 73  | **`lib/constants/prices.ts`:** atualizar core→R$27 (beta), pro→R$67 (pós-beta), remover setup/custom. Atualizar centavos em `PromoCodeField.tsx`                                                                                                                                                                                                                  | 30min   |
| 74  | ~~**`lib/brand/index.ts`:** revisar tagline~~ FEITO 2026-04-30 — atualizado pra "Sua infraestrutura digital. Sua marca." (alinhado com positioning.md)                                                                                                                                                                                                            | 15min   |
| 75  | **Modality audiences:** verificar que termos "aluno/atleta/membro/nadador/triatleta" estão em i18n, não hardcoded em `TemplateSection.tsx`                                                                                                                                                                                                                        | 1h      |

#### Craft pass visual

| #   | Item                                                                                                                                                                                                                                                                   | Esforço   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 76  | Craft pass visual: abrir todas as 42 rotas no browser, desktop (1280px) + mobile (375px), com dados reais. Verificar: renderiza sem erro, layout não quebra, interações funcionam, brand reflete, empty states fazem sentido, nada placeholder esquecido, copy correta | 8-12h     |
| 77  | Ajustes de onboarding (a definir pelo fundador)                                                                                                                                                                                                                        | A definir |

---

### Resumo por wave

| Wave      | Escopo                                                                            | Itens  | Esforço       |
| --------- | --------------------------------------------------------------------------------- | ------ | ------------- |
| A         | `globals.css` + constants globais                                                 | 5      | ~45min        |
| B         | `components/ui/` base (corrigir na raiz)                                          | 6      | ~11-13h       |
| C         | Hooks + componentes novos + i18n erros + pricing                                  | 7      | ~10-12h       |
| D         | Infra e config global                                                             | 8      | ~8-11h        |
| E         | Por página/feature + hardcoded data + mobile redesign + copy rewrite + craft pass | 51     | ~110-145h     |
| **Total** |                                                                                   | **77** | **~140-175h** |

### Nenhum item é opcional. Tudo 100% antes de abrir os 30 betas.

### Ordem: A → B → C → D → E. Waves A-D primeiro porque cascateiam pra E.
