# Performance & Bundle Engineering Spec

**Next.js 16 App Router + Tailwind v4 + shadcn + Motion 12 + React 19 + Supabase PWA (multi‑tenant fitness SaaS)**

This document delivers concrete numbers, code, and decisions for every question. All sizes are gzipped unless otherwise noted, and all assumptions follow Next.js 16's "nothing is cached by default" model with Cache Components (`cacheComponents: true`) enabled.

---

## A) Bundle budgets (size‑limit)

### A1. Concrete targets

These targets are calibrated against the realistic fact that, on this stack, a "bare" Next.js 16 App Router page with React 19 + Motion (LazyMotion) + a handful of Radix primitives + Supabase browser client lands around 150–180 KB of First Load JS gzipped before app code. The PWA `/aluno/*` shell is held to a much tighter budget because it is the path users hit on mid‑tier Android over 3G/4G during their gym sessions.

| Chunk                                           | Budget (gzip)    | Notes                                                      |
| ----------------------------------------------- | ---------------- | ---------------------------------------------------------- |
| Root `app/layout-*.js` (shared shell)           | **45 KB**        | React 19 + router + minimal client glue                    |
| Main vendor chunk (`framework-*`, `main-app-*`) | **90 KB**        | React, React DOM, Next runtime                             |
| Shared "common" chunk                           | **35 KB**        | LazyMotion `m` + supabase browser singleton + intl runtime |
| Route chunk for a typical PWA `page.tsx`        | **25 KB**        | Just the screen's components                               |
| Route chunk for a typical Pro `page.tsx`        | **50 KB**        | More widgets, charts, editor surfaces allowed              |
| **First Load JS — `/aluno/*`**                  | **170 KB total** | Hard ceiling; CI gate fails above                          |
| **First Load JS — `/dashboard/*`**              | **240 KB total** | Looser because Pro is desktop/tablet most of the time      |
| **First Load JS — `/[slug]` public**            | **130 KB total** | Marketing route, mostly static, no Supabase client         |
| Total CSS (compiled Tailwind v4, all routes)    | **40 KB**        | Tailwind v4's per‑route extraction keeps this small        |
| Critical CSS (global)                           | **14 KB**        | Matches the classical TCP slow‑start window                |
| Per‑tenant `theme.css`                          | **<10 KB**       | See section C                                              |

**Why `/aluno/*` is aggressive:** It is the PWA service‑worker‑backed surface served to logged‑in athletes on mobile. The "today" screen is the most opened view and is the LCP race we must win. Anything heavy (charts, Motion `domMax` features, rich text editors) is dynamic‑imported.

**Why `/dashboard/*` is looser:** It is a professional/admin surface on desktop with stronger network/CPU. We still gate it but allow heavier component trees (DnD program builder, charts, table virtualization, AI prompt panels).

### A2. Measuring per‑route bundles in Next.js 16

Next.js 16 deliberately trims the per‑route table from build output. **Treat the build summary as informational only — do not trust it as a CI gate.** Use three layered measurements:

1. **`size-limit` + `@size-limit/preset-app`** is the source of truth. Point its `path` globs directly at the emitted artifacts in `.next/static/chunks/**`. Set `webpack: false` because the artifacts are already built — you just want to weigh them (otherwise size-limit will try to re‑bundle them and report wrong numbers).
2. **`@next/bundle-analyzer`** (still maintained, wrap the config with `withBundleAnalyzer`) is the _diagnostic_ tool, invoked with `ANALYZE=true pnpm build`. Use it locally to find offenders; do not rely on it in CI.
3. **`next build` output** is useful only for confirming which routes were fully prerendered as a static shell vs. streamed. Per‑route KB numbers in 16 are intentionally aggregated and not stable across builds.

A practical `.size-limit.json` for this stack (place at repo root):

```json
[
  {
    "name": "Critical CSS (all routes)",
    "path": ".next/static/css/*.css",
    "limit": "14 kB",
    "webpack": false,
    "gzip": true
  },
  {
    "name": "Framework + main-app (shared)",
    "path": [".next/static/chunks/framework-*.js", ".next/static/chunks/main-app-*.js"],
    "limit": "90 kB",
    "webpack": false,
    "gzip": true
  },
  {
    "name": "Root layout chunk",
    "path": ".next/static/chunks/app/layout-*.js",
    "limit": "45 kB",
    "webpack": false,
    "gzip": true
  },
  {
    "name": "First Load JS — /aluno/today",
    "path": [
      ".next/static/chunks/framework-*.js",
      ".next/static/chunks/main-app-*.js",
      ".next/static/chunks/app/layout-*.js",
      ".next/static/chunks/app/aluno/layout-*.js",
      ".next/static/chunks/app/aluno/today/page-*.js"
    ],
    "limit": "170 kB",
    "webpack": false,
    "gzip": true
  },
  {
    "name": "First Load JS — /aluno/program/[id]",
    "path": [
      ".next/static/chunks/framework-*.js",
      ".next/static/chunks/main-app-*.js",
      ".next/static/chunks/app/layout-*.js",
      ".next/static/chunks/app/aluno/layout-*.js",
      ".next/static/chunks/app/aluno/program/[id]/page-*.js"
    ],
    "limit": "200 kB",
    "webpack": false,
    "gzip": true
  },
  {
    "name": "First Load JS — /dashboard",
    "path": [
      ".next/static/chunks/framework-*.js",
      ".next/static/chunks/main-app-*.js",
      ".next/static/chunks/app/layout-*.js",
      ".next/static/chunks/app/dashboard/layout-*.js",
      ".next/static/chunks/app/dashboard/page-*.js"
    ],
    "limit": "240 kB",
    "webpack": false,
    "gzip": true
  },
  {
    "name": "First Load JS — public /[slug]",
    "path": [
      ".next/static/chunks/framework-*.js",
      ".next/static/chunks/main-app-*.js",
      ".next/static/chunks/app/layout-*.js",
      ".next/static/chunks/app/[slug]/page-*.js"
    ],
    "limit": "130 kB",
    "webpack": false,
    "gzip": true
  },
  {
    "name": "First Load JS — /login",
    "path": [
      ".next/static/chunks/framework-*.js",
      ".next/static/chunks/main-app-*.js",
      ".next/static/chunks/app/login/page-*.js"
    ],
    "limit": "110 kB",
    "webpack": false,
    "gzip": true
  }
]
```

`package.json`:

```json
{
  "scripts": {
    "build": "next build",
    "size": "size-limit",
    "analyze": "ANALYZE=true next build"
  },
  "devDependencies": {
    "size-limit": "^11",
    "@size-limit/preset-app": "^11",
    "@size-limit/file": "^11",
    "@next/bundle-analyzer": "^16"
  }
}
```

### A3. GitHub Actions — size‑limit PR comments

`.github/workflows/size.yml`:

```yaml
name: bundle-size
on:
  pull_request:
    branches: [main]

jobs:
  size:
    runs-on: ubuntu-latest
    env:
      CI: true
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - uses: andresz1/size-limit-action@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          package_manager: pnpm
          script: pnpm dlx size-limit --json
          build_script: build
```

The action runs `pnpm build` on both PR and base, then comments the diff on the PR and **fails the check if any limit is exceeded**. This is the single CI gate for bundle bloat. (Note: the first PR that introduces this workflow will fail because the base branch has no size-limit yet — merge once and then it works on every subsequent PR.)

---

## B) Tree‑shake import patterns

| Library                                            | ✅ Do                                                                                                                                                                                                                                                                                             | ❌ Don't                                                                                                                                                      | Realistic KB (gzip)                                                                                                                                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Motion 12 — heavy**                              | `import { motion, AnimatePresence } from 'motion/react'` only in dynamic‑imported components below the fold                                                                                                                                                                                       | Importing `motion` from a root layout client component                                                                                                        | ~34 KB (full bundle once `motion` is referenced)                                                                                                                                                                   |
| **Motion 12 — LazyMotion**                         | `<LazyMotion features={domAnimation} strict>` once near the root client tree + `import { m } from 'motion/react'` everywhere else                                                                                                                                                                 | Mixing `motion.div` and `m.div` inside `LazyMotion strict` — throws to enforce savings                                                                        | **~6 KB initial** + 15 KB lazy `domAnimation`, or 25 KB if you need `domMax` for drag/layout                                                                                                                       |
| **Motion — worth lazy‑importing only where used?** | Yes for `domMax` (drag, layout animations) — async load it from a feature file when entering routes that need it (program builder DnD). For `domAnimation` (hover/tap/exit), pre‑load it synchronously — every route uses it.                                                                     | Lazy‑loading `domAnimation` causes a visible animation pop on first paint                                                                                     | Saves ~25 KB on routes without DnD                                                                                                                                                                                 |
| **Lucide React**                                   | `import { Dumbbell } from 'lucide-react'` — modern Next.js + webpack 5/Turbopack tree‑shakes named imports correctly                                                                                                                                                                              | `import * as Icons from 'lucide-react'`; or a dynamic `<Icon name={...}/>` lookup that defeats static analysis                                                | ~0.5 KB per icon, ~25 KB for 50 icons (gzip ~8 KB). Full library 1.8 MB raw — but only what you name‑import ships.                                                                                                 |
| **Lucide direct paths**                            | Only needed in React Native / Metro. In Next.js 16 the named‑import route is fine; skip the `lucide-react/dist/esm/icons/...` workaround — it just hurts DX without measurable savings                                                                                                            | —                                                                                                                                                             | Same as named import                                                                                                                                                                                               |
| **Radix primitives**                               | One import per primitive package, e.g. `@radix-ui/react-dialog`; let shadcn copy‑paste give you only what you use                                                                                                                                                                                 | Pulling `@radix-ui/themes` or a meta package                                                                                                                  | Dialog ≈ 8–10 KB · Select ≈ 12–15 KB · Popover ≈ 6–8 KB · DropdownMenu ≈ 10–12 KB · Toast ≈ 6 KB · Tooltip ≈ 4 KB · Tabs ≈ 4 KB. Plan **~6–12 KB per primitive used on a route**                                   |
| **Radix Slot**                                     | Always share — it's tiny (~1 KB) and shadcn's `asChild` pattern relies on it. Many primitives already depend on it transitively, so the marginal cost is zero                                                                                                                                     | —                                                                                                                                                             | ~1 KB                                                                                                                                                                                                              |
| **shadcn components**                              | Copy into `components/ui/<name>.tsx`; only files actually imported end up in the route chunk. **Do not** create a barrel `components/ui/index.ts`                                                                                                                                                 | A barrel file that re‑exports everything — defeats tree‑shaking in some webpack configs because side‑effect analysis fails through deep re‑exports            | Adds essentially zero beyond underlying Radix                                                                                                                                                                      |
| **Zod 4 — standard**                               | `import { z } from 'zod'` for server validation, schema sharing, API contracts                                                                                                                                                                                                                    | Using it on the client critical path when only a small validation surface is needed                                                                           | Core ~5–6 KB (57 % smaller than Zod 3); real‑world script lands at 8–12 KB                                                                                                                                         |
| **Zod 4 — mini**                                   | `import * as z from 'zod/mini'` on the client (forms, search‑param validators). Functional API: `z.optional(z.string())` instead of `z.string().optional()`                                                                                                                                       | Mixing `zod` and `zod/mini` in the same client chunk (both get pulled)                                                                                        | **~1.9 KB core** gzipped; ~10 KB for typical client form schemas. Note: locales are _not_ tree‑shaken even on mini — keep error messages on the server.                                                            |
| **next-intl 4**                                    | Server `getTranslations` in RSC; pass only needed namespaces with `pick(messages, 'Today')` to `NextIntlClientProvider`. Enable `experimental.messages.precompile: true` in the plugin. Dynamic‑import locale JSON in `i18n/request.ts`: `(await import(\`../messages/${locale}.json\`)).default` | Hydrating the entire `messages/pt-BR.json` to the client; importing every locale statically                                                                   | **Core runtime ~14–18 KB** gzipped; `intl-messageformat` adds ~12 KB on top if you use ICU formatting on the client. Locale JSON is dynamic‑imported per request, not in the main bundle                           |
| **Supabase JS**                                    | One browser singleton (`createBrowserClient` from `@supabase/ssr`); import `createClient` only from server modules. Use `createServerClient` from `@supabase/ssr` in route handlers/Server Actions                                                                                                | Calling `createBrowserClient` inside every component (creates duplicate instances and inflates closure bundle); importing the realtime sub‑module when unused | `@supabase/supabase-js` v2 **~30–35 KB**; `@supabase/ssr` adds ~3 KB. Plan **~35 KB** total on any route using Supabase from the browser. Drop Realtime (largest sub‑dep) unless you actually subscribe to changes |
| **@hookform/resolvers/standard-schema**            | `import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'`. Lazy‑import the schema itself in a dynamic component when the form is rendered below the fold (the Zod schema is the heavy part, not the resolver)                                                                | Top‑level importing all resolvers (`@hookform/resolvers`) — pulls Yup, Joi, etc. unused code paths                                                            | Resolver ~1 KB; the heavy part is Zod, which the resolver doesn't pull in by itself. Standard‑schema adapter works with Zod 4 directly.                                                                            |

**LazyMotion canonical setup** (put once, inside a client component near the root of your app shell — not in `app/layout.tsx` which is a Server Component):

```tsx
// components/motion-provider.tsx
'use client'
import { LazyMotion, domAnimation, MotionConfig } from 'motion/react'

// Async‑load drag/layout features only when needed
// (use in routes that have DnD program builders)
export const loadDomMax = () => import('motion/react').then((m) => m.domMax)

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}
```

Then everywhere else: `import { m, AnimatePresence } from 'motion/react'` and use `<m.div .../>`. The `strict` flag will _throw_ if anyone accidentally uses `<motion.div>` and trees the lazy savings (~28 KB) away.

---

## C) CSS multi‑tenant — avoiding duplication

Tailwind v4 emits **CSS variables** for every `@theme` token by default. This is the foundation that makes a small per‑tenant file possible.

### C1. Cascade strategy

Three layers, each owns exactly one responsibility:

```css
/* app/globals.css — shipped once, in the main bundle */
@import 'tailwindcss';

/* 1. Token DEFINITIONS — defaults only. Tailwind generates utilities from these. */
@theme {
  --color-bg: oklch(0.99 0 0);
  --color-fg: oklch(0.15 0 0);
  --color-muted: oklch(0.96 0 0);
  --color-border: oklch(0.92 0 0);

  /* Semantic palette — defaults to "default" palette */
  --color-primary: oklch(0.55 0.18 250);
  --color-primary-fg: oklch(0.99 0 0);
  --color-accent: oklch(0.65 0.18 30);

  --radius: 0.625rem;
  --font-sans: var(--font-sans-base);
  --font-display: var(--font-display-base);
}

/* 2. Dark mode overrides — also default, in the main bundle */
@layer base {
  :root[data-theme='dark'] {
    --color-bg: oklch(0.14 0 0);
    --color-fg: oklch(0.98 0 0);
    /* ... */
  }
}
```

Per‑tenant CSS, served from `/api/tenants/[id]/theme.css`, **only overrides variables — never re‑declares `@theme`, never re‑emits utilities**:

```css
/* dynamic response from /api/tenants/[id]/theme.css */
[data-tenant='acme-fit'] {
  --color-primary: oklch(0.58 0.21 14); /* coral */
  --color-primary-fg: oklch(0.99 0 0);
  --color-accent: oklch(0.74 0.12 70);
  --radius: 0.5rem;
}
[data-tenant='acme-fit'][data-theme='dark'] {
  --color-primary: oklch(0.62 0.2 14);
}
```

Render strategy in `app/layout.tsx`:

```tsx
<html lang="pt-BR" data-tenant={tenant.slug} data-theme="light">
  <head>
    {/* Tenant link is preloaded so it lands with the document */}
    <link
      rel="preload"
      as="style"
      href={`/api/tenants/${tenant.id}/theme.css`}
    />
    <link rel="stylesheet" href={`/api/tenants/${tenant.id}/theme.css`} />
  </head>
```

The route handler returns the CSS with `Cache-Control: public, max-age=300, s-maxage=86400, stale-while-revalidate=604800` so tenants can ship a color change in 5 minutes without forcing a deploy.

### C2. Expected size

A tenant override is just CSS custom property assignments. With ~21 semantic tokens, each line like `--color-primary: oklch(0.58 0.21 14);` is about 45 bytes. Two color modes × 21 tokens ≈ **~2 KB raw, ~700–900 bytes brotli'd**. Even with 4 modes (light/dark × normal/high‑contrast) and per‑typography tokens, you stay well below the 10 KB target. Treat **3 KB raw / 1 KB brotli** as the design budget.

### C3. Compression

Yes, compress it. Tiny CSS still benefits from brotli because the strings (`oklch(`, `--color-`) are highly repetitive. Vercel/Cloudflare/Bunny serve brotli by default. The win is small in absolute bytes but the route is critical‑path so every saved RTT matters.

### C4. HTTP/3 + multiplexing

One additional `<link>` for the tenant stylesheet is fine over HTTP/2 or HTTP/3 — multiplexing eliminates the historical "blocking stylesheet" cost. The real risk is **FOUC**: ship the tenant CSS as a real `<link rel="stylesheet">` in the document `<head>` (not lazy‑injected from JS), and preload it so it parses in parallel with the main CSS. With both stylesheets in `<head>`, the render is blocked until both arrive — which is what you want to avoid FOUC.

---

## D) Font loading

### D1. One font or two?

**Decision: one variable font, used for everything in the authenticated app.** Justification:

- A single Inter/Geist/Manrope variable font with `wght 100..900` ships in **~25–35 KB woff2 (latin)**.
- A second font (display/heading) adds **~30–50 KB** — roughly a 50% increase in critical‑path bytes.
- On the PWA `/aluno/today` route, the LCP element is almost always a text card ("Treino de Hoje"), so the font is on the critical path and counts against LCP directly.
- Visual hierarchy is achievable with weight (`font-bold`), size, tracking, and color — you do not need a second family.

For verticals that demand stronger visual identity in the public marketing route (yoga, dance, therapy), allow an _optional_ secondary display font scoped via `next/font/local` and loaded **only on `/[slug]/*`**, not on the authenticated app.

### D2. `next/font` config

```ts
// app/fonts.ts
import { Inter } from 'next/font/google'

export const sans = Inter({
  subsets: ['latin'], // see D3
  display: 'swap', // see below; switch to 'optional' on /aluno layout
  variable: '--font-sans',
  axes: [], // wght is default; don't add slnt unless used
  adjustFontFallback: true, // size-adjust fallback to kill CLS
  preload: true,
})
```

```tsx
// app/layout.tsx
import { sans } from './fonts'
export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={sans.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}
```

```css
/* globals.css */
@theme {
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
}
```

**`next/font/google` vs `next/font/local`:** Both self‑host on your own deployment domain — the CSS and woff2 are downloaded at build time and no request is sent to Google at runtime. Use `google` for its simplicity and automatic subsetting. Use `local` only if (a) you ship a custom commercial font, or (b) you need precise control over subsets/axes/unicode‑range that Google's API does not expose. The "Vercel CDN is faster than Google" argument is moot because `next/font/google` already self‑hosts.

**`display: 'swap'` vs `'optional'`:**

- `'swap'` → FOUT, but text is always visible (best for SEO, best for marketing landings, best for content‑heavy pages).
- `'optional'` → no swap if font is slow on first load; the font may simply not appear on the first visit, only on the next. Good for repeated PWA visits.
- **Recommendation:** `'swap'` on `/[slug]/*` and `/login`; `'optional'` on `/aluno/*` and `/dashboard/*` — the PWA caches the font on first visit and the user only sees the fallback once.

### D3. Subset for pt‑BR

`pt-BR` uses á, â, ã, à, ç, é, ê, í, ó, ô, õ, ú. **All of these are in the `latin` subset** (basic Latin‑1 covers the full pt‑BR repertoire). You do **not** need `latin-ext` (that is for Polish, Czech, Hungarian, Turkish, Vietnamese, etc.). Stick with `subsets: ['latin']` — you save roughly 10–15 KB versus `latin-ext`.

### D4. Weights

With a **variable** Inter/Geist/Manrope, weight is one axis — you ship one file, not four. Use the `wght` axis freely (400/500/600/700/800) without extra cost. If you ever fall back to a static font, ship only `400` and `600` — keep semibold instead of bold for headings, it photographs better and saves bytes (one static weight is ~25 KB woff2).

---

## E) Images

### E1. `next/image` vs `<img>` and Supabase Storage

**Use `next/image` for everything tenant‑facing**, including images uploaded to Supabase Storage. Configure `remotePatterns` to allow your Supabase project's public bucket:

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
    qualities: [60, 75, 85], // allowlist limits transformations billed
    deviceSizes: [360, 640, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 128, 256, 384],
    minimumCacheTTL: 2678400, // 31 days — see below
    formats: ['image/avif', 'image/webp'],
  },
}
```

**Vercel cost reality (default 2026 plan, transformations‑based):** $0.05 per 1 K image _transformations_ (cache MISS or STALE), $0.40 per 1 M cache reads, $4 per 1 M cache writes. Hobby gets 5 K transformations, 300 K cache reads, 100 K cache writes free per month. To keep costs predictable:

- Set `minimumCacheTTL` to **31 days** (`2678400`) — drastically cuts re‑transformations.
- Constrain `qualities` and `deviceSizes` to the smallest list you actually need (the documented `images.qualities` and `images.deviceSizes` allowlists block any other variant from being billed).
- Mark logos, SVG, and animated GIF as `unoptimized` on the component.

**When to skip Vercel optimization and direct‑serve:** if a tenant uploads a profile photo that is only shown on a single dashboard view that few users see, paying for transformation is wasteful — set `unoptimized` and rely on a pre‑resize at upload time using Supabase Storage's `transform: { width, quality }` option. For high‑volume tenant uploads, a hybrid is best: Supabase Storage's image transform for tenant uploads (cheaper per‑image), Vercel optimization for app‑bundled assets.

**Bunny CDN:** worth it for **video** (HLS, large‑file egress) where Vercel egress is expensive. For images, the cost difference vs. Vercel transformations with a 31‑day TTL is rarely worth the extra plumbing on a young SaaS — defer unless egress crosses ~5 TB/month.

### E2. Format

`['image/avif', 'image/webp']` (in that order). AVIF wins ~20–30% over WebP on photos at the same visual quality. The browser negotiates `Accept`; Vercel returns the best supported. Don't enable AVIF for tiny UI thumbnails (<10 KB) — the encoding overhead is not amortized; mark them `unoptimized`.

### E3. Lazy loading

`next/image` defaults to `loading="lazy"`. **Override with `priority` on the LCP element only** — typically one image per route. Never set `priority` on more than 1–2 elements; it kicks in `<link rel="preload">` and competes with critical CSS/JS.

### E4. LCP for `/aluno/*`

On the today screen, the LCP element is almost never an image — it is the **largest text block in the hero card** ("Treino de Hoje • Push A"). Therefore optimize LCP by:

1. Streaming that card _outside_ a Suspense boundary so it lands in the static shell.
2. Preloading the variable font with `display: 'optional'`.
3. Hoisting that card's component to the cached `'use cache'` scope with `cacheLife('minutes')` + `cacheTag(\`user-${id}-day-${date}\`)`.
4. Putting heavy/below‑the‑fold cards (history, charts) inside Suspense.

For tenant landings `/[slug]`, the LCP is usually a hero image. Use `<Image priority fetchPriority="high" sizes="100vw" />` and a tight `(min-width: 768px) 800px, 100vw` sizes hint.

---

## F) Cache Components (Next.js 16)

`next.config.ts`:

```ts
import type { NextConfig } from 'next'
const nextConfig: NextConfig = {
  cacheComponents: true,
  reactCompiler: true,
  experimental: { reactCompiler: true },
}
export default nextConfig
```

Built‑in `cacheLife` profiles (in increasing duration): `'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'max'`. You can also define custom profiles in `next.config.ts`.

### F1. Canonical patterns

**Pattern 1 — Public tenant landing `/[slug]` (cache‑first, hours).**

```tsx
// app/[slug]/page.tsx
import { cacheLife, cacheTag } from 'next/cache'

async function TenantLanding({ slug }: { slug: string }) {
  'use cache'
  cacheLife('hours') // landings change rarely; refresh hourly
  cacheTag(`tenant-${slug}`, 'tenants') // mutation triggers revalidate
  const tenant = await db.tenants.findBySlug(slug)
  return <Landing tenant={tenant} />
}

export default async function Page({ params }) {
  const { slug } = await params // params is async in 16
  return <TenantLanding slug={slug} />
}
```

**Pattern 2 — Pro dashboard home (minutes, per‑pro).**

```tsx
async function ProDashboard({ proId }: { proId: string }) {
  'use cache'
  cacheLife('minutes')
  cacheTag(`pro-${proId}-dashboard`)
  const summary = await db.dashboard.forPro(proId)
  return <DashboardCards summary={summary} />
}
```

The page itself reads `cookies()` outside `'use cache'` to get `proId`, then passes it as an argument — the argument becomes part of the cache key automatically.

**Pattern 3 — PWA `/aluno/today` (per‑user × per‑day).**

```tsx
async function TodayCard({ userId, date }: { userId: string; date: string }) {
  'use cache'
  cacheLife('minutes') // tolerate ~1 min staleness
  cacheTag(`user-${userId}-day-${date}`, `user-${userId}`)
  return <Card workout={await db.workouts.today(userId, date)} />
}
```

**Pattern 4 — Mutation invalidates with `revalidateTag`.**

```tsx
'use server'
import { revalidateTag } from 'next/cache'

export async function publishProgram(programId: string, tenantId: string) {
  await db.programs.publish(programId)
  // In 16.1.x the second arg ('max') is required to fully clear
  revalidateTag(`program-${programId}`, 'max')
  revalidateTag(`tenant-${tenantId}`, 'max')
}

export async function logSet(userId: string, date: string, set: SetInput) {
  await db.sets.insert(set)
  revalidateTag(`user-${userId}-day-${date}`, 'max')
}
```

**Important:** for per‑user content, never put `cookies()` _inside_ a `'use cache'` scope (that's a data‑leak hazard — the cache is shared across users). Always read `cookies()` in the outer Server Component and pass the user id as an argument to the cached child, or use `'use cache: private'` for truly per‑user data that should not be shared across function instances. Tag limits: up to 128 tags per cache entry, each up to 256 characters.

### F2. PPR

With `cacheComponents: true` enabled, **Partial Prerendering is on automatically**. The static shell contains everything reachable without `cookies()`, `headers()`, or `connection()`, plus any `'use cache'` subtree. Dynamic, per‑request content lives inside `<Suspense>` and streams.

**Disable / pull back when:** a route is fully personalized with no useful shell (e.g. `/api/...` route handlers — they're already excluded; or admin tools where caching introduces security risk and there's no perf win). For everything else in this app, leave PPR on. You can verify a route was fully prerendered by checking the build output summary — fully static routes are marked accordingly.

### F3. Static vs ISR vs dynamic — default for multi‑tenant

The old `dynamic = 'force-static'` and `revalidate = N` route segment configs are deprecated in 16. The new equivalents are `'use cache'` with `cacheLife('max')` and `cacheLife(<profile>)`. Defaults by route type:

| Route type                        | Pattern                                                                                 | Why                                                          |
| --------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `/[slug]` (public tenant landing) | **`'use cache' cacheLife('hours')`**, tagged per tenant                                 | Tenant data changes rarely; an instant static shell wins LCP |
| `/[slug]/blog/[post]`             | **`'use cache' cacheLife('days')`**, tagged per post + tenant                           | Content is publish‑once; invalidate on publish               |
| `/dashboard/*` (pro)              | **Dynamic shell with cached islands** (`cacheLife('minutes')` keyed on `proId`)         | Personal data; tolerable to be a minute stale                |
| `/aluno/*` (PWA)                  | **Dynamic shell with cached islands** (`cacheLife('minutes')` keyed on `userId` + date) | Per‑user, per‑day; PWA service worker handles offline        |
| `/login`, `/signup`               | **Fully dynamic, no `'use cache'`**                                                     | CSRF/session‑sensitive; caching is a security risk           |

---

## G) Performance budget per page (mid‑tier Android, Slow 3G, brotli)

Targets follow Core Web Vitals "good" thresholds (LCP ≤ 2.5 s, INP ≤ 200 ms) but tightened where we control the surface (PWA shell). TTI is the legacy "fully interactive" metric — included because the original spec asked for it; in practice we also monitor INP via Vercel Speed Insights.

| Page                       | JS budget (gzip, First Load)                                  | CSS budget                   | LCP target                         | TTI / INP target           |
| -------------------------- | ------------------------------------------------------------- | ---------------------------- | ---------------------------------- | -------------------------- |
| `/aluno/today` (PWA today) | **170 KB**                                                    | 16 KB (global) + 2 KB tenant | **≤ 2.0 s** (1.5 s on 4G)          | TTI ≤ 3.5 s · INP ≤ 200 ms |
| `/aluno/program/[id]`      | **200 KB** (allows program viewer + Motion `domMax` for drag) | 16 KB + 2 KB                 | ≤ 2.5 s                            | TTI ≤ 4.0 s · INP ≤ 200 ms |
| `/dashboard` (pro home)    | **240 KB**                                                    | 18 KB + 2 KB                 | ≤ 2.5 s                            | TTI ≤ 4.5 s · INP ≤ 200 ms |
| `/[slug]` (public landing) | **130 KB**                                                    | 14 KB + 2 KB                 | **≤ 2.0 s** (hero image preloaded) | TTI ≤ 3.0 s · INP ≤ 200 ms |
| `/login`                   | **110 KB**                                                    | 12 KB                        | ≤ 1.5 s                            | TTI ≤ 2.5 s · INP ≤ 200 ms |

Slow 3G is roughly 400 Kbps effective downlink and 400 ms RTT. A 170 KB JS payload over that channel takes ~3.4 s to download alone, so meeting LCP 2.0 s on Slow 3G requires the **static shell + cached island + text LCP** strategy described above — you cannot win this race with JS hydration on the critical path. We accept that "TTI on Slow 3G" is a stretch goal; the realistic floor is "4G mid‑tier" which is what Vercel Speed Insights samples from real users.

---

## H) React Compiler 1.0 impact

The compiler shipped 1.0 in October 2025 and is enabled in this stack via `reactCompiler: true` in `next.config.ts` (Next.js ≥ 15.3 has SWC support, 16 enables it natively).

### H1. What it handles automatically

- `useMemo` for derived values in components and hooks.
- `useCallback` for inline functions passed as props.
- `React.memo` semantics — children with unchanged props skip rerenders.
- Narrowed context reads — components only resubscribe to the slice of context they actually use (similar to `use-context-selector`, without extra code).
- Hook return‑value caching when inputs are stable.

Delete almost all manual `useMemo` / `useCallback` from new code. **Existing memoization can be left alone** — the React team explicitly recommends not stripping it in already‑shipping code without profiling, because removing it can change compiler output.

### H2. Where manual memoization is still needed

- **Stable identities for third‑party libraries** that key on referential equality (e.g. effects whose dependency is an object reused across renders, IntersectionObserver options, react‑query `queryKey` arrays).
- **Effect dependency arrays** when you specifically want an effect to fire only on a _semantic_ change, not on the compiler's heuristic boundary.
- **Imperative APIs / refs** that must persist a single identity across the full lifetime.
- **Truly expensive non‑React calculations** the compiler's heuristic does not see as worth caching (rare).
- **Deep prop passing into uncontrolled libraries** (e.g. monaco‑editor) where prop identity is the only signal the library has.

### H3. Verifying the compiler is active

1. Install React DevTools in the browser. Optimized components show a **"Memo ✨"** badge next to their name in the component tree. If the badge is absent, that component bailed out.
2. Add `eslint-plugin-react-hooks` flat config — its recommended rules now subsume the old `eslint-plugin-react-compiler` rules and surface compiler‑violating code:
   ```js
   // eslint.config.js
   import reactHooks from 'eslint-plugin-react-hooks'
   export default [reactHooks.configs.flat.recommended]
   ```
3. Inspect the production bundle: compiled components contain `react/compiler-runtime` calls and a `c()` cache buffer. Search a chunk for `react.compiler-runtime` — if absent, the compiler did not run.

### H4. Edge cases the compiler will skip (look for these warnings)

The compiler is conservative — when it sees a possibly‑unsafe pattern, it **silently bails out** of optimizing that component (it does not crash). The ESLint plugin is your defense:

- **Components or hooks that violate the Rules of React** — mutating props (`items.sort()`), reading refs during render, calling `setState` during render.
- **Class components.** Not optimized; use the function form.
- **Components that call non‑hook functions named like hooks** (e.g. a `useFoo` helper that isn't actually a hook).
- **`try/catch` around hook calls** triggers a bailout.
- **Dynamic `eval` / `new Function`** inside a component body.
- **Mutating arrays/objects received as props.**
- **Async components other than RSCs** — only Server Components may be async; async client components are not optimized.

The pragmatic rule: write idiomatic React; lint with `eslint-plugin-react-hooks`; trust the badge in DevTools. With this stack you can also use the `'use no memo'` directive to opt out a single component you haven't reviewed yet, rather than disabling the compiler globally.

---

## I) Worst‑offenders monitoring (Sentry + Vercel Analytics)

| Signal                               | Tool                                                                | How to surface                                                                                                                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Slowest routes                       | **Vercel Speed Insights**                                           | Real‑user p75/p95 LCP/INP by route. Filter `/aluno/*` separately from `/dashboard/*`; treat `/aluno/today` as a top‑level SLO.                                                                                           |
| Largest Contentful Paint regressions | **Sentry Performance + Web Vitals**                                 | Sentry captures LCP element selector and size; PR Slack alert on p75 LCP > 2.5 s on `/aluno/today`.                                                                                                                      |
| Hydration errors                     | **Sentry**                                                          | Catches `Hydration failed because the server rendered HTML didn't match the client`. Add tags `{ tenant, route }` so multi‑tenant cases (timezones, locale formatting, server‑rendered dates) are isolatable quickly.    |
| INP / interaction lag                | Vercel Speed Insights + Sentry Performance                          | Sentry's INP tracing shows the long task / handler. Most fixes are debounce, virtualization, or moving work to a transition.                                                                                             |
| Bundle bloat per commit              | **size‑limit‑action** (CI)                                          | The CI PR comment is the gate. For drift analysis over time, store the `size-limit --json` output as a GitHub Actions artifact and chart it (a simple Datadog/Grafana dashboard or even a committed history file works). |
| Server‑action errors                 | Sentry                                                              | Wrap server actions with a Sentry helper to capture user/tenant context.                                                                                                                                                 |
| Cache hit ratio                      | Vercel Observability → Image Optimization & Cache Components panels | Watch the cache‑MISS rate after a deploy — a spike means a `cacheTag` change unintentionally invalidated globally.                                                                                                       |

Add a **synthetic monitor** (Checkly or Vercel Monitoring) hitting `/aluno/today` for a test user once a minute from São Paulo — that is the only way to catch regressions that real users haven't hit yet but will at peak (Mon/Tue mornings).

---

## Reference artifacts

### 5 Next.js 16 anti‑patterns that kill performance on this stack

1. **Importing `motion` from a top‑level layout client component** — pulls the full 34 KB feature bundle into First Load JS for _every_ route, defeating `LazyMotion`. Always wrap the tree with `LazyMotion features={domAnimation} strict` and use `m.*` everywhere.
2. **Hydrating the full i18n message JSON to the client** by rendering `<NextIntlClientProvider messages={messages}>` with all namespaces. Use `pick(messages, 'Today', 'Common')` and `getTranslations` server‑side; the rest stays on the server.
3. **Caching user‑specific data with the shared `'use cache'`** — cross‑user data leak. For per‑user content, pass the user id as an argument (so the key is per‑user) and accept the memory cost, or use `'use cache: private'`. Never just `'use cache'` a component that reads `cookies()` inside it.
4. **Creating multiple Supabase browser clients** — each `createBrowserClient` call attaches its own auth listener and inflates the closure into the bundle. Export a singleton from `lib/supabase/client.ts` and import it everywhere.
5. **Barrel exports** (`components/ui/index.ts`, `lib/icons.ts` re‑exporting Lucide, `lib/motion.ts` re‑exporting Motion). Even with `sideEffects: false`, Webpack will sometimes fail to tree‑shake through deep re‑exports, especially when intermediate modules touch globals. Import each shadcn component and each Lucide icon directly from its own module path.

### Vertical → palette mapping validation

The mapping is reasonable. Quick critique per vertical (assumes OKLCH tokens with `--color-primary`/`--color-accent` pairs, all WCAG AA‑checked):

| Vertical           | Proposed palette            | Verdict & note                                                                                                                                                                           |
| ------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fitness_strength` | performance / navy / carbon | ✅ Performance + navy reads "athletic discipline"; carbon dark mode is a strong default.                                                                                                 |
| `nutrition`        | sage / rose                 | ✅ Sage = wellness/plant‑based; rose adds warmth so it doesn't read clinical.                                                                                                            |
| `yoga`             | terracotta / sage           | ✅ Earthy, grounded; both are low‑chroma and forgiving on long sessions.                                                                                                                 |
| `pilates`          | rose                        | ⚠ Single‑palette feels thin — pair with a neutral (stone/sand) accent for contrast on CTAs.                                                                                              |
| `coaching`         | indigo / default            | ✅ Indigo reads "professional/trustworthy"; default is a fine fallback.                                                                                                                  |
| `therapy`          | terracotta / minimal‑warm   | ✅ Therapeutic and non‑clinical; ensure AA contrast on terracotta CTAs.                                                                                                                  |
| `running`          | coral / performance         | ✅ Energetic; coral has good motion‑graphic affordance.                                                                                                                                  |
| `functional`       | coral                       | ⚠ Like pilates, a single palette is risky — add a high‑contrast secondary (charcoal or deep teal) for HIIT‑style intensity cues.                                                         |
| `dance`            | neon / mustard              | ⚠ Neon CTAs frequently fail AA on white backgrounds — verify each pair with a contrast checker; consider darkening neon for text use and keeping the pure neon for accents/borders only. |

**Validation rule for every palette:** every `--color-primary` / `--color-primary-fg` pair must achieve ≥ 4.5:1 contrast on both light and dark backgrounds. Add a Storybook or Playwright test that snapshots the contrast matrix per vertical to keep this from regressing.

### Hour estimate to implement all budgets + CI gates

Assuming one senior engineer comfortable with this stack:

| Workstream                                                                                                                      | Hours                           |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Install/configure size‑limit, write `.size-limit.json`, validate locally                                                        | 3                               |
| `size-limit-action` GHA workflow + first green PR                                                                               | 1                               |
| `@next/bundle-analyzer` integration + initial offender pass (Motion LazyMotion wrap, Supabase singleton, shadcn barrel cleanup) | 4                               |
| Tailwind v4 `@theme` token layer + tenant `theme.css` API route + preload wiring                                                | 4                               |
| Font setup (`next/font`, variable, `display: 'optional'` on app, `'swap'` on public)                                            | 1                               |
| `next/image` config + Supabase Storage remotePatterns + cache TTL                                                               | 2                               |
| Cache Components: tag taxonomy, 4 canonical patterns, `revalidateTag` in all mutations                                          | 6                               |
| React Compiler enablement + DevTools verification + first sweep removing dead `useMemo`/`useCallback`                           | 2                               |
| Sentry + Vercel Speed Insights wiring + per‑route SLO dashboard                                                                 | 3                               |
| Synthetic monitor for `/aluno/today`                                                                                            | 1                               |
| Performance budget per page (LCP/INP/TTI) — Playwright Lighthouse CI per route                                                  | 4                               |
| Vertical palette contrast tests (Storybook/Playwright snapshot)                                                                 | 3                               |
| Buffer for first iteration of failing budgets + tuning                                                                          | 6                               |
| **Total**                                                                                                                       | **~40 hours (≈1 working week)** |

This delivers: green CI gate on every PR, real‑user metrics flowing into Sentry + Vercel, all four cache patterns in production, and a documented budget table the team can defend against feature requests.
