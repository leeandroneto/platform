# 05. Photography — camada própria + perguntas

> Status: hipótese H7 ativa (camada própria) + arquitetura aberta
> Última atualização: 2026-05-19
> Bloqueado por: pesquisa 29 (photography system)

---

## Premissa

Fotos NÃO são "só tokens de aspect ratio". É **camada própria** porque envolve:

- Multi-tenant (cada tenant sobe próprias fotos)
- Photography philosophy per archetype (framed / full-bleed / soft-focus / composite / no-photo)
- AI vibe matching (profissional manda referência → IA detecta vibe)
- AI generation (Flux/Imagen pra brand assets quando tenant não tem)
- Editor futuro (Fase 2 visual)
- Painel upload (Fase 1 — agência ou tenant)
- Art-direction crop (Nike hero 16:9 → 4:5 mobile)
- Stock library (alternativa quando AI gen é caro)

---

## Sub-camadas

### 5.1 Upload + storage

**Onde subir:**

- Agência (Fase 1) — Leandro sobe fotos do tenant via admin
- Tenant self-service (Fase 2) — profissional sobe via painel
- API / MCP (Fase 2+) — automação

**Storage:**

- Decisão pesquisa 27: **Vercel Blob (reports) + Supabase Storage (uploads cliente)** — pra fotos brand de tenant, qual?
- Hipótese: **Supabase Storage** (RLS integrado nativo, MIME validation, bucket folder-scoped per tenant)
- Bucket sugerido: `tenant-photos/{tenant_id}/{surface}/{filename}` (surface = hero/avatar/product/etc)

**Metadata table:**

```sql
tenant_photo (
  id uuid,
  tenant_id uuid,
  storage_path text,
  surface text,           -- 'hero' | 'avatar' | 'product' | 'editorial'
  aspect_ratio text,      -- '16/9' | '1/1' | '4/5' | etc
  alt_text text,
  focal_point_x numeric,  -- 0-1 normalized
  focal_point_y numeric,  -- 0-1 normalized
  crop_versions jsonb,    -- {mobile: {x,y,w,h}, tablet: {...}, desktop: {...}}
  vibe_match jsonb,       -- {archetype: 'editorial-serif', palette: 'warm-earth', confidence: 0.87}
  source text,            -- 'upload' | 'ai-generated' | 'stock-library'
  ai_prompt text,         -- if AI generated
  cost_cents int,         -- if AI generated
  created_at timestamptz
)
```

### 5.2 Photography philosophy per archetype

Pesquisa 26 + 27 cravaram:

| Archetype       | Philosophy                                  | Aspect dominante          |
| --------------- | ------------------------------------------- | ------------------------- |
| Editorial-Serif | **Framed editorial** (rule of thirds)       | 16:9 hero, 4:3 inline     |
| Minimal-Mono    | **No-photo** ou product screenshots/mockups | 16:10 product mockup      |
| Soft-Productive | **Composite-mockup** + gradient backdrop    | 1.5:1 hero, 16:9 cards    |
| Bold-Energetic  | **Full-bleed athletic**, motion blur        | 100vh hero, 4:5 portrait  |
| Warm-Wellness   | **Soft-focus** nature, warm light           | 16:9 cinematic, 4:5 cards |

Implicação: **template determina** se tenant pode subir foto OU se é gerada via AI mockup OU se ficar sem foto.

### 5.3 Art-direction crop (Nike canon)

Pesquisa 27: Nike hero swap 16:9 desktop → 4:5 mobile para figura ficar centralizada.

**Pattern:** mesma foto original, **crops diferentes** por viewport. Não é só `object-fit: cover` — é decisão semântica de qual região mostrar.

Implementação:

- `tenant_photo.crop_versions jsonb` armazena rectangles per viewport
- Renderer escolhe crop baseado em `useMediaQuery`
- Painel editor permite definir manualmente
- AI sugere automaticamente (face detection + content awareness)

### 5.4 AI vibe matching from photo

**Use case:** profissional sobe foto de referência (estúdio, produto, brand kit) → IA detecta vibe + sugere archetype + palette compatível.

**Pipeline (pesquisa 26):**

1. Upload foto referência
2. Claude vision analisa (mood, color temperature, photography style)
3. Vibrant.js extrai OKLCH dominant colors client-side
4. Mapping foto → archetype + palette compatível
5. Sugestão UI: "esta foto bate com **Warm-Wellness** + paleta **Sage**. Confiança: 87%."
6. Profissional confirma ou ajusta

**Custo:** ~$0.006/call Claude Sonnet 4.5 (1000 input + 200 output tokens).

**Quando:** Fase 1 agência opera (text-only input); Fase 2 self-service (photo input).

### 5.5 AI photo generation

Pra tenants sem fotos próprias OU pra hero shots premium.

Pesquisa 26 catalogou custos:

| Modelo               | Custo/img  | Uso                                   |
| -------------------- | ---------- | ------------------------------------- |
| Flux Schnell         | $0.003     | Drafts, fast, rascunhos               |
| Imagen 4 Fast        | $0.02      | Budget photorealism                   |
| **Flux 2 Pro**       | **$0.03**  | **Sweet spot quality/cost (default)** |
| Imagen 4 Standard    | $0.04      | Photorealism alto                     |
| GPT Image 1.5 medium | $0.034     | Prompt adherence Elo 1264             |
| GPT Image 1.5 HD     | $0.05-0.08 | Premium hero                          |
| Flux 1.1 Pro Ultra   | $0.075     | 4MP, hero premium                     |

**Estratégia:**

- **Drafts:** Flux Schnell ($0.003) — gerar 4 opções, profissional escolhe
- **Finals:** Flux 2 Pro ($0.03) ou Imagen 4 Standard ($0.04) — gerar versão final
- **Hero premium:** Flux 1.1 Pro Ultra ($0.075) — apenas pra surfaces críticas

**Quota:** por tier de plano. Free tier = sem AI gen. Paid = N imagens/mês.

**Cache CDN agressivo:** mesma prompt = mesma imagem (Vercel Image Optimization).

### 5.6 Prompts curados per archetype

Cada archetype carrega **prompt template** pra AI generation:

```
Editorial-Serif: "editorial photography, framed composition, warm tones,
                  grain visible, rule of thirds, [subject]"
Minimal-Mono:    "product screenshot, dark UI mockup, code visible,
                  geometric overlays, no people, [subject]"
Soft-Productive: "lifestyle warm photography, modern home office,
                  abstract gradient backdrop, [subject]"
Bold-Energetic:  "athletic photography, full-bleed, motion blur,
                  high contrast, [subject]"
Warm-Wellness:   "nature soft-focus, warm light, hands or yoga pose,
                  blurred background, peaceful, [subject]"
```

→ Pesquisa 29 deve cravar prompts finais.

### 5.7 Stock library integration

Alternativa quando AI gen é caro OU quando precisa fotos específicas (e.g. equipamento de musculação).

Opções:

- **Unsplash API** (gratuito, curado, qualidade média-alta)
- **Pexels API** (gratuito, curado)
- **Shutterstock** (pago, premium)

Hipótese: **Unsplash dia 1** (zero custo, qualidade decente, vasto). Stock pago JIT se precisar.

### 5.8 Editor futuro (Fase 2)

**Painel visual** onde profissional/agência:

- Faz upload
- Define focal point (clicando na foto)
- Define crop por viewport (drag rectangle)
- Aplica filter/preset (warm/cool/vintage)
- Roda AI vibe matching
- Compara vs stock alternative

**Stack:**

- Frontend: react-image-crop + react-easy-crop
- Backend: sharp pra resize/crop server-side
- Storage: Supabase Storage

→ JIT Fase 2 quando tenant self-service abrir.

### 5.9 Painel upload (Fase 1)

**Mínimo agência:**

- Drag-drop área (shadcn drag-drop ou react-dropzone)
- Surface selector (hero / avatar / product / editorial)
- Aspect ratio target (16:9 / 1:1 / 4:5 / etc)
- Alt text input (a11y)
- Focal point (single click → x,y)
- Preview live
- Save → Supabase Storage + insert `tenant_photo` row

**Não precisa Fase 1:** crop multi-viewport, AI vibe matching, filters, stock integration.

---

## Perguntas em aberto

### Q1 — Photos = camada própria ou propriedade do template?

Hipótese H7: **camada própria** porque varia drasticamente por archetype + tenant precisa controle granular.

Alternativa: photos = sub-prop do template (template define aspect + philosophy, tenant só sobe imagem).

**Recomendado:** camada própria com **defaults derivados do template** (aspect ratios padrão, philosophy padrão). Tenant pode override.

### Q2 — AI vibe matching Fase 1 ou Fase 2?

Custo: $0.006/call. Pra 100 tenants × 5 sites/mês = 500 calls = $3/mês. Barato.

Recomendado: **Fase 1 mas opt-in.** Profissional escolhe entre upload manual ou "ajude-me a escolher template via foto referência".

### Q3 — AI generation cota free vs paid?

Custos somam rápido. Recomendado:

- **Free tier:** sem AI gen. Pode usar stock library Unsplash.
- **Pacote A (R$ 100/mês):** 20 imagens AI gen/mês (Flux 2 Pro = $0.60/mês custo nosso)
- **Pacote C (R$ 200/mês):** 50 imagens AI gen/mês ($1.50/mês custo nosso)

Profissional vê quota no admin. Excesso = paid extra ou bloqueia.

### Q4 — Stock library: dia 1 ou JIT?

Hipótese: **dia 1 Unsplash** (gratuito, API simples). Profissional busca termo → escolhe imagem → download → upload pra Supabase Storage.

### Q5 — Art-direction crop: dia 1 ou Fase 2?

Hipótese: **Fase 2.** Dia 1 = `object-fit: cover` + focal point simples (1 ponto x,y).

Quando tenant reclamar de foto cortada errada em mobile → ativa multi-viewport crops.

### Q6 — Como template "no-photo" funciona pra tenant que SÓ tem fotos?

Minimal-Mono assume product screenshots/code mockups OU no-photo. Mas profissional fitness não tem screenshots.

**Hipóteses:**

- **A:** Minimal-Mono não é template apropriado pra fitness — vetar via compatibility matrix
- **B:** Template Minimal-Mono tem variant "with-photos" pra fitness — afrouxa identity
- **C:** Profissional escolhe diferente template

Recomendado: **A.** Compatibility matrix bloqueia Minimal-Mono × vertical fitness.

### Q7 — Brand assets internos (logo, ícones de tenant) — mesmo sistema?

Logo do tenant é caso especial:

- Não vai em template (cada tenant tem o seu)
- Não vai em palette (não é cor, é asset)
- Provavelmente é **`tenant_brand`** tabela com `logo_url`, `favicon_url`, `apple_touch_icon_url`

Recomendado: **tabela própria** `tenant_brand_assets` separada de `tenant_photo`. Logo é configuração, foto é content.

### Q8 — Photos em PWA: cache offline?

Serwist permite cache. Hipótese:

- Hero / brand assets: cache forever (não muda muito)
- Editorial photos: cache 7 dias
- User-generated content: no-cache

→ Pesquisa 30.

---

## Pendências

- [ ] Pesquisa 29 dedicada photography system (prompts curados, AI vibe matching pipeline, art-direction)
- [ ] Schema `tenant_photo` finalizar (após pesquisa 29)
- [ ] Decidir Q3 quota tiers AI gen
- [ ] Decidir Q4 Unsplash integration dia 1 ou JIT
- [ ] Decidir Q6 compatibility template × vertical (Minimal-Mono × fitness?)
- [ ] Arquitetura `tenant_brand_assets` vs `tenant_photo` separado
- [ ] Cache strategy fotos (Serwist + pesquisa 30)
- [ ] Painel upload UI design (Fase 1 mínimo + roadmap Fase 2 editor visual)
