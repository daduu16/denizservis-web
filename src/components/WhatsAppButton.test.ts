import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("floating WhatsApp animation", () => {
  const css = readFileSync("src/app/globals.css", "utf8");

  it("adds decorative ripples and a gentle icon greeting only to the floating button", () => {
    expect(css).toContain(".floating-whatsapp .whatsapp-button::before");
    expect(css).toContain("animation: whatsapp-ripple 3.6s ease-out infinite");
    expect(css).toContain(".floating-whatsapp .whatsapp-button svg { animation: whatsapp-greeting");
    expect(css).toMatch(/pointer-events: none; opacity: 0; animation: whatsapp-ripple/);
    expect(css).toContain("animation-play-state: paused");
  });

  it("disables the animations when reduced motion is requested", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\}[^}]*\}\s*\.floating-whatsapp[^}]*animation: none;/);
  });
});
