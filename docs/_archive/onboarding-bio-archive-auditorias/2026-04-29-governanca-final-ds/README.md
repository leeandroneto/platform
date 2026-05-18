# Auditoria: governanca final do design system

**Data:** 2026-04-29
**Fase:** 23

## Objetivo

Confirmar que TODAS as regras de design system no bloco `no-restricted-syntax` podem ser promovidas de `warn` para `error` — zero violacoes persistentes.

## Regras cobertas pelo bloco unificado

1. `no-raw-button` — `<button>` direto (Fase 22)
2. `no-raw-motion-button` — `<motion.button>` direto (Fase 22)
3. `no-direct-heading` — `<h1>`-`<h6>` direto (Fase 20)
4. `no-inline-style-color` hex — `style={{ color: '#...' }}` (Fase 21)
5. `no-inline-style-color` rgb — `style={{ color: 'rgb(...)' }}` (Fase 21)
6. `no-inline-style-color` hsl — `style={{ color: 'hsl(...)' }}` (Fase 21)

## Resultado

Todas as categorias em zero. Bloco promovido a `error`.
