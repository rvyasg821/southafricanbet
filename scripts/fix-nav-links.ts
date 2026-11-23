import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

/** label -> review slug, matched case-insensitively against stored nav labels */
const REVIEW_SLUG_BY_LABEL: Record<string, string> = {
  '10bet': '10bet',
  apexbets: 'apexbets',
  bettabets: 'bettabets',
  easybet: 'easybet',
  hollywoodbets: 'hollywoodbets',
  jabulabets: 'jabulabets',
  luckyfish: 'luckyfish',
  pantherbet: 'pantherbet',
  playabets: 'playabets',
  supersportbet: 'supersportbet',
  yesplay: 'yesplay',
  zarbet: 'zarbet',
}

const run = async () => {
  const payload = await getPayload({ config: configPromise })
  const ctx = { disableRevalidate: true }

  const header = await payload.findGlobal({ slug: 'header' })
  let headerChanged = 0
  const navItems = (header.navItems || []).map((item) => ({
    ...item,
    children: (item.children || []).map((child) => {
      const slug = REVIEW_SLUG_BY_LABEL[child.label.toLowerCase()]
      if (slug && child.url !== `/reviews/${slug}`) {
        headerChanged++
        return { ...child, url: `/reviews/${slug}` }
      }
      return child
    }),
  }))
  await payload.updateGlobal({ slug: 'header', data: { navItems }, context: ctx })
  payload.logger.info(`Header: fixed ${headerChanged} bookmaker dropdown link(s)`)

  const footer = await payload.findGlobal({ slug: 'footer' })
  let footerChanged = 0

  const footerNavItems = (footer.navItems || []).map((item) => {
    if (item.link?.label === 'Contact Us' && item.link.url !== '/contact') {
      footerChanged++
      return { ...item, link: { ...item.link, url: '/contact' } }
    }
    return item
  })

  const columns = (footer.columns || []).map((column) => ({
    ...column,
    navItems: (column.navItems || []).map((item) => {
      const label = item.link?.label || ''
      const slug = REVIEW_SLUG_BY_LABEL[label.toLowerCase()]
      if (slug && item.link.url !== `/reviews/${slug}`) {
        footerChanged++
        return { ...item, link: { ...item.link, url: `/reviews/${slug}` } }
      }
      return item
    }),
  }))

  await payload.updateGlobal({
    slug: 'footer',
    data: { navItems: footerNavItems, columns },
    context: ctx,
  })
  payload.logger.info(`Footer: fixed ${footerChanged} link(s)`)

  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
