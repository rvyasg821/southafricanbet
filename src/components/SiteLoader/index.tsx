'use client'
import { usePathname } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'

const MIN_VISIBLE_MS = 1500
const FADE_MS = 500

/**
 * Full-screen splash. Shown on first load, and re-shown the instant an internal link is
 * clicked (or back/forward is used) rather than only once the destination has finished
 * loading - otherwise there's a gap where nothing indicates the page is changing. Always
 * stays up for at least MIN_VISIBLE_MS measured from that moment, then fades out once.
 */
export const SiteLoader: React.FC = () => {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(true)
  const [fading, setFading] = useState(false)
  const shownAtRef = useRef(Date.now())
  const timersRef = useRef<{ fade?: ReturnType<typeof setTimeout>; remove?: ReturnType<typeof setTimeout> }>({})

  const show = () => {
    clearTimeout(timersRef.current.fade)
    clearTimeout(timersRef.current.remove)
    shownAtRef.current = Date.now()
    setFading(false)
    setMounted(true)
  }

  const scheduleHide = () => {
    const remaining = Math.max(MIN_VISIBLE_MS - (Date.now() - shownAtRef.current), 0)
    timersRef.current.fade = setTimeout(() => setFading(true), remaining)
    timersRef.current.remove = setTimeout(() => setMounted(false), remaining + FADE_MS)
  }

  // Show immediately on click of an internal link, or on browser back/forward - don't wait
  // for the destination to actually be ready. Capture phase: runs before next/link's own
  // click handler (on the anchor itself) has a chance to call preventDefault().
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const anchor = (e.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!anchor || (anchor.target && anchor.target !== '_self')) return
      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      show()
    }
    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', show)
    return () => {
      document.removeEventListener('click', onClick, true)
      window.removeEventListener('popstate', show)
    }
  }, [])

  // The destination has now actually rendered (or this is the first load) - start/refresh the
  // minimum-visible countdown from whenever the loader was actually shown.
  useEffect(() => {
    scheduleHide()
    return () => {
      clearTimeout(timersRef.current.fade)
      clearTimeout(timersRef.current.remove)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!mounted) return null

  return (
    <div
      aria-label="Loading"
      aria-live="polite"
      className={cn('site-loader', fading && 'site-loader-fading')}
      role="status"
    >
      <div className="site-loader-inner">
        <div aria-hidden="true" className="site-loader-chip">
          <div className="site-loader-chip-glow" />
          <div className="site-loader-chip-ring" />
          <div className="site-loader-chip-core" />
          <div className="site-loader-chip-shine" />
        </div>

        <p className="site-loader-label">
          Loading
          <span className="site-loader-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </p>
        <p className="site-loader-tag">SouthAfricanBet.co.za</p>

        <div className="site-loader-bar">
          <span />
        </div>
      </div>
    </div>
  )
}
