# DənizServis — production-a çıxış checklist-i

Tarix: 2026-11-01. Production deploy EDİLMƏYİB. Bu siyahı sayt sahibi/hostinq administratoru üçündür.

## Lokal tamamlanan hissə

- [x] İki xidmətin kontenti HTML-dədir; görünən dizayn qorunub, mobil alt zəng/sifariş paneli geri qaytarılmayıb.
- [x] Sabit canonical origin, səhifəyə uyğun metadata və paylaşım məlumatı.
- [x] Real Haqqımızda, məxfilik və Azərbaycan dilli 404.
- [x] Organization + Service + BreadcrumbList və uyğun səhifə schema-sı; uydurma LocalBusiness ünvanı yoxdur.
- [x] Statik export, robots, sitemap, preview üçün noindex siyasəti və Pages `_headers` faylı.
- [x] İstəyə bağlı, razılıq tələb edən GA4 kodu. Hazırda ID olmadığı üçün aktiv deyil.
- [x] `npm run check:seo` ilə təkrarlana bilən HTML/link/metadata testi.

## Sahibin təsdiqi

- [ ] Telefon və WhatsApp `+994 70 552 20 21` doğrudur və zənglər qəbul olunur.
- [ ] Bakıdan kənar faktiki xidmət imkanları və səfər/diaqnostika haqqı təsdiqlənsin.
- [ ] İş saatları, real hüquqi operator və məlumatların saxlanılma qaydası dəqiqləşdirilsin.
- [ ] Fiziki müştəri qəbulu ünvanı yoxdursa, uydurma ünvan əlavə edilməsin.
- [ ] Video/foto istifadəsinə hüquq və şəxslərin razılığı yoxlanılsın.

## Cloudflare Pages Free qurulumu

1. Təsdiqdən sonra repo-nu şəxsi Git hesabından Pages layihəsinə qoşun. Build command `npm run build:static`, output directory `out` seçin. Eyni komanda lokal istifadə oluna bilər.
2. Production branch `prod`, development/preview branch `dev`-dir. `NEXT_PUBLIC_PRODUCTION_BRANCH=prod` saxlayın. Preview və production environment-lərini ayırın; `dev` preview `noindex` olmalıdır. Tam addımlar `GITHUB_WORKFLOW.md` daxilindədir.
3. Preview üçün `NEXT_PUBLIC_DEPLOYMENT_ENV=preview`. Production üçün ya boş saxlayın (Cloudflare branch yoxlanılır), ya yalnız production environment-də `production` verin. Bu dəyişən canonical domeni dəyişmir.
4. Custom domain-i əvvəl Pages dashboard-da əlavə edin, sonra tələb olunan DNS-i tətbiq edin. DNS dəyişməsi kod faylı yazmaqla baş vermir. `denizservis.az` və lazım olan `www` qeydinin sahibi siz olmalısınız.
5. Sertifikatın aktivləşməsini gözləyin və HTTPS-i yoxlayın. SSL/TLS parametrlərini real origin-ə uyğun təhlükəsiz qaydada qurun; security interstitial-i keçməyin.
6. Default `*.pages.dev` və branch preview-ları `_headers` vasitəsilə noindex olur. Cloudflare-in preview cavab başlığını da canlı yoxlayın. Məxfi preview üçün Cloudflare Access ayrıca qurulur; noindex giriş qoruması deyil.

### Canonical host və HTTPS yönləndirməsi

Pages `_redirects` domen/sxem yönləndirməsi üçün uyğun deyil; production Cloudflare Redirect Rule qurulmalıdır. [Pages redirects məhdudiyyətləri](https://developers.cloudflare.com/pages/configuration/redirects/).

Dashboard → saytın zone-u → Rules → Redirect Rules → Single Redirect:

- Şərt: host `denizservis.az` və ya `www.denizservis.az` olsun VƏ (`www` variantıdır VƏ YA sxem HTTP-dir).
- Dynamic destination: `concat("https://denizservis.az", http.request.uri.path)`.
- Status: 301. “Preserve query string” aktiv.
- Canonical `https://denizservis.az` üzərində qayda işləməməlidir; loop yaratmayın.

Rule expression üçün həmin dashboard-un validatorunu istifadə edin; plan və UI-də mövcud field-ləri orada təsdiqləyin. Biz bu hesabda rule yaratmamışıq. Alternativ olaraq Always Use HTTPS + www→apex qaydası mümkündür, lakin əlavə redirect hop yarana bilər.

### Canlı qəbul testi

```bash
curl -I http://denizservis.az/xidmetler/paltaryuyan-temiri
curl -I http://www.denizservis.az/xidmetler/paltaryuyan-temiri
curl -I https://www.denizservis.az/xidmetler/paltaryuyan-temiri
curl -I https://denizservis.az/xidmetler/paltaryuyan-temiri
curl -I https://denizservis.az/olmayan-sehife
```

İlk üçü 301/308 ilə eyni path-in canonical HTTPS URL-nə, son real səhifə 200-ə, olmayan səhifə 404-ə çatmalıdır. Query string qorunmalı, redirect loop və SPA soft-404 olmamalıdır. Production HTML-də noindex qalmamalıdır; privacy və 404 istisnadır. Sitemap-dəki 5 URL real 200 qaytarmalıdır.

## E-mail forması — vacib məhdudiyyət

Cloudflare Pages statik variantında server API yoxdur. Buna görə forma deaktiv izahı göstərir, zəng/WhatsApp aktivdir. `NEXT_PUBLIC_STATIC_EXPORT` dəyişənini silməklə problemi gizlətməyin. E-mail göndərişi üçün əvvəlki normal server build və həqiqi Resend konfiqurasiyası lazımdır; SEO işi çərçivəsində yeni Worker/backend və ya pullu server əlavə edilməyib.

## Yayımdan əvvəl son yoxlama

- [ ] `npm run lint && npm test && npm run typecheck && npm run build`.
- [ ] `npm run build:static && npm run check:static && npm run check:seo`.
- [ ] Production/preview canonical, robots, sitemap və `_headers` cavablarını canlı yoxlayın.
- [ ] Public staging-də Rich Results Test və Schema Validator; aşkar edilmiş xətələri qeyd edin. Organization/Service/FAQ üçün bütün schema.org növlərinin Google rich result olması gözlənilmir.
- [ ] Real mobil Lighthouse/PageSpeed ölçün; sahə CWV üçün sonradan Search Console/CrUX məlumatı gözləyin. Lokal fayl ölçüsünü Lighthouse balı adlandırmayın.
- [ ] Məxfilik, e-mail davranışı və consent seçimi qəbul edilsin.

Qalan xarici işlər: real domain/SSL/redirect/DNS, validatorlar, Google hesabları, analitika ID-si, canlı şəbəkə performansı. Bunlar lokal kodda tamamlanmış sayılmır.
