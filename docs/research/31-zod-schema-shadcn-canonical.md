# 31 — Schema Zod shadcn-canonical mínimo

> **⚠️ CAVEAT (2026-05-21):** este estudo foi feito ANTES de clonar o repo
> TweakCN local. As decisões aqui são **inferência** via WebFetch +
> research-28. Após clone em `C:\Users\leean\Desktop\tweakcn-ref\` (commit
> `9adabcf9`, branch `main`), **validar contra arquivos reais** antes de
> Fase 1 começar. Schema TweakCN canônico está em `types/theme.ts` (já
> lido — `themeStylePropsSchema` flat 41 keys, monolítico ~78 LOC).
> Conclusões podem precisar refinar.
>
> **Tipo:** research (estudo prévio S1.3 do plano `docs/plans/pivot-tweakcn.md`).
> **Bloqueante de:** Fase 1 §2.1 (reescrita de `lib/design/contract/`).
> **Pré-leitura:** `docs/research/28-tweakcn-evaluation.md` §3 (modelo de domínio TweakCN, 41 tokens flat).
> **Data:** 2026-05-21.

---

## 1. Resumo executivo

TweakCN expressa o tema shadcn-canonical inteiro em **2 schemas Zod** (`themeStylePropsSchema` + `themeStylesSchema`) somando ~75 LOC. Não há sub-schemas pra cor, tipografia, shadow, voice, illustration ou roles — é um **bag-of-tokens flat** com 41 chaves de strings, agrupado em `{ light, dark }`.

Nosso projeto pode replicar essa estrutura quase verbatim com **3 adaptações**: (1) extrair tokens compartilhados light↔dark pra `common` (TweakCN faz isso só em `config/theme.ts` como `COMMON_STYLES` runtime — promovendo pra schema reduz duplicação e força invariante); (2) Zod 4 syntax (`z.object` / `z.string` direto, sem mudanças); (3) deixar `spacing` opcional já que ~30% das presets TweakCN omite.

**Métrica de pivot:** de ~600 LOC distribuídos em 19+ sub-schemas (`roles.ts`, `tokens.ts`, `strategy.ts`, `typography.ts`, `mobile.ts`, `visual.ts`, `voice.ts`, `illustrations.ts` + sub-schemas internos) pra **~80 LOC monolíticos** em `theme.ts`. Redução de **~87%**.

Confiança: **alta** — schema é determinístico (lista exata dos 41 tokens é canônica shadcn) e TweakCN provou o desenho em produção (9.9k stars, 23 presets, 631 forks).

---

## 2. TweakCN `types/theme.ts` (referência verbatim)

Fonte: `https://github.com/jnsahaj/tweakcn/blob/main/types/theme.ts` (commit head `main` 2026-05-19, raw: `https://raw.githubusercontent.com/jnsahaj/tweakcn/main/types/theme.ts`).

```ts
import { theme } from '@/db/schema'
import { InferSelectModel } from 'drizzle-orm'
import { z } from 'zod'

export const themeStylePropsSchema = z.object({
  background: z.string().describe('The default background color, paired with `foreground`.'),
  foreground: z.string().describe('Paired with `background`.'),
  card: z.string().describe('The background color for cards, paired with `card-foreground`.'),
  'card-foreground': z.string().describe('Paired with `card`.'),
  popover: z
    .string()
    .describe('The background color for popovers, paired with `popover-foreground`.'),
  'popover-foreground': z.string().describe('Paired with `popover`.'),
  primary: z.string().describe('The main color, paired with `primary-foreground`.'),
  'primary-foreground': z.string().describe('Paired with `primary`.'),
  secondary: z.string().describe('A secondary color, paired with `secondary-foreground`.'),
  'secondary-foreground': z.string().describe('Paired with `secondary`.'),
  muted: z.string().describe('A muted background color, paired with `muted-foreground`.'),
  'muted-foreground': z.string().describe('Paired with `muted`.'),
  accent: z
    .string()
    .describe('Subtle color for hover or highlight, paired with `accent-foreground`.'),
  'accent-foreground': z.string().describe('Paired with `accent`.'),
  destructive: z
    .string()
    .describe('Color for destructive actions, paired with `destructive-foreground`.'),
  'destructive-foreground': z.string().describe('Paired with `destructive`.'),
  border: z.string().describe('The color for borders.'),
  input: z.string().describe('The background color for input fields.'),
  ring: z.string().describe('The color for focus rings.'),
  'chart-1': z.string(),
  'chart-2': z.string(),
  'chart-3': z.string(),
  'chart-4': z.string(),
  'chart-5': z.string(),
  sidebar: z
    .string()
    .describe('The background color for the sidebar, paired with `sidebar-foreground`.'),
  'sidebar-foreground': z.string().describe('Paired with `sidebar`.'),
  'sidebar-primary': z.string(),
  'sidebar-primary-foreground': z.string(),
  'sidebar-accent': z.string(),
  'sidebar-accent-foreground': z.string(),
  'sidebar-border': z.string().describe('The color for borders within the sidebar.'),
  'sidebar-ring': z.string().describe('The color for focus rings within the sidebar.'),
  'font-sans': z.string(),
  'font-serif': z.string(),
  'font-mono': z.string(),
  radius: z
    .string()
    .describe('The global border-radius for components. Use 0rem for sharp corners.'),
  'shadow-color': z.string(),
  'shadow-opacity': z.string(),
  'shadow-blur': z.string(),
  'shadow-spread': z.string(),
  'shadow-offset-x': z.string(),
  'shadow-offset-y': z.string(),
  'letter-spacing': z.string().describe('The global letter spacing for text.'),
  spacing: z.string().optional(),
})

export const themeStylesSchema = z.object({
  light: themeStylePropsSchema,
  dark: themeStylePropsSchema,
})

export type ThemeStyleProps = z.infer<typeof themeStylePropsSchema>
export type ThemeStyles = z.infer<typeof themeStylesSchema>
```

(Há também `themeStylePropsSchemaWithoutSpacing` via `.omit({ spacing: true })`, e `ThemePreset` tipo com `Partial<ThemeStyleProps>` — útil pra builder UI mas não pra schema persistido.)

**Decisões-chave do desenho TweakCN:**

1. **Flat, não aninhado.** Sem sub-objetos `colors: { ... }`, `fonts: { ... }`. Cada token é chave top-level → matching 1:1 com o CSS variable.
2. **Chaves kebab-case literais.** `'card-foreground'`, `'font-sans'`, `'chart-1'` — espelham diretamente o nome do CSS custom property (`--card-foreground`). Zero transformação no emit.
3. **`{ light, dark }` separado.** Não derivação OKLCH; cada modo declara as 28 cores explicitamente. Garante intencionalidade visual em dark mode.
4. **`spacing` opcional.** Reflete presets antigas. Pode virar required no nosso futuramente.
5. **`describe()` por token.** Documentação inline disponível pra builder UI (tooltip "what does this token control") + AI prompt context.
6. **`COMMON_STYLES` só em runtime (`config/theme.ts`).** TweakCN merge ali — fontes/radius/shadow/spacing/letter-spacing aplicadas tanto em `light` quanto `dark` antes de emit. **Nossa adaptação:** promover essa invariante pra schema (`common`) — força que tokens estruturais não divergem entre modos.

---

## 3. Schema Zod proposto pra nosso projeto

`lib/design/contract/theme.ts` (será criado em Fase 1 §2.1):

```ts
import { z } from 'zod'

// ─── Per-mode tokens (28 colors only — duplicados light↔dark intencionalmente) ─

export const ThemeColorsSchema = z.object({
  background: z.string().describe('Default page background. Paired with `foreground`.'),
  foreground: z.string().describe('Default text color. Paired with `background`.'),
  card: z.string().describe('Card surface background. Paired with `card-foreground`.'),
  'card-foreground': z.string().describe('Text on cards.'),
  popover: z.string().describe('Popover/menu surface. Paired with `popover-foreground`.'),
  'popover-foreground': z.string().describe('Text on popovers.'),
  primary: z.string().describe('Brand primary action. Paired with `primary-foreground`.'),
  'primary-foreground': z.string().describe('Text on primary surfaces.'),
  secondary: z.string().describe('Secondary action surface. Paired with `secondary-foreground`.'),
  'secondary-foreground': z.string().describe('Text on secondary surfaces.'),
  muted: z.string().describe('Muted background (subtle fills). Paired with `muted-foreground`.'),
  'muted-foreground': z.string().describe('Tertiary text, captions, helper.'),
  accent: z.string().describe('Hover/highlight color. Paired with `accent-foreground`.'),
  'accent-foreground': z.string().describe('Text on accent surfaces.'),
  destructive: z
    .string()
    .describe('Destructive action color. Paired with `destructive-foreground`.'),
  'destructive-foreground': z.string().describe('Text on destructive surfaces.'),
  border: z.string().describe('Default border color.'),
  input: z.string().describe('Input field background.'),
  ring: z.string().describe('Focus ring color.'),
  'chart-1': z.string(),
  'chart-2': z.string(),
  'chart-3': z.string(),
  'chart-4': z.string(),
  'chart-5': z.string(),
  sidebar: z.string().describe('Sidebar surface. Paired with `sidebar-foreground`.'),
  'sidebar-foreground': z.string().describe('Sidebar text.'),
  'sidebar-primary': z.string(),
  'sidebar-primary-foreground': z.string(),
  'sidebar-accent': z.string(),
  'sidebar-accent-foreground': z.string(),
  'sidebar-border': z.string(),
  'sidebar-ring': z.string(),
})

export type ThemeColors = z.infer<typeof ThemeColorsSchema>

// ─── Shared tokens (light↔dark — não diferem por modo) ───────────────────────

export const ThemeCommonSchema = z.object({
  'font-sans': z.string().describe('Primary UI font stack.'),
  'font-serif': z.string().describe('Serif font stack.'),
  'font-mono': z.string().describe('Monospace font stack.'),
  radius: z.string().describe('Global border-radius (rem). Use `0rem` for sharp corners.'),
  'shadow-color': z.string(),
  'shadow-opacity': z.string(),
  'shadow-blur': z.string(),
  'shadow-spread': z.string(),
  'shadow-offset-x': z.string(),
  'shadow-offset-y': z.string(),
  'letter-spacing': z.string().describe('Global letter-spacing (em).'),
  spacing: z.string().optional().describe('Base spacing unit (rem). Optional.'),
})

export type ThemeCommon = z.infer<typeof ThemeCommonSchema>

// ─── Theme root (light + dark + common) ──────────────────────────────────────

export const ThemeSchema = z.object({
  light: ThemeColorsSchema,
  dark: ThemeColorsSchema,
  common: ThemeCommonSchema,
})

export type Theme = z.infer<typeof ThemeSchema>

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Partial pra builder UI (usuário pode salvar overrides incrementais). */
export const ThemePartialSchema = z.object({
  light: ThemeColorsSchema.partial(),
  dark: ThemeColorsSchema.partial(),
  common: ThemeCommonSchema.partial(),
})

export type ThemePartial = z.infer<typeof ThemePartialSchema>
```

**LOC: ~78** (sem comentários e blank lines: ~58 LOC).

---

## 4. Comparação atual vs proposto

| Dimensão                  | Atual (`lib/design/contract/`)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Proposto (`theme.ts`)                                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Arquivos                  | 9 (index, illustrations, mobile, roles, strategy, tokens, typography, visual, voice)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **1** (theme.ts) + index re-export                                                                                 |
| LOC total                 | ~600                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | **~80**                                                                                                            |
| Sub-schemas exportados    | 19+ (`ArchetypeSchema`, `RolesSchema`, `ArchetypeRawSchema`, `BorderSchema`, `ContainerSchema`, `MotionSchema`, `RadiusSchema`, `ScrollbarSchema`, `SelectionSchema`, `ShadowSchema`, `SpacingSemanticSchema`, `StateSchema`, `SurfaceTreatmentSchema`, `TypographyCompatSchema`, `TypographyFontsSchema`, `TypographyPersonalitySchema`, `ArchetypeMobileSchema`, `ArchetypePhotographySchema`, `IconographySchema`, `IllustrationSchema`, `IllustrationCatalogSchema`, `ArchetypeVoiceSchema`, `VoicePatternsSchema`, `VoicePromptSeedSchema`, `VoiceToneSchema`, `StrategySchema`, `OklchSchema`, ...) | **3** (`ThemeColorsSchema`, `ThemeCommonSchema`, `ThemeSchema`) + 1 helper (`ThemePartialSchema`)                  |
| Conceitos modelados       | archetype bundle, 28 invented roles, 5 font slots, voice tokens (warmth/formality/persona), illustration catalog, photography tokens, motion durations per archetype, surface treatments, scrollbar, selection, mobile primitives, strategy resolution (literal/polarity-flip/oklch-derive/reuse/mechanic-swap)                                                                                                                                                                                                                                                                                           | **shadcn canonical only** (28 colors per mode + 3 fonts + radius + 6 shadow primitives + spacing + letter-spacing) |
| Sub-schemas discriminated | `StrategySchema` (discriminatedUnion 5 variants)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | nenhum (não precisa)                                                                                               |
| Type complexity           | `ArchetypeConfig` aninhado, `Partial<ArchetypeConfig>` non-trivial                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `Theme` flat, `Partial` trivial                                                                                    |
| Footprint Zod inferido    | objetos profundos, recursões via `z.record`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 100% `z.string()` (folha)                                                                                          |
| Runtime cost de `.parse`  | O(n) com n grande (~100+ campos)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | O(41) shallow                                                                                                      |
| Cobertura de uso real     | ~5% (vast majority dos sub-schemas nunca consumidos no runtime — só voice/illustrations/photography existem como type sem callsite)                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | **100%** (todo token usado em `build-theme-css.ts`)                                                                |

**Redução: ~87% LOC** (600 → 80). **Redução de conceito: ~94%** (19+ sub-schemas → 3).

---

## 5. Como S1.1 (token partition) afeta este schema

Estudo S1.1 vai classificar os 41 tokens entre **universal** (vivem em `globals.css`, fora do tema) e **per-tenant** (vivem no schema acima). **Hipótese a confirmar em S1.1** (per `pivot-tweakcn.md` §S1.1):

| Token group                                                                      | Escopo provável | Schema?                                                         |
| -------------------------------------------------------------------------------- | --------------- | --------------------------------------------------------------- |
| 28 colors (light + dark)                                                         | per-tenant      | **Sim** — em `ThemeColorsSchema`                                |
| 3 fonts (sans/serif/mono)                                                        | per-tenant      | **Sim** — em `ThemeCommonSchema`                                |
| `radius`                                                                         | per-tenant      | **Sim** — em `ThemeCommonSchema`                                |
| 6 shadow primitives                                                              | per-tenant      | **Sim** — em `ThemeCommonSchema`                                |
| `letter-spacing`                                                                 | per-tenant      | **Sim** — em `ThemeCommonSchema`                                |
| `spacing` (base unit)                                                            | per-tenant?     | Opcional em `ThemeCommonSchema` — S1.1 decide se vira universal |
| Motion durations/easings                                                         | **universal**   | **Não** — vai pra `globals.css`                                 |
| Z-index scale                                                                    | **universal**   | **Não** — vai pra `globals.css`                                 |
| Spacing scale (Carbon 8-base numérico: `--spacing-0..32`)                        | **universal**   | **Não**                                                         |
| Mobile primitives (`--touch-min`, `--inset-safe-*`, `--mobile-full-height`, etc) | **universal**   | **Não**                                                         |
| APCA thresholds                                                                  | **universal**   | **Não** — constants em código                                   |
| Frosted glass primitives (`--frosted-blur/saturate/opacity`)                     | **universal**   | **Não**                                                         |
| Breakpoint canonical (768px)                                                     | **universal**   | **Não**                                                         |

**Implicação:** se S1.1 mover `spacing` (base unit) pra universal, fica fácil — remove de `ThemeCommonSchema` (uma linha). Se decidir adicionar tokens extras opt-in (frosted-mobile per-tenant, native-aliases archetype-specific), entram como sub-schema **separado opcional** que NÃO infla `ThemeSchema` — ex: `ThemeNativeAliasesSchema = z.record(z.string(), z.string()).optional()` e o root vira `{ light, dark, common, nativeAliases? }`. Decisão final fica pra S1.1.

---

## 6. Migration path

**Estado atual do DB (per ADR-0043 §antes):**

```sql
public.tenants:
  archetype_id text         -- ex: 'editorial-serif'
  palette_id   uuid FK      -- → public.brand_palettes
  font_id      uuid FK      -- → public.brand_fonts
```

**Schema novo (proposto pra Fase 4 do pivot — fora desta pesquisa):**

```sql
public.tenants:
  theme_preset_id uuid FK     -- → public.brand_presets (built-in + custom)
  theme_overrides jsonb       -- ThemePartial (overrides do preset)
```

Onde `brand_presets.theme jsonb` carrega `Theme` (validado em server action via `ThemeSchema.parse`).

**Backwards-compat?** Provavelmente **não**. O mapeamento `archetype_id → preset` é lossy: archetypes velhos declaravam **estratégias** (`polarity-flip`, `oklch-derive`, `mechanic-swap`), não valores concretos. Não dá pra emitir `Theme` shadcn-canonical sem **escolher uma paleta de referência** + **resolver estratégias** + **literalizar tokens**. Caminho:

1. Tenants existentes (1-2 hoje) recebem migration manual: lookup do `archetype_id` no registry **legado** (que vai pra `..\platform-legacy\`), executa `buildThemeCSS()` uma última vez, extrai os 41 tokens emitidos, salva em `brand_presets` como preset chamado `'migrated-<old-archetype>-<date>'`. Tenant aponta pra esse preset.
2. Após migration, registry legado pode ser deletado fisicamente.
3. **Tenant default novo** usa preset `'neutral'` (shadcn defaults oficiais: `oklch(1 0 0)` background, `oklch(0.205 0 0)` foreground, etc — copia de `config/theme.ts` TweakCN).

**Alternativa simpler (recomendada):** dado que só há tenants de teste, **dropa archetype model inteiro** e cada tenant precisa escolher novo preset pós-pivot. Documenta na ADR-0044.

---

## 7. Refs

- TweakCN `types/theme.ts` — `https://github.com/jnsahaj/tweakcn/blob/main/types/theme.ts`
- TweakCN raw — `https://raw.githubusercontent.com/jnsahaj/tweakcn/main/types/theme.ts`
- TweakCN `config/theme.ts` (COMMON_STYLES runtime merge) — `https://github.com/jnsahaj/tweakcn/blob/main/config/theme.ts`
- `docs/research/28-tweakcn-evaluation.md` §3 — anatomia 41 tokens
- `docs/plans/pivot-tweakcn.md` §S1.1 + §S1.3 — estudos prévios
- `lib/contracts/money.ts` + `lib/contracts/entitlements.ts` — pattern Zod 4 `import { z } from 'zod'` no projeto
- `lib/design/contract/index.ts` — schema legado (vai pra `..\platform-legacy\`)
- `.claude/rules/contrast.md` — APCA Silver gate (consume tokens deste schema)
- Apache-2.0 NOTICE: schema inspirado em TweakCN (Sahaj Jain `jnsahaj/tweakcn`, Apache-2.0). Adaptações: `common` extraído, `describe()` em PT-context.
