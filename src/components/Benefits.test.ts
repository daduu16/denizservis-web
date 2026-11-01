import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Benefits } from "./Benefits";
import { benefits } from "../data/content";
import en from "../i18n/en.json";
import ru from "../i18n/ru.json";

describe("service journey", () => {
  it("keeps the navigation anchor and accessible, server-rendered expandable steps", () => {
    const html = renderToStaticMarkup(createElement(Benefits));
    expect(html).toContain('id="niye-biz"');
    expect(html).toContain('aria-labelledby="benefits-title"');
    expect(html).toContain('<h2 id="benefits-title">');
    expect(html.match(/<details\b/g)).toHaveLength(3);
    expect(html.match(/<summary\b/g)).toHaveLength(3);
    expect(html).not.toMatch(/<details\b[^>]*\bopen(?:\s|=|>)/);
    for (const step of benefits) {
      expect(html).toContain(step.title);
      expect(html).toContain(step.description);
      expect(html).toContain(step.detail);
    }
  });

  it("provides real contact and both service destinations without a fabricated success state", () => {
    const html = renderToStaticMarkup(createElement(Benefits));
    expect(html).toContain('href="https://wa.me/994705522021"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain('href="/xidmetler/paltaryuyan-temiri"');
    expect(html).toContain('href="/xidmetler/qabyuyan-temiri"');
    expect(html).not.toContain("Şişirdilmiş vədlərsiz");
  });

  it("translates the complete expanded step copy in both other languages", () => {
    for (const dictionary of [en, ru]) for (const step of benefits) {
      for (const key of [step.title, step.description, step.detail]) {
        expect((dictionary as Record<string, string>)[key], key).toBeTruthy();
      }
    }
  });
});
