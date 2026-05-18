# Plano de Refatoracao Horizontal — onboarding.bio

> Pesquisa de estrategias + referencia ao plano de execucao.
> **Criado:** 2026-05-01
> **Execucao:** `docs/refatoracao-2026-05/execucao/` (15 fases auto-contidas)

---

## 1. Estrategia escolhida: Infrastructure-First + Batched Execution

### Por que esta e por que nao outras

| Estrategia                         | Veredicto | Motivo                                                        |
| ---------------------------------- | --------- | ------------------------------------------------------------- |
| **Rewrite total**                  | NAO       | Quebra tudo, trava features, burnout                          |
| **Codemod (jscodeshift/ts-morph)** | NAO       | ~100 arquivos, ROI negativo vs AI-assisted manual             |
| **Shotgun Surgery puro**           | PARCIAL   | Bom pra cross-cutting, mas precisa de batching                |
| **Infrastructure-first**           | SIM       | Instalar regras como warn → fix em lotes → promover pra error |

### Principios da execucao

1. **Foundation antes de consumers.** Tokens/globals → components/ui → pages.
2. **Pequeno antes de grande.** Auth (5 pages) antes de Shell (37 pages). Pratica o pattern.
3. **Component standardization antes de i18n.** Nao extrair strings de componentes que voce vai reestruturar.
4. **Type-check constantemente.** `tsc --noEmit` apos cada arquivo. `vitest` apos cada batch.
5. **Warn primeiro, error depois.** Warnings mostram progresso sem bloquear workflow.

---

## 2. Metricas do codebase

| Metrica                        | Valor |
| ------------------------------ | ----- |
| Componentes mortos (0 imports) | 30    |
| Violacoes HTML raw             | 236   |
| Total pages                    | 124   |
| Total componentes              | 124   |
| Route groups                   | 6     |
| shadcn a instalar              | 16    |

---

## 3. Fases (15)

Cada fase e um arquivo auto-contido em `execucao/`. Abra um terminal novo e diga:
**"leia docs/refatoracao-2026-05/execucao/fase-NN-nome.md e execute"**

| Fase | Nome                | O que faz                                               | Est.  |
| ---- | ------------------- | ------------------------------------------------------- | ----- |
| 00   | Baseline            | Snapshot de estado + testes                             | 15min |
| 01   | Lint infra          | Instalar plugins, regras como warn, audit               | 2h    |
| 02   | Dead code           | Deletar 30 componentes mortos                           | 1h    |
| 03   | shadcn install      | Instalar 16 componentes novos                           | 1h    |
| 04   | Claude setup        | .claude/ hooks, rules, skills, agents                   | 1h    |
| 05   | Tokens/globals      | tsconfig hardening, verificar globals.css               | 2h    |
| 06   | UI components       | Migrar custom → shadcn (IconButton, SelectionCard, etc) | 4h    |
| 07   | Shell pages         | app/(app)/(shell)/ — 37 pages                           | 8h    |
| 08   | Public pages        | app/(public)/ — 36 pages                                | 6h    |
| 09   | Auth + onboarding   | app/(auth)/ + onboarding — 10 pages                     | 3h    |
| 10   | Client + influencer | app/(client)/ + (influencer)/ + admin — 12 pages        | 2h    |
| 11   | Components domain   | components/ nao-ui — form, report, site, etc            | 6h    |
| 12   | i18n sweep          | Hardcoded PT → t()                                      | 8h    |
| 13   | Lint promote        | Warn → error, knip 0, build final                       | 2h    |
| 14   | Craft pass          | Visual sweep + smoke test                               | 4h    |

**Total estimado: ~48h (~10 dias uteis com paralelismo)**

---

## 4. Mapa de dependencias e paralelismo

```
00 → 01 → 02 + 03 (paralelo)
              ↓
         04 + 05 (paralelo)
              ↓
             06
              ↓
     07 + 08 + 09 + 10 (3 terminais paralelos)
              ↓
        11 → 12 → 13 → 14
```

---

## 5. Regras que todo terminal segue

Ver `execucao/README.md` para as 10 regras globais.

Resumo:

- git pull antes de comecar E antes de commitar
- Ler CLAUDE.md + regras antes de qualquer edicao
- NUNCA confiar em docs — ler codigo real
- NUNCA pular item — reportar se falhar
- NUNCA simplificar — migrar TODOS os arquivos listados
- Investigar ALEM do listado
- tsc apos cada arquivo, vitest apos cada fase
- Atualizar CHECKLIST.md ao concluir
- Reportar sucesso E falhas
