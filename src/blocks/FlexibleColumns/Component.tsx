import { ArrowRight, CheckCircle2, Check } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { FlexibleColumnsBlock as Props } from '@/payload-types'

import { CmsImg } from '@/components/CmsImg'
import { SiteLink } from '@/components/Link/SiteLink'
import { Section } from '@/components/Section'
import { ReviewFaqAccordion } from '@/blocks/ReviewFaq/Accordion'
import { ReviewIcon } from '@/components/review/ReviewIcon'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { SOCIAL_PATHS } from '@/utilities/socialIcons'
import { EmailChip } from './EmailChip.client'

type Column = NonNullable<Props['cols']>[number]
type ColumnItem = NonNullable<Column['items']>[number]
type SocialLink = { id?: string | null; platform: string; url: string }

/** Groups consecutive "button" items so they render as one row instead of stacking. */
const groupItems = (items: ColumnItem[]): (ColumnItem | ColumnItem[])[] => {
  const groups: (ColumnItem | ColumnItem[])[] = []
  for (const item of items) {
    const last = groups[groups.length - 1]
    if (item.type === 'button' && Array.isArray(last) && last[0]?.type === 'button') {
      last.push(item)
    } else if (item.type === 'button') {
      groups.push([item])
    } else {
      groups.push(item)
    }
  }
  return groups
}

const WIDTH_CLASS: Record<string, string> = {
  full: 'is-full',
  half: 'is-half',
  quarter: 'is-quarter',
  third: 'is-third',
  twoThirds: 'is-two-thirds',
}

const ColumnItemRenderer: React.FC<{ inCard?: boolean; item: ColumnItem; socialLinks?: SocialLink[] }> = ({
  inCard,
  item,
  socialLinks,
}) => {
  switch (item.type) {
    case 'sectionHeading':
      return (
        <>
          {item.eyebrowText && <p className="section-eyebrow">{item.eyebrowText}</p>}
          {item.title && <h2 className="section-heading">{item.title}</h2>}
        </>
      )
    case 'title':
      if (!item.title) return null
      if (item.icon && item.inlineIcon) {
        return (
          <h3 className="flex-columns-item-title is-inline">
            <ReviewIcon className="flex-columns-item-title-inline-icon" name={item.icon} />
            {item.title}
          </h3>
        )
      }
      if (item.icon) {
        return (
          <>
            <span className="flex-columns-icon-circle">
              <ReviewIcon className="flex-columns-icon-circle-svg" name={item.icon} />
            </span>
            <h3 className="flex-columns-item-title is-standalone">{item.title}</h3>
          </>
        )
      }
      return (
        <h3 className="flex-columns-item-title">
          {inCard && <CheckCircle2 aria-hidden="true" className="flex-columns-item-title-icon" />}
          {item.title}
        </h3>
      )
    case 'text':
      return item.text ? <p className="flex-columns-item-text">{item.text}</p> : null
    case 'image':
      return item.image && typeof item.image === 'object' ? (
        <CmsImg className="flex-columns-item-image" resource={item.image} />
      ) : null
    case 'button':
      return (
        <SiteLink className="flex-columns-item-button" link={item.btn}>
          {item.btn?.label} <ArrowRight aria-hidden="true" className="flex-columns-item-button-icon" />
        </SiteLink>
      )
    case 'emailChip':
      return <EmailChip email={item.email} formAnchor={item.formAnchor} />
    case 'quickFact':
      return item.statValue ? (
        <div className="flex-columns-item-stat">
          <span className="flex-columns-item-stat-value">{item.statValue}</span>
          {item.statLabel && <span className="flex-columns-item-stat-label">{item.statLabel}</span>}
        </div>
      ) : null
    case 'accordion':
      return item.accordionItems?.length ? (
        <ReviewFaqAccordion
          items={item.accordionItems.map(({ answer, question }) => ({ answer, question }))}
        />
      ) : null
    case 'checklistItem':
      return item.title ? (
        <div className="flex-columns-checklist-item">
          <ReviewIcon className="flex-columns-checklist-item-icon" name={item.icon} />
          <span className="flex-columns-checklist-item-label">{item.title}</span>
          <Check aria-hidden="true" className="flex-columns-checklist-item-check" />
        </div>
      ) : null
    case 'helpCard':
      return (
        <div className="flex-columns-help-card">
          <ReviewIcon className="flex-columns-help-card-icon" name={item.icon} />
          {item.title && <h3 className="flex-columns-help-card-title">{item.title}</h3>}
          {item.text && <p className="flex-columns-help-card-text">{item.text}</p>}
          {item.statValue && (
            <div className="flex-columns-help-card-stat">
              {item.statLabel && <p className="flex-columns-help-card-stat-label">{item.statLabel}</p>}
              <p className="flex-columns-help-card-stat-value">{item.statValue}</p>
            </div>
          )}
        </div>
      )
    case 'socialRow':
      return socialLinks && socialLinks.length > 0 ? (
        <div className="flex-columns-social-row">
          {socialLinks.map(({ id, platform, url }, i) => {
            const social = SOCIAL_PATHS[platform]
            if (!social) return null
            const content = (
              <>
                <svg aria-hidden="true" className="flex-columns-social-icon" viewBox="0 0 24 24">
                  <path d={social.path} />
                </svg>
                {social.label}
              </>
            )
            if (url === '#') {
              return (
                <span aria-label={social.label} className="flex-columns-social-link" key={id ?? i}>
                  {content}
                </span>
              )
            }
            return (
              <Link aria-label={social.label} className="flex-columns-social-link" href={url} key={id ?? i}>
                {content}
              </Link>
            )
          })}
        </div>
      ) : null
    default:
      return null
  }
}

export const FlexibleColumnsComponent: React.FC<Props & { id?: string }> = async ({
  anchorId,
  cols,
  eyebrow,
  heading,
  headingHighlight,
  intro,
  tinted,
}) => {
  const needsSocial = (cols || []).some((col) => (col.items || []).some((item) => item.type === 'socialRow'))
  const footerData = needsSocial ? await getCachedGlobal('footer', 0)() : null
  const socialLinks = footerData?.socialLinks || []

  return (
    <Section
      anchorId={anchorId}
      eyebrow={eyebrow}
      heading={heading}
      headingHighlight={headingHighlight}
      intro={intro}
      tinted={tinted}
    >
      <div className="flex-columns-row">
        {(cols || []).map((column, i) => {
          const isCard = column.width !== 'full' && !column.noCard
          return (
            <div
              className={`flex-columns-column ${WIDTH_CLASS[column.width || 'full']}${isCard ? ' is-card' : ''}${column.tintCard ? ' is-tinted' : ''}${column.gradientCard ? ' is-gradient' : ''}`}
              key={column.id ?? i}
            >
              {groupItems(column.items || []).map((entry, j) =>
                Array.isArray(entry) ? (
                  <div className="flex-columns-button-row" key={entry[0]?.id ?? j}>
                    {entry.map((item, k) => (
                      <ColumnItemRenderer inCard={isCard} item={item} key={item.id ?? k} socialLinks={socialLinks} />
                    ))}
                  </div>
                ) : (
                  <ColumnItemRenderer inCard={isCard} item={entry} key={entry.id ?? j} socialLinks={socialLinks} />
                ),
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
