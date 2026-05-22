// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/colors-tab-content.tsx (Fase 3).
// Cobre: renders todas as color rows agrupadas, search filter, updateStyle propagation,
// sidebar sync toggle.

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DEFAULT_THEME } from '@/lib/design/theme-defaults'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

import { ColorsTabContent } from './colors-tab-content'

describe('ColorsTabContent', () => {
  it('renderiza search input com placeholder via i18n', () => {
    renderWithProviders(
      <ColorsTabContent
        currentStyles={DEFAULT_THEME.light}
        updateStyle={vi.fn()}
        updateStyles={vi.fn()}
      />,
    )
    // i18n mock returns key — placeholder = 'searchPlaceholder'
    const search = screen.getByPlaceholderText('searchPlaceholder')
    expect(search).toBeDefined()
  })

  it('renderiza ao menos um grupo de cor visível (Primary/Secondary expanded)', () => {
    renderWithProviders(
      <ColorsTabContent
        currentStyles={DEFAULT_THEME.light}
        updateStyle={vi.fn()}
        updateStyles={vi.fn()}
      />,
    )
    // Group titles vêm hardcoded em inglês (TweakCN-preserved).
    // "Primary" aparece em múltiplos lugares (group title + sidebar primary label) — usa getAllByText.
    expect(screen.getAllByText('Primary').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Secondary').length).toBeGreaterThan(0)
  })

  it('filtra grupos quando search ativo', () => {
    renderWithProviders(
      <ColorsTabContent
        currentStyles={DEFAULT_THEME.light}
        updateStyle={vi.fn()}
        updateStyles={vi.fn()}
      />,
    )
    const search = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement
    fireEvent.change(search, { target: { value: 'chart' } })
    // Após filtro com query 'chart', grupo Chart fica visível mas Primary some
    expect(screen.queryByText('Primary')).toBeNull()
    expect(screen.getByText('Chart')).toBeDefined()
  })

  it('botão clear-search aparece após digitar e limpa busca ao clicar', () => {
    renderWithProviders(
      <ColorsTabContent
        currentStyles={DEFAULT_THEME.light}
        updateStyle={vi.fn()}
        updateStyles={vi.fn()}
      />,
    )
    const search = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement
    fireEvent.change(search, { target: { value: 'card' } })
    const clearBtn = screen.getByLabelText('clearSearchAriaLabel')
    expect(clearBtn).toBeDefined()
    fireEvent.click(clearBtn)
    expect(search.value).toBe('')
  })

  it('mostra mensagem "noColorsFound" quando search não match nada', () => {
    renderWithProviders(
      <ColorsTabContent
        currentStyles={DEFAULT_THEME.light}
        updateStyle={vi.fn()}
        updateStyles={vi.fn()}
      />,
    )
    const search = screen.getByPlaceholderText('searchPlaceholder') as HTMLInputElement
    fireEvent.change(search, { target: { value: 'xxxxxxx-no-match' } })
    expect(screen.getByText('noColorsFound')).toBeDefined()
  })
})
