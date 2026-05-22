---
name: Zona quarentenada shadcn + wrapper pattern com valor agregado
description: components/** deletado pós-pivot ADR-0044. Reinstalação JIT via npx shadcn add. Wrappers JIT só com valor agregado. Passthrough proibido.
paths:
  - 'components/ui/**/*.{ts,tsx}'
  - 'components/app-*.tsx'
  - 'features/**/components/**/*.{ts,tsx}'
---

## Princípio

`components/**` foi DELETADO em surgical delete pós-pivot ADR-0044 (TweakCN
canonical). **Reinstalação UPFRONT em dia 0 Fase 5** de 20 primitives essential
via `npx shadcn add` (research-45 cravou — bundle impact zero). Wrapper composto
em `components/app-*.tsx` SÓ quando agregar valor real — passthrough proibido
(Vercel Academy: "doubles design system size").

## 20 primitives essential (dia 0 Fase 5 — research-45)

Comando batch único:

```bash
pnpm dlx shadcn@latest add button input label form card dialog select textarea badge separator skeleton tabs dropdown-menu tooltip popover scroll-area sheet sonner switch command
```

**JIT exceptions** (deps npm pesadas, instalar quando feature consumer real):

| Primitive  | Dep              | Bundle  |
| ---------- | ---------------- | ------- |
| `chart`    | recharts         | ~250 KB |
| `calendar` | react-day-picker | ~45 KB  |
| `carousel` | embla-carousel   | ~25 KB  |

**Outras primitives shadcn** (`accordion`, `alert`, `alert-dialog`, `radio-group`,
`checkbox`, `hover-card`, etc) — JIT quando feature pedir 3+ vezes.

## Zona quarentenada (`components/ui/**`)

- ❌ NUNCA Edit/Write direto — hook `component-research-gate.sh` bloqueia
- ✅ Canal único de modificação: `npx shadcn add <slug>` via Bash
- ✅ Hook `post-shadcn-add.sh` injeta checklist após add (PostToolUse)
- ✅ Path overrides ESLint desligam regras de estilo (i18n, jsx-no-literals, max-lines, design-tokens — lista narrowest ADR-0040 §A)
- ✅ Regras de BUG ativas mesmo em vendor (exhaustive-deps, rules-of-hooks, floating-promises)

## Checklist obrigatório pós `npx shadcn add` (hook injeta)

1. Chamar `mcp__shadcn__get_audit_checklist` e seguir todos passos
2. Grep strings literais nos arquivos novos → mover pra `messages/pt-BR/<namespace>.json`
3. Grep `oklch(|#hex|rgb(` → trocar por `var(--tenant-*)` ou `var(--color-*)`
4. Deletar variants `cva()` não usados pelo wrapper (mantém só o que `app-*` usa)
5. Criar wrapper `components/app-<nome>.tsx` SE primitive ganhar comportamento extra (não criar se não)
6. `pnpm validate:apca && pnpm lint --max-warnings 0`

## Wrapper pattern (`components/app-*`)

**Obrigatório:** marker linha 1 `// RESEARCH: shadcn/ui <primitive> + <valor agregado concreto>`

**Obrigatório:** wrapper deve agregar valor real. Lista do que conta:

- i18nKey opcional
- loading state padrão
- error display integrado
- telemetria centralizada
- composição de 2+ primitives (compound)
- Brand context (data-brand, useBrand())

**Proibido:** passthrough (só re-exportar primitive sem agregar). Vercel Academy bate: "effectively doubles the component design system size and makes the ownership concept redundant".

## Wrappers obrigatórios dia 0 — REMOVIDOS pelo pivot ADR-0044

Os 3 wrappers `AppForm`, `AppToast`, `AppEntitlementGate` foram **DELETADOS**
em 2026-05-21 junto com `components/**` inteiro (surgical delete pivot
TweakCN). Re-add JIT em Fase 1-3 do pivot quando feature consumer real existir
com valor agregado provado (RHF+Zod boilerplate, sonner+i18n,
paywall+entitlement). Spec original em ADR-0040 §E é referência pra
reconstrução.

## Wrappers JIT (NÃO criar preventivo)

Lista canônica do que entra JIT (regra de 3 + valor agregado):

| Wrapper                                                                             | Gatilho                                                                                                                                                                                              |
| ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppButton`                                                                         | Feature precisa loading state padrão (ex: submit button login)                                                                                                                                       |
| `AppInput`                                                                          | Feature precisa error display integrado RHF                                                                                                                                                          |
| `AppDialog`                                                                         | Primeiro modal com close confirmation OU i18n complexo                                                                                                                                               |
| `Badge` entitlement / `PaywallModal` / `QuotaBanner` / `UpgradeCTA` (4 componentes) | Primeiro paywall com UX granular. `AppEntitlementGate` dia 0 cobre 80% — esses 4 entram quando feature pede status visual nuançado (banner perto do limite, badge no header, modal com previewImage) |
| 4 Card composições PWA aluno (`hero`, `media`, `metric`, `entity`)                  | Primeira tela PWA aluno — compound cards têm anatomia específica feature, regra de 3 dispara                                                                                                         |
| Vaul bottom-sheet customizado (snap points + handle + safe-area-inset-bottom)       | Primeira tela mobile com bottom sheet. Drawer shadcn cobre 80%; customização entra quando precisar snap points + safe-area                                                                           |
| Tab bar com `layoutId` Motion indicator                                             | PWA aluno tab bar — consome presets Motion `lib/design/motion.ts` (Etapa 14 do plano)                                                                                                                |
| Sonner customizado tokens próprios                                                  | `useAppToast` wrapper já cobre uso semântico (i18n key), customização visual quando feature pedir cor/icone fora do padrão                                                                           |
| Demais 30+                                                                          | Regra de 3 (mesmo className/pattern em 3 lugares diferentes)                                                                                                                                         |

## Imports em features/app/lib

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

## Stories e tests

Stories `**/*.stories.*` e tests `**/*.test.*` podem importar `@/components/ui/*` direto (não há regra bloqueando + path override desliga `i18next/no-literal-string` em stories — strings demo OK).

## Anti-patterns

- ❌ Edit/Write direto em `components/ui/*` — hook bloqueia
- ❌ Criar wrapper sem valor agregado (`AppButton` = só `<Button {...props} />`)
- ❌ Editar primitive shadcn pra adicionar i18n inline — use wrapper ou `t()` no callsite
- ❌ Wrapper que muda só nome (`MyButton` em vez de `Button`)
- ❌ Criar 47 wrappers preventivos dia 0 (Vercel Academy explícito)
- ❌ Skip checklist pós `shadcn add` (hook avisa)
- ❌ `npx shadcn add` em massa sem feature consumer real

## Condição de revisitar

| Gatilho                                              | Ação                                                                 |
| ---------------------------------------------------- | -------------------------------------------------------------------- |
| **Loading state aparece em form de feature**         | Criar `AppButton` com `loading` prop                                 |
| **Error display RHF integrado precisa em 2+ inputs** | Criar `AppInput` com error inline                                    |
| **Primeiro modal real (não dialog inline)**          | Criar `AppDialog` com close confirmation opcional                    |
| **Mesmo `className` em 3 elementos diferentes**      | Promover pra wrapper composto (regra de 3)                           |
| **Block shadcn (login-04, dashboard-05) instalado**  | Lift Mode pra extrair só o que precisa, não inteiro                  |
| **Update upstream shadcn quebra wrapper**            | `git diff` em `components/ui/` revela mudança, ajustar wrapper       |
| **3+ meses sem reabrir `components/ui/*`**           | Sinal de baixa modificação — pode rodar `npx shadcn update` sem medo |

## Referências

- ADR-0040 §A-§E + §L
- ADR-0008 (shadcn 100% canon)
- ADR-0037 (wrapper pattern + hierarquia registries)
- `docs/research/18-shadcn-zone-quarantine.md` Q1-Q5
- `docs/research/19-jit-vs-upfront-wrapper-strategy.md`
- `docs/research/20-jit-vs-upfront-saas-founder-solo.md` — "0 wrappers preventivos"
- Vercel Academy "Updating and Maintaining Components" — wrapper doubles design system
- shadcn MCP server — `mcp__shadcn__list-components`, `mcp__shadcn__get_audit_checklist`
