# CONTEXT.md — onboarding.bio

> **Leia este arquivo antes de tomar qualquer decisão técnica ou de produto.** Ele consolida todas as decisões já tomadas e o estado atual do projeto. Se algo não estiver aqui, perguntar antes de assumir.

**Última atualização:** 2026-04-28

---

## 1. Identidade e contexto

| Item              | Valor                                                          |
| ----------------- | -------------------------------------------------------------- |
| Produto           | **onboarding.bio** (nunca "Onbio", nunca "onbio.com")          |
| Fundador          | Leandro Jose de Oliveira Neto                                  |
| CNPJ              | 66.415.032/0001-66                                             |
| Razão social      | Leandro Jose de Oliveira Neto Desenvolvimento de Software LTDA |
| Localização       | Americana, SP                                                  |
| Domínio principal | onboarding.bio                                                 |
| Rotas públicas    | `onboarding.bio/[slug]` (site do profissional)                 |
| App               | `app.onboarding.bio` (futuro — hoje tudo no domínio raiz)      |

### Posicionamento

- **Promessa central:** captação de novos alunos pra profissionais autônomos da área de saúde/fitness
- **Gestão é bônus**, não destaque comercial
- **Inicial:** personal trainers (CREF). **Futuro:** nutricionistas, fisioterapeutas, psicólogos
- **Diferencial vs concorrentes (Tecnofit/Trainerize):** loop fechado captação → retenção → cases → captação

### Modelo de negócio

| Fase                             | Detalhe                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------- |
| Beta (atual)                     | R$ 47/mês vitalício, 50 vagas, plano único                                   |
| Pós-beta público                 | R$ 97/mês                                                                    |
| Add-on                           | Site profissional customizado sob consulta (manual via WhatsApp do fundador) |
| Fase 2 (marketplace de desafios) | Split nativo 70/30 (profissional/plataforma) via Pagar.me                    |

### Vitalício do beta cobre

- Core atual no momento do lançamento
- Features futuras integradas ao core entram conforme lançadas
- **Add-ons separados (treino IA premium, etc) NÃO entram** — declarado em contrato beta

---

## 2. Roles do sistema

**Importante:** sempre `client` (não `student`), pra preparar pra outras profissões.

| Role           | Quem                                  | Permissões                        |
| -------------- | ------------------------------------- | --------------------------------- |
| `professional` | Personal trainer, nutri, fisio, psico | Tudo do próprio tenant            |
| `client`       | Aluno/cliente final                   | Apenas o que está vinculado a ele |
| `admin`        | Equipe onboarding.bio                 | Plataforma inteira                |

Um usuário pode ter múltiplos roles (ex: trainer que é cliente de outro trainer).

---

## 3. Stack técnica

| Camada                         | Tecnologia                                                         | Status                                            |
| ------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------- |
| Frontend                       | Next.js (App Router)                                               | Em uso                                            |
| Backend                        | API routes Next.js + tRPC ou Hono                                  | Em uso                                            |
| Database                       | PostgreSQL (Supabase)                                              | Em uso                                            |
| Auth                           | Supabase Auth (com roles)                                          | Hoje só `professional`, **expandir pra `client`** |
| Multi-tenant                   | Row Level Security (RLS) Postgres                                  | Em uso                                            |
| IA                             | Claude API (Haiku para relatórios, Sonnet para gerações complexas) | Em uso                                            |
| Email transacional             | Resend                                                             | Em uso                                            |
| Pagamento mensalidade          | EFI Bank (Pix Automático)                                          | Em uso                                            |
| Pagamento marketplace (Fase 2) | Pagar.me (split nativo)                                            | A configurar                                      |
| WhatsApp                       | Cloud API oficial Meta                                             | A configurar (chip dedicado)                      |
| Hospedagem                     | Vercel (frontend) + Supabase (backend/db)                          | Em uso                                            |
| Background jobs                | Inngest ou Trigger.dev                                             | A definir                                         |
| Storage                        | Supabase Storage                                                   | Em uso                                            |
| Monitoramento                  | Sentry                                                             | Em uso                                            |

---

## 4. O que JÁ existe no produto (MVP1)

- Auth do `professional`
- Onboarding do profissional (signup + setup)
- Formulários de captação com 6 modalidades + 33 templates de especialidades
- Geração de relatório IA via Haiku após preenchimento do formulário
- Template único do site profissional `onboarding.bio/[slug]` (carcaça pronta, ajustes pendentes)
- Editor do site profissional

### O que falta no MVP1 (em construção)

- Painel de leads (status, follow-up, side sheet Notion-style)
- Gestão básica de clientes (importação CSV, status, planos)
- Cadastros que alimentam site + relatório IA: serviços, preços, planos, depoimentos texto/vídeo, transformações antes/depois, galeria
- Configurações editáveis: tom IA, método por especialidade, perguntas extras no formulário
- WhatsApp Cloud API (notificações, botões interativos, bot conversacional task-specific)
- Emails transacionais (verificação, boas-vindas, confirmação)

---

## 5. Desafios — prioridade total (próxima fase, antes do resto)

> **Escopo MVP do desafio:** apenas o template "21 Dias Mais Leve" (emagrecimento, baseado em coprodução com Pri Ortiz). Depois de validado, sistematiza pros outros 32 templates.

### 5.1 Modelo conceitual (inspirado Hotmart)

```
DESAFIO (produto)
  └─ MÓDULOS (fases nomeadas: aquecimento, semana 1, semana 2...)
      └─ COMPONENTES (qualquer bloco)
          ├─ aula_gravada
          ├─ aula_presencial
          ├─ live_grupo
          ├─ call_individual
          ├─ treino
          ├─ tarefa (check-in)
          ├─ mensagem (manhã/noite/áudio)
          ├─ material (PDF, link)
          └─ conteudo_educacional
```

### 5.2 Princípios de modelagem (CRÍTICOS)

Esses princípios garantem que o futuro vibe coding funcione (profissional descreve "quero 30 dias hipertrofia com 2 lives/semana e 1 call quinzenal" → IA monta a estrutura). **Não violar:**

1. **Componente é genérico.** `component_type` enum, com `payload JSONB` específico de cada tipo (validado por schema).
2. **Hierarquia flexível.** Desafio → 0..N módulos → 0..N componentes. Módulo é opcional (desafio pode ser flat).
3. **Schedule desacoplado.** Quando um componente aparece (dia X, semana Y, sob demanda, condicional ao progresso) é tabela separada (`component_schedules`) — não é coluna do componente.
4. **Template vs instância vs enrollment.** Modelo Hotmart:
   - `challenge_template` (criado por onboarding.bio ou pelo profissional) — a "receita"
   - `challenge_instance` (afiliação do profissional com customizações: nome, marca, preço, ajustes)
   - `enrollment` (cliente comprou uma instance)
5. **Configurações em JSONB com schema.** Entregas (treino sim/não, alimentação sim/não, hábitos sim/não, gamificação sim/não) em JSON validado. Evita 50 colunas booleanas.
6. **Dependências entre componentes.** Componente X só libera após Y completo. Tabela `component_dependencies` (DAG simples).
7. **Estados explícitos.** Tudo tem `status` enum (rascunho, publicado, arquivado, em_andamento, concluido).

### 5.3 Schema de banco (DDL Postgres pronto pra Supabase)

```sql
-- =========================================
-- USERS & ROLES
-- =========================================

-- Auth do Supabase já cria auth.users
-- Adicionamos perfil estendido

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  cpf TEXT UNIQUE,
  birthdate DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE user_role AS ENUM ('professional', 'client', 'admin');

CREATE TABLE user_roles (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, role)
);

-- =========================================
-- PROFESSIONALS (tenants)
-- =========================================

CREATE TYPE profession AS ENUM (
  'personal_trainer',
  'nutritionist',
  'physiotherapist',
  'psychologist',
  'other'
);

CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  profession profession NOT NULL,
  council_id TEXT, -- CREF, CRN, CREFITO, CRP
  council_validated_at TIMESTAMPTZ,
  bio TEXT,
  method_description TEXT, -- max 500 chars, alimenta o relatório IA
  ai_tone_config JSONB DEFAULT '{}'::jsonb, -- tom, extensão, nível técnico, palavras proibidas
  branding JSONB DEFAULT '{}'::jsonb, -- cores, logo, favicon
  custom_domain TEXT UNIQUE, -- futuro: dominioproprio.com.br
  is_active BOOLEAN DEFAULT TRUE,
  beta_user BOOLEAN DEFAULT FALSE, -- vitalício R$ 47
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_professionals_slug ON professionals(slug);
CREATE INDEX idx_professionals_custom_domain ON professionals(custom_domain) WHERE custom_domain IS NOT NULL;

-- =========================================
-- CLIENTS (relacionamento profissional ↔ cliente)
-- =========================================

CREATE TYPE client_status AS ENUM ('lead', 'contacted', 'active', 'inactive', 'churned');

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id), -- NULL se ainda não criou conta
  -- Dados que podem existir antes da conta ser criada:
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status client_status DEFAULT 'lead',
  source TEXT, -- formulário, importação manual, indicação
  notes TEXT,
  tags TEXT[],
  current_plan_id UUID, -- FK pra plans depois
  active_since DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_clients_professional ON clients(professional_id);
CREATE INDEX idx_clients_status ON clients(professional_id, status);
CREATE INDEX idx_clients_phone ON clients(phone);

-- =========================================
-- PLANS, SERVICES (oferta do profissional)
-- =========================================

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TYPE plan_billing AS ENUM ('monthly', 'quarterly', 'semestral', 'yearly', 'one_time');

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price_cents INT NOT NULL,
  billing plan_billing NOT NULL,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- SOCIAL PROOF
-- =========================================

CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  client_name TEXT NOT NULL, -- pode ser anônimo
  client_photo_url TEXT,
  content TEXT, -- texto do depoimento
  video_url TEXT, -- ou link YouTube/Instagram
  lgpd_consent BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  client_name TEXT NOT NULL,
  before_photo_url TEXT NOT NULL,
  after_photo_url TEXT NOT NULL,
  duration_days INT,
  description TEXT,
  lgpd_consent BOOLEAN DEFAULT FALSE,
  is_visible BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE gallery_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- LEAD CAPTURE (já existe, manter)
-- =========================================

CREATE TABLE specialty_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  modality TEXT NOT NULL, -- musculacao, corrida, ciclismo, crossfit, natacao, triathlon
  specialty TEXT NOT NULL, -- emagrecimento, hipertrofia, etc
  display_name TEXT NOT NULL,
  questions JSONB NOT NULL, -- array de perguntas (Bloco K + Bloco V)
  is_active BOOLEAN DEFAULT TRUE,
  version INT DEFAULT 1
);

CREATE TABLE professional_templates (
  -- Quais templates o profissional ativou
  professional_id UUID REFERENCES professionals(id) ON DELETE CASCADE,
  template_id UUID REFERENCES specialty_templates(id),
  custom_questions JSONB DEFAULT '[]'::jsonb, -- perguntas extras adicionadas
  method_specific TEXT, -- método dele nessa especialidade (max 500 chars)
  is_active BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (professional_id, template_id)
);

CREATE TABLE lead_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES specialty_templates(id),
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  answers JSONB NOT NULL,
  ai_report TEXT,
  ai_report_generated_at TIMESTAMPTZ,
  client_id UUID REFERENCES clients(id), -- se virou cliente
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- CHALLENGES (PRIORIDADE — modelo Hotmart)
-- =========================================

-- Template do desafio (criado por onboarding.bio ou pelo profissional)
CREATE TYPE challenge_format AS ENUM ('online', 'presencial', 'hybrid');
CREATE TYPE challenge_cohort_type AS ENUM ('individual_rolling', 'group_fixed', 'both');

CREATE TABLE challenge_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Quem criou: NULL = onboarding.bio (oficial), UUID = profissional
  created_by_professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,

  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,

  -- Identidade
  modality TEXT NOT NULL, -- musculacao, corrida, etc
  specialty TEXT NOT NULL, -- emagrecimento, hipertrofia, etc
  target_audience TEXT, -- "mulheres 30-45 com rotina corrida"

  -- Formato
  format challenge_format NOT NULL,
  cohort_type challenge_cohort_type NOT NULL,
  duration_days INT NOT NULL,
  group_size_min INT,
  group_size_max INT,

  -- Configurações de entrega (JSONB validado)
  -- Exemplo: { "training": true, "nutrition": "rule_of_3", "habits": true, "gamification": true }
  delivery_config JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Metadados
  is_official BOOLEAN DEFAULT FALSE, -- TRUE = onboarding.bio criou
  is_active BOOLEAN DEFAULT TRUE,
  version INT DEFAULT 1,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Módulos (fases) do template
CREATE TABLE challenge_template_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_template_id UUID NOT NULL REFERENCES challenge_templates(id) ON DELETE CASCADE,
  name TEXT NOT NULL, -- "Reativação", "Construção", "Consolidação"
  description TEXT,
  display_order INT NOT NULL,
  starts_on_day INT, -- dia do desafio em que módulo começa (NULL = sem módulo)
  ends_on_day INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Componentes do template (qualquer bloco)
CREATE TYPE component_type AS ENUM (
  'aula_gravada',
  'aula_presencial',
  'live_grupo',
  'call_individual',
  'treino',
  'tarefa',
  'mensagem',
  'material',
  'conteudo_educacional'
);

CREATE TABLE challenge_template_components (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_template_id UUID NOT NULL REFERENCES challenge_templates(id) ON DELETE CASCADE,
  module_id UUID REFERENCES challenge_template_modules(id) ON DELETE CASCADE, -- NULL se desafio é flat

  component_type component_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INT NOT NULL,

  -- Payload específico do tipo (validado por schema no app)
  -- Exemplos:
  -- treino: { exercises: [...], sets: [...], video_urls: [...] }
  -- live_grupo: { duration_minutes: 60, platform: 'zoom', topics: [...] }
  -- call_individual: { duration_minutes: 30, frequency: 'biweekly' }
  -- mensagem: { time: '07:00', content: '...', media_url: '...' }
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Schedule: quando o componente aparece
CREATE TYPE schedule_type AS ENUM (
  'fixed_day',          -- dia específico (ex: dia 7)
  'recurring_weekly',   -- toda terça e quinta
  'on_progress',        -- após completar X
  'on_demand'           -- sob demanda
);

CREATE TABLE component_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component_id UUID NOT NULL REFERENCES challenge_template_components(id) ON DELETE CASCADE,
  schedule_type schedule_type NOT NULL,
  -- Configuração específica do tipo de schedule (JSONB)
  -- fixed_day: { day: 7 }
  -- recurring_weekly: { days_of_week: ['tue', 'thu'], time: '19:00' }
  -- on_progress: { after_component_id: 'uuid', delay_hours: 24 }
  config JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Dependências entre componentes (DAG simples)
CREATE TABLE component_dependencies (
  component_id UUID REFERENCES challenge_template_components(id) ON DELETE CASCADE,
  depends_on_component_id UUID REFERENCES challenge_template_components(id) ON DELETE CASCADE,
  PRIMARY KEY (component_id, depends_on_component_id)
);

-- Instância: profissional afilia o template
CREATE TABLE challenge_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_template_id UUID NOT NULL REFERENCES challenge_templates(id),
  professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,

  -- Customizações da identidade
  custom_name TEXT, -- se o profissional renomear
  custom_subtitle TEXT,
  custom_description TEXT,
  custom_branding JSONB DEFAULT '{}'::jsonb,

  -- Pagamento
  price_cents INT NOT NULL,
  platform_fee_pct DECIMAL(5,2) DEFAULT 30.00, -- comissão onboarding.bio

  -- Datas (cohort_type = group_fixed)
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  enrollment_deadline TIMESTAMPTZ,

  -- Capacidade
  max_enrollments INT,
  current_enrollments INT DEFAULT 0,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- draft, published, in_progress, completed, archived

  -- WhatsApp grupo (cola link manual, sistema distribui)
  whatsapp_group_links TEXT[], -- múltiplos links se mais de 1 grupo
  whatsapp_group_capacity INT DEFAULT 256,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_challenge_instances_professional ON challenge_instances(professional_id);
CREATE INDEX idx_challenge_instances_status ON challenge_instances(status);

-- Customizações da instance em componentes específicos
CREATE TABLE challenge_instance_component_overrides (
  challenge_instance_id UUID REFERENCES challenge_instances(id) ON DELETE CASCADE,
  component_id UUID REFERENCES challenge_template_components(id) ON DELETE CASCADE,
  override_payload JSONB NOT NULL,
  PRIMARY KEY (challenge_instance_id, component_id)
);

-- Enrollment: cliente comprou
CREATE TYPE enrollment_status AS ENUM (
  'pending_payment',
  'active',
  'completed',
  'cancelled',
  'refunded'
);

CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_instance_id UUID NOT NULL REFERENCES challenge_instances(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  status enrollment_status NOT NULL DEFAULT 'pending_payment',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  -- Pagamento (Pagar.me)
  payment_id TEXT, -- ID da transação no gateway
  amount_paid_cents INT,
  platform_fee_cents INT, -- parte da onboarding.bio
  professional_payout_cents INT, -- parte do profissional

  -- WhatsApp grupo atribuído
  whatsapp_group_link TEXT,

  -- Onboarding pós-pagamento
  intake_answers JSONB, -- respostas do Bloco K + V
  intake_completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enrollments_client ON enrollments(client_id);
CREATE INDEX idx_enrollments_instance ON enrollments(challenge_instance_id);

-- Progresso do enrollment
CREATE TABLE enrollment_component_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  component_id UUID NOT NULL REFERENCES challenge_template_components(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, available, completed, skipped
  completed_at TIMESTAMPTZ,
  data JSONB DEFAULT '{}'::jsonb, -- ex: respostas de check-in, peso registrado, etc
  UNIQUE (enrollment_id, component_id)
);

-- =========================================
-- CLIENT TRACKING (galeria, evolução)
-- =========================================

CREATE TABLE client_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES enrollments(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  check_in_date DATE NOT NULL,

  -- Métricas
  weight_kg DECIMAL(5,2),
  measurements JSONB, -- { waist: 80, hip: 95, ... }
  mood_rating INT, -- 1-5
  energy_rating INT, -- 1-5

  -- Conteúdo
  notes TEXT,
  photo_urls TEXT[],

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  taken_at DATE,
  category TEXT, -- before, progress, after, achievement
  caption TEXT,
  is_shared_with_professional BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================
-- WHATSAPP & COMMUNICATION
-- =========================================

CREATE TABLE whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Remetente/destinatário
  from_phone TEXT NOT NULL,
  to_phone TEXT NOT NULL,

  -- Contexto
  conversation_type TEXT, -- 'group', 'dm'
  related_entity_type TEXT, -- 'enrollment', 'lead', 'client', 'challenge_instance'
  related_entity_id UUID,

  -- Conteúdo
  message_type TEXT, -- text, button, list, media
  content TEXT,
  payload JSONB,

  -- Direção
  direction TEXT NOT NULL, -- 'inbound', 'outbound'

  -- Meta
  meta_message_id TEXT,
  status TEXT, -- sent, delivered, read, failed

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_whatsapp_phone ON whatsapp_messages(from_phone, to_phone);
CREATE INDEX idx_whatsapp_entity ON whatsapp_messages(related_entity_type, related_entity_id);

CREATE TABLE whatsapp_templates (
  -- Templates aprovados pela Meta
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meta_template_name TEXT UNIQUE NOT NULL,
  category TEXT, -- utility, marketing, authentication
  body TEXT NOT NULL,
  variables TEXT[],
  status TEXT, -- pending, approved, rejected
  approved_at TIMESTAMPTZ
);

-- =========================================
-- AI INTERACTIONS (auditoria)
-- =========================================

CREATE TABLE ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  professional_id UUID REFERENCES professionals(id),

  generation_type TEXT NOT NULL, -- 'lead_report', 'daily_message', 'sentiment_analysis', 'challenge_creation'
  model_used TEXT NOT NULL, -- 'haiku', 'sonnet', 'opus'

  input_tokens INT,
  output_tokens INT,
  cost_cents DECIMAL(10,4),

  prompt_template TEXT,
  prompt_variables JSONB,
  output TEXT,

  related_entity_type TEXT,
  related_entity_id UUID,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 5.4 Recursos do desafio (configuráveis)

#### Identidade

- Nome, subtítulo, descrição, especialidade, modalidade
- Público-alvo (faixa etária, sexo, contexto de vida)

#### Formato (todas combinações suportadas)

- 100% online | 100% presencial | híbrido (com proporção)
- Individual rolling | grupo fechado cohort | ambos
- Tamanho: pequeno 5-10 | médio 10-25 | grande 25-50 | massivo 50+

#### Encontros ao vivo

- Live de abertura (kick-off)
- Lives semanais durante o programa
- Aulas em grupo (treino coletivo)
- Mentorias / Q&A em grupo
- Live de encerramento (celebração)
- Avaliação inicial (call individual)
- Sessões particulares periódicas
- Calls de checkpoint pontuais
- Sob demanda

#### Plataformas suportadas

- Zoom, Google Meet, WhatsApp, Instagram Live, plataforma própria (futuro)

#### Duração

- 7, 14, 21, 30, 45, 60, 90 dias ou contínuo (consultoria)
- Linear sem fases | com fases nomeadas

#### Entregas configuráveis

- Treino sim/não
- Alimentação (Regra dos 3 sim/não — escolha estruturada de alimentos, não prescrição)
- Hábitos (água, sono, etc)
- Conteúdo educacional
- Gamificação (pontos, streak, leaderboard)

### 5.5 Dashboard do cliente (PWA, 6 abas)

| Aba            | Conteúdo                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| **Home**       | Saudação, tarefa de hoje em destaque, check-in rápido, progresso visual                                    |
| **Programa**   | Calendário com dias completos/pendentes/futuros, modo "hoje" destacado                                     |
| **Evolução**   | Gráficos peso, medidas, comparação fotos antes/depois, histórico cargas, **galeria pessoal**, estatísticas |
| **Comunidade** | Link grupo WhatsApp, mural check-ins, ranking opcional, conquistas dos colegas                             |
| **Recursos**   | Material apoio, lista alimentos, receitas, FAQ, falar com profissional                                     |
| **Perfil**     | Dados, configurações notificação, LGPD, termos, suporte                                                    |

Notificações push do PWA: lembrete check-in, mensagem do profissional, conquista desbloqueada, próximo marco.

### 5.6 Automações & IA do desafio

#### WhatsApp Cloud API

- Mensagens diárias manhã/noite
- Check-in noturno com botões interativos (Reply Buttons até 3, List Messages até 10)
- Mensagens especiais por fase (dia 1, 3-5, 7, 14, 15, reta final, último dia)
- Aha moments programados
- Acolhimento automático em risco
- CTA Buttons abrem dashboard

#### Notificações IA pro profissional

- Alunos em risco (sem check-in 3 dias, dor reportada)
- Marcos completados (semana 1, primeiro PR)
- Operação (novo aluno, pagamento, grupo cheio)
- Análise semanal agregada
- IA NUNCA decide tecnicamente — sempre flagga pra profissional decidir

#### Análise de sentimento

- Claude API analisa respostas livres de check-ins
- Detecta dor, ansiedade, conquista
- Combina regras simples + IA

#### Geração automática de cases

- Cliente bate marco → card gerado → trainer aprova → vira material de marketing
- Cases viram landings públicas SEO-otimizadas (loop de captação)

#### Gestão de grupos WhatsApp

- **Cloud API NÃO cria grupos programaticamente** — limitação Meta
- Profissional cria grupo manual e cola link
- Sistema distribui automaticamente pros novos enrollments (decrementa vagas)
- Quando lota, alerta o profissional pra criar próximo grupo
- Sistema sugere mensagens pro profissional postar (gera por dia/fase) — profissional posta manualmente

### 5.7 Pagamento & operação do desafio

- **Pagar.me com split nativo** (configurar antes da Fase 2)
- Default: 70% profissional / 30% onboarding.bio (configurável por instance)
- Cada parte recebe direto na conta bancária
- Cada parte emite NF da sua parte (split fiscal Opção 2 — Facilitador)
- Página de venda do desafio (estrutura Doity adaptada)
- Onboarding pós-pagamento: Bloco K (universal) + Bloco V (por especialidade)
- Distribuição automática em grupo
- Pesquisa de saída + pitch continuidade no fim

### 5.8 Pré-requisitos legais para Fase 2

- [ ] Adicionar CNAE 74.90-1/04 ao CNPJ (intermediação) — **fazendo agora sozinho via VRE|REDESIM**
- [ ] Pagar.me com split habilitado
- [ ] Termos de uso específicos do marketplace
- [ ] Política de reembolso CDC (7 dias)
- [ ] Contrato de afiliação trainer-onboarding.bio
- [ ] Validação CREF do profissional antes de habilitar como recebedor

### 5.9 Roadmap de criação de desafios

**Fase atual (manual):** templates pré-prontos (começar pelo "21 Dias Mais Leve"), profissional afilia e customiza marca/preço/ajustes.

**Fase futura (vibe coding):** profissional conversa com IA tipo "quero 30 dias hipertrofia com 2 lives semana e 1 call individual quinzenal", IA monta toda hierarquia (módulos, componentes, mensagens, dashboard) e profissional só ajusta. Por isso o schema precisa ser muito modular desde já.

---

## 6. Arquitetura de domínios e roteamento

```
onboarding.bio                         → site institucional / marketing
onboarding.bio/[slug]                  → site público do profissional (template único)
onboarding.bio/login                   → login profissional
onboarding.bio/dashboard               → app do profissional
onboarding.bio/c                       → app do cliente
onboarding.bio/c/login                 → login cliente
onboarding.bio/[slug]/desafio/[id]     → página de venda do desafio
onboarding.bio/admin                   → admin onboarding.bio

futuro:
{slug}.onboarding.bio                  → subdomínio (upgrade)
dominioproprio.com.br                  → custom domain (premium)
```

### Slugs reservados (proteger no signup)

`api, admin, login, signup, dashboard, c, blog, help, pricing, sobre, contato, app, www, mail, ftp, suporte, status, docs, beta, dev, staging`

---

## 7. Decisões fechadas (NÃO debater novamente)

| #   | Tópico                    | Decisão                                                                   |
| --- | ------------------------- | ------------------------------------------------------------------------- |
| D1  | Domínio                   | onboarding.bio com slug `[slug]`                                          |
| D2  | Preço beta                | R$ 47/mês vitalício, 50 vagas                                             |
| D3  | Modalidades MVP1          | Manter as 6 (musculação, corrida, ciclismo, crossfit, natação, triathlon) |
| D4  | Treino IA                 | Adiado pra Fase 11 (commodity, não diferencial)                           |
| D5  | Agenda interna            | Adiada pra Fase 11                                                        |
| D6  | App nativo                | Não no MVP1; PWA na Fase 2                                                |
| D7  | Feature gating            | Adiado, beta tem plano único                                              |
| D8  | Tráfego pago como serviço | Não. Curso self-service + templates                                       |
| D9  | Site customizado          | Upsell manual via WhatsApp do fundador                                    |
| D10 | Pagamento mensalidade     | EFI Bank (Pix Automático)                                                 |
| D11 | Pagamento marketplace     | Pagar.me com split (Fase 2)                                               |
| D12 | WhatsApp                  | Cloud API oficial Meta                                                    |
| D13 | 1 software ou 2           | 1 codebase, áreas separadas por role                                      |
| D14 | Auth do cliente           | Mesmo sistema com role `client`, login completo (não magic link minimo)   |
| D15 | Role do aluno             | `client` (NÃO `student`) — preparado pra outras profissões                |
| D16 | Modelo fiscal             | Split nativo (Opção 2 Facilitador)                                        |
| D17 | CNAE Fase 2               | 74.90-1/04 (intermediação)                                                |
| D18 | Stack frontend            | Next.js App Router                                                        |
| D19 | Stack DB                  | Supabase Postgres com RLS                                                 |
| D20 | Hierarquia desafio        | Modelo Hotmart: template → instance → enrollment                          |
| D21 | Componente desafio        | Genérico com payload JSONB validado                                       |
| D22 | Schedule componente       | Tabela separada (não coluna)                                              |
| D23 | Galeria do cliente        | Aba dedicada na evolução                                                  |
| D24 | Vibe coding desafio       | Futuro, depois de validado o template manual                              |
| D25 | Primeiro template MVP     | "21 Dias Mais Leve" (emagrecimento, coprodução com Pri Ortiz)             |

---

## 8. Glossário de termos

| Termo                 | Significado                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| Profissional          | Personal trainer, nutri, fisio, psico — quem usa o SaaS                     |
| Cliente               | Aluno final, consumidor do serviço do profissional                          |
| Lead                  | Pessoa que preencheu formulário mas não virou cliente ainda                 |
| Tenant                | Profissional (no contexto multi-tenant)                                     |
| Template (de desafio) | Receita reutilizável criada por onboarding.bio ou pelo profissional         |
| Instance (de desafio) | Afiliação do profissional ao template, com customizações                    |
| Enrollment            | Cliente comprou uma instance                                                |
| Componente            | Bloco genérico do desafio (live, call, treino, mensagem, etc)               |
| Módulo                | Fase do desafio (agrupador de componentes)                                  |
| Schedule              | Quando o componente aparece pro cliente                                     |
| Bloco K               | Formulário universal de intake (todo desafio precisa)                       |
| Bloco V               | Questionário customizado por especialidade                                  |
| Regra dos 3           | Estrutura alimentar simples (3 proteínas + 3 carbos + 3 gorduras + 1 fibra) |
| Mega doc              | Documento gerador-de-desafios (3.911 linhas, 21 blocos + Anexo A)           |
| Mapa-mestre           | Os 33 templates de especialidades organizados                               |
| Aha moment            | Momento programado de virada emocional (ex: dia 14 do 21 Dias)              |
| Vibe coding           | Profissional descreve em linguagem natural e IA monta o desafio             |
| Cohort                | Turma fechada com data de início e fim                                      |
| Rolling               | Cliente entra a qualquer momento (não tem turma fechada)                    |

---

## 9. O que NÃO fazer

- Nunca chamar o produto de "Onbio" ou "onbio.com" — é **onboarding.bio**
- Nunca usar `student` ou `aluno` no schema/código — é **client**
- Nunca duplicar auth (profissional + cliente) — sempre **roles num único sistema**
- Nunca sugerir microserviços antes de problema real — monolito Next.js basta
- Nunca adicionar coluna booleana de feature toggle — usar JSONB validado
- Nunca prescrever dieta individualizada (sem nutri) — só **Regra dos 3** com escolha estruturada
- Nunca decidir tecnicamente pelo profissional via IA — IA **flagga**, profissional decide
- Nunca tentar criar grupos WhatsApp programaticamente — Meta não permite, profissional cria manual
- Nunca skipar `lgpd_consent` em depoimentos/transformações
- Nunca expor dados de outro tenant (RLS sempre obrigatório)

---

## 10. Como pedir ajuda ao Claude

Ao começar uma sessão de código, abrir com:

> "Lê CONTEXT.md antes de qualquer coisa. Estou trabalhando em [feature específica]. Considere as decisões fechadas e o schema existente."

Se Claude propuser algo que conflita com este CONTEXT, parar e perguntar antes de implementar.

---

**Fim do CONTEXT.md.**
