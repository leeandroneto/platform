# Auditoria Completa — Pivot pra shadcn-canonical + TweakCN-inspired

> **Tipo:** reflexão estratégica em curso. Após aprovação user, vira ADR-0044 supersedes ADR-0043.
> **Tempo investido na auditoria:** ~3-4h (leitura profunda de 18 arquivos críticos + Supabase + WebFetch TweakCN).
> **Status confiança:** HIGH (todas as métricas conferidas com `wc -l`/`grep` direto + leitura completa do source-of-truth, sem inferência).
> **Última atualização:** 2026-05-21.

---

## 0. Resumo executivo

Projeto investiu ~12h de implementação autônoma num **engine de design system multi-tenant teoricamente sofisticado** (22 archetypes × 35 paletas × 13 fontes × 4 modos = ~40k combos virtuais, 67 roles invented, contrato Zod 19+ sub-schemas, 5 ESLint rules custom, 254 arquivos em `lib/design/`). **Nenhum desses 22 archetypes foi renderizado e validado visualmente** — a primeira tentativa de showcase end-to-end (hoje, 2026-05-21) destapou cascata de 9 bugs latentes cruzados (Tooltip sem Provider, namespace i18n inexistente, GRANT service_role faltando, h1 nested, CSS scan worktrees). Cada fix foi workaround, não correção de root cause: o engine inteiro nunca foi exercitado em runtime real.

Em paralelo, descobriu-se que **TweakCN (`tweakcn.com` — 9.9k stars, Apache-2.0)** já implementa exatamente o builder visual de tema shadcn/ui que falta no projeto, usando shadcn-canonical 28 tokens flat (compatibilidade nativa com v0.dev, shadcn blocks, Kibo, Origin). Seu schema é "flat bag of 41 tokens" — vai conflitar com nosso modelo de archetype bundle, mas é proven em produção; nosso modelo é hipótese sem evidência.

A decisão estratégica é **pivotar antes de continuar consertando workarounds**: adotar shadcn-canonical 28 tokens como vocabulário público obrigatório (perdendo compatibilidade zero com ecossistema é perda líquida), reduzir 22 archetypes para 5-7 archetypes "presets" copiando tokens **literais** dos DESIGN.md proven em produção (Apple, Stripe, Linear, Notion, Spotify), e clonar o builder UI do TweakCN (Apache-2.0 permite). **Multi-tenant runtime, mobile tokens universais, APCA Silver, cache combo, getRouteByHost — TUDO ISSO PERMANECE.** O que joga fora é a camada "Layer 1.5 roles invented" + 22 archetype tokens inflados + 5 ESLint rules custom de governance no formato atual.

Esforço estimado total do pivot: **~50-80h** distribuído em 6 fases. ROI claro: bundle menor, build mais rápido, ecosystem compatibility imediata, builder UI proven, menos arquivos pra manter, ciclo de iteração visual real.

---

## 1. Inventário do estado atual

### 1.1 Métricas (medidas, não estimadas)

| Métrica                                             | Valor                                                                                                                                                                                            | Fonte                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| Tokens CSS declarados em `app/globals.css`          | **299** linhas com `--token` (≈230 distintos contando duplicações dark/light)                                                                                                                    | `grep -c "^\s*--" app/globals.css`                       |
| Roles `--role-*` distintos declarados               | **67**                                                                                                                                                                                           | `grep -oE "\-\-role-[a-z-]+" app/globals.css \| sort -u` |
| Roles "core canonical" prometidos (ADR-0043)        | 28                                                                                                                                                                                               | docs/design-system/ARCHITECTURE.md §5.2                  |
| **Inflação real:** roles invented vs prometido      | **+39 roles** (67 atual vs 28 prometido — 240% over-scope)                                                                                                                                       | —                                                        |
| Arquivos `.ts` em `lib/design/`                     | **254**                                                                                                                                                                                          | `find lib/design -name *.ts`                             |
| Linhas totais em `lib/design/archetypes/`           | **9.580 LOC** distribuídas em **231 arquivos**                                                                                                                                                   | `find … -exec cat \| wc -l`                              |
| Archetypes implementados                            | **22** (airbnb, apple, claude, figma, linear, mastercard, meta, mistral, nike, notion, opencode, pinterest, sanity, spacex, spotify, starbucks, stripe, theverge, vodafone, wired, wise, zapier) | `lib/design/archetypes/registry.generated.ts`            |
| Wrappers DS em `components/ds/` (excluindo stories) | **41**                                                                                                                                                                                           | `find components/ds -name *.tsx ! -name *.stories.tsx`   |
| Stories DS em `components/ds/`                      | **40**                                                                                                                                                                                           | `find components/ds -name *.stories.tsx`                 |
| Lazy archetype-specific em `components/ds/lazy/`    | **9** archetypes com componentes lazy (apple, figma, mastercard, mistral, nike, opencode, pinterest, stripe, theverge)                                                                           | `find components/ds/lazy -name *.tsx`                    |
| Primitives shadcn em `components/ui/`               | **59**                                                                                                                                                                                           | `find components/ui -name *.tsx ! -name *.stories.tsx`   |
| Vendor Kibo UI                                      | **5** (announcement, banner, dropzone, marquee, spinner)                                                                                                                                         | `ls components/kibo-ui`                                  |
| Paletas seed em `lib/design/seeds/palettes.seed.ts` | **35** (13 oficiais + 22 brand-reference)                                                                                                                                                        | `grep "slug:" palettes.seed.ts`                          |
| Fontes seed em `lib/design/seeds/fonts.seed.ts`     | **13**                                                                                                                                                                                           | `grep "slug:" fonts.seed.ts`                             |
| ESLint custom rules ativas                          | **9** total (5 ds-governance + 4 outras custom)                                                                                                                                                  | `eslint.config.mjs`                                      |
| Migrations aplicadas                                | **24** (0001 → 0023)                                                                                                                                                                             | `mcp__supabase__list_migrations`                         |
| Tabelas em `public.*`                               | **45**                                                                                                                                                                                           | `mcp__supabase__list_tables`                             |
| Linhas em `app/showcase/view.tsx`                   | **1.259**                                                                                                                                                                                        | `wc -l view.tsx`                                         |

**Métrica chave:** wrappers DS consomem **117 referências a aliases shadcn** (`bg-background`, `text-foreground`, `border-border` etc) versus **54 referências a `var(--role-*)`**. Ou seja, **68% do consumo já é shadcn-canonical de facto** — só não está admitido oficialmente.

### 1.2 Multi-tenant runtime (FUNCIONA — KEEP integral)

Path: `lib/route/getRouteByHost.ts` + `app/layout.tsx`.

Mecânica:

1. `proxy.ts` (Next 16) intercepta request, lê hostname
2. `getRouteByHost(host)` faz 1 lookup em `public.domains` JOIN `tenants → palette + font + brand` (cache TTL 60s edge em-memory). Caso fallback: lookup direto em `public.brands` (brand-root).
3. `app/layout.tsx` `RootLayout` async chama `resolveTheme()` dentro de `<Suspense>` (Next 16 cacheComponents PPR). Retorna `{ ctx, css }`.
4. Emite `<style precedence="theme">` (React 19 hoist pro `<head>`) + `<script>` que atualiza `document.documentElement.dataset.archetype/palette/theme` runtime.
5. `<RouteProvider>` injeta `brand + tenant` em Client Components via `useBrand()` / `useTenantOptional()`.

**Tudo isso funciona.** É arquitetura sólida, alinhada com Next 16 PPR canon. **Mantém intacto no pivot.**

### 1.3 Tokens invented (PROBLEMA — 39 roles em excesso vs prometido)

Os 67 roles distintos em globals.css quebram em categorias:

| Categoria                                                                                                                                                                    | Quantos | Equivalente shadcn-canonical                                 | Status                                                             |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| Page/surface (page-canvas, surface-container, surface-elevated, feature-card-bg, member-card-bg, surface-block-color)                                                        | 6       | `--background`, `--card`, `--popover`, `--muted`             | **Reskinning** — todos têm equivalente canonical                   |
| Text (text-emphasis, text-body, text-muted, text-disabled, text-inverted, text-on-accent)                                                                                    | 6       | `--foreground`, `--muted-foreground`, `--primary-foreground` | **Reskinning** parcial                                             |
| Accent (accent-primary, accent-secondary, accent-subtle, accent-promo-rare)                                                                                                  | 4       | `--primary`, `--secondary`, `--accent`                       | **Reskinning**                                                     |
| Border (border-default, border-strong, border-focus)                                                                                                                         | 3       | `--border`, `--ring`                                         | **Reskinning**                                                     |
| Semantic (success, warning, danger, info, marker, eyebrow-dot)                                                                                                               | 6       | `--destructive` + chart-1..5                                 | Parcialmente novos (warning/info/success não existem no canonical) |
| Shadow roles (shadow-card, card-hover, card-active, modal, tooltip, popover, dropdown, sheet, sticky, fab)                                                                   | 10      | shadcn tem `--shadow-sm/md/lg/xl/2xl` algorítmicos           | **Over-engineered** — 10 vs 5                                      |
| Frosted glass (blur, saturate, opacity, ring)                                                                                                                                | 4       | —                                                            | **Genuíno novo** (mobile-specific)                                 |
| Image (aspect-default/card/hero/portrait/banner/square/wide/mobile, radius, border, treatment, filter, overlay-opacity/color/gradient, shadow, focal-x/y, placeholder-color) | 19      | —                                                            | **Over-engineered** — 19 tokens só pra imagem é absurdo            |
| Icon (default, muted, accent, active, on-accent, disabled, success, warning, danger)                                                                                         | 9       | —                                                            | **Genuíno mas redundante** com text-\* roles                       |

**Veredito:** dos 67 roles, **estimadamente 25 são reskinning puro** de tokens canonical shadcn (perda líquida — quebra integração v0.dev/blocks/kibo), **30 são over-engineering** (especialmente os 19 image-_ + 10 shadow-_), **12 são genuínos** (frosted, mobile, alguns icon).

### 1.4 22 archetypes (INFLADO — 9.580 LOC pra zero validação visual)

Estrutura per archetype (Linear como exemplo, 421 LOC):

- `index.ts` (46) — composição
- `tokens.ts` (175) — Layer 1 raw colors + radius + shadow + spacing + motion + border + container + state + focus + scrollbar + selection + surfaceTreatment
- `roles.ts` (54) — Layer 1.5 overrides (declara 17 roles via strategies)
- `compat.ts` (20) — typography 5-slot compatibility
- `personality.ts` (27) — typography personality
- `photography.ts` (20)
- `iconography.ts` (16)
- `illustration.ts` (14) + `illustrations.ts` (10) — duplicação suspeita
- `voice.ts` (39)
- `mapping.md` — referência humana

**Cobertura real:** Verificando `lib/design/archetypes/linear/tokens.ts` linhas 21-53 — sim, usa OKLCH derivado do `linear.app/DESIGN.md`. **Linear, Notion, Stripe estão "OK" — tokens.ts referência DESIGN.md.** Mas:

- 22 archetypes × 421 LOC médio = **9.580 LOC**
- Stripe DESIGN.md tem `#635BFF` → archetype usa `oklch(0.55 0.2 270)` (converted) — proximidade visual perdida no caminho
- "Strategy declarativa" (literal/polarity-flip/oklch-derive/reuse/mechanic-swap) é **inventada** pelo engine; nenhuma marca de referência usa esse vocabulário. Sobre-abstração.
- `voice.ts` (39 LOC × 22 = 858 LOC) — voice tokens per archetype são aspirational, **nenhum componente os consome** atualmente

**Status REAL de cobertura visual:** zero archetypes foram renderizados num componente real até o showcase de hoje. Não há critério "está OK" baseado em validação humana.

### 1.5 32 wrappers DS + 9 lazy — inventário

**DS layer (`components/ds/*.tsx`, 41 arquivos):**

| Wrapper                    | Tier                         | Consumo tokens                                    | Status                                   |
| -------------------------- | ---------------------------- | ------------------------------------------------- | ---------------------------------------- |
| adaptive-shell.tsx         | mobile-shell                 | breakpoint canonical                              | KEEP                                     |
| app-accordion.tsx          | Tier 2                       | shadcn aliases                                    | KEEP                                     |
| app-badge.tsx              | Tier 2                       | shadcn aliases + var(--role-accent-subtle)        | ADAPT (drop role)                        |
| app-button.tsx             | Tier 2                       | shadcn aliases                                    | KEEP                                     |
| app-calendar-picker.tsx    | Tier 3                       | shadcn aliases                                    | KEEP                                     |
| app-card.tsx               | Tier 2                       | var(--role-feature-card-bg) etc                   | ADAPT                                    |
| app-chart.tsx              | Tier 3                       | shadcn Recharts                                   | KEEP                                     |
| app-command.tsx            | Tier 3                       | shadcn aliases                                    | KEEP                                     |
| app-dialog.tsx             | Tier 2                       | shadcn aliases                                    | KEEP                                     |
| app-empty.tsx              | Tier 3                       | shadcn aliases                                    | KEEP                                     |
| app-fab.tsx                | Tier 4 mobile                | var(--touch-min), var(--role-shadow-fab)          | ADAPT (drop role-shadow-fab)             |
| app-form-group.tsx         | Tier 3                       | RHF + shadcn                                      | KEEP                                     |
| app-hero.tsx               | Tier 2                       | mix                                               | ADAPT                                    |
| app-image.tsx              | Tier 2                       | var(--role-img-\*) (19 tokens!)                   | ADAPT (drop role-img-\*)                 |
| app-input.tsx              | Tier 2                       | shadcn aliases                                    | KEEP                                     |
| app-list-item.tsx          | Tier 2                       | shadcn item + roles                               | ADAPT                                    |
| app-paywall-button.tsx     | Tier 3                       | entitlements wrapper                              | KEEP                                     |
| app-select.tsx             | Tier 2                       | shadcn aliases                                    | KEEP                                     |
| app-sheet.tsx              | Tier 2                       | shadcn aliases                                    | KEEP                                     |
| app-sidebar.tsx            | Tier 3                       | shadcn sidebar block                              | KEEP                                     |
| app-skeleton.tsx           | Tier 3                       | shadcn aliases                                    | KEEP                                     |
| app-sticky-cta.tsx         | Tier 4 mobile                | safe-area + roles                                 | ADAPT                                    |
| app-tabs.tsx               | Tier 2                       | shadcn aliases                                    | KEEP                                     |
| app-textarea.tsx           | Tier 2                       | shadcn aliases                                    | KEEP                                     |
| bottom-sheet.tsx           | Tier 4 mobile                | vaul Drawer + safe-area                           | KEEP                                     |
| icon.tsx                   | Tier 2                       | lucide-react + var(--role-icon-\*)                | ADAPT (drop role-icon, use currentColor) |
| navigation-bottom.tsx      | Tier 4 mobile                | safe-area + roles                                 | ADAPT                                    |
| navigation-top.tsx         | Tier 2                       | 3 variants (standard/floating-pill/frosted-glass) | ADAPT                                    |
| persistent-mini-player.tsx | Tier 4 mobile (Spotify-spec) | mix                                               | KEEP                                     |
| safe-area-wrapper.tsx      | mobile primitive             | env(safe-area-inset)                              | KEEP                                     |
| section.tsx                | Tier 2                       | spacing tokens                                    | KEEP                                     |
| section-header.tsx         | Tier 2                       | typography                                        | KEEP                                     |

**Lazy archetype-specific** (`components/ds/lazy/<archetype>/`):

- apple/alternating-product-tile.tsx (KEEP — Apple archetype probable survivor)
- figma/color-block-section.tsx (ARCHIVE — Figma archetype likely dropped)
- mastercard/satellite-cta.tsx (ARCHIVE)
- mistral/sunset-stripe-band.tsx (ARCHIVE)
- nike/campaign-tile.tsx (KEEP candidato)
- opencode/tui-mockup.tsx (ARCHIVE)
- pinterest/masonry-grid.tsx (ARCHIVE)
- stripe/gradient-mesh-hero.tsx (KEEP candidato)
- theverge/story-stream.tsx (ARCHIVE)

### 1.6 5 ESLint rules ds-governance — impacto

Definidas em `eslint.config.mjs` linhas 21-207. Status real:

| Rule                          | Severity | Escopo                                        | O que faz                                                           | Impacto se desligar                                            |
| ----------------------------- | -------- | --------------------------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------- |
| `no-raw-tokens-in-components` | error    | `components/**` excl ui/\*\*                  | Bloqueia `var(--surface-*)`/`--ink-*`/`--accent-*`/`--tint-*`       | **Desnecessária** se adotamos canonical — não há "raw vs role" |
| `no-raw-fontfamily`           | error    | `components/**` + `app/**` excl ui/\*\*       | Bloqueia `font-family:` literal e `font-[Inter]` Tailwind arbitrary | **Mantém em forma simplificada**                               |
| `no-icon-bypass`              | error    | `components/ds/**` + `app/**`                 | Bloqueia `<svg>` raw + import direto lucide sem wrapper `<Icon>`    | **Desnecessária complexidade** — TweakCN não força wrapper     |
| `no-vh-in-mobile-aware`       | error    | `components/ds/**` + `app-*` + `app/(pwa)/**` | Bloqueia 100vh, força dvh                                           | **MANTÉM** — universal mobile                                  |
| `no-elevation-legacy`         | warn     | global                                        | Migra `--elevation-*` → `--shadow-elevation-*`                      | **DELETE** após migration                                      |

### 1.7 Estado multi-tenant runtime

| Componente                                                  | Status                               |
| ----------------------------------------------------------- | ------------------------------------ |
| `proxy.ts` → host header                                    | FUNCIONA                             |
| `getRouteByHost` cache 60s                                  | FUNCIONA                             |
| Migration 0020 (archetype_id/palette_id/font_id em tenants) | APLICADA                             |
| Migration 0023 GRANT service_role                           | APLICADA (workaround)                |
| `<style precedence="theme">` SSR hoist                      | FUNCIONA (após fix bug #1 hoje)      |
| `swapTheme` action + revalidateTag                          | EXISTE em `app/showcase/actions.ts`  |
| Tenant seed mostra archetype/palette/font/mode              | OK (3 rows em tenants, 2 em domains) |

### 1.8 APCA Silver

Path: `lib/design/contrast.ts`. Helpers: `apca()`, `meetsApca()`, `ensureAccessible()`, `pickReadableForeground()`. Thresholds: body 75 / large 60 / non-text 45.

**Status:**

- Validator `scripts/validate-palettes.ts` existe
- Roda em `pnpm validate:apca` (prebuild hook)
- **Não há registro de gate quebrado em prod** — passou silenciosamente em 35 paletas seed

**MANTER 100%.** É genuíno diferencial técnico (TweakCN só faz WCAG ratio).

### 1.9 Cache strategy

`generateThemeCSS()` em `lib/design/generate-theme-css.ts` linhas 32-38:

```ts
'use cache'
const comboKey = `${ctx.archetypeId}:${ctx.paletteSlug}:${ctx.typographyId}:${ctx.themeMode}`
cacheTag(`combo:${comboKey}`)
cacheLife('days')
```

Combos virtuais: 22 × 35 × 13 × 4 = **40.040** combos. Realista atingíveis: ~500 (combos repetem entre tenants). 5KB CSS médio × 500 = ~2.5MB cache total. Viável em Vercel KV.

**MANTER 100%.**

### 1.10 Bugs descobertos hoje no showcase end-to-end

Reconstruí a lista por análise do CHANGELOG + sessão `2026-05-21-tweakcn-canonical-vs-invented.md` + log de migrations 0022/0023.

| #   | Bug                                                                                    | Causa raiz                                                                 | Fix aplicado                                                                      | Tipo                                                        |
| --- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1   | `Tooltip` sem `TooltipProvider` no prerender                                           | shadcn `sidebar.tsx` renderiza `Tooltip` internamente sem Provider próprio | Wrap `TooltipProvider` em `app/dashboard/page.tsx`                                | **Workaround** — fix definitivo é Provider global no layout |
| 2   | i18n namespace `showcase` não existia                                                  | `app/layout.tsx` importa `showcase.json` que não foi criado                | Criado `messages/pt-BR/showcase.json`                                             | **Bug real** — i18n keys obrigatório, fix definitivo        |
| 3   | GRANT service_role faltando em `domains`, `tenants`, `palettes`, `fonts`               | Migration 0001 não concedeu service_role nas tabelas de routing            | Migration `0023_grant_service_role_routing_tables`                                | **Bug real** — fix definitivo                               |
| 4   | `<h1>` nested (acessibilidade)                                                         | Section render h1 dentro de outro h1 (Hero + SectionHeader)                | Heading level adjustment                                                          | **Bug real** — jsx-a11y catched                             |
| 5   | CSS Tailwind v4 escaneando `.claude/worktrees/`                                        | Tailwind v4 content scan default vasculha todos os arquivos                | `@source not "../.claude"` em globals.css                                         | **Workaround** — root cause é worktrees em path scaneado    |
| 6   | `resolveTheme()` quebrando prerender (cacheComponents Next 16)                         | Headers + DB lookup uncached fora de Suspense                              | Movido pra `<ThemeStyle>` em Suspense + script runtime data-\* update             | **Fix definitivo** Next 16 PPR                              |
| 7   | RouteProvider race com prerender                                                       | `useBrand()`/`useTenant()` chamados antes do Provider resolver             | `connection()` opt-out de prerender em `app/showcase/page.tsx` + Suspense wrapper | **Workaround Next 16**                                      |
| 8   | Migration 0018 tentou transformar design system + 0019 reverteu                        | Auto-implementação rodou sem visualização — schema mudou e voltou          | Migrations 0020/0021 representam o real estado                                    | **Sintoma** do anti-pattern "implementar sem feedback loop" |
| 9   | Showcase requer hostname `showcase.lvh.me` ou `showcase.localhost` pra resolver tenant | Sem multi-tenant local DNS, dev experience trava                           | Documentado, sem fix automático                                                   | **Limitação aceita**                                        |

**Padrão observado:** dos 9 bugs, apenas 3 (#2, #3, #6) foram fixes definitivos. Os outros 6 são workarounds em sistema com decisões arquiteturais que nunca foram exercitadas em runtime. **Esse padrão confirma a tese do user de pivotar.**

---

## 2. TweakCN anatomia

### 2.1 Stack + Schema

| Camada      | TweakCN                                                 | Compatível com nosso stack?                       |
| ----------- | ------------------------------------------------------- | ------------------------------------------------- |
| Framework   | Next 15.4 + Turbopack                                   | ✅ (nós Next 16)                                  |
| Runtime     | React 19                                                | ✅                                                |
| CSS         | Tailwind v4 + shadcn/ui                                 | ✅                                                |
| State       | Zustand 5 + TanStack Query                              | ⚠️ (nós usamos RHF + Server Actions, sem Zustand) |
| ORM         | Drizzle ORM                                             | ❌ (nós Supabase + RLS)                           |
| DB          | Neon Postgres                                           | ❌ (nós Supabase)                                 |
| Auth        | better-auth + Google/GitHub OAuth                       | ❌ (nós Supabase Auth)                            |
| Payment     | Polar.sh subscriptions                                  | ❌ (nós planejamos Stripe)                        |
| Rate limit  | Vercel KV + Upstash Ratelimit                           | ✅ (nós usamos Upstash)                           |
| AI          | `@ai-sdk/google` Gemini 2.5/3 Flash via Vercel AI SDK 5 | ✅ (temos AI Gateway)                             |
| Stars/Forks | 9.9k / 631                                              | —                                                 |
| License     | **Apache-2.0** (permite fork comercial com atribuição)  | ✅                                                |

**Schema de domínio (`types/theme.ts`):**

- **28 cores canonical shadcn** (background/foreground pairs + sidebar-\* + chart-1..5)
- **3 fontes** (sans/serif/mono) — string CSS direta
- **1 radius** (rem, compound derivado em CSS pelo shadcn template)
- **6 shadow primitives** (color, opacity, blur, spread, offset-x, offset-y) → gera **8 níveis algorítmicos** (`shadow-2xs..2xl`)
- **1 letter-spacing global**
- **1 spacing opcional**
- **Dark mode:** objetos separados `{light, dark}` — não derivação OKLCH

Total: **41 propriedades flat por tema**.

### 2.2 Builder UI (4 tabs + preview + code panel + presets)

**Painel esquerdo (4 tabs):**

1. **Colors:** lista todos 28 tokens com `color-picker.tsx` (input text + native `<input type="color">` + popover). Suporta HEX/HSL/OKLCH/RGB. **HSL adjustment controls globais** (`hsl-adjustment-controls.tsx`, ~150 LOC): 3 sliders (hueShift -180..+180, saturationScale, lightnessScale) + 10+ presets (Hue ±60°/±120°/Invert, Grayscale/Muted/Vibrant, Dimmer/Brighter, combos).
2. **Typography:** font picker (`font-picker.tsx`) carregando Google Fonts dynamic. 3 sliders + letter-spacing global.
3. **Other:** radius slider, shadow controls (6 sliders + color picker), spacing slider.
4. **Generate (AI chat):** TipTap rich editor + mentions (`@[theme_name]`) + image upload + enhance-prompt + suggested pills + Vercel AI SDK `useChat` streaming + image-to-theme via Gemini multimodal.

**Preview (direita):** componentes shadcn live — Cards, Forms, Tables, Dashboard mockup, Music player.

**Code panel:**

- CSS Tailwind v3 ou v4 (toggle global)
- shadcn registry command (`pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/<id>`)
- v0.dev registry payload (`/r/v0/[id]`)
- Copy/share/Figma export
- Toggle formato cor (HEX/HSL/OKLCH/RGB)

**23 presets built-in** em `utils/theme-presets.ts` (~114KB): modern-minimal, violet-bloom, mocha-mousse, amethyst-haze, kodama-grove, cosmic-night, quantum-rose, bold-tech, elegant-luxury, amber-minimal, neo-brutalism, solar-dusk, pastel-dreams, clean-slate, ocean-breeze, retro-arcade, midnight-bloom, northern-lights, vintage-paper, sunset-horizon, starry-night, soft-pop, sage-garden.

### 2.3 AI generation

`lib/ai/prompts.ts` (~80 linhas de system prompt): cobre **Color Harmony, Font Pairing, Mode-Aware Shadows, Letter Spacing & Radius Commitment, Design Coherence**. Excelente baseline.

`lib/ai/generate-theme/tools.ts`: AI tool `generateTheme` com `streamObject`. Output validado contra Zod `themeStylesSchema`.

`app/api/generate-theme/route.ts`: POST stream AI (Gemini), rate-limited 5/60s, Polar subscription gate (Pro-only após 5 grátis).

**Image-to-theme:** LLM analisa imagem (Gemini multimodal) — **não pixel-extraction**, é análise visual semântica. Boa UX.

### 2.4 Registry HTTP + OAuth 2.0

- **`/r/themes/[id]/route.ts`:** retorna `registryItem` validado contra `shadcn/schema`. Public, CORS `*`, `force-static`. **Cada theme TweakCN é instalável via `npx shadcn add <url>`.**
- **`/r/v0/[id]/route.ts`:** payload v0.dev format.
- **OAuth 2.0 server próprio:** schema `oauth_app`/`oauth_authorization_code`/`oauth_token` + endpoints `/oauth/*`. Scope `themes:read`. **Apps externas podem ler themes salvos do usuário** — interessante pra migration tool no admin.
- **API REST:** `/api/v1/themes` + `/api/v1/themes/[themeId]` — OAuth-protected.

### 2.5 23 presets — qualidade

Análise por sample (modern-minimal, neo-brutalism, vintage-paper, mocha-mousse): cada preset é uma tupla `{light: ThemeStyleProps, dark: ThemeStyleProps}` em JSON inline. Validados visualmente pela comunidade (likes em community_theme table). **Pullable como seed inicial.**

### 2.6 Diretamente copiável vs adaptar vs não usável

| Peça TweakCN                                  | Path                                                                  | Status                   | Esforço estimado | Notas                                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------- | ------------------------ | ---------------- | ---------------------------------------------------------------------------------------- |
| HSL adjustment controls                       | `components/editor/hsl-adjustment-controls.tsx`                       | **COPIA**                | 2-3h             | ~150 LOC + 10 presets cravados; depende só de culori                                     |
| Contrast checker visual                       | `components/editor/contrast-checker.tsx`                              | **ADAPTA**               | 4h               | Substituir WCAG por APCA Silver dual-gate (já temos helpers em `lib/design/contrast.ts`) |
| Color picker stack                            | `components/editor/color-picker.tsx` + `color-selector-popover.tsx`   | **COPIA**                | 3h               | Input text + native input + popover + format conversion                                  |
| AI prompt system                              | `lib/ai/prompts.ts` + `lib/ai/generate-theme/tools.ts`                | **ADAPTA**               | 6h               | Reescreve pra falar shadcn-canonical 28 tokens + nossos 5-7 archetypes em vez de flat    |
| Code panel multi-formato                      | `components/editor/code-panel.tsx` + `lib/utils/color-converter.ts`   | **COPIA**                | 4h               | culori-based, multi-format toggle                                                        |
| Shadow generator algorítmico                  | `utils/shadows.ts` (6 primitives → 8 níveis)                          | **AVALIAR**              | 2h               | Conflita com nosso `--shadow-elevation-*` semântico nomeado; pode coexistir              |
| 23 presets seed                               | `utils/theme-presets.ts` (~114KB JSON)                                | **IMPORTA via pipeline** | 3h               | One-time pull → mapear pros 28 tokens                                                    |
| Editor layout (4 tabs + preview + code panel) | `app/editor/theme/*` + `store/editor-store.ts`                        | **CLONA**                | 12-16h           | Layout principal completo; substituir Zustand por RHF + Server Actions                   |
| Font picker (Google Fonts dynamic)            | `components/editor/font-picker.tsx` + `app/api/google-fonts/route.ts` | **COPIA**                | 4h               | Útil pro tenant escolher fonte                                                           |
| Registry HTTP `/r/themes/[id]`                | `app/r/themes/[id]/route.ts`                                          | **OPCIONAL**             | 3h               | Útil pra `npx shadcn add` workflow                                                       |
| Better-auth + Drizzle + Neon + Polar          | múltiplos arquivos                                                    | **NÃO USA**              | —                | Temos Supabase + RLS + Stripe planejado                                                  |
| OAuth 2.0 server                              | `app/api/oauth/*`                                                     | **NÃO USA**              | —                | Over-engineering pro caso B2B                                                            |
| TipTap rich editor + mentions                 | `components/editor/ai/chat-interface.tsx`                             | **AVALIA**               | 6h               | Nice-to-have, não bloqueante                                                             |

**Total esforço pra copiar/adaptar TweakCN UI core:** **40-50h** (HSL + contrast + color picker + AI + code panel + editor layout + presets).

---

## 3. Plano migração KEEP / ADAPT / ARCHIVE / DELETE / NEW

### 3.1 KEEP — manter intacto

| Item                                                                                                             | Path                                                                                                                                                                                         | Razão                                                                                                                                                                       |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Multi-tenant runtime resolver                                                                                    | `lib/route/getRouteByHost.ts`                                                                                                                                                                | Funciona, arquitetura correta, sem alternativa melhor                                                                                                                       |
| RouteProvider hooks                                                                                              | `lib/route/RouteProvider.tsx`                                                                                                                                                                | `useBrand()`/`useTenant()` consumidos em vários lugares                                                                                                                     |
| Proxy hostname → headers                                                                                         | `proxy.ts`                                                                                                                                                                                   | Next 16 canon                                                                                                                                                               |
| Theme CSS injection SSR                                                                                          | `app/layout.tsx` `<style precedence="theme">`                                                                                                                                                | Zero FOUC, React 19 hoist                                                                                                                                                   |
| Cache strategy combo                                                                                             | `lib/design/generate-theme-css.ts` `'use cache' + cacheTag('combo:...')`                                                                                                                     | Validado, ~500 combos viável                                                                                                                                                |
| APCA Silver helpers                                                                                              | `lib/design/contrast.ts`                                                                                                                                                                     | Diferencial técnico real, gate prebuild ativo                                                                                                                               |
| Mobile-specific tokens                                                                                           | `--touch-min`, `--inset-safe-*`, `--mobile-full-height`, `--mobile-nav-height`, `--fab-size`, `--sticky-cta-height`, `--mini-player-height`, `--press-scale`, `--hover-scale` em globals.css | Universal mobile, não branding, alinhados Apple HIG + Material 3                                                                                                            |
| Z-index system                                                                                                   | `--z-content..tooltip` em globals.css                                                                                                                                                        | Universal, não branding                                                                                                                                                     |
| Spacing Carbon 8px-base                                                                                          | `--spacing-0..32` em globals.css                                                                                                                                                             | Universal                                                                                                                                                                   |
| Frosted glass tokens                                                                                             | `--frosted-blur/saturate/opacity` em globals.css                                                                                                                                             | Mobile-specific genuíno                                                                                                                                                     |
| Motion tokens (12 durations + 5 easings)                                                                         | globals.css                                                                                                                                                                                  | Universal, Polaris/Material 3 canonical                                                                                                                                     |
| AdaptiveShell breakpoint canonical 768px                                                                         | `components/ds/adaptive-shell.tsx` + `hooks/use-mobile.ts`                                                                                                                                   | Pattern correto                                                                                                                                                             |
| SafeAreaWrapper                                                                                                  | `components/ds/safe-area-wrapper.tsx`                                                                                                                                                        | iOS notch/Dynamic Island handling                                                                                                                                           |
| BottomSheet (vaul Drawer)                                                                                        | `components/ds/bottom-sheet.tsx`                                                                                                                                                             | Mobile primitive correto                                                                                                                                                    |
| 5 Kibo UI primitives                                                                                             | `components/kibo-ui/{announcement,banner,dropzone,marquee,spinner}`                                                                                                                          | Vendor shadcn-compatible, sem invented roles                                                                                                                                |
| 59 shadcn primitives                                                                                             | `components/ui/*.tsx`                                                                                                                                                                        | Vendor pristine (53 originais + 6 typography custom — heading/text/muted/logo)                                                                                              |
| `<Heading>`/`<Text>`/`<Muted>`/`<Logo>` typography primitives                                                    | `components/ui/heading.tsx` etc                                                                                                                                                              | Mantém — abstração typography sólida                                                                                                                                        |
| **9 lazy archetype-specific que renderizam OK independente**                                                     | `components/ds/lazy/{apple,figma,mastercard,mistral,nike,opencode,pinterest,stripe,theverge}`                                                                                                | **Verificar caso-a-caso** — alguns são "templates" reutilizáveis (Stripe gradient-mesh-hero), outros são archetype-bound (Pinterest masonry só vive em archetype Pinterest) |
| Tabela `tenants` colunas `archetype_id text + palette_id uuid FK + font_id uuid FK + theme_mode + theme_version` | Migration 0020                                                                                                                                                                               | Schema correto, multi-tenant funciona                                                                                                                                       |
| Migration 0023 GRANT service_role                                                                                | DB                                                                                                                                                                                           | Fix definitivo bug real                                                                                                                                                     |
| Tabela `tenant_theme_presets` reserve                                                                            | Migration 0021                                                                                                                                                                               | Reserve schema pra editor visual (próxima fase)                                                                                                                             |
| 9 ESLint rules custom não-DS                                                                                     | `eslint.config.mjs` (token-bypass, vocab-banido, brand-hardcode, plan-gates, css-var-in-style, server-only-guard)                                                                            | Sólidas, não relacionadas ao pivot                                                                                                                                          |

**Subtotal KEEP:** ~20 itens críticos.

### 3.2 ADAPT — manter mas reescrever pra shadcn-canonical

| Item                                  | Path                                   | O que muda                                                                                                                                                                                                    | Esforço                      |
| ------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| Token contract Zod                    | `lib/design/contract/*`                | Reduzir 19+ sub-schemas pra schema flat shadcn-canonical (28 cores + 3 fontes + 1 radius + shadow primitives + spacing + letter-spacing)                                                                      | 6h                           |
| `build-theme-css.ts` builder          | `lib/design/build-theme-css.ts`        | Emit shadcn canonical CSS vars (`--background`, `--foreground`, `--card`, etc) — drop `--role-*` emission                                                                                                     | 4h                           |
| `generate-theme-css.ts` wrapper cache | `lib/design/generate-theme-css.ts`     | Mantém estrutura, só ajusta typing do `ThemeContext`                                                                                                                                                          | 1h                           |
| `validate-combo.ts` APCA dual-gate    | `lib/design/validate-combo.ts`         | Adaptar pra validar 28 canonical pairs (background/foreground, primary/primary-foreground, etc)                                                                                                               | 3h                           |
| `role-resolver.ts` strategies         | `lib/design/role-resolver.ts`          | **DELETE** — sem invented roles, sem strategies                                                                                                                                                               | —                            |
| `app/globals.css`                     | linhas 326-407 (28+ blocos `--role-*`) | Substituir 67 roles invented por 28 canonical shadcn aliases. Manter mobile + spacing + motion + frosted                                                                                                      | 8h                           |
| 32 wrappers DS — migration consumo    | `components/ds/*.tsx`                  | Trocar `var(--role-text-emphasis)` → `text-foreground`, `var(--role-surface-container)` → `bg-card`, `var(--role-accent-primary)` → `bg-primary`, etc                                                         | 12-16h (manual mas mecânico) |
| 5 ESLint rules ds-governance          | `eslint.config.mjs` linhas 21-207      | Simplificar pra 2 rules: `no-raw-fontfamily` + `no-vh-in-mobile-aware`. **Drop** no-raw-tokens-in-components (sem distinção raw/role), no-icon-bypass (over-engineered), no-elevation-legacy (após migration) | 2h                           |
| `.claude/rules/design-tokens.md`      | rule                                   | Reescreve tabela canonical pra refletir shadcn-canonical 28 + extras opcionais archetype-specific                                                                                                             | 1h                           |
| `.claude/rules/components.md`         | rule                                   | Atualiza pra "wrappers DS usam shadcn aliases + Tailwind utilities; native aliases só em lazy archetype"                                                                                                      | 1h                           |
| `.claude/rules/shadcn-zone.md`        | rule                                   | Atualiza ponteiros + ADR                                                                                                                                                                                      | 0.5h                         |
| `app/layout.tsx` ThemeStyle           | `app/layout.tsx` linhas 264-278        | Mantém estrutura, só typing                                                                                                                                                                                   | 0.5h                         |
| `lib/design/seeds/palettes.seed.ts`   | seed                                   | Mantém 35 palette slugs, mas reduz props (drop strategy hints, manter só primary_oklch + neutral_hue + accent_hue)                                                                                            | 4h                           |

**Subtotal ADAPT:** ~13 itens, **~45h**.

### 3.3 ARCHIVE — mover pra `docs/_archive/` (referência histórica)

| Item                                                                        | Path                                                                          | Por quê                                                                                                                         |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| 22 archetypes folders completos                                             | `lib/design/archetypes/*/` (excluindo `_template/` que vira boilerplate novo) | 9.580 LOC sem validação visual; reescreve 5-7 do zero copiando DESIGN.md literal                                                |
| Strategy schema declarativa                                                 | `lib/design/contract/strategy.ts`                                             | Conceito de "polarity-flip/oklch-derive/reuse/mechanic-swap" não é nem shadcn nem TweakCN canon — over-abstraction              |
| Voice tokens per archetype                                                  | `lib/design/archetypes/*/voice.ts` (22 × 39 LOC = 858 LOC)                    | Nunca consumidos por componente                                                                                                 |
| Roles overrides per archetype                                               | `lib/design/archetypes/*/roles.ts` (22 arquivos)                              | Drop com a layer 1.5 inteira                                                                                                    |
| Tokens per archetype                                                        | `lib/design/archetypes/*/tokens.ts` (22 arquivos)                             | 9.580 LOC. Subset (5-7) renasce, mas como **preset shadcn-canonical** em formato similar ao `utils/theme-presets.ts` do TweakCN |
| ARCHITECTURE.md atual                                                       | `docs/design-system/ARCHITECTURE.md`                                          | Será reescrita                                                                                                                  |
| Pesquisa 27 (design-tokens-per-archetype Opus)                              | `docs/research/27-design-tokens-per-archetype.md`                             | Mantém como histórico — útil pra extração de tokens proven quando reescrever 5-7 archetypes                                     |
| ADR-0043                                                                    | `docs/adr/0043-design-system-consolidated.md`                                 | Será superseded por ADR-0044                                                                                                    |
| 67 `--role-*` declarations em globals.css                                   | linhas 326-407                                                                | Substituídas por canonical                                                                                                      |
| Native aliases archetype-specific (`--mistral-sunset-*`, `--stripe-mesh-*`) | distribuídas no build                                                         | Reavaliar — manter SE archetype Mistral/Stripe sobreviver no subset 5-7                                                         |
| Stories que dependem fortemente de invented roles                           | múltiplos `*.stories.tsx` consumindo `var(--role-*)`                          | Refatorar junto com wrappers — provavelmente 20-30% das 40 stories afetadas                                                     |
| `app/showcase/*` page atual                                                 | `app/showcase/{page,view,actions}.tsx`                                        | 1.259 LOC — refazer com escopo menor após pivot                                                                                 |
| Plans `docs/plans/design-system.md` atual                                   | plano                                                                         | Substituído por `docs/plans/design-system-pivot.md` novo                                                                        |
| Worktrees em `.claude/worktrees/agent-*`                                    | path                                                                          | Já obsoletos; lockados mas confundem tooling                                                                                    |

**Subtotal ARCHIVE:** ~14 itens.

### 3.4 DELETE — apagar definitivamente

| Item                                                                         | Path                              | Razão                                                                                                          |
| ---------------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Regra `.claude/rules/design-references.md` na forma atual                    | rule                              | Tese inversa: tokens literais SÃO pra copiar de DESIGN.md (Apple/Stripe/Linear/Notion proven). Reescreve toda. |
| 5 rules `ds-governance/*` plugin no formato atual                            | `eslint.config.mjs` linhas 21-207 | Substituir por 2 rules simplificadas (no-raw-fontfamily + no-vh-in-mobile-aware)                               |
| `lib/design/role-resolver.ts`                                                | path                              | Não necessário sem layer 1.5                                                                                   |
| `lib/design/contract/strategy.ts`                                            | path                              | Conceito morto                                                                                                 |
| `lib/design/contract/roles.ts` (RolesSchema + RoleEnum)                      | path                              | Drop com layer roles                                                                                           |
| `lib/design/contract/voice.ts`                                               | path                              | Voice tokens não consumidos                                                                                    |
| `lib/design/archetypes/_template/` boilerplate atual                         | path                              | Substituir por boilerplate "preset shadcn-canonical" novo                                                      |
| Native aliases inflados (`--mistral-sunset-1..3`, `--stripe-mesh-1..4`, etc) | per archetype                     | Reavaliar 1-a-1 quando reescrever 5-7 archetypes — provavelmente delete 80%                                    |
| Hook `block-token-bypass.sh` regex atual contra `var(--surface-*)` etc       | `.claude/hooks/`                  | Atualizar regex pra shadcn-canonical                                                                           |

**Subtotal DELETE:** ~9 itens.

### 3.5 NEW — clonado/inspirado em TweakCN

| Item                                                                                 | Path-destino sugerido                                            | Origem TweakCN                                                            | Esforço            |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------ |
| Builder UI principal (layout 2 painéis)                                              | `app/admin/theme-studio/page.tsx` + view client                  | `app/editor/theme/*` + `store/editor-store.ts`                            | 12-16h             |
| HSL adjustment controls                                                              | `components/admin/theme-studio/hsl-controls.tsx`                 | `components/editor/hsl-adjustment-controls.tsx`                           | 3h                 |
| Color picker stack                                                                   | `components/admin/theme-studio/color-picker.tsx`                 | `components/editor/color-picker.tsx`                                      | 3h                 |
| Contrast checker visual (APCA-w3 não WCAG)                                           | `components/admin/theme-studio/contrast-checker.tsx`             | `components/editor/contrast-checker.tsx` + nosso `lib/design/contrast.ts` | 4h                 |
| AI prompt-to-theme (Gemini via AI Gateway)                                           | `app/api/admin/theme-studio/generate/route.ts` + chat UI         | `lib/ai/prompts.ts` + `app/api/generate-theme/route.ts`                   | 6h                 |
| Image-to-theme                                                                       | mesmo endpoint                                                   | LLM multimodal Gemini                                                     | inclui no 6h acima |
| Code panel multi-formato (HEX/HSL/OKLCH/RGB × Tailwind v3/v4)                        | `components/admin/theme-studio/code-panel.tsx`                   | `components/editor/code-panel.tsx`                                        | 4h                 |
| Preset gallery (23 TweakCN imports + 5-7 archetypes nossos)                          | `components/admin/theme-studio/preset-gallery.tsx`               | UI + pipeline import                                                      | 6h                 |
| Pipeline one-time import dos 23 TweakCN presets                                      | `scripts/import-tweakcn-presets.ts`                              | `utils/theme-presets.ts` (~114KB)                                         | 3h                 |
| 5-7 archetypes novos (Apple, Stripe, Linear, Notion, Spotify + opcional Nike, Figma) | `lib/design/presets/{apple,stripe,linear,notion,spotify,...}.ts` | DESIGN.md literal                                                         | 8h × 5-7 = 40-56h  |
| Font picker (Google Fonts dynamic)                                                   | `components/admin/theme-studio/font-picker.tsx`                  | `components/editor/font-picker.tsx` + `app/api/google-fonts/route.ts`     | 4h                 |
| ADR-0044 nova consolidada                                                            | `docs/adr/0044-design-system-shadcn-canonical.md`                | mind                                                                      | 2h                 |
| Plano novo                                                                           | `docs/plans/design-system-pivot.md`                              | mind                                                                      | 2h                 |
| Rule design-references.md reescrita                                                  | `.claude/rules/design-references.md`                             | invertendo tese                                                           | 1h                 |

**Subtotal NEW:** ~14 itens, **~95-115h** (boa parte é dos 5-7 archetypes novos — 40-56h sozinhos).

---

## 4. Ordem de execução proposta

### Fase 1 — Foundation reset (8-12h)

Objetivo: tirar invented roles da foundation, sem ainda mexer em archetypes.

1. ADR-0044 escrita + aprovada (2h)
2. Plano novo `design-system-pivot.md` (2h)
3. Rule `design-references.md` reescrita (1h)
4. Migration: nada (schema atual de tenants já suporta shadcn-canonical)
5. `app/globals.css` reescrita — substitui 67 `--role-*` por 28 canonical aliases + mantém mobile/motion/spacing/frosted/z-index (4-5h)
6. Validate APCA gate continua verde com paletas atuais (1h)
7. Build/typecheck/lint verdes (1h)

### Fase 2 — Wrappers migration (12-16h)

Objetivo: 32 wrappers DS consomem shadcn-canonical em vez de roles.

1. Auto-replace mecânico: `var(--role-text-emphasis)` → `text-foreground` (e similares) em `components/ds/*.tsx` (4h)
2. Ajustes manuais em wrappers com lógica especial (app-image, app-fab, navigation-\*, app-card) (6-8h)
3. Stories `*.stories.tsx` atualizadas (3-4h)
4. ESLint rules ds-governance simplificadas (2h)

### Fase 3 — Archetype reset (40-56h)

Objetivo: archive 22 archetypes; nasce subset 5-7 "presets" shadcn-canonical.

1. Move `lib/design/archetypes/*` → `docs/_archive/design-system/archetypes/` (2h)
2. Drop `lib/design/contract/{strategy,roles,voice}.ts` e arquivos invented (2h)
3. Reescreve `build-theme-css.ts` pra emit canonical (4h)
4. Cria 5-7 presets em `lib/design/presets/{apple,stripe,linear,notion,spotify}.ts` (8h × 5 = 40h, ou 7 × 8h = 56h)
   - Cada preset: copia tokens **literais** de `docs/references/design-systems/<brand>/DESIGN.md`
   - Schema: shadcn-canonical 28 cores + 3 fontes + radius + shadow primitives + spacing
   - Light + dark objetos separados (TweakCN-style)
5. Tenant migration: `archetype_id` text continua, mas registry agora aponta pros 5-7 (não 22). Tenants existentes com archetype não suportado fazem fallback pra `apple` (2h)
6. Validate APCA dual-gate em 5-7 × ~5 paletas reps = 25-35 combos (4h)

### Fase 4 — Builder UI clonado TweakCN (40-50h)

Objetivo: admin tem `/admin/theme-studio` funcional.

1. Layout principal 2 painéis + 4 tabs (Colors/Typography/Other/Generate) (12-16h)
2. HSL adjustment controls (3h)
3. Color picker stack (3h)
4. Contrast checker APCA visual (4h)
5. Code panel multi-formato (4h)
6. Font picker Google Fonts dynamic (4h)
7. Preset gallery — 23 TweakCN + 5-7 nossos = 28-30 presets (6h)
8. Pipeline one-time import TweakCN presets (3h)
9. NOTICE.md preservando atribuição Apache-2.0 (0.5h)

### Fase 5 — AI generation (8-12h)

Objetivo: profissional descreve "vibe" → IA gera theme.

1. AI prompt system shadcn-canonical (4h)
2. Endpoint `/api/admin/theme-studio/generate` via AI Gateway (Gemini multimodal) (3h)
3. Chat UI minimalista (4h)
4. Image-to-theme via upload (inclui acima)

### Fase 6 — Showcase + validação visual real (8-12h)

Objetivo: showcase end-to-end refeito menor, valida 5-7 presets visualmente.

1. Refaz `app/showcase/*` reduzido (~400 LOC vs 1.259 atual) (4h)
2. Cycling visual manual dos 5-7 archetypes (sem mock — DB real) (4h)
3. Ajustes nos presets baseado em feedback visual (4h)

**Total estimado:** **120-160h** (~3-4 semanas full-time, ou 6-8 semanas part-time)

---

## 5. Riscos + mitigations

| Risco                                                                                                                                          | Probabilidade    | Impacto | Mitigation                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Migration wrappers DS quebra renders existentes                                                                                                | Alta             | Médio   | Storybook decorator + playwright snapshot tests por wrapper antes/depois                                                                                                                                     |
| 5-7 archetypes em shadcn-canonical não capturam signature visual das brands (Apple sem `--apple-label-tertiary`, Stripe sem `--stripe-mesh-1`) | Média            | Alto    | **Native aliases archetype-specific permanecem como extras opt-in** sobre shadcn canonical. Lazy archetype components usam aliases via fallback chain `var(--apple-label-tertiary, var(--muted-foreground))` |
| TweakCN UI clone vira mais trabalho que estimado                                                                                               | Média            | Médio   | Começa por HSL + color picker + presets (cobertura ~60% UX); AI generation + image-to-theme JIT                                                                                                              |
| ADR-0043 já implementado em 12h — pivot custa moral                                                                                            | Já materializado | Alto    | Auditoria documenta honestamente o trade-off; sem pivot, próximos archetypes vão acumular workarounds                                                                                                        |
| TweakCN faz update incompatível upstream                                                                                                       | Baixa            | Baixo   | Fork-and-own (Apache-2.0); cherry-pick seletivo                                                                                                                                                              |
| 9 lazy archetype-specific viram órfãos se archetype dropa                                                                                      | Média            | Baixo   | Manter como "blocks/templates reusáveis" (Stripe gradient-mesh-hero pode ser usado em qualquer tenant) ou archive                                                                                            |
| Visual gap entre preset Linear nosso × Linear real                                                                                             | Média            | Baixo   | Aceita — cópia literal de tokens, não pixel-perfect                                                                                                                                                          |
| Stripe checkout vai usar 28 tokens canonical mas nosso tenant subscribe via Stripe Elements (futuro)                                           | Baixa            | Baixo   | Stripe Elements tem própria `appearance.variables` API — independente do nosso theme                                                                                                                         |

---

## 6. Métricas pra validar sucesso

| Métrica                                                   | Atual                                | Target pós-pivot                                               | Como medir                                                            |
| --------------------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- | --------------------------------------------------------------------- |
| Roles `--role-*` distintos                                | 67                                   | 0 (substituídos por shadcn canonical)                          | `grep -oE "\-\-role-[a-z-]+" globals.css \| sort -u \| wc -l`         |
| LOC em `lib/design/archetypes/`                           | 9.580                                | <3.000 (5-7 archetypes × ~400 LOC)                             | `find lib/design/archetypes -name *.ts -exec cat \| wc -l`            |
| ESLint rules ds-governance                                | 5                                    | 2                                                              | `eslint.config.mjs`                                                   |
| Bundle CSS gerado per combo                               | ~5KB est.                            | ~2-3KB                                                         | Vercel build output                                                   |
| Tempo build dev (`pnpm dev`)                              | atual baseline                       | -10-20% (menos CSS scan)                                       | `time pnpm build`                                                     |
| # bugs latentes ao renderizar showcase                    | 9 hoje                               | 0 esperado                                                     | Showcase manual cycling                                               |
| Compatibilidade ecosystem (`npx shadcn add` random block) | quebrado (precisa tradução)          | funciona out-of-box                                            | Test: `pnpm dlx shadcn add dashboard-01` + render                     |
| v0.dev export compat                                      | quebrado                             | funciona                                                       | Test: gerar componente v0.dev + cola                                  |
| TweakCN registry consumível                               | N/A                                  | funciona                                                       | Test: `pnpm dlx shadcn add https://tweakcn.com/r/themes/mocha-mousse` |
| Storybook stories que rendem em todos archetypes          | 40 não testado all-archetype         | 100% rendem 5-7 archetypes                                     | Playwright CI matrix                                                  |
| Tempo onboarding novo archetype                           | "pasta + PR" teórico (~30min config) | similar mas com tokens literais proven (~30min copy DESIGN.md) | Manual                                                                |

---

## 7. Recomendação final

**Aprovar o pivot.** Justificativas:

1. **Tese teórica vs evidência:** 22 archetypes inflados + 67 roles invented foram construídos sem feedback loop visual. TweakCN tem 9.9k stars validando shadcn-canonical 28 tokens em produção.
2. **Ecosystem compatibility = produtividade:** v0.dev + shadcn blocks + Kibo + Origin + TweakCN community = 50+ horas de UX gratis se falamos a mesma linguagem.
3. **Pivot preserva o que é genuíno:** multi-tenant runtime, mobile tokens universais, APCA Silver, cache combo — TUDO permanece.
4. **TweakCN UI é proven:** clonar (Apache-2.0) economiza ~40-50h de trial-and-error em UX.
5. **5-7 archetypes copiados literal dos DESIGN.md proven > 22 archetypes "principle-based" inflados:** Apple/Stripe/Linear/Notion são battle-tested em produção há anos.

**Trade-off aceito:** perde-se "elegância arquitetural" da camada 1.5 roles invented (que ninguém no ecossistema usa). Ganha-se runtime real, compatibility, builder UI proven, ciclo de iteração visual.

**Item bloqueante imediato:** **antes de qualquer linha de código do pivot, criar ADR-0044 + reescrever `.claude/rules/design-references.md`** pra inverter a tese (tokens literais DESIGN.md SÃO pra copiar). Sem isso, próximo Claude futuro recria o erro original.

**Pesquisa futura recomendada (não-bloqueante):** verificar se algum dos 28 canonical roles do shadcn precisa extension semantic (warning/info/success não existem no canon — talvez ADR pra reservar `--warning`/`--info`/`--success` consistente com chart-N).

---

## 8. Apêndice — arquivos auditados (paths absolutos)

Lidos integralmente:

- `C:/Users/leean/Desktop/platform/CLAUDE.md`
- `C:/Users/leean/Desktop/platform/docs/design-system/ARCHITECTURE.md`
- `C:/Users/leean/Desktop/platform/docs/research/27-design-tokens-per-archetype.md`
- `C:/Users/leean/Desktop/platform/docs/research/28-tweakcn-evaluation.md`
- `C:/Users/leean/Desktop/platform/docs/_sessions/2026-05-21-tweakcn-canonical-vs-invented.md`
- `C:/Users/leean/Desktop/platform/docs/_sessions/2026-05-19-design-rethink-mcp-scaffold.md`
- `C:/Users/leean/Desktop/platform/app/globals.css` (584 linhas)
- `C:/Users/leean/Desktop/platform/lib/design/build-theme-css.ts` (281 linhas)
- `C:/Users/leean/Desktop/platform/lib/design/generate-theme-css.ts`
- `C:/Users/leean/Desktop/platform/lib/design/contract/index.ts` (131 linhas)
- `C:/Users/leean/Desktop/platform/lib/design/archetypes/registry.generated.ts`
- `C:/Users/leean/Desktop/platform/lib/design/archetypes/linear/{tokens,roles}.ts`
- `C:/Users/leean/Desktop/platform/lib/route/{getRouteByHost,types}.ts`
- `C:/Users/leean/Desktop/platform/app/layout.tsx` (309 linhas)
- `C:/Users/leean/Desktop/platform/app/showcase/{page,view}.tsx` (parcial — 1.259 LOC view.tsx)
- `C:/Users/leean/Desktop/platform/eslint.config.mjs` (1.092 linhas)
- `C:/Users/leean/Desktop/platform/CHANGELOG.md` (parcial — 120 linhas top)

Listagens estruturais:

- `C:/Users/leean/Desktop/platform/lib/design/` (254 arquivos)
- `C:/Users/leean/Desktop/platform/lib/design/archetypes/` (231 arquivos, 9.580 LOC)
- `C:/Users/leean/Desktop/platform/components/ds/` (41 wrappers + 40 stories + 9 lazy)
- `C:/Users/leean/Desktop/platform/components/ui/` (59 primitives)
- `C:/Users/leean/Desktop/platform/components/kibo-ui/` (5 vendor primitives + stories)
- `C:/Users/leean/Desktop/platform/messages/pt-BR/` (5 namespaces: auth/common/entitlements/navigation/showcase)
- Supabase: 24 migrations (0001 → 0023), 45 tabelas em `public.*`

Externos:

- `https://github.com/jnsahaj/tweakcn` (stack + estrutura confirmados)
- `https://tweakcn.com/editor/theme` (UI tabs + componentes confirmados)

Rules path-loaded automaticamente durante a auditoria:

- `.claude/rules/{docs-writing,abstractions,contrast,layers,naming,brand,design-tokens,design-references,i18n,tenant-content}.md`

**Conclusão metodológica:** auditoria não dependeu de inferência sobre o codebase — todos os números foram medidos via `wc -l`/`grep`/listing direto. Pesquisa 28-tweakcn-evaluation já estava ~85% do TweakCN material analysis; esta auditoria agregou estado real do nosso projeto + plano executável.
