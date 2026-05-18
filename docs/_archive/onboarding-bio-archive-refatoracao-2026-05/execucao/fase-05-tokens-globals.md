# Fase 05 — Tokens e Globals

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-05-tokens-globals.md e execute"`
> **Tempo:** ~2h
> **Depende de:** Fases 02 + 03
> **Paralelo com:** Fase 04 (arquivos diferentes)
> **Modelo:** Sonnet 4.6 — edita CSS + tsconfig
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Alinhar tsconfig, globals.css, e configs globais com as regras de padronizacao.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `docs/refatoracao-2026-05/03-estrategias-lint.md` secao 6 (tsconfig hardening)
3. Ler `app/globals.css` REAL (nao confiar no doc)
4. Ler `tsconfig.json` REAL

## Itens

### tsconfig hardening

```
[x] 05.1 — Ler tsconfig.json. Verificar quais opcoes ja estao ativas.
[x] 05.2 — Adicionar noFallthroughCasesInSwitch: true (se nao tiver)
[x] 05.3 — Adicionar forceConsistentCasingInFileNames: true (se nao tiver)
[x] 05.4 — pnpm exec tsc --noEmit — verificar se passa. Se quebrar, fixar os erros.
[x] 05.5 — Avaliar noUncheckedIndexedAccess: true — rodar tsc e contar erros.
           Se < 50 erros: ativar e fixar.
           Se > 50 erros: NAO ativar agora. Registrar pra fase futura.
           RESULTADO: 231 erros — ADIADO para fase futura.
```

### Verificar globals.css

```
[x] 05.6 — Confirmar que globals.css tem:
           - overscroll-behavior: none no body ✓
           - -webkit-tap-highlight-color: transparent ✓
           - scroll-behavior: smooth no html ✓
           - prefers-reduced-motion: reduce ✓
           - safe-area classes (safe-pt, safe-pb, etc) ✓
           - touch-target class ✓
           - dvh utilities ✓
           - scrollbar-none ✓
           - pb-nav ✓
           RESULTADO: todos presentes, nenhum gap.

[x] 05.7 — Confirmar que shape system esta completo (rounded, sharp, soft)
[x] 05.8 — Confirmar que density system esta completo (tight, cozy, roomy)
[x] 05.9 — Confirmar que OKLCH primitivos estao definidos (ob-brand, ob-gray, etc)
```

### Verificacao

```
[x] 05.10 — pnpm exec tsc --noEmit — 0 erros
[x] 05.11 — pnpm exec vitest run — todos passam (401/401)
[x] 05.12 — pnpm lint — nao piorou (976 erros sao pre-existentes da Fase 01)
[x] 05.13 — git pull --rebase origin main
[x] 05.14 — Commit: "chore(config): tsconfig hardening + verify globals.css tokens"
```

## Ao concluir

Reportar:

- tsconfig opcoes adicionadas: N
- noUncheckedIndexedAccess: ativado ou adiado (com quantos erros)
- globals.css: completo ou gaps encontrados
- tsc/vitest: passam

Dizer ao fundador:

---

**Fase 05 concluida.**

Se Fase 04 JA concluiu: proxima fase desbloqueada — **1 terminal**:

`"leia docs/refatoracao-2026-05/execucao/fase-06-ui-components.md e execute"`

## Se Fase 04 AINDA nao concluiu: aguardar.
