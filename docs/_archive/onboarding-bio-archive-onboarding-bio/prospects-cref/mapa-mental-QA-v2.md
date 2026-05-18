# Diagnóstico de Negócio — Mapa Mental (onboarding.bio)

> Estrutura completa do funil `/analise-gratuita` para profissionais autônomos do CREF. Visualize este arquivo em [markmap.js.org](https://markmap.js.org) ou na extensão Markmap do VSCode.

## 0 · Princípios não-negociáveis

### Uma pergunta = uma tela

- Sem múltiplos campos por tela (exceto auth e cidade pós-auth)
- Transição animada entre perguntas (slide horizontal)
- Botão voltar sempre disponível (preserva resposta)
- Auto-save a cada resposta

### Uma pergunta = um conceito

- Modalidade ≠ local de trabalho ≠ modelo de atendimento
- Captação ≠ conversão
- Cobrança ≠ controle financeiro

### Inputs numéricos exatos

- Apenas onde alimenta cálculo financeiro real
- Nos demais casos: faixas curtas e claras

### Multi-select consciente

- Apenas quando a realidade do profissional é múltipla
- Sempre com limite explícito ou opção exclusiva

### Mobile 375px é a régua

- Botões mínimo 52px de altura
- Padding lateral 20–24px
- `inputMode` correto em todos os números
- Font-size mínimo 16px nos inputs (evita zoom iOS)

### Copy direta e brasileira

- Sem "ticket médio" sem tradução
- Sem jargão de marketing
- Sem labels redundantes com placeholder

---

## 1 · Pré-formulário

### Tela A · Intro (`DiagnosticIntro`)

- Headline curta de promessa
- Botão "Começar →"
- Pula direto ao formulário se houver rascunho

### Tela B · Overview (`DiagnosticOverview`)

- Tempo em destaque hero "8 min"
- Subtítulo de expectativa
- Lista dos 7 blocos numerados (01–07)
- Botão "Iniciar diagnóstico →"
- Link voltar no header

---

## 2 · Estrutura do formulário

### Total

- 27 perguntas core
- 2 condicionais (Instagram → seguidores; Tráfego pago → quanto)
- 6 checkpoints com % de progresso
- Tempo real estimado: 7–8 minutos

### Por que 27 e não menos

- Cada pergunta alimenta diretamente uma seção do relatório
- Cortes extras prejudicam SWOT, persona ou top 3 ações
- Já cortado de ~55 da versão anterior

### Por que 27 e não mais

- Acima de 30 perguntas o drop sobe ~50%
- MVP precisa de pesquisa, não de exaustão

---

## 3 · BLOCO A · Perfil profissional

### Pergunta 1 · Modalidade principal

- Tipo: single-select com cards visuais
- Opções: Musculação · Corrida · Ciclismo · Natação · CrossFit · Triathlon · Outra
- Ícone por modalidade

### Pergunta 2 · Especialidades dentro da modalidade

- Tipo: multi-select dinâmico (depende de P1)
- Limite: até 4 escolhas
- Musculação
  - Emagrecimento
  - Hipertrofia
  - Saúde e disposição geral
  - Fisiculturismo
  - Terceira idade 60+
  - Gestante / pós-parto
  - Reabilitação
  - Funcional / movimento
- Corrida
  - Recreativa / iniciantes
  - 5K e 10K
  - Meia-maratona
  - Maratona
  - Trail / ultra
  - Reabilitação de corredor
- Ciclismo
  - Recreativo / iniciantes
  - Speed / road
  - MTB
  - Gravel
  - Indoor / Zwift
- CrossFit
  - Iniciante / fitness
  - Performance / competitor
  - Masters 40+
  - Feminino / objetivos de forma
- Natação
  - Adulto iniciante
  - Fitness / condicionamento
  - Competitivo
  - Águas abertas
  - Masters / veteranos
- Triathlon
  - Sprint / olímpico
  - Half Ironman
  - Ironman
  - Aquathlon / duathlon

### Pergunta 3 · Modelo de atendimento

- Tipo: single-select
- Só presencial
- Só online
- Híbrido (presencial + online)

### Pergunta 4 · Onde você atua

- Tipo: multi-select
- Limite: sem limite mas opção "100% online" é exclusiva
- Academia / clube / box parceiro
- Estúdio próprio
- Domicílio do aluno
- Ar livre / parques / espaços públicos
- 100% online (exclusiva)

### Pergunta 5 · Há quanto tempo você atua como autônomo

- Tipo: input numérico exato
- Unidade: anos
- inputMode: numeric
- Validação: > 0 e ≤ 60
- Placeholder: "ex: 4"

### Checkpoint 1 · 18%

- Texto: "Já sei quem você é. Agora os números do seu negócio."

---

## 4 · BLOCO B · Escala e finanças

### Pergunta 6 · Quantos alunos ativos você tem

- Tipo: input numérico exato
- inputMode: numeric
- Validação: ≥ 0 e ≤ 999
- Placeholder: "ex: 18"
- Helper: "Considere apenas quem está pagando ativamente"

### Pergunta 7 · Ticket médio mensal por aluno

- Tipo: input numérico exato
- Prefixo: R$
- inputMode: decimal
- Validação: > 0 e ≤ 10000
- Placeholder: "ex: 350"
- Helper: "Se varia bastante, coloque a média aproximada"

### Pergunta 8 · Gastos fixos mensais aproximados

- Tipo: input numérico exato
- Prefixo: R$
- Validação: ≥ 0 e ≤ 50000
- Placeholder: "ex: 1500"
- Helper: "Aluguel, deslocamento, MEI, ferramentas, etc."

### Pergunta 9 · Meta de faturamento mensal

- Tipo: input numérico exato
- Prefixo: R$
- Validação: > 0 e ≤ 200000
- Placeholder: "ex: 10000"
- Helper: "Quanto você gostaria de faturar por mês"

### Pergunta 10 · Fontes de renda hoje

- Tipo: multi-select
- Limite: sem limite
- Atendimento individual
- Turmas ou grupos
- Assessoria online
- Vínculo CLT em academia / box / clube
- Cursos, workshops ou eventos
- Programas digitais (planilhas, cursos gravados)

### Checkpoint 2 · 35%

- Texto: "Números na mesa. Agora suas dores e o que mais te trava."

---

## 5 · BLOCO C · Dores e aspirações

### Pergunta 11 · Suas maiores dificuldades hoje

- Tipo: multi-select
- Limite: máximo 3 escolhas
- Conseguir alunos novos
- Fechar com quem aparece
- Reter alunos por mais tempo
- Cobrar o que valho
- Ter tempo pra tudo
- Parecer profissional online
- Organizar o negócio

### Pergunta 12 · Se pudesse resolver UMA coisa agora

- Tipo: single-select
- Ter mais alunos bons
- Ser percebido pelo que valho
- Trabalhar menos e ganhar igual
- Parar de perder alunos
- Ter um sistema que funcione sozinho

### Pergunta 13 · O que você já tentou que não deu certo

- Tipo: multi-select
- Regra: "nunca tentei" é exclusiva
- Postar conteúdo todo dia
- Pagar agência de marketing
- Fazer site sozinho
- Rodar anúncios por conta
- Pedir indicação ativamente aos alunos
- Contratar social media
- Nunca tentei nada (exclusiva)

### Checkpoint 3 · 48%

- Texto: "Entendi suas dores. Agora como você atrai e converte."

---

## 6 · BLOCO D · Captação e conversão

### Pergunta 14 · De onde vêm a maioria dos seus alunos

- Tipo: multi-select
- Limite: máximo 3 escolhas
- Indicação de alunos atuais
- Instagram orgânico
- Tráfego pago (Meta, Google)
- Abordagem no local de treino
- Parcerias locais
- Google / busca orgânica
- Não sei dizer

### Pergunta 15 · Você usa Instagram profissionalmente

- Tipo: single-select
- Sim
- Não uso

### Pergunta 15a · Quantos seguidores você tem (CONDICIONAL)

- Aparece apenas se P15 = Sim
- Tipo: input numérico exato
- inputMode: numeric
- Placeholder: "ex: 2500"

### Pergunta 16 · Quantos novos interessados aparecem por mês

- Tipo: single-select (faixas)
- 0 a 2
- 3 a 5
- 6 a 10
- 11 a 20
- Mais de 20

### Pergunta 17 · De cada 10 interessados, quantos viram alunos

- Tipo: single-select
- 8 ou mais
- 5 a 7
- 3 a 4
- 1 a 2
- Não meço isso

### Pergunta 18 · Como você organiza a conversão

- Tipo: single-select
- Converso pelo WhatsApp e tento fechar
- Mando proposta ou PDF
- Faço avaliação presencial primeiro
- Não tenho processo definido

### Checkpoint 4 · 65%

- Texto: "Funil mapeado. Agora sua presença digital e retenção."

---

## 7 · BLOCO E · Presença digital e retenção

### Pergunta 19 · Você tem site profissional

- Tipo: single-select
- Sim, profissional e atualizado
- Sim, mas está feio ou desatualizado
- Tenho só Instagram / redes
- Tenho um Linktree ou similar
- Não tenho nada

### Pergunta 20 · Você coleta depoimentos e transformações

- Tipo: single-select
- Sim, de forma sistemática
- Às vezes, quando lembro
- Tenho material mas não publico
- Nunca registrei

### Pergunta 21 · Em média quanto tempo um aluno fica com você

- Tipo: input numérico exato
- Unidade: meses
- inputMode: numeric
- Validação: ≥ 0 e ≤ 240
- Placeholder: "ex: 8"
- Helper: "Se você não tem ideia, coloque uma estimativa"

### Pergunta 22 · Já perdeu aluno por não conseguir mostrar evolução

- Tipo: single-select
- Sim, com frequência
- Algumas vezes
- Raramente
- Nunca pensei nisso

### Checkpoint 5 · 80%

- Texto: "Quase lá. Faltam suas ferramentas e como você opera."

---

## 8 · BLOCO F · Operação e ferramentas

### Pergunta 23 · Como você cobra seus alunos hoje

- Tipo: single-select
- Pix manual todo mês
- Cobrança recorrente automática
- Dinheiro / espécie
- Cartão / maquininha
- Misto

### Pergunta 24 · Onde você guarda hoje as informações dos alunos

- Tipo: multi-select
- Caderno ou papel
- WhatsApp
- Planilha Google ou Excel
- Notion
- App específico (MFIT, Trainerize, etc.)
- Na cabeça mesmo

### Pergunta 25 · Quanto tempo por semana você gasta com administrativo

- Tipo: single-select (faixas)
- Helper: "Cobrar, organizar, responder, planejar"
- Menos de 2h
- 2 a 5h
- 5 a 10h
- Mais de 10h

### Pergunta 26 · Você usa IA hoje pra alguma coisa

- Tipo: multi-select
- Regra: "não uso" e "não sei usar" são exclusivas entre si
- Montar treinos
- Criar conteúdo / textos
- Criar imagens / artes
- Planejar negócio
- Não uso (exclusiva com "não sei usar")
- Não sei usar (exclusiva com "não uso")

### Checkpoint 6 · 92%

- Texto: "Última. Agora você decide o que vem por aí."

---

## 9 · BLOCO G · Visão de produto

### Pergunta 27 · Se existisse uma ferramenta única, o que teria dentro

- Tipo: multi-select
- Limite: máximo 5 escolhas
- Helper: "Pense no que mais te economizaria tempo ou dinheiro"
- Treinos para os alunos
- Cobrança automática
- Agendamento próprio (link pra aluno marcar)
- Sessões online integradas
- Acompanhar evolução com fotos / medidas
- Captar e qualificar novos alunos
- Site profissional próprio
- Histórico e financeiro num lugar só
- Comunidade com os alunos

### Checkpoint final · 100%

- Texto: "Pronto! Agora é só criar sua conta para liberar o diagnóstico."

---

## 10 · Autenticação (uma decisão por tela)

### Tela 1 · Escolha do método

- Apenas dois botões grandes empilhados
- Botão primário: "Continuar com Google"
- Divisor visual fino: "ou"
- Botão secundário: "Continuar com e-mail"
- Sem campos de input nesta tela
- Sem confusão visual

### Tela 2A · Fluxo Google (se escolheu Google)

- Popup OAuth nativo
- Volta com nome e e-mail preenchidos
- Pula direto para Tela 3

### Tela 2B · Fluxo e-mail (se escolheu e-mail)

- Tela de criação de conta
- Apenas 2 campos: e-mail e senha
- Validação de senha (mínimo 8 caracteres)
- Botão: "Criar conta e continuar →"

### Tela 3 · Confirmação do nome

- Pergunta única: "Como você quer ser chamado?"
- Tipo: input texto
- Placeholder: "Ex: Carlos Mendes"
- Pré-preenchido se veio do Google (editável)
- Vazio se veio do e-mail
- Helper: "Esse nome aparece no seu diagnóstico"
- Botão: "Continuar →"

### Tela 4 · WhatsApp

- Pergunta única: "Qual seu WhatsApp?"
- Tipo: input com máscara (DDD) 9XXXX-XXXX
- inputMode: tel
- Validação: 11 dígitos
- Helper: "Vamos enviar seu diagnóstico também por aqui"
- Botão: "Continuar →"

### Tela 5 · Cidade

- Pergunta única: "Em qual cidade você atua?"
- Tipo: autocomplete IBGE
- Campo de busca livre
- Mostra "Cidade · UF" nas sugestões
- API: servicodados.ibge.gov.br/api/v1/localidades/municipios
- Botão: "Continuar →"

### Tela 6 · Instagram (opcional)

- Pergunta única: "Qual seu Instagram profissional?"
- Tipo: input texto com prefixo "@"
- Botão primário: "Continuar →"
- Botão secundário (link): "Pular essa etapa"

### Tela 7 · Consentimento LGPD

- Texto explicativo curto e humano
- Não jurídico, não legalês
- Lista 3 bullets do que é coletado e pra quê
- Link "Ler política completa" abre em modal
- Checkbox: "Concordo com os termos"
- Botão: "Gerar meu diagnóstico →"
- Desabilitado até checkbox marcado

---

## 11 · Tela de processamento (geração da IA)

### Loading com momentum

- NÃO usar spinner genérico
- Tela completa com mensagem dinâmica
- Sequência de mensagens (3–5 segundos cada)
  - "Analisando suas 27 respostas..."
  - "Cruzando com benchmarks do mercado fitness..."
  - "Calculando seu break-even..."
  - "Identificando suas 3 maiores oportunidades..."
  - "Quase lá, montando seu diagnóstico..."
- Streaming visível do conteúdo (texto aparece em tempo real)
- Tempo total estimado: 30–90s

### Estado de erro

- Mensagem clara: "Algo deu errado ao gerar seu diagnóstico"
- Botão "Tentar novamente"
- Suporte: link para WhatsApp do fundador

---

## 12 · Estrutura do relatório (8 seções)

### Cabeçalho

- Saudação personalizada com nome
- Modalidade + cidade + tempo de atuação
- Data de geração
- Botão "Baixar PDF" e "Compartilhar"

### Seção 1 · Indicadores financeiros

- Cards 2x2 em mobile (não 4 colunas)
- Receita mensal atual (alunos × ticket)
- Margem líquida (receita - gastos fixos)
- Ticket médio (você vs benchmark da modalidade)
- Distância da meta (% até a meta)
- Cada card com 1 linha de contexto
- Alimenta: P6, P7, P8, P9, ticket médio do banco

### Seção 2 · Análise SWOT

- Em mobile: lista vertical 1 coluna
- Em desktop: grid 2x2
- Forças
  - Cruzamento de respostas positivas + benchmarks
- Fraquezas
  - Detectadas em P19, P20, P22, P23, P24, P25
- Oportunidades
  - Específicas da modalidade + região (banco)
- Ameaças
  - Específicas da modalidade (banco)

### Seção 3 · Persona do aluno ideal

- Card com avatar, nome fictício
- Idade, perfil, objetivos
- Tags do perfil dominante
- Alimenta: P2 (especialidades) + P12 (resolver UMA coisa)

### Seção 4 · Análise de precificação

- Você vs mercado da modalidade
- 3 faixas: básico, médio, premium
- Em mobile: cards empilhados verticalmente
- Posicionamento atual destacado
- Alimenta: P7 + benchmark + P5 (tempo de atuação)

### Seção 5 · Ponto de equilíbrio

- Quantos alunos pra cobrir custos
- Quantos alunos pra atingir meta
- Barra de progresso visual
- Alimenta: P6 + P7 + P8 + P9

### Seção 6 · Diferenciais e concorrência

- O que você faz bem (cruzamento de respostas)
- Onde está a oportunidade competitiva
- Alimenta: benchmark + P14 + P18 + P19

### Seção 7 · Top 3 ações prioritárias

- Cada ação com: prioridade (1, 2, 3) + título + descrição + por quê
- Cor por prioridade (vermelho urgente, amarelo importante, verde crescimento)
- É a seção mais proeminente visualmente
- Alimenta: cruzamento de todas as respostas + lógica condicional

### Seção 8 · Gancho condicional para o produto

- Tom A (várias dores detectadas)
  - "Suas 3 prioridades exigem ferramentas separadas hoje. Existe um caminho mais simples."
- Tom B (bem estruturado)
  - "Você tem fundamento sólido. O próximo nível é escala."
- CTA: "Ver onboarding.bio →"
- Vai pra landing de fundadores

---

## 13 · Ganchos condicionais (lógica do gancho final)

### Gancho ATIVA se

- P19 = "não tenho nada" ou "feio/desatualizado" ou "Linktree"
  - Vira: "site profissional incluso"
- P18 = "não tenho processo definido"
  - Vira: "formulário inteligente + relatório IA"
- P22 = "sim com frequência" ou "algumas vezes"
  - Vira: "galeria de antes/depois"
- P23 = "Pix manual todo mês"
  - Vira: "cobrança automática"
- P24 inclui "WhatsApp" ou "caderno" ou "na cabeça"
  - Vira: "gestão unificada"
- P25 = "5 a 10h" ou "mais de 10h"
  - Vira: "centralização economiza horas"
- P15a (seguidores) > 5000 e P6 (alunos) < 30
  - Vira: "funil de conversão de seguidores"
- P26 inclui "não uso" ou "não sei usar"
  - Vira: "IA que faz pra você"

### Gancho INATIVO se

- Profissional já tem site profissional + processo de conversão + cobrança automática + dados organizados
- Nesse caso: tom B, fala em escala, não em salvação

---

## 14 · Edge cases e validações

### Validações por pergunta

- P5 (tempo de atuação): 0 a 60 anos
- P6 (alunos): 0 a 999 (permite 0 — caso "ainda não comecei")
- P7 (ticket): 1 a 10000
- P8 (gastos fixos): 0 a 50000
- P9 (meta): maior que P7 × P6 (senão a meta não faz sentido)
- P15a (seguidores): 0 a 10000000
- P21 (permanência): 0 a 240 meses

### Casos especiais que o relatório precisa tratar

- Profissional com 0 alunos: relatório vira "guia de início" em vez de diagnóstico
- Profissional com gastos > receita: alerta financeiro destacado
- Profissional com meta absurda (>10x receita atual): tom de "vamos ajustar expectativa"
- Profissional sem CREF: footer com nota neutra (não bloqueia)
- Nome com 60+ caracteres: trunca com ... no card de cabeçalho mas mostra completo no PDF
- Cidade longa (Ribeirão das Neves): font-size adaptativa no cabeçalho

### Drop-out e recuperação

- Auto-save a cada resposta (sessão local + servidor)
- Se sair sem terminar
  - Recupera ao voltar pela mesma URL
  - E-mail de retomada após 24h (se já passou da P10)
  - WhatsApp de retomada após 48h (se preencheu auth parcial)

---

## 15 · UX e UI das telas de pergunta

### Header fixo (todas as telas do formulário)

- Logo discreto à esquerda
- Barra de progresso fina (2px) com % atual
- Sem texto "X de 27" — apenas %
- Botão voltar (chevron) à direita

### Corpo da pergunta

- Pergunta em tipografia grande (text-2xl mobile, text-3xl desktop)
- Helper opcional em text-sm cinza
- Espaço generoso entre pergunta e opções (32–40px)

### Opções single-select

- Cards empilhados verticalmente
- Altura mínima 56px
- Ícone de check à direita quando selecionado
- Border + bg muda no hover e selected
- Click direto avança para próxima pergunta (sem botão "próximo")

### Opções multi-select

- Cards empilhados verticalmente
- Checkbox visível à esquerda
- Click marca/desmarca, NÃO avança
- Botão "Continuar →" fixo no bottom
- Mostra contador "3 de 4 selecionados" se houver limite

### Inputs numéricos

- Campo grande, font-size 24px
- Prefixo (R$) embutido no campo
- Botão "Continuar →" fixo no bottom
- Habilita ao digitar valor válido

### Checkpoints

- Tela inteira de transição
- Ícone celebrativo (não emoji genérico, ilustração própria)
- Texto motivacional do bloco que terminou
- Texto de antecipação do próximo bloco
- Botão único: "Continuar →"

---

## 16 · O que NÃO está no formulário (e por quê)

### Cortado da versão de 55

- Frequência de postagem no Instagram (inferível)
- Relação com criar conteúdo (excessivo)
- Quanto investe em tráfego pago detalhado (P14 já cobre)
- Razões de parar tráfego (não usa no relatório)
- Programa de indicação (inferível)
- Tempo de resposta a interessados (pouco impacto)
- Razão de não fechar (inferível)
- Razões de saída de alunos (P22 cobre essência)
- Acompanhamento fora das sessões (roadmap, não diagnóstico)
- Como mede progresso (P20 cobre)
- Quando aluno some (excessivo)
- Comunidade entre alunos (roadmap)
- Como prescreve treinos (pesquisa de feature)
- Vídeos de demonstração (pesquisa de feature)
- Como agenda sessões (P23 cobre essência)
- Como faz sessões online (P3 cobre)
- Controle financeiro (P23+P24 cobrem)
- Gasto com ferramentas (sem alimentar relatório)
- Disposição a pagar pela ferramenta (pesquisa pós-MVP)
- Aulas experimentais (P18 cobre)
- Tendência da receita (inferível)
- Orientação nutricional (sem alimentar relatório)

### Não cortado mas movido

- Cidade → pós-auth (precisa para calibração regional)
- Instagram URL → pós-auth opcional
- Nome → tela própria pós-auth
- WhatsApp → tela própria pós-auth

---

## 17 · Métricas de sucesso do formulário

### Métricas de funil (Pixel + CAPI)

- ViewContent: abriu Intro
- StartTrial: clicou "Começar"
- Lead: terminou P10 (50% do formulário)
- LeadQualified: terminou P27 (100% do formulário)
- CompleteRegistration: criou conta
- ReportGenerated: relatório entregue

### Targets do MVP

- Taxa de conclusão: ≥ 60% (Intro → P27)
- Taxa de criação de conta: ≥ 80% (P27 → conta)
- Taxa de visualização do relatório: ≥ 90%
- Tempo médio: ≤ 9 minutos
- Drop por bloco: investigar qualquer bloco com drop > 15%
