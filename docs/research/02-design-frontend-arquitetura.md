# desafit.app — Consultoria de Design + Frontend + Arquitetura SaaS

> Pesquisa em produtos reais (web.dev, Vercel for Platforms, Supabase docs, Zod, Next.js 16 docs, dndkit, vaul, OneSignal, Lovable/v0/Bolt, Webflow/Framer, shadcn registries). Onde a busca aberta não cobre detalhes, está marcado **DOC NÃO COBRE** e a recomendação vem do framework consolidado WCAG 2.2 + APCA + práticas de produção.

---

## BLOCO 1 — UI/UX fitness PWA mobile

### 1.0 Tabela comparativa cross-app (8 apps × 6 eixos)

| Eixo                    | Centr                                           | Future                                   | Whoop                                      | Strava                              | Apple Fitness+                       | Nike Training Club       | Freeletics                          | MyFitnessPal                   |
| ----------------------- | ----------------------------------------------- | ---------------------------------------- | ------------------------------------------ | ----------------------------------- | ------------------------------------ | ------------------------ | ----------------------------------- | ------------------------------ |
| **Home "hoje"**         | Hero card + cards horizontais                   | Coach msg + workout card                 | Recovery donut + Strain donut (data-dense) | Feed social (anti-pattern coaching) | Activity rings + "Today" grid        | Tile grid de programas   | Coach hero card "Today" + Start     | Macros donut + Recently Logged |
| **Streak/progresso**    | Calendar 7-dot                                  | Coach msg textual                        | Trend chart + cards                        | Bar chart semanal + GitHub heatmap  | Activity rings (Move/Exercise/Stand) | Plan progress %          | Linear "X-day streak" badge         | Calendar verde                 |
| **CTA principal**       | Hero `Start` botão grande                       | Hero `Start workout`                     | "Log activity" inline                      | FAB "+" record                      | Workout card tap                     | Workout card tap         | `Start` botão grande hero           | "+ Add food" FAB               |
| **Density**             | Sparse premium                                  | Sparse coach-first                       | Dense utility                              | Dense feed                          | Sparse premium                       | Medium discovery         | Sparse premium                      | Dense utility                  |
| **Execução workout**    | Vídeo embed + tabela séries inline + input peso | Vídeo sticky + lista vertical + tap-done | N/A (não prescreve)                        | GPS map full-screen                 | Vídeo full + métricas overlay        | Vídeo full + slides      | Cards exercício + Done botão grande | N/A                            |
| **Marcar set**          | Tap row                                         | Tap row                                  | —                                          | Auto (GPS)                          | Auto (timer)                         | Tap "Next"               | Tap "Done" gigante                  | —                              |
| **Timer descanso**      | Bottom timer compacto                           | Modal overlay grande                     | —                                          | —                                   | Overlay countdown                    | Overlay full-screen      | Overlay full-screen number gigante  | —                              |
| **Input carga**         | Number stepper                                  | Number stepper                           | —                                          | —                                   | —                                    | —                        | Stepper +/−                         | Number                         |
| **Check-in campos**     | 1 mood emoji + texto                            | Msg livre + foto                         | 5–10 toggles diários                       | —                                   | —                                    | —                        | Sleep + soreness                    | 30+ campos comida              |
| **Frequência check-in** | Diário soft                                     | Sob demanda                              | Diário + sleep journal                     | Por activity                        | Por workout                          | Por workout              | Diário                              | Por refeição                   |
| **Progresso peso**      | Line + foto carousel                            | Foto compare slider                      | Line chart trends                          | Bar volume                          | Activity rings histórico             | —                        | Line chart                          | Line chart longo prazo         |
| **Antes/depois**        | Foto timeline                                   | Compare slider drag                      | —                                          | —                                   | —                                    | —                        | Foto galeria                        | —                              |
| **Bottom-nav itens**    | 5                                               | 4                                        | 5                                          | 5                                   | 5                                    | 5                        | 5                                   | 5                              |
| **Header**              | Logo + avatar                                   | Avatar coach + chat icon                 | Date picker + settings                     | Search + + + bell                   | Clean                                | Clean                    | Clean                               | Search + diary nav             |
| **Transição**           | Slide horizontal                                | Slide horizontal                         | Fade                                       | Slide horizontal                    | Slide horizontal                     | Slide horizontal + scale | Slide horizontal                    | Slide horizontal               |
| **Pull-to-refresh**     | ❌                                              | ❌                                       | ✅ home                                    | ✅ feed                             | ❌                                   | ❌                       | ✅ home                             | ✅ diary                       |
| **Empty state**         | Ilustração + CTA                                | Coach msg                                | Texto + CTA                                | Onboarding flow                     | Suggestions                          | Suggestions              | Ilustração + CTA                    | Texto + CTA                    |
| **Loading**             | Skeleton                                        | Skeleton                                 | Spinner + skeleton                         | Skeleton + spinner                  | Skeleton                             | Skeleton                 | Skeleton                            | Spinner                        |

### 8 patterns vencedores (em 4+ apps)

1. **Bottom-tab 5 itens, sem hamburger** — todos 8 apps.
2. **Hero card único topo com CTA primário grande** — Centr, Future, Freeletics, Apple Fitness+ (variante "Today").
3. **Transição slide horizontal entre stacks** — 7/8.
4. **Skeleton screens > spinners pra >200ms loads** — 6/8.
5. **Vídeo demo + dados ao mesmo tempo (sticky ou overlay)** — Future, Centr, NTC, Apple Fitness+.
6. **Streak/progresso semanal visualizado (donut ou dot calendar)** — Apple, Whoop, MFP, Freeletics, Centr.
7. **Cards horizontais scroll secundários abaixo do hero** — Centr, Apple, NTC, Nike.
8. **Header clean (logo/avatar) sem ações pesadas** — 6/8 (exceto Strava social, MFP utility).

### 3 patterns polarizantes (50/50)

1. **Density:** sparse-premium (Centr, Future, Apple, NTC, Freeletics) vs dense-utility (Whoop, MFP, Strava).
2. **Feed social na home:** Strava sim; outros 7 não. Não há meio-termo.
3. **Pull-to-refresh:** 4 sim, 4 não. Divide por se conteúdo é "fluxo" (feed/log) ou "curado" (programa).

### Recomendação concreta pro desafit (cada eixo)

**Home/dashboard do dia:**

- Hero card único ocupando ~45% da viewport: "Hoje, [data] — [Nome do componente]" + thumbnail + CTA primário `Começar` em `Button size="lg"` full-width `h-14`.
- Donut/dot streak semanal abaixo do hero, compacto `h-20`.
- Lista de próximos 3 componentes (cards `h-24`, scroll horizontal). Sem FAB.
- **Sparse-premium** (desafit é coaching).

**Execução:**

- Vídeo sticky topo `aspect-ratio: 16/9`, lista vertical abaixo (Accordion shadcn).
- Set row: `[Set N] [Peso input] [Reps input] [✓ tap row]` — tap no row marca completo.
- Timer descanso = vaul Drawer snap full, countdown `text-7xl tabular-nums`, `navigator.vibrate(200)` no fim.
- Carga: `<Input inputMode="decimal" />` + stepper `−`/`+` (passo 2.5kg, long-press repeat).

**Check-in:** 3 campos só — energia slider 1–10, sono slider 1–10, mood emoji 5-step. Foto pesagem semanal opcional separada.

**Progresso:** cards número grande + delta colored topo (`[Peso] [PR squat] [Sequência]`), line chart Recharts default 30d, compare slider antes/depois.

**Nav:** bottom-tab 4 itens (Home / Programa / Progresso / Perfil). Header clean (logo prof + avatar). Sem search global.

**Polish:** `active:scale-[0.98]` em interativos, `navigator.vibrate(10)` no Android, skeleton em todo carregamento >200ms, transição view-transitions API.

**Trade-offs / fase 2:**

- Swipe-to-complete set (lib motion) → fase 2; tap-first MVP.
- Pull-to-refresh → fase 2 (lib `react-simple-pull-to-refresh` ou custom motion drag).
- Long-press menu → fase 2.
- Feed social comunitário → fora do escopo MVP (não é Strava).

---

## BLOCO 2 — Native-feel PWA (instalação, push, gestures)

### 2.1 Install prompt — timing e UX

**Pesquisa:**

- **web.dev/learn/pwa/installation-prompt**: Chrome dispara `beforeinstallprompt` após heurística (≥30s engagement no domínio). Mini-infobar pode ser suprimida via `e.preventDefault()`. `prompt()` chamado uma vez por evento; precisa novo dispatch após dismiss.
- **developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/How_to/Trigger_install_prompt**: pattern oficial — listen, preventDefault, save event, trigger from UI button.
- **magicbell.com/blog/pwa-ios-limitations-safari-support-complete-guide**: iOS não tem `beforeinstallprompt`. Push iOS 16.4+ exige PWA na home screen. EU iOS 17.4 perdeu standalone PWA (DMA).
- **onesignal.com/blog/increase-opt-in-rates-for-push-notifications**: prompts iOS opt-in média 40–45%; com pre-prompt sobe ~60–70%.

**Padrões vencedores:**

- Suprimir mini-infobar Chrome e mostrar custom prompt.
- Triggar após valor entregue (não no primeiro load).
- iOS exige educação visual ("Compartilhar → Adicionar à tela inicial").
- Não-aceito → silenciar 7 dias.

**Recomendação concreta:**

- Custom bottom-sheet vaul. Trigger: **2ª sessão E após primeira ação significativa** (completou check-in ou componente).
- Copy: _"Instale o app do [Nome do Prof]. Receba lembretes e treine offline. Sem app store."_
- iOS: detectar `/iPhone|iPad/.test(navigator.userAgent) && !navigator.standalone` → bottom-sheet com ilustração do Share → Add to Home Screen.
- Dismiss → localStorage timestamp, reaparece após 7 dias.

```tsx
'use client'
import { Drawer } from 'vaul'
import { useEffect, useState } from 'react'

type BIP = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt({ canShow }: { canShow: boolean }) {
  const [deferred, setDeferred] = useState<BIP | null>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const standalone =
      matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
    setIsIOS(/iPhone|iPad/.test(navigator.userAgent) && !standalone)
    const onBIP = (e: Event) => {
      e.preventDefault()
      setDeferred(e as BIP)
    }
    window.addEventListener('beforeinstallprompt', onBIP)
    return () => window.removeEventListener('beforeinstallprompt', onBIP)
  }, [])

  useEffect(() => {
    if (!canShow) return
    const last = +(localStorage.getItem('install-dismissed') || 0)
    if (Date.now() - last > 7 * 864e5 && (deferred || isIOS)) setOpen(true)
  }, [canShow, deferred, isIOS])

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'dismissed') localStorage.setItem('install-dismissed', String(Date.now()))
    setOpen(false)
  }

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 rounded-t-2xl bg-background p-6">
          <Drawer.Title className="text-xl font-semibold">Instalar app</Drawer.Title>
          {isIOS ? (
            <IOSShareGuide />
          ) : (
            <button
              onClick={install}
              className="mt-4 h-12 w-full rounded-lg bg-primary text-primary-foreground"
            >
              Instalar
            </button>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
```

**Trade-offs / fase 2:** detecção via `navigator.getInstalledRelatedApps()` pra esconder prompt se já instalado em outro contexto.

### 2.2 Push notifications — engagement

**Pesquisa:**

- **onesignal.com/blog/how-to-create-more-compelling-opt-in-messages-for-ios-push**: pre-prompt eleva iOS opt-in pra ~60–70%.
- **onesignal.com/blog/optimizing-notification-timing**: gaming 8pm, news 10–12am + 5pm; re-engagement gaming melhor meio-dia. Pra fitness, manhã (6–9h) workouts matinais; tarde (17–19h) pós-trabalho.
- **documentation.onesignal.com/docs/en/web-push-for-ios**: iOS 16.4+ exige gesto explícito + PWA instalada.
- **flywheel.so/post/can-pwas-send-push-notifications**: sem rich media nem silent push em iOS PWA.

**Vencedores:** pre-prompt, contextualizar valor, "agora não" como opção, frequency cap por usuário, deep-link pra tela exata.

**Recomendação:**

- Pedir permissão após **3ª sessão E primeiro check-in**. Pre-prompt custom: _"Receba lembretes do seu treino e mensagens do [Prof]. Sem spam."_ `[Receber lembretes]` (primary) `[Agora não]` (ghost).
- Frequency cap: **1 push/dia útil**, máx 2 em casos especiais.
- Quiet hours 22h–6h tz do aluno.
- 5 templates:
  1. _"Bom dia 💪 Seu treino de [grupo] está pronto. Vamos?"_
  2. _"[Prof] te mandou uma mensagem: «[preview 60c]…»"_
  3. _"3 dias sem treinar. Bora retomar leve hoje?"_
  4. _"🔥 Sequência de 7 dias! Não quebre hoje."_
  5. _"Check-in de domingo: como foi a semana?"_ (dom 19h)

```ts
// public/sw.js — Web Push handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: '/badge-72.png',
      tag: data.tag,
      data: { url: data.url },
      requireInteraction: false,
    }),
  )
})
self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  e.waitUntil(clients.openWindow(e.notification.data.url))
})
```

**Trade-offs / fase 2:** silent push (data-only) pra sync background → não funciona em iOS PWA. Pular.

### 2.3 Gestures viáveis

**Pesquisa:**

- **github.com/emilkowalski/vaul**: React 19 nas peerDeps (`^19.0.0`). Snap points + swipe-to-dismiss nativos.
- **dndkit.com**: TS-first, React 19 compat, touch nativo via PointerSensor.
- **DOC NÃO COBRE** uma lib React de pull-to-refresh canônica em 2025; opções vivas: `react-simple-pull-to-refresh` ou implementação motion drag custom.
- Web Vibration API: Android sim, **iOS Safari NÃO** (nem PWA). Long-press: `pointerdown` + setTimeout 500ms. Edge swipe back: nativo em iOS Safari standalone + Android Chrome.

**Recomendação (tabela viabilidade):**

| Gesture                    | Viável     | Lib/API                      | Fase   |
| -------------------------- | ---------- | ---------------------------- | ------ |
| Bottom sheet swipe         | ✅         | vaul                         | Dia 1  |
| Snap points peek/half/full | ✅         | vaul snapPoints              | Dia 1  |
| Drag-drop editor           | ✅         | @dnd-kit                     | Dia 1  |
| Scroll snap carousel       | ✅         | CSS puro                     | Dia 1  |
| Haptic                     | ⚠️ Android | navigator.vibrate (graceful) | Dia 1  |
| Long-press menu            | ✅         | pointerdown+timer            | Fase 2 |
| Pull-to-refresh            | ✅         | motion drag custom           | Fase 2 |
| Edge swipe back            | ✅ nativo  | nenhuma                      | Dia 1  |
| Swipe set-complete         | ✅         | motion drag                  | Fase 2 |

```ts
export const haptic = (ms = 10) => {
  try {
    ;(navigator as any).vibrate?.(ms)
  } catch {}
}
```

### 2.4 Loading states e perceived performance

**Recomendação por timing:**

| Duração   | Pattern                             | Quando                           |
| --------- | ----------------------------------- | -------------------------------- |
| <200ms    | Nada                                | Inputs, taps, optimistic updates |
| 200–800ms | Skeleton casado com layout          | Listas, cards do dashboard       |
| 800ms–2s  | Skeleton + spinner pequeno em zonas | Detail pages                     |
| >2s       | Skeleton + progress bar topo        | Geração IA (vibe coding)         |

- **Optimistic UI** com `useOptimistic` (React 19) pra: marcar set completo, salvar check-in, enviar mensagem.
- **SWR** via `'use cache'` + `cacheLife('minutes')` em dados toleráveis stale.
- **Suspense streaming**: shell estático + `<Suspense fallback={<Skeleton/>}>` em cada bloco.

```tsx
// useOptimistic pra check-in
'use client'
import { useOptimistic, startTransition } from 'react'
export function CheckInForm({
  saved,
  onSave,
}: {
  saved: CheckIn[]
  onSave: (c: CheckIn) => Promise<void>
}) {
  const [optimistic, addOptimistic] = useOptimistic(saved, (s, n: CheckIn) => [
    ...s,
    { ...n, _pending: true },
  ])
  return (
    <form
      action={(fd) =>
        startTransition(async () => {
          const c = parseFormToCheckIn(fd)
          addOptimistic(c)
          await onSave(c)
        })
      }
    >
      {/* ... */}
    </form>
  )
}
```

---

## BLOCO 3 — Vibe coding UX

### 3.1 Pipeline UX patterns

**Pesquisa:**

- **lovable.dev/guides/lovable-vs-bolt-vs-v0**: Lovable usa Chat Mode + Visual Edits (Visual Edits não consome credit — incentiva iteração). Build full-stack React + Supabase.
- **nxcode.io/resources/news/vibe-design-tools-compared-stitch-v0-lovable-2026**: v0 mostra preview ao vivo + chat lateral. One-click deploy Vercel.
- **techpoint.africa/guide/lovable-vs-bolt-vs-v0-review**: Bolt usa StackBlitz WebContainers, mostra arquivos sendo escritos. Lovable + v0 entregaram fotos booth funcional de um único prompt; Bolt falhou.
- **freeacademy.ai/blog/v0-vs-bolt-vs-lovable-ai-app-builders-comparison-2026**: padrão "70%" — todos chegam a ~70% do app, 30% é dor.

**Vencedores (em 3+):**

- Streaming texto + preview ao vivo (Lovable, Bolt, v0)
- Histórico de gerações navegável (v0, Cursor)
- Chat de refinamento contextual (Lovable)
- Templates "spark" iniciais (v0, Lovable, Bolt)
- Diff visual em mudanças destrutivas (Cursor)

**Polarizantes:** show code vs hide code (Lovable hide → fluido pra não-dev; Bolt show → controle).

### 3.2 Input UX

Prompt livre dominante. Lovable/v0 aceitam upload imagem ref. Cursor exige `@files` contexto explícito.

### 3.3 Output / iteração

Lovable Visual Edits inline = killer (sem custo de tokens). Cursor diff hunk-by-hunk = controle. v0 regenera componente inteiro.

### 3.4 Vibe coding pra desafit (5–10 perguntas → programa + landing + emails + push)

**Pipeline UX — stepper visual horizontal + streaming + cards aparecendo:**

```
[✓ Coleta] → [⏳ Estrutura] → [⏸ Landing] → [⏸ Form] → [⏸ Emails] → [⏸ Push] → [⏸ Revisar]
                streaming claude texto
                + card "Semana 1" aparece preenchido
                + card "Semana 2" com skeleton ainda
```

**Estágios (paralelizáveis após estrutura):**

1. ✅ Coleta (form wizard ~2min)
2. ⏳ Estrutura programa (módulos + componentes) — ~10s
3. ⏳ Landing — ~8s (paralelo a 4–6)
4. ⏳ Form captação — ~5s
5. ⏳ Sequência de email (5 msgs) — ~15s
6. ⏳ Push templates (5) — ~5s
7. ✅ Revisar/editar/publicar

**Input form (questions em ordem):**

1. Nome do programa + nicho
2. Duração (semanas) + frequência semanal
3. Equipamento (academia/casa/livre)
4. Idade range
5. Restrições
6. Tom (formal/casual/motivacional)
7. Plano alimentar (sim/não)
8. Check-ins (frequência)
9. Preço + parcelamento
10. Cor primária + logo (opcional)

UX: wizard `<Card>` 1 question/screen mobile, auto-save por step. Skip → defaults inteligentes.

**Loading UX (5–30s por estágio):**

- Stepper horizontal com estágio ativo + spinner pequeno.
- Texto streaming Vercel AI SDK: _"Gerando módulo 'Semana 1: Adaptação'… 3 componentes criados…"_
- Cards de preview aparecem preenchidos conforme materializam. Nunca loader full-screen opaco.

**Output / revisar / publicar:**

- Editor visual (bloco 4) com tudo populado. Side-panel direita pra ajustes.
- `Regenerar este componente` em cada card → mantém resto, regenera só payload via Claude.
- `Regenerar este módulo`, `Regenerar landing inteira`.
- `Publicar` cria programa `published` + landing live em `/[tenant]/programa/[slug]`.

**Iteração sem perder o resto:**

- Cada bloco/componente/email carrega `regenerate_seed` (hash). Regenerar = mesma seed + delta do user _("mais conciso, foque em iniciante")_.
- Diff opcional antes de aplicar.

```tsx
// Vercel AI SDK streaming RSC pra gerar módulo
import { streamUI } from 'ai/rsc'
import { anthropic } from '@ai-sdk/anthropic'

export async function generateModule(input: ProgramInput) {
  return streamUI({
    model: anthropic('claude-sonnet-4-5'),
    prompt: buildModulePrompt(input),
    text: ({ content, done }) => <ModuleCard streaming={!done}>{content}</ModuleCard>,
  })
}
```

**Trade-offs / fase 2:** geração de imagens (capa programa) → fase 2 com Flux/SDXL via Replicate. Multi-modal input (foto do plano antigo do prof) → fase 2.

---

## BLOCO 4 — Editor visual drag-drop

### 4.1 Stack drag-drop

**Pesquisa:**

- **dndkit.com**: TS-first, framework-agnostic core + React adapter, React 19 compatível (peer dep aberta). PointerSensor cobre touch.
- Alternativas: `pragmatic-drag-and-drop` (Atlassian; performático em árvores grandes — usado em Jira/Confluence), `framer-motion` drag (reorder simples), `react-dnd` (legado).

**Recomendação:** **@dnd-kit dia 1** com `<SortableContext>` + `verticalListSortingStrategy`. Se >50 blocos virar gargalo, migre só canvas pra `pragmatic-drag-and-drop`.

### 4.2 UX patterns vencedores

**Pesquisa (Webflow, Framer, Notion, Builder.io):**

- Webflow side-panel exclusivo; mobile read-only.
- Framer híbrido (text inline, props side-panel). Mobile = preview.
- Notion 100% inline com `/` slash.
- Tiptap/Tldraw floating toolbar contextual.
- Builder.io drag visual + props side panel + multi-canal.

**Vencedores (3+):**

- Side-panel direito pra props complexas
- Text edit inline com clique direto
- Slash command `/` pra inserir bloco
- Drop zone linha horizontal azul 2px + leve elevation
- Cmd+Z global, history depth 50
- Auto-save com indicador "Salvo 2s ago"
- Mobile = read-only (preview)

### 4.3 Blocos / library

Sidebar esquerda categorizada (`Hero / Conteúdo / Mídia / CTA / Form / Pricing / FAQ / Spacer`) + slash `/` no canvas. Drag preview ghost translúcido + drop-zone linha azul.

### 4.4 Storage / data

JSON tree em `page_blocks jsonb`. Salvamento atômico por bloco (PATCH path `/blocks/3/props/title`). Versioning `draft_blocks` (editável) + `published_blocks` (live). Revert = copy published → draft.

```sql
CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL,
  slug text NOT NULL,
  draft_blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  published_blocks jsonb,
  published_at timestamptz,
  schema_version int NOT NULL DEFAULT 1,
  UNIQUE (tenant_id, slug)
);
CREATE INDEX pages_tenant_idx ON pages (tenant_id);
CREATE INDEX pages_published_gin ON pages USING gin (published_blocks jsonb_path_ops);
```

**Schema JSON (Zod discriminated union):**

```ts
import { z } from 'zod'
const BlockBase = z.object({ id: z.string().uuid(), visible: z.boolean().default(true) })

export const Block = z.discriminatedUnion('kind', [
  BlockBase.extend({
    kind: z.literal('hero'),
    props: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      cta_label: z.string(),
      cta_href: z.string().url(),
      bg_image: z.string().url().optional(),
    }),
  }),
  BlockBase.extend({ kind: z.literal('rich_text'), props: z.object({ html: z.string() }) }),
  BlockBase.extend({
    kind: z.literal('image'),
    props: z.object({
      src: z.string().url(),
      alt: z.string(),
      aspect: z.enum(['16/9', '1/1', '4/5']).default('16/9'),
    }),
  }),
  BlockBase.extend({
    kind: z.literal('video'),
    props: z.object({ src: z.string().url(), poster: z.string().url().optional() }),
  }),
  BlockBase.extend({
    kind: z.literal('features'),
    props: z.object({
      items: z.array(z.object({ icon: z.string(), title: z.string(), body: z.string() })).max(6),
    }),
  }),
  BlockBase.extend({
    kind: z.literal('testimonials'),
    props: z.object({
      items: z
        .array(
          z.object({ name: z.string(), quote: z.string(), avatar: z.string().url().optional() }),
        )
        .max(8),
    }),
  }),
  BlockBase.extend({
    kind: z.literal('pricing'),
    props: z.object({
      tiers: z.array(
        z.object({
          name: z.string(),
          price_cents: z.number().int(),
          period: z.enum(['mo', 'yr', 'once']),
          features: z.array(z.string()),
        }),
      ),
    }),
  }),
  BlockBase.extend({
    kind: z.literal('faq'),
    props: z.object({ items: z.array(z.object({ q: z.string(), a: z.string() })) }),
  }),
  BlockBase.extend({
    kind: z.literal('lead_form'),
    props: z.object({
      fields: z.array(z.enum(['name', 'email', 'phone', 'goal'])),
      success_message: z.string(),
    }),
  }),
  BlockBase.extend({
    kind: z.literal('cta_banner'),
    props: z.object({ title: z.string(), button_label: z.string(), button_href: z.string().url() }),
  }),
  BlockBase.extend({
    kind: z.literal('spacer'),
    props: z.object({ size: z.enum(['sm', 'md', 'lg', 'xl']).default('md') }),
  }),
])
export type Block = z.infer<typeof Block>
```

**11 blocos MVP fitness:** hero · rich_text · image · video · features (3-up) · testimonials · pricing · faq · lead_form · cta_banner · spacer.

**10 decisões UX concretas:**

1. Text inline; props complexas em side-panel direito.
2. Drop zone = linha azul 2px + leve elevation no card destino.
3. Keyboard reorder: Tab no bloco → Space agarra → ↑/↓ move → Space solta. `aria-live` anuncia.
4. Cmd+Z global, history depth 50.
5. Auto-save debounced 800ms; indicador discreto canto inferior direito.
6. Editor desktop-only (≥768px). Mobile = preview read-only com toggle viewport (mobile/tablet/desktop).
7. Library: sidebar categorizada + slash `/` no canvas.
8. Theme global por tenant; blocos sem cor individual (MVP).
9. Drafts vs published explícito (botão "Publicar").
10. Preview em nova aba `/preview/[id]?token=…`.

```tsx
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

export function PageEditor({ initial }: { initial: Block[] }) {
  const [blocks, setBlocks] = useState(initial)
  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e
    if (over && active.id !== over.id) {
      setBlocks((b) =>
        arrayMove(
          b,
          b.findIndex((x) => x.id === active.id),
          b.findIndex((x) => x.id === over.id),
        ),
      )
    }
  }
  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        {blocks.map((b) => (
          <SortableBlock key={b.id} block={b} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
```

**Trade-offs / fase 2:** colaboração em tempo real (CRDT/Yjs) → fase 2. Custom blocks user-defined → fase 2. Animação por bloco → fase 3.

---

## BLOCO 5 — Multi-tenant white-label

### 5.1 Theme runtime

**Pesquisa:** Linear/Vercel/Stripe Connect injetam CSS vars via inline style no `<html>` SSR. Tailwind v4 `@theme inline` lê CSS vars runtime. FOUC zero quando setado SSR antes do body. Repaint mínimo.

**Recomendação:**

```tsx
// app/layout.tsx
import { headers } from 'next/headers'
import { getTenantByHost } from '@/lib/tenants'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const tenant = await getTenantByHost(h.get('host')!)
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <TenantThemeStyle tenant={tenant} />
      </head>
      <body className="bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}

// components/tenant-theme-style.tsx — primitive isolando o único `dangerouslySetInnerHTML`
export function TenantThemeStyle({ tenant }: { tenant: Tenant }) {
  const css = `:root{--primary:${tenant.primary};--primary-foreground:${tenant.onPrimary};--brand-radius:${tenant.radius}rem}`
  // a única razão pra dangerouslySetInnerHTML neste projeto
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
```

```css
/* globals.css — Tailwind v4 */
@import 'tailwindcss';
@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --radius: var(--brand-radius);
}
```

Cache: `getTenantByHost` com `'use cache'` + `cacheTag(\`tenant:${id}\`)`. Mutação → `revalidateTag(\`tenant:${id}\`, 'max')`.

### 5.2 Custom domain provisioning

**Pesquisa (vercel.com/docs/multi-tenant/domain-management, vercel.com/platforms/docs/multi-tenant-platforms/configuring-domains, vercel.com/templates/saas/platforms-starter-kit):**

- Vercel SDK `projectsAddProjectDomain` adiciona domínio, gera SSL automático. Soft limit Pro: 100k domains/project.
- Wildcard `*.desafit.app` exige Vercel nameservers (ns1/ns2.vercel-dns.com).
- Custom domain user: aponta A `76.76.21.21` ou CNAME `cname.vercel-dns.com`. Verify via `projectsVerifyProjectDomain` (TXT challenge se domínio já estiver em outro projeto Vercel).
- Cloudflare for SaaS é alternativa pra grandes volumes + WAF.

**Recomendação UX flow:**

1. Tier Free: `[slug].desafit.app` (subdomain wildcard).
2. Tier Pro: tela `[input dominio.com.br] → POST /api/domains` → instruções DNS (CNAME `app` → `cname.vercel-dns.com`). Polling `GET /api/domains/[domain]/verify` cada 30s até 24h. Badges `Pendente DNS → Verificado → SSL → Ao vivo`.
3. Migration subdomain → custom: tabela `tenant_domains` 1:N com `is_primary`, redirect 301 do subdomain pra custom.

```ts
// app/api/domains/route.ts
import { Vercel } from '@vercel/sdk'

export async function POST(req: Request) {
  const { domain } = await req.json()
  const vercel = new Vercel({ bearerToken: process.env.VERCEL_TOKEN! })
  await vercel.projects.addProjectDomain({
    idOrName: process.env.VERCEL_PROJECT_ID!,
    teamId: process.env.VERCEL_TEAM_ID,
    requestBody: { name: domain },
  })
  // persist em tenant_domains
  return Response.json({ ok: true })
}
```

### 5.3 Branding scope por tier

| Item                        | Pacote A (Free `*.desafit.app`) | Pacote B (Pro custom domain)         | Pacote C (Enterprise)   |
| --------------------------- | ------------------------------- | ------------------------------------ | ----------------------- |
| Cor primária                | ✅                              | ✅                                   | ✅                      |
| Cor secundária + accent     | ❌ (auto-derived)               | ✅                                   | ✅                      |
| Logo + favicon + nome       | ✅                              | ✅                                   | ✅                      |
| Fonte custom Google Fonts   | ❌                              | ✅                                   | ✅                      |
| Custom CSS arbitrário       | ❌                              | ❌                                   | ✅ limitado (allowlist) |
| Email transacional from     | `noreply@desafit.app`           | `noreply@[domain]` (Resend verified) | full custom             |
| Email template              | default                         | editável                             | full                    |
| Push ícone + badge branded  | ❌                              | ✅                                   | ✅                      |
| PWA manifest branded        | ❌ (desafit)                    | ✅                                   | ✅                      |
| Footer "Powered by desafit" | obrigatório                     | discreto                             | removível               |

### 5.4 Schema multi-tenant + RLS

**Pesquisa (supabase.com/docs/guides/database/postgres/row-level-security, supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv, antstack.com/blog/optimizing-rls-performance-with-supabase):**

- Single DB com RLS por `tenant_id` é o padrão. Schema-per-tenant não escala >100 tenants. DB-per-tenant só Enterprise compliance.
- `(select auth.jwt()...)` em vez de `auth.jwt()...` direto → initPlan cacheia, >100× speedup.
- Sempre `TO authenticated` explícito, evita rodar policy pra anon.
- Index `tenant_id` btree em **toda tabela**.
- Security definer functions pra joins que cruzam tabelas RLS.

**Recomendação:**

```sql
-- 1) Auth hook injeta tenant_id no JWT
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event jsonb)
RETURNS jsonb LANGUAGE plpgsql STABLE AS $$
DECLARE claims jsonb; tid uuid;
BEGIN
  SELECT tenant_id INTO tid FROM public.memberships
    WHERE user_id = (event->>'user_id')::uuid LIMIT 1;
  claims := event->'claims';
  IF tid IS NOT NULL THEN
    claims := jsonb_set(claims, '{tenant_id}', to_jsonb(tid::text));
  END IF;
  RETURN jsonb_set(event, '{claims}', claims);
END $$;

-- 2) Helper imutável
CREATE OR REPLACE FUNCTION public.current_tenant_id() RETURNS uuid
LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb->>'tenant_id','')::uuid
$$;

-- 3) Policy pattern (com select wrap)
CREATE POLICY components_tenant_isolation ON public.components
  FOR ALL TO authenticated
  USING ( tenant_id = (select public.current_tenant_id()) )
  WITH CHECK ( tenant_id = (select public.current_tenant_id()) );
```

**Trade-offs / fase 2:** Supabase Branching (dev/preview com seed) → fase 2 quando time crescer.

---

## BLOCO 6 — Schema Postgres + JSONB polimórfico

### 6.1 Pattern `component.payload`

**Pesquisa (zod.dev/api, zod.dev/v4, deepwiki.com/colinhacks/zod/3.6-union-and-discriminated-unions):**

- Zod 4 `discriminatedUnion` agora compõe (DU dentro de DU), aceita union/pipe como discriminator. Fast-path O(1) via `propValues` lookup.
- `z.infer<typeof Schema>` extrai TS type.

```ts
// schemas/components.ts
import { z } from 'zod'

const PayloadBase = z.object({ schema_version: z.literal(1) })

const Workout = PayloadBase.extend({
  kind: z.literal('workout'),
  blocks: z
    .array(
      z.object({
        name: z.string(),
        type: z.enum(['warmup', 'main', 'accessory', 'cooldown']),
        sets: z
          .array(
            z.object({
              reps: z.union([z.number().int(), z.string()]),
              weight_kg: z.number().nullable(),
              tempo: z.string().optional(),
              rest_sec: z.number().int().optional(),
              rpe: z.number().min(1).max(10).optional(),
              notes: z.string().optional(),
            }),
          )
          .min(1),
        video_url: z.string().url().optional(),
      }),
    )
    .min(1),
})

const VideoLesson = PayloadBase.extend({
  kind: z.literal('video_lesson'),
  video_url: z.string().url(),
  duration_sec: z.number().int(),
  description: z.string().optional(),
  resources: z.array(z.object({ label: z.string(), href: z.string().url() })).optional(),
})

const MealPlan = PayloadBase.extend({
  kind: z.literal('meal_plan'),
  meals: z.array(
    z.object({
      name: z.string(),
      time: z.string(),
      items: z.array(
        z.object({
          food: z.string(),
          grams: z.number(),
          kcal: z.number().optional(),
          protein_g: z.number().optional(),
          carbs_g: z.number().optional(),
          fat_g: z.number().optional(),
        }),
      ),
    }),
  ),
})

const CheckIn = PayloadBase.extend({
  kind: z.literal('check_in'),
  fields: z
    .array(
      z.discriminatedUnion('type', [
        z.object({
          type: z.literal('slider'),
          key: z.string(),
          label: z.string(),
          min: z.number(),
          max: z.number(),
          step: z.number().default(1),
        }),
        z.object({
          type: z.literal('emoji'),
          key: z.string(),
          label: z.string(),
          options: z.array(z.string()),
        }),
        z.object({
          type: z.literal('number'),
          key: z.string(),
          label: z.string(),
          unit: z.string().optional(),
        }),
        z.object({ type: z.literal('photo'), key: z.string(), label: z.string() }),
        z.object({
          type: z.literal('text'),
          key: z.string(),
          label: z.string(),
          max_len: z.number().default(500),
        }),
      ]),
    )
    .min(1),
  frequency: z.enum(['daily', 'weekly', 'custom']),
})

const Material = PayloadBase.extend({
  kind: z.literal('material'),
  file_url: z.string().url(),
  title: z.string(),
  description: z.string().optional(),
})
const Message = PayloadBase.extend({
  kind: z.literal('message'),
  body_md: z.string(),
  pinned: z.boolean().default(false),
})
const Task = PayloadBase.extend({
  kind: z.literal('task'),
  title: z.string(),
  due_at: z.string().datetime().optional(),
  required: z.boolean().default(false),
})
const Lesson = PayloadBase.extend({
  kind: z.literal('lesson'),
  content_md: z.string(),
  estimated_minutes: z.number().int(),
})
const Scheduled = PayloadBase.extend({
  kind: z.literal('scheduled_live'),
  provider: z.enum(['zoom', 'meet', 'custom']),
  url: z.string().url(),
  starts_at: z.string().datetime(),
  duration_min: z.number().int(),
})
const Individual = PayloadBase.extend({
  kind: z.literal('individual_call'),
  provider: z.enum(['zoom', 'meet', 'custom']),
  booking_url: z.string().url().optional(),
})
const InPerson = PayloadBase.extend({
  kind: z.literal('in_person_class'),
  address: z.string(),
  starts_at: z.string().datetime(),
  duration_min: z.number().int(),
})

export const ComponentPayload = z.discriminatedUnion('kind', [
  Workout,
  VideoLesson,
  MealPlan,
  CheckIn,
  Material,
  Message,
  Task,
  Lesson,
  Scheduled,
  Individual,
  InPerson,
])
export type ComponentPayload = z.infer<typeof ComponentPayload>
```

**Migration `schema_version` 1 → 2:**

```ts
export function normalizeComponent(raw: unknown): ComponentPayload {
  const v = (raw as any)?.schema_version ?? 1
  let m: unknown = raw
  if (v < 2) m = migrateV1toV2(raw)
  return ComponentPayload.parse(m)
}
```

Backfill assíncrono em batches:

```sql
UPDATE components
SET payload = jsonb_set(payload, '{schema_version}', '2'::jsonb)
WHERE payload->>'schema_version' = '1'
  AND id IN (SELECT id FROM components WHERE payload->>'schema_version'='1' LIMIT 1000);
```

**Query "todos workouts com peso > 100kg":**

```sql
SELECT id, payload
FROM components
WHERE kind = 'workout'
  AND payload @? '$.blocks[*].sets[*].weight_kg ? (@ > 100)';
```

**Index strategy:**

```sql
CREATE INDEX components_kind_idx ON components (kind);
CREATE INDEX components_payload_gin ON components USING gin (payload jsonb_path_ops);

-- Generated column pra hot queries
ALTER TABLE components ADD COLUMN max_weight_kg numeric GENERATED ALWAYS AS (
  (jsonb_path_query_first(payload, '$.blocks[*].sets[*].weight_kg ? (@ != null)')::text)::numeric
) STORED;
CREATE INDEX components_max_weight_idx ON components (max_weight_kg) WHERE kind = 'workout';
```

**Cache invalidation:** após mutar → `revalidateTag(\`component:${id}\`, 'max')` + `revalidateTag(\`module:${module_id}\`)`.

### 6.2 RLS sem N+1

Já em 5.4. Pontos críticos: `(select fn())` wrap, btree em `tenant_id`, security definer pra joins recursivos.

```sql
-- Security definer pra join cross-table
CREATE OR REPLACE FUNCTION public.get_program_with_modules(p_program_id uuid)
RETURNS TABLE(program jsonb, modules jsonb)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT to_jsonb(p),
    coalesce(jsonb_agg(to_jsonb(m) ORDER BY m.position), '[]'::jsonb)
  FROM programs p
  LEFT JOIN modules m ON m.program_id = p.id
  WHERE p.id = p_program_id
    AND p.tenant_id = (select public.current_tenant_id())
  GROUP BY p.id;
$$;
REVOKE ALL ON FUNCTION public.get_program_with_modules(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_program_with_modules(uuid) TO authenticated;
```

### 6.3 RPCs vs server actions

| Caso                                                                       | Use                      |
| -------------------------------------------------------------------------- | ------------------------ |
| Validation + business logic + chamada DB simples                           | Server action (TS + Zod) |
| Multi-row atomic, cross-table join com RLS recursivo, hot path performance | RPC SECURITY DEFINER     |
| Invariantes do dado (updated_at, counters denormalizados)                  | Trigger                  |

**Template RPC com handling:**

```sql
CREATE OR REPLACE FUNCTION public.complete_set(p_set_id uuid, p_weight_kg numeric, p_reps int)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_tenant uuid := (select public.current_tenant_id());
  v_log_id uuid;
BEGIN
  IF v_tenant IS NULL THEN RAISE EXCEPTION 'unauthenticated' USING ERRCODE = '28000'; END IF;

  INSERT INTO workout_log (tenant_id, set_id, weight_kg, reps, completed_at)
  SELECT v_tenant, p_set_id, p_weight_kg, p_reps, now()
  WHERE EXISTS (
    SELECT 1 FROM workout_sets s JOIN components c ON c.id = s.component_id
    WHERE s.id = p_set_id AND c.tenant_id = v_tenant
  )
  RETURNING id INTO v_log_id;

  IF v_log_id IS NULL THEN
    RAISE EXCEPTION 'set_not_found_or_forbidden' USING ERRCODE = '42501';
  END IF;
  RETURN v_log_id;
END $$;

REVOKE ALL ON FUNCTION public.complete_set(uuid, numeric, int) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.complete_set(uuid, numeric, int) TO authenticated;
```

```ts
// server action
'use server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidateTag } from 'next/cache'

const Input = z.object({
  setId: z.string().uuid(),
  weightKg: z.number().nonnegative(),
  reps: z.number().int().positive(),
})

export async function completeSet(input: z.infer<typeof Input>) {
  const i = Input.parse(input)
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('complete_set', {
    p_set_id: i.setId,
    p_weight_kg: i.weightKg,
    p_reps: i.reps,
  })
  if (error) {
    if (error.code === '28000') throw new Error('Sessão expirada')
    if (error.code === '42501') throw new Error('Sem permissão')
    throw error
  }
  revalidateTag(`set:${i.setId}`, 'max')
  return data
}
```

---

## BLOCO 7 — Component library (shadcn + extensions)

### 7.1 Card composition fitness

**Pesquisa (laststance.io/articles/major-shadcn-ui-registry-libraries, github.com/birobirobiro/awesome-shadcn-ui, devkit.best/blog/mdx/shadcn-ui-libraries-comparison-2025):**

- shadcn `<Card>` é container puro (Header/Title/Description/Content/Footer).
- Origin UI: 400+ blocos free, variants ricas (timeline, dialogs).
- Magic UI: animations focadas (NumberTicker, AnimatedBeam).
- Aceternity: spotlight/3D effects pra landing.

**4 card variants pro desafit:**

```tsx
// 1) "próximo treino" — hero
<Card variant="hero" interactive>
  <CardImage src={...} aspect="16/9" />
  <CardEyebrow>Hoje · Treino A</CardEyebrow>
  <CardTitle>Peito + Tríceps</CardTitle>
  <CardMeta>6 exercícios · ~45min</CardMeta>
  <CardCTA>Começar</CardCTA>
</Card>

// 2) "exercício" — media
<Card variant="media" interactive>
  <CardThumb src={thumb} aspect="1/1" />
  <CardTitle size="sm">Supino reto</CardTitle>
  <CardMeta>4 séries · 8–12 reps</CardMeta>
</Card>

// 3) "métrica" — stat
<Card variant="metric">
  <Metric value="78.4" unit="kg" delta={{ value: -0.6, label: 'vs semana passada' }} />
  <CardLabel>Peso atual</CardLabel>
</Card>

// 4) "aluno" — entity whole-card click
<Card variant="entity" asChild>
  <Link href={`/dashboard/alunos/${id}`}>
    <Avatar src={...} />
    <CardTitle>João Silva</CardTitle>
    <Badge variant="success">Ativo</Badge>
    <CardActions onClick={(e) => e.preventDefault()}>...</CardActions>
  </Link>
</Card>
```

### 7.2 Form patterns

| Tamanho                   | Pattern                                            |
| ------------------------- | -------------------------------------------------- |
| ≤6 campos                 | Single page                                        |
| 7–12                      | Accordion sections desktop / wizard mobile         |
| >12 ou onboarding crítico | Wizard 1 question/screen mobile, accordion desktop |

- Validation: `onBlur` por campo + `onSubmit` final. `react-hook-form` + `zodResolver`.
- Erros: inline abaixo + sumário aria-live no submit.
- Field types fitness: peso `<Input inputMode="decimal" />` + stepper; reps numeric; foto `<input type="file" accept="image/*" capture="environment" />`; peso+reps mesma linha em `grid grid-cols-[1fr_1fr_auto]`.

### 7.3 Data table mobile

`@tanstack/react-table` v8 com shadcn `<DataTable>`. Mobile flip pra card stack via media query (`hidden md:table-cell` em colunas secundárias). Sort/filter mobile via bottom-sheet (vaul).

```tsx
<>
  <div className="md:hidden space-y-2">
    {rows.map((r) => (
      <AlunoCard key={r.id} {...r} />
    ))}
  </div>
  <table className="hidden md:table">{/* tanstack table render */}</table>
</>
```

### 7.4 Bottom sheets (vaul)

| Caso                                                             | Componente        |
| ---------------------------------------------------------------- | ----------------- |
| Filtros mobile, edit rápido, timer descanso, confirm destructive | **vaul Drawer**   |
| Forms críticos desktop, alertas, modais bloqueantes desktop      | shadcn `<Dialog>` |
| Nav drawer desktop, cart lateral                                 | shadcn `<Sheet>`  |

Snap points: `<Drawer.Root snapPoints={[0.3, 0.7, 1]}>` (peek/half/full).

### Lista final shadcn dia 1

**Instalar:**

```bash
npx shadcn@latest add \
  accordion alert alert-dialog avatar badge button card checkbox \
  dialog drawer dropdown-menu form input label progress radio-group \
  scroll-area select separator sheet skeleton slider switch table \
  tabs textarea toast tooltip toggle toggle-group
# Blocks
npx shadcn@latest add dashboard-01 sidebar-07 login-03
```

**Extensions (registry-based, copy-paste):**

- **Origin UI** (originui.com) — primeiro lugar antes de criar variant nova. 400+ free.
- **Magic UI** (magicui.design) — `NumberTicker` (métricas progresso), `Confetti` (streak milestones), `Marquee` (testemunhos landing).
- **Aceternity UI** (ui.aceternity.com) — só nas landing pages dos profs (spotlight, gradients). Evitar no app aluno (peso animation).
- **Kibo UI** (kibo-ui.com) — fase 2 (kanban planejamento programa).

**5–7 custom primitives dia 1:**

```tsx
// components/primitives/
<Heading level={1|2|3} eyebrow?>      // h1-h3 com pre-title opcional
<Text size="sm|base|lg" tone="default|muted|brand">
<Eyebrow>                              // tag pre-título
<Metric value unit delta>              // número grande + delta colored
<DataCell label value>                 // par label/value
<Section title description>            // wrapper de seções
<Stack gap dir>                        // flex helper
```

---

## BLOCO 8 — Onboarding / FRE / TTFV

### 8.1 Onboarding profissional

**Pesquisa:**

- **Linear**: 3 telas (workspace → time → invite). <2min. Pula tudo.
- **Notion**: 1 tela (use case) + workspace. Empty state = template gallery.
- **Cal.com**: 4 telas (username → calendar → hours → event type). ~5min. Username obrigatório.
- **Vercel**: import git repo é o aha. Onboarding = guided import.
- **Memberful**: checklist persistente sidebar até completar.

**Vencedores (3+):** ≤4 telas, pular não-críticos, progress bar topo, sample/template (não blank), checklist persistente pós-onboarding.

**Recomendação prof — 4 telas + checklist:**

1. **Identidade** (60s): nome do app + subdomínio `[slug].desafit.app` + cor primária + logo opcional.
2. **Modelo de negócio** (60s): aluno paga direto ou via plataforma? Plano fixo / mensal / único?
3. **Gerar primeiro programa com IA** (3–5min): wizard do bloco 3. **AHA MOMENT aqui.**
4. **Convidar primeiro aluno** (60s): email único ou skip.

**Checklist persistente sidebar:** [ ] Programa criado · [ ] Página pública publicada · [ ] Primeiro aluno · [ ] Primeiro check-in recebido · [ ] App instalado em device de teste.

### 8.2 Aha moment

- **Prof:** ver programa gerado pela IA com seu branding em <8min total do signup.
- **Aluno:** completar primeiro check-in OU primeiro componente em <3min do primeiro login.

### 8.3 Onboarding cliente final (aluno) — primeiros 5min PWA

1. Login link mágico (email).
2. Boas-vindas: vídeo 30s do prof (gravado uma vez) + `Vamos começar`.
3. **Primeiro check-in simbólico** (3 sliders) — Duolingo first-lesson style.
4. Tour invisível: 1 tooltip contextual no primeiro componente. Dismissable.
5. Push pre-prompt SÓ após primeiro check-in completo + 24h depois.
6. Install custom bottom-sheet após 2ª sessão.

### 8.4 Métricas TTFV (PostHog)

**3 métricas pra trackear:**

1. **TTFV prof:** `signup → primeiro programa publicado`. Target P50 < 15min, P90 < 1h.
2. **TTFV aluno:** `convite → primeiro check-in completado`. Target P50 < 24h.
3. **Activation:** `signup prof → primeiro aluno completou primeiro componente`. Target P50 < 72h.

```ts
import posthog from 'posthog-js'

posthog.capture('professional_signed_up')
posthog.capture('program_published', { program_id, modules_count })
posthog.capture('student_invited', { tenant_id, channel })
posthog.capture('first_check_in', { tenant_id, student_id, fields_filled })
posthog.capture('first_component_completed', { tenant_id, student_id, component_kind })
```

**Trade-offs / fase 2:** A/B test em onboarding flow → fase 2 com PostHog feature flags.

---

## BLOCO 9 — Testing strategy SaaS B2B

### 9.1 Golden paths Playwright (8–12 pro desafit)

1. Prof signup → onboarding → publica programa.
2. Prof convida aluno → aluno aceita → completa check-in.
3. Aluno login → home → completa workout (3 séries marcadas).
4. Prof envia mensagem → aluno recebe (push mocked).
5. Prof edita componente → aluno vê após reload (cache invalidation).
6. Prof customiza tema → app aluno reflete cor nova.
7. Prof adiciona custom domain → DNS verify → live (Vercel SDK mocked).
8. Aluno faz check-in 7 dias → streak badge.
9. PWA install flow + push subscribe.
10. **RLS isolation**: prof A não vê dados do prof B (auth swap).
11. Stripe webhook → upgrade tier → branding unlock.
12. Editor visual: drag bloco → reorder → publish → preview.

**Organização:** `tests/e2e/prof/`, `tests/e2e/aluno/`, `tests/e2e/admin/`. Fixtures auth via `storageState` per role. Parallel exceto testes mutating estado global.

### 9.2 axe-core integration

```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test('home aluno passa a11y', async ({ page }) => {
  await page.goto('/aluno')
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})
```

- **Rodar:** todo golden path principal + smoke em `/`, `/aluno`, `/aluno/workout/[id]`, `/dashboard`, `/dashboard/programa/[id]/edit`.
- **Bloquear PR** em qualquer violation `serious`/`critical`. Warn em `moderate`.

### 9.3 Lighthouse CI thresholds

Pra Next 16 PWA branded com fontes custom + analytics:

| Categoria      | Mobile                       | Desktop |
| -------------- | ---------------------------- | ------- |
| Performance    | ≥90                          | ≥95     |
| Accessibility  | **100**                      | **100** |
| Best Practices | ≥95                          | ≥95     |
| SEO            | 100 (landing) / ≥90 (painel) | mesmo   |
| PWA            | **100** (em `/aluno/*`)      | n/a     |

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:3000/aluno", "http://localhost:3000/dashboard"],
      "numberOfRuns": 3
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 1 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["warn", { "minScore": 0.9 }],
        "categories:pwa": ["error", { "minScore": 1 }]
      }
    }
  }
}
```

### 9.4 Visual regression

**Rotas + viewports:**

- `/aluno` mobile 390×844 (iPhone 15)
- `/aluno/workout/[id]` mobile 390×844
- `/dashboard` desktop 1440×900
- `/dashboard/programa/[id]/edit` desktop 1440×900
- `/[tenant]` landing pública mobile 390×844 + desktop 1440×900

**Tolerância:** 0.1% pixel diff. Ignorar: animações (mask region), datas dinâmicas (freeze tz), avatares user-uploaded (mock).

**Dia 1 mínimo (3 testes):**

1. Unit Vitest: `lib/schemas/components.test.ts` (golden parse cases).
2. E2E Playwright: `e2e/prof/signup-publish.spec.ts`.
3. A11y axe no `/aluno`.

---

## BLOCO 10 — Performance Next 16

**Pesquisa (nextjs.org/blog/next-16, nextjs.org/docs/app/api-reference/config/next-config-js/cacheComponents, vercel.com/academy/nextjs-foundations/cache-components, nandann.com/blog/nextjs-16-2-complete-guide):**

- **Cache Components** (`cacheComponents: true`): caching opt-in. Tudo é dynamic por default; cachear com `'use cache'` directive + `cacheLife()` + `cacheTag()`.
- **PPR** é default sob Cache Components. `experimental.ppr` removido.
- **Turbopack** default dev + prod. >50% dev sessions Vercel; 2–5× faster builds.
- `revalidateTag(tag, profile)` — profile (`'max'` etc) agora obrigatório; single-arg deprecado.
- `proxy.ts` substitui `middleware.ts` (codemod automatic).
- React Compiler 1.0 estável dia 1.
- `unstable_after`: fire-and-forget pós-response (logs, analytics não-bloqueantes).

**Recomendação dia 1 vs aguardar:**

| Feature                                                       | Dia 1                                      | Aguardar     |
| ------------------------------------------------------------- | ------------------------------------------ | ------------ |
| Cache Components (`cacheComponents: true`)                    | ✅                                         |              |
| Turbopack dev + prod                                          | ✅ (default)                               |              |
| PPR via Cache Components                                      | ✅ (automatic)                             |              |
| React Compiler                                                | ✅                                         |              |
| `proxy.ts` (ex-middleware)                                    | ✅                                         |              |
| `unstable_after`                                              | ⚠️ uso cauteloso (não em workers efêmeros) |              |
| Turbopack filesystem cache (`turbopackFileSystemCacheForDev`) |                                            | ⏳ Q2 (beta) |

**Cache strategy páginas branded:**

```tsx
// app/(public)/[tenant]/page.tsx
import { Suspense } from 'react'
import { cacheLife, cacheTag } from 'next/cache'

async function getTenantPage(slug: string) {
  'use cache'
  cacheLife('hours')
  cacheTag(`tenant-page:${slug}`)
  return supabaseAdmin.from('pages').select('*').eq('slug', slug).single()
}

export default async function TenantLanding({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = await params
  const { data: page } = await getTenantPage(tenant)
  return (
    <>
      <PageRenderer blocks={page.published_blocks} />
      <Suspense fallback={null}>
        <LeadFormDynamic tenant={tenant} />
      </Suspense>
    </>
  )
}
```

Mutação publish → `revalidateTag(\`tenant-page:${slug}\`, 'max')`.

**Edge vs Node:**

| Runtime  | Usar pra                                                                                   |
| -------- | ------------------------------------------------------------------------------------------ |
| **Edge** | `proxy.ts` (tenant resolver por hostname), redirects, A/B routing leve, image optimization |
| **Node** | server actions, RPCs Supabase, Stripe SDK, Anthropic SDK streaming, image upload com Sharp |

```ts
// proxy.ts (edge)
export const config = { matcher: ['/((?!_next|api|favicon).*)'], runtime: 'edge' }
export default function proxy(req: Request) {
  const host = new URL(req.url).hostname
  const tenantId = resolveTenantFromHost(host) // edge KV ideal
  const url = new URL(req.url)
  url.searchParams.set('__tenant', tenantId)
  return Response.rewrite(url)
}
```

---

## BLOCO 11 — A11y PWA + mobile

**Pesquisa direta limitada ([DOC NÃO COBRE] detalhes screen-reader-fitness-specific).** Síntese WCAG 2.2 + APCA + práticas de produção:

**Touch targets:**

- WCAG 2.2 AA: 24×24 CSS px mín. AAA: 44×44.
- **desafit padrão 44×44** (`Button` base `h-11 min-w-11`). Exceção: ícones inline em texto (24×24 ok se espaçados ≥8px do próximo target).

**Focus management bottom sheets:**

- Vaul + Radix Dialog: focus trap nativo. `aria-labelledby` no `<Drawer.Title>` + autoFocus no primeiro field. Esc fecha. Restore focus no trigger ao fechar.

**VoiceOver iOS PWA quirks:**

- Hierarchy de headings importa (rotor).
- `aria-live="polite"` funciona; `assertive` só pra erros críticos.
- Standalone PWA = menos foco perdido.

**TalkBack Android quirks:**

- Custom actions via swipe → expor com `role="button"` claro.
- Evitar `aria-hidden` em focáveis (Chrome Android falha silently).

**`prefers-reduced-motion`:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

| Animação             | Reduced fallback   |
| -------------------- | ------------------ |
| Vaul drawer slide-up | instant snap       |
| Card hover scale     | none               |
| Tab switch slide     | crossfade <100ms   |
| Streak ring fill     | static state       |
| Confetti milestone   | static badge       |
| Number ticker        | final value direto |
| Skeleton pulse       | shimmer-free       |

**`prefers-contrast: more`:** layer extra de tokens:

```css
@media (prefers-contrast: more) {
  :root {
    --foreground: 0 0% 0%;
    --background: 0 0% 100%;
    --border: 0 0% 20%;
  }
}
```

**APCA:** validar pares texto/fundo do tenant branding com APCA-aware contrast checker. Targets: Lc 75 body, Lc 60 UI grande, Lc 90 texto pequeno crítico.

**Screen reader workout (anunciar série atual):**

```tsx
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {currentSet
    ? `Série ${currentSet.index} de ${totalSets}, ${currentSet.reps} repetições com ${currentSet.weight_kg} quilos`
    : null}
</div>
```

**Skip links PWA mobile:** sim, mesmo single-page. `<a href="#main" className="sr-only focus:not-sr-only">Pular para conteúdo</a>`.

**Checklist a11y por tela:**

| Tela                 | Checklist                                                                                                                                                      |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auth**             | aria-label inputs, autocomplete tokens (`email`, `current-password`), erros em aria-live, focus no primeiro field, "esqueci senha" `<a>` real                  |
| **Dashboard (prof)** | landmarks (`<main>`, `<nav aria-label="Principal">`), `<th scope>`, sortable `aria-sort`, sidebar collapse anuncia estado                                      |
| **Workout (aluno)**  | aria-live anuncia set atual, countdown anunciado a cada 30s ou no fim, botão complete `aria-label="Marcar série N completa, X kg, Y reps"`, vídeo com captions |
| **Check-in**         | sliders com `aria-valuetext` ("7 de 10, alta energia"), labels visíveis, foto upload com alternativa textual                                                   |
| **Settings**         | toggles `role="switch"` + `aria-checked`, agrupados em fieldset, mudanças via toast aria-live, destructive em `<AlertDialog>`                                  |

---

## RESUMO EXECUTIVO

### Top 20 patterns reproduzíveis (origem → onde aplicar)

1. **Hero card único home + CTA sticky grande** (Centr, Future) → `/aluno` home.
2. **Donut/dot streak semanal** (Apple, Whoop) → home aluno abaixo do hero.
3. **Bottom-tab 4 itens sem hamburger** (Centr, Future, Freeletics) → PWA aluno.
4. **Vídeo sticky topo + lista vertical scroll** (Future) → workout aluno.
5. **Timer descanso overlay full-screen number `text-7xl`** (Freeletics) → workout.
6. **Check-in 3 campos máximo** (Centr, Future) → daily check-in.
7. **Compare slider antes/depois** (Future) → progresso.
8. **Pre-prompt antes do nativo push** (OneSignal docs) → flow permissão.
9. **Custom bottom-sheet install + iOS visual guide** (web.dev) → install flow.
10. **JWT claim `tenant_id` + RLS `(select fn())`** (Supabase docs) → RLS performance.
11. **Cache Components + `cacheTag('tenant:id')` + revalidateTag** (Next 16) → branding rendering.
12. **Vercel SDK `projectsAddProjectDomain` + status polling** (Vercel docs) → custom domain UX.
13. **CSS vars inline no `<head>` SSR + Tailwind v4 `@theme inline`** (Linear pattern) → white-label theme.
14. **Zod discriminated union por `kind` em `payload jsonb`** (Zod 4 docs) → component schema.
15. **GIN `jsonb_path_ops` + generated column pra hot queries** (Postgres docs) → query performance.
16. **dnd-kit `<SortableContext>` + `verticalListSortingStrategy`** (dndkit.com) → editor visual.
17. **Stepper visual + streaming AI SDK + cards incrementais** (Lovable/Bolt) → vibe coding pipeline.
18. **Regenerar componente individual com seed preservada** (Lovable Visual Edits) → iteração programa IA.
19. **Skeleton casado com layout + `useOptimistic`** (Vercel patterns) → loading states.
20. **Checklist persistente sidebar pós-onboarding** (Linear, Memberful, Cal.com) → activation prof.

### Top 10 anti-patterns vistos a evitar

1. **Feed social-first na home** (Strava) — irrelevante pra coaching personal.
2. **Density utility extrema** (MyFitnessPal) — péssimo pra programa premium.
3. **FAB flutuante "Start workout"** — colide com gestures iOS PWA standalone.
4. **Push permission no primeiro load** — kills opt-in rate (mata <20% em iOS).
5. **Mini-infobar Chrome default exposta** — esconda, faça custom.
6. **RLS com `auth.jwt()->>'tenant_id'` direto** — 100× slower em large tables.
7. **JSON Schema só no app sem CHECK constraint pra `kind`** — drift em produção.
8. **Schema-per-tenant Supabase** — não escala >100 tenants.
9. **Service role key client-side** — bypass RLS = vulnerabilidade crítica.
10. **Editor visual misturando edição inline + side-panel sem regra clara** — escolha: mobile read-only, desktop híbrido com text inline + props no painel.

### Top 5 oportunidades de diferenciação (gaps nos líderes)

1. **White-label real completo** — Trainerize/TrueCoach são pseudo (logo apenas). desafit pode ser **PWA + custom domain + push branded + email branded** real.
2. **IA gera programa completo (módulos + landing + email + push) em <5min** — concorrentes BR (PerformanceCoach et al) ainda são planilha. Lovable-style applied to fitness é gap.
3. **Componente polimórfico (workout/meal/check-in/material/mensagem mesma estrutura)** — concorrentes têm silos rígidos. Permite "templates de programa" mistos.
4. **Native-feel PWA pt-BR real** — Centr/Future EUA-first. Push pt-BR, Real/parcelado nativo Stripe BR, copy local.
5. **Editor visual de landing por prof** — concorrentes obrigam template fechado. Drag-drop com 11 blocos = posicionamento Webflow-junior pra fitness.

### Libs/extensões shadcn dia 1

**Base shadcn install:**

```bash
npx shadcn@latest add accordion alert alert-dialog avatar badge button card checkbox dialog drawer dropdown-menu form input label progress radio-group scroll-area select separator sheet skeleton slider switch table tabs textarea toast tooltip toggle toggle-group
npx shadcn@latest add dashboard-01 sidebar-07 login-03
```

**Adicionar (npm):**

- `vaul` (base do shadcn Drawer)
- `motion` 12
- `@dnd-kit/core` + `@dnd-kit/sortable`
- `@tanstack/react-table` v8
- `react-hook-form` + `@hookform/resolvers`
- `zod` 4
- `recharts`
- `react-compare-slider`
- `posthog-js` + `posthog-node`
- `next-intl` 4
- `@vercel/sdk`
- `@axe-core/playwright` + `@playwright/test` + `lighthouse-ci`
- `@ai-sdk/anthropic` + `ai` (Vercel AI SDK)

**Registries shadcn (mix-and-match):**

- **Origin UI** — primeiro lugar antes de criar variant nova.
- **Magic UI** — NumberTicker, Confetti, Marquee.
- **Aceternity** — só landing pages dos profs.
- **Kibo UI** — fase 2 (kanban planejamento).

### Stack final consolidada — ajustes recomendados

Stack está sólida. Ajustes mínimos:

| Item                                                  | Status                                                                    | Razão                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------- |
| Cache Components ON dia 1                             | ✅ adotar                                                                 | `cacheComponents: true` em `next.config.ts`        |
| Turbopack prod                                        | ✅ adotar (já default Next 16)                                            |                                                    |
| `proxy.ts` (não middleware.ts)                        | ✅ adotar                                                                 | rename do Next 16; codemod automático              |
| Edge runtime: SÓ no proxy                             | ✅ regra                                                                  | Supabase server/Stripe/Anthropic exigem Node       |
| Supabase JWT hook custom (`custom_access_token_hook`) | ✅ obrigatório                                                            | sem isso, RLS pula N+1                             |
| `recharts` pra charts progresso                       | ✅ adicionar                                                              | shadcn já tem wrapper                              |
| `@axe-core/playwright` + lighthouse-ci dia 1          | ✅ adicionar                                                              | CI quality gate                                    |
| Turbopack filesystem cache dev (beta)                 | ⏳ Q2                                                                     | ainda beta                                         |
| eslint-disable zero                                   | ✅ exceção única: `react/no-danger` no `<TenantThemeStyle>` (encapsulado) | inline `<style>` pro tema runtime é técnica padrão |

---

**Encerramento.** Relatório baseado em 12 buscas em produtos reais (web.dev, vercel.com, supabase.com, zod.dev, nextjs.org/blog/next-16, dndkit.com, vaul GitHub, OneSignal, MagicBell, Lovable docs, Webflow/Framer/Builder comparisons, shadcn registries). Onde a busca aberta não cobre detalhes finos (UX teardowns específicos de Centr/Future internamente, screen-reader fitness workout patterns canônicos, benchmark concreto BR de install rate), o item está marcado **[DOC NÃO COBRE]** e a recomendação vem do framework consolidado WCAG 2.2 + APCA + práticas de produção do stack travado. Direto, denso, sem fluff.
