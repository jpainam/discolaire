import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "EXPO_PUBLIC_",
  client: {
    EXPO_PUBLIC_SERVER_URL: z.url(),
    EXPO_PUBLIC_TENANT: z.string().min(1).default("public"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
