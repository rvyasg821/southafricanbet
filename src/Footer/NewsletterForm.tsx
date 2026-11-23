'use client'
import { Check, Mail, Send, TriangleAlert, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

import { Turnstile } from '@/components/Turnstile'
import { cn } from '@/utilities/ui'

/** Newsletter signup: captcha-checked, saved in the CMS (Subscribers) and emailed to the site owner. */
export const NewsletterForm: React.FC<{
  buttonLabel?: string | null
  eyebrow?: string | null
  heading?: string | null
  text?: string | null
}> = ({ buttonLabel, eyebrow, heading, text }) => {
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [token, setToken] = useState<null | string>(null)
  const [resetSignal, setResetSignal] = useState(0)
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(dismissTimer.current), [])

  const showToast = (type: 'error' | 'success', message: string) => {
    setToast({ message, type })
    clearTimeout(dismissTimer.current)
    dismissTimer.current = setTimeout(() => setToast(null), 5000)
  }

  const subscribe = async (form: HTMLFormElement) => {
    const email = new FormData(form).get('email')
    if (!token) {
      showToast('error', 'Please wait a moment for the security check to finish, then try again.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/next/subscribe', {
        body: JSON.stringify({ email, token }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string }

      if (res.ok) {
        showToast('success', 'Thanks for subscribing! Watch your inbox for the latest offers.')
        form.reset()
      } else {
        showToast('error', data.message || 'Something went wrong. Please try again.')
      }
    } catch {
      showToast('error', 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
      setResetSignal((n) => n + 1)
    }
  }

  return (
    <form
      className="newsletter-form"
      onSubmit={(event) => {
        event.preventDefault()
        const form = event.currentTarget
        if (form.checkValidity() && !submitting) void subscribe(form)
      }}
    >
      {eyebrow && <p className="newsletter-form-eyebrow">{eyebrow}</p>}
      {heading && <h3 className="newsletter-form-heading">{heading}</h3>}
      {text && <p className="newsletter-form-text">{text}</p>}
      <div className="newsletter-form-row">
        <div className="newsletter-form-field-wrap">
          <Mail aria-hidden="true" className="newsletter-form-field-icon" />
          <input className="newsletter-form-field" name="email" placeholder="Your email address" required type="email" />
        </div>
        <button className="newsletter-form-submit-button" disabled={submitting} type="submit">
          {buttonLabel || 'Subscribe'} <Send aria-hidden="true" className="newsletter-form-submit-icon" />
        </button>
      </div>
      <Turnstile onToken={setToken} resetSignal={resetSignal} />

      <div aria-live="polite" className="newsletter-toast-region" role="status">
        {toast && (
          <div className={cn('newsletter-toast', toast.type === 'error' && 'newsletter-toast-error')}>
            {toast.type === 'error' ? (
              <TriangleAlert aria-hidden="true" className="newsletter-toast-icon" />
            ) : (
              <Check aria-hidden="true" className="newsletter-toast-icon" />
            )}
            <p className="newsletter-toast-text">{toast.message}</p>
            <button
              aria-label="Dismiss"
              className="newsletter-toast-close"
              onClick={() => setToast(null)}
              type="button"
            >
              <X aria-hidden="true" className="newsletter-toast-close-icon" />
            </button>
          </div>
        )}
      </div>
    </form>
  )
}
