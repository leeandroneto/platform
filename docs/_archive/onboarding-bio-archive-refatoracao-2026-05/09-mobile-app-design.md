# Mobile App Design — onboarding.bio

> Documento completo de UI mobile app-like. Patterns de iFood, Nubank, Magalu.
> Tudo com shadcn + Motion 12 + Tailwind v4 + tokens multi-tenant.
> **Criado:** 2026-05-01
> **Prerequisitos:** ler `01-shadcn-mapeamento.md` e `07-guia-fundacao-design.md`

---

## 1. Estado atual — o que ja temos

### Excelente (nao mexer)

| Pattern                      | Implementacao                                            | Arquivos                              |
| ---------------------------- | -------------------------------------------------------- | ------------------------------------- |
| Bottom nav pill flutuante    | 4 items, badges, safe-area, md:hidden                    | `components/dashboard/MobileNav.tsx`  |
| Drawer nav animado           | AnimatePresence, reduced-motion fallback                 | `components/dashboard/DrawerNav.tsx`  |
| Sidebar colapsavel (desktop) | w-60 → w-14, localStorage state                          | `components/dashboard/SidebarNav.tsx` |
| Safe areas iOS               | safe-pt, safe-pb, env(safe-area-inset-\*)                | `globals.css` + 25+ arquivos          |
| Dynamic viewport             | min-h-dvh, h-dvh (URL bar safe)                          | `globals.css`                         |
| Touch targets 44px+          | touch-target class, min-h-[44px]                         | 102 instancias                        |
| Overscroll control           | overscroll-behavior: none                                | `globals.css`                         |
| Skeleton loading             | 11 loading.tsx com skeletons responsivos                 | `app/**/loading.tsx`                  |
| Empty states                 | 3 variants (initial/filtered/error)                      | `components/ui/empty-state.tsx`       |
| Motion system                | 700+ usos, tokens duracao/easing                         | `globals.css` + `components/motion/`  |
| Reduced motion               | useReducedMotion() + CSS fallback                        | 165 instancias                        |
| ResponsiveDrawer             | Dialog desktop + Drawer mobile                           | `components/ui/responsive-drawer.tsx` |
| Responsive grids             | grid-cols-1 md:grid-cols-2, cards mobile + table desktop | Leads, clients, dashboard             |
| PWA manifest                 | standalone, portrait, icons 192/512                      | `public/manifest.json`                |
| Viewport cover               | viewportFit: cover, themeColor                           | `app/layout.tsx`                      |
| Input 16px                   | font-size: max(16px, 1rem) global                        | `globals.css`                         |
| Active press                 | active:scale, active:bg transitions                      | Buttons, cards, nav                   |

### Bom mas precisa de migracao (shadcn equivalente existe)

| Pattern atual          | Migrar pra                    | Motivo                                  |
| ---------------------- | ----------------------------- | --------------------------------------- |
| Listas com divs raw    | shadcn `Item` + `ItemGroup`   | Composavel, variants, sizes, asChild    |
| Empty state custom     | shadcn `Empty`                | Mais composavel, patterns oficiais      |
| Form sections com divs | shadcn `Field` + `FieldGroup` | Label + description + error padronizado |
| Cards de filtro custom | shadcn `Carousel` (dragFree)  | Scroll-snap nativo, touch gestures      |
| Collapsible custom     | shadcn `Collapsible`          | Radix a11y, animacao built-in           |
| Spinners inline        | shadcn `Spinner`              | Consistente, variants                   |

### Faltando (gap analysis)

| Feature                  | Impacto | Esforco | Prioridade |
| ------------------------ | ------- | ------- | ---------- |
| Scroll-snap em carousels | Alto    | Baixo   | P1         |
| PWA install prompt       | Alto    | Baixo   | P1         |
| Haptic feedback          | Medio   | Baixo   | P2         |
| Pull-to-refresh          | Medio   | Medio   | P2         |
| Service worker / offline | Medio   | Alto    | P3         |
| Swipe-back navigation    | Baixo   | Alto    | P3         |
| Progress bar no topo     | Baixo   | Baixo   | P3         |

---

## 2. Apps de referencia — o que copiar

### iFood

| Pattern                                           | Como implementar no projeto                            |
| ------------------------------------------------- | ------------------------------------------------------ |
| **Categorias em scroll horizontal com snap**      | shadcn `Carousel` com `dragFree: true` + `snap-start`  |
| **Cards de restaurante com foto + info + rating** | shadcn `Card` + `ItemContent` + `Badge`                |
| **Sticky header com search**                      | `sticky top-0 z-40` + shadcn `InputGroup`              |
| **Bandas verticais com SectionHeader**            | `<Heading level={2}>` + "Ver todos" link + `space-y-6` |
| **Bottom sheet pra filtros**                      | shadcn `Drawer` com snap points                        |
| **Pull-to-refresh na home**                       | Motion drag + refresh callback                         |
| **Skeleton shimmer no loading**                   | Ja temos — manter                                      |

### Nubank

| Pattern                            | Como implementar                                          |
| ---------------------------------- | --------------------------------------------------------- |
| **Settings como lista de items**   | shadcn `Item` + `Collapsible` por secao                   |
| **Historico como timeline**        | shadcn `Item` com leading icon colorido                   |
| **Cards de saldo/KPI hero**        | `<Heading level="display">` + `bg-card` + trend indicator |
| **Transicoes suaves entre telas**  | Motion `AnimatePresence` + layout animations              |
| **Feedback haptico em transacoes** | `navigator.vibrate([10])` no success                      |
| **Empty states ricos**             | shadcn `Empty` com ilustracao ou avatar group             |
| **Micro-labels UPPERCASE**         | `<Text variant="label">` (11px, tracking-wide)            |

### Magalu / PicPay

| Pattern                                       | Como implementar                             |
| --------------------------------------------- | -------------------------------------------- |
| **Grid de atalhos rapidos (2x2 ou 4 inline)** | `grid grid-cols-4 gap-3` + icone + label     |
| **Promo banners em carousel**                 | shadcn `Carousel` com `basis-[85%]` pra peek |
| **Bottom sheet com drag handle**              | shadcn `Drawer` com `handle` visual          |
| **Tabs fixas no topo**                        | shadcn `Tabs` + `sticky top-14 z-30`         |
| **Badge de notificacao**                      | `<Badge>` com `absolute -top-1 -right-1`     |

### Linear / Notion Mobile

| Pattern                     | Como implementar                        |
| --------------------------- | --------------------------------------- |
| **Command palette (Cmd+K)** | shadcn `Command` + `CommandDialog`      |
| **Keyboard shortcuts**      | shadcn `Kbd` pra display                |
| **Inline editing**          | Click-to-edit com `<Input>` que aparece |
| **Drag-to-reorder**         | `@dnd-kit/sortable` (ja instalado)      |
| **Markdown preview**        | Toggle entre edit e preview             |

---

## 3. Componentes shadcn pra mobile — patterns concretos

### 3.1 Listas como app — shadcn Item

**O pattern mais impactante.** Substitui divs raw por componentes composiveis.

```tsx
// Lista de leads estilo iFood/Nubank
<ItemGroup>
  {leads.map((lead, i) => (
    <React.Fragment key={lead.id}>
      <Item asChild>
        <Link href={`/leads/${lead.id}`}>
          <ItemMedia>
            <Avatar className="size-10">
              <AvatarFallback>{initials(lead.name)}</AvatarFallback>
            </Avatar>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{lead.name}</ItemTitle>
            <ItemDescription>
              {lead.modality} · {timeAgo(lead.created_at)}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Badge variant={statusVariant(lead.status)}>{t(`status.${lead.status}`)}</Badge>
            <ChevronRightIcon className="text-muted-foreground size-4" />
          </ItemActions>
        </Link>
      </Item>
      {i < leads.length - 1 && <ItemSeparator />}
    </React.Fragment>
  ))}
</ItemGroup>
```

**Variants do Item:**

- `default` — sem borda, padding interno
- `outline` — com borda, ideal pra cards
- `size="sm"` — compacto (dentro de drawers, dropdowns)

### 3.2 Categorias scroll horizontal — Carousel

```tsx
// Filtros de modalidade estilo iFood
<Carousel opts={{ align: 'start', dragFree: true }} className="-mx-4 px-4">
  <CarouselContent className="-ml-2">
    {modalities.map((mod) => (
      <CarouselItem key={mod.value} className="basis-auto pl-2">
        <Button
          variant={active === mod.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActive(mod.value)}
          className="rounded-full"
        >
          {t(`modality.${mod.value}`)}
        </Button>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>
```

**Variacao: cards com peek (Magalu style)**

```tsx
<Carousel opts={{ align: 'start' }}>
  <CarouselContent className="-ml-3">
    {promos.map((promo) => (
      <CarouselItem key={promo.id} className="basis-[85%] pl-3">
        <Card className="overflow-hidden">
          <Image src={promo.image} alt={promo.title} />
          <CardContent className="p-4">
            <Heading level={3}>{promo.title}</Heading>
          </CardContent>
        </Card>
      </CarouselItem>
    ))}
  </CarouselContent>
</Carousel>
```

### 3.3 Bottom sheet — Drawer

```tsx
// Filtros avancados (iFood style)
<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline" size="sm">
      <SlidersHorizontal className="size-4" />
      {t('filters')}
    </Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>{t('filters.title')}</DrawerTitle>
    </DrawerHeader>
    <div className="space-y-4 px-4 pb-8">{/* filtros aqui */}</div>
    <DrawerFooter>
      <Button className="w-full">{t('filters.apply')}</Button>
      <DrawerClose asChild>
        <Button variant="outline">{t('filters.clear')}</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
```

### 3.4 Settings colapsaveis — Collapsible + Item

```tsx
// Perfil/settings estilo Nubank
const sections = [
  { title: t('settings.personal'), icon: User, items: [...] },
  { title: t('settings.preferences'), icon: Sliders, items: [...] },
  { title: t('settings.support'), icon: HelpCircle, items: [...] },
]

{sections.map(section => (
  <Collapsible key={section.title} defaultOpen>
    <CollapsibleTrigger asChild>
      <Item className="cursor-pointer">
        <ItemMedia><section.icon className="size-5" /></ItemMedia>
        <ItemContent><ItemTitle>{section.title}</ItemTitle></ItemContent>
        <ItemActions><ChevronDown className="size-4" /></ItemActions>
      </Item>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <ItemGroup>
        {section.items.map(item => (
          <Item key={item.href} asChild>
            <Link href={item.href}>
              <ItemContent><ItemTitle>{item.label}</ItemTitle></ItemContent>
              <ItemActions><ChevronRight className="size-4" /></ItemActions>
            </Link>
          </Item>
        ))}
      </ItemGroup>
    </CollapsibleContent>
  </Collapsible>
))}
```

### 3.5 Edicao responsiva — drawer-dialog pattern

```tsx
// Desktop: Dialog. Mobile: Drawer.
const isDesktop = useMediaQuery('(min-width: 768px)')

if (isDesktop) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('edit.title')}</DialogTitle>
        </DialogHeader>
        <EditForm />
      </DialogContent>
    </Dialog>
  )
}

return (
  <Drawer open={open} onOpenChange={setOpen}>
    <DrawerContent>
      <DrawerHeader className="text-left">
        <DrawerTitle>{t('edit.title')}</DrawerTitle>
      </DrawerHeader>
      <div className="px-4 pb-8">
        <EditForm />
      </div>
    </DrawerContent>
  </Drawer>
)
```

### 3.6 Empty states ricos — shadcn Empty

```tsx
// Lista vazia (nunca tive dados)
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <Users className="size-6" />
    </EmptyMedia>
    <EmptyTitle>{t('leads.empty.title')}</EmptyTitle>
    <EmptyDescription>{t('leads.empty.description')}</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button>{t('leads.empty.cta')}</Button>
  </EmptyContent>
</Empty>

// Lista filtrada sem resultados
<Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <SearchX className="size-6" />
    </EmptyMedia>
    <EmptyTitle>{t('leads.filtered.title')}</EmptyTitle>
    <EmptyDescription>{t('leads.filtered.description', { query })}</EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    <Button variant="outline" onClick={clearFilters}>
      {t('leads.filtered.clear')}
    </Button>
  </EmptyContent>
</Empty>
```

### 3.7 Loading de botao — Spinner

```tsx
<Button disabled={isPending} className="w-full">
  {isPending && <Spinner />}
  {isPending ? t('saving') : t('save')}
</Button>
```

---

## 4. Navegacao app-like

### Estrutura do projeto (route groups)

| Route Group        | Nav mobile                               | Nav desktop             |
| ------------------ | ---------------------------------------- | ----------------------- |
| `(app)/(shell)`    | BottomTabBar (pill, 4 items) + DrawerNav | SidebarNav (colapsavel) |
| `(app)/onboarding` | Header minimo                            | Header minimo           |
| `(auth)`           | Nenhuma                                  | Nenhuma                 |
| `(public)`         | Nenhuma (brand do PT)                    | Nenhuma                 |
| `(client)`         | Header enxuto                            | Header enxuto           |

### Bottom nav — regras

- **Max 4 items** (5+ confunde, polegar nao alcanca)
- **Pill style** — floating com rounded, nao grudado na borda
- **Badges** pra contadores (leads novos, notificacoes)
- **Safe area** — `pb-[max(12px, env(safe-area-inset-bottom))]`
- **Compensacao** — conteudo usa `pb-nav` (= `--bottom-nav-height: 96px`)
- **Ocultar em sub-rotas** — detail pages, forms, checkout

### Drawer nav — regras

- **280px largura, max 85vw**
- **Overlay** semi-transparente com click-to-dismiss
- **Animacao** — slide da esquerda com Motion, opacity fallback em reduced-motion
- **Secoes** — Primary, Tools, Account
- **Profile card** no topo com avatar + nome + slug
- **Logout** no fundo com safe-pb

---

## 5. Forms mobile

### Regras de ouro

```
1. Single column (NUNCA 2 colunas mobile)
2. Inputs h-12 (48px), font >= 16px
3. inputMode correto (numeric, email, tel, decimal, search)
4. autoComplete correto (name, email, tel)
5. autoFocus no primeiro campo
6. Label acima do input (nunca placeholder como label)
7. Validacao inline (Zod + react-hook-form)
8. Sticky submit full-width no fundo (safe-pb)
9. useUnsavedChanges (beforeunload warning)
10. showCount em textareas (bio, descricoes)
```

### Pattern com shadcn Field

```tsx
<form onSubmit={handleSubmit(onSubmit)}>
  <FieldGroup>
    <Field>
      <FieldLabel htmlFor="name">{t('form.name')}</FieldLabel>
      <Input id="name" autoFocus autoComplete="name" {...register('name')} />
      {errors.name && (
        <FieldDescription className="text-destructive">{errors.name.message}</FieldDescription>
      )}
    </Field>

    <Field>
      <FieldLabel htmlFor="email">{t('form.email')}</FieldLabel>
      <Input
        id="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        {...register('email')}
      />
    </Field>

    <Field>
      <FieldLabel htmlFor="phone">{t('form.phone')}</FieldLabel>
      <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" {...register('phone')} />
    </Field>

    <Field>
      <FieldLabel htmlFor="bio">{t('form.bio')}</FieldLabel>
      <Textarea id="bio" showCount maxLength={500} {...register('bio')} />
    </Field>
  </FieldGroup>

  {/* Sticky submit */}
  <div className="bg-background/95 safe-pb fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur">
    <div className="px-4 py-3">
      <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
        {isSubmitting && <Spinner />}
        {isSubmitting ? t('saving') : t('save')}
      </Button>
    </div>
  </div>
</form>
```

---

## 6. Feedback e estados

### Tabela completa

| Estado             | Componente                   | Pattern                                            | Quando          |
| ------------------ | ---------------------------- | -------------------------------------------------- | --------------- |
| Loading tela       | `loading.tsx` + `<Skeleton>` | Replicar layout final                              | Fetch > 300ms   |
| Loading botao      | `<Spinner>` + label muda     | `<Button disabled><Spinner />Salvando...</Button>` | Mutacao         |
| Empty (nunca tive) | shadcn `<Empty>` + CTA forte | "Voce ainda nao tem X"                             | Lista vazia     |
| Empty (filtrado)   | shadcn `<Empty>` + "Limpar"  | "Nenhum resultado pra 'X'"                         | Filtro vazio    |
| Error tela         | `error.tsx` + retry          | Mensagem + "Tentar novamente"                      | Fetch falhou    |
| Error secao        | `<SectionErrorBoundary>`     | Isolar erro sem quebrar tela                       | Secao falhou    |
| Success acao       | `toast.success()` (Sonner)   | Top-center, 3s                                     | Mutacao ok      |
| Delete confirm     | `<DeleteConfirmation>`       | AlertDialog + countdown                            | Acao destrutiva |
| Optimistic         | `useOptimistic`              | UI atualiza antes da resposta                      | Status change   |
| Dirty form         | `useUnsavedChanges`          | beforeunload warning                               | Form sujo       |

### Diferenciar empties

```tsx
// Nunca tive dados
<EmptyTitle>{t('leads.empty.neverHad')}</EmptyTitle>
// "Voce ainda nao tem leads. Compartilhe seu formulario!"

// Filtro retornou vazio
<EmptyTitle>{t('leads.empty.filtered', { query })}</EmptyTitle>
// "Nenhum resultado pra 'musculacao'. Limpar filtros?"
```

---

## 7. Motion e gestos

### Tokens ja implementados

```css
/* Duracao */
--motion-instant: 80ms; /* hover, focus */
--motion-fast: 150ms; /* tooltips */
--motion-normal: 250ms; /* modals, sheets */
--motion-slow: 400ms; /* page transitions */
--motion-celebrate: 800ms; /* confetti */

/* Easing */
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
--ease-scene: cubic-bezier(0.22, 1, 0.36, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
```

### Quando usar CSS vs Motion 12

| CSS transitions                 | Motion 12 (motion/react)                     |
| ------------------------------- | -------------------------------------------- |
| Hover, focus, active states     | Entrada/saida de elementos (AnimatePresence) |
| Color/opacity/transform simples | Layout animations (layout prop)              |
| Acordeoes simples               | Gestos (drag, swipe, pan)                    |
|                                 | Sequences (staggerChildren)                  |
|                                 | Scroll-triggered (whileInView)               |
|                                 | Spring physics                               |

### Microinteracoes essenciais (CSS — gratis)

```tsx
// Botao pressed — ESSENCIAL pra parecer app
'active:scale-[0.98] transition-transform'

// Card clicavel
'active:bg-accent/50 transition-colors'

// Hover desktop
'hover:bg-accent transition-colors'

// Nav item ativo
'active:scale-95 transition-transform'
```

### Gestos com Motion (quando necessario)

```tsx
// Drag carousel
<motion.div
  drag="x"
  dragConstraints={{ left: -width, right: 0 }}
  dragElastic={0.1}
  dragMomentum={false}
  style={{ touchAction: 'pan-y' }}
>
  {children}
</motion.div>

// Step transition (onboarding)
<AnimatePresence mode="wait" custom={direction}>
  <motion.div
    key={step}
    custom={direction}
    initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.div>
</AnimatePresence>

// Scroll-triggered reveal
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-100px" }}
  transition={{ duration: 0.5 }}
>
  {children}
</motion.div>
```

---

## 8. PWA

### Ja implementado

```json
// public/manifest.json
{
  "name": "onboarding.bio",
  "short_name": "onbio",
  "display": "standalone",
  "start_url": "/dashboard",
  "orientation": "portrait-primary",
  "background_color": "#0b0b0d",
  "theme_color": "#0b0b0d",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192" },
    { "src": "/icon-512.png", "sizes": "512x512" },
    { "src": "/icon-512-maskable.png", "sizes": "512x512", "purpose": "maskable" }
  ]
}
```

```tsx
// app/layout.tsx viewport
viewport: {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#0b0b0d' }]
}
```

### Faltando implementar

#### Install prompt customizado (P1)

```tsx
// hooks/use-install-prompt.ts
'use client'
import { useState, useEffect } from 'react'

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstallable, setIsInstallable] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsInstallable(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') setIsInstallable(false)
    setDeferredPrompt(null)
  }

  return { isInstallable, install }
}
```

#### Haptic feedback (P2)

```tsx
// lib/utils/haptic.ts
export function haptic(pattern: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') {
  if (!navigator.vibrate) return

  const patterns = {
    light: [10],
    medium: [20],
    heavy: [30],
    success: [10, 50, 10],
    error: [30, 50, 30, 50, 30],
  }

  navigator.vibrate(patterns[pattern])
}

// Uso em acoes
const onStatusChange = async (status: string) => {
  await updateLeadStatus(lead.id, status)
  haptic('success')
  toast.success(t('status.updated'))
}
```

#### Scroll-snap (P1)

```css
/* globals.css — adicionar */
.snap-x {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}
.snap-start {
  scroll-snap-align: start;
}
.snap-center {
  scroll-snap-align: center;
}
```

Ja vem com Tailwind v4: `snap-x snap-mandatory` + `snap-start` nos items.

---

## 9. Acessibilidade mobile

### Obrigatorio

| Regra                        | Enforcement                                            |
| ---------------------------- | ------------------------------------------------------ |
| Touch targets >= 44x44px     | `.touch-target` class + code review                    |
| Contraste APCA Lc >= 60      | `lib/design/contrast.ts`                               |
| Focus visible em interativos | globals.css `*:focus-visible`                          |
| `aria-label` em icon buttons | ESLint `jsx-a11y`                                      |
| `<Label>` em todo input      | ESLint `label-has-associated-control`                  |
| `alt` em imagens             | ESLint `jsx-a11y/alt-text`                             |
| `lang="pt-BR"` no html       | ESLint `jsx-a11y/html-has-lang`                        |
| Heading hierarchy (h1→h2→h3) | `<Heading level={N}>` garante                          |
| Reduced motion               | `prefers-reduced-motion` global + `useReducedMotion()` |

### Screen readers mobile

- VoiceOver (iOS) e TalkBack (Android) dependem de semantica HTML correta
- shadcn usa Radix que implementa WAI-ARIA patterns
- Drawer/Dialog tem focus trap automatico
- Nao precisamos de ARIA elaborado alem do que shadcn/Radix ja da

---

## 10. Estrutura por tipo de tela mobile

### Dashboard mobile

```
┌─────────────────────────┐
│ Avatar  Bem-vindo, João │ ← Sticky header
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ R$ 1.247,90  +12%   │ │ ← Hero KPI (Heading display)
│ └─────────────────────┘ │
│                         │
│ ● ● ● ●                │ ← Grid 4 atalhos (icone + label)
│                         │
│ Atividade   Ver todos → │ ← SectionHeader
│ ┌─────────────────────┐ │
│ │ Lead #1   Há 2h     │ │ ← ItemGroup
│ │ Lead #2   Há 5h     │ │
│ │ Lead #3   Há 1d     │ │
│ └─────────────────────┘ │
│                         │
│         96px            │ ← pb-nav
├─────────────────────────┤
│  🏠  📋  📝  ≡        │ ← Bottom nav pill
└─────────────────────────┘
```

### Listagem mobile

```
┌─────────────────────────┐
│ Leads            + ≡    │ ← Sticky header
├─────────────────────────┤
│ 🔍 Buscar leads...     │ ← Search (InputGroup)
│ [Todos] [Novos] [Conv]  │ ← Carousel chips
│                         │
│ ┌─────────────────────┐ │
│ │ 👤 Maria    ● Novo  │ │ ← Item + Avatar + Badge
│ │    Musculacao · 2h  │ │
│ ├─────────────────────┤ │
│ │ 👤 João    ● Cont.  │ │
│ │    Corrida · 5h     │ │
│ ├─────────────────────┤ │
│ │ 👤 Ana    ● Conv.   │ │
│ │    Natacao · 1d     │ │
│ └─────────────────────┘ │
│                         │
│         96px            │
├─────────────────────────┤
│  🏠  📋  📝  ≡        │
└─────────────────────────┘
```

### Detalhe mobile

```
┌─────────────────────────┐
│ ← Dashboard > Leads >   │ ← Breadcrumb
│   Maria da Silva    ⋮   │ ← Header + menu
├─────────────────────────┤
│ ● Novo lead             │ ← Badge status
│ Musculacao · Há 2h      │ ← Subtitle
│                         │
│ [Info] [Notas] [Report] │ ← Tabs
│                         │
│ Secao de conteudo...    │
│                         │
│                         │
├─────────────────────────┤
│ [  Entrar em contato  ] │ ← Sticky CTA (safe-pb)
└─────────────────────────┘
```

### Formulario mobile

```
┌─────────────────────────┐
│ ← Novo cliente          │ ← Header com voltar
├─────────────────────────┤
│                         │
│ Nome completo           │ ← FieldLabel
│ ┌─────────────────────┐ │
│ │ Maria da Silva      │ │ ← Input h-12
│ └─────────────────────┘ │
│                         │
│ Email                   │
│ ┌─────────────────────┐ │
│ │ maria@email.com     │ │ ← inputMode="email"
│ └─────────────────────┘ │
│                         │
│ Telefone                │
│ ┌─────────────────────┐ │
│ │ (11) 99999-9999     │ │ ← inputMode="tel"
│ └─────────────────────┘ │
│                         │
│ Bio              45/500 │ ← showCount
│ ┌─────────────────────┐ │
│ │                     │ │ ← Textarea
│ └─────────────────────┘ │
│                         │
├─────────────────────────┤
│ [      Salvar         ] │ ← Sticky full-width (safe-pb)
└─────────────────────────┘
```

### Settings mobile

```
┌─────────────────────────┐
│ Configuracoes           │ ← Header
├─────────────────────────┤
│ ▼ Informacoes pessoais  │ ← Collapsible (open)
│   Perfil            >   │ ← Item + ChevronRight
│   Contato           >   │
│   Design            >   │
│   Midia             >   │
│                         │
│ ▶ Notificacoes          │ ← Collapsible (closed)
│                         │
│ ▶ Assinatura            │ ← Collapsible (closed)
│                         │
│ 🔴 Sair                │ ← text-destructive
│                         │
│         96px            │
├─────────────────────────┤
│  🏠  📋  📝  ≡        │
└─────────────────────────┘
```

---

## 11. Anti-padroes — o que NAO fazer

| Anti-padrao                          | Por que e ruim                         | Alternativa                         |
| ------------------------------------ | -------------------------------------- | ----------------------------------- |
| Modal central em mobile              | Polegar nao alcanca, bloqueia contexto | Drawer (bottom sheet)               |
| `shadow-lg` em mobile                | Pesado, parece web antiga              | `shadow-sm` ou border               |
| 2 colunas em form mobile             | Inputs ficam apertados, teclado cobre  | Single column sempre                |
| Placeholder como label               | Desaparece ao digitar, falha a11y      | Label acima                         |
| Cards aninhados                      | Confuso, sem hierarquia                | Card unico ou Item list             |
| 4+ acoes num card                    | Decision overload                      | 1 CTA primario + menu               |
| Hamburger sem bottom nav             | Esconde navegacao principal            | Bottom nav pill + drawer pra extras |
| Pull-to-refresh custom sem indicator | Usuario nao sabe que puxou             | Indicator visual sempre             |
| Scroll horizontal sem indicator      | Usuario nao sabe que pode scrollar     | Peek (mostrar borda do proximo)     |
| Touch target < 44px                  | Frustante, falha a11y                  | Min 44x44px                         |
| Hover-only interaction               | Mobile nao tem hover                   | Tap/active states                   |
| Fixed header + fixed footer          | Conteudo espremido                     | 1 fixo (header), 1 sticky (CTA)     |
| `vh` em vez de `dvh`                 | URL bar cobre conteudo                 | `dvh` ou `min-h-dvh`                |
| Font < 16px em inputs                | Zoom automatico iOS                    | `text-base` (16px) minimo           |

---

## 12. Resumo: prioridades de implementacao

### P1 — Alto impacto, baixo esforco (fazer na refatoracao)

1. Migrar listas pra shadcn `Item` + `ItemGroup`
2. Migrar empty states pra shadcn `Empty`
3. Migrar forms pra shadcn `Field` + `FieldGroup`
4. Instalar shadcn `Carousel` pra filtros/categorias com scroll-snap
5. Instalar shadcn `Collapsible` pra settings mobile
6. PWA install prompt customizado
7. Instalar shadcn `Spinner` pra loading de botoes

### P2 — Medio impacto (pos-refatoracao)

8. Haptic feedback em acoes de sucesso/erro
9. Pull-to-refresh em listas (Motion drag)
10. Progress bar no topo pra navegacao
11. Container queries pra componentes responsivos

### P3 — Polish (pos-lancamento)

12. Service worker / offline basic
13. Swipe-back navigation
14. Splash screens iOS otimizados
15. Platform-specific CSS (iOS vs Android)
