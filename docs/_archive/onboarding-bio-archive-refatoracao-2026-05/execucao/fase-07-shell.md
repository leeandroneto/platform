# Fase 07 — Shell Pages

> **Terminal:** `"leia docs/refatoracao-2026-05/execucao/fase-07-shell.md e execute. Voce e o Terminal A."`
> **Tempo:** ~8h (maior fase — pode dividir em 2 sessoes)
> **Depende de:** Fase 06
> **Paralelo com:** Fases 08, 09, 10 (route groups diferentes)
> **Modelo:** **Opus 4.7** — 8h, ampla, dashboard + leads + template + settings
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmacao. Use `/model` pra trocar. Nunca usar Haiku.

---

## Objetivo

Padronizar todas as paginas em app/(app)/(shell)/ — dashboard, leads, template, site, settings, subscription, clients.

## Antes de comecar

1. `git pull --rebase origin main`
2. Ler `CLAUDE.md`
3. Ler `docs/refatoracao-2026-05/02-regras-padronizacao.md` (regras completas)
4. Ler `docs/refatoracao-2026-05/07-guia-fundacao-design.md` secao 3.9 (estrutura por tipo)
5. Ler `docs/refatoracao-2026-05/09-mobile-app-design.md` secao 3 (shadcn mobile patterns)

## Regra critica: nao quebrar funcionalidade

Ao trocar componentes numa pagina:

1. **Ler o componente ANTES** — entender o que ele renderiza, que props recebe, que eventos emite
2. **Trocar e rodar tsc** — se falhar, a prop mapping esta errada
3. **Abrir a pagina no browser** apos cada sub-rota migrada — verificar que renderiza igual
4. **Se algo mudou visualmente de forma inesperada**: PARAR, investigar, corrigir antes de continuar
5. **Nunca acumular "vou arrumar depois"** — cada pagina deve funcionar ao sair dela

## Regras pra CADA pagina

Ao refatorar cada pagina, verificar TODOS estes pontos:

- [ ] shadcn components usados (zero HTML raw — <button>, <input>, <table>, etc)
- [ ] `<Heading>` e `<Text>` pra tipografia (zero raw h1-h6, zero classes tipo text-xl)
- [ ] Strings visiveis via `t()` (nao hardcoded — sera feito em Fase 12, mas JA marcar o que encontrar)
- [ ] Tokens CSS vars pra cores (zero hex inline)
- [ ] Tokens shape/density onde aplicavel
- [ ] loading.tsx existe com Skeleton
- [ ] error.tsx existe
- [ ] generateMetadata se conteudo dinamico
- [ ] Empty state em listas (shadcn Empty)
- [ ] pb-nav em listas (compensar bottom nav)
- [ ] Mobile 375px: layout nao quebra, touch targets 44px+
- [ ] Max 300 linhas por componente

## Itens por sub-rota

### Dashboard (app/(app)/(shell)/dashboard/)

```
[x] 07.1 — page.tsx lido; violacoes: <p> + <div> com classes raw; <Link> com classes pill; <code> raw; section/div como Cards
[x] 07.2 — stats cards migrados pra Card + Heading + Text + Button asChild
[x] 07.3 — lista atividade recente migrada pra ItemGroup + Item asChild Link
[x] 07.4 — loading.tsx (Card+Skeleton), error.tsx no shell layout, metadata estatica OK
[x] 07.5 — tsc 0 erros
```

### Leads (app/(app)/(shell)/leads/)

```
[x] 07.6 — page.tsx + _components lidos; LeadsListClient.tsx + LeadDetailPanel.tsx flagged como dead code (refactor inacabado)
[x] 07.7 — lista mobile migrada pra Item + ItemGroup + ItemFooter
[x] 07.8 — tabela desktop migrada pra shadcn Table
[!] 07.9 — filtros mantidos como Select (LeadFilters); chips Carousel deferred (UX nao melhora pra select 5 status); <label> raw → <Label>
[x] 07.10 — empty states migrados pra Empty (zero leads + filtrado)
[x] 07.11 — leads/[id] migrado: Card sections, Breadcrumb mantido, generateMetadata existente, actions via Button asChild
[x] 07.12 — leads/new migrado: ghost back button, Text subtitle, ManualLeadForm intacto
[x] 07.13 — tsc 0 erros
```

### Template (app/(app)/(shell)/template/)

```
[x] 07.14 — pages lidas; violacoes: <p>, <Link> com classes pill, span raw em modalidade icon
[x] 07.15 — grid mantido (TemplateGrid component existente); page.tsx index migrado pra Item/ItemGroup; active page migrado com Empty
[!] 07.16 — modalidade picker mantido como ItemGroup vertical (mais natural mobile que Carousel pra 6 modalidades + ativos)
[x] 07.17 — tsc 0 erros
```

### Site (app/(app)/(shell)/site/)

```
[x] 07.18 — SiteHub.tsx lido; violacoes: <Link> com pill classes, Button ghost com texto raw, <p> em headers, ConfigLayout preview com span raw
[x] 07.19 — SiteHub mobile migrado pra ItemGroup + Item (role=button keyboard handlers); editor + catalog secoes
[x] 07.20 — loading.tsx migrado pra Card + Skeleton
[x] 07.21 — tsc 0 erros
```

### Settings (app/(app)/(shell)/settings/)

```
[x] 07.22 — layout.tsx + sub-pages lidos; violacoes: Link raw com classes ativo/hover, <p> em headers, <label> raw em LeadFilters
[x] 07.23 — MobileCollapsible reescrito com shadcn Collapsible + Item; layout sidebar com Button asChild (active variant=secondary)
[x] 07.24 — forms intactos (profile/contact/design/media/notifications/account ja usavam Field/Input shadcn por dentro)
[x] 07.25 — todas pages atualizadas: Text variant=micro pra subtitles; notifications usa Button asChild pra history link
[x] 07.26 — tsc 0 erros
```

### Subscription + Clients + Forms

```
[x] 07.27 — subscription/page.tsx migrado: Card sections, Heading/Text typography, Badge pra plan, refund/cancel sections como Card
[x] 07.28 — clients/page.tsx migrado: stats Cards, Item/ItemGroup mobile, shadcn Table desktop, Empty pra zero/filtrado, Input/Select via _components/ClientsStatusFilter (novo client component)
[!] 07.29 — forms/page.tsx so faz redirect pra /formulario (skip)
[x] 07.30 — tsc 0 erros
```

### Verificacao final

```
[x] 07.31 — pnpm exec tsc --noEmit — 0 erros
[x] 07.32 — pnpm exec vitest run — 401/401 passando, 46 test files
[x] 07.33 — pnpm lint — 675 problems totais (debt pre-existente em outros arquivos; 0 nos arquivos da fase 07)
[x] 07.34 — git fetch + sync OK (origin sem novos commits no momento)
[x] 07.35 — Commits: ecbce10 (dashboard+leads, mensagem fundida com fase-10 por colisao multi-agent), 34dc762 (template), d2fcab4 (site), b860ffb (settings), 03639e0 (subscription+clients), c9fea8b (checklist)
```

## Ao concluir

Reportar:

- Paginas refatoradas: N
- Violacoes corrigidas: N
- Violacoes restantes (i18n — Fase 12): N
- Componentes shadcn adotados: listar quais

Dizer ao fundador:

---

**Fase 07 (Terminal A) concluida.**

Se Fases 08, 09 e 10 JA concluiram: proxima fase — **1 terminal**:

`"leia docs/refatoracao-2026-05/execucao/fase-11-components-domain.md e execute"`

## Se alguma ainda nao concluiu: aguardar. Fase 11 precisa de TODAS as pages feitas antes de tocar nos components/ compartilhados.
