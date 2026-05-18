# 0029. Template→Instance pattern unificado (pages, programs, forms, paletas)

Date: 2026-05-17
Status: accepted
Supersedes: 0028 (paletas: substitui `tenants.custom_primary_oklch` por clone pattern)

## Context

Inconsistência arquitetural: pages/programs seguem template→instance (template oficial em `public.*`, instância em `platform.*`). Paletas usavam hack (`custom_primary_oklch text null` em `platform.tenants`) — não escala se prof quer customizar secondary + surfaces + extras.

Fundador apontou inconsistência. Resolvido aplicando MESMO padrão pra paletas + formalizando regras pra todos os recursos.

Referência: `reference_template_hotmart_pattern` + `reference_master_spec_templates` + master plan §5.7 + D-G39 (templates oficiais via clone independente).

## Decision

### Pattern universal Template→Instance

**2 camadas separadas:**

| Camada                | Onde              | Pra que                        |
| --------------------- | ----------------- | ------------------------------ |
| **Template** (DNA)    | Pool reutilizável | Clonável N vezes               |
| **Instância** (cópia) | Vida própria      | O que prof realmente usa/edita |

Quando prof "usa template", sistema CLONA o DNA pra row nova. A partir daí, template e instância são independentes — edição numa NÃO afeta a outra.

### 3 escopos de template (resolve multi-marca + multi-tenant)

| Escopo               | Coluna                                                           | Quem vê                             |
| -------------------- | ---------------------------------------------------------------- | ----------------------------------- |
| **Oficial global**   | `is_official=true`, `brand_id=null`, `created_by_tenant_id=null` | Todos os tenants de todas as marcas |
| **Brand-restricted** | `brand_id=<x>`, `is_official=true`                               | Só tenants da brand X               |
| **Tenant-private**   | `created_by_tenant_id=<x>`, `is_official=false`                  | Só o tenant criador                 |

### Versionamento

**Templates oficiais:**

- `version int default 1`, `is_active bool`, `superseded_by_template_id uuid null`
- Mudança grande = nova row (`version=2`, antiga `is_active=false`) — preserva clones existentes
- Mudança pequena = mutate inplace (sem bump) — afeta só clones futuros

**Instâncias (pages, programs, forms):**

- `source_template_id uuid null FK` + `source_template_version int null`
- Snapshot por publish em `*_versions` table (`platform.page_versions`, etc) — rollback
- Edição posterior NÃO afeta template original

### Aplicação por recurso

| Recurso        | Template                                                        | Instância                                            | Versão snapshot          |
| -------------- | --------------------------------------------------------------- | ---------------------------------------------------- | ------------------------ |
| Landing page   | `public.page_templates`                                         | `platform.pages`                                     | `platform.page_versions` |
| Programa       | `public.program_templates` (renomeado de `specialty_templates`) | `platform.programs`                                  | snapshot JIT             |
| Form captação  | `public.form_templates`                                         | `platform.capture_forms`                             | snapshot JIT             |
| **Paleta**     | `platform.palettes` (oficial via `is_official=true`)            | clone (`source_palette_id` + `created_by_tenant_id`) | n/a (updates inplace)    |
| Push template  | `platform.push_templates` (tenant_id=null = global)             | clone JIT se prof edita                              | n/a                      |
| Email template | `platform.email_templates` (idem)                               | clone JIT                                            | n/a                      |

### Paleta — fluxo CLONE (resolve hack `custom_primary_oklch`)

1. Prof escolhe paleta oficial → `tenants.palette_id = <oficial.id>`
2. Prof clica "personalizar" → sistema CLONA: cria row em `platform.palettes` com:
   - Todos os valores copiados da oficial
   - `source_palette_id = <oficial.id>`
   - `created_by_tenant_id = <tenant.id>`
   - `brand_id = <tenant.brand_id>` (herda do tenant)
   - `is_official = false`
3. Prof edita livre (primary, secondary, tertiary, surfaces, extras — qualquer campo)
4. `tenants.palette_id = <clone.id>` (aponta pra clone)
5. RLS:
   - Tenant LÊ: `is_official=true` OR `created_by_tenant_id=self` OR `brand_id=self.brand_id`
   - Tenant EDITA: só onde `created_by_tenant_id=self`

`platform.tenants.custom_primary_oklch` **removida** (hack obsoleto — clone resolve qualquer custom).

## Consequences

**Positivo:**

- Consistência total (mesmo padrão pra TUDO custumizável)
- Sem schema bloat (`custom_*_oklch` × 20 colunas evitado)
- Multi-marca natural (cada brand vê só suas + oficiais)
- Prof pode ter N paletas custom + alternar
- Padrão clones independentes (D-G39) — atualizar template não retroage
- Rollback trivial via `*_versions`

**Negativo:**

- `platform.palettes` cresce conforme tenants customizam (mitigação: `is_official=false` + cleanup periódico paletas órfãs)
- Toda paleta UI mostra: oficiais (13) + minhas custom + da minha brand
- 1 query extra pra resolver paleta efetiva (cache 60s mitiga)

**Neutro:**

- `platform.palettes` ganha: `source_palette_id`, `created_by_tenant_id`
- `platform.tenants` perde: `custom_primary_oklch`
- `/api/tenants/[id]/theme.css/route.ts` simplifica (não precisa de fallback custom)
- Migration 0001 adiciona: `public.page_templates`, `public.form_templates`, `public.program_templates` (era specialty)
- Migration 0001 adiciona: `platform.page_versions` (snapshot publish)
- ADR-0028 superseded parcial (paletas seguem clone, não `custom_*` columns)
