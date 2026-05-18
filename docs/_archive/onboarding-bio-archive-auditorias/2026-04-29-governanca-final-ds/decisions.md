# Decisoes — Fase 23

## D80 — Bloco no-restricted-syntax do ESLint promovido a error em 2026-04-29

Cobre: `<button>`, `<motion.button>`, `<h1>`-`<h6>`, hex colors, rgb, hsl em style.

6 exceptions inline documentadas com `// eslint-disable-next-line` + razao tecnica (Fase 22).

Build quebra se aparecer regressao.

Ponto de nao retorno do design system: regressao silenciosa nao e mais possivel.
