import { describe, expect, it, vi } from "vitest";

vi.mock("@/config/seo", async importOriginal => ({ ...await importOriginal<typeof import("@/config/seo")>(), indexableDeployment: true }));

import sitemap from "./sitemap";
import robots from "./robots";
import { blogPath, blogPosts } from "@/data/blog";
import { canonicalOrigin, seoPages } from "@/config/seo";
import { generateMetadata, generateStaticParams } from "./blog/[slug]/page";
import { metadata } from "./blog/page";

describe("production sitemap and blog indexing", () => {
  it("includes the five existing pages, blog and every real article once", () => {
    const urls = sitemap().map(entry => entry.url);
    const paths = [...seoPages.map(page => page.path), "/blog", ...blogPosts.map(blogPath)];
    expect(urls).toEqual(paths.map(path => canonicalOrigin + path));
    expect(new Set(urls).size).toBe(urls.length);
    expect(urls).not.toContain(canonicalOrigin + "/mexfilik");
    expect(robots().sitemap).toBe(canonicalOrigin + "/sitemap.xml");
  });

  it("automatically includes a new article in both static routes and sitemap", () => {
    const post = { ...blogPosts[0], slug: "future-published-article" };
    blogPosts.push(post);
    try {
      expect(generateStaticParams()).toContainEqual({ slug: post.slug });
      expect(sitemap().some(entry => entry.url === canonicalOrigin + blogPath(post))).toBe(true);
    } finally {
      blogPosts.pop();
    }
  });

  it("makes sitemap blog URLs indexable with matching production canonicals", async () => {
    expect(metadata.robots).toMatchObject({ index: true, follow: true });
    expect(metadata.alternates?.canonical).toBe(canonicalOrigin + "/blog");
    for (const post of blogPosts) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
      expect(meta.robots).toMatchObject({ index: true, follow: true });
      expect(meta.alternates?.canonical).toBe(canonicalOrigin + blogPath(post));
    }
  });
});
