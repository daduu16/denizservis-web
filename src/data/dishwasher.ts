import { contactConfig } from "../config/contact";

export const dishwasherContent = {
  path: "/xidmetler/qabyuyan-temiri",
  title: "Qabyuyan Maşın Təmiri - DənizServis",
  lead: "Su boşalmır, qablar təmiz yuyulmur və ya xəta kodu görünür? Problemi bizə bildirin.",
  metaTitle: "Bakıda Qabyuyan Maşın Təmiri | DənizServis",
  description: `Bakıda qabyuyan maşın təmiri: su boşaltma, isitmə və elektron plata nasazlıqları. Marka və modeli bildirin. DənizServis: ${contactConfig.phone}.`,
  updated: "2026-10-31",
} as const;

export const dishwasherProblems = [
  { id: "su-bosaltmir", title: "Suyu boşaltmır", heading: "Qabyuyan maşın suyu boşaltmır", text: "Proqram bitdikdən sonra içəridə su qalırsa, səbəb filtrdə və ya boşaltma şlanqında tıxanma, drenaj nasosunda nasazlıq ola bilər. Yalnız görünən əlamətə əsasən nasosun dəyişdirilməsinə qərar verilmir; suyun çıxış yolu və nasosun fəaliyyəti birlikdə yoxlanılır." },
  { id: "su-goturmur", title: "Su götürmür", heading: "Qabyuyan maşın su götürmür", text: "Su təchizatı, giriş filtri, klapan və su səviyyəsini izləyən sensorlar bu əlamətlə əlaqəli ola bilər. Marka, model və proqramın hansı mərhələdə dayandığı ilkin qiymətləndirməyə kömək edir. Dəqiq səbəb texniki yoxlama ilə müəyyən olunur." },
  { id: "qablar-temiz-yuyulmur", title: "Qabları yaxşı yumur", heading: "Qablar niyə təmiz yuyulmur?", text: "Çirkli filtr, tutulmuş sprey qolları, qabların yerləşdirilməsi, uyğun olmayan yuyucu vasitə və suyun temperaturu yuma nəticəsinə təsir edir. Bu əlamət hər zaman hissənin dəyişdirilməsi demək deyil; istifadə qaydaları və yuma sistemi birlikdə qiymətləndirilir." },
  { id: "su-qizdirmir", title: "Suyu qızdırmır", heading: "Qabyuyan maşın suyu qızdırmır", text: "İsitmə elementi, temperatur sensoru və elektron idarəetmə sistemində nasazlıq ola bilər. Qabların soyuq və ya yaş qalması barədə müşahidənizi, seçilən proqramı və görünən xəta kodunu bildirin. Elektrik hissələrinə müdaxiləni ustaya həvalə edin." },
  { id: "su-sizmasi", title: "Su sızdırır", heading: "Qabyuyan maşından su axır", text: "Qapı rezini, şlanqlar, su birləşmələri və daxili komponentlərdə problem su sızmasına səbəb ola bilər. Sızma zamanı cihazı işlətməyə davam etməyin. Sızmanın yerini və proqramın hansı mərhələsində yarandığını bildirmək diaqnostikaya kömək edir." },
  { id: "ses-kuy", title: "Qeyri-adi səs çıxarır", heading: "Qabyuyan maşın səs-küylə işləyir", text: "Nasosda yad cisim, mexaniki aşınma və ya hərəkətli hissələrdə problem qeyri-adi səs yarada bilər. Səsin su yığarkən, yuyarkən və ya boşaldarkən eşidildiyini qeyd edin. Mümkünsə, təhlükəsiz məsafədən qısa səs və ya video qeydi göndərin." },
  { id: "proqram-baslamir", title: "Proqram başlamır", heading: "Proqram başlamır və ya yarımçıq dayanır", text: "Qapı kilidi, elektrik təchizatı, sensorlar və idarəetmə elektronikası yoxlanılmalı ola bilər. Ekranın yanıb-yanmadığını, düymələrin cavabını və proqramın dayandığı mərhələni bildirin. Elektron plata nasazlığı yalnız yoxlamadan sonra təsdiqlənə bilər." },
] as const;

export const dishwasherBrandRows = [
  [{ name: "Bosch", slug: "bosch" }, { name: "Siemens", slug: "siemens" }, { name: "Samsung", slug: "samsung" }, { name: "Beko", slug: "beko" }, { name: "LG", slug: "lg" }, { name: "Electrolux", slug: "electrolux" }, { name: "Ariston", slug: "ariston" }],
  [{ name: "Indesit", slug: "indesit" }, { name: "Whirlpool", slug: "whirlpool" }, { name: "AEG", slug: "aeg" }, { name: "Vestel", slug: "vestel" }, { name: "Gorenje", slug: "gorenje" }],
] as const;

export const dishwasherCodeGroups = [
  { brand: "Bosch və Siemens", codes: [{ code: "E15", meaning: "Sızmadan qorunma sisteminin aktivləşməsi ilə əlaqəli ola bilər." }, { code: "E24", meaning: "Su boşaltma sistemində problemə işarə edə bilər." }, { code: "E09", meaning: "Uyğun modellərdə isitmə sisteminin nasazlığını göstərə bilər." }] },
  { brand: "Samsung", codes: [{ code: "4C / 4E", meaning: "Uyğun modellərdə su təchizatı problemi." }, { code: "5C / 5E", meaning: "Uyğun modellərdə suyun boşaldılması ilə bağlı problem." }] },
  { brand: "Electrolux", codes: [{ code: "i10", meaning: "Su girişində problem." }, { code: "i20", meaning: "Suyun boşaldılmasında problem." }, { code: "i30", meaning: "Sızmadan qorunma sisteminin aktivləşməsi." }] },
] as const;

export const dishwasherFaqs = [
  { question: "Qabyuyan maşın suyu boşaltmırsa, nə etməliyəm?", answer: "İstifadəçi təlimatına uyğun olaraq filtrdə və boşaltma şlanqında görünən tıxanmanı yoxlamaq olar. Təhlükəsizlik göstərişlərinə əməl edin, gərginlik altında cihazı sökməyin. Problem davam edərsə, ustaya müraciət edin." },
  { question: "Qabyuyan maşının təmiri nə qədərdir?", answer: "Qiymət nasazlığın səbəbindən, cihazın modelindən və tələb olunan ehtiyat hissələrindən asılıdır. Dəqiq məbləğ diaqnostikadan sonra müəyyən olunur. Görüləcək iş və hissələrin qiyməti təmirə başlamazdan əvvəl razılaşdırılır." },
  { question: "Qabyuyan maşın niyə su qızdırmır?", answer: "İsitmə elementi, temperatur sensoru və ya idarəetmə elektronikasında problem ola bilər. Dəqiq səbəb cihazın modeli və texniki yoxlamanın nəticəsinə əsasən müəyyən edilir." },
  { question: "Qabyuyan maşının platasını təmir etmək mümkündürmü?", answer: "Bəzi nasazlıqlarda komponent səviyyəsində təmir mümkündür. Ciddi zədələnmələrdə modulun dəyişdirilməsi tələb oluna bilər. Təmirin mümkünlüyü və uyğun həll diaqnostikadan sonra dəqiqləşdirilir." },
  { question: "Qabyuyan maşın üçün usta necə çağıra bilərəm?", answer: `${contactConfig.phone} nömrəsinə zəng edə və ya WhatsApp vasitəsilə müraciət edə bilərsiniz. Cihazın markasını, modelini, nasazlığını və xidmət tələb olunan ünvanı bildirin.` },
  { question: "Diaqnostika və zəmanət şərtləri necədir?", answer: "Diaqnostika haqqı, səfər imkanı və mümkün zəmanət şərtləri müraciət zamanı dəqiqləşdirilir. Təmirə başlamazdan əvvəl görüləcək iş, qiymət və razılaşdırılan şərtlərlə tanış olun." },
] as const;

export const dishwasherCareTips = ["Filtri istifadəçi təlimatına uyğun təmizləyin.", "Modelə uyğundursa, qabyuyan duzundan istifadə edin.", "Sprey qollarının dəliklərini və sərbəst hərəkətini yoxlayın.", "Qabları düzgün yerləşdirin və cihazı həddindən artıq yükləməyin.", "İstehsalçının tövsiyə etdiyi yuyucu vasitələri seçin.", "Su sızmasını və qeyri-adi səsləri diqqətsiz qoymayın."] as const;
