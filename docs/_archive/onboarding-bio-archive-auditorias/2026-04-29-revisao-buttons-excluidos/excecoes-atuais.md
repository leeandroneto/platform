# Excecoes atuais no eslint.config (ANTES da Fase 22)

## Estado anterior

```js
// eslint.config.mjs — bloco de design system enforcement
{
  files: ["app/**/*.tsx", "components/**/*.tsx"],
  ignores: [
    "components/ui/**",
    // Justified button exceptions (motion.button, upload triggers, global-error)
    "app/(app)/onboarding/_steps/_simulation/SimulationTabs.tsx",
    "app/(app)/onboarding/_steps/BackgroundPhoto.tsx",
    "app/(app)/onboarding/_steps/ProfilePhoto.tsx",
    "app/(app)/onboarding/_steps/Checkout.tsx",
    "app/global-error.tsx",
  ],
  rules: {
    "no-restricted-syntax": ["warn",
      {
        selector: "JSXOpeningElement[name.name='button']",
        message: "Use <Button> or <IconButton>...",
      },
      // ... heading + color selectors
    ],
  },
}
```

## Problemas identificados

1. **File-level ignores**: arquivos inteiros excluidos — qualquer OUTRO raw button nesses arquivos passaria despercebido
2. **motion.button gap**: selector `[name.name='button']` so captura `<button>`, nao `<motion.button>` (JSXMemberExpression)
3. **components/motion/ exposto**: MagneticButton.tsx e SpotlightCard.tsx (primitives do DS) estao no scope da regra mas nao no ignores

## Estado posterior (apos Fase 22)

- File-level ignores REMOVIDOS
- Cada excecao agora usa `// eslint-disable-next-line no-restricted-syntax -- razao`
- Selector para `motion.button` ADICIONADO
- `components/motion/**` adicionado ao ignores (primitives do DS)
