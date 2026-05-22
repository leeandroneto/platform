# Deferred — pós funil agência (revisitar JIT)

> **Tipo:** registro de decisões "fazer depois" (não-bloqueante).
> **Data:** 2026-05-22
> **Princípio cravado por ADR-0046:** dogfooding-first — itens deste
> arquivo NÃO bloqueiam execução atual. Quando o gatilho específico
> chegar, item retorna pro plano ativo.

---

## Sobre este arquivo

Pasta `docs/_deferred/` foi criada pela primeira vez em 2026-05-22 (G4
confirmado pelo user). Cada arquivo aqui registra itens que foram
**decididos a NÃO fazer agora** com o gatilho específico de retorno.

**Por que existe:** sem registro formal, Claude futuro re-deduz a decisão
ou pior, esquece e re-faz trabalho. Memory `feedback_jit_anchoring.md`
já cravou: "adiar decisão exige hook/lint/rule path-loaded apontando
playbook; senão Claude futuro re-deduz".

**Anti-padrão a evitar:** deixar arquivo morrer — revisitar a cada plano
novo pra ver se algum gatilho disparou.

**Quando promover item de volta:**

- Gatilho concreto cumprido (ex: "3 consumers existem em produção")
- Plano ativo precisar do item pra avançar
- ADR nova exigir o item como dependência

---

## 1. AI generation de themes (era Fase 6 do pivot-tweakcn)

**O que é:** IA gera theme via Gemini Flash + image-to-theme + chat UI
editor (geração full theme a partir de brief, foto referência, ou
descrição natural).

**Gatilho original:** seria Fase 6 do `docs/plans/pivot-tweakcn.md`.

**Por que deferred:** ADR-0046 cravou ordem dogfooding-first — theme
builder admin-only (Fase 5) basta pra funil agência. AI gen entra depois
que funil estiver capturando leads.

**Quando retornar:** após item 5 da ordem ADR-0046 (AI builders pages +
forms engines) estabilizar — porque o pattern AI será reusado.

**Stack já planejada:**

- `google/gemini-2.5-flash` (fallback de `gemini-3-flash-preview`,
  ADR-0045 D.16)
- `streamObject` + `safeParse` retry 3x (ADR-0045 D.5 + D.17 APCA gate)

---

## 2. v0 integration (era Fase 7 do pivot-tweakcn)

**O que é:** registry endpoint pra v0 consumir nossos themes/blocks,
ideação dev-only per ADR-0045 D.1 (`/api/r/themes/[tenantId]/v0`).

**Gatilho original:** seria Fase 7 do `docs/plans/pivot-tweakcn.md`.

**Por que deferred:** v0 está **demoted** (ADR-0045 D.1 — não runtime,
só ideação). Endpoint pode ser construído JIT quando tenant pedir
"starter project v0-compatible".

**Quando retornar:** tenant Pro+ pedir explicitamente OR após Pacote A
ter 3+ tenants ativos.

---

## 3. AI patterns copy TweakCN

**O que é:** padrões de código que research-44 cravou pra copy JIT da
ai-chatbot reference clone:

- `createDocumentHandler<T>()` factory pattern (`lib/artifacts/server.ts`
  da ai-chatbot) → adapta pra `createBlockHandler<T>()` quando 3+ kinds
- Tool layer pattern (`lib/ai/tools/create-document.ts`) → adapta pra
  `createPage` / `updatePage` / `applyPagePatch`
- `resumable-stream` pacote — quando theme generation ou page generation
  ficar lenta (5-30s) → resume stream pós-disconnect

**Gatilho:** copy JIT quando AI builders chegarem (item 5 da ordem
ADR-0046).

**Por que deferred:** copy prematuro vira código no escuro. Esperar
requisito concreto.

---

## 4. `block_kinds_catalog` table promotion

**O que é:** migration que cria tabela `block_kinds_catalog` com
metadados de blocks (ai_hints, variants, composition) — substituí JSDoc
`@registry-meta` interim.

**Gatilho cravado (ADR-0045 D.3):** 3 features distintas precisam ler o
catálogo dinamicamente em runtime simultaneamente:

1. AI composer (Fase 6 antiga)
2. Builder UI (Fase 5)
3. Dev tool exporter / preview tool (Fase 7)

**Quando retornar:** quando as 3 existirem em produção. Hoje (2026-05-22)
nenhuma existe ainda — Fase 5 ainda não executou.

---

## 5. Pacote A details (páginas + formulários + checkouts pros tenants)

**O que é:** Pacote A do roadmap M0→M3 — primeira oferta paga pra
profissional individual. Inclui:

- Páginas configuradas via builder
- Formulários gerados via IA
- Checkout integrado
- Onboarding profissional

**Por que deferred:** Pacote A surge naturalmente depois que o **funil
agência** validar tudo (research-44 GoHighLevel valida modelo). Não
construir Pacote A direto = anti-padrão "skip dogfooding" (ADR-0046).

**Quando retornar:** após item 5 da ordem ADR-0046 (AI builders) +
funil agência ter 3+ leads convertidos.

---

## 6. Pacote B details (programas + PWA portal aluno + gamificação)

**O que é:** Pacote B — programas/desafios criados pelo profissional,
consumidos pelo aluno via PWA. Inclui gamificação, tracking, lessons.

**Por que deferred:** Pacote B vem depois de Pacote A ter consumers
reais. Construir engine de programa sem profissional consumindo =
premature framework (ADR-0046 anti-padrão).

**Quando retornar:** após Pacote A ter 3+ tenants ativos.

---

## 7. Pacote C details (A+B+bônus chatbot grátis)

**O que é:** Pacote C combo — A+B+bônus chatbot grátis pro aluno.

**Por que deferred:** combo só faz sentido quando A e B existirem.

**Quando retornar:** após Pacote B ter 1+ tenant ativo.

---

## 8. 3 GAPs research-43 (rate limit AI / domain catalog / schema versioning)

**O que é:** 3 gaps arquiteturais identificados em research-43:

- **GAP-1 rate limit AI per-tenant** (Upstash ratelimit) — proteção contra
  abuse de tenants individuais nas APIs de AI generation
- **GAP-3 domain catalog skeleton** — catálogo formal de domínios
  (custom domain per tenant) pra Fase 9 (Pacote C)
- **GAP-4 block schema versioning path** — addendum ADR-0041 com path
  de migration de schema de blocks (breaking change → URL segment v2)

**Gatilho original:** background workstream paralelo durante Fase 5
(8h wall-time).

**Por que deferred:** ADR-0046 mudou ordem — Fase 5 vai executar via
plano `theme-builder.md`, mas os 3 GAPs não são bloqueantes pra Fase 5
(eles afetam Fase 6/7 antigas, que viraram items 5+6 da nova ordem).

**Quando retornar:** antes do item 5 da ordem ADR-0046 (AI builders) —
ou JIT se algum tenant abusar API antes.

---

## 9. Tiptap collab (research-38 H.9 bonus — y-tiptap)

**O que é:** collaborative editing em Lesson editor multi-author via
`y-tiptap` + Liveblocks ou similar.

**Gatilho cravado (ADR-0045 open Q1):** 2+ admins simultâneos virarem
dor documentada. LWW + ETag/409 Conflict resolve até lá.

**Quando retornar:** quando 2+ tenants pedirem feature explicitamente
OU bug "perdi edição porque colega editou junto" aparecer 3x.

---

## 10. Novel + theme override PoC (research-38 H.10 bonus)

**O que é:** PoC confirmando que Tiptap (underneath Novel) renderiza
com CSS vars corretas em Lesson view via `<style precedence="theme">`.

**Gatilho cravado (ADR-0045 open Q2):** executar antes de instalar
Novel em produção.

**Quando retornar:** quando Lesson editor entrar em escopo executável
(provavelmente Pacote B).

---

## 11. Mídia em Novel (research-38 H.11 bonus — video embed vs link)

**O que é:** decisão arquitetural sobre como Novel handles vídeo
(YouTube/Vimeo extension Tiptap custom vs link apenas) e imagem
(Vercel Blob via storage engine).

**Gatilho cravado (ADR-0045 open Q3):** quando Lesson editor entrar em
escopo.

**Quando retornar:** Pacote B.

---

## 12. `.claude/rules/registry-blocks.md` rule — **PROMOVIDA 2026-05-22**

**Status:** ✅ criada em 2026-05-22 (supersedes deferred original) — user
optou por cravar invariante D.13 desde dia 1 do theme-builder em vez de
esperar 3+ block kinds. Razão: princípio "registry-ready desde dia 1"
(ADR-0045 + ADR-0046 dogfooding-first) — cada componente do editor
TweakCN copiado nasce no formato canonical, evita refactor cego depois.

**Arquivo final:** `.claude/rules/registry-blocks.md` path-loaded em
`lib/contracts/page-blocks/**`, `lib/contracts/form-blocks/**`,
`components/blocks/**`. Conteúdo: invariante D.13 + JSDoc
`@registry-meta` formato canonical + composition rules
L1↘npm/L2↘L1/L3↘L2 + 3 namespaces + smart blocks composição
declarada.

**O que continua deferred:** ESLint rule custom validando JSDoc
estrutural + build script `scripts/build-block-catalog.ts` — gatilhos
cravados na rule "Condição de revisitar" (5+ block contracts).

---

## 13. `scripts/build-block-catalog.ts` build script

**O que é:** script Node que extrai JSDoc `@registry-meta` de
`lib/contracts/page-blocks/*.ts` + `lib/contracts/form-blocks/*.ts` →
gera `lib/generated/block-catalog.json` (gitignored, prebuild).

**Gatilho:** quando primeiro block kind existir.

**Quando retornar:** item 2 da ordem ADR-0046 (form agência) é primeiro
candidato — mas form bare-bones pode não ter `@registry-meta` formal.
Decidir JIT.

**Anti-padrão:** criar script sem block kind real = código no escuro.

---

## Planos detail portados (2026-05-22 — pivot-tweakcn arquivado)

Quando gatilho disparar, consultar:

- `docs/_deferred/ai-theme-generation-detail.md` — Fase 6 antiga (~25h, model policy + APCA gate + quota tracking)
- `docs/_deferred/v0-registry-integration-detail.md` — Fase 7 antiga (~12h, tenant_pages/blocks schema + registry endpoint + block_kinds_catalog gatilho 3 consumers)
- `docs/_deferred/validation-suite-detail.md` — Fase 8 antiga (Playwright matrix + presets seed + showcase route + métricas saúde)

Anti-padrão: não esquecer dessa lista. Revisitar a cada plano novo pra ver se gatilho disparou.

---

## OSS references por feature (2026-05-22)

Lista cravada de projetos open source que podem ser copiados/integrados/estudados pra cada feature futura. Reduz risco de reinventar roda.

**Localização:** `docs/_deferred/oss-references-by-feature.md`

**Cobertura (13 categorias):** AI orchestration · Forms · AI Reports · Pages/Visual builders · AI app builders · Programs/LMS · Workflow builders · Admin panels · Email builders · CMS · Component libraries · Analytics · Prose editors

**Foco prioritário por feature (ordem ADR-0046):**

- **Form agência (item 2):** Survey.js (copy spec) + Formbricks (estudar arquitetura — AGPL)
- **Report IA (item 3):** Vercel AI Chatbot Artifacts (copy pattern) + Mastra + Inngest
- **Sales page (item 4):** Puck (copy) + Payload CMS (schema-driven inspiração)
- **AI builders (item 5):** Vercel AI Chatbot + OpenV0 + Mastra + AutoGen patterns
- **Pacote B (programs):** LearnHouse (estudar) + xyflow (copy flow lib)
- **Email builders (futuro):** Maily (copy editor) + React Email (já)

Cada feature consulta o arquivo ANTES de implementar. Anti-padrão: implementar sem consultar e descobrir tarde que tinha OSS proven cobrindo 80%.

---

## Revisão deste arquivo

**Quando revisitar:** a cada plano novo abrir. Conferir se algum gatilho
disparou pra item retornar pro plano ativo.

**Checklist de revisão:**

- [ ] Item ainda faz sentido? (princípio mudou? superseded por ADR nova?)
- [ ] Gatilho disparou? (consumer real existe agora?)
- [ ] Promover item pro plano ativo OU manter aqui com data de
      revisão atualizada?

Se item morrer (princípio mudou, superseded), marcar com `**Status:
abandoned (data)**` em vez de deletar — histórico preservado.
