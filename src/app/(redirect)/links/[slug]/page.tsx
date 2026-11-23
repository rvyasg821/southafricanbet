import configPromise from '@payload-config'
import { ExternalLink } from 'lucide-react'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import { CmsImg } from '@/components/CmsImg'
import { RedirectProgress } from '@/components/RedirectProgress'
import { getCachedGlobal } from '@/utilities/getGlobals'

type Args = { params: Promise<{ slug: string }> }

/** Third-party link bridge: /links/<slug> -> "Redirecting…" screen -> the stored destination URL. */
export default async function OutgoingLinkPage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'outgoing-links',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { slug: { equals: slug } },
  })
  const link = docs[0]

  // Unknown slug (or anything that isn't a plain http(s) URL): send the visitor home.
  if (!link || !/^https?:\/\//i.test(link.url)) redirect('/')

  const header = await getCachedGlobal('header', 1)()
  const helpline = header?.helplineNumber || '0800 006 008'

  return (
    <div className="redirect-page">
      <main className="redirect-card" role="main">
        <div className="redirect-stripe" />
        <div className="redirect-body">
          {header?.logo && typeof header.logo === 'object' ? (
            <CmsImg alt="SouthAfricanBet.co.za" className="redirect-logo" loading="eager" resource={header.logo} />
          ) : (
            <span className="redirect-logo-text">
              SouthAfrican<span>Bet</span>.co.za
            </span>
          )}

          <div aria-hidden="true" className="redirect-route">
            <div className="redirect-chip">
              <div className="redirect-chip-ring" />
              <div className="redirect-chip-core" />
            </div>
            <div className="redirect-track" />
            <div className="redirect-dest">
              <ExternalLink size={26} strokeWidth={2.2} />
            </div>
          </div>

          <h1 className="redirect-heading">
            Redirecting you <span className="redirect-heading-name">now…</span>
          </h1>
          <p className="redirect-sub">Please wait while we take you to {link.title}.</p>

          <RedirectProgress url={link.url} />

          <a className="redirect-back" href="/">
            ← Back to SouthAfricanBet.co.za
          </a>
        </div>
        <div className="redirect-foot">
          <span className="redirect-badge-18">18+</span>
          <span>
            You&apos;re leaving SouthAfricanBet.co.za. Gamble responsibly · T&amp;Cs apply · Helpline{' '}
            <b>{helpline}</b>
          </span>
        </div>
      </main>
    </div>
  )
}
