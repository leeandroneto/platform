# Relatório IA — fluxo + análise MVP

> **Pergunta central:** os 5 atos do relatório são todos necessários no MVP, ou podemos cortar?
> **Resposta curta:** **manter os 5 atos**. São uma narrativa coesa cravada no schema da IA. Cortar significa retreinar prompt + perder fios narrativos. O que pode reduzir: tamanho/profundidade de cada ato, não a quantidade.

---

## Fluxo atual end-to-end

```
prospect responde formulário (60 perguntas)
        ↓
salva em prospect_professionals (Supabase)
        ↓
gera token público + redireciona /diagnostico/r/[token]/processing
        ↓
edge function: generate-diagnostic (Deno, 266l)
        ↓
   carrega prompt de ai_prompts table (key específica)
   monta user-message.ts (mapa de 50+ campos das respostas)
   chama Anthropic via call-anthropic.ts
   recebe ReportNarrative (5 atos + metadados)
   persiste em prospect_professionals.report
        ↓
prospect vê /diagnostico/r/[token]
        ↓
componente AuditReport renderiza:
  - CoverSection
  - MethodIntroSection
  - LayerSection (loop por 5 camadas)
  - AuditAnalysis (orchestrator dos 5 atos)
      → HeroSection (validação emocional)
      → Ato1Section — "conta da hora"
      → Ato2Section — "gap"
      → Ato3Section — "radar"
      → BridgeSection (transição narrativa)
      → Ato4Section — "vazamentos"
      → Ato5Section — "gargalos"
  - ClosingSection (CTA pra /comecar)
```

---

## Os 5 atos — para que servem

| Ato       | Schema field          | Função narrativa                                                                                              | Insumo do form                                         |
| --------- | --------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| **Ato 1** | `ato_1_conta_da_hora` | "Quanto sua hora vale REAL?" — calcula receita ÷ horas trabalhadas. Choca o profissional com o número.        | B1 alunos × B2 ticket ÷ B5 horas                       |
| **Ato 2** | `ato_2_gap`           | "Diferença entre onde está e meta de 12 meses." — concretiza o salto necessário.                              | B1, B2 vs C3 (meta)                                    |
| **Ato 3** | `ato_3_radar`         | "Radar das 5 camadas: Captação / Presença / Conversão / Retenção / Gestão." — mostra onde está fraco/forte.   | Score por bloco D, E, F, G, H                          |
| **Ato 4** | `ato_4_vazamentos`    | "Onde você está perdendo dinheiro hoje." — identifica leakage (baixa retenção, taxa de fechamento ruim, etc.) | Cruza F3 (fechamento) + G1 (permanência) + G2 (saídas) |
| **Ato 5** | `ato_5_gargalos`      | "O que está te travando." — bottleneck principal (tempo, captação, ticket).                                   | C1 (dores) + B5 (horas) + D2 (volume)                  |

**Cada ato é independente narrativamente** — não é "passo 1 → passo 2 → passo 3", é "5 ângulos do mesmo diagnóstico". O profissional pode ler em qualquer ordem e ainda fazer sentido.

---

## Sections complementares (não-IA)

| Section         | Componente            | Conteúdo                                                                                    |
| --------------- | --------------------- | ------------------------------------------------------------------------------------------- |
| **Cover**       | `CoverSection`        | Capa: nome do profissional, modalidade, data                                                |
| **MethodIntro** | `MethodIntroSection`  | "Como esse diagnóstico funciona" — explicação do método 5 camadas                           |
| **Layer** (×5)  | `LayerSection` (loop) | Score detalhado por camada (Captação, Presença, Conversão, Retenção, Gestão) com benchmarks |
| **Hero**        | `HeroSection`         | Boas-vindas dentro do AuditAnalysis ("Olá, [nome]")                                         |
| **Bridge**      | `BridgeSection`       | Transição narrativa entre Ato 3 e Ato 4                                                     |
| **Closing**     | `ClosingSection`      | CTA pra `/comecar` ou WhatsApp do profissional                                              |

---

## Análise — o que dá pra simplificar?

### NÃO mexer (estrutura central)

- 5 atos do AI output — mexer = retreinar prompt + revalidar
- Cover + Hero + Closing — essenciais pra UX

### Pode encurtar (mesma estrutura, menos texto)

- **MethodIntroSection** — hoje é uma página inteira explicando o método. Reduzir pra 3-4 parágrafos.
- **LayerSection** (×5) — hoje cada camada renderiza score + comparativo + insights. Reduzir pra score + 1 insight curto.
- **BridgeSection** — texto de transição entre atos 3 e 4. Pode virar 1 frase.
- **Atos 1-5** — ajustar prompt da IA pra gerar texto mais conciso (ex: max 150 palavras por ato em vez de 300).

### Pode cortar do MVP (deferred)

- Nada estrutural. Tudo é parte da experiência completa.

### Recomendação visual

- Mobile: cada ato vira 1 "tela" full-height com swipe horizontal entre eles (estilo Instagram Stories). Reduz percepção de "muito conteúdo".
- Desktop: scroll vertical com ato grudando no topo (sticky) durante leitura.

---

## Plano de ação MVP — relatório

### Etapa 1 — encurtar prompt (sem mexer no schema)

1. Editar prompt em `ai_prompts` table:
   - Adicionar instruções de "máximo X palavras por ato"
   - Adicionar "tom 1ª pessoa do profissional, não da IA"
   - Cortar instruções relacionadas a perguntas removidas (ver `01-formulario-mapa.md`)
2. Atualizar `user-message.ts`:
   - Remover refs a A2_text, A6, B6, D3-D8 sub, E4, F6, G3, G6, H1, H3, H5, I\*
   - Consolidar D consolidado em texto único

### Etapa 2 — refinar componentes (visual)

1. `MethodIntroSection` — encolher copy de N parágrafos pra 3-4
2. `LayerSection` — reduzir cada camada (de ~300px → ~150px)
3. `BridgeSection` — virar 1 frase + ilustração
4. `AuditAnalysis` — repensar layout mobile (swipe stories vs scroll)

### Etapa 3 — copy alinhada ao beta

- Tirar referências a features inexistentes ("integração com X", "automação Y")
- Trocar "a IA detectou" → "eu vi que..."
- Closing pro CTA `/comecar` deve ser objetivo: "30 fundadores, R$27 vitalício, 12 meses"

---

## Decisões pendentes

- [ ] Aprovar manter 5 atos (vs cortar pra 3-4)?
- [ ] Aprovar reduzir tamanho de cada ato (max 150 palavras)?
- [ ] Aprovar swipe horizontal mobile vs scroll vertical?
- [ ] Aprovar tom 1ª pessoa profissional (vs 3ª pessoa IA)?
- [ ] Quem vai escrever a copy do MethodIntroSection encolhido?
