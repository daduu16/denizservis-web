import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { BookingForm } from "./BookingForm";
import { Hero } from "./Hero";
import { FAQ } from "./FAQ";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("requested form and page refinements", () => {
  it("submits the unchanged form through FormSubmit without a static-export block or client-side secrets", () => {
    const source = readFileSync("src/components/BookingForm.tsx", "utf8");
    expect(source).toContain('await submitBooking(values)');
    expect(source).not.toContain('/api/bookings');
    expect(source).toContain("disabled={isSubmitting}");
    expect(source).not.toContain("staticExport");
    expect(source).not.toContain("CONTACT_RECIPIENT_EMAIL");
    expect(source).not.toContain("CLOUDFLARE_EMAIL_API_TOKEN");
    expect(source.indexOf('await submitBooking(values)')).toBeLessThan(source.indexOf('setSubmitState({ type: "success"'));
    expect(source.indexOf('setSubmitState({ type: "success"')).toBeLessThan(source.indexOf('reset();'));
    expect(source).toContain('isSubmitting ? "Göndərilir..." : "Müraciəti göndər"');
    for (const compact of [false, true]) {
      const html = renderToStaticMarkup(createElement(BookingForm, { compact }));
      expect(html).toMatch(/<button\b(?=[^>]*type="submit")(?![^>]*disabled)[^>]*>/);
      expect(html).not.toContain("Statik versiyada e-mail forması aktiv deyil.");
    }
  });

  it.each([false, true])("retains a freely formatted telephone input for compact=%s", (compact) => {
    const html = renderToStaticMarkup(createElement(BookingForm, { compact }));
    expect(html).toContain('type="tel"');
    expect(html).not.toContain('pattern=');
    expect(html).not.toContain('maxLength="10"');
    expect(html).toContain('name="phone"');
    expect(html).toMatch(/<label[^>]+for="[^"]+"[^>]*>Ad/);
    expect(html).toContain('aria-required="true"');
  });

  it("removes the three hero benefit icons and captions", () => {
    const html = renderToStaticMarkup(createElement(Hero));
    expect(html).not.toContain("hero-benefits");
    expect(html).not.toContain("Rahat onlayn");
    expect(html).not.toContain("Nasazlığa uyğun");
  });

  it("adds free WhatsApp advice and the owner's confirmed service areas to the home FAQ", () => {
    const html = renderToStaticMarkup(createElement(FAQ, { showConsultation: true }));
    expect(html).toContain("Pulsuz məsləhət al");
    expect(html).toContain("https://wa.me/994705522021");
    expect(html).toContain("Bakının bütün rayonlarına");
    expect(html).toContain("Masazır və Abşeron qəsəbələrinə gəlirik.");
    expect(html).not.toContain("Xidmət zonası biznes məlumatlarında təsdiqləndikdən");
  });

  it.each(["Dishwasher", "WashingMachine"])("removes only the requested %s booking kicker and description", (page) => {
    const source = readFileSync(`src/components/${page}ServicePage.tsx`, "utf8");
    expect(source).not.toContain("Marka və modeli qeyd edin, xidmət imkanını dəqiqləşdirək.");
    expect(source).not.toContain("<T>Müraciət edin</T>");
    expect(source).toContain("<T>Problemi bizə bildirin</T>");
    expect(source).toContain("<BookingForm compact hideNote />");
  });

  it("keeps form rows top-aligned when an error makes one field taller", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toMatch(/\.field\s*\{[^}]*align-content:\s*start/);
  });
});
