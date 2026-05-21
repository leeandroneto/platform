# 03 — FAB (Floating Action Button)

> **Canon source:** Material Design 3 · FAB · Apple HIG (não tem FAB equivalente — propositalmente)

## Canon

**Material Design 3 (FAB):**

> "Floating action buttons (FABs) help people take primary actions. They are used to represent the most important action on a screen."

> "Material 3 FABs support three variants: Regular (56dp), Medium (80dp), and Large (96dp). The Small FAB (40dp) and Surface FAB are deprecated."

> "Only use a FAB if it is the most suitable way to present a screen's primary action."

**Apple HIG (filosofia oposta):**

- iOS NÃO tem FAB canónico. Primary action vai em:
  - Top-right do navigation bar (cabeçalho da tela)
  - Toolbar bottom (segmented actions)
  - Inline no card/list
- "Compose" no Mail/Messages é o caso fronteiriço — botão circular flutuante, mas raro

## Specs numéricas (quando usar — Material)

| Variante | Size           | Icon size         | Uso                                             |
| -------- | -------------- | ----------------- | ----------------------------------------------- |
| Regular  | 56×56dp        | 24dp              | Default primary action                          |
| Medium   | 80×80dp        | 28dp              | Quando precisa hierarquia maior                 |
| Large    | 96×96dp        | 36dp              | Hero action (raro)                              |
| Extended | h:56dp, w:auto | 24dp icon + label | Action que precisa rotulagem ("Create program") |

**Position canon:** bottom-right, 16dp das margens, **24dp acima do bottom nav** (se houver), sempre dentro do safe-area-inset-bottom.

## Quando usar

- 1 e somente 1 primary action óbvia por tela
- Action precisa estar accessible scroll-independente
- Action é destacável (criar, adicionar, compose)

## Quando NÃO usar (cross-canon consensus)

- Múltiplas primary actions na mesma tela (vira menu, vira ruído)
- Action pode viver no header sem prejuízo
- Tela é leitura/consumo (programa em execução, conteúdo de aula)
- App principalmente iOS-style (Apple não usa FAB → quebra expectativa)
- Action depende de seleção (FAB é context-free)

## Implicação desafit

**Decisão default: NÃO usar FAB no PWA aluno.**

Justificativa:

- Telas principais (Hoje, Programa, Comunidade, Perfil) **não têm 1 primary action universal**:
  - Hoje = consumir treino (botão "Iniciar" inline no card)
  - Programa = navegar (sem action global)
  - Comunidade = ver feed (compose seria FAB candidato — adiar até MVP+1)
  - Perfil = ver/editar inline
- Bottom nav já ocupa o espaço; FAB acima dele cria zona morta touch
- Identidade visual cross-archetype: alguns archetypes (Editorial, Brutalist) repelem FAB

**Quando re-avaliar:** se Comunidade ganhar feed com compose action proeminente, considerar Extended FAB ("Postar") apenas naquela tela.

Pseudo-código pra caso futuro localizado:

```tsx
// components/student/AppFab.tsx (Layer A — opt-in per screen)
<button
  className="
  fixed right-4 z-30
  bottom-[calc(64px+24px+env(safe-area-inset-bottom))]  /* acima do bottom nav */
  size-14                                                /* 56dp regular */
  rounded-full                                           /* sempre full radius — varia per archetype? NÃO */
  bg-[--accent] text-[--accent-foreground]
  shadow-lg
  flex items-center justify-center
"
>
  <Icon name="plus" size={24} />
</button>
```

## Layer B varia per archetype

| Atributo                                      | Varia?   | Notas                                                         |
| --------------------------------------------- | -------- | ------------------------------------------------------------- |
| Position (bottom-right + offset bottom-nav)   | ❌ FIXO  | Material canon                                                |
| Size 56dp (regular)                           | ❌ FIXO  | Touch floor                                                   |
| Single primary action principle               | ❌ FIXO  | Conceito core                                                 |
| **Presença (FAB sim/não)**                    | ✅ VARIA | Por tela + por archetype; default = não                       |
| **Background color**                          | ✅ VARIA | `--accent` herda tenant                                       |
| **Shape** (full circle vs squircle vs square) | ✅ VARIA | Material default = circle; Brutalist square; Premium squircle |
| **Shadow** (Material elevation vs flat)       | ✅ VARIA | Editorial/Brutalist = flat; Premium = elevation-3             |
| **Extended (com label)**                      | ✅ VARIA | Decisão per screen                                            |

## Fontes

- Material 3 FAB specs: <https://m3.material.io/components/floating-action-button/specs>
- Material 3 Extended FAB: <https://m3.material.io/components/extended-fab>
- Adobe Spectrum iOS (para confirmação ausência iOS): <https://spectrum.adobe.com/page/tab-bar-ios/>
