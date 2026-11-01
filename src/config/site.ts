import { canonicalOrigin } from "./seo";
import { contactConfig } from "./contact";

export const siteConfig = {
  name: "DənizServis",
  description:
    "Paltaryuyan və qabyuyan təmiri üçün rahat müraciət və peşəkar servis xidməti.",
  url: canonicalOrigin,
  phone: contactConfig.phone,
  whatsapp: contactConfig.whatsapp,
  email: contactConfig.email,
  socialLinks: contactConfig.socialLinks,
  serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA?.trim() || "Bakı",
  workingHours: process.env.NEXT_PUBLIC_WORKING_HOURS?.trim() || null,
} as const;

export const navigation = [
  { label: "Əsas səhifə", href: "/" },
  { label: "Xidmətlər", href: "/#xidmetler" },
  { label: "İşlərimiz", href: "/#islerimiz" },
  { label: "Niyə biz?", href: "/#niye-biz" },
  { label: "Əlaqə", href: "/elaqe" },
] as const;

export function normalizePhone(value: string | null) {
  if (!value) return null;
  const normalized = value.replace(/[^\d+]/g, "");
  if (normalized.startsWith("00")) return `+${normalized.slice(2)}`;
  if (normalized.startsWith("+")) return normalized;
  if (normalized.startsWith("0")) return `+994${normalized.slice(1)}`;
  return normalized.startsWith("994") ? `+${normalized}` : `+${normalized}`;
}

export function whatsappHref(value: string | null) {
  const phone = normalizePhone(value);
  return phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : null;
}
