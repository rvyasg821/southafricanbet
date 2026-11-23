'use client'
import { ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { cn } from '@/utilities/ui'

const DURATION_MS = 3000

const LABELS: [number, string][] = [
  [0, 'Checking the link…'],
  [35, 'Connecting…'],
  [70, 'Opening the site…'],
  [100, 'Redirecting now'],
]

/** Animated progress bar; sends the visitor to `url` once it completes (button is the no-JS-wait fallback). */
export const RedirectProgress: React.FC<{ url: string }> = ({ url }) => {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    let frameId: number
    let redirectTimer: ReturnType<typeof setTimeout>
    let start: null | number = null

    const frame = (t: number) => {
      if (start === null) start = t
      const progress = Math.min(1, (t - start) / DURATION_MS)
      setPct(Math.round((1 - Math.pow(1 - progress, 2.2)) * 100))

      if (progress < 1) {
        frameId = requestAnimationFrame(frame)
      } else {
        redirectTimer = setTimeout(() => window.location.replace(url), 250)
      }
    }

    frameId = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(frameId)
      clearTimeout(redirectTimer)
    }
  }, [url])

  const status = [...LABELS].reverse().find(([from]) => pct >= from)?.[1]

  return (
    <>
      <div
        aria-label="Redirect progress"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={pct}
        className="redirect-progress"
        role="progressbar"
      >
        <div className="redirect-progress-top">
          <span>{status}</span>
          <span className="redirect-progress-pct">{pct}%</span>
        </div>
        <div className="redirect-bar">
          <div className="redirect-bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <ul className="redirect-steps">
          <li className={cn(pct >= 35 && 'redirect-step-done')}>Secure link</li>
          <li className={cn(pct >= 70 && 'redirect-step-done')}>Connecting</li>
          <li className={cn(pct >= 100 && 'redirect-step-done')}>Opening site</li>
        </ul>
      </div>

      <a className="redirect-button" href={url} rel="nofollow noopener">
        Click here if nothing happens
        <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
      </a>
    </>
  )
}
