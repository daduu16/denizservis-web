import { T } from "@/components/LanguageProvider";
import { LocalizedImage as Image } from "./LocalizedElements";
import type { services } from "../data/content";
import { ContactActions } from "./ContactActions";
import { WhatsAppButton } from "./WhatsAppButton";
import styles from "./ServiceHero.module.css";

export function ServiceHero({ service, title, description }: { service: (typeof services)[number]; title?: string; description?: string }) {
  return (
    <section className={`${styles.hero} ${title ? styles.seoHero : ""}`} aria-labelledby="service-hero-title">
      <div className={styles.media}>
        <Image src={service.image} alt={service.alt} fill priority sizes="(min-width: 1150px) 620px, (min-width: 1024px) 54vw, (min-width: 829px) 580px, (min-width: 768px) 70vw, 88vw" className={styles.photo} />
      </div>
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <div className={styles.intro}>
            <h1 id="service-hero-title" className={styles.title}><T>{title ?? service.title}</T></h1>
            <p className={styles.lead}><T>{description ?? `${service.shortDescription} Müraciətinizi göndərin, detalları dəqiqləşdirmək üçün sizinlə əlaqə saxlanılsın.`}</T></p>
          </div>
          <div className={styles.actions}>
            <ContactActions hero bookingHref={`/xidmetler/${service.slug}#sifaris`} />
            <WhatsAppButton variant="inline" />
          </div>
        </div>
      </div>
    </section>
  );
}
