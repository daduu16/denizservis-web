import { T } from "@/components/LanguageProvider";
import { LocalizedImage as Image } from "./LocalizedElements";
import { ContactActions } from "./ContactActions";
import { WhatsAppButton } from "./WhatsAppButton";
import { ShieldCheck } from "lucide-react";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        <Image src="/images/denizservis-hero.png" alt="Paltaryuyan maşını yoxlayan DənizServis ustası" fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="hero-photo" />
      </div>
      <div className={styles.warranty}>
        <ShieldCheck className={styles.seal} aria-hidden="true" />
        <strong><T>Zəmanətli təmir</T></strong>
        <span className={styles.brand}>DənizServis</span>
      </div>
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-intro">
            <h1 id="hero-title">
              <span className="hero-title-line"><T>Paltaryuyan və</T></span>{" "}
              <span className="hero-title-line"><T context="hero.dishwasher">qabyuyan təmiri</T></span>
            </h1>
            <p className="hero-lead"><T>Sürətli müraciət, peşəkar usta, etibarlı xidmət</T></p>
          </div>
          <ContactActions hero />
          <WhatsAppButton variant="inline" />
        </div>
      </div>
    </section>
  );
}
