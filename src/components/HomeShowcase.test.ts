import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { HomeShowcase } from "./HomeShowcase";
import { services } from "../data/content";

describe("clickable service cards", () => {
  it("makes each full card a single native link including the image, heading and description", () => {
    const html = renderToStaticMarkup(createElement(HomeShowcase));
    const cards = [...html.matchAll(/<a\b[^>]*class="showcase-card"[^>]*>([\s\S]*?)<\/a>/g)];
    expect(cards).toHaveLength(services.length);
    for (const [index, match] of cards.entries()) {
      expect(match[0]).toContain(`href="/xidmetler/${services[index].slug}"`);
      expect(match[0]).toContain(`aria-label="${services[index].title} haqqında ətraflı"`);
      expect(match[1]).toContain("<img");
      expect(match[1]).toContain(`<h3>${services[index].title}</h3>`);
      expect(match[1]).toContain(services[index].shortDescription);
      expect(match[1]).toContain('<span class="text-link">');
      expect(match[1]).not.toMatch(/<(a|button)\b/);
    }
  });

  it("provides hover, keyboard-focus and reduced-motion affordances", () => {
    const css = readFileSync("src/app/globals.css", "utf8");
    expect(css).toMatch(/\.showcase-card\s*\{[^}]*cursor:\s*pointer/);
    expect(css).toContain(".showcase-card:focus-visible");
    expect(css).toMatch(/\.showcase-card:focus-visible\s*\{[^}]*outline:/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^}]*\}[^}]*\.showcase-card/);
  });
});
