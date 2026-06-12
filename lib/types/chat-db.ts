// RESEARCH: copy literal vercel/chatbot Apache-2.0 (lib/db/schema.ts type signatures) + adapt Drizzle->Supabase
//
// Sprint 1.3-D.1 (2026-05-26 noite): migration 0031 aplicada — stubs removidos.
// Todos os tipos agora re-exportam direto de `lib/contracts/database.ts`
// (gerado via `mcp__plugin_supabase_supabase__generate_typescript_types`).
//
// Naming convention: snake_case (segue Postgres + Supabase). Componentes do
// fork que esperavam camelCase (`isUpvoted`, `documentId`, etc) devem ser
// adaptados nos call sites (Sprint 1.3-D.3).

import type { Database } from '@/lib/contracts/database'

// chats + messages (migration 0030 Sprint 1.3 E.1)
export type Chat = Database['public']['Tables']['chats']['Row']
export type DBMessage = Database['public']['Tables']['messages']['Row']

// votes + documents + suggestions + streams (migration 0031 Sprint 1.3-D.1)
export type Vote = Database['public']['Tables']['votes']['Row']
export type Document = Database['public']['Tables']['documents']['Row']
export type DocumentVersion = Database['public']['Tables']['document_versions']['Row']
export type Suggestion = Database['public']['Tables']['suggestions']['Row']
export type Stream = Database['public']['Tables']['streams']['Row']

// Enum
export type DocumentKind = Database['public']['Enums']['document_kind']
