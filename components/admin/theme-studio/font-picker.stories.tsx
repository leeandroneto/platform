// RESEARCH: custom — Storybook story for FontPicker (theme-studio editor)
/**
 * @registry-meta
 * @kind theme-studio-font-picker-story
 * @namespace @desafit
 * @level L2
 * @category smart-block-story
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import type { FontInfo } from '@/lib/design/contract/fonts'

import { FontPicker } from './font-picker'

function noopSelect(_font: FontInfo): void {}

// FontPicker is prop-driven (value/onSelect) — no ThemeFormProvider needed.
// useTranslations is wired via preview.tsx NextIntlClientProvider decorator.

const meta: Meta<typeof FontPicker> = {
  title: 'Theme Studio/FontPicker',
  component: FontPicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'responsive',
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' }, type: 'mobile' },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
  },
  argTypes: {
    category: {
      control: 'select',
      options: ['all', 'sans-serif', 'serif', 'monospace', 'display', 'handwriting'],
    },
    value: { control: 'text' },
    placeholder: { control: 'text' },
  },
}

export default meta
type Story = StoryObj<typeof FontPicker>

/**
 * Default: no value selected, sans-serif category filter, popover closed.
 * Click the button to open the font picker popover with infinite scroll list.
 */
export const Default: Story = {
  args: {
    onSelect: noopSelect,
    category: 'sans-serif',
    placeholder: 'Select font...',
  },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Pre-selected: Inter font already chosen. Button shows font name.
 */
export const WithValue: Story = {
  args: {
    onSelect: noopSelect,
    value: 'Inter',
    category: 'sans-serif',
  },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Serif category: popover pre-filtered to serif fonts.
 */
export const SerifCategory: Story = {
  args: {
    onSelect: noopSelect,
    category: 'serif',
    placeholder: 'Select serif font...',
  },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
}

/**
 * Mono category: popover pre-filtered to monospace fonts.
 */
export const MonoCategory: Story = {
  args: {
    onSelect: noopSelect,
    category: 'monospace',
    placeholder: 'Select mono font...',
  },
  decorators: [
    (Story) => (
      <div className="w-[280px]">
        <Story />
      </div>
    ),
  ],
}
