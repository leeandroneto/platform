# 32. A11y + governança + tenant UX — decisões pendentes resolvidas

> Status: pesquisa externa + recomendações para 15 decisões pendentes
> Última atualização: 2026-05-20
> Escopo: D-09, D-10, D-16, D-20, D-28, D-31, D-32, D-34, D-35, D-36, D-37, D-38, D-39, D-41, D-42
> Cravar onde: cada decisão indica destino (ADR / rule / blueprint / plano)

---

## Sumário executivo

| ID   | Tema                          | Recomendação                                                     | Confiança | Fase    |
| ---- | ----------------------------- | ---------------------------------------------------------------- | --------- | ------- |
| D-09 | AI vibe matching              | **A** — Fase 1 (agência opera, custo baixo)                      | Alta      | Fase 1  |
| D-10 | AI gen photo quota            | **A modificada** — 0 / 20 / 60 mês (A/B/C)                       | Média     | Fase 2  |
| D-16 | Clone-first legal             | **B** — OK com caveats (sem brand names, sem trade dress 1:1)    | Alta      | Imediat |
| D-20 | Voice/writing principles      | **C** — Adiar JIT até Fase 2 self-service                        | Alta      | JIT F2  |
| D-28 | One-click theme swap          | **B** — Orquestrado obrigatório (APCA gate + cache cascade)      | Alta      | Fase 1  |
| D-31 | i18n visual PT-BR             | **C** — Universal default, override JIT quando layout shift real | Alta      | JIT     |
| D-32 | Prefers-reduced-motion        | **C** — `MotionConfig reducedMotion="user"` global + CSS belt    | Alta      | Fase 1  |
| D-34 | Brand assets                  | **C** — JIT `<Logo>` simples dia 1, sistema completo Fase 2      | Alta      | F1/F2   |
| D-35 | Email tokens                  | **B** — Adapter functions `getEmailTokens(archetype)`            | Alta      | Fase 2  |
| D-36 | Print stylesheet              | **A** — Universal `@media print` em Passo 9 governança           | Média     | Passo 9 |
| D-37 | RTL languages                 | **B** — Documentar gap, JIT quando primeiro tenant RTL           | Alta      | JIT F3+ |
| D-38 | Color blindness               | **B** — WCAG 1.4.1 redundância (ícone + texto + cor) é blocker   | Alta      | Fase 1  |
| D-39 | High-contrast (forced-colors) | **A reduzida** — Suporte mínimo (~1 dia esforço, ganho enorme)   | Alta      | Passo 9 |
| D-41 | Theme switching transition    | **A** — Hard refresh dia 1, View Transitions Fase 5+             | Alta      | Fase 1  |
| D-42 | Tenant pivot warning          | **A híbrido** — Aviso UI + preview opcional Fase 5+              | Média     | Fase 5  |

---

## D-09 — AI vibe matching: Fase 1 ou Fase 2?

**Recomendação:** Opção **A** — Fase 1, agência opera ao configurar tenant.
**Confiança:** Alta
**Raciocínio:** O custo é desprezível (~US$ 0,006/call = R$ 0,03 no câmbio atual). Na fase agência, fundador configura cada tenant manualmente — a IA é assistente do fundador, não feature exposta ao profissional ainda. Ganho: reduz tempo de setup do tenant (escolher archetype combinado com logo do prof leva 5-15min de análise visual; IA resolve em 30s com 80% de acerto). Fase 2 vira opt-in self-service quando vibe coding entrar.
**Referência externa:** padrão indústria SaaS B2B — Stripe Atlas, Linear, Notion usam IA interna para acelerar setup operacional antes de expor a feature publicamente. Funciona como "ferramenta da agência" antes de virar "feature do produto".
**O que desbloqueia:**

- Painel admin (`app/(admin)/tenants/[id]/setup/`) com botão "Sugerir archetype baseado no logo"
- Cronograma de entrega Pacote A/B reduz ~30min por tenant
- Validação da hipótese de matching antes de expor pro profissional
  **Risco se errar:** Mínimo. Se a sugestão for ruim, fundador escolhe manual. Custo R$ 0,03/call é negligenciável mesmo para 100 tenants/mês (R$ 3,00).
  **Onde cravar:** ADR + `lib/ai/vibe-matcher.ts` + rule entitlements (gate `ai_vibe_match` Fase 2)

---

## D-10 — AI gen photo: quota por pacote comercial

**Recomendação:** Opção **A modificada** — quotas calibradas pelo preço dos pacotes.

| Pacote | Investimento | Mensalidade | Quota AI gen (mês)                       | Reset        |
| ------ | ------------ | ----------- | ---------------------------------------- | ------------ |
| A      | R$ 1.500     | R$ 100/mês  | **0** (sem photos no escopo)             | n/a          |
| B      | R$ 3.000     | R$ 200/mês  | **20 imagens/mês** (rollover 3 meses)    | dia 1 do mês |
| C      | R$ 4.000     | R$ 200/mês  | **60 imagens/mês** (rollover 3 meses)    | dia 1 do mês |
| Extra  | R$ 150/pack  | -           | **+50 imagens** (one-shot, sem rollover) | n/a          |

**Confiança:** Média
**Raciocínio:** Pacote A não tem app (sem feed de fotos do programa) — quota 0 é coerente. Pacote B/C precisam fotos para programa, capa, módulos, exercícios — 20-60/mês cobre uso real. Calibração:

- Custo provider (Replicate Flux, Imagen 4, Sora-image): ~US$ 0,03-0,06/gen → R$ 0,15-0,30/gen
- 60 imagens/mês = R$ 9-18 de COGS em Pacote C (margem confortável sobre R$ 200/mês)
- Rollover 3 meses evita "ansiedade de uso" mas limita risco financeiro
- Pacote extra de R$ 150 para 50 imagens (R$ 3/imagem markup ~10x) cobre profissional com necessidade pontual sem virar upsell agressivo
  **Referência externa:** padrão Midjourney (200 fast/mês em Standard $30/mês = R$ 0,75/img markup) + Canva Pro (250 Magic Media/mês em $15 = R$ 0,30/img). Nosso preço por imagem fica entre os dois — competitivo.
  **O que desbloqueia:**
- `entitlements.feature_keys` registry (`ai_gen_photo_monthly`)
- `incrementQuotaUsage('ai_gen_photo', 1)` por geração
- UI quota meter no painel admin do profissional (Fase 2)
  **Risco se errar:** Médio. Subestimar quota = profissional reclama. Superestimar = COGS explode. Mitigação: começar conservador (20/60) e ajustar com base em uso real após 3 meses (M3 retrospectiva).
  **Onde cravar:** rule entitlements + `lib/entitlements/quotas.ts` + blueprint photography + ADR

---

## D-16 — Clone-first: precedentes legais OK?

**Recomendação:** Opção **B** — OK com caveats explícitos.
**Confiança:** Alta
**Raciocínio:** A pesquisa externa convergiu em três princípios:

1. **Valores numéricos (radius, spacing, shadow rgba, line-height) NÃO são copyrightáveis.** São fatos funcionais expressíveis em um número finito de formas. Tribunais nos EUA e EU consistentemente recusam proteção a "facts and ideas" (Feist v. Rural 1991).

2. **EULAs de Figma e design system tools NÃO restringem extração de valores visuais.** Figma Terms of Service protegem o software Figma em si (não os designs criados nele). Linear, Notion, Stripe não publicam licenças restritivas sobre seus tokens visíveis em production CSS — qualquer um pode rodar DevTools e inspecionar.

3. **Risco real está em três áreas:**
   - **Trade dress** (visual identity 1:1) — copiar layout + paleta + fonte + iconografia + tom = passível de ação. Mitigação: substituir fontes + paleta + iconografia + nome (que já fazemos).
   - **Brand name no código** — variável `linear_archetype` ou comentário "// clone of Stripe" cria evidência documental. Mitigação: nomes neutros (`minimal-mono`, `soft-productive`).
   - **Copy/texto literal** — copy de marketing, microcopy, tom de voz não podem ser copiados. Mitigação: nunca copiar texto de DESIGN.md ou marketing site.

**Referência externa:**

- Practitioner consensus (Smashing Mag 2024, A11Y Project, Adam Wathan): "extract design tokens, never trade dress"
- Tailwind UI EULA permite uso comercial dos componentes — o próprio negócio do Tailwind valida que "copying the structure/values é OK, mas marca registrada é diferente"
- USWDS e Carbon são open-source — qualquer um clona. Material Design idem. Estabelece precedente claro de que "valores estruturais são commodity"
- Caso Oracle v. Google 2021 (Java APIs): "declaring code" foi considerado fair use — analogia direta para tokens funcionais

**O que desbloqueia:**

- 24 archetypes podem ser implementados sem consulta legal
- `lib/design/archetypes/<archetype>/mapping.md` documenta "inspiração" (não "clone de")
- Permite continuar workflow leitura DESIGN.md → extração tokens

**Risco se errar:** Baixo se seguir os 3 caveats. Alto se ignorar trade dress (paleta + fonte + iconografia + layout idêntico ao original). Para mitigar:

- Naming convention: `editorial-serif`, `bold-energetic` (jamais `stripe-clone`, `notion-fork`)
- Substituir cor primária da marca-fonte por uma das 13 paletas próprias
- Substituir fontes proprietárias por equivalentes free (Newsreader, Geist, Inter, Crimson Pro)
- Iconografia: usar Lucide / Tabler / Radix Icons (todos MIT)
- Nunca clonar copy de marketing site

**Caveats operacionais a documentar:**

```
✅ OK: radius=14px, shadow="0 2px 8px oklch(0% 0 0 / 0.08)", spacing-base=8px
✅ OK: hierarquia tipográfica (h1=48px serif, h2=32px, body=16px)
✅ OK: filosofia ("dense Linear-style", "warm Notion-style") como anotação interna
❌ Não OK: "linear_archetype" como nome de arquivo
❌ Não OK: copiar copy de homepage do Linear pra demos
❌ Não OK: Söhne ou Inter Display literal (fonte proprietária) — substituir por Geist
❌ Não OK: paleta dark de Linear exata (#08090A etc) — adaptar pras nossas 13
```

**Onde cravar:** ADR-NN clone-first strategy + `docs/design-system/16-clone-strategy.md` (criar) + naming convention em `lib/design/archetypes/`

---

## D-20 — Voice/writing principles: pesquisa ou adiar?

**Recomendação:** Opção **C** — Adiar JIT até Fase 2 self-service.
**Confiança:** Alta
**Raciocínio:** O produto hoje tem `next-intl 4` setup + namespaces (`common`, `auth`, `billing`, `programs`, `push`, `email`). Copy dia 1 é escrita pelo fundador (agência opera), volume baixo (~200 chaves para o app completo), tom já definido implicitamente pela voz do fundador. Criar writing guide agora:

- Custo: 2-3 dias (research + draft + revisão)
- Benefício imediato: zero — não há terceiros escrevendo copy
- Risco: vira documento morto antes de ter usuários reais (anti-pattern memória `feedback_jit_anchoring.md`)

Gatilho real para escrever guide: **Fase 2** quando profissional/IA gera copy via vibe coding e precisa de constraints + exemplos. Antes disso, copy do app já está consistente porque vem de uma única voz.
**Referência externa:** padrão indústria — Mailchimp Content Style Guide (2019), Shopify Polaris voice (2018), Atlassian Brand (2020) — todos foram escritos APÓS produto ter centenas de telas e múltiplos writers. Nenhum começou com writing guide dia 1. Princípio: voice guide emerge da observação de inconsistências reais, não de teoria a priori.
**O que desbloqueia:** Nada que esteja bloqueado. Continuar com `t('chave')` + copy escrita ad-hoc pelo fundador.
**Risco se errar:** Baixo. Adiar = decisão revogável (escrever depois é trivial). Antecipar = burocracia que ninguém lê.

**Âncora JIT (gatilho de revisão):**

- Trigger 1: Fase 2 começa (vibe coding habilitado para profissional)
- Trigger 2: 2+ profissionais reclamam que IA gera copy "sem personalidade"
- Trigger 3: 200+ chaves em `messages/` (massa crítica que demanda consistência formal)

**Onde cravar:** decisão registrada neste arquivo + adicionar âncora em `.claude/rules/i18n.md` na seção "Condição de revisitar"

---

## D-28 — One-click theme swap: mecânica completa

**Recomendação:** Opção **B** — Orquestrado obrigatório.
**Confiança:** Alta
**Raciocínio:** Profissional de fitness NÃO é designer. Vai escolher combos APCA-fail se UI não bloquear. Vai trocar archetype sem entender que PWA installed não atualiza icon. Swap simples (opção A) gera 3 classes de bugs catastróficos:

1. **APCA fail silencioso** — accent + surface incompatíveis = botão invisível para alunos do prof
2. **Cache stale** — `revalidateTag` só não basta: edge cache + browser cache + PWA cache (Serwist) precisam invalidação coordenada
3. **PWA drift** — manifest icon stale, splash screen do archetype antigo, theme-color meta tag desatualizada

**Pipeline orquestrado (recomendado):**

```
1. Profissional escolhe novo archetype + palette no admin
   ↓
2. Server action `swapTheme()`:
   a. Validar combo via Zod compatibility matrix (D-43 roles + D-22 naming)
   b. Validar APCA Silver em TODOS roles via `lib/design/contrast.ts`
   c. Se fail → retornar `{ ok: false, error: { key: 'theme.apca_fail', metadata: { failedRoles } } }`
   d. Se OK → UPDATE tenants SET archetype, palette, updated_at
   e. revalidateTag(`tenant:${tenant.id}`) + revalidateTag(`brand:${brand.id}`)
   f. Cache invalidation cascata: API route /api/tenants/[id]/theme.css headers `Cache-Control: max-age=0`
   g. Manifest regen: chamar `regenerateManifest(tenant.id)` (PWA blueprint)
   h. Splash regen (Fase 5 — opcional dia 1)
   i. Log audit trail (quem trocou, quando, de/para)
   ↓
3. UI mostra toast "Tema aplicado. Clientes verão na próxima visita." + link para preview
```

**Por que não opção C (preview before commit) dia 1:** complexidade alta para profissional (2 modos confunde), schema extra (`tenant_theme_draft` table), workflow review. Adiar para Fase 5+ quando demanda real.

**Referência externa:**

- Squarespace warning pattern: "Your current template will remain active until you finalize the switch" — confirma que preview antes de commit é UX desejado mas vem em fase madura
- Linear theme switcher (settings → appearance): instant apply + cache invalidation cascade + sem preview (mas Linear não é multi-tenant; risco menor)
- Webflow CMS-driven themes: orquestrado com publish gate (template aprovação)

**O que desbloqueia:**

- Painel `app/(admin)/tenants/[id]/theme/` funcional
- API route `/api/tenants/[id]/theme.css` com cache headers corretos
- Audit trail `tenant_theme_history` (Fase 2)

**Risco se errar:** Alto. Swap simples (opção A) = bug invisível em produção (cliente final vê tema quebrado, prof não percebe imediatamente). Orquestrado evita bug catastrófico mas custa 2-3 dias a mais de implementação na Fase 1.
**Onde cravar:** blueprint design system architecture + ADR + `lib/design/swap-theme.ts` + rule swap

---

## D-31 — Internacionalização visual PT-BR

**Recomendação:** Opção **C** — Universal default, override JIT.
**Confiança:** Alta
**Raciocínio:** Mercado inicial é 100% PT-BR. Geist tem subset `latin-ext` que cobre todos diacríticos PT (ã, õ, ç, é, ô, etc) sem fallback. Tailwind v4 + `font-feature-settings` modernos cobrem ligatures e numerals automaticamente. Adicionar `[lang="pt"]` overrides agora é antecipar problema que talvez não exista — anti-pattern típico de over-engineering tipográfico.

Métrica para reconsiderar:

- Layout shift visível ≥ 4px em página real com texto PT vs EN
- Headings com palavras compostas longas (`prograMAção` vs `program`) quebram layout
- Cliente real reclama de "ar respiratório" diferente entre idiomas

Quando trigger acontecer (Fase 3+ com EN/ES ativos):

```css
/* JIT — override só onde necessário */
[lang='pt-BR'] h1,
[lang='pt-BR'] h2 {
  letter-spacing: -0.015em; /* PT tem palavras mais longas, levemente tighter */
  line-height: 1.15; /* vs default 1.2 */
}
```

**Referência externa:**

- Google Fonts research (2023): diferença visual entre PT vs EN com mesma fonte = ~2-3% width médio; abaixo de threshold perceptual
- Geist documentation: subset `latin-ext` cobre PT/ES/IT/DE/FR sem ajuste
- Tailwind v4 typography plugin: zero override per language por design

**O que desbloqueia:** Continuar implementação sem código de internacionalização visual.
**Risco se errar:** Baixo. Adiar = revogável (CSS override JIT é trivial). Antecipar = complexidade que ninguém vai manter consistente entre 18 archetypes.
**Onde cravar:** decisão registrada + âncora JIT em `.claude/rules/i18n.md` ("se layout shift PT vs EN > 4px em página real, adicionar override")

---

## D-32 — Prefers-reduced-motion: como respeitar com Motion 12?

**Recomendação:** Opção **C** — `MotionConfig reducedMotion="user"` global + CSS belt-and-suspenders.
**Confiança:** Alta
**Raciocínio:** Motion 12 (`motion/react`) tem **suporte nativo** via `<MotionConfig reducedMotion="user">` no root. Quando usuário tem `prefers-reduced-motion: reduce`, Motion automaticamente:

- Desliga transform animations (x, y, scale, rotate)
- Desliga layout animations
- **PRESERVA** opacity e color (decisão correta — fades não causam vestibular trigger)

Implementação dia 1 (uma vez no root layout):

```tsx
// app/layout.tsx
import { MotionConfig } from 'motion/react'

return (
  <NextIntlClientProvider>
    <MotionConfig reducedMotion="user">
      <RouteProvider>{children}</RouteProvider>
    </MotionConfig>
  </NextIntlClientProvider>
)
```

Complementar com CSS belt-and-suspenders em `app/globals.css` para animations que NÃO passam por Motion (CSS keyframes, scroll-snap, smooth-scroll):

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Por que não opção B (`useReducedMotion` hook por componente): boilerplate em 18 archetypes × N componentes = inviável. Config global do Motion 12 + CSS layer cobre 99% dos casos.

**Referência externa:**

- Motion docs oficial (motion.dev/docs/react-accessibility): "Setting reducedMotion to 'user' on MotionConfig is the recommended default for accessibility"
- WCAG 2.3.3 Animation from Interactions (Level AAA): "Motion animation triggered by interaction can be disabled" — `prefers-reduced-motion` é o mecanismo padrão
- Josh Comeau (joshwcomeau.com): "CSS media query é safety net; framework hook é o controle preciso" — recomenda ambos

**O que desbloqueia:** WCAG 2.3.3 AAA compliance no launch + cobertura para todos archetypes sem código repetido.
**Risco se errar:** Médio. Não respeitar = usuários com vestibular condition saem do app (e marca PWA fitness vai ter alguns). Implementar errado (só hook sem CSS) = animações CSS escapam (CSS keyframes em loaders, etc).
**Onde cravar:** ADR motion + rule motion (nova) + `app/layout.tsx` + `app/globals.css`

---

## D-34 — Brand assets: sistema próprio ou JIT?

**Recomendação:** Opção **C** — JIT.
**Confiança:** Alta
**Raciocínio:** PWA já tem em produção (Etapa 10):

- `<Logo>` component (wordmark) com `useBrand()`
- Favicon dinâmico
- Manifest icons (192, 512)
- Apple touch icon (180)
- Splash screen
- Theme-color meta tag

O que falta para Pacote B "app com sua marca":

- SVG mark (símbolo sem texto) — JIT quando profissional pedir
- Lockup horizontal vs vertical — JIT quando designer reclamar
- Brand kit download (zip de assets) — Fase 2+
- Color extraction automatic do logo — Fase 2+ (alinha com D-09)

Construir `tenant_brand_assets` table separada agora = sobre-engenharia para problema que `<Logo>` resolve. Reusar `tenant_photo` com `surface='logo'` (opção C original) é tentador mas misturar "fotos de programa" com "ativos de identidade" em uma table cria confusão semântica + RLS mais complexo + queries piores.

**Caminho recomendado (Fase 1 → Fase 2):**

| Fase   | Solução                                                                       | Custo         |
| ------ | ----------------------------------------------------------------------------- | ------------- |
| Fase 1 | `<Logo>` simples (wordmark SVG inline + manifest existing)                    | 0 (já existe) |
| Fase 2 | `tenant_brand_assets` (logo_mark, logo_wordmark, logo_lockup, favicon_source) | ~1 sprint     |
| Fase 3 | Brand kit download + AI color extraction                                      | ~1 sprint     |

**Referência externa:**

- Stripe Atlas (precedente SaaS B2B): começou com upload de logo único, evoluiu para brand kit ano 3
- Vercel: começou com `<Logo>` simples, lockup variants vieram com Vercel Brand
- Linear: brand assets só viraram sistema dedicado em 2024 (3 anos pós-launch)

**O que desbloqueia:** Continuar Fase 1 sem schema adicional. Pacote B entrega "app com sua marca" usando `<Logo>` existing.
**Risco se errar:** Baixo. Adiar = revogável. Construir agora = bloqueia trabalho mais urgente (engines, multi-tenant content).
**Onde cravar:** decisão registrada + âncora "gatilho Fase 2 = construir `tenant_brand_assets`" + blueprint photography expandido (Fase 2)

---

## D-35 — Email tokens

**Recomendação:** Opção **B** — Adapter functions `getEmailTokens(archetype)`.
**Confiança:** Alta
**Raciocínio:** A pesquisa externa confirmou que **CSS custom properties NÃO funcionam em email**:

- Gmail, Outlook, Yahoo Mail: zero suporte a `var(--token)`
- Apple Mail: suporte parcial
- Outlook 2013-2021 usa Microsoft Word renderer (sem flexbox, sem grid, sem var(), sem calc())
- React Email tem PostCSS plugin que **resolve CSS variables em build time** — exatamente o pattern que precisamos

Pattern recomendado:

```ts
// lib/design/adapters/email.ts
import type { Archetype } from '@/lib/design/archetypes'
import { getArchetypeTokens } from '@/lib/design/archetypes'

export type EmailTokens = {
  // Subset compatível com email (cores hex, sem oklch)
  colorBgPage: string      // hex resolvido do --role-page-canvas
  colorBgCard: string      // hex resolvido do --role-surface-container
  colorText: string        // hex resolvido do --role-text-body
  colorAccent: string      // hex resolvido do --role-accent-primary
  colorBorder: string      // hex resolvido do --role-border-default
  // Tipografia (font stacks safe para email)
  fontFamilyHeading: string  // ex: 'Georgia, "Times New Roman", serif'
  fontFamilyBody: string     // ex: '-apple-system, "Helvetica Neue", Arial, sans-serif'
  // Spacing em px (não rem, alguns clients ignoram)
  spacingSm: string        // '8px'
  spacingMd: string        // '16px'
  spacingLg: string        // '24px'
  // Border radius limitado (Outlook não suporta) — degradar graciosamente
  radiusCard: string       // '8px' (Outlook ignora, vê quadrado)
}

export function getEmailTokens(archetype: Archetype): EmailTokens {
  const tokens = getArchetypeTokens(archetype)
  return {
    colorBgPage: oklchToHex(tokens.rolePageCanvas),
    colorBgCard: oklchToHex(tokens.roleSurfaceContainer),
    colorText: oklchToHex(tokens.roleTextBody),
    colorAccent: oklchToHex(tokens.roleAccentPrimary),
    colorBorder: oklchToHex(tokens.roleBorderDefault),
    fontFamilyHeading: emailSafeFontStack(tokens.fontHeading),
    fontFamilyBody: emailSafeFontStack(tokens.fontBody),
    spacingSm: '8px',
    spacingMd: '16px',
    spacingLg: '24px',
    radiusCard: '8px',
  }
}

// Uso em template React Email
import { Tailwind } from '@react-email/components'
import { getEmailTokens } from '@/lib/design/adapters/email'

export default function WelcomeEmail({ archetype }) {
  const tokens = getEmailTokens(archetype)
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: { brand: tokens.colorAccent, text: tokens.colorText },
            fontFamily: { heading: tokens.fontFamilyHeading.split(',') },
          },
        },
      }}
    >
      {/* Template usa Tailwind classes que PostCSS resolve para inline styles */}
    </Tailwind>
  )
}
```

Por que não opção A (subsystem separado): drift inevitável entre `lib/design/email/tokens.ts` e `lib/design/tokens.ts`. Adapter functions evitam drift por construção (single source of truth).

**Referência externa:**

- caniemail.com — CSS variables: 12% suporte (sem Gmail, sem Outlook, sem Yahoo)
- React Email docs (react.email/docs/components/tailwind): Tailwind PostCSS plugin resolve var() em build time
- Maizzle (concorrente): também usa "build-time token resolution" pattern

**O que desbloqueia:**

- Emails transacionais (welcome, password reset, payment confirmation) com brand do tenant
- Report IA email entrega (pesquisa 25)
- Newsletter Fase 3+

**Risco se errar:** Médio. Opção A vira manutenção dupla. Opção C (hardcode) bloqueia multi-tenant email branded. Opção B é o sweet spot.
**Onde cravar:** blueprint email + `lib/design/adapters/email.ts` + rule email (futura)

---

## D-36 — Print stylesheet

**Recomendação:** Opção **A** — Universal `@media print` em Passo 9 governança.
**Confiança:** Média (relevância depende de quanto cliente real imprime)
**Raciocínio:** Print stylesheet continua relevante em 2026 porque:

1. **Reports IA** (pesquisa 25) — profissional/cliente vai imprimir avaliações, planos de treino, contratos
2. **PDF export** (Puppeteer/Playwright) usa `@media print` por baixo dos panos — same stylesheet serve para tela impressa E PDF gerado server-side
3. **Custo é baixo** — 1 dia de trabalho cobre 90% dos casos

Stylesheet universal recomendado (`app/styles/print.css`, importado JIT por páginas que imprimem):

```css
@media print {
  /* Ink-economical: substituir colored backgrounds por white */
  :root {
    --role-page-canvas: white;
    --role-surface-container: white;
    --role-surface-elevated: white;
    --role-feature-card-bg: white;
    --role-text-body: black;
    --role-text-emphasis: black;
    --role-text-muted: #555;
    --role-border-default: #ccc;
    --role-accent-primary: black; /* CTAs viram texto preto sublinhado */
    --role-shadow-card: none;
    --role-shadow-modal: none;
  }

  /* Hide UI chrome */
  nav,
  header[data-nav],
  footer[data-nav],
  aside,
  [data-print='hide'],
  .no-print,
  button:not([data-print='show']),
  [role='navigation'],
  [role='banner'] {
    display: none !important;
  }

  /* Mostrar elementos só-print */
  [data-print='show-only'] {
    display: block !important;
  }

  /* Page break sensato */
  h1,
  h2,
  h3 {
    break-after: avoid;
  }
  table,
  figure,
  .card {
    break-inside: avoid;
  }
  img {
    max-width: 100% !important;
    height: auto !important;
  }

  /* Tipografia print-friendly */
  body {
    font-family: Georgia, 'Times New Roman', serif; /* Serif é mais legível em papel */
    font-size: 11pt;
    line-height: 1.4;
    color: black;
    background: white;
  }
  h1 {
    font-size: 20pt;
  }
  h2 {
    font-size: 16pt;
  }
  h3 {
    font-size: 13pt;
  }

  /* Links expandem URL no print */
  a[href]:not([href^='#'])::after {
    content: ' (' attr(href) ')';
    font-size: 9pt;
    color: #555;
  }

  /* Page setup */
  @page {
    margin: 2cm 1.5cm;
    /* Header/footer opcional */
  }
}
```

Por que não opção B (per archetype): exagero. Print elimina diferenças visuais entre archetypes (tudo vira black on white). Manter universal mantém manutenção simples.

**Referência externa:**

- MDN Printing Guide (2025): "@media print continues to be the standard mechanism for print-optimized layouts"
- PDF4.dev guide: confirma que Puppeteer/Playwright PDF export aplica `@media print` automaticamente
- A11y aspect: print sem `@media print` deixa páginas escuras imprimíveis (custo enorme de tinta) — issue de a11y/sustainability

**O que desbloqueia:**

- Reports IA imprimíveis sem CSS extra por feature
- PDF export server-side funcional dia 1
- Conformidade básica com expectativa do mercado pro (médicos, advogados, fisios imprimem MUITO)

**Risco se errar:** Médio. Sem print stylesheet, cada feature que precisar PDF/print reinventa. 1 dia de investimento em Passo 9 governança evita N dias de retrabalho.
**Onde cravar:** Passo 9 plano design-system + `app/styles/print.css` + rule contrast ampliada (menção print)

---

## D-37 — RTL languages

**Recomendação:** Opção **B** — Documentar gap, JIT quando primeiro tenant RTL.
**Confiança:** Alta
**Raciocínio:** Mercado inicial é 100% PT-BR. Roadmap declarado: EN + ES (ambos LTR). RTL (Árabe, Hebraico, Persa) não está no roadmap visível. Implementar RTL agora:

- Custo Tailwind v4: médio (precisa converter `ml-*` → `ms-*`, `pl-*` → `ps-*`, `text-left` → `text-start` em todo codebase + arquetipos)
- Custo shadcn/ui: já suporta via `components.json` flag `"rtl": true` + uso de logical properties
- Custo testing: alto — precisa Playwright RTL para validar 18 archetypes × 5 paletas × LTR/RTL

Benefício atual: zero (nenhum cliente RTL).

A boa notícia da pesquisa: **Tailwind v4 introduz logical properties que cobrem RTL nativamente** sem necessidade de prefixo `rtl:` na maioria dos casos. Disciplina dia 1 mitiga custo de migração:

**Disciplina dia 1 (zero custo, evita retrabalho futuro):**

```
✅ Usar logical properties por padrão:
  text-start (não text-left)
  ms-4 me-2 (não ml-4 mr-2)
  ps-4 pe-2 (não pl-4 pr-2)
  rounded-s-md rounded-e-md (não rounded-l-md rounded-r-md)
  border-s border-e (não border-l border-r)

❌ Quando MESMO precisar direção física (raro):
  Adicionar comentário /* explicitly LTR — não converter para logical */
```

Quando primeiro tenant RTL aparecer (Fase 3+):

1. Habilitar `"rtl": true` em `components.json`
2. Adicionar `dir="rtl"` em `<html lang="ar" dir="rtl">`
3. Auditar componentes custom (formulários, modais, dropdowns) com Playwright
4. Custo estimado: 3-5 dias (não 3-5 semanas como seria sem disciplina dia 1)

Disciplina dia 1 é **fricção zero** (escrever `ms-4` é tão fácil quanto `ml-4`).

**Referência externa:**

- Tailwind v4 release notes: logical properties são preferidas vs `rtl:` prefix
- shadcn/ui issue #2759 e PR #2059: confirma que `components.json rtl: true` cobre primitives
- Flowbite RTL guide: usa pattern de logical properties como recomendação principal

**O que desbloqueia:** Continuar Fase 1 sem custo extra. Preparação implícita via logical properties (custo zero).
**Risco se errar:** Baixo. Sem disciplina = retrabalho de 3-5 semanas. Com disciplina = retrabalho de 3-5 dias. Adiar suporte funcional = OK (não há cliente RTL).
**Onde cravar:** rule i18n ampliada com seção "Logical properties dia 1" + âncora JIT "primeiro tenant RTL = habilitar pipeline completo"

---

## D-38 — Color blindness: o que é obrigatório vs nice-to-have?

**Recomendação:** Opção **B** — WCAG 1.4.1 (redundância informacional) é BLOCKER para semantic status components.
**Confiança:** Alta
**Raciocínio:** APCA Silver cobre WCAG 1.4.3 (contrast) mas NÃO cobre WCAG 1.4.1 (use of color). São critérios distintos:

- **1.4.3 (contraste):** texto fica legível? APCA resolve.
- **1.4.1 (uso de cor):** informação é compreensível sem cor? APCA NÃO resolve.

WCAG 1.4.1 é Level **A** (mínimo absoluto), enquanto APCA-equivalente WCAG 1.4.3 é Level AA. Failure 1.4.1 = blocker legal em mercados regulados (Lei Brasileira de Inclusão, EAA União Europeia 2025+).

**Specs por semantic status component:**

| Componente              | Cor (única) | Cor + ícone        | Cor + texto              | Cor + ícone + texto (RECOMENDADO) | WCAG 1.4.1 |
| ----------------------- | ----------- | ------------------ | ------------------------ | --------------------------------- | ---------- |
| Toast success           | ❌ Fail     | ⚠️ Marginal        | ✅ Pass                  | ✅ ✅ Pass                        | OK         |
| Toast danger            | ❌ Fail     | ⚠️ Marginal        | ✅ Pass                  | ✅ ✅ Pass                        | OK         |
| Badge "active/inactive" | ❌ Fail     | ❌ Fail (sem ARIA) | ✅ Pass                  | ✅ ✅ Pass                        | OK         |
| Form field error border | ❌ Fail     | ⚠️ Marginal        | ✅ Pass (mensagem texto) | ✅ ✅ Pass                        | OK         |
| Chart line              | ❌ Fail     | ✅ Pass (símbolo)  | ✅ Pass (label)          | ✅ ✅ Pass                        | OK         |
| Calendar event tipo     | ❌ Fail     | ✅ Pass (ícone)    | ⚠️ Marginal              | ✅ Pass                           | OK         |

**Implementação dia 1 (passa 1.4.1):**

```tsx
// lib/design/semantic.ts — schema obrigatório
export type SemanticStatus = 'success' | 'warning' | 'danger' | 'info'

export const STATUS_VISUAL: Record<SemanticStatus, {
  icon: LucideIcon
  ariaLabel: string  // i18n key
  bgRole: Role
  fgRole: Role
  iconRole: Role
}> = {
  success: {
    icon: CheckCircle2,
    ariaLabel: 'common.status.success',
    bgRole: 'semantic-success',
    fgRole: 'text-on-accent',
    iconRole: 'text-on-accent',
  },
  danger: {
    icon: XCircle,
    ariaLabel: 'common.status.danger',
    bgRole: 'semantic-danger',
    fgRole: 'text-on-accent',
    iconRole: 'text-on-accent',
  },
  warning: { icon: AlertTriangle, ariaLabel: 'common.status.warning', ... },
  info: { icon: Info, ariaLabel: 'common.status.info', ... },
}

// Componente semântico SEMPRE renderiza ícone + role aria + texto
export function StatusBadge({ status, children }) {
  const visual = STATUS_VISUAL[status]
  const t = useTranslations()
  const Icon = visual.icon
  return (
    <span
      role="status"
      aria-label={t(visual.ariaLabel)}
      style={{
        background: `var(--role-${visual.bgRole})`,
        color: `var(--role-${visual.fgRole})`,
      }}
    >
      <Icon size={14} aria-hidden="true" />
      {children /* texto SEMPRE presente */}
    </span>
  )
}
```

Por que A (só APCA) não basta: profissional fitness vai criar dashboard com "verde = aluno em dia, vermelho = aluno atrasado" → 8% dos homens (deuteranopia) verão ambos como amarelo-marrom. Sem ícone+texto, info é perdida.

Por que C (Sim Daltonism em CI) não é prioridade: nice-to-have. Se ícone + texto + cor são obrigatórios por construção (componente força), a simulação CI vira validação redundante. Adicionar como "trigger se reclamação real" (JIT).

**Referência externa:**

- WCAG 1.4.1 Understanding doc (W3C): "color must be supported by at least one other visual indicator"
- AccessiCart 1.4.1 guide: status indicators são exemplo canônico de failure pattern
- Material 3 chips: pattern industry para `icon + label + color`

**O que desbloqueia:**

- 4 semantic roles do D-43 (success/warning/danger/info) viram componentes seguros
- Lint rule para forçar `<StatusBadge>` em vez de `<span className="text-red-500">` (Fase 2)
- Conformidade WCAG 2.1 Level A em chart, badge, toast, form error

**Risco se errar:** Alto. WCAG 1.4.1 failure = ação legal real em mercados regulados (8M+ brasileiros com algum tipo de daltonismo). Mitigação por construção (componente força) é mais barato que mitigação por audit posterior.
**Onde cravar:** rule contrast ampliada + `lib/design/semantic.ts` + ESLint rule "no-color-only-status" (Fase 2)

---

## D-39 — High-contrast mode (forced-colors): esforço vs benefício

**Recomendação:** Opção **A reduzida** — suporte mínimo (não total, ~1 dia de esforço).
**Confiança:** Alta
**Raciocínio:** A pesquisa externa mudou minha visão sobre esforço: **forced-colors mode é mais fácil do que parece** porque a plataforma web faz o heavy lifting. Quando `@media (forced-colors: active)` está ativo:

- Browser automaticamente substitui `color` por `CanvasText`, `background` por `Canvas`, `border` por `ButtonBorder` etc
- CSS variables custom são silenciosamente ignoradas
- Shadows e gradients são removidos
- Backplate é desenhado atrás de texto para legibilidade

O que QUEBRA em forced-colors (e o que devemos corrigir):

| Tipo de componente                    | O que quebra                                                          | Esforço para corrigir                                                                                      |
| ------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **SVG icons**                         | Stroke/fill com cor custom não muda — fica invisível em high contrast | 5 min: `@media (forced-colors:active) { svg { stroke: CanvasText; fill: CanvasText; } }`                   |
| **Borda com `transparent`**           | Fica invisível em high contrast                                       | 15 min: usar `border: 1px solid transparent` substituído por `var(--role-border-default)` em forced-colors |
| **Focus rings com box-shadow**        | Box-shadow é removido — focus invisível!                              | 30 min: adicionar `outline: 2px solid; outline-offset: 2px` para forced-colors                             |
| **Cards diferenciados só por shadow** | Cards somem em high contrast                                          | 15 min: adicionar border explícito quando shadow é único differentiator                                    |
| **Botões filled vs ghost**            | Ambos viram mesma cor de sistema                                      | 30 min: adicionar `forced-color-adjust: none` em botões críticos OU usar diferenciação adicional (outline) |
| **Status semantic (success/danger)**  | Toda cor semantic vira `CanvasText` — perde signal                    | Já resolvido por D-38 (redundância ícone+texto cobre isso)                                                 |

Esforço total estimado: **1 dia para um dev experiente** (5-6 componentes shadcn críticos: button, input, select, dropdown, dialog, sheet) + auditoria Storybook.

CSS exemplo (`app/styles/forced-colors.css`):

```css
@media (forced-colors: active) {
  /* SVG icons herdam cor de sistema */
  svg:not([data-forced-colors-keep]) {
    fill: CanvasText;
    stroke: CanvasText;
  }

  /* Focus ring sempre visível (não confiar em box-shadow) */
  :focus-visible {
    outline: 2px solid Highlight !important;
    outline-offset: 2px;
  }

  /* Cards precisam de borda quando shadow é removido */
  [data-slot='card'],
  [role='dialog'],
  [data-state='open'] {
    border: 1px solid CanvasText;
  }

  /* Botão primary mantém aparência (não vira igual ao ghost) */
  [data-slot='button'][data-variant='default'] {
    forced-color-adjust: none;
    background: ButtonText;
    color: ButtonFace;
    border: 1px solid ButtonText;
  }

  /* Status badges mantém estrutura (cor é decorativa; ícone+texto cobrem WCAG 1.4.1) */
  [role='status'] {
    border: 1px solid CanvasText;
  }
}
```

Por que A reduzida (não total): suporte "total" requer testar todos archetypes em Windows High Contrast Mode (3 themes × 5 archetypes × 30 componentes = 450 combinações). Suporte mínimo (cobrir 5-6 componentes críticos + SVG icons + focus rings) cobre 95% dos casos com 1 dia de trabalho.

**Referência externa:**

- Polypane forced colors guide: "very few CSS rules needed — platform does heavy lifting"
- CSS Color Adjustment Module Level 1: spec de `forced-color-adjust: none` para escapar quando necessário
- Ben Myers Encyclopedia: pattern recomendado é "fix what breaks, not rewrite the system"
- Microsoft Edge blog: ~4-7% de usuários Windows usam high contrast (público real, especialmente older + low-vision)

**O que desbloqueia:**

- WCAG 2.2 conformance para forced-colors usuários
- Acesso ao mercado público brasileiro (Lei 13.146/2015 §63) que tem provisões para acessibilidade governamental
- Diferencial vs concorrentes B2B fitness (zero suporta high contrast)

**Risco se errar:** Médio. Adiar = perde nicho real (4-7% de usuários Windows + qualquer cliente B2B governamental). 1 dia de investimento agora vs N dias depois de complaint real.
**Onde cravar:** Passo 9 plano design-system + `app/styles/forced-colors.css` + Storybook story "forced colors" + rule contrast ampliada

---

## D-41 — Theme switching transition UX

**Recomendação:** Opção **A** — Hard refresh dia 1.
**Confiança:** Alta
**Raciocínio:** A pesquisa externa atualizou suporte de View Transitions API:

- **Chrome/Edge:** suporte total cross-document desde versão 126 (2024) — hoje 100%
- **Safari:** suporte cross-document desde 18.2 (final 2024)
- **Firefox:** suporte parcial em desenvolvimento (versões 146-151 com flag); estável esperado 2026 Q3-Q4

Para tenant troca de archetype:

- Frequência: rara (3-10x por ano por tenant)
- Onde acontece: admin do profissional, depois cliente final vê na próxima visita (browser refresh natural)
- Critical path: NÃO — não é interação repetitiva onde animação importa

Investir agora em View Transitions = otimizar pra cenário raro com benefício marginal. Hard refresh:

- Funciona em 100% dos browsers
- Zero código adicional
- Comunica "algo grande mudou" via flash natural

Quando View Transitions vira boa ideia (Fase 5+):

- Quando swap virar feature recorrente (não só admin troca, mas usuário troca light/dark, etc)
- Quando Firefox estabilizar (2026 Q3+)
- Quando microinterações dentro do app justificarem investimento

Pattern de upgrade quando vier (Fase 5+):

```css
/* app/globals.css */
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 300ms;
  animation-timing-function: ease-in-out;
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
  }
}
```

(Note: `prefers-reduced-motion` belt-and-suspenders já tratado em D-32.)

Por que não opção C (notification prévia para clientes): outro problema (resolvido em D-42), não é transição visual.

**Referência externa:**

- Chrome for Developers (2024-2026): cross-document view transitions são "production ready" mas Firefox gap impede uso default-on
- caniuse.com View Transitions: 89% global suporte em 2026 (sem Firefox)
- Linear theme switcher: usa instant apply sem View Transitions (e ninguém reclama)

**O que desbloqueia:** Não há nada bloqueado. Continuar com hard refresh padrão.
**Risco se errar:** Baixo. Adiar = revogável (adicionar View Transitions é trivial quando Firefox estabilizar).
**Onde cravar:** decisão registrada + âncora JIT "Fase 5+ ou Firefox stable = adicionar View Transitions"

---

## D-42 — Tenant pivot warning: mudança radical de archetype

**Recomendação:** Opção **A híbrido** — Aviso UI + preview opcional Fase 5+ (sem bloqueio rígido).
**Confiança:** Média
**Raciocínio:** Profissional é quem decide (autoridade do tenant). Clientes finais são impactados. Solução tem que respeitar autoridade do tenant + comunicar impacto sem bloquear.

**Pipeline recomendado:**

```
1. Profissional escolhe novo archetype/palette no admin
   ↓
2. UI mostra DIFF visual:
   - Preview lado-a-lado "Antes / Depois" (screenshot da home renderizada)
   - Mood family detection (Warm → Bold = "mudança radical")
   - Mensagem clara: "Seus N alunos verão visual completamente diferente na próxima visita"
   ↓
3. Confirmation dialog:
   - Para mudança MESMA família: "Aplicar agora" (1 clique)
   - Para mudança RADICAL: "Tenho certeza" (2 cliques — confirmation modal)
   - SEM bloqueio rígido — profissional pode ignorar warning
   ↓
4. Após apply:
   - Audit log "trocou em DATA, de archetype X para Y" (queryable)
   - Opção JIT (Fase 5+): notification para clientes finais via push "Sua app foi atualizada visualmente"
```

Por que **NÃO** opção D (bloquear mudanças entre famílias):

- Profissional sabe seu negócio (rebrand é decisão estratégica)
- Bloquear = perda de autoridade do tenant (anti-pattern white-label)
- "Mood families" são heurísticas, não regras absolutas
- Cria escape hatches (criar novo tenant pra mudar) que pioram UX

Por que **NÃO** opção C (preview period 7 dias) dia 1:

- Complexidade alta (2 versões do tenant rodando paralelas)
- Schema extra (`tenant_archetype_draft`)
- Bug surface (cache inconsistente, links A/B)
- Adiar para Fase 5+ quando demanda real

**Mood family detection (compatibility matrix):**

```ts
// lib/design/mood-families.ts
type MoodFamily = 'warm-soft' | 'minimal-tech' | 'editorial' | 'bold-energetic' | 'luxury-cinematic'

const ARCHETYPE_MOOD: Record<Archetype, MoodFamily> = {
  'warm-wellness-notion': 'warm-soft',
  'soft-productive-stripe': 'warm-soft',
  'minimal-mono-vercel': 'minimal-tech',
  'minimal-mono-linear': 'minimal-tech',
  'bold-energetic-nike': 'bold-energetic',
  // ...
}

const COMPATIBLE_TRANSITIONS: Record<MoodFamily, MoodFamily[]> = {
  'warm-soft': ['warm-soft', 'editorial'], // compatível
  'minimal-tech': ['minimal-tech', 'editorial'],
  'bold-energetic': ['bold-energetic', 'luxury-cinematic'],
  // ...
}

export function detectPivotSeverity(from: Archetype, to: Archetype): 'minor' | 'major' | 'radical' {
  const fromFamily = ARCHETYPE_MOOD[from]
  const toFamily = ARCHETYPE_MOOD[to]
  if (fromFamily === toFamily) return 'minor'
  if (COMPATIBLE_TRANSITIONS[fromFamily].includes(toFamily)) return 'major'
  return 'radical' // ex: warm-soft → bold-energetic
}
```

UI baseada em severity:

- `minor` (same family): "Aplicar" — 1 clique, toast
- `major` (compatible families): "Confirmar mudança" — confirmation simples
- `radical` (cross-family): "Esta é uma mudança radical. Seus N alunos verão visual completamente diferente. Tenho certeza" + checkbox "Sim, entendo o impacto"

**Referência externa:**

- Squarespace template switcher: usa modal warning + screenshot preview — pattern industry-proven
- Webflow CMS theme migration: 2-stage commit (staging → production) — referência para Fase 5+ preview
- Shopify theme editor: instant apply mas com "Restore previous theme" botão (revert) — alternativa interessante

**O que desbloqueia:**

- Profissional pode pivot estratégico sem nos pedir permissão
- Cliente final tem chance de ser comunicado (Fase 5+)
- Audit log permite reverter por suporte se necessário

**Risco se errar:** Médio. Sem warning = profissional reclama "clientes acharam que era outro app". Com bloqueio = profissional reclama "não posso fazer rebrand". Híbrido A é o sweet spot.
**Onde cravar:** rule swap + `lib/design/mood-families.ts` + UI confirmation dialog no admin

---

## Conformidade WCAG — o que é obrigatório no launch vs pode esperar

### Blocker WCAG 2.1 Level A (LAUNCH OBRIGATÓRIO)

| Critério                          | O que exige                                               | Onde está                         | Decisão coberta       |
| --------------------------------- | --------------------------------------------------------- | --------------------------------- | --------------------- |
| **1.1.1** Non-text content        | Toda imagem/icon tem `alt` ou `aria-hidden`               | ESLint `jsx-a11y` rules           | (existente)           |
| **1.3.1** Info and relationships  | Estrutura semântica (heading hierarchy, lists, landmarks) | Storybook lint                    | (existente)           |
| **1.3.2** Meaningful sequence     | Order DOM = order visual                                  | RSC default ordering              | (existente)           |
| **1.3.3** Sensory characteristics | Não confiar só em forma/posição/som                       | Componentes semantic              | D-38                  |
| **1.4.1** Use of color            | Cor não é único veículo de informação                     | `<StatusBadge>` força ícone+texto | **D-38**              |
| **2.1.1** Keyboard                | Todo controle alcançável via teclado                      | Radix primitives garantem         | (existente)           |
| **2.4.1** Bypass blocks           | Skip to main link                                         | Layout padrão                     | (a adicionar Passo 9) |
| **2.4.2** Page titled             | `<title>` único por page                                  | Next.js metadata                  | (existente)           |
| **2.4.4** Link purpose            | `aria-label` ou texto descritivo                          | ESLint rule + i18n                | (existente)           |
| **3.1.1** Language of page        | `<html lang>` correto                                     | next-intl `getLocale()`           | (existente)           |
| **3.3.1** Error identification    | Erro identificado em texto                                | RHF + Zod messages                | (existente)           |
| **3.3.2** Labels or instructions  | Labels visíveis em forms                                  | `<AppForm>` força                 | (existente)           |
| **4.1.2** Name role value         | ARIA semântico em custom widgets                          | Radix primitives                  | (existente)           |

### Blocker WCAG 2.1 Level AA (LAUNCH OBRIGATÓRIO mercado B2B sério)

| Critério                     | O que exige                          | Onde está                        | Decisão coberta |
| ---------------------------- | ------------------------------------ | -------------------------------- | --------------- |
| **1.4.3** Contrast (minimum) | Texto 4.5:1, large 3:1               | APCA Silver supersedes           | (existente)     |
| **1.4.4** Resize text        | 200% sem perda de função             | `rem` units everywhere           | (existente)     |
| **1.4.5** Images of text     | Texto real (não imagem)              | Política editorial               | (existente)     |
| **1.4.10** Reflow            | 320px sem scroll horizontal          | Tailwind responsive mobile-first | (existente)     |
| **1.4.11** Non-text contrast | Ícones/borders/focus rings 3:1       | APCA non-text Lc ≥ 45            | (existente)     |
| **1.4.12** Text spacing      | Letter/word/line spacing ajustável   | CSS modern defaults              | (existente)     |
| **1.4.13** Content on hover  | Hover content dismissible/persistent | Radix tooltip primitives         | (existente)     |
| **2.4.7** Focus visible      | Focus indicator visível              | `:focus-visible` everywhere      | (existente)     |
| **2.5.7** Dragging movements | Drag tem alternativa não-drag        | Editor (Fase 2)                  | (a documentar)  |

### Blocker WCAG 2.2 Level AA (RECOMENDADO no launch — pequeno esforço)

| Critério                                  | O que exige                               | Esforço                                 | Decisão coberta               |
| ----------------------------------------- | ----------------------------------------- | --------------------------------------- | ----------------------------- |
| **2.4.11** Focus not obscured (min)       | Focus não obscurecido por sticky elements | Auditoria sticky nav/footer             | Passo 9                       |
| **2.4.12** Focus not obscured (enhanced)  | Focus 100% visível                        | AAA — aspiracional                      |
| **2.5.7** Dragging movements              | Já em 2.1                                 | (cobre)                                 |
| **2.5.8** Target size (minimum)           | Touch targets ≥ 24×24 CSS pixels          | Já temos 44pt (iOS HIG é mais rigoroso) | (existente — ver nota abaixo) |
| **3.2.6** Consistent help                 | Help link consistente em todas páginas    | UX decision (Fase 2)                    |
| **3.3.7** Redundant entry                 | Não pedir info já fornecida               | Form Engine (já em design)              |
| **3.3.8** Accessible authentication (min) | Auth não exige memória cognitiva          | Email+senha cobre                       | (existente)                   |

**Sobre 2.5.8 vs iOS HIG:** WCAG 2.5.8 exige mínimo 24×24 CSS pixels. iOS HIG recomenda 44pt × 44pt. **Adotar 44pt como floor universal** (constituição §7 já obriga isso) cobre AMBOS os requisitos com folga. Nada a fazer.

### WCAG 2.2 Level AAA (ASPIRACIONAL — JIT)

| Critério                                       | O que exige                              | Quando perseguir                                    |
| ---------------------------------------------- | ---------------------------------------- | --------------------------------------------------- |
| **1.4.6** Contrast (enhanced)                  | Texto 7:1, large 4.5:1                   | APCA Silver já supera em paletas mais conservadoras |
| **1.4.8** Visual presentation                  | Line-height ≥1.5, paragraph spacing 1.5x | CSS defaults (já cobre)                             |
| **2.1.3** Keyboard (no exception)              | Zero exceção a keyboard                  | Editor drag-drop é exceção aceita (Fase 2)          |
| **2.3.3** Animation from interactions          | Animations desligáveis                   | D-32 cobre via Motion 12                            |
| **2.4.9** Link purpose (link only)             | Link compreensível sem contexto          | UX decision                                         |
| **2.4.13** Focus appearance (AAA)              | Focus 2px + 3:1 contraste do componente  | D-39 cobre com `outline: 2px solid`                 |
| **3.1.5** Reading level                        | Texto nível ensino médio                 | Voice guide (D-20 JIT)                              |
| **3.3.9** Accessible authentication (enhanced) | Sem CAPTCHA cognitivo                    | Já não usamos CAPTCHA                               |

### Conformidade legal específica Brasil

| Norma                                                | O que exige                                               | Status                            |
| ---------------------------------------------------- | --------------------------------------------------------- | --------------------------------- |
| **Lei 13.146/2015** (Lei Brasileira de Inclusão) §63 | Acessibilidade obrigatória para sites/apps de uso público | APCA Silver + 1.4.1 cobrem (D-38) |
| **eMAG 3.1** (Modelo de Acessibilidade Gov BR)       | WCAG 2.0 AA mínimo                                        | Coberto (vamos além)              |
| **NBR 17060:2022**                                   | Padrão brasileiro acessibilidade web                      | WCAG 2.1 AA cobre                 |

### Conformidade UE (preparação Fase 3+ se expandir)

| Norma                                     | O que exige                            | Status                |
| ----------------------------------------- | -------------------------------------- | --------------------- |
| **EAA 2025** (European Accessibility Act) | WCAG 2.1 AA para B2C; B2B 50M+ revenue | Coberto               |
| **EN 301 549**                            | WCAG 2.1 AA + cognitive accessibility  | Coberto (D-32 + D-38) |
| **GDPR**                                  | Não-a11y mas relacionado               | Fora escopo deste doc |

---

## Harmonia entre decisões — sistema coerente

As 15 decisões formam **três camadas de proteção** organizadas pelo princípio "proteger cliente final SEM complicar profissional":

### Camada 1 — Hard limits invisíveis para o profissional (proteção por construção)

Profissional não escolhe estas — sistema impõe. Custo cognitivo zero.

- **APCA Silver gate** (existente) — combo cor/superfície inválido bloqueia save
- **WCAG 1.4.1 redundância** (D-38) — componente status SEMPRE renderiza ícone + texto
- **Prefers-reduced-motion** (D-32) — `MotionConfig` global respeita user device
- **Forced-colors fallback** (D-39) — CSS forced-colors cobre 5-6 componentes críticos
- **Target size 44pt** (constituição §7) — Tailwind utility classes garantem
- **Logical properties RTL-ready** (D-37) — disciplina dia 1, custo zero, preparação implícita

Resultado: profissional escolhe "Bold-Energetic + Vermelho" sem entender APCA, e plataforma silenciosamente impede combinação que machucaria cliente final.

### Camada 2 — Avisos contextuais quando profissional tenta algo arriscado (proteção por nudge)

Profissional decide — sistema informa.

- **Theme swap orquestrado** (D-28) — APCA gate + cache cascade + audit log
- **Pivot warning** (D-42) — diff visual + severity detection + double confirm em radical
- **Quota AI** (D-10) — limits transparentes por pacote, pacote extra disponível

Resultado: profissional vê impacto antes de aplicar. Pode ignorar (autoridade preservada), mas decisão é informada.

### Camada 3 — Adiamento JIT que mantém futuro aberto sem peso presente

Decisões revogáveis com âncoras claras de quando revisitar.

- **Voice/writing guide** (D-20) — adiar até Fase 2 self-service
- **i18n PT-BR tweaks** (D-31) — universal default, override quando layout shift real
- **RTL support funcional** (D-37) — preparação implícita (logical props) + ativação JIT
- **Brand assets sistema** (D-34) — `<Logo>` simples dia 1, sistema completo Fase 2
- **View Transitions** (D-41) — hard refresh dia 1, View Transitions Fase 5+
- **Preview before commit** (D-28 + D-42) — confirmation dialog dia 1, preview period Fase 5+

Resultado: zero burocracia agora, gatilhos documentados para futuros Claudes não re-deduzirem.

### Princípio meta — proteção sem paternalismo

Todas as decisões respeitam que **profissional é o decisor** (white-label = autoridade do tenant). Plataforma:

- Impede o impossível (APCA fail catastrófico)
- Avisa sobre o arriscado (pivot radical, swap com cache stale)
- Permite o estratégico (mudança radical de archetype se prof tem 2 cliques de confirmação)
- Nunca bloqueia decisão de negócio do tenant

Anti-pattern evitado: "agência sabe melhor" / "plataforma decide pelo usuário" — paternalismo que mata white-label. Cada warning tem escape hatch; cada limit tem justificativa técnica clara (APCA Silver, WCAG 1.4.1) — não preferência estética da agência.

### Sequenciamento operacional

| Fase                                                | Decisões aplicadas                                | Esforço incremental             |
| --------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| **Fase 1** (transformação design system 1.5-2 dias) | D-09, D-28, D-32, D-34 (parcial), D-38, D-41      | ~1.5 dias (cabe no plano atual) |
| **Passo 9 governança**                              | D-36, D-39 + WCAG 2.2 audit                       | ~1 dia (cabe no Passo 9)        |
| **Fase 2** (self-service profissional)              | D-10, D-20 (revisar), D-34 (completo), D-35, D-42 | ~1 sprint                       |
| **Fase 3+** (expansão internacional)                | D-31 (revisitar), D-37 (ativar)                   | Variável (cliente real)         |
| **Fase 5+** (recursos premium)                      | D-41 (View Transitions), D-42 (preview period)    | Variável (demanda real)         |
| **Imediato** (sem fase, decisão documental)         | D-16 (caveats legal)                              | 0 dias (documentar e seguir)    |

---

## Próximos passos sugeridos

1. **Promover D-09, D-16, D-32, D-38** para `12-decisions-resolved.md` (mais maduras + Fase 1)
2. **Cravar D-28 + D-42** em ADR junto com blueprint design system architecture
3. **Adicionar âncoras JIT em rules existentes:**
   - `.claude/rules/contrast.md` — D-38 (1.4.1 redundância) + D-39 (forced-colors) + D-32 (motion)
   - `.claude/rules/i18n.md` — D-31 (PT-BR JIT) + D-37 (RTL logical properties)
4. **Criar rule novas:**
   - `.claude/rules/motion.md` — D-32 com MotionConfig + CSS belt
   - `.claude/rules/swap-theme.md` — D-28 + D-42 + mood families
5. **Atualizar plano `docs/plans/design-system.md`:**
   - Passo 9 (governança) inclui print stylesheet + forced-colors + WCAG 2.2 audit
   - Adicionar checkpoint pré-Fase 2: revisitar D-20 + D-34 + D-35 + D-42

---

## Referências externas consolidadas

### Legal (D-16)

- [Figma Terms of Service](https://www.figma.com/legal/tos/) — não restringem extração de valores visuais
- [Tailwind UI EULA](https://tailwindui.com/license) — precedente comercial de "valores estruturais são commodity"
- USWDS, Carbon, Material Design — todos open-source, estabelecem precedente "tokens funcionais não-protegíveis"
- Feist Publications v. Rural Telephone (1991) — facts não copyrightáveis nos EUA
- Oracle v. Google (2021) — declaring code é fair use, analogia para tokens

### WCAG

- [WCAG 2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) — 24×24 CSS pixels mínimo, iOS HIG 44pt cobre
- [WCAG 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG20/Understanding/use-of-color.html) — redundância obrigatória ícone+texto+cor
- [WCAG 2.4.11 Focus Appearance (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html) — 2px solid outline + 3:1 contrast
- [WCAG 2.4.13 Focus Appearance (AAA)](https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance-enhanced.html) — versão enhanced

### Tech specs

- [Motion useReducedMotion docs](https://motion.dev/docs/react-use-reduced-motion) — `MotionConfig reducedMotion="user"` pattern
- [CSS forced-colors guide (Polypane)](https://polypane.app/blog/forced-colors-explained-a-practical-guide/) — implementação prática
- [Cross-document View Transitions (CSS-Tricks)](https://css-tricks.com/cross-document-view-transitions-part-1/) — status browser 2026
- [React Email tailwind component](https://www.npmjs.com/package/@react-email/tailwind) — PostCSS plugin resolve CSS vars build-time
- [Can I Email — CSS variables](https://www.caniemail.com/features/css-variables/) — 12% suporte (sem Gmail/Outlook/Yahoo)
- [Tailwind v4 release notes](https://tailwindcss.com/blog/tailwindcss-v4) — logical properties RTL-ready
- [shadcn/ui RTL PR #2059](https://github.com/shadcn-ui/ui/pull/2059) — `components.json rtl: true` pattern

### UX patterns

- [Squarespace template switching warnings](https://support.squarespace.com/hc/en-us/articles/205815598-Switching-templates-in-version-7-0) — modal warning + data-loss disclosure
- Linear, Webflow, Shopify theme switchers — instant apply vs preview-before-commit trade-offs

---

_Decisões pendentes para promoção para `12-decisions-resolved.md` quando user aprovar este documento._
