'use client'
import { useNav } from '@payloadcms/ui'
import { useEffect } from 'react'

/**
 * Closes the admin sidebar drawer after navigating to another page (drawer mode is <= 1440px wide).
 * Lives in the header "actions", which re-mounts on every page change, so mounting = a navigation.
 */
export const AdminNavAutoClose = () => {
  const { setNavOpen } = useNav()

  useEffect(() => {
    if (window.matchMedia('(max-width: 1440px)').matches) setNavOpen(false)
  }, [setNavOpen])

  return null
}
