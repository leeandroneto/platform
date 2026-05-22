// RESEARCH: custom — Storybook story for CodePanel (theme-studio editor)
/**
 * @registry-meta
 * @kind theme-studio-code-panel-story
 * @namespace @desafit
 * @level L2
 * @category smart-block-story
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { ThemeFormProvider } from '@/app/admin/theme-studio/_state/theme-form-provider'

import CodePanel from './code-panel'

const meta: Meta<typeof CodePanel> = {
  title: 'Theme Studio/CodePanel',
  component: CodePanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'desktop',
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' }, type: 'mobile' },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
  },
  argTypes: {
    themeId: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <ThemeFormProvider initialTheme={DEFAULT_THEME}>
        <div className="h-[600px] w-[580px] overflow-hidden rounded-lg border p-4">
          <Story />
        </div>
      </ThemeFormProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof CodePanel>

/**
 * Default: no themeId — registry command section shows hint placeholder.
 * CSS tab active with Tailwind v4 + OKLCH format (platform defaults).
 */
export const Default: Story = {
  args: {},
}

/**
 * With themeId: registry command is live with real URL.
 * Copy button is enabled and shows shadcn add command.
 */
export const WithRegistryId: Story = {
  args: {
    themeId: 'tenant-storybook/1',
  },
}

/**
 * Dark background — code panel on dark surface.
 */
export const DarkMode: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
