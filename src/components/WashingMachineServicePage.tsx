import { LocalizedNav, LocalizedAside } from "./LocalizedElements";
import { T } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowDownToLine, ArrowUpRight, CircleAlert, Droplets, LockKeyhole, Mail, MoveHorizontal, Power, RotateCcw, RotateCw, ShieldCheck, Thermometer, Volume2 } from "lucide-react";
import { siteConfig } from "@/config/site";
import { services } from "../data/content";
import { washingMachineBrandRows, washingMachineCareTips, washingMachineCodeGroups, washingMachineContent, washingMachineFaqs, washingMachineProblems } from "../data/washing-machine";
import { ServiceHero } from "./ServiceHero";
import { BookingForm } from "./BookingForm";
import { BrandMarquee } from "./BrandMarquee";
import { ContactActions } from "./ContactActions";
import { WhatsAppButton } from "./WhatsAppButton";
import { Works } from "./Works";
import { FAQ } from "./FAQ";
// Both service pages intentionally share the same established visual system.
import styles from "./DishwasherServicePage.module.css";

const problemIcons = [ArrowDownToLine, RotateCcw, Volume2, Droplets, Droplets, RotateCw, LockKeyhole, Thermometer, MoveHorizontal, Power];
const boardSymptoms = ["Cihaz açılmır və ya düymələr cavab vermir", "Proqram qəfil dayanır", "Baraban fırlanmır və ya əmrlər yerinə yetirilmir", "Ekranda təkrarlanan xəta kodu görünür"];
const steps = [
  { title: "Əlaqə saxlayın", text: "Marka, model və nasazlığı telefon və ya WhatsApp vasitəsilə bildirin." },
  { title: "Problemi təsvir edin", text: "Əlamətlər, xidmət ünvanı və ilkin şərtlər dəqiqləşdirilir." },
  { title: "Diaqnostika", text: "Cihazın texniki vəziyyəti və nasazlığın səbəbi yoxlanılır." },
  { title: "Qiymətin razılaşdırılması", text: "Görüləcək iş və ehtiyat hissələrinin qiyməti əvvəlcədən bildirilir." },
  { title: "Təmir və yoxlama", text: "Razılaşdırılmış iş tamamlanır, cihazın fəaliyyəti yoxlanılır." },
];

export function WashingMachineServicePage() {
  return (
    <>
      <ServiceHero service={services[0]} title={washingMachineContent.title} description={washingMachineContent.lead} />

      <section className={`${styles.section} ${styles.white}`} id="nasazliqlar" aria-labelledby="problems-title">
        <div className="container">
          <div className={styles.sectionHeading}>
            <span className="section-kicker"><T>Nasazlığı seçin</T></span>
            <h2 id="problems-title"><T>Hansı problemlə qarşılaşmısınız?</T></h2>
            <p><T>Əlaməti seçərək mümkün səbəblər barədə oxuyun. Dəqiq nəticə diaqnostikadan sonra məlum olur.</T></p>
          </div>
          <ul className={styles.problemGrid}>
            {washingMachineProblems.map((problem, index) => {
              const Icon = problemIcons[index];
              return <li key={problem.id}><a href={`#${problem.id}`} className={styles.problemLink}><span className={styles.problemIcon}><Icon size={21} aria-hidden="true" /></span><span><T>{problem.title}</T></span><ArrowUpRight size={17} aria-hidden="true" /></a></li>;
            })}
          </ul>
          <LocalizedNav className={styles.topicLinks} aria-label="Paltaryuyan təmiri mövzuları">
            <a href="#elektron-plata"><T>Elektron plata</T></a><a href="#xeta-kodlari"><T>Xəta kodları</T></a><a href="#islerimiz"><T>Təmir videoları</T></a><a href="#qiymet-sertler"><T>Qiymət və şərtlər</T></a>
          </LocalizedNav>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="diagnosis-title">
        <div className={`container ${styles.articleLayout}`}>
          <div className={styles.articleBody}>
            <div className={styles.sectionHeading}>
              <span className="section-kicker"><T>Əlamətdən səbəbə</T></span>
              <h2 id="diagnosis-title"><T>Nasazlığın əlamətləri nə deyir?</T></h2>
              <p><T>DənizServis paltaryuyan maşınların diaqnostikası və təmiri üzrə müraciətləri qəbul edir. Məqsəd nasazlığın səbəbini müəyyənləşdirmək, uyğun təmir variantını izah etmək və cihazın işini yoxlamaqdır.</T></p>
              <p><T>Samsung EcoBubble, LG Direct Drive və Bosch i-DOS kimi texnologiyalarda modelin xüsusiyyətləri nəzərə alınır. Marka və model məlumatı uyğun yoxlama istiqamətinin və ehtiyat hissəsinin seçilməsinə kömək edir.</T></p>
            </div>
            <div className={styles.problemDetails}>
              {washingMachineProblems.map((problem, index) => <article id={problem.id} key={problem.id}><span className={styles.articleNumber}>{String(index + 1).padStart(2, "0")}</span><div><h3><T>{problem.heading}</T></h3><p><T>{problem.text}</T></p></div></article>)}
            </div>
            <LocalizedAside className={styles.safetyNote} aria-label="Təhlükəsizlik qeydi"><ShieldCheck size={24} aria-hidden="true" /><p><T>Su sızması, yanıq qoxusu, güclü metal səsi və ya zərbə varsa, cihazdan istifadə etməyin. İstifadəçi təlimatına əməl edin; elektrik və daxili mexaniki hissələrə müdaxiləni ustaya həvalə edin.</T></p></LocalizedAside>
          </div>
          <aside className={`mini-form-card ${styles.booking}`} id="sifaris" aria-labelledby="washing-booking-title">
            <div className={styles.bookingHeading}><h2 id="washing-booking-title"><T>Problemi bizə bildirin</T></h2></div>
            <BookingForm compact hideNote />
          </aside>
        </div>
      </section>

      <BrandMarquee rows={washingMachineBrandRows} title="Paltaryuyanınız hansı markadır?" description="Bütün modellər üzrə müraciət edə bilərsiniz." />

      <section className={`${styles.section} ${styles.boardSection}`} id="elektron-plata" aria-labelledby="board-title">
        <div className={`container ${styles.twoColumns}`}>
          <div>
            <span className="section-kicker"><T>İdarəetmə elektronikası</T></span>
            <h2 id="board-title"><T>Paltaryuyan maşının elektron plata təmiri</T></h2>
            <p><T>Elektron plata suyun qəbulunu, mühərrikin işini, temperaturu və yuma proqramlarını idarə edir. Cihazın açılmaması, proqramın dayanması və ekranın düzgün işləməməsi plata ilə əlaqəli ola bilər, lakin təkcə bu əlamətlər diaqnoz deyil.</T></p>
            <p><T>Bəzi hallarda zədələnmiş komponentləri təmir etmək mümkündür. Təmir və ya modulun dəyişdirilməsi qərarı texniki yoxlama, hissələrin mövcudluğu və iqtisadi məqsədəuyğunluq nəzərə alınaraq verilir.</T></p>
          </div>
          <div className={styles.infoPanel}>
            <h3><T>Nə zaman yoxlama lazımdır?</T></h3>
            <ul className={styles.checkList}>{boardSymptoms.map((text) => <li key={text}><CircleAlert size={18} aria-hidden="true" /><T>{text}</T></li>)}</ul>
            <p className={styles.panelNote}><T>Plata nasazlığı yalnız diaqnostikadan sonra təsdiqlənir. Görüləcək iş, hissə uyğunluğu və qiymət əvvəlcədən razılaşdırılır.</T></p>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.white}`} id="xeta-kodlari" aria-labelledby="codes-title">
        <div className="container">
          <div className={styles.sectionHeading}><span className="section-kicker"><T>Ekrandakı kod nə deməkdir?</T></span><h2 id="codes-title"><T>Paltaryuyan maşın xəta kodları</T></h2><p><T>Kod problemin istiqamətini göstərə bilər, lakin qəti diaqnoz deyil. Eyni kod müxtəlif modellərdə fərqli məna daşıya bilər. Kodun şəklini və model nömrəsini bildirin; izah həmin modelin təlimatı ilə yoxlanmalıdır.</T></p></div>
          <div className={styles.codeGrid}>{washingMachineCodeGroups.map((group) => <article className={styles.codeCard} key={group.brand}><h3><T>{group.brand}</T></h3><dl>{group.codes.map(({ code, meaning }) => <div key={code}><dt><code>{code}</code></dt><dd><T>{meaning}</T></dd></div>)}</dl></article>)}</div>
        </div>
      </section>

      <Works />

      <section className={`${styles.section} ${styles.white}`} id="qiymet-sertler" aria-labelledby="terms-title">
        <div className="container">
          <div className={styles.sectionHeading}><span className="section-kicker"><T>Aydın şərtlər</T></span><h2 id="terms-title"><T>Qiymət və təmir şərtləri necə dəqiqləşir?</T></h2><p><T>Qiymət cihazın markasına, modelinə, nasazlığın xarakterinə və ehtiyat hissəsi ehtiyacına görə dəyişir. Sadə tıxanmanın aradan qaldırılması ilə mühərrik, podşipnik və plata təmiri eyni xərc tələb etmir.</T></p><p><T>Dəqiq məbləğ diaqnostikadan sonra bildirilir. Diaqnostika haqqını, ustanın ünvana gəlməsini, görüləcək işi və mümkün zəmanət şərtlərini əvvəlcədən dəqiqləşdirin.</T></p></div>
          <ol className={styles.steps}>{steps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3><T>{step.title}</T></h3><p><T>{step.text}</T></p></div></li>)}</ol>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="care-title">
        <div className={`container ${styles.twoColumns}`}>
          <div><span className="section-kicker"><T>Gündəlik qulluq</T></span><h2 id="care-title"><T>Paltaryuyan maşın üçün 8 qulluq məsləhəti</T></h2><ul className={styles.checkList}>{washingMachineCareTips.map((tip) => <li key={tip}><ShieldCheck size={19} aria-hidden="true" /><T>{tip}</T></li>)}</ul></div>
          <aside className={styles.infoPanel}>
            <span className="section-kicker"><T>Xidmət ərazisi</T></span><h3><T>Bakı və yaxın ərazilərdən müraciət</T></h3>
            <p><T>Nəsimi, Yasamal, Nərimanov, Xətai, Nizami, Binəqədi, Sabunçu, Suraxanı, Səbail, Xəzər və Qaradağdan müraciət edirsinizsə, ünvanınızı bildirin, xidmət imkanını dəqiqləşdirək.</T></p>
            <p><T>Sumqayıt, Xırdalan, Masazır, Zabrat, Mərdəkan, Buzovna və digər yaxın ərazilər üzrə səfər imkanı və şərtlər də əvvəlcədən dəqiqləşdirilir.</T></p>
            <p><T>Qabyuyan maşınınızda da problem var?</T></p><Link href="/xidmetler/qabyuyan-temiri" className={styles.textLink}><T>Qabyuyan təmiri </T><ArrowUpRight size={17} aria-hidden="true" /></Link>
          </aside>
        </div>
      </section>

      <FAQ items={washingMachineFaqs} showConsultation />

      <section className={styles.closing} aria-labelledby="washing-contact-title">
        <div className={`container ${styles.closingLayout}`}>
          <div><span className="section-kicker"><T>DənizServis ilə əlaqə</T></span><h2 id="washing-contact-title"><T>Paltaryuyan maşınınızda problem var?</T></h2><p><T>Rahat əlaqə, modelə uyğun yoxlama və aydın məlumatlandırma. Marka, model və nasazlığı bildirin, uyğun xidmət imkanlarını birlikdə dəqiqləşdirək.</T></p><Link href="/elaqe" className={styles.closingLink}><T>Əlaqə səhifəsi </T><ArrowUpRight size={17} aria-hidden="true" /></Link><a href={siteConfig.emailHref} className={styles.closingEmail}><Mail size={19} aria-hidden="true" /><span>{siteConfig.email}</span></a></div>
          <div className={styles.closingActions}><ContactActions bookingHref={`${washingMachineContent.path}#sifaris`} /><WhatsAppButton variant="inline" /></div>
        </div>
      </section>
    </>
  );
}
