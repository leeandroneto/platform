# AUDIT-H1-PAGES — Fase 81

> Page-by-page audit garantindo exatamente **1 `<h1>` semântico por rota**.
> Comando: `pnpm audit:h1` (script em `scripts/audit-h1.ts`).
> Resultado em 2026-05-05: **0 violations** (102 pages = 66 OK + 36 allowlisted).

---

## Por quê

Antes da Fase 81:

- **27 pages sem h1** detectado em árvore (estática + dinâmica)
- **5 pages com múltiplos h1** simultâneos no DOM
- Total: ~30 violações WCAG 1.3.1 / 2.4.6 (hierarquia de heading)

Depois:

- **0 violations** (script CI-ready com exit code)
- **6 fixes** (componentes promovidos/demovidos, prop nova em `AuthCard`)
- **36 rotas** documentadas como allowlist com motivo concreto

---

## Categorias de allowlist

### Redirect-only (19 rotas)

Pages que apenas chamam `redirect()` no servidor e não renderizam nenhum HTML. Sem DOM, sem h1 necessário (browser nunca vê HTML; SR nunca vê HTML).

| Rota                                                       | Destino                                  |
| ---------------------------------------------------------- | ---------------------------------------- |
| `app/page.tsx`                                             | `/em-breve` (ou pós-login)               |
| `app/(app)/(shell)/account/notifications/page.tsx`         | `/settings/notifications`                |
| `app/(app)/(shell)/account/notifications/history/page.tsx` | `/settings/notifications/history`        |
| `app/(app)/(shell)/credentials/page.tsx`                   | `/landing?tab=credenciais`               |
| `app/(app)/(shell)/faq/page.tsx`                           | `/landing?tab=faq`                       |
| `app/(app)/(shell)/forms/page.tsx`                         | `/formulario`                            |
| `app/(app)/(shell)/forms/[modality]/page.tsx`              | `/formulario/[modality]/[code]` (legacy) |
| `app/(app)/(shell)/locations/page.tsx`                     | `/landing?tab=locais`                    |
| `app/(app)/(shell)/methodology/page.tsx`                   | `/landing?tab=metodologia`               |
| `app/(app)/(shell)/plans/page.tsx`                         | `/landing?tab=planos`                    |
| `app/(app)/(shell)/quick/status/[leadId]/page.tsx`         | `/leads/[id]` (após status change)       |
| `app/(app)/(shell)/quick/view/[leadId]/page.tsx`           | `/leads/[id]`                            |
| `app/(app)/(shell)/quick/wa/[leadId]/page.tsx`             | `wa.me/...` (link out)                   |
| `app/(app)/(shell)/services/page.tsx`                      | `/landing?tab=servicos`                  |
| `app/(app)/(shell)/settings/page.tsx`                      | `/settings/profile`                      |
| `app/(app)/(shell)/settings/packages/page.tsx`             | `/plans`                                 |
| `app/(app)/(shell)/settings/subscription/page.tsx`         | `/subscription`                          |
| `app/(app)/(shell)/template/[modality]/[code]/page.tsx`    | `/formulario/[modality]` (D110 blocked)  |
| `app/(app)/(shell)/testimonials/page.tsx`                  | `/landing?tab=depoimentos`               |

### Responsive-conditional (3 rotas)

Múltiplos `<h1>` no source mas apenas 1 visível no DOM via `display: none` controlado por breakpoints (`md:hidden` + `hidden md:flex`).

| Rota                                             | Variantes                                                                                                          |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `app/(app)/(shell)/site/page.tsx`                | `SiteHub` tem 4 h1 (mobile-list, mobile-editor, desktop-editor, desktop-catalog); state + responsive controlam DOM |
| `app/(app)/(shell)/template/active/page.tsx`     | mobile h1 + desktop h1                                                                                             |
| `app/(app)/(shell)/template/[modality]/page.tsx` | mobile h1 + desktop h1                                                                                             |

### State-conditional (1 rota)

`AnimatePresence mode="wait"` garante que apenas 1 sub-componente renderiza por vez. Se o modo virar `"sync"`, vira violação.

| Rota                               | Estados                                                                   |
| ---------------------------------- | ------------------------------------------------------------------------- |
| `app/(public)/diagnostic/page.tsx` | `DiagnosticIntro` ↔ `DiagnosticOverview` ↔ `AuditForm` (cada um tem 1 h1) |

### Decks/galeria (13 rotas)

Pages que renderizam decks (slides múltiplos) ou mockups (simulações de outras pages).

| Rota                                      | Motivo                                                  |
| ----------------------------------------- | ------------------------------------------------------- |
| `app/(public)/carousel/page.tsx`          | Deck — cada slide com h1 próprio                        |
| `app/(public)/creatives/page.tsx`         | Deck (3 formatos) — cada slide com h1 próprio           |
| `app/(public)/cover/page.tsx`             | 3 layouts de capa simultâneos (story/square/horizontal) |
| `app/(public)/mockups/charts/page.tsx`    | Mockup gallery                                          |
| `app/(public)/mockups/dashboard/page.tsx` | Mockup gallery                                          |
| `app/(public)/mockups/site/page.tsx`      | Mockup gallery                                          |
| `app/(public)/mockups/hub/page.tsx`       | Mockup gallery                                          |
| `app/(public)/mockups/report/page.tsx`    | Mockup gallery                                          |
| `app/(public)/mockups/analysis/page.tsx`  | Mockup gallery                                          |
| `app/(public)/landing-full/page.tsx`      | Showcase (assemblage de toda a landing)                 |
| `app/demo/dashboard/page.tsx`             | Demo interno                                            |
| `app/demo/themes/page.tsx`                | Demo interno                                            |
| `app/demo/report/page.tsx`                | Demo interno                                            |

---

## Fixes aplicados

### 1. `app/(app)/(shell)/dashboard/page.tsx`

**Antes:** 2 h1 simultâneos — saudação (linha 85) + StatCard.value (linha 432) renderizado 4× via array.
**Depois:** StatCard `level={1}` → `level={2}`. Cada cartão de métrica é uma sub-seção, não título da página.

### 2. `components/auth/AuthCard.tsx`

**Antes:** Hardcoded `<Heading level={1}>` no título do card.
**Depois:** Prop `headingLevel?: 1 | 2` (default 1). Permite caller decidir se o card é o h1 da rota ou um h2 sob outro h1.

```tsx
// Default: AuthCard como único heading da page (login, signup, forgot-password, etc.)
<AuthCard title="..." subtitle="..." />
// Override: page tem h1 próprio, AuthCard fica em segundo plano
<AuthCard title="..." subtitle="..." headingLevel={2} />
```

### 3. `app/(public)/influencer/signup/page.tsx`

**Antes:** Page hero h1 ("Programa de afiliados") + AuthCard h1 ("Cadastre-se como afiliado") simultâneos.
**Depois:** Page mantém h1, AuthCard recebe `headingLevel={2}`.

### 4. `components/landing/premium/sections/PremiumHero.tsx`

**Antes:** `<motion.div>` com `clamp(...)` estilizado pra parecer h1 mas SEM tag semântica. Comentário até dizia "heroic h1 canonical" mas era `div`.
**Depois:** Container das duas palavras vira `<Heading level={1}>` envolvendo `motion.span`. Animação preservada idêntica (cada palavra ainda anima por `wordVariants`).
**Impacto:** Resolve `/[slug]/site` (todas as landing pages dos profissionais) + `/onboarding/site-preview` (preview do PT).

### 5. `components/diagnostic-activation/_sections/HeroTransfer.tsx`

**Antes:** `level={2}` órfão sem h1 acima (HeroTransfer é o primeiro heading da `ActivationPage` em `/diagnostico/r/[token]/comecar`).
**Depois:** `level={1}`. Único heading da rota; promovido pra refletir hierarquia correta.

### 6. `app/(public)/diagnostic/processing/page.tsx`

**Antes:** Page de spinner com `<p>` "Gerando seu diagnóstico..." (não-semântico).
**Depois:** Adicionado `<Heading level={1} className="sr-only">` com nova chave i18n `publicFunnel.diagnostic.processing.pageTitle`. SR anuncia "Processando diagnóstico" ao chegar na rota; visual permanece com o spinner + texto descritivo abaixo.

---

## Como o script funciona

### Detecção de h1

Regex captura:

- `<h1>` direto (HTML raw)
- `<motion.h1>` / `<m.h1>` (motion lib)
- `level={1}` em `<Heading>` (primitive do design system)
- `as="h1"` em primitives polimórficos

### Tree walk

- Page (depth 0) → segue imports relativos (`./`, `../`) e alias (`@/`)
- Profundidade máxima: 3 níveis dentro da page; 2 níveis dentro de cada layout ancestral
- Skip de `node_modules`, do próprio `Heading.tsx` (que tem `<h1>` interno legítimo do componente)

### Prop-driven detection

Componentes que renderizam h1 via `level={prop}` são inicializados com `1 h1 default`. Ao detectar override no caller (ex: `<AuthCard headingLevel={2}>`), o h1 é decrementado.

```ts
const PROP_DRIVEN_H1_FILES = new Map<string, RegExp>([
  [
    resolve(COMPONENTS_DIR, 'auth/AuthCard.tsx'),
    /<AuthCard\b[\s\S]*?headingLevel=\{(?:2|3|4|5|6)\}/,
  ],
])
```

Adicionar novos componentes prop-driven aqui caso surjam.

---

## Métricas

```
Total pages: 102
OK (exactly 1 h1): 66
Allowlisted: 36
Missing h1: 0
Multiple h1: 0
✅ 0 violations
```

---

## CI integration (sugestão pra Fase 32 / 157)

```jsonc
// .github/workflows/audit.yml ou similar
- run: pnpm audit:h1
```

Ou adicionar ao `lint-staged` se rodar rápido o suficiente. Atualmente o script percorre 102 pages + imports em ~5s.
