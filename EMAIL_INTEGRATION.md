# Mövcud forma — FormSubmit AJAX

Mövcud `BookingForm` eyni sahələr, CSS, Zod validasiyası, razılıq, honeypot və React Hook Form axını ilə saxlanılır. Yalnız submit transport-u dəyişib: `src/lib/formsubmit.ts` birbaşa `https://formsubmit.co/ajax/info@denizservis.az` ünvanına JSON POST edir.

- Sabit subject: `DənizServis — Yeni müraciət`.
- Ad, telefon, cihaz növü, marka, problem, rayon/ünvan və razılıq oxunaqlı sahələrlə ötürülür; `_template=table` istifadə edilir.
- Mövcud `website` honeypot-u `_honey` kimi göndərilir. FormSubmit-in standart spam qorunması saxlanılır; `_captcha=false` əlavə edilmir.
- Loading və düymənin deaktiv olması mövcud `isSubmitting` ilə işləyir. Uğur üçün HTTP statusu və JSON-dakı `success: true` və ya `success: "true"` tələb olunur. Yalnız bundan sonra mövcud success paneli, analytics və forma sıfırlanması işləyir.
- Xəta, yanlış/non-JSON cavab, provider rəddi və şəbəkə kəsilməsi zamanı error paneli göstərilir; daxil edilmiş məlumatlar silinmir. 25 saniyə timeout var, avtomatik təkrar göndəriş yoxdur.
- Uğur mətni xidmətin müraciəti qəbul etdiyini bildirir, Gmail Inbox-a çatdırılma zəmanəti vermir.

## İlk aktivasiya — bir dəfə istifadəçi tərəfindən

1. `dev` preview-dən bir test göndərin. Bu, FormSubmit-in rəsmi ünvana təsdiq məktubu göndərməsini başladır.
2. Mövcud Cloudflare Email Routing həmin məktubu Gmail-ə yönləndirir. Inbox və Spam qovluqlarını yoxlayın.
3. FormSubmit məktubundakı **Activate Form** keçidini açın. Bu addım avtomatik tamamlanmış sayılmır.
4. Aktivləşdirdikdən sonra eyni formadan yenidən test göndərib bütün sahələrin məktubda olduğunu yoxlayın. FormSubmit aktivləşdirilməmiş müraciətləri müvəqqəti saxladığını bildirir.

API token, SMTP, yeni server, Pages Function və DNS dəyişikliyi lazım deyil. Mövcud Email Routing saxlanılır. Köhnə Cloudflare göndəriş endpoint-ləri və yalnız onlara aid helper/testlər çıxarılıb; Git tarixçəsindən bərpa oluna bilər. Köhnə Cloudflare e-poçt sirrləri artıq istifadə edilmir; hesab ayarları bu işdə dəyişdirilmir.

Məlumatlar istifadəçinin seçdiyi FormSubmit xidmətinə ötürülür. CAPTCHA və ya başqa insan yoxlaması göstərilərsə onu istifadəçi tamamlamalıdır; qorunma proqramla keçilmir. Yeni sahə və əlavə müştəri e-poçtu tələb olunmur.

## Yoxlama

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build:static`, `npm run check:static`, `npm run check:seo`.

Unit testlər tam payload-u, dəqiq subject-i, provider qəbul/rədd cavablarını, aktivasiya bildirişini, şəbəkə xətası və timeout-u, spam qorunmasının saxlanmasını yoxlayır. Unit testlər real məktub çatdırılmasını təsdiqləmir. Dəyişikliklər yalnız `dev`-dədir; `prod`-a toxunulmur.

Rəsmi sənədlər: [AJAX](https://formsubmit.co/ajax-documentation), [subject, table və honeypot](https://formsubmit.co/documentation), [aktivasiya və spam qorunması](https://formsubmit.co/help).
