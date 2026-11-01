"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { navigation, normalizePhone, siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { SectionLink } from "./SectionLink";
import { resolveSectionHref } from "../lib/section-href";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import { lockPageScroll, type PageScrollPosition } from "../lib/mobile-menu";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

function getHash() { return window.location.hash; }
function getServerHash() { return ""; }

export function Header() {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuNav = useRef<HTMLElement>(null);
  const scrollLocked = useRef(false);
  const unlockScroll = useRef<(() => void) | null>(null);
  const openingScroll = useRef<PageScrollPosition | null>(null);
  const closeMenu = useCallback(() => {
    // Unlock before native hash/tel navigation, not in a later effect.
    unlockScroll.current?.();
    setIsOpen(false);
  }, []);
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const phone = normalizePhone(siteConfig.phone);
  const isActive = (href: string) => {
    const [path, section] = resolveSectionHref(pathname, href).split("#");
    return pathname === path && hash === (section ? `#${section}` : "");
  };

  useEffect(() => {
    const onScroll = () => { if (!scrollLocked.current) setIsCompact(window.scrollY > 24); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (!isOpen) return;
    scrollLocked.current = true;
    // Capture before focus/layout changes, rather than after the overlay mounts.
    const release = lockPageScroll(openingScroll.current ?? undefined);
    openingScroll.current = null;
    const unlock = () => {
      release();
      scrollLocked.current = false;
      unlockScroll.current = null;
    };
    unlockScroll.current = unlock;
    return unlock;
  }, [isOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => { if (desktop.matches) closeMenu(); };
    desktop.addEventListener("change", onResize);
    return () => desktop.removeEventListener("change", onResize);
  }, [closeMenu]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      if (event.key === "Escape" && isOpen) {
        // Give the nested language popup its first Escape, regardless of the
        // ordering of native document and React delegated keyboard listeners.
        const target = event.target instanceof Element ? event.target : null;
        if (target?.closest("[data-language-switcher]")?.querySelector('[aria-expanded="true"]')) return;
        closeMenu();
        menuButton.current?.focus({ preventScroll: true });
      }
      if (event.key === "Tab" && isOpen) {
        const links = [...(menuNav.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])]
          .filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);
        const first = menuButton.current;
        const last = links.at(-1);
        if (event.shiftKey && document.activeElement === first && last) { event.preventDefault(); last.focus({ preventScroll: true }); }
        if (!event.shiftKey && document.activeElement === last && first) { event.preventDefault(); first.focus({ preventScroll: true }); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, closeMenu]);

  return (
    <div className={`site-header-shell ${isCompact ? "site-header-shell--compact" : ""} ${isOpen ? "site-header-shell--menu-open" : ""}`}>
      <header className={`site-header ${isCompact ? "site-header--compact" : ""}`}>
      <div className="container header-inner">
        <Link href="/" className="logo-link" aria-label={`${siteConfig.name} — ${t("Əsas səhifə")}`}>
          <Logo className="header-logo" priority />
        </Link>

        <nav className="desktop-nav" aria-label={t("Əsas naviqasiya")}>
          {navigation.map((item) => (
            <SectionLink key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? "nav-link--active" : ""}`} aria-current={isActive(item.href) ? (item.href.includes("#") ? "location" : "page") : undefined}>
              {t(item.label)}
            </SectionLink>
          ))}
        </nav>

        <div className="header-actions">
          <LanguageSwitcher />
          {phone ? (
            <a href={`tel:${phone}`} className="header-phone header-phone--primary" aria-label={`${t("Zəng et")}: ${siteConfig.phone}`} onClick={closeMenu}>
              <Phone aria-hidden="true" size={18} />
              <span className="header-phone-text">{siteConfig.phone}</span>
            </a>
          ) : (
            <span className="header-phone header-phone--disabled" aria-label={t("Telefon nömrəsi tezliklə əlavə olunacaq")}>
              <Phone aria-hidden="true" size={18} />
              <span className="header-phone-text">{t("Nömrə əlavə ediləcək")}</span>
            </span>
          )}
          <button
            ref={menuButton}
            type="button"
            className="icon-button lg:hidden"
            aria-label={t(isOpen ? "Menyunu bağla" : "Menyunu aç")}
            aria-expanded={isOpen}
            aria-controls={isOpen ? "mobile-menu" : undefined}
            onPointerDown={() => {
              if (!isOpen) openingScroll.current = { x: window.scrollX, y: window.scrollY };
            }}
            onClick={() => {
              if (isOpen) closeMenu();
              else {
                openingScroll.current ??= { x: window.scrollX, y: window.scrollY };
                setIsCompact(openingScroll.current.y > 24);
                setIsOpen(true);
              }
            }}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      </header>

      {isOpen && <div className="mobile-menu-backdrop lg:hidden is-open" onClick={closeMenu}>
        <nav
          ref={menuNav}
          id="mobile-menu"
          className="mobile-menu"
          aria-label={t("Mobil naviqasiya")}
          onClick={(event) => event.stopPropagation()}
        >
          {navigation.map((item) => (
            <SectionLink key={item.href} href={item.href} className="mobile-nav-link" aria-current={isActive(item.href) ? (item.href.includes("#") ? "location" : "page") : undefined} onClick={closeMenu}>
              {t(item.label)}
            </SectionLink>
          ))}
          <div className="mobile-language">
            <p className="mobile-language-label">{t("Dil seçimi")}</p>
            <LanguageSwitcher variant="mobile" />
          </div>
          {phone && <a href={`tel:${phone}`} className="button mt-3 w-full" onClick={closeMenu}>
            <Phone aria-hidden="true" size={19} />{siteConfig.phone}
          </a>}
        </nav>
      </div>}
    </div>
  );
}
