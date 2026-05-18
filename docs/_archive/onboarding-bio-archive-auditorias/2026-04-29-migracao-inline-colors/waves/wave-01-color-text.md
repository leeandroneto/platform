# Wave 01 — color (texto)

Migrar todas as ocorrências de `style={{ color: '#hex' }}` e `style={{ color: 'hsl(...)' }}`.

## Estratégia por grupo

### Creatives (33 ocorrências)

Cores de design fixo para posts Instagram → Tailwind arbitrary `text-[#HEX]`.
Refatorar STAGE_ICONS para usar className em vez de style={{ color }}.

### Diagnostic activation (15 ocorrências)

`#34D399` → `text-success`, `#FBBF24` → `text-warning`, `#F87171` → `text-destructive`.
Color-mix com hex → substituir hex por CSS var ref.

### Launch/Landing (6 ocorrências)

Mesmo padrão: success/warning tokens.

### AuditAnalysis (2 ocorrências color direto)

`#d4815e` → `var(--color-score-low)` (mantém inline, hex vira var).

### hsl() wrapping (1 ocorrência)

Focus.tsx: `hsl(var(--destructive))` → `className="text-destructive"`.

### Outros

coming-soon `#0B0B0D` → `text-[#0B0B0D]`, diagnostic/processing `#FF7A59` → `text-[#FF7A59]`.
TransformationsSection `#fff` → `text-white`.
