# DənizServis — GitHub və production qaydası

Repository: [daduu16/denizservis-web](https://github.com/daduu16/denizservis-web).

## Branch-lər

- `dev`: default və gündəlik development branch-i. Bütün sonrakı kod dəyişikliklərini burada edin.
- `prod`: production üçün; birbaşa commit/push etməyin.
- İlkin `prod`, test edilmiş `dev` commit-inin eyni SHA-sından yaradılır. İlkin yaratmadan sonra production yalnız `dev` → `prod` Pull Request ilə yenilənir.
- Mövcud tarixçəni yenidən yazmayın; force push istifadə etməyin.

Yeni clone-dan sonra:

```bash
git clone https://github.com/daduu16/denizservis-web.git
cd denizservis-web
git switch dev
git config core.hooksPath .githooks
npm ci
```

Node major versiyası `.node-version` daxilindədir (`24`). Lokal `pre-push` hook `prod`-a push-u bloklayır, amma server qorunmasının əvəzi deyil. Hook yeni clone-da ayrıca aktivləşdirilməlidir.

## Yoxlamalar və release

```bash
git switch dev
# Dəyişiklikləri edin, yalnız nəzərdə tutulan faylları stage edin.
git add src
npm run check:repo
npm run lint
npm run typecheck
npm test
npm run build:server
npm run build
npm run check:static
npm run check:seo
git commit -m "Describe the change"
git push origin dev
```

1. GitHub-da **Pull requests → New pull request** seçin.
2. **base: `prod`**, **compare: `dev`** olsun; digər repository-dən branch istifadə etməyin.
3. Dəyişiklikləri və Cloudflare preview-ni nəzərdən keçirin.
4. `Validate` və `Release policy` yoxlamaları uğurlu olmalıdır. Köhnə base səbəbindən tələb olunarsa **Update branch** ilə `dev`-i yeniləyin və CI-nin yenidən bitməsini gözləyin.
5. **Create a merge commit** ilə merge edin. `dev` branch-ini silməyin; squash/rebase əvəzinə normal merge davamlı development/release tarixçəsini saxlayır.
6. Lokal işə `git switch dev && git pull --ff-only origin dev` ilə davam edin.

`.github/workflows/ci.yml` `dev` push-larında və `dev`/`prod` PR-larında işləyir. `prod` hədəfinə yalnız bu repository-nin `dev` branch-indən PR qəbul edilir. CI lint, route type generation, TypeScript, testlər, adi Next.js build və Cloudflare statik export/SEO yoxlamalarını işlədir.

## GitHub default branch və `prod` ruleset addımları

Default branch: **Settings → General → Default branch → `dev` → Update**.

**Settings → Rules → Rulesets → New ruleset → New branch ruleset**:

1. Ad: `Protect prod`; enforcement: **Active**.
2. Target: **Include by pattern → `prod`** (`refs/heads/prod`).
3. Bypass list: boş saxlayın; administrator üçün də direct-push istisnası əlavə etməyin.
4. **Restrict deletions** və **Block force pushes** aktiv olsun.
5. **Require a pull request before merging** aktiv olsun.
6. **Require conversation resolution before merging** aktiv olsun.
7. **Require status checks to pass → Validate, Release policy** əlavə edin; branch-in aktual olması tələbini aktivləşdirin. Check adları ilk CI işləndikdən sonra görünür.
8. Solo sahib üçün məcburi review sayı `0` saxlanıla bilər: PR və CI yenə məcburidir, amma insan review-u məcburi deyil. Ayrı reviewer olduqda `1` edin; müəllif öz PR-ını approve edə bilmir.
9. Save changes. **Restrict updates** seçimini bypass olmadan aktivləşdirməyin: normal PR merge-i də kilidləyə bilər.

Qaydalar: [GitHub rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/creating-rulesets-for-a-repository), [default branch](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-branches-in-your-repository/changing-the-default-branch).

## Cloudflare Pages

Git integration ilə bu repository-ni seçin. Bu sənəd Cloudflare hesabına qoşulma və production deploy-un həyata keçirildiyi demək deyil.

| Ayar | Dəyər |
| --- | --- |
| Production branch | `prod` |
| Preview branches | Custom branches: include `dev` |
| Root directory | repository root |
| Build command | `npm run build` (`npm run build:static` də uyğundur) |
| Build output | `out` |
| Node | `.node-version` (`24`), yaxud `NODE_VERSION=24` |
| Production variable | `NEXT_PUBLIC_PRODUCTION_BRANCH=prod` |
| Production environment | `NEXT_PUBLIC_DEPLOYMENT_ENV=production` |
| Preview variable | `NEXT_PUBLIC_PRODUCTION_BRANCH=prod` |
| Preview environment | `NEXT_PUBLIC_DEPLOYMENT_ENV=preview` |

Production branch: Pages project → **Settings → Builds → Branch control**. Production build-ləri aktiv saxlayın, preview üçün `dev` seçin. Framework preset `Next.js Static HTML Export` ola bilər, amma standart `npx next build` əmrini `npm run build` ilə əvəz edin: layihənin hazırlıq skripti statik şəkilləri yaradır və yalnız müvəqqəti nüsxədə server API-ni export-dan çıxarır. Təkcə `output: "export"`-u məcburi etmək POST API və şəkil hazırlığı üçün kifayət deyil. Preview `noindex` qalır; canonical production domeninə yönəlir. Production qiymətini ümumi şəkildə preview-yə tətbiq etməyin.

**Vacib:** Statik frontend mövcud formadan `/api/bookings` ünvanına POST edir; repo kökündəki `functions/api/bookings.ts` Cloudflare Pages Function kimi ayrıca yığılır. Cloudflare Email Service üçün `CONTACT_RECIPIENT_EMAIL`, `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_EMAIL_API_TOKEN` runtime parametrlərini hər iki mühitdə (Preview və Production) ayrıca qurun; sirr yoxdursa funksiya `503` qaytarır, uğur göstərmir. Təlimat: [EMAIL_INTEGRATION.md](EMAIL_INTEGRATION.md). `out` qovluğunu təkbaşına fayl hostinqinə yükləmək backend-i deploy etmir. API açarını `NEXT_PUBLIC_` ilə adlandırmayın və statik frontend-ə yerləşdirməyin. Production buraxılışı yalnız yoxlanmış `dev` → `prod` PR ilə edin.

Rəsmi mənbələr: [Cloudflare branch control](https://developers.cloudflare.com/pages/configuration/branch-build-controls/), [build image / Node](https://developers.cloudflare.com/pages/configuration/build-image/).

## Məxfi məlumatlar

`.env*` faylları (`.env.example` istisna), build və ehtiyat export-lar, `node_modules`, şəxsi screenshot/audit çıxışları, orijinal tapşırıq və mənbə şəkil qovluğu commit olunmur. Orijinal fayllar diskdə saxlanılır, silinmir.

`npm run check:repo` Git index-də qadağan olunmuş faylları və bəzi tanınan secret pattern-lərini yoxlayır; bütün mümkün sirləri aşkar etməyə zəmanət vermir. Stage edilmiş diff-i əl ilə də nəzərdən keçirin. `.env.example` yalnız açıq biznes məlumatları və boş server secret sahələri saxlayır. Hosting secret-lərini dashboard-da ayrıca daxil edin.
