import { readFile, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const output = fileURLToPath(new URL("../out/", import.meta.url));
const html = await readFile(join(output, "xidmetler/qabyuyan-temiri.html"), "utf8");
const content = html.replace(/<script\b[\s\S]*?<\/script>/g, "");
assert.equal((content.match(/<h1\b/g) || []).length, 1);
assert.ok(content.includes("Qabyuyan Maşın Təmiri - DənizServis"));
assert.ok(content.includes("Pulsuz məsləhət al"));
assert.ok(!content.includes("Vestel, Beko, Ariston və digər markalar:"));
assert.ok(content.includes('href="https://denizservis.az/xidmetler/qabyuyan-temiri"'));
assert.ok(content.includes("Qabyuyan maşının platasını təmir etmək mümkündürmü?"));
assert.ok(content.includes("Statik versiyada e-mail forması aktiv deyil."));
assert.match(content, /<button\b(?=[^>]*type="submit")(?=[^>]*disabled="")[^>]*>/);
assert.equal(await stat(join(output, "api")).catch(() => null), null);
assert.ok(!html.includes("/_next/image?"));
const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.ok(jsonLd);
assert.ok(JSON.parse(jsonLd)["@graph"].some((node) => node["@type"] === "Service"));

const images = [...new Set([...html.matchAll(/\/images\/static\/[^"\s<>,&]+\.webp/g)].map((match) => match[0]))];
assert.ok(images.length > 5);
for (const src of images) assert.ok((await stat(join(output, decodeURIComponent(src)))).size > 0, src);
for (const path of ["index.html", "404.html", "xidmetler/paltaryuyan-temiri.html", "robots.txt", "sitemap.xml"]) assert.ok((await stat(join(output, path))).isFile());
assert.ok((await readFile(join(output, "sitemap.xml"), "utf8")).includes("https://denizservis.az/xidmetler/qabyuyan-temiri"));
assert.ok((await readFile(join(output, "robots.txt"), "utf8")).includes("https://denizservis.az/sitemap.xml"));

const washingHtml = await readFile(join(output, "xidmetler/paltaryuyan-temiri.html"), "utf8");
const washingContent = washingHtml.replace(/<script\b[\s\S]*?<\/script>/g, "");
assert.equal((washingContent.match(/<h1\b/g) || []).length, 1);
assert.ok(washingContent.includes("Paltaryuyan Maşın Təmiri - DənizServis"));
assert.ok(washingContent.includes('href="https://denizservis.az/xidmetler/paltaryuyan-temiri"'));
assert.ok(washingContent.includes("Pulsuz məsləhət al"));
assert.ok(washingContent.includes('href="https://wa.me/994705522021"'));
assert.ok(washingContent.includes("Statik versiyada e-mail forması aktiv deyil."));
assert.match(washingContent, /<button\b(?=[^>]*type="submit")(?=[^>]*disabled="")[^>]*>/);
for (const id of ["su-bosaltmir", "sixmir", "ses-kuy", "su-sizmasi", "su-goturmur", "baraban-firlanmir", "qapi-acilmir", "su-qizdirmir", "guclu-titreyir", "proqram-baslamir"]) {
  assert.ok(washingContent.includes(`id="${id}"`), id);
  assert.ok(washingContent.includes(`href="#${id}"`), id);
}
for (const id of ["sifaris", "elektron-plata", "xeta-kodlari", "islerimiz", "qiymet-sertler"]) assert.ok(washingContent.includes(`id="${id}"`), id);
for (const removed of ["ServisPlus", "Nasazlıqdan həllə doğru", "İstehsalçıların rəsmi məlumatları", "Birbaşa əlaqə saxlamaq istəyirsiniz?"]) assert.ok(!washingContent.includes(removed), removed);
assert.ok(!washingHtml.includes("/_next/image?"));
const washingJsonLd = washingHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
assert.ok(washingJsonLd);
const washingGraph = JSON.parse(washingJsonLd)["@graph"];
assert.ok(washingGraph.some((node) => node["@type"] === "Service" && node.name === "Paltaryuyan maşın təmiri"));
const washingFaq = washingGraph.find((node) => node["@type"] === "FAQPage").mainEntity;
assert.equal(washingFaq.length, 7);
for (const question of washingFaq) {
  assert.ok(washingContent.includes(question.name));
  assert.ok(washingContent.includes(question.acceptedAnswer.text));
}
for (const page of ["index.html", "elaqe.html", "mexfilik.html", "xidmetler/paltaryuyan-temiri.html", "xidmetler/qabyuyan-temiri.html"]) {
  const pageContent = await readFile(join(output, page), "utf8");
  assert.ok(!pageContent.includes('class="mobile-action-bar"'), page);
  assert.ok(pageContent.includes('class="floating-whatsapp"'), page);
}
console.log(`Static QA passed for both service pages: HTML, SEO, JSON-LD, FAQ, disabled email forms, ${images.length} responsive image references, sitemap, robots and WhatsApp-only floating actions.`);
