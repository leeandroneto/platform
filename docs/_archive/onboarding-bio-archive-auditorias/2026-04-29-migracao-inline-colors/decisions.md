# Decisões — Fase 21: inline colors

## D1: Cores de device mockup (IPhoneMockup, macOS traffic lights)

**Contexto:** `#3a3a42` (bezel), `#000` (tela), `#555` (home indicator), `#ff5f57`/`#febc2e`/`#28c840` (macOS traffic lights).

**Decisão:** Migrar para classes Tailwind arbitrary (`bg-[#3a3a42]`, etc.). Essas cores representam hardware físico — não devem responder a tema nem brand do profissional.

**Arquivos:** IPhoneMockup.tsx, LivePreviewDevice.tsx, ShowcaseFrame.tsx, SiteSection.tsx, DashboardSection.tsx

---

## D2: Cores de social media creatives

**Contexto:** Palette fixa para posts Instagram: `#C6FF6C` (lime), `#FF7A59` (orange), `#C084FC` (purple), `#38BDF8` (sky), `#FBBF24` (amber), `#0B0B0D` (near-black), `#1A0A04`/`#1A0A2A`/`#041422` (dark contrasts).

**Decisão:** Migrar para classes Tailwind arbitrary (`text-[#C6FF6C]`, `bg-[#FF7A59]`). São cores de design fixo para conteúdo social — não temáticas.

**Nota sobre STAGE_ICONS:** Os objetos STAGE_ICONS em CarrosselSlides.tsx e FeedSlides.tsx definem cores que são espalhadas via `style={{ color }}`. Migrar para className exige refatorar o pattern de data → render.

**Arquivos:** CarrosselSlides.tsx, FeedSlides.tsx, StorySlides.tsx, SharedComponents.tsx (creatives + carousel)

---

## D3: Cores de scoring no AuditAnalysis

**Contexto:** `pilarColor()` retorna `#5cbf9b`/`#c9a84c`/`#d4815e` por score. `severidadeColor()` retorna `#d4815e`/`#c9a84c`/`#6baed4`. Usadas em barras, badges, borders — tudo via style={{}}.

**Decisão:** Manter como inline style com CSS vars. Criar tokens `--color-score-high: #5cbf9b`, `--color-score-mid: #c9a84c`, `--color-score-low: #d4815e`, `--color-score-info: #6baed4`. As funções helper retornam `var(--color-score-*)` em vez de hex.

Essas cores são usadas em `color-mix()` e em múltiplas propriedades (color, backgroundColor, borderColor) no mesmo elemento, tornando className impraticável.

**Arquivo:** AuditAnalysis.tsx

---

## D4: Demo page (logos)

**Contexto:** `app/demo/logos/page.tsx` — página de demonstração interna com 12+ hardcoded hex para simular temas claro/escuro.

**Decisão:** Migrar variáveis locais para CSS vars do tema (`var(--color-background)`, `var(--color-foreground)`, etc.) onde possível. Cores específicas de demo que não mapeiam a tokens ficam como Tailwind arbitrary.

---

## D5: rgba() overlays e backdrops

**Contexto:** `rgba(0,0,0,0.5)` para backdrops, `rgba(255,255,255,0.05)` para surfaces sutis, `rgba(20,20,24,0.4)` para cards.

**Decisão:** Migrar para Tailwind opacity utilities: `bg-black/50`, `bg-white/5`. Para `rgba(20,20,24,0.4)` (cor específica do background), usar `bg-background/40` ou criar classe em globals.css.

---

## D6: hsl(var(--\*)) wrapping

**Contexto:** `hsl(var(--muted))`, `hsl(var(--destructive))`, `hsl(var(--accent) / 0.3)`. Em Tailwind v4, as CSS vars já contém o valor completo — `hsl()` wrapper é redundante e pode quebrar.

**Decisão:** Substituir por classes Tailwind diretas (`bg-muted`, `text-destructive`) ou por `var(--color-*)` sem wrapper hsl().

---

## D7: color-mix() com hex inline

**Contexto:** Vários componentes usam `color-mix(in oklab, #HEX XX%, transparent)` em style={{}}.

**Decisão:** Substituir o hex dentro do color-mix por referência a CSS var. Ex: `color-mix(in oklab, #FF7A59 15%, transparent)` → `color-mix(in oklab, var(--color-creative-orange, #FF7A59) 15%, transparent)`.

Alternativa: onde o color-mix é simples, substituir por Tailwind opacity (ex: `bg-[#FF7A59]/15`). Avaliar caso a caso.

---

## D8: Gradients com múltiplas cores

**Contexto:** `radial-gradient(... rgba(11,11,13,0.6) ...)` em coming-soon. Gradients com rgba não têm token equivalente direto.

**Decisão:** Manter gradients em style={{}} mas substituir hex/rgba por CSS vars onde possível. Gradients complexos ficam como exceção documentada com eslint-disable e comentário.
