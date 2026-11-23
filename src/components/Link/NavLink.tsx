'use client'
import { usePathname } from 'next/navigation'
import React from 'react'

import { getLinkHref } from '@/utilities/linkHref'
import { isActivePath } from '@/utilities/isActivePath'
import { cn } from '@/utilities/ui'

import { SiteLink } from './SiteLink'

/** SiteLink that marks itself (aria-current + an extra class) when it points at the page being viewed. */
export const NavLink: React.FC<
  { activeClassName: string } & React.ComponentProps<typeof SiteLink>
> = ({ activeClassName, className, link, ...rest }) => {
  const active = isActivePath(usePathname(), getLinkHref(link))

  return (
    <SiteLink
      {...rest}
      aria-current={active ? 'page' : undefined}
      className={cn(className, active && activeClassName)}
      link={link}
    />
  )
}
