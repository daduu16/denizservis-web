import { contactConfig } from "../config/contact";

export const washingMachineContent = {
  path: "/xidmetler/paltaryuyan-temiri",
  title: "Paltaryuyan Maşın Təmiri - DənizServis",
  lead: "Su boşalmır, paltarlar sıxılmır və ya maşın güclü səs çıxarır? Problemi bizə bildirin.",
  metaTitle: "Bakıda Paltaryuyan Maşın Təmiri | DənizServis",
  description: `Bakıda paltaryuyan maşın təmiri: su boşaltma, sıxma, baraban və elektron plata nasazlıqları. Marka və modeli bildirin. DənizServis: ${contactConfig.phone}.`,
  updated: "2026-11-01",
} as const;

export const washingMachineProblems = [
  { id: "su-bosaltmir", title: "Suyu boşaltmır", heading: "Paltaryuyan maşın suyu boşaltmır", text: "Yuma başa çatsa da, barabanda su qalırsa, filtrin tutulması, boşaltma şlanqında tıxanma və ya drenaj nasosunun nasazlığı mümkün səbəblərdir. Suyun çıxış yolu və nasosun fəaliyyəti birlikdə yoxlanılır. Təkcə bu əlamət nasosun dəyişdirilməli olduğunu göstərmir." },
  { id: "sixmir", title: "Paltarları sıxmır", heading: "Paltaryuyan maşın paltarları sıxmır", text: "Paltarlar həddindən artıq yaş qalırsa, əvvəlcə seçilən proqram və yükün balansı nəzərə alınır. Suyun boşalmaması, mühərrik və ya elektron idarəetmə sistemində problem də sıxmanı dayandıra bilər. Nasazlığın hansı mərhələdə yarandığını bildirmək yoxlamaya kömək edir." },
  { id: "ses-kuy", title: "Güclü səs çıxarır", heading: "Paltaryuyan maşın güclü səs çıxarır", text: "Metal səsi, döyüntü və ya qeyri-adi uğultu podşipniklərin aşınması, barabana yad cismin düşməsi və ya amortizator problemi ilə bağlı ola bilər. Güclü səs olduqda cihazı işlətməyə davam etməyin. Səsin yuma və ya sıxma zamanı eşidildiyini qeyd edin." },
  { id: "su-sizmasi", title: "Su axıdır", heading: "Paltaryuyan maşından su axır", text: "Qapı manjetinin zədələnməsi, şlanq birləşmələri, nasos və digər hissələrdə problem su sızmasına səbəb ola bilər. Cihazın altından, qapıdan və ya yuyucu vasitə bölməsindən su gəldiyini bildirin. Sızma varsa, istifadəyə davam etməyin və təhlükəsizlik göstərişlərinə əməl edin." },
  { id: "su-goturmur", title: "Su götürmür", heading: "Paltaryuyan maşın su götürmür", text: "Bağlı su kranı, giriş filtrində tıxanma, su giriş klapanı və sensor nasazlığı mümkün səbəblərdir. Su təchizatı, marka, model və görünən xəta kodu yoxlama istiqamətini dəqiqləşdirməyə kömək edir. Dəqiq səbəb texniki yoxlamadan sonra məlum olur." },
  { id: "baraban-firlanmir", title: "Baraban fırlanmır", heading: "Paltaryuyan maşının barabanı fırlanmır", text: "Mühərrik, uyğun modellərdə ötürücü kəmər, idarəetmə modulu və ya baraban mexanizmində problem ola bilər. Müxtəlif mühərrik texnologiyalarının quruluşu eyni deyil. Hissə dəyişdirilməsinə qərar verilməzdən əvvəl cihazın modeli və mexanizmin fəaliyyəti yoxlanılır." },
  { id: "qapi-acilmir", title: "Qapısı açılmır", heading: "Paltaryuyan maşının qapısı açılmır", text: "İçəridə su qalması, qapı kilidi mexanizmi və ya elektrik sistemi qapının açılmasına mane ola bilər. Qapını güclə açmayın və kilidi keçməyə çalışmayın. Proqram bitdikdən sonra modelin təlimatında göstərilən gözləmə müddətinə əməl edin; problem davam edərsə, ustaya bildirin." },
  { id: "su-qizdirmir", title: "Suyu qızdırmır", heading: "Paltaryuyan maşın suyu qızdırmır", text: "İsitmə elementi (TEN), temperatur sensoru və ya idarəetmə modulu suyun seçilmiş temperatura çatmamasına səbəb ola bilər. Soyuq yuma proqramı ilə nasazlığı fərqləndirmək vacibdir. Seçilən proqramı və xəta kodunu bildirin; elektrik hissələrinə müdaxiləni ustaya həvalə edin." },
  { id: "guclu-titreyir", title: "Güclü titrəyir", heading: "Paltaryuyan maşın titrəyir və yerindən hərəkət edir", text: "Cihazın səviyyəsiz yerləşdirilməsi, yükün qeyri-bərabər paylanması və amortizatorların zəifləməsi vibrasiya yarada bilər. Yeni quraşdırılmış maşında daşınma bərkidiciləri də təlimata uyğun yoxlanılmalıdır. Güclü hərəkət və zərbə varsa, cihazı dayandırıb problemi yoxlatdırın." },
  { id: "proqram-baslamir", title: "Proqram işləmir", heading: "Paltaryuyan maşın açılmır və ya proqramı tamamlamır", text: "Elektrik qidalanması, qapı kilidi, sensorlar və elektron plata ilə bağlı problem cihazın işə düşməməsinə və ya proqramın yarımçıq dayanmasına səbəb ola bilər. Ekranın vəziyyətini və proqramın dayandığı mərhələni qeyd edin. Elektron plata nasazlığı yalnız yoxlamadan sonra təsdiqlənə bilər." },
] as const;

// Reuse existing original brand artwork; other supplied brands remain in the page copy.
export const washingMachineBrandRows = [
  [{ name: "Samsung", slug: "samsung" }, { name: "LG", slug: "lg" }, { name: "Bosch", slug: "bosch" }, { name: "Siemens", slug: "siemens" }, { name: "Beko", slug: "beko" }, { name: "Ariston", slug: "ariston" }],
  [{ name: "Indesit", slug: "indesit" }, { name: "Electrolux", slug: "electrolux" }, { name: "Whirlpool", slug: "whirlpool" }, { name: "AEG", slug: "aeg" }, { name: "Vestel", slug: "vestel" }, { name: "Gorenje", slug: "gorenje" }],
] as const;

// Meanings are model-dependent. References are retained for maintenance, not displayed as a sources accordion.
export const washingMachineCodeSources = [
  "https://www.samsung.com/us/support/troubleshoot/TSG10000997/",
  "https://www.lg.com/za/support/product-support/troubleshoot/help-library/cs-CT52008881-20153476964934/",
  "https://www.bosch-home.com/us/en/c/spotlight/blt341dacb48f00c362/owner-support/error-codes/washers",
  "https://media3.bosch-home.com/Documents/9000867147_A.pdf",
] as const;

export const washingMachineCodeGroups = [
  { brand: "Samsung", codes: [{ code: "4C / 4E", meaning: "Uyğun modellərdə su təchizatı problemi." }, { code: "5C / 5E", meaning: "Suyun boşaldılması ilə bağlı problem." }, { code: "UE / Ub", meaning: "Barabanda yük balansının pozulması." }, { code: "dC / dE", meaning: "Uyğun modellərdə qapı və ya kilid problemi; dC bəzi modellərdə balans xətası da ola bilər." }] },
  { brand: "LG", codes: [{ code: "OE", meaning: "Suyun boşaldılmasında problem." }, { code: "UE", meaning: "Yük balansının düzgün olmaması." }, { code: "dE", meaning: "Qapının bağlanması və ya kilidlənməsi ilə bağlı xəta." }, { code: "IE", meaning: "Su girişində problem." }] },
  { brand: "Bosch və Siemens", codes: [{ code: "E17 / F17", meaning: "Uyğun modellərdə su girişində problem." }, { code: "E18 / F18", meaning: "Su boşaltma sistemində problem." }, { code: "F21", meaning: "Müəyyən modellərdə mühərrik və ya onun idarə edilməsi ilə bağlı xəta." }] },
] as const;

export const washingMachineCareTips = [
  "İstehsalçının göstərdiyi maksimum yük həddini aşmayın.",
  "Yuyucu vasitəni düzgün dozada istifadə edin.",
  "Təhlükəsizdirsə, yumadan sonra qapını aralı saxlayın; uşaqları və heyvanları cihazdan uzaq tutun.",
  "Filtri yalnız modelin təlimatına və təhlükəsizlik göstərişlərinə uyğun təmizləyin.",
  "Maşının düz və sabit səthdə yerləşdiyinə əmin olun.",
  "Geyimə və modelə uyğun yuma proqramını seçin.",
  "Barabanı təlimatda göstərilən təmizləmə proqramı ilə təmizləyin.",
  "Qeyri-adi səs, güclü vibrasiya və su sızmasını diqqətsiz qoymayın.",
] as const;

export const washingMachineFaqs = [
  { question: "Paltaryuyan maşın suyu niyə boşaltmır?", answer: "Filtrin tutulması, drenaj şlanqında tıxanma, nasos və ya idarəetmə sistemində problem ola bilər. Dəqiq səbəb texniki yoxlama ilə müəyyən edilir. Cihazı sökmədən əvvəl istifadəçi təlimatındakı təhlükəsizlik göstərişlərinə əməl edin." },
  { question: "Paltaryuyan maşın sıxmırsa, nə etməliyəm?", answer: "Seçilən proqramı və barabandakı yükün balansını təlimata uyğun yoxlayın. Problem davam edərsə, su boşaltma sistemi, mühərrik və digər hissələrin yoxlanılması lazım ola bilər." },
  { question: "Paltaryuyan maşının təmiri neçə manatdır?", answer: "Qiymət nasazlıqdan, cihazın modelindən və ehtiyat hissələrinə ehtiyacdan asılıdır. Dəqiq məbləğ diaqnostikadan sonra bildirilir. Diaqnostika və səfər haqqını, görüləcək işi və mümkün zəmanət şərtlərini əvvəlcədən dəqiqləşdirin." },
  { question: "Paltaryuyan maşın çox səs çıxarırsa, işlətmək olarmı?", answer: "Güclü metal səsi, zərbə və ya qeyri-adi vibrasiya varsa, cihazın istifadəsini dayandırıb problemi yoxlatmaq daha təhlükəsizdir. İşlətməyə davam etmək əlavə zədələnməyə səbəb ola bilər." },
  { question: "Paltaryuyan maşının platasını dəyişmədən təmir etmək mümkündürmü?", answer: "Bəzi hallarda komponent səviyyəsində təmir mümkündür. Elektron modulun vəziyyəti, hissələrin mövcudluğu və təmirin məqsədəuyğunluğu yoxlanılır. Təmir və ya dəyişdirmə qərarı diaqnostikadan sonra verilir." },
  { question: "Samsung paltaryuyanda 4C xəta kodu nə deməkdir?", answer: "Bir çox Samsung modelində 4C su girişində problemi bildirir. Su təchizatı, giriş şlanqı və filtr ilə bağlı ola bilər. Dəqiq izah üçün cihazın model nömrəsi və həmin modelin istifadəçi təlimatı yoxlanmalıdır." },
  { question: "Paltaryuyan maşın üçün necə usta çağıra bilərəm?", answer: `DənizServis-in ${contactConfig.phone} nömrəsinə zəng edə və ya WhatsApp vasitəsilə müraciət edə bilərsiniz. Markanı, modeli, nasazlığı və xidmət tələb olunan ünvanı bildirin, xidmət imkanları əvvəlcədən dəqiqləşdirilsin.` },
] as const;
