# NOTICE

This project includes code adapted from third-party open source projects.
Each adapted file documents its origin in a top comment.

## TweakCN (Apache-2.0)

- Origin: https://github.com/jnsahaj/tweakcn
- Commit base: 9adabcf9
- License: Apache-2.0 (`tweakcn-ref/LICENSE`)
- Adapted in:
  - `lib/design/color-format.ts` (from `utils/color-converter.ts`)
  - `lib/design/build-theme-css.ts` (shadow algorithm from `utils/shadows.ts`)
  - `lib/design/contract/theme.ts` (Zod schema adapted from `types/theme.ts` — ThemePreset, ThemeEditorPreviewProps, ThemeEditorControlsProps, ThemeStylesSchemaWithoutSpacing added Step 1.6)
  - `lib/design/contract/fonts.ts` (copied from `types/fonts.ts` — FontCategory, GoogleFont, FontInfo, PaginatedFontsResponse)
  - `lib/design/contract/index.ts` (copied from `types/index.ts` — ColorFormat, SliderInputProps, ColorPickerProps, ToggleOptionProps, etc; FocusColorId removed)
  - `lib/design/contract/live-preview.ts` (copied from `types/live-preview-embed.ts` — MESSAGE constants, EmbedMessage, IframeStatus; ThemeEditorState → our Theme type)
  - `lib/design/theme-defaults.ts` (defaults from `config/theme.ts`)
  - `lib/design/apply-style.ts` (copied from `utils/apply-style-to-element.ts`)
  - `lib/design/apply-theme.ts` (copied from `utils/apply-theme.ts` — ADAPT: comentário sobre `<style precedence="theme">`)
  - `lib/design/theme-style-generator.ts` (copied from `utils/theme-style-generator.ts` — generateThemeCode/generateTailwindConfigCode/generateLayoutCode)
  - `lib/design/theme-styles.ts` (copied from `utils/theme-styles.ts` — mergeThemeStylesWithDefaults)
  - `lib/design/parse-css-input.ts` (copied from `utils/parse-css-input.ts` — parseCssInput)
  - `lib/design/tailwind-colors.ts` (copied from `utils/registry/tailwind-colors.ts` — TAILWIND_PALETTE + TAILWIND_SHADES)
  - `lib/utils/debounce.ts` (copied from `utils/debounce.ts` — debounce with cancel)
  - `lib/utils/format.ts` (copied from `utils/format.ts` — formatCompactNumber)
  - `lib/hooks/use-controls-tab-from-url.ts` (copied from `hooks/use-controls-tab-from-url.ts`)
  - `lib/hooks/use-debounced-callback.ts` (copied from `hooks/use-debounced-callback.ts`)
  - `lib/hooks/use-feedback-text.ts` (copied from `hooks/use-feedback-text.ts`)
  - `lib/hooks/use-scroll-start-end.ts` (copied from `hooks/use-scroll-start-end.ts`)
  - `lib/hooks/use-document-drag-and-drop-intent.ts` (copied from `hooks/use-document-drag-and-drop-intent.ts`)
  - `lib/hooks/use-copy-to-clipboard.ts` (adapted from `hooks/use-copy-to-clipboard.ts` — useToast legacy → sonner, ADR-0040 §E)
  - `lib/hooks/use-fullscreen.ts` (copied from `hooks/use-fullscreen.ts`)
  - `lib/hooks/use-iframe-theme-injector.ts` (adapted from `hooks/use-iframe-theme-injector.ts` — Zustand store → arg de função, ADR-0040 §C)
  - `lib/hooks/use-contrast-checker.ts` (adapted from `hooks/use-contrast-checker.ts` — WCAG luminance → APCA Silver dual-gate, ADR-0040 §H)
  - `lib/hooks/use-theme-preset-from-url.ts` (adapted from `hooks/use-theme-preset-from-url.ts` — Zustand setter → callback arg)
  - `app/admin/theme-studio/_state/theme-history-reducer.ts` (adapted from `store/editor-store.ts` — Zustand history/undo/redo/checkpoint → useReducer pure; ADR-0040 §C)
  - `app/admin/theme-studio/_state/use-theme-form.ts` (adapted from `store/editor-store.ts` — Zustand global store → RHF + useReducer + useDebouncedCallback composto; ADR-0040 §C)
  - `app/admin/theme-studio/_state/theme-form-provider.tsx` (custom — provider + useImperativeHandle pra distribuir ThemeFormApi sem prop drilling; pattern interno, não TweakCN)
  - `components/admin/theme-studio/color-picker.tsx` (adapted from `components/editor/color-picker.tsx`)
  - `components/admin/theme-studio/color-selector-popover.tsx` (adapted from `components/editor/color-selector-popover.tsx`)
  - `components/admin/theme-studio/slider-with-input.tsx` (adapted from `components/editor/slider-with-input.tsx`)
  - `components/admin/theme-studio/shadow-control.tsx` (adapted from `components/editor/shadow-control.tsx`)
  - `components/admin/theme-studio/hsl-preset-button.tsx` (adapted from `components/editor/hsl-preset-button.tsx`)
  - `components/admin/theme-studio/control-section.tsx` (adapted from `components/editor/control-section.tsx`)
  - `components/admin/theme-studio/section-context.tsx` (adapted from `components/editor/section-context.tsx`)
  - `components/admin/theme-studio/contrast-checker.tsx` (adapted from `components/editor/contrast-checker.tsx` — WCAG luminance/contrast → APCA Silver dual-gate; thresholds body Lc≥75/large ≥60/non-text ≥45; ADR-0040 §H + research-32)
  - `components/admin/theme-studio/contrast-checker-pairs.ts` (extracted from `contrast-checker.tsx` — PAIR_SEEDS data file; max-lines compliance)

## VoltAgent awesome-design-md (CC0)

- Origin: https://github.com/VoltAgent/awesome-design-md
- Status: cloned but currently NOT in active use (post-pivot 2026-05-21).
- License: CC0 (no attribution required, kept for educational reference).
