// lib/brand/types.ts — Tipo Brand canônico (ADR-0024 + ADR-0028).

export interface Brand {
  readonly id: string
  readonly name: string // 'desafit' | 'yoga' | 'ingles' | ...
  readonly host: string // 'desafit.app' | 'yoga.app' | ...
  readonly default_palette_id: string // FK platform.palettes (NOT NULL — ADR-0028)
  readonly logo_url: string | null
  readonly default_vertical: string // 'fitness' | 'yoga' | 'english' | ...
  readonly parent_label: string | null // 'Powered by <marca-pai>' — null = sem footer
  readonly theme_version: number // cache busting de /api/brands/[id]/theme.css?v=N
}
