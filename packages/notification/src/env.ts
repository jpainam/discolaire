import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).optional(),
    NOVU_API_KEY: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    WHATSAPP_API_TOKEN: z.string().min(1),
    WHATSAPP_BUSINESS_PHONE_NUMBER_ID: z.string().min(1),
    DATABASE_URL: z.string().min(1),
  },
  client: {},
  runtimeEnv: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
    WHATSAPP_BUSINESS_PHONE_NUMBER_ID:
      process.env.WHATSAPP_BUSINESS_PHONE_NUMBER_ID,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    NOVU_API_KEY: process.env.NOVU_API_KEY,
  },
  //experimental__runtimeEnv: {},
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
