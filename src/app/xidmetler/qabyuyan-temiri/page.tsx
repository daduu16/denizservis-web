import { DishwasherServicePage } from "@/components/DishwasherServicePage";
import { dishwasherJsonLd, dishwasherMetadata, serializeJsonLd } from "@/lib/dishwasher-seo";

export const metadata = dishwasherMetadata();

export default function DishwasherRepairPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(dishwasherJsonLd()) }} /><DishwasherServicePage /></>;
}
