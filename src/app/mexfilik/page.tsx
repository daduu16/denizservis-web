import { T } from "@/components/LanguageProvider";
import { metadataForPage } from "@/lib/seo";
import { AnalyticsPreferences } from "@/components/AnalyticsPreferences";
import { siteConfig } from "@/config/site";

export const metadata = metadataForPage("/mexfilik", "Məxfilik və Məlumatların İşlənməsi | DənizServis", "DənizServis saytında müraciət məlumatlarının istifadəsi, e-mail göndərişi, YouTube və WhatsApp keçidləri, analitika seçimi və məxfilik barədə məlumat.", undefined, true);

export default function PrivacyPage() {
  return (
    <article className="container legal-page">
      <span className="section-kicker"><T>Məxfilik</T></span>
      <h1><T>Müraciət məlumatlarının işlənməsi</T></h1>
      <p><T>Sifariş formasında daxil etdiyiniz ad, telefon, cihaz və ünvan məlumatları yalnız müraciətinizin qiymətləndirilməsi və sizinlə əlaqə saxlanılması məqsədilə istifadə olunur.</T></p>
      <h2><T>Toplanan məlumatlar</T></h2>
      <p><T>Ad və telefon məcburi, marka, problem təsviri və ünvan isə istəyə bağlıdır. Sayt ödəniş və ya həssas şəxsiyyət məlumatı toplamır.</T></p>
      <h2><T>Göndərilmə</T></h2>
      <p><T>Forma məlumatları server tərəfdə yoxlanılır və konfiqurasiya olunmuş e-mail xidmətindən servis ünvanına göndərilir. E-mail xidməti qurulmayıbsa müraciət uğurlu kimi qeydə alınmır.</T></p>
      <h2><T>Təhlükəsizlik</T></h2>
      <p><T>Spamın qarşısını almaq üçün sürət məhdudiyyəti və gizli yoxlama sahəsi tətbiq olunur. İnternet üzərindən məlumat ötürülməsinin tam risksiz olduğuna zəmanət verilmir.</T></p>
      <h2><T>YouTube və WhatsApp</T></h2>
      <p><T>Təmir videoları YouTube-un rəsmi player-i ilə göstərilir. Video bölməsinə yaxınlaşdıqda YouTube-a bağlantı qurula bilər; həmin xidmətin məxfilik və cookie qaydaları tətbiq olunur. WhatsApp keçidini açdıqda Meta-nın xidmətinə keçirsiniz. Sayt şəxsi yazışmalarınızı analytics-ə göndərmir.</T></p>
      <h2><T>İstəyə bağlı analitika</T></h2>
      <p><T>Google Analytics yalnız sayt sahibi onu konfiqurasiya etdikdə və siz ayrıca razılıq verdikdə yüklənir. Ölçməyə səhifə baxışları və zəng, WhatsApp, sifariş və YouTube keçidlərinin istifadəsi daxil ola bilər. Ad, telefon nömrəsi, ünvan, problem təsviri və URL sorğu parametrləri analytics hadisələrinə əlavə edilmir. Analitika razılığını bu səhifədən dəyişə bilərsiniz.</T></p>
      <AnalyticsPreferences />
      <h2><T>Məlumatlar barədə müraciət</T></h2>
      <p><T>Müraciət məlumatları və onların silinməsi barədə sualınız varsa, </T>{siteConfig.phone}<T> nömrəsi ilə əlaqə saxlayın. Real saxlanılma müddəti və operatorun hüquqi məlumatları dəqiqləşdirildikdən sonra bu qeyd yenilənməlidir.</T></p>
    </article>
  );
}
