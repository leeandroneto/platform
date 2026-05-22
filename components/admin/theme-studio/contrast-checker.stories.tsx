// RESEARCH: custom — Storybook story for ContrastChecker (theme-studio editor)
/**
 * @registry-meta
 * @kind theme-studio-contrast-checker-story
 * @namespace @desafit
 * @level L2
 * @category smart-block-story
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { ThemeFormProvider } from '@/app/temas/_state/theme-form-provider'

import { ContrastChecker } from './contrast-checker'

const meta: Meta<typeof ContrastChecker> = {
  title: 'Theme Studio/ContrastChecker',
  component: ContrastChecker,
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
  decorators: [
    (Story) => (
      <ThemeFormProvider initialTheme={DEFAULT_THEME}>
        <div className="p-4">
          <Story />
        </div>
      </ThemeFormProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ContrastChecker>

/**
 * Default state: trigger button visible. Click opens dialog with all color pairs.
 * ThemeFormProvider wraps with DEFAULT_THEME so all pairs have valid OKLCH values.
 */
export const Default: Story = {}

/**
 * Same as Default — dialog opens showing only failing pairs when user clicks
 * "Filter Issues". Simulated via render (no interaction needed to show trigger).
 * Real filter interaction is JIT Playwright smoke test.
 */
export const WithDefaultTheme: Story = {
  decorators: [
    (Story) => (
      <ThemeFormProvider initialTheme={DEFAULT_THEME}>
        <div className="flex flex-col gap-3 p-4">
          <p className="text-muted-foreground text-sm">
            Open dialog → &quot;Filter Issues&quot; to see failing pairs only.
          </p>
          <Story />
        </div>
      </ThemeFormProvider>
    ),
  ],
}
