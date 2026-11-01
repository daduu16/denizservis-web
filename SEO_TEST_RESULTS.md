# DənizServis — SEO test nəticələri

Tarix: 2026-11-01. Testlər lokaldır; production deploy və xarici hesablarda dəyişiklik yoxdur.

## Komanda nəticələri

| Yoxlama | Nəticə |
| --- | --- |
| `npm run lint` | Uğurlu |
| `npm test` | Nömrə formatı yenilənməsindən sonra 14 test faylı, 81 test uğurlu |
| `npm run typecheck` | Uğurlu |
| `npm run build` | Uğurlu; əsas səhifələr prerender olunur, mövcud e-mail API yalnız normal server build-dədir |
| `npm run build:static` | Uğurlu; Pages-compatible HTML/CSS/JS, server API yoxdur |
| `npm run check:static` | Hər iki xidmətin HTML, FAQ, JSON-LD, şəkil srcset-i, disabled e-mail forması və WhatsApp-only sabit düyməsi keçdi |
| `SEO_TEST_BASE_URL=http://127.0.0.1:3001 npm run check:seo` | 6 səhifə, 170 daxili keçid/anchor, 137 img elementi; metadata/schema/robots/sitemap/404/preview headers keçdi |
| `npm run audit:lighthouse:seo` | Lighthouse 13.6.0: 5 əsas səhifə × mobil/desktop = 10 yoxlamanın hamısında SEO 100/100 |
| `NEXT_PUBLIC_DEPLOYMENT_ENV=preview npm run build:static` + `SEO_EXPECT_INDEXABLE=false ... npm run check:seo` | Ayrı preview build uğurlu: bütün səhifələr noindex, sitemap-də URL yoxdur, canonical production domenidir |

Preview testindən sonra production statik export yenidən hazırlanıb. Təhvil verilən `out/` production üçün indexable variantdır (privacy/404 noindex istisna). Preview nəticəsi ayrıca JSON-da saxlanılır.

## Texniki qəbul

- Ana səhifə, iki xidmət, əlaqə və Haqqımızda: real HTML, bir H1, unikal title/description, production canonical, OG URL/title/az_AZ və Twitter card.
- Məxfilik: unikal metadata, öz canonical-ı, qəsdən noindex/follow; sitemap-ə daxil deyil.
- Sitemap-də yalnız 5 real indexable canonical URL var. Lastmod avtomatik hər build-də dəyişdirilmir; xidmət məzmununun real tarixindən götürülür.
- Organization contactPoint və Service provider ID-ləri yoxlanıldı; LocalBusiness/Review/AggregateRating/VideoObject uydurulmayıb. FAQ HTML ilə schema mətnləri uyğundur.
- Script-lər çıxarılmış HTML üzərində daxili keçidlər, anchor hədəfləri, duplicate ID olmaması və img alt/geometry yoxlandı.
- Statik e-mail formaları disabled və izahlıdır; səhv halda saxta uğur göstərilmir. Heç bir test real müştəri müraciəti göndərməyib.
- Google tag ID verilmədiyindən script yüklənmir; analitika payload allowlist və query/hash/PII çıxarılması unit testlərlə yoxlanılıb.

### HTTP statusları — lokal statik server

`/`, `/elaqe`, `/haqqimizda`, `/mexfilik`, hər iki xidmət, `/sitemap.xml`, `/robots.txt`: 200. `/seo-test-missing-page`: 404. Normal localhost:3000 serverində də olmayan route 404 və Azərbaycan dilində mətn qaytardı. Bu test real Cloudflare redirect/response headers yoxlamasını əvəz etmir.

## Brauzer və responsive

- 6 səhifə × 8 ölçü = 48 kombinasiya: 320, 360, 375, 390, 430, 768, 1024, 1440px. Horizontal overflow yoxdur, bir H1 var, floating WhatsApp var, köhnə alt zəng/sifariş paneli yoxdur, GA tag yüklənməyib.
- Mobil menyu: Tab ilk linkə çatır, son linkdən Tab düyməyə qaytarır; Escape menyunu bağlayır və focus açma düyməsinə qayıdır.
- Əvvəlki xidmət yoxlamalarındakı 10/7 nasazlıq anchor-u yeni tam link checker-də də keçdi. Native FAQ və mövcud cihaz seçimi saxlanılıb.
- Ana səhifənin ilk ekranında YouTube iframe yoxdur. İşlərimiz bölməsinə keçəndə rəsmi playlist iframe-i yükləndi; “Daha çox göstər” həmin YouTube playlistinə aparır. Bu, bütün videoların tarix/əlçatanlıq metadata-sının ayrıca audit edildiyi anlamına gəlmir.
- Vizual sübutlar: `qa/denizservis-seo-about-desktop.jpg`, `qa/denizservis-seo-home-mobile.jpg`. Mövcud hero/overlay/rənglər və WhatsApp-only mobil sabit düymə qorunub.

## Ölçülmüş performans məlumatları

### Lighthouse SEO — ayrıca real ölçmə

Lighthouse 13.6.0 ilə lokal production statik export yoxlanıldı. Heç bir SEO audit-i söndürülmədi və bal dəyişdirilmədi; yalnız `seo` kateqoriyası seçildi. Bu nəticə Performance/Accessibility/Best Practices kateqoriyalarında 100 demək deyil.

| Səhifə | Mobil SEO | Desktop SEO |
| --- | ---: | ---: |
| `/` | 100 | 100 |
| `/xidmetler/paltaryuyan-temiri` | 100 | 100 |
| `/xidmetler/qabyuyan-temiri` | 100 | 100 |
| `/elaqe` | 100 | 100 |
| `/haqqimizda` | 100 | 100 |

İstifadəçinin gördüyü 69 bal localhost:3000 development versiyasında eynilə təkrarlandı. Yeganə uğursuz maddə `is-crawlable` idi: `<meta name="robots" content="noindex, follow">`. Eyni ana səhifənin production export-u localhost:3001-də 100 aldı. Dev/preview qoruması, production canonical və privacy/404 noindex siyasəti bal xətrinə dəyişdirilmədi.

Xam sübut: `qa/lighthouse-home-development.report.json`, `qa/lighthouse-home-production-local.report.json`, `qa/lighthouse-seo/summary.json` və eyni qovluqdakı 10 HTML/JSON hesabat. Təkrar yoxlama üçün `npm run build:static && npm run audit:lighthouse:seo`; Chrome və Node 22+ tələb olunur. Lighthouse npm cache-də istifadə olunur, saytın runtime dependency-si deyil. Production-a deploy edilməyib və bu nəticə canlı domen ölçməsi deyil.

Statik HTML-də istinad edilən lokal JS fayllarının cəmidir; real network transfer, Brotli, runtime CPU və Lighthouse balı deyil:

| Səhifə | Raw JS bayt | Faylların ayrı gzip cəmi |
| --- | ---: | ---: |
| Ana səhifə | 750141 | 234587 |
| Paltaryuyan | 752050 | 235191 |
| Qabyuyan | 752050 | 235191 |
| Əlaqə | 750367 | 234762 |
| Haqqımızda | 753350 | 236093 |
| Məxfilik | 750141 | 234587 |

İlkin ana səhifə 735190 raw / 229185 gzip idi. Yeni metadata/məxfilik/ölçmə dəstəyi və mərkəzləşdirilmiş nömrə formatı ilə gzip cəmi 5402 bayt artıb; bunu performans yaxşılaşması kimi təqdim etmirik. Consent-in ağır hissəsi ayrıca lazy chunk-dadır və ID olmayanda Google-a sorğu yoxdur.

Telefon görünüşü sayt üzrə `+994 70 552 20 21` formasına keçirilib. Nömrə mənbəyi və köhnə environment dəyərlərinin formatlanması `src/config/contact.ts` daxilindədir. Zəng `tel:+994705522021`, WhatsApp `https://wa.me/994705522021` olaraq qalır. Altı səhifə × beş ekran ölçüsündə 30 əlavə yoxlamada köhnə görünən nömrə, horizontal overflow və hero telefon mətnində daşma tapılmadı.

Responsive raster variantları 160-dan 64-ə düşüb (10 deyil, 4 istifadə olunan şəkil). Export disk həcmi təxminən 15MiB-dir; istifadəçinin köhnə/orijinal rasterləri silinməyib. Məsələn: hero 750px WebP 42502 bayt, 1920px 110308; paltaryuyan 384px 12466, qabyuyan 384px 19548, logo 384px 4248 bayt. Bunlar faktiki fayl ölçüləridir.

## Ölçülməyən və sahibə qalan qəbul maddələri

- Lighthouse SEO ölçülüb və yuxarıda faktiki nəticələr göstərilib. Lighthouse Performance/Accessibility/Best Practices və canlı PageSpeed score ölçülməyib; həmin kateqoriyalar üçün 100 bal iddiası yoxdur.
- Field LCP/INP/CLS və 75-ci persentil üçün real trafik/CrUX məlumatı yoxdur. Hədəflər müvafiq olaraq ≤2.5s, ≤200ms, ≤0.1-dir; nəticə olaraq təqdim edilmir. [Web Vitals](https://web.dev/articles/vitals).
- Rich Results Test və Schema Validator-a real staging URL/kod təqdim edilməyib. Lokal JSON sintaksisi, node əlaqələri və HTML uyğunluğu keçib, ancaq bu xarici validator sertifikatı deyil. Public staging və ayrıca xarici yoxlama addımı launch checklist-dədir.
- Canlı DNS, HTTPS, www/http permanent redirect, Cloudflare-in həqiqi response header-i və indekslənmə yoxlanmayıb.
- GA4 real ID / DebugView, razılıq ver–rədd et–geri götür şəbəkə qəbul testi və GSC/Business Profile qurulumu hesab sahibi tərəfindən edilməlidir.
- Real müştəri rəyi, saat, fiziki ünvan, əlavə ərazi təsdiqi və hüquqi privacy baxışı verilməyib.

## Reproduksiya və xam nəticələr

```bash
npm run lint && npm test && npm run typecheck && npm run build
npm run build:static && npm run check:static
npm run preview:static
# Başqa terminalda:
SEO_TEST_BASE_URL=http://127.0.0.1:3001 npm run check:seo
```

`qa/seo-validation.json` production export nəticəsidir; `qa/seo-validation-preview.json` preview nəticəsidir. `npm run check:seo` HTTP dəyişəni olmadan da export fayllarını yoxlayır. Preview build-i lokal təkrarlasanız, sonda production build-i yenidən yaradın. Son Lighthouse yoxlamasından sonra localhost:3001 production preview istifadəçinin testi üçün açıq saxlanılıb; əsas localhost:3000 development serveri də işləyir. Lighthouse-da production nəticəsini görmək üçün 3001-i yoxlayın.

Yekun: lokal P0 bloklayıcı tapılmadı; texniki qəbul testləri keçdi. Xarici hesab/hosting/field ölçmə maddələri tamamlanmış kimi göstərilmir.

## Header və dil seçimi — 2026-11-01

- Header-də sifariş CTA-sı çıxarılıb; sağda əsas rəngli `+994 70 552 20 21` zəng keçidi və onun əvvəlində Azərbaycan / Русский / English menyusu yerləşdirilib. Mobil menyudakı sifariş CTA-sı da telefonla əvəz olunub; səhifələrin daxilindəki sifariş düymələri saxlanılıb.
- React context və ayrıca lazy-loaded EN/RU lüğətləri ilə bütün mövcud səhifələrin görünən mətnləri, forma placeholder/validation mesajları, FAQ, şəkil alt mətnləri və əlaqə etiketləri dəyişir. Seçim localStorage-da saxlanır; storage bağlı olduqda cari sessiyada işləyir. Dil dəyişəndə forma dəyərləri itmir. Menyu klaviatura, Escape, fokusun qaytarılması və kənara kliklə işləyir.
- Bu, eyni URL-də istifadəçi tərəfindən seçilən interfeys dilidir. Server HTML-i, metadata, canonical və sitemap Azərbaycan dilində qalır; ayrıca indekslənən `/ru` və `/en` səhifələri yaradılmayıb. Rus/ingilis dilli SEO indeksi və ya Google sıralaması barədə iddia edilmir.
- `lint`, `typecheck`, normal Next build və Cloudflare statik build keçdi. 16 test faylı / 89 test keçdi; iki lüğətin uyğunluğu, service kontenti, məcburi mesajlar və header CTA dəyişməsi ayrıca testlərlə əhatə olunur.
- Statik preview-də altı səhifə × üç dil × yeddi ekran ölçüsü (320, 360, 390, 768, 1024, 1280, 1440 px): 126 yoxlama. Panel toqquşması, horizontal page overflow və EN/RU görünən kontentində tərcüməsiz mətn tapılmadı (brend adları dəyişmir). 320 px-də açılan menyunun yerləşməsi ayrıca yoxlanıldı.
- Development formunda boş göndərmə yalnız lokal validation yaratdı; xəta mesajları EN/RU dəyişdi, cihaz seçimi dil dəyişəndə qorundu. Real e-mail göndərilmədi. Statik form əvvəlki kimi qeyri-aktivdir; zəng və WhatsApp işlək keçidlərdir.
- Yenilənmiş export üzrə Lighthouse SEO: beş əsas səhifə × mobil/desktop = 10/10 ölçmədə 100. Bu bal digər Lighthouse kateqoriyalarına və ya ayrıca EN/RU axtarış görünürlüğünə aid deyil. Hesabatlar `qa/lighthouse-seo/` daxilindədir.

### Son UI düzəlişləri — 2026-11-01, 04:10 tapşırığı

- Dil ikonunda qitə şəkilli işarə sadə enlik/uzunluq xətli globe ilə əvəzləndi. 1200px və yuxarıda selector və dropdown eyni 174px endədir. 1024px-dən aşağı dil seçimi header-dən çıxarılıb hamburger menyusuna keçirildi; açılan seçimlər menyunun daxilində qalır və alçaq ekranlarda panel scroll olunur.
- Ana hero-dakı üç ikonlu üstünlük sırası çıxarıldı. Sahibin təsdiqlədiyi bütün Bakı rayonları, Sumqayıt, Xırdalan, Masazır və Abşeron mətnləri home FAQ-ya və EN/RU lüğətlərinə əlavə edildi. FAQ girişinin altına WhatsApp-la pulsuz məsləhət keçidi yerləşdirildi. İki xidmət səhifəsinin forma kicker-i və əlavə izahı çıxarıldı, əsas forma başlığı saxlanıldı.
- Telefon üçün Azərbaycan prefiksi/uzunluq/separator formatı yoxlaması həm client, həm API sxemindən çıxarıldı. İstifadəçinin formatı qorunur; yalnız boş sahə və 80 simvol təhlükəsizlik həddi yoxlanılır. Digər məcburi məlumatlar, razılıq və spam qoruması qalır.
- Xəta mesajlı grid sahələrinin qonşu inputları dartması `align-content: start` ilə düzəldi. Dörd müraciət formasında ad-only ssenarisində ad/telefon inputlarının yuxarı koordinatları və hündürlükləri eyni oldu. Köhnə server mesajı redaktə və yeni invalid submit zamanı təmizlənir. Xəta mətnləri label-dən ayrılıb `aria-describedby` ilə bağlandı.
- 18 test faylı / 106 test, lint, typecheck, normal build, statik build və hər iki statik/SEO yoxlaması keçdi. API testində e-mail provayderi mock edildi: sərbəst nömrə serverdə qəbul edilir, ad-only sorğu 422 alır, konfiqurasiya yoxdursa saxta uğur əvəzinə 503 qalır. Real e-mail göndərilmədi.
- Yenilənmiş statik preview: altı səhifə × üç dil × altı ölçü (320, 390, 768, 1024, 1280, 1440px) = 108 responsive yoxlama; üfüqi daşma və header toqquşması yoxdur. Mobil dil seçimi və desktop eyni-en dropdown ayrıca brauzerdə yoxlandı.
- E-mail çatdırılması bu UI tapşırığı ilə aktivləşdirilməyib; mövcud statik export formaları qeyri-aktiv və izahlıdır. Real göndəriş üçün normal serverdə e-mail servisi və ya ayrıca razılaşdırılmış göndəriş kanalı qurulmalıdır. Əvvəlki Lighthouse hesabatı bu son UI build-i üçün təkrar ölçmə kimi təqdim edilmir; metadata/HTML/schema yoxlaması yenidən keçib.
