# 0031. Lint overrides intencionais (escopos pre-positioned)

Date: 2026-05-17
Status: accepted

## Context

Batch 1 dia 0 expôs 3 vetores de falsos-positivos do lint global vs realidade
do greenfield:

1. **shadcn 100% (ADR-0008)** — blocos oficiais usam `text-sm`, `rounded-md`,
   strings inline em inglês (`"Loading…"`), `setState` em `useEffect` (carousel,
   sidebar). Cada `pnpm dlx shadcn@latest add` reescreve esses arquivos. Patchar
   componente-a-componente = ciclo de quebra contínuo (vide ADR-0030).

2. **Scripts CLI** (`scripts/*.ts`, `scripts/*.sh`) — sao ferramentas one-shot
   de manutenção (audits, seeds, validators). Limites `max-lines: 300`,
   `max-lines-per-function: 60`, `complexity: 12` sao mirados em código de
   aplicação reutilizado, não scripts top-down de migração.

3. **Arquivos de configuração** (`eslint.config.mjs` próprio, `.ladle/config.mjs`)
   — ESLint config contém o array `BANNED_VOCAB` declarado como strings literais.
   `.ladle/config.mjs` usa `export default {}` (anonymous default) por convenção
   do framework Ladle.

4. **Boundary exceptions intencionais** — `lib/supabase/admin.ts` precisa importar
   `createClient` raw do `@supabase/supabase-js` (é o wrapper). `lib/route/getRouteByHost.ts`
   precisa importar `@/lib/supabase/admin` (lookup pré-RLS no edge — ADR-0024
   exige BYPASS pra resolver brand antes de saber tenant).

5. **`hooks/use-mobile.ts`** — pattern oficial shadcn (sidebar block dep). Usa
   `setState` em `useEffect` pra detectar SSR vs client. React docs aceita esse
   pattern especificamente pra "external store sync" — exatamente o caso (window
   matchMedia é external store).

Alternativas avaliadas:

- (A) Bloquear `eslint-disable` inline e fixar caso-a-caso: 47 componentes shadcn
  - scripts seriam 100+ arquivos editados manualmente. Quebra a cada `add`.
- (B) Overrides por path no flat config: declarativo, centralizado, sobrevive a
  re-instalação shadcn, deixa código de aplicação 100% strict.
- (C) Desabilitar regra globalmente: perde proteção em código de aplicação.

## Decision

Adicionar 7 override blocks em `eslint.config.mjs` (flat config), cada um
documentado com ADR justificativa:

### §1 — `components/ui/**`

```
'react/jsx-no-literals': 'off'
'design-tokens/no-tailwind-bypass': 'off'
'max-lines': 'off'
'max-lines-per-function': 'off'
'complexity': 'off'
'react/no-set-state-in-effect': 'off'  // se a regra estiver ativa
```

**Por quê:** shadcn é vendor — ADR-0008 100% canon. i18n via wrapper em
`components/*` (não em `ui/`).

### §2 — `scripts/**`

```
'max-lines': 'off'
'max-lines-per-function': 'off'
'complexity': 'off'
```

**Por quê:** CLI one-shot — limites de aplicação não se aplicam.

### §3 — `eslint.config.mjs`

```
'vocab/no-banned-vocab': 'off'
```

**Por quê:** o array `BANNED_VOCAB` literalmente lista os termos banidos.

### §4 — `lib/supabase/admin.ts`

```
'no-restricted-imports': 'off'
```

**Por quê:** é o wrapper canônico do `@supabase/supabase-js`. ADR-0024 exige
BYPASS RLS pra service-role.

### §5 — `lib/route/getRouteByHost.ts`

```
'no-restricted-imports': 'off'
```

**Por quê:** lookup pré-RLS no edge — proxy precisa resolver brand antes de
ter sessão. ADR-0024.

### §6 — `.ladle/config.mjs`

```
'import/no-anonymous-default-export': 'off'
```

**Por quê:** convenção oficial Ladle — `export default {}` é a API esperada.

### §7 — `hooks/use-mobile.ts`

```
'react-hooks/set-state-in-effect': 'off'
```

**Por quê:** SSR-safe pattern oficial — `useState(undefined)` + `useEffect`
detect client. ADR-0008 (block shadcn sidebar dependency).

### §8 — `lib/contracts/database.ts`

```
'max-lines': 'off'
'max-lines-per-function': 'off'
```

**Por quê:** gerado por `supabase gen types` (2000+ linhas com 25+12 tabelas).
Não editar manualmente.

### §9 — `lib/design/seeds/**/*.ts`

```
'max-lines': 'off'
'max-lines-per-function': 'off'
```

**Por quê:** seed data arrays (13 paletas × N tokens cada, 7 fontes, 5 push
templates etc) — JSON-like, dados em vez de lógica.

### §10 — `lib/env.ts` + `lib/route/RouteProvider.tsx`

```
'no-restricted-syntax': 'off'  // hardcoded Error messages
```

**Por quê:** dois cenários onde `t()` (next-intl) ainda não está acessível:

1. `lib/env.ts` valida envs **antes** do runtime de i18n carregar (boot-time)
2. `lib/route/RouteProvider.tsx` throws em hook misuse — pattern React idiomático
   (`useContext` retorna `null` se fora do Provider). Mensagem só atinge dev.

§1 (shadcn vendor) também recebeu expansão pra `no-restricted-syntax` +
`jsx-a11y/click-events-have-key-events` + `no-noninteractive-element-interactions`

- `anchor-has-content`, e o escopo de paths foi estendido pra incluir blocks
  shadcn em `components/<bloco>.tsx` (não só `components/ui/`).

## Consequences

**Positivo:**

- Código de aplicação (`app/*`, `lib/*` excluído §4-§5, `components/*` excluído
  ui/) permanece 100% strict
- `pnpm dlx shadcn@latest add <comp>` funciona sem patches
- Cada override tem ADR justificativa (rastreável em audit)
- Scripts CLI não viram "objetos complexos com 5 helpers" só pra passar lint

**Negativo:**

- 7 paths não rodam todas as regras — bugs em `components/ui/` ou `scripts/`
  podem passar sem detecção. Mitigação:
  1. Code review extra em PRs que mexem esses paths
  2. Smoke tests + Ladle stories cobrem `components/ui/`
  3. Scripts são manualmente rodados em CI (build falha se script falhar)
- Tradeoff: confiar em estrutura/processo em vez de lint automático nesses paths

**Neutro:**

- Revisitar §1 se shadcn upstream publicar componentes i18n-ready
- Revisitar §6 se Ladle ≥3.0 mudar convenção de config
- Cada novo override exige PR + comentário inline `// ADR-0031 §N` + entrada
  abaixo nesta lista
