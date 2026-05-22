# 0046. Dogfooding-first execution order (meta-princípio)

Date: 2026-05-22
Status: accepted

## Context

Pós-ADR-0044 (pivot TweakCN/shadcn-canonical) + ADR-0045 (Registry Strategy

- AI Orchestration + Novel), o projeto tinha **stack cravada** mas faltava
  crava decisão sobre **ordem de execução das features** e o **meta-princípio**
  que rege "como começar a construir produto" sem cair em premature framework
  nem em hardcoded throwaway.

Research-44 (`docs/research/44-real-players-integration-patterns.md`)
validou a stack via auditoria de 20 players reais (10 course/community
platforms + 11 AI-native builders): GoHighLevel valida modelo white-label
agency multi-tenant em escala bilhão hits/dia; Tiptap em produção massiva
(LinkedIn, GitLab, Anthropic, Substack, NYT via ProseMirror); shadcn
registry production validado via MakerKit + Supastarter; AI orchestration
híbrida confirmada pelo state-of-the-art (Lovable hydration, Replit Agent 3,
Vercel Artifacts). **80% cobertura via precedents proven; 20% novel mas com
base sólida.**

Research-45 (`docs/research/45-component-strategy-best-practices.md`) cravou
arsenal de 20 essential primitives upfront + folder structure
`components/blocks/*` + AI catalog discoverability via JSDoc.

A peça que faltava era **escolha de ordem de execução** + **regra-mestra**
pra evitar dois anti-padrões clássicos:

1. **Premature framework:** construir engine "completo" sem nenhuma feature
   real consumindo — engine cravada em premissas imaginadas, vira código
   no escuro
2. **Hardcoded throwaway:** construir feature com tudo embutido na rota,
   sem extração de abstrações — vira "vou refatorar depois" que nunca
   acontece, e a próxima feature similar duplica o trabalho

A agência (`desafit.app` Pacote A + funil agência) é nosso **primeiro
tenant real**. Logo, faz sentido usar nossas próprias ferramentas pra
construir o funil da agência — dogfooding rigoroso valida em runtime real.

## Decision

**Princípio meta amplo (aplicável a TODAS features futuras):
dogfooding-first execution order.**

### 1. Cada feature nasce como primeira instância de infra generalizada (não hardcoded)

- Form de captação da agência = **primeira instância do Forms Engine
  bare-bones** (não form hardcoded em rota)
- Página de vendas da agência = **primeira instância do Pages Engine
  bare-bones** (não landing hardcoded)
- Report IA do form da agência = **primeira instância do AI Reports
  Engine bare-bones** (research-25 ready-to-consume)

Bare-bones aqui significa: schema Zod + render + persist + minimal CRUD —
NÃO inclui editor visual, builder UI, AI generation (essas vêm depois,
como passo 5 da ordem). Engine cresce com requisitos reais; sem 1 instância
consumindo, engine não nasce.

### 2. Manual primeiro → sistematização/automação depois

Construir 1 instância manual (form da agência criado em código, página de
vendas em JSX, report IA com prompt hardcoded) **ensina o que engine
precisa**. Só depois disso vale construir o builder/AI generation.

Anti-padrão capturado: pular fase manual → engine cravada em premissa
errada → refactor cego quando feature real chegar.

### 3. Dogfooding rigoroso: agência = primeiro tenant

A agência é nosso primeiro tenant. Usar **nossas próprias ferramentas**
(theme builder, Forms Engine, Pages Engine, AI Reports) pra construir o
funil da agência valida ferramentas em **runtime real** — não em fixture
artificial.

Consequência: cada peça do funil agência vira **template reutilizável**
pros próximos tenants (Pacote A entrega "agência ready-to-go" porque a
agência já provou).

### 4. Ordem de execução cravada (instância concreta deste princípio)

Ordem aplicada na sessão 2026-05-22 (esta ADR cravou):

1. **Theme builder** (~34h) — Fase 5 do pivot-tweakcn, copy literal
   TweakCN + adapt multi-tenant, admin-only inicial. Detalhe técnico em
   `docs/plans/theme-builder.md` (portado do pivot arquivado 2026-05-22). Plano executor:
   `docs/plans/theme-builder.md`
2. **Form de captação da agência** — primeira instância do Forms Engine
   bare-bones (dogfooding)
3. **Report IA do form da agência** — primeiro form com IA report.
   Research-25 (`docs/research/25-ai-reports-architecture.md`) tem 30+
   decisões cravadas ready-to-consume, economiza ~10h de estudo
4. **Página de vendas da agência** — primeira instância do Pages Engine
   bare-bones (dogfooding)
5. **AI builders (pages + forms engines)** — construir builders enquanto
   funil agência já está capturando leads. Receita entra em paralelo
   com infra crescendo
6. **Restante do projeto** — manual primeiro, sistematização depois
   (programa manual → automação)

Itens DEFERRED desta execução (cravados em `docs/_deferred/post-funil-agencia.md`):

- AI generation de themes (era Fase 6 do pivot — IA gera theme via
  Gemini Flash + image-to-theme + chat UI editor)
- v0 integration (era Fase 7 — registry endpoint pra v0 consumir,
  ideação dev-only per ADR-0045 D.1)
- Pacote A/B/C details (surgem naturalmente nos planos)
- 3 GAPs research-43 (rate limit AI per-tenant, domain catalog skeleton,
  block schema versioning)
- Tiptap collab, Novel + theme override PoC, Novel mídia
- `registry-blocks.md` rule (criar quando 3+ block kinds em produção)
- `block-catalog.json` build script (placeholder até primeiro block)

## Consequences

### Positivas

- **Zero código sem consumer real.** Engine cravada com requisitos
  reais (não premature abstraction).
- **Receita entra paralelo à infra:** agência capta leads enquanto AI
  builders são construídos.
- **Reusabilidade gratuita:** pages/forms da agência viram primeiros
  templates pros próximos tenants (Pacote A entrega "agência
  ready-to-go").
- **Validação contínua:** dogfooding força encontrar bugs e UX issues
  em runtime real, não em fixture artificial.
- **Anti-frescura cravada:** princípio "manual primeiro" mata
  pseudo-features que parecem útil mas não têm consumer (lead scoring
  fancy sem demanda real, A/B test sem volume, etc — vide memory
  `feedback_frescura_filter.md`).

### Negativas

- **Time-to-market:** theme builder antes do funil = ~34h de "infra
  invisível" antes de receita começar. Mitigação: ordem está cravada
  por motivo concreto (theme system é fundação pra tudo visual; sem
  ele, qualquer landing/page seria refactor depois).
- **Risco premature framework:** se engine bare-bones for inflada de
  features especulativas, vira anti-padrão "premature framework".
  Mitigação: princípio "instância primeira" (item 1) — engine cresce
  só com requisito concreto da instância sendo construída AGORA.
- **Risco hardcoded throwaway:** se feature for construída sem
  extração mínima pra engine, vira "vou refatorar depois". Mitigação:
  princípio "manual primeiro" (item 2) inclui obrigação de extrair
  abstrações enquanto a primeira instância está sendo construída — não
  num batch separado depois.
- **Disciplina de revisitar `_deferred/`:** itens adiados podem
  morrer esquecidos se ninguém revisitar quando o gatilho aparecer.
  Mitigação: regra registrada em CLAUDE.md ("revisitar a cada plano
  novo pra ver se algum gatilho disparou").

### Princípios cravados

1. **Feature = instância de infra generalizada** (espelha memory
   `feedback_mil_passos_a_frente.md`)
2. **Manual primeiro → sistematização depois** (espelha
   `.claude/rules/abstractions.md`: "abstração nasce do 3º uso real")
3. **Dogfooding obrigatório:** agência é nosso primeiro tenant
4. **Ordem cravada NÃO é dogma:** outros planos podem cravar suas
   próprias ordens; o que NÃO muda é o princípio meta (cada feature
   nasce como instância de infra, manual primeiro)

## Referências

- **ADR-0044** — pivot TweakCN/shadcn-canonical (stack)
- **ADR-0045** — Registry Strategy + AI Orchestration + Novel (registry)
- **ADR-0041** — Engine catalog 2 motores (Form + Page) — engines que
  esta ADR materializa via primeiras instâncias
- **research-44** — real players integration patterns (validou stack)
- **research-45** — component strategy best practices (cravou arsenal +
  folder + catalog)
- **research-25** — AI reports architecture (30+ decisões
  ready-to-consume pro item 3 da ordem)
- **memory `feedback_mil_passos_a_frente.md`** — cravou conceito antes
  desta ADR formalizar
- **memory `feedback_frescura_filter.md`** — filtro contra
  pseudo-features sem demanda real
- **memory `feedback_dogfooding_first.md`** — formalizou meta-princípio
  pós-esta ADR
- **`docs/plans/theme-builder.md`** — plano executor do item 1 da
  ordem (próximo plano após pivot-tweakcn finalizar)
- **`docs/plans/funil-agencia.md`** — plano que retoma com itens 2-5 da
  ordem
- **`docs/_deferred/post-funil-agencia.md`** — itens adiados desta
  execução (não-bloqueante, revisitar JIT)
- **`.claude/rules/abstractions.md`** — princípio "abstração nasce do 3º
  uso real" (alinhado com manual-first)
