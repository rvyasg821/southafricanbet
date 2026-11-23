const SITE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  'https://example.com'

// Blocks search engines site-wide on every deploy except the live one. Set ALLOW_INDEXING=true
// in that one environment's env vars once it goes live.
const ALLOW_INDEXING = process.env.ALLOW_INDEXING === 'true'

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/news-sitemap.xml', '/pages-sitemap.xml', '/*', '/news/*'],
  robotsTxtOptions: {
    policies: ALLOW_INDEXING
      ? [
          {
            userAgent: '*',
            disallow: ['/admin/*', '/links/'],
          },
        ]
      : [
          {
            userAgent: '*',
            disallow: '/',
          },
        ],
    additionalSitemaps: ALLOW_INDEXING
      ? [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/news-sitemap.xml`]
      : [],
  },
}
