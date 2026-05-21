# 0041. Engine catalog + 2 motores separados + polimorfismo via kind + scope

Date: 2026-05-19
Status: accepted

## Context

Pesquisa 23 (forms) + 24 (pages) + 25 (ai reports) consolidaram o entendimento de que o produto é uma **plataforma com múltiplos engines** (form/page/program/etc), cada um servindo a profissional (tenant) E também internamente à agência/SaaS. Sem decisão arquitetural cravada, a primeira migration cross-engine bate em parede: como nomear tabelas? como aplicar RLS quando a mesma estrutura serve tenant e agência? como evitar replicar renderer/editor/validação por tipo de form?

3 perguntas convergiram pra esta ADR:

1. **Form Engine único polimórfico OR um motor por tipo (captação, onboarding, anamnese)?**
2. **Forms e Pages num motor único OR motores separados?**
3. **Engines internos (agência configurando tenants) usam o MESMO motor dos engines externos (profissional configurando produto), OR sistema separado?**

Pesquisa 23 §1.2, pesquisa 24 §3 e análise de players (Typeform/Tally/Fillout vs Webflow/Framer/Builder.io/Plasmic) responderam.

## Decision

### D1. Dois motores totalmente separados — Form Engine + Page Engine

- **Form Engine**: estrutura **linear** `steps[] + blocks[] + logic[]`. Lógica condicional vive em `logic[]` ao lado dos steps (não aninhada).
- **Page Engine**: estrutura **árvore recursiva** `{ type, props, children[] }` via `z.lazy`. Tree depth max 5.
- **Helpers comuns** em `lib/engines/base.ts` (`publish`, `duplicate`, `lockVersionAfterFirstUse`).
- **Registro central** em `lib/engines/registry.ts` mapeando `engineKind → { table, specSchema, renderer, chatPromptTemplate }`.
- **Adicionar motor 3+ exige nova ADR** atualizando este catálogo.

### D2. Form Engine polimórfico via `forms.kind` enum

UM motor cobre TODOS os tipos via discriminador. Mesmo renderer, mesmo editor, mesmo schema base. Difere apenas:

- Copy/quantidade típica de perguntas (convenção por kind)
- Prompt-template da IA (cada kind tem seu prompt curado em `ai_prompt_versions`)
- Se gera report (via `forms.report_template_id NULL`)

```sql
CREATE TYPE form_kind AS ENUM (
  'lead_capture', 'onboarding', 'assessment', 'anamnesis',
  'survey', 'brief', 'check_in', 'evaluation'
  -- 'prospect' removido 2026-05-20: redundante com 'lead_capture' (mesma intenção funcional).
  --                                 vocab banido em naming.md mantido sem exceção SQL.
);

ALTER TABLE forms ADD COLUMN kind form_kind NOT NULL;
```

**Justificativa:** "onboarding", "captação", "anamnese" não têm estruturas diferentes — têm copy/quantidade/prompt diferente. Motor por tipo = repetir renderer/editor/validação/branching/persistência 6 vezes = bug garantido.

### D3. Page Engine polimórfico via `pages.kind` enum + `KIND_CAPABILITIES` gate

```sql
CREATE TYPE page_kind AS ENUM (
  'landing', 'sales', 'document', 'thank_you', 'error',
  'maintenance', 'blog_post', 'about', 'pricing', 'legal', 'report'
);

ALTER TABLE pages ADD COLUMN kind page_kind NOT NULL;
```

`KIND_CAPABILITIES` const em `lib/contracts/page-capabilities.ts` gate por kind:

- `legal`, `maintenance` → robots noindex, sem pixels marketing
- `thank_you` → server-side conversion (Meta CAPI + Google CAPI) com dedupe `event_id`
- `landing`, `sales` → carregam marketing pixels via `<script type="text/plain" data-cookiecategory="marketing">`
- `report` → AI-fill content, dedicated render path

### D4. Report = `pages.kind='report'` + AI fill (NÃO engine separado)

Decisão derivada: report NÃO ganha tabela própria. É instância de Page Engine com:

- `pages.kind = 'report'`
- Conteúdo preenchido por IA usando template + prompt
- Linkado a form via:
  ```sql
  ALTER TABLE forms
    ADD COLUMN report_template_id uuid NULL REFERENCES page_templates(id),
    ADD COLUMN report_prompt_version_id uuid NULL REFERENCES ai_prompt_versions(id);
  ```
- Form com `report_template_id NULL` = não gera report
- Form com `report_template_id NOT NULL` = lead que submete recebe report (manual ou automático via Workflow)

IA NÃO escreve estrutura — preenche placeholders dentro de blocos predefinidos do template. Visual sempre vem de template; profissional escolhe template, não cria on-the-fly.

### D5. Scope flag tenant/internal/platform — mesmo motor, instâncias diferentes

```sql
ALTER TABLE forms ADD COLUMN scope text NOT NULL DEFAULT 'tenant'
  CHECK (scope IN ('tenant', 'internal', 'platform'));
-- mesma coluna em pages e demais engines de conteúdo

CREATE POLICY "form_scope_select" ON forms FOR SELECT
USING (
  CASE scope
    WHEN 'tenant'   THEN tenant_id = current_tenant_id()
    WHEN 'internal' THEN auth.jwt() ->> 'role' = 'agency_admin'
    WHEN 'platform' THEN auth.jwt() ->> 'role' = 'platform_admin'
  END
);
```

- `scope='tenant'` → forms que profissional cria pros clientes
- `scope='internal'` → forms que agência usa pra configurar tenant (white-label setup, plano, seed)
- `scope='platform'` → forms de meta-configuração (suporte, admin de admins)

UI escolhe scope visível baseado na role do usuário logado. Catálogo de blocks pode ter subset visível por scope (futuro).

## Consequences

**Positivas:**

- **Um motor cobre todos os usos** (tenant + internal + platform) — agência não precisa de outro sistema pra configurar tenants. Vibe coding agência usa o mesmo Form Engine que profissional usará na Fase 2.
- **Form Engine único** evita duplicação de renderer/editor/validação. Adicionar kind novo = enum + prompt-template, zero código.
- **Page Engine única** source pra landing/sales/document/report — RPC `publish_page` atomic serve todos.
- **Schema enxuto** — sem tabela `reports` redundante.
- **Catálogo declarado** em `docs/blueprint/21-engine-catalog.md` orienta IA + dev: quando block/tabela/engine não está catalogado, IA não enxerga.

**Negativas:**

- **Vocabulário precisa de disciplina** — `kind` vs `scope` vs `type` (block) são 3 discriminadores diferentes. Confusão = bug. Mitigação: glossário em CLAUDE.md + naming.md.
- **RLS condicional por CASE** tem custo mínimo de planner (~µs). Em escala média (≤10M rows) é irrelevante. Se chegar a 100M+, particionar por scope.
- **Adicionar motor 3+ (Program, Email, Automation) exige ADR superseding ou complementar** este catálogo.

## Engines previstos (catálogo completo)

Ver `docs/blueprint/21-engine-catalog.md` para enumeração de 22 engines em 3 categorias (conteúdo / internas / processamento) com status, propósito, tabelas e relações.

## Implementation

**Fase 1 (agora):**

1. `lib/engines/registry.ts` declara Form Engine + Page Engine
2. `lib/engines/base.ts` exporta `publish`, `duplicate`, `lockVersionAfterFirstUse`
3. Migrations (próxima sequencial):
   - `form_kind` enum + `forms.kind` column (já aplicada parcialmente via 0015)
   - `page_kind` enum + `pages.kind` column (incluindo valor `'report'`)
   - `forms.scope` + `pages.scope` columns
   - `forms.report_template_id` + `forms.report_prompt_version_id` FKs
   - RLS policies condicionais por scope
4. `lib/contracts/page-capabilities.ts` exporta `KIND_CAPABILITIES`

**Fase 2-3 (Program, Email, Automation):**

- Cada novo engine entra como nova entry em `engineRegistry`
- ADR superseding ou complementar atualiza este documento

## Referências

- Pesquisa 23 (form engine) §1.2, §2.1
- Pesquisa 24 (page engine) §1.1, §3, §12
- Pesquisa 25 (ai reports) §2 — confirmou report como AI fill sobre Page Engine
- Plano `docs/plans/PLANO-DIA-1-AGENCY-FUNNEL.md` §1.1, §1.2, §0.2
- Resumo da sessão `docs/_sessions/2026-05-19-resumo-completo.md` §3.2-§3.6
- ADR-0024 (multi-marca via hostname) — scope flag se alinha com tenant boundary
- ADR-0033 (schema único public.\*) — todos engines em public.\*
- ADR-0040 (fechamento dia 0) — wrappers + shadcn zone aplicam a renderers de todos engines

## Supersede / Superseded by

- Nenhuma supersede.
- Será **complementada** por ADR pra cada engine novo (Program Engine, Email Engine, etc) à medida que entrarem em Fase 1+.
