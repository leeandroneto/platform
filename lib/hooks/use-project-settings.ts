// RESEARCH: extract pattern — onUpdate/onDelete logic em hooks pra reduzir LOC do ProjectSettingsForm.
// Sprint Bloco B 2026-05-27. ADR-0069 chat dual-scope.

'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { toast } from 'sonner'

import { deleteProjectAction, updateProjectAction } from '@/app/(painel)/projeto/[slug]/actions'

export function useUpdateProject(projectId: string) {
  const t = useTranslations('projects.settings')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function submit(values: { name: string; description?: string; systemPrompt?: string }) {
    startTransition(async () => {
      const result = await updateProjectAction({
        projectId,
        name: values.name,
        description: values.description || null,
        instructions: { systemPrompt: values.systemPrompt || '' },
      })

      if (!result.ok) {
        toast.error(result.error.message)
        return
      }
      toast.success(t('updateSuccess'))
      router.refresh()
    })
  }

  return { submit, isPending }
}

export function useDeleteProject(projectId: string, projectName: string, isDefault: boolean) {
  const t = useTranslations('projects.settings')
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function remove() {
    if (isDefault) {
      toast.error(t('cannotDeleteDefault'))
      return
    }
    if (!confirm(t('deleteConfirm', { name: projectName }))) return

    startTransition(async () => {
      const result = await deleteProjectAction({ projectId })
      if (!result.ok) {
        toast.error(result.error.message)
        return
      }
      toast.success(t('deleteSuccess'))
      router.push('/conversas')
    })
  }

  return { remove, isPending }
}
