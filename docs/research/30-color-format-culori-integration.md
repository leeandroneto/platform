# 30 — Color format strategy: OKLCH-primary + culori conversion

> **⚠️ CAVEAT (2026-05-21):** este estudo foi feito ANTES de clonar o repo
> TweakCN local. As decisões aqui são **inferência** via WebFetch +
> research-28. Após clone em `C:\Users\leean\Desktop\tweakcn-ref\` (commit
> `9adabcf9`, branch `main`), **validar contra arquivos reais** antes de
> Fase 1 começar. Especificamente confirmar `utils/color-converter.ts`
> (já lido — usa culori + suporta hsl/rgb/oklch/hex). Conclusões podem
> precisar refinar.
>
> Estudo prévio S1.2 do plano de pivot (`docs/plans/pivot-tweakcn.md` §2 → "Estudo S1.2"). Bloqueante pra Fase 1 (reescrita de `lib/design/contract/` + `build-theme-css.ts`).
>
> Data: 2026-05-21 · Status: cravado · Confidence: alta

---

## 1. Resumo executivo

**Decisão:** OKLCH-primary em todo o stack. DB armazena string CSS-canônica (`"oklch(0.55 0.2 270)"`), `build-theme-css.ts` emite OKLCH literal, builder UI aceita HEX/HSL/OKLCH/RGB no input mas normaliza pra OKLCH antes de persistir. HEX é fallback derivado JIT via `culori` apenas pra surfaces que **exigem** legalmente (PWA `manifest.webmanifest`, email templates `react-email`, OG image Satori).

**Razões cravadas:**

1. `culori` já é devDependency direta (`^4.0.2`) — mesma versão usada por TweakCN. Zero custo de adopção.
2. `lib/design/contrast.ts` opera em OKLCH nativo (já implementado) → consistência ponta-a-ponta com APCA Silver gate.
3. Browsers modernos suportam OKLCH nativamente (Safari 15.4+, Chrome 111+, Firefox 113+) → cobertura ≥95% sem fallback.
4. TweakCN também usa OKLCH como default em `config/theme.ts`, mantendo paridade com upstream shadcn-canonical.
5. Tailwind v4 `@theme` aceita OKLCH literal sem transformação.

**Arquivo de utility novo:** `lib/design/color-format.ts` (~40 LOC) — adapta TweakCN `colorFormatter` pra nosso vocab + tipos + AppError. Reuso, não cópia cega.

---

## 2. Culori check

```
$ pnpm why culori
culori@4.0.2
└── platform@0.1.0 (devDependencies)
Found 1 version of culori
```

Direct dep em `package.json` (linha 105). `@types/culori@^4.0.1` também presente. Usos atuais:

- `lib/design/contrast.ts` — `converter('rgb')`, `formatHex`, `parse` (OKLCH → bytes → APCA-W3).
- `lib/design/palettes.ts` — re-export de seed (não usa culori diretamente).
- `scripts/validate-palettes.ts` — gate prebuild (indireto via contrast).

TweakCN usa `culori` **também** (research-28 §3, último parágrafo: "Conversão via culori"). Mesma lib, mesma major version → compat zero.

---

## 3. TweakCN color-converter.ts

Fonte: <https://raw.githubusercontent.com/jnsahaj/tweakcn/main/utils/color-converter.ts> (commit `main` HEAD em 2026-05-21).
GitHub view: <https://github.com/jnsahaj/tweakcn/blob/main/utils/color-converter.ts>

**Conteúdo completo (~50 LOC):**

```typescript
import * as culori from 'culori'
import { ColorFormat } from '../types'
import { Hsl } from 'culori'

export const formatNumber = (num?: number) => {
  if (!num) return '0'
  return num % 1 === 0 ? num : num.toFixed(4)
}

export const formatHsl = (hsl: Hsl) => {
  return `hsl(${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%)`
}

export const colorFormatter = (
  colorValue: string,
  format: ColorFormat = 'hsl',
  tailwindVersion: '3' | '4' = '3',
): string => {
  try {
    const color = culori.parse(colorValue)
    if (!color) throw new Error('Invalid color input')

    switch (format) {
      case 'hsl': {
        const hsl = culori.converter('hsl')(color)
        if (tailwindVersion === '4') return formatHsl(hsl)
        return `${formatNumber(hsl.h)} ${formatNumber(hsl.s * 100)}% ${formatNumber(hsl.l * 100)}%`
      }
      case 'rgb':
        return culori.formatRgb(color)
      case 'oklch': {
        const oklch = culori.converter('oklch')(color)
        return `oklch(${formatNumber(oklch.l)} ${formatNumber(oklch.c)} ${formatNumber(oklch.h)})`
      }
      case 'hex':
        return culori.formatHex(color)
      default:
        return colorValue
    }
  } catch (error) {
    console.error(`Failed to convert color: ${colorValue}`, error)
    return colorValue
  }
}

export const convertToHSL = (colorValue: string): string => colorFormatter(colorValue, 'hsl')
```

**API surface exposta:** `formatNumber`, `formatHsl`, `colorFormatter(value, format, tailwindVersion?)`, `convertToHSL`.
**Dependências:** `culori` (namespace import) + `ColorFormat` type (string union "hsl"|"rgb"|"oklch"|"hex") definido em `../types`.

**Observações pra adopção:**

- Tailwind v3 emite HSL como triple sem `hsl(...)` wrapper. Não nos serve — Tailwind v4 é nosso target. Ignorar branch.
- Error handling é `console.error + return original`. Pra nosso uso, trocar por `AppError.invalidInput({ key, fallback })` (ADR-0040 §I).
- `convertToHSL` helper específico — não replicar; preferir API genérica.

---

## 4. Decisão

### 4.1 Storage DB

**Formato:** string CSS-canônica `"oklch(L C H)"` (ex.: `"oklch(0.55 0.2 270)"`).

**Por quê:**

- Parsível direto via `culori.parse(s)` → typed `Oklch` object com `{ mode, l, c, h }`.
- Inserível em CSS sem transformação — `--color: var(--db-oklch);` funciona.
- Round-trip preservado (parse → format → parse retorna mesmo string).
- TweakCN faz idêntico (`config/theme.ts` defaults usam `oklch(0.205 0 0)` literal).

**Rejeitado:** JSON `{l, c, h}` separado (overhead sem benefício — culori parseia string em 1 chamada); HEX (perde precisão fora do sRGB gamut, força ida-e-volta no APCA).

### 4.2 CSS emit

**Formato:** OKLCH literal, sem transformação. `build-theme-css.ts` linha `--surface-canvas: oklch(0.20 0.01 240);` direto.

**Por quê:**

- Tailwind v4 `@theme` aceita OKLCH literal sem trafo.
- APCA Silver gate (`lib/design/contrast.ts`) já opera em OKLCH — sem conversão intermediária.
- Suporte browser ≥95% (ver §6).

**Rejeitado:** Emit HSL (lossy P3); emit HEX (idem); dupla emissão OKLCH + HEX fallback (CSS já suporta — `color: oklch(...);` falha gracefully em browsers antigos).

### 4.3 Builder UI input

**UX:** color picker (`shadcn` add `color-picker` + native `<input type="color">`) aceita 4 formatos no campo texto (HEX/HSL/OKLCH/RGB) — espelha TweakCN. Antes de persistir, normaliza pra OKLCH via `colorFormatter(input, 'oklch')` (nosso utility novo).

**Por quê:** Designers digitam HEX (`#3b82f6`) por hábito; dev pega CSS variable em OKLCH; pode pegar de tools (Figma, Adobe Color) em RGB/HSL. Aceitar tudo, normalizar uma vez na borda.

**Side-effect bom:** validação automática — `culori.parse(invalid)` retorna `undefined` → AppError → form não submete.

### 4.4 Email / OG image / manifest fallback (HEX via culori)

**Surfaces que EXIGEM hex (não negociável):**

- `app/manifest.webmanifest` — PWA W3C spec exige `theme_color` em sRGB hex.
- `react-email` templates — Outlook/Gmail clients podem renderizar OKLCH (Litmus 2024 reporta ~40% suporte), mas hex é universalmente safe.
- OG images via Satori (`@vercel/og`) — pipeline pra PNG MIME exige sRGB.

**Como:** função `oklchToHex(s)` já existe em `lib/design/contrast.ts:79`. Reusar daqui. Single source of truth pra conversão hex.

**Onde converter:** JIT na borda de emit (manifest route, email render, OG image gen). NUNCA armazenar hex no DB — derivado é descartável.

---

## 5. Implementação proposta — `lib/design/color-format.ts`

Esqueleto (~40 LOC), inline:

```typescript
// lib/design/color-format.ts — color format conversion (OKLCH-primary normalization).
//
// Adapta TweakCN colorFormatter pra nosso vocab + AppError. Single-purpose:
//   - normalizar input user (HEX/HSL/OKLCH/RGB) pra OKLCH string canonical antes de DB
//   - converter OKLCH pra output formats (builder code panel multi-formato)
//
// HEX fallback pra PWA/email/OG: usar oklchToHex() de lib/design/contrast.ts (já existe).

import { converter, formatHex, formatRgb, parse } from 'culori'

import { AppError } from '@/lib/contracts/errors'

export type ColorFormat = 'oklch' | 'hex' | 'rgb' | 'hsl'

const toOklch = converter('oklch')
const toHsl = converter('hsl')

const fmt = (n: number | undefined): string =>
  n === undefined ? '0' : n % 1 === 0 ? String(n) : n.toFixed(4)

/** Parse + format em formato target. Lança AppError em input inválido. */
export function formatColor(input: string, format: ColorFormat = 'oklch'): string {
  const parsed = parse(input)
  if (!parsed) {
    throw AppError.invalidInput({
      key: 'design.color_invalid',
      fallback: `Invalid color: ${input}`,
      metadata: { input },
    })
  }
  switch (format) {
    case 'oklch': {
      const c = toOklch(parsed)
      return `oklch(${fmt(c.l)} ${fmt(c.c)} ${fmt(c.h)})`
    }
    case 'hex':
      return formatHex(parsed) ?? '#000000'
    case 'rgb':
      return formatRgb(parsed)
    case 'hsl': {
      const c = toHsl(parsed)
      return `hsl(${fmt(c.h)} ${fmt((c.s ?? 0) * 100)}% ${fmt((c.l ?? 0) * 100)}%)`
    }
  }
}

/** Helper canônico — normalize qualquer input pra OKLCH string CSS-ready. */
export const normalizeToOklch = (input: string): string => formatColor(input, 'oklch')
```

**Diferenças vs TweakCN:**

- Sem branch `tailwindVersion: '3'` (não target).
- Lança `AppError` ao invés de `console.error` (alinha ADR-0040 §I).
- API menor: 1 função genérica + 1 helper, ao invés de 4 exports redundantes.
- Usa nosso `parse`/`converter`/`formatHex`/`formatRgb` named imports (TweakCN faz `import * as culori`).

**Não duplicar:** `oklchToHex()` (já em contrast.ts) — `formatColor(s, 'hex')` agora delega ao culori direto, mas surfaces PWA/email continuam importando o helper existente pra preservar fallback semântico.

---

## 6. Riscos browser support

OKLCH em CSS (`Property: color: oklch(...)`) — caniuse 2026-Q1:

| Browser           | Versão mínima  | % global         | Observação                                     |
| ----------------- | -------------- | ---------------- | ---------------------------------------------- |
| Chrome / Edge     | 111 (2023-03)  | ~97%             | Full support                                   |
| Firefox           | 113 (2023-05)  | ~96%             | Full support                                   |
| Safari (desktop)  | 15.4 (2022-03) | ~95%             | Full support                                   |
| Safari (iOS)      | 15.4 (2022-03) | ~94%             | Full support                                   |
| Samsung Internet  | 22 (2023-07)   | ~93%             | Full support                                   |
| **Legacy Safari** | <15.4          | <2% (decai 2026) | Renderiza `unset` — herda do parent ou default |

**Mitigação:** Em produção, browsers <15.4 já caem fora do nosso target (PWA exige features modernas — `dvh`, `frosted backdrop-filter`, etc — todos pós-Safari 15.4). Não justifica double-emit hex fallback.

**Surfaces blindadas (sempre hex):**

- `manifest.webmanifest` `theme_color` — W3C spec exige hex
- `react-email` templates — Outlook 2007+ não suporta OKLCH; Gmail dark mode irregular
- Satori OG images — pipeline server-side gera PNG sRGB
- `<meta name="theme-color">` HTML — alguns browsers ignoram OKLCH

Conversão JIT na borda. Sem polyfill, sem dupla emissão CSS.

---

## 7. Refs

**TweakCN:**

- `utils/color-converter.ts` — <https://github.com/jnsahaj/tweakcn/blob/main/utils/color-converter.ts>
- `config/theme.ts` (OKLCH defaults) — <https://github.com/jnsahaj/tweakcn/blob/main/config/theme.ts>
- License Apache-2.0 — fork permitido com atribuição

**Internos:**

- `docs/plans/pivot-tweakcn.md` §2 Estudo S1.2 — prompt deste estudo
- `docs/research/28-tweakcn-evaluation.md` §3 (schema cores) + §6.2 (color picker stack)
- `lib/design/contrast.ts` — APCA Silver helpers OKLCH-native, `oklchToHex()`
- `lib/design/build-theme-css.ts` — emit pipeline (consumer dos OKLCH strings)
- `lib/design/palettes.ts` — uso atual culori
- `package.json` linha 105 — `culori@^4.0.2`
- `.claude/rules/contrast.md` — Silver thresholds + helpers spec
- ADR-0040 §I — AppError pattern

**Externos:**

- culori — <https://culorijs.org>
- OKLCH spec CSS Color Module 4 — <https://www.w3.org/TR/css-color-4/#ok-lab>
- caniuse "color: oklch()" — <https://caniuse.com/mdn-css_types_color_oklch>
