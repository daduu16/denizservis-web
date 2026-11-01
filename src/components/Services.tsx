import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/content";

export function Services() {
  return (
    <section className="section services-section" id="xidmetler" aria-labelledby="services-title">
      <div className="container">
        <div className="section-heading">
          <span className="section-kicker">Xidmətlərimiz</span>
          <h2 id="services-title">Evin əsas köməkçiləri üçün peşəkar servis</h2>
          <p>Paltaryuyan və qabyuyan maşınlarda yaranan problemlərin səbəbini müəyyənləşdirir, uyğun təmir variantını izah edirik.</p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article className="service-card" key={service.slug}>
              <div className="service-image">
                <Image src={service.image} alt={service.alt} fill sizes="(max-width: 767px) 100vw, 50vw" className="object-contain" />
              </div>
              <div className="service-card-body">
                <span className="feature-icon feature-icon--small"><service.Icon aria-hidden="true" /></span>
                <h3>{service.title}</h3>
                <p>{service.shortDescription}</p>
                <Link href={`/xidmetler/${service.slug}`} className="text-link">
                  Ətraflı məlumat <ArrowUpRight aria-hidden="true" size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
