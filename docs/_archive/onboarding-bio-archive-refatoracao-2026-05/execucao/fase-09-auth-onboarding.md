# Fase 09 — Auth + Onboarding

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-09-auth-onboarding.md e execute. Voce e o Terminal C."`
> **Tempo:** ~3h
> **Depende de:** Fase 06
> **Paralelo com:** Fases 07, 08, 10
> **CUIDADO:** `git pull --rebase origin main` antes de commitar
> **Modelo:** **Opus 4.7** — fluxo critico (auth + 23 steps onboarding)
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Padronizar auth pages (5) e onboarding (23 steps).

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `CLAUDE.md` + `02-regras-padronizacao.md`

## Itens

### Auth (app/(auth)/)

```
[ ] 09.1 — Ler login/page.tsx REAL — shadcn Field, inputs, Spinner
[ ] 09.2 — Ler signup/page.tsx REAL — idem
[ ] 09.3 — forgot-password, reset-password, verify-email — shadcn
[ ] 09.4 — Verificar: loading.tsx, error.tsx em (auth)/
[ ] 09.5 — tsc — 0 erros
```

### Onboarding (app/(app)/onboarding/)

```
[ ] 09.6 — Ler OnboardingShell REAL + listar os 23 steps
[ ] 09.7 — Verificar cada step por violacoes (raw HTML, hex, classes typo)
           NOTA: sao ~23 steps. Nao precisa refatorar TODOS agora se forem muitos.
           Focar nos que tem violacoes. Registrar os limpos.
[ ] 09.8 — Migrar inputs pra shadcn Field onde aplicavel
[ ] 09.9 — Verificar loading.tsx, error.tsx
[ ] 09.10 — tsc — 0 erros
```

### Verificacao

```
[ ] 09.11 — pnpm exec tsc --noEmit + vitest + lint
[ ] 09.12 — git pull --rebase origin main
[ ] 09.13 — git pull --rebase origin main
[ ] 09.14 — Commit: "refactor(auth): standardize auth + onboarding to shadcn"
```

## Ao concluir

Dizer ao fundador:

---

**Fase 09 (Terminal C) concluida.**

Este terminal pode continuar com Fase 10 imediatamente:

`"leia docs/refatoracao-2026-05/execucao/fase-10-client-influencer.md e execute. Voce e o Terminal C."`

## Fase 11 so desbloqueia quando 07 + 08 + 10 tambem concluirem.
