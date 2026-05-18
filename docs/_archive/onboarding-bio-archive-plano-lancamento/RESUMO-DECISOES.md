# Decisões pendentes consolidadas

> **6 fases marcadas com ⚠️ no plano.** Este doc consolida o que precisa ser decidido pra cada uma virar executável.
> Decisões podem ser tomadas em qualquer ordem (independentes entre si). Algumas bloqueiam o beta — marcadas como **BLOQUEIA BETA**.
> **Nota:** Fases 77, 78, 79 movidas pra pós-beta (simplificação 2026-04-29). Não bloqueiam mais.

---

## Fase 36 — Validação clínica dos 5 templates BLOQUEANTES

**Templates:** gestante, terceira idade, reabilitação, águas abertas, ironman.

**Pergunta:** quem valida e como documenta?

**Opções:**

- Pri Ortiz valida todos (precisa tempo dela + assinatura)
- CREF especializado contratado por template (R$ 500-2k cada)
- Grupo (Pri + 2-3 outros)

**Decisão precisa incluir:** quem, modelo de documento, onde arquiva, prazo.

**Bloqueia:** Fase 35 (migração 33 templates), Fase 39 (seed do "21 Dias")

---

## Fase 39 — Seed do template "21 Dias Mais Leve" (Pri Ortiz)

**Pergunta:** qual o conteúdo final do template?

Precisa de:

- Cronograma dos 21 dias (componentes, dependências, agendamento)
- Mensagens diárias (5/dia × 21 = 105 mensagens; ou usar template + variáveis)
- Descrição da landing pública
- Materiais (PDFs, vídeos, áudios)
- Critérios de gamificação/marcos

**Você + Pri produzem.** Não dá pra agente inventar conteúdo clínico.

**Bloqueia:** primeiro desafio rodando (Fase 47+), beta de Produto 2

---

## Fase 43 — Hospedagem de vídeo

**Pergunta:** Mux, Cloudflare Stream, Bunny Stream, YouTube unlisted ou Vimeo Pro?

| Opção             | Custo                                       | Recomendação                 |
| ----------------- | ------------------------------------------- | ---------------------------- |
| Mux               | $1/h encoded + $0.0028/min visto            | Premium, escala caro         |
| Cloudflare Stream | $5/1k min armazenado + $1/1k min visto      | Custo previsível             |
| **Bunny Stream**  | $0.005/GB transferido + $0.01/GB armazenado | **Recomendado pra MVP**      |
| YouTube unlisted  | Grátis                                      | Marca vaza, anúncios         |
| Vimeo Pro         | $20/mês                                     | Custo fixo, limite de upload |

**Recomendação cravada:** Bunny Stream pra MVP. Migrar pra Mux se volume passar de 100h/mês.

**Bloqueia:** Fase 49 (onboarding com aula inicial)

---

## Fase 44 — CNAE 74.90-1/04 no CNPJ

**Pergunta:** quando você adiciona o CNAE no contador?

- Custo: R$ 100-200
- Prazo: 5-15 dias úteis

**Bloqueia:** Fase 46 (Pagar.me + split). **BLOQUEIA Produto 2 inteiro.**

---

## Fase 80 — Audit jurídico **BLOQUEIA BETA**

**Pergunta:** qual advogado? quando?

Revisar: ToS, Privacy Policy, DPA com Supabase, processadores listados, processo de DSR funcional, fluxo de breach notification.

- Custo típico: R$ 3.000 - R$ 8.000 pra revisão completa
- Tempo: 2-4 semanas

**Decisão:** advogado especializado em SaaS/LGPD, prazo, escopo.

**Bloqueia:** Fase 82 (abrir beta legalmente protegido).

---

## Fase 82 — Critérios de saída do beta

**Pergunta:** o que define "beta concluído, abrir geral"?

Sugestões cravadas pra você revisar:

| Critério                          | Valor sugerido         |
| --------------------------------- | ---------------------- |
| Vagas P1 preenchidas              | 50/50 (vitalício R$47) |
| MRR mínimo P1                     | R$ 2.350               |
| NPS P1                            | ≥ 50                   |
| Churn P1                          | < 5%/mês               |
| Pelo menos 1 desafio P2 rodando   | sim                    |
| Bugs P0 abertos                   | 0                      |
| Bugs P1 abertos                   | < 3                    |
| Tempo médio até primeira ativação | < 7 dias               |

**Decisão sua:** quais desses critérios cravar, quais ajustar, quais adicionar.

---

## Sequência sugerida pra tomar decisões

**Bloqueiam beta (decidir AGORA pra ter prazo):**

1. **Fase 44 — CNAE** (5-15 dias, ação operacional simples)
2. **Fase 80 — Audit jurídico** (2-4 semanas, contratar logo)

**Bloqueiam features de Produto 2 (decidir antes da Fase 35):** 3. **Fase 36 — Validação clínica** (depende de Pri Ortiz) 4. **Fase 39 — Seed "21 Dias"** (depende de você + Pri) 5. **Fase 43 — Hospedagem vídeo** (decisão técnica simples)

**Decidir mais perto do beta:** 6. **Fase 82 — Critérios saída beta** (quando estiver mais claro do produto real)
