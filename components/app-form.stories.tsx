// RESEARCH: storybook story pra AppForm wrapper (ADR-0038 + ADR-0040 §E).
// Schema Zod inline + onSubmit mock retornando ActionResult.ok/fail.
// FormProvider injetado pelo AppForm — children consomem via useFormContext.

import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { AppError } from '@/lib/contracts/errors'
import { fail, ok } from '@/lib/contracts/result'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { AppForm } from './app-form'

const schema = z.object({
  email: z.string().email('Email inválido'),
})

type FormInput = z.infer<typeof schema>

function FormFields() {
  const { register, formState } = useFormContext<FormInput>()
  return (
    <div className="flex max-w-sm flex-col gap-3">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" {...register('email')} />
      {formState.errors.email && (
        <span className="text-destructive text-sm">{formState.errors.email.message}</span>
      )}
      <Button type="submit" disabled={formState.isSubmitting}>
        Enviar
      </Button>
    </div>
  )
}

const meta = {
  title: 'Wrappers/AppForm',
  component: AppForm<FormInput, { id: string }>,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AppForm<FormInput, { id: string }>>

export default meta
type Story = StoryObj<typeof meta>

export const SubmitSuccess: Story = {
  args: {
    schema,
    defaultValues: { email: '' },
    onSubmit: async (input) => {
      await new Promise((r) => setTimeout(r, 400))
      return ok({ id: `created-${input.email}` })
    },
    children: <FormFields />,
  },
}

export const SubmitError: Story = {
  args: {
    schema,
    defaultValues: { email: '' },
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 400))
      return fail(
        AppError.invalidInput({
          key: 'common.errors.generic',
          fallback: 'Mock server error from story',
        }),
      )
    },
    children: <FormFields />,
  },
}
