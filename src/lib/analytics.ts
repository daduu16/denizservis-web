import { canonicalOrigin, seoPages } from "../config/seo";

export const analyticsConsentKey = "denizservis.analytics-consent.v1";
export type AnalyticsEvent = "page_view" | "phone_click" | "whatsapp_click" | "service_page_view" | "contact_form_submit" | "youtube_open" | "service_cta_click";
export const validAnalyticsId = (value: string | undefined) => /^G-[A-Z0-9]{6,}$/.test(value || "") ? value! : null;
export const analyticsId = validAnalyticsId(process.env.NEXT_PUBLIC_GA_ID);

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; }
}

export function analyticsContext(path: string) {
  // Never send arbitrary URLs, queries, fragments, titles, labels or form values.
  const clean = path.split(/[?#]/)[0];
  if (!seoPages.some((page) => page.path === clean) && clean !== "/mexfilik") return null;
  return { page_location: `${canonicalOrigin}${clean}`, page_referrer: "", service: clean.includes("paltaryuyan-temiri") ? "washing_machine" : clean.includes("qabyuyan-temiri") ? "dishwasher" : "general" };
}

export function eventForLink(href: string, path: string): AnalyticsEvent | null {
  if (href.startsWith("tel:")) return "phone_click";
  try {
    const url = new URL(href, `${canonicalOrigin}${path}`);
    if (url.hostname === "wa.me") return "whatsapp_click";
    if (["www.youtube.com", "youtube.com", "youtu.be"].includes(url.hostname)) return "youtube_open";
    if (url.origin === canonicalOrigin && (url.hash === "#sifaris" || url.pathname === "/elaqe")) return "service_cta_click";
  } catch { /* Invalid links are not tracked. */ }
  return null;
}

export function trackAnalyticsEvent(name: AnalyticsEvent, path?: string) {
  if (typeof window === "undefined" || !analyticsId) return;
  try { if (localStorage.getItem(analyticsConsentKey) !== "granted") return; } catch { return; }
  const context = analyticsContext(path ?? window.location.pathname);
  if (context) window.gtag?.("event", name, context);
}
