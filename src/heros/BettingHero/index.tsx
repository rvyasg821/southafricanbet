import configPromise from '@payload-config'
import { Gift, ShieldCheck, Sparkles, Trophy } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { Page } from '@/payload-types'

import { ReviewsBlockComponent } from '@/blocks/ReviewsBlock/Component'
import { SiteLink } from '@/components/Link/SiteLink'
import { cn } from '@/utilities/ui'
import { reviewHref } from '@/utilities/reviewHref'

/** Plain text of every paragraph in a Lexical state (the hero intro is a single <p>). */
const paragraphsOf = (richText: Page['hero']['richText']): string[] => {
  const children = (richText as any)?.root?.children || []
  return children
    .filter((node: any) => node.type === 'paragraph')
    .map((node: any) => (node.children || []).map((c: any) => c.text || '').join(''))
    .filter(Boolean)
}

const ICONS = { gift: Gift, trophy: Trophy } as const

/** Scrolling strip of every bookmaker's welcome offer (the list is doubled for a seamless loop). */
const OfferTicker: React.FC = async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs: found } = await payload.find({
    collection: 'reviews',
    depth: 0,
    limit: 20,
    pagination: false,
    select: { bonusText: true, slug: true, title: true },
    sort: 'rank',
  })
  const docs = found.filter((review) => review.title && review.slug)

  if (!docs.length) return null

  return (
    <div className="hero-ticker">
      <div className={cn('animate-marquee', 'hero-ticker-track')}>
        {[...docs, ...docs].map((review, i) => {
          const clone = i >= docs.length
          const content = (
            <>
              <Sparkles aria-hidden="true" className="hero-ticker-icon" /> {review.title}:{' '}
              <span className="hero-ticker-offer">{review.bonusText}</span>
            </>
          )
          const href = reviewHref(review.slug)

          if (href === '#') {
            return (
              <span aria-hidden={clone || undefined} className="hero-ticker-item" key={i}>
                {content}
              </span>
            )
          }

          return (
            <Link
              aria-hidden={clone || undefined}
              className="hero-ticker-item"
              href={href}
              key={i}
              tabIndex={clone ? -1 : undefined}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export const BettingHero: React.FC<Page['hero']> = ({
  badge,
  byline,
  bylineRole,
  headingHighlight,
  headingLine1,
  headingLine2,
  links,
  richText,
  updatedText,
}) => {
  // Backwards compatible: an H1 inside the rich text is still used when the explicit lines are empty.
  const rootChildren = (richText as any)?.root?.children || []
  const headingNode = rootChildren.find((n: any) => n.type === 'heading' && n.tag === 'h1')
  const legacyHeading: string = headingNode?.children?.map((c: any) => c.text || '').join('') || ''

  let line1 = headingLine1 || ''
  let line2 = headingLine2 || ''
  let highlight = headingHighlight || ''
  if (!line1 && legacyHeading) {
    const lead = highlight && legacyHeading.endsWith(highlight) ? legacyHeading.slice(0, -highlight.length) : legacyHeading
    line1 = lead.trim()
    line2 = ''
  }

  const intro = paragraphsOf(richText)
  const author = byline?.replace(/^Written by\s+/i, '') || ''
  const initials = author
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <section className={cn('bg-hero', 'hero')}>
      <div className="hero-grid">
        <div className="hero-content">
          {badge && (
            <span className="hero-badge">
              <ShieldCheck aria-hidden="true" className="hero-badge-icon" />
              {badge}
            </span>
          )}

          {(line1 || line2 || highlight) && (
            <h1 className="hero-heading">
              {line1 && <span className="hero-heading-line">{line1}</span>}
              {(line2 || highlight) && (
                <span className="hero-heading-line">
                  {line2}
                  {line2 && highlight && ' '}
                  {highlight && <span className="text-gradient">{highlight}</span>}
                </span>
              )}
            </h1>
          )}

          {intro.map((text, i) => (
            <p className="hero-intro" key={i}>
              {text}
            </p>
          ))}

          {Array.isArray(links) && links.length > 0 && (
            <div className="hero-cta-row">
              {links.map(({ id, link }, i) => {
                const Icon = link?.icon ? ICONS[link.icon as keyof typeof ICONS] : null
                const outline = link?.appearance === 'outline'
                return (
                  <SiteLink
                    className={cn('hero-cta-button', outline ? 'hero-cta-outline' : 'hero-cta-solid')}
                    key={id ?? i}
                    link={link}
                  >
                    {Icon && (
                      <Icon aria-hidden="true" className={cn('hero-cta-icon', outline && 'hero-cta-icon-outline')} />
                    )}
                    {link?.label}
                  </SiteLink>
                )
              })}
            </div>
          )}

          {byline && (
            <div className="hero-byline-row">
              <div className="hero-avatar">{initials}</div>
              <div>
                <p className="hero-byline-name">
                  {byline}
                  {bylineRole && <span className="hero-byline-role"> · {bylineRole}</span>}
                </p>
                {updatedText && <p className="hero-updated-text">{updatedText}</p>}
              </div>
            </div>
          )}
        </div>

        <ReviewsBlockComponent
          blockType="reviewsBlock"
          heading="Top 5 Verified Bookmakers"
          limit={5}
          source="featured"
          variant="compact-list"
          viewAllLink={{ type: 'custom', url: '/#top', label: 'View all' }}
        />
      </div>
      <OfferTicker />
    </section>
  )
}
