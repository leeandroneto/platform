# 05 — Safe Area Handling

> **Canon source:** W3C CSS Env() · MDN · web.dev · Apple Safari docs

## Canon

**MDN (`env()` CSS):**

> "The `safe-area-inset-*` values were originally provided by the iOS browser to allow developers to place their content in a safe area of the viewport, and not be obscured by device notches or rounded corners."

> "In devices that display notifications at the bottom of the screen, such as iOS, the `safe-area-inset-bottom` contains a value that leaves space for the notification to display."

**Apple Safari (`viewport-fit=cover`):**

> "To expand the website to the whole area including the notch, add `viewport-fit=cover` to your meta viewport tag. Then it's on you to account for any overlapping that normally would have been handled by the safe area."

## Specs

| Variable                      | Default value (no insets) | Typical iPhone notch value           |
| ----------------------------- | ------------------------- | ------------------------------------ |
| `env(safe-area-inset-top)`    | 0px                       | 44pt (notch) / 59pt (Dynamic Island) |
| `env(safe-area-inset-bottom)` | 0px                       | 34pt (home indicator)                |
| `env(safe-area-inset-left)`   | 0px                       | 0pt portrait / 44pt landscape        |
| `env(safe-area-inset-right)`  | 0px                       | 0pt portrait / 44pt landscape        |

**Viewport meta (obrigatório pra acessar insets):**

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

Sem `viewport-fit=cover`, o iOS aplica margens automáticas (white bars em notched devices). Com cover, **app inteiro vai até as bordas** mas você precisa orquestrar safe-area manualmente.

## PWA standalone considerations

| Cenário                                                     | Comportamento safe-area                                                                            |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Safari aba normal                                           | URL bar absorve top inset → top usually 0                                                          |
| **PWA standalone (Add to Home Screen)**                     | Status bar overlay sobre app; `env(safe-area-inset-top)` retorna 44/59pt — **deve ser respeitado** |
| `apple-mobile-web-app-status-bar-style="black-translucent"` | Conteúdo passa por baixo da status bar (preta translúcida); padding-top safe-area é obrigatório    |
| Landscape (notched)                                         | `safe-area-inset-left/right` viram 44pt — conteúdo deve respeitar                                  |

## Implicação desafit

**Regras universais no PWA aluno:**

1. **Meta viewport** (em `app/layout.tsx` ou `head`):

   ```html
   <meta
     name="viewport"
     content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no"
   />
   ```

2. **Top bar / status bar absorption:**

   ```css
   padding-top: env(safe-area-inset-top);
   ```

3. **Bottom nav home indicator clearance:**

   ```css
   /* duas opções equivalentes */
   padding-bottom: env(safe-area-inset-bottom);
   /* OU adicionar à altura */
   height: calc(64px + env(safe-area-inset-bottom));
   padding-bottom: env(safe-area-inset-bottom);
   ```

4. **Bottom sheets:**

   ```css
   padding-bottom: env(safe-area-inset-bottom);
   /* drag handle e content nunca embaixo do home indicator */
   ```

5. **FAB (se houver):**

   ```css
   bottom: calc(16px + env(safe-area-inset-bottom));
   /* ou se acima do bottom nav: 16+64+inset */
   ```

6. **Landscape side insets:**
   ```css
   /* container principal */
   padding-left: env(safe-area-inset-left);
   padding-right: env(safe-area-inset-right);
   ```

**Tailwind v4 helpers (registrar em `@theme`):**

```css
@theme {
  --spacing-safe-top: env(safe-area-inset-top);
  --spacing-safe-bottom: env(safe-area-inset-bottom);
  --spacing-safe-left: env(safe-area-inset-left);
  --spacing-safe-right: env(safe-area-inset-right);
}
/* uso: pt-safe-top, pb-safe-bottom, etc. */
```

## Casos comuns que QUEBRAM

| Problema                           | Causa                                           | Fix                              |
| ---------------------------------- | ----------------------------------------------- | -------------------------------- |
| Bottom nav atrás do home indicator | falta `pb-[env(safe-area-inset-bottom)]`        | Adicionar safe-area-inset-bottom |
| Top content escondido sob notch    | falta `viewport-fit=cover` OU falta padding-top | Meta tag + padding-top           |
| Sheet com botão "Save" cortado     | sheet `padding-bottom` ausente                  | sheet wrapper sempre incluir     |
| Landscape texto cortado nas bordas | falta safe-area-inset-left/right                | container raiz                   |
| `env()` retorna sempre 0           | falta `viewport-fit=cover` na meta              | adicionar ao layout root         |

## Layer B varia per archetype

| Atributo                                      | Varia?        | Notas                                                                 |
| --------------------------------------------- | ------------- | --------------------------------------------------------------------- |
| `viewport-fit=cover`                          | ❌ FIXO       | Obrigatório PWA aluno                                                 |
| Top/bottom/left/right inset application       | ❌ FIXO       | Compose canon                                                         |
| `apple-mobile-web-app-status-bar-style` valor | ⚠️ semi-fixed | `black-translucent` default; archetype pode opt-in `default` mas raro |
| **Background color sob a status bar**         | ✅ VARIA      | É o `--surface-base` do tenant                                        |
| **theme-color meta**                          | ✅ VARIA      | Herda `--surface-base` ou `--accent` per tenant                       |

## Fontes

- MDN `env()`: <https://developer.mozilla.org/en-US/docs/Web/CSS/env>
- web.dev safe area concept (replaced page): <https://web.dev/articles/safe-area>
- CSS-Tricks "The Notch and CSS": <https://css-tricks.com/the-notch-and-css/>
- PWA iOS appearance guide: <https://itnext.io/make-your-pwas-look-handsome-on-ios-fd8fdfcd5777>
