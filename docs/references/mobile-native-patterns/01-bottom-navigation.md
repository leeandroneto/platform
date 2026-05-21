# 01 — Bottom Navigation

> **Canon source:** Apple HIG · Tab Bars · Material Design 3 · Navigation Bar

## Canon

**Apple HIG (Tab Bars):**

> "Use three to five tabs in iOS; use a few more in iPadOS and tvOS if necessary."

> "Once you exceed 5 tabs, each item drops below 78pt in width on the standard container, which makes targeting harder."

> "When more than 5 tabs are needed, the final visible tab becomes a More tab, which reveals the additional tabs in a list on a separate screen."

**Material Design 3 (Navigation Bar):**

> "Navigation bars allow movement between primary destinations in an app … The navigation bar exposes the three to five top-level destinations of an app."

> "Navigation bar height: 80dp. Active indicator: 56dp width × 32dp height."

## Specs numéricas

| Spec             | iOS Tab Bar                                     | Material 3 Nav Bar          |
| ---------------- | ----------------------------------------------- | --------------------------- |
| Container height | 49pt (compact), 50pt (regular) excl. safe-area  | 80dp incl. label            |
| Icon size        | 25×25pt                                         | 24dp                        |
| Max destinations | 5 (More tab acima)                              | 5 (3 mínimo)                |
| Active indicator | Color + filled icon variant                     | Pill 56×32dp atrás do ícone |
| Position         | Sticky bottom, safe-area-inset-bottom inclusive | Sticky bottom               |
| Touch target     | 44pt floor                                      | 48dp floor                  |

## Quando NÃO usar (ambos canons concordam)

- Apps single-task (formulário, leitura, vídeo player) → top bar + back gesture basta
- Quando destinos não são peers — usar drawer/menu
- 1 ou 2 destinos só → bottom nav vira ruído visual

## Implicação desafit

Bottom nav **adotado** pro PWA aluno. 4 destinos iniciais (Hoje · Programa · Comunidade · Perfil). Estrutura:

```tsx
// components/student/BottomNav.tsx (Layer A — fixo)
<nav
  className="
  fixed bottom-0 inset-x-0 z-40
  h-[calc(64px+env(safe-area-inset-bottom))]
  pb-[env(safe-area-inset-bottom)]
  border-t border-[--border]
  bg-[--surface-elevated]
  grid grid-cols-4
"
>
  {destinations.map((d) => (
    <Link
      href={d.href}
      className="
      flex flex-col items-center justify-center gap-1
      min-h-[48px]               /* touch floor */
      text-xs font-medium
      data-[active=true]:text-[--accent]
    "
    >
      <Icon name={d.icon} size={24} />
      <span>{t(d.label)}</span>
    </Link>
  ))}
</nav>
```

**Floor escolhido:** 64dp altura (entre iOS 49pt e Material 80dp; espaço suficiente pra label PT-BR sem inflar) + `safe-area-inset-bottom` aditivo. Touch 48px floor por item.

## Layer B varia per archetype

| Atributo                                                 | Varia?   | Notas                                                                  |
| -------------------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| Container height (64dp)                                  | ❌ FIXO  | Quebra layout previsível se vira                                       |
| Position (bottom sticky)                                 | ❌ FIXO  | Apple/Material ambos cravam                                            |
| `safe-area-inset-bottom`                                 | ❌ FIXO  | Sempre incluso                                                         |
| Max destinations (4)                                     | ❌ FIXO  | Decisão de produto, não estética                                       |
| **Active color**                                         | ✅ VARIA | Herda `--accent` do tenant/archetype                                   |
| **Icon style** (filled/outline/duotone)                  | ✅ VARIA | Archetype canónico (Apple uses filled-active, Material outline-active) |
| **Active indicator** (pill atrás vs underline vs cor só) | ✅ VARIA | Editorial = underline, Brutalist = nenhum, default = cor               |
| **Label typography** (family + weight)                   | ✅ VARIA | Herda type scale do archetype                                          |
| **Border-top opacity**                                   | ✅ VARIA | Premium = none (sombra invés); minimalist = 1px sólido                 |

## Fontes

- Apple HIG Tab Bars: <https://developer.apple.com/design/human-interface-guidelines/tab-bars>
- Material 3 Navigation Bar specs: <https://m3.material.io/components/navigation-bar/specs>
- Adobe Spectrum iOS Tab Bar (referência terceira): <https://spectrum.adobe.com/page/tab-bar-ios/>
