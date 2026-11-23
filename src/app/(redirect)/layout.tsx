import type { Metadata } from 'next'

import { Bricolage_Grotesque } from 'next/font/google'
import React from 'react'

import { cn } from '@/utilities/ui'

import '../(frontend)/globals.css'

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

// Standalone shell for the third-party "Redirecting…" page: no header, footer or site loader,
// and never indexed.
export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={cn(bricolage.variable)} lang="en">
      <head>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>{children}</body>
    </html>
  )
}

export const metadata: Metadata = {
  robots: { follow: false, index: false },
  title: 'Redirecting… | SouthAfricanBet.co.za',
}
