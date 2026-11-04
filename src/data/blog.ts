export type BlogCategory = "Nasazlıq" | "Qiymət" | "Usta çağırışı";
export type BlogSection = { id: string; title: string; text: string; points?: string[] };
export type BlogPost = {
  slug: string; category: BlogCategory; title: string; excerpt: string; intro: string;
  image: string; alt: string; sections: BlogSection[]; note: string;
  source?: { label: string; url: string };
};

// Editorial previews, not reviewed repair instructions. No rankings, tariffs or warranty promises.
export const blogPosts: BlogPost[] = [
  {
    slug: "paltaryuyan-suyu-bosaltmir", category: "Nasazlıq",
    title: "Paltaryuyan suyu boşaltmır: haradan başlamaq lazımdır?",
    excerpt: "Barabanda su qalıb? Mümkün səbəbləri, təhlükəsiz ilkin addımları və ustaya nə vaxt müraciət etməli olduğunuzu öyrənin.",
    intro: "Yuma bitdikdən sonra barabanda su qalması təkbaşına konkret hissənin xarab olduğunu göstərmir. İlk məqsəd cihazı sökmək deyil, əlamətləri düzgün anlamaq və təhlükəsiz növbəti addımı seçməkdir.",
    image: "/images/washing-machine.png", alt: "Öndən yüklənən paltaryuyan maşın",
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
    slug: "paltaryuyan-temiri-qiymeti", category: "Qiymət",
    title: "Paltaryuyan təmirinin qiyməti nədən asılıdır?",
    excerpt: "Diaqnostika, iş və ehtiyat hissələri: təmirə razılıq verməzdən əvvəl hansı sualları vermək faydalıdır?",
    intro: "Təmir qiymətini aydınlaşdırmaq düzgün suallardan başlayır. Eyni əlamət müxtəlif nasazlıqlarla əlaqəli ola bildiyindən, bütün cihazlar üçün yalnız telefon təsvirinə əsasən vahid məbləğ demək düzgün olmaz.",
    image: "/images/paltaryuyan.png", alt: "Paltaryuyan maşının görünüşü",
    sections: [
      { id: "diaqnostika", title: "Niyə əvvəlcə diaqnostika?", text: "Dəqiq səbəb müəyyənləşdirildikdən sonra görüləcək işi və tələb olunan hissələri müzakirə etmək mümkündür. Markanı, modeli və əlamətləri öncədən paylaşmaq ilkin danışığı daha faydalı edir." },
      { id: "qiymete-daxil", title: "Qiymətə nələrin daxil olduğunu soruşun", text: "Razılaşdırılan məbləğin hansı işə aid olduğunu dəqiqləşdirin. Diaqnostika, səfər, iş və ehtiyat hissəsi barədə ayrı-ayrı suallar verin; hər birinin şərtini təmir başlamazdan əvvəl öyrənin.", points: ["Diaqnostika haqqı varmı və necə hesablanır?", "İş və ehtiyat hissəsi məbləğə daxildirmi?", "Təmirə razılıq vermədikdə hansı ödəniş yaranır?", "Əlavə iş lazım olarsa əvvəlcədən razılaşdırılacaqmı?"] },
      { id: "razilasma", title: "Şərtləri iş başlamazdan əvvəl razılaşdırın", text: "Təklif olunan həlli, məbləği və mümkün müddəti dəqiqləşdirin. Zəmanət təklif olunursa, onun hansı işə, hansı hissəyə və hansı şərtlərlə aid olduğunu soruşun. Ümumi vəd əvəzinə konkret razılaşmaya üstünlük verin." },
    ],
    note: "Bu yazı qiymət cədvəli deyil. DənizServis-in diaqnostika və xidmət şərtləri müraciət zamanı dəqiqləşdirilir.",
  },
  {
    slug: "bakida-paltaryuyan-ustasi-cagirmaq", category: "Usta çağırışı",
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

export const blogCategories: BlogCategory[] = ["Nasazlıq", "Qiymət", "Usta çağırışı"];
export const blogPost = (slug: string) => blogPosts.find(post => post.slug === slug);
export const blogPath = (post: BlogPost) => `/blog/${post.slug}`;
export function readingMinutes(post: BlogPost) {
  const text = [post.intro, ...post.sections.flatMap(s => [s.title, s.text, ...(s.points ?? [])])].join(" ");
  return Math.max(1, Math.ceil(text.split(/\s+/).length / 180));
}
