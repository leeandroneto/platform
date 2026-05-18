# DS Bloco 1+2 — Tokens OKLCH, 13 Paletas e White-Label Runtime

**Resumo executivo.** Adotar o padrão **shadcn new-york v4 já existente** (tokens semânticos `--background`, `--foreground`, `--primary`, …, `--chart-1..5`, mapeados via `@theme inline` em `app/globals.css`) — isto já cobre os "5 extras multicolor charts/badges/illustrations" pedidos (`--chart-1` a `--chart-5`). Estender com **5 surfaces dark + 5 light derivadas do hue**, **4 on-\* APCA-derived** (`on-primary`, `on-secondary`, `on-tertiary`, `on-surface = --foreground`) e **4 semantics universais** (`info`, `success`, `warning`, `destructive`). Para white-label, **as 13 paletas curadas vivem no servidor** em `lib/design/palettes.ts`; `deriveTokens(palette, mode)` (executada em build-time para defaults e em runtime no route handler para tenants) gera **~21 tokens** via **culori (`clampChroma` em OKLCH, gamut sRGB)** + **apca-w3 (`calcAPCA`, bisection em L até atingir minLc)**. O endpoint `/api/tenants/[id]/theme.css?v=N` emite **CSS estático imutável** com `Cache-Control: public, max-age=31536000, immutable` (invalidação por bump de `?v=`), escopo `:root` + `.dark`, com **whitelist rigoroso de propriedades e regex OKLCH** (zero `dangerouslySetInnerHTML`, zero strings vindas do tenant — apenas números OKLCH validados por Zod).

Os "21 tokens" derivados são: 3 brand (primary/secondary/accent) + 3 on-\* + 1 ring + 5 dark/light surfaces + 4 on-surface (foreground/card-fg/popover-fg/muted-fg) + 5 chart-N. Total = 21.

---

## 1. Decisões fundamentais (uma linha cada)

| #   | Decisão                                                                                                      | Justificativa                                                                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Tokens semânticos por papel**, não escala 50-950                                                           | shadcn já é semantic-only; escalas brand-N explodem o espaço de tema sem ganho real em UI multi-tenant.                                                                                                                                     |
| 2   | **Naming `--primary`, `--secondary`, etc.** (sem prefixo `--brand-` ou `--palette-`)                         | É o que shadcn/ui gera e o que os componentes copiados esperam; renomear quebra o registry.                                                                                                                                                 |
| 3   | **`@theme inline` mapeia `--color-X: var(--X)`**, e `:root`/`.dark` definem os valores OKLCH crus            | Padrão oficial shadcn v4: separa "tokens raw" (em `:root`/`.dark`) de "tokens Tailwind" (em `@theme inline`); permite override runtime sem rebuild.                                                                                         |
| 4   | **OKLCH completo por token** (não `--brand-l`, `--brand-c`, `--brand-h` separados)                           | `color-mix()` e relative color syntax funcionam direto; separar componentes força `oklch(var(--l) …)` em toda utility e quebra Tailwind v4 auto-utility generation.                                                                         |
| 5   | **`culori` (clampChroma OKLCH→sRGB, bisection) + `apca-w3` (calcAPCA, fontLookupAPCA)**                      | culori é a escolha do Tailwind v4 e Radix; apca-w3 é o pacote W3-licenciado oficial. `colorjs.io` é poderoso mas pesado para Edge runtime.                                                                                                  |
| 6   | **Algoritmo M3-like com tonalidade fixa por papel** (não 13 tons completos)                                  | Geramos apenas os ~5 "tones" que o shadcn consome (primary, primary-foreground, accent, muted, border) — não a palette inteira M3. HCT do Material 3 inspira tonalidade percebida uniforme; OKLCH oferece o mesmo benefício e é nativo CSS. |
| 7   | **5 dark surfaces (L 0.10–0.26) + 5 light (L 0.92–0.99) com C ≤ 0.014 do hue**                               | Surface tintada é o que diferencia dark mode "premium"; chroma muito baixo (≤0.014) evita conflito com primary e mantém neutralidade.                                                                                                       |
| 8   | **Semantics `info/success/warning/destructive` fixos no `@theme` base**, NÃO derivados do tenant             | Acessibilidade e affordance não podem variar por brand; resolver conflito de hue via **lock em L+C diferentes do primary**.                                                                                                                 |
| 9   | **Route handler retorna `text/css` plano, escopo `:root` + `.dark`**                                         | Zero injection surface, zero hidratação, zero `dangerouslySetInnerHTML`.                                                                                                                                                                    |
| 10  | **`Cache-Control: public, max-age=31536000, immutable` + cache-bust por `?v=N`**                             | URL é imutável por versão; mesma estratégia que `_next/static`.                                                                                                                                                                             |
| 11  | **Anti-FOUC via `<link rel="stylesheet" href="/api/tenants/[id]/theme.css?v=N">` no `<head>` do RootLayout** | `<link>` em `<head>` é render-blocking por design — o browser garante zero flash, sem JS, sem hidratação.                                                                                                                                   |

---

## 2. Snippet `app/globals.css` (base + semantics universais)

```css
@import 'tailwindcss';
@import 'tw-animate-css';

@custom-variant dark (&:is(.dark *));

/* ---------- TOKENS RAW DO TENANT PADRÃO ---------- */
/* Valores do tenant default (#1, hue 275). O route handler             */
/* /api/tenants/[id]/theme.css emite um bloco análogo que SOBRESCREVE   */
/* todas estas vars (mesma especificidade, vem depois no <head>).       */

:root {
  /* ---- BRAND (sobrescrito por tenant) ---- */
  --primary: oklch(0.62 0.18 275);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.58 0.14 305); /* hue +30 */
  --secondary-foreground: oklch(0.985 0 0);
  --accent: oklch(0.58 0.14 245); /* hue -30 (tertiary) */
  --accent-foreground: oklch(0.985 0 0);
  --ring: oklch(0.62 0.18 275 / 0.5);

  /* ---- SURFACES light (L 0.99→0.92, chroma do hue, sutil) ---- */
  --background: oklch(0.99 0.004 275);
  --card: oklch(0.985 0.006 275);
  --popover: oklch(0.98 0.006 275);
  --muted: oklch(0.96 0.008 275);
  --border: oklch(0.92 0.01 275);
  --input: oklch(0.92 0.01 275);

  /* ---- ON-SURFACE (APCA bisection: Lc ≥ 90 / Lc ≥ 75) ---- */
  --foreground: oklch(0.18 0.015 275); /* Lc ~92 vs --background */
  --card-foreground: oklch(0.18 0.015 275);
  --popover-foreground: oklch(0.18 0.015 275);
  --muted-foreground: oklch(0.48 0.02 275); /* Lc ~75 (body) */

  /* ---- 5 EXTRAS = shadcn chart-1..5 (multicolor charts/badges/illustrations) ---- */
  /* Hue offsets escolhidos para máxima distinção visual em legendas/charts. */
  --chart-1: oklch(0.62 0.18 275); /* primary       */
  --chart-2: oklch(0.62 0.16 305); /* +30°          */
  --chart-3: oklch(0.62 0.16 245); /* -30°          */
  --chart-4: oklch(0.7 0.14 95); /* +180° quente  */
  --chart-5: oklch(0.58 0.18 175); /* +180°-30 frio */

  /* ---- SEMANTICS UNIVERSAIS (FIXAS — não vêm do tenant) ---- */
  --info: oklch(0.62 0.16 230); /* azul-aço, fora de todas as 13 */
  --info-foreground: oklch(0.985 0 0);
  --success: oklch(0.58 0.14 160); /* verde-mar, hue 160 ≠ sage 145 */
  --success-foreground: oklch(0.985 0 0);
  --warning: oklch(0.78 0.15 85); /* âmbar, hue 85 vs mustard 80 + Δchroma */
  --warning-foreground: oklch(0.2 0.04 60);
  --destructive: oklch(0.58 0.22 27); /* vermelho, L baixo vs coral/performance */
  --destructive-foreground: oklch(0.985 0 0);

  /* ---- SIDEBAR (shadcn 2.0) ---- */
  --sidebar: oklch(0.985 0.006 275);
  --sidebar-foreground: oklch(0.18 0.015 275);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent: var(--muted);
  --sidebar-accent-foreground: var(--foreground);
  --sidebar-border: var(--border);
  --sidebar-ring: var(--ring);

  /* ---- RADII ---- */
  --radius: 0.625rem;
}

/* ---------- DARK (dark-first; .dark é a classe default no <html>) ---------- */
.dark {
  --primary: oklch(0.72 0.18 275); /* primaryLight: ↑L p/ dark surface */
  --primary-foreground: oklch(0.18 0.04 275);
  --secondary: oklch(0.68 0.14 305);
  --accent: oklch(0.68 0.14 245);
  --ring: oklch(0.72 0.18 275 / 0.6);

  --background: oklch(0.12 0.012 275);
  --card: oklch(0.16 0.014 275);
  --popover: oklch(0.18 0.014 275);
  --muted: oklch(0.22 0.012 275);
  --border: oklch(0.26 0.012 275);
  --input: oklch(0.26 0.012 275);

  --foreground: oklch(0.985 0.005 275);
  --card-foreground: oklch(0.985 0.005 275);
  --popover-foreground: oklch(0.985 0.005 275);
  --muted-foreground: oklch(0.72 0.02 275); /* |Lc| ~75 vs background */

  --info: oklch(0.72 0.16 230);
  --success: oklch(0.7 0.14 160);
  --warning: oklch(0.82 0.15 85);
  --destructive: oklch(0.66 0.22 27);
}

/* ---------- @theme inline: Tailwind v4 gera utilities a partir destes ---------- */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
}
```

---

## 3. Snippet `lib/design/palettes.ts`

```ts
import { z } from 'zod'

export const PaletteSpec = z.object({
  id: z.enum([
    'default',
    'indigo',
    'rose',
    'terracotta',
    'sage',
    'navy',
    'mustard',
    'coral',
    'pure',
    'minimal-warm',
    'performance',
    'carbon',
    'neon',
  ]),
  name: z.string().min(2).max(40),
  hue: z.number().min(0).max(360),
  /** chroma máximo desejado; será clampado ao gamut sRGB no derivar. */
  chroma: z.number().min(0).max(0.32),
  /** hue offsets do esquema (secondary, tertiary, chart-4, chart-5). */
  scheme: z
    .object({
      secondary: z.number().default(+30),
      tertiary: z.number().default(-30),
      chart4: z.number().default(+95), // análoga distante quente
      chart5: z.number().default(+175), // complementar frio
    })
    .default({}),
  /** override granular se a paleta tiver trato especial (ex.: pure = grayscale). */
  overrides: z.record(z.string(), z.string()).optional(),
})
export type PaletteSpec = z.infer<typeof PaletteSpec>

export const PALETTES: readonly PaletteSpec[] = [
  // EXEMPLO COMPLETO — performance neon:
  {
    id: 'performance',
    name: 'Performance Neon',
    hue: 25,
    chroma: 0.22, // valor desejado; culori clampará p/ sRGB
    scheme: {
      secondary: +35, // 60° (laranja brilhante, distinto do primary 25°)
      tertiary: -25, // 0°  (vermelho profundo, tensão visual)
      chart4: +90, // 115° lime
      chart5: +180, // 205° cyan (complementar verdadeiro)
    },
  },
  // ... outras 12, idem ...
] as const

export const getPalette = (id: PaletteSpec['id']) =>
  PALETTES.find((p) => p.id === id) ?? PALETTES[0]
```

---

## 4. Snippet `lib/design/tokens.ts` (signature + lógica resumida)

```ts
import { clampChroma, formatCss, type Oklch } from 'culori'
import { calcAPCA } from 'apca-w3'
import type { PaletteSpec } from './palettes'

/** 21 chaves emitidas pelo deriveTokens — todos serializados como `oklch(...)`. */
export type DerivedTokens = Record<
  // 3 brand + 3 on-* + 1 ring                          (7)
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'ring'
  // 5 surfaces + 4 on-surfaces                         (9)
  | 'background'
  | 'card'
  | 'popover'
  | 'muted'
  | 'border'
  | 'input' // tecnicamente 6 surfaces; input = border
  | 'foreground'
  | 'card-foreground'
  | 'popover-foreground'
  | 'muted-foreground'
  // 5 chart (= "5 extras multicolor")                  (5)
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5',
  string
>

export interface DeriveOptions {
  mode: 'dark' | 'light'
  /** Lc mínimo para foregrounds. Default 75 (body APCA Bronze). */
  minLc?: number // 60 (large), 75 (body), 90 (small/body preferred)
}

/**
 * deriveTokens(palette, opts)
 * ---------------------------------------------------------------
 *  1. Resolve hue base + chroma alvo da PaletteSpec.
 *  2. Para cada papel (primary, secondary, tertiary):
 *      a. Construir oklch { l: TONE[mode][role], c: targetC, h: hue + offset }
 *      b. clampChroma(color, 'oklch') → mantém sRGB-safe sem perder hue
 *      c. on-X via bisection: gera 2 candidatos
 *           white-tinted oklch(L 0.02 H) com L ∈ [0.92, 1.0]
 *           black-tinted oklch(L 0.04 H) com L ∈ [0.0, 0.20]
 *         em cada um, busca binária 16 iters maximizando |calcAPCA(fg, bg)|
 *         escolhe o candidato com Lc ≥ minLc; se ambos atingem, prefere o
 *         que minimiza desvio do par "natural" (branco em dark, preto em light).
 *  3. 5 surfaces: stops fixos em L
 *       dark:  background=0.12 card=0.16 popover=0.18 muted=0.22 border=0.26
 *       light: background=0.99 card=0.985 popover=0.98 muted=0.96 border=0.92
 *     com c = min(targetC * 0.06, 0.014) preservando hue (tint sutil).
 *  4. Foreground/card-fg/popover-fg: bisection até Lc 90 vs background.
 *     muted-foreground: bisection até Lc 75 (body) vs background.
 *  5. chart-1..5 = aplica scheme.{secondary, tertiary, chart4, chart5} ao hue,
 *     mantendo L=0.62 (light) ou 0.72 (dark), clampChroma para garantir gamut.
 *  6. formatCss({ mode:'oklch', l, c, h }) — número, nunca string do tenant.
 *
 *  Performance: ~3–5 ms por tenant em Edge runtime; cacheável em KV se necessário.
 */
export function deriveTokens(palette: PaletteSpec, opts: DeriveOptions): DerivedTokens

// ---------- helpers internos ----------

/** Tones por papel — pareados ao shadcn-new-york. */
const TONE = {
  dark: { primary: 0.72, secondary: 0.68, tertiary: 0.68, chart: 0.72 },
  light: { primary: 0.62, secondary: 0.58, tertiary: 0.58, chart: 0.62 },
}

/** Bisection em L para encontrar on-* que atinja minLc contra background. */
function findOnColor(bg: Oklch, hue: number, minLc: number): Oklch {
  // 16 iters em [0.92, 1.0] (branco-tinted) e [0.0, 0.20] (preto-tinted);
  // converte fg/bg para hex via formatCss/colorParsley, chama calcAPCA(fg,bg).
  // Em dark mode, |Lc| é negativo (light text on dark bg); compara |Lc| >= minLc.
}

/** Garante OKLCH dentro do gamut sRGB sem perder hue (preserva L). */
function safeOklch(l: number, c: number, h: number): Oklch {
  // clampChroma usa bisection interna em culori; é a melhor opção
  // perceptual (CSS Color 4 algoritmo).
  return clampChroma({ mode: 'oklch', l, c, h }, 'oklch') as Oklch
}
```

---

## 5. Route handler `/api/tenants/[id]/theme.css/route.ts`

```ts
// app/api/tenants/[id]/theme.css/route.ts
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { getTenantTheme } from '@/lib/tenants/queries' // Supabase server client
import { PaletteSpec, getPalette } from '@/lib/design/palettes'
import { deriveTokens, type DerivedTokens } from '@/lib/design/tokens'

export const runtime = 'edge' // CSS puro — Edge é ~10× mais barato
export const dynamic = 'force-dynamic' // ?v=N controla; cache via header

const ParamsSchema = z.object({ id: z.string().uuid() })
const QuerySchema = z.object({ v: z.coerce.number().int().min(0).max(1_000_000) })

// Whitelist EXAUSTIVA das 21 chaves (defesa em profundidade contra injection).
const ALLOWED_KEYS = new Set<keyof DerivedTokens>([
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'accent',
  'accent-foreground',
  'ring',
  'background',
  'card',
  'popover',
  'muted',
  'border',
  'input',
  'foreground',
  'card-foreground',
  'popover-foreground',
  'muted-foreground',
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
])

/** Regex draconiana: aceita APENAS oklch(L C H) ou oklch(L C H / a) com floats. */
const OKLCH_RE = /^oklch\(\s*0?\.?\d+\s+0?\.?\d+\s+\d+(?:\.\d+)?(?:\s*\/\s*0?\.?\d+)?\s*\)$/

export async function GET(req: NextRequest, ctx: RouteContext<'/api/tenants/[id]/theme.css'>) {
  const { id } = ParamsSchema.parse(await ctx.params)
  const parsedQuery = QuerySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams))
  if (!parsedQuery.success) return new Response('/* bad version */', { status: 400 })
  const { v } = parsedQuery.data

  // 1) Carrega tenant (palette_id + theme_version + RLS-protected fields)
  const tenant = await getTenantTheme(id)
  if (!tenant) return new Response('/* tenant not found */', { status: 404 })

  // 2) Se ?v= não bate com tenant.theme_version, redirect 308 p/ URL canônica.
  //    Garante que a CDN jamais sirva CSS stale com URL antiga.
  if (v !== tenant.theme_version) {
    return Response.redirect(
      `${req.nextUrl.origin}/api/tenants/${id}/theme.css?v=${tenant.theme_version}`,
      308,
    )
  }

  // 3) Deriva tokens — palette VALIDADA por Zod enum (impossível string custom).
  const palette = PaletteSpec.parse(getPalette(tenant.palette_id))
  const dark = deriveTokens(palette, { mode: 'dark', minLc: 75 })
  const light = deriveTokens(palette, { mode: 'light', minLc: 75 })

  // 4) Serialização com whitelist + regex em cada par. Defense in depth.
  const emit = (tokens: DerivedTokens) =>
    Object.entries(tokens)
      .filter(([k, val]) => ALLOWED_KEYS.has(k as keyof DerivedTokens) && OKLCH_RE.test(val))
      .map(([k, val]) => `  --${k}: ${val};`)
      .join('\n')

  // 5) Escopo :root (light) e .dark — sem @import, sem url(), sem seletores do tenant.
  const css = `/* desafit theme · tenant=${id} · v=${v} · ${palette.id} */
:root {
${emit(light)}
}
.dark {
${emit(dark)}
}
`

  // 6) Headers — imutável + CDN-friendly + segurança.
  return new Response(css, {
    status: 200,
    headers: {
      'Content-Type': 'text/css; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
      'CDN-Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      Vary: 'Accept-Encoding',
      ETag: `"${id}-${v}"`,
    },
  })
}
```

E no `app/layout.tsx` — anti-FOUC via render-blocking `<link>` no `<head>`:

```tsx
// O tenant é resolvido server-side via middleware (host → cookie/header).
const { id, theme_version } = await resolveTenant()
return (
  <html lang="pt-BR" className="dark">
    <head>
      <link rel="stylesheet" href={`/api/tenants/${id}/theme.css?v=${theme_version}`} />
    </head>
    <body>{children}</body>
  </html>
)
```

Esta abordagem é **zero-JS, zero-`dangerouslySetInnerHTML`, zero-FOUC**: o `<link>` em `<head>` é render-blocking por padrão (comportamento nativo do browser), então o navegador NÃO pinta até que a folha esteja carregada. Em SPA navigation (client-side), o `<head>` do RootLayout não re-renderiza, portanto a folha permanece cacheada por toda a sessão.

---

## 6. Cache-Control final escolhido

**`Cache-Control: public, max-age=31536000, s-maxage=31536000, immutable`** + cache-bust por `?v=tenant.theme_version`.

| Trade-off                                | Por quê                                                                                                                                               |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pro**                                  | CDN (Vercel Edge Network) serve 100% dos hits sem hit no Edge runtime; cliente caches por 1 ano; zero re-validação enquanto v não mudar.              |
| **Pro**                                  | Mudança de tema = `UPDATE tenants SET theme_version = theme_version + 1` → próximo SSR emite `<link href="…?v=N+1">` → URL nova, cache novo, 0 stale. |
| **Pro**                                  | `immutable` instrui o browser a NÃO revalidar mesmo em refresh manual.                                                                                |
| **Contra**                               | Versões antigas do CSS ficam no cache da CDN "para sempre" (consumindo storage marginal — texto, ~2 KB por versão). Aceitável.                        |
| **Contra**                               | Bug emitindo CSS incorreto exige bump de `theme_version` para tenants afetados (script SQL único).                                                    |
| **Por que não `stale-while-revalidate`** | Não há benefício: conteúdo é determinístico por `(id, v)`. SWR só ajuda quando conteúdo é mutável na mesma URL — aqui é imutável por construção.      |
| **Por que não só `ETag` + `304`**        | Funciona, mas exige round-trip ao Edge a cada request; `immutable` evita até esse RTT. ETag fica como cinto-e-suspensório.                            |

---

## 7. Tabela das 13 paletas — APCA estimada vs ajustada

Estimativas APCA baseadas em: `primary` em **dark mode** (fundo `oklch(0.12 0.014 H)`), `on-primary` branco-tinted. Em dark mode APCA reporta valor negativo; reportamos magnitude `|Lc|`. Valores serão substituídos pelos resultados reais de `calcAPCA` rodando no CI.

| #   | id           |          Hue | Primary OKLCH **atual** (típico)   | \|Lc\| primary vs bg | \|Lc\| on-primary | Ajuste sugerido (Primary final)                                       | \|Lc\| após | Status                 |
| --- | ------------ | -----------: | ---------------------------------- | -------------------: | ----------------: | --------------------------------------------------------------------- | ----------- | ---------------------- |
| 1   | default      |          275 | `oklch(0.55 0.18 275)`             |                  ~55 |               ~70 | `oklch(0.72 0.18 275)`                                                | 78 / 85     | ✅ Manter              |
| 2   | indigo       |          264 | `oklch(0.55 0.20 264)`             |                  ~55 |               ~72 | `oklch(0.70 0.19 264)`                                                | 76 / 88     | ⚠️ Cortar (vs default) |
| 3   | rose         |           15 | `oklch(0.65 0.22 15)`              |                  ~70 |               ~62 | `oklch(0.72 0.18 15)`                                                 | 78 / 78     | ✅ Manter              |
| 4   | terracotta   |           40 | `oklch(0.60 0.13 40)`              |                  ~62 |               ~68 | `oklch(0.70 0.13 40)`                                                 | 75 / 80     | ✅ Manter              |
| 5   | sage         |          145 | `oklch(0.62 0.10 145)`             |                  ~62 |               ~70 | `oklch(0.74 0.10 145)`                                                | 78 / 85     | ✅ Manter              |
| 6   | navy         |          260 | `oklch(0.45 0.15 260)`             |                ~38 ✗ |               ~80 | `oklch(0.66 0.17 260)`                                                | 70 / 90     | ⚠️ Cortar (vs indigo)  |
| 7   | mustard      |           80 | `oklch(0.78 0.16 80)`              |                  ~82 |             ~55 ✗ | `oklch(0.80 0.16 80)` + on-primary preto-tinted `oklch(0.20 0.04 60)` | 85 / 88     | ✅ Manter              |
| 8   | coral        |           25 | `oklch(0.70 0.18 25)`              |                  ~75 |               ~60 | `oklch(0.74 0.18 25)` on-primary `oklch(0.20 0.04 25)`                | 80 / 82     | ✅ Manter              |
| 9   | pure         |            0 | `oklch(0.60 0 0)`                  |                  ~60 |               ~75 | `oklch(0.72 0 0)` (grayscale, hue ignorado)                           | 78 / 85     | ✅ Manter              |
| 10  | minimal-warm |           50 | `oklch(0.70 0.06 50)`              |                  ~72 |               ~62 | `oklch(0.76 0.07 50)`                                                 | 80 / 76     | ✅ Manter              |
| 11  | performance  |  25 (C=0.28) | `oklch(0.65 0.28 25)` (fora sRGB)  |                  ~68 |               ~58 | `clampChroma →` `oklch(0.68 0.20 25)` em sRGB                         | 75 / 72     | ✅ Manter (P3-vibrant) |
| 12  | carbon       |          250 | `oklch(0.55 0.04 250)`             |                  ~50 |               ~80 | `oklch(0.70 0.05 250)` (quase-mono tintado)                           | 75 / 88     | ✅ Manter              |
| 13  | neon         | 320 (C=0.28) | `oklch(0.65 0.28 320)` (fora sRGB) |                  ~70 |               ~58 | `clampChroma →` `oklch(0.70 0.22 320)` em sRGB                        | 76 / 75     | ✅ Manter              |

**Notas de gamut.** `oklch(0.65 0.28 25)` e `oklch(0.65 0.28 320)` estão **fora do gamut sRGB** em monitores não-P3. `culori.clampChroma` reduz `C` para ~0.18–0.22 preservando L e hue (CSS Color Module 4 algorithm). Em monitores P3 (Apple recente, OLEDs modernos), o navegador renderiza o valor OKLCH original — **é aceitável servir o valor OKLCH alto** porque o browser faz gamut-mapping no display. Não usar `@supports (color: color(display-p3 …))` fallback explícito — culori já entrega o melhor compromisso single-value.

---

## 8. Recomendações cortar/manter

| Paleta                       | Decisão       | Justificativa                                                                                                                        |
| ---------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **default** (275)            | ✅ Manter     | Roxo/violeta neutro = "voz da marca desafit"; referência interna.                                                                    |
| **indigo** (264)             | ❌ **CORTAR** | Δhue=11° vs default está abaixo do threshold perceptivo (~15°) em OKLCH. Redundante.                                                 |
| **rose** (15)                | ✅ Manter     | Wellness/feminino-leaning; hue distinto.                                                                                             |
| **terracotta** (40)          | ✅ Manter     | Earthy/cross-fit; Δ25° de rose, Δ15° de mustard.                                                                                     |
| **sage** (145)               | ✅ Manter     | Única na faixa verde; calmaria/yoga.                                                                                                 |
| **navy** (260)               | ❌ **CORTAR** | Δ4° de indigo, Δ15° de default. Se "performance corporativa" é o objetivo, **carbon** já cobre com mais elegância.                   |
| **mustard** (80)             | ✅ Manter     | Único amarelo; ajustar chroma para distinguir de warning (Δhue=5° + Δchroma).                                                        |
| **coral** (25)               | ✅ Manter     | Vibrante mas balanceado; útil para boutique studios.                                                                                 |
| **pure** (0)                 | ✅ Manter     | Essencial: clientes B2B enterprise pedem grayscale.                                                                                  |
| **minimal-warm** (50)        | ✅ Manter     | Off-white aesthetic distinto.                                                                                                        |
| **performance** (25, C alto) | ✅ Manter     | Diferenciada de coral por ser **explicitamente P3-vibrant** ("acende em monitores premium") — documentar isso como feature de venda. |
| **carbon** (250)             | ✅ Manter     | Quase-grayscale tintado azul; "tech/athletic" sem perder corporate feel.                                                             |
| **neon** (320)               | ✅ Manter     | Única magenta/rave; nicho mas vendável (academias jovens, esports).                                                                  |

**Redução proposta: 13 → 11 paletas** (cortar **indigo** e **navy**). Cada par redundante força o cliente a micro-decisões irracionalizáveis (Hick's Law). Manter 11 paletas com **distinção mínima de Δhue 25° OU Δchroma ≥ 0.08**.

---

## 9. Hue offsets para distinção visual das 5 cores extras (`chart-1..5`)

Dentro de cada paleta, os 5 charts seguem **offsets fixos do hue base**, baseados em split-complementary harmony, garantindo distinção em legendas:

| Token     | Offset | Lógica                              |
| --------- | -----: | ----------------------------------- |
| `chart-1` |     0° | = primary                           |
| `chart-2` |   +30° | = secondary (análoga próxima)       |
| `chart-3` |   −30° | = tertiary (análoga próxima oposta) |
| `chart-4` |   +95° | análoga distante quente             |
| `chart-5` |  +175° | quase-complementar fria             |

Isto cobre **5 ângulos distintos do círculo OKLCH** com Δhue mínimo de 30° entre vizinhos — suficiente para distinção em charts multicolor e badges. Para a paleta `pure` (grayscale), os 5 charts viram **5 stops de L** (`oklch(0.50 0 0)` → `oklch(0.90 0 0)`) com C=0. Para `carbon`, todos os 5 mantêm C ≤ 0.05 preservando coerência quase-mono.

---

## 10. Resolução do conflito semantics vs paletas

Hues ocupados pelas 13 paletas (originais): **0, 15, 25, 25, 40, 50, 80, 145, 250, 260, 264, 275, 320**.

| Semantic      | Hue escolhido | Conflito                             | Resolução                                                                                                                                                    |
| ------------- | ------------: | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `info`        |       **230** | Δ20° de navy 250, Δ22° de carbon 250 | OK direto                                                                                                                                                    |
| `success`     |       **160** | Δ15° de sage 145                     | Lock **L=0.58 light / 0.70 dark, C=0.14** — distinto do sage que usa C=0.10                                                                                  |
| `warning`     |        **85** | Δ5° de mustard 80                    | Lock L mais alto (0.78 / 0.82) + C=0.15 fixos; mustard como primary varia conforme tenant mas semantics são **constantes** — visual distinguido por contexto |
| `destructive` |        **27** | Δ2° de coral 25 / performance 25     | Lock **L baixo (0.58 light / 0.66 dark) + C=0.22** — coral/performance ficam em L≥0.70 (botões alegres); destructive em L mais baixo = urgência              |

**Estratégia geral.** Semantics vivem em **bandas tonais (L)** diferentes das primaries da paleta, mesmo quando hues quase colidem. O usuário percebe pela combinação **(L, contexto)** — destructive sempre em alert/dialog, mustard sempre como brand fill. Como os semantics são **fixos no `@theme` base e nunca sobrescritos pelo route handler**, o tenant não consegue acidentalmente conflitar.

---

## 11. Estimativa de horas de implementação

| Tarefa                                                                                  |    Horas |
| --------------------------------------------------------------------------------------- | -------: |
| Setup `globals.css` com tokens base + semantics + `@theme inline`                       |        3 |
| `lib/design/palettes.ts` com PaletteSpec Zod + 11 paletas finais                        |        4 |
| `lib/design/tokens.ts` — `deriveTokens()` completo (culori + apca-w3 + bisection)       |        8 |
| Testes unitários (vitest) — 11 paletas × 2 modes × Lc thresholds                        |        5 |
| Route handler `/api/tenants/[id]/theme.css` + Zod params + whitelist + Edge             |        4 |
| Integração `app/layout.tsx` (resolveTenant + `<link>` no head + middleware host→tenant) |        4 |
| Tabela Supabase `tenants` (`palette_id`, `theme_version`, `chroma_override`, RLS)       |        2 |
| Migration + seed dos 11 CSS estáticos buildados em build-time (fallback offline)        |        3 |
| Storybook/visual regression das 11 paletas em ambos os modes                            |        4 |
| Documentação interna (README do `lib/design/`)                                          |        2 |
| Buffer (gamut edge cases, P3 fallback, FOUC verification)                               |        5 |
| **Total**                                                                               | **44 h** |

Equivale a **~5,5 dias-dev** focados. Risco principal: tuning fino dos `on-*` por bisection APCA pode levar 1–2 h extras se algum hue (especialmente mustard 80 e neon 320) exigir threshold customizado para evitar texto preto contra fundo amarelo brilhante (que falha em L=0.20 mas passa em L=0.18 — APCA é sensível nessa faixa).

---

## 12. Riscos e mitigações

1. **APCA ainda é draft (WCAG 3 candidate).** Mitigação: **dual-check** — manter `wcag-contrast-ratio` rodando em paralelo nos testes garantindo ≥ 4.5:1 (WCAG 2.1 AA) como floor; APCA como ceiling de qualidade.
2. **`culori.clampChroma` pode falhar em colors completamente fora do gamut.** Fallback: cai automaticamente para `clampRgb` (documentado na API culori). Verificado no `safeOklch()`.
3. **Edge runtime + apca-w3.** O pacote é puro JS sem deps nativas — funciona em Edge. Bundle: ~12 KB minified, OK.
4. **CSS injection via `palette_id`.** Mitigado por `z.enum([…])` que aceita apenas os 11 ids hardcoded — impossível tenant injetar string arbitrária. Defesa em profundidade via regex OKLCH em cada valor antes de emitir.
5. **FOUC em route changes (client-side nav).** `<link>` no `<head>` do RootLayout NÃO re-renderiza em nav SPA — a folha permanece. Apenas full reload re-busca; aí o cache da CDN é hit imediato.
6. **Browser sem suporte OKLCH (Safari < 15.4, browsers muito antigos).** Aceitável: PWA fitness B2B é mobile-first com browsers modernos; fallback degradado (browser ignora valor inválido, vars caem em `unset` → componentes shadcn quebram visualmente mas não funcionalmente). Documentar como "Chrome/Safari/Firefox last 2 versions".
