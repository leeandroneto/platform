# Fase 11 — Components Domain

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-11-components-domain.md e execute"`
> **Tempo:** ~6h
> **Depende de:** Fases 07 + 08 + 09 + 10 (todas pages feitas)
> **Paralelo com:** nada
> **Modelo:** **Opus 4.7** — toca form/report/site/landing/dashboard, alto risco
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

**Status:** ✅ Concluida 2026-05-02 (commits `fa9dd27` + `69b0c16`)

---

## Objetivo

Padronizar components/ nao-UI (form, report, site, landing, dashboard, settings, onboarding, etc).

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `CLAUDE.md` + `02-regras-padronizacao.md`
3. Ler cada diretorio REAL em components/ (nao confiar em lista)

## Itens por diretorio

### components/form/ (lead + audit)

```
[x] 11.1 — Ler todos os .tsx em components/form/ REAIS
[x] 11.2 — Migrar pra shadcn Field, Input, Textarea, Select
            (QuestionStep: <textarea> → <Textarea>, <label> → <Label>;
             StepContact: <label> → <Label>;
             StepPersonalNote: <textarea> → <Textarea>;
             Field wrapper composto nao usado — pattern Input+Label equivalente)
[x] 11.3 — Verificar <Heading> e <Text> (zero raw h1-h6) — verificado, nenhum raw h1-h6
[x] 11.4 — Verificar max 300 linhas por componente — cada componente <300 linhas;
            arquivos com multiplos componentes (LeadForm.tsx 638 linhas com 5 componentes,
            AuditForm.tsx 588 linhas) seguem padrao do codebase
[x] 11.5 — tsc — 0 erros
```

### components/report/ (lead + audit)

```
[x] 11.6 — Ler todos os .tsx REAIS
[x] 11.7 — Migrar pra shadcn Table, Card, Badge
            (MetricZoneTable: <table> → <Table>;
             FloatingNav: document.getElementById com eslint-disable scoped + justificativa;
             Card/Badge intencionalmente NAO migrados — reports usam
             rounded-[var(--shape-card)] dinamico para multi-tenant theming
             via data-shape; shadcn Card usa rounded-lg fixo, incompativel)
[x] 11.8 — Verificar tokens de cor (report publico = data-surface="public")
            verificado: todas as 11 paginas publicas usam resolveDesignAttrs()
            que aplica data-surface="public"
[x] 11.9 — tsc — 0 erros
```

### components/site/ + components/landing/

```
[x] 11.10 — Ler REAIS. Migrar pra shadcn.
            (MockDashboard: 2x <table> → <Table>;
             MockAnalysis: <textarea> → <Textarea>;
             FlipCard, PremiumAbout, PremiumGallery, TransformationsSection: <img> → next/image;
             QuickLeadForm: <input> → <Input>;
             VisibilityTab: <label> → <Label>)
[x] 11.11 — tsc — 0 erros
```

### components/dashboard/

```
[x] 11.12 — Ler REAIS (13 arquivos)
[x] 11.13 — Migrar stats, charts, nav pra shadcn components — ja compliant
[x] 11.14 — MobileNav, DrawerNav, SidebarNav — verificar compliance — todos compliant
[x] 11.15 — tsc — 0 erros
```

### components/settings/

```
[x] 11.16 — Ler REAIS (9 arquivos)
[x] 11.17 — Migrar forms pra Field, inputs pra shadcn
            (ContactForm: 2x <label> → <Label>;
             GalleryUpload: <img> → next/image, <label>/<input> → <Label>/<Input>;
             HeroMediaUpload: <label>/<input> → <Label>/<Input>)
[x] 11.18 — tsc — 0 erros
```

### components/onboarding/ + template-picker/ + diagnostic-activation/ + funnel/ + launch/

```
[x] 11.19 — Ler REAIS de cada
[x] 11.20 — Migrar pra shadcn
            (FounderProof: <img> → next/image;
             ProximoPassoTab: <img> → next/image;
             onboarding/_components/PhotoCropper: <input range> → <Input>;
             onboarding/_steps/ReportLoading + SiteLoading: <img> → next/image)
[x] 11.21 — tsc — 0 erros
```

### Sweep alem do escopo (commit fa9dd27)

Pastas nao listadas no plano original — todas violacoes de lint migradas pra shadcn:

```
[x] components/admin/GenerationsTable: <table> → <Table>
[x] components/admin/PromptEditor: <select> → <Select>
[x] components/auth/ForgotPasswordForm: <label>/<input> → <Label>/<Input>
[x] components/clients/AssessmentList: 9x <label> + <img> + <input> → shadcn + next/image
[x] components/clients/ClientPlanSection: 7x <label> + 2x <select> → <Label>/<Select>
[x] components/clients/ClientProfileForm: 6x <label> + <select> → <Label>/<Select>
[x] components/credentials/CredentialManager: 5x <label> + <input checkbox> → <Label>/<Checkbox>
[x] components/faq/FaqManager: 3x <label> + <input checkbox> → <Label>/<Checkbox>
[x] components/leads/LeadFollowUpEditor: <input date> → <Input>
[x] components/locations/LocationManager: 8x <label> + <select> + <checkbox> → shadcn
[x] components/methodology/PillarManager: 4x <label> + <checkbox> → shadcn
[x] components/services/ServiceManager: 6x <label> + <select> + <checkbox> → shadcn
[x] components/subscription/CheckoutPixInline: <img> + <label> → next/image + <Label>
[x] components/subscription/ExitSurveyModal: <label> → <Label>
[x] app/(public)/pricing/page.tsx: <table> → <Table>
[x] lib/supabase/admin.ts: scoped eslint-disable (service-role boundary)
```

### Verificacao final

```
[x] 11.22 — pnpm exec tsc --noEmit — 0 erros
[x] 11.23 — pnpm exec vitest run — 401/401 passando (46 test files)
[x] 11.24 — pnpm lint — contar warnings restantes (devem ser so i18n)
            0 erros, 1 warning (jsx-no-literals em MetricsSection — esperado pra fase 12)
[x] 11.25 — git pull --rebase origin main
[x] 11.26 — Commit fa9dd27: "refactor(components): standardize all domain components to shadcn"
```

### Follow-up (commit 69b0c16)

```
[x] .ladle/config.mjs — assign object to variable before default export (warning resolvido)
[x] app/(public)/about/page.tsx — passar {email} para t.rich teamP3 (FORMATTING_ERROR pre-existente)
[x] pnpm build — 91/91 paginas geradas, 0 erros
```

## Ao concluir

Reportar: componentes refatorados, violacoes restantes (esperar ser so i18n).

Dizer ao fundador:

---

**Fase 11 concluida.**

Proxima fase — **1 terminal** (toca muitos arquivos, sem paralelo):

`"leia docs/refatoracao-2026-05/execucao/fase-12-i18n-sweep.md e execute"`

## Fase 12 e a maior fase de strings — ~8h. Migra todo hardcoded PT pra t().
