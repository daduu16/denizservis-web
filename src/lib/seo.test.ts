import { describe, expect, it } from "vitest";
import { canonicalOrigin, isIndexableDeployment, seoPages } from "../config/seo";
import { basicPageJsonLd, organizationNode, pageMetadata } from "./seo";

describe("site-wide SEO", () => {
  it("indexes production only and protects dev/preview/Cloudflare branches", () => {
    expect(isIndexableDeployment({ NODE_ENV: "development" })).toBe(false);
    expect(isIndexableDeployment({ NODE_ENV: "production" })).toBe(true);
    expect(isIndexableDeployment({ NODE_ENV: "production", NEXT_PUBLIC_DEPLOYMENT_ENV: "preview" })).toBe(false);
    expect(isIndexableDeployment({ NODE_ENV: "production", CF_PAGES: "1", CF_PAGES_BRANCH: "feature" })).toBe(false);
    expect(isIndexableDeployment({ NODE_ENV: "production", NEXT_PUBLIC_DEPLOYMENT_ENV: "production", CF_PAGES: "1", CF_PAGES_BRANCH: "feature" })).toBe(false);
    expect(isIndexableDeployment({ NODE_ENV: "production", CF_PAGES: "1", CF_PAGES_BRANCH: "prod" })).toBe(true);
    expect(isIndexableDeployment({ NODE_ENV: "production", CF_PAGES: "1", CF_PAGES_BRANCH: "dev" })).toBe(false);
    expect(isIndexableDeployment({ NODE_ENV: "production", CF_PAGES: "1", CF_PAGES_BRANCH: "main" })).toBe(false);
    expect(isIndexableDeployment({ NODE_ENV: "production", NEXT_PUBLIC_DEPLOYMENT_ENV: "production", CF_PAGES: "1", CF_PAGES_BRANCH: "dev" })).toBe(false);
  });
  it("gives every real public page unique metadata and a production canonical", () => {
    expect(new Set(seoPages.map((page) => page.title)).size).toBe(seoPages.length);
    expect(new Set(seoPages.map((page) => page.description)).size).toBe(seoPages.length);
    for (const page of seoPages) {
      const meta = pageMetadata(page.path);
      expect(meta.alternates?.canonical).toBe(canonicalOrigin + page.path);
      expect(meta.openGraph).toMatchObject({ url: canonicalOrigin + page.path, locale: "az_AZ" });
      expect(meta.twitter).toMatchObject({ card: "summary_large_image" });
    }
  });
  it("uses factual Organization instead of incomplete LocalBusiness", () => {
    const org = organizationNode();
    expect(org["@type"]).toBe("Organization");
    expect(org.email).toBe("info@denizservis.az");
    expect(org.contactPoint).toMatchObject({ telephone: "+994705522021", email: "info@denizservis.az" });
    for (const field of ["address", "aggregateRating", "review", "openingHours", "sameAs"]) expect(org).not.toHaveProperty(field);
    expect(basicPageJsonLd("/haqqimizda", "AboutPage")["@graph"].some((node) => node["@type"] === "AboutPage")).toBe(true);
  });
});
