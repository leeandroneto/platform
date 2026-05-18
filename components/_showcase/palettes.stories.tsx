// RESEARCH: storybook showcase — 13 paletas seed (ADR-0028 + ADR-0040 §H).
// Render só visual (swatches OKLCH). NÃO testa APCA aqui — validate-palettes.ts é gate build.

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { OFFICIAL_PALETTES, type PaletteSeed } from '@/lib/design/palettes'

import { Heading } from '@/components/ui/heading'
import { Muted } from '@/components/ui/muted'
import { Text } from '@/components/ui/text'

function PaletteCard({ palette }: { palette: PaletteSeed }) {
  return (
    <div className="border bg-card rounded-md p-4">
      <Heading level={4}>{palette.display_name}</Heading>
      <Muted>
        {palette.slug} · hue {palette.hue}
      </Muted>
      <Text variant="body-sm" className="mt-1">
        {palette.description}
      </Text>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Swatch label="primary" oklch={palette.primary_oklch} />
        <Swatch label="secondary" oklch={palette.secondary_oklch} />
        <Swatch label="tertiary" oklch={palette.tertiary_oklch} />
      </div>

      <div className="mt-3">
        <Muted>surfaces dark (L 0.13 → 0.37)</Muted>
        <div className="mt-1 flex gap-1">
          {palette.surfaces_dark.map((c, i) => (
            <div key={i} className="h-8 flex-1 rounded-sm" style={{ background: c }} />
          ))}
        </div>
      </div>

      <div className="mt-3">
        <Muted>extras (5 chart colors)</Muted>
        <div className="mt-1 flex gap-1">
          {palette.extras_oklch.map((c, i) => (
            <div key={i} className="h-8 flex-1 rounded-sm" style={{ background: c }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function Swatch({ label, oklch }: { label: string; oklch: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="h-12 w-full rounded-sm" style={{ background: oklch }} />
      <Muted className="text-xs">{label}</Muted>
    </div>
  )
}

function AllPalettes() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {OFFICIAL_PALETTES.map((p) => (
        <PaletteCard key={p.slug} palette={p} />
      ))}
    </div>
  )
}

const meta = {
  title: 'Design Tokens/Palettes (13 seeds)',
  component: AllPalettes,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AllPalettes>

export default meta
type Story = StoryObj<typeof meta>

export const Catalog: Story = {}
