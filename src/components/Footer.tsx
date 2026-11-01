import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { navigation, normalizePhone, siteConfig, whatsappHref } from "@/config/site";
import { Logo } from "./Logo";
import { SectionLink } from "./SectionLink";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  const phone = normalizePhone(siteConfig.phone);
  const whatsapp = whatsappHref(siteConfig.whatsapp);

  return (
    <footer className="footer" id="elaqe">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p><T>Paltaryuyan və qabyuyan təmiri üçün rahat müraciət platforması.</T></p>
          <SocialLinks />
        </div>
        <div>
          <h2 className="footer-title"><T>Keçidlər</T></h2>
          <ul className="footer-links">
            {navigation.map((item) => <li key={item.href}><SectionLink href={item.href}><T>{item.label}</T></SectionLink></li>)}
            <li><Link href="/haqqimizda"><T>Haqqımızda</T></Link></li>
            <li><Link href="/mexfilik"><T>Məxfilik</T></Link></li>
          </ul>
        </div>
        <div>
          <h2 className="footer-title"><T>Əlaqə məlumatları</T></h2>
          <ul className="footer-contact">
            <li><Phone aria-hidden="true" />{phone ? <a href={`tel:${phone}`}>{siteConfig.phone}</a> : <span><T>Telefon konfiqurasiya edilməyib</T></span>}</li>
            <li><MapPin aria-hidden="true" /><span><T>{siteConfig.serviceArea || "Xidmət zonası konfiqurasiya ediləcək"}</T></span></li>
            <li><Mail aria-hidden="true" /><a href={siteConfig.emailHref}>{siteConfig.email}</a></li>
          </ul>
          {whatsapp && <a className="footer-whatsapp" href={whatsapp} target="_blank" rel="noreferrer"><T>WhatsApp ilə yazın</T></a>}
        </div>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {siteConfig.name}<T>. Bütün hüquqlar qorunur.</T></p>
        <p><T>Paltaryuyan və qabyuyan təmiri üçün DənizServis.</T></p>
      </div>
    </footer>
  );
}
