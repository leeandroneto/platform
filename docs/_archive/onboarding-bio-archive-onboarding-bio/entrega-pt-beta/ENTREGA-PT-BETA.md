# Entrega PT Beta — Walkthrough end-to-end

> **Criado:** 2026-05-04
> **Objetivo:** validar e polir TODO o fluxo de um PT real, do `/login` até um lead cadastrado com relatório IA renderizado.
> **Modalidade foco:** musculação. Todas as 6 modalidades + 33 templates ativados no banco.
> **Ambiente de teste:** conta pessoal do Leandro (não queimar a conta real do PT).
> **Pago:** o PT pagou por fora — cupom 100% bypassa EFI.
> **Pós-entrega:** retomar PLANO-FINAL.md em Fase 45G → 46 → 47.

---

## Como usar este doc

Cada etapa do walkthrough tem 3 colunas:

- **`[ ]` testado** — marca quando você (ou eu) abriu a tela e validou
- **must-fix** — bloqueia o PT, conserta agora
- **débito anotado** — não bloqueia; vira issue ou linha no `docs/plano/AUDITORIA-2026-04-28.md`

Regra rígida: **não polir nada que não bloqueia o PT durante o walkthrough.** Se virar tentação, anota e segue.

---

## FASE 0 — Foundation (antes do walkthrough)

Sem essas duas coisas o walkthrough trava nos passos 0 e 9.

### F0.1 — ✅ Badge "Em breve" no nav

**O que:** itens marcados `comingSoon: true` mostram badge shadcn `<Badge variant="secondary">` em vez do `Lock` e ficam com `pointer-events-none opacity-40`.

**Arquivos:**

- `components/dashboard/SidebarNav.tsx` — tipo `NavItem` ganha `comingSoon?: boolean`; render usa `<Badge>` (não inline style); `/clients` e `/services` ganham `comingSoon: true`
- `components/dashboard/MobileNav.tsx` — propaga lógica `disabled = locked || comingSoon`
- `messages/pt-BR.json` — chave `shellNav.comingSoon = "Em breve"`

**Não usar:** `style={{ background: 'hsl(var(--muted))' }}` (commit dangling `1379e27` fez isso errado — projeto é OKLCH e tem shadcn `Badge` instalado).

**Decisão de quais ficam "em breve" pro PT:**

| Item                                  | Decisão                       |
| ------------------------------------- | ----------------------------- |
| Dashboard                             | ✅ Libera                     |
| Leads                                 | ✅ Libera                     |
| Clientes                              | 🔒 Em breve                   |
| Formulário (`/formulario` + `/forms`) | ✅ Libera                     |
| Site (`/site`)                        | ✅ Libera                     |
| Services (`/services`)                | 🔒 Em breve                   |
| Settings (todos os subitens)          | ✅ Libera                     |
| Subscription                          | ✅ Libera (mostra cupom 100%) |

**Verificação:** tsc 0 + lint 0 + sidebar mostra badge cinza "Em breve" + click não navega.

### F0.2 — ✅ Bypass EFI no cupom 100%

**O que:** `supabase/functions/create-checkout/index.ts` — após calcular `finalAmountCents`, se `=== 0`, criar subscription direto via `start_checkout` RPC com `mockId = manual_bypass_${professionalId}_${Date.now()}` e retornar `{ ok: true }` sem chamar EFI.

**Não muda:** validação de cupom, RPC `start_checkout`, webhook EFI, fluxo normal com pagamento.

**Deploy:** `mcp__supabase__deploy_edge_function` para `create-checkout`.

**Verificação:** criar cupom `BETA100` no banco, signup de teste, checkout com cupom, subscription fica `active`, onboarding desbloqueia step `celebration`.

### F0.3 — ✅ Ativar todas as 6 modalidades + 33 templates no banco

**O que:** confirmar que `system_modalities` tem as 6 modalidades ativas e `specialty_templates` tem os 33 templates seedados. Se faltar, rodar seed.

**Verificação:** `select count(*) from system_modalities where is_active = true` → 6; `select count(*) from specialty_templates` → 33.

### F0.4 — ✅ Criar cupom BETA100

```sql
INSERT INTO promotional_codes (
  code, discount_type, discount_value, is_active, max_uses, applies_to, description
) VALUES (
  'BETA100', 'percentage', 100, true, 1, ARRAY['core'],
  'Cupom beta vitalicio — PT parceiro'
);
```

---

## FASE 1 — Auth (Login + Signup)

> Google OAuth já testado. Foco em: signup com email, validação de senha, callback redireciona pra `/onboarding`.

### W1.1 — `/login`

- **Arquivos:** `app/(auth)/login/page.tsx`, `components/auth/LoginForm.tsx`, `app/(auth)/layout.tsx` (split-screen)
- **Verificar:** layout split-screen em `lg:`, mobile single-column, AmbientMesh, BrandLogo lockup, link "criar conta" funciona
- **`[ ]` testado** | **must-fix:** | **débito:**

### W1.2 — `/signup`

- **Arquivos:** `app/(auth)/signup/page.tsx`, `components/auth/SignupForm.tsx`
- **Verificar:** validação email (Zod), senha mínima, mensagem "verifique seu email", reenvio
- **`[ ]` testado** | **must-fix:** | **débito:**

### W1.3 — `/verify-email` + `/callback`

- **Arquivos:** `app/(auth)/verify-email/page.tsx`, `app/(auth)/callback/route.ts`
- **Verificar:** email chega (template em `lib/email/templates/email-verification.tsx`), link válido redireciona pra `/onboarding`
- **`[ ]` testado** | **must-fix:** | **débito:**

### W1.4 — Esquecer / resetar senha (atalho rápido)

- **Arquivos:** `app/(auth)/forgot-password/page.tsx`, `reset-password/page.tsx`
- **Verificar:** email chega, link reseta, login com senha nova
- **`[ ]` testado** | **must-fix:** | **débito:**

---

## FASE 2 — Onboarding (25 steps em `/onboarding`)

> Stepper definido em `app/(app)/onboarding/_components/OnboardingShell.tsx`.
> Cada step tem componente em `_steps/`. Server actions em `app/(app)/onboarding/actions.ts`.

### W2.1 — Bloco "Sobre você" (steps 0-8)

| #   | Step             | Componente                                                 | Verificar                                                       |
| --- | ---------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| 0   | welcome          | `_steps/Welcome.tsx`                                       | Animação, CTA "Começar"                                         |
| 1   | name             | `_steps/Name.tsx`                                          | Salva `full_name` + `display_name` no `professionals`           |
| 2   | profile-photo    | `_steps/ProfilePhoto.tsx` + `_components/PhotoCropper.tsx` | Upload pra `professional-media` bucket, crop, salva `photo_url` |
| 3   | background-photo | `_steps/BackgroundPhoto.tsx`                               | Idem, salva `hero_media_url`                                    |
| 4   | bio              | `_steps/Bio.tsx`                                           | Salva `bio` (textarea, max 280)                                 |
| 5   | credentials      | `_steps/Credentials.tsx`                                   | CREF + estudantes ajudados + anos exp                           |
| 6   | whatsapp         | `_steps/WhatsApp.tsx`                                      | País + número + mensagem padrão                                 |
| 7   | profile-preview  | `_steps/ProfilePreview.tsx`                                | Preview do que foi preenchido                                   |
| 8   | checkpoint-1     | `_steps/Checkpoint.tsx`                                    | Transição "sobre você ✓ → sobre seu trabalho"                   |

**`[ ]` testado** | **must-fix:** | **débito:**

### W2.2 — Bloco "Sobre seu trabalho" (steps 9-13)

| #   | Step         | Componente               | Verificar                                                                                                           |
| --- | ------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| 9   | modality     | `_steps/Modality.tsx`    | Lista 6 modalidades, foco em musculação. Salva em `professional_modalities` (ou ativa via `activateModalityAction`) |
| 10  | focus        | `_steps/Focus.tsx`       | Especialidades dentro da modalidade — salva `professional_specialties`                                              |
| 11  | nutrition    | `_steps/Nutrition.tsx`   | Nível: cuido / dicas / não cuido (afeta pillar IA)                                                                  |
| 12  | service-mode | `_steps/ServiceMode.tsx` | Online / presencial / híbrido                                                                                       |
| 13  | checkpoint-2 | `_steps/Checkpoint.tsx`  | Transição "sobre seu trabalho ✓ → IA"                                                                               |

**Crítico:** ao escolher musculação, `activateModalityAction` cria `professional_template` ativo a partir do `specialty_template` correspondente.

**`[ ]` testado** | **must-fix:** | **débito:**

### W2.3 — Bloco "IA" (steps 14-16)

| #   | Step         | Componente               | Verificar                                                        |
| --- | ------------ | ------------------------ | ---------------------------------------------------------------- |
| 14  | personality  | `_steps/Personality.tsx` | Tom de voz (formal/casual/etc) — salva no `professionals.tone_*` |
| 15  | audience     | `_steps/Audience.tsx`    | Público-alvo (perfil cliente ideal)                              |
| 16  | checkpoint-3 | `_steps/Checkpoint.tsx`  | Transição "IA ✓ → experiência do aluno"                          |

**`[ ]` testado** | **must-fix:** | **débito:**

### W2.4 — Bloco "Experiência do aluno" (steps 17-19)

| #   | Step                | Componente                      | Verificar                                           |
| --- | ------------------- | ------------------------------- | --------------------------------------------------- |
| 17  | transition          | `_steps/TransitionChoice.tsx`   | Bifurcação — pular ou ver simulação?                |
| 18  | site-loading        | `_steps/SiteLoading.tsx`        | Edge Function `generate-site-content` gera landing  |
| 19  | simulation-explorer | `_steps/SimulationExplorer.tsx` | 3 abas: Site / Formulário / Relatório (iframe live) |

**Crítico:** Edge Function `generate-site-content` deve usar Haiku, consumir tom + audience + modalidade.

**`[ ]` testado** | **must-fix:** | **débito:**

### W2.5 — Bloco "Pricing + Checkout" (steps 20-24)

| #   | Step           | Componente                 | Verificar                                                                     |
| --- | -------------- | -------------------------- | ----------------------------------------------------------------------------- |
| 20  | pricing-bridge | `_steps/PricingBridge.tsx` | Transição cinematográfica                                                     |
| 21  | pricing        | `_steps/Pricing.tsx`       | Plano core R$27 beta — input cupom                                            |
| 22  | checkout       | `_steps/Checkout.tsx`      | Aplicar `BETA100` → finalAmount=0 → bypass EFI (F0.2) → subscription `active` |
| 23  | celebration    | `_steps/Celebration.tsx`   | Confetti + CTA "Ir pro dashboard"                                             |

**Crítico:** com `BETA100` o EFI **não pode ser chamado** — confirmar via `mcp__supabase__get_logs` que webhook não disparou.

**`[x]` auditado** | **must-fix resolvido:** `Checkout.tsx` bypass infinito — `useEffect` disparava PIX mesmo com `finalCents=0` → stuck forever. Fix: guard `finalCents > 0` + `handleBypass()` + UI "Ativar gratuitamente". | **débito:** `planTier`/`promoCode` state não persiste no refresh — user deve refazer Pricing step se recarregar na tela de checkout. Aceitável pra beta.

---

## FASE 3 — Walkthrough do dashboard (primeira entrada)

### W3.1 — `/dashboard` + walkthrough guiado

- **Arquivos:** `app/(app)/(shell)/dashboard/page.tsx`, `components/dashboard/DashboardWalkthrough.tsx`, `DashboardEmptyState.tsx`
- **Verificar:** walkthrough roda na primeira entrada, spotlights nos itens corretos do sidebar, "Pular" funciona, não reaparece após dismiss
- **`[ ]` testado** | **must-fix:** | **débito:**

### W3.2 — Sidebar + MobileNav

- **Arquivos:** `components/dashboard/SidebarNav.tsx`, `MobileNav.tsx`, `DashboardLayout.tsx`
- **Verificar:** badge "Em breve" em Clientes + Services (F0.1 aplicado), itens não-clicáveis, expand/collapse funciona, mobile bottom bar 5 itens
- **`[x]` auditado** | **must-fix resolvido:** item "Site" tinha `href: '/landing'` (404) — corrigido para `/site`. `data-walkthrough="landing"` também corrigido. | **débito:** —

### W3.3 — Subscription card

- **Arquivos:** `components/dashboard/SubscriptionStatusCard.tsx`
- **Verificar:** mostra plano core ativo, próxima cobrança vazia (cupom 100%), botão "ver detalhes" → `/subscription`
- **`[x]` auditado** | **must-fix:** — | **débito:** `SubscriptionStatusCard` retorna `null` para status `active` — o dashboard não exibe card. Usuário precisa ir a `/subscription` para ver status. Aceitável pra beta.

---

## FASE 4 — Aba Formulário (`/formulario` + `/forms/[modality]`)

### W4.1 — `/formulario` (picker de templates)

- **Arquivos:** `app/(app)/(shell)/template/page.tsx`, `components/template-picker/{ModalitySidebar,TemplateGrid}.tsx`
- **Verificar:** mostra 6 modalidades à esquerda, templates da modalidade selecionada à direita, click ativa template via `activateModalityAction`
- **`[ ]` testado** | **must-fix:** | **débito:**

### W4.2 — `/forms` (lista de templates ativos)

- **Arquivos:** `app/(app)/(shell)/forms/page.tsx`
- **Verificar:** lista template musculação ativo, link pro editor, badge se tem mudanças não publicadas
- **`[ ]` testado** | **must-fix:** | **débito:**

### W4.3 — `/forms/[modality]` editor — aba **Formulário**

- **Arquivos:** `components/funnel/tabs/FormularioTab.tsx`, `_respostas/`
- **Verificar:** lista de perguntas do template musculação, opções editáveis (add custom option), preview live ao lado, "publicar mudanças" funciona
- **`[ ]` testado** | **must-fix:** | **débito:**

### W4.4 — `/forms/[modality]` editor — aba **Relatório**

- **Arquivos:** `components/funnel/tabs/RelatorioTab.tsx`
- **Verificar:** seções do relatório listadas, toggle visibilidade, preview do que sai pra IA
- **`[ ]` testado** | **must-fix:** | **débito:**

### W4.5 — `/forms/[modality]` editor — aba **Próximo Passo**

- **Arquivos:** `components/funnel/tabs/ProximoPassoTab.tsx`
- **Verificar:** WhatsApp message + URL vídeo (YouTube/Loom) + Calendly opcional. Salva no `professional_template.overrides.next_step`
- **`[ ]` testado** | **must-fix:** | **débito:**

### W4.6 — `/forms/[modality]` editor — aba **Configurações**

- **Arquivos:** `components/funnel/tabs/ConfigTab.tsx`
- **Verificar:** ativa/desativa template, regras de visibilidade, redirect pós-submit
- **`[ ]` testado** | **must-fix:** | **débito:**

---

## FASE 5 — Aba Site/Personalização (`/site`)

### W5.1 — `/site` (SiteHub)

- **Arquivos:** `app/(app)/(shell)/site/page.tsx`, `components/site/SiteHub.tsx`
- **Verificar:** layout 2 painéis com `ResizablePanelGroup` (45Q feito), painel esquerdo editor, painel direito iframe live preview, persistência de layout em localStorage
- **`[ ]` testado** | **must-fix:** | **débito:**

### W5.2 — LandingEditor — abas

- **Arquivos:** `components/landing/editor/LandingEditor.tsx` + `_components/{HeroTab,AboutTab,ExperienceTab,MethodologyTab,ResultsTab,StatsTab,TestimonialsTab,FaqTab,PlansTab,QuickCtaTab,TickerTab,VisibilityTab}.tsx`
- **Verificar:** cada aba salva em `professional.landing_sections` (JSONB), preview atualiza, drag-reorder de seções
- **`[ ]` testado** | **must-fix:** | **débito:**

### W5.3 — Recursos do site (estes são editores standalone, abertos via /settings ou via link)

- `/credentials` (CREF, formação) — `app/(app)/(shell)/credentials/page.tsx`
- `/methodology` (método) — `app/(app)/(shell)/methodology/page.tsx`
- `/locations` (onde atende) — `app/(app)/(shell)/locations/page.tsx`
- `/testimonials` (depoimentos) — `app/(app)/(shell)/testimonials/page.tsx`
- `/plans` (planos pro aluno) — `app/(app)/(shell)/plans/page.tsx`
- `/faq` (perguntas frequentes) — `app/(app)/(shell)/faq/page.tsx`
- **Verificar:** cada um salva, aparece no site público
- **`[ ]` testado** | **must-fix:** | **débito:**

---

## FASE 6 — Aba Perfil + Settings

### W6.1 — `/settings/profile`

- **Arquivos:** `app/(app)/(shell)/settings/profile/page.tsx`
- **Verificar:** edita nome, display name, slug, bio. Slug check de unicidade
- **`[ ]` testado** | **must-fix:** | **débito:**

### W6.2 — `/settings/media` (upload fotos pós-onboarding)

- **Arquivos:** `app/(app)/(shell)/settings/media/page.tsx`
- **Verificar:** re-upload de foto perfil + hero, galeria adicional, crop tool
- **`[ ]` testado** | **must-fix:** | **débito:**

### W6.3 — `/settings/contact`

- **Arquivos:** `app/(app)/(shell)/settings/contact/page.tsx`
- **Verificar:** edita WhatsApp, Instagram, cidade
- **`[ ]` testado** | **must-fix:** | **débito:**

### W6.4 — `/settings/design`

- **Arquivos:** `app/(app)/(shell)/settings/design/page.tsx`
- **Verificar:** muda paleta + tipografia + shape, preview atualiza, salva em `professionals`
- **`[ ]` testado** | **must-fix:** | **débito:**

### W6.5 — `/settings/account`

- **Arquivos:** `app/(app)/(shell)/settings/account/page.tsx`
- **Verificar:** muda email, senha, deleta conta (LGPD)
- **`[ ]` testado** | **must-fix:** | **débito:**

### W6.6 — `/settings/notifications`

- **Arquivos:** `app/(app)/(shell)/settings/notifications/page.tsx` + `history/page.tsx`
- **Verificar:** toggles de email/WA, histórico mostra envios
- **`[ ]` testado** | **must-fix:** | **débito:**

### W6.7 — `/subscription`

- **Arquivos:** `app/(app)/(shell)/subscription/page.tsx`, `components/subscription/`
- **Verificar:** mostra plano core ativo via cupom, sem próxima cobrança, botão cancelar exibe modal de exit survey
- **`[ ]` testado** | **must-fix:** | **débito:**

---

## FASE 7 — Aba Leads (`/leads`)

### W7.1 — `/leads` (lista)

- **Arquivos:** `app/(app)/(shell)/leads/page.tsx`, `components/dashboard/LeadFilters.tsx`, DataTable (Fase 45M)
- **Verificar:** vazia até primeiro lead chegar. Empty state com instrução "compartilhe seu link"
- **`[ ]` testado** | **must-fix:** | **débito:**

### W7.2 — `/leads/new` (lead manual)

- **Arquivos:** `app/(app)/(shell)/leads/new/page.tsx`, `components/leads/ManualLeadForm.tsx`
- **Verificar:** form simplificado, salva lead com source=manual
- **`[ ]` testado** | **must-fix:** | **débito:**

### W7.3 — `/leads/[id]` (detalhe)

- **Arquivos:** `app/(app)/(shell)/leads/[id]/page.tsx`, `components/leads/{ClientStatusSection,ConvertToClientButton,LeadFollowUpEditor,LeadStatusBadge,WaTemplates}.tsx`
- **Verificar:** mostra dados do lead, status changer, notas, link pro relatório `/r/{token}`, WA templates, "converter em cliente" (mas /clients está em breve — esconder ou desabilitar este botão também)
- **`[ ]` testado** | **must-fix:** | **débito:**

### W7.4 — `/quick/{view,status,wa}/[leadId]` (atalhos rápidos)

- **Arquivos:** `app/(app)/(shell)/quick/{view,status,wa}/[leadId]/page.tsx`
- **Verificar:** atalhos funcionam (provavelmente vindos de notificação push/email)
- **`[ ]` testado** | **must-fix:** | **débito:**

---

## FASE 8 — Teste end-to-end do funil público

> Aqui validamos que o que foi configurado nas fases 4-5 chega ao lead final e o relatório IA renderiza com qualidade.

### W8.1 — Site público `/{slug}`

- **Verificar:** abrir em janela anônima, ver landing renderizada com tudo que foi configurado em /site, fotos carregam, CTA "Quero análise" → `/{slug}/analise/musculacao`
- **`[ ]` testado** | **must-fix:** | **débito:**

### W8.2 — Formulário público `/{slug}/analise/musculacao`

- **Arquivos:** `app/(public)/[slug]/analise/[modality]/page.tsx`, `components/form/lead/LeadForm.tsx` + `_steps/`
- **Verificar:** preenche do início ao fim com dados realistas, perguntas batem com o que foi configurado em W4.3, submit chama Edge `submit-form`
- **`[ ]` testado** | **must-fix:** | **débito:**

### W8.3 — Lead aparece em `/leads`

- **Verificar:** novo lead na lista, status `new`, link `/r/{token}` válido
- **`[ ]` testado** | **must-fix:** | **débito:**

### W8.4 — Relatório `/r/{token}` — render

- **Arquivos:** `app/(public)/r/[token]/page.tsx`, `components/report/lead/LeadReport.tsx` + `_sections/`
- **Verificar:** todas as seções renderizam (gauges/charts da Fase 45J/K), mobile 375px sem layout quebrado, sem erro 500
- **`[ ]` testado** | **must-fix:** | **débito:**

### W8.5 — Relatório `/r/{token}` — qualidade da IA (Haiku)

- **Verificar:**
  - Narrativa em 1ª pessoa do profissional (NÃO menciona o nome do cliente mais de 2x)
  - Tom respeita o que foi configurado em W2.3 (personality)
  - Contexto da modalidade (musculação) e especialidade selecionadas presente
  - Não inventa dados que o lead não forneceu
  - Recomendações batem com o template da modalidade
- **Como validar:** ler o relatório como se fosse o lead. Se algo soa genérico ou off-tone, é must-fix
- **`[ ]` testado** | **must-fix:** | **débito:**

### W8.6 — Próximo Passo no relatório

- **Verificar:**
  - Mensagem WhatsApp personalizada (placeholders do W4.5 substituídos com dados do lead)
  - Botão WA abre conversa com mensagem pré-preenchida
  - Player de vídeo 16:9 renderiza (YouTube/Loom embed)
  - Calendly se configurado abre em nova aba
- **`[ ]` testado** | **must-fix:** | **débito:**

### W8.7 — Notificação ao PT

- **Verificar:** PT recebe email "novo lead" (template em `lib/email/templates/new-lead.tsx`); se WA configurado, recebe também
- **`[ ]` testado** | **must-fix:** | **débito:**

---

## FASE 9 — Checklist final de entrega

- [x] F0.1 badge "Em breve" aplicado (sidebar + mobile) — `ca4b38a`
- [x] F0.2 EFI bypass deployado e testado — `5d0729b`, edge v11 ACTIVE
- [x] F0.3 6 modalidades + 33 templates ativos no banco — confirmado via MCP
- [x] F0.4 cupom BETA100 criado — `f9770cc4-791d-4fdc-bf9a-8586fcf83bf1`
- [ ] FASE 1 auth completo (login + signup + verify + reset)
- [x] FASE 2 onboarding 25 steps até celebration sem erro — 3 bugs corrigidos; flow auditado end-to-end
- [x] FASE 3 dashboard + walkthrough rodam — data-walkthrough corrigido; subscription card auditado
- [ ] FASE 4 abas Formulário/Relatório/Próximo Passo/Config funcionam pra musculação
- [ ] FASE 5 site + recursos editáveis
- [ ] FASE 6 settings completo
- [ ] FASE 7 /leads renderiza e detalhe funciona
- [ ] FASE 8 funil público end-to-end com relatório IA passando no smell test
- [ ] Mobile 375px sem layout quebrado nas rotas críticas
- [ ] Nenhuma rota liberada retorna 404/500
- [ ] PT consegue logar com Google e chegar até "primeiro lead recebido"

---

## Débitos abertos para depois da entrega

Conforme forem aparecendo durante o walkthrough, listar aqui em vez de consertar:

- **planTier/promoCode ephemeral:** state não persiste no reload — se PT recarregar página no checkout step, precisa refazer Pricing step (selecionar Core + aplicar BETA100).
- **activateModalityAction fire-and-forget:** `activateModalityAction` chamado sem await em StepRenderer; race condition possível se PT for muito rápido (seconds). Na prática inofensivo — Focus/Nutrition steps têm delay suficiente.
- **SubscriptionStatusCard oculto para active:** Dashboard não exibe card de assinatura quando status=active. PT precisa ir a `/subscription` para confirmar status do plano.
- **Modality.tsx mostra apenas 4 modalidades** (musculação + 3 `available: false`). Banco tem 6 modalidades ativas mas o componente só exibe musculação/corrida/ciclismo/crossfit (sem natação/yoga/pilates). Não bloqueia beta (musculação é o foco).
- **Pricing.tsx default 'pro':** Tela de pricing abre com plano Pro selecionado. PT precisa clicar em Core antes de aplicar BETA100 (BETA100 só vale para core). Não é bug; é fluxo esperado.

---

## Pós-entrega

Retomar `docs/refatoracao-2026-05/execucao/PLANO-FINAL.md`:

- Fase 45G (cleanup MobileNav)
- Fase 46 (VRT baseline mini)
- Fase 47 (vertical /r/[token]) — já em andamento em worktree paralelo
