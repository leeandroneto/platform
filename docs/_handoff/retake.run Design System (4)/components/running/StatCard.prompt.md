KPI metric tile for the coach dashboard — big mono number, uppercase label, optional period delta.

```jsx
<StatCard label="Alunos ativos" value="1.245" delta={11} caption="vs mês anterior" />
<StatCard label="Faturamento" value="R$ 128.650" delta={10} accent />
<StatCard label="Volume" value="48,7" unit="km" tone="dark" />
```

`delta` (signed) drives ▲/▼ and green/red. `tone="dark"` for graphite sections.
