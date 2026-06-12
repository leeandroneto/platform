Underline tab bar — use for in-page section switching (Visão geral / Evolução / Zonas).

```jsx
const [tab, setTab] = React.useState('overview');
<Tabs value={tab} onChange={setTab} items={[
  { id: 'overview', label: 'Visão geral' },
  { id: 'athletes', label: 'Atletas', count: 1245 },
]} />
```

Active tab gets a terracotta underline; optional `count` renders a pill.
