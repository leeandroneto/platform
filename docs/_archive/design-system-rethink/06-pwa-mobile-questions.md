# 06. PWA + Mobile — perguntas críticas

> Status: hipóteses técnicas + perguntas em aberto (várias bloqueantes)
> Última atualização: 2026-05-19
> Bloqueado por: pesquisa 30 (PWA tenant theming) — não despachada

---

## Pergunta-mãe

**Swap de templates/paletas funciona em PWA mobile, ou é viável só em desktop?**

Essa pergunta destrava OU bloqueia toda estratégia. Se PWA mobile não comporta troca, multi-tenant white-label tem limitação severa em iOS.

---

## Sub-perguntas técnicas

### Q1 — Manifest dinâmico per tenant

**Hipótese H6 (em `01-hypotheses.md`):** API route gera `manifest.webmanifest` per tenant via subdomain.

**Mecânica proposta:**

```
GET /api/manifest/[tenant].webmanifest
  ↓ lê tenant.brand_id, palette_id, template_id do DB
  ↓ gera JSON com:
    - name, short_name, description (tenant brand)
    - theme_color (palette resolved)
    - background_color (template surface canvas)
    - icons (Satori-generated per logo + palette)
    - display: standalone
    - start_url: /
    - scope: /
```

**Risco crítico:** **install prompt iOS pode "congelar" manifest** depois de instalado. Se profissional muda template → ícone na home screen do cliente NÃO atualiza. Quebra UX.

**Riscos secundários:**

- Google/Apple policy contra manifest dinâmico (não documentado, precisa verificar)
- Service worker scope conflicting per subdomain

### Q2 — Splash screens iOS

**Pesquisa 26 caveat:** `apple-touch-startup-image` é **undocumented pós-iOS 16**.

Comunidade reverte-engenheirou matriz via media queries pixel-perfect. Cada device tem viewport diferente:

```html
<link
  rel="apple-touch-startup-image"
  href="/api/splash/[tenant]/iphone-16-pro-max.png"
  media="(device-width: 440px) and (device-height: 956px)
             and (-webkit-device-pixel-ratio: 3)"
/>
```

**Top devices iOS 2026 (8+ resoluções):**

- iPhone 14/14 Plus/14 Pro/14 Pro Max
- iPhone 15/15 Plus/15 Pro/15 Pro Max
- iPhone 16/16 Plus/16 Pro/16 Pro Max
- iPad Mini, iPad, iPad Pro 11", iPad Pro 12.9"

= 12-16 splash screens × N tenants. Gerar via Satori on-demand é viável.

**Estratégia:**

- API `/api/splash/[tenant]/[device].png` (gera via Satori + cacheia)
- `<head>` lista 12-16 link tags com media queries
- Cache CDN agressivo (mesmo tenant + device = mesmo PNG)

**Custo computacional:** ~50ms per splash gerado. Cache forever.

### Q3 — PWA install: 3 fluxos distintos

Pesquisa 26 caveat #6:

1. **Chromium (Android, desktop):** `BeforeInstallPromptEvent` (non-standard mas funciona)
2. **iOS Safari:** sem prompt automático. Manual via Share menu → "Add to Home Screen"
3. **Safari macOS 17+:** Add to Dock (botão no menu)
4. **Firefox desktop:** sem install manifest-based

**Implicação:** UX install precisa **3 fluxos guiados separados**:

- Chromium: botão "Instalar app" → fire `beforeinstallprompt`
- iOS: modal "Como instalar no iPhone" com screenshots Share menu
- Firefox: simplesmente não oferece install

### Q4 — EU users iOS 17.4+

Pesquisa 26 caveat: EU users com iOS 17.4+ podem ter "browser-tab experience" (sandbox limitado).

PWA pode rodar com menos features. Quais features degradam graciosamente?

- Push notifications: degradar (não disponível)
- Offline mode: degrada (Serwist limitado)
- Splash screens: degrada (browser tab)
- Add to home screen: pode não funcionar

**Estratégia:** detectar EU + iOS 17.4+ → mostrar UI sem promessas de "instalar como app".

### Q5 — Safe-area-inset + viewport-fit

Mobile premium PWA precisa:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
```

```css
:root {
  --safe-area-top: env(safe-area-inset-top, 0);
  --safe-area-bottom: env(safe-area-inset-bottom, 0);
  --safe-area-left: env(safe-area-inset-left, 0);
  --safe-area-right: env(safe-area-inset-right, 0);
}

body {
  padding-top: var(--safe-area-top);
  padding-bottom: var(--safe-area-bottom);
}
```

**Gap atual:** pesquisa 27 confirmou **nenhuma das 11 DESIGN.md cobriu safe-area-inset**. Gap real.

→ Pesquisa 30 dedicada.

### Q6 — Service worker tenant-scoped

Serwist + multi-tenant exige:

- SW registra com scope = subdomain do tenant (`acme.desafit.app/`)
- Cache name = `cache-${tenant_id}-v${version}`
- Routes patterns filtrados por tenant

**Risco:** se 2 tenants subdomain compartilham mesma origin (apex), SW interfere cross-tenant. Solução: subdomain isolation real OR SW per-route filtering rigoroso.

**Hipótese:** subdomain isolation (cada tenant = subdomain próprio) garante SW próprio.

### Q7 — Template swap em runtime após instalado

**Cenário:** tenant pediu Editorial-Serif. Cliente do tenant instalou PWA. Tenant decide mudar pra Soft-Productive.

**O que muda:**

| Componente             | Comportamento esperado                              |
| ---------------------- | --------------------------------------------------- |
| `<html data-template>` | Próxima visita reflete novo template ✅             |
| Manifest cached        | iOS pode mostrar app antigo na home screen ⚠️       |
| Icons                  | Atualizam na próxima visita web mas ícone fixed iOS |
| Splash screen          | Não atualiza em iOS instalado                       |
| Service worker cache   | Atualiza após `skipWaiting`                         |

**Implicação:** **dia 1, tenant não troca template depois de PWA instalada por clientes.** Decisão = lock após primeira instalação OR documentar como limitação.

**Alternativa Fase 2:** força "atualizar app" workflow (notification + URL re-add).

### Q8 — Mobile gestures premium

Marcas premium em mobile exibem:

- Pull-to-refresh (Twitter, Instagram)
- Swipe-to-delete (iOS native, Airbnb)
- Pinch-to-zoom em fotos (Instagram, Pinterest)
- Long-press para context menu
- Haptic feedback (iOS only)

Pesquisa 27 finding: **nenhuma DESIGN.md cobriu gestures**. Gap.

Hipóteses:

- Dia 1: gestures básicos (scroll natural, tap)
- Fase 2: pull-to-refresh + swipe actions JIT por demanda

### Q9 — Touch target floor 44/48px

Apple HIG = 44pt × 44pt
Material Design = 48dp × 48dp (em ~9mm físico)

Convergência: **44-48px** é touch target floor universal pesquisa 27.

Tokens (já em `03-tokens-universe.md`):

```
--touch-target-min: 44px       (Apple)
--touch-target-comfortable: 48px (Material)
--touch-target-large: 56px+    (Warm-Wellness Airbnb)
```

### Q10 — Mobile-first redesign per archetype

Hipótese: cada archetype pode demandar redesign mobile-first, não só responsive.

Exemplos:

- **Editorial-Serif** desktop: 3-col grid magazine. Mobile: stack single-col com larger headings
- **Bold-Energetic** desktop: 16:9 hero. Mobile: 4:5 portrait (Nike art-direction)
- **Soft-Productive** desktop: side-by-side cards. Mobile: stacked com pill CTAs proeminentes
- **Warm-Wellness** desktop: 80px gutter. Mobile: 16-24px gutter (compressão -75%)
- **Minimal-Mono** desktop: side nav. Mobile: hamburger sheet

→ Cada archetype carrega **mobile vs desktop layout philosophy**, não só breakpoints.

---

## Decisões pendentes

| Decisão                                              | Quando                               |
| ---------------------------------------------------- | ------------------------------------ |
| Manifest dinâmico per tenant: viável ou não em iOS?  | Pesquisa 30                          |
| Quantos splash screens iOS pré-gerar? (8? 16?)       | Pesquisa 30                          |
| Tenant troca template depois de instalado: bloquear? | Pesquisa 30 + decisão UX             |
| Service worker scope per tenant (subdomain vs path)  | Confirmação arquitetura multi-tenant |
| Gestures premium dia 1 ou JIT                        | Decisão escopo                       |
| Mobile-first redesign per archetype (vs responsive)  | Pesquisa 28 + UX                     |
| EU iOS 17.4+ degradação graciosa                     | Pesquisa 30 + legal                  |

---

## Hipóteses fortes

1. **PWA mobile suporta multi-tenant** (cada tenant = subdomain)
2. **Template inicial é lockado após primeira install**
3. **Splash + icons pre-gerados via Satori on-demand, cached forever**
4. **3 fluxos install distintos** (Chromium / iOS Share / Safari Dock)
5. **Safe-area-inset + viewport-fit:cover** universal
6. **Mobile philosophy per archetype** (não só responsive — algumas decisões são layout-different)
7. **2 subsystems pattern (Spotify Encore-style):** `lib/design/web` + `lib/design/pwa-mobile` compartilhando foundational tokens mas com anatomy/variants próprias — confirmado por Spotify Encore (designsystems.com 2026-05-19)

---

## Referência canônica — Spotify Encore (2 subsystems multi-platform)

Spotify Encore (Juli Sombat, Design Manager) é o **modelo direto pro nosso caso**. 2 subsystems:

- **Encore Consumer Mobile** — mobile-centric components (analog: nosso PWA aluno)
- **Encore Web** — web products (analog: nosso painel admin profissional + landing)

Ambos compartilham foundational tokens (color, typography, design tokens) mas têm **anatomy + variants próprias**.

> _"Middle path between perfect consistency and total platform independence"_

> _"We began developing cross-platform components at the outset, as opposed to an afterthought."_

**Workflow Encore (pra copiar):**

1. **Platform audits** — cada plataforma documenta unique characteristics (screen real estate, viewing distance, input methods, PWA standalone vs browser-tab)
2. **Component outlines** — collaborative docs definindo naming + anatomy + variants + a11y per platform
3. **Design tokens variables** — propagam mas allow platform-specific customization

**Tools mencionados:** Variables + REST API generating values across code sources.

→ Confirma nossa arquitetura `:root[data-template][data-palette]` + Tailwind v4 `@theme` CSS vars. Não estamos sozinhos — pattern validado em produção (45+ platforms, 2000+ devices em Spotify).

→ **Implicação pra pesquisa 28 / 30:** mandato deve incluir extrair patterns per **platform** (web vs PWA mobile), não só per **archetype**. 2-D matrix: archetype × platform.

---

## Material Design 3 + iOS HIG 2026 — confirmações (2026-05-19)

### Material Design 3 (Android + Material-system)

- **Touch target:** 48dp × 48dp universal (= ~9mm físico, independente da densidade da tela)
- **Spacing entre touch targets:** ≥8dp pra evitar mistap
- **Spacing increment universal:** 8dp em todos os layouts
- **Density considerations:** 48dp floor pra acessibilidade em todas as densities

### iOS HIG 2025-2026 (Apple)

- **Touch target:** 44pt × 44pt mínimo (smaller = 25% tap error rate, especialmente motor impairments)
- **Typography:**
  - SF Pro Text ≤ 19pt
  - SF Pro Display ≥ 20pt
  - Dynamic Type support (user-controlled scaling — a11y)
- **Safe Area Layout:** componentes UI não devem overlap com notches/home indicators (= `env(safe-area-inset-*)` já em §5)
- **SF Symbols:** sistema oficial de ícones Apple (não usar diretamente — Apple proprietary)

### iOS 26 — Liquid Glass design language (novidade)

> Apple introduziu em iOS 26: _"Many elements—but most notably, important buttons and navs—are rendered in a reflective, refractive, beautiful glass texture Apple is calling Liquid Glass."_

- Controls float above content com Liquid Glass buttons
- Top + bottom toolbars fixed
- Bottom nav inset em horizontal Liquid Glass capsule
- visionOS spatial computing
- Customizable home screen widgets
- Control Center extensions

**Aplicação desafit:** **NÃO copiar Liquid Glass diretamente** (proprietário, futuro). Mas observar que **glass / backdrop-blur** vai virar mainstream em 2026-2027. Pode informar archetype Soft-Productive ou Luxe-Editorial JIT.

### Convergência desafit

| Token             | Material 3    | iOS HIG   | desafit canon                                |
| ----------------- | ------------- | --------- | -------------------------------------------- |
| Touch min         | 48dp          | 44pt      | **44px floor + 48px comfortable** (já em §8) |
| Spacing target    | 8dp           | n/a       | 8px gap mínimo entre touch                   |
| Touch large       | n/a           | n/a       | 56-64px (Airbnb search orb)                  |
| Spacing base unit | 8dp           | implícito | 4px Tailwind v4 + 8px equivalent every 2     |
| Type font         | Roboto/Custom | SF Pro    | Geist (variable, latin-ext)                  |
| Safe area         | inset env     | inset env | env(safe-area-inset-\*) viewport-fit:cover   |

→ **Nossos tokens cobrem ambos os padrões.** Não há conflito Apple vs Google — convergência em ~44-48px touch.

→ **iOS HIG é gold standard pra Warm-Wellness + Luxe-Editorial archetypes** (Apple polish). Material 3 é gold standard pra Bold-Energetic (sports/fitness apps frequently Material-leaning).

---

## Pendências

- [ ] **Pesquisa 30 — PWA tenant theming** (manifest dinâmico, splash matrix, service worker scope, install fluxos, EU edge case)
- [ ] Auditar iOS device list 2026 (top 12-16 resoluções)
- [ ] Auditar Satori capacity (subset CSS limites)
- [ ] Verificar Apple/Google policy sobre manifest dinâmico
- [ ] Decidir gestures premium escopo
- [ ] Decidir bloqueio de troca de template pós-install (Fase 1 lock)
- [ ] Mobile-first redesign per archetype — definir o que muda além de responsive
