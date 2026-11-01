import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { dishwasherBrandRows, dishwasherContent, dishwasherFaqs, dishwasherProblems } from "../data/dishwasher";
import { dishwasherJsonLd, dishwasherMetadata, serializeJsonLd } from "./dishwasher-seo";

describe("dishwasher content and SEO", () => {
  it("provides seven unique linked problem explanations", () => {
    expect(dishwasherProblems).toHaveLength(7);
    expect(new Set(dishwasherProblems.map((problem) => problem.id)).size).toBe(7);
    for (const problem of dishwasherProblems) expect(problem.text.length).toBeGreaterThan(100);
  });
  it("uses an absolute canonical, unique title and service-specific Open Graph", () => {
    const meta = dishwasherMetadata();
    expect(meta.title).toEqual({ absolute: dishwasherContent.metaTitle });
    expect(meta.alternates?.canonical).toBe("https://denizservis.az/xidmetler/qabyuyan-temiri");
    expect(meta.openGraph).toMatchObject({ url: meta.alternates?.canonical, siteName: "DənizServis" });
    expect(meta.description!.length).toBeLessThan(170);
  });
  it("includes factual business, service, breadcrumb and the same FAQ text as the page", () => {
    const graph = dishwasherJsonLd()["@graph"];
    expect(graph.map((item) => item["@type"])).toEqual(["Organization", "Service", "WebPage", "BreadcrumbList", "FAQPage"]);
    expect(graph[0]).toMatchObject({ name: "DənizServis", telephone: "+994705522021" });
    const answers = graph.flatMap((node) => "mainEntity" in node ? node.mainEntity?.map((item) => item.acceptedAnswer.text) ?? [] : []);
    expect(answers).toEqual(dishwasherFaqs.map((item) => item.answer));
    const serialized = JSON.stringify(graph);
    for (const key of ["aggregateRating", "review", "priceRange", "streetAddress", "openingHours", "warranty"]) expect(serialized).not.toContain(`"${key}"`);
  });
  it("escapes HTML delimiters in JSON-LD", () => {
    const text = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(text).not.toContain("<");
    expect(JSON.parse(text).name).toContain("</script>");
  });
  it("has local artwork for all twelve relevant brands", () => {
    expect(dishwasherBrandRows.flat()).toHaveLength(12);
    for (const brand of dishwasherBrandRows.flat()) expect(existsSync(join(process.cwd(), "public/images/brands", `${brand.slug}.webp`)), brand.name).toBe(true);
  });
});
