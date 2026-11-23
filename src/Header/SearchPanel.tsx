'use client'
import { ArrowRight, CalendarDays, Search, SearchX, Star, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

import type { SearchResults } from '@/app/(frontend)/next/search/route'

import { initialsLogoSrc } from '@/components/BookmakerLogo'
import { cn } from '@/utilities/ui'
import { reviewHref } from '@/utilities/reviewHref'

/** Only these bookmakers link to their page from the search panel for now; everything else is plain. */
const LINKABLE_REVIEW_SLUGS = new Set(['10bet'])

/** A result row: a link when it has a destination, otherwise a static (non-clickable) row. */
const ResultRow: React.FC<{ children: React.ReactNode; href?: string; onClose: () => void }> = ({
  children,
  href,
  onClose,
}) =>
  href ? (
    <Link className="search-panel-result-row" href={href} onClick={onClose}>
      {children}
    </Link>
  ) : (
    <div className="search-panel-result-row">{children}</div>
  )

const SUGGESTIONS = ['Free spins', 'Welcome bonus', 'Rugby', 'Payout']

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const formatDate = (iso: string) => {
  const date = new Date(iso)
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

const Label: React.FC<{ children: React.ReactNode; count?: number }> = ({ children, count }) => (
  <p className="search-panel-results-label">
    {children}
    {count !== undefined && <span className="search-panel-results-label-count">{count}</span>}
  </p>
)

/** Dropdown search under the sticky header: live bookmaker + article results from /next/search. */
export const SearchPanel: React.FC<{ onClose: () => void; open: boolean }> = ({ onClose, open }) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResults | null>(null)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  // Escape closes the panel.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Debounced fetch; an empty query loads the suggestions (top bookmakers, latest articles).
  useEffect(() => {
    if (!open) return
    const controller = new AbortController()
    setLoading(true)
    const timer = window.setTimeout(
      async () => {
        try {
          const response = await fetch(`/next/search?q=${encodeURIComponent(query.trim())}`, {
            signal: controller.signal,
          })
          if (!response.ok) throw new Error(String(response.status))
          setResults((await response.json()) as SearchResults)
          setFailed(false)
        } catch (error) {
          if ((error as Error).name !== 'AbortError') setFailed(true)
        } finally {
          if (!controller.signal.aborted) setLoading(false)
        }
      },
      query ? 200 : 0,
    )
    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [open, query])

  if (!open) return null

  const term = query.trim()
  const hasResults = !!results && (results.reviews.length > 0 || results.posts.length > 0)
  const empty = !!results && !hasResults && !loading && results.query === term

  return (
    <>
      <button aria-label="Close search" className="search-panel-scrim" onClick={onClose} tabIndex={-1} type="button" />
      <div aria-label="Site search" className="search-panel-panel" role="dialog">
        <div className="search-panel-panel-inner">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (!term) return
              router.push(`/search?q=${encodeURIComponent(term)}`)
              onClose()
            }}
          >
            <div className="search-panel-field-wrap">
              <Search aria-hidden="true" className="search-panel-field-icon" />
              <input
                aria-label="Search bookmakers, sports, bonuses"
                autoComplete="off"
                className="search-panel-field"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search bookmakers, sports…"
                ref={inputRef}
                type="search"
                value={query}
              />
              <div className="search-panel-field-actions">
                {query && (
                  <button
                    aria-label="Clear search"
                    className="search-panel-clear-button"
                    onClick={() => {
                      setQuery('')
                      inputRef.current?.focus()
                    }}
                    type="button"
                  >
                    <X aria-hidden="true" className="search-panel-clear-button-icon" />
                  </button>
                )}
              </div>
            </div>
          </form>

          <div aria-busy={loading} className="search-panel-body">
            {failed && (
              <p className="search-panel-error-notice">Search is unavailable right now. Please try again in a moment.</p>
            )}

            {!failed && !results && <p className="search-panel-loading-notice">Searching…</p>}

            {empty && (
              <div className="search-panel-empty">
                <span className="search-panel-empty-icon">
                  <SearchX aria-hidden="true" className="search-panel-empty-icon-glyph" />
                </span>
                <p className="search-panel-empty-title">No results for “{term}”</p>
                <p className="search-panel-empty-hint">Check the spelling or try one of these:</p>
                <div className="search-panel-empty-suggestions">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      className="search-panel-suggestion-button"
                      key={suggestion}
                      onClick={() => setQuery(suggestion)}
                      type="button"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!failed && hasResults && results && (
              <div className={cn('search-panel-results-grid', loading && 'search-panel-results-grid-loading')}>
                {results.reviews.length > 0 && (
                  <div className="search-panel-results-column">
                    <Label count={term ? results.reviews.length : undefined}>
                      {term ? 'Bookmakers' : 'Top bookmakers'}
                    </Label>
                    <ul className="search-panel-results-list">
                      {results.reviews.map((review) => (
                        <li key={review.id}>
                          <ResultRow href={LINKABLE_REVIEW_SLUGS.has(review.slug) ? reviewHref(review.slug) : undefined} onClose={onClose}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              alt=""
                              className="search-panel-result-logo"
                              src={review.logo || initialsLogoSrc(review.title, review.brandColor)}
                            />
                            <div className="search-panel-result-info">
                              <div className="search-panel-result-info-top">
                                <span className="search-panel-result-name">{review.title}</span>
                                <span className="search-panel-result-rating">
                                  <Star aria-hidden="true" className="search-panel-result-star-icon" />
                                  {review.rating.toFixed(1)}
                                  <span className="search-panel-result-rating-out-of">/5</span>
                                </span>
                              </div>
                              {review.bonusText && <p className="search-panel-result-bonus">{review.bonusText}</p>}
                            </div>
                            {LINKABLE_REVIEW_SLUGS.has(review.slug) && (
                              <ArrowRight aria-hidden="true" className="search-panel-result-arrow" />
                            )}
                          </ResultRow>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {results.posts.length > 0 && (
                  <div className="search-panel-results-column">
                    <Label count={term ? results.posts.length : undefined}>
                      {term ? 'Articles' : 'Latest articles'}
                    </Label>
                    <ul className="search-panel-results-list">
                      {results.posts.map((post) => (
                        <li key={post.id}>
                          <ResultRow onClose={onClose}>
                            {post.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img alt="" className="search-panel-post-thumb" src={post.image} />
                            ) : (
                              <span className="search-panel-post-thumb-placeholder" />
                            )}
                            <div className="search-panel-result-info">
                              <p className="search-panel-post-title">{post.title}</p>
                              <p className="search-panel-post-meta">
                                {post.category}
                                {post.category && post.publishedAt && <span aria-hidden="true">·</span>}
                                {post.publishedAt && (
                                  <>
                                    <CalendarDays aria-hidden="true" className="search-panel-post-meta-icon" />
                                    {formatDate(post.publishedAt)}
                                  </>
                                )}
                              </p>
                            </div>
                          </ResultRow>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {term && hasResults && (
              <div className="search-panel-see-all">
                <Link
                  className="search-panel-see-all-link"
                  href={`/search?q=${encodeURIComponent(term)}`}
                  onClick={onClose}
                >
                  See all results for “{term}” <ArrowRight aria-hidden="true" className="search-panel-see-all-icon" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
