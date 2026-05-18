// features/_template/data.ts
// IO Supabase. Camada Data (ADR `data-layer.md`).
// Padrão: function(client, ...args). Lança erro. Zero React/JSX.
//
// NOTA: _template é REFERÊNCIA — tabela `_template_table` não existe em
// public.*. Ao copiar pra feature real, substitua pelo nome da tabela.

import 'server-only'

import type { SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/lib/contracts/database'

import type { Template, TemplateInput, TemplateRow } from './contracts'

type Client = SupabaseClient<Database>

function fromRow(row: TemplateRow): Template {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    exampleField: row.example_field,
    createdAt: new Date(row.created_at),
  }
}

/**
 * Lista entries da feature pra um tenant.
 * Substitua `'_template_table'` pelo nome real da tabela em public.*.
 */
export async function listTemplates(_client: Client, _tenantId: string): Promise<Template[]> {
  // const { data, error } = await _client
  //   .from('<sua_tabela>')
  //   .select('id, tenant_id, example_field, created_at, updated_at')
  //   .eq('tenant_id', _tenantId)
  //   .order('created_at', { ascending: false })
  // if (error) throw error
  // return (data as TemplateRow[]).map(fromRow)
  return [] // ← placeholder, descomente acima na feature real
}

/**
 * Cria entry da feature.
 * Substitua `'_template_table'` pelo nome real da tabela em public.*.
 */
export async function createTemplate(
  _client: Client,
  _tenantId: string,
  _input: TemplateInput,
): Promise<Template> {
  // const { data, error } = await _client
  //   .from('<sua_tabela>')
  //   .insert({ tenant_id: _tenantId, example_field: _input.exampleField })
  //   .select('id, tenant_id, example_field, created_at, updated_at')
  //   .single()
  // if (error) throw error
  // return fromRow(data as TemplateRow)
  return fromRow({
    id: '00000000-0000-0000-0000-000000000000',
    tenant_id: _tenantId,
    example_field: _input.exampleField,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })
}
