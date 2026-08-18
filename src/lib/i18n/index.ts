import type { Locale } from "./config";
import { DEFAULT_LOCALE } from "./config";
import { de } from "./de";
import { en, type Dictionary } from "./en";

const dictionaries: Record<Locale, Dictionary> = {
  en: en as Dictionary,
  de,
};

export function getDictionary(locale: Locale | null | undefined): Dictionary {
  return dictionaries[locale ?? DEFAULT_LOCALE] ?? dictionaries[DEFAULT_LOCALE];
}

export function interpolate(
  template: string,
  vars: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? "");
}

export type { Dictionary };
export { en, de };
