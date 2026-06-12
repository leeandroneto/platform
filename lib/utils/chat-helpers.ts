// RESEARCH: copy literal vercel/chatbot Apache-2.0 (lib/utils.ts) + adapt Drizzle->Supabase types (Sprint 1.3 E.3a)
// TODO 1.3-B/D: substituir imports stub @/lib/types/chat-db por @/lib/contracts/database direto pos migration 0031.

import type { UIMessage, UIMessagePart } from 'ai'
import { formatISO } from 'date-fns'

import { ChatbotError, type ErrorCode } from '@/lib/errors/chatbot'
import type { ChatMessage, ChatTools, CustomUIDataTypes } from '@/lib/types/chat'
import type { DBMessage, Document } from '@/lib/types/chat-db'

// NOTA: `cn` ja existe em @/lib/utils.ts — nao re-exportar aqui. Use direto.

export const fetcher = async (url: string) => {
  const response = await fetch(url)

  if (!response.ok) {
    const { code, cause } = await response.json()
    throw new ChatbotError(code as ErrorCode, cause)
  }

  return response.json()
}

export async function fetchWithErrorHandlers(input: RequestInfo | URL, init?: RequestInit) {
  try {
    const response = await fetch(input, init)

    if (!response.ok) {
      const { code, cause } = await response.json()
      throw new ChatbotError(code as ErrorCode, cause)
    }

    return response
  } catch (error: unknown) {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      throw new ChatbotError('offline:chat')
    }

    throw error
  }
}

export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getDocumentTimestampByIndex(documents: Document[], index: number) {
  if (!documents) {
    return new Date()
  }
  if (index > documents.length) {
    return new Date()
  }

  // Sprint 1.3-D.1: schema snake_case (migration 0031). created_at é ISO string,
  // converte pra Date pra preservar contrato externo (return type).
  const ts = documents[index]?.created_at
  return ts ? new Date(ts) : new Date()
}

export function sanitizeText(text: string) {
  return text.replace('<has_function_call>', '')
}

export function convertToUIMessages(messages: DBMessage[]): ChatMessage[] {
  return messages.map((message) => ({
    id: message.id,
    role: message.role as 'user' | 'assistant' | 'system',
    // TODO 1.3-D: messages.parts/attachments sao JSONB no DB Supabase — confirmar cast em 1.3-D
    parts: message.parts as unknown as UIMessagePart<CustomUIDataTypes, ChatTools>[],
    metadata: {
      // TODO 1.3-D: DB schema usa created_at (snake_case); ajustar quando substituir DBMessage stub
      createdAt: formatISO(new Date((message as unknown as { created_at: string }).created_at)),
    },
  }))
}

export function getTextFromMessage(message: ChatMessage | UIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part as { type: 'text'; text: string }).text)
    .join('')
}
