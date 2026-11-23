import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { verifyCaptcha } from '@/utilities/captcha'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const WINDOW_MS = 60_000
const MAX_PER_WINDOW = 5
const hits = new Map<string, number[]>()

const tooManyRequests = (ip: string) => {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > MAX_PER_WINDOW
}

const json = (message: string, status: number) => Response.json({ message }, { status })

/** Newsletter signup: captcha -> save in the CMS -> email the site owner. */
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (tooManyRequests(ip)) return json('Too many attempts. Please try again in a minute.', 429)

  let body: { email?: unknown; token?: unknown }
  try {
    body = await request.json()
  } catch {
    return json('Invalid request.', 400)
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return json('Please enter a valid email address.', 400)

  if (!(await verifyCaptcha(typeof body.token === 'string' ? body.token : null, ip))) {
    return json('Captcha check failed. Please try again.', 400)
  }

  const payload = await getPayload({ config: configPromise })

  const existing = await payload.find({
    collection: 'subscribers',
    depth: 0,
    limit: 1,
    pagination: false,
    where: { email: { equals: email } },
  })
  // Already subscribed: report success without saving or emailing again (and without revealing it).
  if (existing.docs.length) return Response.json({ ok: true })

  try {
    await payload.create({ collection: 'subscribers', data: { email } })
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Newsletter signup could not be saved' })
    return json('Something went wrong. Please try again later.', 500)
  }

  try {
    await payload.sendEmail({
      subject: 'New newsletter subscriber',
      text: `${email} just subscribed to the SouthAfricanBet.co.za newsletter.`,
      to: process.env.NOTIFY_EMAIL || 'info@southafricanbet.co.za',
    })
  } catch (error) {
    // The signup is already saved; a failed alert email shouldn't make the visitor see an error.
    payload.logger.error({ err: error, msg: 'Newsletter alert email failed' })
  }

  return Response.json({ ok: true })
}
