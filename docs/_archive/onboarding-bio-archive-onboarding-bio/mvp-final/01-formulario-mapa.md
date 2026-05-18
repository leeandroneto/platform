# Formulário do prospect — mapa + v2

> **Fonte:** tabela `prospect_questions` no Supabase (medido 2026-05-05).
> **Total atual:** 60 perguntas em 10 blocos.
> **Total v2 conservadora:** ~38 perguntas em 8 blocos (-37%).
> **Princípio:** preservar contexto que a IA usa pra gerar os 5 atos. Cortar só perguntas que (a) não entram no prompt da IA, (b) são redundantes, (c) são sobre features que não existem no MVP.

---

## Estado atual (60 perguntas)

| Bloco       | Label               | N   | IDs                                                        |
| ----------- | ------------------- | --- | ---------------------------------------------------------- |
| **A**       | Perfil Profissional | 7   | A1, A2, A2_text, A3, A4, A5, A6                            |
| **B**       | Escala do Negócio   | 6   | B1, B2, B3, B4, B5, B6                                     |
| **C**       | Dores & Aspirações  | 4   | C1, C2, C3, C4                                             |
| **D**       | Captação            | 13  | D1, D2, D3_usa, D3, D4, D5, D6, D6b, D6c, D6d, D6e, D7, D8 |
| **E**       | Presença Digital    | 4   | E1, E2, E3, E4                                             |
| **F**       | Conversão           | 6   | F1, F2, F3, F4, F5, F6                                     |
| **G**       | Retenção            | 6   | G1, G2, G3, G4, G5, G6                                     |
| **H**       | Gestão & Operação   | 7   | H1, H2, H3, H4, H5, H6, H7                                 |
| **I**       | Ferramentas         | 4   | I1, I2, I3, I4                                             |
| **closing** | Fechamento          | 3   | J1, contact, consent                                       |

**Algumas perguntas são condicionais** (D3_usa→D3..D5; D6→D6b/c/d/e), então prospect responde ~40-45 efetivas.

---

## Análise — quais entram no prompt da IA?

Base: `supabase/functions/generate-diagnostic/_ai/user-message.ts`. O prompt mapeia:

| Categoria no prompt   | IDs usados                                                                                        | Cobertura   |
| --------------------- | ------------------------------------------------------------------------------------------------- | ----------- |
| `<profissional>`      | A1, A2, A2_text, A3, A4, A5                                                                       | 6 perguntas |
| `<escala_do_negocio>` | B1, B2, B3, B4, B5, B6                                                                            | 6           |
| `<captacao>`          | D1, D2, D3-D8 (instagram/tráfego/grátis/indicação)                                                | 8-13        |
| `<presenca_digital>`  | E1, E2, E3, E4                                                                                    | 4           |
| `<conversao>`         | F1, F2, F3, F4, F5, F6                                                                            | 6           |
| `<gestao_operacao>`   | H1, H2, H4, H6, H7 + uso de IA                                                                    | 5-6         |
| `<retencao>`          | G1, G2, G3, G4, G5, G6                                                                            | 6           |
| `<aspiracoes>`        | C1, C2, C3, C4                                                                                    | 4           |
| **NÃO usado pela IA** | A6 (nutrição), H3 (vídeos demo), H5 (sessões online), I1-I4 (ferramentas/preço), J1 (texto livre) | 6+          |

**Achado importante:** ~6 perguntas não alimentam o prompt (bloco I inteiro + algumas isoladas). Cortar essas é grátis.

---

## v2 conservadora (~38 perguntas)

### Cortes propostos por bloco

#### Bloco A — Perfil Profissional (7 → 5)

- ❌ **A2_text** — duplicata de A2 (descreve modalidade/especialidades). A2 já dá lista, A2_text só adiciona ruído pra IA.
- ❌ **A6** — nutrição/suplementação. Não vai pro prompt principal. Vira responsabilidade do profissional decidir pós-conversão.
- ✅ Mantém: A1 (modalidade), A2 (especialidades), A3 (tempo), A4 (modelo), A5 (cidade)

#### Bloco B — Escala do Negócio (6 → 5)

- ❌ **B6** — distribuição atendimento vs admin. Pode ser inferido por B5 + número de alunos.
- ✅ Mantém: B1, B2, B3, B4, B5

#### Bloco C — Dores & Aspirações (4 → 4)

- ✅ Mantém todas. Bloco curto e essencial pra narrativa.

#### Bloco D — Captação (13 → 7) — maior corte

- ❌ **D3_usa, D3, D4, D5** — sub-perguntas Instagram. Consolidar em 1 pergunta combinada ("Como você usa Instagram profissionalmente?" com opções Não uso / Uso pouco / Uso pesado / Já viralizei).
- ❌ **D6b, D6c, D6d, D6e** — sub-perguntas tráfego pago. Consolidar em 1 pergunta ("Tráfego pago?" com opções e textfield opcional).
- ✅ Mantém: D1 (canais), D2 (volume mensal), D6 (tráfego pago consolidado), D7 (oferta gratuita), D8 (indicação)

#### Bloco E — Presença Digital (4 → 3)

- ❌ **E4** — fotos/vídeos de transformação. Fundador beta provavelmente não tem.
- ✅ Mantém: E1 (site), E2 (link bio), E3 (depoimentos)

#### Bloco F — Conversão (6 → 5)

- ❌ **F6** — aula experimental. Não é universal entre modalidades (pilates faz, treinador online não).
- ✅ Mantém: F1, F2, F3, F4, F5

#### Bloco G — Retenção (6 → 4)

- ❌ **G3** — acompanhamento fora das sessões. Sobrepõe com G4 (medição de progresso).
- ❌ **G6** — comunidade entre alunos. Não é foco do beta.
- ✅ Mantém: G1, G2, G4, G5

#### Bloco H — Gestão & Operação (7 → 4)

- ❌ **H1** — uso de IA. Vai pro prompt mas o output é genérico ("usa ChatGPT pra X"). Custo > valor.
- ❌ **H3** — vídeos demo. Não vai pra IA.
- ❌ **H5** — sessões online. Não vai pra IA.
- ✅ Mantém: H2 (treinos), H4 (agenda), H6 (cobrança), H7 (financeiro)

#### Bloco I — Ferramentas (4 → 0)

- ❌ **I1, I2, I3, I4** — bloco inteiro é "o que você quer no produto?". Não é diagnóstico, é pesquisa de produto. Cortar do funil; mover pra survey separado pós-onboarding pros 30 fundadores.

#### Bloco closing (3 → 3)

- ✅ Mantém todas: J1 (texto livre), contact (email/whatsapp), consent.

---

## Resumo das mudanças

| Bloco     | Hoje   | v2     | Cortados                                     |
| --------- | ------ | ------ | -------------------------------------------- |
| A         | 7      | 5      | A2_text, A6                                  |
| B         | 6      | 5      | B6                                           |
| C         | 4      | 4      | —                                            |
| D         | 13     | 7      | D3-D8 sub-perguntas (consolidar 2 perguntas) |
| E         | 4      | 3      | E4                                           |
| F         | 6      | 5      | F6                                           |
| G         | 6      | 4      | G3, G6                                       |
| H         | 7      | 4      | H1, H3, H5                                   |
| **I**     | **4**  | **0**  | **bloco inteiro**                            |
| closing   | 3      | 3      | —                                            |
| **Total** | **60** | **40** | **-33%**                                     |

Considerando consolidação de D (instagram + tráfego viram 2 perguntas), prospect responde **~38-40 perguntas efetivas**.

---

## Implementação (quando aprovado)

1. Migration `2026MMDDHHMMSS_prune_prospect_questions_v2.sql`:
   - DELETE das ~22 perguntas removidas (cuidado: podem ter respostas históricas — usar UPDATE `is_active=false` em vez de DELETE)
   - INSERT/UPDATE das 2 perguntas consolidadas de Captação (instagram_combined, traffic_combined)
2. Atualizar `supabase/functions/generate-diagnostic/_ai/user-message.ts` — remover refs aos IDs cortados, ajustar consolidados.
3. Atualizar prompt em `ai_prompts` table — remover instruções pra campos cortados.
4. Re-treinar/testar IA com formulário reduzido. Comparar 5 atos antes vs depois — se qualidade cair, restaurar perguntas críticas.

---

## Decisões pendentes

- [ ] Aprovar lista de cortes acima
- [ ] Decidir se bloco I vai pra survey separado ou some completamente
- [ ] Decidir se D consolidado mantém textarea opcional ("conta mais sobre seu Instagram")
- [ ] Validar com 1-2 prospects reais o tempo de preenchimento (~5 min é ideal)
