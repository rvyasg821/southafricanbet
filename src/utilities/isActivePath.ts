/** True when `href` is a plain internal path equal to the current page (hash/external/placeholder links never match). */
export const isActivePath = (pathname: null | string, href?: null | string): boolean => {
  if (!pathname || !href || href === '#' || href.includes('#') || /^[a-z][a-z0-9+.-]*:/i.test(href)) return false

  const clean = (value: string) => value.split('?')[0].replace(/\/+$/, '') || '/'
  return clean(pathname) === clean(href)
}
