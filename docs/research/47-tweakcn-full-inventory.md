# 47 — TweakCN inventory completo (copy-literal plan)

> **Tipo:** pesquisa autoritativa
> **Data:** 2026-05-22
> **Owner:** main thread (despachado Sonnet)
> **Pré-leituras:** research-41 (editor/AI/registry coberto lá), research-46 (style new-york confirmado), CLAUDE.md
> **Clone auditado:** `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, Apache-2.0)
> **Output:** inventário arquivo-por-arquivo + ação cravada
> **Princípio:** copy literal first → adapt JIT (memória feedback_copy_literal_first.md)
> **Escopo:** tudo que research-41 NÃO cobre (components/ui, hooks, types, utils completo, db/schema, app/\*, configs)

---

## 1. Sumário executivo

**Total de arquivos auditados neste research:** ~95 (excluindo editor/ e ai/ já cobertos em research-41).

**Decisões por categoria:**

- `components/ui/*`: TweakCN tem **49 arquivos** (48 `.tsx` + 1 `.ts`). Nossos 21 instalados. **28 PRIMITIVE-ADD** prioritários. 1 PRIMITIVE-SUBSTITUTE (button — tem variant `accent` que nós não temos). 20 PRIMITIVE-OK (match quase idêntico). 8 PRIMITIVE-SKIP/DEFER.
- `hooks/*`: 33 arquivos. **7 HOOKS-COPY**, **4 HOOKS-ADAPT**, **22 HOOKS-SKIP/DEFER**.
- `types/*`: 9 arquivos. **3 TYPES-MERGE** cravados (theme.ts já portado, fonts.ts a portar, index.ts conceitos úteis).
- `utils/*`: 26 arquivos. **2 já feitos** (shadows.ts, color-converter.ts). **6 UTILS-EXTRACT** novos. **3 UTILS-ADAPT**. Resto SKIP.
- `config/theme.ts`: UTILS-EXTRACT + já parcialmente portado.
- `lib/*` (além de ai/): **2 UTILS-EXTRACT** (utils.ts, constants.ts parcial). Resto SKIP (auth, polar, OAuth, posthog).
- `db/schema.ts`: DB-INSPIRATION (não copy).
- `app/api/*`: 1 ROUTE-COPY (google-fonts), resto SKIP.
- `app/*` outros: tudo SKIP ou já catalogado em research-41.
- Configs: 1 CONFIG-INSPIRATION (eslint.config.mjs regras TS), resto SKIP.

**Bloqueadores zero.** Todos os arquivos prioritários têm stack compatível (nuqs, culori, debounce vanilla, culori/radix via shadcn). Únicas deps extras necessárias: `screenfull` (1 hook), `@tanstack/react-query` (1 hook — DEFER), `@ngard/tiny-isequal` (util pequeno).

---

## 2. components/ui/\* (primitives diff vs nosso)

TweakCN: `new-york` style confirmado (research-46). `components.json` usa `new-york`, `baseColor: neutral`, `cssVariables: true`. Mesmo setup que o nosso.

**Nossos 21 instalados:** badge, button, card, command, dialog, dropdown-menu, form, input, label, popover, scroll-area, select, separator, sheet, skeleton, sonner, switch, tabs, textarea, tooltip + `button.stories.tsx`.

### 2.1 PRIMITIVE-SUBSTITUTE (diff crítico)

| Arquivo TweakCN | LOC | Diff vs nosso                                                                                                                                                                 | Decisão                                                                               | Ação                                                                                                       |
| --------------- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `button.tsx`    | 65  | TweakCN tem variant `accent: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/80"` que nosso não tem. Também `has-[>svg]:px-3` substituído por `shrink-0` no base. | **SUBSTITUTE** — sobrescrever nosso com versão TweakCN que já inclui variant `accent` | `pnpm dlx shadcn@latest add button --overwrite` — depois adicionar variant accent manualmente (único diff) |

**Nota:** diferença é mínima (1 variant). Nossas `has-[>svg]:px-3` classes no size são equivalentes às dele. Substituição via `--overwrite` + add variant `accent` no CVA.

### 2.2 PRIMITIVE-ADD (TweakCN tem, nós não temos — instalar)

Ordem prioridade: usados no editor TweakCN primeiro.

| #   | Arquivo TweakCN                              | LOC      | Dep extra                | Usado em editor         | Decisão                                                                                      |
| --- | -------------------------------------------- | -------- | ------------------------ | ----------------------- | -------------------------------------------------------------------------------------------- |
| 1   | `slider.tsx`                                 | 64       | radix-ui/slider          | sim (SliderWithInput)   | **PRIMITIVE-ADD** — `pnpm dlx shadcn@latest add slider`                                      |
| 2   | `accordion.tsx`                              | 56       | radix-ui/accordion       | potencial               | **PRIMITIVE-ADD**                                                                            |
| 3   | `alert.tsx`                                  | 59       | nenhuma                  | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 4   | `alert-dialog.tsx`                           | 140      | radix-ui/alert-dialog    | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 5   | `avatar.tsx`                                 | 50       | radix-ui/avatar          | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 6   | `breadcrumb.tsx`                             | 115      | nenhuma                  | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 7   | `calendar.tsx`                               | 64       | react-day-picker         | nenhuma                 | **DEFER** (dep ~45KB — JIT exception)                                                        |
| 8   | `carousel.tsx`                               | 260      | embla-carousel           | nenhuma                 | **DEFER** (dep ~25KB)                                                                        |
| 9   | `chart.tsx`                                  | 370      | recharts                 | sim (dashboard preview) | **DEFER** (dep ~250KB — JIT exception)                                                       |
| 10  | `checkbox.tsx`                               | 36       | radix-ui/checkbox        | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 11  | `collapsible.tsx`                            | 34       | radix-ui/collapsible     | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 12  | `context-menu.tsx`                           | 200      | radix-ui/context-menu    | nenhuma                 | **PRIMITIVE-SKIP** (não previsto em MVPs 1-3)                                                |
| 13  | `drawer.tsx`                                 | 140      | vaul                     | nenhuma                 | **PRIMITIVE-ADD** (vaul já no stack)                                                         |
| 14  | `hover-card.tsx`                             | 42       | radix-ui/hover-card      | nenhuma                 | **PRIMITIVE-SKIP** (JIT)                                                                     |
| 15  | `input-otp.tsx`                              | 74       | input-otp                | nenhuma                 | **PRIMITIVE-SKIP** (JIT — só auth OTP)                                                       |
| 16  | `menubar.tsx`                                | 244      | radix-ui/menubar         | nenhuma                 | **PRIMITIVE-SKIP** (JIT)                                                                     |
| 17  | `navigation-menu.tsx`                        | 192      | radix-ui/navigation-menu | nenhuma                 | **PRIMITIVE-SKIP** (JIT)                                                                     |
| 18  | `pagination.tsx`                             | 120      | nenhuma                  | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 19  | `progress.tsx`                               | 36       | radix-ui/progress        | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 20  | `radio-group.tsx`                            | 44       | radix-ui/radio-group     | sim (form engine)       | **PRIMITIVE-ADD**                                                                            |
| 21  | `resizable.tsx`                              | 54       | react-resizable-panels   | sim (editor layout)     | **PRIMITIVE-ADD** — usado em editor.tsx ResizablePanelGroup                                  |
| 22  | `revola.tsx`                                 | ~40      | revola                   | nenhuma                 | **PRIMITIVE-SKIP** (lib custom TweakCN — não shadcn oficial)                                 |
| 23  | `table.tsx`                                  | 120      | nenhuma                  | nenhuma                 | **PRIMITIVE-ADD**                                                                            |
| 24  | `toast.tsx` + `toaster.tsx` + `use-toast.ts` | 30+30+80 | nenhuma                  | nenhuma                 | **PRIMITIVE-SKIP** — nós já temos `sonner` (mais moderno). Toast é legacy shadcn pré-sonner. |
| 25  | `toggle.tsx` + `toggle-group.tsx`            | 40+56    | radix-ui/toggle          | nenhuma                 | **PRIMITIVE-ADD** (toggle + toggle-group batch)                                              |
| 26  | `sidebar.tsx`                                | ~600     | nenhuma                  | nenhuma                 | **PRIMITIVE-ADD** — bloco sidebar shadcn canônico; usado em dashboard preview TweakCN        |
| 27  | `base-ui-tabs.tsx`                           | ~60      | @base-ui/react           | nenhuma                 | **PRIMITIVE-SKIP** — experimento TweakCN, não shadcn oficial                                 |
| 28  | `aspect-ratio.tsx`                           | 10       | radix-ui/aspect-ratio    | nenhuma                 | **PRIMITIVE-ADD**                                                                            |

**Resumo PRIMITIVE-ADD prioritários (instalar no Step 1):**
`slider` (bloqueante pra editor), `accordion`, `alert`, `alert-dialog`, `avatar`, `breadcrumb`, `checkbox`, `collapsible`, `drawer`, `pagination`, `progress`, `radio-group`, `resizable`, `table`, `toggle`, `toggle-group`, `sidebar`, `aspect-ratio`.

**Comando batch (exceto sidebar — separado pra não conflitar):**

```bash
pnpm dlx shadcn@latest add slider accordion alert alert-dialog avatar breadcrumb checkbox collapsible drawer pagination progress radio-group resizable table toggle toggle-group aspect-ratio
pnpm dlx shadcn@latest add sidebar
```

### 2.3 PRIMITIVE-OK (nossos já instalados, match substancial)

badge, card, command, dialog, dropdown-menu, form, input, label, popover, scroll-area, select, separator, sheet, skeleton, sonner, switch, tabs, textarea, tooltip.

Todos instalados via `pnpm dlx shadcn@latest add` (canal canônico) — já são versão `new-york`. Não precisam substituição, a menos que uma feature específica necessite variant extra.

---

## 3. hooks/\*

TweakCN: **33 hooks** total (incluindo subpastas `inspector/` e `themes/`).

| Arquivo TweakCN                           | LOC | Deps                                             | Decisão         | Destino nosso                                | Notas                                                                                                            |
| ----------------------------------------- | --- | ------------------------------------------------ | --------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `use-controls-tab-from-url.ts`            | 33  | nuqs                                             | **HOOKS-COPY**  | `hooks/use-controls-tab-from-url.ts`         | nuqs já no stack. Copy literal. Remove menção a `"ai"` tab (DEFER Fase 6)                                        |
| `use-copy-to-clipboard.ts`                | 47  | `use-toast` (nós temos sonner)                   | **HOOKS-ADAPT** | `hooks/use-copy-to-clipboard.ts`             | Trocar `toast({ title, description })` por `toast.success()` da sonner                                           |
| `use-debounced-callback.ts`               | 41  | nenhuma                                          | **HOOKS-COPY**  | `hooks/use-debounced-callback.ts`            | Puro React. Copy literal.                                                                                        |
| `use-feedback-text.ts`                    | 42  | nenhuma                                          | **HOOKS-COPY**  | `hooks/use-feedback-text.ts`                 | Puro React. Usada em AI loading states. Copy literal.                                                            |
| `use-font-search.ts`                      | 48  | `@tanstack/react-query`                          | **HOOKS-DEFER** | —                                            | TanStack Query não é nosso stack. DEFER: reescrever com SWR ou fetch + useState quando editor font picker entrar |
| `use-fullscreen.ts`                       | 30  | `screenfull` npm                                 | **HOOKS-ADAPT** | `hooks/use-fullscreen.ts`                    | Instalar `screenfull` + copy. Pequeno (~1KB).                                                                    |
| `use-scroll-start-end.ts`                 | 79  | nenhuma                                          | **HOOKS-COPY**  | `hooks/use-scroll-start-end.ts`              | IntersectionObserver puro. Copy literal. Útil em font picker scroll virtualization.                              |
| `use-iframe-theme-injector.ts`            | 175 | Zustand (`useEditorStore`)                       | **HOOKS-ADAPT** | `hooks/use-iframe-theme-injector.ts`         | Remover `useEditorStore` → receber `themeState` via prop. Resto copy.                                            |
| `use-contrast-checker.ts`                 | 56  | `utils/contrast-checker.ts`, `utils/debounce.ts` | **HOOKS-ADAPT** | `hooks/use-contrast-checker.ts`              | Adaptar pra usar APCA (nós temos `lib/design/contrast.ts`) em vez de WCAG. Estrutura geral copy.                 |
| `use-debounced-callback.ts`               | 41  | nenhuma                                          | ver acima       | —                                            | —                                                                                                                |
| `use-document-drag-and-drop-intent.ts`    | 35  | nenhuma                                          | **HOOKS-COPY**  | `hooks/use-document-drag-and-drop-intent.ts` | Puro DOM events. Usado em drag-and-drop image uploader (AI).                                                     |
| `use-image-upload-reducer.ts`             | ~40 | nenhuma                                          | **HOOKS-DEFER** | —                                            | Acoplado ao AI image upload (Fase 6)                                                                             |
| `use-image-upload.ts`                     | ~80 | AI utils                                         | **HOOKS-DEFER** | —                                            | Acoplado ao AI image upload (Fase 6)                                                                             |
| `use-ai-chat-form.ts`                     | ~60 | TanStack Query + AI SDK                          | **HOOKS-DEFER** | —                                            | AI Fase 6                                                                                                        |
| `use-ai-enhance-prompt.ts`                | ~50 | AI SDK                                           | **HOOKS-DEFER** | —                                            | AI Fase 6                                                                                                        |
| `use-ai-theme-generation-core.ts`         | ~80 | Zustand + AI SDK                                 | **HOOKS-DEFER** | —                                            | AI Fase 6                                                                                                        |
| `use-website-preview.ts`                  | ~70 | Zustand (website-preview-store)                  | **HOOKS-DEFER** | —                                            | live preview cross-origin iframe. DEFER Fase 6 ou JIT quando editor tiver preview externo                        |
| `use-github-stars.ts`                     | ~20 | fetch                                            | **HOOKS-SKIP**  | —                                            | Community feature, não aplicável                                                                                 |
| `use-guards.ts`                           | ~30 | better-auth                                      | **HOOKS-SKIP**  | —                                            | Stack incompatível (better-auth). Nossa versão é `requireEntitlement()`                                          |
| `use-post-login-action.ts`                | ~25 | better-auth localStorage                         | **HOOKS-SKIP**  | —                                            | Auth flow melhor-auth specific                                                                                   |
| `use-subscription.ts`                     | ~30 | Polar                                            | **HOOKS-SKIP**  | —                                            | Stack incompatível (Polar)                                                                                       |
| `use-toast.ts`                            | ~50 | radix toast                                      | **HOOKS-SKIP**  | —                                            | Usamos sonner                                                                                                    |
| `use-theme-preset-from-url.ts`            | 16  | nuqs + Zustand                                   | **HOOKS-ADAPT** | `hooks/use-theme-preset-from-url.ts`         | Remover Zustand (`applyThemePreset`) → receber callback via prop. nuqs manter.                                   |
| `use-theme-inspector.ts` (root)           | ~30 | Zustand                                          | **HOOKS-DEFER** | —                                            | Inspector DEFER Fase 6+                                                                                          |
| `use-theme-inspector-classnames.ts`       | ~40 | —                                                | **HOOKS-DEFER** | —                                            | Inspector                                                                                                        |
| `use-theme-inspector-regex.ts`            | ~30 | —                                                | **HOOKS-DEFER** | —                                            | Inspector                                                                                                        |
| `inspector/use-inspector-mouse-events.ts` | ~50 | —                                                | **HOOKS-DEFER** | —                                            | Inspector                                                                                                        |
| `inspector/use-inspector-scroll.ts`       | ~30 | —                                                | **HOOKS-DEFER** | —                                            | Inspector                                                                                                        |
| `inspector/use-inspector-state.ts`        | ~30 | Zustand                                          | **HOOKS-DEFER** | —                                            | Inspector                                                                                                        |
| `inspector/use-theme-inspector.ts`        | ~40 | —                                                | **HOOKS-DEFER** | —                                            | Inspector                                                                                                        |
| `themes/use-community-themes.ts`          | ~40 | TanStack Query                                   | **HOOKS-SKIP**  | —                                            | Community feature                                                                                                |
| `themes/use-theme-mutations.ts`           | ~40 | TanStack Query                                   | **HOOKS-SKIP**  | —                                            | Community feature                                                                                                |
| `themes/use-themes-data.ts`               | ~40 | TanStack Query                                   | **HOOKS-SKIP**  | —                                            | Community feature                                                                                                |

**Resumo hooks:**

- HOOKS-COPY (7): use-controls-tab-from-url, use-debounced-callback, use-feedback-text, use-scroll-start-end, use-document-drag-and-drop-intent + extras puros acima
- HOOKS-ADAPT (4): use-copy-to-clipboard, use-fullscreen, use-iframe-theme-injector, use-contrast-checker + use-theme-preset-from-url
- HOOKS-DEFER (10): image-upload, AI hooks, website-preview, inspector, use-website-preview
- HOOKS-SKIP (11): use-guards, use-post-login-action, use-subscription, use-toast, use-github-stars, community hooks

---

## 4. types/\*

| Arquivo TweakCN               | LOC | Decisão                  | Status nosso / Ação                                                                                                                                                                                                                               |
| ----------------------------- | --- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `types/theme.ts`              | 110 | **TYPES-MERGE ✅ FEITO** | `lib/design/contract/theme.ts` — portado com `ThemeStylePropsSchema`, `ThemeSchema`, `ThemePartialSchema`. Match 100% com `themeStylePropsSchema` upstream. `ThemePreset` type ainda não portado — ADD em `lib/design/contract/theme.ts`.         |
| `types/fonts.ts`              | 47  | **TYPES-MERGE**          | `FontCategory`, `GoogleFont`, `GoogleFontFiles`, `FontInfo`, `PaginatedFontsResponse` — copiar para `lib/design/contract/fonts.ts` (novo arquivo)                                                                                                 |
| `types/editor.ts`             | 41  | **TYPES-MERGE**          | `ThemeEditorState`, `BaseEditorState` — adaptar para `lib/design/contract/editor-state.ts`. `EditorType` e `EditorConfig` são TweakCN-specific (múltiplos tipos de editor) — **SKIP** esses dois                                                  |
| `types/index.ts`              | 68  | **TYPES-MERGE**          | `ColorPickerProps`, `SliderInputProps`, `ToggleOptionProps`, `ReadOnlyColorDisplayProps`, `ColorFormat`, `ValidTailwindShade` — portar pra `lib/design/contract/ui-types.ts`. `ControlSectionProps` — copy. Remove `FocusColorId` (Zustand-bound) |
| `types/ai.ts`                 | 47  | **TYPES-DEFER**          | AI types (MentionReference, AIPromptData, ChatMessage, etc) — DEFER Fase 6. Dependem de AI SDK + UI tools.                                                                                                                                        |
| `types/community.ts`          | ~15 | **TYPES-SKIP**           | Community feature                                                                                                                                                                                                                                 |
| `types/errors.ts`             | ~10 | **TYPES-SKIP**           | better-auth specific                                                                                                                                                                                                                              |
| `types/live-preview-embed.ts` | 33  | **TYPES-COPY**           | `EmbedMessage`, `IframeStatus`, `MESSAGE` constants — copiar para `lib/design/contract/live-preview.ts`. Útil quando editor tiver preview externo.                                                                                                |
| `types/subscription.ts`       | ~20 | **TYPES-SKIP**           | Polar specific                                                                                                                                                                                                                                    |

**Gaps identificados vs nosso `lib/design/contract/theme.ts`:**

- `ThemePreset` type (com `source: "SAVED" | "BUILT_IN"`) — ADD em theme.ts
- `ThemeEditorPreviewProps`, `ThemeEditorControlsProps` — ADD em editor-state.ts
- `themeStylesSchemaWithoutSpacing` + `ThemeStylesWithoutSpacing` — ADD em theme.ts (usado pelo AI SDK pra não passar `spacing` ao modelo)

---

## 5. utils/\* (além dos já extraídos)

Extraídos em pesquisa anterior: `shadows.ts` → `lib/design/shadows.ts` ✅, `color-converter.ts` → `lib/design/color-format.ts` ✅.

| Arquivo TweakCN                     | LOC  | Decisão                      | Destino nosso                             | Notas                                                                                                                                                                                                                                            |
| ----------------------------------- | ---- | ---------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `utils/apply-theme.ts`              | 69   | **UTILS-ADAPT**              | `lib/design/apply-theme.ts` (client-only) | DOM mutation pra editor preview (não substitui `buildThemeCSS` server). Depende de `colorFormatter` + `setShadowVariables`. Adaptar: remover `COMMON_STYLES` import de config → usar de `lib/design/contract/theme.ts`.                          |
| `utils/apply-style-to-element.ts`   | 17   | **UTILS-EXTRACT**            | `lib/design/apply-style-to-element.ts`    | Copy literal. Dependency de apply-theme.ts.                                                                                                                                                                                                      |
| `utils/contrast-checker.ts`         | 45   | **UTILS-SKIP**               | —                                         | WCAG only (não APCA). Nós temos `lib/design/contrast.ts` com APCA Silver.                                                                                                                                                                        |
| `utils/debounce.ts`                 | 20   | **UTILS-EXTRACT**            | `lib/utils/debounce.ts`                   | Copy literal. Puro vanilla TS. Dependency de use-contrast-checker hook.                                                                                                                                                                          |
| `utils/format.ts`                   | 10   | **UTILS-EXTRACT**            | `lib/utils/format.ts`                     | Copy literal. `formatCompactNumber` util genérico (ui/counters).                                                                                                                                                                                 |
| `utils/parse-css-input.ts`          | 69   | **UTILS-EXTRACT**            | `lib/design/parse-css-input.ts`           | Copy + adapt imports (apontar pra nossa `lib/design/contract/theme.ts` e `lib/design/color-format.ts`). Feature: import CSS externo no editor (css-import-dialog.tsx).                                                                           |
| `utils/theme-style-generator.ts`    | 459  | **UTILS-EXTRACT**            | `lib/design/theme-style-generator.ts`     | Copy literal pra versão server. Gera CSS/tailwind-config/layout code. `generateThemeCode()` + `generateTailwindConfigCode()` + `generateLayoutCode()` são cruciais para code-panel do editor (output tabs CSS/Tailwind/Layout). Adaptar imports. |
| `utils/theme-styles.ts`             | 12   | **UTILS-EXTRACT**            | `lib/design/theme-styles.ts`              | `mergeThemeStylesWithDefaults()` — utility simples. Copy + adapt import pra `DEFAULT_THEME` nosso.                                                                                                                                               |
| `utils/theme-presets.ts`            | ~500 | **UTILS-EXTRACT**            | `lib/design/theme-presets.ts`             | Copy literal dos 25 presets built-in. Esses são o catálogo canônico de presets TweakCN. Formato `Record<string, ThemePreset>` igual ao upstream.                                                                                                 |
| `utils/theme-preset-helper.ts`      | 54   | **UTILS-ADAPT**              | `lib/design/theme-preset-helper.ts`       | Remove `useThemePresetStore` Zustand → ler de `lib/design/theme-presets.ts` direto (server-safe). `getBuiltInThemeStyles()` copy. `getPresetThemeStyles()` rewrite sem Zustand.                                                                  |
| `utils/theme-fonts.ts`              | 97   | **UTILS-EXTRACT**            | `lib/design/theme-fonts.ts`               | `fonts` dict + `sansSerifFonts/serifFonts/monoFonts` + `getAppliedThemeFont()`. Copy + adapt import de `SYSTEM_FONTS` → `lib/design/fonts.ts`.                                                                                                   |
| `utils/fonts/index.ts`              | 278  | **UTILS-EXTRACT**            | `lib/design/fonts.ts`                     | `FALLBACK_FONTS` lista, `FONT_CATEGORIES`, `buildFontFamily()`, `extractFontFamily()`, `getDefaultWeights()`, `isFontLoaded()`, `waitForFont()`, `SYSTEM_FONTS`, `SYSTEM_FONTS_FALLBACKS`. Copy + adaptar imports.                               |
| `utils/fonts/google-fonts.ts`       | 54   | **UTILS-EXTRACT**            | `lib/design/google-fonts.ts`              | `fetchGoogleFonts()`, `buildFontCssUrl()`, `loadGoogleFont()`. Copy literal. Dependency da API route.                                                                                                                                            |
| `utils/subscription.ts`             | 26   | **UTILS-SKIP**               | —                                         | Polar specific                                                                                                                                                                                                                                   |
| `utils/registry/themes.ts`          | ~100 | já catalogado em research-41 | —                                         | —                                                                                                                                                                                                                                                |
| `utils/registry/v0.ts`              | ~80  | já catalogado em research-41 | —                                         | —                                                                                                                                                                                                                                                |
| `utils/registry/tailwind-colors.ts` | ~50  | **UTILS-EXTRACT**            | `lib/design/registry/tailwind-colors.ts`  | Mapa Tailwind color palettes → hex. Utilizado no registry output. Copy literal.                                                                                                                                                                  |
| `utils/try-catch.ts`                | 8    | **UTILS-SKIP**               | —                                         | Nós temos `ok()`/`fail()` Result type. Pattern diferente.                                                                                                                                                                                        |
| `utils/ai/apply-theme.ts`           | ~30  | **UTILS-DEFER**              | —                                         | AI-specific apply (Fase 6)                                                                                                                                                                                                                       |
| `utils/ai/image-upload.ts`          | ~60  | **UTILS-DEFER**              | —                                         | AI image upload (Fase 6)                                                                                                                                                                                                                         |
| `utils/ai/message-converter.ts`     | ~40  | **UTILS-DEFER**              | —                                         | AI Fase 6                                                                                                                                                                                                                                        |
| `utils/ai/messages.ts`              | ~30  | **UTILS-DEFER**              | —                                         | AI Fase 6                                                                                                                                                                                                                                        |
| `utils/ai/prompts.ts`               | ~20  | **UTILS-DEFER**              | —                                         | AI Fase 6                                                                                                                                                                                                                                        |
| `utils/ai/ai-prompt.tsx`            | ~40  | **UTILS-DEFER**              | —                                         | AI Fase 6                                                                                                                                                                                                                                        |

---

## 6. db/schema.ts (Drizzle) — inspiration

Drizzle/Neon — não copiar estrutura. Mapear conceitos → nossas migrations Supabase.

| Tabela TweakCN (Drizzle)                             | Conceito                        | Nossa migration                                                                                                                            | Gaps                                                                            |
| ---------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `user`                                               | Identity                        | Supabase `auth.users` (managed)                                                                                                            | —                                                                               |
| `session` + `account` + `verification`               | Auth session/OAuth              | Supabase `auth.*` (managed)                                                                                                                | —                                                                               |
| `theme`                                              | Theme salvo por user            | **0025** (`tenant_themes` + `tenant_theme_versions`) — migration PENDENTE                                                                  | Nossas tabelas são multi-tenant (tenant_id FK vs user_id FK). Conceito coberto. |
| `aiUsage`                                            | Tracking AI por user/modelo/dia | DEFER — não existe em nossas migrations. Estrutura: `(user_id, model_id, prompt_tokens, completion_tokens, days_since_epoch, created_at)`. | DEFER Fase 6 — adicionar em migration 0026+ quando quota tracking AI entrar     |
| `subscription`                                       | Subscription Polar              | Será Stripe (ADR nosso)                                                                                                                    | Estrutura fields parecida mas Polar-specific (`cancelAtPeriodEnd`, `endsAt`)    |
| `oauthApp` + `oauthAuthorizationCode` + `oauthToken` | OAuth 2.0 server                | SKIP                                                                                                                                       | TweakCN tem OAuth pra exportar themes via MCP. Nosso scope é diferente.         |
| `communityTheme` + `communityThemeTag` + `themeLike` | Community sharing               | SKIP                                                                                                                                       | Feature community não prevista em Fases 1-3                                     |

**Conceito `aiUsage` para DEFER:**

```sql
-- Migration futura 0026_ai_usage.sql (inspiration de db/schema.ts:74-84)
CREATE TABLE ai_usage (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model_id TEXT NOT NULL,
  prompt_tokens BIGINT NOT NULL DEFAULT 0,
  completion_tokens BIGINT NOT NULL DEFAULT 0,
  days_since_epoch TEXT NOT NULL,  -- bucketing por dia pra quota check rápido
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

**Conceito `COMMUNITY_THEME_TAGS` de `lib/constants.ts`:** lista de 50 tags canônicas TweakCN (colorful, minimal, professional, etc). ADOPT como seed data em `tenant_themes.tags[]` quando feature tags entrar.

---

## 7. app/\* routes (além de editor + r/themes + api/generate-theme)

| Route TweakCN                           | LOC                    | Decisão                | Destino nosso / Notas                                                                                                                                                                        |
| --------------------------------------- | ---------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/api/google-fonts/route.ts`         | 55                     | **ROUTE-COPY**         | `app/api/admin/theme-studio/google-fonts/route.ts`. Copy literal. Adaptar import de `FALLBACK_FONTS` → `lib/design/fonts.ts`. Usar `process.env.GOOGLE_FONTS_API_KEY` (env var já previsto). |
| `app/api/enhance-prompt/route.ts`       | ~60                    | **ROUTE-DEFER**        | AI Fase 6 — enhance prompt endpoint                                                                                                                                                          |
| `app/api/generate-theme/route.ts`       | ~120                   | Catalogado research-41 | —                                                                                                                                                                                            |
| `app/api/auth/[...all]/route.ts`        | ~5                     | **ROUTE-SKIP**         | better-auth specific                                                                                                                                                                         |
| `app/api/oauth/**` (5 routes)           | ~200 total             | **ROUTE-SKIP**         | OAuth 2.0 server — TweakCN expõe MCP. Nosso scope diferente.                                                                                                                                 |
| `app/api/subscription/route.ts`         | ~20                    | **ROUTE-SKIP**         | Polar specific                                                                                                                                                                               |
| `app/api/webhook/polar/route.ts`        | ~50                    | **ROUTE-SKIP**         | Polar specific                                                                                                                                                                               |
| `app/api/v1/themes/**` (2 routes)       | ~80                    | **ROUTE-DEFER**        | REST API pública de themes — JIT quando precisarmos expor API externa                                                                                                                        |
| `app/api/v1/me/route.ts`                | ~20                    | **ROUTE-SKIP**         | User info — auth-tied                                                                                                                                                                        |
| `app/r/themes/[id]/route.ts`            | Catalogado research-41 | —                      | —                                                                                                                                                                                            |
| `app/r/v0/[id]/route.ts`                | ~30                    | Catalogado research-41 | —                                                                                                                                                                                            |
| `app/editor/theme/[[...themeId]]/**`    | Catalogado research-41 | —                      | —                                                                                                                                                                                            |
| `app/ai/**`                             | ~10                    | **ROUTE-DEFER**        | AI landing page TweakCN. Inspiração layout, não copy. Fase 6.                                                                                                                                |
| `app/community/**`                      | ~100                   | **ROUTE-SKIP**         | Community feature                                                                                                                                                                            |
| `app/dashboard/**`                      | ~30                    | **ROUTE-SKIP**         | Dashboard single-user TweakCN (saved themes). Nosso admin é multi-tenant — padrão diferente.                                                                                                 |
| `app/figma/**`                          | ~20                    | **ROUTE-SKIP**         | Figma MCP integration TweakCN-specific                                                                                                                                                       |
| `app/oauth/authorize/**`                | ~30                    | **ROUTE-SKIP**         | OAuth authorize page                                                                                                                                                                         |
| `app/pricing/**`                        | ~40                    | **ROUTE-SKIP**         | Polar pricing page                                                                                                                                                                           |
| `app/settings/**`                       | ~10                    | **ROUTE-SKIP**         | Auth settings                                                                                                                                                                                |
| `app/(auth)/components/auth-dialog.tsx` | ~50                    | **ROUTE-SKIP**         | better-auth                                                                                                                                                                                  |
| `app/(legal)/**`                        | ~30                    | **ROUTE-SKIP**         | Privacy policy — temos a nossa                                                                                                                                                               |
| `app/page.tsx` (home)                   | ~100                   | **ROUTE-SKIP**         | Landing single-tenant TweakCN                                                                                                                                                                |
| `app/layout.tsx`                        | ~80                    | **CONFIG-INSPIRATION** | Padrão providers/fonts/metadata. Inspira nosso layout porém nosso é multi-tenant (RouteProvider + NextIntlClientProvider + buildThemeCSS)                                                    |
| `app/globals.css`                       | ~60                    | **CONFIG-INSPIRATION** | TweakCN usa Tailwind v4 `@import "tailwindcss"` + `@custom-variant dark`. Nosso já tem estrutura similar.                                                                                    |
| `app/sitemap.ts`                        | ~20                    | **ROUTE-SKIP**         | Single-tenant sitemap                                                                                                                                                                        |

**Admin shell pattern:** TweakCN NÃO tem layout admin estruturado. O "admin" é o editor em `/editor/theme/`. Sem sidebar/shell separado. Para nossa `app/admin/theme-studio/`, o pattern de layout é nossa própria decisão — TweakCN não fornece referência aqui.

---

## 8. lib/\* (além de lib/ai/)

| Arquivo TweakCN                          | Decisão                | Notas                                                                                                                                                                                                                                                           |
| ---------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/utils.ts`                           | **UTILS-ADAPT**        | `cn()` via clsx+twMerge — verificar se nós temos. Se não, copy. `isDeepEqual()` usa `@ngard/tiny-isequal` npm (~1KB) — copy + instalar dep.                                                                                                                     |
| `lib/constants.ts`                       | **UTILS-ADAPT**        | `COMMUNITY_THEME_TAGS` lista 50 tags → ADOPT JIT. `AI_PROMPT_CHARACTER_LIMIT`, `DEBOUNCE_DELAY`, `MAX_IMAGE_FILES/SIZE` — constants úteis pra Fase 6. `MAX_FREE_THEMES`, `AI_REQUEST_FREE_TIER_LIMIT` → adaptar pra nossa entitlement/quota system. Resto SKIP. |
| `lib/shared.ts`                          | **CONFIG-INSPIRATION** | Patterns de código compartilhado — verificar conteúdo JIT                                                                                                                                                                                                       |
| `lib/error-response.ts`                  | **UTILS-SKIP**         | better-auth error format                                                                                                                                                                                                                                        |
| `lib/auth.ts` + `lib/auth-client.ts`     | **UTILS-SKIP**         | better-auth                                                                                                                                                                                                                                                     |
| `lib/checkout.ts`                        | **UTILS-SKIP**         | Polar                                                                                                                                                                                                                                                           |
| `lib/figma-constants.ts`                 | **UTILS-SKIP**         | Figma MCP                                                                                                                                                                                                                                                       |
| `lib/oauth.ts` + `lib/polar.ts`          | **UTILS-SKIP**         | Stack incompatível                                                                                                                                                                                                                                              |
| `lib/posthog.ts`                         | **UTILS-SKIP**         | Analytics (feedback_frescura_filter — user rejeita)                                                                                                                                                                                                             |
| `lib/query-client.tsx`                   | **UTILS-SKIP**         | TanStack Query provider                                                                                                                                                                                                                                         |
| `lib/subscription.ts`                    | **UTILS-SKIP**         | Polar                                                                                                                                                                                                                                                           |
| `lib/inspector/class-utils.ts`           | **UTILS-DEFER**        | Inspector Fase 6+                                                                                                                                                                                                                                               |
| `lib/inspector/inspector-state-utils.ts` | **UTILS-DEFER**        | Inspector                                                                                                                                                                                                                                                       |
| `lib/inspector/segment-classname.ts`     | **UTILS-DEFER**        | Inspector                                                                                                                                                                                                                                                       |
| `lib/inspector/theme-class-finder.ts`    | **UTILS-DEFER**        | Inspector                                                                                                                                                                                                                                                       |

**Verificar `lib/utils.ts` nosso:** se já temos `cn()` (clsx+twMerge), não copiar. Se não, copy. Verificar path canonical.

---

## 9. configs (eslint, tailwind, next.config, etc)

| Arquivo TweakCN     | Decisão                | Gaps relevantes                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `eslint.config.mjs` | **CONFIG-INSPIRATION** | TweakCN usa: `@next/eslint-plugin-next` (core-web-vitals), `eslint-plugin-react` (react-in-jsx-scope OFF), `eslint-plugin-react-hooks` (rules-of-hooks error, exhaustive-deps warn), `typescript-eslint` recommended. Regras TS notáveis: `@typescript-eslint/no-empty-object-type: off`, `no-unused-vars` com `argsIgnorePattern: ^_`. Verificar se nosso eslint já tem equivalentes. |
| `next.config.ts`    | **CONFIG-SKIP**        | TweakCN só tem turbopack SVGR rule. Nosso `next.config.ts` já tem Serwist + proxy.ts + turbopack config próprio. SVGR já configurado ou JIT se necessitar.                                                                                                                                                                                                                             |
| `components.json`   | **CONFIG-INSPIRATION** | `style: "new-york"`, `baseColor: "neutral"`, `cssVariables: true`, `iconLibrary: "lucide"`. Confirmar que nosso `components.json` tem exatamente isso.                                                                                                                                                                                                                                 |
| `.prettierrc`       | **CONFIG-SKIP**        | Nós usamos Biome (stack travado)                                                                                                                                                                                                                                                                                                                                                       |
| `drizzle.config.ts` | **CONFIG-SKIP**        | Drizzle — stack incompatível (Supabase MCP migrations)                                                                                                                                                                                                                                                                                                                                 |
| `.env.example`      | **CONFIG-INSPIRATION** | Vars relevantes: `GOOGLE_FONTS_API_KEY`, `UPSTASH_REDIS_REST_URL`/`TOKEN` (rate limit AI — já configurado). SKIP vars: `BETTER_AUTH_SECRET`, `POLAR_ACCESS_TOKEN`, `DATABASE_URL`, `POSTHOG_KEY`.                                                                                                                                                                                      |
| `middleware.ts`     | **CONFIG-SKIP**        | TweakCN middleware é auth-only (better-auth). Nosso é multi-brand hostname routing (proxy.ts).                                                                                                                                                                                                                                                                                         |
| `.husky/pre-commit` | **CONFIG-SKIP**        | `pnpm lint-staged` — verificar se nosso já tem                                                                                                                                                                                                                                                                                                                                         |

---

## 10. Bloqueadores / ressalvas

**Bloqueadores zero pra step 1 e step 2.** Lista cravada de skip por stack incompatível:

- `lib/auth.ts`, `lib/auth-client.ts` — better-auth. Nosso: Supabase Auth.
- `lib/checkout.ts`, `lib/polar.ts`, `utils/subscription.ts` — Polar billing. Nosso: Stripe (futuro).
- `lib/posthog.ts` — analytics. Nosso: zero analytics MVP solo (feedback_frescura_filter).
- `lib/query-client.tsx` + `hooks/use-font-search.ts` + `hooks/themes/**` — TanStack Query. Nosso stack não inclui.
- `db/schema.ts`, `db/index.ts`, `drizzle.config.ts` — Drizzle ORM. Nosso: Supabase MCP migrations.
- `app/api/oauth/**`, `app/oauth/**` — OAuth 2.0 server MCP TweakCN-specific.
- `app/api/webhook/polar/**`, `app/pricing/**`, `app/settings/**` — Polar/auth.
- `components/ui/toast.tsx` + `use-toast.ts` + `toaster.tsx` — shadcn legacy toast. Nosso: sonner.
- `components/ui/revola.tsx`, `components/ui/base-ui-tabs.tsx` — libs custom/experimental TweakCN não-shadcn.

**Adaptações não-triviais (JIT ADR se necessário):**

- `use-iframe-theme-injector.ts` — cross-origin iframe preview com postMessage. Complexidade média. ADAPT removendo Zustand.
- `utils/theme-style-generator.ts` — gera CSS pra v3/v4 e tailwind config. Nossa geração server usa `buildThemeCSS` (diferente). Coexistem: server = `buildThemeCSS`; editor client-side export = `generateThemeCode`. Sem conflito.

---

## 11. Plano de copy literal cravado (ordem operacional)

### Step 1 — Primitives (ANTES de começar qualquer Chunk do §4.7 do plano)

```bash
# 1a. Primitives batch (sem slider separado pra garantir ordem)
pnpm dlx shadcn@latest add slider accordion alert alert-dialog avatar breadcrumb checkbox collapsible drawer pagination progress radio-group resizable table toggle toggle-group aspect-ratio

# 1b. Sidebar separado (arquivo grande ~600 LOC, verificar conflito com sheet)
pnpm dlx shadcn@latest add sidebar

# 1c. button --overwrite + add variant accent
pnpm dlx shadcn@latest add button --overwrite
# Depois editar components/ui/button.tsx: adicionar variant accent no CVA
# accent: "bg-accent text-accent-foreground shadow-sm hover:bg-accent/80"
```

**Deps npm extras Step 1:**

```bash
pnpm add screenfull  # use-fullscreen hook
pnpm add @ngard/tiny-isequal  # lib/utils.ts isDeepEqual (tiny ~1KB)
```

### Step 2 — Utils foundation (antes do REWRITE store — Chunk 1 §4.7)

Copiar nesta ordem (cada arquivo tem deps no anterior):

1. `utils/fonts/index.ts` → `lib/design/fonts.ts`
2. `utils/fonts/google-fonts.ts` → `lib/design/google-fonts.ts`
3. `utils/theme-fonts.ts` → `lib/design/theme-fonts.ts`
4. `utils/theme-presets.ts` → `lib/design/theme-presets.ts` (25 presets)
5. `config/theme.ts` fields não portados → verificar gaps em `lib/design/theme-defaults.ts` (já parcialmente portado; adicionar `COMMON_STYLES` array e `DEFAULT_FONT_*` consts)
6. `utils/apply-style-to-element.ts` → `lib/design/apply-style-to-element.ts`
7. `utils/apply-theme.ts` → `lib/design/apply-theme.ts` (client-only, ADAPT imports)
8. `utils/theme-style-generator.ts` → `lib/design/theme-style-generator.ts` (ADAPT imports)
9. `utils/theme-styles.ts` → `lib/design/theme-styles.ts`
10. `utils/theme-preset-helper.ts` → `lib/design/theme-preset-helper.ts` (ADAPT: remove Zustand)
11. `utils/parse-css-input.ts` → `lib/design/parse-css-input.ts` (ADAPT imports)
12. `utils/debounce.ts` → `lib/utils/debounce.ts`
13. `utils/format.ts` → `lib/utils/format.ts`
14. `utils/registry/tailwind-colors.ts` → `lib/design/registry/tailwind-colors.ts`

Types a adicionar/completar: 15. `types/theme.ts` additions → `lib/design/contract/theme.ts`: ADD `ThemePreset`, `themeStylesSchemaWithoutSpacing`, `ThemeStylesWithoutSpacing`, `ThemeEditorPreviewProps`, `ThemeEditorControlsProps` 16. `types/fonts.ts` → `lib/design/contract/fonts.ts` (novo) 17. `types/index.ts` selections → `lib/design/contract/ui-types.ts` (novo) 18. `types/live-preview-embed.ts` → `lib/design/contract/live-preview.ts` (novo)

Hooks a copiar/adaptar: 19. `hooks/use-controls-tab-from-url.ts` → `hooks/use-controls-tab-from-url.ts` (COPY) 20. `hooks/use-debounced-callback.ts` → `hooks/use-debounced-callback.ts` (COPY) 21. `hooks/use-feedback-text.ts` → `hooks/use-feedback-text.ts` (COPY) 22. `hooks/use-scroll-start-end.ts` → `hooks/use-scroll-start-end.ts` (COPY) 23. `hooks/use-document-drag-and-drop-intent.ts` → `hooks/use-document-drag-and-drop-intent.ts` (COPY) 24. `hooks/use-fullscreen.ts` → `hooks/use-fullscreen.ts` (ADAPT: copy + instalar screenfull) 25. `hooks/use-copy-to-clipboard.ts` → `hooks/use-copy-to-clipboard.ts` (ADAPT: toast → sonner) 26. `hooks/use-iframe-theme-injector.ts` → `hooks/use-iframe-theme-injector.ts` (ADAPT: remove Zustand → prop) 27. `hooks/use-contrast-checker.ts` → `hooks/use-contrast-checker.ts` (ADAPT: WCAG → APCA via lib/design/contrast.ts) 28. `hooks/use-theme-preset-from-url.ts` → `hooks/use-theme-preset-from-url.ts` (ADAPT: remove Zustand → prop callback)

Route API: 29. `app/api/google-fonts/route.ts` → `app/api/admin/theme-studio/google-fonts/route.ts` (ADAPT: import paths)

### Step 3 — Editor copy (Chunks 3-6 do §4.7 do plano)

Cross-reference research-41 §2.3 — não duplicar aqui. Ver tabela completa em research-41.

### Step 4 — Configs (JIT)

- Verificar `components.json` nosso: confirmar `style: "new-york"`, `baseColor: "neutral"`, `iconLibrary: "lucide"` — se diferente, ajustar AGORA (afeta todos shadcn add subsequentes).
- Verificar `eslint.config.mjs` nosso: garantir `exhaustive-deps: warn` e `no-unused-vars` com `argsIgnorePattern: ^_`.
- Verificar se `lib/utils.ts` tem `cn()` — se não, copy de `lib/utils.ts` TweakCN + instalar `@ngard/tiny-isequal`.

---

## 12. Referências

- `docs/research/41-audit-tweakcn-fases-5-6-7.md` — editor/AI/registry (62 arquivos, não duplicar)
- `docs/research/46-shadcn-style-tweakcn-compat.md` — new-york style confirmado
- `docs/plans/theme-builder.md` §4.7 — sequência chunks copy
- `lib/design/contract/theme.ts` — schema portado (SSOT)
- `lib/design/theme-defaults.ts` — defaults portados
- `lib/design/shadows.ts` — shadows portado
- `lib/design/color-format.ts` — color-converter portado
- `lib/design/build-theme-css.ts` — CSS emit portado
- `.claude/rules/shadcn-zone.md` — zona quarentenada + canal único
- `.claude/rules/components.md` — hierarquia L1/L1.5/L2/L3
- ADR-0044 — pivot TweakCN canonical (design system)
- ADR-0045 — registry strategy
- ADR-0046 — dogfooding-first order
