/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = (await cookies()).get("x-lang")?.value ?? "fr";
  return {
    locale,
    messages: (await import(`./locales/${locale}/common.json`)).default,
  };
});
