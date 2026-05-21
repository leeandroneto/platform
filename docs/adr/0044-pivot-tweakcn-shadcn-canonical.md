# 0044. Pivot pra TweakCN-way + shadcn-canonical

Date: 2026-05-21
Status: accepted (supersedes ADR-0043)
Última atualização: 2026-05-21 (estratégia execução refinada — surgical
delete em vez de move-to-legacy, TweakCN clone read-only ao lado).

## Context

ADR-0043 (consolidação 2026-05-20) cravou um design system multi-tenant
ambicioso: **22 archetypes** × 35 paletas × 13 fontes × 4 modos, **67
roles invented** (`--role-*` em 3 layers), 5 ESLint rules custom de
governança (`ds-governance/*`), Zod contract com 19+ sub-schemas, voice
tokens per archetype, 7 estratégias canônicas (`mechanic-swap`,
`tinted-brand`, `frosted-opt-in`, …), 5 slots tipográficos
(display/body/mono/accent/eyebrow). Total: **254 arquivos em
`lib/design/`** com **9.580 LOC só em `lib/design/archetypes/`**.

**Achado bloqueante (auditoria 2026-05-21,
`docs/_sessions/2026-05-21-auditoria-pivot-tweakcn.md`):** dos 22
archetypes implementados, **zero foi renderizado e validado visualmente
em runtime**. A primeira tentativa de showcase end-to-end (hoje)
destapou cascata de **9 bugs latentes** (Tooltip sem Provider, namespace
i18n inexistente, GRANT `service_role` faltando, h1 nested, CSS scan
worktrees, …). Cada fix foi **workaround, não correção de root cause**:
o engine inteiro nunca foi exercitado em produção.

Em paralelo, descobriu-se que **[TweakCN](https://tweakcn.com)
(`jnsahaj/tweakcn`, Apache-2.0, ~9.9k stars)** já implementa em produção
exatamente o builder visual de tema shadcn/ui que falta aqui — usando
**shadcn-canonical ~45 keys flat** (32 cores + 3 fontes + radius + 6
shadow primitives + shadow-color + letter-spacing + spacing). Esse vocabulário tem
compatibilidade nativa com v0.dev, shadcn blocks, Kibo, Origin UI, MCP
`shadcn@canary registry:mcp` — o ecossistema inteiro fala essa língua.
Nosso modelo `--role-*` invented é hipótese sem evidência; o deles é
proven em produção.

**Estudos prévios concluídos antes desta ADR (com caveat de inferência):**

- S1.1 (`docs/research/29-token-partition-universal-vs-tenant.md`) —
  particionamento ~45 keys canonical em universal vs per-tenant
- S1.2 (`docs/research/30-color-format-culori-integration.md`) — OKLCH
  primary no DB + APCA nativo
- S1.3 (`docs/research/31-zod-schema-shadcn-canonical.md`) — schema Zod
  monolítico ~78 LOC

**⚠️ Caveat de inferência:** os 3 estudos acima foram feitos via WebFetch +
research-28 antes do clone local do TweakCN. Em 2026-05-21 o repo foi
clonado em `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`,
branch `main`, Apache-2.0). Pré-Fase 1, validar conclusões contra
arquivos reais: `config/theme.ts`, `types/theme.ts`, `utils/shadows.ts`,
`utils/color-converter.ts`, `lib/ai/prompts.ts`, `utils/theme-presets.ts`
(25 presets contados, não 23), `db/schema.ts`, `app/r/themes/[id]/route.ts`.

## Decision

### 1. shadcn-canonical ~45 keys TweakCN-vocab como interface pública obrigatória

Trade-off **proven > teoricamente elegante**: ecossistema (v0.dev,
shadcn blocks, Kibo, Origin, MCP) reconhece imediatamente. 32 cores + 3
fontes + radius + 6 shadow primitives + shadow-color + letter-spacing + spacing.
(Validado Fase -1 contra `tweakcn-ref/types/theme.ts` commit 9adabcf9.)

### 2. Partição universal vs per-tenant (S1.1)

- **Per-tenant** (vivem em `<style precedence="theme">` runtime, snapshot
  em DB): 32 cores + 3 fontes + radius + 6 shadow primitives +
  shadow-color (por-modo) + letter-spacing + spacing-opt
- **Universal** (vivem em `app/globals.css`): mobile primitives
  (`--touch-min`, `--inset-safe-*`, `--mobile-full-height` 100dvh,
  `--mobile-nav-height`, `--fab-size`, frosted glass primitives),
  z-index, motion durations + easings canonical, spacing scale Carbon
  8-base (`--spacing` Tailwind base + escala numérica), APCA Silver
  thresholds, icon sizes, aspect ratios, breakpoint canonical 768px,
  focus rings, state tokens

### 3. Shadow primitives — 6 TweakCN + 8 níveis derivados algoritmicamente + 2 extras universais

Adotar 6 primitives TweakCN (`--shadow-color`, `--shadow-opacity`,
`--shadow-blur`, `--shadow-spread`, `--shadow-offset-x`,
`--shadow-offset-y`) per-tenant; 8 níveis (`--shadow-2xs` ... `--shadow-2xl`)
derivados algoritmicamente. PLUS 2 extras universais não-canonical:
`--shadow-sticky` (cima) e `--shadow-fab` (baixo) em `globals.css`.

### 4. Radius — 1 token + derivação Tailwind v4

Per-tenant: 1 token `--radius`. Tailwind v4 deriva
`--radius-sm/md/lg/xl/2xl/3xl/4xl` via `@theme` algoritmicamente.

### 5. `--shape-*` (ADR-0028) — deprecar

Tokens `--shape-*` superseded. Vai pra `..\platform-legacy\`. Componentes
que consumam migram pra `--radius` + utilities Tailwind.

### 6. Semantic colors não-canonical — OUT

`--color-info`/`--color-success`/`--color-warning` (extras invented além
do shadcn-canonical) NÃO entram. Apenas 32 tokens canonical de cor (incluindo
`--destructive`/`--destructive-foreground`).

### 7. Native aliases archetype-specific — OUT

Conceito `--apple-label-tertiary`, `--mistral-sunset-1` etc morre junto
com archetype.

### 8. Color format — OKLCH-primary (S1.2)

DB armazena OKLCH literal (`"oklch(0.55 0.2 270)"`). `buildThemeCSS()`
emite OKLCH literal. APCA opera em OKLCH nativo. HEX só fallback JIT
(PWA manifest theme-color, email HTML, OG image) via `oklchToHex()` em
`lib/design/contrast.ts`.

### 9. Schema Zod monolítico (S1.3)

`ThemeColorsSchema` (32 cores) + `ThemeCommonSchema` (fonts/radius/
shadows/letter-spacing/spacing-opt) + `ThemeSchema` root
(`{light, dark, common}`) + `ThemePartialSchema` pro builder UI.
~111 LOC monolítico (validado contra `tweakcn-ref/types/theme.ts`).
TweakCN NÃO promove `common` pra schema — nossa estrutura é refinamento
próprio multi-tenant (força invariante via tipo). Vai pra
`lib/design/contract/theme.ts` em Fase 1.

### 10. Multi-tenant runtime — mantido

`proxy.ts` → `getRouteByHost` → `<style precedence="theme">` inline
hoisted via React 19. Cache combo via `cacheTag('theme:<tenantId>:<version>')`.
APCA Silver dual-gate inalterado. Mobile primitives universais
inalterados.

### 11. 22 archetypes + 67 roles invented + 5 font slots + voice tokens — DESCARTADOS

Conceito archetype morre como bundle estrutural. Sobrevive só como
`tenants.archetype_id text` legacy até Fase 4 (theme storage) migrar pra
`tenant_themes.active_theme_version_id uuid`. Em Fase 4-8 vira preset
registry (`lib/design/presets/<slug>.ts`).

### 12. 5 ESLint rules ds-governance → 2 (Fase 1, não aqui)

Em Fase 1 (escopo desta ADR é princípio, não migração imediata):

- `no-raw-fontfamily` — mantido
- `no-vh-in-mobile-aware` — mantido
- `no-raw-tokens-in-components` — DROP (sem distinção raw/role após pivot)
- `no-icon-bypass` — DROP (over-engineered)
- `no-elevation-legacy` — DROP (após migration, sem necessidade)

### 13. DESIGN.md como fonte de tokens proven — inverter tese

`.claude/rules/design-references.md` (regra anterior: "NUNCA copiar
tokens literais") é **invertida**: DESIGN.md em
`docs/references/design-systems/` (71 brands) viram **snapshots
autoritativos de tokens proven**. Workflow: ao construir preset, copia
hex/oklch/font literais → valida APCA dual-gate → salva em
`lib/design/presets/<slug>.ts`. Atribuição via `NOTICE.md` (CC0 do
VoltAgent + Apache-2.0 do TweakCN + brands como inspiração).

### 14. Estratégia de execução — surgical delete (revisado 2026-05-21)

**Estratégia anterior (move-to-legacy) descartada** por gerar dead code
circulando (pasta vizinha indexável por IDE, mantém vocab invented
"acessível"). Substituída por **surgical delete + 1 commit grande** no
working tree atual (Option C de
`docs/_sessions/2026-05-21-reversion-analysis.md`):

- **NO `..\platform-legacy\` folder.** Git history preserva tudo
  (revert/cherry-pick disponível JIT se necessário).
- **NO stubs.** Files temporários enganam. Ajustes em consumers
  (`app/layout.tsx`, `lib/design/contract/index.ts`) são feitos no mesmo
  commit do delete.
- **TweakCN clone read-only** em `C:\Users\leean\Desktop\tweakcn-ref\`
  (pasta vizinha, NÃO submodule) — SSOT pra adaptação direta, mata
  inferências dos estudos S1.1/S1.2/S1.3.
- **Aceita perder algum trabalho "bom misturado"** pra ficar 100%
  limpo. AdaptiveShell, wrappers úteis, etc são re-add JIT quando
  feature pedir.

Alvos de delete (lista completa em
`docs/_sessions/2026-05-21-reversion-analysis.md` §3):

- `lib/design/archetypes/` (já-gone no tree atual)
- `lib/design/contract/{strategy,roles,voice,typography,illustrations,visual}.ts`
- `lib/design/role-resolver.ts` + `lib/design/roles.ts`
- `components/ds/lazy/` (9 brand-folders)
- `components/ds/<archetype-bound>.tsx` (32 wrappers — REVIEW
  one-by-one via grep `var(--role-*)`)
- `docs/design-system/` (já vazio)
- `docs/references/design-systems/` (71+ brand folders)
- `docs/research/{20-naming-mappings,26-design-system-vibes,27-design-tokens-per-archetype}.md`
- `messages/pt-BR/voice/` (10 archetype voice JSONs)
- `.claude/rules/design-references.md` (inteiro — sem escopo aplicação
  sem DESIGN.md folder)
- `.claude/worktrees/agent-*` (2 worktrees obsoletos)

**Manter:** `components/ui/*` (shadcn primitives), `components/kibo-ui/*`
(vendor), migrations 0020-0023 (especialmente 0023 GRANT e 0022 showcase
tenant — bug real + fixture). Fase 4 migra schema; Fase 0 não toca DB.

## Consequences

### Positivas

- **Ecosystem compat:** `npx shadcn add dashboard-01` renderiza temado
  out-of-box. v0.dev export tematiza. TweakCN preset HTTP fetch + apply
  funciona via `pnpm dlx shadcn add https://tweakcn.com/r/themes/<id>`.
- **Bundle CSS menor:** ~5KB → ~2-3KB per combo (canonical é mais compacto).
- **Bundle JS:** -20% (lazy archetypes folder gone, wrappers leaner).
- **Menos arquivos:** 254 → < 50 em `lib/design/` (contract + presets +
  utils). 9.580 LOC archetypes → 0 (presets em
  `lib/design/presets/` totalizam ~2.000 LOC máximo).
- **Builder UI proven** clonado de TweakCN (Apache-2.0, com atribuição
  via `NOTICE.md`). Inclui HSL adjustments, color picker stack, contrast
  checker (adaptado p/ APCA Silver), code panel multi-formato, font
  picker dinâmico Google Fonts.
- **Ciclo de iteração visual:** cada Fase termina com `pnpm dev` +
  visita rota. Visual check em CADA etapa, não no fim.

### Negativas

- "Elegância arquitetural" de roles invented perdida. Ninguém no
  ecossistema fala dessa língua.
- Diferenciação visual entre tenants agora depende de presets
  bem-construídos (copy literal DESIGN.md), não de 22 archetypes
  hard-coded.
- Voice tokens per archetype perdidos. JIT se 3+ tenants pedirem.
- Native aliases archetype-specific (`--apple-label-tertiary`) perdem
  graceful chain. Solução opt-in via `theme.extensions`
  (`var(--mini-player-height, 64px)` fallback chain) — Fase 2 estuda
  extension contract.
- 9.580 LOC deletadas do working tree. Git history preserva pra
  consulta JIT (`git show <commit>:<path>`) sem manter dead code
  circulando.
- Risco de regressão visual em wrappers durante migration (Fase 3).
  Mitigado via codemod conservador + Storybook + Playwright snapshot.

### Princípios não-negociáveis cravados (regem todas as 8 fases do pivot)

1. **Study-first em CADA fase.** Decisão arquitetural só após estudo
   prévio com dados. Sem cravar martelo "do gut".
2. **Universal imutável vs per-tenant personalizável — distinguir
   SEMPRE.** Mobile chrome, z-index, motion, spacing Carbon, APCA
   thresholds são universais. Cores/fontes/radius/shadow são per-tenant.
3. **shadcn-canonical é a interface pública.** Extras opt-in (mobile
   signature, native aliases archetype-specific) só após estudo prévio
   comprovar valor.
4. **Build verde a cada commit.** Quebras intencionais (ex: Fase 0 move
   legacy) são consertadas no MESMO commit antes do push.
5. **Visual check a cada etapa, não a cada fase.** Cada item executável
   termina com `pnpm dev` + verificação manual.
6. **Surgical delete > move-to-legacy.** Git history preserva trabalho
   pra revert JIT; sem dead code circulando, sem stubs temporários, sem
   pasta vizinha indexável.

### Vocabulário banido a partir desta ADR

`archetype` (como bundle estrutural — sobrevive só como
`tenants.archetype_id text` legacy), `role-*` (todos os 67 invented), 5
slots de tipografia (display/body/mono/accent/eyebrow), 28 semantic
roles invented, Layer 1.5 roles, 7 estratégias canônicas
(mechanic-swap/tinted-brand/frosted-opt-in/…), voice tokens per
archetype.

**Vocabulário oficial:** shadcn-canonical ~45 keys (TweakCN-vocab — validado Fase -1).
Extras opt-in decididos após estudo prévio.

## Referências

- Auditoria: `docs/_sessions/2026-05-21-auditoria-pivot-tweakcn.md`
- Análise reversão: `docs/_sessions/2026-05-21-reversion-analysis.md`
  (recomenda Option C surgical delete)
- Plano executável: `docs/plans/pivot-tweakcn.md` (Fase -1 + Fase 0-8)
- Anatomia TweakCN: `docs/research/28-tweakcn-evaluation.md`
- Estudos prévios (caveat de inferência):
  `docs/research/29-token-partition-universal-vs-tenant.md`,
  `docs/research/30-color-format-culori-integration.md`,
  `docs/research/31-zod-schema-shadcn-canonical.md`
- ADR-0043 (superseded por esta) — design system architecture
  consolidated 22 archetypes
- ADR-0033 — schema único `public.*` (mantido)
- ADR-0039 — entitlements RPCs (mantido)
- ADR-0040 §H — APCA Silver (mantido)
- ADR-0041 — engine catalog 2 motores (reusado em Fase 4
  `*_versions` pattern + Fase 7 `tenant_pages`/`tenant_blocks`)
- Repo TweakCN clone (read-only SSOT):
  `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, branch
  `main`, Apache-2.0)
- Repo TweakCN upstream: <https://github.com/jnsahaj/tweakcn>
- Editor TweakCN: <https://tweakcn.com/editor/theme>
