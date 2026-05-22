// RESEARCH: custom — Storybook story for PreviewPanel (theme-studio editor)
/**
 * @registry-meta
 * @kind theme-studio-preview-panel-story
 * @namespace @desafit
 * @level L2
 * @category smart-block-story
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { ThemeFormProvider } from '@/app/admin/theme-studio/_state/theme-form-provider'

import PreviewPanel from './preview-panel'

const meta: Meta<typeof PreviewPanel> = {
  title: 'Theme Studio/PreviewPanel',
  component: PreviewPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' }, type: 'mobile' },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeFormProvider initialTheme={DEFAULT_THEME}>
        {/* Mirror the ResizablePanel right-side context from view.tsx */}
        <div className="flex h-[700px] flex-col overflow-hidden">
          <Story />
        </div>
      </ThemeFormProvider>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof PreviewPanel>

/**
 * Default: cards tab active. Preview sub-components are stubs (Chunk 6).
 * Tab bar + inspector + fullscreen buttons are all functional.
 */
export const Default: Story = {}

/**
 * Desktop fullscreen-like: 1280px wide, showing all tabs in tab bar.
 */
export const DesktopWide: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
}

/**
 * Mobile viewport: narrower, horizontal scroll on tab bar visible.
 */
export const MobileViewport: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  decorators: [
    (Story) => (
      <ThemeFormProvider initialTheme={DEFAULT_THEME}>
        <div className="flex h-[812px] w-[375px] flex-col overflow-hidden border">
          <Story />
        </div>
      </ThemeFormProvider>
    ),
  ],
}
