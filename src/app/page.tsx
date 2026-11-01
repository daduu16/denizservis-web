import { Benefits } from "@/components/Benefits";
import { BrandMarquee } from "@/components/BrandMarquee";
import { FAQ } from "@/components/FAQ";
import { Hero } from "@/components/Hero";
import { HomeShowcase } from "@/components/HomeShowcase";
import { Works } from "@/components/Works";
import { basicPageJsonLd, serializeJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(basicPageJsonLd("/")) }} />
      <Hero />
      <HomeShowcase />
      <Works />
      <BrandMarquee />
      <Benefits />
      <FAQ showConsultation />
    </>
  );
}
