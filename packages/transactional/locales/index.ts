import en from "./en.json";
import es from "./es.json";
import fr from "./fr.json";

export type SupportedLocale = "en" | "fr" | "es";
type TranslationKeys = keyof typeof en;

interface Options {
  locale?: string;
  fallbackLocale?: SupportedLocale;
}

const LOCALES = {
  en,
  fr,
  es,
} as const;

function translations(locale: string): typeof en {
  const l = locale as SupportedLocale;
  return LOCALES[l];
}

export function geti18n(options: Options = {}) {
  const { locale = "en", fallbackLocale = "en" } = options;
  const languages = translations(locale);
  const fallbackLanguages = translations(fallbackLocale);

  function doTranslate(
    key: TranslationKeys,
    params?: Record<string, string | number>,
  ): string {
    const translation = languages[key] || fallbackLanguages[key];

    if (!translation) {
      console.warn(
        `Translation key "${key}" not found in "${locale}" or fallback locale`,
      );
      return key;
    }

    if (!params) {
      return translation;
    }

    try {
      return Object.entries(params).reduce(
        (acc, [param, value]) =>
          acc.replace(new RegExp(`{{${param}}}`, "g"), value.toString()),
        translation,
      );
    } catch (error) {
      console.error(`Error interpolating translation`, error);
      return translation;
    }
  }

  return {
    t: doTranslate,
    currentLocale: locale,
  };
}
