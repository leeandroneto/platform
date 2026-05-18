# Brand Iconmark — Decisão Final

**Data:** 2026-05-02
**Escolhido:** Conceito 5 — Monograma "ob"

---

## O que é

SVG inline minimalista: squircle escuro + monograma "ob" em verde-lima + ponto brilhante entre as letras.

## Justificativa

| Critério             | Decisão                                                                                                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| Legibilidade em 32px | Squircle com fundo escuro cria contraste máximo; letras traçadas em lime são distintivas mesmo em miniaturas |
| Identidade imediata  | "ob" = onboarding.bio — sem ambiguidade, igual ao shortName da marca                                         |
| O ponto como âncora  | O "." é literalmente parte do domínio (`onboarding.bio`); ancora o monograma visualmente como separador      |
| App icon idiom       | Squircle é o formato padrão de ícone de app (iOS/Android); funciona nativamente como favicon/PWA             |
| Escalabilidade       | Funciona de 16×16 até 512×512 sem perda de identidade                                                        |

## Forma (viewBox 100×100)

- **Background:** squircle `rx=22`, gradiente `#1a2f0a → #0b0b0d` (escuro)
- **Borda:** `rgba(198,255,108,0.15)` espessura 0.5
- **"o":** circle `cx=33 cy=56 r=13`, stroke `#c6ff6c`, strokeWidth=6
- **"b" haste:** `M 62,22 L 62,56`, stroke lime, strokeWidth=6
- **"b" curvatura:** `M 62,44 C 62,38 68,34 76,38 C 84,42 84,52 80,58 C 76,64 68,68 62,64`
- **Ponto ".":** circle `cx=50 cy=68 r=3.5`, fill lime, glow via SVG filter

## Variantes

| Variant         | Background | Accent    |
| --------------- | ---------- | --------- |
| `dark` (padrão) | `#0b0b0d`  | `#c6ff6c` |
| `light`         | `#fafafa`  | `#4a7c20` |

## Animação

- Letras "desenham" via `stroke-dashoffset` (CSS, não JS)
- Ponto "estoura" com spring via `scale(0 → 1)`
- `prefers-reduced-motion: reduce` → animação desabilitada automaticamente
- Prop `animated={false}` por padrão (performance)

## Conceitos descartados

| Conceito               | Razão                                                       |
| ---------------------- | ----------------------------------------------------------- |
| 1 — Portal             | Negative-space da porta some em 32px                        |
| 2 — Pulse Sphere       | Gradiente radial + heartbeat: ilegível em favicon           |
| 3 — Overlapping Shapes | Dois shapes sobrepostos: muito complexo para escala pequena |
| 4 — Badge Arrow        | A seta fica invisível em tamanhos menores que 48px          |

## Assets gerados

- `app/icon.tsx` → favicon do browser (Next.js App Router, 32×32)
- `app/apple-icon.tsx` → Apple Touch icon (180×180)
- `app/opengraph-image.tsx` → OG image padrão (1200×630)
- `public/manifest.json` → atualizado para apontar aos assets corretos
