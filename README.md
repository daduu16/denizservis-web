# DənizServis

Paltaryuyan və qabyuyan təmiri üçün Azərbaycan dilli, mobile-first Next.js veb-saytı.

## GitHub workflow

Repository: [daduu16/denizservis-web](https://github.com/daduu16/denizservis-web). Default development branch `dev`, production branch `prod`-dur. Bütün dəyişikliklər `dev`-də, production yeniləmələri yalnız `dev` → `prod` Pull Request ilə edilir. GitHub ruleset, CI, secret yoxlaması və Cloudflare production/preview addımları: [GITHUB_WORKFLOW.md](./GITHUB_WORKFLOW.md).

## Texnologiyalar

- Next.js App Router, React, TypeScript (strict)
- Tailwind CSS 4 və layihəyə məxsus responsive CSS
- React Hook Form + Zod (mövcud forma validasiyası)
- FormSubmit AJAX e-poçt inteqrasiyası (server və API token olmadan)
- Vitest vahid testləri

## Lokal quraşdırma

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Sayt standart olaraq `http://localhost:3000` ünvanında açılır.

## Konfiqurasiya

### Rəng sistemi

Brend rəngləri `src/app/globals.css` daxilində `:root` dəyişənləri ilə idarə olunur. `--accent: #57B4D8` Nordic Ice əsas rəngidir; hover, tünd mətn, açıq fon, focus və kölgə tonları bu dəyərdən `color-mix()` ilə hesablanır. Tailwind üçün `bg-accent`, `text-accent-dark`, `bg-accent-soft` kimi utility-lər `@theme inline` ilə eyni dəyişənlərə bağlıdır.

Header və footer istifadəçinin təqdim etdiyi DənizServis `logo5.png` loqosundan (`public/images/denizservis-logo-v5.png`) istifadə edir. Əvvəlki logo faylları ehtiyat nüsxələrdir.

WhatsApp üçün ayrıca `--whatsapp: #25D366` dəyişəni saxlanılır. Açıq mavi CTA-lar və yazılı WhatsApp düyməsi oxunaqlılıq üçün `--primary: #0B2851` mətnindən istifadə edir.

`.env.example` faylını `.env.local` adı ilə kopyalayın və real dəyərləri daxil edin:

- Canonical ünvan `src/config/seo.ts` daxilində sabit `https://denizservis.az`-dır; preview üçün `NEXT_PUBLIC_DEPLOYMENT_ENV=preview` istifadə edin.
- `NEXT_PUBLIC_BUSINESS_PHONE` — biznes telefonunu dəyişmək üçün istəyə görə override.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp nömrəsini dəyişmək üçün istəyə görə override.
- `NEXT_PUBLIC_SERVICE_AREA` — real xidmət zonası.
- `NEXT_PUBLIC_WORKING_HOURS` — real iş saatları.

Forma birbaşa `https://formsubmit.co/ajax/info@denizservis.az` ünvanına göndərir; e-poçt üçün env, API token, SMTP və ya Pages Function lazım deyil. İlk göndərişin aktivasiya məktubunu mövcud poçt qutusunda təsdiqləyin. Təlimat: [EMAIL_INTEGRATION.md](EMAIL_INTEGRATION.md).

İstifadəçinin təqdim etdiyi SEO mətninə əsaslanan standart məlumatlar: DənizServis, `https://denizservis.az`, telefon/WhatsApp `+994 70 552 20 21`, Bakı. Nömrə görünüşü `src/config/contact.ts` daxilində mərkəzləşdirilir. İş saatı və dəqiq ünvan verilməyib; uydurulmur.

## Qabyuyan SEO səhifəsi

`src/components/DishwasherServicePage.tsx` yalnız qabyuyan route-da istifadə olunur. Redaktə olunmuş mətn `src/data/dishwasher.ts` daxilindədir: yeddi problem və anchor keçidləri, plata təmiri, modeldən asılı xəta kodları, qiymət/şərtlər, qulluq və ərazi qeydləri, altı FAQ. Köhnə üç kartlı “Nasazlıqdan həllə doğru” bölməsi bu səhifədə yoxdur. Mövcud `Works`, forma, WhatsApp və iki sətirli brend marquee komponentləri təkrar istifadə olunur.

Metadata API ilə unikal absolute title, description, canonical, Open Graph və Twitter metadata verilir. `src/lib/dishwasher-seo.ts` eyni HTML kontenti əsasında Organization, Service, WebPage, BreadcrumbList və FAQPage JSON-LD yaradır; HTML delimiterləri escape olunur. Ünvan, geo koordinat, iş saatı, qiymət, zəmanət müddəti, təcrübə, reytinq və rəylər uydurulmur. Fiziki ünvan təsdiqlənmədiyindən LocalBusiness əvəzinə Organization verilir. FAQ semantik HTML-dədir və JS olmadan oxunur; Google-un FAQ rich-result funksiyası 2026-cı ildə dayandırılıb.

Xəta kodları istehsalçıların rəsmi sənədləri ilə yoxlanılıb, model/təlimat qeydi saxlanılıb:

- [Bosch](https://www.bosch-home.co.uk/customer-service/get-support/dishwashers)
- [Siemens](https://www.siemens-home.bsh-group.com/ie/customer-service/support/troubleshooting/problems/dishcare/dishcare-error-codes)
- [Samsung](https://www.samsung.com/uk/support/home-appliances/displayed-information-codes-on-my-dishwasher/)
- [Electrolux](https://support.electrolux.co.uk/support-articles/article/electrolux-dishwasher-displays-an-error-code-causes-and-solutions)
- [Google LocalBusiness qaydaları](https://developers.google.com/search/docs/appearance/structured-data/local-business)

Saytın yayımlanması, Search Console qeydiyyatı, Business Profile təsdiqi və indekslənməsi bu lokal dəyişikliklə avtomatik edilmir. Sitemap ünvanı `https://denizservis.az/sitemap.xml`-dir.

## Paltaryuyan SEO səhifəsi

`src/components/WashingMachineServicePage.tsx` qabyuyan səhifəsinin son dizaynını və eyni CSS modulunu təkrar istifadə edir; qabyuyan səhifəsinin görünüşü dəyişmir. İstifadəçinin təqdim etdiyi mətn `src/data/washing-machine.ts` daxilində redaktə olunub: on nasazlıq kartı və uyğun izah keçidləri, plata, Samsung/LG/Bosch-Siemens xəta kodları, beş mərhələ, qiymət və şərtlər, səkkiz qulluq məsləhəti, ərazi qeydləri və yeddi FAQ. Mövcud 12 orijinal brend loqosu iki hərəkətli sətirdədir; Candy, Haier, Zanussi, Atlant və Arçelik mətndə saxlanılır. Olmayan məqalələrə saxta keçidlər yaradılmır.

`src/lib/washing-machine-seo.ts` unikal metadata, canonical, appliance-specific OG/Twitter şəkli və Organization/Service/WebPage/BreadcrumbList/FAQPage JSON-LD verir. HTML-də bir H1 var; görünən başlıqda “Bakıda” və uzun tire yoxdur. FAQ altında “Pulsuz məsləhət al” mövcud WhatsApp nömrəsinə yönləndirir. Uydurma qiymət, ünvan, iş saatı, zəmanət müddəti və reytinq yoxdur; ətraf ərazilər üzrə xidmət imkanı əvvəlcədən dəqiqləşdirilir.

Kod mənaları modeldən asılıdır. Baxım üçün rəsmi mənbələr `washingMachineCodeSources` daxilində saxlanılır, saytda mənbələr accordion-u göstərilmir:

- [Samsung — washing machine error codes](https://www.samsung.com/us/support/troubleshoot/TSG10000997/)
- [LG — front-loader error messages](https://www.lg.com/za/support/product-support/troubleshoot/help-library/cs-CT52008881-20153476964934/)
- [Bosch — washer error codes](https://www.bosch-home.com/us/en/c/spotlight/blt341dacb48f00c362/owner-support/error-codes/washers)
- [Bosch — model-specific F21 manual](https://media3.bosch-home.com/Documents/9000867147_A.pdf)

## Cloudflare Pages üçün statik build

Tam sayt SEO auditi və qəbul qaydaları: `SEO_AUDIT.md`, `SEO_IMPLEMENTATION.md`, `SEO_KEYWORDS.md`, `SEO_CONTENT_PLAN.md`, `SEO_LAUNCH_CHECKLIST.md`, `SEO_POST_LAUNCH.md`, `SEO_TEST_RESULTS.md`. `npm run check:seo` bütün real HTML səhifələrini və daxili linkləri yoxlayır. Canonical domen `src/config/seo.ts` daxilində sabitdir. Preview üçün `NEXT_PUBLIC_DEPLOYMENT_ENV=preview`; optional GA4 üçün `NEXT_PUBLIC_GA_ID` və ayrıca istifadəçi razılığı lazımdır. Production deploy edilməyib.

Lighthouse SEO ölçməsi: `npm run build:static && npm run audit:lighthouse:seo`. Skript production export-u mobil/desktop rejimində yoxlayır, lazım olsa yalnız öz lokal preview serverini başladıb sonda dayandırır. Mövcud server varsa onu saxlayır. 5 əsas səhifənin 10 yoxlaması SEO 100/100 alıb; development-də qəsdən `noindex` olduğu üçün 69 görmək normaldır. Hesabatlar `qa/lighthouse-seo/` daxilindədir. Bu, Performance və ya Google sıralama balı deyil.

```bash
npm run build:static
npm run check:static
npm run preview:static
```

Cloudflare Pages build command: `npm run build` (`npm run build:static` də uyğundur); publish directory: `out`. Framework preset-in standart `npx next build` əmrini dəyişin: o, bu layihədə hazırlıq skriptini işə salmır. Preview `http://localhost:3001` ünvanındadır. Bu işdə deployment edilməyib.

`npm run build` statik build-i başladır: təzə müvəqqəti qovluqda frontend-i və responsive şəkilləri hazırlayır, `next.config.ts` daxilində `output: "export"` rejimi ilə HTML yaradır. Köhnə Cloudflare e-poçt API-si çıxarılıb; forma serverdən asılı deyil. Müvəqqəti build qovluğu sonda silinir; əvvəlki, alət tərəfindən işarələnmiş `out` varsa recoverable `out.previous-*` qovluğuna keçirilir. İstifadəçiyə məxsus naməlum `out` üzərinə yazılmır.

**Statik frontend mövcud formadan FormSubmit AJAX API-yə POST edir.** Uğur yalnız həm HTTP statusu, həm də provider-in açıq `success` cavabı müsbət olduqda göstərilir. İlk aktivasiya ayrıca poçt təsdiqi tələb edir. `NEXT_PUBLIC_STATIC_EXPORT` şəkillər/build üçün qalır, formanı söndürmür. Zəng və WhatsApp dəyişməyib.

Statik şəkillər server optimizer-dən asılı deyil: Sharp əvvəlcədən responsive WebP variantları hazırlayır, custom image loader onların `srcset`-ini yaradır. SVG və artıq optimallaşdırılmış brend WebP-ləri olduğu kimi qalır. `check:static` HTML/FAQ, canonical, JSON-LD, e-mail formasının vəziyyəti, şəkil faylları, sitemap və robots-u yoxlayır. Core Web Vitals/Lighthouse skoruna və real şəbəkə nəticəsinə zəmanət verilmir.

## Xidmət səhifələri

Paltaryuyan və qabyuyan xidmət səhifələri ortaq `ServiceHero` komponentindən istifadə edir: çərçivəsiz, mask/gradient overlay şəkil, sifariş/zəng və inline WhatsApp düyməsi. Köhnə breadcrumb və “ServisPlus xidməti” etiketi göstərilmir. Hər iki səhifədə formadan sonra ana səhifədəki eyni `Works` playlist qalereyası var. Bu xidmət səhifələrində menyu, footer və CTA-ların “İşlərimiz” / sifariş keçidləri səhifənin öz bölməsinə aparır; digər səhifələrin keçidləri dəyişmir.

## Brend loqoları

Ana səhifədə “İşlərimiz”dən dərhal sonra “Biz təmir edirik” bölməsi yerləşir. `src/data/brands.ts` faylındakı 19 brend iki sətirdə göstərilir. `BrandMarquee` server komponentidir: əlavə client JavaScript, carousel paketi və ya interval yoxdur. Bütün loqolar optimallaşdırılmış şəffaf WebP kimi lokaldır; mənbələr `public/images/brands/SOURCES.md` faylındadır.

CSS animasiyaları 40 və 42 saniyəlik linear dövrlərlə əks istiqamətlərə axır. Hər qrup son boşluğu ilə birlikdə eyni enli nüsxəyə malikdir; `translateX(-50%)` dövrün sonunda fasiləsiz keçid verir. Dublikatlar screen reader-dən gizlənir. Desktopda hover və hər iki görünüşdə klaviatura fokusu animasiyanı saxlayır; ayrıca dayandırma idarəsi göstərilmir. `prefers-reduced-motion: reduce` zamanı hərəkət və dublikatlar söndürülür; hər iki sətir öz daxilində manual sürüşdürülə bilir, səhifə üfüqi daşmır.

## Mobil menyu və zəng keçidləri

Mobil menyu səhifə aşağı sürüşdürüləndə açıldıqda fonu iOS-a uyğun fixed-body kilidi ilə saxlayır; bağlananda əvvəlki scroll mövqeyi və inline style-lar bərpa olunur. Menyu bağlananda dil dropdown-u unmount olunur və növbəti açılışda bağlı başlayır. Touch blur-un `relatedTarget=null` vəziyyəti seçim klikindən əvvəl dropdown-u bağlamır; avtomatik fokus yalnız desktop/klaviatura açılışında istifadə olunur.

Zəng düymələri yalnız istifadəçinin klik etdiyi standart `tel:+994705522021` keçidləridir; avtomatik yönləndirmə, timer və proqramla çağırış yoxdur. `format-detection: telephone=no` iOS-un mətndən əlavə telefon keçidləri yaratmasının qarşısını alır, açıq `tel:` linklərini söndürmür. iOS/Safari-nin zəng təsdiqi və blok xəbərdarlığı sistem idarəsidir; sayt bu təhlükəsizlik icazəsini ləğv edə bilməz. [Apple telefon linkləri sənədi](https://developer.apple.com/library/archive/featuredarticles/iPhoneURLScheme_Reference/PhoneLinks/PhoneLinks.html).

## “İşlərimiz” video qalereyası

Header, mobil menyu və footer eyni mərkəzi menyudan istifadə edir: `Əsas səhifə → Xidmətlər → İşlərimiz → Niyə biz? → Əlaqə`. `İşlərimiz` linki `/#islerimiz` bölməsinə aparır. Əvvəlki “Necə işləyir?” bölməsi ana səhifədə bu qalereya ilə əvəz olunub.

“İşlərimiz” bölməsi YouTube-un rəsmi iframe pleyerlərini ayrı kartlarda göstərir. Playlist: `https://www.youtube.com/playlist?list=PLP-tan1dbfMQ` — **Gördüyümüz İşlər | DənizServis**. Mərkəzi parametrlər `src/config/youtube.ts` faylındadır; `previewLimit: 4` ilk göstərilən kartların sayıdır.

YouTube Data API v3, API açarı, Cloudflare Worker, scraping, ayrıca backend və video fayllarının saytda saxlanması istifadə olunmur. Brauzerdə YouTube-un rəsmi **IFrame Player** kitabxanasının [`getPlaylist()`](https://developers.google.com/youtube/iframe_api_reference#Retrieving_playlist_information) funksiyası video ID-lərini oxuyur. Yeni videonu yalnız YouTube-da bu playlistə əlavə etmək kifayətdir; sayt kodunu dəyişmək və hər video üçün yenidən deploy etmək lazım deyil. Açıq brauzerdə playlistin yeni vəziyyətini görmək üçün səhifəni yeniləmək lazım gələ bilər. `src/data/work-videos.ts` əl ilə siyahısı və `WorkVideoCard` komponenti ehtiyat olaraq saxlanılıb, aktiv playlist onları istifadə etmir.

Desktopda 4, planşetdə 2, telefonda 1 sütunlu 4:5 kartlar göstərilir. Kartların real başlıq, önizləmə və Shorts işarələrini native YouTube iframe-i göstərir. Uydurma başlıqlar və təkrar videolar əlavə edilmir. YouTube-un 100, 101 və 150 xəta kodları ilə əlçatmaz bildirdiyi kartlar çıxarılıb növbəti video ilə tamamlanır; qlobal şəbəkə və 153 kimlik xətaları səhvən bütün videoları silmir. Eyni anda yalnız bir video oynayır.

Sıralama playlist sahibinin YouTube-da seçdiyi sıradır: ən yeni əlavə olunanlar öndə görünsün deyə playlistin sırasını YouTube-da **əlavə edilmə tarixi: ən yeni əvvəl** seçin. “Daha çox göstər” həmişə həmin playlisti YouTube-da yeni pəncərədə açır.

Mövcud bölmə fonu, başlıq, kartın radiusu və kölgəsi saxlanılıb. Pleyerlər bölmə ekrana yaxınlaşanda yüklənir, avtomatik oynatma söndürülüb, inline/fullscreen və klaviatura idarəsi YouTube tərəfindən verilir. IFrame kitabxanası bloklanarsa native playlist iframe-i və YouTube keçidi ehtiyat variant kimi qalır.

## Komandalar

```bash
npm run dev       # development server
npm run typecheck # TypeScript yoxlaması
npm run lint      # ESLint
npm test          # validasiya testləri
npm run build        # Cloudflare static export -> out/
npm run build:server # optional normal Next build (email needs no server)
npm start            # run after build:server (not after static export)
```

## Səhifələr

- `/` — ana səhifə
- `/xidmetler/paltaryuyan-temiri` — paltaryuyan təmiri
- `/xidmetler/qabyuyan-temiri` — qabyuyan təmiri
- `/elaqe` — əlaqə və sifariş forması
- `/mexfilik` — forma məlumatlarının işlənməsi haqqında qeyd
- `/sitemap.xml` və `/robots.txt` — SEO endpoint-ləri

## Forma və təhlükəsizlik

Mövcud formanın FormSubmit bağlantısı və ilk aktivasiya: [EMAIL_INTEGRATION.md](EMAIL_INTEGRATION.md). Yeni forma, database, server və pullu xidmət əlavə edilməyib.

- Telefon sərbəst yazı formatında qəbul edilir; boş dəyər və həddən artıq uzun mətn qəbul edilmir.
- Mövcud Zod validasiyası, razılıq və gizli honeypot sahəsi dəyişməyib.
- FormSubmit-in spam qorunması söndürülmür; `_captcha=false` göndərilmir və honeypot `_honey` kimi ötürülür.
- Bütün forma məlumatları FormSubmit-ə ötürülür; bu, istifadəçinin seçdiyi üçüncü tərəf form xidmətidir.
- API token və server secret tələb olunmur. Köhnə Cloudflare sirrləri artıq kodda istifadə edilmir.

## Manual QA ssenariləri

1. 320, 360, 375, 390, 430, 768, 1024 və 1440 px enlərdə ana səhifəni açın.
2. `document.documentElement.scrollWidth <= window.innerWidth + 1` nəticəsini yoxlayın.
3. Mobil menyunu açın, `Escape` ilə bağlayın və bütün linkləri klaviatura ilə gəzin.
4. `Usta sifariş et` düyməsinin forma hissəsinə apardığını yoxlayın.
5. Boş ad, boş telefon və seçilməmiş razılıqla submit edərək xəta mətnlərini yoxlayın. Telefon formatı sərbəstdir; məcburi sahə və təhlükəsizlik uzunluğu yoxlaması qalır.
6. FormSubmit-in HTTP və ya JSON `success=false` cavabında xəta göstərildiyini, dəyərlərin saxlandığını yoxlayın.
7. İlk aktivasiya məktubunu təsdiqlədikdən sonra `dev` preview-dən real e-mail çatdırılmasını ayrıca yoxlayın.
8. Header və mobil menyuda “İşlərimiz” və “Niyə biz?” keçidlərini təkrar basın: düzgün bölməyə sürüşmə, menyunun bağlanması və aktiv linkin vurğulanmasını yoxlayın.
9. “İşlərimiz” bölməsində playlist iframe-ini, YouTube-un video seçimini və fullscreen düyməsini yoxlayın. “Daha çox göstər” düzgün playlisti açmalıdır; mobil pleyer viewport enini keçməməlidir. Yeni video YouTube playlistinə əlavə edildikdən sonra səhifəni yeniləyərək yoxlayın.

## İcra edilmiş QA nəticələri

28 oktyabr 2026 tarixində lokal brauzer və production build ilə:

- 320, 360, 375, 390, 414, 430, 768, 1024, 1280 və 1440 px enlərdə `scrollWidth` viewport enini keçmədi.
- Mobil header elementləri viewport daxilində qaldı; 320 px-də üst-üstə düşmə aşkarlanmadı.
- 768 px-ə qədər mobil menyu, 1024 px-dən etibarən desktop naviqasiya göstərildi.
- Mobil menyunun açılması və `Escape` ilə bağlanması test edildi.
- Ana səhifə, hər iki xidmət səhifəsi, əlaqə və məxfilik səhifəsi 390 və 1440 px-də yoxlanıldı: hər səhifədə bir `h1`, qırıq şəkil yox, horizontal overflow yox.
- Boş/yanlış forma üçün client validation xətaları göründü.
- Düzgün forma məlumatı, Resend konfiqurasiyası olmadan `503` və real xəta mesajı qaytardı; saxta uğur göstərilmədi.
- Bütün əsas route-lar, `sitemap.xml` və `robots.txt` lokal serverdə `200` qaytardı.
- Brauzer konsolunda xəta və xəbərdarlıq aşkarlanmadı.

## Lokal AI axtarış araşdırması (yalnız dev)

Xərcsiz, şəbəkə sorğusuz JSON importu, 100 suallıq plan, Excel üçün CSV və redaksiya blog planı: [RESEARCH_WORKFLOW.md](RESEARCH_WORKFLOW.md). `npm run research:demo` ilə sintetik nümunəni yoxlamaq olar. Şəxsi giriş və hesabatlar `research-local/` daxilində Git-dən kənarda qalır; sayt və production dəyişmir.

## Production TODO

- Real telefon, WhatsApp, xidmət zonası və iş saatlarını `.env.local`/hosting secrets-də əlavə edin.
- FormSubmit-in aktivasiya məktubunu təsdiqləyin və `dev`-dən real göndərişi yoxlayın; production-a ayrıca razılıq olmadan keçməyin.
- Real biznes məlumatları təsdiqlənəndən sonra LocalBusiness JSON-LD əlavə etmək olar.
