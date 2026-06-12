// RESEARCH: extract pattern — onSubmit logic em hook pra reduzir LOC do ProjectCreateForm.
// Sprint Bloco B 2026-05-27. ADR-0069 chat dual-scope.

'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { toast } from 'sonner'

import type { Database } from '@/lib/contracts/database'

import { createProjectAction } from '@/app/(painel)/projeto/[slug]/actions'

type ProjectRow = Database['public']['Tables']['projects']['Row']

export function useCreateProject(onCreated?: (project: ProjectRow) => void) {
  const t = useTranslations('projects.create')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function submit(values: { name: string }) {
    startTransition(async () => {
      const result = await createProjectAction({ name: values.name })

      if (!result.ok) {
        toast.error(result.error.message)
        return
      }

      toast.success(t('success', { name: result.data.project.name }))

      if (onCreated) onCreated(result.data.project)
      else router.push(`/projeto/${result.data.project.slug}`)
    })
  }

  return { submit, isPending }
}
