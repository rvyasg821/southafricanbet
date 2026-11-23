import { Copy, LifeBuoy, Mail, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import type { FormBlockType } from './Component.client'

import { SOCIAL_PATHS } from '@/utilities/socialIcons'

type SocialLink = { id?: string | null; platform: string; url: string }

export const FormSidebar: React.FC<{
  helplineNumber?: string | null
  sidebar: NonNullable<FormBlockType['sidebar']>
  socialLinks: SocialLink[]
}> = ({ helplineNumber, sidebar, socialLinks }) => {
  const { noteLinkLabel, noteLinkUrl, noteText, noteTitle, showGamblingHelp, showSocial, supportEmail, supportNote, supportTitle } =
    sidebar

  const hasNote = Boolean(noteTitle || noteText)
  const hasSupport = Boolean(supportEmail)
  const hasSocial = showSocial && socialLinks.length > 0
  const hasHelp = showGamblingHelp && helplineNumber

  if (!hasNote && !hasSupport && !hasSocial && !hasHelp) return null

  return (
    <div className="form-sidebar">
      {hasNote && (
        <div className="form-sidebar-card is-note">
          <div className="form-sidebar-card-head">
            <TriangleAlert aria-hidden="true" className="form-sidebar-card-icon" />
            {noteTitle && <h3 className="form-sidebar-card-title">{noteTitle}</h3>}
          </div>
          {noteText && <p className="form-sidebar-card-text">{noteText}</p>}
          {noteLinkLabel && noteLinkUrl && (
            <Link className="form-sidebar-card-link" href={noteLinkUrl}>
              {noteLinkLabel}
            </Link>
          )}
        </div>
      )}

      {hasSupport && (
        <div className="form-sidebar-card">
          <div className="form-sidebar-card-head">
            <Mail aria-hidden="true" className="form-sidebar-card-icon is-plain" />
            {supportTitle && <h3 className="form-sidebar-card-title">{supportTitle}</h3>}
          </div>
          {supportNote && <p className="form-sidebar-card-text">{supportNote}</p>}
          <div className="form-sidebar-email-chip">
            <span>{supportEmail}</span>
            <Link aria-label="Copy email" className="form-sidebar-email-chip-copy" href={`mailto:${supportEmail}`}>
              <Copy aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      {hasSocial && (
        <div className="form-sidebar-card">
          <h3 className="form-sidebar-card-title">Stay connected</h3>
          <p className="form-sidebar-card-text">Betting tips, bonus news and insights from the SA betting scene.</p>
          <div className="form-sidebar-social-row">
            {socialLinks.map(({ id, platform, url }, i) => {
              const social = SOCIAL_PATHS[platform]
              if (!social) return null
              const content = (
                <>
                  <svg aria-hidden="true" className="form-sidebar-social-icon" viewBox="0 0 24 24">
                    <path d={social.path} />
                  </svg>
                  {social.label}
                </>
              )
              if (url === '#') {
                return (
                  <span aria-label={social.label} className="form-sidebar-social-link" key={id ?? i}>
                    {content}
                  </span>
                )
              }
              return (
                <Link aria-label={social.label} className="form-sidebar-social-link" href={url} key={id ?? i}>
                  {content}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {hasHelp && (
        <div className="form-sidebar-card is-help">
          <div className="form-sidebar-card-head">
            <LifeBuoy aria-hidden="true" className="form-sidebar-card-icon is-help" />
            <h3 className="form-sidebar-card-title">Need help with gambling?</h3>
          </div>
          <p className="form-sidebar-card-text">Free, confidential support from the National Responsible Gambling Programme.</p>
          <p className="form-sidebar-help-number">{helplineNumber}</p>
          <p className="form-sidebar-help-caption">Toll-free helpline</p>
        </div>
      )}
    </div>
  )
}
