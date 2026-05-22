// RESEARCH: shadcn/ui button primitive — smoke story L1 @shadcn namespace (research-45 arsenal)
/**
 * @registry-meta
 * @kind primitive
 * @namespace @shadcn
 * @level L1
 * @composition []
 * @vertical null
 * @ai-hints []
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from './button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: { width: '375px', height: '812px' },
          type: 'mobile',
        },
        desktop: {
          name: 'Desktop',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop',
        },
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: { control: 'boolean' },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: 'Botão',
    variant: 'default',
    size: 'default',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon">
        <span className="sr-only">Icon</span>+
      </Button>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button disabled variant="default">
        Default
      </Button>
      <Button disabled variant="destructive">
        Destructive
      </Button>
      <Button disabled variant="outline">
        Outline
      </Button>
      <Button disabled variant="secondary">
        Secondary
      </Button>
      <Button disabled variant="ghost">
        Ghost
      </Button>
    </div>
  ),
}
