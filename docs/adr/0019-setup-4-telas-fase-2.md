# 0019. Setup 4 telas é fase 2 SaaS (M5+), não MVP

Date: 2026-05-17
Status: accepted

## Context

Item listado erradamente como pendente por falha de leitura — master plan §17.1 já decide claramente que setup 4 telas é fluxo fase 2 SaaS público. Termo "wizard" em §17.1 é BANIDO (§0.3, §2.3 ESLint, §27.1 BANNED, memória `feedback_no_legacy_vocabulary`). Fonte: `_CONFLITOS.md #19`.

## Decision

**Vocabulário canônico:** `setup` ou `fluxo de setup`. NUNCA `wizard`.

**Master plan §17.1 (fase 2 SaaS público, M5+):**
1. Bem-vindo + escolher vertical/template
2. Brand básico (logo + cor primária)
3. Gerar primeiro programa com IA (3-5min) → AHA MOMENT
4. Convidar primeiros alunos

**Quando.** M5+ (ano 2 — quando signup público abrir conforme gatilhos quantitativos `_CONFLITOS #5`/§0.5.10). NÃO bloqueia M0-M4.

**Regrouping dos 4 fluxos confundidos:**

| Fluxo | Status real | Quando |
|---|---|---|
| A) Self-service signup prof (§17.1) | Existe no plan, fase 2 | M5+ (ano 2) |
| B) Onboarding prof na agência | NÃO existe formalmente — prof recebe tenant pronto via vibe coding interno do fundador, vê dashboard funcional no 1º login (§0.5) | Hoje (agência) |
| C) Signup aluno PWA | Existe — email+senha simples (D-G53), não é "setup 4 telas" | F5 (PWA shell) |
| D) Captação/lead | Existe — funil institucional desafit/agência | M1 |

**Não decidir UX detalhada de nenhum agora.** Entra no doc da etapa correspondente quando chegar (`09-pacote-a.md` pro fluxo D, F5 pro fluxo C, fase 2 SaaS pro fluxo A).

## Consequences

**Positivo:**
- Vocab limpo desde dia 1 (lint enforça)
- Foco M0-M4 não desvia pra feature M5+
- Decisão registrada → não vira pendência fantasma de novo

**Negativo:**
- Risco de Claude Code propor `wizard` em sugestão (lint pega)

**Neutro:**
- Cobertura M5+ em `11-roadmap.md §7`
- Memória `feedback_vocab_check_before_response` registra lição
