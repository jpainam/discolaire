import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    REDIS_URL: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    ...process.env,
    REDIS_URL: process.env.REDIS_URL,
  },
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
