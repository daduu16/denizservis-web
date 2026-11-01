# Mövcud müraciət formasının Cloudflare e-poçt bağlantısı

Forma → eyni origin-də `POST /api/bookings` → Cloudflare Pages Function → Cloudflare Email Service REST API → hesabdakı verified destination.

## Cloudflare Dashboard — Preview və Production

1. **Email Service → Email Routing → Destination Addresses**: mövcud Gmail alıcısının `Verified` olduğunu təsdiqləyin. Mövcud `info@denizservis.az` routing qaydasını və DNS-i dəyişməyin. Yeni sending domain onboarding və Workers Paid planı seçməyin: burada yalnız mövcud routing domenindən həmin hesabdakı verified destination-a göndərilir.
2. Eyni Cloudflare hesabının **Account ID** dəyərini kopyalayın (hesab məlumatlarında 32 simvolluq ID). **Zone ID** istifadə etməyin.
3. **My Profile → API Tokens → Create Token → Create Custom Token**:
   - Ad: `DenizServis form email`.
   - İcazə: **Account → Email Sending → Edit**.
   - Account Resources: yalnız Email Routing-in və verified alıcının olduğu hesab.
   - Global API Key, DNS edit, bütün hesablar və əlavə geniş icazələr verməyin.
   - Tokeni yaradıb yalnız Cloudflare Dashboard-da server secret kimi saxlayın; çata/GitHub-a yazmayın. Cloudflare edge IP-ləri dəyişdiyindən şəxsi kompüterinizin IP-si ilə tokeni məhdudlaşdırmayın.
4. **Workers & Pages → denizservis-web → Settings → Variables and Secrets** bölməsində əvvəl **Preview**, sonra ayrıca **Production** mühitində əlavə edin:

   | Ad | Tip | Dəyər |
   | --- | --- | --- |
   | `CONTACT_RECIPIENT_EMAIL` | Secret | Cloudflare-də verified olan mövcud Gmail alıcısı |
   | `CLOUDFLARE_EMAIL_API_TOKEN` | Secret | Yuxarıda yaradılmış məhdud token |
   | `CLOUDFLARE_ACCOUNT_ID` | Text variable | Həmin hesabın Account ID-si |

   Bu adlara `NEXT_PUBLIC_` prefiksi əlavə etməyin. Göndərən kodda `info@denizservis.az` olaraq sabitdir. SMTP/Gmail parolu və əlavə Resend hesabı lazım deyil.
5. **Bindings** bölməsində yeni binding yaratmayın. Pages Function Email Service-in rəsmi REST API-sini istifadə edir; `send_email`, service binding, KV, D1, database və ayrıca Worker tələb olunmur.
6. **Build configuration**: repo kökü, build `npm run build` (və ya `npm run build:static`), output `out`. Git inteqrasiyası `functions/api/bookings.ts`-i repo kökündən avtomatik yığır. Təkcə `out` qovluğunu Dashboard drag-and-drop ilə yükləmək Functions kodunu deploy etmir. Əvvəl kodun olduğu `dev` commitindən **Preview deployment** başladın. Production branch `prod` olaraq qalsın; production buraxılışı yalnız testlərdən və istifadəçi icazəsindən sonra `dev` → `prod` PR ilə edin. Secrets dəyişdikdən sonra müvafiq deployment-i yenidən başladın.
7. `dev` preview açılıb eyni mövcud formadan test müraciəti göndərin. DevTools Network-də `/api/bookings` üçün `201` və mövcud success mesajı görünməlidir. Verified Gmail-in Inbox və Spam bölməsində real məktubu yoxlayın. `201` Cloudflare-in qəbul/queue təsdiqidir, Gmail Inbox zəmanəti deyil. Dashboard quraşdırılmadan real göndəriş baş vermir.

## Dəyişməyən hissələr

Yeni forma və yeni sahə yoxdur. Client və server eyni mövcud Zod schema-dan istifadə edir; telefonun sərbəst yazılışı, razılıq, honeypot, compact forma, error/success paneli və forma təmizlənməsi saxlanılıb. Formadan yalnız statik-export göndərmə blokadası götürülüb; submit hələ də mövcud `/api/bookings`-ə JSON göndərir. Dizayn/CSS, SEO, WhatsApp və DNS bu tapşırıqda dəyişdirilmir. Əvvəldən lokalda qalan əlaqə/SEO dəyişiklikləri ayrıca saxlanılıb.

`src/app/api/bookings/route.ts` local/server build-də, `functions/api/bookings.ts` isə Pages-də eyni server handler-i çağırır. Köhnə Resend yolundan göndəriş yoxdur. Server vars yalnız runtime-da oxunur; müştəri POST məlumatı `to`, `from` və subject-i əvəz edə bilməz. Alıcının real ünvanı kodda və frontend-də saxlanılmır.

## Təhlükəsizlik və nəticələr

- Yalnız same-origin JSON POST; başqa origin və CORS sorğuları rədd edilir.
- Mövcud field validasiyası, razılıq və honeypot yoxlaması dəyişməyib.
- Streaming body üçün 16 KiB real UTF-8 həddi; HTML məzmunu escape olunur; həm mətn, həm oxunaqlı cədvəl göndərilir.
- Sadə per-isolate limit: IP başına 5 cəhd/10 dəqiqə, ümumi 50 cəhd/10 dəqiqə. Database olmadığı üçün qlobal/paylaşılan rate limit deyil; isolate yenidən başlasa limit sıfırlana bilər. Bu, sadə spam maneəsidir, tam bot müdafiəsi zəmanəti deyil.
- Yalnız sabit Cloudflare API hostu; server Account ID formatı yoxlanır; token redirect-ə ötürülmür; 12 saniyəlik timeout. Müştəri məlumatları/tokenlər loglanmır.
- Provider uğursuzluğu, suppression, permanent bounce, boş və yanlış cavabda `502`; konfiqurasiya yoxdursa `503`; etibarsız sahələrdə `422`; böyük body-də `413`; limitdə `429`.
- Uğur yalnız Cloudflare həmin alıcını `delivered` və ya `queued` siyahısında təsdiqlədikdə göstərilir. Timeout-dan sonra avtomatik retry yoxdur: əvvəlki sorğu qəbul olunmuş ola bilər. İstifadəçi xəta zamanı məlumatlarını saxlayır.

## Lokal yoxlama

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build:static`, `npm run check:static`, `npm run check:seo`.

`npx wrangler pages functions build functions` Pages backend-in ayrıca yığılmasını yoxlayır. `npx wrangler pages dev out` statik frontend-i və Functions-u birlikdə lokal işlədir. Lokal runtime sirrləri yalnız ignor edilmiş `.dev.vars`-da saxlanıla bilər; `.env.example` boş nümunədir. Heç bir real sirr repoya əlavə edilmir. Unit testlər Cloudflare cavablarını mock edir; canlı hesab və real məktub göndərişini təsdiqləmir.

## Rəsmi mənbələr

- [Email Service REST API — Pages Function-dan binding olmadan göndərmə](https://developers.cloudflare.com/email-service/api/send-emails/rest-api/)
- [Verified destination-a pulsuz göndəriş və routing domeni şərti](https://developers.cloudflare.com/email-service/platform/limits/)
- [Pages Functions: repo kökündə functions qovluğu](https://developers.cloudflare.com/pages/functions/get-started/)

Kod yalnız `dev`-də dəyişdirilir. İstifadəçinin son deploy göstərişinə uyğun production buraxılışı `dev` → `prod` PR ilə edilir; `prod`-a birbaşa push edilmir.
