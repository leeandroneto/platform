# Decisões cravadas — MVP Final

> Log das decisões aprovadas pelo fundador.

---

## ✅ Aplicado em 2026-05-05 — Round 2 (copy v2)

### 6. Prompt IA v2 — APLICADO

`ai_prompts.generate-diagnostic.system` agora versão 2:

- Tom co-criação beta (consultor 1ª pessoa, não McKinsey)
- Atos curtos (150-220 palavras cada vs 400-600)
- Plano ação 2 fases × 2 ações (vs 3 × 3)
- Total: ~1500 palavras vs ~3500
- max_tokens 6000 (vs 8192)

### 7. Microcopy formulário — APLICADO

36 perguntas ativas reescritas em tom conversacional:

- "Quais suas maiores dificuldades HOJE?" → "O que mais te trava hoje?"
- "Qual seu ticket médio mensal por aluno?" → "Quanto cobra em média por aluno/mês?"
- "Tem programa de indicação?" → "Você incentiva indicação dos alunos?"
- 6 subtítulos novos com explicação ("Sem julgamento — quanto mais sincero, melhor")

### 8. Copy v2 do `/lancamento` — APLICADA (i18n)

- Hero: "Pare de perder leads no Direct."
- Eyebrow: "BETA · 30 VAGAS"
- Subtitle: 1 frase de promessa clara
- Problem section condensada: 3 linhas → 2 linhas

### 9. Copy v2 do `/comecar` — APLICADA (i18n)

- Hero personalizado: "{firstName}, o que você acabou de viver é o que seu aluno vai viver"
- Founder quote: "Não é mais um SaaS. É feito junto com vocês — por isso vitalício"
- Section "Você é fundador" reescrita com storytelling "construir junto"
- Lista próximas features votáveis: treinos auto, cobrança, agenda, comunidade
- Pricing: "R$27/mês. Pra sempre" + clareza do compromisso
- Critical point: "30 vagas. Sem extensão" + consequência clara

---

## ⏸ Pendente (próxima iteração — token-bound)

- [ ] Cortar 10 sections do `/comecar` orchestrator (`ActivationPage.tsx`): manter Hero, Reflexo, ProntoHoje (4 cards), VocêÉFundador, FounderProof, PricingSection. Remover: TemplateSection, AddonsActivation, TrafficSection, BetaGroup separado, MetricsBar, MidCta extra, FormPreview, SiteSection, DashboardSection, WhatsAppSection.
- [ ] Cortar 4 sections do `/lancamento` orchestrator (`LaunchPage.tsx`): manter Hero, Problem, Method (3 passos), Beta+Prova, FinalCTA. Remover: ProductPreview detalhado, Pricing isolado, Roadmap, LaunchFAQ.
- [ ] Adicionar motion fluido na transição entre sections do /comecar (Motion 12 fade+slide-up no scroll).
- [ ] Mockup novo na section "Você é fundador" (lista visual com checkboxes votáveis).
- [ ] Testar relatório IA real — comparar v1 vs v2 (tom + tamanho).
- [ ] Pré-existente: reescrever sections do site `/[slug]` (Wave 16).

---

## ✅ Aplicado em 2026-05-05 — Round 1 (estrutura)

### 1. Bug crítico do mapping de IDs IA — CORRIGIDO

**Problema:** `supabase/functions/generate-diagnostic/_ai/user-message.ts` usava IDs antigos (C1-C8 pra captação, D1-D6 pra presença, E1-E6 pra conversão, F1-F6 pra gestão, H1-H6 pra aspirações) que não batiam com o schema atual do banco. A IA recebia dados com labels errados desde algum redesign do schema.

**Fix:** reescrito `user-message.ts` mapeando os IDs corretos:

- `<profissional>` → A1, A2, A3, A4, A5
- `<escala_atual>` → B1, B2, B3, B4, B5
- `<dores_aspiracoes>` → C1, C2, C3, C4
- `<captacao>` → D1, D2, D6, D7, D8
- `<presenca_digital>` → E1, E2, E3
- `<conversao>` → F1, F2, F3, F4, F5
- `<retencao>` → G1, G2, G4, G5
- `<gestao_operacao>` → H2, H4, H6, H7

### 2. Cortes do formulário v2 conservadora — APLICADOS

**Migration:** `prune_prospect_questions_v2_mvp` (Supabase, 2026-05-05).

Adicionada coluna `prospect_questions.is_active` (default true). Soft-delete de 22 perguntas:

| Bloco | IDs cortados                                                                        |
| ----- | ----------------------------------------------------------------------------------- |
| A     | A2_text (duplicata), A6 (nutrição não usada na IA)                                  |
| B     | B6 (distribuição inferível)                                                         |
| D     | D3_usa, D3, D4, D5 (sub-perguntas Instagram), D6b, D6c, D6d, D6e (sub-tráfego pago) |
| E     | E4 (fotos/vídeos — fundador beta sem material)                                      |
| F     | F6 (aula experimental — não universal)                                              |
| G     | G3 (sobrepõe G4), G6 (comunidade — não foco beta)                                   |
| H     | H1 (uso de IA), H3 (vídeos demo), H5 (sessões online)                               |
| I     | bloco inteiro (I1, I2, I3, I4 — survey de produto, não diagnóstico)                 |

**Resultado:** 60 → 38 perguntas ativas. Confirmado via SQL (`COUNT FILTER WHERE is_active = true → 38`).

### 3. Filtro pro frontend pegar só perguntas ativas — APLICADO

`lib/data/prospect-questions.ts` agora filtra `.eq('is_active', true)`.

### 4. Tipos do Supabase atualizados — APLICADO

`lib/types/database.ts`: adicionado `is_active: boolean` em Row, Insert e Update do schema `prospect_questions`. (Manual — não rodei `generate_typescript_types` pra evitar regravar arquivo grande.)

### 5. Edge function deployed — APLICADO

`generate-diagnostic` versão 27 ACTIVE. Inclui:

- `index.ts` (orchestrator)
- `_ai/user-message.ts` (com mapping corrigido)
- `_ai/call-anthropic.ts`
- `_ai/types.ts`
- `_shared/ai-prompt.ts`
- `_shared/response.ts`

---

## ⚠️ Próximos testes manuais (recomendado)

1. Preencher 1 formulário real ponta-a-ponta em `/diagnostico` e validar que:
   - Frontend mostra 38 perguntas (não 60)
   - Edge function gera relatório com narrativa coerente (não desalinhada)
   - `prospect_professionals.report_result` salva narrativa correta

2. Comparar 2-3 relatórios antes/depois pra ver se IA melhorou em qualidade de insights (com mapping correto deve ficar muito melhor).

3. Se IA der pau ("missing field" ou similar), provavelmente prompt em `ai_prompts` table referencia algum campo cortado. Investigar e ajustar.

---

## ⏸ Pendentes pra Wave 16 (próxima rodada)

- [ ] Editar prompt em `ai_prompts` (key=`generate-diagnostic.system`, version=2) — encolher tom, garantir 1ª pessoa do profissional
- [ ] Refinar componentes visuais do relatório (`MethodIntroSection`, `LayerSection`, `BridgeSection`) — encolher conteúdo
- [ ] Polir `/diagnostico` (formulário público) — UX mobile-first, microcopy
- [ ] Polir `/comecar` (landing 30 fundadores) — aproveitar respostas do prospect na copy
- [ ] Polir site premium `/[slug]` — corte de sections (Stats, Ticker, Results, Testimonials)
- [ ] Esconder rotas avançadas do menu dashboard (CRUDs)

---

## ⏸ Decisões pendentes — relatório (referenciar `02-relatorio-fluxo.md`)

- [ ] Manter 5 atos do AuditAnalysis (recomendado: SIM)
- [ ] Reduzir tamanho de cada ato (max 150 palavras)?
- [ ] Mobile: swipe stories vs scroll vertical?
- [ ] Tom 1ª pessoa profissional vs 3ª pessoa IA — depende de editar prompt no banco

---

## ⏸ Decisões pendentes — copy

- [ ] Quem escreve copy nova (fundador, agência, IA)?
- [ ] Tom: "estamos construindo juntos" vs "produto pronto"?
- [ ] Objeções principais nas 30 vagas: preço? compromisso 12 meses? medo de produto incompleto?
