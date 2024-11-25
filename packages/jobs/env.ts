import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MESSAGING_SECRET_KEY: z.string(),
    MESSAGING_SERVICE_URL: z.string(),
    REDIS_URL: z.string().min(1),
    DISCOLAIRE_API_KEY: z.string().min(1),
    AUTH_SECRET: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1).url(),
  },
  runtimeEnv: {
    DISCOLAIRE_API_KEY: process.env.DISCOLAIRE_API_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    MESSAGING_SECRET_KEY: process.env.MESSAGING_SECRET_KEY,
    REDIS_URL: process.env.REDIS_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    MESSAGING_SERVICE_URL: process.env.MESSAGING_SERVICE_URL,
  },
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
