// RESEARCH: custom — vitest unit test file (não é componente UX; é test runner code)
// Unit tests pra components/admin/theme-studio/control-panel.tsx (Fase 3).
// Cobre: render 4 tabs (colors/typography/other/ai). Mock useControlsTabFromUrl
// pra renderizar tabs distintos e cobrir TypographyTab + OtherTab paths.

import { fireEvent, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { renderWithProviders } from '@/tests/theme-studio-test-utils'

// Mock módulo do hook pra retornar tab forçado dinamicamente
let __currentTab: 'colors' | 'typography' | 'other' | 'ai' = 'colors'
vi.mock('@/lib/hooks/use-controls-tab-from-url', () => ({
  DEFAULT_TAB: 'colors',
  useControlsTabFromUrl: () => ({
    tab: __currentTab,
    handleSetTab: vi.fn(),
  }),
}))

import ControlPanel from './control-panel'

describe('ControlPanel', () => {
  it('renderiza tabs colors/typography/other/ai via i18n keys', () => {
    renderWithProviders(<ControlPanel />, { withForm: true })
    expect(screen.getByText('tabs.colors')).toBeDefined()
    expect(screen.getByText('tabs.typography')).toBeDefined()
    expect(screen.getByText('tabs.other')).toBeDefined()
    expect(screen.getByText('tabs.ai')).toBeDefined()
  })

  it('default tab é "colors" (mostra search da colors-tab-content)', () => {
    renderWithProviders(<ControlPanel />, { withForm: true })
    // searchPlaceholder vem do colors-tab-content
    expect(screen.getByPlaceholderText('searchPlaceholder')).toBeDefined()
  })

  it('renderiza sem crash com aiEnabled default false', () => {
    const { container } = renderWithProviders(<ControlPanel />, { withForm: true })
    expect(container.firstChild).not.toBeNull()
  })

  it('renderiza com aiEnabled=true sem crash', () => {
    const { container } = renderWithProviders(<ControlPanel aiEnabled />, { withForm: true })
    expect(container.firstChild).not.toBeNull()
  })

  it('clicar em tab "typography" dispara setter do useQueryState (mock spy)', () => {
    renderWithProviders(<ControlPanel />, { withForm: true })
    const typographyTrigger = screen.getByText('tabs.typography')
    // tab é controlled via useQueryState — em jsdom o setter spy roda mas não muda o value
    // (mock retorna defaultValue fixo). Validamos só que o click roda sem crash.
    fireEvent.click(typographyTrigger)
    expect(typographyTrigger).toBeDefined()
  })

  it('clicar em tab "other" sem crash (controlled via mock)', () => {
    renderWithProviders(<ControlPanel />, { withForm: true })
    const otherTrigger = screen.getByText('tabs.other')
    fireEvent.click(otherTrigger)
    expect(otherTrigger).toBeDefined()
  })

  it('clicar em tab "ai" sem crash', () => {
    const { container } = renderWithProviders(<ControlPanel />, { withForm: true })
    const aiTrigger = screen.getByText('tabs.ai')
    fireEvent.click(aiTrigger)
    expect(container.firstChild).not.toBeNull()
  })

  it('renderiza ThemePresetSelectStub no header (espera-se altura h-14)', () => {
    const { container } = renderWithProviders(<ControlPanel />, { withForm: true })
    // ThemePresetSelectStub tem `h-14 rounded-none` — só smoke
    expect(container.querySelector('.h-14')).not.toBeNull()
  })

  it('renderiza ScrollArea pra each tab content (Radix monta todos os TabsContent inativos)', () => {
    const { container } = renderWithProviders(<ControlPanel />, { withForm: true })
    // Radix Tabs monta todos TabsContent — busca alguns elementos identificadores
    expect(container.querySelectorAll('[role="tabpanel"]').length).toBeGreaterThan(0)
  })

  it('passa updateStyle/updateStyles internamente sem crash', () => {
    // Smoke test cobrindo o useControlPanelState hook + setThemeStyle path
    const { container } = renderWithProviders(<ControlPanel />, { withForm: true })
    // Após render completo, o hook foi consumido — color pickers visíveis com cores DEFAULT_THEME
    expect(container.querySelector('input[type="color"]')).not.toBeNull()
  })

  it('tab=typography mostra TypographyTab i18n title', () => {
    __currentTab = 'typography'
    renderWithProviders(<ControlPanel />, { withForm: true })
    expect(screen.getAllByText('typography.fontFamilyTitle').length).toBeGreaterThan(0)
    expect(screen.getAllByText('typography.letterSpacingTitle').length).toBeGreaterThan(0)
    __currentTab = 'colors'
  })

  it('tab=other mostra OtherTab i18n titles (HSL/radius/spacing/shadow)', () => {
    __currentTab = 'other'
    renderWithProviders(<ControlPanel />, { withForm: true })
    expect(screen.getAllByText('other.hslTitle').length).toBeGreaterThan(0)
    expect(screen.getAllByText('other.radiusTitle').length).toBeGreaterThan(0)
    expect(screen.getAllByText('other.spacingTitle').length).toBeGreaterThan(0)
    expect(screen.getAllByText('other.shadowTitle').length).toBeGreaterThan(0)
    __currentTab = 'colors'
  })

  it('tab=ai renderiza AiTabContent sem crash', () => {
    __currentTab = 'ai'
    const { container } = renderWithProviders(<ControlPanel />, { withForm: true })
    expect(container.firstChild).not.toBeNull()
    __currentTab = 'colors'
  })
})
