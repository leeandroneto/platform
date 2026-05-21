# 08. Lint / Hooks / Rules — audit "o que cai, o que fica"

> Status: audit em curso — checando o que conflita com nova arquitetura
> Última atualização: 2026-05-19
> Bloqueado por: decisão final dos tokens + 3 vs 4 dimensões + clone-first

---

## Inventário atual

### ESLint config

- `eslint.config.mjs` (raiz)
- Regras específicas de design tokens: `design-tokens/no-tailwind-bypass`
- Path overrides per arquivo (ADR-0040 §A)

### Hooks (`.claude/hooks/`)

8 hooks ativos:

| Hook                         | Função                                                             | Compatível com novo? |
| ---------------------------- | ------------------------------------------------------------------ | -------------------- |
| `block-disable-content.sh`   | Bloqueia `// eslint-disable` sem justificativa                     | ✅ mantém            |
| `block-token-bypass.sh`      | Bloqueia hex/font literal fora de allowlist                        | ⚠️ precisa expandir  |
| `component-research-gate.sh` | Bloqueia Write/Edit em `components/ui/*` sem marker `// RESEARCH:` | ✅ mantém            |
| `format-on-write.sh`         | Roda formatter após Write                                          | ✅ mantém            |
| `load-context.sh`            | Carrega CLAUDE.md no SessionStart                                  | ✅ mantém            |
| `post-shadcn-add.sh`         | Injeta checklist 6 passos após `npx shadcn add`                    | ✅ mantém            |
| `protect-eslint.sh`          | Bloqueia edição `eslint.config.mjs` sem ADR                        | ✅ mantém            |
| `vocab-warn.sh`              | Warn em vocab banido (`field`, `question`, `revision`, etc)        | ⚠️ precisa expandir  |

### Rules path-loaded (`.claude/rules/`)

20 rules ativas:

| Rule                   | Status pós-design-system rethink                                           |
| ---------------------- | -------------------------------------------------------------------------- |
| `abstractions.md`      | ✅ mantém                                                                  |
| `brand.md`             | ✅ mantém — vai ganhar `data-template`/`data-palette` runtime              |
| `components.md`        | ⚠️ revisar — pode precisar bullet sobre 3-camadas + Kholmatova vocab       |
| `contrast.md`          | ✅ mantém — APCA Silver continua válido                                    |
| `data-layer.md`        | ✅ mantém — não toca em design                                             |
| `design-references.md` | ⚠️ revisar — `13 paletas como dimensão color`, clone-first strategy        |
| `design-tokens.md`     | ⚠️ revisar — novos tokens (shadow-card-1-5, radius-soft, container-widths) |
| `docs-writing.md`      | ✅ mantém                                                                  |
| `domain-logic.md`      | ✅ mantém                                                                  |
| `entitlements.md`      | ✅ mantém                                                                  |
| `features.md`          | ✅ mantém                                                                  |
| `forms-engine.md`      | ✅ mantém                                                                  |
| `i18n.md`              | ⚠️ revisar — pesquisa 26 mencionou `[lang]` overrides em line-height       |
| `jwt-claims.md`        | ✅ mantém                                                                  |
| `layers.md`            | ✅ mantém                                                                  |
| `naming.md`            | ⚠️ revisar — vocab Kholmatova (atoms/molecules/organisms)                  |
| `server-actions.md`    | ✅ mantém                                                                  |
| `shadcn-zone.md`       | ⚠️ revisar — adicionar 3-camadas + Origin UI/Kibo/etc + composability rule |
| `tenant-content.md`    | ⚠️ revisar — tenant_copy_overrides + escolha template/palette runtime      |

---

## O que CAI (revogar/refatorar)

### `design-tokens.md` — bullet "3 elevations" → "5 stacked shadows"

Atual: 3 níveis flat/raised/overlay (ADR-0042).
Novo: 5 níveis stacked (Vercel canon) + per-archetype mapping.

→ ADR-0042 vira **superseded** (não revogado — fica como histórico) por nova ADR pós-pesquisas.

### `design-tokens.md` — bullet "8 radius níveis"

Atual: 8 níveis.
Novo: 13 níveis (adiciona `--radius-soft: 14px` + outros gaps).

### `design-tokens.md` — bullet "3 typography primitives"

Atual: Heading/Text/Muted + 9 JIT.
Novo: 12 polymorphic derivados de `data-template`.

→ Não construir os 9 JIT planejados. Refatora pra 12 lendo CSS vars.

### Hook `block-token-bypass.sh` — allowlist precisa expandir

Atual: bloqueia hex/font literal fora de allowlist específica.
Novo: precisa bloquear também:

- Shadow literal `box-shadow: rgba(...)` em código (fora de globals.css)
- Breakpoint literal `1280px` em CSS/inline style
- Container max-width literal
- Aspect ratio literal `aspect-[16/9]` (se não vier de token)

### `naming.md` — vocab adicional

Adicionar termos design system:

- ✅ Aceito: `archetype`, `template`, `palette`, `density` (apesar de absorvida, conceito mantém), `surface`, `ink`, `hairline`, `elevation`
- ❌ Banido (vide Kholmatova): `theme` (vago) — usar `template` ou `palette` específico. `style` (vago) — usar `archetype` ou `variant`.

---

## O que FICA (mantém intacto)

### ADR-0040 — fechamento dia 0

Continua válido:

- 47 shadcn primitives quarentenados ✅
- 3 wrappers obrigatórios (`AppForm`, `AppToast`, `AppEntitlementGate`) ✅
- Wrapper pattern (passthrough proibido) ✅
- APCA Silver gate ✅
- Hook protege `components/ui/*` ✅

→ Nova arquitetura **soma** a ADR-0040 sem revogar.

### Multi-marca via hostname (ADR-0024)

`useBrand()`, `getBrandByHost()` continuam. Vão **ganhar** `data-template`, `data-palette` runtime.

### Schema único `public.*` (ADR-0033)

Não impactado. Tabelas `tenant_brand`, `tenant_photo`, `template_specs` (futuras) ficam em `public.*`.

### APCA Silver gate (`contrast.md`)

Continua. Todo template + palette combo passa validação APCA.

---

## O que GANHA (rules/hooks novos a criar)

### Novo hook — `block-design-token-bypass.sh` (expansão do existente)

Adicionar à allowlist do `block-token-bypass.sh`:

- Bloqueia `box-shadow:` literal fora de `app/globals.css` + `app/styles/templates/*.css`
- Bloqueia `border-radius:` em px literal fora de tokens
- Bloqueia `font-family:` literal
- Bloqueia `transition-duration:` literal (usar `var(--motion-*)`)

### Nova rule `.claude/rules/design-system-architecture.md`

Master rule path-loaded em:

- `app/**`
- `components/**`
- `lib/design/**`
- `lib/motion/**`

Cobre:

- 3 dimensões composicional (Template × Palette × Content)
- Clone-first strategy (templates = clones de DESIGN.md)
- Hierarquia busca (Camadas 1-5 do `07-shadcn-hierarchy.md`)
- Composability rule (functional free, perceptual locked)
- Runtime `:root[data-template][data-palette]`
- Atomic vocab (atoms/molecules/organisms folder organization)

### Nova rule `.claude/rules/photography.md` (futura)

Path-loaded em `lib/photo/**`, `components/app-photo-*`, `app/api/photo/**`.

Cobre:

- Aspect ratio tokens
- Crop strategies
- AI vibe matching usage
- AI gen quota
- Stock library integration

### Nova rule `.claude/rules/pwa-tenant.md` (futura)

Path-loaded em `app/manifest.ts`, `app/api/manifest/**`, `lib/pwa/**`.

Cobre:

- Manifest dinâmico per tenant
- Splash screen matrix
- Service worker scope
- Install fluxos 3-distintos

---

## Tabela "decisão sobre cada peça"

| Peça atual                         | Decisão              | Por quê                                                  |
| ---------------------------------- | -------------------- | -------------------------------------------------------- |
| ADR-0040 (fechamento dia 0)        | ✅ mantém intacto    | Wrapper pattern + quarentena continuam fundamentais      |
| ADR-0042 (3 elevations)            | ⚠️ superseded futuro | Vira 5 stacked shadows; ADR-NN substitui (não revoga)    |
| 13 paletas OKLCH                   | ✅ mantém            | Viram dimensão color overlay                             |
| 47 shadcn primitives quarentenados | ✅ mantém            | Ganham variant resolution per `data-template`            |
| 8 radius levels                    | ⚠️ expande pra 13    | Adiciona `--radius-soft: 14px` + outros gaps             |
| 3 typography primitives            | ⚠️ refatora pra 12   | Polymorphic derivados de `data-template`                 |
| 5 shape presets                    | ⚠️ revisar           | Pode mesclar com radius/elevation tokens                 |
| `useBrand()` / `getBrandByHost()`  | ✅ mantém            | Ganha `data-template`/`data-palette` no `<html>`         |
| APCA Silver gate                   | ✅ mantém            | Compatibility matrix Zod inclui APCA check               |
| Hook `block-token-bypass.sh`       | ⚠️ expande allowlist | Bloqueia shadow/breakpoint/font-family literais          |
| Rule `design-tokens.md`            | ⚠️ revisar           | Atualizar tokens canônicos                               |
| Rule `design-references.md`        | ⚠️ revisar           | Adicionar clone-first strategy + IBM/Atlassian/Carbon    |
| Rule `shadcn-zone.md`              | ⚠️ revisar           | Adicionar 3-camadas + Origin UI/Kibo/etc + composability |
| Rule `naming.md`                   | ⚠️ revisar           | Vocab design system + Kholmatova                         |
| Rule `i18n.md`                     | ⚠️ revisar           | `[lang]` overrides em line-height/letter-spacing         |
| Rule `tenant-content.md`           | ⚠️ revisar           | Tenant pode escolher template/palette runtime            |

---

## Pendências

- [ ] Auditar `eslint.config.mjs` em detalhe — listar todas regras atuais
- [ ] Verificar `block-token-bypass.sh` allowlist atual
- [ ] Listar todas tokens em `app/globals.css` (linha por linha)
- [ ] Verificar `lib/design/palettes.ts` — 13 paletas + sub-variants (accent/hover/active/focus/subtle/strong)
- [ ] Auditar conflitos entre rules (i18n.md mencionou conflito com forms-engine.md inline copy)
- [ ] Decidir naming convention final (numeric vs semantic tokens)
- [ ] Cravar nova rule master `design-system-architecture.md` quando decisões fecharem
- [ ] Refatorar rules existentes (~7 marcadas com ⚠️) pós-decisões

---

## Princípios pós-revisão

1. **Nada quebra dia 0** — ADRs 0040/0042/0033/0024 mantidos
2. **Tokens novos somam** — não revogam tokens antigos
3. **Rules ⚠️ aguardam decisões cravadas** — não atualizar prematuramente
4. **Hooks reforçam, nunca bloqueiam decisão** — guardrails só
5. **ESLint só roda em PR/build** — não em IDE Claude Code escrevendo docs
