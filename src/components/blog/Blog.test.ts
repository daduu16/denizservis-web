import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { BlogIndex } from "./BlogIndex";
import { BlogArticle } from "./BlogArticle";
import { blogPosts, blogPath, blogPost, readingMinutes } from "../../data/blog";
import { blogPreviewJsonLd } from "../../lib/blog-seo";
import { generateStaticParams, generateMetadata } from "../../app/blog/[slug]/page";
import { metadata } from "../../app/blog/page";
import en from "../../i18n/blog.en.json";
import ru from "../../i18n/blog.ru.json";

vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("404"); }, usePathname: () => "/blog" }));

describe("responsive editorial blog", () => {
  it("renders one H1, all article links and accessible category controls before hydration", () => {
    const html = renderToStaticMarkup(createElement(BlogIndex));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    for (const post of blogPosts) expect(html).toContain(`href="${blogPath(post)}"`);
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toContain('role="status"');
    expect(html).toContain("redaksiya baxışındadır");
    expect(html).toContain("https://wa.me/994705522021");
  });

  it.each(blogPosts)("keeps $slug readable in server HTML with working section anchors", post => {
    const html = renderToStaticMarkup(createElement(BlogArticle, { post }));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(post.title);
    expect(html).toContain(post.intro);
    for (const section of post.sections) {
      expect(html).toContain(`id="${section.id}"`);
      expect(html).toContain(`href="#${section.id}"`);
    }
    expect(new Set(post.sections.map(s => s.id)).size).toBe(post.sections.length);
    expect(html).toContain('href="tel:+994705522021"');
    expect(html).not.toContain("20–60");
    expect(html).not.toContain('aria-label="Səhifə yolu"');
    expect(html).not.toContain("Redaksiya önizləməsi");
    expect(html).not.toContain("AI ilə hazırlanmış redaksiya təsviri");
    expect(html).not.toContain("DənizServis · Faydalı bələdçi");
    expect(html).not.toContain("Servisə nə göndərək?");
    expect(html).not.toContain("servise-gonder");
    // Keep the useful list link at the bottom; only the upper back link is removed.
    expect(html).toContain("Bütün məqalələr");
    expect(readingMinutes(post)).toBeGreaterThan(0);
  });

  it("prebuilds all valid slugs and does not resolve arbitrary slugs", () => {
    expect(generateStaticParams()).toEqual(blogPosts.map(p => ({ slug: p.slug })));
    expect(blogPost("missing-post")).toBeUndefined();
    expect(new Set(blogPosts.map(p => p.slug)).size).toBe(blogPosts.length);
  });

  it("keeps preview metadata noindex with canonical URLs, without invented publication dates or expert claims", async () => {
    expect(metadata.robots).toMatchObject({ index: false });
    for (const post of blogPosts) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
      expect(meta.robots).toMatchObject({ index: false });
      expect(meta.alternates?.canonical).toBe(`https://denizservis.az${blogPath(post)}`);
      const graph = blogPreviewJsonLd(post)["@graph"];
      expect(graph.some(n => n["@type"] === "BreadcrumbList")).toBe(true);
      expect(JSON.stringify(graph)).not.toContain("datePublished");
      expect(JSON.stringify(graph)).not.toContain("reviewedBy");
    }
  });

  it.each([en, ru])("translates article text and common blog chrome", dictionary => {
    const messages = blogPosts.flatMap(p => [p.title, p.excerpt, p.intro, p.category, p.alt, p.note,
      ...(p.source ? [p.source.label] : []), ...(p.sources ?? []).map(s => s.label), ...p.sections.flatMap(s => [s.title, s.text, ...(s.points ?? []), ...(s.codes ?? []).flatMap(c => [c.meaning, c.action])])]);
    messages.push("Məqaləni oxu", "Bu məqalədə", "Texnikanı anlayın.", "Daha rahat qərar verin.", "Mövzu filtrləri");
    for (const text of messages) expect((dictionary as Record<string, string>)[text], text).toBeTruthy();
  });

  it("prioritizes dishwashers, keeps model-specific codes separate and links to the right service", () => {
    expect(blogPosts.slice(0, 2).every(p => p.appliance === "Qabyuyan")).toBe(true);
    const post = blogPost("qabyuyan-xeta-kodlari")!;
    const html = renderToStaticMarkup(createElement(BlogArticle, { post }));
    for (const code of ["E15", "E24 / E-24", "E09", "4C / 4E", "5C / 5E", "LC / LE"]) expect(html).toContain(code);
    expect(html).toContain("universal siyahı deyil");
    expect(html).toContain('href="/xidmetler/qabyuyan-temiri"');
    expect(html).not.toContain("AI ilə hazırlanmış redaksiya təsviri");
    for (const source of post.sources!) expect(html).toContain(source.url);
  });

  it("keeps every blog image in the repository rather than hotlinking remote sources", () => {
    for (const post of blogPosts) {
      expect(post.image.startsWith("/images/")).toBe(true);
      expect(existsSync(`public${post.image}`)).toBe(true);
    }
  });
});
