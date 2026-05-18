---
name: Tenant content strategy — copy, landing pages, blocks
description: Hierarquia 4 níveis de personalização de conteúdo por tenant. Decisão dia 0 — landing usa template+slots, não block builder. Anti-hardcode em páginas tenant.
paths:
  - 'app/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
  - 'messages/**/*.json'
  - 'lib/contracts/landing*.ts'
  - 'supabase/migrations/**/*landing*.sql'
  - 'supabase/migrations/**/*copy*.sql'
---

## Princípio

Conteúdo varia por tenant em **4 níveis distintos**. Cada nível tem solução diferente. Misturar = inline hardcoded em página de tenant = quebra white-label silencioso.

## Hierarquia (4 níveis)

| Nível                        | O que varia                                                                                           | Solução                                                                                                                      | Status                                               |
| ---------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **1. Static neutra**         | "Salvar", "Cancelar", erros universais                                                                | `messages/<locale>/<ns>.json` + `t('key')`                                                                                   | ✅ dia 0 (Etapa 5)                                   |
| **2. String per-tenant**     | "Chamar WhatsApp" vs "Fale comigo" — mesma key, valor varia por tenant                                | `tenant_copy_overrides(tenant_id, key, value, locale)` + resolver merge em `i18n/request.ts`                                 | JIT (gatilho `i18n.md`)                              |
| **3. Página template+slots** | Landing do profissional: headline, hero img, CTA url, features array — mesmo template, conteúdo varia | `landing_pages(tenant_id, slug, template_slug, slots_jsonb)` + 2-3 templates pré-fabricados em `features/landing/templates/` | JIT — primeira landing                               |
| **4. Página block builder**  | Profissional adiciona/reordena/customiza blocos (Hero, Features, Testimonial, FAQ)                    | `landing_blocks(tenant_id, page_id, block_type, props_jsonb, sort_order)` + admin drag-drop                                  | JIT muito futuro — só quando nível 3 ficar limitante |

## Decisão fechada dia 0

**Primeira landing page por tenant = nível 3 (template+slots).** NÃO pular direto pra nível 4.

Razão:

- 3 templates pré-fabricados (`minimal`, `rich-media`, `video-first`) cobrem ~90% dos casos B2B SaaS
- Block builder = drag-drop + schema validation + preview live. ~3-5× custo de implementação
- Princípio §39 JIT: começa estreito, evolui sob pressão de cliente real, não imaginada

## Padrão correto: page recebe props, nunca hardcode

❌ Errado:

```tsx
// app/(tenant)/landing/[slug]/page.tsx
export default function Landing() {
  return <h1>Treine com a Acme Fitness</h1> // hardcoded brand
}
```

✅ Certo:

```tsx
// app/(tenant)/landing/[slug]/page.tsx
import { LandingTemplate } from '@/features/landing/templates/minimal'
import { getLandingBySlug } from '@/features/landing/data'

export default async function LandingPage({ params }) {
  const data = await getLandingBySlug(params.tenantId, params.slug)
  return <LandingTemplate {...data} />
}
```

## Resolver order (per-tenant overrides)

Quando renderizar página de tenant, copy resolve em cascata:

```
1. tenant_copy_overrides[locale][key]   ← se existe, vence
2. messages/<locale>/<ns>.json[key]     ← fallback
3. messages/<default-locale>/<ns>.json  ← último recurso
```

Implementação JIT (quando nível 2 ativar) vai no `i18n/request.ts`.

## Anti-patterns

| Anti-pattern                                                                | Por quê                                                            | Substituto                                                   |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| Hardcode copy em `app/(tenant)/**` ou `features/**`                         | Quebra white-label silencioso (cliente 2 reclama)                  | Prop tipada ou `t()` ou banco via data layer                 |
| Schema JSONB free-form sem Zod                                              | Bug runtime quando profissional preenche admin errado              | Zod schema por `template_slug` em `lib/contracts/landing.ts` |
| Block builder dia 1                                                         | Overkill — 3 templates cobrem 90%                                  | Template+slots primeiro, evolui sob pressão                  |
| Criar tabela `landing_*` sem migration via `mcp__supabase__apply_migration` | RLS + tipos gerados quebram                                        | Sempre migration MCP                                         |
| Misturar static e per-tenant na mesma chave                                 | Resolver não sabe precedência                                      | Static → `messages/`; per-tenant → `tenant_copy_overrides`   |
| Inline `<h1>{brand.name === 'desafit' ? 'X' : 'Y'}</h1>`                    | Lógica brand hardcoded — ESLint `brand/no-brand-hardcode` bloqueia | `tenant_copy_overrides` por chave neutra                     |
| MDX/HTML custom direto sem ADR                                              | XSS + a11y rompido                                                 | ADR antes de implementar (último recurso)                    |

## Condição de revisitar

| Gatilho                                                                                                        | Ação                                                                                                                                                                                                              |
| -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primeira feature de landing nasce** (Sprint 2-3, funil agência)                                              | Migration `landing_pages` via `mcp__supabase__apply_migration` + 3 templates em `features/landing/templates/{minimal,rich-media,video-first}.tsx` + Zod schemas em `lib/contracts/landing.ts` + admin form básico |
| **Cliente pede copy diferente em chave existente** (não página inteira — ex: BoxClub "WOD" vs FitLab "Treino") | Implementar nível 2: migration `tenant_copy_overrides` + resolver merge em `i18n/request.ts`. Ver `.claude/rules/i18n.md`                                                                                         |
| **Cliente quer reordenar/adicionar blocos custom em landing**                                                  | Migrar nível 3 → 4: migration `landing_blocks` + admin drag-drop. ADR antes (escolha de lib: Plate? Tiptap? Tldraw? custom dnd-kit?)                                                                              |
| **Profissional pede MDX/HTML custom**                                                                          | ADR obrigatório — avaliar XSS, a11y, sanitização. Default: rejeitar a favor de block builder mais expressivo                                                                                                      |
| **3+ templates pré-fabricados ficam apertados** (cada cliente pede ajuste menor)                               | Sinal pra migrar nível 3 → 4 (block builder)                                                                                                                                                                      |

## Referências

- ADR-0040 §G (i18n strategy fechada)
- `.claude/rules/i18n.md` (níveis 1 + 2)
- `.claude/rules/brand.md` (env vs runtime brand)
- `.claude/rules/features.md` (vertical slice — landing vira `features/landing/`)
- `docs/blueprint/05-design-system.md` (theming runtime — landing herda automático)
