The prescribed-vs-executed compliance signal — the heart of the training loop. Color-codes whether a session was done.

```jsx
<ComplianceTag status="done" />        {/* green · Feito */}
<ComplianceTag status="partial" />     {/* amber · Parcial */}
<ComplianceTag status="missed" />      {/* red · Perdido */}
<ComplianceTag status="planned" showLabel={false} /> {/* bare dot */}
```

Use `showLabel={false}` for compact calendar/list dots.
