/* eslint-disable @typescript-eslint/no-explicit-any */

import acceptLanguage from "accept-language";
import type { i18n, TFunction } from "i18next";
import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { cookies as getCookies, headers as getHeaders } from "next/headers";
import { cache } from "react";
import { initReactI18next } from "react-i18next/initReactI18next";

import "server-only";

import { fallbackLng, getOptions, languages } from "./settings";

const initServerI18next = async (language: any, ns: any): Promise<i18n> => {
  const i18nInstance = createInstance();
  await i18nInstance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: any, ns: any) => import(`./locales/${language}/${ns}.json`)
      )
    )
    .init(getOptions(language, ns));
  return i18nInstance;
};

acceptLanguage.languages(languages);

const cookieName = "i18next";

export async function detectLanguage() {
  const cookies = await getCookies();
  const headers = await getHeaders();

  // here we can read the session data
  // const session = await getSession();

  let language;
  if (!language && cookies.has(cookieName)) {
    language = acceptLanguage.get(cookies.get(cookieName)?.value);
  }
  if (!language) {
    language = acceptLanguage.get(headers.get("Accept-Language"));
  }
  if (!language) {
    language = fallbackLng;
  }
  return language;
}

export const getServerTranslations: (
  ns?: any,
  options?: { keyPrefix?: string }
) => Promise<{
  t: TFunction<string, unknown>;
  i18n: i18n;
}> = cache(async (ns: any = "common", options: { keyPrefix?: string } = {}) => {
  const language = await detectLanguage();
  const i18nextInstance = await initServerI18next(language, ns);
  return {
    t: i18nextInstance.getFixedT(
      language,
      Array.isArray(ns) ? ns[0] : ns,
      options.keyPrefix
    ),
    i18n: i18nextInstance,
  };
});
