---
name: Build all reusable mocks before page execution
description: User prefers building all product mock components (reusable across pages) before starting any page implementation, since mocks feed into multiple pages.
type: feedback
originSessionId: 23d550d6-ba83-4577-b24d-c3cad5345845
---

Build all `components/product/*` mocks (reusable demo components) and `lib/demo/data.ts` BEFORE starting any page execution (home, /produto/\*, etc.).

**Why:** The mocks are shared across multiple pages (home, /produto/avaliacao, /produto/landing, /produto/painel, /precos). Building them first avoids rework and ensures visual consistency. The user explicitly asked: "wouldn't it be better to make all mocks first and then start executions?"

**How to apply:** In the backlog, Fase J (product/\* headless components) should be executed BEFORE Fase K (Home v2) and Fase L (product pages). Adjust priority order accordingly.
