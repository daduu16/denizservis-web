import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./Header";
import { siteConfig } from "../config/site";
import { readFileSync } from "node:fs";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("header contact and language controls", () => {
  it("replaces the booking CTA with a primary phone link and a language selector before it", () => {
    const html = renderToStaticMarkup(createElement(Header));
    expect(html).not.toContain("Usta sifariş et");
    expect(html).toContain("header-phone--primary");
    expect(html).toContain(siteConfig.phone);
    expect(html).toContain('href="tel:+994705522021"');
    expect(html.indexOf('aria-haspopup="menu"')).toBeLessThan(html.indexOf("header-phone--primary"));
    expect(html).toContain("Dil seçimi: Azərbaycanca");
    expect(html).toContain('aria-expanded="false"');
  });

  it("unmounts closed mobile controls so the language popup resets between openings", () => {
    const html = renderToStaticMarkup(createElement(Header));
    const source = readFileSync("src/components/Header.tsx", "utf8");
    expect(html).not.toContain('id="mobile-menu"');
    expect(source).toContain('{isOpen && <div className="mobile-menu-backdrop');
    expect(source).toContain('<LanguageSwitcher variant="mobile" />');
    expect(source).toContain('<a href={siteConfig.emailHref} className="mobile-email" onClick={closeMenu}>');
    expect(html).toContain("lucide-globe");
    expect(html).not.toContain("lucide-earth");
  });

  it("keeps telephone navigation as one native user-initiated link", () => {
    const html = renderToStaticMarkup(createElement(Header));
    const phone = html.match(/<a\b[^>]*href="tel:[^"]+"[^>]*>/)?.[0];
    expect(phone).toContain('href="tel:+994705522021"');
    expect(phone).not.toContain('target=');
    const source = readFileSync("src/components/Header.tsx", "utf8");
    expect(source).not.toContain("window.open");
    expect(source).not.toContain("location.href");
    expect(source).not.toContain(".click()");
  });

  it("keeps pointer selection distinct from keyboard focus and ignores touch blur with no target", () => {
    const source = readFileSync("src/components/LanguageSwitcher.tsx", "utf8");
    expect(source).toContain("focusMovedOutside(event.currentTarget, event.relatedTarget)");
    expect(source).toContain('variant === "desktop" || keyboardOpening.current');
    expect(source).toContain("tabIndex={-1}");
    const header = readFileSync("src/components/Header.tsx", "utf8");
    expect(header).toContain("if (event.defaultPrevented) return");
    expect(header).toContain('closest("[data-language-switcher]")');
  });
});
