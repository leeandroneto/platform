# 0047. Fork vs Clone+Adapt — critério A-D pra decidir adoção OSS

Date: 2026-05-22
Status: accepted

## Context

ADR-0044 cravou pivot TweakCN-way: COPY+ADAPT do upstream TweakCN
(Apache-2.0) pra dentro do nosso repo (`app/temas/**` +
`components/admin/theme-studio/**`). Plano estimou ~34h. Após 8+ commits
(chunks 1-8 + audits + fase-0 diagnostic), executor estava enfrentando
bugs persistentes e custo de adaptação alto: rewrite Zustand→RHF
(chunk 2), APCA Silver (chunk 4), i18n keys, vocab banido, shadcn-zone
quarentenada, governance §15.1 A-J por componente.

Em 2026-05-22, durante integração do `live-preview.min.js` do tweakcn.com
no `app/teste/page.tsx`, descoberta tardia mudou o cenário:

1. **Tweakcn.com não tem `X-Frame-Options`** — pode ser iframado
2. **`live-preview.min.js` já implementa postMessage protocol** completo
   pra `TWEAKCN_THEME_UPDATE` (parent → child) + `CHECK_SHADCN` +
   `EMBED_LOADED/ERROR`
3. **TweakCN é Next.js + shadcn + Tailwind v4** — stack **idêntico** ao
   nosso
4. **Apache-2.0** permite fork

Conclusão retrospectiva: pra esse caso específico, **fork+host** teria
custado ~meio dia vs clone+adapt que ainda tem semanas pela frente.
A lição não é "ADR-0044 errou" — é que faltava critério explícito pra
decidir entre Fork e Clone+Adapt na hora de adotar OSS de stack idêntico.

## Decision

**Cravar critério A-D obrigatório antes de qualquer COPY/clone+adapt
de OSS:**

### Critério A-D

| Letra | Pergunta                                                         | Sim → ponto pra Fork |
| ----- | ---------------------------------------------------------------- | -------------------- |
| **A** | OSS é **APP completa** (não lib / componente)?                   | +1                   |
| **B** | **Stack idêntico** ao nosso (Next.js + shadcn + TW)?             | +1                   |
| **C** | **Self-contained** (UI não compartilha state com app principal)? | +1                   |
| **D** | License **MIT/Apache/BSD** (sem AGPL/BSL = risco SaaS)?          | +1                   |

**A+B+C+D = 4 verdadeiros → FORK ganha.**

- Fork + host em subdomínio próprio (`<feature>.desafit.app`)
- Iframe no admin do app principal
- Comunicação via postMessage protocol
- Patches mínimos (logo swap, postMessage emitter on save, remover
  features não usadas)
- `git remote add upstream` permite `git fetch && git merge` pra puxar
  updates do upstream

**Menos de 4 → Clone+Adapt continua certo:**

- Se A=falso (é lib/componente): você embute, não iframa. COPY/INSTALL.
- Se B=falso (stack diferente): fork introduz tecnologia nova. STUDY ou
  port manual.
- Se C=falso (precisa deep integration com data layer): iframe não dá
  fluxo bidirecional rico. Clone+adapt.
- Se D=falso (AGPL/BSL): fork+SaaS expõe a obrigação de abrir source ou
  conflito de license. STUDY only.

### Auto-aplicação aos OSS do roadmap (Plano Dia 1 + ADR-0046)

| OSS                    | A   | B   | C   | D   | Score | Decisão                                           |
| ---------------------- | --- | --- | --- | --- | ----- | ------------------------------------------------- |
| **TweakCN**            | ✓   | ✓   | ✓   | ✓   | 4/4   | **FORK** (lição retrospectiva)                    |
| **Maily** (email)      | ✓   | ✓   | ✓   | ✓   | 4/4   | **FORK** quando feature chegar                    |
| **Formbricks** (forms) | ✓   | ✓   | ✓   | ✗   | 3/4   | STUDY only (AGPL fecha SaaS loophole)             |
| **Survey.js**          | ✗   | —   | —   | ✓   | —     | COPY (é lib)                                      |
| **Puck**               | ✗   | —   | —   | ✓   | —     | COPY (é lib React)                                |
| **Vercel AI Chatbot**  | ✗   | ✓   | ✗   | ✓   | —     | COPY pattern (template, precisa deep integration) |
| **Refine**             | ✗   | —   | —   | ✓   | —     | INSTALL (framework lib)                           |
| **Novel**              | ✗   | —   | —   | ✓   | —     | INSTALL via npm                                   |
| **xyflow**             | ✗   | —   | —   | ✓   | —     | COPY/INSTALL (lib)                                |
| **PostHog**            | ✓   | ✗   | ✓   | ✓   | 3/4   | Self-host as-is (sem fork, sem patches)           |
| **Novu**               | ✗   | —   | —   | ✓   | —     | API service (não há UI pra iframar)               |
| **Meilisearch**        | ✗   | —   | —   | ✓   | —     | Backend service                                   |

### Diferença Fork vs Self-host as-is

| Categoria           | Fork+patches                   | Self-host as-is                  |
| ------------------- | ------------------------------ | -------------------------------- |
| Custo inicial       | ~meio dia                      | ~1h                              |
| Customização UI     | Sim (patches sob seu controle) | Não (versão upstream)            |
| Branding (logo etc) | Sim                            | Não                              |
| Manutenção updates  | `git merge upstream` periódico | Pull container/binário           |
| Casos típicos       | TweakCN, Maily                 | PostHog, GrowthBook, Meilisearch |

Self-host as-is quando UI vendor é aceitável (analytics, search,
notifications backend). Fork quando profissional vê a UI e branding
importa (theme editor, email editor).

## Consequences

### Positivas

- **Economia de tempo futura quantificada:** Maily clone+adapt evitado
  → ~semanas economizadas no futuro
- **Reuso de upstream proven:** updates do tweakcn/maily vêm "de graça"
  via `git merge upstream`
- **Separação de domínios mais limpa:** feature isolada vira app
  isolada, não dilui o codebase principal
- **License risk explicitado:** critério D obriga avaliar AGPL/BSL
  antes de gastar tempo, evita armadilha legal

### Negativas

- **N repos pra manter** (2-3 forks ativos = +cognitive load)
- **Deploy múltiplo:** cada fork = projeto Vercel separado + subdomínio
  - DNS
- **Brand divergence risk:** fork pode ficar visualmente desconectado
  do app principal se patches de styling forem mal feitos
- **Cross-repo refactor mais difícil:** breaking change em shared
  contract entre `platform` e `tema.desafit.app` exige coordenação

### Onde a lição NÃO aplica

- Libs / componentes / SDKs (A=falso): clone+adapt ou install continua
  sendo o caminho. Não tem "fork de lib pra rodar como app".
- OSS com deep coupling necessário (Vercel AI Chatbot Artifacts pra AI
  Report Engine — precisa ler nosso `submissions` table, escrever em
  nosso `reports`): clone+adapt vence pq iframe não dá deep DB access.
- AGPL/BSL no contexto B2B SaaS: legalmente arriscado forkar. Backlog
  permanece STUDY only.

### Aplicação retrospectiva ao TweakCN

ADR-0044 (pivot TweakCN) **não é revertido** — vocab shadcn-canonical

- `buildThemeCSS()` + APCA dual-gate continuam corretos. O que muda é
  a **estratégia de UI**:

* Antes: clone UI do tweakcn em `components/admin/theme-studio/**`
* Depois (opcional pivot): fork tweakcn → `tema.desafit.app` →
  iframe + postMessage save

Pivot pra fork na feature TweakCN fica como **decisão do executor**
(usuário). Pode:

1. **Continuar clone+adapt:** se o trabalho já feito (~50% segundo
   audits) compensa terminar
2. **Pivotar pra fork:** arquivar `components/admin/theme-studio/**`
   em `_archive/`, criar fork, ~meio dia pra fork funcional + handler

Critério A-D **vincula decisões FUTURAS** (Maily etc.), não obriga
retrabalho do passado.

## Atualizações relacionadas

- `docs/_deferred/oss-references-by-feature.md`: tag FORK adicionada em
  Maily, regra A-D adicionada como gate antes de COPY/clone+adapt
- `.claude/rules/abstractions.md` + `.claude/rules/components.md`: sem
  mudança (critério A-D vive em ADR, não em rule path-loaded — é
  decisão de adoção OSS, não convenção de código)

## Referências

- ADR-0044 — pivot TweakCN-way (não revertido, complementado)
- ADR-0045 — Registry Strategy
- ADR-0046 — Dogfooding-first execution order
- `docs/_deferred/oss-references-by-feature.md` — auto-aplicação A-D
  por OSS do roadmap
- `app/teste/page.tsx` + `app/layout.tsx` — integração postMessage
  tweakcn que destravou a descoberta
- Discussion log: sessão 2026-05-22 (chat onde executor refletiu sobre
  custo retrospectivo de clone vs fork)
