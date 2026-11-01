import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { indexableDeployment } from "@/config/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Do not block preview crawling here: crawlers must see the noindex meta/header.
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }, ...(indexableDeployment ? { sitemap: `${siteConfig.url}/sitemap.xml` } : {}) };
}
