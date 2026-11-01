import { T } from "@/components/LanguageProvider";
import { LocalizedImage as Image } from "./LocalizedElements";
import { ContactActions } from "./ContactActions";
import { WhatsAppButton } from "./WhatsAppButton";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-media">
        <Image src="/images/denizservis-hero.png" alt="Paltaryuyan maşını yoxlayan DənizServis ustası" fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="hero-photo" />
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
