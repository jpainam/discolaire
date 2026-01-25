import { createEnv } from "@t3-oss/env-nextjs";
export const env = createEnv({
  server: {},
  client: {},
  runtimeEnv: {},
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
