# Sessão 2026-05-21 — Análise de reversão (pivot TweakCN)

> **Tipo:** reflexão estratégica (não-decidido formalmente — feed pro plano `pivot-tweakcn.md` §10.5).
> **Captura:** análise de commits + recomendação Option A/B/C + inventário cirúrgico de arquivos a deletar.
> **Quando virar decisão cravada:** ao confirmar Option recomendada, vira §10.5 do `pivot-tweakcn.md`.

---

## 0. Contexto

O plano original `docs/plans/pivot-tweakcn.md` (criado horas atrás) usava
estratégia **"move-to-legacy"** — mover 16 alvos pra
`..\platform-legacy\` + stubs + commits incrementais. User identificou 3
problemas:

1. **Move-to-legacy gera dead code circulando.** Pasta vizinha pode ser
   indexada por IDE, gera tentação ("vamos ver como fizemos isso
   antes"), mantém vocabulário invented em research/legacy docs vivo.
2. **Stubs criam confusão.** Files temporários enganam sobre o que é
   arquitetura real vs escora.
3. **TweakCN clone NÃO estava local.** Estudos prévios (S1.1/S1.2/S1.3)
   foram **inferência via WebFetch + research-28**. Validação correta
   exige repo local.

**Nova estratégia decidida pelo user:**

1. Clonar TweakCN PRIMEIRO em `C:\Users\leean\Desktop\tweakcn-ref\`
   (pasta vizinha read-only, NÃO submodule) — fonte autoritativa pra
   adaptação direta.
2. **Reverter commits + delete cirúrgico** em vez de move-to-legacy.
   Aceitar perder algum trabalho "bom misturado" pra ficar 100% limpo.
3. **Deletar `docs/references/design-systems/` inteiro** (não vamos usar
   archetypes-based design).
4. **Deletar `.claude/rules/design-references.md` inteiro** (mesmo
   invertido, sem escopo de aplicação se não tem DESIGN.md folder).
5. **Deletar 32 wrappers em `components/ds/*`** + 9 lazy
   archetype-specific. Re-add JIT quando features pedirem.
6. **Manter `components/ui/*`** (shadcn primitives instalados) e
   `components/kibo-ui/*` (vendor).
7. **DB:** migrations 0020-0023 ficam (especialmente 0023 GRANT e 0022
   showcase tenant — bug real + test fixture). Fase 4 vai migrar schema
   mais tarde; Fase 0 não toca DB.
8. **NO platform-legacy folder.** Deleta direto. Git history preserva
   pra revert se necessário.

---

## 1. Análise commit-a-commit (últimos 14 que tocaram design system)

Recomendação por commit, do mais recente (topo) pro mais antigo:

| #   | Commit    | Conteúdo                                                                                                                                     | Veredito             | Justificativa                                                                                                                               |
| --- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `fe10231` | fix(ppr): split server-page + client-view + static intl messages (`app/login,signup,dashboard,layout` + `i18n/request.ts` + `RouteProvider`) | **KEEP**             | Suspense PPR fix crítico. View/page split é padrão Next 16 correto. i18n static messages = correção real, não workaround.                   |
| 2   | `ede0d49` | feat(brand): white-label vendor blocks consomem `useBrand` (`app/dashboard/page.tsx`, `login`, `signup` + componentes brand)                 | **KEEP**             | useBrand integration é arquitetura mantida ADR-0024. Vendor blocks tematizados é exatamente o objetivo pós-pivot.                           |
| 3   | `7b94af8` | feat(ds): adaptiveshell + `--breakpoint-mobile` token + worktree ignore (`components/ds/adaptive-shell.tsx`, `globals.css`, `eslint.config`) | **PARTIAL**          | AdaptiveShell pattern é útil (responsive mobile-first), mas implementação pode precisar revisar pós-pivot. Reescrever quando feature pedir. |
| 4   | `cae1f41` | feat(theme): native aliases mistral + stripe + emitNative layer 2 (`lib/design/archetypes/{mistral,stripe}/index.ts`, `build-theme-css.ts`)  | **REVERT**           | 100% invented. Native aliases archetype-specific são deprecados (ADR-0044 D7).                                                              |
| 5   | `4ce11a4` | feat(theme): join palette + font slugs em route lookup (`app/layout.tsx`, `getRouteByHost.ts`, `route/types.ts`)                             | **KEEP**             | Multi-tenant backbone runtime essencial. ADR-0044 D10 mantém integralmente.                                                                 |
| 6   | `022231a` | docs(changelog): bloco 2/3/4 + stories + build fix (`CHANGELOG.md`)                                                                          | **KEEP**             | Só doc. Não consome código deletável.                                                                                                       |
| 7   | `ddf8b5c` | feat(ds): stories kibo-ui (announcement/banner/dropzone/marquee/spinner)                                                                     | **KEEP**             | Stories de vendor primitives (Kibo) — vendor fica, stories validam.                                                                         |
| 8   | `e35677f` | feat(ds): 7 stories ds-mobile + fix build prerender Suspense (`app/dashboard`, `app/layout`, stories)                                        | **PARTIAL**          | PPR Suspense fix em `app/layout.tsx` é crítico (KEEP). 7 stories DS são archetype-bound (REVERT).                                           |
| 9   | `a56a7d9` | feat(ds): bloco 3+4 — 9 lazy archetypes + 5 shadcn blocks + 5 kibo primitives                                                                | **PARTIAL**          | Kibo primitives + shadcn blocks (`app-sidebar`, `data-table`, charts) ficam. 9 lazy archetypes saem.                                        |
| 10  | `886c0d8` | feat(ds): bloco 2 — 23 wrappers ds-layer (tier 2/3/4 mobile)                                                                                 | **REVERT**           | Maioria consome `var(--role-*)` invented. Re-add JIT pós-pivot com shadcn-canonical.                                                        |
| 11  | `a370d80` | feat(design-system): bloco 1 — storybook decorator + fix 3 apca fails                                                                        | **PARTIAL**          | Storybook decorator de archetypes (REVERT). APCA fixes podem ser KEEP se forem em primitives.                                               |
| 12  | `b328d28` | feat(design-system): foundation 1.5+1.7+1.8+1.9 fechada                                                                                      | **REVERT**           | Foundation invented inteira.                                                                                                                |
| 13  | `f21fe2e` | feat(design-system): consolidacao 4 agents opus — 8 pesquisas aplicadas em codigo                                                            | **REVERT**           | Pesquisas opus implementadas em código invented.                                                                                            |
| 14  | `e718cc2` | docs(design-system): 8 pesquisas opus paralelas — specs implementation-ready                                                                 | **KEEP (docs only)** | Só `docs/design-system/research-{A..H}-*.md`. Não há código. Mantém como referência histórica, mas conteúdo será deletado em outro passo.   |

**Cutoff point candidato:** `b328d28` (foundation invented). Tudo desde
`f21fe2e` até `b328d28` (inclusive) é candidato a revert. Os commits
posteriores (`886c0d8` → `fe10231`) misturam KEEP+REVERT — exigem
cirurgia.

---

## 2. Comparação Option A / B / C

### Option A — Hard reset

```bash
git reset --hard b328d28~1   # = e718cc2 (último KEEP-only docs commit)
```

**Prós:**

- Máxima limpeza. Repo volta a um estado pré-invented.
- 1 comando.

**Contras:**

- **Perde PPR fix** (`fe10231`) — Suspense + view/page split — crítico.
- **Perde multi-tenant backbone** (`4ce11a4`) — `getRouteByHost` join
  palette+font.
- **Perde useBrand vendor blocks** (`ede0d49`) — white-label runtime.
- **Perde AdaptiveShell** (`7b94af8`) — útil mesmo pós-pivot.
- **Perde Kibo primitives + shadcn blocks** (`a56a7d9` parcial).
- Trabalho a refazer: alto.

**Veredito:** ❌ rejeitada. Perde demais.

---

### Option B — Revert múltiplo sequencial

```bash
git revert cae1f41 886c0d8 b328d28 f21fe2e  # commits 100% invented
# Cherry-pick não — git revert preserva PPR fix, multi-tenant, AdaptiveShell, kibo, vendor blocks
```

**Prós:**

- Preserva commits KEEP intactos (PPR fix, multi-tenant, brand, kibo).
- Cada revert é commit auditável (`Revert "<msg>"`).
- Git history forward-only (nada reescrito).

**Contras:**

- Commits **PARTIAL** (`e35677f`, `a56a7d9`, `a370d80`, `7b94af8`, `ddf8b5c`)
  não podem ser revertidos cleanly — misturam KEEP + REVERT no mesmo
  commit. Revertê-los tira coisa boa junto.
- Revert chain pode gerar merge conflicts (especialmente `886c0d8` que
  toca muitos arquivos depois modificados em commits PARTIAL).
- Vai sobrar lixo dos commits PARTIAL pra deletar à mão depois — não
  resolve sozinho.

**Veredito:** ⚠️ parcial. Útil pros 4 commits 100% invented, mas não
resolve commits PARTIAL.

---

### Option C — Surgical delete + 1 commit grande (RECOMENDADA)

NÃO reverte commits. Em vez disso, **deleta arquivos específicos** num
único commit grande. Trabalha no estado atual do tree (HEAD = `fe10231`)
porque os commits KEEP (PPR fix, multi-tenant, brand, Suspense, kibo)
JÁ ESTÃO aplicados no working tree.

```bash
# Deleta diretórios/arquivos invented (lista exata em §3)
git rm -r lib/design/archetypes/  # já deletado em tree atual — confirmar
git rm -r components/ds/lazy/
# ... etc

# 1 commit grande
git commit -m "chore(design-system): pivot TweakCN/shadcn-canonical — surgical delete invented layer"
```

**Prós:**

- **Preserva 100% dos commits KEEP** sem reverter nada.
- **Não importa em qual commit cada arquivo foi adicionado** —
  trabalhamos no tree atual.
- **Sem stubs**, sem move-to-legacy, sem platform-legacy folder.
- Git history forward-only + auditável (1 commit grande com lista
  completa).
- Pode rodar em sequência, item por item, com `git status` checks
  intermediários.
- Trabalho a refazer (AdaptiveShell, 5 wrappers úteis) fica anotado pra
  re-add JIT.

**Contras:**

- Requer mapping arquivo-por-arquivo (feito em §3).
- Commit grande perde granularidade. Mitigação: usar mensagem detalhada
  - referência ao plano + às heads dos arquivos deletados.
- Coisas "boas misturadas" dentro de arquivos `app/layout.tsx` ou
  `app/dashboard/page.tsx` exigem edit cirúrgico (não delete inteiro).

**Veredito:** ✅ **RECOMENDADA.** Mais cirúrgica + zero perda de
trabalho KEEP + zero código stub. Aceita o trade-off de 1 commit grande
em troca de limpeza total.

---

## 3. Inventário cirúrgico — arquivos/diretórios a deletar

Cada linha anota: status atual do path + ação + procedência.

### 3.1 `lib/design/` — código invented

| Path                                                                | Status atual              | Ação             | Procedência                             |
| ------------------------------------------------------------------- | ------------------------- | ---------------- | --------------------------------------- |
| `lib/design/archetypes/`                                            | **NÃO EXISTE no tree**    | já-gone          | foi deletado antes desta sessão         |
| `lib/design/contract/strategy.ts`                                   | precisa verificar         | direct delete    | adicionado em `b328d28`/`f21fe2e`       |
| `lib/design/contract/roles.ts`                                      | precisa verificar         | direct delete    | adicionado em `f21fe2e`                 |
| `lib/design/contract/voice.ts`                                      | precisa verificar         | direct delete    | adicionado em `f21fe2e`                 |
| `lib/design/contract/typography.ts`                                 | precisa verificar         | direct delete    | adicionado em `f21fe2e`                 |
| `lib/design/contract/illustrations.ts`                              | precisa verificar         | direct delete    | adicionado em `f21fe2e`                 |
| `lib/design/contract/visual.ts`                                     | precisa verificar         | direct delete    | adicionado em `f21fe2e`                 |
| `lib/design/role-resolver.ts`                                       | precisa verificar         | direct delete    | adicionado em `b328d28`                 |
| `lib/design/roles.ts`                                               | precisa verificar         | direct delete    | adicionado em `b328d28`                 |
| `lib/design/contract/index.ts` (que importa 6 sub-schemas invented) | existe — importa invented | rewrite vazio    | adicionado em `f21fe2e`                 |
| `lib/design/contract/tokens.ts`                                     | existe                    | review (parts)   | adicionado em `f21fe2e`                 |
| `lib/design/contract/mobile.ts`                                     | existe                    | review (parts)   | adicionado em `f21fe2e`                 |
| `lib/design/build-theme-css.ts`                                     | existe                    | rewrite (Fase 1) | tocado em `cae1f41`+`b328d28`+`f21fe2e` |
| `lib/design/generate-theme-css.ts`                                  | existe                    | review           | adicionado em `f21fe2e`                 |
| `lib/design/contrast.ts`                                            | existe                    | KEEP             | APCA logic — independente               |
| `lib/design/motion.ts`                                              | existe                    | KEEP             | motion durations canonical              |
| `lib/design/palettes.ts`                                            | existe                    | KEEP             | culori palette utility                  |
| `lib/design/tokens.ts`                                              | existe                    | review           | tokens definitions                      |
| `lib/design/validate-combo.ts`                                      | existe                    | review           | combo validation                        |
| `lib/design/seeds/`                                                 | existe                    | review           | preset seeds (35 palettes, 13 fonts)    |
| `lib/design/__tests__/`                                             | existe                    | review tests     | dependentes de invented                 |

### 3.2 `components/ds/` — wrappers invented

| Path                                               | Status | Ação                                                             | Notas                                                                  |
| -------------------------------------------------- | ------ | ---------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `components/ds/lazy/` (9 brand-folders)            | existe | **DELETE INTEIRO** — re-add JIT                                  | apple/figma/mastercard/mistral/nike/opencode/pinterest/stripe/theverge |
| `components/ds/app-accordion.tsx` (+ stories)      | existe | review: usa `--role-*`?                                          | provavelmente DELETE                                                   |
| `components/ds/app-badge.tsx` (+ stories)          | existe | review                                                           | provavelmente DELETE                                                   |
| `components/ds/app-button.tsx` (+ stories)         | existe | review                                                           | provavelmente DELETE                                                   |
| `components/ds/app-calendar-picker.tsx` (+stories) | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-card.tsx` (+ stories)           | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-chart.tsx` (+ stories)          | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-command.tsx` (+ stories)        | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-dialog.tsx` (+ stories)         | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-empty.tsx` (+ stories)          | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-fab.tsx` (+ stories)            | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-form-group.tsx` (+stories)      | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-hero.tsx` (+stories)            | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-image.tsx` (+ stories)          | existe | **REVIEW** — `<AppImage>` é abstração canônica (CLAUDE.md)       | provavelmente KEEP, mas simplifica                                     |
| `components/ds/app-input.tsx` (+ stories)          | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-list-item.tsx` (+ stories)      | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-paywall-button.tsx` (+stories)  | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-select.tsx` (+ stories)         | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-sheet.tsx` (+ stories)          | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-sidebar.tsx` (+ stories)        | existe | review — pode conflitar com `components/app-sidebar.tsx`         | review                                                                 |
| `components/ds/app-skeleton.tsx` (+ stories)       | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-sticky-cta.tsx` (+ stories)     | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-tabs.tsx` (+ stories)           | existe | review                                                           | DELETE                                                                 |
| `components/ds/app-textarea.tsx` (+ stories)       | existe | review                                                           | DELETE                                                                 |
| `components/ds/bottom-sheet.tsx` (+ stories)       | existe | review                                                           | DELETE                                                                 |
| `components/ds/icon.tsx` (+ stories)               | existe | **REVIEW** — `<Icon>` é abstração canônica (CLAUDE.md)           | provavelmente KEEP, simplifica                                         |
| `components/ds/navigation-bottom.tsx` (+stories)   | existe | review                                                           | DELETE                                                                 |
| `components/ds/navigation-top.tsx` (+stories)      | existe | review                                                           | DELETE                                                                 |
| `components/ds/persistent-mini-player.tsx`         | existe | review                                                           | DELETE                                                                 |
| `components/ds/safe-area-wrapper.tsx` (+stories)   | existe | **REVIEW** — encapsula `env(safe-area-inset-*)` mobile primitive | provavelmente KEEP                                                     |
| `components/ds/section.tsx` (+stories)             | existe | review                                                           | DELETE                                                                 |
| `components/ds/section-header.tsx` (+stories)      | existe | review                                                           | DELETE                                                                 |
| `components/ds/adaptive-shell.tsx`                 | existe | **REVIEW** — pattern útil mas archetype-coupling pode existir    | KEEP review, reescrever JIT                                            |

**Critério de review:** abrir cada arquivo + `grep -E "var\(--role-|--font-(display|body|accent|eyebrow)|archetype"`. Se 0 ocorrências → KEEP candidato. Se ≥1 → DELETE.

### 3.3 `docs/` — documentação invented

| Path                                                      | Ação               | Notas                                                 |
| --------------------------------------------------------- | ------------------ | ----------------------------------------------------- |
| `docs/design-system/` (folder)                            | **DELETE INTEIRO** | já está vazio no tree atual — só remover diretório    |
| `docs/references/design-systems/` (71+ brand folders)     | **DELETE INTEIRO** | direct delete (~73 folders)                           |
| `docs/research/20-naming-mappings.md`                     | DELETE             | mapping pra vocab invented                            |
| `docs/research/26-design-system-vibes.md`                 | DELETE             | vibes pra archetype morto                             |
| `docs/research/27-design-tokens-per-archetype.md`         | DELETE             | tokens per archetype                                  |
| `docs/research/29-token-partition-universal-vs-tenant.md` | **KEEP + caveat**  | estudo TweakCN-inferência — marcar caveat no topo     |
| `docs/research/30-color-format-culori-integration.md`     | **KEEP + caveat**  | estudo TweakCN-inferência — marcar caveat no topo     |
| `docs/research/31-zod-schema-shadcn-canonical.md`         | **KEEP + caveat**  | estudo TweakCN-inferência — marcar caveat no topo     |
| `docs/research/28-tweakcn-evaluation.md`                  | **KEEP**           | inferência mas serviu de pre-leitura; ainda útil      |
| `docs/research/01-25.md` (não-design-system)              | KEEP               | pesquisas válidas em outros temas (forms, pages, etc) |

### 3.4 `messages/pt-BR/voice/` — voice tokens i18n

| Path                    | Ação               | Notas                                                                                                    |
| ----------------------- | ------------------ | -------------------------------------------------------------------------------------------------------- |
| `messages/pt-BR/voice/` | **DELETE INTEIRO** | 10 JSONs archetype-bound (airbnb, apple, claude, figma, linear, mastercard, meta, mistral, nike, notion) |

### 3.5 `app/showcase/` — showcase fracassado

| Path            | Status                 | Ação    |
| --------------- | ---------------------- | ------- |
| `app/showcase/` | **NÃO EXISTE no tree** | já-gone |

### 3.6 `.claude/` — rules + worktrees

| Path                                         | Ação               | Notas                                                          |
| -------------------------------------------- | ------------------ | -------------------------------------------------------------- |
| `.claude/rules/design-references.md`         | **DELETE INTEIRO** | mesmo invertido, sem DESIGN.md folder = sem escopo aplicação   |
| `.claude/worktrees/agent-a346e91b13e285d70/` | **DELETE INTEIRO** | obsoleto, locked, confunde scan                                |
| `.claude/worktrees/agent-a60ee799e6d5abc0d/` | **DELETE INTEIRO** | obsoleto                                                       |
| `.claude/rules/design-tokens.md`             | **REWRITE**        | shadcn-canonical 41 + extras opt-in (Fase 1 Step 2.3 do plano) |

### 3.7 DB — Migrations

| Migration                                  | Ação     | Notas                                            |
| ------------------------------------------ | -------- | ------------------------------------------------ |
| `0020_design_system_archetype_palette.sql` | **KEEP** | Fase 4 vai migrar schema, mas Fase 0 não toca DB |
| `0021_reserve_tenant_theme_presets.sql`    | **KEEP** | reservação table — Fase 4 reusa                  |
| `0022_showcase_tenant.sql`                 | **KEEP** | test fixture útil                                |
| `0023_grant_service_role.sql`              | **KEEP** | bug real consertado — manter                     |

---

## 4. Trabalho bom a refazer JIT (preserva memória)

Lista de **commits/arquivos KEEP-com-asterisco** que mantêm o trabalho
útil acessível via git history pra re-add quando feature pedir:

| Item                                                                          | Commit origem       | Quando re-add                                       |
| ----------------------------------------------------------------------------- | ------------------- | --------------------------------------------------- |
| **AdaptiveShell pattern**                                                     | `7b94af8`           | Quando 2+ rotas precisarem responsive switching     |
| **PPR Suspense fix + view/page split**                                        | `e35677f`+`fe10231` | **JÁ KEEP** — fica no working tree                  |
| **`getRouteByHost` join palette + font slugs**                                | `4ce11a4`           | **JÁ KEEP** — multi-tenant backbone                 |
| **useBrand vendor blocks tematizados**                                        | `ede0d49`           | **JÁ KEEP** — white-label                           |
| **Kibo UI primitives + stories**                                              | `a56a7d9`+`ddf8b5c` | **JÁ KEEP** — vendor                                |
| **shadcn block components** (app-sidebar, data-table, charts, login-form etc) | `a56a7d9`           | **JÁ KEEP** — em `components/*.tsx` (não `ds/*`)    |
| **`<AppImage>` simplificado** (next/image wrapper)                            | review              | KEEP em arquivo se passar review                    |
| **`<Icon>` simplificado** (lucide wrapper)                                    | review              | KEEP em arquivo se passar review                    |
| **`<SafeAreaWrapper>`**                                                       | review              | KEEP — encapsula `env(safe-area-inset-*)` universal |
| **Migration 0023 GRANT**                                                      | DB                  | **JÁ KEEP** — bug real consertado                   |
| **Migration 0022 showcase tenant**                                            | DB                  | **JÁ KEEP** — test fixture                          |
| **APCA Silver validator (`lib/design/contrast.ts`)**                          | dia 0               | **JÁ KEEP** — independent of pivot                  |
| **Motion durations canonical (`lib/design/motion.ts`)**                       | dia 0               | **JÁ KEEP** — universal                             |
| **Culori palette utility (`lib/design/palettes.ts`)**                         | dia 0               | **JÁ KEEP** — independent                           |

---

## 5. Recomendação final

**Option C (surgical delete + 1 commit grande) — RECOMENDADA.**

Razões consolidadas:

1. **Preserva todos os commits KEEP intactos** (PPR fix, multi-tenant
   backbone, white-label brand, Kibo, shadcn blocks).
2. **Sem stubs** — files temporários enganam.
3. **Sem platform-legacy** — pasta vizinha gera dead code circulando +
   tentação de "olhar como era antes".
4. **Git history preserva tudo** — se decidirmos resgatar AdaptiveShell
   ou outro pattern, git show `<commit>` recupera.
5. **Auditável** — 1 commit com lista completa, fácil de revisar +
   reverter inteiro se necessário.
6. **Build verde no fim do commit único** — após delete + ajustes em
   `app/layout.tsx` (remove import de `archetypes/`, etc) + simplifica
   `lib/design/contract/index.ts`, build volta.

**Próximo passo após user aprovar Option C:**

1. Rodar `grep -r "var(--role-" components/ds/` pra confirmar quais
   wrappers consomem invented (define lista DELETE exata).
2. Rodar `grep -r "from '@/lib/design/archetypes'" app/ components/ lib/`
   pra confirmar zero referência (já-gone).
3. Executar deletes em sequência, com `pnpm typecheck` intermediário pra
   detectar consumers ocultos.
4. Ajustes finais em `app/layout.tsx` + `lib/design/contract/index.ts`
   pra remover imports/exports invented.
5. Commit único + push (se user aprovar).

---

## 6. Insights soltos pra futuro

- **Move-to-legacy é anti-pattern** quando o objetivo é matar
  vocabulário. Pasta vizinha é "graveyard que ainda fala" — gera
  tentação. Delete + git history é o canal correto.
- **Stubs são debt visível** — atrasam Fase 1 sem benefício real
  ("escora pra commit Fase 0 não quebrar"). Surgical delete + ajuste
  cirúrgico em consumers nos mesmos commits resolve sem stub.
- **TweakCN clone read-only ao lado** é melhor padrão que submodule
  porque (a) não polui git index do platform, (b) pode atualizar
  independentemente (`git pull` em `tweakcn-ref`), (c) é referência viva
  enquanto adapta — não fonte de truth.
- **Pesquisas 29/30/31 são inferência válida mas precisam validar
  contra ../tweakcn-ref antes de Fase 1 começar.** Caveat no topo de
  cada research evita over-confidence.
