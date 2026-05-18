# Guia de Fundacao — Design System onboarding.bio

> Documento de referencia definitivo para padronizar toda UI do projeto.
> **Stack:** Next.js 16 (App Router) + Tailwind v4 + shadcn/ui + Motion 12 + OKLCH + APCA.
> **Ultima atualizacao:** 2026-05-01 (alinhado com CLAUDE.md, MVP checklist, e estado real do codigo).
> **Regra:** se algo aqui conflitar com `CLAUDE.md`, **CLAUDE.md vence**. Este guia detalha o "como"; CLAUDE.md e o contrato.

---

## Como usar este guia

1. **Parte 1 — Fundacao**: tudo que ja esta implementado e deve ser respeitado.
2. **Parte 2 — Travar as proximas telas**: mecanismos que impedem regressao.
3. **Parte 3 — Migrar o legado**: Strangler Pattern pra telas que ainda nao seguem o padrao.
4. **Anexos**: tokens, componentes, decisoes de referencia rapida.

---

## Principios fundamentais

1. **Componha, nunca recrie.** 79 componentes em `components/ui/`. Se existe `Button`, `Sheet`, `Dialog`, `Card`, `DataTable`, `EmptyState`, `Heading`, `Text` — use. Nunca `<div>` que imita componente existente.

2. **Tokens, nao valores arbitrarios.** Cor via OKLCH + CSS vars. Tipografia via `<Heading>` e `<Text>`. Shape via `var(--shape-*)`. Density via `var(--density-*)`. Zero `p-[13px]`, zero `text-[15px]`, zero `#hex` inline.

3. **Multi-tenant primeiro.** Tudo que o profissional personaliza (cor, tipografia, shape, density) vem de CSS vars controladas por `data-*` attributes. Nunca hardcodar visual que deveria ser dinamico.

4. **Mobile-first nao e breakpoint, e design.** Bottom nav flutuante, sheets em vez de modals, touch targets 44px+, safe-area insets. Desktop e o breakpoint de expansao.

5. **Consistencia > perfeicao.** 100 telas medias mas iguais > 99 medias + 1 linda. Padronize via tokens e componentes, refine depois.

---

# PARTE 1 — Fundacao (o que ja existe)

## 1.1 Sistema de cores — OKLCH

### Por que OKLCH e nao HSL?

- **Uniformidade perceptual**: `oklch(50% 0.13 175)` e `oklch(50% 0.13 25)` parecem igualmente "vibrantes" — HSL nao garante isso.
- **Derivacao programatica**: criar paleta inteira mudando um parametro (hue). Essencial pra multi-tenant onde o profissional escolhe cor.
- **Gamut P3**: OKLCH mapeia naturalmente pra displays wide-gamut modernos.
- **Melhor pratica 2026**: CSS Color Level 4 spec. Browsers modernos suportam 100%.

### Escalas primitivas (globals.css)

Quatro escalas definidas em `:root` com 11 steps cada (50-950):

| Escala           | Hue        | Uso                                  |
| ---------------- | ---------- | ------------------------------------ |
| `--ob-brand-*`   | 175 (teal) | Identidade onboarding.bio            |
| `--ob-gray-*`    | 80 (warm)  | Neutros (backgrounds, texto, bordas) |
| `--ob-success-*` | 145        | Feedback positivo                    |
| `--ob-warning-*` | 75         | Alertas                              |
| `--ob-danger-*`  | 25         | Erros, acoes destrutivas             |
| `--ob-info-*`    | 235        | Informacao                           |

**Regra**: nunca usar primitivos diretamente em componentes. Usar camada semantica:

```
Primitivo (--ob-brand-500) → Semantico (--action-primary) → Tailwind (bg-primary)
```

### Camada semantica canonica

```css
--surface-primary    /* background principal */
--surface-secondary  /* background sutil */
--surface-elevated   /* cards, popovers */
--text-primary       /* texto principal */
--text-secondary     /* texto secundario */
--border-default     /* bordas visiveis */
--border-subtle      /* bordas sutis */
--action-primary     /* botoes, links, CTAs */
--status-success/warning/danger/info
```

### Paletas do profissional (multi-tenant)

5 paletas pre-definidas + custom hex, controladas por `data-palette` no HTML:

| Palette        | `data-palette` | Cor dark  | Cor light |
| -------------- | -------------- | --------- | --------- |
| Lime (default) | `lime`         | `#c6ff6c` | `#65a30d` |
| Green          | `green`        | `#4ade80` | `#16a34a` |
| Coral          | `coral`        | `#ff7a59` | (mesma)   |
| Ocean          | `ocean`        | `#38bdf8` | `#0ea5e9` |
| Amber          | `amber`        | `#fbbf24` | `#d97706` |

**Light-mode overrides**: cada paleta tem variante mais escura pra light mode (APCA-validada, Lc >= 45 contra `#fafafa`).

### Contraste — APCA (nao WCAG 2.0)

| Contexto                     | Lc minimo |
| ---------------------------- | --------- |
| Texto body UI                | >= 60     |
| Texto pequeno (label, micro) | >= 75     |
| Decorativo / nao-essencial   | >= 30     |

Validacao via `lib/design/contrast.ts` usando `apca-w3`. WCAG 2.0 (4.5:1) e referencia complementar, nao primaria.

---

## 1.2 Tipografia — componentes semanticos

### Nunca usar classes Tailwind pra tipografia em componentes novos

```tsx
// ERRADO
<h2 className="text-xl font-semibold tracking-tight">Titulo</h2>
<p className="text-sm text-muted-foreground">Descricao</p>

// CERTO
<Heading level={2}>Titulo</Heading>
<Text variant="muted">Descricao</Text>
```

### `<Heading>` — components/ui/heading.tsx

| Level     | Token            | Size | Line-height | Tracking |
| --------- | ---------------- | ---- | ----------- | -------- |
| `display` | `--text-display` | 48px | 1.05        | -0.02em  |
| `1`       | `--text-h1`      | 28px | 1.15        | -0.01em  |
| `2`       | `--text-h2`      | 20px | 1.20        | -0.01em  |
| `3`       | `--text-h3`      | 16px | 1.30        | 0        |
| `4`       | (= h3 visual)    | 16px | 1.30        | 0        |
| `5`       | text-sm          | 14px | snug        | —        |
| `6`       | text-xs          | 12px | snug        | —        |

Props: `level`, `as` (override HTML tag), `asChild` (composicao com motion).

### `<Text>` — components/ui/text.tsx

| Variant      | Token                          | Size | Uso                           |
| ------------ | ------------------------------ | ---- | ----------------------------- |
| `body-large` | `--text-body-large`            | 16px | Texto principal, inputs       |
| `body`       | `--text-body`                  | 14px | Texto padrao                  |
| `body-small` | `--text-body-small`            | 13px | Secundario compacto           |
| `label`      | `--text-label`                 | 11px | Kickers, metadata, timestamps |
| `micro`      | `--text-micro`                 | 10px | Fine print, badges            |
| `muted`      | = body + text-muted-foreground | 14px | Descricoes sutis              |
| `mono`       | `--text-mono`                  | 14px | Precos, IDs, metricas         |

Props: `variant`, `as` (span/div/p), `asChild`.

### Tokens adicionais (usar via classes utilitarias quando `<Text>` nao se aplica)

- `text-micro` / `text-micro-xs` / `text-body-small` — classes utilitarias em globals.css
- `tracking-tight` / `tracking-wide` / `tracking-display` — tokens de espacamento
- `leading-tight` / `leading-normal` / `leading-body` — tokens de line-height

### Fontes

| Var              | Stack                 | Uso                         |
| ---------------- | --------------------- | --------------------------- |
| `--font-sans`    | Geist, Inter, system  | Body, UI                    |
| `--font-mono`    | Geist Mono, SFMono    | Precos, metricas            |
| `--font-display` | Geist, Barlow, Impact | Headlines criativos         |
| `--font-serif`   | Libre, Georgia        | Typography preset "classic" |

Profissional escolhe preset via `data-typography`:

- `modern` — sans em tudo
- `editorial` — display + serif
- `classic` — serif em tudo
- `bold` — display em tudo

---

## 1.3 Shape system — border-radius dinamico

Controlado por `data-shape` no HTML. Dashboard usa `rounded` (default).

| Token            | Rounded | Sharp  | Soft   |
| ---------------- | ------- | ------ | ------ |
| `--shape-card`   | 14px    | 7px    | 22px   |
| `--shape-button` | 10px    | 5px    | 16px   |
| `--shape-input`  | 10px    | 5px    | 16px   |
| `--shape-badge`  | 4px     | 2px    | 8px    |
| `--shape-avatar` | 9999px  | 9999px | 9999px |

**Uso em componentes shadcn**: `rounded-[var(--shape-button)]` (button, input, select, textarea), `rounded-[var(--shape-card)]` (dialog, sheet, card, surface).

**Raios fixos (nao dinamicos)**:

| Token           | Valor  | Uso             |
| --------------- | ------ | --------------- |
| `--radius-xs`   | 4px    | Badges, tags    |
| `--radius-sm`   | 6px    | Chips           |
| `--radius-md`   | 10px   | Botoes internos |
| `--radius-lg`   | 14px   | Cards internos  |
| `--radius-xl`   | 20px   | Modais grandes  |
| `--radius-pill` | 9999px | Pills, avatares |

---

## 1.4 Density system — espacamento dinamico

Controlado por `data-density`. Dashboard usa `cozy` (default).

| Token             | Tight | Cozy | Roomy |
| ----------------- | ----- | ---- | ----- |
| `--density-pad-y` | 8px   | 12px | 16px  |
| `--density-pad-x` | 12px  | 16px | 20px  |
| `--density-row-y` | 10px  | 14px | 18px  |
| `--density-gap`   | 8px   | 12px | 16px  |

**Uso**: componentes shadcn usam `p-[var(--density-pad-y)]_[var(--density-pad-x)]` etc.

### Espacamento (8pt grid — quando density nao se aplica)

| Tailwind         | px  | Uso                    |
| ---------------- | --- | ---------------------- |
| `gap-1`          | 4   | Icone + texto inline   |
| `gap-2`          | 8   | Elementos relacionados |
| `gap-3`          | 12  | Itens de lista densa   |
| `gap-4` / `p-4`  | 16  | **Padrao geral**       |
| `gap-6`          | 24  | Entre grupos           |
| `gap-8` / `py-8` | 32  | Entre secoes           |
| `gap-12`         | 48  | Entre regioes grandes  |

---

## 1.5 Surface system — multi-tenant isolado

`data-surface` controla de onde vem a cor de accent:

| Atributo                  | Contexto                        | Accent                                      |
| ------------------------- | ------------------------------- | ------------------------------------------- |
| `data-surface="internal"` | Dashboard, settings, admin      | `--ob-brand-500` (teal fixo onboarding.bio) |
| `data-surface="public"`   | Site, form, report, links do PT | `--palette-primary` (cor do profissional)   |

**Toda pagina publica deve ter** os 5 data attributes:

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

---

## 1.6 Estilos curados (6 presets)

O profissional escolhe 1 estilo que combina palette + typography + mode + shape + density:

| Estilo  | Palette | Typography | Mode  | Shape   | Density |
| ------- | ------- | ---------- | ----- | ------- | ------- |
| Energia | lime    | modern     | dark  | rounded | cozy    |
| Clinico | ocean   | modern     | light | sharp   | tight   |
| Raiz    | green   | editorial  | dark  | soft    | roomy   |
| Revista | coral   | editorial  | light | rounded | cozy    |
| Noturno | amber   | bold       | dark  | sharp   | tight   |
| Impacto | coral   | bold       | dark  | soft    | cozy    |

Apos escolher estilo, profissional pode ajustar cor individualmente.

---

## 1.7 Motion system — Motion 12

**Package**: `motion/react` (nunca `framer-motion` — bloqueado por ESLint).

### Tokens de duracao (globals.css)

| Token                | Valor | Uso                         |
| -------------------- | ----- | --------------------------- |
| `--motion-instant`   | 80ms  | Hover, focus                |
| `--motion-fast`      | 150ms | Tooltips, small transitions |
| `--motion-normal`    | 250ms | Modals, sheets, accordions  |
| `--motion-slow`      | 400ms | Page transitions            |
| `--motion-slower`    | 600ms | Complex sequences           |
| `--motion-celebrate` | 800ms | Celebracoes, confetti       |

### Tokens de easing

| Token           | Valor                               | Uso               |
| --------------- | ----------------------------------- | ----------------- |
| `--ease-smooth` | `cubic-bezier(0.16, 1, 0.3, 1)`     | Entrada suave     |
| `--ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Bounce sutil      |
| `--ease-scene`  | `cubic-bezier(0.22, 1, 0.36, 1)`    | Transicao de cena |
| `--ease-out`    | `cubic-bezier(0, 0, 0.2, 1)`        | Saida padrao      |

### Padrao de uso

```tsx
import { motion } from 'motion/react'

// Composicao com Heading via asChild
;<Heading level={1} asChild>
  <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
    Titulo animado
  </motion.h1>
</Heading>
```

**`prefers-reduced-motion`**: globals.css ja reduz todas as animacoes a 0.01ms quando ativo.

---

## 1.8 Elevacao (sombras)

| Token                  | Uso                          |
| ---------------------- | ---------------------------- |
| `--shadow-elevation-1` | Cards sutis, hover states    |
| `--shadow-elevation-2` | Popovers, dropdowns          |
| `--shadow-elevation-3` | Modais, sheets               |
| `--shadow-mockup`      | Mockups de device (showcase) |

**Regra mobile**: usar `--shadow-elevation-1` ou bordas. Nunca `shadow-lg+` em mobile.

---

## 1.9 Dark mode

**O projeto e dark-first.** `html[data-theme='dark']` e o default.

- Todas as variaveis de cor tem versoes dark e light em globals.css
- Paletas do profissional tem overrides light-mode (APCA-validadas)
- `color-scheme: dark` / `color-scheme: light` setados automaticamente

---

## 1.10 Hierarquia de componentes

O projeto **nao** usa pastas separadas `composed/` e `features/`. A estrutura real e:

### `components/ui/` — 79 componentes (primitivos + compostos)

Todos os componentes UI moram aqui, tanto os vindos do shadcn quanto os compostos criados pelo projeto. **Nunca criar pasta `composed/` separada.**

#### Primitivos shadcn (instalados via `pnpm dlx shadcn@latest add`)

`accordion`, `alert-dialog`, `avatar`, `badge`, `button`, `card`, `checkbox`, `combobox`, `command-palette`, `dialog`, `drawer-with-dirty-check`, `dropdown-menu`, `form`, `input`, `kbd`, `label`, `popover`, `progress`, `radio-group`, `select`, `separator`, `sheet`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `textarea`, `tooltip`

**Regra**: se faltar um primitivo, instalar via `pnpm dlx shadcn@latest add [componente]`. Nunca reimplementar.

#### Compostos do projeto (em `components/ui/`)

| Componente                           | Pra que                                    |
| ------------------------------------ | ------------------------------------------ |
| `<Heading level={N}>`                | Tipografia semantica (h1-h6)               |
| `<Text variant="...">`               | Texto semantico (body, label, micro, mono) |
| `<CrudManager>` / `useCrudList`      | Lista + CRUD completo                      |
| `<FormModal>`                        | Dialog + Form + submit                     |
| `<DataTable>`                        | Tabela com paginacao, filtros, ordenacao   |
| `<EmptyState>`                       | Estado vazio padronizado                   |
| `<DeleteConfirmation>`               | Confirmacao destrutiva com countdown       |
| `<ResponsiveDrawer>`                 | Sheet desktop / Drawer mobile              |
| `<IconButton>`                       | Botao com icone (44px touch target)        |
| `<StickyActionBar>`                  | CTA fixo no fundo                          |
| `<BottomTabBar>`                     | Bottom nav flutuante (pill)                |
| `<MobileTopBar>`                     | Header mobile contextual                   |
| `<FileUpload>` / `<UploadDropzone>`  | Upload de arquivos                         |
| `<OptimizedImage>`                   | next/image com defaults                    |
| `<CopyButton>`                       | Clipboard com feedback                     |
| `<Breadcrumb>`                       | Navegacao hierarquica                      |
| `<Surface>`                          | Container com shape/density tokens         |
| `<SelectionCard>`                    | Card selecionavel                          |
| `<SegmentedControl>`                 | Tabs inline                                |
| `<DatePicker>` / `<DateRangePicker>` | Selecao de data                            |
| `<NotificationBanner>`               | Banner de aviso                            |
| `<Walkthrough>`                      | Guia passo-a-passo                         |
| `<DangerAction>`                     | Acao destrutiva com confirmacao            |

#### Features (em `components/[feature]/`)

Componentes especificos de dominio: `form/lead/`, `form/audit/`, `report/lead/`, `report/audit/`, `site/`, `landing/`, `template-picker/`, `diagnostic-activation/`, `settings/`, `onboarding/`, etc.

**Regra**: nunca importar entre features. Se precisa compartilhar, promover pra `components/ui/`.

### Hierarquia de decisao ao criar UI

```
1. Ja existe em components/ui/? → USE.
2. Nao existe? Componha primitivos de components/ui/.
3. Sera reusado em 2+ lugares? → Crie em components/ui/.
4. Especifico de 1 feature? → Crie em components/[feature]/.
5. NUNCA crie wrapper que duplica primitivo existente.
```

---

## 1.11 Shell e navegacao

### Estrutura de route groups (nao MobileShell)

O projeto usa **route groups** com layouts proprios, nao um componente `MobileShell` generico:

| Route Group        | Layout                    | Nav                                                                          |
| ------------------ | ------------------------- | ---------------------------------------------------------------------------- |
| `(auth)`           | Sem shell                 | —                                                                            |
| `(app)/onboarding` | Header minimo             | —                                                                            |
| `(app)/(shell)`    | `DashboardLayout`         | `SidebarNav` (desktop) + `MobileNav` (bottom pill) + `DrawerNav` (hamburger) |
| `(public)`         | Sem shell, brand do PT    | —                                                                            |
| `(client)`         | Layout enxuto, brand fixo | —                                                                            |

### Bottom nav mobile

`<BottomTabBar>` — pill flutuante com badges, 4 items fixos:

- Dashboard, Leads, Formularios, Menu (drawer)

**Compensacao de padding**: usar `pb-nav` (= `pb-[var(--bottom-nav-height)]` mobile, `pb-0` desktop) em listas pra conteudo nao ficar atras da nav.

---

## 1.12 Mobile-first utilities (globals.css)

| Classe                                             | Uso                                        |
| -------------------------------------------------- | ------------------------------------------ |
| `touch-target`                                     | `min-height: 44px; min-width: 44px`        |
| `safe-pb` / `safe-pt` / `safe-pl` / `safe-pr`      | Safe-area iOS (notch/home indicator)       |
| `safe-bottom`                                      | `bottom: env(safe-area-inset-bottom)`      |
| `min-h-dvh` / `h-dvh`                              | Dynamic viewport height (barra URL mobile) |
| `scrollbar-none`                                   | Esconde scrollbar mantendo scroll          |
| `pb-nav`                                           | Bottom nav padding compensation            |
| `text-micro` / `text-micro-xs` / `text-body-small` | Classes tipograficas                       |

---

## 1.13 Cores semanticas via Tailwind (remapeadas pra brand)

| Classe Tailwind                          | Mapeia para                                        |
| ---------------------------------------- | -------------------------------------------------- |
| `bg-background` / `text-foreground`      | `--brand-bg` / `--brand-text`                      |
| `bg-card` / `text-card-foreground`       | `--brand-bg-elevated` / `--brand-text`             |
| `bg-muted` / `text-muted-foreground`     | (shadcn muted) / `--brand-text-muted`              |
| `bg-primary` / `text-primary-foreground` | `--palette-primary` / `--palette-primary-contrast` |
| `bg-destructive`                         | `#ef4444`                                          |
| `bg-accent`                              | (shadcn accent)                                    |
| `border`                                 | `--brand-border`                                   |

**Regra**: nunca usar hex hardcoded fora de globals.css. Sempre via variavel ou classe Tailwind.

Excecoes documentadas:

- WhatsApp green (`--color-whatsapp: #25D366`) — brand externa
- Chrome mockup dots — cores de sistema
- Score visualization — cores semanticas fixas em globals.css

---

# PARTE 2 — Travar as proximas telas

## 2.1 ESLint como cerca eletrica

Arquivo: `eslint.config.mjs` (flat config).

### Regras ativas que impedem regressao

| Regra                                | O que bloqueia                                                                               |
| ------------------------------------ | -------------------------------------------------------------------------------------------- |
| `no-restricted-syntax` (6 selectors) | `<button>` raw, `<motion.button>` raw, `<h1>`-`<h6>` raw, hex/rgb/hsl inline em `style={{}}` |
| `no-restricted-imports`              | `framer-motion` (usar `motion/react`), `next/router` (usar `next/navigation`)                |
| `react/jsx-no-literals`              | Strings PT-BR hardcoded em JSX (forca `t()` de next-intl)                                    |
| `jsx-a11y/*` (25 regras strict)      | Acessibilidade (anchor, aria, labels, roles, focus, tabindex)                                |
| `@typescript-eslint/no-unused-vars`  | Variaveis nao usadas (error, nao warn)                                                       |

**Nivel**: `error` em todas (exceto `jsx-no-literals` que e `warn` durante migracao).

### Excecoes documentadas

| Arquivo/pasta                         | Regra desligada        | Motivo                 |
| ------------------------------------- | ---------------------- | ---------------------- |
| `components/ui/**`                    | `no-restricted-syntax` | Componentes base do DS |
| `components/motion/**`                | `no-restricted-syntax` | Primitivos de animacao |
| `lib/pdf/**`, `lib/email/**`          | `jsx-no-literals`      | Templates server-side  |
| `app/demo/**`, `app/global-error.tsx` | `jsx-no-literals`      | Demos e fallback       |

---

## 2.2 Husky + lint-staged + commitlint

**Ja instalado e ativo.** 3 hooks:

### Pre-commit (`.husky/pre-commit`)

```bash
pnpm exec lint-staged
```

lint-staged (`.lintstagedrc.mjs`):

- `*.{js,jsx,ts,tsx,mjs,cjs}` → `eslint --max-warnings=0 --no-warn-ignored`
- `*.{ts,tsx}` → `tsc --noEmit`

### Commit-msg (`.husky/commit-msg`)

```bash
pnpm exec commitlint --edit "$1"
```

Formato: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `ci:`, `style:`, `revert:`, `build:`).

### Pre-push (`.husky/pre-push`)

```bash
pnpm exec vitest run
```

**Resultado**: impossivel commitar codigo com lint errors, tipo errors, ou commit message fora do padrao. Impossivel pushar com testes falhando.

---

## 2.3 i18n com next-intl

**Ativo desde Phase F.** Toda string visivel pro usuario deve usar `t()`:

```tsx
// Server component
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('namespace')
return <Text>{t('key')}</Text>

// Client component
import { useTranslations } from 'next-intl'
const t = useTranslations('namespace')
return <Text>{t('key')}</Text>

// Server action
import { getTranslations } from 'next-intl/server'
const t = await getTranslations('actions')
return { ok: false, error: t('errorKey') }
```

Strings em `messages/pt-BR.json`. ESLint `jsx-no-literals` forca migracao.

---

## 2.4 Regras absolutas

### NUNCA faca

- Recriar `Sheet`, `Dialog`, `Card`, `Button`, `Table`, `Form`, `EmptyState` do zero
- Usar valores arbitrarios (`p-[13px]`, `text-[15px]`, `rounded-[12px]`)
- Hex inline em componentes (`bg-[#ff0000]`, `style={{ color: '#000' }}`)
- Importar `framer-motion` (usar `motion/react`)
- Importar `next/router` (usar `next/navigation`)
- Importar libs de icone alem de Lucide (`react-icons`, `heroicons`)
- Usar `npm` ou `npx` (usar `pnpm` e `pnpm dlx`)
- Criar `tailwind.config.ts` (tokens em `globals.css @theme`)
- Usar `<h1>`-`<h6>` raw (usar `<Heading level={N}>`)
- Usar `<button>` raw (usar `<Button>` ou `<IconButton>`)
- Usar modal central em mobile (usar `ResponsiveDrawer` ou `Sheet`)
- Usar `shadow-lg+` em mobile (usar `--shadow-elevation-1` ou bordas)
- Modificar arquivos em `components/ui/` sem razao do DS (sao a base)
- Importar entre features (`components/customers` nao importa de `components/orders`)
- Strings PT-BR hardcoded em JSX (usar `t()`)

### SEMPRE faca

- `<Heading>` e `<Text>` pra tipografia
- `<EmptyState>` em listas que podem estar vazias
- `<Skeleton>` no `loading.tsx` pra telas com fetch
- `<DeleteConfirmation>` (ou `AlertDialog`) pra acoes destrutivas
- `aria-label` em botoes so com icone (via `<IconButton>`)
- `inputMode="numeric"` em inputs de numero
- `pb-nav` em listas dentro do `(shell)` (compensar bottom nav)
- `data-shape`, `data-density`, `data-surface`, `data-palette`, `data-typography` em paginas publicas
- `generateMetadata` em toda rota com conteudo dinamico
- `error.tsx` e `loading.tsx` em route groups
- Consultar `CLAUDE.md` se houver duvida

---

## 2.5 Verificacao obrigatoria antes de commit/PR

```bash
pnpm exec tsc --noEmit     # 0 erros
pnpm exec vitest run        # 401/401 (ou mais)
pnpm lint                   # 0 erros, 0 warnings
pnpm build                  # passa
```

Husky roda lint + tsc no pre-commit e vitest no pre-push automaticamente.

---

## 2.6 Stack de decisoes — quando ha duvida

| Duvida                        | Decisao                                                                                 |
| ----------------------------- | --------------------------------------------------------------------------------------- |
| Card ou lista plana?          | Lista plana (`divide-y`) por padrao; card so se for navegavel e heterogeneo             |
| Sheet ou Dialog?              | `ResponsiveDrawer` (sheet desktop / drawer mobile); `Dialog` so pra confirmacao simples |
| Modal central?                | Nunca em mobile. Desktop: so pra confirmacao                                            |
| Pagina nova ou Sheet?         | Sheet por padrao; pagina so se houver subnavegacao                                      |
| Tabs ou secoes?               | Tabs se <= 4 e conteudo paralelo; secoes se >= 5 ou hierarquico                         |
| Inline action ou menu?        | Inline se <= 2 acoes; `DropdownMenu` se >= 3                                            |
| CSS transition ou Motion?     | CSS pra hover/focus/active; Motion pra entrada/saida/layout/gestos                      |
| `className` ou token CSS var? | Token se shape/density/palette-aware; `className` pra layout e spacing fixo             |

---

# PARTE 3 — Migrar o legado

## 3.1 Strangler Pattern

Nao reescrever tudo de uma vez. Padrao novo coexiste com legado ate substitui-lo.

### Paginas de referencia

Usar paginas reais bem implementadas como modelo:

| Tipo               | Referencia real              | Notas                                             |
| ------------------ | ---------------------------- | ------------------------------------------------- |
| Listagem           | `/leads`                     | Cards mobile + tabela desktop, filtros, paginacao |
| Detalhe            | `/leads/[id]`                | Breadcrumbs, tabs, metadata dinamica              |
| Dashboard          | `/dashboard`                 | Stats tocaveis, chart, funnel, capture link       |
| Formulario wizard  | `/onboarding`                | 23 steps, persistencia, checkout                  |
| Settings           | `/settings/profile`          | MobileCollapsible, useUnsavedChanges              |
| CRUD               | `/site`                      | SiteHub com CrudManager, ResponsiveDrawer         |
| Formulario publico | `/[slug]/analise/[modality]` | LeadForm, branch logic, brand do PT               |

**Workflow de tela nova:**

1. Identificar o tipo (list/detail/form/dashboard/settings).
2. Abrir a referencia real correspondente.
3. Copiar a estrutura (layout, componentes, spacing).
4. Adaptar dados e logica.
5. NAO mudar espacamentos, hierarquia, ou componentes usados.
6. Rodar lint + build antes de declarar pronto.

---

## 3.2 Estrutura por tipo de tela

### Listagem

```
1. Sticky header (titulo via <Heading level={1}> + acao primaria a direita)
2. Search input + chips de filtro (scroll horizontal)
3. Lista (<ListItem> mobile + <DataTable> desktop, ou cards + tabela raw com tokens DS)
4. Paginacao ou infinite scroll
5. <EmptyState> se vazio
6. pb-nav pra compensar bottom nav
```

### Detalhe

```
1. <Breadcrumb> (Dashboard → Secao → Nome)
2. Header com voltar + titulo + acoes secundarias
3. Hero (info principal)
4. <Tabs> ou secoes de conteudo
5. <StickyActionBar> com CTA primario no fundo (mobile)
```

### Formulario

```
1. Header com voltar + titulo
2. Single column (NUNCA 2 colunas em mobile)
3. Inputs com label acima, validacao inline (react-hook-form + Zod)
4. Inputs >= 48px altura, >= 16px fonte (iOS zoom prevention)
5. inputMode correto (numeric, email, tel, url)
6. <StickyActionBar> com submit (full-width mobile)
7. useUnsavedChanges pra warning de beforeunload
```

### Dashboard / Home

```
1. Header com avatar/contexto
2. Stats cards tocaveis (Link → detail)
3. Chart com overflow-x-auto (scroll horizontal mobile)
4. Lista de atividade recente (3-5 itens)
5. Link "Ver todos" pra listagem completa
```

### Settings

```
1. Layout com sidebar desktop / MobileCollapsible mobile
2. Formularios com useUnsavedChanges
3. showCount em textareas (bio, descricoes)
4. Toast feedback em save
```

---

## 3.3 Estados obrigatorios em toda lista/dashboard

| Estado                     | Componente                               | Padrao                                             |
| -------------------------- | ---------------------------------------- | -------------------------------------------------- |
| Loading                    | `loading.tsx` com `<Skeleton>`           | Replicar layout final                              |
| Empty                      | `<EmptyState>`                           | Icone Lucide + titulo + descricao + CTA            |
| Error                      | `error.tsx` com `<SectionErrorBoundary>` | Mensagem + "Tentar novamente"                      |
| Loaded vazio vs nunca teve | Copy diferente                           | "Nenhum resultado pra X" vs "Voce ainda nao tem Y" |

---

## 3.4 Migracao de telas existentes

### Auditoria

Rodar analise de codigo nas rotas existentes verificando:

- [ ] Mobile layout (375px)
- [ ] Componentes DS usados (nao raw `<table>`, `<button>`, `<h1>`)
- [ ] Data attributes em paginas publicas
- [ ] `generateMetadata`
- [ ] `loading.tsx` e `error.tsx`
- [ ] Breadcrumbs em detail pages
- [ ] Toast feedback em acoes
- [ ] Bottom nav nao cobre conteudo
- [ ] Strings via `t()`, nao hardcoded
- [ ] Hex inline → tokens

### Priorizacao

1. **Paginas publicas** (compartilhaveis — SEO, brand, share) — prioridade maxima
2. **Dashboard** (uso diario do profissional) — prioridade alta
3. **Settings** (configuracao) — prioridade media
4. **Admin** (interno) — prioridade baixa

---

# ANEXOS

## Anexo A — Tokens resumo rapido

### Cores

```
bg-background / bg-card / bg-muted / bg-primary / bg-destructive
text-foreground / text-card-foreground / text-muted-foreground / text-primary-foreground
border / ring
```

### Tipografia

```tsx
<Heading level={1}>H1 — 28px semibold</Heading>
<Heading level={2}>H2 — 20px semibold</Heading>
<Heading level={3}>H3 — 16px semibold</Heading>
<Text variant="body-large">16px body</Text>
<Text variant="body">14px body (default)</Text>
<Text variant="body-small">13px body</Text>
<Text variant="label">11px UPPERCASE kicker</Text>
<Text variant="micro">10px fine print</Text>
<Text variant="muted">14px muted</Text>
<Text variant="mono">14px monospace</Text>
```

### Shape

```
rounded-[var(--shape-button)]  — botoes, inputs, selects, textareas
rounded-[var(--shape-card)]    — cards, dialogs, sheets, surfaces
rounded-[var(--shape-badge)]   — badges, tags
rounded-full                   — avatares (sempre circular)
```

### Density

```
p-[var(--density-pad-y)]_[var(--density-pad-x)]  — padding de containers
gap-[var(--density-gap)]                          — gap entre elementos
```

### Motion

```
--motion-instant (80ms) / --motion-fast (150ms) / --motion-normal (250ms) / --motion-slow (400ms)
--ease-smooth / --ease-spring / --ease-scene / --ease-out
```

### Elevacao

```
shadow-[var(--shadow-elevation-1)]  — cards, hover
shadow-[var(--shadow-elevation-2)]  — popovers
shadow-[var(--shadow-elevation-3)]  — modais
```

---

## Anexo B — Comandos de instalacao e manutencao

```bash
# Instalar componente shadcn
pnpm dlx shadcn@latest add [componente]

# Instalar block shadcn (dashboard, sidebar, data-table)
pnpm dlx shadcn@latest add [block-name]

# Verificacao completa
pnpm exec tsc --noEmit && pnpm exec vitest run && pnpm lint && pnpm build

# Detectar codigo morto
pnpm dlx knip

# Dev server
pnpm dev
```

---

## Anexo C — Checklist de tela nova

```
[ ] Tipo identificado (list/detail/form/dashboard/settings)
[ ] Referencia real aberta e copiada
[ ] <Heading> e <Text> pra tipografia (zero raw h1-h6, zero raw text classes)
[ ] Componentes de components/ui/ usados (zero recriacao)
[ ] Data attributes setados (se pagina publica)
[ ] generateMetadata (se conteudo dinamico)
[ ] loading.tsx com Skeleton
[ ] error.tsx com SectionErrorBoundary
[ ] EmptyState em listas
[ ] pb-nav se dentro do (shell)
[ ] Mobile 375px testado
[ ] Touch targets 44px+
[ ] Inputs >= 16px (iOS zoom)
[ ] inputMode correto
[ ] Strings via t() (nao hardcoded)
[ ] Zero hex inline
[ ] Zero valores arbitrarios
[ ] pnpm exec tsc --noEmit passa
[ ] pnpm lint passa
[ ] pnpm build passa
```

---

## Anexo D — Z-index hierarchy

| Nivel  | Uso                           |
| ------ | ----------------------------- |
| `z-50` | Modais, sheets, dialogs       |
| `z-40` | Sticky headers, bottom nav    |
| `z-30` | Popovers, dropdowns, tooltips |
| `z-20` | Floating action buttons       |
| `z-10` | Elevated cards                |
| `z-0`  | Base                          |

---

## Anexo E — Performance targets

| Metrica | Target  |
| ------- | ------- |
| LCP     | < 2.5s  |
| FID     | < 100ms |
| CLS     | < 0.1   |
| FCP     | < 1.8s  |

Ferramentas: Vercel Analytics + Vercel Speed Insights (ja instalados).

---

## Glossario

- **OKLCH**: modelo de cor perceptualmente uniforme (Lightness, Chroma, Hue). CSS Color Level 4.
- **APCA**: Advanced Perceptual Contrast Algorithm. Substituicao proposta do WCAG 2.x contrast ratio.
- **Shape system**: border-radius dinamico via `data-shape` (rounded/sharp/soft).
- **Density system**: espacamento dinamico via `data-density` (tight/cozy/roomy).
- **Surface system**: separacao de accent entre UI interna (brand fixo) e publica (palette do PT).
- **Multi-tenant**: cada profissional personaliza visual (cor, shape, density, tipografia, modo).
- **Strangler Pattern**: migrar aos poucos; novo coexiste com legado ate substitui-lo.
- **Bottom nav pill**: navegacao inferior flutuante (estilo app nativo).
- **Safe area**: zonas do display ocupadas por notch/home indicator (iOS).
- **Skeleton**: placeholder animado durante loading, replicando layout final.

---

## Resumo de uma frase

OKLCH + APCA + componentes semanticos (`<Heading>`, `<Text>`) + shape/density/surface dinamicos + ESLint strict + Husky pre-commit + i18n obrigatorio = design system multi-tenant que se auto-policia e escala pra N profissionais sem inconsistencia.
