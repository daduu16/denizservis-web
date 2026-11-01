import { T } from "@/components/LanguageProvider";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/content";
import { WhatsAppButton } from "./WhatsAppButton";
import styles from "./FAQ.module.css";

export function FAQ({ items = faqs, showConsultation = false }: { items?: readonly { question: string; answer: string }[]; showConsultation?: boolean }) {
  return (
    <section className="section faq-section" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div className="section-heading">
          <span className="section-kicker"><T>Tez-tez verilən suallar</T></span>
          <h2 id="faq-title"><T>Sualınız qalıb?</T></h2>
          <p><T>Ən çox soruşulan mövzular üzrə qısa və aydın cavablar.</T></p>
          {showConsultation && <div className={styles.consultation}><WhatsAppButton variant="inline" text="Pulsuz məsləhət al" /></div>}
        </div>
        <div className="faq-list">
          {items.map((item) => (
            <details key={item.question}>
              <summary><T>{item.question}</T><ChevronDown aria-hidden="true" /></summary>
              <div className="faq-answer"><p><T>{item.answer}</T></p></div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
