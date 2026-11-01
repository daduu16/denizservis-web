import { contactConfig } from "./contact";

export const canonicalOrigin = "https://denizservis.az";

type DeploymentEnvironment = { NODE_ENV?: string; NEXT_PUBLIC_DEPLOYMENT_ENV?: string; CF_PAGES?: string; CF_PAGES_BRANCH?: string; NEXT_PUBLIC_PRODUCTION_BRANCH?: string };

export function isIndexableDeployment(env: DeploymentEnvironment): boolean {
  if (env.CF_PAGES === "1" && env.CF_PAGES_BRANCH !== (env.NEXT_PUBLIC_PRODUCTION_BRANCH || "prod")) return false;
  if (env.NEXT_PUBLIC_DEPLOYMENT_ENV) return env.NEXT_PUBLIC_DEPLOYMENT_ENV === "production";
  if (env.CF_PAGES === "1") return env.CF_PAGES_BRANCH === (env.NEXT_PUBLIC_PRODUCTION_BRANCH || "prod");
  return env.NODE_ENV === "production";
}

export const indexableDeployment = isIndexableDeployment({
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NEXT_PUBLIC_DEPLOYMENT_ENV,
  CF_PAGES: process.env.CF_PAGES,
  CF_PAGES_BRANCH: process.env.CF_PAGES_BRANCH,
  NEXT_PUBLIC_PRODUCTION_BRANCH: process.env.NEXT_PUBLIC_PRODUCTION_BRANCH,
});

// Only published pages belong here. Add real content before activating another route.
export const seoPages = [
  { path: "/", title: "Paltaryuyan və Qabyuyan Təmiri | DənizServis", description: `Bakıda paltaryuyan və qabyuyan təmiri üçün DənizServis ilə əlaqə saxlayın. Nasazlığı, marka və modeli bildirin. Zəng və WhatsApp: ${contactConfig.phone}.` },
  { path: "/xidmetler/paltaryuyan-temiri", title: "Bakıda Paltaryuyan Maşın Təmiri | DənizServis", description: `Bakıda paltaryuyan maşın təmiri: su boşaltma, sıxma, baraban və elektron plata nasazlıqları. Marka və modeli bildirin. DənizServis: ${contactConfig.phone}.` },
  { path: "/xidmetler/qabyuyan-temiri", title: "Bakıda Qabyuyan Maşın Təmiri | DənizServis", description: `Bakıda qabyuyan maşın təmiri: su boşaltma, isitmə və elektron plata nasazlıqları. Marka və modeli bildirin. DənizServis: ${contactConfig.phone}.` },
  { path: "/elaqe", title: "Əlaqə və Usta Sifarişi | DənizServis", description: `DənizServis ilə əlaqə: ${contactConfig.phone}. Bakıda paltaryuyan və qabyuyan təmiri üçün zəng edin, WhatsApp-a yazın və xidmət şərtlərini dəqiqləşdirin.` },
  { path: "/haqqimizda", title: "DənizServis Haqqında | Məişət Texnikası Təmiri", description: "DənizServis-in paltaryuyan və qabyuyan təmirinə yanaşması: diaqnostika, aydın məlumatlandırma və razılaşdırılmış iş. Xidmət imkanını bizimlə dəqiqləşdirin." },
] as const;

export type PublicPagePath = (typeof seoPages)[number]["path"];
