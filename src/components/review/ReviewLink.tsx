import Link from 'next/link'
import React from 'react'

import { reviewHref } from '@/utilities/reviewHref'

/**
 * Links to a review's detail page, or renders plain (non-clickable) text when that review is
 * temporarily disabled — never a dead `href="#"` link (bad for SEO, misleading for users).
 */
export const ReviewLink: React.FC<{
  children: React.ReactNode
  className?: string
  slug: string
}> = ({ children, className, slug }) => {
  const href = reviewHref(slug)
  if (href === '#') return <span className={className}>{children}</span>
  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  )
}
