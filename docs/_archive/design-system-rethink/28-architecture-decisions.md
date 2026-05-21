# 28. Architecture decisions — 9 recomendações estruturadas

> **Tipo:** pesquisa de decisão arquitetural (não é ADR — outputs aqui alimentam ADR-NN).
> **Audiência:** arquiteto sênior consolidando decisões A1-A6, B4, I1, I2 do design system.
> **Inputs:** `20-design-system-axes-concept.md`, `00-state.md`, `11-decisions-pending.md`, `docs/research/27-design-tokens-per-archetype.md` + 8 web searches (Style Dictionary, Material 3 HCT, culori, Polaris, Vercel Edge Config, Next.js 16 cache, Radix Colors, build-time vs runtime tokens).
> **Data:** 2026-05-20
> **Constraint master:** startup B2B multi-tenant solo, Supabase, goal 71 archetypes automáticos, mobile-first PWA, budget-conscious.

---

## A1 — `tenants.archetype_id`: text (pointer pra TS) vs uuid (FK pra tabela)

**Recomendação:** Opção A — `text` apontando para ID de arquivo TypeScript em `lib/design/archetypes/<id>/index.ts`
**Confiança:** Alta
**Raciocínio:** O goal de 71 archetypes automáticos é incompatível com migration-per-archetype. Style Dictionary (Amazon), Polaris (Shopify) e Vercel Edge Config convergem: **definição fica em código versionado, escolha do tenant fica no banco**. Archetype não é entidade de domínio (não tem ciclo de vida, não tem relacionamentos transacionais, não tem RLS) — é configuração. Tratar como FK uuid força INSERT manual no banco + duplica fonte da verdade (TS export + linha DB que precisam ficar em sync). CHECK constraint contra lista (opção C) tem o mesmo problema da opção B: migration toda vez que adiciona archetype.
**Referência externa:** Style Dictionary architecture docs ("source files are JS/JSON, deployment targets are platforms"); Vercel Edge Config pattern (config-as-code com push-based CDN); Shopify Polaris tokens (npm package, não DB row).
**O que esta decisão desbloqueia:**

- Adicionar archetype #25 = criar pasta + PR (sem migration, sem touch no banco)
- Versionamento natural via git (rollback de archetype = revert commit)
- TypeScript safety end-to-end (`Archetype` é union literal type derivado do registry)
- Mesmo path de evolução pra `palette_id` no longo prazo (hoje uuid por motivos históricos ADR-0028 — reavaliar quando refactor tonal acontecer)
  **Risco se errar:** se escolher uuid FK, cada um dos 71 archetypes custa 1 migration + 1 INSERT + risk de orphan rows quando archetype é removido em código mas linha persiste no DB. Pior: drift silencioso entre TS export e DB row quebra UI em produção sem typecheck pegar.

**Validation guard rail:** TypeScript runtime check em `getBrandByHost` — `assertArchetypeExists(tenant.archetype_id)` lança erro claro se DB tem id desconhecido (caso archetype seja removido do código antes de migrar tenants).

---

## A2 — `shape_presets`: absorver no archetype ou manter como override?

**Recomendação:** Opção A — radius travado por archetype, tabela `shape_presets` deprecada
**Confiança:** Alta
**Raciocínio:** Radius é **propriedade definidora de identidade visual** — Linear com 14px e Stripe com 8px não são "mesmos archetypes com radius diferente", são archetypes diferentes. Pesquisa 27 mostrou bimodal (6-12px técnico vs 20-32px editorial) é parte do DNA, não overlay. Opção B (tenant escolhe sharp/rounded/pill) destroi coerência visual: Apple-archetype com radius 0 = não é Apple. Opção C (override em range) adiciona complexidade de UI admin sem benefício real — profissional não-designer não sabe quando quebra coerência. Mesmo padrão Notion/Linear/Stripe: cada um trava seu radius.
**Referência externa:** Radix Themes (radius é theme prop global, não per-component); Polaris (`--p-border-radius-*` fixos no system); Tailwind v4 `@theme` (radius é parte da theme definition, não runtime override).
**O que esta decisão desbloqueia:**

- Remove tabela `shape_presets` da superfície do admin (menos campo pra explicar)
- Coerência visual garantida — tenant não consegue "estragar" Linear escolhendo pill button
- `--radius-*` vira parte do CSS gerado pelo archetype, sem layer extra de resolução
- Migração: dropar `shape_presets` em 0018 + null-out `tenants.shape_preset_id` se existir
  **Risco se errar:** se mantiver como override, abre porta pra "Frankenstein archetypes" (Linear-com-pill, Apple-com-sharp) — tenant cria visual incoerente, percepção de qualidade do white-label cai, suporte tem que explicar combos ruins. Reverter é fácil tecnicamente mas custoso em UX porque admins já configuraram.

---

## A3 — `palettes`: pre-computed OKLCH vs tonal derivation (seed + offsets)

**Recomendação:** Opção C — híbrido evolutivo: manter atual + adicionar `seed_oklch` + derivar variantes adicionais automaticamente em pipeline separado
**Confiança:** Média
**Raciocínio:** Opção B (refactor completo tonal) é tecnicamente superior (Material 3 / Radix Colors validam) mas custa refactor grande de `palettes` table + gerador novo + APCA pipeline + revalidar 13 paletas existentes — solo founder, isso é 2-3 dias só pra paridade. Opção A (manter absoluto) não escala pra Notion-style 8 tints derivados. Híbrido: cada paleta ganha `seed_oklch` (1 coluna), tonal positions ficam no archetype (`tints: { count: 8, lightness_offsets: [...], chroma_curve: 'notion' }`), gerador deriva `--accent-tint-1..8` em runtime via culori. As 13 paletas existentes continuam servindo os 29 roles via mapping direto; tonal derivation ativa SÓ quando archetype declara `needsTints: true`. Migração incremental, sem big-bang.
**Referência externa:** culori.js + Tailwind v4 (Tailwind v4 usa culori internamente pra derivação OKLCH); Material 3 (HCT com `key colors` → tonal palettes de 13 tones cada); Radix Colors (12 steps derivados algorítmicamente com APCA gate em steps 11-12).
**O que esta decisão desbloqueia:**

- Notion archetype com 8 tints funciona sem hardcode (deriva da seed da paleta atual)
- Linear archetype com 0 tints ignora o sistema (sem custo)
- APCA validation continua no nível de role final (não muda gate atual)
- Migration path pra opção B completa no futuro (já temos seed_oklch — só falta migrar roles diretos pra derivados quando valer a pena)
- Mantém compatibilidade com fluxo atual de admin (entra com OKLCH absoluto + opcionalmente declara seed)
  **Risco se errar:** se for opção A pura, archetype Notion fica impossível sem hardcode → quebra modelo "archetypes automáticos". Se for opção B agora, atrasa transformação 2-3 dias + risco de bug em derivação afetar 100% dos tenants (não tem rollback fácil quando roles mudam de fonte).

**Implementação tática:**

```sql
ALTER TABLE palettes ADD COLUMN seed_oklch text NULL;
ALTER TABLE palettes ADD COLUMN supports_tonal_derivation boolean NOT NULL DEFAULT false;
```

Archetype declara `tonalScheme: { kind: 'notion-tints', count: 8, offsets: [...] }` e gerador CSS chama `derivePalette(paletteSeed, scheme)` apenas se ambos lados aceitarem.

---

## A4 — Typography × archetype: constraint de compatibilidade

**Recomendação:** Opção B — metadata JSON no config do archetype (constraint suave) + UI "recommended" vs "available"
**Confiança:** Alta
**Raciocínio:** Profissional não é designer — opção A (FK hard) bloqueia experimentação válida ("e se eu quiser Linear-com-Newsreader?") e exige migration toda vez que adiciona archetype OU typography (matriz quadrática). Opção C (livre total) gera combos visualmente ruins (Apple-archetype com Comic Sans). Opção B casa com o pattern de A1: compatibilidade é metadata em código, não linha de DB. Archetype declara `typography: { recommended: ['inter', 'geist'], compatible: ['plus-jakarta', 'dm-sans'], discouraged: ['newsreader'] }`. UI renderiza 3 zonas visuais: ✅ recommended (default selecionado), ⚠️ compatible (mostra com "fora do canônico"), 🚫 discouraged (mostra mas com warning explícito).
**Referência externa:** Figma "design system suggestions" pattern (highlight recommended, allow override); Vercel template marketplace (categoriza compatibility sem bloquear); Material 3 (color roles têm "suggested usage" sem enforce).
**O que esta decisão desbloqueia:**

- Adicionar typography nova = atualizar 1 campo em archetype configs (não migration)
- A/B testing de combos (admin pode tentar combinação não-recommended se quiser)
- Compat matrix vira tabela visual em admin docs (gerada do código)
- TypeScript: `type ArchetypeTypographyCompat = { recommended: TypographyId[]; compatible: TypographyId[]; discouraged: TypographyId[] }`
  **Risco se errar:** se for opção A (FK hard), refactor da matriz quando archetype #25 entra é cirúrgico (toda typography precisa declarar compat com novo archetype). Se for opção C (livre), suporte fica respondendo "por que minha app parece estranha?" — sai caro em qualidade percebida.

---

## A5 — Onboarding pipeline para archetype #25

**Recomendação:** Opção C — DESIGN.md + TypeScript config manual + APCA validation gate em CI antes de publicar
**Confiança:** Alta
**Raciocínio:** Opção A (parser automático) é fantasia: DESIGN.md tem formato variável (71 arquivos diferentes), valores qualitativos ("subtle shadow"), e gerar config 100% automático significa garbage-in-garbage-out. Opção B (config manual sem gate) deixa quality emergente — APCA fail em produção depois de tenant comprar plano = crisis. Opção C protege contra os 2 modos de falha: arquiteto traduz DESIGN.md → TS (decisão humana, ~30min por archetype) + CI gate roda `archetype:validate` que verifica (a) todos os 29 semantic roles preenchidos, (b) APCA Silver gate em todas paletas-default × archetype, (c) Storybook stories renderizam sem erro, (d) bundle size <budget. Sem CI verde, archetype não é exportado em `registry.ts`.
**Referência externa:** Polaris contribution workflow (manual edit + automated validation); Material 3 dynamic_color_scheme test suite (algorithmic validation antes de ship); Style Dictionary build pipeline (transform + format + validate).
**O que esta decisão desbloqueia:**

- 71 archetypes em ~35 horas de trabalho humano (30min × 71), espalhado em sprints
- Quality gate impossível de bypassar (CI bloqueia merge)
- Onboarding doc é a própria checklist (não Confluence wiki que apodrece)
- ADR-0040 contrast rule continua de pé sem alterações
  **Risco se errar:** se for opção A, primeiro archetype com DESIGN.md atípico (The Verge, Spotify mobile) quebra parser → arquiteto tem que fazer manual mesmo → tempo investido em parser desperdiçado. Se for opção B (sem gate), 1 archetype com role faltante em produção = blank screens em N tenants = churn imediato.

**Pipeline tático (script `pnpm archetype:scaffold <name>`):**

```
1. cp -r lib/design/archetypes/_template lib/design/archetypes/<name>
2. Arquiteto preenche tokens.ts + roles.ts + typography.ts + compat.ts
3. pnpm archetype:validate <name> → APCA + roles completeness + bundle size
4. pnpm storybook:test --archetype=<name> → stories rendering
5. PR opens → CI roda steps 3-4 automaticamente
6. Merge → next deploy expõe archetype no admin selector
```

---

## A6 — Archetype configs: arquivos separados vs registry único

**Recomendação:** Opção C — arquivos separados + auto-generated `registry.ts` via script `pnpm archetype:index`
**Confiança:** Alta
**Raciocínio:** Opção A pura (24+ arquivos sem registry) força import dinâmico em todo lugar (`await import(\`./archetypes/${id}\`)`) — quebra tree-shaking e TypeScript inference. Opção B (registry único de 24 entries) carrega TODOS archetypes em todo bundle (mesmo que tenant use 1) — pra 71 archetypes isso é proibitivo (estimativa: ~200KB+ em CSS-as-JS + metadata). Opção C resolve ambos: arquivos separados permitem lazy load por archetype ativo (`import(\`./archetypes/${tenant.archetype_id}\`)` resolvido no build via Turbopack), o registry auto-gerado dá TypeScript safety (`Archetype`é union literal) e DX (autocomplete completo). Script`pnpm archetype:index` roda em pre-commit hook + CI, garante registry sempre em sync.
**Referência externa:** shadcn registry pattern (cada componente é arquivo separado + manifest); Next.js app router (file-system based routing + auto-manifest); Polaris tokens (arquivos por categoria + index gerado).
**O que esta decisão desbloqueia:**

- Tree-shaking: bundle carrega só archetype ativo (importante quando chegar a 71)
- TypeScript: `type ArchetypeId = keyof typeof registry` é literal union automático
- Storybook: cada `.stories.tsx` co-localizado em `lib/design/archetypes/<name>/stories/`
- Adicionar archetype = 1 pasta + 1 commit, registry regenera automaticamente
  **Risco se errar:** se for opção B (registry monolítico), bundle size cresce linearmente com archetypes — performance budget D-40 estoura em ~archetype #15. Se for opção A pura (sem index), TypeScript não sabe quais archetypes existem em compile time, perde safety em `getArchetypeById()`.

**Estrutura tática:**

```
lib/design/archetypes/
├── _template/           # boilerplate pra `pnpm archetype:scaffold`
├── linear/
│   ├── index.ts        # default export: ArchetypeConfig
│   ├── roles.ts        # 29 semantic roles
│   ├── tokens.ts       # raw tokens
│   ├── compat.ts       # typography compatibility (A4)
│   └── stories/        # Storybook (A5 gate)
├── notion/
├── stripe/
├── ...
└── registry.generated.ts  # script-output, git-tracked, .gitattributes linguist-generated
```

---

## B4 — Tokens responsivos: pairs mobile/desktop

**Recomendação:** Opção A — valores como pares no archetype config `{ mobile: '56px', desktop: '64px' }`, gerador CSS emite `@media`
**Confiança:** Alta
**Raciocínio:** Opção B (dois tokens distintos `--nav-height-mobile` + `--nav-height-desktop`) força componente a saber qual usar (`className={isMobile ? 'h-[--nav-height-mobile]' : 'h-[--nav-height-desktop]'}`) — perde poder de CSS, vira lógica JS, quebra em SSR. Opção C (container queries) tem suporte parcial em PWAs antigos e ainda imatura em iOS (especialmente WebView). Opção A casa com o resto do sistema: archetype config declara semântica (`navHeight: { mobile: 56, desktop: 64 }`), gerador emite o CSS canônico:

```css
@theme {
  --nav-height: 56px;
}
@media (min-width: 1024px) {
  @theme {
    --nav-height: 64px;
  }
}
```

Componente usa `var(--nav-height)` sem saber se mobile ou desktop — exatamente o que tokens são para resolver. Coerente com IBM Carbon "layout tokens" pattern (mesma token, valor responsivo).
**Referência externa:** IBM Carbon (layout tokens responsive via media queries); Polaris `--p-space-*` (semantic per breakpoint); Tailwind v4 `@theme` (suporta media queries native).
**O que esta decisão desbloqueia:**

- DX trivial — devs escrevem `h-[var(--nav-height)]` sem condicional
- SSR correto (CSS responde a viewport, não JS)
- Archetype config fica declarativo (`{ mobile, desktop }`) — fácil de mostrar em admin docs
- Funciona em qualquer browser PWA (media queries são universais)
  **Risco se errar:** se for opção B, componentes ficam acoplados a breakpoints (sabe o que é "mobile" — knowledge leak), refactor de breakpoint = touch em N componentes. Se for opção C (container queries), corner cases em iOS 16/17 PWA causam layout-shift em produção.

**Token namespace:** `--nav-height`, `--layout-max-width`, `--layout-gutter`, `--space-section` são os 4 conhecidos do dia 1 (pesquisa 27 §A.4-A.5). Adicionar JIT.

---

## I1 — FOUC prevention para endpoint `theme.css` dinâmico

**Recomendação:** Opção D — server-render o CSS diretamente no RSC layout via `<style dangerouslySetInnerHTML>` (sem endpoint separado)
**Confiança:** Alta
**Raciocínio:** Endpoint `theme.css` separado tem 3 problemas combinados pra PWA mobile-first: (1) extra HTTP round-trip antes de paint, (2) bloqueia render até CSS chegar (FOUC garantido se cache miss), (3) Supabase latency em 3G adiciona 200-400ms ao TTFB do CSS. Opção A (inline crítico + link pro resto) duplica complexidade. Opção B (preload) só ajuda em cache hit — primeiro request de cada tenant ainda flasha. **Insight chave:** o CSS dinâmico é trivial em tamanho (~3-5KB gzipped, são CSS variables + media queries — não classes geradas). Inlining 5KB em `<head>` adiciona ~5KB ao HTML mas elimina round-trip — net positive em mobile. Next.js 16 RSC layout permite ler `cookies()`/`headers()` em runtime e renderizar `<style>` com CSS gerado a partir de `tenant.archetype_id + palette_id + typography_id + theme_mode`. CSS gerado vai dentro do `<head>` do shell, browser parseia inline antes de qualquer paint = zero FOUC.
**Referência externa:** Next.js 16 RSC pattern ("extract runtime values in uncached parent, pass to cached"); Vercel best practices for per-tenant theming; Material 3 dynamic color (gera CSS inline server-side).
**O que esta decisão desbloqueia:**

- Zero FOUC em primeiro request (cache miss não importa)
- Zero extra round-trip (era o gargalo em mobile 3G)
- HTML payload aumenta ~5KB gzipped (aceitável vs gain de paint)
- Cache strategy fica simples (I2): cache do RSC layout cobre o CSS
- Sem endpoint `/theme.css` pra manter (menos surface area)
  **Risco se errar:** se for opção A (link + preload), FOUC visível em cada primeiro request de tenant novo + complexidade de "qual fragmento é crítico". Se for opção C (hybrid), mesma complexidade sem ganho real (5KB inline é o teto natural). Endpoint separado faz sentido só se CSS for >50KB — não é nosso caso.

**Implementação tática:**

```tsx
// app/[locale]/layout.tsx (RSC)
import { generateThemeCSS } from '@/lib/design/generate-theme-css'

export default async function Layout({ children }) {
  const brand = await getBrandByHost(headers().get('host'))
  const css = await generateThemeCSS(brand) // pure function, cacheable

  return (
    <html>
      <head>
        <style dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

`generateThemeCSS` é pure function de `(archetype, palette, typography, mode) → string` — cacheable via `unstable_cache`/`use cache` com chave granular (I2).

---

## I2 — Cache strategy para CSS gerado

**Recomendação:** Opção C — `cacheTag('combo:${archetype}:${palette}:${typography}:${mode}')` granular por combinação
**Confiança:** Alta
**Raciocínio:** Opção A (tag por tenant) gera N entradas de cache pra N tenants — desperdiça memória/CDN quando 100 tenants usam mesma combinação. Opção B (tag por archetype) compartilha bem mas invalidação errada: trocar paleta de 1 tenant não deveria invalidar archetype inteiro (afeta tenants alheios). Opção D (sem cache) ignora que o CSS é função pura de 4 inputs — desperdiça compute toda request. Opção C é o sweet spot: chave de cache é exatamente a combinação que produz CSS único. Universo de combos pra 71 archetypes × 13 paletas × 6 typographies × 2 modes = 11.076 combinações máximas teóricas, na prática <500 ativas (compat matrix A4 reduz combinações válidas + maioria dos tenants converge em poucos defaults). Cada combo é cacheable indefinidamente (CSS gerado é determinístico). Invalidação: quando admin troca eixo, server action chama `revalidateTag(\`combo:${old}\`)` + a próxima request popula novo combo.
**Referência externa:** Next.js 16 cacheTag docs ("granular invalidation via tags"); Vercel multi-tenant patterns (cache key = config tuple); Polaris token versioning (semantic version = cache invalidation boundary).
**O que esta decisão desbloqueia:**

- Cache hit rate ~99% em produção (combos repetem entre tenants)
- CDN edge cache funciona automático (cacheTag propaga)
- Invalidação cirúrgica: trocar paleta de tenant X invalida 1 combo, não 1 tenant
- Custo de compute: cap em ~500 combos (não N tenants)
- Funciona com Next.js 16 `use cache` directive nativamente
  **Risco se errar:** se for opção A (per tenant), cache cresce linear com tenants — desperdício. Se for opção B (per archetype), invalidação cascateia errado (admin troca palette no tenant Acme → archetype linear inteiro invalida → tenants Beta/Gamma também perdem cache desnecessariamente). Se for opção D (sem cache), compute redundante em hot path do RSC layout (cada request paga função pura).

**Implementação tática:**

```ts
// lib/design/generate-theme-css.ts
'use cache'

import { cacheTag, cacheLife } from 'next/cache'

export async function generateThemeCSS(brand: Brand): Promise<string> {
  const key = `${brand.archetype_id}:${brand.palette_id}:${brand.typography_id}:${brand.theme_mode}`
  cacheTag(`combo:${key}`)
  cacheLife('days') // CSS gerado é estável

  return buildCSS(brand) // pure function: archetype tokens + palette roles + typography + mode → CSS string
}

// app/<scope>/actions.ts (admin troca eixo)
import { revalidateTag } from 'next/cache'

export async function changeArchetype(tenantId: string, newArchetypeId: string) {
  const oldBrand = await loadBrand(tenantId)
  await updateBrand(tenantId, { archetype_id: newArchetypeId })

  const oldKey = `${oldBrand.archetype_id}:${oldBrand.palette_id}:${oldBrand.typography_id}:${oldBrand.theme_mode}`
  const newKey = `${newArchetypeId}:${oldBrand.palette_id}:${oldBrand.typography_id}:${oldBrand.theme_mode}`

  revalidateTag(`combo:${oldKey}`) // pode ser shared, mas seguro invalidar
  revalidateTag(`combo:${newKey}`) // garante next request popula
}
```

**Importante:** `cacheTag('combo:...')` NÃO inclui `tenant_id` — é o ponto. Dois tenants com mesma combinação compartilham cache entry. Isso é seguro porque CSS é função pura dos 4 eixos.

---

## Harmonia entre decisões

As 9 decisões formam **um sistema coerente** baseado em 3 princípios atravessando tudo:

### Princípio 1 — "Definição em código, escolha em banco"

**A1 + A4 + A6 + A5** convergem nisso. Archetypes, typography compat, e archetype configs são definições estruturais → ficam em TypeScript versionado. Tenant escolhe via `text` IDs no banco. Onboarding de archetype #25 envolve zero migration. Goal de 71 archetypes automáticos torna-se viável (cada archetype = pasta + PR + CI gate). Reverse: se A1 fosse uuid FK, A5 (onboarding automático) seria impossível e A6 (registry auto-gerado) seria redundante.

### Princípio 2 — "CSS é função pura de poucos eixos"

**A3 + B4 + I1 + I2** se encaixam. O CSS gerado pra um tenant é função pura de `(archetype, palette, typography, mode)`. A3 (tonal derivation híbrida) preserva essa pureza adicionando 1 eixo opcional (seed_oklch) sem quebrar caching. B4 (tokens responsivos via media queries) mantém o CSS declarativo (sem JS de runtime). I1 (server-render inline) elimina round-trip e FOUC. I2 (cacheTag por combo) garante que função pura tem cache key correspondente — 500 combos cacheable em vez de N tenants. **Se A3 fosse opção B completa (tonal derivation total agora)**, I2 ainda funcionaria (combo key não muda) mas refactor seria 2-3 dias adicionais — por isso opção C (híbrido evolutivo) é a recomendada.

### Princípio 3 — "Constraint suave + gate duro"

**A2 + A4 + A5** seguem mesmo padrão de validação. A2 (radius travado no archetype) é constraint estrutural — não é negociável visualmente. A4 (typography compat como metadata) é constraint suave — UI sugere mas permite override. A5 (APCA gate em CI) é gate duro — rejeita archetype incompleto antes de virar producible artifact. Sistema fala 3 línguas dependendo de onde o erro pode acontecer (estrutural = travar, qualitativo = sugerir, validável = automatizar gate).

### Dependências cruzadas críticas

1. **A3 (tonal derivation) ↔ A2 (radius travado):** ambos reforçam "archetype é DNA estrutural, não overlay". Se A2 fosse opção B (override de radius), a contagem variável de tints (A3) ficaria desalinhada — tenant poderia ter "Notion-com-radius-zero" que visualmente não funciona com 8 tints pastel.

2. **A3 (tonal derivation) ↔ I2 (cache combo):** seed_oklch ENTRA no cache key se for usado. Atualizar para incluir: `cacheTag(\`combo:${archetype}:${palette}:${typography}:${mode}:${seed_oklch ?? 'none'}\`)`. Garante que troca de seed invalida cache mesmo se outros 4 eixos forem iguais.

3. **A4 (typography compat) ↔ A5 (onboarding gate):** o gate de CI precisa validar que typography `recommended` por archetype tem font instalada (next/font config). Sem isso, archetype passa CI mas fonte 404 em produção.

4. **A6 (registry auto-gerado) ↔ A1 (text id):** o registry.generated.ts é a "fonte da verdade" pra runtime validation em A1 (`assertArchetypeExists`). Se A1 fosse uuid FK, registry seria mero docs (não load-bearing). Sendo text, registry é literalmente o catálogo válido.

5. **I1 (inline CSS) + I2 (cache combo):** cache cobre o RSC layout que faz o inline. Cache hit em I2 = HTML retorna com `<style>` já populado, zero Supabase round-trip pra recomputar. Cache miss = compute roda 1x e popula combo pra próximas requests de todos tenants com mesma combinação.

### O que esse sistema NÃO faz (por design)

- Não permite "edit your own theme" granular (D-17 confirma: A em fase 1, B em fase 2 JIT). Isso é coerente com A2 + A4: customização vive nos eixos, não em overrides arbitrários.
- Não pré-gera CSS pra todos combos (lazy populate via I2). 500 combos × 5KB = 2.5MB de cache potencial — fine pra Vercel edge KV.
- Não trata archetype como entity de domínio. Sem CRUD admin pra archetypes — só pra escolha (D-17 + A1).

### Risco residual sistêmico

O único risco que atravessa múltiplas decisões: **complexidade conceitual pra solo founder**. 3-layer token system (D-21) + tonal derivation híbrida (A3) + 9 decisões interconectadas exigem disciplina pra não rasgar quando Storybook story estiver lenta. Mitigação: A5 (CI gate) + A6 (registry gerado) + I2 (cache automático) → muito do enforcement é automatizado, founder não precisa lembrar das regras toda PR.

---

## Próximos passos (não decisões — execução)

1. Promover decisões A1+A4+A6+I1+I2 pra ADR-NN raiz (decisões "definição em código + cache de função pura")
2. Promover A2 pra ADR separada (radius travado é one-way door)
3. A3 (híbrido) entra como hipótese refinada em D-25 — confirma quando primeiro archetype Notion-style for prototipado
4. A5 (CI gate) vira parte do plano `docs/plans/design-system.md` Passo 7 (Storybook integration)
5. B4 vira rule revisada em `.claude/rules/design-tokens.md` (adicionar seção "responsive tokens")
6. Migration 0018 dropa `shape_presets` (A2) + adiciona `seed_oklch` em `palettes` (A3) + adiciona `archetype_id text` + `typography_id text` + `theme_mode` em `tenants` (A1)
