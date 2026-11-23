import { BadgeCheck, Phone, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { CmsImg } from '@/components/CmsImg'
import { cn } from '@/utilities/ui'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { SOCIAL_PATHS } from '@/utilities/socialIcons'
import { FooterColumns } from './FooterColumns'
import { FooterLegalNav } from './FooterLegalNav'
import { NewsletterForm } from './NewsletterForm'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()
  const headerData = await getCachedGlobal('header', 1)()

  const columns = footerData?.columns || []
  const navItems = footerData?.navItems || []
  const authorities = footerData?.licensingAuthorities || []
  const newsletter = footerData?.newsletter
  const socialLinks = footerData?.socialLinks || []
  const helpline = footerData?.helplineNumber || headerData?.helplineNumber
  const logo = footerData?.logo && typeof footerData.logo === 'object' ? footerData.logo : null

  return (
    <footer className={cn('bg-footer', 'site-footer')}>
      <div className={cn('stripe-sa', 'site-footer-flag-stripe')} />
      <div className="site-footer-container">
        <div className="site-footer-top-row">
          <div>
            {logo ? (
              <CmsImg alt="SouthAfricanBet.co.za" className="site-footer-logo-image" resource={logo} />
            ) : (
              <span className="site-footer-logo-text">
                SouthAfrican<span className="site-footer-logo-accent">Bet</span>.co.za
              </span>
            )}
            {footerData?.description && <p className="site-footer-description">{footerData.description}</p>}
            {helpline && (
              <a className="site-footer-helpline-link" href={`tel:${helpline.replace(/\s+/g, '')}`}>
                <Phone aria-hidden="true" className="site-footer-helpline-icon" /> Toll-Free Helpline: {helpline}
              </a>
            )}
          </div>
          {newsletter?.text && (
            <NewsletterForm
              buttonLabel={newsletter.buttonLabel}
              eyebrow={newsletter.heading}
              heading={newsletter.text}
              text={newsletter.disclaimer}
            />
          )}
        </div>

        <div className="site-footer-notice-box">
          <span className="site-footer-notice-badge">18+</span>
          <div className="site-footer-notice-body">
            <p className="site-footer-notice-title">
              {footerData?.responsibleGamblingText || 'Gambling can be addictive, please play responsibly'}
            </p>
            {footerData?.responsibleGamblingSubtext && (
              <p className="site-footer-notice-subtext">{footerData.responsibleGamblingSubtext}</p>
            )}
          </div>
          {authorities.length > 0 && (
            <div className="site-footer-authorities">
              {authorities.map((authority, i) => (
                <span className="site-footer-authority-badge" key={authority.id ?? i}>
                  {i === 0 ? (
                    <ShieldCheck aria-hidden="true" className="site-footer-authority-icon-primary" />
                  ) : (
                    <BadgeCheck aria-hidden="true" className="site-footer-authority-icon-gold" />
                  )}
                  {authority.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="site-footer-columns-grid">
          <FooterColumns columns={columns} />
        </div>

        <div className="site-footer-bottom-bar">
          {navItems.length > 0 && <FooterLegalNav items={navItems} />}
          <div className="site-footer-bottom-row">
            <p className="site-footer-copyright">
              {footerData?.copyright ||
                `© ${new Date().getFullYear()} SouthAfricanBet.co.za. All rights reserved. 18+ only. Terms and conditions apply.`}
            </p>
            {socialLinks.length > 0 && (
              <div className="site-footer-social-row">
                {socialLinks.map(({ id, platform, url }, i) => {
                  const social = SOCIAL_PATHS[platform]
                  if (!social) return null
                  const icon = (
                    <svg aria-hidden="true" className="site-footer-social-icon" viewBox="0 0 24 24">
                      <path d={social.path} />
                    </svg>
                  )
                  if (url === '#') {
                    return (
                      <span aria-label={social.label} className="site-footer-social-link" key={id ?? i}>
                        {icon}
                      </span>
                    )
                  }
                  return (
                    <Link aria-label={social.label} className="site-footer-social-link" href={url} key={id ?? i}>
                      {icon}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
