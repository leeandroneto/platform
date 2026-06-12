// RESEARCH: tweakcn (Apache-2.0) — copied from hooks/use-fullscreen.ts
// See NOTICE.md.
import { useEffect, useState } from 'react'

import screenfull from 'screenfull'

export const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (screenfull.isEnabled) {
      const handleFullscreenChange = () => {
        setIsFullscreen(screenfull.isFullscreen)
      }

      screenfull.on('change', handleFullscreenChange)
      return () => {
        screenfull.off('change', handleFullscreenChange)
      }
    }
    return undefined
  }, [])

  const toggleFullscreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle()
    }
  }

  return {
    isFullscreen,
    toggleFullscreen,
  }
}
