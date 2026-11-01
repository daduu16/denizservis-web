import { T } from "@/components/LanguageProvider";
import { LocalizedImage as Image } from "./LocalizedElements";
import { LocalizedLink as Link } from "./LocalizedElements";
import { ArrowUpRight, CalendarCheck2 } from "lucide-react";
import { services } from "@/data/content";
import { BookingForm } from "./BookingForm";

export function HomeShowcase() {
  return (
    <section className="showcase-section" id="xidmetler" aria-labelledby="services-title">
      <div className="container">
        <div className="showcase-heading">
          <div className="section-heading">
            <span className="section-kicker"><T>Xidmətlərimiz</T></span>
            <h2 id="services-title"><T>Texnikanız üçün düzgün xidmətə bir addım</T></h2>
          </div>
        </div>

        <div className="showcase-grid">
          <div className="showcase-services">
            {services.map((service) => (
              <Link href={`/xidmetler/${service.slug}`} className="showcase-card" aria-label={`${service.title} haqqında ətraflı`} key={service.slug}>
                <div className="showcase-card-image">
                  <Image src={service.image} alt={service.alt} fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 24vw" className="object-contain" />
                </div>
                <div className="showcase-card-body">
                  <h3><T>{service.title}</T></h3>
                  <p><T>{service.shortDescription}</T></p>
                  <span className="text-link"><T>Ətraflı </T><ArrowUpRight aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>

          <aside className="showcase-form" id="sifaris" aria-labelledby="booking-title">
            <div className="showcase-form-heading">
              <span className="feature-icon"><CalendarCheck2 aria-hidden="true" /></span>
              <div><h2 id="booking-title"><T>Usta müraciəti yaradın</T></h2></div>
            </div>
            <BookingForm compact />
          </aside>
        </div>
      </div>
    </section>
  );
}
