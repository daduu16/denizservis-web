import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { washingMachineBrandRows, washingMachineCareTips, washingMachineCodeGroups, washingMachineContent, washingMachineFaqs, washingMachineProblems } from "../data/washing-machine";
import { washingMachineJsonLd, washingMachineMetadata } from "./washing-machine-seo";
import { dishwasherMetadata } from "./dishwasher-seo";

describe("washing machine content and SEO", () => {
  it("has ten unique linked problems and eight care tips from the supplied copy", () => {
    expect(washingMachineProblems).toHaveLength(10);
    expect(new Set(washingMachineProblems.map((problem) => problem.id)).size).toBe(10);
    for (const problem of washingMachineProblems) expect(problem.text.length).toBeGreaterThan(100);
    expect(washingMachineCareTips).toHaveLength(8);
    expect(washingMachineContent.title).toBe("Paltaryuyan Maşın Təmiri - DənizServis");
  });
  it("sets unique absolute metadata and appliance-specific sharing image", () => {
    const meta = washingMachineMetadata();
    expect(meta.title).toEqual({ absolute: washingMachineContent.metaTitle });
    expect(meta.title).not.toEqual(dishwasherMetadata().title);
    expect(meta.alternates?.canonical).toBe("https://denizservis.az/xidmetler/paltaryuyan-temiri");
    expect(meta.openGraph).toMatchObject({ url: meta.alternates?.canonical, siteName: "DənizServis" });
    expect(JSON.stringify(meta.openGraph)).toContain("/images/paltaryuyan.png");
    expect(meta.description!.length).toBeLessThan(170);
    expect(existsSync(join(process.cwd(), "public/images/paltaryuyan.png"))).toBe(true);
  });
  it("keeps business facts and FAQ schema consistent without invented claims", () => {
    const graph = washingMachineJsonLd()["@graph"];
    expect(graph.map((item) => item["@type"])).toEqual(["Organization", "Service", "WebPage", "BreadcrumbList", "FAQPage"]);
    expect(graph[0]).toMatchObject({ telephone: "+994705522021", name: "DənizServis" });
    expect(graph.find((item) => item["@type"] === "Service")).toMatchObject({ name: "Paltaryuyan maşın təmiri" });
    expect(graph.flatMap((node) => "mainEntity" in node ? node.mainEntity?.map((item) => item.acceptedAnswer.text) ?? [] : [])).toEqual(washingMachineFaqs.map((item) => item.answer));
    expect(washingMachineFaqs).toHaveLength(7);
    for (const key of ["aggregateRating", "review", "priceRange", "streetAddress", "openingHours", "warranty"]) expect(JSON.stringify(graph)).not.toContain(`"${key}"`);
  });
  it("uses available original artwork in two rows and model-specific code groups", () => {
    expect(washingMachineBrandRows).toHaveLength(2);
    for (const brand of washingMachineBrandRows.flat()) expect(existsSync(join(process.cwd(), "public/images/brands", `${brand.slug}.webp`)), brand.name).toBe(true);
    expect(washingMachineCodeGroups.map((group) => group.brand)).toEqual(["Samsung", "LG", "Bosch və Siemens"]);
    expect(washingMachineCodeGroups[0].codes.find((code) => code.code === "dC / dE")?.meaning).toContain("balans");
  });
});
