"use client";

import { ChevronDown, Globe, LoaderCircle } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { languages } from "@/i18n/language";
import { useLanguage } from "./LanguageProvider";
import styles from "./LanguageSwitcher.module.css";
import { focusMovedOutside } from "../lib/mobile-menu";

function focusChoice(button: HTMLButtonElement | undefined | null) {
  button?.focus({ preventScroll: true });
  const panel = button?.closest<HTMLElement>(".mobile-menu");
  if (!button || !panel) return;
  const bounds = panel.getBoundingClientRect();
  const item = button.getBoundingClientRect();
  if (item.bottom > bounds.bottom - 8) panel.scrollTop += item.bottom - bounds.bottom + 8;
  else if (item.top < bounds.top + 8) panel.scrollTop += item.top - bounds.top - 8;
}

export function LanguageSwitcher({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { language, pending, changeLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const keyboardOpening = useRef(false);
  const id = useId();
  const current = languages.find((item) => item.code === language)!;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  const focusOption = (index: number) => focusChoice(root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]')[index]);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") setOpen(false);
    if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); setOpen(false); trigger.current?.focus({ preventScroll: true }); }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) { keyboardOpening.current = true; setOpen(true); return; }
      const items = [...(root.current?.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]') ?? [])];
      const active = items.indexOf(document.activeElement as HTMLButtonElement);
      const next = event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : (active + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      focusOption(next);
    }
  };

  useEffect(() => {
    // Touch opening must not blur the trigger or scroll the menu before a tap.
    if (open && (variant === "desktop" || keyboardOpening.current)) focusChoice(root.current?.querySelector<HTMLButtonElement>('[aria-checked="true"]'));
  }, [open, variant]);

  return <div className={`${styles.root} ${variant === "mobile" ? styles.mobile : styles.desktop}`} ref={root} onKeyDown={onKeyDown} onBlur={(event) => {
    if (focusMovedOutside(event.currentTarget, event.relatedTarget)) setOpen(false);
  }}>
    <button ref={trigger} type="button" className={styles.trigger} aria-label={`${t("Dil seçimi")}: ${current.name}`} aria-haspopup="menu" aria-expanded={open} aria-controls={open ? id : undefined} aria-busy={pending} onClick={(event) => { keyboardOpening.current = event.detail === 0; setOpen((value) => !value); }}>
      {pending ? <LoaderCircle size={20} className="animate-spin" aria-hidden="true" /> : <Globe size={21} aria-hidden="true" />}
      <span className={styles.fullName} lang={current.code}>{current.name}</span><span className={styles.shortName} aria-hidden="true">{current.short}</span>
      <ChevronDown size={15} className={`${styles.chevron} ${open ? styles.expanded : ""}`} aria-hidden="true" />
    </button>
    {open && <div id={id} role="menu" aria-label={t("Dil seçimi")} className={styles.menu}>
      {languages.map((item) => <button key={item.code} type="button" role="menuitemradio" tabIndex={-1} aria-checked={language === item.code} lang={item.code} className={styles.option} onClick={() => {
        setOpen(false); trigger.current?.focus({ preventScroll: true }); setError(false);
        void changeLanguage(item.code).catch(() => setError(true));
      }}><span>{item.name}</span><span className={styles.dot} aria-hidden="true" /></button>)}
    </div>}
    {error && <span className={styles.error} role="alert">{t("Dil yüklənmədi. Yenidən cəhd edin.")}</span>}
    <span className="sr-only" role="status" aria-live="polite">{pending ? t("Dil dəyişdirilir...") : ""}</span>
  </div>;
}
