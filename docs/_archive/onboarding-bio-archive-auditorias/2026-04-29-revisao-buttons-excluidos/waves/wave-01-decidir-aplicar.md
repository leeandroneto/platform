# Wave 01 — Decidir e aplicar caso a caso

## Briefing

22 buttons auditados. 2 migracoes + 20 exceptions com razao nominada.

## Migracoes

### M1. SimulationTabs.tsx — `<button>` → `<Button variant="ghost">`

- Substituir import
- Trocar `<button>` por `<Button variant="ghost">`
- Override classes: `h-auto min-h-0 rounded-full` etc.
- Manter ref, disabled, onClick, style

### M2. Checkout.tsx — `<button role="radio">` → `RadioGroupPrimitive`

- Importar `RadioGroup as RadioGroupPrimitive` de `radix-ui`
- Substituir `<div role="radiogroup">` por `<RadioGroupPrimitive.Root>`
- Substituir `<button role="radio" aria-checked>` por `<RadioGroupPrimitive.Item>`
- Remover role/aria-checked manual
- Adicionar focus-visible ring classes

## Exceptions (20)

Cada uma recebe `// eslint-disable-next-line no-restricted-syntax -- {razao}` na linha antes do `<button>` ou `<motion.button>`.

## ESLint config changes

1. Adicionar selector: `JSXOpeningElement[name.type='JSXMemberExpression'][name.object.name='motion'][name.property.name='button']`
2. Remover 5 file-level ignores
3. Adicionar `components/motion/**` ao ignores

## Criterio de aceite

- [x] 22 buttons decididos com razao registrada
- [x] 2 migracoes implementadas (SimulationTabs → Button, Checkout → RadioGroupPrimitive)
- [x] 20 exceptions com `// eslint-disable-next-line` + razao NOMINADA
- [x] eslint.config atualizado (motion.button selector + components/motion/\*\* ignores + file-level ignores removidos)
- [x] `pnpm lint` — zero violacoes button/motion.button
- [x] `pnpm exec tsc --noEmit` — zero erros novos (1 pre-existente em CarrosselSlides.tsx)
