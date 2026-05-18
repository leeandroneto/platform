# Prompts Wave 2 — Fechamento (2 fases)

> **Contexto:** após a wave 2 (8 fases mergeadas), análise plan-vs-delivered revelou 2 gaps reais.
> **Esta wave fecha:** F133-redux-2 (allowlist gigante mascarando coverage parcial) + F140-redux-2 (AssessmentList ficou de fora — terminal trocou alvo por HeroMediaUpload).
> **Objetivo:** fechar Etapa 11 WCAG AAA com audit scripts que efetivamente bloqueiam regressão (não falso-AAA).

---

## Como usar

1. Abre **2 janelas Claude Code** (cada uma um terminal separado).
2. Em cada terminal, cole **uma única mensagem**:
   > `leia docs/refatoracao-2026-05/execucao/PROMPTS-WAVE-2-FECHAMENTO.md — você é T<N>`
   > (substitui `<N>` por 1 ou 2)
3. **Espera ~30s entre abrir um terminal e o próximo** (evita pnpm install collision).
4. O terminal **vai conferir o model atual** primeiro. Se bater, executa autônomo. Se não, ele pede `/model <nome>` e PARA até você confirmar.
5. Você fica presente mas **não autoriza nada** — fases rodam autônomas, mergeiam PR sozinhas, terminam.

---

## Protocolo de ativação (todo terminal segue)

Quando receber `você é T<N>`:

1. **Verifica o model atual** lendo o próprio system prompt — a linha `You are powered by the model named ...` indica `Opus 4.7` ou `Sonnet 4.6`.
2. Compara com o **Modelo necessário** declarado na seção `## T<N>` correspondente.
3. **Se bater:** segue direto pro bloco de instruções de T<N> e executa em modo autônomo total (sem pedir autorização — fundador presente mas inerte).
4. **Se NÃO bater:** responde apenas:
   > `⚠️ Estou em <model atual>. T<N> precisa de <model necessário>. Roda /model <nome> e me dá um "ok" pra eu seguir.`
   > E PARA. Não executa nada até receber "ok".
5. Pré-flight comum (todos, depois do match de model):
   - `cd C:\Users\leean\Desktop\onboarding-bio`
   - `git fetch origin && git pull origin main`
   - Lê `docs/refatoracao-2026-05/execucao/SUBAGENT-TEMPLATE-OVERNIGHT.md`
   - Lê `docs/refatoracao-2026-05/execucao/PADRAO-VALIDADO.md`
   - Confirma `git log -1 --oneline` antes de criar worktree
6. **NÃO TOCAR em nenhum terminal:** `CHECKLIST.md`, `CLAUDE.md`, `docs/historico-fases.md`.
7. Reporte final único:
   - `✅ Fase <NN> OK — sha <sha>, PR #<n> mergeada`
   - `❌ Fase <NN> FALHOU — <motivo>`
   - `⚠️ Fase <NN> PARCIAL — PR #<n> aberta, <motivo>`
     E STOP.

---

## Distribuição

| Terminal | Fase         | Modelo   | Tipo                                                 | Tempo estimado |
| -------- | ------------ | -------- | ---------------------------------------------------- | -------------- |
| T1       | F133-redux-2 | **Opus** | WCAG 1.4.8 — auditoria de allowlist + cobertura real | 1.5-2h         |
| T2       | F140-redux-2 | Sonnet   | WCAG 3.3.6 — fechar AssessmentList                   | 30-45min       |

---

## T1 — Fase 133-redux-2

**Modelo necessário:** Opus 4.7
**Tipo:** WCAG 1.4.8 Visual Presentation — corrigir allowlist permissiva + cobertura real
**Tempo estimado:** 1.5-2h
**PR base:** #130 (F133-redux mergeado mas com allowlist mascarando coverage parcial)

### Contexto

F133-redux (PR #130) mergeou audit script `scripts/audit-wcag-visual-prose.ts` (655l) que reporta **0 violations**, MAS:

- 14 arquivos em `components/landing/premium/sections/*` — TODOS allowlisted com justificativas tipo "heroic display copy within constrained column" / "pricing cards in fixed-width grid". Nenhum tem `max-w-[80ch]` real no DOM.
- 9 arquivos em `components/launch/_sections/*` — terminal mexeu só em `LaunchPage.tsx` shell, sub-sections não foram verificadas.
- 3 arquivos em `app/(public)/{lgpd,privacy,cookies,terms}` — não tocados (assumido coberto via `<LegalShell>` trusted wrapper, mas não validado).
- Todos os sub-componentes de `_analysis/` e `_template-section/` allowlisted com "cross-file ancestor not visible to audit" — depende de o parent ter `max-w-[80ch]` real.

**Problema:** allowlist sem verificação é falso-AAA. Mesmo padrão da F133 original (PR #113) que motivou o redux.

### Trabalho

#### Etapa A — auditar allowlist (a entrada principal de trabalho)

Para CADA entrada da `ALLOWLIST` em `scripts/audit-wcag-visual-prose.ts`:

1. Lê o arquivo justificado.
2. Classifica em uma de 3 categorias:
   - **Ancestor real cross-file** (ex: `_analysis/Ato1Section.tsx` claim "Wrapped by AuditAnalysis"): abre `AuditAnalysis.tsx` e VERIFICA que o orchestrator tem `max-w-[80ch]` envolvendo o sub-componente. Se sim, justificativa fica + comentário aponta o arquivo+linha do parent. Se não, REMOVE do allowlist e adiciona constraint no file próprio OU no parent.
   - **Layout não-prosa** (ex: grid de stats com value+label curto, footer compacto, eyebrow): justificativa fica, mas reescreve com critério objetivo ("each cell contains <40 chars" / "labels only, no body text").
   - **Prosa real allowlisted incorretamente** (ex: "heroic display copy"): REMOVE do allowlist e adiciona `max-w-[80ch]` ao container de prosa do file.
3. Toda justificativa que sobreviver tem que apontar **um critério verificável**, não opinião.

#### Etapa B — endurecer o heurístico

Atualmente o script:

- Walks 3500 chars upward looking for `className=` com `max-w-[80ch] | reading-prose | prose | max-w-prose`.
- Trata `<LegalShell>` como trusted (sem verificar que o componente tem `max-w-[80ch]`).

Mudanças:

- **Validar trusted wrappers** declaradamente: cria um set `TRUSTED_WRAPPERS` (componente → arquivo onde está definido) e na inicialização do script, abre cada arquivo e confirma que tem `max-w-[80ch]` ou equivalente. Se não tem, falha com mensagem clara.
- **Cross-file ancestor**: pra todo arquivo allowlisted com claim "wrapped by X", o script abre X e confirma `max-w-[80ch]`. Se não confirmar, joga warning.
- Bonus: aceitar `max-w-prose` como equivalente sem precisar listar (já está, mas garante).

#### Etapa C — cobrir arquivos não-allowlistados que fiquem expostos

Roda `pnpm audit:wcag-visual-prose` após Etapas A+B. Espera novos hits. Pra cada hit:

- Se for prosa real (parágrafos > 1 linha de leitura contínua): adiciona `max-w-[80ch]` ao container imediato.
- Se for layout não-prosa (cell, label, badge): adiciona ao allowlist com critério objetivo.

**Meta dura:** após Etapa C, `pnpm audit:wcag-visual-prose` retorna 0 violations COM allowlist menor e justificativas verificáveis.

### Setup worktree

1. `git worktree add ../onboarding-bio-fase-133-redux-2 -b feat/fase-133-redux-2-prose-allowlist-tightening`
2. `cd ../onboarding-bio-fase-133-redux-2`
3. `cp ../onboarding-bio/.env.local .env.local`
4. `pnpm install`

### Verificação binária + nova

- tsc 0
- vitest pass
- lint 0 errors
- build 94/94
- `pnpm audit:wcag-visual-prose` — 0 violations
- **Auditoria do diff do allowlist:** no commit message, lista quantas entradas foram (a) verificadas e mantidas, (b) removidas com cobertura real, (c) reescritas com critério objetivo.

### Reporte final

`✅ Fase 133-redux-2 OK — sha <sha>, PR #<n> mergeada, allowlist <antes>→<depois> entradas, X containers com max-w-[80ch] novo, audit script endurecido (trusted wrappers validados na inicialização)`

---

## T2 — Fase 140-redux-2

**Modelo necessário:** Sonnet 4.6
**Tipo:** WCAG 3.3.6 — fechar AssessmentList que ficou fora do F140-redux original
**Tempo estimado:** 30-45min
**PR base:** #129 (F140-redux mergeou LeadFollowUpEditor + HeroMediaUpload mas trocou AssessmentList por engano)

### Contexto

F140-redux original (PR #129) tinha como alvos explícitos no prompt:

- `components/clients/LeadFollowUpEditor.tsx` ✅ feito
- `components/clients/AssessmentList.tsx` ❌ NÃO feito — terminal substituiu por `components/settings/HeroMediaUpload.tsx`

`AssessmentList.tsx` linha 83 tem `handleDelete(assessmentId)` que dispara `deleteAssessmentAction` direto sem nenhum confirm dialog. Critério WCAG 3.3.6 exige prevenção de erro em ação destrutiva.

### Setup worktree

1. `git worktree add ../onboarding-bio-fase-140-redux-2 -b feat/fase-140-redux-2-assessmentlist-confirm`
2. `cd ../onboarding-bio-fase-140-redux-2`
3. `cp ../onboarding-bio/.env.local .env.local`
4. `pnpm install`

### Trabalho

1. Lê `components/clients/AssessmentList.tsx` inteiro (149l) pra entender estrutura.
2. Wrappa `handleDelete` com shadcn `AlertDialog`:
   - Padrão: AlertDialog com title (i18n key tipo `clients.assessments.confirm_delete.title`), description, Cancel/Confirm buttons.
   - Mantém a lógica de `setDeletingId(assessmentId)` durante a ação real.
   - Estado `useState<string | null>(null)` pra controlar qual assessment está com dialog aberto.
3. Adiciona keys i18n correspondentes em `messages/pt-BR.json` (Lê primeiro outras keys de `clients.*` pra manter convenção).
4. Confirma que o audit script `pnpm audit:wcag-destructive-confirm` agora detecta `AssessmentList.handleDelete` E que ele PASSA (porque tem AlertDialog import + state pattern).

### Cobertura adicional (sweep oportunista)

5. Roda `grep -rn "handleDelete\|handleRemove\|handleClear\|onDelete\|onRemove\|onClear" components/ app/ | grep -v "_test\|.test."` pra detectar se algum outro destrutivo ficou exposto.
6. Pra cada hit fora da allowlist atual: ou (a) cobrir com AlertDialog se for ação destrutiva real OU (b) adicionar à allowlist com justificativa objetiva (ex: "clear filter — non-destructive, only resets local UI state").

### Verificação binária

- tsc, vitest, lint, build padrão
- `pnpm audit:wcag-destructive-confirm` — 0 violations e detecta `AssessmentList.handleDelete`

### Reporte final

`✅ Fase 140-redux-2 OK — sha <sha>, PR #<n> mergeada, AssessmentList coberto, X destrutivos extras descobertos no sweep e tratados`

---

## Pós-execução

Quando T1 e T2 reportarem, execute:

```bash
cd C:\Users\leean\Desktop\onboarding-bio
git fetch origin --prune
git pull origin main
git log --oneline -5
gh pr list --state merged --limit 5
git worktree list
```

Próximos passos:

1. **Auditoria final do diff plan-vs-delivered** (5 min): cruzar PRs novos com PROMPTS-WAVE-2-FECHAMENTO.md pra confirmar que escopo bateu (não trocou alvo igual F140 original).
2. **PR consolidado de docs** (separado): atualizar `CHECKLIST.md` + `CLAUDE.md` "Estado atual" + `docs/historico-fases.md` com as 10 fases (8 da wave + 2 do fechamento).
3. **F141-redux-2** (deferred — produto): se quiser implementação concreta de 3.3.9 Enhanced (passkeys/WebAuthn como alternativa a senha), abrir como decisão de produto separada — não cabe em sweep mecânico.
