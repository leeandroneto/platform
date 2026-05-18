# Plano v4 — Consistência visual + Acessibilidade (Fases 28-39)

> **Por que existe:** auditoria 2026-05-02 (sessão consistencia+a11y) revelou que o sistema de design existe e está bem desenhado (3 camadas OKLCH + componentes Heading/Text + multi-tenant via data-attributes), mas o **enforcement parou no nível de raw HTML**. Lint bloqueia `<button>`/`<input>`/`<h1-6>`/`<p>`, mas NÃO bloqueia bypass de tokens via classes Tailwind nativas. Resultado: **2/3 da UI não honra completamente o multi-tenant** + skip link ausente (WCAG 2.4.1 Level A) + multi-tenant focus ring vulnerável.
>
> **Pré-requisito:** fases 00-22 concluídas. Fases 23-27 (wave fechamento real) podem rodar em paralelo com 28-30, mas devem terminar antes de 31-34.
> **Tempo estimado:** ~32h em 12 fases.
> **Modelo recomendado:** Sonnet (28, 30, 33, 35, 40) + Opus (29, 31, 32, 34, 36, 37, 38, 39).
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmação.

---

## Por que precisa desta wave

Auditoria 2026-05-02 cruzou greps + leitura de docs WCAG 2.2 + análise do sistema multi-tenant:

### Visual (bypass de tokens)

| Sintoma                                   | Ocorrências | Arquivos | Significado                                  |
| ----------------------------------------- | ----------- | -------- | -------------------------------------------- |
| `text-{xs/sm/base/lg/xl/...}` direto      | **1250**    | 254      | Bypass do `<Text variant>`/`<Heading level>` |
| `text-[Npx]` arbitrary                    | 124         | 11       | Concentrado em creatives/cover               |
| `tracking-{tight/wide/widest/...}` direto | 466         | 148      | Bypass do `--tracking-*`                     |
| `uppercase` solto                         | **491**     | 147      | Eyebrow virou pattern copiado em ~80 lugares |
| `rounded-{sm/md/lg/xl/...}` direto        | **449**     | 178      | **Bypass do multi-tenant** (`--shape-*`)     |
| `rounded-[var(--shape-*)]` correto        | 284         | 144      | Apenas 39% do uso de rounded                 |
| `style={{ color/bg/border }}` inline      | 202         | 30       | Bypass de tokens semânticos                  |
| `#hex` literal em components              | 78          | 20       | Concentrado em gauges/launch/mockups         |

**Impacto multi-tenant:** quando profissional escolhe `data-shape="sharp"` (7px) ou `"soft"` (22px), só 1/3 da UI muda — o resto fica preso ao `rounded-lg` Tailwind nativo (8px fixo).

### Acessibilidade (gaps WCAG 2.2)

| Critério                                       | Status                                                       |
| ---------------------------------------------- | ------------------------------------------------------------ |
| 2.4.1 Bypass Blocks (Level A) — skip link      | ❌ **0 ocorrências** no repo                                 |
| 1.3.1 / 2.4.6 — `<nav>` sem `aria-label`       | ❌ Múltiplos `<nav>` indistinguíveis                         |
| 4.1.2 — `aria-current` em estado atual         | ❌ 3 ocorrências (deveria ser 30+)                           |
| 3.3.1 — form errors associados                 | ❌ `aria-describedby` em 9 lugares                           |
| 4.1.3 — live regions                           | ❌ 4 ocorrências (loading/save órfãos)                       |
| 1.3.1 — heading hierarchy                      | ⚠️ Eyebrow uppercase como `<Heading level>` quebra estrutura |
| 2.4.13 — Focus Appearance (AAA, multi-tenant!) | ⚠️ Ring usa paleta variável; sem guard de contraste          |
| 2.4.11 — Focus Not Obscured (AA, novo 2.2)     | ⚠️ Bottom-nav 96px pode cobrir foco                          |

Sources: WCAG 2.2 oficial (W3C, out/2023), Carbon Design System, Microsoft Fluent 2, Atlassian, Eight Shapes, Mavik Labs (Tailwind v4).

---

## Decisões fixadas (escopo confirmado pelo fundador)

1. ✅ **Pasta única** — tudo em `docs/refatoracao-2026-05/execucao/` (continuidade do ciclo). Numeração 28-40 segue após wave 23-27.
2. ✅ **Master único** (este doc) com 13 fases internas — mesmo padrão de `fase-15-cobertura-100.md` e `fase-23-fechamento-real.md`.
3. ✅ **WCAG 2.2 AA + AAA completo** (16 critérios). AAA Focus Appearance é especialmente crítico para o multi-tenant.
4. ✅ **Lint enforce gradual:** Fase 30 adiciona regras como warn, Fase 39 promove pra error após sweeps zerarem warnings.
5. ✅ **Audit antes de aplicar (princípio crítico):** cada fase começa com seção "Mini-audit" — greps específicos antes de qualquer edit. Sem audit, sweep vira chute.
6. ✅ **Multi-tenant é SAGRADO:** sweep visual valida em `data-shape={sharp,rounded,soft}` + `data-typography={modern,editorial,classic,bold}` + 5 paletas após cada sub-grupo.

---

## ⛔ REGRA DE OURO — PROIBIDO SIMPLIFICAR OU PULAR ETAPAS

**Vale para TODAS as fases 28-40. Sem excecao.**

- **PROIBIDO pular item.** Se "Migrar 449 ocorrencias" esta listado, sao as 449 — nao 400, nao "as principais".
- **PROIBIDO simplificar.** Sem versao "minima viavel", sem "depois eu volto", sem "ja deu pra entender".
- **PROIBIDO marcar item como concluido sem ter executado integralmente.**
- **PROIBIDO cortar escopo unilateralmente.** Se algo e impossivel ou perigoso, PARAR e perguntar ao fundador antes.
- **PROIBIDO "TODO: revisitar".** Resolva agora ou reporte como bloqueio explicito.

Se um item demorar mais que o estimado: continue. Se um item for mais complexo que parece: continue. Se voce achou um atalho "equivalente": NAO use sem confirmar.

A unica saida valida de um item e: **executado 100%** OU **reportado como bloqueio com diagnostico**.

**Ao concluir cada fase, o terminal DEVE reportar ao fundador:**

1. O que foi feito (deltas, numeros)
2. Estado do build (tsc/vitest/lint/etc)
3. **Qual a proxima fase E quais podem rodar em paralelo agora** (se houver)
4. Comando exato pra abrir terminal seguinte

---

## ⛔ HORIZONTAL = 100% DO PROJETO

**Esta refatoracao e HORIZONTAL.** Significa: cobertura completa de TODA a base de codigo, sem excecoes silenciosas.

- **TODAS as rotas** (~120 page.tsx + layout.tsx + route.ts)
- **TODOS os componentes** (~250 .tsx em components/, fora ui/)
- **TODOS os primitives** em components/ui/ (ja compliant, mas validar)
- **TODOS os layouts** das route groups: (auth), (app)/(shell), (app)/onboarding, (public), (client), admin, (influencer)
- **TODAS as superficies publicas** que aplicam resolveDesignAttrs
- **TODAS as superficies internas** (dashboard, admin, etc) — multi-tenant nao se aplica, mas tokens ainda obrigatorios
- **TODOS os flows multi-step** (onboarding 23 steps, intake form, audit form, checkout)

**Nao existe "as principais".** Se uma rota foi listada com 30 ocorrencias de `text-{size}`, sao as 30 — nao 25, nao "as visiveis". Se `aria-current` precisa ser adicionado em 30+ lugares, sao 30+, nao "uns 5 mais usados".

**Sweep cego nao funciona — audit primeiro, executa-se 100%, valida 100%.** Cada sub-grupo do sweep tem checkpoint visual antes do proximo commit. Cada criterio WCAG tem validacao explicita. Cada item do CHECKLIST tem status [x], [!] (falhou com motivo) ou [ ] (pendente — proibido marcar como [x] se nao foi feito).

---

## 📝 OBRIGATORIO ATUALIZAR DOCS + DOCUMENTAR FALHAS

**Ao final de CADA fase, o terminal DEVE atualizar os docs (nao opcional):**

1. **`CHECKLIST.md`** (raiz da pasta execucao/):
   - Marcar items concluidos com `[x]`
   - Items que falharam com `[!]` + motivo inline
   - Items pendentes que ficaram pra depois com `[ ]` + nota explicativa
   - Adicionar SHA do commit ao final da secao da fase

2. **`AUDITORIA-CONSISTENCIA-A11Y.md`** (criado na Fase 28):
   - Atualizar tabela "antes/depois" com numeros pos-fase
   - Adicionar excecoes documentadas (eslint-disable com motivo, skips declarados)
   - Registrar Lighthouse score se rodou

3. **CLAUDE.md** (so na Fase 40):
   - Ultima atualizacao com data
   - Historico de reescritas — nova entrada
   - Abstracoes disponiveis (primitives novos)
   - Secao "Acessibilidade" com checklist
   - Regras de casing + tipografia/shapes/cores

4. **Mensagem de commit** segue convencao: `<type>(NN): <descricao>` (ex: `refactor(31): 449 rounded-* → var(--shape-*)`)

**Documentar TUDO que nao deu certo:**

- **Bloqueios** (algo impossivel de fazer): seção "Bugs encontrados" no CHECKLIST.md + motivo + impacto + workaround proposto (se houver)
- **Decisoes nao previstas**: seção "Decisoes tomadas" — o que foi escolhido + por que + alternativas consideradas
- **Items parciais**: marcar `[!]` com explicacao especifica do que ficou pendente
- **Excecoes ao plano** (ex: skip declarado em criterio AAA): documentar em `accessibility.md` ou inline no codigo com `eslint-disable-next-line` + comentario
- **Regressoes visuais detectadas**: VRT diff documentado, mesmo se for falso positivo
- **Falsos positivos** de lint, knip, axe: adicionar a allowlist com motivo OU fixar o problema raiz
- **Heuristicas que falharam**: ex: "tentei sweep automatico de uppercase, mas <X> casos exigiam decisao manual" — documentar em CHECKLIST.md

**Filosofia:** se algo nao deu certo e nao foi documentado, e como se nao tivesse acontecido. O proximo terminal/sessao **vai repetir o erro**. Documentacao honesta de falhas e tao importante quanto reportar sucessos.

**Nao existe "TODO: revisitar".** Resolva agora ou registre como bloqueio explicito (com ID, motivo, impacto, owner).

---

## Coordenação com wave 23-27

Wave 23-27 (`fase-23-fechamento-real.md`) já em andamento. Cuidados:

| Wave 23-27                        | Wave 28-39      | Pode paralelo?                                                            |
| --------------------------------- | --------------- | ------------------------------------------------------------------------- |
| 23 (ops: deploy + sync + débitos) | qualquer        | ✅ zero conflito (não toca código React)                                  |
| 24 (tsconfig hardening)           | 28-30, 35-40    | ✅ apenas se não conflitar com sweeps 31-34                               |
| 25 (decompose 10 components)      | 28, 29, 30, 35  | ✅ se não tocar arquivos do sweep                                         |
| 25                                | 31-34 (sweeps)  | ❌ TOCAM MESMOS ARQUIVOS — 9/10 components da Fase 25 são alvo dos sweeps |
| 26 (decompose 4 pages)            | 28, 29, 30, 35  | ✅                                                                        |
| 26                                | 31-34 (sweeps)  | ❌ TOCAM MESMOS ARQUIVOS                                                  |
| 27 (VRT baseline)                 | 28, 29, 30      | ✅ recomendado rodar VRT ANTES de sweeps pra ter baseline pre-mudanças    |
| 27.2 (manual sweep)               | 39 (craft pass) | 🔀 **fundir** — Fase 39 absorve manual sweep + VRT compare                |

**Ordem ideal cross-wave:**

```
23 (paralelo com 28) → 24 → 25+26 (paralelo entre si) → 27.1 VRT baseline →
28-30 (paraleliza com 23-27 se tiver folga) → 31+32 (paralelo) → 33+34 (paralelo) →
35+36 (paralelo) → 37 → 38 → 39 (funde com 27.2) → 40
```

Recomendado: terminar wave 23-27 ANTES de iniciar 31-34. As fases 28, 29, 30 (baseline + foundations + lint warn) podem rodar em paralelo com 23-27 sem risco — não tocam mesmos arquivos.

---

## Visão geral das 12 fases

```
Fase 28 — Baseline + audit detalhado                       ~1h     Sonnet
Fase 29 — Foundations (Eyebrow/SectionTitle/SkipLink)      ~3h     Opus
Fase 30 — Lint hardening (warn first)                      ~2h     Sonnet
Fase 31 — Sweep shapes (449 rounded-* → var(--shape-*))    ~3h     Opus  🔀 com 32
Fase 32 — Sweep typography (1250 text-{size} → Text)       ~4h     Opus  🔀 com 31
Fase 33 — Sweep casing (491 uppercase → <Eyebrow>)         ~2h     Sonnet 🔀 com 34
Fase 34 — Sweep cores hardcoded + inline styles            ~2h     Opus  🔀 com 33
Fase 35 — A11y foundations (skip link + landmarks)         ~2h     Sonnet 🔀 com 36
Fase 36 — A11y ARIA states (current/describedby/live)      ~3h     Opus  🔀 com 35
Fase 37 — Heading hierarchy + multi-tenant focus ring      ~2h     Opus
Fase 38 — WCAG 2.2 AA + AAA completo + axe-playwright CI   ~4h     Opus
Fase 39 — Lint promote + craft pass + VRT compare          ~5h     Opus
Fase 40 — Verificação final + docs update                  ~1h     Sonnet
                                                          ────
                                                  Total:   ~34h
```

**Ordem mandatória:** 28 → 29 → 30 → (31+32) → (33+34) → (35+36) → 37 → 38 → 39 → 40.

**Paralelismo dentro da wave (🔀):**

- 31+32: tocam mesmos arquivos mas concerns ortogonais (rounded vs text). Coordenar via `git pull --rebase` a cada commit.
- 33+34: idem (uppercase vs cores).
- 35+36: 35 toca layouts, 36 toca componentes — concerns separados.

**Cuidado paralelismo cross-wave:** 25/26 (decompose) e 31/32 (sweeps) NUNCA simultâneos.

---

# Fase 28 — Baseline + audit detalhado

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 28`
> **Tempo:** ~1h
> **Modelo:** Sonnet 4.6 — só roda greps + tag git
> **Depende de:** wave 23-27 idealmente concluída (ou em andamento, sem bloquear)
> **Paralelo com:** Fase 23 (ops) 🔀

Snapshot reproduzível antes de qualquer mudança. Cada métrica vai ter coluna "Pos Fase NN" preenchida ao longo da wave.

## Mini-audit

```
[ ] rg "text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b" components/ -t tsx | wc -l   → ~1250
[ ] rg "rounded-(?:sm|md|lg|xl|2xl|3xl|full)\b" components/ -t tsx | wc -l                  → ~449 (bypass) + 284 (correto)
[ ] rg "uppercase" components/ -t tsx | wc -l                                                → ~491
[ ] rg "#[0-9a-fA-F]{6}\b" components/ -t tsx | wc -l                                        → ~78
[ ] rg "style=\{\{[^}]*(?:color|backgroundColor|background|borderColor):" components/ -t tsx | wc -l → ~202
[ ] rg "SkipLink|skip-link|skipToContent" -t tsx | wc -l                                     → 0
[ ] rg "aria-current=" -t tsx | wc -l                                                        → 3
[ ] rg "aria-(?:describedby|labelledby)=" -t tsx | wc -l                                     → 9
[ ] rg "aria-live|role=\"(?:status|alert)\"" -t tsx | wc -l                                  → 4
```

## Itens

```
[ ] 28.1 — Criar AUDITORIA-CONSISTENCIA-A11Y.md (separar do AUDITORIA-COBERTURA.md histórico)
            com greps reproduzíveis + tabela "antes/depois" template
[ ] 28.2 — Tag git: pre-consistency-a11y-2026-05b — git push origin pre-consistency-a11y-2026-05b
[ ] 28.3 — Documentar baseline tsc/vitest/lint/knip/build em AUDITORIA-CONSISTENCIA-A11Y.md
[ ] 28.4 — Mapa de surfaces públicas (rg "resolveDesignAttrs" --type tsx -l)
[ ] 28.5 — Catalogar ui/ que JÁ usam --shape-* vs não usam
[ ] 28.6 — Lighthouse a11y baseline em 6 rotas-chave (login, signup, dashboard, [slug], [slug]/analise, r/[token])
[ ] 28.7 — Commit: "chore(28): baseline + auditoria detalhada consistencia+a11y"
```

## Ao concluir

Reportar: numeros baseline (text/rounded/uppercase/hex/inline + a11y gaps), estado do build, Lighthouse scores em 6 rotas.

Dizer ao fundador:

---

**Fase 28 concluida.**

Baseline registrado em AUDITORIA-CONSISTENCIA-A11Y.md. Tag git `pre-consistency-a11y-2026-05b` criada.

Build: tsc 0, vitest <N>/<N>, lint 0/0, knip 0, build 100%.

**Proxima fase — 1 terminal (Opus 4.7, ~3h):**

`"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 29"`

🔀 **Paralelismo possivel agora:** se Fase 24 (tsconfig) ainda nao rodou, pode rodar em outro terminal — concerns diferentes (foundations cria 3 primitives novos pequenos, tsconfig toca tsconfig.json + fixes).

**REGRA DE OURO: nao simplificar nem pular etapas.** Cada item da Fase 29 e mandatorio (3 primitives + i18n + scroll-padding + stories + tests + CLAUDE.md). Se travar, reportar como bloqueio.

---

# Fase 29 — Foundations (Eyebrow/SectionTitle/SkipLink)

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 29`
> **Tempo:** ~3h
> **Modelo:** Opus 4.7 — cria primitives com API design crítico
> **Depende de:** Fase 28
> **Paralelo com:** Fase 24 (tsconfig — concerns diferentes) 🔀

Criar primitives novos ANTES de qualquer migração em massa.

## Mini-audit

```
[ ] rg "text-xs.*tracking-widest.*uppercase\|text-xs.*uppercase.*tracking-widest" components/ -t tsx | wc -l → ~80 (eyebrow puro)
[ ] rg "<Heading level=\{1\}" --type tsx | wc -l                                       → quantos h1 totais
[ ] rg "^\s*--shape-\|^\s*--text-\|^\s*--tracking-\|^\s*--leading-" app/globals.css   → confirmar tokens
[ ] rg "bottom-nav-height" app/globals.css                                              → confirmar token existe
```

## Itens

```
[ ] 29.1 — components/ui/eyebrow.tsx (variant=default|muted|accent, uppercase + tracking-wide + text-micro)
[ ] 29.2 — components/ui/section-title.tsx (eyebrow opcional + heading + subtitle)
[ ] 29.3 — components/ui/skip-link.tsx (sr-only + focus:not-sr-only, i18n via 'a11y' namespace)
[ ] 29.4 — i18n keys em messages/pt-BR.json:
            "a11y": { skipToContent, mainNav, mobileNav, drawerNav, footerNav, breadcrumb, loading, saving }
[ ] 29.5 — scroll-padding-bottom: var(--bottom-nav-height) em html (globals.css)
[ ] 29.6 — Stories Ladle pra Eyebrow + SectionTitle
[ ] 29.7 — Tests: snapshots + render checks (3 arquivos, ~8-12 testes)
[ ] 29.8 — CLAUDE.md: adicionar 3 entradas em "Abstrações disponíveis"
[ ] 29.9 — tsc 0, vitest passa (+ testes novos), lint 0
[ ] 29.10 — Commit: "feat(29): foundations — Eyebrow, SectionTitle, SkipLink primitives"
```

## Ao concluir

Reportar: 3 primitives criados, 8 i18n keys novas, scroll-padding aplicado, 3 stories Ladle, ~8-12 tests novos, CLAUDE.md atualizado.

Dizer ao fundador:

---

**Fase 29 concluida.**

Primitives novos em components/ui/: Eyebrow, SectionTitle, SkipLink. Stories Ladle + tests + i18n 'a11y' namespace + scroll-padding-bottom em html. CLAUDE.md atualizado em "Abstracoes disponiveis".

Build: tsc 0, vitest <N>/<N> (+ <K> testes novos), lint 0/0.

**Proxima fase — 1 terminal (Sonnet 4.6, ~2h):**

`"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 30"`

🔀 **Paralelismo possivel agora:** Fase 35 (a11y foundations) tambem depende apenas de Fase 29 — pode rodar em paralelo com Fase 30 em outro terminal (35 toca layouts, 30 toca eslint.config.mjs — concerns separados).

**REGRA DE OURO: nao simplificar nem pular etapas.** As 5 regras de lint sao todas mandatorias. Severity warn e proposital — promote pra error so na Fase 39 apos sweeps.

---

# Fase 30 — Lint hardening (warn first)

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 30`
> **Tempo:** ~2h
> **Modelo:** Sonnet 4.6 — configura ESLint
> **Depende de:** Fase 29 (primitives existem)
> **Paralelo com:** Fase 35 (a11y foundations) 🔀

Adicionar regras `no-restricted-syntax` que pegam bypasses. **Inicialmente como warn** — sweeps das Fases 31-34 reduzem warnings, Fase 39 promove pra error.

## Mini-audit

```
[ ] rg "no-restricted-syntax" eslint.config.mjs  → contar selectors atuais
[ ] rg "rounded-(?:sm|md|lg|xl|2xl|3xl)\b" components/ui/ -t tsx -l    → arquivos pra allowlist
[ ] rg "text-(?:xs|sm|base|lg|xl)\b" components/ui/ -t tsx -l         → idem
```

## Itens

```
[ ] 30.1 — Regra warn: bloquear text-{size} fora de components/ui/
[ ] 30.2 — Regra warn: bloquear rounded-{sm/md/lg/xl/2xl/3xl} (mantém rounded-full e rounded-none)
[ ] 30.3 — Regra warn: bloquear tracking-{tight/wide/widest/...} solto
[ ] 30.4 — Regra warn: bloquear uppercase solto fora de components/ui/{eyebrow,badge}.tsx
[ ] 30.5 — Regra warn: bloquear inline style com hex/rgb/hsl literal (deixa passar var(--*) e identifiers dynamic)
[ ] 30.6 — Overrides: components/ui/**, **/*.stories.tsx, lib/email/**, lib/pdf/**, components/landing/mockups/Mock*.tsx
[ ] 30.7 — pnpm lint reporta count total de warnings (esperado ~2400+ — trabalho das 31-34)
[ ] 30.8 — tsc 0, build passa
[ ] 30.9 — Commit: "chore(30): lint hardening (warn) — text/rounded/uppercase/tracking/inline-style"
```

## Ao concluir

Reportar: 5 regras de lint adicionadas como warn, count total de warnings reportado por categoria (text/rounded/uppercase/tracking/inline-style).

Dizer ao fundador:

---

**Fase 30 concluida.**

5 regras novas em eslint.config.mjs (todas como warn): text-{size}, rounded-{size}, tracking-{soltos}, uppercase, inline style com hex/rgb/hsl.

Total de warnings: ~2400+ (esperado — trabalho das proximas fases zerar).
Overrides aplicados: components/ui/, _.stories.tsx, lib/email/, lib/pdf/, components/landing/mockups/Mock_.tsx.

Build: tsc 0, lint 0 erros (warnings nao bloqueiam), build passa.

**Proxima(s) fase(s) — 2 terminais paralelos 🔀 (Opus 4.7 cada, ~3-4h):**

⚠️ **CUIDADO CROSS-WAVE:** se Fases 25 (decompose components) e 26 (decompose pages) AINDA nao concluiram, AGUARDAR. Sweeps 31/32 tocam mesmos arquivos — conflito massivo se simultaneo.

Quando 25+26 estiverem concluidas:

Terminal A: `"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 31"` (shapes)
Terminal B: `"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 32"` (typography)

Ambas tocam ~250 arquivos com concerns ortogonais (rounded-_ vs text-_). Coordenar via `git pull --rebase` a CADA commit em ambos os terminais — caso contrario, conflito de merge.

**REGRA DE OURO: nao simplificar nem pular etapas.** Cada sub-grupo dos sweeps e mandatorio. Validar visualmente em data-shape/typography apos cada sub-grupo, NUNCA acumular "vou validar depois".

---

# Fase 31 — Sweep shapes (`rounded-*` → `var(--shape-*)`)

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 31`
> **Tempo:** ~3h
> **Modelo:** Opus 4.7 — toca 178 arquivos com decisões caso a caso
> **Depende de:** Fase 30. **NUNCA simultâneo com Fase 25 ou 26** (mesmos arquivos).
> **Paralelo com:** Fase 32 (typography) 🔀 — coordenar via `git pull --rebase` a cada commit

Migrar 449 ocorrências em 178 arquivos. Restaurar promessa do multi-tenant: `data-shape` deve afetar TODA a UI (era 39%, vira 100%).

## Mini-audit

```
[ ] rg "rounded-(?:sm|md|lg|xl|2xl|3xl)\b" components/ -t tsx | wc -l   → confirma ~449
[ ] Por sub-pasta (dimensionar sub-grupos): for dir in dashboard leads ...; rg ... -c
```

## Mapeamento decidido

```
rounded-md  → rounded-[var(--shape-input)]
rounded-lg  → rounded-[var(--shape-card)]
rounded-xl  → rounded-[var(--shape-card)]
rounded-2xl/3xl → rounded-[var(--shape-card)] ou criar --shape-card-elevated se gap repetido
rounded-sm  → rounded-[var(--shape-input)] (raro)
rounded-full / rounded-none → MANTER (intencional)
```

## Itens

```
[ ] 31.1 — Sub-grupo 1: dashboard + leads + clients (~80 occs)
[ ] 31.2 — Sub-grupo 2: settings + auth + account + credentials (~70)
[ ] 31.3 — Sub-grupo 3: landing + launch + site (~120) — Mock*.tsx tem allowlist
[ ] 31.4 — Sub-grupo 4: report + diagnostic-activation + funnel (~100)
[ ] 31.5 — Sub-grupo 5: form + template-picker + influencer (~50)
[ ] 31.6 — Sub-grupo 6: admin + outros (~30)
[ ] 31.7 — Sobras + escapes documentados (rounded-full/none intencionais)
[ ] 31.8 — App/ pages se houver: rg "rounded-(?:sm|md|lg|xl|2xl|3xl)\b" app/ -t tsx
[ ] 31.9 — Validar visual: pnpm dev + 5 rotas em data-shape={sharp,rounded,soft}
[ ] 31.10 — tsc 0, vitest passa, lint warnings de rounded-* = 0
[ ] 31.11 — Commit por sub-grupo + commit final: "refactor(31): 449 rounded-* → var(--shape-*)"
```

**Regra crítica:** após cada sub-grupo, validar visualmente em `data-shape="sharp"`/"rounded"/"soft" antes do próximo commit.

## Ao concluir

Reportar: 449 rounded-\* migradas em 178 arquivos, multi-tenant 39% → 100% (validado em data-shape em 5 rotas), excecoes documentadas.

Dizer ao fundador:

---

**Fase 31 concluida.**

449 ocorrencias de rounded-{md/lg/xl/2xl/3xl} migradas pra rounded-[var(--shape-*)] em 178 arquivos. Mantidos rounded-full (~N), rounded-none (~N), components/landing/mockups/Mock\*.tsx (allowlist).

Multi-tenant validado: 5 rotas testadas em data-shape={sharp,rounded,soft} — UI muda corretamente em 100% (era 39%).

Build: tsc 0, vitest <N>/<N>, lint warnings de rounded-\* = 0.

**Proxima fase — depende se Fase 32 ja terminou:**

OPCAO A — se Fase 32 (tipografia) ainda esta rodando em outro terminal: AGUARDAR conclusao dela antes de iniciar 33+34. Continuar coordenando git pull --rebase no terminal de 32.

OPCAO B — se Fase 32 ja concluiu: pode iniciar par 33+34 paralelo (Sonnet/Opus, ~2h cada):

Terminal A: `"... e execute a Fase 33"` (casing)
Terminal B: `"... e execute a Fase 34"` (cores)

Ambas dependem de 31+32 concluidas. Tocam arquivos sobrepostos — git pull --rebase a cada commit.

**REGRA DE OURO: nao simplificar nem pular etapas.** Se algum sub-grupo ficou sem validacao visual, VOLTAR e validar antes de declarar fase concluida.

---

# Fase 32 — Sweep tipografia (`text-{size}` → `<Text variant>`)

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 32`
> **Tempo:** ~4h
> **Modelo:** Opus 4.7 — 254 arquivos, decisões contextuais
> **Depende de:** Fase 30. **NUNCA simultâneo com Fase 25 ou 26.**
> **Paralelo com:** Fase 31 (shapes) 🔀

Migrar 1250 ocorrências em 254 arquivos.

## Mini-audit

```
[ ] rg "text-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl)\b" components/ -t tsx --glob '!components/ui/**' | wc -l  → confirma ~1250
[ ] Por sub-pasta
```

## Mapeamento decidido

```
text-xs       → <Text variant="micro"> ou "label"
text-sm       → <Text variant="body-small">
text-base     → <Text variant="body"> (default)
text-lg       → <Text variant="body-large"> ou Heading level={3}
text-xl       → Heading level={3}
text-2xl      → Heading level={2}
text-3xl+     → Heading level={1}
text-[Npx]    → mapear pra variant adequada
text-balance/pretty/center/left/right → MANTER (não é tipografia)
text-{color}  → MANTER (cores)
```

## Itens

```
[ ] 32.1 — Sub-grupo 1: dashboard + leads + clients (~150)
[ ] 32.2 — Sub-grupo 2: settings + auth + account + credentials (~120)
[ ] 32.3 — Sub-grupo 3: landing + launch + site (~250)
[ ] 32.4 — Sub-grupo 4: report + diagnostic-activation + funnel (~300)
[ ] 32.5 — Sub-grupo 5: form + template-picker + influencer (~120)
[ ] 32.6 — Sub-grupo 6: admin + outros (~110)
[ ] 32.7 — App/ pages
[ ] 32.8 — text-[Npx] arbitrary (124 occs em creatives/cover)
[ ] 32.9 — Validar visual: pnpm dev + 5 rotas em data-typography={modern,editorial,classic,bold}
[ ] 32.10 — tsc 0, vitest passa, lint warnings de text-* = 0
[ ] 32.11 — Commit por sub-grupo + final: "refactor(32): 1250 text-{size} → <Text variant>"
```

**Regra crítica:** preservar tag semântica (não trocar h1 por p), preservar className restante (cores, weight, alignment).

## Ao concluir

Reportar: 1250 text-{size} + 124 text-[Npx] migrados em 254 arquivos, validado em data-typography em 5 rotas.

Dizer ao fundador:

---

**Fase 32 concluida.**

1250 text-{size} + 124 text-[Npx] migrados pra <Text variant>/<Heading level> em 254 arquivos.

Multi-tenant validado: 5 rotas em data-typography={modern,editorial,classic,bold} — fonts trocam consistentemente.

Build: tsc 0, vitest <N>/<N>, lint warnings de text-\* = 0.

**Proxima fase — depende se Fase 31 ja terminou:**

OPCAO A — se Fase 31 (shapes) ainda esta rodando: AGUARDAR conclusao dela.

OPCAO B — se Fase 31 ja concluiu: par 33+34 paralelo (Sonnet/Opus, ~2h cada):

Terminal A: `"... e execute a Fase 33"` (casing)
Terminal B: `"... e execute a Fase 34"` (cores)

**REGRA DE OURO: nao simplificar nem pular etapas.** Texto dentro de Heading/Text mantem className extras (cores, weight, alignment) — nao deletar! Se algum sub-grupo ficou pendente, terminar antes de declarar fase concluida.

---

# Fase 33 — Sweep casing (uppercase → `<Eyebrow>`)

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 33`
> **Tempo:** ~2h
> **Modelo:** Sonnet 4.6 — sweep mecânico
> **Depende de:** Fases 31 + 32
> **Paralelo com:** Fase 34 (cores) 🔀

Padronizar casing: sentence case default; UPPERCASE só em `<Eyebrow>` (1-3 palavras) ou `<Badge>` (status).

## Mini-audit

```
[ ] rg "uppercase" components/ app/ -t tsx --glob '!components/ui/**' | wc -l  → confirma ~491
[ ] Categorizar:
    - Eyebrow pattern (uppercase + tracking + text-{micro/label}): ~80 → migrar pra <Eyebrow>
    - Status indicators (UPPERCASE 1 palavra): ~50 → Badge ou manter
    - Headings com uppercase em title longo (LegalShell): MIGRAR pra sentence case
    - Brand wordmark / logo: manter
```

## Itens

```
[ ] 33.1 — Sweep eyebrow pattern → <Eyebrow> (~80, distribuído por sub-pastas)
[ ] 33.2 — Heading uppercase em title/h1/h2 longos → sentence case (LegalShell etc)
[ ] 33.3 — Status indicators → <Badge> variant ou mantém se já é Badge
[ ] 33.4 — Sweep i18n strings em messages/pt-BR.json (caps incorporado em "PRIVACIDADE" etc)
[ ] 33.5 — Documentar regra de casing em CLAUDE.md (tabela contexto vs casing)
[ ] 33.6 — Sobras com eslint-disable + motivo
[ ] 33.7 — Validar visual: 5 rotas com eyebrows
[ ] 33.8 — tsc 0, vitest passa, lint warnings de uppercase = 0
[ ] 33.9 — Commit: "refactor(33): standardize casing — 491 uppercase migrated to <Eyebrow>"
```

## Ao concluir

Reportar: 491 uppercase categorizado, ~80 → <Eyebrow>, ~50 → Badge, headings longos → sentence case, regra documentada em CLAUDE.md.

Dizer ao fundador:

---

**Fase 33 concluida.**

491 uppercase migrados: ~80 eyebrow patterns → <Eyebrow>, ~50 status → <Badge>, headings longos → sentence case (LegalShell etc), <N> casos com eslint-disable + motivo.

i18n strings com caps incorporado em messages/pt-BR.json: lowercase (Eyebrow CSS aplica caps).

CLAUDE.md atualizado com tabela de regras de casing (sentence case default; UPPERCASE so em Eyebrow/Badge).

Build: tsc 0, vitest <N>/<N>, lint warnings de uppercase = 0.

**Proxima fase — depende se Fase 34 ja terminou:**

OPCAO A — se Fase 34 (cores) ainda esta rodando: AGUARDAR conclusao.

OPCAO B — se Fase 34 ja concluiu: par 35+36 paralelo (Sonnet/Opus, ~2-3h cada):

Terminal A: `"... e execute a Fase 35"` (a11y foundations — toca layouts)
Terminal B: `"... e execute a Fase 36"` (ARIA states — toca components)

Concerns separados: 35 mexe em layouts, 36 em components. Pouco risco de conflito.

**REGRA DE OURO: nao simplificar nem pular etapas.** Se ainda tem uppercase solto fora de Eyebrow/Badge sem disable explicito, NAO declarar fase concluida.

---

# Fase 34 — Sweep cores hardcoded + inline styles

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 34`
> **Tempo:** ~2h
> **Modelo:** Opus 4.7 — decisões contextuais (gauges/launch/diagnostic-activation)
> **Depende de:** Fases 31 + 32
> **Paralelo com:** Fase 33 (casing) 🔀

78 hex + 202 inline styles. Preservar dynamic colors (de prop/runtime) e simulações intencionais (mockups).

## Mini-audit

```
[ ] rg "#[0-9a-fA-F]{6}\b" components/ -t tsx | wc -l                                                → 78
[ ] rg "style=\{\{[^}]*(?:color|backgroundColor|background|borderColor):" components/ -t tsx | wc -l  → 202
[ ] Categorizar:
    A. Score viz (gauges) → --color-score-*
    B. Mockups intencionais (Mock*.tsx) → manter + eslint-disable
    C. Launch/marketing → CSS vars locais (--launch-*)
    D. Diagnostic-activation → sweep sistemático
    E. Inline dynamic (item.color) → manter
    F. Inline estático (sem var) → migrar pra className
```

## Itens

```
[ ] 34.1 — components/report/metrics/gauges/* — hex → var(--color-score-*)
[ ] 34.2 — components/launch/_sections/* — extrair em CSS vars locais (--launch-*)
[ ] 34.3 — components/landing/mockups/Mock*.tsx — manter + eslint-disable + comentário
[ ] 34.4 — Inline styles estáticos em outros lugares → className
[ ] 34.5 — components/diagnostic-activation/_sections/ — sweep sistemático (74 occs)
[ ] 34.6 — Excecoes documentadas: BrandIcon.tsx, app/icon.tsx, opengraph-image.tsx (ImageResponse sem CSS vars)
[ ] 34.7 — Validar visual: 5 rotas em paletas diferentes
[ ] 34.8 — tsc 0, vitest passa, lint warnings de inline style cor = 0
[ ] 34.9 — Commit: "refactor(34): hardcoded hex + inline styles → tokens"
```

## Ao concluir

Reportar: 78 hex + 202 inline styles tratados (gauges→score tokens, launch→CSS vars locais, mockups→eslint-disable, dynamics→manter).

Dizer ao fundador:

---

**Fase 34 concluida.**

Cores hardcoded: 78 hex categorizados — gauges (~25) → var(--color-score-_), launch (~15) → --launch-_ locais, mockups (~10) → mantido + eslint-disable, BrandIcon (~7) → ImageResponse exception, outros (~21) → tokens.

Inline styles: 202 ocorrencias — estaticos com hex/rgba (~80) → className, estaticos com var (~50) → mantido, dynamic (~70) → mantido.

Build: tsc 0, vitest <N>/<N>, lint warnings de inline cor = 0.

**Proxima fase — depende se Fase 33 ja terminou:**

OPCAO A — se Fase 33 (casing) ainda esta rodando: AGUARDAR.

OPCAO B — se Fase 33 ja concluiu: par 35+36 paralelo:

Terminal A: `"... e execute a Fase 35"` (a11y foundations)
Terminal B: `"... e execute a Fase 36"` (ARIA states)

**REGRA DE OURO: nao simplificar nem pular etapas.** Inline style com hex literal sem motivo documentado e violacao — fixar TUDO antes de declarar fase concluida.

---

# Fase 35 — A11y foundations (skip link + landmarks)

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 35`
> **Tempo:** ~2h
> **Modelo:** Sonnet 4.6 — adição replicável
> **Depende de:** Fase 29 (SkipLink existe)
> **Paralelo com:** Fase 36 (ARIA states) 🔀

Atender WCAG 2.4.1 Bypass Blocks (Level A) — `<SkipLink>` + `<main>` + `<nav aria-label>` em todos os layouts.

## Mini-audit

```
[ ] rg --files -g "*layout.tsx" app/                        → listar todos os layouts
[ ] rg "SkipLink" -t tsx | wc -l                            → 0 (pré-fase)
[ ] rg "<main\b" app/ components/ -t tsx                    → quantificar uso atual
[ ] rg "<nav\b" app/ components/ -t tsx                     → 56 ocorrências em 30 arquivos
```

## Itens

```
[ ] 35.1 — <SkipLink> + <main id="main-content" tabIndex={-1}> em app/(auth)/layout.tsx
[ ] 35.2 — Idem em app/(app)/(shell)/layout.tsx
[ ] 35.3 — Idem em app/(app)/onboarding/layout.tsx
[ ] 35.4 — Idem em app/(public)/* layouts (diagnostic, etc)
[ ] 35.5 — Idem em app/(client)/layout.tsx
[ ] 35.6 — Idem em app/admin/layout.tsx
[ ] 35.7 — Idem em app/(influencer)/layout.tsx
[ ] 35.8 — aria-label em todos <nav> distintos:
            sidebar="Navegação principal", mobile="Navegação mobile", drawer="Atalhos",
            breadcrumb="Caminho", footer="Links institucionais", tabs="Configurações"
[ ] 35.9 — Validar com Tab key: skip link aparece, leva pra main em todas as 7 rotas
[ ] 35.10 — tsc 0, vitest passa, lint 0
[ ] 35.11 — Commit: "feat(35): skip links + main landmarks + nav aria-label"
```

## Ao concluir

Reportar: 7 layouts com SkipLink + main, ~N nav com aria-label distinto, Tab key validada em todas as 7 rotas.

Dizer ao fundador:

---

**Fase 35 concluida.**

WCAG 2.4.1 Bypass Blocks (Level A) atendido em 7 layouts: (auth), (app)/(shell), (app)/onboarding, (public)/\*, (client), admin, (influencer).

Cada layout: <SkipLink> + <main id="main-content" tabIndex={-1}>.
WCAG 2.4.6 + 1.3.1: ~N <nav> distintos com aria-label especifico.

Manual validation: Tab + Enter funciona em todas as 7 rotas testadas.

Build: tsc 0, vitest <N>/<N>, lint 0/0.

**Proxima fase — depende se Fase 36 ja terminou:**

OPCAO A — se 36 ainda esta rodando em outro terminal: AGUARDAR conclusao para iniciar 37.

OPCAO B — se 36 ja concluiu (ou rodou serial): proxima e Fase 37 (Opus, ~2h):

`"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 37"`

Fase 37 depende tanto de 32 (typography) quanto de 36 (ARIA) — confirmar ambas concluidas antes.

**REGRA DE OURO: nao simplificar nem pular etapas.** Se algum layout ficou sem SkipLink (ex: layout intermediario), VOLTAR e adicionar. Skip link AUSENTE = falha Level A.

---

# Fase 36 — A11y ARIA states

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 36`
> **Tempo:** ~3h
> **Modelo:** Opus 4.7 — sweep semântico
> **Depende de:** Fase 35
> **Paralelo com:** Fase 35 (concerns separados — 35 mexe em layouts, 36 em components) 🔀

Sweep aria-current (3→30+), aria-describedby (9→50+), aria-live (4→20+), aria-expanded.

## Mini-audit

```
[ ] rg "aria-current=" app/ components/ -t tsx | wc -l                         → 3
[ ] rg "aria-describedby=|aria-labelledby=" app/ components/ -t tsx | wc -l    → 9
[ ] rg "aria-live=|role=\"(?:status|alert)\"" app/ components/ -t tsx | wc -l  → 4
[ ] rg "aria-expanded=|aria-controls=" app/ components/ -t tsx | wc -l         → 9
[ ] Identificar gaps via cruzamento (active states sem aria, forms com error sem aria-describedby)
```

## Itens

```
[ ] 36.1 — aria-current="page" em SidebarNav, MobileNav, DrawerNav, admin/influencer nav
[ ] 36.2 — aria-current em tabs custom (que não usam shadcn Tabs)
[ ] 36.3 — aria-describedby em forms sem FormField — sweep auth, settings, lgpd, admin, clients, influencer
[ ] 36.4 — Padrão: input aria-describedby={errorId} aria-invalid + Text id={errorId} role="alert"
[ ] 36.5 — role="status" aria-live="polite" em loading inline ("Salvando...", spinners standalone)
[ ] 36.6 — role="alert" em erros críticos (form submit failed, payment error)
[ ] 36.7 — aria-expanded + aria-controls em disclosure custom (FAQ, MobileCollapsible)
            (ou migrar pra shadcn Accordion onde possível)
[ ] 36.8 — Skeleton com aria-busy="true" + aria-live="polite" em containers de listas
[ ] 36.9 — Smoke test SR (VoiceOver): /dashboard sidebar anuncia "current page", /login form errors
[ ] 36.10 — tsc 0, vitest passa, lint 0
[ ] 36.11 — Commit: "feat(36): aria states — current/describedby/live/expanded sweep"
```

## Ao concluir

Reportar: aria-current 3→30+, aria-describedby 9→50+, aria-live 4→20+, aria-expanded em disclosure custom, smoke SR test passou.

Dizer ao fundador:

---

**Fase 36 concluida.**

ARIA states migrados em massa:

- aria-current="page" em SidebarNav, MobileNav, DrawerNav, admin, influencer (3 → 30+)
- aria-describedby={errorId} em forms criticos com role="alert" no error (9 → 50+)
- role="status" aria-live="polite" em loading inline (4 → 20+)
- aria-expanded/controls em FAQ + disclosure custom

Smoke SR test (VoiceOver): /dashboard sidebar anuncia "current page", /login form errors anunciados ao submit.

Build: tsc 0, vitest <N>/<N>, lint 0/0.

**Proxima fase — depende se Fase 35 ja terminou:**

OPCAO A — se 35 ainda esta rodando em outro terminal: AGUARDAR.

OPCAO B — se 35 ja concluiu: Fase 37 (Opus, ~2h, serial — depende de 32+36):

`"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 37"`

**REGRA DE OURO: nao simplificar nem pular etapas.** Forms sem aria-describedby = barreira pra screen reader. Sweep todos os forms identificados, nao apenas "os principais".

---

# Fase 37 — Heading hierarchy + multi-tenant focus

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 37`
> **Tempo:** ~2h
> **Modelo:** Opus 4.7 — hierarchy refactor toca SR; APCA validation
> **Depende de:** Fases 32 + 36

Heading hierarchy correta (WCAG 1.3.1) + ring de foco visível em qualquer paleta×theme (WCAG 2.4.13 AAA).

## Mini-audit

```
[ ] rg "<Heading level=\{1\}|<h1\b" app/ components/ -t tsx                                         → listar usos
[ ] rg "<Heading level=\{2\}.*uppercase|<Heading level=\{2\}[^>]*\n[^>]*uppercase" components/ -t tsx → eyebrow disfarçado
[ ] APCA test do --color-ring (= --palette-primary) contra --brand-bg em 5 paletas × 2 themes (10 combos)
```

## Itens

```
[ ] 37.1 — Pages com 0 h1: adicionar (sr-only se decisão visual)
[ ] 37.2 — Pages com 2+ h1: consolidar
[ ] 37.3 — Pages com pulo h1→h3: ajustar levels
[ ] 37.4 — Eyebrow disfarçado de heading: trocar pra <Eyebrow>
[ ] 37.5 — Em lib/design/contrast.ts: criar validateFocusRing(palette, theme) com APCA fallback
[ ] 37.6 — Em globals.css: adicionar token --focus-ring com fallback APCA-validated
            html[data-theme='light'][data-palette='amber'] { --focus-ring: oklch(45% 0.16 75); }
            (e outros combos identificados no audit)
[ ] 37.7 — Atualizar shadcn primitives pra usar var(--focus-ring) em focus-visible:ring-*
[ ] 37.8 — Validar em /settings/design: 10 combos paleta×theme, ring sempre visível
[ ] 37.9 — Tests: lib/design/__tests__/focus-ring.test.ts + heading-hierarchy validator
[ ] 37.10 — tsc 0, vitest passa (+2 test files), lint 0
[ ] 37.11 — Commit: "feat(37): heading hierarchy + multi-tenant focus ring"
```

## Ao concluir

Reportar: heading hierarchy validada (1 h1/page, sem pulos), focus ring com APCA fallback validado em 10 combos paleta×theme.

Dizer ao fundador:

---

**Fase 37 concluida.**

Heading hierarchy: <N> pages com 0 h1 corrigidas, <N> com 2+ h1 consolidadas, <N> pulos h1→h3 ajustados, <N> eyebrows disfarcados de heading migrados pra <Eyebrow>.

Multi-tenant focus ring:

- validateFocusRing(palette, theme) em lib/design/contrast.ts
- Token --focus-ring com fallback APCA-validated
- shadcn primitives atualizados pra usar var(--focus-ring)
- 10 combos paleta×theme testados em /settings/design — TODOS com ring visivel

Tests novos: focus-ring.test.ts (10 combos), heading-hierarchy validator.

Build: tsc 0, vitest <N>/<N> (+2 test files), lint 0/0.

**Proxima fase — 1 terminal serial (Opus 4.7, ~4h):**

`"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 38"`

Fase 38 e a maior do bloco a11y — cobre 16 criterios WCAG 2.2 (6 AA + 10 AAA) + integracao axe-playwright em CI. Sem paralelismo recomendado.

**REGRA DE OURO: nao simplificar nem pular etapas.** Heading hierarchy quebrada = barreira severa pra SR. Validar com script automatizado, nao "ah, deve estar ok".

---

# Fase 38 — WCAG 2.2 AA + AAA completo + axe-playwright CI

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 38`
> **Tempo:** ~4h
> **Modelo:** Opus 4.7 — critérios AAA complexos
> **Depende de:** Fase 37

Cobrir 16 critérios WCAG 2.2 AA + AAA + integrar axe-playwright em CI. **Escopo confirmado: AAA completo.**

## Mini-audit

```
[ ] rg "drag\|onDrop\|@dnd-kit\|react-dnd" app/ components/ -t tsx -l   → drag-and-drop existentes
[ ] rg "captcha\|hcaptcha\|recaptcha" app/ components/ lib/ -l           → 0 (Google OAuth = alternativa AAA)
[ ] rg "leading-" components/ app/ -t tsx | head                         → confirmar line-height ≥ 1.5
[ ] rg "setTimeout\|clearTimeout" lib/ -t ts                             → identificar timeouts críticos
[ ] rg "animate-pulse\|animate-spin\|repeat:" components/ -t tsx         → flashes ≥ 3/sec?
```

## Itens AA

```
[ ] 38.1 — 2.4.11 Focus Not Obscured (Min) AA: validar scroll-padding (Fase 29) + foco em listas com bottom-nav
[ ] 38.2 — 2.5.7 Dragging Movements AA: alternativa por botão (↑↓) onde houver drag
[ ] 38.3 — 2.5.8 Target Size (Min) AA: validar 24×24 mínimo (já temos 44×44 em 189 lugares)
[ ] 38.4 — 3.2.6 Consistent Help A: link de support consistente em todos os layouts
[ ] 38.5 — 3.3.7 Redundant Entry A: audit onboarding 23 steps — campos repetidos com defaultValue
[ ] 38.6 — 3.3.8 Accessible Authentication (Min) AA: confirmar Google OAuth + email/senha (✓)
[ ] 38.7 — 1.3.5 Identify Input Purpose AA: autocomplete attrs em todos os inputs (email, tel, name, postal-code, etc)
```

## Itens AAA

```
[ ] 38.8 — 1.4.6 Contrast Enhanced AAA: validar Lc ≥ 90 (≈7:1) em body text — pode forçar refinar --brand-text-muted
[ ] 38.9 — 1.4.8 Visual Presentation AAA: line-height ≥ 1.5 (✓ 1.55), paragraph spacing ≥ 1.5×, max-width ≤ 80 chars em prose
[ ] 38.10 — 2.1.3 Keyboard No Exception AAA: full keyboard test em login, signup, dashboard, [slug], diagnóstico, r/[token]
[ ] 38.11 — 2.2.3 No Timing AAA: zero timeouts críticos (Supabase session refresh ✓)
[ ] 38.12 — 2.3.2 Three Flashes AAA: motion components OK (frequência << 3/sec)
[ ] 38.13 — 2.4.12 Focus Not Obscured (Enhanced) AAA: foco NUNCA obscurecido (sticky elements revisar)
[ ] 38.14 — 2.5.6 Concurrent Input Mechanisms AAA: touch/keyboard/mouse coexistem
[ ] 38.15 — 3.2.5 Change on Request AAA: submits explícitos, sem auto-submit (search incremental ok com aria-live)
[ ] 38.16 — 3.3.6 Error Prevention All AAA: forms críticos (delete account, cancel subscription, payment, DSR delete) com confirmação + reversibilidade
[ ] 38.17 — 3.3.9 Accessible Authentication (Enhanced) AAA: Google OAuth como alternativa cognitiva (✓)
```

## Infra

```
[ ] 38.18 — pnpm add -D @axe-core/react — adicionar em app/layout.tsx (so dev) flagga issues no console
[ ] 38.19 — pnpm add -D @axe-core/playwright — criar tests/a11y/smoke.test.ts em 6 rotas-chave
            withTags(['wcag2a','wcag2aa','wcag22aa']) — esperar 0 violations
[ ] 38.20 — Adicionar pnpm test:a11y em package.json + step em CI
[ ] 38.21 — Em lib/design/contrast.ts: getWcag2Ratio() + passesWcag2AA() (fallback alem do APCA)
[ ] 38.22 — scripts/validate-contrast.ts: rodar pra todos tokens, todos passam AA
[ ] 38.23 — Criar docs/produto/design/accessibility.md com tabela checklist 50+ critérios
[ ] 38.24 — tsc 0, vitest passa, test:a11y 0 violations, lint 0, build passa
[ ] 38.25 — Commit: "feat(38): WCAG 2.2 AA + AAA full coverage + axe CI"
```

**Skip declarado se necessário:** se 1.4.6 Contrast Enhanced (AAA, Lc≥90) forçar redesign de identidade visual, registrar como skip com motivo em accessibility.md. Não forçar quebra de marca.

## Ao concluir

Reportar: 6 criterios AA novos + 10 AAA atendidos, axe-playwright em CI smoke 6 rotas (0 violations), accessibility.md criado.

Dizer ao fundador:

---

**Fase 38 concluida.**

WCAG 2.2 AA — 6 criterios novos:

- 2.4.11 Focus Not Obscured (Min) ✓
- 2.5.7 Dragging Movements ✓ (alternativa por botao em <N> casos)
- 2.5.8 Target Size ✓ (44×44 ja existia)
- 3.2.6 Consistent Help ✓
- 3.3.7 Redundant Entry ✓ (onboarding com defaultValue)
- 3.3.8 Accessible Auth (Min) ✓ (Google OAuth)
- 1.3.5 Identify Input Purpose ✓ (autocomplete attrs)

WCAG 2.2 AAA — 10 criterios:

- 1.4.6 Contrast Enhanced ✓ ou skip declarado (motivo: identidade visual)
- 1.4.8 Visual Presentation ✓
- 2.1.3 Keyboard No Exception ✓
- 2.2.3 No Timing ✓
- 2.3.2 Three Flashes ✓
- 2.4.12 Focus Not Obscured (Enhanced) ✓
- 2.5.6 Concurrent Input Mechanisms ✓
- 3.2.5 Change on Request ✓
- 3.3.6 Error Prevention All ✓
- 3.3.9 Accessible Auth (Enhanced) ✓ (Google OAuth)

Infra:

- @axe-core/react em dev (console runtime)
- axe-playwright em CI smoke 6 rotas (0 violations)
- WCAG 2 ratio fallback em lib/design/contrast.ts
- docs/produto/design/accessibility.md criado

Build: tsc 0, vitest <N>/<N>, test:a11y 0, lint 0/0, build passa.

**Proxima fase — 1 terminal serial (Opus 4.7 + browser, ~5h):**

`"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 39"`

Fase 39 promove regras lint warn→error, faz craft pass v3 visual em 10 rotas (375+1280, dark+light, 5 paletas × 3 shapes × 4 typographies), manual SR test (VoiceOver/NVDA), Lighthouse ≥95, VRT compare contra baseline da Fase 27.1. Sem paralelismo.

**REGRA DE OURO: nao simplificar nem pular etapas.** Cada criterio AAA (1.4.6 a 3.3.9) requer validacao explicita — nao marcar como concluido baseado em "ja deve estar ok".

---

# Fase 39 — Lint promote + craft pass + VRT compare

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 39`
> **Tempo:** ~5h
> **Modelo:** Opus 4.7 — alto julgamento visual + manual SR
> **Depende de:** Fases 30-38 + Fase 27.1 (VRT baseline pre-sweep)

Promover regras lint warn→error. Craft pass v3 visual em 10 rotas. Manual SR test. Lighthouse ≥ 95. VRT compare contra baseline da Fase 27.1.

## Mini-audit

```
[ ] pnpm lint 2>&1 | grep -c "warning"                          → 0 esperado (sweeps zeraram)
[ ] Lighthouse atual em 6 rotas — comparar com baseline Fase 28
[ ] Confirmar tsc 0, vitest passa, test:a11y 0, knip 0
```

## Itens

```
[ ] 39.1 — Promover no-restricted-syntax warn → error (5 regras: text/rounded/uppercase/tracking/inline-style)
[ ] 39.2 — Sobras de cada categoria fixadas até 0 warnings (ou eslint-disable explícito com motivo)
[ ] 39.3 — Excecoes documentadas em CLAUDE.md ou regras-padronizacao
[ ] 39.4 — Craft pass visual em 10 rotas representativas:
            internal: /login, /dashboard, /clients, /settings/design, /admin
            public: /[slug], /[slug]/analise, /r/[token], /diagnóstico, /diagnóstico/r/[token]/analysis
            Cada rota: 375px + 1280px, dark + light, (públicas) 5 paletas × 3 shapes × 4 typographies
[ ] 39.5 — Manual screen reader test: VoiceOver (Mac) em /login, /onboarding, /dashboard
[ ] 39.6 — VRT compare contra baseline Fase 27.1:
            pnpm exec playwright test e2e/vrt-baseline.spec.ts
            documentar deltas em CHECKLIST.md
[ ] 39.7 — Lighthouse a11y ≥ 95 em 6 rotas — documentar em AUDITORIA-CONSISTENCIA-A11Y.md tabela final
[ ] 39.8 — knip 0 findings
[ ] 39.9 — pnpm build 0 erros
[ ] 39.10 — tsc 0, vitest passa, lint 0/0, test:a11y 0
[ ] 39.11 — Commit: "chore(39): lint promote to error + craft pass v3 + VRT compare"
```

## Ao concluir

Reportar: 5 regras lint promovidas warn→error (0 sobras), craft pass em 10 rotas (375+1280+dark+light+paletas/shapes/typographies), manual SR test, Lighthouse ≥95 em 6 rotas, VRT compare 0 regressoes.

Dizer ao fundador:

---

**Fase 39 concluida.**

Lint: 5 regras promovidas warn→error (text/rounded/uppercase/tracking/inline-style) — 0/0 (zero erros, zero warnings). Excecoes documentadas em CLAUDE.md ou regras-padronizacao.

Craft pass visual (10 rotas):

- 5 internal: /login, /dashboard, /clients, /settings/design, /admin
- 5 public: /[slug], /[slug]/analise, /r/[token], /diagnostico, /diagnostico/r/[token]/analysis
  Cada rota validada em 375+1280, dark+light, (publicas) 5 paletas × 3 shapes × 4 typographies.
  Issues encontrados: <N> (todos fixados ou movidos pra debito 18+).

Manual SR test:

- VoiceOver em /login, /onboarding, /dashboard ✓
- (NVDA testado se disponivel)

Lighthouse a11y: <score>/<score>/<score>/... — TODOS >= 95.

VRT compare contra baseline Fase 27.1:

- Deltas documentados em CHECKLIST.md
- 0 regressoes inesperadas

Build: tsc 0, vitest <N>/<N>, lint 0/0, test:a11y 0 violations, knip 0, build 100%.

**Proxima fase — ULTIMA, 1 terminal (Sonnet 4.6, ~1h):**

`"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 40"`

Fase 40 fecha o ciclo: atualiza CLAUDE.md (5 secoes), preenche AUDITORIA-CONSISTENCIA-A11Y.md final, marca CHECKLIST.md, cria tag git, reporta ao fundador.

**REGRA DE OURO: nao simplificar nem pular etapas.** Se Lighthouse < 95 em alguma rota, INVESTIGAR e fixar — nao aceitar 90 como "perto o suficiente". Se manual SR test acusou problema, FIXAR antes de Fase 40.

---

# Fase 40 — Verificação final + docs update

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 40`
> **Tempo:** ~1h
> **Modelo:** Sonnet 4.6 — atualiza docs, commit final
> **Depende de:** Fase 39

## Itens

```
[ ] 40.1 — CLAUDE.md: ultima atualização (data + breve descrição da wave 28-40)
[ ] 40.2 — CLAUDE.md: histórico de reescritas — adicionar entrada wave 28-40
[ ] 40.3 — CLAUDE.md: secao "Abstrações disponíveis" — adicionar Eyebrow/SectionTitle/SkipLink
[ ] 40.4 — CLAUDE.md: nova secao "Acessibilidade (WCAG 2.2 AA + AAA)" com checklist
[ ] 40.5 — CLAUDE.md: secao "Convencoes de copy" — tabela casing
[ ] 40.6 — CLAUDE.md: secao "Padrões obrigatórios → Componentes" — regras tipografia/shapes/cores
[ ] 40.7 — AUDITORIA-CONSISTENCIA-A11Y.md: tabela final "antes/depois" com numeros finais
[ ] 40.8 — CHECKLIST.md: marcar tudo concluído com commits referenciados
[ ] 40.9 — Commit final + tag git: post-consistency-a11y-2026-05b
[ ] 40.10 — Reportar ao fundador (template no final do doc)
```

## Ao concluir

Reportar fechamento da wave usando o template "Mensagem de fechamento" no final deste master doc.

Dizer ao fundador:

---

**Wave consistencia + a11y concluida (fases 28-40). FIM.**

Tag: `post-consistency-a11y-2026-05b`
Commit final: <sha>

Ver template completo de fechamento na secao "Mensagem de fechamento" deste doc.

**Nao ha proxima fase deste ciclo.** Se houver follow-ups identificados, abrir como debitos novos em CLAUDE.md (debito 18+) ou planejar wave separada.

---

## Critério de "wave 28-40 fechada"

```
[ ] tsc 0, vitest 450+/450+, lint 0/0, test:a11y 0 violations, knip 0, build 100% pages
[ ] Lighthouse a11y ≥ 95 em 6 rotas
[ ] Multi-tenant: data-shape/typography/palette afeta 100% da UI (era 39%)
[ ] Skip link em 6+ layouts; aria-current em 30+ lugares; aria-describedby em 50+ forms
[ ] WCAG 2.2 AA: 6/6 critérios novos atendidos
[ ] WCAG 2.2 AAA: 10/13+ critérios atendidos (skips declarados)
[ ] Manual SR test passou em login + onboarding + dashboard
[ ] VRT baseline Fase 27.1 vs Fase 39: deltas documentados, regressões = 0
[ ] CHECKLIST.md fases 28-40 todas [x]
[ ] CLAUDE.md atualizado (5 secoes)
[ ] Tag post-consistency-a11y-2026-05b criada e empurrada
```

---

## Comandos por sessão

```
# Sessão 1 (Sonnet) — pode rodar em paralelo com Fase 23
leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 28

# Sessão 2 (Opus) — pode rodar em paralelo com Fase 24
leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 29

# Sessão 3 (Sonnet) — pode rodar em paralelo com Fase 35
leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 30

# Sessão 4-5 (Opus) — paralelizáveis 🔀, esperar Fase 25/26 terminarem
Terminal A: leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 31
Terminal B: leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 32

# Sessão 6-7 (Sonnet/Opus) — paralelizáveis 🔀
Terminal A: leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 33
Terminal B: leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 34

# Sessão 8-9 (Sonnet/Opus) — paralelizáveis 🔀
Terminal A: leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 35
Terminal B: leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 36

# Sessão 10 (Opus)
leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 37

# Sessão 11 (Opus)
leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 38

# Sessão 12 (Opus + browser)
leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 39

# Sessão 13 (Sonnet)
leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 40
```

---

## Se travar no meio

```
voce esta na Fase X. continue de onde parou conforme o CHECKLIST.md e o estado atual do codigo.
```

---

## Mensagem de fechamento (template Fase 40)

```
**Wave consistencia + a11y concluida (fases 28-40).**

Tag: post-consistency-a11y-2026-05b
Commit final: <sha>

VISUAL deltas:
- 1250 text-{size} → <Text variant>
- 449 rounded-{size} → rounded-[var(--shape-*)] (multi-tenant 39% → 100%)
- 491 uppercase categorizado: 80 → <Eyebrow>, 50 → Badge, restantes sentence case
- 78 hex + 202 inline styles → tokens semanticos

A11Y deltas:
- 6 SkipLinks em layouts (era 0)
- 30+ aria-current (era 3)
- 50+ aria-describedby (era 9)
- 20+ aria-live/status (era 4)
- Heading hierarchy validada
- Multi-tenant focus ring com APCA fallback (10 combos paleta×theme)

WCAG 2.2:
- AA: 6/6 critérios novos atendidos
- AAA: 10/13+ atendidos (skips com motivo documentado)

INFRA:
- 5 regras lint warn → error
- @axe-core/react em dev + axe-playwright em CI
- WCAG 2 ratio fallback além do APCA
- accessibility.md em docs/produto/design/

ESTADO FINAL: tsc 0, vitest 450+, lint 0/0, test:a11y 0, knip 0, build 100%, Lighthouse a11y ≥ 95.

Breaking changes: nenhum (sweep manteve visual default em data-shape="rounded" + data-typography="modern").

Beneficios mensuraveis:
1. Profissionais com data-shape="sharp"/"soft" agora veem TODA a UI customizada
2. Usuarios de teclado pulam nav repetitivo via SkipLink
3. Screen readers anunciam landmarks distintos, current page, errors
4. Paletas amber/lime claras tem ring de foco visivel via APCA fallback
5. CI bloqueia regressoes a11y (axe-playwright)
```
