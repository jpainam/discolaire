import { useMemo } from "react";
import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next, I18nextProvider as Provider } from "react-i18next";

import { getOptions } from "./settings";

void i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: any, namespace: any) =>
        import(`./locales/${language}/${namespace}.json`),
    ),
  )
  .init({
    ...getOptions(),
    detection: {
      caches: ["cookie"],
    },
  });

export function I18nProvider({
  children,
  language,
}: {
  children: any;
  language: string;
}) {
  useMemo(() => {
    void i18next.changeLanguage(language);
  }, [language]);
  return <Provider i18n={i18next}>{children}</Provider>;
}
