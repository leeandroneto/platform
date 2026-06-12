## Zona quarentenada `components/ui/*`

shadcn primitives vivem em `components/ui/*`. **Zona quarentenada:**

- **Canal único:** `npx shadcn add <name>` — NUNCA editar manualmente
- Light-first vestido tokens retake (`new-york` style)
- Tokens canonical CSS vars consumidos automaticamente

## Hook protege

`protect-eslint.sh` bloqueia Write/Edit em `components/ui/**` (exceto via post-shadcn-add.sh).

## Wrappers compostos

Quando precisa de wrapper customizado:

- NÃO editar `components/ui/<name>.tsx`
- Criar wrapper em `components/retake/app-<name>.tsx` ou `components/site/<name>.tsx`
- Wrapper **compõe** primitives, não duplica

```tsx
// components/retake/app-button.tsx (exemplo conceitual)
import { Button } from "@/components/ui/button";

export function AppButton({ variant, children, ...rest }) {
  return (
    <Button
      variant={variant}
      className="font-display uppercase tracking-tight"
      {...rest}
    >
      {children}
    </Button>
  );
}
```

**Passthrough proibido:** wrapper que só repassa props sem agregar valor = ESLint bloqueia.

## Componentes essenciais dia 1 (instalar via `npx shadcn add`)

```
button card input label form sheet dialog drawer dropdown-menu
sidebar separator badge avatar tabs sonner select textarea
checkbox radio-group switch tooltip popover command
```

## Componentes site público — `components/site/*`

Não vivem em `ui/`. Eles compõem primitives shadcn pra blocos do site (Hero/About/Plans/etc).

## Componentes atléticos retake — `components/retake/*`

Usam extensões opt-in (`--font-display`, `--radius-pill`, `--shadow-warm-*`). Aparecem em painel/admin/landings, NUNCA no site público do tenant.
