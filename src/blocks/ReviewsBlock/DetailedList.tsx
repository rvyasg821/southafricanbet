import { ArrowRight, Star, Trophy } from 'lucide-react'
import React from 'react'

import type { Review } from '@/payload-types'

import { BookmakerLogo } from '@/components/BookmakerLogo'
import { PaymentsSlider } from '@/components/PaymentsSlider'
import { PlayLink } from '@/components/review/PlayLink'
import { ReviewLink } from '@/components/review/ReviewLink'
import { cn } from '@/utilities/ui'

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
  <span aria-label={`${rating} out of 5`} className="detailed-list-stars-wrap">
    <span className="detailed-list-stars-bg">
      {[0, 1, 2, 3, 4].map((i) => (
        <Star aria-hidden="true" className="detailed-list-star-icon-empty" key={i} />
      ))}
    </span>
    <span className="detailed-list-stars-fg" style={{ width: `${(rating / 5) * 100}%` }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star aria-hidden="true" className="detailed-list-star-icon-full" key={i} />
      ))}
    </span>
  </span>
)

/** Large "hand-picked" rows: logo + rank, rating, best-for, offer, payments, CTAs and a stats strip. */
export const DetailedList: React.FC<{ reviews: Review[] }> = ({ reviews }) => (
  <div className="detailed-list-list">
    {reviews.map((review) => {
      const payments = (review.paymentMethods || []).filter(
        (method) => method.icon && typeof method.icon === 'object',
      )

      return (
        <article className="detailed-list-card" key={review.id}>
          {review.badge && <span className="detailed-list-badge">{review.badge}</span>}
          <div className="detailed-list-grid">
            <div className="detailed-list-profile-col">
              <BookmakerLogo className="detailed-list-logo" review={review} />
              <div>
                <h3 className="detailed-list-title">
                  <ReviewLink slug={review.slug}>{review.title}</ReviewLink>
                </h3>
                <div className="detailed-list-rating-row">
                  <span className="detailed-list-rating-number">{review.rating.toFixed(1)}</span>
                  <StarRating rating={review.rating} />
                </div>
              </div>
            </div>

            <div className="detailed-list-middle-col">
              {review.bestFor && (
                <p className="detailed-list-best-for">
                  <Trophy aria-hidden="true" className="detailed-list-best-for-icon" /> Best for: {review.bestFor}
                </p>
              )}
              {review.bonusText && <p className="detailed-list-bonus-text">{review.bonusText}</p>}
              {payments.length > 0 && <PaymentsSlider payments={payments} />}
            </div>

            <div className="detailed-list-cta-col">
              <PlayLink className={cn('btn-primary', 'btn-flex-1', 'btn-size-responsive')} review={review}>
                Play Now
              </PlayLink>
              <ReviewLink className="detailed-list-read-review-button" slug={review.slug}>
                Read Review <ArrowRight aria-hidden="true" className="detailed-list-read-review-icon" />
              </ReviewLink>
            </div>
          </div>

          <dl className="detailed-list-stats-grid">
            <div className="detailed-list-stat-cell">
              <dt className="detailed-list-stat-label">Win Rate: </dt>
              <dd className="detailed-list-stat-value">{review.winRate || '—'}</dd>
            </div>
            <div className="detailed-list-stat-cell">
              <dt className="detailed-list-stat-label">Payout Speed: </dt>
              <dd className="detailed-list-stat-value">{review.payoutTime || '—'}</dd>
            </div>
            <div className="detailed-list-stat-cell">
              <dt className="detailed-list-stat-label">Wagering: </dt>
              <dd className="detailed-list-stat-value">{review.wagering || '—'}</dd>
            </div>
            <div className={cn('detailed-list-stat-cell', 'detailed-list-stat-cell-center')}>
              <span>
                <span className="detailed-list-stat-highlight">18+</span> | Play responsibly.
              </span>
            </div>
          </dl>
        </article>
      )
    })}
  </div>
)
