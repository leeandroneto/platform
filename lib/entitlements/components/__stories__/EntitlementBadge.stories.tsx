import type { Story } from '@ladle/react'

import { EntitlementBadge } from '../EntitlementBadge'

export const PlanA: Story = () => <EntitlementBadge plan="A" />
export const PlanB: Story = () => <EntitlementBadge plan="B" />
export const PlanC: Story = () => <EntitlementBadge plan="C" />
export const PROLabel: Story = () => <EntitlementBadge plan="C" label="pro" />

export default {
  title: 'Entitlements / EntitlementBadge',
}
