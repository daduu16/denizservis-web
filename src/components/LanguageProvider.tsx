"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { isLanguage, languageStorageKey, translate, type Dictionary, type Language } from "@/i18n/language";

const loadDictionary = async (language: Language): Promise<Dictionary> => {
  if (language === "az") return {};
  const [base, blog] = await Promise.all(language === "en"
    ? [import("@/i18n/en.json"), import("@/i18n/blog.en.json")]
    : [import("@/i18n/ru.json"), import("@/i18n/blog.ru.json")]);
  return { ...base.default, ...blog.default };
};

type LanguageContextValue = {
  language: Language;
  pending: boolean;
  changeLanguage: (language: Language) => Promise<void>;
  t: (message: string) => string;
};
const LanguageContext = createContext<LanguageContextValue>({ language: "az", pending: false, changeLanguage: async () => {}, t: (message) => message });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ language: Language; dictionary: Dictionary }>({ language: "az", dictionary: {} });
  const [pending, setPending] = useState(false);
  const request = useRef(0);
  const changeLanguage = useCallback(async (language: Language) => {
    const current = ++request.current;
    setPending(true);
    try {
      const dictionary = await loadDictionary(language);
      if (current !== request.current) return;
      setState({ language, dictionary });
      document.documentElement.lang = language;
      try { localStorage.setItem(languageStorageKey, language); } catch { /* Still works for this visit when storage is unavailable. */ }
    } finally {
      if (current === request.current) setPending(false);
    }
  }, []);

  useEffect(() => {
    const restore = () => {
      try {
        const saved = localStorage.getItem(languageStorageKey);
        if (isLanguage(saved)) void changeLanguage(saved).catch(() => {});
      } catch { /* Azerbaijani is the server-rendered default. */ }
    };
    restore();
    const sync = (event: StorageEvent) => { if (event.key === languageStorageKey) restore(); };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [changeLanguage]);

  const t = useCallback((message: string) => translate(message, state.dictionary, siteConfig.phone), [state.dictionary]);
  return <LanguageContext.Provider value={{ language: state.language, pending, changeLanguage, t }}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);

// Server Components retain their HTML/SEO output; this small text boundary updates via React.
export function T({ children, context }: { children: string; context?: string }) {
  const { t } = useLanguage();
  const result = t(context ?? children);
  return context && result === context ? t(children) : result;
}
