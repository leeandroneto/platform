# Refatoracao Horizontal — Execucao

> **STATUS atual (2026-05-03):** Fases 00-28 concluídas. Wave 28-40 e plano de 141 fases DESCONTINUADOS. **Plano Opção D Beck-compliant aberto — 133 fases (29-161).** Master: `PLANO-FINAL.md`. Protocolo: `PROTOCOLO-TERMINAL.md`. Padrão validado (após Fase 47): `PADRAO-VALIDADO.md`.
> Snapshot inicial: tsc 0, vitest 442/442, lint 0/0, knip 0, build 93/93.
>
> **Histórico:** Fases 00-14 refatoração original. Fases 15-22 cobertura 100% (`fase-15-cobertura-100.md`). Fases 23-27 fechamento real (`fase-23-fechamento-real.md`). Fase 28 baseline (`AUDITORIA-CONSISTENCIA-A11Y.md`). **Fases 29-161 Opção D:** foundations horizontais (29-45) → VRT baseline (46) → vertical de prova /r/[token] + PADRAO-VALIDADO.md (47) → A11y básico (48-50) → sweeps horizontais seguindo doc validado (51-86) → decompose (87-131) → WCAG AAA + QA (132-156) → hardening (157-161). 8 hard dependencies cross-etapa documentadas.
>
> **Como usar (cada terminal):**
> `"Leia docs/refatoracao-2026-05/execucao/PLANO-FINAL.md e docs/refatoracao-2026-05/execucao/PROTOCOLO-TERMINAL.md. Você é o Terminal X, executando a Fase NN."`
> Terminal seguirá protocolo: pull --rebase → checar hard deps → ver paralelos ativos → mini-card → aprovação intermediária → lista de pulos → commit + PR. Após Fase 47, leitura obrigatória de `PADRAO-VALIDADO.md` antes de qualquer sweep.

---

## ⛔ REGRA DE OURO — PROIBIDO SIMPLIFICAR OU PULAR ETAPAS

**Vale para TODAS as fases (00 a 14). Sem excecao.**

- **PROIBIDO pular item.** Se "Migrar 37 arquivos" esta listado, sao os 37 — nao 36, nao "os principais".
- **PROIBIDO simplificar.** Sem versao "minima viavel", sem "depois eu volto", sem "ja deu pra entender".
- **PROIBIDO marcar item como concluido sem ter executado integralmente.**
- **PROIBIDO cortar escopo unilateralmente.** Se algo e impossivel ou perigoso, PARAR e perguntar ao fundador antes.
- **PROIBIDO "TODO: revisitar".** Resolva agora ou reporte como bloqueio explicito.

Se um item demorar mais que o estimado: continue. Se um item for mais complexo que parece: continue. Se voce achou um atalho "equivalente": NAO use sem confirmar.

A unica saida valida de um item e: **executado 100%** OU **reportado como bloqueio com diagnostico**.

---

## Mapa de fases

| Fase | Nome                | Depende de | Paralelo com | Est.  |
| ---- | ------------------- | ---------- | ------------ | ----- |
| 00   | Baseline            | —          | —            | 15min |
| 01   | Lint infra          | 00         | —            | 2h    |
| 02   | Dead code           | 01         | 03           | 1h    |
| 03   | shadcn install      | 01         | 02           | 1h    |
| 04   | Claude setup        | 02+03      | 05           | 1h    |
| 05   | Tokens/globals      | 02+03      | 04           | 2h    |
| 06   | UI components       | 02+03+05   | —            | 4h    |
| 07   | Shell pages         | 06         | 08, 09, 10   | 8h    |
| 08   | Public pages        | 06         | 07, 09, 10   | 6h    |
| 09   | Auth + onboarding   | 06         | 07, 08, 10   | 3h    |
| 10   | Client + influencer | 06         | 07, 08, 09   | 2h    |
| 11   | Components domain   | 07-10      | —            | 6h    |
| 12   | i18n sweep          | 11         | —            | 8h    |
| 13   | Lint promote        | 12         | —            | 2h    |
| 14   | Craft pass          | 13         | —            | 4h    |

### Wave 15-22 (cobertura 100%) — `fase-15-cobertura-100.md`

| Fase | Nome                          | Depende de     | Paralelo com | Est. |
| ---- | ----------------------------- | -------------- | ------------ | ---- |
| 15   | Fechar 12+13                  | 14             | —            | 30m  |
| 16   | Foundations API + email       | 15             | —            | 2h   |
| 17   | Rotas incompletas (17)        | 16             | 18           | 2h   |
| 18   | Brand iconmark + assets       | 16             | 17           | 2h   |
| 19   | Rotas novas (42)              | 16, 17, 18     | —            | 5h   |
| 20   | Componentes esquecidos (30)   | 19             | —            | 2h   |
| 21   | PDF + email migration + edges | 16             | —            | 5h   |
| 22   | Craft pass v2                 | 17, 19, 20, 21 | —            | 3h   |

### Wave 23-27 (fechamento real) — `fase-23-fechamento-real.md`

| Fase | Nome                                  | Depende de | Paralelo com | Est. |
| ---- | ------------------------------------- | ---------- | ------------ | ---- |
| 23   | Operacional (deploy + sync + débitos) | 22         | 28 🔀        | 1-2h |
| 24   | tsconfig hardening                    | 23         | 29 🔀        | 3-4h |
| 25   | Decompose 10 components >500l         | 24         | 26 🔀        | 4-6h |
| 26   | Decompose 4 pages >300l               | 24         | 25 🔀        | 3-4h |
| 27   | Visual QA (VRT + manual)              | 25, 26     | —            | 2-3h |

### Wave 28-40 (consistência + a11y) — `fase-28-consistencia-a11y.md`

| Fase | Nome                                        | Depende de      | Paralelo com | Est. |
| ---- | ------------------------------------------- | --------------- | ------------ | ---- |
| 28   | Baseline + audit detalhado                  | 22              | 23 🔀        | 1h   |
| 29   | Foundations (Eyebrow/SectionTitle/SkipLink) | 28              | 24 🔀        | 3h   |
| 30   | Lint hardening (warn first)                 | 29              | 35 🔀        | 2h   |
| 31   | Sweep shapes (449 rounded-\* → var)         | 30, **!25 !26** | 32 🔀        | 3h   |
| 32   | Sweep tipografia (1250 text-\* → Text)      | 30, **!25 !26** | 31 🔀        | 4h   |
| 33   | Sweep casing (491 uppercase → Eyebrow)      | 31, 32          | 34 🔀        | 2h   |
| 34   | Sweep cores hardcoded + inline              | 31, 32          | 33 🔀        | 2h   |
| 35   | A11y foundations (skip link + landmarks)    | 29              | 30, 36 🔀    | 2h   |
| 36   | A11y ARIA states (current/describedby/live) | 35              | 35 🔀        | 3h   |
| 37   | Heading hierarchy + multi-tenant focus ring | 32, 36          | —            | 2h   |
| 38   | WCAG 2.2 AA + AAA + axe-playwright CI       | 37              | —            | 4h   |
| 39   | Lint promote + craft pass + VRT compare     | 30-38, 27.1     | —            | 5h   |
| 40   | Verificação final + docs                    | 39              | —            | 1h   |

**Legenda:** `🔀` = pode rodar em paralelo (terminais separados). `!NN` = NÃO simultâneo (mesmos arquivos).

## Coordenação cross-wave (23-27 ↔ 28-40)

Cuidado com sweeps das fases 31-34 (~250 arquivos) vs decompose 25/26 (mesmos arquivos):

| Combinação                                 | Status                                                                |
| ------------------------------------------ | --------------------------------------------------------------------- |
| Fase 23 (ops) ↔ Fases 28/29/30             | ✅ paralelo seguro (zero conflito de arquivos)                        |
| Fase 24 (tsconfig) ↔ Fase 29 (foundations) | ✅ paralelo (foundations cria primitives novos pequenos)              |
| Fases 25+26 (decompose)                    | ⚠️ devem CONCLUIR antes de Fases 31/32 (sweeps tocam mesmos arquivos) |
| Fase 27.1 (VRT baseline)                   | ⚠️ rodar ANTES de Fases 31-34 — captura estado pré-mudanças visuais   |
| Fase 27.2 (manual sweep)                   | ⚠️ FUNDIDA na Fase 39 (craft pass + VRT compare)                      |

**Ordem cross-wave recomendada:**

```
22 → 23 (paralelo com 28) → 24 (paralelo com 29) → 25+26 paralelo →
27.1 (VRT baseline) → 30 → 31+32 paralelo → 33+34 paralelo →
35+36 paralelo → 37 → 38 → 39 (absorve 27.2) → 40
```

## Mapa de dependencias

```
00 → 01 → 02 ──┐
           03 ──┤
                ↓
          04 + 05 (paralelo)
                ↓
               06
                ↓
       07 + 08 + 09 + 10 (paralelo, 3 terminais)
                ↓
               11 → 12 → 13 → 14
```

## Paralelismo (3 terminais)

| Dia | Terminal A             | Terminal B  | Terminal C  |
| --- | ---------------------- | ----------- | ----------- |
| 1   | 00 + 01                | —           | —           |
| 2   | 02                     | 03          | —           |
| 3   | 04                     | 05          | —           |
| 4   | 06                     | —           | —           |
| 5   | 07 (shell)             | 08 (public) | 09 (auth)   |
| 6   | 07 cont.               | 08 cont.    | 10 (client) |
| 7   | 11 (components)        | —           | —           |
| 8   | 12 (i18n)              | —           | —           |
| 9   | 13 (lint) + 14 (craft) | —           | —           |

## Modelo recomendado por fase

> **Politica:** o terminal Claude que ler uma fase DEVE primeiro avisar o fundador qual modelo usar e aguardar confirmacao antes de tocar em qualquer arquivo. Use `/model` pra trocar.

| Fase                     | Modelo recomendado               | Por que                                                              |
| ------------------------ | -------------------------------- | -------------------------------------------------------------------- |
| 00 Baseline              | Sonnet 4.6 (ou `/fast` Opus 4.6) | so roda comandos, baixo risco                                        |
| 01 Lint infra            | Sonnet 4.6                       | instala/configura, segue receita                                     |
| 02 Dead code             | Sonnet 4.6                       | repetitivo, julgamento moderado                                      |
| 03 shadcn install        | Sonnet 4.6 (ou `/fast`)          | instala via CLI                                                      |
| 04 Claude setup          | Sonnet 4.6                       | cria configs                                                         |
| 05 Tokens/globals        | Sonnet 4.6                       | edita CSS + tsconfig                                                 |
| **06 UI components**     | **Opus 4.7**                     | migracao critica — 42+ imports, props mapping, alto risco de quebrar |
| **07 Shell pages**       | **Opus 4.7**                     | 8h, ampla, dashboard + leads + template + settings                   |
| **08 Public pages**      | **Opus 4.7**                     | multi-tenant, paginas que o lead/prospect ve                         |
| **09 Auth + onboarding** | **Opus 4.7**                     | fluxo critico, 23 steps no onboarding                                |
| 10 Client + influencer   | Sonnet 4.6                       | escopo menor                                                         |
| **11 Components domain** | **Opus 4.7**                     | toca form/report/site/landing/dashboard                              |
| 12 i18n sweep            | Sonnet 4.6                       | repetitivo (string → t())                                            |
| 13 Lint promote          | Sonnet 4.6                       | promote regras + fix                                                 |
| **14 Craft pass**        | **Opus 4.7**                     | julgamento visual, polish, abre todas rotas                          |

**Regra de bolso:** se a fase migra componentes ou toca >5 arquivos com risco real → Opus 4.7. Se e config, install, ou repete o mesmo padrao → Sonnet 4.6 (ou `/fast` pra ganhar velocidade sem cair de familia).

**NUNCA usar Haiku** em nenhuma fase — Haiku tende a cortar caminho ("padrao estabelecido, restante e trivial") e violar a regra-de-ouro de "proibido simplificar".

---

## Regras globais (todo terminal segue)

1. `git pull --rebase origin main` **SEMPRE** — ao iniciar a fase E antes de CADA commit (evita conflitos entre terminais paralelos)
2. Ler CLAUDE.md + regras de padronizacao antes de qualquer edicao
3. NUNCA confiar em docs pra estado atual — sempre ler codigo real
4. NUNCA pular item. Se nao conseguir, reportar erro
5. NUNCA simplificar. "Migrar 37 arquivos" = migrar todos os 37
6. Investigar alem do listado — grep codebase por problemas relacionados
7. Apos cada item: `pnpm exec tsc --noEmit`
8. Apos fase completa: `pnpm exec tsc && pnpm exec vitest run && pnpm lint`
9. **OBRIGATORIO** atualizar `CHECKLIST.md` ao concluir — items concluidos `[x]`, falhados `[!]` com motivo, pendentes `[ ]` com nota
10. **OBRIGATORIO** atualizar `AUDITORIA-*.md` da wave (se aplicavel) com numeros pos-fase
11. **OBRIGATORIO** documentar TUDO que nao deu certo — bloqueios, decisoes nao previstas, items parciais, regressoes, falsos positivos, heuristicas que falharam
12. Reportar ao fundador: deltas + estado do build + **proxima fase E quais podem rodar em paralelo agora** + comando exato

## ⛔ Refatoracao HORIZONTAL = 100% do projeto

Toda fase deste ciclo (00-40) e horizontal. Significa: cobre **TODAS** as rotas (~120), **TODOS** os componentes (~250 fora ui/), **TODOS** os layouts, **TODAS** as superficies publicas e internas, **TODOS** os flows multi-step. Sem "as principais", sem "amostra representativa", sem cortar escopo unilateralmente.

Se uma fase lista N ocorrencias pra migrar, sao N — nao N-10, nao "ate atingir 90%". Se a auditoria identifica X arquivos, sao X. SKIPs sao sempre **declarados explicitamente** com motivo (nao silenciosos).

**A wave 23-27 existe porque fases 21-22 cortaram escopo silenciosamente** (marcaram items concluidos sem executar). Nao repetir.

## Como reportar bloqueios (template)

Se um item da fase nao puder ser executado:

```
**Bloqueio detectado: <ID descritivo>**

Fase: <NN.X>
Tentativa: <o que tentou>
Erro/limitacao: <descricao tecnica especifica>
Impacto: <bloqueia esta fase? bloqueia fases futuras?>
Workaround proposto: <opcao A, B, C, ou "preciso direcionamento">

Decisao recomendada (se houver): <fundador escolhe>
```

Adicionar bloqueio no `CHECKLIST.md` da fase + reportar inline no chat. Nao prosseguir ate o fundador validar workaround.

## Regra critica: NUNCA desligar sem religar

Ao migrar um componente (ex: IconButton → Button size="icon"):

1. **ANTES de deletar o antigo:** grep TODOS os consumidores no codebase inteiro
2. **Migrar CADA consumidor** — trocar import, trocar JSX, adaptar props
3. **Rodar tsc apos CADA arquivo** migrado — se quebrar, o consumidor nao foi atualizado
4. **So deletar o componente antigo DEPOIS** que todos consumidores estao migrados e tsc passa
5. **Rodar `pnpm dev` e abrir 2-3 paginas** que usavam o componente — verificar visualmente
6. **Se o componente novo tem API diferente** (props, variants, children), mapear ANTES de comecar:
   - Listar todas as props do antigo
   - Mapear cada prop pro equivalente no novo
   - Documentar o mapeamento no inicio do item
   - Exemplo: `IconButton icon={X} label="Y"` → `<Button size="icon" aria-label="Y"><X /></Button>`

### Checklist de integridade por migracao

```
[ ] Grep encontrou N consumidores do componente antigo
[ ] Todos N consumidores migrados pro novo
[ ] tsc passa (0 erros)
[ ] vitest passa (testes nao quebraram)
[ ] Abri 2-3 paginas afetadas no browser — renderizam correto
[ ] Componente antigo deletado
[ ] Grep pelo nome antigo retorna 0 resultados
[ ] Nenhum import quebrado restante
```

Se em qualquer ponto tsc falhar ou uma pagina quebrar: **PARAR, diagnosticar, e religar antes de continuar.** Nunca acumular "vou arrumar depois".
