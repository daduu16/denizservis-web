import { LocalizedNav, LocalizedAside } from "./LocalizedElements";
import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, CircleAlert, Droplets, GlassWater, Power, ShieldCheck, Sparkles, Thermometer, Volume2 } from "lucide-react";
import { services } from "../data/content";
import { dishwasherBrandRows, dishwasherCareTips, dishwasherCodeGroups, dishwasherContent, dishwasherFaqs, dishwasherProblems } from "../data/dishwasher";
import { ServiceHero } from "./ServiceHero";
import { BookingForm } from "./BookingForm";
import { BrandMarquee } from "./BrandMarquee";
import { ContactActions } from "./ContactActions";
import { WhatsAppButton } from "./WhatsAppButton";
import { Works } from "./Works";
import { FAQ } from "./FAQ";
import styles from "./DishwasherServicePage.module.css";

const problemIcons = [ArrowDownToLine, Droplets, Sparkles, Thermometer, GlassWater, Volume2, Power];
const steps = [
  { title: "Müraciət", text: "Marka, model və nasazlığın əlamətlərini bildirin." },
  { title: "Dəqiqləşdirmə", text: "Xidmət ünvanı və ilkin şərtlər dəqiqləşdirilir." },
  { title: "Diaqnostika", text: "Problemin səbəbi texniki yoxlama ilə müəyyən olunur." },
  { title: "Razılaşdırma", text: "Görüləcək iş və ehtiyat hissələrinin qiyməti razılaşdırılır." },
  { title: "Təmir və yoxlama", text: "Razılaşdırılmış iş yerinə yetirilir, cihazın fəaliyyəti yoxlanılır." },
];

export function DishwasherServicePage() {
  return (
    <>
      <ServiceHero service={services[1]} title={dishwasherContent.title} description={dishwasherContent.lead} />

      <section className={`${styles.section} ${styles.white}`} id="nasazliqlar" aria-labelledby="problems-title">
        <div className="container">
          <div className={styles.sectionHeading}><span className="section-kicker"><T>Nasazlığı seçin</T></span><h2 id="problems-title"><T>Hansı problemlə qarşılaşmısınız?</T></h2><p><T>Əlaməti seçərək mümkün səbəblər barədə oxuyun. Dəqiq nəticə diaqnostikadan sonra məlum olur.</T></p></div>
          <ul className={styles.problemGrid}>
            {dishwasherProblems.map((problem, index) => {
              const Icon = problemIcons[index];
              return <li key={problem.id}><a href={`#${problem.id}`} className={styles.problemLink}><span className={styles.problemIcon}><Icon size={21} aria-hidden="true" /></span><span><T>{problem.title}</T></span><ArrowUpRight size={17} aria-hidden="true" /></a></li>;
            })}
          </ul>
          <LocalizedNav className={styles.topicLinks} aria-label="Qabyuyan təmiri mövzuları"><a href="#elektron-plata"><T>Elektron plata</T></a><a href="#xeta-kodlari"><T>Xəta kodları</T></a><a href="#islerimiz"><T>Təmir videoları</T></a><a href="#qiymet-sertler"><T>Qiymət və şərtlər</T></a></LocalizedNav>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="diagnosis-title">
        <div className={`container ${styles.articleLayout}`}>
          <div className={styles.articleBody}>
            <div className={styles.sectionHeading}><span className="section-kicker"><T>Əlamətdən səbəbə</T></span><h2 id="diagnosis-title"><T>Nasazlığın əlamətləri nə deyir?</T></h2><p><T>DənizServis qabyuyan maşınların yoxlanılması və təmiri üzrə müraciətləri qəbul edir. Marka, model və müşahidə etdiyiniz əlamətlər uyğun yoxlama istiqamətini müəyyənləşdirməyə kömək edir.</T></p></div>
            <div className={styles.problemDetails}>{dishwasherProblems.map((problem, index) => <article id={problem.id} key={problem.id}><span className={styles.articleNumber}>{String(index + 1).padStart(2, "0")}</span><div><h3><T>{problem.heading}</T></h3><p><T>{problem.text}</T></p></div></article>)}</div>
            <LocalizedAside className={styles.safetyNote} aria-label="Təhlükəsizlik qeydi"><ShieldCheck size={24} aria-hidden="true" /><p><T>Su sızması və ya yanıq qoxusu varsa, cihazdan istifadə etməyin. İstifadəçi təlimatına əməl edin; elektrik və daxili mexaniki hissələrə müdaxiləni ustaya həvalə edin.</T></p></LocalizedAside>
          </div>
          <aside className={`mini-form-card ${styles.booking}`} id="sifaris" aria-labelledby="dishwasher-booking-title">
            <div className={styles.bookingHeading}><h2 id="dishwasher-booking-title"><T>Problemi bizə bildirin</T></h2></div>
            <BookingForm compact hideNote />
          </aside>
        </div>
      </section>

      <BrandMarquee rows={dishwasherBrandRows} title="Qabyuyanınız hansı markadır?" />

      <section className={`${styles.section} ${styles.boardSection}`} id="elektron-plata" aria-labelledby="board-title">
        <div className={`container ${styles.twoColumns}`}>
          <div><span className="section-kicker"><T>İdarəetmə elektronikası</T></span><h2 id="board-title"><T>Qabyuyan maşının elektron plata təmiri</T></h2><p><T>Elektron plata su girişini, isitmə prosesini, nasosu və yuma proqramlarını idarə edir. Cihazın açılmaması və ya proqramın dayanması plata ilə əlaqəli ola bilər, lakin təkcə bu əlamətlər diaqnoz qoymaq üçün kifayət deyil.</T></p><p><T>Təmirin mümkünlüyü yoxlamadan sonra müəyyən olunur. Bəzi hallarda komponent səviyyəsində təmir mümkündür; ciddi zədələnmədə modulun dəyişdirilməsi lazım gələ bilər.</T></p></div>
          <div className={styles.infoPanel}><h3><T>Nə zaman yoxlama lazımdır?</T></h3><ul className={styles.checkList}>{["Cihaz açılmır və ya düymələr cavab vermir", "Proqram yarımçıq dayanır", "Müəyyən funksiyalar işləmir", "Ekranda təkrarlanan xəta kodu görünür"].map((text) => <li key={text}><CircleAlert size={18} aria-hidden="true" /><T>{text}</T></li>)}</ul><p className={styles.panelNote}><T>Təmir və ya dəyişdirmə qərarı yalnız diaqnostikadan sonra verilir. Görüləcək iş və hissə uyğunluğu əvvəlcədən razılaşdırılır.</T></p></div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.white}`} id="xeta-kodlari" aria-labelledby="codes-title">
        <div className="container">
          <div className={styles.sectionHeading}><span className="section-kicker"><T>Ekrandakı kod nə deməkdir?</T></span><h2 id="codes-title"><T>Qabyuyan maşın xəta kodları</T></h2><p><T>Kod problemin istiqamətini göstərə bilər, lakin qəti diaqnoz deyil. İzah modeldən asılıdır; tam model nömrəsi və cihazın təlimatı ilə yoxlanmalıdır.</T></p></div>
          <div className={styles.codeGrid}>{dishwasherCodeGroups.map((group) => <article className={styles.codeCard} key={group.brand}><h3><T>{group.brand}</T></h3><dl>{group.codes.map(({ code, meaning }) => <div key={code}><dt><code>{code}</code></dt><dd><T>{meaning}</T></dd></div>)}</dl></article>)}</div>
        </div>
      </section>

      <Works />

      <section className={`${styles.section} ${styles.white}`} id="qiymet-sertler" aria-labelledby="terms-title">
        <div className="container"><div className={styles.sectionHeading}><span className="section-kicker"><T>Aydın şərtlər</T></span><h2 id="terms-title"><T>Qiymət və təmir şərtləri necə dəqiqləşir?</T></h2><p><T>Qiymət cihazın modelindən, nasazlıqdan və ehtiyat hissəsi ehtiyacından asılıdır. Diaqnostika haqqı, səfər imkanı və mümkün zəmanət şərtləri müraciət zamanı dəqiqləşdirilir.</T></p></div><ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3><T>{step.title}</T></h3><p><T>{step.text}</T></p></div></li>)}</ol></div>
      </section>

      <section className={styles.section} aria-labelledby="care-title"><div className={`container ${styles.twoColumns}`}><div><span className="section-kicker"><T>Gündəlik qulluq</T></span><h2 id="care-title"><T>Qabyuyan maşının ömrünü uzatmaq üçün</T></h2><ul className={styles.checkList}>{dishwasherCareTips.map((tip) => <li key={tip}><ShieldCheck size={19} aria-hidden="true" /><T>{tip}</T></li>)}</ul></div><aside className={styles.infoPanel}><span className="section-kicker"><T>Xidmət ərazisi</T></span><h3><T>Bakı və yaxın ərazilərdən müraciət</T></h3><p><T>Bakı, Sumqayıt, Xırdalan və Abşeron ərazisindən müraciət edirsinizsə, ünvanınızı bildirin. Həmin ərazi üzrə səfər və xidmət imkanını əvvəlcədən dəqiqləşdirək.</T></p><p><T>Qabyuyanla yanaşı paltaryuyanda da problem var?</T></p><Link href="/xidmetler/paltaryuyan-temiri" className={styles.textLink}><T>Paltaryuyan təmiri </T><ArrowUpRight size={17} aria-hidden="true" /></Link></aside></div></section>

      <FAQ items={dishwasherFaqs} showConsultation />

      <section className={styles.closing} aria-labelledby="dishwasher-contact-title"><div className={`container ${styles.closingLayout}`}><div><span className="section-kicker"><T>DənizServis ilə əlaqə</T></span><h2 id="dishwasher-contact-title"><T>Qabyuyan maşınınızda problem var?</T></h2><p><T>Marka, model və nasazlığı bildirin. Uyğun yoxlama və təmir imkanlarını birlikdə dəqiqləşdirək.</T></p><Link href="/elaqe" className={styles.closingLink}><T>Əlaqə səhifəsi </T><ArrowUpRight size={17} aria-hidden="true" /></Link></div><div className={styles.closingActions}><ContactActions bookingHref={`${dishwasherContent.path}#sifaris`} /><WhatsAppButton variant="inline" /></div></div></section>
    </>
  );
}
