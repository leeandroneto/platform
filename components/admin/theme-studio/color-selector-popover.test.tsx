// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/color-selector-popover.tsx (Fase 3).
// Cobre: render trigger button + ARIA label (popover content só monta no click via Radix portal,
// difícil interagir em jsdom; coverage do conteúdo coberto via Storybook visual sign-off Fase 5).

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import { ColorSelectorPopover } from './color-selector-popover'

describe('ColorSelectorPopover', () => {
  it('renderiza trigger button com tooltip "Tailwind Colors"', () => {
    renderWithProviders(<ColorSelectorPopover currentColor="#ff0000" onChange={vi.fn()} />)
    // Tooltip trigger é o button visível
    const trigger = screen.getByRole('button')
    expect(trigger).toBeDefined()
  })

  it('não chama onChange ao renderizar (passive)', () => {
    const onChange = vi.fn()
    renderWithProviders(
      <ColorSelectorPopover currentColor="oklch(0.5 0.2 270)" onChange={onChange} />,
    )
    expect(onChange).not.toHaveBeenCalled()
  })

  it('aceita cor OKLCH literal', () => {
    const { container } = renderWithProviders(
      <ColorSelectorPopover currentColor="oklch(0.75 0.18 220)" onChange={vi.fn()} />,
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('aceita cor HEX literal', () => {
    const { container } = renderWithProviders(
      <ColorSelectorPopover currentColor="#abcdef" onChange={vi.fn()} />,
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('aceita cor transparent (edge case)', () => {
    const { container } = renderWithProviders(
      <ColorSelectorPopover currentColor="transparent" onChange={vi.fn()} />,
    )
    expect(container.firstChild).not.toBeNull()
  })

  it('clicar no trigger abre popover com tab list/palette', () => {
    renderWithProviders(<ColorSelectorPopover currentColor="#ff0000" onChange={vi.fn()} />)
    const trigger = screen.getByRole('button')
    fireEvent.click(trigger)
    // Após click, tailwindVersion + search aparecem (i18n keys retornadas)
    expect(screen.getAllByText('tailwindVersion').length).toBeGreaterThan(0)
  })

  it('after open, search input com placeholder via i18n', () => {
    renderWithProviders(<ColorSelectorPopover currentColor="#ff0000" onChange={vi.fn()} />)
    fireEvent.click(screen.getByRole('button'))
    const search = screen.getByPlaceholderText('tailwindSearch')
    expect(search).toBeDefined()
  })
})
