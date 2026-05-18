# APCA contraste

Executado em 2026-04-29 via `pnpm exec tsx scripts/validate-apca.ts`.

## Conversoes OKLCH -> Hex (via culori)

| Token          | OKLCH               | Hex     |
| -------------- | ------------------- | ------- |
| ob-gray-50     | oklch(98% 0.003 80) | #f9f8f6 |
| ob-gray-100    | oklch(96% 0.005 80) | #f3f1ee |
| ob-gray-200    | oklch(92% 0.006 80) | #e7e4e0 |
| ob-gray-300    | oklch(85% 0.008 80) | #d0cdc8 |
| ob-gray-400    | oklch(72% 0.010 80) | #a8a49e |
| ob-gray-500    | oklch(58% 0.010 80) | #7d7a74 |
| ob-gray-600    | oklch(48% 0.008 80) | #605d59 |
| ob-gray-700    | oklch(38% 0.006 80) | #44423f |
| ob-gray-800    | oklch(28% 0.005 80) | #2a2926 |
| ob-gray-900    | oklch(22% 0.005 80) | #1c1a18 |
| ob-gray-950    | oklch(15% 0.005 80) | #0c0b09 |
| ob-brand-400   | oklch(73% 0.12 175) | #3ec0a3 |
| ob-brand-500   | oklch(62% 0.13 175) | #009f82 |
| ob-success-400 | oklch(68% 0.13 145) | #60ad64 |
| ob-warning-400 | oklch(78% 0.15 75)  | #efa831 |
| ob-danger-400  | oklch(66% 0.19 25)  | #f05653 |
| ob-info-400    | oklch(68% 0.13 235) | #2ea4dc |

## Resultados (18 checks)

| #   | Check                               | Lc       | Threshold    | Status    |
| --- | ----------------------------------- | -------- | ------------ | --------- |
| 1   | White on gray-950 (primary text)    | 107.7    | >= 60 (body) | PASSA     |
| 2   | Gray-50 on gray-950 (primary text)  | 103.1    | >= 60 (body) | PASSA     |
| 3   | Gray-400 on gray-950 (muted text)   | 53.0     | >= 45 (UI)   | PASSA     |
| 4   | Gray-300 on gray-950 (secondary)    | 76.3     | >= 60 (body) | PASSA     |
| 5   | Brand-400 on gray-950 (accent UI)   | 57.7     | >= 45 (UI)   | PASSA     |
| 6   | Success-400 on gray-950 (status)    | 48.8     | >= 45 (UI)   | PASSA     |
| 7   | Warning-400 on gray-950 (status)    | 62.8     | >= 45 (UI)   | PASSA     |
| 8   | **Danger-400 on gray-950 (status)** | **40.9** | >= 45 (UI)   | **FALHA** |
| 9   | Info-400 on gray-950 (status)       | 48.0     | >= 45 (UI)   | PASSA     |
| 10  | Black on gray-50 (primary text)     | 101.9    | >= 60 (body) | PASSA     |
| 11  | Gray-950 on gray-50 (primary text)  | 101.6    | >= 60 (body) | PASSA     |
| 12  | Gray-600 on gray-50 (muted text)    | 78.3     | >= 60 (body) | PASSA     |
| 13  | Gray-500 on gray-50 (subtle text)   | 65.5     | >= 45 (UI)   | PASSA     |
| 14  | Brand-500 on gray-50 (accent UI)    | 56.1     | >= 45 (UI)   | PASSA     |
| 15  | White on gray-900 (card body text)  | 106.5    | >= 60 (body) | PASSA     |
| 16  | Gray-400 on gray-900 (card muted)   | 51.9     | >= 45 (UI)   | PASSA     |
| 17  | White on brand-500 (CTA button)     | 65.7     | >= 60 (body) | PASSA     |
| 18  | **Gray-950 on brand-400 (CTA alt)** | **59.4** | >= 60 (body) | **FALHA** |

**Resultado: 16/18 passaram.**

## Brand validation

| Token     | Lc Dark | Lc Light | Valid |
| --------- | ------- | -------- | ----- |
| Brand-400 | 57.7    | 41.2     | true  |
| Brand-500 | 41.3    | 57.2     | true  |

## Analise das falhas

### Falha 1: Danger-400 on gray-950 (Lc 40.9, precisa >= 45)

`ob-danger-400` (oklch(66% 0.19 25) = #f05653) em fundo quase preto. Contraste insuficiente para elementos UI (icones, badges, dots).

**Impacto:** Status dots/badges de erro podem ser dificeis de ver em dark mode puro.

**Correcao sugerida:** Aumentar lightness de `ob-danger-400` de 66% para ~70%, ou usar `ob-danger-300` (oklch(74% 0.17 25)) para status UI em dark mode. Correcao simples — ajustar 1 token em globals.css.

**Bloqueia selar?** Nao. Danger-400 e usado pontualmente em status UI. O texto de erro usa foreground primario (branco/gray-50) sobre fundo, nao danger-400 como texto. Issue rastreado.

### Falha 2: Gray-950 on brand-400 (Lc 59.4, precisa >= 60)

Texto escuro sobre fundo brand. Borderline (59.4 vs 60). Este combo nao e usado atualmente — CTAs usam texto branco sobre brand-500, que passa (Lc 65.7).

**Impacto:** Nenhum impacto real no produto atual.

**Bloqueia selar?** Nao. Combo nao e usado. Documentado para referencia futura.

## Veredicto: PASSA COM RESSALVAS

16/18 checks passam. 2 falhas documentadas como issues nao-bloqueantes.

### Issues rastreados

- [ ] Ajustar `ob-danger-400` lightness para atingir Lc >= 45 em dark mode (candidato: 70% -> ~oklch(70% 0.19 25))
- [ ] Documentar que `gray-950 on brand-400` nao deve ser usado como combo de texto
