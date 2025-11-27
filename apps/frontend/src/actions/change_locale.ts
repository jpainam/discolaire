"use server";

import type { Locale } from "next-intl";
import { cookies } from "next/headers";

export async function changeLocaleAction(locale: Locale) {
  const store = await cookies();
  store.set("x-lang", locale);
}

export async function changeScaledThemeAction(isScaled: boolean) {
  const store = await cookies();
  if (isScaled) {
    store.set("theme-scaled", "true");
  } else {
    store.set("theme-scaled", "false");
  }
}
