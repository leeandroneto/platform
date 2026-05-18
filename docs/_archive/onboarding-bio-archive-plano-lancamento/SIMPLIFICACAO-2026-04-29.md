# Simplificação do Plano — 2026-04-29

> **Contexto:** plano original foi escrito pelo Claude web assumindo padrão enterprise (empresa com mil devs, DD-ready). Founder é solo, pré-beta. Simplificação remove exigências de qualidade exageradas sem tocar em nenhuma feature. Todas as 82 fases permanecem.

---

## Resumo

- **30 itens de over-engineering removidos** (lista abaixo)
- **3 fases movidas pra pós-beta** (77, 78, 79)
- **0 fases removidas** — todas as features permanecem
- **Caminhos corrigidos** em todos os arquivos (paths fantasma → paths reais)
- **Anti-padrões A1-A8 mantidos integralmente**
- **Loop interno (auditoria → plano → execução → conferência) mantido**

---

## Itens removidos — detalhamento

### 1. Mutation testing (stryker)

|                    |                                                                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §7.2                                                                                                                      |
| **Texto original** | "Mutation testing rodado pelo menos 1× pra validar qualidade dos asserts (`stryker` ou similar)."                                               |
| **Ação**           | Removido integralmente                                                                                                                          |
| **Motivo**         | Over-engineering enterprise. Stryker não está instalado no projeto. Golden paths com asserts específicos são suficientes pra solo dev pré-beta. |

### 2. SAST com Semgrep + OWASP ruleset

|                    |                                                                                                        |
| ------------------ | ------------------------------------------------------------------------------------------------------ |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §6.2, `fases-25-82.md` Fase 65                                                   |
| **Texto original** | "SAST básico \| Semgrep com OWASP ruleset" (§6.2); "SAST básico (Semgrep com OWASP ruleset)" (Fase 65) |
| **Ação**           | Removido do PADRAO. Fase 65 simplificada pra "dependency review" apenas.                               |
| **Motivo**         | Semgrep não está instalado. Dependabot + revisão de PR cobre o necessário pra solo dev.                |

### 3. License check (sem GPL)

|                    |                                                                                         |
| ------------------ | --------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §6.2, `fases-25-82.md` Fase 65                                    |
| **Texto original** | "License check \| Sem dependência GPL" (§6.2); "License check (sem GPL)" (Fase 65)      |
| **Ação**           | Removido                                                                                |
| **Motivo**         | Teatro de processo pra projeto solo. Verificação manual ao adicionar deps é suficiente. |

### 4. CODEOWNERS por área crítica

|                    |                                                                             |
| ------------------ | --------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §11.2                                                 |
| **Texto original** | "CODEOWNERS por área crítica (`lib/supabase/`, `lib/domain/`, `app/api/`)." |
| **Ação**           | Removido                                                                    |
| **Motivo**         | Só faz sentido com múltiplos devs. Projeto é solo.                          |

### 5. RUM próprio / Real User Monitoring custom

|                    |                                                                                                                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §10.2                                                                                                                                                                                           |
| **Texto original** | "Métricas de negócio: eventos cravados em schema (signup, lead criado, desafio comprado, check-in feito) — usando PostHog ou Plausible. Web Vitals em produção (RUM básico). Uptime monitoring por endpoint crítico." |
| **Ação**           | Simplificado pra "Sentry + Vercel Analytics. Eventos básicos de negócio rastreados."                                                                                                                                  |
| **Motivo**         | Vercel Analytics já cobre Web Vitals. PostHog/Plausible é complexidade extra desnecessária pré-beta.                                                                                                                  |

### 6. Distributed tracing entre Edge Functions e Next.js

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Arquivo** | Não encontrado explicitamente nos docs                |
| **Ação**    | Não estava no plano — **item não necessitou remoção** |
| **Motivo**  | n/a                                                   |

### 7. Branded types pra todo ID

|                    |                                                                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §1.3, `fase-06-tipagem-estrita.md`                                                                                                 |
| **Texto original** | "Branded types pra IDs: `type ProfessionalId = string & { __brand: 'ProfessionalId' }`" (implícito: todo ID)                                             |
| **Ação**           | Mudado pra "Branded types recomendados pra IDs críticos (ProfessionalId, ClientId). Não obrigatório em todo ID."                                         |
| **Motivo**         | Branded types em todo ID (IntakeId, LeadId, etc.) é overhead sem ganho proporcional. Onde importa é ProfessionalId vs ClientId (evita confundir tenant). |

### 8. Bundle budget cravado em CI por rota com bundlesize

|                    |                                                                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §8.1, §8.2, §11.1                                                                                                                                      |
| **Texto original** | "Bundle por rota \| Budget cravado em CI \| `bundlesize` ou similar; PR falha se passar" (§8.1); "Lighthouse CI dentro do budget" e "Bundle budget dentro do limite" (§11.1) |
| **Ação**           | Removido bundlesize. Mantido Lighthouse CI como verificação.                                                                                                                 |
| **Motivo**         | bundlesize não está instalado. Lighthouse Performance ≥ 90 já pega problemas de bundle.                                                                                      |

### 9. Audit log automático em mutações sensíveis

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Arquivo** | Não encontrado explicitamente nos docs                |
| **Ação**    | Não estava no plano — **item não necessitou remoção** |
| **Motivo**  | n/a                                                   |

### 10. Retenção LGPD declarada por tabela em comment SQL

|                    |                                                                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §5.1, `fases-25-82.md` Fase 67                                                                                                                               |
| **Texto original** | "Retenção LGPD declarada por tabela \| Comment SQL `COMMENT ON TABLE x IS 'retention: {período}'`" (§5.1); "Retenção declarada por tabela (comment SQL + implementação)" (Fase 67) |
| **Ação**           | Removido comment SQL por tabela. Fase 67 simplificada pra privacy policy com lista de processadores.                                                                               |
| **Motivo**         | Comment SQL em cada tabela é burocracia. Privacy policy atualizada + DSR funcional é o que protege legalmente.                                                                     |

### 11. Pentest externo pré-beta (Fase 77)

|                    |                                                                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §6.4, `PLANO_LANCAMENTO.md` §3/§6, `fases-25-82.md`, `RESUMO-DECISOES.md` |
| **Texto original** | "Penetration test antes do beta — Contratado, não DIY." (§6.4); Fase 77 como ⚠️ bloqueando beta |
| **Ação**           | Movido pra pós-beta (parking lot). Não bloqueia mais o beta.                                    |
| **Motivo**         | R$ 5-15k + 2-4 semanas pra projeto solo pré-receita é prematuro. Fazer quando houver tração.    |

### 12. Audit externo de a11y pré-beta (Fase 78)

|                    |                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §9.3, `PLANO_LANCAMENTO.md` §3/§6, `fases-25-82.md`, `RESUMO-DECISOES.md`                        |
| **Texto original** | "Auditor independente valida WCAG 2.2 AA. Achados classificados (P0/P1/P2). P0 e P1 resolvidos antes do beta abrir."   |
| **Ação**           | Removido do PADRAO. Movido pra pós-beta no plano.                                                                      |
| **Motivo**         | R$ 3-10k pra projeto solo pré-receita. Lint jsx-a11y strict + audit manual NVDA/VoiceOver cobre o necessário pra beta. |

### 13. Audit externo de performance (Fase 79)

|                    |                                                                                                          |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PLANO_LANCAMENTO.md` §3/§6, `fases-25-82.md`, `RESUMO-DECISOES.md`                                      |
| **Texto original** | Fase 79 como ⚠️ recomendada                                                                              |
| **Ação**           | Movido pra pós-beta.                                                                                     |
| **Motivo**         | Lighthouse CI + Vercel Analytics cobre o necessário. WebPageTest profissional é nice-to-have pós-tração. |

### 14. ADRs formais pra cada decisão estrutural

|                    |                                                                                     |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §12.1                                                         |
| **Texto original** | Referência implícita a ADRs formais na tabela de docs obrigatórios                  |
| **Ação**           | Explicitado "Decisions (leve, sem ADR formal)" na tabela.                           |
| **Motivo**         | decisions.md leve que já existe é suficiente. ADR formal com template é burocracia. |

### 15. Runbook por alerta

|                    |                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §10.3, §12.3, `fases-25-82.md` Fase 70                                                                         |
| **Texto original** | "Cada alerta tem runbook do que fazer." (§10.3); "O que fazer quando WhatsApp Cloud API cai. Como debugar erro de produção." (§12.3) |
| **Ação**           | Simplificado pra runbook geral simples: Supabase cai, Pagar.me cai, rollback de deploy.                                              |
| **Motivo**         | Runbook por alerta é operação enterprise. Runbook simples com 3-4 cenários cobre solo dev.                                           |

### 16. On-call rotation

|                    |                                                                           |
| ------------------ | ------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §10.3, `fases-25-82.md` Fase 70                     |
| **Texto original** | "On-call definido (mesmo que só fundador no início)."                     |
| **Ação**           | Removido                                                                  |
| **Motivo**         | É solo. O founder é o on-call por definição. Não precisa documentar isso. |

### 17. Backup verificado por restore mensal em staging

|                    |                                                                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §6.3, `fases-25-82.md` Fase 66                                                                                                             |
| **Texto original** | "Backup do Supabase verificado por restore real periodicamente (mensal)." (§6.3); "Backup do Supabase verificado por restore real em ambiente staging" (Fase 66) |
| **Ação**           | Simplificado pra "Confiar no Supabase (Point-in-Time Recovery habilitado)". Fase 66 simplificada pra confirmar PITR + runbook simples.                           |
| **Motivo**         | Supabase Pro inclui PITR. Restore mensal em staging é operação enterprise. Confirmar que PITR está habilitado é suficiente.                                      |

### 18. Cobertura de testes mínima (≥80% lib/domain)

|                    |                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §7.1                                                                         |
| **Texto original** | "Unit (`lib/domain/`) \| ≥ 80% \| Vitest"                                                          |
| **Ação**           | Mudado pra "golden paths + edge cases críticos" sem threshold numérico.                            |
| **Motivo**         | Coverage % é métrica de vaidade. Testar golden paths + edge cases que importam > perseguir número. |

### 19. Contract testing entre frontend e backend

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Arquivo** | Não encontrado explicitamente nos docs                |
| **Ação**    | Não estava no plano — **item não necessitou remoção** |
| **Motivo**  | n/a                                                   |

### 20. axe-core em CI obrigatório

|                    |                                                                                                                                                                                                           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §7.1, §9.2, §11.1, `fases-25-82.md` Fase 75, `fase-24-conferencia-ds.md`                                                                                                            |
| **Texto original** | "axe-core \| 10 rotas críticas \| axe-core via Playwright" (§7.1); "axe-core no CI passando em 10 rotas críticas" (§9.2); "axe-core a11y zero violações" (§11.1); "Falha CI se houver violação" (Fase 75) |
| **Ação**           | Removido como gate de CI. Mantido como verificação manual durante review de a11y. Fase 75 simplificada.                                                                                                   |
| **Motivo**         | `tests/a11y/` nem existe ainda. Lint jsx-a11y strict como error já é gate real. axe-core manual quando a11y rodar é pragmático.                                                                           |

### 21. INP < 200ms cravado

|                    |                                                                                                                              |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §8.1                                                                                                   |
| **Texto original** | "INP \| < 200ms \| RUM"                                                                                                      |
| **Ação**           | Removido                                                                                                                     |
| **Motivo**         | RUM custom não existe. Vercel Analytics monitora INP automaticamente. Lighthouse Performance ≥ 90 já alerta se INP for ruim. |

### 22. Métricas de negócio cravadas em schema PostHog/Plausible

|                    |                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §10.2, `fases-25-82.md` Fase 69                                                                                        |
| **Texto original** | "Métricas de negócio: eventos cravados em schema (...) — usando PostHog ou Plausible." (§10.2)                                               |
| **Ação**           | Simplificado pra "Vercel Analytics configurado. Eventos básicos de negócio rastreados."                                                      |
| **Motivo**         | PostHog/Plausible é mais uma integração pra manter. Vercel Analytics + Sentry cobre o necessário. Eventos básicos inline, sem schema formal. |

### 23. Web Vitals em produção como gate

|                    |                                                                                                                  |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §11.1                                                                                      |
| **Texto original** | "Lighthouse CI dentro do budget" e "Visual regression dentro do threshold" como gates obrigatórios               |
| **Ação**           | Removido Lighthouse e VRT como gates de CI. Mantido tsc, lint, vitest, build como gates reais.                   |
| **Motivo**         | Lighthouse CI e VRT como gates quebram PRs por motivos não-funcionais. Manter como observação, não como blocker. |

### 24. Dependency scanning automático com triagem semanal

|                    |                                                                  |
| ------------------ | ---------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §6.2, `fases-25-82.md` Fase 65             |
| **Texto original** | "Dependency scanning \| Dependabot configurado, triagem semanal" |
| **Ação**           | Mudado pra "Dependabot configurado, revisão manual mensal"       |
| **Motivo**         | Triagem semanal é overhead pra solo dev. Mensal é realista.      |

### 25. Secret scanning em CI com gitleaks

|                    |                                                                        |
| ------------------ | ---------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §6.2                                             |
| **Texto original** | "Secret scanning em CI \| `gitleaks` no GitHub Actions"                |
| **Ação**           | Removido                                                               |
| **Motivo**         | gitleaks não está instalado. .gitignore + revisão de PR cobre secrets. |

### 26. Mutation testing rodado pelo menos 1×

|                    |                            |
| ------------------ | -------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §7.2 |
| **Texto original** | Mesmo que item 1           |
| **Ação**           | Já removido no item 1      |
| **Motivo**         | Mesmo que item 1           |

### 27. Schema diff em CI mostrando mudança visual

|                    |                                                                           |
| ------------------ | ------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §5.4                                                |
| **Texto original** | "Schema diff em CI mostra mudança visualmente no PR."                     |
| **Ação**           | Removido                                                                  |
| **Motivo**         | Tooling que não existe. Migrations via apply_migration já é o fluxo real. |

### 28. Pre-commit hook bloqueia commit com secret

|                    |                                                                    |
| ------------------ | ------------------------------------------------------------------ |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §6.2                                         |
| **Texto original** | "Pre-commit hook \| Husky bloqueia commit com secret detectado"    |
| **Ação**           | Removido                                                           |
| **Motivo**         | Husky não está instalado. .gitignore + revisão de PR é suficiente. |

### 29. SLO declarado por superfície crítica

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Arquivo** | Não encontrado explicitamente nos docs                |
| **Ação**    | Não estava no plano — **item não necessitou remoção** |
| **Motivo**  | n/a                                                   |

### 30. Error budget por rota

|             |                                                       |
| ----------- | ----------------------------------------------------- |
| **Arquivo** | Não encontrado explicitamente nos docs                |
| **Ação**    | Não estava no plano — **item não necessitou remoção** |
| **Motivo**  | n/a                                                   |

---

## Itens que NÃO estavam na lista mas pareceram over-engineering

> **Sugestões adicionais pra revisão do founder.** Não foram removidos — só flaggados.

### S1. jscpd (detecção de duplicação de código)

|                    |                                                                                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Arquivo**        | `PADRAO-IMPECAVEL.md` §1.2 (original)                                                                                                                                |
| **Texto original** | "Comando de detecção: `pnpm exec jscpd --min-tokens 50 --reporters console app/ components/ lib/` (jscpd detecta duplicação de código). Threshold: < 1% duplicação." |
| **Ação tomada**    | **Removido** (jscpd não está instalado no projeto)                                                                                                                   |
| **Sugestão**       | Manter removido. Review de PR pega duplicação melhor que tool.                                                                                                       |

### S2. Fase 28 (Husky + commitlint) como pré-requisito

|                 |                                                                                                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Observação**  | Husky e commitlint não estão instalados. Fase 28 assume instalação. Está correta como fase (instalar), mas o PADRAO assumia que já existiam como infra (§6.2, §11.3). |
| **Ação tomada** | Referências removidas do PADRAO. Fase 28 permanece (é feature de infra).                                                                                              |

### S3. Lighthouse CI como gate no §11.1 original

|                 |                                                                                                                                                                            |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Observação**  | O original listava "Lighthouse CI dentro do budget" e "Visual regression dentro do threshold" como gates obrigatórios de CI. Nenhum dos dois está configurado no CI atual. |
| **Ação tomada** | Removido como gate. Mantido Lighthouse como verificação manual.                                                                                                            |

---

## Correções de caminhos

Além das simplificações, todos os arquivos tiveram caminhos fantasma corrigidos:

| Path fantasma                                     | Path real                                   |
| ------------------------------------------------- | ------------------------------------------- |
| `docs/produto/PADRAO-IMPECAVEL.md`                | `docs/plano-lancamento/PADRAO-IMPECAVEL.md` |
| `docs/produto/design/DESIGN-SYSTEM-FOUNDATION.md` | `docs/core/DESIGN-SYSTEM-FOUNDATION.md`     |
| `docs/produto/posicionamento.md`                  | `docs/core/positioning.md`                  |
| `docs/plano/fases/fase-NN.md`                     | `docs/plano-lancamento/fase-NN.md`          |
| `docs/plano/PLANO_LANCAMENTO.md`                  | `docs/plano-lancamento/PLANO_LANCAMENTO.md` |
| `docs/auditorias/_pendentes/RESUMO-DECISOES.md`   | `docs/plano-lancamento/RESUMO-DECISOES.md`  |

---

## Arquivos editados

| Arquivo                                | Tipo de mudança                                                |
| -------------------------------------- | -------------------------------------------------------------- |
| `PADRAO-IMPECAVEL.md`                  | Reescrita completa — 12 camadas simplificadas                  |
| `PLANO_LANCAMENTO.md`                  | Paths corrigidos, Fases 77-79 movidas pra pós-beta             |
| `RESUMO-EXECUTIVO.md`                  | Paths corrigidos, descrições de camadas atualizadas            |
| `RESUMO-DECISOES.md`                   | Fases 77-79 removidas, contagem atualizada                     |
| `_TEMPLATE.md`                         | Paths corrigidos                                               |
| `fase-05-separacao-camadas.md`         | Path corrigido                                                 |
| `fase-06-tipagem-estrita.md`           | Branded types → recomendação                                   |
| `fase-07-tratamento-erro.md`           | Sem mudança (limpo)                                            |
| `fase-08-i18n-completo.md`             | Sem mudança (limpo)                                            |
| `fase-09-a11y-completo.md`             | Sem mudança (limpo)                                            |
| `fase-20-migracao-headings.md`         | Sem mudança (limpo)                                            |
| `fase-21-migracao-inline-colors.md`    | Sem mudança (limpo)                                            |
| `fase-22-revisao-buttons-excluidos.md` | Sem mudança (limpo)                                            |
| `fase-23-governanca-final-ds.md`       | Sem mudança (limpo)                                            |
| `fase-24-conferencia-ds.md`            | axe-core e Lighthouse → manual, não CI gate                    |
| `fases-10-19-historico.md`             | Sem mudança (histórico)                                        |
| `fases-25-82.md`                       | Fases 65, 66, 67, 68, 69, 70, 73, 75, 77, 78, 79 simplificadas |
| `SIMPLIFICACAO-2026-04-29.md`          | Este arquivo (novo)                                            |

---

## Ajustes pós-revisão do founder

> Founder revisou simplificação e pediu 4 ajustes. Aplicados em 2026-04-29.

### Ajuste 1 — VRT mantido como gate de CI

**Contexto:** A simplificação removeu VRT como gate de CI junto com Lighthouse (item 23). Mas VRT (Playwright) já está configurado e rodando desde a Fase 19. É infra que existe e funciona.

**Ação:** Revertido. VRT volta como gate obrigatório em `PADRAO-IMPECAVEL.md` §11.1. Lighthouse CI continua fora (observação manual).

**Arquivos:** `PADRAO-IMPECAVEL.md` §11.1

### Ajuste 2 — Backup verificado 1× antes do beta

**Contexto:** A simplificação trocou "restore mensal em staging" por "confiar no Supabase". Founder quer meio-termo: confiar no PITR mas fazer 1 restore real antes do beta pra confirmar que funciona.

**Ação:** `PADRAO-IMPECAVEL.md` §6.3 agora diz: "PITR habilitado + 1 restore real antes do beta + documentar procedimento em runbook". Fase 66 atualizada pra incluir o restore.

**Arquivos:** `PADRAO-IMPECAVEL.md` §6.3, `fases-25-82.md` Fase 66

### Ajuste 3 — Checklist anti-leak em review de PR

**Contexto:** A simplificação removeu gitleaks e pre-commit hook mas não colocou nada no lugar. Founder quer checklist mental mínimo.

**Ação:** Adicionado em `PADRAO-IMPECAVEL.md` §6.2: `.env*` no `.gitignore` (verificar uma vez) + busca visual por secrets em review de PR (checklist mental, não tool).

**Arquivos:** `PADRAO-IMPECAVEL.md` §6.2

### Ajuste 4 — Lighthouse manual como pré-requisito do beta

**Contexto:** Lighthouse saiu como gate de CI, mas founder quer que pelo menos 1 rodada manual aconteça antes de abrir o beta.

**Ação:** Adicionado em Fase 82 como pré-requisito de abertura: rodar Lighthouse manualmente em rotas críticas, Performance ≥ 80 geral e ≥ 90 em landing, documentar resultado.

**Arquivos:** `fases-25-82.md` Fase 82
