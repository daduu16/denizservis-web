import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { existsSync } from "node:fs";
import { BlogIndex } from "./BlogIndex";
import { BlogArticle } from "./BlogArticle";
import { blogPosts, blogPath, blogPost, readingMinutes, relatedBlogPosts } from "../../data/blog";
import { blogPreviewJsonLd } from "../../lib/blog-seo";
import { BLOG_PAGE_SIZE } from "../../lib/blog-pagination";
import { indexableDeployment } from "../../config/seo";
import { generateStaticParams, generateMetadata } from "../../app/blog/[slug]/page";
import { metadata } from "../../app/blog/page";
import en from "../../i18n/blog.en.json";
import ru from "../../i18n/blog.ru.json";

vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("404"); }, usePathname: () => "/blog" }));

describe("responsive editorial blog", () => {
  it("publishes three brand-specific dishwasher code guides with distinct covers and official sources", () => {
    const guides = [
      { brand: "Bosch", slug: "bosch-qabyuyan-xeta-kodlari", host: "bosch-home.com", codes: ["E15", "E24 / E:24", "E25 / E:25", "E09", "E18"] },
      { brand: "Samsung", slug: "samsung-qabyuyan-xeta-kodlari", host: "samsung.com", codes: ["4C / 4E", "5C / 5E", "LC / LE", "OC / 0C / oE", "HC"] },
      { brand: "LG", slug: "lg-qabyuyan-xeta-kodlari", host: "lg.com", codes: ["IE", "OE", "AE", "FE", "HE", "tE"] },
    ];
    expect(new Set(guides.map(({ slug }) => blogPost(slug)!.image)).size).toBe(3);
    for (const guide of guides) {
      const post = blogPost(guide.slug)!;
      expect(post.category).toBe("Xəta kodları");
      expect(post.appliance).toBe("Qabyuyan");
      expect(post.title).toContain(guide.brand);
      expect(post.alt).toContain(guide.brand);
      expect(post.sections).toHaveLength(4);
      expect(post.sections.flatMap(section => section.codes ?? []).map(item => item.code)).toEqual(guide.codes);
      expect(post.sources!.some(source => new URL(source.url).hostname.endsWith(guide.host))).toBe(true);
      const html = renderToStaticMarkup(createElement(BlogArticle, { post }));
      expect(html).toContain('href="/xidmetler/qabyuyan-temiri"');
      for (const item of post.sections.flatMap(section => section.codes ?? [])) expect(html).toContain(item.code);
    }
  });
  it("renders one H1, the first article page and accessible pagination before hydration", () => {
    const html = renderToStaticMarkup(createElement(BlogIndex));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    for (const post of blogPosts.slice(0, BLOG_PAGE_SIZE)) expect(html).toContain(`href="${blogPath(post)}"`);
    for (const post of blogPosts.slice(BLOG_PAGE_SIZE)) expect(html).not.toContain(`href="${blogPath(post)}"`);
    expect(html).toContain('aria-label="Məqalə səhifələri"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-controls="blog-feed"');
    expect(html).not.toContain("Kəşf etməyə davam edin");
    expect(html).not.toContain("Önə çıxan məqalə");
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1);
    expect(html).toContain('role="status"');
    expect(html).toContain('<h2 id="articles-title" tabindex="-1">Faydalı oxu</h2>');
    for (const removed of ['aria-label="Səhifə yolu"', "DənizServis jurnalı", "Kiçik məlumat.", "Daha aydın növbəti addım.", "Qabyuyan bələdçiləri ön planda", "redaksiya baxışındadır", "dəq. oxu"]) expect(html).not.toContain(removed);
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
    expect(html).not.toContain("dəq. oxu");
    // Keep the useful list link at the bottom; only the upper back link is removed.
    expect(html).toContain("Bütün məqalələr");
    expect(readingMinutes(post)).toBeGreaterThan(0);
  });

  it("prebuilds all valid slugs and does not resolve arbitrary slugs", () => {
    expect(generateStaticParams()).toEqual(blogPosts.map(p => ({ slug: p.slug })));
    expect(blogPost("missing-post")).toBeUndefined();
    expect(new Set(blogPosts.map(p => p.slug)).size).toBe(blogPosts.length);
  });

  it("makes the four new dishwasher articles crawlable through ordinary related links", () => {
    const slugs = ["qabyuyan-qablari-qurutmur", "qabyuyan-su-goturmur", "qabyuyan-qablarda-ag-iz-saxlayir", "qabyuyan-su-sizdirir"];
    const covers = slugs.map(slug => blogPost(slug)!.image);
    expect(new Set(covers).size).toBe(4);
    expect(covers).toEqual([
      "/images/blog-dishwasher-drying.webp",
      "/images/blog-dishwasher-water-inlet.webp",
      "/images/blog-dishwasher-white-residue.webp",
      "/images/blog-dishwasher-leak.webp",
    ]);
    const queue = blogPosts.slice(0, BLOG_PAGE_SIZE);
    const visited = new Set(queue.map(post => post.slug));
    while (queue.length) {
      const current = queue.shift()!;
      const html = renderToStaticMarkup(createElement(BlogArticle, { post: current }));
      for (const next of relatedBlogPosts(current)) {
        expect(html).toContain(`href="${blogPath(next)}"`);
        expect(next.slug).not.toBe(current.slug);
        expect(next.appliance).toBe(current.appliance);
        if (!visited.has(next.slug)) { visited.add(next.slug); queue.push(next); }
      }
    }
    for (const slug of slugs) {
      const post = blogPost(slug)!;
      expect(visited.has(slug)).toBe(true);
      expect(post.appliance).toBe("Qabyuyan");
      expect(post.sections).toHaveLength(4);
      expect(post.source?.url).toMatch(/^https:\/\/www\.(?:bosch-home\.co\.uk|samsung\.com)\//);
      const html = renderToStaticMarkup(createElement(BlogArticle, { post }));
      expect(html).toContain('href="/xidmetler/qabyuyan-temiri"');
    }
  });

  it("uses production-only indexing with canonical URLs, without invented publication dates or expert claims", async () => {
    expect(metadata.robots).toMatchObject({ index: indexableDeployment });
    for (const post of blogPosts) {
      const meta = await generateMetadata({ params: Promise.resolve({ slug: post.slug }) });
      expect(meta.robots).toMatchObject({ index: indexableDeployment });
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
    messages.push("Məqaləni oxu", "Bu məqalədə", "Texnikanı anlayın.", "Daha rahat qərar verin.", "Mövzu filtrləri", "Məqalə səhifələri", "Səhifə", "Əvvəlki", "Növbəti", "Kəşf etməyə davam edin", "məqalə");
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

  it("adds two washer guides and one dishwasher guide with three distinct covers and official sources", () => {
    const posts = ["paltaryuyan-sixmada-titreyir", "paltaryuyandan-pis-qoxu-gelir", "qabyuyan-qablari-yaxsi-yumur"].map(slug => blogPost(slug)!);
    expect(posts.map(p => p.appliance)).toEqual(["Paltaryuyan", "Paltaryuyan", "Qabyuyan"]);
    expect(new Set(posts.map(p => p.image)).size).toBe(3);
    for (const post of posts) {
      expect(post.sections.length).toBeGreaterThanOrEqual(4);
      expect(post.imageKind).toBe("editorial");
      expect(post.source?.url).toMatch(/^https:\/\/(?:www\.bosch-home\.(?:com\.sg|co\.uk)|www\.samsung\.com)\//);
    }
  });
});
