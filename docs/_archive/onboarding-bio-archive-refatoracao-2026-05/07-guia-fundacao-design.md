# Guia de Fundacao — onboarding.bio

> Documento operacional para padronizar toda UI, arrumar o legado, e travar o futuro.
> **Stack:** Next.js 16 (App Router) + Tailwind v4 (@theme) + shadcn/ui + Motion 12 + OKLCH + APCA + next-intl.
> **Hierarquia:** se conflitar com `CLAUDE.md`, CLAUDE.md vence. Se conflitar com `02-regras-padronizacao.md`, as regras vencem.
> **Criado:** 2026-05-01

---

## Como usar este guia

- **Parte 1** — Fundacao: stack, tokens, design system, multi-tenant
- **Parte 2** — Componentes: hierarquia shadcn-first, compostos, patterns
- **Parte 3** — Mobile app-like: patterns iFood/Nubank/Magalu, PWA, gestos
- **Parte 4** — Travar o futuro: 5 mecanismos contra regressao
- **Parte 5** — Arrumar o legado: Strangler Pattern, auditoria, migracao em lotes

---

## Principios que governam tudo

1. **shadcn primeiro, sempre.** Se shadcn tem — use. Se nao tem — componha primitivos. So crie custom se nao tem alternativa E sera reusado em 2+ lugares.
2. **Nada inline, nada hardcoded.** Cor, tamanho, raio, string, dado — tudo via token, CSS var, i18n, ou constante.
3. **Multi-tenant primeiro.** Tudo que o profissional personaliza vem de CSS vars + data attributes. Se esta fixo e deveria ser dinamico, esta errado.
4. **Mobile-first e estrutura, nao breakpoint.** Bottom sheet, touch targets 44px, safe areas, scroll horizontal, sticky CTA. Desktop e expansao.
5. **Consistencia > perfeicao.** 100 telas medianas iguais > 99 medianas + 1 linda. Tokens + componentes + lint = consistencia gratis.
6. **UI nao pensa.** Componente renderiza, delega, exibe. Logica em lib/domain/. IO em lib/data/. Nunca no componente.

---

# PARTE 1 — Fundacao

## 1.1 Cores — OKLCH + APCA

### Por que OKLCH

- **Uniformidade perceptual**: mesma lightness em hues diferentes parece igualmente vibrante. HSL nao garante.
- **Derivacao programatica**: criar paleta inteira mudando 1 parametro (hue). Essencial pra multi-tenant.
- **Gamut P3**: mapeia pra displays wide-gamut modernos.
- **CSS Color Level 4**: spec oficial, browsers 100% suporte.

### Escalas primitivas (globals.css :root)

| Escala           | Hue        | Uso                         | Steps  |
| ---------------- | ---------- | --------------------------- | ------ |
| `--ob-brand-*`   | 175 (teal) | Identidade onboarding.bio   | 50-950 |
| `--ob-gray-*`    | 80 (warm)  | Neutros (bg, texto, bordas) | 50-950 |
| `--ob-success-*` | 145        | Feedback positivo           | 50-950 |
| `--ob-warning-*` | 75         | Alertas                     | 50-950 |
| `--ob-danger-*`  | 25         | Erros, acoes destrutivas    | 50-950 |
| `--ob-info-*`    | 235        | Informacao                  | 50-950 |

**Regra**: nunca usar primitivos em componentes. Usar camada semantica:

```
Primitivo (--ob-brand-500) → Semantico (--action-primary) → Tailwind (bg-primary)
```

### Camada semantica

```css
--surface-primary / --surface-secondary / --surface-elevated
--text-primary / --text-secondary / --text-muted
--border-default / --border-subtle
--action-primary / --action-primary-hover / --action-primary-dim
--status-success / --status-warning / --status-danger / --status-info
```

### Paletas do profissional (multi-tenant)

5 paletas + custom hex, via `data-palette`:

| Palette        | Dark      | Light (APCA-validada) |
| -------------- | --------- | --------------------- |
| lime (default) | `#c6ff6c` | `#65a30d`             |
| green          | `#4ade80` | `#16a34a`             |
| coral          | `#ff7a59` | (mesma)               |
| ocean          | `#38bdf8` | `#0ea5e9`             |
| amber          | `#fbbf24` | `#d97706`             |

### Contraste — APCA

| Contexto                     | Lc minimo |
| ---------------------------- | --------- |
| Texto body UI                | >= 60     |
| Texto pequeno (label, micro) | >= 75     |
| Decorativo                   | >= 30     |

Validacao: `lib/design/contrast.ts` com `apca-w3`.

### Cores semanticas via Tailwind

| Classe                                   | Mapeia para                   | Uso                  |
| ---------------------------------------- | ----------------------------- | -------------------- |
| `bg-background` / `text-foreground`      | `--brand-bg` / `--brand-text` | Base da pagina       |
| `bg-card` / `text-card-foreground`       | `--brand-bg-elevated`         | Superficies elevadas |
| `bg-muted` / `text-muted-foreground`     | sutil                         | Descricoes, captions |
| `bg-primary` / `text-primary-foreground` | `--palette-primary`           | CTAs, destaques      |
| `bg-destructive`                         | `#ef4444`                     | Erros, exclusao      |
| `border`                                 | `--brand-border`              | Bordas, separadores  |

**NUNCA** hex em componentes. Sempre via classe Tailwind ou CSS var.

---

## 1.2 Tipografia — componentes semanticos

### Regra: `<Heading>` e `<Text>`, nunca classes raw

```tsx
// ERRADO
<h2 className="text-xl font-semibold">Titulo</h2>
<p className="text-sm text-muted-foreground">Descricao</p>

// CERTO
<Heading level={2}>Titulo</Heading>
<Text variant="muted">Descricao</Text>
```

### `<Heading level={N}>` — tokens dinamicos

| Level   | Size | Line-height | Tracking | Uso           |
| ------- | ---- | ----------- | -------- | ------------- |
| display | 48px | 1.05        | -0.02em  | Hero, landing |
| 1       | 28px | 1.15        | -0.01em  | Page title    |
| 2       | 20px | 1.20        | -0.01em  | Section title |
| 3       | 16px | 1.30        | 0        | Subsection    |
| 4       | 16px | 1.30        | 0        | Card title    |
| 5       | 14px | snug        | —        | List header   |
| 6       | 12px | snug        | —        | Micro header  |

### `<Text variant="...">` — tokens semanticos

| Variant    | Size | Uso                                             |
| ---------- | ---- | ----------------------------------------------- |
| body-large | 16px | Texto principal, inputs                         |
| body       | 14px | Texto padrao                                    |
| body-small | 13px | Secundario compacto                             |
| label      | 11px | Kickers, metadata, timestamps                   |
| micro      | 10px | Fine print, badges                              |
| muted      | 14px | Descricoes sutis (body + text-muted-foreground) |
| mono       | 14px | Precos, IDs, metricas (tabular nums)            |

### Fontes

| Var                              | Uso                 |
| -------------------------------- | ------------------- |
| `--font-sans` (Geist, Inter)     | Body, UI            |
| `--font-mono` (Geist Mono)       | Precos, metricas    |
| `--font-display` (Geist, Barlow) | Headlines criativos |
| `--font-serif` (Libre, Georgia)  | Preset "classic"    |

Profissional escolhe via `data-typography`: modern, editorial, classic, bold.

### Hierarquia tipografica (quando Text/Heading nao se aplica)

| Token           | px  | Uso                  |
| --------------- | --- | -------------------- |
| text-micro-xs   | 9   | Decorativo em gauges |
| text-micro      | 10  | Fine print           |
| text-label      | 11  | Kickers, metadata    |
| text-body-small | 13  | Secundario           |
| text-body       | 14  | **Padrao**           |
| text-body-large | 16  | Principal, inputs    |

Pesos: `font-normal` (400), `font-medium` (500), `font-semibold` (600). **Apenas estes 3.**

---

## 1.3 Shape system — border-radius dinamico

Via `data-shape`. Dashboard usa `rounded` (default).

| Token            | Rounded | Sharp  | Soft   |
| ---------------- | ------- | ------ | ------ |
| `--shape-card`   | 14px    | 7px    | 22px   |
| `--shape-button` | 10px    | 5px    | 16px   |
| `--shape-input`  | 10px    | 5px    | 16px   |
| `--shape-badge`  | 4px     | 2px    | 8px    |
| `--shape-avatar` | 9999px  | 9999px | 9999px |

**Uso:** `rounded-[var(--shape-button)]` em Button/Input/Select/Textarea. `rounded-[var(--shape-card)]` em Card/Dialog/Sheet/Surface.

---

## 1.4 Density system — espacamento dinamico

Via `data-density`. Dashboard usa `cozy` (default).

| Token             | Tight | Cozy | Roomy |
| ----------------- | ----- | ---- | ----- |
| `--density-pad-y` | 8px   | 12px | 16px  |
| `--density-pad-x` | 12px  | 16px | 20px  |
| `--density-row-y` | 10px  | 14px | 18px  |
| `--density-gap`   | 8px   | 12px | 16px  |

### Espacamento fixo (quando density nao se aplica)

| Tailwind        | px     | Uso                    |
| --------------- | ------ | ---------------------- |
| gap-1           | 4      | Icone + texto          |
| gap-2           | 8      | Elementos relacionados |
| gap-3           | 12     | Lista densa            |
| **gap-4 / p-4** | **16** | **Padrao**             |
| gap-6           | 24     | Entre grupos           |
| gap-8           | 32     | Entre secoes           |
| gap-12          | 48     | Entre regioes          |

---

## 1.5 Surface system — multi-tenant isolado

| data-surface | Contexto                   | Accent vem de                   |
| ------------ | -------------------------- | ------------------------------- |
| `internal`   | Dashboard, settings, admin | `--ob-brand-500` (teal fixo)    |
| `public`     | Site, form, report do PT   | `--palette-primary` (cor do PT) |

**Toda pagina publica DEVE ter:**

```html
<div
  data-theme="dark"
  data-palette="lime"
  data-typography="modern"
  data-shape="rounded"
  data-density="cozy"
  data-surface="public"
></div>
```

Helper: `resolveDesignAttrs(designFromRow(professional))` em `lib/design/style-engine.ts`.

### 6 estilos curados

| Estilo  | Palette | Typography | Mode  | Shape   | Density |
| ------- | ------- | ---------- | ----- | ------- | ------- |
| Energia | lime    | modern     | dark  | rounded | cozy    |
| Clinico | ocean   | modern     | light | sharp   | tight   |
| Raiz    | green   | editorial  | dark  | soft    | roomy   |
| Revista | coral   | editorial  | light | rounded | cozy    |
| Noturno | amber   | bold       | dark  | sharp   | tight   |
| Impacto | coral   | bold       | dark  | soft    | cozy    |

---

## 1.6 Motion system

**Package:** `motion/react` (nunca `framer-motion` — bloqueado por ESLint).

| Token                | Valor | Uso              |
| -------------------- | ----- | ---------------- |
| `--motion-instant`   | 80ms  | Hover, focus     |
| `--motion-fast`      | 150ms | Tooltips         |
| `--motion-normal`    | 250ms | Modals, sheets   |
| `--motion-slow`      | 400ms | Page transitions |
| `--motion-celebrate` | 800ms | Celebracoes      |

| Easing          | Uso               |
| --------------- | ----------------- |
| `--ease-smooth` | Entrada suave     |
| `--ease-spring` | Bounce sutil      |
| `--ease-scene`  | Transicao de cena |
| `--ease-out`    | Saida padrao      |

### Microinteracoes (CSS — nao precisa de Motion pra isso)

```tsx
// Botao pressed (essencial pra parecer app)
className = 'active:scale-[0.98] transition-transform'

// Hover desktop
className = 'hover:bg-accent transition-colors'

// Card clicavel mobile
className = 'active:bg-accent/50 transition-colors'
```

### Quando usar Motion vs CSS

| CSS transitions       | Motion 12                       |
| --------------------- | ------------------------------- |
| Hover, focus, active  | Entrada/saida de elementos      |
| Color/opacity changes | Layout animations               |
| Simple transforms     | Gestos (drag, swipe)            |
| Accordions simples    | Sequences complexas             |
|                       | AnimatePresence (mount/unmount) |

**`prefers-reduced-motion`:** globals.css reduz todas animacoes a 0.01ms automaticamente.

---

## 1.7 Elevacao

| Token                  | Uso                 |
| ---------------------- | ------------------- |
| `--shadow-elevation-1` | Cards sutis, hover  |
| `--shadow-elevation-2` | Popovers, dropdowns |
| `--shadow-elevation-3` | Modais, sheets      |

**Mobile:** usar `--shadow-elevation-1` ou bordas. Nunca `shadow-lg+`. Sombra pesada parece web antiga.

---

## 1.8 Dark mode

**Dark-first.** `html[data-theme='dark']` e o default. Light mode suportado com overrides APCA-validados pra cada paleta.

---

# PARTE 2 — Componentes

## 2.1 Hierarquia shadcn-first

```
1. shadcn tem? → pnpm dlx shadcn@latest add [nome]. USE.
2. Nao tem? → Ja existe em components/ui/? → USE.
3. Nao existe? → Componha primitivos.
4. Reusavel em 2+ lugares? → Crie em components/ui/.
5. Especifico de 1 feature? → Crie em components/[feature]/.
6. NUNCA wrapper que duplica primitivo.
```

## 2.2 shadcn — componentes disponiveis (58)

### Primitivos instalados (~27)

accordion, alert-dialog, avatar, badge, breadcrumb, button, card, checkbox, dialog, dropdown-menu, form, input, label, popover, progress, radio-group, select, separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea, tooltip

### A instalar (~15)

| Componente      | Pra que                                                             |
| --------------- | ------------------------------------------------------------------- |
| **Item**        | Listas estilo app (avatar + titulo + descricao + chevron + actions) |
| **Empty**       | Empty states composiveis (icon + title + description + CTA)         |
| **Field**       | Forms padronizados (label + input + description + error)            |
| **Drawer**      | Bottom sheet mobile (Vaul)                                          |
| **Command**     | Cmd+K, command palette                                              |
| **Spinner**     | Loading de botoes                                                   |
| **Carousel**    | Scroll horizontal com snap (categorias iFood)                       |
| **Collapsible** | Secoes colapsaveis (settings Nubank)                                |
| **ScrollArea**  | Scroll customizado                                                  |
| **Pagination**  | Listas paginadas                                                    |
| **InputGroup**  | Input com icone/botao (search, slug)                                |
| **ButtonGroup** | Acoes agrupadas                                                     |
| **ToggleGroup** | Tabs inline / segmented control                                     |
| **Calendar**    | Date picker base                                                    |
| **Kbd**         | Keyboard shortcuts display                                          |
| **Chart**       | Recharts wrapper (dashboard)                                        |

### Patterns oficiais (nao componentes, mas documentados)

| Pattern             | Composicao                                         | Uso                                |
| ------------------- | -------------------------------------------------- | ---------------------------------- |
| `drawer-dialog`     | Dialog (desktop) + Drawer (mobile) + useMediaQuery | Edicao responsiva                  |
| `data-table-demo`   | Table + TanStack Table                             | Tabelas com filtros/sort/paginacao |
| `date-picker-demo`  | Calendar + Popover                                 | Selecao de data                    |
| `field-choice-card` | Field + RadioGroup em cards                        | Selecao tipo onboarding            |
| `item-group`        | Item + ItemSeparator em lista                      | Listas estilo settings             |
| `item-link`         | Item asChild com Link + ChevronRight               | Navegacao mobile                   |

### shadcn blocks (paginas inteiras)

| Block                       | Uso                                         |
| --------------------------- | ------------------------------------------- |
| `dashboard-01`              | Dashboard com sidebar + charts + data table |
| `sidebar-01` a `sidebar-16` | 16 variacoes de sidebar                     |
| `login-01` a `login-05`     | 5 variacoes de login                        |
| `chart-*` (50+)             | Area, Bar, Line, Pie, Radar, Radial         |

## 2.3 Nossos componentes (8 com valor real)

Estes NAO existem no shadcn e tem valor real pra multi-tenant:

| Componente                    | Imports | Justificativa                                          |
| ----------------------------- | ------- | ------------------------------------------------------ |
| `Heading`                     | 140     | Tokens tipograficos dinamicos — shadcn usa classes raw |
| `Text`                        | 48      | Semantica + tokens dinamicos                           |
| `CrudManager` / `useCrudList` | 10      | Abstracao CRUD de dominio                              |
| `DeleteConfirmation`          | 5       | AlertDialog + countdown + i18n                         |
| `CopyButton`                  | 2       | Clipboard + feedback acessivel                         |
| `upload-dropzone`             | 2       | Upload com preview                                     |
| `SectionErrorBoundary`        | 2       | Error boundary reutilizavel                            |
| `Walkthrough`                 | 1       | Tour/stepper guiado                                    |

## 2.4 Componentes semanticos obrigatorios

| Em vez de       | Usar                                 | Enforcement  |
| --------------- | ------------------------------------ | ------------ |
| `<h1>` a `<h6>` | `<Heading level={N}>`                | ESLint error |
| `<button>`      | `<Button>` ou `<Button size="icon">` | ESLint error |
| `<input>`       | `<Input>`                            | ESLint error |
| `<textarea>`    | `<Textarea>`                         | ESLint error |
| `<select>`      | `<Select>`                           | ESLint error |
| `<table>`       | `<Table>`                            | ESLint error |
| `<dialog>`      | `<Dialog>`                           | ESLint error |
| `<label>`       | `<Label>`                            | ESLint error |
| `<img>`         | `<Image>` (next/image)               | ESLint error |
| Lista de items  | `<Item>` (shadcn)                    | Code review  |
| Estado vazio    | `<Empty>` (shadcn)                   | Code review  |
| Form field      | `<Field>` (shadcn)                   | Code review  |
| Bottom sheet    | `<Drawer>` (shadcn/Vaul)             | Code review  |
| Loading botao   | `<Spinner>` (shadcn)                 | Code review  |

---

# PARTE 3 — Mobile app-like

## 3.1 Densidade de informacao — iFood/Nubank/Magalu

Apps brasileiros de referencia usam o mesmo template:

1. **Sticky header fino** com search ou contexto (avatar + saudacao)
2. **Categorias em scroll horizontal** com snap — shadcn `Carousel` (dragFree)
3. **Bandas verticais** separadas por whitespace (`space-y-6`), nunca por linhas
4. **Hierarquia visual em 3 niveis max** (page title → section title → item)
5. **"One card, one decision"** — sem cards com 4+ acoes
6. **Progressive disclosure**: "Ver todos" em listas, accordion em forms longos
7. **CTAs primarios full-width** sticky no fundo
8. **Headers de secao**: titulo + "Ver todos" (`flex justify-between items-baseline`)

## 3.2 Card vs Lista plana — regra clara

**Lista plana (divide-y) e o padrao.** Card so quando:

- Item e navegavel (clica e vai pra outra tela)
- Conteudo heterogeneo no contexto
- Multiplos elementos percebidos como unidade clicavel

**Anti-padroes:**

- Cards aninhados dentro de cards
- Card com 3+ acoes competindo
- `shadow-lg` em mobile
- Misturar cards com sombra E cards com borda na mesma tela

## 3.3 Listas como app — shadcn Item

```tsx
<ItemGroup>
  <Item asChild>
    <Link href={`/leads/${lead.id}`}>
      <ItemMedia>
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>{lead.name}</ItemTitle>
        <ItemDescription>
          {lead.modality} · {timeAgo}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant={statusVariant}>{status}</Badge>
        <ChevronRightIcon />
      </ItemActions>
    </Link>
  </Item>
  <ItemSeparator />
</ItemGroup>
```

## 3.4 Bottom sheet > modal central

**Drawer** (Vaul, shadcn) em mobile. Dialog so desktop + confirmacao simples.

- Polegar alcanca fundo mais facil
- Padrao nativo iOS/Android (familiaridade)
- Permite ver contexto atras
- Dismissable por gesto

Pattern responsivo:

```tsx
const isDesktop = useMediaQuery('(min-width: 768px)')
if (isDesktop) return <Dialog>...</Dialog>
return <Drawer>...</Drawer>
```

## 3.5 Categorias scroll horizontal — Carousel

```tsx
<Carousel opts={{ align: 'start', dragFree: true }}>
  <CarouselContent className="-ml-2">
    {modalities.map((mod) => (
      <CarouselItem key={mod} className="basis-auto pl-2">
        <Button variant={active === mod ? 'default' : 'outline'} size="sm">
          {mod}
        </Button>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>
```

## 3.6 Settings como app — Collapsible + Item

```tsx
<Collapsible defaultOpen>
  <CollapsibleTrigger asChild>
    <Item>
      <ItemTitle>Informacoes pessoais</ItemTitle>
      <ChevronDown />
    </Item>
  </CollapsibleTrigger>
  <CollapsibleContent>
    <Item asChild>
      <Link href="/settings/profile">
        <ItemMedia>
          <User />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Perfil</ItemTitle>
        </ItemContent>
        <ItemActions>
          <ChevronRight />
        </ItemActions>
      </Link>
    </Item>
  </CollapsibleContent>
</Collapsible>
```

## 3.7 Feedback — sem isso parece site

| Estado             | Componente                     | Padrao                                              |
| ------------------ | ------------------------------ | --------------------------------------------------- |
| Loading tela       | `<Skeleton>` replicando layout | loading.tsx obrigatorio                             |
| Loading botao      | `<Spinner>` + label muda       | `<Button disabled><Spinner /> Salvando...</Button>` |
| Empty (nunca tive) | `<Empty>` com CTA forte        | "Voce ainda nao tem X. [Criar primeiro]"            |
| Empty (filtrado)   | `<Empty>` com "Limpar filtros" | "Nenhum resultado pra 'X'"                          |
| Error              | Mensagem + "Tentar novamente"  | error.tsx obrigatorio                               |
| Success acao       | `toast.success()` (Sonner)     | Top-center, 3s, com undo se aplicavel               |
| Loading otimista   | UI atualiza antes da resposta  | useOptimistic pra status change                     |

**Diferenciar os dois empties:**

- Nunca tive: "Voce ainda nao tem leads. [Compartilhar formulario]"
- Filtrado: "Nenhum resultado pra 'musculacao'. [Limpar filtros]"

## 3.8 Inputs e forms

- ✅ `text-base` (>=16px) — evita zoom iOS Safari (globals.css ja forca)
- ✅ `inputMode` correto: `numeric`, `email`, `tel`, `decimal`, `search`
- ✅ `autoComplete`: `name`, `email`, `tel`, `street-address`
- ✅ `autoFocus` no primeiro campo
- ✅ Validacao inline (Zod via react-hook-form)
- ✅ Labels acima dos inputs (nunca placeholder como label)
- ✅ Touch targets >=44x44px
- ✅ Single column em mobile (NUNCA 2 colunas)
- ✅ Inputs >=48px altura (`h-12`)
- ✅ Sticky submit no fundo (`pb-safe`)
- ✅ `useUnsavedChanges` pra beforeunload warning
- ✅ `showCount` em textareas (bio, descricoes)
- ❌ NUNCA `placeholder="Digite aqui..."` — placeholder mostra exemplo, nao instrucao

## 3.9 Estrutura por tipo de tela

### Listagem

```
1. Sticky header (<Heading level={1}> + acao primaria a direita)
2. Search (InputGroup com icone) + filtros (Carousel chips snap)
3. Lista (ItemGroup mobile + DataTable desktop)
4. Paginacao (Pagination) ou infinite scroll
5. <Empty> se vazio
6. pb-nav pra compensar bottom nav
```

Densidade: 64-80px altura por item.

### Detalhe

```
1. <Breadcrumb> (Dashboard → Secao → Nome)
2. Header com voltar + titulo + menu (DropdownMenu)
3. Hero (info principal, numero grande)
4. <Tabs> se <=4 grupos paralelos, secoes se >=5
5. Sticky CTA no fundo (mobile)
```

### Formulario

```
1. Header com voltar + titulo
2. Single column (NUNCA 2 colunas mobile)
3. <Field> com label acima, validacao inline (Zod + RHF)
4. Inputs h-12, font >=16px, inputMode correto
5. autoFocus no primeiro campo
6. Sticky submit full-width (pb-safe)
7. useUnsavedChanges (beforeunload)
```

### Dashboard / Home

```
1. Header com avatar + saudacao
2. Hero card com KPI grande (Heading display ou level={1})
3. Grid 2-4 atalhos rapidos (icone + label)
4. Secoes com SectionHeader (titulo + "Ver todos")
5. Lista de atividade recente (3-5 items via Item)
```

### Perfil / Conta / Settings

```
1. Header com avatar grande + nome + email
2. Secoes com Collapsible (mobile) ou sidebar (desktop)
3. Items navegaveis (Item + ChevronRight)
4. "Sair" em text-destructive no final
```

NUNCA cards em settings. Item list e o padrao universal (iFood, Nubank, Uber).

### Busca

```
1. Search bar com autoFocus ao entrar
2. Historico recente em chips (Carousel)
3. Sugestoes populares
4. Resultados conforme digita (debounce 300ms)
5. Empty ("Nenhum resultado pra X")
```

## 3.10 PWA foundation

1. **manifest.ts** — standalone, icons 192/512/maskable, start_url=/dashboard
2. **Meta tags** — viewport-fit=cover, apple-mobile-web-app-capable
3. **Shell** — route groups com DashboardLayout (SidebarNav desktop + MobileNav bottom pill)
4. **Inputs >=16px** — globals.css forca automaticamente
5. **Touch targets >=44px** — touch-target class
6. **100dvh** — min-h-dvh em vez de min-h-screen
7. **Safe areas** — safe-pb, safe-pt classes
8. **Skeleton + Empty + Sonner** — em todas listas e acoes
9. **active:scale-[0.98]** — em botoes/cards clicaveis
10. **overscroll-behavior: none** — globals.css

## 3.11 Navegacao — route groups (nao MobileShell)

O projeto usa route groups com layouts proprios:

| Route Group        | Layout          | Nav                                                        |
| ------------------ | --------------- | ---------------------------------------------------------- |
| `(auth)`           | Sem shell       | —                                                          |
| `(app)/onboarding` | Header minimo   | —                                                          |
| `(app)/(shell)`    | DashboardLayout | SidebarNav (desktop) + MobileNav (bottom pill) + DrawerNav |
| `(public)`         | Brand do PT     | —                                                          |
| `(client)`         | Layout enxuto   | —                                                          |

Bottom nav: `<BottomTabBar>` pill flutuante, 4 items (Dashboard, Leads, Formularios, Menu).
Compensacao: `pb-nav` em listas.

---

# PARTE 4 — Travar o futuro

5 mecanismos trabalhando juntos. Cada um sozinho e fraco; juntos, cerca eletrica.

## 4.1 ESLint como barreira

17 selectors `no-restricted-syntax` bloqueiam: `<button>`, `<input>`, `<textarea>`, `<select>`, `<table>`, `<dialog>`, `<label>`, `<img>`, `<h1-h6>`, `<motion.button>`, hex/rgb/hsl/oklch em style, document.getElementById/querySelector/querySelectorAll.

Imports bloqueados: framer-motion, next/router, next/document, next/head, createClient direto, vitest em prod, app/ em lib/.

Plugins: `simple-import-sort` (ordem), `unused-imports` (auto-remove), `better-tailwindcss` (no arbitrary), `jsx-a11y` (25 rules strict), `jsx-no-literals` (i18n).

Detalhes completos: `03-estrategias-lint.md`.

## 4.2 Husky + lint-staged + commitlint

**Pre-commit:** eslint --fix + prettier --write + tsc --noEmit
**Commit-msg:** Conventional Commits (feat/fix/chore/docs/refactor/test)
**Pre-push:** vitest + tsc --noEmit + knip

Impossivel commitar com lint/type error. Impossivel pushar com testes falhando ou codigo morto.

## 4.3 i18n obrigatorio

Toda string visivel via `t()` de next-intl. `react/jsx-no-literals` como error. Strings em `messages/pt-BR.json`.

```tsx
// Server: const t = await getTranslations('namespace')
// Client: const t = useTranslations('namespace')
// Action: const t = await getTranslations('actions')
```

## 4.4 Paginas de referencia reais

Em vez de `/app/_reference/` (nao existe), usar paginas reais como modelo:

| Tipo         | Referencia                   | Patterns usados                                      |
| ------------ | ---------------------------- | ---------------------------------------------------- |
| Listagem     | `/leads`                     | ItemGroup mobile + table desktop, filtros, paginacao |
| Detalhe      | `/leads/[id]`                | Breadcrumb, tabs, metadata dinamica                  |
| Dashboard    | `/dashboard`                 | Stats tocaveis, chart, funnel                        |
| Form wizard  | `/onboarding`                | 23 steps, persistencia, checkout                     |
| Settings     | `/settings/profile`          | Collapsible, useUnsavedChanges                       |
| CRUD         | `/site`                      | CrudManager, ResponsiveDrawer                        |
| Form publico | `/[slug]/analise/[modality]` | LeadForm, branch logic, brand PT                     |

**Workflow de tela nova:**

1. Identificar tipo (list/detail/form/dashboard/settings)
2. Abrir referencia real
3. Copiar estrutura
4. Adaptar dados e logica
5. NAO mudar espacamentos/hierarquia/componentes
6. Rodar lint + build

## 4.5 Checklist no PR

Pra cada tela nova:

```
[ ] Tipo identificado e referencia consultada
[ ] shadcn componentes usados (zero HTML raw)
[ ] <Heading> e <Text> (zero classes tipograficas raw)
[ ] Strings via t() (zero hardcoded)
[ ] Data attributes (se pagina publica)
[ ] generateMetadata (se conteudo dinamico)
[ ] loading.tsx + error.tsx
[ ] Empty em listas
[ ] pb-nav se dentro do shell
[ ] Mobile 375px testado
[ ] Touch targets 44px+
[ ] Inputs 16px+ / inputMode correto
[ ] Zero hex/rgb/hsl/oklch inline
[ ] Zero valores arbitrarios Tailwind
[ ] Max 300 linhas
[ ] tsc + lint + build passam
```

---

# PARTE 5 — Arrumar o legado

## 5.1 Estrategia: Strangler Pattern

Nao reescrever tudo de uma vez. Padrao novo coexiste com legado. Migrar em lotes controlados.

## 5.2 Auditoria automatizada

Prompt pro Claude Code:

```
Analise todas as paginas em /app.
Crie docs/refatoracao-2026-05/AUDIT.md com:

## Tabela de paginas
| Rota | Tipo | shadcn usados | Custom que duplica shadcn | Padrao edicao | Bagunca (1-5) |

## Lotes sugeridos
Agrupe em lotes de 5-10, ordem otima:
- Lote 1: top trafego ou top bagunca
- Lotes seguintes: por tipo

## Top 10 reimplementacoes
Componentes custom que duplicam shadcn. Sugerir substituto.

## Top 10 anti-padroes
Valores arbitrarios, hex inline, shadow-lg mobile, raw HTML, etc.
```

## 5.3 Migracao em lotes

Branch por lote:

```bash
git checkout -b refactor/lote-N
```

Prompt padronizado:

```
Refatore [X, Y, Z] seguindo:
1. shadcn components exclusivamente (Item, Empty, Field, etc)
2. <Heading> e <Text> pra tipografia
3. Strings via t()
4. Tokens CSS vars (shape, density, palette) — zero hardcoded
5. Data attributes em paginas publicas
6. Nao alterar logica de negocio
7. Rodar tsc + lint + build antes de declarar pronto
```

Ritmo: 1 sessao 1-2h por lote, 2-3 lotes/semana.

## 5.4 Limpeza pos-migracao

```bash
pnpm knip                    # dead code
pnpm lint                    # zero warnings
pnpm exec tsc --noEmit       # zero erros
pnpm build                   # passa
```

Deletar componentes com 0 imports. Deletar stories orfas.

## 5.5 Revisao semanal (30 min sexta)

- `pnpm knip` — codigo morto novo
- `pnpm lint` — regressoes
- 3 paginas aleatorias comparadas com referencia
- Atualizar docs se padrao novo emergiu

---

# ANEXO — Stack de decisoes rapidas

| Duvida                 | Decisao                                                            |
| ---------------------- | ------------------------------------------------------------------ |
| Card ou lista?         | Lista (divide-y) padrao; card so se navegavel                      |
| Sheet ou Dialog?       | Drawer mobile; Sheet desktop; Dialog so confirmacao                |
| Modal central?         | Nunca mobile. Desktop so confirmacao                               |
| Pagina ou Sheet?       | Sheet padrao; pagina so com subnavegacao                           |
| Tabs ou secoes?        | Tabs <=4 paralelo; secoes >=5 hierarquico                          |
| Inline ou menu?        | Inline <=2 acoes; DropdownMenu >=3                                 |
| CSS ou Motion?         | CSS pra hover/focus/active; Motion pra entrada/saida/layout/gestos |
| Skeleton ou Spinner?   | Skeleton tela cheia; Spinner acao pontual                          |
| 1 ou 2 colunas?        | 1 sempre mobile; 2 so desktop quando faz sentido                   |
| Server ou Client?      | Server padrao; 'use client' so com state/effects/handlers          |
| Sidebar ou Bottom Nav? | Bottom Nav mobile; Sidebar desktop                                 |

---

# ANEXO — Recursos visuais

| Recurso                                  | Uso                                          |
| ---------------------------------------- | -------------------------------------------- |
| **Mobbin** (mobbin.com)                  | Apps reais por padrao (onboarding, checkout) |
| **Screenlane** (screenlane.com)          | Screenshots categorizados, gratis            |
| **shadcn blocks** (ui.shadcn.com/blocks) | Paginas inteiras copy-paste                  |
| **lucide.dev**                           | Buscar icones                                |
| **realtimecolors.com**                   | Paleta + tipografia                          |

---

# Resumo em uma frase

shadcn-first + OKLCH tokens + `<Heading>`/`<Text>` semanticos + shape/density/surface dinamicos + Item/Empty/Field/Drawer/Carousel mobile + ESLint 17 selectors + Husky 3 hooks + i18n obrigatorio = design system multi-tenant app-like que se auto-policia e escala pra N profissionais sem inconsistencia.
