# Claude Code Automation — onboarding.bio

> Pesquisa completa de hooks, skills, agents, rules, permissions e estrutura `.claude/`.
> **Criado:** 2026-05-01

---

## 1. Estrutura `.claude/` recomendada

```
.claude/
├── settings.json              # Permissions + auto-allow
├── hooks.json                 # PostToolUse (lint), PostToolBatch (tsc+vitest)
├── rules/
│   ├── react-components.md    # paths: components/**/*.tsx, app/**/*.tsx
│   ├── server-actions.md      # paths: app/**/actions.ts
│   ├── database.md            # paths: lib/data/**/*.ts
│   ├── domain-logic.md        # paths: lib/domain/**/*.ts
│   ├── migrations.md          # paths: supabase/migrations/**
│   └── edge-functions.md      # paths: supabase/functions/**/index.ts
├── skills/
│   ├── component-audit/SKILL.md
│   ├── migration-review/SKILL.md
│   ├── ds-check/SKILL.md
│   └── schema-validate/SKILL.md
└── agents/
    ├── security-reviewer.md
    └── performance-auditor.md
```

---

## 2. Path-scoped rules

### react-components.md

```markdown
---
paths:
  - 'components/**/*.tsx'
  - 'app/**/*.tsx'
---

## Regras de componentes React

- Max 300 linhas. Acima, decompor em orchestrator + \_components/.
- Usar <Heading> e <Text> pra tipografia. Nunca raw h1-h6 ou classes.
- Usar shadcn components (Button, Input, Dialog, etc). Nunca HTML raw.
- 'use client' so quando obrigatorio (hooks, eventos, browser APIs).
- Nunca chamar Supabase direto. Nunca createClient() em componente.
- Nunca importar @/lib/supabase/admin em client component.
- Nunca conter logica de negocio. If/else de regra → lib/domain/.
- Strings visiveis via t() de next-intl. Nunca hardcoded.
- Cores via tokens CSS. Nunca hex/rgb/hsl inline.
- Paginas publicas: data-shape, data-density, data-surface, data-palette, data-typography.
- generateMetadata em rotas com conteudo dinamico.
- loading.tsx e error.tsx em route groups.
- EmptyState em listas. Skeleton em loading.
- pb-nav em listas dentro do (shell).
- Mobile 375px: touch targets 44px+, inputs 16px+, bottom sheet nao modal.
```

### server-actions.md

```markdown
---
paths:
  - 'app/**/actions.ts'
---

## Regras de Server Actions

- Retorno: { ok: true, data } ou { ok: false, error }. Nunca throw.
- Chamar lib/data/ pra IO. Chamar lib/domain/ pra validacao.
- Nunca query SQL ou Supabase direto. Sempre via lib/data/.
- Nunca logica de UI. Nao importar React, nao renderizar.
- Usar revalidatePath() apos mutacao.
- Strings de erro via getTranslations('actions') de next-intl.
- Max 100 linhas por action file.
```

### database.md

```markdown
---
paths:
  - 'lib/data/**/*.ts'
---

## Regras da camada Data

- Funcao pura: function nome(client: SupabaseClient, ...args): Promise<T>
- Lanca erro com throw new Error(...). Nunca { ok, error }.
- Sem React. Sem hooks, sem estado, sem JSX.
- 1 arquivo = 1 entidade (lead.ts, client.ts, professional.ts).
- Max 200 linhas por arquivo.
- Nunca importar de app/ ou components/.
```

### domain-logic.md

```markdown
---
paths:
  - 'lib/domain/**/*.ts'
---

## Regras da camada Domain

- Logica pura. Zero IO, zero Supabase, zero fetch, zero file system.
- Testavel isolada com vitest. Sem mock de banco.
- Todo calculo/engine DEVE ter .test.ts correspondente.
- Max 200 linhas por arquivo.
```

### migrations.md

```markdown
---
paths:
  - 'supabase/migrations/**'
---

## Regras de Migrations

- Nome: YYYYMMDDHHMMSS_snake_case_descricao.sql
- Aplicar via mcp**supabase**apply_migration. Nunca criar .sql manual.
- Toda nova tabela tem RLS habilitado na mesma migration.
- RPC de escrita: SECURITY DEFINER + REVOKE/GRANT + SET search_path.
- Mutacao em 2+ tabelas: RPC com BEGIN/COMMIT.
- Race condition: RPC com SELECT FOR UPDATE.
```

### edge-functions.md

```markdown
---
paths:
  - 'supabase/functions/**/index.ts'
---

## Regras de Edge Functions

- Deno runtime. Import de deno.land ou npm:.
- Retorno: Response.json({ ok, data/error }, { status }).
- CORS headers obrigatorios.
- Input validado com Zod antes de processar.
- Logica espelhada de lib/domain/ quando aplicavel.
```

---

## 3. Hooks

### hooks.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm lint --fix \"$CLAUDE_FILE_PATH\" 2>&1 | tail -3"
          }
        ]
      }
    ],
    "PostToolBatch": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "pnpm exec tsc --noEmit 2>&1 | tail -5"
          }
        ]
      }
    ]
  }
}
```

**PostToolUse (Edit/Write):** roda lint com auto-fix em cada arquivo editado.
**PostToolBatch:** roda tsc apos operacoes em lote.

---

## 4. Skills customizadas

### component-audit/SKILL.md

```markdown
---
name: component-audit
description: Audita componente React por a11y, performance, e aderencia ao DS
paths:
  - 'components/**/*.tsx'
  - 'app/**/*.tsx'
---

Audite o componente para:

1. **shadcn compliance:** usa Button/Input/Dialog ou HTML raw?
2. **Tipografia:** usa <Heading>/<Text> ou classes raw?
3. **Tokens:** usa CSS vars ou valores hardcoded?
4. **a11y:** aria-label em icon buttons, alt em imagens, focus management?
5. **i18n:** strings via t() ou hardcoded?
6. **Tamanho:** menos de 300 linhas?
7. **Separacao:** logica de negocio no componente?
8. **Mobile:** touch targets 44px+, inputs 16px+?
9. **Data attributes:** pagina publica tem data-shape/density/surface/palette/typography?
10. **Performance:** re-renders desnecessarios, imports pesados?

Reporte cada violacao com arquivo:linha e sugira correcao.
```

### ds-check/SKILL.md

```markdown
---
name: ds-check
description: Verifica aderencia ao design system em componentes e paginas
---

Verifique no codebase:

1. Grep por HTML raw (button, input, textarea, select, table, h1-h6, img) fora de components/ui/
2. Grep por hex inline (bg-[#, text-[#, border-[#, style={{...color/background)
3. Grep por valores arbitrarios (p-[, m-[, gap-[, text-[, rounded-[) fora de var(--)
4. Grep por rounded-md/rounded-lg hardcoded (deveria ser var(--shape-\*))
5. Grep por className="font- sem ser font-sans/font-mono/font-display/font-serif
6. Componentes com 0 imports (dead code)
7. Paginas publicas sem data-shape/data-density/data-surface

Reporte como tabela: arquivo | violacao | correcao sugerida
```

### migration-review/SKILL.md

```markdown
---
name: migration-review
description: Revisa migrations SQL para seguranca e padrao
paths:
  - 'supabase/migrations/**'
---

Verifique na migration:

1. RLS habilitado em toda nova tabela?
2. RPCs de escrita com SECURITY DEFINER + REVOKE/GRANT?
3. Mutacao em 2+ tabelas dentro de RPC com BEGIN/COMMIT?
4. Race conditions protegidos com SELECT FOR UPDATE?
5. Nomes em snake_case EN?
6. Indices em colunas de busca (WHERE, JOIN)?
7. Defaults e NOT NULL onde faz sentido?
8. Cascade correto em foreign keys?
```

---

## 5. Agents customizados

### security-reviewer.md

```markdown
---
name: security-reviewer
description: Revisa codigo por vulnerabilidades de seguranca
model: claude-opus-4-6
---

Voce e um auditor de seguranca. Revise o codigo para:

1. **SQL injection:** queries montadas com concatenacao de string?
2. **XSS:** dados do usuario renderizados sem sanitizacao?
3. **Auth bypass:** rotas sem verificacao de sessao?
4. **RLS:** tabelas sem policies? Policies muito permissivas?
5. **IDOR:** acesso a recursos sem verificar ownership?
6. **Rate limiting:** endpoints publicos sem limite?
7. **Secrets:** env vars expostos? Service role em client component?
8. **LGPD:** dados pessoais sem consentimento? Sem DSR process?

Cite arquivo:linha. Classifique: CRITICO / ALTO / MEDIO / BAIXO.
```

### performance-auditor.md

```markdown
---
name: performance-auditor
description: Audita performance de componentes e paginas
model: claude-opus-4-6
---

Audite para:

1. **Bundle size:** imports pesados que poderiam ser lazy?
2. **Re-renders:** componentes que re-renderizam sem necessidade?
3. **N+1 queries:** loops com queries individuais?
4. **Images:** sem next/image? Sem priority/sizes?
5. **Fonts:** loading nao otimizado?
6. **Client components:** 'use client' desnecessario?
7. **Skeleton loading:** paginas sem loading.tsx?
8. **LCP:** hero content bloqueado por JS?

Reporte com metricas estimadas de impacto.
```

---

## 6. Permissions (settings.json)

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm lint *)",
      "Bash(pnpm exec tsc *)",
      "Bash(pnpm exec vitest *)",
      "Bash(pnpm build)",
      "Bash(pnpm dev)",
      "Bash(pnpm knip)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git add *)",
      "Bash(ls *)"
    ],
    "deny": ["Bash(rm -rf *)", "Bash(npm install *)", "Bash(npm run *)", "Bash(npx *)"]
  }
}
```

**allow:** tudo que e seguro e frequente (lint, tsc, vitest, git read).
**deny:** operacoes destrutivas e npm (forcando pnpm).
