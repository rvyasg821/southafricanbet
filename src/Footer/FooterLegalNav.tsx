'use client'
import React, { useEffect, useRef } from 'react'

import type { Footer } from '@/payload-types'

import { SiteLink } from '@/components/Link/SiteLink'

type NavItem = NonNullable<Footer['navItems']>[number]

const AUTO_SCROLL_BREAKPOINT = 991
const SPEED_PX_PER_FRAME = 0.5

/** Legal links row. Below 992px it auto-scrolls like a slider, pausing on hover/focus and supporting drag + click. */
export const FooterLegalNav: React.FC<{ items: NavItem[] }> = ({ items }) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const startXRef = useRef(0)
  const startScrollRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let rafId: number

    const step = () => {
      if (window.innerWidth <= AUTO_SCROLL_BREAKPOINT && !pausedRef.current && !draggingRef.current) {
        const half = track.scrollWidth / 2
        track.scrollLeft += SPEED_PX_PER_FRAME
        if (track.scrollLeft >= half) {
          track.scrollLeft -= half
        }
      }
      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.innerWidth > AUTO_SCROLL_BREAKPOINT || !trackRef.current) return
    draggingRef.current = true
    movedRef.current = false
    startXRef.current = e.clientX
    startScrollRef.current = trackRef.current.scrollLeft
    trackRef.current.setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || !trackRef.current) return
    const delta = e.clientX - startXRef.current
    if (Math.abs(delta) > 4) movedRef.current = true
    trackRef.current.scrollLeft = startScrollRef.current - delta
  }

  const endDrag = () => {
    draggingRef.current = false
  }

  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (movedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      movedRef.current = false
    }
  }

  const renderLinks = (clone: boolean) =>
    items.map(({ id, link }, i) => (
      <SiteLink
        aria-hidden={clone || undefined}
        className="site-footer-legal-link"
        key={`${clone ? 'clone' : 'orig'}-${id ?? i}`}
        link={link}
        tabIndex={clone ? -1 : undefined}
      >
        <span className="site-footer-legal-link-label" data-text={link?.label || ''}>
          {link?.label}
        </span>
      </SiteLink>
    ))

  return (
    <nav
      aria-label="Legal"
      className="site-footer-legal-nav"
      onBlur={() => {
        pausedRef.current = false
      }}
      onFocus={() => {
        pausedRef.current = true
      }}
      onMouseEnter={() => {
        pausedRef.current = true
      }}
      onMouseLeave={() => {
        pausedRef.current = false
      }}
    >
      <div
        className="site-footer-legal-track"
        onClickCapture={onClickCapture}
        onPointerCancel={endDrag}
        onPointerDown={onPointerDown}
        onPointerLeave={endDrag}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        ref={trackRef}
      >
        <div className="site-footer-legal-group">{renderLinks(false)}</div>
        <div className="site-footer-legal-group site-footer-legal-group-clone">{renderLinks(true)}</div>
      </div>
    </nav>
  )
}
