import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Səhifə tapılmadı | DənizServis" }, description: "Axtardığınız səhifə mövcud deyil. DənizServis-in əsas səhifəsinə və ya xidmətlərinə keçin.", alternates: { canonical: null }, robots: { index: false, follow: true } };

export default function NotFound() {
  return <section className="container legal-page"><span className="section-kicker">404</span><h1><T>Səhifə tapılmadı</T></h1><p><T>Keçid dəyişmiş və ya səhifə mövcud olmaya bilər.</T></p><p><Link className="text-link" href="/"><T>Əsas səhifəyə qayıt</T></Link></p><p><Link className="text-link" href="/xidmetler/paltaryuyan-temiri"><T>Paltaryuyan təmiri</T></Link> · <Link className="text-link" href="/xidmetler/qabyuyan-temiri"><T>Qabyuyan təmiri</T></Link> · <Link className="text-link" href="/elaqe"><T>Əlaqə</T></Link></p></section>;
}
