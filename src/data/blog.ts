export type BlogCategory = "Xəta kodları" | "Nasazlıq" | "Qiymət" | "Usta çağırışı";
export type BlogCode = { code: string; meaning: string; action: string };
export type BlogSection = { id: string; title: string; text: string; points?: string[]; codes?: BlogCode[] };
export type BlogPost = {
  slug: string; category: BlogCategory; title: string; excerpt: string; intro: string;
  appliance: "Qabyuyan" | "Paltaryuyan";
  image: string; alt: string; sections: BlogSection[]; note: string;
  imageKind?: "editorial";
  source?: { label: string; url: string };
  sources?: { label: string; url: string }[];
};

// Editorial previews, not reviewed repair instructions. No rankings, tariffs or warranty promises.
export const blogPosts: BlogPost[] = [
  {
    slug: "qabyuyan-xeta-kodlari", category: "Xəta kodları", appliance: "Qabyuyan",
    title: "Qabyuyan xəta kodları: ekran sizə nə deyir?",
    excerpt: "Bosch E15, E24, E09 və Samsung 4C, 5C, LC: kodları modelə uyğun anlamaq və təhlükəsiz növbəti addımı seçmək üçün bələdçi.",
    intro: "Ekrandakı kod dəyişdiriləcək hissənin adı deyil. O, cihazın qeydə aldığı vəziyyət barədə ipucudur. Eyni işarə fərqli marka və modeldə başqa məna verə bilər; əvvəlcə tam model nömrəsini və kodu qeyd edin.",
    image: "/images/blog-dishwasher-editorial.webp", alt: "Açıq qabyuyanın rəfləri və idarəetmə panelinin redaksiya təsviri", imageKind: "editorial",
    sections: [
      { id: "model-kod", title: "Əvvəl marka, model və tam kod", text: "Kodu iki nöqtə, tire və əlavə rəqəmlərlə birlikdə olduğu kimi yazın. Aşağıdakı nümunələr istehsalçıların göstərilən dəstək səhifələrinə əsaslanır və bütün modellər üçün universal siyahı deyil. Öz cihazınızın təlimatını əsas götürün." },
      { id: "bosch-kodlar", title: "Bosch qabyuyanlarda bəzi kodlar", text: "Bu nümunələr Bosch-un rəsmi xəta kodları bələdçisindəki izahlardır. Kod hissənin dəyişdirilməsinə təkbaşına əsas vermir.", codes: [
        { code: "E15", meaning: "Alt hissədə su aşkarlanıb, sızmadan qorunma aktivləşib.", action: "Su girişini təhlükəsiz şəkildə bağlayın və servisə müraciət edin. Cihazı əyərək kodu gizlətməyə çalışmayın." },
        { code: "E24 / E-24", meaning: "Boşaltma yolunda problem ola bilər: nasos yolu, şlanq və ya çıxışda maneə.", action: "Kodu və əlaməti qeyd edin; hissə dəyişdirmədən əvvəl diaqnostika lazımdır." },
        { code: "E09", meaning: "İstilik nasosunun daxili qızdırıcısı ilə bağlı xəta qeydə alınıb.", action: "Elektrik və isitmə hissələrinə müdaxilə etməyin; texniki yoxlama üçün ustaya müraciət edin." },
      ] },
      { id: "samsung-kodlar", title: "Samsung qabyuyanlarda bəzi kodlar", text: "Samsung-un bu bələdçisində su təchizatı, boşaltma və sızma kodları ayrılır. Sizin modeldə kod fərqli görünə bilər.", codes: [
        { code: "4C / 4E", meaning: "Su təchizatı ilə bağlı problem bildirir.", action: "Su təchizatının olub-olmadığını cihazı sökmədən dəqiqləşdirin. Kod qalırsa servis ilə danışın." },
        { code: "5C / 5E", meaning: "Suyun boşaldılması ilə bağlı problem bildirir.", action: "Filtr, şlanq və nasos kimi müxtəlif səbəblər mümkündür; kodu nasosun mütləq xarab olması kimi qəbul etməyin." },
        { code: "LC / LE", meaning: "Sızma ilə bağlı xəbərdarlıqdır.", action: "Cihazı təkrar işə salmayın, su və elektrik riskindən uzaq durun, servisə müraciət edin." },
      ] },
      { id: "tehlukesiz-addim", title: "Reset hər zaman həll deyil", text: "Kodu silmək səbəbi aradan qaldırmır. Sızma, yanıq qoxusu və ya elektrik riski varsa təkrar sınaq etməyin. Yaş prizə toxunmayın, cihazı sökməyin və qoruyucu sistemi keçməyin. Təhlükəsiz dayandırma üçün model təlimatına əməl edin." },
      { id: "servise-gonder", title: "Servisə nə göndərək?", text: "Marka, tam model nömrəsi, kodun fotosu və proqramın hansı mərhələdə dayandığı ilkin qiymətləndirməyə kömək edir. Kodu göstərmək üçün nasazlığı yenidən yaratmağa çalışmayın.", points: ["Marka və tam model nömrəsi", "Ekrandakı kodun dəyişdirilməmiş fotosu", "Su qalması, səs və ya görünən sızma barədə qısa qeyd", "Xidmət tələb olunan rayon və əlaqə nömrəsi"] },
    ],
    note: "Kod siyahısı model təlimatını və diaqnostikanı əvəz etmir. Texniki qaralama dərcdən əvvəl usta baxışından keçməlidir.",
    sources: [
      { label: "Bosch: qabyuyan xəta kodlarının rəsmi izahı", url: "https://www.bosch-home.com/us/en/c/spotlight/blta5a02e4f244618c3/owner-support/error-codes/dishwashers" },
      { label: "Samsung: 4C, 5C və LC kodları haqqında rəsmi məlumat", url: "https://www.samsung.com/ae/support/home-appliances/information-code-for-my-samsung-dishwasher-5c5e-4c4elcle/" },
    ],
  },
  {
    slug: "qabyuyan-suyu-bosaltmir", category: "Nasazlıq", appliance: "Qabyuyan",
    title: "Qabyuyanın içində su qalıb: nəyi qeyd etmək lazımdır?",
    excerpt: "Proqram dayanıb, qablar içəridədir, su isə boşalmır. Təhlükəsiz müşahidə ilə texniki müdaxilənin sərhədini ayıraq.",
    intro: "Qabyuyanda qalan suyun səbəbini yalnız bir əlamətə baxaraq müəyyən etmək olmaz. Ekrandakı kodu və proqramın hansı mərhələdə dayandığını qeyd etmək düzgün başlanğıcdır.",
    image: "/images/blog-dishwasher-editorial.webp", alt: "Açıq qabyuyanın rəfləri və idarəetmə panelinin redaksiya təsviri", imageKind: "editorial",
    sections: [
      { id: "ne-gorursunuz", title: "Gördüyünüz əlaməti təsvir edin", text: "Su nə vaxt qalıb, proqram yarımçıq dayanıb, yoxsa bitib? Ekranda kod varsa olduğu kimi yazın. Təkcə su qalması nasosun dəyişdirilməli olduğunu sübut etmir." },
      { id: "bosaltma-yolu", title: "Boşaltma yolunda nə baş verə bilər?", text: "Filtr və boşaltma yolunda maneə, şlanqın bükülməsi və nasosla bağlı problem mümkün səbəblər arasındadır. Bosch və Samsung-un bələdçiləri də boşaltma xətası üçün birdən çox ehtimal göstərir. Sizin model üçün konkret yoxlama təlimata və diaqnostikaya bağlıdır." },
      { id: "sokmeden", title: "Cihazı sökmədən dayanmalı olduğunuz yer", text: "İsti su, şüşə qırığı və elektrik riski ola bilər. Maşını yerindən çıxarmayın, əyməyin və nasosun içərisinə əl salmayın. İstifadəçi qulluğu yalnız cihazın təlimatındakı təhlükəsizlik şərtləri ilə aparılmalıdır." },
      { id: "yardim", title: "Problem qalırsa növbəti addım", text: "Markanı, modeli, varsa xəta kodunu və görünən əlaməti servisə yazın. Sızma və ya elektrik riski varsa cihazı yenidən işlətməyin. Xidmət imkanı və diaqnostika şərtlərini əvvəlcədən dəqiqləşdirin." },
    ],
    note: "Bu məqalə təhlükəsiz ilkin məlumat üçündür. Korpusun və elektrik hissələrinin yoxlanması peşəkar diaqnostika tələb edir.",
    sources: [
      { label: "Bosch: qabyuyan xəta kodlarının rəsmi izahı", url: "https://www.bosch-home.com/us/en/c/spotlight/blta5a02e4f244618c3/owner-support/error-codes/dishwashers" },
      { label: "Samsung: 4C, 5C və LC kodları haqqında rəsmi məlumat", url: "https://www.samsung.com/ae/support/home-appliances/information-code-for-my-samsung-dishwasher-5c5e-4c4elcle/" },
    ],
  },
  {
    slug: "paltaryuyan-suyu-bosaltmir", category: "Nasazlıq", appliance: "Paltaryuyan",
    title: "Paltaryuyan suyu boşaltmır: haradan başlamaq lazımdır?",
    excerpt: "Barabanda su qalıb? Mümkün səbəbləri, təhlükəsiz ilkin addımları və ustaya nə vaxt müraciət etməli olduğunuzu öyrənin.",
    intro: "Yuma bitdikdən sonra barabanda su qalması təkbaşına konkret hissənin xarab olduğunu göstərmir. İlk məqsəd cihazı sökmək deyil, əlamətləri düzgün anlamaq və təhlükəsiz növbəti addımı seçməkdir.",
    image: "/images/blog-washer-editorial.webp", alt: "Müasir camaşır otağında açıq paltaryuyanın redaksiya təsviri", imageKind: "editorial",
    sections: [
      { id: "elametler", title: "Əvvəlcə əlamətləri qeyd edin", text: "Problemin hansı mərhələdə yarandığını xatırlayın. Ekrandakı məlumat və müşahidələriniz ilkin qiymətləndirməni asanlaşdırır; bunlar uzaqdan qəti diaqnoz üçün kifayət deyil.", points: ["Ekranda xəta kodu varmı?", "Su heç boşalmır, yoxsa yavaş boşalır?", "Boşaltma zamanı səs eşidilirmi?", "Hansı proqram seçilib və problem nə vaxt başlayıb?"] },
      { id: "sebebler", title: "Səbəb nə ola bilər?", text: "Boşaltma yolunda tıxanma və şlanqın bükülməsi mümkün səbəblər arasındadır. Nasosun və digər hissələrin vəziyyəti isə texniki yoxlama ilə müəyyən edilir. Təkcə barabanda su qalmasına görə nasosun dəyişdirilməsinə qərar verməyin." },
      { id: "tehlukesizlik", title: "Təhlükəsiz yoxlamanın sərhədi", text: "Qapını və filtr qapağını zorla açmayın. Filtrə müdaxilə yalnız konkret modelin istifadəçi təlimatı buna icazə verirsə, cihaz elektrikdən ayrılıbsa və su soyuyubsa nəzərdən keçirilə bilər. Ümumi internet məsləhəti model təlimatını əvəz etmir.", points: ["Yaş elektrik hissələrinə və prizə toxunmayın.", "Sızma, yanıq qoxusu və ya elektrik riski varsa cihazı yenidən işlətməyin.", "Korpusun açılmasını və elektrik hissələrinin yoxlanmasını ustaya həvalə edin."] },
      { id: "ustaya-melumat", title: "Ustaya hansı məlumatları göndərməli?", text: "Cihazın markasını, modelini, xəta kodunu və müşahidə etdiyiniz əlamətləri bildirin. Təhlükəsiz şəraitdə çəkilmiş foto da kömək edə bilər. Şəkil çəkmək üçün cihazı sökməyin və nasazlığı təkrar yaratmağa çalışmayın." },
    ],
    note: "Texniki qaralama: konkret modelin təlimatı və usta baxışı ilə təsdiqlənməlidir. Bu yazı diaqnostikanı əvəz etmir.",
    source: { label: "Bosch: su boşaltma problemi haqqında rəsmi məlumat", url: "https://www.bosch-home.com.sg/service/get-support/washing-machine/washing-machine-is-not-draining" },
  },
  {
    slug: "paltaryuyan-temiri-qiymeti", category: "Qiymət", appliance: "Paltaryuyan",
    title: "Paltaryuyan təmirinin qiyməti nədən asılıdır?",
    excerpt: "Diaqnostika, iş və ehtiyat hissələri: təmirə razılıq verməzdən əvvəl hansı sualları vermək faydalıdır?",
    intro: "Təmir qiymətini aydınlaşdırmaq düzgün suallardan başlayır. Eyni əlamət müxtəlif nasazlıqlarla əlaqəli ola bildiyindən, bütün cihazlar üçün yalnız telefon təsvirinə əsasən vahid məbləğ demək düzgün olmaz.",
    image: "/images/blog-washer-editorial.webp", alt: "Müasir camaşır otağında açıq paltaryuyanın redaksiya təsviri", imageKind: "editorial",
    sections: [
      { id: "diaqnostika", title: "Niyə əvvəlcə diaqnostika?", text: "Dəqiq səbəb müəyyənləşdirildikdən sonra görüləcək işi və tələb olunan hissələri müzakirə etmək mümkündür. Markanı, modeli və əlamətləri öncədən paylaşmaq ilkin danışığı daha faydalı edir." },
      { id: "qiymete-daxil", title: "Qiymətə nələrin daxil olduğunu soruşun", text: "Razılaşdırılan məbləğin hansı işə aid olduğunu dəqiqləşdirin. Diaqnostika, səfər, iş və ehtiyat hissəsi barədə ayrı-ayrı suallar verin; hər birinin şərtini təmir başlamazdan əvvəl öyrənin.", points: ["Diaqnostika haqqı varmı və necə hesablanır?", "İş və ehtiyat hissəsi məbləğə daxildirmi?", "Təmirə razılıq vermədikdə hansı ödəniş yaranır?", "Əlavə iş lazım olarsa əvvəlcədən razılaşdırılacaqmı?"] },
      { id: "razilasma", title: "Şərtləri iş başlamazdan əvvəl razılaşdırın", text: "Təklif olunan həlli, məbləği və mümkün müddəti dəqiqləşdirin. Zəmanət təklif olunursa, onun hansı işə, hansı hissəyə və hansı şərtlərlə aid olduğunu soruşun. Ümumi vəd əvəzinə konkret razılaşmaya üstünlük verin." },
    ],
    note: "Bu yazı qiymət cədvəli deyil. DənizServis-in diaqnostika və xidmət şərtləri müraciət zamanı dəqiqləşdirilir.",
  },
  {
    slug: "bakida-paltaryuyan-ustasi-cagirmaq", category: "Usta çağırışı", appliance: "Paltaryuyan",
    title: "Usta çağırmazdan əvvəl: kiçik hazırlıq siyahısı",
    excerpt: "Model, xəta kodu və ünvan. Bir neçə məlumatla servisə müraciətinizi daha aydın və rahat edin.",
    intro: "Servisə müraciət etmək üçün texniki mütəxəssis olmaq lazım deyil. Cihazınız və görünən problem haqqında bir neçə məlumatı hazırlamaq söhbəti asanlaşdırır və detalların dəqiqləşdirilməsinə kömək edir.",
    image: "/images/hero-technician.png", alt: "Məişət texnikası ilə işləyən servis ustası",
    sections: [
      { id: "cihaz-melumatlari", title: "Cihaz haqqında məlumatları hazırlayın", text: "Marka və modeli, problemin nə vaxt başladığını və ekrandakı xəta kodunu qeyd edin. Modeli bilmək üçün cihazı sökməyin; istifadəçi təlimatına və əlçatan etiketə baxmaq kifayət edə bilər.", points: ["Marka və model", "Problemin qısa təsviri", "Varsa, ekrandakı xəta kodu", "Təhlükəsiz şəraitdə çəkilmiş foto"] },
      { id: "unvan-vaxt", title: "Ünvanı və münasib vaxtı dəqiqləşdirin", text: "Xidmət tələb olunan rayon və ünvanı bildirin. Səfər imkanını və münasib vaxtı servis ilə razılaşdırın. Cihazı özünüz daşımağa və ya nasazlığı göstərmək üçün təhlükəli vəziyyəti təkrar yaratmağa çalışmayın." },
      { id: "xidmet-sertleri", title: "Xidmət şərtlərini əvvəlcədən soruşun", text: "Diaqnostika, qiymətin razılaşdırılması və mümkün zəmanət şərtlərini öyrənin. Təsdiqlənməmiş “ən yaxşı” və “ən ucuz” iddialarından çox, görüləcək işin konkret izahına diqqət edin." },
      { id: "muraciet", title: "Sizə rahat olan əlaqə yolunu seçin", text: "DənizServis-ə zəng, WhatsApp, e-poçt və ya saytdakı müraciət forması ilə yaza bilərsiniz. Cihaz məlumatları və ünvan əsasında xidmətin detallarını birlikdə dəqiqləşdirin." },
    ],
    note: "Bu siyahı müraciətə hazırlıq üçündür. Səfər, diaqnostika və təmirin şərtləri ayrıca razılaşdırılır.",
  },
];

export const blogCategories: BlogCategory[] = ["Xəta kodları", "Nasazlıq", "Qiymət", "Usta çağırışı"];
export const blogPost = (slug: string) => blogPosts.find(post => post.slug === slug);
export const blogPath = (post: BlogPost) => `/blog/${post.slug}`;
export function readingMinutes(post: BlogPost) {
  const text = [post.intro, ...post.sections.flatMap(s => [s.title, s.text, ...(s.points ?? []), ...(s.codes ?? []).flatMap(c => [c.code, c.meaning, c.action])])].join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 180));
}
