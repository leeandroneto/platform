// RESEARCH: storybook story pra Heading primitive (ADR-0038 + ADR-0040 §F).
// Showcase 4 levels semanticos + asChild + className override.

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Heading } from './heading'

const meta = {
  title: 'Typography/Heading',
  component: Heading,
  parameters: { layout: 'centered' },
  argTypes: {
    level: { control: 'select', options: [1, 2, 3, 4] },
    as: { control: 'select', options: ['h1', 'h2', 'h3', 'h4'] },
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

export const Level1: Story = {
  args: { level: 1, children: 'Heading level 1 — hero page title' },
}

export const Level2: Story = {
  args: { level: 2, children: 'Heading level 2 — section title' },
}

export const Level3: Story = {
  args: { level: 3, children: 'Heading level 3 — card title' },
}

export const Level4: Story = {
  args: { level: 4, children: 'Heading level 4 — sub-section' },
}

export const AllLevels: Story = {
  args: { children: '' },
  render: () => (
    <div className="space-y-4">
      <Heading level={1}>Heading level 1 — hero</Heading>
      <Heading level={2}>Heading level 2 — section</Heading>
      <Heading level={3}>Heading level 3 — card</Heading>
      <Heading level={4}>Heading level 4 — sub-section</Heading>
    </div>
  ),
}

export const SemanticOverride: Story = {
  args: {
    level: 1,
    as: 'h3',
    children: 'Visual h1, semantic h3 (SEO hierarchy mantida)',
  },
}
