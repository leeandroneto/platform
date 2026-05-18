# Pesquisa interna — base pra refatoração das 3 páginas

> Pesquisa rodada no banco em 2026-05-06. Base pra arquitetura em [`07-arquitetura-nova.md`](07-arquitetura-nova.md).

---

## 1. Fontes consultadas

- `prospect_questions` — 38 perguntas ativas (de 60 totais; 22 soft-deleted via `is_active=false`)
- `prospect_professionals` — 3 prospects únicos (Marina/musculação, Leandro/ciclismo, anônimo/ciclismo)
- `ai_prompts` — 4 prompts ativos: `generate-diagnostic.system` v2, `generate-report.system` v1, `generate-site-content.system` v1, `submit-form.system` v4

Amostra de 3 é estatisticamente fraca, mas o prompt v2 é descritivo o suficiente pra inferir o que a IA produz em qualquer perfil.

---

## 2. Discrepâncias detectadas (resolver antes de codar)

### 2.1 Modalidades — banco × CLAUDE.md

| Fonte                           | Lista                                                                  |
| ------------------------------- | ---------------------------------------------------------------------- |
| Banco (`A1.options`)            | musculacao, corrida, ciclismo, crossfit, natacao, **triathlon**, outro |
| CLAUDE.md beta (R$27 × 6 vagas) | musculação, corrida, **pilates**, CrossFit, ciclismo, natação          |

**Decisão:** seguir o banco. Pilates não existe; triathlon existe e o prompt v2 já trata. CLAUDE.md desatualizado (ajustar em fase posterior).

### 2.2 Schema do AI output — doc 05 × prompt v2 real

Doc 05 §2.4 menciona `ato_1_conta_da_hora`...`ato_5_gargalos`. **Não existem** no prompt v2 ativo. O que a IA gera hoje:

```
sumario_executivo, financeiro, camada_captacao, camada_relacionamento,
camada_conversao, camada_gestao, camada_retencao, reconhecimento,
benchmarks_narrativa, plano_acao { fase1, fase2 }
```

A v1 (visível no relatório do Leandro de 27/04) tinha mais helpers visuais (`*_status` crítico/atenção/bom, `*_callout`, `*_pullquote`). A v2 enxugou e removeu.

**Decisão (ver doc 07):** descartar v2 inteira. Não é fix de schema — é redesign da IA.

---

## 3. Prompt v2 atual — o que faz, o que falta

### Voice rules (boas, manter no v3)

- Parágrafos curtos 2-4 frases, nunca bullet
- 1 número por parágrafo no máximo, sempre com contexto
- **Negrito** parcimônia
- Sem motivacional, sem guru, sem promessa garantida
- Cita trechos da resposta: `"Você marcou 'respondo no WhatsApp' — isso te coloca à frente de 60%."`

### Adaptação modalidade (ótima, manter)

- Musculação → "seus alunos", transformação
- Corrida → "seus atletas", pace/volume
- CrossFit → "seus membros", WOD/PR
- Ciclismo → "seus atletas", FTP/watts
- Natação → "seus nadadores", técnica/pace
- Triathlon → "seus triatletas", transição

### O que falha

- **Estrutura genérica** (5 camadas = funil B2B padrão McKinsey/Hubspot/Salesforce)
- **Diluição**: 1500 palavras em 7 sections = nenhum ponto cola
- **IA escreve sobre tudo** mesmo quando 3 sections são vazias pra esse prospect
- **Citações literais não obrigatórias** — viram opcional e a IA pula
- **Plano de ação template-y** (Fase 1 dias 1-30, Fase 2 dias 31-60...) — soa consultoria
- **Lê passivamente** — Marina e ciclista anônimo poderiam trocar respostas e os relatórios continuariam ~70% válidos

---

## 4. Voz real do público (J1 / textareas)

Único campo de texto livre é `J1` ("Algo mais que você queira contar?"). Marina escreveu:

> _"Sinto que tô atendendo bem mas a fila pra entrar é magra. Posto no Instagram quase todo dia mas só vem indicação. Preciso entender o que tô fazendo errado."_

**Linguagem-âncora pra todas as 3 páginas:**

- "fila magra"
- "tô atendendo"
- "só vem indicação"
- "preciso entender o que tô fazendo errado"
- Direto, vulnerável, sem jargão de marketing

**Palavras a evitar (banidas no prompt v3):** transformação, potencialize, empoderamos, escale, alavanque, jornada, mindset, performance (no sentido motivacional).

---

## 5. Padrões na amostra de 3 prospects

Pequena, mas reveladora. Pode virar copy comparativa em `/comecar` ("3 de 3 fundadores marcaram X").

| Pergunta                | Marina                     | Leandro                | Anônimo                | Padrão                     |
| ----------------------- | -------------------------- | ---------------------- | ---------------------- | -------------------------- |
| `E1` site profissional? | nao_tem                    | nao                    | nao                    | **3/3 sem site**           |
| `F3` conversão          | 30-40%                     | 30-40%                 | 30-40%                 | **3/3 no limite inferior** |
| `F4` por que não fecham | preço                      | confiança              | preço                  | misto                      |
| `G1` retenção           | 6-12m                      | 6-12m                  | +2 anos                | **3/3 ≥ 6 meses (forte)**  |
| `D1` canais             | indicação + insta orgânico | + parcerias            | tráfego pago + eventos | misto                      |
| `D6` tráfego pago       | nunca                      | nunca                  | sim regular            | 2/3 nunca testou           |
| `C1` (top travas)       | captar/precificar/reter    | reter/converter/captar | captar/converter/tempo | **"captar" em 3/3**        |

**Insight:** três personas distintas (musculação online, ciclismo presencial premium, ciclismo escala) compartilham o mesmo bottleneck operacional (sem site + conversão limitada + retenção forte). A força (retenção) e a fraqueza (presença digital) são as mesmas independente de modalidade ou maturidade. Isso é a tese do produto, não coincidência.

---

## 6. Inputs disponíveis pra IA personalizar copy

As 38 perguntas viram palanca de copy nas 3 páginas. Mapeamento:

| Resposta                  | Vira em                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `A1` modalidade           | Lingo da página inteira (FTP/pace/WOD/séries/braçadas/transição)    |
| `A2` especialidades       | Sub-tagline ("hipertrofia + emagrecimento")                         |
| `A3` anos atuação         | Reconhecimento ("10 anos formando ciclistas")                       |
| `A4` work model           | Contexto (presencial × online × híbrido)                            |
| `A5` onde trabalha        | Sub-context (academia × estúdio × ar livre)                         |
| `B1`+`B2`+`B5`            | **Cálculo R$/hora** automático — número que prospect nunca calculou |
| `B3` trend receita        | Tom do relatório (crescendo = celebrar; caindo = empatia)           |
| `C1` top travas (multi)   | Multiple anchor points pra padrão cruzado                           |
| `C2` única dor a resolver | Bridge pra `/comecar` ("Você marcou: precisa de captação")          |
| `C3` meta receita         | Math: gap entre atual × meta                                        |
| `C4` o que tentou         | Objection handling AI ("você marcou ferramenta sem usar — entendo") |
| `D1` canais               | Recomendação contextual (sem repetir o que ele já faz)              |
| `D2` volume leads         | Math: leads × conversão = alunos novos/mês                          |
| `E1` site                 | **Hook gigante de `/comecar`** ("Você não tem site — olha o seu")   |
| `F2` velocidade resposta  | Validação ("minutos: à frente de 80%")                              |
| `F4` motivo não fecham    | Sub-narrativa ("você marcou: preço")                                |
| `F5` clareza preço        | Cruzamento com F4 (gold pra padrão invisível)                       |
| `G1` retenção             | Validação ("6-12m: top 30%")                                        |
| `G2` por que saem         | Insight ("somem em silêncio = falta de check-in proativo")          |
| `H2`+`H4`+`H6`+`H7`       | Estado operacional (manual × automatizado)                          |
| `J1` texto livre          | **Citação literal no abertura da carta** — máxima carga emocional   |

A IA tem matéria-prima abundante. O prompt v2 não usa nem metade.

---

## 7. Conclusão pra arquitetura

Forças do estado atual:

- Voice rules do prompt v2 são boas (manter)
- Adaptação modalidade já implementada (estender)
- 38 perguntas dão substrato muito rico (sub-utilizado)

Falhas estruturais:

- Estrutura de 5 camadas é template B2B genérico, não nasce do problema do personal
- Output 1500 palavras em 7 sections dilui o insight
- Falta personalização visual (modalidade muda só lingo, não estética)
- Layout atual lê como dashboard de consultoria, não revista editorial

**Direção:** descartar 5 camadas. Reescrever IA pra produzir UMA carta pessoal de Leandro pro prospect, em 3 movimentos densos (~700 palavras), com citações literais obrigatórias, em formato editorial single-column. Detalhe completo em [`07-arquitetura-nova.md`](07-arquitetura-nova.md).
