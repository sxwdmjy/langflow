import { useCallback } from "react";
import { translate, type TranslationKey } from "@/i18n";
import { useLocaleStore } from "@/stores/localeStore";

type TranslationParams = Record<string, string | number>;

export const useI18n = () => {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  const t = useCallback(
    (key: TranslationKey, params?: TranslationParams) =>
      translate(locale, key, params),
    [locale],
  );

  return { locale, setLocale, t };
};
