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

## VoltAgent awesome-design-md (CC0)

- Origin: https://github.com/VoltAgent/awesome-design-md
- Status: cloned but currently NOT in active use (post-pivot 2026-05-21).
- License: CC0 (no attribution required, kept for educational reference).
