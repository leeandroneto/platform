# 06 — Touch Targets

> **Canon source:** Apple HIG · Layout · Material Design 3 · Accessibility · WCAG 2.5.5 / 2.5.8

## Canon

**Apple HIG (Layout):**

> "Provide a minimum tappable area of 44pt × 44pt for all controls."

**Material Design 3 (Accessibility):**

> "Material design recommends that target sizes are at least 48dp by 48dp."

> "The icon for the control does not have to be the full size, but can use padding to increase the visual space, all of which can be clicked or tapped."

**Material spacing canon:**

> "In most cases, touch targets should be separated by 8dp/16px of space."

**WCAG 2.5.8 (Level AA — Target Size Minimum):**

> "The size of the target for pointer inputs is at least 24×24 CSS pixels."

WCAG 2.5.5 (Level AAA) = 44×44 CSS px.

## Comparação canónica

| Standard                              | Min target             | Spacing                  |
| ------------------------------------- | ---------------------- | ------------------------ |
| Apple HIG                             | 44×44pt                | not specified explicitly |
| Material 3                            | 48×48dp                | 8dp between              |
| WCAG 2.5.8 AA                         | 24×24 CSS px           | exception-aware          |
| WCAG 2.5.5 AAA                        | 44×44 CSS px           | n/a                      |
| **Compromise pra cross-platform PWA** | **48×48 CSS px floor** | **8px between**          |

**Por que 48px universal:** satisfaz Material (igual), satisfaz Apple (excede 44pt em qualquer ratio ≥1), satisfaz WCAG AAA. Single floor, zero branching.

## Implicação desafit

**Regras universais:**

1. **Floor 48px** em qualquer elemento interativo (`button`, `a[href]`, `[role=button]`, `input`, `select`).
2. **Visual ≠ target.** Ícone 24×24 pode ter padding 12px → target 48×48.
3. **Spacing 8px** mínimo entre targets adjacentes (nav items, list rows, button groups).
4. **Tap highlight** (`-webkit-tap-highlight-color`) — desabilitar default azul, controlar via `:active` state.

```css
/* globals / app shell */
* {
  -webkit-tap-highlight-color: transparent; /* mata highlight nativo */
}
button,
a,
[role='button'],
[role='link'],
input,
select,
textarea {
  min-height: 48px; /* floor universal */
  min-width: 48px; /* exceto inline links em parágrafo */
}
/* inline text link exception — WCAG aware */
p a,
li a {
  min-height: auto;
  min-width: auto;
}
```

**Stacking density:** se vir `min-height: 32px` em qualquer componente do PWA aluno, é bug. Wrappers em `components/app-*.tsx` devem honrar 48 floor.

**Lc / APCA não relacionado** a target size, mas relacionado a hit-affordance perception — texto Lc≥75 num botão de 48px é mais "clicável" que texto Lc 50 no mesmo botão. Já governado por `.claude/rules/contrast.md`.

## Casos especiais

| Caso                     | Tratamento                                                           |
| ------------------------ | -------------------------------------------------------------------- |
| Bottom nav item          | 48×48 floor por item, label inclusa                                  |
| Chip / pill filter       | 32px altura visual + padding `py-2` → target 48px                    |
| Switch / toggle          | Visual 32px → wrapper 48×48 com `padding` invisível                  |
| Icon-only button         | 48×48 sólido, ícone 24 centrado                                      |
| Drag handle (sheet)      | Visual 36×4pt, wrapper invisível 48×16 pra arrastar                  |
| Inline link em parágrafo | Exception — não força 48 (quebra leitura). Subir spacing entre `<p>` |

## Layer B varia per archetype

| Atributo                                             | Varia?   | Notas                                             |
| ---------------------------------------------------- | -------- | ------------------------------------------------- |
| Floor 48px universal                                 | ❌ FIXO  | Não-negociável a11y                               |
| Spacing 8px mínimo entre targets                     | ❌ FIXO  |                                                   |
| `-webkit-tap-highlight-color: transparent`           | ❌ FIXO  | Default UX limpo                                  |
| **Visual size** (ícone 20/24/28px)                   | ✅ VARIA | Archetype escolhe; floor mantido via padding      |
| **`:active` state** (color flash vs scale vs ripple) | ✅ VARIA | Material = ripple, iOS = darken, custom permitido |
| **Border-radius** (button shape)                     | ✅ VARIA | Pill/rounded/sharp herda archetype                |
| **`prefers-reduced-motion`** active state            | ❌ FIXO  | Sempre instant em reduced-motion                  |

## Fontes

- Apple HIG Layout: <https://developer.apple.com/design/human-interface-guidelines/layout>
- Material 3 accessibility touch target: <https://m3.material.io/foundations/accessible-design/accessibility-basics/touch-targets>
- Material Web touch-target docs: <https://m2.material.io/develop/web/supporting/touch-target>
- WCAG 2.5.8 Target Size (Minimum): <https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html>
- LogRocket survey accessible touch sizes: <https://blog.logrocket.com/ux-design/all-accessible-touch-target-sizes/>
