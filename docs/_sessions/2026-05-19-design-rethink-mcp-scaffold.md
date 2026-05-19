# Sessão 2026-05-19 — Design system rethink + MCP scaffold strategy

> **Tipo:** reflexão em curso (não-decidido ainda). Não é ADR.
> **Captura:** insights estratégicos da sessão pra sobreviver compactação de contexto.
> Quando virar decisão cravada, promove pra ADR ou seção `§0.X` do plano.

---

## 1. Infra externa fechada hoje

| Componente        | Estado final                                                                  |
| ----------------- | ----------------------------------------------------------------------------- |
| GitHub            | `leeandroneto/platform` Hobby. Branch protection skipped (JIT Pro).           |
| Vercel project    | `platform` em gru1 (São Paulo) Hobby Free. Auto-deploy on push to main.       |
| Supabase          | Free plan (em produção). HaveIBeenPwned Pro-only (JIT).                       |
| Domain            | `desafit.app` apex canonical, `www` redirect. Vercel DNS.                     |
| Resend            | Domínio verified DKIM/SPF/DMARC. API key in Vercel + .env.local.              |
| Upstash Redis     | sa-east-1 regional. REST URL + token in Vercel + .env.local.                  |
| Vercel AI Gateway | Key gerada no dashboard. Em .env.local mas NÃO no Vercel ainda (JIT Etapa 3). |
| Vercel CLI local  | v54.1.0 instalado, autenticado.                                               |

**Bugs descobertos durante setup:**

- `vercel env add NAME preview` precisa `--git-branch` mas CLI v54 não aceita wildcard. Workaround: pular Preview, popular JIT.
- `.vercel/project.json` é DIFERENTE de `.vercel/repo.json` (CLI usa o primeiro pra env operations). Cuidado em swap entre projetos.
- `vercel domains add desafit.app --force` não funciona pra mover entre projetos. Único caminho: dashboard.

## 2. Migrations 0015-0017 aplicadas

- `0015_forms_align_research_23` — rename `capture_*` → `form_*`, +25 colunas, criada `form_versions`
- `0016_structural_reserves` — `tenants.lifecycle_state` + `audit_log` + `notifications` + `tenant_webhooks` + `webhook_deliveries`
- `0017_cross_table_tenant_consistency` — função `assert_tenant_match()` + 11 triggers

Types regenerados, 48 tabelas no `lib/contracts/database.ts`. Typecheck verde. Zero advisors novos.

## 3. Pesquisas 24 + 25 concluídas — não-integradas

| Pesquisa                                       | Tamanho | Highlights pra integrar                                                                                                                     |
| ---------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs/research/24-page-engine-architecture.md` | 67 KB   | Zod 4 bug discriminatedUnion+lazy, JSON Patch RFC 6902 + EASE (-31% tokens), Next 16.2 cacheTag estável, 7 blocks MVP                       |
| `docs/research/25-ai-reports-architecture.md`  | 64 KB   | `generateObject` deprecated → `Output.object()`, ReportContent modular discriminated union, disclaimers determinísticos, Vercel Workflow GA |

**Integração ADIADA** até design system resolver (pesquisa 26). Risco: detalhes específicos podem mudar se template architecture exigir.

## 4. Inflexão estratégica do design system

### O insight

Estávamos pensando em "13 paletas" como dimensão de design. Mas profissional não-designer precisa modelo:

- **Template ("estilo") = bundle de tokens estruturais** (typography 12-15 variants, shapes, spacing, motion, density, photography style, whitespace)
- **Palette = cores aplicadas por cima**
- **Vertical sugere template inicial; profissional pode trocar entre 5-8 archetypes**

### Pesquisa 26 disparada

Cobre 25 perguntas sobre:

- Template × palette × content separation
- Archetypes extraídos das 78 marcas em `docs/references/design-systems/`
- Typography rica (Apple-style 14 variants)
- Photo handling (aspect ratios, crop, fallback, AI matching from reference)
- Mobile vs desktop philosophy per template
- PWA-specific design
- shadcn primitives variants per template
- Vibe matching engine (foto/texto/brand referência → IA escolhe)
- Antifragility — combinações proibidas

Aguardar resultado (~30 min Claude Desktop).

### O que NÃO muda mesmo após pesquisa 26

- Schema Form Engine, Page Engine, Program Engine (já em produção)
- Migrations 0015-0017
- Stack travado (Next 16, Tailwind v4, shadcn, Motion 12, Geist)
- 47 shadcn primitives, wrapper pattern, 3-layer defense
- Tokens OKLCH, APCA Silver gate, RLS arquitetura

### O que provavelmente muda

- Etapa 0b (catálogos) ganha conceito "template" ANTES de domain catalog
- §3 primitivos ganha `TemplateSpec` como entidade primária
- Vibe coding (Etapa 3) ganha "vibe matching" via foto/brand referência
- Storybook ganha "template gallery" (não só tokens isolados)
- 13 paletas atuais continuam vivas mas viram dimensão color SOBRE templates

## 5. MCP scaffold strategy — NOVO

### Decisão preliminar

Plano original dizia: "operations API tipada Fase 1 → wrap em MCP server Fase 2".

Insight de hoje: **scaffold do MCP server cabe na Etapa 0b**, mesma fase das operations. Custo ~3h. Benefício:

- Cada operation auto-registra como tool MCP via convenção (`defineOperation` + `mcpRegistry`)
- Endpoint `/api/mcp/[transport]/route.ts` existe mas retorna 503 em produção
- Quando Fase 2 chegar, flip flag `MCP_ENABLED=true` → publica em Smithery.ai
- Zero refactor — só wrap, validar OAuth, configurar safety guardrails MCP

### Estrutura proposta

```
lib/mcp/
  server.ts           — MCP server scaffold (closed)
  registry.ts         — auto-registra operations de lib/engines/operations/
  middleware.ts       — auth + rate limit (compartilhado com REST)

app/api/mcp/
  [transport]/route.ts — POST/GET handlers (HTTP streamable)
```

Sem URL pública até Fase 2. Validação interna em dev.

### Atualizar plano §3.7 com isso quando pesquisa 26 voltar.

## 6. Skills instalados/recomendados

- **Impeccable** (`npx skills add pbakaus/impeccable`) — `/audit` + `/polish` anti-AI-generic ✅ instalado
- **frontend-design** — oficial Anthropic, framework macro antes de codar ✅ já listado
- **Axe Accessibility MCP** — JIT quando APCA não pegar ARIA
- **v0-mcp** — JIT quando precisar gerar variants em massa
- NÃO instalar: Builder.io MCP, Webflow MCP, Tailwind MCP (não existe), Style Dictionary

## 7. Decisões observability ainda abertas (não-bloqueiam pesquisa 26)

- **D17 Sentry** — criar conta agora (free 5k/mês), integrar SDK na Etapa 6
- **D18 PostHog** — pesquisa 24 recomenda forte sobre Vercel Analytics; criar conta agora (free 1M events/mês), integrar Etapa 3+
- **D19 Vercel Analytics** — habilitar 1 click no dashboard (free, built-in)
- **D20 Customer support** — WhatsApp manual até primeiro cliente real, depois Crisp

Recomendação minha: habilitar **Vercel Analytics** agora (1 click), resto JIT documentado.

## 8. Próxima sessão (quando pesquisa 26 voltar)

1. Renomear `compass_artifact_*` → `26-design-system-vibes.md`
2. Ler + extrair archetypes + decisões cravadas
3. Atualizar plano §0.2 → §0.3 (decisões consolidadas pós-26)
4. Reescrever §3 primitivos com `TemplateSpec`
5. Decidir ordem: continuar Etapa 0a/0b com templates ou pular pra Etapa 1 (Form Engine) que não depende
6. Considerar nova ADR-0042 "Template × Palette × Content separation"

## 9. Pontos abertos pra resolver depois (não-bloqueiam)

- Logo wordmark final (designer pro JIT)
- 9 typography primitives restantes — possivelmente repensar à luz da pesquisa 26
- 4 entitlement components JIT
- 42+ wrappers shadcn JIT
- Tenant copy overrides JIT (gatilho rule i18n)
- LGPD DSAR endpoints (antes de cliente pagante real)
- DPAs com sub-processadores (antes de produção real)
- Stripe integração (Fase 1 vs Fase 2 — ainda aberto)

## 10. Insights soltos pra futuro

- **Templates vs paletas:** Sanity Studio + Tailwind UI Templates fazem essa separação. Vale clonar pattern.
- **78 brands DESIGN.md = mina de ouro**: cada um cobre typography hierarchy + spacing + shapes + components specs. Usar pra extrair archetypes universais.
- **AI vibe matching from photo:** v0.app + Builder Visual Copilot fazem isso. Usar Sonnet 4.6 com vision + few-shot pra inferir vibe.
- **Antifragility:** maior risco do white-label premium é profissional combinar template×palette ruim. Validação em runtime + AI rejection.
- **Operations tipadas = MCP-ready desde dia 1.** Não tratar como "Fase 2 separada".
- **Photo handling é one-way door**: define aspect ratios + crop strategy + fallback ANTES de codar templates. Difícil retrofitar.
