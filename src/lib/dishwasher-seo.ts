import type { Metadata } from "next";
import { siteConfig } from "../config/site";
import { dishwasherContent, dishwasherFaqs } from "../data/dishwasher";
import { metadataForPage, organizationNode } from "./seo";
export { serializeJsonLd } from "./seo";

export function dishwasherMetadata(): Metadata {
  return metadataForPage(dishwasherContent.path, dishwasherContent.metaTitle, dishwasherContent.description, "/images/qabyuyan.png");
}

export function dishwasherJsonLd() {
  const url = `${siteConfig.url}${dishwasherContent.path}`;
  const businessId = `${siteConfig.url}/#business`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "Service", "@id": `${url}#service`, url,
        name: "Qabyuyan maşın təmiri", serviceType: "Qabyuyan maşınların diaqnostikası və təmiri",
        description: dishwasherContent.description, provider: { "@id": businessId },
        areaServed: { "@type": "City", name: "Bakı" },
      },
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url,
        name: dishwasherContent.title, description: dishwasherContent.description,
        inLanguage: "az", dateModified: dishwasherContent.updated,
        about: { "@id": `${url}#service` }, breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
          { "@type": "ListItem", position: 1, name: "Əsas səhifə", item: `${siteConfig.url}/` },
          { "@type": "ListItem", position: 2, name: "Xidmətlər", item: `${siteConfig.url}/#xidmetler` },
          { "@type": "ListItem", position: 3, name: "Qabyuyan maşın təmiri", item: url },
        ],
      },
      {
        "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: dishwasherFaqs.map((item) => ({
          "@type": "Question", name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
