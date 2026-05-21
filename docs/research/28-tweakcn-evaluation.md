# 28 — TweakCN evaluation (vs nosso engine multi-tenant)

> Pesquisa profunda. Fontes: GitHub repo `jnsahaj/tweakcn` (Apache-2.0, ~9.9k stars, 631 forks, criado 2025-03-13, último push 2026-05-19), `tweakcn.com`, code de `db/schema.ts`, `types/theme.ts`, `config/theme.ts`, `lib/ai/prompts.ts`, `lib/ai/providers.ts`, `app/api/generate-theme/route.ts`, `app/r/themes/[id]/route.ts`, `components/editor/*`. Última atualização: 2026-05-21.

---

## 1. Resumo executivo (TL;DR)

TweakCN é um **editor visual single-user** de tema shadcn/ui que produz exatamente **41 CSS variables flat** (28 cores + fontes + 1 radius + 6 shadow primitives + letter-spacing + spacing) — o mesmo schema canônico do shadcn new-york. Tem AI generation (Gemini 2.5/3 Flash), image-to-theme, contrast checker WCAG (não APCA), HSL adjustments globais, shadcn registry export, e um MCP server consumindo `https://tweakcn.com/r/themes/registry.json` via `shadcn@canary registry:mcp`. **Não tem conceito de "archetype" (bundle estrutural), nem tipografia multi-slot, nem Provider Mode / multi-tenancy, nem APCA, nem versionamento, nem image-to-palette de imagem própria do tenant (só LLM analisa).** Não dá pra embarcar diretamente: é app monolítico Next 15 + better-auth + Drizzle/Neon + Polar checkout. Vale como **referência de UX** (especialmente AI prompt + HSL adjustments globais + contrast checker visual + registry export), não como builder embarcado.

## 2. O que é TweakCN

Aplicativo web open-source (Apache-2.0) criado por Sahaj Jain (`jnsahaj`) em março/2025. Stack: Next 15.4 + Turbopack, React 19, Tailwind v4, shadcn/ui + Radix + base-ui-components, Zustand 5, TanStack Query, Drizzle ORM + Neon Postgres, better-auth (Google/GitHub OAuth) + OAuth 2.0 server próprio (PKCE), Vercel KV (rate limit), Upstash Ratelimit, Polar.sh para subscriptions Pro, PostHog, Vercel OG. AI via `@ai-sdk/google` (Gemini 2.5 Flash base + `gemini-3-flash-preview` para theme generation) com Vercel AI SDK 5. Hospedado em `tweakcn.com` no Vercel OSS Program. 1 dev principal + comunidade (631 forks). Sources: [repo](https://github.com/jnsahaj/tweakcn), `package.json`, `lib/ai/providers.ts`.

## 3. Modelo de domínio (vocabulário + groupings)

O schema é **shadcn-canonical, flat, 41 propriedades**, definido em `types/theme.ts` (Zod). Cada theme persiste como `{light: ThemeStyleProps, dark: ThemeStyleProps}` no JSONB `theme.styles` (Drizzle).

**Cores (28 tokens, todos pareados base/foreground exceto border/input/ring/chart-N):**
`background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring`, `chart-1..5`, `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`.

**Fontes (3 slots):** `font-sans`, `font-serif`, `font-mono`. String CSS direta com generic fallback ("Inter, sans-serif"). Sem display/accent/eyebrow slots, sem letter-spacing por slot, sem font-size scale, sem line-height tokens. `letter-spacing` é UM token global.

**Radius (1):** `radius` (rem). Compound (sm/md/lg) é derivado em CSS pelo template do shadcn, não modelado.

**Shadow (6 primitives + 1 color):** `shadow-color`, `shadow-opacity`, `shadow-blur`, `shadow-spread`, `shadow-offset-x`, `shadow-offset-y`. Gera 8 níveis (`shadow-2xs`/`xs`/`sm`/`md`/`lg`/`xl`/`2xl`) algoritmicamente em `utils/shadows.ts` via `secondLayer()` que monta multiplica opacidade — **é um sistema gerador, não 5 tokens livres como Vercel**.

**Spacing (1):** `spacing` (rem, opcional — algumas presets omitem).

**Motion/animation:** **(não encontrei)**. Zero tokens de duration/easing/transition.

**Dark mode:** **objetos separados** `{light, dark}` — não derivação OKLCH lightness. `COMMON_STYLES` (fontes, radius, shadows, letter-spacing, spacing) são compartilhados light↔dark; cores são duplicadas. Toggle via `next-themes`.

**Color format:** valores armazenados como string livre. Code panel exporta em HEX/HSL/OKLCH/RGB (preference store `usePreferencesStore.colorFormat`). Defaults em `config/theme.ts` usam OKLCH (`oklch(0.205 0 0)`). Presets em `utils/theme-presets.ts` usam HEX. Conversão via `culori`.

**Contrast:** `utils/contrast-checker.ts` usa `culori.wcagLuminance()` e calcula **WCAG ratio (>=4.5 = pass)**. Não APCA, não Silver/Bronze. `components/editor/contrast-checker.tsx` mostra todos os pares base/foreground com badge pass/fail.

## 4. Builder UI/UX

Editor em `/editor/theme` (acesso público; login só pra salvar). Layout: painel de controles (esquerda) + preview (direita) + code panel (modal).

**Tabs do painel** (`components/editor/theme-control-panel.tsx`): Colors · Typography · Other · Generate (AI chat).

**Colors tab:** lista todos os 28 tokens com color picker (`color-picker.tsx`) — input text + native `<input type="color">` + `color-selector-popover`. Suporta HEX/HSL/OKLCH/RGB no input. **HSL adjustment controls globais** (`hsl-adjustment-controls.tsx`) com 3 sliders (hueShift -180..+180, saturationScale, lightnessScale) + presets cravados: Hue ±60°/±120°/Invert, Grayscale/Muted/Vibrant, Dimmer/Brighter, e combos.

**Typography tab:** font picker (`font-picker.tsx` + `theme-font-select.tsx`) consumindo `app/api/google-fonts/route.ts` (carrega Google Fonts dynamic). 3 sliders (sans/serif/mono) + letter-spacing global.

**Other tab:** radius slider, shadow controls (`shadow-control.tsx` — 6 sliders + color picker), spacing slider.

**Generate tab:** AI chat interface (`components/editor/ai/chat-interface.tsx`) com TipTap rich text editor, mentions (`@[theme_name]` referencia preset existente), image upload (`drag-and-drop-image-uploader.tsx` + `image-uploader.tsx`), enhance-prompt button, suggested pill actions. Stream via Vercel AI SDK `useChat`. Image-to-theme: LLM analisa imagem e extrai cores/mood/radius/fonts. **Não pixel-extraction de palette** — análise visual via Gemini multimodal.

**Preview:** componentes shadcn live (`components/editor/theme-preview/`) — Cards, Forms, Tables, Dashboard mockup, Music player, etc.

**Preset gallery:** 23 presets built-in em `utils/theme-presets.ts` (modern-minimal, violet-bloom, mocha-mousse, amethyst-haze, kodama-grove, cosmic-night, quantum-rose, bold-tech, elegant-luxury, amber-minimal, neo-brutalism, solar-dusk, pastel-dreams, clean-slate, ocean-breeze, retro-arcade, midnight-bloom, northern-lights, vintage-paper, sunset-horizon, starry-night, soft-pop, sage-garden). Comunidade pública via `community_theme` table com tags + likes (`db/schema.ts`).

**Cloud save:** requer login (Google/GitHub). Theme persiste em `theme` table; `community_theme` torna público. **Sem versionamento** (não há `theme_version` table; UPDATE direto).

**Export options (`code-panel.tsx`):**

- CSS (Tailwind v3 ou v4 — toggle global)
- shadcn registry command (`pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/<id>`)
- v0.dev registry payload (`/r/v0/[id]`)
- Copy/share link
- Export to Figma (modal CTA para Shadcncraft — Figma kit pago de terceiro, não plugin oficial)

**Login-gated:** salvar/publicar/community + AI quota Pro. Editor base + presets + export CSS são free.

## 5. Distribuição / integração

- **shadcn registry endpoint:** `/r/themes/[id]/route.ts` retorna `registryItem` validado contra `shadcn/schema`. Public, CORS `*`, `force-static`. Built-in presets + user themes (DB lookup).
- **v0.dev registry:** `/r/v0/[id]/route.ts` payload separado.
- **MCP setup:** **NÃO é um MCP server próprio.** É instrução pro usuário configurar Cursor/Windsurf com `shadcn@canary registry:mcp` apontando para `REGISTRY_URL=https://tweakcn.com/r/themes/registry.json`. Ou seja: TweakCN expõe registry estático, e o MCP server é o do próprio shadcn CLI. Source: `components/editor/action-bar/components/mcp-dialog.tsx`.
- **OAuth 2.0 server próprio:** schema `oauth_app`/`oauth_authorization_code`/`oauth_token` + `/oauth/*` + `/api/v1/themes` com `requireAuth(req, "themes:read")`. Permite apps externas ler themes do usuário (scopes). **Esta é a peça mais valiosa pra integração: dá pra autorizar nosso admin e puxar themes salvos do usuário.**
- **API REST:** `/api/v1/themes` (GET lista themes do user autenticado), `/api/v1/themes/[themeId]`.
- **Figma:** NÃO há plugin Figma próprio. `app/figma/` é landing page promovendo Shadcncraft (kit Figma de terceiro afiliado `?atp=tweakcn`).
- **npm package:** **(não encontrei)** — não publicado como lib.
- **VS Code extension:** **(não encontrei)**.
- **Storybook addon:** **(não encontrei)**.
- **Embed/iframe:** sem `X-Frame-Options` documentado, mas SPA pesado com auth global em `middleware.ts` (redireciona unauth pra login em `/editor/theme/:themeId`, `/dashboard`, `/settings/*`, `/success`). Editor público `/editor/theme` é embeddable em iframe **(inferido)** mas sem postMessage API documentada — qualquer integração seria scraping.
- **Provider Mode / multi-tenant SaaS:** **NÃO existe.** Schema é single-tenant (`user_id` FK direto em `theme`). Sem `tenant_id`, sem branding white-label, sem sub-domain por cliente.

## 6. Código-fonte (estrutura relevante)

```
app/
  (auth)/                    better-auth pages
  editor/theme/              página do editor SPA Zustand
  api/
    generate-theme/route.ts  POST stream AI (Gemini, rate-limited 5/60s, Polar subscription gate)
    enhance-prompt/          POST melhora prompt user
    google-fonts/            GET lista Google Fonts
    v1/themes/[themeId]/     OAuth-protected REST API
    oauth/                   OAuth 2.0 endpoints (token, authorize, revoke)
    subscription/            Polar.sh webhooks
  r/
    themes/[id]/route.ts     shadcn registry endpoint
    v0/[id]/route.ts         v0.dev payload endpoint
  community/                 página com themes publicados (likes, tags)
db/schema.ts                 Drizzle (user, theme, ai_usage, subscription, oauth_*, community_theme, theme_like)
types/theme.ts               Zod schemas SSOT (themeStylePropsSchema, themeStylesSchema)
config/theme.ts              defaults light/dark + COMMON_STYLES
lib/ai/prompts.ts            system prompt detalhado (Color Harmony, Font Pairing, Mode-Aware Shadows, Letter Spacing & Radius Commitment, Design Coherence)
lib/ai/generate-theme/tools.ts  AI tool `generateTheme` com streamObject
utils/theme-presets.ts       114KB — 23 presets built-in
utils/shadows.ts             gerador algoritmico shadow-2xs..2xl a partir de 6 tokens base
utils/contrast-checker.ts    WCAG ratio via culori.wcagLuminance
components/editor/           todos os controles (color/font/shadow/HSL)
store/editor-store.ts        Zustand global state
```

Licença **Apache-2.0** (permite fork comercial com atribuição). Sem CLA. Banco produção é Neon Postgres; pra rodar local precisa `DATABASE_URL`, `GOOGLE_API_KEY`, OAuth secrets, Polar tokens, Vercel KV.

## 7. Comparação direta

| Dimensão                                                           | Nosso engine                                                                                                | TweakCN                                                                                                 | Vencedor | Por que                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | -------- | ---------------------------------------------------------------- |
| **Multi-tenant runtime**                                           | Sim — `tenants.archetype_id+palette_id+font_id`, RLS, `data-archetype/palette/theme` selectors, 770+ combos | Single-user — `theme.user_id` FK                                                                        | Nosso    | TweakCN não foi desenhado pra Provider Mode                      |
| **Builder UI visual**                                              | Não                                                                                                         | Sim — 4 tabs, sliders, color picker, HSL global, preview live                                           | TweakCN  | Nosso engine só tem injeção runtime, falta UI de edição          |
| **Archetype concept (bundle estrutural)**                          | Sim — 22 archetypes acoplam cor+tipografia+radius+shadow+motion+spacing                                     | Não — só palette/font swap independentes; presets são tuplas de tokens isolados                         | Nosso    | TweakCN trata theme como flat bag-of-tokens, não bundle          |
| **OKLCH**                                                          | Sim, native em todos roles                                                                                  | Sim em defaults, mas exporta em HEX/HSL/OKLCH/RGB conforme preferência                                  | Empate   | Ambos suportam; TweakCN mais flexível na saída                   |
| **Semantic roles (28 canônicos)**                                  | Sim — `--role-text-emphasis`, `--role-surface-container`, etc                                               | Sim — mas é o canônico shadcn (`--primary`, `--background`, sidebar-_, chart-_), não nossos 28 semantic | Nosso    | TweakCN segue só shadcn canonical; nossos 28 são abstração extra |
| **Typography multi-slot (5 slots)**                                | Sim — display/body/mono/accent/eyebrow                                                                      | 3 slots — sans/serif/mono apenas                                                                        | Nosso    | TweakCN limitado                                                 |
| **Shadow Vercel 5-level**                                          | Sim — `--shadow-elevation-{0..4}` semantic                                                                  | 6 primitives geradores + 8 níveis algorítmicos `shadow-2xs..2xl`                                        | Empate   | Abordagens diferentes; TweakCN é gerador, nosso é nomeado        |
| **Motion tokens**                                                  | Sim — por archetype                                                                                         | **Não tem**                                                                                             | Nosso    | Lacuna óbvia no TweakCN                                          |
| **APCA Silver**                                                    | Sim — gate em prebuild                                                                                      | **Não — só WCAG ratio**                                                                                 | Nosso    | TweakCN não atende padrão moderno                                |
| **Versionamento**                                                  | Sim — cache por combo, audit trail                                                                          | Não — UPDATE in place                                                                                   | Nosso    | TweakCN perde histórico                                          |
| **AI prompt-to-theme**                                             | Não                                                                                                         | Sim — Gemini 3 Flash Preview, system prompt sofisticado                                                 | TweakCN  | Implementation-ready feature                                     |
| **Image-to-theme**                                                 | Não                                                                                                         | Sim — análise LLM multimodal (não pixel extraction)                                                     | TweakCN  | Ganha de longe                                                   |
| **Native aliases (e.g. `--stripe-mesh-1..4`)**                     | Sim                                                                                                         | Não — schema fixo                                                                                       | Nosso    | TweakCN não suporta tokens custom                                |
| **shadcn registry export**                                         | Não                                                                                                         | Sim — `/r/themes/[id]` + v0                                                                             | TweakCN  | Nice-to-have, fácil de copiar                                    |
| **Contrast checker visual**                                        | Não (só lint)                                                                                               | Sim — UI de pares com pass/fail                                                                         | TweakCN  | UX vence aqui                                                    |
| **HSL adjustments globais (hue/sat/light) com presets**            | Não                                                                                                         | Sim — slider trio + 10+ presets                                                                         | TweakCN  | Atalho excelente pra remixar paleta                              |
| **Code export multi-formato (HEX/HSL/OKLCH/RGB + Tailwind v3/v4)** | Geração inline RSC                                                                                          | Sim, toggle preferência                                                                                 | TweakCN  | Boa UX de saída                                                  |
| **Cloud sync + community**                                         | Não (tenants têm próprio DB)                                                                                | Sim — community_theme + likes                                                                           | N/A      | Não aplicável ao nosso modelo B2B                                |
| **OAuth 2.0 server pra apps externas lerem themes**                | Não                                                                                                         | Sim — `themes:read` scope                                                                               | TweakCN  | Interessante pra import direto                                   |
| **MCP server**                                                     | Não                                                                                                         | Não próprio — só guia config do `shadcn@canary registry:mcp` apontando pro registry estático deles      | Empate   | Não há server custom de nenhum lado                              |
| **Vibe-coding / archetype switching**                              | Sim — `tenants.archetype_id` muda bundle inteiro                                                            | Não — usuário edita 41 tokens 1-a-1 ou usa preset                                                       | Nosso    | Conceito archetype é diferencial nosso                           |
| **Provider Mode (multi-tenant SaaS)**                              | Sim                                                                                                         | Não                                                                                                     | Nosso    | Por design                                                       |

## 8. Cenários de adoção

### Cenário A — Embed iframe do tweakcn.com no admin

**Como:** iframe `<iframe src="https://tweakcn.com/editor/theme">` + listener postMessage **(não documentado pelo TweakCN — teria que reverse-engineer ou pedir feature)**. Capturar export CSS e persistir em nosso DB.

**Esforço:** Baixo (~2-3d) se postMessage existir. Alto (~2sem) se precisar scraping/MutationObserver no iframe.
**Pro:** Time-to-market mínimo, sem código.
**Contra:** UX descolada (visual TweakCN), branding deles, sem controle, sem 5 slots de fonte, sem APCA, sem archetype concept, dependência de uptime de terceiro, sem garantia de postMessage estável.
**Veredito:** Inviável — TweakCN não oferece API embed oficial e modelo deles diverge.

### Cenário B — Fork Apache-2.0 + integrar com nosso DB/auth/runtime

**Como:** fork `jnsahaj/tweakcn`, ripa Drizzle/Neon/better-auth/Polar, substitui por Supabase + multi-tenant (adiciona `tenant_id`/`archetype_id`/`palette_id` em `theme`), reescreve `types/theme.ts` pra incluir nossos 28 semantic roles + 5 font slots + motion + APCA + native aliases, replace `code-panel.tsx` pra gerar nosso `generateThemeCSS()` em vez de Tailwind CSS direto.

**Esforço:** Alto (4-6 semanas). 50% do código de UI é reaproveitável; 50% da modelagem precisa rewrite.
**Pro:** UX battle-tested ganha de graça (HSL adjustments, contrast checker, AI chat com TipTap mentions, image upload, preview components, font picker com Google Fonts). Mantém Apache-2.0 com atribuição.
**Contra:** Manter fork divergente. Cada feature deles depois requer cherry-pick. Modelo de domínio deles é fundamentally flat — nosso é estrutural (archetype bundle).
**Veredito:** Médio-bom se o objetivo é builder pro tenant editar fine-grain. Ruim se quiser preservar conceito de archetype como SSOT.

### Cenário C — Inspirar fortemente, engine + builder próprio

**Como:** Continuar nosso engine. Construir builder UI próprio inspirado em TweakCN: layout 2 painéis, color picker stack (text + native + popover), HSL adjustment sliders globais com presets, contrast badge visual por par, AI prompt tab com Vercel AI SDK + Gemini, image-upload, code panel multi-formato. Reusar `culori` pra conversões e `lib/ai/prompts.ts` deles como inspiração (Apache-2.0 permite com atribuição) pra calibrar nosso prompt.

**Esforço:** Médio-alto (3-4 semanas). Mas spread por iterações — começa com colors+presets, adiciona AI depois, adiciona contrast checker visual etc.
**Pro:** Builder casa 100% com nosso modelo (28 roles, 5 font slots, archetype switch, native aliases, APCA). Zero fork drift. Nossa abstração permanece SSOT.
**Contra:** Trabalho. Curva de aprendizado em TipTap (se quisermos mentions de archetype/preset).
**Veredito:** **RECOMENDADO**. É o caminho mais alinhado com plano `design-system.md` (Fase Components 1d). Cada controle do TweakCN é referência implementável em algumas horas.

### Cenário D — Cenário híbrido: usar registry endpoint deles + nosso builder

**Como:** Importar themes públicos da community deles via `https://tweakcn.com/r/themes/<id>` como **seed presets** no nosso DB (one-time pull script). Builder próprio. AI generation própria. Mas catálogo inicial vem da curadoria pública deles.

**Esforço:** Baixo (~2-3d para pipeline de import + mapping de 41 tokens flat → nossos roles + heurística de archetype matching).
**Pro:** Catálogo de 23+ presets já validados visualmente, gratis. Inicial seed cobre verticais (modern-minimal, neo-brutalism, vintage-paper, mocha-mousse).
**Contra:** Mapeamento lossy — eles têm `font-sans` e nós temos display+body+accent+eyebrow, então import precisa duplicar. Atribuição em UI ("imported from tweakcn community").
**Veredito:** **COMPLEMENTAR ao C**. Faz em paralelo: builder próprio (C) + seed presets via import script (D).

## 9. Recomendação final

**C + D combinados.** Continuar engine próprio (multi-tenant, archetype bundle, 28 roles, 5 slots, APCA — nosso modelo é estritamente superior pro use-case B2B white-label) e construir builder UI próprio inspirado fortemente em TweakCN UX. Em paralelo, rodar um one-time import script que pulla as 23 presets públicas deles via `/r/themes/<id>` e mapeia heuristicamente pros nossos archetypes (lossy, mas seed inicial dos tenants).

**Refs concretos pra implementação do builder:**

- HSL adjustments globais → `components/editor/hsl-adjustment-controls.tsx` (~150 linhas, copia-pasta praticamente direto)
- Contrast checker visual → `components/editor/contrast-checker.tsx` + `utils/contrast-checker.ts` (substituir WCAG por APCA com `apca-w3`)
- Color picker stack → `components/editor/color-picker.tsx` + `color-selector-popover.tsx`
- AI prompt system → `lib/ai/prompts.ts` (~80 linhas de prompt curado, excelente baseline; adaptar pra falar de archetype + 28 roles em vez de 28 colors flat)
- Code panel multi-formato → `components/editor/code-panel.tsx` + `lib/utils/color-converter.ts` (via culori)
- Shadow generator algorítmico → `utils/shadows.ts` (interessante, mas conflita com nosso semantic `--shadow-elevation-N`; ignorar)

**Não copiar:**

- Schema flat de 41 tokens — nosso archetype bundle é superior
- Better-auth + Drizzle + Neon — temos Supabase
- Polar.sh — temos próprio billing
- OAuth 2.0 server — over-engineering pro nosso caso (tenants já têm sessão)

**Apache-2.0:** preserve atribuição (NOTICE.md citando `jnsahaj/tweakcn` quando reusarmos prompt/HSL/contrast checker code).

---

**Sources:**

- [github.com/jnsahaj/tweakcn](https://github.com/jnsahaj/tweakcn) (repo)
- [tweakcn.com](https://tweakcn.com) (live app)
- [tweakcn.com/editor/theme](https://tweakcn.com/editor/theme) (editor)
- [TweakCN: Breaking the Shadcn Monoculture (repo-explainer)](https://repo-explainer.com/jnsahaj/tweakcn)
- [TweakCN + ShadCN + MCP (Medium)](https://medium.com/illumination/tweakcn-shadcn-mcp-the-triple-threat-for-themed-ui-at-scale-32e2176fffee)
- [Tailkits review](https://tailkits.com/tools/tweakcn/)
- [daily.dev review 2026](https://app.daily.dev/posts/tweakcn-ultimate-visual-theme-editor-for-shadcn-ui-2026--kih2kpi08)
- Arquivos lidos: `db/schema.ts`, `types/theme.ts`, `config/theme.ts`, `lib/ai/prompts.ts`, `lib/ai/providers.ts`, `lib/ai/generate-theme/tools.ts`, `app/api/generate-theme/route.ts`, `app/r/themes/[id]/route.ts`, `app/r/v0/[id]/route.ts`, `app/api/v1/themes/route.ts`, `components/editor/contrast-checker.tsx`, `components/editor/hsl-adjustment-controls.tsx`, `components/editor/color-picker.tsx`, `components/editor/code-panel.tsx`, `components/editor/action-bar/components/mcp-dialog.tsx`, `components/figma-export-dialog.tsx`, `utils/theme-presets.ts`, `utils/shadows.ts`, `utils/contrast-checker.ts`, `lib/auth.ts`, `lib/figma-constants.ts`, `middleware.ts`, `package.json`
