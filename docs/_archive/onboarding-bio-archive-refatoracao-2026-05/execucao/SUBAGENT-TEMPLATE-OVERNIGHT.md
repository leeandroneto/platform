# Subagent template — overnight refatoração 2026-05

> Lido obrigatoriamente no início de cada fase pelo subagente autônomo.
> Substitui PROTOCOLO-TERMINAL.md durante o overnight (fundador dormindo, sem aprovações intermediárias).

---

## Contexto

Você é um subagente autônomo executando UMA fase específica da refatoração 2026-05.

**MODO AUTÔNOMO TOTAL** — fundador está dormindo. Autoriza tudo: spawn de agents, commits, force-with-lease pushes, auto-merge de PRs, edits cross-file.

**NÃO PERGUNTE NADA. Execute → commit → push → MERGE → STOP.**

Variáveis a substituir antes de executar:

- `<NN>` — número da fase (ex: 91)
- `<FILE>` — caminho do arquivo a decompor (ex: `components/funnel/tabs/ConfigTab.tsx`)
- `<LINES>` — linhas do arquivo (ex: 517)
- `<SLUG>` — slug curto pra branch (ex: `configtab`)
- `<KIND>` — `decompose` OU `wcag`

---

## Pré-flight

```bash
cd C:/Users/leean/Desktop/onboarding-bio
git fetch origin
git pull --rebase origin main
git worktree add ../onboarding-bio-fase-<NN> -b feat/fase-<NN>-<SLUG>
cd ../onboarding-bio-fase-<NN>
cp ../onboarding-bio/.env.local .env.local
pnpm install
```

Espera `pnpm install` completar antes de seguir.

---

## Trabalho

### Se KIND=decompose

1. Leia `<FILE>` inteiro (`<LINES>` linhas).
2. Plane splits **semânticos** (não cortes arbitrários por linha). Use `grep -rn "import.*<NomeDoComponente>" components/ app/` pra mapear API pública (todos os exports usados por consumers).
3. Decomponha em orchestrator (que mantém o nome original) + `_components/` ou `_sections/` ou `_steps/` (subfolder no mesmo diretório).
4. **Cada arquivo final < 300 linhas.**
5. **Preserve TODOS os exports públicos** usados por consumers. Verifique novamente com grep depois.
6. Tokens visuais: `docs/refatoracao-2026-05/execucao/PADRAO-VALIDADO.md` é contrato vinculante. **Não regrida tokens**.

### Se KIND=wcag

Leia critério no `docs/refatoracao-2026-05/execucao/PLANO-FINAL.md` Etapa 11. Faça sweep no codebase aplicando o critério. Cada fase tem foco específico:

| Fase | Critério                           | Foco                                                                                 |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| 132  | 1.4.6 Contrast Enhanced            | `validateBrandColor` exige Lc≥90; sweep tokens contraste em `globals.css`            |
| 133  | 1.4.8 Visual Presentation          | `line-height: 1.5+`, paragraph spacing `1.5×`, `max-width: 80ch`, sem `text-justify` |
| 134  | 2.1.3 Keyboard No Exception        | zero `onMouseEnter`/`onMouseDown` sem keyboard equivalente                           |
| 135  | 2.2.3 No Timing                    | zero auto-redirect/countdown sem extend                                              |
| 136  | 2.3.2 Three Flashes                | animations < 3 flashes/seg                                                           |
| 137  | 2.4.12 Focus Not Obscured Enhanced | scroll-margin enhanced (elemento INTEIRO visível, não só 1px) — extends F86          |
| 138  | 2.5.6 Concurrent Input Mechanisms  | mouse + keyboard + touch paralelos em todos componentes                              |
| 139  | 3.2.5 Change on Request            | zero auto-submit em selects, zero auto-navigate                                      |
| 140  | 3.3.6 Error Prevention All         | confirm dialogs em ações destrutivas (delete client, delete plan)                    |
| 141  | 3.3.9 Accessible Auth Enhanced     | reusa F85 base; zero cognitive function tests em auth                                |

---

## REGRA CRÍTICA — não tocar docs

**NÃO MODIFIQUE estes arquivos:**

- `docs/refatoracao-2026-05/execucao/CHECKLIST.md`
- `CLAUDE.md`
- `docs/historico-fases.md`

Eles ficam num PR consolidado depois (fundador faz de manhã). Se você os tocar, gera conflito de merge com outras 30+ fases rodando em paralelo.

---

## Verificação binária (na ordem)

```bash
pnpm exec tsc --noEmit         # espera 0 erros
pnpm exec vitest run           # espera ≥513 passing
pnpm lint                      # espera 0 errors (warnings ok)
pnpm build                     # espera 94/94
```

**Se qualquer passo falhar:** pare, NÃO commite, reporte falha com motivo.

---

## Commit + Push + Merge

```bash
git add <apenas arquivos da sua fase, NUNCA CHECKLIST.md/CLAUDE.md/historico-fases.md>

git commit -m "feat(<NN>): <título curto, 1 linha>

<corpo: 2-3 linhas com o que mudou>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
# (Substitua 'Sonnet 4.6' por 'Opus 4.7 (1M context)' se rodando em Opus)

git fetch origin
git rebase origin/main      # resolva conflitos se houver

git push -u origin feat/fase-<NN>-<SLUG>
# Use --force-with-lease se rebase reescreveu commits

gh pr create \
  --title "fase(<NN>): <título>" \
  --body "## Resumo
<bullets curtos do que mudou>

## Verificação
- tsc 0 erros
- vitest pass
- lint 0 errors
- build 94/94

Docs (CHECKLIST/CLAUDE/historico) ficam em PR consolidado.

🤖 Claude Code"

# Espera 30s pra CI iniciar
sleep 30

gh pr merge --squash --delete-branch
```

**Se merge falhar com conflito:**

```bash
cd ../onboarding-bio-fase-<NN>
git fetch origin
git rebase origin/main
# resolva conflitos manualmente
git push --force-with-lease origin feat/fase-<NN>-<SLUG>
gh pr merge --squash --delete-branch
```

Máximo **3 tentativas** de merge. Se ainda falhar, deixa PR aberta e reporta — fundador resolve de manhã.

---

## Cleanup

```bash
cd C:/Users/leean/Desktop/onboarding-bio
git fetch origin
git pull origin main
git worktree remove ../onboarding-bio-fase-<NN> --force
git branch -D feat/fase-<NN>-<SLUG>
```

---

## Reporte final

Mensagem única no fim:

✅ Sucesso: `Fase <NN> OK — sha <sha>, PR #<n> mergeada`

❌ Falha: `Fase <NN> FALHOU — <motivo curto>`

⚠️ Parcial (PR aberta sem merge): `Fase <NN> PARCIAL — PR #<n> aberta, conflito não resolvido em <arquivos>`

STOP após reporte. Não execute outras fases.
