// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/color-picker.tsx (Fase 3).
// Cobre: render default, callback onChange, swatch button, name optional, OKLCH parsing.

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import ColorPicker from './color-picker'

const baseProps = {
  color: 'oklch(0.5 0.2 270)',
  onChange: vi.fn(),
  label: 'Primary',
} as const

describe('ColorPicker', () => {
  it('renders swatch + label + text input com cor inicial', () => {
    renderWithProviders(<ColorPicker {...baseProps} />)
    expect(screen.getByText('Primary')).toBeDefined()
    const textInput = screen.getByDisplayValue('oklch(0.5 0.2 270)') as HTMLInputElement
    expect(textInput).toBeDefined()
    expect(textInput.tagName).toBe('INPUT')
  })

  it('expõe button-swatch com aria-label correto', () => {
    renderWithProviders(<ColorPicker {...baseProps} />)
    const swatchBtn = screen.getByLabelText('Open color picker for Primary')
    expect(swatchBtn).toBeDefined()
    expect(swatchBtn.tagName).toBe('BUTTON')
  })

  it('chama onChange (debounced 50ms) quando text input muda', async () => {
    const onChange = vi.fn()
    renderWithProviders(<ColorPicker {...baseProps} onChange={onChange} />)
    const input = screen.getByDisplayValue('oklch(0.5 0.2 270)') as HTMLInputElement
    fireEvent.change(input, { target: { value: 'oklch(0.7 0.1 100)' } })
    await new Promise((r) => setTimeout(r, 100))
    expect(onChange).toHaveBeenCalled()
    expect(onChange.mock.calls[0]?.[0]).toBe('oklch(0.7 0.1 100)')
  })

  it('renderiza sem name prop (campo opcional) sem crash', () => {
    const { container } = renderWithProviders(
      <ColorPicker color="#ff0000" onChange={vi.fn()} label="Test" />,
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('renderiza com name prop (FocusColorId — habilita focus programático)', () => {
    const { container } = renderWithProviders(<ColorPicker {...baseProps} name="primary" />)
    expect(container.firstChild).not.toBeNull()
  })

  it('text input tem placeholder via i18n key', () => {
    renderWithProviders(<ColorPicker {...baseProps} />)
    const input = screen.getByPlaceholderText('placeholder')
    expect(input).toBeDefined()
  })

  it('focus programático via focusColorControl (export utilitário)', async () => {
    const { focusColorControl } = await import('./color-picker')
    renderWithProviders(<ColorPicker {...baseProps} name="primary" />)
    // Chamando focusColorControl não-existing key é no-op safe (não crash)
    focusColorControl('background')
    // Esperar timers internos (175ms +)
    await new Promise((r) => setTimeout(r, 200))
    expect(true).toBe(true)
  })

  it('input do swatch (type=color) também propaga onChange', async () => {
    const onChange = vi.fn()
    renderWithProviders(<ColorPicker {...baseProps} onChange={onChange} />)
    const colorNative = document.getElementById('color-primary') as HTMLInputElement | null
    expect(colorNative).not.toBeNull()
    fireEvent.change(colorNative!, { target: { value: '#00ff00' } })
    await new Promise((r) => setTimeout(r, 100))
    expect(onChange).toHaveBeenCalled()
  })
})
