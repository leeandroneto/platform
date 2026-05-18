import type { Story } from '@ladle/react'

import { QuotaBanner } from '../QuotaBanner'

export const NearLimit: Story = () => (
  <QuotaBanner
    quotaKey="max_programs"
    snapshot={{ used: 8, limit: 10, nearLimit: true }}
    upgradeTo="B"
    labelSingular="programa"
  />
)

export const AtLimit: Story = () => (
  <QuotaBanner
    quotaKey="max_programs"
    snapshot={{ used: 10, limit: 10, nearLimit: true }}
    upgradeTo="B"
    labelSingular="programa"
  />
)

export const Unlimited: Story = () => (
  <QuotaBanner
    quotaKey="max_programs"
    snapshot={{ used: 50, limit: null, nearLimit: false }}
    upgradeTo="C"
    labelSingular="programa"
  />
)

export default {
  title: 'Entitlements / QuotaBanner',
}
