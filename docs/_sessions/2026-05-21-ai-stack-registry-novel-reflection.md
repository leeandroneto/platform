# Sessão 2026-05-21 — AI stack, Registry, Novel, v0 (reflexão)

> **Tipo:** reflexão em curso (não-decidido). Não é ADR.
> **Captura:** discussão estratégica sobre como integrar Claude + TweakCN + shadcn + v0 + (eventualmente) Novel/Registry no produto. Sobrevive compactação.
> **Quando promover:** se virar decisão cravada → ADR + atualizar plano. Se virar feature concreta → entrar em plano dia 2 ou pivot Fase 5/6.

---

## 1. Pergunta inicial — Claude + TweakCN integra?

**Estado:** não há integração "oficial" botão-de-conectar entre Anthropic API e TweakCN.

**O que existe na prática:**

- Claude como assistente de código dentro do editor (VS Code, Cursor, Windsurf, Claude Code)
- TweakCN gera tema → JSON/Tailwind config → cola no Claude → Claude adapta/gera código
- MCP servers (Model Context Protocol) — Claude consegue editar arquivos do projeto direto
- Fluxo possível: TweakCN exporta tema → Claude transforma em design system completo (components, dark mode, tokens semânticos)

**Stack composta que a comunidade usa:**

- VS Code / Cursor (IDE)
- Claude Code (assistant)
- shadcn (UI primitives)
- TweakCN (theme editor)
- v0 (generative UI)

Workflow inteiro pra construir apps — mas integração "verdadeira" depende de MCP + automação custom, não plug-and-play.

---

## 2. Novel — o que é e onde encaixa

### O que Novel É

- **Editor visual estilo Notion** com IA embutida
- Rich-text editor AI-native (Tiptap base + AI commands)
- Experiência de **escrita** com IA

### O que Novel NÃO é

- Não organiza arquitetura
- Não orquestra backend
- Não gerencia multi-tenant
- Não substitui Claude
- Não substitui v0
- Não gera sistemas completos

### Camadas

| Camada                | Quem              |
| --------------------- | ----------------- |
| Cérebro / reasoning   | Claude Sonnet     |
| Interface de escrita  | Novel             |
| Geração de UI         | v0 / Claude       |
| Identidade visual     | TweakCN + tokens  |
| Renderização          | shadcn primitives |
| Theme switching       | next-themes       |
| Operação via comandos | cmdk              |

### Onde Novel encaixa no nosso produto

**Útil:**

- Program builder (módulos, aulas, capítulos)
- Protocol builder (semanas, tarefas, hábitos, cronogramas)
- Lesson editor (texto + embeds + vídeos + PDFs + IA assistindo)
- Journals / check-ins
- Profissional "conversa" pra criar conteúdo longo AI-native

**NÃO entra:**

- Landing pages
- Visual page builder (drag-and-drop)
- Runtime multi-tenant
- Registry / theming / orchestration
- AI workflow engine

### Veredito honesto

**Não é obrigatório.** Prioridade média.

- Faz sentido se quisermos experiência "Notion AI / Coda AI / Kajabi AI editor"
- Não faz sentido se foco for "visual page builder / AI funnel / AI app builder / AI CRM"

**Stack ideal realista pra nós:**

- **Core obrigatório:** Next.js, Supabase, shadcn/ui, Tailwind, Radix, TweakCN-way, next-themes, Claude API, cmdk
- **MUITO importante:** Registry architecture (decisão coração do sistema)
- **Opcional premium:** Novel (só pra editor de protocolos/aulas/conteúdo AI-native)

---

## 3. Registry vs v0 vs Templates — o grande debate

### v0 — IA gera UI livremente

```
prompt → LLM gera JSX/Tailwind → resultado visual
```

**Bom pra:** prototipagem, velocidade, inspiração, MVP

**Ruim pra SaaS real (depois de escalar):**

- Inconsistência, duplicação, componentes diferentes
- Patterns quebrados, acessibilidade inconsistente
- Código imprevisível, theming difícil
- Multi-tenant difícil

### Templates / blocos fixos (no-code clássico)

Modelo Webflow / Kajabi / Hotmart / ClickFunnels / Elementor.

```
escolhe template → edita blocos manualmente → publica
```

**Limitação:** usuário monta tudo manualmente, IA tem pouco espaço pra atuar com inteligência estrutural.

### Registry — contrato entre IA e UI

```
Define blocos possíveis → IA orquestra → sistema renderiza
```

**4 problemas que resolve:**

1. **Normalização** — IA escolhe de catálogo finito (HeroSection, CTASection, etc) em vez de inventar livre
2. **Consistência de design** — todos blocos usam shadcn + tokens TweakCN
3. **Composição inteligente** — IA define ordem, hierarquia, variantes, configuração, conteúdo (não inventa JSX)
4. **Evolução controlada** — melhorias propagam pra todos blocos existentes

**Analogia central:**

- Sem registry: IA = escritor criativo sem regras → UI = qualquer coisa
- Com registry: IA = escritor que só pode usar palavras permitidas + estruturas definidas + padrões validados

**Registry NÃO compete com Claude:**

| Claude      | Registry        |
| ----------- | --------------- |
| pensa       | executa         |
| decide      | restringe       |
| cria plano  | oferece possibs |
| gera estrut | garante consist |

### 3 níveis do Registry moderno

1. **Primitive blocks** — Button, Card, Input, Modal
2. **Semantic blocks** — HeroSection, PricingSection, QuizSection, ProtocolTimeline
3. **Smart blocks** — TransformationFunnel, HealthOnboarding, WorkoutJourney, HormoneTracker (com lógica + analytics + IA + estado + automações)

### Output IA com Registry

```json
[
  { "type": "Hero", "variant": "premium", "headline": "...", "cta": "..." },
  { "type": "VideoProof", "style": "carousel" },
  { "type": "CTA", "intent": "high-conversion" }
]
```

Não JSX arbitrário. Composição estruturada + configuração.

---

## 4. Veredito do debate (opinião externa que recebi)

### Templates → suficiente?

Até certo ponto. Não escala IA criando páginas/programas/funis/estruturas multi-tenant.

### IA livre (v0/Claude) → suficiente?

Não. Cada página sai diferente, inconsistente, difícil de manter, quebra em multi-tenant.

### Registry é necessário?

**Não obrigatório pra MVP.** Pode lançar com:

- Templates
- Blocos shadcn
- IA gerando páginas livres
- Supabase backend

**Vira necessário quando:**

- Quer consistência real
- Quer escalar IA
- Quer multi-tenant sério
- Quer UX premium
- Quer evitar caos de geração
- Quer produto "SaaS de verdade"

### Soluções prontas pra builder?

- Webflow (semi-AI), Framer AI, Bolt, v0, Lovable, Relume, Builder.io
- **NENHUMA resolve bem:**
  - Multi-tenant profundo
  - Vertical SaaS (protocolos / programas)
  - IA estruturada por domínio

### Caminho recomendado realista (3 fases)

| Fase                  | O que                                                            |
| --------------------- | ---------------------------------------------------------------- |
| **1 — MVP rápido**    | Templates + blocos shadcn + IA gerando páginas livres + Supabase |
| **2 — Controle**      | "Capturar padrões bons da IA" → transformar em blocos oficiais   |
| **3 — Registry real** | IA só compõe blocos + sistema consistente + multi-tenant forte   |

**Frase central:**

> Registry não limita a IA — ele transforma criatividade em produto escalável.

---

## 5. Insights soltos / amarrar com nosso plano atual

### Já temos partes do quebra-cabeça

- **shadcn primitives** ✅ (zona quarentenada, ADR-0040)
- **TweakCN-way** ✅ cravado (ADR-0044)
- **next-themes** ✅ instalado (G.4 Fase 4 wire-up)
- **Claude Code** ✅ ferramenta de dev (não user-facing)
- **Supabase** ✅
- **Form Engine + Page Engine** ✅ blueprints 21 (ADR-0041) — já modela "spec JSONB + renderer" que É a base do registry

### O que ainda não temos decidido

- **Posição sobre Novel** — produto precisa de editor AI-native pra programas/protocolos? Ou textarea + markdown basta dia 0?
- **Posição sobre Registry vs v0 puro vs templates** — Fase 7 do pivot já reserva schema `tenant_pages` + `tenant_blocks` pra "v0 como feature". Mas plano não cravou ainda se é v0-livre ou registry-restrito
- **Fase 2 caminho (3-stage)** sugerido por essa reflexão:
  1. MVP: templates + IA livre Claude/v0
  2. Controle: capturar padrões → blocos oficiais
  3. Registry real

### Conexão com ADR-0041

ADR-0041 já estabelece **Page Engine** com `pages.kind` polimórfico + spec JSONB recursivo `{ type, props, children[] }`. Isso É **a infraestrutura de registry** que essa reflexão argumenta ser necessária — só precisa ganhar **catálogo de blocks oficiais** + AI composer pra virar registry completo.

Caminho prático:

- Page Engine existe (ADR-0041)
- Falta: `block_kinds` catálogo (Smart blocks vertical-specific)
- Falta: AI composer que emite spec (não JSX)
- Falta: cura de blocks que IA gerou ao longo do tempo → adiciona ao catálogo

### Decisões abertas (não cravar agora, capturar pra futuro)

1. **Novel sim/não** — vale prototipar AI editor pra programa/protocolo (Fase 9-10 hipotética) OU markdown + IA inline basta?
2. **Registry granularidade dia 0** — Form Engine + Page Engine (já temos) basta como "registry mínimo" ou precisa explícito `block_kinds_catalog`?
3. **v0 escopo** — Fase 7 do pivot trata v0 como "geração JSX bruta com adapter pra spec" — mantém? Ou v0 vira fonte só de "ideação de novos block kinds"?
4. **AI composer arch** — Claude orquestra spec via tool calling? Ou pipeline Gemini-Structured-Output → Zod validation → save?
5. **3-stage migration** — adotar literal (templates → captura → registry) ou já cravar registry desde Fase 7?

### Não-conflitos com pivot atual

- Pivot TweakCN (ADR-0044) é sobre **theme system** (cores, fontes, radius, shadow) — ortogonal a UI composition / page builder
- Page Engine (ADR-0041) é compatível com qualquer um dos 3 paradigmas (templates / IA livre / registry)
- Decidir registry vs v0 não bloqueia Fase 4 (theme storage) — pode esperar Fase 7

### Recomendação minha (não cravada, opinião do main thread)

Lente "registry organicamente" combina bem com filosofia que já temos:

- Decisões study-first
- JIT vs upfront
- Catalog + Registry + Spec (memória `feedback_mil_passos_a_frente.md`)
- Form Engine + Page Engine já são "registries" embrionários

Não precisa decidir agora. Quando chegar Fase 7 do pivot (v0 integration), revisar:

- Implementar v0 como **ideation tool** que gera spec PageEngine
- Adicionar `block_kinds_catalog` table dia 0 da Fase 7 (mesmo se vazia inicialmente)
- AI composer (Fase 6) emite spec, não JSX
- Curadoria humana: blocos repetidos pela IA viram entries no catalog

---

## 6. Próximas perguntas pra futuro (não responder agora)

- Novel vs custom AI editor — qual é melhor pra editor de programa/protocolo do profissional?
- Block kinds catalog — tabela própria ou enum em `pages.kind`?
- Como medir "X blocos repetidos pela IA → cabe no catalog"? Threshold?
- Vertical-specific blocks (fitness vs yoga vs idiomas) — extends catalog ou via `kind` polimórfico que já temos?
- v0 SDK ou Vercel AI Gateway com Claude + tool calling?

---

## 7. Status pós-reflexão

- **Não decidido nada** — capturado pra futuro
- **Conexões cravadas:**
  - ADR-0041 (Page Engine) ✅ já é fundação registry
  - Pivot Fase 7 (v0) ⏳ vai precisar dessa decisão
  - Pivot Fase 6 (AI gen theme) é orthogonal — não toca aqui
- **Action items:** nenhum imediato. Re-visitar ao chegar Fase 7 do pivot.
- **Promovido pra:** nada ainda. Quando virar decisão cravada, criar ADR-0045 (ou similar) "Registry strategy".

---

## Referências cruzadas

- ADR-0041 — engine catalog (Form + Page) — fundação do registry
- ADR-0044 — pivot TweakCN-way (theme system, ortogonal)
- `docs/blueprint/21-engine-catalog.md` — vocab dos engines
- `docs/plans/pivot-tweakcn.md` § Fase 7 (v0 integration) — onde essa decisão vai cravar
- Memória `feedback_mil_passos_a_frente.md` — "Catalog+Registry+Spec; nada hardcoded"
