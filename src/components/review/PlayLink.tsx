import React from 'react'

import { isReviewLinkDisabled } from '@/utilities/reviewHref'

import { ReviewLink } from './ReviewLink'

/**
 * "Play" / "Play Now" button in review lists: opens the review's Play Now link (e.g. the local
 * /links/10bet redirect page) in a new tab. With no Play Now link set it falls back to the
 * review's own page so the button is never a dead link; a disabled review stays plain text.
 */
export const PlayLink: React.FC<{
  children: React.ReactNode
  className?: string
  review: { playNowUrl?: null | string; slug: string }
}> = ({ children, className, review }) => {
  if (isReviewLinkDisabled(review.slug)) return <span className={className}>{children}</span>

  if (!review.playNowUrl) {
    return (
      <ReviewLink className={className} slug={review.slug}>
        {children}
      </ReviewLink>
    )
  }

  return (
    <a className={className} href={review.playNowUrl} rel="nofollow noopener sponsored" target="_blank">
      {children}
    </a>
  )
}
