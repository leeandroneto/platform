# Fase 12 — i18n Sweep

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-12-i18n-sweep.md e execute"`
> **Tempo:** ~8h (maior fase de strings)
> **Depende de:** Fase 11
> **Paralelo com:** nada (toca muitos arquivos)
> **Modelo:** Sonnet 4.6 — repetitivo (string → t())
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Migrar TODAS as strings PT-BR hardcoded pra t() de next-intl. Zero jsx-no-literals warnings.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `CLAUDE.md` secao i18n
3. Ler `messages/pt-BR.json` REAL — entender namespaces existentes
4. Rodar `pnpm lint 2>&1 | grep "jsx-no-literals"` — contar warnings reais

## Regras i18n

- Server components: `const t = await getTranslations('namespace')`
- Client components: `const t = useTranslations('namespace')`
- Server actions: `const t = await getTranslations('actions')`
- Chaves em messages/pt-BR.json organizadas por namespace
- Namespaces existentes: consultar o arquivo REAL

## Itens

### Fase A — Mapear

```
[x] 12.1 — Rodar pnpm lint e salvar output
[x] 12.2 — Contar total de jsx-no-literals warnings: APENAS 1
            components/report/lead/_sections/MetricsSection.tsx:266 — "kcal · IMC"
            (fases anteriores ja migraram a esmagadora maioria)
[x] 12.3 — Sweep alem do jsx-no-literals: varredura em aria-label, title, placeholder
            encontrou 10 strings PT hardcoded adicionais nao capturadas pelo lint
```

### Fase B — Migrar por route group (ordem de prioridade)

```
[x] 12.4 — app/(app)/(shell)/ — LeadsListClient: title/aria-label="Contato pendente" → t('leads.pendingContact')
[x] 12.5 — app/(public)/ — sem strings residuais
[x] 12.6 — app/(auth)/ — sem strings residuais
[x] 12.7 — app/(app)/onboarding/ — Checkout: aria-label="Voltar" → t('back')
[x] 12.8 — app/(client)/ — sem strings residuais
[x] 12.9 — app/(influencer)/ — sem strings residuais
[x] 12.10 — app/admin/ — sem strings residuais
```

### Fase C — Migrar components/

```
[x] 12.11 — components/dashboard/ — DashboardLayout: aria-label="Início" → t('layout.home')
[x] 12.12 — components/form/ — sem strings residuais
[x] 12.13 — components/report/ — MetricsSection: "kcal · IMC" → t('tdeeUnit')
                                   MacroDonut: aria-label hardcoded → prop ariaLabel (passada pelo pai)
                                   JourneySection: aria-label="Timeline de progresso" → t('leadReport.timelineAriaLabel')
[x] 12.14 — components/site/ + landing/ — sem strings residuais
[x] 12.15 — components/settings/ — sem strings residuais
[x] 12.16 — components/onboarding/ — sem strings residuais
[x] 12.17 — Demais components/ — LegalShell: aria-label="Links legais" → t('navAriaLabel')
                                   Walkthrough: aria-label="Fechar" → t('close')
                                   WorkoutEditor: placeholder="Orientações gerais…" → t('workouts.notesPlaceholder') (chave ja existia)
                                   ClientStatusSection: placeholder="Personal Mensal" → t('clientStatus.planPlaceholder')
                                   ManualLeadForm: placeholder="João Silva" → t('manualLeadForm.namePlaceholder')
```

### Verificacao

```
[x] 12.18 — pnpm lint — 0 warnings, 0 erros ✅
[x] 12.19 — pnpm exec tsc --noEmit — 0 erros ✅
[x] 12.20 — pnpm exec vitest run — 401/401 (46 test files) ✅
[x] 12.21 — git pull --rebase origin main — ja up to date
[x] 12.22 — Commit: 5e171f6 "refactor(i18n): migrate all remaining hardcoded PT strings to t()"
```

### Resumo do que foi adicionado a messages/pt-BR.json

8 chaves novas em 5 namespaces:

- `shellDashboard.layout.home` — "Início"
- `shellDashboard.clientStatus.planPlaceholder` — "Ex: Personal Mensal"
- `shellDashboard.manualLeadForm.namePlaceholder` — "Ex: João Silva"
- `features.leadReport.macroDonutAriaLabel` — "Distribuição de macronutrientes"
- `features.leadReport.tdeeUnit` — "kcal · IMC"
- `features.leadReport.timelineAriaLabel` — "Timeline de progresso"
- `legal.shell.navAriaLabel` — "Links legais"
- `ui.close` — "Fechar"

## Ao concluir

Reportar: strings migradas, namespaces criados/expandidos, warnings restantes (deve ser 0).

Dizer ao fundador:

---

**Fase 12 concluida. Todas as strings migradas pra i18n.**

Proxima fase — **1 terminal**:

`"leia docs/refatoracao-2026-05/execucao/fase-13-lint-promote.md e execute"`

## Fase 13 promove todas regras warn → error. Depois disso, impossivel commitar codigo fora do padrao.
