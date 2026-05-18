# MCPs, Extensions e CLI Tools — onboarding.bio

> Ferramentas complementares para maximizar automacao e qualidade.
> **Criado:** 2026-05-01

---

## 1. MCP Servers

### Ja conectados

| MCP            | Uso                                 | Status                     |
| -------------- | ----------------------------------- | -------------------------- |
| `supabase`     | DB, migrations, SQL, Edge Functions | Ativo                      |
| `shadcn`       | Componentes, blocks, registry       | Ativo (corrigido pra pnpm) |
| `context7`     | Docs de libs e frameworks           | Ativo                      |
| `Figma`        | Design-to-code                      | Disponivel                 |
| `Canva`        | Design assets                       | Disponivel                 |
| `Google Drive` | Docs                                | Precisa auth               |
| `Notion`       | Docs                                | Precisa auth               |
| `Vercel`       | Deploys, logs, env vars             | Precisa auth               |

### A adicionar

| MCP                     | O que faz                          | Como instalar                                             | Prioridade |
| ----------------------- | ---------------------------------- | --------------------------------------------------------- | ---------- |
| **Playwright**          | E2E tests + screenshots do browser | `claude mcp add playwright -- npx @playwright/mcp@latest` | ALTA       |
| **Vercel** (autenticar) | Deploy previews, logs, env vars    | Autenticar o existente via `/vercel:auth` ou CLI          | ALTA       |

### Monitorar (nao existe ainda)

| MCP         | Quando instalar                         |
| ----------- | --------------------------------------- |
| **Sentry**  | Quando Sentry lancar MCP server oficial |
| **Upstash** | Se precisar inspecionar rate limits     |

---

## 2. VS Code Extensions

### Prioridade ALTA — instalar agora

| Extensao                      | ID                          | O que faz                                                                                               |
| ----------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Autocomplete, hover, lint de classes. v0.14+ suporta Tailwind v4 com `@theme`.                          |
| **Error Lens**                | `usernamehw.errorlens`      | Mostra erros ESLint/TS inline na linha. Pega problemas antes de salvar.                                 |
| **Pretty TypeScript Errors**  | `yoavbls.pretty-ts-errors`  | Erros TS legiveis — essencial com Zod v4 e RHF que geram tipos complexos.                               |
| **i18n Ally**                 | `lokalise.i18n-ally`        | Traducoes inline, detecta keys faltantes. Suporta next-intl. Configurar `localesPaths` pra `messages/`. |
| **ESLint**                    | `dbaeumer.vscode-eslint`    | v3+ suporta flat config `eslint.config.mjs` nativamente.                                                |

### Prioridade MEDIA — util

| Extensao                     | ID                                | O que faz                                                   |
| ---------------------------- | --------------------------------- | ----------------------------------------------------------- |
| **GitLens**                  | `eamodio.gitlens`                 | Blame inline, historico, compare branches.                  |
| **axe Accessibility Linter** | `deque-systems.vscode-axe-linter` | a11y estatica em JSX. Complementa jsx-a11y do ESLint.       |
| **Import Cost**              | `wix.vscode-import-cost`          | Mostra bundle size de imports inline. Pega imports pesados. |
| **Todo Tree**                | `gruntfuggly.todo-tree`           | Encontra TODO/FIXME/HACK no codebase inteiro.               |
| **Playwright Test**          | `ms-playwright.playwright`        | Roda/debuga testes Playwright do VS Code.                   |

### Skip

| Extensao                | Por que nao                                                         |
| ----------------------- | ------------------------------------------------------------------- |
| Prettier extension      | Nao temos Prettier configurado ainda. Adicionar junto com o plugin. |
| shadcn extensions       | MCP shadcn ja cobre scaffolding.                                    |
| Component usage counter | Nao confiavel. Usar `grep` pra contar.                              |
| Copilot                 | Ja usa Claude Code. Redundante.                                     |

---

## 3. CLI Tools

### Prioridade ALTA — instalar agora

| Tool                      | O que faz                                 | Instalar                            | Uso                         |
| ------------------------- | ----------------------------------------- | ----------------------------------- | --------------------------- |
| **knip**                  | Dead code: arquivos, exports, deps, tipos | `pnpm add -D knip`                  | `pnpm knip` (pre-push + CI) |
| **@next/bundle-analyzer** | Treemap visual do bundle                  | `pnpm add -D @next/bundle-analyzer` | `ANALYZE=true pnpm build`   |

### Prioridade MEDIA — instalar depois

| Tool                          | O que faz                          | Instalar                                        | Uso                       |
| ----------------------------- | ---------------------------------- | ----------------------------------------------- | ------------------------- |
| **size-limit**                | Budget de bundle no CI             | `pnpm add -D size-limit @size-limit/preset-app` | Falha CI se bundle > N KB |
| **@lhci/cli** (Lighthouse CI) | Auditorias performance automaticas | `pnpm add -D @lhci/cli`                         | `lhci autorun` pos-build  |
| **npm-check-updates (ncu)**   | Atualiza deps interativamente      | `npx npm-check-updates`                         | Periodico (mensal)        |
| **socket.dev**                | Seguranca supply chain             | `npx socket`                                    | Antes de releases         |

### Ja temos

| Tool                              | Status                                     |
| --------------------------------- | ------------------------------------------ |
| ESLint 9 (flat config)            | Instalado, configurado                     |
| Vitest                            | 401+ testes                                |
| Playwright                        | Instalado (`@playwright/test`)             |
| Husky                             | 3 hooks (pre-commit, commit-msg, pre-push) |
| lint-staged                       | Configurado                                |
| commitlint                        | Conventional Commits                       |
| Ladle                             | Component dev (stories)                    |
| Sentry                            | Error tracking                             |
| Vercel Analytics + Speed Insights | Performance monitoring                     |

---

## 4. Resumo de instalacao

```bash
# Prioridade 1 — lint plugins
pnpm add -D eslint-plugin-simple-import-sort eslint-plugin-unused-imports

# Prioridade 2 — formatacao
pnpm add -D prettier prettier-plugin-tailwindcss

# Prioridade 3 — dead code + bundle
pnpm add -D knip @next/bundle-analyzer

# Prioridade 4 — Tailwind lint (quando pronto)
pnpm add -D eslint-plugin-better-tailwindcss

# MCP
claude mcp add playwright -- npx @playwright/mcp@latest
```

```bash
# VS Code extensions (copiar e colar no terminal)
code --install-extension bradlc.vscode-tailwindcss
code --install-extension usernamehw.errorlens
code --install-extension yoavbls.pretty-ts-errors
code --install-extension lokalise.i18n-ally
code --install-extension dbaeumer.vscode-eslint
code --install-extension eamodio.gitlens
```

---

## 5. Skills built-in do Claude Code (para UI/mobile/design)

### Disponiveis — usar ativamente na refatoracao

| Skill                     | Comando                              | O que faz                                                                                                                     | Quando usar                               |
| ------------------------- | ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **frontend-design**       | `/frontend-design`                   | Cria interfaces production-grade, evita estetica generica                                                                     | Construir componentes/paginas novas       |
| **ux-audit**              | `/ux-audit`                          | Audit exaustivo: keyboard-only, heavy data, destructive actions, interrupted workflow, returning user. Screenshots + fix loop | Antes de merge de tela nova ou refatorada |
| **react-best-practices**  | `/vercel:react-best-practices`       | Checklist: structure, hooks, a11y, perf, TypeScript. Auto-trigger apos editar TSX                                             | Apos editar componentes                   |
| **shadcn**                | `/vercel:shadcn`                     | Expert shadcn: CLI, composicao, registries, theming, Tailwind v4                                                              | Instalar/customizar componentes           |
| **performance-optimizer** | Agent `vercel:performance-optimizer` | Core Web Vitals, rendering, caching, images, fonts, bundle                                                                    | Auditar performance mobile                |
| **nextjs**                | `/vercel:nextjs`                     | App Router expert: RSC, streaming, layouts, data fetching                                                                     | Arquitetura de paginas                    |
| **simplify**              | `/simplify`                          | Revisa codigo por reuso, qualidade, eficiencia                                                                                | Pos-refatoracao                           |
| **find-skills**           | `/find-skills`                       | Descobre e instala skills da comunidade                                                                                       | Quando precisar de algo novo              |

### Pipeline recomendado design-to-code

```
1. Figma MCP → extrair design + tokens do mockup
2. /frontend-design → gerar codigo shadcn-first, mobile-first
3. /vercel:react-best-practices → auto-validar TSX (a11y, hooks, perf)
4. Playwright VRT → screenshots 3 viewports (390, 768, 1280px)
5. /ux-audit → audit exaustivo antes de merge
6. /vercel:performance-optimizer → Core Web Vitals
```

---

## 6. O que ja temos e torna MCPs extras DESNECESSARIOS

| Capacidade                 | Ja temos | Como                                                | MCP/skill extra? |
| -------------------------- | -------- | --------------------------------------------------- | ---------------- |
| Screenshots multi-viewport | SIM      | `e2e/vrt-baseline.spec.ts` (10 rotas × 3 viewports) | NAO              |
| Comparacao before/after    | SIM      | Playwright `toHaveScreenshot` com pixel diff        | NAO              |
| Lighthouse                 | SIM      | `npx lighthouse` via Bash                           | NAO              |
| Contraste APCA             | SIM      | `lib/design/contrast.ts` com `apca-w3`              | NAO              |
| UX audit                   | SIM      | Skill `/ux-audit` built-in                          | NAO              |
| Figma design-to-code       | SIM      | Figma MCP conectado                                 | NAO              |
| Component quality          | SIM      | `/vercel:react-best-practices` auto-trigger         | NAO              |
| Docs de libs               | SIM      | context7 MCP                                        | NAO              |
| Component install          | SIM      | shadcn MCP                                          | NAO              |
| DB/migrations              | SIM      | supabase MCP                                        | NAO              |

### Unico gap: validacao de touch targets

Adicionar ao Playwright (20 linhas, sem dependencia nova):

```ts
// e2e/touch-targets.spec.ts
import { test, expect } from '@playwright/test'

test('interactive elements >= 44px', async ({ page }) => {
  await page.goto('/dashboard')
  const elements = await page.locator('button, a, input, [role="button"]').all()
  for (const el of elements) {
    const box = await el.boundingBox()
    if (box && box.height > 0) {
      expect(
        box.height,
        `Touch target too small: ${await el.textContent()}`,
      ).toBeGreaterThanOrEqual(44)
      expect(box.width).toBeGreaterThanOrEqual(44)
    }
  }
})
```

### Veredicto final

**NAO instalar nenhum MCP, skill, ou tool extra pra design/mobile.** Tudo que precisamos ja esta disponivel. O valor esta em USAR o que temos, nao em adicionar mais ferramentas.

---

## 7. Agentes customizados recomendados (`.claude/agents/`)

Nao sao MCPs — sao agentes que rodam dentro do Claude Code pra tarefas especializadas.

| Agente                  | Arquivo                                 | Quando usar                                                     |
| ----------------------- | --------------------------------------- | --------------------------------------------------------------- |
| **security-reviewer**   | `.claude/agents/security-reviewer.md`   | Revisar auth, RLS, LGPD, rate limiting                          |
| **performance-auditor** | `.claude/agents/performance-auditor.md` | Bundle size, re-renders, N+1, images                            |
| **ds-compliance**       | `.claude/agents/ds-compliance.md`       | Verificar aderencia ao design system (tokens, shadcn, HTML raw) |

Detalhes de cada agente em `04-claude-code-automation.md`.
