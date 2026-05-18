// RESEARCH: storybook story pra useAppToast hook (ADR-0038 + ADR-0040 §E).
// Toaster injetado em preview.tsx global decorator. Buttons disparam toast.

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Button } from '@/components/ui/button'

import { useAppToast } from './app-toast'

function ToastDemo() {
  const toast = useAppToast()
  return (
    <div className="flex flex-col gap-3">
      <Button onClick={() => toast.success('feedback.saved')}>Success — Salvo com sucesso</Button>
      <Button variant="destructive" onClick={() => toast.error('errors.generic')}>
        Error — Algo deu errado
      </Button>
      <Button variant="secondary" onClick={() => toast.info('errors.offline')}>
        Info — Você está offline
      </Button>
      <Button variant="outline" onClick={() => toast.warning('errors.rate_limited')}>
        Warning — Muitas requisições
      </Button>
    </div>
  )
}

const meta = {
  title: 'Wrappers/AppToast',
  component: ToastDemo,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToastDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
