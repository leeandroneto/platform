// RESEARCH: storybook story pra Text primitive (ADR-0038 + ADR-0040 §F).
// Showcase 3 variants body/body-sm/lead + asChild.

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Text } from './text'

const meta = {
  title: 'Typography/Text',
  component: Text,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['body', 'body-sm', 'lead'] },
  },
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

const sampleCopy =
  'Texto exemplo pra exibir o variant — Lorem ipsum dolor sit amet, consectetur adipiscing elit.'

export const Body: Story = {
  args: { variant: 'body', children: sampleCopy },
}

export const BodySm: Story = {
  args: { variant: 'body-sm', children: sampleCopy },
}

export const Lead: Story = {
  args: { variant: 'lead', children: sampleCopy },
}

export const AllVariants: Story = {
  args: { children: '' },
  render: () => (
    <div className="max-w-md space-y-4">
      <Text variant="lead">Lead: subtítulo pós-hero, intro de página.</Text>
      <Text variant="body">Body: parágrafo padrão, peso default.</Text>
      <Text variant="body-sm">Body-sm: legenda, helper text, footer fine print.</Text>
    </div>
  ),
}
