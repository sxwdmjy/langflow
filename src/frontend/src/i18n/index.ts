import { messages, type TranslationKey } from "./messages";

export const LOCALE_STORAGE_KEY = "lf_locale";

export const SUPPORTED_LOCALES = ["zh-CN", "en-US"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const STRICT_ZH_LOCALE =
  String(import.meta.env.LANGFLOW_I18N_STRICT_ZH).toLowerCase() === "true";

export const DEFAULT_LOCALE: Locale = "zh-CN";
export const SUPPORTED_LOCALE_SET = new Set<Locale>(SUPPORTED_LOCALES);

type TranslationParams = Record<string, string | number>;

export const detectLocale = (value?: string | null): Locale | null => {
  if (!value) {
    return null;
  }
  const normalized = value.toLowerCase();
  if (normalized.startsWith("zh")) {
    return "zh-CN";
  }
  if (normalized.startsWith("en")) {
    return "en-US";
  }
  return null;
};

export const resolveLocale = (value?: string | null): Locale =>
  detectLocale(value) ?? DEFAULT_LOCALE;

export const translate = (
  locale: Locale,
  key: TranslationKey,
  params?: TranslationParams,
): string => {
  let content = messages[locale][key] ?? messages[DEFAULT_LOCALE][key];

  if (!params) {
    return content;
  }

  for (const [token, value] of Object.entries(params)) {
    content = content.split(`{${token}}`).join(String(value));
  }

  return content;
};

export type { TranslationKey } from "./messages";
