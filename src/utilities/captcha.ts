/**
 * Cloudflare Turnstile (free captcha). In development the public Cloudflare test keys are used, so
 * nothing needs configuring locally; in production TURNSTILE_SECRET_KEY and
 * NEXT_PUBLIC_TURNSTILE_SITE_KEY must be set, otherwise every check fails.
 */
const TEST_SITE_KEY = '1x00000000000000000000AA'
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA'

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || (process.env.NODE_ENV !== 'production' ? TEST_SITE_KEY : '')

export const verifyCaptcha = async (token: null | string | undefined, ip?: null | string): Promise<boolean> => {
  const secret = process.env.TURNSTILE_SECRET_KEY || (process.env.NODE_ENV !== 'production' ? TEST_SECRET_KEY : '')
  if (!secret || !token) return false

  try {
    const body = new URLSearchParams({ response: token, secret })
    if (ip) body.set('remoteip', ip)

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      body,
      method: 'POST',
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
