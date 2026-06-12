## Princípio cravado

**Forma rígida + query frequente = normalized. Forma variável + editada por chat/UI runtime = JSONB.**

Cada vez que criar tabela/coluna nova, **passar pelo framework abaixo antes de decidir**.

## Framework de decisão

| Sinal                                                                  | Resposta      | Por quê                                    |
| ---------------------------------------------------------------------- | ------------- | ------------------------------------------ |
| Forma **rígida + estável** (sabemos as colunas, não muda)              | ✅ Normalized | Schema controlado, type safety             |
| Query/agg/filter **frequente** sobre esses dados                       | ✅ Normalized | Index efetivo, performance                 |
| FK precisa apontar **pra ele**                                         | ✅ Normalized | Não dá pra fazer FK pra valor jsonb        |
| Reporting analítico (charts, dashboards)                               | ✅ Normalized | GROUP BY + JOIN funciona                   |
| Bench/orderby frequente entre rows                                     | ✅ Normalized | Index B-tree direto                        |
| Forma **variável por instância** (cada row pode ter campos diferentes) | ✅ JSONB      | Tipo `discriminated union` runtime         |
| **Editado por chat IA / vibe coding** runtime                          | ✅ JSONB      | IA atualiza um campo sem migration         |
| Composição **runtime** (slots, blocks, variants, props_override)       | ✅ JSONB      | Composição dinâmica precisa JSON           |
| Schema evolui **sob pressão de usuário** (custom fields, plugins)      | ✅ JSONB      | Tenant adiciona campo sem deploy           |
| Multi-tenant onde **cada tenant pode variar a forma**                  | ✅ JSONB      | Cada tenant tem schema próprio             |
| Versionamento imutável de **snapshot**                                 | ✅ JSONB      | Snapshot completo no momento da publicação |
| Settings / config / metadata de forma livre                            | ✅ JSONB      | Não precisa quebra em N colunas            |

## Aplicação cravada no retake

### ✅ Normalized (forma rígida + query frequente)

| Categoria         | Tabelas                                                                                          |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Identidade        | parties, party_roles, party_relationships, tenants, profiles, groups, memberships, domains       |
| Plans / billing   | plans, prices, plan_features, features, subscriptions, feature_usage                             |
| Captação          | leads                                                                                            |
| Comunicação infra | communication_templates, communication_rules                                                     |
| Eventos           | events, event_lots, event_moderation                                                             |
| IA registry       | ai_tools, ai_prompts, ai_prompt_versions, ai_generations, ai_usage_monthly                       |
| Marketplace       | products, product_variants, orders, order_items, suppliers                                       |
| Sponsors          | sponsorships, brand_placements                                                                   |
| Recursos          | resources, services, service_providers, commission_rules, commission_ledger                      |
| Treino (fase 2+)  | athletes, athlete_thresholds, macrocycles, mesocycles, microcycles, sessions, workout_executions |
| Wearable          | wearable_connections, wearable_activities                                                        |
| Agenda            | classes, class_sessions, attendance                                                              |

### ✅ JSONB (forma variável + editada runtime + vibe-coding-ready)

| Coluna jsonb                                                | Por quê é JSONB                                                                                                               |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `page_versions.content`                                     | Composição completa do site (style_preset + blocks[] + slots) — IA edita via tools, forma varia por estilo escolhido          |
| `tenant_themes.tokens` + `tenant_theme_versions.snapshot`   | Token set por tenant — forma varia (alguns têm extensão opt-in, outros não) + IA mexe via chat                                |
| `tenant_theme_versions.derived`                             | Cache dos derivados (surfaces/secondary calculados) — pode mudar quando recompõe                                              |
| `forms.custom_questions`                                    | Perguntas que tenant adiciona via chat — forma varia por tenant                                                               |
| `ai_tools.schema`                                           | Zod schema serializado por tool — varia por tool                                                                              |
| `audit_log.payload`                                         | Payload arbitrário do que mudou — varia por action                                                                            |
| `party_relationships.terms`                                 | Termos do contrato — `commission_pct` (parceiro interno) vs `monthly_rent_cents` (locação) vs `referral_pct` (encaminhamento) |
| `communication_log.payload`                                 | Payload do email enviado — varia por template                                                                                 |
| `anamnese.health`                                           | Lesões/restrições/medicamentos — forma varia por atleta                                                                       |
| `anamnese.running_history`                                  | Histórico de provas + PRs — array variável                                                                                    |
| `blocks[].props_override` (dentro de page_versions.content) | Override local de props da seção                                                                                              |
| `tenants.theme_tokens`                                      | Snapshot rápido pra performance RLS                                                                                           |
| `tenants.settings`                                          | Configurações livres do tenant                                                                                                |
| `parties.contacts`                                          | Emails/phones/social — array variável                                                                                         |
| `profiles.a11y_prefs`                                       | Preferências a11y (reduce-motion, font-scale, contrast)                                                                       |
| `domains.dns`                                               | DNS records pra CNAME — varia por provedor                                                                                    |
| `assessments.value`                                         | Valor medido — VO2/FC/peso/teste varia o formato                                                                              |
| `library_items.payload` (fase 2 conteúdo)                   | Forma varia por kind (workout_segment vs content vs exercise)                                                                 |
| `training_day_items.target`                                 | pace OR hr OR power OR rpe — alvo varia                                                                                       |
| `event_lots.window`                                         | Janela de venda — varia por organizador                                                                                       |
| `orders.totals` + `orders.split`                            | Cálculo financeiro — varia por composição de carrinho                                                                         |
| `feature_votes.weight`                                      | Peso do voto — varia se Apoiador vs Membro                                                                                    |
| `roadmap_items.theme`                                       | Categorização livre                                                                                                           |

## Anti-patterns banidos

| ❌ Anti-pattern                                                             | Substituto                                                            |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `tokens` em N colunas separadas (`primary_color`, `secondary_color`, etc)   | `tenant_themes.tokens jsonb` (forma muda quando adicionamos extensão) |
| `custom_field_1`, `custom_field_2`, etc colunas                             | `custom_questions jsonb` (forma é dinâmica)                           |
| Composição de página em N tabelas (`page_hero`, `page_about`, `page_plans`) | `page_versions.content jsonb` (vibe-coding-ready)                     |
| Anamnese em N colunas fixas (`injury_1`, `injury_2`, etc)                   | `health jsonb` (forma varia por atleta)                               |
| Settings como JSONB **mas** com FK pra `settings_keys` table                | Settings full jsonb (não tem query frequente)                         |
| Métricas analíticas em JSONB (`stats jsonb`)                                | Tabela normalizada (precisa GROUP BY, charts)                         |
| Status enum dentro de jsonb (`{"status": "active"}` em jsonb)               | Coluna enum separada (precisa filter rápido)                          |
| FK em campo jsonb (`{"coach_id": "uuid"}`)                                  | Coluna FK separada (PK referencial integrity)                         |

## Decisão JIT quando ambíguo

Antes de decidir, perguntar:

1. **Vou fazer GROUP BY / ORDER BY / WHERE filtrável nessa coluna frequentemente?**
   - Sim → Normalized
   - Não → JSONB

2. **A forma é a mesma em 100% das rows?**
   - Sim → Normalized (se tiver query) OR jsonb (se não tiver query)
   - Não → JSONB obrigatório

3. **IA / chat / UI runtime vai editar?**
   - Sim → JSONB
   - Não → Normalized

4. **Ainda ambíguo?** Documentar dúvida em `docs/_sessions/` antes de implementar.

## Otimização JIT (índice GIN em jsonb)

Quando JSONB ganha tráfego de query (raro), criar índice GIN:

```sql
CREATE INDEX page_versions_content_gin ON public.page_versions USING GIN (content);
CREATE INDEX form_submissions_answers_gin ON public.form_submissions USING GIN (answers jsonb_path_ops);
```

Não fazer dia 1 — só sob gatilho real.

## Princípio cravado pra retake especificamente

- **Vibe-coding-ready dia 1** = composição em JSONB (não em código hardcoded). IA edita via tools.
- **Dados de cadastro (coaches/plans/services/etc) = normalized** — query frequente, FK, agg.
- **Tokens + composição + custom_questions + audit payload = JSONB** — forma varia, runtime editing.
- **Snapshot imutável (page_versions, theme_versions, prompt_versions) = JSONB** — preserva forma do momento.

## Condição de revisitar esta rule

| Gatilho                                              | Ação                                    |
| ---------------------------------------------------- | --------------------------------------- |
| 3+ casos onde escolha foi ambígua                    | Adicionar exemplo ao framework          |
| Postgres release com novo tipo de jsonb optimization | Atualizar seção "Otimização JIT"        |
| 5+ tenants pedindo custom fields que estão em JSONB  | Avaliar se vale promover pra normalized |
| Performance issue em query sobre jsonb               | Considerar normalização + migration     |
