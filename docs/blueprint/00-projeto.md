# Blueprint 00 — retake.run (resumo produto + público + arquitetura)

> Status: Active. Última atualização: 2026-06-11.
> Documento síntese — para detalhes, consultar `docs/_handoff/`.

## 1. O que é retake.run

**Plataforma vertical de corrida (endurance) no Brasil.** Um lugar único onde quem treina corredores monta presença, capta alunos, prescreve treino periodizado, gerencia o dia a dia, vende — e onde corredores encontram quem os treina, provas para correr, marcas e cupons.

**Fio condutor:** corrida (endurance). Estrutura nasce preparada pra outras modalidades de resistência (natação, ciclismo, triatlo), mas foco de lançamento é corrida.

**Posicionamento:** não é "criador de sites" nem "app de treino" nem "CRM" isolados — é os três no mesmo lugar, ligados. Fosso central = **núcleo de treino de corrida** (periodização, treino segmentado, prescrito vs executado, integração relógios).

## 2. Os 5 públicos

| Público                                          | Cadastro                                | Paga?                                              |
| ------------------------------------------------ | --------------------------------------- | -------------------------------------------------- |
| **Tenants** (assessoria/run club/coach autônomo) | Self-service                            | Sim — assinatura tenant                            |
| **Atletas** (corredor consumer)                  | Convite do tenant                       | Não — grátis (monetização futura via venda direta) |
| **Sponsors** (marcas)                            | Vem de `/patrocinio` + curadoria admin  | Sim — cota estadual/nacional/oficial               |
| **Suppliers** (fornecedores B2B)                 | Vem de `/empresas` + KYC/KYB admin      | Sim — Vitrine B2B R$ 99/mês                        |
| **Event organizers**                             | Lista evento sem conta + claim via CNPJ | Não (futuro: checkout próprio com fee)             |

Detalhe completo em `docs/_handoff/planos-onboarding-permissoes.md`.

## 3. Os módulos (o que a plataforma faz)

Cravados no handoff `docs/_handoff/README.md` §3:

1. **Vitrine & Captação** — site `retake.run/{slug}` + formulário leads + diretório rede + CRM básico
2. **Gestão de Alunos** — atletas + anamnese + avaliações + grupos + notas
3. **Núcleo de Treino (fosso)** — limiares + macrociclo/mesociclo/microciclo/sessão + treino segmentado + prescrito × executado + wearable
4. **Conteúdo & Cursos** — programas estilo Hotmart, desacoplado do treino
5. **Agenda & Recursos** — turmas + check-in + recursos físicos (salas/equipamentos)
6. **Financeiro** — mensalidades + cobrança + inadimplência + split marketplace JIT
7. **Comunicação** — email + push + templates + régua automática + in-app + chat treinador↔aluno
8. **Eventos & Provas** — calendário comunidade-mantido + curadoria + moderação anti-fake
9. **Marketplace & Produtos** — físico/dropship/digital/serviço + split fornecedor/assessoria/retake
10. **Patrocínio & Marcas** — escopo geográfico + faixa de marcas + cupons
11. **Cupons & Afiliados** — receita retake via AWIN/Rakuten/direto
12. **App do Aluno** — 1 app nativo único retake (RN/Expo JIT)
13. **Inteligência & Relatórios** — IA com aprovação humana
14. **Construção Aberta** — roadmap + voto Apoiador+Membro + changelog

## 4. Arquitetura essencial

### 4.1 Identidade — Party Model

```
public.parties (pessoa | organização) → ligada ao auth.users
   ↓
public.party_roles (role_type + scope + status + vigência)
   ↓
public.tenants (materializado de party_role(tenant) pra perf RLS)
   ↓
public.memberships (role enum 7 valores + position_label + permissions jsonb + group_id)
```

**Role enum cravado:** `owner | coach | finance | reception | marketing | athlete | lead`.

JWT injeta: `tenant_id` + `active_membership_role` + `party_id`.

### 4.2 Schema único `public.*`

RLS é a fronteira de segurança. Schema separado SÓ JIT (PCI, secrets vault).

### 4.3 Multi-tenant + white-label

**2 universos visuais:**

| Universo           | Onde                             | Marca                            | Editável por                                                                                     |
| ------------------ | -------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------ |
| **DS retake fixo** | painel/admin/landings/app        | retake (grafite/creme/terracota) | ninguém                                                                                          |
| **Tema do tenant** | site público `retake.run/{slug}` | personalizada                    | Grátis: 6 paletas curadas · Apoiador: builder completo + IA cor de foto · Membro: bespoke retake |

### 4.4 Vibe-coding-ready dia 1

**Composição no banco** (`page_versions.content jsonb`):

```jsonc
{
  "style_preset": "retake-default | minimalista | swiss | neo-brutalism",
  "blocks": [
    { "id", "kind": "hero", "variant": "default", "visible": true, "sort": 1 },
    ...
  ],
  "slots": { "hero": {...}, "plans": [...] }
}
```

Dados em tabelas template-agnostic (`coaches`/`plans`/`services`/`testimonials`/`gallery`). Copy em `slots`. Composição em `blocks[]`. IA edita tudo via tools registradas em `public.ai_tools` + approval gate em `public.engine_plans`.

### 4.5 IA arquitetura multi-agent

- `public.chats(agent_kind enum, scope_id NULL)`
- `public.ai_tools` registry SSOT
- `public.engine_plans` approval gate opt-in
- `public.audit_log` mutações IA

**UX Opção C:**

- Chat com preview embarcado em surfaces de criação (estilo v0/Lovable)
- Chat geral em balão flutuante operacional
- Inline ✨/`/ai` em campos chave

### 4.6 Stack

Next 16 + React 19 + Tailwind v4 + shadcn new-york + Supabase ssr + Zod 4 + RHF 7 + Zustand 5 + next-intl 4 (3 locales) + AI SDK v6 + AI Gateway + Sonnet 4.6 + Haiku 4.5 + TanStack Query + date-fns + Recharts + Lucide + Oswald + Hanken Grotesk + Space Mono via `next/font` + Motion 12 + Resend + BotID + DOMPurify.

## 5. Fluxos principais

### Onboarding tenant

1. Cria conta (email/Google) em `/cadastrar`
2. Escolhe Grátis | Apoiador | Membro (Grátis ativa imediato sem cartão)
3. Chat-as-form de IA pergunta tipo de tenant + local + equipe + parceiros + serviços + cobrança
4. Tenant manda uploads (prints Instagram + PDFs com dados/preços/planos)
5. IA extrai paleta + copy + dados + voz + cria cadastros automaticamente
6. Preview renderizado com tudo
7. Tenant escolhe paleta (6 curadas + 1 personalizada IA = upsell Apoiador)
8. Publica → site no ar em `retake.run/{slug}`

### Captação → conversão

1. Corredor encontra assessoria (diretório ou link), preenche form
2. Vira lead no CRM com origem + status "novo"
3. Régua dispara (boas-vindas, follow-up)
4. Treinador trabalha lead até fechar
5. Converte em atleta → cadastro + anamnese + plano de mensalidade

### Prescrição de treino (fase 2+)

1. Treinador registra limiares (pace + FC) — sistema deriva zonas
2. Cria temporada (macrociclo) com prova-alvo
3. Divide em blocos (mesociclos) + semanas (microciclos)
4. Cada dia = sessão com segmentos (aquecer/principal/recuperar/soltar) com alvos
5. Parte de modelo de plano ou monta do zero
6. Atleta executa via app, sincroniza relógio
7. Plataforma compara prescrito × executado + calcula aderência verde/amarelo/vermelho

## 6. Fases ordem cravada

```
Fase 1 — Entra dinheiro + diferencial imediato
  Vitrine & Captação · Gestão de Alunos · Financeiro · Fornecedores · Patrocinadores

Fase 2 — Retém o cliente
  Agenda · Núcleo de Treino & Periodização · Comunicação

Fase 3 — Encanta o aluno
  App nativo · Eventos & Provas

Fase 4 — Escala marketplace
  Marketplace completo · split automatizado · portais

Fase 5 — Inteligência
  Relatórios e assistentes IA

Multi-tenant atravessa todas as fases — é arquitetura, não fase.
```

## 7. Princípios de produto

1. **Vertical de corrida** — especialista, não genérico
2. **Uma entidade, vários papéis** — papel mora na relação, um login N planos
3. **Cliente é um só tipo** — sem subtipo, plano define
4. **Biblioteca + composição** — peças reutilizáveis referenciadas, nunca copiadas
5. **Conteúdo no banco, estrutura no produto** — muda texto/cor sem republicar
6. **Versão imutável** — cada publicação = retrato fixo
7. **IA com aprovação humana** — IA propõe, pessoa decide
8. **Multi-moeda desde o desenho**
9. **Marca fixa no produto, dinâmica na vitrine** — painel/app retake, site do cliente
10. **App nativo único** — 1 app retake, não 1 por cliente
11. **Construção aberta** — roadmap, votação, changelog públicos
12. **Foco antes de escopo** — entregar fase atual antes de abrir próxima

## Referências

- `docs/_handoff/README.md` — handoff completo (SSOT)
- `docs/_handoff/banco-de-dados.md` — schema spec detalhada
- `docs/_handoff/modelo-de-produto.md` — modelo de negócio (sites, cupons, patrocínio)
- `docs/_handoff/planos-onboarding-permissoes.md` — planos × onboarding × KYC × RBAC
- `docs/_handoff/retake.run Design System (4)/` — DS completo (tokens + components + UI kits HTML)
- `docs/adr/0001-foundation.md` — ADR fundadora consolidada
- `docs/plans/foundation.md` — sprints S0-S7 executáveis
