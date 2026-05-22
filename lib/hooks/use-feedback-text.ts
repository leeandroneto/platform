// RESEARCH: tweakcn (Apache-2.0) — copied from hooks/use-feedback-text.ts
// See NOTICE.md.
// ADAPT: Replaced direct setState(0) in effect body with startTime ref + Date.now()
// derivation to satisfy react-hooks/set-state-in-effect. Same UX/algorithm.
import { useEffect, useRef, useState } from 'react'

const ROTATION_INTERVAL_IN_SECONDS = 8

const DEFAULT_FEEDBACK_MESSAGES = ['Loading...']

type UseFeedbackTextProps = {
  showFeedbackText: boolean
  feedbackMessages: string[]
  rotationIntervalInSeconds?: number
}

export function useFeedbackText({
  showFeedbackText,
  feedbackMessages = DEFAULT_FEEDBACK_MESSAGES,
  rotationIntervalInSeconds = ROTATION_INTERVAL_IN_SECONDS,
}: UseFeedbackTextProps) {
  const [elapsedTimeGenerating, setElapsedTimeGenerating] = useState(0)
  // Initialize to 0; set to Date.now() inside effect (not during render — purity rule)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!showFeedbackText) return

    // Record start time so elapsed resets to 0 on each activation
    startTimeRef.current = Date.now()

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setElapsedTimeGenerating(elapsed)
    }, 1000)

    return () => clearInterval(interval)
  }, [showFeedbackText])

  // When not showing, derive 0 without setState in effect body
  const elapsed = showFeedbackText ? elapsedTimeGenerating : 0
  const stepsElapsed = Math.floor(elapsed / rotationIntervalInSeconds)
  const feedbackIndex = stepsElapsed % feedbackMessages.length
  const feedbackText = feedbackMessages[feedbackIndex]
  return feedbackText
}
