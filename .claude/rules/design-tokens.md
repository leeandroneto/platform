## Princípio

**Vocab shadcn-canonical é a interface pública obrigatória.** Valores apontam pros tokens retake. Componentes shadcn funcionam sem editar — recoloram automaticamente via CSS vars.

## 2 universos visuais cravados

### Universo 1 — DS retake fixo (intocável)

Painel + admin + landings + app nativo. Tokens hardcoded em `app/globals.css @theme inline`.

```css
@theme inline {
  /* --- shadcn-canonical (valores apontam pros tokens retake) --- */
  --background: oklch(0.94 0.02 80); /* = creme-100 #F1ECE2 */
  --foreground: oklch(0.21 0.012 67); /* = grafite #1D1D1B */
  --card: oklch(0.97 0.015 80); /* = creme-50 */
  --card-foreground: oklch(0.21 0.012 67);
  --popover: oklch(0.97 0.015 80);
  --popover-foreground: oklch(0.21 0.012 67);
  --primary: oklch(0.62 0.13 42); /* = terracota #D96C3A */
  --primary-foreground: oklch(0.94 0.02 80);
  --secondary: oklch(0.68 0.04 215); /* = azul-oceano #7FABB5 */
  --secondary-foreground: oklch(0.21 0.012 67);
  --muted: oklch(0.94 0.014 80);
  --muted-foreground: oklch(0.58 0.005 90); /* = cinza-mineral */
  --accent: oklch(0.62 0.13 42 / 0.1);
  --accent-foreground: oklch(0.62 0.13 42);
  --destructive: oklch(0.52 0.135 32); /* = red warm */
  --border: oklch(0.88 0.022 80); /* = creme-200 */
  --input: oklch(0.88 0.022 80);
  --ring: oklch(0.62 0.13 42 / 0.55);

  /* Fonts (canonical) */
  --font-sans: var(--font-hanken); /* Hanken Grotesk body */
  --font-serif: var(--font-hanken); /* (sem serif retake) */
  --font-mono: var(--font-space-mono); /* Space Mono métricas */

  /* Radius (canonical) */
  --radius: 0.75rem; /* base 12px */

  /* --- Extensões opt-in retake (consumidas só por components/retake/*) --- */
  --font-display: var(--font-oswald); /* Headlines UPPERCASE */
  --radius-pill: 999px; /* Track motif */
  --shadow-warm-100: 0 1px 2px rgba(29, 29, 27, 0.06);
  --shadow-warm-200: 0 4px 12px rgba(29, 29, 27, 0.08);
  --shadow-warm-300: 0 16px 40px rgba(29, 29, 27, 0.14);
  --shadow-track-inset: inset 0 1px 2px rgba(29, 29, 27, 0.08);
  --tracking-eyebrow: 0.18em;
}
```

### Universo 2 — Tema do site público do tenant (editável)

Mesmo vocab shadcn-canonical. Valores variam por tenant via `public.tenant_themes` + `tenant_theme_versions` (versionado imutável).

- `deriveTokens(primary)` Edge Function — gera secondary/surfaces, valida APCA Lc ≥ 60
- `derived jsonb` cacheado em `tenant_theme_versions.derived`
- Front injeta `derived` inline em `<html style>` SSR no layout do site público

**3 níveis tenant:**

- **Grátis:** 6 paletas curadas retake (color picker fechado)
- **Apoiador:** theme builder completo + IA extrai cor de foto/Instagram/logo + versionamento imutável
- **Membro:** retake constrói à mão + theme builder pra ajuste posterior

## Composição em banco (vibe-coding-ready)

`page_versions.content jsonb`:

```jsonc
{
  "style_preset": "retake-default | minimalista | swiss | neo-brutalism",
  "blocks": [
    { "id", "kind": "hero", "variant": "default", "visible": true, "sort": 1, "props_override": {} },
    ...
  ],
  "slots": { "hero": {...}, "plans": [...] }  // copy/dados editáveis
}
```

## Hierarquia de componentes

```
components/
├── ui/                          # shadcn primitives (Button/Card/Input/Sheet/etc)
│                                  Token-agnostic, consumem CSS vars canonical
│                                  Zona quarentenada (canal único: npx shadcn add)
│
├── retake/                      # Atléticos retake-only (StatCard mono, ComplianceTag)
│                                  Consomem extensões opt-in (--font-display/--radius-pill/--shadow-warm-*)
│                                  Aparecem em painel/admin/landings/app — NUNCA site público do tenant
│
└── site/
    ├── primitives/              # Eyebrow, DisplayHeading, SectionWrapper, Container
    ├── motion/                  # Library efeitos (parallax, reveal, etc)
    ├── sections/                # Hero, About, Plans, FAQ, Testimonials — ÚNICOS
    │                              Aceitam slots + variant + props_override
    │                              Token-driven (shape vem dos CSS vars)
    ├── style-presets/           # Token sets por estilo
    │   ├── retake-default.ts
    │   ├── minimalista.ts
    │   ├── swiss.ts
    │   └── neo-brutalism.ts
    └── templates/               # Composição (qual seção, ordem, variant)
        └── retake-default/
            ├── index.tsx
            └── slots.ts
```

Seeds default por estilo: `lib/site/style-seeds/{style}.seed.ts` — define qual seções, em qual ordem, com qual variant inicial.

## Anti-patterns (ESLint enforce)

| Anti-pattern                                                             | Substituto                                   |
| ------------------------------------------------------------------------ | -------------------------------------------- |
| `var(--retake-*)` em `components/ui/**` ou `components/site/sections/**` | Use vocab canonical (`var(--primary)`)       |
| `#hex` / `rgba(...)` literal em `.ts`/`.tsx`                             | CSS var                                      |
| `style={{ color: 'var(--primary)' }}` em JSX                             | className shadcn (`text-primary`)            |
| `font-family:` literal / `font-[Inter]` arbitrary                        | `var(--font-sans/serif/mono)`                |
| `100vh` em mobile-aware                                                  | `100dvh` / `var(--mobile-full-height)`       |
| Inventar cor fora dos 28 canonical + extensões                           | Validar contra esta tabela; novo token = ADR |

## Componentes shadcn novos

Via `npx shadcn add <name>` — herdam tokens retake automaticamente porque consomem CSS vars canonical.
