import { create } from "zustand";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  resolveLocale,
  STRICT_ZH_LOCALE,
  SUPPORTED_LOCALE_SET,
  type Locale,
} from "@/i18n";

type LocaleStore = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const getInitialLocale = (): Locale => {
  if (STRICT_ZH_LOCALE) {
    return "zh-CN";
  }

  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (storedLocale && SUPPORTED_LOCALE_SET.has(storedLocale as Locale)) {
    return storedLocale as Locale;
  }

  return resolveLocale(window.navigator.language);
};

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: getInitialLocale(),
  setLocale: (locale) => {
    if (STRICT_ZH_LOCALE) {
      return;
    }
    set({ locale });
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
  },
}));
