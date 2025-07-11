import "server-only";

import { headers } from "next/headers";
import { cache } from "react";

import { initAuth } from "@repo/auth";

import { env } from "~/env";

export const auth = initAuth({
  secret: env.AUTH_SECRET,
});

export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);
