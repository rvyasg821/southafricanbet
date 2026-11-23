'use client'
import { ChevronDown } from 'lucide-react'
import React from 'react'

import type { Footer } from '@/payload-types'

import { NavLink } from '@/components/Link/NavLink'
import { cn } from '@/utilities/ui'

type FooterColumnData = NonNullable<Footer['columns']>[number]

/** One footer link group. Collapses into an accordion on mobile/tablet; always open from the desktop breakpoint up. */
export const FooterColumn: React.FC<{ column: FooterColumnData; onToggle: () => void; open: boolean }> = ({
  column,
  onToggle,
  open,
}) => {
  const navItems = column.navItems || []

  return (
    <nav aria-label={column.title} className="site-footer-column">
      <button
        aria-expanded={open}
        className="site-footer-column-toggle"
        onClick={onToggle}
        type="button"
      >
        <span className="site-footer-column-title">{column.title}</span>
        <ChevronDown
          aria-hidden="true"
          className={cn('site-footer-column-chevron', open && 'site-footer-column-chevron-open')}
        />
      </button>
      <span className="site-footer-column-rule" />
      <div className={cn('site-footer-column-panel', open && 'site-footer-column-panel-open')}>
        <ul className="site-footer-column-list">
          {navItems.map(({ id, link }, j) => (
            <li key={id ?? j}>
              <NavLink activeClassName="site-footer-column-link-active" className="site-footer-column-link" link={link} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
