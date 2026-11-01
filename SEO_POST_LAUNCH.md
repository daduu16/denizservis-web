# DənizServis — yayımdan sonra SEO və ölçmə

Tarix: 2026-11-01. Bu sənəd təlimatdır; hesablar yaradılmayıb, DNS dəyişməyib, dashboard qoşulmayıb.

## 1. Google Search Console

1. Sayt sahibinin Google hesabı ilə Search Console-a daxil olun. “Add property” → Domain → `denizservis.az` seçin.
2. Google-un verdiyi həqiqi TXT dəyərini Cloudflare DNS → Records → TXT sahəsinə əlavə edin. Tokeni chat/repo-da dərc etməyin. Domain property TXT ilə doğrulanır; HTML-də saxta token yerləşdirmək DNS təsdiqi deyil.
3. DNS yayılandıqdan sonra Verify edin. HTTPS canonical variantın açıldığını yoxlayın.
4. Sitemaps bölməsində `https://denizservis.az/sitemap.xml` göndərin.
5. URL Inspection ilə ana səhifə, iki xidmət, əlaqə və Haqqımızda səhifəsini yoxlayın. Live test → rendered HTML → user-declared və Google-selected canonical müqayisəsi. İndekslənmə sorğusu indeksə zəmanət deyil.
6. Page indexing hesabatında 404/redirect/noindex/crawled-not-indexed səbəblərini ayrı qiymətləndirin. Privacy və preview-in noindex olması qəsdəndir; onları sitemap-ə əlavə etməyin.
7. Mobil Core Web Vitals hesabatını izləyin. Yeni domen və az trafikdə məlumat olmaması normaldır; yoxdursa “0 problem / mükəmməl nəticə” yazmayın.

## 2. Google Business Profile

1. Profil əvvəl varsa yeni dublikat yaratmayın; sahibliyi doğrulayın. Biznes adı yalnız real `DənizServis` olsun, ada açar söz yığmayın.
2. Cari kateqoriya seçimlərində faktiki xidmətə uyğun məişət texnikası təmiri kateqoriyasını seçin. Kateqoriyanın dəqiq adı ölkə/UI üzrə yoxlanmalıdır.
3. Paltaryuyan və qabyuyan təmirini xidmətlərə əlavə edin. Telefonu, canonical saytı və təsdiqlənmiş iş saatlarını yazın.
4. Müştərinin ünvanına gedirsinizsə və müştəri qəbul edən ofisiniz yoxdursa, service-area business qaydasına uyğun ünvanı ictimai profildə göstərməyin. Yalnız real xidmət ərazilərini əlavə edin. [Google service-area qaydaları](https://support.google.com/business/answer/9157481).
5. Google-un təqdim etdiyi həqiqi təsdiq üsulunu yerinə yetirin. Kod/şəxsiyyət məlumatlarını repo-ya qoymayın.
6. Özünüzə məxsus real iş foto/video materiallarını icazə ilə əlavə edin. Müştəri ünvanı və şəxsi detallar görünməsin.
7. Bütün real müştərilərdən könüllü, dürüst rəy istəyin. Ödəniş, saxta hesab, yalnız müsbət rəy seçimi və öz biznesiniz üçün uydurma review/rating istifadə etməyin. Cavablarda müştərinin şəxsi məlumatını açıqlamayın.

Bu, kodun yaratdığı profil deyil; ayrıca sahib fəaliyyəti və Google təsdiqi tələb edir.

## 3. GA4 — hazır, lakin aktiv olmayan inteqrasiya

1. Sahibin hesabında GA4 property və Web data stream yaradın; canonical URL verin. Həqiqi `G-...` measurement ID-sini alın. Bu public identifikatordur, API secret deyil. Heç bir API açarı lazım deyil.
2. Production build environment-də `NEXT_PUBLIC_GA_ID` verin. Yoxdursa Google skripti və consent paneli render olunmur. Preview-də boş saxlayın.
3. GA4 stream-də Enhanced Measurement xüsusiyyətlərini audit edin; xüsusən avtomatik form interaction/site search/outbound ölçməsini söndürün. Kod yalnız allowlist hadisələr və canonical, query/hash-sız məlum səhifələr göndərir. Form input, linkin mətni, telefon və mesaj event parametri deyil.
4. İstifadəçi `Razıyam` seçənədək Google tag yüklənmir (basic opt-in yanaşması). `İstəmirəm` Google skriptini ilk dəfə yükləmir. Mövcud razılığı Məxfilik səhifəsindəki seçim düyməsi ilə geri götürmək olar; custom hadisələr dayandırılır və həmin host-un GA cookie-ləri təmizlənir.
5. Reklam siqnalları və reklam fərdiləşdirilməsi kodda bağlıdır. GA4 data retention, Google Signals, IP/region qaydaları və hüquqi tələbləri sahib ayrıca qiymətləndirməlidir. Bu məxfilik mətni hüquqi auditin əvəzi deyil.
6. Real ID ilə private browser-də əvvəl rədd edin, Network-də `gtag/js`/analytics collect sorğusu olmamasını yoxlayın; sonra razılıq verin və DebugView/Realtime yoxlayın. Hazırda ID olmadığı üçün real GA şəbəkə qəbul testi aparılmayıb.

| Hadisə | Şərt | Göndərilən təhlükəsiz məlumat |
| --- | --- | --- |
| `page_view` | Razılıqdan sonra məlum route baxışı | Canonical query/hash-sız page_location, boş referrer, service enum |
| `service_page_view` | İki xidmət səhifəsindən biri | washing_machine / dishwasher |
| `phone_click` | `tel:` keçidi | Nömrə yox, yalnız səhifə/service konteksti |
| `whatsapp_click` | `wa.me` keçidi | Telefon və mesaj yox |
| `service_cta_click` | Sifariş anchor-u və ya əlaqə keçidi | Yalnız səhifə/service konteksti |
| `youtube_open` | YouTube-a xarici keçid | Video başlığı/müştəri məlumatı yox |
| `contact_form_submit` | Server cavabı həqiqətən uğurlu olduqda | Form sahələri yox; error və disabled forma ölçülmür |

Static export-da e-mail forması deaktiv olduğu üçün `contact_form_submit` gözlənilmir. WhatsApp/zəng klikləri faktiki tamamlanmış satış və ya təsdiqlənmiş zəng deyil. Sayt in-player izləməni `youtube_open` kimi saymır.

Şəxsi məlumatı Analytics-ə göndərmək olmaz. [Google PII qaydası](https://support.google.com/analytics/answer/6004245).

## 4. KPI və təkrarlanan hesabat

Canlı dashboard yoxdur. İlk olaraq GSC Performance export və GA4 report-u aylıq cədvəldə birləşdirin:

- GSC: organic clicks, impressions, CTR, average position; indekslənən canonical URL sayı.
- Ölçülər: sorğu qrupu, landing page, Azərbaycan, mobil/desktop; paltaryuyan və qabyuyan ayrıca.
- GA4: razılıq verən istifadəçilərin service view, phone/WhatsApp/YouTube/CTA klikləri və real form success hadisələri.
- GA4-dən istifadə etməyən və razılıq verməyən ziyarətçilərin olmamasını trafik itkisi kimi səhv şərh etməyin.
- 28 gün əvvəlki dövrlə və kifayət qədər məlumat olduqda əvvəlki ilin eyni dövrü ilə müqayisə edin. Average position-u “bu gün hamı üçün eyni mövqe” saymayın.

### İş qrafiki

İlk həftə: 200/404/redirect, sitemap, canonical və noindex yoxlaması. İlk ay: indeks statusu, axtarış niyyətinə uyğun kliklər, mobil əlaqə istifadəsi. Sonrakı aylarda: kontent planından bir mövzunu real texniki baxışla hazırlamaq, daxili keçidləri yoxlamaq, meta dəyişikliklərinin nəticəsini qeyd etmək. Bu qrafik avtomatik monitor kimi qurulmayıb.

Tamamlandı: kod, hadisə allowlist-i, consent mexanizmi və qurulum təlimatı. Sahibin işi: hesab/ID/TXT, real biznes təsdiqi, canlı şəbəkə testləri və ölçmənin başlanması.
