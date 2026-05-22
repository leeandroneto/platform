// RESEARCH: custom — Storybook story for ControlPanel (theme-studio editor)
/**
 * @registry-meta
 * @kind theme-studio-control-panel-story
 * @namespace @desafit
 * @level L2
 * @category smart-block-story
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { ThemeFormProvider } from '@/app/temas/_state/theme-form-provider'

import ControlPanel from './control-panel'

const meta: Meta<typeof ControlPanel> = {
  title: 'Theme Studio/ControlPanel',
  component: ControlPanel,
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
    aiEnabled: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <ThemeFormProvider initialTheme={DEFAULT_THEME}>
        {/* Fixed height + width mirrors the ResizablePanel context from view.tsx */}
        <div className="flex h-[700px] w-[380px] flex-col overflow-hidden rounded-lg border">
          <Story />
        </div>
      </ThemeFormProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof ControlPanel>

/**
 * Default state: colors tab active (URL param `tab=colors`).
 * Preset select stub visible at top.
 */
export const Default: Story = {
  args: { aiEnabled: false },
}

/**
 * AI tab enabled — shows the AI tab in the tab list. Tab content is a stub
 * (deferred Fase 6) so clicking AI tab shows placeholder.
 */
export const AiEnabled: Story = {
  args: { aiEnabled: true },
}

/**
 * Mobile viewport: panel is narrower; horizontal scroll area allows tab navigation.
 */
export const MobileViewport: Story = {
  args: { aiEnabled: false },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  decorators: [
    (Story) => (
      <ThemeFormProvider initialTheme={DEFAULT_THEME}>
        <div className="flex h-[700px] w-[375px] flex-col overflow-hidden border">
          <Story />
        </div>
      </ThemeFormProvider>
    ),
  ],
}
