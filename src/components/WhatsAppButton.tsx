"use client";

import { T, useLanguage } from "@/components/LanguageProvider";
import { siteConfig, whatsappHref } from "@/config/site";

export function WhatsAppButton({ variant = "floating", text = "WhatsApp ilə Yazın" }: { variant?: "floating" | "inline"; text?: string }) {
  const { t } = useLanguage();
  const href = whatsappHref(siteConfig.whatsapp);
  const isInline = variant === "inline";
  const buttonClassName = `whatsapp-button${isInline ? " whatsapp-button--inline" : ""}`;
  const label = t(href ? text : "WhatsApp nömrəsi əlavə ediləcək");
  const content = (
    <>
      <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M27.6 15.7A11.6 11.6 0 0 1 10.4 26L4 27.8l1.8-6.2A11.6 11.6 0 1 1 27.6 15.7Z" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" />
        <path d="m11.1 9.9 1.6 3.3-1.4 1.7c1.2 2.4 3 4.2 5.4 5.3l1.7-1.4 3.3 1.6c.1 1.4-.8 2.6-2.2 2.8-4.5-.1-10.4-5.8-10.7-10.5-.1-1.3.9-2.6 2.3-2.8Z" fill="currentColor" />
      </svg>
      {isInline && <span><T>{label}</T></span>}
    </>
  );

  return (
    <div className={isInline ? "hero-whatsapp" : "floating-whatsapp"} title={label}>
      {href ? (
        <a href={href} className={buttonClassName} target="_blank" rel="noopener noreferrer" aria-label={`${label} — ${t("yeni pəncərədə açılır")}`}>
          {content}
        </a>
      ) : (
        <button type="button" className={buttonClassName} disabled aria-label={label}>
          {content}
        </button>
      )}
      {!isInline && <span className="whatsapp-tooltip" aria-hidden="true"><T>{label}</T></span>}
    </div>
  );
}
