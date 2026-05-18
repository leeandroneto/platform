# Diagnostico de Negocio B2B — Mapeamento Completo de Perguntas

> **Contexto**: este NAO e um formulario de link-in-bio. E uma analise de negocio B2B (nos → profissional) com profundidade de consultoria. O profissional investe ~8 minutos e recebe um relatorio que justifica o tempo. Cada pergunta alimenta dados para o relatorio E para nossa inteligencia comercial.

> **Estrutura deste documento**:
>
> 1. Mermaid puro (visualizacao de fluxo, perguntas e opcoes) — sem texto explicativo
> 2. Justificativas detalhadas (por que cada pergunta, por que cada opcao, o que alimenta)

> **Fonte de verdade**: `mm.md` — este documento e o espelho estruturado/justificado do mm.md. Em caso de divergencia, o mm.md prevalece.

---

## PARTE 1 — FLUXOGRAMA COMPLETO

```mermaid
flowchart TD
    Start([INICIO<br/>Diagnostico gratuito<br/>do seu negocio]) --> INTRO

    subgraph ENTRADA [" ENTRADA "]
        direction TB
        INTRO[Tela 1 · Intro<br/>Headline + descricao + CTA Comecar]
        INTRO --> OVERVIEW[Tela 2 · Overview<br/>8 min em destaque + lista dos 9 blocos<br/>CTA Iniciar diagnostico]
    end

    OVERVIEW --> BLOCO_A

    %% ═══════════════════════════════════════
    %% BLOCO A — PERFIL PROFISSIONAL
    %% ═══════════════════════════════════════

    subgraph BLOCO_A [" BLOCO A · PERFIL PROFISSIONAL "]
        direction TB

        A1{A1 · Modalidade principal<br/>+ especialidades<br/>single_choice + multi-select}

        A1 -->|musculacao| A1_musc[Musculacao / Personal<br/>─────────────────<br/>Emagrecimento · Hipertrofia<br/>Disposicao e saude geral<br/>Fisiculturismo · Terceira idade 60+<br/>Gestante/pos-parto · Reabilitacao<br/>Funcional/movimento]

        A1 -->|corrida| A1_corr[Corrida / Assessoria<br/>─────────────────<br/>Recreativa/comecar · 5K/10K<br/>Meia-maratona 21K · Maratona 42K<br/>Trail/Ultra · Reabilitacao de corredor]

        A1 -->|ciclismo| A1_cicl[Ciclismo<br/>─────────────────<br/>Recreativo/comecar · Road/Speed<br/>MTB · Gravel · Indoor/Zwift]

        A1 -->|crossfit| A1_cf[CrossFit<br/>─────────────────<br/>Iniciante/Fitness · Performance/Competitor<br/>Masters 40+ · Feminino/objetivos de forma]

        A1 -->|natacao| A1_nat[Natacao<br/>─────────────────<br/>Adulto iniciante · Fitness/condicionamento<br/>Competitivo · Aguas abertas · Masters]

        A1 -->|triathlon| A1_tri[Triathlon<br/>─────────────────<br/>Sprint/Olimpico · Meio Ironman 70.3<br/>Ironman 140.6 · Aquathlon/Duathlon]

        A1 -->|outro| A1_out[Outra · textarea]

        A1_musc --> A2
        A1_corr --> A2
        A1_cicl --> A2
        A1_cf --> A2
        A1_nat --> A2
        A1_tri --> A2
        A1_out --> A2

        A2[A2 · Ha quanto tempo voce atua?<br/>texto livre · ex: 6]

        A2 --> A3{A3 · Como voce trabalha?<br/>single_choice}
        A3 -->|presencial| A3a[Presencial]
        A3 -->|online| A3b[Online]
        A3 -->|hibrido| A3c[Hibrido presencial+online]

        A3a --> A4
        A3b --> A4
        A3c --> A4

        A4[A4 · Onde voce trabalha?<br/>multi-select<br/>─────────────────<br/>Academia / clube / box<br/>Studio ou espaco proprio<br/>Na casa do aluno<br/>Ao ar livre / espacos publicos<br/>Sem local fixo / 100% online]

        A4 --> A5[A5 · Orienta alimentacao / suplementacao?<br/>single_choice<br/>─────────────────<br/>Sim, acompanhamento nutricional completo<br/>Orientacoes gerais sem prescrever<br/>Indico nutricionista e trabalho em parceria<br/>Nao me envolvo com alimentacao]
    end

    %% CHECKPOINT 1 · 15%

    BLOCO_A --> BLOCO_B

    %% ═══════════════════════════════════════
    %% BLOCO B — ESCALA DO NEGOCIO
    %% ═══════════════════════════════════════

    subgraph BLOCO_B [" BLOCO B · ESCALA DO NEGOCIO "]
        direction TB

        B1[B1 · Quantos alunos ativos voce tem?<br/>texto livre · ex: 12]

        B1 --> B2[B2 · Ticket medio mensal por aluno<br/>single_choice<br/>─────────────────<br/>Ate R$150/mes<br/>R$150-250/mes<br/>R$250-400/mes<br/>R$400-600/mes<br/>R$600-900/mes<br/>R$900-1.500/mes<br/>Acima de R$1.500/mes]

        B2 --> B3{B3 · Tendencia de receita<br/>single_choice}
        B3 -->|crescendo| B3a[Crescendo mes a mes]
        B3 -->|estavel| B3b[Estavel ha meses]
        B3 -->|caindo| B3c[Caindo / perdi alunos]
        B3 -->|irregular| B3d[Sobe e desce sem padrao]

        B3a --> B4
        B3b --> B4
        B3c --> B4
        B3d --> B4

        B4[B4 · Fontes de renda<br/>multi-select<br/>─────────────────<br/>Atendimento individual<br/>Turmas / grupos<br/>Assessoria online<br/>Vinculo CLT academia/clube/box<br/>Cursos workshops ou eventos<br/>Programas digitais planilhas/cursos gravados]

        B4 --> B5[B5 · Horas/semana atendendo alunos<br/>texto livre · ex: 20]

        B5 --> B6[B6 · Horas/semana no operacional<br/>admin marketing financeiro<br/>texto livre · ex: 10]
    end

    %% CHECKPOINT 2 · 28%

    BLOCO_B --> BLOCO_C

    %% ═══════════════════════════════════════
    %% BLOCO C — DORES, TENTATIVAS E ASPIRACOES
    %% ═══════════════════════════════════════

    subgraph BLOCO_C [" BLOCO C · DORES, TENTATIVAS E ASPIRACOES "]
        direction TB

        C1[C1 · Maiores dificuldades HOJE<br/>multi-select ate 4<br/>─────────────────<br/>Conseguir alunos novos<br/>Fechar com quem aparece<br/>Manter alunos por mais tempo<br/>Cobrar o que valho<br/>Ter tempo pra tudo<br/>Parecer profissional online<br/>Organizar meu negocio]

        C1 --> C2{C2 · Se pudesse resolver UMA coisa<br/>single_choice}
        C2 -->|mais_alunos| C2a[Ter mais alunos bons]
        C2 -->|valor| C2b[Ser percebido pelo que valho]
        C2 -->|eficiencia| C2c[Trabalhar menos e ganhar igual]
        C2 -->|retencao| C2d[Parar de perder alunos]
        C2 -->|sistema| C2e[Ter um sistema que funcione sozinho]
        C2 -->|autoridade| C2f[Ser reconhecido como referencia]

        C2a --> C3
        C2b --> C3
        C2c --> C3
        C2d --> C3
        C2e --> C3
        C2f --> C3

        C3[C3 · Meta de faturamento mensal<br/>texto livre · ex: 8000]

        C3 --> C4[C4 · O que ja tentou que nao deu certo<br/>multi-select · Nada/nunca tentei e exclusiva<br/>─────────────────<br/>Postar conteudo todo dia<br/>Pagar agencia de marketing<br/>Fazer site sozinho<br/>Comprar curso de marketing<br/>Assinar ferramenta e nao usar<br/>Rodar anuncios por conta<br/>Pedir indicacao pros alunos<br/>Contratar social media<br/>Fazer desafio / promocao<br/>Nada nunca tentei]
    end

    %% CHECKPOINT 3 · 38%

    BLOCO_C --> BLOCO_D

    %% ═══════════════════════════════════════
    %% BLOCO D — CAPTACAO
    %% ═══════════════════════════════════════

    subgraph BLOCO_D [" BLOCO D · CAPTACAO "]
        direction TB

        D1[D1 · De onde vem seus alunos hoje?<br/>multi-select<br/>─────────────────<br/>Indicacao de alunos/colegas<br/>Instagram organico<br/>Trafego pago Meta/Google<br/>Abordagem presencial no local<br/>Parcerias locais<br/>Google busca organica<br/>Eventos e competicoes<br/>Nao sei de onde vem]

        D1 --> D2[D2 · Novos interessados por mes<br/>single_choice<br/>─────────────────<br/>0-2 por mes<br/>3-5 por mes<br/>6-10 por mes<br/>11-20 por mes<br/>Mais de 20 por mes]

        D2 --> D3{D3 · Usa Instagram profissionalmente?<br/>single_choice}
        D3 -->|nao| D3_nao[Nao uso]
        D3 -->|sim| D3_sim[Sim]

        D3_sim --> D3_seg[D3a · Seguidores<br/>─────────────────<br/>Ate 1.000 · 1K-5K · 5K-15K<br/>15K-50K · 50K-150K · 150K+]
        D3_seg --> D3_freq[D3b · Frequencia de postagem<br/>─────────────────<br/>Todo dia ou quase<br/>3-5x por semana · 1-2x por semana<br/>Esporadicamente · Nao posto]
        D3_freq --> D3_rel[D3c · Relacao com criar conteudo<br/>─────────────────<br/>Gosto e me sinto bem<br/>Faco por obrigacao<br/>E um peso / detesto<br/>Queria mas nao sei como]

        D3_nao --> D4
        D3_rel --> D4

        D4{D4 · Investe em trafego pago?<br/>single_choice}
        D4 -->|sim_regular| D4a[Sim regularmente<br/>→ sub: Quanto por mes?<br/>Ate R$300 · R$300-1K · 1K-3K · 3K+]
        D4 -->|ja_tentei| D4b[Ja tentei mas parei<br/>→ sub: Por que parou?<br/>Sem resultado · Caro demais<br/>Nao soube operar · Agencia nao entregou<br/>Nao tive tempo]
        D4 -->|nunca| D4c[Nunca investi<br/>→ sub: O que te impede?<br/>Nao sei como funciona<br/>Sem orcamento · Nao acredito<br/>Nunca pensei nisso]
        D4 -->|quero| D4d[Quero mas nao sei<br/>→ sub: Quanto investiria?<br/>Ate R$300 · R$300-1K · 1K-3K · 3K+]

        D4a --> D5
        D4b --> D5
        D4c --> D5
        D4d --> D5

        D5[D5 · Oferece algo gratuito para atrair?<br/>multi-select<br/>─────────────────<br/>Avaliacao fisica gratis<br/>Aula experimental gratis<br/>Desafio de X dias<br/>Ebook / guia / planilha<br/>Nao ofereco nada gratuito]

        D5 --> D6{D6 · Tem programa de indicacao?<br/>single_choice}
        D6 -->|estruturado| D6a[Sim com incentivo claro]
        D6 -->|informal| D6b[Peco informalmente]
        D6 -->|nao| D6c[Nao tenho]
    end

    %% CHECKPOINT 4 · 50%

    BLOCO_D --> BLOCO_E

    %% ═══════════════════════════════════════
    %% BLOCO E — PRESENCA DIGITAL E AUTORIDADE
    %% ═══════════════════════════════════════

    subgraph BLOCO_E [" BLOCO E · PRESENCA DIGITAL E AUTORIDADE "]
        direction TB

        E1{E1 · Tem site profissional?<br/>single_choice}
        E1 -->|sim_bom| E1a[Sim profissional e atualizado]
        E1 -->|sim_ruim| E1b[Sim mas feio/desatualizado]
        E1 -->|tentei| E1c[Ja tentei e desisti]
        E1 -->|nao| E1d[Nao tenho]

        E1a --> E2
        E1b --> E2
        E1c --> E2
        E1d --> E2

        E2[E2 · Link da bio do Instagram<br/>CONDICIONAL se D3 = Sim<br/>single_choice<br/>─────────────────<br/>Site / landing page propria<br/>Linktree ou similar<br/>WhatsApp direto<br/>Nada / sem link]

        E2 --> E3[E3 · Coleta depoimentos dos alunos?<br/>single_choice<br/>─────────────────<br/>Sim de forma sistematica<br/>As vezes quando lembro<br/>Tenho satisfeitos mas nao registro<br/>Nunca coletei]

        E3 --> E4[E4 · Tem fotos/videos de transformacao?<br/>multi-select · opcoes variam por modalidade<br/>─────────────────<br/>Sim com autorizacao<br/>Sim mas sem autorizacao formal<br/>Resultados em provas/PRs documentados<br/>  · exibe se A1 = corrida/ciclismo/natacao/triathlon<br/>Nao registro transformacoes<br/>Meus alunos nao querem]
    end

    %% CHECKPOINT 5 · 60%

    BLOCO_E --> BLOCO_F

    %% ═══════════════════════════════════════
    %% BLOCO F — PROCESSO DE CONVERSAO
    %% ═══════════════════════════════════════

    subgraph BLOCO_F [" BLOCO F · PROCESSO DE CONVERSAO "]
        direction TB

        F1[F1 · Como o interessado faz contato?<br/>multi-select<br/>─────────────────<br/>WhatsApp · DM no Instagram<br/>Presencialmente · Formulario no site<br/>Telefone / ligacao]

        F1 --> F2{F2 · Em quanto tempo voce responde?<br/>single_choice}
        F2 -->|min| F2a[Minutos]
        F2 -->|horas| F2b[Algumas horas]
        F2 -->|dia| F2c[No mesmo dia]
        F2 -->|demora| F2d[As vezes demoro 2+ dias]

        F2a --> F3
        F2b --> F3
        F2c --> F3
        F2d --> F3

        F3[F3 · De 10 interessados quantos fecham?<br/>single_choice<br/>─────────────────<br/>8-10 de 10 quase todos<br/>5-7 de 10 maioria<br/>3-4 de 10 metade<br/>1-2 de 10 poucos<br/>Nao sei / nunca medi]

        F3 --> F4[F4 · Principal razao de NAO fechar<br/>CONDICIONAL se F3 != 8-10 de 10<br/>single_choice<br/>─────────────────<br/>Acham caro<br/>Nao confiam / nao me conhecem<br/>Vao pro concorrente mais barato<br/>Simplesmente somem<br/>Dizem que nao tem tempo<br/>Nao sei por que nao fecham]

        F4 --> F5[F5 · Precos/servicos claros para o interessado?<br/>single_choice<br/>─────────────────<br/>Sim publicos no site/rede<br/>Mando por WhatsApp quando pedem<br/>Varia caso a caso<br/>Nao tenho tabela definida]

        F5 --> F6{F6 · Oferece aula experimental?<br/>single_choice}
        F6 -->|gratis| F6a[Sim gratuita]
        F6 -->|paga| F6b[Sim paga com desconto]
        F6 -->|nao| F6c[Nao ofereco]
        F6 -->|avaliacao| F6d[Ofereco avaliacao nao aula]
    end

    %% CHECKPOINT 6 · 70%

    BLOCO_F --> BLOCO_G

    %% ═══════════════════════════════════════
    %% BLOCO G — RETENCAO
    %% CONDICIONAL: exibe se B1 > 0
    %% ═══════════════════════════════════════

    subgraph BLOCO_G [" BLOCO G · RETENCAO · exibe se alunos ativos > 0 "]
        direction TB

        G1{G1 · Tempo medio que aluno fica<br/>single_choice}
        G1 -->|curto| G1a[Menos de 3 meses]
        G1 -->|medio| G1b[3-6 meses]
        G1 -->|bom| G1c[6-12 meses]
        G1 -->|otimo| G1d[1-2 anos]
        G1 -->|excelente| G1e[Mais de 2 anos]

        G1a --> G2
        G1b --> G2
        G1c --> G2
        G1d --> G2
        G1e --> G2

        G2[G2 · Razoes que alunos saem<br/>multi-select<br/>─────────────────<br/>Somem sem explicar<br/>Perdem motivacao / plato<br/>Acham caro / cortam gastos<br/>Atingem o objetivo e param<br/>Param de treinar lesao/rotina/ferias<br/>Vao pra outro profissional]

        G2 --> G3[G3 · Acompanha fora das sessoes?<br/>multi-select · exclusivas: so quando procura / nao tenho contato<br/>─────────────────<br/>Sim faco check-in regular<br/>Tenho grupo ativo WhatsApp/Telegram<br/>Mando conteudo/treino e espero retorno<br/>So quando o aluno me procura<br/>Nao tenho contato fora das sessoes]

        G3 --> G4[G4 · Como mede progresso dos alunos?<br/>multi-select<br/>─────────────────<br/>Fotos periodicas<br/>Medidas / bioimpedancia<br/>Testes de forca / cardio<br/>Dados em app/wearable Garmin/Polar/Strava<br/>  · destaque se A1 = corrida/ciclismo/natacao/triathlon<br/>No olho / conversando<br/>Nao meco sistematicamente]

        G4 --> G5{G5 · Quando aluno some o que faz?<br/>single_choice}
        G5 -->|ativo| G5a[Ligo ou mando msg em ate 3 dias]
        G5 -->|passivo| G5b[Espero uns dias e mando msg]
        G5 -->|espera| G5c[Espero ele voltar]
        G5 -->|aceito| G5d[Aceito que saiu]

        G5a --> G6
        G5b --> G6
        G5c --> G6
        G5d --> G6

        G6[G6 · Alunos tem comunidade entre si?<br/>multi-select · Nada/cada um na sua e exclusiva<br/>─────────────────<br/>Grupo WhatsApp ativo<br/>Treinos coletivos / eventos<br/>Grupo mas pouca interacao<br/>Nada / cada um na sua]
    end

    %% CHECKPOINT 7 · 82%

    BLOCO_G --> BLOCO_H

    %% ═══════════════════════════════════════
    %% BLOCO H — GESTAO E OPERACAO
    %% ═══════════════════════════════════════

    subgraph BLOCO_H [" BLOCO H · GESTAO E OPERACAO "]
        direction TB

        H1[H1 · Usa IA para alguma coisa?<br/>multi-select<br/>─────────────────<br/>Montar treinos<br/>Criar conteudo / textos<br/>Criar imagens / artes<br/>Planejar negocio<br/>Nao uso IA<br/>Nao sei usar]

        H1 --> H2{H2 · Como prescreve treinos?<br/>single_choice}
        H2 -->|app| H2a[App MFIT Trainerize etc]
        H2 -->|planilha| H2b[Planilha Excel/Sheets]
        H2 -->|whats| H2c[WhatsApp / PDF]
        H2 -->|papel| H2d[Ficha de papel]
        H2 -->|cabeca| H2e[De cabeca no momento]
        H2 -->|misto| H2f[Misto]

        H2a --> H3
        H2b --> H3
        H2c --> H3
        H2d --> H2d_skip[pula H3]
        H2e --> H2e_skip[pula H3]
        H2f --> H3

        H3[H3 · Videos de demonstracao fazem diferenca?<br/>CONDICIONAL se H2 = App Planilha WhatsApp/PDF ou Misto<br/>single_choice<br/>─────────────────<br/>Sim essenciais precisam ver execucao correta<br/>Sim mas preferiria meus proprios videos<br/>Indiferente meus alunos raramente acessam<br/>Nao meus alunos nao precisam de video<br/>Nao prescrevo treinos por app]

        H2d_skip --> H4
        H2e_skip --> H4
        H3 --> H4

        H4[H4 · Como agenda sessoes?<br/>single_choice<br/>─────────────────<br/>Google Calendar so interno<br/>Google Calendar + link publico aluno agenda<br/>Calendly ou Cal.com link proprio<br/>WhatsApp combinando direto<br/>Horarios fixos nao preciso de sistema]

        H4 --> H5[H5 · Como realiza sessoes online?<br/>multi-select · CONDICIONAL se A3 = online ou hibrido<br/>Nao faco sessoes online e exclusiva<br/>─────────────────<br/>Google Meet · Zoom<br/>WhatsApp videochamada<br/>Microsoft Teams<br/>Nao faco sessoes online]

        H5 --> H6{H6 · Como cobra alunos?<br/>single_choice}
        H6 -->|pix| H6a[PIX manual todo mes]
        H6 -->|recorrente| H6b[Cobranca recorrente automatica]
        H6 -->|dinheiro| H6c[Dinheiro / especie]
        H6 -->|cartao| H6d[Cartao / maquininha]
        H6 -->|misto| H6e[Misto / varia por aluno]

        H6a --> H7
        H6b --> H7
        H6c --> H7
        H6d --> H7
        H6e --> H7

        H7[H7 · Controle financeiro<br/>single_choice<br/>─────────────────<br/>Planilha organizada<br/>App financeiro<br/>Contador cuida<br/>Anoto no caderno/celular<br/>Nao controlo]
    end

    %% CHECKPOINT 8 · 92%

    BLOCO_H --> BLOCO_I

    %% ═══════════════════════════════════════
    %% BLOCO I — FERRAMENTAS E OPERACAO DIGITAL
    %% ═══════════════════════════════════════

    subgraph BLOCO_I [" BLOCO I · FERRAMENTAS E OPERACAO DIGITAL "]
        direction TB

        I1[I1 · Gasto mensal com ferramentas e apps<br/>texto livre · ex: 120]

        I1 --> I2{I2 · O que mais gostaria de nao fazer manualmente?<br/>single_choice}
        I2 -->|cobrar| I2a[Cobrar alunos todo mes]
        I2 -->|agenda| I2b[Agendar e confirmar sessoes]
        I2 -->|treino| I2c[Mandar treino e acompanhar evolucao]
        I2 -->|leads| I2d[Responder interessados e qualificar leads]
        I2 -->|financeiro| I2e[Controlar quanto entrou e saiu]

        I2a --> I3
        I2b --> I3
        I2c --> I3
        I2d --> I3
        I2e --> I3

        I3[I3 · Se existisse ferramenta unica o que colocaria?<br/>multi-select<br/>─────────────────<br/>Montar e enviar treinos aos alunos<br/>Cobrar automaticamente todo mes<br/>Agendar sessoes com link proprio<br/>Sessoes online integradas<br/>Acompanhar evolucao fotos/medidas/cargas<br/>Captar e qualificar novos alunos<br/>Site ou pagina profissional propria<br/>Ver historico pagamentos e financeiro<br/>Grupo ou comunidade organizada com alunos]

        I3 --> I4[I4 · Quanto pagaria por mes por essa ferramenta?<br/>single_choice<br/>─────────────────<br/>Ate R$50/mes<br/>R$50-100/mes<br/>R$100-200/mes<br/>R$200-350/mes<br/>Mais de R$350/mes<br/>Depende do que entregar]
    end

    %% CHECKPOINT 9 · 100%

    BLOCO_I --> CLOSE

    subgraph CLOSE [" FECHAMENTO "]
        direction TB

        J1[J1 · Tem algo mais que gostaria de contar?<br/>textarea opcional · max 500 chars]

        J1 --> AUTH[Autenticacao<br/>Google Continuar com Google botao principal<br/>ou email fallback<br/>─────────────────<br/>Nome pre-preenchido do Google editavel<br/>Email vinculado a conta nao editavel]

        AUTH --> COMP[Complemento pos-autenticacao<br/>─────────────────<br/>WhatsApp<br/>Instagram profissional opcional<br/>Cidade autocomplete IBGE<br/>Consentimento LGPD]

        COMP --> END([GERAR DIAGNOSTICO<br/>Relatorio personalizado<br/>do seu negocio])
    end
```

---

## PARTE 2 — JUSTIFICATIVAS DETALHADAS

---

### FLUXO DE ENTRADA (2 telas antes do formulario)

#### Tela 1 — Intro

Pagina existente: headline + descricao breve do que e o diagnostico + botao "Comecar →". Pula direto para o formulario se houver rascunho salvo.

#### Tela 2 — Overview

Exibida apos clicar "Comecar". Objetivo: gerenciar expectativa, criar antecipacao, reduzir abandono no meio do formulario.

- `8 min` em tipografia hero (clamp 5.5rem → 9.5rem), cor accent
- Subtitulo: "para um diagnostico completo do seu negocio. Quanto mais preciso voce for, mais util o resultado."
- Lista dos 9 blocos numerados (01-09) com nome + descricao de uma linha
- Botao "Iniciar diagnostico →"

---

### BLOCO A · PERFIL PROFISSIONAL (5 perguntas)

O bloco A mapeia QUEM e o profissional. Sem isso, o relatorio fala com um fantasma.

#### A1 · Modalidade principal + especialidades

- **Por que**: cada modalidade tem modelo de negocio, linguagem, canais e concorrentes radicalmente diferentes. O relatorio precisa falar a lingua do nicho
- **Por que single_choice + multi-select na mesma tela**: escolhe a modalidade e as especialidades aparecem condicionalmente. Forcar a modalidade principal impede resposta difusa
- **Especialidades variam por modalidade**: musculacao (8), corrida (6), ciclismo (5), crossfit (4), natacao (5), triathlon (4), outra (textarea)
- **O que alimenta**: linguagem do relatorio, exemplos, benchmarks por nicho, tipo de conteudo sugerido, templates disponiveis

#### A2 · Ha quanto tempo atua

- **Por que texto livre (nao faixas)**: experiencia em anos exatos permite calculos mais precisos (LTV, maturidade, benchmarks). Faixas perdem informacao
- **O que alimenta**: tom do relatorio, benchmarks de renda por experiencia, expectativas realistas de crescimento

#### A3 · Como trabalha

- **Por que**: modelo define restricoes e oportunidades. Presencial tem teto; online escala; hibrido e o mais comum entre PTs estabelecidos
- **Condicional downstream**: se online ou hibrido, exibe H5 (como realiza sessoes online)
- **O que alimenta**: tipo de funil sugerido, canais relevantes, restricoes operacionais

#### A4 · Onde trabalha

- **Por que multi-select**: a maioria trabalha em mais de um lugar. Academia + domicilio e combinacao comum
- **O que alimenta**: restricoes de espaco, tipo de captacao (academia = fluxo captivo; domicilio = indicacao; ar livre = sazonalidade)

#### A5 · Orienta alimentacao

- **Por que**: orienta o tom da IA no relatorio. PT que faz nutricao completa tem posicionamento e diferencial diferentes de quem nao toca no assunto
- **Por que aqui (nao so como contexto)**: impacta a camada de autoridade no relatorio e o perfil de servico completo
- **O que alimenta**: pilar de autoridade no relatorio, sugestao de posicionamento de servico completo vs especializado

---

### BLOCO B · ESCALA DO NEGOCIO (6 perguntas)

O bloco B quantifica o negocio. Sem numeros, o relatorio e achismo.

#### B1 · Alunos ativos

- **Por que texto livre (nao faixas)**: numero exato permite calcular receita real (B1 × B2). Faixas produzem estimativas imprecisas
- **Pre-fill pos-pagamento**: vai preencher "alunos ativos" nas configuracoes da conta
- **O que alimenta**: receita estimada, projecao de crescimento, score de maturidade

#### B2 · Ticket medio mensal

- **Por que faixas pequenas**: ticket e dado sensivel. Faixas menores reduzem resistencia de responder mas ainda permitem calculo preciso
- **Faixas calibradas**: Ate R$150, R$150-250, R$250-400, R$400-600, R$600-900, R$900-1.500, +R$1.500
- **O que alimenta**: receita estimada, gap de receita, sugestao de pricing, benchmarking vs mercado

#### B3 · Tendencia de receita

- **Por que**: numero absoluto sem tendencia e foto sem video. PT com 15 alunos crescendo tem perspectiva totalmente diferente de PT com 15 alunos caindo. A tendencia define urgencia
- **O que alimenta**: urgencia do lead, tipo de conselho (crescendo = otimizar, caindo = diagnosticar, irregular = sistematizar)

#### B4 · Fontes de renda

- **Por que multi-select**: a maioria combina fontes. Quem so faz 1:1 presencial tem teto de renda. Quem diversifica tem maturidade maior
- **O que alimenta**: sugestoes de diversificacao, calculo de capacidade, maturidade do modelo de negocio

#### B5 · Horas/semana atendendo alunos

- **Por que texto livre (nao faixas)**: horas exatas permitem calcular produtividade (receita / hora) e capacidade ociosa
- **Por que "atendendo" e nao "trabalhando"**: evita ambiguidade (commute, preparacao de treino contam?). Atendimento e objetivo e mensuravel

#### B6 · Horas/semana no operacional

- **Por que pergunta separada (nao ratio)**: dois numeros absolutos sao mais precisos e mais faceis de responder que uma porcentagem
- **Soma implica total**: B5 + B6 = carga total de trabalho sem precisar perguntar
- **O que alimenta**: calculo de horas recuperaveis com automacao, argumento de ROI do produto

---

### BLOCO C · DORES, TENTATIVAS E ASPIRACOES (4 perguntas)

O bloco C e o coracao emocional do diagnostico. Captura o que mais dói e o que o profissional ja tentou.

#### C1 · Maiores dificuldades HOJE

- **Por que multi-select ate 4**: captura o mix real de dores. PT raramente tem so uma
- **7 opcoes**: conseguir alunos, fechar, manter, cobrar o que valho, ter tempo, parecer profissional, organizar negocio
- **"Cobrar o que valho"**: dor de dignidade profissional — o PT sabe que e bom mas nao consegue traduzir em preco premium
- **O que alimenta**: foco primario do relatorio, CTA personalizado

#### C2 · Se pudesse resolver UMA coisa

- **Por que**: diferente de C1 (diagnostica), essa e aspiracional. As opcoes sao framings do produto visto por angulos diferentes
- **"Ser percebido pelo que valho"**: e a alma da marca do onboarding.bio. Lead de alta conversao emocional
- **O que alimenta**: CTA final personalizado, headline do relatorio

#### C3 · Meta de faturamento mensal

- **Por que texto livre**: meta exata permite calcular gap (meta - receita atual) e mostrar o caminho concreto no relatorio
- **O que alimenta**: calculo de gap de aspiracao, plano de crescimento no relatorio

#### C4 · O que ja tentou que nao deu certo

- **Por que**: filtro do relatorio (nao sugerir o que ja falhou), validacao emocional ("voce tentou X e nao e culpa sua — o problema era Y")
- **"Nada, nunca tentei" e exclusiva**: identifica PT sem historico de tentativas — diferente de quem tentou e falhou
- **O que alimenta**: posicionamento do produto como alternativa, filtros de recomendacao no relatorio

---

### BLOCO D · CAPTACAO (6 perguntas)

O bloco D diagnostica COMO o profissional atrai clientes.

#### D1 · De onde vem seus alunos

- **Por que multi-select**: captura mix de canais. 84% dependem de indicacao mas poucos admitem que e o UNICO canal
- **"Nao sei de onde vem"**: PT que nao sabe nao consegue otimizar nada. Dado poderoso
- **O que alimenta**: diagnostico de diversificacao, dependencia de canal unico, sugestoes

#### D2 · Novos interessados por mes

- **Por que**: volume de leads e metrica de topo de funil. Combinado com F3 (taxa de fechamento), permite calcular eficiencia do funil completo
- **O que alimenta**: diagnostico de gargalo (topo vs fundo de funil)

#### D3 · Instagram (condicional — sub-perguntas se Sim)

- **D3a seguidores**: faixas granulares. Receita potencial escala diferente entre 1K e 50K seguidores
- **D3b frequencia**: frequencia sem resultado = burnout. Combinada com D3c revela a relacao real com marketing
- **D3c relacao com conteudo**: pergunta emocional. "E um peso / detesto" = lead quente pra produto que faz marketing por ele
- **O que alimenta**: diagnostico de funil Instagram, sugestao de otimizacao, argumento de automacao

#### D4 · Trafego pago (com sub-perguntas condicionais)

- **Branch por resposta**: se investe → quanto gasta; se parou → por que; se nunca → o que impede; se quer → quanto investiria
- **O que alimenta**: diagnostico de investimento em aquisicao, calculo de CAC, upsell potencial de setup de trafego

#### D5 · Oferta gratuita

- **Por que multi-select**: PT pode oferecer mais de uma coisa. Avaliacao fisica e diferente de aula experimental e diferente de ebook
- **"Nao ofereco nada"**: revela ausencia de reciprocidade no funil (Cialdini). Oportunidade massiva
- **O que alimenta**: diagnostico de reciprocidade, sugestao de lead magnet adequado

#### D6 · Programa de indicacao

- **Por que**: 84% dos clientes vem de indicacao mas quase nenhum PT tem programa ESTRUTURADO. A diferenca entre "espero que me indiquem" e "incentivo sistematicamente"
- **O que alimenta**: diagnostico de sistematizacao de indicacao, sugestao de programa

---

### BLOCO E · PRESENCA DIGITAL E AUTORIDADE (4 perguntas)

O bloco E mede a infraestrutura de conversao e autoridade online.

#### E1 · Site profissional

- **Por que 4 opcoes**: "sim mas feio/desatualizado" e radicalmente diferente de "sim profissional". "Ja tentei e desisti" identifica frustracao com ferramentas genericas
- **O que alimenta**: score de conversao digital, oportunidade de Site Premium, diagnostico de presenca

#### E2 · Link da bio (condicional se Instagram = Sim)

- **Por que**: o link da bio e o UNICO ponto de conversao do Instagram. Linktree vs WhatsApp direto vs site = funis completamente diferentes
- **O que alimenta**: diagnostico do funil Instagram, oportunidade de Hub

#### E3 · Depoimentos

- **Por que**: prova social aumenta conversao em ate 380%. Capturar SE e COMO o PT coleta diagnostica a camada de autoridade
- **"Tenho satisfeitos mas nao registro"**: extremamente comum — prova social desperdicada
- **O que alimenta**: score de autoridade, sugestao de coleta sistematica

#### E4 · Fotos/videos de transformacao (multi-select)

- **Por que multi-select**: o PT pode ter varias situacoes simultaneamente (com e sem autorizacao, por exemplo)
- **Opcao de PRs/resultados em provas**: exibe so para modalidades de performance (corrida, ciclismo, natacao, triathlon). Mostra que conhecemos o mundo deles
- **O que alimenta**: score de autoridade, arsenal de prova social, alertas de risco juridico (sem autorizacao)

---

### BLOCO F · PROCESSO DE CONVERSAO (6 perguntas)

O bloco F mapeia o que acontece entre "interessado apareceu" e "fechou".

#### F1 · Canal de primeiro contato (multi-select)

- **Por que multi-select**: interessados chegam por varios canais. Saber o mix permite diagnosticar o funil completo
- **O que alimenta**: desenho do funil atual, pontos de friccao, sugestao de otimizacao

#### F2 · Tempo de resposta

- **Por que**: responder em <1h = 7x mais chance de qualificar (Harvard Business Review). Essa pergunta captura se o PT esta sabotando o proprio funil com demora
- **O que alimenta**: diagnostico de velocidade do funil, argumento de follow-up automatizado

#### F3 · Taxa de fechamento estimada

- **Por que**: combinada com D2 (leads/mes), calcula eficiencia do funil completo
- **"Nao sei / nunca medi"**: PT que nao mede nao pode otimizar. Dado poderoso
- **O que alimenta**: calculo de eficiencia, gap de conversao, projecao com otimizacao

#### F4 · Razao de NAO fechar (condicional se F3 != 8-10 de 10)

- **Por que**: cada razao tem solucao diferente. "Acham caro" = falta de valor percebido. "Somem" = falta de follow-up. O relatorio prescreve baseado na causa
- **O que alimenta**: pilar de conversao do relatorio, sugestoes especificas por causa

#### F5 · Clareza de precos

- **Por que**: ambiguidade de preco e uma das principais objecoes que travam fechamento. PT sem tabela definida nao transmite confianca
- **O que alimenta**: diagnostico de transparencia, sugestao de estrutura de servicos

#### F6 · Aula experimental

- **Por que**: trial converte ate 60%. Saber SE e COMO o PT oferece trial diagnostica a estrategia de conversao
- **"Avaliacao, nao aula"**: identifica PT que ja pensa em intake como ferramenta — lead mais sofisticado
- **O que alimenta**: sugestao de modelo de trial, comparacao com benchmark

---

### BLOCO G · RETENCAO (6 perguntas — condicional se alunos ativos > 0)

O bloco G mapeia a camada que ninguem pergunta. E onde esta o dinheiro silencioso.

#### G1 · Tempo medio de permanencia

- **Por que**: lifetime do aluno e a metrica mais importante de negocio fitness que quase nenhum PT mede. Media de 14 meses para PT ativo; 50% desiste em 6 meses
- **O que alimenta**: calculo de LTV, diagnostico de retencao, projecao de receita estabilizada

#### G2 · Razoes que alunos saem (multi-select)

- **Por que multi-select**: alunos saem por varias razoes simultaneamente. Single choice perderia a complexidade real
- **"Somem sem explicar"**: 97% churnam em silencio. Dado que valida a necessidade de deteccao proativa
- **O que alimenta**: pilar de retencao do relatorio, intervencoes sugeridas por causa

#### G3 · Acompanhamento fora das sessoes (multi-select)

- **Por que multi-select com exclusivas**: PT pode fazer check-in E ter grupo, mas "so quando procura" e "sem contato" sao exclusivas porque contradizem as demais
- **O que alimenta**: score de relacionamento, diagnostico de engagement, sugestao de check-in sistematico

#### G4 · Medicao de progresso (multi-select)

- **Por que**: clientes que nao veem progresso claro sao 4x mais provaveis de desistir em 3 meses. Capturar COMO o PT mede diagnostica a retencao baseada em evidencia
- **Destaque para dados em app/wearable**: relevante principalmente para modalidades de performance
- **O que alimenta**: diagnostico de retencao por evidencia, sugestao de protocolo de tracking

#### G5 · Quando aluno some, o que faz

- **Por que**: a resposta sozinha diagnostica maturidade de retencao. Primeiras 72h sao as mais faceis de recuperar
- **O que alimenta**: score de retencao ativa, sugestao de protocolo de re-engajamento

#### G6 · Comunidade entre alunos (multi-select)

- **Por que multi-select com exclusiva**: PT pode ter grupo E eventos. "Nada/cada um na sua" e exclusiva
- **Por que**: comunidade e o multiplicador de retencao. PT sem comunidade depende 100% da relacao 1:1 — fragil
- **O que alimenta**: score de retencao comunitaria, sugestoes de ativacao

---

### BLOCO H · GESTAO E OPERACAO (7 perguntas)

O bloco H diagnostica ferramentas e processos do dia a dia.

#### H1 · Usa IA (multi-select)

- **Por que primeiro no bloco**: IA e a tendencia mais relevante. Capturar adocao atual permite calibrar tom sobre IA no relatorio
- **"Nao sei usar"**: identifica demanda latente + barreira de educacao — relatorio pode desmistificar
- **O que alimenta**: diagnostico de maturidade digital, posicionamento da IA do produto

#### H2 · Como prescreve treinos

- **Por que**: ferramenta de prescricao define maturidade tech e captura se o PT ja investe em software
- **Condicional downstream**: se App, Planilha, WhatsApp/PDF ou Misto → exibe H3
- **O que alimenta**: benchmark de maturidade, diagnostico de gap de integracao

#### H3 · Videos de demonstracao (condicional se H2 != papel/cabeca)

- **Por que**: questao estrategica de produto — saber se video de execucao e diferencial real ou gimmick para o publico do PT
- **"Preferiria meus proprios videos"**: identifica demanda por personalizacao — funcionalidade futura (PT grava seus proprios demos)
- **O que alimenta**: decisao de produto, segmentacao de feature request

#### H4 · Como agenda sessoes

- **Por que**: no-shows custam R$100-300/slot. Agenda via WhatsApp e caos para maioria
- **O que alimenta**: score de gestao, argumento de agendamento integrado

#### H5 · Como realiza sessoes online (multi-select — condicional se A3 = online ou hibrido)

- **Por que multi-select**: PT pode usar ferramentas diferentes por aluno
- **"Nao faco sessoes online" e exclusiva**: para PT hibrido que ainda nao fez a transicao
- **O que alimenta**: diagnostico de ferramentas, oportunidade de integracao de videochamada

#### H6 · Como cobra

- **Por que**: PIX manual todo mes causa +26% churn. Cobranca recorrente automatica e rara entre autonomos
- **O que alimenta**: diagnostico de friccao financeira, argumento de cobranca recorrente

#### H7 · Controle financeiro

- **Por que**: "nao controlo" e assustadoramente comum. PT que nao sabe quanto gasta nao sabe se lucra
- **O que alimenta**: score de maturidade de gestao, argumento de painel financeiro

---

### BLOCO I · FERRAMENTAS E OPERACAO DIGITAL (4 perguntas)

O bloco I qualifica prontidao de compra e mapeia aspiracoes de produto.

#### I1 · Gasto mensal com ferramentas

- **Por que texto livre**: valor exato permite calcular quanto o PT ja investe e calibrar proposta de valor ("ja paga R$X em 4 ferramentas separadas")
- **O que alimenta**: segmentacao de pricing, calculo de consolidacao de custo

#### I2 · O que mais gostaria de nao fazer manualmente (single choice)

- **Por que single choice**: forcao de prioridade. Cada resposta e uma dor diferente com proposta de valor diferente
- **O que alimenta**: CTA mais ressonante no relatorio, segmentacao de feature highlight

#### I3 · Se existisse ferramenta unica (multi-select)

- **Por que**: mapa direto de product-market fit. Cada item e uma funcionalidade do produto
- **O que alimenta**: prova de que o produto resolve o que foi marcado, proposta de valor personalizada no CTA

#### I4 · Quanto pagaria por mes

- **Por que**: qualificacao financeira direta. "Depende do que entregar" indica mentalidade de ROI — lead mais sofisticado
- **O que alimenta**: produto recomendado, CTA de pricing, segmentacao de follow-up comercial

---

### FECHAMENTO

#### J1 · Texto livre opcional

- **Por que**: captura o que nenhuma pergunta estruturada captura. Goldmine de insights qualitativos
- **Max 500 chars**: limita sem sufocar

#### Autenticacao

- **Google como padrao**: um clique, email verificado automaticamente, sem inventar senha
- **Email como fallback**: para quem tem resistencia a vincular conta Google
- **Nome pre-preenchido do Google mas editavel**: PT pode ter conta com apelido ou nome incompleto

#### Complemento pos-autenticacao

- WhatsApp (obrigatorio — canal principal de contato)
- Instagram profissional (opcional — nos permite verificar seguidores declarados vs reais)
- Cidade: autocomplete IBGE (`servicodados.ibge.gov.br/api/v1/localidades/municipios`) — retorna municipio + UF + regiao + populacao. Alternativa: Google Places com `types=locality`
- Consentimento LGPD

---

## TOTAIS

| Bloco           | Perguntas fixas     | Condicionais                                                                  | Foco                    |
| --------------- | ------------------- | ----------------------------------------------------------------------------- | ----------------------- |
| A · Perfil      | 5                   | especialidades variam por modalidade                                          | Quem e voce             |
| B · Escala      | 6                   | —                                                                             | Tamanho do negocio      |
| C · Dores       | 4                   | —                                                                             | O que dói e o que quer  |
| D · Captacao    | 6                   | sub-perguntas Instagram e trafego pago                                        | Como atrai clientes     |
| E · Presenca    | 4                   | link bio se Instagram=Sim                                                     | Autoridade digital      |
| F · Conversao   | 6                   | razao nao fechar se taxa < 8-10                                               | Como fecha vendas       |
| G · Retencao    | 6                   | bloco inteiro se alunos > 0                                                   | Como mantem alunos      |
| H · Gestao      | 7                   | video demo se prescricao = digital; sessoes online se modelo = online/hibrido | Ferramentas e processos |
| I · Ferramentas | 4                   | —                                                                             | Prontidao de compra     |
| Fechamento      | 1 + auth + 4 campos | —                                                                             | Texto livre + dados     |
| **TOTAL**       | **~49 fixas**       | **+ate 15 condicionais**                                                      |                         |

### Nota sobre tamanho

~49 perguntas fixas parece muito. Mas considere:

- **80%+ sao de 1 toque** (single choice ou multi-select, sem digitacao)
- **Organizadas em 9 blocos com progresso visual** e 9 checkpoints
- **Tempo estimado: ~8 minutos** (media ~10 segundos por pergunta de 1 toque)
- **Publico e profissional B2B**, nao adolescente no onibus
- **O premio e alto**: relatorio de diagnostico de negocio personalizado
- **Textos livres sao 5**: A2 (tempo de atuacao), B1 (alunos), B5 (horas atendendo), B6 (horas operacional), C3 (meta de faturamento), I1 (gasto ferramentas) — todos numericos, rapidos

### O que esses dados permitem calcular

- Receita atual estimada (B1 × B2)
- Receita potencial (leads × taxa de conversao × B2)
- Gap de receita mensal e anual (meta C3 - receita atual)
- Taxa de conversao do funil (leads D2 × taxa F3)
- LTV por aluno (B2 × G1)
- Produtividade (receita / horas B5)
- Horas recuperaveis com automacao (B6 estimativa)
- Score de maturidade digital (5 eixos 0-10)
- Score de autoridade (E1-E4)
- Score de retencao (G1-G6)
- Score de gestao (H1-H7)
- Score de captacao (D1-D6)
- Projecao 12 meses (cenario A vs B)
- Lead score composto (para qualificacao interna)
- Produto recomendado (baseado em C2 + I2 + I4)
- Urgencia (B3 + C1 + capacidade financeira)
