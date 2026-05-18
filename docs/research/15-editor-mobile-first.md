# Editor de Conteúdo Mobile-First para desafit.app — Pesquisa Técnica Opinativa (2025-2026)

> **Stack alvo**: Next.js 16 App Router · React 19 · TS strict · Tailwind v4 · shadcn new-york dark-first · Motion 12 · vaul · Supabase · Zod 4 · @dnd-kit · pnpm.
> **Restrição crítica**: 90% dos profissionais operam exclusivamente em 375px touch. Desktop é progressive enhancement.

Antes de mergulhar bloco-a-bloco, três conclusões guiam todo o resto e devem ser absorvidas primeiro:

1. **A indústria convergiu em um híbrido pragmático, não em inline puro.** Builder.io — provavelmente o editor visual mais avançado de 2025 — só suporta inline editing para _texto_ em componentes nativos; tudo o mais (imagem, vídeo, número, estrutura) é resolvido em painel lateral / bottom sheet. Framer só lançou edição inline de campos CMS em 2024-2025 e, ainda assim, mantém o painel direito como caminho oficial para campos não-textuais. Wix, Squarespace Fluid Engine, TrueCoach e Trainerize fazem essencialmente _form-based com preview ao lado_, não inline.
2. **Inline editing em mockup ao vivo no mobile real (375px touch) é território com cicatrizes documentadas, não apenas teórico.** Tiptap, ProseMirror e Lexical têm issues abertas em 2025 sobre Safari iOS travando o page inteiro depois de seleção rápida, double scroll com teclado virtual, perda de foco em contenteditable, e Motion 12 tem bugs confirmados de hover/drag em multitouch. Cada um desses é assumível em desktop; em mobile-only B2B é risco existencial.
3. **Para conteúdo majoritariamente estruturado (workouts), form-based em bottom sheet vence inline em todo critério mensurável**: latência, A11y, manutenção, custo de implementação. Inline só compensa em surfaces livres (landing page) e mesmo lá, com escopo apertadíssimo.

A recomendação final é um **híbrido assimétrico**: form-based em bottom sheet para 80% do produto, inline contenteditable restrito apenas a _blocos de texto livre da landing page_, e zero inline em workouts/programas/branding.

---

## BLOCO 1 — Estado da arte (2025-2026) em editores mobile-first SaaS B2B

### O que realmente funciona bem hoje

| Produto                                   | Padrão dominante no mobile                                                                                                                                                                                                                                                                                    | Modo Edit/Preview                                                                              | Inline real?                        | Avaliação                                                                                                                                                                                                                                                                     |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Builder.io Visual Editor**              | Iframe ao vivo + sidebar de propriedades + slash command. Inline text editing apenas em componentes nativos do Builder; "Custom components do not support inline text editing" (documentação oficial).                                                                                                        | Toggle Edit/Preview no topo + device switcher (desktop/tablet/mobile).                         | **Parcial** (só texto, só built-in) | Referência absoluta para visual-edit de blocos, mas a própria MobileAppDaily review nota: "Mobile-responsive editing requires some technical understanding... could be more intuitive — I found myself switching to code view more often than I'd like." Confiança: **alta**. |
| **Framer (CMS mobile)**                   | Lançou em 2024-2025 "Mobile-Friendly CMS" e "Inline Content Editing" (double-click no canvas). Mesmo assim a página oficial enfatiza a _Editor Bar_ (FAB lateral direita que abre a CMS detail view).                                                                                                         | Editor Bar discreto no canto direito; tap em "Edit in Framer" abre modo edit; "Publish" fecha. | **Sim, mas guard-railed**           | Provavelmente o estado-da-arte real de inline mobile-grade. Confiança: **alta**.                                                                                                                                                                                              |
| **Webflow Studio**                        | Designer histórico é desktop-only. Não há "Studio mobile" credível para edição estrutural; existe app companion (Mobile Editor) que **é form-based puro** para edição de texto/imagem de páginas já publicadas.                                                                                               | App separado, modo edit-only (sem preview ao vivo do design).                                  | **Não**                             | Webflow assume mobile como consumo, não autoria. Confiança: **alta**.                                                                                                                                                                                                         |
| **Wix Editor / Squarespace Fluid Engine** | App nativo mobile faz versão simplificada (form-based em telas modais); edição visual livre é desktop-first. Squarespace Fluid Engine no app mobile permite mover seções por drag mas edição de propriedades vai em bottom sheet.                                                                             | Botão "Edit" entra em modo edit; "Preview" sai.                                                | **Não** (em mobile)                 | Confirma a tese: gigantes voltaram ao form-based no mobile. Confiança: **média**.                                                                                                                                                                                             |
| **Notion mobile**                         | Lista de blocos editáveis sequenciais (NÃO é mockup ao vivo de uma página visitada). Toque longo em bloco → bottom sheet com opções.                                                                                                                                                                          | Não há toggle — o documento _é_ sempre editável quando autor.                                  | **Sim, mas é a própria UI final**   | Padrão "documento ≡ produto"; inviável para landing-page-builder. Confiança: **alta**.                                                                                                                                                                                        |
| **Linear mobile**                         | Form-based puro. Bottom sheets vaul-like. Nenhum mockup ao vivo.                                                                                                                                                                                                                                              | Sem modo — issues são entidades, não páginas visuais.                                          | **Não**                             | Linear é referência de UX, mas não tentam editar layouts. Confiança: **alta**.                                                                                                                                                                                                |
| **TrueCoach**                             | Web-first; "TrueCoach's coach app handles messaging and quick workout edits, but most programming and admin tasks still require a desktop or tablet" (Trainerize blog 2026).                                                                                                                                  | Telas separadas para edit/view; sem mockup ao vivo.                                            | **Não**                             | Diretamente relevante: maior player do espaço fitness _não_ resolveu mobile-first para o coach. Confiança: **alta**.                                                                                                                                                          |
| **ABC Trainerize**                        | "ABC Trainerize's coach app covers roughly 60% of the platform features." App mobile do coach é parcial; programming pesada exige desktop. Lentidão e bugs frequentes em mobile (Software Advice reviews 2026: "customizing templates or copying workouts is often difficult, especially on mobile devices"). | Telas separadas; client preview ≠ coach edit view.                                             | **Não**                             | Mesmo cenário. Confiança: **alta**.                                                                                                                                                                                                                                           |
| **MyPTHub**                               | Plataforma com app coach + cliente. Edição estrutural de programas é majoritariamente desktop; app mobile do coach foca em mensagens, check-ins, e ajustes pontuais. Reviews públicas (Capterra, G2) descrevem UX mobile como "functional, not for heavy programming".                                        | Sem modo edit/preview unificado.                                                               | **Não**                             | Padrão é igual a TrueCoach/Trainerize. Confiança: **média** (menos material técnico público que TrueCoach).                                                                                                                                                                   |
| **Trainerfu**                             | Marketing claim: "90% das features no app mobile, a maior taxa entre concorrentes" (trainerfu.com). Sem demonstração técnica pública que valide isso para _autoria_ (vs. consumo).                                                                                                                            | Não documentado publicamente.                                                                  | Não verificado                      | Confiança: **baixa** (claim de fabricante, sem evidência primária).                                                                                                                                                                                                           |
| **Builder.io Artboard Mode**              | Permite zoom/preview do canvas inteiro com mobile preview. Feature de _autor_, opera melhor em desktop.                                                                                                                                                                                                       | N/A                                                                                            | N/A                                 | Confiança: alta.                                                                                                                                                                                                                                                              |

### Padrões consolidados como vencedores

1. **Bottom sheet vaul-style com snap points** (≈[0.4, 0.92]) para edição de propriedades — adotado por Apple Maps, Notion mobile, Linear, e Vercel (onde nasceu vaul). Padrão nativo do iOS desde iOS 15. Confiança: **alta**.
2. **Toggle Edit ⇄ Preview no header** (não long-press, não pinch). Builder.io, Framer, Webflow Designer, Wix usam todos isso. Toggle binário evita o problema clássico de "tap acidental edita". **Comparação direta**: Builder.io = toggle no canto superior; Framer = Editor Bar no canto inferior direito (fora do path do polegar); Wix = botão FAB. Vencedor para 375px: **toggle no header** (canto superior direito, fora do alcance do polegar dominante = menos toques acidentais).
3. **Action sheet contextual sobre seleção** (estilo iOS Pages / Google Docs mobile): ao tocar em um elemento editável, abre uma pílula flutuante acima com 3-5 ações (Editar / Mover / Duplicar / Estilo / Excluir). Esse padrão é robusto e não conflita com gestos.
4. **Slash command (`/`) para inserir blocos em texto rico** — Builder.io e Framer ambos convergiram nisso para mobile.
5. **Drag handle explícito** (≥44×44px, lado direito) para reorder em mobile. Sem drag handle, dnd-kit em iOS confunde scroll com drag (issue #453 documentada).

### Território experimental ainda não consolidado

- **Inline editing em mockup ao vivo 100% touch** — _ninguém_ entregou isso de forma robusta a 375px para non-designers; Builder.io e Framer assumem desktop ou pelo menos iPad em uso real.
- **Pinch-to-zoom para alternar Edit/Preview** — tentado por algumas tools, abandonado por conflitar com zoom nativo iOS.
- **AI inline rewrite via long-press** — Notion AI e Tiptap AI Toolkit (changelog 2025) estão experimentando, mas ainda têm bugs de Iterator Helpers em Safari <18.4 (Tiptap AI Toolkit changelog).

---

## BLOCO 2 — Viabilidade de inline editing em mockup ao vivo

### Veredito direto, com confiança **alta**

> **É viável apenas para texto livre em blocos de landing page. É inviável (custo/benefício negativo) para imagem, número estruturado, lista hierárquica, vídeo e qualquer surface estruturada.**

### Quem fez bem, quem fracassou, evidências primárias

| Caso                        | Resultado                                                                                                                                                                                                                                                                                             | Fonte primária                                                   |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Builder.io                  | "Inline text editing is currently only supported for built-in Builder components. Custom components do not support inline text editing." → tentaram inline amplo, restringiram drasticamente.                                                                                                         | docs.builder.io/c/docs/block-types                               |
| Framer Inline CMS (2024-25) | Funciona, mas exige duplo-clique (desktop friendly) e tem um _badge_ visual de "campo conectado" — sinal de que o usuário precisa de pista visual para não se perder.                                                                                                                                 | framer.com/updates/inline-content-editing                        |
| Tiptap em mobile            | Issue #6571 (2025): "Double Scroll and Toolbar Position Issues When Using Virtual Keyboard on Mobile Web". Issue #7514 (iOS Safari): editor causa freeze global da página depois de seleção rápida — clicks param de funcionar até refresh. Issue #2629: caret visível em scrollable contenteditable. | github.com/ueberdosis/tiptap (issues #6571, #7514, #2629, #6187) |
| Lexical mobile              | Sem issues catastróficas equivalentes, mas o build adiciona ~30-40 KB gzip por si só e tem curva de aprendizado alta. Usado por Meta (Facebook) que tem time dedicado. Confiança: **média** (não testei em escala).                                                                                   |
| Notion mobile               | Funciona porque o documento _é_ a UI final — não há mockup separado. Esse padrão não se transfere para landing-page-builder.                                                                                                                                                                          |

### Como concorrentes resolvem "modo Edit vs modo Preview"

| Concorrente              | Padrão                                                   | Análise                                                                                           |
| ------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Builder.io               | Toggle Edit/Preview no header + device switcher          | Mais discoverable. Modo Preview esconde outlines e toolbars contextuais.                          |
| Framer                   | Editor Bar discreto inferior + "Edit in Framer"          | Move o controle para _fora_ do path do polegar — bom para evitar acidentes, ruim para descoberta. |
| Wix Mobile               | Botão "Edit" / "Preview" no header                       | Idêntico a Builder.io, mais simples.                                                              |
| Squarespace Fluid Engine | Modo edit é entrar/sair via botão dedicado               | Funciona em tablet, em mobile real é apertado.                                                    |
| Webflow Mobile Editor    | App separado dedicado a edição (não tem preview ao vivo) | Cogente: assume que preview real é o site publicado.                                              |
| Notion / Linear          | Sem toggle — sempre editável                             | Modelo "documento", não "página". Inviável para landing builder.                                  |
| TrueCoach / Trainerize   | Telas completamente separadas                            | Modelo "form-based puro", sem mockup.                                                             |

**Recomendação para desafit (confiança alta)**: toggle Edit/Preview no header, canto superior direito (longe do polegar). NÃO use long-press, pinch, ou botão flutuante. Padrão vencedor industrial.

### Trade-offs claros: inline vs form-based

| Critério                | Inline em mockup                                                                                                                | Form-based em bottom sheet                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Latência percebida**  | "Vejo o que mudo" — ganho real para texto                                                                                       | Latência mínima (re-render local)                            |
| **Bugs típicos mobile** | IME, double scroll, page freeze (Tiptap #7514), focus loss (Tiptap #6187), iOS auto-zoom, selection handles                     | Praticamente zero — input nativo                             |
| **Complexidade impl.**  | Alta (Tiptap/Lexical + portal + posicionamento de toolbar + keyboard avoidance)                                                 | Baixa (RHF + Zod + vaul)                                     |
| **A11y**                | Frágil. Screen readers e VoiceOver têm bugs em contenteditable composto. WCAG: precisa anunciar mudança de estado edit/preview. | Forte. `<input>` semântico, `<label>`, error state via aria. |
| **Manutenção**          | Cada novo tipo de bloco → custom inline UX                                                                                      | Cada novo tipo → mais um Zod schema + form                   |
| **Custo IA**            | Inline streaming é difícil (cursor jumps)                                                                                       | Trivial (gerar JSON, validar, hidratar form)                 |

### Por tipo de conteúdo — recomendação opinativa

| Tipo                                       | Inline viável?            | Lib/pattern recomendado                                                                                   |
| ------------------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Texto curto (heading, label)**           | Sim, mas pode ser form    | `contenteditable="plaintext-only"` cru (suportado pelo WebKit há anos), sem editor lib — bundle zero. [E] |
| **Texto rico (parágrafo com bold/italic)** | Sim, com cuidado          | **Tiptap 3** com extensões mínimas (StarterKit reduzido). Aceitar os bugs iOS Safari conhecidos. [I]      |
| **Imagem**                                 | Não inline real           | Tap → action sheet vaul ("Substituir / Recortar / Alt text"). [E]                                         |
| **Vídeo (URL/upload)**                     | Não                       | Form em bottom sheet. [E]                                                                                 |
| **Número (sets/reps/cargas)**              | **Definitivamente não**   | Stepper custom com long-press repeat + wheel picker para valores maiores. [E]                             |
| **Lista (exercícios em ordem)**            | Drag handle + tap-to-edit | `@dnd-kit/sortable` com `TouchSensor` `{delay: 150, tolerance: 8}` e drag handle dedicado. [E]            |
| **Modo edit/preview**                      | —                         | **Toggle no header** com Motion 12 layout animation. Confiança: alta. [E]                                 |

### Snippet — toggle Edit/Preview com Motion 12 e React 19

```tsx
'use client'
import { useState, useTransition } from 'react'
import * as motion from 'motion/react-client'

type Mode = 'edit' | 'preview'

export function ModeToggle({ onChange }: { onChange: (m: Mode) => void }) {
  const [mode, setMode] = useState<Mode>('edit')
  const [, startTransition] = useTransition()

  const handle = (next: Mode) => {
    startTransition(() => {
      setMode(next)
      onChange(next)
    })
  }

  return (
    <div
      role="tablist"
      aria-label="Modo de edição"
      className="relative inline-flex rounded-full bg-neutral-900 p-1"
    >
      {(['edit', 'preview'] as const).map((m) => (
        <button
          key={m}
          role="tab"
          aria-selected={mode === m}
          onClick={() => handle(m)}
          className="relative z-10 px-4 py-2 text-sm min-h-[44px] min-w-[88px]"
        >
          {mode === m && (
            <motion.span
              layoutId="mode-pill"
              className="absolute inset-0 rounded-full bg-neutral-700"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
            />
          )}
          <span className="relative">{m === 'edit' ? 'Editar' : 'Visualizar'}</span>
        </button>
      ))}
    </div>
  )
}
```

---

## BLOCO 3 — Touch interactions em PWA iOS

### Gestos vs sistema (confiança alta, baseado em github.com/w3c/manifest #1041 e Apple Developer Forums)

| Gesto                           | Funciona em PWA standalone iOS?                                                                                                                           | Restrição                                                                                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tap, long-press, double-tap** | Sim                                                                                                                                                       | Long-press conflita com call-out menu nativo (texto/link/imagem) → resolver com `-webkit-touch-callout: none` (citado no dnd-kit issue #791 como solução para drag em iOS Chrome). |
| **Swipe horizontal**            | Sim, **mas swipe-back nativo do Safari coexiste em PWA standalone** em iOS 18+. Tentativas de desativar via JS falham (Ionic #29733, w3c/manifest #1041). | Use swipe horizontal apenas _fora da borda_ da tela (i.e., não desde os primeiros ~20 px da esquerda).                                                                             |
| **Pinch-to-zoom**               | Sim, mas conflita com `maximum-scale=1`.                                                                                                                  | Evite usar pinch como gesto custom — viola A11y se desativar zoom nativo.                                                                                                          |
| **Drag-drop dnd-kit em 375px**  | Funciona com ressalvas                                                                                                                                    | Veja seção abaixo.                                                                                                                                                                 |

### dnd-kit em 375px touch — o que a evidência mostra

Issues primárias relevantes:

- **#453** (`Dragging doesn't work on touch devices with delay activation constraint and touch action auto`): se você quer tap normal _e_ drag-com-long-press na mesma área, dnd-kit fica "stuck". A solução suportada pelos mantenedores é separar com **drag handle** dedicado.
- **#791**: Haptic touch do iOS Chrome quebra o drag — fix: `-webkit-touch-callout: none` na área draggable.
- **#1955** (2025): em alguns Samsung Android, o drag nem inicia.
- **#1398**: TouchSensor com `delay: 0` ainda é interpretado como long-press em iPad — limitação real.
- **Docs oficiais dnd-kit (Touch sensor)**: "Using `touch-action: none;` is currently the only reliable way to prevent scrolling in iOS Safari for both Touch and Pointer events."

**Receita testada em produção (confiança alta):**

```tsx
'use client'
import {
  DndContext,
  TouchSensor,
  MouseSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'

const sensors = useSensors(
  useSensor(TouchSensor, {
    // delay grande + tolerância pequena → não confunde scroll com drag
    activationConstraint: { delay: 200, tolerance: 5 },
  }),
  useSensor(MouseSensor, { activationConstraint: { distance: 4 } }),
  useSensor(KeyboardSensor),
)
```

E no JSX do drag handle (apenas o handle, não o card inteiro):

```tsx
<button
  {...listeners}
  {...attributes}
  aria-label="Arrastar item"
  className="touch-none select-none p-3" // touch-action: none só no handle
  style={{ WebkitTouchCallout: 'none' }}
>
  <GripVertical className="size-5" />
</button>
```

**Alternativa para casos simples**: dois botões ↑ / ↓ (44×44 px) no card. Zero risco, A11y nativa, custo zero de lib. Para listas pequenas (≤7 itens) é mais rápido na prática.

### Motion 12 hover-stuck em touch

Issues confirmadas (motiondivision/motion #1484, #1179, #964, #1582): `whileHover` em touch fica preso em estado intermediário ou produz "glitches" em multitouch. **Não use `whileHover` em nada touch-only**. Use `whileTap` + `whileFocus`. Para feedback de pressão, prefira:

```tsx
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ duration: 0.1 }}
  className="..."
>
```

### Action sheets contextuais — vaul vs Radix Popover vs Headless UI

| Lib                         | Mobile fit                                                                                                                                                                                                                                           | Veredito                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **vaul**                    | Desenhado explicitamente por Emil Kowalski para _substituir_ `Dialog`/`Popover` em mobile (post oficial "Building a drawer component"). Suporta `snapPoints`, `Drawer.Handle`, `repositionInputs={true}`, `modal={false}` para coexistir com canvas. | **Vencedor mobile**.                              |
| **Radix Popover**           | Mobile sofre: tap-outside fechamento conflitando com seleção de texto; posicionamento que estoura viewport; sem drag-to-dismiss; sem snap points.                                                                                                    | Use só para _desktop_ hover popovers ou tooltips. |
| **Headless UI Dialog/Menu** | Acessibilidade boa, mas sem snap points e sem drag — comportamento de modal fixo. Em mobile é "menor que o vaul, maior que o necessário".                                                                                                            | Sem ganho relevante sobre vaul.                   |

**Cuidados vaul documentados** (allshadcn.com review, github #635, #473):

- Bug conhecido: drawer inicializa no primeiro snap point mesmo com `activeSnapPoint` diferente (PR #473).
- Bug de scroll com snap points múltiplos (issue #635 aberta em Dez 2025) — se você tem lista scrollável dentro do drawer, height precisa ser ajustada por snap.
- `disablePreventScroll`: padrão `true`. Se tem `<input autoFocus>` dentro, vaul "se confunde com touch keyboard" — desabilite manualmente.
- `[data-vaul-no-drag]` em filhos que não devem disparar drag (importante para sliders, dnd-kit aninhado).

### Posicionamento de toolbar flutuante sem cobrir conteúdo

**Padrão consolidado**: toolbar contextual aparece **abaixo do elemento se estiver na metade superior, acima se na inferior**. iOS Mail e Pages fazem isso. Use `getBoundingClientRect()` + `window.visualViewport`:

```tsx
function getToolbarPosition(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const vv = window.visualViewport
  const viewportH = vv?.height ?? window.innerHeight
  const placeBelow = rect.top < viewportH / 2
  return {
    top: placeBelow ? rect.bottom + 8 : rect.top - 48,
    left: Math.max(8, Math.min(rect.left, window.innerWidth - 200)),
  }
}
```

---

## BLOCO 4 — Bugs e armadilhas conhecidas

### Teclado virtual sobre input

**Estado canônico em 2026 (confiança alta, MDN + W3C):**

- **iOS Safari (inclusive PWA standalone)**: _não_ suporta `navigator.virtualKeyboard` (API só em Chromium 94+). iOS automaticamente reduz o _visual viewport_, mas o _layout viewport_ fica igual → elementos `position: fixed; bottom: 0` ficam atrás do teclado.
- **API correta para iOS**: `window.visualViewport` com listeners `resize` e `scroll`. Bramus mostrou implementação prática em 2021, ainda válida.
- **`100dvh`** ajuda apenas para layout estático; não é reativo a abertura/fechamento de teclado em iOS Safari (a propriedade só é recalculada em mudança de orientação).
- **Próximo passo em Chrome 108+ (não iOS)**: meta viewport `interactive-widget=resizes-content` ou `overlays-content`. Sem efeito em iOS.

**Receita pragmática para desafit (confiança alta):**

```tsx
'use client'
import { useEffect, useState } from 'react'

export function useKeyboardInset() {
  const [inset, setInset] = useState(0)

  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return
    let raf = 0
    const update = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        // Quanto do layout viewport está oculto pelo teclado
        const hidden = window.innerHeight - vv.height - vv.offsetTop
        setInset(Math.max(0, hidden))
      })
    }
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    update()
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  return inset
}
```

E aplique como `style={{ paddingBottom: inset }}` no container da toolbar / botão de save. vaul já tem `repositionInputs` que faz isso internamente — confirme que está em `true` (default).

### IME composition (CJK, vietnamita, árabe)

- **Evidência fraca para o nicho desafit** (mercado primário é PT-BR; CJK é over-engineering). Marcação: **[O]**.
- Se precisar: Tiptap e Lexical lidam com `compositionstart`/`compositionend` corretamente; `contenteditable` cru _não_ — quebrar texto durante composição é o bug clássico.
- Para inputs `<input>` / `<textarea>`, navegadores resolvem automaticamente.

### Auto-zoom iOS em input <16 px

**Fix definitivo (confiança alta, CSS-Tricks, defensivecss.dev, Rick Strahl):**

Garantir `font-size: 16px` em **todo** `<input>`, `<textarea>`, `[contenteditable]` no foco. Em Tailwind v4:

```css
@layer base {
  input,
  textarea,
  select,
  [contenteditable] {
    font-size: 16px; /* anti iOS auto-zoom */
  }
}
```

**Não use** `maximum-scale=1` nem `user-scalable=no` — viola WCAG 2.1 (HeroUI issue #5326). Para inputs visualmente menores, use `transform: scale(0.875); transform-origin: top left; font-size: 16px;` (técnica documentada por Anže Kržišnik no StackOverflow).

### iOS Safari selection handles em contenteditable

- Tiptap #2629: caret e seleção continuam visíveis em scrollable contenteditable mesmo depois de scroll out — bug nativo do iOS, sem workaround perfeito.
- Tiptap #7514 (2025): **seleção rápida em iOS Safari trava clicks globais** até refresh. Workaround: `onTouchEnd` em vez de `onClick`, mas "not scalable" segundo o reporter. **Mitigação real**: limite o uso de Tiptap a uma única instância por rota e considere blur explícito ao trocar de bloco.
- Tiptap #6187: `[contenteditable] { -webkit-user-select: text; user-select: text; }` corrige perda de foco em Safari macOS Monterey (e tem efeito colateral positivo no iOS).

### PWA standalone vs Safari tab — diferenças críticas

| Aspecto                    | Safari tab            | PWA standalone (added to home screen)                                                                |
| -------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------- |
| Swipe-back nativo          | Sim, sempre           | **Sim em iOS 18+, e não há API para desativar** (w3c/manifest #1041, Apple Developer Forums)         |
| State em background        | Geralmente preservado | **Perde state com frequência** (Medium myeris article confirma: app reinicia ao voltar de outro app) |
| Console / debugging        | Disponível            | Disponível apenas via Safari macOS conectado                                                         |
| `display-mode: standalone` | `false`               | `true` — use para esconder UI de browser                                                             |

**Mitigação para perda de state em background (confiança média-alta):**

```tsx
'use client'
import { useEffect } from 'react'

export function useAutoPersist<T>(key: string, value: T) {
  useEffect(() => {
    const persist = () => {
      try {
        localStorage.setItem(key, JSON.stringify({ v: value, t: Date.now() }))
      } catch {}
    }
    const onVis = () => {
      if (document.visibilityState === 'hidden') persist()
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', persist)
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pagehide', persist)
    }
  }, [key, value])
}
```

Use `pagehide` (não `beforeunload` — iOS ignora) + `visibilitychange`. Em paralelo, **debounced autosave** para Supabase a cada 800 ms de inatividade. Para uploads e mudanças críticas, fila em **IndexedDB** (idb-keyval, ~600 bytes gzip) que retransmite em reconexão. Marque essa fila como **[E]** porque coach perdendo workout que escreveu = churn.

---

## BLOCO 5 — Form-based vs inline: decisão pragmática para desafit

### Veredito opinativo (confiança **alta**)

**Híbrido assimétrico 80/20:**

- **80% form-based em vaul bottom sheet** com `snapPoints={[0.5, 0.92]}` e React Hook Form + Zod 4.
- **20% inline** apenas em texto livre de landing page (hero headline, parágrafos, CTA label).
- **0% inline** em workouts/sets/reps, hierarquia de programas, configuração de branding.

### Por quê — argumentos com evidência

1. **Perfil do usuário (não-designer)**: estudos de UX de Builder.io e Framer mostram que mesmo marketers experientes "switch to code view more often than I'd like" no mobile. Personal trainer não-tech terá fricção _maior_ com modo edit/preview/inline. Form-based é o padrão mental que ele já conhece (Instagram form, WhatsApp form).
2. **Conteúdo majoritariamente estruturado**: sets/reps/cargas/descanso são _números com semântica_. Inline editing aqui é puro custo sem benefício — não há "preview visual" que valha mais que um campo numérico claro. Stepper é melhor que digitar.
3. **375 px é pouco espaço**: bottom sheet em snap point 0.92 usa quase tudo. Inline + toolbar contextual + teclado virtual = colisão visual garantida.
4. **Solo founder + Claude Code**: cada superfície inline custa 3-5× mais para implementar e manter. Form com Zod + RHF é _pattern_ repetitivo que Claude Code escreve em minutos.
5. **Bugs reais documentados em inline**: Tiptap #7514 (page freeze), #6571 (double scroll), #6187 (focus loss). Form-based não tem nenhum desses.

### Quais campos ficam inline, quais ficam em form

| Campo                     | Estratégia                                 | Justificativa                                            |
| ------------------------- | ------------------------------------------ | -------------------------------------------------------- |
| Hero headline (landing)   | Inline (plaintext-only)                    | Curto, alto impacto visual, beneficia "vejo o que mudo". |
| Hero subheadline          | Inline (plaintext-only)                    | Idem.                                                    |
| Parágrafo de texto livre  | Inline (Tiptap rich text, [I])             | Bold/itálico fazem diferença visual.                     |
| CTA label                 | Form (bottom sheet)                        | Inline em botão estoura layout; form valida tamanho.     |
| Imagem                    | Form (bottom sheet com crop)               | Upload, alt text, crop não cabem inline.                 |
| FAQ items                 | Form (bottom sheet)                        | Pergunta + resposta + ordem; estruturado.                |
| Preços                    | Form (bottom sheet)                        | Decimal, moeda, validação — número não-inline.           |
| Sets/Reps/Carga (workout) | Form com stepper                           | Numérico estruturado.                                    |
| Nome de exercício         | Form (autocomplete a partir de biblioteca) | Não é texto livre.                                       |
| Cor do brand              | Form em página dedicada                    | Picker custom, raro de mudar.                            |

### Como o usuário não estranha a mistura

**Regra visual:**

- Em modo Edit, **todo elemento editável recebe outline tracejado sutil** (`border-dashed`, 1 px, opacity 0.4). Tap em qualquer um:
  - Se texto inline (landing): cursor entra no contenteditable.
  - Se qualquer outra coisa: bottom sheet abre com form.
- **Toggle Edit ⇄ Preview no header** unifica o "modo".
- **Mesma micro-interação de save**: Motion 12 com `<motion.div layoutId>` faz o valor "voar" do bottom sheet para a posição no mockup. Cria sensação de continuidade.

---

## BLOCO 6 — Libs maduras 2025-2026 (com bundle size estimado)

| Categoria                                         | Recomendação primária                                                                                                                                    | Bundle gzip aprox.          | Alternativa                                                                                                                                                                                                                                                             | Marcação                 |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **1. Inline text editing**                        | `contenteditable="plaintext-only"` cru para texto curto. **Tiptap 3 com extensões mínimas** apenas para 1-2 surfaces de texto rico.                      | 0 KB / ~30-40 KB Tiptap     | Lexical (~30 KB, mais pesado mas estável; usado por Meta). Slate (não recomendado, mobile fraco).                                                                                                                                                                       | [E] cru / [I] Tiptap     |
| **2. Image crop+upload mobile**                   | **react-easy-crop** — 1.86M downloads/sem, _built-in pinch-to-zoom_ (única com isso bem feito segundo npm-compare). ~12 KB.                              | ~12 KB                      | react-advanced-cropper (multi-touch ótimo mas maior); Pintura (comercial). Evite cropper.js (cropper desktop-first).                                                                                                                                                    | [E]                      |
| **3. Number stepper touch com long-press repeat** | **Custom** com `useRef` + `setInterval` (não tem lib mainstream). ~1 KB. Snippet abaixo.                                                                 | ~1 KB                       | shadcn não tem; HeadlessUI não tem.                                                                                                                                                                                                                                     | [E]                      |
| **4. Color picker mobile OKLCH**                  | **react-colorful** + conversor culori (OKLCH↔hex). react-colorful é ~3 KB e tem suporte touch nativo.                                                    | ~3 KB + 5 KB culori         | Não há picker OKLCH nativo maduro. Para MVP, oferecer palette pré-curada de 12-16 cores e _opcional_ picker hex.                                                                                                                                                        | [I] picker / [E] palette |
| **5. Drag-drop reorder touch**                    | **@dnd-kit/sortable** com TouchSensor `{delay:200, tolerance:5}` + drag handle dedicado (44×44 px).                                                      | ~10 KB core + 5 KB sortable | Pragmatic DnD (Atlassian) — usa native HTML5 DnD API, **~4.7 KB core**, mas: native DnD em iOS é frágil (Purple Squirrels review 2024 confirma); docs fracas; "Not enough examples" (issue #75); sem suporte mobile real para reorder. **Recomendação firme: dnd-kit.** | [E]                      |
| **6. Bottom sheet com snap points**               | **vaul** — único maduro em React.                                                                                                                        | ~6 KB                       | Headless UI Dialog (sem snap points), Radix Dialog (sem snap points).                                                                                                                                                                                                   | [E]                      |
| **7. Action sheet contextual**                    | **vaul** novamente (snap pequeno + handle).                                                                                                              | ~6 KB (já contabilizado)    | Radix Popover só em desktop; Headless UI Menu não tem snap nem drag.                                                                                                                                                                                                    | [E]                      |
| **8. Live preview**                               | **Não use iframe.** Use React portal renderizando o mesmo componente do aluno dentro de um container 375 px com `transform: scale()` opcional para zoom. | 0 KB extra                  | iframe traz CSP, performance, e sincronização extra. Builder.io usa iframe porque renderiza site externo do cliente — desafit renderiza o _próprio_ JSON.                                                                                                               | [E]                      |

### Boas práticas vaul para desafit (confiança alta)

```tsx
'use client'
import { Drawer } from 'vaul'
;<Drawer.Root
  snapPoints={[0.5, 0.92]}
  activeSnapPoint={snap}
  setActiveSnapPoint={setSnap}
  repositionInputs={true} // anti teclado virtual sobre input
  modal // bloqueia background — escolha consciente
  shouldScaleBackground={false} // mais leve, evita "black flash" reportado em allshadcn review
>
  <Drawer.Portal>
    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
    <Drawer.Content
      className="fixed inset-x-0 bottom-0 mt-24 flex h-full max-h-[92dvh] flex-col rounded-t-2xl bg-neutral-950"
      data-vaul-drawer-wrapper
    >
      <Drawer.Handle />
      {/* Conteúdo: formulário Zod + RHF */}
    </Drawer.Content>
  </Drawer.Portal>
</Drawer.Root>
```

### Snippet — Stepper com long-press repeat

```tsx
'use client'
import { useCallback, useRef } from 'react'

export function NumberStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const accel = useRef<ReturnType<typeof setTimeout> | null>(null)

  const start = useCallback(
    (delta: number) => {
      const apply = () => onChange(Math.min(max, Math.max(min, value + delta)))
      apply()
      // Após 400ms, começa a repetir a 120ms; após 1.5s acelera a 60ms
      accel.current = setTimeout(() => {
        timer.current = setInterval(apply, 120)
        setTimeout(() => {
          if (timer.current) clearInterval(timer.current)
          timer.current = setInterval(apply, 60)
        }, 1500)
      }, 400)
    },
    [value, onChange, min, max],
  )

  const stop = useCallback(() => {
    if (accel.current) clearTimeout(accel.current)
    if (timer.current) clearInterval(timer.current)
    accel.current = timer.current = null
  }, [])

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Diminuir"
        onPointerDown={() => start(-step)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        className="size-11 rounded-full bg-neutral-800 text-2xl active:scale-95 select-none touch-none"
      >
        −
      </button>
      <span className="min-w-[3ch] text-center text-2xl tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Aumentar"
        onPointerDown={() => start(step)}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        className="size-11 rounded-full bg-neutral-800 text-2xl active:scale-95 select-none touch-none"
      >
        +
      </button>
    </div>
  )
}
```

---

## BLOCO 7 — Anti-patterns documentados

**Importante**: a evidência aqui é mais anedótica que para os outros blocos. Marco confiança individual.

### O que NÃO fazer (com fonte ou raciocínio)

1. **Desktop UI miniaturizado em mobile** (confiança alta). Sidebar de 300 px com propriedades, "responsive" virando coluna que estoura 375 px. Trainerize cai nesse cilada segundo reviews do Software Advice 2026: "customizing templates or copying workouts is often difficult, especially on mobile devices."
2. **Mouse hover como gesto primário em qualquer coisa** (confiança alta — Motion issues #1179, #964, #1582). Em touch, `:hover` fica preso em iOS Safari. **Regra**: hover é decoração, nunca affordance crítica.
3. **`maximum-scale=1` / `user-scalable=no` para "resolver" auto-zoom** (confiança alta — HeroUI #5326, WCAG 2.1). Quebra A11y. A solução correta é `font-size: 16px`.
4. **Drag-drop sem drag handle dedicado em 375 px** (confiança alta — dnd-kit #453). Confunde scroll com drag. Mesmo dnd-kit oficial recomenda handle.
5. **WYSIWYG full-feature em mobile** (confiança média). Tentar replicar uma barra de ferramentas estilo Word em 375 px é receita de teclado virtual sobrepondo metade da UI. Notion mobile abandonou isso: barra é minimalista, opções vão em bottom sheet.
6. **Iframe preview com mesmo origin do app** (confiança média). Builder.io usa porque renderiza sites externos. Para desafit, iframe adiciona CSP headaches, perde React context, dobra requests. Use portal/renderização direta.
7. **Tiptap em múltiplas instâncias por rota** (confiança alta — Tiptap #7514, #7540). iOS Safari trava clicks globais com seleção rápida; sintomas amplificam com várias instâncias. Limite a 1.
8. **`overflow: hidden` no body para "travar scroll"** quando bottom sheet aberto, sem usar `data-vaul-drawer-wrapper` (confiança alta — vaul docs). vaul cuida disso; reimplementar manualmente quebra restauração de scroll.
9. **`localStorage.setItem` em `beforeunload` em iOS** (confiança alta — Webkit ignora). Use `pagehide` + `visibilitychange`.
10. **Pinch-to-zoom como gesto de toggle Edit/Preview** (confiança média). Webflow tentou variantes; viola expectativa de zoom nativo, conflita com VoiceOver. Use botão.

### Casos públicos de "tentei inline, voltei para form"

- **Builder.io**: começou com inline mais amplo, recuou para "inline apenas em texto de built-in components" (mudança de docs ao longo de 2023-2024). Confirmado pela documentação atual.
- **Squarespace Fluid Engine**: lançado com promessa de "edit anywhere"; o app mobile efetivo manteve form-based (confiança média — observação de produto, sem post-mortem público).
- **Notion**: nunca tentou mockup ao vivo; sempre tratou documento ≡ produto (escolha de design diferente).

### Bugs WYSIWYG que aparecem na escala

- Tiptap #7514: page freeze global em iOS Safari após seleção rápida.
- Tiptap #6571: double scroll quando teclado virtual abre dentro do editor.
- Tiptap #6187: foco perdido em Safari sem `user-select: text`.
- Tiptap #2639: editor quebra dentro de ShadowRoot em Safari.
- Tiptap #2629: caret visível em scrollable contenteditable após scroll.
- Motion #964 e #1582: drag em touch confunde y-axis com swipe horizontal.

---

## BLOCO 8 — Recomendação final para desafit

### Princípios condensados

1. **Mobile-first ≠ mobile-only**: ofereça desktop como progressive enhancement com mais espaço para o mesmo schema, mas otimize 100% da arquitetura para 375 px.
2. **Híbrido assimétrico 80/20**: form-based em vaul bottom sheet para 80% do produto. Inline contenteditable cru apenas em texto livre de landing.
3. **Toggle Edit ⇄ Preview no header**, único modal de mudança de modo. Sem long-press, sem pinch, sem flutuante.
4. **Auto-save debounced (800 ms) → Supabase**, com IndexedDB fila como fallback offline. Persistência via `pagehide` + `visibilitychange`.
5. **dnd-kit + drag handle 44×44 px** com `{delay:200, tolerance:5}`. Para listas ≤7 itens, considere botões ↑↓ (zero risco).
6. **Bundle target 30-50 KB First Load JS**: vaul (6) + dnd-kit (15) + react-easy-crop (12) + Zod 4 + RHF = ~45 KB. Tiptap (~35 KB) entra apenas no lazy chunk da página de landing.

### Tabela consolidada por surface

| Surface                                                          | Padrão                                                  | Pattern UX                                                                                                                                                                                                                                                                                                          | Lib                                                | Marcação                        | Horas est. (solo + Claude Code) |
| ---------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------- | ------------------------------- |
| **(a) Landing page com blocos hero/texto/imagem/FAQ/CTA/preços** | **Híbrido**: inline para _texto_; form para tudo o mais | Header com toggle Edit/Preview. Em Edit: outline tracejado em todo elemento. Tap em texto → contenteditable + toolbar minimal (B/I/link) acima. Tap em imagem/CTA/FAQ → vaul bottom sheet com form. Reorder de blocos com drag handle. Botão "+ Adicionar bloco" abre vaul com lista de tipos.                      | Tiptap 3 (lazy) + vaul + dnd-kit + react-easy-crop | [E] core; [I] Tiptap rich text  | **40-55h** (a peça mais cara)   |
| **(b) Programa hierárquico (módulos + componentes)**             | **Form-based puro**                                     | Tree view com indentação. Tap em módulo → expand. Tap em componente → vaul bottom sheet com form. Drag handle para reorder dentro do mesmo nível. Mover entre módulos: action "Mover para..." no menu, não drag (drag cross-container em 375 px é frágil — dnd-kit #1955).                                          | dnd-kit + vaul + RHF + Zod 4                       | [E]                             | **16-22h**                      |
| **(c) Workout individual (sets/reps/cargas)**                    | **Form-based 100%**                                     | Lista vertical de exercícios. Cada exercício é card com: nome (link → bottom sheet "Escolher exercício"), 3 colunas de stepper (sets / reps / carga). Tap no card abre vaul com form completo (descanso, tempo, notas, vídeo). Drag handle à direita para reorder.                                                  | NumberStepper custom + vaul + dnd-kit              | [E]                             | **12-18h**                      |
| **(d) Branding (cor / logo / fonte)**                            | **Form-based puro em página dedicada**                  | Página `/branding` (não bottom sheet — é configuração rara, não inline). Palette de 12 cores pré-curadas em OKLCH + 1 hex custom opcional. Upload de logo com react-easy-crop (recorte quadrado obrigatório). Seletor de fonte: 4-6 opções tipográficas pré-aprovadas (sem Google Fonts picker — over-engineering). | react-easy-crop + react-colorful (lazy)            | [E] palette / [I] picker custom | **8-12h**                       |

### Estrutura técnica recomendada para o JSON do schema

Aproveitando que você já decidiu `pages.published_blocks jsonb` + `components.payload jsonb`:

```ts
// schemas/blocks.ts
import { z } from 'zod'

export const BlockId = z.string().uuid()

export const HeroBlock = z.object({
  type: z.literal('hero'),
  id: BlockId,
  headline: z.string().min(1).max(120),
  subheadline: z.string().max(240).optional(),
  ctaLabel: z.string().max(40).optional(),
  ctaHref: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
})

export const TextBlock = z.object({
  type: z.literal('text'),
  id: BlockId,
  // Texto rico armazenado como Tiptap JSON, não HTML — facilita validação e portabilidade
  content: z.record(z.string(), z.unknown()),
})

export const Block = z.discriminatedUnion('type', [HeroBlock, TextBlock /*, ...*/])
export type Block = z.infer<typeof Block>
```

Validação em todos os checkpoints: client (RHF resolver), server action (Next.js 16), e RLS no Supabase (CHECK constraint mínima). Versionamento dos `ai_prompts` com `prompt_version: number` no payload e função de migração idempotente.

### Estimativa total de horas para o MVP do editor

| Item                                                                                                                     | Horas                                                       |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Landing page editor (a)                                                                                                  | 40-55                                                       |
| Programa hierárquico (b)                                                                                                 | 16-22                                                       |
| Workout individual (c)                                                                                                   | 12-18                                                       |
| Branding (d)                                                                                                             | 8-12                                                        |
| Infra compartilhada: ModeToggle, useKeyboardInset, useAutoPersist, IndexedDB queue, schemas Zod, Supabase server actions | 18-25                                                       |
| QA real em iPhone físico (375 px + 393 px), bug fixing iOS Safari quirks                                                 | 20-30                                                       |
| **Total MVP do editor**                                                                                                  | **114-162h** (≈ 3-4 semanas full-time solo com Claude Code) |

### Marcação E/I/O resumida das principais decisões

- **[E]** essencial dia 1: vaul bottom sheet, dnd-kit + handle, NumberStepper custom, react-easy-crop, toggle Edit/Preview, useKeyboardInset, autosave + IndexedDB fila, schemas Zod 4 discriminatedUnion, `font-size: 16px` em todo input, palette OKLCH curada.
- **[I]** incremental (mês 2-3): Tiptap rich text para landing texto livre, color picker custom OKLCH, AI inline rewrite, undo/redo com command pattern, comments em blocos.
- **[O]** over-engineering (não fazer): IME composition handling para CJK, pinch-to-zoom custom, gestos custom além de tap/long-press/drag-handle, iframe live preview, WYSIWYG completo estilo Webflow, drag cross-container em hierarquia.

### Confiança final do plano

- **Alta**: tudo relacionado a vaul, dnd-kit com handle, 16 px anti-zoom, VisualViewport para teclado, form-based para workout/programa/branding, evitar Motion `whileHover` em touch.
- **Média**: Tiptap em produção sustentável para landing (depende de quantos blocos de texto rico existirão; aceite os bugs iOS Safari conhecidos e tenha plano B de cair para `contenteditable plaintext-only`).
- **Baixa-média**: estimativa de horas (depende fortemente de qualidade do design system pronto antes; multiplicar por 1.5 se ainda não houver design tokens definidos).

### Fontes primárias consultadas

- Docs oficiais e issues: github.com/clauderic/dnd-kit (issues #791, #1955, #435, #453, #1398, #477; docs Touch sensor), github.com/emilkowalski/vaul (npm 1.0.0 docs, issues #635, #473, post "Building a drawer component"), github.com/ueberdosis/tiptap (issues #2629, #6571, #7514, #7540, #6187, #4925, #2639), github.com/motiondivision/motion (issues #1179, #964, #1582, #1484, #524, #794, #306).
- MDN: VirtualKeyboard API, VisualViewport API.
- W3C: VirtualKeyboard Working Draft, github.com/w3c/manifest #1041.
- Builder.io docs: visual-editor, block-types, advanced-settings, knowledge-center/visual-editing.
- Framer changelog: inline-content-editing, mobile-friendly-cms, editor-bar, one-click-page-edit.
- Chrome for Developers: Full control with the VirtualKeyboard API.
- Apple Developer Forums: No back gesture on PWA iOS.
- Análises de produto: Trainerize blog (TrueCoach comparison), Promealplan, Hubfit, Sportfitnessapps, MobileAppDaily Builder.io review, Software Advice Trainerize reviews 2026.
- CSS / fixes: CSS-Tricks "16px or Larger Text Prevents iOS Form Zoom", defensivecss.dev, Rick Strahl blog 2023, Bram.us VirtualKeyboard API post.
- Compare libs: npm-compare (react-easy-crop vs react-cropper vs react-image-crop), LogRocket image cropping libraries, LogRocket Pragmatic DnD guide, Purple Squirrels review Pragmatic DnD 2024.

Onde a evidência é mais fraca (Trainerfu claims, MyPTHub UX detalhada, anti-patterns 5/6/10), marquei como confiança média ou baixa e baseei em raciocínio + observação de produto, não em post-mortems públicos.
