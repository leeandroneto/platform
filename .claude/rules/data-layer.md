## `lib/data/*` patterns

Toda função em `lib/data/**`:

1. **`import 'server-only'` no topo** — obriga server-side
2. Recebe `client: SupabaseClient` como primeiro parâmetro
3. **Lança erro** em vez de retornar `Result`
4. Sem React imports
5. Sem mutações sem `SECURITY DEFINER` RPC quando cross-table

```ts
// lib/data/leads.ts
import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { LeadSchema, type Lead } from "@/lib/contracts/lead";

export async function getLeadById(
  client: SupabaseClient,
  id: string,
): Promise<Lead> {
  const { data, error } = await client
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw new Error(`Failed to fetch lead: ${error.message}`);
  return LeadSchema.parse(data);
}

export async function listLeadsForTenant(
  client: SupabaseClient,
  tenantId: string,
): Promise<Lead[]> {
  const { data, error } = await client
    .from("leads")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Failed to list leads: ${error.message}`);
  return data.map((d) => LeadSchema.parse(d));
}
```

## Server Action traduz Result

```ts
// app/(painel)/dashboard/leads/actions.ts
"use server";

import { createServerClient } from "@/lib/supabase/server";
import { listLeadsForTenant } from "@/lib/data/leads";
import { ok, fail } from "@/lib/contracts/result";

export async function listLeadsAction() {
  try {
    const client = createServerClient();
    const session = await client.auth.getSession();
    const tenantId = session.data.session?.user.app_metadata.tenant_id;
    if (!tenantId)
      return fail({ key: "auth.unauthorized", fallback: "Unauthorized" });

    const leads = await listLeadsForTenant(client, tenantId);
    return ok(leads);
  } catch (error) {
    return fail({
      key: "leads.fetch_failed",
      fallback: "Failed to fetch leads",
    });
  }
}
```

## RLS é a fronteira

Toda tabela tem RLS. Filtro por JWT direto:

```sql
CREATE POLICY tenant_isolation ON public.leads
  FOR ALL
  USING (tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid);
```

## Migrations via MCP

NUNCA `.sql` manual em `supabase/migrations/`. Sempre:

```
mcp__plugin_supabase_supabase__apply_migration({
  project_id, name: 'snake_case_name', query: '<SQL>'
})
```

Pós cada migration:

```
mcp__plugin_supabase_supabase__get_advisors({ project_id, type: 'security' })
```

Zero novos warnings.
