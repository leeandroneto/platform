# 19. Wrapper strategy (shadcn-zone + JIT)

> Consolida ADR-0040 §A-§F + Pesquisa 19/20 + `.claude/rules/shadcn-zone.md` + `.claude/rules/components.md`.
> Fonte única operacional: "como decidir criar wrapper, qual primitive usar, quando JIT".
> Última atualização: 2026-05-18 (PLANO-MESTRE-DIA-0 Etapa 15).

---

## 1. Princípio

`components/ui/**` é **zona quarentenada — vendor surface intocável.** Toda modificação via Bash `npx shadcn add`. Wrappers (`components/app-*.tsx`) SÓ quando agregam valor real. Passthrough proibido (Vercel Academy: "wrapper passthrough effectively doubles design system size and makes the ownership concept redundant").

3 ferramentas combinam pra forçar isso:

1. **Hook `component-research-gate.sh`** — bloqueia Write/Edit em `components/ui/**` sem marker `// RESEARCH:` linha 1
2. **Hook `post-shadcn-add.sh`** — após Bash `shadcn add`, injeta checklist 6 passos via stderr
3. **ESLint path overrides** (ADR-0040 §A) — desligam regras de estilo em vendor; mantêm regras de BUG ativas

---

## 2. Hierarquia de busca antes de criar (ADR-0037)

Ordem pesquisada 2026-05-18:

### Categoria 1 — Vendor canônico (instalado em `components/ui/`)

| Ordem | Fonte                 | Como adicionar                     | Quando                                                                  |
| ----- | --------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| 1     | shadcn **blocks**     | `mcp__shadcn__search` filtro block | Composição pronta (dashboard, auth, sidebar). Blocks-first se cobre 80% |
| 2     | shadcn **primitives** | `mcp__shadcn__list-components`     | Building blocks: button, input, dialog, sheet, card, drawer, sonner     |

### Categoria 2 — Catálogos copy-paste shadcn-compatible

Copiados via `npx shadcn add <url-registry>` ou manual pra `components/app-<nome>.tsx` ou `features/<X>/components/`.

| Ordem | Catálogo       | Site           | Forte em                                                                | A11y                     |
| ----- | -------------- | -------------- | ----------------------------------------------------------------------- | ------------------------ |
| 3     | **Origin UI**  | origin-ui.com  | Variações ricas de primitives (multi-select, time picker, avatar-stack) | Radix + React Aria       |
| 4     | **Kibo UI**    | kibo-ui.com    | Padrões SaaS (kbd, announcement-bar, color-picker, dropzone)            | Shadcnblocks-backed      |
| 5     | **Reui**       | reui.io        | **Data-grid TanStack v8** (29 comp), 1003+ componentes totais           | Boa                      |
| 6     | **Tremor**     | tremor.so      | Dashboard analytics (KPI, sparkline, area, gauge) — 35+ comp            | Boa (tokens divergentes) |
| 7     | **billingsdk** | billingsdk.com | Billing UI (price-table, plan-card, customer-portal)                    | WCAG-optimized           |

### Categoria 3 — Custom

| Ordem | Fonte  | Quando                                                    |
| ----- | ------ | --------------------------------------------------------- |
| 8     | custom | Última opção. Marker justifica. ADR se reusável (3+ usos) |

**Regra de fechamento:** parar na primeira camada que atende. Não pular pra custom só porque "parece mais rápido". Pesquisa < 3min via MCP é regra.

### Aceternity — fora do produto

❌ NÃO usar Aceternity UI dentro do PWA produto:

- Framer Motion-heavy → CLAUDE.md enforça `motion/react` (ESLint bane `framer-motion`)
- Paywall $199 lifetime blocks principais
- Animações 3D/sparkles matam Core Web Vitals
- A11y vaga (sem audit reference)

Reservado pra marketing/landing externo se algum dia houver — nunca dentro do produto.

---

## 3. 3 wrappers compostos OBRIGATÓRIOS dia 0 (ADR-0040 §E)

| Wrapper              | Encapsula                                                                    | Valor agregado                                                               | Status     |
| -------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------- |
| `AppForm`            | RHF + Zod resolver + AppError i18n + FormProvider + submit handler tipado    | ~30 linhas boilerplate/form. Feature 1 (login+signup+capture-form) usa todos | ✅ Etapa 7 |
| `useAppToast`        | sonner + `useTranslations` com helpers `success/error/info/warning(i18nKey)` | Centraliza tradução, evita N callsites com `t()`                             | ✅ Etapa 7 |
| `AppEntitlementGate` | `useEntitlement` + paywall modal + upgrade CTA                               | White-label B2B SEMPRE precisa de plan gating UI                             | ✅ Etapa 7 |

Localização: `components/app-<nome>.tsx` no root de `components/`. Marker linha 1: `// RESEARCH: shadcn/ui <primitive> + <valor agregado concreto>`.

---

## 4. 3 typography primitives dia 0 (ADR-0040 §F)

shadcn não entrega (issue #1527 do repo shadcn-ui/ui). Custom em `components/ui/` — **exceção ao §A** (zona quarentenada vale só pra vendor; typography é nossa, não vendor).

| Primitive                                          | Variants                                                     | Status     |
| -------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| `<Heading level={1\|2\|3\|4}>` + `as` + `asChild`  | replica Nathan Curtis 4-6 levels                             | ✅ Etapa 8 |
| `<Text variant="body\|body-sm\|lead">` + `asChild` | 3 variants essenciais                                        | ✅ Etapa 8 |
| `<Muted>` (text-sm text-muted-foreground)          | substitui Eyebrow dia 0 (uso textual mais frequente em SaaS) | ✅ Etapa 8 |

`<Logo>` wordmark Geist Sans (Etapa 9) — 4º typography custom (00-PROJETO §9 constitucional). Variants `icon` + `horizontal` JIT.

---

## 5. 30+ wrappers JIT (NÃO criar preventivo)

Lista canônica com gatilho explícito (regra de 3 + valor agregado):

### Wrappers compostos

| Wrapper     | Gatilho                                                  |
| ----------- | -------------------------------------------------------- |
| `AppButton` | Feature precisa loading state padrão (ex: submit button) |
| `AppInput`  | Feature precisa error display integrado RHF              |
| `AppDialog` | Primeiro modal com close confirmation OU i18n complexo   |

### Entitlement 4 componentes

| Wrapper             | Gatilho                                                       |
| ------------------- | ------------------------------------------------------------- |
| `Badge` entitlement | Header mostrando plano                                        |
| `PaywallModal`      | UX granular pós-`AppEntitlementGate` (previewImage + bullets) |
| `QuotaBanner`       | Banner sticky perto do limite (`nearLimit` true)              |
| `UpgradeCTA`        | CTA reusável em múltiplas telas                               |

`AppEntitlementGate` dia 0 cobre 80% — esses 4 entram quando feature pede status visual nuançado.

### 4 Card composições PWA aluno

| Wrapper      | Gatilho                                                        |
| ------------ | -------------------------------------------------------------- |
| `CardHero`   | Card "Hoje" no Início (~45% viewport)                          |
| `CardMedia`  | Card com imagem 16/9 + eyebrow + title + meta                  |
| `CardMetric` | KPI grande + delta colored (precisa `<Metric>` typography JIT) |
| `CardEntity` | Lista de entidades (programa, módulo, sessão)                  |

Gatilho: primeira tela PWA aluno (compound cards têm anatomia específica feature; regra de 3 dispara).

### Padrões mobile

| Wrapper                                                                       | Gatilho                                                                     |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Vaul bottom-sheet customizado (snap points + handle + safe-area-inset-bottom) | Primeira tela mobile com bottom sheet (Drawer shadcn cobre 80%)             |
| Tab bar com `layoutId` Motion indicator                                       | PWA aluno tab bar (consome presets `lib/design/motion.ts`)                  |
| Sonner customizado tokens próprios                                            | Feature pedir cor/icone fora do padrão (`useAppToast` cobre semântica i18n) |

### Demais 20+

| Wrapper                                               | Gatilho                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| Restante (Tooltip custom, HoverCard, Pagination, etc) | Regra de 3 (mesmo className/pattern em 3 lugares diferentes) |

---

## 6. 9 typography primitives JIT (ADR-0040 §F)

| Primitive                                | Gatilho                                          |
| ---------------------------------------- | ------------------------------------------------ |
| `<Eyebrow>` (uppercase smallcap)         | Primeira tela marketing/landing                  |
| `<Code inline\|block>`                   | Primeira tela com snippet de código (docs/admin) |
| `<Metric>` (tabular-nums + Inter ss01)   | Primeira tela com KPI numeric                    |
| `<DataCell>` (label + value)             | Primeira tabela densa                            |
| `<Container>` (max-width + padding)      | Primeira tela com max-width consistente          |
| `<EmptyState>` (wrapper shadcn `Empty`)  | Primeira lista vazia                             |
| `<Section>` (title + description + tone) | Primeira página com seções repetidas             |
| `<Stack direction gap>`                  | Regra de 3 mesmo `flex flex-col gap-*`           |
| `<Divider>` (re-export Separator)        | Primeira seção com separator custom              |
| `<VisuallyHidden>` (SR-only)             | Primeiro caso a11y exigir texto invisível        |

`<Logo variant>` icon/horizontal JIT — exige asset SVG do designer.

---

## 7. Regra de 3 (Martin Fowler)

**Não promover pra wrapper antes de 3 usos similares.** 1-2 usos: copy-paste inline é melhor (acoplamento prematuro é pior que duplicação curta).

3+ usos com mesmo pattern (className, props, comportamento) → promover. Marker `// RESEARCH:` cita os 3 callsites.

---

## 8. Checklist obrigatório pós `npx shadcn add` (hook injeta)

1. Chamar `mcp__shadcn__get_audit_checklist` e seguir todos passos
2. Grep strings literais nos arquivos novos → mover pra `messages/pt-BR/<namespace>.json`
3. Grep `oklch(\|#hex\|rgb(` → trocar por `var(--tenant-*)` ou `var(--color-*)`
4. Deletar variants `cva()` não usados pelo wrapper (mantém só o que `app-*` usa)
5. Criar wrapper `components/app-<nome>.tsx` SE primitive ganhar comportamento extra (não criar se não)
6. `pnpm validate:apca && pnpm lint --max-warnings 0`

---

## 9. Imports e zona quarentenada

Não há `no-restricted-imports` bloqueando `@/components/ui/*` (ADR-0040 §B revisado — Pesquisa 20). Pode usar primitive direto com `t()` inline:

```tsx
// app/login/page.tsx
import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function LoginPage() {
  const t = useTranslations('auth')
  return <Button>{t('signin')}</Button> // ✅ OK
}
```

Use wrapper quando agregar valor:

```tsx
import { AppForm } from '@/components/app-form' // ✅ encapsula RHF+Zod+submit
```

**Stories e tests** podem importar `@/components/ui/*` direto (path override desliga `i18next/no-literal-string` em stories — strings demo OK).

---

## 10. Anti-patterns

| Anti-pattern                                                                | Por quê                                             | Substituto                                                     |
| --------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------- |
| Edit/Write direto em `components/ui/*`                                      | Hook bloqueia + canal único é Bash `npx shadcn add` | Bash `npx shadcn add <slug>` ou wrapper `components/app-*.tsx` |
| Criar wrapper sem valor agregado (`AppButton` = só `<Button {...props} />`) | Vercel Academy: doubles design system               | Use `<Button>` direto inline                                   |
| Editar primitive shadcn pra adicionar i18n inline                           | Update upstream sobrescreve                         | Wrapper `components/app-*.tsx` ou `t()` no callsite            |
| Wrapper que muda só nome (`MyButton` vs `Button`)                           | Sem valor                                           | Não criar                                                      |
| Criar 47 wrappers preventivos dia 0                                         | Vercel Academy explícito + Pesquisa 20              | 3 wrappers obrigatórios + 30+ JIT                              |
| Skip checklist pós `shadcn add`                                             | Hook avisa via PostToolUse                          | Seguir 6 passos                                                |
| `npx shadcn add` em massa sem feature consumer real                         | Bloat sem ROI                                       | Add por feature concreta                                       |
| Aceternity dentro do PWA produto                                            | Framer Motion incompat + paywall + a11y vaga        | Reservado pra marketing externo (não existe ainda)             |

---

## 11. Condição de revisitar

| Gatilho                                                           | Ação                                                                 |
| ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| Loading state aparece em form de feature                          | Criar `AppButton` com `loading` prop                                 |
| Error display RHF integrado precisa em 2+ inputs                  | Criar `AppInput` com error inline                                    |
| Primeiro modal real (não dialog inline)                           | Criar `AppDialog` com close confirmation opcional                    |
| Mesmo `className` em 3 elementos diferentes                       | Promover pra wrapper composto (regra de 3)                           |
| Block shadcn (login-04, dashboard-05) instalado                   | Lift Mode pra extrair só o que precisa, não inteiro                  |
| Update upstream shadcn quebra wrapper                             | `git diff` em `components/ui/` revela mudança, ajustar wrapper       |
| 3+ meses sem reabrir `components/ui/*`                            | Sinal de baixa modificação — pode rodar `npx shadcn update` sem medo |
| Primeira feature usa typography hardcoded `<h1 class="text-4xl">` | Promover `<Heading level={1}>` no callsite                           |
| 13ª paleta adicionada → mais valor JIT?                           | Avaliar `<Logo icon\|horizontal>` se asset SVG existe                |
| Feature paga validada por cliente real                            | Promover `<PaywallModal>` + `<UpgradeCTA>` com copy específica       |

---

## 12. Referências

- ADR-0008 — shadcn 100% canon
- ADR-0037 — wrapper pattern + hierarquia granular registries
- ADR-0036 — hooks PreToolUse JSON (gate determinístico)
- ADR-0040 §A-§F + §L — zona quarentenada + 3 wrappers + 3 typography + Logo
- ADR-0038 — Storybook 10 catálogo visual
- `docs/research/17-guardrails-ia-shadcn-governanca.md` — incidente `7818df1` que motivou
- `docs/research/18-shadcn-zone-quarantine.md` Q1-Q5
- `docs/research/19-jit-vs-upfront-wrapper-strategy.md`
- `docs/research/20-jit-vs-upfront-saas-founder-solo.md` — "0 wrappers preventivos"
- `.claude/rules/shadcn-zone.md` — playbook executável JIT
- `.claude/rules/components.md` — hierarquia por arquivo
- `.claude/hooks/component-research-gate.sh` — bloqueia Write sem marker
- `.claude/hooks/post-shadcn-add.sh` — checklist via stderr
- Vercel Academy "Updating and Maintaining Components" — wrapper doubles design system
- shadcn MCP — `mcp__shadcn__list-components`, `mcp__shadcn__get_audit_checklist`
- Storybook MCP — `mcp__shadcn__*` HTTP `localhost:6006/mcp` (catálogo)
