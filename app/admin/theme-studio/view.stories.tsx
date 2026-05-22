// RESEARCH: custom — Storybook story for ThemeStudioView (theme-studio root view)
/**
 * @registry-meta
 * @kind theme-studio-view-story
 * @namespace @desafit
 * @level L2
 * @category smart-block-story
 */

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { ThemeStudioView } from './view'

// ThemeStudioView wraps ThemeFormProvider internally — no decorator needed.
// preview.tsx already provides NextIntlClientProvider + RouteProvider + EntitlementProvider.

const meta: Meta<typeof ThemeStudioView> = {
  title: 'Theme Studio/ThemeStudioView',
  component: ThemeStudioView,
  tags: ['autodocs'],
  parameters: {
    // fullscreen — ThemeStudioView fills viewport (mirrors page.tsx usage)
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'desktop',
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' }, type: 'mobile' },
        desktop: { name: 'Desktop', styles: { width: '1280px', height: '800px' }, type: 'desktop' },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof ThemeStudioView>

/**
 * Default: full editor with DEFAULT_THEME. Desktop layout renders
 * ResizablePanelGroup (30% ControlPanel / 70% PreviewPanel).
 */
export const Default: Story = {
  args: {
    initialTheme: DEFAULT_THEME,
  },
}

/**
 * Mobile viewport: Tabs layout (Controls / Preview) replaces ResizablePanelGroup.
 */
export const MobileLayout: Story = {
  args: {
    initialTheme: DEFAULT_THEME,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
