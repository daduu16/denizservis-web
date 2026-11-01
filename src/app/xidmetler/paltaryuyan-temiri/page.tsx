import { WashingMachineServicePage } from "@/components/WashingMachineServicePage";
import { washingMachineJsonLd, washingMachineMetadata } from "@/lib/washing-machine-seo";
import { serializeJsonLd } from "@/lib/dishwasher-seo";

export const metadata = washingMachineMetadata();

export default function WashingMachineRepairPage() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(washingMachineJsonLd()) }} /><WashingMachineServicePage /></>;
}
