# 02. Arquétipos — candidatos a templates

> Status: hipótese ativa + lista expandida em discussão
> Última atualização: 2026-05-19
> Bloqueado por: decisão "5 ou 15-20 arquétipos" (H3 em `01-hypotheses.md`) + pesquisa 28 (component catalog)

---

## Premissa

Cada arquétipo é candidato a **clone verbatim de 1 DESIGN.md** (ou bundle de 2-3 DESIGN.md complementares se necessário). Cada arquétipo carrega:

- Tipografia (família + 12-14 variants)
- Spacing scale (base 4px ou 8px)
- Radius scale (algumas marcas 3, outras 8+)
- Shadow/elevation philosophy (0 níveis, 1 tier, 3 níveis, 5 stacked)
- Motion (timing + easing + spring)
- Photography philosophy (framed / full-bleed / soft-focus / composite-mockup / no-photo)
- Density implícita (compact / comfortable / spacious — não é dimensão, é parte do bundle)
- Mood verbs (5-10 adjetivos descritivos)
- Vertical fit (qual setor mais se beneficia)

---

## Núcleo confirmado (pesquisa 26) — 5 arquétipos core

### A. Editorial-Serif

- **Marcas-base candidatas:** Sanity (dark mono) · Notion (light pastel) · The Verge (brutalist hybrid)
- **Mood:** trust, expertise, intelligence, editorial credibility
- **Vertical fit:** **idiomas ★★★★★** · coaching premium ★★★★ · yoga editorial ★★★★ · fitness ★★
- **DNA:** serif display (Newsreader / PP Editorial New / Tiempos) + sans body (Inter / Geist) + framed photography + 1px hairlines + comfortable density + 250-300ms ease motion
- **DESIGN.md lidos:** sanity, notion, theverge ✅ (pesquisa 27)
- **Status:** confirmed candidate, decisão de "qual marca clonar" pendente

### B. Minimal-Mono

- **Marcas-base candidatas:** Linear (dark surface ladder) · Vercel (light + stacked shadow canon) · Anthropic/Claude (warm-mono variant)
- **Mood:** precision, speed, expertise técnica, sobriety
- **Vertical fit:** **coaching tech ★★★★★** · idiomas tech ★★★★ · fitness tracking ★★★ · yoga ★
- **DNA:** Geist Sans + Geist Mono + sharp 0-6px radius + zero/inset shadow (color-as-elevation) + 100-150ms linear motion + compact density + product screenshots/code mockups
- **DESIGN.md lidos:** linear, vercel, claude ✅ (pesquisa 27)
- **Status:** confirmed candidate

### C. Soft-Productive

- **Marcas-base candidatas:** Stripe (fintech mesh) · Figma (color blocks) · Shopify Polaris (productivity B2B)
- **Mood:** efficient, modern, business-friendly, premium-acessível
- **Vertical fit:** **coaching B2B ★★★★★** · fitness apps ★★★★ · idiomas SaaS ★★★★ · yoga apps ★★★
- **DNA:** Inter/Sohne + pill buttons + tinted stacked shadows + 8-16px radius + 200-300ms easeOut motion + comfortable density + composite-mockup photography
- **DESIGN.md lidos:** stripe, figma ✅ (pesquisa 27). Shopify Polaris pendente
- **Status:** confirmed candidate

### D. Bold-Energetic

- **Marcas-base candidatas:** Nike (commerce/photography) · Tesla (luxury/cinematic) · Whoop/Strava (ausentes nas refs)
- **Mood:** power, performance, achievement, atletismo
- **Vertical fit:** **fitness performance ★★★★★** · running/cycling ★★★★★ · yoga power-flow ★★★ · coaching ★★ · idiomas ★
- **DNA:** condensed display (Futura/Anton) + 0-4px radius + ZERO shadow (photography-as-depth) + 100-200ms motion + comfortable-spacious density + full-bleed photography
- **DESIGN.md lidos:** nike, tesla ✅ (pesquisa 27). Whoop/Strava pendente
- **Status:** confirmed candidate

### E. Warm-Wellness

- **Marcas-base candidatas:** Calm · Headspace · Aaptiv (TODAS ausentes nas refs) → Airbnb como proxy
- **Mood:** calm, nurturing, accessible, gentle
- **Vertical fit:** **yoga ★★★★★** · meditation ★★★★★ · idiomas ★★★★ · wellness coaching ★★★★ · fitness gentle ★★★
- **DNA:** rounded soft (8-32px radius) + cream/warm tones + single-tier shadow (sutil) + 250-300ms ease-in-out + spacious-only density + soft-focus photography
- **DESIGN.md lidos:** airbnb ✅ (proxy — pesquisa 27)
- **Status:** **candidate fraco** — proxy só. Precisa pesquisa adicional ou download Calm/Headspace separado

---

## Opcionais (pesquisa 26 — fora da v1)

### F. Brutalist-Mono

- **Marcas-base:** Are.na, V2, mid-2020s editorial
- **DNA:** mono only, sharp, raw, exposed grids, courier-style
- **Vertical fit:** coaching tech-niche
- **Status:** opcional. Adiar pós-validação dos 5 core

### G. Luxe-Editorial

- **Marcas-base:** Apple, Tesla (já em D), Loro Piana digital
- **DNA:** massive whitespace + serif display + product full-bleed + monochrome+1 deep accent
- **Vertical fit:** yoga premium / coaching elite
- **Status:** opcional. Possivelmente fundir com D ou E

---

## Expansão proposta pelo user — 15-20 candidatos

Se clone-first é barato (não precisa criar do zero), abre espaço pra **mais arquétipos como bundle de templates "raw"** pra advanced users / nichos específicos.

### Candidatos adicionais a explorar (extraídos dos 71 DESIGN.md)

Não lidos ainda em profundidade. Apenas catalogados por intuição de mood:

| Arquétipo candidato            | Marcas-base no repo                         | Vertical fit hipotético               |
| ------------------------------ | ------------------------------------------- | ------------------------------------- |
| **Fintech sofisticado**        | Stripe (já em C), Revolut, Wise, Mastercard | coaching financeiro, business         |
| **Dev-tools dark**             | Supabase, Cursor, Warp                      | coaching tech, idiomas tech           |
| **AI conversational**          | Anthropic (Claude), Cohere, OpenAI          | coaching IA, idiomas AI               |
| **Consumer playful**           | Spotify, Netflix-equiv, Pinterest           | apps consumer, yoga lifestyle         |
| **Editorial-photography**      | NYT (ausente), Wired, The Verge             | conteúdo educativo, idiomas premium   |
| **Performance auto-luxury**    | BMW, BMW-M, Bugatti, Ferrari, Lamborghini   | fitness luxury, coaching elite        |
| **Premium minimal Apple-like** | Apple                                       | yoga premium, idiomas premium         |
| **Builder/creative**           | Webflow, Framer, Figma (já em C)            | coaching criativo, marketing pessoal  |
| **Wellness organic**           | Clay, Mastercard cream                      | wellness coaching, yoga               |
| **Marketplace warm**           | Airbnb (já em E proxy), Shopify (em C)      | comércio, coaching com produtos       |
| **Editorial dark/serious**     | Sanity (já em A), The Verge (já em A)       | conteúdo profundo, idiomas acadêmicos |
| **Data/dashboard**             | Linear (já em B), Notion (já em A)          | coaching analítico, fitness tracking  |
| **AI minimal humanist**        | Claude (já em B), Mistral, Replicate        | coaching IA, idiomas IA               |
| **Consumer entertainment**     | Spotify, Twitch, YouTube                    | apps engajamento                      |
| **Editorial brutalist**        | Are.na, The Verge                           | coaching artístico                    |

---

## Pergunta crítica em aberto

**Vamos com 5 core curados OU 15-20 raw library?**

Ver H3 em `01-hypotheses.md`. Compromise candidato:

> **5-8 arquétipos "headline" curados** (defaults — mostrados primeiro ao profissional) + **biblioteca extra de 10-12 templates "raw"** acessível via "ver mais" pra advanced users.

---

## Marcas-base prioritárias (clone source) — preliminar

Pra cada arquétipo core, lista das marcas candidatas com pros/contras:

| Arquétipo       | Candidato 1               | Candidato 2                  | Candidato 3                        | Como decidir                                    |
| --------------- | ------------------------- | ---------------------------- | ---------------------------------- | ----------------------------------------------- |
| Editorial-Serif | Sanity (dark mono)        | Notion (light pastel)        | The Verge (brutalist hybrid)       | Qual vibe mais bate com idiomas premium?        |
| Minimal-Mono    | Vercel (light + 5 shadow) | Linear (dark surface ladder) | Claude (warm-mono)                 | Light OR dark default? Quem usa esse arquétipo? |
| Soft-Productive | Stripe (canon fintech)    | Figma (color blocks)         | Shopify (productivity)             | Qual cobre mais use-cases coaching/fitness?     |
| Bold-Energetic  | Nike (commerce)           | Tesla (luxury)               | _Whoop/Strava (download separate)_ | Photography-led OR luxury-led?                  |
| Warm-Wellness   | Airbnb (proxy fraco)      | _Calm/Headspace (a baixar)_  | _Aaptiv (a baixar)_                | Baixar Calm/Headspace é prioritário             |

---

## Pendências

- [ ] Decidir 5 vs 15-20 arquétipos (H3 → 11-decisions-pending.md)
- [ ] Baixar Calm/Headspace/Aaptiv DESIGN.md (se publicamente disponíveis em outro repo) OU usar fallback Airbnb
- [ ] Ler IBM Carbon, Atlassian, Polaris, Material Design, iOS HIG pra ver se algum desses encaixa como arquétipo adicional ou influencia categorização
- [ ] Pesquisa 28 (component catalog) por arquétipo — orienta escolha final da marca-base
- [ ] Decisão "headline curados" vs "raw library" (ver compromise acima)
- [ ] Mapeamento arquétipo → vertical desafit (musculação/yoga/idiomas) — confirmar que núcleo cobre 100% dos 3

---

## Notas

- Os 5 arquétipos core cobrem ~85-95% segundo pesquisa 26
- Clone-first muda o cálculo de custo: criar 15 arquétipos não custa muito mais que criar 5 (já estão prontos nos DESIGN.md)
- Manutenção é o trade-off real: 15 templates não-curados envelhecem
- UX matters: profissional vendo 15 opções de cara = paralisia. Precisa de UI guided (sugestão por vertical → curadoria → exploração)
