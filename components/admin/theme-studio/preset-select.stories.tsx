// RESEARCH: custom — Storybook story for PresetSelect (theme-studio editor)
/**
 * @registry-meta
 * @kind theme-studio-preset-select-story
 * @namespace @desafit
 * @level L2
 * @category smart-block-story
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { ThemeFormProvider } from '@/app/admin/theme-studio/_state/theme-form-provider'

import ThemePresetSelect from './preset-select'

const meta: Meta<typeof ThemePresetSelect> = {
  title: 'Theme Studio/PresetSelect',
  component: ThemePresetSelect,
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
    withCycleThemes: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <ThemeFormProvider initialTheme={DEFAULT_THEME}>
        <div className="w-[420px] p-2">
          <Story />
        </div>
      </ThemeFormProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ThemePresetSelect>

/**
 * Default: preset select button + cycle prev/next arrows.
 * Click button to open popover with 25+ built-in presets list + search.
 */
export const Default: Story = {
  args: { withCycleThemes: true },
}

/**
 * Without cycle buttons: only the popover trigger button visible.
 */
export const WithoutCycleButtons: Story = {
  args: { withCycleThemes: false },
}

/**
 * Disabled state: button dimmed, cycle arrows disabled.
 */
export const Disabled: Story = {
  args: { withCycleThemes: true, disabled: true },
}
