import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Header } from "./Header";
import { siteConfig } from "../config/site";

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

  it("includes a separate language control inside the mobile menu", () => {
    const html = renderToStaticMarkup(createElement(Header));
    const mobileMenu = html.slice(html.indexOf('id="mobile-menu"'));
    expect(mobileMenu).toContain("mobile-language");
    expect(mobileMenu).toContain('aria-haspopup="menu"');
    expect(mobileMenu).toContain("Azərbaycanca");
    expect(html).toContain("lucide-globe");
    expect(html).not.toContain("lucide-earth");
  });
});
