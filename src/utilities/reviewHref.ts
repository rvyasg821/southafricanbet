/**
 * `/reviews/[slug]` now exists, so every "Play", "Review", bookmaker-name and bookmaker-logo
 * link that uses `reviewHref()` navigates there instead of falling back to `#`.
 */
export const REVIEW_PAGE_EXISTS = true

/** Slugs temporarily pulled from linking (still shown, just not clickable to their detail page). */
const DISABLED_REVIEW_SLUGS = new Set(['easybet'])

export const isReviewLinkDisabled = (slug: string): boolean => DISABLED_REVIEW_SLUGS.has(slug)

export const reviewHref = (slug: string): string =>
  REVIEW_PAGE_EXISTS && !isReviewLinkDisabled(slug) ? `/reviews/${slug}` : '#'
