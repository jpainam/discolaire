import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export function authEnv() {
  return createEnv({
    server: {
      AUTH_SECRET:
        process.env.NODE_ENV === "production"
          ? z.string().min(1)
          : z.string().min(1).optional(),
      NODE_ENV: z.enum(["development", "production"]).optional(),
      DISCOLAIRE_API_KEY: z.string().min(1),
      RESEND_API_KEY: z.string().min(1),
      DATABASE_URL: z.string().min(1),
      DEFAULT_TENANT: z.string().min(1).optional(),
    },
    client: {
      NEXT_PUBLIC_BASE_URL: z.url(),
    },
    runtimeEnv: {
      AUTH_SECRET: process.env.AUTH_SECRET,
      DATABASE_URL: process.env.DATABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      DISCOLAIRE_API_KEY: process.env.DISCOLAIRE_API_KEY,
      NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
      DEFAULT_TENANT: process.env.DEFAULT_TENANT,
    },

    skipValidation:
      !!process.env.CI || process.env.npm_lifecycle_event === "lint",
  });
}
