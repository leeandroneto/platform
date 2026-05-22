// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/shadow-control.tsx (Fase 3).
// Cobre: 6 primitive sliders (color/opacity/blur/spread/offsetX/offsetY) render,
// onChange propagation, controlled value display.

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import ShadowControl from './shadow-control'

const baseProps = {
  shadowColor: 'oklch(0 0 0)',
  shadowOpacity: 0.1,
  shadowBlur: 3,
  shadowSpread: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 1,
  onChange: vi.fn(),
} as const

describe('ShadowControl', () => {
  it('renderiza 6 sliders (Color via ColorPicker label + 5 SliderWithInput labels)', () => {
    renderWithProviders(<ShadowControl {...baseProps} />)
    expect(screen.getByText('Color')).toBeDefined()
    expect(screen.getByText('Opacity')).toBeDefined()
    expect(screen.getByText('Blur')).toBeDefined()
    expect(screen.getByText('Spread')).toBeDefined()
    expect(screen.getByText('Offset X')).toBeDefined()
    expect(screen.getByText('Offset Y')).toBeDefined()
  })

  it('onChange é chamado quando text input do ColorPicker (shadow-color) muda', async () => {
    const onChange = vi.fn()
    renderWithProviders(<ShadowControl {...baseProps} onChange={onChange} />)
    const colorInput = screen.getByDisplayValue('oklch(0 0 0)') as HTMLInputElement
    fireEvent.change(colorInput, { target: { value: 'oklch(0.5 0 0)' } })
    await new Promise((r) => setTimeout(r, 100))
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[0]?.[0]).toBe('shadow-color')
  })

  it('aceita opacity boundary 0 (mínimo)', () => {
    const { container } = renderWithProviders(<ShadowControl {...baseProps} shadowOpacity={0} />)
    expect(container.firstChild).not.toBeNull()
  })

  it('aceita opacity boundary 1 (máximo)', () => {
    const { container } = renderWithProviders(<ShadowControl {...baseProps} shadowOpacity={1} />)
    expect(container.firstChild).not.toBeNull()
  })

  it('aceita offsetX/Y negativos (range -50..50)', () => {
    const { container } = renderWithProviders(
      <ShadowControl {...baseProps} shadowOffsetX={-25} shadowOffsetY={-25} />,
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('aceita blur/spread máximos (50)', () => {
    const { container } = renderWithProviders(
      <ShadowControl {...baseProps} shadowBlur={50} shadowSpread={50} />,
    )
    expect(container.firstChild).not.toBeNull()
  })
})
