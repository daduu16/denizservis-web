import { T } from "@/components/LanguageProvider";
import { benefits } from "@/data/content";
import { ArrowUpRight, Plus, WashingMachine, Utensils } from "lucide-react";
import { LocalizedLink } from "./LocalizedElements";
import { WhatsAppButton } from "./WhatsAppButton";
import styles from "./Benefits.module.css";

export function Benefits() {
  return (
    <section className={styles.section} id="niye-biz" aria-labelledby="benefits-title">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.intro}>
            <span className={styles.kicker}><span aria-hidden="true" /><T>Niyə DənizServis?</T></span>
            <h2 id="benefits-title"><T>Bir mesajla</T><br /><span><T>başlayaq.</T></span></h2>
            <p className={styles.lead}><T>Cihazın problemini siz deyin, növbəti addımı birlikdə dəqiqləşdirək.</T></p>
            <div className={styles.contact}><WhatsAppButton variant="inline" text="Problemi bizə yazın" /></div>
            <div className={styles.services}>
              <LocalizedLink href="/xidmetler/paltaryuyan-temiri"><WashingMachine aria-hidden="true" /><T>Paltaryuyan təmiri</T><ArrowUpRight aria-hidden="true" /></LocalizedLink>
              <LocalizedLink href="/xidmetler/qabyuyan-temiri"><Utensils aria-hidden="true" /><T>Qabyuyan təmiri</T><ArrowUpRight aria-hidden="true" /></LocalizedLink>
            </div>
          </div>
          <div className={styles.journey}>
            <div className={styles.journeyHeading}>
              <span className={styles.eyebrow}><T>SİZİN ÜÇÜN NECƏ İŞLƏYİR?</T></span>
              <p><T>Hər addımda aydınlıq.</T></p>
            </div>
            <ol className={styles.steps}>
              {benefits.map(({ title, description, detail, Icon }, index) => (
                <li className={styles.step} key={title}>
                  <span className={styles.number} aria-hidden="true">0{index + 1}</span>
                  <details className={styles.card}>
                    <summary>
                      <span className={styles.stepIcon}><Icon aria-hidden="true" /></span>
                      <span className={styles.stepCopy}><h3><T>{title}</T></h3><span><T>{description}</T></span></span>
                      <span className={styles.toggle}><Plus aria-hidden="true" /></span>
                    </summary>
                    <div className={styles.detail}><p><T>{detail}</T></p></div>
                  </details>
                </li>
              ))}
            </ol>
            <p className={styles.hint}><Plus aria-hidden="true" /><T>Addımlara toxunaraq ətraflı baxın.</T></p>
          </div>
        </div>
      </div>
    </section>
  );
}
