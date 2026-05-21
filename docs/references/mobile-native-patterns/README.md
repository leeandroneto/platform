# Mobile-Native + PWA Patterns — Canon Reference

> Pesquisa externa Passo 1.6 — alimenta o sistema de design do **PWA aluno** (desafit). NÃO inclui opinião: só canon validado por Apple HIG, Material Design 3, W3C/MDN.

**Por que isso existe:** o PWA aluno é caso especial cross-archetype. Os 18 archetypes (`docs/design-system/15-archetype-curation.md`) governam landing/admin/marketing dos sites tenants. O app do aluno, porém, precisa de comportamento mobile-nativo consistente — drag de sheet, snap points, safe-area, target floor — independente do archetype escolhido. Daí o split em duas layers:

| Layer              | O que é                                                                                          | Atitude                                                |
| ------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| **A — Structural** | Bottom nav, sheets, top bar, safe-area, targets, gestures, app shell, install, motion _floors_   | **FIXO** cross-archetype. Não negociar.                |
| **B — Stylistic**  | Cor, radius, sombra, motion _timing_, type family/scale, ícone stroke, foto aspect, frost opt-in | **VARIA** herdando do archetype escolhido pelo tenant. |

A matriz completa Layer A vs B está em [`11-variability-matrix.md`](./11-variability-matrix.md).

---

## Índice

| #   | Arquivo                                                    | Tópico                                          |
| --- | ---------------------------------------------------------- | ----------------------------------------------- |
| 01  | [`01-bottom-navigation.md`](./01-bottom-navigation.md)     | iOS Tab Bar + Material 3 Navigation Bar         |
| 02  | [`02-bottom-sheets.md`](./02-bottom-sheets.md)             | iOS detents + Material BottomSheet              |
| 03  | [`03-fab.md`](./03-fab.md)                                 | Floating Action Button (Material) vs iOS evitar |
| 04  | [`04-top-bar.md`](./04-top-bar.md)                         | iOS Navigation Bar + Material Top App Bar       |
| 05  | [`05-safe-area.md`](./05-safe-area.md)                     | `env(safe-area-inset-*)` + `viewport-fit=cover` |
| 06  | [`06-touch-targets.md`](./06-touch-targets.md)             | 44pt vs 48dp + spacing                          |
| 07  | [`07-gestures.md`](./07-gestures.md)                       | Swipe, pull-to-refresh, momentum, long-press    |
| 08  | [`08-app-shell.md`](./08-app-shell.md)                     | Shell architecture + service worker caching     |
| 09  | [`09-pwa-standalone.md`](./09-pwa-standalone.md)           | Manifest + splash + 3 fluxos de install         |
| 10  | [`10-native-feel-premium.md`](./10-native-feel-premium.md) | Frost glass, motion premium, haptic             |
| 11  | [`11-variability-matrix.md`](./11-variability-matrix.md)   | Matriz fixed vs varia per archetype             |

---

## Top-5 patterns canon mais críticos pra desafit

1. **Bottom nav 3–5 destinos, ~56–80dp altura, safe-area-inclusive** — base de navegação do app aluno (Hoje · Programa · Comunidade · Perfil)
2. **Bottom sheet com detents medium/large + drag handle** — sheet é o vocabulário primário pra ações secundárias (filtros, comentário, share, exercício detail)
3. **Safe area first-class** — `viewport-fit=cover` + `env(safe-area-inset-*)` em `padding`/`height` de TODO chrome (top bar, bottom nav, sheets, FAB se houver)
4. **Touch floor 48px universal** — adotar Material (48dp) como floor, fica acima do iOS (44pt) → cobre ambos sem ramificar
5. **App shell + service worker (Workbox) cache-first** — chrome instantâneo, conteúdo via network-first; required pra feel "nativo"

## Top-5 patterns que NÃO usaremos

1. **FAB Material** — só se houver UMA primary action por tela óbvia. PWA aluno provavelmente NÃO terá (CTAs ficam no topo de cada card/programa). Documentado em `03-fab.md` pra "quando NÃO usar"
2. **Material 3 Expressive playful shapes** (squircles aleatórios, accents vibrantes) — escolhido apenas se archetype Y2K/Bauhaus pede. Default = nem isso
3. **iOS Dynamic Type completo** (preferred-size com 12 categorias) — complexidade alta, retorno baixo. Usamos `rem` + `prefers-reduced-motion` apenas
4. **`overscroll-behavior: none` global** — quebra pull-to-refresh em Android. Usar `contain` localizado em sheets/modais
5. **Splash matrix iOS completa** (≈14 imagens) — adicionar incrementalmente; iniciar com `apple-touch-icon` e theme-color. Splash sob demanda

---

## Princípio de leitura

Cada arquivo segue 4 seções:

1. **Canon** — citação verbatim Apple/Google/W3C quando disponível
2. **Specs numéricas** — heights, dp, pt, thresholds
3. **Implicação desafit** — pseudo-código CSS/TSX concreto pra nosso PWA aluno
4. **Layer B varia?** — o que o archetype pode customizar sem quebrar UX

## Fontes-base usadas

- Apple HIG: <https://developer.apple.com/design/human-interface-guidelines/>
- Material Design 3: <https://m3.material.io/>
- web.dev PWA + safe area + manifest
- MDN: env(), Vibration API, overscroll-behavior, manifest display
- WHATWG/W3C: Web App Manifest, Service Worker spec

## Como usar este corpus

- **Passo 3+ do plano `14-transformation-plan.md`:** ao desenhar tokens mobile/contracts/components do PWA aluno, consultar Layer A em cada tópico. Não inventar — só compor.
- **ADR-0040 (PWA aluno tokens):** referência canônica deste corpus pra justificar floors e fixed-points.
- **Archetype curation:** Layer B varia matrix (`11-`) define o que cada archetype pode tocar do app aluno.
