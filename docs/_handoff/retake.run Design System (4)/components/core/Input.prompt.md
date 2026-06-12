Labeled text field with terracotta focus, hint/error, and prefix/suffix adornments.

```jsx
<Input label="Ritmo alvo" suffix="/km" placeholder="3:45" />
<Input label="Email" error="Email inválido" />
<Input label="Mensalidade" prefix="R$" />
```

Passes through native input props (type, value, onChange, placeholder…). `error` turns the border red and replaces `hint`.
