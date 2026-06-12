Surface container — cream card with warm hairline + soft shadow; the building block for dashboard panels and list items.

```jsx
<Card interactive>
  <h4>Treino do dia</h4>
  <p>10×800m · ritmo alvo 3:45/km</p>
</Card>
<Card tone="dark" elevation={0}>…</Card>
```

`tone`: `light | sunken | dark`. `elevation` 0–3 maps to the shadow scale. `interactive` adds a subtle lift on hover. Override `pad`/`radius` as needed.
