# Decisao por button

## PARTE A — Raw `<button>` (5 arquivos excluidos)

### 1. global-error.tsx (linha 66)

**Contexto:** Botao "Tentar novamente" no error boundary global do Next.js. Renderiza quando ate o root layout falhou.
**Analise:** `<Button>` importa de `components/ui/button.tsx` que depende de CVA, Radix Slot, cn(). Qualquer dessas dependencias pode estar no mesmo bundle que falhou. Raw `<button>` com inline styles e a unica opcao segura.
**Decisao:** [x] KEEP exception
**Razao:** "global-error.tsx e fallback de ultimo recurso do Next.js; <Button> introduz dependencias (CVA, Radix Slot) que podem falhar no mesmo erro que disparou o boundary. Raw <button> com inline styles e safe by design."

### 2. SimulationTabs.tsx (linha 58)

**Contexto:** Tab trigger dentro de nav pill. Usa classes Tailwind + inline styles condicionais. Recebe ref para walkthrough.
**Analise:** `<Button variant="ghost">` com className overrides funciona. Button adiciona focus-visible ring e disabled:opacity-50 que beneficiam UX. Height/padding/rounded overridden via className.
**Decisao:** [x] MIGRATE para `<Button variant="ghost">`
**Implementacao:** Substituir `<button>` por `<Button variant="ghost" className="h-auto min-h-0 ...">`. Manter ref, disabled, onClick, style.

### 3. ProfilePhoto.tsx (linha 70)

**Contexto:** Area clicavel que dispara file input para upload de foto de perfil. Layout: w-36, rounded-xl, border-dashed, aspect-ratio 3:4, contem Image preview ou placeholder.
**Analise:** `<Button>` tem height fixo (`h-9`), padding interno, e flex layout que conflitam com area de upload (aspect-ratio, posicao de imagem fill). Wrapper `asChild` nao ajuda — ainda injeta classes incompativeis. `<UploadButton>` componente dedicado seria over-engineering para 2 ocorrencias.
**Decisao:** [x] KEEP exception
**Razao:** "Upload area com aspect-ratio constraint (3:4), dashed border, e image preview via next/Image fill. Estruturalmente um dropzone, nao um action button — height/padding/layout de <Button> sao incompativeis."

### 4. BackgroundPhoto.tsx (linha 70)

**Contexto:** Identico ao ProfilePhoto, mas landscape 16:9.
**Analise:** Mesmo raciocinio do ProfilePhoto.
**Decisao:** [x] KEEP exception
**Razao:** "Upload area com aspect-ratio constraint (16:9), dashed border, e image preview via next/Image fill. Mesmo padrao do ProfilePhoto — dropzone, nao action button."

### 5. Checkout.tsx (linha 164)

**Contexto:** Selector de forma de pagamento (PIX / Cartao). 2 cards com icone + label. Usa `role="radio"`, `aria-checked`, dentro de `role="radiogroup"`.
**Analise:** Ja usa semantica de radio group manualmente. Radix `RadioGroupPrimitive.Item` renderiza como `<button>` com role/aria corretos automaticamente. Migracao para Radix adiciona keyboard navigation (arrow keys) e roving tabindex sem custo visual.
**Decisao:** [x] MIGRATE para `RadioGroupPrimitive.Root` + `RadioGroupPrimitive.Item`
**Implementacao:** Importar `RadioGroup as RadioGroupPrimitive` de `radix-ui`. Substituir `<div role="radiogroup">` por `<RadioGroupPrimitive.Root>`. Substituir `<button role="radio">` por `<RadioGroupPrimitive.Item>`. Remover `aria-checked` manual (Radix gerencia). Adicionar focus-visible ring classes.

---

## PARTE B — `motion.button` (17 arquivos)

### Padrao comum: selection interfaces + brand theming

A maioria dos `motion.button` segue o mesmo padrao:

- **Uso:** card/chip/pill de selecao (click seleciona opcao)
- **Animacao:** `whileTap={{ scale: 0.98 }}` ou spring
- **Theming:** CSS custom properties (`--brand-text`, `--brand-bg-subtle`, `--color-accent`)
- **Por que nao `<Button>`:** variant classes (bg-primary, etc.) conflitam com brand theming inline. `asChild` wrapper adiciona classes sem beneficio.

### 6. MagneticButton.tsx (linha 76) — components/motion/

**Decisao:** [x] KEEP — adicionado `components/motion/**` ao ignores
**Razao:** "Primitive do design system. Usa motion.button para spring physics (useMotionValue + useSpring). E um building block, nao um consumer."

### 7. SpotlightCard.tsx (linha 61) — components/motion/

**Decisao:** [x] KEEP — adicionado `components/motion/**` ao ignores
**Razao:** "Primitive do design system. Dynamic tag selection (motion.button / motion.div) baseado em prop `as`."

### 8. primitives.tsx (linhas 110, 255, 308) — form/lead/\_steps/

**Componentes:** OptionList, BigCard, PillGroup
**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "Selection interfaces publicas com brand theming (--brand-\*). Precisam de whileTap/spring animation. Layout (text-left, custom padding/border) incompativel com Button variants."

### 9. MultiSelect.tsx (linha 30) — form/audit/\_blocks/

**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "Multi-select chips com whileTap animation e brand theming. Padrao identico ao OptionList."

### 10. DiagnosticIntro.tsx (linha 78) — form/audit/

**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "CTA de inicio do diagnostico com brand theming (--brand-accent) e entry animation (initial/animate). Estilo fullwidth rounded-full incompativel com Button size system."

### 11-16. Onboarding selection steps (Audience, Focus, Modality, Nutrition, Personality, ServiceMode)

**Decisao:** [x] KEEP com eslint-disable inline (todos)
**Razao:** "Selection cards do onboarding com whileTap spring animation e layout custom (rounded-xl, custom padding, border condicional). Padrao identico ao OptionList."

### 17. PricingBridge.tsx (linha 127)

**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "CTA com brand theming e entry animation. Mesmo padrao do DiagnosticIntro."

### 18. TransitionChoice.tsx (linha 93)

**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "Link secundario com entry animation (opacity fade). Semanticamente e um botao de acao, mas usa motion.button apenas para initial/animate transition."

### 19. PlanSelector.tsx (linha 48)

**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "Plan selection cards com whileTap e layout custom (text-left, featured badges). Padrao identico aos selection cards do onboarding."

### 20. TemplateSection.tsx (linha 176)

**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "Template selection grid com whileInView entry animation e brand theming (--brand-\*). Custom hover via onMouseEnter/Leave style manipulation."

### 21. QuickLeadForm.tsx (linha 101)

**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "CTA submit do quick lead form com brand theming (--brand-accent/--brand-glow) e whileTap. Disabled state e spinner integrados."

### 22. PreviewFAB.tsx (linha 17)

**Decisao:** [x] KEEP com eslint-disable inline
**Razao:** "FAB com scale entry animation (initial: scale 0 → animate: scale 1). FloatingActionButton de components/ui/ nao suporta motion entry/exit."
