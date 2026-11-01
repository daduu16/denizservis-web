import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { ContactActions } from "@/components/ContactActions";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { basicPageJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata("/haqqimizda");

export default function AboutPage() {
  return (
    <article className="container legal-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(basicPageJsonLd("/haqqimizda", "AboutPage")) }} />
      <span className="section-kicker"><T>DənizServis haqqında</T></span>
      <h1><T>Paltaryuyan və qabyuyan təmirinə aydın yanaşma</T></h1>
      <p><T>DənizServis Bakıda paltaryuyan və qabyuyan maşınların diaqnostikası və təmiri üzrə müraciətləri qəbul edir. Cihazın marka və modeli, müşahidə edilən əlamətlər və texniki yoxlama uyğun həllin seçilməsinə kömək edir.</T></p>
      <h2><T>Nasazlığı başa düşməkdən başlayırıq</T></h2>
      <p><T>Su boşaltmama, sıxmama, isitmə problemi və ya xəta kodu fərqli səbəblərdən yarana bilər. Tək bir əlamətə əsasən hissənin dəyişdirilməsinə qərar verilmir. Yoxlamadan sonra mümkün təmir variantı və ehtiyat hissəsinə ehtiyac izah olunur.</T></p>
      <h2><T>Əvvəlcədən dəqiqləşdirilən şərtlər</T></h2>
      <p><T>Xidmət ünvanını, diaqnostika və səfər haqqını, görüləcək işi, qiyməti və mümkün zəmanət şərtlərini təmirə başlamazdan əvvəl dəqiqləşdirin. Sumqayıt, Xırdalan və yaxın ərazilər üzrə xidmət imkanı ayrıca təsdiqlənməlidir.</T></p>
      <h2><T>Xidmətlərimiz və görülən işlər</T></h2>
      <p><Link className="text-link" href="/xidmetler/paltaryuyan-temiri"><T>Paltaryuyan təmiri</T></Link><T> və </T><Link className="text-link" href="/xidmetler/qabyuyan-temiri"><T>qabyuyan təmiri</T></Link><T> səhifələrində nasazlıqlar, elektron plata və modeldən asılı xəta kodları barədə oxuya bilərsiniz. </T><Link className="text-link" href="/#islerimiz"><T>Təmir videolarına baxın</T></Link>.</p>
      <h2><T>Bizimlə əlaqə</T></h2>
      <p><T>Marka, model və nasazlığı bildirin, uyğun xidmət imkanını birlikdə dəqiqləşdirək. Əlaqə nömrəsi: </T>{siteConfig.phone}.</p>
      <ContactActions bookingHref="/elaqe" /><WhatsAppButton variant="inline" />
    </article>
  );
}
