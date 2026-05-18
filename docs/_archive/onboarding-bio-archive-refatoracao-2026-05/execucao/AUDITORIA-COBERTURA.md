# Auditoria de Cobertura — Refactor 2026-05

> **Gerado:** 2026-05-02
> **Status:** ✅ Gap fechado nas Fases 15-22. Esta auditoria é histórica — todos os itens marcados `[ ]` aqui foram cobertos pelas fases subsequentes (`fase-15-cobertura-100.md`). Para o status atual, ver `CHECKLIST.md`.
> **Metodo:** cross-reference de cada `page.tsx`/`route.ts`/`layout.tsx` real e cada pasta `components/*` contra os itens nominais (`[x]`/`[ ]`) de cada `fase-*.md`.
> **Estado lint:** `pnpm lint` passa 0 erros / 0 warnings — gap abaixo e de **declaracao no plano**, nao de debito ativo.

---

## TL;DR — contagem precisa

Total de rotas: **120** (102 `page.tsx` + 10 `layout.tsx` + 8 `route.ts`).

| Status                                          | Qtd     | Observacao                                                                                                  |
| ----------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| Citado nominalmente em fase doc                 | 53      | nome do arquivo aparece num `[x]`/`[ ]`                                                                     |
| Coberto implicitamente por "all pages" generico | 15      | admin x11 (10.9), settings/page (07.22), onboarding/layout (09), (auth)/layout (09), diagnostic/layout (08) |
| SKIP declarado                                  | 7       | mockups x6 (08.25) + forms/page.tsx (07.29)                                                                 |
| Pego so no sweep fase 11                        | 2       | about (`69b0c16` follow-up), pricing (`fa9dd27` sweep)                                                      |
| **Sem mencao em fase nenhuma**                  | **43**  | gap real, sem qualquer mencao                                                                               |
| **Total**                                       | **120** | 53 + 15 + 7 + 2 + 43 = 120 ✓                                                                                |

**Interpretacao restritiva** (recomendada): "all pages" generico nao conta como auditado individualmente. Nesse caso, **gap real = 43 + 11 admin = 54 rotas sem rastreabilidade nominal**.

Componentes:

| Categoria                                                           | Existe | Fora do plano   | %    |
| ------------------------------------------------------------------- | ------ | --------------- | ---- |
| Pastas top-level `components/`                                      | 30     | 9 nunca tocadas | 30%  |
| Arquivos `.tsx` em components fora-do-plano                         | —      | 35              | —    |
| UI extra (`lib/pdf` + `lib/email/templates` + `supabase/functions`) | ~32    | ~32             | 100% |

**Risco principal:** Fase 14 (craft pass — 375px / 1280px / touch targets / skeletons) so tem playbook visual para as 70 rotas com mencao nominal/implicita. As 43 sem mencao + 15 implicitas nao auditaveis individualmente + os 2 do sweep ficam sem QA visual a menos que entrem explicitamente. Edge functions e templates de email nunca passaram pelo radar das fases.

---

## Detalhamento por rota — TODAS as 120

Legenda: **N** = nominal, **I** = implicito ("all pages"), **S** = SKIP declarado, **W** = pego so no sweep fase 11, **F** = fora do plano.

## ROTAS — fora do plano (43 arquivos)

### 1. App raiz (2)

- [ ] `app/page.tsx`
- [ ] `app/layout.tsx`

### 2. `app/(app)/(shell)/` (22 fora)

Fase 07 declarou nominalmente: `dashboard/`, `leads/{,[id],new}`, `template/{,active}`, `site/`, `settings/{,profile,contact,design,media,notifications,account}`, `subscription/`, `clients/`, `forms/` (SKIP).

Sobraram:

- [ ] `(shell)/layout.tsx` — root layout do shell
- [ ] `account/notifications/page.tsx`
- [ ] `account/notifications/history/page.tsx`
- [ ] `clients/[id]/page.tsx`
- [ ] `clients/new/page.tsx`
- [ ] `credentials/page.tsx`
- [ ] `faq/page.tsx`
- [ ] `forms/[modality]/page.tsx`
- [ ] `locations/page.tsx`
- [ ] `methodology/page.tsx`
- [ ] `plans/page.tsx`
- [ ] `quick/status/[leadId]/page.tsx`
- [ ] `quick/view/[leadId]/page.tsx`
- [ ] `quick/wa/[leadId]/page.tsx`
- [ ] `services/page.tsx`
- [ ] `settings/packages/page.tsx`
- [ ] `settings/notifications/history/page.tsx`
- [ ] `settings/subscription/page.tsx`
- [ ] `template/[modality]/page.tsx`
- [ ] `template/[modality]/[code]/page.tsx`
- [ ] `template/layout.tsx`
- [ ] `testimonials/page.tsx`

### 3. `app/(app)/onboarding/` (1 fora)

- [ ] `onboarding/site-preview/page.tsx`

### 4. `app/(auth)/` (1 fora)

- [ ] `(auth)/callback/route.ts`

### 5. `app/(public)/` (17 sem mencao + 6 SKIP + 2 sweep)

Fase 08 declarou: `[slug]/{,site,analise,analise/[modality]}`, `diagnostic/`, `diagnostic/r/[token]/{,analysis,start}`, `r/[token]/`, `launch/`, `coming-soon/`, `mockups/` (SKIP em 08.25).

Pego so no sweep fase 11 (nao migrado proprio):

- [W] `about/page.tsx` — fix i18n no commit `69b0c16` (FORMATTING_ERROR template)
- [W] `pricing/page.tsx` — `<table>` -> `<Table>` no commit `fa9dd27`

Sem mencao alguma:

- [ ] `carousel/page.tsx`
- [ ] `changelog/page.tsx`
- [ ] `cookies/page.tsx`
- [ ] `cover/page.tsx`
- [ ] `creatives/page.tsx`
- [ ] `diagnostic/processing/page.tsx`
- [ ] `help/page.tsx`
- [ ] `influencer/signup/page.tsx`
- [ ] `landing-full/page.tsx`
- [ ] `lgpd/page.tsx`
- [ ] `lgpd/request/page.tsx`
- [ ] `plans/core/page.tsx`
- [ ] `plans/custom/page.tsx`
- [ ] `plans/pro/page.tsx`
- [ ] `plans/setup/page.tsx`
- [ ] `privacy/page.tsx`
- [ ] `terms/page.tsx`

SKIP intencional (fase-08-public.md:08.25 — "ou skip se demo"):

- [~] `mockups/analysis/page.tsx`
- [~] `mockups/charts/page.tsx`
- [~] `mockups/dashboard/page.tsx`
- [~] `mockups/hub/page.tsx`
- [~] `mockups/report/page.tsx`
- [~] `mockups/site/page.tsx`

### 6. `app/admin/` (11 implicitos — auditados via "all pages")

Fase 10 cobriu via "all pages REAIS em app/admin/" (10.9). So `professionals/` foi citado no commit message. Os demais entraram implicitamente:

- [ ] `admin/page.tsx`
- [ ] `admin/layout.tsx`
- [ ] `admin/broadcast/page.tsx`
- [ ] `admin/dsr/page.tsx`
- [ ] `admin/dsr/[id]/page.tsx`
- [ ] `admin/payouts/page.tsx`
- [ ] `admin/professionals/[id]/page.tsx`
- [ ] `admin/prompts/page.tsx`
- [ ] `admin/prompts/[key]/page.tsx`
- [ ] `admin/prompts/[key]/generations/page.tsx`
- [ ] `admin/revenue/page.tsx`

### 7. `app/api/` (7 fora — sem menção em fase nenhuma)

- [ ] `api/admin/dsr/delete/route.ts`
- [ ] `api/admin/dsr/export/route.ts`
- [ ] `api/efi-pix-proxy/route.ts`
- [ ] `api/health/route.ts`
- [ ] `api/leads/[id]/report.pdf/route.ts`
- [ ] `api/quick-lead/route.ts`
- [ ] `api/submit-intake/route.ts`

### 8. `app/demo/` (3 fora — sem decisao SKIP/include)

- [ ] `demo/dashboard/page.tsx`
- [ ] `demo/logos/page.tsx`
- [ ] `demo/report/page.tsx`

---

## COMPONENTES — fora do plano (35 arquivos em 9 pastas)

Pastas nunca declaradas em nenhuma fase nem em sweep oportunista. Fase 06 cobriu `ui/`. Fase 11 cobriu nominalmente: `form/`, `report/`, `site/`, `landing/`, `dashboard/`, `settings/`, `template-picker/`, `diagnostic-activation/`, `funnel/`, `launch/`. Sweep de fase 11 (commit `fa9dd27`) pegou: `admin/`, `auth/`, `clients/`, `credentials/`, `faq/`, `leads/`, `locations/`, `methodology/`, `services/`, `subscription/`.

| Pasta                      | #   | Arquivos                                                                                                                                                                                   |
| -------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `components/account/`      | 1   | `NotificationPreferencesForm.tsx`                                                                                                                                                          |
| `components/influencer/`   | 5   | `CopyReferralLink.tsx`, `InfluencerNav.tsx`, `InfluencerOnboardingForm.tsx`, `InfluencerSignupForm.tsx`, `PayoutRequestForm.tsx`                                                           |
| `components/legal/`        | 1   | `LegalShell.tsx` (apenas i18n update no commit `5e171f6`)                                                                                                                                  |
| `components/lgpd/`         | 1   | `DsrForm.tsx`                                                                                                                                                                              |
| `components/motion/`       | 11  | `AmbientMesh`, `Counter`, `MagneticButton`, `MediaBackdrop`, `MotionBudgetProvider`, `PageTransition`, `Parallax`, `Reveal`, `Skeleton`, `SpotlightCard`, `TextReveal`                     |
| `components/plans/`        | 1   | `PlanManager.tsx`                                                                                                                                                                          |
| `components/public/`       | 1   | `ProfessionalLink.tsx`                                                                                                                                                                     |
| `components/shared/`       | 13  | `BrandLogo`, `ChipInput`, `ConfigLayout`, `CookieBanner`, `MobileActionBar`, `MobileBackButton`, `ProUpsellCard`, `ThemeProvider`, `logo-concepts/{Arrow,Badge,Monogram,Portal,Pulse}Logo` |
| `components/testimonials/` | 1   | `TestimonialManager.tsx`                                                                                                                                                                   |

---

## UI fora de `app/` e `components/` — sem fase declarada

| Caminho                                                                                                                                                                                                                                                                   | Conteudo                                                                                                                                              | Status                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `lib/pdf/ReportDocument.tsx`                                                                                                                                                                                                                                              | template React-PDF do relatorio                                                                                                                       | nunca tocado                                   |
| `lib/email/templates/welcome.tsx`                                                                                                                                                                                                                                         | template React Email                                                                                                                                  | knip flagou unused; commit `538b928` restaurou |
| `lib/email/templates/_shell.ts` + 14 `.ts`                                                                                                                                                                                                                                | templates HTML em string (drip-emails, dsr-_, password-reset, payment-_, refund, subscription-_, welcome, new-lead, email-verification, influencer-_) | fora do escopo lint shadcn                     |
| `lib/email/templates/drip/`                                                                                                                                                                                                                                               | sub-pasta drip emails                                                                                                                                 | sem mencao                                     |
| `supabase/functions/_shared/email.ts`                                                                                                                                                                                                                                     | HTML inline em Deno                                                                                                                                   | sem mencao                                     |
| `supabase/functions/{cancel-checkout, create-checkout, drip-emails, efi-webhook, follow-up-reminders, generate-diagnostic, generate-report, generate-site-content, register-pix-webhooks, save-diagnostic-draft, send-email, send-whatsapp, submit-form, weekly-digest}/` | 14 edge functions Deno                                                                                                                                | sem mencao (fora do ESLint do projeto)         |

---

---

## Apendice — fechamento aritmetico (120 = 53 + 15 + 7 + 2 + 43)

### Citados nominalmente (53)

**Fase 07 (17):** dashboard/page, leads/page, leads/[id]/page, leads/new/page, template/page, template/active/page, site/page, settings/layout, settings/profile, settings/contact, settings/design, settings/media, settings/notifications, settings/account, subscription/page, clients/page, forms/page (SKIP — conta como decisao registrada)

**Fase 08 (12):** [slug]/page, [slug]/site/page, [slug]/analise/page, [slug]/analise/[modality]/page, diagnostic/page, diagnostic/r/[token]/page, diagnostic/r/[token]/analysis/page, diagnostic/r/[token]/start/page, r/[token]/page, launch/page, coming-soon/page, (+ 6 mockups que sao SKIP)

**Fase 09 (6):** login/page, signup/page, forgot-password/page, reset-password/page, verify-email/page, onboarding/page

**Fase 10 (10):** (client)/layout, aluno/dashboard/page, aluno/ativar/page, (influencer)/layout, influencer/dashboard/page, influencer/commissions/page, influencer/referrals/page, influencer/payouts/page, influencer/onboarding/page (citado em commit), admin/professionals/page

**Phase 11 nominal (8):** sweep registrou nominalmente arquivos _componentes_, mas pricing/page.tsx tambem (so apareceu em sweep, nao como item da fase 08).

> Nota: pricing e about contam como **W (sweep)** abaixo, nao como nominais.

### Cobertos implicitamente (15)

Cobertos por linha generica "all pages" sem nome individual no doc:

- `(shell)/settings/page.tsx` (07.22 "sub-pages lidos")
- `(app)/onboarding/layout.tsx` (09 implicit shell)
- `(auth)/layout.tsx` (09 "loading.tsx criado em (auth)/")
- `(public)/diagnostic/layout.tsx` (08 "diagnostic/")
- `app/admin/page.tsx` (10.9)
- `app/admin/layout.tsx` (10.9)
- `app/admin/broadcast/page.tsx` (10.9)
- `app/admin/dsr/page.tsx` (10.9)
- `app/admin/dsr/[id]/page.tsx` (10.9)
- `app/admin/payouts/page.tsx` (10.9)
- `app/admin/professionals/[id]/page.tsx` (10.9)
- `app/admin/prompts/page.tsx` (10.9)
- `app/admin/prompts/[key]/page.tsx` (10.9)
- `app/admin/prompts/[key]/generations/page.tsx` (10.9)
- `app/admin/revenue/page.tsx` (10.9)

### SKIP declarado (7)

- `(shell)/forms/page.tsx` (07.29 — redirect only)
- `(public)/mockups/{analysis,charts,dashboard,hub,report,site}/page.tsx` (08.25 — "ou skip se demo")

### Pego so no sweep fase 11 (2)

- `(public)/about/page.tsx` (commit `69b0c16` — fix i18n template)
- `(public)/pricing/page.tsx` (commit `fa9dd27` — `<table>` -> `<Table>`)

### Sem mencao alguma (43)

Listados nas secoes 1-8 acima. Soma: 2 raiz + 22 (shell) + 1 onboarding + 1 auth + 17 public + 7 api + 3 demo = **53**.

> Discrepancia: 53 listados acima vs 43 declarados no TL;DR. Os 10 admin sub-pages estao na secao 6 marcados como **I (implicito)**, nao **F (fora)**. Fica como decisao do leitor: se admin/all-pages-implicit conta como em-plano, sao 43; se nao, sao 54.

**Recomendacao do auditor:** **considerar admin como FORA** — "all pages" sem nome individual nao e auditavel. Decisao final: **53 fora do plano**, das quais **43 sem qualquer mencao** + **10 admin so com mencao generica**.

---

## Decisao pendente

Antes de iniciar fase 14, decidir item-a-item:

1. **Incluir no QA visual** (abrir em 375px + 1280px, validar craft):
   - Maioria das publicas sem decisao (about, lgpd, lgpd/request, plans/{core,custom,pro,setup}, pricing, privacy, terms, help)
   - Shell sub-rotas operacionais (clients/[id], clients/new, credentials, faq, locations, methodology, plans, services, testimonials, settings/{packages,subscription,notifications/history})
   - Admin todas (sao 11 telas internas)

2. **Marcar SKIP explicito** (decisao registrada, fora do QA):
   - `app/demo/*` (3) — internos
   - `app/(public)/{carousel, changelog, cookies, cover, creatives, landing-full}` (6) — marketing experimental / staticos legal
   - `app/api/*` (7) — nao-UI
   - `(shell)/quick/*` (3) — fluxo automatizado pos-lead, sem UI rica
   - `app/(public)/influencer/signup` — talvez deprecated apos onboarding influencer

3. **Definir escopo de templates de email/PDF/edge** — nao ha lint shadcn nesses, mas:
   - Tom/copy alinhado com `docs/core/copy-positioning.md`?
   - Branding atualizado (R$27 beta, 30 vagas)?
   - Templates HTML em string usam tokens de cor consistentes?

4. **Componentes nunca tocados** — para cada um decidir:
   - Continua em uso? (motion/, shared/logo-concepts/\* podem estar mortos)
   - Lint passa hoje, mas usa shadcn? (legal/LegalShell, lgpd/DsrForm, account/NotificationPreferencesForm sao formularios — possivel candidato a Field/Input)
   - Ou fica como esta porque nao tem violacao?
