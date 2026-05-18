# Design System Foundation — onboarding.bio

> Decisões fechadas de UI, UX, navegação, componentes, motion, mobile e padrões por superfície.
> Referenciado por `docs/plano/PLANO_LANCAMENTO.md` e por `docs/core/decisions.md` (D60-D69 e adições).
> **Regra:** este documento é a fonte única de verdade visual. Decisão fora daqui = nova entrada explícita aqui antes de codar.
> **Última atualização:** 2026-04-29.

---

## Como ler este documento

Quatro tipos de seção, com ícones diferentes:

- **§ Princípio** — filosofia que rege decisões. Não é regra mecânica.
- **§ Padrão** — decisão fechada com justificativa. Vai pro código.
- **§ Por superfície** — aplicação dos padrões em cada produto (dashboard, formulário, relatório, etc.).
- **§ Anti-padrão** — coisas explicitamente proibidas, com motivo.

Termos técnicos que aparecem (e que você pediu pra explicar):

- **Container-first**: começar layout pelo container que constrange o conteúdo, não pelos elementos soltos
- **Visual anchor**: elemento de alto peso visual que ancora a atenção (ex: número grande de KPI)
- **Progressive disclosure**: revelar complexidade em camadas, não tudo de uma vez
- **Agrupamento semântico**: juntar visualmente o que é relacionado, separar o que não é
- **Zona de interação**: parte da tela onde o usuário toca/clica
- **Visualização vs ação**: separar o que serve pra ler do que serve pra fazer
- **Regra do polegar (thumb zone)**: área alcançável com 1 polegar segurando o celular
- **Nested drawer**: drawer dentro de drawer (overlay sobre overlay)
- **Container query**: CSS que reage ao tamanho do container, não da tela
- **F-pattern / Z-pattern**: padrões de varredura visual em telas ocidentais
- **Information scent**: pista visual que indica onde está a próxima informação relevante
- **Above the fold**: o que cabe sem rolar
- **Visual weight**: quanto um elemento "puxa" o olho
- **Affordance**: pista visual de que algo é interativo

---

# Parte 1 — Filosofia e princípios

## §1.1 Princípio: Linear-grade, não Apple-grade

Linear é a referência porque resolve o mesmo problema que `onboarding.bio` resolve: produto multi-superfície (web + mobile), denso de informação, multi-tenant em alguma medida, que precisa parecer premium sem ser caro de manter.

Não copiamos Apple HIG porque:

- Estamos na web, não em iOS nativo
- HIG não escala pra Android (e o PWA do cliente vai rodar em Android)
- HIG patterns na web parecem "tentando ser app" e ficam estranhos

Não copiamos Material 3 porque:

- Pesado visualmente (FAB grande, ripples, elevation excessivo)
- Cara de Google, não de produto premium
- Não combina com a clientela brasileira de profissionais autônomos

A síntese: **Linear como esqueleto + momentos calorosos pontuais** (celebração de conquista do cliente, hero do site público, marketing). O esqueleto é frio e técnico; as folhas são quentes.

## §1.2 Princípio: Container-first

Toda tela começa pela definição do container, não pelos elementos.

Errado: "vou colocar um botão aqui, um card ali, um título lá em cima."
Certo: "qual é o container desta tela? Quanto width máximo? Quanto padding? Quantas colunas? Onde estão as zonas de visualização vs ação?"

Container resolve 80% das decisões antes de você começar a colocar elementos. Sem isso, cada tela vira improviso.

## §1.3 Princípio: Densidade controlada

Mais elementos por tela ≠ mais valor. Densidade é decisão consciente, não default.

Em um produto pra profissional autônomo brasileiro, **densidade controlada vence densidade alta**. O usuário não é power user de planilha como na Linear. Ele é PT entre treinos, abrindo o app no Uber, decidindo se mensageia o aluno X ou não.

Regra de bolso: **5-9 elementos primários por viewport**. Mais que isso, agrupa ou esconde via progressive disclosure.

## §1.4 Princípio: Cores fixas no produto, customização nas pontas

A cor de marca da `onboarding.bio` (teal escuro, definida em §3.1) é fixa em **todo lugar onde o profissional está trabalhando**: dashboard, settings, criar desafio, ver alunos.

A cor escolhida pelo profissional vaza **só nas superfícies públicas que carregam a marca dele**: site público, formulário público, relatório, link page (página de links), diagnóstico.

Isso é o ponto que confunde 95% dos SaaS multi-tenant. Trave desde o dia 1.

## §1.5 Princípio: Agrupamento semântico antes de decoração

Antes de decidir cor, sombra, borda — decida **o que é relacionado a quê**.

Se três métricas são da mesma turma de desafio, elas ficam juntas, no mesmo card. Se uma é de turma e outra é de receita, separa. Whitespace + agrupamento físico fazem 70% do trabalho de hierarquia. Cor e borda fazem o resto.

Sem agrupamento semântico, você cai no "data eyeball attack": muita informação tecnicamente correta, visualmente caótica.

## §1.6 Princípio: Visualização e ação são zonas diferentes

Em qualquer tela, separe **a zona de leitura** (cards, métricas, gráficos, texto) da **zona de ação** (botões, formulários, controles).

Misturar significa: usuário tenta ler e clica sem querer; usuário tenta agir e fica caçando o botão; touch targets se atropelam.

Aplicação prática:

- Lista de alunos: cards são leitura, botão "+" no topo direito é ação
- Detalhe de desafio: leitura ocupa 70% da tela, ações ficam em barra sticky topo (desktop) ou sticky footer (mobile)
- Formulário: campos são ação, helper text é leitura — sempre separados verticalmente

## §1.7 Princípio: Progressive disclosure por padrão

Mostre o resumo. Esconda o detalhe. Deixe o usuário pedir mais quando quiser.

Aplicação concreta no `onboarding.bio`:

- Dashboard mostra 4 KPIs grandes + 3 alunos em risco. Detalhe de aluno é click-through, não inline.
- Card de desafio mostra título, status, progresso, ação primária. Editar componentes do desafio = entrar em outra tela.
- Card de aluno mostra nome, foto, status, última interação. Histórico completo = drawer.
- Configurações: divididas em seções colapsadas. Avançado escondido atrás de "Mostrar avançado".

Shneiderman's Mantra: **Overview first, zoom and filter, then details on demand.**

## §1.8 Princípio: Tom de voz consistente com o stack

Já está em D6. Reforço aqui: tom Vercel/Linear/Supabase. Direto, técnico, sem emoji em UI, sem "máquina de vendas". Microcopy curta. Erros explicam o problema e o que fazer, não pedem desculpa.

---

# Parte 2 — Tipografia

## §2.1 Padrão: Geist Sans + Geist Mono

**Geist Sans** para UI. **Geist Mono** para números, IDs, datas técnicas, códigos. Inter como fallback.

Por quê (resumo): Geist é "Inter polido pela Vercel", legível como Inter mas com personalidade própria. Inter virou commodity (60% dos SaaS usam). Geist diferencia sem ser exótico.

Setup: pacote `geist` no npm, zero config no Next.js. Variable font, suporta todos os pesos.

## §2.2 Padrão: Hierarquia de 9 níveis

```
Display (hero landing público)   48px / 1.05 / -0.02em / 600
H1 (page title)                  28px / 1.15 / -0.01em / 600
H2 (section title)               20px / 1.20 / -0.01em / 600
H3 (card title)                  16px / 1.30 /  0      / 600
Body large (intro de relatório)  16px / 1.55 /  0      / 400
Body (default)                   14px / 1.55 /  0      / 400
Body small (helper, captions)    13px / 1.50 /  0.005em/ 400
Label (eyebrow, badges)          11px / 1.20 /  0.04em / 500 / uppercase
Mono (números)                   14px / 1.30 /  0      / 500 / Geist Mono + tnum
```

**Letter-spacing inverso ao tamanho.** Texto grande tem tracking negativo (parece compacto), texto pequeno tem tracking positivo (respira). É o "truque Apple" — metade do "porquê parece premium".

## §2.3 Padrão: Tabular numbers em tudo que é número

Sempre que houver número em UI (peso, R$, %, contagem, data, ID), usar `font-feature-settings: "tnum"` ou Geist Mono. Sem isso, "R$ 1.234" e "R$ 5.678" desalinham em tabela e o produto parece amador.

## §2.4 Padrão: Componente, não classe utilitária

Usar `<Heading level={1}>` e `<Text variant="body">`, não `text-2xl font-semibold`.

Por quê:

- Força tag semântica correta (`h1`–`h6`, `p`)
- Acessibilidade não-negociável
- Trocar tipografia globalmente = mudar componente, não search-replace
- Lint pode proibir uso direto das classes

Já está em D62. Reforço aqui pra fechar o sistema.

## §2.5 Padrão: Linha entre 50-75 caracteres em texto longo

Para body de relatório, descrição de desafio, ajuda contextual. Linha mais curta = olho pula muito. Linha mais longa = olho perde a próxima linha.

CSS: `max-width: 65ch` para containers de texto longo. Sem isso, texto em desktop estica até 1200px e ninguém lê.

## §2.6 Padrão: Tipografia adapta ao mode

Em dark mode, body weight 400 fica frágil. Use **400 com tracking +0.005em** ou **450** se variable font permitir. Em light mode, 400 normal funciona.

## §2.7 Para o profissional escolher (superfícies públicas)

3 vibes tipográficas, não fontes individuais:

- **Moderna** (default): Geist Sans em tudo
- **Editorial**: Fraunces (serif) nos títulos + Geist Sans no body
- **Esportiva**: Space Grotesk nos títulos + Geist Sans no body

Limita escolha = qualidade preservada. Sem opção "Monoton" ou "Lobster" — vira amador instantaneamente.

---

# Parte 3 — Cores

## §3.1 Padrão: Brand do produto

```css
--ob-brand: oklch(62% 0.13 175); /* teal escuro, ~ #0F8C82 */
--ob-brand-hover: oklch(56% 0.13 175);
--ob-brand-fg: oklch(98% 0.01 175); /* texto sobre brand */
--ob-brand-subtle: oklch(95% 0.02 175); /* fill sutil de área brand */
```

Por que teal escuro:

- Roxo é território Linear/Anthropic — confunde
- Preto é Vercel/Stripe — confunde
- Verde puro é Whoop/saúde tradicional — bom mas batido
- Laranja é Strava — energético mas cansa em UI densa
- **Teal escuro** = saúde + tecnologia + calma profissional. Território limpo.

Alternativa válida: azul-petróleo `oklch(58% 0.10 230)` se teal não convencer no teste real.

## §3.2 Padrão: Escala 12 steps em OKLCH

Cada paleta tem 12 steps (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000) em OKLCH. Lightness aumenta linearmente, chroma faz parábola (baixo nas pontas, alto no meio).

```css
--ob-brand-50: oklch(98% 0.01 175);
--ob-brand-100: oklch(95% 0.02 175);
--ob-brand-200: oklch(90% 0.05 175);
--ob-brand-300: oklch(82% 0.09 175);
--ob-brand-400: oklch(73% 0.12 175);
--ob-brand-500: oklch(62% 0.13 175); /* brand principal */
--ob-brand-600: oklch(54% 0.13 175);
--ob-brand-700: oklch(45% 0.11 175);
--ob-brand-800: oklch(36% 0.09 175);
--ob-brand-900: oklch(28% 0.07 175);
--ob-brand-950: oklch(18% 0.05 175);
```

Mesmo pattern para neutrals (`--ob-gray-*`), semantics, e cor escolhida pelo profissional.

## §3.3 Padrão: Neutrals com viés warm

Tailwind `stone` é OK, mas eu definiria custom com viés ainda mais neutro pra cinza não puxar pro azul (cool) que dá sensação corporativa fria.

```css
--ob-gray-50:  oklch(98% 0.003 80);
--ob-gray-100: oklch(96% 0.005 80);
...
--ob-gray-950: oklch(15% 0.005 80);
```

Hue 80 é amarelado-marrom muito sutil. Funciona como "neutro humano".

## §3.4 Padrão: Semantics fixas, nunca personalizadas

```css
--ob-success: oklch(60% 0.14 145); /* green */
--ob-warning: oklch(75% 0.15 75); /* amber */
--ob-danger: oklch(58% 0.2 25); /* red */
--ob-info: oklch(60% 0.14 235); /* blue */
```

Cada uma com escala 12 steps. **Profissional não personaliza essas cores.** Vermelho de erro do profissional A não pode ser verde do profissional B — vira inseguro.

## §3.5 Padrão: 60-30-10

Em qualquer tela:

- **60%** background neutro (gray-50 light / gray-950 dark)
- **30%** surface secundária + gray-100/900 + texto
- **10%** brand color em CTAs e indicadores

Brand color **nunca** deve ocupar mais que ~10% da tela. Ver Linear pós-refresh 2026 (eles reduziram cor ainda mais). Excesso de cor = barata percepção.

## §3.6 Padrão: APCA pra validação de contraste

Já está em D61. Reforço pontos práticos:

- Texto body precisa de Lc ≥ 60 contra background
- Texto pequeno (label, caption) precisa de Lc ≥ 75
- UI components (border de input, ícone) precisa de Lc ≥ 45
- Função `pickReadableForeground(brand)` retorna preto/branco automaticamente
- Cor escolhida pelo profissional passa por validação **antes** de salvar; se falha, sugere a cor mais próxima válida

Lib: `apca-w3` ou `culori` que tem APCA built-in.

## §3.7 Para o profissional escolher (superfícies públicas)

Profissional escolhe **6 estilos curados** já definidos em D65:

- Energia, Clínico, Raiz, Revista, Noturno, Impacto

Cada estilo é pacote: cor primária + tipografia + shape + densidade + mood de imagem. Profissional faz **1 decisão** (estilo), depois pode trocar a cor de marca dentro de limites validados por APCA.

Profissional **não escolhe**:

- Cor secundária (deriva da primária via `oklch` rotation)
- Cor de erro/sucesso (semantics fixas)
- Radius, density, shadow strength (vêm do estilo)
- Fonte solta (escolhe entre 3 vibes, ver §2.7)

Limita escolha = qualidade preservada. É o que evita o "Wix problem".

## §3.8 Padrão: Dark mode é mandatório, não opcional

Tanto no app interno quanto nas superfícies públicas. Profissional escolhe se site dele é light/dark/auto. App interno tem light/dark/system.

Dark mode bem feito **não** é "inverter cores". Tem mood próprio:

- Backgrounds não são pretos puros — `oklch(15% 0.005 80)` (warm dark)
- Cores brand ficam ligeiramente mais claras/menos saturadas (chroma -0.02)
- Borders são `oklch(25% 0.005 80)` (sutis, nunca brancas)
- Sombras são quase invisíveis — use border ao invés

---

# Parte 4 — Shape, density e spacing

## §4.1 Padrão: Radius 10px default

`--radius-md: 10px` é o default. Linear usa 6-8px, Stripe 8px, Notion 6px, Vercel 8-12px. **Você usa 10px** — diferencia sem ser bizarro.

Escala completa:

```css
--radius-xs: 4px; /* badges, pills pequenos */
--radius-sm: 6px; /* inputs, buttons pequenos */
--radius-md: 10px; /* default — buttons, cards, inputs */
--radius-lg: 14px; /* cards grandes, sheets */
--radius-xl: 20px; /* hero cards, mobile sheet handle */
--radius-full: 9999px; /* pills, avatares */
```

App interno fixo em `rounded` (default acima). Site público pode usar `sharp` (radius / 2) ou `soft` (radius x 1.6) via `data-shape`.

## §4.2 Padrão: Density cozy default

3 níveis cravados:

```css
/* tight — Linear power user, desktop denso */
[data-density='tight'] {
  --pad-y: 8px;
  --pad-x: 12px;
  --row-y: 10px;
  --gap: 8px;
}
/* cozy — DEFAULT */
[data-density='cozy'] {
  --pad-y: 12px;
  --pad-x: 16px;
  --row-y: 14px;
  --gap: 12px;
}
/* roomy — mobile, formulário público */
[data-density='roomy'] {
  --pad-y: 16px;
  --pad-x: 20px;
  --row-y: 18px;
  --gap: 16px;
}
```

**Mobile sempre cozy ou roomy**, nunca tight (touch target perde). Desktop default cozy, profissional pode optar por tight em settings.

## §4.3 Padrão: Spacing scale 4px base

Tailwind v4 default. Use `--spacing: 0.25rem` (4px) como base. Tudo é múltiplo: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.

**Não use 5, 7, 11, 13, 15.** Quebra o ritmo visual. Se você sente que precisa de 15px, use 16 ou 12.

## §4.4 Padrão: Shadow scale enxuta

Linear pós-refresh 2026 reduziu sombras drasticamente. Adote o mesmo:

```css
--shadow-xs: 0 1px 0 rgba(0, 0, 0, 0.04); /* divider sutil */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05); /* card flat */
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08); /* card hover, popover */
--shadow-lg: 0 12px 32px rgba(0, 0, 0, 0.12); /* dialog, sheet */
--shadow-focus: 0 0 0 3px var(--ob-brand-200); /* focus ring */
```

**Em dark mode, sombras são quase invisíveis.** Use border `--ob-gray-800` ao invés. Sombra preta sobre fundo escuro não funciona.

---

# Parte 5 — Componentes (cravado por categoria)

## §5.1 Botões

### Tipos cravados

Cada tipo é componente próprio, não variant de Button. Isso evita que devs tentem fazer "Button com isLink isLoading isDanger isIcon" e crie uma API monstro.

| Componente               | Quando usar                                 | Exemplo                               |
| ------------------------ | ------------------------------------------- | ------------------------------------- |
| `<Button>`               | Ação primária ou secundária com label       | "Salvar", "Cancelar", "Criar desafio" |
| `<IconButton>`           | Ação com ícone só (aria-label obrigatório)  | Fechar, mais opções, voltar           |
| `<LinkButton>`           | Visual de botão, comportamento de link      | "Ver todos os alunos →"               |
| `<AsyncActionButton>`    | Botão com loading/success/error gerenciado  | Submit de form, ação que chama API    |
| `<CopyButton>`           | Copiar valor pra clipboard com feedback     | Copiar slug, copiar link de convite   |
| `<DangerAction>`         | Ação destrutiva com confirmação obrigatória | Excluir aluno, cancelar desafio       |
| `<FloatingActionButton>` | FAB mobile pra ação primária da tela        | "+ Novo aluno" no mobile              |
| `<StickyActionBar>`      | Container de ações sticky no rodapé mobile  | Wizard mobile, edição de form longo   |

### Variants cravadas

Por componente, máximo 4 variants:

- `primary` — brand color, usar 1 por viewport
- `secondary` — neutral, usar pra ações importantes não-primárias
- `ghost` — sem borda, usar pra ações terciárias / dentro de tabela
- `danger` — vermelho, usar só pra destrutivo

### Sizes cravadas

3 sizes:

- `sm` — 28px altura, dentro de tabela/list
- `md` — 36px altura, default
- `lg` — 44px altura, mobile primário, hero CTA

### Estados obrigatórios

Todo botão renderiza:

- default
- hover (background +5% lightness OKLCH)
- active (scale 0.98)
- focus-visible (ring 3px brand-200)
- disabled (opacity 0.5, cursor not-allowed)
- loading (spinner + label oculto, mantém width)
- success (checkmark animado por 1.5s, aplicável só em AsyncActionButton)

### Anti-padrões em botão

- ❌ `<button>` direto fora de components/ui (ESLint trava)
- ❌ Link com classe `rounded px-4 py-2 bg-...` (use LinkButton)
- ❌ IconButton sem aria-label (TypeScript trava)
- ❌ 2 botões primary na mesma viewport (regra de PR review)
- ❌ Botão com 4+ words ("Clique aqui para salvar suas alterações") — máximo 2-3 words

## §5.2 Inputs e formulários

### Hierarquia

```
<FormSection>           // agrupa fields relacionados, opcional título
  <FieldGroup>          // 1-N fields que ocupam mesma linha em desktop
    <Field>             // label + input + helper + error (1 unidade)
      <Label>
      <InputWrapper>    // input visualmente, pode ter prefix/suffix
        <Input> | <Select> | <Textarea> | <Combobox> | etc
      </InputWrapper>
      <Helper> | <Error>
    </Field>
  </FieldGroup>
</FormSection>
<FormActions>           // sticky bar com Cancel/Save no mobile
```

### Componentes de input cravados

| Componente           | Para quê                                                         |
| -------------------- | ---------------------------------------------------------------- |
| `<Input>`            | Texto livre, número, email, tel, url, etc. (type passa pra HTML) |
| `<Textarea>`         | Texto longo, autosize por default (min 3 rows, max 12)           |
| `<Select>`           | 2-7 opções fixas, dropdown nativo                                |
| `<Combobox>`         | 8+ opções, com busca, async loading, multi opcional              |
| `<RadioGroup>`       | 2-5 opções mutuamente exclusivas, sempre visíveis                |
| `<CheckboxGroup>`    | Múltiplas seleções, sempre visíveis                              |
| `<Switch>`           | Toggle binário on/off, ação imediata (sem submit)                |
| `<DatePicker>`       | Data única, com `inputmode="numeric"` no mobile                  |
| `<DateRangePicker>`  | Range, com presets ("últimos 7 dias", etc.)                      |
| `<FileUpload>`       | Upload de imagem/doc, com drag-drop desktop                      |
| `<Slider>`           | Valor em range contínuo, mostrar valor atual sempre              |
| `<SegmentedControl>` | 2-4 opções curtas, alterna visualização (não submit)             |

### Padrões obrigatórios em form

- **`inputmode` sempre que aplicável**: numeric, decimal, tel, email, url, search
- **`autocomplete` correto**: name, email, tel, given-name, family-name, postal-code, etc
- **Font-size mínimo 16px** em inputs no mobile (senão iOS dá zoom)
- **Label sempre visível** (placeholder não substitui label)
- **Erro inline, abaixo do field**, em cor `--ob-danger`, com ícone à esquerda
- **Helper text antes do erro** desaparece quando erro aparece
- **Validação on blur**, não on change (não mostra "email inválido" enquanto digita)
- **Submit desabilitado se form `dirty=false`** ou `isValid=false`
- **Botão "Salvar" no rodapé com sticky bar no mobile**, não no topo
- **Unsaved changes** detecta dirty + intercepta navegação com AlertDialog

### Anti-padrões em form

- ❌ Placeholder como label
- ❌ "Limpar formulário" como botão visível (só em filtros)
- ❌ Validação on change com erro vermelho enquanto digita
- ❌ Botão "Submit" sem label específico (use "Salvar", "Criar", "Publicar")
- ❌ Form em modal sem sticky footer no mobile
- ❌ Mais de 7 fields visíveis no mobile sem agrupamento

## §5.3 Cards e surfaces

### Hierarquia

3 tipos de superfície, cada um com função clara:

| Surface            | Background | Border         | Shadow          | Quando usar                    |
| ------------------ | ---------- | -------------- | --------------- | ------------------------------ |
| `<Surface>` (base) | gray-50    | none           | none            | Background da tela             |
| `<Card>`           | white      | gray-200 0.5px | shadow-sm       | Agrupar conteúdo relacionado   |
| `<Panel>`          | gray-100   | none           | none            | Sub-agrupamento dentro de card |
| `<Tile>`           | white      | gray-200 0.5px | shadow-md hover | Card clicável que abre detalhe |

### Anatomia do Card

```
┌────────────────────────┐
│ Header                 │  título + ações (opcional)
│ ─────────────────────── │  divider sutil (opcional)
│ Body                   │  conteúdo principal
│                        │
│ Footer                 │  metadata + ação secundária (opcional)
└────────────────────────┘
```

Card sempre tem **padding interno consistente** (`var(--pad-y) var(--pad-x)`). Header e Footer têm padding-y reduzido. Divider entre seções é `border-top: 0.5px solid gray-200` sem margin extra.

### Anti-padrões em card

- ❌ Card envolvendo a tela inteira no mobile (anti-padrão clássico)
- ❌ Card dentro de card dentro de card (acabou de inventar a Russian doll UI)
- ❌ Card com background colorido (a cor é semantic ou brand, nunca decorativa)
- ❌ Card com shadow grande sem motivo (use shadow-sm ou nada)
- ❌ Card sem padding (tudo encostado na borda)

## §5.4 Listas, tabelas e data display

### Decisão: lista vs tabela vs card grid

Escolha por tipo de conteúdo, não por preferência:

| Conteúdo                            | Desktop            | Mobile                    |
| ----------------------------------- | ------------------ | ------------------------- |
| Pessoas (alunos, leads)             | List item          | List item                 |
| Métricas com 5+ colunas comparáveis | DataTable          | List item com agrupamento |
| Itens visuais (templates, imagens)  | Card grid 2-4 cols | Card grid 1-2 cols        |
| Logs / timeline                     | Timeline vertical  | Timeline vertical         |
| Ações pendentes (alunos em risco)   | List item          | List item                 |

### Padrão: DataTable só em desktop

Tabela com colunas comparáveis funciona bem em desktop. **Em mobile, vire lista.** Não tente fazer tabela responsiva — sempre fica ruim. Pegue as 2-3 colunas mais importantes e renderize como list item com hierarquia visual.

### Padrão: List item

```
┌──────────────────────────────────────────┐
│ [avatar]  Nome do item              [→]  │
│           Subtitle ou metadata           │
│           Status badge                   │
└──────────────────────────────────────────┘
```

Sempre clicável (toda lista item leva pra detalhe). Toda lista tem `tabIndex=0`, navegável por teclado. Hover em desktop = background gray-100.

### Padrão: Status visual

3 primitivos diferentes:

- `<StatusDot variant="ok|warn|bad|neutral">` — ponto colorido 8px, dentro de list/table
- `<StatusBadge variant="...">` — badge pill com ícone + label, dentro de header
- `<StatusBanner variant="...">` — banner full-width, topo de seção

Status nunca é só cor — sempre tem ícone OU label, pra a11y.

### Anti-padrões em data display

- ❌ Tabela com scroll horizontal no mobile
- ❌ Mais de 7 colunas em desktop (vire master-detail)
- ❌ Pie chart (humanos não comparam ângulos bem — use bar)
- ❌ Status só por cor (vermelho sem ícone fica invisível pra daltônico)

## §5.5 Empty states (com 3 variantes)

Empty state é onde produto amador se traduz pra mockup vazio. Sempre 3 variantes:

| Variant    | Quando                       | Conteúdo                                              |
| ---------- | ---------------------------- | ----------------------------------------------------- |
| `initial`  | Nunca teve nada (onboarding) | Ícone grande + título + descrição + CTA forte         |
| `filtered` | Filtro vazio                 | Ícone pequeno + "ajuste filtros" + "limpar filtros"   |
| `error`    | Falha ao carregar            | Ícone alerta + erro + "tentar de novo" + link suporte |

Componente único `<EmptyState variant="..." />` com props específicas por variant. Misturar é o erro clássico.

## §5.6 Skeleton (por componente, não genérico)

Padrão Vercel/Linear: cada componente exporta seu próprio Skeleton com **mesmas dimensões do conteúdo final = zero CLS**.

```tsx
<Card.Skeleton />
<DataTable.Skeleton rows={5} />
<MetricCard.Skeleton />
<ListItem.Skeleton />
```

Shimmer sutil (não pulse agressivo). Anima só com `prefers-reduced-motion: no-preference`. Aparece em `<100ms` (skeleton lento é pior que sem skeleton).

## §5.7 Combobox (componente mais negligenciado)

Vai ser usado em: selecionar template, selecionar especialidade, atribuir aluno, escolher cor, picker de cidade, etc.

`<Select>` básico do shadcn não basta. Precisa de:

- Search built-in
- Async loading com debounce
- Keyboard nav (Arrow up/down, Enter, Esc)
- Multi-select opcional
- Empty state inline ("Nenhum resultado para X")
- Recently used (opcional)

Use `cmdk` (mesmo motor do Command/Cmd+K). É o padrão em SaaS premium.

## §5.8 Cmd+K (Command Menu)

Obrigatório no desktop a partir do MVP. Faz parte do "feel Linear/Vercel".

Acesso por `Cmd/Ctrl + K`. Conteúdo:

- Buscar aluno por nome
- Ir para qualquer rota do app
- Ações rápidas ("Criar desafio", "Adicionar aluno")
- Comandos recentes

No mobile, Cmd+K não existe. Substituir por busca no topo do app (visível) ou tab dedicada.

## §5.9 Toast / Banner / Notification (3 coisas diferentes)

Confundir esses 3 é erro clássico:

| Tipo              | Library | Duração            | Quando                                                       |
| ----------------- | ------- | ------------------ | ------------------------------------------------------------ |
| `Toast`           | Sonner  | 3-5s, auto-dismiss | Feedback de ação ("Salvo", "Excluído")                       |
| `Banner` (inline) | Custom  | Persistente        | Aviso no topo de seção ("Plano vai expirar", "RLS bloqueou") |
| `Notification`    | Custom  | Persistente        | Item na sininho do topo ("Novo aluno se inscreveu")          |

Toast pra tudo é erro — usuário acaba ignorando. Banner pra coisa que vai sumir é erro também — vai voltar.

---

# Parte 6 — Navegação e layouts

## §6.1 Padrão: Desktop

```
┌─────┬──────────────────────────────────────┐
│     │ Top bar: breadcrumb · ⌘K · ações ·👤│
│     ├──────────────────────────────────────┤
│ Side│                                      │
│ bar │  Page content                        │
│     │                                      │
│ 240px                                      │
│     │                                      │
│     │                                      │
└─────┴──────────────────────────────────────┘
```

- **Sidebar fixa esquerda, 240px**, colapsável a 60px (icon-only)
- **Top bar enxuta**: breadcrumb + Cmd+K + ações + avatar. **Nunca duplique navegação na top bar.** Sidebar já navega.
- **Content max-width 1280px** centralizado
- **Edição contextual em side sheet 480-520px direita**
- **Confirmação destrutiva em AlertDialog centralizado pequeno**
- **Fluxos longos em página dedicada com wizard** (ver §6.4)

## §6.2 Padrão: Mobile

```
┌──────────────────────────┐
│ ← Título        [⋯]      │  top bar mínima
├──────────────────────────┤
│                          │
│  Page content            │
│  (sem container envolvendo)
│                          │
│                          │
├──────────────────────────┤
│ 🏠   👥   ⊕   🚩   👤    │  bottom tab 5 slots
└──────────────────────────┘
```

- **Bottom tab bar com 5 slots**: Home, Alunos, +, Desafios, Perfil
  - Slot central "+" abre bottom sheet de criação rápida
- **Top bar mínima**: voltar OU logo + título + 1 ação direita
- **Sem hamburger menu** (bottom tab é superior em discoverability)
- **Edição em bottom sheet com snap points**
- **Fluxos longos em full-screen takeover** (X no canto, sticky CTA)

## §6.3 Padrão: Tablet

Trate como **mobile expandido**. 95% dos usuários vão ser desktop ou mobile. Otimizar pra tablet é tempo perdido até ter sinal real.

Breakpoint cravado: < 1024px usa layout mobile. ≥ 1024px usa desktop.

## §6.4 Padrão: Fluxo longo (wizard)

Não use overlay. Use **página dedicada** nos dois shapes:

- **Desktop**: rota dedicada (`/desafios/novo`) com layout de wizard + resumo lateral à direita
- **Mobile**: mesma rota, mas full-screen, sem chrome do app, sticky CTA no rodapé, step indicator no topo central

Wizard sempre tem:

- Step indicator (dots minimalistas, não numerados)
- Botão "Voltar" no rodapé esquerdo (desktop) ou top-left (mobile)
- Botão "Continuar" no rodapé direito (desktop) ou sticky bottom (mobile)
- Botão "Salvar rascunho" disponível em qualquer etapa
- Resumo persistente (sidebar desktop, primeiro card mobile)

## §6.5 Padrão: Botão de voltar

| Onde                        | Estilo                                    |
| --------------------------- | ----------------------------------------- |
| Desktop com hierarquia      | Breadcrumb (`Configurações › Aparência`)  |
| Desktop sem hierarquia      | Não tem botão voltar (sidebar resolve)    |
| Mobile dentro de fluxo      | `←` no top-left, sem texto                |
| Mobile fluxo wizard etapa 1 | `✕` no top-left (não tem pra onde voltar) |
| Mobile detalhe de item      | `←` no top-left + título centralizado     |

`router.back()` quando há histórico. Senão vai pra rota pai conhecida — não confie só em back().

## §6.6 Padrão: Pós-submit

Cravado, sem exceção:

| Ação                            | Resultado                                                      |
| ------------------------------- | -------------------------------------------------------------- |
| **Criou recurso**               | Vai pra detalhe dele + toast "Criado"                          |
| **Editou recurso**              | Fica no mesmo lugar + toast "Salvo"                            |
| **Deletou recurso**             | Volta pra lista pai + toast "Excluído" + botão "Desfazer" (5s) |
| **Cancelou edição com unsaved** | AlertDialog "Descartar alterações?" → ação                     |
| **Cancelou edição sem unsaved** | Fecha drawer/volta sem alerta                                  |

## §6.7 Padrão: Quando há muita info na tela

Aplicar nesta ordem:

1. **Agrupamento semântico** — junta o que é relacionado, separa o que não é
2. **Progressive disclosure** — esconde secundário, mostra resumo
3. **Container queries** ou **abas** — divide em seções visíveis-uma-de-cada-vez
4. **Master-detail** — lista à esquerda + detalhe à direita
5. **Página separada** — pop out da tela em rota dedicada

Errado: tentar caber tudo + reduzir font-size + reduzir padding. Vira ilegível.

---

# Parte 7 — Overlays (Drawer, Sheet, Dialog)

## §7.1 Padrão: Drawer responsivo é a regra

Componente único `<Drawer>` que renderiza:

- **Desktop**: shadcn `Sheet` (slide da direita)
- **Mobile**: Vaul (slide de baixo, com snap points)

Use sempre que precisar de "overlay com conteúdo". Sem exceção. Inclusive AlertDialog (confirmações). Inclusive editor contextual.

## §7.2 Matriz de overlays

| Situação                     | Desktop                          | Mobile                           |
| ---------------------------- | -------------------------------- | -------------------------------- |
| Confirmar ação destrutiva    | AlertDialog centralizado pequeno | Bottom sheet com 2 ações         |
| Editar 1-3 campos rápido     | Side sheet (drawer direita)      | Bottom sheet snap 0.5            |
| Editar formulário 5+ campos  | Side sheet largo (520px)         | Full-screen takeover             |
| Ver detalhe de item da lista | Side sheet (mantém lista atrás)  | Bottom sheet snap 0.6 → 1.0      |
| Criar recurso novo (wizard)  | Página dedicada                  | Full-screen com sticky CTA       |
| Comando rápido               | Cmd+K dialog                     | Não existe (FAB ou bottom sheet) |
| Menu de ações de item        | Dropdown                         | Bottom sheet com lista           |
| Filtros                      | Popover                          | Bottom sheet snap 0.5            |
| Picker (data, hora)          | Popover ancorado                 | Bottom sheet snap 0.5            |

Vai pro design system como decisão fechada, referenciada por componente.

## §7.3 Snap points (mobile bottom sheet)

Vaul suporta. Padrão recomendado:

- `[0.5, 0.9, 1]` — picker, filtros (começa em 0.5)
- `[0.6, 1]` — detalhe de item (começa em 0.6)
- `[1]` — wizard, formulário longo (single snap, full)

## §7.4 Nested drawer (drawer dentro de drawer)

**Permitido, mas evite.** Vaul suporta. Linear usa bem (ex: dentro de detalhe de issue, abre detalhe de comment).

Quando usa:

- Top drawer escurece levemente quando nested abre
- Esc fecha apenas o topo
- Backdrop click fecha apenas o topo
- Animação respeita o stack (não anima junto)

Nunca passe de 2 níveis. Se você está aninhando 3, refatore o fluxo.

## §7.5 Unsaved changes

Wrapper `<DrawerWithDirtyCheck>` detecta form dirty e intercepta:

- Tentativa de fechar (Esc, backdrop, X)
- Navegação (link interno)
- `beforeunload` (fechar tab)

Mostra AlertDialog "Sair sem salvar?" → "Continuar editando" / "Descartar alterações".

Obrigatório em qualquer drawer com form de 3+ campos.

## §7.6 Anti-padrões em overlay

- ❌ Modal centralizado grande (use side sheet desktop / bottom sheet mobile)
- ❌ Drawer sem focus trap (Radix faz por default — não desabilite)
- ❌ Bottom sheet sem drag handle visível
- ❌ Drawer sem botão X visível (nem todos sabem que pode fechar com Esc)
- ❌ Modal pra criar recurso importante (use página dedicada)

---

# Parte 8 — Mobile específico (regras técnicas)

## §8.1 Padrão: dvh, não vh

`100vh` no mobile inclui a barra de URL que some no scroll = layout pula.

```css
.full-height {
  height: 100dvh;
}
.fallback {
  height: 100vh;
  height: 100dvh;
}
```

`100dvh` (dynamic viewport height) tem suporte 95%+. Pra fallback conservador, `100svh` (small).

## §8.2 Padrão: Safe area insets

iOS notch/home indicator. Aplicar em tudo que toca a borda:

```css
.bottom-tab {
  padding-bottom: max(0.75rem, env(safe-area-inset-bottom));
}
.top-bar {
  padding-top: max(0.75rem, env(safe-area-inset-top));
}
.sticky-cta {
  padding-bottom: max(1rem, env(safe-area-inset-bottom));
}
```

Sem isso, botão fica embaixo da home bar e ninguém clica.

## §8.3 Padrão: Touch target 44×44pt

Mínimo Apple HIG. **Visual pode ser menor** (ex: 32×32 ícone), mas **hit area** precisa de 44×44 via padding invisível.

```css
.icon-button {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* ícone interno é 18-24px */
}
```

Em listas com itens próximos, hit area não pode invadir o item de cima/baixo. Use no mínimo 8px gap.

## §8.4 Padrão: Thumb zone (regra do polegar)

Área alcançável com 1 polegar segurando o celular com 1 mão:

- **Verde (fácil)**: terço inferior central
- **Amarelo (médio)**: meio central + parte do inferior lateral
- **Vermelho (difícil)**: superior, especialmente cantos

Aplicação:

- CTAs primários no terço inferior (sticky CTA, bottom tab)
- Botão voltar no top-left (raramente clicado, ok)
- Notificações no top-right (raramente clicado, ok)
- "Mais opções" (⋯) no canto superior direito do item, não no inferior

## §8.5 Padrão: Inputmode + autocomplete obrigatórios

```html
<!-- Email -->
<input type="email" inputmode="email" autocomplete="email" />
<!-- Telefone -->
<input type="tel" inputmode="tel" autocomplete="tel" />
<!-- Senha -->
<input type="password" autocomplete="current-password" />
<!-- Nova senha -->
<input type="password" autocomplete="new-password" />
<!-- Número decimal (peso, R$) -->
<input type="text" inputmode="decimal" />
<!-- Número inteiro (vagas, idade) -->
<input type="text" inputmode="numeric" pattern="[0-9]*" />
<!-- Busca -->
<input type="search" inputmode="search" />
<!-- URL -->
<input type="url" inputmode="url" />
```

Sem isso, teclado mobile abre errado e parece app de 2015.

## §8.6 Padrão: Font-size 16px mínimo em input

iOS dá zoom automático em input com font-size < 16px. Resultado: layout pula no foco.

CSS global:

```css
input,
textarea,
select {
  font-size: 16px;
}
```

## §8.7 Padrão: Pull-to-refresh

**Não implemente custom**. Use a gesture nativa do iOS/Android via PWA. Implementação custom sempre fica ruim.

Se for fazer, valor alto em: lista de alunos, mensagens, dashboard PT.
Pula em: settings, formulário, relatório.

## §8.8 Padrão: Haptics

`navigator.vibrate(10)` em sucesso (Chrome Android suporta). iOS PWA não suporta — degrade gracefully.

```ts
function haptic(pattern: 'success' | 'error' | 'tap') {
  if (!('vibrate' in navigator)) return
  const patterns = {
    success: 10,
    error: [20, 10, 20],
    tap: 5,
  }
  navigator.vibrate(patterns[pattern])
}
```

Use em:

- Check-in completado (success)
- Erro de validação (error)
- Toggle on/off (tap)

Não use em: página carregando, hover, scroll.

## §8.9 Padrão: Swipe gestures

Onde vale (no PWA do cliente):

- Swipe horizontal entre dias do calendário do desafio
- Swipe pra revelar ações em lista (arquivar mensagem)

Onde não vale:

- Não use swipe pra navegar entre rotas (browser back conflita)
- Não use swipe pra deletar sem confirmação (perigoso)

## §8.10 Padrão: Container "respira até a borda"

**Mobile não tem container envolvendo tudo.** Já discutido em §1.2 e na conversa anterior. Resumindo:

- Background da tela = background do app inteiro
- Conteúdo tem padding-x 16-20px (cozy/roomy)
- Cards são usados _dentro_ do conteúdo pra agrupar coisas relacionadas, não pra envolver tudo
- Sticky bars tocam as bordas da tela
- Safe area em sticky bars

Exceção: **PWA do cliente, tela de check-in noturno** pode ter card grande ocupando 90% da tela porque ele _é_ a ação principal. Decisão de tela, não regra global.

---

# Parte 9 — Acessibilidade

## §9.1 Padrão: WCAG 2.2 AA mínimo

Não-negociável. Tudo precisa passar:

- Contraste APCA (já em §3.6)
- Foco visível (`focus-visible:ring-2 focus-visible:ring-brand`)
- Keyboard navigation completa (Tab, Shift+Tab, Esc, Enter, Space, Arrow)
- Aria-labels em ícones sem texto
- Heading hierarchy correta (h1 → h2 → h3, sem pular)
- Form fields com `<label htmlFor>` associado
- Erros com `aria-describedby`
- Live regions pra notifications (`aria-live="polite"`)

## §9.2 Padrão: Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

`<MotionConfig reducedMotion="user">` no root do app, motion/react detecta automaticamente.

## §9.3 Padrão: Foco volta pro elemento certo

Quando fecha drawer/dialog, foco volta pro elemento que abriu. Radix faz por default — não estrague.

Quando navega pra nova rota, foco vai pro `<h1>` da nova página (não pro topo).

## §9.4 Tests automáticos

CI roda:

- `axe-core` em Playwright em rotas críticas (falha se Critical/Serious)
- `eslint-plugin-jsx-a11y` strict

Tests manuais por sprint:

- Navegação completa por teclado em 1 fluxo crítico
- Screen reader (NVDA Windows ou VoiceOver Mac) em 1 fluxo crítico
- Verificar contraste em estados hover/focus/disabled

---

# Parte 10 — Motion

## §10.1 Padrão: motion/react, não framer-motion

Já em D15. Reforço aqui.

## §10.2 Tokens de duração

```css
--motion-instant: 80ms; /* hover, focus */
--motion-fast: 150ms; /* button press, toggle, micro */
--motion-base: 240ms; /* sheet open/close, fade */
--motion-slow: 400ms; /* page transition, layout shift */
--motion-celebrate: 800ms; /* success animation, aha moment */
```

## §10.3 Tokens de easing

```css
--ease-out-quad: cubic-bezier(0.5, 1, 0.89, 1); /* default out */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1); /* dramatic out */
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1); /* state change */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); /* bouncy, raro */
```

Não use `ease`, `ease-in-out` plain — parece web 2010.

## §10.4 Presets em motion/react

```ts
// lib/design/motion.ts
export const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 } }
export const slideUp = { initial: { y: 16, opacity: 0 }, animate: { y: 0, opacity: 1 } }
export const scaleIn = { initial: { scale: 0.96, opacity: 0 }, animate: { scale: 1, opacity: 1 } }
export const stagger = { animate: { transition: { staggerChildren: 0.04 } } }
```

5 presets cobrem 90% dos casos. Cada componente do DS usa um preset internamente:

- Sheet: slideUp (mobile) ou slide horizontal (desktop), 240ms
- Dialog: scaleIn + fade, 200ms
- Toast: slideRight (desktop) ou slideUp (mobile), 200ms in / 150ms out
- Skeleton: shimmer (não pulse), 1.5s loop

## §10.5 Regra de ouro

**Se você animar mais que 5% da UI, está animando demais.**

O que vale animar:

- Layout shift planejado (item entra na lista) — `motion.layout`
- State change visível (toggle, accordion, sheet) — fade + slide leve
- Erro de validação — shake muito sutil (8px, 100ms, 2 oscilações)
- Sucesso de ação — checkmark com path animation
- Aha moment do dia 14 (PWA cliente) — animação dedicada

O que não vale animar:

- Texto entrando letra por letra
- Cards "respirando"
- Backgrounds com gradiente animado
- Ícones girando sem motivo
- Hover em cada elemento da tela

## §10.6 Page transitions

No App Router do Next.js, page transitions ainda são complexas (RSC streaming). Por enquanto:

- Mobile: slide horizontal entre rotas (forward) e reverse (back) via `AnimatePresence`
- Desktop: fade simples 150ms

Implementação detalhada vai pra fase de Polish (15.1 no plano).

---

# Parte 11 — Imagens, vídeos e mídia

## §11.1 Padrão: Quando usar imagem de fundo

**Use imagem de fundo apenas em:**

- Hero do site público do profissional
- Hero da landing page do desafio (`/{slug}/desafio/[id]`)
- Splash screen do PWA
- Eventualmente, hero do relatório (decisão de §12.4)

**Nunca use imagem de fundo em:**

- Dashboard, settings, qualquer tela do app interno
- Formulário público (foco no preenchimento)
- Empty states
- Cards de conteúdo

Imagem de fundo é decoração protagonista. Em UI funcional é distração.

## §11.2 Padrão: Quando usar vídeo de fundo

**Use vídeo de fundo apenas em:**

- Hero da landing page do desafio (opcional, se profissional fornecer)

**Nunca use vídeo de fundo em:**

- Site público padrão (opcional, custo de performance alto)
- Formulário, dashboard, qualquer tela do app

Razão: vídeo é o LCP element em 95% dos casos. Mal otimizado = Core Web Vitals ruim = SEO ruim. Profissional brasileiro com chip popular não aguenta hero video pesado.

Se usar vídeo:

- Sempre com poster image (LCP via poster, não vídeo)
- Tamanho máximo 4MB
- Mute, autoplay, loop, playsinline (iOS exige)
- Fallback static image em conexão slow / Save-Data

## §11.3 Tamanhos de imagem (cravado)

| Onde                            | Aspecto      | Width servida (mobile) | Width servida (desktop) | Formato                 |
| ------------------------------- | ------------ | ---------------------- | ----------------------- | ----------------------- |
| Hero site público               | 16:9         | 800px                  | 1920px                  | AVIF + fallback WebP    |
| Hero landing desafio            | 16:9         | 800px                  | 1920px                  | AVIF + fallback WebP    |
| Avatar profissional             | 1:1          | 200px                  | 200px                   | AVIF                    |
| Avatar cliente / aluno          | 1:1          | 96px                   | 96px                    | AVIF                    |
| Foto antes/depois (PWA cliente) | 4:5 portrait | 720px                  | 720px                   | AVIF                    |
| Card image (template, desafio)  | 16:10        | 600px                  | 800px                   | AVIF                    |
| Logo profissional               | flex         | 240px max              | 240px max               | SVG ou PNG transparente |

Use `next/image` sempre. `priority={true}` no LCP, lazy nos outros. `sizes` correto.

## §11.4 Tamanhos de vídeo

| Onde                   | Aspecto | Resolução | Bitrate               | Duração max |
| ---------------------- | ------- | --------- | --------------------- | ----------- |
| Hero landing desafio   | 16:9    | 1080p     | 2 Mbps                | 12s loop    |
| Vídeo de aula (futuro) | 16:9    | 1080p     | streamed via provider | livre       |

Hero loop sempre <4MB. Compress com Handbrake H.264 alto perfil + audio removido.

## §11.5 Fallback sem foto

Profissional sem foto: gradient brand + iniciais grandes (96px Geist Mono).
Cliente sem foto: gradient gray-100 + iniciais 32px.
Card de template/desafio sem imagem: gradient brand + ícone categoria 48px.

Nunca use stock photo genérico de "personal trainer feliz". Pior que sem foto.

## §11.6 Foto antes/depois (PWA cliente)

Caso especial. Tem padrões cravados em D49. Resumo:

- Estrutura obrigatória (3 ângulos: frente, lado, costas)
- Fundo branco / parede neutra
- Em jejum, manhã
- Mesma roupa em todos os check-ins
- Comparação lado-a-lado em vez de slider (slider parece duvidoso)

---

# Parte 12 — Por superfície

## §12.1 Dashboard interno do profissional

**Tipo:** Operacional + estratégico misto
**Densidade:** cozy
**Cor:** brand fixa (teal escuro)
**Tipografia:** Geist Sans + Geist Mono em números

### Layout desktop

```
┌─────┬───────────────────────────────────────────┐
│ Side│ Top bar: "Início" · ⌘K · + Novo desafio   │
│ bar ├───────────────────────────────────────────┤
│     │ "Boa tarde, Pri" + 1 linha de contexto    │
│     │                                           │
│     │ [KPI] [KPI] [KPI] [KPI]   ← 4 colunas    │
│     │                                           │
│     │ [Gráfico do desafio   ] [Alunos em risco]│
│     │ (60% width)             (40% width)      │
│     │                                           │
│     │ [Mensagem do dia (IA) - revisar e enviar]│
└─────┴───────────────────────────────────────────┘
```

- 4 KPIs no topo (alunos ativos, adesão, receita, cases prontos) — F-pattern
- 5-9 elementos primários, **não mais**
- Mensagem do dia da IA é sempre o último card (call to action principal do dia)

### Layout mobile

```
┌──────────────────────────┐
│ [logo] "Olá, Pri"   [🔔] │
├──────────────────────────┤
│ "3 alunos precisam..."   │
│ [KPI 1] [KPI 2]          │  ← 2 colunas
│ [21 dias: dia 14 spark]  │
│ "Em risco"               │
│ [aluno 1]                │
│ [aluno 2]                │
│ [aluno 3]                │
│ [+ Novo desafio]         │  ← CTA primário
├──────────────────────────┤
│ 🏠 👥 ⊕ 🚩 👤            │  bottom tab
└──────────────────────────┘
```

### Decisões específicas

- **Usa imagem/vídeo?** Não. Dashboard é funcional.
- **Cards envolvem tudo?** Não no mobile. Cards individuais por seção.
- **Pull-to-refresh?** Sim no mobile (refresh dos KPIs).
- **Empty state inicial?** Sim, ilustração + "Adicione seu primeiro aluno" quando lista vazia.
- **Skeleton?** Sim, especifico por componente (MetricCard.Skeleton, etc).

## §12.2 Painel de configurações

**Tipo:** Configuração com profundidade (várias camadas)
**Densidade:** roomy (settings é leitura cuidadosa, não scan rápido)
**Cor:** brand fixa
**Tipografia:** Geist Sans

### Desktop

Settings tem **navegação interna lateral** + content principal. Como Vercel, GitHub, Linear settings:

```
┌─────┬──────┬─────────────────────────────────┐
│ Side│ Set  │ Settings › Aparência            │
│ bar │ tings├─────────────────────────────────┤
│     │ nav  │                                 │
│     │      │  H1: Aparência                  │
│     │ Perf │  Description                    │
│     │ Apar │                                 │
│     │ Inte │  [Section: Estilo]              │
│     │ Faturm│  ...                            │
│     │ Time │  [Section: Cor]                 │
│     │      │  ...                            │
└─────┴──────┴─────────────────────────────────┘
```

- Sidebar de settings 200px, list vertical
- Content max-width 720px (settings é leitura, não tabela)
- Cada section em card próprio, divider entre sections
- "Salvar" é sticky no topo da seção, ativo só quando há mudança não salva

### Mobile

Settings vira **lista de links pra sub-páginas**. Não tente espremer settings desktop em mobile.

```
┌──────────────────────────┐
│ ← Configurações          │
├──────────────────────────┤
│ Perfil              →    │
│ Aparência           →    │
│ Integrações         →    │
│ Faturamento         →    │
│ Plano               →    │
│ Privacidade (LGPD)  →    │
│ ─────────────────────────│
│ Sair                     │
└──────────────────────────┘
```

Cada item leva pra sub-página dedicada. Sub-página tem topbar com `← Aparência`.

### Decisões específicas

- **Camadas de profundidade**: máximo 3 níveis (Settings → Aparência → Cor avançado). Mais que isso = refatorar IA.
- **Settings avançado**: dentro de cada sub-página, "Mostrar opções avançadas" (collapsed por default).
- **Mudanças destrutivas** (mudar email, deletar conta): sempre AlertDialog + senha.
- **Auto-save vs manual**: manual em settings (com sticky bar "Você tem mudanças não salvas"). Auto-save em editor de site (decidir caso-a-caso).

## §12.3 Formulário público (intake)

**Tipo:** Wizard de coleta
**Densidade:** roomy (cliente preenche com calma, mobile-first)
**Cor:** brand do profissional vaza
**Tipografia:** vibe escolhida pelo profissional

### Layout

Ambos desktop e mobile usam **wizard full-screen single-question-per-step** (estilo Typeform):

```
┌────────────────────────────────────────────┐
│ [logo PT pequeno]              [3 de 12]   │
│                                            │
│                                            │
│           Pergunta principal               │
│           (Display, 32-48px)               │
│                                            │
│           [Input grande]                   │
│                                            │
│           Helper text                      │
│                                            │
│                                            │
│              [Continuar →]                 │
└────────────────────────────────────────────┘
```

### Decisões específicas

- **Imagem/vídeo de fundo?** Não. Foco no preenchimento. Background neutro (gray-50 ou white).
  - Exceção opcional: profissional pode habilitar hero image na primeira tela (boas-vindas), nunca durante questões.
- **Container envolvendo?** Não. Single column max-width 560px centralizado.
- **Bottom sheet?** Não, é tela inteira sempre.
- **Botão voltar?** Sempre disponível, top-left.
- **Skip?** Não. Cada pergunta é obrigatória ou opcional explícita ("Pular esta pergunta" como link sob o input).
- **Progress indicator?** Sim, número discreto top-right ("3 de 12") + barra fina no topo.
- **Animação entre perguntas?** Slide horizontal 240ms ease-out-quad. Reduced motion = fade.
- **Validação?** On-blur (não enquanto digita).
- **Mobile-first?** Sim, é onde 80% vai responder.

## §12.4 Relatório IA (gerado pós-formulário)

**Tipo:** Conteúdo editorial longo, leitura sequencial
**Densidade:** roomy (texto longo precisa de respiro)
**Cor:** brand do profissional vaza no hero e em headings
**Tipografia:** vibe escolhida

### Decisão crítica: estilo magazine vs estilo PDF/página

**Recomendo: estilo magazine web responsivo, NÃO estilo PDF.**

Por quê:

- PDF baixado tem cara de "documento técnico" — funciona pra anexo de email, não pra primeira impressão
- Magazine web responsivo: lê no celular, compartilha por link, profissional pode atualizar
- Geração de PDF como **opção secundária** (botão "Baixar PDF" no topo), não como formato primário

### Layout magazine

Inspiração: Stripe Press, The Verge longform, Notion published pages.

Estrutura cravada:

```
┌────────────────────────────────────────────┐
│ [Hero image full-bleed, cor de marca PT]   │
│                                            │
│   "Relatório personalizado para Maria"     │
│   subhead pequeno: "por Pri Ortiz"         │
├────────────────────────────────────────────┤
│                                            │
│   Drop cap "S" sua jornada começa aqui...  │
│   (intro 1-2 parágrafos, body large)       │
│                                            │
│   ─── Section break ───                    │
│                                            │
│   ## Seu perfil                            │
│   Texto + 1-2 KPIs em call-out             │
│                                            │
│   ## Os 3 pilares                          │
│   Pillar 1 + descrição                     │
│   Pillar 2 + descrição                     │
│   Pillar 3 + descrição                     │
│                                            │
│   ## Próximos passos                       │
│   ...                                      │
│                                            │
│   ## Vamos conversar?                      │
│   [CTA WhatsApp grande]                    │
└────────────────────────────────────────────┘
```

### Decisões específicas

- **Container width**: 640px max em desktop (linha 65ch), 100% em mobile com padding 20px
- **Hero**: full-bleed (escapa do container), 50vh em mobile, 60vh em desktop
- **Tipografia**: Body 17px (não 14), line-height 1.65, mais respiro que UI
- **Pull quotes**: Sim, em momentos de destaque, com brand color de fundo subtle
- **Drop cap**: Sim, no primeiro parágrafo (estilo editorial)
- **Imagens inline**: opcional, profissional pode ativar
- **Imprimível**: CSS `@media print` cravado, gera PDF gracioso
- **Compartilhável**: link público, OG image gerada
- **Cor brand vaza em**: hero, headings, pull quotes, CTA WhatsApp
- **Cor brand NÃO vaza em**: body text, estrutura

## §12.5 Página de links (estilo Linktree) — `/{slug}`

**Tipo:** Hub público, ponto de entrada
**Densidade:** cozy
**Cor:** brand do profissional vaza
**Tipografia:** vibe escolhida

### Decisão crítica: básico ou personalizado?

**Recomendo: personalizado, mas com regras claras.**

Linktree puro é genérico. Beacons é monetização-first (não nosso caso). Família "linktree premium personalizada" é o que cabe.

Estrutura cravada:

```
┌──────────────────────────┐
│   [foto profissional]    │
│      Pri Ortiz           │
│   Personal Trainer       │
│   "1 linha bio"          │
├──────────────────────────┤
│ [➡ Quero conhecer        │
│    Pri (formulário)]     │  ← CTA primário, brand color
├──────────────────────────┤
│ Conheça meu trabalho     │
│ → Site                   │
│ → 21 Dias Mais Leve      │
│ → Programa premium       │
│ → Instagram              │
│ → WhatsApp direto        │
└──────────────────────────┘
```

### Decisões específicas

- **Customização**: Sim, profissional escolhe estilo + cor. Reusa sistema de §3.7.
- **Imagem de fundo?** Opcional. Default: gradient sutil brand-50 → brand-100. Profissional pode habilitar foto.
- **Foto profissional**: obrigatória (96-120px circular)
- **CTA primário**: sempre o formulário (gera lead). Outros links são secundários.
- **Ordem dos links**: profissional escolhe. Sistema sugere "CTA primário sempre top".
- **Mobile-first**: 100% das visitas vêm de bio do Instagram (mobile)
- **Vídeo de fundo?** Não. Performance crítica nessa página (CTR alto se carrega rápido).
- **Animação?** Mínima. Fade-in dos cards em stagger 60ms. Reduced motion = sem animação.

## §12.6 Site público do profissional

**Tipo:** Landing premium
**Densidade:** roomy
**Cor:** brand do profissional vaza pesado
**Tipografia:** vibe escolhida

### Layout

Inspiração: Family.co, Cal.com, profissionais premium do Behance.

Estrutura padrão:

1. **Hero**: foto + título + sub + CTA primário
2. **About**: foto secundária + bio expandida
3. **Programas**: 2-4 cards de programas/desafios
4. **Resultados**: 2-3 transformações antes/depois (com permissão LGPD)
5. **Depoimentos**: 3-6 cards com foto + texto curto
6. **FAQ**: 5-8 perguntas
7. **CTA final**: "Quero começar" → formulário

### Decisões específicas

- **Hero image**: full-bleed obrigatório, height 70-80vh desktop / 60vh mobile
- **Hero video?** Opcional, com poster. Profissional escolhe.
- **Container**: sections respiram em max-width 1200px. Cards dentro respiram em max-width 720px.
- **Animação on-scroll?** Mínima. Fade-up 240ms ao entrar na viewport. Não exagere.
- **Cor brand**: vaza em CTAs, headings, accents de cards. Body fica neutro.
- **Mobile**: stack vertical com bottom sticky CTA "Quero começar"
- **Performance crítica**: LCP <2.5s. AVIF + lazy + fetchpriority.

## §12.7 Diagnóstico público

**Tipo:** Wizard pré-relatório, similar ao formulário
**Densidade:** roomy
**Cor:** brand do profissional vaza
**Tipografia:** vibe escolhida

Padrão idêntico ao formulário (§12.3). Reusar wizard component.

## §12.8 PWA do cliente (`/c/`)

**Tipo:** App mobile-first
**Densidade:** roomy
**Cor:** Brand fixa do `onboarding.bio` (teal) — NÃO usa brand do profissional
**Tipografia:** Geist Sans

Razão: cliente pode estar em desafio com 2 profissionais diferentes. App tem que ter identidade própria.

### Layout

6 abas conforme D50 / contexto.md:

- Home
- Programa
- Evolução
- Comunidade
- Recursos
- Perfil

Cada aba é tela inteira mobile-first. Bottom tab bar fixo.

### Decisões específicas

- **Container envolvendo tudo?** NÃO. Conteúdo respira até a borda.
- **Cards?** Sim, dentro de cada tela, agrupando seções.
- **Imagens de fundo?** Só em momentos especiais: aha moment do dia 14, dashboard final do dia 21.
- **Push notifications**: sim, com permissão.
- **Haptics**: sim, em check-in completado.
- **Pull-to-refresh**: sim, em Home, Comunidade, Programa.
- **Install prompt customizado**: aparece após 3 sessões.
- **Offline básico**: read-only de programa + recursos.

---

# Parte 13 — Lint rules específicas (cravadas)

Suplemento ao que já discutimos. Cada regra trava um padrão deste documento:

| Regra                                                   | Trava                                    |
| ------------------------------------------------------- | ---------------------------------------- |
| `no-arbitrary-tailwind`                                 | §2 e §3 (sem text-[14px], bg-[#hex])     |
| `no-raw-button`                                         | §5.1 (botão fora de DS)                  |
| `no-inline-style-color`                                 | §3 (style={{ color }})                   |
| `no-restricted-imports` (framer-motion, supabase admin) | D15, D14                                 |
| `jsx-a11y/strict`                                       | §9 (aria-label, htmlFor, etc)            |
| `no-literal-string`                                     | i18n (placeholder, aria-label, JSX text) |
| `react/jsx-no-target-blank`                             | links seguros                            |
| `react/no-unstable-nested-components`                   | performance                              |

---

# Parte 14 — Posicionamento (resumo, fonte canônica em outro doc)

Posicionamento detalhado, taglines, pitchs e anti-padrões de copy estão cravados em `docs/produto/posicionamento.md`. Este resumo existe pra dar contexto ao design system, não pra ser fonte canônica.

## §14.1 Categoria

**Plataforma comercial pra profissionais do esporte.**

"Comercial" = tudo que não é a entrega do treino, mas o negócio em volta dele. "Do esporte" = CREF (PT, educador físico, treinador esportivo). Nutricionista esportivo entra como expansão natural.

Categoria nova, ainda não nomeada no mercado brasileiro. Não compete com Tecnofit (gestão), Hotmart (genérico), Linktree (link), Calendly (agenda).

## §14.2 Posicionamento de raiz

**Toda a infraestrutura de tecnologia pra transformar o conhecimento do profissional em produto digital — sem ele virar empresa de tecnologia.**

## §14.3 Tagline

**"Sua infraestrutura digital. Sua marca."**

Curta pra contextos menores: **"Você cuida do treino."**

## §14.4 Pitch geral

> Você cuida do treino. A gente cuida da infraestrutura.

## §14.5 Os dois produtos (heros cravados)

**Produto 1 — Captação (R$ 47/mês):**

> Headline: A primeira impressão é a que importa.
> Sub: Formulário inteligente, relatório premium gerado por IA, página de captura e dashboard — tudo com a sua identidade visual. Receba cada lead como ele merece ser recebido.
> CTA: Começar por R$ 47/mês

**Produto 2 — Desafios e acompanhamentos (split 20%):**

> Headline: Seu desafio. Pronto pra rodar.
> Sub: Cronograma estruturado, sequência de e-mails de pré-venda que aquece sua lista, portal do aluno, pagamento integrado e automação WhatsApp. Você vende. Você fica com 80%.
> CTA: Criar meu primeiro desafio

## §14.6 Posicionamento visual (consequência)

Como o produto deve **parecer** dado o posicionamento:

- Nada de "academia" (haltere, esteira, dumbbell em ilustração)
- Nada de "gym energy" (vermelho gritante, fontes esportivas agressivas, foto de PT gritando)
- Sim a "consultório premium" (calma, técnico, foto de PT em pose profissional)
- Sim a "produto tech sério" (Geist, dark mode, motion controlado)
- Sim a "saúde sofisticada" (teal escuro, espaçamento generoso, fotografia editorial)

Referências visuais: Apple Fitness+, Whoop, Calm, Headspace, mas mais frio. **Nunca** Smart Fit, Gympass marketing, Bodybuilding.com.

## §14.7 Tom de voz (já em D6, reforço aqui)

Direto, técnico, premium. Nunca "máquina de vendas", nunca "segredos", nunca emoji em UI funcional. Curtos parágrafos. Microcopy específica ("Salvar alterações" não "Salvar"). Erros que ensinam, não apenas avisam.

## §14.8 Onde achar o resto

Anti-padrões de copy completos (C1-C20), categorias adjacentes do que você NÃO é, manifesto, microcopy padrão por contexto, tom por superfície: tudo em `docs/produto/posicionamento.md`.

---

# Parte 15 — Como esse documento se conecta com o plano

Este documento é referenciado por:

- **`docs/plano/PLANO_LANCAMENTO.md`** — Fase 04 (Design System) implementa Partes 1-13 deste doc. Fase 04.5 (Motion Foundations) implementa Parte 10. Fase 11/12 (Site público / PWA) implementa §12. Fase 14.5 (Polish) refina tudo.
- **`docs/core/decisions.md`** — D60-D69 e adições novas referenciam seções deste doc.
- **`AGENTS.md` / `CLAUDE.md`** — devem apontar pra cá quando o contexto é UI.

Nenhuma decisão deste documento muda sem entrada explícita aqui + commit dedicado.

---

# Apêndice — Decisões adicionadas a `decisions.md`

Adicionar em `docs/core/decisions.md` na seção Design system:

| #   | Decisão                                                                                                                                                                                              | Data       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| D70 | **Stack visual fechada:** shadcn/ui + Radix + Tailwind v4 + Vaul (mobile drawer) + motion/react. Sem alternativas, sem mistura.                                                                      | 2026-04-29 |
| D71 | **Tipografia:** Geist Sans (UI) + Geist Mono (números). Inter como fallback. Inter NÃO é primary.                                                                                                    | 2026-04-29 |
| D72 | **Brand color produto:** teal escuro `oklch(62% 0.13 175)`. NÃO laranja, NÃO roxo, NÃO preto.                                                                                                        | 2026-04-29 |
| D73 | **Drawer responsivo é o padrão único de overlay**: Sheet (desktop) + Vaul (mobile). Sem exceção em editor contextual e confirmação. Exceção: AlertDialog centralizado SÓ pra confirmação destrutiva. | 2026-04-29 |
| D74 | **Fluxos longos = página dedicada nos dois shapes** (desktop wizard + sidebar; mobile full-screen + sticky CTA). Nunca modal.                                                                        | 2026-04-29 |
| D75 | **Mobile sem container envolvendo tela.** Conteúdo respira até a borda. Cards são internos, não wrappers. Exceção: telas single-action (check-in noturno PWA).                                       | 2026-04-29 |
| D76 | **Bottom tab bar 5 slots no mobile**, NÃO hamburger menu. Slot central "+" abre bottom sheet de criação rápida.                                                                                      | 2026-04-29 |
| D77 | **Cmd+K obrigatório no desktop a partir do MVP**. cmdk lib. Sem Cmd+K = produto não-premium.                                                                                                         | 2026-04-29 |
| D78 | **Componentes de texto**: `<Heading level={n}>` e `<Text variant>` em vez de classes utilitárias. Lint trava.                                                                                        | 2026-04-29 |
| D79 | **Tipos de botão são componentes separados**, não variants: Button, IconButton, LinkButton, AsyncActionButton, CopyButton, DangerAction, FloatingActionButton, StickyActionBar.                      | 2026-04-29 |
| D80 | **Empty states com 3 variants obrigatórias**: initial, filtered, error. Componente único `<EmptyState variant>`.                                                                                     | 2026-04-29 |
| D81 | **Skeleton específico por componente**, não genérico. `Card.Skeleton`, `DataTable.Skeleton`, etc. Aparece em <100ms.                                                                                 | 2026-04-29 |
| D82 | **Combobox é Cmdk-based** (não Select básico do shadcn). Search built-in, async, keyboard nav obrigatórios.                                                                                          | 2026-04-29 |
| D83 | **Padrão de imagens**: AVIF + WebP fallback, next/image sempre, priority no LCP. Sem stock photo genérico.                                                                                           | 2026-04-29 |
| D84 | **Hero video opcional, nunca default.** Sempre com poster image. Max 4MB. Mute/autoplay/loop/playsinline.                                                                                            | 2026-04-29 |
| D85 | **Relatório IA = magazine layout responsivo**, não PDF-style. PDF é botão secundário "Baixar".                                                                                                       | 2026-04-29 |
| D86 | **Página de links (`/{slug}`) usa sistema de personalização** dos estilos curados (D65). Não é Linktree puro.                                                                                        | 2026-04-29 |
| D87 | **PWA do cliente usa brand fixo `onboarding.bio` (teal)**, não brand do profissional. Cliente pode estar em desafios de múltiplos profissionais.                                                     | 2026-04-29 |
| D88 | **Sticky action bar mobile** em todo wizard/form longo. Padding-bottom respeita `env(safe-area-inset-bottom)`.                                                                                       | 2026-04-29 |
| D89 | **Snap points padrão Vaul**: `[0.5, 0.9, 1]` picker, `[0.6, 1]` detalhe, `[1]` wizard/form longo.                                                                                                    | 2026-04-29 |
| D90 | **Posicionamento**: "A plataforma profissional pra personal trainers que tratam treino como ofício." Categoria: "Plataforma de recepção de alunos." Não é Linktree, não é Tecnofit, não é Hotmart.   | 2026-04-29 |

---

# Apêndice — Anti-padrões adicionados

Adicionar em `docs/core/decisions.md` na seção anti-padrões:

| #   | Não faça                                                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------- |
| A28 | Modal centralizado pra editar/criar — use Drawer responsivo (Sheet desktop / Vaul mobile)                      |
| A29 | Container card envolvendo a tela inteira no mobile — conteúdo respira até a borda                              |
| A30 | Hamburger menu no mobile — usar bottom tab bar 5 slots                                                         |
| A31 | `<button>` direto fora de components/ui — usar `<Button>` ou `<IconButton>`                                    |
| A32 | Pie chart — humanos não comparam ângulos bem, usar bar chart                                                   |
| A33 | Stock photo genérico de "personal trainer feliz" — pior que sem foto, usar fallback gradient + iniciais        |
| A34 | Hero video sem poster image — LCP arruinado                                                                    |
| A35 | Brand color do profissional vazando em superfícies internas (dashboard, settings) — só em superfícies públicas |
| A36 | Mais que 1 botão `primary` por viewport — confunde hierarquia                                                  |
| A37 | Validação de form on-change com erro vermelho enquanto digita — usar on-blur                                   |
| A38 | IconButton sem aria-label — TypeScript trava                                                                   |
| A39 | Tabela com scroll horizontal no mobile — virar lista                                                           |
| A40 | Animar mais de 5% da UI — distração, perde efeito                                                              |
| A41 | Cor laranja agressiva como brand do produto — território Strava, escolhemos teal escuro (D72)                  |
| A42 | PDF como formato primário do relatório — usar magazine layout web (D85)                                        |

---

**Fim do documento.**

Próximos passos: quando você mandar o plano atualizado, encaixo Parte 10 (Motion) na fase 04.5, Parte 11 (mídia) e §12 (por superfície) nas fases 11/12, Parte 13 (lint) junto da Fase 04. Posicionamento (Parte 14) vai pra `docs/produto/posicionamento.md` (criar) e referenciado por landing pages.
