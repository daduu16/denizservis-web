/** Service pages include their own booking form and the shared work gallery. */
export function resolveSectionHref(pathname: string, href: string) {
  if (pathname.startsWith("/xidmetler/") && (href === "/#sifaris" || href === "/#islerimiz")) {
    return `${pathname}${href.slice(1)}`;
  }
  return href;
}
