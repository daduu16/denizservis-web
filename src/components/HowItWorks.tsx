import { ClipboardPenLine, MessageCircleMore, Wrench } from "lucide-react";

const steps = [
  { title: "Müraciət edin", text: "Formada cihaz və əlaqə məlumatlarınızı qeyd edin.", Icon: ClipboardPenLine },
  { title: "Sizinlə əlaqə saxlayırıq", text: "Müraciətinizə əsasən detallar dəqiqləşdirilir.", Icon: MessageCircleMore },
  { title: "Təmir xidməti göstərilir", text: "Nasazlıq yoxlanılır və uyğun həll təqdim olunur.", Icon: Wrench },
];

export function HowItWorks() {
  return (
    <section className="section process-section" id="proses" aria-labelledby="process-title">
      <div className="container">
        <div className="section-heading section-heading--center">
          <span className="section-kicker">Necə işləyir?</span>
          <h2 id="process-title">Üç sadə addım</h2>
        </div>
        <ol className="steps-grid">
          {steps.map(({ title, text, Icon }, index) => (
            <li className="step-card" key={title}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="feature-icon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
