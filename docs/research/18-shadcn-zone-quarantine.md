# ADR: ESLint flat config v9 + shadcn "zona quarentenada" — 8 decisões

## 1. Path-aware ESLint overrides para `components/ui/**`

A zona quarentenada (`components/ui/**`) precisa aceitar exatamente o que primitives shadcn/Radix produzem: `forwardRef` com displayName, inline `eslint-disable-next-line` que o gerador shadcn já emite em alguns primitives (Calendar, Chart, Sonner), strings literais em JSX (aria-labels, `sr-only`, displayName, variants `cva()`), inline styles, `<button>`/`<input>` HTML cru. Mantenha ativas regras de correção (`@typescript-eslint/no-unused-vars`, `react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`, `no-undef`, `import/no-cycle`, `@typescript-eslint/no-floating-promises`) — essas pegam bugs reais, não estilo. Tudo que é "i18n/design system policy" desliga aqui porque o wrapper em `components/app-*` é que carrega essa responsabilidade. Fonte primária: ESLint flat config docs ([eslint.org/docs/latest/use/configure/configuration-files](https://eslint.org/docs/latest/use/configure/configuration-files)) confirma que objetos com `files` substituem regras de objetos anteriores ("If you have two config objects that match the same files and define conflicting rules, the one applied would always be the last one"); `eslint-plugin-i18next` flat config em `i18next.configs['flat/recommended']` (github.com/edvardchen/eslint-plugin-i18next); `react/jsx-no-literals` aceita `elementOverrides` e `allowedStrings` (jsx-eslint/eslint-plugin-react docs).

```ts
// eslint.config.ts (trecho — colocar APÓS i18next.configs['flat/recommended'] e configs globais)
import { defineConfig } from 'eslint/config'

export default defineConfig([
  // ...configs globais antes (tseslint.recommended, i18next flat/recommended, react, etc.)
  {
    files: ['components/ui/**/*.{ts,tsx}'],
    rules: {
      // OFF — primitives shadcn legitimamente violam estas:
      'i18next/no-literal-string': 'off',
      'react/jsx-no-literals': 'off',
      'jsx-a11y/no-autofocus': 'off', // Dialog/Popover usam autoFocus por design Radix
      'react/display-name': 'off', // forwardRef sem nome explícito é padrão shadcn
      '@typescript-eslint/no-explicit-any': 'off', // VariantProps<typeof cva()> usa any internamente
      '@typescript-eslint/no-empty-object-type': 'off', // interface Props extends ComponentProps
      'react/no-unknown-property': 'off', // Recharts/Radix passam data-* não tipadas
      'no-restricted-syntax': 'off',
      'react/forbid-component-props': 'off',
      'tailwindcss/no-custom-classname': 'off', // cva variants geram classes dinâmicas

      // MANTER ATIVAS — bugs reais, não estilo:
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-floating-promises': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'import/no-cycle': 'error',
      'no-undef': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  // Hard floor: zero eslint-disable nas features (regra fechada do contexto)
  {
    files: ['app/**/*.{ts,tsx}', 'features/**/*.{ts,tsx}', 'components/app-*/**/*.{ts,tsx}'],
    plugins: {
      'eslint-comments': (await import('@eslint-community/eslint-plugin-eslint-comments')).default,
    },
    rules: {
      'eslint-comments/no-use': ['error', { allow: [] }],
    },
  },
])
```

## 2. `no-restricted-imports` bloqueando `@/components/ui/*`

A regra é negativa-com-exceção: bloqueie o padrão `@/components/ui/*` em todo lugar, e re-permita apenas dentro de `components/app-*/**` (que é o único lugar legítimo para fazer wrapper) e `**/*.stories.{ts,tsx}` + `**/*.test.{ts,tsx}` (testes/stories renderizam a primitive direta para validar contrato visual). Use `@typescript-eslint/no-restricted-imports` (não a base ESLint) porque ela suporta `allowTypeImports`, útil para `ComponentProps<typeof Dialog>` em type-only sem violar boundary. Note que `no-restricted-imports` v9 não aceita exceções por `files` dentro da mesma regra — você precisa de DOIS objetos no flat config (a discussão `eslint/eslint` #18559, "Use config file in subfolder (flat config)", abrida em 5-Jun-2024 por `fudom` em github.com/eslint/eslint/discussions/18559, documenta exatamente este workaround: objetos `files`-scoped no flat config raiz). Fonte primária: ESLint `no-restricted-imports` docs ([eslint.org/docs/latest/rules/no-restricted-imports](https://eslint.org/docs/latest/rules/no-restricted-imports)) — patterns aceita `group` gitignore-style; typescript-eslint adiciona `allowTypeImports` ([typescript-eslint.io/rules/no-restricted-imports](https://typescript-eslint.io/rules/no-restricted-imports/)).

```ts
const QUARANTINE_RULE = [
  'error',
  {
    patterns: [
      {
        group: ['@/components/ui/*', '@/components/ui'],
        message:
          'Importe via @/components/app-* (wrapper). UI primitives são zona quarentenada — vide ADR-001.',
        allowTypeImports: true, // type { ButtonProps } from "@/components/ui/button" é OK
      },
    ],
  },
] as const

export default defineConfig([
  // Default: bloqueia para todo TS/TSX
  {
    files: ['**/*.{ts,tsx}'],
    rules: { '@typescript-eslint/no-restricted-imports': QUARANTINE_RULE },
  },
  // Exceção 1: wrappers podem (e devem) importar primitives
  {
    files: ['components/app-*/**/*.{ts,tsx}', 'components/app-*/**/index.ts'],
    rules: { '@typescript-eslint/no-restricted-imports': 'off' },
  },
  // Exceção 2: testes e stories renderizam primitives diretamente
  {
    files: [
      '**/*.{test,spec}.{ts,tsx}',
      '**/*.stories.{ts,tsx}',
      '**/__tests__/**/*.{ts,tsx}',
      '**/__stories__/**/*.{ts,tsx}',
    ],
    rules: { '@typescript-eslint/no-restricted-imports': 'off' },
  },
])
```

## 3. Hook PreToolUse MCP-only em `components/ui/`

Descoberta crítica do research: o MCP server oficial shadcn (registrado como `shadcn` em `.mcp.json` com `npx shadcn@latest mcp`) **não escreve arquivos diretamente**. Ele expõe 7 tools (`get_project_registries`, `list_items_in_registries`, `search_items_in_registries`, `view_items_in_registries`, `get_item_examples_from_registries`, `get_add_command_for_items`, `get_audit_checklist` — fonte: `github.com/shadcn-ui/ui/blob/main/skills/shadcn/mcp.md`). `get_add_command_for_items` retorna uma **string** tipo `npx shadcn@latest add @shadcn/button`; Claude então invoca **Bash** para executá-la, e o CLI escreve direto no disco — **não** passa por `Write`/`Edit` (a issue shadcn-ui/ui #8740 revela que `SHADCN_CLI_COMMAND` é hardcoded em `packages/shadcn/src/mcp/utils.ts`, evidenciando que o tool retorna comando-string para execução separada; "não escreve por Write/Edit" é inferência consistente, não citação direta — confirme com `/mcp` em runtime). Consequência: um hook só em `Write|Edit` já naturalmente impede Claude de tocar `components/ui/` à mão, e o `Bash` rodando `shadcn add` é o canal legítimo. A "detecção MCP vs Claude direto" se resume a: Write/Edit em `components/ui/` = sempre Claude direto (bloqueie); Bash matching `shadcn ... add` = MCP-originado (permita). Hook MCP-tool matcher segue padrão `mcp__shadcn__*` (Claude Code hooks reference em code.claude.com/docs/en/hooks: "MCP tools follow the naming pattern mcp**<server>**<tool>").

```bash
# .claude/hooks/guard-ui-zone.sh
#!/usr/bin/env bash
set -euo pipefail
INPUT=$(cat)
FILE=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // ""')
case "$FILE" in
  */components/ui/*)
    jq -n '{
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: "components/ui/** é zona quarentenada. Use o MCP shadcn (get_add_command_for_items → Bash npx shadcn add) ou crie wrapper em components/app-*. Vide ADR-001."
      }
    }'
    exit 0
    ;;
esac
exit 0
```

```json
// .claude/settings.json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          { "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/guard-ui-zone.sh" }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-shadcn-add.sh" }
        ]
      },
      {
        "matcher": "mcp__shadcn__get_add_command_for_items",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/inject-cleanup-prompt.sh"
          }
        ]
      }
    ]
  }
}
```

## 4. Wrapper pattern com tenant theming

Tenant theming: **NÃO** passe cor por prop — passe um `tenantVariant` semântico (`"primary" | "danger" | "paywall"`) que mapeia para CSS vars já scopadas pelo `ThemeProvider` em `data-tenant`. Vars vivem em `@theme inline` do Tailwind v4 (`--color-tenant-primary: var(--tenant-primary)`), e o tenant resolver injeta `--tenant-primary: oklch(...)` em runtime no `<html data-tenant="acme">`. i18n entra **no wrapper, nunca via prop string**: o wrapper recebe `i18nKey` (não a string final) e chama `useTranslations()` internamente. Isto evita props serializadas vazando strings ao Client Component e permite que server e client wrappers compartilhem a mesma API. Fonte primária: next-intl docs ([next-intl.dev/docs/environments/server-client-components](https://next-intl.dev/docs/environments/server-client-components)) — "The preferred approach is to pass the processed labels as props or children from a Server Component"; shadcn Dialog docs ([ui.shadcn.com/docs/components/dialog](https://ui.shadcn.com/docs/components/dialog)); Tailwind v4 `@theme inline` referencia vars runtime via `var(--name)`.

```tsx
// components/app-button/app-button.tsx
'use client'
import { useTranslations } from 'next-intl'
import { Button, type ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type TenantVariant = 'primary' | 'danger' | 'neutral' | 'paywall'

const TENANT_CLASSES: Record<TenantVariant, string> = {
  primary: 'bg-[var(--tenant-primary)] text-[var(--tenant-on-primary)] hover:opacity-90',
  danger: 'bg-[var(--tenant-danger)] text-[var(--tenant-on-danger)]',
  neutral: 'bg-[var(--tenant-surface)] text-[var(--tenant-on-surface)]',
  paywall: 'bg-[var(--tenant-paywall)] text-[var(--tenant-on-paywall)]',
}

export interface AppButtonProps extends Omit<ButtonProps, 'variant' | 'children'> {
  tenantVariant?: TenantVariant
  i18nKey: string // "checkout.cta.confirm" — nunca string crua
  i18nValues?: Record<string, string | number>
}

export function AppButton({
  tenantVariant = 'primary',
  i18nKey,
  i18nValues,
  className,
  ...rest
}: AppButtonProps) {
  const t = useTranslations()
  return (
    <Button className={cn(TENANT_CLASSES[tenantVariant], className)} {...rest}>
      {t(i18nKey, i18nValues)}
    </Button>
  )
}
```

```tsx
// components/app-paywall-modal/app-paywall-modal.tsx
'use client'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { AppButton } from '@/components/app-button'

interface AppPaywallModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  i18nNamespace: string // "billing.paywall.proPlan"
  onUpgrade: () => void
}

export function AppPaywallModal({
  open,
  onOpenChange,
  i18nNamespace,
  onUpgrade,
}: AppPaywallModalProps) {
  const t = useTranslations(i18nNamespace)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--tenant-surface)]">
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <AppButton
            tenantVariant="neutral"
            i18nKey={`${i18nNamespace}.dismiss`}
            onClick={() => onOpenChange(false)}
          />
          <AppButton
            tenantVariant="paywall"
            i18nKey={`${i18nNamespace}.upgrade`}
            onClick={onUpgrade}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
```

## 5. Blocks JIT pipeline de limpeza pós-add

Use os três layers já existentes em sinergia, sem reinventar: (a) o MCP server shadcn já expõe `get_audit_checklist` — chame-o como step obrigatório do prompt; (b) um `PostToolUse` hook matching `Bash` quando o comando contém `shadcn` + `add` injeta um system reminder com o checklist e roda extração automática de strings literais (script `scripts/extract-literals.ts` que parseia AST e adiciona placeholders em `messages/pt-BR.json`); (c) `pnpm validate:apca` (vide Q7) é o gate final que falha o build. **Não** crie uma Skill custom — duplica capability do `get_audit_checklist` da shadcn. Quem executa: o hook é determinístico (sempre roda), o `get_audit_checklist` é o que Claude consulta para o checklist textual, e Claude faz a edição (move para `components/app-*`, troca cores hardcoded por vars, deleta variants). Fonte primária: Claude Code hooks docs ([code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks)) — "PostToolUse runs after Claude completes an action, making them perfect for cleanup tasks"; shadcn skills/mcp.md confirma `get_audit_checklist` ("Returns a checklist for verifying components (imports, deps, lint, TypeScript)").

```bash
# .claude/hooks/post-shadcn-add.sh
#!/usr/bin/env bash
set -euo pipefail
INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // ""')
[[ "$CMD" =~ shadcn(@[^[:space:]]+)?[[:space:]]+add ]] || exit 0

# Mensagem injetada para Claude via stderr (visível em PostToolUse via additionalContext)
cat <<'EOF' >&2
🧹 Pós-add checklist obrigatório (executar AGORA, ordem importa):
  1. Chame mcp__shadcn__get_audit_checklist e siga TODOS os passos.
  2. grep -rE '"[A-Z][a-zA-Z ]{2,}"' components/ui/<novo>/  → extrair toda string para messages/pt-BR.json
  3. grep -rE 'oklch\(|#[0-9a-fA-F]{3,8}|rgb\(' components/ui/<novo>/  → trocar por var(--tenant-*)
  4. Deletar variants cva() não consumidos pelo wrapper (mantém só o que app-* usa).
  5. Criar wrapper em components/app-<novo>/ (vide ADR-004) — wrapper é PÚBLICO, ui/* é PRIVADO.
  6. pnpm validate:apca && pnpm lint --max-warnings 0
EOF
exit 0
```

## 6. Charts Recharts tokenização

`shadcn/ui` Charts já tem o protocolo: 5 vars (`--chart-1`..`--chart-5`) em `@theme inline` referenciando vars tenant-scopadas (Recharts v3 mudou de `hsl(var(--chart-1))` para `var(--chart-1)` direto). Para multi-tenant: cada tenant define seus 5 valores em `[data-tenant="X"] { --chart-1: oklch(...) }`, e o `@theme inline` faz o bridge. i18n entra via `ChartConfig.label` (objeto, não JSX), populado por wrapper que chama `t()` antes de passar para o `<ChartContainer>`. Validação de contraste roda no script APCA (Q7) iterando os 5 vars contra `--tenant-surface`. Fonte primária: shadcn charts docs ([ui.shadcn.com/docs/components/chart](https://ui.shadcn.com/docs/components/chart)) — "Use `var(--chart-1)` instead of `hsl(var(--chart-1))` when you reference chart tokens from your CSS variables"; Tailwind v4 `@theme inline` permite re-export de vars runtime.

```css
/* app/globals.css */
@import 'tailwindcss';

@layer base {
  :root {
    --tenant-primary: oklch(0.55 0.2 250);
    --tenant-surface: oklch(0.18 0.01 280);
    --chart-1: var(--tenant-primary);
    --chart-2: oklch(0.65 0.18 160);
    --chart-3: oklch(0.7 0.15 85);
    --chart-4: oklch(0.6 0.22 310);
    --chart-5: oklch(0.55 0.2 25);
  }
  [data-tenant='acme'] {
    --tenant-primary: oklch(0.62 0.18 145);
    --chart-1: var(--tenant-primary);
    --chart-2: oklch(0.58 0.16 200);
    /* ...tenant override completo dos 5 */
  }
}

@theme inline {
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
}
```

```tsx
// components/app-revenue-chart/app-revenue-chart.tsx
'use client'
import { useTranslations } from 'next-intl'
import { Bar, BarChart, XAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

export function AppRevenueChart({
  data,
}: {
  data: Array<{ month: string; revenue: number; refunds: number }>
}) {
  const t = useTranslations('charts.revenue')
  const config = {
    revenue: { label: t('revenue'), color: 'var(--chart-1)' },
    refunds: { label: t('refunds'), color: 'var(--chart-2)' },
  } satisfies ChartConfig
  return (
    <ChartContainer config={config} className="min-h-[240px] w-full">
      <BarChart accessibilityLayer data={data}>
        <XAxis dataKey="month" />
        <Bar dataKey="revenue" fill="var(--color-revenue)" />
        <Bar dataKey="refunds" fill="var(--color-refunds)" />
        <ChartTooltip content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  )
}
```

## 7. APCA gate build-time ou runtime

**Build-time, não runtime.** Runtime gates falham silenciosamente em prod (ninguém vê o `console.warn`) e adicionam JS ao bundle. Build-time script roda na pipeline Vercel via `vercel-build` que invoca `pnpm validate:apca` antes do `next build`; se qualquer par tenant×role quebra os thresholds (Silver: Lc ≥75 body / ≥60 large; o "Silver Lc 30 fill, Bronze Lc 45 thin" do contexto refere-se a contraste de UI elements não-texto — Lc 45 mínimo para "larger, heavier text (36px normal weight or 24px bold)" e elementos finos requerem mais), o script `process.exit(1)` e o deploy falha. Use `apca-w3` (npm `apca-w3`, repo github.com/Myndex/apca-w3 mantido por Myndex/Andrew Somers; "licensed to the W3/AGWG per the collaborative agreement") — `APCAcontrast(sRGBtoY(text), sRGBtoY(bg))` retorna **signed float** (-108.0 a 106.0 aproximadamente, não INT). Itere todos os pares `tenant × { primary, danger, surface, chart-1..5 } × { on-surface, on-primary }`. Fonte primária: APCA-W3 npm ([npmjs.com/package/apca-w3](https://www.npmjs.com/package/apca-w3)) — "By default returns a signed float -108.0 to 106.0 (approx)"; thresholds via git.apcacontrast.com/documentation/README: "Lc 75 ... minimum level for columns of body text… Lc 60 ... minimum for content text… Lc 45 ... minimum for larger, heavier text."

```ts
// scripts/validate-apca.ts
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { colorParsley } from 'colorparsley'
import { converter, formatRgb } from 'culori' // converte oklch → rgb
import tenants from '../config/tenants.json' with { type: 'json' }

const SILVER_BODY = 75,
  SILVER_FILL = 60,
  BRONZE_THIN = 45
const toRgb = (oklch: string) => formatRgb(converter('rgb')(oklch)!)

type Pair = { tenant: string; role: string; fg: string; bg: string; min: number }
const failures: string[] = []

for (const [tenant, vars] of Object.entries(tenants)) {
  const pairs: Pair[] = [
    {
      tenant,
      role: 'text-on-surface',
      fg: vars['on-surface'],
      bg: vars['surface'],
      min: SILVER_BODY,
    },
    {
      tenant,
      role: 'text-on-primary',
      fg: vars['on-primary'],
      bg: vars['primary'],
      min: SILVER_BODY,
    },
    {
      tenant,
      role: 'chart-1-on-surface',
      fg: vars['chart-1'],
      bg: vars['surface'],
      min: BRONZE_THIN,
    },
    // ... chart-2..5, danger, paywall
  ]
  for (const p of pairs) {
    const Lc = Math.abs(
      APCAcontrast(
        sRGBtoY(colorParsley(toRgb(p.fg))),
        sRGBtoY(colorParsley(toRgb(p.bg))),
      ) as number,
    )
    if (Lc < p.min) failures.push(`✗ ${p.tenant}/${p.role}: Lc ${Lc.toFixed(1)} < ${p.min}`)
  }
}

if (failures.length) {
  console.error(failures.join('\n'))
  process.exit(1)
}
console.log('✓ APCA dual-gate passed')
```

```json
// package.json
{
  "scripts": {
    "validate:apca": "tsx scripts/validate-apca.ts",
    "vercel-build": "pnpm validate:apca && next build"
  }
}
```

## 8. Storybook 10 + zona quarentenada

Stories ficam **co-localizadas com a primitive**: `components/ui/button/button.stories.tsx`, não em `components/app-*/__stories__/`. Razão: stories são o teste de contrato visual da primitive nua — se você só storyfica o wrapper, perde a documentação do design system base e nunca vê regressões em variants/states do Radix. O conflito com `no-restricted-imports` resolve com glob override (vide Q2 exceção 2). O `eslint-plugin-storybook` flat config já fornece `storybook.configs['flat/recommended']`, e você adiciona um bloco file-scoped que desliga `no-restricted-imports` e `i18next/no-literal-string` (stories tem strings de demo em inglês). Note que o repo `storybookjs/eslint-plugin-storybook` foi arquivado em 7-Nov-2025 ("This repository was archived by the owner on Nov 7, 2025. It is now read-only.") e migrado para dentro do monorepo `storybookjs/storybook` via PR #31151 ("This PR aims to move the Storybook ESLint plugin into the monorepo") — mesma API, mesmo nome de pacote npm. Fonte primária: Storybook docs ([storybook.js.org/docs/configure/integration/eslint-plugin](https://storybook.js.org/docs/configure/integration/eslint-plugin)) mostra o pattern flat config exato; ESLint flat config docs confirmam que objetos posteriores com `files` sobrescrevem regras anteriores.

```ts
// eslint.config.ts (acrescentar APÓS a config de quarentena de Q2)
import storybook from 'eslint-plugin-storybook'

export default defineConfig([
  // ...regras anteriores
  ...storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)'],
    rules: {
      // Stories podem importar UI primitives direto (são o test bed)
      '@typescript-eslint/no-restricted-imports': 'off',
      // Stories têm strings literais de demo intencionalmente
      'i18next/no-literal-string': 'off',
      'react/jsx-no-literals': 'off',
      // Storybook-specific gates obrigatórios
      'storybook/csf-component': 'error',
      'storybook/hierarchy-separator': 'error',
      'storybook/no-stories-of': 'error',
      'storybook/default-exports': 'error',
    },
  },
])
```

Estrutura de diretório resultante:

```
components/
  ui/
    button/
      button.tsx              ← shadcn primitive (zona quarentenada)
      button.stories.tsx      ← documenta TODOS os variants/states do Radix
  app-button/
    app-button.tsx            ← wrapper PT-BR + tenant theming
    app-button.stories.tsx    ← documenta o contrato i18n + tenantVariant
    index.ts                  ← re-export público
```
