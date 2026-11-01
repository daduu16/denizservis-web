import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { brandRows } from "./brands";
import { BrandMarquee } from "../components/BrandMarquee";
import { dishwasherBrandRows } from "./dishwasher";

describe("brand marquee", () => {
  it("keeps all 19 brands in the exact two requested rows", () => {
    expect(brandRows.map((row) => row.map((brand) => brand.name))).toEqual([
      ["Mitsubishi", "Electrolux", "Toshiba", "Sony", "Beko", "Samsung", "Bosch", "Siemens", "LG", "Philips"],
      ["Hitachi", "Panasonic", "AEG", "Sharp", "Ariston", "Indesit", "Moulinex", "Gorenje", "Vestel"],
    ]);
    expect(new Set(brandRows.flat().map((brand) => brand.slug)).size).toBe(19);
  });

  it("ships a valid local WebP for every brand", () => {
    for (const brand of brandRows.flat()) {
      const path = join(process.cwd(), "public/images/brands", `${brand.slug}.webp`);
      expect(existsSync(path), brand.name).toBe(true);
      const data = readFileSync(path);
      expect(data.subarray(0, 4).toString()).toBe("RIFF");
      expect(data.subarray(8, 12).toString()).toBe("WEBP");
      expect(data.length).toBeLessThan(40_000);
    }
  });

  it("hides both duplicate groups and their image labels from screen readers", () => {
    const html = renderToStaticMarkup(createElement(BrandMarquee));
    expect(html.match(/role="list" aria-hidden="true"/g)).toHaveLength(2);
    for (const { name } of brandRows.flat()) expect(html.match(new RegExp(`alt="${name}"`, "g"))).toHaveLength(1);
    expect(html).not.toContain('type="checkbox"');
    expect(html).not.toContain("Hərəkəti dayandır");
  });

  it("pads short service-page tracks without repeating accessible names", () => {
    const html = renderToStaticMarkup(createElement(BrandMarquee, { rows: dishwasherBrandRows }));
    for (const { name } of dishwasherBrandRows.flat()) expect(html.match(new RegExp(`alt="${name}"`, "g"))).toHaveLength(1);
    expect(html.match(/whirlpool\.webp/g)?.length).toBeGreaterThan(2);
  });
});
