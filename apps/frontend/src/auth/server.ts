import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { initAuth } from "@repo/auth";

import { env } from "~/env";

const baseUrl = env.NEXT_PUBLIC_BASE_URL;

export const auth = initAuth({
  baseUrl,
  productionUrl: env.NEXT_PUBLIC_BASE_URL,
  secret: env.AUTH_SECRET,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);
