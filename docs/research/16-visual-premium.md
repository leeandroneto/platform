# Visual premium para desafit.app — research técnica densa

**Stack assumida**: Next.js 16 App Router · React 19 · TypeScript strict · Tailwind v4 CSS-first @theme · shadcn new-york dark-first · Motion 12 (motion/react) · vaul · Lucide · Supabase · pnpm · 13 paletas OKLCH multi-tenant · budget 170–240KB First Load JS · PWA mobile-first.

**Convenções**: `[E]` essencial dia 1 · `[I]` incremental · `[O]` over-engineering. Confiança: **alta** (fonte direta 2024–2026), **média** (inferência sólida), **baixa** (especulativa — sempre marcado).

---

## BLOCO 1 — Benchmark de produtos premium 2024–2026

### Web/Desktop

#### Linear — confiança alta (fontes: `linear.app/now/how-we-redesigned-the-linear-ui`, `linear.app/now/behind-the-latest-design-refresh`, `linear.app/changelog/2024-03-20-new-linear-ui`)

- **5 elementos premium**: (1) densidade calibrada — sidebar enxuta com favoritos/folders, headers redesenhados para reduzir ruído; (2) escala 8-pt pura; (3) tema padrão refresh 2025/2026 deslocado de cool-blue para warmer-gray com chroma baixíssimo (~0.03) mantendo "personalidade neutra"; (4) chrome em "L invertido" enquadrando densidade de conteúdo; (5) contraste aumentado em ambos modos. Time usa Claude Code/Cursor para construir dev toolbar com color picker interno — manipulam L/C/H individualmente.
- **NÃO copiar**: Magic Blue legado, qualquer wow-factor — Linear é deliberadamente _calm_.
- **Replicável shadcn/Tailwind v4**: 100%. shadcn new-york + tokens OKLCH com chroma 0.02–0.04 + spacing-8 já é 80%.

#### Vercel dashboard — confiança alta (fontes: `rauno.me/craft/interaction-design`, observação pública)

- **5 elementos**: (1) Geist sans + Geist Mono (open-source, npm `geist`); (2) monocromático puro, accent seletivo; (3) tabular-nums em todas métricas; (4) transições instantâneas, sem decoração; (5) Rauno's law explícito: _"Actions that are frequent and low in novelty should avoid extraneous animations. Core interactions — scrolling, text input, navigation — must always work perfectly. If your UI only works 80% of the time, the perception of quality breaks. It's lipstick on a pig."_
- **NÃO copiar**: animação em cada interação.
- **Replicável**: muito alto. Geist via npm.

#### Raycast — confiança alta

- **5 elementos**: (1) command palette first-class; (2) dark-first profundo (`oklch(~0.14 0.01 280)`); (3) rounded-md generoso; (4) hover states sub-sutis (background opacity 4–6%); (5) iconografia com gradient sutil + SF-Pro-like + lista densa (28–32px row height).
- **NÃO copiar**: estética comando se você não é palette.
- **Replicável**: alta — `cmdk` (Paco Coursey, ex-Linear/Vercel) + shadcn Command.

#### Stripe Dashboard — confiança média-alta

- **5 elementos**: (1) gráficos calmos com 1 cor + grayscale; (2) tabular-nums everywhere; (3) indicadores numéricos com setinha de tendência em chroma baixo; (4) hover de tabela `bg-muted/40`; (5) divisores `border-foreground/5`; spacing 8/12/16/24/32 estrito.
- **NÃO copiar**: navegação multi-nível profunda Stripe.
- **Replicável**: alta com shadcn Table + Recharts.

#### Notion — confiança alta

- **4 elementos**: (1) hover-reveal de affordances (drag handle, +); (2) tipografia editorial line-height 1.5+; (3) neutros warm em light; (4) seleção com gradient sutil.
- **NÃO copiar**: densidade toolbar mobile — quebra em PWA.
- **Replicável**: parcial — drag-and-drop precisa `dnd-kit`.

#### Cal.com — confiança alta (`github.com/calcom/cal.com`)

- **4 elementos**: (1) shadcn customizado profundamente — código aberto, estude `apps/web/components/ui`; (2) Inter font; (3) brand teal com chroma controlado; (4) cards `border-border/40` apenas.
- **NÃO copiar**: nada — é tipo de produto B2B SaaS muito similar.
- **Replicável**: 100% — é shadcn + Tailwind, com o detalhe que eles têm sistema próprio de tokens semânticos por feature.

#### Height — confiança média (observação pública)

- **4 elementos**: (1) Linear-like com mais cor; (2) status pills com chroma médio; (3) bulk action bar sticky com soft shadow; (4) keyboard-first.
- **NÃO copiar**: complexidade kanban+timeline em PWA mobile.
- **Replicável**: alta.

#### Pitch — confiança média

- **4 elementos**: (1) gradientes sutis em hero de slide; (2) transições suaves entre states; (3) sidebar com thumbnails miniatura; (4) cursor remoto collab.
- **NÃO copiar**: gradientes em UI app — funciona em editor de slides, não em fitness app.
- **Replicável**: parcial.

#### Arc — confiança média

- **5 elementos**: (1) sidebar colorida por workspace (gradient OKLCH-like); (2) blur translúcido pesado em chrome; (3) "Easels" creative space; (4) atalhos `⌘T` que substituem URL bar; (5) Boosts (CSS custom por site).
- **NÃO copiar (CRÍTICO)**: blur translúcido pesado — Arc é app nativo (Swift), permite blur de GPU dedicado. Em PWA Android mid-tier mata frame rate.
- **Replicável**: baixa para PWA.

#### Superhuman — confiança média

- **4 elementos**: (1) atalhos de teclado expostos visualmente em cada UI element; (2) animação "swipe to archive" com physics; (3) tipografia editorial; (4) AI summary inline com tint visual.
- **NÃO copiar**: keyboard-first em mobile PWA fitness — público diferente.
- **Replicável**: spring physics em swipe — sim, via Motion drag.

### Mobile/PWA

#### Apple Fitness+ — confiança média (sem fonte técnica pública)

- **4 elementos**: (1) hero images com overlay gradient bottom-to-top (preto 60% → transparente); (2) tipografia SF Pro Display Bold seguido SF Pro Text Regular em meta; (3) tab bar tint contextual do acento da rota; (4) cards com aspect-ratio 4:5 em listas.
- **NÃO copiar**: vídeo background autoplay (custa GPU + bateria).
- **Replicável**: alta — Inter substitui SF Pro.

#### Whoop — confiança média

- **5 elementos**: (1) dark profundo `oklch(~0.12 0.01 240)`; (2) donut chart como signature visual; (3) números enormes tabular-nums (Strain, Recovery); (4) accent verde-limão `oklch(~0.85 0.18 130)` único; (5) cards com border `oklch(1 0 0 / 0.06)`.
- **NÃO copiar**: donut chart em todo lugar — é signature deles.
- **Replicável**: alta — Recharts ou Visx + custom donut.

#### Strava dark mode — confiança média

- **4 elementos**: (1) orange brand `oklch(~0.70 0.20 40)`; (2) mapas com tint laranja em rotas; (3) cards border ghost; (4) segment leaderboard com tipografia tight.
- **NÃO copiar**: gamificação heavy (Kudos) se seu produto não é social.
- **Replicável**: média.

#### Pillar (workout app) — confiança baixa-média

- **3 elementos**: (1) bottom-sheet com snap points para set logging; (2) números grandes em séries/reps tabular-nums; (3) timer circular em rest period.
- **NÃO copiar**: nada óbvio.
- **Replicável**: alta — exatamente seu caso de uso.

#### Cron / Notion Calendar — confiança média

- **4 elementos**: (1) grade densa com altura uniforme; (2) drag de evento com spring suave e ghost preview; (3) indicador "agora" com layoutId sliding; (4) keyboard shortcuts visíveis.
- **NÃO copiar**: complexidade calendar week-view em mobile portrait.
- **Replicável**: drag + layoutId via Motion.

#### Apple Music — confiança média

- **4 elementos**: (1) Color extraction de album art tinta fundo da player view; (2) mini-player sticky bottom com blur seletivo; (3) typography rhythm editorial em hero; (4) lyrics view com active line highlight (layoutId).
- **NÃO copiar**: blur denso no mini-player se Android.
- **Replicável**: color extraction via `node-vibrant` server-side; resto trivial.

### Adjacentes

#### PostHog — confiança alta

- **3 elementos**: (1) brand com handwriting/illustrations em marketing; (2) UI app séria, monocromática; (3) graphs com cores limitadas, sem juicy.
- **NÃO copiar**: handwriting em UI app — só em marketing/empty states criativos.
- **Replicável**: alta.

#### rauno.me — confiança alta (fonte primária)

- **5 princípios documentados**: (1) "follow-through and overlapping action" Disney — quando botão vira input, ícones/labels entram 100–200ms depois; (2) robustness > flair; (3) gesture momentum respeita physics ("swiping a playing card"); (4) ações leves disparam durante gesto, não após release; (5) inputs sempre dentro de `<form>` para Enter funcionar.
- **NÃO copiar**: não há anti-pattern — é meta-design.
- **Replicável**: princípios universais.

---

## BLOCO 2 — Patterns premium SEM glassmorphism pesado

Snippets prontos Tailwind v4 `@theme`. Confiança: alta.

### Token base (`globals.css`)

```css
@import 'tailwindcss';

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  /* Brand — substituído em runtime por tenant */
  --color-brand-h: 250;
  --color-brand-c: 0.18;
  --color-brand-l: 0.62;
  --color-brand: oklch(var(--color-brand-l) var(--color-brand-c) var(--color-brand-h));

  /* Spacing 8-pt base */
  --spacing: 0.25rem;

  /* Easings premium */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-spring-soft: linear(0, 0.5 30%, 1.02 60%, 0.98 75%, 1);

  --radius: 0.625rem;
}

@layer base {
  :root {
    --bg-base: oklch(0.99 0.002 var(--color-brand-h));
    --bg-elevated: oklch(0.985 0.004 var(--color-brand-h));
    --bg-overlay: oklch(1 0 0);
    --border-ghost: oklch(0 0 0 / 0.06);
    --text-strong: oklch(0.15 0.01 var(--color-brand-h));
    --text-muted: oklch(0.5 0.01 var(--color-brand-h));
  }
  .dark {
    --bg-base: oklch(0.145 0.008 var(--color-brand-h));
    --bg-elevated: oklch(0.185 0.01 var(--color-brand-h));
    --bg-overlay: oklch(0.21 0.012 var(--color-brand-h));
    --border-ghost: oklch(1 0 0 / 0.06);
    --text-strong: oklch(0.97 0.003 var(--color-brand-h));
    --text-muted: oklch(0.65 0.012 var(--color-brand-h));
  }
}
```

### 1. Surface elevation system com OKLCH tinted shadows [E]

```css
@theme {
  --shadow-soft-1:
    0 1px 2px -1px oklch(var(--color-brand-l) var(--color-brand-c) var(--color-brand-h) / 0.12),
    0 1px 1px oklch(0 0 0 / 0.04);
  --shadow-soft-2:
    0 4px 6px -2px oklch(var(--color-brand-l) var(--color-brand-c) var(--color-brand-h) / 0.1),
    0 2px 4px -2px oklch(0 0 0 / 0.06);
  --shadow-soft-3:
    0 12px 24px -8px oklch(var(--color-brand-l) var(--color-brand-c) var(--color-brand-h) / 0.14),
    0 4px 8px -4px oklch(0 0 0 / 0.08);
}
```

**GPU**: baixíssimo (estático composita 1x). **Perceptual**: ALTO — sombras coloridas ancoram superfícies ao brand vs cinza universal.

### 2. Border ghost subtle [E]

```css
.border-ghost {
  border: 1px solid var(--border-ghost);
}
/* Fallback robusto */
.border-ghost-fb {
  border: 1px solid color-mix(in oklab, currentColor 8%, transparent);
}
```

**GPU**: zero. **Perceptual**: alto. Linear inteira usa.

### 3. Soft shadows graduadas — token acima (3 níveis)

Sistema 3-tier (1=card hover, 2=card elevated, 3=modal/popover). >3 níveis em PWA mobile diminui legibilidade.

### 4. Inner glow / inset shadow seletivo [I]

```css
.surface-elevated-top {
  box-shadow:
    inset 0 1px 0 0 oklch(1 0 0 / 0.06),
    var(--shadow-soft-2);
}
.light .surface-elevated-top {
  box-shadow:
    inset 0 1px 0 0 oklch(1 0 0 / 0.5),
    var(--shadow-soft-2);
}
```

**GPU**: zero. **Perceptual**: médio-alto. Diferença entre "card flat" e "card que parece vidro polido". Use em CTAs, headers de modal, hero metrics.

### 5. Background gradients tinted sutis [E]

```css
.surface-tinted {
  background: linear-gradient(
    180deg,
    oklch(from var(--bg-base) calc(l + 0.02) c h) 0%,
    var(--bg-base) 100%
  );
}
.surface-brand-tinted {
  background: linear-gradient(
    135deg,
    oklch(from var(--color-brand) 0.2 calc(c * 0.15) h) 0%,
    var(--bg-base) 60%
  );
}
```

`oklch(from var(...))` = CSS Color Level 5 Relative Color, Chrome 119+/Safari 16.4+/Firefox 128+ (fonte: `ishadeed.com/article/css-relative-colors/`). **GPU**: baixo. **Perceptual**: alto.

### 6. Backdrop blur seletivo APENAS em headers/nav [E com restrição]

```css
.app-header-sticky {
  position: sticky;
  top: 0;
  background: oklch(from var(--bg-base) l c h / 0.72);
  backdrop-filter: blur(12px) saturate(1.4);
  -webkit-backdrop-filter: blur(12px) saturate(1.4);
  border-bottom: 1px solid var(--border-ghost);
}
@supports not (backdrop-filter: blur(1px)) {
  .app-header-sticky {
    background: var(--bg-base);
  }
}
@media (prefers-reduced-transparency: reduce) {
  .app-header-sticky {
    backdrop-filter: none;
    background: var(--bg-base);
  }
}
```

**GPU**: ALTO se em lista (cada elemento cria layer + re-rasteriza no scroll — fontes: `openreplay.com`, `uixplor.com`, Android docs). Android avisa: blur radius >150px destrói GPU. **Limite firme: só 1–2 elementos estáticos (header + modal overlay).** **Perceptual**: alto.

### 7. Number tabular-nums em metrics [E]

```css
@theme {
  --font-mono: 'Geist Mono', ui-monospace, SFMono-Regular, monospace;
}
.metric-value {
  font-variant-numeric: tabular-nums;
  font-feature-settings:
    'tnum' 1,
    'ss01' 1;
  letter-spacing: -0.02em;
}
```

**GPU**: zero. **Perceptual**: ALTO. Sem isso, contador animado "dança". Sem negociação.

### 8. Typography rhythm 8-pt + line-height sintonizado [E]

```css
@theme {
  --font-sans: 'Inter', 'Geist', system-ui, sans-serif;
  --text-xs: 0.75rem;
  --text-xs--line-height: 1rem;
  --text-sm: 0.875rem;
  --text-sm--line-height: 1.25rem;
  --text-base: 1rem;
  --text-base--line-height: 1.5rem;
  --text-lg: 1.125rem;
  --text-lg--line-height: 1.75rem;
  --text-xl: 1.375rem;
  --text-xl--line-height: 2rem;
  --text-2xl: 1.75rem;
  --text-2xl--line-height: 2.25rem;
  --text-3xl: 2.25rem;
  --text-3xl--line-height: 2.5rem;
  --text-4xl: 3rem;
  --text-4xl--line-height: 3.25rem;
}
html {
  font-feature-settings: 'cv11', 'ss01', 'ss03';
  text-rendering: optimizeLegibility;
}
```

Tracking: `-0.02em` em ≥24px, `0` em 16–20px, `+0.01em` em ≤12px uppercase eyebrows. **GPU**: zero. **Perceptual**: ALTO.

### 9. Optical alignment texto+ícone [E]

```css
.btn-with-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.btn-with-icon > svg {
  flex: none;
  margin-block-start: -1px;
}
.inline-icon {
  vertical-align: -0.125em;
}
```

Refs: `css-tricks.com/tips-aligning-icons-text/` (Shadeed), `blog.damato.design/posts/logical-optical/`. **GPU**: zero. **Perceptual**: alto cumulativo.

### 10. Skeleton shimmer premium (substitui pulse genérico) [E]

```css
@theme {
  --skeleton-base: oklch(from var(--bg-elevated) calc(l + 0.02) c h);
  --skeleton-highlight: oklch(from var(--bg-elevated) calc(l + 0.06) c h);
  --animate-shimmer: shimmer 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
}
.skeleton-shimmer {
  background: linear-gradient(
    100deg,
    var(--skeleton-base) 40%,
    var(--skeleton-highlight) 50%,
    var(--skeleton-base) 60%
  );
  background-size: 200% 100%;
  background-attachment: fixed; /* unifica shimmer através de múltiplos elementos */
  animation: var(--animate-shimmer);
  border-radius: var(--radius);
}
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer {
    animation: none;
    background: var(--skeleton-base);
  }
}
```

`background-attachment: fixed` (truque `matsimon.dev`) faz shimmer único atravessar múltiplos skeletons como onda. **GPU**: baixo. **Perceptual**: ALTO. **Substitui `<Skeleton>` default do shadcn (que faz animate-pulse).**

---

## BLOCO 3 — Micro-interactions com Motion 12

Use pacote `motion` (não `framer-motion` legado). Import: `import { motion } from "motion/react"`. Motion 12 sem breaking changes para React (`motion.dev/docs/react-upgrade-guide`). Confiança: alta.

### 1. Spring physics em vez de tween [E]

```ts
// lib/motion-presets.ts
import type { Transition } from 'motion/react'
export const springs = {
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  soft: { type: 'spring', stiffness: 260, damping: 26 },
  pop: { type: 'spring', stiffness: 500, damping: 24, mass: 0.6 },
  layout: { type: 'spring', duration: 0.55, bounce: 0.1 },
} satisfies Record<string, Transition>
```

```tsx
<motion.button whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }} transition={springs.snappy} />
<motion.div initial={{ opacity: 0, scale: 0.96, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 4 }} transition={springs.pop} />
```

**Quando NÃO usar**: hover de link inline frequente, focus ring (CSS transition). Springs em ações ultra-frequentes parecem wobbly.

### 2. Stagger automático em lists >5 itens [E]

```tsx
import { motion, stagger } from 'motion/react'
const list = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { delayChildren: stagger(0.04, { startDelay: 0.05, from: 'first' }) },
  },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: springs.soft },
}

;<motion.ul variants={list} initial="hidden" animate="visible">
  {workouts.map((w) => (
    <motion.li key={w.id} variants={item}>
      {w.name}
    </motion.li>
  ))}
</motion.ul>
```

Delay calculado dinamicamente por `stagger()` (`motion.dev/docs/stagger`). **NÃO usar** se lista >40 itens — cap em visíveis ou virtualize.

### 3. Shared element transitions via layoutId [I]

```tsx
<motion.div layoutId={`program-${id}`} className="card">
  <motion.img layoutId={`program-${id}-img`} src={cover} />
  <motion.h3 layoutId={`program-${id}-title`}>{title}</motion.h3>
</motion.div>
// Página detalhe: mesmos IDs em layout hero
```

Gotcha (`spell.sh/blog/framer-motion-guide`, 2025): NÃO ponha `layoutId` dentro de `AnimatePresence` — causa double-animation. Default `{type:"spring", duration: 0.55, bounce: 0.1}`. **NÃO usar** em listas longas (Motion mede DOM completo a cada render).

### 4. View Transitions API entre rotas Next.js 16 [I — flag experimental]

```js
// next.config.js
module.exports = { experimental: { viewTransition: true } }
```

```tsx
import { unstable_ViewTransition as ViewTransition } from "react";

<ViewTransition name={`program-${id}`}><ProgramHero {...props} /></ViewTransition>
<Link href={`/program/${id}`} transitionTypes={["nav-forward"]}>...</Link>
```

```css
::view-transition-group(*) {
  animation-duration: 280ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*) {
    animation: none;
  }
}
```

Fontes: `nextjs.org/docs/app/api-reference/config/next-config-js/viewTransition` (atualizada maio/2026), `nextjs.org/blog/next-16`. **Trade-off Motion**: View Transitions é menos performante para muitos elementos (snapshot+crossfade vs transform), não interruptível. **Para shared elements complexos: prefira layoutId. Para fade simples entre rotas: View Transitions.**

### 5. Touch feedback ripple sutil (sem Material completo) [I]

```tsx
<motion.button
  whileTap={{ scale: 0.96, opacity: 0.85 }}
  transition={{ duration: 0.08, ease: 'easeOut' }}
>
  ...
</motion.button>
```

```css
.touch-target {
  position: relative;
  -webkit-tap-highlight-color: transparent;
}
.touch-target::after {
  content: '';
  position: absolute;
  inset: 0;
  background: currentColor;
  opacity: 0;
  border-radius: inherit;
  transition: opacity 120ms ease-out;
  pointer-events: none;
}
.touch-target:active::after {
  opacity: 0.08;
  transition-duration: 0ms;
}
```

**Quando NÃO usar**: links inline. Apenas em CTAs e tap-targets >40x40.

### 6. Loading states variados — quando usar cada [E]

| Tipo                                                 | Quando                                                   | Como                                            |
| ---------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| **Skeleton shimmer**                                 | Layout estável (lista, card) com dados que vão preencher | Pre-render layout esqueleto                     |
| **Spinner** (`<Loader2 className="animate-spin" />`) | Ação ≤2s, espaço pequeno (botão loading)                 | Inline                                          |
| **Shimmer text**                                     | Único valor incerto (saldo, tempo)                       | Largura fixa                                    |
| **Progress streaming**                               | Upload, sync longo, ação >5s                             | `<motion.div animate={{ width: `${pct}%` }} />` |

**Regra**: nunca skeleton + spinner mesma view. **NÃO** use skeleton se altura <48px — use shimmer text.

### 7. Success states com bounce sutil [E]

```tsx
import { AnimatePresence, motion } from 'motion/react'
import { Check } from 'lucide-react'
;<AnimatePresence mode="popLayout">
  {checkedIn && (
    <motion.div
      key="success"
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 600, damping: 22, mass: 0.5 }}
    >
      <Check className="text-emerald-500" strokeWidth={3} />
    </motion.div>
  )}
</AnimatePresence>
```

Stiffness alto (600) + damping médio (22) = pop firme sem wobble. **NÃO usar** em UI repetitiva (toast genérico). Só em milestones (set completo, treino finalizado).

### 8. Number ticker animado com easing [I]

```tsx
import { useMotionValue, useTransform, animate, motion } from 'motion/react'
import { useEffect } from 'react'

export function NumberTicker({ value }: { value: number }) {
  const motionValue = useMotionValue(0)
  const display = useTransform(motionValue, (l) => Math.round(l).toLocaleString('pt-BR'))
  useEffect(() => {
    const controls = animate(motionValue, value, { duration: 0.9, ease: [0.16, 1, 0.3, 1] })
    return controls.stop
  }, [value])
  return <motion.span style={{ fontVariantNumeric: 'tabular-nums' }}>{display}</motion.span>
}
```

Quando: hero metrics on-mount, contador após increment. **NÃO** em valores telemétricos contínuos — fica caótico.

### 9. Confetti em milestone [O ou [I] pontual]

```ts
const confetti = await import('canvas-confetti').then((m) => m.default)
confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: [primaryHex, accentHex] })
```

SSR-safe via `dynamic`. APENAS em PR batido, 7+ dias completos, primeiro treino. Debounce — nunca 2x em <30s. Canvas não aceita OKLCH — converta para hex.

### 10. Toast com timing/easing curado (sonner customizado) [E]

```tsx
// app/layout.tsx
import { Toaster } from 'sonner'
;<Toaster
  position="top-center"
  expand={false}
  richColors={false}
  closeButton={false}
  duration={3500}
  toastOptions={{
    classNames: {
      toast:
        'bg-[var(--bg-elevated)] border border-[var(--border-ghost)] shadow-[var(--shadow-soft-2)] backdrop-blur-md',
      title: 'font-medium text-[var(--text-strong)]',
      description: 'text-[var(--text-muted)]',
    },
    style: { borderRadius: 'var(--radius)', fontFamily: 'var(--font-sans)' },
  }}
/>
```

Sonner = mesmo autor do vaul (Emil Kowalski). Spring physics interno. Durations: success 3s, info 3.5s, error 5s, loading 0 (manual dismiss). **NÃO use** para destrutivas (AlertDialog) nem empty states.

---

## BLOCO 4 — Customização shadcn new-york sem virar Frankenstein

shadcn é **copy-paste** — você OWN os arquivos. Edite gerados; crie wrappers só para variantes radicalmente novas.

### 1. `data-state` animations ricas (Radix expose state + Motion) [E]

Radix expõe `data-state="open|closed"`, `data-side`, `data-orientation`. Em shadcn new-york:

```tsx
<DialogPrimitive.Content
  className={cn(
    'fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-soft-3 duration-200',
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-top-[48%]',
    'sm:rounded-lg',
    className,
  )}
/>
```

`tw-animate-css` integrado ao shadcn 2024+. Combine com Motion 12 só quando CSS não cobre (layoutId, drag).

### 2. Compound components com slots [E]

```tsx
// components/ui/card.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="card"
      className={cn('rounded-xl border bg-card text-card-foreground shadow-soft-1', className)}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

const CardImage = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="card-image"
    className={cn('relative aspect-[16/9] overflow-hidden rounded-t-xl', className)}
    {...props}
  />
)
const CardEyebrow = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    data-slot="card-eyebrow"
    className={cn('text-xs uppercase tracking-[0.06em] text-muted-foreground', className)}
    {...props}
  />
)
const CardTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    data-slot="card-title"
    className={cn('text-lg font-semibold leading-tight tracking-tight', className)}
    {...props}
  />
)
const CardMeta = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="card-meta"
    className={cn('flex items-center gap-2 text-sm text-muted-foreground tabular-nums', className)}
    {...props}
  />
)
const CardCTA = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="card-cta"
    className={cn('mt-3 flex items-center justify-between', className)}
    {...props}
  />
)

export { Card, CardImage, CardEyebrow, CardTitle, CardMeta, CardCTA }
```

`data-slot` é convenção oficial shadcn (changelog março/2026 "Component Composition"). Permite styling externo via `[&_[data-slot=card-title]]:text-2xl`. Confiança alta.

### 3. Tokens OKLCH integrados sem conflito com white-label runtime [E]

```css
@layer base {
  :root {
    --brand-h: 250;
    --brand-c: 0.18;
  }
  :root,
  .light {
    --background: oklch(0.99 0.002 var(--brand-h));
    --foreground: oklch(0.145 0.01 var(--brand-h));
    --card: oklch(1 0 0);
    --primary: oklch(0.55 var(--brand-c) var(--brand-h));
    --primary-foreground: oklch(0.99 0 0);
    --muted: oklch(0.96 0.005 var(--brand-h));
    --muted-foreground: oklch(0.5 0.012 var(--brand-h));
    --border: oklch(0.92 0.006 var(--brand-h));
    --ring: var(--primary);
    --radius: 0.625rem;
  }
  .dark {
    --background: oklch(0.145 0.008 var(--brand-h));
    --foreground: oklch(0.97 0.003 var(--brand-h));
    --card: oklch(0.185 0.01 var(--brand-h));
    --primary: oklch(0.7 var(--brand-c) var(--brand-h));
    --muted: oklch(0.21 0.012 var(--brand-h));
    --border: oklch(1 0 0 / 0.08);
  }
}

/* Bridge para Tailwind v4 — @theme inline preserva referência reativa */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-ring: var(--ring);
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}
```

**Crítico**: `@theme inline` (não só `@theme`) referencia variáveis sem inlinar — preserva reatividade ao swap de tenant em runtime (fonte: `tailwindcss.com/docs/theme`). Confiança alta.

### 4. Variants via `cva` sem explodir API [E]

```tsx
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-soft-1 hover:bg-primary/90 active:scale-[0.98]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-muted hover:text-foreground',
        outline: 'border bg-transparent hover:bg-muted',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        sm: 'h-8 px-3',
        default: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)
```

**Regra**: MAX 5 variants/componente. Variantes edge-case viram componente separado (`<LoadingButton>`).

### 5. Composição com Radix headless quando shadcn não cobre [I]

Tooltip seta custom, hover-card timing diferente, popover snap-points: use `@radix-ui/react-*` diretamente. shadcn é camada por cima — não recrie comportamento.

### 6. Slot pattern Radix para polimorfismo controlado [E]

```tsx
import { Slot } from '@radix-ui/react-slot'

export function Button({ asChild, className, variant, size, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

;<Button asChild variant="ghost">
  <Link href="/dashboard">Voltar</Link>
</Button>
```

Default no shadcn new-york.

### Repos públicos que fazem bem (confiança alta)

- **`shadcn-ui/ui`** (canônico)
- **`calcom/cal.com`** — shadcn customizado profundamente, multi-tenant white-label real. **Próximo do seu caso**. Estude `apps/web/components/ui` e sistema de cores.
- **`vercel/geist`** — Geist design system, OKLCH tokens.
- **`magicuidesign/magicui`** — efeitos visuais em cima de shadcn (number-ticker, shimmer-button, animated-list).
- **`emilkowalski/vaul`** — drawer/sheet.
- **`pacocoursey/cmdk`** — command palette base.
- **`shuding/next-view-transitions`** — wrapper App Router popular se evita flag experimental.

---

## BLOCO 5 — Iconografia e imagery premium

### 1. Lucide React: destacar [E detalhe, I animação]

```tsx
import { motion } from "motion/react";
import { Heart, Flame } from "lucide-react";

<Heart className="size-5" strokeWidth={1.75} />     {/* decorative */}
<Heart className="size-5" strokeWidth={2.25} />     {/* emphasis */}

<motion.span className="inline-flex"
  whileHover={{ rotate: -8, scale: 1.1 }}
  transition={{ type: "spring", stiffness: 400, damping: 18 }}>
  <Flame className="size-5 text-orange-500" />
</motion.span>
```

Regra: stroke-width Lucide default 2. Use 1.75 calm-icons (Linear-like), 2.5 só hero CTAs. **NÃO** animar todos — só CTA principal + milestone icons.

### 2. Custom SVG sprite para ícones fitness [I — quando vale]

Lucide tem `Dumbbell`, `Activity`, `Timer`, `TrendingUp`, `Flame`, `Trophy`, `Target` — cobre 80%. Custom só se: visualização específica (kettlebell, plate, rep counter circular) **OU** ≥6 ícones com estilo unificado.

**Como**: SVG sprite via `<symbol>` em arquivo único, referenciado por `<use href="/sprite.svg#icon-plate" />`. NÃO importe individualmente como React component se >20 — bundle bloat.

### 3. Image placeholders [E]

```tsx
// next.config.js: images: { formats: ["image/avif", "image/webp"] }
<Image
  src={cover}
  alt=""
  width={600}
  height={400}
  placeholder="blur"
  blurDataURL={blurHash}
  className="object-cover"
/>
```

Use `plaiceholder` server-side no upload para Supabase Storage — gere `blurDataURL` 1x, armazene. Gradient mesh dinâmico é `[O]` para PWA fitness.

### 4. Hero images/cover programa [E]

```tsx
<div className="relative aspect-[3/2] overflow-hidden rounded-xl">
  <Image src={cover} alt="" fill className="object-cover" />
  <div
    className="absolute inset-0"
    style={{
      background:
        'linear-gradient(180deg, transparent 30%, oklch(from var(--bg-base) 0.08 c h / 0.85) 100%)',
    }}
  />
  <div
    className="absolute inset-0 mix-blend-color"
    style={{ background: 'var(--primary)', opacity: 0.08 }}
  />
  <div className="absolute inset-x-4 bottom-4 text-white">
    <CardEyebrow className="text-white/70">Programa</CardEyebrow>
    <h3 className="text-2xl font-bold leading-tight">Cutting verão</h3>
  </div>
</div>
```

Color extraction (`node-vibrant` server) — overkill para MVP.

### 5. Avatars premium [E]

```tsx
<span className="relative inline-flex">
  <Avatar className="size-10 ring-2 ring-background border border-border/40">
    <AvatarImage src={user.avatar} />
    <AvatarFallback
      className="text-xs font-semibold uppercase"
      style={{
        background: 'oklch(from var(--primary) 0.92 calc(c * 0.4) h)',
        color: 'oklch(from var(--primary) 0.30 c h)',
      }}
    >
      {initials(user.name)}
    </AvatarFallback>
  </Avatar>
  {online && (
    <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 ring-2 ring-background" />
  )}
</span>
```

---

## BLOCO 6 — PWA-specific feel premium

### 1. Status bar tint (theme-color por rota) [E]

```tsx
// app/(routes)/dashboard/layout.tsx
export const metadata = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0c' },
  ],
}

// Override runtime em rota com hero colorido
;('use client')
useEffect(() => {
  const meta = document.querySelector('meta[name="theme-color"]')
  meta?.setAttribute('content', '#0e1a2c')
  return () => meta?.setAttribute('content', '#0a0a0c')
}, [])
```

Fontes: `web.dev/learn/pwa/app-design`, `ionicframework.com/docs/theming/advanced` — alta.

### 2. Splash screen elegante [E]

```json
// public/manifest.json
{
  "name": "Desafit",
  "short_name": "Desafit",
  "display": "standalone",
  "start_url": "/?source=pwa",
  "theme_color": "#0a0a0c",
  "background_color": "#0a0a0c",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ]
}
```

iOS exige splash PNG por viewport — não funciona manifest sozinho. Gere com `pwa-asset-generator`.

### 3. Bottom-sheet vaul customizado premium [E]

```tsx
'use client'
import { Drawer } from 'vaul'

export function BottomSheet({ open, onOpenChange, children, snapPoints }) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} snapPoints={snapPoints}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />
        <Drawer.Content
          className={cn(
            'fixed bottom-0 inset-x-0 z-50 mt-24 flex h-auto flex-col rounded-t-2xl',
            'bg-background border-t border-border',
            'shadow-[0_-12px_40px_-12px_oklch(0_0_0/0.4)]',
            'pb-[env(safe-area-inset-bottom)]',
          )}
        >
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-muted-foreground/30" />
          <Drawer.Title className="sr-only">Sheet</Drawer.Title>
          <div className="overflow-auto p-4">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

**Bug conhecido vaul issue #505**: drawer em PWA standalone iOS quando scroll bottom comporta mal. Mitigação: `repositionInputs={true}` (default 0.9.4+); teste iOS Simulator. Confiança alta.

### 4. Pull-to-refresh com physics [I]

```tsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={{ top: 0, bottom: 0.4 }}
  onDragEnd={(_, info) => info.offset.y > 80 && refresh()}
>
  {/* lista */}
</motion.div>
```

Em Android nativo PWA já há overscroll. Para iOS standalone precisa custom. Conflita com vaul drag — em Android prefira `overscroll-behavior-y: contain` em scroller onde quer custom.

### 5. Safe areas iOS [E]

```css
:root {
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
  --safe-left: env(safe-area-inset-left, 0px);
  --safe-right: env(safe-area-inset-right, 0px);
}
.app-shell {
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
}
.tab-bar {
  position: fixed;
  bottom: 0;
  padding-bottom: var(--safe-bottom);
  height: calc(56px + var(--safe-bottom));
}
```

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

Fontes: `dev.to/karmasakshi/make-your-pwas-look-handsome-on-ios`, `web.dev/learn/pwa/app-design` — alta.

### 6. Tab bar com tint + active indicator animado [E]

```tsx
'use client'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Dumbbell, BarChart, User } from 'lucide-react'

const tabs = [
  { href: '/', icon: Home, label: 'Início' },
  { href: '/workouts', icon: Dumbbell, label: 'Treinos' },
  { href: '/stats', icon: BarChart, label: 'Stats' },
  { href: '/profile', icon: User, label: 'Perfil' },
]

export function TabBar() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/85 backdrop-blur-lg pb-[var(--safe-bottom)]">
      <ul className="flex h-14 items-stretch">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex h-full flex-col items-center justify-center gap-0.5"
              >
                {active && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                  />
                )}
                <Icon
                  className={cn(
                    'size-5 transition-colors',
                    active ? 'text-primary' : 'text-muted-foreground',
                  )}
                  strokeWidth={active ? 2.25 : 1.75}
                />
                <span
                  className={cn(
                    'text-[10px] font-medium',
                    active ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
```

### 7. Header sticky com blur seletivo (threshold) [I]

```tsx
'use client'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { useState } from 'react'

export function AppHeader({ title }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 8))

  return (
    <header
      data-scrolled={scrolled}
      className="sticky top-0 z-30 pt-[var(--safe-top)] transition-all
        data-[scrolled=true]:bg-background/80
        data-[scrolled=true]:backdrop-blur-md
        data-[scrolled=true]:border-b data-[scrolled=true]:border-border"
    >
      <div className="h-12 px-4 flex items-center">
        <h1 className="font-semibold">{title}</h1>
      </div>
    </header>
  )
}
```

**Por que seletivo**: backdrop-filter sempre ativo mata GPU mid-tier.

### 8. Page transitions [I]

- **Entre tabs (mesmo nível)**: slide horizontal via View Transitions + `transitionTypes={["tab-switch"]}`:

```css
::view-transition-old(root) {
  animation: slide-out-left 200ms var(--ease-out-quart);
}
::view-transition-new(root) {
  animation: slide-in-right 200ms var(--ease-out-quart);
}
```

- **Drill-down (lista → detalhe)**: fade + shared element via layoutId ou ViewTransition name.
- **Back**: inverso. Use `transitionTypes={["nav-back"]}` (Next 16 nativo).

### 9. Install banner custom [I — iOS sem `beforeinstallprompt`]

```tsx
'use client'
import { useEffect, useState } from 'react'

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<any>(null)
  useEffect(() => {
    const h = (e: any) => {
      e.preventDefault()
      setDeferred(e)
    }
    window.addEventListener('beforeinstallprompt', h)
    return () => window.removeEventListener('beforeinstallprompt', h)
  }, [])
  if (!deferred) return null
  return (
    <BottomSheet open onOpenChange={() => setDeferred(null)}>
      <h3 className="text-lg font-semibold">Instalar Desafit</h3>
      <p className="text-sm text-muted-foreground">Acesso rápido na tela inicial.</p>
      <Button onClick={() => deferred.prompt()}>Instalar</Button>
    </BottomSheet>
  )
}
```

iOS: instrução manual ("Compartilhar → Adicionar à Tela de Início"). Detecte `navigator.standalone === false && /iPhone|iPad/i.test(ua)`.

---

## BLOCO 7 — Light mode igualmente premium

Linear refresh 2025/2026 fez explicitamente: "warmer gray crisp, menos saturado" (fonte: `linear.app/now/behind-the-latest-design-refresh`). Alta.

### 1. Surfaces light com hint do brand [E]

Nunca `#FFFFFF` puro:

```css
.light {
  --background: oklch(0.99 0.003 var(--brand-h)); /* hint 0.3% chroma */
  --card: oklch(1 0 0); /* card puro p/ contraste */
  --muted: oklch(0.96 0.006 var(--brand-h));
}
```

### 2. Sombras em light mode — comportamento diferente [E]

Light precisa de sombras com **chroma > 0** e **lightness 0**:

```css
.light {
  --shadow-soft-1:
    0 1px 2px -1px oklch(0.2 0.08 var(--brand-h) / 0.08), 0 1px 1px oklch(0 0 0 / 0.04);
}
```

Em light, sombras puramente cinzas parecem "sujas". Com hue do brand parecem intencionais.

### 3. Borders em light vs dark [E]

```css
.light {
  --border: oklch(0.92 0.006 var(--brand-h));
} /* cor sólida */
.dark {
  --border: oklch(1 0 0 / 0.08);
} /* opacity */
```

Em dark, opacity branco simula "luz entre painéis". Em light, opacity preto fica "sujo" — use cor sólida.

### 4. Tipografia em light [E]

```css
.light body {
  -webkit-font-smoothing: antialiased; /* deixa fonte 1 peso mais leve no macOS */
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}
.dark body {
  -webkit-font-smoothing: antialiased;
}
```

Em light, considere `font-weight: 500` onde dark usa `600`. Sub-pixel rendering deixa preto sobre branco "mais bold" — confiança média (best-practice sem fonte canônica única). Tracking em headings: `-0.015em` em light vs `-0.02em` em dark — teste.

### 5. Tinted shadows em light mode — coberto em (2)

---

## BLOCO 8 — White-label premium (qualquer paleta OKLCH)

### 1. Pattern "qualquer paleta vira premium" [E]

Única variável que muda por tenant: **hue** (`--brand-h`) + opcional **chroma** (`--brand-c`). Resto deriva determinístico.

```html
<!-- Inject server-side via RSC layout lendo Supabase tenant.brandHue -->
<html style="--brand-h: 30; --brand-c: 0.15"></html>
```

### 2. Surfaces tinted automatic algorithm [E]

```css
.dark {
  --background: oklch(0.145 calc(var(--brand-c) * 0.06) var(--brand-h));
  --card: oklch(0.185 calc(var(--brand-c) * 0.07) var(--brand-h));
  --muted: oklch(0.21 calc(var(--brand-c) * 0.08) var(--brand-h));
}
.light {
  --background: oklch(0.99 calc(var(--brand-c) * 0.02) var(--brand-h));
  --card: oklch(1 0 0);
  --muted: oklch(0.96 calc(var(--brand-c) * 0.05) var(--brand-h));
}
```

Princípio: chroma sobe linearmente com elevação. Hue herdado integral. (Linear faz isso; Evil Martians documenta.)

### 3. Shadows tinted automatic [E]

```css
:root {
  --shadow-tint: oklch(0.3 var(--brand-c) var(--brand-h));
}
.dark {
  --shadow-tint: oklch(0 var(--brand-c) var(--brand-h));
}

@theme inline {
  --shadow-soft-2: 0 4px 6px -2px var(--shadow-tint) / 0.1, 0 2px 4px -2px oklch(0 0 0 / 0.06);
}
```

### 4. Accent moments auto-derivados [E]

```css
:root {
  --accent-warm: oklch(0.65 var(--brand-c) calc(var(--brand-h) + 30)); /* análoga +30deg */
  --accent-cool: oklch(0.65 var(--brand-c) calc(var(--brand-h) - 30));

  --badge-bg: oklch(from var(--primary) 0.94 calc(c * 0.3) h);
  --badge-fg: oklch(from var(--primary) 0.3 c h);
}
.dark {
  --badge-bg: oklch(from var(--primary) 0.22 calc(c * 0.5) h);
  --badge-fg: oklch(from var(--primary) 0.85 calc(c * 0.7) h);
}
```

**Test harness**: rota dev `/dev/themes` previewing all 13 palettes (estilo color picker que Linear construiu com Claude Code). Visual review worst-case.

---

## BLOCO 9 — Anti-patterns documentados com evidência

### 1. Glassmorphism pesado em PWA Android mid-tier

- **Android docs** (`source.android.com/docs/core/display/window-blurs`): "Devices with less performant GPUs might choose not to support window blurs. System server might temporarily disable window blurs at runtime, e.g., during battery saving mode."
- **Flutter issue #32804**: BackdropFilter em list cells "totally cripples application".
- `openreplay.com` 2024: "Mobile devices typically handle 3-5 simultaneous blur effects well."
- **Regra**: max 2 backdrop-filters simultâneos; nunca em scroller children.
- Confiança: **alta**.

### 2. Neumorphism morreu porque:

- Contraste insuficiente para WCAG AA (sombras claras em backgrounds claros).
- Funciona em só 1 paleta — não escala white-label.
- Estética datada (peak ~2020). Confiança: média (consenso design).

### 3. 3D/Three.js em produto utilitário

- Bundle bloat (Three ~600KB gzipped) — destrói budget 240KB.
- Rauno: "actions frequent and low in novelty should avoid extraneous animations".
- Fitness é frequent low-novelty. Confiança: alta.

### 4. Animação em cada interação

- Rauno docs (alta): minimize em ações frequentes.
- Linear redesign 2024: "less visual noise, less clutter, animations only where they communicate state".

### 5. Tailwind UI / shadcn default genérico

- Diferenciação vem de **tokens OKLCH custom + tipografia rítmica + sombras tingidas + spacing 8-pt obsessivo**. Sem custom layer, copy-paste visível.

### 6. Imagery Unsplash genérica

- Identidade fraca. Para fitness: gere com tint do brand (overlay) ou foto custom.

### 7. Gradients arco-íris desfocados

- Pico 2021–2022. Linear voltou monocromático+1 accent em 2025/2026. Vercel grayscale puro. Tendência: linear-gradient 2 stops mesma family OKLCH (chroma variando, hue ~igual).

### Bônus implícitos:

- **Bordas pretas puras** (`#000`) em dark — sumem hierarquia. Use `oklch(1 0 0 / 0.08)`.
- **`box-shadow: rgba(0,0,0,...)`** em dark — somem. Combine inner highlight + outer dark.
- **`transition: all`** — relayout caro. Use `transition-colors`, `transition-transform`.

---

## BLOCO 10 — Recomendação final: fórmula visual premium desafit

Priorizado para **solo founder + Claude Code, PWA mobile-first, multi-tenant 13 paletas OKLCH, budget 170–240KB, dark-first**.

### Tabela consolidada final

| #                             | Elemento                                                                  | Ref      |      Horas |             Impacto              |       GPU        |     Tier      |
| ----------------------------- | ------------------------------------------------------------------------- | -------- | ---------: | :------------------------------: | :--------------: | :-----------: |
| 1                             | OKLCH tokens system (3 níveis surfaces + tinted shadows)                  | 2.1, 8.2 |         4h |             **Alto**             |      Baixo       |    **[E]**    |
| 2                             | Typography: 8-pt scale + tabular-nums + line-height rhythm + Inter ss01   | 2.7, 2.8 |         2h |             **Alto**             |      Baixo       |    **[E]**    |
| 3                             | shadcn new-york + 5 cva variants curados (Button/Card/Badge/Input/Dialog) | 4.4      |         3h |              Médio               |      Baixo       |    **[E]**    |
| 4                             | Compound Card com data-slot pattern                                       | 4.2      |         2h |               Alto               |      Baixo       |    **[E]**    |
| 5                             | White-label runtime: `--brand-h/c` injection + 13 paletas testadas        | 8        |         6h |             **Alto**             |      Baixo       |    **[E]**    |
| 6                             | Skeleton shimmer custom (substitui pulse)                                 | 2.10     |       1.5h |            Médio-Alto            |      Baixo       |    **[E]**    |
| 7                             | Vaul bottom-sheet customizado + handle + safe-areas                       | 6.3, 6.5 |         3h |           **Alto** PWA           |      Baixo       |    **[E]**    |
| 8                             | Tab bar com layoutId Motion indicator                                     | 6.6      |         2h |             **Alto**             |      Baixo       |    **[E]**    |
| 9                             | Header sticky com blur condicional (threshold)                            | 6.7      |       1.5h |              Médio               | Médio (limitado) |    **[E]**    |
| 10                            | Sonner customizado                                                        | 3.10     |         1h |              Médio               |      Baixo       |    **[E]**    |
| 11                            | Motion springs preset + tap/release em CTAs                               | 3.1, 3.5 |         2h |              Médio               |      Baixo       |    **[E]**    |
| 12                            | Theme-color por rota + manifest + splash                                  | 6.1, 6.2 |         2h |           **Alto** PWA           |       Zero       |    **[E]**    |
| **Sprint 1 — Foundation [E]** |                                                                           |          |    **30h** |                                  |                  |               |
| 13                            | Stagger list >5 itens                                                     | 3.2      |         1h |              Médio               |      Baixo       |    **[I]**    |
| 14                            | layoutId shared elements (lista→detalhe programa)                         | 3.3      |         3h |             **Alto**             |      Médio       |    **[I]**    |
| 15                            | Number ticker em hero metrics                                             | 3.8      |       1.5h |              Médio               |      Baixo       |    **[I]**    |
| 16                            | Success spring (check-in, set completo)                                   | 3.7      |         1h |        **Alto** emocional        |      Baixo       |    **[I]**    |
| 17                            | Lucide hover springs em CTAs primários                                    | 5.1      |         1h |           Baixo-Médio            |      Baixo       |    **[I]**    |
| 18                            | Avatar premium status dot + OKLCH fallback                                | 5.5      |         1h |              Médio               |      Baixo       |    **[I]**    |
| 19                            | Hero image programa overlay + brand tint                                  | 5.4      |       1.5h |               Alto               |      Baixo       |    **[I]**    |
| 20                            | View Transitions Next 16 (slide tab / fade nav)                           | 3.4, 6.8 |         4h |             **Alto**             |      Baixo       |    **[I]**    |
| 21                            | Inner glow inset shadow em elevated                                       | 2.4      |       0.5h |              Médio               |       Zero       |    **[I]**    |
| 22                            | Install prompt custom bottom-sheet                                        | 6.9      |         2h |              Médio               |      Baixo       |    **[I]**    |
| 23                            | Optical alignment fixes ícone+texto                                       | 2.9      |         1h | Baixo individual / Alto agregado |       Zero       |    **[I]**    |
| 24                            | Light mode tinted shadows + warmer surfaces                               | 7        |         2h |   **Alto** se light é caso uso   |       Zero       |    **[I]**    |
| **Sprint 2 — Polish [I]**     |                                                                           |          |  **19.5h** |                                  |                  |               |
| 25                            | Pull-to-refresh physics custom                                            | 6.4      |         4h |              Médio               |      Médio       |    **[O]**    |
| 26                            | Confetti milestone                                                        | 3.9      |       1.5h |           Alto pontual           |      Baixo       |    **[O]**    |
| 27                            | Gradient mesh dinâmico hero                                               | —        |         4h |              Baixo               |       Alto       |    **[O]**    |
| 28                            | SVG sprite custom fitness                                                 | 5.2      |         5h |       Baixo até ≥6 ícones        |       Zero       |    **[O]**    |
| 29                            | Color extraction server-side hero                                         | 5.4      |         3h |              Baixo               |       Zero       |    **[O]**    |
| 30                            | Three.js / WebGL                                                          | —        |          — |             Negativo             |       Alto       | **[O — NÃO]** |
| **Backlog [O]**               |                                                                           |          | **~17.5h** |                                  |                  |               |

### Hierarquia de prioridade

- **Sprint 1 — Foundation (30h, ~1 semana solo)**: itens 1–12. Sem isso, app parece template shadcn. Com isso, parece _produto pensado_.
- **Sprint 2 — Polish (~20h, ~3 dias)**: itens 13–24. Salto para _produto premium_. layoutId shared elements (14) + View Transitions (20) são o maior leap perceptual.
- **Sprint 3 (opcional)**: itens 25–29 só se métricas pedirem. Three.js: nunca.

### Estimativa total

- **"Premium" funcional**: **30h**
- **"Premium" referência (Linear-tier)**: **~50h**
- **Over-engineered**: 65h+

### 10 princípios canônicos

1. **OKLCH tokens com hue do tenant é o coração.** Tudo deriva.
2. **Sombras tingidas com hue do brand** = diferencial #1 invisível-mas-sentido.
3. **Tabular-nums + 8-pt + line-height rítmica** = 80% da percepção de "designed".
4. **Backdrop-filter ÚNICO em header sticky condicional**. Nunca em cards.
5. **Motion 12 springs > tweens**. Preset com 3 variantes (snappy/soft/pop).
6. **layoutId Motion para shared elements**; **View Transitions Next 16 para fade entre rotas**. Não os 2 no mesmo elemento.
7. **shadcn new-york com data-slot compound + cva limitado a 5 variants**. Wrappers para edge cases.
8. **PWA feel native = safe-areas + theme-color por rota + vaul + tab-bar com layoutId + sticky header com blur threshold**.
9. **Light mode não é dark invertido**: sombras tingidas, tracking ajustado, antialiasing diferente, borders por cor sólida.
10. **Rauno's law**: robustness > novelty. Frequent actions: no animations. Milestones: bounce.

---

### Notas de confiança

- **Alta confiança** (fonte 2024–2026 direta): Linear design 2024/2025/2026, Tailwind v4 `@theme`/OKLCH (`tailwindcss.com/docs/theme`), Motion 12 API (`motion.dev`), Next 16 View Transitions (`nextjs.org/blog/next-16`, atualizada maio 2026), vaul drawer behavior + PWA bug #505, OKLCH ecosystem (Evil Martians, Ahmad Shadeed `ishadeed.com/article/css-relative-colors/`), shadcn cva + data-slot changelog março 2026, backdrop-filter Android docs, rauno.me principles, safe-area iOS PWA `web.dev`.
- **Confiança média**: comparativos Apple Fitness+/Whoop/Strava/Pillar (sem fonte técnica pública detalhada, baseado em observação de padrões 2024–2026); light mode font-weight inversion (best-practice sem fonte canônica única); estimativas de horas variam com fluência Claude Code.
- **Confiança baixa / especulativo (sempre marcado)**: percentuais GPU exatos por blur radius (docs Android dizem qualitativo, números exatos variam por chipset); valores precisos `linear-gradient` skeleton shimmer dependem do seu OKLCH específico (teste e ajuste); estética Pillar app (baseado em screenshots públicos, não em uso direto recente).

A diferença entre "ok" e "premium" no seu caso não está em adicionar wow-factor; está em **consistência obsessiva**: tokens OKLCH derivados, spacing 8-pt sem exceção, sombras coloridas em vez de cinza, tabular-nums universal em qualquer número, springs em vez de tweens nos 5–10 lugares que importam, e ZERO blur fora de header+modal. Stack que você já tem chega lá — é trabalho de disciplina, não de bibliotecas adicionais.
