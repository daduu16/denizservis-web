import { Droplets, MessageCircle, Search, ShieldCheck, Sparkles } from "lucide-react";

export const services = [
  {
    slug: "paltaryuyan-temiri",
    title: "Paltaryuyan təmiri",
    shortDescription:
      "Paltaryuyan maşınlarda yaranan nasazlıqların yoxlanılması və peşəkar təmiri.",
    image: "/images/paltaryuyan.png",
    alt: "Ağ rəngli paltaryuyan maşın",
    symptoms: [
      "Su yığmır və ya suyu boşaltmır",
      "Baraban dönmür və ya qeyri-adi səs gəlir",
      "Proqram başlamır və ya yarımçıq dayanır",
      "Qapı açılmır və ya tam kilidlənmir",
      "Cihazdan su sızır",
      "Ekranda xəta kodu görünür",
    ],
    Icon: Droplets,
  },
  {
    slug: "qabyuyan-temiri",
    title: "Qabyuyan təmiri",
    shortDescription:
      "Qabyuyan maşınların diaqnostikası, nasazlıq səbəbinin müəyyənləşdirilməsi və təmiri.",
    image: "/images/qabyuyan.png",
    alt: "Qapısı açıq qabyuyan maşın",
    symptoms: [
      "Qablar tam təmizlənmir",
      "Su cihazda qalır və ya boşalmır",
      "Proqram işə düşmür",
      "Qurudulma düzgün işləmir",
      "Cihazdan su sızır",
      "Ekranda xəta kodu görünür",
    ],
    Icon: Sparkles,
  },
] as const;

export const benefits = [
  {
    title: "Problemi paylaşın",
    description: "Bir mesaj, foto və ya xəta kodu ilə başlayın.",
    detail: "WhatsApp-da cihazın markasını, modelini və müşahidə etdiyiniz problemi yazın. Foto və ya qısa video əlamətləri anlamağa kömək edə bilər.",
    Icon: MessageCircle,
  },
  {
    title: "Səbəbi dəqiqləşdirək",
    description: "Təxminlə deyil, cihazın yoxlanılması ilə.",
    detail: "Paltaryuyan və qabyuyan maşının əlamətləri yoxlanılır. Dəqiq nasazlıq, görüləcək iş və ehtiyat hissəsinə ehtiyac diaqnostikadan sonra müəyyənləşdirilir.",
    Icon: Search,
  },
  {
    title: "Növbəti addımı razılaşdıraq",
    description: "Görüləcək iş və qiymət barədə aydın məlumat.",
    detail: "Təmirin həcmi, qiyməti və mümkün müddəti barədə məlumatı dəqiqləşdirin. İşə başlamazdan əvvəl təklif olunan həll və şərtlərlə tanış olun.",
    Icon: ShieldCheck,
  },
] as const;

export const faqs = [
  {
    question: "Usta sifarişini necə verə bilərəm?",
    answer:
      "Bir neçə sadə addımla başlayaq: adınızı, telefonunuzu və cihaz növünü formaya yazıb göndərin. Müraciətiniz servis komandamıza çatacaq, təmirin detallarını isə sizinlə birlikdə dəqiqləşdirəcəyik. İstəsəniz, WhatsApp-da da yaza bilərsiniz.",
  },
  {
    question: "Hansı rayonlara xidmət göstərilir?",
    answer:
      "Bakının bütün rayonlarına - Nərimanov, Yasamal, Nəsimi, Xətai, Nizami, Binəqədi, Sabunçu, Suraxanı, Xəzər, Səbail, Qaradağ - həmçinin Sumqayıt, Xırdalan, Masazır və Abşeron qəsəbələrinə gəlirik.",
  },
  {
    question: "Təmirin qiyməti necə müəyyən olunur?",
    answer:
      "Qiymət nasazlığın növünə, görüləcək işə və ehtiyat hissəsi ehtiyacına görə dəyişir. Dəqiq məlumat diaqnostikadan sonra təqdim olunur.",
  },
  {
    question: "Diaqnostika necə aparılır?",
    answer:
      "Usta cihazın əlamətlərini yoxlayır, nasazlığın mümkün səbəbini müəyyənləşdirir və görüləcək iş barədə məlumat verir.",
  },
  {
    question: "Təmir nə qədər vaxt aparır?",
    answer:
      "Müddət nasazlığın mürəkkəbliyindən və ehtiyat hissəsinin mövcudluğundan asılıdır. Yoxlamadan əvvəl konkret müddət vəd edilmir.",
  },
] as const;
