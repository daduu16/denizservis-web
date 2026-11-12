import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/seo", async importOriginal => ({ ...await importOriginal<typeof import("@/config/seo")>(), indexableDeployment: false }));

import sitemap from "./sitemap";
import robots from "./robots";
import { metadata } from "./blog/page";
import { generateMetadata } from "./blog/[slug]/page";
import { blogPosts } from "@/data/blog";

describe("preview indexing protection", () => {
  it("keeps preview sitemap empty and omits its robots sitemap advertisement", () => {
    expect(sitemap()).toEqual([]);
    expect(robots().sitemap).toBeUndefined();
  });
  it("keeps blog metadata noindex outside production", async () => {
    expect(metadata.robots).toMatchObject({ index: false });
    const meta = await generateMetadata({ params: Promise.resolve({ slug: blogPosts[0].slug }) });
    expect(meta.robots).toMatchObject({ index: false });
  });
});
