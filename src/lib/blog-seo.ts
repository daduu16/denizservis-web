import { type BlogPost, blogPath } from "../data/blog";
import { absoluteUrl, organizationNode } from "./seo";

// Preview pages stay noindex and outside the published sitemap until editorial approval.
// Do not label unreviewed copy as expert-reviewed or fabricate author credentials.
export function blogPreviewJsonLd(post?: BlogPost) {
  const path = post ? blogPath(post) : "/blog";
  return {
    "@context": "https://schema.org",
    "@graph": [organizationNode(), {
      "@type": "WebPage", "@id": `${absoluteUrl(path)}#webpage`, url: absoluteUrl(path),
      name: post?.title ?? "DənizServis bloqu", inLanguage: "az-AZ",
      breadcrumb: { "@id": `${absoluteUrl(path)}#breadcrumb` },
    }, {
      "@type": "BreadcrumbList", "@id": `${absoluteUrl(path)}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Əsas səhifə", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Bloq", item: absoluteUrl("/blog") },
        ...(post ? [{ "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(path) }] : []),
      ],
    }],
  };
}
