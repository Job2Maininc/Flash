export const LOCALES = ["en", "de"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "flash_locale";

export const LOCALE_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 365;

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  de: "DE",
};

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "de";
}
