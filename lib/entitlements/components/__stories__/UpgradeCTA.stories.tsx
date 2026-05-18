import type { Story } from '@ladle/react'

import { UpgradeCTA } from '../UpgradeCTA'

export const ChatbotToC: Story = () => <UpgradeCTA to="C" feature="chatbot" from="A" />

export const CustomDomainToB: Story = () => (
  <UpgradeCTA to="B" feature="custom_domain" from="A" label="Quero domínio próprio" />
)

export const SecondaryVariant: Story = () => (
  <UpgradeCTA to="B" feature="branded_pwa" variant="secondary" label="Ver pacote B" />
)

export default {
  title: 'Entitlements / UpgradeCTA',
}
