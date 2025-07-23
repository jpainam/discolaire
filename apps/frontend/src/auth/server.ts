import "server-only";

import { cache } from "react";
import { headers } from "next/headers";

import { initAuth } from "@repo/auth";

import { env } from "~/env";

export const auth = initAuth({
  secret: env.AUTH_SECRET,
  baseUrl: env.NEXT_PUBLIC_BASE_URL,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
