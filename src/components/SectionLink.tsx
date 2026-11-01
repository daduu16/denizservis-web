"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef } from "react";
import { resolveSectionHref } from "../lib/section-href";

/** Let the browser handle same-page anchors, including repeated hash clicks. */
export function SectionLink({ href, ...props }: ComponentPropsWithoutRef<"a"> & { href: string }) {
  const pathname = usePathname();
  const resolvedHref = resolveSectionHref(pathname, href);
  const [targetPath, hash] = resolvedHref.split("#");

  if (hash && pathname === targetPath) {
    return <a href={`#${hash}`} {...props} />;
  }
  return <Link href={resolvedHref} {...props} />;
}
