# Sessão 2026-05-21 — TweakCN, shadcn canonical vs invented roles

> **Tipo:** reflexão em curso (não-decidido). Não é ADR ainda.
> **Captura:** inflexão estratégica em discussão. User identificou que TweakCN
> (tweakcn.com — ~9.9k stars, Apache-2.0, criado mar/2025) faz exatamente o que
> estávamos construindo, mas com vocabulário shadcn canonical proven em produção
> e ecossistema integrado (v0.dev, blocks, MCP shadcn). Sessão paralisou implementação
> até showcase real validar se nosso engine entrega valor ou está over-engineered.
> Quando virar decisão cravada, promover pra ADR ou seção do plano `design-system.md`.

---

## 1. O que disparou a inflexão

User assistiu interface do TweakCN e reconheceu que faz "exatamente o que queria,
nada a mais, nada a menos". Pesquisa profunda (`docs/research/28-tweakcn-evaluation.md`)
confirmou TweakCN tem builder UI completo + AI generation + 23 presets curated +
shadcn registry export + v0.dev integration. Nosso engine tem multi-tenant runtime

- cache + APCA + mobile tokens + 22 archetypes — mas **nada disso foi validado
  visualmente**. Construímos infra sem testar produto.

## 2. Erros admitidos da minha parte

Sessão de 8-12h implementou engine + Bloco 2/3/4 + fases A/B/C sem visualizar
output. Quatro erros reconhecidos:

### 2.1 — "Superior" sem prova

Comparei feature-counts numa tabela 21 dimensões. Vencemos 11. Mas todas as
"vitórias" são teóricas — nunca passou olho humano nos 22 archetypes renderizando
componentes reais. 9.9k stars + 631 forks do TweakCN = evidência empírica de
mercado. Nosso modelo = hipótese.

### 2.2 — Regra `.claude/rules/design-references.md` invertida

A rule diz "use APENAS como referência conceitual, NUNCA copie tokens literais"
sobre os 71 DESIGN.md em `docs/references/design-systems/`. **Mas o ponto inteiro
desses arquivos é serem valores proven** — Apple, Stripe, Linear, Notion, Figma,
Spotify usam aqueles tokens em produção, validados por anos. Copiar literal **é
o objetivo**. Princípio em vez de tokens = mush genérico que não parece com
nenhuma das brands de referência. Reverter essa regra é correção necessária
independente da decisão de adotar TweakCN ou não.

### 2.3 — Vocabulário invented isola do ecossistema

shadcn canonical = 28 tokens (`--primary`, `--background`, `--card`, `--popover`,
`--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`,
`--chart-1..5`, `--sidebar-*`). Nosso = 60+ "roles" (`--role-text-emphasis`,
`--role-surface-container`, `--role-shadow-card`, `--role-img-aspect-hero`, etc).

Consequências:

- Nenhum componente externo (shadcn blocks, Kibo UI, Origin UI, v0.dev outputs)
  reconhece nossos tokens. Toda integração custa tradução.
- LLMs (Claude, GPT, Gemini) treinados em shadcn-canon geram código que não tema
  no nosso app.
- TweakCN segue shadcn-canon religiosamente → tudo no ecossistema funciona com ele.
- Maioria dos 60+ "roles" nossos são **rename** dos 28 shadcn (`--role-text-emphasis`
  ≈ `--foreground`, `--role-surface-container` ≈ `--card`). Trocamos compatibilidade
  por nomes diferentes — perda líquida.

### 2.4 — Schema rígido não modela variabilidade real

User aponta: Apple HIG tem ~40 cores (dynamic colors: label, label-secondary,
separator, system-gray-N), Material 3 tem ~256 (tonal palette algorítmica),
Linear tem ~10, Spotify ~8, Stripe ~30. Forçar todos em 28 roles fixos = lossy.
Spotify fica com vazios; Material fica sem espaço.

Nem nosso schema nem TweakCN modelam isso bem (TweakCN também é flat 41).
Quem modela bem é Material 3 (tonal palette derivation algorítmica). Mas é
overkill pro nosso caso.

Solução pragmática emergente: shadcn-canonical 28 como interface pública
obrigatória + native aliases archetype-specific como extras opcionais (`--apple-label-tertiary`,
`--stripe-mesh-1..4`, `--mistral-sunset-1..3`). Ecossistema funciona via shadcn;
signature vive em extras opt-in.

## 3. As 3 categorias do que construímos

### A. Provavelmente joga fora (over-engineering speculativo)

- 60+ "roles" renomeados — são reskinning dos 28 shadcn, perda de compatibilidade
- 5 font slots (display/body/mono/accent/eyebrow) — shadcn 3 (sans/serif/mono)
  cobre 95% dos casos; accent + eyebrow são aspirational raramente usados
- Motion tokens per archetype — motion raramente é brand-specific; nem TweakCN tem
- Vercel 5-level shadow nomenclature — shadcn shadow-sm/md/lg/xl + TweakCN
  algorítmico cobrem
- Type schema fixo pra "roles" — vai contra variabilidade por archetype

### B. Possivelmente vale (precisa teste visual)

- 22 archetypes como "modes" / preset bundles — **só justificável se fielmente
  clonados** dos DESIGN.md respectivos, não inventados
- Native aliases archetype-specific — boa ideia **se forem extras opcionais
  sobre shadcn canonical**, não substitutos

### C. Mantém regardless (provado pela arquitetura do problema)

- Multi-tenant runtime injection (`generateThemeCSS()` + SSR hoist)
- Cache por combo (`cacheTag('combo:...')`)
- DB schema `tenants.archetype_id + palette_id + font_id`
- APCA Silver (melhor que WCAG ratio do TweakCN)
- Mobile-specific tokens (`--mobile-nav-height`, `--inset-safe-*`, `--touch-min`,
  `--press-scale`, `--fab-size`, `--mini-player-height`) — necessários pra PWA
  aluno, iOS HIG/Material 3 grounded, universais (não branding)
- `<AdaptiveShell>` + breakpoint canônico 768px
- Brand resolution via hostname (`getRouteByHost()`)
- Join palette + font slugs (Fase A.1+A.2)
- 5 ESLint rules ds-governance

## 4. Os 3 cenários possíveis do showcase

Após visualizar os 22 archetypes renderizando todos os 32+ componentes em mobile

- desktop, viewport real, tenant real no DB:

### Cenário 1 — Tudo lindo e distinto

22 archetypes parecem 22 brands diferentes claramente. Mistral = gradient sunset;
Spotify = green + dark + persistent mini-player; Stripe = mesh blur + indigo;
Linear = minimalismo cinza; Pinterest = masonry red; etc.

**Decisão:** engine justificado. Próximos passos:

- Migrar nomes "roles" pros canonical (`--role-text-emphasis` → reusar `--foreground`)
- Manter extras como add-on archetype-specific (`--apple-label-tertiary`,
  `--stripe-mesh-N`)
- Construir builder UI próprio inspirado em TweakCN (HSL controls + AI prompt +
  contrast checker + color picker stack)
- v0.dev integration funciona out-of-box porque adotamos canonical
- Reverter `.claude/rules/design-references.md` pra permitir cópia literal de tokens

### Cenário 2 — Funciona mas genérico/embaçado

22 archetypes diferem em micro-coisas (radius, 1-2 cores) mas em geral parecem
variantes do mesmo design. Nenhum tem signature visual reconhecível.

**Decisão:** inventamos demais. Pivot:

- Adopt TweakCN-style schema (28 colors + 3 fonts + radius + shadows + spacing)
- Importar 23 presets TweakCN como seed via `/r/themes/<id>` (one-time script)
- Build builder próprio menor (HSL adjustments + AI + presets)
- Multi-tenant runtime + mobile tokens **permanecem nossos**
- Reverter regra design-references.md (copiar tokens literais)
- Joga fora: 60+ roles, 5 font slots, motion tokens, native aliases, 22
  archetypes como construção dos research-G

### Cenário 3 — Quebrado/incoerente

Archetypes têm bugs visuais, contrastes ruins, fontes não carregam, archetype A
parece archetype B, native aliases não aparecem, etc.

**Decisão:** reescrever foundation. Voltar aos DESIGN.md de referência e:

- Copiar valores literais Apple/Stripe/Linear/Notion/Figma/Spotify/etc
- Reverter regra design-references.md como primeira ação
- Reescrever archetype configs com tokens proven
- Re-rodar APCA validate
- shadcn canonical como base + extras archetype-specific
- Builder UI via fork TweakCN (Apache-2.0) ou inspirado

## 5. Paths de integração com TweakCN (independente do cenário)

### Path 1 — Registry HTTP (`/r/themes/<id>`)

TweakCN expõe themes em formato shadcn registry. Funciona com `npx shadcn add <url>`.
Podemos:

- Pullar os 23 presets públicos deles como **seed do nosso catálogo**
- Mapear shadcn-canonical → roles invented (se mantivermos invented) OU usar direto
- Custo: ~2-3d pipeline de import

### Path 2 — OAuth 2.0 server (`themes:read` scope)

TweakCN tem servidor OAuth próprio. Profissional do nosso app autoriza nosso
admin a ler themes salvos dele no TweakCN. Migration tool sem custo.

### Path 3 — MCP via registry estático

Não é MCP server deles — é o `shadcn@canary registry:mcp` configurado pra
`REGISTRY_URL=tweakcn.com/r/themes/registry.json`. Qualquer IDE/IA com shadcn MCP
lê o catálogo deles. Útil pra IA gerar variações.

### Path 4 — Builder UI clonado (Apache-2.0 permite fork comercial)

Pegar peças específicas:

- `hsl-adjustment-controls.tsx` (~150 linhas — sliders + 10 presets)
- `contrast-checker.tsx` (substituir WCAG por APCA-w3)
- `color-picker.tsx` + `color-selector-popover.tsx`
- `code-panel.tsx` multi-formato (HEX/HSL/OKLCH/RGB)
- `lib/ai/prompts.ts` (~80 linhas de prompt curado — Color Harmony, Font Pairing,
  Mode-Aware Shadows)

Atribuição em `NOTICE.md` cita `jnsahaj/tweakcn`. **Não precisamos clonar o app
deles. Clonamos os controles.**

## 6. v0.dev como feature potencial

v0.dev é Vercel AI gerando componentes shadcn-canonical. TweakCN tem endpoint
`/r/v0/[id]` que exporta theme em formato compatível com v0. Significa: usuário
do TweakCN clica "Apply to v0" e o tema vira a base de componentes que v0 gera.

**Pra nós:**

- Se adotarmos shadcn canonical → v0 components funcionam imediatamente no nosso
  app, temados pelo tenant
- Profissional pede pra IA "criar uma landing page" → v0 gera shadcn components
  → nosso theme injeta cores → fica branded
- **"Vibe coding" como feature do produto pros tenants**
- Se mantivermos roles invented → v0 output **não tema**. Quebra. Inviabiliza
  a feature

Trade-off claro: **canonical = vibe coding free como feature; invented = trabalho
duplicado por integração**.

## 7. PWA + mobile web + desktop — não muda com canonical

Distribuição de theme funciona igual nos 3 surfaces:

- **PWA aluno** (instalável, full-screen, safe-area-insets): consome
  `--inset-safe-*`, `--mobile-nav-height`, `--touch-min`. Theme via tenant.archetype_id.
- **Mobile web non-PWA** (portal aluno no navegador): mesmo theme, safe-area
  fica 0 sem standalone mode. Tokens degradam graciosamente.
- **Desktop admin profissional**: outra densidade, outra layout. Sidebar ao
  invés de NavigationBottom, table-heavy, modal-driven. Mesmos cores/typography.

Mobile-specific tokens vivem em `globals.css` global, não per-archetype.
**Está correto** — touch-min e safe-area não são branding, são iOS/Material
padrões universais.

O que SIM pode ser per-archetype: mobile chrome philosophy (FAB vs sticky CTA,
frosted glass vs solid, gesture sheets vs static drawer). Isso é signature.
Spotify mobile = bottom mini-player persistent. Apple mobile = sticky bottom
CTA + safe-area generous. Pinterest mobile = pull-to-refresh + masonry grid.
**Esses são extras opcionais sobre core shadcn.**

## 8. Decisões cravadas independente do showcase

Algumas correções são necessárias regardless:

1. **Reverter `.claude/rules/design-references.md`** — DESIGN.md files são
   pra copiar tokens literais. Mudar texto da rule de "NUNCA copie" para
   "COPIE tokens literais, valide APCA depois".

2. **Reescrever `.claude/rules/naming.md`** — adicionar regra "shadcn canonical
   tokens são interface pública obrigatória; archetype native aliases são extras
   opt-in" se cenário 1 ou 2 vencer.

3. **Catalogar quais "roles" são reskinning** — fazer mapping
   `--role-text-emphasis` → `--foreground`, `--role-surface-container` → `--card`,
   etc. Migration de tokens depois do showcase decidir.

## 9. Decisão pendente do showcase

Showcase end-to-end com tenant REAL no DB:

- Insert row em `public.tenants` + `public.domains` via migration MCP
- Hostname `showcase.localhost` resolve via `getRouteByHost()`
- Rota `/showcase` renderiza TODOS os 32+ componentes que construímos
- Trocar archetype via server action (UPDATE + revalidateTag) com select control
  no canto
- Validar visualmente todos os 22 archetypes (manualmente ciclando)
- Testar mobile + desktop viewport
- Confirmar/refutar visualmente: archetypes ficam distintos ou genéricos?

Output do showcase = qual cenário (1, 2 ou 3) é a realidade. A partir daí, as
decisões 2.1-2.4 viram cravadas via ADR.

## 10. Anti-patterns identificados nesta sessão

- Implementar engine inteiro sem render visual real (8-12h sem feedback loop)
- Inventar vocabulário paralelo ao standard sem benchmarking
- Adicionar features especulativas (motion tokens, 5 font slots) sem necessidade
  comprovada
- Bloquear cópia literal de tokens proven em design-references.md
- Confundir abstração arquitetural ("temos 28 roles canônicos") com value real
  pra usuário ("archetypes parecem brands distintas")

## 11. Insights soltos pra futuro

- **Sempre rodar Storybook/showcase em paralelo ao desenvolvimento de DS**.
  Storybook 10 já configurado, decorator com 3 globalTypes funciona — ferramenta
  estava lá desde Bloco 1, não foi exercitada.
- **Ecosystem compatibility > arquitetura elegante**. v0.dev + TweakCN +
  shadcn blocks + Kibo + Origin = ~50+ horas de UX gratis se falamos a mesma
  linguagem.
- **APCA + multi-tenant + mobile tokens são reais diferenciais**. Manter.
- **Builder UI ≠ engine de injeção**. TweakCN é builder; nosso é engine. São
  complementares, não substitutos.
- **22 archetypes funcionando bem** = killer feature. **22 archetypes ruins** =
  bloat.

## 12. Próximos passos imediatos

1. ✅ Doc desta sessão escrito (`docs/_sessions/2026-05-21-tweakcn-canonical-vs-invented.md`)
2. ⏭️ Showcase real (`app/showcase/page.tsx` + migration MCP + domain entry +
   server action trocar archetype + messages/pt-BR/showcase.json)
3. ⏭️ Visualizar os 22 archetypes manualmente
4. ⏭️ Decidir cenário 1/2/3
5. ⏭️ Reverter `.claude/rules/design-references.md` (regardless de cenário)
6. ⏭️ Promover esta session reflection pra ADR após decisão

---

**Referências:**

- `docs/research/28-tweakcn-evaluation.md` — pesquisa completa (~1500 palavras)
- `docs/design-system/ARCHITECTURE.md` — engine atual (será revisado pós-showcase)
- `docs/references/design-systems/*/DESIGN.md` — fonte autoritativa de tokens proven
- ADR-0043 — design system consolidado (estado atual, pode ser superseded)
- Pesquisa Opus salvou em `docs/research/28-` ao invés de `27-` porque
  `27-design-tokens-per-archetype.md` já existia — manter como está
