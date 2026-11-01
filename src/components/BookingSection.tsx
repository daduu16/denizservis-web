import { CalendarCheck2, LockKeyhole } from "lucide-react";
import { BookingForm } from "./BookingForm";

export function BookingSection() {
  return (
    <section className="section booking-section" id="sifaris" aria-labelledby="booking-title">
      <div className="container booking-shell">
        <div className="booking-copy">
          <span className="feature-icon"><CalendarCheck2 aria-hidden="true" /></span>
          <span className="section-kicker section-kicker--light">Sürətli sifariş</span>
          <h2 id="booking-title">Problemi qısa yazın, əlaqə üçün məlumat verin</h2>
          <p>Müraciətiniz e-mail inteqrasiyası vasitəsilə servis komandasına göndərilir. Qiymət və müddət nasazlıq yoxlanıldıqdan sonra dəqiqləşdirilir.</p>
          <div className="privacy-note"><LockKeyhole aria-hidden="true" /><span>Məlumatlarınız yalnız müraciətə cavab vermək üçün istifadə olunur.</span></div>
        </div>
        <div className="form-card">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}
