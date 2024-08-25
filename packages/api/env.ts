import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MESSAGING_SERVICE_URL: z.string(),
    MESSAGING_SECRET_KEY: z.string(),
  },
  client: {},
  runtimeEnv: {
    MESSAGING_SERVICE_URL: process.env.MESSAGING_SERVICE_URL,
    MESSAGING_SECRET_KEY: process.env.MESSAGING_SECRET_KEY,
  },
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
