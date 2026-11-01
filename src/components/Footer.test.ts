import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { Footer } from "./Footer";
import { siteConfig } from "../config/site";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("footer email and social links", () => {
  it("places the social icons below the platform description in the left brand column", () => {
    const html = renderToStaticMarkup(createElement(Footer));
    const brandColumn = html.match(/<div class="footer-brand">([\s\S]*?)<\/nav><\/div>/)?.[1];
    expect(brandColumn).toBeTruthy();
    expect(brandColumn).toContain('class="footer-socials"');
    expect(brandColumn!.indexOf("rahat müraciət platforması.")).toBeLessThan(brandColumn!.indexOf('class="footer-socials"'));
    expect(html.match(/class="footer-socials"/g)).toHaveLength(1);
  });

  it("replaces opening hours with the supplied email address", () => {
    const html = renderToStaticMarkup(createElement(Footer));
    expect(html).toContain('href="mailto:info@denizservis.az"');
    expect(html).toContain(">info@denizservis.az</a>");
    expect(html).not.toContain("İş saatları");
    expect(html).not.toContain("İş saatlarını əlaqə zamanı dəqiqləşdirin");
    expect(html).not.toContain("lucide-clock");
  });

  it("uses all three supplied profiles with accessible icons and safe new tabs", () => {
    const html = renderToStaticMarkup(createElement(Footer));
    expect(siteConfig.socialLinks.map(({ url }) => url)).toEqual([
      "https://www.instagram.com/paltaryuyan_masin_temir_/",
      "https://www.youtube.com/@denizservis1",
      "https://www.tiktok.com/@paltaryuyanmasin_temiri",
    ]);
    for (const { name, url } of siteConfig.socialLinks) {
      expect(html).toContain(`href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${name} — yeni pəncərədə açılır"`);
    }
    expect(html.match(/class="footer-social-link"/g)).toHaveLength(3);
    expect(html).toContain('aria-label="Sosial şəbəkələr"');
    expect(html).not.toContain("dlrf=");
    expect(html).not.toContain("_t=ZS-");
  });
});
