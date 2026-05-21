# 41 — Audit TweakCN Fases 5/6/7 (batch consolidado)

> **Tipo:** pesquisa autoritativa — batch único consolidando S5.0 + S6.0 + S7.0
> **Data:** 2026-05-21
> **Origem:** pivot-tweakcn.md §11 (commit `cad6866`) — audits S5.0/S6.0/S7.0 consolidados em research-41
> **Clone auditado:** `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, Apache-2.0)
> **Pré-leituras:** research-28 (anatomia inicial), research-38 (registry/v0), pivot-tweakcn.md §§ 6, 7, 8
>
> **Escopo:** read-only. Nenhum código nosso foi modificado. Nenhum arquivo copiado.

---

## 1. Sumário executivo

TweakCN `components/editor/` contém **62 arquivos** (~7.050 LOC total), separados em 4 grupos: top-level editor shell, action-bar, ai chat, theme-preview. O Zustand store (`editor-store.ts`) é a dependência central: **11 dos 25 top-level arquivos** o importam diretamente via `useEditorStore`. Isso é o principal bloqueador de port direto — substituição por RHF + `useState` + server action é obrigatória antes de qualquer outro trabalho de Fase 5.

O sistema de AI (Fase 6) é surpreendentemente limpo: `streamText` com `tool calling` (não `streamObject` direto), onde o modelo "base" (Gemini 2.5 Flash) conversa com o usuário e invoca a ferramenta `generateTheme`, que então chama o modelo "theme-generation" (Gemini 3 Flash Preview) via `streamObject` com o schema Zod `themeStylesSchemaWithoutSpacing`. O sistema de retry-on-schema-fail é implícito no `streamObject` do AI SDK v6 (rejeita parciais inválidos). Não há retry explícito de 3x no código — o SDK gerencia.

O registry endpoint (Fase 7) é direto: `app/r/themes/[id]/route.ts` + `utils/registry/themes.ts` = ~229 LOC total. O payload `registry:style` (não `registry:theme` — detalhe importante) é validado contra `shadcn/schema registryItemSchema` antes de retornar. Nossa adaptação para `/api/r/themes/[tenantId]/v{n}` é straightforward.

---

## 2. Parte 1 — Audit Fase 5: Builder UI (`components/editor/**`)

### 2.1 Inventário completo

Total de arquivos: **62** (25 top-level + 13 action-bar + 18 ai + 4 theme-preview + 2 ação extra).

**Dependências externas críticas identificadas:**

| Lib externa                    | Uso                                                       | Substituto nosso                                  |
| ------------------------------ | --------------------------------------------------------- | ------------------------------------------------- |
| `zustand` (`useEditorStore`)   | State global: themeState, history, undo/redo, checkpoint  | RHF + `useState` local + `useReducer` pra history |
| `@tanstack/react-query`        | `queryClient.invalidateQueries` em `use-chat-context.tsx` | `revalidateTag` + RSC refetch                     |
| `better-auth` / `useGuards`    | Gate de sessão + subscription antes de AI generate        | `requireEntitlement('theme_studio')` server-side  |
| `nuqs` (`useQueryState`)       | URL state pra `?tab=colors` e `?theme=preset-name`        | `nuqs` compatível — MANTER (Next.js URL state ok) |
| `posthog-js`                   | Analytics em `code-panel.tsx`                             | SKIP — nenhum analytics em MVP solo               |
| `@upstash/ratelimit` + `kv`    | Rate limit AI em `app/api/generate-theme/route.ts`        | Upstash já configurado em nosso projeto           |
| `@ai-sdk/react` (`useChat`)    | Chat streaming UI                                         | Manter — Vercel AI SDK v6 já é nossa stack        |
| TipTap (em `mention-list.tsx`) | Editor de rich text pra chat input com @mentions          | DEFER Fase 6 — substituir por textarea simples    |

### 2.2 Dependency graph simplificado (top-level)

```
editor.tsx
  ├── store/editor-store.ts  ← Zustand SSOT de tudo
  ├── ThemeControlPanel
  │     ├── ColorsTabContent → ColorPicker → ColorSelectorPopover
  │     ├── FontPicker → theme-font-select
  │     ├── HslAdjustmentControls → HslPresetButton, SliderWithInput
  │     ├── ShadowControl → SliderWithInput
  │     ├── ChatInterface → [ai/* subtree]  ← TipTap + better-auth + TanStack
  │     └── ThemePresetSelect → [preset store Zustand]
  └── ThemePreviewPanel
        ├── ActionBar → [action-bar/* subtree] ← save/share/code/theme-toggle
        └── [theme-preview/* subtree]

utils/apply-theme.ts         ← DOM mutation direto (useEffect em editor.tsx)
utils/shadows.ts             ← getShadowMap() algoritmo gerador — EXTRACT
utils/color-converter.ts     ← culori wrapper — EXTRACT
hooks/use-theme-preset-from-url.ts ← nuqs + Zustand
hooks/use-controls-tab-from-url.ts ← nuqs → MANTER (sem Zustand)
```

### 2.3 Tabela de decisão arquivo-a-arquivo

| Arquivo TweakCN                                  | LOC | Decisão                                                                                                  | Destino nosso                                                                    | Esforço       | Dependências críticas                                                                 |
| ------------------------------------------------ | --- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------- |
| `editor.tsx`                                     | 139 | **ADAPT** — layout 2 painéis + ResizablePanelGroup útil                                                  | `app/admin/theme-studio/view.tsx`                                                | 4h            | Zustand → RHF prop drilling; `use(themePromise)` RSC pattern adaptável                |
| `store/editor-store.ts`                          | 232 | **REWRITE** — Zustand com persist, history/undo-redo, checkpoint                                         | `app/admin/theme-studio/_state/use-theme-form.ts` (RHF + useReducer pra history) | 6-8h          | CORE blocker; tudo depende disto                                                      |
| `theme-control-panel.tsx`                        | 268 | **ADAPT** — 4 tabs, COMMON_STYLES split light/dark                                                       | `app/admin/theme-studio/_components/control-panel.tsx`                           | 5-6h          | Zustand → props; `useAIThemeGenerationCore` → simples boolean prop                    |
| `colors-tab-content.tsx`                         | 280 | **COPY + atrib** — lista 28 tokens c/ color picker                                                       | `components/admin/theme-studio/colors-tab-content.tsx`                           | 2h            | `updateStyle` callback (trivial adaptação)                                            |
| `color-picker.tsx`                               | 133 | **COPY + atrib**                                                                                         | `components/admin/theme-studio/color-picker.tsx`                                 | 1h            | sem deps externas pesadas                                                             |
| `color-selector-popover.tsx`                     | 208 | **COPY + atrib**                                                                                         | `components/admin/theme-studio/color-selector-popover.tsx`                       | 1h            | idem                                                                                  |
| `hsl-adjustment-controls.tsx`                    | 245 | **ADAPT** — HSL sliders + 15 presets + `adjustColorByHsl()`                                              | `components/admin/theme-studio/hsl-controls.tsx`                                 | 3h            | Zustand checkpoint → local state RHF; culori permanece                                |
| `hsl-preset-button.tsx`                          | 83  | **COPY + atrib**                                                                                         | junto com hsl-controls.tsx                                                       | incluso acima | sem deps externas                                                                     |
| `contrast-checker.tsx`                           | 377 | **ADAPT** — WCAG → APCA Silver dual-gate                                                                 | `components/admin/theme-studio/contrast-checker.tsx`                             | 5h            | `useContrastChecker` hook → reescrever com `apca-w3`; `useTheme` → next-themes compat |
| `shadow-control.tsx`                             | 85  | **COPY + atrib**                                                                                         | `components/admin/theme-studio/shadow-control.tsx`                               | 1h            | só SliderWithInput                                                                    |
| `slider-with-input.tsx`                          | 75  | **COPY + atrib**                                                                                         | `components/admin/theme-studio/slider-with-input.tsx`                            | 1h            | shadcn primitives                                                                     |
| `font-picker.tsx`                                | 415 | **COPY + atrib**                                                                                         | `components/admin/theme-studio/font-picker.tsx`                                  | 3h            | `useQueryState` nuqs (manter), `app/api/google-fonts`                                 |
| `theme-font-select.tsx`                          | 55  | **COPY + atrib**                                                                                         | junto com font-picker                                                            | incluso       | sem deps pesadas                                                                      |
| `theme-preset-select.tsx`                        | 440 | **ADAPT** — dropdown presets; Zustand store → props                                                      | `components/admin/theme-studio/preset-select.tsx`                                | 4h            | `useThemePresetStore` Zustand → server action load presets                            |
| `code-panel.tsx`                                 | 311 | **ADAPT** — tabs CSS/registry/v0; PostHog → SKIP; registry URL → nosso `/api/r/themes/[tenantId]/active` | `components/admin/theme-studio/code-panel.tsx`                                   | 4h            | `usePreferencesStore` Zustand → `useState`; `generateThemeCode` utils → manter        |
| `code-panel-dialog.tsx`                          | 34  | **COPY**                                                                                                 | junto com code-panel                                                             | incluso       | wrapper leve                                                                          |
| `control-section.tsx`                            | 54  | **COPY**                                                                                                 | `components/admin/theme-studio/control-section.tsx`                              | 0.5h          | nenhuma                                                                               |
| `theme-save-dialog.tsx`                          | 166 | **SKIP** — community share single-user                                                                   | —                                                                                | —             | Drizzle/Neon, better-auth                                                             |
| `share-dialog.tsx`                               | 54  | **SKIP** — share link social                                                                             | —                                                                                | —             | community feature                                                                     |
| `css-import-dialog.tsx`                          | 114 | **DEFER** — import CSS externo; útil mas não MVP                                                         | —                                                                                | —             | baixa prioridade                                                                      |
| `inspector-overlay.tsx`                          | 105 | **DEFER** — inspect elements classes ao hover                                                            | —                                                                                | —             | nice-to-have                                                                          |
| `inspector-class-item.tsx`                       | 99  | **DEFER**                                                                                                | —                                                                                | —             | junto com inspector                                                                   |
| `section-context.tsx`                            | 16  | **COPY**                                                                                                 | idem control-section                                                             | incluso       | minimal                                                                               |
| `custom-textarea.tsx`                            | 194 | **DEFER** — textarea com auto-resize; usado pelo chat input                                              | —                                                                                | —             | chat UI Fase 6                                                                        |
| `mention-suggestion.ts`                          | 87  | **DEFER** — TipTap mention config                                                                        | —                                                                                | —             | TipTap (Fase 6)                                                                       |
| `mention-list.tsx`                               | 131 | **DEFER** — UI dropdown de @mentions                                                                     | —                                                                                | —             | TipTap (Fase 6)                                                                       |
| **action-bar/action-bar.tsx**                    | 24  | **ADAPT** — shell; guarda botões                                                                         | `app/admin/theme-studio/_components/action-bar.tsx`                              | 2h            | minimal                                                                               |
| **action-bar/ai-generate-button.tsx**            | ~30 | **ADAPT** — "Generate" trigger                                                                           | incluído na action-bar                                                           | incluso       | `useGuards` → `requireEntitlement`                                                    |
| **action-bar/code-button.tsx**                   | ~20 | **COPY**                                                                                                 | incluso                                                                          | incluso       | nenhuma                                                                               |
| **action-bar/theme-toggle.tsx**                  | ~20 | **COPY**                                                                                                 | incluso                                                                          | incluso       | next-themes compat                                                                    |
| **action-bar/undo-redo-buttons.tsx**             | ~30 | **ADAPT** — Zustand history → useReducer                                                                 | incluso                                                                          | incluso       |                                                                                       |
| **action-bar/save-button.tsx**                   | ~40 | **ADAPT** — trigger server action save                                                                   | incluso                                                                          | 1h            | Zustand checkpoint → form submit                                                      |
| **action-bar/reset-button.tsx**                  | ~20 | **ADAPT** — reset pra preset original                                                                    | incluso                                                                          | incluso       |                                                                                       |
| **action-bar/mcp-dialog.tsx**                    | ~60 | **SKIP** — explica como configurar `shadcn@canary registry:mcp`                                          | —                                                                                | —             | não aplicável                                                                         |
| **action-bar/publish-button.tsx**                | ~30 | **SKIP** — community publish                                                                             | —                                                                                | —             | community                                                                             |
| **action-bar/share-button.tsx**                  | ~20 | **SKIP** — share social                                                                                  | —                                                                                | —             | community                                                                             |
| **action-bar/more-options.tsx**                  | ~40 | **ADAPT** — dropdown extra opções                                                                        | incluso                                                                          | incluso       | PostHog → SKIP                                                                        |
| **action-bar/import-button.tsx**                 | ~30 | **DEFER** — importar CSS                                                                                 | —                                                                                | —             | junto com css-import-dialog                                                           |
| **ai/chat-interface.tsx**                        | 144 | **DEFER Fase 6** — orquestra chat AI                                                                     | —                                                                                | —             | TipTap + better-auth + TanStack                                                       |
| **ai/chat-input.tsx**                            | 221 | **DEFER Fase 6**                                                                                         | —                                                                                | —             | TipTap/textarea                                                                       |
| **ai/messages.tsx**                              | 179 | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/message.tsx**                               | 241 | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/chat-theme-preview.tsx**                    | 167 | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/message-edit-form.tsx**                     | 150 | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/ai-chat-form-body.tsx**                     | 98  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/message-actions.tsx**                       | 91  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/alert-banner.tsx**                          | 112 | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/no-messages-placeholder.tsx**               | 114 | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/enhance-prompt-button.tsx**                 | 34  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/drag-and-drop-image-uploader.tsx**          | 49  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/image-uploader.tsx**                        | 60  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/uploaded-image-preview.tsx**                | 76  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/chat-image-preview.tsx**                    | 58  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/stream-text.tsx**                           | 24  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/pill-action-button.tsx**                    | 31  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/closeable-suggested-pill-actions.tsx**      | 55  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **ai/loading-logo.tsx**                          | 20  | **DEFER Fase 6**                                                                                         | —                                                                                | —             |                                                                                       |
| **theme-preview/color-preview.tsx**              | 213 | **COPY + atrib**                                                                                         | `components/admin/theme-studio/preview/color-preview.tsx`                        | 2h            | nenhuma                                                                               |
| **theme-preview/components-showcase.tsx**        | 218 | **COPY + atrib**                                                                                         | `components/admin/theme-studio/preview/components-showcase.tsx`                  | 2h            | shadcn components vanilla                                                             |
| **theme-preview/examples-preview-container.tsx** | 34  | **COPY**                                                                                                 | incluso                                                                          | incluso       |                                                                                       |
| **theme-preview/tabs-trigger-pill.tsx**          | 23  | **COPY**                                                                                                 | incluso                                                                          | incluso       |                                                                                       |
| `theme-preview-panel.tsx`                        | 268 | **ADAPT**                                                                                                | `app/admin/theme-studio/_components/preview-panel.tsx`                           | 3h            | Zustand → props                                                                       |

### 2.4 Análise: Zustand → RHF + `useReducer`

O `editor-store.ts` gerencia 5 concerns distintos:

1. **`themeState`** (current theme styles + mode + preset) → `useForm` RHF com `defaultValues` do DB + `watch()` pra preview live
2. **`hslAdjustments`** (hue/sat/light sliders) → `useState` local em `HslAdjustmentControls`
3. **`history/future`** (undo/redo, 30 entradas, debounce 500ms) → `useReducer` com `{ past[], present, future[] }` pattern
4. **`themeCheckpoint`** (snapshot pra revert antes de HSL adjust) → `useRef` + snapshot on `setCheckpoint()`
5. **Persist via `localStorage`** → `useLocalStorage` hook JIT (ou `nuqs` pra URL state pra sharable link)

O ponto mais trabalhoso é a integração do undo/redo com o form RHF. Solução recomendada: `useImperativeHandle` expondo `undo/redo` para a action-bar, com `useReducer` separado que o `useForm` `reset()` consome.

### 2.5 Adaptações cravadas (princípio §8 do plano)

- **`apply-theme.ts`** (DOM mutation): em TweakCN, o preview aplica CSS vars via `document.documentElement.style.setProperty`. Nossa adaptação: `<style precedence="theme">` CSS vars injetados como string inline no preview panel, sem DOM mutation global. O `applyThemeToElement` não é portado — substituído pelo pattern `<style>` que já usamos no runtime do tenant.
- **URL state `?tab=`**: `nuqs` permanece — é compatível com Next.js App Router. Apenas `?theme=` (preset from URL) é reescrito pra inicializar via server action load em vez de Zustand store.
- **Community/share features**: SKIP total. Sem `theme-save-dialog.tsx`, sem `share-dialog.tsx`, sem `publish-button.tsx`, sem `mcp-dialog.tsx`.
- **`useGuards`** (better-auth): substituído por `requireEntitlement('theme_studio')` no server action + `middleware` guard. Nenhuma verificação client-side — tudo server.

### 2.6 Versionamento UI (princípio §9 do plano)

TweakCN não tem UI de versionamento. Nossa adição:

- **"Salvar como variante"**: botão save na action-bar → `saveThemeVersion` server action → cria nova row em `tenant_theme_versions` (Fase 4 já entregou schema).
- **"Histórico de variantes"**: sidebar/drawer lateral mostrando `v1, v2, v3...` com timestamp + nome opcional. Clicar → load version pra form RHF.
- **"Restaurar vX"**: recarrega `themeState` com os valores da versão escolhida + marca como ativa.
- **Draft vs Published**: `tenant_themes.status` enum — preview vive no form, published aplica no site. Botão separado "Publicar" do "Salvar rascunho".

**Esforço total estimado Fase 5: 34h**

Breakdown: REWRITE store (8h) + ADAPT editor shell + control-panel + action-bar (12h) + COPY/ADAPT color/font/shadow/HSL/contrast/code-panel controls (10h) + preview components (4h).

**Bloqueadores identificados Fase 5:**

- Zustand → RHF + useReducer é o trabalho mais arriscado (falha na integração = undo/redo quebrado). Recomendado: protótipo standalone em `/app/admin/theme-studio/_state/` antes de integrar com UI.
- `contrast-checker.tsx` depende de `useContrastChecker` hook que usa `culori.wcagLuminance`. Precisamos reescrever usando `apca-w3` pra APCA Silver. O hook é ~80 LOC — estimativa 2h extra vs copy literal.
- Storybook 10 precisa estar instalado (§5.0 do plano execução) antes do primeiro componente pra stories obrigatórias.

---

## 3. Parte 2 — Audit Fase 6: AI Generation

### 3.1 Arquivos mapeados

| Arquivo                           | LOC | Papel                                                                                             |
| --------------------------------- | --- | ------------------------------------------------------------------------------------------------- |
| `lib/ai/prompts.ts`               | 111 | System prompts: `GENERATE_THEME_SYSTEM` + `ENHANCE_PROMPT_SYSTEM`                                 |
| `lib/ai/providers.ts`             | 25  | `myProvider` customProvider Gemini — gemini-2.5-flash (base) + gemini-3-flash-preview (theme-gen) |
| `lib/ai/generate-theme/index.ts`  | 4   | Re-exports `themeStylesOutputSchema` = `themeStylesSchemaWithoutSpacing`                          |
| `lib/ai/generate-theme/tools.ts`  | 44  | `THEME_GENERATION_TOOLS` — tool `generateTheme` com `streamObject`                                |
| `app/api/generate-theme/route.ts` | 109 | POST endpoint: rate-limit Upstash + subscription check + `streamText` com tool                    |

**Total: ~293 LOC de AI core.**

Arquivo `lib/ai/schema.ts` **não existe** — schema está em `types/theme.ts` (`themeStylesSchemaWithoutSpacing`). Arquivo `lib/ai/usage.ts` **não existe** — quota tracking é em `actions/ai-usage.ts` + `db/schema.ts` tabela `aiUsage`.

### 3.2 System prompt — análise detalhada

`GENERATE_THEME_SYSTEM` (~79 linhas efetivas) tem 7 seções:

| Seção                                  | Conteúdo                                             | Adaptar?                                                                |
| -------------------------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------- |
| `# Role`                               | "expert shadcn/ui theme generator"                   | Mudar pra "expert theme generator for multi-tenant SaaS"                |
| `# Input Analysis Protocol`            | Text/Images/SVG/Base Theme @mentions                 | MANTER — excelente; adicionar "tenant vertical context"                 |
| `# Core Theme Structure`               | 28-token pairs, shadow structure                     | MANTER — idêntico ao nosso schema                                       |
| `# Color Harmony`                      | Tinted surfaces, chart harmony, sidebar echo         | MANTER literal — princípios sólidos                                     |
| `# Font Pairing`                       | Google Fonts trio, personality match                 | MANTER — adaptar only font-sans/serif/mono (não display/accent/eyebrow) |
| `# Mode-Aware Shadows`                 | Light 0.05-0.15 opacity, dark 0.2-0.4                | MANTER                                                                  |
| `# Letter Spacing & Radius Commitment` | Commits to style: -0.025em modern, +0.02em brutalist | MANTER                                                                  |
| `# Design Coherence`                   | Full commit a mood — evita middle-ground             | MANTER                                                                  |
| `# Tokens Change Logic`                | "Make it [color]" → quais tokens mudar               | MANTER                                                                  |
| `# Execution Rules`                    | Pergunta 1-2 se ambíguo; call tool se claro          | MANTER                                                                  |
| `# Output Constraints`                 | HEX-only colors, sem JSON em msgs, language match    | ADAPT — remover restrição HEX (nós queremos OKLCH)                      |
| `# Prohibited`                         | Sem JSON em output, sem rgba, sem em-dashes          | MANTER                                                                  |
| `# Examples`                           | 3 exemplos input→response                            | MANTER — muito útil pro LLM                                             |

**Seções a ADICIONAR em nossa adaptação:**

1. `# APCA Silver compliance` — pós-geração, rejeitar e re-prompt se `apca(fg, bg) < 75` pra pares body text
2. `# Tenant context` — incluir `vertical` (fitness/yoga/languages) + `brand.name` no system prompt pra flavor
3. `# OKLCH preferred output` — em vez de HEX-only; nossa storage é HEX mas aceita OKLCH

`ENHANCE_PROMPT_SYSTEM` (~30 linhas) é minimalista e reutilizável sem adaptação.

### 3.3 Estrutura do endpoint AI — flow completo

```
POST /api/generate-theme
  ↓
Rate-limit Upstash (5 req/60s por IP)
  ↓
validateSubscriptionAndUsage(userId)  ← em nós: requireEntitlement('ai_theme_gen')
  ↓
streamText(model='base'=gemini-2.5-flash, system=GENERATE_THEME_SYSTEM, tools=THEME_GENERATION_TOOLS)
  ↓ (quando modelo decide chamar tool)
tool.execute() → streamObject(model='theme-generation'=gemini-3-flash-preview, schema=themeStylesSchemaWithoutSpacing)
  ↓ (streaming chunks via writer)
createUIMessageStreamResponse
  ↓
client: useChat → onData → applyGeneratedTheme() → Zustand setThemeState()
```

**Retry on schema fail:** `streamObject` do Vercel AI SDK v6 usa `object` promise que só resolve quando output completo passa na validação Zod. Falhas parciais são descartadas. Não há retry loop explícito — o SDK expõe `onError` e `stopWhen: stepCountIs(5)` limita turns do multi-step.

**Image-to-theme:** As imagens são convertidas via `convertMessagesToModelMessages` em `DataContent` (base64/URL) e incluídas nas `messages` passadas ao modelo. O modelo "base" (Gemini 2.5 Flash multimodal) analisa visualmente e descreve ao modelo "theme-generation". É análise visual LLM — não pixel extraction. A UI tem `drag-and-drop-image-uploader.tsx` + `image-uploader.tsx` que convertem pra base64 e adicionam ao payload de mensagem.

**Quota tracking (`aiUsage` table):** `recordAIUsage` em `onFinish` grava `modelId + inputTokens + outputTokens + userId`. Nosso equivalente: gravar em `tenant_theme_versions` com `source='ai-generated' + prompt_text + model + token_usage JSONB`.

### 3.4 Tabela de adaptação Fase 6

| Peça TweakCN                             | Nossa adaptação                                                                                                              | Modelo proposto                        | Esforço                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ---------------------- |
| `GENERATE_THEME_SYSTEM` prompt           | ADAPT (adicionar APCA, vertical context, OKLCH)                                                                              | Gemini 2.5 Flash (base chat)           | 2h                     |
| `streamText` + tool calling              | MANTER pattern — `streamText` com tool `generateTheme`                                                                       | Gemini 2.5 Flash via Vercel AI Gateway | 3h (setup gateway)     |
| `streamObject` pra theme-gen             | MANTER — usar `themeStylesSchemaWithoutSpacing` nosso (idêntico)                                                             | Gemini 3 Flash Preview via AI Gateway  | 1h                     |
| Upstash rate-limit                       | MANTER — já temos Upstash; adaptar key pra `tenant_id:userId`                                                                | —                                      | 1h                     |
| `validateSubscriptionAndUsage`           | Substituir por `requireEntitlement('ai_theme_gen')` server                                                                   | —                                      | 1h                     |
| `recordAIUsage`                          | Gravar em `tenant_theme_versions.metadata` JSONB                                                                             | —                                      | 1h                     |
| Chat UI (`chat-interface.tsx` + subtree) | REWRITE sem TipTap: `<textarea>` + streaming preview. TipTap @mentions = DEFER. Manter pill actions + image upload como MVP. | —                                      | 8h                     |
| Image upload pipeline                    | ADAPT — base64 via `Blob` já usado em nosso storage engine                                                                   | —                                      | 3h                     |
| APCA gate pós-output                     | NOVO — `safeParse` Zod + APCA check; se falhar, re-prompt com constraint explícita                                           | —                                      | 3h                     |
| Versionamento da geração                 | NOVO — cada output IA → `tenant_theme_versions` com `source='ai-generated'`                                                  | —                                      | 2h (usa schema Fase 4) |

**Esforço total estimado Fase 6: 25h**

Breakdown: prompt adaptation (2h) + AI Gateway setup + endpoint (8h) + APCA gate (3h) + chat UI minimalista (8h) + image upload (3h) + versionamento (2h) — menos 3h de estudos S6.1/S6.2/S6.3 já realizados parcialmente neste audit.

**Bloqueadores identificados Fase 6:**

- AI Gateway Vercel: verificar se `google/gemini-3-flash-preview` já está disponível no gateway (pode estar em preview). Fallback: usar `google/gemini-2.5-flash` pra ambos base + theme-gen.
- APCA gate pós-output: precisa de `lib/design/contrast.ts` (nosso `apca()` já existe) + definir thresholds de rejeição (body Lc 75, large Lc 60).
- `stopWhen: stepCountIs(5)` limita turns — se APCA rejeitar e re-prompt consumir turns, potencial de loop interrompido. Solução: gate APCA como validação pós-streamObject, não como turn de re-prompt. Rejeitar client-side com mensagem + botão "Tentar novamente com mais contraste".

---

## 4. Parte 3 — Audit Fase 7: Registry / v0

### 4.1 Arquivos mapeados

| Arquivo                             | LOC | Papel                                                                                                                                                  |
| ----------------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `app/r/themes/[id]/route.ts`        | 69  | Registry endpoint `force-static`: built-in preset OR DB lookup → `generateThemeRegistryItemFromStyles` → validação `registryItemSchema` → JSON         |
| `utils/registry/themes.ts`          | 160 | Conversor: `ThemeStyles` → `registryItem` payload format (`registry:style` type, `cssVars.theme/light/dark`, shadows gerados por `getShadowMap`)       |
| `utils/registry/v0.ts`              | 400 | Gerador de 3 arquivos: `globals.css` (Tailwind v4 com `@theme inline`), `layout.tsx` (Next.js com Google Fonts import), `page.tsx` (color swatch demo) |
| `utils/registry/tailwind-colors.ts` | 314 | Mapa de cores Tailwind utility → hex (usado pelo código de registry, não pelo endpoint principal)                                                      |

**Total: ~943 LOC de registry utilities.**

### 4.2 Payload format — `registry:style` vs `registry:theme`

**Detalhe crítico descoberto neste audit:** TweakCN usa `type: "registry:style"`, NÃO `type: "registry:theme"`. Ambos são suportados pelo shadcn schema, mas têm comportamento diferente:

- `registry:style` → aplica como estilo global (modifica `globals.css`, inclui `css` block pra `@layer base`)
- `registry:theme` → aplica como tema CSS vars apenas (`cssVars` sem `css` block)

TweakCN usa `registry:style` + um bloco `css: { "@layer base": { body: { "letter-spacing": "var(--tracking-normal)" } } }`. Nossa adaptação deve usar o mesmo tipo para compatibilidade máxima com `shadcn add`.

**Estrutura completa do payload:**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "<themeName>",
  "type": "registry:style",
  "css": {
    "@layer base": {
      "body": { "letter-spacing": "var(--tracking-normal)" }
    }
  },
  "cssVars": {
    "theme": {
      "font-sans": "...",
      "font-mono": "...",
      "font-serif": "...",
      "radius": "...",
      "tracking-tighter": "calc(var(--tracking-normal) - 0.05em)",
      "tracking-tight": "calc(var(--tracking-normal) - 0.025em)",
      "tracking-wide": "calc(var(--tracking-normal) + 0.025em)",
      "tracking-wider": "calc(var(--tracking-normal) + 0.05em)",
      "tracking-widest": "calc(var(--tracking-normal) + 0.1em)"
    },
    "light": {
      "background": "oklch(...)",
      "foreground": "oklch(...)",
      "...": "...",
      "shadow-2xs": "...",
      "shadow-xs": "...",
      "shadow-sm": "...",
      "shadow": "...",
      "shadow-md": "...",
      "shadow-lg": "...",
      "shadow-xl": "...",
      "shadow-2xl": "...",
      "tracking-normal": "0em",
      "spacing": "0.25rem"
    },
    "dark": {
      "background": "oklch(...)",
      "...": "...",
      "shadow-2xs": "...",
      "shadow-xs": "...",
      "shadow-sm": "...",
      "shadow": "...",
      "shadow-md": "...",
      "shadow-lg": "...",
      "shadow-xl": "...",
      "shadow-2xl": "..."
    }
  }
}
```

**Observações:**

- Shadows são expandidos de 6 primitivas → 8 níveis via `getShadowMap()` ANTES de entrar no payload
- `tracking-normal` é mapeado de `letter-spacing` (renaming)
- `spacing` só vai em `light`, não em `dark`
- Cores são convertidas pra OKLCH via `colorFormatter(color, "oklch")`

### 4.3 Como `shadcn add <URL>` consome

```bash
pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/<id>
```

O CLI shadcn faz GET na URL, parseia o `registryItem` JSON, e aplica:

1. `cssVars.theme` → `@theme { ... }` em `globals.css` (Tailwind v4 inline)
2. `cssVars.light` → `:root { ... }` em `globals.css`
3. `cssVars.dark` → `.dark { ... }` em `globals.css`
4. `css` blocks → injetados em `globals.css`

Nosso endpoint `/api/r/themes/[tenantId]/[version]` produz o mesmo formato → compatível com `shadcn add` para developers que querem inspecionar o tema de um tenant em suas próprias ferramentas dev.

### 4.4 v0 payload — `utils/registry/v0.ts`

O payload v0 não é um `registryItem` shadcn — é um objeto `V0RegistryPayload` com `files[]` contendo conteúdo de arquivo completo (globals.css + layout.tsx + page.tsx). É consumido pelo v0.dev para gerar um projeto starter. NÃO é consumido pelo `shadcn add` CLI.

Cross-link com decisão H.1 do research-38: **v0 demoted** — endpoint `/r/v0/[id]` é útil como export pra devs gerarem um starter project, mas não é usado em nosso runtime. Nossa adaptação: endpoint `/api/r/themes/[tenantId]/v0` opcional, production de `V0RegistryPayload` apenas quando tenant tem `theme_export` entitlement.

### 4.5 Tabela de decisão Parte 3

| Arquivo TweakCN                     | LOC | Decisão                                                                                                                      | Destino nosso                                    | Esforço            |
| ----------------------------------- | --- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------------------ |
| `app/r/themes/[id]/route.ts`        | 69  | **ADAPT** — built-in lookup → `tenant_theme_versions` lookup; força-static → dinâmico c/ RLS check; CORS `*` → condicional   | `app/api/r/themes/[tenantId]/[version]/route.ts` | 2h                 |
| `utils/registry/themes.ts`          | 160 | **ADAPT** — `generateThemeRegistryItemFromStyles` reutilizável; adicionar `tracking-normal` rename e shadow expand           | `lib/design/registry/generate-registry-item.ts`  | 2h                 |
| `utils/registry/v0.ts`              | 400 | **DEFER** — `generateV0GlobalsCss/LayoutTsx/PageTsx` úteis pra export opcional; adiar até `theme_export` entitlement existir | —                                                | 3h (quando ativar) |
| `utils/registry/tailwind-colors.ts` | 314 | **SKIP** — mapa de cores Tailwind utility não usado no nosso pipeline                                                        | —                                                | —                  |
| `utils/shadows.ts`                  | 75  | **EXTRACT** — `getShadowMap()` algoritmo gerador 6→8 níveis; necessário pra registry + preview                               | `lib/design/shadows.ts`                          | 1h                 |
| `utils/color-converter.ts`          | 48  | **EXTRACT** — `colorFormatter()` via culori; já parcialmente presente em nosso lib                                           | `lib/design/color-converter.ts`                  | 0.5h               |

**Esforço total estimado Fase 7: 12h**

Breakdown: registry endpoint (2h) + `generate-registry-item.ts` (2h) + `getShadowMap()` extract (1h) + `colorFormatter` extract (0.5h) + ADR-0045 cravar decisions S7.5 registry strategy (3h) + migration `tenant_pages`/`tenant_blocks` (3h) + entitlement flag `v0_generation` (0.5h).

**Bloqueadores identificados Fase 7:**

- ADR-0045 registry strategy (S7.5) deve ser cravado ANTES da migration `tenant_pages/blocks`. O schema da migration depende da decisão (c) registry restrito vs (d) híbrido JIT.
- `type: "registry:style"` vs `"registry:theme"` — confirmar com shadcn docs qual impacto em `shadcn add` antes de subir endpoint. TweakCN usa `registry:style`; pesquisa-40 deve confirmar se `registry:theme` seria mais adequado pra nosso caso (CSS vars only, sem `@layer base`).

---

## 5. Parte 4 — Síntese cross-fases

### 5.1 Arquivos que servem 2+ fases

| Arquivo TweakCN                                                    | Fases                                                                                          | Observação                                                                            |
| ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `utils/shadows.ts` (`getShadowMap`)                                | Fase 5 (preview live) + Fase 7 (registry payload)                                              | Extrair em `lib/design/shadows.ts` dia 0 da Fase 5                                    |
| `utils/color-converter.ts` (`colorFormatter`)                      | Fase 5 (contrast checker, color picker) + Fase 6 (OKLCH conversion) + Fase 7 (registry colors) | Extrair em `lib/design/color-converter.ts` dia 0 da Fase 5                            |
| `types/theme.ts` (`themeStylePropsSchema`)                         | Fase 5 (form schema) + Fase 6 (structured output schema AI) + Fase 7 (registry item conversão) | Já temos equivalente em `lib/contracts/theme.ts` — confirmar paridade antes da Fase 5 |
| `lib/ai/prompts.ts` (`GENERATE_THEME_SYSTEM`)                      | Fase 5 (chat UI stub que chama Fase 6) + Fase 6 (implementação real)                           | Fase 5 cria endpoint stub; Fase 6 ativa com prompt real                               |
| `utils/registry/themes.ts` (`generateThemeRegistryItemFromStyles`) | Fase 5 (code-panel export) + Fase 7 (registry endpoint)                                        | Mesma função. Extrair logo na Fase 5 para reuso imediato no code-panel                |

### 5.2 Conflitos de adaptação

1. **Zustand undo/redo vs RHF**: O `editor-store.ts` tem lógica sofisticada de history com debounce de 500ms e `MAX_HISTORY_COUNT=30`. RHF não tem undo/redo nativo. O `useReducer` pattern pra history precisa de integração cuidadosa com `useForm.reset()`. **Risco médio-alto** — estimativa conservadora de 8h (vs 4h se fosse Zustand simples).

2. **`apply-theme.ts` DOM mutation vs `<style>` inline**: TweakCN aplica CSS vars diretamente no `document.documentElement` em tempo real. Nossa abordagem usa `<style>` tag inline no preview panel. Comportamento idêntico do ponto de vista do usuário, mas a implementação é diferente. **Nenhum conflito real** — apenas diferença de approach.

3. **Gemini 3 Flash Preview disponibilidade**: O modelo `gemini-3-flash-preview` pode não estar disponível no Vercel AI Gateway. Research-35 (S6.1) precisa confirmar. Fallback: usar `gemini-2.5-flash` para theme generation também — impacto: temas ligeiramente menos criativos mas plenamente funcionais.

4. **`registry:style` vs `registry:theme` type**: Pequena diferença no payload que pode afetar como `shadcn add` processa. Research-40 deve resolver antes de subir o endpoint Fase 7.

5. **APCA gate pós-AI**: Rejeitar output AI por falha APCA pode frustrar o usuário se acontecer frequentemente. Mitigação: mostrar aviso "contraste ajustado automaticamente" em vez de rejeição dura + re-prompt silencioso com constraint explícita.

### 5.3 Sequenciamento ótimo Fases 5 → 6 → 7

**Sequenciamento recomendado:**

```
[Paralelo, dia 0 Fase 5]
  → Extrair utils compartilhados:
      lib/design/shadows.ts (getShadowMap)
      lib/design/color-converter.ts (colorFormatter)
      lib/design/registry/generate-registry-item.ts (generateThemeRegistryItemFromStyles)
  → Instalar Storybook 10

[Fase 5, semana 1]
  → REWRITE use-theme-form.ts (Zustand → RHF + useReducer history)
  → ADAPT editor.tsx shell + admin-shell.tsx
  → COPY/ADAPT controles simples: colors-tab, color-picker, slider-with-input, shadow-control

[Fase 5, semana 2]
  → ADAPT theme-control-panel.tsx
  → ADAPT hsl-adjustment-controls (+ culori puro, sem Zustand checkpoint)
  → ADAPT contrast-checker (WCAG → APCA Silver)
  → ADAPT code-panel (Zustand prefs → useState; registry URL → nosso endpoint)
  → COPY font-picker + Google Fonts route
  → ADAPT theme-preset-select

[Gate: Fase 5 concluída → Fase 6 desbloqueada]

[Fase 6, semana 3]
  → Setup Vercel AI Gateway + confirmar modelos disponíveis (S6.1)
  → Adaptar prompt GENERATE_THEME_SYSTEM + criar lib/ai/theme-generation-prompt.ts
  → Endpoint POST /api/admin/theme-studio/generate (rate-limit + entitlement + streamText + streamObject)
  → APCA gate pós-output
  → Chat UI minimalista (textarea, sem TipTap)

[Fase 6, semana 4]
  → Image upload + multimodal
  → Versionamento AI (source='ai-generated' metadata)

[Gate: Fase 7 pode iniciar em paralelo com Fase 6 semana 3+]

[Fase 7, semana 3-4]
  → ADR-0045 cravar registry strategy (S7.5)
  → Migration tenant_pages + tenant_blocks (dependente de ADR-0045)
  → Endpoint /api/r/themes/[tenantId]/[version] (usa generate-registry-item.ts de Fase 5)
  → Entitlement flag v0_generation
```

**Pode paralelizar:** Fase 7 registry endpoint + ADR-0045 pode rodar em paralelo com Fase 6 AI endpoint (semanas 3-4). São features independentes.

**Não pode paralelizar:** Fase 6 chat UI depende do endpoint de Fase 6. Fase 5 controles dependem do store rewrite.

### 5.4 Esforços totais consolidados

| Fase                 | Esforço revisado | Delta vs estimativa do plano                                                   |
| -------------------- | ---------------- | ------------------------------------------------------------------------------ |
| Fase 5 Builder UI    | **34h**          | Plano: 30-42h → centro da estimativa, OK                                       |
| Fase 6 AI generation | **25h**          | Plano: 9-14h execução + 5h estudos = 14-19h → **+6h** vs teto do plano         |
| Fase 7 v0/registry   | **12h**          | Plano: 8-12h execução + 6.5h estudos = 14.5-18.5h → **-2.5h** vs piso do plano |
| **Total**            | **71h**          | Plano: 65-79h → dentro do range total                                          |

O delta de +6h da Fase 6 é absorvido pela folga da Fase 7. Estimativa total permanece dentro do range planejado.

---

## 6. Referências

- `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`) — fonte primária deste audit
- `docs/research/28-tweakcn-evaluation.md` — avaliação inicial (anatomia, comparação)
- `docs/research/38-registry-novel-ai-integration.md` — decisões registry/v0/Novel
- `docs/plans/pivot-tweakcn.md` §§ 6, 7, 8 — plano de execução das fases
- ADR-0044 — pivot TweakCN-way (decisão arquitetural)
- `.claude/rules/shadcn-zone.md` — quarentena components/ui
- `.claude/rules/contrast.md` — APCA Silver dual-gate
- Apache-2.0 § 4 — atribuição obrigatória ao copiar (NOTICE.md necessário)

**Arquivos TweakCN lidos neste audit:**
`editor.tsx`, `store/editor-store.ts`, `theme-control-panel.tsx`, `colors-tab-content.tsx`,
`color-picker.tsx`, `color-selector-popover.tsx`, `hsl-adjustment-controls.tsx`, `hsl-preset-button.tsx`,
`contrast-checker.tsx`, `shadow-control.tsx`, `slider-with-input.tsx`, `font-picker.tsx`,
`theme-font-select.tsx`, `theme-preset-select.tsx`, `code-panel.tsx`, `code-panel-dialog.tsx`,
`control-section.tsx`, `theme-save-dialog.tsx`, `share-dialog.tsx`, `custom-textarea.tsx`,
`mention-suggestion.ts`, `mention-list.tsx`, `section-context.tsx`,
`action-bar/action-bar.tsx` (+ todos os 12 subcomponentes),
`ai/chat-interface.tsx`, `ai/chat-input.tsx` (+ todos os 17 subcomponentes),
`theme-preview/color-preview.tsx`, `theme-preview/components-showcase.tsx`,
`theme-preview/examples-preview-container.tsx`, `theme-preview/tabs-trigger-pill.tsx`,
`theme-preview-panel.tsx`, `editor-store.ts`,
`lib/ai/prompts.ts`, `lib/ai/providers.ts`, `lib/ai/generate-theme/index.ts`,
`lib/ai/generate-theme/tools.ts`, `app/api/generate-theme/route.ts`,
`app/r/themes/[id]/route.ts`,
`utils/registry/themes.ts`, `utils/registry/v0.ts`, `utils/registry/tailwind-colors.ts`,
`utils/apply-theme.ts`, `utils/shadows.ts`, `utils/color-converter.ts`,
`hooks/use-theme-preset-from-url.ts`, `hooks/use-controls-tab-from-url.ts`,
`hooks/use-chat-context.tsx`, `hooks/use-ai-theme-generation-core.ts`,
`types/theme.ts`

**Total: ~55 arquivos lidos + contagens LOC via `wc -l`.**
