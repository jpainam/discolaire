import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MESSAGING_SECRET_KEY: z.string(),
  },
  client: {
    NEXT_PUBLIC_BASE_URL: z.string().min(1).url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    MESSAGING_SECRET_KEY: process.env.MESSAGING_SECRET_KEY,
  },
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
