# Wave 03 — borderColor / border

Migrar todas as ocorrências de `style={{ borderColor: '#hex' }}` e border com hex.

## Ocorrências (11)

1. IPhoneMockup.tsx:25 — `borderColor: '#3a3a42'` → `className="border-[#3a3a42]"`
2. CarrosselSlides.tsx:345 — `borderColor: '#38BDF84D'` → `className="border-[#38BDF84D]"`
3. StorySlides.tsx:161 — `borderColor: '#FF7A594D'` → `className="border-[#FF7A594D]"`
4. CriticalPoint.tsx:38 — color-mix com `#FF7A59` → CSS var ref
5. PricingSection.tsx:198 — color-mix com `#FBBF24` → CSS var ref
6. SiteSection.tsx:189 — color-mix com `#FBBF24` → CSS var ref
7. FeaturesGrid.tsx:212 — `rgba(251,191,36,0.15)` → Tailwind border class
8. AuditAnalysis.tsx:443,444,587,639 — color-mix com `#d4815e` → `var(--color-score-low)`
9. ProximoPasso.tsx:42 — `hsl(var(--accent) / 0.3)` → `border-accent/30` ou CSS var
