// features/_template/index.ts
// Public API da feature. Única coisa que outras features podem importar
// (Sheriff bloqueia cross-feature import fora do index — ADR-0034 §2).
//
// Re-export do plan-gates é OBRIGATÓRIO (ESLint rule plan-gates-required).

export { TemplateCard } from './components/TemplateCard'
export type { Template, TemplateInput } from './contracts'
export { createHandler, listHandler } from './handlers'
export { useTemplates } from './hooks'
export { templateGate } from './plan-gates'
