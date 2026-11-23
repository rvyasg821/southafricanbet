import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { Bricolage_Grotesque } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { SiteLoader } from '@/components/SiteLoader'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={cn(bricolage.variable)} data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon-192.png" rel="icon" sizes="192x192" type="image/png" />
        <link href="/favicon-512.png" rel="icon" sizes="512x512" type="image/png" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
      </head>
      <body>
        <SiteLoader />
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <div className="min-h-screen">
            <Header />
            <main>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

/**
 * Blocks search engines by default (test server, staging, any deploy that isn't the public
 * live site). Set ALLOW_INDEXING=true in that one environment's env vars once it goes live.
 */
const allowIndexing = process.env.ALLOW_INDEXING === 'true'

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  robots: allowIndexing
    ? undefined
    : {
        follow: false,
        googleBot: { follow: false, index: false, noimageindex: true },
        index: false,
        nocache: true,
      },
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
