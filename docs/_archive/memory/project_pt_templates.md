---
name: PT visual templates (unified)
description: 6 curated design templates combining palette + typography, replacing individual pickers
type: project
originSessionId: 9776cdab-edbe-4f81-835a-4239faca2d57
---

PTs choose 1 unified template instead of separate color picker + font picker. 6 templates in `lib/design/presets.ts`:

1. **Moderno** — lime + modern. Clean, contemporary, default.
2. **Editorial** — coral + editorial. Warm, premium wellness magazine feel.
3. **Clássico** — ocean + classic. Elegant, clinical, sophisticated.
4. **Impacto** — amber + bold. Sporty, strong, impact.
5. **Natural** — green + editorial. Organic, fresh, health-focused.
6. **Neon** — lime + bold. High energy, gym, urban.

**Why:** Individual pickers lead to ugly combinations. Pre-curated templates guarantee harmony.

**How to apply:** `DesignForm` in settings shows template cards. DB still stores `accent_palette` + `typography_preset` separately; template resolves to the pair. `findTemplateByPair()` matches back.
