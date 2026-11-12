import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { dishwasherContent } from "@/data/dishwasher";
import { washingMachineContent } from "@/data/washing-machine";
import { indexableDeployment, seoPages } from "@/config/seo";
import { blogPath, blogPosts } from "@/data/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexableDeployment) return [];
  // Use the same content registry as /blog/[slug]/generateStaticParams.
  // Adding a published post therefore updates both routes and XML on the next build.
  const paths = [...seoPages.map(({ path }) => path), "/blog", ...blogPosts.map(blogPath)];
  return paths.map((path) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: path === dishwasherContent.path ? new Date(dishwasherContent.updated) : path === washingMachineContent.path ? new Date(washingMachineContent.updated) : undefined,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
