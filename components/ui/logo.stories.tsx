// RESEARCH: storybook story pra Logo primitive (ADR-0038 + Etapa 9).
// brand.name vem do RouteProvider mock global em preview.tsx.

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Logo } from './logo'

const meta = {
  title: 'Brand/Logo',
  component: Logo,
  parameters: { layout: 'centered' },
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Logo>

export default meta
type Story = StoryObj<typeof meta>

export const Small: Story = {
  args: { size: 'sm' },
}

export const Medium: Story = {
  args: { size: 'md' },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-8">
      <Logo size="sm" />
      <Logo size="md" />
      <Logo size="lg" />
    </div>
  ),
}
