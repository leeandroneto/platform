// RESEARCH: custom — stub placeholder, no shadcn/vendor equivalent for AI chat tab. Full chat-interface.tsx deferred Fase 6 (research-41 §3.3: streamText + tool calling). No vendor catalog covers this pattern.
// STUB Chunk 5 §4.7 — AI theme generation tab (DEFERRED Fase 6)
// See docs/_deferred/ai-theme-generation-detail.md

/**
 * @registry-meta
 * {
 *   "kind": "theme-studio-ai-tab-stub",
 *   "category": "primitive",
 *   "version": "0.1.0-stub",
 *   "description": "Placeholder for AI theme generation tab — full implementation deferred to Fase 6",
 *   "examples": [],
 *   "when_to_use": ["theme studio AI tab — stub until Fase 6 activates"],
 *   "anti_patterns": ["do not add real logic here — implement full chat-interface.tsx in Fase 6"],
 *   "related": ["theme-studio-control-panel"],
 *   "vertical": null
 * }
 */
'use client'

import { useTranslations } from 'next-intl'

export function AiTabContent() {
  const t = useTranslations('theme-studio.aiTab')
  return (
    <div className="flex h-full items-center justify-center p-6">
      <p className="text-muted-foreground text-center text-sm">{t('deferredMessage')}</p>
    </div>
  )
}
