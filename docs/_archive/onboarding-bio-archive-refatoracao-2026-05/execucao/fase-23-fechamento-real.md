# Plano v3 — Fechamento Real (Fases 23-27)

> **Por que existe:** auditoria pós-fase-22 (2026-05-02) revelou que algumas fases 21-22 marcaram itens como concluídos sem terem sido **de fato** executados. Esta wave fecha o gap.
>
> **Pré-requisito:** fases 00-22 marcadas concluídas (mesmo que parcialmente).
> **Tempo estimado:** ~14-19h em 5 sessões.
> **Modelo recomendado:** Sonnet (23) + Opus (24-27).
> **⚠️ ANTES DE EXECUTAR:** PARE. Avise o fundador qual modelo usar e aguarde confirmação.

---

## Por que precisa desta wave

Auditoria 2026-05-02 (pós-fase 22) descobriu:

1. **Fase 21 mentiu:** 14 edge functions migradas localmente, **nunca redeployadas** ao Supabase. Em produção ainda roda o código antigo. Inclui um fix de segurança (`efi-webhook` timing-safe compare) que **NÃO ESTÁ NO AR**.
2. **Migrations divergentes:** 3 SQL locais vs 113 no remoto.
3. **Fase 11 incompleta:** ~50 componentes >300 linhas nunca foram decompostos. Top 10 são >500l, alguns >800l.
4. **Fase 05 nunca executada:** tsconfig hardening (`noUncheckedIndexedAccess` etc) ficou nominalmente `[ ]` no checklist desde o início.
5. **Fase 06.5 + Fase 14 visual sweep:** marcadas `[!] PULADO` ou `curl HTTP 200` em vez de browser real.
6. **Débitos stale na CLAUDE.md:** débitos 4 (system\_\*), 9 (trainer-buckets), 13 (generate-analise) já foram resolvidos mas continuam listados como abertos.

**Não é replan, é honestidade.** Esta wave existe pra fechar o que ficou pendente.

---

## Decisões fixadas

1. ✅ **Sequencial, não sub-fases.** Cada fase é numerada (23, 24, 25, 26, 27) e tem doc próprio dentro deste master.
2. ✅ **23a/23b descartado.** Quem quiser paralelizar abre 2 terminais nas fases marcadas com 🔀 abaixo.
3. ✅ **Componentes 300-500l fora de escopo.** Apenas top 10 (>500l) entram na Fase 25. Os 300-500l ficam como débito 17 novo na CLAUDE.md.
4. ✅ **Mockups/charts SKIP renovado.** Página é demo interna; mantém-se SKIP da fase 08.25 (apenas atualizar débito 16 pra refletir 4 páginas reais + 1 SKIP).
5. ✅ **Email/PDF i18n NÃO entra.** Defer pra quando en-US shipar.

---

## ⛔ HORIZONTAL = 100% DO PROJETO

**Esta refatoração é HORIZONTAL.** Significa: cobertura completa do gap identificado, sem exceções silenciosas.

- **TODAS as 14 edge functions** redeployadas (Fase 23) — não 12, não "as críticas"
- **TODAS as migrations remotas** sincronizadas (~110+ arquivos) — não amostra
- **TODOS os 10 componentes >500l** decompostos (Fase 25) — não 8, não "os piores"
- **TODAS as 4 páginas >300l** decompostas (Fase 26) — mockups/charts é SKIP **declarado** (não esquecimento)
- **TODOS os erros de tsc** após habilitar 3 flags strict (Fase 24) — sejam 50, 100 ou 200, todos fixados
- **TODAS as 30 páginas críticas** abertas em 375+1280 manualmente (Fase 27.2) — não "as principais"

**Não existe "as principais".** Se a auditoria diz 14 edges, são 14. Se Fase 25 lista 10 componentes, são 10. Se Fase 26 lista 4 páginas, são 4. **Cortar escopo = falhar a fase.**

---

## 📝 OBRIGATÓRIO ATUALIZAR DOCS + DOCUMENTAR FALHAS

**Ao final de CADA fase, o terminal DEVE atualizar os docs (não opcional):**

1. **`CHECKLIST.md`** (raiz da pasta execucao/):
   - Marcar items concluídos com `[x]`
   - Items que falharam com `[!]` + motivo inline
   - Items pendentes com `[ ]` + nota explicativa
   - Adicionar SHA do commit ao final da seção da fase

2. **CLAUDE.md débitos** (Fase 23 explicitamente):
   - Débitos 4, 9, 13 → tachados com `~~débito~~`
   - Débito 17 novo (~40 components 300-500l) → adicionado
   - Débito 16 atualizado pós-Fase 26

3. **Mensagem de commit** segue convenção: `<type>(NN): <descrição>` (ex: `refactor(25): decompose 10 oversized components`)

**Documentar TUDO que não deu certo:**

- **Bloqueios** (impossibilidade técnica): seção "Bugs encontrados" no CHECKLIST.md + motivo + impacto + workaround
- **Decisões não previstas**: seção "Decisões tomadas" — escolha + alternativas consideradas
- **Items parciais**: `[!]` com explicação específica
- **Edge functions que falharam o smoke test**: registrar log do erro, qual entrada quebrou, fix aplicado
- **Migrations divergentes** descobertas durante sync: documentar como foi resolvido
- **tsc errors expostos pelo hardening** que exigiram refactor maior: anotar arquivos + decisão (fix vs `// @ts-expect-error` com motivo)
- **Componentes que não couberam em <300 linhas** mesmo após decomposição: registrar com justificativa (e abrir débito novo se for o caso)
- **Issues visuais** encontradas no manual sweep: lista numerada com screenshot, severity, status (fixado/débito)
- **VRT diffs falsos positivos**: anotar e atualizar baseline com nota

**Filosofia:** se algo não deu certo e não foi documentado, é como se não tivesse acontecido. O próximo terminal/sessão vai repetir o erro. **Honestidade > "fingir que está ok".**

A própria existência desta wave 23-27 prova o ponto: fases 21-22 marcaram itens como concluídos sem terem sido executados de fato. Não repetir esse padrão.

---

## Visão geral das 5 fases

```
Fase 23 — Operacional (deploy + sync + bookkeeping)    ~1-2h    Sonnet
Fase 24 — tsconfig hardening                           ~3-4h    Opus
Fase 25 — Top 10 componentes >500l                     ~4-6h    Opus
Fase 26 — 4 páginas legacy >300l                       ~3-4h    Opus
Fase 27 — Visual QA (Playwright + manual sweep)        ~2-3h    Opus + browser
                                                      ────
                                              Total:   ~14-19h
```

**Ordem de execução:** 23 → 24 → 25 → 26 → 27.

**Paralelismo possível:** 25 e 26 são independentes entre si (componentes ≠ páginas). Podem rodar em 2 terminais Opus simultâneos no mesmo dia 🔀.

---

# Fase 23 — Operacional

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 23`
> **Tempo:** ~1-2h
> **Modelo:** Sonnet 4.6 (ou `/fast` Opus 4.6) — não tem julgamento crítico
> **Depende de:** nada
> **Paralelo com:** —

Tarefas operacionais que não merecem fase própria mas estão pendentes.

## 23.1 — Deploy 14 edge functions (Fase 21 fix)

Cada uma já existe no Supabase com versão antiga. Redeploy puxa o código de `supabase/functions/<nome>/index.ts` que importa `_shared/response.ts`.

```
[ ] Confirmar que supabase/functions/_shared/response.ts existe + helpers ok/fail/log/preflight
[ ] Para cada função abaixo: mcp__supabase__deploy_edge_function name=<nome>
    [ ] cancel-checkout
    [ ] create-checkout
    [ ] drip-emails
    [ ] efi-webhook       ← timing-safe compare ainda não está em produção
    [ ] follow-up-reminders
    [ ] generate-diagnostic
    [ ] generate-report
    [ ] generate-site-content
    [ ] register-pix-webhooks
    [ ] save-diagnostic-draft
    [ ] send-email
    [ ] send-whatsapp
    [ ] submit-form
    [ ] weekly-digest
[ ] Smoke test: 1 invocação por função (ou ao menos efi-webhook + send-email + submit-form)
[ ] Verificar logs Supabase: estrutura JSON deve aparecer (parsing automático)
```

## 23.2 — Sync migrations local ← remoto

```
[ ] supabase db pull (ou listar migrations remotas e copiar SQL pra supabase/migrations/)
[ ] Verificar que arquivos baixados não conflitam com os 3 locais
[ ] git status — confirmar que ~110 arquivos novos surgiram
[ ] Atualizar supabase/migrations/README.md descrevendo o sync
[ ] Confirmar que `supabase db reset --linked` funcionaria (não precisa rodar — só validar coerência)
```

## 23.3 — Atualizar CLAUDE.md débitos stale

```
[ ] Débito 4 (Tabelas system_* vazias) → marcar resolvido com tachado
    Verificação: select count(*) from system_plan_features (=13), system_lead_statuses (=5),
    system_plan_pricing (=4), system_bmi_classifications (=6)
[ ] Débito 9 (Buckets trainer-*) → marcar resolvido com tachado
    Justificativa: zero refs em código (apenas archived migration cria os buckets;
    nenhum upload/download usa esses paths). Buckets podem continuar no Supabase Storage
    como dado órfão sem prejuízo.
[ ] Débito 13 (Edge Function órfã generate-analise) → confirmar tachado
    Verificação: mcp__supabase__list_edge_functions não retorna generate-analise
[ ] Débito 16 (Páginas legacy >300l) → atualizar lista após sync de fase 26
[ ] Adicionar Débito 17: ~40 componentes 300-500l (lista completa em comentário)
```

## 23.4 — Verificação

```
[ ] mcp__supabase__list_edge_functions — todas 14 com updated_at recente
[ ] supabase/migrations/ tem ≥110 arquivos
[ ] CLAUDE.md débitos 4, 9, 13 com ~~tachado~~
[ ] commit: "ops(23): deploy 14 edge functions + sync migrations + close stale debts"
```

## Ao concluir

Reportar: 14 edges deployadas (com updated_at recente), migrations sincronizadas (≥113 arquivos), 3 débitos tachados (4, 9, 13), débito 17 novo adicionado.

Dizer ao fundador:

---

**Fase 23 concluída.**

Edges em produção: 14/14 com updated_at recente. Fix de segurança `efi-webhook` (timing-safe compare) AGORA está no ar.
Migrations: <N> arquivos sincronizados de remoto.
CLAUDE.md: débitos 4, 9, 13 tachados; débito 17 (~40 components 300-500l) adicionado.

Build: tsc 0, vitest 442/442, lint 0/0, build 93/93.

**Próxima(s) fase(s) — paralelismo possível:**

OPÇÃO A (1 terminal serial — Opus 4.7, ~3-4h):

`"leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 24"`

OPÇÃO B (2 terminais paralelos 🔀):

Terminal A: `"... execute a Fase 24"` (tsconfig hardening, Opus)
Terminal B: `"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 28"` (baseline da wave 28-40, Sonnet)

Concerns separados: 24 mexe em tsconfig.json + fixes; 28 só roda greps + tag git. Zero conflito.

**REGRA DE OURO: não simplificar nem pular etapas.** Se aparecer 100+ erros de tsc, dividir em commits incrementais por pasta — nunca cortar escopo das flags habilitadas.

---

# Fase 24 — tsconfig hardening

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 24`
> **Tempo:** ~3-4h (estimativa mais conservadora se aparecerem 100+ erros)
> **Modelo:** Opus 4.7 — vai precisar julgamento em cada fix
> **Depende de:** Fase 23
> **Paralelo com:** —

Habilitar checagens estritas no TypeScript. Vai expor lugares onde o código acessa arrays sem checar bounds, usa `?: T` mal, ou esquece return statements.

## 24.1 — Habilitar flags

```
[ ] tsconfig.json: adicionar
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true
    (noFallthroughCasesInSwitch já está habilitado)
[ ] pnpm exec tsc --noEmit | tee /tmp/tsc-errors.txt
[ ] Contar erros (esperado: 50-150)
```

## 24.2 — Corrigir erros 1-by-1

Padrões comuns esperados:

- `arr[i]` retornando `T | undefined` em vez de `T` — usar `arr[i]!` quando há contexto, ou guard `if (item)` quando não.
- `obj.optional` aceito como `T` — agora exige `T | undefined`. Tratar com `??` ou narrow.
- Função sem return em algum branch (`if/else if` sem else).

```
[ ] Se erro >100: dividir por pasta (lib/ → app/ → components/) pra commits incrementais
[ ] Para cada erro: corrigir, rodar tsc, próximo
[ ] vitest tem que continuar passando após cada commit incremental
[ ] lint tem que continuar 0/0
```

## 24.3 — Verificação

```
[ ] pnpm exec tsc --noEmit — 0 erros
[ ] pnpm exec vitest run — 442/442 (não pode regredir)
[ ] pnpm lint — 0/0
[ ] pnpm build — 93/93 páginas
[ ] commit: "chore(24): tsconfig hardening — noUncheckedIndexedAccess + exactOptional + noImplicitReturns"
```

## Ao concluir

Reportar: 3 flags habilitadas, <N> erros expostos e fixados, vitest e build mantidos.

Dizer ao fundador:

---

**Fase 24 concluída.**

tsconfig.json: noUncheckedIndexedAccess + exactOptionalPropertyTypes + noImplicitReturns habilitados.
Erros expostos: <N> (todos fixados em commits incrementais por pasta).

Build: tsc 0, vitest 442/442, lint 0/0, build 93/93.

**Próxima(s) fase(s) — paralelismo possível:**

OPÇÃO A (2 terminais paralelos 🔀 — Opus 4.7 cada):

Terminal A: `"... execute a Fase 25"` (decompose 10 components >500l, ~5h)
Terminal B: `"... execute a Fase 26"` (decompose 4 pages >300l, ~3-4h)

25 e 26 são independentes — concerns separados (components vs pages).

OPÇÃO B (3 terminais 🔀 — se quiser maximizar paralelismo):

Terminal A: Fase 25 (Opus)
Terminal B: Fase 26 (Opus)
Terminal C: `"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 29"` (foundations Eyebrow/SectionTitle/SkipLink, Opus, ~3h) — só se Fase 28 já concluiu

29 cria primitives novos pequenos em components/ui/ — não conflita com 25/26 (decompose toca arquivos fora de ui/, exceto CrudManager que é alvo da 25 mas em ui/, então CUIDADO — coordenar via git pull --rebase).

**REGRA DE OURO: não simplificar nem pular etapas.** Cada um dos 10 components em 25 deve ficar <300 linhas; cada uma das 4 pages em 26 idem. Não aceitar "ficou em 320, dá pra ficar".

⚠️ **NUNCA rodar Fases 25/26 em paralelo com Fases 31/32 do master fase-28.** Sweeps massivos das 31/32 tocam exatamente os arquivos sendo decompostos — conflito devastador.

---

# Fase 25 — Top 10 componentes >500 linhas

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 25`
> **Tempo:** ~4-6h
> **Modelo:** Opus 4.7
> **Depende de:** Fase 24 (tsc tem que estar limpo antes)
> **Paralelo com:** Fase 26 🔀

Decompor os 10 componentes mais críticos. Lista validada na auditoria 2026-05-02 (pós-fase-22).

## 25.1 — Decompor cada um (orchestrator + \_components/\_sections/\_steps/)

```
[ ]  1. components/report/audit/AuditAnalysis.tsx        — 850 linhas
[ ]  2. components/settings/DesignForm.tsx                — 645
[ ]  3. components/form/lead/LeadForm.tsx                 — 640
[ ]  4. components/form/audit/AuditForm.tsx               — 612
[ ]  5. components/clients/TransformationEditor.tsx       — 596
[ ]  6. components/landing/onboarding/storyboard/
        Ato4Operacao.tsx                                   — 578
[ ]  7. components/clients/WorkoutEditor.tsx              — 565
[ ]  8. components/clients/AssessmentList.tsx             — 562
[ ]  9. components/ui/CrudManager.tsx                     — 546
[ ] 10. components/site/SiteHub.tsx                       — 542
```

Para cada um:

```
[ ] Ler arquivo inteiro
[ ] Identificar blocos lógicos: seções (_sections/), steps de wizard (_steps/),
    ou subcomponentes reutilizáveis (_components/)
[ ] Criar arquivos extraídos preservando props originais
[ ] Substituir blocos por imports
[ ] Verificar tsc + vitest após cada extração
[ ] Arquivo principal (orchestrator) tem que ficar <300 linhas
[ ] Snapshot tests existentes não podem regredir (atualizar se necessário)
```

## 25.2 — Verificação

```
[ ] Cada um dos 10 arquivos com <300 linhas
[ ] pnpm exec tsc --noEmit — 0 erros
[ ] pnpm exec vitest run — 442/442 (snapshots atualizados se mudou markup)
[ ] pnpm lint — 0/0
[ ] pnpm exec knip — 0 findings
[ ] pnpm build — 93/93 páginas
[ ] commit: "refactor(25): decompose 10 oversized components"
```

## Ao concluir

Reportar: 10 components decompostos para <300 linhas, snapshots atualizados se necessário, knip 0.

Dizer ao fundador:

---

**Fase 25 concluída.**

10 components decompostos:

1. AuditAnalysis: 850 → <300 (orchestrator + \_sections/)
2. DesignForm: 645 → <300
3. LeadForm: 640 → <300
4. AuditForm: 612 → <300
5. TransformationEditor: 596 → <300
6. Ato4Operacao: 578 → <300
7. WorkoutEditor: 565 → <300
8. AssessmentList: 562 → <300
9. CrudManager: 546 → <300
10. SiteHub: 542 → <300

Snapshots atualizados: <N>. knip: 0 findings.

Build: tsc 0, vitest 442/442, lint 0/0, build 93/93.

**Próxima(s) fase(s) — depende se Fase 26 já terminou:**

OPÇÃO A — se 26 ainda está rodando em outro terminal: AGUARDAR conclusão antes de Fase 27.

OPÇÃO B — se 26 já concluiu: próxima é Fase 27 (Opus + browser, ~2-3h):

`"leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 27"`

🔀 **Paralelismo possível com wave 28-40:** se quiser adiantar, terminais paralelos podem rodar:

- Fase 27 (Opus + browser)
- Fase 28 ou 29 ou 30 do master fase-28-consistencia-a11y.md (concerns separados)

⚠️ **NUNCA rodar Fases 31/32 (sweeps) com 25/26 em curso.** Confirmar 25 + 26 commitadas antes de iniciar 31/32.

**REGRA DE OURO: não simplificar nem pular etapas.** Se algum component ficou em 305 linhas após decomposição, EXTRAIR mais — não aceitar "perto o suficiente". Snapshots: atualizar com cuidado pra não perder detecção de regressão.

---

# Fase 26 — 4 páginas legacy >300 linhas

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 26`
> **Tempo:** ~3-4h
> **Modelo:** Opus 4.7
> **Depende de:** Fase 24
> **Paralelo com:** Fase 25 🔀

Mesmo padrão da Fase 22 (que decompôs cover + 4 plans).

## 26.1 — Decompor cada uma

```
[ ] app/(public)/coming-soon/page.tsx          — 503 linhas
    Sugestão: extrair Hero + Slides + Footer em _components/
[ ] app/(app)/(shell)/dashboard/page.tsx       — 454
    Sugestão: extrair Greeting + StatsCards + RecentLeads + QuickActions em _components/
[ ] app/(app)/(shell)/clients/page.tsx         — 352
    Sugestão: extrair StatsCards + Filters + ListClient em _components/
    (já tem _components/ — verificar se cabe mais decomposição)
[ ] app/(app)/(shell)/leads/page.tsx           — 326
    Sugestão: extrair StatsCards + Filters + ListClient em _components/
    (já tem _components/ — verificar)
```

`app/(public)/mockups/charts/page.tsx` (395l) → **SKIP** mantido (demo interna, fase 08.25 já decidiu).

## 26.2 — Verificação

```
[ ] Cada uma das 4 páginas com <300 linhas
[ ] pnpm exec tsc --noEmit — 0 erros
[ ] pnpm exec vitest run — 442/442
[ ] pnpm lint — 0/0
[ ] pnpm exec knip — 0 findings
[ ] pnpm build — 93/93 páginas
[ ] commit: "refactor(26): decompose 4 legacy pages"
```

## Ao concluir

Reportar: 4 pages decompostas, mockups/charts SKIP confirmado.

Dizer ao fundador:

---

**Fase 26 concluída.**

4 pages decompostas:

1. coming-soon: 503 → <300
2. dashboard: 454 → <300
3. clients: 352 → <300
4. leads: 326 → <300

mockups/charts (395l): SKIP mantido (demo interna, fase 08.25).

Build: tsc 0, vitest 442/442, lint 0/0, build 93/93.

**Próxima(s) fase(s) — depende se Fase 25 já terminou:**

OPÇÃO A — se 25 ainda está rodando em outro terminal: AGUARDAR.

OPÇÃO B — se 25 já concluiu: próxima é Fase 27 (Opus + browser, ~2-3h):

`"leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 27"`

🔀 **Paralelismo possível:** Fase 27 pode rodar simultânea com Fases 28/29/30 do master fase-28 (concerns diferentes).

⚠️ **CRÍTICO:** Fase 27.1 (VRT baseline) DEVE rodar ANTES de qualquer sweep visual (Fases 31-34 do master fase-28). Se já planejando wave 28-40, executar 27.1 agora estabelece baseline pré-mudanças.

**REGRA DE OURO: não simplificar nem pular etapas.** Se uma page ficou em 310 linhas, decompor mais. Não aceitar "ficou bem próximo".

---

# Fase 27 — Visual QA

> **Comando:** `leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 27`
> **Tempo:** ~2-3h
> **Modelo:** Opus 4.7 + fundador no browser
> **Depende de:** Fases 25 + 26
> **Paralelo com:** —

Consolida débito de 3 fases que ficaram com QA visual deferred:

- Fase 06.5 (verificação visual pós-migração de UI components)
- Fase 14 (craft pass v1 — só rodou curl HTTP 200)
- Fase 22 (craft pass v2 — só fez audit code-level)

## 27.1 — Playwright VRT baseline

Infra já existe (descoberta na auditoria): `@playwright/test` em package.json, `playwright.config.ts` no root, `e2e/{smoke,vrt-baseline}.spec.ts`, projetos chromium + Pixel 5 + iPad Mini.

```
[ ] pnpm exec playwright install (caso ainda não tenha browsers locais)
[ ] Atualizar e2e/vrt-baseline.spec.ts com lista de rotas críticas pós-refatoração
    (incluir páginas e componentes alterados em fases 25 + 26)
[ ] pnpm exec playwright test e2e/vrt-baseline.spec.ts --update-snapshots
[ ] Verificar que screenshots foram gerados em e2e/__snapshots__/ ou similar
[ ] Copiar uma amostra (top 20 páginas) pra docs/refatoracao-2026-05/screenshots/v3/
```

## 27.2 — Sweep manual no browser

Ações que precisam de fundador (Claude não pode rodar):

```
[ ] pnpm dev rodando
[ ] Abrir 30 páginas críticas em DevTools mode 375px (iPhone SE):
    (auth)/login + signup + verify-email
    (app)/onboarding (steps 1-5)
    (shell) dashboard + leads + clients + template + site + settings
    (public) /, /precos, /sobre, /diagnostico, /[slug] (test)
    (client) /aluno/dashboard
    (influencer) /influencer
    + 8 páginas refatoradas em fase 26 (cover, plans/4, coming-soon, dashboard, clients, leads)
[ ] Abrir as mesmas em 1280px (desktop)
[ ] Verificar:
    - Layout não quebra
    - Touch targets >=44px
    - Empty state com CTA (se for lista vazia)
    - Loading skeleton aparece (force lenta com DevTools throttling)
    - Brand reflete (cor, shape, density mudam quando ajustado)
[ ] Salvar screenshots PASS/FAIL em docs/refatoracao-2026-05/screenshots/v3/manual/
[ ] Listar issues encontradas em CHECKLIST.md fase 27 — corrigir em commits separados
    se forem rápidas; abrir débito 18+ se forem grandes
```

## 27.3 — Verificação

```
[ ] e2e/vrt-baseline.spec.ts passa em CI local
[ ] docs/refatoracao-2026-05/screenshots/v3/ tem amostras
[ ] CHECKLIST.md fase 27 com lista de issues + status
[ ] Fase 06.5 e Fase 14 marcadas como cobertas via Fase 27
[ ] commit: "fix(27): visual QA baseline + manual 375/1280 sweep"
```

## Ao concluir

Reportar: VRT baseline gerado, screenshots manuais salvos, issues encontradas listadas + corrigidas (ou movidas pra débito).

Dizer ao fundador:

---

**Fase 27 concluída — wave 23-27 FECHADA.**

VRT baseline: e2e/vrt-baseline.spec.ts atualizado com rotas pós-25/26, screenshots em docs/refatoracao-2026-05/screenshots/v3/.
Manual sweep 30 páginas em 375 + 1280: <N> issues encontradas, <M> corrigidas, <K> movidas pra débito 18+.
Fase 06.5 e Fase 14 marcadas cobertas via Fase 27.

Build: tsc 0, vitest 442/442, lint 0/0, build 93/93.

**Próxima fase — wave 28-40 (consistência + a11y, ~32h em 13 fases):**

`"leia docs/refatoracao-2026-05/execucao/fase-28-consistencia-a11y.md e execute a Fase 28"`

🔀 **Paralelismo já era possível durante esta wave** — Fases 28, 29, 30 do master fase-28 podem ter rodado em paralelo com 23-27 (concerns diferentes). Se ainda não rodaram, agora podem rodar serial ou em paralelo entre si.

⚠️ **IMPORTANTE:** baseline VRT da Fase 27.1 é PRÉ-REQUISITO da Fase 39 (que faz VRT compare contra ela). Se foi gerado nesta fase, perfeito — Fase 39 já tem o baseline pronto.

**REGRA DE OURO: não simplificar nem pular etapas.** Manual sweep em 30 páginas requer abrir CADA uma — não confiar em "as principais já estão ok". Issues identificadas: corrigir agora se rápido, ou abrir débito explícito (não "TODO").

---

## Critério de "wave 23-27 fechada"

```
[ ] Fase 23: 14 edges ACTIVE com updated_at >= 2026-05-XX (data do deploy)
[ ] Fase 23: supabase/migrations/ com ≥113 arquivos
[ ] Fase 24: tsconfig.json com noUncheckedIndexedAccess + exactOptional + noImplicitReturns
[ ] Fase 25: 10 componentes <300 linhas
[ ] Fase 26: 4 páginas legacy <300 linhas
[ ] Fase 27: VRT baseline + screenshots manuais salvos
[ ] CLAUDE.md débitos atualizados (4, 9, 13 tachados; 15 ainda fechado; 16 atualizado; 17 novo)
[ ] Master CHECKLIST.md com fases 23-27 todas [x]
[ ] tsc 0, vitest 442+/442+, lint 0/0, knip 0, build 93/93
```

---

## Comandos por sessão

```
# Sessão 1 (Sonnet)
leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 23

# Sessão 2 (Opus)
leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 24

# Sessão 3 (Opus)
leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 25

# Sessão 4 (Opus, opcional paralelo com sessão 3)
leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 26

# Sessão 5 (Opus + você)
leia docs/refatoracao-2026-05/execucao/fase-23-fechamento-real.md e execute a Fase 27
```

## Se travar no meio

```
voce esta na Fase X. continue de onde parou conforme o CHECKLIST.md e o estado atual do codigo.
```
