import type { Metadata } from "next";
import { canonicalOrigin, indexableDeployment, seoPages, type PublicPagePath } from "../config/seo";
import { normalizePhone, siteConfig } from "../config/site";

export const absoluteUrl = (path: string) => path === "/" ? `${canonicalOrigin}/` : `${canonicalOrigin}${path}`;

export function pageMetadata(path: PublicPagePath): Metadata {
  const page = seoPages.find((item) => item.path === path)!;
  return metadataForPage(path, page.title, page.description);
}

export function metadataForPage(path: string, title: string, description: string, image = "/images/denizservis-hero.png", noindex = false): Metadata {
  const url = absoluteUrl(path);
  return {
    title: { absolute: title }, description,
    alternates: { canonical: url },
    robots: { index: indexableDeployment && !noindex, follow: true },
    openGraph: { type: "website", locale: "az_AZ", siteName: siteConfig.name, title, description, url, images: [{ url: absoluteUrl(image), alt: title }] },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl(image)] },
  };
}

export function organizationNode() {
  return {
    "@type": "Organization", "@id": `${canonicalOrigin}/#business`,
    name: siteConfig.name, url: `${canonicalOrigin}/`,
    logo: { "@type": "ImageObject", url: absoluteUrl("/images/denizservis-logo-v5.png") },
    telephone: normalizePhone(siteConfig.phone),
    contactPoint: { "@type": "ContactPoint", telephone: normalizePhone(siteConfig.phone), contactType: "customer service", availableLanguage: ["az"] },
    // Do not invent a street address, opening hours, rating, social profile or accreditation.
  };
}

export function basicPageJsonLd(path: PublicPagePath, type: "WebPage" | "AboutPage" | "ContactPage" = "WebPage") {
  const page = seoPages.find((item) => item.path === path)!;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      { "@type": "WebSite", "@id": `${canonicalOrigin}/#website`, url: `${canonicalOrigin}/`, name: siteConfig.name, inLanguage: "az-AZ", publisher: { "@id": `${canonicalOrigin}/#business` } },
      { "@type": type, "@id": `${absoluteUrl(path)}#webpage`, url: absoluteUrl(path), name: page.title, description: page.description, inLanguage: "az-AZ", isPartOf: { "@id": `${canonicalOrigin}/#website` }, ...(path === "/" ? {} : { breadcrumb: { "@id": `${absoluteUrl(path)}#breadcrumb` } }) },
      ...(path === "/" ? [] : [{ "@type": "BreadcrumbList", "@id": `${absoluteUrl(path)}#breadcrumb`, itemListElement: [{ "@type": "ListItem", position: 1, name: "Əsas səhifə", item: absoluteUrl("/") }, { "@type": "ListItem", position: 2, name: type === "AboutPage" ? "Haqqımızda" : "Əlaqə", item: absoluteUrl(path) }] }]),
    ],
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
