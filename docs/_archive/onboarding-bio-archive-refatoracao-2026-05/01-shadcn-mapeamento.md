# Mapeamento shadcn/ui — onboarding.bio

> **Objetivo:** projeto 100% shadcn, 100% personalizavel, zero inline, mobile-first app-like.
> **Criado:** 2026-05-01
> **Contexto:** pesquisa completa do registry @shadcn (405 itens: 58 UI, 16 blocks, ~200 examples, 5 themes, hooks, lib).

---

## 1. Inventario completo do shadcn/ui

### 1.1 Componentes UI disponíveis (58)

| Componente        | Temos?       | Status no projeto                                 | Acao                                                                   |
| ----------------- | ------------ | ------------------------------------------------- | ---------------------------------------------------------------------- |
| `accordion`       | Sim          | Instalado                                         | Manter                                                                 |
| `alert`           | Nao          | —                                                 | Instalar (feedback inline)                                             |
| `alert-dialog`    | Sim          | Instalado, usado                                  | Manter                                                                 |
| `aspect-ratio`    | Nao          | —                                                 | Instalar (imagens responsivas)                                         |
| `avatar`          | Sim          | Instalado, usado                                  | Manter                                                                 |
| `badge`           | Sim          | Instalado, usado                                  | Manter                                                                 |
| `breadcrumb`      | Sim          | Instalado, usado                                  | **Verificar se e o oficial ou custom**                                 |
| `button`          | Sim          | Instalado, usado (size="icon" = nosso IconButton) | Manter — **deletar IconButton, usar size="icon"**                      |
| `button-group`    | Nao          | —                                                 | Instalar (acoes agrupadas)                                             |
| `calendar`        | Nao          | —                                                 | Instalar (date picker base)                                            |
| `card`            | Sim          | Instalado, usado                                  | Manter                                                                 |
| `carousel`        | Nao          | —                                                 | Instalar (scroll horizontal mobile — estilo iFood categorias)          |
| `chart`           | Nao          | —                                                 | Instalar (Recharts wrapper — dashboard)                                |
| `checkbox`        | Sim          | Instalado, usado                                  | Manter                                                                 |
| `collapsible`     | Nao          | —                                                 | Instalar (MobileCollapsible pode usar)                                 |
| `combobox`        | Custom morto | 0 imports                                         | **Deletar custom, instalar shadcn**                                    |
| `command`         | Custom morto | 0 imports (command-palette)                       | **Deletar custom, instalar shadcn (Cmd+K)**                            |
| `context-menu`    | Nao          | —                                                 | Avaliar (long-press mobile)                                            |
| `dialog`          | Sim          | Instalado, usado                                  | Manter                                                                 |
| `drawer`          | Nao          | —                                                 | **Instalar (Vaul — bottom sheet mobile, substitui responsive-drawer)** |
| `dropdown-menu`   | Sim          | Instalado, usado                                  | Manter                                                                 |
| `empty`           | Custom       | 3 imports (empty-state)                           | **Deletar custom, instalar shadcn Empty**                              |
| `field`           | Nao          | Custom morto (form-section, form-actions)         | **Deletar customs mortos, instalar shadcn Field**                      |
| `form`            | Sim          | Instalado, usado (RHF)                            | Manter                                                                 |
| `hover-card`      | Nao          | —                                                 | Avaliar (preview on hover desktop)                                     |
| `input`           | Sim          | Instalado, usado                                  | Manter                                                                 |
| `input-group`     | Nao          | —                                                 | Instalar (input com icone/botao — search, WhatsApp, slug)              |
| `input-otp`       | Nao          | —                                                 | Avaliar (verificacao email?)                                           |
| `item`            | Nao          | Custom morto (list-item)                          | **Deletar custom, instalar shadcn Item**                               |
| `kbd`             | Custom morto | 0 imports                                         | **Deletar custom, instalar shadcn**                                    |
| `label`           | Sim          | Instalado, usado                                  | Manter                                                                 |
| `menubar`         | Nao          | —                                                 | Nao necessario                                                         |
| `native-select`   | Nao          | —                                                 | Avaliar (mobile performance)                                           |
| `navigation-menu` | Nao          | —                                                 | Avaliar (landing premium nav)                                          |
| `pagination`      | Nao          | —                                                 | Instalar (listas paginadas)                                            |
| `popover`         | Sim          | Instalado, usado                                  | Manter                                                                 |
| `progress`        | Sim          | Instalado                                         | Manter                                                                 |
| `radio-group`     | Sim          | Instalado, usado                                  | Manter                                                                 |
| `resizable`       | Nao          | —                                                 | Avaliar (split view editor)                                            |
| `scroll-area`     | Nao          | —                                                 | Instalar (listas com scroll customizado)                               |
| `select`          | Sim          | Instalado, usado                                  | Manter                                                                 |
| `separator`       | Sim          | Instalado, usado                                  | Manter                                                                 |
| `sheet`           | Sim          | Instalado, usado                                  | Manter                                                                 |
| `sidebar`         | Nao          | Custom (SidebarNav)                               | **Avaliar migrar pra shadcn Sidebar**                                  |
| `skeleton`        | Sim          | Instalado, usado                                  | Manter                                                                 |
| `slider`          | Sim          | Instalado                                         | Manter                                                                 |
| `sonner`          | Sim          | Instalado, usado (toasts)                         | Manter                                                                 |
| `spinner`         | Nao          | —                                                 | **Instalar (loading de botoes — substitui nossos spinners inline)**    |
| `switch`          | Sim          | Instalado, usado                                  | Manter                                                                 |
| `table`           | Sim          | Instalado, usado                                  | Manter                                                                 |
| `tabs`            | Sim          | Instalado, usado                                  | Manter                                                                 |
| `textarea`        | Sim          | Instalado, usado                                  | Manter                                                                 |
| `toggle`          | Nao          | —                                                 | Instalar                                                               |
| `toggle-group`    | Nao          | —                                                 | **Instalar (substitui segmented-control morto)**                       |
| `tooltip`         | Sim          | Instalado, usado                                  | Manter                                                                 |
| `direction`       | Nao          | —                                                 | Nao necessario (sem RTL)                                               |
| `native-select`   | Nao          | —                                                 | Avaliar                                                                |

### 1.2 Blocks disponiveis (16 + charts)

| Block                       | Descricao                                    | Relevancia                           |
| --------------------------- | -------------------------------------------- | ------------------------------------ |
| `dashboard-01`              | Dashboard com sidebar, charts, data table    | **Alta — referencia pro dashboard**  |
| `sidebar-01` a `sidebar-16` | 16 variacoes de sidebar                      | **Alta — avaliar migrar SidebarNav** |
| `login-01` a `login-05`     | 5 variacoes de login                         | Media — ja temos auth                |
| `signup-01` a `signup-05`   | 5 variacoes de signup                        | Media — ja temos auth                |
| `chart-*` (50+)             | Area, Bar, Line, Pie, Radar, Radial, Tooltip | **Alta — dashboard charts**          |

### 1.3 Examples/Patterns relevantes

| Pattern                  | Componentes                                        | Uso no projeto                           |
| ------------------------ | -------------------------------------------------- | ---------------------------------------- |
| `drawer-dialog`          | Dialog (desktop) + Drawer (mobile) + useMediaQuery | **Substitui responsive-drawer**          |
| `data-table-demo`        | Table + TanStack Table                             | **Substitui data-table custom morto**    |
| `date-picker-demo`       | Calendar + Popover                                 | **Substitui date-picker custom morto**   |
| `date-picker-with-range` | Calendar + Popover + range                         | **Substitui date-range-picker morto**    |
| `field-choice-card`      | Field + RadioGroup em cards                        | **Substitui selection-card (9 imports)** |
| `item-group`             | Item com Avatar, separator, actions                | **Pattern pra listas estilo app**        |
| `item-link`              | Item com chevron como link navegavel               | **Pattern pra settings/menus mobile**    |
| `item-dropdown`          | Item dentro de DropdownMenu                        | **Pattern pra selecao com preview**      |
| `combobox-responsive`    | Combobox (desktop) + Drawer (mobile)               | **Pattern multi-device**                 |
| `skeleton-card`          | Skeleton composto inline                           | **Pattern pra loading states**           |
| `spinner-button`         | Button + Spinner                                   | **Pattern pra submit loading**           |
| `empty-*` (7 variacoes)  | Empty com icon/avatar/input/outline                | **Patterns pra empty states**            |

### 1.4 Hooks e utils

| Item         | Descricao                  | Relevancia                                          |
| ------------ | -------------------------- | --------------------------------------------------- |
| `use-mobile` | Hook de media query mobile | **Alta — substitui nosso useMediaQuery se existir** |
| `utils` (cn) | Class merge utility        | Ja temos                                            |

---

## 2. Analise dos 12 componentes "nossos com valor real"

### Veredicto final: shadcn tem ou nao?

| Componente nosso       | Imports | shadcn tem?                                                            | Veredicto                                                  |
| ---------------------- | ------- | ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| `Heading`              | 140     | **Nao.** shadcn typography usa classes raw (`text-4xl font-extrabold`) | **MANTER** — pilar do DS multi-tenant, tokens dinamicos    |
| `Text`                 | 48      | **Nao.** shadcn nao tem componente de texto semantico                  | **MANTER** — pilar do DS multi-tenant, tokens dinamicos    |
| `IconButton`           | 42      | **Sim.** `Button size="icon"` faz o mesmo                              | **DELETAR** — migrar 42 imports pra `<Button size="icon">` |
| `CrudManager`          | 10      | **Nao.** shadcn nao tem CRUD pattern                                   | **MANTER** — abstracoo de dominio unica                    |
| `SelectionCard`        | 9       | **Sim.** `field-choice-card` (Field + RadioGroup)                      | **DELETAR** — migrar 9 imports pra pattern shadcn          |
| `DeleteConfirmation`   | 5       | **Parcial.** `AlertDialog` e a base, mas nosso tem countdown           | **MANTER como wrapper fino do AlertDialog**                |
| `FormModal`            | 2       | **Parcial.** `Dialog` + `Form` compostos                               | **AVALIAR** — se for so composicao, deletar                |
| `CopyButton`           | 2       | **Nao.** shadcn nao tem clipboard                                      | **MANTER**                                                 |
| `upload-dropzone`      | 2       | **Nao.** shadcn nao tem upload                                         | **MANTER**                                                 |
| `SectionErrorBoundary` | 2       | **Nao.** shadcn nao tem error boundary                                 | **MANTER**                                                 |
| `KeyboardShortcuts`    | 2       | **Sim.** `Command` + `CommandDialog` faz Cmd+K                         | **DELETAR** — migrar pra shadcn Command                    |
| `Walkthrough`          | 1       | **Nao.** shadcn nao tem tour/stepper                                   | **MANTER**                                                 |

### Resultado final

| Decisao                                  | Componentes                                                                                                    | Qtd |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --- |
| **MANTER (shadcn nao tem + valor real)** | Heading, Text, CrudManager, DeleteConfirmation, CopyButton, upload-dropzone, SectionErrorBoundary, Walkthrough | 8   |
| **DELETAR (shadcn ja tem)**              | IconButton→Button size="icon", SelectionCard→field-choice-card, KeyboardShortcuts→Command                      | 3   |
| **AVALIAR**                              | FormModal (composicao Dialog+Form)                                                                             | 1   |

---

## 3. Componentes shadcn a instalar (priorizado)

### Prioridade 1 — Substitui codigo morto + padroniza

| Componente     | Substitui                                 | Impacto                              |
| -------------- | ----------------------------------------- | ------------------------------------ |
| `empty`        | empty-state custom (3 imports)            | Empty states padronizados            |
| `item`         | list-item custom morto                    | **Listas estilo app (iFood/Nubank)** |
| `field`        | form-section + form-actions mortos        | Forms padronizados                   |
| `drawer`       | responsive-drawer custom (4 imports)      | **Bottom sheet mobile (app-like)**   |
| `command`      | command-palette morto + KeyboardShortcuts | Cmd+K padronizado                    |
| `kbd`          | kbd custom morto                          | Keyboard shortcuts display           |
| `combobox`     | combobox custom morto                     | Select com busca                     |
| `spinner`      | spinners inline                           | Loading de botoes                    |
| `toggle-group` | segmented-control morto                   | Tabs inline                          |

### Prioridade 2 — Mobile app-like (iFood/Nubank patterns)

| Componente     | Pra que                    | Pattern mobile                        |
| -------------- | -------------------------- | ------------------------------------- |
| `carousel`     | Scroll horizontal com snap | **Categorias/modalidades como iFood** |
| `scroll-area`  | Scroll customizado         | **Listas dentro de containers**       |
| `collapsible`  | Secoes colapsaveis         | **Settings mobile, FAQs**             |
| `pagination`   | Listas paginadas           | **Leads, templates**                  |
| `input-group`  | Input com icone/botao      | **Search bars, slug input, WhatsApp** |
| `button-group` | Acoes agrupadas            | **Action bars**                       |
| `chart`        | Recharts wrapper           | **Dashboard stats**                   |
| `calendar`     | Date picker base           | **Follow-up, agenda futura**          |

### Prioridade 3 — Nice to have

| Componente        | Pra que                    |
| ----------------- | -------------------------- |
| `alert`           | Feedback inline (banners)  |
| `aspect-ratio`    | Imagens responsivas        |
| `hover-card`      | Preview on hover (desktop) |
| `navigation-menu` | Landing premium nav        |
| `toggle`          | Toggle individual          |
| `context-menu`    | Long-press mobile (futuro) |

---

## 4. Mobile app-like — patterns com shadcn

### 4.1 Listas como app (iFood/Nubank) — shadcn `Item`

Em vez de `<table>` ou `<div>` raw, usar `Item` composavel:

```tsx
// Pattern: lista de leads estilo app
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

### 4.2 Categorias scroll horizontal (iFood) — shadcn `Carousel`

```tsx
// Pattern: modalidades como chips scrollaveis
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

### 4.3 Bottom sheet (app nativo) — shadcn `Drawer`

```tsx
// Pattern: edicao mobile = drawer de baixo, desktop = dialog
const isDesktop = useMediaQuery('(min-width: 768px)')

if (isDesktop) return <Dialog>...</Dialog>
return <Drawer>...</Drawer>
```

### 4.4 Settings como app (Nubank) — shadcn `Item` + `Collapsible`

```tsx
// Pattern: settings list estilo app
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
    ...
  </CollapsibleContent>
</Collapsible>
```

### 4.5 Empty states ricos — shadcn `Empty`

```tsx
// Pattern: lista vazia com CTA
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Users />
    </EmptyMedia>
    <EmptyTitle>{t('leads.empty.title')}</EmptyTitle>
    <EmptyDescription>{t('leads.empty.description')}</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>{t('leads.empty.cta')}</Button>
  </EmptyContent>
</Empty>
```

### 4.6 Forms com Field — shadcn `Field`

```tsx
// Pattern: form padronizado com label, descricao, validacao
<FieldGroup>
  <Field>
    <FieldLabel htmlFor="name">{t('form.name')}</FieldLabel>
    <Input id="name" {...register('name')} />
    <FieldDescription>{t('form.name.help')}</FieldDescription>
  </Field>
  <Field>
    <FieldLabel htmlFor="bio">{t('form.bio')}</FieldLabel>
    <Textarea id="bio" {...register('bio')} showCount maxLength={500} />
  </Field>
</FieldGroup>
```

### 4.7 Loading com Spinner — shadcn `Spinner`

```tsx
// Pattern: botao com loading state
<Button disabled={isPending}>
  {isPending && <Spinner />}
  {isPending ? t('saving') : t('save')}
</Button>
```

### 4.8 Dashboard charts — shadcn `Chart`

shadcn tem 50+ blocks de charts (area, bar, line, pie, radar, radial) com Recharts pre-configurado e tema integrado.

---

## 5. Componentes mortos a deletar (24)

| Arquivo                       | Motivo                                         |
| ----------------------------- | ---------------------------------------------- |
| `async-action-button.tsx`     | 0 imports, sem caso de uso                     |
| `bottom-tab-bar.tsx`          | 0 imports, substituido por MobileNav real      |
| `checkbox-group.tsx`          | 0 imports, compor Checkbox + Field             |
| `combobox.tsx`                | 0 imports, instalar shadcn Combobox            |
| `command-palette.tsx`         | 0 imports, instalar shadcn Command             |
| `danger-action.tsx`           | 0 imports, substituido por DeleteConfirmation  |
| `data-table.tsx`              | 0 imports, instalar pattern data-table-demo    |
| `date-picker.tsx`             | 0 imports, instalar Calendar + Popover pattern |
| `date-range-picker.tsx`       | 0 imports, idem com range                      |
| `drawer-with-dirty-check.tsx` | 0 imports, useUnsavedChanges no form           |
| `file-upload.tsx`             | 0 imports, upload-dropzone e o real            |
| `floating-action-button.tsx`  | 1 import, Button + className fixed             |
| `form-actions.tsx`            | 0 imports, instalar shadcn Field               |
| `form-section.tsx`            | 0 imports, instalar shadcn Field               |
| `icon-button.tsx`             | 42 imports, **Button size="icon" faz o mesmo** |
| `kbd.tsx`                     | 0 imports, instalar shadcn Kbd                 |
| `link-button.tsx`             | 4 imports, Button asChild + Link               |
| `list-item.tsx`               | 0 imports, instalar shadcn Item                |
| `mobile-list.tsx`             | 0 imports                                      |
| `mobile-top-bar.tsx`          | 0 imports                                      |
| `notification-banner.tsx`     | 0 imports                                      |
| `optimized-image.tsx`         | 0 imports, next/image direto                   |
| `segmented-control.tsx`       | 0 imports, instalar ToggleGroup                |
| `skeleton-variants.tsx`       | 0 imports, compor Skeleton inline              |
| `status.tsx`                  | 3 imports, Badge com variant                   |
| `surface.tsx`                 | 0 imports                                      |
| `sticky-action-bar.tsx`       | 0 imports                                      |

**Nota:** `icon-button.tsx` tem 42 imports — maior migracao. Mas `Button size="icon"` do shadcn faz exatamente a mesma coisa. E o pattern oficial.

---

## 6. Inventario final pos-refatoracao

### shadcn puro (instalados ou a instalar): ~42

Ja instalados (27): accordion, alert-dialog, avatar, badge, breadcrumb, button, card, checkbox, dialog, dropdown-menu, form, input, label, popover, progress, radio-group, select, separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea, tooltip

A instalar (15): alert, button-group, calendar, carousel, chart, collapsible, combobox, command, drawer, empty, field, input-group, item, kbd, pagination, scroll-area, spinner, toggle, toggle-group

### Nossos com valor real (sem equivalente shadcn): 8

| Componente                    | Imports | Justificativa                                                       |
| ----------------------------- | ------- | ------------------------------------------------------------------- |
| `Heading`                     | 140     | Tokens tipograficos dinamicos multi-tenant — shadcn usa classes raw |
| `Text`                        | 48      | Idem — semantica + tokens                                           |
| `CrudManager` / `useCrudList` | 10      | Abstracoo CRUD de dominio — shadcn nao tem                          |
| `DeleteConfirmation`          | 5       | AlertDialog + countdown + i18n — wrapper fino                       |
| `CopyButton`                  | 2       | Clipboard + feedback acessivel — shadcn nao tem                     |
| `upload-dropzone`             | 2       | Upload com preview — shadcn nao tem                                 |
| `SectionErrorBoundary`        | 2       | Error boundary reutilizavel — React pattern, nao shadcn             |
| `Walkthrough`                 | 1       | Tour/stepper guiado — shadcn nao tem                                |

### Total: ~50 componentes, todos usados, zero morto

---

## 7. Resumo executivo

| Metrica                           | Antes  | Depois                                          |
| --------------------------------- | ------ | ----------------------------------------------- |
| Componentes em ui/                | 67     | ~50                                             |
| Codigo morto (0 imports)          | 22     | 0                                               |
| Custom desnecessario (shadcn tem) | 14     | 0                                               |
| shadcn instalados                 | 27     | ~42                                             |
| Nossos com valor real             | ?      | 8 (justificados)                                |
| Mobile patterns (app-like)        | Ad hoc | Item, Drawer, Carousel, Collapsible, ScrollArea |

**Principio:** shadcn primeiro, sempre. Custom so quando shadcn literalmente nao tem E o componente precisa de tokens multi-tenant (Heading, Text) ou e abstracoo de dominio (CrudManager).
