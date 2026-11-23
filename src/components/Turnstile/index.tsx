'use client'
import React, { useEffect, useRef } from 'react'

import { TURNSTILE_SITE_KEY } from '@/utilities/captcha'

type TurnstileApi = {
  remove: (widgetId: string) => void
  render: (el: HTMLElement, options: Record<string, unknown>) => string
  reset: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

let scriptPromise: Promise<void> | undefined

const loadScript = () => {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = undefined
      reject(new Error('Captcha failed to load'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

/** Cloudflare Turnstile widget. Stays hidden unless Cloudflare needs the visitor to interact. */
export const Turnstile: React.FC<{
  className?: string
  /** Change this number to get a fresh token (e.g. after a submit). */
  resetSignal?: number
  onToken: (token: null | string) => void
}> = ({ className, onToken, resetSignal = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string>('')
  const onTokenRef = useRef(onToken)
  onTokenRef.current = onToken

  useEffect(() => {
    let cancelled = false

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          appearance: 'interaction-only',
          callback: (token: string) => onTokenRef.current(token),
          'error-callback': () => onTokenRef.current(null),
          'expired-callback': () => onTokenRef.current(null),
          sitekey: TURNSTILE_SITE_KEY,
        })
      })
      .catch(() => onTokenRef.current(null))

    return () => {
      cancelled = true
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current)
      widgetIdRef.current = ''
    }
  }, [])

  useEffect(() => {
    if (resetSignal && widgetIdRef.current) {
      onTokenRef.current(null)
      window.turnstile?.reset(widgetIdRef.current)
    }
  }, [resetSignal])

  return <div className={className} ref={containerRef} />
}
