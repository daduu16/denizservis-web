"use client";

import Link from "next/link";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { navigation, normalizePhone, siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { SectionLink } from "./SectionLink";
import { resolveSectionHref } from "../lib/section-href";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";

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
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const phone = normalizePhone(siteConfig.phone);
  const isActive = (href: string) => {
    const [path, section] = resolveSectionHref(pathname, href).split("#");
    return pathname === path && hash === (section ? `#${section}` : "");
  };

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === "Tab" && isOpen) {
        const links = [...(menuNav.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [])];
        const first = menuButton.current;
        const last = links.at(-1);
        if (event.shiftKey && document.activeElement === first && last) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last && first) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className={`site-header-shell ${isCompact ? "site-header-shell--compact" : ""}`}>
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
            <a href={`tel:${phone}`} className="header-phone header-phone--primary" aria-label={`${t("Zəng et")}: ${siteConfig.phone}`}>
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
            aria-controls="mobile-menu"
            onClick={() => setIsOpen((value) => !value)}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      </header>

      <div className={`mobile-menu-backdrop lg:hidden ${isOpen ? "is-open" : ""}`} onClick={() => setIsOpen(false)}>
        <nav
          ref={menuNav}
          id="mobile-menu"
          className="mobile-menu"
          aria-label={t("Mobil naviqasiya")}
          onClick={(event) => event.stopPropagation()}
        >
          {navigation.map((item) => (
            <SectionLink key={item.href} href={item.href} className="mobile-nav-link" aria-current={isActive(item.href) ? (item.href.includes("#") ? "location" : "page") : undefined} onClick={() => setIsOpen(false)}>
              {t(item.label)}
            </SectionLink>
          ))}
          <div className="mobile-language">
            <p className="mobile-language-label">{t("Dil seçimi")}</p>
            <LanguageSwitcher variant="mobile" />
          </div>
          {phone && <a href={`tel:${phone}`} className="button mt-3 w-full" onClick={() => setIsOpen(false)}>
            <Phone aria-hidden="true" size={19} />{siteConfig.phone}
          </a>}
        </nav>
      </div>
    </div>
  );
}
