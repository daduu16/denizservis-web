# DənizServis — SEO implementasiyası

Tarix: 2026-11-01. Production deploy edilməyib. Əvvəlki audit `SEO_AUDIT.md`-də saxlanılıb.

## Real tətbiq edilən dəyişikliklər

### Metadata və indeks nəzarəti

- `src/config/seo.ts`: canonical origin `https://denizservis.az`, yalnız real yayımlanmış səhifələr reyestri və deployment indeks siyasəti.
- `src/lib/seo.ts`: unikal title/description/canonical/robots/OG/Twitter factory-si, Organization/WebSite/page/breadcrumb məlumatı, JSON-LD `<` escaping.
- Root layout: az dili, az_AZ locale, viewport, title template, ikon; səhifələr artıq ana səhifənin paylaşım URL-ni kor-koranə miras almır.
- Hər iki xidmətin SEO helper-i ümumi siyasətdən istifadə edir; görünən başlıqlarda əvvəlki qısa tire və “Bakıda” sözünün çıxarılması qorunub. Kommersiya metadata-sında Bakı təbii saxlanılıb.
- Əlaqədə köhnə ServisPlus mətni, ana səhifənin Niyə biz kicker-i və e-mail bildirişinin köhnə brendi düzəldilib.
- Privacy qəsdən noindex/follow və öz canonical-ı ilədir. Digər real public səhifələr production export-da indexable-dır. Dev və preview noindex-dir; preview sitemap boşdur. CF preview branch-i production flag ilə səhvən açıla bilməz.
- `_headers`: pages.dev/default və branch preview hostnames üçün noindex; nosniff və referrer policy. Domen/sxem permanent redirect-i xarici Cloudflare Rule kimi sənədləşdirilib, saxta işləyən `_redirects` yazılmayıb.

### Schema və kontent

- Ünvan olmadan LocalBusiness əvəzinə Organization + həqiqi telefon/contactPoint verilir. Saxta ünvan, saat, rating, review, qiymət və sosial profil yoxdur.
- Xidmətlərdə Service, WebPage, BreadcrumbList və real FAQ mətninə uyğun FAQPage qorunur. Ana səhifədə WebSite, əlaqədə ContactPage, Haqqımızda səhifəsində AboutPage əlavə edilib.
- Google-un 2026 FAQ rich-result funksiyasını dayandırması nəzərə alınıb. FAQPage burada yalnız semantik schema.org məlumatıdır; xüsusi Google görünüşü vəd edilmir. [Google yenilənməsi](https://developers.google.com/search/updates).
- VideoObject/Article/BlogPosting uydurulmayıb: real uploadDate/duration, müəllif və dərc olunmuş məqalə olmadan əlavə edilmir.
- `/haqqimizda` real xidmət yanaşmasını izah edir, footer-dən və əsas xidmətlərə məntiqli linklərlə əlçatandır. `/blog`, brend/rayon route-ları və ayrı `/islerimiz`/`/xeta-kodlari` kopyaları açılmayıb. Mövcud bölmələr istifadə olunur.
- Azərbaycan dilində real 404 və faydalı geri keçidlər yaradılıb. Public səhifələr üçün bir H1 saxlanılıb.

### Mobile-first, performans və accessibility

- Mövcud rənglər, şəkillər, overlay-lər, komponent düzümü və WhatsApp-only mobil sabit düymə qorunur. Yeni Haqqımızda səhifəsi mövcud tipografiya/CTA sistemini istifadə edir.
- Hero priority, next/font self-hosting/swap, responsive WebP srcset və ölçüsü rezerv olunmuş şəkillər saxlanılır.
- Brend loqoları lazy loading-ə keçirilib; iki sətir, seamless CSS loop və reduced motion davranışı dəyişməyib.
- Static builder yalnız source-da istifadə olunan 4 raster üçün responsive variant hazırlayır (əvvəl 10); istifadəçinin orijinal faylları silinməyib. Köhnə export recoverable `out.previous-*` qovluğunda saxlanılır.
- YouTube rəsmi playlist embed + Player API saxlanılıb, Data API/key/backend yoxdur. Observer məsafəsi 300px-dən 100px-ə azaldılıb və iframe native lazy-dir. Click-to-load qiymətləndirilib, lakin avtomatik playlist kartlarını və əlçatmaz video davranışını pozmamaq üçün bu mərhələdə məcburi edilmir. Fərdi videoların tarixi uydurulmur.
- Mobil menyu açıldıqda fokus düymədə saxlanılır, Tab ilk linkə keçir; Tab sərhədləri və Escape-də düyməyə focus qayıtması əlavə edilib. Ətraflı xidmət linklərinin accessible adı konkretləşdirilib.
- Lokal byte ölçüləri hesabatdadır. Lighthouse/CWV nəticəsi ölçülməyibsə score iddiası yoxdur.

### Məxfilik və analitika

- `Analytics.tsx`, `AnalyticsPreferences.tsx`, `Analytics.module.css`, `src/lib/analytics.ts`: həqiqi GA4 ID-si verilərsə ayrıca opt-in, rədd etmə və geri götürmə; skript razılıqdan əvvəl yüklənmir.
- `page_view`, `phone_click`, `whatsapp_click`, `service_page_view`, `contact_form_submit`, `youtube_open`, `service_cta_click` üçün allowlist konteksti.
- Yalnız canonical məlum pathname və service enum; form input, telefon, mesaj, ünvan, query/hash və arbitrary referrer göndərilmir. Form success yalnız `response.ok` olduqdan sonra ölçülür.
- ID verilmədiyindən inteqrasiya hazırda aktiv deyil. E-mail forması və Resend/error davranışı dəyişməyib. Static form disabled vəziyyəti qorunub.
- Məxfilik qeydinə YouTube/WhatsApp, analytics seçimi və operatorun dəqiqləşdirməli olduğu məlumatlar əlavə edilib. Hüquqi təsdiq istifadəçiyə qalır.

## Sənədlər və yoxlama

- `SEO_AUDIT.md`: dəyişiklikdən əvvəl P0/P1/P2 audit.
- `SEO_KEYWORDS.md`: niyyət üzrə prioritet xəritə; saxta həcm və mövqe yoxdur.
- `SEO_CONTENT_PLAN.md`: 12 məqalə üçün struktur, unikal dəyər, təhlükəsizlik, link və dərc qapısı.
- `SEO_LAUNCH_CHECKLIST.md`: Cloudflare, redirect, environment və qəbul addımları.
- `SEO_POST_LAUNCH.md`: GSC, Business Profile, consent/GA4 və KPI qurulumu.
- `SEO_TEST_RESULTS.md`: real komanda/brauzer nəticələri və ölçülməyən sahələr.
- `scripts/check-seo.mjs`: bütün HTML route-ları, metadata, H1, canonical, alt/geometry, daxili link/anchor, JSON-LD/FAQ, sitemap/robots, 404 və preview headers; `qa/seo-validation.json` yaradır.
- `scripts/audit-lighthouse.mjs`: sabit Lighthouse 13.6.0 ilə beş production səhifəsini mobil/desktop SEO kateqoriyasında ölçür və HTML/JSON hesabat saxlayır. On nəticənin hamısı 100/100-dür. Dev versiyasındakı 69-un yalnız qəsdən `noindex` maddəsindən yarandığı real ölçmə ilə təkrarlandı.
- Yeni unit testlər canonical/preview/metadata/Organization və PII-siz analytics mapping-i yoxlayır. Mövcud xidmət schema testləri Organization-a uyğunlaşdırılıb.

## Xaricdə qalan işlər

DNS/HTTPS/permanent redirects, Search Console TXT və sitemap submission, Business Profile təsdiqi, real GA4 ID və canlı consent şəbəkə testi, public staging-də Rich Results Test/Schema Validator, PageSpeed/Lighthouse və field CWV. Google indekslənməsi/sıralama/trafik artımı zəmanət deyil. Lokal schema testləri xarici validatorun əvəzi kimi təqdim edilmir.
