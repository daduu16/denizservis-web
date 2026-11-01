import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { services } from "../data/content";
import { ServiceHero } from "./ServiceHero";

vi.mock("./ContactActions", () => ({
  ContactActions: ({ bookingHref }: { bookingHref: string }) => createElement("a", { href: bookingHref }, "Usta sifariş et"),
}));
vi.mock("./WhatsAppButton", () => ({
  WhatsAppButton: ({ variant }: { variant: string }) => createElement("div", { "data-variant": variant }, "WhatsApp ilə Yazın"),
}));

describe("service page hero", () => {
  it.each(services)("preserves the $title title and image but removes the old breadcrumb and badge", (service) => {
    const html = renderToStaticMarkup(createElement(ServiceHero, { service }));
    expect(html).toContain(service.title);
    expect(html).toContain(encodeURIComponent(service.image));
    expect(html).toContain('aria-labelledby="service-hero-title"');
    expect(html).not.toContain("Əsas səhifə");
    expect(html).not.toContain("ServisPlus xidməti");
  });

  it.each(services)("includes inline WhatsApp and a local booking link for $slug", (service) => {
    const html = renderToStaticMarkup(createElement(ServiceHero, { service }));
    expect(html).toContain('data-variant="inline"');
    expect(html).toContain("WhatsApp ilə Yazın");
    expect(html).toContain(`/xidmetler/${service.slug}#sifaris`);
  });
});
