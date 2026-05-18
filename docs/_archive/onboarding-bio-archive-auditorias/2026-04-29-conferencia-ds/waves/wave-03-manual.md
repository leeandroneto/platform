# Wave 03 — Checks manuais

**Status:** PENDENTE (requer navegacao em browser)

## 3 categorias

### 1. Estados visiveis (7 por componente interativo)

**Metodo:** Abrir Ladle (`pnpm exec ladle dev`), navegar a cada story, testar:

- default, hover, active, focus-visible (Tab), disabled, loading, error

**Analise de codigo:** Todos os estados esperados estao implementados nos componentes. Ver `estados-checklist.md`.

**Status:** Analise de codigo feita. Verificacao visual pendente.

### 2. Outline semantico (5 paginas criticas)

**Metodo:** Chrome DevTools > Accessibility > Headings em:

- `/`, `/dashboard`, `/{slug}`, `/r/{token}`, `/onboarding`

**Expectativa:** 1 h1 + hierarquia coerente (sem pular niveis).

**Contexto:** Fase 20 migrou 308 headings, Fase 23 cravou lint error. Risco baixo.

**Status:** Pendente.

### 3. Axe-core (5 paginas criticas)

**Metodo:** Extensao axe DevTools nas mesmas 5 rotas.

**Expectativa:** 0 violacoes criticas.

**Contexto:** Fase 9 cravou jsx-a11y strict. Risco baixo.

**Status:** Pendente.

## Veredicto: PENDENTE (Dec-24-4: nao bloqueia selar)
