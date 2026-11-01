import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ContactPage, { metadata } from "./page";
import { normalizePhone, siteConfig, whatsappHref } from "../../config/site";

describe("contact page", () => {
  it("offers real telephone, WhatsApp and email links with visible contact details", () => {
    const html = renderToStaticMarkup(createElement(ContactPage));
    expect(html).toContain(`href="tel:${normalizePhone(siteConfig.phone)}"`);
    expect(html).toContain(`href="${whatsappHref(siteConfig.whatsapp)}"`);
    expect(html).toContain(`href="mailto:${siteConfig.email}"`);
    expect(html).toContain(siteConfig.phone);
    expect(html).toContain(siteConfig.email);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain("İş saatları");
    expect(html).not.toContain("Konfiqurasiya edilməyib");
    expect(html).not.toContain(">Əlaqə</span>");
    expect(html).not.toContain("Ünvanı müraciətinizdə qeyd edin.");
    expect(html).not.toContain("Bakı</strong>");
  });

  it("preserves SEO, a single H1 and the accessible compact booking form", () => {
    const html = renderToStaticMarkup(createElement(ContactPage));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('aria-labelledby="contact-title"');
    expect(html).toContain('"@type":"ContactPage"');
    expect(metadata.alternates?.canonical).toBe("https://denizservis.az/elaqe");
    expect(html).toContain('type="tel"');
    expect(html).toContain("Marka və ünvan əlavə et");
    expect(html).toContain('name="consent"');
    expect(html).not.toMatch(/<details\b[^>]*\bopen(?:\s|=|>)/);
  });
});
