# Fase 14 — Craft Pass Visual

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-14-craft-pass.md e execute"`
> **Tempo:** ~4h
> **Depende de:** Fase 13
> **Paralelo com:** nada (verificacao final)
> **Modelo:** **Opus 4.7** — julgamento visual, polish, abre todas rotas
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Abrir TODAS as rotas no browser. Verificar visual, layout, interacoes, empty states, brand. Fixar bugs.

## Antes de comecar

1. `git pull --rebase origin main`
2. `pnpm dev` — confirmar que roda
3. Ter um profissional de teste no banco (com brand configurado)

## Itens

### Verificacao por rota (desktop 1280px + mobile 375px)

Pra CADA rota, verificar:

- Renderiza sem erro
- Layout nao quebra em 375px
- Brand reflete (cor, shape, density) se pagina publica
- Empty states com CTA (nao tela vazia)
- Loading skeletons presentes
- Touch targets 44px+ no mobile
- Bottom nav nao cobre conteudo
- Copy correta (sem placeholder, sem texto lorem)
- Heading e Text usados (nao classes raw)
- Nada hardcoded visivel

### Auth

```
[ ] 14.1 — /login (desktop + mobile)
[ ] 14.2 — /signup
[ ] 14.3 — /forgot-password
[ ] 14.4 — /reset-password
[ ] 14.5 — /verify-email
```

### Prospect

```
[ ] 14.6 — /em-breve
[ ] 14.7 — /diagnostico
[ ] 14.8 — /diagnostico/r/[token]
[ ] 14.9 — /diagnostico/r/[token]/analise
[ ] 14.10 — /diagnostico/r/[token]/comecar
```

### Dashboard (logado)

```
[ ] 14.11 — /dashboard
[ ] 14.12 — /leads
[ ] 14.13 — /leads/[id]
[ ] 14.14 — /leads/novo
[ ] 14.15 — /clients (locked)
```

### Templates

```
[ ] 14.16 — /formulario
[ ] 14.17 — /formulario/[modality] (testar 2-3)
[ ] 14.18 — /formulario/ativos
```

### Site + Settings

```
[ ] 14.19 — /site
[ ] 14.20 — /settings/profile
[ ] 14.21 — /settings/contact
[ ] 14.22 — /settings/design
[ ] 14.23 — /settings/media
[ ] 14.24 — /settings/notifications
[ ] 14.25 — /settings/account
[ ] 14.26 — /subscription
```

### Publico do PT

```
[ ] 14.27 — /[slug]
[ ] 14.28 — /[slug]/site
[ ] 14.29 — /[slug]/analise
[ ] 14.30 — /[slug]/analise/[modality]
[ ] 14.31 — /r/[token]
```

### Fixar bugs encontrados

```
[ ] 14.32 — Listar todos bugs visuais encontrados
[ ] 14.33 — Fixar cada um
[ ] 14.34 — Re-verificar paginas afetadas
```

### Verificacao final

```
[ ] 14.35 — pnpm exec tsc --noEmit — 0 erros
[ ] 14.36 — pnpm exec vitest run — todos passam
[ ] 14.37 — pnpm lint — 0 erros, 0 warnings
[ ] 14.38 — pnpm build — passa
[ ] 14.39 — pnpm knip — 0 findings
[ ] 14.40 — git pull --rebase origin main
[ ] 14.41 — Commit: "fix: craft pass visual — N bugs fixed"
```

## Ao concluir

Reportar:

- Rotas verificadas: N
- Bugs encontrados: N
- Bugs fixados: N
- Bugs restantes: N (com motivo)
- **RESULTADO FINAL**: tsc 0, vitest N/N, lint 0/0, build ok, knip 0

Dizer: **"Fase 14 concluida. REFATORACAO HORIZONTAL COMPLETA."**

### Atualizar docs finais

```
[ ] 14.41 — CHECKLIST.md — marcar tudo
[ ] 14.42 — CLAUDE.md — ATUALIZAR OBRIGATORIAMENTE:
           - Remover mencoes a components/composed/ (nao existe mais)
           - Atualizar lista de "Abstracoes disponiveis" (IconButton→Button size="icon", etc)
           - Atualizar contagem de componentes ui/ (era 67, agora ~50)
           - Adicionar novos shadcn instalados (Item, Empty, Field, Drawer, Carousel, etc)
           - Atualizar secao "Onde olhar primeiro" se referencias mudaram
           - Registrar data da refatoracao no historico de reescritas
[ ] 14.43 — docs/core/decisions.md — registrar decisoes novas (D113+)
[ ] 14.44 — README da pasta execucao — marcar concluido
[ ] 14.45 — Deletar docs/produto/design/SHADCN-MAPEAMENTO.md (copia desatualizada — o da pasta refatoracao e o atual)
[ ] 14.46 — Deletar docs/core/REGRAS-PADRONIZACAO.md (copia desatualizada — idem)
```
