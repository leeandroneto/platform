# Fase 10 — Client + Influencer

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-10-client-influencer.md e execute. Voce e o Terminal C."`
> **Tempo:** ~2h
> **Depende de:** Fase 06
> **Paralelo com:** Fases 07, 08 (rodar quando Terminal C terminar Fase 09)
> **CUIDADO:** `git pull --rebase origin main` antes de commitar
> **Modelo:** Sonnet 4.6 — escopo menor (aluno + influencer)
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Padronizar app/(client)/ e app/(influencer)/ — route groups menores.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `CLAUDE.md` + `02-regras-padronizacao.md`

## Itens

### Client (app/(client)/aluno/)

```
[ ] 10.1 — Ler todas pages REAIS em app/(client)/
[ ] 10.2 — Migrar pra shadcn components
[ ] 10.3 — Verificar loading.tsx, error.tsx
[ ] 10.4 — tsc — 0 erros
```

### Influencer (app/(influencer)/)

```
[ ] 10.5 — Ler todas pages REAIS em app/(influencer)/
[ ] 10.6 — Migrar pra shadcn components
[ ] 10.7 — Verificar loading.tsx, error.tsx
[ ] 10.8 — tsc — 0 erros
```

### Admin (app/admin/)

```
[ ] 10.9 — Ler pages REAIS em app/admin/
[ ] 10.10 — Migrar pra shadcn (baixa prioridade mas padronizar)
[ ] 10.11 — tsc — 0 erros
```

### Verificacao

```
[ ] 10.12 — pnpm exec tsc --noEmit + vitest + lint
[ ] 10.13 — git pull --rebase origin main
[ ] 10.14 — git pull --rebase origin main
[ ] 10.15 — Commit: "refactor(client): standardize client + influencer + admin to shadcn"
```

## Ao concluir

Dizer ao fundador:

---

**Fase 10 (Terminal C) concluida.**

Se Fases 07 e 08 JA concluiram: proxima fase — **1 terminal**:

`"leia docs/refatoracao-2026-05/execucao/fase-11-components-domain.md e execute"`

## Se alguma ainda nao concluiu: aguardar. Este terminal pode fechar.
