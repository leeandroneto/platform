# JIT vs Upfront em SaaS B2B Greenfield (Next.js + shadcn) — Founder Solo

**TL;DR**

- **JIT vence em quase tudo, com 2 exceções**: i18n e tenant copy override devem ser pelo menos **estruturados** dia 0 (não traduzidos, mas com `t('key')` no lugar de strings cruas), porque o retrofit é caro e pulveriza por todo o codebase. O resto (wrappers shadcn, typography primitives elaboradas, abstração da UI lib) é YAGNI clássico.
- **Padrão público dos boilerplates sérios (Makerkit, Supastarter)**: i18n vem ligado por default com `next-intl` e estrutura `[locale]`, mas o seletor "esconde" se só há 1 locale. Tenant copy override **não vem out-of-the-box** em nenhum dos dois — é gap real do mercado.
- **shadcn não tem `<Text>` / `<Title>` instaláveis**: a página oficial de Typography é só documentação de classes Tailwind. Logo, criar 3–5 wrappers de texto dia 0 (Heading/Body/Muted/Code) é mais "preencher gap real" do que "premature abstraction".

---

## Key Findings

1. **Wrappers shadcn**: O padrão público recomenda **zero wrappers dia 0** — só criar wrapper quando você modificaria a base ou repetir o mesmo override 3+ vezes (regra de três). Wrappers existem para proteger updates do CLI, não para "preparar futuro".
2. **Typography**: shadcn é uma anomalia — ele documenta classes mas não exporta componentes. Mantine, MUI e Tamagui têm `Text`/`Title`/`Heading`. Mínimo viável dia 0: heading + body + muted + code (4 wrappers triviais), não 12.
3. **i18n**: Estrutura multi-locale ready é barata se feita dia 0 (next-intl + `t('key')`). Retrofit é caro mas hoje é parcialmente automatizável (codemods, i18next-cli `instrument`). Para B2B brasileiro vendendo só no Brasil: pt-BR único + `t()` wrapper, sem traduzir.
4. **Tenant copy override**: Nenhum boilerplate sério entrega out-of-the-box. White-label de mercado entrega branding (logo/cor/domínio), não strings. Se você precisar disso depois, a infra de `t('key')` do i18n é o ponto de entrada natural — é o mesmo retrofit.
5. **Trocar shadcn por outra lib**: Caso público mais concreto é Coder (`coder/coder` GitHub) migrando MUI→shadcn. Estimativa do plano interno: 5,5–8 semanas para ~220 arquivos com MUI. Trocar shadcn por X é mais barato que trocar MUI por X, porque o código já é seu.
6. **JIT extremo (Pieter Levels)**: Funciona porque ele é dono do código todo, mercado dele tolera UI tosco, e ele substitui "preparar futuro" por "refatorar quando dói". Custos invisíveis: dificuldade de delegar, single-point-of-failure cognitivo.
7. **ADR como memória externa**: Padrão validado (Nygard 2011, AWS Prescriptive Guidance, Microsoft Azure WAF). Funciona MUITO bem para founder solo porque o "outro dev" do futuro é você mesmo daqui 6 meses sem contexto.

---

## Details

### 1. Wrappers shadcn dia 0

**Padrão público**: A documentação oficial do shadcn/ui e os guias de produção (Vercel Academy, GitHub Discussions #9756 / #9754) convergem em **"não wrap até precisar"**. O wrapper existe por 2 motivos: (a) preservar a capacidade de fazer `shadcn diff` / re-`add` sem perder customizações; (b) encapsular comportamento composto (ex: `ConfirmDeleteButton`). Nenhum boilerplate sério (Makerkit, Supastarter, Next.js SaaS Starter da Vercel) cria wrappers preventivos — eles usam o componente shadcn cru e só wrappam quando viram repetição.

Verbatim do guia "Shadcn UI Best Practices for 2026" (Medium / Vaibhav Gupta):

> `components/ui/` # Raw shadcn components; `components/primitives/` # Lightly modified components; `components/blocks/` # Product-level compositions.

Casos de wrapper virar código morto: não há case study formal, mas a discussão em `shadcn-ui/ui` #9756 alerta: "if you find yourself overriding almost every style on a shadcn component, step back" — sinal de que wrappers prematuros geram dívida. Retrofit forçado por ausência de wrapper acontece quando você modificou o arquivo base diretamente e o `shadcn add` posterior sobrescreve seu trabalho (essa é a única "punição" real de não ter wrapper, e é resolvida com `--diff`).

**Fonte primária**: https://ui.shadcn.com/docs (filosofia "Open Code, Composition") e https://github.com/shadcn-ui/ui/discussions/9756

**Extrapolação para founder solo**: 0 wrappers dia 0. Adicione wrapper quando: (1) você reescreveu o mesmo `className` em 3 lugares, ou (2) você precisa adicionar comportamento (loading, confirm) que não é "só estilo".

---

### 2. Typography primitives

**Não há consenso entre as libs**, e shadcn é o outlier. Comparando:

- **Mantine**: tem `Text`, `Title` (com prop `order={1..6}`), `Typography` (wrapper de prose), `Code`, `Kbd`, `Mark` — primitives separadas para escala tipográfica e semântica. Fonte: https://mantine.dev/core/text/ e https://mantine.dev/core/title/.
- **MUI**: tem `Typography` único com prop `variant="h1"|"body1"|"caption"|...` (consolidação numa só API).
- **Tamagui**: tem `Paragraph`, `H1`–`H6`, `SizableText` — primitives separadas, com tokens responsivos.
- **shadcn/ui**: **NÃO tem componente `Text` / `Title` instalável via CLI**. A página oficial (https://ui.shadcn.com/docs/components/typography) declara verbatim: _"We do not ship any typography styles by default. This page is an example of how you can use utility classes to style your text."_ Só mostra snippets de `<h1 className="...">` para copy-paste manual.

**Confirmação na issue oficial**: https://github.com/shadcn-ui/ui/discussions/1527 — usuários reclamam que "it doesn't look like the typography components work the same as the others (I only see the examples)".

**Mínimo viável dia 0 (extrapolação)**: como shadcn não entrega, criar 4 wrappers triviais é defensável (não é premature abstraction — é preencher gap):

1. `<Heading level={1..4}>` (um componente, prop `level`)
2. `<Text>` (body padrão, `text-base leading-7`)
3. `<Muted>` (`text-sm text-muted-foreground`)
4. `<Code>` (inline `bg-muted px-1 rounded`)

Pode-se até dispensar e usar classes Tailwind direto — é defensável. Mas se você for fazer 10+ páginas no primeiro mês, esses 4 componentes pagam o custo em <1h de implementação.

---

### 3. i18n locales

**Padrão público**: Os dois boilerplates mais usados para SaaS B2B com Next.js+shadcn entregam **multi-locale ready out-of-the-box, mas escondem o seletor quando há só 1 locale**:

- **Makerkit (next-supabase-turbo)**: usa `next-intl`, rota `[locale]`, e oficialmente: _"If only one locale is registered in `packages/i18n/src/locales.tsx`, the selector is hidden automatically."_ (https://makerkit.dev/docs/next-supabase-turbo/translations/language-selector). Translations em `apps/web/i18n/messages/{locale}/`.
- **Supastarter**: usa `next-intl` com flag `i18n.enabled` — pode ligar/desligar via config. Verbatim das docs: _"If you don't want to use internationalization or only want to activate it later on, you can disable it by setting the i18n.enabled flag to false in the config/index.ts file."_ (https://supastarter.dev/docs/nextjs/internationalization)

Ou seja: **o consenso de mercado em SaaS Next.js sério não é "locale único hardcoded" e nem "traduzir tudo dia 0" — é estrutura multi-locale com 1 locale ativo**.

**Custo real de adicionar en-US depois de pt-BR começado sem `t()`**: Múltiplas fontes (Locize, SimpleLocalize, Sandvox) afirmam que retrofit é "significantly more expensive than building it in from the start". O custo concreto é proporcional ao número de strings hardcoded — em um SaaS B2B de 6 meses de dev, são tipicamente milhares de strings espalhadas em JSX. Ferramentas modernas (i18next-cli `instrument`, Codemod) automatizam ~80% do trabalho, mas restam: revisar contexto, separar strings de UI de strings técnicas, pluralization, interpolação. Estimativa realista para um SaaS Next.js de tamanho médio: **2–4 semanas de retrofit** (vs ~1 dia se estruturado dia 0).

**Recomendação para SaaS B2B brasileiro greenfield**: pt-BR único + next-intl com 1 locale + `t('key')` em tudo desde o commit 1. Não é over-engineering — é o padrão Makerkit/Supastarter. Adicionar en-US depois é editar 1 JSON.

---

### 4. Tenant copy override

**Sinais de mercado**: White-label B2B em 2026 (Memberstack, Topol, ABP Framework, FAB Builder, Spree) entrega de forma consistente: branding visual (logo, cores, fonte, subdomínio, email-from). Quase ninguém entrega **strings/labels override por tenant** out-of-the-box. Topol confirma: _"White labeling typically covers visual branding, language, and UI defaults... colors, typography defaults, logos, and UI labels"_ — mas "labels" aqui é configuração de tema, não override de cada string.

**Makerkit/Supastarter**: Nenhum dos dois tem mecanismo "tenant.copy.dashboard_title" out-of-the-box. Customização per-tenant cobre branding (logo/cores). No Supastarter, "White-label potential" aparece apenas no tier "Agencies" ($1,499) e ainda assim sem mecanismo de override de strings documentado.

**Custo real de retrofit**: Se você usa `t('dashboard.title')` desde o dia 0, retrofit de tenant override é **trivial**: você muda o `getTranslations()` para receber `tenantId` e fazer merge de `tenant_overrides[key]` sobre `default_locale[key]`. É search/replace zero — é só interceptar o resolver. Se você tem strings hardcoded, o retrofit vira o mesmo problema do i18n + lógica de override (caro).

**Conclusão**: A infra de i18n com `t('key')` é o veículo natural para tenant copy override. Quem fez i18n dia 0 já tem tenant override "grátis" depois (só falta a UI de edição). Quem não fez paga 2x.

---

### 5. Abstrair shadcn (trocar UI lib)

**Caso público concreto**: `coder/coder` migrando MUI→shadcn (GitHub issue #18993, criado em 22-Jul-2025). Métricas reais do codebase: 1.077 arquivos TS/React, 220 arquivos com MUI (20%), 189 com Emotion CSS (18%), 546 imports MUI em 61 componentes únicos. **Estimativa interna: 5,5–8 semanas** divididas em 4 fases (foundation 1–2d, core components 12–18d, styling system 13–17d, QA 3–5d).

Ressalva crítica: o issue foi gerado por bot (`blink-so[bot]`) com auto-análise — não validado por engenheiros humanos da equipe. Não há PRs vinculados ao épico mencionado, e o issue está closed sem rastro de implementação completa. Os números servem como **ordem de grandeza**, não como evidência de execução.

Estimativas independentes do BetterLink Blog (eastondev.com, Mar/2026) com dados de projeto real: _"migrating a medium-sized app from MUI to shadcn/ui, I saw the bundle size drop from 1.2MB to around 600KB"_ — confirma a faixa de queda de bundle ~40–50% com datapoint concreto. Janela de migração: 1–2 semanas (small), 2–4 semanas (medium), 4–8 semanas (large).

**Trocar shadcn por outra lib**: trivialmente mais barato, porque o código já está no seu repo. Você não está "removendo dependência" — você está reescrevendo componentes que já são seus, com a vantagem de manter Tailwind + Radix por baixo se quiser.

**Trade-off YAGNI (Martin Fowler) vs "preparar pra futuro" para founder solo**: Fowler é explícito (https://martinfowler.com/bliki/Yagni.html) — abstração "para o caso de" tem 3 custos (build, delay, carry) e 1 fonte de erro (você pode ter modelado errado o futuro). Para founder solo greenfield, o trade-off pende fortemente para YAGNI: você não tem capital de tempo para construir abstrações especulativas, E você tem total liberdade para refatorar depois (não há equipe coordenada, não há contrato de API). A "regra de três" (refatorar só na 3ª repetição) é o operacionalizador prático.

---

### Tema transversal: JIT vs Upfront

**Pesquisa empírica ROI**: Não há estudo formal "JIT vs upfront para solo founder" especificamente. As fontes mais próximas:

- **CB Insights** (relatório atualizado 2024, analisando 431 empresas VC-backed encerradas desde 2023): **43% citaram product-market fit ruim como causa raiz** (sobe ligeiramente dos 42% nos ~110 post-mortems do estudo 2014–2021). Verbatim: _"Capital running out is where these stories end. The more telling causes — poor product-market fit (43%), bad timing (29%), and unsustainable unit economics (19%) — reveal why the capital dried up in the first place."_ Sintoma direto de over-engineering antes de validar.
- **MIT Sloan / Lean MVP 2026**: startups com monolito escalaram 50% mais rápido até 10k usuários vs microservices prematuro. Validação direta do princípio JIT no nível de arquitetura.
- **Startup Genome** (não First Round Capital, como vi propagado erroneamente): _"Startups that pivot at least once raise 2.5 times more capital and achieve 3.6 times better user growth than those that never adapt their core model."_ O 2,5x é sobre **capital captado** e o 3,6x sobre **crescimento de usuários** — pivot é incompatível com upfront.

**Casos JIT extremo (Pieter Levels)**: Nomad List sozinho atingiu **$5,3M em receita em 2024** (vs $704,2K em 2023), segundo o perfil público do GetLatka com dados fornecidos pelo próprio Levels. Portfolio completo (incluindo Photo AI, que em Nov/2025 gera $138K/mês e representa 70% da renda) coloca o total em mais de **$250K/mês**. Fontes: getlatka.com/companies/nomad-list e nomadicblueprint.com/case-studies/pieter-levels. Custos invisíveis documentados nas próprias entrevistas:

- **Não delegável**: ele mesmo diz "every employee makes your company slower" — não é evidência contra escala, é evidência de que o stack-tosco-mas-conhecido funciona quando você é o ÚNICO dev.
- **Difícil dar manutenção sem o contexto dele**: index.php monolítico funciona porque ele lê o arquivo todo. Outro dev não conseguiria.
- **Dificulta refactor profundo**: refatorar de PHP/jQuery para algo moderno seria rewrite total, não migração incremental.

**Lição para founder solo Next.js+shadcn**: JIT é "não construir abstração", não "usar tecnologia ruim". Next.js+shadcn já são escolhas que dão velocidade — JIT aqui significa não inventar wrappers/abstrações em cima, não voltar para PHP.

**ADR como memória externa**: Validado e amplamente recomendado. Fontes primárias:

- **Michael Nygard**, "Documenting Architecture Decisions" — Cognitect blog, 15 de novembro de 2011 (https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions). Origem do padrão. Verbatim: _"We will keep ADRs in the project repository under doc/arch/adr-NNN.md."_
- **AWS Prescriptive Guidance**: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/
- **Microsoft Azure Well-Architected Framework** recomenda ADRs como padrão para o papel de arquiteto.

Para founder solo com IA-assist (Claude/Cursor), ADR é especialmente potente: você documenta uma decisão JIT ("usando pt-BR único por agora, retrofit com next-intl quando primeiro cliente pedir EN"), e seis meses depois você (ou o agente IA) tem o contexto exato para reverter sem repensar do zero. Padrão emergente: agente IA cria ADR automaticamente quando você toma decisão arquitetural significativa (adolfi.dev/blog/ai-generated-adr/).

**Funciona na prática para JIT?** Sim, com 1 condição: o ADR precisa registrar **a condição de gatilho para revisitar a decisão**, não só "fizemos X". Ex: _"Decisão: pt-BR único. Revisitar quando: primeiro cliente pagante pedir EN, OU MRR > X."_ Sem gatilho, ADR vira documentação morta.

---

## Recommendations (decisão imediata, founder solo)

**Dia 0 — fazer agora**:

1. **Estrutura i18n com next-intl, 1 locale (pt-BR), `t('key')` em tudo**. Custo: ~1 dia. Replica padrão Makerkit/Supastarter. Isso resolve sozinho 80% do problema de tenant copy override depois.
2. **4 wrappers de typography** (`Heading`, `Text`, `Muted`, `Code`) — porque shadcn não entrega e você vai usar em toda página. Custo: <1h.
3. **ADR template em `docs/adr/`** com 3 entradas iniciais: "pt-BR único", "sem wrappers shadcn dia 0", "stack Next+shadcn vs alternativas". Cada uma com **condição de revisitar**. Custo: 2h. Use o formato Nygard original (Context / Decision / Status / Consequences).

**Dia 0 — NÃO fazer**:

1. **Não criar wrappers shadcn preventivos** (`<AppButton>` envolvendo `<Button>`). Wrapper só quando você modificar a base ou repetir override 3x.
2. **Não traduzir nada** (pt-BR é o conteúdo, não há "fonte de verdade em chave separada de string").
3. **Não criar mecanismo de tenant copy override**. Sua infra de `t('key')` já é a porta de entrada — adicione `tenantId` no resolver quando primeiro cliente pedir.
4. **Não abstrair shadcn** atrás de uma camada "AppUI". Custo de manutenção real, benefício especulativo.

**Thresholds para revisitar (gatilhos JIT→upfront)**:

- Primeiro cliente pagante estrangeiro → adicionar en-US (editar JSON, ~1 dia).
- Mesma customização visual em 3 tenants diferentes → criar mecanismo de tenant override (interceptar `t()`, ~3 dias).
- Mesmo `className` em 3 botões diferentes → wrapper. Não antes.
- 3 meses sem reabrir um arquivo da `components/ui/` → você pode fazer `shadcn update` sem medo (sinal de baixa modificação).

---

## Caveats

- A maioria dos artigos sobre "wrappers shadcn em produção" é de 2026 (blogs como spectrumhq, shadcnspace, stow.build) e tem tom prescritivo sem dados quantitativos. Tratei como consenso, mas não como evidência empírica.
- Issue Coder #18993 tem números atrativos mas foi gerada por bot e está closed sem PRs visíveis — use como ordem de grandeza, não como case de execução real.
- Não há estudo acadêmico formal "JIT vs upfront em SaaS solo founder" com N grande. Toda a base é (a) princípios gerais (YAGNI / Fowler), (b) anedotas de indie hackers (Levels), (c) padrões de boilerplate (Makerkit / Supastarter), (d) estudos macro (CB Insights, MIT Sloan, Startup Genome). Sugiro tratar como heurística forte, não lei.
- O 2,5x de pivot vem de **Startup Genome**, não de First Round Capital — fonte frequentemente citada de forma incorreta na internet.
- "Tenant copy override" é gap real de mercado em boilerplates Next.js — há espaço de produto aí, mas também risco de você construir antes de demanda.
- Recomendações assumem: founder solo, B2B, pt-BR único agora, white-label como hipótese de futuro próximo, Next.js+shadcn já decidido. Mude qualquer uma dessas premissas e algumas recomendações invertem (ex: se você tiver co-founder + dev sênior, faz sentido criar mais infra dia 0 porque o custo de coordenação cresce).
