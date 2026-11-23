/**
 * Sends one test email through the site's real email setup, to confirm the SMTP details in .env work.
 *
 *   npx tsx scripts/test-email.ts you@example.com
 */
import 'dotenv/config'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const to = process.argv[2]

const run = async () => {
  if (!to) throw new Error('Usage: npx tsx scripts/test-email.ts you@example.com')
  if (!process.env.SMTP_HOST) {
    throw new Error('SMTP_HOST is not set in .env, so emails are only printed in the terminal and never sent.')
  }

  const payload = await getPayload({ config: configPromise })
  await payload.sendEmail({
    subject: 'SouthAfricanBet.co.za test email',
    text: 'If you can read this, the SMTP settings work and the contact and newsletter forms can send email.',
    to,
  })
  console.log(`Sent. Check the inbox (and spam) of ${to}.`)
  process.exit(0)
}

run().catch((error) => {
  console.error('FAILED:', error instanceof Error ? error.message : error)
  process.exit(1)
})
