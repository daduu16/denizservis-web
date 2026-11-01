"use client";

import { T } from "@/components/LanguageProvider";

import Script from "next/script";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { analyticsConsentKey, analyticsContext, analyticsId, eventForLink, trackAnalyticsEvent } from "../lib/analytics";
import styles from "./Analytics.module.css";

const changeEvent = "denizservis:analytics-consent";
function subscribe(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(changeEvent, callback); window.removeEventListener("storage", callback); };
}
function getConsent() {
  try { const value = localStorage.getItem(analyticsConsentKey); return value === "granted" || value === "denied" ? value : null; } catch { return null; }
}
const serverConsent = () => null;

export function Analytics() {
  const consent = useSyncExternalStore(subscribe, getConsent, serverConsent);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const pathname = usePathname();
  const lastView = useRef("");

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("#analytics-preferences")) { setPreferencesOpen(true); return; }
      const anchor = target?.closest("a[href]");
      if (!anchor) return;
      const name = eventForLink(anchor.getAttribute("href") || "", pathname);
      if (name) trackAnalyticsEvent(name, pathname);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  useEffect(() => {
    if (!ready || consent !== "granted" || !analyticsId) { lastView.current = ""; return; }
    if (lastView.current === pathname) return;
    lastView.current = pathname;
    trackAnalyticsEvent("page_view", pathname);
    if (pathname.startsWith("/xidmetler/")) trackAnalyticsEvent("service_page_view", pathname);
  }, [ready, consent, pathname]);

  const choose = (choice: "granted" | "denied") => {
    if (analyticsId) {
      Object.assign(window, { [`ga-disable-${analyticsId}`]: choice !== "granted" });
      if (choice === "denied") {
        // Remove existing GA cookies on this host; do not touch unrelated cookies.
        for (const pair of document.cookie.split(";")) {
          const name = pair.trim().split("=")[0];
          if (name === "_ga" || name.startsWith("_ga_")) {
            for (const domain of ["", `; Domain=${location.hostname}`, `; Domain=.${location.hostname}`]) document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`;
          }
        }
      }
    }
    try { localStorage.setItem(analyticsConsentKey, choice); } catch { /* No stored consent means no analytics. */ }
    window.dispatchEvent(new Event(changeEvent));
    setPreferencesOpen(false);
  };

  if (!analyticsId) return null;
  return <>
    {consent === "granted" && <Script id="denizservis-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`} strategy="afterInteractive" onReady={() => {
      if (getConsent() !== "granted") return;
      window.dataLayer ??= [];
      window.gtag ??= (...args: unknown[]) => { window.dataLayer!.push(args); };
      window.gtag("js", new Date());
      window.gtag("config", analyticsId, { ...analyticsContext(pathname), send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false });
      setReady(true);
    }} />}
    {(consent === null || preferencesOpen) && <aside className={styles.panel} aria-labelledby="analytics-consent-title">
      <h2 id="analytics-consent-title"><T>Analitika seçiminiz</T></h2>
      <p><T>İstifadə statistikasını ölçmək üçün Google Analytics-ə razısınız? Formadakı şəxsi məlumatlar göndərilmir. Seçiminizi Məxfilik səhifəsindən dəyişə bilərsiniz.</T></p>
      <div><button type="button" className="button button--small" onClick={() => choose("granted")}><T>Razıyam</T></button><button type="button" className="button button--small button--secondary" onClick={() => choose("denied")}><T>İstəmirəm</T></button></div>
    </aside>}
  </>;
}
