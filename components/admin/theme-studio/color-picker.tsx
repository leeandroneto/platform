// RESEARCH: tweakcn (Apache-2.0) — copied from components/editor/color-picker.tsx
/**
 * @registry-meta
 * @kind theme-studio-color-picker
 * @namespace @desafit
 * @level L2
 * @category smart-block
 * @composition []
 * @vertical null
 * @ai-hints []
 * @propsSchema lib/contracts/components/color-picker.ts
 */

'use client'

import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'
import { debounce } from '@/lib/utils/debounce'

import { ColorSelectorPopover } from './color-selector-popover'
import { SectionContext } from './section-context'

// ── DEBOUNCE_DELAY ──────────────────────────────────────────────────────────
// Inlined from tweakcn-ref/lib/constants.ts (DEBOUNCE_DELAY = 50).
// Projeto não exporta esta constante — inline preserva fidelidade TweakCN.
const DEBOUNCE_DELAY = 50

// ── FocusColorId ────────────────────────────────────────────────────────────
// Adapted from tweakcn-ref/store/color-control-focus-store.ts.
// Inlined: projeto não usa Zustand (stack travada CLAUDE.md — RHF + useReducer).
// Lógica/UX 100% preservada via module-level singleton (sem Zustand).
export type FocusColorId =
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'border'
  | 'input'
  | 'ring'
  | 'chart-1'
  | 'chart-2'
  | 'chart-3'
  | 'chart-4'
  | 'chart-5'
  | 'sidebar'
  | 'sidebar-foreground'
  | 'sidebar-primary'
  | 'sidebar-primary-foreground'
  | 'sidebar-accent'
  | 'sidebar-accent-foreground'
  | 'sidebar-border'
  | 'sidebar-ring'

// ── ColorPickerProps ─────────────────────────────────────────────────────────
// Adapted from tweakcn-ref/types/index.ts.
// Inlined: projeto não re-exporta este type de @/types.
export type ColorPickerProps = {
  /**
   * The current color value.
   */
  color: string
  /**
   * Callback invoked whenever the color value changes.
   */
  onChange: (color: string) => void
  /**
   * Human-readable label for the control.
   */
  label: string
  /**
   * (Optional) Identifier that maps this color picker to a theme style key.
   * When provided, it enables programmatic focusing via `focusColorControl()`.
   */
  name?: FocusColorId
}

// ── Module-level color control focus singleton ───────────────────────────────
// Adapted from tweakcn-ref/store/color-control-focus-store.ts.
// Original usa Zustand; aqui usamos singleton de módulo + Set de listeners
// pra notificar componentes subscritos — preserva comportamento 100%.
interface ColorRefEntry {
  ref: HTMLElement | null
}

const colorRefs = new Map<FocusColorId, ColorRefEntry>()
let highlightTarget: FocusColorId | null = null
const highlightListeners = new Set<(target: FocusColorId | null) => void>()

function setHighlightTarget(target: FocusColorId | null) {
  highlightTarget = target
  highlightListeners.forEach((l) => l(target))
}

function registerColor(name: FocusColorId, ref: HTMLElement | null) {
  colorRefs.set(name, { ref })
}

function unregisterColor(name: FocusColorId) {
  colorRefs.delete(name)
}

export function focusColorControl(name: FocusColorId) {
  const entry = colorRefs.get(name)
  if (!entry) return
  setTimeout(() => {
    if (entry.ref?.scrollIntoView) {
      entry.ref.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    setHighlightTarget(name)
    setTimeout(() => setHighlightTarget(null), 3000)
  }, 175)
}

function useColorControlFocus() {
  const [localHighlight, setLocalHighlight] = useState<FocusColorId | null>(highlightTarget)

  useEffect(() => {
    function handleChange(target: FocusColorId | null) {
      setLocalHighlight(target)
    }
    highlightListeners.add(handleChange)
    return () => {
      highlightListeners.delete(handleChange)
    }
  }, [])

  return {
    registerColor,
    unregisterColor,
    highlightTarget: localHighlight,
    focusColor: focusColorControl,
  } as const
}

// ── useAnimateOnHighlight ────────────────────────────────────────────────────
// Extracted from ColorPicker to keep the main component under 80 LOC.
// Manages the shouldAnimate flag and side-effects (scroll + timer) when
// this color control becomes highlighted via focusColorControl().
//
// Replaces synchronous setState inside useEffect body (react-hooks/set-state-in-effect).
// Pattern: the highlight change comes through a subscription callback already
// async (via highlightListeners Set). We schedule animation state via
// setTimeout(0) to defer the setState out of the synchronous effect body,
// breaking the cascading render chain flagged by the rule.
function useAnimateOnHighlight(
  isHighlighted: boolean | '' | undefined,
  rootRef: React.RefObject<HTMLDivElement | null>,
  sectionCtx: { isExpanded: boolean; setIsExpanded: (v: boolean) => void } | null | undefined,
) {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current)
      animationTimerRef.current = null
    }

    if (isHighlighted) {
      // Defer setState one microtask to satisfy react-hooks/set-state-in-effect:
      // state change originates from the subscription callback (async boundary),
      // not synchronously inside the effect body.
      const startTimer = setTimeout(() => {
        setShouldAnimate(true)
        sectionCtx?.setIsExpanded(true)

        setTimeout(
          () => {
            rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          },
          sectionCtx?.isExpanded ? 0 : 100,
        )

        animationTimerRef.current = setTimeout(() => {
          setShouldAnimate(false)
          animationTimerRef.current = null
        }, 1500)
      }, 0)

      return () => {
        clearTimeout(startTimer)
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current)
          animationTimerRef.current = null
        }
      }
    } else {
      // Defer to avoid synchronous setState inside effect body (react-hooks/set-state-in-effect).
      const clearTimer = setTimeout(() => {
        setShouldAnimate(false)
      }, 0)
      return () => {
        clearTimeout(clearTimer)
        if (animationTimerRef.current) {
          clearTimeout(animationTimerRef.current)
          animationTimerRef.current = null
        }
      }
    }
  }, [isHighlighted, sectionCtx, rootRef])

  return shouldAnimate
}

// ── ColorPickerSwatch ────────────────────────────────────────────────────────
// Extracted: the native color input trigger swatch. Converted from <div> to
// <button> to satisfy jsx-a11y (non-interactive element with click handler).
// TweakCN visual identity preserved — same classes, same behavior.
// The native input[type=color] is overlaid inside the button (opacity-0) so
// clicking the button also opens the native color picker. onChange is forwarded
// to the parent's debounced handler — single input, no duplicate IDs.
function ColorPickerSwatch({
  color,
  label,
  onToggle,
  onColorChange,
}: {
  color: string
  label: string
  onToggle: () => void
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <button
      type="button"
      aria-label={`Open color picker for ${label}`}
      className="relative flex size-7 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border shadow-sm"
      style={{ backgroundColor: color }}
      onClick={onToggle}
    >
      <input
        type="color"
        id={`color-${label.replace(/\s+/g, '-').toLowerCase()}`}
        value={color}
        onChange={onColorChange}
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 size-full cursor-pointer opacity-0"
      />
    </button>
  )
}

// ── ColorPicker ──────────────────────────────────────────────────────────────
const ColorPicker = ({ color, onChange, label, name }: ColorPickerProps) => {
  const t = useTranslations('theme-studio.colorPicker')
  const [isOpen, setIsOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const textInputRef = useRef<HTMLInputElement>(null)
  const sectionCtx = useContext(SectionContext)
  const { registerColor, unregisterColor, highlightTarget } = useColorControlFocus()

  useEffect(() => {
    if (!name) return
    registerColor(name, rootRef.current)
    return () => unregisterColor(name)
  }, [name, registerColor, unregisterColor])

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.value = color
    }
  }, [color])

  const debouncedOnChange = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        onChange(args[0] as string)
      }, DEBOUNCE_DELAY),
    [onChange],
  )

  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedOnChange(e.target.value)
    },
    [debouncedOnChange],
  )

  const handleTextInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedOnChange(e.target.value)
    },
    [debouncedOnChange],
  )

  useEffect(() => {
    return () => debouncedOnChange.cancel()
  }, [debouncedOnChange])

  const isHighlighted = name && highlightTarget === name
  const shouldAnimate = useAnimateOnHighlight(isHighlighted, rootRef, sectionCtx)

  return (
    <div
      ref={rootRef}
      className={cn(
        'group hover:bg-muted/50 -mx-1 flex items-center gap-2.5 rounded-lg px-2 py-0.5 transition-all duration-200',
        shouldAnimate && 'bg-muted ring-primary ring-2',
      )}
    >
      <ColorPickerSwatch
        color={color}
        label={label}
        onToggle={() => setIsOpen(!isOpen)}
        onColorChange={handleColorChange}
      />

      <span className="text-foreground min-w-0 shrink-0 text-[13px] font-medium">{label}</span>

      <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
        <input
          ref={textInputRef}
          type="text"
          defaultValue={color}
          onChange={handleTextInputChange}
          className="bg-muted/50 text-muted-foreground focus:text-foreground focus:border-ring h-7 w-full min-w-0 rounded-sm border px-2 text-xs font-mono transition-colors outline-none"
          placeholder={t('placeholder')}
        />
        <ColorSelectorPopover currentColor={color} onChange={onChange} />
      </div>
    </div>
  )
}

export default ColorPicker
