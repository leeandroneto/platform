// RESEARCH: custom — login mínimo pra dev testing (Supabase signInWithPassword)
// Página criada pra testar /admin/theme-studio end-to-end. Substituir por flow
// auth completo (UI design + multi-provider + reset password) quando funil
// agência iniciar.

import { Suspense } from 'react'
import { connection } from 'next/server'

import { LoginForm } from './form'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-4">
      <Suspense fallback={null}>
        <DynamicLoginShell />
      </Suspense>
    </main>
  )
}

async function DynamicLoginShell() {
  // ADAPT: next 16 cacheComponents — connection() opt-out de prerender estático
  // (LoginForm é client com Supabase signInWithPassword + useState locais).
  // Wrapping em Suspense isola o opt-out dynamic do resto da árvore.
  await connection()
  return <LoginForm />
}
