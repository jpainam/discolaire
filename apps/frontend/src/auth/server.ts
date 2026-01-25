import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { initAuth } from "@repo/auth";

import { env } from "~/env";
import { getRequestBaseUrl } from "~/lib/base-url.server";

export const getAuth = cache(async (requestHeaders?: Headers) => {
  const heads = requestHeaders ?? (await headers());
  const tenantFromHeader = heads.get("discolaire-tenant");
  const defaultTenant = env.DEFAULT_TENANT;
  if (!tenantFromHeader) {
    if (!defaultTenant) {
      throw new Error(
        "Missing discolaire-tenant header and NEXT_PUBLIC_DEFAULT_TENANT is not set.",
      );
    }
    console.warn(
      "Missing discolaire-tenant header; falling back to NEXT_PUBLIC_DEFAULT_TENANT.",
    );
  }
  const tenant = tenantFromHeader ?? defaultTenant;
  if (!tenant) {
    throw new Error("Tenant could not be determined.");
  }
  const baseUrl = await getRequestBaseUrl(heads);
  return initAuth({
    secret: env.AUTH_SECRET,
    baseUrl,
    tenant,
  });
});

export const getSession = cache(async () => {
  const heads = await headers();
  const auth = await getAuth(heads);
  return auth.api.getSession({ headers: heads });
});
