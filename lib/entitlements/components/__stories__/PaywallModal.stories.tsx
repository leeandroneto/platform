import { useState } from 'react'

import type { Story } from '@ladle/react'

import { Button } from '@/components/ui/button'

import type { FeatureGate } from '../../types'
import { PaywallModal } from '../PaywallModal'

const chatbotGate: FeatureGate = {
  feature: 'chatbot',
  requiredPlans: ['C'],
  upgradeFrom: ['A', 'B'],
  upgradeUrl: '/upgrade?feature=chatbot',
  quotaKey: null,
  uxPattern: 'A',
  paywallCopy: {
    title: 'Chatbot IA personalizado',
    bullets: [
      'Atende alunos 24/7 com seu método',
      'Treinado nos seus programas e exercícios',
      'Reduz dúvidas no WhatsApp em ~70%',
    ],
    previewImage: null,
  },
}

export const ChatbotPaywall: Story = () => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Abrir paywall chatbot</Button>
      <PaywallModal open={open} onOpenChange={setOpen} gate={chatbotGate} currentPlan="A" />
    </div>
  )
}

export default {
  title: 'Entitlements / PaywallModal',
}
