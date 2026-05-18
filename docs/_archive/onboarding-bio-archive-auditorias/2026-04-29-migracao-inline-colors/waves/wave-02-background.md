# Wave 02 — background / backgroundColor

Migrar todas as ocorrências de `style={{ background: '#hex' }}`, `backgroundColor`, e `rgba()`.

## Estratégia por grupo

### Device mockups (22 ocorrências)

Hardware colors → Tailwind arbitrary: `bg-black`, `bg-[#3a3a42]`, `bg-[#555]`.
macOS traffic lights → `bg-[#ff5f57]`, `bg-[#febc2e]`, `bg-[#28c840]`.

### Creatives (10 ocorrências)

Cores de slide → Tailwind arbitrary: `bg-[#FF7A59]`, `bg-[#C084FC]`, etc.

### rgba() overlays (14 ocorrências)

- `rgba(0,0,0,X)` → `bg-black/XX`
- `rgba(255,255,255,X)` → `bg-white/XX`
- `rgba(20,20,24,X)` → `bg-[rgba(20,20,24,X)]` (cor específica)
- `rgba(198,255,108,X)` → `bg-[rgba(198,255,108,X)]`
- `rgba(251,191,36,X)` → `bg-[rgba(251,191,36,X)]`

### hsl() wrapping (1 ocorrência)

StepFooter.tsx: `hsl(var(--muted))` → `bg-muted`.

### color-mix() com hex (8+ ocorrências)

Substituir hex por CSS var ref dentro do color-mix.

### Gradients com rgba (2 ocorrências)

Manter inline com eslint-disable + comentário justificando.
