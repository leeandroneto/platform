// RESEARCH: react-hook-form + Zod + next-intl + field primitive (radix-nova) — wrapper composto ADR-0040 §E.
// radix-nova nao tem `form` clasico do shadcn — substituto `field` + RHF FormProvider direto.
// Valor agregado: schema+resolver+FormProvider+handleSubmit tipado+AppError->toast.error i18n automatico.

'use client'

import { type ReactNode } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import {
  type DefaultValues,
  type FieldValues,
  FormProvider,
  type Resolver,
  useForm,
} from 'react-hook-form'
import { type ZodType } from 'zod'

import { type ActionResult } from '@/lib/contracts/action'

import { useAppToast } from '@/components/app-toast'

interface AppFormProps<TInput extends FieldValues, TOutput> {
  /** Zod schema do input. Resolver injetado automaticamente. */
  schema: ZodType<TInput>
  /** Default values pro RHF. */
  defaultValues: DefaultValues<TInput>
  /** Server action ou handler async retornando ActionResult. */
  onSubmit: (input: TInput) => Promise<ActionResult<TOutput>>
  /** Callback opcional disparado quando server retorna { ok: true }. */
  onSuccess?: (data: TOutput) => void
  /** Children consomem RHF context via useFormContext()/Controller/Field. */
  children: ReactNode
  /** className opcional pro <form>. */
  className?: string
}

export function AppForm<TInput extends FieldValues, TOutput>({
  schema,
  defaultValues,
  onSubmit,
  onSuccess,
  children,
  className,
}: AppFormProps<TInput, TOutput>) {
  // Cast `schema as never` por incompatibilidade conhecida zod 4 + RHF 7 + @hookform/resolvers v5:
  // ZodType<TInput, unknown, ...> nao bate Zod3Type<TInput, FieldValues>. Runtime funciona OK.
  const form = useForm<TInput>({
    resolver: zodResolver(schema as never) as Resolver<TInput>,
    defaultValues,
  })
  const toast = useAppToast()

  const handle = async (input: TInput) => {
    const result = await onSubmit(input)
    if (result.ok) {
      onSuccess?.(result.data)
      return
    }
    const key =
      typeof result.error.metadata?.['i18nKey'] === 'string'
        ? (result.error.metadata['i18nKey'] as string)
        : 'common.errors.generic'
    toast.error(key)
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handle)} className={className} noValidate>
        {children}
      </form>
    </FormProvider>
  )
}
