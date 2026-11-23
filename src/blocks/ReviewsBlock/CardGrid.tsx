'use client'
import { BadgeCheck, Check, ChevronDown, Copy, Star } from 'lucide-react'
import React, { useState } from 'react'

import type { Review } from '@/payload-types'

import { BookmakerLogo } from '@/components/BookmakerLogo'
import { ReviewLink } from '@/components/review/ReviewLink'
import { PlayLink } from '@/components/review/PlayLink'
import { cn } from '@/utilities/ui'

const PromoCode: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false)

  return (
    <button
      aria-live="polite"
      className={cn('card-grid-promo-button', copied && 'card-grid-promo-button-copied')}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code)
        } catch {
          const textarea = document.createElement('textarea')
          textarea.value = code
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
        }
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1400)
      }}
      type="button"
    >
      {`Code: ${code}`}{' '}
      <span className="card-grid-promo-icon-flip">
        <Copy
          aria-hidden="true"
          className={cn('card-grid-promo-copy-icon', 'card-grid-promo-icon-front', copied && 'card-grid-promo-icon-hidden-front')}
        />
        <Check
          aria-hidden="true"
          className={cn('card-grid-promo-copy-icon', 'card-grid-promo-icon-back', copied && 'card-grid-promo-icon-visible-back')}
        />
      </span>
    </button>
  )
}

/** Ranked "#1 Pick" cards. Shows the first `initialVisible` and a toggle for the rest. */
export const CardGrid: React.FC<{ initialVisible?: number | null; reviews: Review[] }> = ({
  initialVisible,
  reviews,
}) => {
  const [showAll, setShowAll] = useState(false)

  const limit = initialVisible && initialVisible > 0 ? initialVisible : reviews.length
  const collapsible = reviews.length > limit

  return (
    <div>
      <div className="card-grid-list" id="bookmaker-grid">
        {reviews.map((review, index) => {
          const hidden = !showAll && index >= limit

          return (
            <article className="card-grid-card" hidden={hidden} key={review.id}>
              {index < 3 && <span className="card-grid-pick-badge">#{index + 1} Pick</span>}
              <div className="card-grid-header">
                <BookmakerLogo className="card-grid-logo" review={review} />
                <div>
                  <h3 className="card-grid-title">
                    <ReviewLink slug={review.slug}>{review.title}</ReviewLink>
                  </h3>
                  <span className="card-grid-rating-row">
                    <Star aria-hidden="true" className="card-grid-star-icon" />
                    {review.rating.toFixed(1)}
                    <span className="card-grid-rating-out-of">/5</span>
                  </span>
                </div>
              </div>

              {review.bonusText && (
                <div className="card-grid-bonus-box">
                  <p className="card-grid-bonus-label">Welcome offer</p>
                  <p className="card-grid-bonus-text">{review.bonusText}</p>
                  {review.promotionalCode && (
                    <div className="card-grid-promo-wrap">
                      <PromoCode code={review.promotionalCode} />
                    </div>
                  )}
                </div>
              )}

              {review.features && review.features.length > 0 && (
                <ul className="card-grid-features-list">
                  {review.features.map((feature, i) => (
                    <li className="card-grid-feature-item" key={feature.id ?? i}>
                      <BadgeCheck aria-hidden="true" className="card-grid-feature-icon" />
                      {feature.text}
                    </li>
                  ))}
                </ul>
              )}

              <dl className="card-grid-stats-grid">
                <div className="card-grid-stat-box">
                  <dt className="card-grid-stat-label">Min Deposit</dt>
                  <dd className="card-grid-stat-value">{review.minDeposit || '—'}</dd>
                </div>
                <div className="card-grid-stat-box">
                  <dt className="card-grid-stat-label">Payout</dt>
                  <dd className="card-grid-stat-value">{review.payoutTime || '—'}</dd>
                </div>
                <div className={cn('card-grid-stat-box', 'card-grid-stat-box-wide')}>
                  <dt className="card-grid-stat-label">Games</dt>
                  <dd className="card-grid-stat-value">{review.gamesOffered || '—'}</dd>
                </div>
              </dl>

              <div className="card-grid-cta-row">
                <PlayLink className={cn('btn-primary', 'btn-flex-1')} review={review}>
                  Play Now
                </PlayLink>
                <ReviewLink className="btn-outline-small" slug={review.slug}>
                  Review
                </ReviewLink>
              </div>
              <p className="card-grid-disclaimer">18+ Only | Play Responsibly</p>
            </article>
          )
        })}
      </div>

      {collapsible && (
        <div className="card-grid-show-all-wrap">
          <button
            aria-expanded={showAll}
            className="card-grid-show-all-button"
            onClick={() => setShowAll((open) => !open)}
            type="button"
          >
            {showAll ? 'Show fewer' : `Show all ${reviews.length} bookmakers`}{' '}
            <ChevronDown aria-hidden="true" className="card-grid-show-all-icon" />
          </button>
        </div>
      )}
    </div>
  )
}
