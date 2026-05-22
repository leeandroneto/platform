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
  - `components/admin/theme-studio/hsl-controls.tsx` (adapted from `components/editor/hsl-adjustment-controls.tsx` — Zustand → useThemeFormContext; i18n; debounce via lib/utils/debounce.ts)
  - `components/admin/theme-studio/colors-tab-content.tsx` (adapted from `components/editor/colors-tab-content.tsx` — Zustand → props; TooltipWrapper → shadcn Tooltip inline; i18n)
  - `components/admin/theme-studio/ai-tab-content.tsx` (custom stub — Fase 6 deferred; no TweakCN equivalent yet)
  - `components/admin/theme-studio/tabs-trigger-pill.tsx` (copied from `components/editor/theme-preview/tabs-trigger-pill.tsx`)
  - `components/admin/theme-studio/horizontal-scroll-area.tsx` (copied from `components/horizontal-scroll-area.tsx` — import path adjusted to lib/hooks)
  - `components/admin/theme-studio/control-panel.tsx` (adapted from `components/editor/theme-control-panel.tsx` — Zustand → useThemeFormContext; FontPicker/ThemePresetSelect stubbed deferred Chunk 6; aiEnabled prop; i18n)
  - `components/admin/theme-studio/preview-panel.tsx` (adapted from `components/editor/theme-preview-panel.tsx` — Zustand → useThemeFormContext; sub-components stubbed deferred Chunk 6; v0/ShadcnBlocks branding removed; i18n)
  - `app/admin/theme-studio/view.tsx` (adapted from `components/editor/editor.tsx` — Zustand → ThemeFormProvider; themePromise → initialTheme prop; ActionBar deferred Chunk 7; i18n)
  - `components/admin/theme-studio/code-panel.tsx` (adapted from `components/editor/code-panel.tsx` — usePreferencesStore→useState+localStorage; v0 tab removed ADR-0045 D.1; PostHog removed; i18n; registry URL placeholder Chunk 7)
  - `components/admin/theme-studio/code-panel-dialog.tsx` (adapted from `components/editor/code-panel-dialog.tsx` — ResponsiveDialog→Dialog shadcn canonical)
  - `components/admin/theme-studio/font-picker.tsx` (adapted from `components/editor/font-picker.tsx` — Zustand→context; endpoint /api/admin/theme-studio/google-fonts; nuqs mantido; i18n)
  - `components/admin/theme-studio/theme-font-select.tsx` (copied from `components/editor/theme-font-select.tsx`)
  - `lib/hooks/use-font-search.ts` (extracted helper for font-picker search — internal)
  - `app/api/admin/theme-studio/google-fonts/route.ts` (copied from `app/api/google-fonts/route.ts` — env var direto sem lib/env.ts JIT; entitlement gate deferred Chunk 7)
  - `components/admin/theme-studio/preset-select.tsx` (adapted from `components/editor/theme-preset-select.tsx` — useThemePresetStore Zustand→lib/design/presets/theme-presets; useEditorStore→useThemeFormContext; PostHog removed; i18n)
  - `components/admin/theme-studio/theme-preview/color-preview.tsx` (copied from `components/editor/theme-preview/color-preview.tsx`)
  - `components/admin/theme-studio/theme-preview/components-showcase.tsx` (copied from `components/editor/theme-preview/components-showcase.tsx`)
  - `components/admin/theme-studio/theme-preview/examples-preview-container.tsx` (copied from `components/editor/theme-preview/examples-preview-container.tsx`)
  - `app/api/r/themes/[tenantId]/[version]/route.ts` (adapted from `app/r/themes/[id]/route.ts` — multi-tenant + RLS; force-static→dynamic; single `id` param → `tenantId`+`version` params; built-in preset lookup → `getTenantThemeWithVersion` DB helper; cache tag Next 16)
  - `lib/design/contrast.ts` (modified — added `validateThemeAPCA` wrapper, `ApcaValidationFailure`, `ApcaValidationResult`, `APCA_CHECK_PAIRS` per ADR-0045 D.17 soft-warn gate)

## VoltAgent awesome-design-md (CC0)

- Origin: https://github.com/VoltAgent/awesome-design-md
- Status: cloned but currently NOT in active use (post-pivot 2026-05-21).
- License: CC0 (no attribution required, kept for educational reference).
