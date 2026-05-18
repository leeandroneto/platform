# Fase 02 — Dead Code Removal

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-02-dead-code.md e execute"`
> **Tempo:** ~1h
> **Depende de:** Fase 01
> **Paralelo com:** Fase 03 (arquivos diferentes)
> **Modelo:** Sonnet 4.6 — repetitivo, julgamento moderado
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Deletar todos os componentes com 0 imports. Limpar stories orfas. Zerar knip.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `CLAUDE.md`
3. Ler `docs/refatoracao-2026-05/01-shadcn-mapeamento.md` secao 5 (lista de mortos)
4. **IMPORTANTE**: NAO confiar na lista do doc. Rodar grep REAL pra confirmar cada componente antes de deletar. Pode ter mudado desde a pesquisa.

## Itens

### Verificar e deletar (pra CADA componente abaixo)

Processo pra cada:

1. `grep -rn "NomeComponente" app/ components/ --include="*.tsx" --include="*.ts" | grep -v "components/ui/nome" | grep -v ".stories."`
2. Se 0 resultados → deletar arquivo + stories
3. Se >0 resultados → NAO deletar, reportar

```
[ ] 02.1 — async-action-button.tsx (+ stories se existir)
[ ] 02.2 — bottom-tab-bar.tsx (+ stories)
[ ] 02.3 — checkbox-group.tsx (+ stories)
[ ] 02.4 — combobox.tsx (+ stories)
[ ] 02.5 — command-palette.tsx (+ stories)
[ ] 02.6 — danger-action.tsx (+ stories)
[ ] 02.7 — data-table.tsx (+ stories)
[ ] 02.8 — date-picker.tsx (+ stories)
[ ] 02.9 — date-range-picker.tsx (+ stories)
[ ] 02.10 — drawer-with-dirty-check.tsx (+ stories)
[ ] 02.11 — file-upload.tsx (+ stories)
[ ] 02.12 — floating-action-button.tsx (+ stories)
[ ] 02.13 — form-actions.tsx (+ stories)
[ ] 02.14 — form-section.tsx (+ stories)
[ ] 02.15 — kbd.tsx (+ stories)
[ ] 02.16 — link-button.tsx (+ stories) — TEM 4 IMPORTS, verificar se pode migrar pra Button asChild
[ ] 02.17 — list-item.tsx (+ stories)
[ ] 02.18 — mobile-list.tsx (+ stories)
[ ] 02.19 — mobile-top-bar.tsx (+ stories)
[ ] 02.20 — notification-banner.tsx (+ stories)
[ ] 02.21 — optimized-image.tsx (+ stories)
[ ] 02.22 — segmented-control.tsx (+ stories)
[ ] 02.23 — skeleton-variants.tsx (+ stories)
[ ] 02.24 — status.tsx (+ stories) — TEM 3 IMPORTS, verificar se pode migrar pra Badge
[ ] 02.25 — sticky-action-bar.tsx (+ stories)
[ ] 02.26 — surface.tsx (+ stories)
```

NOTA: link-button (02.16) e status (02.24) podem ter imports. Se tiverem:

- link-button → migrar pra `<Button asChild><Link>` nos consumidores, depois deletar
- status → migrar pra `<Badge variant={...}>` nos consumidores, depois deletar

### Componentes que eram "mortos" no audit mas podem ter mudado

```
[ ] 02.27 — Verificar card.tsx, progress.tsx, separator.tsx, tooltip.tsx — audit disse 0 imports mas sao shadcn basicos. Se usados indiretamente (por outros componentes ui), MANTER.
```

### Regra de integridade (link-button e status)

Para os componentes que TEM imports (link-button ~4, status ~3):

```
[ ] 02.27a — MAPEAMENTO DE PROPS antes de comecar:
            link-button: quais props usa? → mapear pra <Button asChild><Link>
            status: quais props/variants? → mapear pra <Badge variant={...}>
[ ] 02.27b — Migrar CADA consumidor (trocar import + JSX + props)
[ ] 02.27c — tsc apos CADA arquivo migrado
[ ] 02.27d — Abrir 2-3 paginas afetadas no browser — renderizam correto?
[ ] 02.27e — Grep pelo nome antigo — 0 resultados?
[ ] 02.27f — SO ENTAO deletar o componente antigo
```

### Verificacao final

```
[ ] 02.28 — pnpm knip — deve ter menos findings que antes
[ ] 02.29 — pnpm exec tsc --noEmit — 0 erros
[ ] 02.30 — pnpm exec vitest run — todos passam
[ ] 02.31 — pnpm lint — sem novos erros
[ ] 02.32 — git pull --rebase origin main
[ ] 02.33 — Commit: "refactor(cleanup): delete N dead components from ui/"
```

## Ao concluir

Reportar:

- Componentes deletados: N
- Componentes que tinham imports (NAO deletados): N (listar quais)
- Stories deletadas: N
- knip findings restantes: N

Dizer ao fundador:

---

**Fase 02 concluida.**

Se Fase 03 JA concluiu: proximas fases desbloqueadas — **podem rodar em PARALELO (2 terminais)**:

**Terminal A:** `"leia docs/refatoracao-2026-05/execucao/fase-04-claude-setup.md e execute"`
**Terminal B:** `"leia docs/refatoracao-2026-05/execucao/fase-05-tokens-globals.md e execute"`

Fase 04 configura .claude/. Fase 05 ajusta tsconfig/globals. Arquivos diferentes — seguro rodar juntas.

## Se Fase 03 AINDA nao concluiu: aguardar Fase 03 terminar antes de abrir 04 e 05.
