import { T } from "@/components/LanguageProvider";
import { ArrowUpRight, ClipboardList, Mail, Phone } from "lucide-react";
import { BookingForm } from "@/components/BookingForm";
import { normalizePhone, siteConfig, whatsappHref } from "@/config/site";
import { basicPageJsonLd, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { LocalizedAnchor } from "@/components/LocalizedElements";
import styles from "./page.module.css";

export const metadata = pageMetadata("/elaqe");

export default function ContactPage() {
  const phone = normalizePhone(siteConfig.phone);
  const whatsapp = whatsappHref(siteConfig.whatsapp);
  return (
    <section className={styles.page} aria-labelledby="contact-title">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(basicPageJsonLd("/elaqe", "ContactPage")) }} />
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <h1 id="contact-title"><T>Təmir barədə</T><br /><span><T>danışaq.</T></span></h1>
          <p className={styles.lead}><T>Zəng edin, WhatsApp-da yazın və ya e-mail göndərin. Sizə uyğun əlaqə yolunu seçin.</T></p>

          <div className={styles.methods}>
            {phone && <a href={`tel:${phone}`} className={`${styles.method} ${styles.phone}`}>
              <span className={styles.icon}><Phone aria-hidden="true" /></span>
              <span className={styles.methodBody}>
                <span className={styles.label}><T>Telefon</T></span>
                <span className={styles.value}>{siteConfig.phone}</span>
                <span className={styles.caption}><T>Birbaşa danışaq</T></span>
              </span>
              <span className={styles.arrow}><ArrowUpRight aria-hidden="true" /></span>
            </a>}
            {whatsapp && <LocalizedAnchor href={whatsapp} className={`${styles.method} ${styles.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ilə Yazın — yeni pəncərədə açılır">
              <span className={styles.icon}>
                <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <path d="M27.6 15.7A11.6 11.6 0 0 1 10.4 26L4 27.8l1.8-6.2A11.6 11.6 0 1 1 27.6 15.7Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
                  <path d="m11.1 9.9 1.6 3.3-1.4 1.7c1.2 2.4 3 4.2 5.4 5.3l1.7-1.4 3.3 1.6c.1 1.4-.8 2.6-2.2 2.8-4.5-.1-10.4-5.8-10.7-10.5-.1-1.3.9-2.6 2.3-2.8Z" fill="currentColor" />
                </svg>
              </span>
              <span className={styles.methodBody}>
                <span className={styles.label}>WhatsApp</span>
                <span className={styles.value}>{siteConfig.whatsapp}</span>
                <span className={styles.caption}><T>Foto və ya video ilə problemi göstərin</T></span>
              </span>
              <span className={styles.arrow}><ArrowUpRight aria-hidden="true" /></span>
            </LocalizedAnchor>}
            <a href={`mailto:${siteConfig.email}`} className={`${styles.method} ${styles.email}`}>
              <span className={styles.icon}><Mail aria-hidden="true" /></span>
              <span className={styles.methodBody}>
                <span className={styles.label}><T>E-mail</T></span>
                <span className={styles.value}>{siteConfig.email}</span>
                <span className={styles.caption}><T>Yazılı müraciətləriniz üçün</T></span>
              </span>
              <span className={styles.arrow}><ArrowUpRight aria-hidden="true" /></span>
            </a>
          </div>
        </div>

        <div className={styles.formPanel}>
          <div className={styles.formHeading}>
            <span className={styles.formIcon}><ClipboardList aria-hidden="true" /></span>
            <div>
              <span className={styles.formKicker}><T>Müraciət forması</T></span>
              <h2><T>Usta müraciəti</T></h2>
            </div>
          </div>
          <p className={styles.formLead}><T>Paltaryuyan və ya qabyuyan maşınınız barədə əsas məlumatları qeyd edin.</T></p>
          <BookingForm compact />
        </div>
      </div>
    </section>
  );
}
