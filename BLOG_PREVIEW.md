# Bloq — dərc və indeksasiya

## Hazır olanlar

- `/blog`: önə çıxan məqalə, mövzu filtrləri, kliklənən məqalə kartları və WhatsApp keçidi. Siyahının altında hər səhifədə 3 məqalə göstərən sadə, mərkəzlənmiş oxlar və səhifə nömrələri var; əlavə panel, mətn və irəliləyiş xətti çıxarılıb. Filtr dəyişdikdə səhifə 1-ə sıfırlanır; tək səhifəlik kateqoriyada naviqasiya gizlənir. Keçidlər klaviatura, ekran oxuyucusu və reduced-motion seçimi üçün uyğunlaşdırılıb; pagination yalnız bloq siyahısına tətbiq olunur.
- Səkkiz statik məqalə: qabyuyan xəta kodları və su boşaltma bələdçisi ön plandadır; əvvəlki məqalələr saxlanılıb.
- 12 noyabr əlavələri: `/blog/qabyuyan-qablari-yaxsi-yumur`, `/blog/paltaryuyan-sixmada-titreyir`, `/blog/paltaryuyandan-pis-qoxu-gelir`. Hərəsi üçün ayrıca optimallaşdırılmış redaksiya şəkli, rəsmi mənbə və AZ/EN/RU mətnləri var.
- Yeni ünvanlar: `/blog/qabyuyan-xeta-kodlari` və `/blog/qabyuyan-suyu-bosaltmir`. “Xəta kodları” filtri, marka üzrə kod blokları, model xəbərdarlıqları və Bosch/Samsung rəsmi mənbələri əlavə edilib.
- Desktop-da yapışqan bölmə naviqasiyası və əlaqə kartı; mobil görünüşdə açılıb-bağlanan mündəricat.
- Əlaqəli məqalələr, xidmət səhifəsinə keçid, telefon və mövcud WhatsApp düyməsi.
- Azərbaycan məzmunu, rus və ingilis tərcümələri. Tərcümələr mövcud dil seçimindən idarə olunur; ayrıca i18n route-ları yaradılmayıb.
- Header və footer-də Bloq keçidi.

## Kontent və dərc sərhədi

İstifadəçinin 12 noyabr indeksasiya tələbinə uyğun olaraq `/blog` və `src/data/blog.ts` siyahısındakı bütün dərc olunmuş məqalələr production-da indekslənə bilər. `src/app/sitemap.ts` həmin siyahını `generateStaticParams` ilə eyni mənbədən götürür; növbəti build yeni məqaləni avtomatik sitemap-ə əlavə edir. Beş əsas səhifə, Bloq və 8 məqalə birlikdə 14 URL edir. Canonical-lar `https://denizservis.az` domenindədir. Dev/Cloudflare preview deployment-ləri əvvəlki kimi noindex qalır və sitemap boşdur. Texniki məqalələr konkret model təlimatını və peşəkar diaqnostikanı əvəz etmir.

Kontent `src/data/blog.ts`, tərcümələr `src/i18n/blog.en.json` və `blog.ru.json`, komponentlər və scoped CSS isə `src/components/blog/` daxilindədir. Yeni slug `generateStaticParams` vasitəsilə build vaxtı çıxarılır; başqa slug-lar 404 olmalıdır. Yeni məqalə əlavə ediləndə `scripts/check-seo.mjs` daxilindəki önizləmə path siyahısını da yeniləyin.

Tarif, rəy, zəmanət müddəti və texniki ekspert yoxlaması uydurulmayıb. Mənbə şəkilləri məqalələrə köçürülməyib. Bloq üçün yeni AI redaksiya təsvirləri yaradılıb; onlar real müştəri işi və ya konkret xəta kodunun foto sübutu deyil. Mənşə və tam promptlar: [BLOG_ASSETS.md](BLOG_ASSETS.md). Xidmət səhifələrinin şəkilləri dəyişdirilməyib. JSON-LD yalnız səhifə/Organization/breadcrumb verir, yoxlanmamış mətnə expert-review və ya nəşr tarixi əlavə edilmir.

## Yoxlamalar

```sh
npm run lint
npm run typecheck
npm test
npm run build:server
npm run build:static
npm run check:static
npm run check:seo
```

Brauzerdə `/blog` və məqalələri 320, 390, 430, 768, 1024 və 1440 px-də yoxlayın. Filtrlər, bütün kart keçidləri, mobil mündəricat, bölmə anchor-ları, AZ/EN/RU dil keçidi və mobil menyu ayrıca yoxlanmalıdır. Static SEO yoxlaması production-da blog URL-lərinin indekslənə bildiyini və sitemap-də olduğunu, preview-da isə noindex qorunmasını yoxlayır.

Production-a keçid yalnız ayrıca istifadəçi təsdiqi, kontent yoxlaması və adi `dev → prod` PR prosesi ilə mümkündür. Bu iş production-a deploy icazəsi deyil.

## 6 noyabr 2026 yoxlaması

Qabyuyan əlavəsi üçün 178 test, lint/typecheck, server/static build və 12 səhifəlik static SEO yoxlaması keçib. Desktop önizləməsində filtr, məqalə keçidi, marka üzrə kod blokları, rəsmi mənbələr və uyğun xidmət keçidi yoxlanıb. Bu sessiyada viewport override ölçünü faktiki dəyişmədiyindən yeni mobil ölçü testinin nəticəsi yoxdur; əvvəlki blog görünüşünün mobil üslubları qorunub, yeni kod blokları 429 px və aşağıda tək sütuna keçir. Production təsdiqindən əvvəl real mobil yoxlama təkrar aparılmalıdır.

## 12 noyabr 2026 yoxlaması

183 test, lint/typecheck, server/static build və 15 səhifəlik static SEO yoxlaması keçib. Üç yeni şəkil build tərəfindən responsive variantlara çevrilir. Yeni məqalələr eyni BlogArticle/BlogCard və dəyişməyən mobil CSS-dən istifadə edir. Brauzerin viewport aləti 390 px sorğusuna baxmayaraq 1280 px saxladığı üçün bu sessiyada ayrıca dar-ekran sınağı təsdiqlənmir; desktop-da səhifələr, şəkillər və keçidlər yoxlanıb. Port 3000-də əvvəlcədən açıq server köhnə route siyahısını saxlaya bilər; yeni statik önizləmə port 3001-dədir.
