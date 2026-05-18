# Padrão Impecável — onboarding.bio

> **Doc canônico de padrões técnicos e de qualidade.**
> Toda fase do `PLANO_LANCAMENTO.md` referencia este doc.
> **Não substitui** `docs/core/DESIGN-SYSTEM-FOUNDATION.md` (visual/UX) nem `docs/core/positioning.md` (copy/marca) — complementa em domínios técnicos.
> **Última atualização:** 2026-04-29.
> **Regra:** mudanças aqui requerem sinal explícito do fundador.
> **Simplificado em 2026-04-29:** removido over-engineering enterprise. Detalhes em `SIMPLIFICACAO-2026-04-29.md`.

---

## Filosofia

Impecável significa **qualidade real de engenharia solo**: código limpo, tipado, testado nos caminhos que importam, seguro por default, acessível via lint. Não significa burocracia de empresa com mil devs, nem teatro de processo.

Critério-mãe: **um engenheiro sênior abrindo o código pela primeira vez diz "isso aqui é trabalho sério" sem precisar de explicação adicional.**

Anti-padrão fundamental: **simplificação mascarada como progresso.** Toda fase fecha com critérios mensuráveis. Warning não é estado final. Exception sem justificativa concreta não existe. "Resolvo depois" não fecha fase.

---

## Como cada fase usa este doc

Cada fase do plano declara:

```
**Camadas cobertas por esta fase:** 1, 2, 4, 7
**Critérios desta fase:** ver §[seção da camada] deste doc
```

A fase só fecha quando todos os critérios das camadas declaradas estão cumpridos, **medidos pelos comandos cravados em cada camada**.

---

## §1 — Código

### 1.1 Princípios SOLID aplicados

| Princípio             | Critério mensurável                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------- |
| Single Responsibility | Componente faz uma coisa. Nome com "And", "Manager", "Helper" → erro. >7-8 props → revisar    |
| Open/Closed           | Extensão via `children`/slots/composição. Anti: prop bool `variant` que liga 5 comportamentos |
| Liskov                | Subtipos intercambiáveis. `<IconButton>` funciona onde `<Button>` funciona                    |
| Interface Segregation | Tipos pequenos. Sem `Props` gigante de 30 campos opcionais                                    |
| Dependency Inversion  | Componente recebe dados, não busca. RSC busca, Client recebe via props                        |

### 1.2 Reutilização sem cópia disfarçada

- Zero duplicação. Mesmo padrão duas vezes → terceira vira componente.
- Hooks customizados pra lógica reutilizada (`useDirtyForm`, `useDebounce`, `useMediaQuery`).
- Composição via slots, não herança via props booleanas.

### 1.3 Tipagem estrita

- Zero `any`. Zero `as any`. Zero `// @ts-ignore`. `// @ts-expect-error` apenas com comentário justificando.
- `unknown` em vez de `any` quando o tipo é genuinamente desconhecido.
- Discriminated unions pra estados:
  ```typescript
  type State =
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: X }
    | { status: 'error'; error: Y }
  ```
  Não booleanos soltos (`isLoading`, `isError`, `data?`).
- Branded types recomendados pra IDs críticos (`ProfessionalId`, `ClientId`) onde evita bugs de mistura. Não obrigatório em todo ID.
- Schemas Zod como fonte única de verdade de tipo (`z.infer<typeof Schema>`), não tipos manuais que divergem.
- **Comandos:**
  - `pnpm exec tsc --noEmit` → zero erros
  - `grep -rn "as any\|: any" app/ components/ lib/ | grep -v "node_modules"` → zero
  - `grep -rn "@ts-ignore\|@ts-expect-error" app/ components/ lib/` → cada ocorrência tem comentário justificando

### 1.4 Tratamento de erro consistente

- `lib/data/` lança erro tipado (classes próprias: `NotFoundError`, `UnauthorizedError`, `ValidationError`, `ConflictError`).
- Server actions retornam discriminated union (`{ ok: true, data } | { ok: false, error }`), nunca lançam pra cliente.
- Client components usam Error Boundaries por área lógica, não global único.
- Toast de erro usa mensagem do erro tipado, não "Algo deu errado, tente novamente".
- **Anti-padrão:** `try/catch` que engole erro silenciosamente (`catch (e) {}`) ou loga e segue (`catch (e) { console.log(e) }`).

### 1.5 Imports e organização

- Imports absolutos via `@/`, nunca relativos profundos (`../../../`).
- Ordem enforced por lint: external → `@/lib` → `@/components` → relative → types.
- Barrel files (`index.ts`) só onde a API pública faz sentido, não em toda pasta (mata tree-shaking).
- Path aliases declarados em `tsconfig` e usados consistentemente.
- **Comando:** `grep -rn "from '\.\./\.\./\.\./\|from '\.\./\.\./" app/ components/ lib/` → zero

### 1.6 Naming

- Funções como verbos (`getUser`, `validateEmail`, `formatCurrency`).
- Booleanos como predicados (`isAdmin`, `hasAccess`, `canEdit`, `shouldRender`).
- Componentes como substantivos em PascalCase.
- Hooks começam com `use`.
- Inglês 100% no código (cravado em D1).
- Sem abreviação críptica (`usr`, `prof`, `cnt`). Use `professional`, `count`. Exceções aceitas: `id`, `url`, `idx`, `req`, `res`.

### 1.7 Tamanho de arquivo

- Componente ≤ 300 linhas. Acima → decompor em orchestrator + `_components/` ou `_sections/`.
- Arquivo qualquer ≤ 400 linhas. Acima → separar.
- Server action ≤ 60 linhas. Lógica vai pra `lib/data/` ou `lib/domain/`.
- **Comando:** `find app components lib -name "*.tsx" -o -name "*.ts" | xargs wc -l | awk '$1 > 400 {print}'` → vazio ou cada arquivo justificado

---

## §2 — Separação Lógica × UI × Dados × IO Externo

**Esta camada é o coração da arquitetura.** Frontend não fala com banco. Banco não conhece UI. Lógica de negócio não importa React.

### 2.1 As 5 camadas e onde mora cada coisa

```
┌─────────────────────────────────────────────────────┐
│  app/  (Next.js App Router)                         │
│  - RSC busca via lib/data, passa via props          │
│  - Client components recebem via props, renderizam  │
│  - Server actions: < 60 linhas, só orquestram       │
│  - Não importa lib/domain diretamente em client     │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  lib/data/  (queries e mutations)                   │
│  - Query Supabase, parse Zod, retorna tipo          │
│  - Lança erro tipado (NotFoundError, etc.)          │
│  - Não tem regra de negócio                         │
│  - Não tem estado UI                                │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  lib/domain/  (regra de negócio pura)               │
│  - Funções puras                                    │
│  - Sem React, sem Supabase, sem fetch               │
│  - 100% testável isoladamente                       │
│  - TDEE, BMI, score, validação, transformação      │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  Supabase (Backend)                                 │
│  - Tabelas + RLS                                    │
│  - RPCs pra mutação multi-tabela                    │
│  - Edge Functions pra IO externo (Anthropic,        │
│    Pagar.me, WhatsApp Cloud, EFI Bank)              │
└─────────────────────────────────────────────────────┘
```

### 2.2 Regras inegociáveis

| Regra                                        | Critério                                   | Comando de verificação                                                                          |
| -------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| Cliente nunca importa `@/lib/supabase/admin` | Vazamento de service role                  | `grep -rn "lib/supabase/admin" app/ components/ \| grep -v "/api/\|server"` → zero              |
| Cliente nunca importa `lib/data/` direto     | Deve receber via props                     | `grep -rn "from '@/lib/data" components/ \| grep "use client"` → zero                           |
| `lib/domain/` zero deps externas             | Pureza                                     | `grep -rn "from 'react\|from '@supabase\|from 'next" lib/domain/` → zero                        |
| Edge Function = único caminho pra IO externo | Anthropic/Pagar.me/WhatsApp não em Next.js | `grep -rn "from '@anthropic\|pagarme\|whatsapp" app/ lib/` → zero (só em `supabase/functions/`) |
| Server action ≤ 60 linhas                    | Lógica vai pra `lib/data` ou `lib/domain`  | `find app -name "actions.ts" \| xargs wc -l`                                                    |
| RPC pra mutação multi-tabela                 | Não fazer no cliente                       | Cada mutação que toca >1 tabela tem RPC `SECURITY DEFINER` correspondente                       |

### 2.3 Cada arquivo uma coisa

- **Anti-padrão proibido:** `utils.ts` genérico com 20 funções não relacionadas, `helpers.ts`, `Manager.tsx`, `Container.tsx` que faz orquestração + apresentação + busca.
- **Padrão correto:** uma responsabilidade clara por arquivo. `lib/format/currency.ts`, `lib/format/date.ts`, `lib/validation/email.ts`. Não `lib/utils.ts` com tudo.
- **Comando:** auditar arquivos chamados `utils.*`, `helpers.*`, `common.*`, `shared.*`. Cada um precisa ser quebrado.

### 2.4 Decisão por tipo de operação

| Operação                        | Onde mora                                                    |
| ------------------------------- | ------------------------------------------------------------ |
| Buscar dado simples             | `lib/data/{entity}.ts` retorna tipo, RSC chama               |
| Buscar dado complexo (joins)    | View no Supabase + `lib/data/{entity}.ts`                    |
| Mutação 1 tabela simples        | Server action chama `lib/data/{entity}.ts`                   |
| Mutação multi-tabela            | RPC `SECURITY DEFINER` no Supabase + server action chama RPC |
| Cálculo de regra de negócio     | `lib/domain/{regra}.ts`, função pura                         |
| Chamada IA (Anthropic)          | Edge Function, prompt versionado em `ai_prompts`             |
| Chamada Pagar.me, EFI, WhatsApp | Edge Function dedicada                                       |
| Cron / job agendado             | `pg_cron` chama Edge Function                                |
| Validação de input              | Zod schema em `lib/data/` ou `lib/domain/`                   |
| Estado UI local                 | `useState` no componente                                     |
| Estado UI compartilhado         | Context dedicado em `lib/contexts/`                          |
| Cache de dados servidor         | RSC + Next.js cache, não client state                        |

---

## §3 — UI

**Fonte canônica:** `docs/core/DESIGN-SYSTEM-FOUNDATION.md`. Esta seção lista apenas critérios de aceite mensuráveis.

### 3.1 Aderência ao design system

| Critério                                              | Comando de verificação                                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Zero hex inline                                       | `grep -rEn "bg-\[#\|text-\[#\|border-\[#" app/ components/` → zero (com allowlist documentada) |
| Zero pixel arbitrário em texto                        | `grep -rEn "text-\[[0-9]+px\]" app/ components/` → zero                                        |
| Zero radius arbitrário                                | `grep -rEn "rounded-\[[0-9]+px\]" app/ components/` → zero                                     |
| Zero `<button>` cru fora de `components/ui/`          | Lint `no-raw-button` como `error`, zero ocorrências                                            |
| Zero `<h1>`-`<h6>` cru com className                  | Lint `no-direct-heading` como `error`, todos via `<Heading>`                                   |
| Zero `style={{ color/background/borderRadius }}`      | Lint `no-inline-style-color` como `error` (allowlist: CSS vars dinâmicas do banco)             |
| Geist Sans + Mono carregando                          | Network tab mostra request 200, não fallback Inter                                             |
| `motion/react` em vez de `framer-motion`              | Lint `no-restricted-imports` bloqueia framer-motion                                            |
| Drawer responsivo único (Sheet desktop / Vaul mobile) | Componente `<ResponsiveDrawer>` em uso, sem modal solto                                        |
| Bottom tab 5 slots no mobile                          | `<BottomTabBar>` integrado no shell mobile                                                     |
| Cmd+K obrigatório no desktop                          | `<CommandPalette>` integrado no shell desktop                                                  |

### 3.2 Estados visíveis em 100% dos componentes interativos

Cada elemento clicável/focável tem 7 estados desenhados e implementados:

- default, hover (desktop), active, focus-visible, disabled, loading, success/error (onde aplicável)

**Verificação:** review manual em Ladle, story por componente cobrindo cada estado.

### 3.3 Empty states, loading states, error states

- Toda lista tem 3 empty states declarados via prop (`variant="initial|filtered|error"`).
- Toda página tem skeleton específico imitando o shape final, não "Carregando...".
- Todo erro tem mensagem útil + ação ("tentar novamente", "voltar", "contatar suporte").

### 3.4 Responsividade

- Mobile first.
- Touch targets ≥ 44×44px no mobile (WCAG 2.5.5).
- Safe area insets respeitados (notch).
- Sem horizontal scroll inesperado.
- **Verificação:** VRT em 3 viewports (390/768/1280), sem overflow, sem texto cortado.

---

## §4 — UX

**Fonte canônica:** `docs/core/positioning.md` §5 (tom de voz) e §6 (anti-padrões de copy).

### 4.1 Microcopy específica

| Anti-padrão                        | Comando de detecção                                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| "Salvar" sem objeto                | `grep -rn ">Salvar<\|>Submit<\|>Enviar<" app/ components/` → zero                                        |
| "Erro" genérico                    | `grep -rn "Algo deu errado\|Ocorreu um erro" app/ components/` → toda ocorrência tem mensagem específica |
| "Sucesso!" com exclamação          | `grep -rn ">Sucesso!\|toast.success.*!" app/ components/` → zero                                         |
| "Tem certeza?" sem contexto        | Toda ocorrência inclui nome + consequência                                                               |
| "Carregando..." em vez de skeleton | `grep -rn "Carregando\.\.\." app/ components/` → zero                                                    |

### 4.2 Feedback imediato

- Toda mutação tem optimistic update onde fizer sentido.
- Toda ação async tem feedback visual em < 100ms.
- Loading nunca bloqueia toda a UI sem necessidade.

### 4.3 Sem becos sem saída

- Toda página tem caminho de volta claro.
- Toda action destrutiva tem confirmação com nome + consequência.
- Form longo salva rascunho automático.
- Erro recuperável dá ação clara.

### 4.4 Atalhos de teclado

- Cmd+K em qualquer tela do app interno.
- Cmd+S salva, Cmd+Enter envia, Esc fecha (onde aplicável).
- Atalhos visíveis (`<KBD>` ao lado do item de menu).

---

## §5 — Banco de Dados

### 5.1 Schema como contrato

| Critério                                                                                |
| --------------------------------------------------------------------------------------- |
| Toda tabela com RLS habilitado                                                          |
| Toda FK com `ON DELETE` declarado (decisão consciente cascade/restrict/set null)        |
| Índices justificados (comentário `-- {motivo}`)                                         |
| Naming consistente: tabelas `snake_case` plural, colunas `snake_case`, FK `{tabela}_id` |
| `created_at` + `updated_at` em toda tabela com mutação (trigger automático)             |
| Soft delete vs hard delete documentado por tabela                                       |

### 5.2 RPCs e Edge Functions com contrato

- Cada RPC tem schema Zod do input + output documentado.
- Cada Edge Function tem schema Zod do input + output documentado.
- Versionamento explícito quando contrato muda.

### 5.3 RLS testada, não inferida

- Tests de RLS isolando tenants: cliente A tenta ler dado de B → bloqueado.
- Cobertura nas policies críticas (tabelas com dados multi-tenant).

### 5.4 Migrations limpas

- Cada migration faz uma coisa.
- Toda migration vem com RLS na mesma migration que cria tabela.
- Migrations só via `mcp__supabase__apply_migration`, nunca `.sql` manual.

---

## §6 — Segurança

### 6.1 Hardening DB

- 100% das tabelas com RLS.
- RPCs de escrita com `SECURITY DEFINER` + `REVOKE EXECUTE FROM PUBLIC` + `GRANT EXECUTE TO {role}` + `SET search_path = public, pg_temp`.
- Sem `auth.user_metadata` em RLS policy.

### 6.2 Hardening aplicação

| Critério                            | Implementação                                                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Rate limiting em endpoints públicos | Login, signup, forgot, reset, contato — limite por IP + por user                                                              |
| CSP headers calibrados              | `next.config.ts` com CSP estrito, sem `unsafe-inline`                                                                         |
| CSRF protection                     | Server actions Next.js (default)                                                                                              |
| Dependabot                          | Configurado, revisão manual mensal                                                                                            |
| Secrets em .gitignore               | `.env*` no `.gitignore` (verificar uma vez)                                                                                   |
| Review de PR anti-leak              | Busca visual por strings que parecem chave/secret (`sk-...`, hex longos, tokens). Não é tool, é checklist mental do reviewer. |

### 6.3 Dados sensíveis

- Nada de armazenar dado de pagamento (pass-through pro Pagar.me / EFI).
- PII tratada com cuidado: não em logs, não em URLs, não em querystrings.
- Supabase Point-in-Time Recovery habilitado (verificar no dashboard). Antes do beta abrir (Fase 82), fazer 1 restore real em ambiente de teste pra confirmar que PITR funciona. Documentar procedimento em runbook simples.
- LGPD operacional: processo de DSR funcional, privacy policy atualizada.

---

## §7 — Testes

### 7.1 Foco em golden paths

| Camada                    | Foco                                                              | Tool           |
| ------------------------- | ----------------------------------------------------------------- | -------------- |
| Unit (`lib/domain/`)      | Cálculos e regras de negócio — golden paths + edge cases críticos | Vitest         |
| Integration (`lib/data/`) | Queries críticas com payload conhecido                            | Vitest         |
| RPC smoke                 | RPCs críticas com input válido → output válido                    | Vitest         |
| RLS                       | Isolamento de tenants nas tabelas multi-tenant                    | Vitest         |
| Edge Function             | Functions isoladas                                                | Deno test      |
| E2E golden paths          | Profissional + Cliente flows críticos                             | Playwright     |
| Visual regression         | 10 rotas × 3 viewports                                            | Playwright VRT |
| A11y                      | Lint jsx-a11y strict + audit manual em telas críticas             | NVDA/VoiceOver |

### 7.2 Qualidade dos testes

- Asserts específicos, não só "espera não dar erro".
- Edge cases cobertos nos caminhos que importam: empty input, null, valores extremos.
- Adversarial inputs em endpoints públicos (XSS, SQL injection, payload gigante).

### 7.3 Test data realista

- Fixtures parecem dados reais (nomes brasileiros, CPFs válidos, telefones formatados).
- Edge cases nominais (acento, hífen, apóstrofo).

---

## §8 — Performance

### 8.1 Frontend budget

| Métrica                | Threshold               | Verificação   |
| ---------------------- | ----------------------- | ------------- |
| Lighthouse Performance | ≥ 90 em rotas críticas  | Lighthouse CI |
| LCP                    | < 2s em landing pública | Lighthouse CI |
| CLS                    | < 0.1                   | Lighthouse CI |

### 8.2 Otimizações obrigatórias

- Images: AVIF + WebP fallback, `sizes` correto, blur placeholder, `fetchpriority="high"` no LCP.
- Fonts: `font-display: swap`, preload em fonts críticas.
- Code splitting por route group (cliente não baixa código de admin).
- Tabular numbers em todo número (zero layout shift).
- Skeleton aparece em < 100ms (zero "tela branca").
- Optimistic updates em check-in, toggles, save de form curto.

### 8.3 Backend

- Queries com `EXPLAIN ANALYZE` em paths críticos.
- Sem N+1 (auditoria por rota).
- RPCs compostas pra evitar round-trips.

---

## §9 — Acessibilidade

### 9.1 WCAG 2.2 AA mínimo

- Contraste APCA validado em todos os 7 estados (não só default).
- Navegação completa por teclado em toda tela.
- Foco gerenciado em mudanças contextuais.
- `aria-live` em mudanças dinâmicas (toast, contagem, validação inline).
- Imagens com `alt` apropriado.
- Labels visíveis em form (não só placeholder), erro associado via `aria-describedby`.

### 9.2 Validação

- Lint `jsx-a11y` strict como `error` em todas as 30+ regras.
- Auditoria manual com NVDA + VoiceOver em telas críticas (signup, dashboard, formulário público, relatório, PWA cliente).

---

## §10 — Observabilidade

### 10.1 Logging

- Todo erro logado com contexto (usuário se autenticado, timestamp, rota).
- Sem `console.log` em produção (lint trava).
- PII não vaza pra logs.

### 10.2 Monitoring

- Sentry calibrado: source maps, alertas por taxa de erro (não evento único).
- Vercel Analytics pra Web Vitals e métricas de performance.
- Eventos básicos de negócio rastreados (signup, lead criado, desafio comprado, check-in feito).

---

## §11 — CI/CD e Processo

### 11.1 Gates obrigatórios em CI

PR só merge com tudo verde:

- `pnpm exec tsc --noEmit` zero erros
- `pnpm lint` zero erros **e zero warnings**
- `pnpm exec vitest run` tudo verde
- `pnpm build` passa
- Visual regression (Playwright VRT) dentro do threshold

### 11.2 Branch protection

- Direct push bloqueado em `main`.
- PR requer status checks obrigatórios.
- Sem force-push.

### 11.3 Commits limpos

- Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`).
- Commits atômicos (uma coisa por commit).
- Mensagem do commit explica o **por que**, não só o que.

### 11.4 Deploy

- Deploy preview automático no PR (Vercel).
- Deploy production só após PR merged em main com CI verde.

---

## §12 — Documentação

**Não burocracia. Só o necessário pra próximo dev entender e operar.**

### 12.1 Mínimo obrigatório

| Doc                              | Localização                                 |
| -------------------------------- | ------------------------------------------- |
| README                           | raiz do repo                                |
| Architecture                     | `docs/core/architecture.md`                 |
| Schema                           | `docs/core/schema.md`                       |
| Decisions (leve, sem ADR formal) | `docs/core/decisions.md`                    |
| Posicionamento                   | `docs/core/positioning.md`                  |
| Design System                    | `docs/core/DESIGN-SYSTEM-FOUNDATION.md`     |
| Padrão Impecável                 | `docs/plano-lancamento/PADRAO-IMPECAVEL.md` |
| Plano                            | `docs/plano-lancamento/PLANO_LANCAMENTO.md` |

### 12.2 Comentários no código

- Comentário só onde explica **por que**, não **o que**.
- JSDoc em funções públicas exportadas de `lib/`.

### 12.3 Runbook operacional

Documentado em `docs/plano/operacional/runbook.md` (simples):

- O que fazer quando Supabase cai.
- O que fazer quando Pagar.me / EFI cai.
- Como fazer rollback de deploy.

---

## Anti-padrões fundamentais (vale pra todas as camadas)

### A1 — Warning como estado final

Lint não tem categoria "warning" como estado final. Toda regra introduzida termina como `error`. `warn` só existe como estado de transição durante codemod ativo.

### A2 — "Resolvo depois"

Fase só fecha quando critérios estão cumpridos.

### A3 — Exception sem justificativa concreta

Toda `eslint-disable` precisa de comentário explicando razão técnica nominada. "Caso especial" não conta.

### A4 — "Funciona, então tá pronto"

Funcionar é mínimo, não suficiente.

### A5 — Cópia disfarçada de "reutilização"

Componente parecido em dois lugares não é reutilização — é duplicação que vai divergir.

### A6 — Mascarar dívida em sufixo

`UserCardOld`, `formatNew`, `oldHandler`. Resolve agora ou registra como issue rastreado.

### A7 — Decisão silenciosa

Mudança estrutural requer registro em `docs/core/decisions.md`.

### A8 — Feature flag eterno

Toda flag tem data de remoção declarada.

---

## Histórico

- 2026-04-29 — Versão inicial. 12 camadas + 8 anti-padrões.
- 2026-04-29 — Simplificação: removido over-engineering enterprise (ver `SIMPLIFICACAO-2026-04-29.md`).
