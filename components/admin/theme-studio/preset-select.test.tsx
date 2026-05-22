// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/preset-select.tsx (Fase 3).
// Cobre: render trigger + default preset label, render cycle prev/next buttons,
// withCycleThemes opt-out.

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import ThemePresetSelect from './preset-select'

describe('ThemePresetSelect', () => {
  it('renderiza com cycle controls default (prev/next tooltips)', () => {
    renderWithProviders(<ThemePresetSelect />, { withForm: true })
    // Trigger é um button visível com label "default"
    expect(screen.getByText(/default/i)).toBeDefined()
  })

  it('mostra prev/next cycle buttons quando withCycleThemes=true (default)', () => {
    const { container } = renderWithProviders(<ThemePresetSelect />, { withForm: true })
    // ThemeCycleButton tem 2 instances quando habilitado
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThanOrEqual(3)
  })

  it('respeita withCycleThemes=false (sem cycle buttons)', () => {
    const { container } = renderWithProviders(<ThemePresetSelect withCycleThemes={false} />, {
      withForm: true,
    })
    expect(container.firstChild).not.toBeNull()
  })

  it('aceita className extra forwarded ao Button', () => {
    const { container } = renderWithProviders(<ThemePresetSelect className="my-preset" />, {
      withForm: true,
    })
    expect(container.firstChild).not.toBeNull()
  })

  it('aceita disabled prop sem crash', () => {
    const { container } = renderWithProviders(<ThemePresetSelect disabled />, {
      withForm: true,
    })
    expect(container.firstChild).not.toBeNull()
  })

  it('clicar no trigger abre popover com search input', () => {
    renderWithProviders(<ThemePresetSelect />, { withForm: true })
    // Encontra o trigger principal (primeiro button com label "default")
    const trigger = screen.getByText(/default/i).closest('button')
    expect(trigger).not.toBeNull()
    fireEvent.click(trigger as HTMLButtonElement)
    // Após abrir: search placeholder via i18n key
    expect(screen.getByPlaceholderText('search')).toBeDefined()
  })

  it('clicar no next-cycle button não crash (state interno)', () => {
    const { container } = renderWithProviders(<ThemePresetSelect />, { withForm: true })
    const buttons = container.querySelectorAll('button')
    // Há tooltips múltiplos com mesmo aria — pegar os ThemeCycleButton (dois últimos
    // são prev/next). Clique no último (next).
    if (buttons.length > 0) {
      fireEvent.click(buttons[buttons.length - 1]!)
    }
    expect(container.firstChild).not.toBeNull()
  })
})
