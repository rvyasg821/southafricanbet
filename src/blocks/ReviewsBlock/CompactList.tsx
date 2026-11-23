import { Star } from 'lucide-react'
import React from 'react'

import type { Review } from '@/payload-types'

import { BookmakerLogo } from '@/components/BookmakerLogo'
import { SiteLink } from '@/components/Link/SiteLink'
import { PlayLink } from '@/components/review/PlayLink'
import { ReviewLink } from '@/components/review/ReviewLink'
import { cn } from '@/utilities/ui'
import type { LinkFields } from '@/utilities/linkHref'

/** "Top 5 Verified Bookmakers" widget: ranked rows with logo, rating, offer and a PLAY button. */
export const CompactList: React.FC<{
  heading?: string | null
  reviews: Review[]
  viewAllLink?: LinkFields | null
}> = ({ heading, reviews, viewAllLink }) => (
  <div className="compact-list-panel">
    <div className="compact-list-panel-head">
      {heading && <h2 className="compact-list-heading">{heading}</h2>}
      <SiteLink className="compact-list-view-all" link={viewAllLink} />
    </div>
    <ol className="compact-list-list">
      {reviews.map((review, index) => (
        <li className="compact-list-row" key={review.id}>
          <span className="compact-list-rank">{index + 1}</span>
          <BookmakerLogo className="compact-list-logo" review={review} />
          <div className="compact-list-info">
            <div className="compact-list-info-top">
              <ReviewLink className="compact-list-name" slug={review.slug}>
                {review.title}
              </ReviewLink>
              <span className="compact-list-rating">
                <Star aria-hidden="true" className="compact-list-star-icon" />
                {review.rating.toFixed(1)}
                <span className="compact-list-rating-out-of">/5</span>
              </span>
            </div>
            {review.bonusText && <p className="compact-list-bonus">{review.bonusText}</p>}
          </div>
          <PlayLink className={cn('btn-primary', 'btn-size-compact')} review={review}>
            Play
          </PlayLink>
        </li>
      ))}
    </ol>
  </div>
)
