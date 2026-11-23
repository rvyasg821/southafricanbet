import Link from 'next/link'
import React from 'react'

import { getLinkHref, type LinkFields } from '@/utilities/linkHref'

/** Unstyled CMS link: resolves the href and renders next/link with the given classes. */
export const SiteLink: React.FC<{
  'aria-current'?: 'page'
  'aria-hidden'?: boolean
  children?: React.ReactNode
  className?: string
  link?: LinkFields | null
  tabIndex?: number
}> = ({ children, className, link, tabIndex, ...rest }) => {
  const href = getLinkHref(link)
  if (!href) return null

  // "#" is this project's placeholder for "no destination yet" — render plain text instead of a
  // dead crawlable link (bad for SEO, and misleading for users since nothing happens on click).
  if (href === '#') {
    return (
      <span className={className} {...rest}>
        {children ?? link?.label}
      </span>
    )
  }

  const external = /^https?:\/\//.test(href)
  const extra = link?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}

  return (
    <Link
      className={className}
      href={href}
      tabIndex={tabIndex}
      {...(external && !link?.newTab ? { rel: 'noopener' } : {})}
      {...extra}
      {...rest}
    >
      {children ?? link?.label}
    </Link>
  )
}
