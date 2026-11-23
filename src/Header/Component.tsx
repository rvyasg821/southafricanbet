import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'

/** "Get Bonus" always points at the #1 ranked bookmaker's own Play Now link. */
const getTopOffer = async () => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'reviews',
    depth: 0,
    limit: 1,
    pagination: false,
    select: { playNowUrl: true, title: true },
    sort: 'rank',
  })

  const topReview = docs[0]
  if (!topReview?.playNowUrl) return null

  return { playNowUrl: topReview.playNowUrl, title: topReview.title }
}

export async function Header() {
  const [headerData, topOffer] = await Promise.all([getCachedGlobal('header', 1)(), getTopOffer()])

  return <HeaderClient data={headerData} topOffer={topOffer} />
}
