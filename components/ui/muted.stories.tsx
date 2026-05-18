// RESEARCH: storybook story pra Muted primitive (ADR-0038 + ADR-0040 §F).
// Showcase texto secundário (text-muted-foreground + text-sm).

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Muted } from './muted'

const meta = {
  title: 'Typography/Muted',
  component: Muted,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Muted>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Texto muted — caption, helper, timestamp, fine print.' },
}

export const InContext: Story = {
  render: () => (
    <div className="max-w-md space-y-2">
      <div className="text-base">Email do cliente</div>
      <Muted>Será enviado link de confirmação pra este endereço.</Muted>
    </div>
  ),
}
