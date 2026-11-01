export function formatPhoneDisplay(value: string): string {
  const digits = value.replace(/\D/g, "");
  const international = /^0\d{9}$/.test(digits) ? `994${digits.slice(1)}` : digits;
  return /^994\d{9}$/.test(international)
    ? `+994 ${international.slice(3, 5)} ${international.slice(5, 8)} ${international.slice(8, 10)} ${international.slice(10)}`
    : value.trim();
}

const defaultPhone = "+994 70 552 20 21";
export const contactConfig = {
  email: "info@denizservis.az",
  socialLinks: [
    { name: "Instagram", url: "https://www.instagram.com/paltaryuyan_masin_temir_/", icon: "instagram" },
    { name: "YouTube", url: "https://www.youtube.com/@denizservis1", icon: "youtube" },
    { name: "TikTok", url: "https://www.tiktok.com/@paltaryuyanmasin_temiri", icon: "tiktok" },
  ],
  phone: formatPhoneDisplay(process.env.NEXT_PUBLIC_BUSINESS_PHONE?.trim() || defaultPhone),
  whatsapp: formatPhoneDisplay(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() || defaultPhone),
} as const;
