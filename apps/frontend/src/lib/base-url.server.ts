import "server-only";

import { headers } from "next/headers";

export async function getRequestBaseUrl(requestHeaders?: Headers) {
  const heads = requestHeaders ?? (await headers());
  const protocol = heads.get("x-forwarded-proto") ?? "http";
  const host = heads.get("x-forwarded-host") ?? heads.get("host");

  if (host) {
    return `${protocol}://${host}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return `http://localhost:${process.env.PORT ?? 3000}`;
}
