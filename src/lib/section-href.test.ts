import { describe, expect, it } from "vitest";
import { resolveSectionHref } from "./section-href";

describe("service page section links", () => {
  it.each(["paltaryuyan-temiri", "qabyuyan-temiri"])("uses the local gallery and form on %s", (slug) => {
    const path = `/xidmetler/${slug}`;
    expect(resolveSectionHref(path, "/#islerimiz")).toBe(`${path}#islerimiz`);
    expect(resolveSectionHref(path, "/#sifaris")).toBe(`${path}#sifaris`);
    expect(resolveSectionHref(path, "/#niye-biz")).toBe("/#niye-biz");
  });

  it.each(["/", "/elaqe", "/mexfilik"])("does not change links on %s", (path) => {
    expect(resolveSectionHref(path, "/#islerimiz")).toBe("/#islerimiz");
    expect(resolveSectionHref(path, "/#sifaris")).toBe("/#sifaris");
  });
});
