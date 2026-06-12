---
name: Tokens shadcn-canonical + extensões opt-in retake
description: Vocab CSS var canonical do shadcn é a interface pública. Valores apontam pros tokens retake. Recolore automático.
type: feedback
---

Vocab shadcn-canonical é a interface pública obrigatória. Valores apontam pros tokens retake. Componentes shadcn novos funcionam sem editar — recoloram automático.

**Why:** owner cravou em validação ponto-a-ponto (2026-06-11) — não inventar vocab paralelo. Manter paridade com shadcn upstream = `npx shadcn add` funciona dia 1 + theme builder do retake mexe nos MESMOS vars per-tenant pro site público.

**How to apply:**

Universo 1 (intocável) — painel/admin/landings/app:

```css
@theme inline {
  --background: oklch(0.94 0.02 80); /* creme-100 */
  --foreground: oklch(0.21 0.012 67); /* grafite */
  --primary: oklch(0.62 0.13 42); /* terracota */
  --secondary: oklch(0.68 0.04 215); /* azul-oceano */
  --muted-foreground: oklch(0.58 0.005 90); /* cinza-mineral */
  --font-sans: var(--font-hanken);
  --font-mono: var(--font-space-mono);
  --radius: 0.75rem;
  /* + outras canonical (28 cores + 3 fontes + 1 radius + 6 shadow primitives) */
}
```

Extensões opt-in (consumidas só por `components/retake/*`):

```css
--font-display: var(--font-oswald);
--radius-pill: 999px;
--shadow-warm-100: 0 1px 2px rgba(29, 29, 27, 0.06);
--shadow-warm-200: 0 4px 12px rgba(29, 29, 27, 0.08);
--shadow-warm-300: 0 16px 40px rgba(29, 29, 27, 0.14);
--tracking-eyebrow: 0.18em;
```

Universo 2 (editável) — site público do tenant:

- Mesmo vocab canonical
- Valores variam por tenant em `public.tenant_themes` + `tenant_theme_versions`
- `deriveTokens(primary)` Edge gera derivados + valida APCA Lc ≥ 60
- SSR injeta `<style precedence="theme">` inline no layout do site

3 níveis tenant:

- Grátis: 6 paletas curadas retake
- Apoiador: theme builder completo + IA extrai cor de foto/Instagram/logo
- Membro: bespoke retake + theme builder pra edição posterior

Hierarquia componentes:

- `components/ui/*` — shadcn primitives (token-agnostic, consomem CSS vars canonical)
- `components/retake/*` — atléticos retake-only (extensões opt-in)
- `components/site/*` — blocos do site (consomem tokens do tenant via CSS vars)
