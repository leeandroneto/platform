Athletic primary/secondary/ghost button — use for any action; primary (solid terracotta) is reserved for the main action in a view.

```jsx
<Button variant="primary" arrow onClick={start}>Iniciar treino</Button>
<Button variant="secondary" size="sm">Editar</Button>
<Button variant="text">Ver tudo</Button>
```

Variants: `primary` (solid terracotta), `secondary` (graphite outline), `ghost` (quiet warm-tint hover), `inverse` (cream on dark sections), `text` (inline link-like). Sizes `sm|md|lg`. Set `pill` for the stadium/track radius; `arrow` adds a trailing →. Labels render UPPERCASE automatically.
