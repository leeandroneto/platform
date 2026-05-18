# Mapa — De onde vem cada dado do Relatório

> Atualizado 2026-04-22 — modelo com IA (Haiku 4.5 via tool_use).
> Todo conteúdo narrativo vem de `narrativeSlots` (gerado pela IA). Dados numéricos são determinísticos (engine).

---

## Relatório de Análise — Fluxo de dados

### 1. HeroSection

> _Primeira tela, fundo escuro com foto do profissional_

- **Nome do lead** — `client.firstName` (capitalizado)
- **Rótulo do objetivo** — `objectiveLabel` (em destaque accent)
- **Data** — `createdAt`
- **Heading** — `narrativeSlots.intro.heading` _(IA)_
- **Texto intro** — `narrativeSlots.intro.text` _(IA)_

---

### 2. ObservationsSection

> _Blocos com borda lateral colorida — reflexão personalizada_

- **Título da seção** — `sectionLabels.reflexao` (fallback: "Sobre você")
- **Blocos (2-3)** — `narrativeSlots.reflexao.blocks[]` _(IA)_
  - `title` — título curto (3-6 palavras)
  - `validation` — frase de validação (accent color)
  - `body` — texto narrativo (60-80 palavras)
  - `risk` → cor da borda: `positive`/`neutral` = accent, `high` = laranja
- **Fonte**: IA usa respostas de motivação, dificuldade e personal_note para personalizar

---

### 3. NutritionSection

> _Donut de macros + gota de água + cards de métricas_

#### Dados determinísticos (engine)

- **Donut** — `calculations.proteinTargetG`, `carbTargetG`, `fatTargetG`
- **Gota de água** — `calculations.waterTargetMl`
- **Cards** — `result.metrics[]` (meta_kcal, proteina_g, carb_g, fat_g, imc, etc.)
- **Rodapé** — TDEE e IMC calculados

#### Descrições nos cards (IA)

- `narrativeSlots.contexto_metricas[metricCode]`
- Codes obrigatórios: `meta_kcal`, `proteina_g`, `carb_g`, `fat_g`, `agua_l`, `imc`
- Fallback frontend para `carb_g` e `fat_g` se IA omitir

#### Safety trigger (Q6)

- Se ativado → métricas calóricas = `"—"`, IA não menciona macros

---

### 4. JourneySection

> _Cards de progresso (atual → meta) + timeline_

#### Cards — dados determinísticos

- **Peso** — `client.weightKg → client.targetWeightKg` (se houver meta numérica)
- **IMC** — `calculations.bmi → target saudável` (se diferença ≥ 0.2)
- **Kcal diária** — `calculations.tdee → dailyCalorieTarget` (se não safety)

#### Timeline — determinístico

- `calculations.timelineMonths`, `weeklyRateKg`
- Só aparece se `targetWeightKg` preenchido

#### Textos (IA)

- `narrativeSlots.expectativas.subtitle` — resumo da jornada
- `narrativeSlots.expectativas.timelineNote` — contexto sobre ritmo

#### Quando não tem meta numérica

- Checkbox "Não me importo com números" → cards não aparecem
- A IA ainda pode gerar expectativas baseada no texto qualitativo da meta

---

### 5. PillarsSection

> _3 cards — "Os três pilares"_

- **Título/eyebrow** — `sectionLabels.pillarsHeading` / `pillarsEyebrow`
- **3 blocos** — `narrativeSlots.pilares.blocks[]` _(IA)_
  - `position`, `title`, `subtitle`
  - `popular` — texto acessível (60-80 palavras)
  - `technical` — evidência científica (max 25 palavras)
- **nutritionLevel** afeta os pilares:
  - `full` → pilar de alimentação com macros
  - `tips` → pilar de alimentação leve, sem prescrição
  - `none` → sem pilar de alimentação, substituído por outro relevante

---

### 6. PapelProfissionalSection _(condicional)_

> _Seção sobre o valor do acompanhamento profissional_

- `narrativeSlots.papel_profissional.heading` _(IA, 1ª pessoa)_
- `narrativeSlots.papel_profissional.body` _(IA, 1ª pessoa)_
- Só renderiza se `heading` e `body` não forem vazios

---

### 7. SafetyNote _(condicional)_

> _Banner laranja — "Nota de transparência"_

- Ativado quando Q6 retorna safety trigger
- Conteúdo — `safetyReason` (texto fixo do template)
- Opções que disparam: `dor_existente`, `medo_condicao`, `limitacoes_corpo`, `dores_idade`

---

### 8. ClosingSection

> _Frase emocional + foto do profissional + CTA_

- **Ponte emocional** — `narrativeSlots.ponte.bridge` _(IA, 1ª pessoa)_
- **CTA label** — `narrativeSlots.ponte.ctaLabel` (sem nome do profissional)
- **Foto/nome** — dados do profissional (não da IA)
- **Data** — `createdAt` formatado

---

### 9. Disclaimers

- Texto fixo sobre estimativas, IA, e necessidade de validação profissional

---

### NextStepSheet _(modal)_

> _Aberto pelo botão "Próximo passo"_

- `narrativeSlots.proximo_passo.cta_question` _(IA)_
- `narrativeSlots.proximo_passo.cta_label` _(IA)_
- `narrativeSlots.proximo_passo.sheet_message` _(IA, 1ª pessoa, simula msg WhatsApp)_
- WhatsApp link, Calendly, Meet — dados do profissional

---

## Visão geral: fonte de dados por seção

| Seção               | Dados determinísticos         | Dados IA (narrativeSlots) |
| ------------------- | ----------------------------- | ------------------------- |
| HeroSection         | nome, objetivo, data          | intro.heading, intro.text |
| ObservationsSection | —                             | reflexao.blocks[]         |
| NutritionSection    | métricas, donut, gota         | contexto_metricas         |
| JourneySection      | peso/IMC/kcal cards, timeline | expectativas              |
| PillarsSection      | —                             | pilares.blocks[]          |
| PapelProfissional   | —                             | papel_profissional        |
| SafetyNote          | safetyReason                  | —                         |
| ClosingSection      | foto, nome, links             | ponte                     |
| NextStepSheet       | WA link, calendly             | proximo_passo             |

## Voz e tom

- **1ª pessoa** do profissional em: reflexao, pilares.popular, papel_profissional, ponte, proximo_passo
- **Linguagem condicional**: "tende a", "costuma", "da pra" — nunca "você precisa", "você deve"
- **Nome do profissional**: max 1-2x no relatório inteiro
- **nutritionLevel**: afeta se/como o pilar de alimentação aparece
