# 07 — Gestures Canon

> **Canon source:** Apple HIG · Gestures · Material Design · Gestures · MDN · overscroll-behavior · web.dev gesture handling

## Canon

**Material Design (Gestures):**

> "The speed at which a gesture is performed is the primary distinction between drag, swipe, and fling. Gesture velocity impacts whether the action is immediately reversible. A swipe becomes a fling based on ending velocity and whether the affected element has crossed a threshold."

> "A dismiss gesture originates on a swipeable element, such as a list item or card, orthogonal to the direction of scrolling. The gesture is typically horizontal and is committed based on crossing a threshold."

**Apple HIG (Gestures):** taxonomia mínima — tap, double-tap, long-press, swipe, drag, flick, pinch, rotate. Pull-to-refresh é prática estabelecida desde iOS 6 (Mail).

## Catálogo canónico

### 1. Swipe to dismiss

| Spec               | Canon                                                                          |
| ------------------ | ------------------------------------------------------------------------------ |
| Direção            | Horizontal (cards/rows) ou vertical-down (sheets/modals)                       |
| Position threshold | **25%** Material; ~33% iOS prática                                             |
| Velocity threshold | **~1000 px/s** dispara dismiss mesmo abaixo de position threshold              |
| Visual affordance  | Background action revelado durante drag (delete vermelho, archive cinza, etc.) |
| Snap-back          | Se < threshold no release → spring back ao 0                                   |

### 2. Pull-to-refresh

| Spec                     | Canon                                                                      |
| ------------------------ | -------------------------------------------------------------------------- |
| Trigger                  | Scroll past top (scrollTop = 0) + drag down > **~64px**                    |
| Affordance               | Spinner aparece ao começar drag; commit visual em ~80–100px                |
| Native?                  | iOS Safari: pull-to-refresh nativo recarrega a página inteira (não custom) |
| Custom em PWA standalone | Implementar via touch events ou IntersectionObserver no top                |
| Suppress nativo          | `overscroll-behavior-y: contain` no scroll container                       |

### 3. Scroll momentum + rubber-band

> "In iOS Safari, you're allowed to scroll beyond the top or bottom edge of the viewport by a few hundred pixels, and letting go snaps the page back in place." (rubber-band)

> "The `-webkit-overflow-scrolling: touch` CSS property enables 'momentum' (smooth) scrolling on iOS." (legacy; modern iOS faz automático em scroll containers)

> "With `overscroll-behavior: none`, you won't get that Android overscroll glow or iOS rubber-banding effect."

### 4. Long-press context menu

| Platform         | Duração canónica        | Affordance                                         |
| ---------------- | ----------------------- | -------------------------------------------------- |
| iOS              | 500ms                   | Haptic feedback + zoom-out + context menu          |
| Android Material | 500ms                   | Ripple expanding + action sheet                    |
| Web (default)    | 500–700ms varia browser | Não nativo — implementar via `pointerdown` + timer |

### 5. Pinch to zoom

- iOS/Android: nativo em `<img>`, mapas, conteúdo zoomable
- PWA: respeitar `user-scalable=yes` no viewport pra acessibilidade (ou opt-in `no` se app não-textual; desafit aluno = NÃO desabilitar pra a11y, exceto telas específicas)

### 6. Drag and drop mobile

- HTML5 native drag-and-drop **não funciona mobile** consistently
- Usar `pointer events` + libs (Framer Motion `dragControls`, dnd-kit) pra reorder
- Pra PWA aluno provavelmente NÃO necessário em MVP

## Specs numéricas consolidadas

| Gesto                    | Threshold position | Threshold velocity | Duração           |
| ------------------------ | ------------------ | ------------------ | ----------------- |
| Swipe dismiss (Material) | 25%                | ~1000 px/s         | —                 |
| Sheet dismiss drag       | 25%                | ~1000 px/s         | —                 |
| Long-press               | —                  | —                  | 500ms             |
| Tap (vs long-press)      | <10px movement     | —                  | <500ms            |
| Pull-to-refresh trigger  | ~64–80px drag      | —                  | —                 |
| Double-tap               | —                  | —                  | <300ms entre taps |

## Implicação desafit

**Adotados (Layer A fixo):**

1. **Swipe-down dismiss em sheets** — herda do Sheet primitive (Vaul ou custom); threshold 25% + velocity 1000 px/s
2. **Scroll momentum natural** — não tocar; nunca aplicar `overscroll-behavior: none` global
3. **`overscroll-behavior-y: contain`** SÓ em sheets/modais pra impedir scroll do bg
4. **Long-press desabilitado em chrome** — `user-select: none` em botões/nav; conteúdo (texto) preserva long-press selection

**Suprimidos:**

- Pull-to-refresh nativo iOS (recarrega página) → indesejado em PWA standalone. Fix: `overscroll-behavior-y: contain` no `<main>`.
- Custom pull-to-refresh → adiar pra MVP+1; usar refresh button explícito no top bar inicialmente.

```css
/* globals */
main.app-shell-content {
  overscroll-behavior-y: contain; /* mata rubber-band + pull-refresh nativo */
  -webkit-tap-highlight-color: transparent;
}
.sheet-content {
  overscroll-behavior: contain; /* sheet scroll não vaza pro body */
  touch-action: pan-y; /* permite drag vertical de dismiss + scroll */
}
button,
[role='button'] {
  user-select: none;
  touch-action: manipulation; /* mata 300ms tap delay legacy */
}
```

## Layer B varia per archetype

| Atributo                                   | Varia?   | Notas                                               |
| ------------------------------------------ | -------- | --------------------------------------------------- |
| Swipe dismiss threshold (25%)              | ❌ FIXO  | Material canon                                      |
| Velocity threshold (~1000 px/s)            | ❌ FIXO  |                                                     |
| Pull-to-refresh suppressed                 | ❌ FIXO  | Custom opt-in futuro                                |
| `touch-action: manipulation` em buttons    | ❌ FIXO  | Mata 300ms delay                                    |
| `overscroll-behavior-y: contain` em sheets | ❌ FIXO  |                                                     |
| **Active feedback duration**               | ✅ VARIA | Material ripple longer (~300ms), iOS instant darken |
| **Background reveal color** (swipe delete) | ✅ VARIA | Semântico (destructive) per archetype tone          |
| **Long-press custom menu styling**         | ✅ VARIA | Se implementado                                     |

## Fontes

- Material Design Gestures: <https://material.io/archive/guidelines/patterns/gestures.html>
- Material Design v2 interaction gestures: <https://m2.material.io/design/interaction/gestures/>
- MDN overscroll-behavior: <https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior>
- Chrome dev — Take control of your scroll: <https://developer.chrome.com/blog/overscroll-behavior/>
- iOS DragGesture swipe dismiss reference: <https://rudrank.com/exploring-swiftui-draggesture-fullscreencover>
