# DənizServis — lokal AI axtarış araşdırması

Yalnız `dev` üçün xərcsiz ilkin versiya. Sayta yeni səhifə, menyu və ya blog əlavə etmir; production-a toxunmur. Daxili ChatGPT endpoint-lərinə daxil olmur, brauzer cookie/tokenlərini oxumur, API istifadə etmir, məqalə yayımlamır və heç bir avtomatik şəbəkə sorğusu göndərmir.

## İstifadə

Repo kökündə, `dev` branch-ində:

```sh
npm run research:plan
npm run research:demo
npm run research:import -- research-local/input.json
```

- `plan`: DənizServis xidmətləri üzrə 100 fərqli **namizəd sual**. Bunlar real axtarış məlumatı deyil və göndərilmir.
- `demo`: açıq şəkildə DEMO işarələnmiş sintetik nümunə hesabat. `example.com` real rəqib və ya AI tövsiyəsi deyil.
- `import`: özünüzün təqdim etdiyiniz JSON-dan müşahidələr çıxarır. Hər icra yeni qovluq yaradır, əvvəlki hesabatın üzərinə yazmır.

Nəticələr `research-local/reports/` daxilindədir və Git tərəfindən ignore edilir. Raw JSON-u da `research-local/` altında saxlayın. Şəxsi söhbət, HAR, cookie, Authorization başlığı və hesab tokeni göndərmək lazım deyil. Alət tam məxfi məlumat təmizləyicisi deyil: sorğu, başlıq və URL yolunun özündə şəxsi məlumat varsa hesabatda qala bilər. Paylaşmazdan əvvəl yoxlayın.

## Tövsiyə edilən import formatı

`research-local/input.json` faylını öz müşahidələrinizlə yaradın:

```json
[
  {
    "query": "Buraya müşahidə etdiyiniz faktiki axtarış sorğusunu yazın",
    "sources": [
      {
        "title": "Nəticədə görünən faktiki səhifə başlığı",
        "url": "https://example.com/observed-page"
      }
    ]
  }
]
```

Bu nümunə real nəticə deyil. Şəkillərdəki xarici xidmətlər DənizServis araşdırması kimi daxil edilməyib.

Mövcud, özünüzə aid JSON-da `search_model_queries.queries` və `type: "search_result"` olan `title`/`url` obyektləri də istənilən dərinlikdə tapılır. “4-cü və 5-ci obyekt” fərziyyəsi yoxdur. Bu daxili format sabit API müqaviləsi deyil; dəyişərsə, yuxarıdakı sadə formatdan istifadə edin. Sorğu ilə mənbə arasında açıq əlaqə yoxdursa CSV-də “məlum deyil” yazılır. Chat mətnlərindən və reasoning sahələrindən məlumat çıxarılmır.

Maksimum JSON ölçüsü 5 MiB-dir; dərinlik və obyekt sayı da məhdudlaşdırılıb. Alət URL-lərə daxil olmur. URL query və fragment hissələri atılır, lokal/IP və qeyri-HTTP linklər qəbul edilmir. CSV formula injection-a qarşı hüceyrələr qorunur. CSV-lər UTF-8 BOM, vergül və CRLF istifadə edir; Excel lazım bilsə Data → From Text/CSV ilə UTF-8 və comma seçin.

## Hesabatlar

| Fayl | Məzmun |
| --- | --- |
| `queries.csv` | Unikal sorğular, sadə qayda əsaslı cihaz/mövzu təsnifatı və əl ilə yoxlama üçün Trends linki |
| `sources.csv` | Müşahidə edilmiş başlıqlar, təmizlənmiş URL-lər və yalnız məlum sorğu əlaqələri |
| `topics.csv` | İdxalda mövzu üzrə unikal sorğu sayı və redaksiya üçün başlıq təklifi |
| `blog-plan.md` | Mövzu üzrə suallar, məqalə skeleti və texniki/redaksiya yoxlama siyahısı |

Təsnifat sadə qaydadır, insan tərəfindən nəzərdən keçirilməlidir. Google Trends linkləri Azərbaycan və son 12 aya açılır; botla Trends məlumatı yığılmır. Çox dar sorğuda nəticə olmaya bilər. Sayt başlıqlarından onun hansı açar sözə görə sıralandığı müəyyən edilmir. Sorğu sayı axtarış həcmi, bazar tələbi, rəqib reytinqi və ya AI görünürlüyü deyil.

## Kontent mərhələsi

Əvvəl 10–20 real müşahidə ilə başlayın. Mövzuları faydasına görə seçin, mövcud xidmət səhifələrində cavab olub-olmadığını yoxlayın. Təkrarlanan rayon/marka səhifələri və kütləvi, yoxlanmamış məqalələr yaratmayın. Hər məqalə orijinal və real müştəri problemini həll edən məzmun olmalıdır. Texniki izahlar model təlimatı və usta ilə təsdiqlənməlidir; qiymət, rəy, təcrübə və zəmanət uydurulmamalıdır.

Blog interfeysi, yeni public route-lar, avtomatik generasiya və API ilə sorğu mərhələsi bu ilkin versiyada qəsdən yoxdur. Onlar ayrıca scope və xərc təsdiqi tələb edir. Hesabatlar review olunmadan sayta köçürülməməlidir.

AI cavablarında görünməyə zəmanət yoxdur. OpenAI-nin rəsmi sənədi ChatGPT axtarışı üçün `OAI-SearchBot` girişinə icazə verilməsini tövsiyə edir; bu da konkret cavabda görünmə vədi deyil: https://developers.openai.com/api/docs/bots

Gələcəkdə rəsmi API seçilərsə web search mənbə URL-lərini qaytara bilir. Bu, ChatGPT interfeysinin özündəki nəticələrin eynisi deyil; token və xərc təsdiqi olmadan qoşulmayıb: https://developers.openai.com/api/docs/guides/tools-web-search
