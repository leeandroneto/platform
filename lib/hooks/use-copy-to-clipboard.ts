// RESEARCH: tweakcn (Apache-2.0) — adapted from hooks/use-copy-to-clipboard.ts
// See NOTICE.md.
// ADAPT: useToast legacy → sonner (ADR-0040 §E)
// ADAPT: toast string literals moved to caller-supplied args (i18n rule — t() required for hardcoded strings)
import { useState } from 'react'

import { toast } from 'sonner' // ADAPT: useToast legacy → sonner (ADR-0040 §E)

export type CopyMessage = { title: string; description?: string }

export function useCopyToClipboard() {
  const [isCopying, setIsCopying] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = async (
    text: string,
    successMessage?: CopyMessage,
    errorMessage?: CopyMessage,
  ) => {
    try {
      setIsCopying(true)
      await navigator.clipboard.writeText(text)
      setHasCopied(true)

      if (successMessage) {
        toast.success(successMessage.title, {
          description: successMessage.description,
        })
      }

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setHasCopied(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      if (errorMessage) {
        toast.error(errorMessage.title, {
          description: errorMessage.description,
        })
      }
    } finally {
      setIsCopying(false)
    }
  }

  return {
    isCopying,
    hasCopied,
    copyToClipboard,
  }
}
