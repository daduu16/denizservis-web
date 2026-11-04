# Bloq önizləməsi — yalnız dev

## Hazır olanlar

- `/blog`: önə çıxan məqalə, mövzu filtrləri, kliklənən məqalə kartları və WhatsApp keçidi.
- Üç statik məqalə: `/blog/paltaryuyan-suyu-bosaltmir`, `/blog/paltaryuyan-temiri-qiymeti`, `/blog/bakida-paltaryuyan-ustasi-cagirmaq`.
- Desktop-da yapışqan bölmə naviqasiyası və əlaqə kartı; mobil görünüşdə açılıb-bağlanan mündəricat.
- Əlaqəli məqalələr, xidmət səhifəsinə keçid, telefon və mövcud WhatsApp düyməsi.
- Azərbaycan məzmunu, rus və ingilis tərcümələri. Tərcümələr mövcud dil seçimindən idarə olunur; ayrıca i18n route-ları yaradılmayıb.
- Header və footer-də Bloq keçidi.

## Kontent və dərc sərhədi

Bu dizayn/redaksiya önizləməsidir. Bütün bloq səhifələri deployment-dən asılı olmayaraq `noindex` saxlanılır. Dərc edilmiş səhifələrin sitemap-ı dəyişdirilməyib. Səhifələr görünən redaksiya önizləməsi qeydi daşıyır; texniki məqalənin usta və konkret model təlimatı ilə yoxlanması tələb olunur.

Kontent `src/data/blog.ts`, tərcümələr `src/i18n/blog.en.json` və `blog.ru.json`, komponentlər və scoped CSS isə `src/components/blog/` daxilindədir. Yeni slug `generateStaticParams` vasitəsilə build vaxtı çıxarılır; başqa slug-lar 404 olmalıdır. Yeni məqalə əlavə ediləndə `scripts/check-seo.mjs` daxilindəki önizləmə path siyahısını da yeniləyin.

Tarif, rəy, zəmanət müddəti və texniki ekspert yoxlaması uydurulmayıb. Mənbə şəkilləri məqalələrə köçürülməyib; mövcud layihə şəkilləri istifadə edilib. JSON-LD yalnız səhifə/Organization/breadcrumb verir, yoxlanmamış mətnə expert-review və ya nəşr tarixi əlavə edilmir.

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

Brauzerdə `/blog` və məqalələri 320, 390, 430, 768, 1024 və 1440 px-də yoxlayın. Filtrlər, bütün kart keçidləri, mobil mündəricat, bölmə anchor-ları, AZ/EN/RU dil keçidi və mobil menyu ayrıca yoxlanmalıdır. Yeni blog səhifələrinin `noindex` və sitemap-dan kənar qalması static SEO yoxlamasına daxildir.

Production-a keçid yalnız ayrıca istifadəçi təsdiqi, kontent yoxlaması və adi `dev → prod` PR prosesi ilə mümkündür. Bu iş production-a deploy icazəsi deyil.
