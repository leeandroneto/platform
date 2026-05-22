# 37 — Mobile/PWA extras: universal vs opt-in vs descarte (Fase 2 do pivot ADR-0044)

> **Tipo:** estudo prévio S2.\* do plano `docs/plans/pivot-tweakcn.md` (Fase 2).
> Bloqueante pra cravar `globals.css` final + extension contract no Zod
> `lib/design/contract/theme.ts`. **Não é ADR** — é insumo pra cravar decisões
> que serão registradas em commit Fase 2 (e potencialmente ADR-0045 se a
> partição muda invariantes do schema).
>
> **Escopo:** 3 estudos consolidados — S2.1 (per-token decisão), S2.2 (naming
> compat shadcn-canonical) e S2.3 (extension contract no Zod).
>
> **Status confiança:** alta. Universal vs per-tenant já está cravado em ADR-0044
> §2. Este doc só refina **quais** tokens mobile/PWA específicos sobrevivem
> em qual bucket e como modelar opt-in se for o caso.
>
> **Última atualização:** 2026-05-21.

---

## 0. Princípios herdados (não re-decidir)

Cravados em ADR-0044 §2 + research/29 §4:

1. **Universal = imutável cross-tenant.** Mobile chrome, z-index, motion,
   spacing Carbon, APCA thresholds, breakpoint canonical, focus rings, frosted
   glass primitives vivem em `app/globals.css`. Tenant não escolhe.
2. **Per-tenant = branding visual.** 32 cores + 3 fontes + radius + 6 shadow
   primitives + shadow-color + letter-spacing + spacing-opt. Vivem no snapshot
   JSONB + emit runtime via `<style precedence="theme">`.
3. **Extras opt-in = só após estudo + ADR.** Regra de 3 — se 3+ presets/tenants
   precisam variar, é opt-in. Senão, ou é universal, ou descarta.
4. **shadcn-canonical (TweakCN-vocab) é interface pública.** Naming não conflita
   nem reescreve canonical; extras coexistem com prefixo dedicado.
5. **APCA Silver dual-gate (75/60/45) é gate runtime + build** — qualquer
   extension que toque cor/border/ring revalida.

A pergunta deste doc não é "universal ou per-tenant" (já cravado). É **quais
extras específicos** entram, e **se** vamos modelar opt-in agora.

---

## Seção A — Tabela cravada (todos os candidatos)

Avaliação per-token de `app/globals.css` (estado atual pós-Fase 1) + tokens
de blueprint mobile que sobreviveram à `surgical delete`. Critério decisão:

- **UNIVERSAL** quando: padrão proven (iOS HIG, Material 3, WCAG, Apple
  Vision) cross-app + sem variação semantically tenant-específica.
- **OPT-IN** quando: 3+ tenants vão variar OU representa choice visual
  signature que muda branding (Spotify mini-player vs sem mini-player).
- **DESCARTAR** quando: sem consumer real, sem padrão proven, sem cenário
  3+ tenants.

| Token                  | Valor atual                | Decisão       | Razão                                                                                                                                                                                                                                                                                                          | Onde mora                                |
| ---------------------- | -------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| `--touch-min`          | 44px                       | **UNIVERSAL** | Apple HIG mandatório + WCAG 2.5.5 (2.5.8 AA Min). Nenhum tenant deveria reduzir. Acessibilidade > branding.                                                                                                                                                                                                    | `globals.css @theme`                     |
| `--touch-comfortable`  | 48px                       | **UNIVERSAL** | Material 3 canonical. Útil em CTAs primárias. Cross-tenant.                                                                                                                                                                                                                                                    | `globals.css @theme`                     |
| `--inset-safe-top`     | `env(safe-area-inset-top)` | **UNIVERSAL** | iOS PWA mandatório (Dynamic Island, notch). Sem variação possível — viewport-native.                                                                                                                                                                                                                           | `globals.css @theme`                     |
| `--inset-safe-bottom`  | idem                       | **UNIVERSAL** | iOS home indicator + Android gesture bar. Viewport-native.                                                                                                                                                                                                                                                     | `globals.css @theme`                     |
| `--inset-safe-left`    | idem                       | **UNIVERSAL** | Landscape iPhone. Viewport-native.                                                                                                                                                                                                                                                                             | `globals.css @theme`                     |
| `--inset-safe-right`   | idem                       | **UNIVERSAL** | Landscape iPhone. Viewport-native.                                                                                                                                                                                                                                                                             | `globals.css @theme`                     |
| `--mobile-full-height` | `100dvh`                   | **UNIVERSAL** | Anti URL-bar Safari bug. Cross-browser canonical. ESLint `no-vh-in-mobile-aware` enforce.                                                                                                                                                                                                                      | `globals.css @theme`                     |
| `--mobile-nav-height`  | 56px                       | **UNIVERSAL** | Material 3 bottom nav canonical. iOS tab bar = 49pt ≈ 56px. Convergência das duas plataformas. Variar = quebrar muscle memory.                                                                                                                                                                                 | `globals.css @theme`                     |
| `--fab-size`           | 56px                       | **UNIVERSAL** | Material 3 FAB regular canonical. iOS não tem FAB nativo mas adotou padrão. Single source.                                                                                                                                                                                                                     | `globals.css @theme`                     |
| `--sticky-cta-height`  | 64px                       | **OPT-IN** ⚠️ | Não é padrão de plataforma — é decisão UX por arquitetura (alguns layouts mobile usam sticky CTA grande; outros usam FAB ou inline). Mas no MVP **só temos 1 valor** (64px) e **0 tenants pedindo variação**. **Recomendação dia 0: UNIVERSAL provisório.** Promove pra OPT-IN se chegar 2º preset que varie.  | `globals.css @theme` (provisório)        |
| `--mini-player-height` | 64px                       | **OPT-IN**    | Spotify-signature — nem todo tenant tem audio/video player persistente. Yoga.app pode ter; ingles.app talvez não; desafit.app sim. **3 cenários de variação possíveis.** Mas dia 0 valor é literal universal (64px). Modelo: declarar universal em `globals.css` + permitir override per-tenant via extension. | OPT-IN (fallback chain em `globals.css`) |
| `--press-scale`        | 0.97                       | **UNIVERSAL** | Material 3 press feedback canonical. iOS HIG implícito (highlight overlay padrão). Cross-tenant.                                                                                                                                                                                                               | `globals.css @theme`                     |
| `--frosted-blur`       | 20px                       | **UNIVERSAL** | Apple iOS glass canonical. Vision Pro adota mesmo valor. Cross-platform pattern.                                                                                                                                                                                                                               | `globals.css @theme`                     |
| `--frosted-saturate`   | 1.8                        | **UNIVERSAL** | iOS canonical. Constante.                                                                                                                                                                                                                                                                                      | `globals.css @theme`                     |
| `--frosted-opacity`    | 0.72                       | **UNIVERSAL** | iOS canonical. Constante.                                                                                                                                                                                                                                                                                      | `globals.css @theme`                     |

### Tokens órfãos avaliados e **descartados** (não estão em `globals.css` mas constam em blueprint pre-pivot)

| Token                                                              | Razão descarte                                                                                                                                                      |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--mobile-half-height: 50dvh`                                      | Sem consumer real pós-surgical-delete. Bottom sheet snap points podem usar `calc(100dvh * 0.5)` inline JIT.                                                         |
| `--mobile-three-quarter-height: 75dvh`                             | Idem. JIT inline calc.                                                                                                                                              |
| `--mobile-screen-height: 100svh`                                   | Caso de uso muito raro (telas que aceitam shrink quando URL bar aparece). 100dvh cobre 95% — adicionar JIT se algum layout exigir.                                  |
| `--mobile-large-height: 100lvh`                                    | Mesmo motivo. Adicionar JIT se preset Spotify-like exigir hero fullscreen com URL bar.                                                                              |
| `--nav-bottom-height: 56px`                                        | Duplicata de `--mobile-nav-height`. Manter só `--mobile-nav-height` (canonical name).                                                                               |
| `--frosted-opacity-strong`                                         | Sem consumer real. Adicionar JIT se um preset Apple-glass justificar.                                                                                               |
| `--frosted-opacity-light`                                          | Idem.                                                                                                                                                               |
| `--hover-scale: 1.02`                                              | Desktop-only — não cabe em mobile-PWA-first. Hover em mobile não existe (`@media (hover: hover)` resolve em CSS local).                                             |
| `--hover-opacity: 0.85`                                            | Idem desktop-only. JIT inline em utility custom se algum component pedir.                                                                                           |
| `--press-opacity: 0.6`                                             | Substituído por `--press-scale` que cobre o feedback. Opacity em :active pode ser inline numa class custom JIT.                                                     |
| `--disabled-opacity: 0.5`                                          | Tailwind v4 já tem `disabled:opacity-50` utility canonical. Sem necessidade de token.                                                                               |
| `--icon-marketing: 80px`                                           | Marketing-specific, escopo Fase 7+ landing pages. Adicionar JIT quando blueprint marketing pedir.                                                                   |
| `--aspect-*` (todos)                                               | Tailwind v4 cobre via `aspect-video`, `aspect-square`, etc. `aspect-[16/9]` utility resolve. Sem necessidade de token universal.                                    |
| `--icon-stroke / --icon-stroke-heavy`                              | Não são CSS vars — são props do `<Icon>` component que volta JIT em Fase 3. Modelar como component prop, não token.                                                 |
| `--animate-shimmer`                                                | Skeleton já vem em `tw-animate-css` import. Sem necessidade de token custom.                                                                                        |
| `--mobile-card-width-mobile`                                       | Hardcoded responsive design — usa `@media` em CSS local, não token.                                                                                                 |
| `--spacing-card`/`--spacing-section`/`--spacing-hero` etc semantic | Substituídos por escala `--spacing-0..32` Carbon. Component decide qual nível usar via Tailwind utility (`p-6`, `py-24`). Sem necessidade de semantic intermediate. |

### Resumo Seção A

- **UNIVERSAL final dia 0:** 14 tokens (`--touch-min`, `--touch-comfortable`,
  `--inset-safe-{top,bottom,left,right}`, `--mobile-full-height`,
  `--mobile-nav-height`, `--fab-size`, `--sticky-cta-height`, `--press-scale`,
  `--frosted-blur`, `--frosted-saturate`, `--frosted-opacity`) — **idêntico ao
  que já está em `app/globals.css` hoje**, exceto `--mini-player-height` (vira
  OPT-IN com fallback chain).
- **OPT-IN final dia 0:** 1 token (`--mini-player-height`) com fallback chain.
- **DESCARTE final dia 0:** ~18 tokens órfãos (não estão em `globals.css`
  pós-surgical-delete; ficam descartados explicitamente pra Claude futuro
  não re-adicionar "porque parecia útil").

---

## Seção B — Naming convention final

### Premissa

shadcn-canonical TweakCN-vocab ocupa ~45 keys sem prefixo (`--background`,
`--primary`, `--radius`, etc). Não temos colisão atual entre canonical e
mobile/frosted (canonical não toca em `touch-*`, `inset-safe-*`, `mobile-*`,
`fab-*`, `frosted-*`, `press-*`, `mini-player-*`, `sticky-cta-*`). Mas
qualquer NAMING novo precisa garantir não-conflito futuro.

### Convenção cravada

**Tokens universais mobile/PWA mantêm prefixo de domínio**, sem reescrita:

| Domínio universal     | Prefixo canonical          | Exemplos atuais (já em `globals.css`)                       |
| --------------------- | -------------------------- | ----------------------------------------------------------- |
| Touch targets         | `--touch-*`                | `--touch-min`, `--touch-comfortable`                        |
| Safe areas iOS        | `--inset-safe-*`           | `--inset-safe-{top,bottom,left,right}`                      |
| Mobile chrome heights | `--mobile-*`               | `--mobile-full-height`, `--mobile-nav-height`               |
| FAB                   | `--fab-*`                  | `--fab-size`                                                |
| Sticky CTA            | `--sticky-cta-*`           | `--sticky-cta-height`                                       |
| Mini player           | `--mini-player-*`          | `--mini-player-height` (mas é OPT-IN, ver Seção A)          |
| Press feedback        | `--press-*`                | `--press-scale`                                             |
| Frosted glass         | `--frosted-*`              | `--frosted-blur`, `--frosted-saturate`, `--frosted-opacity` |
| Z-index               | `--z-*`                    | `--z-content`, `--z-modal`, etc                             |
| Motion                | `--duration-*`, `--ease-*` | (já em globals.css)                                         |
| Spacing Carbon        | `--spacing-N`              | `--spacing-0..32` numérico                                  |
| Icon sizes            | `--icon-*`                 | `--icon-{xs,sm,md,lg,xl}`                                   |
| Breakpoint            | `--breakpoint-*`           | `--breakpoint-mobile`                                       |

### Por quê **NÃO** usar `--ext-*` ou `--mobile-ext-*` prefixo guarda-chuva

Considerado e rejeitado. Razões:

1. **shadcn-canonical não impõe prefixo** — quem chegou primeiro define
   nomenclatura. Prefixar nossos universais com `--ext-*` sugere que eles são
   "extensão" de algo que não existe (canonical não cobre mobile chrome).
2. **Discoverability piora** — `var(--mobile-nav-height)` lê melhor que
   `var(--ext-mobile-nav-height)`.
3. **Compatibilidade futura** — se shadcn upstream eventualmente adicionar
   `--mobile-*` canonical, nossa adoção será zero-cost rename ao invés de
   migration de prefixo.
4. **Sem colisão atual** — TweakCN-vocab não usa nenhum dos 13 prefixos
   acima (validado contra `tweakcn-ref/types/theme.ts` linhas 5-68).

### Quando usar `--ext-*` prefixo

**Nunca em universais.** Reservado pra opt-in PER-TENANT que viva dentro de
`tenant_theme_versions.snapshot.extensions` JSONB (ver Seção C opção A). Ex:
se um preset Spotify-like quiser declarar `extensions["mini-player"]`, o emit
runtime gera `--mini-player-height: 72px;` (sem prefixo `ext-` no CSS final —
fallback chain já marca distinção semântica).

### Vocab banido — confirmar não-conflito (referência cruzada `.claude/rules/naming.md`)

| Banido                                    | Mobile/frosted usa? | Status                             |
| ----------------------------------------- | ------------------- | ---------------------------------- |
| `--role-*`                                | Não                 | OK — sem colisão                   |
| `--shape-*`                               | Não                 | OK — `--radius` cobre              |
| `--elevation-*`                           | Não                 | OK — 8 níveis shadow algorítmicos  |
| Native aliases archetype-specific         | Não                 | OK — extension JIT cobre se voltar |
| `--brand-hue`                             | Não                 | OK — sem colisão                   |
| `--font-display/body/mono/accent/eyebrow` | Não                 | OK — 3 fontes canonical            |

Tudo coerente com `.claude/rules/naming.md` e `.claude/rules/design-tokens.md`.

---

## Seção C — Extension contract (Zod) opção A/B/C + recomendação

### Contexto

Como modelar **opt-in per-tenant** em `lib/design/contract/theme.ts` (Zod
schema validado contra `tweakcn-ref/types/theme.ts`).

Hoje:

```ts
ThemeSchema = z.object({
  light: ThemeColorsSchema, // 33 keys
  dark: ThemeColorsSchema, // 33 keys
  common: ThemeCommonSchema, // 11 keys
})
```

Nenhum dos 45 keys cobre `--mini-player-height`. Decisão é como (e se) modelar
agora.

### Opção A — `common.extensions: z.record(...)` chave-valor genérico

```ts
ThemeCommonSchema = z.object({
  // ... 11 keys originais
  extensions: z
    .record(z.string(), z.string()) // ex: { "mini-player-height": "72px" }
    .optional()
    .default({}),
})
```

`buildThemeCSS()` itera `extensions` e emite:

```css
--mini-player-height: 72px; /* sai do extensions["mini-player-height"] */
```

**Prós:**

- Genérico — preset declara qualquer chave futura sem migration de schema.
- Compatível com TweakCN snapshot import (ignora chaves desconhecidas).
- Versionamento via `tenant_theme_versions` continua imutável; extensions
  é parte do snapshot.

**Contras:**

- Sem validação tipada — `extensions["miniPlayerHeight"]` vs
  `extensions["mini-player-height"]` ambos passam Zod. Bug class possível.
- Tooltip/introspection no builder UI fica genérica.
- Sem APCA gate automático em extensions de cor (se um dia algum extension
  declarar cor — não cobre dia 0 mas precisa pensar).

### Opção B — `common.mobileExtras: z.object({...})` tipado

```ts
ThemeCommonSchema = z.object({
  // ... 11 keys originais
  mobileExtras: z
    .object({
      'mini-player-height': z.string().optional(),
      // futuro: outros opt-ins aqui
    })
    .optional()
    .default({}),
})
```

**Prós:**

- Type-safe — IDE autocomplete, Zod erra em chave desconhecida.
- Builder UI gera tooltip/picker específico.

**Contras:**

- Inflexível — toda key nova é migration de schema + bump de version.
- TweakCN snapshot import precisa transformar (deles flat, nosso aninhado).
- Burocrático pra um único token dia 0.

### Opção C — Sem `extensions` no Zod; opt-in vive no `globals.css` com fallback chain

```css
/* globals.css */
@theme {
  /* ... outros universais ... */
  --mini-player-height: 64px; /* default */
}
```

Component consumer:

```tsx
<div style={{ height: 'var(--mini-player-height, 64px)' }}>...</div>
```

Per-tenant override **não acontece dia 0**. Se um futuro preset Spotify-like
exigir 72px, a decisão será promovê-lo formalmente — ou pra outro universal
diferente (improvável), ou pra `extensions` em opção A (com ADR).

**Prós:**

- Zero mudança no Zod schema (mantém os 45 keys puros).
- Fallback chain in-place — graceful degradation se preset não declara.
- Versionamento snapshot inalterado.
- Sem código novo em `buildThemeCSS()`.

**Contras:**

- Tenant não pode customizar dia 0 (mas hoje NINGUÉM PEDE — ver Seção F).
- Se chegar 2º preset que varie, precisamos migrar pra opção A (custo
  diferido).

### Recomendação: **Opção C (universal com fallback chain) dia 0**

Justificativa:

1. **Regra de 3 ainda não cumprida.** Dia 0 só temos `desafit.app`. Yoga.app
   e ingles.app são planejadas, não construídas. Modelar `extensions` antes
   de 3 consumers reais = premature abstraction (anti-pattern explícito em
   `.claude/rules/abstractions.md`).

2. **Sem APCA implications.** `--mini-player-height` é dimensão, não cor.
   Não precisa do gate dual-gate. Override JIT no consumer é seguro.

3. **Caminho de migração claro.** Quando Spotify-preset chegar (Fase 6+),
   migrar pra opção A é mecânico: adicionar `extensions: z.record(...)` em
   `ThemeCommonSchema`, ler em `buildThemeCSS()`, emit overrides. ADR-0046
   documenta. Zero perda de invariantes.

4. **Preserva schema monolítico ~117 LOC.** ADR-0044 §9 cravou Zod monolítico.
   Adicionar `extensions` agora infla schema sem consumer — viola §9.

5. **shadcn-canonical purity.** Schema continua espelhando 1:1 TweakCN com
   refinamento `common` separado. Importar/exportar JSONB TweakCN preset
   continua direto.

**Caveat:** se durante Fase 3 (presets) descobrir-se que 3+ presets querem
variar `--mini-player-height` (ou qualquer outro opt-in), promover pra opção
A naquele momento, com ADR-0046 dedicada. **Não decidir agora.**

---

## Seção D — Lista mínima dia 0 da migração

Estado de `app/globals.css` hoje (Fase 1 completa) já cobre todos os
universais. **Lista mínima de mudanças dia 0 = VAZIA.** Tudo já está no
lugar certo.

Confirmação per-token:

| Token                  | Hoje em `globals.css`? | Decisão Seção A                       | Ação dia 0                                 |
| ---------------------- | ---------------------- | ------------------------------------- | ------------------------------------------ |
| `--touch-min`          | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--touch-comfortable`  | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--inset-safe-*` (4)   | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--mobile-full-height` | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--mobile-nav-height`  | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--fab-size`           | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--sticky-cta-height`  | ✅ Sim                 | UNIVERSAL (prov.)                     | nada (anotar provisório no comentário CSS) |
| `--mini-player-height` | ✅ Sim                 | OPT-IN, mas universal dia 0 (opção C) | nada (anotar fallback-chain consumer-side) |
| `--press-scale`        | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--frosted-blur`       | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--frosted-saturate`   | ✅ Sim                 | UNIVERSAL                             | nada                                       |
| `--frosted-opacity`    | ✅ Sim                 | UNIVERSAL                             | nada                                       |

**Outputs adicionais dia 0 (NÃO-código):**

1. Atualizar `.claude/rules/design-tokens.md` se necessário (já cita lista
   correta — confirmar tabela "Universal" reflete os 14 dia 0; remover
   menção a `--frosted-opacity-strong`/`--frosted-opacity-light` se houver).
2. Comentário em `globals.css` sobre `--sticky-cta-height` e
   `--mini-player-height` marcando "candidato OPT-IN — promover JIT se 2+
   presets variarem".
3. `docs/blueprint/22-theme-extension-contract.md` — adiar criação até Fase
   3 (não criar dia 0 — opção C não precisa).

---

## Seção E — Impacto no `ThemeSchema` (especificar, não executar)

**Mudança no Zod schema:** nenhuma dia 0. Opção C foi recomendada precisamente
porque ela não toca `lib/design/contract/theme.ts`.

**Se no futuro adotarmos opção A** (migração quando regra de 3 cumprir),
mudança especificada:

```ts
// lib/design/contract/theme.ts (futuro — não dia 0)

export const ThemeExtensionsSchema = z
  .record(z.string().regex(/^[a-z][a-z0-9-]*$/, 'kebab-case CSS var name'), z.string())
  .describe(
    'Opt-in tokens not in shadcn-canonical 45 keys. Emitted as --<key>: <value> in <style precedence="theme">.',
  )

export const ThemeCommonSchema = z.object({
  'font-sans': z.string(),
  'font-serif': z.string(),
  'font-mono': z.string(),
  radius: z.string(),
  'shadow-opacity': z.string(),
  'shadow-blur': z.string(),
  'shadow-spread': z.string(),
  'shadow-offset-x': z.string(),
  'shadow-offset-y': z.string(),
  'letter-spacing': z.string(),
  spacing: z.string().optional(),
  // ─── ADIÇÃO FUTURA ─────────────────────────────
  extensions: ThemeExtensionsSchema.optional().default({}),
})
```

Custo: +6 LOC. ADR-0046 documenta motivação (qual era o 3º consumer + qual
opt-in justificou). `buildThemeCSS()` ganha:

```ts
// pseudo-código
if (theme.common.extensions) {
  for (const [k, v] of Object.entries(theme.common.extensions)) {
    lines.push(`  --${k}: ${v};`)
  }
}
```

`tenant_theme_versions.snapshot` continua imutável (extensions vive dentro
do JSONB). Migration de DB **não necessária** — JSONB já aceita campo novo.

**Build-time check adicional (se opção A virar realidade):**

- Validar que keys em `extensions` não colidem com canonical 45 (lint
  custom ou test runtime). Senão um preset poderia sobrescrever `--primary`
  via extensions, contornando o flat shadcn-canonical.

---

## Seção F — Open questions pro user

Decisões que **não** posso cravar sozinho — precisam input do user antes da
execução final da Fase 2.

### F.1 — Sticky CTA e mini-player ficam como "UNIVERSAL provisório dia 0"?

Recomendação da Seção A foi **UNIVERSAL provisório** com anotação. Alternativa
seria removê-los inteiramente dia 0 (já que `surgical delete` apagou consumers).
Justificativa pra manter: provavelmente Fase 3-7 vai re-adicionar mini-player
e sticky CTA wrappers — manter os 2 tokens agora poupa um round-trip.

**Pergunta:** ok manter os 2 com anotação `/* provisório — promover JIT se
2+ presets variarem */`, ou prefere deletar agora e re-adicionar JIT quando
wrapper voltar?

**✅ Decisão (user 2026-05-21):** Opção B — deletar agora. Razão: TweakCN globals.css tem ZERO tokens mobile (confirmado via grep — eles são desktop-only), e princípio §8 (extract+adapt, não inventar paralelo) sugere deletar quando não há feature consumer. Re-add JIT quando feature real chegar: `--sticky-cta-height` quando funil/landing tiver botão fixo (Fase 7+), `--mini-player-height` quando PWA aluno tiver audio. Edit aplicado a `app/globals.css` linha 55-58 com comentário de tombstone.

### F.2 — Promover `--frosted-opacity-strong` e `--frosted-opacity-light` agora?

Hoje não estão em `globals.css`. Blueprint pre-pivot mencionava. Se algum
preset Apple-glass-heavy chegar (decisão Fase 3), eles voltam. Recomendação:
**descarte agora**, re-add JIT.

**✅ Decisão (user 2026-05-21):** descarte confirmado. Re-add JIT só quando preset Apple-glass-heavy real existir.

### F.3 — `--press-opacity` (0.6) e `--disabled-opacity` (0.5) — re-add?

Tailwind v4 cobre `disabled:opacity-50` nativamente. `--press-opacity` é
override mais agressivo do default. Recomendação: **descartar**, usar utility
Tailwind canonical.

**✅ Decisão (user 2026-05-21):** descarte confirmado. Tailwind utilities cobrem. Mesma decisão cobre os 18 tokens órfãos da tabela "DESCARTE final dia 0" — nenhum retorna ao `globals.css`.

### F.4 — Opt-in formal (opção A) chega quando?

Recomendação: deferir até 2º preset que varie (regra de 3 começa em 1+1).
Alternativa: adotar opção A agora "pra evitar migration depois".

**Pergunta:** opção C dia 0 com promessa de migrar quando preciso, ou opção
A pre-empted agora (custo +6 LOC + ADR-0046 já)?

**✅ Decisão (user 2026-05-21):** Opção C — sem campo `extensions` no Zod schema hoje. Tokens opt-in viram universal em `globals.css` com fallback chain `var(--token, default)`. Schema 117 LOC permanece. Quando regra-de-3 cumprir (3+ presets variando MESMO token), abrir ADR-0046 + migrar pra Opção A.

### F.5 — APCA gate em extensions de cor (futuro)

Quando opção A chegar, e se algum extension declarar `--brand-glow-color`
ou similar, ele entra no APCA dual-gate de `scripts/validate-palettes.ts`?
Recomendação: sim, qualquer extension cuja key matche `/color/i` ou
`/border/i` ou `/ring/i` entra no gate.

**Pergunta:** padrão regex automático ou opt-in explícito via metadata na
extension?

**✅ Decisão (user 2026-05-21):** Opção A + allowlist — terceira via. APCA é safety-critical (acessibilidade + compliance legal): default ON via regex `/color|border|ring/`. Falso positivo resolvido via allowlist explícita pequena (`shadow-color`, `glow-color`, `outline-color`, etc — keys sabidamente não-foreground). Preset author não precisa lembrar de declarar nada. Quando opção A (extension field) cravar via ADR-0046, regex + allowlist viram parte do `scripts/validate-palettes.ts` APCA dual-gate.

---

## 9. Referências

- ADR-0044 — pivot TweakCN-way (autoritativa)
- ADR-0044 §2 — partição universal vs per-tenant
- `docs/research/29-token-partition-universal-vs-tenant.md` — estudo base S1.1
- `docs/research/28-tweakcn-evaluation.md` — anatomia TweakCN (sem mobile)
- `docs/research/31-zod-schema-shadcn-canonical.md` — schema Zod 117 LOC
- `app/globals.css` — universal tokens hoje
- `lib/design/contract/theme.ts` — Zod monolítico ~117 LOC
- `C:\Users\leean\Desktop\tweakcn-ref\app\globals.css` — referência TweakCN
  (sem mobile primitives)
- `C:\Users\leean\Desktop\tweakcn-ref\types\theme.ts` — schema flat 45 keys
- `.claude/rules/design-tokens.md` — regra path-loaded
- `.claude/rules/naming.md` — vocab banido (confirma não-colisão)
- `.claude/rules/contrast.md` — APCA Silver dual-gate
- `.claude/rules/abstractions.md` — regra "premature abstraction"
- Apple HIG touch target: https://developer.apple.com/design/human-interface-guidelines/inputs/touch-target
- Material 3 layout / bottom-app-bar: https://m3.material.io/components/bottom-app-bar
- WCAG 2.5.5 Target Size (Enhanced): https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html
- WCAG 2.5.8 Target Size (Minimum): https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html
