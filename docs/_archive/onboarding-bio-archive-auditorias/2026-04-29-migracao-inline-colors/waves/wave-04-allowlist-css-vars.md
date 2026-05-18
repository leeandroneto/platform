# Wave 04 — Allowlist CSS vars (documentação)

Adicionar comentário explicativo em cada linha que usa CSS var dinâmica em style={{}}.

## Formato do comentário

```tsx
// brand color: cor dinâmica do profissional via tema
style={{ color: 'var(--color-accent, hsl(var(--primary)))' }}
```

## Arquivos a documentar

Ver `allowlist-css-vars.md` para lista completa de ocorrências.

Executar após waves 01-03 estarem concluídas.
