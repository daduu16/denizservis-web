import type { Metadata } from "next";
import { siteConfig } from "../config/site";
import { washingMachineContent, washingMachineFaqs } from "../data/washing-machine";
import { metadataForPage, organizationNode } from "./seo";

export function washingMachineMetadata(): Metadata {
  return metadataForPage(washingMachineContent.path, washingMachineContent.metaTitle, washingMachineContent.description, "/images/paltaryuyan.png");
}

export function washingMachineJsonLd() {
  const url = `${siteConfig.url}${washingMachineContent.path}`;
  const businessId = `${siteConfig.url}/#business`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationNode(),
      {
        "@type": "Service", "@id": `${url}#service`, url,
        name: "Paltaryuyan maşın təmiri", serviceType: "Paltaryuyan maşınların diaqnostikası və təmiri",
        description: washingMachineContent.description, provider: { "@id": businessId },
        areaServed: { "@type": "City", name: "Bakı" },
      },
      {
        "@type": "WebPage", "@id": `${url}#webpage`, url,
        name: washingMachineContent.title, description: washingMachineContent.description,
        inLanguage: "az", dateModified: washingMachineContent.updated,
        about: { "@id": `${url}#service` }, breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: [
          { "@type": "ListItem", position: 1, name: "Əsas səhifə", item: `${siteConfig.url}/` },
          { "@type": "ListItem", position: 2, name: "Xidmətlər", item: `${siteConfig.url}/#xidmetler` },
          { "@type": "ListItem", position: 3, name: "Paltaryuyan maşın təmiri", item: url },
        ],
      },
      {
        "@type": "FAQPage", "@id": `${url}#faq`, mainEntity: washingMachineFaqs.map((item) => ({
          "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
}
