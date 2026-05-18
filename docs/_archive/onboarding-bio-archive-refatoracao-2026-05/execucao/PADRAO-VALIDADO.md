# PADRAO-VALIDADO — Contrato dos sweeps subsequentes

> **Documento canônico produzido pela Fase 47 (Vertical de prova /r/[token]).**
> Vinculante para todas as fases de sweep horizontal (51-75) e auditorias futuras (157+).
> Última atualização: 2026-05-04 (Fase 47).

A Fase 47 refatorou `/r/[token]` end-to-end como vertical de prova. Tudo decidido aqui foi aplicado e validado naquela rota. As Etapas 4-6 (Shapes, Tipografia, Casing+Cores) seguem este mapeamento literalmente — qualquer desvio precisa de aprovação do fundador.

---

## Sumário do mapeamento

| Categoria               | De (bypass)                                                                                         | Para (token-respecting)                                                  | Onde |
| ----------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ---- |
| Section eyebrow         | `<Heading level={2} className="text-micro tracking-extra-display text-muted-foreground uppercase">` | `<Eyebrow as="h2" variant="section">`                                    | §1.1 |
| Card eyebrow            | `<div className="text-micro tracking-display-wide text-muted-foreground uppercase">`                | `<Eyebrow as="div" variant="card">`                                      | §1.2 |
| Hero accent eyebrow     | `<p className="text-micro text-[var(--color-accent)] tracking-extra-display uppercase">`            | `<Eyebrow as="p" variant="accent">`                                      | §1.3 |
| Mono eyebrow            | `<span className="text-micro font-mono tracking-widest uppercase">`                                 | `<Eyebrow as="span" variant="mono">`                                     | §1.4 |
| Body paragraphs         | `<p className="text-base leading-relaxed text-muted-foreground">`                                   | `<Text variant="body-large" className="text-muted-foreground">`          | §2.1 |
| Body small / caption    | `<p className="text-xs leading-relaxed text-muted-foreground">`                                     | `<Text variant="micro">` (or `body-small`)                               | §2.2 |
| Heroic display headings | `<h1/h2 className="bc text-2xl/3xl/4xl/5xl/6xl uppercase">`                                         | `<Heading level>` + `eslint-disable-next-line` heroic                    | §2.3 |
| Heroic body italic      | `<p className="lb text-xl italic leading-relaxed">`                                                 | `<p>` + `eslint-disable-next-line` heroic                                | §2.4 |
| SVG `<text>` labels     | `<text className="text-micro-xs uppercase">`                                                        | `<text>` + `eslint-disable-next-line` SVG                                | §2.6 |
| Card surface shape      | `rounded-lg`, `rounded-xl`, `rounded-2xl`                                                           | `rounded-[var(--shape-card)]`                                            | §4.1 |
| Button shape            | `rounded-md`                                                                                        | `rounded-[var(--shape-button)]`                                          | §4.2 |
| Input shape             | `rounded`                                                                                           | `rounded-[var(--shape-input)]`                                           | §4.3 |
| Badge shape             | `rounded-sm`                                                                                        | `rounded-[var(--shape-badge)]`                                           | §4.4 |
| Pill / avatar           | `rounded-full`                                                                                      | preserve (intent)                                                        | §4.5 |
| Bottom-sheet top corner | `rounded-t-3xl`                                                                                     | preserve (intent) + `eslint-disable-next-line` heroic                    | §4.6 |
| Tailwind palette colors | `border-orange-500`, `bg-orange-500/10`                                                             | `border-[var(--color-score-low)]`, `bg-[var(--color-score-low)]/10`      | §5.1 |
| Risk levels             | `text-orange-400` (high), `text-red-X` (danger)                                                     | `var(--color-score-low)`, `var(--color-score-danger)`                    | §5.2 |
| Hex/RGB literais        | `stroke="#26262d"`, `fill="#8a8a93"`                                                                | `stroke="var(--color-border)"`, `fill="var(--color-muted-foreground)"`   | §5.3 |
| Skip link               | (ausente)                                                                                           | `<SkipLink label={t('a11y.skipToMain')} />` + `<main id="main-content">` | §6.1 |
| Nav `aria-label`        | (ausente)                                                                                           | `aria-label={t('a11y.skipToNav')}`                                       | §6.2 |

---

## §1 Eyebrows

### §1.1 Section eyebrow (page-level h2 styled as small label)

**Padrão canônico:** `<Eyebrow as="h2" variant="section">{label}</Eyebrow>`

Visual: `text-[length:var(--text-micro)] leading-[var(--text-micro--line-height)] text-muted-foreground tracking-extra-display font-medium uppercase`

Exemplos no /r/[token]:

```tsx
// MetricsSection.tsx
<Reveal>
  <Eyebrow as="h2" variant="section">
    {result.sectionLabels?.metrics ?? t('metricsHeading')}
  </Eyebrow>
</Reveal>

// ObservationsSection.tsx, JourneySection.tsx, NutritionSection.tsx — idem
```

**Decisão de preservação:** semântica HTML é `<h2>` (a11y heading hierarchy). Visual é label, não display. Antes de Fase 47 isso era `<Heading level={2}>` com className override que produzia 20px h2 disfarçado de 10px label — bug de tw-merge. Fase 47 introduziu o variant `section` no primitive Eyebrow para resolver o caso central.

### §1.2 Card eyebrow (card-level inline label)

**Padrão canônico:** `<Eyebrow as="div" variant="card">{label}</Eyebrow>`

Visual: `text-[length:var(--text-micro)] text-muted-foreground tracking-display-wide font-medium uppercase`

Exemplos:

```tsx
// _components/MetricCard.tsx
<Eyebrow as="div" variant="card" className="mb-2 md:mb-3">
  {label ?? metric.label}
</Eyebrow>

// _components/MacroLegendItem.tsx
<Eyebrow variant="card">{label}</Eyebrow>
```

### §1.3 Hero accent eyebrow

**Padrão canônico:** `<Eyebrow as="p" variant="accent">{label}</Eyebrow>`

Visual: `font-medium uppercase text-[var(--color-accent)] tracking-display-wide` (inherits text-micro size from cva — note: pre-existing primitive limitation, see Anexo A).

Exemplo:

```tsx
// HeroSection.tsx — objective short label
<Eyebrow as="p" variant="accent">
  {objectiveShort}
</Eyebrow>
```

### §1.4 Mono eyebrow (timestamps, dates)

**Padrão canônico:** `<Eyebrow as="span" variant="mono">{label}</Eyebrow>`

Exemplo:

```tsx
<Eyebrow as="span" variant="mono" className="text-muted-foreground/60 tabular-nums">
  {new Date(result.createdAt).toLocaleDateString(...).toUpperCase()}
</Eyebrow>
```

---

## §2 Body / display typography

### §2.1 Body paragraphs (≥14px, regular paragraph copy)

**Padrão canônico:** `<Text variant="body-large">{text}</Text>` (16px) ou `<Text variant="body">{text}</Text>` (14px) com className para color/leading override.

Exemplo:

```tsx
// PillarsSection.tsx — popular description
<Text variant="body-large" className="leading-relaxed text-muted-foreground">
  {popular}
</Text>

// PapelProfissionalSection.tsx — body
<Text variant="body-large" className="leading-relaxed text-muted-foreground md:text-lg">
  {body}
</Text>
```

> **Nota:** Quando o body cresce em md (`md:text-lg`), o override é HEROIC e precisa de `eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic body typography canonical to /r/[token] (PADRAO-VALIDADO §2.4)`.

### §2.2 Body small / caption (10-13px)

**Padrão canônico:** `<Text variant="micro">{text}</Text>` ou `<Text variant="body-small">{text}</Text>`.

Pre-Fase 47 a primitive Text tinha `label`/`micro` usando custom utilities `text-label`/`text-micro` que tw-merge colapsava com qualquer `text-muted-foreground` override. **Fase 47 reescreveu esses variants com `text-[length:var(--text-X)]` arbitrary syntax** (compatível com tw-merge groups).

### §2.3 Heroic display headings

**Padrão canônico:** `<Heading level={N}>` com className arbitrário Tailwind (`text-2xl..8xl`) + `eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic typography canonical to /r/[token] (PADRAO-VALIDADO §2.3)`.

Exemplos:

```tsx
// PapelProfissionalSection — section heading (24-36px)
<Heading
  level={2}
  // eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic typography canonical to /r/[token] (PADRAO-VALIDADO §2.3)
  className="bc leading-tight mb-4 text-2xl uppercase md:mb-6 md:text-4xl"
>

// PillarsSection — pillars heading (36-60px)
<Heading
  level={2}
  // eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic typography canonical to /r/[token] (PADRAO-VALIDADO §2.3)
  className="bc leading-display text-4xl uppercase md:text-6xl"
>

// PillarsSection — pillar card title (24-30px)
<Heading
  level={3}
  // eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic typography canonical to /r/[token] (PADRAO-VALIDADO §2.3)
  className="bc mb-4 text-2xl leading-tight uppercase md:mb-5 md:text-3xl"
>
```

**Justificativa:** O DS define `--text-h1: 28px`, `--text-h2: 20px`, etc. — escala de aplicação. O `/r/[token]` é uma rota PÚBLICA com identidade visual heroica distinta (revista digital, não dashboard). Sizes 24-96px são parte canônica do visual do produto, não bypass acidental. A linha de demarcação:

- ✅ Heroic permitido em: `app/(public)/r/[token]/**`, `app/(public)/[slug]/**` (site), landing pages
- ❌ Heroic proibido em: shell interno (`app/(app)/**`), auth, onboarding, settings, admin

### §2.4 Heroic body italic (Libre Baskerville `lb` font)

**Padrão canônico:** `<p>` ou `<Text>` + className `lb italic` + `eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic body typography canonical to /r/[token] (PADRAO-VALIDADO §2.4)`.

Exemplos:

```tsx
// HeroSection — italic subtitle
<Heading
  level={2}
  // eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic subtitle canonical to /r/[token] (PADRAO-VALIDADO §2.3)
  className="lb mt-7 max-w-3xl text-lg italic leading-snug text-foreground/90 md:mt-10 md:text-2xl"
  dangerouslySetInnerHTML={{ ... }}
/>

// ClosingSection — emotional bridge italic
<p
  // eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic body typography canonical to /r/[token] (PADRAO-VALIDADO §2.4)
  className="lb text-xl italic leading-relaxed text-foreground/90 md:text-3xl"
>
  {ponte.bridge}
</p>
```

### §2.5 Hero h1 com clamp (firstName)

**Padrão canônico:** wrap o `<TextReveal as="h1">` com `<div style={{ fontSize: 'clamp(...)' }}>` para tamanho fluido.

Exemplo:

```tsx
// HeroSection.tsx
<div style={{ fontSize: 'clamp(3rem, 12vw, 7rem)' }}>
  <TextReveal
    as="h1"
    text={result.client.firstName}
    // eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic h1 canonical to /r/[token] (PADRAO-VALIDADO §2.3)
    className="bc leading-extra-tight block uppercase"
    stagger={0.05}
    delay={0.2}
  />
</div>
```

### §2.6 SVG `<text>` labels

**Padrão canônico:** SVG `<text>` com className `text-micro` ou `text-micro-xs uppercase` + `eslint-disable-next-line token-bypass/no-tailwind-bypass -- SVG text labels canonical to /r/[token] (PADRAO-VALIDADO §2.6)`.

SVG `<text>` aceita `text-transform: uppercase` (CSS), mas Tailwind utility é tratada como bypass pelo lint. Disable + reason canônica.

Exemplo:

```tsx
// JourneySection.tsx — TimelineViz milestones
<text
  x={x}
  y={subY}
  // eslint-disable-next-line token-bypass/no-tailwind-bypass -- SVG text labels canonical to /r/[token] (PADRAO-VALIDADO §2.6)
  className="text-micro-xs uppercase"
  fill="var(--color-muted-foreground)"
  letterSpacing="0.1em"
>
  {ms.sub}
</text>
```

---

## §3 CTAs e botões

### §3.1 Heroic CTA pill (primary action)

**Padrão canônico:** `<Button>` ou `<MagneticButton>` com className `bc rounded-full bg-[var(--color-accent)] ... uppercase text-[var(--color-accent-contrast)]` + `eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic CTA pill canonical to /r/[token] (PADRAO-VALIDADO §3.1)`.

Pill em rota pública é INTENT — não substituir por shape token de button regular.

Exemplo:

```tsx
// MobileNextStepCTA.tsx
<Button
  type="button"
  onClick={onOpen}
  // eslint-disable-next-line token-bypass/no-tailwind-bypass -- heroic CTA pill canonical to /r/[token] (PADRAO-VALIDADO §3.1)
  className="bc tracking-display-wide touch-target relative flex w-full ... rounded-full bg-[var(--color-accent)] ... uppercase ..."
>
```

### §3.2 Bottom-sheet container

**Padrão canônico:** `rounded-t-3xl` preservado (intent) com `eslint-disable-next-line ... -- heroic bottom-sheet shape ...`.

Bottom sheet com top corner enorme é affordance mobile padrão. Não substituir por `var(--shape-card)`.

### §3.3 Avatar fallback initial

**Padrão canônico:** `<div className="rounded-full bg-surface-2 ... text-xs font-bold">{initial}</div>` + disable.

`rounded-full` em avatar é intent. `text-xs font-bold` é affordance de letter — preserve.

---

## §4 Shape tokens (Etapa 4 sweep contract)

| Padrão          | Token canônico                  | Intent                                    |
| --------------- | ------------------------------- | ----------------------------------------- |
| `rounded-lg`    | `rounded-[var(--shape-card)]`   | Surface elevada (card, popover, dialog)   |
| `rounded-xl`    | `rounded-[var(--shape-card)]`   | Idem (rounded-xl = rounded-lg em maioria) |
| `rounded-2xl`   | `rounded-[var(--shape-card)]`   | Idem (variação visual)                    |
| `rounded-md`    | `rounded-[var(--shape-button)]` | Botão regular                             |
| `rounded`       | `rounded-[var(--shape-input)]`  | Input regular                             |
| `rounded-sm`    | `rounded-[var(--shape-badge)]`  | Badge / chip                              |
| `rounded-full`  | preserve                        | Pill / avatar / dot — intent              |
| `rounded-t-3xl` | preserve                        | Bottom sheet — affordance mobile          |

> Já cumprido em /r/[token]: 2 violations encontradas (rounded-t-3xl, ambas preservadas). Demais bypasses já estavam usando `rounded-[var(--shape-card)]` em pre-Fase 47 (Fase 45J/45K).

---

## §5 Cores

### §5.1 Cores de score / risk

| Pattern                              | Token canônico                     | Quando                     |
| ------------------------------------ | ---------------------------------- | -------------------------- |
| `border-orange-500`                  | `border-[var(--color-score-low)]`  | Risco alto (warning level) |
| `bg-orange-500/10`                   | `bg-[var(--color-score-low)]/10`   | Idem com transparência     |
| `text-orange-500`, `text-orange-400` | `text-[var(--color-score-low)]`    | Idem                       |
| `text-red-X`                         | `text-[var(--color-score-danger)]` | Risco crítico              |
| `text-green-X`                       | `text-[var(--color-score-high)]`   | Positivo / saudável        |
| `text-yellow-X`, `text-amber-X`      | `text-[var(--color-score-mid)]`    | Atenção média              |
| `text-blue-X`, `text-sky-X`          | `text-[var(--color-score-info)]`   | Info / hidratação          |
| `text-purple-X`, `text-violet-X`     | `text-[var(--color-score-accent)]` | Recomp / especial          |

Tokens `--color-score-*` definidos em `app/globals.css` com OKLCH dark+light variants (Lc≥60). Já validados em Fase 45J.

### §5.2 Cores de sistema (UI)

| Pattern                       | Token canônico                   |
| ----------------------------- | -------------------------------- |
| `text-{color}-foreground`     | preserve (semantic, theme-aware) |
| `bg-background`, `bg-surface` | preserve                         |
| `border-border`               | preserve                         |
| `text-[var(--color-accent)]`  | preserve                         |
| `bg-[var(--color-accent)]`    | preserve                         |

### §5.3 Hex/RGB inline em SVG attributes

**Padrão canônico:** SVG `stroke=` / `fill=` recebem `var(--color-X)` direto (CSS vars funcionam em SVG attributes em browsers modernos).

Antes:

```tsx
stroke = 'var(--color-border, #26262d)' // fallback hex desnecessário
fill = 'var(--color-muted-foreground, #8a8a93)'
```

Depois:

```tsx
stroke = 'var(--color-border)'
fill = 'var(--color-muted-foreground)'
```

> Removido em Fase 47: 2 fallback-hex em JourneySection.tsx.

---

## §6 A11y básico

### §6.1 SkipLink + landmark `<main>`

**Padrão canônico:** Toda page de rota pública (server component) injeta `<SkipLink label={t('a11y.skipToMain')} />` antes do `<main id="main-content">`.

Exemplo:

```tsx
// app/(public)/r/[token]/page.tsx
import { SkipLink } from '@/components/ui/skip-link'

export default async function ResultPage(...) {
  ...
  const a11y = await getTranslations('a11y')

  return (
    <>
      <SkipLink label={a11y('skipToMain')} />
      <main id="main-content" {...designAttrs} className="bg-background ...">
        <LeadReport ... />
      </main>
    </>
  )
}
```

> Fase 48 vai consolidar em layout para os 7 layouts. Fase 47 instala em /r/[token] como prova.

### §6.2 Nav `aria-label`

**Padrão canônico:** Todo `<nav>` recebe `aria-label`. Para nav decorativa (não principal), usar key i18n distinta.

```tsx
// HeroSection — fixed top nav with brand title
<motion.nav aria-label={a11y('skipToNav')} ...>
  ...
</motion.nav>
```

### §6.3 SVG decorativos

**Padrão canônico:** Todo `<svg>` com role="img" + aria-label OU aria-hidden="true".

- Risk icons no ObservationsSection: `aria-hidden="true"` (icons são decoração, label vem do texto adjacente)
- Timeline SVG no JourneySection: `role="img" aria-label={t('timelineAriaLabel')}`

### §6.4 Modal dialog

**Padrão canônico:** `<motion.div role="dialog" aria-modal="true" aria-labelledby={titleId}>` + `<motion.div role="presentation">` para backdrop.

Exemplo: NextStepSheet.tsx aplica isso.

---

## §7 i18n

Toda string de UI passa por `t()` de next-intl. Descobertas no /r/[token]:

- `Sua jornada na natação`, `Adaptação`, etc. (MetricsSection — eram hardcoded em PT, migradas para `features.leadReport.stepperSwimmingTitle` etc.)

A regra `react/jsx-no-literals` está em error nível. Disable + named reason quando string é símbolo (×, ↓, →, etc.) — a allowlist global cobre os comuns.

---

## §8 Componente decompose

Arquivos do /r/[token] tree:

| Arquivo                                            | Antes | Depois | Mudança                                                                               |
| -------------------------------------------------- | ----- | ------ | ------------------------------------------------------------------------------------- |
| `_sections/ProfessionalBlock.tsx`                  | 385l  | DEL    | Função dead `ProfessionalBlock` removida; MobileNextStepCTA + NextStepSheet extraídos |
| `_sections/MobileNextStepCTA.tsx` (novo)           | —     | 35l    | Extraído                                                                              |
| `_sections/NextStepSheet.tsx` (novo)               | —     | 270l   | Extraído com TypingDots                                                               |
| `_sections/MetricsSection.tsx`                     | 343l  | 235l   | MetricCard + MacroLegendItem extraídos                                                |
| `_sections/_components/MetricCard.tsx` (novo)      | —     | 51l    | Compartilhado entre Metrics + Nutrition (futuro)                                      |
| `_sections/_components/MacroLegendItem.tsx` (novo) | —     | 41l    | Idem                                                                                  |
| `_sections/NutritionSection.tsx`                   | 224l  | 201l   | Eyebrows + Text variant migration                                                     |
| `_sections/HeroSection.tsx`                        | 167l  | 175l   | Eyebrows + Text variant migration (+nav aria-label)                                   |
| `_sections/JourneySection.tsx`                     | 277l  | 288l   | Eyebrows + Text variant migration (+SVG role/aria-label)                              |
| `_sections/PillarsSection.tsx`                     | 133l  | 153l   | Eyebrow + Text variant migration                                                      |
| `_sections/ObservationsSection.tsx`                | 149l  | 153l   | Cores risk → score tokens + Eyebrow + Text                                            |
| `_sections/ClosingSection.tsx`                     | 131l  | 145l   | Eyebrow + Heading                                                                     |
| `_sections/PapelProfissionalSection.tsx`           | 28l   | 33l    | Heading + Text                                                                        |
| `_sections/Disclaimers.tsx`                        | 34l   | 35l    | Eyebrow asChild + Text                                                                |
| `LeadReport.tsx`                                   | 172l  | 174l   | Imports atualizados + wrapper limpo                                                   |
| `app/(public)/r/[token]/page.tsx`                  | 94l   | 103l   | SkipLink + main                                                                       |

Todos os arquivos < 300 linhas. Nenhum >300l no tree do /r/[token].

---

## §9 Comando de medida

Para checar regressão durante sweeps subsequentes:

```bash
# 1. Bypasses não-anotados em /r/[token] tree (DEVE SER 0)
grep -rE "text-(2|3|4|5|6|7|8)xl|rounded-(sm|md|lg|xl|2xl|3xl)|uppercase" \
  app/\(public\)/r \
  components/report/lead/_sections \
  components/report/lead/LeadReport.tsx \
  | grep -v "eslint-disable-next-line token-bypass/no-tailwind-bypass" \
  | grep -v "rounded-(full|t-3xl|tl-none)" \
  | wc -l

# 2. Anotações canônicas (ESPERADO: ~25 markers)
grep -rE "eslint-disable-next-line token-bypass/no-tailwind-bypass -- (heroic|canonical|SVG|avatar|close|typing|bc font|bottom-sheet)" \
  app/\(public\)/r \
  components/report/lead

# 3. Lint warnings dentro do tree
pnpm lint 2>&1 | awk '/components.report.lead.(_sections|hub).|components.report.lead.LeadReport|app.\(public\).r/{file=1; print; next} /^$/{file=0} file' | head -30
```

---

## §10 Arquivos NÃO em escopo

Os seguintes arquivos estão em `components/report/lead/` mas NÃO renderizam em /r/[token]:

- **`_sections/Ticker.tsx`** — Não é importado pelo LeadReport. Provavelmente dead após refactor anterior. Sweep posterior deve confirmar e deletar.
- **`hub/SpecialtyCard.tsx`** — Usado por `app/(public)/[slug]/analise/page.tsx` (rota /analise, não /r/[token]). Será refatorado em sweep que cobrir /analise.

Esses arquivos AINDA TÊM bypasses não-anotados — propositalmente fora do escopo da Fase 47.

---

## §11 Padrão para gauges (mantido de Fase 45J/45K)

Gauges SVG (`BmiArc`, `FfmiGauge`, `HrZoneArc`, `MacroDonut`, `WaterDrop`, etc.) já foram migrados em Fases 45J e 45K. Padrão validado:

- Cores via tokens `--color-score-*` (info/high/mid/low/danger/accent)
- Macro colors via `--color-macro-{water/carb/fat}`
- Charts wrap com `ChartContainer`/`ChartProvider` quando aplicável (45K)
- SVG inline OK para casos onde recharts é insuficiente (animação por segmento, morfologia orgânica)
- Tokens definidos em `app/globals.css` com dark+light variants OKLCH

Gauges NÃO precisam de re-refactor pela Fase 47 — apenas usá-los corretamente nos consumidores.

---

## Anexo A — Bug pré-existente do Eyebrow primitive (out of scope)

`Eyebrow` variants `default` e `accent` definem `text-{size} text-{color}` no mesmo cva string. tw-merge agrupa ambos como `text-*` e mantém só o último, dropando font-size. Resultado: span renderiza com font-size do parent, não com `text-label`/`text-micro`.

**Status:** Pré-existente, não introduzido pela Fase 47.

**Workaround válido:** Variants `mono`, `mono-xs`, `section`, `card` foram escritos com `text-[length:var(--text-X)]` arbitrary syntax — tw-merge classifica em font-size group separado do text-color, preservando ambos.

**Fix definitivo:** Reescrever `default` e `accent` no mesmo padrão. Pode ir em Fase 67 (Eyebrow sweep).

---

## Anexo B — Glossário de marcadores eslint-disable canônicos

Use estas frases EXATAS em comments de disable, para que sweeps reconheçam os marcadores:

| Categoria            | Frase canônica (após `--`)                                                                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Heroic typography    | `heroic typography canonical to /r/[token] (PADRAO-VALIDADO §2.3)`                                                                                         |
| Heroic body italic   | `heroic body typography canonical to /r/[token] (PADRAO-VALIDADO §2.4)`                                                                                    |
| Heroic h1 fluid      | `heroic h1 canonical to /r/[token] (PADRAO-VALIDADO §2.3)`                                                                                                 |
| Heroic subtitle      | `heroic subtitle canonical to /r/[token] (PADRAO-VALIDADO §2.3)`                                                                                           |
| Heroic decoration    | `heroic decorative watermark canonical to /r/[token] (PADRAO-VALIDADO §2.3)`                                                                               |
| Heroic metric value  | `heroic metric value canonical to /r/[token] (PADRAO-VALIDADO §2.3)`                                                                                       |
| SVG text             | `SVG text labels canonical to /r/[token] (PADRAO-VALIDADO §2.6)`                                                                                           |
| Heroic CTA pill      | `heroic CTA pill canonical to /r/[token] (PADRAO-VALIDADO §3.1)`                                                                                           |
| Heroic CTA secondary | `heroic secondary CTA canonical to /r/[token] (PADRAO-VALIDADO §3.1)`                                                                                      |
| Heroic CTA link      | `heroic CTA link canonical to /r/[token] (PADRAO-VALIDADO §3.1)`                                                                                           |
| Bottom-sheet         | `heroic bottom-sheet shape canonical to /r/[token] (PADRAO-VALIDADO §3.2)`                                                                                 |
| Avatar fallback      | `avatar fallback initial canonical to /r/[token] (PADRAO-VALIDADO §3.3)`                                                                                   |
| Close button         | `close button visual size canonical to /r/[token] (PADRAO-VALIDADO §3.1)` ou `close button size canonical to /r/[token] (PADRAO-VALIDADO §3.1)`            |
| Typing bubble        | `typing bubble shape canonical to /r/[token] (PADRAO-VALIDADO §3.2)`                                                                                       |
| bc font + override   | `bc font + accent color overrides canonical to /r/[token] (PADRAO-VALIDADO §2.3)` ou `bc font + grow at md canonical to /r/[token] (PADRAO-VALIDADO §2.3)` |

---

## Anexo C — Métricas antes/depois /r/[token]

| Métrica                                  | Antes   | Depois | Variação                             |
| ---------------------------------------- | ------- | ------ | ------------------------------------ |
| Lint errors (whole repo)                 | 0       | 0      | manter                               |
| Lint warnings (whole repo)               | 2172    | 2085   | −87 (sweep colateral em /r/[token])  |
| Bypasses não-anotados em /r/[token]      | ~120    | 0      | −120                                 |
| Anotações canônicas em /r/[token]        | 21      | ~30    | reformuladas + decompose             |
| Tw palette colors (orange) em /r/[token] | 5       | 0      | substituído por tokens score         |
| Hex inline em /r/[token]                 | 2       | 0      | tokens via SVG attrs                 |
| Arquivos > 300l em /r/[token]            | 2       | 0      | decompose 2 (Professional + Metrics) |
| Arquivos novos                           | —       | 4      | 2 extraídos + 2 shared components    |
| SkipLink em /r/[token]                   | 0       | 1      | +1 (a11y básico)                     |
| `<main>` landmark                        | 0       | 1      | +1                                   |
| `<nav>` com aria-label                   | 0       | 1      | +1                                   |
| `<svg>` com role="img" / aria-hidden     | parcial | 100%   | todos cobertos                       |

---

## §12 Fluxo recomendado para terminais de sweep

Quando uma fase de sweep (51-75) for executar:

1. Ler PADRAO-VALIDADO.md — identificar a §X relevante (shape, typography, casing, cores, a11y).
2. Aplicar substituição literal por categoria seguindo o mapeamento.
3. Para cada arquivo com violação resolvida via disable, usar **EXATAMENTE** a frase canônica do Anexo B (case-sensitive) para que sweeps subsequentes (Fase 157) reconheçam o marcador como canônico (não regressão).
4. Para casos não cobertos pelo PADRAO, **PARAR e perguntar fundador**. Não inventar nova categoria sem aprovação.

---

**Fim do PADRAO-VALIDADO.md.**

> Mudanças neste documento exigem aprovação do fundador. Histórico de modificações ao final da Fase 47 (initial draft).
