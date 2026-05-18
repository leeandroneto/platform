# 0015. PWA offline: idb-keyval + autosave 800ms + visualViewport

Date: 2026-05-17
Status: accepted

## Context

Master plan não detalha estratégia offline. Pesquisa 15 fornece receita pronta. Caso real: aluno no metrô marca 24 séries em 60min, 8 caem por 4G dropado. Sem IndexedDB → perde 8 séries → churn. Fonte: `_CONFLITOS.md #15`.

## Decision

Stack offline:

- **IndexedDB queue** via `idb-keyval` (~600B) — buffer de mutation cliente sem rede
- **Autosave debounced 800ms** → Supabase quando online
- **Persistência via `pagehide` + `visibilitychange`** (não `beforeunload`, iOS ignora)
- **Hook `useKeyboardInset`** baseado em `visualViewport` API (iOS Safari não tem `virtualKeyboard` API)

Camadas:

- IndexedDB = buffer cliente sem rede
- Supabase = quando online, flusha
- Supabase Queues (pgmq) = opcional pro servidor (JIT — entra quando background job real existir)

**Trigger pra Dexie 4.x:** schema do queue crescer >3 stores OU >10K rows. Antes disso, idb-keyval suficiente.

## Consequences

**Positivo:**

- Bundle minúsculo (~600B vs Dexie ~30KB)
- Zero churn por sync miss
- iOS Safari quirks já mitigados

**Negativo:**

- Migração pra Dexie eventual exige refator camada de queue
- Mitigação: queue API encapsulada em `lib/data/offline/queue.ts` — swap interno

**Neutro:**

- Detalhes em `08-pwa-offline.md`
- ADR-0014 (Serwist+Turbopack) é dependência direta
