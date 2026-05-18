// RESEARCH: storybook story pra AppEntitlementGate (ADR-0038 + ADR-0040 §E + ADR-0035).
// EntitlementProvider mock global em preview.tsx: plan B, chatbot=false, ai_assessment=true.

import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { Heading } from '@/components/ui/heading'
import { Text } from '@/components/ui/text'

import { AppEntitlementGate } from './app-entitlement-gate'

const meta = {
  title: 'Wrappers/AppEntitlementGate',
  component: AppEntitlementGate,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AppEntitlementGate>

export default meta
type Story = StoryObj<typeof meta>

// chatbot=false no mockFeatures → mostra modal/placeholder.
export const ModalLocked: Story = {
  args: {
    feature: 'chatbot',
    mode: 'modal',
    children: (
      <div className="border p-6">
        <Heading level={3}>Chatbot (premium)</Heading>
        <Text>Click pra abrir paywall modal.</Text>
      </div>
    ),
  },
}

// ai_assessment=true → renderiza children normalmente.
export const Allowed: Story = {
  args: {
    feature: 'ai_assessment',
    mode: 'modal',
    children: (
      <div className="border p-6">
        <Heading level={3}>AI Assessment (allowed pro plan B)</Heading>
        <Text>Feature liberada — children renderizam direto.</Text>
      </div>
    ),
  },
}

export const InlineLocked: Story = {
  args: {
    feature: 'white_label_full',
    mode: 'inline',
    children: (
      <div className="border p-6">
        <Heading level={3}>White-label completo</Heading>
        <Text>Não vai renderizar — modo inline mostra placeholder.</Text>
      </div>
    ),
  },
}
