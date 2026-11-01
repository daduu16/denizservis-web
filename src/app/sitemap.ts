import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { dishwasherContent } from "@/data/dishwasher";
import { washingMachineContent } from "@/data/washing-machine";
import { indexableDeployment, seoPages } from "@/config/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!indexableDeployment) return [];
  return seoPages.map(({ path }) => ({
    url: `${siteConfig.url}${path}`,
    lastModified: path === dishwasherContent.path ? new Date(dishwasherContent.updated) : path === washingMachineContent.path ? new Date(washingMachineContent.updated) : undefined,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
