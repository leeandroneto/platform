// RESEARCH: copy literal vercel/chatbot Apache-2.0 (lib/types.ts) + adapt Sprint 1.3 E.3a+E.4-pre.3
//
// E.4-pre.3 cravado (Q4): ChatTools agora referencia NOSSOS tools kind-agnostic
// (ADR-0050 §D4) — createContent / editContent / updateContent / requestSuggestions.
// NOMES NOSSOS (não fork-style createDocument/etc) — preserva OPÇÃO A registry pattern.
//
// TODO 1.3-D: re-importar ArtifactKind de @/components/vendor/chat/artifact (existira em 1.3-D
// pos copy literal artifact*.tsx)
// TODO 1.3-D: Suggestion vira import direto de @/lib/contracts/database

import type { InferUITool, UIMessage } from 'ai'
import { z } from 'zod'

import type { createContentTool } from '@/lib/ai/tools/create-content'
import type { createDocumentTool } from '@/lib/ai/tools/create-document'
import type { editContentTool } from '@/lib/ai/tools/edit-content'
import type { requestSuggestionsTool } from '@/lib/ai/tools/request-suggestions'
import type { updateContentTool } from '@/lib/ai/tools/update-content'
import type { updateDocumentTool } from '@/lib/ai/tools/update-document'
import type { Suggestion } from '@/lib/types/chat-db'

// TODO 1.3-D: replace por type literal de components/chat/artifact.tsx (artifactDefinitions[number]['kind'])
// I40 (plano fork-vercel-chatbot §3.10): kinds preservados text/code/image/sheet + form (Sprint 2)
// Sprint 1.4.C: adicionado 'mermaid' + 'chart' + 'mindmap' + 'html' + 'pdf' + 'docx' + 'xlsx' + 'pptx'.
// Total Universe B: 12 kinds (8 visuais/edit inline + 4 export documentos).
export type ArtifactKind =
  | 'text'
  | 'code'
  | 'image'
  | 'sheet'
  | 'mermaid'
  | 'chart'
  | 'mindmap'
  | 'html'
  | 'pdf'
  | 'docx'
  | 'xlsx'
  | 'pptx'

export const messageMetadataSchema = z.object({
  createdAt: z.string(),
})

export type MessageMetadata = z.infer<typeof messageMetadataSchema>

// ChatTools — 2 universos coexistentes (ADR-0063):
//
// Universe A — content engine ADR-0050 (product features publishable):
//   - createContent  (cria form/page/report kind-agnostic) ← fork: createDocument
//   - editContent    (edit cirurgico via JSON Patch RFC 6902) ← fork: nao tem equivalente
//   - updateContent  (rewrite completo via IA) ← fork: updateDocument
//   - requestSuggestions (sugestoes IA kind-agnostic) ← fork: requestSuggestions
//
// Universe B — artifacts fork (scratchpad chat tools):
//   - createDocument (cria text/code/sheet) ← copy literal fork
//   - updateDocument (rewrite text/code/sheet) ← copy literal fork
export type ChatTools = {
  createContent: InferUITool<ReturnType<typeof createContentTool>>
  editContent: InferUITool<ReturnType<typeof editContentTool>>
  updateContent: InferUITool<ReturnType<typeof updateContentTool>>
  requestSuggestions: InferUITool<ReturnType<typeof requestSuggestionsTool>>
  createDocument: InferUITool<ReturnType<typeof createDocumentTool>>
  updateDocument: InferUITool<ReturnType<typeof updateDocumentTool>>
}

export type CustomUIDataTypes = {
  textDelta: string
  imageDelta: string
  sheetDelta: string
  codeDelta: string
  mermaidDelta: string
  chartDelta: string
  mindmapDelta: string
  htmlDelta: string
  pdfDelta: string
  docxDelta: string
  xlsxDelta: string
  pptxDelta: string
  suggestion: Suggestion
  appendMessage: string
  id: string
  title: string
  kind: ArtifactKind
  clear: null
  finish: null
  'chat-title': string
}

export type ChatMessage = UIMessage<MessageMetadata, CustomUIDataTypes, ChatTools>

export type Attachment = {
  name: string
  url: string
  contentType: string
}
