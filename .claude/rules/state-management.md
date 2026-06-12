## Hybrid intencional (ADR fundadora §11)

- **RHF + Zod** — forms tradicionais (input → submit, validação por schema)
- **Zustand** — editor state container, state global persistido, multi-callsite
- **Server actions + RSC** — server state. NÃO usar Zustand/RHF como cache

## Fronteira (qual lib em qual surface)

| Surface                                    | Stack                                 |
| ------------------------------------------ | ------------------------------------- |
| Theme builder Apoiador                     | **Zustand** persist + history         |
| Chat IA (3 surfaces)                       | **Zustand** + Server Actions (stream) |
| Lead capture form                          | **RHF + Zod**                         |
| Login / signup                             | **RHF + Zod**                         |
| Dashboard forms (criar atleta, plano, etc) | **RHF + Zod**                         |
| Page builder editor (JIT)                  | **Zustand** + immer                   |
| Server state                               | RSC + server actions                  |

## Invariantes

- **I1** — forms tradicionais (input → submit) usam **RHF + Zod**. Sempre.
- **I2** — editor state container usa **Zustand**.
- **I3** — **proibido sincronizar Zustand ↔ RHF** bidirectional.
- **I4** — server state usa **server actions + RSC**, não Zustand/RHF.

## Pattern Zustand

```ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useEditorStore = create<EditorState>()(
  persist(
    (set) => ({
      state: defaultState,
      setState: (s) => set({ state: s }),
    }),
    {
      name: "theme-editor",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true, // SSR-safe
    },
  ),
);

// Rehydrate post-mount:
useEffect(() => {
  useEditorStore.persist.rehydrate();
}, []);
```

## Pattern RHF

```tsx
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("auth.email")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
```

## Anti-patterns

| Anti-pattern                                      | Por quê                               |
| ------------------------------------------------- | ------------------------------------- |
| `useForm({ defaultValues: () => readStorage() })` | Hydration mismatch garantido          |
| RHF como state container de editor                | Race conditions DOM                   |
| Zustand pra form com submit                       | Reinventa register/Controller/dirty   |
| Sincronizar RHF.values ↔ Zustand                  | Anti-pattern explícito #1922          |
| Zustand sem `skipHydration: true` em SSR          | Mismatch silencioso                   |
| Server state em Zustand                           | Re-inventa TanStack Query / RSC cache |
