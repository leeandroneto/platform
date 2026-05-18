# Contagem de violacoes

Esperado: zero em TODAS as categorias antes de promover.

## ESLint no-restricted-syntax (fonte autoritativa)

```
pnpm lint 2>&1 | grep -c "no-restricted-syntax"
Resultado: 0
```

## Grep complementar (confirmacao manual)

### Headings diretos (`<h1>`-`<h6>`)

```
grep -rn "<h[1-6][^a-z]" app/ components/ --include="*.tsx" | grep -v heading.tsx | wc -l
Resultado: 0
```

### Inline hex colors em style={{}}

```
grep -rn 'style={{[^}]*#[0-9a-fA-F]' app/ components/ --include="*.tsx" | wc -l
Resultado: 9 (TODOS sao CSS variables com fallback: var(--brand-*, #hex))
```

O selector ESLint `Literal[value=/^#.../]` so captura strings que COMECAM com `#`.
Strings como `var(--brand-bg, #0b0b0c)` comecam com `var(` — nao sao violacoes.

### Inline rgb/hsl em style={{}}

```
grep -rn 'style={{[^}]*rgb|style={{[^}]*hsl' app/ components/ --include="*.tsx" | wc -l
Resultado: 25 (TODOS sao CSS variables com fallback ou linear-gradient com hsl(var(...)))
```

Mesma logica: `Literal[value=/^rgb/]` e `Literal[value=/^hsl/]` so pegam strings que COMECAM com `rgb(` ou `hsl(`.
Strings como `var(--color-accent, hsl(var(--primary)))` comecam com `var(` — nao sao violacoes.

## Total de warnings do lint (todos os tipos)

```
pnpm lint 2>&1 | grep -c "warning"
Resultado: 1 (import/no-anonymous-default-export em .ladle/config.mjs — nao relacionado ao DS)
```

## Conclusao

Zero violacoes de design system. Seguro promover bloco a `error`.
