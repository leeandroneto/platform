# Plano de Fechamento Dia 0 — Shadcn Zone Quarantine + i18n + APCA + Wrappers

> **Status:** approved · **Data:** 2026-05-18 · **Owner:** Leandro
> Plano executável de 11 etapas pra fechar dia 0 antes de começar Feature 1 (M1 funil agência).
> Substitui Etapas 1-9 do SESSION-DUMP antigo. Fonte única.

---

## 0. Contexto em 1 minuto

**Dia 0 do `platform/` está quase fechado:**

- ✅ Theming multi-tenant via CSS vars do banco funciona automático (`<Button>` puro vira cor do tenant)
- ✅ 47 primitives shadcn instalados, pristine
- ✅ 4 hooks PreToolUse + 9 `.claude/rules/*.md` + 24-ish regras ESLint
- ✅ APCA validator dia 0 (`validate-palettes.ts`) + 13 paletas seed + tenant theming route
- ✅ Sheriff boundaries + Knip + features/\_template/
- ✅ Tarefa 14 Motion presets, Tarefa 25.5 vertical slice

**Faltam 3 coisas pra dia 0 fechar de verdade:**

1. **Travas:** lint não bloqueia import direto de `@/components/ui/*` (cria brecha)
2. **i18n não instalado:** primeira string PT-BR vai travar lint sem next-intl configurado
3. **APCA não wireado no build:** validation existe, deploy não falha se quebrar

**Este plano fecha esses 3 gaps + memória executável JIT.**

---

## 1. Alinhamento com planos existentes

### Não conflita com Phase A Final

Phase A Final tem 5 fases. Status:

- F1 ✅ done (hooks PreToolUse JSON output)
- F2 ✅ done (shadcn MCP + wrapper pattern doc)
- F3 ⏳ pendente: Storybook 10 substitui Ladle (ADR-0038 planejada)
- F4 ⏳ pendente: Makerkit entitlements recipe (ADR-0039)
- F5 ⏳ pendente: cleanup docs + ressalvas backlog

**Este plano NÃO mexe em F3/F4/F5.** Executa em paralelo, fecha gates diferentes.

### Completa Checklist 15 (Bootstrap)

Tarefas pendentes do `docs/blueprint/15-bootstrap-checklist.md`:

- Tarefa 14 (Motion) ✅ feito
- **Tarefa 15 (APCA validator):** este plano Etapa 5 cobre
- Tarefa 18 (Lucide ~80 ícones) — JIT por feature
- Tarefa 24 (`<Logo>`) — JIT (decisão 2)
- Tarefa 25.5 (vertical slice) ✅ feito
- Tarefa 27 (CLAUDE.md + rules) — este plano Etapa 1 estende
- Tarefa 28 (hooks Claude) — este plano Etapa 3 estende (post-shadcn-add)
- Tarefa 29 (Ladle stories) — deferida pra F3 Phase A Final
- Tarefa 30 (commit final) — este plano Etapa 11 commit local sem push

### Avança Gate M0 do Roadmap 11

Gate M0 exige:

- ✅ `pnpm build` passa em CI — este plano Etapa 9 valida
- ✅ `pnpm typecheck` 0 erros — esperado verde
- ⚠️ `pnpm lint --max-warnings 0` — este plano fecha (zona quarentenada + wrappers destravam)
- ✅ `pnpm vocab:audit` + `pnpm i18n:audit` + `pnpm token:audit` — i18n setup adicionado
- ⚠️ `pnpm size` (bundle budgets) — este plano Etapa 8 cria `.size-limit.ts`
- ❌ Smoke signup E2E — fora deste plano (feature 1)
- ❌ Lighthouse — fora (feature 1)
- ✅ `theme.css` sem FOUC — funcional
- ❌ PWA install iPhone 14 — fora (feature 1)
- ❌ Ladle 15 stories — Phase A Final F3

Este plano fecha **4 dos 11 gates pendentes** de M0.

---

## 2. As 11 etapas em ordem

| #   | Etapa                                                                             | Tempo  | Bloqueia próxima?                      |
| --- | --------------------------------------------------------------------------------- | ------ | -------------------------------------- |
| 1   | Docs (ADR-0040 + 6 rules + atualizações)                                          | ~2h    | Sim — rest precisa de doc autoritativo |
| 2   | ESLint travas (zona quarentenada + no-restricted-imports + ativar i18next plugin) | ~1h    | Sim                                    |
| 3   | Knip + Sheriff + Hooks (voltar entries + reforçar gate + criar post-shadcn-add)   | ~45min | Não                                    |
| 4   | i18n setup (next-intl namespace + messages estrutura + AppError extend)           | ~1h    | Sim — wrappers usam i18n               |
| 5   | APCA (refatorar contrast helpers + Silver matrix + prebuild gate)                 | ~1h    | Não                                    |
| 6   | 5 wrappers críticos (AppButton, AppInput, AppForm, AppDialog, AppToast)           | ~3h    | Não                                    |
| 7   | 5 typography essenciais (Heading, Text, Stack, Container, EmptyState)             | ~3h    | Não                                    |
| 8   | `.size-limit.ts` bundle budgets                                                   | ~30min | Não                                    |
| 9   | Validação (typecheck + lint + knip + validate:apca + smoke theme.css)             | ~30min | Sim — gate antes commit                |
| 10  | Teste de memória JIT (eu leio docs cego e tento executar 5 cenários)              | ~30min | Não — gate qualidade docs              |
| 11  | Commit local main (sem push, mensagem detalhada)                                  | ~10min | —                                      |

**Total estimado:** ~13h (otimisticamente ~10h, com folga ~16h).

**Sequenciamento crítico:**

- Etapa 1 → 2 → 4 → 6/7 obrigatório em série (cada uma depende da anterior)
- Etapa 3, 5, 8 podem rodar em paralelo após 1
- Etapa 9 → 10 → 11 em série final

---

## 3. Etapa 1 — Docs (ADR-0040 + 6 rules + atualizações)

### 3.1 Criar ADR-0040 — `docs/adr/0040-fechamento-dia-0-shadcn-zone-quarantine.md`

Formato Michael Nygard (`docs/adr/0017-*.md` define padrão).

**Status:** accepted
**Date:** 2026-05-18

**Context:**

- Pesquisas 17 + 18 + 19 fechadas
- Decisão A (2026-05-18) removeu §1/§7 do ADR-0031 esperando solução definitiva
- Audit revelou theming via CSS vars já resolve cor/fonte/shape — wrapper só pra agregar valor
- 5 wrappers críticos + 5 typography essenciais cobrem feature 1

**Decision sections:**

- A. Zona quarentenada `components/ui/**` — lista narrowest de regras off (Pesquisa 18 Q1)
- B. `@typescript-eslint/no-restricted-imports` bloqueando `@/components/ui/*` em features/app/lib
- C. Hook reforçado: bloqueia Edit em `components/ui/*` (só Bash `npx shadcn add` legítimo)
- D. Hook novo `post-shadcn-add.sh` PostToolUse Bash com checklist obrigatório
- E. 5 wrappers críticos com valor agregado obrigatório (Vercel Academy: passthrough proibido)
- F. 5 typography essenciais (Curtis: 4-6 heading + 3 text universal)
- G. i18n namespace por feature (`messages/<locale>/<namespace>.json`)
- H. APCA Silver dual-gate (75/60/45) substitui Bronze (75/30)
- I. `AppError.factory` estendido pra aceitar `{ key, fallback }`
- J. Wire APCA via `prebuild` script (não vercel.ts)
- K. 6 novos `.claude/rules/*.md` granular com playbook JIT
- L. Itens deferidos JIT (7 typography + Logo + tenant copy override + locales adicionais + 42 wrappers não-críticos + abstração shadcn)

**Consequences:**

- Build verde dia 0
- Memória externa pra JIT chegar (playbooks)
- Wrapper pattern com guard real (passthrough proibido)
- APCA falha deploy em paleta quebrada

### 3.2 Criar 6 `.claude/rules/*.md` (granular)

Cada arquivo segue padrão dos 9 existentes (frontmatter `paths:` + checklist + anti-pattern + referência).

#### A. `.claude/rules/i18n.md`

```yaml
---
name: i18n — next-intl namespace por feature
description: Antes de escrever string PT-BR ou usar t(), consultar setup + estrutura messages/ + AppError pattern
paths:
  - 'app/**/*.{ts,tsx}'
  - 'components/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
  - 'lib/contracts/errors.ts'
  - 'messages/**/*.json'
---
```

Conteúdo:

- **Setup obrigatório** (gatilho: primeira string PT-BR aparece em qualquer JSX/server)
  - `i18n/request.ts` + `NextIntlClientProvider` em `app/layout.tsx`
  - `messages/pt-BR/common.json` (dia 0)
  - Provider hidrata via `getMessages()` do next-intl 4
- **Estrutura namespace por feature** (não flat)
  - `messages/<locale>/<namespace>.json`
  - Namespaces dia 0: `common` (header, footer, errors gerais, validation)
  - Adicionar JIT: `auth.json` (com feature login), `billing.json` (com paywall), `programs.json` (com primeiro programa)
- **Como usar `t()`**
  - Server Components: `import {getTranslations} from 'next-intl/server'`
  - Client Components: `import {useTranslations} from 'next-intl'`
  - Wrapper pattern: `<AppButton i18nKey="checkout.confirm">` (não string crua)
- **AppError pattern** (regra ESLint 7 bloqueia `new Error('msg')` literal)
  - `AppError.invalidInput({ key: 'errors.invalid_email', fallback: 'Invalid email' })`
  - Server-side loga `fallback` (EN), client traduz `key` via `t()`
- **Zod messages** (regra ESLint 11 bloqueia `.message('texto')`)
  - Wrap em factory `validators(t)` no callsite, não no schema
- **Anti-patterns**
  - String hardcoded em JSX → use `{t('key')}`
  - String passada por prop → use `i18nKey`
  - Tenant override copy: NÃO criar tabela dia 0 (M3+)
- **Locales adicionais** (gatilho: cliente internacional)
  - Adicionar `messages/<locale>/<namespace>.json` (estrutura aceita irmãos sem refactor)
- **Referências:** ADR-0040 §G, Pesquisa 19, next-intl Discussion #357

#### B. `.claude/rules/contrast.md`

```yaml
---
name: APCA Silver dual-gate (contrast)
description: Antes de criar paleta nova ou alterar cor de role, validar APCA Silver. Helpers em lib/design/contrast.ts.
paths:
  - 'lib/design/**/*.ts'
  - 'app/api/{tenants,brands}/[id]/theme.css/route.ts'
  - 'scripts/validate-palettes.ts'
  - 'app/(admin)/**/*.{ts,tsx}'
---
```

Conteúdo:

- **APCA Silver thresholds:** body Lc ≥75, large ≥60, non-text ≥45
- **Helpers `lib/design/contrast.ts`:** `apca`, `meetsApca`, `ensureAccessible`, `pickReadableForeground`
- **Validação build-time:** `pnpm validate:apca` em `prebuild` script. Quebra paleta = quebra deploy.
- **Validação runtime** (gatilho: tenant salva theme custom)
  - Server action chama `ensureAccessible()` antes de persistir
  - Rejeita se não atinge Silver
- **Matrix testada:** cada tenant × { primary, danger, surface, chart-1..5 } × { on-surface, on-primary }
- **Anti-patterns**
  - Hardcoded color em `.tsx` → use CSS var
  - Threshold customizado por componente → mantém Silver universal
- **Referências:** ADR-0040 §H, ADR-0032, blueprint 05 §5, Pesquisa 18 Q7

#### C. `.claude/rules/shadcn-zone.md`

```yaml
---
name: Zona quarentenada shadcn + wrapper pattern
description: components/ui/* é vendor surface intocável. Toda edição via Bash npx shadcn add. Wrapper só com valor agregado.
paths:
  - 'components/ui/**/*.{ts,tsx}'
  - 'components/app-*.tsx'
  - 'features/**/components/**/*.{ts,tsx}'
---
```

Conteúdo:

- **Zona quarentenada (`components/ui/**`):\*\*
  - NUNCA Edit direto — hook `component-research-gate.sh` bloqueia
  - Canal único: `npx shadcn add <slug>` via Bash
  - Hook PostToolUse `post-shadcn-add.sh` injeta checklist após add
- **Checklist pós `shadcn add`:**
  1. Rodar `mcp__shadcn__get_audit_checklist`
  2. Grep strings literais → mover pra `messages/pt-BR/<namespace>.json`
  3. Grep `oklch(|#hex|rgb(` → trocar por `var(--tenant-*)`
  4. Deletar variants cva não usados pelo wrapper
  5. Criar wrapper `components/app-<nome>.tsx` se primitive vai ser usado em features
  6. `pnpm validate:apca && pnpm lint --max-warnings 0`
- **Wrapper pattern (`components/app-*`):**
  - **Obrigatório agregar valor concreto** (i18nKey, loading, error display, telemetria)
  - **Proibido passthrough** (só re-exportar = anti-pattern Vercel Academy)
  - Marker linha 1: `// RESEARCH: shadcn/ui <primitive> + <valor agregado>`
- **5 wrappers críticos dia 0:** AppButton, AppInput, AppForm, AppDialog, AppToast
- **42 wrappers não-críticos:** JIT por consumer
- **Imports proibidos em features/app/lib:** `@/components/ui/*` direto. Use `@/components/app-*`. Exceção: type-only (`type {ButtonProps}` OK via `allowTypeImports`)
- **Stories e tests:** podem importar `@/components/ui/*` direto (override de path)
- **Referências:** ADR-0040 §A-§E, Pesquisa 18 Q1-Q5, Vercel Academy

#### D. `.claude/rules/design-tokens.md`

```yaml
---
name: Design tokens — usos canônicos
description: --color-primary, --color-surface-*, --radius, --font-* — onde usar, onde NÃO usar
paths:
  - 'app/**/*.{ts,tsx,css}'
  - 'components/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
---
```

Conteúdo:

- **Tabela de tokens** (replicar blueprint 05 §3 "Design tokens — uso")
- **CSS vars vêm do banco** via `/api/{tenants,brands}/[id]/theme.css?v=N`
- **shadcn primitives herdam automático** — não passar cor por prop
- **Anti-patterns** (ESLint `design-tokens/no-tailwind-bypass` bloqueia)
  - `text-xl`, `rounded-md`, `uppercase` → use `<Heading>`, `var(--shape-*)`, `<Eyebrow>`
  - `#hex`, `rgba()` em .tsx → use `var(--color-*)`
- **Referências:** ADR-0040, blueprint 05 §3

#### E. `.claude/rules/brand.md`

```yaml
---
name: Brand identity — env + useBrand
description: Brand multi-marca via env vars + RouteProvider. Nunca hardcoded.
paths:
  - 'app/**/*.{ts,tsx}'
  - 'components/**/*.{ts,tsx}'
  - 'features/**/*.{ts,tsx}'
  - 'lib/route/**/*.ts'
---
```

Conteúdo:

- **Brand identity:** `env.NEXT_PUBLIC_BRAND_NAME` / `BRAND_DOMAIN` / `BRAND_PARENT`
- **Hook `useBrand()`** retorna `{ id, name, default_vertical, ...}`
- **Hook `useTenant()`** retorna tenant atual ou throw
- **Anti-patterns** (ESLint `brand/no-brand-hardcode` bloqueia)
  - `'desafit'`, `'yoga.app'`, `'ingles.app'` literais
- **Multi-vertical:** strings por vertical usam keys descritivas (`programs.title.musculacao` vs flat shared)
- **Referências:** ADR-0021, ADR-0022, blueprint 05 §12

#### F. `.claude/rules/entitlements.md`

```yaml
---
name: Entitlements — requireEntitlement + i18n
description: Plan gating server-side via requireEntitlement(). Mensagens via AppError factory com i18n key.
paths:
  - 'features/**/*.{ts,tsx}'
  - 'app/(admin)/**/*.{ts,tsx}'
  - 'lib/entitlements/**/*.ts'
---
```

Conteúdo:

- **Server (RSC + Server Actions):** `requireEntitlement('feature_key')`
- **Client:** `useEntitlement('feature_key')` retorna `{ allowed, plan, upgradeUrl }`
- **AppError msg i18n:** `AppError.forbidden({ key: 'entitlements.feature_blocked', fallback: 'Plan upgrade required', metadata: { feature } })`
- **Plan-gates obrigatório:** `features/<name>/index.ts` re-exporta `./plan-gates` (regra ESLint enforce)
- **Anti-patterns:**
  - `if (plan === 'A') { ... }` no JSX → use `useEntitlement()` ou `<EntitlementGate>` (JIT)
  - Hardcoded plan name → vem do banco
- **Referências:** ADR-0034, ADR-0035, blueprint 09

### 3.3 Atualizar arquivos existentes

| Arquivo                                                 | Mudança                                                          |
| ------------------------------------------------------- | ---------------------------------------------------------------- |
| `CLAUDE.md`                                             | Adicionar ponteiros pros 6 novos rules em "Onde fica cada coisa" |
| `docs/adr/0031-lint-overrides-intentional.md`           | Status: ADR-0040 supersede §1+§7. Mantém §2-§6/§8-§10            |
| `docs/adr/0037-wrapper-pattern-hierarchy-registries.md` | Update §B refletindo 5 wrappers críticos + passthrough proibido  |
| `docs/blueprint/05-design-system.md`                    | §5 confirma Silver dual-gate. Adicionar tarefa 15 ✅ done        |
| `docs/blueprint/13-lint-enforcement.md`                 | Marcar regras 17 + 24 + 12 i18n como implementadas               |
| `docs/blueprint/15-bootstrap-checklist.md`              | Tarefa 15 → ADR-0040, marcar etapas completadas                  |
| `CHANGELOG.md`                                          | Entry [Unreleased] Added + Changed cobrindo tudo                 |
| `.claude/hooks/load-context.sh`                         | Ponteiros pros 6 novos rules                                     |

### 3.4 Atualizar mensagens dos hooks pra apontar rules

Cada hook que retorna `permissionDecision: deny` deve citar `.claude/rules/<arquivo>.md` específico na mensagem.

Exemplo `block-token-bypass.sh`: já cita `.claude/rules/naming.md`. Adicionar `.claude/rules/design-tokens.md`.

---

## 4. Etapa 2 — ESLint travas

### 4.1 Voltar §1 ADR-0031 com lista narrowest (Pesquisa 18 Q1)

```js
// eslint.config.mjs
{
  files: ['components/ui/**/*.{ts,tsx}'],
  rules: {
    // OFF (vendor surface — shadcn primitives violam por design)
    'i18next/no-literal-string': 'off',
    'react/jsx-no-literals': 'off',
    'jsx-a11y/no-autofocus': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'react/no-unknown-property': 'off',
    'no-restricted-syntax': 'off',
    'design-tokens/no-tailwind-bypass': 'off',
    'max-lines': 'off',
    'max-lines-per-function': 'off',
    'complexity': 'off',
    'react-hooks/set-state-in-effect': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-noninteractive-element-interactions': 'off',
    'jsx-a11y/anchor-has-content': 'off',

    // MANTER ON (pegam BUG, não estilo)
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-floating-promises': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'import/no-cycle': 'error',
    'no-undef': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
  },
}
```

### 4.2 Voltar §7 (`hooks/use-mobile.ts`)

Idêntico ao original.

### 4.3 Novo bloco — `@typescript-eslint/no-restricted-imports` bloqueando `@/components/ui/*`

```js
{
  files: ['**/*.{ts,tsx}'],
  rules: {
    '@typescript-eslint/no-restricted-imports': ['error', {
      patterns: [{
        group: ['@/components/ui/*', '@/components/ui'],
        message: 'Importe via @/components/app-* (wrapper). UI primitives são zona quarentenada — vide ADR-0040 + .claude/rules/shadcn-zone.md.',
        allowTypeImports: true,
      }],
    }],
  },
},
{
  files: ['components/app-*/**/*.{ts,tsx}', 'components/app-*.tsx'],
  rules: { '@typescript-eslint/no-restricted-imports': 'off' },
},
{
  files: ['**/*.{test,spec}.{ts,tsx}', '**/*.stories.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}', '**/__stories__/**/*.{ts,tsx}'],
  rules: { '@typescript-eslint/no-restricted-imports': 'off' },
}
```

### 4.4 Ativar `eslint-plugin-i18next`

```js
import i18next from 'eslint-plugin-i18next'
// ...
i18next.configs['flat/recommended'],
```

Adicionar override pra desligar em `components/ui/**` (já incluído na lista narrowest acima).

### 4.5 Implementar 14 regras blueprint 13 faltantes

Regra 17 (MemberExpression CSS var em JS): plugin custom novo.
Regra 24 (`'use client'` guard em server-only): plugin custom novo.
12 padrões i18n da tabela §2.2 já parcialmente cobertos por `no-restricted-syntax` × 8 + `eslint-plugin-i18next`. Faltam 4 — adicionar ou deferir pra `ADR-0041` (próximo plano).

**Decisão pragmática:** implementar regras 17, 24 + os 4 padrões i18n faltantes. Total novo: 6 regras.

---

## 5. Etapa 3 — Knip + Sheriff + Hooks

### 5.1 Voltar knip entries shadcn

```ts
// knip.config.ts
entry: [
  '.husky/pre-commit',
  '.husky/pre-push',
  'scripts/**/*.ts',
  'tests/**/*.{ts,tsx}',
  'components/ui/**/*.tsx', // VOLTA
  'lib/supabase/{client,server,admin}.ts',
  // ...
],
ignore: [
  'lib/contracts/database.ts',
  'lib/contracts/money.ts',
  'components/version-switcher.tsx', // VOLTA
  'features/_template/**',
],
ignoreDependencies: [
  '@base-ui/react', // VOLTA
  // ...
],
```

### 5.2 Voltar sheriff `kind:primitive` + ativar `enableBarrelLess`

```ts
// sheriff.config.ts
tagging: {
  'components/<group>': ['type:shared'],
  'components/ui/<component>': ['type:shared', 'kind:primitive'], // VOLTA
  // ...
},
depRules: {
  'kind:primitive': ['kind:contracts'], // VOLTA
  // ...
},
enableBarrelLess: true, // NOVO — ativa boundary check
```

### 5.3 Reforçar `component-research-gate.sh`

Mudar pra bloquear `Edit` (não só `Write`) em `components/ui/*`:

```bash
if [ "$TOOL_NAME" != "Write" ] && [ "$TOOL_NAME" != "Edit" ]; then
  exit 0
fi

# Bloqueia Edit em components/ui/* sempre (canal legítimo = Bash npx shadcn add)
if echo "$NORMALIZED" | grep -qE '(^|/)components/ui/.+\.(ts|tsx)$' && [ "$TOOL_NAME" = "Edit" ]; then
  cat <<'EOF'
{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"components/ui/* é zona quarentenada — proibido Edit direto. Use 'npx shadcn add <slug>' via Bash. Customização vai em components/app-*.tsx (wrapper). Detalhes: .claude/rules/shadcn-zone.md + ADR-0040."}}
EOF
  exit 0
fi

# Resto da lógica (Write em components/** exige marker RESEARCH) mantém igual
```

### 5.4 Criar `.claude/hooks/post-shadcn-add.sh`

```bash
#!/usr/bin/env bash
# PostToolUse Bash hook — injeta checklist obrigatório após `shadcn add`
INPUT=$(cat)
CMD=$(echo "$INPUT" | grep -oE '"command"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"command"\s*:\s*"(.*)"$/\1/')

# Match shadcn add (com ou sem versão pinada)
if ! echo "$CMD" | grep -qE 'shadcn(@[^[:space:]]+)?[[:space:]]+add'; then
  exit 0
fi

cat <<'EOF' >&2

🧹 Pós-add checklist obrigatório (.claude/rules/shadcn-zone.md):
  1. mcp__shadcn__get_audit_checklist — siga todos passos
  2. grep strings literais nos arquivos novos → mover pra messages/pt-BR/<namespace>.json
  3. grep 'oklch(|#hex|rgb(' nos arquivos novos → trocar por var(--tenant-*)
  4. Deletar variants cva() não usados (mantém só o que app-* vai usar)
  5. Criar wrapper components/app-<nome>.tsx se primitive entra em features
  6. pnpm validate:apca && pnpm lint --max-warnings 0

EOF
exit 0
```

Adicionar matcher em `.claude/settings.json`:

```json
"PostToolUse": [
  {
    "matcher": "Bash",
    "hooks": [{ "type": "command", "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/post-shadcn-add.sh" }]
  }
]
```

### 5.5 Criar `.claude/hooks/format-on-write.sh` (blueprint 04 prevê)

```bash
#!/usr/bin/env bash
# PostToolUse Write|Edit hook — roda prettier no arquivo modificado
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -oE '"file_path"\s*:\s*"[^"]*"' | head -1 | sed -E 's/.*"file_path"\s*:\s*"(.*)"$/\1/')

# Só formata .ts/.tsx/.css/.json
if echo "$FILE_PATH" | grep -qE '\.(ts|tsx|css|json|mjs)$'; then
  pnpm exec prettier --write "$FILE_PATH" 2>/dev/null || true
fi
exit 0
```

---

## 6. Etapa 4 — i18n setup

### 6.1 Criar `i18n/request.ts`

Padrão next-intl 4 App Router (confirmar com docs vigentes):

```ts
import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  const locale = 'pt-BR' // hardcoded dia 0 — locale switcher é M3+
  return {
    locale,
    messages: {
      ...(await import(`../messages/${locale}/common.json`)).default,
      // outros namespaces carregam JIT por feature
    },
  }
})
```

### 6.2 Criar `messages/pt-BR/common.json`

Fixture inicial:

```json
{
  "common": {
    "actions": {
      "save": "Salvar",
      "cancel": "Cancelar",
      "confirm": "Confirmar",
      "close": "Fechar"
    },
    "errors": {
      "generic": "Algo deu errado. Tente novamente.",
      "network": "Sem conexão.",
      "not_found": "Não encontrado.",
      "forbidden": "Acesso negado."
    },
    "validation": {
      "required": "Campo obrigatório",
      "invalid_email": "Email inválido"
    }
  }
}
```

### 6.3 Wire `NextIntlClientProvider` em `app/layout.tsx`

```tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'

async function DynamicShell({ children }: { children: React.ReactNode }) {
  // ... lógica existente
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages} locale="pt-BR">
      {/* RouteProvider, EntitlementProvider, Toaster existentes */}
    </NextIntlClientProvider>
  )
}
```

### 6.4 Estender `AppError.factory` pra aceitar `{ key, fallback }`

`lib/contracts/errors.ts`:

```ts
export type I18nMessage =
  | string
  | { key: string; fallback: string; metadata?: Record<string, unknown> }

export const AppError = {
  invalidInput(msg: I18nMessage, metadata?: Record<string, unknown>): AppError {
    const message = typeof msg === 'string' ? msg : msg.fallback
    const i18nKey = typeof msg === 'string' ? undefined : msg.key
    return new AppErrorImpl('invalid_input', message, { metadata: { ...metadata, i18nKey } })
  },
  // ... idem pros outros 11 factories
  // ... `from()` mantém igual
}
```

Client lê `error.metadata.i18nKey`, traduz com `t()`. Server loga `message` (fallback EN).

### 6.5 Criar `next-intl.config.ts` (se next-intl v4 exigir)

Confirmar com docs vigentes do next-intl 4 App Router. Pode ser `next.config.ts` plugin ou separado.

---

## 7. Etapa 5 — APCA

### 7.1 Refatorar helpers inline pra `lib/design/contrast.ts`

Extrair de `scripts/validate-palettes.ts` pra módulo público:

```ts
// lib/design/contrast.ts
import { APCAcontrast, sRGBtoY } from 'apca-w3'
import { converter, type Oklch, type Rgb } from 'culori'

const SILVER_BODY = 75
const SILVER_LARGE = 60
const SILVER_NON_TEXT = 45

export type ApcaRole = 'body' | 'large' | 'non-text'
const THRESHOLDS: Record<ApcaRole, number> = {
  body: SILVER_BODY,
  large: SILVER_LARGE,
  'non-text': SILVER_NON_TEXT,
}

export function apca(fgOklch: string, bgOklch: string): number {
  // ... extrair de validate-palettes.ts
}

export function meetsApca(fg: string, bg: string, role: ApcaRole): boolean {
  return apca(fg, bg) >= THRESHOLDS[role]
}

export function ensureAccessible(fg: string, bg: string, minLc: number): string {
  // bisection L até atingir minLc
  // ... TODO implementação
}

export function pickReadableForeground(bg: string): string {
  // black ou white por |Lc| máximo
  // ... TODO implementação
}
```

### 7.2 Estender `scripts/validate-palettes.ts` pra Silver matrix

Renomear pra `scripts/validate-apca.ts` (ou manter nome, adicionar matrix completa):

```ts
import { meetsApca, apca } from '../lib/design/contrast'
import { OFFICIAL_PALETTES } from '../lib/design/seeds/palettes.seed'

const failures: string[] = []

for (const p of OFFICIAL_PALETTES) {
  const surfaceDark = p.surfaces_dark[0]
  const fg = deriveForeground(surfaceDark)

  // Cenário 1: body text
  if (!meetsApca(fg, surfaceDark, 'body')) {
    failures.push(`${p.slug}: body Lc ${apca(fg, surfaceDark).toFixed(1)} < 75`)
  }
  // Cenário 2: primary filled block
  if (!meetsApca(p.primary_oklch, surfaceDark, 'non-text')) {
    failures.push(`${p.slug}: primary-on-surface Lc < 45`)
  }
  // Cenário 3 (novo): charts on surface
  for (let i = 0; i < 5; i++) {
    const chartColor = p.extras_oklch[i]
    if (!meetsApca(chartColor, surfaceDark, 'non-text')) {
      failures.push(`${p.slug}: chart-${i + 1} Lc < 45`)
    }
  }
  // ... + tenant clones quando vierem
}

if (failures.length > 0) {
  console.error(failures.join('\n'))
  process.exit(1)
}
```

### 7.3 Adicionar scripts em `package.json`

```json
{
  "scripts": {
    "validate:apca": "tsx scripts/validate-apca.ts",
    "prebuild": "pnpm validate:apca"
  }
}
```

(Manter `validate:palettes` como alias por compat com docs antigos.)

### 7.4 NÃO instalar colorparsley

Culori já cobre conversão OKLCH→sRGB.

---

## 8. Etapa 6 — 5 wrappers críticos

Cada um marker `// RESEARCH: shadcn/ui <primitive> + <valor agregado concreto>` linha 1.

### 8.1 `components/app-button.tsx`

```tsx
// RESEARCH: shadcn/ui button + i18nKey + loading state
'use client'
import { useTranslations } from 'next-intl'
import { Button, type ButtonProps } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AppButtonProps extends Omit<ButtonProps, 'children'> {
  i18nKey?: string
  i18nValues?: Record<string, string | number>
  loading?: boolean
  children?: React.ReactNode
}

export function AppButton({
  i18nKey,
  i18nValues,
  loading,
  disabled,
  children,
  className,
  ...rest
}: AppButtonProps) {
  const t = useTranslations()
  const label = i18nKey ? t(i18nKey, i18nValues) : children
  return (
    <Button disabled={disabled ?? loading} className={cn(className)} {...rest}>
      {loading && <Loader2 className="size-4 animate-spin" />}
      {label}
    </Button>
  )
}
```

### 8.2 `components/app-input.tsx`

Wrapper `<Input>` + error display + label integration via `react-hook-form` context.

### 8.3 `components/app-form.tsx`

Wrapper `<Form>` shadcn + submit handler tipado + i18n validation messages do Zod.

### 8.4 `components/app-dialog.tsx`

Wrapper `<Dialog>` + close confirmation opcional + i18nNamespace.

### 8.5 `components/app-toast.tsx`

Wrapper `sonner` Toaster + helpers `toast.success(i18nKey)` semantic.

---

## 9. Etapa 7 — 5 typography essenciais

### 9.1 `components/ui/heading.tsx` (custom, mas em components/ui/ por convenção shadcn)

```tsx
// RESEARCH: custom typography primitive — Eight Shapes Nathan Curtis pattern (4-6 heading levels)
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const headingVariants = cva('font-sans tracking-tight', {
  variants: {
    level: {
      1: 'text-4xl font-bold',
      2: 'text-3xl font-semibold',
      3: 'text-2xl font-semibold',
      4: 'text-xl font-medium',
      5: 'text-lg font-medium',
      6: 'text-base font-medium',
    },
  },
  defaultVariants: { level: 2 },
})

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  asChild?: boolean
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  className?: string
  children: React.ReactNode
}

export function Heading({ level = 2, as, asChild, className, children }: HeadingProps) {
  const Comp = asChild ? Slot : (as ?? (`h${level}` as React.ElementType))
  return <Comp className={cn(headingVariants({ level }), className)}>{children}</Comp>
}
```

(Nota: typography primitives custom violam regra do `no-restricted-imports` em features se ficarem em `components/ui/`. Decisão: ficam em `components/ui/` mas são exceção tipada — features importam via wrapper? Ou ficam em `components/`? **Documentar decisão em ADR-0040 §F.**)

### 9.2 `components/ui/text.tsx`

Variants: `body`, `body-sm`, `caption`, `lead`. `<p>` ou `<span>` via asChild.

### 9.3 `components/ui/stack.tsx`

Layout `flex-col` com `gap-{sm|md|lg|xl}` token.

### 9.4 `components/ui/container.tsx`

`max-w-{sm|md|lg|xl|full}` + padding responsivo.

### 9.5 `components/ui/empty-state.tsx`

Icon Lucide + Heading + Text + slot pra CTA.

**Decisão arquitetural pendente:** typography primitives ficam em `components/ui/` (são primitives) ou `components/typography/`? Resolver em ADR-0040.

---

## 10. Etapa 8 — `.size-limit.ts` bundle budgets

Replicar tabela do blueprint 13 §6:

```ts
import type { SizeLimitConfig } from 'size-limit'

export default [
  { name: 'Landing pública', path: '.next/static/chunks/app/page-*.js', limit: '150 KB' },
  { name: 'Login', path: '.next/static/chunks/app/login/page-*.js', limit: '120 KB' },
  {
    name: 'PWA shell',
    path: '.next/static/chunks/app/(client)/portal/layout-*.js',
    limit: '240 KB',
  },
  // ... outros
] as SizeLimitConfig
```

Wire em CI workflow (`.github/workflows/ci.yml`) — se não existir, deferir pra próxima etapa.

---

## 11. Etapa 9 — Validação

```bash
pnpm typecheck                          # esperado 0 erros
pnpm lint --max-warnings 0              # esperado VERDE (zona quarentenada desligou regras certas)
pnpm knip                               # esperado VERDE (entries shadcn voltaram)
pnpm validate:apca                      # esperado VERDE (13/13 paletas Silver)
pnpm test                               # vitest existentes
curl http://localhost:3000/api/tenants/<id>/theme.css | head  # smoke 200 + CSS válido
pnpm build                              # esperado VERDE (prebuild roda validate:apca)
pnpm size                               # esperado VERDE (budgets respeitados)
```

Se algum quebrar:

- typecheck: corrige tipos
- lint vermelho: revisa overrides path-aware da Etapa 2
- knip vermelho: revisa entries da Etapa 3
- APCA quebrado: revisa Silver thresholds (talvez paleta seed precisa ajuste)
- build vermelho: revisa prebuild + tsc

---

## 12. Etapa 10 — Teste de memória JIT

Eu simulo sessão nova: leio apenas `CLAUDE.md` → `.claude/rules/*.md` → `docs/adr/0040-*.md`. Tento executar 5 cenários:

1. **Primeira string PT-BR em qualquer JSX** — sei usar `t()`, sei estrutura `messages/`, sei como criar namespace novo?
2. **Primeiro wrapper `components/app-card.tsx`** — sei que precisa agregar valor, sei marker, sei import pattern?
3. **Primeira paleta nova adicionada por admin** — sei rodar APCA, sei thresholds Silver, sei usar `ensureAccessible`?
4. **Primeiro `npx shadcn add @origin-ui/timeline`** — sei seguir checklist pós-add (6 passos)?
5. **Primeiro `AppError.invalidInput`** com mensagem traduzida — sei usar `{ key, fallback }`?

Se qualquer cenário falhar → ajustar doc até passar.

---

## 13. Etapa 11 — Commit local sem push

```bash
git add docs/ .claude/ eslint.config.mjs knip.config.ts sheriff.config.ts \
        i18n/ messages/ lib/design/contrast.ts lib/contracts/errors.ts \
        scripts/validate-apca.ts components/app-*.tsx components/ui/{heading,text,stack,container,empty-state}.tsx \
        app/layout.tsx package.json .size-limit.ts CHANGELOG.md
git commit -m "chore: dia 0 fechado — zona quarentenada + i18n + APCA + 5 wrappers + 5 typography (ADR-0040)"
# NÃO push até feature 1 destravar gates restantes M0
```

---

## 14. Playbooks JIT — memória externa pra "quando chegar a hora"

Cada playbook abaixo vive em `.claude/rules/<arquivo>.md` (já documentado na Etapa 1). Resumo aqui:

### 14.1 Wrappers não-críticos (42 restantes)

**Gatilho:** feature 1+ precisa de primitive que não tem wrapper.
**Passo:**

1. `npx shadcn add <primitive>` (se ainda não tem) — hook post-shadcn-add roda checklist
2. Identifica valor agregado concreto (i18nKey? loading? error? telemetria?)
3. Cria `components/app-<nome>.tsx` com marker `// RESEARCH:` linha 1
4. Wrapper deve agregar valor — passthrough proibido
   **Anti-pattern:** criar wrapper só pra re-exportar (Vercel Academy)
   **Ref:** `.claude/rules/shadcn-zone.md`

### 14.2 Typography primitives restantes (7 + Logo)

**Gatilho:**

- `Metric` — primeiro dashboard com KPI
- `DataCell` — primeira tabela com label+valor
- `Code` — primeira tela admin
- `Eyebrow`, `Section`, `Divider`, `VisuallyHidden` — primeiro uso real
- `<Logo>` — landing agência (depende design final marca)

**Passo:**

1. Confirma uso real (3+ casos previstos na feature)
2. Cria em `components/ui/<nome>.tsx` (custom) com marker
3. Variants pequenas (cva max 5)
4. Story em Storybook quando F3 vier

**Anti-pattern:** criar cego sem ver feature

### 14.3 Locales adicionais (en-US, pt-PT, es-ES)

**Gatilho:** cliente internacional confirmado.
**Passo:**

1. Criar `messages/<locale>/<namespace>.json` espelho do pt-BR
2. Traduzir via translation tool (não Google Translate inline)
3. Adicionar `<locale>` à lista no `i18n/request.ts`
4. Configurar `localePrefix` no next-intl
   **Anti-pattern:** traduzir cego com Google Translate

### 14.4 Tenant copy override

**Gatilho:** cliente 2 com vertical diferente pede explicitamente.
**Passo:**

1. Cria migration `tenant_copy_overrides (tenant_id, key, value, locale)`
2. Adiciona resolver no `getMessages()` do `i18n/request.ts` — merge tenant override sobre base
3. UI admin pra editar (M3 feature)
   **Anti-pattern:** criar schema vazio dia 0

### 14.5 next-intl namespaces por feature

**Gatilho:** feature 1+ precisa de strings específicas (não cobertas por `common.json`).
**Passo:**

1. Cria `messages/pt-BR/<feature>.json`
2. Adiciona namespace ao `getRequestConfig` (lazy load por rota se possível)
3. Strings agrupadas por feature, não por componente

### 14.6 Plan-gates por feature

**Gatilho:** feature em `features/<name>/` com plan-gating.
**Passo:**

1. Cria `features/<name>/plan-gates.ts` com `*Gate` exports
2. Re-exporta em `features/<name>/index.ts` (regra ESLint enforce)
3. Server actions chamam `requireEntitlement('<feature>')`
4. Client usa `useEntitlement('<feature>')` pra mostrar/esconder
   **Ref:** `.claude/rules/entitlements.md`

---

## 15. Itens explicitamente NÃO neste plano

- Storybook 10 (Phase A Final F3 — depois)
- Makerkit entitlements recipe (Phase A Final F4)
- Cleanup ADR-0034 ressalvas (Phase A Final F5)
- Feature 1 (M1 funil agência) — separado, gates pra começar
- Lucide ~80 ícones (Tarefa 18 checklist) — JIT por feature
- Tabela `tenant_copy_overrides` (M3+)
- Lighthouse audit (Feature 1)
- PWA install banner iPhone (Tarefa 24 — JIT junto com Logo)
- E2E tests (Sprint 3+)
- Self-service signup público (M5+)

---

## 16. Critério de saída ("dia 0 fechado de verdade")

Quando todas estas afirmações forem verdade:

- [ ] `pnpm typecheck && pnpm lint --max-warnings 0 && pnpm validate:apca && pnpm test && pnpm build && pnpm size` passa local
- [ ] Hook `component-research-gate.sh` bloqueia Edit em `components/ui/*` (manual smoke)
- [ ] Hook `post-shadcn-add.sh` injeta checklist (manual smoke com `npx shadcn add badge`)
- [ ] Lint trava import de `@/components/ui/button` em `app/page.tsx` (manual smoke)
- [ ] `messages/pt-BR/common.json` carregado em `app/layout.tsx` via `NextIntlClientProvider`
- [ ] `AppError.invalidInput({ key, fallback })` aceita ambos
- [ ] APCA quebra build se paleta seed quebrada (smoke: corromper 1 valor → `pnpm build` falha)
- [ ] 5 wrappers + 5 typography rendem em rota smoke (não tem feature ainda, mas import + render no `app/page.tsx`)
- [ ] Teste de memória JIT (Etapa 10) passa 5/5 cenários
- [ ] Commit local feito, sem push

---

## 17. Próximo passo após este plano

1. **Feature 1 (M1 funil agência):** login + signup + capture-form + assessment-display + admin-leads
2. Cada novo wrapper/typography/namespace que feature precisar → segue playbook JIT da seção 14
3. Quando Phase A Final F3 (Storybook) vier → migra stories do Ladle (se houver) + adiciona stories pros wrappers/typography novos
4. Quando Phase A Final F4 (Makerkit) vier → refactor `lib/entitlements/` (ressalva backlog)

---

## 18. Histórico

| Data       | Mudança                                             | Aprovador |
| ---------- | --------------------------------------------------- | --------- |
| 2026-05-18 | Versão inicial pós Pesquisa 19 + aprovação fundador | Leandro   |
