import { CheckCircle2, ClipboardCheck, Search, Wrench } from "lucide-react";
import { type services } from "@/data/content";
import { BookingForm } from "./BookingForm";
import { FAQ } from "./FAQ";
import { ServiceHero } from "./ServiceHero";
import { Works } from "./Works";

type Service = (typeof services)[number];

export function ServicePage({ service }: { service: Service }) {
  const relatedFaqs = [
    {
      question: `${service.title} üçün qiymət əvvəlcədən məlum olur?`,
      answer: "Dəqiq qiymət nasazlıq və ehtiyat hissəsi ehtiyacı müəyyənləşdirildikdən sonra bildirilir.",
    },
    {
      question: "Cihazın marka və modelini yazmaq vacibdirmi?",
      answer: "Məcburi deyil, amma marka və model məlumatı müraciəti daha düzgün qiymətləndirməyə kömək edir.",
    },
    {
      question: "Nasazlığı necə təsvir edim?",
      answer: "Səs, sızma, xəta kodu və proqramın hansı mərhələdə dayandığı kimi müşahidələri qısa qeyd edin.",
    },
  ];

  return (
    <>
      <ServiceHero service={service} />

      <section className="section">
        <div className="container detail-grid">
          <div>
            <div className="section-heading"><span className="section-kicker">Tipik əlamətlər</span><h2>Nə zaman usta müraciəti faydalıdır?</h2></div>
            <ul className="symptom-list">
              {service.symptoms.map((symptom) => <li key={symptom}><CheckCircle2 aria-hidden="true" />{symptom}</li>)}
            </ul>
          </div>
          <aside className="mini-form-card" id="sifaris">
            <div className="mini-form-heading"><h2>Sürətli müraciət</h2><p>Əsas məlumatları qeyd edin.</p></div>
            <BookingForm compact />
          </aside>
        </div>
      </section>

      <Works />

      <section className="section service-process">
        <div className="container">
          <div className="section-heading section-heading--center"><span className="section-kicker">Xidmət prosesi</span><h2>Nasazlıqdan həllə doğru</h2></div>
          <div className="service-process-grid">
            <article><Search aria-hidden="true" /><h3>Yoxlama</h3><p>Cihazın əlamətləri və nasazlığın mümkün səbəbi yoxlanılır.</p></article>
            <article><ClipboardCheck aria-hidden="true" /><h3>Məlumatlandırma</h3><p>Görüləcək iş və lazım olan hissələr barədə məlumat verilir.</p></article>
            <article><Wrench aria-hidden="true" /><h3>Təmir</h3><p>Razılaşdırılmış iş peşəkar yanaşma ilə icra olunur.</p></article>
          </div>
        </div>
      </section>
      <FAQ items={relatedFaqs} />
    </>
  );
}
