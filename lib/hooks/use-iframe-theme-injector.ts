// RESEARCH: tweakcn (Apache-2.0) — adapted from hooks/use-iframe-theme-injector.ts
// See NOTICE.md.
// ADAPT: Zustand store global → arg de função (stack travada RHF + RSC, ADR-0040 §C)
// ADAPT: useCallback removed (React Compiler manages memoization).
// ADAPT: helpers extracted to module scope to satisfy max-lines-per-function.
import { useEffect, useRef, useState } from 'react'

import { applyThemeToElement } from '@/lib/design/apply-theme'
import { EmbedMessage, IframeStatus, MESSAGE } from '@/lib/design/contract/live-preview'
import type { ThemeStyleProps } from '@/lib/design/contract/theme'

const THEME_UPDATE_DEBOUNCE_MS = 50
const VALIDATION_TIMEOUT_MS = 3000

type IframeMode = 'dark' | 'light'
type ThemeStyles = { light: ThemeStyleProps; dark: ThemeStyleProps }
export type ThemeEditorState = { currentMode: IframeMode; styles: ThemeStyles }

export interface UseIframeThemeInjectorProps {
  themeState: ThemeEditorState
  allowCrossOrigin?: boolean
  iframeRef?: React.RefObject<HTMLIFrameElement | null>
}

type CrossOriginHandlerOpts = {
  event: MessageEvent<EmbedMessage>
  iframeEl: HTMLIFrameElement | null
  validationTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  setStatus: (s: IframeStatus) => void
  setError: (e: string | null) => void
  sendMsg: (msg: EmbedMessage) => void
}

// Extracted to satisfy max-lines-per-function + max-params rules
function trySend(win: Window | null, msg: EmbedMessage, onError?: (e: unknown) => void) {
  try {
    win?.postMessage(msg, '*')
  } catch (e) {
    onError?.(e)
  }
}

type LoadHandlerOpts = {
  iframe: HTMLIFrameElement
  themeState: ThemeEditorState
  allowCrossOrigin: boolean
  validationTimeoutRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
  setStatus: (s: IframeStatus) => void
  setError: (e: string | null) => void
}

function handleIframeLoad({
  iframe,
  themeState,
  allowCrossOrigin,
  validationTimeoutRef,
  setStatus,
  setError,
}: LoadHandlerOpts) {
  const send = (msg: EmbedMessage) =>
    trySend(iframe.contentWindow, msg, () => setError('Failed to establish the connection.'))
  if (allowCrossOrigin) {
    setStatus('checking')
    send({ type: MESSAGE.PING })
    clearTimeout(validationTimeoutRef.current!)
    validationTimeoutRef.current = setTimeout(() => {
      setStatus('missing')
      setError(
        'The live preview script could not be found. Please make sure the script is included and try again.',
      )
    }, VALIDATION_TIMEOUT_MS)
  } else {
    const root = iframe.contentDocument?.documentElement
    if (root) applyThemeToElement(themeState, root)
    setStatus('supported')
    setError(null)
  }
}

function handleCrossOriginMessage({
  event,
  iframeEl,
  validationTimeoutRef,
  setStatus,
  setError,
  sendMsg,
}: CrossOriginHandlerOpts) {
  if (!iframeEl || event.source !== iframeEl.contentWindow) return
  clearTimeout(validationTimeoutRef.current!)
  switch (event.data.type) {
    case MESSAGE.EMBED_LOADED:
      console.log('Tweakcn Embed: loaded')
      setError(null)
      break
    case MESSAGE.PONG:
      setStatus('connected')
      setError(null)
      sendMsg({ type: MESSAGE.CHECK_SHADCN })
      break
    case MESSAGE.SHADCN_STATUS: {
      const ok = event.data.payload.supported
      setStatus(ok ? 'supported' : 'unsupported')
      setError(
        ok
          ? null
          : 'Live theme preview requires shadcn/ui setup. Please make sure the basic shadcn/ui variables are configured correctly.',
      )
      break
    }
    case MESSAGE.EMBED_ERROR: {
      const { error } = event.data.payload
      setStatus('error')
      setError(error)
      console.error('Tweakcn Embed error:', error)
      break
    }
  }
}

export const useIframeThemeInjector = ({
  themeState,
  allowCrossOrigin = false,
  iframeRef,
}: UseIframeThemeInjectorProps) => {
  const internalRef = useRef<HTMLIFrameElement | null>(null)
  const ref = iframeRef ?? internalRef
  const [status, setStatus] = useState<IframeStatus>('unknown')
  const [themeInjectionError, setError] = useState<string | null>(null)
  const validationRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const updateRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // iframe load: same-origin apply or cross-origin validate
  useEffect(() => {
    const iframe = ref.current
    if (!iframe) {
      setStatus('unknown')
      return
    }
    const opts = {
      iframe,
      themeState,
      allowCrossOrigin,
      validationTimeoutRef: validationRef,
      setStatus,
      setError,
    }
    const handleLoad = () => handleIframeLoad(opts)
    if (iframe.src) handleLoad()
    iframe.addEventListener('load', handleLoad)
    return () => iframe.removeEventListener('load', handleLoad)
  }, [allowCrossOrigin, ref, themeState])

  // cross-origin message listener
  useEffect(() => {
    if (!allowCrossOrigin) return
    const send = (msg: EmbedMessage) => trySend(ref.current?.contentWindow ?? null, msg)
    const onMsg = (event: MessageEvent<EmbedMessage>) =>
      handleCrossOriginMessage({
        event,
        iframeEl: ref.current,
        validationTimeoutRef: validationRef,
        setStatus,
        setError,
        sendMsg: send,
      })
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [allowCrossOrigin, ref])

  // cross-origin debounced theme update
  useEffect(() => {
    if (!allowCrossOrigin || status !== 'supported') return
    clearTimeout(updateRef.current!)
    updateRef.current = setTimeout(() => {
      trySend(ref.current?.contentWindow ?? null, {
        type: MESSAGE.THEME_UPDATE,
        payload: { themeState: themeState.styles },
      })
    }, THEME_UPDATE_DEBOUNCE_MS)
  }, [themeState, allowCrossOrigin, status, ref])

  useEffect(
    () => () => {
      clearTimeout(validationRef.current!)
      clearTimeout(updateRef.current!)
    },
    [],
  )

  return {
    ref,
    status: allowCrossOrigin ? status : 'supported',
    retryValidation: undefined,
    themeInjectionError,
  }
}
