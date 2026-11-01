# DənizServis — implementasiyadan əvvəl SEO auditi

Tarix: 2026-11-01. Əhatə: lokal mənbə kodu, mövcud `out/` statik build-i və localhost:3000. Production domeninə, DNS-ə, Google hesablarına və hostinqə dəyişiklik edilməyib. Bu fayl ilkin vəziyyəti saxlayır; nəticələr `SEO_TEST_RESULTS.md` və düzəlişlər `SEO_IMPLEMENTATION.md` daxilində ayrıca göstəriləcək.

## Başlanğıc vəziyyət

- Next.js 16.4.3, React 19.3.1, App Router, TypeScript strict, Tailwind 4.3.3.
- Aktiv səhifələr: `/`, iki xidmət route-u, `/elaqe`, `/mexfilik`; sitemap və robots mövcuddur. Haqqımızda/blog səhifəsi yoxdur.
- Əsas route-lar localhost-da 200, olmayan `/missing-seo-audit` 404 qaytarır. Standart ingilis dilli 404 istifadə olunur.
- Normal server build e-mail API-sini saxlayır; statik build yalnız frontend-dir, API yoxdur və e-mail forması dürüst şəkildə deaktivdir. Zəng və WhatsApp aktivdir.
- Xidmət mətnləri, 10/7 nasazlıq izahı, 7/6 FAQ, başlıqlar və daxili keçidlər statik HTML-dədir. SEO məzmunu JavaScript-dən asılı deyil.
- Ana səhifə və iki xidmət səhifəsi 320, 360, 375, 390, 430, 768, 1024, 1440px ölçülərində yoxlandı: bir H1, horizontal overflow yoxdur (24 kombinasiya).
- Skip link, görünən focus, labelled form, klaviatura ilə idarə olunan cihaz seçimi və native details FAQ mövcuddur. Mobil menyu Escape ilə bağlanır, ancaq focus-un qaytarılması ayrıca təmin olunmur.
- Mövcud analytics/GSC kodu yoxdur. Telefon/WhatsApp eynidir: `070 552 20 21`. İş saatı, fiziki ünvan, rəylər və sosial profillər təsdiqlənməyib.

## P0 — kritik

Lokal testdə hazırda public xidmət səhifələrinin indekslənən HTML-ni və əsas əlaqə funksiyalarını bloklayan P0 tapılmadı. Production üçün DNS, HTTPS və canonical redirect-lər bu auditdə təsdiqlənməyib: yayıma çıxışdan əvvəl mütləq yoxlanmalıdır. Statik hostinqdə e-mail API-sinin olmaması mövcud arxitekturanın açıq məhdudiyyətidir, saxta uğur göstərilmir.

## P1 — yüksək prioritet tapıntılar

| ID | Tapıntı | Sübut / təsir |
| --- | --- | --- |
| P1-01 | Əlaqə metadata-sında və ana səhifənin Niyə biz hissəsində köhnə ServisPlus adı | `/elaqe` description və `Benefits` kicker-i DənizServis brendi ilə uyğun deyil. API e-mail mövzusu da köhnədir. |
| P1-02 | Bəzi səhifələr ana səhifənin canonical və paylaşım məlumatını miras alır | `/mexfilik` noindex olsa da canonical ana səhifədir. Əlaqə üçün ayrıca OG/Twitter URL/title yoxdur. |
| P1-03 | Preview/staging üçün tətbiq səviyyəli indeks nəzarəti yoxdur | Root robots həmişə index/follow. Cloudflare preview header-i olsa da başqa staging build-də qoruma yoxdur. |
| P1-04 | Ünvanı təsdiqlənmədən LocalBusiness rich-result schema işlədilir | Hər iki xidmət JSON-LD-si fiziki address olmadan LocalBusiness verir. Təhlükəsiz alternativ Organization + real Service məlumatıdır. |
| P1-05 | Ana səhifədə Organization/WebSite məlumatı yoxdur | Biznes identifikasiyası və contactPoint mərkəzləşdirilməyib. |
| P1-06 | Canonical origin istənilən environment URL-ni qəbul edir | Səhv build dəyişəni canonical/sitemap-i test domeninə yönəldə bilər. Domen variantlarının redirect qaydaları yoxdur. |
| P1-07 | Səhv yönləndirmələr və daxili anchor-lar üçün avtomatik tam sayt testi yoxdur | Mövcud check:static iki xidmət səhifəsini yoxlayır, bütün route/link/status/metadata matrisini yoxlamır. |
| P1-08 | Məxfilik mətni YouTube, WhatsApp və gələcək analytics seçimini izah etmir | Üçüncü tərəf iframe-ləri viewport yaxınlığında yüklənir. GA əlavə edilərsə razılıq və PII nəzarəti lazımdır. |

## P2 — inkişaf və optimallaşdırma

- Orijinal hero 1.8MB, logo 1.4MB, paltaryuyan 1.7MB, qabyuyan 1.9MB PNG-dir. Static builder WebP srcset yaradır, ancaq istifadə olunmayan köhnə şəkillərin də 16 ölçüsünü generasiya edir. Orijinallar istifadəçiyə məxsusdur; onları silmək lazım deyil.
- Statik HTML-də istinad olunan ilkin lokal JavaScript: ana səhifə 735,190 bayt / gzip 229,185; əlaqə 735,417 / 229,360; hər xidmət 737,099 / 229,790. Bunlar fayl ölçüləridir, Lighthouse nəticəsi və ya real transfer/field ölçməsi deyil.
- Font next/font ilə self-hosted və swap rejimindədir; hero prioritetli, şəkil sahələri rezervlidir. Brend loqoları aşağıda olsa da eager yüklənir.
- YouTube playlist rəsmi iframe + Player API ilə avtomatikdir, API açarı yoxdur; IntersectionObserver 300px yaxınlıqda yükləyir. Fərdi kartlar eyni anda xarici player yükləyə bilir. Aspekt nisbəti rezervlidir; real video tarixləri və duration olmadığı üçün VideoObject uydurulmamalıdır.
- Favicon/icon metadata yoxdur. Ayrıca real faktlara əsaslanan Haqqımızda və ona daxili keçid faydalıdır.
- Blog, brend və rayon səhifələrini boş və ya kopya mətnlə açmaq olmaz. Mövcud xəta kodu anchor-ları ayrıca nazik səhifədən daha faydalıdır.
- Mobil menyu focus return yaxşılaşdırıla bilər; inline “Ətraflı” xidmət linklərinin accessible adı daha konkret ola bilər.
- Əsas səhifələrin title/description-ları fərqlidir, lakin privacy description ana səhifə ilə eynidir. Görünən ana məzmun dublikat deyil, xidmətlərin mövzusu ayrıdır.
- Sitemap yalnız dörd real indexable URL saxlayır; privacy qəsdən noindex və sitemap-dən kənardır. Lastmod yalnız xidmətlərin content tarixidir.
- Lighthouse/PageSpeed, real Core Web Vitals, axtarış həcmləri/rəqabət, canlı sıralama, Google indekslənməsi və xarici validator nəticələri ölçülməyib. Bu rəqəmlər və “100 bal” iddiası verilməyəcək.

## Cari qaydalar üzrə qeyd

Google FAQ rich-result funksiyasını 7 may 2026-dan dayandırıb və sənədlərini çıxarıb. FAQ HTML istifadəçi üçün qalmalıdır; schema.org FAQPage semantik olaraq saxlanıla bilər, Google rich-result vədi verilmir. [Google changelog](https://developers.google.com/search/updates).

LocalBusiness üçün Google-un tələb etdiyi fiziki ünvan verilməyib; saxta ünvan əvəzinə Organization istifadə edilməlidir. [Google LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business), [Organization](https://developers.google.com/search/docs/appearance/structured-data/organization).

## Status ayrımı

Tamamlandı: mənbə/route/metadata/schema/assets/bundle/mobil/HTTP ilkin auditi.

İstifadəçidən və xarici xidmətlərdən asılıdır: real ünvan və iş saatları, təsdiqlənmiş əlavə ərazilər, hosting/DNS, Search Console/Business Profile/GA4 hesabları, canlı Rich Results/Schema Validator və sahə performansı. Bu mərhələdə hesablara giriş və production deploy edilməyib.
