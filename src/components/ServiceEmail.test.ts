import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { DishwasherServicePage } from "./DishwasherServicePage";
import { WashingMachineServicePage } from "./WashingMachineServicePage";
import { siteConfig } from "../config/site";
import { dishwasherJsonLd } from "../lib/dishwasher-seo";
import { washingMachineJsonLd } from "../lib/washing-machine-seo";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("official email on service pages", () => {
  it.each([DishwasherServicePage, WashingMachineServicePage])("adds a native mail link to %s without changing phone or WhatsApp", (Page) => {
    const html = renderToStaticMarkup(createElement(Page));
    expect(html).toContain(`href="${siteConfig.emailHref}"`);
    expect(html).toContain(`<span>${siteConfig.email}</span>`);
    expect(html).toContain("lucide-mail");
    expect(html).toContain('href="tel:+994705522021"');
    expect(html).toContain('href="https://wa.me/994705522021"');
  });

  it.each([dishwasherJsonLd, washingMachineJsonLd])("shares the same official email in service structured data", (jsonLd) => {
    const org = jsonLd()["@graph"].find((node) => node["@type"] === "Organization");
    expect(org).toMatchObject({ email: siteConfig.email, contactPoint: { email: siteConfig.email } });
  });
});
