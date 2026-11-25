import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { OutgoingLinks } from './collections/OutgoingLinks'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Reviews } from './collections/Reviews'
import { Subscribers } from './collections/Subscribers'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      actions: ['@/components/AdminNavAutoClose#AdminNavAutoClose'],
      // The `BeforeLogin` component renders a message that you see while logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      // The `BeforeDashboard` component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below.
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      icons: [
        { rel: 'icon', sizes: '32x32', type: 'image/x-icon', url: '/favicon.ico' },
        { rel: 'icon', type: 'image/svg+xml', url: '/favicon.svg' },
        { rel: 'icon', sizes: '192x192', type: 'image/png', url: '/favicon-192.png' },
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
      ],
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
  }),
  collections: [Pages, Posts, Reviews, OutgoingLinks, Subscribers, Media, Categories, Users],
  // Real emails (contact form, newsletter alerts) are sent once SMTP_HOST is set; without it Payload just
  // prints them to the terminal.
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@southafricanbet.co.za',
        defaultFromName: 'SouthAfricanBet.co.za',
        transportOptions: {
          auth: process.env.SMTP_USER ? { pass: process.env.SMTP_PASS, user: process.env.SMTP_USER } : undefined,
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: Number(process.env.SMTP_PORT) === 465,
        },
      })
    : undefined,
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
