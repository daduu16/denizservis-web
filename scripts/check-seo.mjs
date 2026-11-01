// Validates the exported HTML, not a client-side reconstruction of page content.
import assert from "node:assert/strict";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const project = fileURLToPath(new URL("../", import.meta.url));
const root = join(project, "out");
const origin = "https://denizservis.az";
const indexable = process.env.SEO_EXPECT_INDEXABLE !== "false";
const expectedPublic = ["/", "/xidmetler/paltaryuyan-temiri", "/xidmetler/qabyuyan-temiri", "/elaqe", "/haqqimizda"];
const paths = [...expectedPublic, "/mexfilik"];
const fileFor = (path) => path === "/" ? "index.html" : `${path.slice(1)}.html`;
const decode = (text) => text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&#(\d+);/g, (_, num) => String.fromCodePoint(Number(num)));
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], decode(m[2])]));
const pages = new Map();
for (const path of paths) {
  const html = await readFile(join(root, fileFor(path)), "utf8");
  const content = html.replace(/<script\b[\s\S]*?<\/script>/g, "");
  pages.set(path, { html, content, ids: new Set([...content.matchAll(/\bid="([^"]+)"/g)].map((m) => decode(m[1]))) });
}

const results = [];
const titles = new Set(), descriptions = new Set();
let linksChecked = 0, imagesChecked = 0;
for (const [path, { html, content, ids }] of pages) {
  assert.match(html, /<html\b[^>]*lang="az"/);
  assert.equal((content.match(/<h1\b/g) || []).length, 1, `${path}: one H1`);
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
  assert.ok(title && !titles.has(title), `${path}: unique title`); titles.add(title);
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => attrs(m[0]));
  const description = meta.find((m) => m.name === "description")?.content;
  assert.ok(description && !descriptions.has(description), `${path}: unique description`); descriptions.add(description);
  assert.ok(meta.some((m) => m.name === "viewport" && m.content.includes("width=device-width")));
  assert.ok(meta.some((m) => m.name === "format-detection" && m.content.includes("telephone=no")), `${path}: iOS automatic phone detection disabled; explicit tel links retained`);
  const canonical = [...html.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0])).filter((a) => a.rel === "canonical");
  assert.equal(canonical.length, 1, `${path}: one canonical`);
  assert.equal(new URL(canonical[0].href).href, new URL(origin + path).href, `${path}: canonical origin`);
  const shouldIndex = indexable && path !== "/mexfilik";
  const robots = meta.filter((m) => m.name === "robots").map((m) => m.content).join(",");
  assert.equal(robots.includes("noindex"), !shouldIndex, `${path}: robots`);
  assert.ok(meta.some((m) => m.property === "og:url" && new URL(m.content).href === new URL(origin + path).href));
  assert.ok(meta.some((m) => m.property === "og:title" && m.content === title));
  assert.ok(meta.some((m) => m.property === "og:locale" && m.content === "az_AZ"));
  assert.ok(meta.some((m) => m.name === "twitter:card" && m.content === "summary_large_image"));
  assert.ok(!content.includes("ServisPlus"), `${path}: branding`);
  assert.ok(content.includes("+994 70 552 20 21"), `${path}: international business phone display`);
  assert.ok(!content.includes("070 552 20 21"), `${path}: no old local phone display`);
  assert.ok(!content.includes('class="mobile-action-bar"'));
  assert.ok(content.includes('class="floating-whatsapp"'));
  assert.equal(ids.size, [...content.matchAll(/\bid="([^"]+)"/g)].length, `${path}: no duplicate IDs`);

  for (const match of content.matchAll(/<a\b[^>]*>/g)) {
    const a = attrs(match[0]);
    if (!a.href || /^(tel:|mailto:)/.test(a.href)) continue;
    const url = new URL(a.href, origin + path);
    if (url.origin !== origin) continue;
    const destination = pages.get(url.pathname);
    assert.ok(destination, `${path}: unknown internal link ${a.href}`);
    if (url.hash) assert.ok(destination.ids.has(decodeURIComponent(url.hash.slice(1))), `${path}: broken anchor ${a.href}`);
    linksChecked++;
  }
  for (const match of content.matchAll(/<img\b[^>]*>/g)) {
    const image = attrs(match[0]);
    assert.ok(Object.hasOwn(image, "alt"), `${path}: image alt missing`);
    assert.ok(image.width && image.height || match[0].includes("position:absolute"), `${path}: image geometry missing`);
    if (image.src?.startsWith("/")) assert.ok((await stat(join(root, image.src))).size > 0, image.src);
    imagesChecked++;
  }
  const nodes = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => JSON.parse(m[1])["@graph"] || []);
  if (path !== "/mexfilik") {
    assert.ok(nodes.some((n) => n["@type"] === "Organization" && n.contactPoint?.telephone === "+994705522021"));
    assert.ok(!nodes.some((n) => ["LocalBusiness", "AggregateRating", "Review", "VideoObject"].includes(n["@type"])));
    const knownIds = new Set(nodes.map((node) => node["@id"]).filter(Boolean));
    for (const node of nodes.filter((node) => node["@type"] === "Service")) assert.ok(knownIds.has(node.provider?.["@id"]));
    const faq = nodes.find((n) => n["@type"] === "FAQPage");
    if (faq) for (const item of faq.mainEntity) { assert.ok(content.includes(item.name)); assert.ok(content.includes(item.acceptedAnswer.text)); }
  }
  const scriptFiles = [...new Set([...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map((m) => m[1]))].filter((src) => src.startsWith("/_next/"));
  let jsBytes = 0, gzipBytes = 0;
  for (const src of scriptFiles) { const data = await readFile(join(root, src)); jsBytes += data.length; gzipBytes += gzipSync(data).length; }
  results.push({ path, title, canonical: canonical[0].href, indexable: shouldIndex, h1: 1, schemaTypes: nodes.map((n) => n["@type"]), jsBytes, gzipBytes });
}
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const locations = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => decode(m[1]));
assert.deepEqual([...locations].sort(), indexable ? expectedPublic.map((path) => origin + path).sort() : []);
const robots = await readFile(join(root, "robots.txt"), "utf8");
assert.ok(robots.includes("Allow: /"));
assert.ok(!robots.includes("Disallow: /\n"));
assert.equal(robots.includes(`Sitemap: ${origin}/sitemap.xml`), indexable);
const notFound = await readFile(join(root, "404.html"), "utf8");
assert.ok(notFound.includes("Səhifə tapılmadı"));
assert.match(notFound, /name="robots" content="[^"]*noindex/);
assert.equal(await stat(join(root, "api")).catch(() => null), null);
assert.ok((await readFile(join(root, "_headers"), "utf8")).includes("X-Robots-Tag: noindex"));
assert.ok((await stat(join(root, "icon.svg"))).isFile());

const httpResults = [];
if (process.env.SEO_TEST_BASE_URL) {
  const base = new URL(process.env.SEO_TEST_BASE_URL);
  assert.ok(["localhost", "127.0.0.1"].includes(base.hostname), "HTTP validation is local-only; no production probing");
  for (const path of [...paths, "/sitemap.xml", "/robots.txt", "/seo-test-missing-page"]) {
    const response = await fetch(new URL(path, base), { redirect: "manual" });
    assert.equal(response.status, path === "/seo-test-missing-page" ? 404 : 200, path);
    httpResults.push({ path, status: response.status });
  }
}
const report = { generatedAt: new Date().toISOString(), environment: indexable ? "production-export-local-test" : "preview-export-local-test", linksChecked, imagesChecked, pages: results, httpResults, lighthouse: "not measured", fieldCoreWebVitals: "not available", externalSchemaValidators: "pending public staging/manual validation" };
await mkdir(join(project, "qa"), { recursive: true });
await writeFile(join(project, indexable ? "qa/seo-validation.json" : "qa/seo-validation-preview.json"), JSON.stringify(report, null, 2));
console.log(`SEO QA passed: ${pages.size} pages, ${linksChecked} internal links, ${imagesChecked} image elements, metadata, HTML, schema, sitemap, robots, 404 and preview headers.`);
console.log(JSON.stringify(results.map(({ path, jsBytes, gzipBytes }) => ({ path, jsBytes, gzipBytes })), null, 2));
