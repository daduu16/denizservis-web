import { T } from "@/components/LanguageProvider";
import { SectionLink } from "./SectionLink";
import { ArrowRight, CalendarCheck, Phone, Wrench } from "lucide-react";
import { normalizePhone, siteConfig } from "@/config/site";

export function ContactActions({ compact = false, hero = false, bookingHref = "/#sifaris" }: { compact?: boolean; hero?: boolean; bookingHref?: string }) {
  const phone = normalizePhone(siteConfig.phone);

  return (
    <div className={`contact-actions ${compact ? "contact-actions--compact" : ""} ${hero ? "hero-actions" : ""}`}>
      <SectionLink href={bookingHref} className="button">
        {hero ? <Wrench aria-hidden="true" size={27} /> : <CalendarCheck aria-hidden="true" size={20} />}<T>
        Usta sifariş et
        </T>{hero && <ArrowRight className="cta-arrow" aria-hidden="true" size={20} />}
      </SectionLink>
      {phone ? (
        <a href={`tel:${phone}`} className="button button--secondary">
          <Phone aria-hidden="true" size={20} />
          <span><T>Zəng et</T>{hero && <small>{siteConfig.phone}</small>}</span>
        </a>
      ) : (
        <span className="button button--secondary button--disabled" aria-disabled="true" title="Telefon nömrəsi hələ konfiqurasiya edilməyib">
          <Phone aria-hidden="true" size={20} />
          {hero ? <span><T>Zəng et</T><small><T>Nömrə əlavə ediləcək</T></small></span> : "Zəng nömrəsi əlavə ediləcək"}
        </span>
      )}
    </div>
  );
}
