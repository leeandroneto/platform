// RESEARCH: storybook showcase — Material 3 motion presets (ADR-0040 §J + tarefa 14).
// Demos visuais de duration + ease + spring usando motion/react.

'use client'

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { motion } from 'motion/react'

import { duration, ease, spring } from '@/lib/design/motion'

import { Heading } from '@/components/ui/heading'
import { Muted } from '@/components/ui/muted'

function Box({ delay, transition }: { delay: number; transition: object }) {
  return (
    <motion.div
      key={delay}
      initial={{ x: 0, opacity: 0 }}
      animate={{ x: 200, opacity: 1 }}
      transition={transition}
      className="bg-primary size-10  rounded-md"
    />
  )
}

function Durations() {
  return (
    <div className="space-y-4">
      <Heading level={3}>Durations (Material 3)</Heading>
      {Object.entries(duration).map(([label, d]) => (
        <div key={label} className="flex items-center gap-4">
          <Muted className="w-32">
            {label} ({d}s)
          </Muted>
          <Box delay={d} transition={{ duration: d, ease: 'easeOut' }} />
        </div>
      ))}
    </div>
  )
}

function Easings() {
  return (
    <div className="space-y-4">
      <Heading level={3}>Eases (cubic-bezier)</Heading>
      {Object.entries(ease).map(([label, curve]) => (
        <div key={label} className="flex items-center gap-4">
          <Muted className="w-48">{label}</Muted>
          <Box delay={0} transition={{ duration: 0.5, ease: [...curve] }} />
        </div>
      ))}
    </div>
  )
}

function Springs() {
  return (
    <div className="space-y-4">
      <Heading level={3}>Springs (physics)</Heading>
      {Object.entries(spring).map(([label, cfg]) => (
        <div key={label} className="flex items-center gap-4">
          <Muted className="w-32">{label}</Muted>
          <Box delay={0} transition={cfg} />
        </div>
      ))}
    </div>
  )
}

function AllPresets() {
  return (
    <div className="space-y-8">
      <Durations />
      <Easings />
      <Springs />
    </div>
  )
}

const meta = {
  title: 'Design Tokens/Motion presets',
  component: AllPresets,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AllPresets>

export default meta
type Story = StoryObj<typeof meta>

export const Catalog: Story = {}
