# 05 — Design System

> **Status:** accepted · **Versão:** 2026-05-17 · **Supersede:** —
> 13 paletas OKLCH + APCA dual-gate + Motion 12 presets + shadcn customização + Lucide.
> Causa raiz: ausência de DS dia 1 no onboarding-bio gerou 186 heading violations + 144 typography warnings.

---

## 1. Princípios canônicos

1. **shadcn new-york dark-first 100%** — copy-paste own files (D-G10 + _CONFLITOS #8).
2. **OKLCH tokens com hue do tenant** — coração do white-label. Tudo deriva.
3. **APCA Lc dual-gate** (Bronze): body ≥75, large ≥60, non-text ≥45. WCAG 2.2 AA como fallback.
4. **Sombras tingidas com hue do brand** — diferencial #1 invisível-mas-sentido.
5. **`tabular-nums` + spacing 8-pt + line-height rítmica** = 80% da percepção "designed".
6. **Motion 12 springs > tweens.** 3 presets (snappy/soft/pop). Material 3 easings literais.
7. **`backdrop-filter` apenas em header sticky condicional.** Nunca em cards (GPU mid-tier Android).
8. **`layoutId` Motion** pra shared elements; **View Transitions Next 16** pra fade entre rotas.
9. **Light mode ≠ dark invertido** — sombras tingidas, tracking ajustado, antialiasing diferente, borders por cor sólida.
10. **Rauno's law:** robustness > novelty. Ações frequentes sem animação. Milestones com bounce.

Detalhes: pesquisa 16 §10 (10 princípios canônicos).

---

## 2. 13 paletas OKLCH oficiais (D-G76)

Migra verbatim de `app/preview/paletas/page.tsx` → `lib/design/palettes.ts`.

| # | id | Nome | Hue | Identidade | Default pra |
|---|---|---|---|---|---|
| 1 | `default` | Padrão | 275 | Indigo Stripe equilibrado | SaaS default |
| 2 | `indigo` | Indigo Profissional | 264 | Sóbrio corporativo | Coaching, mentoria |
| 3 | `rose` | Rosé Wellness | 15 | Feminino wellness | Pilates, dança, estética |
| 4 | `terracotta` | Terracota Earthy | 40 | Quente terroso | Yoga, terapia, holístico |
| 5 | `sage` | Sálvia Calmo | 145 | Verde calmo | Mindfulness, nutri |
| 6 | `navy` | Navy Performance | 260 | Azul profundo atleta | Treinamento profissional |
| 7 | `mustard` | Mostarda Vibrante | 80 | Amarelo retrô | Branding ousado |
| 8 | `coral` | Coral Vibrante | 25 | Vermelho-laranja energia | Functional, HIIT |
| 9 | `pure` | Puro | 0 | Grayscale puro | Minimalista premium |
| 10 | `minimal-warm` | Mínima Quente | 50 | Off-white wabi-sabi | Japandi, premium quiet |
| 11 | `performance` | Performance Neon | 25 | Vermelho saturado P3 | Crossfit, calistenia |
| 12 | `carbon` | Carbon Athletic | 250 | Gunmetal mono + signal | Whoop-style, hardcore |
| 13 | `neon` | Neon Rave | 320 | Magenta neon cyberpunk | Underground fitness, jovem |

**Estrutura por paleta:** primary + primaryLight (light mode override) + secondary (+30° hue) + tertiary (-30° hue) + 5 extras (multicolor charts/badges) + 5 surfaces dark + 5 surfaces light + on-* APCA-derived = **~21 tokens efetivos**.

**Surfaces:** dark L 0.13→0.37 chroma 0.015; light L 0.98→0.85 chroma ramp 0.01→0.015. Hint sutil do hue, nunca dominante.

Adicionar 14ª paleta = pivot (00-PROJETO §8).

Decisão fechada: master plan §7.3 + D-G76.

---

## 3. Tokens Tailwind v4 (`@theme` em `app/globals.css`)

Padrão CSS-first, sem `tailwind.config.js`:

| Token category | Naming | Exemplo |
|---|---|---|
| Cores semânticas | `--color-<role>` | `--color-primary`, `--color-foreground`, `--color-muted-foreground` |
| Surfaces | `--color-<surface>` | `--color-background`, `--color-card`, `--color-popover`, `--color-muted`, `--color-border`, `--color-input` |
| Charts (5 extras) | `--color-chart-N` | `--color-chart-1` a `--color-chart-5` |
| Semantics fixos | `--color-<state>` + `--color-<state>-foreground` | `--color-info`, `--color-success`, `--color-warning`, `--color-destructive` |
| Sidebar (shadcn 2.0) | `--color-sidebar-*` | `--color-sidebar`, `--color-sidebar-primary`, etc |
| Radius | `--radius` (base) + `--radius-{sm,md,lg,xl}` | base 0.625rem; derivados via `calc()` |
| Font | `--font-sans`, `--font-mono`, `--font-brand` | Geist Sans + Geist Mono via `next/font` |

**Estratégia:** `:root` define valores OKLCH crus, `.dark` overrides. `@theme inline` mapeia `--color-X: var(--X)` — permite override runtime (white-label) sem rebuild.

Detalhes: pesquisa 05 §2 (snippet completo `globals.css`).

---

## 4. White-label runtime (D-G59)

**CSS via API route** `/api/tenants/[id]/theme.css?v=N`:
- Layout root referencia `<link rel="stylesheet">` em `<head>` (render-blocking, zero FOUC, zero JS)
- Route handler emite CSS texto puro com whitelist + regex OKLCH
- Cache `public, max-age=31536000, immutable` + cache-bust por `?v=theme_version`
- **Zero `dangerouslySetInnerHTML`** (preserva política zero-disable)
- Mutação theme → `revalidateTag(\`tenant-theme:${id}\`)` + bump `theme_version`

`deriveTokens(palette, mode)` em `lib/design/tokens.ts`:
1. Resolve hue base + chroma alvo da `PaletteSpec` Zod-validada
2. Gera primary/secondary/tertiary com tones fixos por papel + `culori.clampChroma` (sRGB-safe)
3. on-* via bisection APCA até atingir minLc
4. 5 surfaces dark/light com chroma sutil do hue
5. Foreground/card-fg/popover-fg bisection até Lc 90; muted-foreground até Lc 75
6. chart-1..5 com offsets fixos do hue (split-complementary)
7. `formatCss` emite OKLCH numérico (nunca string do tenant)

Performance: ~3-5ms por tenant em Edge runtime. Defesa em profundidade: Zod enum em palette_id + regex OKLCH em cada valor antes de emitir.

Detalhes: pesquisa 05 §3-§6 + master plan §7.7.

---

## 5. APCA dual-gate (D-G12)

**Thresholds (`lib/design/contrast.ts`):**
- body: Lc ≥ 75 (APCA Bronze)
- large text / UI grande: Lc ≥ 60
- non-text (ícones, borders, focus rings): Lc ≥ 45
- WCAG 2.x AA fallback: ratio ≥ 4.5 body, ≥ 3 large

**Helpers:**
- `apca(fg, bg): number` — APCA Lc signed
- `meetsApca(fg, bg, role): boolean`
- `ensureAccessible(fg, bg, minLc): OklchColor` — bisection L até atingir
- `pickReadableForeground(bg): OklchColor` — black ou white por |Lc| máximo

**CI gate** `pnpm color:audit` falha se par fg/bg do tenant não atinge thresholds. Script roda contra 13 paletas × 2 modes × pares semânticos.

Tenant branding: ao salvar `theme_tokens`, server action chama `ensureAccessible()` — rejeita se não atinge Lc 60.

Detalhes: pesquisa 08 §B + master plan §14.4.

---

## 6. Motion 12 presets (`lib/motion/presets.ts`)

Material 3 motion tokens verificados.

**Durations (utility PWA, não marketing):**
| Token | ms | Uso |
|---|---|---|
| `xs` | 120 | Hover-out, color tick |
| `sm` | 180 | Button press, small fades |
| `md` | 260 | Sheets, drawers, modals |
| `lg` | 440 | Shared element, route transitions |

**Easings (M3 literais cubic-bezier):**
| Token | cubic-bezier | Uso |
|---|---|---|
| `standard` | `[0.2, 0, 0, 1]` | Default |
| `emphasized` | `[0.2, 0, 0, 1]` | Hero / shared element (mesma curva, duration maior) |
| `emphasizedDecel` | `[0.05, 0.7, 0.1, 1]` | Sheets entering |
| `emphasizedAccel` | `[0.3, 0, 0.8, 0.15]` | Sheets dismissing |

**Springs:**
| Preset | stiffness | damping | mass | Uso |
|---|---|---|---|---|
| `gentle` | 170 | 26 | 1 | Drawer slide, accordion |
| `snappy` | 400 | 30 | 0.8 | Button press, modal pop |
| `bouncy` | 500 | 18 | 1 | Check-in completed, streak +1 |

**`MotionConfig reducedMotion="user"`** no root — automático em todos children. Skip transform/layout em reduced motion; opacity/color ainda animam.

**Anti-patterns proibidos (pesquisa 08 §A10):**
- `motion.create()` dentro de render — define no module top level
- `layout` em cada row de lista longa — use `layoutDependency` ou pai
- Animar `width/height/top/left` — use `transform`/`opacity` ou `layout`

`ClientMotion wrapper pattern` (pesquisa 08 §A7): `components/motion/client.tsx` é único `'use client'` que re-exporta `{ motion, AnimatePresence, MotionConfig, LayoutGroup, useReducedMotion }`. Server Components importam dali, mantêm children server-rendered.

---

## 7. shadcn customização — sem virar Frankenstein

shadcn é **copy-paste** — você OWN os arquivos. Edite gerados; crie wrapper só pra variante radicalmente nova.

**Regras (pesquisa 16 §4):**
- `data-slot` em compound components (convenção oficial shadcn changelog mar/2026)
- cva max **5 variants** por componente; edge-case vira componente separado (`<LoadingButton>`)
- Slot pattern Radix para polimorfismo (`asChild`)
- Composição com Radix headless direto quando shadcn não cobre (tooltip seta custom, hover-card timing)

**Tipografia primitives obrigatórios dia 1** (custom em `components/ui/`):
- `<Heading level={1..6} variant>` + asChild
- `<Text variant="body|compact|data|code|eyebrow|label|caption|lead">`
- `<Eyebrow>` (label uppercase pequeno)
- `<Metric value unit delta>` (número grande + delta colored)
- `<DataCell label value>`
- `<Code inline|block>`
- `<Section title? description? tone>`
- `<Stack direction gap>`
- `<Container>` (max-width + padding tokens)
- `<VisuallyHidden>` (SR-only)
- `<EmptyState>` (wrapper shadcn `Empty` com defaults)
- `<Divider>` (re-export Separator com tokens)

Razão: ausência destes primitives custou 330+ violações no onboarding-bio.

Detalhes: pesquisa 06 §A (12 primitives final).

---

## 8. Card variants

4 genéricos + 4 específicos do PWA aluno (composições):

**Genéricos:**
| Variant | Uso | Visual |
|---|---|---|
| `default` | 80% casos | `border bg-card shadow-sm` |
| `outlined` | Lists, secondary | `border-2 border-muted bg-transparent shadow-none` |
| `interactive` | Whole-card clickable | `cursor-pointer hover:shadow-md hover:scale-[1.01] active:scale-[0.99]` |
| `featured` | 1 por seção | `border-2 border-primary bg-primary/5` |

**PWA aluno (composições):**
| Variant | Caso | Composição |
|---|---|---|
| `hero` | Card "Hoje" no Início (~45% viewport) | `CardImage 16/9` + `CardEyebrow` + `CardTitle` + `CardMeta` + `CardCTA h-14 w-full` |
| `media` | Exercício / vídeo-aula em listas | `CardThumb 1/1` + `CardTitle sm` + `CardMeta` |
| `metric` | Métricas no Perfil/Progresso | `Metric value unit delta` + `CardLabel` |
| `entity` | Aluno na lista do prof (whole-card link) | `Avatar` + `CardTitle` + `Badge` + `CardActions stopPropagation` |

Detalhes: master plan §8.1.

---

## 9. Alert variants

4 semânticos (left-border 3px na cor):

| Variant | Cor semântica | Ícone Lucide | Uso |
|---|---|---|---|
| `default` (info) | blue | `<Info />` | Informação neutra |
| `success` | green | `<CheckCircle />` | Confirmação positiva |
| `warning` | amber | `<AlertTriangle />` | Atenção, ação reversível |
| `destructive` | red | `<AlertCircle />` | Erro, irreversível |

Toast (sonner) usa mesmas 4 via `toast.success/error/warning/info()`.

---

## 10. Iconografia — Lucide React

**Decisão:** `lucide-react` como única lib de ícones (pesquisa 06 §B). Razões:
- Stroke 1.5-2 geométrico bate shadcn new-york
- ~1.500+ ícones incluindo fitness (Dumbbell, BicepsFlexed, HeartPulse, Activity, Timer, Flame, Scale, Footprints, Target, Trophy)
- ~0.1-0.5 KB gzipped por ícone tree-shaken
- RSC-safe (zero hooks, pure SVG)
- `LucideIcon` type pra prop forwarding

**Import pattern (lint enforce):**
- Named imports SEMPRE: `import { Dumbbell } from 'lucide-react'`
- ESLint `no-restricted-imports` bane `import * as Icons from 'lucide-react'` (defeats tree-shake)

**Sprite custom** em `/public/icons/sprite.svg` (build-time via `pnpm icons:build`):
- Pra glyphs fitness não cobertos por Lucide (kettlebell, plate, sets-reps diagram, periodization)
- 20% restante; threshold de adoção: 5+ ícones com estilo unificado
- `currentColor` em todos paths — herda da `text-*` parent
- Componente `<Icon name="...">` typed via `IconName` codegen union
- Build script reads `components/icons/_source/*.svg` + SVGO + emit sprite + types

**Size tokens (Tailwind v4 native `size-N`):**
| Token | Tailwind | px | Pairs with |
|---|---|---|---|
| `icon-xs` | `size-3` | 12 | Eyebrow, inline text-xs |
| `icon-sm` | `size-4` | 16 | body, Button default, Badge |
| `icon-md` | `size-5` | 20 | h4, large Button |
| `icon-lg` | `size-6` | 24 | h2/h3, Card headers |
| `icon-xl` | `size-8` | 32 | display-md, Hero |
| `icon-2xl` | `size-10`-`size-12` | 40-48 | display-lg, splash |

**A11y patterns:**
- Decorative (texto adjacent): `<Dumbbell aria-hidden className="size-4" />`
- Standalone semântico: `<HeartPulse role="img" aria-label="..." />`
- Icon-only button: `<button aria-label="..."><Icon aria-hidden /></button>`
- **Nunca double-label** (aria em ambos icon + button)

Detalhes: pesquisa 06 §B + master plan §8.6.

---

## 11. Patterns visuais premium dia 1 (todos [E])

Sprint 1 Foundation (~30h — pesquisa 16 §10 tabela final):

1. **OKLCH tokens system** — 3 níveis surfaces + tinted shadows (`oklch(var(--brand-l)...)`)
2. **Typography 8-pt scale + tabular-nums + Inter ss01** — line-height rítmica `text-{xs,sm,base,lg,xl,2xl,3xl,4xl}`
3. **shadcn new-york + 5 cva variants curados** (Button/Card/Badge/Input/Dialog)
4. **Compound Card com `data-slot` pattern** — permite styling externo via `[&_[data-slot=card-title]]`
5. **White-label runtime: `--brand-h/c` injection + 13 paletas testadas** (D-G59)
6. **Skeleton shimmer custom** (substitui pulse default) — `background-attachment: fixed` unifica shimmer através múltiplos elementos
7. **Vaul bottom-sheet customizado** + handle + `safe-area-inset-bottom`
8. **Tab bar com `layoutId` Motion indicator** — sliding pill animado entre tabs
9. **Header sticky com blur condicional** (threshold scroll > 8px) — backdrop-filter só quando scrolled
10. **Sonner customizado** — tokens próprios, durations curadas (success 3s, info 3.5s, error 5s)
11. **Motion springs preset** + `whileTap={{scale:0.97}}` em CTAs
12. **`theme-color` por rota + manifest + splash iOS**

Sprint 2 Polish [I] (~20h) e Backlog [O]: pesquisa 16 §10 tabela completa.

**Cortado permanente:** Confetti em milestone (não-premium); Three.js (negativo); Pull-to-refresh custom (mid-tier Android GPU); SVG sprite fitness (até Lucide não cobrir caso real).

---

## 12. Brand assets — zero inline (00-PROJETO §9)

| Asset | Onde vive | Trocar = |
|---|---|---|
| Cor da marca desafit | 1 token OKLCH em `@theme` | editar 1 var → propaga 100% |
| Logo desafit | 1 SVG via componente `<Logo>` único | editar 1 SVG → propaga 100% |
| Tipografia brand | `--font-brand` em `@theme` | editar 1 var → propaga 100% |
| Nome `"desafit"` / `"desafit.app"` | `<Logo>` ou metadata centralizada | ESLint bloqueia literal fora de allowlist |

**Recursivo pra tenant white-label:** cor, logo, fonte, nome de cada tenant vivem em CSS via API route (D-G59). Zero hardcode, troca em runtime.

**Logo system dia 1 (~6h, master plan §16 Bootstrap):**
- Wordmark "desafit.app" em Geist Sans pro MVP
- SVG vetorial customizado fica como pendência pós-MVP
- Componente `<Logo>` único: wordmark + lockup + icon variants × 3 temas × 3 tamanhos
- ESLint rule bloqueia literal "desafit" / "desafit.app" fora de allowlist

Razão: incidente onboarding.bio teve `onbio` / `o.b` / `onboarding.bio` / sem logo coexistindo em headers diferentes. Não repetir.

---

## 13. Catálogo de componentes — Ladle (_CONFLITOS #13)

**Ladle dia 0** (não Storybook):
- Vercel-mantida, 5× mais rápida que Storybook
- Sintaxe `*.stories.tsx` compatível pra migrar depois
- MDX nativo, hot reload React 19

**Conteúdo dia 0:**
- ~15 componentes shadcn customizados
- 13 paletas OKLCH (showcase visual)
- Logo system (3 variantes × 3 temas × 3 tamanhos)
- Motion presets (6 duration × 5 easing)
- Skeleton/loading states
- Vaul bottom sheet
- Toggle Edit/Preview
- NumberStepper
- Tab bar com indicator

**Alternativa rejeitada:** Storybook (overhead alto pra solo, Claude lê código direto sem precisar de stories). Detalhes em pesquisa 14 §C.

---

## 14. Sheet vs Dialog vs Drawer — decision tree

| Caso | Componente |
|---|---|
| Filtros mobile, edit rápido, timer descanso, confirm destructive mobile | **vaul Drawer** (snap points) |
| Forms críticos desktop, alertas, modais bloqueantes desktop | shadcn `<Dialog>` |
| Nav drawer desktop, cart lateral | shadcn `<Sheet>` |
| Modal que precisa ser mobile-sheet + desktop-dialog | `<ResponsiveModal>` (wrapper híbrido) |

vaul `snapPoints={[0.5, 0.92]}` + `repositionInputs={true}` + `modal` + `shouldScaleBackground={false}` (anti black flash).

---

## 15. Anti-patterns proibidos

Pesquisa 16 §9 (todos com fonte):

1. **Glassmorphism pesado em PWA Android mid-tier** — max 2 backdrop-filters simultâneos; nunca em scroller children
2. **Neumorphism** — morreu (contraste insuficiente WCAG AA + não escala white-label)
3. **3D/Three.js em produto utilitário** — bundle bloat 600KB (destrói budget 240KB)
4. **Animação em cada interação** — Rauno: "actions frequent and low in novelty should avoid extraneous animations"
5. **Tailwind UI / shadcn default genérico** — sem custom layer, copy-paste visível
6. **Imagery Unsplash genérica** — identidade fraca; use foto custom + brand tint overlay
7. **Gradients arco-íris desfocados** — pico 2021-2022; tendência é monocromático + 1 accent
8. **Bordas pretas puras `#000`** em dark — somem hierarquia. Use `oklch(1 0 0 / 0.08)`
9. **`box-shadow: rgba(0,0,0,...)`** em dark — somem. Combine inner highlight + outer dark
10. **`transition: all`** — relayout caro. Use `transition-colors`, `transition-transform`
11. **Confetti em UI repetitiva** — só em milestone genuíno (PR batido, 7+ dias)
12. **`whileHover` em touch** — Motion #1179 stuck state. Use `whileTap` + `whileFocus` only

---

## Referências

- `00-PROJETO.md` §8 (hierarquia premium) · §9 (brand zero inline)
- `_CONFLITOS.md` #8 (shadcn 100%) · #9 (critério premium) · #13 (Ladle) · #16 (pipeline UI dia 0)
- Master plan §7 (tokens OKLCH) · §8 (UI primitives) · §9 (shadcn cobertura) · §14 (a11y APCA)
- Pesquisa 05 (DS tokens 13 paletas) · 06 (primitives + Lucide) · 08 (Motion 12 + APCA) · 16 (visual premium completo)

## Histórico

| Data | Mudança | Aprovador |
|---|---|---|
| 2026-05-17 | Versão inicial — 13 paletas + APCA + Motion presets + Lucide + Ladle | Leandro |
