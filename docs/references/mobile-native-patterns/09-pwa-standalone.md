# 09 — PWA Standalone Mode

> **Canon source:** W3C Web App Manifest · web.dev · MDN · Apple Safari docs

## Canon

**W3C Web App Manifest (`display`):**

> "The `display` property describes how the OS should draw the PWA window, with options being `fullscreen`, `standalone`, `minimal-ui`, or `browser`."

| Valor        | UI                                                      | Quando usar pra desafit aluno                 |
| ------------ | ------------------------------------------------------- | --------------------------------------------- |
| `fullscreen` | Nada de browser UI, nem status bar                      | NÃO — perde status bar (clock, battery)       |
| `standalone` | Como app nativo: sem browser chrome, status bar visível | **SIM — default**                             |
| `minimal-ui` | Title bar + reload (Android/desktop)                    | Não — desafit não precisa back/reload browser |
| `browser`    | Tab normal                                              | Não em standalone                             |

**Apple `apple-mobile-web-app-status-bar-style`:**

> "Apple offers three distinct settings: `default`, `black`, and `black-translucent`. With `black-translucent`, the status bar is visible but rendered on top of content with a transparent background, and the theme color is ignored in this mode."

## Manifest essencial

```json
{
  "name": "Desafit",
  "short_name": "Desafit",
  "start_url": "/?source=pwa",
  "display": "standalone",
  "display_override": ["standalone", "minimal-ui"],
  "orientation": "portrait",
  "background_color": "#0a0a0a",
  "theme_color": "#0a0a0a",
  "icons": [
    { "src": "/icons/192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    {
      "src": "/icons/maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "categories": ["health", "fitness", "lifestyle"]
}
```

Multi-marca → manifest gerado server-side via `app/manifest.ts` (Next 16) com tenant brand resolvido por host. `name`, `theme_color`, `background_color`, ícones todos tenant-aware.

## iOS-specific meta tags

iOS Safari NÃO lê o manifest pra muitas coisas. Precisa de meta tags HTML:

```html
<!-- standalone capability -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<!-- moderno: substitui acima em iOS 17.4+ -->
<meta name="mobile-web-app-capable" content="yes" />

<!-- status bar styling -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

<!-- app title (short name no home screen) -->
<meta name="apple-mobile-web-app-title" content="Desafit" />

<!-- safe area / notch support -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

<!-- theme color (status bar Android + chrome target) -->
<meta name="theme-color" content="#0a0a0a" />

<!-- icons -->
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32.png" />
```

## Splash screen iOS

> "On Android splash screens work automatically through manifest.json, however iOS does not support a similar method; instead you need to provide splash screens tailored for each iOS device using the `<link rel="apple-touch-startup-image" />` HTML meta tag."

Matrix-curto (sufficient pra cobrir iPhones 2020+):

```html
<!-- iPhone 14 Pro Max (1290×2796) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/1290x2796.png"
  media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)"
/>
<!-- iPhone 14 Pro (1179×2556) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/1179x2556.png"
  media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
/>
<!-- iPhone 13/12/11 Pro Max (1284×2778) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/1284x2778.png"
  media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3)"
/>
<!-- iPhone 13/12/11/X (1170×2532 / 1125×2436) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/1170x2532.png"
  media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)"
/>
<!-- iPhone SE 3rd / 8 / 7 / 6 (750×1334) -->
<link
  rel="apple-touch-startup-image"
  href="/splash/750x1334.png"
  media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
/>
```

**Pragmatic:** começar com 3 splashes (Pro Max, Pro, SE). Adicionar conforme analytics mostrem outras devices.

## Install patterns — 3 fluxos

### 1. Chromium (Chrome / Edge / Opera Android+Desktop) — `beforeinstallprompt`

```ts
let deferred: BeforeInstallPromptEvent | null = null

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault() // suprime banner nativo
  deferred = e // guarda pra trigger manual
})

// Em handler de botão "Instalar"
async function promptInstall() {
  if (!deferred) return
  deferred.prompt()
  const { outcome } = await deferred.userChoice
  deferred = null
}
```

### 2. iOS Safari (iPhone + iPad)

> "On iOS, the user can choose 'Add to Home Screen' through the Share menu."

NÃO há programmatic prompt. PWA aluno deve mostrar **instructions modal** detectado via UA + `display-mode !== standalone`:

```ts
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  (window.navigator as any).standalone === true

if (isIOS && !isStandalone) {
  // Show: "Toque em [share icon] → 'Adicionar à Tela de Início'"
}
```

### 3. Safari macOS 17+ — Add to Dock

> "With Safari 17 or higher, go to File > Add to Dock in your Mac's menu bar. PWAs can be installed on macOS 14.0 or later and iOS/iPadOS 16.4 or later from any supporting browser."

Programmatic prompt **não disponível**. UI hint: "macOS Safari 17+? File → Add to Dock". Detect via UA Safari + macOS.

## Detecção de standalone mode

```ts
// abstração reutilizável
export function isPWAStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  )
}
```

## Layer B varia per archetype

| Atributo                                                   | Varia?        | Notas                               |
| ---------------------------------------------------------- | ------------- | ----------------------------------- |
| `display: standalone`                                      | ❌ FIXO       |                                     |
| `viewport-fit=cover`                                       | ❌ FIXO       |                                     |
| `apple-mobile-web-app-status-bar-style: black-translucent` | ❌ FIXO       | Permite chrome overlay              |
| Install patterns (3 flows)                                 | ❌ FIXO       | Platform-dependent                  |
| **`theme_color`**                                          | ✅ VARIA      | Tenant `--surface-base`             |
| **`background_color` (splash bg)**                         | ✅ VARIA      | Tenant                              |
| **Icons** (logo, maskable)                                 | ✅ VARIA      | Tenant brand assets                 |
| **`name` / `short_name`**                                  | ✅ VARIA      | Tenant business name                |
| **Splash images**                                          | ✅ VARIA      | Tenant logo + bg                    |
| **Categories**                                             | ⚠️ semi-fixed | Por vertical (fitness/yoga/idiomas) |

## Fontes

- W3C Web App Manifest: <https://www.w3.org/TR/appmanifest/>
- MDN PWA Installable: <https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable>
- web.dev PWA manifest: <https://web.dev/learn/pwa/web-app-manifest>
- Apple `apple-mobile-web-app-*`: <https://developer.apple.com/documentation/webkit/configuring-web-applications>
- iOS PWA appearance tactics: <https://itnext.io/make-your-pwas-look-handsome-on-ios-fd8fdfcd5777>
- Splash matrix examples: <https://medium.com/appscope/adding-custom-ios-splash-screens-to-your-progressive-web-app-41a9b18bdca3>
