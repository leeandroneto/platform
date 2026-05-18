# Fase 03 — shadcn Install

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-03-shadcn-install.md e execute"`
> **Tempo:** ~1h
> **Depende de:** Fase 01
> **Paralelo com:** Fase 02 (arquivos diferentes — 02 deleta, 03 adiciona)
> **Modelo:** Sonnet 4.6 (ou `/fast`) — instala via CLI
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Instalar 15+ componentes shadcn novos que serao usados nas fases seguintes.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `docs/refatoracao-2026-05/01-shadcn-mapeamento.md` secao 3 (prioridade de install)
3. Verificar `components.json` — confirmar que shadcn esta configurado corretamente

## Itens

### Instalar componentes (usar pnpm dlx shadcn@latest add)

```
[ ] 03.1 — pnpm dlx shadcn@latest add empty
[ ] 03.2 — pnpm dlx shadcn@latest add item
[ ] 03.3 — pnpm dlx shadcn@latest add field
[ ] 03.4 — pnpm dlx shadcn@latest add drawer
[ ] 03.5 — pnpm dlx shadcn@latest add command
[ ] 03.6 — pnpm dlx shadcn@latest add spinner
[ ] 03.7 — pnpm dlx shadcn@latest add carousel
[ ] 03.8 — pnpm dlx shadcn@latest add collapsible
[ ] 03.9 — pnpm dlx shadcn@latest add scroll-area
[ ] 03.10 — pnpm dlx shadcn@latest add pagination
[ ] 03.11 — pnpm dlx shadcn@latest add toggle
[ ] 03.12 — pnpm dlx shadcn@latest add toggle-group
[ ] 03.13 — pnpm dlx shadcn@latest add calendar
[ ] 03.14 — pnpm dlx shadcn@latest add kbd
[ ] 03.15 — pnpm dlx shadcn@latest add alert
[ ] 03.16 — pnpm dlx shadcn@latest add chart
```

NOTA: se algum ja existir, shadcn pergunta se quer sobrescrever. NAO sobrescrever se ja customizado (ler arquivo antes).

### Instalar hook use-mobile (shadcn)

```
[ ] 03.17 — Verificar se hooks/use-media-query.ts ou hooks/use-mobile.ts ja existe
            Se nao: pnpm dlx shadcn@latest add use-mobile
            Se ja existe: manter o nosso
```

### Verificar instalacao

```
[ ] 03.18 — ls components/ui/ | wc -l — contar novos componentes
[ ] 03.19 — pnpm exec tsc --noEmit — 0 erros
[ ] 03.20 — pnpm exec vitest run — todos passam
[ ] 03.21 — git pull --rebase origin main
[ ] 03.22 — Commit: "feat(ds): install 16 new shadcn components (Item, Empty, Field, Drawer, etc)"
```

## Ao concluir

Reportar:

- Componentes instalados: N
- Componentes que ja existiam: N (listar)
- Conflitos: N (como resolveu)
- tsc/vitest: passam

Dizer ao fundador:

---

**Fase 03 concluida.**

Se Fase 02 JA concluiu: proximas fases desbloqueadas — **podem rodar em PARALELO (2 terminais)**:

**Terminal A:** `"leia docs/refatoracao-2026-05/execucao/fase-04-claude-setup.md e execute"`
**Terminal B:** `"leia docs/refatoracao-2026-05/execucao/fase-05-tokens-globals.md e execute"`

## Se Fase 02 AINDA nao concluiu: aguardar Fase 02 terminar.
