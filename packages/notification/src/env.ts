import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).optional(),
    NOVU_API_KEY: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV,
    NOVU_API_KEY: process.env.NOVU_API_KEY,
  },
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
