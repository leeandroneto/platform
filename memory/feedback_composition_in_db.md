---
name: Composição em banco — vibe-coding-ready dia 1
description: Templates hardcoded em código não funcionam pra vibe coding. Composição vive no banco como JSONB, IA edita via tools.
type: feedback
---

Composição do site público vive no BANCO (`page_versions.content jsonb`), não em código hardcoded. Isso é vibe-coding-ready desde dia 1.

**Why:** owner cravou na validação ponto-a-ponto (2026-06-11) — IA precisa poder editar tudo (reorganizar, mostrar/ocultar, trocar seções). Templates hardcoded em código quebram quando IA precisa editar runtime. Industry confirmou (Webstudio + Plasmic + Puck + shadcn registry 2026 — todos): composição em dados sobrevive.

**How to apply:**

`page_versions.content jsonb`:

```jsonc
{
  "style_preset": "retake-default | minimalista | swiss | neo-brutalism",
  "blocks": [
    {
      "id": "uuid",
      "kind": "hero | about | plans | faq | testimonials | cta | ...",
      "variant": "default | minimal | brutalist | swiss",
      "visible": true,
      "sort": 1,
      "props_override": {}
    },
    ...
  ],
  "slots": {
    "hero": { "headline": "...", "photo": "..." },
    "plans": [...]
  }
}
```

Código:

```
components/site/
├── primitives/                  # Eyebrow, DisplayHeading, SectionWrapper, Container
├── motion/                      # parallax, reveal, etc
├── sections/                    # Hero, About, Plans, FAQ — ÚNICOS
│                                  Aceitam slots + variant + props_override
└── style-presets/               # Token sets por estilo
    ├── retake-default.ts
    ├── minimalista.ts
    ├── swiss.ts
    └── neo-brutalism.ts

lib/site/style-seeds/            # Receita default (qual seções + variants iniciais)
├── retake-default.seed.ts
├── minimalista.seed.ts
└── ...
```

IA edita via tools registradas em `public.ai_tools`:

- `toggle_section_visibility(blockId)` — `blocks[].visible = false/true`
- `reorder_page_sections([blockIds])` — atualiza `blocks[].sort`
- `add_page_section(kind, position)` — push em `blocks[]`
- `remove_page_section(blockId)` — splice
- `update_section_variant(blockId, variant)` — `blocks[].variant`
- `update_section_props(blockId, props)` — merge em `blocks[].props_override`
- `set_style_preset(preset)` — substitui `style_preset` + aplica seed

Approval gate opt-in via `public.engine_plans` (mutações críticas pedem confirmação).

Quando 1 estilo precisa seção radicalmente diferente:

- 90% — variant em prop da seção genérica (`<Hero variant="brutalist">`)
- 10% raros — override em `components/site/sections/{kind}/variants/{style}.tsx` JIT

Membro bespoke: retake admin edita `blocks` direto, pode criar `kind='custom'` apontando pra `components/site/sections/custom/{tenant_slug}.tsx`.
