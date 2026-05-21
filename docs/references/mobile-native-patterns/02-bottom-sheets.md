# 02 — Bottom Sheets

> **Canon source:** Apple HIG · Sheets · UISheetPresentationController · Material Design 3 · Bottom Sheets

## Canon

**Apple HIG (Sheets / UISheetPresentationController):**

> "Sheets resize according to their detents, which are particular heights at which a sheet naturally rests."

> "The `.medium` detent is for a sheet that occupies half the height of the screen, and `.large` is for a sheet at full height."

> "The drag indicator (grabber) will automatically show and hide based on number of supported detents. If you have only one detent, the drag indicator will be hidden."

**Material Design 3 (Bottom Sheets):**

> "Bottom sheets show secondary content anchored to the bottom of the screen. There are two types: standard and modal."

> "Modal bottom sheets are above a scrim while standard bottom sheets don't have a scrim."

> Standard sheets coexist with main content; modal sheets block main content with scrim and dismiss on outside-tap.

## Specs numéricas

| Spec                  | iOS Sheet                                      | Material 3 BottomSheet                    |
| --------------------- | ---------------------------------------------- | ----------------------------------------- |
| Snap points / detents | `.medium` (≈50%), `.large` (≈full)             | `Hidden`, `PartiallyExpanded`, `Expanded` |
| Drag handle (grabber) | 36×5pt, top-center, auto-show with >1 detent   | 32×4dp, default visible in modal          |
| Dismiss gesture       | Drag down past threshold (~25% velocity-aided) | Drag down, position threshold 25%         |
| Scrim opacity (modal) | iOS system default ~ #000 @ 30–40%             | `scrimColor` default #000 @ 32%           |
| Corner radius (top)   | iOS native ~10pt                               | 28dp top corners                          |
| Max width (tablet)    | iPad limita auto                               | 640dp recommended max width               |
| Velocity threshold    | ~1000 pt/s para dismiss                        | Fling-aware                               |

## Gesture mapping (ambos canons concordam)

- **Drag handle visible** → afford "draggable"
- **Drag down past 25% da altura** → dismiss
- **Velocity > ~1000 pt/s** → dismiss imediato mesmo se < threshold
- **Tap em scrim (modal)** → dismiss
- **Tap fora do sheet (standard)** → NÃO dismiss

## Implicação desafit

Bottom sheet é vocabulário **primário** pra ações secundárias do PWA aluno (filtros, comentário, share, exercício detail, opções). Construído sobre Radix Dialog + Vaul (já no stack) ou primitive próprio.

```tsx
// components/student/AppSheet.tsx (Layer A — fixo)
<Sheet snapPoints={[0.5, 0.95]} defaultSnap={0.5}>
  <SheetOverlay className="bg-black/30" /> {/* scrim 30% */}
  <SheetContent
    className="
    fixed inset-x-0 bottom-0 z-50
    rounded-t-2xl                                       /* 16px — varia per archetype */
    bg-[--surface-elevated]
    pb-[env(safe-area-inset-bottom)]                    /* safe-area canon */
    max-h-[95dvh]
  "
  >
    <div /* drag handle */
      className="mx-auto mt-2 h-1 w-9 rounded-full bg-[--border]"
      aria-hidden
    />
    {children}
  </SheetContent>
</Sheet>
```

**Detents fixos:** `0.5` (medium) e `0.95` (large/full — não 1.0 pra preservar status bar). Velocity dismiss + 25% drag threshold.

## Modal vs sheet vs popover rules (cross-canon)

| Padrão                          | Quando                                                              |
| ------------------------------- | ------------------------------------------------------------------- |
| **Bottom sheet (modal)**        | Ação secundária com input/scroll significativo (>3 linhas conteúdo) |
| **Bottom sheet (standard)**     | Persistente, conteúdo coexiste (mapa + lista) — raro em PWA aluno   |
| **Modal centralizado (Dialog)** | Confirmação destrutiva (delete account), 1–2 botões, sem scroll     |
| **Popover/Menu**                | Ação contextual ancorada a trigger (overflow menu, dropdown)        |
| **Toast**                       | Feedback transitório, no dismiss explícito                          |

## Layer B varia per archetype

| Atributo                                       | Varia?    | Notas                                               |
| ---------------------------------------------- | --------- | --------------------------------------------------- |
| Snap points (0.5 / 0.95)                       | ❌ FIXO   | Quebra musclememory                                 |
| Drag handle presença                           | ❌ FIXO   | Afford crítico                                      |
| Drag-down-to-dismiss + threshold               | ❌ FIXO   | Mapping gesture canon                               |
| Scrim opacity (30%)                            | ❌ FIXO   | A11y contrast + brand-agnostic                      |
| Position bottom + safe-area                    | ❌ FIXO   |                                                     |
| **Background color**                           | ✅ VARIA  | `--surface-elevated` herda archetype                |
| **Top corner radius** (8/16/24/32px)           | ✅ VARIA  | Brutalist = 0, Editorial = 8, Premium = 24+         |
| **Drag handle color**                          | ✅ VARIA  | Pode ser quase invisível em archetypes minimalistas |
| **Motion timing** (entry duration)             | ✅ VARIA  | 300ms standard, archetype premium pode 450ms        |
| **Frost glass background** (`backdrop-filter`) | ✅ OPT-IN | Apple-canon archetypes opt-in; Brutalist NÃO        |

## Fontes

- Apple HIG Sheets (`UISheetPresentationController`): <https://developer.apple.com/design/human-interface-guidelines/sheets>
- WWDC21 — Customize and resize sheets in UIKit: <https://developer.apple.com/videos/play/wwdc2021/10063/>
- Material 3 Bottom Sheets: <https://m3.material.io/components/bottom-sheets/specs>
- SwiftUI bottom sheet detents reference: <https://sarunw.com/posts/swiftui-bottom-sheet/>
