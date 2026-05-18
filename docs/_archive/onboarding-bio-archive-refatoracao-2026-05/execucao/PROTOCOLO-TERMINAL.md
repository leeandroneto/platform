# Protocolo do Terminal — Refatoração 100% (fases 29-169)

> **Leitura obrigatória** pra qualquer terminal/agente que executar uma fase do plano.
> Linkado em `CLAUDE.md`. Plano master: `docs/refatoracao-2026-05/execucao/PLANO-FINAL.md`.

---

## Modelo de isolamento: git worktree

Cada fase roda num **diretório físico separado** via `git worktree`. Isso elimina a principal causa de perda de trabalho nas primeiras fases: contaminação cruzada de stashes do lint-staged, sangramento de arquivos entre fases paralelas e switches acidentais de branch no mesmo diretório.

```
~/Desktop/
  onboarding-bio/             ← diretório principal (sempre em main)
  onboarding-bio-fase-34/     ← worktree do Terminal B (Fase 34)
  onboarding-bio-fase-35/     ← worktree do Terminal C (Fase 35)
  onboarding-bio-fase-36/     ← worktree do Terminal D (Fase 36)
```

Cada worktree tem seu próprio working tree mas compartilha o `.git`. Isso significa:

- Sem `git stash` acidental entre fases
- Sem `git checkout` que contamina outro terminal
- `git worktree list` mostra todas as fases ativas de uma vez

### Criar worktree para a fase

```bash
# No diretório principal (onboarding-bio/)
git fetch origin
git pull --rebase origin main
git worktree add ../onboarding-bio-fase-NN -b feat/fase-NN-slug-curto
cd ../onboarding-bio-fase-NN
pnpm install          # pnpm store é compartilhado — rápido
git push -u origin feat/fase-NN-slug-curto
```

### Limpar worktree após merge

```bash
# No diretório principal (onboarding-bio/)
git fetch origin
git pull origin main
git worktree remove ../onboarding-bio-fase-NN
git branch -d feat/fase-NN-slug-curto
git push origin --delete feat/fase-NN-slug-curto
```

### Ver fases ativas agora

```bash
git worktree list
```

Output esperado:

```
/Desktop/onboarding-bio          abc1234 [main]
/Desktop/onboarding-bio-fase-34  def5678 [feat/fase-34-eyebrow]
/Desktop/onboarding-bio-fase-35  ghi9012 [feat/fase-35-skip-link]
```

---

## Você é um terminal específico

Quando o fundador disser:

> "Leia o doc X e você é o terminal Y, executando a fase Z."

Você deve:

1. **Ler o doc indicado** (`PLANO-FINAL.md` ou um dos `fase-*.md`)
2. **Identificar a fase Z** que vai executar
3. **Identificar quem é o terminal Y** (terminal A, B, C, D — usado pra coordenar paralelos)
4. **ANTES de tocar em qualquer arquivo:** seguir o checklist abaixo

---

## Checklist obrigatório no início de TODA fase

### 1. Sincronizar com origin

No **diretório principal** (`onboarding-bio/`, sempre em `main`):

```bash
git fetch origin
git pull --rebase origin main
```

### 2. Verificar quais fases JÁ ESTÃO RODANDO em paralelo

```bash
# Worktrees ativos = fases rodando agora
git worktree list
```

Output esperado: linhas como `/Desktop/onboarding-bio-fase-34  abc1234 [feat/fase-34-eyebrow]`.

**Comparar contra a tabela de paralelismo da sua etapa** (em `PLANO-FINAL.md`). Se alguma fase ativa conflita com a sua (mesmo arquivo OU dependência), **PARAR e avisar o fundador**.

### 3. Avisar o fundador qual paralelos podem rodar JUNTO da sua

Antes de começar, manda mensagem assim:

```
**Terminal Y, Fase Z iniciando.**

Worktrees ativos (fases rodando agora): 46, 55, 96.
Paralelos COMPATÍVEIS comigo (Z=47): 48, 49, 50, 51, 52, 53, 54.
Paralelos INCOMPATÍVEIS comigo: nenhum.

Você pode abrir terminais novos pra:
- Terminal C → Fase 48 (skip-link em onboarding) — worktree: onboarding-bio-fase-48/
- Terminal D → Fase 49 (skip-link em diagnostic) — worktree: onboarding-bio-fase-49/
- ...

Posso começar a Fase Z agora?
```

Esperar **OK explícito** antes de seguir.

### 4. Criar worktree isolado

No diretório principal (`onboarding-bio/`):

```bash
git worktree add ../onboarding-bio-fase-NN -b feat/fase-NN-slug-curto
cd ../onboarding-bio-fase-NN
pnpm install
git push -u origin feat/fase-NN-slug-curto
```

Slug = nome curto da fase (ex: `feat/fase-46-skip-link-auth`).

O worktree publicado serve pra outros terminais detectarem que você está rodando (via `git worktree list`).

### 5. Capturar baseline

Rodar o **comando de medida** do Mini-card. Anotar **número antes**.

Se o número antes for diferente do esperado no plano: **PARAR e avisar** (algo mudou desde o doc).

### 6. Apresentar Mini-card pro fundador

Formato:

```
## Mini-card — Fase NN (<nome>)

| Campo | Valor |
|---|---|
| Etapa | <1-14> |
| Modelo | <Sonnet/Opus> |
| Tempo | <1-3h> |
| Worktree | onboarding-bio-fase-NN/ |
| Branch | feat/fase-NN-slug |

### Escopo exato
<lista de arquivos OU padrão glob específico>

### Comando de medida
`<comando exato>`
- Número antes: <N>
- Meta: <0 ou ≤M>

### Prova visual obrigatória
<screenshot/vídeo específico que será anexado no commit>

### Atalhos PROIBIDOS nesta fase
1. ❌ <atalho 1>
2. ❌ <atalho 2>
3. ❌ <atalho 3>

### O que muda no fluxo do fundador depois desta fase
<frase clara>
```

Esperar **OK explícito** antes de tocar em código.

---

## No meio da fase: aprovação intermediária

Após executar **3-5 arquivos da amostra** (não a fase inteira):

1. `git add -p` os arquivos modificados
2. `git commit` local (sem push ainda)
3. Listar arquivos modificados com diff resumido
4. Mandar pro fundador:

```
**Aprovação intermediária — Fase NN, amostra inicial.**

Modifiquei 4 arquivos:
- components/X/Y.tsx — N text-{size} → <Text variant>
- components/X/Z.tsx — idem
- ...

Padrão aplicado: <descrição em 1 frase>
Decisões duvidosas: <listar 0-3 que podem virar pulo>

Continuo com os outros M arquivos no mesmo padrão? Ou refazer a amostra com ajuste?
```

**Se fundador disser "refazer":** desfazer commit local (`git reset --soft HEAD~1`) e ajustar.
**Se fundador disser "continuar":** seguir os outros arquivos.

---

## Antes do commit final: lista de pulos OBRIGATÓRIA

Toda fase tem que listar arquivos/linhas que você decidiu **não migrar** com motivo de **uma frase**.

Formato:

```
## Pulos da Fase NN

(lista vazia se 0 pulos)

- components/X/Y.tsx:142 — usa cor dinâmica vinda de prop (item.color), token não aplicável
- components/Z/W.tsx:88 — animação intencional do método (cor da etapa do storyboard)
- ...
```

Mandar pro fundador antes do commit final. **Se motivo é vago** ("intencional", "complexo", "deferred", "incompatível"), o fundador rejeita e você refaz.

`[!] DEFERRED` é PROIBIDO em qualquer item da fase.

---

## Verificação binária final (antes do commit)

Roda os comandos NA ORDEM:

```bash
# 1. Tipos
pnpm exec tsc --noEmit
# espera: 0 erros

# 2. Testes
pnpm exec vitest run
# espera: ≥ 442 passando

# 3. Lint
pnpm lint
# espera: 0 erros (warnings podem existir até CI gate da Fase 32 ativar)

# 4. Comando de medida da fase
<o comando do Mini-card>
# espera: número = meta

# 5. Build (se a fase tocou rotas)
pnpm build
# espera: 93/93 páginas
```

Se QUALQUER UM falhar: **parar, investigar, fixar**. Não commitar com falha.

---

## Commit final

### 1. Pull rebase OBRIGATÓRIO

No worktree da fase (`onboarding-bio-fase-NN/`):

```bash
git fetch origin
git pull --rebase origin main
```

Se conflito: **resolver manualmente**. Não fazer `git checkout --theirs` ou `--ours` cego.

### 2. Atualizar docs

Arquivos que SEMPRE atualizar ao fechar fase:

a) **`docs/refatoracao-2026-05/execucao/CHECKLIST.md`** — marcar fase NN com `[x]` + sha do commit.
b) **`docs/refatoracao-2026-05/execucao/AUDITORIA-CONSISTENCIA-A11Y.md`** — preencher coluna "Pos Fase NN" da tabela "antes/depois" com novos números.
c) **`docs/historico-fases.md`** — adicionar 1 linha no final (data + fase + mudança principal). **Não** editar `CLAUDE.md` para isso; apenas atualizar a linha "Estado atual" em `CLAUDE.md` se os números de testes/warnings mudaram.

### 3. Commit

```bash
git add <arquivos modificados>
git commit -m "$(cat <<'EOF'
<type>(NN): <descricao curta>

<corpo: o que mudou e por que>

Antes: <numero>
Depois: <numero>

Pulos: <N> (lista em CHECKLIST.md)
Prova visual: <link relativo>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

`<type>` = `feat` (nova capacidade), `refactor` (mesma capacidade, código melhor), `fix` (bug), `chore` (config/docs), `test` (só testes).

### 4. Push + abrir PR

```bash
git push origin feat/fase-NN-slug-curto
gh pr create --title "fase(NN): <descricao curta>" --body "$(cat <<'EOF'
## Resumo
<1-2 paragrafos>

## Antes / Depois
- <metrica 1>: N → M
- <metrica 2>: N → M

## Prova visual
<screenshots inline ou links>

## Pulos
<lista ou "nenhum">

## Verificação
- [x] tsc 0
- [x] vitest passa
- [x] lint 0
- [x] comando de medida = meta
EOF
)"
```

### 5. Avisar fundador

```
**Fase NN concluída.**

PR aberto: <url>
Worktree: onboarding-bio-fase-NN/
Branch: feat/fase-NN-slug-curto
Sha: <sha curto>

Antes: <numero>
Depois: <numero>
Pulos aprovados: <N>
Prova visual: <link>

Verificação:
- tsc 0 ✓
- vitest <X>/<X> ✓
- lint 0/0 ✓
- comando de medida: <antes> → <depois> ✓

**Próxima fase sequencial:** Fase NN+1 (<nome>)
**Paralelos disponíveis agora:**
- Terminal X → Fase NN+2 (<nome>)
- Terminal Y → Fase NN+3 (<nome>)
- ...

(Worktrees em curso: <output de git worktree list>)

Aguardando merge do PR pra branch main.
```

### 6. Após merge

O fundador faz merge do PR (ou alguém com permissão). Após merge, no **diretório principal** (`onboarding-bio/`):

```bash
git fetch origin
git pull origin main
git worktree remove ../onboarding-bio-fase-NN
git branch -d feat/fase-NN-slug-curto
git push origin --delete feat/fase-NN-slug-curto
```

Remover o worktree dá sinal pra outros terminais que essa fase fechou (desaparece do `git worktree list`).

---

## Como saber se rodar tem paralelismo possível agora

Comando rápido a qualquer momento (no diretório principal):

```bash
git worktree list
```

Cruzar com tabela de paralelismo da sua etapa em `PLANO-FINAL.md`. Se nenhum worktree ativo conflita com a próxima fase, você pode sugerir abrir mais um terminal.

Mensagem-padrão pro fundador:

```
Status atual:
- Worktrees ativos: fase-47 (skip-link shell), fase-55 (shapes dashboard).
- Próximo da fila: fase-48 (skip-link onboarding).
- 48 NÃO conflita com 47 nem 55 → pode abrir Terminal C agora.

Quer que eu pare e aguarde, ou abro um terminal novo?
```

---

## Coordenação entre terminais paralelos

### Regra 1: worktrees isolados

Cada terminal trabalha em SEU worktree (`onboarding-bio-fase-NN/`), em sua branch (`feat/fase-NN-*`). Nunca commit direto em main. Nunca trabalhar no diretório principal — ele fica sempre em `main`.

### Regra 2: pull --rebase antes de cada commit local

Dentro do SEU worktree (`onboarding-bio-fase-NN/`):

```bash
git fetch origin
git pull --rebase origin main
```

Resolve conflitos cedo, não acumula.

### Regra 3: comunicar mudança de escopo

Se durante a fase você descobrir que precisa tocar arquivo fora do escopo (ex: descobrir que componente X importa Y que precisa ajuste): **PARAR e avisar o fundador antes de tocar Y**. Pode ser que Y esteja sendo tocado por outra fase paralela.

### Regra 4: ordem de merge importa

Se 2 fases paralelas terminam ao mesmo tempo, a primeira faz merge primeiro. A segunda faz `git pull --rebase` e re-roda verificação binária antes de mergear.

### Regra 5: nunca force push em main

`git push --force origin main` = PROIBIDO. Sempre via PR + merge normal.

### Regra 6: nunca fazer checkout de branch dentro do worktree alheio

Cada worktree tem sua branch travada. Trocar a branch de um worktree ativo é o mesmo erro que antes (contamina o trabalho do outro terminal).

---

## Regras herdadas do projeto (CLAUDE.md)

Toda fase também segue:

- **Nomenclatura:** EN em código/folders, PT em UI via `t()`.
- **Camadas:** lib/data/ lança erro; server actions retornam `{ ok, ... }`; API routes via `lib/api/` helpers.
- **Stack travado:** Next 16.2.3, React 19.2.5, Tailwind 4.2, shadcn new-york, Motion 12, Supabase ssr, Zod v4, next-intl 4, pnpm.
- **Componentes:** max 300 linhas (após Etapa 9, lint enforça).
- **shadcn em vez de HTML raw:** Button, Input, Dialog, etc. NUNCA `<button>`, `<input>` direto.
- **`<Heading>` e `<Text>` em vez de classes raw.** NUNCA `<div className="text-2xl font-bold">`.
- **Strings de UI via `t()` de next-intl.** NUNCA hardcoded em PT no JSX.
- **Cores via tokens CSS.** NUNCA hex/rgb/hsl inline.
- **Páginas públicas:** `data-shape`, `data-density`, `data-surface`, `data-palette`, `data-typography`.
- **Mobile 375px:** touch targets ≥44px.

---

## Checkpoints visuais 30min (entre Etapas 4↔5, 5↔6, 6↔7)

> Ritual obrigatório quando uma etapa de sweep termina e a próxima vai começar. **Não é fase numerada**, é portão de qualidade rápido.

### Quando rodar

- Após Fase 56 (fim da Etapa 4 Shapes), antes de iniciar Etapa 5
- Após Fase 66 (fim da Etapa 5 Tipografia), antes de iniciar Etapa 6
- Após Fase 75 (fim da Etapa 6 Casing+Cores), antes de iniciar Etapa 7

### Como rodar (~30min)

1. **Subir local:**

   ```bash
   git checkout main && git pull origin main
   pnpm install
   pnpm dev
   ```

2. **Abrir 5 rotas em 3 paletas × 3 shapes** (45 combos visuais):
   - `/login`
   - `/[slug]` (usar slug de profissional teste)
   - `/dashboard` (logar)
   - `/r/[token]` (usar token teste — **rota de referência da Fase 47**)
   - `/diagnostic`

   Pra cada rota: abrir DevTools → console → executar:

   ```js
   document.documentElement.dataset.palette = 'lime' // depois 'amber', 'coral', 'green', 'ocean'
   document.documentElement.dataset.shape = 'sharp' // depois 'rounded', 'soft'
   ```

3. **Comparar contra /r/[token]** (rota de referência da Fase 47):
   - A rota recém-refatorada (ex: dashboard depois da Fase 51) muda **igual** a /r/[token] quando alterna paleta/shape?
   - Se sim ✅ → libera próxima etapa
   - Se não ❌ → reabre a fase anterior (ex: Fase 51) e fix antes de prosseguir

### Critério ✅ aprovação

Em cada um dos 45 combos:

- Cantos arredondados mudam quando alterna `data-shape`
- Cor brand muda quando alterna `data-palette`
- Tipografia muda quando alterna `data-typography` (após Etapa 5)
- Sem elementos "presos" (ex: card que continua `rounded-lg` fixo)

### Critério ❌ falha

Se 1 dos 45 combos tem elemento "preso", a etapa anterior **não está concluída**. Reabrir + fix + re-checkpoint.

### Documentar

Cada checkpoint gera 1 entrada em `docs/refatoracao-2026-05/execucao/CHECKPOINTS.md`:

```
## Checkpoint 4→5 (data: 2026-05-XX, sha: <commit>)

- ✅ /login — passou em 45/45 combos
- ✅ /[slug] — passou em 45/45 combos
- ❌ /dashboard — falhou em 3 combos: SidebarNav rounded-lg ainda fixo
  - Ação: reaberta Fase 51, fix em components/dashboard/SidebarNav.tsx, re-merge
  - Re-checkpoint: ✅ passou
- ✅ /r/[token] — passou (referência)
- ✅ /diagnostic — passou em 45/45 combos

LIBERADO pra iniciar Etapa 5.
```

---

## Antipadrões PROIBIDOS (qualquer fase)

1. ❌ Marcar `[x]` sem rodar comando de medida.
2. ❌ Usar `[!] DEFERRED` em vez de fechar item.
3. ❌ Trocar verificação real (browser/screenshot) por verificação trivial (curl 200).
4. ❌ Pular arquivo com motivo "intencional" / "complexo" / "deferred" sem detalhar.
5. ❌ Commit sem `git pull --rebase origin main` antes.
6. ❌ Commit sem atualizar CHECKLIST.md + AUDITORIA-CONSISTENCIA-A11Y.md.
7. ❌ Commit sem mostrar lista de pulos pro fundador.
8. ❌ Force push em qualquer branch (incluindo a sua).
   8b. ❌ Trabalhar no diretório principal (`onboarding-bio/`) — ele fica sempre em `main`.
   8c. ❌ Fazer `git checkout` de outra branch dentro do worktree da fase.
9. ❌ Merge de PR sem fundador aprovar.
10. ❌ Tocar em arquivo fora do escopo sem avisar.
11. ❌ Continuar fase quando primeira amostra reprovou.
12. ❌ "Vou ajeitar depois" ou "TODO: revisitar" no código.

Se cair em qualquer um: **parar, voltar atrás, refazer no padrão correto**.

---

## Fluxo resumido (cole no scratchpad da fase)

```
1. git fetch + pull --rebase main  (no diretório principal)
2. git worktree list → ver paralelos ativos
3. avisar fundador qual paralelos compatíveis abrir
4. git worktree add ../onboarding-bio-fase-NN -b feat/fase-NN-slug + pnpm install + push -u
5. capturar baseline (comando de medida)  [dentro do worktree]
6. mini-card pro fundador → ESPERAR OK
7. executar 3-5 arquivos (amostra)
8. commit local + aprovação intermediária → ESPERAR OK
9. executar restante
10. listar pulos (motivo de uma frase) → ESPERAR OK
11. verificação binária (tsc + vitest + lint + medida + build)
12. atualizar CHECKLIST.md + AUDITORIA-CONSISTENCIA-A11Y.md + CLAUDE.md
13. git pull --rebase + commit final
14. push + gh pr create
15. avisar fundador (sha + métricas + paralelos disponíveis)
16. aguardar merge + git worktree remove + limpar branch local + remoto
```

---

## Quando travar / encontrar bloqueio

NÃO improvise. NÃO mude escopo unilateralmente. NÃO marque `[!]` e segue.

Manda pro fundador:

```
**BLOQUEIO — Fase NN, item X.Y.**

Tentei: <ação>
Erro: <mensagem>
Investiguei: <hipóteses descartadas>
Hipótese atual: <melhor palpite>

Opções:
A) <caminho A — custo, risco>
B) <caminho B — custo, risco>
C) Pausar fase, abrir débito separado, seguir resto.

Qual?
```

Esperar resposta. Não tomar decisão sozinho.
