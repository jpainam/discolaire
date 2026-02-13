import { createEnv } from "@t3-oss/env-nextjs";
import { vercel } from "@t3-oss/env-nextjs/presets-zod";
import { z } from "zod/v4";

import { authEnv } from "@repo/auth/env";

export const env = createEnv({
  extends: [authEnv(), vercel()],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  /**
   * Specify your server-side environment variables schema here.
   * This way you can ensure the app isn't built with invalid env vars.
   */
  server: {
    AUTH_SECRET: z.string().min(1),
    DATABASE_URL: z.string(),
    S3_ACCESS_KEY_ID: z.string().min(10),
    S3_REGION: z.string().min(2),
    S3_BUCKET_NAME: z.string().min(2),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_AVATAR_BUCKET_NAME: z.string().min(2),
    S3_IMAGE_BUCKET_NAME: z.string().min(2),
    S3_DOCUMENT_BUCKET_NAME: z.string().min(2),
    WHATSAPP_VERIFY_TOKEN: z.string().min(1),
    WHATSAPP_API_TOKEN: z.string().min(1),
    REDIS_URL: z.string().min(1),
    DISCOLAIRE_API_KEY: z.string().min(1),
    SUPER_ADMIN_USERNAME: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    AI_GATEWAY_API_KEY: z.string().min(1).optional(),
    AI_PROVIDER: z.enum(["openai", "anthropic", "google"]).optional(),
    AI_MODEL: z.string().min(1).optional(),
    AI_SYSTEM_PROMPT: z.string().optional(),
  },

  /**
   * Specify your client-side environment variables schema here.
   * For them to be exposed to the client, prefix them with `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_DEFAULT_TENANT: z.string().min(1).optional(),
    NEXT_PUBLIC_DEPLOYMENT_ENV: z.enum(["local", "cloud"]).default("local"),
    NEXT_PUBLIC_MINIO_URL: z.url(),
    NEXT_PUBLIC_AI_PROVIDER: z
      .enum(["openai", "anthropic", "google"])
      .optional(),
    NEXT_PUBLIC_AI_MODEL: z.string().min(1).optional(),
  },
  /**
   * Destructure all variables from `process.env` to make sure they aren't tree-shaken away.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    AUTH_SECRET: process.env.AUTH_SECRET,
    DISCOLAIRE_API_KEY: process.env.DISCOLAIRE_API_KEY,
    S3_IMAGE_BUCKET_NAME: process.env.S3_IMAGE_BUCKET_NAME,
    S3_DOCUMENT_BUCKET_NAME: process.env.S3_DOCUMENT_BUCKET_NAME,
    NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.NEXT_PUBLIC_DEPLOYMENT_ENV,
    NEXT_PUBLIC_MINIO_URL: process.env.NEXT_PUBLIC_MINIO_URL,
    S3_AVATAR_BUCKET_NAME: process.env.S3_AVATAR_BUCKET_NAME,
    WHATSAPP_VERIFY_TOKEN: process.env.WHATSAPP_VERIFY_TOKEN,
    WHATSAPP_API_TOKEN: process.env.WHATSAPP_API_TOKEN,
    SUPER_ADMIN_USERNAME: process.env.SUPER_ADMIN_USERNAME,
    NEXT_PUBLIC_DEFAULT_TENANT: process.env.NEXT_PUBLIC_DEFAULT_TENANT,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    REDIS_URL: process.env.REDIS_URL,
    AI_GATEWAY_API_KEY: process.env.AI_GATEWAY_API_KEY,
    AI_PROVIDER: process.env.AI_PROVIDER,
    AI_MODEL: process.env.AI_MODEL,
    AI_SYSTEM_PROMPT: process.env.AI_SYSTEM_PROMPT,
    NEXT_PUBLIC_AI_PROVIDER: process.env.NEXT_PUBLIC_AI_PROVIDER,
    NEXT_PUBLIC_AI_MODEL: process.env.NEXT_PUBLIC_AI_MODEL,

    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    // AWS S3
    S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
    S3_REGION: process.env.S3_REGION,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY,
  },
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
