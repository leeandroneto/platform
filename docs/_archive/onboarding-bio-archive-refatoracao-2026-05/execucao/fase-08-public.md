# Fase 08 — Public Pages

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-08-public.md e execute. Voce e o Terminal B."`
> **Tempo:** ~6h
> **Depende de:** Fase 06
> **Paralelo com:** Fases 07, 09, 10 (route groups diferentes)
> **CUIDADO:** antes de commitar, `git pull --rebase origin main` (outros terminais comitando)
> **Modelo:** **Opus 4.7** — multi-tenant, paginas que o lead/prospect ve, alto risco
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Padronizar todas as paginas publicas — as que o lead/prospect ve. CRITICAS pra multi-tenant.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `CLAUDE.md`
3. Ler `docs/refatoracao-2026-05/02-regras-padronizacao.md`
4. Ler `docs/refatoracao-2026-05/07-guia-fundacao-design.md` secao 1.5 (surface system)

## Regra critica: nao quebrar funcionalidade

Paginas publicas sao as que o lead/prospect ve. Quebrar aqui = perder conversao.

1. Apos CADA sub-rota migrada: abrir no browser (desktop + mobile 375px)
2. Verificar que brand do profissional reflete (cor, shape, density)
3. Se algo mudou de forma inesperada: PARAR, investigar, corrigir
4. Nunca acumular "vou arrumar depois"

## Regras EXTRAS pra paginas publicas

Alem das regras padrao, paginas publicas DEVEM ter:

- `data-theme`, `data-palette`, `data-typography`, `data-shape`, `data-density`, `data-surface="public"`
- Helper: `resolveDesignAttrs(designFromRow(professional))`
- generateMetadata com OG image
- Cores via `--palette-primary` (cor do PT), nao `--ob-brand-*`

## Itens por sub-rota

### [slug] — link-in-bio do profissional

```
[ ] 08.1 — Ler app/(public)/[slug]/page.tsx REAL
[ ] 08.2 — Verificar data attributes (todos 6 presentes?)
[ ] 08.3 — Verificar generateMetadata + OG
[ ] 08.4 — Migrar componentes pra shadcn
[ ] 08.5 — tsc — 0 erros
```

### [slug]/site — landing premium

```
[ ] 08.6 — Ler app/(public)/[slug]/site/page.tsx REAL
[ ] 08.7 — Verificar data attributes
[ ] 08.8 — Verificar 13 secoes modulares — shadcn components
[ ] 08.9 — tsc — 0 erros
```

### [slug]/analise — formulario do lead

```
[ ] 08.10 — Ler app/(public)/[slug]/analise/ REAL
[ ] 08.11 — Verificar data attributes
[ ] 08.12 — Migrar form pra shadcn Field
[ ] 08.13 — tsc — 0 erros
```

### diagnostic — formulario do prospect

```
[ ] 08.14 — Ler app/(public)/diagnostic/ REAL
[ ] 08.15 — Migrar componentes pra shadcn
[ ] 08.16 — tsc — 0 erros
```

### diagnostic/r/[token] — relatorio do prospect

```
[ ] 08.17 — Ler diagnostic/r/[token]/ REAL (report + analysis + start)
[ ] 08.18 — Migrar componentes pra shadcn
[ ] 08.19 — tsc — 0 erros
```

### r/[token] — relatorio do lead

```
[ ] 08.20 — Ler app/(public)/r/[token]/page.tsx REAL
[ ] 08.21 — Migrar componentes pra shadcn
[ ] 08.22 — tsc — 0 erros
```

### launch, coming-soon, mockups

```
[ ] 08.23 — launch/ — shadcn
[ ] 08.24 — coming-soon/ — shadcn
[ ] 08.25 — mockups/ — shadcn (ou skip se demo)
[ ] 08.26 — tsc — 0 erros
```

### Verificacao final

```
[ ] 08.27 — pnpm exec tsc --noEmit — 0 erros
[ ] 08.28 — pnpm exec vitest run
[ ] 08.29 — pnpm lint
[ ] 08.30 — git pull --rebase origin main
[ ] 08.31 — Commit: "refactor(public): standardize public pages — data attributes, shadcn, metadata"
```

## Ao concluir

Reportar: paginas refatoradas, data attributes adicionados, violacoes corrigidas/restantes.

Dizer ao fundador:

---

**Fase 08 (Terminal B) concluida.**

Se Fases 07, 09 e 10 JA concluiram: proxima fase — **1 terminal**:

`"leia docs/refatoracao-2026-05/execucao/fase-11-components-domain.md e execute"`

## Se alguma ainda nao concluiu: aguardar.
