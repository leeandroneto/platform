# Block-Based Visual Editor Library Evaluation for desafit (Next.js 16 / React 19, 2026)

## Executive Summary

For a fitness PWA SaaS like desafit, where content is fundamentally **structured** (workouts, exercises, sets/reps, rest timers, video embeds, nutrition cards) rather than free-form prose, the field narrows quickly. **The strongest fit is a form-based custom block system on top of dnd-kit for the workout builder; Tiptap 3.x is the safest long-term headless bet for any rich-text surface; BlockNote is the fastest-to-ship Notion-style option (with a commercial-license caveat for AI); Plate.js is the most feature-complete out-of-the-box; Lexical is the most performant but highest custom-build cost; Slate.js standalone and Editor.js are not recommended for a 2026 greenfield build.**

The remainder of this report evaluates each candidate against your criteria, gives a maintenance-vs-stagnant verdict per library, and then assesses the form-based MVP question explicitly.

---

## 1. Tiptap 3.x

**Current version & GitHub activity (last 6 months).** `@tiptap/react` 3.23.x and `@tiptap/starter-kit` 3.22.x (published within days of May 2026). Tiptap 3.0 stabilized in mid-2025 after a two-month beta and has been on a near-weekly release cadence ever since. Roughly **9M+ npm downloads/month**, ~1,500 dependent projects on `@tiptap/react`. GitHub star count is not directly verified in this research but Tiptap is consistently one of the top-2 editor repos on GitHub by stars (community references place it in the high-20Ks; treat this as approximate). Recent release notes through May 2026 show active bug-fix work on the React DragHandle portal, SSR, IME, mobile touch, Markdown serialization, and node-view re-render correctness — clearly a healthy project.

**Bundle size (5 typical blocks).** `@tiptap/core` itself is ~10–15 KB gzip, but the realistic shipped surface includes ProseMirror (`@tiptap/pm`, ~70–90 KB gzip) and StarterKit (paragraph, heading, list, blockquote, code-block ≈ ~30–40 KB gzip). Realistic minimum: **~120–160 KB gzip** before custom node views; adding AI/Drag/Collaboration extensions can push this past 250 KB gzip. (Verify against `@next/bundle-analyzer` before shipping.)

**React 19 / Next.js App Router.** Officially supported. There were teething problems during 3.0 beta (the `fast-deep-equal/es6/react` import-resolution issue under React 19 + bundler module resolution) but these are resolved in current 3.22+. The editor itself must be a Client Component.

**RSC compatibility (partial).** Tiptap 3 introduced a **Static Renderer** that renders JSON content as HTML/Markdown/React components without an editor instance, plus a JSX renderer for `renderHTML`. So **read-only views of saved JSON render in RSC** (great for SEO-friendly workout previews). The interactive editor is client-only; `immediatelyRender: false` must be configured for SSR or it throws in dev / silently returns null in prod. Hydration is dominated by ProseMirror init (~30–80ms on mobile).

**Block support.** Not natively "block-based" in the Notion sense — you build it. Tiptap ships a separate block-editor template and a Pro Drag Handle extension; the community standard is to use BlockNote (Tiptap underneath) if you want blocks out of the box.

**Drag-drop.** Native ProseMirror node drag; Tiptap Pro ships a Drag Handle extension. Recent release notes (3.22) explicitly fixed a regression where the React DragHandle unmounted because the plugin moved its host node — a sign the React-portal layer is still evolving. Cross-block reordering is usually finished with dnd-kit.

**Slash menu.** Via `@tiptap/suggestion` (the mention/slash primitive). Mature, but you build the UI.

**AI.** Tiptap **Content AI** is a paid Tiptap Cloud product. In 2026 the older `AI Suggestion`, `AI Changes`, and `AI Assistant` extensions are being **deprecated in favor of a new AI Toolkit** that is framework-agnostic (Vercel AI SDK, LangChain, OpenAI/Anthropic SDKs, or BYOK). Streaming block insertion is supported. BYOK plus a separately-priced Tiptap AI backend is the licensing pattern.

**Collab.** First-class. `y-tiptap` extends `y-prosemirror` for Yjs; Tiptap also sells Hocuspocus (self-host) and Tiptap Cloud as the server. Liveblocks has a Tiptap binding.

**JSON output.** ProseMirror JSON — strictly typed nested `{ type, attrs, content[], marks[] }`. Postgres `jsonb`-friendly. Schema migrations remain a known sharp edge; "content migrations" are listed on the Tiptap roadmap as future work.

**Performance @ 50+ blocks.** Excellent — ProseMirror is battle-tested at NYT, Atlassian, The Guardian. 50 blocks is trivial.

**Multi-tenant CSS / XSS.** Headless: you provide CSS. Schema-level attribute validation was added in 3.0, which materially reduces XSS from pasted/imported HTML. OKLCH tokens drop in via CSS variables in your themed wrapper.

**TS quality & docs.** Strong types; very good current docs; some Pro/Cloud pages are marketing-y.

**Lock-in / migration.** Low-to-moderate. ProseMirror JSON is a documented open spec; you can move to BlockNote (same JSON shape with minor extensions) easily. Migrating to Lexical or Slate requires writing a per-node transformer.

**Known issues / risks 2025–26.** (a) Floating UI replaced tippy.js in 3.0 (one-time migration cost); (b) React DragHandle portal regressions through 3.20–3.22 (mostly fixed); (c) SSR caveats with bundler `moduleResolution`; (d) Pro/Cloud features paid and pricing has risen; (e) **breaking changes between 2.x → 3.x** required a migration pass for existing apps.

**Maintenance verdict: Very actively maintained.**

---

## 2. Lexical (Meta)

**Current version & GitHub activity (last 6 months).** `lexical` **0.44.0** (Apr 27, 2026); 0.44.1-nightly cut May 4, 2026. **~23.4K stars, ~2.1K forks** on `facebook/lexical`, ~709 dependent npm projects. Extremely active: multiple PRs/week; recent releases include security patches for 2026-era CVEs (yaml, rollup, brace-expansion), a new Extension API, RenderContext, agent example, signals, command priorities, RSC `getServerSnapshot` (#7935), and collaboration-cursor CSS classes (#8271). 0.43 → 0.44 introduced multiple breaking changes (see below).

**Bundle size (5 blocks).** Core is intentionally tiny: ~22 KB min / ~8 KB gzip for `lexical`; `@lexical/react` adds ~10–15 KB gzip; rich-text + history + list + link + a custom block decorator together typically run **~50–80 KB gzip**. Lexical is the **lightest** of the serious options.

**React 19 / Next.js App Router.** React 17+, tested against React 18 and 19. Works with App Router via `"use client"`.

**RSC compatibility (yes, recently improved).** `getServerSnapshot` was added explicitly for RSC compatibility (PR #7935). Read-only HTML can be produced server-side via `@lexical/html` and the new `DOMRenderExtension`. EditorState is JSON-serializable and re-parseable; server-rendered previews are easy.

**Block support (partial / DIY).** Lexical is a **framework**, not a finished editor. The Lexical Playground demonstrates a block-based editor but it is **not a shipped library** — it's reference code in `lexical-playground` you adapt. For a Notion-style block experience you build it (DecoratorNode + plugins) or adopt a wrapper like LexKit.

**Drag-drop.** Not built-in. The Playground has a Draggable Block Plugin you can lift; production reordering is typically dnd-kit.

**Slash menu.** Not built-in; `ComponentPickerMenuPlugin` is an example in the Playground.

**AI.** No first-party AI. A local-LLM agent example was added in #8281; community pattern is Vercel AI SDK streaming into `editor.update()` blocks.

**Collab.** First-class via `@lexical/yjs`. Liveblocks ships a Lexical binding.

**JSON output.** `editor.getEditorState().toJSON()` → clean JSON tree. Postgres `jsonb`-friendly.

**Performance @ 50+ blocks.** Best-in-class. Designed for FB/Messenger/WhatsApp/Instagram scale with a custom DOM reconciler doing skip-the-diff updates.

**Multi-tenant CSS / XSS.** Headless theming via `theme` config maps node types → CSS classes. Pasted HTML is normalized through registered nodes — strong XSS posture if you don't add raw-HTML nodes.

**TS quality & docs.** Strong types; large API surface. Docs are improving but still trail Tiptap and Plate. Playground source is essentially required reading.

**Lock-in / migration.** Moderate. Lexical's tree shape differs from ProseMirror JSON; transformers to Tiptap/Slate require per-node work.

**Known issues / risks 2025–26.** **Pre-1.0 with breaking changes between minor releases** — 0.43 → 0.44 introduced new command priorities, deprecated `OffsetView`, made CodeNode require CodeExtension (back-compat shim with dev warning), and added the DOMRenderExtension. Acceptable for sophisticated teams; risky for set-and-forget.

**Maintenance verdict: Very actively maintained.**

---

## 3. Plate.js ("platejs")

**Current version & GitHub activity (last 6 months).** `platejs` **53.0.3** (within ~8 days of May 2026); `@platejs/ai` 53.0.4 (a day before). Renamed wholesale from `@udecode/plate-*` to `@platejs/*` in the v40 era. The public docs changelog shows roughly **monthly numbered releases through 2025 and into 2026** (most recent on the changelog: April 2026 #30.2, March 2026 #29.4, etc.) with continuous component/plugin updates. **~140,500 weekly npm downloads on `platejs`.** Star count on `udecode/plate` is not directly verified in this research (community references place it in the ~13–15K range; treat as approximate).

**Bundle size.** Plate is plugin-modular, so the number depends on what you import. Slate core (`slate` + `slate-react` + `slate-history`) is ~70–90 KB gzip; adding basic-nodes, headings, list, block-selection, slash, and drag plugins typically reaches **~180–250 KB gzip**. Plate is the **heaviest** of the candidates because Slate's nested model and Plate's plugin/Zustand store both add weight.

**React 19 / Next.js App Router.** First-class. Components ship as `"use client"` shadcn-style files you copy into your repo (`@/components/ui/...`); your server components compose around them.

**RSC compatibility (partial).** A static **PlateView**/**EditorView** component (`@platejs/core/react`) renders saved content to RSC-safe React without instantiating the editor. The interactive editor is client-only.

**Block support (native).** This is Plate's strongest feature for desafit's structured-content use case: BlockSelectionKit, BlockDraggable, BlockMenu, slash-command kit, drag-handle, AIChatPlugin, BlockPlaceholderPlugin, BasicBlocksKit — all dedicated, documented plugins with shadcn UI kits.

**Drag-drop.** **Native via `block-draggable` plugin**, with recent fixes for multi-selection drag and drop positioning on margins. No dnd-kit required for normal reordering.

**Slash menu.** Native (`/`), with a fully shadcn-styled component.

**AI.** Excellent and current. `@platejs/ai` ships `AIChatPlugin` and `AIMenu` with streaming responses inserted directly into the editor, ghost-text autocomplete, MCP support, and Vercel AI SDK integration. The most polished out-of-the-box AI story among the candidates.

**Collab.** Plate ships a Yjs plugin; Liveblocks has an official Plate guide. Slate's `Operation` model maps cleanly to OT/CRDT.

**JSON output.** Slate JSON: `[{ type, children, ...attrs }]` — flat-ish, `jsonb`-friendly, schema-versionable. Plate also ships markdown serializers/deserializers for most plugins.

**Performance @ 50+ blocks.** Good. Slate historically struggled with very large docs; Plate introduced chunking optimizations in `slate-react` (changelog #5988) that help. For desafit workouts (typically 20–60 blocks) this is fine. Tens-of-thousands-of-blocks scale: use Tiptap/Lexical instead.

**Multi-tenant CSS / XSS.** Plate UI is shadcn/Tailwind-based — OKLCH design tokens drop in via `tailwind.config.ts`. XSS posture is good: Slate normalization rejects unknown node types/properties.

**TS quality & docs.** Arguably the best TS of the candidates — full generic editor type `TPlateEditor<MyValue, …>` with explicit element/text interfaces. Docs are extensive (per-plugin pages with copy-paste kits).

**Lock-in / migration.** Moderate-to-high. Output is portable Slate JSON; in-app code is deeply tied to Plate's plugin/Zustand-store API.

**Known issues / risks 2025–26.** (a) The 2025 wholesale rename `@udecode/plate-*` → `@platejs/*` was a major breaking change; (b) ongoing API churn — `editor.api.shouldMergeNodesRemovePrevNode` → `shouldMergeNodes`, `usePlaceholderState` removed, `structuralTypes` removed from `useSelectionFragment`, node type definitions centralized into `@platejs/utils`; (c) heavy bundle; (d) Slate underneath is still pre-1.0.

**Maintenance verdict: Very actively maintained.**

---

## 4. Editor.js (CodeX)

**Current version & GitHub activity (last 6 months).** `@editorjs/editorjs` **2.31.6** (published roughly a month before May 2026). Apache-2.0. ~304 dependent npm projects. Star count on `codex-team/editor.js` not directly verified here (community references put it ~29K; treat as approximate). The CodeX team is still active but **the release cadence is slow** (one minor every few months), there is **still no first-party React component in 2026**, and Editor.js 3.0 (long discussed) has not shipped.

**Bundle size.** Core is small (~50–70 KB gzip). Each tool (Header, List, Paragraph, Quote, Image) is a separate package, ~5–15 KB gzip each. With 5 blocks: **~80–120 KB gzip**.

**React 19 / Next.js App Router (partial).** Editor.js itself is framework-agnostic vanilla JS. React integration requires a community wrapper (`@stfy/react-editor.js`, `react-editor-js`), none of which keep pace with React 19. The pragmatic 2026 path is manual integration via `useEffect` + ref + `dynamic({ ssr: false })`.

**RSC compatibility (no for editor; yes for output).** Editor.js touches `window`/`document` on init — must run client-side. The clean JSON output (`{ time, blocks: [{ type, data }], version }`) renders fine in RSC if you write your own renderer (no canonical one exists).

**Block support (native).** This is the original Notion-style block editor — block-based is its core identity. Each block is its own contenteditable.

**Drag-drop.** Reordering requires the community `editorjs-drag-drop` plugin; not bundled. Quality varies.

**Slash menu.** Not first-party. Community plugins exist; most are not actively maintained.

**AI.** No first-party AI. You'd build streaming insertions by calling `editor.blocks.insert()` from a stream handler.

**Collab.** **Not built in. No official Yjs binding.** This is the single biggest gap.

**JSON output.** **Best-in-class for storage.** Clean `{ type, data }` per block, easy to migrate, `jsonb` ideal.

**Performance @ 50+ blocks.** Fine — each block is its own DOM root.

**Multi-tenant CSS / XSS.** Standard CSS. XSS exposure depends entirely on third-party blocks; many community blocks `innerHTML` user input without sanitizing.

**TS quality & docs.** Types exist; quality varies by plugin. Docs feel dated.

**Lock-in / migration.** Low — the JSON format is the most portable here.

**Known issues / risks 2025–26.** Slow releases; React community is moving to Tiptap/BlockNote/Plate; no official React wrapper; abandonment risk on most third-party blocks.

**Maintenance verdict: Slowly maintained / stagnant relative to peers.** Not recommended for a greenfield 2026 build unless the JSON-storage simplicity is the dominant constraint and you don't need collab/AI.

---

## 5. BlockNote

**Current version & GitHub activity (last 6 months).** `@blocknote/core` and `@blocknote/react` **0.50.0** (3 days before May 2026); `@blocknote/mantine` 0.48.1; `@blocknote/shadcn` 0.46.2. **~9,870 GitHub stars** (verified), 103 PRs since the prior cited milestone, ~131,600 weekly downloads of `@blocknote/mantine`. Release cadence is brisk (every 1–4 weeks). The most recent release line upgraded the AI package to **Vercel AI SDK v6** (from v5). Maintained by TypeCellOS; sponsored by NLNet; partner on the France/Germany/Netherlands "Docs" government project — institutional adoption is real.

**Bundle size.** Higher than Tiptap alone because BlockNote bundles Tiptap + ProseMirror + Mantine (or shadcn) UI + Yjs by default. Published unpacked size of `@blocknote/shadcn` is ~522 KB. Realistic shipped size with 5 blocks: **~250–350 KB gzip**, plus a **known ~192 KB gzip regression** when code blocks are enabled because Shiki's full language set is bundled (open issue #1487, **still open as of early 2025**; workaround: restrict `supportedLanguages` via `customizeCodeBlock`).

**React 19 / Next.js App Router.** Officially supported (React 18 and 19; tested with Next.js 15). Works cleanly under Next.js 16 / React 19. Requires `"use client"`.

**RSC compatibility (partial).** Editor is client-only. `ServerBlockNoteEditor` exists for server-side rendering of static blocks → HTML/React. RSC-safe.

**Block support (native — this is the whole point).** Notion-style blocks out of the box: paragraph, heading, list, quote, code block, image, table, file, video, audio, columns. **Custom blocks** with TS-typed `props` — ideal for fitness-specific blocks like `ExerciseSetBlock` or `RestTimerBlock`.

**Drag-drop.** Native, polished. Side menu with drag handle on hover. Recent fix (#2630) improved scroll-hide behavior.

**Slash menu.** Native, filterable, customizable.

**AI.** **First-class.** The `xl-ai` package uses **Vercel AI SDK v6** in the latest release and ships streaming block insertion, inline edits, proofreading, and chatbot-agent patterns. **Important license note: the XL packages (which include AI) are GPL-3.0 — commercial closed-source SaaS use requires a commercial BlockNote license.** The non-AI core is MPL-2.0 (commercial-friendly).

**Collab.** First-class; real-time multiplayer by default. Yjs built in; Liveblocks and PartyKit documented.

**JSON output.** BlockNote-specific: `[{ id, type, props, content, children }]`. More Notion-like than ProseMirror JSON; `jsonb`-friendly. Internally still a ProseMirror doc — `editor.toProseMirrorJSON()` available.

**Performance @ 50+ blocks.** Good (ProseMirror underneath). The Shiki regression is the main practical issue.

**Multi-tenant CSS / XSS.** Two themed packs: `@blocknote/mantine` and `@blocknote/shadcn`. The shadcn pack drops cleanly into a Tailwind/OKLCH design system; CSS variables for both light/dark. XSS posture inherits ProseMirror's schema validation.

**TS quality & docs.** Excellent TS; custom blocks are fully type-safe. Docs are well-organized and current.

**Lock-in / migration.** Moderate. JSON is portable; the custom-block API is BlockNote-specific. Because it's Tiptap underneath, you can drop into Tiptap APIs when needed.

**Known issues / risks 2025–26.** (a) Shiki bundle bloat (#1487 open); (b) **GPL-3.0 on XL/AI packages → commercial license needed for a closed-source SaaS using AI**; (c) abstraction-on-abstraction (ProseMirror → Tiptap → BlockNote) means deep customization sometimes requires diving through three layers; (d) version is pre-1.0; (e) Vercel AI SDK v5 → v6 dependency bump in the latest line.

**Maintenance verdict: Very actively maintained.**

---

## 6. Slate.js

**Current version & GitHub activity (last 6 months).** `slate` and `slate-react` **0.119.0** (Nov 7, 2025); subsequent point releases include React 19 type fixes (`React.JSX.Element` instead of `JSX.Element`, changelog #5986), strict-mode + chunking fix (#5988), and a Shadow-DOM Android typing crash fix (#5963). Star count not directly verified here (community references put it ~30K; treat as approximate). The repo README explicitly states: **"Slate is currently in beta… There isn't currently a 1.0 release schedule."** Pace has clearly slowed in 2025 vs. 2022–23. Not dead, but stagnating relative to peers — and **still pre-1.0 nine years after launch**.

**React 19 / Next.js App Router.** Yes — explicit React 19 type fixes landed in 2024–25.

**RSC compatibility.** Client-only editor; static renderers for read-only content can run server-side.

**Block support.** None natively — Slate is primitives. You build everything (drag, slash, blocks, AI, collab) yourself. **This is precisely why Plate.js exists.**

**Drag-drop / slash / AI / collab.** All DIY in raw Slate. Yjs has a `slate-yjs` community binding.

**JSON output.** Slate JSON (`{ type, children: [...] }`) — clean, `jsonb`-friendly, schema-versionable.

**Performance @ 50+ blocks.** Acceptable; large-doc performance was the historical weak spot, partially addressed by chunking.

**TS quality & docs.** TS-native. Docs are reasonable but largely unchanged for years.

**Lock-in / migration.** Output is portable. Code is not — Slate's nested-children model is unique.

**Maintenance verdict: Slowing; pre-1.0 indefinitely.** **Do not pick raw Slate for a 2026 greenfield project.** Pick Plate.js, which is Slate + everything you'd build anyway.

---

## 7. Hand-rolled (dnd-kit + custom JSON blocks)

**Effort estimate (realistic).**

- **MVP (5 block types, drag reorder, no rich text inside blocks):** 1–2 engineer-weeks.
- **Production-quality (10+ block types, slash menu, keyboard a11y, undo/redo, mobile touch):** 8–14 engineer-weeks.
- **Feature parity with Tiptap/BlockNote (collab, AI streaming, paste handling, IME, advanced selection):** 9–18 engineer-months. **Don't.**

**dnd-kit status in 2026.** Stable and the de facto choice; **~2.8M weekly npm downloads**, ~15K GitHub stars; React 19 compatible. **Caveat:** community concern (Issue #1194) that after an initial burst, releases slowed and PRs/issues stack up. The library is complete enough that this is acceptable for most use cases, but contributors are anxious. The alternative — Atlassian's `@atlaskit/pragmatic-drag-and-drop` — is smaller (<4 KB) and is what Jira/Confluence/Trello now use; consider it if you want maximum performance and Atlassian backing.

**Bundle size.** dnd-kit core ~6 KB gzip; sortable preset ~3 KB; total often <12 KB gzip. Block components and form fields add the rest. **A pure form-block editor can ship at ~30–50 KB gzip total** — by far the lightest option.

**Undo/redo complexity.** **The hidden killer.** Naive block-JSON snapshot history works for the first month, then breaks on (a) inline text edits inside a block (memory churn unless you debounce/diff), (b) selection restoration across undo/redo, (c) merging consecutive typed characters into one undo unit. Expect **2–4 weeks** for a robust history with selection preservation. Use `zundo` (Zustand middleware) or an immer-based patch history.

**Accessibility effort.** dnd-kit gives you free ARIA live-region announcements and full keyboard support (Space/arrows/Escape) on the sortable layer. But **block-level a11y** — focus management on insert/delete, screen-reader announcements on slash-command insert, focus restoration after undo — is custom work. Budget **1–2 weeks** of dedicated a11y work.

**Other DIY costs typically underestimated:**

- IME composition handling (Asian languages): ~3–5 days.
- Mobile touch drag with auto-scroll: dnd-kit handles, but tuning takes ~1 week.
- Paste sanitization across blocks: ~1 week.
- Server-side static render of saved blocks for SEO/sharing: ~3 days (easy if blocks are pure components).
- Multi-tenant theming with OKLCH tokens: easy — CSS variables per tenant.
- Real-time collab if needed later: Yjs + custom CRDT integration is a 1–3 month effort and high-risk to retrofit.

**Verdict for desafit.** **A hand-rolled form-block system is the _correct_ answer if (1) blocks contain form fields like `sets`, `reps`, `weight`, `restSeconds`, `notes` rather than rich prose, and (2) you don't need real-time collab in v1.** This is true for most fitness apps. See the form-based MVP analysis below.

**Maintenance verdict (for dnd-kit specifically):** Actively maintained but with community concern about cadence; Pragmatic DnD is the de-risking fallback.

---

## Maintenance & Activity Summary (May 2026)

| Library   | Latest version         | Last release | Release cadence (6 mo) | Verdict                              |
| --------- | ---------------------- | ------------ | ---------------------- | ------------------------------------ |
| Tiptap    | `@tiptap/react` 3.23.x | ~2 days      | Weekly                 | **Very active**                      |
| Lexical   | `lexical` 0.44.0       | Apr 27, 2026 | Weekly+                | **Very active**                      |
| Plate.js  | `platejs` 53.0.3       | ~8 days      | Weekly–monthly         | **Very active**                      |
| BlockNote | 0.50.0                 | ~3 days      | 1–4 weeks              | **Very active**                      |
| Editor.js | 2.31.6                 | ~1 month     | Every few months       | **Slow / stagnating**                |
| Slate.js  | 0.119.0                | Nov 2025     | Slowing                | **Pre-1.0 indefinitely; stagnating** |
| dnd-kit   | 6.x                    | (steady)     | Slower than 2022       | Stable; community concern            |

**Major 2025–2026 breaking changes summary:**

- **Tiptap 2.x → 3.x:** Floating UI replaces tippy.js; JSX `renderHTML`; SSR rework; StarterKit expanded.
- **Plate v36–v40 era:** `@udecode/plate-*` packages renamed wholesale to `@platejs/*`; `editor.api` reshuffle; type centralization to `@platejs/utils`.
- **BlockNote latest line:** Vercel AI SDK v5 → v6 dependency upgrade.
- **Lexical 0.43 → 0.44:** new command priorities (BEFORE\_\*); `OffsetView` deprecated; CodeNode requires CodeExtension; DOMRenderExtension introduced; multiple security CVE patches.
- **Slate:** React 19 JSX type rename (0.118+); chunking + strict-mode fix; `slate-dom` peer-dependency bump.

---

## Side-by-Side Comparison Table

| Library     | Version        | Bundle (gzip, 5 blocks) | RSC                             | Blocks         | Drag-drop        | Slash                | AI                          | Collab                  | JSON             | Key risks                                         |
| ----------- | -------------- | ----------------------- | ------------------------------- | -------------- | ---------------- | -------------------- | --------------------------- | ----------------------- | ---------------- | ------------------------------------------------- |
| Tiptap 3.x  | 3.23.x         | ~120–160 KB             | Partial (Static Renderer)       | Plugin/DIY     | Native + dnd-kit | `@tiptap/suggestion` | Paid Pro (AI Toolkit, BYOK) | Yjs/Liveblocks          | ProseMirror JSON | Drag-handle React-portal regressions; Pro pricing |
| Lexical     | 0.44.0         | ~50–80 KB               | Yes (getServerSnapshot)         | DIY            | DIY              | DIY                  | DIY                         | Yjs/Liveblocks          | Lexical JSON     | Pre-1.0 minor-version breaking changes            |
| Plate.js    | platejs 53.0.3 | ~180–250 KB             | Partial (PlateView)             | Native plugins | Native           | Native               | First-class                 | Yjs/Liveblocks          | Slate JSON       | Bundle weight; API churn; Slate pre-1.0           |
| Editor.js   | 2.31.6         | ~80–120 KB              | Client only                     | Native         | Plugin only      | Plugin only          | None first-party            | None first-party        | Editor.js JSON   | Slow releases; no React 19 wrapper; no collab     |
| BlockNote   | 0.50.0         | ~250–350 KB             | Partial (ServerBlockNoteEditor) | Native         | Native           | Native               | First-class (XL = GPL-3.0)  | Yjs/Liveblocks/PartyKit | BlockNote JSON   | Shiki bloat (#1487); GPL on AI XL                 |
| Slate.js    | 0.119.0        | ~70–90 KB               | Client only                     | DIY            | DIY              | DIY                  | DIY                         | Community               | Slate JSON       | Pre-1.0 since 2017; slowing                       |
| Hand-rolled | n/a            | ~30–50 KB               | RSC-native read views           | DIY            | dnd-kit          | DIY                  | DIY                         | DIY                     | Yours            | Undo/redo + a11y are the real cost                |

---

## Form-Based Editing as a Tier-1 MVP Approach

For a fitness PWA where each "block" is a strongly-typed thing (an Exercise has `name`, `sets`, `reps`, `weight`, `tempo`, `restSec`, `notes`; a Cardio block has `mode`, `durationMin`, `targetHR`, `notes`; a Video block has `url`, `caption`), **form-based editing — i.e. a typed React form per block, no contenteditable — is not just viable, it is the recommended tier-1 MVP**. Honest tradeoff analysis follows.

### Why form-based wins for desafit at MVP

1. **Data model is the product.** Coaches and lifters care that "3×8 @ 70 kg, 90s rest" is structured. A rich-text editor encourages free-form typing and you'll spend Tier-2 building parsers to extract structure back. Form fields force structure up front and make analytics, progressions, AI suggestions, and PR tracking trivial.
2. **Bundle and performance.** ~30–50 KB gzip vs. 120–350 KB. On a mobile PWA at the gym on flaky LTE this is the single biggest UX win at MVP.
3. **RSC-native.** No `"use client"` needed for read-only workout views; only the editor route hydrates. With Next.js 16 / React 19, static workout pages ship with zero hydration cost — huge for SEO and share previews.
4. **A11y is much easier.** Standard `<input>`, `<select>`, `<textarea>` get screen-reader semantics for free. The complex a11y burden (selection, IME, focus restoration in contenteditable) disappears.
5. **Multi-tenant safety.** No HTML sanitization, no XSS surface from pasted content. Each field is a typed primitive (number/string/enum). OKLCH theming is trivial CSS variables on form controls.
6. **Drag-drop is the only "editor" feature you need.** dnd-kit handles block reordering and that's it.
7. **Undo/redo via Zustand + zundo** on the top-level blocks array — much simpler than mid-edit text history because every change is a discrete form-field commit.
8. **AI integration is _easier_, not harder.** Streaming a workout from an LLM means streaming structured JSON (Vercel AI SDK `streamObject` with a Zod schema). You append blocks to the array as they arrive. There is no "stream into a ProseMirror node view" complexity to solve.
9. **Postgres `jsonb` from day one.** The blocks array _is_ your storage format. No translation layer.
10. **Collab can be added later** with Yjs `Y.Array` of `Y.Map` blocks; the data model maps cleanly.

### What you give up vs. a full editor

| Capability                                           | Form-based MVP                      | Full block editor      |
| ---------------------------------------------------- | ----------------------------------- | ---------------------- |
| Free-form "Notes" rich text within a block           | Multiline `<textarea>` (plain text) | Inline rich text       |
| Inline AI ghost text inside prose                    | No                                  | Yes (Plate/BlockNote)  |
| Markdown shortcuts (`#` → heading)                   | No                                  | Yes                    |
| Paste from Notion/Google Docs and get usable content | No                                  | Yes (Tiptap/BlockNote) |
| "Coach writes a long narrative program description"  | Cramped                             | Native                 |
| Time to v1 ship                                      | Fastest                             | Slower                 |
| Long-term flexibility                                | Constrained to your schema          | Open                   |

### When to escape to a full editor

Move to BlockNote or Plate when **any** of these become true:

- Coaches demand multiline rich-text formatting (bold/italic/lists) inside the Notes field across many block types.
- You add a "long-form article" content type (blog, exercise encyclopedia) — at which point use Tiptap _just for that route_, not the workout builder.
- You add real-time collab during editing (Yjs is materially easier on top of BlockNote/Plate than retrofitted to a custom store).

### Recommended architecture for desafit

1. **Tier-1 MVP (now):** dnd-kit + Zustand + zundo + a discriminated-union of typed block components (`ExerciseBlock`, `CardioBlock`, `RestBlock`, `NoteBlock`, `MediaBlock`). Persist `blocks: jsonb` in Postgres with a `schemaVersion` column. Read views are pure RSC components.
2. **Tier-2 (when needed):** Replace `NoteBlock` (and only that block) with a minimal Tiptap instance for rich text. Tiptap JSON nests inside the same blocks array. Everything else stays form-based.
3. **Tier-3 (if you become a content/CMS product):** Adopt BlockNote or Plate for the long-form article surface specifically. Keep the workout builder form-based forever — it's the right model for that data.

This staged path gives the fastest MVP, the smallest mobile bundle, the cleanest data, and an unambiguous migration path that doesn't require throwing anything away.

---

## Final Recommendation for desafit

- **Workout builder (the core surface):** **Hand-rolled form-blocks on dnd-kit.** Lowest bundle, best PWA/mobile fit, structured data is a product win, RSC-native read views.
- **Notes / coaching commentary (later):** **Tiptap 3.x**, used in a single component, nested into the block JSON. Headless, MIT, supports the AI Toolkit if you want streaming improvements later.
- **Long-form CMS content (if/when it exists):** **BlockNote** if you want speed-to-ship and accept the commercial license for AI; **Plate.js** if you want maximum control, shadcn-native theming, and don't mind the bundle.
- **Avoid for greenfield in 2026:** raw Slate, Editor.js.
- **Strong but not for this product:** Lexical — superb performance and RSC story, but the framework-not-editor positioning means you'd be building everything BlockNote/Plate already give you.

### Caveats and uncertainties in this research

- Bundle-size numbers are realistic estimates from published unpacked sizes and historical Bundlephobia data; exact gzip totals depend on which extensions/plugins you actually import and tree-shaking effectiveness in Next.js 16's Turbopack/Webpack. Measure with `@next/bundle-analyzer` before committing.
- GitHub star counts: directly verified — **BlockNote ~9,870** and **Lexical ~23.4K**. Star counts for **Tiptap, Plate.js, Editor.js, and Slate.js were not directly observed in this research**; approximate community-cited figures (Tiptap high-20Ks, Plate ~13–15K, Editor.js ~29K, Slate ~30K) are noted but should be re-verified against the live repos if precise numbers matter.
- Lexical and Plate publish multiple times per week; any specific patch-level statement here may be a few versions stale within days.
- The BlockNote Shiki bundle bloat (#1487) was still open as of early 2025; verify status before relying on code blocks in production.
- AI feature offerings (Tiptap Content AI vs. AI Toolkit; BlockNote XL AI; Plate `@platejs/ai`) are evolving fast — license terms and pricing tiers can change. Confirm on each vendor's site before signing.
- dnd-kit's long-term maintenance cadence has community concern (Issue #1194); Atlassian's Pragmatic DnD is the de-risking alternative.
- The Eddyter blog and Velt blog results that appeared in early search snippets are vendor marketing pages with potential bias; the editor-specific facts above were cross-checked against primary sources (npm registry, GitHub releases, official docs) wherever possible.
