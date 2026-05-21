# Plano: Pivot pra TweakCN-way + shadcn-canonical

> **Tipo:** plano ativo (substitui `docs/plans/design-system.md` — que vai pra `docs/_archive/plans/`)
> **Início:** 2026-05-21
> **Última atualização:** 2026-05-21 (princípios 8-10 cravados — extract+adapt, versionamento, audit-per-phase)
> **Estimativa total:** 120-160h (~3-4 semanas full-time, 6-8 semanas part-time)
> **Status:** Fase -1 (TweakCN clone) ✅ → Fase 0 (surgical delete) → Fase 1 estudos prévios validados
> **Pré-leitura obrigatória:**
>
> - `docs/_sessions/2026-05-21-auditoria-pivot-tweakcn.md` (auditoria HIGH-confidence)
> - `docs/_sessions/2026-05-21-reversion-analysis.md` (Option C surgical delete escolhida)
> - `docs/research/28-tweakcn-evaluation.md` (anatomia TweakCN)
> - `docs/_sessions/2026-05-21-tweakcn-canonical-vs-invented.md` (inflexão estratégica)
>
> **TweakCN clone (SSOT pra adaptação direta):**
> `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, branch `main`, Apache-2.0) — read-only.

---

## 0. Princípios não-negociáveis

Este plano nasce do reconhecimento de que a fase anterior implementou 9.580 LOC em `lib/design/archetypes/`, 67 invented `--role-*` tokens, 5 ESLint custom rules e um Zod contract de 19+ sub-schemas **sem nunca renderizar um único archetype em runtime real**. A primeira tentativa de showcase end-to-end (2026-05-21) destapou 9 bugs cascateados, 6 dos quais foram workarounds em vez de fixes definitivos.

**Os 10 princípios que regem este plano:**

1. **TweakCN clone como SSOT antes de qualquer implementação.** Repo
   real read-only em `C:\Users\leean\Desktop\tweakcn-ref\` (Apache-2.0).
   Fase -1 (clone) precede qualquer decisão arquitetural — mata
   inferência via WebFetch dos estudos S1.1/S1.2/S1.3.
2. **Study-first em CADA fase.** Decisão arquitetural só após estudo prévio com dados. Sem cravar martelo "do gut". Cada fase abre com checklist `☐ Estudo prévio Sx.y — decide [X]` que precisa estar 100% antes da execução.
3. **Universal imutável vs per-tenant personalizável — distinguir SEMPRE.** Mobile chrome (`--touch-min`, `--inset-safe-*`, breakpoint 768px), z-index, motion durations canonical, spacing Carbon 8-base, APCA Silver thresholds são **universais** — vivem em `globals.css` fora do tema. Cores, fontes, radius, shadow são **per-tenant** — vivem no DB.
4. **shadcn-canonical é a interface pública.** Os ~45 keys TweakCN-vocab (32 cores + 3 fontes + radius + 6 shadow primitives + shadow-color + letter-spacing + spacing-opt) são a superfície que o ecossistema (v0.dev, shadcn blocks, Kibo, Origin, MCP `shadcn@canary registry:mcp`) reconhece. Extras opt-in (frosted-mobile, native aliases archetype-specific) só após estudo prévio comprovar valor.
5. **Build verde a cada commit.** Sequência projetada pra manter `pnpm build && pnpm typecheck && pnpm lint --max-warnings 0` verde no fim de cada commit. Quebras intencionais (ex: Fase 0 surgical delete) são consertadas no mesmo commit antes do push.
6. **Visual check a cada etapa, não a cada fase.** Cada item executável termina com `pnpm dev` + verificação manual de rota afetada antes de marcar done. Nada de "vou testar visualmente no final".
7. **Delete > move-to-legacy.** Sem `..\platform-legacy\` folder. Sem
   stubs temporários. Surgical delete no working tree + 1 commit grande
   (Option C de `docs/_sessions/2026-05-21-reversion-analysis.md`). Git
   history preserva trabalho pra revert JIT — sem dead code circulando.
8. **Extrair lógica + adaptar — NUNCA copy literal cego.** TweakCN é
   single-tenant SaaS sem white-label, sem multi-brand, sem PWA, sem
   safe-area, sem `getRouteByHost`. Nosso código adapta a LÓGICA dele
   (algoritmo `getShadowMap()`, schema 32-cores, OKLCH-primary, editor
   UX, `<style precedence="theme">` hoist) pro nosso cenário:
   multi-tenant via `tenants.id` + RLS, white-label via `brands` lookup
   - `useBrand()`, PWA via manifest/icon dinâmico por tenant, safe-area
     iOS via `--inset-safe-*` universal. Linha "adaptado de
     tweakcn-ref/..." em cada arquivo originário.
9. **Versionamento como extensão obrigatória — TweakCN não tem, nós
   precisamos.** Profissional precisa **salvar variações** que gostou
   pra reaproveitar depois (clone preset → tweaks → salva como "Variant
   v2" → volta JIT). TweakCN só tem 1 theme ativo + community gallery
   (sem versionamento por usuário). Estendemos com `tenant_themes` +
   `tenant_theme_versions` (snapshot JSONB imutável, Hotmart-like
   pattern de `*_versions`). Fase 4 entrega versionamento e atende: (a)
   safety net pra revert visual, (b) builder UI "salva variante"
   workflow, (c) cache invalidation via `cacheTag('theme:<id>:<v>')`,
   (d) preview vs publish (active vs draft version).
10. **Cada fase = audit dedicado TweakCN ANTES de implementar.**
    Especialmente Fases 4-7 (theme storage, builder UI, AI generation,
    v0 integration) onde TweakCN tem código adoptable. Pre-study abre
    com `☐ Audit tweakcn-ref/<paths>` listando arquivos exatos a
    inspecionar, comparar com nosso estado, decidir o que extrair vs
    adaptar vs descartar. Fases 1.5, 2, 3, 8 (DB cleanup, mobile/PWA,
    wrappers JIT, showcase) NÃO precisam audit — TweakCN não tem
    código equivalente.

**Vocabulário banido neste plano** (legado a sepultar):

- `archetype` (como conceito de bundle estrutural — sobrevive só como `tenants.archetype_id text` enquanto Fase 4 não migra schema; após Fase 4 vira `preset_id uuid FK`)
- `role-*` (todos os 67 tokens invented)
- `5 slots de tipografia` (display/body/mono/accent/eyebrow)
- `28 semantic roles` invented (D-43)
- `Layer 1.5 roles`
- `7 estratégias canônicas` (mechanic-swap/tinted-brand/frosted-opt-in/etc — TweakCN não fala isso)
- `voice tokens per archetype`

**Vocabulário oficial:** shadcn-canonical ~45 keys (TweakCN-vocab). Extras decididos após estudo prévio.

---

## 0.5. Fase -1 — Clone TweakCN read-only (SSOT)

**Goal:** repo TweakCN clonado em pasta vizinha read-only, fonte
autoritativa pra adaptação direta (mata as inferências de S1.1/S1.2/S1.3).

**Estimativa:** 30-60min (clone + leitura dos arquivos-chave).

**Status atual (2026-05-21):** ✅ CONCLUÍDO. Clone em
`C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, branch `main`,
Apache-2.0).

### 0.5.1 — Clone

```powershell
cd C:\Users\leean\Desktop
git clone https://github.com/jnsahaj/tweakcn.git tweakcn-ref
```

### 0.5.2 — Leitura inicial dos arquivos autoritativos

Arquivos chave (todos lidos em 2026-05-21, confirmados):

| Arquivo                      | Conteúdo confirmado                                                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `config/theme.ts`            | `COMMON_STYLES[]` + `defaultLightThemeStyles` + `defaultDarkThemeStyles` (~45 keys flat, OKLCH)                                                                                                                                                                                                                                                                                            |
| `types/theme.ts`             | `themeStylePropsSchema` Zod monolítico ~78 LOC + `ThemeStylesWithoutSpacing` variant + `Theme` Drizzle infer                                                                                                                                                                                                                                                                               |
| `utils/shadows.ts`           | `getShadowMap()` algoritmo 6→8 níveis (`2xs/xs/sm/md/lg/xl/2xl` + base shadow alias)                                                                                                                                                                                                                                                                                                       |
| `utils/color-converter.ts`   | `colorFormatter()` via culori (hsl/rgb/oklch/hex) + `formatHsl()` Tailwind v3/v4 split                                                                                                                                                                                                                                                                                                     |
| `lib/ai/prompts.ts`          | `GENERATE_THEME_SYSTEM` + `ENHANCE_PROMPT_SYSTEM` (Color Harmony + Font Pairing + Mode-Aware Shadows seções)                                                                                                                                                                                                                                                                               |
| `utils/theme-presets.ts`     | **25 presets** (não 23 como research-28 listou): modern-minimal, violet-bloom, mocha-mousse, amethyst-haze, kodama-grove, cosmic-night, quantum-rose, bold-tech, elegant-luxury, amber-minimal, neo-brutalism, solar-dusk, pastel-dreams, clean-slate, ocean-breeze, retro-arcade, midnight-bloom, northern-lights, vintage-paper, sunset-horizon, starry-night, soft-pop, sage-garden + 2 |
| `db/schema.ts`               | Drizzle schema: `user`/`session`/`theme`/`aiUsage`/`subscription`/`oauth*`/`communityTheme*`/`themeLike`                                                                                                                                                                                                                                                                                   |
| `app/r/themes/[id]/route.ts` | Registry endpoint `force-static` + `shadcn/schema registryItemSchema` validation                                                                                                                                                                                                                                                                                                           |
| `LICENSE`                    | Apache-2.0 confirmado                                                                                                                                                                                                                                                                                                                                                                      |
| `NOTICE`                     | **NÃO existe upstream** — precisamos criar `NOTICE.md` próprio em Fase 5 (atribuição local)                                                                                                                                                                                                                                                                                                |
| `components/editor/`         | hsl-adjustment-controls, color-picker, color-selector-popover, contrast-checker, code-panel, font-picker, shadow-control, theme-control-panel, theme-preset-select, theme-save-dialog, share-dialog, action-bar, ai, css-import-dialog, custom-textarea, inspector-class-item, inspector-overlay, mention-list, slider-with-input, theme-preview                                           |

### 0.5.3 — Atualizar estudos prévios com caveat

Adicionar bloco no topo de `docs/research/{29,30,31}.md` apontando
"validar contra `..\tweakcn-ref\` antes de Fase 1". **Feito 2026-05-21.**

### Checklist verificação Fase -1

- [x] Clone executado (`tweakcn-ref` existe, branch `main`)
- [x] LICENSE Apache-2.0 confirmado
- [x] 9 arquivos-chave lidos + anotados (tabela acima)
- [x] Estudos 29/30/31 receberam caveat de inferência
- [x] Plano + ADR-0044 atualizados pra apontar clone path como SSOT

**Bloqueia:** Fase 0.

---

## 1. Fase 0 — Surgical delete + foundation marcadores

**Goal:** deletar invented layer cirurgicamente no working tree atual
(sem move-to-legacy, sem stubs) + atualizar marcadores documentais.
Build verde ao final do commit único.

**Estimativa:** 4-6h (mais simples que move-to-legacy porque sem stubs).

**Estratégia escolhida:** Option C de
`docs/_sessions/2026-05-21-reversion-analysis.md` (surgical delete + 1
commit grande). NÃO usar `..\platform-legacy\`. NÃO criar stubs.

### 1.1 — ADR-0044 (supersedes ADR-0043) ✅

**Status:** ✅ CRIADO (header marca "supersedes ADR-0043", versão
2026-05-21 com estratégia surgical delete confirmada).

ADR-0043 header já atualizado: `Status: superseded by ADR-0044`.

### 1.2 — Delete `.claude/rules/design-references.md` inteiro

**Faz:** delete direto. **NÃO inverter** a rule — mesmo invertida, sem
escopo de aplicação porque `docs/references/design-systems/` também
será deletado. Rule órfã sem alvo.

```bash
git rm .claude/rules/design-references.md
```

**Validação:** lint markdown não acusa órfão (vamos remover referência
em CLAUDE.md em 1.5).

**Bloqueia:** 1.3.

### 1.3 — Surgical delete invented layer

**Faz:** delete cirúrgico item-por-item no working tree atual. Cada
item validado via `pnpm typecheck` intermediário pra detectar consumers
ocultos.

**Ordem de delete (sequencial, com checks intermediários):**

| #   | Path                                                         | Comando                                                         | Notas                                                             |
| --- | ------------------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1   | `lib/design/archetypes/`                                     | (já-gone no tree atual — skip)                                  | Confirmar com `ls lib/design/archetypes 2>&1`                     |
| 2   | `lib/design/contract/strategy.ts`                            | `git rm lib/design/contract/strategy.ts`                        |                                                                   |
| 3   | `lib/design/contract/roles.ts`                               | `git rm lib/design/contract/roles.ts`                           |                                                                   |
| 4   | `lib/design/contract/voice.ts`                               | `git rm lib/design/contract/voice.ts`                           |                                                                   |
| 5   | `lib/design/contract/typography.ts`                          | `git rm lib/design/contract/typography.ts`                      |                                                                   |
| 6   | `lib/design/contract/illustrations.ts`                       | `git rm lib/design/contract/illustrations.ts`                   |                                                                   |
| 7   | `lib/design/contract/visual.ts`                              | `git rm lib/design/contract/visual.ts`                          |                                                                   |
| 8   | `lib/design/role-resolver.ts`                                | `git rm lib/design/role-resolver.ts`                            |                                                                   |
| 9   | `lib/design/roles.ts`                                        | `git rm lib/design/roles.ts`                                    |                                                                   |
| 10  | `lib/design/contract/index.ts`                               | reescrever vazio ou apenas re-export TweakCN-canonical (Fase 1) | NÃO stub — Fase 1 já cria contract real                           |
| 11  | `components/ds/lazy/` (9 brand-folders)                      | `git rm -r components/ds/lazy/`                                 | Re-add JIT quando feature pedir                                   |
| 12  | `components/ds/<archetype-bound>.tsx` (32 wrappers — review) | per-arquivo via grep                                            | KEEP: app-image, icon, safe-area-wrapper, adaptive-shell (review) |
| 13  | `docs/design-system/` (folder)                               | `git rm -r docs/design-system/` (já vazio)                      |                                                                   |
| 14  | `docs/references/design-systems/` (71+ brand folders)        | `git rm -r docs/references/design-systems/`                     | DELETE inteiro                                                    |
| 15  | `docs/research/20-naming-mappings.md`                        | `git rm docs/research/20-naming-mappings.md`                    |                                                                   |
| 16  | `docs/research/26-design-system-vibes.md`                    | `git rm docs/research/26-design-system-vibes.md`                |                                                                   |
| 17  | `docs/research/27-design-tokens-per-archetype.md`            | `git rm docs/research/27-design-tokens-per-archetype.md`        |                                                                   |
| 18  | `messages/pt-BR/voice/` (10 archetype voice JSONs)           | `git rm -r messages/pt-BR/voice/`                               |                                                                   |
| 19  | `.claude/worktrees/agent-a346e91b13e285d70/`                 | `git rm -r .claude/worktrees/agent-a346e91b13e285d70/`          | Obsoleto                                                          |
| 20  | `.claude/worktrees/agent-a60ee799e6d5abc0d/`                 | `git rm -r .claude/worktrees/agent-a60ee799e6d5abc0d/`          | Obsoleto                                                          |
| 21  | `app/showcase/`                                              | (já-gone no tree atual — skip)                                  |                                                                   |

**Critério review wrappers (item 12):** abrir cada arquivo e grep:

```bash
grep -E "var\(--role-|--font-(display|body|accent|eyebrow)|archetype" components/ds/<file>.tsx
```

- 0 ocorrências → KEEP candidate (move pra `components/` simplificado em Fase 3) ou DELETE se redundante a shadcn
- ≥1 ocorrências → DELETE direto (re-add JIT em Fase 3 sem invented)

**Lista review prioritária KEEP (verificar antes de deletar):**

- `components/ds/icon.tsx` + stories — `<Icon>` é abstração canônica CLAUDE.md
- `components/ds/app-image.tsx` + stories — `<AppImage>` é abstração canônica
- `components/ds/safe-area-wrapper.tsx` + stories — encapsula `env(safe-area-inset-*)` universal
- `components/ds/adaptive-shell.tsx` — pattern útil mobile/desktop responsive

### 1.4 — Reescrever consumers órfãos no MESMO commit

**Faz:** ajustes cirúrgicos pra build voltar verde após deletes.

Esperados:

- `app/layout.tsx` — `resolveTheme()` ou import de `lib/design/contract/*` que sumiu → ajusta pra retornar `{ ctx, css }` mínimo (não stub — função real reduzida).
- `lib/design/contract/index.ts` — re-escreve só com exports válidos pós-delete (ainda mantém `tokens.ts`, `mobile.ts`). Fase 1 troca por `theme.ts` shadcn-canonical.
- `lib/route/getRouteByHost.ts` — já robusto (commit `4ce11a4`), só validar não-quebrou.
- `eslint.config.mjs` — se houver regra apontando pra path deletado, remover.
- `messages/pt-BR/*.json` que importavam de `voice/` — remover linhas órfãs.

**Validação:**

```bash
pnpm typecheck     # 0 erros
pnpm lint --max-warnings 0
pnpm build         # verde
```

### 1.5 — Atualizar `CLAUDE.md`

**Faz:** edição cirúrgica pra refletir pivot.

**Removidos:**

- Bullet "Design system (ADR-0043 consolidado)" inteiro
- Bullet "5 ESLint rules ADR-0043 (`ds-governance/*`)"
- Linha "Plano ativo (agora) `docs/plans/design-system.md`" da tabela
- Linhas "Design system — fonte única `docs/design-system/ARCHITECTURE.md`" + "Pesquisas design system"
- Linha "design-references" em `.claude/rules/*.md` (rule deletada em 1.2)
- Referência a "design-references" no parágrafo dos rules path-loaded

**Adicionados:**

- Bullet "**Design system (ADR-0044 pivot, supersedes ADR-0043):** shadcn-canonical ~45 keys TweakCN-vocab como interface pública. Multi-tenant runtime mantido via `getRouteByHost` + `<style precedence="theme">`. APCA Silver mantido. Mobile primitives universais. Presets construídos copiando tokens literais (5-7 dia 1). TweakCN clone read-only em `C:\Users\leean\Desktop\tweakcn-ref\` como SSOT pra adaptação direta."
- Linha "Plano ativo (agora) `docs/plans/pivot-tweakcn.md` (Fase -1 ✅ + Fase 0-8)" na tabela
- Linha "TweakCN clone (SSOT) `C:\Users\leean\Desktop\tweakcn-ref\`" na tabela

**Validação:** lint markdown.

**Bloqueia:** 1.6.

### 1.6 — Arquivar plano antigo + atualizar índice

**Faz:**

```powershell
Move-Item -Path "C:\Users\leean\Desktop\platform\docs\plans\design-system.md" `
          -Destination "C:\Users\leean\Desktop\platform\docs\_archive\plans\design-system-superseded-2026-05-21.md"
```

Atualiza `docs/plans/README.md`:

| Plano              | Status                   | Bloqueia                | Bloqueado por             |
| ------------------ | ------------------------ | ----------------------- | ------------------------- |
| `pivot-tweakcn.md` | ativo (Fase -1✅/Fase 0) | `funil-agencia.md`      | nada                      |
| `funil-agencia.md` | pausado                  | M2 (1º tenant Pacote A) | `pivot-tweakcn.md` Fase 4 |

Atualiza `docs/_archive/plans/README.md` adicionando entrada
`design-system-superseded-2026-05-21.md`.

Atualiza `docs/_status.md` com "Pivot iniciado 2026-05-21 — ADR-0044
supersedes ADR-0043 — estratégia surgical delete (Option C) — TweakCN
clone em ../tweakcn-ref".

Atualiza `CHANGELOG.md` seção `[Unreleased]`:

```markdown
### Changed

- **Design system pivot pra shadcn-canonical + TweakCN-inspired** (ADR-0044 supersedes ADR-0043). 22 archetypes + 67 invented roles + 5 font slots + voice tokens + 71+ DESIGN.md references deletados (surgical delete, git history preserva). Novo plano `docs/plans/pivot-tweakcn.md`. TweakCN clone read-only em `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, Apache-2.0) como SSOT pra adaptação direta. Multi-tenant runtime, APCA Silver, mobile primitives universais mantidos.
```

**Bloqueia:** 1.7.

### 1.7 — Commit único Fase 0

**Faz:** stage tudo + 1 commit grande.

```bash
git add -A
git status  # confirma escopo
git commit -m "chore(design-system): pivot TweakCN/shadcn-canonical (ADR-0044 supersedes 0043)"
```

**Mensagem completa sugerida:**

```
chore(design-system): pivot TweakCN/shadcn-canonical (ADR-0044 supersedes 0043)

- Surgical delete: 22 archetypes (já-gone) + 6 sub-schemas contract invented +
  role-resolver + roles + 9 lazy archetype components + 32 wrappers DS
  archetype-bound + 71+ DESIGN.md references + 10 voice JSONs + 3 research
  docs (20-naming-mappings, 26-vibes, 27-tokens-per-archetype)
- Mantidos: multi-tenant runtime (ADR-0024 via getRouteByHost +
  <style precedence="theme">), APCA Silver, mobile primitives universais
  (touch-min, safe-area, dvh, frosted), Kibo UI + shadcn primitives,
  Migration 0023 GRANT + 0022 showcase tenant
- Estudos S1.1/S1.2/S1.3 mantidos com caveat de inferência (validar
  contra ../tweakcn-ref antes de Fase 1)
- TweakCN clone read-only em C:\Users\leean\Desktop\tweakcn-ref\ (commit
  9adabcf9, Apache-2.0) como SSOT pra adaptação direta
- Novo plano docs/plans/pivot-tweakcn.md (Fase -1 ✅ + Fase 0-8)
```

### Checklist verificação Fase 0

- [x] Fase -1 concluída (TweakCN clone + 9 arquivos lidos + caveats em 29/30/31)
- [ ] ADR-0044 atualizado (estratégia surgical delete cravada) — ✅
- [ ] `.claude/rules/design-references.md` deletado inteiro
- [ ] Surgical delete executado (21 itens; ~13 confirmados deletáveis, ~8 review one-by-one)
- [ ] `app/layout.tsx` + `lib/design/contract/index.ts` ajustados (sem stubs)
- [ ] CLAUDE.md atualizado (remove rules antigas, adiciona ADR-0044 + clone path)
- [ ] Planos rearranjados (design-system → archive, pivot-tweakcn → ativo)
- [ ] CHANGELOG atualizado
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm lint --max-warnings 0` ✅
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit` ✅
- [ ] `pnpm build` ✅
- [ ] `pnpm dev` + visitar `/` confirma sem 500
- [ ] Commit único feito (não-push até user revisar)

---

## 2. Fase 1 — Foundation reset (Estudos S1.\* + execução)

**Goal:** trocar `app/globals.css` por shadcn-canonical ~45 keys + contract Zod novo + build-theme-css emitindo canonical. Após esta fase, qualquer tenant existente carrega CSS canonical (visualmente o site fica "shadcn default + tenant primary").

**Estimativa:** 12-16h (4-6h estudos + 8-10h execução)

### Pre-fase: estudos prévios

> **⚠️ Status pré-Fase 1 (2026-05-21):** os 3 estudos S1.1/S1.2/S1.3
> existem em `docs/research/29-31` mas foram feitos via **inferência**
> WebFetch + research-28, ANTES do clone local do TweakCN. Pré-Fase 1,
> **validar conclusões contra `C:\Users\leean\Desktop\tweakcn-ref\`**
> (commit `9adabcf9`). Caveat já anotado no topo de cada research doc.
> Algumas conclusões podem precisar refinar.

#### Estudo S1.1 — Particionar ~45 keys em universal vs per-tenant

**Pergunta:** dos ~45 keys TweakCN-vocab, quais ficam em `globals.css` (universal, fora do tema) vs quais entram em `<style precedence="theme">` (per-tenant, runtime injection)?

**Como:**

1. Listar os ~45 keys com classificação tentativa
2. Confrontar com TweakCN (eles colocam TUDO per-tenant — sem split)
3. Decidir: nós podemos ser mais granulares (ex: `--radius` é geralmente universal por archetype-feel; cores são definitivamente per-tenant)
4. Output: tabela `token → escopo`

**Hipótese a confirmar:** 32 cores + 3 fontes + 1 radius + 6 shadow primitives + shadow-color + letter-spacing + spacing-opt TODOS per-tenant. Universais ficam só: motion durations/easings, z-index, breakpoint, spacing scale numérica Carbon, mobile primitives (touch-min/safe-area/dvh/frosted), APCA thresholds.

**Output:** `docs/research/29-token-partition-universal-vs-tenant.md` (~600 palavras).

#### Estudo S1.2 — Integração culori + TweakCN color-converter

**Pergunta:** já temos `culori` instalado (lib/design/palettes.ts). TweakCN tem `lib/utils/color-converter.ts` que suporta HEX/HSL/OKLCH/RGB. Nosso `build-theme-css.ts` deveria emit em qual formato?

**Como:**

1. Confirmar `culori` na dep tree (`pnpm why culori`)
2. Ler TweakCN `lib/utils/color-converter.ts` (~50 LOC, copy candidate)
3. Decidir: emitimos em OKLCH (proven em prod, browsers modernos suportam) + APCA opera em OKLCH nativo → consistência
4. Output: padrão definitivo: armazena em DB como string OKLCH (`"oklch(0.55 0.2 270)"`), `build-theme-css` emite OKLCH literal, color-converter só usado em builder UI (Fase 5)

**Output:** decisão registrada em §2 do plano + commit em `lib/design/color-format.ts` se virar utility.

#### Estudo S1.3 — Schema Zod shadcn-canonical mínimo

**Pergunta:** qual é o schema Zod mais simples que cobre os ~45 keys shadcn-canonical?

**Como:**

1. Ler `types/theme.ts` do TweakCN (referência canônica do schema flat)
2. Replicar em `lib/design/contract/theme.ts` com `{light: ThemeStyleProps, dark: ThemeStyleProps}` + `common: {fonts, radius, shadows, spacing, letterSpacing}`
3. Confirmar que cobre TUDO sem inflar (no sub-schemas voice/visual/illustrations/roles)
4. Output: contract Zod ~80 LOC vs 600 LOC anteriores

**Output:** `lib/design/contract/theme.ts` (será arquivo executável da Fase 1.1).

### Execução pós-estudos

#### 2.1 — Reescrever `lib/design/contract/`

**Faz:** cria `lib/design/contract/theme.ts` baseado em S1.3. Deleta `lib/design/contract/index.ts` stub (já movido em Fase 0) e cria index.ts novo só re-exportando `ThemeSchema`/`ThemeStyleProps`/`ThemeCommon` types.

**Output:**

- `lib/design/contract/theme.ts` (~80 LOC)
- `lib/design/contract/index.ts` (~10 LOC re-exports)
- Tipo `Theme = z.infer<typeof ThemeSchema>` exportado

**Validação:**

- `pnpm typecheck` 0 erros
- Sem warning de `any` em `lib/design/`

**Bloqueia:** 2.2.

#### 2.2 — Reescrever `app/globals.css`

**Faz:** mantém preamble Tailwind v4 + `@source not` + `@theme` block ESSENCIAL. Substitui as 67 declarações `--role-*` por 28 canonical aliases shadcn (mas comentadas — só carregam via `<style precedence="theme">`, não em globals.css).

**Conteúdo globals.css novo:**

```css
@import 'tailwindcss';
@source not "../.claude";

/* Tailwind v4 default theme block */
@theme {
  /* Spacing scale Carbon 8-base (universal) */
  --spacing-0: 0;
  --spacing-1: 0.125rem;
  /* ... --spacing-32 */

  /* Z-index (universal) */
  --z-content: 0;
  --z-sticky: 10;
  --z-fixed: 20;
  --z-overlay: 30;
  --z-modal: 40;
  --z-popover: 50;
  --z-tooltip: 60;

  /* Motion (universal) */
  --duration-instant: 75ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  /* ... */

  /* Mobile primitives (universal) */
  --touch-min: 44px;
  --mobile-full-height: 100dvh;
  --mobile-nav-height: 56px;
  --fab-size: 56px;
  --sticky-cta-height: 64px;
  --mini-player-height: 64px;
  --press-scale: 0.97;

  /* Breakpoint canonical */
  --breakpoint-mobile: 768px;
}

/* Safe-area (universal, inset env) */
:root {
  --inset-safe-top: env(safe-area-inset-top, 0px);
  --inset-safe-bottom: env(safe-area-inset-bottom, 0px);
  --inset-safe-left: env(safe-area-inset-left, 0px);
  --inset-safe-right: env(safe-area-inset-right, 0px);
}

/* Frosted glass primitives (universal — não branding) */
:root {
  --frosted-blur: 20px;
  --frosted-saturate: 180%;
  --frosted-opacity: 0.7;
}
```

**Validação:**

- `grep -c "^\s*--role-" app/globals.css` retorna **0**
- `grep -c "^\s*--touch-min" app/globals.css` retorna 1 (universal mantido)
- `pnpm build` ✅
- `pnpm dev` + abrir `/` — site renderiza com Tailwind defaults (sem tenant cores ainda, fase 2.4 reintroduz)

**Bloqueia:** 2.3.

#### 2.3 — Reescrever `lib/design/build-theme-css.ts`

**Faz:** função puro `buildThemeCSS(theme: Theme): string` que recebe schema validado e emite CSS string com:

- `:root { /* light tokens */ }` — ~45 keys em OKLCH + fontes + radius + shadows + spacing + letter-spacing
- `:root.dark, .dark { /* dark tokens */ }` — overrides apenas das 32 cores (common compartilhado)

Sem invented roles. Apenas shadcn canonical names: `--background`, `--foreground`, `--card`, `--card-foreground`, etc.

**Output:** ~120 LOC (vs 281 anteriores).

**Validação:**

- Unit test com fixture preset "modern-minimal" (importado do TweakCN em Fase 5) emite CSS válido
- `pnpm typecheck` ✅

**Bloqueia:** 2.4.

#### 2.4 — Atualizar `app/layout.tsx` ThemeStyle integration

**Faz:** ajusta `resolveTheme()` pra retornar `{ ctx, css }` onde `css = buildThemeCSS(themeFromDB)`. Tenant default fica com preset stub "modern-minimal" hardcoded até Fase 4.

**Validação:**

- `pnpm dev` + `/` — site agora tem cores do preset "modern-minimal" via tenant default
- Switch tenant em DB → diff visível

#### 2.5 — Simplificar 5 ESLint rules ds-governance pra 2

**Faz:** edita `eslint.config.mjs` removendo 3 rules + simplificando 2 remanescentes.

**Removidos:**

- `no-raw-tokens-in-components` (sem distinção raw/role)
- `no-icon-bypass` (over-engineered)
- `no-elevation-legacy` (após migration, sem necessidade)

**Mantidos (simplificados):**

- `no-raw-fontfamily` — bloqueia `font-family:` literal e `font-[...]` arbitrary; força `var(--font-sans|serif|mono)` ou Tailwind utility `font-sans/serif/mono`
- `no-vh-in-mobile-aware` — bloqueia `100vh`, força `100dvh` em `components/ds/**` + `app/(pwa)/**`

**Validação:**

- `pnpm lint --max-warnings 0` ✅
- `grep -c "ds-governance" eslint.config.mjs` retorna 2 (vs 5 antes)

### Checklist verificação Fase 1

- [ ] Estudos S1.1, S1.2, S1.3 outputs documentados
- [ ] `lib/design/contract/theme.ts` Zod canonical (~80 LOC)
- [ ] `app/globals.css` sem `--role-*` (universal apenas)
- [ ] `lib/design/build-theme-css.ts` emit canonical OKLCH
- [ ] `app/layout.tsx` integrado com `Theme` novo
- [ ] 5 → 2 ESLint rules ds-governance
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm lint --max-warnings 0` ✅
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit` ✅
- [ ] `pnpm build` ✅
- [ ] `pnpm dev`: `/`, `/login`, `/signup`, `/dashboard` rendem sem 500 (visual = Tailwind defaults + tenant primary)
- [ ] Smoke test: UPDATE em `public.tenants SET primary_color = 'oklch(0.5 0.3 0)'` reflete visualmente após reload

---

## 2.5. Fase 1.5 — DB schema alignment (cleanup pós-Fase 1)

**Goal:** alinhar schema DB com o que Fase 1 removeu do código. Fase 1 removeu
vocab invented do globals.css (`--shape-*`, `--brand-hue`, `--color-surface-1..5`,
`--color-info/success/warning`, `--elevation-flat/raised/overlay`, etc) — agora
nenhum código consome `tenants.archetype_id` / `palette_id` / `font_id` /
`previous_archetype_id` / `archetype_changed_at` nem as tabelas `palettes` /
`fonts` / `tenant_theme_presets`. Essa fase **drops cirurgicamente** os
órfãos. Fase 4 depois cria o modelo novo limpo do zero.

**Estimativa:** 2-3h (sem estudos prévios — auditoria já feita)

**Princípio:** drop **apenas** o que está confirmado órfão. Não criar nada
novo (Fase 4 faz isso). Não tocar `theme_mode` ou `theme_version` (continuam
úteis pós-pivot).

### Pre-fase: confirmação de órfãos

Validar via grep:

```bash
# Confirmar zero consumers no código:
grep -rn "archetype_id\|palette_id\|font_id\|previous_archetype_id" app lib --include="*.ts" --include="*.tsx"
grep -rn "from 'palettes'\|from 'fonts'\|tenant_theme_presets\|.from('palettes'\|.from('fonts'" app lib
```

Esperado: zero matches (ou apenas migrations docs antigas — não bloqueia).

**Bloqueia:** execução do drop.

### Execução — migration 0024

Via `mcp__plugin_supabase_supabase__apply_migration`:

```sql
-- 0024_drop_design_system_orphans.sql
-- Pós-Fase 1 do pivot ADR-0044: zero código consome esses objetos.
-- Antes desta migration: tenants.archetype_id / palette_id / font_id /
-- previous_archetype_id / archetype_changed_at dormentes; tables palettes /
-- fonts / tenant_theme_presets sem consumers.

-- 1. Drop FK constraints + columns de tenants (defaults eram via functions
--    default_palette_id() e default_font_id() — drop em seguida)
ALTER TABLE public.tenants
  DROP COLUMN IF EXISTS archetype_id,
  DROP COLUMN IF EXISTS previous_archetype_id,
  DROP COLUMN IF EXISTS archetype_changed_at,
  DROP COLUMN IF EXISTS palette_id,
  DROP COLUMN IF EXISTS font_id;

-- 2. Drop functions que setavam defaults dessas columns
DROP FUNCTION IF EXISTS public.default_palette_id();
DROP FUNCTION IF EXISTS public.default_font_id();

-- 3. Drop tabelas obsoletas (vocab morto / FKs já cascadeados)
DROP TABLE IF EXISTS public.tenant_theme_presets CASCADE;
DROP TABLE IF EXISTS public.palettes CASCADE;
DROP TABLE IF EXISTS public.fonts CASCADE;

-- 4. Confirmação:
-- tenants agora tem: id, brand_id, slug, name, vertical, logo_url, theme_mode,
-- theme_version, default_locale, default_currency, default_tz, pixels,
-- vapid_public_key, owner_user_id, lifecycle_state, suspended_*, deletion_*,
-- created_at, updated_at, deleted_at.
-- Fase 4 vai ADD active_theme_version_id + criar tenant_themes/_versions.
```

**Validação imediata:**

```sql
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='tenants'
ORDER BY ordinal_position;

SELECT table_name FROM information_schema.tables
WHERE table_schema='public' AND table_name IN ('palettes','fonts','tenant_theme_presets');
-- Esperado: zero rows
```

### Pós-execução — validação aplicação

```bash
pnpm typecheck         # 0 erros (zero código consumia)
pnpm lint --max-warnings 0
pnpm build             # verde
pnpm dev               # / rendera com DEFAULT_THEME (Fase 1 já wired)
```

Atualizar `docs/migrations/0024_drop_design_system_orphans.md` documentando
contexto + colunas/tabelas droppadas + razão (ADR-0044 + Fase 1 output).

Atualizar `lib/contracts/database.ts` se houver types gerados (via
`mcp__plugin_supabase_supabase__generate_typescript_types` — regenerar).

Atualizar `docs/_status.md` + `CHANGELOG.md`.

### Checklist verificação Fase 1.5

- [ ] grep confirma zero consumers das columns/tables droppadas
- [ ] Migration `0024_drop_design_system_orphans` aplicada via MCP
- [ ] `SELECT` post-migration confirma tenants tem apenas columns esperadas
- [ ] `SELECT` post-migration confirma palettes/fonts/tenant_theme_presets gone
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm lint --max-warnings 0` ✅
- [ ] `pnpm vocab:audit && pnpm token:audit` ✅
- [ ] `pnpm build` ✅
- [ ] `pnpm dev` + visita `/` sem 500 (DEFAULT_THEME aplicado)
- [ ] Types regenerated via MCP (se aplicável)
- [ ] `docs/migrations/0024_*.md` criado
- [ ] `docs/_status.md` + `CHANGELOG.md` atualizados
- [ ] Commit `chore(db): fase 1.5 drop design system orphans (adr-0044)`

### O que NÃO faz (escopo deferido pra Fase 4)

- ❌ Não cria `tenant_themes` (Fase 4)
- ❌ Não cria `tenant_theme_versions` (Fase 4)
- ❌ Não adiciona `tenants.active_theme_version_id` (Fase 4)
- ❌ Não importa presets TweakCN como seed (Fase 4-8)
- ❌ Não toca em entitlement tables, plans, subscriptions (escopo zero)

---

## 3. Fase 2 — Estudo mobile/PWA + decisão extras opt-in (decide D2)

**Goal:** decidir o que sobrevive como **extension opt-in sobre shadcn-canonical** vs o que vira universal vs o que joga fora. Output: lista cravada de extras + locais corretos.

**Estimativa:** 8-12h (6h estudos + 2-6h execução)

### Pre-fase: estudos prévios

#### Estudo S2.1 — Inventário mobile/PWA tokens atuais

**Pergunta:** lista tokens mobile/PWA hoje em `globals.css` (linhas mobile-related). Classifica cada um:

- **Universal iOS HIG/Material 3** (touch-min, safe-area-inset, dvh) → ficam em globals.css (já fizemos em 2.2)
- **Mobile chrome opcional** (frosted-blur, fab-size, mini-player-height, sticky-cta-height) → universal ou opt-in?
- **Archetype signature** (era per-archetype; Spotify mini-player, Apple sticky CTA generous) → opt-in via preset extension OU universal?

**Como:** ler todas as linhas com `--mobile-*`, `--touch-*`, `--inset-*`, `--frosted-*`, `--fab-*`, `--mini-player-*` em legacy `app/globals.css` (snapshot pre-pivot) + cross-ref com `docs/blueprint/22-mobile-component-system.md` (já movido pra legacy mas referencia).

**Output:** tabela classificação:

| Token                  | Categoria                                                 | Decisão             |
| ---------------------- | --------------------------------------------------------- | ------------------- |
| `--touch-min`          | iOS HIG universal                                         | KEEP em globals.css |
| `--mobile-nav-height`  | universal                                                 | KEEP                |
| `--fab-size`           | Material 3 universal                                      | KEEP                |
| `--mini-player-height` | Spotify signature → universal opt-in via preset extension | OPT-IN              |
| `--frosted-*`          | iOS-style mobile mas universal pattern                    | KEEP em globals.css |
| ...                    | ...                                                       | ...                 |

**Output:** `docs/research/30-mobile-tokens-partition.md` (~600 palavras).

#### Estudo S2.2 — TweakCN coverage gap

**Pergunta:** dos tokens mobile/PWA inventariados em S2.1, **TweakCN cobre quais?**

**Hipótese:** NENHUM. TweakCN é desktop-first single-user, sem PWA, sem safe-area, sem touch-min.

**Como:** confirmar em `types/theme.ts` + `config/theme.ts` do TweakCN. Cross-ref com `docs/research/28-tweakcn-evaluation.md` §3.

**Output:** confirmação em S2.1 doc + ponto: "extras mobile-pwa são genuinamente nossos diferenciais — manter".

#### Estudo S2.3 — Decisão extras opt-in vs universal

**Pergunta:** modelo de extension. Como tokens extras se integram com shadcn-canonical?

**Opções:**

- **(a) Extras em globals.css universal** (ex: `--frosted-blur` carrega sempre) — simples, mas todo tenant carrega mesmo sem usar
- **(b) Extras em preset extension** (ex: preset "spotify-like" declara `--mini-player-height` no `<style precedence="theme">`) — só carrega quando preset selecionado
- **(c) Mix** — tokens universais mobile (touch/safe-area/frosted) em (a); tokens signature (mini-player, sticky-cta-generous) em (b)

**Como:** confronta com decisão D2 do user ("Distinguir SEMPRE universal/imutável vs personalizável-por-tenant"). User pede (c).

**Output:** decisão cravada: **modelo (c) mix**. Listas finais:

- **(a) Universal globals.css:** touch-min, safe-area-\*, dvh, mobile-nav-height (56px Material 3 canonical), fab-size (56px), frosted-blur/saturate/opacity, press-scale, breakpoint-mobile (768px), z-index, motion, spacing Carbon, APCA thresholds
- **(b) Preset extension opt-in:** mini-player-height (preset "spotify-like" only), sticky-cta-height (preset "apple-mobile-generous" only) — TBD na Fase 3 quando construirmos presets

### Execução pós-estudos

#### 3.1 — Aplicar decisões S2.3 em `app/globals.css`

**Faz:** adiciona tokens mobile classificados como universal (já parcialmente feito em 2.2; agora completa).

**Validação:** `pnpm dev` + simular viewport mobile (devtools) — `--touch-min`, `--inset-safe-bottom` aplicados.

#### 3.2 — Documentar extension contract em `docs/blueprint/`

**Faz:** cria `docs/blueprint/22-theme-extension-contract.md` (~400 palavras) explicando:

- shadcn-canonical 41 = base obrigatória
- Extras opt-in = string-keyed namespace (ex: `theme.extensions = { "mobile-spotify": { miniPlayerHeight: "64px" } }`)
- `buildThemeCSS()` aceita extensions e emite tokens custom no `<style precedence="theme">`
- Component opt-in: wrapper consome via fallback chain `var(--mini-player-height, 64px)` — graceful degradation se preset não declarar

#### 3.3 — Atualizar `.claude/rules/design-tokens.md`

**Faz:** reescreve rule com tabela shadcn-canonical 41 + seção extras opt-in.

### Checklist verificação Fase 2

- [ ] Estudos S2.1, S2.2, S2.3 outputs documentados
- [ ] `docs/research/30-mobile-tokens-partition.md` escrito
- [ ] `docs/blueprint/22-theme-extension-contract.md` escrito
- [ ] `.claude/rules/design-tokens.md` atualizado
- [ ] `app/globals.css` completo (universal mobile + frosted)
- [ ] `pnpm build` ✅
- [ ] `pnpm dev` mobile viewport: touch areas ≥44px confirmado via devtools
- [ ] Smoke test: rota mobile-aware (`app/(pwa)/...`) renderiza sem 100vh warnings

---

## 4. Fase 3 — Wrappers DS migration (Estudos S3.\* + execução)

**Goal:** 41 wrappers DS em `components/ds/*.tsx` consomem shadcn-canonical aliases em vez de `var(--role-*)`. 68% já fazem (auditoria); 32% precisa migration mecânica + lógica.

**Estimativa:** 14-18h

### Pre-fase: estudos prévios

#### Estudo S3.1 — Mapping `--role-*` → shadcn-canonical

**Pergunta:** lista exaustiva de qual `--role-X` mapeia em qual shadcn alias.

**Output:** tabela cravada (em `docs/research/31-roles-to-canonical-mapping.md`):

| `--role-*` (invented)      | shadcn-canonical                            | Notas                  |
| -------------------------- | ------------------------------------------- | ---------------------- |
| `--role-text-emphasis`     | `--foreground`                              | direct                 |
| `--role-text-body`         | `--foreground`                              | redundância removida   |
| `--role-text-muted`        | `--muted-foreground`                        | direct                 |
| `--role-text-disabled`     | `text-muted-foreground/50` (Tailwind alpha) | semantic loss aceito   |
| `--role-surface-container` | `--card`                                    | direct                 |
| `--role-feature-card-bg`   | `--card`                                    | direct                 |
| `--role-accent-primary`    | `--primary`                                 | direct                 |
| `--role-accent-subtle`     | `--accent`                                  | direct                 |
| `--role-shadow-card`       | `shadow-md` Tailwind utility                | semantic → algorithmic |
| `--role-shadow-fab`        | `shadow-lg`                                 | algorithmic            |
| `--role-img-aspect-hero`   | (drop)                                      | over-engineering       |
| ...                        | ...                                         | ...                    |

**Hipótese (auditoria):** ~25 reskinning direto, ~30 over-engineering (drop), ~12 genuinely new (frosted → manter em globals.css; image tokens → drop maior parte).

#### Estudo S3.2 — 9 lazy archetype-specific destino

**Pergunta:** dos 9 lazy components em `components/ds/lazy/*` (apple, figma, mastercard, mistral, nike, opencode, pinterest, stripe, theverge), quais sobrevivem e onde?

**Critérios:**

- Sobrevive se for **reusable preset-section** (ex: `stripe/gradient-mesh-hero.tsx` pode ser usado em qualquer tenant que escolher preset "stripe-like")
- Archive se for **archetype-bound** (ex: `pinterest/masonry-grid.tsx` só faz sentido se archetype Pinterest sobrevive)

**Output:** tabela em `docs/research/32-lazy-components-triage.md`:

| Component                            | Decisão  | Razão                                   | Destino                                              |
| ------------------------------------ | -------- | --------------------------------------- | ---------------------------------------------------- |
| `apple/alternating-product-tile.tsx` | KEEP     | reusable section, Apple preset survives | `components/sections/alternating-tile.tsx`           |
| `stripe/gradient-mesh-hero.tsx`      | KEEP     | reusable, qualquer preset com mesh      | `components/sections/gradient-mesh-hero.tsx`         |
| `nike/campaign-tile.tsx`             | KEEP     | reusable                                | `components/sections/campaign-tile.tsx`              |
| `figma/color-block-section.tsx`      | DELETE   | Figma archetype dropping                | (git history preserva — re-add JIT se feature pedir) |
| `mistral/sunset-stripe-band.tsx`     | DELETE   | Mistral archetype dropping              | (git history preserva)                               |
| `mastercard/satellite-cta.tsx`       | DELETE   | archetype dropping                      | (git history preserva)                               |
| `opencode/tui-mockup.tsx`            | DELETE   | very archetype-specific                 | (git history preserva)                               |
| `pinterest/masonry-grid.tsx`         | EVALUATE | masonry é universal                     | `components/sections/masonry-grid.tsx` se KEEP       |
| `theverge/story-stream.tsx`          | DELETE   | archetype-specific                      | (git history preserva)                               |

> **Nota:** Fase 0 já deletou `components/ds/lazy/` inteiro via surgical
> delete. Esta tabela documenta a decisão histórica de triage. Se
> quisermos re-add algum component "KEEP" em Fase 3, recupera via
> `git show <commit>:<path>` ao re-criar em `components/sections/`.

### Execução pós-estudos

#### 4.1 — Auto-replace mecânico via codemod

**Faz:** script `scripts/codemod-role-to-canonical.ts` que aplica mapping S3.1 em `components/ds/*.tsx`. Vai cobrir ~70-80% dos casos.

**Operação:** regex replace conservador (apenas casos exatos, sem ambiguidade):

```ts
// before: className="bg-[var(--role-feature-card-bg)] text-[var(--role-text-emphasis)]"
// after:  className="bg-card text-foreground"
```

**Validação:**

- `pnpm typecheck` ✅
- `pnpm lint --max-warnings 0` ✅
- `pnpm dev` + rota `/dashboard` — visual checagem manual (mesmo design)
- Diff revisado item por item antes commit

#### 4.2 — Ajustes manuais em wrappers complexos

**Faz:** wrappers que codemod não conseguiu cobrir 100%:

- `components/ds/app-image.tsx` — dropa todos os 19 image tokens, usa Tailwind utilities + `next/image` defaults
- `components/ds/app-fab.tsx` — `shadow-lg` em vez de `var(--role-shadow-fab)`
- `components/ds/icon.tsx` — usa `currentColor` em vez de `var(--role-icon-*)`. Lucide-react import direto, sem wrapper enforcement
- `components/ds/navigation-bottom.tsx` + `navigation-top.tsx` — variants frosted/standard usando `--frosted-*` universal
- `components/ds/app-card.tsx` — `bg-card text-card-foreground` direto

#### 4.3 — Migration lazy components conforme S3.2

**Faz:** (NOTA: Fase 0 já deletou `components/ds/lazy/` inteiro via
surgical delete. Esta etapa vira "re-add JIT" via `git show <commit>:<path>` quando feature pedir.)

- KEEP candidates: ao precisar feature, recupera `components/ds/lazy/<brand>/<name>.tsx` do commit `a56a7d9` e cria denominalizado em `components/sections/<name>.tsx`
- ARCHIVE candidates: simplesmente não re-add. Git history preserva pra futura consulta.

#### 4.4 — Stories DS atualizadas

**Faz:** atualiza `*.stories.tsx` afetadas (estimativa 20-30% das 40 stories) pra usar shadcn-canonical em fixtures e remove decorators relacionados a archetype global types.

#### 4.5 — Smoke test renders

**Faz:** abre Storybook (`pnpm storybook`), valida que TODAS as stories renderizam sem erro de console.

### Checklist verificação Fase 3

- [ ] Estudos S3.1, S3.2 outputs documentados
- [ ] Codemod script `scripts/codemod-role-to-canonical.ts` rodado e revisado
- [ ] Ajustes manuais em 6+ wrappers
- [ ] Lazy components triados (KEEP/ARCHIVE)
- [ ] Stories DS atualizadas
- [ ] `grep -c "var(--role-" components/` retorna **0** (excluindo legacy)
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm lint --max-warnings 0` ✅
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit` ✅
- [ ] `pnpm build` ✅
- [ ] `pnpm storybook` — 100% stories sem erro console
- [ ] Visual: `/` + `/dashboard` + `/login` + `/signup` renderizam com Tailwind shadcn defaults + tenant primary

---

## 5. Fase 4 — Theme storage + versionamento (Estudos S4.\* + execução, decide D4+D5)

**Goal:** schema DB completo pra theme storage. Migration aplicada. Server actions saveTheme/listVersions/restoreVersion. Tabelas `tenant_themes`, `tenant_theme_versions`, `tenant_blocks`, `tenant_pages` desde dia 0 (arch, decisão D3) — features JIT atrás de gates.

**Estimativa:** 18-25h (10h estudos incluindo audit + 8-14h execução)

### Nota integrar `next-themes` 0.4.6 (já instalado, dead dependency)

**Estado 2026-05-21:** `package.json` tem `"next-themes": "^0.4.6"` mas grep confirma **zero usos** em `**/*.{ts,tsx}` — instalado mas nunca wired up (provavelmente herança da era invented).

**Decisão pra Fase 4:** wire-up oficial junto com layout integration (5.3).

**O que next-themes resolve (que ia ser código manual nosso):**

- Toggle light/dark/system no cliente (sem reload)
- Persist escolha em localStorage
- Script anti-FOUC no `<head>` (adiciona/remove `.dark` em `<html>` antes do React hidratar)
- Detect `prefers-color-scheme: dark`

**Como se encaixa nas camadas:**

| Camada                                  | Quem resolve                                                         |
| --------------------------------------- | -------------------------------------------------------------------- |
| Quais cores o tenant tem (32 OKLCH × 2) | `tenant_themes` + `tenant_theme_versions` (Fase 4)                   |
| CSS hoisted pro browser                 | `buildThemeCSS(snapshot)` + `<style precedence="theme">` (Fase 1 ✅) |
| Modo ativo agora (light/dark/auto)      | **`next-themes`** (Fase 4 wire-up)                                   |
| Default mode do tenant                  | `tenants.theme_mode` (já existe — confirmado G.4)                    |

**Tasks Fase 4 que mudam:**

- 5.3 (layout integration) inclui `<ThemeProvider>` de `next-themes` com `defaultTheme={tenant.theme_mode}` e `enableSystem`, attribute `class` (compat shadcn-canonical `.dark` variant)
- Verificar se `app/layout.tsx` precisa wrappear `<html suppressHydrationWarning>` (requisito next-themes)
- Toggle button JIT (Fase 5 builder UI tem dark/light preview switch — pode reusar `useTheme()` do next-themes)

### Pre-fase: estudos prévios

#### Estudo S4.0 — Audit TweakCN `db/schema.ts` (princípio §10)

**Pergunta:** como TweakCN modela `theme` no DB? O que extrair vs adaptar vs descartar pro nosso multi-tenant + versionamento?

**Como:**

1. Ler `C:\Users\leean\Desktop\tweakcn-ref\db\schema.ts` — extrair lista colunas de `theme` (Drizzle + Neon)
2. Ler `tweakcn-ref/db/schema/community-themes.ts` (se existir) — pattern community share
3. Ler `tweakcn-ref/actions/themes.ts` — server actions equivalentes (saveTheme, deleteTheme, etc)
4. Mapear: o que cabe em `tenant_themes` (catálogo) vs `tenant_theme_versions` (snapshot imutável Hotmart-like)
5. **Diferenças cravadas a aplicar (princípio §8):** nosso é Supabase Postgres + RLS por `tenant_id`, TweakCN é Drizzle+Neon single-user; nosso tem `*_versions` table separada (princípio §9 — profissional salva variações), TweakCN só tem 1 row mutável por theme; nosso usa `jsonb` snapshot, TweakCN tem colunas flat
6. **Versionamento que TweakCN NÃO tem** (princípio §9): listar workflow "clone variant → tweak → save as v2 → restore v1 quando quiser". Não existe upstream — extensão nossa obrigatória

**Output:** seção em `docs/research/33-theme-versioning-pattern.md` com tabela "TweakCN field → nosso field, EXTRACT/ADAPT/SKIP".

#### Estudo S4.1 — Pattern `form_versions` / `page_versions` aplicável a theme?

**Pergunta:** ADR-0041 + blueprint 21-engine-catalog documentam pattern de versioning Hotmart-like (`*_versions` table + snapshot JSONB + locked-after-first-use). Theme segue mesmo pattern?

**Como:**

1. Ler ADR-0041 §D2-D4 + `docs/blueprint/21-engine-catalog.md` §publishing-pattern
2. Mapear campos: `theme_versions.id`, `theme_versions.tenant_id`, `theme_versions.version_number`, `theme_versions.snapshot jsonb` (= `Theme` Zod), `theme_versions.published_at`, `theme_versions.locked boolean`
3. Decidir: SIM, reusar pattern. Theme version locked após primeiro tenant subscriber renderizar (snapshot imutável)

**Output:** decisão em `docs/research/33-theme-versioning-pattern.md` (~400 palavras).

#### Estudo S4.2 — Schema DB mínimo dia 0

**Pergunta:** quais tabelas? Quais campos? NÃO inflar — JIT pra resto.

**Tabelas dia 0:**

```sql
-- ALTER TABLE existente
ALTER TABLE public.tenants
  ADD COLUMN active_theme_version_id uuid NULL REFERENCES public.tenant_theme_versions(id);
-- archetype_id text remains (legacy alias até Fase 6); palette_id/font_id também (Fase 8 limpa)

-- NEW
CREATE TABLE public.tenant_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  source text NOT NULL CHECK (source IN ('preset', 'custom', 'ai-generated', 'imported-tweakcn')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

CREATE TABLE public.tenant_theme_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  theme_id uuid NOT NULL REFERENCES public.tenant_themes(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  snapshot jsonb NOT NULL,  -- ThemeSchema Zod
  published_at timestamptz NULL,
  locked boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (theme_id, version_number)
);
```

**Tabelas adiadas (JIT, quando precisar):**

- `tenant_blocks` — Fase 7 (v0.dev como feature)
- `tenant_pages` — Fase 7 (v0.dev como feature)

RLS strategy: `tenant_themes` + `tenant_theme_versions` consultam `auth.jwt() ->> 'tenant_id'` (canonical JWT claims pattern, ADR-0033 +0041).

#### Estudo S4.3 — Convergência engines Form/Page com Theme

**Pergunta:** Theme tem ligação com Form Engine ou Page Engine?

**Hipótese:** NÃO direta. Theme aplica globalmente via `<style precedence="theme">`. Forms e Pages renderizam DENTRO do theme atual mas não armazenam tokens próprios. Convergência só no escolhe-preset workflow (Fase 5 builder UI pode reusar Page Engine block patterns pra preview).

**Output:** decisão em S4.1 doc.

### Execução pós-estudos

#### 5.1 — Migration `0024_tenant_themes_versioning.sql` via MCP

**Faz:** aplica migration via `mcp__plugin_supabase_supabase__apply_migration` name=`tenant_themes_versioning`, query=schema S4.2.

**Validação:**

- `mcp__supabase__list_tables` confirma `tenant_themes` + `tenant_theme_versions`
- `mcp__supabase__get_advisors type=security` sem warnings
- `mcp__supabase__generate_typescript_types` atualiza `lib/contracts/database.ts`
- `pnpm typecheck` ✅

#### 5.2 — Server actions saveTheme / listVersions / restoreVersion

**Faz:** cria `app/admin/theme-studio/actions.ts`:

- `saveTheme(input: ThemeSchema): Promise<Result<{ id, version_number }>>` — insere theme + version 1 OU bump version se theme existe
- `listVersions(themeId: string): Promise<ThemeVersion[]>`
- `restoreVersion(versionId: string): Promise<Result<{ active_theme_version_id }>>` — copia snapshot pra nova version locked

#### 5.3 — Atualizar `lib/route/getRouteByHost.ts` pra carregar version ativa

**Faz:** join `tenants.active_theme_version_id` → `tenant_theme_versions.snapshot`. Cache combo key vira `tenant:{id}:version:{version_number}`.

#### 5.4 — Migration data: tenant default carrega preset "modern-minimal"

**Faz:** seed em `lib/design/presets/modern-minimal.ts` (importado em Fase 5; por enquanto inline) + INSERT row em `tenant_themes` + `tenant_theme_versions` v1 pro tenant `showcase` existente.

### Checklist verificação Fase 4

- [ ] Estudos S4.1, S4.2, S4.3 outputs documentados
- [ ] Migration `0024_tenant_themes_versioning` aplicada
- [ ] Types Supabase regenerados (tabelas novas tipadas)
- [ ] Server actions saveTheme/listVersions/restoreVersion implementadas + unit tests
- [ ] `getRouteByHost` lê snapshot da version ativa
- [ ] Tenant `showcase` migrado pra preset modern-minimal v1
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm test` 100% (action unit tests verdes)
- [ ] `pnpm build` ✅
- [ ] Smoke test: `swapTheme` server action UPDATE `active_theme_version_id` → reload site → preset visível mudou

---

## 6. Fase 5 — Builder UI clone TweakCN (Estudos S5.\* + execução)

**Goal:** admin tem `/admin/theme-studio` funcional. Layout 2 painéis (controles + preview), 4 tabs (Colors/Typography/Other/Generate AI-stub), HSL adjustments, color picker stack, contrast checker APCA, code panel multi-formato.

**Estimativa:** 36-48h (6h estudos incluindo audit + 30-42h execução)

### Pre-fase: estudos prévios

#### Estudo S5.0 — Audit TweakCN `components/editor/**` (princípio §10)

**Pergunta:** quais arquivos existem em `tweakcn-ref/components/editor/` e como se relacionam? Dependency graph mínimo pra port em ordem segura.

**Como:**

1. `Glob tweakcn-ref/components/editor/**/*.tsx` — listar todos
2. Pra cada arquivo top-level, identificar imports internos (`@/components/editor/X`) — montar dependency graph
3. Identificar bloqueadores: Zustand stores, `@tanstack/react-query` providers, better-auth hooks (substituir por RHF + RSC + Supabase Auth)
4. Marcar arquivos com `useTransition` candidate vs `useState` simples
5. **Adaptações cravadas (princípio §8):** Zustand store global → RHF form local (já é nossa convenção); URL `?theme=X` state → server action save direto em `tenant_theme_versions`; community gallery `/themes/[id]` → `/admin/theme-studio/library` per-tenant; "fork theme" → "clone variant" (princípio §9)
6. **Versionamento UI** (princípio §9): definir onde no UI mora "Salvar como variante" + "Histórico de variantes" + "Restaurar v1" — TweakCN não tem isso, precisamos desenhar do zero usando pattern Hotmart-like form/page versions

**Output:** seção topo de `docs/research/34-tweakcn-files-triage.md` com dependency graph + lista de bloqueadores + UX delta versionamento.

#### Estudo S5.1 — Arquivos TweakCN copia literal vs adapta vs ignora

**Pergunta:** dado que TweakCN é Apache-2.0, quais arquivos especificamente vamos copiar (com atribuição) vs adaptar vs reescrever?

**Como:** lista arquivo-a-arquivo baseada em `docs/research/28-tweakcn-evaluation.md` §6 + auditoria §2.6.

**Output:** tabela em `docs/research/34-tweakcn-files-triage.md`:

| Arquivo TweakCN                                 | Decisão                                                                 | Destino nosso                                          | Esforço |
| ----------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------ | ------- |
| `components/editor/hsl-adjustment-controls.tsx` | COPY literal + attribution                                              | `components/admin/theme-studio/hsl-controls.tsx`       | 2-3h    |
| `components/editor/color-picker.tsx`            | COPY                                                                    | `components/admin/theme-studio/color-picker.tsx`       | 3h      |
| `components/editor/color-selector-popover.tsx`  | COPY                                                                    | idem                                                   | inclui  |
| `components/editor/contrast-checker.tsx`        | ADAPT (WCAG → APCA Silver dual-gate via nosso `lib/design/contrast.ts`) | `components/admin/theme-studio/contrast-checker.tsx`   | 4h      |
| `components/editor/code-panel.tsx`              | COPY + adapta export pra incluir version metadata                       | `components/admin/theme-studio/code-panel.tsx`         | 4h      |
| `lib/utils/color-converter.ts`                  | COPY                                                                    | `lib/design/color-converter.ts`                        | 1h      |
| `components/editor/font-picker.tsx`             | COPY                                                                    | `components/admin/theme-studio/font-picker.tsx`        | 4h      |
| `app/api/google-fonts/route.ts`                 | COPY                                                                    | `app/api/admin/theme-studio/google-fonts/route.ts`     | 1h      |
| `components/editor/shadow-control.tsx`          | COPY                                                                    | `components/admin/theme-studio/shadow-control.tsx`     | 2h      |
| `components/editor/theme-control-panel.tsx`     | ADAPT (4 tabs, Zustand → useState/RHF)                                  | `app/admin/theme-studio/_components/control-panel.tsx` | 6-8h    |
| `app/editor/theme/*`                            | ADAPT (route layout)                                                    | `app/admin/theme-studio/page.tsx` + `view.tsx`         | 4h      |
| `store/editor-store.ts` Zustand                 | REWRITE (RHF + URL state + server action save)                          | `app/admin/theme-studio/_state/use-theme-form.ts`      | 4h      |
| `db/schema.ts` Drizzle                          | IGNORE (temos Supabase)                                                 | —                                                      | —       |
| `lib/auth.ts` better-auth                       | IGNORE                                                                  | —                                                      | —       |
| `app/api/generate-theme/route.ts`               | ADAPT (Fase 6 — AI generation)                                          | adiado                                                 | adiado  |
| OAuth 2.0 server                                | IGNORE                                                                  | —                                                      | —       |
| TipTap chat editor                              | DEFER (nice-to-have, plan Fase 6)                                       | —                                                      | —       |

#### Estudo S5.2 — Atribuição Apache-2.0 + NOTICE.md

**Pergunta:** formato correto de atribuição Apache-2.0 ao copiar partes de `jnsahaj/tweakcn`?

**Como:** confirma com Apache-2.0 § 4 (Redistribution): preserve copyright notices + state changes + include NOTICE.md.

**Output:** `NOTICE.md` na raiz do projeto:

```markdown
# Third-party attributions

This project includes code adapted from the following Apache-2.0 licensed sources:

## TweakCN (https://github.com/jnsahaj/tweakcn)

Copyright 2025 Sahaj Jain (jnsahaj)
Licensed under the Apache License, Version 2.0.

Files adapted:

- components/admin/theme-studio/hsl-controls.tsx (adapted from components/editor/hsl-adjustment-controls.tsx)
- components/admin/theme-studio/color-picker.tsx
- components/admin/theme-studio/code-panel.tsx (with version metadata extension)
- components/admin/theme-studio/font-picker.tsx
- app/api/admin/theme-studio/google-fonts/route.ts
- lib/design/color-converter.ts

Changes from original:

- Adapted to use Supabase + RLS instead of Drizzle/Neon
- Replaced Zustand state with RHF + Server Actions
- Replaced WCAG contrast with APCA Silver dual-gate
- Removed OAuth 2.0 server, Polar billing, TipTap chat editor

Original LICENSE preserved at vendor/tweakcn/LICENSE
```

#### Estudo S5.3 — Layout shell

**Pergunta:** usa nosso `AdaptiveShell` ou cria admin-specific shell?

**Como:** confronta:

- `AdaptiveShell` é mobile-first (NavigationBottom em mobile, sidebar em desktop) — desenhado pro tenant aluno/profissional
- Theme studio é admin-tool desktop-heavy (2 painéis side-by-side, color picker complexo) — não cabe em mobile

**Output:** decisão: cria `app/admin/_layouts/admin-shell.tsx` desktop-first com sidebar fixa + main panel responsivo. Theme studio é `/admin/theme-studio` dentro desse shell.

### Execução pós-estudos

#### 6.1 — Setup `app/admin/theme-studio/` route + shell

**Faz:**

- `app/admin/layout.tsx` + `_layouts/admin-shell.tsx`
- `app/admin/theme-studio/page.tsx` (RSC, busca tenant theme atual)
- `app/admin/theme-studio/view.tsx` (Client Component, layout 2 painéis)

#### 6.2 — Copia + adapta arquivos TweakCN conforme S5.1

**Faz:** 1 commit por arquivo copiado pra rastreabilidade. Cada commit inclui:

- Arquivo copiado/adaptado
- Header comment apontando origem + diff de changes
- Atualização `NOTICE.md`

#### 6.3 — HSL adjustments + color picker + contrast checker APCA

**Faz:** integra controles em theme studio. Contrast checker substitui `culori.wcagLuminance` por nosso `apca()` de `lib/design/contrast.ts`. Display dual-gate (body Lc ≥75, large ≥60, non-text ≥45).

#### 6.4 — Code panel + font picker + shadow control

**Faz:** painel direito com 3 tabs (CSS Tailwind v4 | shadcn registry export | v0 registry export). Font picker carrega Google Fonts dynamic via endpoint copiado.

#### 6.5 — State management RHF + server action save

**Faz:** `useTheme` form via RHF + Zod resolver (`ThemeSchema`). Submit → `saveTheme` action (Fase 4) → revalida.

#### 6.6 — Preview live com componentes shadcn

**Faz:** painel esquerdo (preview) renderiza componentes shadcn live (Card, Form, Table, Button variants) consumindo theme em edição via `<style>` inline scoped.

### Checklist verificação Fase 5

- [ ] Estudos S5.1, S5.2, S5.3 outputs documentados
- [ ] `NOTICE.md` criado com atribuição Apache-2.0
- [ ] 11 arquivos TweakCN copiados/adaptados
- [ ] Theme studio acessível em `/admin/theme-studio` (gated atrás de entitlement `theme_studio` — Fase 7 inclui flag)
- [ ] HSL adjustments aplicam em real-time no preview
- [ ] Color picker abre + altera tokens individuais
- [ ] Contrast checker APCA dual-gate exibido (todos pares com pass/fail)
- [ ] Code panel exporta CSS Tailwind v4 + shadcn registry JSON
- [ ] Font picker carrega Google Fonts dynamic
- [ ] Save → version v+1 persistida em DB
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm lint --max-warnings 0` ✅
- [ ] `pnpm test` ✅ (RHF + server action coverage)
- [ ] `pnpm build` ✅
- [ ] Visual: cycling 3 presets diferentes via picker → preview muda tudo

---

## 7. Fase 6 — AI generation (Estudos S6.\* + execução)

**Goal:** profissional descreve "vibe" → IA gera ThemeSchema → preview live → save. Image-to-theme upload. Tudo via Gemini através de Vercel AI Gateway.

**Estimativa:** 14-19h (5h estudos incluindo audit + 9-14h execução)

### Pre-fase: estudos prévios

#### Estudo S6.0 — Audit TweakCN `lib/ai/**` + `app/api/generate-theme/route.ts` (princípio §10)

**Pergunta:** TweakCN chama Gemini direto (`@google/generative-ai`). Como adaptar pra Vercel AI Gateway sem perder a lógica de prompt + validação Zod + retry on schema fail?

**Como:**

1. Ler `tweakcn-ref/lib/ai/prompts.ts` (system prompt completo)
2. Ler `tweakcn-ref/app/api/generate-theme/route.ts` (endpoint completo — body parse, error handling, structured output config)
3. Ler `tweakcn-ref/lib/ai/schema.ts` (Zod schema usado em structured output)
4. **Adaptações cravadas (princípio §8):** trocar `@google/generative-ai` direto → AI Gateway `"google/gemini-2.5-flash"` via AI SDK v6; manter prompt + Zod schema; adicionar tenant_id na request pro RLS quota tracking; adicionar APCA Silver validation pós-output (rejeitar e re-prompt se falhar)
5. **Versionamento da geração** (princípio §9): cada output IA salvo como `tenant_theme_versions` nova row com `source='ai-generated'` + `prompt_text` + `model` metadata pro audit/restore JIT
6. Documentar que TweakCN também tem image-to-theme via Gemini multimodal — vale port no mesmo endpoint

**Output:** seção em `docs/research/35-ai-gateway-setup.md` com tabela "TweakCN piece → adaptação nossa".

#### Estudo S6.1 — AI Gateway Vercel status + custos

**Pergunta:** AI Gateway já configurado? Gemini 2.5 Flash preview disponível? Custo por geração de theme?

**Como:** `mcp__plugin_vercel_vercel__list_projects` + verifica env vars `AI_GATEWAY_*`. Cross-ref com `vercel:ai-gateway` skill.

**Output:** documenta em `docs/research/35-ai-gateway-setup.md`.

#### Estudo S6.2 — Adapt system prompt TweakCN

**Pergunta:** `lib/ai/prompts.ts` do TweakCN (~80 LOC) fala de ~45 keys flat. Nosso prompt fala da mesma coisa (sem archetype/roles) — copy literal + small adapt?

**Como:** lê prompt TweakCN integral + adapta:

- Manter seções Color Harmony, Font Pairing, Mode-Aware Shadows, Letter Spacing & Radius Commitment, Design Coherence
- Adicionar seção "APCA Silver compliance" (body Lc ≥75, large ≥60, non-text ≥45)
- Adicionar seção "OKLCH output preferred" (in case extras mobile)

#### Estudo S6.3 — Image-to-theme: LLM multimodal vs pixel extraction

**Pergunta:** TweakCN faz LLM multimodal Gemini análise visual. Validamos abordagem?

**Como:** lê implementação TweakCN + valida que culori pixel extraction (alternativa) é menos robusta pra mood/contraste.

**Output:** decisão: LLM multimodal Gemini (proven em TweakCN). Sem pixel extraction.

### Execução pós-estudos

#### 7.1 — System prompt adaptado em `lib/ai/theme-generation-prompt.ts`

#### 7.2 — Endpoint `POST /api/admin/theme-studio/generate`

**Faz:** Vercel AI SDK `streamObject` → `ThemeSchema` Zod-validated → stream pra client. Rate-limit (Upstash já configurado).

#### 7.3 — Chat UI minimalista (sem TipTap por enquanto)

**Faz:** textarea + submit button + streaming preview update. TipTap mentions = JIT futura.

#### 7.4 — Image upload + image-to-theme

**Faz:** drag-and-drop área + multipart upload → endpoint multimodal → ThemeSchema gerado.

### Checklist verificação Fase 6

- [ ] Estudos S6.1, S6.2, S6.3 outputs documentados
- [ ] System prompt adaptado salvo em version control
- [ ] Endpoint `/api/admin/theme-studio/generate` funcional
- [ ] Rate limit testado (5/60s)
- [ ] Chat textarea + streaming preview funciona
- [ ] Image upload + LLM multimodal extrai theme válido
- [ ] APCA Silver re-validado em theme gerado (gate prebuild)
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm build` ✅
- [ ] Smoke test: "fitness vibrant orange tropical" → theme gerado renderiza corretamente

---

## 8. Fase 7 — v0.dev como feature + decisão registry strategy (arch dia 0 + feature JIT atrás de flag)

**Goal:** schema DB pra `tenant_pages`/`tenant_blocks` desde já (D3). Feature v0.dev (geração de páginas/components via v0 SDK aplicando theme do tenant) atrás de entitlement flag — ativa quando 3+ tenants pedirem. **Cravar nesta fase a decisão registry strategy** (registry restrito vs v0-livre vs templates) — ver session `docs/_sessions/2026-05-21-ai-stack-registry-novel-reflection.md` §3-§5 + ADR-0045 a ser criada aqui.

**Estimativa:** 15-19h (6.5h estudos incluindo audit + 8-12h execução do schema + skeleton) + 2-3h pra ADR-0045 registry strategy

> **Princípio cross-cutting cravado:** desde o **primeiro componente / block** criado em qualquer fase (Fase 5 builder UI, Fase 6 AI generation, futura Fase 7), documentar em formato **registry-ready** — `{ kind, propsSchema, version, description, examples, when_to_use, anti_patterns }` (mesmo formato `BlockKnowledgeCards` do `funil-agencia.md` §3.6 item 29-30). Quando 3+ blocos existem com esse shape, consolidar em `public.block_kinds_catalog` table (Fase 7 ou JIT). Isso evita refactor cego depois — quando registry table existir, blocos já estarão em formato adoptable. Ancora: memória `feedback_mil_passos_a_frente.md` ("Catalog+Registry+Spec; nada hardcoded") + Page Engine ADR-0041 (spec JSONB tree-recursive já é registry embrionário).

### Pre-fase: estudos prévios

#### Estudo S7.0 — Audit TweakCN `app/r/themes/[id]/route.ts` + `utils/registry/**` (princípio §10)

**Pergunta:** TweakCN expõe endpoint `/r/themes/[id]` que v0/shadcn consomem. Como ele formata o payload? Reusar pra nosso `tenant_themes` endpoint?

**Como:**

1. Ler `tweakcn-ref/app/r/themes/[id]/route.ts` (endpoint v0/shadcn registry)
2. Ler `tweakcn-ref/utils/registry/v0.ts` + `utils/registry/shadcn.ts` (formatters payload)
3. Mapear o payload format que v0 espera receber
4. **Adaptações cravadas (princípio §8):** nosso endpoint vira `/api/r/themes/[tenant]/[version]` com RLS check no `tenant_id`; payload mesmo format (compatibilidade ecosystem); cache via `cacheTag('theme:<tenantId>:<version>')`
5. **Versionamento exposed via URL** (princípio §9): permitir `/api/r/themes/<tenant>/v1` vs `/api/r/themes/<tenant>/active` — profissional pode linkar versão específica ou sempre a ativa

**Output:** seção em `docs/research/36-v0-integration.md` com payload contract + URL scheme decisão.

#### Estudo S7.1 — v0.dev API/SDK

**Pergunta:** como integrar v0.dev programmaticamente?

**Como:** ler v0.dev docs (`https://v0.dev/docs/api`) + Vercel AI SDK v0 integration + verifica MCP.

**Output:** `docs/research/36-v0-integration.md` (~600 palavras).

#### Estudo S7.2 — Schema `tenant_pages` + `tenant_blocks`

**Pergunta:** armazena JSX bruto gerado pela v0 OU spec abstrato renderizado?

**Hipótese (alinhada com ADR-0041 Page Engine):** spec JSONB tree-recursive `{ type, props, children[] }` (mesmo formato Page Engine). v0 output (TSX raw) PASSA por adapter que extrai spec.

**Output:** schema:

```sql
CREATE TABLE public.tenant_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  name text NOT NULL,
  spec jsonb NOT NULL,           -- BlockSpec Zod
  source text NOT NULL CHECK (source IN ('v0-generated', 'manual', 'preset')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, name)
);

CREATE TABLE public.tenant_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES public.tenants(id),
  slug text NOT NULL,
  kind text NOT NULL,            -- 'landing', 'sales', 'about', etc (alinhado ADR-0041 D3)
  spec jsonb NOT NULL,           -- PageSpec Zod
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, slug)
);
```

#### Estudo S7.3 — Theme aplicado em v0 output

**Pergunta:** quando v0 retorna componente, o theme do tenant aplica out-of-box?

**Hipótese:** SIM se v0 gera shadcn-canonical (which v0 does by default). Nosso `<style precedence="theme">` aplica globalmente; v0 output usa `bg-card`, `text-foreground` etc — tudo tematizado.

**Output:** decisão confirmada.

#### Estudo S7.4 — Versionamento page/block

**Pergunta:** cada geração v0 cria version? Ou só ao salvar?

**Hipótese (alinhado ADR-0041 publishing-pattern):** geração = draft em memória. Save explícito → version 1. Edit → version 2 atomic. Reusar pattern `*_versions` do engine catalog.

#### Estudo S7.5 — Registry strategy decisão (gera ADR-0045)

**Pergunta:** dado que Page Engine (ADR-0041) já é registry embrionário (spec JSONB recursivo Zod-validated), qual o paradigma cravado pra geração de UI por IA?

**Opções (referenciar session `2026-05-21-ai-stack-registry-novel-reflection.md` §3-§4):**

- **(a) v0-livre puro** — IA emite TSX/JSX arbitrário, persistido como string. Caos em multi-tenant, sem normalização, theming difícil. Bom MVP, ruim escala.
- **(b) Templates rígidos** — usuário escolhe template fixo, edita slots. Modelo Webflow/Kajabi. IA tem pouco espaço pra atuar.
- **(c) Registry restrito (catalog finito)** — IA compõe spec `{type, props, children}` escolhendo de `block_kinds_catalog`. v0 pode ser ideation tool (sugere block kind novo pra curadoria), mas output canônico é sempre spec.
- **(d) Híbrido 3-stage** (sugerido pela session §4): MVP templates+IA-livre → Controle captura padrões em blocos oficiais → Registry real consolidado. Migration orgânica.

**Como:**

1. Ler session `2026-05-21-ai-stack-registry-novel-reflection.md` integral
2. Confronta com estado atual: Page Engine (ADR-0041) + Form Engine + `tenant_blocks`/`tenant_pages` (S7.2) já criam fundação tipo (c)
3. Decidir: (c) registry restrito desde dia 0 com `block_kinds_catalog` table + AI composer emite spec OU (d) híbrido pragmático
4. **Decisão sub-questões:**
   - `block_kinds_catalog` table dia 0 (vazia ok) ou JIT quando 3+ blocos?
   - v0 SDK: gera TSX raw → adapter extrai spec? Ou v0 só ideação?
   - AI composer arch: Claude tool calling vs structured output Zod-validated?
   - Vertical-specific blocks: extend catalog ou `kind` polimórfico que já existe?
5. Registrar como **ADR-0045 — Registry strategy** (Michael Nygard format)

**Output:**

- `docs/research/40-registry-strategy.md` (~800 palavras com matriz comparativa)
- `docs/adr/0045-registry-strategy.md` (decisão cravada)
- Possível migration `0026_block_kinds_catalog.sql` se decisão for (c) ou (d) cravando table dia 0

**Hipótese recomendada (não cravada, pra refinar no estudo):** opção (c) registry restrito com `block_kinds_catalog` table criada vazia dia 0 — alinhada com `feedback_mil_passos_a_frente.md` e princípio cross-cutting acima. Migração orgânica: blocos criados em Fase 5/6/7 já populam o catalog conforme nascem. v0 SDK = ideation tool que sugere novos kinds via PR humano-revisado, não geração direta de TSX em produção.

### Execução pós-estudos

#### 8.1 — Migration `0025_tenant_pages_blocks.sql` via MCP

**Faz:** aplica schema S7.2 + `tenant_pages_versions` + `tenant_blocks_versions` análogo a `tenant_theme_versions`.

#### 8.2 — Entitlement flag `v0_generation`

**Faz:** adiciona feature flag `v0_generation` em `entitlements.features`. Tenants default = `false`. Ativação manual via admin.

#### 8.3 — Skeleton endpoint `/api/admin/theme-studio/v0-generate`

**Faz:** stub endpoint + `requireEntitlement('v0_generation')` server-side. Retorna 501 Not Implemented com mensagem "v0 generation coming soon" até feature ser ativada por DM.

#### 8.4 — Documentar flag em rule entitlements

**Faz:** atualiza `.claude/rules/entitlements.md` com `v0_generation` na lista.

### Checklist verificação Fase 7

- [ ] Estudos S7.1, S7.2, S7.3, S7.4, **S7.5 (registry strategy)** outputs documentados
- [ ] **ADR-0045 — Registry strategy cravado** (decisão a/b/c/d + sub-questões respondidas)
- [ ] Migration `0025_tenant_pages_blocks` aplicada
- [ ] **(condicional ADR-0045)** Migration `0026_block_kinds_catalog` aplicada se decisão = (c) ou (d) dia 0
- [ ] Entitlement flag `v0_generation` em DB
- [ ] Endpoint skeleton respond 501 com flag off
- [ ] Endpoint respond 200 com flag on (stub)
- [ ] **Auditoria blocos pré-existentes** (Fase 5/6 criaram quais? estão em formato registry-ready conforme princípio cross-cutting?) — se não, refactor JIT antes de seguir
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm build` ✅
- [ ] Smoke test: GET `/api/admin/theme-studio/v0-generate` → 501 quando flag off

---

## 9. Fase 8 — Presets + showcase + validação visual real (Estudos S8.\* + execução)

**Goal:** 5-7 presets shadcn-canonical copiando tokens literais de DESIGN.md proven. Showcase reduzido (~400 LOC) valida visualmente todos. Build verde. Pivot concluído.

**Estimativa:** 30-40h (4h estudos + 26-36h execução)

### Pre-fase: estudos prévios

#### Estudo S8.1 — Quais 5-7 presets construir + escopo showcase

**Pergunta:** dos 71 DESIGN.md disponíveis, quais 5-7 escolher como presets dia 1?

**Critérios:**

- Cobertura de mood (clean minimal, vibrant bold, dark cinematic, soft warm, sharp tech)
- Validação visual (brands famosas com tokens conhecidos)
- Copy-paste viável (DESIGN.md tem tokens explícitos)

**Hipótese inicial:**

- `apple` — clean minimal, neutral cool
- `stripe` — trust SaaS, indigo accent, mesh hero
- `linear` — sharp tech, dark-first, geometric
- `notion` — soft warm, density, organic
- `spotify` — bold dark, green accent, mobile-heavy
- (opcional 6º) `figma` — vibrant playful
- (opcional 7º) `nike` — campaign bold

**Output:** decisão final em `docs/research/37-presets-selection.md`.

Escopo showcase:

- Rota `/admin/showcase` (não público — admin tool)
- 1 tenant × selector de preset (URL param ou DB UPDATE)
- 12-15 componentes representativos (Button variants, Card, Form, Input, Dialog, Sheet, Sidebar, Table, Tabs, NavigationBottom mobile, Hero) — em vez dos 32+ atuais
- 2 viewports (desktop + mobile)

#### Estudo S8.2 — Testing strategy presets cycling

**Pergunta:** como testar automaticamente que 5-7 presets renderizam corretamente?

**Como:** Playwright multi-preset matrix:

- Setup: tenant fixture com `active_theme_version_id` parametrizado
- For each preset: navigate `/admin/showcase?preset=<slug>` → snapshot screenshot
- Compare screenshots cross-preset (must differ in cores) e same-preset (must not regress)

**Output:** `e2e/preset-cycling.spec.ts`.

### Execução pós-estudos

#### 9.1 — 5-7 presets em `lib/design/presets/<slug>.ts`

**Faz:** cada preset = `{light: ThemeStyleProps, dark: ThemeStyleProps, common: ThemeCommon, extensions?: Record<string, unknown>}`. Tokens copy LITERAL de `docs/references/design-systems/<brand>/DESIGN.md` (regra invertida em Fase 0.2).

Para cada preset (estimativa 4-6h):

1. Abre `docs/references/design-systems/<slug>/DESIGN.md`
2. Copia hex/oklch primários, secundários, neutros literais
3. Mapeia pros 28 shadcn-canonical tokens
4. Adiciona `extensions` opt-in (ex: spotify → `{ "mobile-spotify": { miniPlayerHeight: "64px" } }`)
5. Roda APCA validate (dual-gate)
6. Visual review manual em showcase

#### 9.2 — Import pipeline 23 TweakCN presets (one-time)

**Faz:** script `scripts/import-tweakcn-presets.ts` que faz HTTP GET em cada `https://tweakcn.com/r/themes/<id>` (23 URLs) + mapeia pra nosso `ThemeSchema` + INSERT em DB como `tenant_themes.source = 'imported-tweakcn'`.

**Atribuição:** UI mostra "imported from tweakcn community" badge.

#### 9.3 — Refaz `app/admin/showcase/`

**Faz:** ~400 LOC (vs 1.259 anteriores):

- `page.tsx` (RSC) — busca tenants + presets disponíveis
- `view.tsx` (Client) — selector preset + grid 12-15 componentes representativos

#### 9.4 — Reescrever `docs/design-system/ARCHITECTURE.md`

**Faz:** documento ~1500 palavras refletindo realidade pós-pivot:

- Stack: shadcn-canonical ~45 keys + TweakCN-inspired builder
- Multi-tenant runtime via `getRouteByHost` + `<style precedence="theme">`
- Versionamento via `tenant_themes` + `tenant_theme_versions` (pattern engine catalog)
- APCA Silver dual-gate
- Mobile primitives universal vs extras opt-in
- Builder UI (ref Fase 5)
- AI generation (ref Fase 6)
- v0.dev integration (ref Fase 7)

#### 9.5 — Playwright preset cycling tests

**Faz:** `e2e/preset-cycling.spec.ts` conforme S8.2.

#### 9.6 — Cleanup final

**Faz:**

- Drop coluna `tenants.archetype_id text` (substituída por `active_theme_version_id`)
- Drop coluna `tenants.palette_id` (já no snapshot)
- Drop coluna `tenants.font_id` (já no snapshot)
- Migration `0026_drop_legacy_theme_columns`
- Atualiza `lib/route/getRouteByHost.ts` removendo legacy reads

### Checklist verificação Fase 8

- [ ] Estudos S8.1, S8.2 outputs documentados
- [ ] 5-7 presets copy literal de DESIGN.md
- [ ] APCA Silver validate ✅ em todos presets (light + dark)
- [ ] 23 TweakCN presets importados como referência opcional
- [ ] Showcase reduzido (~400 LOC) renderiza 12-15 componentes
- [ ] Cycling 5-7 presets visualmente distintos no showcase
- [ ] Playwright `preset-cycling.spec.ts` verde
- [ ] `ARCHITECTURE.md` reescrita
- [ ] Migration `0026_drop_legacy_theme_columns` aplicada
- [ ] `pnpm typecheck` ✅
- [ ] `pnpm lint --max-warnings 0` ✅
- [ ] `pnpm vocab:audit && pnpm i18n:audit && pnpm token:audit` ✅
- [ ] `pnpm test` 100% ✅
- [ ] `pnpm build` ✅
- [ ] `pnpm size` budgets verdes (esperado: bundle CSS -30%, archetypes/ folder gone)
- [ ] `pnpm dev` mobile + desktop visual confirmado em 5-7 presets

---

## 10. Inventário consolidado — o que DELETAR (surgical, sem move-to-legacy)

> **Estratégia revisada 2026-05-21:** sem `..\platform-legacy\` folder.
> Surgical delete no working tree atual + git history preserva pra
> revert JIT se necessário. Lista detalhada com critério KEEP/DELETE
> per-arquivo em `docs/_sessions/2026-05-21-reversion-analysis.md` §3.

| Path                                                                            | Ação               | Razão                                                       |
| ------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------- |
| `lib/design/archetypes/`                                                        | já-gone no tree    | Conceito archetype morre                                    |
| `lib/design/contract/{roles,strategy,typography,voice,illustrations,visual}.ts` | DELETE             | Sub-schemas invented                                        |
| `lib/design/role-resolver.ts`                                                   | DELETE             | Sem layer 1.5                                               |
| `lib/design/roles.ts`                                                           | DELETE             | Lista invented                                              |
| `lib/design/contract/index.ts`                                                  | REWRITE (Fase 1)   | Re-exports só do contract canonical                         |
| `docs/design-system/` (já vazio)                                                | DELETE diretório   | Specs conceito morto                                        |
| `docs/references/design-systems/` (71+ brand folders)                           | DELETE INTEIRO     | Não vamos usar archetypes-based design                      |
| `docs/research/20-naming-mappings.md`                                           | DELETE             | Mapping pra vocab invented                                  |
| `docs/research/26-design-system-vibes.md`                                       | DELETE             | Vibes conceito morto                                        |
| `docs/research/27-design-tokens-per-archetype.md`                               | DELETE             | Tokens per archetype morto                                  |
| `docs/research/29-token-partition-universal-vs-tenant.md`                       | KEEP + caveat      | Inferência TweakCN — caveat anotado no topo                 |
| `docs/research/30-color-format-culori-integration.md`                           | KEEP + caveat      | Inferência TweakCN — caveat anotado no topo                 |
| `docs/research/31-zod-schema-shadcn-canonical.md`                               | KEEP + caveat      | Inferência TweakCN — caveat anotado no topo                 |
| `messages/pt-BR/voice/` (10 archetype JSONs)                                    | DELETE INTEIRO     | Voice tokens nunca consumidos                               |
| `app/showcase/`                                                                 | já-gone no tree    | Refazer escopo menor em Fase 8                              |
| `.claude/worktrees/agent-a346e91b13e285d70/`                                    | DELETE             | Obsoleto                                                    |
| `.claude/worktrees/agent-a60ee799e6d5abc0d/`                                    | DELETE             | Obsoleto                                                    |
| `.claude/rules/design-references.md`                                            | DELETE INTEIRO     | Sem DESIGN.md folder = sem escopo (mesmo invertido)         |
| `components/ds/lazy/` (9 archetype-folders)                                     | DELETE INTEIRO     | Re-add JIT quando feature pedir                             |
| `components/ds/<archetype-bound>.tsx` (32 wrappers, review)                     | DELETE per-arquivo | Critério: grep `var(--role-*)` ≥1 → DELETE                  |
| `components/ds/{icon,app-image,safe-area-wrapper,adaptive-shell}.tsx`           | REVIEW KEEP        | Universais — provavelmente sobrevivem simplificados         |
| `components/ui/*` (shadcn primitives)                                           | KEEP integral      | Vendor / instalado via `npx shadcn add`                     |
| `components/kibo-ui/*` (5 vendor primitives)                                    | KEEP integral      | Vendor                                                      |
| Migrations 0020-0023                                                            | KEEP               | Especialmente 0023 GRANT (bug real) + 0022 showcase fixture |

---

## 10.5 Estratégia de reversão (Option C — surgical delete)

Análise completa em `docs/_sessions/2026-05-21-reversion-analysis.md`.

**Resumo:**

- **Option A (hard reset):** rejeitada — perderia PPR fix, multi-tenant
  backbone, useBrand vendor blocks, AdaptiveShell.
- **Option B (revert múltiplo):** parcial — útil pros 4 commits 100%
  invented (`cae1f41`, `886c0d8`, `b328d28`, `f21fe2e`), mas commits
  PARTIAL (`e35677f`, `a56a7d9`, `a370d80`) misturam KEEP+REVERT — não
  podem ser revertidos cleanly.
- **Option C (surgical delete + 1 commit grande):** ✅ ESCOLHIDA.
  Preserva 100% dos commits KEEP intactos (PPR fix, multi-tenant, brand,
  Kibo, shadcn blocks). Trabalha no estado atual do working tree (HEAD
  = `fe10231`). 1 commit grande com lista completa de deletes
  detalhada em §3 da análise.

**Trabalho bom a refazer JIT** (preserva memória em §4 da análise):

- AdaptiveShell pattern (commit `7b94af8`) — re-add quando 2+ rotas
  precisarem responsive switching
- `<AppImage>`, `<Icon>`, `<SafeAreaWrapper>` — review per-arquivo;
  KEEP se 0 referência a `--role-*`
- PPR Suspense fix + view/page split — **JÁ KEEP no working tree**
- `getRouteByHost` join palette+font slugs — **JÁ KEEP**
- useBrand vendor blocks — **JÁ KEEP**

---

## 11. Inventário consolidado — docs/regras criar/atualizar/deletar

| Arquivo                                                    | Ação               | Fase | Conteúdo                                                                       |
| ---------------------------------------------------------- | ------------------ | ---- | ------------------------------------------------------------------------------ |
| `docs/adr/0044-pivot-tweakcn-shadcn-canonical.md`          | ✅ CREATED         | 0.1  | Supersedes ADR-0043 (estratégia surgical delete revisada 2026-05-21)           |
| `docs/adr/0043-design-system-architecture-consolidated.md` | ✅ HEADER UPDATED  | 0.1  | Status: superseded by ADR-0044                                                 |
| `docs/_sessions/2026-05-21-reversion-analysis.md`          | ✅ CREATED         | 0.0  | Option A/B/C análise + inventário cirúrgico (Option C escolhida)               |
| `.claude/rules/design-references.md`                       | **DELETE**         | 1.2  | Sem `docs/references/design-systems/` = sem escopo aplicação (mesmo invertido) |
| `.claude/rules/design-tokens.md`                           | REWRITE            | 2.3  | shadcn-canonical 41 + extras opt-in                                            |
| `.claude/rules/naming.md`                                  | UPDATE             | 1.7  | Remover archetype/role-\* do banido (já não aparecem)                          |
| `.claude/rules/components.md`                              | UPDATE             | 4.4  | Wrappers consomem shadcn-canonical aliases + Tailwind utilities                |
| `.claude/rules/shadcn-zone.md`                             | UPDATE             | 0.5  | Apontar pro ADR-0044                                                           |
| `.claude/rules/entitlements.md`                            | UPDATE             | 7.4  | Adicionar flag `v0_generation`                                                 |
| `CLAUDE.md`                                                | UPDATE             | 1.5  | Remover blocos design-system inflados; adicionar pivot + TweakCN clone path    |
| `docs/design-system/`                                      | **DELETE folder**  | 1.3  | Já vazio no tree atual — remover diretório                                     |
| `docs/design-system/ARCHITECTURE.md`                       | RECREATE           | 8.4  | Pós-pivot architecture (~1500 palavras)                                        |
| `docs/references/design-systems/` (71+ brand folders)      | **DELETE INTEIRO** | 1.3  | Não vamos usar archetypes-based design                                         |
| `docs/plans/design-system.md`                              | ARCHIVE            | 1.6  | → `docs/_archive/plans/design-system-superseded-2026-05-21.md`                 |
| `docs/plans/pivot-tweakcn.md`                              | (este)             | —    | Atualizado 2026-05-21 com estratégia surgical delete + Fase -1                 |
| `docs/plans/README.md`                                     | UPDATE             | 1.6  | Apontar pro plano novo                                                         |
| `docs/plans/funil-agencia.md`                              | UPDATE             | 1.6  | Atualizar "Bloqueado por" → `pivot-tweakcn.md` Fase 4                          |
| `docs/_status.md`                                          | UPDATE             | 1.6  | Status: pivot iniciado + TweakCN clone path                                    |
| `CHANGELOG.md`                                             | UPDATE             | 1.6  | Bullet pivot                                                                   |
| `docs/research/20-naming-mappings.md`                      | **DELETE**         | 1.3  | Mapping pra vocab invented                                                     |
| `docs/research/26-design-system-vibes.md`                  | **DELETE**         | 1.3  | Vibes do conceito morto                                                        |
| `docs/research/27-design-tokens-per-archetype.md`          | **DELETE**         | 1.3  | Tokens per archetype morto                                                     |
| `docs/research/29-token-partition-universal-vs-tenant.md`  | ✅ KEEP + CAVEAT   | 0.0  | Caveat de inferência anotado no topo                                           |
| `docs/research/30-color-format-culori-integration.md`      | ✅ KEEP + CAVEAT   | 0.0  | Caveat de inferência anotado no topo                                           |
| `docs/research/31-zod-schema-shadcn-canonical.md`          | ✅ KEEP + CAVEAT   | 0.0  | Caveat de inferência anotado no topo                                           |
| `docs/research/32-mobile-tokens-partition.md`              | CREATE             | S2.1 | Estudo S2.1                                                                    |
| `docs/research/33-roles-to-canonical-mapping.md`           | CREATE             | S3.1 | Mapping tabela                                                                 |
| `docs/research/34-lazy-components-triage.md`               | CREATE             | S3.2 | Triage lazy                                                                    |
| `docs/research/35-theme-versioning-pattern.md`             | CREATE             | S4.1 | Pattern reuse                                                                  |
| `docs/research/36-tweakcn-files-triage.md`                 | CREATE             | S5.1 | Triage arquivos copy (agora validados contra clone)                            |
| `docs/research/37-ai-gateway-setup.md`                     | CREATE             | S6.1 | AI Gateway config                                                              |
| `docs/research/38-v0-integration.md`                       | CREATE             | S7.1 | v0.dev API                                                                     |
| `docs/research/40-registry-strategy.md`                    | CREATE             | S7.5 | Registry restrito vs v0-livre vs templates (matriz comparativa)                |
| `docs/adr/0045-registry-strategy.md`                       | CREATE             | S7.5 | Decisão cravada ADR-0045 (Michael Nygard format)                               |
| `docs/research/39-presets-selection.md`                    | CREATE             | S8.1 | 5-7 presets                                                                    |
| `docs/blueprint/22-theme-extension-contract.md`            | CREATE             | 3.2  | Extension opt-in pattern                                                       |
| `messages/pt-BR/voice/` (10 archetype JSONs)               | **DELETE INTEIRO** | 1.3  | Voice tokens nunca consumidos                                                  |
| `NOTICE.md`                                                | CREATE             | 5.2  | Apache-2.0 attribution TweakCN                                                 |

---

## 12. Riscos + mitigations

| Risco                                                                                              | Probabilidade | Impacto          | Mitigation                                                                                                                     |
| -------------------------------------------------------------------------------------------------- | ------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Codemod `--role-*` → canonical introduz regressão visual em wrapper                                | Alta          | Médio            | Diff revisado item-por-item antes commit; Storybook + Playwright snapshot pre/post                                             |
| Surgical delete remove arquivo bom misturado (perde trabalho útil)                                 | Média         | Médio            | §4 da reversion-analysis lista "trabalho bom JIT" — git history preserva; criterio review per-arquivo via grep `var(--role-*)` |
| Build quebra durante deletes sequenciais antes do ajuste em consumers                              | Certeza       | Baixo (esperado) | `pnpm typecheck` intermediário detecta consumers; commit único Fase 0 inclui ajustes — quebra interna não vaza pro repo        |
| Estudo S1.1 (universal vs per-tenant) demora mais que estimado                                     | Média         | Baixo            | Validar contra clone local `../tweakcn-ref` (rápido). Time-box 3h. Decisão default = TweakCN approach se exceder               |
| 5-7 presets em shadcn-canonical não capturam signature visual (Apple sem `--apple-label-tertiary`) | Média         | Médio            | Extras opt-in via `theme.extensions` — `var(--apple-label-tertiary, var(--muted-foreground))` graceful chain                   |
| AI Gateway custos altos durante dev Fase 6                                                         | Baixa         | Baixo            | Rate limit dev = 1/60s; quota mensal cap; preset gallery reduz needs                                                           |
| v0.dev SDK breaks ou muda — Fase 7 instável                                                        | Média         | Baixo            | Skeleton + flag off por default; ativa JIT quando 3+ tenants pedirem                                                           |
| Playwright preset cycling demora em CI                                                             | Média         | Baixo            | 5-7 presets × 2 viewports = 10-14 screenshots ≈ 2-3min OK                                                                      |
| Delete de docs afeta auto-discovery do Claude                                                      | Baixa         | Médio            | Atualizar CLAUDE.md em 1.5 + `docs/plans/README.md` em 1.6 ANTES de commit                                                     |
| TweakCN clone `..\tweakcn-ref\` é indexado por IDE/Tailwind                                        | Baixa         | Baixo            | Pasta vizinha fora do workspace, sem `tsconfig` paths; Tailwind v4 não scaneia ../tweakcn-ref por default                      |
| Memória `project_design_system_state.md` desatualizada referencia conceitos mortos                 | Certeza       | Baixo            | Atualizar memory após Fase 0 commit — adicionar bullet "pivot 2026-05-21"                                                      |
| Funil agência retoma com vocab antigo (archetype)                                                  | Média         | Baixo            | `funil-agencia.md` está pausado; ao retomar, primeiro passo = audit references obsoletas                                       |
| ADR-0041 (engines Form/Page) conflito com Fase 7 v0.dev                                            | Baixa         | Médio            | Fase 7 reusa pattern Form/Page (spec JSONB + versioning); estudo S7.2 confirma alinhamento                                     |
| Entitlement `v0_generation` faltando coluna em `plans` JSONB                                       | Baixa         | Baixo            | Migration `0025` (Fase 7) adiciona; ADR-0039 entitlements RPCs já flexíveis                                                    |
| Estudos 29/30/31 inferência via WebFetch não bate com clone real                                   | Média         | Baixo            | Pré-Fase 1 inclui validação contra `../tweakcn-ref`; caveat anotado no topo de cada research; refinar conclusões se necessário |

---

## 13. Métricas pra validar sucesso do pivot

| Métrica                                                                   | Atual                              | Target pós-pivot                                                 | Como medir                                                        |
| ------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- |
| Roles `--role-*` distintos em `app/globals.css`                           | 67                                 | 0                                                                | `grep -oE "\-\-role-[a-z-]+" app/globals.css \| sort -u \| wc -l` |
| LOC em `lib/design/archetypes/`                                           | 9.580                              | 0 (folder gone, presets em `lib/design/presets/` ~2.000 LOC max) | `find lib/design/archetypes -name "*.ts" 2>&1 \| wc -l`           |
| ESLint custom rules ds-governance                                         | 5                                  | 2                                                                | `grep -c "ds-governance" eslint.config.mjs`                       |
| Bundle CSS gerado per combo                                               | ~5KB est.                          | ~2-3KB (canonical é mais compacto)                               | Vercel build output                                               |
| Bundle JS DS layer                                                        | atual baseline                     | -20% (lazy archetypes gone, wrappers leaner)                     | `pnpm size`                                                       |
| # bugs latentes ao renderizar showcase                                    | 9 (Fase showcase atual)            | 0                                                                | Showcase Fase 8 cycling manual                                    |
| Compatibilidade ecosystem: `npx shadcn add dashboard-01` renderiza temado | Quebrado (precisa traduzir tokens) | Funciona out-of-box                                              | Test manual com block aleatório do shadcn registry                |
| v0.dev export → cola no app → tematiza                                    | Quebrado                           | Funciona                                                         | Geração v0 manual + paste                                         |
| TweakCN preset HTTP fetch + apply funciona                                | N/A                                | Funciona                                                         | `pnpm dlx shadcn add https://tweakcn.com/r/themes/mocha-mousse`   |
| # storybook stories que rendem em todos presets                           | 40 não testado all-preset          | 100% rendem 5-7 presets                                          | Playwright matrix                                                 |
| Tempo onboarding novo preset                                              | "pasta + PR" teórico ~30min        | similar mas com tokens proven ~30min copy DESIGN.md              | Manual                                                            |
| Tempo build dev (`pnpm dev` cold)                                         | atual baseline                     | -10-20% (menos CSS scan, archetypes/ gone)                       | `time pnpm build`                                                 |
| # arquivos `lib/design/`                                                  | 254                                | < 50 (contract + presets + utils)                                | `find lib/design -name "*.ts" \| wc -l`                           |
| Invented vocabulary count                                                 | 60+ (archetype, role-\*, etc)      | 0 (excluindo extras opt-in documentados)                         | `pnpm vocab:audit`                                                |

---

## 14. Notas operacionais (cross-fase)

### 14.1 Como manter build verde a cada commit

- **Fase 0** (legado move): commit único que inclui move + stubs. Build quebra entre 1.3 e 1.4 mas commit final é verde.
- **Fase 1+**: cada item executável (2.1, 2.2, 3.1, etc) é commit individual com checklist verde. Build SEMPRE verde ao final do commit.
- **Estudos prévios**: não geram commits de código — só geram commits de docs em `docs/research/`. Build sempre verde.

### 14.2 Quando rodar visual check

- Após cada item de execução tocar UI: `pnpm dev` + abrir rota afetada
- Após Fase 2 (foundation): `/`, `/login`, `/signup`, `/dashboard` — visual = Tailwind defaults + tenant primary
- Após Fase 3 (wrappers): `pnpm storybook` 100% stories sem console error
- Após Fase 4 (theme storage): swap theme via DB UPDATE + reload, confirma diff visível
- Após Fase 5 (builder UI): `/admin/theme-studio` manual interaction
- Após Fase 6 (AI): "fitness vibrant orange tropical" → theme gerado renderiza
- Após Fase 7 (v0.dev): endpoint skeleton respond conforme flag
- Após Fase 8 (presets+showcase): cycling 5-7 presets visual + Playwright matrix

### 14.3 Feature flags entitlements (Fase 7 readiness)

- `v0_generation`: default false. Activate per tenant via admin tool.
- `theme_studio`: default true para profissional. Pode ser gated em plan tier (Basic não tem, Pro tem) — JIT.
- `ai_theme_generation`: default true Pro. JIT.

### 14.4 Mobile/PWA estudo D2 (referência cruzada)

- Decisão D2 do user fica resolvida no fim de Fase 2 (estudos S2.1-S2.3)
- Outputs: tokens mobile universais em `globals.css`; signature em `extensions` opt-in
- Spotify/Apple/Pinterest mobile-feel virou `extensions` opt-in nos presets respectivos (Fase 8 implementa)

### 14.5 Engines Form/Page harmonização (Fase 4 + Fase 7)

- Fase 4 (theme storage) reusa pattern `*_versions` documentado em ADR-0041 §publishing-pattern + blueprint 21
- Fase 7 (v0.dev) cria `tenant_pages` + `tenant_blocks` alinhados com Page Engine ADR-0041 D3 (kind enum + RLS)
- Sem refactor de Form Engine — design system não toca em forms (forms continuam pausados em `funil-agencia.md`)

---

## 15. Governance & Documentação obrigatória (cross-fase, vale pra TODO componente novo)

> **Princípio:** consistência de longo prazo não vem de "boa vontade" — vem de **checklist obrigatório** que todo componente passa antes de merge. Não importa se o projeto tem 5 ou 500 componentes; cada um nasce com o mesmo padrão.
>
> **Quando aplica:** TODO componente novo criado em qualquer fase (5 builder UI, 6 AI gen, 7 v0/registry, 8 presets) **ou JIT** (re-add `<Logo>`, `<AppImage>`, wrapper novo demandado por feature). Vale também pra blocos do registry (S7.5) — mesma disciplina, formato `BlockKnowledgeCards`.
>
> **Quem garante:** humano no PR + rule path-loaded `.claude/rules/design-system-component.md` (a criar na Fase 5) que aponta este checklist + lint custom opcional.

### 15.1 — Checklist de aprovação por componente

Cada componente novo só faz merge se TODOS os blocos abaixo estiverem cravados. Componente sem 1 item = PR bloqueado.

#### A. Identidade do componente

- [ ] **Nome canônico** snake-case nenhum dos vocab banidos (ver `.claude/rules/naming.md`)
- [ ] **Categoria:** `primitive` (Button, Input — vem do shadcn) / `semantic` (HeroSection, PricingCards) / `smart` (TransformationFunnel com lógica+IA)
- [ ] **Localização correta:**
  - `components/ui/*` (zona quarentenada shadcn — só `npx shadcn add`)
  - `components/app-*.tsx` (wrappers compostos com valor agregado, ADR-0040 §E)
  - `components/sections/*.tsx` (blocos de página, padrão registry)
- [ ] **Versão:** semver no header do arquivo (`v1.0.0`) — bump major em breaking change

#### B. Contrato técnico (Zod obrigatório)

- [ ] **Props schema Zod** definido em `lib/contracts/components/<name>.ts` — fonte única (não TS interface manual)
- [ ] **Variants** declarados como union literal (`variant: 'primary' | 'secondary' | 'ghost'`)
- [ ] **Slots/children:** quais tipos de filhos aceita, quais NÃO (ex: `<Card>` não aceita `<Card>` aninhado)
- [ ] **Defaults explícitos** no schema (sem mágica)
- [ ] **TypeScript inferido do Zod** (`type Props = z.infer<typeof PropsSchema>`) — nunca duplicar manual

#### C. Encaixe multi-tenant (CRÍTICO — fail aqui = quebra customização)

- [ ] **Tokens consumidos** listados explicitamente — devem ser **shadcn-canonical apenas** (`bg-card`, `text-foreground`, `var(--primary)`, etc). NUNCA hex/oklch hardcoded
- [ ] **Áreas customizáveis pelo tenant** mapeadas:
  - Cor primária → `--primary` (tenant define em `tenant_themes.snapshot`)
  - Cor de fundo → `--background` / `--card`
  - Fonte → `--font-sans` / `--font-serif`
  - Radius → `--radius`
- [ ] **Áreas imutáveis (universais)** mapeadas:
  - Touch-min 44px, safe-area, z-index, motion durations — vêm do `globals.css`
  - Componente NÃO pode override esses
- [ ] **Reação a tema light/dark:** declarar que funciona em ambos (Storybook story testa)
- [ ] **APCA Silver pass garantido:** body Lc ≥75, large ≥60, non-text ≥45 — testado em script `pnpm contrast:check`
- [ ] **Brand-agnostic:** zero uso de `'desafit'` / `'yoga.app'` / `'ingles.app'` hardcoded. Sempre via `useBrand()` ou env `NEXT_PUBLIC_BRAND_*`

#### D. Acessibilidade (não-negociável)

- [ ] **ARIA roles/labels** corretos (Button = `<button>`, não `<div onClick>`)
- [ ] **Keyboard navigation:** Tab, Enter, Esc, setas conforme aplicável
- [ ] **Focus visible** com `:focus-visible` ring
- [ ] **Screen reader:** texto alternativo em ícones, `aria-label` em controles sem label visível
- [ ] **Touch target ≥44px** em mobile (rule `no-vh-in-mobile-aware` + visual check)
- [ ] **Sem dependência de cor isolada** pra comunicar estado (ex: erro = vermelho + ícone + texto, não só vermelho)

#### E. i18n

- [ ] **Strings do chrome via `t('namespace.key')`** (botões, labels, errors genéricos) — `messages/<locale>/<ns>.json`
- [ ] **Conteúdo do tenant inline no spec** (perguntas de form, copy de landing — JSONB, NÃO `t()`)
- [ ] **Plurais** via ICU MessageFormat se aplicável
- [ ] **RTL ready** (sem `margin-left` literal — usar `me-*`/`ms-*` Tailwind logical properties)

#### F. Performance

- [ ] **RSC por default** (Server Component) — só vira Client Component (`'use client'`) com justificativa documentada no header (state, browser API, event handler que não pode subir)
- [ ] **Bundle impact medido** (`pnpm size` antes/depois) — se >5KB adicional, justificar
- [ ] **Lazy loading** quando aplicável (imports dinâmicos pra modais, dialogs heavy)
- [ ] **Streaming-friendly** (sem bloqueios síncronos no render)

#### G. Storybook story obrigatória

- [ ] Arquivo `<name>.stories.tsx` co-localizado
- [ ] **Default story** com props mínimos
- [ ] **Todas as variants** (primary/secondary/ghost/etc)
- [ ] **Todos os estados** (hover, focus, disabled, loading, error)
- [ ] **Mobile + desktop viewport** (`parameters.viewport`)
- [ ] **Multi-preset matrix** (Fase 8 wire-up): renderiza nos 5-7 presets — visual confirma que tematização funciona

#### H. Testes

- [ ] **Unit test** (`<name>.test.tsx`) cobrindo props, variants, comportamento básico — Vitest
- [ ] **Visual regression** (Playwright snapshot) — opcional Fase 5, obrigatório Fase 8 em diante
- [ ] **APCA contrast test** — script roda em CI
- [ ] **Coverage mínimo 70%** lines + branches no componente

#### I. Documentação co-localizada

- [ ] **Header do arquivo** com: nome, versão, categoria, propósito (1 linha), exemplos rápidos
- [ ] **Comentário Zod schema** explicando cada prop não-óbvia
- [ ] **MDX doc** ao lado da story (`<name>.mdx`) com:
  - When to use
  - When NOT to use (anti-patterns)
  - Related components
  - Migration guide (se substitui outro)

#### J. Registry-ready (princípio cross-cutting Fase 7)

- [ ] **Knowledge card** estruturado: `{ kind, propsSchema, version, description, examples, when_to_use, anti_patterns, related }` — embedded no Zod schema ou MDX
- [ ] Pronto pra entrar em `block_kinds_catalog` quando ADR-0045 cravar

### 15.2 — Estudos de contrato dedicados (quando)

Componente novo dispara **estudo dedicado** (sessão em `docs/_sessions/YYYY-MM-DD-component-<name>.md`) quando QUALQUER critério abaixo é verdade:

- É **smart block** (lógica + IA + estado + automação) — ex: `TransformationFunnel`, `OnboardingWizard`
- Introduz **token novo** (não shadcn-canonical) — ex: `--mini-player-height` (Spotify-like preset)
- Quebra padrão existente — ex: aceita slot que outros componentes proíbem
- Tem 3+ variants estruturalmente diferentes (não só cor) — ex: Card pode ser horizontal/vertical/grid
- Acopla a feature flag / entitlement — ex: gated atrás de `theme_studio` ou `v0_generation`

Estudo dedicado contém: motivação, alternativas consideradas, decisão cravada, contratos Zod, exemplos de uso, anti-patterns. Pode promover pra ADR se for one-way door.

### 15.3 — Rules path-loaded (governance via .claude/rules)

A serem criadas/atualizadas conforme fases avançam:

| Rule                                       | Quando criar | Path-loaded em                                  | Conteúdo                                                                               |
| ------------------------------------------ | ------------ | ----------------------------------------------- | -------------------------------------------------------------------------------------- |
| `.claude/rules/design-system-component.md` | Fase 5       | `components/app-*.tsx`, `components/sections/*` | Aponta pro checklist §15.1 + condição de revisitar quando crescer                      |
| `.claude/rules/components.md` (existe)     | Fase 3       | `components/**`                                 | UPDATE pra consumir shadcn-canonical + linkar §15.1                                    |
| `.claude/rules/registry-blocks.md`         | Fase 7       | `lib/contracts/blocks/*`, `components/blocks/*` | Formato block knowledge card + relação com `block_kinds_catalog`                       |
| `.claude/rules/storybook-stories.md`       | Fase 5       | `**/*.stories.tsx`                              | Stories obrigatórias: default + variants + states + viewports + multi-preset matrix    |
| `.claude/rules/component-tokens.md`        | Fase 1 ✅    | `components/**`                                 | Já existe parcialmente em `design-tokens.md` — refinar Fase 5 com tabela token-consumo |

Cada rule tem seção **"Condição de revisitar"** (padrão ADR-0040 §L): sob qual gatilho a rule precisa ser atualizada (ex: "quando 10+ componentes consumirem token novo → considerar promover de extras opt-in pra canonical").

### 15.4 — CI gates (automação que falha PR)

Não dá pra confiar só em humano revisor — CI bloqueia merge se:

- [ ] **Zod schema ausente** em componente novo (lint custom)
- [ ] **Story Storybook ausente** (script `find` em PR)
- [ ] **Test ausente** ou coverage <70% (Vitest report)
- [ ] **APCA fail** em qualquer combo light/dark do componente (script `pnpm contrast:check`)
- [ ] **`var(--role-*)` ou hex hardcoded** em componente (rule `no-raw-tokens`)
- [ ] **`100vh` em mobile-aware path** (rule `no-vh-in-mobile-aware`)
- [ ] **Brand hardcoded** (`'desafit'`/`'yoga.app'`/`'ingles.app'` em código) — rule `brand`
- [ ] **Vocab banido** (`pnpm vocab:audit`)
- [ ] **Token violations** (`pnpm token:audit`)
- [ ] **i18n keys faltando** (`pnpm i18n:audit`)
- [ ] **Bundle size regression** >10% (`pnpm size` com budget)

### 15.5 — Onboarding de componente do shadcn registry / v0 / TweakCN

Componente vindo de fora (`npx shadcn add dashboard-01`, paste de v0, copy de TweakCN) NÃO escapa do checklist. Workflow obrigatório:

1. Instalar em `components/ui/*` (shadcn) ou em folder vendor isolada (`components/vendor/<source>/`)
2. **Auditoria imediata** contra §15.1:
   - Consome shadcn-canonical? (esperado: sim, pq é o ecossistema canonical)
   - APCA pass? (rodar `pnpm contrast:check` no componente isolado)
   - Acessibilidade ok? (review manual + lint axe se aplicável)
3. Se OK: criar wrapper `components/app-<name>.tsx` SÓ se tiver valor agregado (passthrough proibido, ADR-0040)
4. Wrapper passa pelo checklist §15.1 inteiro
5. Doc co-localizada cita origem + license + commit hash

### 15.6 — Refactor de componente legado (migration path)

Componente antigo (pré-pivot ou recém-criado sem disciplina) precisa entrar no padrão **antes do PR que adiciona feature nova depender dele**. Workflow:

1. Identifica gaps via checklist §15.1
2. Cria sessão `docs/_sessions/YYYY-MM-DD-refactor-<component>.md` com lista de gaps
3. PR refactor SEPARADO do PR feature (não mistura)
4. Refactor PR: addiciona Zod schema, story, test, doc — sem mudar comportamento
5. Feature PR depois: usa componente já compliant

### 15.7 — Métricas de saúde do design system (medir trimestralmente)

| Métrica                                              | Target           | Como medir                                               |
| ---------------------------------------------------- | ---------------- | -------------------------------------------------------- |
| % componentes com Zod schema                         | 100%             | grep `z.object` em `lib/contracts/components/`           |
| % componentes com Storybook story                    | 100%             | `find components -name "*.tsx" -not -name "*.stories.*"` |
| % componentes com test (coverage ≥70%)               | 100%             | Vitest report                                            |
| % stories que rendem em 5+ presets sem regressão     | 100%             | Playwright matrix                                        |
| Tokens consumidos fora de shadcn-canonical (sem ADR) | 0                | `pnpm token:audit`                                       |
| APCA fails em qualquer componente                    | 0                | `pnpm contrast:check`                                    |
| Componentes flagged "smart" sem estudo dedicado      | 0                | grep `category: 'smart'` vs sessions `*-component-*.md`  |
| Time-to-add novo bloco oficial                       | <2h (skeleton)   | manual stopwatch                                         |
| Time-to-onboard shadcn block from registry           | <30min (incl QA) | manual                                                   |

### 15.8 — Quando essa governance entra em vigor

- **Fase 5 (Builder UI):** primeiros componentes do theme-studio JÁ nascem sob §15.1
- **Fase 6 (AI gen):** chat UI + endpoints sob §15.1
- **Fase 7 (v0/registry):** ADR-0045 cravando + rule `registry-blocks.md` criada
- **Fase 8 (presets+showcase):** Playwright matrix multi-preset wire-up + métricas §15.7 começam a ser coletadas

Componentes pré-existentes (Fase 1-3, sobreviventes do surgical delete) passam por refactor §15.6 conforme features novas dependerem deles — não num batch upfront (JIT-friendly).

### 15.9 — Por que isso parece "burocracia" mas não é

Cada item do checklist §15.1 existe por **incidente passado ou risco conhecido**:

- Zod schema obrigatório → fase anterior teve sub-schemas TS sem source-of-truth, virou bagunça (ADR-0044 contexto)
- Multi-tenant fit explícito → archetype-bound wrappers quebraram quando tenant mudou (incident pivot)
- Storybook obrigatório → componentes sem story renderizam só "em produção" e bugs aparecem tarde
- APCA test → contraste é one-way door (legal compliance em alguns países)
- Knowledge card registry-ready → evita refactor cego em Fase 7 (princípio cross-cutting já cravado)

Se algum item parecer overhead, perguntar: **"que bug futuro esse item previne?"** Se a resposta for "nenhum claro" → discutir remoção em ADR. Não remover por gut feeling.

---

## 16. Apêndice — refs externas

- **TweakCN clone read-only (SSOT):** `C:\Users\leean\Desktop\tweakcn-ref\` (commit `9adabcf9`, branch `main`, Apache-2.0)
- **TweakCN repo upstream:** [github.com/jnsahaj/tweakcn](https://github.com/jnsahaj/tweakcn) (Apache-2.0, ~9.9k stars)
- **TweakCN editor:** [tweakcn.com/editor/theme](https://tweakcn.com/editor/theme)
- **shadcn registry docs:** [ui.shadcn.com/docs/registry](https://ui.shadcn.com/docs/registry)
- **v0.dev API:** [v0.dev/docs/api](https://v0.dev/docs/api)
- **Apache-2.0 license + § 4 redistribution:** [apache.org/licenses/LICENSE-2.0](https://www.apache.org/licenses/LICENSE-2.0)
- **culori:** [culorijs.org](https://culorijs.org) (color manipulation)
- **APCA-w3:** [github.com/Myndex/apca-w3](https://github.com/Myndex/apca-w3) (contrast formula)
- **shadcn blocks:** [ui.shadcn.com/blocks](https://ui.shadcn.com/blocks)
- **Vercel AI SDK:** [sdk.vercel.ai](https://sdk.vercel.ai)
- **Vercel AI Gateway:** [vercel.com/docs/ai-gateway](https://vercel.com/docs/ai-gateway)

ADRs e blueprints internos relacionados:

- ADR-0033 — schema único `public.*`
- ADR-0039 — entitlements RPCs
- ADR-0041 — engine catalog 2 motores
- ADR-0043 — design system architecture consolidated **(superseded por ADR-0044)**
- ADR-0044 — pivot TweakCN/shadcn-canonical (criado Fase 0.1)
- Blueprint 21 — engine catalog
- Blueprint 22 — theme extension contract (criado Fase 3.2)

---

**Fim do plano.**
